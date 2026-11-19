import type { SubjectId, TopicProgress, UserProgress } from '../types';
import { sanitizeCampusGoal } from './leaderboardLogic';

export interface FirestoreAttemptEntry {
  ok: 0 | 1;
  lvl: number;
}

export interface FirestoreTopicProgress {
  att: FirestoreAttemptEntry[];
  lesson: number;
  practice: number;
  boss: number;
}

const MAX_ATTEMPTS_PER_TOPIC = 200;

export type UpsertAction = 'create' | 'update' | 'recreate';

/**
 * Determines whether a Firestore document should be created, updated via `updateDoc`
 * (preserving immutable `uid` and `createdAt`), or self-healed via delete+create if
 * a legacy/corrupt document is missing `createdAt`, mismatches `uid`, or has extra keys.
 */
export function decideDocUpsertAction(
  existingData: Record<string, unknown> | null | undefined,
  expectedUid: string,
  allowedKeys: readonly string[]
): UpsertAction {
  if (!existingData) return 'create';
  if (existingData.uid !== expectedUid) return 'recreate';
  if (!existingData.createdAt) return 'recreate';
  const allowed = new Set(allowedKeys);
  for (const key of Object.keys(existingData)) {
    if (!allowed.has(key)) return 'recreate';
  }
  return 'update';
}

export function sanitizeDisplayName(name: string): string {
  const clean = (name || 'Scholar').trim().slice(0, 60);
  return clean.length >= 1 ? clean : 'Scholar';
}

function toSafeNonNegInt(value: unknown, max = 1_000_000): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.min(max, Math.max(0, Math.floor(n)));
}

/**
 * Encodes TopicProgress maps into Firestore-safe objects.
 * Firestore forbids nested arrays (e.g. `att: [number, number][]`),
 * so each attempt tuple `[ok, lvl]` is stored as `{ ok, lvl }`.
 */
export function serializeTopicProgressForFirestore(
  t: UserProgress['t'] | undefined
): Record<string, FirestoreTopicProgress> {
  const out: Record<string, FirestoreTopicProgress> = {};
  if (!t || typeof t !== 'object') return out;

  for (const [tid, st] of Object.entries(t)) {
    if (!tid || !st || typeof st !== 'object') continue;
    const rawAtt = Array.isArray(st.att) ? st.att.slice(-MAX_ATTEMPTS_PER_TOPIC) : [];
    const safeAtt: FirestoreAttemptEntry[] = [];
    for (const item of rawAtt) {
      if (Array.isArray(item)) {
        safeAtt.push({
          ok: Number(item[0]) ? 1 : 0,
          lvl: toSafeNonNegInt(item[1], 20),
        });
      } else if (item && typeof item === 'object') {
        const rec = item as Record<string, unknown>;
        safeAtt.push({
          ok: Number(rec.ok) ? 1 : 0,
          lvl: toSafeNonNegInt(rec.lvl, 20),
        });
      }
    }
    out[tid] = {
      att: safeAtt,
      lesson: toSafeNonNegInt(st.lesson, 100),
      practice: toSafeNonNegInt(st.practice, 100),
      boss: toSafeNonNegInt(st.boss, 100),
    };
  }
  return out;
}

/**
 * Decodes Firestore TopicProgress maps (both `{ ok, lvl }[]` and legacy `[ok, lvl][]`)
 * back into the in-app `TopicProgress` tuple shape.
 */
export function deserializeTopicProgressFromFirestore(rawT: unknown): UserProgress['t'] {
  const out: UserProgress['t'] = {};
  if (!rawT || typeof rawT !== 'object') return out;

  for (const [tid, rawSt] of Object.entries(rawT as Record<string, unknown>)) {
    if (!tid || !rawSt || typeof rawSt !== 'object') continue;
    const st = rawSt as Record<string, unknown>;
    const rawAtt = Array.isArray(st.att) ? st.att : [];
    const att: [number, number][] = [];
    for (const item of rawAtt) {
      if (Array.isArray(item)) {
        att.push([Number(item[0]) ? 1 : 0, toSafeNonNegInt(item[1], 20)]);
      } else if (item && typeof item === 'object') {
        const rec = item as Record<string, unknown>;
        att.push([Number(rec.ok) ? 1 : 0, toSafeNonNegInt(rec.lvl, 20)]);
      }
    }
    out[tid] = {
      att,
      lesson: toSafeNonNegInt(st.lesson, 100),
      practice: toSafeNonNegInt(st.practice, 100),
      boss: toSafeNonNegInt(st.boss, 100),
    };
  }
  return out;
}

/**
 * Recursively strips `undefined`, normalizes non-finite numbers, and guarantees
 * zero nested arrays (`Array<Array<...>>`) anywhere in the outgoing Firestore payload.
 */
export function sanitizeFirestoreValue(value: unknown, insideArray = false): unknown {
  if (value === null || value === undefined) return null;
  if (typeof value === 'boolean' || typeof value === 'string') return value;
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }
  if (Array.isArray(value)) {
    const mapped = value
      .filter((item) => item !== undefined)
      .map((item) => sanitizeFirestoreValue(item, true));
    if (insideArray) {
      return { items: mapped };
    }
    return mapped;
  }
  if (typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (v === undefined) continue;
      out[k] = sanitizeFirestoreValue(v, false);
    }
    return out;
  }
  return null;
}

/**
 * Builds the bounded, Firestore-safe progress snapshot stored in `users/{uid}/sync/main`.
 */
export function buildCompactProgressMap(progress: UserProgress): Record<string, unknown> {
  const raw: Record<string, unknown> = {
    name: sanitizeDisplayName(progress.name),
    target: Math.min(100, Math.max(50, Number(progress.target) || 70)),
    subj: progress.subj,
    subjs: (progress.subjs || []).slice(0, 12),
    xp: toSafeNonNegInt(progress.xp, 10_000_000),
    streak: {
      d: toSafeNonNegInt(progress.streak?.d, 100_000),
      n: toSafeNonNegInt(progress.streak?.n, 3650),
    },
    themeId: progress.themeId || 'stage-1-adire',
    themeMode: progress.themeMode || 'light',
    clockFormat: progress.clockFormat || '12h',
    t: serializeTopicProgressForFirestore(progress.t),
    badges: progress.badges || {},
    flags: progress.flags || {},
    act: progress.act || {},
    mistakes: progress.mistakes || {},
    studyPlan: progress.studyPlan || null,
    cbtHistory: (progress.cbtHistory || []).slice(-25),
    theoryScores: progress.theoryScores || {},
    duelHistory: (progress.duelHistory || []).slice(-25),
    leaderboardCampusGoal: sanitizeCampusGoal(progress.leaderboardCampusGoal ?? 'National Scholar'),
    leaderboardPublic: progress.leaderboardPublic !== false,
  };

  return sanitizeFirestoreValue(raw, false) as Record<string, unknown>;
}

/**
 * Merges a Firestore progress snapshot back into the local `UserProgress` state,
 * preserving whichever side has more topic mastery and seamlessly decoding
 * Firestore-safe `{ ok, lvl }` attempt entries back into `[number, number][]`.
 */
export function mergeCloudProgress(
  local: UserProgress,
  remote: Record<string, unknown>
): UserProgress {
  const remoteXp = typeof remote.xp === 'number' && Number.isFinite(remote.xp) ? remote.xp : 0;
  const remoteT = deserializeTopicProgressFromFirestore(remote.t);
  const mergedT: UserProgress['t'] = { ...local.t };

  for (const [tid, rSt] of Object.entries(remoteT)) {
    const lSt: TopicProgress | undefined = mergedT[tid];
    if (!lSt) {
      mergedT[tid] = rSt;
    } else {
      mergedT[tid] = {
        att: (rSt.att?.length || 0) > (lSt.att?.length || 0) ? rSt.att : lSt.att,
        lesson: Math.max(lSt.lesson || 0, rSt.lesson || 0),
        practice: Math.max(lSt.practice || 0, rSt.practice || 0),
        boss: Math.max(lSt.boss || 0, rSt.boss || 0),
      };
    }
  }

  const remoteBadges = (
    remote.badges && typeof remote.badges === 'object' ? remote.badges : {}
  ) as UserProgress['badges'];
  const remoteFlags = (
    remote.flags && typeof remote.flags === 'object' ? remote.flags : {}
  ) as UserProgress['flags'];
  const remoteMistakes = (
    remote.mistakes && typeof remote.mistakes === 'object' ? remote.mistakes : {}
  ) as NonNullable<UserProgress['mistakes']>;
  const remoteTheory = (
    remote.theoryScores && typeof remote.theoryScores === 'object' ? remote.theoryScores : {}
  ) as NonNullable<UserProgress['theoryScores']>;
  const remoteDuels = Array.isArray(remote.duelHistory)
    ? (remote.duelHistory as UserProgress['duelHistory'])
    : undefined;
  const remoteCbt = Array.isArray(remote.cbtHistory)
    ? (remote.cbtHistory as UserProgress['cbtHistory'])
    : undefined;

  return {
    ...local,
    name: local.name || (typeof remote.name === 'string' ? remote.name : local.name),
    subj: (local.subj || (typeof remote.subj === 'string' ? remote.subj : 'maths')) as SubjectId,
    xp: Math.max(local.xp, remoteXp),
    streak:
      remote.streak &&
      typeof (remote.streak as { n?: number }).n === 'number' &&
      (remote.streak as { n: number }).n > local.streak.n
        ? (remote.streak as { d: number; n: number })
        : local.streak,
    t: mergedT,
    badges: { ...remoteBadges, ...local.badges },
    flags: { ...remoteFlags, ...local.flags },
    mistakes: { ...remoteMistakes, ...(local.mistakes || {}) },
    theoryScores: { ...remoteTheory, ...(local.theoryScores || {}) },
    studyPlan: local.studyPlan || (remote.studyPlan as UserProgress['studyPlan']) || undefined,
    cbtHistory:
      (local.cbtHistory?.length || 0) >= (remoteCbt?.length || 0) ? local.cbtHistory : remoteCbt,
    duelHistory:
      (local.duelHistory?.length || 0) >= (remoteDuels?.length || 0)
        ? local.duelHistory
        : remoteDuels,
    leaderboardCampusGoal:
      local.leaderboardCampusGoal ||
      (typeof remote.leaderboardCampusGoal === 'string' ? remote.leaderboardCampusGoal : undefined),
    leaderboardPublic:
      typeof local.leaderboardPublic === 'boolean'
        ? local.leaderboardPublic
        : typeof remote.leaderboardPublic === 'boolean'
          ? remote.leaderboardPublic
          : true,
  };
}
