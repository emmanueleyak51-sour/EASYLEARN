import React, { useMemo, useState } from 'react';
import type { SubjectId, UserProgress } from '../../types';
import { findQuestion, getTopic } from '../../data/curriculum';
import { SUBJECT_INFO, perm, today } from '../../utils/engine';
import {
  TRAP_META,
  summarizeMistakeVault,
  type MistakeEntry,
  type MistakeTrapCategory,
} from '../../utils/mistakeVaultLogic';
import { getVisibleEnrolledSubjects, resolveExamTrack } from '../../utils/examTrackLogic';
import { typesetMathHtml } from '../../utils/mathTypesetter';
import { SubscreenTopBar } from '../AppShell';
import { Icon } from '../Icons';
import { LiquidCapsuleBar, SmoothViewSwitch } from '../ULessonMotion';

export function MistakeVaultScreen({
  progress,
  onRedeemMistake,
  onOpenTopicNotes,
  onBack,
}: {
  progress: UserProgress;
  onRedeemMistake: (qid: string, ok: boolean, allowSameDay: boolean) => void;
  onOpenTopicNotes: (subj: SubjectId, tid: string) => void;
  onBack: () => void;
}) {
  const vault = progress.mistakes || {};
  const summary = useMemo(() => summarizeMistakeVault(vault), [vault]);
  const [trapFilter, setTrapFilter] = useState<'all' | MistakeTrapCategory>('all');
  const [subjFilter, setSubjFilter] = useState<'all' | SubjectId>('all');
  const [drillQueue, setDrillQueue] = useState<MistakeEntry[] | null>(null);
  const [drillIdx, setDrillIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [clearedCount, setClearedCount] = useState(0);

  const examTrack = resolveExamTrack(progress);
  const jambVisibleSet = useMemo(
    () => (examTrack === 'jamb' ? new Set(getVisibleEnrolledSubjects(progress)) : null),
    [examTrack, progress]
  );

  const scopedList = useMemo(
    () =>
      jambVisibleSet
        ? summary.list.filter((m) => jambVisibleSet.has(m.subj))
        : summary.list,
    [summary.list, jambVisibleSet]
  );

  const filtered = useMemo(
    () =>
      scopedList.filter((m) => {
        if (trapFilter !== 'all' && m.trap !== trapFilter) return false;
        if (subjFilter !== 'all' && m.subj !== subjFilter) return false;
        return true;
      }),
    [scopedList, trapFilter, subjFilter]
  );

  const startClearDrill = () => {
    const queue = filtered.slice(0, 10);
    if (!queue.length) return;
    setDrillQueue(queue);
    setDrillIdx(0);
    setPicked(null);
    setClearedCount(0);
  };

  if (drillQueue && drillQueue[drillIdx]) {
    const entry = drillQueue[drillIdx];
    const q = findQuestion(progress, entry.subj, entry.qid);
    if (!q) {
      return (
        <div className="flex flex-col gap-4">
          <SubscreenTopBar title="Fix your mistakes" onBack={() => setDrillQueue(null)} />
          <div className="rtc-card rounded-2xl p-6 text-center">
            <p className="text-[14px] text-[var(--dim)]">Question not found in current syllabus.</p>
            <button type="button" onClick={() => setDrillQueue(null)} className="btn-tactile indigo mt-4">
              Back to mistakes
            </button>
          </div>
        </div>
      );
    }

    const order = perm(`vault|${entry.qid}|${today()}`, q.o.length);
    const answered = picked !== null;
    const isRight = answered && picked === q.a;
    const topic = getTopic(entry.subj, entry.tid);

    return (
      <div className="max-w-[740px] mx-auto flex flex-col gap-4 anim-rise">
        <SubscreenTopBar
          title="Fix your mistakes"
          subtitle={`Question ${drillIdx + 1} of ${drillQueue.length} · ${TRAP_META[entry.trap].shortLabel}`}
          onBack={() => setDrillQueue(null)}
        />

        <div className="rtc-card rounded-2xl p-5 sm:p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2 text-[12.5px]">
            <span className="font-bold text-[var(--gold)]">
              {SUBJECT_INFO[entry.subj].name} · {topic?.name || entry.tid}
            </span>
            <span className="font-mono text-[var(--dim)] tabular-nums">
              Clear progress: {entry.clearCount}/2
            </span>
          </div>

          <div
            className="qt text-[var(--ink)]"
            dangerouslySetInnerHTML={{ __html: typesetMathHtml(q.q, entry.subj) }}
          />

          <div className="flex flex-col gap-2.5">
            {order.map((origIdx, dispIdx) => {
              const isRightOpt = origIdx === q.a;
              const isPicked = picked === origIdx;
              let cls = '';
              if (answered) {
                if (isRightOpt) cls = 'ok';
                else if (isPicked) cls = 'no anim-shake';
                else cls = 'opt-eliminated';
              }
              return (
                <button
                  key={origIdx}
                  type="button"
                  disabled={answered}
                  onClick={() => {
                    const ok = origIdx === q.a;
                    setPicked(origIdx);
                    if (ok) setClearedCount((c) => c + 1);
                    onRedeemMistake(entry.qid, ok, true);
                  }}
                  className={`opt-tile ${cls}`}
                >
                  <span className="opt-bubble">
                    <span>{String.fromCharCode(65 + dispIdx)}</span>
                  </span>
                  <span
                    className="flex-1"
                    dangerouslySetInnerHTML={{ __html: typesetMathHtml(q.o[origIdx], entry.subj) }}
                  />
                </button>
              );
            })}
          </div>

          {answered && (
            <div
              className={`anim-explain-reveal rounded-2xl border p-4 flex flex-col gap-2 ${
                isRight
                  ? 'bg-[var(--ok-soft)] border-[var(--ok-line)]'
                  : 'bg-[var(--bad-soft)] border-[var(--bad-line)]'
              }`}
            >
              <div className="font-[var(--display)] font-bold text-[15px] text-[var(--ink)]">
                {isRight
                  ? entry.clearCount + 1 >= 2
                    ? 'Cleared — this mistake is fixed!'
                    : '1 of 2 done — get it right once more to clear it.'
                  : `Not quite · Watch out: ${TRAP_META[entry.trap].tip}`}
              </div>
              <div
                className="text-[14px] text-[var(--ink)] leading-relaxed"
                dangerouslySetInnerHTML={{ __html: typesetMathHtml(q.e, entry.subj) }}
              />
            </div>
          )}
        </div>

        {answered && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onOpenTopicNotes(entry.subj, entry.tid)}
              className="btn-tactile paper whitespace-nowrap"
            >
              <span>Read notes</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (drillIdx + 1 >= drillQueue.length) {
                  setDrillQueue(null);
                } else {
                  setDrillIdx((i) => i + 1);
                  setPicked(null);
                }
              }}
              className="btn-tactile indigo flex-1"
            >
              <span>
                {drillIdx + 1 >= drillQueue.length
                  ? `Finish (${clearedCount}/${drillQueue.length} right)`
                  : 'Next question'}
              </span>
              <Icon name="go" size={16} />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 anim-rise">
      <SubscreenTopBar
        title="Mistakes to fix"
        subtitle="Questions you missed — get each one right twice to clear it"
        onBack={onBack}
        right={
          filtered.length > 0 ? (
            <button type="button" onClick={startClearDrill} className="btn-tactile indigo min-h-[36px] text-[12.5px] px-3.5 whitespace-nowrap">
              <span>Practise mistakes ({Math.min(10, filtered.length)})</span>
            </button>
          ) : undefined
        }
      />

      {/* Trap Breakdown Strip */}
      <section className="grid grid-cols-2 min-[760px]:grid-cols-4 gap-3">
        {(Object.keys(TRAP_META) as MistakeTrapCategory[]).map((cat) => {
          const active = trapFilter === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setTrapFilter((prev) => (prev === cat ? 'all' : cat))}
              className={`rtc-card rounded-2xl p-4 text-left flex flex-col gap-1 transition cursor-pointer ${
                active ? 'border-[var(--gold)] ring-1 ring-[var(--gold)]/30 bg-[var(--acc-soft)]/35' : ''
              }`}
            >
              <span className="text-[12px] font-semibold text-[var(--dim)]">{TRAP_META[cat].shortLabel}</span>
              <span className="font-mono font-extrabold text-[24px] text-[var(--ink)] tabular-nums">
                {summary.byTrap[cat] || 0}
              </span>
              <span className="text-[11.5px] text-[var(--dim)] line-clamp-2">{TRAP_META[cat].tip}</span>
            </button>
          );
        })}
      </section>

      {/* Subject Filter Row */}
      {scopedList.length > 0 && (
        <div className="overflow-x-auto max-w-full pb-0.5">
          <LiquidCapsuleBar
            roleType="tablist"
            size="sm"
            ariaLabel="Filter mistakes by subject"
            items={[
              { id: 'all' as const, label: `All subjects (${scopedList.length})` },
              ...(Object.entries(summary.bySubj) as [SubjectId, number][])
                .filter(([sid]) => !jambVisibleSet || jambVisibleSet.has(sid))
                .map(([sid, count]) => ({
                  id: sid,
                  label: `${SUBJECT_INFO[sid].short} (${count})`,
                })),
            ]}
            value={subjFilter}
            onChange={setSubjFilter}
          />
        </div>
      )}

      {/* Vault List */}
      <SmoothViewSwitch viewKey={`${trapFilter}-${subjFilter}`}>
        {filtered.length === 0 ? (
          <section className="rtc-card rounded-2xl p-8 text-center flex flex-col items-center gap-3.5">
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              aria-hidden="true"
              className="shrink-0"
            >
              <rect width="64" height="64" rx="20" fill="var(--ok-soft)" />
              <path
                d="M32 14L46 20V31C46 40.5 39.8 47.8 32 51C24.2 47.8 18 40.5 18 31V20L32 14Z"
                fill="var(--card)"
                stroke="var(--green)"
                strokeWidth="2.4"
                strokeLinejoin="round"
              />
              <path
                d="M25.5 32.5L30 37L39 27.5"
                stroke="var(--green)"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex flex-col gap-1 items-center">
              <h2 className="h20 text-[var(--ink)]">
                {scopedList.length === 0
                  ? 'Clean slate — zero open mistakes'
                  : 'No mistakes match this filter'}
              </h2>
              <p className="text-[14px] text-[var(--dim)] max-w-md leading-relaxed">
                {scopedList.length === 0
                  ? 'Every question you miss in practice, topic tests, or mock exams is saved here automatically until you solve it twice in a row.'
                  : 'Try switching the subject or trap category above to review other saved questions.'}
              </p>
            </div>
            {scopedList.length === 0 ? (
              <button type="button" onClick={onBack} className="btn-tactile indigo mt-1">
                <span>Back to study</span>
                <Icon name="go" size={16} className="ul-arrow" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setTrapFilter('all');
                  setSubjFilter('all');
                }}
                className="btn-tactile paper mt-1"
              >
                <span>Show all mistakes</span>
              </button>
            )}
          </section>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((item) => {
              const q = findQuestion(progress, item.subj, item.qid);
              const topic = getTopic(item.subj, item.tid);
              if (!q) return null;
              return (
                <article
                  key={item.qid}
                  className="rtc-card rounded-2xl p-4 sm:p-5 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap text-[12px]">
                    <div className="flex items-center gap-2 font-semibold text-[var(--dim)]">
                      <span className="text-[var(--gold)] font-bold">{SUBJECT_INFO[item.subj].name}</span>
                      <span aria-hidden="true">·</span>
                      <span>{topic?.name || item.tid}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[var(--coral-ink)]">{TRAP_META[item.trap].shortLabel}</span>
                    </div>
                    <span className="font-mono text-[11.5px] font-bold text-[var(--dim)] tabular-nums">
                      Missed {item.missCount}× · Fixed {item.clearCount}/2
                    </span>
                  </div>

                  <div
                    className="text-[15px] font-medium text-[var(--ink)] leading-snug"
                    dangerouslySetInnerHTML={{ __html: typesetMathHtml(q.q, item.subj) }}
                  />

                  <div className="flex items-center justify-between gap-3 pt-2 border-t border-[var(--line)]">
                    <span className="text-[12.5px] text-[var(--dim)]">
                      Watch out: {TRAP_META[item.trap].tip}
                    </span>
                    <button
                      type="button"
                      onClick={() => onOpenTopicNotes(item.subj, item.tid)}
                      className="text-[12.5px] font-bold text-[var(--gold)] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Open notes
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </SmoothViewSwitch>
    </div>
  );
}
