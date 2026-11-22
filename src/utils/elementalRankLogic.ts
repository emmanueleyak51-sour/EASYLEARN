import type { SubjectId, Topic, UserProgress } from '../types';

export type ElementalRankId =
  | 'terra'
  | 'frost'
  | 'ember'
  | 'tempest'
  | 'volt'
  | 'plasma'
  | 'aether'
  | 'solar';

export interface ElementalRankDef {
  id: ElementalRankId;
  order: number;
  element: string;
  symbol: string;
  tierGroup: 'bronze' | 'silver' | 'gold' | 'mythic';
  hasSubDivisions: boolean;
  minRp: number;
  minTopicsPassed: number;
  minAnswered: number;
  minAccuracyPct: number;
  minCbtScore: number;
  xpBonus: number;
  accentHex: string;
  glowRgba: string;
}

/**
 * 8 Hard-Earned Elemental Ranks.
 * Every tier requires BOTH steep Rank Points (RP) AND strict Smartness Gates
 * (overall accuracy %, syllabus Topic Tests passed, answered volume, and JAMB/WAEC CBT score),
 * so a student's Elemental Emblem immediately reveals how smart and consistent they truly are.
 */
export const ELEMENTAL_RANKS: readonly ElementalRankDef[] = [
  {
    id: 'terra',
    order: 1,
    element: 'Terra',
    symbol: 'Earth',
    tierGroup: 'bronze',
    hasSubDivisions: true,
    minRp: 80,
    minTopicsPassed: 4,
    minAnswered: 60,
    minAccuracyPct: 60,
    minCbtScore: 0,
    xpBonus: 150,
    accentHex: '#D97706',
    glowRgba: 'rgba(217, 119, 6, 0.35)',
  },
  {
    id: 'frost',
    order: 2,
    element: 'Frost',
    symbol: 'Ice',
    tierGroup: 'bronze',
    hasSubDivisions: true,
    minRp: 190,
    minTopicsPassed: 10,
    minAnswered: 150,
    minAccuracyPct: 66,
    minCbtScore: 0,
    xpBonus: 250,
    accentHex: '#38BDF8',
    glowRgba: 'rgba(56, 189, 248, 0.38)',
  },
  {
    id: 'ember',
    order: 3,
    element: 'Ember',
    symbol: 'Flame',
    tierGroup: 'silver',
    hasSubDivisions: true,
    minRp: 320,
    minTopicsPassed: 18,
    minAnswered: 280,
    minAccuracyPct: 72,
    minCbtScore: 210,
    xpBonus: 400,
    accentHex: '#F97316',
    glowRgba: 'rgba(249, 115, 22, 0.4)',
  },
  {
    id: 'tempest',
    order: 4,
    element: 'Tempest',
    symbol: 'Gale',
    tierGroup: 'silver',
    hasSubDivisions: true,
    minRp: 470,
    minTopicsPassed: 30,
    minAnswered: 450,
    minAccuracyPct: 78,
    minCbtScore: 250,
    xpBonus: 600,
    accentHex: '#10B981',
    glowRgba: 'rgba(16, 185, 129, 0.4)',
  },
  {
    id: 'volt',
    order: 5,
    element: 'Volt',
    symbol: 'Thunder',
    tierGroup: 'gold',
    hasSubDivisions: true,
    minRp: 620,
    minTopicsPassed: 46,
    minAnswered: 680,
    minAccuracyPct: 83,
    minCbtScore: 285,
    xpBonus: 900,
    accentHex: '#3B82F6',
    glowRgba: 'rgba(59, 130, 246, 0.45)',
  },
  {
    id: 'plasma',
    order: 6,
    element: 'Plasma',
    symbol: 'Fusion',
    tierGroup: 'gold',
    hasSubDivisions: false,
    minRp: 760,
    minTopicsPassed: 64,
    minAnswered: 960,
    minAccuracyPct: 88,
    minCbtScore: 315,
    xpBonus: 1300,
    accentHex: '#C084FC',
    glowRgba: 'rgba(192, 132, 252, 0.48)',
  },
  {
    id: 'aether',
    order: 7,
    element: 'Aether',
    symbol: 'Cosmos',
    tierGroup: 'mythic',
    hasSubDivisions: false,
    minRp: 885,
    minTopicsPassed: 85,
    minAnswered: 1300,
    minAccuracyPct: 92,
    minCbtScore: 345,
    xpBonus: 1800,
    accentHex: '#818CF8',
    glowRgba: 'rgba(129, 140, 248, 0.5)',
  },
  {
    id: 'solar',
    order: 8,
    element: 'Solar',
    symbol: 'Apex Sun',
    tierGroup: 'mythic',
    hasSubDivisions: false,
    minRp: 965,
    minTopicsPassed: 110,
    minAnswered: 1750,
    minAccuracyPct: 95,
    minCbtScore: 370,
    xpBonus: 2500,
    accentHex: '#FACC15',
    glowRgba: 'rgba(250, 204, 21, 0.55)',
  },
] as const;

export interface ScholarSmartnessMetrics {
  rp: number;
  topicsPassed: number;
  totalAnswered: number;
  accuracyPct: number;
  bestCbtScore: number;
  streakCount?: number;
}

export interface ElementalRankBreakdown {
  total: number;
  topicsPoints: number;
  accuracyPoints: number;
  cbtPoints: number;
  consistencyPoints: number;
}

/**
 * Computes Smartness-Weighted Rank Points (0..1000 RP).
 * Unlike ordinary participation points:
 *  - High accuracy is squared so low-accuracy guessing cannot farm high RP.
 *  - Full topic points require 90+ passed syllabus Topic Tests.
 *  - Full accuracy confidence requires 300+ answered questions.
 */
export function computeElementalRpBreakdown(input: {
  topicsPassed: number;
  totalAnswered: number;
  accuracyPct: number;
  bestCbtScore: number;
  streakCount: number;
  duelsCompleted: number;
  theoryCount?: number;
}): ElementalRankBreakdown {
  const safeTopics = Math.max(0, Math.floor(input.topicsPassed || 0));
  const safeAnswered = Math.max(0, Math.floor(input.totalAnswered || 0));
  const safeAcc = Math.min(100, Math.max(0, Math.round(input.accuracyPct || 0)));
  const safeCbt = Math.min(400, Math.max(0, Math.round(input.bestCbtScore || 0)));
  const safeStreak = Math.max(0, Math.floor(input.streakCount || 0));
  const safeDuels = Math.max(0, Math.floor(input.duelsCompleted || 0));
  const safeTheory = Math.max(0, Math.floor(input.theoryCount || 0));

  // Up to 420 RP: steep syllabus mastery across 90 Topic Tests
  const topicsPoints = Math.min(420, Math.round((Math.min(safeTopics, 90) / 90) * 420));

  // Up to 320 RP: squared accuracy curve * volume confidence (full weight at 300+ answered)
  const accRatio = safeAcc / 100;
  const smartCurve = accRatio * accRatio;
  const volumeConfidence = Math.min(1, safeAnswered / 300);
  const accuracyPoints = Math.min(320, Math.round(smartCurve * volumeConfidence * 320));

  // Up to 180 RP: CBT exam excellence out of 400
  const cbtRatio = safeCbt / 400;
  const cbtPoints = Math.min(180, Math.round(Math.pow(cbtRatio, 1.25) * 180));

  // Up to 80 RP: disciplined streak & challenge completions
  const streakPts = Math.min(50, safeStreak * 2);
  const challengePts = Math.min(30, (safeDuels + safeTheory) * 3);
  const consistencyPoints = Math.min(80, streakPts + challengePts);

  const total = Math.min(1000, topicsPoints + accuracyPoints + cbtPoints + consistencyPoints);
  return { total, topicsPoints, accuracyPoints, cbtPoints, consistencyPoints };
}

export function meetsElementalRankGate(
  rank: ElementalRankDef,
  m: ScholarSmartnessMetrics
): boolean {
  return (
    m.rp >= rank.minRp &&
    m.topicsPassed >= rank.minTopicsPassed &&
    m.totalAnswered >= rank.minAnswered &&
    m.accuracyPct >= rank.minAccuracyPct &&
    m.bestCbtScore >= rank.minCbtScore
  );
}

/**
 * Computes completion percentage (0..100) toward a specific Elemental Rank across all active gates.
 */
export function computeGateCompletionPct(
  rank: ElementalRankDef,
  m: ScholarSmartnessMetrics
): number {
  const parts: number[] = [
    rank.minRp > 0 ? Math.min(1, Math.max(0, m.rp / rank.minRp)) : 1,
    rank.minTopicsPassed > 0
      ? Math.min(1, Math.max(0, m.topicsPassed / rank.minTopicsPassed))
      : 1,
    rank.minAnswered > 0 ? Math.min(1, Math.max(0, m.totalAnswered / rank.minAnswered)) : 1,
    rank.minAccuracyPct > 0
      ? Math.min(1, Math.max(0, m.accuracyPct / rank.minAccuracyPct))
      : 1,
  ];
  if (rank.minCbtScore > 0) {
    parts.push(Math.min(1, Math.max(0, m.bestCbtScore / rank.minCbtScore)));
  }
  const avg = parts.reduce((s, v) => s + v, 0) / parts.length;
  if (meetsElementalRankGate(rank, m)) return 100;
  return Math.min(99, Math.max(0, Math.round(avg * 100)));
}

export interface ElementalRankStanding {
  currentRank: ElementalRankDef | null;
  subDivision: 'I' | 'II' | 'III' | null;
  currentLabel: string;
  nextRank: ElementalRankDef | null;
  nextLabel: string | null;
  unlockedIds: ElementalRankId[];
  progressToNextPct: number;
  rp: number;
  rpToNext: number;
}

export function evaluateElementalRank(m: ScholarSmartnessMetrics): ElementalRankStanding {
  const clampedRp = Math.min(1000, Math.max(0, Math.round(m.rp || 0)));
  const normalized: ScholarSmartnessMetrics = {
    ...m,
    rp: clampedRp,
  };

  let highestIdx = -1;
  const unlockedIds: ElementalRankId[] = [];
  for (let i = 0; i < ELEMENTAL_RANKS.length; i++) {
    if (meetsElementalRankGate(ELEMENTAL_RANKS[i], normalized)) {
      highestIdx = i;
      unlockedIds.push(ELEMENTAL_RANKS[i].id);
    } else {
      // Ranks unlock strictly in ascending elemental order
      break;
    }
  }

  if (highestIdx < 0) {
    const first = ELEMENTAL_RANKS[0];
    return {
      currentRank: null,
      subDivision: null,
      currentLabel: 'Unranked',
      nextRank: first,
      nextLabel: 'Terra I',
      unlockedIds: [],
      progressToNextPct: computeGateCompletionPct(first, normalized),
      rp: clampedRp,
      rpToNext: Math.max(0, first.minRp - clampedRp),
    };
  }

  const currentRank = ELEMENTAL_RANKS[highestIdx];
  const nextRank = ELEMENTAL_RANKS[highestIdx + 1] || null;

  if (!nextRank) {
    return {
      currentRank,
      subDivision: null,
      currentLabel: currentRank.element,
      nextRank: null,
      nextLabel: null,
      unlockedIds,
      progressToNextPct: 100,
      rp: clampedRp,
      rpToNext: 0,
    };
  }

  // Compute progress within the current Element toward the next Element
  const rpSpan = Math.max(1, nextRank.minRp - currentRank.minRp);
  const rpIntoTier = Math.min(1, Math.max(0, (clampedRp - currentRank.minRp) / rpSpan));
  const gatePct = computeGateCompletionPct(nextRank, normalized);
  const progressToNextPct = Math.min(99, Math.max(0, Math.round(rpIntoTier * 55 + (gatePct / 100) * 45 * 100 / 100)));

  let subDivision: 'I' | 'II' | 'III' | null = null;
  if (currentRank.hasSubDivisions) {
    if (rpIntoTier >= 0.67 && gatePct >= 75) subDivision = 'III';
    else if (rpIntoTier >= 0.34 && gatePct >= 50) subDivision = 'II';
    else subDivision = 'I';
  }

  const currentLabel = subDivision ? `${currentRank.element} ${subDivision}` : currentRank.element;
  const nextLabel = nextRank.hasSubDivisions ? `${nextRank.element} I` : nextRank.element;

  return {
    currentRank,
    subDivision,
    currentLabel,
    nextRank,
    nextLabel,
    unlockedIds,
    progressToNextPct,
    rp: clampedRp,
    rpToNext: Math.max(0, nextRank.minRp - clampedRp),
  };
}

export function extractSmartnessMetricsFromProgress(
  p: UserProgress,
  allTopicsBySubj?: Partial<Record<SubjectId, Topic[]>>
): ScholarSmartnessMetrics {
  let topicsPassed = 0;
  if (allTopicsBySubj && Object.keys(allTopicsBySubj).length > 0) {
    for (const list of Object.values(allTopicsBySubj)) {
      if (!list) continue;
      for (const t of list) {
        if ((p.t?.[t.id]?.boss || 0) > 0) topicsPassed += 1;
      }
    }
  } else {
    topicsPassed = Object.values(p.t || {}).filter((st) => st && st.boss > 0).length;
  }

  const totalAnswered = p.hist.length;
  const rightAns = p.hist.reduce((s, h) => s + (h[1] === 1 ? 1 : 0), 0);
  const accuracyPct = totalAnswered > 0 ? Math.round((rightAns / totalAnswered) * 100) : 0;

  let bestCbtScore = 0;
  for (const c of p.cbtHistory || []) {
    if (!c || c.maxScale <= 0) continue;
    const norm = Math.round((c.scaledScore / c.maxScale) * 400);
    if (norm > bestCbtScore) bestCbtScore = norm;
  }

  const streakCount = Math.max(0, Math.floor(p.streak?.n || 0));
  const duelsCompleted = (p.duelHistory || []).length;
  const theoryCount = Object.keys(p.theoryScores || {}).length;

  const breakdown = computeElementalRpBreakdown({
    topicsPassed,
    totalAnswered,
    accuracyPct,
    bestCbtScore,
    streakCount,
    duelsCompleted,
    theoryCount,
  });

  return {
    rp: breakdown.total,
    topicsPassed,
    totalAnswered,
    accuracyPct,
    bestCbtScore,
    streakCount,
  };
}

export function getElementalRankById(id: ElementalRankId): ElementalRankDef {
  return ELEMENTAL_RANKS.find((r) => r.id === id) || ELEMENTAL_RANKS[0];
}
