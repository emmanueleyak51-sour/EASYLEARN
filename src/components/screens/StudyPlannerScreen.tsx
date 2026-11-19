import React, { useMemo } from 'react';
import type { SubjectId, Topic, UserProgress } from '../../types';
import { SUBJECTS, SUBJECT_IDS } from '../../data/curriculum';
import { SUBJECT_INFO } from '../../utils/engine';
import {
  buildAdaptiveStudyPlan,
  getDefaultStudyPlan,
  type StudyPlanConfig,
} from '../../utils/studyPlannerLogic';
import { SubscreenTopBar } from '../AppShell';
import { Icon } from '../Icons';
import { SmoothProgressBar } from '../ULessonMotion';
import { WatCompactStrip } from '../WatClock';

export function StudyPlannerScreen({
  progress,
  onSavePlan,
  onLaunchTask,
  onBack,
}: {
  progress: UserProgress;
  onSavePlan: (cfg: StudyPlanConfig) => void;
  onLaunchTask: (subj: SubjectId, topicId: string, stage: 'lesson' | 'practice' | 'boss') => void;
  onBack: () => void;
}) {
  const plan: StudyPlanConfig = progress.studyPlan || getDefaultStudyPlan(progress.subjs);

  const topicsMap = useMemo(() => {
    const map = {} as Record<SubjectId, Topic[]>;
    for (const sid of SUBJECT_IDS) map[sid] = SUBJECTS[sid].topics;
    return map;
  }, []);

  const snapshot = useMemo(
    () => buildAdaptiveStudyPlan(plan, progress, topicsMap),
    [plan, progress, topicsMap]
  );

  const toggleFocusSubj = (sid: SubjectId) => {
    const cur = plan.focusSubjects;
    if (cur.includes(sid)) {
      if (cur.length <= 1) return;
      onSavePlan({ ...plan, focusSubjects: cur.filter((x) => x !== sid) });
    } else if (cur.length < 6) {
      onSavePlan({ ...plan, focusSubjects: [...cur, sid] });
    }
  };

  // Group weekly roadmap by dayOffset
  const groupedDays = useMemo(() => {
    const map = new Map<number, { dateLabel: string; tasks: typeof snapshot.weeklyRoadmap }>();
    for (const task of snapshot.weeklyRoadmap) {
      const existing = map.get(task.dayOffset);
      if (existing) existing.tasks.push(task);
      else map.set(task.dayOffset, { dateLabel: task.dateLabel, tasks: [task] });
    }
    return Array.from(map.entries()).map(([offset, val]) => ({ offset, ...val }));
  }, [snapshot.weeklyRoadmap]);

  return (
    <div className="flex flex-col gap-5 anim-rise">
      <SubscreenTopBar
        title="Exam Countdown & Study Planner"
        subtitle="WAT-Synced Adaptive Syllabus Roadmap"
        onBack={onBack}
      />

      {/* Countdown Hero Strip */}
      <section className="rtc-eq-plate rounded-2xl p-5 sm:p-6 text-white flex flex-col min-[760px]:flex-row min-[760px]:items-center justify-between gap-5">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-[12.5px] font-semibold text-amber-300">
            <span>{plan.examType === 'jamb' ? 'JAMB UTME Countdown' : 'WAEC SSCE Countdown'}</span>
            <span aria-hidden="true">·</span>
            <WatCompactStrip surface="glass" />
          </div>
          <h2 className="font-[var(--display)] font-extrabold text-[32px] sm:text-[38px] leading-tight tabular-nums">
            {snapshot.daysRemaining} {snapshot.daysRemaining === 1 ? 'Day' : 'Days'} Left
          </h2>
          <p className="text-[14px] text-slate-300 max-w-xl leading-relaxed">
            {snapshot.paceHeadline}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2.5 shrink-0 text-center">
          <div className="rounded-xl bg-white/10 border border-white/15 px-4 py-3">
            <div className="text-[11px] text-slate-300">Covered</div>
            <div className="font-mono font-bold text-[20px] tabular-nums">{snapshot.coveragePct}%</div>
          </div>
          <div className="rounded-xl bg-white/10 border border-white/15 px-4 py-3">
            <div className="text-[11px] text-slate-300">Remaining</div>
            <div className="font-mono font-bold text-[20px] tabular-nums">{snapshot.remainingTopics}</div>
          </div>
          <div className="rounded-xl bg-white/10 border border-white/15 px-4 py-3">
            <div className="text-[11px] text-slate-300">Pace/Day</div>
            <div className="font-mono font-bold text-[20px] text-amber-300 tabular-nums">
              {snapshot.requiredTopicsPerDay}
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 min-[880px]:grid-cols-12 gap-5 items-start">
        {/* Planner Controls */}
        <section className="min-[880px]:col-span-5 rtc-card rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-0.5">
            <span className="eyebrow text-[var(--gold)]">Target Configuration</span>
            <h3 className="h18 text-[var(--ink)]">Customize Your Roadmap</h3>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {(
              [
                ['jamb', 'JAMB UTME'],
                ['waec', 'WAEC SSCE'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => onSavePlan({ ...plan, examType: id })}
                className={`py-2 rounded-xl border text-[13px] font-bold cursor-pointer ${
                  plan.examType === id
                    ? 'bg-[var(--gold)] text-[var(--on-acc)] border-[var(--gold)]'
                    : 'bg-[var(--bg)] text-[var(--dim)] border-[var(--line)]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-[12.5px] font-bold text-[var(--ink)]">Target Exam Date (WAT)</span>
            <input
              type="date"
              value={plan.examDateIso}
              onChange={(e) => {
                if (e.target.value) onSavePlan({ ...plan, examDateIso: e.target.value });
              }}
              className="w-full h-10 px-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-[14px] font-mono font-semibold text-[var(--ink)]"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[12.5px]">
              <span className="font-bold text-[var(--ink)]">Daily Study Budget</span>
              <span className="font-mono font-bold text-[var(--gold)] tabular-nums">{plan.dailyMinutes} min/day</span>
            </div>
            <input
              type="range"
              min={20}
              max={120}
              step={5}
              value={plan.dailyMinutes}
              onChange={(e) => onSavePlan({ ...plan, dailyMinutes: Number(e.target.value) })}
              className="w-full accent-[var(--gold)] cursor-pointer"
            />
          </label>

          <div className="flex flex-col gap-2">
            <span className="text-[12.5px] font-bold text-[var(--ink)]">
              Focus Subjects ({plan.focusSubjects.length} of up to 6)
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {SUBJECT_IDS.map((sid) => {
                const active = plan.focusSubjects.includes(sid);
                return (
                  <button
                    key={sid}
                    type="button"
                    onClick={() => toggleFocusSubj(sid)}
                    className={`min-h-[34px] px-2.5 rounded-lg border text-[12px] font-semibold flex items-center justify-between gap-1 cursor-pointer ${
                      active
                        ? 'bg-[var(--acc-soft)] border-[var(--gold)] text-[var(--ink)] font-bold'
                        : 'bg-[var(--bg)] border-[var(--line)] text-[var(--dim)]'
                    }`}
                  >
                    <span className="truncate">{SUBJECT_INFO[sid].short}</span>
                    {active && <Icon name="check" size={12} className="text-[var(--gold)] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-[var(--line)] flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[12px] font-semibold text-[var(--dim)]">
              <span>Syllabus progress</span>
              <span className="font-mono text-[var(--ink)] tabular-nums">
                {snapshot.masteredTopics}/{snapshot.totalTopics} mastered
              </span>
            </div>
            <SmoothProgressBar value={snapshot.masteredTopics} max={Math.max(1, snapshot.totalTopics)} tone="emerald" />
          </div>
        </section>

        {/* 7-Day Interleaved Adaptive Schedule */}
        <section className="min-[880px]:col-span-7 rtc-card rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="eyebrow text-[var(--gold)]">Next 7 Days · Auto-Balanced</span>
              <h3 className="h18 text-[var(--ink)]">Your Daily Study Queue</h3>
            </div>
            <span className="text-[12px] text-[var(--dim)]">Weakest topics prioritized</span>
          </div>

          {groupedDays.length === 0 ? (
            <div className="rounded-xl bg-[var(--ok-soft)] border border-[var(--ok-line)] p-4 text-[14px] text-[var(--ink)]">
              Every topic across your focus subjects is mastered! Use the CBT Exam Simulator to maintain peak exam speed.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {groupedDays.map((dayGroup) => (
                <div key={dayGroup.offset} className="flex flex-col gap-2">
                  <div className="text-[12.5px] font-bold text-[var(--gold)]">{dayGroup.dateLabel}</div>
                  <div className="flex flex-col gap-2">
                    {dayGroup.tasks.map((task) => (
                      <button
                        key={`${dayGroup.offset}-${task.subj}-${task.topicId}`}
                        type="button"
                        onClick={() => onLaunchTask(task.subj, task.topicId, task.stage)}
                        className="text-left rounded-xl bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--acc-line)] px-3.5 py-3 flex items-center justify-between gap-3 transition cursor-pointer"
                      >
                        <div className="min-w-0">
                          <div className="text-[11.5px] font-semibold text-[var(--dim)]">
                            {SUBJECT_INFO[task.subj].name} · {task.estMinutes} min ·{' '}
                            {task.stage === 'lesson' ? 'Step 1: Lesson' : task.stage === 'practice' ? 'Step 2: Practice' : 'Step 3: Topic Test'}
                          </div>
                          <div className="font-[var(--display)] font-bold text-[14.5px] text-[var(--ink)] truncate">
                            {task.topicName}
                          </div>
                        </div>
                        <Icon name="go" size={16} className="text-[var(--gold)] shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
