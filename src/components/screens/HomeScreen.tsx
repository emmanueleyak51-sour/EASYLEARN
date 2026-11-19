import React, { useRef } from 'react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion, type Variants } from 'motion/react';
import type { ChemClassId, SubjectId, UserProgress } from '../../types';
import {
  CHEM_CLASSES,
  filterChemTopicsByClass,
  getChemClassMeta,
} from '../../data/chemNerdc2027';
import {
  MATH_CLASSES,
  filterMathTopicsByClass,
  getMathClassMeta,
} from '../../data/mathNerdc2027';
import {
  FMATH_CLASSES,
  filterFMathTopicsByClass,
  getFMathClassMeta,
} from '../../data/fmathNerdc2027';
import {
  PHYS_CLASSES,
  filterPhysTopicsByClass,
  getPhysClassMeta,
} from '../../data/physNerdc2027';
import {
  BIO_CLASSES,
  filterBioTopicsByClass,
  getBioClassMeta,
} from '../../data/bioNerdc2027';
import {
  AGRIC_CLASSES,
  filterAgricTopicsByClass,
  getAgricClassMeta,
} from '../../data/agricNerdc2027';
import {
  GEOG_CLASSES,
  filterGeogTopicsByClass,
  getGeogClassMeta,
} from '../../data/geogNerdc2027';
import {
  ECON_CLASSES,
  filterEconTopicsByClass,
  getEconClassMeta,
} from '../../data/econNerdc2027';
import {
  ENG_CLASSES,
  filterEngTopicsByClass,
  getEngClassMeta,
} from '../../data/engNerdc2027';
import {
  CIVIC_CLASSES,
  filterCivicTopicsByClass,
  getCivicClassMeta,
} from '../../data/civicNerdc2027';
import {
  DIGITECH_CLASSES,
  filterDigiTechTopicsByClass,
  getDigiTechClassMeta,
} from '../../data/digitechNerdc2027';
import {
  DATAPROC_CLASSES,
  filterDataProcTopicsByClass,
  getDataProcClassMeta,
} from '../../data/dataprocNerdc2027';
import { getTopics, getTopicsForProgress, SUBJECT_IDS } from '../../data/curriculum';
import { extractMissionSpeechScript } from '../../utils/chemVoiceLogic';
import {
  SUBJECT_INFO,
  greet,
  homeTopics,
  mpct,
  nextMission,
  today,
  tstate,
  tstatus,
} from '../../utils/engine';
import { AnimatedNumber } from '../AnimatedNumber';
import { ChemMadScientistBar } from '../ChemMadScientistBar';
import { Icon, MiniRing } from '../Icons';
import { MotivationBanner } from '../MotivationBanner';
import {
  FLUID_SCREEN_EXIT,
  FLUID_SCREEN_SPRING,
  LIQUID_CAPSULE_SPRING,
  usePostMountLayoutGate,
} from '../ULessonMotion';
import { computeSubjectSwitchDirection } from '../../utils/screenTransitionLogic';
import { summarizeMistakeVault } from '../../utils/mistakeVaultLogic';
import { computeDaysRemainingWat, getDefaultStudyPlan } from '../../utils/studyPlannerLogic';
import { useQuestionBankCounts } from '../../utils/questionBankDb';
import { BANK_TOTAL_TARGET } from '../../utils/questionBankLogic';
import type { QuestionBankTab } from '../QuestionBankManagerModal';

interface SubjectGlideCustom {
  dir: -1 | 0 | 1;
  reduced: boolean;
}

const HOME_SUBJECT_VARIANTS: Variants = {
  initial: (c: SubjectGlideCustom) =>
    c?.reduced ? { opacity: 0 } : { opacity: 0, x: (c?.dir || 1) * 20, scale: 0.996 },
  animate: (c: SubjectGlideCustom) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: c?.reduced ? { duration: 0.01 } : FLUID_SCREEN_SPRING,
  }),
  exit: (c: SubjectGlideCustom) =>
    c?.reduced
      ? { opacity: 0, pointerEvents: 'none', transition: { duration: 0.01 } }
      : {
          opacity: 0,
          x: -(c?.dir || 1) * 16,
          scale: 0.996,
          pointerEvents: 'none',
          transition: FLUID_SCREEN_EXIT,
        },
};

export function ActivityBars({ act, days = 7 }: { act: Record<number, number>; days?: number }) {
  const d = today();
  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const items = Array.from({ length: days }, (_, idx) => {
    const dayNum = d - (days - 1 - idx);
    const count = act[dayNum] || 0;
    const dow = ((new Date().getDay() - (days - 1 - idx)) % 7 + 7) % 7;
    return { dayNum, count, label: idx === days - 1 ? 'Today' : labels[dow], isToday: idx === days - 1 };
  });
  const maxVal = Math.max(5, ...items.map((x) => x.count));

  return (
    <div className="grid grid-cols-7 gap-2 items-end pt-2" role="img" aria-label="7-day practice activity">
      {items.map((it) => {
        const barH = Math.max(6, Math.round((it.count / maxVal) * 56));
        const yPos = 60 - barH;
        return (
          <div key={it.dayNum} className="flex flex-col items-center gap-1.5">
            <span className="text-[11px] font-bold tabular-nums text-[var(--dim)]">
              {it.count > 0 ? it.count : ''}
            </span>
            <svg width="28" height="62" viewBox="0 0 28 62" aria-hidden="true">
              <rect x="4" y="4" width="20" height="56" rx="6" fill="var(--deep)" />
              <rect
                x="4"
                y={yPos}
                width="20"
                height={barH}
                rx="6"
                fill={it.isToday ? 'var(--gold)' : it.count > 0 ? 'var(--green)' : 'var(--line)'}
                className="dg"
              />
            </svg>
            <span className={`text-[11px] font-bold ${it.isToday ? 'text-[var(--gold)]' : 'text-[var(--dim)]'}`}>
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
  onSelectSubject,
  onSelectClassAndBrowse,
  onManageSubjects,
  onOpenTopic,
  onStartMission,
  onOpenReview,
  onStartDiagnostic,
  onOpenLab,
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
}: {
  progress: UserProgress;
  dueIds: string[];
  onSelectSubject: (s: SubjectId) => void;
  onSelectClassAndBrowse?: (cls: ChemClassId) => void;
  onManageSubjects: () => void;
  onOpenTopic: (tid: string) => void;
  onStartMission: (tid: string, stage: 'lesson' | 'practice' | 'boss') => void;
  onOpenReview: () => void;
  onStartDiagnostic: () => void;
  onOpenLab: () => void;
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
}) {
  const isFMath = progress.subj === 'fmaths';
  const isChem = progress.subj === 'chem';
  const isPhys = progress.subj === 'phys';
  const isBio = progress.subj === 'bio';
  const isAgric = progress.subj === 'agric';
  const isGeog = progress.subj === 'geog';
  const isEcon = progress.subj === 'econ';
  const isEng = progress.subj === 'eng';
  const isCivic = progress.subj === 'civic';
  const isDigiTech = progress.subj === 'digitech';
  const isDataProc = progress.subj === 'dataproc';
  const activeClass: ChemClassId = isFMath
    ? progress.fmathClass || 'all'
    : isChem
      ? progress.chemClass || 'all'
      : isPhys
        ? progress.physClass || 'all'
        : isBio
          ? progress.bioClass || 'all'
          : isAgric
            ? progress.agricClass || 'all'
            : isGeog
              ? progress.geogClass || 'all'
              : isEcon
                ? progress.econClass || 'all'
                : isEng
                  ? progress.engClass || 'all'
                  : isCivic
                    ? progress.civicClass || 'all'
                    : isDigiTech
                      ? progress.digitechClass || 'all'
                      : isDataProc
                        ? progress.dataprocClass || 'all'
                        : progress.mathClass || 'all';
  const classList = isFMath
    ? FMATH_CLASSES
    : isChem
      ? CHEM_CLASSES
      : isPhys
        ? PHYS_CLASSES
        : isBio
          ? BIO_CLASSES
          : isAgric
            ? AGRIC_CLASSES
            : isGeog
              ? GEOG_CLASSES
              : isEcon
                ? ECON_CLASSES
                : isEng
                  ? ENG_CLASSES
                  : isCivic
                    ? CIVIC_CLASSES
                    : isDigiTech
                      ? DIGITECH_CLASSES
                      : isDataProc
                        ? DATAPROC_CLASSES
                        : MATH_CLASSES;
  const classMeta = isFMath
    ? getFMathClassMeta(activeClass)
    : isChem
      ? getChemClassMeta(activeClass)
      : isPhys
        ? getPhysClassMeta(activeClass)
        : isBio
          ? getBioClassMeta(activeClass)
          : isAgric
            ? getAgricClassMeta(activeClass)
            : isGeog
              ? getGeogClassMeta(activeClass)
              : isEcon
                ? getEconClassMeta(activeClass)
                : isEng
                  ? getEngClassMeta(activeClass)
                  : isCivic
                    ? getCivicClassMeta(activeClass)
                    : isDigiTech
                      ? getDigiTechClassMeta(activeClass)
                      : isDataProc
                        ? getDataProcClassMeta(activeClass)
                        : getMathClassMeta(activeClass);
  const allSubjectTopics = getTopics(progress.subj);

  const topics = getTopicsForProgress(progress);
  const passedCount = topics.filter((t) => tstate(progress, t.id).boss).length;
  const overallMasteryPct = topics.length
    ? Math.round(topics.reduce((acc, t) => acc + mpct(progress, t.id), 0) / topics.length)
    : 0;
  const mission = nextMission(progress, topics);
  const focus = homeTopics(progress, topics).slice(0, 3);
  const hasDiagnosed = !!(progress.sx[progress.subj]?.dx || progress.dx);
  const dueCount = dueIds.length;
  const openMistakesCount = summarizeMistakeVault(progress.mistakes || {}).total;
  const activePlan = progress.studyPlan || getDefaultStudyPlan(progress.subjs);
  const daysToExam = computeDaysRemainingWat(activePlan.examDateIso);
  const { counts: bankCounts, totalCount: bankTotalCount } = useQuestionBankCounts();

  const missionLabel = mission
    ? mission.stage === 'lesson'
      ? 'Start 5-min lesson'
      : mission.stage === 'practice'
        ? 'Practise 6 questions'
        : 'Take 5-min topic test'
    : 'Review mastered topics';

  const prefersReduced = Boolean(useReducedMotion());
  const subjTransRef = useRef<{ subj: SubjectId; dir: -1 | 0 | 1 }>({
    subj: progress.subj,
    dir: 0,
  });
  if (subjTransRef.current.subj !== progress.subj) {
    subjTransRef.current = {
      subj: progress.subj,
      dir: computeSubjectSwitchDirection(subjTransRef.current.subj, progress.subj),
    };
  }
  const subjCapsuleReady = usePostMountLayoutGate();
  const subjGlideCustom: SubjectGlideCustom = {
    dir: subjTransRef.current.dir,
    reduced: prefersReduced,
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Clean Greeting Header — Subjects switcher lives solely in the dedicated Subjects card below */}
      <div>
        <span className="eyebrow text-[var(--gold)]">
          {`${SUBJECT_INFO[progress.subj].name} · ${classMeta.label}`}
        </span>
        <h1 className="h28 text-[var(--ink)]">
          {greet()}, {progress.name || 'Student'}
        </h1>
      </div>

      <div className="relative overflow-x-clip">
        <AnimatePresence initial={false} mode="popLayout" custom={subjGlideCustom}>
          <motion.div
            key={progress.subj}
            custom={subjGlideCustom}
            variants={HOME_SUBJECT_VARIANTS}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col gap-5 will-change-transform"
          >
            <LayoutGroup id={`home-subj-${progress.subj}`}>
      {/* Choreographed Scholar Motivation Showcase + Reassuring Momentum Strip */}
      <div className="flex flex-col gap-3">
        <MotivationBanner
          variant="hero"
          studentName={progress.name}
          subj={progress.subj}
        />

        {/* Unified Architectural 3-Column Metric Strip */}
        <div className="rtc-card rounded-2xl grid grid-cols-3 divide-x divide-[var(--line)] overflow-hidden">
          <div className="px-3.5 py-3 sm:px-5 sm:py-3.5 flex flex-col gap-0.5">
            <span className="text-[11.5px] sm:text-[12px] font-semibold text-[var(--dim)] whitespace-nowrap">
              <span className="sm:hidden">Mastery</span>
              <span className="hidden sm:inline">Mastery Score</span>
            </span>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="font-[var(--display)] font-extrabold text-[20px] sm:text-[24px] text-[var(--ink)] tabular-nums leading-tight tracking-tight">
                <AnimatedNumber value={overallMasteryPct} suffix="%" />
              </span>
              <span className="hidden min-[540px]:inline text-[11.5px] font-medium text-[var(--dim)] tabular-nums">
                of {progress.target}% target
              </span>
            </div>
          </div>
          <div className="px-3.5 py-3 sm:px-5 sm:py-3.5 flex flex-col gap-0.5">
            <span className="text-[11.5px] sm:text-[12px] font-semibold text-[var(--dim)] whitespace-nowrap">
              Study Streak
            </span>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="font-[var(--display)] font-extrabold text-[20px] sm:text-[24px] text-[var(--coral-ink)] tabular-nums leading-tight tracking-tight">
                <AnimatedNumber value={progress.streak.n} suffix="d" />
              </span>
              <span className="hidden min-[540px]:inline text-[11.5px] font-medium text-[var(--dim)]">
                active days
              </span>
            </div>
          </div>
          <div className="px-3.5 py-3 sm:px-5 sm:py-3.5 flex flex-col gap-0.5">
            <span className="text-[11.5px] sm:text-[12px] font-semibold text-[var(--dim)] whitespace-nowrap">
              <span className="sm:hidden">Topics</span>
              <span className="hidden sm:inline">Topics Mastered</span>
            </span>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="font-[var(--display)] font-extrabold text-[20px] sm:text-[24px] text-[var(--gold)] tabular-nums leading-tight tracking-tight">
                <AnimatedNumber value={passedCount} />
                <span className="text-[14px] sm:text-[16px] font-bold text-[var(--dim)]">/{topics.length}</span>
              </span>
              <span className="hidden min-[540px]:inline text-[11.5px] font-medium text-[var(--dim)]">
                topics passed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Action First: Today's Calm 8-Minute Step + Quick Studios */}
      <div className="grid grid-cols-1 min-[780px]:grid-cols-12 gap-5 items-stretch">
        {/* Today's 8-Minute Step */}
        <section className="min-[780px]:col-span-7 rtc-card rounded-2xl border-[var(--acc-line)] bg-gradient-to-b from-[var(--acc-soft)]/35 via-[var(--card)] to-[var(--card)] p-5 sm:p-6 flex flex-col justify-between gap-5">
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="eyebrow text-[var(--gold)]">
                Today’s 8-Minute Step · One Bite at a Time
              </span>
              {mission && (
                <span className="text-[12.5px] font-bold text-[var(--green)] tabular-nums">
                  +{mission.gain}% mastery boost
                </span>
              )}
            </div>
            {mission ? (
              <>
                <h2 className="h22 text-[var(--ink)]">{mission.t.name}</h2>
                <p className="text-[15px] text-[var(--dim)] leading-relaxed">
                  {mission.stage === 'lesson'
                    ? `Forget the rest of the syllabus for now — spend 5 calm minutes mastering the core idea of ${mission.t.name.toLowerCase()}.`
                    : mission.stage === 'practice'
                      ? `Lesson complete! Lock in your confidence with 6 quick ${SUBJECT_INFO[progress.subj].short} questions.`
                      : `Final step for this topic: pass 5 of 7 questions to bank ${mission.t.name} for good.`}
                </p>

                {/* 3-Stage Bite-Sized Progression Track */}
                <div className="grid grid-cols-3 gap-2 pt-1" aria-label="Chapter learning stages">
                  {(
                    [
                      { id: 'lesson', label: '1. Learn (~5m)', done: mission.stage !== 'lesson' },
                      { id: 'practice', label: '2. Practise (~4m)', done: mission.stage === 'boss' },
                      { id: 'boss', label: '3. Master (~5m)', done: false },
                    ] as const
                  ).map((step) => {
                    const isCurrent = mission.stage === step.id;
                    return (
                      <div key={step.id} className="flex flex-col gap-1">
                        <div
                          className={`h-1.5 rounded-full transition-colors duration-200 ${
                            step.done
                              ? 'bg-[var(--green)]'
                              : isCurrent
                                ? 'bg-[var(--gold)]'
                                : 'bg-[var(--line)]'
                          }`}
                        />
                        <span
                          className={`text-[11.5px] font-bold whitespace-nowrap ${
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
                  mode={
                    isDataProc
                      ? 'dataproc'
                      : isDigiTech
                        ? 'digitech'
                        : isCivic
                          ? 'civic'
                          : isEng
                            ? 'eng'
                            : isEcon
                              ? 'econ'
                              : isGeog
                                ? 'geog'
                                : isAgric
                                  ? 'agric'
                                  : isBio
                                    ? 'bio'
                                    : isPhys
                                      ? 'phys'
                                      : isChem
                                        ? 'chem'
                                        : isFMath
                                          ? 'fmath'
                                          : 'math'
                  }
                  variant="compact"
                  muted={progress.muted}
                  stepKey={`home|${progress.subj}|${mission.t.id}|${mission.stage}`}
                  context={{
                    topicName: mission.t.name,
                    sectionName: mission.t.sec,
                    stepLabel: `Today’s ${SUBJECT_INFO[progress.subj].name} Step`,
                    stepText: extractMissionSpeechScript(
                      mission.t.name,
                      mission.stage,
                      mission.gain,
                      mission.t.trap,
                      progress.subj
                    ),
                    examTrap: mission.t.trap,
                    goals: mission.t.goals,
                  }}
                />
              </>
            ) : (
              <>
                <h2 className="h22 text-[var(--ink)]">You’ve completed this class path!</h2>
                <p className="text-[15px] text-[var(--dim)]">
                  Every topic in this view is passed ({passedCount} mastered). Keep sharpening your edge in spaced review.
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
                  className="btn-tactile indigo flex-1 min-w-[200px] whitespace-nowrap"
                >
                  <span>{missionLabel}</span>
                  <Icon name="go" size={18} className="ul-arrow" />
                </button>
                <button
                  type="button"
                  onClick={() => onOpenTopic(mission.t.id)}
                  className="btn-tactile paper whitespace-nowrap"
                >
                  <span>Notes &amp; overview</span>
                </button>
              </>
            ) : (
              <button type="button" onClick={onOpenReview} className="btn-tactile indigo w-full whitespace-nowrap">
                <span>Open spaced review</span>
                <Icon name="go" size={18} className="ul-arrow" />
              </button>
            )}
          </div>
        </section>

        {/* Right column: Subjects Panel + Subject-Appropriate Tools */}
        <div className="min-[780px]:col-span-5 flex flex-col gap-3.5">
          <section
            aria-label="Subjects workspace switcher"
            className="rtc-card rounded-2xl p-4 sm:p-5 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="font-[var(--display)] font-bold text-[16px] text-[var(--ink)]">
                  Subjects
                </div>
                <div className="text-[12.5px] text-[var(--dim)]">
                  {progress.subjs.length} of {SUBJECT_IDS.length} faculties active · Switch instantly
                </div>
              </div>
              <button
                type="button"
                onClick={onManageSubjects}
                className="min-h-[32px] px-2.5 rounded-lg bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--acc-line)] text-[12px] font-bold text-[var(--gold)] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                All {SUBJECT_IDS.length} hub
              </button>
            </div>

            <div className="grid grid-cols-2 gap-1.5" role="group" aria-label="Quick switch subject">
              {(progress.subjs.length ? progress.subjs : SUBJECT_IDS).map((sid) => {
                const active = progress.subj === sid;
                const offlineCount = bankCounts[sid] || 0;
                return (
                  <button
                    key={sid}
                    type="button"
                    aria-pressed={active}
                    title={`${SUBJECT_INFO[sid].name} · ${offlineCount.toLocaleString()} offline bank questions`}
                    onClick={() => onSelectSubject(sid)}
                    className={`relative min-h-[38px] px-2.5 rounded-xl border text-[12.5px] font-semibold flex items-center justify-between gap-1.5 transition-[color,border-color,transform] duration-150 active:scale-[0.98] cursor-pointer whitespace-nowrap ${
                      active
                        ? 'text-[var(--on-acc)] border-[var(--gold)] font-bold'
                        : 'bg-[var(--bg)] text-[var(--dim)] border-[var(--line)] hover:border-[var(--acc-line)] hover:text-[var(--ink)]'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId={subjCapsuleReady ? 'home-subjects-card-capsule' : undefined}
                        aria-hidden="true"
                        transition={prefersReduced ? { duration: 0 } : LIQUID_CAPSULE_SPRING}
                        className="pointer-events-none absolute inset-0 rounded-[11px] bg-[var(--gold)] shadow-[0_1px_3px_rgba(15,23,42,0.18)]"
                      />
                    )}
                    <span className="relative z-10 inline-flex items-center gap-1.5 min-w-0">
                      <Icon name={SUBJECT_INFO[sid].icon} size={14} className="shrink-0" />
                      <span className="truncate">{SUBJECT_INFO[sid].compact}</span>
                    </span>
                    <span
                      className={`relative z-10 text-[10.5px] font-bold tabular-nums shrink-0 ${
                        active ? 'opacity-90' : offlineCount > 0 ? 'text-[var(--gold)]' : 'opacity-65'
                      }`}
                    >
                      {offlineCount.toLocaleString()}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-[var(--line)] -mx-1.5 flex items-center justify-between gap-1">
              {onOpenQuestionBank && (
                <button
                  type="button"
                  onClick={() => onOpenQuestionBank(progress.subj, 'overview')}
                  className="inline-flex items-center gap-1.5 min-w-0 min-h-[30px] px-2 rounded-lg text-left text-[12px] font-bold text-[var(--gold)] hover:bg-[var(--bg)] transition-colors duration-150 cursor-pointer whitespace-nowrap"
                >
                  <Icon name="database" size={13.5} className="shrink-0" />
                  <span className="truncate tabular-nums">
                    Bank · {bankTotalCount.toLocaleString()}/12k
                  </span>
                </button>
              )}

              {onOpenLeaderboard && (
                <button
                  type="button"
                  onClick={onOpenLeaderboard}
                  className="inline-flex items-center gap-1.5 min-w-0 min-h-[30px] px-2 rounded-lg text-[12px] font-semibold text-[var(--dim)] hover:text-[var(--gold)] hover:bg-[var(--bg)] transition-colors duration-150 cursor-pointer whitespace-nowrap"
                >
                  <Icon name="crown" size={13.5} className="text-[var(--gold)] shrink-0" />
                  <span>Leaderboard</span>
                </button>
              )}

              <button
                type="button"
                onClick={onOpenReview}
                className="inline-flex items-center gap-1.5 min-w-0 min-h-[30px] px-2 rounded-lg text-right text-[12px] font-semibold text-[var(--dim)] hover:text-[var(--gold)] hover:bg-[var(--bg)] transition-colors duration-150 cursor-pointer whitespace-nowrap"
              >
                <Icon name="rev" size={13.5} className={dueCount > 0 ? 'text-[var(--coral-ink)] shrink-0' : 'text-[var(--green)] shrink-0'} />
                <span className="truncate">
                  {dueCount > 0 ? `${dueCount} due` : 'Review'}
                </span>
                <Icon name="go" size={13} className="shrink-0" />
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Quick Studios Strip: Practicals Lab + Formula / Rules Studio side-by-side */}
      <div
        className={`grid grid-cols-1 ${
          !isFMath &&
          !isGeog &&
          !isEng &&
          !isEcon &&
          !isCivic &&
          !isDigiTech &&
          !isDataProc &&
          !isBio &&
          !isAgric &&
          onOpenFormulas
            ? 'min-[780px]:grid-cols-2'
            : ''
        } gap-4`}
      >
        {!isFMath && !isGeog && !isEng && !isEcon && !isCivic && !isDigiTech && !isDataProc && (
          <button
            type="button"
            onClick={onOpenLab}
            className="study-card rtc-eq-plate w-full text-left rounded-2xl text-white p-4 sm:p-5 flex items-center justify-between gap-4 hover:border-white/25 cursor-pointer"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="ul-icon-box w-11 h-11 rounded-xl bg-white/10 border border-white/15 text-amber-300 flex items-center justify-center shrink-0">
                <Icon
                  name={
                    isChem
                      ? 'flask'
                      : isAgric
                        ? 'leaf'
                        : isBio
                          ? 'dna'
                          : isPhys
                            ? 'atom'
                            : 'pen'
                  }
                  size={22}
                />
              </div>
              <div className="min-w-0">
                <div className="font-[var(--display)] font-bold text-[15.5px] text-white">
                  {isChem
                    ? 'Chemistry Practicals Lab'
                    : isAgric
                      ? 'Agricultural Science Practicals Lab'
                      : isBio
                        ? 'Biology Practicals Lab'
                        : isPhys
                          ? 'Physics Practicals Lab'
                          : 'Maths Constructions Lab'}
                </div>
                <div className="text-[12.5px] text-slate-300 truncate">
                  {isChem
                    ? 'Interactive glassware, meniscus & live titration'
                    : isAgric
                      ? 'Soil pH, NPK response, feed rations & farm assays'
                      : isBio
                        ? 'Microscopy, osmosis, food tests & enzyme kinetics'
                        : isPhys
                          ? 'Interactive vernier, optics, circuits & meters'
                          : 'Compass, ruler, protractor & locus workbench'}
                </div>
              </div>
            </div>
            <Icon name="go" size={18} className="text-amber-300 shrink-0 ul-arrow" />
          </button>
        )}

        {!isBio && !isAgric && !isCivic && onOpenFormulas && (
          <button
            type="button"
            onClick={onOpenFormulas}
            className="study-card rtc-card w-full text-left rounded-2xl hover:border-[var(--acc-line)] p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="ul-icon-box w-11 h-11 rounded-xl bg-[var(--acc-soft)] text-[var(--gold)] flex items-center justify-center shrink-0">
                <Icon
                  name={
                    isDataProc
                      ? 'database'
                      : isDigiTech
                        ? 'cpu'
                        : isEng
                          ? 'book'
                          : isEcon
                            ? 'chart'
                            : isGeog
                              ? 'globe'
                              : isFMath
                                ? 'integral'
                                : isPhys
                                  ? 'atom'
                                  : 'sigma'
                  }
                  size={22}
                />
              </div>
              <div className="min-w-0">
                <div className="font-[var(--display)] font-bold text-[16px] text-[var(--ink)]">
                  {isDataProc
                    ? 'Data Processing SQL & Formula Studio'
                    : isDigiTech
                      ? 'Digital Tech Formula & Binary Studio'
                      : isEng
                        ? 'English Grammar & Rules Studio'
                        : isEcon
                          ? 'Economics Formula Studio'
                          : isGeog
                            ? 'Geography Calculations Studio'
                            : isFMath
                              ? 'Further Maths Formula Studio'
                              : isChem
                                ? 'Chemistry Formula Studio'
                                : isPhys
                                  ? 'Physics Formula Studio'
                                  : 'Mathematics Formula Studio'}
                </div>
                <div className="text-[13px] text-[var(--dim)] truncate">
                  {isDataProc
                    ? 'SQL, 1NF–3NF, Excel & checksum calculation drills'
                    : isDigiTech
                      ? 'Binary, storage, ALU, logic & network drills'
                      : isEng
                        ? 'Core concord, stress & clause patterns + drills'
                        : isEcon
                          ? 'Elasticity, costs, CPI & multiplier calculation drills'
                          : isGeog
                            ? 'Map scale, gradient, longitude time & climate drills'
                            : isFMath
                              ? 'Calculus, vectors, mechanics & stats formula drills'
                              : 'Equation rearranger & quick calculation drills'}
                </div>
              </div>
            </div>
            <Icon name="go" size={18} className="text-[var(--gold)] shrink-0 ul-arrow" />
          </button>
        )}

        {isCivic && (
          <button
            type="button"
            onClick={() => (mission ? onOpenTopic(mission.t.id) : onOpenTopicsMap())}
            className="study-card rtc-card w-full text-left rounded-2xl hover:border-[var(--acc-line)] p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="ul-icon-box w-11 h-11 rounded-xl bg-[var(--acc-soft)] text-[var(--gold)] flex items-center justify-center shrink-0">
                <Icon name="scales" size={22} />
              </div>
              <div className="min-w-0">
                <div className="font-[var(--display)] font-bold text-[15.5px] text-[var(--ink)]">
                  Constitutional &amp; Civic Case Studies
                </div>
                <div className="text-[12.5px] text-[var(--dim)] truncate">
                  30 SS1–SS3 topics · Illustrated diagrams &amp; Barrister Kunle voice
                </div>
              </div>
            </div>
            <Icon name="go" size={18} className="text-[var(--gold)] shrink-0 ul-arrow" />
          </button>
        )}
      </div>

      {/* Exam & Studio Command Strip — Flagship CBT, Mistake Vault, Planner, Sandboxes, Theory, Transcript & Duels */}
      {onOpenCbt && (
        <section aria-label="Exam preparation and studio suite" className="rtc-card rounded-2xl p-4 sm:p-5 flex flex-col gap-3.5">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div>
              <span className="eyebrow text-[var(--gold)]">Exam Command Suite · WAEC &amp; JAMB Ready</span>
              <h2 className="h18 text-[var(--ink)]">Simulators, Sandboxes &amp; Mastery Tools</h2>
            </div>
            <span className="text-[12px] font-semibold text-[var(--dim)] mono tabular-nums whitespace-nowrap">
              {activePlan.examType.toUpperCase()} · {daysToExam}d left
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 min-[920px]:grid-cols-4 gap-2.5">
            <button
              type="button"
              onClick={onOpenCbt}
              className="study-card rtc-eq-plate text-left rounded-xl p-3.5 flex items-start gap-3 text-white hover:border-white/25 cursor-pointer sm:col-span-2"
            >
              <span className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 text-amber-300 flex items-center justify-center shrink-0">
                <Icon name="clock" size={19} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-[var(--display)] font-bold text-[14.5px] text-white leading-snug">
                  JAMB UTME &amp; WAEC CBT Simulator
                </div>
                <div className="text-[12px] text-slate-300 leading-snug mt-0.5">
                  4-subject timed CBT (/400), WAEC A1–F9 grading, keyboard shortcuts &amp; weak-topic diagnosis
                </div>
              </div>
              <Icon name="go" size={16} className="text-amber-300 shrink-0 mt-1 ul-arrow" />
            </button>

            {onOpenMistakes && (
              <button
                type="button"
                onClick={onOpenMistakes}
                className="study-card text-left rounded-xl bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--acc-line)] p-3.5 flex items-start gap-3 cursor-pointer"
              >
                <span className="w-9 h-9 rounded-xl bg-[var(--bad-soft)] text-[var(--coral-ink)] flex items-center justify-center shrink-0">
                  <Icon name="target" size={17} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-[var(--display)] font-bold text-[13.5px] text-[var(--ink)] leading-snug">
                    Mistake Vault
                  </div>
                  <div className="text-[11.5px] text-[var(--dim)] mt-0.5">
                    {openMistakesCount > 0 ? `${openMistakesCount} open to clear` : 'Red-ink notebook · Clean'}
                  </div>
                </div>
              </button>
            )}

            {onOpenPlanner && (
              <button
                type="button"
                onClick={onOpenPlanner}
                className="study-card text-left rounded-xl bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--acc-line)] p-3.5 flex items-start gap-3 cursor-pointer"
              >
                <span className="w-9 h-9 rounded-xl bg-[var(--acc-soft)] text-[var(--gold)] flex items-center justify-center shrink-0">
                  <Icon name="calendar" size={17} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-[var(--display)] font-bold text-[13.5px] text-[var(--ink)] leading-snug">
                    Study Planner
                  </div>
                  <div className="text-[11.5px] text-[var(--dim)] mt-0.5">
                    {daysToExam}d countdown · Adaptive 7-day plan
                  </div>
                </div>
              </button>
            )}

            {onOpenSandboxes && (
              <button
                type="button"
                onClick={onOpenSandboxes}
                className="study-card text-left rounded-xl bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--acc-line)] p-3.5 flex items-start gap-3 cursor-pointer"
              >
                <span className="w-9 h-9 rounded-xl bg-[var(--acc-soft)] text-[var(--gold)] flex items-center justify-center shrink-0">
                  <Icon name="cpu" size={17} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-[var(--display)] font-bold text-[13.5px] text-[var(--ink)] leading-snug">
                    Interactive Sandboxes
                  </div>
                  <div className="text-[11.5px] text-[var(--dim)] mt-0.5">
                    SQL · Logic · Matrices · Map Lab
                  </div>
                </div>
              </button>
            )}

            {onOpenTheory && (
              <button
                type="button"
                onClick={onOpenTheory}
                className="study-card text-left rounded-xl bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--acc-line)] p-3.5 flex items-start gap-3 cursor-pointer"
              >
                <span className="w-9 h-9 rounded-xl bg-[var(--ok-soft)] text-[var(--green)] flex items-center justify-center shrink-0">
                  <Icon name="pen" size={17} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-[var(--display)] font-bold text-[13.5px] text-[var(--ink)] leading-snug">
                    Paper 2 Theory Coach
                  </div>
                  <div className="text-[11.5px] text-[var(--dim)] mt-0.5">
                    WAEC B1/M1/A1 marking rubrics
                  </div>
                </div>
              </button>
            )}

            {onOpenTranscript && (
              <button
                type="button"
                onClick={onOpenTranscript}
                className="study-card text-left rounded-xl bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--acc-line)] p-3.5 flex items-start gap-3 cursor-pointer"
              >
                <span className="w-9 h-9 rounded-xl bg-[var(--acc-soft)] text-[var(--gold)] flex items-center justify-center shrink-0">
                  <Icon name="award" size={17} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-[var(--display)] font-bold text-[13.5px] text-[var(--ink)] leading-snug">
                    Transcript &amp; Sheets
                  </div>
                  <div className="text-[11.5px] text-[var(--dim)] mt-0.5">
                    Parent report &amp; printable PDFs
                  </div>
                </div>
              </button>
            )}

            {onOpenDuel && (
              <button
                type="button"
                onClick={onOpenDuel}
                className="study-card text-left rounded-xl bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--acc-line)] p-3.5 flex items-start gap-3 cursor-pointer"
              >
                <span className="w-9 h-9 rounded-xl bg-[var(--mark-soft)] text-[var(--ink)] flex items-center justify-center shrink-0">
                  <Icon name="trophy" size={17} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-[var(--display)] font-bold text-[13.5px] text-[var(--ink)] leading-snug">
                    Peer Study Duels
                  </div>
                  <div className="text-[11.5px] text-[var(--dim)] mt-0.5">
                    10-Q timed friend challenge
                  </div>
                </div>
              </button>
            )}

            {onOpenLeaderboard && (
              <button
                type="button"
                onClick={onOpenLeaderboard}
                className="study-card text-left rounded-xl bg-[var(--bg)] border border-[var(--acc-line)] hover:border-[var(--gold)] p-3.5 flex items-start gap-3 cursor-pointer sm:col-span-2"
              >
                <span className="w-10 h-10 rounded-xl bg-[var(--acc-soft)] text-[var(--gold)] flex items-center justify-center shrink-0">
                  <Icon name="crown" size={19} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="font-[var(--display)] font-bold text-[14px] text-[var(--ink)] leading-snug">
                      National Scholars Leaderboard
                    </div>
                    <span className="text-[11.5px] font-extrabold text-[var(--gold)] whitespace-nowrap">
                      Compete live
                    </span>
                  </div>
                  <div className="text-[12px] text-[var(--dim)] mt-0.5">
                    Climb 5 Academic Divisions by Mastery Index, Topics Passed, Accuracy &amp; CBT Scores
                  </div>
                </div>
                <Icon name="go" size={16} className="text-[var(--gold)] shrink-0 mt-1 ul-arrow" />
              </button>
            )}

            {onOpenQuestionBank && (
              <button
                type="button"
                onClick={() => onOpenQuestionBank(progress.subj, 'overview')}
                className="study-card text-left rounded-xl bg-[var(--bg)] border border-[var(--acc-line)] hover:border-[var(--gold)] p-3.5 flex items-start gap-3 cursor-pointer sm:col-span-2"
              >
                <span className="w-10 h-10 rounded-xl bg-[var(--acc-soft)] text-[var(--gold)] flex items-center justify-center shrink-0">
                  <Icon name="database" size={19} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="font-[var(--display)] font-bold text-[14px] text-[var(--ink)] leading-snug">
                      Hybrid Question Bank &amp; Sync Engine
                    </div>
                    <span className="text-[11.5px] font-extrabold text-[var(--gold)] mono tabular-nums whitespace-nowrap">
                      {bankTotalCount.toLocaleString()} / {BANK_TOTAL_TARGET.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-[12px] text-[var(--dim)] mt-0.5">
                    IndexedDB offline store · ALOC Past Questions + Gemini Batch Generator · JSON Backup
                  </div>
                </div>
                <Icon name="go" size={16} className="text-[var(--gold)] shrink-0 mt-1 ul-arrow" />
              </button>
            )}
          </div>
        </section>
      )}

      {/* Calm Class Level Selector Bar (Compact & Non-Intimidating) */}
      {onSelectClassAndBrowse && (
        <section className="rtc-card rounded-2xl p-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
          <div>
            <span className="eyebrow text-[var(--gold)]">
              Study by Class Level
            </span>
            <p className="text-[13.5px] text-[var(--dim)] mt-0.5">
              Pick your class to see only your current term’s bite-sized topics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {classList.map((cls) => {
              const clsTopics = isFMath
                ? filterFMathTopicsByClass(allSubjectTopics, cls.id)
                : isChem
                  ? filterChemTopicsByClass(allSubjectTopics, cls.id)
                  : isPhys
                    ? filterPhysTopicsByClass(allSubjectTopics, cls.id)
                    : isBio
                      ? filterBioTopicsByClass(allSubjectTopics, cls.id)
                      : isAgric
                        ? filterAgricTopicsByClass(allSubjectTopics, cls.id)
                        : isGeog
                          ? filterGeogTopicsByClass(allSubjectTopics, cls.id)
                          : isEcon
                            ? filterEconTopicsByClass(allSubjectTopics, cls.id)
                            : isEng
                              ? filterEngTopicsByClass(allSubjectTopics, cls.id)
                              : isCivic
                                ? filterCivicTopicsByClass(allSubjectTopics, cls.id)
                                : isDigiTech
                                  ? filterDigiTechTopicsByClass(allSubjectTopics, cls.id)
                                  : isDataProc
                                    ? filterDataProcTopicsByClass(allSubjectTopics, cls.id)
                                    : filterMathTopicsByClass(allSubjectTopics, cls.id);
              const clsDone = clsTopics.filter((t) => tstate(progress, t.id).boss).length;
              const isSelected = activeClass === cls.id;
              return (
                <button
                  key={cls.id}
                  type="button"
                  onClick={() => onSelectClassAndBrowse(cls.id)}
                  className={`min-h-[38px] px-3.5 rounded-xl border text-[13px] font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-[var(--acc-soft)] border-[var(--gold)] ring-1 ring-[var(--gold)]/25 text-[var(--ink)]'
                      : 'bg-[var(--bg)] border-[var(--line)] text-[var(--ink)] hover:border-[var(--acc-line)]'
                  }`}
                >
                  <span>{cls.shortLabel}</span>
                  {clsDone > 0 && (
                    <span className="text-[11.5px] font-extrabold text-[var(--green)] tabular-nums">
                      {clsDone}✓
                    </span>
                  )}
                  <Icon name="go" size={13} className="text-[var(--gold)]" />
                </button>
              );
            })}
          </div>
        </section>
      )}

      {!hasDiagnosed && (
        <div className="rounded-2xl bg-[var(--mark-soft)] border border-[var(--mark-line)] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="w-10 h-10 rounded-xl bg-[var(--hero-badge)] text-[#141C33] flex items-center justify-center shrink-0">
              <Icon name="target" size={20} />
            </span>
            <div>
              <div className="font-[var(--display)] font-bold text-[16px] text-[var(--ink)]">
                Skip what you already know
              </div>
              <div className="text-[14px] text-[var(--dim)]">
                Take a quick 3-minute check so we fast-track topics you’ve already mastered.
              </div>
            </div>
          </div>
          <button type="button" onClick={onStartDiagnostic} className="btn-tactile paper shrink-0 whitespace-nowrap">
            <span>Quick placement check</span>
            <Icon name="go" size={17} />
          </button>
        </div>
      )}

      {/* Next 3 Bite-Sized Steps + 7-Day Activity */}
      <div className="grid grid-cols-1 min-[780px]:grid-cols-12 gap-5 items-start">
        <section className="min-[780px]:col-span-7 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="h20 text-[var(--ink)]">Up next for you</h2>
              <p className="text-[12.5px] text-[var(--dim)]">
                Just 3 short topics queued — take them one at a time
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenTopicsMap}
              className="group text-[13.5px] font-bold text-[var(--gold)] hover:underline flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Guided path</span>
              <Icon name="go" size={15} className="transition-transform duration-150 group-hover:translate-x-1" />
            </button>
          </div>
          <div className="stagger-grid flex flex-col gap-2.5">
            {focus.map((topic) => {
              const score = mpct(progress, topic.id);
              const status = tstatus(progress, topic.id);
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => onOpenTopic(topic.id)}
                  className="study-card rtc-card text-left rounded-2xl hover:border-[var(--acc-line)] p-4 flex items-center gap-3.5 cursor-pointer"
                >
                  <MiniRing value={score} size={46} />
                  <div className="min-w-0 flex-1">
                    <div className="text-[12px] font-semibold text-[var(--dim)] truncate">
                      {topic.sec} · ~8 min
                    </div>
                    <div className="font-[var(--display)] font-bold text-[15.5px] text-[var(--ink)] truncate">
                      {topic.name}
                    </div>
                    <div className="text-[12px] font-semibold text-[var(--gold)] mt-0.5">{status}</div>
                  </div>
                  <Icon name="go" size={16} className="text-[var(--dim)] shrink-0 ul-arrow" />
                </button>
              );
            })}
          </div>
        </section>

        <section className="min-[780px]:col-span-5 rtc-card rounded-2xl p-5 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="h18 text-[var(--ink)]">Last 7 days</h2>
            <span className="text-[12px] font-semibold text-[var(--dim)]">Questions answered</span>
          </div>
          <ActivityBars act={progress.act} />
        </section>
      </div>
            </LayoutGroup>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
