import type { SubjectId } from '../types';

export const MOTIVATION_ROTATION_MS = 3 * 60 * 1000; // 3 minutes (180,000 ms)

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

export const MOTIVATION_SLIDES: MotivationSlide[] = [
  {
    id: 'campus-dawn',
    index: 0,
    kicker: 'Campus Vision · Stay Steady',
    headline: 'Every single chapter you master today builds the scholar you become tomorrow.',
    body: 'Distinction is never built in one frantic night—it is built quietly, twenty focused minutes at a time, when nobody else is watching.',
    authorOrPillar: 'Daily Consistency Principle',
    takeaway: 'Focus on understanding one concept deeply right now.',
    bgGradient: 'linear-gradient(132deg, #162B4D 0%, #24457A 55%, #1B355E 100%)',
    borderAccent: '#385F9E',
    accentColor: '#FFD84D',
    motif: 'sunrise',
  },
  {
    id: 'mistake-forge',
    index: 1,
    kicker: 'Growth Mindset · Fearless Practice',
    headline: 'A missed question today is a concept mastered for life.',
    body: 'Never feel discouraged when a calculation or principle trips you up here. Spotting the trap in practice means it can never catch you off guard again.',
    authorOrPillar: 'Scholar’s Resilience',
    takeaway: 'Treat every correction as sharpening your edge.',
    bgGradient: 'linear-gradient(132deg, #153B31 0%, #1E5646 55%, #13332A 100%)',
    borderAccent: '#2E7A64',
    accentColor: '#6EE7B7',
    motif: 'torch',
  },
  {
    id: 'summit-climb',
    index: 2,
    kicker: 'Momentum · Step by Step',
    headline: 'You do not have to climb the whole curriculum at once—just take the next clear step.',
    body: 'Every honours scholar starts from the exact same blank page. Patience with first principles turns intimidating equations into second nature.',
    authorOrPillar: 'Mastery Over Rush',
    takeaway: 'Small daily wins compound into extraordinary results.',
    bgGradient: 'linear-gradient(132deg, #3B1D4A 0%, #582B6E 55%, #2D1539 100%)',
    borderAccent: '#7B4296',
    accentColor: '#FDE047',
    motif: 'summit',
  },
  {
    id: 'deep-roots',
    index: 3,
    kicker: 'Clarity · First Principles',
    headline: 'When you understand the "why", no unfamiliar problem can shake your confidence.',
    body: 'Rote memorization fades quickly, but true conceptual understanding stays calm under any challenge. Pause, picture the law at work, and trust your reasoning.',
    authorOrPillar: 'First-Principles Thinking',
    takeaway: 'Calm clarity beats speed—speed follows naturally.',
    bgGradient: 'linear-gradient(132deg, #4A2518 0%, #733A24 55%, #3B1C12 100%)',
    borderAccent: '#9A5236',
    accentColor: '#FCD34D',
    motif: 'compass',
  },
  {
    id: 'future-honour',
    index: 4,
    kicker: 'Future Scholar · Pride in the Work',
    headline: 'Your future self walking onto campus is grateful you refused to quit today.',
    body: 'Medicine, Engineering, Law, Sciences, Arts—whatever dream you carry, the discipline you build right here proves you belong in that lecture hall.',
    authorOrPillar: 'EYAK Creed',
    takeaway: 'Keep going—your hard work is adding up.',
    bgGradient: 'linear-gradient(132deg, #1E293B 0%, #334155 52%, #0F172A 100%)',
    borderAccent: '#64748B',
    accentColor: '#FBBF24',
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
  const subjLabel =
    subj === 'chem'
      ? 'Chemistry'
      : subj === 'fmaths'
        ? 'Further Mathematics'
        : subj === 'phys'
          ? 'Physics'
          : subj === 'bio'
            ? 'Biology'
            : subj === 'agric'
              ? 'Agricultural Science'
              : subj === 'geog'
                ? 'Geography'
                : subj === 'econ'
                  ? 'Economics'
                  : subj === 'eng'
                    ? 'English'
                    : subj === 'civic'
                      ? 'Civic Education'
                      : subj === 'digitech'
                        ? 'Digital Technologies'
                        : subj === 'dataproc'
                          ? 'Data Processing'
                          : subj === 'maths'
                            ? 'Mathematics'
                            : '';
  if (cleanName && subjLabel) return `${cleanName}, keep shining in ${subjLabel}`;
  if (cleanName) return `Keep shining, ${cleanName}`;
  if (subjLabel) return `Your ${subjLabel} journey is in motion`;
  return 'Your learning journey is in motion';
}
