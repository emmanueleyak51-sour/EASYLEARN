import test from 'node:test';
import assert from 'node:assert/strict';
import type { UserProgress } from '../types';
import {
  buildCompactProgressMap,
  decideDocUpsertAction,
  deserializeTopicProgressFromFirestore,
  mergeCloudProgress,
  sanitizeFirestoreValue,
} from './cloudSyncCodec';

function assertNoNestedArraysOrUndefined(value: unknown, path = 'root'): void {
  assert.notEqual(value, undefined, `Found undefined at ${path}`);
  if (typeof value === 'number') {
    assert.equal(Number.isFinite(value), true, `Found non-finite number at ${path}`);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, idx) => {
      assert.equal(
        Array.isArray(item),
        false,
        `Found forbidden Firestore nested array at ${path}[${idx}]`
      );
      assertNoNestedArraysOrUndefined(item, `${path}[${idx}]`);
    });
    return;
  }
  if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      assertNoNestedArraysOrUndefined(v, `${path}.${k}`);
    }
  }
}

function createSampleProgress(): UserProgress {
  return {
    name: 'Emmanuel',
    target: 85,
    dx: 1,
    subj: 'maths',
    subjs: ['maths', 'phys', 'chem', 'eng'],
    sx: {},
    t: {
      'm-num-bases': {
        att: [
          [1, 1],
          [0, 2],
          [1, 2],
          [1, 3],
        ],
        lesson: 1,
        practice: 1,
        boss: 1,
      },
      'p-kinematics': {
        att: [
          [1, 1],
          [1, 2],
        ],
        lesson: 1,
        practice: 0,
        boss: 0,
      },
    },
    hist: [['q1', 1, 20000]],
    rev: {},
    streak: { d: 20000, n: 6 },
    muted: false,
    flags: { intro: 1 },
    cust: { add: [], edit: {}, del: {} },
    xp: 420,
    badges: { first: 1 },
    act: { 20000: 12 },
    run: 3,
    revok: 2,
    pro: null,
    owner: 0,
    sales: [],
    ob: 1,
    dev: 'dev-1',
    studyPlan: {
      examType: 'jamb',
      examDateIso: '2026-04-20',
      dailyMinutes: 45,
      focusSubjects: ['maths', 'phys', 'chem', 'eng'],
    },
    cbtHistory: [
      {
        id: 'cbt-1',
        mode: 'jamb',
        dateDay: 20000,
        subjects: ['maths', 'phys', 'chem', 'eng'],
        scaledScore: 312,
        maxScale: 400,
        rawCorrect: 31,
        totalQuestions: 40,
        durationSec: 1800,
      },
    ],
    leaderboardCampusGoal: 'UNILAG · Engineering',
    leaderboardPublic: true,
  };
}

test('buildCompactProgressMap eliminates nested arrays from TopicProgress.att and strips undefined', () => {
  const sample = createSampleProgress();
  const compact = buildCompactProgressMap(sample);

  assertNoNestedArraysOrUndefined(compact);

  const tMap = compact.t as Record<string, { att: { ok: number; lvl: number }[] }>;
  assert.deepEqual(tMap['m-num-bases'].att, [
    { ok: 1, lvl: 1 },
    { ok: 0, lvl: 2 },
    { ok: 1, lvl: 2 },
    { ok: 1, lvl: 3 },
  ]);
});

test('mergeCloudProgress round-trips Firestore-encoded attempts back to tuple format cleanly', () => {
  const rich = createSampleProgress();
  const compact = buildCompactProgressMap(rich);

  const freshLocal: UserProgress = {
    ...createSampleProgress(),
    t: {
      'm-num-bases': { att: [[1, 1]], lesson: 1, practice: 0, boss: 0 },
    },
    streak: { d: 20000, n: 1 },
    cbtHistory: [],
  };

  const merged = mergeCloudProgress(freshLocal, compact);
  assert.deepEqual(merged.t['m-num-bases'].att, [
    [1, 1],
    [0, 2],
    [1, 2],
    [1, 3],
  ]);
  assert.equal(merged.t['m-num-bases'].boss, 1);
  assert.deepEqual(merged.t['p-kinematics'].att, [
    [1, 1],
    [1, 2],
  ]);
  assert.equal(merged.streak.n, 6);
  assert.equal(merged.cbtHistory?.length, 1);
  assert.equal(merged.leaderboardCampusGoal, 'UNILAG · Engineering');
});

test('deserializeTopicProgressFromFirestore supports both new map entries and legacy tuples', () => {
  const decoded = deserializeTopicProgressFromFirestore({
    newFmt: { att: [{ ok: 1, lvl: 2 }, { ok: 0, lvl: 3 }], lesson: 1, practice: 1, boss: 0 },
    legacyFmt: { att: [[1, 1], [0, 2]], lesson: 1, practice: 0, boss: 0 },
  });

  assert.deepEqual(decoded.newFmt.att, [
    [1, 2],
    [0, 3],
  ]);
  assert.deepEqual(decoded.legacyFmt.att, [
    [1, 1],
    [0, 2],
  ]);
});

test('sanitizeFirestoreValue defensively eliminates arbitrary nested arrays, NaN, and undefined', () => {
  const dirty = {
    a: [[1, 2], [3, NaN]],
    b: undefined,
    c: { nested: undefined, ok: Infinity },
  };
  const clean = sanitizeFirestoreValue(dirty);
  assertNoNestedArraysOrUndefined(clean);
  assert.deepEqual(clean, {
    a: [{ items: [1, 2] }, { items: [3, 0] }],
    c: { ok: 0 },
  });
});

test('decideDocUpsertAction chooses create, update, or recreate accurately for Firestore rules compliance', () => {
  const allowed = ['uid', 'progress', 'schemaVersion', 'createdAt', 'updatedAt'] as const;
  assert.equal(decideDocUpsertAction(null, 'u1', allowed), 'create');
  assert.equal(
    decideDocUpsertAction(
      { uid: 'u1', progress: {}, schemaVersion: 1, createdAt: { seconds: 1 }, updatedAt: { seconds: 2 } },
      'u1',
      allowed
    ),
    'update'
  );
  // Pending/null serverTimestamp or legacy extra key triggers clean recreate
  assert.equal(
    decideDocUpsertAction(
      { uid: 'u1', progress: {}, schemaVersion: 1, createdAt: null, updatedAt: null },
      'u1',
      allowed
    ),
    'recreate'
  );
  assert.equal(
    decideDocUpsertAction(
      { uid: 'u1', progress: {}, schemaVersion: 1, createdAt: { seconds: 1 }, legacyExtra: true },
      'u1',
      allowed
    ),
    'recreate'
  );
});
