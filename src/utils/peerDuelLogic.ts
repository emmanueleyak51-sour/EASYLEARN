import type { Question, SubjectId, Topic, UserProgress } from '../types';
import { SUBJECT_INFO, bankForTopic, perm } from './engine';

export interface PeerDuelSpec {
  code: string;
  subj: SubjectId;
  seed: string;
  questionCount: number;
  title: string;
}

const VALID_SUBJ_MAP: Record<string, SubjectId> = {
  MTH: 'maths',
  FMT: 'fmaths',
  CHM: 'chem',
  PHY: 'phys',
  BIO: 'bio',
  AGR: 'agric',
  GEO: 'geog',
  ECN: 'econ',
  ENG: 'eng',
  CVC: 'civic',
  DGT: 'digitech',
  DPR: 'dataproc',
};

const SUBJ_TO_TAG: Record<SubjectId, string> = {
  maths: 'MTH',
  fmaths: 'FMT',
  chem: 'CHM',
  phys: 'PHY',
  bio: 'BIO',
  agric: 'AGR',
  geog: 'GEO',
  econ: 'ECN',
  eng: 'ENG',
  civic: 'CVC',
  digitech: 'DGT',
  dataproc: 'DPR',
};

export function createDuelCode(subj: SubjectId, seedOverride?: string): PeerDuelSpec {
  const tag = SUBJ_TO_TAG[subj] || 'MTH';
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let seed = seedOverride ? seedOverride.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6) : '';
  while (seed.length < 6) {
    seed += chars[Math.floor(Math.random() * chars.length)];
  }
  const code = `RTC-${tag}-${seed}`;
  return {
    code,
    subj,
    seed,
    questionCount: 10,
    title: `${SUBJECT_INFO[subj].name} 10-Q Sprint`,
  };
}

export function parseDuelCode(raw: string): PeerDuelSpec | null {
  const clean = raw.trim().toUpperCase();
  const m = clean.match(/^RTC-([A-Z]{3})-([A-Z0-9]{4,10})$/);
  if (!m) return null;
  const subj = VALID_SUBJ_MAP[m[1]];
  if (!subj) return null;
  const seed = m[2];
  return {
    code: `RTC-${m[1]}-${seed}`,
    subj,
    seed,
    questionCount: 10,
    title: `${SUBJECT_INFO[subj].name} 10-Q Sprint`,
  };
}

export function buildDuelQuestions(
  spec: PeerDuelSpec,
  progress: UserProgress,
  topics: Topic[]
): { q: Question; topicName: string; order: number[] }[] {
  const pool: { q: Question; topicName: string }[] = [];
  for (const t of topics) {
    for (const q of bankForTopic(progress, t)) {
      pool.push({ q, topicName: t.name });
    }
  }
  if (!pool.length) return [];
  const idxs = perm(`duel|${spec.code}|${pool.length}`, pool.length);
  const take = Math.min(spec.questionCount, pool.length);
  return idxs.slice(0, take).map((idx) => {
    const item = pool[idx];
    return {
      q: item.q,
      topicName: item.topicName,
      order: perm(`duel-opt|${spec.code}|${item.q.id}`, item.q.o.length),
    };
  });
}

export function buildDuelShareUrl(code: string): string {
  if (typeof window === 'undefined') return `?duel=${encodeURIComponent(code)}`;
  const url = new URL(window.location.href);
  url.searchParams.set('duel', code);
  url.searchParams.delete('autostart');
  return url.toString();
}
