import React, { useEffect, useMemo, useState } from 'react';
import type { ExamTrack, MasteryThemeId, SubjectId, ThemeAppearanceMode } from '../../types';
import { MASTERY_THEMES, getThemePreview } from '../../data/masteryThemes';
import {
  getSaturdayCbtCampaign,
  rankDailyCbtParticipants,
  type DailyCbtParticipantEntry,
} from '../../utils/examTrackLogic';
import {
  FALLBACK_SATURDAY_COHORT_ENTRIES,
  HERO_QUICK_CHALLENGE,
  LIVE_TRAP_CHALLENGES,
  UNIVERSITY_COURSE_PRESETS,
  buildConnectedStudyRoadmap,
  buildTitrationCurvePolyline,
  computeAdmissionCompassPlan,
  computeCompassConstructionState,
  computeLensOpticsState,
  computeWebsiteTitrationState,
  evaluateHeroQuickChallenge,
  evaluateWebsiteTrapAttempt,
  type ConnectedStudyMissionSlot,
  type FeaturedWebsiteTeacher,
  type UniversityCourseId,
  type WebsiteOnboardingPreset,
} from '../../utils/websiteContentLogic';
import { AnimatedNumber } from '../AnimatedNumber';
import { Icon } from '../Icons';
import {
  LiquidCapsuleBar,
  SmoothCollapse,
  SmoothProgressBar,
  SmoothViewSwitch,
  SubjectHeroIllustration,
} from '../ULessonMotion';
import bioWorldArt from '../../assets/images/world_biology_living_1795581351630.jpg';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'] as const;

export function InteractiveTrapArena({
  selectedTrack,
  onStartWithSubject,
  onPracticeSubjectLive,
}: {
  selectedTrack: ExamTrack;
  onStartWithSubject: (subj: SubjectId) => void;
  onPracticeSubjectLive?: (subj: SubjectId) => void;
}) {
  const [challengeId, setChallengeId] = useState<string>(LIVE_TRAP_CHALLENGES[0].id);
  const [pickedIdx, setPickedIdx] = useState<number | null>(null);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [elapsedSec, setElapsedSec] = useState<number>(0);
  const [showWaecRubric, setShowWaecRubric] = useState<boolean>(selectedTrack === 'waec');
  const [solvedIds, setSolvedIds] = useState<string[]>([]);

  const challengeIndex = useMemo(
    () => Math.max(0, LIVE_TRAP_CHALLENGES.findIndex((c) => c.id === challengeId)),
    [challengeId]
  );
  const challenge = LIVE_TRAP_CHALLENGES[challengeIndex] || LIVE_TRAP_CHALLENGES[0];

  useEffect(() => {
    if (selectedTrack === 'waec') {
      setShowWaecRubric(true);
    }
  }, [selectedTrack]);

  useEffect(() => {
    if (!timerActive || pickedIdx !== null) return;
    const id = window.setInterval(() => {
      setElapsedSec((prev) => {
        if (prev >= 60) {
          setTimerActive(false);
          return 60;
        }
        return prev + 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [timerActive, pickedIdx]);

  const selectChallenge = (nextId: string) => {
    setChallengeId(nextId);
    setPickedIdx(null);
    setElapsedSec(0);
    setTimerActive(false);
  };

  const handlePickOption = (idx: number) => {
    if (pickedIdx !== null) return;
    const effectiveSec = timerActive ? Math.max(1, elapsedSec) : 18;
    setElapsedSec(effectiveSec);
    setPickedIdx(idx);
    setTimerActive(false);
    if (idx === challenge.correctIdx) {
      setSolvedIds((prev) => (prev.includes(challenge.id) ? prev : [...prev, challenge.id]));
    }
  };

  const handleNextChallenge = () => {
    const next = LIVE_TRAP_CHALLENGES[(challengeIndex + 1) % LIVE_TRAP_CHALLENGES.length];
    selectChallenge(next.id);
  };

  const verdict =
    pickedIdx !== null
      ? evaluateWebsiteTrapAttempt(challenge, pickedIdx, elapsedSec || 18)
      : null;

  const remainingBudget = Math.max(0, challenge.timeBudgetSec - elapsedSec);

  const handleArenaKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const tag = (e.target as HTMLElement | null)?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    const upper = e.key.toUpperCase();
    if (pickedIdx === null && (upper === 'A' || upper === 'B' || upper === 'C' || upper === 'D')) {
      e.preventDefault();
      handlePickOption(OPTION_LETTERS.indexOf(upper));
    } else if (pickedIdx !== null && upper === 'N') {
      e.preventDefault();
      handleNextChallenge();
    }
  };

  return (
    <div
      tabIndex={0}
      onKeyDown={handleArenaKeyDown}
      aria-label="Interactive JAMB twin-option trap sandbox"
      className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5 sm:p-7 flex flex-col gap-6 focus-visible:outline-2 focus-visible:outline-[var(--gold)]"
    >
      <div className="flex flex-col gap-3.5 pb-5 border-b border-[var(--line)]">
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center justify-between gap-2 text-[12.5px] font-bold text-[var(--gold)]">
            <span>Interactive Proof Sandbox</span>
            <span className="eyak-mono text-[12px] text-[var(--dim)]">
              {solvedIds.length} of {LIVE_TRAP_CHALLENGES.length} traps cleared
            </span>
          </div>
          <h3 className="eyak-display font-extrabold text-[20px] sm:text-[23px] text-[var(--ink)]">
            Can you spot the JAMB twin-option trap before the clock runs out?
          </h3>
        </div>

        <LiquidCapsuleBar
          items={LIVE_TRAP_CHALLENGES.map((item) => ({
            id: item.id,
            label: item.tabLabel,
          }))}
          value={challenge.id}
          onChange={selectChallenge}
          ariaLabel="Choose trap challenge subject"
          size="sm"
          className="self-start"
        />
      </div>

      {/* Two-Zone Sandbox Layout: Left Interactive Question Stage (7 cols) / Right Coach & Rubric Deck (5 cols) */}
      <SmoothViewSwitch viewKey={challenge.id}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3 text-[12.5px]">
              <div className="flex flex-wrap items-center gap-2 font-bold text-[var(--dim)]">
                <span className="text-[var(--ink)]">{challenge.subjectLabel}</span>
                <span aria-hidden="true">·</span>
                <span>Set by {challenge.tutorName}</span>
              </div>

              <div className="flex items-center gap-3">
                {pickedIdx === null && (
                  <button
                    type="button"
                    onClick={() => {
                      if (timerActive) {
                        setTimerActive(false);
                        setElapsedSec(0);
                      } else {
                        setElapsedSec(0);
                        setTimerActive(true);
                      }
                    }}
                    className="min-h-[34px] px-3 py-1 rounded-lg border border-[var(--line)] bg-[var(--bg)] text-[12px] font-bold text-[var(--ink)] hover:border-[var(--acc-line)] transition-colors cursor-pointer whitespace-nowrap tabular-nums"
                  >
                    {timerActive
                      ? `Timer running · ${remainingBudget}s left`
                      : `Start ${challenge.timeBudgetSec}s tough timer`}
                  </button>
                )}
                {pickedIdx !== null && (
                  <button
                    type="button"
                    onClick={() => {
                      setPickedIdx(null);
                      setElapsedSec(0);
                      setTimerActive(false);
                    }}
                    className="min-h-[34px] px-3 py-1 rounded-lg border border-[var(--line)] bg-[var(--bg)] text-[12px] font-bold text-[var(--dim)] hover:text-[var(--ink)] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Retry question
                  </button>
                )}
              </div>
            </div>

            {timerActive && pickedIdx === null && (
              <SmoothProgressBar
                value={remainingBudget}
                max={challenge.timeBudgetSec}
                tone={remainingBudget <= 8 ? 'gold' : 'indigo'}
                heightClass="h-2"
                ariaLabel="Remaining seconds in tough JAMB timer"
              />
            )}

            <p className="eyak-display font-bold text-[17px] sm:text-[18.5px] leading-snug text-[var(--ink)]">
              {challenge.stem}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {challenge.options.map((optText, idx) => {
                const isPicked = pickedIdx === idx;
                const isCorrect = idx === challenge.correctIdx;
                const isTwinTrap = idx === challenge.twinTrapIdx;
                const answered = pickedIdx !== null;

                let stateCls =
                  'bg-[var(--bg)]/70 border-[var(--line)] text-[var(--ink)] hover:border-[var(--acc-line)] eyak-tactile-card';
                let statusTag: string | null = null;

                if (answered) {
                  if (isCorrect) {
                    stateCls = 'bg-[var(--ok-soft)] border-[var(--ok-line)] text-[var(--ink)]';
                    statusTag = '✓ Correct';
                  } else if (isPicked && isTwinTrap) {
                    stateCls = 'bg-[var(--bad-soft)] border-[var(--bad-line)] text-[var(--ink)]';
                    statusTag = '▲ Twin Trap';
                  } else if (isPicked) {
                    stateCls = 'bg-[var(--bad-soft)] border-[var(--bad-line)] text-[var(--ink)]';
                    statusTag = '✕ Missed';
                  } else if (isTwinTrap) {
                    stateCls = 'bg-[var(--peach-bg)]/55 border-[var(--mark-line)] text-[var(--ink)]';
                    statusTag = '▲ Look-Alike Trap';
                  } else {
                    stateCls = 'bg-[var(--bg)]/40 border-[var(--line)] text-[var(--dim)] opacity-75';
                  }
                }

                return (
                  <button
                    key={OPTION_LETTERS[idx]}
                    type="button"
                    disabled={answered}
                    onClick={() => handlePickOption(idx)}
                    className={`min-h-[52px] px-4 py-3 rounded-xl border text-left flex items-center justify-between gap-3 transition-colors duration-150 ${
                      answered ? 'cursor-default' : 'cursor-pointer'
                    } ${stateCls}`}
                  >
                    <span className="inline-flex items-center gap-2.5 min-w-0">
                      <span className="eyak-mono font-bold text-[13px] text-[var(--gold)] shrink-0">
                        {OPTION_LETTERS[idx]}.
                      </span>
                      <span className="font-semibold text-[14.5px] leading-snug">{optText}</span>
                    </span>
                    {statusTag && (
                      <span className="text-[11.5px] font-bold whitespace-nowrap shrink-0">
                        {statusTag}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Zone: Live Diagnostic Feedback & WAEC Paper 2 Marking Rubric */}
          <div className="lg:col-span-5 lg:pl-7 lg:border-l border-t lg:border-t-0 border-[var(--line)] pt-5 lg:pt-0 flex flex-col justify-between gap-4">
            {verdict === null ? (
              <div className="flex flex-col gap-3">
                <div className="text-[12.5px] font-bold text-[var(--gold)]">
                  Why Easy Learn trains with look-alike options
                </div>
                <p className="text-[14px] leading-relaxed text-[var(--dim)]">
                  Tap an option A–D on the left to test yourself. Two of the choices look nearly identical at first glance — Easy Learn’s question engine deliberately pairs them so you spot examiner traps immediately on exam day.
                </p>
                <div className="pt-3 border-t border-[var(--line)] flex flex-wrap items-center gap-2 text-[12.5px] font-semibold text-[var(--dim)] tabular-nums">
                  <span>Target speed: {challenge.timeBudgetSec}s</span>
                  <span aria-hidden="true">·</span>
                  <span>Official UTME average: 40s</span>
                  <span aria-hidden="true">·</span>
                  <span>Keys A–D supported</span>
                </div>
              </div>
            ) : (
              <SmoothCollapse open={true}>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-2 text-[12px] font-bold tabular-nums">
                    <span className={verdict.isCorrect ? 'text-[var(--green)]' : 'text-[var(--coral-ink)]'}>
                      {verdict.isCorrect ? '✓ Passed Challenge' : '▲ Trap Diagnosed'}
                    </span>
                    <span aria-hidden="true" className="text-[var(--dim)]">·</span>
                    <span className="text-[var(--dim)]">{verdict.paceVerdict}</span>
                  </div>
                  <div className="eyak-display font-bold text-[15.5px] text-[var(--ink)] leading-snug">
                    {verdict.feedbackHeadline}
                  </div>
                  <p className="text-[13.5px] leading-relaxed text-[var(--dim)]">
                    {verdict.selectedExplanation}
                  </p>
                  <p className="text-[13px] leading-relaxed font-semibold text-[var(--green)]">
                    Fast rule: {challenge.winningStep}
                  </p>
                </div>
              </SmoothCollapse>
            )}

            <div className="pt-3 border-t border-[var(--line)] flex flex-col gap-2.5">
              <button
                type="button"
                aria-expanded={showWaecRubric}
                onClick={() => setShowWaecRubric((prev) => !prev)}
                className="w-full flex items-center justify-between gap-2 text-left text-[13px] font-bold text-[var(--ink)] hover:text-[var(--gold)] transition-colors cursor-pointer"
              >
                <span>WAEC Paper 2 Method-Mark Breakdown (M1 · M1 · A1)</span>
                <span aria-hidden="true" className="text-[var(--gold)] font-extrabold text-[16px]">
                  {showWaecRubric ? '−' : '+'}
                </span>
              </button>

              <SmoothCollapse open={showWaecRubric}>
                <div className="pt-1.5 flex flex-col gap-1.5 text-[12.5px] text-[var(--dim)]">
                  {challenge.waecRubricSteps.map((step, i) => (
                    <div key={`${challenge.id}-m-${i}`} className="flex items-baseline gap-2">
                      <span className="eyak-mono font-bold text-[var(--gold)] shrink-0">
                        [{step.code}]
                      </span>
                      <span>{step.detail}</span>
                    </div>
                  ))}
                </div>
              </SmoothCollapse>

              <div className="pt-3 border-t border-[var(--line)] flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleNextChallenge}
                  className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-[var(--acc-soft)] text-[var(--gold)] eyak-display font-bold text-[13px] hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
                >
                  Next trap question →
                </button>
                <div className="flex flex-wrap items-center gap-3">
                  {onPracticeSubjectLive && (
                    <button
                      type="button"
                      onClick={() => onPracticeSubjectLive(challenge.subj)}
                      className="text-[13px] font-bold text-[var(--gold)] hover:underline underline-offset-4 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Launch live {challenge.tabLabel} quiz →
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onStartWithSubject(challenge.subj)}
                    className="text-[13px] font-bold text-[var(--ink)] hover:text-[var(--gold)] underline underline-offset-4 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Enroll with {challenge.tabLabel}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SmoothViewSwitch>
    </div>
  );
}

export function AdmissionCompassStage({
  courseId,
  onChangeCourse,
  practiceScore,
  onChangePracticeScore,
  selectedTrack,
  onLaunchCoursePreset,
  onPreviewCourseDashboard,
  onLaunchMissionSlot,
  onAuditionCourseTeachers,
}: {
  courseId: UniversityCourseId;
  onChangeCourse: (id: UniversityCourseId) => void;
  practiceScore: number;
  onChangePracticeScore: (nextScore: number) => void;
  selectedTrack: ExamTrack;
  onLaunchCoursePreset: (track: ExamTrack, preset: WebsiteOnboardingPreset) => void;
  onPreviewCourseDashboard?: (track: ExamTrack, preset: WebsiteOnboardingPreset) => void;
  onLaunchMissionSlot?: (
    slot: ConnectedStudyMissionSlot,
    preset: WebsiteOnboardingPreset
  ) => void;
  onAuditionCourseTeachers: (courseId: UniversityCourseId) => void;
}) {
  const plan = useMemo(
    () => computeAdmissionCompassPlan(courseId, practiceScore),
    [courseId, practiceScore]
  );

  const roadmapSlots = useMemo(
    () => buildConnectedStudyRoadmap(selectedTrack, courseId, practiceScore),
    [selectedTrack, courseId, practiceScore]
  );

  const currentCoursePreset = useMemo<WebsiteOnboardingPreset>(
    () => ({
      courseTitle: plan.course.title,
      jambQuartet: [...plan.course.jambQuartet],
      enrolledSubjs: Array.from(
        new Set([...plan.course.jambQuartet, ...plan.course.waecKeySubjects])
      ),
      campusGoal: `${plan.course.campusesLine.split('·')[0].trim()} · ${plan.course.shortTab}`,
      targetPct: plan.targetAccuracyPct,
      practiceScore400: plan.currentScore400,
    }),
    [plan]
  );

  const arcDashOffset = useMemo(() => {
    const circumference = 251.2; // π * r (r = 80)
    const ratio = Math.max(0.08, Math.min(1, plan.currentScore400 / 400));
    return Number((circumference * (1 - ratio)).toFixed(1));
  }, [plan.currentScore400]);

  const targetMarkerAngleRad = useMemo(() => {
    const ratio = Math.max(0.1, Math.min(0.96, plan.course.cutOffTarget400 / 400));
    return Math.PI * (1 - ratio);
  }, [plan.course.cutOffTarget400]);

  const markerX = Number((100 + 80 * Math.cos(targetMarkerAngleRad)).toFixed(1));
  const markerY = Number((96 - 80 * Math.sin(targetMarkerAngleRad)).toFixed(1));

  return (
    <section
      id="admission-compass"
      className="scroll-mt-16 border-b border-[var(--line)] bg-[var(--bg)]"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 flex flex-col gap-10">
        <div className="flex flex-col gap-2.5 max-w-[70ch]">
          <span className="eyak-mono text-[12.5px] font-semibold text-[var(--gold)]">
            02 · Nigerian University Admission Compass
          </span>
          <h2 className="eyak-display font-extrabold text-[26px] sm:text-[34px] leading-[1.15] tracking-tight text-[var(--ink)] text-balance">
            Pick your dream degree. Load your exact 4 JAMB subjects, WAEC credits, and cut-off target in one tap.
          </h2>
          <p className="text-[15.5px] text-[var(--dim)] leading-relaxed">
            Slide across degree courses or adjust your current practice score to preview your merit cut-off gap and the 4 personal voice teachers waiting for you inside Easy Learn.
          </p>
        </div>

        <LiquidCapsuleBar
          items={UNIVERSITY_COURSE_PRESETS.map((c) => ({
            id: c.id,
            label: c.shortTab,
          }))}
          value={courseId}
          onChange={onChangeCourse}
          ariaLabel="Choose Nigerian university course"
          size="md"
        />

        <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Interactive Stage: Animated Cut-Off Arc + Subject Vector Canvas + Labeled Slider */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            <div className="rounded-xl bg-gradient-to-br from-[var(--hero-start)] via-[var(--hero-mid)] to-[var(--hero-end)] p-5 text-white flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3 text-[12px] text-white/85 font-semibold">
                <span>{plan.course.facultyLine}</span>
                <span className="tabular-nums font-bold text-[var(--hero-badge)]">
                  Cut-off target: {plan.course.cutOffTarget400}/400
                </span>
              </div>

              <div className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-7 flex flex-col items-center">
                  <svg
                    viewBox="0 0 200 112"
                    className="w-full max-w-[210px] overflow-visible"
                    role="img"
                    aria-label={`Practice score ${plan.currentScore400} out of 400 compared to ${plan.course.cutOffTarget400} merit target`}
                  >
                    <path
                      d="M 20 96 A 80 80 0 0 1 180 96"
                      fill="none"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="12"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 20 96 A 80 80 0 0 1 180 96"
                      fill="none"
                      stroke="#FFD84D"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray="251.2"
                      strokeDashoffset={arcDashOffset}
                      className="transition-[stroke-dashoffset] duration-300 ease-out"
                    />
                    <circle
                      cx={markerX}
                      cy={markerY}
                      r="5.5"
                      fill="#3BDC86"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />
                    <text
                      x="100"
                      y="76"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="28"
                      fontWeight="800"
                    >
                      {plan.currentScore400}
                    </text>
                    <text
                      x="100"
                      y="95"
                      textAnchor="middle"
                      fill="rgba(255,255,255,0.82)"
                      fontSize="11"
                      fontWeight="700"
                    >
                      out of 400 UTME scale
                    </text>
                  </svg>
                </div>

                <div className="col-span-5">
                  <SmoothViewSwitch viewKey={plan.course.visualSubj}>
                    <SubjectHeroIllustration
                      subj={plan.course.visualSubj}
                      className="w-full h-[96px]"
                    />
                  </SmoothViewSwitch>
                </div>
              </div>
            </div>

            {/* Explicitly Labeled Interactive Score Slider (per 6_education_simulations.md §5) */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="eyak-mock-score-slider"
                  className="text-[13.5px] font-bold text-[var(--ink)]"
                >
                  Current practice score
                </label>
                <span className="eyak-mono font-bold text-[14px] text-[var(--gold)] tabular-nums">
                  {plan.currentScore400} / 400
                </span>
              </div>

              <input
                id="eyak-mock-score-slider"
                type="range"
                min={140}
                max={370}
                step={5}
                value={plan.currentScore400}
                onChange={(e) => onChangePracticeScore(Number(e.target.value))}
                className="w-full h-2.5 rounded-lg accent-[var(--gold)] cursor-pointer"
              />

              <div className="flex items-center justify-between text-[11.5px] font-semibold text-[var(--dim)] tabular-nums">
                <span>140 / 400</span>
                <span>220 / 400</span>
                <span>280 / 400</span>
                <span>320 / 400</span>
                <span>370 / 400</span>
              </div>
            </div>
          </div>

          {/* Right Course Blueprint: 4 JAMB Subjects + WAEC Credits + Direct App Handoff */}
          <div className="lg:col-span-7 lg:pl-8 lg:border-l border-t lg:border-t-0 border-[var(--line)] pt-6 lg:pt-0 flex flex-col justify-between gap-6">
            <SmoothViewSwitch viewKey={plan.course.id}>
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-2 text-[12.5px] font-bold">
                    <span
                      className={
                        plan.statusKind === 'exceeding'
                          ? 'text-[var(--green)]'
                          : 'text-[var(--gold)]'
                      }
                    >
                      {plan.statusKind === 'exceeding' ? '✓ Merit Zone Reached' : '▲ Active Cut-Off Plan'}
                    </span>
                    <span aria-hidden="true" className="text-[var(--dim)]">·</span>
                    <span className="text-[var(--dim)]">{plan.course.campusesLine}</span>
                  </div>

                  <h3 className="eyak-display font-extrabold text-[23px] sm:text-[27px] text-[var(--ink)] leading-snug">
                    {plan.course.title}
                  </h3>

                  <p className="text-[14px] font-semibold text-[var(--dim)] tabular-nums">
                    {plan.statusBadgeLabel} · Recommended pace:{' '}
                    <AnimatedNumber value={plan.weeklyTopicsTarget} /> topics/week + Saturday CBT target{' '}
                    <AnimatedNumber value={plan.saturdayCbtGoal} suffix="/400" />
                  </p>
                </div>

                <div className="pt-4 border-t border-[var(--line)] flex flex-col gap-3">
                  <div className="text-[12.5px] font-bold text-[var(--ink)]">
                    Official 4 JAMB UTME Subject Quartet &amp; Assigned Voice Teachers
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {plan.jambSubjectDetails.map((subj, idx) => (
                      <div
                        key={subj.id}
                        className="rounded-xl border border-[var(--line)] bg-[var(--bg)]/65 px-3.5 py-2.5 flex flex-col gap-0.5"
                      >
                        <div className="eyak-display font-bold text-[14px] text-[var(--ink)] leading-snug">
                          0{idx + 1}. {subj.name}
                        </div>
                        <div className="flex items-center justify-between gap-2 text-[12px] text-[var(--dim)]">
                          <span className="truncate">{subj.tutorName}</span>
                          <span className="font-bold text-[var(--gold)] shrink-0">
                            {idx === 0 ? 'Compulsory' : 'UTME Core'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-[13px] text-[var(--dim)] flex flex-wrap items-center gap-1.5">
                  <strong className="text-[var(--ink)]">Required WAEC C6–A1 credits:</strong>
                  <span>
                    {plan.waecCreditDetails.map((w) => w.shortName).join(' · ')}
                  </span>
                </div>
              </div>
            </SmoothViewSwitch>

            <div className="pt-4 border-t border-[var(--line)] flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => onAuditionCourseTeachers(plan.course.id)}
                  className="min-h-[42px] px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--bg)] text-[13px] font-bold text-[var(--ink)] hover:border-[var(--acc-line)] transition-colors cursor-pointer whitespace-nowrap"
                >
                  Hear my 4 {plan.course.shortTab} teachers ↓
                </button>
                {onPreviewCourseDashboard && (
                  <button
                    type="button"
                    onClick={() =>
                      onPreviewCourseDashboard(
                        selectedTrack === 'waec' ? 'both' : selectedTrack,
                        currentCoursePreset
                      )
                    }
                    className="min-h-[42px] px-3.5 py-2 rounded-xl bg-[var(--acc-soft)] text-[var(--gold)] text-[13px] font-bold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
                  >
                    Preview {plan.course.shortTab} Dashboard →
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() =>
                  onLaunchCoursePreset(
                    selectedTrack === 'waec' ? 'both' : selectedTrack,
                    currentCoursePreset
                  )
                }
                className="eyak-cta-sheen min-h-[44px] px-5 py-2.5 rounded-xl bg-[var(--gold)] text-[var(--on-acc)] eyak-display font-bold text-[14px] inline-flex items-center gap-2 hover:opacity-95 transition-opacity cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Load My {plan.course.shortTab} 4-Subject Quartet</span>
                <Icon name="go" size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Connected 4-Slot Daily Study Queue (bridges Exam Track + Course + Voice Teachers + Live App Screens) */}
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5 sm:p-6 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-[var(--line)]">
            <div className="flex flex-col gap-0.5">
              <div className="flex flex-wrap items-center gap-2 text-[12px] font-bold text-[var(--gold)]">
                <span>Connected Daily Study Queue</span>
                <span aria-hidden="true" className="text-[var(--dim)]">·</span>
                <span className="text-[var(--dim)]">
                  Synced to {plan.course.shortTab} &amp;{' '}
                  {selectedTrack === 'jamb'
                    ? 'JAMB UTME Only'
                    : selectedTrack === 'waec'
                      ? 'WAEC / SSCE Only'
                      : '70% JAMB · 30% WAEC'}
                </span>
              </div>
              <h3 className="eyak-display font-extrabold text-[18px] sm:text-[19.5px] text-[var(--ink)]">
                Click any mission below to jump straight into that live classroom, drill, or practical bench
              </h3>
            </div>
            <span className="text-[12.5px] font-semibold text-[var(--dim)] tabular-nums">
              Est. daily block: {roadmapSlots.reduce((acc, s) => acc + s.estimatedMinutes, 0)} mins
            </span>
          </div>

          <SmoothViewSwitch viewKey={`${selectedTrack}-${courseId}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {roadmapSlots.map((slot) => (
                <button
                  key={`${slot.slotNumber}-${slot.subj}-${slot.activityKind}`}
                  type="button"
                  onClick={() => onLaunchMissionSlot?.(slot, currentCoursePreset)}
                  className="eyak-tactile-card rounded-xl border border-[var(--line)] bg-[var(--bg)]/65 p-4 text-left flex flex-col justify-between gap-3 hover:border-[var(--acc-line)] cursor-pointer"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-2 text-[11.5px] font-bold tabular-nums">
                      <span className="text-[var(--gold)]">
                        Slot 0{slot.slotNumber} · {slot.subjectShort}
                      </span>
                      <span className="text-[var(--dim)]">{slot.estimatedMinutes}m</span>
                    </div>
                    <div className="eyak-display font-bold text-[14.5px] text-[var(--ink)] leading-snug">
                      {slot.missionTitle}
                    </div>
                    <div className="text-[12px] text-[var(--dim)]">
                      {slot.tutorName} · {slot.examRoleLabel}
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-[var(--line)] flex items-center justify-between text-[12.5px] font-bold text-[var(--gold)]">
                    <span>{slot.actionLabel}</span>
                    <span aria-hidden="true">→</span>
                  </div>
                </button>
              ))}
            </div>
          </SmoothViewSwitch>
        </div>
      </div>
    </section>
  );
}

export function SaturdayLiveCohortPanel({
  onJoinSaturdayCbt,
}: {
  onJoinSaturdayCbt: () => void;
}) {
  const [liveEntries, setLiveEntries] = useState<readonly DailyCbtParticipantEntry[]>(
    FALLBACK_SATURDAY_COHORT_ENTRIES
  );
  const [usingLiveCloud, setUsingLiveCloud] = useState<boolean>(false);

  const campaign = useMemo(() => getSaturdayCbtCampaign(Date.now()), []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/cloud/cbt-daily?mode=jamb');
        if (!res.ok) return;
        const data = await res.json().catch(() => null);
        const rows = Array.isArray(data?.entries) ? (data.entries as DailyCbtParticipantEntry[]) : [];
        if (!cancelled && rows.length > 0) {
          const merged = [...rows, ...FALLBACK_SATURDAY_COHORT_ENTRIES];
          setLiveEntries(merged);
          setUsingLiveCloud(true);
        }
      } catch {
        /* keep resilient deterministic snapshot */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const rankedBoard = useMemo(
    () => rankDailyCbtParticipants(liveEntries, '', 'jamb', 75).entries.slice(0, 4),
    [liveEntries]
  );

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5 sm:p-6 flex flex-col justify-between gap-5">
      <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-[var(--line)]">
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2 text-[12.5px] font-bold text-[var(--gold)] tabular-nums">
            <span>{campaign.headline}</span>
            <span aria-hidden="true" className="text-[var(--dim)]">·</span>
            <span className="text-[var(--dim)]">
              {usingLiveCloud ? 'Live Today Cohort' : 'Recent Saturday Pacesetters'}
            </span>
          </div>
          <h3 className="eyak-display font-extrabold text-[19px] sm:text-[21px] text-[var(--ink)]">
            Same-Day /400 National CBT Standings Preview
          </h3>
        </div>

        <button
          type="button"
          onClick={onJoinSaturdayCbt}
          className="min-h-[38px] px-4 py-2 rounded-xl bg-[var(--acc-soft)] text-[var(--gold)] eyak-display font-bold text-[13px] hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap shrink-0"
        >
          {campaign.ctaLabel} →
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {rankedBoard.map((row) => (
          <div
            key={row.participantKey}
            className="rounded-xl border border-[var(--line)] bg-[var(--bg)]/60 p-3.5 flex flex-col gap-2"
          >
            <div className="flex items-center justify-between gap-2 text-[12px] font-bold tabular-nums">
              <span className="text-[var(--gold)]">Rank #{row.rank}</span>
              <span className="text-[var(--ink)] eyak-mono">{row.scaledScore}/400</span>
            </div>
            <div className="eyak-display font-bold text-[14.5px] text-[var(--ink)] truncate">
              {row.displayName}
            </div>
            <SmoothProgressBar
              value={row.scaledScore}
              max={400}
              tone={row.rank === 1 ? 'emerald' : 'indigo'}
              heightClass="h-2"
            />
            <div className="text-[11.5px] text-[var(--dim)] flex items-center justify-between gap-2 tabular-nums">
              <span className="truncate">{row.campusGoal}</span>
              <span className="shrink-0">{row.accuracyPct}% acc</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const TITRATION_CURVE_POINTS = buildTitrationCurvePolyline();

const TITRATION_PRESETS = [
  { label: '0.0 cm³ Start', vol: 0 },
  { label: '24.5 cm³ Near End', vol: 24.5 },
  { label: '25.0 cm³ End-Point', vol: 25.0 },
  { label: '30.0 cm³ Acid Excess', vol: 30.0 },
] as const;

const COMPASS_PRESETS = [
  { label: '30° Bisected', deg: 30 },
  { label: '45° Bisected', deg: 45 },
  { label: '60° Equilateral', deg: 60 },
  { label: '90° Right Angle', deg: 90 },
  { label: '120° Double Arc', deg: 120 },
] as const;

const OPTICS_PRESETS = [
  { label: '7.0 cm Magnifier', u: 7.0 },
  { label: '10.0 cm At Focus F', u: 10.0 },
  { label: '15.0 cm Projector', u: 15.0 },
  { label: '20.0 cm Symmetric 2F', u: 20.0 },
  { label: '30.0 cm Camera', u: 30.0 },
] as const;

export function InteractiveTitrationMicroLab({
  onExploreLabs,
  onLaunchSpecificLab,
  onOpenTheoryCoach,
  onOpenPeerDuel,
  onOpenStemSandboxes,
}: {
  onExploreLabs: () => void;
  onLaunchSpecificLab?: (subj: 'chem' | 'maths' | 'phys', labId: string) => void;
  onOpenTheoryCoach?: () => void;
  onOpenPeerDuel?: () => void;
  onOpenStemSandboxes?: () => void;
}) {
  const [benchMode, setBenchMode] = useState<'titration' | 'compass' | 'optics'>('titration');
  const [acidVol, setAcidVol] = useState<number>(12.5);
  const [compassDeg, setCompassDeg] = useState<number>(60);
  const [objectDistCm, setObjectDistCm] = useState<number>(15.0);

  const sim = useMemo(() => computeWebsiteTitrationState(acidVol), [acidVol]);
  const geo = useMemo(() => computeCompassConstructionState(compassDeg), [compassDeg]);
  const optics = useMemo(() => computeLensOpticsState(objectDistCm, 10), [objectDistCm]);

  const buretteFillHeight = Math.round(sim.buretteLiquidRatio * 96);
  const buretteFillY = 22 + (96 - buretteFillHeight);

  const statusToneCls =
    sim.phase === 'endpoint'
      ? 'text-[var(--green)]'
      : sim.phase === 'acidic'
        ? 'text-[var(--warn-ink)]'
        : 'text-[var(--coral-ink)]';

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5 sm:p-7 flex flex-col gap-6">
      <div className="flex flex-col gap-3.5 pb-4 border-b border-[var(--line)]">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2 text-[12.5px] font-bold text-[var(--gold)]">
              <span>Interactive Practical Studio</span>
              <span aria-hidden="true" className="text-[var(--dim)]">·</span>
              <span className="text-[var(--dim)]">
                {benchMode === 'titration'
                  ? 'WAEC Paper 3 Volumetric Titration'
                  : benchMode === 'compass'
                    ? 'WAEC Paper 2 Ruler & Compass Construction'
                    : 'WAEC Paper 3 & JAMB Thin-Lens Ray Optics'}
              </span>
            </div>
            <h3 className="eyak-display font-extrabold text-[20px] sm:text-[22px] text-[var(--ink)]">
              {benchMode === 'titration'
                ? 'Slide the burette tap to neutralize 25.0 cm³ NaOH with diprotic H₂SO₄'
                : benchMode === 'compass'
                  ? 'Construct exact WAEC angles, locus bisectors, and three-figure bearings'
                  : 'Slide object distance u along the optical bench to trace real & virtual images'}
            </h3>
          </div>

          <button
            type="button"
            onClick={() => {
              if (onLaunchSpecificLab) {
                if (benchMode === 'titration') onLaunchSpecificLab('chem', 'c-titration');
                else if (benchMode === 'compass') onLaunchSpecificLab('maths', 'angle-60');
                else onLaunchSpecificLab('phys', 'p-lens-uv');
              } else {
                onExploreLabs();
              }
            }}
            className="self-start min-h-[38px] px-4 py-2 rounded-xl bg-[var(--acc-soft)] text-[var(--gold)] eyak-display font-bold text-[13px] hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap shrink-0"
          >
            {benchMode === 'titration'
              ? 'Launch Full Titration Lab →'
              : benchMode === 'compass'
                ? 'Launch Full Compass Lab →'
                : 'Launch Full Optics Lab →'}
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <LiquidCapsuleBar
            items={[
              { id: 'titration', label: 'Chemistry Titration' },
              { id: 'compass', label: 'Maths Compass & Locus' },
              { id: 'optics', label: 'Physics Ray Optics' },
            ]}
            value={benchMode}
            onChange={setBenchMode}
            ariaLabel="Switch interactive practical bench"
            size="sm"
          />
          <span className="text-[12px] font-semibold text-[var(--dim)] tabular-nums">
            3 live practical benches · Chemistry · Maths · Physics
          </span>
        </div>
      </div>

      <SmoothViewSwitch viewKey={benchMode}>
        {benchMode === 'titration' ? (
          /* Two-Zone Educational Simulation: Left Interactive Apparatus & pH Curve / Right Control & Concept Deck */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-center">
            <div className="lg:col-span-7 rounded-xl border border-[var(--line)] bg-[var(--bg)]/70 p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
              {/* Interactive Burette & Conical Flask SVG */}
              <div className="sm:col-span-5 flex flex-col items-center">
                <svg
                  viewBox="0 0 160 226"
                  className="w-[144px] h-[204px] overflow-visible"
                  role="img"
                  aria-label={`Titration apparatus at ${sim.acidVolumeCm3.toFixed(1)} cubic centimetres added and pH ${sim.ph.toFixed(1)}`}
                >
                  {/* Retort Stand */}
                  <rect x="18" y="10" width="6" height="202" rx="3" fill="var(--dim)" opacity="0.35" />
                  <rect x="8" y="208" width="136" height="8" rx="4" fill="var(--dim)" opacity="0.35" />
                  <rect x="24" y="64" width="54" height="5" rx="2.5" fill="var(--dim)" opacity="0.45" />

                  {/* Burette Glass Cylinder */}
                  <rect
                    x="78"
                    y="16"
                    width="16"
                    height="104"
                    rx="3"
                    fill="var(--card)"
                    stroke="var(--dim)"
                    strokeWidth="1.8"
                  />
                  {/* Acid Column inside Burette */}
                  <rect
                    x="80"
                    y={buretteFillY}
                    width="12"
                    height={buretteFillHeight}
                    rx="1.5"
                    fill="#38BDF8"
                    opacity="0.72"
                    className="transition-all duration-200"
                  />
                  {/* Burette Graduation Ticks */}
                  {[32, 52, 72, 92, 110].map((y) => (
                    <line
                      key={y}
                      x1="78"
                      y1={y}
                      x2="84"
                      y2={y}
                      stroke="var(--ink)"
                      strokeOpacity="0.45"
                      strokeWidth="1.2"
                    />
                  ))}

                  {/* Stopcock Tap & Tip */}
                  <rect x="74" y="121" width="24" height="6" rx="3" fill="var(--gold)" />
                  <path d="M83 127 L89 127 L87 139 L85 139 Z" fill="var(--dim)" opacity="0.6" />

                  {/* Animated Acid Droplet */}
                  {sim.acidVolumeCm3 > 0 && sim.acidVolumeCm3 < 35 && (
                    <circle
                      cx="86"
                      cy="142"
                      r="2.6"
                      fill="#0284C7"
                      className="eyak-lab-droplet"
                    />
                  )}

                  {/* Conical Flask Liquid Fill */}
                  <path
                    d="M66 184 L106 184 L116 202 C117 205 115 207 111 207 L61 207 C57 207 55 205 56 202 Z"
                    fill={sim.flaskColorHex}
                    className="transition-colors duration-300"
                  />
                  {/* Conical Flask Glass Outline */}
                  <path
                    d="M78 156 L78 168 L55 202 C53 205 56 208 60 208 L112 208 C116 208 119 205 117 202 L94 168 L94 156 Z"
                    fill="none"
                    stroke={sim.flaskStrokeHex}
                    strokeWidth="2.2"
                    className="transition-colors duration-300"
                  />
                  <text
                    x="86"
                    y="200"
                    textAnchor="middle"
                    fill="#1E293B"
                    fontSize="9.5"
                    fontWeight="800"
                  >
                    pH {sim.ph.toFixed(1)}
                  </text>
                </svg>
              </div>

              {/* Live S-Shaped pH Titration Curve SVG */}
              <div className="sm:col-span-7 flex flex-col gap-2">
                <div className="flex items-center justify-between text-[12px] font-bold text-[var(--dim)] tabular-nums">
                  <span>Live pH Curve (0.25 M H₂SO₄ → NaOH)</span>
                  <span className="eyak-mono text-[var(--gold)]">
                    pH {sim.ph.toFixed(1)}
                  </span>
                </div>

                <svg
                  viewBox="0 0 250 154"
                  className="w-full h-auto"
                  role="img"
                  aria-label="Titration pH curve showing sharp vertical equivalence cliff at 25.0 cm³"
                >
                  {[18, 45.5, 73, 100.5, 128].map((gy) => (
                    <line
                      key={gy}
                      x1="32"
                      y1={gy}
                      x2="232"
                      y2={gy}
                      stroke="var(--line)"
                      strokeWidth="1"
                    />
                  ))}
                  <line
                    x1="174.9"
                    y1="18"
                    x2="174.9"
                    y2="128"
                    stroke="var(--green)"
                    strokeWidth="1.4"
                    strokeDasharray="4 3"
                  />
                  <line x1="32" y1="18" x2="32" y2="128" stroke="var(--dim)" strokeWidth="1.5" />
                  <line x1="32" y1="128" x2="232" y2="128" stroke="var(--dim)" strokeWidth="1.5" />

                  <polyline
                    fill="none"
                    stroke="var(--gold)"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={TITRATION_CURVE_POINTS}
                  />

                  <text x="179" y="30" fill="var(--green)" fontSize="9" fontWeight="800">
                    25.0 cm³ (pH 7)
                  </text>

                  <circle
                    cx={sim.curveMarkerX}
                    cy={sim.curveMarkerY}
                    r="6"
                    fill={sim.phase === 'endpoint' ? 'var(--green)' : 'var(--gold)'}
                    stroke="var(--card)"
                    strokeWidth="2.5"
                    className="transition-all duration-150"
                  />

                  <text x="8" y="22" fill="var(--dim)" fontSize="9.5" fontWeight="700">14</text>
                  <text x="12" y="76" fill="var(--dim)" fontSize="9.5" fontWeight="700">7</text>
                  <text x="12" y="131" fill="var(--dim)" fontSize="9.5" fontWeight="700">0</text>
                  <text x="32" y="144" fill="var(--dim)" fontSize="9" fontWeight="700">0</text>
                  <text x="166" y="144" fill="var(--green)" fontSize="9" fontWeight="800">25</text>
                  <text x="218" y="144" fill="var(--dim)" fontSize="9" fontWeight="700">35 cm³</text>
                </svg>
              </div>
            </div>

            {/* Right Control & Stoichiometry Deck */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <div className={`text-[12.5px] font-bold tabular-nums ${statusToneCls}`}>
                  {sim.statusLabel}
                </div>
                <p className="text-[13.5px] leading-relaxed text-[var(--dim)]">
                  {sim.indicatorNote}
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--line)] flex flex-col gap-2.5">
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor="eyak-titration-slider"
                    className="text-[13px] font-bold text-[var(--ink)]"
                  >
                    Volume of 0.25 M H₂SO₄ added
                  </label>
                  <span className="eyak-mono font-bold text-[14px] text-[var(--gold)] tabular-nums">
                    {sim.acidVolumeCm3.toFixed(1)} cm³
                  </span>
                </div>

                <input
                  id="eyak-titration-slider"
                  type="range"
                  min={0}
                  max={35}
                  step={0.5}
                  value={sim.acidVolumeCm3}
                  onChange={(e) => setAcidVol(Number(e.target.value))}
                  className="w-full h-2.5 rounded-lg accent-[var(--gold)] cursor-pointer"
                />

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {TITRATION_PRESETS.map((preset) => {
                    const isSelected = Math.abs(sim.acidVolumeCm3 - preset.vol) < 0.05;
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setAcidVol(preset.vol)}
                        className={`min-h-[34px] px-2.5 py-1 rounded-lg border text-[12px] font-bold tabular-nums transition-colors cursor-pointer whitespace-nowrap ${
                          isSelected
                            ? 'bg-[var(--acc-soft)] border-[var(--acc-line)] text-[var(--gold)]'
                            : 'bg-[var(--bg)] border-[var(--line)] text-[var(--dim)] hover:text-[var(--ink)]'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--line)] text-[12.5px] text-[var(--dim)] flex flex-col gap-1">
                <span className="eyak-mono font-semibold text-[var(--ink)]">
                  H₂SO₄(aq) + 2NaOH(aq) → Na₂SO₄(aq) + 2H₂O(l)
                </span>
                <span className="tabular-nums">
                  CₐVₐ / CᵦVᵦ = 1 / 2 · Equivalence titre = 25.00 cm³ (record to 2 d.p. in WAEC)
                </span>
              </div>
            </div>
          </div>
        ) : benchMode === 'compass' ? (
          /* WAEC Paper 2 Ruler, Compass & Three-Figure Bearing Construction Stage */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-center">
            <div className="lg:col-span-7 rounded-xl border border-[var(--line)] bg-[var(--bg)]/70 p-4 sm:p-5 flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-[12px] font-bold tabular-nums">
                <span className="text-[var(--ink)]">
                  Constructed Angle ∠AOB = {geo.angleDeg}° · Locus Bisector OM = {(geo.angleDeg / 2).toFixed(1)}°
                </span>
                <span className="eyak-mono text-[var(--gold)]">
                  3-Figure Bearing: {geo.bearingThreeFig}
                </span>
              </div>

              <svg
                viewBox="0 0 248 186"
                className="w-full max-h-[220px] overflow-visible"
                role="img"
                aria-label={`Geometric construction of ${geo.angleDeg} degree angle at origin O with locus bisector ray OM`}
              >
                {/* Faint Millimetre Graph Paper Lines */}
                {[36, 76, 116, 156].map((gy) => (
                  <line
                    key={`gy-${gy}`}
                    x1="14"
                    y1={gy}
                    x2="236"
                    y2={gy}
                    stroke="var(--line)"
                    strokeWidth="0.9"
                  />
                ))}
                {[46, 96, 146, 196].map((gx) => (
                  <line
                    key={`gx-${gx}`}
                    x1={gx}
                    y1="16"
                    x2={gx}
                    y2="172"
                    stroke="var(--line)"
                    strokeWidth="0.9"
                  />
                ))}

                {/* North Reference Arrow at Origin O */}
                <line
                  x1={geo.originX}
                  y1={geo.originY}
                  x2={geo.originX}
                  y2="20"
                  stroke="var(--dim)"
                  strokeWidth="1.2"
                  strokeDasharray="3 3"
                />
                <text
                  x={geo.originX - 6}
                  y="14"
                  textAnchor="end"
                  fill="var(--dim)"
                  fontSize="9.5"
                  fontWeight="800"
                >
                  N (000°)
                </text>

                {/* Base Ray OA */}
                <line
                  x1={geo.originX}
                  y1={geo.originY}
                  x2={geo.baseEndX}
                  y2={geo.baseEndY}
                  stroke="var(--ink)"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
                <text
                  x={geo.baseEndX + 5}
                  y={geo.baseEndY + 4}
                  fill="var(--ink)"
                  fontSize="10.5"
                  fontWeight="800"
                >
                  A
                </text>

                {/* Primary Compass Construction Arc PQ */}
                <path
                  d={geo.arcPathD}
                  fill="none"
                  stroke="var(--gold)"
                  strokeWidth="2"
                  strokeDasharray="5 3"
                />

                {/* Locus Angle Bisector Ray OM */}
                <line
                  x1={geo.originX}
                  y1={geo.originY}
                  x2={geo.bisectorEndX}
                  y2={geo.bisectorEndY}
                  stroke="var(--green)"
                  strokeWidth="1.8"
                  strokeDasharray="4 2.5"
                />
                <circle
                  cx={geo.bisectIntersectionX}
                  cy={geo.bisectIntersectionY}
                  r="3.6"
                  fill="var(--green)"
                />
                <text
                  x={geo.bisectorEndX + 4}
                  y={geo.bisectorEndY - 3}
                  fill="var(--green)"
                  fontSize="9.5"
                  fontWeight="800"
                >
                  M (Bisector)
                </text>

                {/* Constructed Target Ray OB */}
                <line
                  x1={geo.originX}
                  y1={geo.originY}
                  x2={geo.rayEndX}
                  y2={geo.rayEndY}
                  stroke="var(--gold)"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />
                <text
                  x={geo.angleDeg > 100 ? geo.rayEndX - 7 : geo.rayEndX + 8}
                  y={Math.max(26, geo.rayEndY + 2)}
                  textAnchor={geo.angleDeg > 100 ? 'end' : 'start'}
                  fill="var(--gold)"
                  fontSize="10.5"
                  fontWeight="800"
                >
                  B ({geo.angleDeg}°)
                </text>

                {/* Key Compass Points O, P, Q */}
                <circle cx={geo.originX} cy={geo.originY} r="4" fill="var(--ink)" />
                <text
                  x={geo.originX - 14}
                  y={geo.originY + 13}
                  fill="var(--ink)"
                  fontSize="10.5"
                  fontWeight="800"
                >
                  O
                </text>
                <circle cx={geo.guidePointPx} cy={geo.guidePointPy} r="3.4" fill="var(--gold)" />
                <text
                  x={geo.guidePointPx - 3}
                  y={geo.guidePointPy + 14}
                  fill="var(--dim)"
                  fontSize="9.5"
                  fontWeight="700"
                >
                  P
                </text>
                <circle cx={geo.guidePointQx} cy={geo.guidePointQy} r="3.4" fill="var(--gold)" />
                <text
                  x={geo.guidePointQx - 12}
                  y={geo.guidePointQy - 5}
                  fill="var(--dim)"
                  fontSize="9.5"
                  fontWeight="700"
                >
                  Q
                </text>
              </svg>
            </div>

            {/* Right Compass Controls & WAEC Paper 2 Construction Rubric */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <div
                  className={`text-[12.5px] font-bold tabular-nums ${
                    geo.constructionKind === 'canonical-compass'
                      ? 'text-[var(--green)]'
                      : 'text-[var(--gold)]'
                  }`}
                >
                  {geo.statusLabel}
                </div>
                <p className="text-[13.5px] leading-relaxed text-[var(--dim)]">
                  {geo.methodSummary}
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--line)] flex flex-col gap-2.5">
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor="eyak-compass-slider"
                    className="text-[13px] font-bold text-[var(--ink)]"
                  >
                    Constructed angle ∠AOB
                  </label>
                  <span className="eyak-mono font-bold text-[14px] text-[var(--gold)] tabular-nums">
                    {geo.angleDeg}° · Bearing {geo.bearingThreeFig}
                  </span>
                </div>

                <input
                  id="eyak-compass-slider"
                  type="range"
                  min={15}
                  max={150}
                  step={5}
                  value={geo.angleDeg}
                  onChange={(e) => setCompassDeg(Number(e.target.value))}
                  className="w-full h-2.5 rounded-lg accent-[var(--gold)] cursor-pointer"
                />

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {COMPASS_PRESETS.map((preset) => {
                    const isSelected = geo.angleDeg === preset.deg;
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setCompassDeg(preset.deg)}
                        className={`min-h-[34px] px-2.5 py-1 rounded-lg border text-[12px] font-bold tabular-nums transition-colors cursor-pointer whitespace-nowrap ${
                          isSelected
                            ? 'bg-[var(--acc-soft)] border-[var(--acc-line)] text-[var(--gold)]'
                            : 'bg-[var(--bg)] border-[var(--line)] text-[var(--dim)] hover:text-[var(--ink)]'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--line)] flex flex-col gap-1 text-[12px] text-[var(--dim)]">
                {geo.rubricSteps.map((step) => (
                  <span key={step} className="leading-snug">
                    {step}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* WAEC Paper 3 & JAMB Converging Thin-Lens Ray-Tracing Optical Bench */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-center">
            <div className="lg:col-span-7 rounded-xl border border-[var(--line)] bg-[var(--bg)]/70 p-4 sm:p-5 flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-[12px] font-bold tabular-nums">
                <span className="text-[var(--ink)]">
                  Converging Lens f = {optics.focalLengthCm.toFixed(1)} cm · Object u = {optics.objectDistCm.toFixed(1)} cm
                </span>
                <span className="eyak-mono text-[var(--gold)]">
                  {optics.imageDistCm === null
                    ? 'v = ∞ (Parallel Rays)'
                    : `v = ${optics.imageDistCm > 0 ? '+' : ''}${optics.imageDistCm.toFixed(1)} cm · M = ${optics.magnification?.toFixed(2)}×`}
                </span>
              </div>

              <svg
                viewBox="0 0 264 176"
                className="w-full max-h-[220px] overflow-hidden"
                role="img"
                aria-label={`Thin-lens ray tracing diagram for object distance ${optics.objectDistCm.toFixed(1)} centimetres and focal length ${optics.focalLengthCm.toFixed(1)} centimetres`}
              >
                {/* Optical Bench Grid & Principal Axis */}
                {[36, 92, 148].map((gy) => (
                  <line
                    key={`opt-y-${gy}`}
                    x1="10"
                    y1={gy}
                    x2="254"
                    y2={gy}
                    stroke={gy === optics.axisY ? 'var(--dim)' : 'var(--line)'}
                    strokeWidth={gy === optics.axisY ? '1.3' : '0.8'}
                    strokeDasharray={gy === optics.axisY ? undefined : '3 3'}
                  />
                ))}

                {/* Focal Marks 2F, F, F', 2F' */}
                {[
                  { x: optics.twoFLeftX, lbl: '2F' },
                  { x: optics.fLeftX, lbl: 'F' },
                  { x: optics.fRightX, lbl: "F'" },
                  { x: optics.twoFRightX, lbl: "2F'" },
                ].map((mk) => (
                  <g key={mk.lbl}>
                    <line
                      x1={mk.x}
                      y1={optics.axisY - 4}
                      x2={mk.x}
                      y2={optics.axisY + 4}
                      stroke="var(--dim)"
                      strokeWidth="1.4"
                    />
                    <text
                      x={mk.x}
                      y={optics.axisY + 15}
                      textAnchor="middle"
                      fill="var(--dim)"
                      fontSize="9"
                      fontWeight="800"
                    >
                      {mk.lbl}
                    </text>
                  </g>
                ))}

                {/* Biconvex Converging Lens Symbol at x = 132 */}
                <path
                  d={`M ${optics.lensX} 22 Q ${optics.lensX + 12} ${optics.axisY} ${optics.lensX} 162 Q ${optics.lensX - 12} ${optics.axisY} ${optics.lensX} 22 Z`}
                  fill="rgba(56, 189, 248, 0.16)"
                  stroke="#0284C7"
                  strokeWidth="1.8"
                />
                <line
                  x1={optics.lensX}
                  y1="18"
                  x2={optics.lensX}
                  y2="164"
                  stroke="#0284C7"
                  strokeWidth="1"
                  strokeDasharray="2.5 2.5"
                />

                {/* Principal Ray 1: Parallel to Axis -> Refracts through F' */}
                <line
                  x1={optics.ray1Incident.x1}
                  y1={optics.ray1Incident.y1}
                  x2={optics.ray1Incident.x2}
                  y2={optics.ray1Incident.y2}
                  stroke="var(--gold)"
                  strokeWidth="2"
                />
                <line
                  x1={optics.ray1Refracted.x1}
                  y1={optics.ray1Refracted.y1}
                  x2={optics.ray1Refracted.x2}
                  y2={optics.ray1Refracted.y2}
                  stroke="var(--gold)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Principal Ray 2: Undeviated Straight Through Optical Centre O */}
                <line
                  x1={optics.ray2ThroughCentre.x1}
                  y1={optics.ray2ThroughCentre.y1}
                  x2={optics.ray2ThroughCentre.x2}
                  y2={optics.ray2ThroughCentre.y2}
                  stroke="var(--green)"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                />

                {/* Dashed Virtual Back-Extensions When u < f */}
                {optics.virtualBackRay1 && (
                  <line
                    x1={optics.virtualBackRay1.x1}
                    y1={optics.virtualBackRay1.y1}
                    x2={optics.virtualBackRay1.x2}
                    y2={optics.virtualBackRay1.y2}
                    stroke="var(--gold)"
                    strokeWidth="1.6"
                    strokeDasharray="4 2.5"
                  />
                )}
                {optics.virtualBackRay2 && (
                  <line
                    x1={optics.virtualBackRay2.x1}
                    y1={optics.virtualBackRay2.y1}
                    x2={optics.virtualBackRay2.x2}
                    y2={optics.virtualBackRay2.y2}
                    stroke="var(--green)"
                    strokeWidth="1.6"
                    strokeDasharray="4 2.5"
                  />
                )}

                {/* On-Bench Image Arrow (Real Inverted or Virtual Erect) */}
                {optics.imgX !== null && optics.imgTopY !== null && !optics.isVirtual ? (
                  <>
                    <line
                      x1={optics.imgX}
                      y1={optics.axisY}
                      x2={optics.imgX}
                      y2={optics.imgTopY}
                      stroke="var(--green)"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                    />
                    <circle cx={optics.imgX} cy={optics.imgTopY} r="3.2" fill="var(--green)" />
                    <text
                      x={optics.imgX > 220 ? optics.imgX - 6 : optics.imgX + 6}
                      y={Math.min(162, optics.imgTopY + 9)}
                      textAnchor={optics.imgX > 220 ? 'end' : 'start'}
                      fill="var(--green)"
                      fontSize="9.5"
                      fontWeight="800"
                    >
                      Real I
                    </text>
                  </>
                ) : optics.imgX !== null && optics.imgTopY !== null && optics.isVirtual ? (
                  <>
                    <line
                      x1={optics.imgX}
                      y1={optics.axisY}
                      x2={optics.imgX}
                      y2={optics.imgTopY}
                      stroke="var(--gold)"
                      strokeWidth="2.6"
                      strokeDasharray="4 2"
                    />
                    <circle cx={optics.imgX} cy={optics.imgTopY} r="3.2" fill="var(--gold)" />
                    <text
                      x={optics.imgX < 44 ? optics.imgX + 6 : optics.imgX - 6}
                      y={Math.max(16, optics.imgTopY + 3)}
                      textAnchor={optics.imgX < 44 ? 'start' : 'end'}
                      fill="var(--gold)"
                      fontSize="9.5"
                      fontWeight="800"
                    >
                      Virtual I
                    </text>
                  </>
                ) : optics.imageDistCm !== null && !optics.imgOnBench ? (
                  <text
                    x={optics.isVirtual ? 16 : 248}
                    y={optics.isVirtual ? 26 : 158}
                    textAnchor={optics.isVirtual ? 'start' : 'end'}
                    fill={optics.isVirtual ? 'var(--gold)' : 'var(--green)'}
                    fontSize="9"
                    fontWeight="800"
                  >
                    {optics.isVirtual
                      ? `↖ Virtual I at v = ${optics.imageDistCm.toFixed(1)} cm`
                      : `Real I at v = +${optics.imageDistCm.toFixed(1)} cm ↘`}
                  </text>
                ) : null}

                {/* Upright Object Pin O */}
                <line
                  x1={optics.objX}
                  y1={optics.axisY}
                  x2={optics.objX}
                  y2={optics.objTopY}
                  stroke="var(--ink)"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />
                <circle cx={optics.objX} cy={optics.objTopY} r="3.2" fill="var(--ink)" />
                <text
                  x={optics.objX}
                  y={optics.objTopY - 6}
                  textAnchor="middle"
                  fill="var(--ink)"
                  fontSize="9.5"
                  fontWeight="800"
                >
                  Obj
                </text>
              </svg>
            </div>

            {/* Right Optics Controls & WAEC Paper 3 Precautions */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <div
                  className={`text-[12.5px] font-bold tabular-nums ${
                    optics.regime === 'at-2f'
                      ? 'text-[var(--green)]'
                      : optics.isVirtual || optics.regime === 'at-f'
                        ? 'text-[var(--warn-ink)]'
                        : 'text-[var(--gold)]'
                  }`}
                >
                  {optics.statusLabel}
                </div>
                <p className="text-[13.5px] leading-relaxed text-[var(--dim)]">
                  {optics.natureSummary}
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--line)] flex flex-col gap-2.5">
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor="eyak-optics-slider"
                    className="text-[13px] font-bold text-[var(--ink)]"
                  >
                    Object distance u (f = 10.0 cm)
                  </label>
                  <span className="eyak-mono font-bold text-[14px] text-[var(--gold)] tabular-nums">
                    u = {optics.objectDistCm.toFixed(1)} cm
                  </span>
                </div>

                <input
                  id="eyak-optics-slider"
                  type="range"
                  min={6}
                  max={34}
                  step={0.5}
                  value={optics.objectDistCm}
                  onChange={(e) => setObjectDistCm(Number(e.target.value))}
                  className="w-full h-2.5 rounded-lg accent-[var(--gold)] cursor-pointer"
                />

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {OPTICS_PRESETS.map((preset) => {
                    const isSelected = Math.abs(optics.objectDistCm - preset.u) < 0.1;
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setObjectDistCm(preset.u)}
                        className={`min-h-[34px] px-2.5 py-1 rounded-lg border text-[12px] font-bold tabular-nums transition-colors cursor-pointer whitespace-nowrap ${
                          isSelected
                            ? 'bg-[var(--acc-soft)] border-[var(--acc-line)] text-[var(--gold)]'
                            : 'bg-[var(--bg)] border-[var(--line)] text-[var(--dim)] hover:text-[var(--ink)]'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--line)] flex flex-col gap-1 text-[12px] text-[var(--dim)]">
                {optics.rubricSteps.map((step) => (
                  <span key={step} className="leading-snug">
                    {step}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </SmoothViewSwitch>

      {/* Connected App Studios Launcher Bar */}
      {(onOpenTheoryCoach || onOpenPeerDuel || onOpenStemSandboxes) && (
        <div className="pt-4 border-t border-[var(--line)] flex flex-wrap items-center justify-between gap-3 text-[13px]">
          <span className="font-semibold text-[var(--dim)]">
            Connected Easy Learn companion studios — jump straight into any live workbench:
          </span>
          <div className="flex flex-wrap items-center gap-4 font-bold">
            {onOpenTheoryCoach && (
              <button
                type="button"
                onClick={onOpenTheoryCoach}
                className="text-[var(--gold)] hover:underline underline-offset-4 cursor-pointer whitespace-nowrap"
              >
                WAEC Paper 2 Theory Coach →
              </button>
            )}
            {onOpenPeerDuel && (
              <button
                type="button"
                onClick={onOpenPeerDuel}
                className="text-[var(--gold)] hover:underline underline-offset-4 cursor-pointer whitespace-nowrap"
              >
                10-Question Peer Duel →
              </button>
            )}
            {onOpenStemSandboxes && (
              <button
                type="button"
                onClick={onOpenStemSandboxes}
                className="text-[var(--gold)] hover:underline underline-offset-4 cursor-pointer whitespace-nowrap"
              >
                SQL · Logic Gate · Matrix Sandboxes →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const SHOWCASE_THEME_IDS: readonly MasteryThemeId[] = [
  'stage-1-adire',
  'stage-2-savanna',
  'stage-3-jade',
  'stage-4-lagoon',
  'stage-8-scholar',
  'stage-10-chancellor',
];

export function StudyAtmosphereShowcase({
  previewThemeId,
  appearanceMode,
  onSelectTheme,
  onToggleAppearance,
}: {
  previewThemeId: MasteryThemeId;
  appearanceMode: ThemeAppearanceMode;
  onSelectTheme: (id: MasteryThemeId) => void;
  onToggleAppearance?: () => void;
}) {
  const showcaseThemes = useMemo(
    () => MASTERY_THEMES.filter((t) => SHOWCASE_THEME_IDS.includes(t.id)),
    []
  );
  const activeDef =
    showcaseThemes.find((t) => t.id === previewThemeId) || showcaseThemes[0];

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
      <div className="flex flex-col gap-1 max-w-[44ch]">
        <div className="flex flex-wrap items-center gap-2 text-[12.5px] font-bold text-[var(--gold)]">
          <span>Live Study Atmosphere Preview</span>
          <span aria-hidden="true" className="text-[var(--dim)]">·</span>
          <span className="text-[var(--dim)]">10 Mastery Themes + Night Study Mode</span>
        </div>
        <div className="eyak-display font-extrabold text-[18px] text-[var(--ink)]">
          {activeDef.name} — {activeDef.tagline}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {showcaseThemes.map((theme) => {
          const palette = getThemePreview(theme, appearanceMode);
          const active = theme.id === previewThemeId;
          return (
            <button
              key={theme.id}
              type="button"
              aria-pressed={active}
              onClick={() => onSelectTheme(theme.id)}
              className={`min-h-[38px] px-3 py-1.5 rounded-xl border text-[12.5px] font-bold inline-flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
                active
                  ? 'bg-[var(--acc-soft)] border-[var(--gold)] text-[var(--ink)]'
                  : 'bg-[var(--bg)] border-[var(--line)] text-[var(--dim)] hover:text-[var(--ink)]'
              }`}
            >
              <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 shrink-0" aria-hidden="true">
                <circle cx="8" cy="8" r="7" fill={palette.accent} />
              </svg>
              <span>{theme.name}</span>
            </button>
          );
        })}

        {onToggleAppearance && (
          <button
            type="button"
            onClick={onToggleAppearance}
            className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-[var(--ink)] text-[var(--card)] text-[12.5px] font-bold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
          >
            {appearanceMode === 'dark' ? 'Switch to Light' : 'Try Dark Mode'}
          </button>
        )}
      </div>
    </div>
  );
}

const HERO_MINI_COURSES: readonly UniversityCourseId[] = ['med', 'cs', 'law', 'engr'];

export function HeroInteractivePreviewDeck({
  heroImageSrc,
  courseId,
  onChangeCourse,
  practiceScore,
  onChangePracticeScore,
  heroTeacher,
  heroTeacherScript,
  isVoicePlaying,
  isVoiceLoading,
  onToggleHeroVoice,
  onOpenLiveEnglishDrill,
  onOpenUniversePreview,
  onJumpToArena,
}: {
  heroImageSrc: string;
  courseId: UniversityCourseId;
  onChangeCourse: (id: UniversityCourseId) => void;
  practiceScore: number;
  onChangePracticeScore: (score: number) => void;
  heroTeacher: FeaturedWebsiteTeacher;
  heroTeacherScript: string;
  isVoicePlaying: boolean;
  isVoiceLoading: boolean;
  onToggleHeroVoice: () => void;
  onOpenLiveEnglishDrill: () => void;
  onOpenUniversePreview?: () => void;
  onJumpToArena: () => void;
}) {
  const [heroTab, setHeroTab] = useState<'trap' | 'worlds' | 'voice' | 'dial'>('trap');
  const [pickedOption, setPickedOption] = useState<number | null>(null);
  const [thumbFailed, setThumbFailed] = useState<boolean>(false);
  const [worldArtFailed, setWorldArtFailed] = useState<boolean>(false);

  const quickVerdict =
    pickedOption !== null ? evaluateHeroQuickChallenge(pickedOption) : null;

  const miniPlan = useMemo(
    () => computeAdmissionCompassPlan(courseId, practiceScore),
    [courseId, practiceScore]
  );

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    e.currentTarget.style.setProperty('--spot-x', `${x}px`);
    e.currentTarget.style.setProperty('--spot-y', `${y}px`);
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      className="eyak-spotlight-surface w-full rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5 sm:p-6 flex flex-col justify-between gap-5"
    >
      {/* Top Interactive Workbench Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-[var(--line)]">
        <div className="flex items-center gap-2 text-[12.5px] font-bold text-[var(--ink)]">
          <span className="eyak-mono text-[var(--gold)]">Live Studio</span>
          <span aria-hidden="true" className="text-[var(--dim)]">·</span>
          <span className="text-[var(--dim)]">Try before signing up</span>
        </div>

        <LiquidCapsuleBar
          items={[
            { id: 'trap', label: '15s Trap' },
            { id: 'worlds', label: '3D Worlds' },
            { id: 'voice', label: 'Voice Tutor' },
            { id: 'dial', label: 'Merit Dial' },
          ]}
          value={heroTab}
          onChange={setHeroTab}
          ariaLabel="Switch interactive hero preview"
          size="sm"
        />
      </div>

      {/* Center Interactive Stage */}
      <div className="relative z-10 flex-1 flex flex-col justify-center">
        <SmoothViewSwitch viewKey={heroTab}>
          {heroTab === 'trap' ? (
            <div className="flex flex-col gap-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-[12px] font-semibold text-[var(--dim)]">
                <span>
                  <strong className="text-[var(--gold)]">{HERO_QUICK_CHALLENGE.subjectLabel}</strong> ·{' '}
                  {HERO_QUICK_CHALLENGE.topicTag}
                </span>
                <span className="eyak-mono text-[11.5px]">Set by {HERO_QUICK_CHALLENGE.tutorName}</span>
              </div>

              <p className="eyak-display font-bold text-[16.5px] sm:text-[17.5px] leading-snug text-[var(--ink)]">
                {HERO_QUICK_CHALLENGE.prompt}
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                {HERO_QUICK_CHALLENGE.options.map((opt, idx) => {
                  const isPicked = pickedOption === idx;
                  const isRight = idx === HERO_QUICK_CHALLENGE.correctIdx;
                  let btnCls =
                    'border-[var(--line)] bg-[var(--bg)]/75 text-[var(--ink)] hover:border-[var(--acc-line)]';
                  if (pickedOption !== null) {
                    if (isRight) {
                      btnCls = 'border-[var(--ok-line)] bg-[var(--ok-soft)] text-[var(--ink)]';
                    } else if (isPicked) {
                      btnCls = 'border-[var(--bad-line)] bg-[var(--bad-soft)] text-[var(--ink)]';
                    } else {
                      btnCls = 'border-[var(--line)] bg-[var(--bg)]/40 text-[var(--dim)] opacity-75';
                    }
                  }
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setPickedOption(idx)}
                      className={`eyak-tactile-card min-h-[44px] px-3.5 py-2 rounded-xl border text-left text-[14px] font-bold flex items-center justify-between gap-2 cursor-pointer ${btnCls}`}
                    >
                      <span>
                        <span className="eyak-mono text-[var(--gold)] mr-1.5">
                          {OPTION_LETTERS[idx]}.
                        </span>
                        {opt}
                      </span>
                      {pickedOption !== null && isRight && (
                        <span className="text-[12px] font-extrabold text-[var(--green)]">✓</span>
                      )}
                      {pickedOption !== null && isPicked && !isRight && (
                        <span className="text-[12px] font-extrabold text-[var(--coral-ink)]">✕</span>
                      )}
                    </button>
                  );
                })}
              </div>

              <SmoothCollapse open={quickVerdict !== null}>
                {quickVerdict && (
                  <div className="pt-2.5 border-t border-[var(--line)] flex flex-col gap-1.5 text-[12.5px]">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span
                        className={`font-bold ${
                          quickVerdict.isCorrect ? 'text-[var(--green)]' : 'text-[var(--coral-ink)]'
                        }`}
                      >
                        {quickVerdict.statusLine}
                      </span>
                      <div className="flex items-center gap-3 font-bold">
                        <button
                          type="button"
                          onClick={() => setPickedOption(null)}
                          className="text-[var(--dim)] hover:text-[var(--ink)] cursor-pointer"
                        >
                          Retry
                        </button>
                        <button
                          type="button"
                          onClick={onOpenLiveEnglishDrill}
                          className="text-[var(--gold)] hover:underline underline-offset-4 cursor-pointer whitespace-nowrap"
                        >
                          Practice more →
                        </button>
                      </div>
                    </div>
                    <p className="text-[var(--dim)] leading-relaxed">{quickVerdict.explanation}</p>
                  </div>
                )}
              </SmoothCollapse>

              {pickedOption === null && (
                <div className="flex items-center justify-between gap-2 text-[12px] text-[var(--dim)]">
                  <span>Tap an option above to test your UTME concord reflex</span>
                  <button
                    type="button"
                    onClick={onJumpToArena}
                    className="font-bold text-[var(--gold)] hover:underline underline-offset-4 cursor-pointer whitespace-nowrap"
                  >
                    5-subject arena ↓
                  </button>
                </div>
              )}
            </div>
          ) : heroTab === 'worlds' ? (
            <div className="flex flex-col gap-3.5">
              <div
                className="relative h-36 rounded-xl overflow-hidden border border-[var(--line)] p-4 flex flex-col justify-end"
                style={{
                  background: 'linear-gradient(135deg, #2A0810 0%, #681224 55%, #0F2938 100%)',
                }}
              >
                {!worldArtFailed && (
                  <img
                    src={bioWorldArt}
                    alt="The Living World interactive biology expedition"
                    referrerPolicy="no-referrer"
                    onError={() => setWorldArtFailed(true)}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#090D16]/90 via-[#090D16]/45 to-transparent" />
                <div className="relative z-10 text-white flex items-end justify-between gap-3">
                  <div>
                    <div className="text-[11.5px] font-bold text-amber-300">
                      Biology · 3D Circulatory Expedition · Guide: Dr. Amaka
                    </div>
                    <div className="eyak-display font-extrabold text-[18px] leading-snug">
                      Voyage Through the Living Heart
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-[12.5px]">
                <span className="text-[var(--dim)]">
                  Navigate heart valves, alveolar gas exchange, and 49 subject worlds.
                </span>
                {onOpenUniversePreview && (
                  <button
                    type="button"
                    onClick={onOpenUniversePreview}
                    className="font-bold text-[var(--gold)] hover:underline underline-offset-4 cursor-pointer whitespace-nowrap"
                  >
                    Launch instant preview →
                  </button>
                )}
              </div>
            </div>
          ) : heroTab === 'voice' ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[12px] font-bold text-[var(--gold)]">
                    {heroTeacher.subjectName} · {heroTeacher.personalityTag}
                  </span>
                  <div className="eyak-display font-extrabold text-[20px] text-[var(--ink)]">
                    {heroTeacher.tutorName}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onToggleHeroVoice}
                  disabled={isVoiceLoading}
                  className="eyak-cta-sheen min-h-[40px] px-4 py-2 rounded-xl bg-[var(--gold)] text-[var(--on-acc)] eyak-display font-bold text-[13px] inline-flex items-center gap-2 hover:opacity-95 disabled:opacity-70 transition-opacity cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Icon name={isVoicePlaying ? 'pause' : 'volume'} size={15} />
                  <span>
                    {isVoiceLoading
                      ? 'Loading...'
                      : isVoicePlaying
                        ? 'Stop Voice'
                        : `Hear ${heroTeacher.tutorName}`}
                  </span>
                </button>
              </div>

              <p className="text-[14px] leading-relaxed text-[var(--ink)] font-medium">
                “{heroTeacherScript}”
              </p>

              <div className="pt-2.5 border-t border-[var(--line)] flex items-center justify-between gap-2 text-[12px] text-[var(--dim)]">
                <span>Introduced once during setup · Zero repeated small talk in lessons</span>
                <span className="eyak-mono font-semibold text-[var(--gold)]">49 Tutors</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3.5">
              <div className="flex flex-wrap items-center gap-1.5">
                {HERO_MINI_COURSES.map((cid) => {
                  const preset = UNIVERSITY_COURSE_PRESETS.find((c) => c.id === cid);
                  if (!preset) return null;
                  const active = cid === courseId;
                  return (
                    <button
                      key={cid}
                      type="button"
                      onClick={() => onChangeCourse(cid)}
                      className={`min-h-[32px] px-3 py-1 rounded-lg border text-[12px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
                        active
                          ? 'bg-[var(--acc-soft)] border-[var(--gold)] text-[var(--ink)]'
                          : 'bg-[var(--bg)] border-[var(--line)] text-[var(--dim)] hover:text-[var(--ink)]'
                      }`}
                    >
                      {preset.shortTab}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-baseline justify-between gap-3">
                <div className="flex flex-col">
                  <span className="eyak-display font-extrabold text-[17px] text-[var(--ink)]">
                    {miniPlan.course.title}
                  </span>
                  <span className="text-[12px] text-[var(--dim)]">
                    4 UTME Subjects: {miniPlan.jambSubjectDetails.map((s) => s.shortName).join(' · ')}
                  </span>
                </div>
                <span className="eyak-mono font-bold text-[15px] text-[var(--gold)] shrink-0">
                  Target {miniPlan.course.cutOffTarget400}/400
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[12.5px] font-bold">
                  <label htmlFor="eyak-hero-score-dial" className="text-[var(--ink)]">
                    Your current mock score
                  </label>
                  <span className="eyak-mono text-[var(--gold)]">
                    {miniPlan.currentScore400} / 400 ({miniPlan.statusBadgeLabel.split('·')[0].trim()})
                  </span>
                </div>
                <input
                  id="eyak-hero-score-dial"
                  type="range"
                  min={140}
                  max={370}
                  step={5}
                  value={miniPlan.currentScore400}
                  onChange={(e) => onChangePracticeScore(Number(e.target.value))}
                  className="w-full h-2 rounded-lg accent-[var(--gold)] cursor-pointer"
                />
              </div>
            </div>
          )}
        </SmoothViewSwitch>
      </div>

      {/* Bottom Human Scholar Anchor Strip */}
      <div className="relative z-10 pt-3.5 border-t border-[var(--line)] flex items-center gap-3.5">
        {!thumbFailed ? (
          <img
            src={heroImageSrc}
            alt="Two focused Nigerian university aspirants solving geometry problems together"
            referrerPolicy="no-referrer"
            onError={() => setThumbFailed(true)}
            className="w-16 h-12 sm:w-20 sm:h-13 rounded-xl object-cover border border-[var(--line)] shrink-0"
          />
        ) : (
          <div className="w-16 h-12 rounded-xl bg-[var(--acc-soft)] border border-[var(--acc-line)] shrink-0" />
        )}
        <div className="min-w-0 flex flex-col gap-0.5">
          <div className="text-[13px] font-bold text-[var(--ink)] leading-snug truncate">
            Built for SS1–SS3 finalists &amp; UTME aspirants across Nigeria
          </div>
          <div className="text-[12px] text-[var(--dim)] truncate">
            Lagos · Abuja · Ibadan · Port Harcourt · Enugu · Kano
          </div>
        </div>
      </div>
    </div>
  );
}

