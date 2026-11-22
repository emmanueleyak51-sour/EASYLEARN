import type { SubjectId, Topic, UserProgress } from '../types';
import { predicted } from './engine';

/**
 * All 25 official JAMB UTME subjects (also examined in WAEC/NECO).
 */
export const JAMB_SUBJECT_IDS: readonly SubjectId[] = [
  'eng',
  'maths',
  'phys',
  'chem',
  'bio',
  'agric',
  'geog',
  'econ',
  'govt',
  'lit',
  'crs',
  'irs',
  'comm',
  'acct',
  'hist',
  'comp',
  'homeec',
  'phe',
  'art',
  'music',
  'french',
  'arabic',
  'hausa',
  'igbo',
  'yoruba',
];

/**
 * WAEC/NECO-only academic, technical and commercial school subjects (excluded from JAMB mock and /400 estimate).
 */
export const WAEC_SCHOOL_ONLY_SUBJECT_IDS: readonly SubjectId[] = [
  'fmaths',
  'civic',
  'digitech',
  'dataproc',
  'techdraw',
  'foodnut',
  'homemgt',
  'animalhusb',
  'fisheries',
  'marketing',
  'officeprac',
  'insurance',
  'storemgt',
  'bookkeep',
];

/**
 * WAEC/NECO-only trade and entrepreneurship subjects (excluded from JAMB mock and /400 estimate).
 */
export const WAEC_TRADE_ONLY_SUBJECT_IDS: readonly SubjectId[] = [
  'catering',
  'garment',
  'photo',
  'cosmet',
  'tourism',
  'elecinst',
  'automech',
  'carpentry',
  'blocklay',
  'gsm',
];

/**
 * All WAEC/NECO-only subjects (school + trade).
 */
export const WAEC_ONLY_SUBJECT_IDS: readonly SubjectId[] = [
  ...WAEC_SCHOOL_ONLY_SUBJECT_IDS,
  ...WAEC_TRADE_ONLY_SUBJECT_IDS,
];

/**
 * Legacy 12 NERDC subjects that have SS1–SS3 class tabs.
 */
export const CLASS_TABBED_SUBJECT_IDS: readonly SubjectId[] = [
  'eng',
  'maths',
  'phys',
  'chem',
  'bio',
  'agric',
  'geog',
  'econ',
  'fmaths',
  'civic',
  'digitech',
  'dataproc',
];

export const ALL_SUBJECT_IDS: readonly SubjectId[] = [
  ...JAMB_SUBJECT_IDS,
  ...WAEC_ONLY_SUBJECT_IDS,
];

const JAMB_SET: ReadonlySet<string> = new Set(JAMB_SUBJECT_IDS);
const WAEC_ONLY_SET: ReadonlySet<string> = new Set(WAEC_ONLY_SUBJECT_IDS);
const CLASS_TABBED_SET: ReadonlySet<string> = new Set(CLASS_TABBED_SUBJECT_IDS);
const LAB_SUBJECT_SET: ReadonlySet<string> = new Set(['maths', 'chem', 'phys', 'bio', 'agric']);
const FORMULA_SUBJECT_SET: ReadonlySet<string> = new Set([
  'maths',
  'fmaths',
  'chem',
  'phys',
  'geog',
  'econ',
  'eng',
  'digitech',
  'dataproc',
]);

export function isJambSubject(sid: SubjectId): boolean {
  return JAMB_SET.has(sid);
}

export function isWaecOnlySubject(sid: SubjectId): boolean {
  return WAEC_ONLY_SET.has(sid);
}

/**
 * True for all subjects that follow a single-block UTME/WAEC syllabus without SS1–SS3 tabs.
 */
export function isUtmeSingleBlockSubject(sid: SubjectId): boolean {
  return !CLASS_TABBED_SET.has(sid);
}

export function hasLabsForSubject(sid: SubjectId): boolean {
  return LAB_SUBJECT_SET.has(sid);
}

export function hasFormulasForSubject(sid: SubjectId): boolean {
  return FORMULA_SUBJECT_SET.has(sid);
}

/**
 * Estimates a student's JAMB UTME score out of 400 across up to 4 JAMB subjects,
 * strictly excluding WAEC/NECO-only subjects.
 */
export function estimateJambScoreOutOf400(
  progress: UserProgress,
  getTopicsFn: (sid: SubjectId) => Topic[]
): number {
  const jambEnrolled = progress.subjs.filter((sid) => isJambSubject(sid));
  const withEnglishFirst: SubjectId[] = jambEnrolled.includes('eng')
    ? ['eng', ...jambEnrolled.filter((sid) => sid !== 'eng')]
    : ['eng', ...jambEnrolled];
  const pool = withEnglishFirst.slice(0, 4);
  if (pool.length === 0) return 0;

  let sumPct = 0;
  for (const sid of pool) {
    const topics = getTopicsFn(sid);
    sumPct += topics.length > 0 ? predicted(progress, topics) : 50;
  }
  const avgPct = sumPct / pool.length;
  return Math.max(0, Math.min(400, Math.round(avgPct * 4)));
}
