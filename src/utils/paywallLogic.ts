import type { CbtPresetId } from './cbtEngine';
import type { UserProgress } from '../types';

export type PremiumPlanId = 'monthly' | 'biannual' | 'annual' | 'lifetime';

export interface PremiumPlanDef {
  id: PremiumPlanId;
  name: string;
  shortLabel: string;
  days: number;
  priceNgn: number;
  priceKobo: number;
  isRecurring: boolean;
  billingCycleLabel: string;
  popular?: boolean;
  savingsBadge?: string;
  blurb: string;
}

export const FREE_STARTER_TOPIC_COUNT = 2;
export const FREE_TRIAL_DAYS = 1;
export const FREE_TRIAL_DURATION_MS = 24 * 60 * 60 * 1000;
export const FREE_TRIAL_WARNING_THRESHOLD_MS = 2 * 60 * 60 * 1000;

export type TrialPaymentMethod = 'google_pay' | 'card_bank';

export interface TrialLinkInfo {
  linked: boolean;
  methodType: TrialPaymentMethod;
  billingEmail: string;
  accountLabel: string;
  status: 'active' | 'cancelled';
  autoRenew: boolean;
  startedAtIso: string;
  endsAtIso: string;
  cancelledAtIso: string | null;
}

export interface SubscriptionAutoRenewInfo {
  planId: PremiumPlanId;
  isRecurring: boolean;
  autoRenew: boolean;
  status: 'active' | 'cancelled' | 'one_time';
  nextBillingAtIso: string | null;
  cancelledAtIso: string | null;
}

export interface TrialCountdownSnapshot {
  remainingMs: number;
  formattedCountdown: string;
  isWarning: boolean;
  isExpired: boolean;
  endsAtMs: number;
}

export const PREMIUM_PLANS: readonly PremiumPlanDef[] = [
  {
    id: 'monthly',
    name: 'Monthly pass',
    shortLabel: '1 month',
    days: 30,
    priceNgn: 1000,
    priceKobo: 100_000,
    isRecurring: true,
    billingCycleLabel: 'Auto-renews monthly · Cancel anytime',
    blurb: 'Full access to all 49 subjects, tutors, CBT mocks, virtual labs and colour themes.',
  },
  {
    id: 'biannual',
    name: '6-Month pass',
    shortLabel: '6 months',
    days: 180,
    priceNgn: 4500,
    priceKobo: 450_000,
    isRecurring: true,
    billingCycleLabel: 'Auto-renews every 6 months · Cancel anytime',
    savingsBadge: 'Save ₦1,500',
    blurb: '6 months of full unrestricted access across all classes and exams — save ₦1,500.',
  },
  {
    id: 'annual',
    name: 'Yearly pass',
    shortLabel: '1 year',
    days: 365,
    priceNgn: 9000,
    priceKobo: 900_000,
    isRecurring: true,
    billingCycleLabel: 'Auto-renews yearly · Cancel anytime',
    popular: true,
    savingsBadge: 'Save ₦3,000',
    blurb: 'Full academic year for JAMB UTME, WAEC and NECO with every tutor, lab and theme.',
  },
  {
    id: 'lifetime',
    name: 'Lifetime pass',
    shortLabel: 'Lifetime',
    days: 36500,
    priceNgn: 27800,
    priceKobo: 2_780_000,
    isRecurring: false,
    billingCycleLabel: 'One-time payment · Never auto-debited',
    savingsBadge: 'Pay once',
    blurb: 'Pay once for permanent lifetime access across SS1–SS3, JAMB UTME, WAEC and NECO.',
  },
];

export function isRecurringPlanId(id?: string | null): boolean {
  const plan = getPremiumPlanById(id);
  return Boolean(plan?.isRecurring);
}

export function getPremiumPlanById(id?: string | null): PremiumPlanDef | null {
  if (!id) return null;
  const norm = id.trim().toLowerCase();
  if (norm === 'm' || norm === 'w' || norm === 'weekly' || norm === 'monthly') {
    return PREMIUM_PLANS[0];
  }
  if (norm === '6m' || norm === 'semester' || norm === 'biannual') {
    return PREMIUM_PLANS[1];
  }
  if (norm === 's' || norm === 'season' || norm === 'y' || norm === 'yearly' || norm === 'annual') {
    return PREMIUM_PLANS[2];
  }
  if (norm === 'l' || norm === 'life' || norm === 'lifetime') {
    return PREMIUM_PLANS[3];
  }
  return PREMIUM_PLANS.find((p) => p.id === norm) || null;
}

export function currentEpochDay(): number {
  return Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000);
}

/**
 * Returns true if the student holds an active, server-signed Premium entitlement
 * (or server-verified owner session flag). Every paid plan — starting from ₦1,000/month —
 * grants 100% full access.
 */
export function hasActivePremium(
  progress: Pick<UserProgress, 'pro' | 'owner'>,
  currentDay = currentEpochDay()
): boolean {
  if (progress.owner) return true;
  const pro = progress.pro;
  if (!pro) return false;
  if (typeof pro.sig !== 'string' || !/^[0-9a-fA-F]{64,256}$/.test(pro.sig)) return false;
  if (typeof pro.until !== 'number' || !Number.isFinite(pro.until)) return false;
  return pro.until >= currentDay;
}

export interface TrialStatusSnapshot {
  startedDay: number;
  untilDay: number;
  daysRemaining: number;
  isTrialActive: boolean;
  isTrialExpired: boolean;
}

/**
 * Computes the student's 1-day (24-hour) free trial day-window (`startedDay` .. `startedDay`).
 * On Day 1 (`currentDay === startedDay`), `daysRemaining === 1`.
 * From Day 2 onward (`currentDay >= startedDay + 1`), `daysRemaining === 0` and `isTrialExpired === true`.
 */
export function computeTrialStatus(
  progress: Pick<UserProgress, 'trial'>,
  currentDay = currentEpochDay()
): TrialStatusSnapshot {
  const rawStarted = progress.trial?.startedDay;
  const startedDay =
    typeof rawStarted === 'number' && Number.isFinite(rawStarted)
      ? Math.floor(rawStarted)
      : currentDay;
  const untilDay = startedDay + FREE_TRIAL_DAYS - 1;
  const elapsed = Math.max(0, currentDay - startedDay);
  const daysRemaining = Math.max(0, FREE_TRIAL_DAYS - elapsed);
  const isTrialExpired = currentDay >= startedDay + FREE_TRIAL_DAYS;
  return {
    startedDay,
    untilDay,
    daysRemaining,
    isTrialActive: !isTrialExpired,
    isTrialExpired,
  };
}

/**
 * Formats a millisecond trial countdown into `HH:MM:SS` (e.g. `23:59:42`, `01:12:08`, `00:00:00`).
 */
export function formatTrialCountdown(remainingMs: number): string {
  const totalSec = Math.max(0, Math.ceil(remainingMs / 1000));
  const hrs = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Computes the exact live millisecond countdown for the student's 1-day (24-hour) free trial.
 * Uses the linked trial's exact `endsAtIso` when present, else `trial.endsAtMs` / `trial.startedAtMs + 24h`,
 * and always enforces day-based expiry if `computeTrialStatus` marks the trial expired.
 */
export function computeTrialCountdownStatus(params: {
  trial?: UserProgress['trial'];
  trialLink?: TrialLinkInfo | null;
  nowMs?: number;
  currentDay?: number;
}): TrialCountdownSnapshot {
  const nowMs = params.nowMs ?? Date.now();
  const curDay = params.currentDay ?? currentEpochDay();
  const dayStatus = computeTrialStatus({ trial: params.trial }, curDay);

  let endsAtMs: number;
  const parsedLinkEnd =
    params.trialLink?.endsAtIso ? Date.parse(params.trialLink.endsAtIso) : Number.NaN;
  if (Number.isFinite(parsedLinkEnd)) {
    endsAtMs = parsedLinkEnd;
  } else if (
    typeof params.trial?.endsAtMs === 'number' &&
    Number.isFinite(params.trial.endsAtMs) &&
    params.trial.endsAtMs > 0
  ) {
    endsAtMs = params.trial.endsAtMs;
  } else if (
    typeof params.trial?.startedAtMs === 'number' &&
    Number.isFinite(params.trial.startedAtMs) &&
    params.trial.startedAtMs > 0
  ) {
    endsAtMs = params.trial.startedAtMs + FREE_TRIAL_DURATION_MS;
  } else {
    const tzOffsetMs = new Date(nowMs).getTimezoneOffset() * 60000;
    endsAtMs = (dayStatus.startedDay + FREE_TRIAL_DAYS) * 86400000 + tzOffsetMs;
  }

  const rawRemainingMs = Math.max(0, endsAtMs - nowMs);
  const isExpired = dayStatus.isTrialExpired || rawRemainingMs <= 0;
  const remainingMs = isExpired ? 0 : rawRemainingMs;
  const isWarning = !isExpired && remainingMs <= FREE_TRIAL_WARNING_THRESHOLD_MS;

  return {
    remainingMs,
    formattedCountdown: formatTrialCountdown(remainingMs),
    isWarning,
    isExpired,
    endsAtMs,
  };
}

/**
 * Guard helper that detects if a user accidentally typed a raw 13-19 digit payment card number
 * into a display label field so raw PANs are never accepted or persisted.
 */
export function looksLikeRawCardNumber(raw: unknown): boolean {
  if (typeof raw !== 'string') return false;
  const digits = raw.replace(/[\s-]+/g, '');
  return /\d{13,19}/.test(digits);
}

/**
 * Legacy helper retained for starter indicator compatibility.
 */
export function isFreeStarterTopic(
  topicId: string,
  subjectTopics: readonly { id: string }[]
): boolean {
  const idx = subjectTopics.findIndex((t) => t.id === topicId);
  return idx >= 0 && idx < FREE_STARTER_TOPIC_COUNT;
}

/**
 * During the 1-day free trial (`!isTrialExpired`), basic topic notes, lessons,
 * practice and topic tests are accessible while Tutors, Themes, CBT Mocks and Labs stay locked.
 * Once the 1-day trial expires, everything in the app is locked until the student subscribes.
 */
export function isTopicPaywalled(
  progress: Pick<UserProgress, 'pro' | 'owner' | 'trial'>,
  _topicId: string,
  _subjectTopics: readonly { id: string }[],
  currentDay = currentEpochDay()
): boolean {
  if (hasActivePremium(progress, currentDay)) return false;
  const trial = computeTrialStatus(progress, currentDay);
  return trial.isTrialExpired;
}

/**
 * During the unsubscribed 1-day free trial, CBT Mock Exam is locked except on
 * National CBT Saturdays (WAT), where the 'sprint' preset opens so every student
 * can compete in the Saturday CBT cohort ranking. Any paid plan unlocks every CBT mode.
 */
export function isCbtPresetPaywalled(
  progress: Pick<UserProgress, 'pro' | 'owner'>,
  presetId: CbtPresetId,
  currentDay = currentEpochDay()
): boolean {
  if (hasActivePremium(progress, currentDay)) return false;
  const isWatSaturday = new Date(Date.now() + 3600_000).getUTCDay() === 6;
  if (presetId === 'sprint' && isWatSaturday) return false;
  return true;
}

export function formatPremiumRemaining(
  untilDay: number,
  currentDay = currentEpochDay(),
  planId?: string | null
): string {
  const normPlan = typeof planId === 'string' ? planId.trim().toLowerCase() : '';
  const diff = Math.max(0, Math.floor(untilDay - currentDay));
  if (normPlan === 'lifetime' || normPlan === 'life' || normPlan === 'l' || diff > 3650) {
    return 'Lifetime access';
  }
  if (diff === 0) return 'Expires today';
  if (diff === 1) return '1 day left';
  return `${diff} days left`;
}

/**
 * Strips spaces/punctuation and formats 12-character Easy Learn (ELRN) or legacy EYAK
 * Pass PINs cleanly as ELRN-XXXX-XXXX / EYAK-XXXX-XXXX.
 */
export function normalizeVoucherCode(raw: unknown): string {
  if (typeof raw !== 'string') return '';
  const alnum = raw.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 24);
  if (alnum.length === 12 && (alnum.startsWith('ELRN') || alnum.startsWith('EYAK'))) {
    return `${alnum.slice(0, 4)}-${alnum.slice(4, 8)}-${alnum.slice(8, 12)}`;
  }
  return alnum;
}

export function isValidVoucherCodeFormat(raw: unknown): boolean {
  const norm = normalizeVoucherCode(raw);
  return /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(norm) || /^[A-Z0-9]{8,24}$/.test(norm);
}

export function buildPassPinWhatsAppUrl(params: {
  code: string;
  planName: string;
  days: number;
  note?: string;
}): string {
  const durationLabel = params.days >= 3650 ? 'Lifetime access' : `${params.days} days`;
  const lines = [
    'Your Easy Learn Study Pass PIN is ready!',
    `Pass PIN: ${params.code}`,
    `Plan: ${params.planName} (${durationLabel})`,
    params.note?.trim() ? `For: ${params.note.trim()}` : '',
    'How to activate: Open Easy Learn -> Settings -> Activate Pass PIN, then paste your PIN.',
  ].filter(Boolean);
  return `https://wa.me/?text=${encodeURIComponent(lines.join('\n'))}`;
}

export function formatPassPinClipboardBatch(
  pins: ReadonlyArray<{ code: string; planName: string; days: number; note?: string }>
): string {
  if (pins.length === 1) {
    return pins[0].code;
  }
  return pins
    .map((p, idx) => {
      const dur = p.days >= 3650 ? 'Lifetime' : `${p.days}d`;
      const suffix = p.note?.trim() ? ` — ${p.note.trim()}` : '';
      return `${idx + 1}. ${p.code} (${p.planName}, ${dur})${suffix}`;
    })
    .join('\n');
}

export function sanitizeDeviceId(raw: unknown): string {
  if (typeof raw !== 'string') return '';
  return raw.toUpperCase().replace(/[^A-Z0-9_]/g, '').slice(0, 40);
}

export function isValidDeviceId(raw: unknown): boolean {
  const clean = sanitizeDeviceId(raw);
  return clean.length >= 6 && clean.length <= 40;
}

const DISPLAY_DEV_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function fillSecureRandomBytes(len: number): Uint8Array {
  const bytes = new Uint8Array(len);
  if (globalThis.crypto && typeof globalThis.crypto.getRandomValues === 'function') {
    globalThis.crypto.getRandomValues(bytes);
    return bytes;
  }
  for (let i = 0; i < len; i++) {
    bytes[i] = Math.floor(Math.random() * 256);
  }
  return bytes;
}

/**
 * Generates an 8-character human-readable support reference ID using CSPRNG bytes.
 * Never used as a bearer credential on its own.
 */
export function generateSecureDisplayDevId(): string {
  const bytes = fillSecureRandomBytes(8);
  let out = '';
  for (let i = 0; i < 8; i++) {
    out += DISPLAY_DEV_ALPHABET[bytes[i] % 32];
  }
  return out;
}

/**
 * Generates a 192-bit (48-hex-character) secret cryptographic device token.
 * Sent only in `X-Device-Token` headers and never displayed in UI or URLs.
 */
export function generateDeviceSecretToken(): string {
  const bytes = fillSecureRandomBytes(24);
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}

export function isValidDeviceSecretToken(raw: unknown): raw is string {
  return typeof raw === 'string' && /^[0-9a-fA-F]{32,128}$/.test(raw.trim());
}

export function buildCanonicalProPayloadV2(fields: {
  pid: string;
  on: number;
  until: number;
  code: string;
}): string {
  return `eyak-pro-v2:${fields.pid.trim()}:${Math.floor(fields.on)}:${Math.floor(fields.until)}:${fields.code.trim()}`;
}

export function buildCanonicalTrialPayloadV1(fields: {
  startedDay: number;
  untilDay: number;
}): string {
  return `eyak-trial-v1:${Math.floor(fields.startedDay)}:${Math.floor(fields.untilDay)}`;
}

function hexToUint8Array(hex: string): Uint8Array | null {
  if (hex.length % 2 !== 0 || !/^[0-9a-fA-F]+$/.test(hex)) return null;
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

/**
 * Cryptographically verifies a server-issued ECDSA P-256 (`SHA-256`, IEEE P1363 128-hex)
 * Premium receipt using WebCrypto so tampered `localStorage` receipts are rejected even offline.
 */
export async function verifySignedProReceiptAsync(
  rawPro: unknown,
  publicKeyJwk: JsonWebKey | null | undefined
): Promise<boolean> {
  if (!rawPro || typeof rawPro !== 'object' || Array.isArray(rawPro)) return false;
  if (!publicKeyJwk || typeof publicKeyJwk !== 'object' || publicKeyJwk.kty !== 'EC') return false;
  if (!globalThis.crypto?.subtle) return false;

  const rec = rawPro as Record<string, unknown>;
  const pid = typeof rec.pid === 'string' ? rec.pid.trim() : '';
  const code = typeof rec.code === 'string' ? rec.code.trim() : '';
  const on = Number(rec.on);
  const until = Number(rec.until);
  const sig = typeof rec.sig === 'string' ? rec.sig.trim() : '';

  if (!pid || !code || !Number.isFinite(on) || !Number.isFinite(until) || sig.length !== 128) {
    return false;
  }
  const sigBytes = hexToUint8Array(sig);
  if (!sigBytes || sigBytes.length !== 64) return false;

  try {
    const key = await globalThis.crypto.subtle.importKey(
      'jwk',
      publicKeyJwk,
      { name: 'ECDSA', namedCurve: 'P-256' },
      false,
      ['verify']
    );
    const payloadBytes = new TextEncoder().encode(
      buildCanonicalProPayloadV2({ pid, on, until, code })
    );
    return await globalThis.crypto.subtle.verify(
      { name: 'ECDSA', hash: 'SHA-256' },
      key,
      sigBytes as Uint8Array<ArrayBuffer>,
      payloadBytes
    );
  } catch {
    return false;
  }
}

/**
 * Cryptographically verifies a server-issued ECDSA P-256 (`SHA-256`, IEEE P1363 128-hex)
 * 3-day starter trial receipt so students cannot extend `startedDay` or `untilDay` in `localStorage`.
 */
export async function verifySignedTrialReceiptAsync(
  rawTrial: unknown,
  publicKeyJwk: JsonWebKey | null | undefined
): Promise<boolean> {
  if (!rawTrial || typeof rawTrial !== 'object' || Array.isArray(rawTrial)) return false;
  if (!publicKeyJwk || typeof publicKeyJwk !== 'object' || publicKeyJwk.kty !== 'EC') return false;
  if (!globalThis.crypto?.subtle) return false;

  const rec = rawTrial as Record<string, unknown>;
  const startedDay = Number(rec.startedDay);
  const untilDay = Number(rec.untilDay);
  const sig = typeof rec.sig === 'string' ? rec.sig.trim() : '';

  if (!Number.isFinite(startedDay) || !Number.isFinite(untilDay) || sig.length !== 128) {
    return false;
  }
  const sigBytes = hexToUint8Array(sig);
  if (!sigBytes || sigBytes.length !== 64) return false;

  try {
    const key = await globalThis.crypto.subtle.importKey(
      'jwk',
      publicKeyJwk,
      { name: 'ECDSA', namedCurve: 'P-256' },
      false,
      ['verify']
    );
    const payloadBytes = new TextEncoder().encode(
      buildCanonicalTrialPayloadV1({ startedDay, untilDay })
    );
    return await globalThis.crypto.subtle.verify(
      { name: 'ECDSA', hash: 'SHA-256' },
      key,
      sigBytes as Uint8Array<ArrayBuffer>,
      payloadBytes
    );
  } catch {
    return false;
  }
}

export function isValidEmailAddress(raw: unknown): boolean {
  if (typeof raw !== 'string') return false;
  const trimmed = raw.trim();
  if (trimmed.length < 5 || trimmed.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed);
}

export function isValidPaystackReference(raw: unknown): boolean {
  if (typeof raw !== 'string') return false;
  return /^[a-zA-Z0-9_-]{6,80}$/.test(raw.trim());
}

/**
 * Validates that a server-side Paystack secret key matches Paystack's `sk_live_...` or `sk_test_...`
 * format and is not an unreplaced placeholder value or client public key (`pk_...`).
 */
export function isConfiguredPaystackSecretKey(raw: unknown): boolean {
  if (typeof raw !== 'string') return false;
  const trimmed = raw.trim();
  if (!/^sk_(live|test)_[a-zA-Z0-9]{16,128}$/.test(trimmed)) return false;
  if (/^sk_(live|test)_(your|replace|example|placeholder|xxx|key|secret|dummy|sample)/i.test(trimmed)) {
    return false;
  }
  return true;
}

export interface ParsedScholarEmailList {
  emails: string[];
  invalidEntries: string[];
}

/**
 * Parses comma, semicolon, or newline-separated scholar emails for Paystack sponsorship
 * and bulk school seat checkouts, deduplicating normalized lowercase emails.
 */
export function parseScholarEmailList(
  raw: unknown,
  maxCount = 200
): ParsedScholarEmailList {
  const source = Array.isArray(raw)
    ? raw.map((item) => (typeof item === 'string' ? item : '')).join('\n')
    : typeof raw === 'string'
      ? raw
      : '';

  const tokens = source
    .split(/[\n,;]+/)
    .map((part) => part.trim().toLowerCase())
    .filter((part) => part.length > 0);

  const seen = new Set<string>();
  const emails: string[] = [];
  const invalidEntries: string[] = [];

  for (const token of tokens) {
    if (!isValidEmailAddress(token)) {
      invalidEntries.push(token);
      continue;
    }
    if (!seen.has(token)) {
      seen.add(token);
      emails.push(token);
      if (emails.length >= maxCount) break;
    }
  }

  return { emails, invalidEntries };
}

export interface PaystackSeatQuote {
  seats: number;
  planId: PremiumPlanId;
  planName: string;
  unitPriceNgn: number;
  discountPct: number;
  subtotalNgn: number;
  savingsNgn: number;
  totalNgn: number;
  totalKobo: number;
  perSeatFinalNgn: number;
}

/**
 * Computes exact server-authoritative Naira and kobo totals for 1-to-N scholar seats on Paystack
 * (15% automatic cohort discount for 10–49 scholars, 25% for 50+ scholars).
 */
export function calculatePaystackSeatQuote(
  rawSeats: number,
  rawPlanId?: string | null
): PaystackSeatQuote {
  const plan = getPremiumPlanById(rawPlanId) || PREMIUM_PLANS[2];
  const seats = Math.max(1, Math.min(5000, Math.round(Number(rawSeats) || 1)));
  const discountPct = seats >= 50 ? 25 : seats >= 10 ? 15 : 0;
  const subtotalNgn = seats * plan.priceNgn;
  const savingsNgn = Math.round((subtotalNgn * discountPct) / 100);
  const totalNgn = subtotalNgn - savingsNgn;
  const totalKobo = totalNgn * 100;
  const perSeatFinalNgn = Math.round(totalNgn / seats);

  return {
    seats,
    planId: plan.id,
    planName: plan.name,
    unitPriceNgn: plan.priceNgn,
    discountPct,
    subtotalNgn,
    savingsNgn,
    totalNgn,
    totalKobo,
    perSeatFinalNgn,
  };
}

