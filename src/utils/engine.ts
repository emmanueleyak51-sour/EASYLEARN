import type { Question, SubjectId, Topic, TopicProgress, UserProgress } from '../types';

export const STORAGE_KEY = 'rtc_v0';
export const PRACTICE_LEN = 6;
export const BOSS_HP = 5;
export const BOSS_TIME = 300;
export const B32 = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export const CONFIG = {
  VERSION: '1.0',
  PAYWALL: false,
  FREE: ['bases', 'indices', 'surds'],
  SEASON_END: [2027, 6, 30] as [number, number, number],
  PLANS: [
    { id: 'W', name: 'Weekly Pass', price: 500, days: 7, blurb: '7 days of everything. Good for a test drive.' },
    { id: 'S', name: 'Season Pass', price: 2500, best: true, blurb: 'Everything until the end of the 2027 academic year.' },
  ],
  APP_URL: '',
  OWNER_HASH: 4545178415675152,
  SECRET: 'G5Rxm5CCItxoA8A9',
};

export const RANKS: [number, string][] = [
  [0, 'Fresh Starter'],
  [300, 'Serious Learner'],
  [900, 'Focused Scholar'],
  [2000, 'Sharp Shooter'],
  [4000, 'Honours Ready'],
  [7000, 'Distinction Material'],
  [11000, 'National Laureate'],
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
  let dev = '';
  for (let i = 0; i < 8; i++) dev += B32[Math.floor(Math.random() * 32)];
  return {
    name: '',
    target: 70,
    dx: 0,
    subj: 'maths',
    subjs: [
      'maths',
      'fmaths',
      'chem',
      'phys',
      'bio',
      'agric',
      'geog',
      'econ',
      'eng',
      'civic',
      'digitech',
      'dataproc',
    ],
    themeId: 'stage-1-adire',
    themeMode: 'light',
    themeLockMode: 'unlocked',
    themeAutoProgress: true,
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
    owner: 0,
    sales: [],
    ob: 0,
    dev,
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
  return !CONFIG.PAYWALL || !!(p.owner || (p.pro && p.pro.until >= d));
}

export function isTopicLocked(p: UserProgress, tid: string, d = today()): boolean {
  return !isPro(p, d) && !CONFIG.FREE.includes(tid);
}

export function nextMission(p: UserProgress, topics: Topic[]) {
  const open = topics.filter((t) => !tstate(p, t.id).boss && !isTopicLocked(p, t.id));
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

export function homeTopics(p: UserProgress, topics: Topic[]): Topic[] {
  const rank = (t: Topic) => {
    const st = tstate(p, t.id);
    return st.boss ? 2 : st.lesson || st.practice ? 0 : 1;
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
  qs.sort(
    (a, b) => Math.abs(a.l - lvl) - Math.abs(b.l - lvl) || hstat(p, a.id).n - hstat(p, b.id).n
  );
  return qs[0];
}

export function bossList(p: UserProgress, t: Topic): string[] {
  const qs = bankForTopic(p, t);
  const by = (l: number) => qs.filter((q) => q.l === l);
  const a = by(3);
  const b = by(4);
  const c = by(5);
  let list = [a[0], a[1], b[0], b[1], c[0], c[1], a[2]].filter(Boolean);
  if (list.length < BOSS_HP + 2) {
    list = list.concat(
      qs
        .filter((q) => !list.includes(q))
        .sort((x, y) => y.l - x.l)
        .slice(0, BOSS_HP + 2 - list.length)
    );
  }
  return list.map((q) => q.id);
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

const countFlagsPrefix = (p: UserProgress, prefix: string): number =>
  Object.keys(p.flags || {}).filter((k) => k.startsWith(prefix) && p.flags[k] > 0).length;

const countTotalBossesPassed = (p: UserProgress): number =>
  Object.values(p.t || {}).filter((st) => st && st.boss > 0).length;

const countTotalLessonsDone = (p: UserProgress): number =>
  Object.values(p.t || {}).filter((st) => st && st.lesson > 0).length;

const accuracyPercent = (p: UserProgress): number => {
  if (!p.hist.length) return 0;
  const right = p.hist.reduce((s, h) => s + (h[1] === 1 ? 1 : 0), 0);
  return Math.round((right / p.hist.length) * 100);
};

export const BADGES: BadgeDef[] = [
  // ── BRONZE TIER (Foundational Discipline — 6 Badges) ──
  {
    id: 'first',
    name: 'First Step',
    desc: 'Calibrate your baseline by finishing a diagnostic test',
    icon: 'target',
    tier: 'bronze',
    xpBonus: 40,
    ok: (p) => !!(p.dx && p.hist.length > 0),
    progress: (p) => ({ cur: p.dx && p.hist.length > 0 ? 1 : 0, max: 1, unit: 'diagnostic' }),
  },
  {
    id: 'lesson5',
    name: 'Dedicated Reader',
    desc: 'Complete 5 full interactive lessons across your subjects',
    icon: 'book',
    tier: 'bronze',
    xpBonus: 60,
    ok: (p) => countTotalLessonsDone(p) >= 5,
    progress: (p) => ({ cur: Math.min(5, countTotalLessonsDone(p)), max: 5, unit: 'lessons' }),
  },
  {
    id: 'boss3',
    name: 'Triple Crown',
    desc: 'Conquer 3 timed Topic Tests with poise',
    icon: 'shield',
    tier: 'bronze',
    xpBonus: 75,
    ok: (p) => countTotalBossesPassed(p) >= 3,
    progress: (p) => ({ cur: Math.min(3, countTotalBossesPassed(p)), max: 3, unit: 'tests' }),
  },
  {
    id: 'streak3',
    name: 'Ignited Streak',
    desc: 'Study and answer questions for 3 consecutive days',
    icon: 'flame',
    tier: 'bronze',
    xpBonus: 60,
    ok: (p) => p.streak.n >= 3,
    progress: (p) => ({ cur: Math.min(3, p.streak.n), max: 3, unit: 'days' }),
  },
  {
    id: 'combo5',
    name: 'Clean Five',
    desc: 'Land 5 consecutive right answers inside a timed Topic Test',
    icon: 'bolt',
    tier: 'bronze',
    xpBonus: 70,
    ok: (p) => !!p.badges.combo5,
    progress: (p) => ({ cur: p.badges.combo5 ? 5 : 0, max: 5, unit: 'in a row' }),
  },
  {
    id: 'notes12',
    name: 'Deep Annotator',
    desc: 'Read and mark 12 Textbook Study Note chapters complete',
    icon: 'books',
    tier: 'bronze',
    xpBonus: 80,
    ok: (p) => countFlagsPrefix(p, 'note:') >= 12,
    progress: (p) => ({ cur: Math.min(12, countFlagsPrefix(p, 'note:')), max: 12, unit: 'chapters' }),
  },

  // ── SILVER TIER (Rigorous Consistency & Precision — 8 Badges) ──
  {
    id: 'streak7',
    name: 'Week Warrior',
    desc: 'Maintain an unbroken 7-day study streak',
    icon: 'flame',
    tier: 'silver',
    xpBonus: 120,
    ok: (p) => p.streak.n >= 7,
    progress: (p) => ({ cur: Math.min(7, p.streak.n), max: 7, unit: 'days' }),
  },
  {
    id: 'run10',
    name: 'Sharpshooter',
    desc: 'Hit 10 consecutive correct answers without a single slip',
    icon: 'target',
    tier: 'silver',
    xpBonus: 110,
    ok: (p) => p.run >= 10,
    progress: (p) => ({ cur: Math.min(10, p.run), max: 10, unit: 'run' }),
  },
  {
    id: 'run15',
    name: 'Laser Focus',
    desc: 'Chain 15 consecutive right answers in one unbroken streak',
    icon: 'bolt',
    tier: 'silver',
    xpBonus: 160,
    ok: (p) => p.run >= 15,
    progress: (p) => ({ cur: Math.min(15, p.run), max: 15, unit: 'run' }),
  },
  {
    id: 'rev10',
    name: 'Comeback Kid',
    desc: 'Redeem 10 previously missed questions in Spaced Review',
    icon: 'rev',
    tier: 'silver',
    xpBonus: 120,
    ok: (p) => p.revok >= 10,
    progress: (p) => ({ cur: Math.min(10, p.revok), max: 10, unit: 'fixed' }),
  },
  {
    id: 'q100',
    name: 'Centurion',
    desc: 'Answer 100 curriculum mastery questions',
    icon: 'check',
    tier: 'silver',
    xpBonus: 130,
    ok: (p) => p.hist.length >= 100,
    progress: (p) => ({ cur: Math.min(100, p.hist.length), max: 100, unit: 'Qs' }),
  },
  {
    id: 'lab10',
    name: 'Practical Bench Pro',
    desc: 'Complete 10 full virtual laboratory practicals or constructions',
    icon: 'flask',
    tier: 'silver',
    xpBonus: 150,
    ok: (p) => countFlagsPrefix(p, 'lab:') >= 10,
    progress: (p) => ({ cur: Math.min(10, countFlagsPrefix(p, 'lab:')), max: 10, unit: 'practicals' }),
  },
  {
    id: 'formula15',
    name: 'Formula Architect',
    desc: 'Master 15 formulas or grammar rules in Formula Studio drills',
    icon: 'sigma',
    tier: 'silver',
    xpBonus: 150,
    ok: (p) => countFlagsPrefix(p, 'fmaster:') >= 15,
    progress: (p) => ({ cur: Math.min(15, countFlagsPrefix(p, 'fmaster:')), max: 15, unit: 'mastered' }),
  },
  {
    id: 'flawless1',
    name: 'Untouchable',
    desc: 'Pass a timed Topic Test with a flawless 7/7 score and zero mistakes',
    icon: 'medal',
    tier: 'silver',
    xpBonus: 175,
    ok: (p) => (p.flags?.flawless_boss || 0) >= 1,
    progress: (p) => ({ cur: Math.min(1, p.flags?.flawless_boss || 0), max: 1, unit: 'flawless test' }),
  },

  // ── GOLD TIER (Elite Exam Mastery — 8 Badges) ──
  {
    id: 'streak14',
    name: 'Fortnight Titan',
    desc: 'Hold a relentless 14-day study streak',
    icon: 'flame',
    tier: 'gold',
    xpBonus: 260,
    ok: (p) => p.streak.n >= 14,
    progress: (p) => ({ cur: Math.min(14, p.streak.n), max: 14, unit: 'days' }),
  },
  {
    id: 'run25',
    name: 'Sniper Elite',
    desc: 'Answer 25 questions right in a row without missing once',
    icon: 'target',
    tier: 'gold',
    xpBonus: 300,
    ok: (p) => p.run >= 25,
    progress: (p) => ({ cur: Math.min(25, p.run), max: 25, unit: 'run' }),
  },
  {
    id: 'rev25',
    name: 'Redemption Master',
    desc: 'Master and clear 25 tough missed questions in Spaced Review',
    icon: 'rev',
    tier: 'gold',
    xpBonus: 240,
    ok: (p) => p.revok >= 25,
    progress: (p) => ({ cur: Math.min(25, p.revok), max: 25, unit: 'fixed' }),
  },
  {
    id: 'q250_acc',
    name: 'Precision 250',
    desc: 'Answer 250+ questions while holding at least 75% overall accuracy',
    icon: 'award',
    tier: 'gold',
    xpBonus: 280,
    ok: (p) => p.hist.length >= 250 && accuracyPercent(p) >= 75,
    progress: (p) => ({ cur: Math.min(250, p.hist.length), max: 250, unit: `Qs (${accuracyPercent(p)}% acc)` }),
  },
  {
    id: 'half',
    name: 'Halfway Conquerer',
    desc: 'Pass Topic Tests for at least half of all topics in an active subject',
    icon: 'map',
    tier: 'gold',
    xpBonus: 250,
    ok: (p, ts) => ts.length > 0 && ts.filter((t) => tstate(p, t.id).boss).length >= Math.ceil(ts.length / 2),
    progress: (p, ts) => ({
      cur: ts.filter((t) => tstate(p, t.id).boss).length,
      max: Math.max(1, Math.ceil(ts.length / 2)),
      unit: 'topics',
    }),
  },
  {
    id: 'target',
    name: 'Target Locked',
    desc: 'Drive your subject mastery score up to your personal goal',
    icon: 'target',
    tier: 'gold',
    xpBonus: 260,
    ok: (p, ts) => !!(p.dx && ts.length > 0 && predicted(p, ts) >= subjTarget(p)),
    progress: (p, ts) => ({ cur: Math.min(subjTarget(p), predicted(p, ts)), max: subjTarget(p), unit: '%' }),
  },
  {
    id: 'lab25',
    name: 'Chief Experimentalist',
    desc: 'Complete 25 virtual laboratory practicals across Maths, Chem, Physics, Biology & Agric',
    icon: 'atom',
    tier: 'gold',
    xpBonus: 280,
    ok: (p) => countFlagsPrefix(p, 'lab:') >= 25,
    progress: (p) => ({ cur: Math.min(25, countFlagsPrefix(p, 'lab:')), max: 25, unit: 'practicals' }),
  },
  {
    id: 'xp4000',
    name: 'Campus Ready',
    desc: 'Answer 250 questions through sustained study, drills and tests',
    icon: 'star',
    tier: 'gold',
    xpBonus: 300,
    ok: (p) => p.hist.length >= 250 || p.xp >= 4000,
    progress: (p) => ({ cur: Math.min(250, p.hist.length), max: 250, unit: 'questions' }),
  },

  // ── MYTHIC TIER (Hard-Earned Chancellor Honours — 6 Badges) ──
  {
    id: 'streak30',
    name: 'Iron Discipline',
    desc: 'Study every single day for 30 consecutive days without breaking streak',
    icon: 'flame',
    tier: 'mythic',
    xpBonus: 550,
    ok: (p) => p.streak.n >= 30,
    progress: (p) => ({ cur: Math.min(30, p.streak.n), max: 30, unit: 'days' }),
  },
  {
    id: 'flawless5',
    name: 'Grandmaster 7/7',
    desc: 'Achieve 5 separate flawless 7/7 timed Topic Test victories',
    icon: 'medal',
    tier: 'mythic',
    xpBonus: 500,
    ok: (p) => (p.flags?.flawless_boss || 0) >= 5,
    progress: (p) => ({ cur: Math.min(5, p.flags?.flawless_boss || 0), max: 5, unit: 'flawless tests' }),
  },
  {
    id: 'q500_acc',
    name: 'Distinction 500',
    desc: 'Answer 500+ questions while maintaining 80%+ overall accuracy',
    icon: 'award',
    tier: 'mythic',
    xpBonus: 600,
    ok: (p) => p.hist.length >= 500 && accuracyPercent(p) >= 80,
    progress: (p) => ({ cur: Math.min(500, p.hist.length), max: 500, unit: `Qs (${accuracyPercent(p)}% acc)` }),
  },
  {
    id: 'formula40',
    name: 'GrandPolymath',
    desc: 'Master 40 distinct formulas & rules across Maths, Further Maths, Chem, Physics, Geography, Economics, English, DigiTech & Data Processing',
    icon: 'sigma',
    tier: 'mythic',
    xpBonus: 500,
    ok: (p) => countFlagsPrefix(p, 'fmaster:') >= 40,
    progress: (p) => ({ cur: Math.min(40, countFlagsPrefix(p, 'fmaster:')), max: 40, unit: 'mastered' }),
  },
  {
    id: 'quad_scholar',
    name: 'Twelve-Faculty Scholar',
    desc: 'Pass at least 5 Topic Tests in EACH of all 12 faculties (Maths, F.Maths, Chem, Physics, Bio, Agric, Geog, Econ, English, Civic, DigiTech & DataProc)',
    icon: 'crown',
    tier: 'mythic',
    xpBonus: 650,
    ok: (p, _ts, allBySubj) => {
      if (!allBySubj) return false;
      const req: SubjectId[] = [
        'maths',
        'fmaths',
        'chem',
        'phys',
        'bio',
        'agric',
        'geog',
        'econ',
        'eng',
        'civic',
        'digitech',
        'dataproc',
      ];
      return req.every((sid) => {
        const list = allBySubj[sid] || [];
        return list.filter((t) => tstate(p, t.id).boss).length >= 5;
      });
    },
    progress: (p, _ts, allBySubj) => {
      const req: SubjectId[] = [
        'maths',
        'fmaths',
        'chem',
        'phys',
        'bio',
        'agric',
        'geog',
        'econ',
        'eng',
        'civic',
        'digitech',
        'dataproc',
      ];
      if (!allBySubj) {
        return { cur: Math.min(60, countTotalBossesPassed(p)), max: 60, unit: 'tests' };
      }
      const cur = req.reduce((sum, sid) => {
        const list = allBySubj[sid] || [];
        return sum + Math.min(5, list.filter((t) => tstate(p, t.id).boss).length);
      }, 0);
      return { cur, max: 60, unit: 'cross-subject tests' };
    },
  },
  {
    id: 'all',
    name: 'Chancellor’s Laureate',
    desc: 'Complete and pass every single Topic Test in an entire subject syllabus',
    icon: 'crown',
    tier: 'mythic',
    xpBonus: 800,
    ok: (p, ts) => ts.length > 0 && ts.filter((t) => tstate(p, t.id).boss).length === ts.length,
    progress: (p, ts) => ({
      cur: ts.filter((t) => tstate(p, t.id).boss).length,
      max: Math.max(1, ts.length),
      unit: 'topics',
    }),
  },
];

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

const enc = (n: number, len: number): string => {
  let s = '';
  for (let i = 0; i < len; i++) {
    s = B32[n % 32] + s;
    n = Math.floor(n / 32);
  }
  return s;
};

const sig = (dev: string, pid: string, day: number): string =>
  enc(h53(`${CONFIG.SECRET}|${dev}|${pid}|${day}`), 6);

export function makeCode(dev: string, pid: string, day = today()): string {
  const c = pid + enc(day, 3) + sig(dev, pid, day);
  return c.slice(0, 5) + '-' + c.slice(5);
}

export const SUBJECT_INFO: Record<
  SubjectId,
  { id: SubjectId; name: string; short: string; compact: string; icon: string }
> = {
  maths: { id: 'maths', name: 'Mathematics', short: 'Maths', compact: 'Maths', icon: 'sigma' },
  fmaths: { id: 'fmaths', name: 'Further Mathematics', short: 'F.Maths', compact: 'F.Maths', icon: 'integral' },
  chem: { id: 'chem', name: 'Chemistry', short: 'Chemistry', compact: 'Chem', icon: 'flask' },
  phys: { id: 'phys', name: 'Physics', short: 'Physics', compact: 'Phys', icon: 'atom' },
  bio: { id: 'bio', name: 'Biology', short: 'Biology', compact: 'Bio', icon: 'dna' },
  agric: { id: 'agric', name: 'Agricultural Science', short: 'Agric', compact: 'Agric', icon: 'leaf' },
  geog: { id: 'geog', name: 'Geography', short: 'Geog', compact: 'Geog', icon: 'globe' },
  econ: { id: 'econ', name: 'Economics', short: 'Economics', compact: 'Econ', icon: 'chart' },
  eng: { id: 'eng', name: 'English Language', short: 'English', compact: 'Eng', icon: 'book' },
  civic: { id: 'civic', name: 'Civic Education', short: 'Civic', compact: 'Civic', icon: 'scales' },
  digitech: { id: 'digitech', name: 'Digital Technologies', short: 'DigiTech', compact: 'DigiTech', icon: 'cpu' },
  dataproc: { id: 'dataproc', name: 'Data Processing', short: 'DataProc', compact: 'DataProc', icon: 'database' },
};

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
