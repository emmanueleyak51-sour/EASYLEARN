import type { ScreenName, SubjectId } from '../types';
import { SUBJECT_IDS } from '../data/curriculum';

export type TransitionKind = 'tab' | 'push' | 'pop' | 'fade';

export interface ScreenTransitionSpec {
  kind: TransitionKind;
  /** +1 = moving rightward / deeper; -1 = moving leftward / shallower; 0 = neutral crossfade */
  direction: -1 | 0 | 1;
}

/**
 * Horizontal index of the 5 top-level primary navigation tabs:
 * Home (0) -> Subjects (1) -> Topics (2) -> Formulas (3) -> Settings (4)
 */
export const PRIMARY_TAB_ORDER: Partial<Record<ScreenName, number>> = {
  home: 0,
  subjs: 1,
  topics: 2,
  formulas: 3,
  more: 4,
};

/**
 * True hierarchical navigation depth.
 * All 5 primary tabs live at depth 0 on the same horizontal plane so tab switches
 * glide laterally rather than misfiring push/pop animations.
 */
export const SCREEN_HIERARCHY_DEPTH: Record<ScreenName, number> = {
  welcome: 0,
  home: 0,
  subjs: 0,
  topics: 0,
  formulas: 0,
  more: 0,
  dxintro: 1,
  review: 1,
  topic: 1,
  lab: 1,
  cbt: 1,
  mistakes: 1,
  planner: 1,
  sandboxes: 1,
  theory: 1,
  transcript: 1,
  duel: 1,
  leaderboard: 1,
  notes: 2,
  lesson: 2,
  quiz: 2,
  boss: 2,
  labrun: 2,
  sum: 2,
};

/**
 * Computes the exact spatial transition between two screens synchronously on Frame 1
 * (eliminating 1-frame-late useEffect animation class swaps).
 */
export function computeScreenTransition(
  prev: ScreenName,
  next: ScreenName
): ScreenTransitionSpec {
  if (prev === next) {
    return { kind: 'fade', direction: 0 };
  }

  // Portal entry/exit (welcome <-> app) uses a clean, calm spatial fade-scale
  if (prev === 'welcome' || next === 'welcome') {
    return { kind: 'fade', direction: next === 'welcome' ? -1 : 1 };
  }

  const prevDepth = SCREEN_HIERARCHY_DEPTH[prev] ?? 0;
  const nextDepth = SCREEN_HIERARCHY_DEPTH[next] ?? 0;

  if (nextDepth > prevDepth) {
    return { kind: 'push', direction: 1 };
  }
  if (nextDepth < prevDepth) {
    return { kind: 'pop', direction: -1 };
  }

  // Same depth: check if both are top-level primary tabs
  const prevTabIdx = PRIMARY_TAB_ORDER[prev];
  const nextTabIdx = PRIMARY_TAB_ORDER[next];
  if (prevTabIdx !== undefined && nextTabIdx !== undefined) {
    return {
      kind: 'tab',
      direction: nextTabIdx > prevTabIdx ? 1 : -1,
    };
  }

  return { kind: 'fade', direction: 0 };
}

/**
 * Computes horizontal direction (+1 | -1) when switching between subjects in canonical order.
 */
export function computeSubjectSwitchDirection(
  prevSubj: SubjectId,
  nextSubj: SubjectId
): -1 | 0 | 1 {
  if (prevSubj === nextSubj) return 0;
  const prevIdx = SUBJECT_IDS.indexOf(prevSubj);
  const nextIdx = SUBJECT_IDS.indexOf(nextSubj);
  if (prevIdx === -1 || nextIdx === -1) return 1;
  return nextIdx > prevIdx ? 1 : -1;
}
