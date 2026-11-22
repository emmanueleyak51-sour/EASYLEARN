import type { SubjectId } from '../types';
import { SUBJECT_INFO } from './engine';

export const MOTIVATION_ROTATION_MS = 24 * 60 * 60 * 1000;

export interface MotivationSlide {
  id: string;
  index: number;
  kicker: string;
  headline: string;
  body: string;
  authorOrPillar: string;
  takeaway: string;
  bgGradient: string;
  borderAccent: string;
  accentColor: string;
  motif: 'sunrise' | 'summit' | 'compass' | 'torch' | 'laurel';
}

export const DAILY_QUIET_LINES: readonly string[] = [
  'Twenty calm minutes today beats three rushed hours the night before.',
  'Missing a question here is good news — you found the trap before exam day.',
  'Read every option to the end before you pick your answer.',
  'One clear topic a day adds up faster than you think.',
  'When you understand why an answer works, new twists will not throw you off.',
  'Slow down on words like "except", "not" and "least" in the question.',
  'Steady daily practice builds the kind of calm that scores high.',
];

export function getDailyQuietLine(dayNumber: number): string {
  const safeDay = Number.isFinite(dayNumber) ? Math.abs(Math.floor(dayNumber)) : 0;
  return DAILY_QUIET_LINES[safeDay % DAILY_QUIET_LINES.length];
}

export const MOTIVATION_SLIDES: MotivationSlide[] = [
  {
    id: 'campus-dawn',
    index: 0,
    kicker: 'Steady progress',
    headline: DAILY_QUIET_LINES[0],
    body: 'Small, steady sessions help what you read stick for good.',
    authorOrPillar: 'Daily note',
    takeaway: 'Take one topic at a time.',
    bgGradient: 'linear-gradient(132deg, #4920B5 0%, #5B2BD6 100%)',
    borderAccent: '#C9B8F7',
    accentColor: '#FFE1D1',
    motif: 'sunrise',
  },
  {
    id: 'mistake-forge',
    index: 1,
    kicker: 'Calm practice',
    headline: DAILY_QUIET_LINES[1],
    body: 'Check why an option was wrong and you will spot it next time.',
    authorOrPillar: 'Daily note',
    takeaway: 'Every correction makes you sharper.',
    bgGradient: 'linear-gradient(132deg, #4920B5 0%, #5B2BD6 100%)',
    borderAccent: '#C9B8F7',
    accentColor: '#D3F5EA',
    motif: 'torch',
  },
  {
    id: 'summit-climb',
    index: 2,
    kicker: 'Step by step',
    headline: DAILY_QUIET_LINES[2],
    body: 'Many wrong choices look tempting in the first three words.',
    authorOrPillar: 'Daily note',
    takeaway: 'Read carefully, then choose.',
    bgGradient: 'linear-gradient(132deg, #4920B5 0%, #5B2BD6 100%)',
    borderAccent: '#C9B8F7',
    accentColor: '#DCEBFF',
    motif: 'summit',
  },
  {
    id: 'deep-roots',
    index: 3,
    kicker: 'Clear thinking',
    headline: DAILY_QUIET_LINES[3],
    body: 'Finish one short lesson, try six questions, and rest easy.',
    authorOrPillar: 'Daily note',
    takeaway: 'Clear beats fast.',
    bgGradient: 'linear-gradient(132deg, #4920B5 0%, #5B2BD6 100%)',
    borderAccent: '#C9B8F7',
    accentColor: '#FFE1D1',
    motif: 'compass',
  },
  {
    id: 'future-honour',
    index: 4,
    kicker: 'Keep going',
    headline: DAILY_QUIET_LINES[4],
    body: 'Your quiet work today is building your score.',
    authorOrPillar: 'Daily note',
    takeaway: 'Keep going at your own pace.',
    bgGradient: 'linear-gradient(132deg, #4920B5 0%, #5B2BD6 100%)',
    borderAccent: '#C9B8F7',
    accentColor: '#D3F5EA',
    motif: 'laurel',
  },
];

export function getMotivationSlotAtTime(nowMs: number, offset = 0): number {
  const safeNow = Number.isFinite(nowMs) && nowMs >= 0 ? nowMs : 0;
  const baseIdx = Math.floor(safeNow / MOTIVATION_ROTATION_MS);
  const n = MOTIVATION_SLIDES.length;
  return (((baseIdx + offset) % n) + n) % n;
}

export function getPersonalizedGreetingLine(name?: string, subj?: SubjectId): string {
  const cleanName = (name || '').trim();
  const subjLabel = subj && SUBJECT_INFO[subj] ? SUBJECT_INFO[subj].name : '';
  if (cleanName && subjLabel) return `${cleanName}, ready for a little ${subjLabel} today?`;
  if (cleanName) return `Good to see you, ${cleanName}`;
  if (subjLabel) return `Ready for ${subjLabel} today?`;
  return 'Take one calm step today';
}
