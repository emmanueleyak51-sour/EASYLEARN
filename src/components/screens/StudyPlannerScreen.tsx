import React, { useMemo, useState } from 'react';
import type { SubjectId, Topic, UserProgress } from '../../types';
import { SUBJECTS, SUBJECT_IDS } from '../../data/curriculum';
import { SUBJECT_INFO } from '../../utils/engine';
import { isJambSubject } from '../../utils/examSubjects';
import {
  getVisibleEnrolledSubjects,
  normalizeJambQuartet,
  resolveExamTrack,
} from '../../utils/examTrackLogic';
import {
  buildAdaptiveStudyPlan,
  getDefaultStudyPlan,
  type StudyPlanConfig,
} from '../../utils/studyPlannerLogic';
import { SubscreenTopBar } from '../AppShell';
import { Icon } from '../Icons';
import { LiquidCapsuleBar, SmoothProgressBar, SmoothViewSwitch } from '../ULessonMotion';

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
  const defaultPlan = useMemo(() => {
    const base = getDefaultStudyPlan(getVisibleEnrolledSubjects(progress));
    return { ...base, examType: resolveExamTrack(progress) };
  }, [progress]);
  const plan: StudyPlanConfig = progress.studyPlan || defaultPlan;
  const [subjectSearch, setSubjectSearch] = useState('');

  const maxFocusCount = plan.examType === 'jamb' ? 4 : 8;

  const visibleSubjects = useMemo(() => {
    const q = subjectSearch.trim().toLowerCase();
    const enrolledVisible = getVisibleEnrolledSubjects(progress);
    const list = SUBJECT_IDS.filter((sid) => {
      if (plan.examType === 'jamb' && !isJambSubject(sid)) return false;
      if (!q) return true;
      return (
        SUBJECT_INFO[sid].name.toLowerCase().includes(q) ||
        SUBJECT_INFO[sid].short.toLowerCase().includes(q)
      );
    });
    return [...list].sort((a, b) => {
      const aFocus = plan.focusSubjects.includes(a) ? 0 : enrolledVisible.includes(a) ? 1 : 2;
      const bFocus = plan.focusSubjects.includes(b) ? 0 : enrolledVisible.includes(b) ? 1 : 2;
      return aFocus - bFocus;
    });
  }, [subjectSearch, plan.examType, plan.focusSubjects, progress]);

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
    if (plan.examType === 'jamb' && sid === 'eng') return;
    const cur = plan.focusSubjects;
    if (cur.includes(sid)) {
      if (cur.length <= 1) return;
      onSavePlan({ ...plan, focusSubjects: cur.filter((x) => x !== sid) });
    } else if (cur.length < maxFocusCount) {
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
        title="Study plan"
        subtitle="Daily topics chosen around your exam date"
        onBack={onBack}
      />

      {/* Countdown Hero Strip */}
      <section className="rtc-eq-plate rounded-[28px] p-5 sm:p-6 text-white flex flex-col min-[760px]:flex-row min-[760px]:items-center justify-between gap-5">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-[12.5px] font-bold text-white/85">
            <span>
              {plan.examType === 'jamb'
                ? 'JAMB UTME plan · Tough 4-subject focus'
                : plan.examType === 'both'
                  ? 'JAMB + WAEC plan · 70% JAMB / 30% WAEC'
                  : 'WAEC plan · Paper 1 & Paper 2 precision'}
            </span>
          </div>
          <h2 className="font-[var(--display)] font-bold text-[32px] sm:text-[38px] leading-tight tabular-nums">
            {snapshot.daysRemaining} {snapshot.daysRemaining === 1 ? 'day' : 'days'} to exam
          </h2>
          <p className="text-[14px] text-white/85 max-w-xl leading-relaxed">
            {snapshot.paceHeadline}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2.5 shrink-0 text-center">
          <div className="tile-mint rounded-2xl px-4 py-3">
            <div className="text-[11.5px] font-bold opacity-80">Covered</div>
            <div className="font-[var(--display)] font-bold text-[20px] tabular-nums">{snapshot.coveragePct}%</div>
          </div>
          <div className="tile-sky rounded-2xl px-4 py-3">
            <div className="text-[11.5px] font-bold opacity-80">Topics left</div>
            <div className="font-[var(--display)] font-bold text-[20px] tabular-nums">{snapshot.remainingTopics}</div>
          </div>
          <div className="tile-peach rounded-2xl px-4 py-3">
            <div className="text-[11.5px] font-bold opacity-80">Per day</div>
            <div className="font-[var(--display)] font-bold text-[20px] tabular-nums">
              {snapshot.requiredTopicsPerDay}
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 min-[880px]:grid-cols-12 gap-5 items-start">
        {/* Planner Controls */}
        <section className="min-[880px]:col-span-5 rtc-card rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-0.5">
            <span className="eyebrow text-[var(--gold)]">Exam setup</span>
            <h3 className="h18 text-[var(--ink)]">Set your exam goal</h3>
          </div>

          <LiquidCapsuleBar
            roleType="tablist"
            size="sm"
            layoutMode="grid"
            gridClassName="grid-cols-3"
            ariaLabel="Select study plan exam track"
            items={[
              { id: 'jamb' as const, label: 'JAMB' },
              { id: 'waec' as const, label: 'WAEC' },
              { id: 'both' as const, label: 'Both (70/30)' },
            ]}
            value={plan.examType}
            onChange={(nextType) => {
              const nextFocus =
                nextType === 'jamb'
                  ? normalizeJambQuartet(plan.focusSubjects)
                  : plan.focusSubjects;
              onSavePlan({ ...plan, examType: nextType, focusSubjects: nextFocus });
            }}
          />

          <label className="flex flex-col gap-1.5">
            <span className="text-[12.5px] font-bold text-[var(--ink)]">Exam date</span>
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
              <span className="font-bold text-[var(--ink)]">Daily study time</span>
              <span className="font-mono font-bold text-[var(--gold)] tabular-nums">{plan.dailyMinutes} min a day</span>
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
            <span className="text-[12.5px] font-bold text-[var(--ink)] tabular-nums">
              Subjects to focus on ({plan.focusSubjects.length} of up to {maxFocusCount})
            </span>
            <input
              type="search"
              value={subjectSearch}
              onChange={(e) => setSubjectSearch(e.target.value)}
              aria-label="Search subjects to focus on"
              placeholder="Find any subject..."
              className="w-full min-h-[36px] px-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] focus:border-[var(--gold)] text-[13px] font-medium text-[var(--ink)] outline-none"
            />
            <div className="grid grid-cols-2 gap-1.5 max-h-[240px] overflow-y-auto pr-0.5">
              {visibleSubjects.map((sid) => {
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
              <span className="eyebrow text-[var(--gold)]">Next 7 days</span>
              <h3 className="h18 text-[var(--ink)]">Your daily study list</h3>
            </div>
            <span className="text-[12px] text-[var(--dim)] whitespace-nowrap">
              {plan.examType === 'both' ? '70% JAMB · 30% WAEC' : 'Weakest topics first'}
            </span>
          </div>

          <SmoothViewSwitch viewKey={plan.examType}>
            {groupedDays.length === 0 ? (
              <div className="rounded-xl bg-[var(--ok-soft)] border border-[var(--ok-line)] p-4 text-[14px] text-[var(--ink)]">
                Every topic across your focus subjects is passed! Take a mock exam to keep your speed sharp.
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
                            <div className="text-[11.5px] font-semibold text-[var(--dim)] tabular-nums">
                              {SUBJECT_INFO[task.subj].name} · {task.estMinutes} min ·{' '}
                              {task.stage === 'lesson' ? '1. Learn' : task.stage === 'practice' ? '2. Practise' : '3. Topic test'}
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
          </SmoothViewSwitch>
        </section>
      </div>
    </div>
  );
}
