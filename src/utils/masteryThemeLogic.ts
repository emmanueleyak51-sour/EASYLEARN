import type {
  MasteryThemeId,
  ThemeAppearanceMode,
  ThemeLockMode,
  Topic,
  UserProgress,
} from '../types';
import {
  DEFAULT_MASTERY_THEME_ID,
  MASTERY_THEMES,
  getMasteryThemeById,
  type MasteryThemeDef,
} from '../data/masteryThemes';
import { predicted, subjTarget, tstate } from './engine';

export interface GoalMasterySnapshot {
  /** 0..100 — student's earned progress toward their target mastery goal */
  goalPct: number;
  /** Current predicted mastery score (0..100) */
  currentPred: number;
  /** Student's target mastery score (50..95) */
  targetPct: number;
  /** Highest stage number (1..10) unlocked by current goalPct */
  highestUnlockedStage: number;
  /** Theme definition for the highest unlocked stage */
  highestUnlockedTheme: MasteryThemeDef;
  /** Next locked theme milestone, or null if Stage 10 (100%) is reached */
  nextTheme: MasteryThemeDef | null;
  /** Remaining goal % points needed to unlock nextTheme */
  pctToNextTheme: number;
}

/**
 * Computes deterministic, earned progress (0% -> 100%) toward the student's exam goal.
 * - A brand-new student with zero study activity starts cleanly at 0% (Stage 1).
 * - Completing lessons, practising questions accurately, and passing topic tests smoothly
 *   advances goalPct up to 100% (Stage 10) when the student reaches their target mastery
 *   or completes all topics in the track.
 */
export function computeGoalProgress(
  progress: UserProgress,
  topics: Topic[]
): GoalMasterySnapshot {
  const targetPct = Math.max(50, Math.min(95, subjTarget(progress)));
  const totalTopics = Math.max(1, topics.length);
  const currentPred = topics.length ? predicted(progress, topics) : 0;

  let passedCount = 0;
  let practicedOnlyCount = 0;
  let lessonOnlyCount = 0;
  let attemptedTopics = 0;

  for (const t of topics) {
    const st = tstate(progress, t.id);
    if (st.att.length > 0) attemptedTopics += 1;
    if (st.boss) passedCount += 1;
    else if (st.practice) practicedOnlyCount += 1;
    else if (st.lesson) lessonOnlyCount += 1;
  }

  const hasAnyActivity =
    passedCount > 0 ||
    practicedOnlyCount > 0 ||
    lessonOnlyCount > 0 ||
    attemptedTopics > 0 ||
    progress.hist.length > 0;

  let goalPct = 0;
  if (hasAnyActivity && topics.length > 0) {
    // Component A: Syllabus milestone progress (0..1)
    const syllabusRatio = Math.min(
      1,
      (passedCount + 0.55 * practicedOnlyCount + 0.3 * lessonOnlyCount) / totalTopics
    );

    // Component B: Calibrated mastery score climb toward targetPct (baseline 45% -> targetPct)
    // Scaled by topic coverage so answering 1 question doesn't jump straight to 100%
    const coverageWeight = Math.min(
      1,
      (attemptedTopics + passedCount + 0.5 * lessonOnlyCount) / Math.max(3, totalTopics * 0.35)
    );
    const rawScoreGain = Math.max(
      0,
      Math.min(1, (currentPred - 45) / Math.max(10, targetPct - 45))
    );
    const calibratedScoreRatio = rawScoreGain * coverageWeight;

    if (passedCount >= totalTopics || (currentPred >= targetPct && coverageWeight >= 0.85)) {
      goalPct = 100;
    } else {
      const blended = Math.max(syllabusRatio, 0.55 * syllabusRatio + 0.45 * calibratedScoreRatio);
      // Give at least 2% once the student starts studying so progress feels alive immediately
      goalPct = Math.max(2, Math.min(99, Math.round(blended * 100)));
    }
  }

  let highestUnlockedTheme = MASTERY_THEMES[0];
  for (const theme of MASTERY_THEMES) {
    if (goalPct >= theme.unlockGoalPct) {
      highestUnlockedTheme = theme;
    }
  }

  const nextTheme =
    MASTERY_THEMES.find((t) => t.stage === highestUnlockedTheme.stage + 1) || null;
  const pctToNextTheme = nextTheme ? Math.max(0, nextTheme.unlockGoalPct - goalPct) : 0;

  return {
    goalPct,
    currentPred,
    targetPct,
    highestUnlockedStage: highestUnlockedTheme.stage,
    highestUnlockedTheme,
    nextTheme,
    pctToNextTheme,
  };
}

/**
 * Returns whether a given mastery theme can be selected right now.
 * - In `'unlocked'` mode (default Test & Preview mode), all 10 themes are selectable.
 * - In `'goal'` mode, themes unlock strictly as `goalPct >= theme.unlockGoalPct`.
 */
export function isThemeUnlocked(
  theme: MasteryThemeDef,
  goalPct: number,
  lockMode: ThemeLockMode = 'unlocked'
): boolean {
  if (lockMode === 'unlocked') return true;
  return goalPct >= theme.unlockGoalPct;
}

/**
 * Resolves the effective MasteryThemeId to apply to `<html data-theme="...">`.
 * If `themeLockMode === 'goal'` and the stored theme exceeds the student's unlocked stage,
 * falls back cleanly to `highestUnlockedTheme.id`.
 */
export function resolveEffectiveThemeId(
  progress: Pick<UserProgress, 'themeId' | 'themeLockMode'>,
  goalPct: number
): MasteryThemeId {
  const lockMode: ThemeLockMode = progress.themeLockMode || 'unlocked';
  const requested = getMasteryThemeById(progress.themeId || DEFAULT_MASTERY_THEME_ID);
  if (isThemeUnlocked(requested, goalPct, lockMode)) {
    return requested.id;
  }
  let best = MASTERY_THEMES[0];
  for (const t of MASTERY_THEMES) {
    if (goalPct >= t.unlockGoalPct) best = t;
  }
  return best.id;
}

/**
 * Resolves the active Light or Dark appearance mode (`'light' | 'dark'`).
 * Students can freely choose Light or Dark at any Mastery Stage.
 */
export function resolveEffectiveThemeMode(
  progress: Pick<UserProgress, 'themeMode'>
): ThemeAppearanceMode {
  return progress.themeMode === 'dark' ? 'dark' : 'light';
}
