import React, { useCallback, useEffect, useState } from 'react';
import { auth } from '../firebase';
import type { UserProgress } from '../types';
import { fmtDev } from '../utils/engine';
import {
  PREMIUM_PLANS,
  formatPremiumRemaining,
  getPremiumPlanById,
  hasActivePremium,
  isValidEmailAddress,
  isValidPaystackReference,
  isValidVoucherCodeFormat,
  normalizeVoucherCode,
  type PremiumPlanId,
} from '../utils/paywallLogic';
import { Icon } from './Icons';
import { LiquidCapsuleBar } from './ULessonMotion';

type PaymentTab = 'pin' | 'paystack';

async function buildOptionalAuthHeaders(
  withJson = true,
  devToken?: string
): Promise<Record<string, string>> {
  const headers: Record<string, string> = {};
  if (withJson) {
    headers['Content-Type'] = 'application/json';
  }
  if (devToken) {
    headers['X-Device-Token'] = devToken;
  }
  const currentUser = auth.currentUser;
  if (currentUser) {
    try {
      const token = await currentUser.getIdToken();
      if (token) headers.Authorization = `Bearer ${token}`;
    } catch {
      /* proceed unauthenticated with X-Device-Token */
    }
  }
  return headers;
}

export function PaywallModal({
  open,
  reason,
  progress,
  paystackEnabled,
  initialReference,
  blocking = false,
  trialDaysRemaining = 0,
  onSignOut,
  onActivated,
  onClose,
}: {
  open: boolean;
  reason?: string;
  progress: UserProgress;
  paystackEnabled: boolean;
  initialReference?: string | null;
  blocking?: boolean;
  trialDaysRemaining?: number;
  onSignOut?: () => void;
  onActivated: (pro: NonNullable<UserProgress['pro']>, summaryText: string) => void;
  onClose: () => void;
}) {
  const [selectedPlan, setSelectedPlan] = useState<PremiumPlanId>('annual');
  const [tab, setTab] = useState<PaymentTab>(paystackEnabled ? 'paystack' : 'pin');
  const [voucherCode, setVoucherCode] = useState('');
  const [email, setEmail] = useState(() => auth.currentUser?.email || '');
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copiedDevice, setCopiedDevice] = useState(false);
  const [checkoutSession, setCheckoutSession] = useState<{
    authorizationUrl: string;
    reference: string;
  } | null>(null);

  useEffect(() => {
    if (!open) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    if (auth.currentUser?.email && !email) {
      setEmail(auth.currentUser.email);
    }
    if (initialReference && isValidPaystackReference(initialReference)) {
      setTab('paystack');
      setCheckoutSession((prev) =>
        prev?.reference === initialReference
          ? prev
          : { authorizationUrl: '', reference: initialReference }
      );
    } else if (!paystackEnabled) {
      setTab('pin');
    }
  }, [open, paystackEnabled, initialReference, email]);

  useEffect(() => {
    if (!open || blocking) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !busy) {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, blocking, busy, onClose]);

  const activePlan = getPremiumPlanById(selectedPlan) || PREMIUM_PLANS[2];
  const isAlreadyPremium = hasActivePremium(progress);
  const remainingLabel =
    isAlreadyPremium && progress.pro
      ? formatPremiumRemaining(progress.pro.until, undefined, progress.pro.pid)
      : progress.owner
        ? 'Owner access'
        : null;

  const handleCopyDeviceId = async () => {
    const formatted = fmtDev(progress.dev);
    try {
      await navigator.clipboard.writeText(formatted);
      setCopiedDevice(true);
      window.setTimeout(() => setCopiedDevice(false), 2000);
    } catch {
      setCopiedDevice(false);
    }
  };

  const handleRedeemPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const normalized = normalizeVoucherCode(voucherCode);
    if (!isValidVoucherCodeFormat(normalized)) {
      setErrorMsg('Enter a valid Pass PIN (for example EYAK-ABCD-2345).');
      return;
    }

    setBusy(true);
    try {
      const headers = await buildOptionalAuthHeaders(true, progress.devToken);
      const resp = await fetch('/api/billing/redeem', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          code: normalized,
        }),
      });
      const data = (await resp.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        entitlementPublicKey?: JsonWebKey;
        pro?: NonNullable<UserProgress['pro']>;
        planName?: string;
        untilDay?: number;
      };

      if (!resp.ok || !data.ok || !data.pro) {
        setErrorMsg(data.error || 'Could not activate Pass PIN. Check the characters and retry.');
        return;
      }

      if (data.entitlementPublicKey && data.entitlementPublicKey.kty === 'EC') {
        try {
          window.localStorage.setItem('rtc_pub_jwk_v1', JSON.stringify(data.entitlementPublicKey));
        } catch {
          /* ignore */
        }
      }

      const summary = `${data.planName || 'EYAK Premium'} activated (${formatPremiumRemaining(data.pro.until, undefined, data.pro.pid)}).`;
      setSuccessMsg(summary);
      setVoucherCode('');
      onActivated(data.pro, summary);
    } catch {
      setErrorMsg('Network error while checking Pass PIN. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  };

  const handleStartPaystack = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!paystackEnabled) {
      setTab('pin');
      return;
    }
    if (!isValidEmailAddress(email)) {
      setErrorMsg('Enter a valid email address for your payment receipt.');
      return;
    }

    setBusy(true);
    try {
      const headers = await buildOptionalAuthHeaders(true, progress.devToken);
      const resp = await fetch('/api/billing/paystack/initialize', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          planId: activePlan.id,
          email: email.trim(),
        }),
      });
      const data = (await resp.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        authorizationUrl?: string;
        reference?: string;
      };

      if (!resp.ok || !data.ok || !data.authorizationUrl || !data.reference) {
        setErrorMsg(data.error || 'Unable to start Paystack checkout right now.');
        return;
      }

      try {
        window.sessionStorage.setItem('eyak_pending_paystack_ref', data.reference);
      } catch {
        /* ignore sessionStorage errors */
      }

      setCheckoutSession({
        authorizationUrl: data.authorizationUrl,
        reference: data.reference,
      });

      // On standalone browser tab, navigate directly to Paystack checkout
      if (typeof window !== 'undefined' && window.self === window.top) {
        window.location.assign(data.authorizationUrl);
      }
    } catch {
      setErrorMsg('Could not connect to Paystack right now. Please retry or use a Pass PIN.');
    } finally {
      setBusy(false);
    }
  };

  const handleVerifyPaystack = useCallback(
    async (refToVerify: string) => {
      if (!isValidPaystackReference(refToVerify)) {
        setErrorMsg('Invalid payment reference.');
        return;
      }
      setBusy(true);
      setErrorMsg(null);
      setSuccessMsg(null);
      try {
        const headers = await buildOptionalAuthHeaders(true, progress.devToken);
        const resp = await fetch('/api/billing/paystack/verify', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            reference: refToVerify,
          }),
        });
        const data = (await resp.json().catch(() => ({}))) as {
          ok?: boolean;
          error?: string;
          entitlementPublicKey?: JsonWebKey;
          pro?: NonNullable<UserProgress['pro']>;
          planName?: string;
        };

        if (!resp.ok || !data.ok || !data.pro) {
          setErrorMsg(
            data.error ||
              'Payment has not been confirmed yet. Complete checkout first, then tap Verify payment status.'
          );
          return;
        }

        if (data.entitlementPublicKey && data.entitlementPublicKey.kty === 'EC') {
          try {
            window.localStorage.setItem('rtc_pub_jwk_v1', JSON.stringify(data.entitlementPublicKey));
          } catch {
            /* ignore */
          }
        }

        try {
          window.sessionStorage.removeItem('eyak_pending_paystack_ref');
        } catch {
          /* ignore */
        }

        const summary = `${data.planName || 'EYAK Premium'} verified (${formatPremiumRemaining(data.pro.until, undefined, data.pro.pid)}).`;
        setSuccessMsg(summary);
        setCheckoutSession(null);
        onActivated(data.pro, summary);
      } catch {
        setErrorMsg('Network error while verifying payment. Please retry in a moment.');
      } finally {
        setBusy(false);
      }
    },
    [progress.devToken, onActivated]
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-xs overflow-y-auto"
      onClick={(e) => {
        if (!blocking && e.target === e.currentTarget && !busy) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="paywall-dialog-title"
        className="w-full max-w-[740px] my-auto rounded-[26px] bg-[var(--card)] border-2 border-[var(--line)] shadow-2xl p-5 sm:p-6 flex flex-col gap-5 ul-liquid-modal max-h-[92vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-[12.5px] font-bold text-[var(--gold)]">
              EYAK Full Access Pass · Road to Campus
            </span>
            <h2
              id="paywall-dialog-title"
              className="font-[var(--display)] font-extrabold text-[22px] sm:text-[25px] text-[var(--ink)] leading-tight"
            >
              {isAlreadyPremium
                ? 'Your EYAK study pass is active'
                : blocking
                  ? 'Your 3-day starter trial has ended'
                  : 'Choose any pass for 100% full access'}
            </h2>
            <p className="text-[13.5px] text-[var(--dim)] leading-snug">
              {blocking
                ? 'Your 3-day starter trial is complete. Subscribe to any plan starting from ₦1,000/month to unlock 100% full access across EYAK.'
                : reason ||
                  'Every paid plan — even ₦1,000/month — unlocks 100% full access. During your first 3 days without a pass, Live Tutor, Voice Tutor, CBT Mock Exams, Virtual Labs and Colour Themes are locked.'}
            </p>
          </div>
          {!blocking ? (
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              aria-label="Close upgrade dialog"
              className="w-9 h-9 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-[var(--dim)] hover:text-[var(--ink)] flex items-center justify-center shrink-0 cursor-pointer transition-colors"
            >
              <Icon name="x" size={17} />
            </button>
          ) : onSignOut ? (
            <button
              type="button"
              onClick={onSignOut}
              disabled={busy}
              className="min-h-[36px] px-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-[12.5px] font-bold text-[var(--dim)] hover:text-[var(--ink)] flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors whitespace-nowrap"
            >
              <Icon name="logout" size={14} />
              <span>Sign out</span>
            </button>
          ) : null}
        </div>

        {/* Active Pass Confirmation Banner */}
        {isAlreadyPremium && (
          <div className="rounded-2xl bg-[var(--ok-soft)] border border-[var(--ok-line)] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-[var(--green)] text-white flex items-center justify-center shrink-0">
                <Icon name="check" size={18} />
              </span>
              <div>
                <div className="font-[var(--display)] font-bold text-[15px] text-[var(--ink)]">
                  {progress.pro?.planName || 'EYAK Premium'} · {remainingLabel}
                </div>
                <div className="text-[12.5px] text-[var(--dim)]">
                  All 49 subjects, Live Tutor, Voice Tutor, CBT Mock Exams, Virtual Labs and all 10 colour themes are unlocked.
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="btn-tactile indigo min-h-[38px] px-4 text-[13px] whitespace-nowrap shrink-0"
            >
              Continue studying
            </button>
          </div>
        )}

        {/* What Every Paid Plan Unlocks (Clean 2x2 Grid, No Pill Clutter) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-2xl bg-[var(--bg)] border border-[var(--line)] p-4">
          <div className="flex flex-col gap-0.5">
            <div className="font-[var(--display)] font-bold text-[14px] text-[var(--ink)]">
              Live Tutor &amp; Studio Voice Tutor
            </div>
            <p className="text-[12.5px] text-[var(--dim)] leading-snug">
              Speak out loud with your personal tutor and hear guided voice explanations on every note and formula.
            </p>
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="font-[var(--display)] font-bold text-[14px] text-[var(--ink)]">
              Full CBT Mock Exams &amp; Virtual Labs
            </div>
            <p className="text-[12.5px] text-[var(--dim)] leading-snug">
              Practise timed 180-question JAMB UTME &amp; WAEC papers plus hands-on Science, Maths and SQL labs.
            </p>
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="font-[var(--display)] font-bold text-[14px] text-[var(--ink)]">
              All 10 Colour Themes
            </div>
            <p className="text-[12.5px] text-[var(--dim)] leading-snug">
              Unlock Savanna sunrise, Rainforest jade, Starlight observatory, Chancellor obsidian and all 9 extra colour palettes.
            </p>
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="font-[var(--display)] font-bold text-[14px] text-[var(--ink)]">
              All 49 subjects &amp; 600+ topics
            </div>
            <p className="text-[12.5px] text-[var(--dim)] leading-snug">
              Unrestricted access across every JAMB UTME, WAEC school and trade subject — even on the ₦1,000 pass.
            </p>
          </div>
        </div>

        {/* Plan Selector */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <h3 className="font-[var(--display)] font-bold text-[15.5px] text-[var(--ink)]">
              Choose your study pass (100% full access on every plan)
            </h3>
            <span className="text-[12px] font-semibold text-[var(--dim)]">
              One-time pass · No auto-debit
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5" role="group" aria-label="Premium plans">
            {PREMIUM_PLANS.map((plan) => {
              const active = selectedPlan === plan.id;
              return (
                <button
                  key={plan.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setSelectedPlan(plan.id);
                    setErrorMsg(null);
                  }}
                  className={`rounded-2xl border-2 p-3.5 text-left flex flex-col justify-between gap-2 transition cursor-pointer ${
                    active
                      ? 'bg-[var(--acc-soft)]/60 border-[var(--gold)] ring-1 ring-[var(--gold)]/25'
                      : 'bg-[var(--bg)] border-[var(--line)] hover:border-[var(--acc-line)]'
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-1 text-[11px] font-bold">
                      <span className={plan.popular ? 'text-[var(--gold)]' : 'text-[var(--dim)]'}>
                        {plan.popular ? 'Best value' : plan.shortLabel}
                      </span>
                      {plan.savingsBadge && (
                        <span className="text-[var(--green)] tabular-nums">{plan.savingsBadge}</span>
                      )}
                    </div>
                    <div className="font-[var(--display)] font-bold text-[14.5px] text-[var(--ink)]">
                      {plan.name}
                    </div>
                    <div className="font-[var(--display)] font-extrabold text-[20px] sm:text-[21px] text-[var(--ink)] tabular-nums leading-tight">
                      ₦{plan.priceNgn.toLocaleString()}
                    </div>
                  </div>
                  <p className="text-[11px] text-[var(--dim)] leading-snug">{plan.blurb}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Method Switcher (Liquid Capsule Bar) */}
        <div className="flex flex-col gap-3.5">
          <LiquidCapsuleBar
            roleType="tablist"
            layoutMode="grid"
            gridClassName="grid-cols-2 gap-1.5"
            ariaLabel="Activation method"
            items={[
              { id: 'pin' as const, label: 'Enter Pass PIN', icon: 'key' },
              { id: 'paystack' as const, label: 'Pay online (Card / Transfer)', icon: 'shield' },
            ]}
            value={tab}
            onChange={(nextTab) => {
              setTab(nextTab);
              setErrorMsg(null);
            }}
          />

          {errorMsg && (
            <div
              role="alert"
              className="rounded-xl bg-[var(--bad-soft)] border border-[var(--bad-line)] px-3.5 py-2.5 text-[13px] font-semibold text-[var(--coral-ink)] flex items-start gap-2"
            >
              <Icon name="x" size={16} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div
              role="status"
              className="rounded-xl bg-[var(--ok-soft)] border border-[var(--ok-line)] px-3.5 py-2.5 text-[13px] font-semibold text-[var(--green)] flex items-start gap-2"
            >
              <Icon name="check" size={16} className="shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {tab === 'pin' ? (
            <form onSubmit={handleRedeemPin} className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[12.5px] text-[var(--dim)]">
                <label htmlFor="eyak-voucher-input" className="font-bold text-[var(--ink)]">
                  Enter your 12-character EYAK Pass PIN
                </label>
                <button
                  type="button"
                  onClick={() => void handleCopyDeviceId()}
                  className="text-left sm:text-right font-semibold text-[var(--gold)] hover:underline cursor-pointer tabular-nums whitespace-nowrap"
                >
                  Support ID: {fmtDev(progress.dev)} {copiedDevice ? '· Copied' : '· Copy'}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  id="eyak-voucher-input"
                  type="text"
                  autoComplete="off"
                  spellCheck={false}
                  value={voucherCode}
                  onChange={(e) => {
                    setVoucherCode(e.target.value.toUpperCase());
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder="EYAK-ABCD-2345"
                  className="flex-1 min-h-[44px] px-4 rounded-xl bg-[var(--bg)] border-2 border-[var(--line)] focus:border-[var(--gold)] focus:bg-[var(--card)] font-mono font-bold text-[15px] tracking-wider text-[var(--ink)] outline-none transition"
                />
                <button
                  type="submit"
                  disabled={busy || !voucherCode.trim()}
                  className="btn-tactile indigo min-h-[44px] px-5 text-[14px] whitespace-nowrap shrink-0 disabled:opacity-50"
                >
                  <Icon name="unlock" size={16} />
                  <span>{busy ? 'Activating…' : 'Activate pass'}</span>
                </button>
              </div>
              <p className="text-[12px] text-[var(--dim)]">
                Each Pass PIN is verified on the server and unlocks your chosen plan immediately.
              </p>
            </form>
          ) : paystackEnabled ? (
            <div className="flex flex-col gap-3">
              <form onSubmit={handleStartPaystack} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="eyak-paystack-email"
                    className="text-[12.5px] font-bold text-[var(--ink)]"
                  >
                    Email address for your receipt
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <input
                      id="eyak-paystack-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errorMsg) setErrorMsg(null);
                      }}
                      placeholder="student@example.com"
                      className="flex-1 min-h-[44px] px-4 rounded-xl bg-[var(--bg)] border-2 border-[var(--line)] focus:border-[var(--gold)] focus:bg-[var(--card)] text-[14px] font-medium text-[var(--ink)] outline-none transition"
                    />
                    <button
                      type="submit"
                      disabled={busy}
                      className="btn-tactile indigo min-h-[44px] px-5 text-[14px] whitespace-nowrap shrink-0 tabular-nums disabled:opacity-50"
                    >
                      <Icon name="shield" size={16} />
                      <span>
                        {busy
                          ? 'Preparing…'
                          : `Pay ₦${activePlan.priceNgn.toLocaleString()} on Paystack`}
                      </span>
                    </button>
                  </div>
                </div>
              </form>

              {checkoutSession && (
                <div className="rounded-xl bg-[var(--bg)] border border-[var(--acc-line)] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-[12.5px] text-[var(--dim)]">
                    <div className="font-bold text-[var(--ink)]">
                      Complete payment, then verify instantly
                    </div>
                    <div className="font-mono text-[11.5px] mt-0.5">
                      Ref: {checkoutSession.reference}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {checkoutSession.authorizationUrl && (
                      <a
                        href={checkoutSession.authorizationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-tactile paper min-h-[38px] px-3.5 text-[12.5px] whitespace-nowrap"
                      >
                        <span>Open Paystack ↗</span>
                      </a>
                    )}
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void handleVerifyPaystack(checkoutSession.reference)}
                      className="btn-tactile indigo min-h-[38px] px-3.5 text-[12.5px] whitespace-nowrap"
                    >
                      <Icon name="check" size={15} />
                      <span>{busy ? 'Checking…' : 'Verify payment status'}</span>
                    </button>
                  </div>
                </div>
              )}

              <p className="text-[12px] text-[var(--dim)]">
                Supports Nigerian debit cards, bank transfer and USSD via Paystack.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl bg-[var(--bg)] border border-[var(--line)] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-col gap-1">
                <div className="font-[var(--display)] font-bold text-[14.5px] text-[var(--ink)]">
                  Activate with an EYAK Pass PIN
                </div>
                <p className="text-[12.5px] text-[var(--dim)] leading-snug">
                  Online card and bank-transfer checkout turns on automatically once a Paystack key is added. Use a Pass PIN to unlock {activePlan.name.toLowerCase()} right away.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setTab('pin')}
                className="btn-tactile indigo min-h-[38px] px-4 text-[13px] whitespace-nowrap shrink-0"
              >
                <Icon name="key" size={15} />
                <span>Enter Pass PIN</span>
              </button>
            </div>
          )}
        </div>
        {!blocking && !isAlreadyPremium && trialDaysRemaining > 0 && (
          <div className="pt-3 border-t border-[var(--line)] flex flex-col items-center gap-1.5">
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="w-full min-h-[42px] px-4 rounded-xl bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--acc-line)] text-[13px] font-bold text-[var(--dim)] hover:text-[var(--ink)] transition cursor-pointer"
            >
              Continue 3-day starter trial ({trialDaysRemaining}{' '}
              {trialDaysRemaining === 1 ? 'day' : 'days'} left — basic notes &amp; practice only)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface AdminVoucherItem {
  code: string;
  planId: string;
  days: number;
  priceNgn: number;
  note: string;
  redeemedByDeviceId: string | null;
  redeemedAtIso: string | null;
  revoked: boolean;
}

export function AdminVoucherStudio() {
  const [planId, setPlanId] = useState<PremiumPlanId>('annual');
  const [count, setCount] = useState<number>(5);
  const [note, setNote] = useState<string>('');
  const [busy, setBusy] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [latestBatch, setLatestBatch] = useState<string[]>([]);
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);
  const [overview, setOverview] = useState<{
    activeSubscriptionsCount: number;
    recentUnredeemedCount: number;
    recentRedeemedCount: number;
    vouchers: AdminVoucherItem[];
  } | null>(null);

  const loadOverview = useCallback(async () => {
    setLoadingList(true);
    try {
      const headers = await buildOptionalAuthHeaders(false);
      const resp = await fetch('/api/admin/billing/overview', { headers });
      if (!resp.ok) return;
      const data = (await resp.json()) as {
        activeSubscriptionsCount: number;
        recentUnredeemedCount: number;
        recentRedeemedCount: number;
        vouchers: AdminVoucherItem[];
      };
      setOverview(data);
    } catch {
      /* ignore transient fetch failure */
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    void loadOverview();
  }, [loadOverview]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErrorMsg(null);
    try {
      const headers = await buildOptionalAuthHeaders(true);
      const resp = await fetch('/api/admin/billing/vouchers', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          planId,
          count,
          note: note.trim(),
        }),
      });
      const data = (await resp.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        batch?: { codes: string[] };
      };
      if (!resp.ok || !data.ok || !data.batch) {
        setErrorMsg(data.error || 'Could not generate Pass PINs.');
        return;
      }
      setLatestBatch(data.batch.codes);
      setNote('');
      await loadOverview();
    } catch {
      setErrorMsg('Network error while generating Pass PINs.');
    } finally {
      setBusy(false);
    }
  };

  const copyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLabel(label);
      window.setTimeout(() => setCopiedLabel(null), 2000);
    } catch {
      setCopiedLabel(null);
    }
  };

  return (
    <section className="rtc-card rounded-2xl p-5 sm:p-6 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="eyebrow text-[var(--gold)]">Owner billing studio</span>
          <h2 className="h20 text-[var(--ink)]">Generate student Pass PINs</h2>
          <p className="text-[13.5px] text-[var(--dim)]">
            Create single-use activation PINs for bank-transfer, school group, or scholarship students.
          </p>
        </div>
        {overview && (
          <div className="flex items-center gap-2 text-[12.5px] font-bold text-[var(--dim)] tabular-nums shrink-0">
            <span className="text-[var(--green)]">{overview.activeSubscriptionsCount} active</span>
            <span aria-hidden="true">·</span>
            <span>{overview.recentUnredeemedCount} unused</span>
            <span aria-hidden="true">·</span>
            <span>{overview.recentRedeemedCount} used</span>
          </div>
        )}
      </div>

      <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
        <div className="sm:col-span-4 flex flex-col gap-1">
          <label htmlFor="admin-pin-plan" className="text-[12px] font-bold text-[var(--dim)]">
            Plan duration
          </label>
          <select
            id="admin-pin-plan"
            value={planId}
            onChange={(e) => setPlanId(e.target.value as PremiumPlanId)}
            className="min-h-[42px] px-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-[13.5px] font-bold text-[var(--ink)] outline-none"
          >
            {PREMIUM_PLANS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.days >= 3650 ? 'Lifetime' : `${p.days}d`} · ₦{p.priceNgn.toLocaleString()})
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2 flex flex-col gap-1">
          <label htmlFor="admin-pin-count" className="text-[12px] font-bold text-[var(--dim)]">
            Quantity
          </label>
          <select
            id="admin-pin-count"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="min-h-[42px] px-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-[13.5px] font-bold text-[var(--ink)] outline-none tabular-nums"
          >
            {[1, 5, 10, 20].map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? 'PIN' : 'PINs'}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-4 flex flex-col gap-1">
          <label htmlFor="admin-pin-note" className="text-[12px] font-bold text-[var(--dim)]">
            Label or student note (optional)
          </label>
          <input
            id="admin-pin-note"
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. WhatsApp transfer — Chinedu"
            className="min-h-[42px] px-3.5 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-[13.5px] text-[var(--ink)] outline-none"
          />
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={busy}
            className="btn-tactile indigo w-full min-h-[42px] px-4 text-[13px] justify-center whitespace-nowrap"
          >
            <span>{busy ? 'Creating…' : 'Create PINs'}</span>
          </button>
        </div>
      </form>

      {errorMsg && (
        <div className="rounded-xl bg-[var(--bad-soft)] border border-[var(--bad-line)] px-3.5 py-2 text-[12.5px] font-semibold text-[var(--coral-ink)]">
          {errorMsg}
        </div>
      )}

      {latestBatch.length > 0 && (
        <div className="rounded-2xl bg-[var(--acc-soft)]/50 border border-[var(--acc-line)] p-4 flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[13px] font-bold text-[var(--ink)]">
              Newly created Pass PINs ({latestBatch.length})
            </span>
            <button
              type="button"
              onClick={() => void copyText(latestBatch.join('\n'), 'batch')}
              className="btn-tactile paper min-h-[34px] px-3 text-[12px] whitespace-nowrap"
            >
              <span>{copiedLabel === 'batch' ? 'Copied all' : 'Copy all PINs'}</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {latestBatch.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => void copyText(code, code)}
                className="rounded-xl bg-[var(--card)] border border-[var(--line)] px-3 py-2 text-left flex items-center justify-between gap-2 font-mono font-bold text-[13px] text-[var(--ink)] cursor-pointer hover:border-[var(--gold)]"
              >
                <span>{code}</span>
                <span className="font-sans text-[11px] text-[var(--gold)]">
                  {copiedLabel === code ? 'Copied' : 'Copy'}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {overview && overview.vouchers.length > 0 && (
        <div className="overflow-x-auto border-t border-[var(--line)] pt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12.5px] font-bold text-[var(--dim)]">
              Recent Pass PINs ({overview.vouchers.length})
            </span>
            <button
              type="button"
              onClick={() => void loadOverview()}
              disabled={loadingList}
              className="text-[12px] font-bold text-[var(--gold)] hover:underline cursor-pointer"
            >
              {loadingList ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>
          <table className="w-full text-left text-[12.5px] border-collapse">
            <thead>
              <tr className="border-b border-[var(--line)] text-[var(--dim)]">
                <th className="py-2 pr-3 font-semibold">Pass PIN</th>
                <th className="py-2 pr-3 font-semibold">Plan</th>
                <th className="py-2 pr-3 font-semibold">Note</th>
                <th className="py-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {overview.vouchers.slice(0, 12).map((v) => (
                <tr key={v.code} className="border-b border-[var(--line)]/60">
                  <td className="py-2 pr-3 font-mono font-bold text-[var(--ink)] whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => void copyText(v.code, v.code)}
                      className="hover:text-[var(--gold)] cursor-pointer"
                    >
                      {v.code} {copiedLabel === v.code ? '✓' : ''}
                    </button>
                  </td>
                  <td className="py-2 pr-3 text-[var(--dim)] tabular-nums whitespace-nowrap">
                    {v.days >= 3650 ? 'Lifetime' : `${v.days}d`} · ₦{v.priceNgn.toLocaleString()}
                  </td>
                  <td className="py-2 pr-3 text-[var(--dim)] max-w-[180px] truncate">
                    {v.note || '—'}
                  </td>
                  <td className="py-2 font-semibold whitespace-nowrap">
                    {v.revoked ? (
                      <span className="text-[var(--coral-ink)]">Revoked</span>
                    ) : v.redeemedAtIso ? (
                      <span className="text-[var(--dim)]">
                        Used ({v.redeemedByDeviceId || 'account'})
                      </span>
                    ) : (
                      <span className="text-[var(--green)]">Unused</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
