import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion, type Variants } from 'motion/react';
import type { ChemClassId, SubjectId, UserProgress } from '../../types';
import { getTopics, getTopicsForProgress, SUBJECT_IDS } from '../../data/curriculum';
import { extractMissionSpeechScript } from '../../utils/chemVoiceLogic';
import {
  SUBJECT_INFO,
  computeTopicsProgressPct,
  greet,
  homeTopics,
  isTopicLocked,
  mpct,
  nextMission,
  today,
  tstate,
  tstatus,
} from '../../utils/engine';
import { estimateJambScoreOutOf400 } from '../../utils/examSubjects';
import { getDailyQuietLine } from '../../utils/motivationLogic';
import eyakTrophyUrl from '../../assets/images/eyak_golden_trophy_1795315897770.jpg';
import { AnimatedNumber } from '../AnimatedNumber';
import { ChemMadScientistBar } from '../ChemMadScientistBar';
import { subjectToLiveCoachMode } from '../../context/LiveCoachContext';
import { Icon, MiniRing } from '../Icons';
import { StudyBuddyGreeting } from '../StudyBuddy';
import {
  FLUID_SCREEN_EXIT,
  FLUID_SCREEN_SPRING,
  LiquidCapsuleBar,
  SmoothProgressBar,
} from '../ULessonMotion';
import { computeSubjectSwitchDirection } from '../../utils/screenTransitionLogic';
import { summarizeMistakeVault } from '../../utils/mistakeVaultLogic';
import { computeDaysRemainingWat } from '../../utils/studyPlannerLogic';
import { SUBJECT_STUDIO_META } from '../../utils/subjectStudioMeta';
import {
  calibrateToughJambScore400,
  getSaturdayCbtCampaign,
  getToughJambDrillConfig,
  getVisibleEnrolledSubjects,
  getWaecMistakeGuidance,
  pickWeightedBothTrackSlot,
  resolveExamTrack,
} from '../../utils/examTrackLogic';
import type { QuestionBankTab } from '../QuestionBankManagerModal';

interface SubjectGlideCustom {
  dir: -1 | 0 | 1;
  reduced: boolean;
}

const HOME_SUBJECT_VARIANTS: Variants = {
  initial: (c: SubjectGlideCustom) =>
    c?.reduced ? { opacity: 0 } : { opacity: 0, x: (c?.dir || 1) * 24 },
  animate: (c: SubjectGlideCustom) => ({
    opacity: 1,
    x: 0,
    transition: c?.reduced ? { duration: 0.01 } : FLUID_SCREEN_SPRING,
  }),
  exit: (c: SubjectGlideCustom) =>
    c?.reduced
      ? { opacity: 0, pointerEvents: 'none', transition: { duration: 0.01 } }
      : {
          opacity: 0,
          x: -(c?.dir || 1) * 18,
          pointerEvents: 'none',
          transition: FLUID_SCREEN_EXIT,
        },
};

function estimateJambScore400(progress: UserProgress): number {
  return estimateJambScoreOutOf400(progress, getTopics);
}

export function ActivityBars({ act, days = 7 }: { act: Record<number, number>; days?: number }) {
  const d = today();
  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const items = Array.from({ length: days }, (_, idx) => {
    const dayNum = d - (days - 1 - idx);
    const count = act[dayNum] || 0;
    const dow = ((new Date().getDay() - (days - 1 - idx)) % 7 + 7) % 7;
    return {
      dayNum,
      count,
      label: idx === days - 1 ? 'Today' : labels[dow],
      isToday: idx === days - 1,
    };
  });
  const maxVal = Math.max(5, ...items.map((x) => x.count));

  return (
    <div className="grid grid-cols-7 gap-2 items-end pt-2" role="img" aria-label="Activity this week">
      {items.map((it) => {
        const barH = Math.max(8, Math.round((it.count / maxVal) * 56));
        const yPos = 60 - barH;
        return (
          <div key={it.dayNum} className="flex flex-col items-center gap-1.5">
            <span className="text-[11.5px] font-bold tabular-nums text-[var(--dim)]">
              {it.count > 0 ? it.count : ''}
            </span>
            <svg width="28" height="62" viewBox="0 0 28 62" aria-hidden="true">
              <rect x="4" y="4" width="20" height="56" rx="8" fill="var(--bg-out)" />
              <rect
                x="4"
                y={yPos}
                width="20"
                height={barH}
                rx="8"
                fill={it.isToday ? 'var(--gold)' : it.count > 0 ? 'var(--green)' : 'var(--line)'}
                className="dg"
              />
            </svg>
            <span
              className={`text-[11.5px] font-bold ${
                it.isToday ? 'text-[var(--gold)]' : 'text-[var(--dim)]'
              }`}
            >
              {it.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function HomeScreen({
  progress,
  dueIds,
  isOwner = false,
  onSelectSubject,
  onManageSubjects,
  onOpenExamSetup,
  onOpenTopic,
  onStartMission,
  onOpenReview,
  onStartDiagnostic,
  onOpenLab,
  onOpenStudio,
  onOpenFormulas,
  onOpenTopicsMap,
  onOpenCbt,
  onOpenMistakes,
  onOpenPlanner,
  onOpenSandboxes,
  onOpenTheory,
  onOpenTranscript,
  onOpenDuel,
  onOpenLeaderboard,
  onOpenQuestionBank,
  onOpenPaywall,
}: {
  progress: UserProgress;
  dueIds: string[];
  isOwner?: boolean;
  onSelectSubject: (s: SubjectId) => void;
  onSelectClassAndBrowse?: (cls: ChemClassId) => void;
  onManageSubjects: () => void;
  onOpenExamSetup?: () => void;
  onOpenTopic: (tid: string) => void;
  onStartMission: (tid: string, stage: 'lesson' | 'practice' | 'boss') => void;
  onOpenReview: () => void;
  onStartDiagnostic: () => void;
  onOpenLab: () => void;
  onOpenStudio?: () => void;
  onOpenFormulas?: () => void;
  onOpenTopicsMap: () => void;
  onOpenCbt?: () => void;
  onOpenMistakes?: () => void;
  onOpenPlanner?: () => void;
  onOpenSandboxes?: () => void;
  onOpenTheory?: () => void;
  onOpenTranscript?: () => void;
  onOpenDuel?: () => void;
  onOpenLeaderboard?: () => void;
  onOpenQuestionBank?: (subj?: SubjectId, tab?: QuestionBankTab) => void;
  onOpenPaywall?: (reason?: string) => void;
}) {
  const subj = progress.subj;
  const hasLabs =
    subj === 'maths' || subj === 'phys' || subj === 'chem' || subj === 'bio' || subj === 'agric';
  const allSubjectTopics = getTopics(subj);
  const topics = getTopicsForProgress(progress);
  const passedCount = topics.filter((t) => tstate(progress, t.id).boss).length;
  const mission = nextMission(progress, topics, allSubjectTopics);
  const focus = homeTopics(progress, topics, allSubjectTopics).slice(0, 3);
  const hasLockedRemaining = topics.some(
    (t) => !tstate(progress, t.id).boss && isTopicLocked(progress, t.id, allSubjectTopics)
  );
  const hasDiagnosed = !!(progress.sx[subj]?.dx || progress.dx);
  const dueCount = dueIds.length;
  const openMistakesCount = summarizeMistakeVault(progress.mistakes || {}).total;

  const hasSetExamDate = Boolean(progress.studyPlan?.examDateIso && progress.flags?.examDateSet);
  const daysToExam = hasSetExamDate
    ? computeDaysRemainingWat(progress.studyPlan!.examDateIso)
    : null;

  const examTrack = resolveExamTrack(progress);
  const visibleSubjs = useMemo(() => getVisibleEnrolledSubjects(progress), [progress]);
  const drillCfg = getToughJambDrillConfig(examTrack, subj, progress.jambSubjects);

  const rawJamb400 = estimateJambScore400(progress);
  const toughJamb = calibrateToughJambScore400(rawJamb400, progress);
  const estimatedJamb400 = toughJamb.toughScore400;
  const targetJamb400 = Math.max(200, Math.min(400, Math.round((progress.target || 75) * 4)));

  const waecReadinessPct = useMemo(() => {
    const list = visibleSubjs.length > 0 ? visibleSubjs : ([subj] as SubjectId[]);
    const avgSubj = Math.round(
      list.reduce((acc, sid) => acc + computeTopicsProgressPct(progress, getTopics(sid)), 0) /
        list.length
    );
    return Math.max(avgSubj, Math.round((rawJamb400 / 400) * 100));
  }, [progress, rawJamb400, subj, visibleSubjs]);

  const waecGradeLabel =
    waecReadinessPct >= 75
      ? 'A1'
      : waecReadinessPct >= 70
        ? 'B2'
        : waecReadinessPct >= 65
          ? 'B3'
          : waecReadinessPct >= 60
            ? 'C4'
            : waecReadinessPct >= 55
              ? 'C5'
              : waecReadinessPct >= 50
                ? 'C6'
                : 'D7';

  const bothWeightedSlot =
    examTrack === 'both'
      ? pickWeightedBothTrackSlot(
          progress.jambSubjects || visibleSubjs,
          visibleSubjs,
          today() + progress.hist.length
        )
      : null;

  const satCampaign = getSaturdayCbtCampaign(Date.now(), progress.cbtHistory);
  const [dailyCbtCount, setDailyCbtCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const cbtMode = examTrack === 'waec' ? 'waec' : 'jamb';
    const headers: Record<string, string> = {};
    if (progress.devToken) headers['X-Device-Token'] = progress.devToken;
    fetch(`/api/cloud/cbt-daily?mode=${cbtMode}`, { headers })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { entries?: unknown[] } | null) => {
        if (!cancelled && data && Array.isArray(data.entries)) {
          setDailyCbtCount(data.entries.length);
        }
      })
      .catch(() => {
        /* ignore offline */
      });
    return () => {
      cancelled = true;
    };
  }, [examTrack, progress.devToken, progress.cbtHistory?.length]);

  const missionLabel = mission
    ? mission.stage === 'lesson'
      ? 'Start lesson'
      : mission.stage === 'practice'
        ? 'Practise 6 questions'
        : 'Take topic test'
    : 'Revise due questions';

  const buddyGreeting = mission
    ? `${greet()}, ${progress.name || 'friend'}! Ready for ${mission.t.name.toLowerCase()} in ${SUBJECT_INFO[subj].short}?`
    : hasLockedRemaining
      ? `${greet()}, ${progress.name || 'friend'}! Your 3-day starter trial has ended — unlock full access from ₦1,000/month.`
      : `${greet()}, ${progress.name || 'friend'}! You have finished every topic in ${SUBJECT_INFO[subj].short}.`;

  const buddySubline =
    progress.streak.n > 1
      ? `You have studied ${progress.streak.n} days in a row. One steady step keeps it going.`
      : 'Take one small step today — learn the idea, practise, then pass the topic test.';

  const prefersReduced = Boolean(useReducedMotion());
  const subjTransRef = useRef<{ subj: SubjectId; dir: -1 | 0 | 1 }>({
    subj,
    dir: 0,
  });
  if (subjTransRef.current.subj !== subj) {
    subjTransRef.current = {
      subj,
      dir: computeSubjectSwitchDirection(subjTransRef.current.subj, subj),
    };
  }
  const subjGlideCustom: SubjectGlideCustom = {
    dir: subjTransRef.current.dir,
    reduced: prefersReduced,
  };

  const [trophyFailed, setTrophyFailed] = useState(false);
  const coachMode = subjectToLiveCoachMode(subj);
  const mentorQuestionPrefix = mission
    ? `Ready for ${mission.t.name.toLowerCase()} in`
    : hasLockedRemaining
      ? 'Unlock all topics & tutors in'
      : 'You mastered every topic in';
  const jambPct =
    examTrack === 'waec'
      ? Math.min(
          100,
          Math.max(5, Math.round((waecReadinessPct / Math.max(1, progress.target || 75)) * 100))
        )
      : Math.min(
          100,
          Math.max(5, Math.round((estimatedJamb400 / Math.max(1, targetJamb400)) * 100))
        );

  const examBadgeLabel =
    examTrack === 'jamb'
      ? 'Exam: JAMB (4 subjects)'
      : examTrack === 'waec'
        ? 'Exam: WAEC'
        : 'Exam: JAMB 70% + WAEC 30%';

  return (
    <div className="flex flex-col gap-5">
      {/* Illustrated Nigerian Campus Mentor Hero Stage + Integrated Daily Thought */}
      <StudyBuddyGreeting
        mood={progress.streak.n >= 3 ? 'cheer' : 'happy'}
        timeGreeting={greet()}
        studentName={progress.name || 'Scholar'}
        questionPrefix={mentorQuestionPrefix}
        subjectHighlight={SUBJECT_INFO[subj].short}
        greeting={buddyGreeting}
        subtext={buddySubline}
        thoughtLine={getDailyQuietLine(today())}
        onClickPrompt={
          mission
            ? () => onStartMission(mission.t.id, mission.stage)
            : hasLockedRemaining && onOpenPaywall
              ? () =>
                  onOpenPaywall(
                    'Subscribe from ₦1,000/month for 100% full access to every topic, tutor, mock exam and colour theme.'
                  )
              : undefined
        }
      />

      {/* Dimensional Royal-Indigo Exam Track Score Showcase Card + Golden Trophy + Interactive Stat Tiles */}
      <section
        aria-label={
          examTrack === 'waec'
            ? 'WAEC readiness and predicted grade'
            : 'Estimated JAMB score and progress'
        }
        className="eyak-jamb-showcase relative overflow-hidden rounded-[22px] text-white p-4 sm:p-5 flex flex-col gap-3"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-12 w-64 h-64 rounded-full bg-[#7C3AED]/30 blur-2xl"
        />

        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="flex flex-col gap-2 min-w-0">
            <div className="inline-flex items-center gap-2 flex-wrap text-[13px] sm:text-[14px] font-bold text-white/95">
              <Icon name="bars" size={16} className="text-[#DDD6FE] shrink-0" />
              <span>
                {examTrack === 'waec'
                  ? 'WAEC exam readiness'
                  : examTrack === 'both'
                    ? 'Tough JAMB score · 70% UTME / 30% WAEC'
                    : 'Tough-calibrated JAMB score'}
              </span>
            </div>

            {examTrack === 'waec' ? (
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="font-[var(--display)] font-extrabold text-[38px] sm:text-[46px] leading-none tracking-tight tabular-nums drop-shadow-sm">
                  <AnimatedNumber value={waecReadinessPct} suffix="%" />
                </span>
                <span className="font-[var(--display)] font-semibold text-[16px] sm:text-[18.5px] text-white/85 tabular-nums">
                  · Grade {waecGradeLabel} · target {progress.target || 75}%
                </span>
              </div>
            ) : (
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="font-[var(--display)] font-extrabold text-[38px] sm:text-[46px] leading-none tracking-tight tabular-nums drop-shadow-sm">
                  <AnimatedNumber value={estimatedJamb400} />
                </span>
                <span className="font-[var(--display)] font-semibold text-[16px] sm:text-[18.5px] text-white/85 tabular-nums">
                  / 400 · target {targetJamb400}
                  {examTrack === 'both' ? ` · WAEC ${waecGradeLabel}` : ''}
                </span>
              </div>
            )}

            <p className="text-[12.5px] text-white/85 leading-snug max-w-[56ch]">
              {examTrack === 'waec'
                ? getWaecMistakeGuidance(subj).examFormatLine
                : examTrack === 'both' && bothWeightedSlot
                  ? `${bothWeightedSlot.weightLabel} · Next focus: ${SUBJECT_INFO[bothWeightedSlot.subj].short}. ${toughJamb.calibrationNote}`
                  : toughJamb.calibrationNote}
            </p>

            <div className="pt-0.5 flex flex-wrap items-center gap-2">
              {onOpenExamSetup && (
                <button
                  type="button"
                  onClick={onOpenExamSetup}
                  className="min-h-[36px] px-3.5 rounded-full bg-white/16 hover:bg-white/25 border border-white/30 text-[12.5px] font-bold text-white inline-flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap"
                >
                  <Icon name="target" size={14} />
                  <span>{examBadgeLabel}</span>
                </button>
              )}
              {onOpenPlanner && (
                <button
                  type="button"
                  onClick={onOpenPlanner}
                  className="min-h-[36px] px-3.5 rounded-full bg-[#7C3AED]/55 hover:bg-[#7C3AED]/75 border border-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] text-[12.5px] font-bold text-white inline-flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap"
                >
                  <Icon name="calendar" size={14} />
                  <span className="tabular-nums">
                    {hasSetExamDate && daysToExam !== null
                      ? `${daysToExam} days to exam`
                      : 'Set exam date'}
                  </span>
                  <Icon name="go" size={13} className="opacity-90" />
                </button>
              )}
            </div>
          </div>

          {/* Gleaming Golden Trophy & Laurel Wreath */}
          <div
            aria-hidden="true"
            className="relative w-[82px] h-[82px] sm:w-[104px] sm:h-[104px] rounded-[20px] overflow-hidden shrink-0 flex items-center justify-center select-none pointer-events-none"
          >
            {!trophyFailed ? (
              <img
                src={eyakTrophyUrl}
                alt="Golden victory trophy"
                referrerPolicy="no-referrer"
                draggable={false}
                onError={() => setTrophyFailed(true)}
                className="w-full h-full object-cover mix-blend-lighten scale-[1.08] [mask-image:radial-gradient(circle,black_58%,transparent_95%)]"
              />
            ) : (
              <span className="w-14 h-14 rounded-2xl bg-amber-400/20 border border-amber-300/40 text-amber-300 flex items-center justify-center">
                <Icon name="trophy" size={30} />
              </span>
            )}
          </div>
        </div>

        {/* Luminous Liquid Target Progress Meter */}
        <div className="relative z-10 w-full">
          <SmoothProgressBar
            value={jambPct}
            max={100}
            tone="indigo"
            heightClass="h-3"
            trackClass="bg-[#160542]/70 p-0.5 border border-white/15"
            ariaLabel="Target exam score progress"
          />
        </div>

        {/* Warm Peach Streak + Fresh Mint Subject Progress + Sky Revision Tiles */}
        <div
          className={`relative z-10 grid grid-cols-1 ${
            dueCount > 0 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'
          } gap-2.5 pt-0.5`}
        >
          <div className="tile-peach rounded-2xl px-3.5 py-2.5 flex items-center justify-between gap-2.5 shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-8 h-8 rounded-full bg-[#FB923C]/20 text-[#EA580C] flex items-center justify-center shrink-0">
                <Icon name="flame" size={17} />
              </span>
              <div className="flex flex-col min-w-0">
                <span className="text-[11.5px] font-bold opacity-85">Study streak</span>
                <span className="font-[var(--display)] font-extrabold text-[18px] leading-tight tabular-nums">
                  <AnimatedNumber value={progress.streak.n} />{' '}
                  {progress.streak.n === 1 ? 'day' : 'days'}
                </span>
              </div>
            </div>
            <Icon name="trendUp" size={16} className="text-[#D97706] shrink-0" />
          </div>

          <button
            type="button"
            onClick={onOpenTopicsMap}
            className="tile-mint rounded-2xl px-3.5 py-2.5 text-left flex items-center justify-between gap-2.5 cursor-pointer active:translate-y-[1px] transition-transform duration-150 shadow-xs"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-8 h-8 rounded-full bg-[#10B981] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Icon name="check" size={16} />
              </span>
              <div className="flex flex-col min-w-0">
                <span className="text-[11.5px] font-bold opacity-85 truncate">
                  {SUBJECT_INFO[subj].short} progress
                </span>
                <span className="font-[var(--display)] font-extrabold text-[18px] leading-tight tabular-nums">
                  <AnimatedNumber value={computeTopicsProgressPct(progress, topics)} suffix="%" />
                </span>
              </div>
            </div>
            <Icon name="go" size={16} className="shrink-0 opacity-80" />
          </button>

          {dueCount > 0 && (
            <button
              type="button"
              onClick={onOpenReview}
              className="tile-sky rounded-2xl px-3.5 py-2.5 text-left flex items-center justify-between gap-2 cursor-pointer active:translate-y-[1px] transition-transform duration-150 shadow-xs"
            >
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-[11.5px] font-bold opacity-85">Revision due</span>
                <span className="font-[var(--display)] font-extrabold text-[18px] leading-tight tabular-nums">
                  {dueCount} ready
                </span>
              </div>
              <Icon name="go" size={16} className="shrink-0 opacity-80" />
            </button>
          )}
        </div>
      </section>

      <div className="relative overflow-x-clip">
        <AnimatePresence initial={false} mode="popLayout" custom={subjGlideCustom}>
          <motion.div
            key={subj}
            custom={subjGlideCustom}
            variants={HOME_SUBJECT_VARIANTS}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col gap-4 will-change-transform"
          >
            <LayoutGroup id={`home-subj-${subj}`}>
              {/* Student's Next Step (Today's quest) + Subjects */}
              <div className="grid grid-cols-1 min-[820px]:grid-cols-12 gap-4 items-stretch">
                <section
                  aria-label="Your next step"
                  className="min-[820px]:col-span-7 rtc-card rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-4"
                >
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="tile-peach inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11.5px] font-bold">
                        <Icon name="spark" size={13} />
                        <span>Today&apos;s quest</span>
                      </span>
                      <span className="text-[12px] font-bold text-[var(--dim)]">
                        {SUBJECT_INFO[subj].name}
                      </span>
                    </div>

                    {mission ? (
                      <>
                        <h2 className="h22 text-[var(--ink)]">{mission.t.name}</h2>
                        <p className="text-[15px] text-[var(--dim)] leading-relaxed">
                          {mission.stage === 'lesson'
                            ? `Learn the main idea of ${mission.t.name.toLowerCase()} with clear examples before trying questions.`
                            : mission.stage === 'practice'
                              ? drillCfg.isToughJamb
                                ? `Answer 6 tough JAMB-level questions with close look-alike options (A–D).`
                                : `Nice work on the lesson. Now answer 6 practice questions to build steady speed.`
                              : `Last step for this topic: pass ${drillCfg.bossHp} out of 7 questions in ${
                                  drillCfg.isToughJamb ? '3:30' : '5:00'
                                }.`}
                        </p>

                        {/* 3-Step Track: Learn -> Practise -> Topic test (12px meters) */}
                        <div className="grid grid-cols-3 gap-2.5 pt-1" aria-label="Topic steps">
                          {(
                            [
                              { id: 'lesson', label: '1. Learn', done: mission.stage !== 'lesson' },
                              { id: 'practice', label: '2. Practise', done: mission.stage === 'boss' },
                              { id: 'boss', label: '3. Topic test', done: false },
                            ] as const
                          ).map((step) => {
                            const isCurrent = mission.stage === step.id;
                            return (
                              <div key={step.id} className="flex flex-col gap-1.5">
                                <div
                                  className={`h-3 rounded-full transition-colors duration-200 ${
                                    step.done
                                      ? 'bg-[var(--green)]'
                                      : isCurrent
                                        ? 'bg-[var(--gold)]'
                                        : 'bg-[var(--bg-out)]'
                                  }`}
                                />
                                <span
                                  className={`text-[12px] font-bold whitespace-nowrap ${
                                    step.done
                                      ? 'text-[var(--green)]'
                                      : isCurrent
                                        ? 'text-[var(--gold)]'
                                        : 'text-[var(--dim)]'
                                  }`}
                                >
                                  {step.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        <ChemMadScientistBar
                          mode={coachMode as never}
                          variant="compact"
                          muted={progress.muted}
                          stepKey={`home|${subj}|${mission.t.id}|${mission.stage}`}
                          context={{
                            topicName: mission.t.name,
                            sectionName: mission.t.sec,
                            stepLabel: `Next step in ${SUBJECT_INFO[subj].name}`,
                            stepText: extractMissionSpeechScript(
                              mission.t.name,
                              mission.stage,
                              mission.gain,
                              mission.t.trap,
                              subj
                            ),
                            examTrap: mission.t.trap,
                            goals: mission.t.goals,
                          }}
                        />
                      </>
                    ) : hasLockedRemaining ? (
                      <>
                        <h2 className="h22 text-[var(--ink)]">
                          Unlock all {topics.length} topics in {SUBJECT_INFO[subj].name}
                        </h2>
                        <p className="text-[15px] text-[var(--dim)] leading-relaxed">
                          Your 3-day starter trial has ended. Activate any EYAK pass from ₦1,000/month to unlock all 49 subjects, tutors, mock exams, virtual labs and colour themes.
                        </p>
                      </>
                    ) : (
                      <>
                        <h2 className="h22 text-[var(--ink)]">You finished every topic here</h2>
                        <p className="text-[15px] text-[var(--dim)]">
                          All {passedCount} topics in {SUBJECT_INFO[subj].name} are passed. Keep them fresh with quick revision.
                        </p>
                      </>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {mission ? (
                      <>
                        <button
                          type="button"
                          onClick={() => onStartMission(mission.t.id, mission.stage)}
                          className="btn-tactile indigo flex-1 min-w-[190px] whitespace-nowrap"
                        >
                          <span>{missionLabel}</span>
                          <Icon name="go" size={18} className="ul-arrow" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenTopic(mission.t.id)}
                          className="btn-tactile paper whitespace-nowrap"
                        >
                          <span>Topic page</span>
                        </button>
                      </>
                    ) : hasLockedRemaining && onOpenPaywall ? (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            onOpenPaywall(
                              `Unlock all ${topics.length} topics in ${SUBJECT_INFO[subj].name} and across all 49 subjects`
                            )
                          }
                          className="btn-tactile indigo flex-1 min-w-[190px] whitespace-nowrap"
                        >
                          <Icon name="unlock" size={17} />
                          <span>Unlock EYAK Premium</span>
                        </button>
                        <button
                          type="button"
                          onClick={onOpenReview}
                          className="btn-tactile paper whitespace-nowrap"
                        >
                          <span>Revise passed topics</span>
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={onOpenReview}
                        className="btn-tactile indigo w-full whitespace-nowrap"
                      >
                        <span>Start revision</span>
                        <Icon name="go" size={18} className="ul-arrow" />
                      </button>
                    )}
                  </div>
                </section>

                {/* Subjects Card */}
                <section
                  aria-label="Your subjects"
                  className="min-[820px]:col-span-5 rtc-card rounded-2xl p-4 flex flex-col justify-between gap-3"
                >
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h2 className="h18 text-[var(--ink)]">
                          {examTrack === 'jamb' ? 'Your 4 JAMB subjects' : 'Subjects'}
                        </h2>
                        <p className="text-[12px] text-[var(--dim)]">
                          {examTrack === 'jamb'
                            ? 'Strictly your 4 UTME subjects — tap to switch'
                            : examTrack === 'both'
                              ? '70% JAMB core + 30% WAEC subjects'
                              : 'Tap a subject to switch right away'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={onManageSubjects}
                        className="min-h-[32px] px-2.5 rounded-xl bg-[var(--acc-soft)] border border-[var(--acc-line)] text-[12px] font-bold text-[var(--gold)] hover:bg-[var(--card)] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                      >
                        {examTrack === 'jamb' ? 'Edit 4 JAMB' : 'Choose subjects'}
                      </button>
                    </div>

                    <LiquidCapsuleBar
                      roleType="group"
                      ariaLabel="Switch subject"
                      layoutMode="grid"
                      gridClassName="grid-cols-2 gap-1.5"
                      size="md"
                      items={visibleSubjs.map((sid) => {
                        const subjTopics = getTopics(sid);
                        const subjPct = computeTopicsProgressPct(progress, subjTopics);
                        return {
                          id: sid,
                          label: SUBJECT_INFO[sid].compact,
                          icon: SUBJECT_INFO[sid].icon,
                          sublabel: subjPct > 0 ? `${subjPct}%` : undefined,
                        };
                      })}
                      value={subj}
                      onChange={onSelectSubject}
                    />
                  </div>

                  <div className="pt-3 border-t border-[var(--line)] flex items-center justify-between gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={onOpenTopicsMap}
                      className="text-[13px] font-bold text-[var(--gold)] hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>All {SUBJECT_INFO[subj].short} topics</span>
                      <Icon name="go" size={14} />
                    </button>

                    {!hasDiagnosed && (
                      <button
                        type="button"
                        onClick={onStartDiagnostic}
                        className="text-[12.5px] font-bold text-[var(--dim)] hover:text-[var(--ink)] inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Placement check</span>
                        <Icon name="go" size={13} />
                      </button>
                    )}
                  </div>
                </section>
              </div>

              {/* Dedicated Subject Companion Workspace (distinct from syllabus topics & general tools) */}
              {((SUBJECT_STUDIO_META[subj] && onOpenStudio) || hasLabs) && (() => {
                const studioMeta = SUBJECT_STUDIO_META[subj];
                const isStudio = Boolean(studioMeta && onOpenStudio);
                const companionIcon = isStudio
                  ? studioMeta!.icon
                  : subj === 'chem'
                    ? 'flask'
                    : subj === 'agric'
                      ? 'leaf'
                      : subj === 'bio'
                        ? 'dna'
                        : subj === 'phys'
                          ? 'atom'
                          : 'pen';
                const companionTitle = isStudio
                  ? studioMeta!.title
                  : `${SUBJECT_INFO[subj].short} labs`;
                const companionBadge = isStudio ? studioMeta!.badge : 'Practical lab';
                const companionDesc = isStudio
                  ? studioMeta!.subtitle
                  : subj === 'chem'
                    ? 'Titration, reaction speed and gas collection experiments'
                    : subj === 'agric'
                      ? 'Soil pH, fertiliser rate and livestock feed mixing'
                      : subj === 'bio'
                        ? 'Osmosis in potato strips, enzymes and microscopy'
                        : subj === 'phys'
                          ? 'Pendulum timer, lenses, circuits and springs'
                          : 'Compass, ruler and protractor constructions';
                const companionCta =
                  isStudio && subj === 'crs'
                    ? 'Open Study Bible'
                    : isStudio && subj === 'irs'
                      ? 'Open Qur’an reader'
                      : isStudio
                        ? 'Open practical tool'
                        : 'Open labs';
                return (
                  <section
                    aria-label={`${SUBJECT_INFO[subj].name} practical companion`}
                    className="rtc-card rounded-2xl p-4 sm:p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 border-[var(--acc-line)]"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="w-10 h-10 rounded-xl tile-mint flex items-center justify-center shrink-0">
                        <Icon name={companionIcon} size={19} />
                      </span>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <div className="text-[11.5px] font-bold text-[var(--gold)]">
                          {SUBJECT_INFO[subj].name} companion · {companionBadge}
                        </div>
                        <h2 className="h18 text-[var(--ink)]">{companionTitle}</h2>
                        <p className="text-[13.5px] text-[var(--dim)] leading-snug max-w-[56ch]">
                          {companionDesc}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={isStudio ? onOpenStudio : onOpenLab}
                      className="btn-tactile paper shrink-0 whitespace-nowrap"
                    >
                      <span>{companionCta}</span>
                      <Icon name="go" size={16} className="ul-arrow" />
                    </button>
                  </section>
                );
              })()}

              {/* Saturday National CBT Arena & Same-Day Student Ranking Card */}
              {onOpenCbt && (
                <section
                  aria-label="Saturday National CBT Arena"
                  className={`rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    satCampaign.isSaturday ? 'rtc-eq-plate text-white' : 'rtc-card border-[var(--acc-line)]'
                  }`}
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <span
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                        satCampaign.isSaturday
                          ? 'tile-peach'
                          : 'bg-[var(--acc-soft)] text-[var(--gold)] border border-[var(--acc-line)]'
                      }`}
                    >
                      <Icon name={satCampaign.isSaturday ? 'trophy' : 'clock'} size={20} />
                    </span>
                    <div className="flex flex-col gap-1 min-w-0">
                      <div
                        className={`flex items-center gap-2 flex-wrap text-[12px] font-bold tabular-nums ${
                          satCampaign.isSaturday ? 'text-[#FFE1D1]' : 'text-[var(--gold)]'
                        }`}
                      >
                        <span>
                          {satCampaign.isSaturday
                            ? 'Saturday National CBT Arena · 2× XP'
                            : 'Weekly Saturday CBT Habit'}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>
                          {dailyCbtCount && dailyCbtCount > 0
                            ? `${dailyCbtCount} student${dailyCbtCount === 1 ? '' : 's'} ranked today`
                            : 'Live same-day student ranking'}
                        </span>
                        {satCampaign.saturdayStreak > 0 && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{satCampaign.saturdayStreak} Sat streak</span>
                          </>
                        )}
                      </div>
                      <h2
                        className={`h18 ${satCampaign.isSaturday ? 'text-white' : 'text-[var(--ink)]'}`}
                      >
                        {satCampaign.headline}
                      </h2>
                      <p
                        className={`text-[13.5px] leading-snug max-w-[58ch] ${
                          satCampaign.isSaturday ? 'text-white/90' : 'text-[var(--dim)]'
                        }`}
                      >
                        {satCampaign.subheadline}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenCbt}
                    className={`btn-tactile shrink-0 whitespace-nowrap ${
                      satCampaign.isSaturday ? 'paper text-[var(--ink)]' : 'indigo'
                    }`}
                  >
                    <span>{satCampaign.ctaLabel}</span>
                    <Icon name="go" size={16} className="ul-arrow" />
                  </button>
                </section>
              )}

              {/* Continue Learning + This Week */}
              <div className="grid grid-cols-1 min-[820px]:grid-cols-12 gap-4 items-start">
                <section className="min-[820px]:col-span-7 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h2 className="h18 text-[var(--ink)]">Continue learning</h2>
                      <p className="text-[12.5px] text-[var(--dim)]">
                        Pick up where you left off in {SUBJECT_INFO[subj].name}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={onOpenTopicsMap}
                      className="text-[12.5px] font-bold text-[var(--gold)] hover:underline inline-flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <span>See all topics</span>
                      <Icon name="go" size={14} />
                    </button>
                  </div>

                  <div className="flex flex-col gap-2">
                    {focus.map((topic) => {
                      const locked = isTopicLocked(progress, topic.id, allSubjectTopics);
                      const score = mpct(progress, topic.id);
                      const status = tstatus(progress, topic.id);
                      return (
                        <button
                          key={topic.id}
                          type="button"
                          onClick={() => onOpenTopic(topic.id)}
                          className="study-card rtc-card text-left rounded-xl px-3.5 py-2.5 sm:px-4 sm:py-3 flex items-center gap-3 cursor-pointer"
                        >
                          <MiniRing value={score} size={38} />
                          <div className="min-w-0 flex-1">
                            <div className="text-[11px] font-semibold text-[var(--dim)] truncate">
                              {topic.sec}
                            </div>
                            <div className="font-[var(--display)] font-bold text-[14.5px] text-[var(--ink)] truncate">
                              {topic.name}
                            </div>
                            <div
                              className={`text-[11.5px] font-bold mt-0.5 ${
                                locked ? 'text-[var(--dim)]' : 'text-[var(--gold)]'
                              }`}
                            >
                              {locked ? 'Premium · Tap to unlock' : status}
                            </div>
                          </div>
                          <Icon
                            name={locked ? 'lock' : 'go'}
                            size={15}
                            className="text-[var(--dim)] shrink-0 ul-arrow"
                          />
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section className="min-[820px]:col-span-5 rtc-card rounded-2xl p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="h18 text-[var(--ink)]">This week</h2>
                    <span className="text-[12px] font-semibold text-[var(--dim)]">
                      Questions answered
                    </span>
                  </div>
                  <ActivityBars act={progress.act} />
                </section>
              </div>

              {/* Other Tools in Plain Words */}
              <section aria-label="More study tools" className="flex flex-col gap-2.5">
                <h2 className="h18 text-[var(--ink)]">Study tools</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 min-[920px]:grid-cols-3 gap-2.5">
                  {onOpenMistakes && (
                    <button
                      type="button"
                      onClick={onOpenMistakes}
                      className="study-card rtc-card rounded-xl px-3.5 py-2.5 sm:py-3 text-left flex items-center justify-between gap-2.5 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-9 h-9 rounded-xl bg-[var(--bad-soft)] text-[var(--coral-ink)] flex items-center justify-center shrink-0">
                          <Icon name="target" size={16} />
                        </span>
                        <div className="min-w-0">
                          <div className="font-[var(--display)] font-bold text-[14px] text-[var(--ink)]">
                            Mistakes to fix
                          </div>
                          <div className="text-[11.5px] text-[var(--dim)] truncate">
                            {openMistakesCount > 0
                              ? `${openMistakesCount} to practise again`
                              : 'No missed questions right now'}
                          </div>
                        </div>
                      </div>
                      <Icon name="go" size={14} className="text-[var(--dim)] shrink-0 ul-arrow" />
                    </button>
                  )}

                  {onOpenPlanner && (
                    <button
                      type="button"
                      onClick={onOpenPlanner}
                      className="study-card rtc-card rounded-xl px-3.5 py-2.5 sm:py-3 text-left flex items-center justify-between gap-2.5 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-9 h-9 rounded-xl bg-[var(--acc-soft)] text-[var(--gold)] flex items-center justify-center shrink-0">
                          <Icon name="calendar" size={16} />
                        </span>
                        <div className="min-w-0">
                          <div className="font-[var(--display)] font-bold text-[14px] text-[var(--ink)]">
                            Study plan
                          </div>
                          <div className="text-[11.5px] text-[var(--dim)] truncate">
                            {hasSetExamDate && daysToExam !== null
                              ? `${daysToExam} days left · Daily timetable`
                              : 'Set your exam date and daily goal'}
                          </div>
                        </div>
                      </div>
                      <Icon name="go" size={14} className="text-[var(--dim)] shrink-0 ul-arrow" />
                    </button>
                  )}

                  {onOpenFormulas && (
                    <button
                      type="button"
                      onClick={onOpenFormulas}
                      className="study-card rtc-card rounded-xl px-3.5 py-2.5 sm:py-3 text-left flex items-center justify-between gap-2.5 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-9 h-9 rounded-xl tile-sky flex items-center justify-center shrink-0">
                          <Icon name={subj === 'eng' ? 'book' : 'sigma'} size={16} />
                        </span>
                        <div className="min-w-0">
                          <div className="font-[var(--display)] font-bold text-[14px] text-[var(--ink)]">
                            {subj === 'eng' ? 'Grammar rules' : 'Formulas'}
                          </div>
                          <div className="text-[11.5px] text-[var(--dim)] truncate">
                            {subj === 'eng'
                              ? 'Key concord, stress and sentence rules'
                              : 'Key equations and quick workouts'}
                          </div>
                        </div>
                      </div>
                      <Icon name="go" size={14} className="text-[var(--dim)] shrink-0 ul-arrow" />
                    </button>
                  )}

                  {onOpenSandboxes && (
                    <button
                      type="button"
                      onClick={onOpenSandboxes}
                      className="study-card rtc-card rounded-xl px-3.5 py-2.5 sm:py-3 text-left flex items-center justify-between gap-2.5 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-9 h-9 rounded-xl bg-[var(--acc-soft)] text-[var(--gold)] flex items-center justify-center shrink-0">
                          <Icon name="cpu" size={16} />
                        </span>
                        <div className="min-w-0">
                          <div className="font-[var(--display)] font-bold text-[14px] text-[var(--ink)]">
                            Try-it tools
                          </div>
                          <div className="text-[11.5px] text-[var(--dim)] truncate">
                            Graphs, tables, logic gates and maps
                          </div>
                        </div>
                      </div>
                      <Icon name="go" size={14} className="text-[var(--dim)] shrink-0 ul-arrow" />
                    </button>
                  )}

                  {onOpenTheory && (
                    <button
                      type="button"
                      onClick={onOpenTheory}
                      className="study-card rtc-card rounded-xl px-3.5 py-2.5 sm:py-3 text-left flex items-center justify-between gap-2.5 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-9 h-9 rounded-xl tile-mint flex items-center justify-center shrink-0">
                          <Icon name="pen" size={16} />
                        </span>
                        <div className="min-w-0">
                          <div className="font-[var(--display)] font-bold text-[14px] text-[var(--ink)]">
                            Theory answers
                          </div>
                          <div className="text-[11.5px] text-[var(--dim)] truncate">
                            Practise written answers with marking guides
                          </div>
                        </div>
                      </div>
                      <Icon name="go" size={14} className="text-[var(--dim)] shrink-0 ul-arrow" />
                    </button>
                  )}

                  {onOpenDuel && (
                    <button
                      type="button"
                      onClick={onOpenDuel}
                      className="study-card rtc-card rounded-xl px-3.5 py-2.5 sm:py-3 text-left flex items-center justify-between gap-2.5 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-9 h-9 rounded-xl tile-peach flex items-center justify-center shrink-0">
                          <Icon name="trophy" size={16} />
                        </span>
                        <div className="min-w-0">
                          <div className="font-[var(--display)] font-bold text-[14px] text-[var(--ink)]">
                            Duels
                          </div>
                          <div className="text-[11.5px] text-[var(--dim)] truncate">
                            10-question race with a classmate
                          </div>
                        </div>
                      </div>
                      <Icon name="go" size={14} className="text-[var(--dim)] shrink-0 ul-arrow" />
                    </button>
                  )}

                  {onOpenLeaderboard && (
                    <button
                      type="button"
                      onClick={onOpenLeaderboard}
                      className="study-card rtc-card rounded-xl px-3.5 py-2.5 sm:py-3 text-left flex items-center justify-between gap-2.5 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-9 h-9 rounded-xl bg-[var(--acc-soft)] text-[var(--gold)] flex items-center justify-center shrink-0">
                          <Icon name="crown" size={16} />
                        </span>
                        <div className="min-w-0">
                          <div className="font-[var(--display)] font-bold text-[14px] text-[var(--ink)]">
                            Leaderboard
                          </div>
                          <div className="text-[11.5px] text-[var(--dim)] truncate">
                            See how students across Nigeria are doing
                          </div>
                        </div>
                      </div>
                      <Icon name="go" size={14} className="text-[var(--dim)] shrink-0 ul-arrow" />
                    </button>
                  )}

                  {onOpenTranscript && (
                    <button
                      type="button"
                      onClick={onOpenTranscript}
                      className="study-card rtc-card rounded-xl px-3.5 py-2.5 sm:py-3 text-left flex items-center justify-between gap-2.5 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-9 h-9 rounded-xl tile-sky flex items-center justify-center shrink-0">
                          <Icon name="award" size={16} />
                        </span>
                        <div className="min-w-0">
                          <div className="font-[var(--display)] font-bold text-[14px] text-[var(--ink)]">
                            Report card
                          </div>
                          <div className="text-[11.5px] text-[var(--dim)] truncate">
                            Shareable summary for parents and teachers
                          </div>
                        </div>
                      </div>
                      <Icon name="go" size={14} className="text-[var(--dim)] shrink-0 ul-arrow" />
                    </button>
                  )}

                  {isOwner && onOpenQuestionBank && (
                    <button
                      type="button"
                      onClick={() => onOpenQuestionBank(subj, 'overview')}
                      className="study-card rtc-card rounded-xl px-3.5 py-2.5 sm:py-3 text-left flex items-center justify-between gap-2.5 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-9 h-9 rounded-xl bg-[var(--acc-soft)] text-[var(--gold)] flex items-center justify-center shrink-0">
                          <Icon name="database" size={16} />
                        </span>
                        <div className="min-w-0">
                          <div className="font-[var(--display)] font-bold text-[14px] text-[var(--ink)]">
                            Question bank (owner)
                          </div>
                          <div className="text-[11.5px] text-[var(--dim)] truncate">
                            Manage and export question sets
                          </div>
                        </div>
                      </div>
                      <Icon name="go" size={14} className="text-[var(--dim)] shrink-0 ul-arrow" />
                    </button>
                  )}
                </div>
              </section>
            </LayoutGroup>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
