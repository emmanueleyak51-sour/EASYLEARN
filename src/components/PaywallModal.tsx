import React, { useCallback, useEffect, useState } from 'react';
import { auth } from '../firebase';
import type { UserProgress } from '../types';
import {
  PREMIUM_PLANS,
  buildPassPinWhatsAppUrl,
  formatPassPinClipboardBatch,
  formatPremiumRemaining,
  getPremiumPlanById,
  hasActivePremium,
  isRecurringPlanId,
  isValidEmailAddress,
  isValidPaystackReference,
  isValidVoucherCodeFormat,
  looksLikeRawCardNumber,
  normalizeVoucherCode,
  type PremiumPlanId,
  type SubscriptionAutoRenewInfo,
  type TrialLinkInfo,
  type TrialPaymentMethod,
} from '../utils/paywallLogic';
import { Icon } from './Icons';

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
  initialPlanId,
  blocking = false,
  trialDaysRemaining = 0,
  trialCountdownLabel,
  trialLink = null,
  subscriptionAutoRenew = null,
  onTrialLinkChanged,
  onSubscriptionAutoRenewChanged,
  onSignOut,
  onActivated,
  onClose,
}: {
  open: boolean;
  reason?: string;
  progress: UserProgress;
  paystackEnabled: boolean;
  initialReference?: string | null;
  initialPlanId?: PremiumPlanId | null;
  blocking?: boolean;
  trialDaysRemaining?: number;
  trialCountdownLabel?: string;
  trialLink?: TrialLinkInfo | null;
  subscriptionAutoRenew?: SubscriptionAutoRenewInfo | null;
  onTrialLinkChanged?: (
    trialLink: TrialLinkInfo | null,
    trial?: NonNullable<UserProgress['trial']> | null
  ) => void;
  onSubscriptionAutoRenewChanged?: (info: SubscriptionAutoRenewInfo | null) => void;
  onSignOut?: () => void;
  onActivated: (pro: NonNullable<UserProgress['pro']>, summaryText: string) => void;
  onClose: () => void;
}) {
  const [selectedPlan, setSelectedPlan] = useState<PremiumPlanId>(initialPlanId || 'annual');
  const [email, setEmail] = useState(() => auth.currentUser?.email || '');
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showRefInput, setShowRefInput] = useState(false);
  const [manualReference, setManualReference] = useState('');
  const [checkoutSession, setCheckoutSession] = useState<{
    authorizationUrl: string;
    reference: string;
  } | null>(null);

  useEffect(() => {
    if (!open) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    if (initialPlanId && getPremiumPlanById(initialPlanId)) {
      setSelectedPlan(initialPlanId);
    }
    if (auth.currentUser?.email && !email) {
      setEmail(auth.currentUser.email);
    }
    if (initialReference && isValidPaystackReference(initialReference)) {
      setCheckoutSession((prev) =>
        prev?.reference === initialReference
          ? prev
          : { authorizationUrl: '', reference: initialReference }
      );
    }
  }, [open, initialReference, initialPlanId, email]);

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

  const handleStartPaystack = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!isValidEmailAddress(email)) {
      setErrorMsg('Enter a valid email address for your Paystack payment receipt.');
      return;
    }

    if (!paystackEnabled) {
      setErrorMsg(
        'Online card checkout is temporarily unavailable. Redeem an Easy Learn Pass PIN below to unlock immediately.'
      );
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
      setErrorMsg('Could not connect to Paystack right now. Check your connection and retry.');
    } finally {
      setBusy(false);
    }
  };

  const handleVerifyPaystack = useCallback(
    async (refToVerify: string) => {
      const cleanRef = refToVerify.trim();
      if (!isValidPaystackReference(cleanRef)) {
        setErrorMsg('Enter a valid Paystack payment reference (for example eyak_annual_...).');
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
            reference: cleanRef,
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
              'Payment has not been confirmed yet. Complete checkout on Paystack first, then tap Verify payment status.'
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

        const summary = `${data.planName || 'Easy Learn Premium'} verified via Paystack (${formatPremiumRemaining(data.pro.until, undefined, data.pro.pid)}).`;
        setSuccessMsg(summary);
        setCheckoutSession(null);
        setManualReference('');
        setShowRefInput(false);
        onActivated(data.pro, summary);
      } catch {
        setErrorMsg('Network error while verifying Paystack payment. Please retry in a moment.');
      } finally {
        setBusy(false);
      }
    },
    [progress.devToken, onActivated]
  );

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center p-3 sm:p-5 overflow-y-auto ${
        blocking ? 'z-[65] bg-black/80 backdrop-blur-md' : 'z-50 bg-black/65 backdrop-blur-xs'
      }`}
      onClick={(e) => {
        if (!blocking && e.target === e.currentTarget && !busy) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="paywall-dialog-title"
        className="w-full max-w-[760px] my-auto rounded-[26px] bg-[var(--card)] border-2 border-[var(--line)] shadow-2xl p-5 sm:p-6 flex flex-col gap-5 ul-liquid-modal max-h-[92vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1 min-w-0">
            <span className={`text-[12.5px] font-bold ${blocking ? 'text-[var(--coral-ink)]' : 'text-[var(--gold)]'}`}>
              {blocking ? 'App Locked · Subscription Required' : 'Easy Learn Study Pass'}
            </span>
            <h2
              id="paywall-dialog-title"
              className="font-[var(--display)] font-extrabold text-[22px] sm:text-[25px] text-[var(--ink)] leading-tight"
            >
              {isAlreadyPremium
                ? 'Your Easy Learn study pass is active'
                : blocking
                  ? 'Free trial expired'
                  : 'Unlock full access'}
            </h2>
            <p className="text-[13.5px] text-[var(--dim)] leading-snug">
              {blocking
                ? 'Subscribe below or redeem an Easy Learn Pass PIN to continue.'
                : reason ||
                  'All 49 subjects, voice teachers, virtual labs, and CBT mocks. Cancel anytime.'}
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

        {/* Active Pass Confirmation + Recurring Auto-Debit Control */}
        {isAlreadyPremium && (
          <div className="flex flex-col gap-2.5">
            <div className="rounded-2xl bg-[var(--ok-soft)] border border-[var(--ok-line)] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-[var(--green)] text-white flex items-center justify-center shrink-0">
                  <Icon name="check" size={18} />
                </span>
                <div>
                  <div className="font-[var(--display)] font-bold text-[15px] text-[var(--ink)]">
                    {progress.pro?.planName || 'Easy Learn Premium'} · {remainingLabel}
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
            {progress.pro && (
              <RecurringAutoRenewCard
                devToken={progress.devToken}
                pro={progress.pro}
                subscriptionAutoRenew={subscriptionAutoRenew}
                onChanged={onSubscriptionAutoRenewChanged}
              />
            )}
          </div>
        )}

        {/* 1-Day Free Trial Google Pay / Account Link + Cancel Anytime */}
        {!isAlreadyPremium && (!blocking || trialLink) && (
          <OneDayTrialLinkCard
            devToken={progress.devToken}
            defaultEmail={email || auth.currentUser?.email || ''}
            trialLink={trialLink}
            trialCountdownLabel={trialCountdownLabel}
            isTrialExpired={blocking}
            onChanged={onTrialLinkChanged}
          />
        )}

        {/* What Every Paid Plan Unlocks (Clean 2x2 Grid, No Pill Clutter) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-2xl bg-[var(--bg)] border border-[var(--line)] p-4">
          <div className="flex flex-col gap-0.5">
            <div className="font-[var(--display)] font-bold text-[14px] text-[var(--ink)]">
              Live &amp; Studio Voice Teachers
            </div>
            <p className="text-[12.5px] text-[var(--dim)] leading-snug">
              Guided spoken explanations and live Q&amp;A on every topic and formula.
            </p>
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="font-[var(--display)] font-bold text-[14px] text-[var(--ink)]">
              CBT Mock Exams &amp; 87 Labs
            </div>
            <p className="text-[12.5px] text-[var(--dim)] leading-snug">
              Timed 180-question UTME &amp; WAEC mocks plus Science, Maths, and SQL labs.
            </p>
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="font-[var(--display)] font-bold text-[14px] text-[var(--ink)]">
              All 10 Colour Themes
            </div>
            <p className="text-[12.5px] text-[var(--dim)] leading-snug">
              Customise your study space with 10 curated reading palettes.
            </p>
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="font-[var(--display)] font-bold text-[14px] text-[var(--ink)]">
              All 49 Subjects &amp; 8 Novels
            </div>
            <p className="text-[12.5px] text-[var(--dim)] leading-snug">
              Every UTME, WAEC school, and trade subject unlocked on every plan.
            </p>
          </div>
        </div>

        {/* Plan Selector */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <h3 className="font-[var(--display)] font-bold text-[15.5px] text-[var(--ink)]">
              Choose your plan
            </h3>
            <span className="text-[12px] font-semibold text-[var(--dim)]">
              Cancel anytime · Lifetime is one-time
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
                    <div
                      className={`text-[10.5px] font-bold leading-snug ${
                        plan.isRecurring ? 'text-[var(--gold)]' : 'text-[var(--green)]'
                      }`}
                    >
                      {plan.billingCycleLabel}
                    </div>
                  </div>
                  <p className="text-[11px] text-[var(--dim)] leading-snug">{plan.blurb}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 100% Paystack Online Checkout */}
        <div className="flex flex-col gap-3 rounded-2xl bg-[var(--bg)] border border-[var(--line)] p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-[12.5px]">
            <span className="font-[var(--display)] font-bold text-[var(--ink)]">
              Instant Paystack Checkout · Card, Bank Transfer &amp; USSD
            </span>
            <span className="text-[var(--dim)] font-semibold">
              Unlocks your account automatically upon payment
            </span>
          </div>

          {!paystackEnabled && (
            <div
              role="status"
              className="rounded-xl bg-[var(--card)] border border-[var(--acc-line)] px-3.5 py-2.5 text-[12.5px] text-[var(--dim)] leading-snug"
            >
              <strong className="text-[var(--ink)]">Pass PIN mode active:</strong> Online card checkout is currently offline. Enter an Easy Learn Pass PIN below for instant activation.
            </div>
          )}

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

          <form onSubmit={handleStartPaystack} noValidate className="flex flex-col gap-2.5">
            <label
              htmlFor="eyak-paystack-email"
              className="text-[12.5px] font-bold text-[var(--ink)]"
            >
              Email address for your Paystack receipt &amp; pass
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
                className="flex-1 min-h-[44px] px-4 rounded-xl bg-[var(--card)] border-2 border-[var(--line)] focus:border-[var(--gold)] text-[14px] font-medium text-[var(--ink)] outline-none transition"
              />
              <button
                type="submit"
                disabled={busy}
                className="btn-tactile indigo min-h-[44px] px-5 text-[14px] whitespace-nowrap shrink-0 tabular-nums disabled:opacity-50"
              >
                <Icon name="shield" size={16} />
                <span>
                  {busy
                    ? 'Connecting to Paystack…'
                    : `Pay ₦${activePlan.priceNgn.toLocaleString()} on Paystack`}
                </span>
              </button>
            </div>
          </form>

          {checkoutSession && (
            <div className="rounded-xl bg-[var(--card)] border border-[var(--acc-line)] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-[12.5px] text-[var(--dim)]">
                <div className="font-bold text-[var(--ink)]">
                  Complete payment on Paystack, then verify instantly
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

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[12px] text-[var(--dim)]">
            <span>
              Secured by Paystack Nigeria · Instant debit card, bank transfer &amp; USSD settlement.
            </span>
            <button
              type="button"
              aria-expanded={showRefInput}
              onClick={() => {
                setShowRefInput((v) => !v);
                setErrorMsg(null);
              }}
              className="font-bold text-[var(--gold)] hover:underline cursor-pointer whitespace-nowrap"
            >
              {showRefInput ? 'Hide reference check' : 'Already paid on Paystack? Verify reference'}
            </button>
          </div>

          {showRefInput && (
            <div className="pt-2 border-t border-[var(--line)] flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                aria-label="Paystack payment reference"
                value={manualReference}
                onChange={(e) => {
                  setManualReference(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder="Paste Paystack reference (e.g. eyak_annual_...)"
                className="flex-1 min-h-[40px] px-3.5 rounded-xl bg-[var(--card)] border border-[var(--line)] focus:border-[var(--gold)] font-mono text-[13px] text-[var(--ink)] outline-none"
              />
              <button
                type="button"
                disabled={busy || !manualReference.trim()}
                onClick={() => void handleVerifyPaystack(manualReference)}
                className="btn-tactile paper min-h-[40px] px-4 text-[13px] whitespace-nowrap shrink-0 disabled:opacity-50"
              >
                <Icon name="check" size={15} />
                <span>Verify Paystack receipt</span>
              </button>
            </div>
          )}

          <div className="pt-2.5 border-t border-[var(--line)]">
            <PassPinRedeemBox
              devToken={progress.devToken}
              onActivated={(pro, summary) => {
                setSuccessMsg(summary);
                setErrorMsg(null);
                onActivated(pro, summary);
              }}
            />
          </div>
        </div>

        {!blocking && !isAlreadyPremium && trialDaysRemaining > 0 && (
          <div className="pt-3 border-t border-[var(--line)] flex flex-col items-center gap-1.5">
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="w-full min-h-[42px] px-4 rounded-xl bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--acc-line)] text-[13px] font-bold text-[var(--dim)] hover:text-[var(--ink)] transition cursor-pointer tabular-nums"
            >
              Continue free trial ({trialCountdownLabel ? `${trialCountdownLabel} left` : '24h window'})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function OneDayTrialLinkCard({
  devToken,
  defaultEmail = '',
  trialLink,
  trialCountdownLabel,
  isTrialExpired = false,
  onChanged,
}: {
  devToken?: string;
  defaultEmail?: string;
  trialLink: TrialLinkInfo | null;
  trialCountdownLabel?: string;
  isTrialExpired?: boolean;
  onChanged?: (
    trialLink: TrialLinkInfo | null,
    trial?: NonNullable<UserProgress['trial']> | null
  ) => void;
}) {
  const [methodType, setMethodType] = useState<TrialPaymentMethod>(
    trialLink?.methodType || 'google_pay'
  );
  const [billingEmail, setBillingEmail] = useState(
    trialLink?.billingEmail || defaultEmail || auth.currentUser?.email || ''
  );
  const [accountLabel, setAccountLabel] = useState(trialLink?.accountLabel || '');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    if (!billingEmail && (defaultEmail || auth.currentUser?.email)) {
      setBillingEmail(defaultEmail || auth.currentUser?.email || '');
    }
  }, [defaultEmail, billingEmail]);

  const handleLinkTrial = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setInfo(null);
    if (!isValidEmailAddress(billingEmail)) {
      setErr('Enter a valid Google or billing email address to link your 1-day free trial.');
      return;
    }
    if (looksLikeRawCardNumber(accountLabel)) {
      setErr(
        'Do not enter raw card numbers here — enter only your Google email or bank/account name.'
      );
      return;
    }
    setBusy(true);
    try {
      const headers = await buildOptionalAuthHeaders(true, devToken);
      const resp = await fetch('/api/billing/trial/link', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          methodType,
          billingEmail: billingEmail.trim(),
          accountLabel: accountLabel.trim(),
        }),
      });
      const data = (await resp.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        trial?: NonNullable<UserProgress['trial']> | null;
        trialLink?: TrialLinkInfo;
      };
      if (!resp.ok || !data.ok || !data.trialLink) {
        setErr(data.error || 'Could not link your payment account right now.');
        return;
      }
      setInfo(
        '1-day free trial linked! Auto-renews after 24 hours unless you cancel beforehand — you can cancel anytime in 1 click.'
      );
      onChanged?.(data.trialLink, data.trial || null);
    } catch {
      setErr('Network error while linking your payment account. Please retry.');
    } finally {
      setBusy(false);
    }
  };

  const handleCancelTrial = async () => {
    setBusy(true);
    setErr(null);
    setInfo(null);
    try {
      const headers = await buildOptionalAuthHeaders(true, devToken);
      const resp = await fetch('/api/billing/trial/cancel', {
        method: 'POST',
        headers,
      });
      const data = (await resp.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        trialLink?: TrialLinkInfo;
      };
      if (!resp.ok || !data.ok || !data.trialLink) {
        setErr(data.error || 'Could not cancel right now. Please retry.');
        return;
      }
      setInfo(
        'Cancelled — you will not be charged. Everything in the app will lock once your countdown reaches 00:00:00 unless you resubscribe.'
      );
      onChanged?.(data.trialLink, null);
    } catch {
      setErr('Network error while cancelling trial. Please retry.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      id="one-day-trial-link-card"
      className="rounded-2xl bg-[var(--bg)] border border-[var(--acc-line)] p-4 flex flex-col gap-3"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <span className="text-[11.5px] font-bold uppercase tracking-wider text-[var(--gold)]">
            1-Day Free Trial · Cancel Anytime
          </span>
          <div className="font-[var(--display)] font-bold text-[15px] text-[var(--ink)]">
            {trialLink?.linked
              ? trialLink.status === 'cancelled'
                ? 'Trial auto-renewal cancelled'
                : `${trialLink.methodType === 'google_pay' ? 'Google Pay' : 'Billing Account'} linked`
              : 'Link Google Pay or billing account'}
          </div>
          <p className="text-[12.5px] text-[var(--dim)] leading-snug">
            {trialLink?.linked
              ? trialLink.status === 'cancelled'
                ? 'Access continues until your 24-hour timer ends.'
                : `Linked to ${trialLink.billingEmail}. Auto-renews at ₦1,000/mo after 24h unless cancelled.`
              : '₦0 today for 24 hours. Auto-renews after trial unless cancelled beforehand.'}
          </p>
        </div>
        {trialCountdownLabel && !isTrialExpired && (
          <span className="px-2.5 py-1 rounded-lg bg-[var(--card)] border border-[var(--line)] font-mono font-extrabold text-[12.5px] text-[var(--gold)] tabular-nums shrink-0">
            {trialCountdownLabel} left
          </span>
        )}
      </div>

      {trialLink?.linked ? (
        <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-xl bg-[var(--card)] border border-[var(--line)] px-3.5 py-2.5">
          <div className="text-[12.5px] text-[var(--ink)]">
            <span className="font-bold">
              {trialLink.methodType === 'google_pay' ? 'Google Pay' : 'Account Details'}:
            </span>{' '}
            <span>{trialLink.accountLabel}</span>{' '}
            <span className="text-[var(--dim)]">· {trialLink.billingEmail}</span>
          </div>
          {trialLink.status === 'active' ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => void handleCancelTrial()}
              className="btn-tactile paper min-h-[34px] px-3.5 text-[12.5px] text-[var(--coral-ink)] whitespace-nowrap shrink-0 disabled:opacity-50"
            >
              <span>{busy ? 'Cancelling…' : 'Cancel Anytime'}</span>
            </button>
          ) : (
            <span className="text-[12px] font-bold text-[var(--coral-ink)] whitespace-nowrap">
              Cancelled · No auto-debit
            </span>
          )}
        </div>
      ) : (
        <form onSubmit={handleLinkTrial} className="flex flex-col gap-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              aria-pressed={methodType === 'google_pay'}
              onClick={() => setMethodType('google_pay')}
              className={`min-h-[38px] px-3 rounded-xl border text-[12.5px] font-bold text-left flex items-center justify-between cursor-pointer transition ${
                methodType === 'google_pay'
                  ? 'bg-[var(--acc-soft)] border-[var(--gold)] text-[var(--ink)]'
                  : 'bg-[var(--card)] border-[var(--line)] text-[var(--dim)] hover:text-[var(--ink)]'
              }`}
            >
              <span>Google Payment Account (Google Pay)</span>
              {methodType === 'google_pay' && <Icon name="check" size={14} className="text-[var(--gold)]" />}
            </button>
            <button
              type="button"
              aria-pressed={methodType === 'card_bank'}
              onClick={() => setMethodType('card_bank')}
              className={`min-h-[38px] px-3 rounded-xl border text-[12.5px] font-bold text-left flex items-center justify-between cursor-pointer transition ${
                methodType === 'card_bank'
                  ? 'bg-[var(--acc-soft)] border-[var(--gold)] text-[var(--ink)]'
                  : 'bg-[var(--card)] border-[var(--line)] text-[var(--dim)] hover:text-[var(--ink)]'
              }`}
            >
              <span>Billing Account Details (Paystack)</span>
              {methodType === 'card_bank' && <Icon name="check" size={14} className="text-[var(--gold)]" />}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
            <input
              type="email"
              aria-label="Google or billing email"
              required
              value={billingEmail}
              onChange={(e) => {
                setBillingEmail(e.target.value);
                if (err) setErr(null);
              }}
              placeholder={
                methodType === 'google_pay'
                  ? 'Your Google Pay email (e.g. name@gmail.com)'
                  : 'Your billing account email'
              }
              className="sm:col-span-5 min-h-[38px] px-3 rounded-xl bg-[var(--card)] border border-[var(--line)] focus:border-[var(--gold)] text-[13px] text-[var(--ink)] outline-none"
            />
            <input
              type="text"
              aria-label="Account or bank name label"
              maxLength={80}
              value={accountLabel}
              onChange={(e) => {
                setAccountLabel(e.target.value);
                if (err) setErr(null);
              }}
              placeholder={
                methodType === 'google_pay'
                  ? 'Label (e.g. Personal Google Pay)'
                  : 'Bank or account label (never enter card PIN/CVV)'
              }
              className="sm:col-span-4 min-h-[38px] px-3 rounded-xl bg-[var(--card)] border border-[var(--line)] focus:border-[var(--gold)] text-[13px] text-[var(--ink)] outline-none"
            />
            <button
              type="submit"
              disabled={busy}
              className="sm:col-span-3 btn-tactile indigo min-h-[38px] px-3.5 text-[12.5px] justify-center whitespace-nowrap disabled:opacity-50"
            >
              <span>{busy ? 'Linking…' : 'Link 1-Day Trial'}</span>
            </button>
          </div>
          <div className="text-[11.5px] text-[var(--dim)]">
            Secured via Google Pay / Paystack tokenization — never type card PINs or CVVs. Cancel anytime before your 24-hour countdown finishes.
          </div>
        </form>
      )}

      {err && (
        <div role="alert" className="text-[12.5px] font-semibold text-[var(--coral-ink)]">
          {err}
        </div>
      )}
      {info && (
        <div role="status" className="text-[12.5px] font-semibold text-[var(--green)]">
          ✓ {info}
        </div>
      )}
    </div>
  );
}

export function RecurringAutoRenewCard({
  devToken,
  pro,
  subscriptionAutoRenew,
  onChanged,
}: {
  devToken?: string;
  pro: NonNullable<UserProgress['pro']>;
  subscriptionAutoRenew: SubscriptionAutoRenewInfo | null;
  onChanged?: (info: SubscriptionAutoRenewInfo | null) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const recurring = isRecurringPlanId(pro.pid);
  const isCancelled = subscriptionAutoRenew?.status === 'cancelled';

  const handleToggle = async (action: 'cancel' | 'resume') => {
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      const headers = await buildOptionalAuthHeaders(true, devToken);
      const resp = await fetch(`/api/billing/subscription/${action}`, {
        method: 'POST',
        headers,
      });
      const data = (await resp.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        subscriptionAutoRenew?: SubscriptionAutoRenewInfo;
      };
      if (!resp.ok || !data.ok || !data.subscriptionAutoRenew) {
        setErr(data.error || 'Could not update auto-renewal right now.');
        return;
      }
      onChanged?.(data.subscriptionAutoRenew);
      setMsg(
        action === 'cancel'
          ? 'Auto-renewal cancelled. You keep full access until your current cycle expires, then everything locks until you resubscribe.'
          : 'Auto-renewal resumed. Your plan will renew automatically at the end of this cycle.'
      );
    } catch {
      setErr('Network error while updating subscription auto-renewal.');
    } finally {
      setBusy(false);
    }
  };

  if (!recurring) {
    return (
      <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-[12.5px]">
        <span className="font-semibold text-[var(--ink)]">
          Lifetime Pass · One-time payment (excluded from automatic renewal / auto-debit)
        </span>
        <span className="font-bold text-[var(--green)]">Permanent access</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] px-3.5 py-3 flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-col gap-0.5 text-[12.5px]">
          <span className="font-bold text-[var(--ink)]">
            {isCancelled
              ? 'Auto-renewal cancelled (no automatic debit scheduled)'
              : 'Automatic renewal active for next billing cycle'}
          </span>
          <span className="text-[var(--dim)]">
            {isCancelled
              ? 'You keep full access until your current expiry date, after which everything in the app locks until you resubscribe.'
              : 'Automatically debited when your current plan expires unless you cancel beforehand.'}
          </span>
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={() => void handleToggle(isCancelled ? 'resume' : 'cancel')}
          className={`btn-tactile paper min-h-[34px] px-3.5 text-[12.5px] whitespace-nowrap shrink-0 disabled:opacity-50 ${
            isCancelled ? 'text-[var(--green)]' : 'text-[var(--coral-ink)]'
          }`}
        >
          <span>
            {busy
              ? 'Updating…'
              : isCancelled
                ? 'Resume Auto-Renew'
                : 'Cancel Auto-Renewal'}
          </span>
        </button>
      </div>
      {err && <div role="alert" className="text-[12px] font-semibold text-[var(--coral-ink)]">{err}</div>}
      {msg && <div role="status" className="text-[12px] font-semibold text-[var(--green)]">✓ {msg}</div>}
    </div>
  );
}

export function PassPinRedeemBox({
  devToken,
  onActivated,
  compact = false,
}: {
  devToken?: string;
  onActivated: (pro: NonNullable<UserProgress['pro']>, summary: string) => void;
  compact?: boolean;
}) {
  const [pinInput, setPinInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = normalizeVoucherCode(pinInput);
    if (!isValidVoucherCodeFormat(formatted)) {
      setError('Enter a valid Easy Learn Pass PIN (for example ELRN-XXXX-XXXX).');
      return;
    }
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const headers = await buildOptionalAuthHeaders(true, devToken);
      const resp = await fetch('/api/billing/redeem', {
        method: 'POST',
        headers,
        body: JSON.stringify({ code: formatted }),
      });
      const data = (await resp.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        entitlementPublicKey?: JsonWebKey;
        pro?: NonNullable<UserProgress['pro']>;
        planName?: string;
      };

      if (!resp.ok || !data.ok || !data.pro) {
        setError(data.error || 'Could not activate that Pass PIN. Double-check the code and retry.');
        return;
      }

      if (data.entitlementPublicKey && data.entitlementPublicKey.kty === 'EC') {
        try {
          window.localStorage.setItem('rtc_pub_jwk_v1', JSON.stringify(data.entitlementPublicKey));
        } catch {
          /* ignore */
        }
      }

      const summary = `${data.planName || 'Easy Learn Study Pass'} activated (${formatPremiumRemaining(data.pro.until, undefined, data.pro.pid)}).`;
      setSuccess(summary);
      setPinInput('');
      onActivated(data.pro, summary);
    } catch {
      setError('Network error while checking Pass PIN. Please retry in a moment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      {!compact && (
        <div className="text-[12.5px] font-bold text-[var(--ink)]">
          Have an Easy Learn Pass PIN? Activate instantly
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          aria-label="Easy Learn Pass PIN"
          value={pinInput}
          onChange={(e) => {
            setPinInput(e.target.value.toUpperCase());
            if (error) setError(null);
            if (success) setSuccess(null);
          }}
          placeholder="Enter Pass PIN (e.g. ELRN-7K4M-9P2Q)"
          className="flex-1 min-h-[40px] px-3.5 rounded-xl bg-[var(--card)] border border-[var(--line)] focus:border-[var(--gold)] font-mono text-[13.5px] tracking-wider text-[var(--ink)] outline-none uppercase"
        />
        <button
          type="submit"
          disabled={submitting || !pinInput.trim()}
          className="btn-tactile indigo min-h-[40px] px-4 text-[13px] whitespace-nowrap shrink-0 disabled:opacity-50"
        >
          <Icon name="unlock" size={15} />
          <span>{submitting ? 'Activating…' : 'Activate Pass PIN'}</span>
        </button>
      </div>
      {error && (
        <div role="alert" className="text-[12.5px] font-semibold text-[var(--coral-ink)]">
          {error}
        </div>
      )}
      {success && (
        <div className="text-[12.5px] font-semibold text-[var(--green)]">
          ✓ {success}
        </div>
      )}
    </form>
  );
}

interface AdminPaystackTxItem {
  reference: string;
  planId: string;
  amountNgn: number;
  emailSummary: string;
  seatCount: number;
  status: string;
  verifiedAtIso: string | null;
  createdAtIso: string | null;
}

interface OwnerPassPinItem {
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

export function AdminPaystackOverview() {
  const [loadingList, setLoadingList] = useState(false);
  const [overview, setOverview] = useState<{
    paystackConfigured: boolean;
    activeSubscriptionsCount: number;
    verifiedTransactionsCount: number;
    totalVerifiedRevenueNgn: number;
    recentTransactions: AdminPaystackTxItem[];
  } | null>(null);

  // Owner-Only Pass PIN Studio state
  const [pins, setPins] = useState<OwnerPassPinItem[]>([]);
  const [pinCounts, setPinCounts] = useState({ total: 0, available: 0, redeemed: 0, revoked: 0 });
  const [pinPlanId, setPinPlanId] = useState<PremiumPlanId>('monthly');
  const [pinQty, setPinQty] = useState<number>(1);
  const [pinNote, setPinNote] = useState('');
  const [creatingPin, setCreatingPin] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);
  const [justCreated, setJustCreated] = useState<OwnerPassPinItem[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [pinFilter, setPinFilter] = useState<'all' | 'available' | 'redeemed' | 'revoked'>('all');
  const [revokingCode, setRevokingCode] = useState<string | null>(null);

  const copyText = useCallback((text: string, key: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(text);
    }
    setCopiedKey(key);
    window.setTimeout(() => {
      setCopiedKey((prev) => (prev === key ? null : prev));
    }, 2000);
  }, []);

  const loadOverviewAndPins = useCallback(async () => {
    setLoadingList(true);
    try {
      const headers = await buildOptionalAuthHeaders(false);
      const [ovResp, pinResp] = await Promise.all([
        fetch('/api/admin/billing/overview', { headers }),
        fetch('/api/admin/billing/vouchers', { headers }),
      ]);
      if (ovResp.ok) {
        const data = (await ovResp.json()) as {
          paystackConfigured: boolean;
          activeSubscriptionsCount: number;
          verifiedTransactionsCount: number;
          totalVerifiedRevenueNgn: number;
          recentTransactions: AdminPaystackTxItem[];
        };
        setOverview(data);
      }
      if (pinResp.ok) {
        const pinData = (await pinResp.json()) as {
          ok?: boolean;
          pins?: OwnerPassPinItem[];
          counts?: { total: number; available: number; redeemed: number; revoked: number };
        };
        if (Array.isArray(pinData.pins)) setPins(pinData.pins);
        if (pinData.counts) setPinCounts(pinData.counts);
      }
    } catch {
      /* ignore transient fetch failure */
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    void loadOverviewAndPins();
  }, [loadOverviewAndPins]);

  const handleGeneratePins = useCallback(
    async (overridePlanId?: PremiumPlanId, overrideCount?: number) => {
      const targetPlan = overridePlanId || pinPlanId;
      const targetCount = overrideCount ?? pinQty;
      setCreatingPin(true);
      setPinError(null);
      try {
        const headers = await buildOptionalAuthHeaders(true);
        const resp = await fetch('/api/admin/billing/vouchers', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            planId: targetPlan,
            count: targetCount,
            note: pinNote.trim(),
          }),
        });
        const data = (await resp.json().catch(() => ({}))) as {
          ok?: boolean;
          created?: OwnerPassPinItem[];
          error?: string;
        };
        if (!resp.ok || !data.ok || !Array.isArray(data.created)) {
          setPinError(data.error || 'Could not generate Pass PIN right now.');
          return;
        }
        setJustCreated(data.created);
        setPinNote('');
        if (data.created.length === 1) {
          copyText(data.created[0].code, 'latest-batch');
        }
        await loadOverviewAndPins();
      } catch {
        setPinError('Network error while creating Pass PIN. Please retry.');
      } finally {
        setCreatingPin(false);
      }
    },
    [pinPlanId, pinQty, pinNote, copyText, loadOverviewAndPins]
  );

  const handleRevokePin = useCallback(
    async (code: string) => {
      setRevokingCode(code);
      setPinError(null);
      try {
        const headers = await buildOptionalAuthHeaders(true);
        const resp = await fetch(`/api/admin/billing/vouchers/${encodeURIComponent(code)}/revoke`, {
          method: 'POST',
          headers,
        });
        const data = (await resp.json().catch(() => ({}))) as { error?: string };
        if (!resp.ok) {
          setPinError(data.error || 'Could not revoke that Pass PIN.');
          return;
        }
        await loadOverviewAndPins();
      } catch {
        setPinError('Network error while revoking Pass PIN.');
      } finally {
        setRevokingCode(null);
      }
    },
    [loadOverviewAndPins]
  );

  const filteredPins = pins.filter((p) => (pinFilter === 'all' ? true : p.status === pinFilter));

  return (
    <div id="owner-pass-pin-studio" className="flex flex-col gap-4">
      {/* ── Owner-Only 1-Tap Pass PIN Studio ── */}
      <section className="rtc-card rounded-2xl p-5 sm:p-6 flex flex-col gap-4 border border-[var(--acc-line)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="eyebrow text-[var(--gold)]">
              Owner-only Pass PIN studio · Locked to your verified Google account
            </span>
            <h2 className="h20 text-[var(--ink)]">Create &amp; Send Pass PINs in 1 Tap</h2>
            <p className="text-[13.5px] text-[var(--dim)]">
              Only your verified owner account can create or cancel Pass PINs. Tap any plan below to mint a single-use PIN and copy it immediately, or generate a batch for a school/class.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void loadOverviewAndPins()}
            disabled={loadingList}
            className="btn-tactile paper min-h-[36px] px-3.5 text-[12.5px] whitespace-nowrap self-start sm:self-center"
          >
            <span>{loadingList ? 'Refreshing…' : 'Refresh vault'}</span>
          </button>
        </div>

        {/* 1-Tap Quick-Create Bar */}
        <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-3.5 flex flex-col gap-2.5">
          <div className="text-[12px] font-bold uppercase tracking-wider text-[var(--dim)]">
            1-Tap Instant PIN (auto-copies to clipboard)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {PREMIUM_PLANS.map((plan) => (
              <button
                key={plan.id}
                type="button"
                disabled={creatingPin}
                onClick={() => void handleGeneratePins(plan.id, 1)}
                className="btn-tactile indigo min-h-[42px] px-3.5 text-[12.5px] justify-between whitespace-nowrap disabled:opacity-50"
              >
                <span>+1 {plan.name.replace(' pass', '')}</span>
                <span className="opacity-90 font-mono">₦{plan.priceNgn.toLocaleString()}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Newly Created PIN(s) Ready-to-Send Card */}
        {justCreated.length > 0 && (
          <div className="rounded-xl bg-[var(--ok-soft)] border border-[var(--ok-line)] p-4 flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-[12px] font-bold uppercase tracking-wider text-[var(--green)]">
                  ✓ {justCreated.length === 1 ? 'Pass PIN Ready to Send' : `${justCreated.length} Pass PINs Created`}
                </div>
                <div className="text-[13px] text-[var(--dim)]">
                  {justCreated[0].planName}
                  {justCreated[0].note ? ` · ${justCreated[0].note}` : ''}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    copyText(formatPassPinClipboardBatch(justCreated), 'latest-batch')
                  }
                  className="btn-tactile paper min-h-[36px] px-3.5 text-[12.5px] whitespace-nowrap"
                >
                  <span>
                    {copiedKey === 'latest-batch'
                      ? '✓ Copied!'
                      : justCreated.length === 1
                        ? 'Copy PIN'
                        : 'Copy All PINs'}
                  </span>
                </button>
                {justCreated.length === 1 && (
                  <a
                    href={buildPassPinWhatsAppUrl({
                      code: justCreated[0].code,
                      planName: justCreated[0].planName,
                      days: justCreated[0].days,
                      note: justCreated[0].note,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-tactile indigo min-h-[36px] px-3.5 text-[12.5px] whitespace-nowrap"
                  >
                    <span>Send on WhatsApp ↗</span>
                  </a>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {justCreated.map((p) => (
                <button
                  key={p.code}
                  type="button"
                  onClick={() => copyText(p.code, `new-${p.code}`)}
                  className="px-3.5 py-2 rounded-lg bg-[var(--card)] border border-[var(--ok-line)] font-mono font-extrabold text-[15px] tracking-wider text-[var(--ink)] hover:border-[var(--gold)] transition cursor-pointer"
                  title="Tap to copy Pass PIN"
                >
                  {p.code}
                  {copiedKey === `new-${p.code}` ? ' ✓' : ''}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Custom / Batch Generator */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleGeneratePins();
          }}
          className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-3.5 grid grid-cols-1 md:grid-cols-12 gap-2.5 items-end"
        >
          <div className="md:col-span-3 flex flex-col gap-1">
            <label htmlFor="owner-pin-plan" className="text-[11.5px] font-bold text-[var(--dim)]">
              Plan
            </label>
            <select
              id="owner-pin-plan"
              value={pinPlanId}
              onChange={(e) => setPinPlanId(e.target.value as PremiumPlanId)}
              className="min-h-[38px] px-3 rounded-lg bg-[var(--card)] border border-[var(--line)] text-[13px] font-semibold text-[var(--ink)] outline-none focus:border-[var(--gold)]"
            >
              {PREMIUM_PLANS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (₦{p.priceNgn.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 flex flex-col gap-1">
            <label htmlFor="owner-pin-qty" className="text-[11.5px] font-bold text-[var(--dim)]">
              Quantity
            </label>
            <select
              id="owner-pin-qty"
              value={pinQty}
              onChange={(e) => setPinQty(Number(e.target.value))}
              className="min-h-[38px] px-3 rounded-lg bg-[var(--card)] border border-[var(--line)] text-[13px] font-semibold text-[var(--ink)] outline-none focus:border-[var(--gold)]"
            >
              {[1, 3, 5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? 'PIN' : 'PINs'}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-4 flex flex-col gap-1">
            <label htmlFor="owner-pin-note" className="text-[11.5px] font-bold text-[var(--dim)]">
              Student / School Label (optional)
            </label>
            <input
              id="owner-pin-note"
              type="text"
              value={pinNote}
              onChange={(e) => setPinNote(e.target.value)}
              maxLength={120}
              placeholder="e.g. Chinedu SS3 or Kings College"
              className="min-h-[38px] px-3 rounded-lg bg-[var(--card)] border border-[var(--line)] text-[13px] text-[var(--ink)] outline-none focus:border-[var(--gold)]"
            />
          </div>

          <div className="md:col-span-3">
            <button
              type="submit"
              disabled={creatingPin}
              className="btn-tactile paper w-full min-h-[38px] px-3.5 text-[13px] justify-center whitespace-nowrap disabled:opacity-50"
            >
              <span>{creatingPin ? 'Creating…' : `Create ${pinQty} PIN${pinQty > 1 ? 's' : ''}`}</span>
            </button>
          </div>
        </form>

        {pinError && (
          <div
            role="alert"
            className="rounded-xl bg-[var(--bad-soft)] border border-[var(--bad-line)] px-3.5 py-2 text-[12.5px] font-semibold text-[var(--coral-ink)]"
          >
            {pinError}
          </div>
        )}

        {/* Pass PIN Vault Summary & Filter */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[var(--line)]">
          <div className="flex flex-wrap items-center gap-3 text-[12.5px] font-semibold text-[var(--dim)] tabular-nums">
            <span>
              Available: <strong className="text-[var(--green)]">{pinCounts.available}</strong>
            </span>
            <span>·</span>
            <span>
              Redeemed: <strong className="text-[var(--ink)]">{pinCounts.redeemed}</strong>
            </span>
            <span>·</span>
            <span>
              Revoked: <strong className="text-[var(--dim)]">{pinCounts.revoked}</strong>
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {(['all', 'available', 'redeemed', 'revoked'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setPinFilter(tab)}
                className={`px-2.5 py-1 rounded-lg text-[12px] font-bold capitalize transition cursor-pointer ${
                  pinFilter === tab
                    ? 'bg-[var(--gold)] text-[var(--on-acc)]'
                    : 'bg-[var(--bg)] text-[var(--dim)] hover:text-[var(--ink)] border border-[var(--line)]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Vault Table */}
        {filteredPins.length === 0 ? (
          <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-4 text-[13px] text-[var(--dim)] text-center">
            No {pinFilter === 'all' ? '' : `${pinFilter} `}Pass PINs yet. Tap any 1-Tap Instant PIN button above to generate one immediately.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12.5px] border-collapse">
              <thead>
                <tr className="border-b border-[var(--line)] text-[var(--dim)]">
                  <th className="py-2 pr-3 font-semibold">Pass PIN</th>
                  <th className="py-2 pr-3 font-semibold">Plan</th>
                  <th className="py-2 pr-3 font-semibold">Label</th>
                  <th className="py-2 pr-3 font-semibold">Status</th>
                  <th className="py-2 font-semibold text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPins.slice(0, 25).map((p) => (
                  <tr key={p.code} className="border-b border-[var(--line)]/60">
                    <td className="py-2 pr-3 font-mono font-bold text-[var(--ink)] whitespace-nowrap">
                      {p.code}
                    </td>
                    <td className="py-2 pr-3 text-[var(--ink)] font-semibold whitespace-nowrap">
                      {p.planName}
                    </td>
                    <td className="py-2 pr-3 text-[var(--dim)] max-w-[180px] truncate">
                      {p.note || '—'}
                    </td>
                    <td className="py-2 pr-3 font-semibold whitespace-nowrap">
                      {p.status === 'available' ? (
                        <span className="text-[var(--green)]">Available</span>
                      ) : p.status === 'redeemed' ? (
                        <span className="text-[var(--gold)]">✓ Redeemed</span>
                      ) : (
                        <span className="text-[var(--coral-ink)]">Revoked</span>
                      )}
                    </td>
                    <td className="py-2 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        {p.status === 'available' && (
                          <>
                            <button
                              type="button"
                              onClick={() => copyText(p.code, `row-${p.code}`)}
                              className="px-2.5 py-1 rounded-md bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--gold)] text-[11.5px] font-bold text-[var(--ink)] cursor-pointer"
                            >
                              {copiedKey === `row-${p.code}` ? '✓ Copied' : 'Copy'}
                            </button>
                            <a
                              href={buildPassPinWhatsAppUrl({
                                code: p.code,
                                planName: p.planName,
                                days: p.days,
                                note: p.note,
                              })}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 rounded-md bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--green)] text-[11.5px] font-bold text-[var(--green)]"
                            >
                              WhatsApp ↗
                            </a>
                            <button
                              type="button"
                              disabled={revokingCode === p.code}
                              onClick={() => void handleRevokePin(p.code)}
                              className="px-2.5 py-1 rounded-md bg-[var(--bad-soft)] border border-[var(--bad-line)] text-[11.5px] font-bold text-[var(--coral-ink)] cursor-pointer disabled:opacity-50"
                            >
                              {revokingCode === p.code ? '…' : 'Revoke'}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── Owner Paystack Revenue Monitor ── */}
      <section className="rtc-card rounded-2xl p-5 sm:p-6 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="eyebrow text-[var(--gold)]">Owner Paystack revenue monitor</span>
            <h2 className="h20 text-[var(--ink)]">Automated Paystack Subscriptions</h2>
            <p className="text-[13.5px] text-[var(--dim)]">
              Online card, bank transfer, and school cohort passes are verified automatically via Paystack checkout and webhooks.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void loadOverviewAndPins()}
            disabled={loadingList}
            className="btn-tactile paper min-h-[36px] px-3.5 text-[12.5px] whitespace-nowrap self-start sm:self-center"
          >
            <span>{loadingList ? 'Refreshing…' : 'Refresh status'}</span>
          </button>
        </div>

        {overview && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-3.5">
                <div className="text-[11.5px] font-semibold text-[var(--dim)]">
                  Verified Paystack Revenue
                </div>
                <div className="font-[var(--display)] font-extrabold text-[20px] text-[var(--ink)] tabular-nums mt-0.5">
                  ₦{overview.totalVerifiedRevenueNgn.toLocaleString()}
                </div>
              </div>
              <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-3.5">
                <div className="text-[11.5px] font-semibold text-[var(--dim)]">
                  Active Scholar Passes
                </div>
                <div className="font-[var(--display)] font-extrabold text-[20px] text-[var(--green)] tabular-nums mt-0.5">
                  {overview.activeSubscriptionsCount.toLocaleString()}
                </div>
              </div>
              <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-3.5">
                <div className="text-[11.5px] font-semibold text-[var(--dim)]">
                  Paystack Gateway Status
                </div>
                <div className="font-[var(--display)] font-bold text-[15px] text-[var(--ink)] mt-1">
                  {overview.paystackConfigured
                    ? '✓ Online Checkout Active'
                    : '▲ Pass PIN Mode'}
                </div>
              </div>
            </div>

            {overview.recentTransactions.length > 0 && (
              <div className="overflow-x-auto border-t border-[var(--line)] pt-3">
                <div className="text-[12.5px] font-bold text-[var(--dim)] mb-2">
                  Recent Paystack Transactions ({overview.recentTransactions.length})
                </div>
                <table className="w-full text-left text-[12.5px] border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--line)] text-[var(--dim)]">
                      <th className="py-2 pr-3 font-semibold">Reference</th>
                      <th className="py-2 pr-3 font-semibold">Scholar / Cohort</th>
                      <th className="py-2 pr-3 font-semibold">Amount</th>
                      <th className="py-2 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overview.recentTransactions.slice(0, 12).map((tx) => (
                      <tr key={tx.reference} className="border-b border-[var(--line)]/60">
                        <td className="py-2 pr-3 font-mono font-bold text-[var(--ink)] whitespace-nowrap">
                          {tx.reference}
                        </td>
                        <td className="py-2 pr-3 text-[var(--dim)] max-w-[220px] truncate">
                          {tx.emailSummary}
                          {tx.seatCount > 1 ? ` (${tx.seatCount} seats)` : ''}
                        </td>
                        <td className="py-2 pr-3 text-[var(--ink)] font-semibold tabular-nums whitespace-nowrap">
                          ₦{tx.amountNgn.toLocaleString()} · {tx.planId}
                        </td>
                        <td className="py-2 font-semibold whitespace-nowrap">
                          {tx.status === 'verified' ? (
                            <span className="text-[var(--green)]">✓ Verified</span>
                          ) : (
                            <span className="text-[var(--dim)]">Pending</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
