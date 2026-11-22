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
        <span className="eyebrow text-[var(--gold)]">Spaced revision · 1, 3 and 7 days</span>
        <h1 className="h28 text-[var(--ink)]">Revision</h1>
        <p className="text-[15px] text-[var(--dim)] mt-1">
          Questions you miss in {SUBJECT_INFO[progress.subj].name} come back after a few days until you get them right three times.
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
            <div className="font-[var(--display)] font-bold text-[22px] text-[var(--ink)]">
              {dueNow.length > 0
                ? `${dueNow.length} ${dueNow.length === 1 ? 'question' : 'questions'} due today`
                : 'All caught up for today'}
            </div>
            <div className="text-[14px] text-[var(--dim)] mt-0.5">
              {dueNow.length > 0
                ? 'Practise these now to turn weak spots into steady marks.'
                : upcoming.length > 0
                  ? `${upcoming.length} more ${upcoming.length === 1 ? 'question is' : 'questions are'} scheduled for later days.`
                  : 'Miss any question during practice or a test and it will show up here.'}
            </div>
          </div>
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row gap-2.5">
          {dueNow.length > 0 && (
            <button type="button" onClick={() => onStartReview(false)} className="btn-tactile indigo">
              <span>Start revision ({dueNow.length})</span>
              <Icon name="go" size={18} />
            </button>
          )}
          {dueNow.length === 0 && upcoming.length > 0 && (
            <button type="button" onClick={() => onStartReview(true)} className="btn-tactile paper">
              <span>Practise {upcoming.length} early</span>
              <Icon name="go" size={18} />
            </button>
          )}
        </div>
      </section>

      {/* Queue breakdown */}
      {allScheduled.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="h20 text-[var(--ink)]">Scheduled questions ({allScheduled.length})</h2>
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
                  className="rtc-card rounded-2xl p-4 flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[12.5px] font-bold text-[var(--gold)] truncate">
                      {t?.name || q.t}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-xl text-[11.5px] font-bold ${
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
                    Right in a row: {entry.st} of 3
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
