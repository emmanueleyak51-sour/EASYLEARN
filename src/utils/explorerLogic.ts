import { MN, brk, fr, frac, isSq, nm, poly } from './mathMarkup';
import type { ChemExplorerKind } from './chemExplorerLogic';

export type ExplorerKind =
  | 'parab'
  | 'roots'
  | 'circ'
  | 'cyc'
  | 'bag'
  | 'dice'
  | 'tree'
  | ChemExplorerKind;

export const md360 = (x: number): number => ((x % 360) + 360) % 360;
export const r1 = (v: number): number => Math.round(v * 10) / 10;
export const deg = (r: number): number => (r * 180) / Math.PI;
export const rad2 = (d: number): number => (d * Math.PI) / 180;
export const adist = (a: number, b: number): number => {
  const d = md360(a - b);
  return Math.min(d, 360 - d);
};

export interface Frame {
  X: (x: number) => number;
  Y: (y: number) => number;
  ix: (px: number) => number;
  iy: (py: number) => number;
  L: number;
  T: number;
  w: number;
  h: number;
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

export function frame(x0: number, x1: number, y0: number, y1: number, W = 320, H = 240, L = 16, T = 10): Frame {
  const w = W - L - 10;
  const h = H - T - 18;
  const X = (x: number) => L + ((x - x0) / (x1 - x0)) * w;
  const Y = (y: number) => T + ((y1 - y) / (y1 - y0)) * h;
  const ix = (px: number) => x0 + ((px - L) / w) * (x1 - x0);
  const iy = (py: number) => y1 - ((py - T) / h) * (y1 - y0);
  return { X, Y, ix, iy, L, T, w, h, x0, x1, y0, y1 };
}

/* ── Parabola explorer ── */
export interface ParabState {
  a: number;
  b: number;
  c: number;
}

export function initParab(cfg: Record<string, any> = {}): ParabState {
  return {
    a: cfg.a != null ? cfg.a : 1,
    b: cfg.b != null ? cfg.b : -5,
    c: cfg.c != null ? cfg.c : 6,
  };
}

export function qroots(a: number, b: number, c: number): { lin?: boolean; d?: number; r: number[] } {
  if (a === 0) return b === 0 ? { lin: true, r: [] } : { lin: true, r: [-c / b] };
  const d = b * b - 4 * a * c;
  if (d < 0) return { d, r: [] };
  if (d === 0) return { d, r: [-b / (2 * a)] };
  const s = Math.sqrt(d);
  return { d, r: [(-b - s) / (2 * a), (-b + s) / (2 * a)].sort((p, q) => p - q) };
}

export function rootText(a: number, b: number, c: number): string {
  const R = qroots(a, b, c);
  if (R.lin) return R.r.length ? `x = ${frac(-c, b)} (only one: this is a straight line)` : 'none';
  if (!R.r.length) return 'none: the curve misses the x-axis';
  const d = R.d!;
  if (isSq(d)) {
    const s = Math.sqrt(d);
    const xs = [frac(-b - s, 2 * a), frac(-b + s, 2 * a)];
    return d === 0
      ? `x = ${xs[0]} (twice)`
      : `x = ${(-b - s) / (2 * a) < (-b + s) / (2 * a) ? xs.join(' and x = ') : xs.reverse().join(' and x = ')}`;
  }
  return `x = (${nm(-b)} ± √${d}) ÷ ${nm(2 * a)}, about ${R.r.map((v) => nm(v)).join(' and ')}`;
}

export function dragParab(s: ParabState, px: number, py: number): ParabState {
  const F = frame(-8, 8, -10, 12);
  const a = s.a || 1;
  const x = F.ix(px);
  const y = F.iy(py);
  const b = Math.max(-8, Math.min(8, Math.round(-2 * a * x)));
  const c = Math.max(-12, Math.min(12, Math.round((b * b) / (4 * a) + y)));
  return { ...s, b, c };
}

export function parabHint(s: ParabState): string {
  return s.a === 0
    ? 'With a = 0 the x² term is gone, so this is a straight line, not a quadratic. That is why a can never be 0.'
    : '';
}

export function parabSummary(s: ParabState, cfg: Record<string, any> = {}) {
  const { a, b, c } = s;
  const d = b * b - 4 * a * c;
  const R = qroots(a, b, c);
  let factLine: string | null = null;
  if (cfg.fact && a === 1 && R.r.length && R.r.every(Number.isInteger)) {
    factLine = R.r.length === 1 ? `${brk(R.r[0])}² = 0` : `${brk(R.r[0])}${brk(R.r[1])} = 0`;
  }
  return {
    eqHtml: `y = ${poly(a, b, c)}`,
    d,
    discBadge: d > 0 ? { cls: 'g', text: 'two roots' } : d === 0 ? { cls: 'y', text: 'equal roots' } : { cls: 'r', text: 'no real roots' },
    discText: `${nm(b * b)} ${4 * a * c < 0 ? '+' : MN} ${nm(Math.abs(4 * a * c))} = ${nm(d)}`,
    rootsHtml: rootText(a, b, c),
    factHtml: factLine,
  };
}

/* ── Roots-to-equation explorer ── */
export interface RootsState {
  p: number;
  q: number;
}

export function initRoots(cfg: Record<string, any> = {}): RootsState {
  return {
    p: cfg.p != null ? cfg.p : 2,
    q: cfg.q != null ? cfg.q : 3,
  };
}

export function rootsFrame(s: RootsState): Frame {
  const v = -(((s.p - s.q) / 2) ** 2);
  const lo = Math.min(-3, v * 1.25);
  return frame(-7, 7, lo, Math.max(6, -lo * 0.9));
}

export function dragRoots(s: RootsState, name: 'p' | 'q', px: number): RootsState {
  const F = rootsFrame(s);
  const val = Math.max(-6, Math.min(6, Math.round(F.ix(px))));
  return { ...s, [name]: val };
}

export function rootsHint(s: RootsState): string {
  return s.p === s.q
    ? `Both roots at ${nm(s.p)}. The curve only touches the axis: equal roots, and the equation is a perfect square.`
    : '';
}

/* ── Circle theorem explorer ── */
export const CIRCLE_CENTER: [number, number] = [160, 122];
export const CIRCLE_RADIUS = 92;

export const onCircle = (d: number, r = CIRCLE_RADIUS): [number, number] => [
  CIRCLE_CENTER[0] + r * Math.cos(rad2(d)),
  CIRCLE_CENTER[1] - r * Math.sin(rad2(d)),
];

export const dirTo = (v: [number, number], p: [number, number]): number =>
  md360(deg(Math.atan2(v[1] - p[1], p[0] - v[0])));

export const inArc = (from: number, to: number, x: number): boolean =>
  md360(x - from) < md360(to - from);

export function vAngle(v: [number, number], p: [number, number], q: [number, number]): number {
  const u: [number, number] = [p[0] - v[0], p[1] - v[1]];
  const w: [number, number] = [q[0] - v[0], q[1] - v[1]];
  const cos = (u[0] * w[0] + u[1] * w[1]) / (Math.hypot(u[0], u[1]) * Math.hypot(w[0], w[1]));
  return deg(Math.acos(Math.max(-1, Math.min(1, cos))));
}

export interface CircState {
  A: number;
  B: number;
  P: number;
  Q: number;
  showQ: boolean;
  moved: number;
}

export function initCirc(cfg: Record<string, any> = {}): CircState {
  return { A: 220, B: 320, P: 80, Q: 150, showQ: false, moved: 0, ...cfg };
}

export function calcCirc(s: CircState) {
  const pAB = inArc(s.A, s.B, s.P);
  const cen = pAB ? md360(s.A - s.B) : md360(s.B - s.A);
  const minor = Math.min(md360(s.B - s.A), md360(s.A - s.B));
  const ins = vAngle(onCircle(s.P), onCircle(s.A), onCircle(s.B));
  const insQ = vAngle(onCircle(s.Q), onCircle(s.A), onCircle(s.B));
  return { pAB, cen, minor, ins, insQ, same: pAB === inArc(s.A, s.B, s.Q) };
}

export function moveCirc(s: CircState, key: 'A' | 'B' | 'P' | 'Q', v: number): CircState {
  const allPts: ('A' | 'B' | 'P' | 'Q')[] = s.showQ ? ['A', 'B', 'P', 'Q'] : ['A', 'B', 'P'];
  const pts = allPts.filter((n) => n !== key);
  const tooClose = pts.some(
    (n) => adist(s[n], v) < (key === 'A' || key === 'B' ? (n === 'P' || n === 'Q' ? 7 : 12) : 7)
  );
  if (tooClose) return s;
  return {
    ...s,
    [key]: v,
    moved: key === 'P' ? s.moved + adist(s.P, v) : s.moved,
  };
}

export function dragCirc(s: CircState, name: 'A' | 'B' | 'P' | 'Q', px: number, py: number): CircState {
  let d = md360(Math.round(deg(Math.atan2(CIRCLE_CENTER[1] - py, px - CIRCLE_CENTER[0]))));
  if (name === 'A' || name === 'B') d = md360(Math.round(d / 2) * 2);
  return moveCirc(s, name, d);
}

export function circHint(s: CircState): string {
  const c = calcCirc(s);
  if (c.minor === 180) {
    return 'AB is a diameter. The angle at the centre is a straight line, 180°, so ∠APB = 90°: the angle in a semicircle.';
  }
  if (c.cen > 180) {
    return `P is on the small arc now. The angle at the centre that faces P is the reflex one, ${c.cen}°. Half of it is ${nm(r1(c.cen / 2))}°: the rule still holds.`;
  }
  return '';
}

/* ── Cyclic quadrilateral explorer ── */
export const QN = ['A', 'B', 'C', 'D'] as const;

export interface CycState {
  p: [number, number, number, number];
  ext: boolean;
  movedA: number;
}

export function initCyc(cfg: Record<string, any> = {}): CycState {
  const src = cfg.p || [200, 300, 20, 100];
  return { p: [src[0], src[1], src[2], src[3]], ext: false, movedA: 0 };
}

export function cycAngles(s: CycState) {
  const [A, B, C, D] = s.p;
  return {
    A: md360(D - B) / 2,
    B: md360(A - C) / 2,
    C: md360(B - D) / 2,
    D: md360(C - A) / 2,
  };
}

export function cycOk(p: number[]): boolean {
  return (
    p.every((v, i) => md360(p[(i + 1) % 4] - v) >= 14) &&
    p.reduce((t, v, i) => t + md360(p[(i + 1) % 4] - v), 0) === 360
  );
}

export function moveCyc(s: CycState, idx: number, v: number): CycState {
  const p = s.p.slice() as [number, number, number, number];
  p[idx] = v;
  if (!cycOk(p)) return s;
  return {
    ...s,
    p,
    movedA: idx === 0 ? s.movedA + adist(s.p[0], v) : s.movedA,
  };
}

export function dragCyc(s: CycState, name: 'A' | 'B' | 'C' | 'D', px: number, py: number): CycState {
  const d = md360(Math.round(deg(Math.atan2(CIRCLE_CENTER[1] - py, px - CIRCLE_CENTER[0])) / 2) * 2);
  return moveCyc(s, QN.indexOf(name), d);
}

/* ── Probability: Bag of balls ── */
export const BALL_COLORS = { r: '#FF6B57', b: '#8CCBFF', g: '#2BD67B' } as const;
export const BNAME = { r: 'red', b: 'blue', g: 'green' } as const;

export interface BagState {
  r: number;
  b: number;
  g: number;
  n: number;
  t: { r: number; b: number; g: number };
  last: number;
}

export function initBag(cfg: Record<string, any> = {}): BagState {
  return { r: 3, b: 1, g: 0, n: 0, t: { r: 0, b: 0, g: 0 }, last: -1, ...cfg };
}

export function bagList(s: BagState): ('r' | 'b' | 'g')[] {
  return ([] as ('r' | 'b' | 'g')[]).concat(
    Array(s.r).fill('r'),
    Array(s.b).fill('b'),
    Array(s.g).fill('g')
  );
}

export function actBag(s: BagState, cmd: string, rand: () => number = Math.random): BagState {
  const [k, nStr] = cmd.split(':');
  const L = bagList(s);
  if (k === 'draw' && L.length > 0) {
    const count = Number(nStr);
    const t = { ...s.t };
    let n = s.n;
    let last = s.last;
    for (let i = 0; i < count; i++) {
      const j = Math.floor(rand() * L.length);
      t[L[j]]++;
      n++;
      last = j;
    }
    return { ...s, t, n, last };
  }
  if (k === 'reset') {
    return { ...s, n: 0, t: { r: 0, b: 0, g: 0 }, last: -1 };
  }
  if (k === 'r' || k === 'b' || k === 'g') {
    const val = Math.max(0, Math.min(9, s[k] + Number(nStr)));
    return { ...s, [k]: val, n: 0, t: { r: 0, b: 0, g: 0 }, last: -1 };
  }
  return s;
}

export function bagHint(s: BagState): string {
  const N = s.r + s.b + s.g;
  if (!N) return 'An empty bag has no outcomes, so there is nothing to divide by.';
  if (s.n && s.n < 30) return 'Only a few draws. Small samples jump around a lot. Try 100.';
  if (s.n >= 100) {
    return `Theory says ${nm(s.r / N)}. You got ${nm(s.t.r / s.n)}. Close, not exact. The more you draw, the closer it settles.`;
  }
  return '';
}

/* ── Probability: Two dice ── */
export type DiceMode = 'tot' | 'dbl' | 'six';
export const DMODE: Record<DiceMode, string> = {
  tot: 'Total',
  dbl: 'Doubles',
  six: 'At least one 6',
};

export interface DiceState {
  mode: DiceMode;
  n: number;
}

export function initDice(cfg: Record<string, any> = {}): DiceState {
  return { mode: 'tot', n: 4, ...cfg };
}

export function diceHit(s: DiceState, i: number, j: number): boolean {
  return s.mode === 'tot' ? i + j === s.n : s.mode === 'dbl' ? i === j : i === 6 || j === 6;
}

export function diceCount(s: DiceState): number {
  let n = 0;
  for (let i = 1; i <= 6; i++) {
    for (let j = 1; j <= 6; j++) {
      if (diceHit(s, i, j)) n++;
    }
  }
  return n;
}

export function diceHint(s: DiceState): string {
  if (s.mode === 'tot' && s.n === 7) {
    return 'Seven fills the whole long diagonal. No total has more squares.';
  }
  if (s.mode === 'six') {
    return 'Count carefully: the square 6 and 6 sits in the last row and the last column, but it is only one square.';
  }
  return '';
}

/* ── Probability: Tree diagram ── */
export type TreePick = 'rr' | 'bb' | 'mix';

export interface TreeState {
  r: number;
  b: number;
  rep: boolean;
  pick: TreePick;
  toggled: boolean;
}

export function initTree(cfg: Record<string, any> = {}): TreeState {
  return { r: 3, b: 2, rep: false, pick: 'rr', toggled: false, ...cfg };
}

export function treeBranches(s: TreeState) {
  const t = s.r + s.b;
  const t2 = s.rep ? t : t - 1;
  return {
    t,
    t2,
    R: [s.r, t] as [number, number],
    B: [s.b, t] as [number, number],
    RR: [s.rep ? s.r : s.r - 1, t2] as [number, number],
    RB: [s.b, t2] as [number, number],
    BR: [s.r, t2] as [number, number],
    BB: [s.rep ? s.b : s.b - 1, t2] as [number, number],
  };
}

export function treePaths(s: TreeState): ('RR' | 'RB' | 'BR' | 'BB')[] {
  return s.pick === 'rr' ? ['RR'] : s.pick === 'bb' ? ['BB'] : ['RB', 'BR'];
}

export function actTree(s: TreeState, cmd: string): TreeState {
  const [k, n] = cmd.split(':');
  if (k === 'rep') return { ...s, rep: !s.rep, toggled: true };
  if (k === 'pick') return { ...s, pick: n as TreePick };
  if (k === 'r' || k === 'b') {
    return { ...s, [k]: Math.max(1, Math.min(8, s[k] + Number(n))) };
  }
  return s;
}

export function treeProb(s: TreeState): { num: number; den: number; label: string; parts: string[] } {
  const T = treeBranches(s);
  const on = treePaths(s);
  const label = { rr: 'P(both red)', bb: 'P(both blue)', mix: 'P(one of each)' }[s.pick];
  const parts = on.map((k) => `${fr(T[k[0] as 'R' | 'B'][0], T[k[0] as 'R' | 'B'][1])} × ${fr(T[k][0], T[k][1])}`);
  const num = on.reduce((acc, k) => acc + T[k[0] as 'R' | 'B'][0] * T[k][0], 0);
  const den = T.t * T.t2;
  return { num, den, label, parts };
}
