import type { Question, SubjectId, Topic, TopicProgress, UserProgress } from '../types';
import {
  FREE_STARTER_TOPIC_COUNT,
  PREMIUM_PLANS,
  generateDeviceSecretToken,
  generateSecureDisplayDevId,
  hasActivePremium,
  isTopicPaywalled,
} from './paywallLogic';
import { SUBJECT_TUTOR_REGISTRY } from './tutorRegistry';
import {
  ELEMENTAL_RANKS,
  computeGateCompletionPct,
  extractSmartnessMetricsFromProgress,
  meetsElementalRankGate,
  type ElementalRankId,
} from './elementalRankLogic';
import { isToughJambModeForSubject, resolveExamTrack } from './examTrackLogic';

export const STORAGE_KEY = 'rtc_v0';
export const PRACTICE_LEN = 6;
export const BOSS_HP = 5;
export const BOSS_TIME = 300;
export const B32 = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export const CONFIG = {
  VERSION: '1.0',
  PAYWALL: true,
  FREE_COUNT_PER_SUBJECT: FREE_STARTER_TOPIC_COUNT,
  SEASON_END: [2027, 6, 30] as [number, number, number],
  PLANS: PREMIUM_PLANS,
  APP_URL: '',
};

export const RANKS: [number, string][] = [
  [0, 'Terra'],
  [400, 'Frost'],
  [1100, 'Ember'],
  [2200, 'Tempest'],
  [3800, 'Volt'],
  [6000, 'Plasma'],
  [9000, 'Aether'],
  [13000, 'Solar'],
];

export interface RankProgressInfo {
  level: number;
  currentTitle: string;
  currentMinXp: number;
  nextTitle: string | null;
  nextMinXp: number | null;
  progressRatio: number;
  xpIntoLevel: number;
  xpNeededForNext: number;
}

export function getRankProgress(xp: number): RankProgressInfo {
  const safeXp = Math.max(0, Math.floor(Number.isFinite(xp) ? xp : 0));
  let idx = 0;
  for (let i = 0; i < RANKS.length; i++) {
    if (safeXp >= RANKS[i][0]) idx = i;
  }
  const [curMin, curTitle] = RANKS[idx];
  const next = idx + 1 < RANKS.length ? RANKS[idx + 1] : null;
  if (!next) {
    return {
      level: idx + 1,
      currentTitle: curTitle,
      currentMinXp: curMin,
      nextTitle: null,
      nextMinXp: null,
      progressRatio: 1,
      xpIntoLevel: safeXp - curMin,
      xpNeededForNext: 0,
    };
  }
  const [nextMin, nextTitle] = next;
  const span = Math.max(1, nextMin - curMin);
  const into = Math.min(span, Math.max(0, safeXp - curMin));
  return {
    level: idx + 1,
    currentTitle: curTitle,
    currentMinXp: curMin,
    nextTitle,
    nextMinXp: nextMin,
    progressRatio: into / span,
    xpIntoLevel: into,
    xpNeededForNext: Math.max(0, nextMin - safeXp),
  };
}

export const today = (): number =>
  Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000);

export function h53(str: string, seed = 0): number {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

export function perm(key: string, n: number): number[] {
  const p = Array.from({ length: n }, (_, i) => i);
  let s = h53(key) || 7;
  for (let i = n - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  return p;
}

export interface Rng {
  f: () => number;
  int: (a: number, b: number) => number;
  pick: <T>(a: T[]) => T;
  nz: (a: number, b: number) => number;
}

export function mkR(seed: string): Rng {
  let s = (h53(seed) % 2147483646) + 1;
  const f = () => {
    s = (s * 48271) % 2147483647;
    return (s - 1) / 2147483646;
  };
  const int = (a: number, b: number) => a + Math.floor(f() * (b - a + 1));
  return {
    f,
    int,
    pick: <T>(a: T[]) => a[Math.floor(f() * a.length)],
    nz: (a: number, b: number) => {
      let v: number;
      do v = int(a, b);
      while (!v);
      return v;
    },
  };
}

export function makeBlankProgress(): UserProgress {
  const dev = generateSecureDisplayDevId();
  const devToken = generateDeviceSecretToken();
  return {
    name: '',
    target: 70,
    dx: 0,
    subj: 'eng',
    subjs: ['eng', 'maths'],
    themeId: 'stage-1-adire',
    themeMode: 'light',
    themeLockMode: 'goal',
    themeAutoProgress: false,
    clockFormat: '12h',
    sx: {},
    t: {},
    hist: [],
    rev: {},
    streak: { d: 0, n: 0 },
    muted: false,
    flags: {},
    cust: { add: [], edit: {}, del: {} },
    xp: 0,
    badges: {},
    act: {},
    run: 0,
    revok: 0,
    pro: null,
    trial: null,
    owner: 0,
    sales: [],
    ob: 0,
    dev,
    devToken,
  };
}

export function tstate(p: UserProgress, id: string): TopicProgress {
  return p.t[id] || { att: [], lesson: 0, practice: 0, boss: 0 };
}

export function mastery(p: UserProgress, id: string): number {
  let s = 0.5;
  let w = 2;
  const att = tstate(p, id).att.slice(-12);
  for (const [ok, lvl] of att) {
    const k = 0.6 + 0.2 * lvl;
    w += k;
    if (ok) s += k;
  }
  return s / w;
}

export const pct = (x: number): number => Math.round(x * 100);

export function mpct(p: UserProgress, id: string): number {
  return tstate(p, id).att.length ? pct(mastery(p, id)) : 0;
}

export function computeRatioPct(doneCount: number, totalCount: number): number {
  if (totalCount <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((Math.max(0, doneCount) / totalCount) * 100)));
}

export function computeTopicsProgressPct(
  p: UserProgress,
  items: readonly { id: string }[]
): number {
  if (!items.length) return 0;
  let sum = 0;
  for (const item of items) {
    const st = tstate(p, item.id);
    const ringPct = mpct(p, item.id);
    const topicPct = st.att.length
      ? st.boss
        ? Math.max(ringPct, 70)
        : ringPct
      : st.boss
        ? 100
        : st.practice
          ? 65
          : st.lesson
            ? 30
            : 0;
    sum += topicPct;
  }
  return Math.max(0, Math.min(100, Math.round(sum / items.length)));
}

export function predicted(p: UserProgress, topics: Topic[]): number {
  if (!topics.length) return 0;
  return Math.round((100 * topics.reduce((s, t) => s + mastery(p, t.id), 0)) / topics.length);
}

export function subjTarget(p: UserProgress): number {
  const t = p.target || 70;
  return t > 100 ? Math.round(t / 4) : t;
}

export function tstatus(p: UserProgress, id: string): string {
  const s = tstate(p, id);
  return s.boss
    ? 'Completed'
    : s.practice
      ? 'Test unlocked'
      : s.lesson
        ? 'Lesson done'
        : s.att.length
          ? 'Diagnosed'
          : 'Not started';
}

export function isPro(p: UserProgress, d = today()): boolean {
  return hasActivePremium(p, d);
}

export function isTopicLocked(
  p: UserProgress,
  tid: string,
  subjectTopics: readonly { id: string }[] = [],
  d = today()
): boolean {
  if (!CONFIG.PAYWALL) return false;
  return isTopicPaywalled(p, tid, subjectTopics, d);
}

export function nextMission(
  p: UserProgress,
  topics: Topic[],
  allSubjectTopics: Topic[] = topics,
  d = today()
) {
  const open = topics.filter(
    (t) => !tstate(p, t.id).boss && !isTopicLocked(p, t.id, allSubjectTopics, d)
  );
  if (!open.length) return null;
  const started = (t: Topic) => {
    const s = tstate(p, t.id);
    return s.lesson || s.practice ? 0 : 1;
  };
  open.sort((a, b) => started(a) - started(b) || mastery(p, a.id) - mastery(p, b.id));
  const t = open[0];
  const s = tstate(p, t.id);
  const stage: 'lesson' | 'practice' | 'boss' = !s.lesson
    ? 'lesson'
    : !s.practice
      ? 'practice'
      : 'boss';
  const gain = Math.max(1, Math.round(((0.9 - mastery(p, t.id)) * 100) / Math.max(1, topics.length)));
  return { t, stage, gain };
}

export function homeTopics(
  p: UserProgress,
  topics: Topic[],
  allSubjectTopics: Topic[] = topics,
  d = today()
): Topic[] {
  const rank = (t: Topic) => {
    const locked = isTopicLocked(p, t.id, allSubjectTopics, d);
    const st = tstate(p, t.id);
    if (st.boss) return 3;
    if (locked) return 2;
    return st.lesson || st.practice ? 0 : 1;
  };
  return topics
    .slice()
    .sort((a, b) => rank(a) - rank(b) || mastery(p, a.id) - mastery(p, b.id))
    .slice(0, 4);
}

export function bankForTopic(p: UserProgress, t: Topic): Question[] {
  const base: Question[] = t.qs.map((q, i) => ({
    ...q,
    id: `${t.id}-${i + 1}`,
    t: t.id,
  }));
  return base
    .filter((q) => !p.cust.del[q.id])
    .map((q) => (p.cust.edit[q.id] ? { ...q, ...p.cust.edit[q.id] } : q))
    .concat(p.cust.add.filter((q) => q.t === t.id));
}

export function hstat(p: UserProgress, qid: string): { n: number; ok: number } {
  let n = 0;
  let ok = 0;
  for (const h of p.hist) {
    if (h[0] === qid) {
      n++;
      ok += h[1];
    }
  }
  return { n, ok };
}

export function pickPractice(
  p: UserProgress,
  t: Topic,
  lvl: number,
  seen: string[]
): Question | null {
  const qs = bankForTopic(p, t).filter((q) => !seen.includes(q.id));
  if (!qs.length) return null;
  const toughJamb = isToughJambModeForSubject(resolveExamTrack(p), p.subj, p.jambSubjects);
  const targetLvl = toughJamb ? Math.max(3, lvl) : lvl;
  qs.sort(
    (a, b) =>
      Math.abs(a.l - targetLvl) - Math.abs(b.l - targetLvl) ||
      (toughJamb ? (b.w?.length ? 1 : 0) - (a.w?.length ? 1 : 0) : 0) ||
      hstat(p, a.id).n - hstat(p, b.id).n
  );
  return qs[0];
}

export function bossList(p: UserProgress, t: Topic): string[] {
  const qs = bankForTopic(p, t);
  const toughJamb = isToughJambModeForSubject(resolveExamTrack(p), p.subj, p.jambSubjects);
  const targetPoolSize = BOSS_HP + 2;
  const by = (l: number) =>
    qs
      .filter((q) => q.l === l)
      .sort((x, y) => (toughJamb ? (y.w?.length ? 1 : 0) - (x.w?.length ? 1 : 0) : 0));
  const a = by(3);
  const b = by(4);
  const c = by(5);
  let list = (toughJamb
    ? [c[0], b[0], c[1], b[1], a[0], b[2], c[2]]
    : [a[0], a[1], b[0], b[1], c[0], c[1], a[2]]
  ).filter(Boolean);
  if (list.length < targetPoolSize) {
    list = list.concat(
      qs
        .filter((q) => !list.includes(q))
        .sort((x, y) => aSortFallback(y, toughJamb) - aSortFallback(x, toughJamb))
        .slice(0, targetPoolSize - list.length)
    );
  }
  return list.slice(0, targetPoolSize).map((q) => q.id);
}

function aSortFallback(q: Question, toughJamb: boolean): number {
  return q.l + (toughJamb && q.w?.length ? 0.25 : 0);
}

export function dxList(p: UserProgress, topics: Topic[]): string[] {
  const perTopic = topics.length > 5 ? 1 : 2;
  return topics
    .flatMap((t) =>
      bankForTopic(p, t)
        .filter((q) => q.dx)
        .sort((a, b) => b.l - a.l)
        .slice(0, perTopic)
    )
    .map((q) => q.id);
}

export function dueList(
  p: UserProgress,
  findQ: (id: string) => Question | undefined,
  early = false,
  d = today()
): string[] {
  return Object.keys(p.rev).filter(
    (id) => !!findQ(id) && (early || p.rev[id].due <= d)
  );
}

export function touchStreak(p: UserProgress, d = today()): UserProgress {
  const s = p.streak;
  if (s.d === d) return p;
  return {
    ...p,
    streak: {
      d,
      n: s.d === d - 1 ? s.n + 1 : 1,
    },
  };
}

export function recordAnswer(
  prev: UserProgress,
  q: Question,
  ok: boolean,
  src: 'dx' | 'practice' | 'review' | 'boss',
  d = today()
): UserProgress {
  const curTs = tstate(prev, q.t);
  const nextAtt = [...curTs.att, [ok ? 1 : 0, q.l] as [number, number]].slice(-30);
  const nextHist = [...prev.hist, [q.id, ok ? 1 : 0, d] as [string, number, number]].slice(-800);
  const nextRev = { ...prev.rev };
  let revok = prev.revok;

  if (!ok) {
    nextRev[q.id] = { due: d + 1, st: 0 };
  } else if (nextRev[q.id] && src === 'review') {
    const r = { ...nextRev[q.id], st: nextRev[q.id].st + 1 };
    if (r.st >= 3) delete nextRev[q.id];
    else {
      r.due = d + [1, 3, 7][r.st];
      nextRev[q.id] = r;
    }
    revok += 1;
  }

  const nextAct = { ...prev.act, [d]: (prev.act[d] || 0) + 1 };
  for (const k of Object.keys(nextAct)) {
    if (+k < d - 30) delete nextAct[+k];
  }

  const xpGain = ok ? (src === 'boss' ? 15 : src === 'dx' ? 5 : 10) + 2 * q.l : 2;
  const next = touchStreak(
    {
      ...prev,
      t: { ...prev.t, [q.t]: { ...curTs, att: nextAtt } },
      hist: nextHist,
      rev: nextRev,
      act: nextAct,
      run: ok ? prev.run + 1 : 0,
      revok,
      xp: prev.xp + xpGain,
    },
    d
  );
  return next;
}

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'mythic';

export interface BadgeProgressSnapshot {
  cur: number;
  max: number;
  unit?: string;
}

export interface BadgeDef {
  id: string;
  name: string;
  desc: string;
  icon: string;
  tier: BadgeTier;
  xpBonus: number;
  elementId?: ElementalRankId;
  ok: (
    p: UserProgress,
    topics: Topic[],
    allTopicsBySubj?: Partial<Record<SubjectId, Topic[]>>
  ) => boolean;
  progress?: (
    p: UserProgress,
    topics: Topic[],
    allTopicsBySubj?: Partial<Record<SubjectId, Topic[]>>
  ) => BadgeProgressSnapshot;
}

const ELEMENTAL_ICON_MAP: Record<ElementalRankId, string> = {
  terra: 'shield',
  frost: 'star',
  ember: 'flame',
  tempest: 'bolt',
  volt: 'bolt',
  plasma: 'atom',
  aether: 'award',
  solar: 'crown',
};

/**
 * 8 Hard-Earned Elemental Rank Badges (Terra -> Solar).
 * Requires BOTH steep Smartness-Weighted Rank Points (RP) AND strict Accuracy / Syllabus / Mock gates
 * in ascending Elemental order.
 */
export const BADGES: BadgeDef[] = ELEMENTAL_RANKS.map((rank, idx) => ({
  id: `rank-${rank.id}`,
  name: rank.element,
  desc: `${rank.minAccuracyPct}%+ acc · ${rank.minTopicsPassed} topics${
    rank.minCbtScore > 0 ? ` · ${rank.minCbtScore}+ mock` : ''
  }`,
  icon: ELEMENTAL_ICON_MAP[rank.id],
  tier: rank.tierGroup,
  xpBonus: rank.xpBonus,
  elementId: rank.id,
  ok: (p, _ts, allBySubj) => {
    const metrics = extractSmartnessMetricsFromProgress(p, allBySubj);
    for (let i = 0; i <= idx; i++) {
      if (!meetsElementalRankGate(ELEMENTAL_RANKS[i], metrics)) return false;
    }
    return true;
  },
  progress: (p, _ts, allBySubj) => {
    const metrics = extractSmartnessMetricsFromProgress(p, allBySubj);
    return {
      cur: computeGateCompletionPct(rank, metrics),
      max: 100,
      unit: '%',
    };
  },
}));

export function evaluateNewBadges(
  p: UserProgress,
  topics: Topic[],
  d = today(),
  allTopicsBySubj?: Partial<Record<SubjectId, Topic[]>>
): { progress: UserProgress; newlyEarned: BadgeDef[] } {
  const nextBadges = { ...p.badges };
  const newlyEarned: BadgeDef[] = [];
  let bonusXp = 0;
  for (const b of BADGES) {
    if (nextBadges[b.id] && nextBadges[b.id] !== 1) continue;
    if (b.ok(p, topics, allTopicsBySubj)) {
      nextBadges[b.id] = d;
      newlyEarned.push(b);
      bonusXp += b.xpBonus;
    }
  }
  return {
    progress: newlyEarned.length ? { ...p, badges: nextBadges, xp: p.xp + bonusXp } : p,
    newlyEarned,
  };
}

export const mmss = (s: number): string =>
  Math.floor(s / 60) + ':' + String(Math.max(0, s) % 60).padStart(2, '0');

export const greet = (): string => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
};

export const naira = (n: number): string => '₦' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const fmtDev = (d: string): string => d.slice(0, 4) + '-' + d.slice(4);

export const cleanCode = (s: string): string => String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, '');

export const SUBJECT_INFO: Record<
  SubjectId,
  { id: SubjectId; name: string; short: string; compact: string; icon: string }
> = (Object.keys(SUBJECT_TUTOR_REGISTRY) as SubjectId[]).reduce(
  (acc, id) => {
    const meta = SUBJECT_TUTOR_REGISTRY[id];
    acc[id] = {
      id,
      name: meta.name,
      short: meta.short,
      compact: meta.compact,
      icon: meta.icon,
    };
    return acc;
  },
  {} as Record<SubjectId, { id: SubjectId; name: string; short: string; compact: string; icon: string }>
);

export const ONBOARDING_SLIDES = [
  {
    id: 'score',
    title: 'Track your true mastery every day',
    body: 'A short diagnostic maps your starting mastery across SS1–SS3 topics. Every concept you learn and question you solve moves your mastery meter toward your personal goal.',
  },
  {
    id: 'lessons',
    title: 'Lessons & labs that make concepts click',
    body: 'Every topic is taught in crisp steps with publication-grade equations, live interactive simulations, virtual laboratories, and professional AI voice mentors.',
  },
  {
    id: 'practice',
    title: 'Practise until nothing surprises you',
    body: 'Progressive mastery questions from foundational to advanced, each with a step-by-step solution. Missed concepts return in spaced review until they become second nature.',
  },
];
