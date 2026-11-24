export const DEMO_DURATION_MS = 5 * 60 * 1000; // 5 minutes strict
export const DEMO_WARNING_THRESHOLD_MS = 60 * 1000; // final 60s warning tint
export const DEMO_STORAGE_KEY = 'elrn_demo_session_v1';

export interface DemoSessionRecord {
  startedAtMs: number;
  active: boolean;
}

export interface DemoSessionStatus {
  isDemoActive: boolean;
  hasStarted: boolean;
  remainingMs: number;
  remainingSeconds: number;
  formattedRemaining: string;
  isWarning: boolean;
  isExpired: boolean;
}

export function formatDemoCountdown(remainingMs: number): string {
  const clampedSec = Math.max(0, Math.ceil(remainingMs / 1000));
  const mins = Math.floor(clampedSec / 60);
  const secs = clampedSec % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

/**
 * Starts a strict 5-minute demo session, or resumes the existing clock if the user
 * already started a demo on this device (prevents resetting the 5-minute limit by
 * refreshing or clicking "Try demo" again).
 */
export function startOrResumeDemoSession(
  existing: DemoSessionRecord | null | undefined,
  nowMs = Date.now()
): DemoSessionRecord {
  if (
    existing &&
    typeof existing.startedAtMs === 'number' &&
    Number.isFinite(existing.startedAtMs) &&
    existing.startedAtMs > 0
  ) {
    return {
      startedAtMs: existing.startedAtMs,
      active: true,
    };
  }
  return {
    startedAtMs: nowMs,
    active: true,
  };
}

/**
 * Exits active demo screens (e.g. to open Registration/Login) while preserving
 * `startedAtMs` so re-entering demo cannot reset the strict 5-minute clock.
 */
export function pauseDemoSessionKeepClock(
  existing: DemoSessionRecord | null | undefined
): DemoSessionRecord | null {
  if (!existing || !Number.isFinite(existing.startedAtMs)) return null;
  return {
    startedAtMs: existing.startedAtMs,
    active: false,
  };
}

export function computeDemoSessionStatus(
  session: DemoSessionRecord | null | undefined,
  nowMs = Date.now(),
  durationMs = DEMO_DURATION_MS
): DemoSessionStatus {
  if (!session || !Number.isFinite(session.startedAtMs) || session.startedAtMs <= 0) {
    return {
      isDemoActive: false,
      hasStarted: false,
      remainingMs: durationMs,
      remainingSeconds: Math.ceil(durationMs / 1000),
      formattedRemaining: formatDemoCountdown(durationMs),
      isWarning: false,
      isExpired: false,
    };
  }

  const elapsed = Math.max(0, nowMs - session.startedAtMs);
  const remainingMs = Math.max(0, durationMs - elapsed);
  const remainingSeconds = Math.ceil(remainingMs / 1000);
  const isExpired = remainingMs <= 0;
  const isWarning = !isExpired && remainingMs <= DEMO_WARNING_THRESHOLD_MS;

  return {
    isDemoActive: Boolean(session.active),
    hasStarted: true,
    remainingMs,
    remainingSeconds,
    formattedRemaining: formatDemoCountdown(remainingMs),
    isWarning,
    isExpired,
  };
}

export function loadDemoSession(): DemoSessionRecord | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(DEMO_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<DemoSessionRecord>;
    if (typeof parsed.startedAtMs !== 'number' || !Number.isFinite(parsed.startedAtMs)) {
      return null;
    }
    return {
      startedAtMs: parsed.startedAtMs,
      active: Boolean(parsed.active),
    };
  } catch {
    return null;
  }
}

export function saveDemoSession(session: DemoSessionRecord | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (!session) {
      window.localStorage.removeItem(DEMO_STORAGE_KEY);
    } else {
      window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(session));
    }
  } catch {
    /* ignore storage quota errors */
  }
}
