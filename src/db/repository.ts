import crypto from 'node:crypto';
import { and, asc, desc, eq, sql } from 'drizzle-orm';
import { db } from './index.ts';
import {
  cbtDailyEntries,
  duelEntries,
  leaderboardEntries,
  peerDuels,
  scholarProgressSync,
  systemSecrets,
  users,
} from './schema.ts';
import { resolveAuthoritativeSubject, stripPrototypePollution } from '../utils/securityPolicy.ts';
import { verifyEntitlementReceipt } from './billingRepository.ts';

const VALID_ID_RE = /^[a-zA-Z0-9_-]{1,128}$/;
const VALID_DUEL_ID_RE = /^[a-zA-Z0-9_-]{4,40}$/;
const VALID_SEED_RE = /^[a-zA-Z0-9_-]{4,32}$/;
const ISO_DATE_RE = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;

const ALLOWED_PROGRESS_KEYS = new Set([
  'name',
  'target',
  'subj',
  'subjs',
  'examTrack',
  'jambSubjects',
  'xp',
  'streak',
  'themeId',
  'themeMode',
  'clockFormat',
  't',
  'badges',
  'flags',
  'act',
  'mistakes',
  'studyPlan',
  'cbtHistory',
  'theoryScores',
  'duelHistory',
  'leaderboardCampusGoal',
  'leaderboardPublic',
  'novelProgress',
]);

function clampInt(val: unknown, min: number, max: number, fallback = min): number {
  const n = Number(val);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.floor(n)));
}

function cleanText(val: unknown, maxLen: number, fallback: string): string {
  if (typeof val !== 'string') return fallback;
  const cleaned = val
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLen);
  return cleaned || fallback;
}

function cleanSubjectId(raw: unknown): string {
  const resolved = resolveAuthoritativeSubject(raw);
  return resolved ? resolved.id : 'maths';
}

function sanitizeProgressMap(raw: unknown): Record<string, unknown> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const safeObj = stripPrototypePollution(raw) as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(safeObj)) {
    if (ALLOWED_PROGRESS_KEYS.has(k)) {
      out[k] = v;
    }
  }
  return out;
}

function sanitizeSubjectMastery(raw: unknown): Record<string, number> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const safeObj = stripPrototypePollution(raw) as Record<string, unknown>;
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(safeObj)) {
    const resolved = resolveAuthoritativeSubject(k);
    if (resolved && typeof v === 'number' && Number.isFinite(v)) {
      out[resolved.id] = clampInt(v, 0, 100, 0);
    }
  }
  return out;
}

export interface UpsertProfileInput {
  uid: string;
  email: string;
  displayName: string;
  target: number;
  xp: number;
  streakCount: number;
  activeSubj: string;
  examType?: string | null;
  examDate?: string | null;
}

export interface UpsertLeaderboardInput {
  uid: string;
  email: string;
  displayName: string;
  campusGoal: string;
  primarySubj: string;
  isPublic: boolean;
  masteryIndex: number;
  topicsPassed: number;
  totalAnswered: number;
  accuracyPct: number;
  bestCbtScore: number;
  streakCount: number;
  duelsCompleted: number;
  subjectMastery: Record<string, number>;
}

export interface PublishDuelInput {
  duelId: string;
  uid: string;
  email: string;
  displayName: string;
  subject: string;
  title: string;
  seed: string;
  questionCount: number;
  score: number;
  total: number;
  timeSeconds: number;
}

export async function ensureUserRecord(uid: string, email: string, displayName = 'Scholar') {
  if (!VALID_ID_RE.test(uid)) {
    throw new Error('Invalid user identifier.');
  }
  const safeName = cleanText(displayName, 80, 'Scholar');
  const safeEmail = cleanText(email, 256, 'scholar@roadtocampus.local');
  try {
    const rows = await db
      .insert(users)
      .values({
        uid,
        email: safeEmail,
        displayName: safeName,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email: safeEmail,
          updatedAt: new Date(),
        },
      })
      .returning();
    return rows[0];
  } catch (error) {
    console.error('Database query failed (ensureUserRecord):', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function getCloudSyncState(uid: string) {
  if (!VALID_ID_RE.test(uid)) {
    throw new Error('Invalid user identifier.');
  }
  try {
    const rows = await db
      .select({
        uid: scholarProgressSync.uid,
        progress: scholarProgressSync.progress,
        schemaVersion: scholarProgressSync.schemaVersion,
        updatedAt: scholarProgressSync.updatedAt,
      })
      .from(scholarProgressSync)
      .where(eq(scholarProgressSync.uid, uid))
      .limit(1);
    return rows[0] ?? null;
  } catch (error) {
    console.error('Database query failed (getCloudSyncState):', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function saveCloudSyncBundle(params: {
  profile: UpsertProfileInput;
  progress: Record<string, unknown>;
  schemaVersion: number;
  leaderboard?: UpsertLeaderboardInput;
}) {
  const { profile, leaderboard } = params;
  if (!VALID_ID_RE.test(profile.uid)) {
    throw new Error('Invalid user identifier.');
  }

  const safeName = cleanText(profile.displayName, 80, 'Scholar');
  const safeEmail = cleanText(profile.email, 256, 'scholar@roadtocampus.local');
  const safeTarget = clampInt(profile.target, 50, 100, 70);
  const safeXp = clampInt(profile.xp, 0, 10_000_000, 0);
  const safeStreak = clampInt(profile.streakCount, 0, 3650, 0);
  const safeSubj = cleanSubjectId(profile.activeSubj);
  const safeExamType =
    profile.examType === 'jamb' || profile.examType === 'waec' || profile.examType === 'both'
      ? profile.examType
      : null;
  const safeExamDate =
    typeof profile.examDate === 'string' && ISO_DATE_RE.test(profile.examDate.trim())
      ? profile.examDate.trim()
      : null;

  const safeProgress = sanitizeProgressMap(params.progress);
  if (params.progress && typeof params.progress === 'object' && 'pro' in params.progress) {
    const verifiedPro = await verifyEntitlementReceipt(
      (params.progress as Record<string, unknown>).pro
    );
    if (verifiedPro) {
      safeProgress.pro = verifiedPro;
    }
  }
  const safeSchemaVersion = clampInt(params.schemaVersion, 1, 20, 1);
  const now = new Date();

  try {
    await db.transaction(async (tx) => {
      await tx
        .insert(users)
        .values({
          uid: profile.uid,
          email: safeEmail,
          displayName: safeName,
          target: safeTarget,
          xp: safeXp,
          streakCount: safeStreak,
          activeSubj: safeSubj,
          examType: safeExamType,
          examDate: safeExamDate,
          createdAt: now,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: users.uid,
          set: {
            email: safeEmail,
            displayName: safeName,
            target: safeTarget,
            xp: safeXp,
            streakCount: safeStreak,
            activeSubj: safeSubj,
            examType: safeExamType,
            examDate: safeExamDate,
            updatedAt: now,
          },
        });

      await tx
        .insert(scholarProgressSync)
        .values({
          uid: profile.uid,
          progress: safeProgress,
          schemaVersion: safeSchemaVersion,
          createdAt: now,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: scholarProgressSync.uid,
          set: {
            progress: safeProgress,
            schemaVersion: safeSchemaVersion,
            updatedAt: now,
          },
        });

      if (leaderboard) {
        const lbName = cleanText(leaderboard.displayName, 60, safeName.slice(0, 60));
        const lbGoal = cleanText(leaderboard.campusGoal, 48, 'National Scholar');
        const lbSubj = cleanSubjectId(leaderboard.primarySubj);
        const lbMasteryMap = sanitizeSubjectMastery(leaderboard.subjectMastery);

        await tx
          .insert(leaderboardEntries)
          .values({
            uid: profile.uid,
            displayName: lbName,
            campusGoal: lbGoal,
            primarySubj: lbSubj,
            isPublic: Boolean(leaderboard.isPublic),
            masteryIndex: clampInt(leaderboard.masteryIndex, 0, 1000, 0),
            topicsPassed: clampInt(leaderboard.topicsPassed, 0, 500, 0),
            totalAnswered: clampInt(leaderboard.totalAnswered, 0, 100_000, 0),
            accuracyPct: clampInt(leaderboard.accuracyPct, 0, 100, 0),
            bestCbtScore: clampInt(leaderboard.bestCbtScore, 0, 400, 0),
            streakCount: clampInt(leaderboard.streakCount, 0, 3650, 0),
            duelsCompleted: clampInt(leaderboard.duelsCompleted, 0, 5000, 0),
            subjectMastery: lbMasteryMap,
            createdAt: now,
            updatedAt: now,
          })
          .onConflictDoUpdate({
            target: leaderboardEntries.uid,
            set: {
              displayName: lbName,
              campusGoal: lbGoal,
              primarySubj: lbSubj,
              isPublic: Boolean(leaderboard.isPublic),
              masteryIndex: clampInt(leaderboard.masteryIndex, 0, 1000, 0),
              topicsPassed: clampInt(leaderboard.topicsPassed, 0, 500, 0),
              totalAnswered: clampInt(leaderboard.totalAnswered, 0, 100_000, 0),
              accuracyPct: clampInt(leaderboard.accuracyPct, 0, 100, 0),
              bestCbtScore: clampInt(leaderboard.bestCbtScore, 0, 400, 0),
              streakCount: clampInt(leaderboard.streakCount, 0, 3650, 0),
              duelsCompleted: clampInt(leaderboard.duelsCompleted, 0, 5000, 0),
              subjectMastery: lbMasteryMap,
              updatedAt: now,
            },
          });
      }
    });

    return { ok: true, updatedAtMs: now.getTime() };
  } catch (error) {
    console.error('Database query failed (saveCloudSyncBundle):', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function upsertLeaderboardStanding(input: UpsertLeaderboardInput) {
  if (!VALID_ID_RE.test(input.uid)) {
    throw new Error('Invalid user identifier.');
  }

  const lbName = cleanText(input.displayName, 60, 'Scholar');
  const lbGoal = cleanText(input.campusGoal, 48, 'National Scholar');
  const lbSubj = cleanSubjectId(input.primarySubj);
  const lbMasteryMap = sanitizeSubjectMastery(input.subjectMastery);
  const now = new Date();

  try {
    await ensureUserRecord(input.uid, input.email, lbName);

    await db
      .insert(leaderboardEntries)
      .values({
        uid: input.uid,
        displayName: lbName,
        campusGoal: lbGoal,
        primarySubj: lbSubj,
        isPublic: Boolean(input.isPublic),
        masteryIndex: clampInt(input.masteryIndex, 0, 1000, 0),
        topicsPassed: clampInt(input.topicsPassed, 0, 500, 0),
        totalAnswered: clampInt(input.totalAnswered, 0, 100_000, 0),
        accuracyPct: clampInt(input.accuracyPct, 0, 100, 0),
        bestCbtScore: clampInt(input.bestCbtScore, 0, 400, 0),
        streakCount: clampInt(input.streakCount, 0, 3650, 0),
        duelsCompleted: clampInt(input.duelsCompleted, 0, 5000, 0),
        subjectMastery: lbMasteryMap,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: leaderboardEntries.uid,
        set: {
          displayName: lbName,
          campusGoal: lbGoal,
          primarySubj: lbSubj,
          isPublic: Boolean(input.isPublic),
          masteryIndex: clampInt(input.masteryIndex, 0, 1000, 0),
          topicsPassed: clampInt(input.topicsPassed, 0, 500, 0),
          totalAnswered: clampInt(input.totalAnswered, 0, 100_000, 0),
          accuracyPct: clampInt(input.accuracyPct, 0, 100, 0),
          bestCbtScore: clampInt(input.bestCbtScore, 0, 400, 0),
          streakCount: clampInt(input.streakCount, 0, 3650, 0),
          duelsCompleted: clampInt(input.duelsCompleted, 0, 5000, 0),
          subjectMastery: lbMasteryMap,
          updatedAt: now,
        },
      });

    return { ok: true, updatedAtMs: now.getTime() };
  } catch (error) {
    console.error('Database query failed (upsertLeaderboardStanding):', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function listPublicLeaderboard(limitCount = 100) {
  const safeLimit = clampInt(limitCount, 1, 100, 100);
  try {
    const rows = await db
      .select({
        uid: leaderboardEntries.uid,
        displayName: leaderboardEntries.displayName,
        campusGoal: leaderboardEntries.campusGoal,
        primarySubj: leaderboardEntries.primarySubj,
        isPublic: leaderboardEntries.isPublic,
        masteryIndex: leaderboardEntries.masteryIndex,
        topicsPassed: leaderboardEntries.topicsPassed,
        totalAnswered: leaderboardEntries.totalAnswered,
        accuracyPct: leaderboardEntries.accuracyPct,
        bestCbtScore: leaderboardEntries.bestCbtScore,
        streakCount: leaderboardEntries.streakCount,
        duelsCompleted: leaderboardEntries.duelsCompleted,
        subjectMastery: leaderboardEntries.subjectMastery,
        updatedAt: leaderboardEntries.updatedAt,
      })
      .from(leaderboardEntries)
      .where(eq(leaderboardEntries.isPublic, true))
      .orderBy(desc(leaderboardEntries.masteryIndex), desc(leaderboardEntries.topicsPassed))
      .limit(safeLimit);

    return rows.map((r) => ({
      ...r,
      updatedAtMs: r.updatedAt instanceof Date ? r.updatedAt.getTime() : undefined,
    }));
  } catch (error) {
    console.error('Database query failed (listPublicLeaderboard):', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function publishDuelAndScoreEntry(input: PublishDuelInput) {
  const duelId = cleanText(input.duelId, 40, '');
  if (!VALID_DUEL_ID_RE.test(duelId)) {
    throw new Error('Invalid duel code.');
  }
  if (!VALID_ID_RE.test(input.uid)) {
    throw new Error('Invalid user identifier.');
  }

  const safeName = cleanText(input.displayName, 60, 'Scholar');
  const safeSubj = cleanSubjectId(input.subject);
  const safeTitle = cleanText(input.title, 100, 'Study Duel');
  const rawSeed = (input.seed || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32);
  const safeSeed = VALID_SEED_RE.test(rawSeed) ? rawSeed : rawSeed.padEnd(4, '0').slice(0, 32);
  const safeQuestionCount = clampInt(input.questionCount, 5, 20, 10);
  const safeTimeSeconds = clampInt(input.timeSeconds, 0, 7200, 0);

  try {
    await ensureUserRecord(input.uid, input.email, safeName);

    await db.transaction(async (tx) => {
      // Create duel once; ignore conflicts if another scholar already created it
      await tx
        .insert(peerDuels)
        .values({
          duelId,
          creatorUid: input.uid,
          creatorName: safeName,
          subject: safeSubj,
          title: safeTitle,
          seed: safeSeed,
          questionCount: safeQuestionCount,
        })
        .onConflictDoNothing({ target: peerDuels.duelId });

      // Read authoritative parent duel questionCount so score/total cannot be spoofed
      const parentRows = await tx
        .select({ questionCount: peerDuels.questionCount })
        .from(peerDuels)
        .where(eq(peerDuels.duelId, duelId))
        .limit(1);

      const authoritativeTotal = parentRows[0]?.questionCount ?? safeQuestionCount;
      const safeScore = clampInt(input.score, 0, authoritativeTotal, 0);

      // Immutable duel submission: first submission per (duelId, uid) is permanent
      await tx
        .insert(duelEntries)
        .values({
          duelId,
          uid: input.uid,
          displayName: safeName,
          score: safeScore,
          total: authoritativeTotal,
          timeSeconds: safeTimeSeconds,
        })
        .onConflictDoNothing({ target: [duelEntries.duelId, duelEntries.uid] });
    });

    return { ok: true };
  } catch (error) {
    console.error('Database query failed (publishDuelAndScoreEntry):', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function listDuelEntriesByDuelId(duelIdRaw: string) {
  const duelId = cleanText(duelIdRaw, 40, '');
  if (!VALID_DUEL_ID_RE.test(duelId)) {
    throw new Error('Invalid duel code.');
  }
  try {
    return await db
      .select({
        duelId: duelEntries.duelId,
        uid: duelEntries.uid,
        displayName: duelEntries.displayName,
        score: duelEntries.score,
        total: duelEntries.total,
        timeSeconds: duelEntries.timeSeconds,
      })
      .from(duelEntries)
      .where(eq(duelEntries.duelId, duelId))
      .orderBy(desc(duelEntries.score), asc(duelEntries.timeSeconds))
      .limit(100);
  } catch (error) {
    console.error('Database query failed (listDuelEntriesByDuelId):', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export interface UpsertDailyCbtInput {
  dayNumber: number;
  mode: 'jamb' | 'waec';
  participantKey: string;
  displayName: string;
  campusGoal: string;
  scaledScore: number;
  maxScale: number;
  rawCorrect: number;
  totalQuestions: number;
  accuracyPct: number;
  durationSec: number;
}

export async function upsertDailyCbtStanding(input: UpsertDailyCbtInput) {
  if (!VALID_ID_RE.test(input.participantKey)) {
    throw new Error('Invalid participant identifier.');
  }
  const safeDay = clampInt(input.dayNumber, 18_000, 100_000, Math.floor((Date.now() + 3_600_000) / 86_400_000));
  const safeMode = input.mode === 'waec' ? 'waec' : 'jamb';
  const safeMaxScale = safeMode === 'waec' ? 100 : 400;
  const safeScaledScore = clampInt(input.scaledScore, 0, safeMaxScale, 0);
  const safeTotalQuestions = clampInt(input.totalQuestions, 5, 250, 40);
  const safeRawCorrect = clampInt(input.rawCorrect, 0, safeTotalQuestions, 0);
  const safeAcc = clampInt(
    input.accuracyPct,
    0,
    100,
    Math.round((safeRawCorrect / Math.max(1, safeTotalQuestions)) * 100)
  );
  const safeDuration = clampInt(input.durationSec, 1, 14_400, 600);
  const safeName = cleanText(input.displayName, 60, 'Scholar');
  const safeGoal = cleanText(input.campusGoal, 48, 'National Scholar');
  const now = new Date();

  try {
    const existing = await db
      .select({
        scaledScore: cbtDailyEntries.scaledScore,
        accuracyPct: cbtDailyEntries.accuracyPct,
        durationSec: cbtDailyEntries.durationSec,
      })
      .from(cbtDailyEntries)
      .where(
        and(
          eq(cbtDailyEntries.dayNumber, safeDay),
          eq(cbtDailyEntries.mode, safeMode),
          eq(cbtDailyEntries.participantKey, input.participantKey)
        )
      )
      .limit(1);

    const prev = existing[0];
    const shouldReplace =
      !prev ||
      safeScaledScore > prev.scaledScore ||
      (safeScaledScore === prev.scaledScore && safeAcc > prev.accuracyPct) ||
      (safeScaledScore === prev.scaledScore &&
        safeAcc === prev.accuracyPct &&
        safeDuration < prev.durationSec);

    if (!prev) {
      await db
        .insert(cbtDailyEntries)
        .values({
          dayNumber: safeDay,
          mode: safeMode,
          participantKey: input.participantKey,
          displayName: safeName,
          campusGoal: safeGoal,
          scaledScore: safeScaledScore,
          maxScale: safeMaxScale,
          rawCorrect: safeRawCorrect,
          totalQuestions: safeTotalQuestions,
          accuracyPct: safeAcc,
          durationSec: safeDuration,
          createdAt: now,
          updatedAt: now,
        })
        .onConflictDoNothing();
    } else if (shouldReplace) {
      await db
        .update(cbtDailyEntries)
        .set({
          displayName: safeName,
          campusGoal: safeGoal,
          scaledScore: safeScaledScore,
          maxScale: safeMaxScale,
          rawCorrect: safeRawCorrect,
          totalQuestions: safeTotalQuestions,
          accuracyPct: safeAcc,
          durationSec: safeDuration,
          updatedAt: now,
        })
        .where(
          and(
            eq(cbtDailyEntries.dayNumber, safeDay),
            eq(cbtDailyEntries.mode, safeMode),
            eq(cbtDailyEntries.participantKey, input.participantKey)
          )
        );
    }

    return await listDailyCbtStandings(safeDay, safeMode, 150);
  } catch (error) {
    console.error('Database query failed (upsertDailyCbtStanding):', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function listDailyCbtStandings(
  dayNumber: number,
  mode: 'jamb' | 'waec' = 'jamb',
  limitCount = 150
) {
  const safeDay = clampInt(dayNumber, 18_000, 100_000, Math.floor((Date.now() + 3_600_000) / 86_400_000));
  const safeMode = mode === 'waec' ? 'waec' : 'jamb';
  const safeLimit = clampInt(limitCount, 1, 200, 150);

  try {
    return await db
      .select({
        participantKey: cbtDailyEntries.participantKey,
        displayName: cbtDailyEntries.displayName,
        campusGoal: cbtDailyEntries.campusGoal,
        mode: cbtDailyEntries.mode,
        scaledScore: cbtDailyEntries.scaledScore,
        maxScale: cbtDailyEntries.maxScale,
        rawCorrect: cbtDailyEntries.rawCorrect,
        totalQuestions: cbtDailyEntries.totalQuestions,
        accuracyPct: cbtDailyEntries.accuracyPct,
        durationSec: cbtDailyEntries.durationSec,
      })
      .from(cbtDailyEntries)
      .where(and(eq(cbtDailyEntries.dayNumber, safeDay), eq(cbtDailyEntries.mode, safeMode)))
      .orderBy(
        desc(cbtDailyEntries.scaledScore),
        desc(cbtDailyEntries.accuracyPct),
        asc(cbtDailyEntries.durationSec)
      )
      .limit(safeLimit);
  } catch (error) {
    console.error('Database query failed (listDailyCbtStandings):', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

interface StoredEmailAuthCredential {
  email: string;
  displayName: string;
  saltHex: string;
  hashHex: string;
  updatedAtMs: number;
}

const memoryEmailCredentials = new Map<string, StoredEmailAuthCredential>();

function hashPasswordScrypt(password: string, saltHex: string): string {
  return crypto.scryptSync(password, saltHex, 32).toString('hex');
}

function verifyPasswordScrypt(password: string, saltHex: string, expectedHashHex: string): boolean {
  try {
    const derived = Buffer.from(hashPasswordScrypt(password, saltHex), 'hex');
    const expected = Buffer.from(expectedHashHex, 'hex');
    if (derived.length !== expected.length) return false;
    return crypto.timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

function buildEmailSecretKey(cleanEmail: string): string {
  const digest = crypto.createHash('sha256').update(cleanEmail).digest('hex').slice(0, 32);
  return `email_auth_v1:${digest}`;
}

async function readStoredEmailCredential(
  cleanEmail: string
): Promise<StoredEmailAuthCredential | null> {
  const keyName = buildEmailSecretKey(cleanEmail);
  try {
    const [row] = await db
      .select({ secretValue: systemSecrets.secretValue })
      .from(systemSecrets)
      .where(eq(systemSecrets.keyName, keyName))
      .limit(1);
    if (row?.secretValue) {
      const parsed = JSON.parse(row.secretValue) as StoredEmailAuthCredential;
      if (parsed && parsed.email === cleanEmail && parsed.saltHex && parsed.hashHex) {
        return parsed;
      }
    }
  } catch {
    /* fallback to memory map */
  }
  return memoryEmailCredentials.get(cleanEmail) || null;
}

async function writeStoredEmailCredential(cred: StoredEmailAuthCredential): Promise<void> {
  memoryEmailCredentials.set(cred.email, cred);
  const keyName = buildEmailSecretKey(cred.email);
  const serialized = JSON.stringify(cred);
  try {
    await db
      .insert(systemSecrets)
      .values({ keyName, secretValue: serialized })
      .onConflictDoUpdate({
        target: systemSecrets.keyName,
        set: { secretValue: serialized },
      });
  } catch {
    /* keep memory credential active if DB is unavailable */
  }
}

async function hasExistingUserEmailInDb(cleanEmail: string): Promise<string | null> {
  try {
    const [row] = await db
      .select({ displayName: users.displayName })
      .from(users)
      .where(sql`lower(${users.email}) = ${cleanEmail}`)
      .limit(1);
    return row ? row.displayName : null;
  } catch {
    return null;
  }
}

export async function registerUniqueEmailAccount(input: {
  email: string;
  displayName: string;
  password: string;
}): Promise<
  | { ok: false; duplicateEmail: true; error: string }
  | { ok: true; email: string; displayName: string }
> {
  const cleanEmail = input.email.trim().toLowerCase();
  const cleanName = cleanText(input.displayName, 60, 'Scholar');

  const existingCred = await readStoredEmailCredential(cleanEmail);
  const existingUserDisplay = await hasExistingUserEmailInDb(cleanEmail);
  if (existingCred || existingUserDisplay !== null) {
    return {
      ok: false,
      duplicateEmail: true,
      error: `An Easy Learn account already exists for ${cleanEmail}. Please sign in instead, or recover your password with Google.`,
    };
  }

  const saltHex = crypto.randomBytes(16).toString('hex');
  const hashHex = hashPasswordScrypt(input.password, saltHex);
  const cred: StoredEmailAuthCredential = {
    email: cleanEmail,
    displayName: cleanName,
    saltHex,
    hashHex,
    updatedAtMs: Date.now(),
  };
  await writeStoredEmailCredential(cred);

  const syntheticUid = `email_${crypto.createHash('sha256').update(cleanEmail).digest('hex').slice(0, 28)}`;
  try {
    await db
      .insert(users)
      .values({
        uid: syntheticUid,
        email: cleanEmail,
        displayName: cleanName,
      })
      .onConflictDoNothing();
  } catch {
    /* non-fatal if DB unavailable */
  }

  return { ok: true, email: cleanEmail, displayName: cleanName };
}

export async function verifyEmailPasswordLogin(input: {
  email: string;
  password: string;
}): Promise<
  | { ok: true; email: string; displayName: string }
  | { ok: false; notFound?: boolean; error: string }
> {
  const cleanEmail = input.email.trim().toLowerCase();
  const existingCred = await readStoredEmailCredential(cleanEmail);
  if (!existingCred) {
    const existingGoogleUser = await hasExistingUserEmailInDb(cleanEmail);
    if (existingGoogleUser !== null) {
      return {
        ok: false,
        error:
          'This email is linked with Google Sign-In. Tap "Continue with Google" or "Forgot password? Recover with Google" below.',
      };
    }
    return {
      ok: false,
      notFound: true,
      error: 'No account found for that email address. Create an account or sign in with Google.',
    };
  }

  if (!verifyPasswordScrypt(input.password, existingCred.saltHex, existingCred.hashHex)) {
    return {
      ok: false,
      error: 'Incorrect password for this account. Try again or tap "Forgot password? Recover with Google".',
    };
  }

  return {
    ok: true,
    email: existingCred.email,
    displayName: existingCred.displayName,
  };
}

export async function recoverEmailPasswordViaGoogle(input: {
  verifiedEmail: string;
  displayName?: string;
  newPassword?: string;
}): Promise<{ ok: true; email: string; displayName: string; passwordUpdated: boolean }> {
  const cleanEmail = input.verifiedEmail.trim().toLowerCase();
  const existingCred = await readStoredEmailCredential(cleanEmail);
  const resolvedName = cleanText(
    existingCred?.displayName || input.displayName || cleanEmail.split('@')[0],
    60,
    'Scholar'
  );

  let passwordUpdated = false;
  if (typeof input.newPassword === 'string' && input.newPassword.length >= 4) {
    const saltHex = crypto.randomBytes(16).toString('hex');
    const hashHex = hashPasswordScrypt(input.newPassword, saltHex);
    await writeStoredEmailCredential({
      email: cleanEmail,
      displayName: resolvedName,
      saltHex,
      hashHex,
      updatedAtMs: Date.now(),
    });
    passwordUpdated = true;
  }

  return {
    ok: true,
    email: cleanEmail,
    displayName: resolvedName,
    passwordUpdated,
  };
}


