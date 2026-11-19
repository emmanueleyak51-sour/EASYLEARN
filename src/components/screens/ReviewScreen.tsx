import React from 'react';
import type { UserProgress } from '../../types';
import { SUBJECT_INFO, dueList, today } from '../../utils/engine';
import { findQuestion, getTopic } from '../../data/curriculum';
import { typesetMathHtml } from '../../utils/mathTypesetter';
import { Icon } from '../Icons';
import { MotivationBanner } from '../MotivationBanner';

export function ReviewScreen({
  progress,
  onStartReview,
}: {
  progress: UserProgress;
  onStartReview: (early: boolean) => void;
}) {
  const d = today();
  const findQ = (id: string) => findQuestion(progress, progress.subj, id);
  const dueNow = dueList(progress, findQ, false, d);
  const allScheduled = dueList(progress, findQ, true, d);
  const upcoming = allScheduled.filter((id) => !dueNow.includes(id));

  return (
    <div className="flex flex-col gap-6 anim-rise">
      <div>
        <span className="eyebrow text-[var(--gold)]">Spaced Repetition · 1 → 3 → 7 Days</span>
        <h1 className="h28 text-[var(--ink)]">{SUBJECT_INFO[progress.subj].short} Review Queue</h1>
        <p className="text-[15px] text-[var(--dim)] mt-1">
          Every question you miss returns at expanding intervals until you get it right 3 times.
        </p>
      </div>

      <MotivationBanner
        variant="compact"
        studentName={progress.name}
        subj={progress.subj}
      />

      {/* Main Status Card */}
      <section className="rtc-card rounded-[22px] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
              dueNow.length > 0
                ? 'bg-[var(--bad-soft)] text-[var(--coral-ink)]'
                : 'bg-[var(--ok-soft)] text-[var(--green)]'
            }`}
          >
            <Icon name={dueNow.length > 0 ? 'rev' : 'check'} size={28} />
          </div>
          <div>
            <div className="font-[var(--display)] font-extrabold text-[22px] text-[var(--ink)]">
              {dueNow.length > 0
                ? `${dueNow.length} ${dueNow.length === 1 ? 'card' : 'cards'} due today`
                : 'All caught up for today!'}
            </div>
            <div className="text-[14px] text-[var(--dim)] mt-0.5">
              {dueNow.length > 0
                ? 'Clear these now to lock in weak spots and boost your mastery score.'
                : upcoming.length > 0
                  ? `${upcoming.length} more ${upcoming.length === 1 ? 'card is' : 'cards are'} scheduled for future days.`
                  : 'Miss any question during practice or a diagnostic and it will appear here automatically.'}
            </div>
          </div>
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row gap-2.5">
          {dueNow.length > 0 && (
            <button type="button" onClick={() => onStartReview(false)} className="btn-tactile indigo">
              <span>Start review ({dueNow.length})</span>
              <Icon name="go" size={18} />
            </button>
          )}
          {dueNow.length === 0 && upcoming.length > 0 && (
            <button type="button" onClick={() => onStartReview(true)} className="btn-tactile paper">
              <span>Review {upcoming.length} early</span>
              <Icon name="go" size={18} />
            </button>
          )}
        </div>
      </section>

      {/* Queue breakdown */}
      {allScheduled.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="h20 text-[var(--ink)]">Scheduled cards ({allScheduled.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {allScheduled.slice(0, 12).map((qid) => {
              const q = findQ(qid);
              const entry = progress.rev[qid];
              if (!q || !entry) return null;
              const t = getTopic(progress.subj, q.t);
              const daysLeft = entry.due - d;
              return (
                <div
                  key={qid}
                  className="rounded-2xl bg-[var(--card)] border border-[var(--line)] p-4 flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[12px] font-extrabold uppercase tracking-wider text-[var(--gold)] truncate">
                      {t?.name || q.t}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        daysLeft <= 0
                          ? 'bg-[var(--bad-soft)] text-[var(--coral-ink)]'
                          : 'bg-[var(--acc-soft)] text-[var(--gold)]'
                      }`}
                    >
                      {daysLeft <= 0 ? 'Due now' : `In ${daysLeft}d`}
                    </span>
                  </div>
                  <div
                    className="text-[14px] text-[var(--ink)] line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: typesetMathHtml(q.q, progress.subj) }}
                  />
                  <div className="text-[12px] font-semibold text-[var(--dim)]">
                    Streak stage: {entry.st}/3 clears
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
