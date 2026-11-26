export interface OpeningWelcomeCopy {
  greeting: string;
  headline: string;
  subline: string;
  ctaLabel: string;
  readinessItems: readonly string[];
}

export interface WelcomeStarNode {
  id: number;
  xPct: number;
  yPct: number;
  sizePx: number;
  delaySec: number;
  durationSec: number;
  isGold: boolean;
}

export interface CrestParallaxTilt {
  rotateX: number;
  rotateY: number;
  glareX: number;
  glareY: number;
}

/**
 * Determines whether the animated Easy Learn opening welcome curtain should play.
 * - `?splash=1` forces the animated welcome on demand.
 * - `?autostart=1` or `?nosplash=1` skips immediately for instant deep-links.
 * - Otherwise plays once per browser session on initial app entry.
 */
export function shouldShowOpeningWelcome(
  search: string,
  alreadyShownInSession: boolean
): boolean {
  const cleanSearch = search.startsWith('?') ? search.slice(1) : search;
  const params = new URLSearchParams(cleanSearch);

  if (params.get('splash') === '1') {
    return true;
  }
  if (params.get('autostart') === '1' || params.get('nosplash') === '1') {
    return false;
  }
  return !alreadyShownInSession;
}

export function getTimeOfDayGreeting(hour24: number): string {
  const safeHour = ((Math.trunc(hour24) % 24) + 24) % 24;
  if (safeHour < 12) return 'Good morning';
  if (safeHour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function buildOpeningWelcomeCopy(
  studentName?: string | null,
  hour24: number = new Date().getHours(),
  stats?: { subjectCount?: number; streakDays?: number; xp?: number }
): OpeningWelcomeCopy {
  const trimmed = (studentName || '').trim();
  const timeGreet = getTimeOfDayGreeting(hour24);
  const subjCount = stats?.subjectCount && stats.subjectCount > 0 ? stats.subjectCount : 49;
  const streak = stats?.streakDays && stats.streakDays > 0 ? stats.streakDays : 0;

  if (trimmed.length > 0) {
    const items: string[] = [
      `${subjCount} Active ${subjCount === 1 ? 'Subject' : 'Subjects'}`,
      'Interactive Worlds',
      'Voice Teachers',
      streak > 0 ? `${streak}d Streak` : 'Virtual Labs',
    ];
    return {
      greeting: `${timeGreet}, ${trimmed}`,
      headline: 'Welcome back to Easy Learn',
      subline: 'Your personal campus studio is ready.',
      ctaLabel: 'Continue Learning',
      readinessItems: items,
    };
  }

  return {
    greeting: `${timeGreet}, Scholar`,
    headline: 'Welcome to Easy Learn',
    subline: 'Explore subjects as living worlds, master every topic, and ace your exams.',
    ctaLabel: 'Enter Studio',
    readinessItems: ['49 Subjects', 'Interactive Worlds', 'Voice Teachers', 'Virtual Labs'],
  };
}

/**
 * Clamps normalized pointer offsets [-1, 1] into smooth 3D perspective tilt angles
 * and specular glare percentages without triggering React state churn.
 */
export function computeCrestParallaxTilt(
  normX: number,
  normY: number,
  maxDeg = 11
): CrestParallaxTilt {
  const cx = Math.max(-1, Math.min(1, Number.isFinite(normX) ? normX : 0));
  const cy = Math.max(-1, Math.min(1, Number.isFinite(normY) ? normY : 0));
  const cap = Math.max(0, Math.min(20, maxDeg));

  return {
    rotateX: Number((-cy * cap).toFixed(2)),
    rotateY: Number((cx * cap).toFixed(2)),
    glareX: Math.round(50 + cx * 34),
    glareY: Math.round(50 + cy * 34),
  };
}

/**
 * Generates a deterministic golden-ratio starfield around the welcome stage
 * (keeping the central text zone clear for crisp legibility).
 */
export function generateWelcomeStarfield(count = 16): WelcomeStarNode[] {
  const safeCount = Math.max(0, Math.min(36, Math.trunc(count)));
  const nodes: WelcomeStarNode[] = [];
  const phi = 0.61803398875;

  for (let i = 0; i < safeCount; i++) {
    const u = ((i + 0.5) / Math.max(1, safeCount));
    const v = ((i * phi) % 1);
    // Push stars gently toward a scenic ring around the center stage
    const angle = v * Math.PI * 2;
    const radius = 24 + u * 23;
    const xPct = Number(Math.max(6, Math.min(94, 50 + Math.cos(angle) * radius * 1.35)).toFixed(1));
    const yPct = Number(Math.max(8, Math.min(92, 46 + Math.sin(angle) * radius)).toFixed(1));

    nodes.push({
      id: i,
      xPct,
      yPct,
      sizePx: i % 4 === 0 ? 4 : i % 2 === 0 ? 3 : 2,
      delaySec: Number(((i % 6) * 0.28).toFixed(2)),
      durationSec: Number((2.4 + (i % 4) * 0.45).toFixed(2)),
      isGold: i % 3 === 0,
    });
  }

  return nodes;
}
