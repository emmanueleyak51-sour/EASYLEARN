import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion, type Variants } from 'motion/react';
import type { ChemClassId, SubjectId, UserProgress } from '../../types';
import { getTopics, getTopicsForProgress } from '../../data/curriculum';
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
import { PUBLIC_FREE_LAUNCH_ACTIVE } from '../../utils/freeLaunchAndPwaLogic';
import { getDailyQuietLine } from '../../utils/motivationLogic';
import { buildCalmMomentumCopy, triggerLightHaptic } from '../../utils/readingComfortLogic';
import { AnimatedNumber } from '../AnimatedNumber';
import { ChemMadScientistBar } from '../ChemMadScientistBar';
import { subjectToLiveCoachMode } from '../../context/LiveCoachContext';
import { Icon, MiniRing } from '../Icons';
import { StudyBuddy } from '../StudyBuddy';
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
  pickWeightedBothTrackSlot,
  resolveExamTrack,
} from '../../utils/examTrackLogic';
import type { QuestionBankTab } from '../QuestionBankManagerModal';
import { getPlayableWorldForSubject } from '../../data/learningUniverseWorlds';
import { computeUniverseLevelSummary, loadUniverseProfile } from '../../utils/learningUniverseLogic';
import {
  evaluateHomeQuickWarmup,
  pickHomeQuickWarmup,
} from '../../utils/homeQuickCheckLogic';
import { typesetMathHtml } from '../../utils/mathTypesetter';

const QUICK_LETTERS = ['A', 'B', 'C', 'D'] as const;

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

  const totalCount = items.reduce((sum, it) => sum + it.count, 0);

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-7 gap-2 items-end pt-2" role="img" aria-label="Activity this week">
        {items.map((it) => {
          const barH = Math.max(8, Math.round((it.count / maxVal) * 56));
          const yPos = 60 - barH;
          return (
            <div key={it.dayNum} className="flex flex-col items-center gap-1.5">
              <span className="text-[11.5px] font-bold tabular-nums text-[var(--dim)] min-h-[16px]">
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
      {totalCount === 0 && (
        <p className="text-[12px] text-[var(--dim)] pt-1 border-t border-[var(--line)]">
          Answer 6 questions today to start your week.
        </p>
      )}
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
  onOpenNovels,
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
  onOpenUniverse,
  onQuickWarmupSolved,
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
  onOpenNovels?: (novelId?: string) => void;
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
  onOpenUniverse?: () => void;
  onQuickWarmupSolved?: (cardKey: string, isCorrect: boolean) => void;
}) {
  const subj = progress.subj;
  const hasLabs =
    subj === 'maths' || subj === 'phys' || subj === 'chem' || subj === 'bio' || subj === 'agric';
  const allSubjectTopics = getTopics(subj);
  const topics = getTopicsForProgress(progress);
  const passedCount = topics.filter((t) => tstate(progress, t.id).boss).length;
  const mission = nextMission(progress, topics, allSubjectTopics);
  const focus = homeTopics(progress, topics, allSubjectTopics).slice(0, 3);
  const hasLockedRemaining =
    !PUBLIC_FREE_LAUNCH_ACTIVE &&
    topics.some(
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

  const momentum = useMemo(
    () =>
      buildCalmMomentumCopy({
        streakDays: progress.streak.n,
        subjectShort: SUBJECT_INFO[subj].short,
        passedTopics: passedCount,
        totalTopics: topics.length,
        dueCount,
      }),
    [dueCount, passedCount, progress.streak.n, subj, topics.length]
  );

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

  const [showAllTools, setShowAllTools] = useState(false);
  const coachMode = subjectToLiveCoachMode(subj);
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
      ? 'JAMB · 4 subjects'
      : examTrack === 'waec'
        ? 'WAEC track'
        : 'JAMB 70% + WAEC 30%';

  const subjMasteryPct = computeTopicsProgressPct(progress, topics);
  const currentWorld = useMemo(() => getPlayableWorldForSubject(subj, progress), [subj, progress]);
  const explorerLevel = useMemo(
    () => computeUniverseLevelSummary(progress.xp || 0, loadUniverseProfile()),
    [progress.xp]
  );

  const [quickOffset, setQuickOffset] = useState(0);
  const [pickedQuickIdx, setPickedQuickIdx] = useState<number | null>(null);
  const [worldThumbFailed, setWorldThumbFailed] = useState<Record<string, boolean>>({});
  const rewardedQuickKeysRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    setQuickOffset(0);
    setPickedQuickIdx(null);
  }, [subj]);

  const quickCard = useMemo(
    () => pickHomeQuickWarmup(topics, mission?.t.id, quickOffset),
    [topics, mission?.t.id, quickOffset]
  );
  const quickVerdict = useMemo(
    () =>
      quickCard && pickedQuickIdx !== null
        ? evaluateHomeQuickWarmup(quickCard, pickedQuickIdx)
        : null,
    [quickCard, pickedQuickIdx]
  );

  const studioMeta = SUBJECT_STUDIO_META[subj];
  const hasCompanion = Boolean((studioMeta && onOpenStudio) || hasLabs);
  const isStudioCompanion = Boolean(studioMeta && onOpenStudio);
  const companionIcon = isStudioCompanion
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
  const companionTitle = isStudioCompanion
    ? studioMeta!.title
    : `${SUBJECT_INFO[subj].short} Virtual Labs`;
  const companionSubtitle = isStudioCompanion
    ? studioMeta!.badge
    : 'Interactive practicals';

  return (
    <div className="flex flex-col gap-6 sm:gap-7">
      {/* Zone 1: Clean Unboxed Scholar Header + Inline Subject Bar */}
      <header aria-label="Daily greeting and subject switcher" className="flex flex-col gap-4">
        <div className="flex flex-col min-[780px]:flex-row min-[780px]:items-end justify-between gap-4 pb-4 border-b border-[var(--line)]">
          <div className="flex items-start sm:items-center gap-3.5 min-w-0">
            <StudyBuddy
              mood={progress.streak.n >= 3 ? 'cheer' : 'happy'}
              size={48}
              className="mt-0.5 sm:mt-0 shrink-0"
            />
            <div className="flex flex-col gap-0.5 min-w-0">
              <div className="flex items-center gap-2 text-[12px] font-semibold text-[var(--dim)] flex-wrap tabular-nums">
                <span className="font-bold text-[var(--gold)]">{momentum.headlineTag}</span>
                <span aria-hidden="true">·</span>
                <span>{examBadgeLabel}</span>
                <span aria-hidden="true">·</span>
                <span>
                  {examTrack === 'waec'
                    ? `Target ${progress.target || 75}%`
                    : `Target ${targetJamb400}/400`}
                </span>
                {bothWeightedSlot && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>Focus: {SUBJECT_INFO[bothWeightedSlot.subj].short}</span>
                  </>
                )}
              </div>
              <h1 className="h24 text-[var(--ink)] text-balance">
                {greet()}, {progress.name || 'Scholar'}
              </h1>
              <p className="text-[13.5px] text-[var(--dim)] leading-snug max-w-[60ch]">
                {momentum.encouragement || getDailyQuietLine(today())}
              </p>
            </div>
          </div>

          {/* Right: Clean Interactive Readiness & Schedule Controls */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div
              className="min-h-[40px] px-3 rounded-lg bg-[var(--card)] border border-[var(--line)] inline-flex items-center gap-1.5"
              title="Daily study streak"
            >
              <Icon
                name="flame"
                size={15}
                className={progress.streak.n > 0 ? 'text-[#EA580C]' : 'text-[var(--dim)]'}
              />
              <span className="font-[var(--display)] font-bold text-[13.5px] text-[var(--ink)] tabular-nums whitespace-nowrap">
                <AnimatedNumber value={progress.streak.n} />d streak
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                triggerLightHaptic(8);
                onOpenExamSetup?.();
              }}
              aria-label={
                examTrack === 'waec'
                  ? `WAEC readiness ${waecReadinessPct} percent, grade ${waecGradeLabel}. Configure exam track`
                  : `Estimated JAMB score ${estimatedJamb400} out of 400. Configure exam track`
              }
              title="Configure exam track and target score"
              className="min-h-[40px] px-3.5 rounded-lg bg-[var(--card)] hover:border-[var(--acc-line)] border border-[var(--line)] inline-flex items-center gap-2 cursor-pointer transition active:scale-[0.99]"
            >
              <Icon name="trophy" size={15} className="text-[var(--gold)] shrink-0" />
              {examTrack === 'waec' ? (
                <span className="font-[var(--display)] font-bold text-[13.5px] text-[var(--ink)] tabular-nums whitespace-nowrap">
                  <AnimatedNumber value={waecReadinessPct} suffix="%" /> · {waecGradeLabel}
                </span>
              ) : (
                <span className="font-[var(--display)] font-bold text-[13.5px] text-[var(--ink)] tabular-nums whitespace-nowrap">
                  <AnimatedNumber value={estimatedJamb400} />
                  <span className="text-[var(--dim)] font-semibold"> / 400</span>
                </span>
              )}
            </button>

            {onOpenPlanner && (
              <button
                type="button"
                onClick={() => {
                  triggerLightHaptic(8);
                  onOpenPlanner();
                }}
                aria-label={
                  hasSetExamDate && daysToExam !== null
                    ? `${daysToExam} days to exam. Open study plan`
                    : 'Set exam date and daily study plan'
                }
                title={
                  hasSetExamDate && daysToExam !== null
                    ? `${daysToExam} days to exam`
                    : 'Study plan & exam date'
                }
                className="min-h-[40px] px-3 rounded-lg bg-[var(--card)] hover:border-[var(--acc-line)] border border-[var(--line)] text-[var(--ink)] inline-flex items-center justify-center gap-1.5 cursor-pointer transition active:scale-[0.99]"
              >
                <Icon name="calendar" size={15} className="text-[var(--gold)] shrink-0" />
                <span className="text-[12.5px] font-bold tabular-nums whitespace-nowrap">
                  {hasSetExamDate && daysToExam !== null ? `${daysToExam}d` : 'Plan'}
                </span>
              </button>
            )}

            {dueCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  triggerLightHaptic(8);
                  onOpenReview();
                }}
                aria-label={`${dueCount} revision questions due`}
                title={`${dueCount} revision questions ready`}
                className="min-h-[40px] px-3 rounded-lg tile-sky inline-flex items-center gap-1.5 cursor-pointer transition active:scale-[0.99]"
              >
                <Icon name="rev" size={15} className="shrink-0" />
                <span className="text-[12.5px] font-bold tabular-nums whitespace-nowrap">
                  {dueCount} due
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Inline Subject Switcher Bar (Zero outer wrapper card) */}
        <div className="flex flex-col min-[880px]:flex-row min-[880px]:items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <LiquidCapsuleBar
              roleType="group"
              ariaLabel="Switch subject"
              layoutMode="grid"
              gridClassName={
                visibleSubjs.length <= 4
                  ? 'grid-cols-2 sm:grid-cols-4 gap-1.5'
                  : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1.5'
              }
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

          <div className="flex items-center justify-between min-[880px]:justify-end gap-3 shrink-0 text-[12.5px] font-bold">
            {!hasDiagnosed && (
              <button
                type="button"
                onClick={onStartDiagnostic}
                className="text-[var(--dim)] hover:text-[var(--ink)] inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
              >
                <span>Placement check</span>
                <Icon name="go" size={13} />
              </button>
            )}
            <button
              type="button"
              onClick={onManageSubjects}
              className="min-h-[36px] px-3 rounded-lg bg-[var(--card)] border border-[var(--line)] hover:border-[var(--acc-line)] text-[var(--ink)] inline-flex items-center gap-1.5 cursor-pointer transition whitespace-nowrap"
            >
              <Icon name="grid" size={13} className="text-[var(--gold)]" />
              <span>{examTrack === 'jamb' ? 'Edit 4 Subjects' : 'Choose Subjects'}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="relative overflow-x-clip">
        <AnimatePresence initial={false} mode="popLayout" custom={subjGlideCustom}>
          <motion.div
            key={subj}
            custom={subjGlideCustom}
            variants={HOME_SUBJECT_VARIANTS}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col gap-6 will-change-transform"
          >
            <LayoutGroup id={`home-subj-${subj}`}>
              {/* Zone 2: Dominant Split-Screen Hero Workbench (Single Focal Anchor) */}
              <div className="grid grid-cols-1 min-[880px]:grid-cols-12 gap-5 items-stretch">
                {/* Left (7 cols): Today's Priority Mission — Houses the ONLY Primary Solid CTA */}
                <section
                  aria-label="Today's priority mission"
                  className="min-[880px]:col-span-7 rtc-card rounded-2xl p-5 sm:p-6 flex flex-col justify-between gap-5"
                >
                  <div className="flex flex-col gap-3.5">
                    <div className="flex items-center justify-between gap-2 flex-wrap text-[12px] font-semibold text-[var(--dim)] tabular-nums">
                      <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                        <span className="font-bold text-[var(--gold)] whitespace-nowrap">
                          Priority Mission
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="whitespace-nowrap">{SUBJECT_INFO[subj].name}</span>
                        {mission && (
                          <span className="hidden sm:inline truncate">· {mission.t.sec}</span>
                        )}
                      </div>
                      <span className="whitespace-nowrap">
                        {passedCount}/{topics.length} mastered · {subjMasteryPct}%
                      </span>
                    </div>

                    {mission ? (
                      <>
                        <div className="flex flex-col gap-1.5">
                          <h2 className="h24 text-[var(--ink)] text-balance">{mission.t.name}</h2>
                          <p className="text-[14.5px] text-[var(--dim)] leading-relaxed max-w-[58ch]">
                            {mission.stage === 'lesson'
                              ? `Study core principles, examiner shortcuts, and worked examples in ${mission.t.name.toLowerCase()}.`
                              : mission.stage === 'practice'
                                ? drillCfg.isToughJamb
                                  ? 'Solve 6 timed UTME questions built with twin-option traps.'
                                  : 'Complete 6 targeted practice questions to build accuracy and speed.'
                                : `Score at least ${drillCfg.bossHp}/7 in ${
                                    drillCfg.isToughJamb ? '3:30' : '5:00'
                                  } to pass this syllabus topic.`}
                          </p>
                        </div>

                        {/* Clean 3-Step Progression Rail */}
                        <div className="grid grid-cols-3 gap-2.5 pt-1" aria-label="Topic steps">
                          {(
                            [
                              { id: 'lesson', label: '01. Learn', done: mission.stage !== 'lesson' },
                              { id: 'practice', label: '02. Practise', done: mission.stage === 'boss' },
                              { id: 'boss', label: '03. Topic Test', done: false },
                            ] as const
                          ).map((step) => {
                            const isCurrent = mission.stage === step.id;
                            return (
                              <div key={step.id} className="flex flex-col gap-1.5">
                                <div
                                  className={`h-2 rounded-full transition-colors duration-200 ${
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

                        {(mission.t.trap || (mission.t.goals && mission.t.goals[0])) && (
                          <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] px-3.5 py-3 flex flex-col gap-1">
                            <span className="text-[11.5px] font-bold text-[var(--gold)]">
                              {mission.t.trap ? 'Examiner Trap Watch' : 'Key Syllabus Goal'}
                            </span>
                            <div
                              className="text-[13px] text-[var(--ink)] leading-snug line-clamp-2"
                              dangerouslySetInnerHTML={{
                                __html: typesetMathHtml(
                                  mission.t.trap || mission.t.goals![0],
                                  subj
                                ),
                              }}
                            />
                          </div>
                        )}

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
                      <div className="flex flex-col gap-1.5">
                        <h2 className="h24 text-[var(--ink)] text-balance">
                          Unlock all {topics.length} topics in {SUBJECT_INFO[subj].name}
                        </h2>
                        <p className="text-[14.5px] text-[var(--dim)] leading-relaxed">
                          Your free trial has ended. Upgrade from ₦1,000/month to unlock all 49 subjects, voice tutors, mocks, and virtual labs.
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1.5">
                        <h2 className="h24 text-[var(--ink)]">All {passedCount} topics passed</h2>
                        <p className="text-[14.5px] text-[var(--dim)] leading-relaxed">
                          Keep {SUBJECT_INFO[subj].name} exam-ready with quick spaced-recall sessions.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Single Primary CTA + Quiet Secondary Actions */}
                  <div className="pt-3 border-t border-[var(--line)] flex flex-wrap items-center gap-2.5">
                    {mission ? (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            triggerLightHaptic(12);
                            onStartMission(mission.t.id, mission.stage);
                          }}
                          className="btn-tactile indigo flex-1 min-w-[185px] whitespace-nowrap"
                        >
                          <span>{missionLabel}</span>
                          <Icon name="go" size={17} className="ul-arrow" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            triggerLightHaptic(8);
                            onOpenTopic(mission.t.id);
                          }}
                          aria-label={`Open ${mission.t.name} topic overview and notes`}
                          className="btn-tactile paper whitespace-nowrap px-3.5"
                        >
                          <Icon name="book" size={15} />
                          <span>Study notes</span>
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
                          <Icon name="unlock" size={16} />
                          <span>Unlock Full Access</span>
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
                        <span>Start spaced revision</span>
                        <Icon name="go" size={17} className="ul-arrow" />
                      </button>
                    )}
                  </div>
                </section>

                {/* Right (5 cols): Subject World Banner + Live 15s Syllabus Quick-Check */}
                <section
                  aria-label="Subject world and live syllabus quick check"
                  className="min-[880px]:col-span-5 rtc-card rounded-2xl overflow-hidden flex flex-col justify-between"
                >
                  {/* Top Illustrated World Strip */}
                  <div
                    className="relative min-h-[108px] px-4 py-3.5 flex flex-col justify-end border-b border-[var(--line)]"
                    style={{ background: currentWorld.fallbackGradient }}
                  >
                    {currentWorld.keyArtUrl && !worldThumbFailed[subj] && (
                      <img
                        src={currentWorld.keyArtUrl}
                        alt={`${SUBJECT_INFO[subj].name} — ${currentWorld.worldTitle}`}
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setWorldThumbFailed((prev) => ({ ...prev, [subj]: true }))
                        }
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090D16]/92 via-[#090D16]/60 to-[#090D16]/30" />

                    <div className="relative z-10 flex items-end justify-between gap-3 text-white">
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold text-amber-300 tabular-nums truncate">
                          Level {explorerLevel.level} Explorer · {currentWorld.missions.length}{' '}
                          Missions
                        </div>
                        <h3 className="font-[var(--display)] font-bold text-[16.5px] leading-snug truncate">
                          {currentWorld.worldTitle}
                        </h3>
                      </div>
                      {onOpenUniverse && (
                        <button
                          type="button"
                          onClick={() => {
                            triggerLightHaptic(8);
                            onOpenUniverse();
                          }}
                          className="min-h-[32px] px-3 rounded-lg bg-white/15 hover:bg-white/25 border border-white/30 text-white font-[var(--display)] font-bold text-[12px] inline-flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0 transition"
                        >
                          <span>Enter World</span>
                          <Icon name="go" size={13} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Live Interactive Quick-Check Body */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3.5">
                    {quickCard ? (
                      <>
                        <div className="flex flex-col gap-2.5">
                          <div className="flex items-center justify-between gap-2 text-[11.5px] font-semibold text-[var(--dim)]">
                            <span className="truncate">
                              <strong className="text-[var(--gold)]">Quick Check</strong> ·{' '}
                              {quickCard.topicName}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                triggerLightHaptic(6);
                                setPickedQuickIdx(null);
                                setQuickOffset((n) => n + 1);
                              }}
                              className="font-bold text-[var(--gold)] hover:underline cursor-pointer whitespace-nowrap shrink-0"
                            >
                              Next question →
                            </button>
                          </div>

                          <div
                            className="font-[var(--body)] font-semibold text-[13.5px] leading-snug text-[var(--ink)]"
                            dangerouslySetInnerHTML={{
                              __html: typesetMathHtml(quickCard.prompt, subj),
                            }}
                          />

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
                            {quickCard.options.map((opt, idx) => {
                              const isPicked = pickedQuickIdx === idx;
                              const isRight = idx === quickCard.correctIndex;
                              let cls =
                                'border-[var(--line)] bg-[var(--bg)] text-[var(--ink)] hover:border-[var(--acc-line)]';
                              if (pickedQuickIdx !== null) {
                                if (isRight) {
                                  cls =
                                    'border-[var(--ok-line)] bg-[var(--ok-soft)] text-[var(--ink)]';
                                } else if (isPicked) {
                                  cls =
                                    'border-[var(--bad-line)] bg-[var(--bad-soft)] text-[var(--ink)]';
                                } else {
                                  cls =
                                    'border-[var(--line)] bg-[var(--bg)]/50 text-[var(--dim)] opacity-75';
                                }
                              }
                              return (
                                <button
                                  key={`${quickCard.topicId}-${quickOffset}-${idx}`}
                                  type="button"
                                  onClick={() => {
                                    triggerLightHaptic(8);
                                    const firstPickForCard = pickedQuickIdx === null;
                                    setPickedQuickIdx(idx);
                                    if (firstPickForCard && onQuickWarmupSolved) {
                                      const cardKey = `${subj}:${quickCard.topicId}:${quickOffset}`;
                                      if (!rewardedQuickKeysRef.current.has(cardKey)) {
                                        rewardedQuickKeysRef.current.add(cardKey);
                                        onQuickWarmupSolved(cardKey, idx === quickCard.correctIndex);
                                      }
                                    }
                                  }}
                                  className={`min-h-[40px] px-3 py-2 rounded-lg border text-left text-[12.5px] font-semibold flex items-center justify-between gap-2 cursor-pointer transition-colors ${cls}`}
                                >
                                  <span className="min-w-0 flex items-baseline gap-1.5">
                                    <span className="font-mono font-bold text-[var(--gold)] shrink-0">
                                      {QUICK_LETTERS[idx]}.
                                    </span>
                                    <span
                                      className="break-words"
                                      dangerouslySetInnerHTML={{
                                        __html: typesetMathHtml(opt, subj),
                                      }}
                                    />
                                  </span>
                                  {pickedQuickIdx !== null && isRight && (
                                    <span className="text-[12px] font-extrabold text-[var(--green)] shrink-0">
                                      ✓
                                    </span>
                                  )}
                                  {pickedQuickIdx !== null && isPicked && !isRight && (
                                    <span className="text-[12px] font-extrabold text-[var(--coral-ink)] shrink-0">
                                      ✕
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {quickVerdict ? (
                          <div className="pt-2.5 border-t border-[var(--line)] flex flex-col gap-1 text-[12px]">
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className={`font-bold ${
                                  quickVerdict.isCorrect
                                    ? 'text-[var(--green)]'
                                    : 'text-[var(--coral-ink)]'
                                }`}
                              >
                                {quickVerdict.verdictLabel}
                              </span>
                              {quickVerdict.isCorrect && (
                                <span className="font-bold text-[var(--gold)] tabular-nums">
                                  +5 XP earned
                                </span>
                              )}
                            </div>
                            <div
                              className="text-[var(--dim)] leading-snug line-clamp-3"
                              dangerouslySetInnerHTML={{
                                __html: typesetMathHtml(quickVerdict.explanation, subj),
                              }}
                            />
                          </div>
                        ) : (
                          <div className="pt-2 border-t border-[var(--line)] flex items-center justify-between gap-2 text-[11.5px] text-[var(--dim)]">
                            <span>Tap A–D for instant examiner feedback</span>
                            <button
                              type="button"
                              onClick={() => onOpenTopic(quickCard.topicId)}
                              className="font-bold text-[var(--gold)] hover:underline cursor-pointer whitespace-nowrap"
                            >
                              Open topic →
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col justify-center gap-2 text-[13px] text-[var(--dim)]">
                        <span>Select any topic below to start practising syllabus questions.</span>
                      </div>
                    )}
                  </div>
                </section>
              </div>

              {/* Zone 3: Hairline Priority Syllabus Queue + Weekly Momentum & Saturday CBT */}
              <div className="grid grid-cols-1 min-[880px]:grid-cols-12 gap-5 items-stretch">
                {/* Left (7 cols): Single Card with Hairline-Divided Syllabus Rows */}
                <section
                  aria-label="Priority syllabus topics"
                  className="min-[880px]:col-span-7 rtc-card rounded-2xl overflow-hidden flex flex-col justify-between"
                >
                  <div className="px-5 py-3.5 border-b border-[var(--line)] flex items-center justify-between gap-2">
                    <div className="flex items-baseline gap-2 min-w-0">
                      <h2 className="h18 text-[var(--ink)]">Syllabus Queue</h2>
                      <span className="text-[12px] text-[var(--dim)] truncate">
                        · {SUBJECT_INFO[subj].name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={onOpenTopicsMap}
                      className="text-[12.5px] font-bold text-[var(--gold)] hover:underline inline-flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <span>All {topics.length} topics</span>
                      <Icon name="go" size={13} />
                    </button>
                  </div>

                  <div className="divide-y divide-[var(--line)] flex-1 flex flex-col justify-center">
                    {focus.map((topic) => {
                      const locked =
                        !PUBLIC_FREE_LAUNCH_ACTIVE &&
                        isTopicLocked(progress, topic.id, allSubjectTopics);
                      const score = mpct(progress, topic.id);
                      const status = tstatus(progress, topic.id);
                      return (
                        <button
                          key={topic.id}
                          type="button"
                          onClick={() => onOpenTopic(topic.id)}
                          className="w-full text-left px-5 py-3.5 hover:bg-[var(--bg)]/70 flex items-center gap-3.5 cursor-pointer transition-colors"
                        >
                          <MiniRing value={score} size={38} />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 text-[11.5px] font-semibold text-[var(--dim)] truncate">
                              <span className="truncate">{topic.sec}</span>
                              <span aria-hidden="true">·</span>
                              <span
                                className={
                                  locked ? 'text-[var(--dim)]' : 'font-bold text-[var(--gold)]'
                                }
                              >
                                {locked ? 'Premium' : status}
                              </span>
                            </div>
                            <div className="font-[var(--display)] font-bold text-[15px] text-[var(--ink)] truncate">
                              {topic.name}
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

                {/* Right (5 cols): Weekly Momentum + Quiet Saturday CBT Row */}
                <section
                  aria-label="Weekly momentum and Saturday CBT"
                  className="min-[880px]:col-span-5 rtc-card rounded-2xl p-5 flex flex-col justify-between gap-4"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="h18 text-[var(--ink)]">This Week</h2>
                      <span className="text-[12px] font-semibold text-[var(--dim)]">
                        Questions answered
                      </span>
                    </div>
                    <ActivityBars act={progress.act} />
                  </div>

                  {onOpenCbt && (
                    <div className="pt-3.5 border-t border-[var(--line)] flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-[11.5px] font-bold text-[var(--gold)] tabular-nums truncate">
                          {satCampaign.isSaturday
                            ? 'Saturday National CBT · Live 2× XP'
                            : 'Saturday National CBT'}
                          {dailyCbtCount && dailyCbtCount > 0
                            ? ` · ${dailyCbtCount} ranked`
                            : ''}
                        </div>
                        <div className="font-[var(--display)] font-bold text-[14px] text-[var(--ink)] truncate">
                          {satCampaign.headline}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={onOpenCbt}
                        className="btn-tactile paper px-3 min-h-[38px] text-[12.5px] shrink-0 whitespace-nowrap"
                      >
                        <span>{satCampaign.ctaLabel}</span>
                        <Icon name="go" size={14} />
                      </button>
                    </div>
                  )}
                </section>
              </div>

              {/* Zone 4: Unified Companion & Study Workspaces Strip */}
              <section aria-label="Studios and workspaces" className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-baseline gap-2">
                    <h2 className="h18 text-[var(--ink)]">Studios &amp; Workspaces</h2>
                    <span className="hidden sm:inline text-[12px] text-[var(--dim)]">
                      · Practical labs, set novels, mistake vault, and formulas
                    </span>
                  </div>
                  <button
                    type="button"
                    aria-expanded={showAllTools}
                    onClick={() => {
                      triggerLightHaptic(8);
                      setShowAllTools((v) => !v);
                    }}
                    className="min-h-[34px] px-3 rounded-lg bg-[var(--card)] border border-[var(--line)] hover:border-[var(--acc-line)] text-[12px] font-bold text-[var(--ink)] inline-flex items-center gap-1.5 cursor-pointer transition whitespace-nowrap shrink-0"
                  >
                    <Icon name="grid" size={13} className="text-[var(--gold)]" />
                    <span>{showAllTools ? 'Fewer tools' : 'All tools'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 min-[960px]:grid-cols-4 gap-3">
                  {hasCompanion && (
                    <button
                      type="button"
                      onClick={() => {
                        triggerLightHaptic(8);
                        if (isStudioCompanion && onOpenStudio) onOpenStudio();
                        else onOpenLab();
                      }}
                      className="study-card rtc-card rounded-xl px-4 py-3.5 text-left flex items-center justify-between gap-2.5 cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-9 h-9 rounded-lg tile-mint flex items-center justify-center shrink-0">
                          <Icon name={companionIcon} size={16} />
                        </span>
                        <div className="min-w-0">
                          <div className="font-[var(--display)] font-bold text-[14px] text-[var(--ink)] truncate">
                            {companionTitle}
                          </div>
                          <div className="text-[11.5px] text-[var(--dim)] truncate">
                            {companionSubtitle}
                          </div>
                        </div>
                      </div>
                      <Icon name="go" size={14} className="text-[var(--dim)] shrink-0 ul-arrow" />
                    </button>
                  )}

                  {onOpenNovels && !(isStudioCompanion && (subj === 'eng' || subj === 'lit')) && (
                    <button
                      type="button"
                      onClick={() => {
                        triggerLightHaptic(8);
                        onOpenNovels(subj === 'lit' ? 'so-the-path' : 'lekki-headmaster');
                      }}
                      className="study-card rtc-card rounded-xl px-4 py-3.5 text-left flex items-center justify-between gap-2.5 cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-9 h-9 rounded-lg bg-[var(--acc-soft)] text-[var(--gold)] flex items-center justify-center shrink-0">
                          <Icon name="book" size={16} />
                        </span>
                        <div className="min-w-0">
                          <div className="font-[var(--display)] font-bold text-[14px] text-[var(--ink)] truncate">
                            Set Novels
                          </div>
                          <div className="text-[11.5px] text-[var(--dim)] truncate">
                            8 JAMB &amp; WAEC texts
                          </div>
                        </div>
                      </div>
                      <Icon name="go" size={14} className="text-[var(--dim)] shrink-0 ul-arrow" />
                    </button>
                  )}

                  {onOpenMistakes && (
                    <button
                      type="button"
                      onClick={() => {
                        triggerLightHaptic(8);
                        onOpenMistakes();
                      }}
                      className="study-card rtc-card rounded-xl px-4 py-3.5 text-left flex items-center justify-between gap-2.5 cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-9 h-9 rounded-lg bg-[var(--bad-soft)] text-[var(--coral-ink)] flex items-center justify-center shrink-0">
                          <Icon name="target" size={16} />
                        </span>
                        <div className="min-w-0">
                          <div className="font-[var(--display)] font-bold text-[14px] text-[var(--ink)] truncate">
                            Mistakes to Fix
                          </div>
                          <div className="text-[11.5px] text-[var(--dim)] truncate tabular-nums">
                            {openMistakesCount > 0 ? `${openMistakesCount} waiting` : 'Clean slate'}
                          </div>
                        </div>
                      </div>
                      <Icon name="go" size={14} className="text-[var(--dim)] shrink-0 ul-arrow" />
                    </button>
                  )}

                  {onOpenFormulas && (
                    <button
                      type="button"
                      onClick={() => {
                        triggerLightHaptic(8);
                        onOpenFormulas();
                      }}
                      className="study-card rtc-card rounded-xl px-4 py-3.5 text-left flex items-center justify-between gap-2.5 cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-9 h-9 rounded-lg tile-sky flex items-center justify-center shrink-0">
                          <Icon name={subj === 'eng' ? 'book' : 'sigma'} size={16} />
                        </span>
                        <div className="min-w-0">
                          <div className="font-[var(--display)] font-bold text-[14px] text-[var(--ink)] truncate">
                            {subj === 'eng' ? 'Grammar Rules' : 'Formulas'}
                          </div>
                          <div className="text-[11.5px] text-[var(--dim)] truncate">
                            {subj === 'eng' ? 'Concord & stress' : 'Equations & drills'}
                          </div>
                        </div>
                      </div>
                      <Icon name="go" size={14} className="text-[var(--dim)] shrink-0 ul-arrow" />
                    </button>
                  )}

                  {onOpenPlanner && (!hasCompanion || isStudioCompanion && (subj === 'eng' || subj === 'lit') || showAllTools) && (
                    <button
                      type="button"
                      onClick={() => {
                        triggerLightHaptic(8);
                        onOpenPlanner();
                      }}
                      className="study-card rtc-card rounded-xl px-4 py-3.5 text-left flex items-center justify-between gap-2.5 cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-9 h-9 rounded-lg bg-[var(--acc-soft)] text-[var(--gold)] flex items-center justify-center shrink-0">
                          <Icon name="calendar" size={16} />
                        </span>
                        <div className="min-w-0">
                          <div className="font-[var(--display)] font-bold text-[14px] text-[var(--ink)] truncate">
                            Study Plan
                          </div>
                          <div className="text-[11.5px] text-[var(--dim)] truncate tabular-nums">
                            {hasSetExamDate && daysToExam !== null
                              ? `${daysToExam} days left`
                              : 'Set exam date'}
                          </div>
                        </div>
                      </div>
                      <Icon name="go" size={14} className="text-[var(--dim)] shrink-0 ul-arrow" />
                    </button>
                  )}

                  {showAllTools && (
                    <>
                      {onOpenSandboxes && (
                        <button
                          type="button"
                          onClick={onOpenSandboxes}
                          className="study-card rtc-card rounded-xl px-4 py-3.5 text-left flex items-center justify-between gap-2.5 cursor-pointer anim-rise"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="w-9 h-9 rounded-lg bg-[var(--acc-soft)] text-[var(--gold)] flex items-center justify-center shrink-0">
                              <Icon name="cpu" size={16} />
                            </span>
                            <div className="min-w-0">
                              <div className="font-[var(--display)] font-bold text-[14px] text-[var(--ink)] truncate">
                                Interactive Tools
                              </div>
                              <div className="text-[11.5px] text-[var(--dim)] truncate">
                                Graphs, logic &amp; maps
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
                          className="study-card rtc-card rounded-xl px-4 py-3.5 text-left flex items-center justify-between gap-2.5 cursor-pointer anim-rise"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="w-9 h-9 rounded-lg tile-mint flex items-center justify-center shrink-0">
                              <Icon name="pen" size={16} />
                            </span>
                            <div className="min-w-0">
                              <div className="font-[var(--display)] font-bold text-[14px] text-[var(--ink)] truncate">
                                Theory Answers
                              </div>
                              <div className="text-[11.5px] text-[var(--dim)] truncate">
                                Written marking guides
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
                          className="study-card rtc-card rounded-xl px-4 py-3.5 text-left flex items-center justify-between gap-2.5 cursor-pointer anim-rise"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="w-9 h-9 rounded-lg tile-peach flex items-center justify-center shrink-0">
                              <Icon name="trophy" size={16} />
                            </span>
                            <div className="min-w-0">
                              <div className="font-[var(--display)] font-bold text-[14px] text-[var(--ink)] truncate">
                                Duels
                              </div>
                              <div className="text-[11.5px] text-[var(--dim)] truncate">
                                10-question classmate race
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
                          className="study-card rtc-card rounded-xl px-4 py-3.5 text-left flex items-center justify-between gap-2.5 cursor-pointer anim-rise"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="w-9 h-9 rounded-lg bg-[var(--acc-soft)] text-[var(--gold)] flex items-center justify-center shrink-0">
                              <Icon name="crown" size={16} />
                            </span>
                            <div className="min-w-0">
                              <div className="font-[var(--display)] font-bold text-[14px] text-[var(--ink)] truncate">
                                Leaderboard
                              </div>
                              <div className="text-[11.5px] text-[var(--dim)] truncate">
                                National scholar standings
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
                          className="study-card rtc-card rounded-xl px-4 py-3.5 text-left flex items-center justify-between gap-2.5 cursor-pointer anim-rise"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="w-9 h-9 rounded-lg tile-sky flex items-center justify-center shrink-0">
                              <Icon name="award" size={16} />
                            </span>
                            <div className="min-w-0">
                              <div className="font-[var(--display)] font-bold text-[14px] text-[var(--ink)] truncate">
                                Report Card
                              </div>
                              <div className="text-[11.5px] text-[var(--dim)] truncate">
                                Shareable mastery summary
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
                          className="study-card rtc-card rounded-xl px-4 py-3.5 text-left flex items-center justify-between gap-2.5 cursor-pointer anim-rise"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="w-9 h-9 rounded-lg bg-[var(--acc-soft)] text-[var(--gold)] flex items-center justify-center shrink-0">
                              <Icon name="database" size={16} />
                            </span>
                            <div className="min-w-0">
                              <div className="font-[var(--display)] font-bold text-[14px] text-[var(--ink)] truncate">
                                Question Bank (Owner)
                              </div>
                              <div className="text-[11.5px] text-[var(--dim)] truncate">
                                Manage &amp; export sets
                              </div>
                            </div>
                          </div>
                          <Icon name="go" size={14} className="text-[var(--dim)] shrink-0 ul-arrow" />
                        </button>
                      )}
                    </>
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
