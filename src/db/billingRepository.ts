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
  FREE_TRIAL_DURATION_MS,
  buildCanonicalProPayloadV2,
  buildCanonicalTrialPayloadV1,
  currentEpochDay,
  getPremiumPlanById,
  isConfiguredPaystackSecretKey,
  isValidDeviceId,
  isValidDeviceSecretToken,
  isValidEmailAddress,
  isValidPaystackReference,
  isValidVoucherCodeFormat,
  looksLikeRawCardNumber,
  normalizeVoucherCode,
  parseScholarEmailList,
  sanitizeDeviceId,
  type PremiumPlanId,
  type SubscriptionAutoRenewInfo,
  type TrialLinkInfo,
  type TrialPaymentMethod,
} from '../utils/paywallLogic.ts';
import type { UserProgress } from '../types.ts';

export type SignedProReceipt = NonNullable<UserProgress['pro']>;
export type SignedTrialReceipt = NonNullable<UserProgress['trial']>;

const SIGNING_SECRET_KEY_NAME = 'entitlement_hmac_v1';
const ECDSA_KEYPAIR_SECRET_NAME = 'entitlement_ecdsa_p256_v1';

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

export async function signTrialReceipt(
  startedDay: number,
  startedAtMs?: number
): Promise<SignedTrialReceipt> {
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
  const resolvedStartMs =
    typeof startedAtMs === 'number' && Number.isFinite(startedAtMs) && startedAtMs > 0
      ? Math.floor(startedAtMs)
      : Date.now();
  return {
    startedDay: safeStart,
    untilDay,
    startedAtMs: resolvedStartMs,
    endsAtMs: resolvedStartMs + FREE_TRIAL_DURATION_MS,
    sig,
  };
}

/**
 * Records and signs a tamper-proof 1-day (24-hour) post-login free trial anchored to BOTH
 * the secret-token-verified device (`DT_<sha256>`) and Firebase `uid`.
 * Clearing `localStorage` or creating a second account on the same device always
 * resolves to the earliest `startedDay` / `createdAt` recorded for either identifier.
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
    const earliestCreatedMs = existing.reduce((minMs, row) => {
      const ts = row.createdAt instanceof Date ? row.createdAt.getTime() : Date.now();
      return Math.min(minMs, ts);
    }, Date.now());

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
    return signTrialReceipt(earliestDay, earliestCreatedMs);
  }

  if (deviceKey) {
    const nowMs = Date.now();
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
    const resolvedMs =
      finalRows.length > 0
        ? finalRows.reduce((m, r) => {
            const ts = r.createdAt instanceof Date ? r.createdAt.getTime() : nowMs;
            return Math.min(m, ts);
          }, nowMs)
        : nowMs;
    return signTrialReceipt(resolvedDay, resolvedMs);
  }

  return signTrialReceipt(curDay, Date.now());
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
  verifiedEmail?: string | null;
  currentDay?: number;
}): Promise<SignedProReceipt | null> {
  const curDay = params.currentDay ?? currentEpochDay();
  const cleanUid = typeof params.uid === 'string' && params.uid.trim() ? params.uid.trim() : null;
  const cleanVerifiedEmail =
    typeof params.verifiedEmail === 'string' && isValidEmailAddress(params.verifiedEmail)
      ? params.verifiedEmail.trim().toLowerCase()
      : null;

  // Never allow bare display Device IDs (`?deviceId=ABCD1234`) to fetch or hijack subscriptions
  const { deviceKey: cleanDevice, verifiedBySecretToken } = deriveAuthoritativeDeviceKey(
    params.deviceToken,
    params.deviceId,
    { allowLegacyDeviceIdFallback: false }
  );

  if (!cleanUid && !cleanDevice && !cleanVerifiedEmail) return null;

  // Enforce strict ownership across UID, secret-token-verified Device, and verified Email (for Paystack parent/school seat sponsorships):
  const clauses = [];
  if (cleanUid) {
    clauses.push(eq(premiumSubscriptions.uid, cleanUid));
  }
  if (cleanDevice && verifiedBySecretToken) {
    clauses.push(
      cleanUid
        ? and(isNull(premiumSubscriptions.uid), eq(premiumSubscriptions.deviceId, cleanDevice))
        : eq(premiumSubscriptions.deviceId, cleanDevice)
    );
  }
  if (cleanVerifiedEmail) {
    clauses.push(
      and(isNull(premiumSubscriptions.uid), eq(premiumSubscriptions.email, cleanVerifiedEmail))
    );
  }
  if (clauses.length === 0) return null;

  const ownerMatch = clauses.length === 1 ? clauses[0]! : or(...clauses)!;

  const rows = await db
    .select()
    .from(premiumSubscriptions)
    .where(and(ownerMatch, gte(premiumSubscriptions.untilDay, curDay)))
    .orderBy(desc(premiumSubscriptions.untilDay), desc(premiumSubscriptions.id))
    .limit(1);

  const active = rows[0];
  if (!active) return null;

  // Double-check UID isolation: if bound to a different Google/Firebase account, deny
  if (active.uid && cleanUid && active.uid !== cleanUid) {
    return null;
  }

  // Bind unbound Paystack email/device subscription to the scholar's UID on first verified sign-in
  if (!active.uid && cleanUid) {
    const canBind =
      (cleanVerifiedEmail && active.email === cleanVerifiedEmail) ||
      (verifiedBySecretToken && cleanDevice && active.deviceId === cleanDevice);
    if (canBind) {
      await db
        .update(premiumSubscriptions)
        .set({
          uid: cleanUid,
          email: active.email || cleanVerifiedEmail || '',
          updatedAt: new Date(),
        })
        .where(eq(premiumSubscriptions.id, active.id));
    }
  }

  const source =
    active.source === 'voucher' || active.source === 'paystack' || active.source === 'admin'
      ? active.source
      : 'paystack';

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

export async function createPendingPaystackTransaction(params: {
  reference: string;
  planId: PremiumPlanId;
  amountKobo: number;
  email: string;
  uid?: string | null;
  deviceToken?: unknown;
  deviceId?: string;
  systemDeviceKey?: string;
}) {
  const { deviceKey: derivedKey } = deriveAuthoritativeDeviceKey(
    params.deviceToken,
    params.deviceId,
    { allowLegacyDeviceIdFallback: false }
  );
  const resolvedDeviceKey = derivedKey || params.systemDeviceKey || null;
  if (!resolvedDeviceKey) {
    throw new BillingUserError('Secure device session token is required.', 400);
  }
  const safeEmail = params.email.trim().toLowerCase().slice(0, 8000);
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
      deviceId: resolvedDeviceKey,
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
  allowServerWebhook?: boolean;
  currentDay?: number;
}): Promise<{
  pro: SignedProReceipt;
  planName: string;
  untilDay: number;
  activatedCount: number;
}> {
  if (!isValidPaystackReference(params.reference)) {
    throw new BillingUserError('Invalid payment reference.', 400);
  }
  const { deviceKey: callerDeviceKey } = deriveAuthoritativeDeviceKey(
    params.deviceToken,
    params.deviceId,
    { allowLegacyDeviceIdFallback: false }
  );
  const ref = params.reference.trim();
  const cleanUid = typeof params.uid === 'string' && params.uid.trim() ? params.uid.trim() : null;
  const cleanCustomerEmail = params.customerEmail.trim().toLowerCase().slice(0, 254);
  const curDay = params.currentDay ?? currentEpochDay();

  const txOutcome = await db.transaction(async (tx) => {
    const txRows = await tx
      .select()
      .from(paymentTransactions)
      .where(eq(paymentTransactions.reference, ref))
      .limit(1);

    const recorded = txRows[0];
    const isSponsorTx = recorded?.deviceId === 'PAYSTACK_SPONSOR';
    const effectiveDeviceId =
      callerDeviceKey ||
      (isSponsorTx ? 'PAYSTACK_SPONSOR' : null) ||
      (params.allowServerWebhook ? recorded?.deviceId || 'PAYSTACK_WEBHOOK' : null);

    if (!effectiveDeviceId) {
      throw new BillingUserError('Secure device session token is required.', 400);
    }

    const resolvedPlan =
      getPremiumPlanById(recorded?.planId) || getPremiumPlanById(params.verifiedPlanId) || null;

    if (!resolvedPlan) {
      throw new BillingUserError('Could not match payment to a valid Easy Learn Premium plan.', 400);
    }

    if (params.currency.toUpperCase() !== 'NGN') {
      throw new BillingUserError('Payment currency must be NGN.', 400);
    }
    const expectedAmountKobo = recorded?.amountKobo ?? resolvedPlan.priceKobo;
    if (params.paidAmountKobo < expectedAmountKobo) {
      throw new BillingUserError('Paid amount is less than the expected checkout total.', 400);
    }

    const parsedRecipientList = parseScholarEmailList(recorded?.email || cleanCustomerEmail, 200);
    const recipientEmails =
      parsedRecipientList.emails.length > 0
        ? parsedRecipientList.emails
        : [cleanCustomerEmail || 'student@eyak.ng'];

    // Prevent replay across different devices/users if already verified
    if (recorded?.status === 'verified') {
      const sameCaller =
        params.allowServerWebhook ||
        isSponsorTx ||
        recorded.deviceId === effectiveDeviceId ||
        Boolean(cleanUid && recorded.uid === cleanUid);
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
          activatedCount: recipientEmails.length,
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
          uid: recorded.uid || (isSponsorTx ? null : cleanUid),
        })
        .where(eq(paymentTransactions.reference, ref));
    } else {
      await tx.insert(paymentTransactions).values({
        reference: ref,
        planId: resolvedPlan.id,
        amountKobo: params.paidAmountKobo,
        currency: 'NGN',
        email: cleanCustomerEmail,
        uid: cleanUid,
        deviceId: effectiveDeviceId,
        status: 'verified',
        verifiedAt: now,
      });
    }

    if (isSponsorTx || recipientEmails.length > 1) {
      let lastUntilDay = curDay + resolvedPlan.days;
      for (const targetEmail of recipientEmails) {
        const existingEmailSubs = await tx
          .select()
          .from(premiumSubscriptions)
          .where(
            and(
              eq(premiumSubscriptions.email, targetEmail),
              gte(premiumSubscriptions.untilDay, curDay)
            )
          )
          .orderBy(desc(premiumSubscriptions.untilDay))
          .limit(1);

        const baseDay = existingEmailSubs[0]
          ? Math.max(curDay, existingEmailSubs[0].untilDay)
          : curDay;
        const untilDay = baseDay + resolvedPlan.days;
        lastUntilDay = untilDay;

        await tx.insert(premiumSubscriptions).values({
          uid: existingEmailSubs[0]?.uid || null,
          deviceId: 'PAYSTACK_SPONSOR',
          email: targetEmail,
          planId: resolvedPlan.id,
          source: 'paystack',
          reference: ref,
          startsDay: curDay,
          untilDay,
          createdAt: now,
          updatedAt: now,
        });
      }

      return {
        planId: resolvedPlan.id,
        planName: resolvedPlan.name,
        startsDay: curDay,
        untilDay: lastUntilDay,
        activatedCount: recipientEmails.length,
      };
    }

    const singleEmail = recipientEmails[0] || cleanCustomerEmail;
    const targetUid = recorded?.uid || cleanUid;
    const ownerMatch = targetUid
      ? or(
          eq(premiumSubscriptions.uid, targetUid),
          and(
            isNull(premiumSubscriptions.uid),
            eq(premiumSubscriptions.deviceId, effectiveDeviceId)
          )
        )
      : eq(premiumSubscriptions.deviceId, effectiveDeviceId);

    const activeSubs = await tx
      .select()
      .from(premiumSubscriptions)
      .where(and(ownerMatch, gte(premiumSubscriptions.untilDay, curDay)))
      .orderBy(desc(premiumSubscriptions.untilDay))
      .limit(1);

    const baseDay = activeSubs[0] ? Math.max(curDay, activeSubs[0].untilDay) : curDay;
    const untilDay = baseDay + resolvedPlan.days;

    await tx.insert(premiumSubscriptions).values({
      uid: targetUid,
      deviceId: effectiveDeviceId,
      email: singleEmail,
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
      activatedCount: 1,
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

  const activatedPlan = getPremiumPlanById(txOutcome.planId);
  if (activatedPlan && (params.uid || params.deviceToken)) {
    const nextBillingAtIso = activatedPlan.isRecurring
      ? new Date(Date.now() + activatedPlan.days * 86_400_000).toISOString()
      : null;
    await upsertSubscriptionAutoRenewState({
      uid: params.uid,
      deviceToken: params.deviceToken,
      planId: activatedPlan.id,
      isRecurring: activatedPlan.isRecurring,
      autoRenew: activatedPlan.isRecurring,
      status: activatedPlan.isRecurring ? 'active' : 'one_time',
      nextBillingAtIso,
      cancelledAtIso: null,
    }).catch(() => {
      /* non-fatal auto-renew metadata write */
    });
  }

  return {
    pro,
    planName: txOutcome.planName,
    untilDay: txOutcome.untilDay,
    activatedCount: txOutcome.activatedCount,
  };
}

export async function getAdminBillingOverview() {
  const curDay = currentEpochDay();
  const [recentTransactions, activeSubs] = await Promise.all([
    db
      .select({
        reference: paymentTransactions.reference,
        planId: paymentTransactions.planId,
        amountKobo: paymentTransactions.amountKobo,
        currency: paymentTransactions.currency,
        email: paymentTransactions.email,
        status: paymentTransactions.status,
        verifiedAt: paymentTransactions.verifiedAt,
        createdAt: paymentTransactions.createdAt,
      })
      .from(paymentTransactions)
      .orderBy(desc(paymentTransactions.createdAt))
      .limit(40),
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

  const verifiedTxs = recentTransactions.filter((t) => t.status === 'verified');
  const totalVerifiedRevenueNgn = verifiedTxs.reduce(
    (sum, t) => sum + Math.round((t.amountKobo || 0) / 100),
    0
  );

  return {
    paystackConfigured: isConfiguredPaystackSecretKey(process.env.PAYSTACK_SECRET_KEY),
    activeSubscriptionsCount: activeSubs.length,
    verifiedTransactionsCount: verifiedTxs.length,
    totalVerifiedRevenueNgn,
    recentTransactions: recentTransactions.map((t) => {
      const parsedEmails = parseScholarEmailList(t.email, 200);
      return {
        reference: t.reference,
        planId: t.planId,
        amountNgn: Math.round((t.amountKobo || 0) / 100),
        emailSummary:
          parsedEmails.emails.length > 1
            ? `${parsedEmails.emails[0]} + ${parsedEmails.emails.length - 1} more`
            : t.email,
        seatCount: Math.max(1, parsedEmails.emails.length),
        status: t.status,
        verifiedAtIso: t.verifiedAt instanceof Date ? t.verifiedAt.toISOString() : null,
        createdAtIso: t.createdAt instanceof Date ? t.createdAt.toISOString() : null,
      };
    }),
    activeSubscriptions: activeSubs.map((s) => ({
      ...s,
      daysLeft: Math.max(0, s.untilDay - curDay),
      createdAtIso: s.createdAt instanceof Date ? s.createdAt.toISOString() : null,
    })),
  };
}

const PASS_PIN_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generateCryptographicPassPin(): string {
  const bytes = crypto.randomBytes(8);
  let part1 = '';
  let part2 = '';
  for (let i = 0; i < 4; i += 1) {
    part1 += PASS_PIN_ALPHABET[bytes[i] % PASS_PIN_ALPHABET.length];
    part2 += PASS_PIN_ALPHABET[bytes[i + 4] % PASS_PIN_ALPHABET.length];
  }
  return `ELRN-${part1}-${part2}`;
}

export interface OwnerPassPinRecord {
  code: string;
  planId: string;
  planName: string;
  days: number;
  priceNgn: number;
  note: string;
  status: 'available' | 'redeemed' | 'revoked';
  createdByEmail: string;
  createdAtIso: string | null;
  redeemedAtIso: string | null;
}

export async function createOwnerPassPins(params: {
  planId: string;
  count: number;
  note?: string;
  createdByEmail: string;
}): Promise<OwnerPassPinRecord[]> {
  const plan = getPremiumPlanById(params.planId);
  if (!plan) {
    throw new BillingUserError('Choose a valid Easy Learn pass plan.', 400);
  }
  const safeCount = Math.max(1, Math.min(50, Math.floor(Number(params.count) || 1)));
  const safeNote = String(params.note || '').trim().slice(0, 120);
  const safeCreator = String(params.createdByEmail || '').trim().toLowerCase().slice(0, 160);
  if (!safeCreator) {
    throw new BillingUserError('Verified owner email is required to issue Pass PINs.', 403);
  }

  const created: OwnerPassPinRecord[] = [];
  const now = new Date();

  for (let i = 0; i < safeCount; i += 1) {
    let insertedCode: string | null = null;
    for (let attempt = 0; attempt < 6; attempt += 1) {
      const candidate = generateCryptographicPassPin();
      const rows = await db
        .insert(accessVouchers)
        .values({
          code: candidate,
          planId: plan.id,
          days: plan.days,
          priceNgn: plan.priceNgn,
          note: safeNote,
          createdByEmail: safeCreator,
          revoked: false,
          createdAt: now,
        })
        .onConflictDoNothing({ target: accessVouchers.code })
        .returning({ code: accessVouchers.code });

      if (rows[0]?.code) {
        insertedCode = rows[0].code;
        break;
      }
    }
    if (!insertedCode) {
      throw new BillingUserError('Could not generate a unique Pass PIN. Please retry.', 500);
    }
    created.push({
      code: insertedCode,
      planId: plan.id,
      planName: plan.name,
      days: plan.days,
      priceNgn: plan.priceNgn,
      note: safeNote,
      status: 'available',
      createdByEmail: safeCreator,
      createdAtIso: now.toISOString(),
      redeemedAtIso: null,
    });
  }

  return created;
}

export async function listOwnerPassPins(limit = 60): Promise<{
  pins: OwnerPassPinRecord[];
  counts: {
    total: number;
    available: number;
    redeemed: number;
    revoked: number;
  };
}> {
  const safeLimit = Math.max(1, Math.min(200, Math.floor(limit)));
  const rows = await db
    .select({
      code: accessVouchers.code,
      planId: accessVouchers.planId,
      days: accessVouchers.days,
      priceNgn: accessVouchers.priceNgn,
      note: accessVouchers.note,
      createdByEmail: accessVouchers.createdByEmail,
      redeemedAt: accessVouchers.redeemedAt,
      revoked: accessVouchers.revoked,
      createdAt: accessVouchers.createdAt,
    })
    .from(accessVouchers)
    .orderBy(desc(accessVouchers.createdAt))
    .limit(safeLimit);

  let available = 0;
  let redeemed = 0;
  let revoked = 0;

  const pins: OwnerPassPinRecord[] = rows.map((r) => {
    const status: OwnerPassPinRecord['status'] = r.redeemedAt
      ? 'redeemed'
      : r.revoked
        ? 'revoked'
        : 'available';
    if (status === 'available') available += 1;
    else if (status === 'redeemed') redeemed += 1;
    else revoked += 1;

    const plan = getPremiumPlanById(r.planId);
    return {
      code: r.code,
      planId: r.planId,
      planName: plan?.name || r.planId,
      days: r.days,
      priceNgn: r.priceNgn,
      note: r.note || '',
      status,
      createdByEmail: r.createdByEmail,
      createdAtIso: r.createdAt instanceof Date ? r.createdAt.toISOString() : null,
      redeemedAtIso: r.redeemedAt instanceof Date ? r.redeemedAt.toISOString() : null,
    };
  });

  return {
    pins,
    counts: {
      total: pins.length,
      available,
      redeemed,
      revoked,
    },
  };
}

export async function revokeOwnerPassPin(rawCode: string): Promise<{ code: string; revoked: true }> {
  const code = normalizeVoucherCode(rawCode);
  if (!isValidVoucherCodeFormat(code)) {
    throw new BillingUserError('Invalid Pass PIN format.', 400);
  }
  const existing = await db
    .select({
      code: accessVouchers.code,
      redeemedAt: accessVouchers.redeemedAt,
      revoked: accessVouchers.revoked,
    })
    .from(accessVouchers)
    .where(eq(accessVouchers.code, code))
    .limit(1);

  if (!existing[0]) {
    throw new BillingUserError('Pass PIN not found.', 404);
  }
  if (existing[0].redeemedAt) {
    throw new BillingUserError('This Pass PIN has already been redeemed and cannot be revoked.', 409);
  }

  await db
    .update(accessVouchers)
    .set({ revoked: true })
    .where(and(eq(accessVouchers.code, code), isNull(accessVouchers.redeemedAt)));

  return { code, revoked: true };
}

export async function redeemAccessPassPin(params: {
  rawCode: string;
  uid?: string | null;
  deviceToken?: string | null;
  email?: string | null;
}): Promise<{
  pro: SignedProReceipt;
  planName: string;
  untilDay: number;
  daysAdded: number;
}> {
  const code = normalizeVoucherCode(params.rawCode);
  if (!isValidVoucherCodeFormat(code)) {
    throw new BillingUserError('Enter a valid Easy Learn Pass PIN (for example ELRN-XXXX-XXXX).', 400);
  }

  const { deviceKey } = deriveAuthoritativeDeviceKey(params.deviceToken);
  const cleanUid = typeof params.uid === 'string' && params.uid.trim() ? params.uid.trim() : null;
  const effectiveDeviceId = deviceKey || (cleanUid ? `UID_${cleanUid.slice(0, 28)}` : null);
  if (!effectiveDeviceId) {
    throw new BillingUserError('A valid device session is required. Refresh the page and try again.', 400);
  }

  const cleanEmail =
    typeof params.email === 'string' && isValidEmailAddress(params.email)
      ? params.email.trim().toLowerCase()
      : '';

  const curDay = currentEpochDay();
  const now = new Date();

  const txOutcome = await db.transaction(async (tx) => {
    const existingRows = await tx
      .select({
        code: accessVouchers.code,
        planId: accessVouchers.planId,
        days: accessVouchers.days,
        redeemedAt: accessVouchers.redeemedAt,
        revoked: accessVouchers.revoked,
      })
      .from(accessVouchers)
      .where(eq(accessVouchers.code, code))
      .limit(1);

    const voucher = existingRows[0];
    if (!voucher) {
      throw new BillingUserError('That Pass PIN was not found. Double-check the characters and try again.', 404);
    }
    if (voucher.revoked) {
      throw new BillingUserError('This Pass PIN has been cancelled by the administrator.', 410);
    }
    if (voucher.redeemedAt) {
      throw new BillingUserError('This Pass PIN has already been used.', 409);
    }

    // Atomic single-use claim prevents concurrent double redemption
    const claimed = await tx
      .update(accessVouchers)
      .set({
        redeemedByUid: cleanUid,
        redeemedByDeviceId: effectiveDeviceId,
        redeemedAt: now,
      })
      .where(
        and(
          eq(accessVouchers.code, code),
          eq(accessVouchers.revoked, false),
          isNull(accessVouchers.redeemedAt)
        )
      )
      .returning({
        code: accessVouchers.code,
        planId: accessVouchers.planId,
        days: accessVouchers.days,
      });

    if (!claimed[0]) {
      throw new BillingUserError('This Pass PIN was just redeemed. Contact the administrator for a new PIN.', 409);
    }

    const plan = getPremiumPlanById(claimed[0].planId);
    const resolvedDays = Math.max(1, Number(claimed[0].days || plan?.days || 30));
    const planName = plan?.name || 'Easy Learn Study Pass';

    const ownerMatch = cleanUid
      ? or(
          eq(premiumSubscriptions.uid, cleanUid),
          and(
            isNull(premiumSubscriptions.uid),
            eq(premiumSubscriptions.deviceId, effectiveDeviceId)
          )
        )
      : eq(premiumSubscriptions.deviceId, effectiveDeviceId);

    const activeSubs = await tx
      .select()
      .from(premiumSubscriptions)
      .where(and(ownerMatch, gte(premiumSubscriptions.untilDay, curDay)))
      .orderBy(desc(premiumSubscriptions.untilDay))
      .limit(1);

    const baseDay = activeSubs[0] ? Math.max(curDay, activeSubs[0].untilDay) : curDay;
    const untilDay = baseDay + resolvedDays;

    await tx.insert(premiumSubscriptions).values({
      uid: cleanUid,
      deviceId: effectiveDeviceId,
      email: cleanEmail,
      planId: claimed[0].planId,
      source: 'voucher',
      reference: claimed[0].code,
      startsDay: curDay,
      untilDay,
      createdAt: now,
      updatedAt: now,
    });

    return {
      code: claimed[0].code,
      planId: claimed[0].planId,
      planName,
      startsDay: curDay,
      untilDay,
      daysAdded: resolvedDays,
    };
  });

  const pro = await signEntitlementReceipt({
    pid: txOutcome.planId,
    on: txOutcome.startsDay,
    until: txOutcome.untilDay,
    code: txOutcome.code,
    source: 'voucher',
    planName: txOutcome.planName,
  });

  return {
    pro,
    planName: txOutcome.planName,
    untilDay: txOutcome.untilDay,
    daysAdded: txOutcome.daysAdded,
  };
}

function resolveTrialLinkKeyName(params: {
  uid?: string | null;
  deviceToken?: unknown;
}): string | null {
  const cleanUid = typeof params.uid === 'string' && params.uid.trim() ? params.uid.trim() : null;
  const { deviceKey } = deriveAuthoritativeDeviceKey(params.deviceToken, null, {
    allowLegacyDeviceIdFallback: false,
  });
  const anchor = cleanUid ? `uid_${cleanUid}` : deviceKey ? `dev_${deviceKey}` : null;
  if (!anchor) return null;
  const hash = crypto.createHash('sha256').update(`elrn-trial-link-v1:${anchor}`).digest('hex').slice(0, 36);
  return `trial_link_v1:${hash}`;
}

function parseTrialLinkJson(raw: string | null | undefined): TrialLinkInfo | null {
  if (!raw) return null;
  try {
    const obj = JSON.parse(raw) as Partial<TrialLinkInfo>;
    if (!obj || typeof obj !== 'object') return null;
    if (obj.methodType !== 'google_pay' && obj.methodType !== 'card_bank') return null;
    if (typeof obj.billingEmail !== 'string' || !isValidEmailAddress(obj.billingEmail)) return null;
    return {
      linked: true,
      methodType: obj.methodType,
      billingEmail: obj.billingEmail,
      accountLabel: typeof obj.accountLabel === 'string' ? obj.accountLabel : 'Linked payment account',
      status: obj.status === 'cancelled' ? 'cancelled' : 'active',
      autoRenew: obj.status === 'cancelled' ? false : Boolean(obj.autoRenew),
      startedAtIso: typeof obj.startedAtIso === 'string' ? obj.startedAtIso : new Date().toISOString(),
      endsAtIso: typeof obj.endsAtIso === 'string' ? obj.endsAtIso : new Date(Date.now() + FREE_TRIAL_DURATION_MS).toISOString(),
      cancelledAtIso: typeof obj.cancelledAtIso === 'string' ? obj.cancelledAtIso : null,
    };
  } catch {
    return null;
  }
}

export async function getLinkedTrialSubscription(params: {
  uid?: string | null;
  deviceToken?: unknown;
}): Promise<TrialLinkInfo | null> {
  const keyName = resolveTrialLinkKeyName(params);
  if (!keyName) return null;
  const rows = await db
    .select({ secretValue: systemSecrets.secretValue })
    .from(systemSecrets)
    .where(eq(systemSecrets.keyName, keyName))
    .limit(1);
  return parseTrialLinkJson(rows[0]?.secretValue);
}

/**
 * Links a student's Google Payment Account or tokenized Paystack billing account to their
 * 1-day (24-hour) free trial with 1-click Cancel Anytime. Never accepts or persists raw card PANs/CVVs.
 */
export async function linkAndStartOneDayTrial(params: {
  uid?: string | null;
  deviceToken?: unknown;
  methodType: TrialPaymentMethod;
  billingEmail: string;
  accountLabel?: string;
}): Promise<{ trial: SignedTrialReceipt | null; trialLink: TrialLinkInfo }> {
  const methodType: TrialPaymentMethod =
    params.methodType === 'card_bank' ? 'card_bank' : 'google_pay';
  const cleanEmail = String(params.billingEmail || '').trim().toLowerCase();
  if (!isValidEmailAddress(cleanEmail)) {
    throw new BillingUserError(
      'Enter a valid Google or billing email address to link your 1-day free trial.',
      400
    );
  }
  const rawLabel = String(params.accountLabel || '').trim().slice(0, 80);
  if (looksLikeRawCardNumber(rawLabel)) {
    throw new BillingUserError(
      'For your security, do not enter raw card numbers here — enter only your Google email or bank/account name.',
      400
    );
  }

  const keyName = resolveTrialLinkKeyName(params);
  if (!keyName) {
    throw new BillingUserError(
      'A valid session is required to link your payment account. Refresh and retry.',
      400
    );
  }

  const trial = await getOrCreateTrialReceipt({
    uid: params.uid,
    deviceToken: params.deviceToken,
  });

  const startedMs = trial?.startedAtMs ?? Date.now();
  const endsMs = trial?.endsAtMs ?? startedMs + FREE_TRIAL_DURATION_MS;
  const defaultLabel =
    methodType === 'google_pay'
      ? `Google Pay (${cleanEmail})`
      : rawLabel || `Paystack Billing Account (${cleanEmail})`;

  const trialLink: TrialLinkInfo = {
    linked: true,
    methodType,
    billingEmail: cleanEmail,
    accountLabel: rawLabel || defaultLabel,
    status: 'active',
    autoRenew: true,
    startedAtIso: new Date(startedMs).toISOString(),
    endsAtIso: new Date(endsMs).toISOString(),
    cancelledAtIso: null,
  };

  const serialized = JSON.stringify(trialLink);
  const existing = await db
    .select({ keyName: systemSecrets.keyName })
    .from(systemSecrets)
    .where(eq(systemSecrets.keyName, keyName))
    .limit(1);

  if (existing[0]) {
    await db
      .update(systemSecrets)
      .set({ secretValue: serialized })
      .where(eq(systemSecrets.keyName, keyName));
  } else {
    await db
      .insert(systemSecrets)
      .values({ keyName, secretValue: serialized })
      .onConflictDoNothing({ target: systemSecrets.keyName });
  }

  return { trial, trialLink };
}

/**
 * Cancels the student's linked 1-day trial auto-renewal immediately (Cancel Anytime)
 * while preserving any remaining hours in their current 24-hour trial window.
 */
export async function cancelLinkedTrial(params: {
  uid?: string | null;
  deviceToken?: unknown;
}): Promise<TrialLinkInfo> {
  const keyName = resolveTrialLinkKeyName(params);
  if (!keyName) {
    throw new BillingUserError('Session not found. Refresh and retry.', 400);
  }
  const existing = await getLinkedTrialSubscription(params);
  if (!existing) {
    throw new BillingUserError('No linked trial payment method was found for this account.', 404);
  }

  const updated: TrialLinkInfo = {
    ...existing,
    status: 'cancelled',
    autoRenew: false,
    cancelledAtIso: new Date().toISOString(),
  };

  await db
    .update(systemSecrets)
    .set({ secretValue: JSON.stringify(updated) })
    .where(eq(systemSecrets.keyName, keyName));

  return updated;
}

function resolveSubAutoRenewKeyName(params: {
  uid?: string | null;
  deviceToken?: unknown;
}): string | null {
  const cleanUid = typeof params.uid === 'string' && params.uid.trim() ? params.uid.trim() : null;
  const { deviceKey } = deriveAuthoritativeDeviceKey(params.deviceToken, null, {
    allowLegacyDeviceIdFallback: false,
  });
  const anchor = cleanUid ? `uid_${cleanUid}` : deviceKey ? `dev_${deviceKey}` : null;
  if (!anchor) return null;
  const hash = crypto
    .createHash('sha256')
    .update(`elrn-sub-autorenew-v1:${anchor}`)
    .digest('hex')
    .slice(0, 36);
  return `sub_autorenew_v1:${hash}`;
}

export async function upsertSubscriptionAutoRenewState(
  params: {
    uid?: string | null;
    deviceToken?: unknown;
  } & SubscriptionAutoRenewInfo
): Promise<SubscriptionAutoRenewInfo | null> {
  const keyName = resolveSubAutoRenewKeyName(params);
  if (!keyName) return null;
  const plan = getPremiumPlanById(params.planId);
  const isRecurring = Boolean(plan?.isRecurring);
  const record: SubscriptionAutoRenewInfo = {
    planId: plan?.id || params.planId,
    isRecurring,
    autoRenew: isRecurring ? Boolean(params.autoRenew) : false,
    status: !isRecurring ? 'one_time' : params.status === 'cancelled' ? 'cancelled' : 'active',
    nextBillingAtIso: isRecurring ? params.nextBillingAtIso : null,
    cancelledAtIso: isRecurring && params.status === 'cancelled' ? params.cancelledAtIso : null,
  };
  const serialized = JSON.stringify(record);
  const existing = await db
    .select({ keyName: systemSecrets.keyName })
    .from(systemSecrets)
    .where(eq(systemSecrets.keyName, keyName))
    .limit(1);
  if (existing[0]) {
    await db
      .update(systemSecrets)
      .set({ secretValue: serialized })
      .where(eq(systemSecrets.keyName, keyName));
  } else {
    await db
      .insert(systemSecrets)
      .values({ keyName, secretValue: serialized })
      .onConflictDoNothing({ target: systemSecrets.keyName });
  }
  return record;
}

export async function getSubscriptionAutoRenewState(params: {
  uid?: string | null;
  deviceToken?: unknown;
  activePro?: SignedProReceipt | null;
}): Promise<SubscriptionAutoRenewInfo | null> {
  const keyName = resolveSubAutoRenewKeyName(params);
  if (keyName) {
    const rows = await db
      .select({ secretValue: systemSecrets.secretValue })
      .from(systemSecrets)
      .where(eq(systemSecrets.keyName, keyName))
      .limit(1);
    if (rows[0]?.secretValue) {
      try {
        const parsed = JSON.parse(rows[0].secretValue) as Partial<SubscriptionAutoRenewInfo>;
        const plan = getPremiumPlanById(parsed.planId);
        if (plan) {
          return {
            planId: plan.id,
            isRecurring: plan.isRecurring,
            autoRenew: plan.isRecurring ? Boolean(parsed.autoRenew) : false,
            status: !plan.isRecurring
              ? 'one_time'
              : parsed.status === 'cancelled'
                ? 'cancelled'
                : 'active',
            nextBillingAtIso:
              plan.isRecurring && typeof parsed.nextBillingAtIso === 'string'
                ? parsed.nextBillingAtIso
                : null,
            cancelledAtIso:
              plan.isRecurring && typeof parsed.cancelledAtIso === 'string'
                ? parsed.cancelledAtIso
                : null,
          };
        }
      } catch {
        /* fall through to activePro default */
      }
    }
  }

  if (params.activePro) {
    const plan = getPremiumPlanById(params.activePro.pid);
    if (plan) {
      const daysLeft = Math.max(1, params.activePro.until - currentEpochDay());
      return {
        planId: plan.id,
        isRecurring: plan.isRecurring,
        autoRenew: plan.isRecurring && params.activePro.source === 'paystack',
        status: !plan.isRecurring ? 'one_time' : 'active',
        nextBillingAtIso: plan.isRecurring
          ? new Date(Date.now() + daysLeft * 86_400_000).toISOString()
          : null,
        cancelledAtIso: null,
      };
    }
  }
  return null;
}

export async function cancelRecurringSubscription(params: {
  uid?: string | null;
  deviceToken?: unknown;
  activePro?: SignedProReceipt | null;
}): Promise<SubscriptionAutoRenewInfo> {
  const current = await getSubscriptionAutoRenewState(params);
  if (!current) {
    throw new BillingUserError('No active recurring subscription was found on this account.', 404);
  }
  if (!current.isRecurring || current.planId === 'lifetime') {
    throw new BillingUserError(
      'Lifetime Pass is a one-time payment and is never auto-debited.',
      400
    );
  }
  const updated = await upsertSubscriptionAutoRenewState({
    uid: params.uid,
    deviceToken: params.deviceToken,
    planId: current.planId,
    isRecurring: true,
    autoRenew: false,
    status: 'cancelled',
    nextBillingAtIso: current.nextBillingAtIso,
    cancelledAtIso: new Date().toISOString(),
  });
  if (!updated) {
    throw new BillingUserError('Session not found. Refresh and retry.', 400);
  }
  return updated;
}

export async function resumeRecurringSubscription(params: {
  uid?: string | null;
  deviceToken?: unknown;
  activePro?: SignedProReceipt | null;
}): Promise<SubscriptionAutoRenewInfo> {
  const current = await getSubscriptionAutoRenewState(params);
  if (!current) {
    throw new BillingUserError('No active subscription was found to resume.', 404);
  }
  if (!current.isRecurring || current.planId === 'lifetime') {
    throw new BillingUserError(
      'Lifetime Pass is permanent and does not require auto-renewal.',
      400
    );
  }
  const updated = await upsertSubscriptionAutoRenewState({
    uid: params.uid,
    deviceToken: params.deviceToken,
    planId: current.planId,
    isRecurring: true,
    autoRenew: true,
    status: 'active',
    nextBillingAtIso: current.nextBillingAtIso,
    cancelledAtIso: null,
  });
  if (!updated) {
    throw new BillingUserError('Session not found. Refresh and retry.', 400);
  }
  return updated;
}




