import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import type { SubjectId, UserProgress } from '../types';
import { getTopics, SUBJECT_IDS } from '../data/curriculum';
import type { PeerDuelSpec } from '../utils/peerDuelLogic';
import {
  buildStandingFromProgress,
  sanitizeCampusGoal,
  sanitizeLeaderboardName,
  type LeaderboardStanding,
} from '../utils/leaderboardLogic';
import {
  buildCompactProgressMap,
  mergeCloudProgress,
  sanitizeDisplayName,
} from '../utils/cloudSyncCodec';

export { mergeCloudProgress };

export interface CloudDuelEntry {
  duelId: string;
  uid: string;
  displayName: string;
  score: number;
  total: number;
  timeSeconds: number;
}

interface CloudSyncContextValue {
  user: User | null;
  authReady: boolean;
  syncStatus: 'idle' | 'syncing' | 'synced' | 'offline' | 'error';
  lastSyncedLabel: string | null;
  syncError: string | null;
  signInWithGoogle: () => Promise<void>;
  signOutCloud: () => Promise<void>;
  syncNow: (progress: UserProgress) => Promise<void>;
  publishDuelAndScore: (
    spec: PeerDuelSpec,
    displayName: string,
    score: number,
    total: number,
    timeSeconds: number
  ) => Promise<void>;
  loadDuelEntries: (duelId: string) => Promise<CloudDuelEntry[]>;
  publishLeaderboardStanding: (
    progress: UserProgress,
    overrides?: { campusGoal?: string; isPublic?: boolean }
  ) => Promise<boolean>;
  subscribeToLeaderboard: (
    onUpdate: (entries: LeaderboardStanding[]) => void,
    onError?: (msg: string) => void
  ) => () => void;
}

const CloudSyncContext = createContext<CloudSyncContextValue | null>(null);

async function authedJsonFetch<T>(
  u: User,
  url: string,
  init?: { method?: 'GET' | 'POST'; body?: unknown; signal?: AbortSignal }
): Promise<T> {
  const token = await u.getIdToken();
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };
  if (init?.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  const resp = await fetch(url, {
    method: init?.method || 'GET',
    headers,
    body: init?.body !== undefined ? JSON.stringify(init.body) : undefined,
    signal: init?.signal,
  });
  if (!resp.ok) {
    let msg = `Cloud request failed (${resp.status})`;
    try {
      const errData = (await resp.json()) as { error?: string };
      if (typeof errData?.error === 'string' && errData.error.trim()) {
        msg = errData.error;
      }
    } catch {
      /* ignore non-JSON body */
    }
    throw new Error(msg);
  }
  return (await resp.json()) as T;
}

export function CloudSyncProvider({
  progress,
  onHydrateFromCloud,
  children,
}: {
  progress: UserProgress;
  onHydrateFromCloud: (merged: UserProgress) => void;
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [syncStatus, setSyncStatus] = useState<CloudSyncContextValue['syncStatus']>('idle');
  const [lastSyncedLabel, setLastSyncedLabel] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const progressRef = useRef(progress);
  progressRef.current = progress;
  const hydratedUidRef = useRef<string | null>(null);
  const initialSyncDoneUidRef = useRef<string | null>(null);
  const isPushingRef = useRef(false);
  const queuedPushRef = useRef<{ user: User; snap: UserProgress } | null>(null);

  const executePushToCloud = useCallback(async (u: User, snap: UserProgress) => {
    if (!u.emailVerified) {
      setSyncError('Verify your Google email address to enable cloud sync.');
      return;
    }
    setSyncStatus('syncing');
    setSyncError(null);

    try {
      const profilePayload: Record<string, unknown> = {
        displayName: sanitizeDisplayName(snap.name || u.displayName || 'Scholar'),
        target: Math.min(100, Math.max(50, Number(snap.target) || 70)),
        xp: Math.min(10_000_000, Math.max(0, Math.floor(snap.xp || 0))),
        streakCount: Math.min(3650, Math.max(0, Math.floor(snap.streak?.n || 0))),
        activeSubj: SUBJECT_IDS.includes(snap.subj) ? snap.subj : 'maths',
      };
      if (snap.studyPlan?.examType === 'jamb' || snap.studyPlan?.examType === 'waec') {
        profilePayload.examType = snap.studyPlan.examType;
      }
      if (
        typeof snap.studyPlan?.examDateIso === 'string' &&
        /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(snap.studyPlan.examDateIso.trim())
      ) {
        profilePayload.examDate = snap.studyPlan.examDateIso.trim();
      }

      const allTopicsBySubj = Object.fromEntries(
        SUBJECT_IDS.map((sid) => [sid, getTopics(sid)])
      ) as Record<SubjectId, ReturnType<typeof getTopics>>;
      const standing = buildStandingFromProgress(snap, allTopicsBySubj, {
        uid: u.uid,
        campusGoal: snap.leaderboardCampusGoal ?? 'National Scholar',
        isPublic: snap.leaderboardPublic !== false,
      });

      await authedJsonFetch<{ ok: boolean }>(u, '/api/cloud/sync', {
        method: 'POST',
        body: {
          profile: profilePayload,
          progress: buildCompactProgressMap(snap),
          schemaVersion: 1,
          leaderboard: {
            displayName: sanitizeLeaderboardName(snap.name || u.displayName || 'Scholar'),
            campusGoal: sanitizeCampusGoal(standing.campusGoal),
            primarySubj: standing.primarySubj,
            isPublic: standing.isPublic,
            masteryIndex: standing.masteryIndex,
            topicsPassed: standing.topicsPassed,
            totalAnswered: standing.totalAnswered,
            accuracyPct: standing.accuracyPct,
            bestCbtScore: standing.bestCbtScore,
            streakCount: standing.streakCount,
            duelsCompleted: standing.duelsCompleted,
            subjectMastery: standing.subjectMastery,
          },
        },
      });

      setSyncStatus('synced');
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastSyncedLabel(nowStr);
    } catch {
      setSyncStatus('error');
      setSyncError('Cloud sync paused. Local progress is safe.');
    }
  }, []);

  // Strict serialization queue prevents concurrent overlapping sync writes
  const pushProgressToCloud = useCallback(
    async (u: User, snap: UserProgress) => {
      if (isPushingRef.current) {
        queuedPushRef.current = { user: u, snap };
        return;
      }
      isPushingRef.current = true;
      try {
        await executePushToCloud(u, snap);
        while (queuedPushRef.current) {
          const next = queuedPushRef.current;
          queuedPushRef.current = null;
          await executePushToCloud(next.user, next.snap);
        }
      } finally {
        isPushingRef.current = false;
      }
    },
    [executePushToCloud]
  );

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setAuthReady(true);
      if (!u) {
        hydratedUidRef.current = null;
        initialSyncDoneUidRef.current = null;
        setSyncStatus('idle');
        return;
      }
      if (hydratedUidRef.current === u.uid) return;
      hydratedUidRef.current = u.uid;
      setSyncStatus('syncing');

      try {
        const res = await authedJsonFetch<{
          exists: boolean;
          progress: Record<string, unknown> | null;
        }>(u, '/api/cloud/sync');

        if (res.exists && res.progress && typeof res.progress === 'object') {
          const merged = mergeCloudProgress(progressRef.current, res.progress);
          onHydrateFromCloud(merged);
          await pushProgressToCloud(u, merged);
          initialSyncDoneUidRef.current = u.uid;
          return;
        }
        await pushProgressToCloud(u, progressRef.current);
        initialSyncDoneUidRef.current = u.uid;
      } catch {
        initialSyncDoneUidRef.current = u.uid;
        setSyncStatus('error');
        setSyncError('Cloud sync paused. Local progress is safe.');
      }
    });
    return () => unsub();
  }, [onHydrateFromCloud, pushProgressToCloud]);

  // Auto-sync debounced whenever authenticated scholar updates mastery, planner, or competition settings
  useEffect(() => {
    if (!user || !authReady) return;
    if (initialSyncDoneUidRef.current !== user.uid) return;
    const timer = window.setTimeout(() => {
      void pushProgressToCloud(user, progress);
    }, 3500);
    return () => window.clearTimeout(timer);
  }, [
    user,
    authReady,
    progress.xp,
    progress.t,
    progress.streak.n,
    progress.target,
    progress.studyPlan,
    progress.mistakes,
    progress.cbtHistory?.length,
    progress.theoryScores,
    progress.duelHistory?.length,
    progress.leaderboardCampusGoal,
    progress.leaderboardPublic,
    pushProgressToCloud,
  ]);

  const signInWithGoogle = useCallback(async () => {
    setSyncError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Google sign-in was cancelled.';
      setSyncError(msg.includes('popup-closed') ? 'Sign-in popup closed before completion.' : msg);
    }
  }, []);

  const signOutCloud = useCallback(async () => {
    await signOut(auth);
    setSyncStatus('idle');
    setLastSyncedLabel(null);
  }, []);

  const syncNow = useCallback(
    async (snap: UserProgress) => {
      if (!user) return;
      await pushProgressToCloud(user, snap);
    },
    [pushProgressToCloud, user]
  );

  const publishDuelAndScore = useCallback(
    async (
      spec: PeerDuelSpec,
      displayName: string,
      score: number,
      total: number,
      timeSeconds: number
    ) => {
      if (!user || !user.emailVerified) return;
      try {
        await authedJsonFetch<{ ok: boolean }>(user, '/api/cloud/duels', {
          method: 'POST',
          body: {
            duelId: spec.code,
            displayName: sanitizeDisplayName(displayName || user.displayName || 'Scholar'),
            subject: SUBJECT_IDS.includes(spec.subj as SubjectId) ? spec.subj : 'maths',
            title: spec.title.trim().slice(0, 100) || 'Study Duel',
            seed: (spec.seed.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32) || 'DUEL01').padEnd(4, '0'),
            questionCount: Math.min(20, Math.max(5, spec.questionCount)),
            score: Math.min(total, Math.max(0, Math.floor(score))),
            total: Math.min(20, Math.max(1, Math.floor(total))),
            timeSeconds: Math.min(7200, Math.max(0, Math.floor(timeSeconds))),
          },
        });
      } catch {
        /* local duel summary remains preserved */
      }
    },
    [user]
  );

  const loadDuelEntries = useCallback(
    async (duelId: string): Promise<CloudDuelEntry[]> => {
      if (!user) return [];
      try {
        const res = await authedJsonFetch<{ entries: CloudDuelEntry[] }>(
          user,
          `/api/cloud/duels/${encodeURIComponent(duelId)}/entries`
        );
        return Array.isArray(res.entries) ? res.entries : [];
      } catch {
        return [];
      }
    },
    [user]
  );

  const publishLeaderboardStanding = useCallback(
    async (
      snap: UserProgress,
      overrides?: { campusGoal?: string; isPublic?: boolean }
    ): Promise<boolean> => {
      if (!user || !user.emailVerified) return false;
      try {
        const allTopicsBySubj = Object.fromEntries(
          SUBJECT_IDS.map((sid) => [sid, getTopics(sid)])
        ) as Record<SubjectId, ReturnType<typeof getTopics>>;
        const standing = buildStandingFromProgress(snap, allTopicsBySubj, {
          uid: user.uid,
          campusGoal: overrides?.campusGoal ?? snap.leaderboardCampusGoal ?? 'National Scholar',
          isPublic: overrides?.isPublic ?? snap.leaderboardPublic !== false,
        });
        await authedJsonFetch<{ ok: boolean }>(user, '/api/cloud/leaderboard', {
          method: 'POST',
          body: {
            displayName: sanitizeLeaderboardName(snap.name || user.displayName || 'Scholar'),
            campusGoal: sanitizeCampusGoal(standing.campusGoal),
            primarySubj: standing.primarySubj,
            isPublic: standing.isPublic,
            masteryIndex: standing.masteryIndex,
            topicsPassed: standing.topicsPassed,
            totalAnswered: standing.totalAnswered,
            accuracyPct: standing.accuracyPct,
            bestCbtScore: standing.bestCbtScore,
            streakCount: standing.streakCount,
            duelsCompleted: standing.duelsCompleted,
            subjectMastery: standing.subjectMastery,
          },
        });
        return true;
      } catch {
        return false;
      }
    },
    [user]
  );

  const subscribeToLeaderboard = useCallback(
    (
      onUpdate: (entries: LeaderboardStanding[]) => void,
      onError?: (msg: string) => void
    ): (() => void) => {
      if (!user || !authReady) {
        onUpdate([]);
        return () => {};
      }
      let cancelled = false;
      let controller: AbortController | null = null;

      const fetchLeaderboard = async () => {
        if (cancelled) return;
        controller?.abort();
        controller = new AbortController();
        try {
          const data = await authedJsonFetch<{ entries: Record<string, unknown>[] }>(
            user,
            '/api/cloud/leaderboard',
            { signal: controller.signal }
          );
          if (cancelled) return;
          const rawList = Array.isArray(data.entries) ? data.entries : [];
          const rows: LeaderboardStanding[] = rawList.map((d) => {
            const rawSubj = String(d.primarySubj || 'maths') as SubjectId;
            const safeSubj: SubjectId = SUBJECT_IDS.includes(rawSubj) ? rawSubj : 'maths';
            const rawMap =
              d.subjectMastery && typeof d.subjectMastery === 'object'
                ? (d.subjectMastery as Record<string, unknown>)
                : {};
            const cleanMap: Partial<Record<SubjectId, number>> = {};
            for (const sid of SUBJECT_IDS) {
              if (typeof rawMap[sid] === 'number') {
                cleanMap[sid] = Math.min(100, Math.max(0, Math.round(rawMap[sid] as number)));
              }
            }
            const uidStr = String(d.uid || '');
            return {
              uid: uidStr,
              displayName: sanitizeLeaderboardName(String(d.displayName || 'Scholar')),
              campusGoal: sanitizeCampusGoal(String(d.campusGoal || 'National Scholar')),
              primarySubj: safeSubj,
              isPublic: Boolean(d.isPublic),
              masteryIndex: Math.min(1000, Math.max(0, Math.round(Number(d.masteryIndex) || 0))),
              topicsPassed: Math.max(0, Math.floor(Number(d.topicsPassed) || 0)),
              totalAnswered: Math.max(0, Math.floor(Number(d.totalAnswered) || 0)),
              accuracyPct: Math.min(100, Math.max(0, Math.round(Number(d.accuracyPct) || 0))),
              bestCbtScore: Math.min(400, Math.max(0, Math.round(Number(d.bestCbtScore) || 0))),
              streakCount: Math.max(0, Math.floor(Number(d.streakCount) || 0)),
              duelsCompleted: Math.max(0, Math.floor(Number(d.duelsCompleted) || 0)),
              subjectMastery: cleanMap,
              updatedAtMs: typeof d.updatedAtMs === 'number' ? d.updatedAtMs : undefined,
              isSelf: uidStr === user.uid,
            };
          });
          onUpdate(rows);
        } catch (err) {
          if (cancelled || (err instanceof Error && err.name === 'AbortError')) return;
          onError?.('Live leaderboard sync is temporarily unavailable. Your local standing is shown.');
        }
      };

      void fetchLeaderboard();
      const intervalId = window.setInterval(() => {
        void fetchLeaderboard();
      }, 15_000);

      return () => {
        cancelled = true;
        controller?.abort();
        window.clearInterval(intervalId);
      };
    },
    [authReady, user]
  );

  return (
    <CloudSyncContext.Provider
      value={{
        user,
        authReady,
        syncStatus,
        lastSyncedLabel,
        syncError,
        signInWithGoogle,
        signOutCloud,
        syncNow,
        publishDuelAndScore,
        loadDuelEntries,
        publishLeaderboardStanding,
        subscribeToLeaderboard,
      }}
    >
      {children}
    </CloudSyncContext.Provider>
  );
}

export function useCloudSync(): CloudSyncContextValue {
  const ctx = useContext(CloudSyncContext);
  if (!ctx) {
    throw new Error('useCloudSync must be used inside CloudSyncProvider');
  }
  return ctx;
}
