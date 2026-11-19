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
  rankLeaderboardEntries,
  sanitizeCampusGoal,
  sanitizeLeaderboardName,
  type LeaderboardStanding,
} from './leaderboardLogic';

test('computeMasteryIndexBreakdown scales transparently from 0 to 1000 with volume-weighted accuracy', () => {
  const zero = computeMasteryIndexBreakdown({
    topicsPassed: 0,
    totalAnswered: 0,
    accuracyPct: 0,
    bestCbtScore: 0,
    streakCount: 0,
    duelsCompleted: 0,
  });
  assert.equal(zero.total, 0);

  // 1 lucky correct question should NOT award full 250 accuracy points
  const lucky = computeMasteryIndexBreakdown({
    topicsPassed: 0,
    totalAnswered: 1,
    accuracyPct: 100,
    bestCbtScore: 0,
    streakCount: 0,
    duelsCompleted: 0,
  });
  assert.ok(lucky.accuracyPoints < 15, `Expected volume-damped accuracy, got ${lucky.accuracyPoints}`);

  // Full mastery caps cleanly at 1000
  const apex = computeMasteryIndexBreakdown({
    topicsPassed: 40,
    totalAnswered: 500,
    accuracyPct: 100,
    bestCbtScore: 400,
    streakCount: 30,
    duelsCompleted: 12,
  });
  assert.equal(apex.total, 1000);
  assert.equal(apex.topicsPoints, 400);
  assert.equal(apex.accuracyPoints, 250);
  assert.equal(apex.cbtPoints, 200);
  assert.equal(apex.consistencyPoints, 150);
});

test('getDivisionForIndex maps all 5 Academic Divisions and computes next-tier gaps accurately', () => {
  assert.equal(getDivisionForIndex(0).current.id, 'rising');
  assert.equal(getDivisionForIndex(0).pointsToNext, 260);
  assert.equal(getDivisionForIndex(260).current.id, 'merit');
  assert.equal(getDivisionForIndex(480).current.id, 'distinction');
  assert.equal(getDivisionForIndex(680).current.id, 'first-class');
  assert.equal(getDivisionForIndex(850).current.id, 'chancellor');
  assert.equal(getDivisionForIndex(950).next, null);
  assert.equal(getDivisionForIndex(950).tierProgressPct, 100);
});

test('buildStandingFromProgress constructs Firestore-safe standing across all 12 subjects', () => {
  const allTopicsBySubj = Object.fromEntries(
    SUBJECT_IDS.map((sid) => [sid, getTopics(sid)])
  ) as Record<(typeof SUBJECT_IDS)[number], ReturnType<typeof getTopics>>;

  const p = makeBlankProgress();
  p.name = '  Chinedu Okeke  ';
  p.subj = 'phys';
  p.streak = { d: 20000, n: 8 };
  p.hist = Array.from({ length: 60 }, (_, i) => [`q-${i}`, i < 48 ? 1 : 0, 20000] as [string, number, number]);
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
  for (let i = 0; i < 5; i++) {
    const tid = allTopicsBySubj.phys[i].id;
    p.t[tid] = { att: [[1, 5], [1, 5], [1, 5]], lesson: 1, practice: 1, boss: 1 };
  }

  const standing = buildStandingFromProgress(p, allTopicsBySubj, {
    uid: 'user-chinedu',
    campusGoal: 'UI · Mechanical Engineering',
    isPublic: true,
  });

  assert.equal(standing.displayName, 'Chinedu Okeke');
  assert.equal(standing.topicsPassed, 5);
  assert.equal(standing.accuracyPct, 80);
  assert.equal(standing.bestCbtScore, 312);
  assert.equal(standing.streakCount, 8);
  assert.equal(Object.keys(standing.subjectMastery).length, 12);
  assert.ok((standing.subjectMastery.phys || 0) > 0);
  assert.ok(standing.masteryIndex >= 400 && standing.masteryIndex <= 1000);
});

test('rankLeaderboardEntries sorts accurately by criterion, subject filter, and preserves global rank under search', () => {
  const entries: LeaderboardStanding[] = [
    ...getNationalDivisionBenchmarks(),
    {
      uid: 'u-ada',
      displayName: 'Adaeze Nwosu',
      campusGoal: 'UNILAG · Medicine',
      primarySubj: 'bio',
      isPublic: true,
      masteryIndex: 720,
      topicsPassed: 20,
      totalAnswered: 260,
      accuracyPct: 88,
      bestCbtScore: 332,
      streakCount: 16,
      duelsCompleted: 4,
      subjectMastery: { bio: 96, maths: 70 },
    },
  ];

  // Overall sort: Chancellor benchmark (850) > Adaeze (720) > First Class (680)
  const byIndex = rankLeaderboardEntries(entries, 'masteryIndex', 'all');
  assert.equal(byIndex[0].entry.uid, 'benchmark-chancellor');
  assert.equal(byIndex[1].entry.uid, 'u-ada');
  assert.equal(byIndex[1].rank, 2);

  // Subject filter (Biology): Adaeze (96%) beats Chancellor benchmark (86%)
  const byBio = rankLeaderboardEntries(entries, 'masteryIndex', 'bio');
  assert.equal(byBio[0].entry.uid, 'u-ada');
  assert.equal(byBio[0].scoreValue, 96);

  // Streak sort: Adaeze (16d) beats Chancellor benchmark (14d)
  const byStreak = rankLeaderboardEntries(entries, 'streakCount', 'all');
  assert.equal(byStreak[0].entry.uid, 'u-ada');

  // Search preserves global rank (#2)
  const filtered = rankLeaderboardEntries(entries, 'masteryIndex', 'all', 'unilag');
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].rank, 2);
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
