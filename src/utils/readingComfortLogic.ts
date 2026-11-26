export type ReadingSurface = 'default' | 'sepia' | 'night';
export type ReadingFontScale = 'compact' | 'comfort' | 'large';

export interface ReadingComfortPrefs {
  surface: ReadingSurface;
  fontScale: ReadingFontScale;
}

export const READING_COMFORT_STORAGE_KEY = 'eyak_reading_comfort_v1';

export const DEFAULT_READING_COMFORT: ReadingComfortPrefs = {
  surface: 'default',
  fontScale: 'comfort',
};

const VALID_SURFACES: ReadonlySet<string> = new Set(['default', 'sepia', 'night']);
const VALID_SCALES: ReadonlySet<string> = new Set(['compact', 'comfort', 'large']);

export function parseReadingComfortPrefs(raw: string | null | undefined): ReadingComfortPrefs {
  if (!raw) return { ...DEFAULT_READING_COMFORT };
  try {
    const parsed = JSON.parse(raw) as Partial<ReadingComfortPrefs> | null;
    if (!parsed || typeof parsed !== 'object') {
      return { ...DEFAULT_READING_COMFORT };
    }
    const surface: ReadingSurface =
      typeof parsed.surface === 'string' && VALID_SURFACES.has(parsed.surface)
        ? (parsed.surface as ReadingSurface)
        : DEFAULT_READING_COMFORT.surface;
    const fontScale: ReadingFontScale =
      typeof parsed.fontScale === 'string' && VALID_SCALES.has(parsed.fontScale)
        ? (parsed.fontScale as ReadingFontScale)
        : DEFAULT_READING_COMFORT.fontScale;
    return { surface, fontScale };
  } catch {
    return { ...DEFAULT_READING_COMFORT };
  }
}

export function serializeReadingComfortPrefs(prefs: ReadingComfortPrefs): string {
  return JSON.stringify({
    surface: VALID_SURFACES.has(prefs.surface) ? prefs.surface : 'default',
    fontScale: VALID_SCALES.has(prefs.fontScale) ? prefs.fontScale : 'comfort',
  });
}

export function loadReadingComfortPrefs(): ReadingComfortPrefs {
  if (typeof window === 'undefined') return { ...DEFAULT_READING_COMFORT };
  try {
    return parseReadingComfortPrefs(window.localStorage.getItem(READING_COMFORT_STORAGE_KEY));
  } catch {
    return { ...DEFAULT_READING_COMFORT };
  }
}

export function saveReadingComfortPrefs(prefs: ReadingComfortPrefs): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      READING_COMFORT_STORAGE_KEY,
      serializeReadingComfortPrefs(prefs)
    );
  } catch {
    // Ignore storage quota errors in restricted browsing modes
  }
}

/**
 * Estimates comfortable study reading time (at ~165 words/minute for technical/exam notes,
 * minimum 1 min, capped cleanly).
 */
export function estimateReadingMinutesFromHtml(chunks: Array<string | undefined | null>): number {
  const combined = chunks
    .filter((c): c is string => typeof c === 'string' && c.length > 0)
    .join(' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!combined) return 2;
  const words = combined.split(' ').length;
  return Math.max(1, Math.min(15, Math.ceil(words / 165)));
}

export interface MomentumSummaryInput {
  streakDays: number;
  subjectShort: string;
  passedTopics: number;
  totalTopics: number;
  dueCount: number;
}

export interface MomentumSummaryOutput {
  headlineTag: string;
  encouragement: string;
}

/**
 * Synthesizes Duolingo-warm encouragement + Notion-calm clarity without noisy hype.
 */
export function buildCalmMomentumCopy(input: MomentumSummaryInput): MomentumSummaryOutput {
  const { streakDays, subjectShort, passedTopics, totalTopics, dueCount } = input;

  if (totalTopics > 0 && passedTopics >= totalTopics) {
    return {
      headlineTag: `${subjectShort} mastered`,
      encouragement:
        dueCount > 0
          ? `All ${subjectShort} topics passed · ${dueCount} due for recall.`
          : `All ${subjectShort} topics passed. Switch subjects or run a mock.`,
    };
  }

  if (streakDays >= 7) {
    return {
      headlineTag: `${streakDays}-day streak`,
      encouragement: `${streakDays} days straight. Steady daily practice wins.`,
    };
  }

  if (streakDays >= 2) {
    return {
      headlineTag: `${streakDays}-day rhythm`,
      encouragement: `${streakDays} days running — complete one topic step today.`,
    };
  }

  if (passedTopics > 0) {
    return {
      headlineTag: `${passedTopics}/${totalTopics} passed`,
      encouragement: `Continue where you stopped in ${subjectShort}.`,
    };
  }

  return {
    headlineTag: 'Today’s focus',
    encouragement: 'Learn, practise 6 questions, then pass the topic test.',
  };
}

/**
 * Subtle progressive-enhancement tactile pulse for touch devices (silent no-op on desktop/iOS).
 */
export function triggerLightHaptic(durationMs = 10): void {
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    try {
      navigator.vibrate(durationMs);
    } catch {
      // Ignore if blocked by browser autoplay/gesture policy
    }
  }
}
