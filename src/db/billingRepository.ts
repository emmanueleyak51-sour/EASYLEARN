import crypto from 'node:crypto';
import { and, desc, eq, gte, isNull, or } from 'drizzle-orm';
import { db } from './index.ts';
import {
  accessVouchers,
  paymentTransactions,
  premiumSubscriptions,
  systemSecrets,
  trialRegistrations,
} from './schema.ts';
import {
  FREE_TRIAL_DAYS,
  buildCanonicalProPayloadV2,
  buildCanonicalTrialPayloadV1,
  currentEpochDay,
  getPremiumPlanById,
  isValidDeviceId,
  isValidDeviceSecretToken,
  isValidPaystackReference,
  isValidVoucherCodeFormat,
  normalizeVoucherCode,
  sanitizeDeviceId,
  type PremiumPlanId,
} from '../utils/paywallLogic.ts';
import type { UserProgress } from '../types.ts';

export type SignedProReceipt = NonNullable<UserProgress['pro']>;
export type SignedTrialReceipt = NonNullable<UserProgress['trial']>;

const SIGNING_SECRET_KEY_NAME = 'entitlement_hmac_v1';
const ECDSA_KEYPAIR_SECRET_NAME = 'entitlement_ecdsa_p256_v1';
const VOUCHER_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

let cachedSigningSecret: string | null = null;
let cachedEcdsaKeys: {
  privateKey: crypto.KeyObject;
  publicKey: crypto.KeyObject;
  publicKeyJwk: JsonWebKey;
} | null = null;

async function getOrCreateSigningSecret(): Promise<string> {
  const envSecret = process.env.ENTITLEMENT_SIGNING_SECRET?.trim();
  if (envSecret && envSecret.length >= 32) {
    return envSecret;
  }
  if (cachedSigningSecret) {
    return cachedSigningSecret;
  }

  const existing = await db
    .select({ secretValue: systemSecrets.secretValue })
    .from(systemSecrets)
    .where(eq(systemSecrets.keyName, SIGNING_SECRET_KEY_NAME))
    .limit(1);

  if (existing[0]?.secretValue && existing[0].secretValue.length >= 32) {
    cachedSigningSecret = existing[0].secretValue;
    return cachedSigningSecret;
  }

  const generated = crypto.randomBytes(32).toString('hex');
  await db
    .insert(systemSecrets)
    .values({
      keyName: SIGNING_SECRET_KEY_NAME,
      secretValue: generated,
    })
    .onConflictDoNothing({ target: systemSecrets.keyName });

  const finalRows = await db
    .select({ secretValue: systemSecrets.secretValue })
    .from(systemSecrets)
    .where(eq(systemSecrets.keyName, SIGNING_SECRET_KEY_NAME))
    .limit(1);

  const resolved = finalRows[0]?.secretValue || generated;
  cachedSigningSecret = resolved;
  return resolved;
}

function hydrateEcdsaKeyPairFromJson(rawJson: string): {
  privateKey: crypto.KeyObject;
  publicKey: crypto.KeyObject;
  publicKeyJwk: JsonWebKey;
} | null {
  try {
    const parsed = JSON.parse(rawJson) as {
      privateKeyJwk?: crypto.JsonWebKey;
      publicKeyJwk?: crypto.JsonWebKey;
    };
    if (!parsed?.privateKeyJwk || !parsed?.publicKeyJwk) return null;
    const privateKey = crypto.createPrivateKey({ key: parsed.privateKeyJwk, format: 'jwk' });
    const publicKey = crypto.createPublicKey({ key: parsed.publicKeyJwk, format: 'jwk' });
    const publicKeyJwk: JsonWebKey = {
      kty: 'EC',
      crv: 'P-256',
      x: parsed.publicKeyJwk.x,
      y: parsed.publicKeyJwk.y,
    };
    return { privateKey, publicKey, publicKeyJwk };
  } catch {
    return null;
  }
}

async function getOrCreateEntitlementKeyPair(): Promise<{
  privateKey: crypto.KeyObject;
  publicKey: crypto.KeyObject;
  publicKeyJwk: JsonWebKey;
}> {
  if (cachedEcdsaKeys) {
    return cachedEcdsaKeys;
  }

  const existing = await db
    .select({ secretValue: systemSecrets.secretValue })
    .from(systemSecrets)
    .where(eq(systemSecrets.keyName, ECDSA_KEYPAIR_SECRET_NAME))
    .limit(1);

  if (existing[0]?.secretValue) {
    const hydrated = hydrateEcdsaKeyPairFromJson(existing[0].secretValue);
    if (hydrated) {
      cachedEcdsaKeys = hydrated;
      return hydrated;
    }
  }

  const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
    namedCurve: 'prime256v1',
  });
  const privateKeyJwk = privateKey.export({ format: 'jwk' });
  const publicKeyExport = publicKey.export({ format: 'jwk' });
  const serialized = JSON.stringify({
    privateKeyJwk,
    publicKeyJwk: {
      kty: 'EC',
      crv: 'P-256',
      x: publicKeyExport.x,
      y: publicKeyExport.y,
    },
  });

  await db
    .insert(systemSecrets)
    .values({
      keyName: ECDSA_KEYPAIR_SECRET_NAME,
      secretValue: serialized,
    })
    .onConflictDoNothing({ target: systemSecrets.keyName });

  const finalRows = await db
    .select({ secretValue: systemSecrets.secretValue })
    .from(systemSecrets)
    .where(eq(systemSecrets.keyName, ECDSA_KEYPAIR_SECRET_NAME))
    .limit(1);

  const resolved =
    (finalRows[0]?.secretValue ? hydrateEcdsaKeyPairFromJson(finalRows[0].secretValue) : null) ||
    hydrateEcdsaKeyPairFromJson(serialized)!;

  cachedEcdsaKeys = resolved;
  return resolved;
}

export async function getEntitlementPublicKeyJwk(): Promise<JsonWebKey> {
  const { publicKeyJwk } = await getOrCreateEntitlementKeyPair();
  return publicKeyJwk;
}

/**
 * Derives an unguessable server-side device identifier (`DT_<sha256>`) from the secret
 * `X-Device-Token` header so publicly visible support codes (`ABCD-1234`) cannot be used
 * to clone or hijack another student's Premium pass.
 */
export function deriveAuthoritativeDeviceKey(
  rawDeviceToken: unknown,
  fallbackDeviceId?: unknown,
  opts?: { allowLegacyDeviceIdFallback?: boolean }
): { deviceKey: string | null; verifiedBySecretToken: boolean } {
  if (isValidDeviceSecretToken(rawDeviceToken)) {
    const digest = crypto
      .createHash('sha256')
      .update(`eyak-device-v1:${rawDeviceToken.trim().toLowerCase()}`)
      .digest('hex')
      .slice(0, 29)
      .toUpperCase();
    return { deviceKey: `DT_${digest}`, verifiedBySecretToken: true };
  }
  if (opts?.allowLegacyDeviceIdFallback && isValidDeviceId(fallbackDeviceId)) {
    return {
      deviceKey: sanitizeDeviceId(fallbackDeviceId),
      verifiedBySecretToken: false,
    };
  }
  return { deviceKey: null, verifiedBySecretToken: false };
}

function buildLegacyEntitlementPayloadV1(fields: {
  pid: string;
  on: number;
  until: number;
  code: string;
}): string {
  return `eyak-pro-v1:${fields.pid}:${fields.on}:${fields.until}:${fields.code}`;
}

export async function signEntitlementReceipt(fields: {
  pid: string;
  on: number;
  until: number;
  code: string;
  source?: 'voucher' | 'paystack' | 'admin';
  planName?: string;
}): Promise<SignedProReceipt> {
  const { privateKey } = await getOrCreateEntitlementKeyPair();
  const payload = buildCanonicalProPayloadV2(fields);
  const sig = crypto
    .sign('sha256', Buffer.from(payload, 'utf8'), {
      key: privateKey,
      dsaEncoding: 'ieee-p1363',
    })
    .toString('hex');
  const plan = getPremiumPlanById(fields.pid);
  return {
    pid: fields.pid,
    on: Math.floor(fields.on),
    until: Math.floor(fields.until),
    code: fields.code,
    sig,
    source: fields.source,
    planName: fields.planName || plan?.name,
  };
}

export async function signTrialReceipt(startedDay: number): Promise<SignedTrialReceipt> {
  const safeStart = Math.floor(startedDay);
  const untilDay = safeStart + FREE_TRIAL_DAYS - 1;
  const { privateKey } = await getOrCreateEntitlementKeyPair();
  const payload = buildCanonicalTrialPayloadV1({ startedDay: safeStart, untilDay });
  const sig = crypto
    .sign('sha256', Buffer.from(payload, 'utf8'), {
      key: privateKey,
      dsaEncoding: 'ieee-p1363',
    })
    .toString('hex');
  return {
    startedDay: safeStart,
    untilDay,
    sig,
  };
}

/**
 * Records and signs a tamper-proof 3-day post-login starter trial anchored to BOTH
 * the secret-token-verified device (`DT_<sha256>`) and Firebase `uid`.
 * Clearing `localStorage` or creating a second account on the same device always
 * resolves to the earliest `startedDay` recorded for either identifier.
 */
export async function getOrCreateTrialReceipt(params: {
  uid?: string | null;
  deviceToken?: unknown;
  currentDay?: number;
}): Promise<SignedTrialReceipt | null> {
  const curDay = params.currentDay ?? currentEpochDay();
  const cleanUid = typeof params.uid === 'string' && params.uid.trim() ? params.uid.trim() : null;
  const { deviceKey } = deriveAuthoritativeDeviceKey(params.deviceToken, null, {
    allowLegacyDeviceIdFallback: false,
  });

  if (!deviceKey && !cleanUid) return null;

  const matchClause =
    cleanUid && deviceKey
      ? or(eq(trialRegistrations.deviceId, deviceKey), eq(trialRegistrations.uid, cleanUid))
      : deviceKey
        ? eq(trialRegistrations.deviceId, deviceKey)
        : eq(trialRegistrations.uid, cleanUid!);

  const existing = await db
    .select()
    .from(trialRegistrations)
    .where(matchClause)
    .limit(10);

  if (existing.length > 0) {
    const earliestDay = existing.reduce(
      (minDay, row) => Math.min(minDay, row.startedDay),
      existing[0].startedDay
    );
    if (cleanUid && deviceKey) {
      const deviceRow = existing.find((r) => r.deviceId === deviceKey);
      if (deviceRow && !deviceRow.uid) {
        await db
          .update(trialRegistrations)
          .set({
            uid: cleanUid,
            startedDay: Math.min(deviceRow.startedDay, earliestDay),
            updatedAt: new Date(),
          })
          .where(eq(trialRegistrations.id, deviceRow.id));
      } else if (!deviceRow) {
        await db
          .insert(trialRegistrations)
          .values({
            uid: cleanUid,
            deviceId: deviceKey,
            startedDay: earliestDay,
          })
          .onConflictDoNothing({ target: trialRegistrations.deviceId });
      }
    }
    return signTrialReceipt(earliestDay);
  }

  if (deviceKey) {
    await db
      .insert(trialRegistrations)
      .values({
        uid: cleanUid,
        deviceId: deviceKey,
        startedDay: curDay,
      })
      .onConflictDoNothing({ target: trialRegistrations.deviceId });

    const finalRows = await db
      .select()
      .from(trialRegistrations)
      .where(matchClause)
      .limit(5);
    const resolvedDay =
      finalRows.length > 0
        ? finalRows.reduce((m, r) => Math.min(m, r.startedDay), finalRows[0].startedDay)
        : curDay;
    return signTrialReceipt(resolvedDay);
  }

  return signTrialReceipt(curDay);
}

export async function verifyEntitlementReceipt(rawPro: unknown): Promise<SignedProReceipt | null> {
  if (!rawPro || typeof rawPro !== 'object' || Array.isArray(rawPro)) return null;
  const rec = rawPro as Record<string, unknown>;
  const pid = typeof rec.pid === 'string' ? rec.pid.trim().slice(0, 24) : '';
  const code = typeof rec.code === 'string' ? rec.code.trim().slice(0, 80) : '';
  const on = Number(rec.on);
  const until = Number(rec.until);
  const sig = typeof rec.sig === 'string' ? rec.sig.trim().toLowerCase() : '';

  if (
    !pid ||
    !code ||
    !Number.isFinite(on) ||
    !Number.isFinite(until) ||
    (sig.length !== 128 && sig.length !== 64) ||
    !/^[0-9a-f]+$/.test(sig)
  ) {
    return null;
  }

  const normalizedFields = {
    pid,
    on: Math.floor(on),
    until: Math.floor(until),
    code,
  };

  if (sig.length === 128) {
    const { publicKey } = await getOrCreateEntitlementKeyPair();
    const valid = crypto.verify(
      'sha256',
      Buffer.from(buildCanonicalProPayloadV2(normalizedFields), 'utf8'),
      { key: publicKey, dsaEncoding: 'ieee-p1363' },
      Buffer.from(sig, 'hex')
    );
    if (!valid) return null;
  } else {
    const secret = await getOrCreateSigningSecret();
    const expected = crypto
      .createHmac('sha256', secret)
      .update(buildLegacyEntitlementPayloadV1(normalizedFields))
      .digest('hex');
    const expectedBuf = Buffer.from(expected, 'utf8');
    const actualBuf = Buffer.from(sig, 'utf8');
    if (expectedBuf.length !== actualBuf.length || !crypto.timingSafeEqual(expectedBuf, actualBuf)) {
      return null;
    }
  }

  const source =
    rec.source === 'voucher' || rec.source === 'paystack' || rec.source === 'admin'
      ? rec.source
      : undefined;
  const plan = getPremiumPlanById(pid);

  // Always emit an upgraded v2 ECDSA receipt when verified
  if (sig.length === 64) {
    return signEntitlementReceipt({
      ...normalizedFields,
      source,
      planName:
        typeof rec.planName === 'string' && rec.planName.trim()
          ? rec.planName.trim().slice(0, 48)
          : plan?.name,
    });
  }

  return {
    ...normalizedFields,
    sig,
    source,
    planName:
      typeof rec.planName === 'string' && rec.planName.trim()
        ? rec.planName.trim().slice(0, 48)
        : plan?.name,
  };
}

export async function getActiveSubscriptionReceipt(params: {
  uid?: string | null;
  deviceToken?: unknown;
  deviceId?: string | null;
  email?: string | null;
  currentDay?: number;
}): Promise<SignedProReceipt | null> {
  const curDay = params.currentDay ?? currentEpochDay();
  const cleanUid = typeof params.uid === 'string' && params.uid.trim() ? params.uid.trim() : null;
  // Never allow bare display Device IDs (`?deviceId=ABCD1234`) to fetch or hijack subscriptions
  const { deviceKey: cleanDevice, verifiedBySecretToken } = deriveAuthoritativeDeviceKey(
    params.deviceToken,
    params.deviceId,
    { allowLegacyDeviceIdFallback: false }
  );

  if (!cleanUid && !cleanDevice) return null;

  // Enforce strict UID ownership:
  // - If signed in (`cleanUid`), match subscriptions owned by `cleanUid`, OR unbound (`uid IS NULL`)
  //   subscriptions created on this exact secret-token-verified device. Never leak another user's UID-bound pass.
  // - If signed out (`!cleanUid`), require secret `X-Device-Token` match (`verifiedBySecretToken === true`).
  const ownerMatch =
    cleanUid && cleanDevice && verifiedBySecretToken
      ? or(
          eq(premiumSubscriptions.uid, cleanUid),
          and(
            isNull(premiumSubscriptions.uid),
            eq(premiumSubscriptions.deviceId, cleanDevice)
          )
        )
      : cleanUid
        ? eq(premiumSubscriptions.uid, cleanUid)
        : eq(premiumSubscriptions.deviceId, cleanDevice!);

  const rows = await db
    .select()
    .from(premiumSubscriptions)
    .where(and(ownerMatch, gte(premiumSubscriptions.untilDay, curDay)))
    .orderBy(desc(premiumSubscriptions.untilDay), desc(premiumSubscriptions.id))
    .limit(1);

  const active = rows[0];
  if (!active) return null;

  // Double-check UID isolation: if bound to a different Google account, deny
  if (active.uid && cleanUid && active.uid !== cleanUid) {
    return null;
  }

  const source =
    active.source === 'voucher' || active.source === 'paystack' || active.source === 'admin'
      ? active.source
      : 'voucher';

  return signEntitlementReceipt({
    pid: active.planId,
    on: active.startsDay,
    until: active.untilDay,
    code: active.reference,
    source,
  });
}

export class BillingUserError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = 'BillingUserError';
    this.statusCode = statusCode;
  }
}

export async function redeemAccessVoucher(params: {
  rawCode: unknown;
  deviceToken?: unknown;
  deviceId?: unknown;
  uid?: string | null;
  email?: string | null;
  currentDay?: number;
}): Promise<{
  pro: SignedProReceipt;
  planName: string;
  daysAdded: number;
  untilDay: number;
  alreadyRedeemedByCaller: boolean;
}> {
  if (!isValidVoucherCodeFormat(params.rawCode)) {
    throw new BillingUserError('Enter a valid Pass PIN (for example EYAK-ABCD-2345).', 400);
  }
  const { deviceKey, verifiedBySecretToken } = deriveAuthoritativeDeviceKey(
    params.deviceToken,
    params.deviceId,
    { allowLegacyDeviceIdFallback: false }
  );
  if (!deviceKey) {
    throw new BillingUserError('Secure device session token is required. Refresh and try again.', 400);
  }

  const code = normalizeVoucherCode(params.rawCode);
  const deviceId = deviceKey;
  const cleanUid = typeof params.uid === 'string' && params.uid.trim() ? params.uid.trim() : null;
  const cleanEmail =
    typeof params.email === 'string' && params.email.trim()
      ? params.email.trim().toLowerCase().slice(0, 254)
      : '';
  const curDay = params.currentDay ?? currentEpochDay();

  const txResult = await db.transaction(async (tx) => {
    const voucherRows = await tx
      .select()
      .from(accessVouchers)
      .where(eq(accessVouchers.code, code))
      .limit(1);

    const voucher = voucherRows[0];
    if (!voucher) {
      throw new BillingUserError(
        'Pass PIN not found. Check every character and try again.',
        404
      );
    }
    if (voucher.revoked) {
      throw new BillingUserError('This Pass PIN has been deactivated.', 403);
    }

    const plan = getPremiumPlanById(voucher.planId);
    const planName = plan?.name || 'Premium pass';

    // Check if already redeemed
    if (voucher.redeemedAt) {
      const sameUid = Boolean(cleanUid && voucher.redeemedByUid && voucher.redeemedByUid === cleanUid);
      const sameDevice = Boolean(
        voucher.redeemedByDeviceId && voucher.redeemedByDeviceId === deviceId
      );
      if (!sameUid && !sameDevice) {
        throw new BillingUserError(
          'This Pass PIN has already been used on another phone or account.',
          409
        );
      }

      // Idempotent recovery: return the caller's existing subscription for this PIN if still active
      const existingSubRows = await tx
        .select()
        .from(premiumSubscriptions)
        .where(eq(premiumSubscriptions.reference, code))
        .orderBy(desc(premiumSubscriptions.untilDay))
        .limit(1);

      const sub = existingSubRows[0];
      if (!sub || sub.untilDay < curDay) {
        throw new BillingUserError('This Pass PIN has already expired.', 410);
      }
      if (cleanUid && !sub.uid && verifiedBySecretToken && sub.deviceId === deviceId) {
        await tx
          .update(premiumSubscriptions)
          .set({ uid: cleanUid, email: sub.email || cleanEmail, updatedAt: new Date() })
          .where(eq(premiumSubscriptions.id, sub.id));
      }
      return {
        planId: sub.planId,
        planName,
        startsDay: sub.startsDay,
        untilDay: sub.untilDay,
        daysAdded: 0,
        reference: code,
        alreadyRedeemedByCaller: true,
      };
    }

    // Find current active subscription to stack days cleanly if renewing early (never stack onto another user's UID)
    const ownerMatch = cleanUid
      ? or(
          eq(premiumSubscriptions.uid, cleanUid),
          and(
            isNull(premiumSubscriptions.uid),
            eq(premiumSubscriptions.deviceId, deviceId)
          )
        )
      : eq(premiumSubscriptions.deviceId, deviceId);

    const activeSubs = await tx
      .select()
      .from(premiumSubscriptions)
      .where(and(ownerMatch, gte(premiumSubscriptions.untilDay, curDay)))
      .orderBy(desc(premiumSubscriptions.untilDay))
      .limit(1);

    const baseDay = activeSubs[0] ? Math.max(curDay, activeSubs[0].untilDay) : curDay;
    const daysToAdd = Math.max(1, Math.min(36500, voucher.days));
    const untilDay = baseDay + daysToAdd;
    const now = new Date();

    await tx
      .update(accessVouchers)
      .set({
        redeemedByUid: cleanUid,
        redeemedByDeviceId: deviceId,
        redeemedAt: now,
      })
      .where(eq(accessVouchers.code, code));

    await tx.insert(premiumSubscriptions).values({
      uid: cleanUid,
      deviceId,
      email: cleanEmail,
      planId: voucher.planId,
      source: 'voucher',
      reference: code,
      startsDay: curDay,
      untilDay,
      createdAt: now,
      updatedAt: now,
    });

    return {
      planId: voucher.planId,
      planName,
      startsDay: curDay,
      untilDay,
      daysAdded: daysToAdd,
      reference: code,
      alreadyRedeemedByCaller: false,
    };
  });

  const pro = await signEntitlementReceipt({
    pid: txResult.planId,
    on: txResult.startsDay,
    until: txResult.untilDay,
    code: txResult.reference,
    source: 'voucher',
    planName: txResult.planName,
  });

  return {
    pro,
    planName: txResult.planName,
    daysAdded: txResult.daysAdded,
    untilDay: txResult.untilDay,
    alreadyRedeemedByCaller: txResult.alreadyRedeemedByCaller,
  };
}

export async function createPendingPaystackTransaction(params: {
  reference: string;
  planId: PremiumPlanId;
  amountKobo: number;
  email: string;
  uid?: string | null;
  deviceToken?: unknown;
  deviceId?: string;
}) {
  const { deviceKey } = deriveAuthoritativeDeviceKey(params.deviceToken, params.deviceId, {
    allowLegacyDeviceIdFallback: false,
  });
  if (!deviceKey) {
    throw new BillingUserError('Secure device session token is required.', 400);
  }
  const safeEmail = params.email.trim().toLowerCase().slice(0, 254);
  const cleanUid = typeof params.uid === 'string' && params.uid.trim() ? params.uid.trim() : null;

  await db
    .insert(paymentTransactions)
    .values({
      reference: params.reference,
      planId: params.planId,
      amountKobo: params.amountKobo,
      currency: 'NGN',
      email: safeEmail,
      uid: cleanUid,
      deviceId: deviceKey,
      status: 'pending',
    })
    .onConflictDoNothing({ target: paymentTransactions.reference });
}

export async function completeVerifiedPaystackTransaction(params: {
  reference: string;
  verifiedPlanId?: PremiumPlanId | null;
  paidAmountKobo: number;
  currency: string;
  customerEmail: string;
  deviceToken?: unknown;
  deviceId?: string;
  uid?: string | null;
  currentDay?: number;
}): Promise<{
  pro: SignedProReceipt;
  planName: string;
  untilDay: number;
}> {
  if (!isValidPaystackReference(params.reference)) {
    throw new BillingUserError('Invalid payment reference.', 400);
  }
  const { deviceKey } = deriveAuthoritativeDeviceKey(params.deviceToken, params.deviceId, {
    allowLegacyDeviceIdFallback: false,
  });
  if (!deviceKey) {
    throw new BillingUserError('Secure device session token is required.', 400);
  }
  const ref = params.reference.trim();
  const deviceId = deviceKey;
  const cleanUid = typeof params.uid === 'string' && params.uid.trim() ? params.uid.trim() : null;
  const cleanEmail = params.customerEmail.trim().toLowerCase().slice(0, 254);
  const curDay = params.currentDay ?? currentEpochDay();

  const txOutcome = await db.transaction(async (tx) => {
    const txRows = await tx
      .select()
      .from(paymentTransactions)
      .where(eq(paymentTransactions.reference, ref))
      .limit(1);

    const recorded = txRows[0];
    const resolvedPlan =
      getPremiumPlanById(recorded?.planId) || getPremiumPlanById(params.verifiedPlanId) || null;

    if (!resolvedPlan) {
      throw new BillingUserError('Could not match payment to a valid EYAK Premium plan.', 400);
    }

    if (params.currency.toUpperCase() !== 'NGN') {
      throw new BillingUserError('Payment currency must be NGN.', 400);
    }
    if (params.paidAmountKobo < resolvedPlan.priceKobo) {
      throw new BillingUserError('Paid amount is less than the selected plan price.', 400);
    }

    // Prevent replay across different devices/users if already verified
    if (recorded?.status === 'verified') {
      const sameCaller =
        recorded.deviceId === deviceId || Boolean(cleanUid && recorded.uid === cleanUid);
      if (!sameCaller) {
        throw new BillingUserError('This payment reference has already been redeemed.', 409);
      }
      const subRows = await tx
        .select()
        .from(premiumSubscriptions)
        .where(eq(premiumSubscriptions.reference, ref))
        .orderBy(desc(premiumSubscriptions.untilDay))
        .limit(1);
      if (subRows[0]) {
        return {
          planId: subRows[0].planId,
          planName: resolvedPlan.name,
          startsDay: subRows[0].startsDay,
          untilDay: subRows[0].untilDay,
        };
      }
    }

    const now = new Date();
    if (recorded) {
      await tx
        .update(paymentTransactions)
        .set({
          status: 'verified',
          verifiedAt: now,
          uid: recorded.uid || cleanUid,
        })
        .where(eq(paymentTransactions.reference, ref));
    } else {
      await tx.insert(paymentTransactions).values({
        reference: ref,
        planId: resolvedPlan.id,
        amountKobo: params.paidAmountKobo,
        currency: 'NGN',
        email: cleanEmail,
        uid: cleanUid,
        deviceId,
        status: 'verified',
        verifiedAt: now,
      });
    }

    const ownerMatch = cleanUid
      ? or(
          eq(premiumSubscriptions.uid, cleanUid),
          and(
            isNull(premiumSubscriptions.uid),
            eq(premiumSubscriptions.deviceId, deviceId)
          )
        )
      : eq(premiumSubscriptions.deviceId, deviceId);

    const activeSubs = await tx
      .select()
      .from(premiumSubscriptions)
      .where(and(ownerMatch, gte(premiumSubscriptions.untilDay, curDay)))
      .orderBy(desc(premiumSubscriptions.untilDay))
      .limit(1);

    const baseDay = activeSubs[0] ? Math.max(curDay, activeSubs[0].untilDay) : curDay;
    const untilDay = baseDay + resolvedPlan.days;

    await tx.insert(premiumSubscriptions).values({
      uid: cleanUid,
      deviceId,
      email: cleanEmail,
      planId: resolvedPlan.id,
      source: 'paystack',
      reference: ref,
      startsDay: curDay,
      untilDay,
      createdAt: now,
      updatedAt: now,
    });

    return {
      planId: resolvedPlan.id,
      planName: resolvedPlan.name,
      startsDay: curDay,
      untilDay,
    };
  });

  const pro = await signEntitlementReceipt({
    pid: txOutcome.planId,
    on: txOutcome.startsDay,
    until: txOutcome.untilDay,
    code: ref,
    source: 'paystack',
    planName: txOutcome.planName,
  });

  return {
    pro,
    planName: txOutcome.planName,
    untilDay: txOutcome.untilDay,
  };
}

function generateSingleRandomVoucherCode(): string {
  const seg = (len: number) => {
    let out = '';
    for (let i = 0; i < len; i++) {
      out += VOUCHER_ALPHABET[crypto.randomInt(0, VOUCHER_ALPHABET.length)];
    }
    return out;
  };
  return `EYAK-${seg(4)}-${seg(4)}`;
}

export async function createAdminVoucherBatch(params: {
  planId: string;
  count: number;
  note?: string;
  adminEmail: string;
}) {
  const plan = getPremiumPlanById(params.planId);
  if (!plan) {
    throw new BillingUserError(
      'Choose a valid plan (Monthly, 6-Month, Yearly, or Lifetime).',
      400
    );
  }
  const safeCount = Math.max(1, Math.min(25, Math.floor(Number(params.count) || 1)));
  const safeNote =
    typeof params.note === 'string'
      ? params.note.replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, 120)
      : '';
  const safeAdmin = params.adminEmail.trim().toLowerCase().slice(0, 254);

  const createdCodes: string[] = [];
  let attempts = 0;
  while (createdCodes.length < safeCount && attempts < safeCount * 4) {
    attempts++;
    const code = generateSingleRandomVoucherCode();
    const inserted = await db
      .insert(accessVouchers)
      .values({
        code,
        planId: plan.id,
        days: plan.days,
        priceNgn: plan.priceNgn,
        note: safeNote,
        createdByEmail: safeAdmin,
      })
      .onConflictDoNothing({ target: accessVouchers.code })
      .returning({ code: accessVouchers.code });

    if (inserted[0]?.code) {
      createdCodes.push(inserted[0].code);
    }
  }

  return {
    planId: plan.id,
    planName: plan.name,
    days: plan.days,
    priceNgn: plan.priceNgn,
    codes: createdCodes,
  };
}

export async function getAdminBillingOverview() {
  const curDay = currentEpochDay();
  const [recentVouchers, activeSubs] = await Promise.all([
    db
      .select({
        code: accessVouchers.code,
        planId: accessVouchers.planId,
        days: accessVouchers.days,
        priceNgn: accessVouchers.priceNgn,
        note: accessVouchers.note,
        redeemedByDeviceId: accessVouchers.redeemedByDeviceId,
        redeemedAt: accessVouchers.redeemedAt,
        revoked: accessVouchers.revoked,
        createdAt: accessVouchers.createdAt,
      })
      .from(accessVouchers)
      .orderBy(desc(accessVouchers.createdAt))
      .limit(50),
    db
      .select({
        id: premiumSubscriptions.id,
        email: premiumSubscriptions.email,
        deviceId: premiumSubscriptions.deviceId,
        planId: premiumSubscriptions.planId,
        source: premiumSubscriptions.source,
        reference: premiumSubscriptions.reference,
        untilDay: premiumSubscriptions.untilDay,
        createdAt: premiumSubscriptions.createdAt,
      })
      .from(premiumSubscriptions)
      .where(gte(premiumSubscriptions.untilDay, curDay))
      .orderBy(desc(premiumSubscriptions.createdAt))
      .limit(40),
  ]);

  const unredeemedCount = recentVouchers.filter((v) => !v.redeemedAt && !v.revoked).length;
  const redeemedCount = recentVouchers.filter((v) => Boolean(v.redeemedAt)).length;

  return {
    activeSubscriptionsCount: activeSubs.length,
    recentUnredeemedCount: unredeemedCount,
    recentRedeemedCount: redeemedCount,
    vouchers: recentVouchers.map((v) => ({
      ...v,
      redeemedAtIso: v.redeemedAt instanceof Date ? v.redeemedAt.toISOString() : null,
      createdAtIso: v.createdAt instanceof Date ? v.createdAt.toISOString() : null,
    })),
    activeSubscriptions: activeSubs.map((s) => ({
      ...s,
      daysLeft: Math.max(0, s.untilDay - curDay),
      createdAtIso: s.createdAt instanceof Date ? s.createdAt.toISOString() : null,
    })),
  };
}
