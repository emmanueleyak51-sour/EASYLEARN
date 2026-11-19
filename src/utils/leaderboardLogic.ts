import type { SubjectId, Topic, UserProgress } from '../types';
import { SUBJECT_IDS } from '../data/curriculum';
import { mpct, tstate } from './engine';

export type LeaderboardCriterion =
  | 'masteryIndex'
  | 'topicsPassed'
  | 'accuracyPct'
  | 'bestCbtScore'
  | 'streakCount';

export type LeaderboardDivisionId =
  | 'rising'
  | 'merit'
  | 'distinction'
  | 'first-class'
  | 'chancellor';

export interface LeaderboardDivision {
  id: LeaderboardDivisionId;
  title: string;
  minIndex: number;
  tagline: string;
  accentTone: 'slate' | 'sky' | 'emerald' | 'indigo' | 'amber';
}

export const LEADERBOARD_DIVISIONS: LeaderboardDivision[] = [
  {
    id: 'rising',
    title: 'Rising Scholar',
    minIndex: 0,
    tagline: 'Building daily rhythm across core syllabus topics',
    accentTone: 'slate',
  },
  {
    id: 'merit',
    title: 'Merit Division',
    minIndex: 260,
    tagline: 'Consistent mastery & disciplined accuracy',
    accentTone: 'sky',
  },
  {
    id: 'distinction',
    title: 'Distinction League',
    minIndex: 480,
    tagline: 'Exam-ready WAEC & JAMB pace across faculties',
    accentTone: 'emerald',
  },
  {
    id: 'first-class',
    title: 'First Class Honours',
    minIndex: 680,
    tagline: 'Elite top-tier command of syllabus & timed CBTs',
    accentTone: 'indigo',
  },
  {
    id: 'chancellor',
    title: "Chancellor's List",
    minIndex: 850,
    tagline: 'National apex performance across subjects',
    accentTone: 'amber',
  },
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
 * Pure, transparent 0-1,000 Academic Mastery Index (ZERO XP):
 *  - Topics Passed:      up to 400 pts (16 pts per passed topic, capped at 25 passed topics for full 400)
 *  - Weighted Accuracy:  up to 250 pts (accuracyPct * volume confidence up to 60 answered questions)
 *  - Best CBT Score:     up to 200 pts (normalized to JAMB /400 scale)
 *  - Consistency:        up to 150 pts (streak days * 6 up to 90 + duels/theory completions up to 60)
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
  const safeTopics = Math.max(0, Math.floor(input.topicsPassed || 0));
  const safeAnswered = Math.max(0, Math.floor(input.totalAnswered || 0));
  const safeAcc = Math.min(100, Math.max(0, Math.round(input.accuracyPct || 0)));
  const safeCbt = Math.min(400, Math.max(0, Math.round(input.bestCbtScore || 0)));
  const safeStreak = Math.max(0, Math.floor(input.streakCount || 0));
  const safeDuels = Math.max(0, Math.floor(input.duelsCompleted || 0));
  const safeTheory = Math.max(0, Math.floor(input.theoryCount || 0));

  const topicsPoints = Math.min(400, Math.round((Math.min(safeTopics, 25) / 25) * 400));
  const volumeWeight = Math.min(1, safeAnswered / 60);
  const accuracyPoints = Math.min(250, Math.round((safeAcc / 100) * volumeWeight * 250));
  const cbtPoints = Math.min(200, Math.round((safeCbt / 400) * 200));
  const streakPts = Math.min(90, safeStreak * 6);
  const challengePts = Math.min(60, (safeDuels + safeTheory) * 10);
  const consistencyPoints = Math.min(150, streakPts + challengePts);

  const total = Math.min(1000, topicsPoints + accuracyPoints + cbtPoints + consistencyPoints);
  return { total, topicsPoints, accuracyPoints, cbtPoints, consistencyPoints };
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
  const accuracyPct = totalAnswered > 0 ? Math.min(100, Math.round((rightAns / totalAnswered) * 100)) : 0;

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
 * National Examination Benchmark Standards (transparent academic targets, NOT fake users).
 * Used when comparing personal progress against national division cut-offs.
 */
export function getNationalDivisionBenchmarks(): LeaderboardStanding[] {
  return [
    {
      uid: 'benchmark-chancellor',
      displayName: "Chancellor's Cut-Off",
      campusGoal: 'National Top 1% Standard',
      primarySubj: 'maths',
      isPublic: true,
      masteryIndex: 850,
      topicsPassed: 24,
      totalAnswered: 320,
      accuracyPct: 92,
      bestCbtScore: 348,
      streakCount: 14,
      duelsCompleted: 5,
      subjectMastery: {
        maths: 90, fmaths: 88, chem: 88, phys: 89, bio: 86, agric: 85,
        geog: 84, econ: 86, eng: 91, civic: 88, digitech: 87, dataproc: 89,
      },
      isBenchmark: true,
    },
    {
      uid: 'benchmark-first-class',
      displayName: 'First Class Cut-Off',
      campusGoal: 'Competitive Merit Admission',
      primarySubj: 'phys',
      isPublic: true,
      masteryIndex: 680,
      topicsPassed: 18,
      totalAnswered: 210,
      accuracyPct: 84,
      bestCbtScore: 304,
      streakCount: 10,
      duelsCompleted: 3,
      subjectMastery: {
        maths: 78, fmaths: 74, chem: 76, phys: 77, bio: 75, agric: 74,
        geog: 73, econ: 75, eng: 80, civic: 76, digitech: 75, dataproc: 77,
      },
      isBenchmark: true,
    },
    {
      uid: 'benchmark-distinction',
      displayName: 'Distinction Cut-Off',
      campusGoal: 'WAEC A1 / JAMB 270+ Pace',
      primarySubj: 'chem',
      isPublic: true,
      masteryIndex: 480,
      topicsPassed: 12,
      totalAnswered: 120,
      accuracyPct: 76,
      bestCbtScore: 270,
      streakCount: 7,
      duelsCompleted: 2,
      subjectMastery: {
        maths: 65, fmaths: 60, chem: 64, phys: 63, bio: 64, agric: 62,
        geog: 61, econ: 63, eng: 68, civic: 65, digitech: 62, dataproc: 64,
      },
      isBenchmark: true,
    },
    {
      uid: 'benchmark-merit',
      displayName: 'Merit Division Cut-Off',
      campusGoal: 'Credit Pass Foundation',
      primarySubj: 'eng',
      isPublic: true,
      masteryIndex: 260,
      topicsPassed: 6,
      totalAnswered: 60,
      accuracyPct: 68,
      bestCbtScore: 220,
      streakCount: 4,
      duelsCompleted: 1,
      subjectMastery: {
        maths: 45, fmaths: 40, chem: 44, phys: 43, bio: 44, agric: 42,
        geog: 41, econ: 43, eng: 48, civic: 45, digitech: 42, dataproc: 44,
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

  const rankedAll: RankedLeaderboardRow[] = sorted.map((entry, idx) => ({
    rank: idx + 1,
    entry,
    scoreValue: getCriterionValue(entry, criterion, subjectFilter),
    division: getDivisionForIndex(entry.masteryIndex).current,
  }));

  if (!q) return rankedAll;

  return rankedAll.filter(
    (row) =>
      row.entry.displayName.toLowerCase().includes(q) ||
      row.entry.campusGoal.toLowerCase().includes(q) ||
      row.division.title.toLowerCase().includes(q)
  );
}

export function computeHeadToHead(
  self: LeaderboardStanding,
  rival: LeaderboardStanding
): HeadToHeadDelta[] {
  return [
    {
      metric: 'Mastery Index',
      selfVal: self.masteryIndex,
      rivalVal: rival.masteryIndex,
      unit: '/1000',
      delta: self.masteryIndex - rival.masteryIndex,
    },
    {
      metric: 'Topics Mastered',
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
      metric: 'Best CBT',
      selfVal: self.bestCbtScore,
      rivalVal: rival.bestCbtScore,
      unit: '/400',
      delta: self.bestCbtScore - rival.bestCbtScore,
    },
    {
      metric: 'Study Streak',
      selfVal: self.streakCount,
      rivalVal: rival.streakCount,
      unit: 'days',
      delta: self.streakCount - rival.streakCount,
    },
  ];
}
