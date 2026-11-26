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
      className={`w-full border-b px-3 sm:px-5 py-1.5 flex items-center justify-between gap-2 text-[12px] ${
        countdown.isWarning
          ? 'bg-[var(--bad-soft)] border-[var(--bad-line)] text-[var(--coral-ink)]'
          : 'bg-[var(--card)] border-[var(--line)] text-[var(--ink)]'
      }`}
    >
      <div className="flex items-center gap-2 font-medium min-w-0">
        <span className="inline-flex items-center gap-1.5 font-mono font-bold tabular-nums whitespace-nowrap shrink-0 text-[var(--gold)]">
          <Icon name="clock" size={13} />
          <span className="sm:hidden">Trial · {countdown.formattedCountdown}</span>
          <span className="hidden sm:inline">Free Trial · {countdown.formattedCountdown}</span>
        </span>
        <span aria-hidden="true" className="hidden lg:inline text-[var(--dim)]">
          ·
        </span>
        <span
          className={`hidden lg:inline truncate ${
            countdown.isWarning ? 'font-bold' : 'text-[var(--dim)]'
          }`}
        >
          {countdown.isWarning
            ? 'Trial ending soon — upgrade to keep full access.'
            : isCancelled
              ? 'Auto-renew off · Locks at 00:00:00.'
              : trialLink?.linked
                ? `${trialLink.methodType === 'google_pay' ? 'Google Pay' : 'Payment'} linked · Cancel anytime`
                : 'Full access active across 49 subjects, tutors, and labs.'}
        </span>
      </div>
      <button
        type="button"
        onClick={onManageOrSubscribe}
        aria-label={trialLink?.linked ? 'Manage trial' : 'Upgrade pass'}
        className="min-h-[28px] px-2.5 sm:px-3 rounded-lg bg-[var(--acc-soft)] hover:brightness-95 border border-[var(--acc-line)] text-[var(--gold)] font-[var(--display)] font-bold text-[11.5px] whitespace-nowrap shrink-0 cursor-pointer transition"
      >
        <span>{trialLink?.linked ? 'Manage Trial' : 'Upgrade Pass'}</span>
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
      className={`w-full border-b px-3 sm:px-5 py-1.5 flex items-center justify-between gap-2 text-[12px] ${
        status.isWarning
          ? 'bg-[var(--bad-soft)] border-[var(--bad-line)] text-[var(--coral-ink)]'
          : 'bg-[var(--card)] border-[var(--line)] text-[var(--ink)]'
      }`}
    >
      <div className="flex items-center gap-2 font-medium min-w-0">
        <span className="font-mono font-bold tabular-nums whitespace-nowrap shrink-0 text-[var(--gold)]">
          Demo · {status.formattedRemaining}
        </span>
        <span aria-hidden="true" className="hidden md:inline text-[var(--dim)]">
          ·
        </span>
        <span
          className={`hidden md:inline truncate ${
            status.isWarning ? 'font-bold' : 'text-[var(--dim)]'
          }`}
        >
          {status.isWarning
            ? 'Demo ending — create a free account to continue.'
            : '5-minute preview · Create a free account to save progress.'}
        </span>
      </div>
      <button
        type="button"
        onClick={onCreateAccount}
        className="min-h-[28px] px-2.5 sm:px-3 rounded-lg bg-[var(--acc-soft)] hover:brightness-95 border border-[var(--acc-line)] text-[var(--gold)] font-[var(--display)] font-bold text-[11.5px] whitespace-nowrap shrink-0 cursor-pointer transition"
      >
        <span className="sm:hidden">Free Account</span>
        <span className="hidden sm:inline">Create Free Account</span>
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
              Demo ended
            </span>
            <h2
              id="demo-expired-title"
              className="font-[var(--display)] font-extrabold text-[22px] leading-tight text-[var(--ink)]"
            >
              Continue with a free account
            </h2>
          </div>
        </div>

        <p className="text-[14px] text-[var(--dim)] leading-relaxed">
          Create a free account or sign in to unlock all 49 subjects, 8 set novels, virtual labs, and Saturday CBT mocks.
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
