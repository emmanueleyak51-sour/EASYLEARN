import type { SubjectId, Topic, UserProgress } from '../types';
import { SUBJECT_IDS } from '../data/curriculum';
import { mpct, tstate } from './engine';
import {
  ELEMENTAL_RANKS,
  computeElementalRpBreakdown,
  evaluateElementalRank,
  type ElementalRankId,
  type ElementalRankStanding,
} from './elementalRankLogic';

export type LeaderboardCriterion =
  | 'masteryIndex'
  | 'topicsPassed'
  | 'accuracyPct'
  | 'bestCbtScore'
  | 'streakCount';

export type LeaderboardDivisionId = 'unranked' | ElementalRankId;

export interface LeaderboardDivision {
  id: LeaderboardDivisionId;
  title: string;
  minIndex: number;
  tagline: string;
  accentTone: 'slate' | 'sky' | 'emerald' | 'indigo' | 'amber';
}

const UNRANKED_DIVISION: LeaderboardDivision = {
  id: 'unranked',
  title: 'Unranked',
  minIndex: 0,
  tagline: '60%+ acc · 4 topics · 60 Qs for Terra I',
  accentTone: 'slate',
};

const TONE_MAP: Record<ElementalRankId, LeaderboardDivision['accentTone']> = {
  terra: 'amber',
  frost: 'sky',
  ember: 'amber',
  tempest: 'emerald',
  volt: 'sky',
  plasma: 'indigo',
  aether: 'indigo',
  solar: 'amber',
};

export const LEADERBOARD_DIVISIONS: LeaderboardDivision[] = [
  UNRANKED_DIVISION,
  ...ELEMENTAL_RANKS.map((r) => ({
    id: r.id as LeaderboardDivisionId,
    title: r.element,
    minIndex: r.minRp,
    tagline: `${r.minAccuracyPct}%+ acc · ${r.minTopicsPassed} topics${
      r.minCbtScore > 0 ? ` · ${r.minCbtScore}+ mock` : ''
    }`,
    accentTone: TONE_MAP[r.id],
  })),
];

export const CAMPUS_GOAL_PRESETS = [
  'UNILAG · Medicine',
  'UI · Engineering',
  'OAU · Computer Science',
  'UNN · Pharmacy',
  'ABU · Architecture',
  'FUTA · Software Eng.',
  'LASU · Law & Econ',
  'Covenant · Sciences',
];

export interface LeaderboardStanding {
  uid: string;
  displayName: string;
  campusGoal: string;
  primarySubj: SubjectId;
  isPublic: boolean;
  masteryIndex: number;
  topicsPassed: number;
  totalAnswered: number;
  accuracyPct: number;
  bestCbtScore: number;
  streakCount: number;
  duelsCompleted: number;
  subjectMastery: Partial<Record<SubjectId, number>>;
  updatedAtMs?: number;
  isSelf?: boolean;
  isBenchmark?: boolean;
}

export interface MasteryIndexBreakdown {
  total: number;
  topicsPoints: number;
  accuracyPoints: number;
  cbtPoints: number;
  consistencyPoints: number;
}

export interface HeadToHeadDelta {
  metric: string;
  selfVal: number;
  rivalVal: number;
  unit: string;
  delta: number;
}

export function sanitizeLeaderboardName(raw: string): string {
  const clean = (raw || 'Scholar').replace(/\s+/g, ' ').trim().slice(0, 60);
  return clean.length >= 1 ? clean : 'Scholar';
}

export function sanitizeCampusGoal(raw: string): string {
  return (raw || '').replace(/\s+/g, ' ').trim().slice(0, 48);
}

/**
 * Smartness-Weighted 0–1,000 Rank Points (RP) breakdown:
 *  - Syllabus Topics Passed: up to 420 RP (90 Topic Tests for full 420)
 *  - Squared Accuracy Curve: up to 320 RP (accuracy^2 * volume confidence up to 300+ answered)
 *  - Best JAMB/WAEC CBT:     up to 180 RP (scaled out of 400)
 *  - Consistency & Duels:    up to 80 RP
 */
export function computeMasteryIndexBreakdown(input: {
  topicsPassed: number;
  totalAnswered: number;
  accuracyPct: number;
  bestCbtScore: number;
  streakCount: number;
  duelsCompleted: number;
  theoryCount?: number;
}): MasteryIndexBreakdown {
  return computeElementalRpBreakdown(input);
}

/**
 * Evaluates a scholar's exact Elemental Rank + sub-division (I / II / III) + "Heading to" target
 * from their full smartness metrics (RP, Accuracy %, Topics, Answered Qs, Best Mock).
 */
export function getStandingElementalRank(entry: LeaderboardStanding): ElementalRankStanding {
  return evaluateElementalRank({
    rp: entry.masteryIndex,
    topicsPassed: entry.topicsPassed,
    totalAnswered: entry.totalAnswered,
    accuracyPct: entry.accuracyPct,
    bestCbtScore: entry.bestCbtScore,
    streakCount: entry.streakCount,
  });
}

export function getDivisionForIndex(masteryIndex: number): {
  current: LeaderboardDivision;
  next: LeaderboardDivision | null;
  pointsToNext: number;
  tierProgressPct: number;
} {
  const clamped = Math.min(1000, Math.max(0, Math.round(masteryIndex || 0)));
  let idx = 0;
  for (let i = 0; i < LEADERBOARD_DIVISIONS.length; i++) {
    if (clamped >= LEADERBOARD_DIVISIONS[i].minIndex) idx = i;
  }
  const current = LEADERBOARD_DIVISIONS[idx];
  const next = LEADERBOARD_DIVISIONS[idx + 1] || null;
  if (!next) {
    return { current, next: null, pointsToNext: 0, tierProgressPct: 100 };
  }
  const span = Math.max(1, next.minIndex - current.minIndex);
  const pct = Math.min(100, Math.max(0, Math.round(((clamped - current.minIndex) / span) * 100)));
  return {
    current,
    next,
    pointsToNext: Math.max(0, next.minIndex - clamped),
    tierProgressPct: pct,
  };
}

/**
 * Computes a student's complete, Firestore-valid LeaderboardStanding from UserProgress.
 */
export function buildStandingFromProgress(
  progress: UserProgress,
  allTopicsBySubj: Record<SubjectId, Topic[]>,
  opts: { uid: string; campusGoal?: string; isPublic?: boolean }
): LeaderboardStanding {
  let topicsPassed = 0;
  const subjectMastery: Partial<Record<SubjectId, number>> = {};

  for (const sid of SUBJECT_IDS) {
    const list = allTopicsBySubj[sid] || [];
    if (!list.length) {
      subjectMastery[sid] = 0;
      continue;
    }
    let sumPct = 0;
    for (const t of list) {
      if (tstate(progress, t.id).boss) topicsPassed += 1;
      sumPct += mpct(progress, t.id);
    }
    subjectMastery[sid] = Math.min(100, Math.max(0, Math.round(sumPct / list.length)));
  }

  const totalAnswered = Math.min(100000, Math.max(0, progress.hist.length));
  const rightAns = progress.hist.filter((h) => h[1] === 1).length;
  const accuracyPct =
    totalAnswered > 0 ? Math.min(100, Math.round((rightAns / totalAnswered) * 100)) : 0;

  let bestCbtScore = 0;
  for (const c of progress.cbtHistory || []) {
    if (!c || c.maxScale <= 0) continue;
    const normalized400 = Math.round((c.scaledScore / c.maxScale) * 400);
    if (normalized400 > bestCbtScore) bestCbtScore = normalized400;
  }
  bestCbtScore = Math.min(400, Math.max(0, bestCbtScore));

  const streakCount = Math.min(3650, Math.max(0, Math.floor(progress.streak?.n || 0)));
  const duelsCompleted = Math.min(5000, Math.max(0, (progress.duelHistory || []).length));
  const theoryCount = Object.keys(progress.theoryScores || {}).length;

  const breakdown = computeMasteryIndexBreakdown({
    topicsPassed,
    totalAnswered,
    accuracyPct,
    bestCbtScore,
    streakCount,
    duelsCompleted,
    theoryCount,
  });

  return {
    uid: opts.uid,
    displayName: sanitizeLeaderboardName(progress.name || 'Scholar'),
    campusGoal: sanitizeCampusGoal(opts.campusGoal ?? 'National Scholar'),
    primarySubj: SUBJECT_IDS.includes(progress.subj) ? progress.subj : 'maths',
    isPublic: opts.isPublic !== false,
    masteryIndex: breakdown.total,
    topicsPassed: Math.min(500, topicsPassed),
    totalAnswered,
    accuracyPct,
    bestCbtScore,
    streakCount,
    duelsCompleted,
    subjectMastery,
    updatedAtMs: Date.now(),
    isSelf: true,
  };
}

/**
 * Elemental Rank Cut-Off Standards (transparent smartness targets across the climb).
 */
export function getNationalDivisionBenchmarks(): LeaderboardStanding[] {
  return [
    {
      uid: 'benchmark-solar',
      displayName: 'Solar Gate',
      campusGoal: '95%+ Acc · 370+ Mock',
      primarySubj: 'maths',
      isPublic: true,
      masteryIndex: 970,
      topicsPassed: 112,
      totalAnswered: 1800,
      accuracyPct: 96,
      bestCbtScore: 374,
      streakCount: 25,
      duelsCompleted: 10,
      subjectMastery: {
        maths: 96, fmaths: 94, chem: 95, phys: 95, bio: 93, agric: 92,
        geog: 91, econ: 93, eng: 96, civic: 94, digitech: 93, dataproc: 94,
      },
      isBenchmark: true,
    },
    {
      uid: 'benchmark-aether',
      displayName: 'Aether Gate',
      campusGoal: '92%+ Acc · 345+ Mock',
      primarySubj: 'phys',
      isPublic: true,
      masteryIndex: 895,
      topicsPassed: 88,
      totalAnswered: 1350,
      accuracyPct: 92,
      bestCbtScore: 348,
      streakCount: 18,
      duelsCompleted: 7,
      subjectMastery: {
        maths: 89, fmaths: 86, chem: 88, phys: 90, bio: 86, agric: 85,
        geog: 84, econ: 86, eng: 90, civic: 88, digitech: 86, dataproc: 88,
      },
      isBenchmark: true,
    },
    {
      uid: 'benchmark-volt',
      displayName: 'Volt Gate',
      campusGoal: '83%+ Acc · 285+ Mock',
      primarySubj: 'chem',
      isPublic: true,
      masteryIndex: 660,
      topicsPassed: 50,
      totalAnswered: 720,
      accuracyPct: 84,
      bestCbtScore: 292,
      streakCount: 12,
      duelsCompleted: 4,
      subjectMastery: {
        maths: 76, fmaths: 72, chem: 78, phys: 76, bio: 74, agric: 72,
        geog: 71, econ: 74, eng: 79, civic: 75, digitech: 73, dataproc: 75,
      },
      isBenchmark: true,
    },
    {
      uid: 'benchmark-ember',
      displayName: 'Ember Gate',
      campusGoal: '72%+ Acc · 210+ Mock',
      primarySubj: 'bio',
      isPublic: true,
      masteryIndex: 365,
      topicsPassed: 20,
      totalAnswered: 310,
      accuracyPct: 74,
      bestCbtScore: 224,
      streakCount: 7,
      duelsCompleted: 2,
      subjectMastery: {
        maths: 56, fmaths: 50, chem: 55, phys: 54, bio: 58, agric: 53,
        geog: 52, econ: 54, eng: 60, civic: 56, digitech: 53, dataproc: 55,
      },
      isBenchmark: true,
    },
    {
      uid: 'benchmark-terra',
      displayName: 'Terra Gate',
      campusGoal: '60%+ Acc · 4 Topics',
      primarySubj: 'eng',
      isPublic: true,
      masteryIndex: 105,
      topicsPassed: 5,
      totalAnswered: 75,
      accuracyPct: 62,
      bestCbtScore: 0,
      streakCount: 3,
      duelsCompleted: 1,
      subjectMastery: {
        maths: 28, fmaths: 22, chem: 26, phys: 25, bio: 27, agric: 24,
        geog: 24, econ: 25, eng: 32, civic: 28, digitech: 25, dataproc: 26,
      },
      isBenchmark: true,
    },
  ];
}

export function getCriterionValue(
  entry: LeaderboardStanding,
  criterion: LeaderboardCriterion,
  subjectFilter: SubjectId | 'all'
): number {
  if (subjectFilter !== 'all' && criterion === 'masteryIndex') {
    return Math.min(100, Math.max(0, Math.round(entry.subjectMastery?.[subjectFilter] || 0)));
  }
  switch (criterion) {
    case 'topicsPassed':
      return entry.topicsPassed;
    case 'accuracyPct':
      return entry.accuracyPct;
    case 'bestCbtScore':
      return entry.bestCbtScore;
    case 'streakCount':
      return entry.streakCount;
    case 'masteryIndex':
    default:
      return entry.masteryIndex;
  }
}

export interface RankedLeaderboardRow {
  rank: number;
  entry: LeaderboardStanding;
  scoreValue: number;
  division: LeaderboardDivision;
  elemental: ElementalRankStanding;
}

export function rankLeaderboardEntries(
  entries: LeaderboardStanding[],
  criterion: LeaderboardCriterion,
  subjectFilter: SubjectId | 'all',
  searchQuery = ''
): RankedLeaderboardRow[] {
  const q = searchQuery.trim().toLowerCase();

  // Deduplicate by uid (preferring live/self freshest record)
  const byUid = new Map<string, LeaderboardStanding>();
  for (const item of entries) {
    const prev = byUid.get(item.uid);
    if (!prev || item.isSelf) {
      byUid.set(item.uid, item);
    }
  }

  const sorted = Array.from(byUid.values()).sort((a, b) => {
    const va = getCriterionValue(a, criterion, subjectFilter);
    const vb = getCriterionValue(b, criterion, subjectFilter);
    if (vb !== va) return vb - va;
    if (b.masteryIndex !== a.masteryIndex) return b.masteryIndex - a.masteryIndex;
    if (b.topicsPassed !== a.topicsPassed) return b.topicsPassed - a.topicsPassed;
    if (b.accuracyPct !== a.accuracyPct) return b.accuracyPct - a.accuracyPct;
    if (b.totalAnswered !== a.totalAnswered) return b.totalAnswered - a.totalAnswered;
    return a.displayName.localeCompare(b.displayName);
  });

  const rankedAll: RankedLeaderboardRow[] = sorted.map((entry, idx) => {
    const elemental = getStandingElementalRank(entry);
    const divId: LeaderboardDivisionId = elemental.currentRank ? elemental.currentRank.id : 'unranked';
    const division =
      LEADERBOARD_DIVISIONS.find((d) => d.id === divId) || UNRANKED_DIVISION;
    return {
      rank: idx + 1,
      entry,
      scoreValue: getCriterionValue(entry, criterion, subjectFilter),
      division,
      elemental,
    };
  });

  if (!q) return rankedAll;

  return rankedAll.filter(
    (row) =>
      row.entry.displayName.toLowerCase().includes(q) ||
      row.entry.campusGoal.toLowerCase().includes(q) ||
      row.elemental.currentLabel.toLowerCase().includes(q) ||
      (row.elemental.nextLabel || '').toLowerCase().includes(q)
  );
}

export function computeHeadToHead(
  self: LeaderboardStanding,
  rival: LeaderboardStanding
): HeadToHeadDelta[] {
  return [
    {
      metric: 'Rank Points',
      selfVal: self.masteryIndex,
      rivalVal: rival.masteryIndex,
      unit: 'RP',
      delta: self.masteryIndex - rival.masteryIndex,
    },
    {
      metric: 'Topics Passed',
      selfVal: self.topicsPassed,
      rivalVal: rival.topicsPassed,
      unit: 'topics',
      delta: self.topicsPassed - rival.topicsPassed,
    },
    {
      metric: 'Accuracy',
      selfVal: self.accuracyPct,
      rivalVal: rival.accuracyPct,
      unit: '%',
      delta: self.accuracyPct - rival.accuracyPct,
    },
    {
      metric: 'Best Mock',
      selfVal: self.bestCbtScore,
      rivalVal: rival.bestCbtScore,
      unit: '/400',
      delta: self.bestCbtScore - rival.bestCbtScore,
    },
    {
      metric: 'Streak',
      selfVal: self.streakCount,
      rivalVal: rival.streakCount,
      unit: 'd',
      delta: self.streakCount - rival.streakCount,
    },
  ];
}
