import type {
  MasteryThemeId,
  ThemeAppearanceMode,
  Topic,
  UserProgress,
} from '../types';
import {
  DEFAULT_MASTERY_THEME_ID,
  MASTERY_THEMES,
  getMasteryThemeById,
  type MasteryThemeDef,
} from '../data/masteryThemes';
import { predicted, subjTarget, today, tstate } from './engine';
import { hasActivePremium } from './paywallLogic';

export interface GoalMasterySnapshot {
  /** 0..100 — student's earned progress toward their target mastery goal */
  goalPct: number;
  /** Current predicted mastery score (0..100) */
  currentPred: number;
  /** Student's target mastery score (50..95) */
  targetPct: number;
  /** Highest stage number (1..10) reached by current goalPct */
  highestUnlockedStage: number;
  /** Theme definition corresponding to highestUnlockedStage */
  highestUnlockedTheme: MasteryThemeDef;
  /** Next milestone, or null if 100% is reached */
  nextTheme: MasteryThemeDef | null;
  /** Remaining goal % points to next milestone */
  pctToNextTheme: number;
}

/**
 * Computes deterministic, earned progress (0% -> 100%) toward the student's exam goal.
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
    const syllabusRatio = Math.min(
      1,
      (passedCount + 0.55 * practicedOnlyCount + 0.3 * lessonOnlyCount) / totalTopics
    );

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
 * Returns true if the student holds active Premium access (or owner status).
 * Deliberately independent of `CONFIG.PAYWALL` so extra colour themes stay
 * reserved for Premium students while core study topics remain open.
 */
export function hasPremiumThemeAccess(
  progress: Pick<UserProgress, 'pro' | 'owner'>,
  currentDay = today()
): boolean {
  return hasActivePremium(progress, currentDay);
}

/**
 * Returns whether a given colour theme can be selected by this student.
 * - `Playful grape` (`!theme.premiumOnly`) is always available to every student.
 * - Additional colour themes (`theme.premiumOnly`) require active Premium status.
 */
export function isThemeUnlocked(
  theme: MasteryThemeDef,
  progress: Pick<UserProgress, 'pro' | 'owner'> = { pro: null, owner: 0 },
  currentDay = today()
): boolean {
  if (!theme.premiumOnly) return true;
  return hasPremiumThemeAccess(progress, currentDay);
}

/**
 * Resolves the effective MasteryThemeId to apply to `<html data-theme="...">`.
 * Standard students always receive `stage-1-adire` (Playful grape), even if a
 * previous session had saved a different stage theme. Premium students can use
 * any theme they select.
 */
export function resolveEffectiveThemeId(
  progress: Pick<UserProgress, 'themeId' | 'pro' | 'owner'>,
  currentDay = today()
): MasteryThemeId {
  const requested = getMasteryThemeById(progress.themeId || DEFAULT_MASTERY_THEME_ID);
  if (isThemeUnlocked(requested, progress, currentDay)) {
    return requested.id;
  }
  return DEFAULT_MASTERY_THEME_ID;
}

/**
 * Resolves the active Light or Dark appearance mode (`'light' | 'dark'`).
 * Light and Dark mode are open to every student (including during the 3-day starter trial);
 * only the 9 extra colour palettes are locked behind a subscription.
 */
export function resolveEffectiveThemeMode(
  progress: Pick<UserProgress, 'themeMode'>,
  _currentDay = today()
): ThemeAppearanceMode {
  return progress.themeMode === 'dark' ? 'dark' : 'light';
}
