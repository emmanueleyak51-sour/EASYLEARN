import test from 'node:test';
import assert from 'node:assert/strict';
import { getTopics, SUBJECT_IDS } from '../data/curriculum';
import { makeBlankProgress } from './engine';
import {
  buildStandingFromProgress,
  computeHeadToHead,
  computeMasteryIndexBreakdown,
  getDivisionForIndex,
  getNationalDivisionBenchmarks,
  getStandingElementalRank,
  rankLeaderboardEntries,
  sanitizeCampusGoal,
  sanitizeLeaderboardName,
  type LeaderboardStanding,
} from './leaderboardLogic';

test('computeMasteryIndexBreakdown scales smartness-weighted RP from 0 to 1000', () => {
  const zero = computeMasteryIndexBreakdown({
    topicsPassed: 0,
    totalAnswered: 0,
    accuracyPct: 0,
    bestCbtScore: 0,
    streakCount: 0,
    duelsCompleted: 0,
  });
  assert.equal(zero.total, 0);

  // 1 lucky correct question should NOT award high accuracy RP
  const lucky = computeMasteryIndexBreakdown({
    topicsPassed: 0,
    totalAnswered: 1,
    accuracyPct: 100,
    bestCbtScore: 0,
    streakCount: 0,
    duelsCompleted: 0,
  });
  assert.ok(lucky.accuracyPoints < 5, `Expected volume-damped accuracy, got ${lucky.accuracyPoints}`);

  // Full mastery across 90+ topics, 300+ Qs at 100%, 400 CBT caps cleanly at 1000 RP
  const apex = computeMasteryIndexBreakdown({
    topicsPassed: 95,
    totalAnswered: 500,
    accuracyPct: 100,
    bestCbtScore: 400,
    streakCount: 30,
    duelsCompleted: 12,
  });
  assert.equal(apex.total, 1000);
  assert.equal(apex.topicsPoints, 420);
  assert.equal(apex.accuracyPoints, 320);
  assert.equal(apex.cbtPoints, 180);
  assert.equal(apex.consistencyPoints, 80);
});

test('getDivisionForIndex and getStandingElementalRank map Elemental Ranks and Heading-To targets', () => {
  assert.equal(getDivisionForIndex(0).current.id, 'unranked');
  assert.equal(getDivisionForIndex(80).current.id, 'terra');
  assert.equal(getDivisionForIndex(190).current.id, 'frost');
  assert.equal(getDivisionForIndex(320).current.id, 'ember');
  assert.equal(getDivisionForIndex(620).current.id, 'volt');
  assert.equal(getDivisionForIndex(965).current.id, 'solar');
  assert.equal(getDivisionForIndex(980).next, null);
  assert.equal(getDivisionForIndex(980).tierProgressPct, 100);
});

test('buildStandingFromProgress constructs Firestore-safe standing across all 49 subjects', () => {
  const allTopicsBySubj = Object.fromEntries(
    SUBJECT_IDS.map((sid) => [sid, getTopics(sid)])
  ) as Record<(typeof SUBJECT_IDS)[number], ReturnType<typeof getTopics>>;

  const p = makeBlankProgress();
  p.name = '  Chinedu Okeke  ';
  p.subj = 'phys';
  p.streak = { d: 20000, n: 8 };
  p.hist = Array.from({ length: 120 }, (_, i) => [`q-${i}`, i < 96 ? 1 : 0, 20000] as [string, number, number]);
  p.cbtHistory = [
    {
      id: 'cbt-1',
      mode: 'jamb',
      dateDay: 20000,
      subjects: ['maths', 'phys', 'chem', 'eng'],
      scaledScore: 312,
      maxScale: 400,
      rawCorrect: 31,
      totalQuestions: 40,
      durationSec: 900,
    },
  ];
  for (let i = 0; i < 12; i++) {
    const tid = allTopicsBySubj.phys[i].id;
    p.t[tid] = { att: [[1, 5], [1, 5], [1, 5]], lesson: 1, practice: 1, boss: 1 };
  }

  const standing = buildStandingFromProgress(p, allTopicsBySubj, {
    uid: 'user-chinedu',
    campusGoal: 'UI · Mechanical Engineering',
    isPublic: true,
  });

  assert.equal(standing.displayName, 'Chinedu Okeke');
  assert.equal(standing.topicsPassed, 12);
  assert.equal(standing.accuracyPct, 80);
  assert.equal(standing.bestCbtScore, 312);
  assert.equal(standing.streakCount, 8);
  assert.equal(Object.keys(standing.subjectMastery).length, 49);
  assert.ok((standing.subjectMastery.phys || 0) > 0);
  const el = getStandingElementalRank(standing);
  assert.equal(el.currentRank?.id, 'terra');
  assert.equal(el.nextLabel, 'Frost I');
});

test('rankLeaderboardEntries attaches Elemental Rank + Heading-To target and sorts accurately', () => {
  const entries: LeaderboardStanding[] = [
    ...getNationalDivisionBenchmarks(),
    {
      uid: 'u-ada',
      displayName: 'Adaeze Nwosu',
      campusGoal: 'UNILAG · Medicine',
      primarySubj: 'bio',
      isPublic: true,
      masteryIndex: 780,
      topicsPassed: 68,
      totalAnswered: 1020,
      accuracyPct: 89,
      bestCbtScore: 332,
      streakCount: 28,
      duelsCompleted: 6,
      subjectMastery: { bio: 98, maths: 78 },
    },
  ];

  // Overall sort: Solar Gate (970) > Aether Gate (895) > Adaeze (780, Plasma -> Heading to Aether)
  const byIndex = rankLeaderboardEntries(entries, 'masteryIndex', 'all');
  assert.equal(byIndex[0].entry.uid, 'benchmark-solar');
  assert.equal(byIndex[0].elemental.currentLabel, 'Solar');
  assert.equal(byIndex[0].elemental.nextLabel, null);
  assert.equal(byIndex[2].entry.uid, 'u-ada');
  assert.equal(byIndex[2].elemental.currentLabel, 'Plasma');
  assert.equal(byIndex[2].elemental.nextLabel, 'Aether');

  // Subject filter (Biology): Adaeze (98%) beats Solar Gate (93%)
  const byBio = rankLeaderboardEntries(entries, 'masteryIndex', 'bio');
  assert.equal(byBio[0].entry.uid, 'u-ada');
  assert.equal(byBio[0].scoreValue, 98);

  // Streak sort: Adaeze (28d) beats Solar Gate (25d)
  const byStreak = rankLeaderboardEntries(entries, 'streakCount', 'all');
  assert.equal(byStreak[0].entry.uid, 'u-ada');

  // Search by element ("plasma" or "aether") preserves global rank (#3)
  const filtered = rankLeaderboardEntries(entries, 'masteryIndex', 'all', 'unilag');
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].rank, 3);
});

test('sanitizers enforce Firestore blueprint maxLengths and head-to-head deltas are signed correctly', () => {
  assert.equal(sanitizeLeaderboardName('   '), 'Scholar');
  assert.equal(sanitizeLeaderboardName('A'.repeat(120)).length, 60);
  assert.equal(sanitizeCampusGoal('B'.repeat(120)).length, 48);

  const [top, lower] = getNationalDivisionBenchmarks();
  const h2h = computeHeadToHead(lower, top);
  assert.equal(h2h.length, 5);
  assert.equal(h2h[0].delta, lower.masteryIndex - top.masteryIndex);
  assert.ok(h2h[0].delta < 0);
});
