import React from 'react';
import type { DemoSessionStatus } from '../utils/demoSessionLogic';
import type { TrialCountdownSnapshot, TrialLinkInfo } from '../utils/paywallLogic';
import { Icon } from './Icons';

export function TrialCountdownBar({
  countdown,
  trialLink,
  onManageOrSubscribe,
}: {
  countdown: TrialCountdownSnapshot;
  trialLink: TrialLinkInfo | null;
  onManageOrSubscribe: () => void;
}) {
  if (countdown.isExpired) return null;

  const isCancelled = trialLink?.status === 'cancelled';

  return (
    <div
      role="status"
      aria-live="polite"
      className={`w-full border-b px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-[12.5px] ${
        countdown.isWarning
          ? 'bg-[var(--bad-soft)] border-[var(--bad-line)] text-[var(--coral-ink)]'
          : 'bg-[var(--card)] border-[var(--acc-line)] text-[var(--ink)]'
      }`}
    >
      <div className="flex flex-wrap items-center gap-2 font-semibold">
        <span className="inline-flex items-center gap-1.5 font-mono font-extrabold tabular-nums">
          <Icon name="clock" size={14} />
          <span>1-Day Free Trial · {countdown.formattedCountdown} left</span>
        </span>
        <span aria-hidden="true" className="opacity-45">
          ·
        </span>
        <span className={countdown.isWarning ? 'font-bold' : 'text-[var(--dim)]'}>
          {countdown.isWarning
            ? 'Your 1-day free trial expires soon — everything locks at 00:00:00 unless you subscribe.'
            : isCancelled
              ? 'Auto-renew cancelled · Everything locks when timer reaches 00:00:00 unless you resubscribe.'
              : trialLink?.linked
                ? `${trialLink.methodType === 'google_pay' ? 'Google Pay' : 'Payment account'} linked · Auto-renews at expiry · Cancel anytime`
                : 'Link Google Pay or payment account · Everything locks after 24 hours until you subscribe.'}
        </span>
      </div>
      <button
        type="button"
        onClick={onManageOrSubscribe}
        className="btn-tactile indigo min-h-[30px] px-3 text-[12px] whitespace-nowrap shrink-0"
      >
        <span>{trialLink?.linked ? 'Subscribe / Manage Trial' : 'Subscribe or Link Trial'}</span>
      </button>
    </div>
  );
}

export function DemoCountdownBar({
  status,
  onCreateAccount,
}: {
  status: DemoSessionStatus;
  onCreateAccount: () => void;
}) {
  if (!status.isDemoActive || status.isExpired) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`w-full border-b px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-[12.5px] ${
        status.isWarning
          ? 'bg-[var(--bad-soft)] border-[var(--bad-line)] text-[var(--coral-ink)]'
          : 'bg-[var(--card)] border-[var(--acc-line)] text-[var(--ink)]'
      }`}
    >
      <div className="flex flex-wrap items-center gap-2 font-semibold">
        <span className="font-mono font-extrabold tabular-nums">
          Demo Mode · {status.formattedRemaining} left
        </span>
        <span aria-hidden="true" className="opacity-45">
          ·
        </span>
        <span className={status.isWarning ? 'font-bold' : 'text-[var(--dim)]'}>
          {status.isWarning
            ? 'Your 5-minute demo is almost over — create a free account to keep studying.'
            : '5-minute preview active. Create a free account anytime to unlock unlimited study.'}
        </span>
      </div>
      <button
        type="button"
        onClick={onCreateAccount}
        className="btn-tactile indigo min-h-[30px] px-3 text-[12px] whitespace-nowrap shrink-0"
      >
        <span>Create Free Account</span>
      </button>
    </div>
  );
}

export function DemoExpiredModal({
  open,
  onCreateAccount,
  onSignIn,
  onBackToWebsite,
}: {
  open: boolean;
  onCreateAccount: () => void;
  onSignIn: () => void;
  onBackToWebsite: () => void;
}) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-expired-title"
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
    >
      <div className="rtc-card w-full max-w-[460px] rounded-2xl p-6 sm:p-7 flex flex-col gap-4 shadow-2xl border border-[var(--bad-line)]">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[var(--bad-soft)] border border-[var(--bad-line)] text-[var(--coral-ink)] flex items-center justify-center shrink-0">
            <Icon name="clock" size={22} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="eyebrow text-[var(--coral-ink)]">
              5-minute strict demo ended
            </span>
            <h2
              id="demo-expired-title"
              className="font-[var(--display)] font-extrabold text-[22px] leading-tight text-[var(--ink)]"
            >
              Your demo has expired
            </h2>
          </div>
        </div>

        <p className="text-[14px] text-[var(--dim)] leading-relaxed">
          Your 5-minute Easy Learn demo session has ended. Create your free student account or sign in to continue studying all 49 JAMB &amp; WAEC subjects, 8 prescribed novels, virtual labs, and Saturday CBT mocks with no demo timer.
        </p>

        <div className="flex flex-col gap-2.5 pt-1">
          <button
            type="button"
            onClick={onCreateAccount}
            className="btn-tactile indigo w-full min-h-[44px] text-[14px] justify-center whitespace-nowrap"
          >
            <span>Create Free Account</span>
            <Icon name="arrow" size={16} />
          </button>
          <button
            type="button"
            onClick={onSignIn}
            className="btn-tactile paper w-full min-h-[42px] text-[13.5px] justify-center whitespace-nowrap"
          >
            <span>Sign In to Existing Account</span>
          </button>
          <button
            type="button"
            onClick={onBackToWebsite}
            className="mt-1 text-[12.5px] font-semibold text-[var(--dim)] hover:text-[var(--ink)] cursor-pointer text-center"
          >
            Back to Easy Learn website
          </button>
        </div>
      </div>
    </div>
  );
}
