import {
  FMATH_FORMULAS,
  type FMathFormulaCatId,
  type FMathFormulaItem,
} from '../data/fmathFormulas';
import { htmlToSpeakableChem } from './chemVoiceLogic';

export interface FMathFormulaDrillQuestion {
  id: string;
  formulaId: string;
  formulaName: string;
  cat: FMathFormulaCatId;
  promptHtml: string;
  hintHtml: string;
  options: string[];
  answerIdx: number;
  explanationHtml: string;
}

export function filterFMathFormulas(
  formulas: FMathFormulaItem[],
  cat: FMathFormulaCatId | 'all',
  query: string
): FMathFormulaItem[] {
  const q = query.trim().toLowerCase();
  return formulas.filter((f) => {
    if (cat !== 'all' && f.cat !== cat) return false;
    if (!q) return true;
    const hay = [
      f.name,
      f.summary,
      f.trap,
      ...f.keywords,
      ...f.rearrangements.map((r) => `${r.label} ${r.exprHtml}`),
      ...f.variables.map(([s, m]) => `${s} ${m}`),
    ]
      .join(' ')
      .toLowerCase();
    return hay.includes(q);
  });
}

export function getFMathFormulasForTopic(topicId: string): FMathFormulaItem[] {
  return FMATH_FORMULAS.filter((f) => f.topicId === topicId);
}

export function extractFMathFormulaSpeechScript(
  item: FMathFormulaItem,
  rearrIdx = 0,
  isFirstStep = false
): string {
  const rearr = item.rearrangements[rearrIdx] || item.rearrangements[0];
  const coreVars = item.variables
    .slice(0, 2)
    .map(([s, m]) => `${s} denotes ${m}`)
    .join(', while ');
  const raw = [
    isFirstStep ? "Welcome to Professor Chinedu's Further Mathematics Formula Studio." : '',
    `Let's master ${item.name} from first principles.`,
    `Core mathematical structure: ${item.summary}`,
    `Using ${rearr.label}, ${rearr.exprHtml}, note that ${coreVars}.`,
    `Guard against this exam trap: ${item.trap}`,
  ]
    .filter(Boolean)
    .join(' ');
  return htmlToSpeakableChem(raw);
}

function makeRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickOne<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length) % arr.length];
}

function packChoices(
  correct: string,
  wrongs: string[],
  rng: () => number
): { options: string[]; answerIdx: number } {
  const uniqueWrongs: string[] = [];
  for (const w of wrongs) {
    if (w !== correct && !uniqueWrongs.includes(w)) {
      uniqueWrongs.push(w);
    }
  }
  let bump = 2;
  while (uniqueWrongs.length < 3) {
    const candidate = `${correct} (${bump})`;
    if (!uniqueWrongs.includes(candidate)) uniqueWrongs.push(candidate);
    bump++;
  }
  const pool = [correct, ...uniqueWrongs.slice(0, 3)];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return {
    options: pool,
    answerIdx: pool.indexOf(correct),
  };
}

export function generateFMathFormulaQuestion(
  formulaId: string,
  seed = 509
): FMathFormulaDrillQuestion {
  const rng = makeRng(seed);
  const meta = FMATH_FORMULAS.find((f) => f.id === formulaId) || FMATH_FORMULAS[0];
  const hintHtml = `<strong>${meta.rearrangements[0].exprHtml}</strong> — ${meta.trap}`;

  const finish = (
    promptHtml: string,
    correct: string,
    wrongs: string[],
    explanationHtml: string
  ): FMathFormulaDrillQuestion => {
    const { options, answerIdx } = packChoices(correct, wrongs, rng);
    return {
      id: `fmfd-${meta.id}-${seed}`,
      formulaId: meta.id,
      formulaName: meta.name,
      cat: meta.cat,
      promptHtml,
      hintHtml,
      options,
      answerIdx,
      explanationHtml,
    };
  };

  switch (meta.id) {
    case 'fmf-roots': {
      const s = pickOne([4, 5, 6, 7], rng);
      const p = pickOne([3, 5, 8], rng);
      const ans = s * s - 2 * p;
      return finish(
        `If α and β are the roots of <strong>x<sup>2</sup> − ${s}x + ${p} = 0</strong>, evaluate <strong>α<sup>2</sup> + β<sup>2</sup></strong>.`,
        `${ans}`,
        [`${s * s + 2 * p}`, `${s * s - p}`, `${s * s}`],
        `Here α + β = ${s} and αβ = ${p}. Thus <strong>α<sup>2</sup> + β<sup>2</sup> = (α + β)<sup>2</sup> − 2αβ</strong> = ${s}<sup>2</sup> − 2(${p}) = <strong>${ans}</strong>.`
      );
    }
    case 'fmf-remainder': {
      const a = pickOne([2, 3], rng);
      const k = pickOne([1, 2, 3], rng);
      const c = pickOne([4, 5, 7], rng);
      const rem = a * (-k) * (-k) * (-k) + c;
      const trapPlus = a * k * k * k + c;
      return finish(
        `Find the remainder when <strong>P(x) = ${a}x<sup>3</sup> + ${c}</strong> is divided by <strong>(x + ${k})</strong>.`,
        `${rem}`,
        [`${trapPlus}`, `${-rem}`, `${a * k * k + c}`],
        `Set x + ${k} = 0 ⇒ x = −${k}. By the Remainder Theorem, <strong>R = P(−${k}) = ${a}(−${k})<sup>3</sup> + ${c} = ${rem}</strong>.`
      );
    }
    case 'fmf-gp-inf': {
      const a = pickOne([12, 18, 24, 36], rng);
      const rPair = pickOne(
        [
          { label: '1/2', val: 0.5 },
          { label: '1/3', val: 1 / 3 },
          { label: '−1/2', val: -0.5 },
        ],
        rng
      );
      const sinf = Math.round(a / (1 - rPair.val));
      const wrongSign = Math.round(a / (1 + rPair.val));
      return finish(
        `A convergent GP has first term <strong>a = ${a}</strong> and common ratio <strong>r = ${rPair.label}</strong>. Find <strong>S<sub>∞</sub></strong>.`,
        `${sinf}`,
        [`${wrongSign}`, `${a * 2}`, `${sinf + 6}`],
        `Since |r| &lt; 1, <strong>S<sub>∞</sub> = a ÷ (1 − r)</strong> = ${a} ÷ (1 − (${rPair.label})) = <strong>${sinf}</strong>.`
      );
    }
    case 'fmf-binomial': {
      const n = pickOne([4, 5, 6], rng);
      const k = pickOne([2, 3], rng);
      const nC2 = (n * (n - 1)) / 2;
      const coeff = nC2 * k * k;
      return finish(
        `Find the coefficient of <strong>x<sup>2</sup></strong> in the binomial expansion of <strong>(1 − ${k}x)<sup>${n}</sup></strong>.`,
        `${coeff}`,
        [`−${coeff}`, `${nC2 * k}`, `${n * k * k}`],
        `For r = 2: <strong><sup>${n}</sup>C<sub>2</sub>(−${k}x)<sup>2</sup></strong> = ${nC2} × ${k * k}x<sup>2</sup> = <strong>${coeff}</strong>x<sup>2</sup>.`
      );
    }
    case 'fmf-line-angle-dist': {
      const triple = pickOne(
        [
          { A: 3, B: -4, den: 5 },
          { A: 5, B: 12, den: 13 },
        ],
        rng
      );
      const x0 = pickOne([2, 4], rng);
      const y0 = pickOne([1, -2], rng);
      const d = pickOne([2, 3, 4], rng);
      const C = d * triple.den - (triple.A * x0 + triple.B * y0);
      const cSign = C >= 0 ? `+ ${C}` : `− ${Math.abs(C)}`;
      const bStr = triple.B >= 0 ? `+ ${triple.B}y` : `− ${Math.abs(triple.B)}y`;
      return finish(
        `Find the perpendicular distance from <strong>(${x0}, ${y0})</strong> to the line <strong>${triple.A}x ${bStr} ${cSign} = 0</strong>.`,
        `${d} units`,
        [`${d * triple.den} units`, `${(d / 2).toFixed(1)} units`, `${d + 3} units`],
        `<strong>d = |Ax<sub>0</sub> + By<sub>0</sub> + C| ÷ √(A<sup>2</sup> + B<sup>2</sup>)</strong> = ${d * triple.den} ÷ ${triple.den} = <strong>${d} units</strong>.`
      );
    }
    case 'fmf-circle': {
      const h = pickOne([2, 3, 4], rng);
      const k = pickOne([-1, -3, 5], rng);
      const r = pickOne([5, 6, 7], rng);
      const c = h * h + k * k - r * r;
      const gx = -2 * h >= 0 ? `+ ${-2 * h}x` : `− ${Math.abs(-2 * h)}x`;
      const fy = -2 * k >= 0 ? `+ ${-2 * k}y` : `− ${Math.abs(-2 * k)}y`;
      const cStr = c >= 0 ? `+ ${c}` : `− ${Math.abs(c)}`;
      return finish(
        `Find the radius of the circle <strong>x<sup>2</sup> + y<sup>2</sup> ${gx} ${fy} ${cStr} = 0</strong>.`,
        `${r}`,
        [`${r * r}`, `${Math.max(1, Math.round(Math.sqrt(Math.abs(h * h + k * k + c))))}`, `${r + 2}`],
        `Here g = ${-h}, f = ${-k}, c = ${c}. <strong>r = √(g<sup>2</sup> + f<sup>2</sup> − c)</strong> = √(${h * h} + ${k * k} − (${c})) = √${r * r} = <strong>${r}</strong>.`
      );
    }
    case 'fmf-matrix-inv': {
      const a = pickOne([2, 3, 4], rng);
      const d = pickOne([5, 6], rng);
      const b = pickOne([1, 2], rng);
      const c = pickOne([3, 4], rng);
      const det = a * d - b * c;
      return finish(
        `Evaluate the determinant <strong>|M|</strong> of the 2×2 matrix <strong>[[${a}, ${b}], [${c}, ${d}]]</strong>.`,
        `${det}`,
        [`${a * d + b * c}`, `${b * c - a * d}`, `${a + d - b - c}`],
        `<strong>|M| = ad − bc</strong> = (${a})(${d}) − (${b})(${c}) = ${a * d} − ${b * c} = <strong>${det}</strong>.`
      );
    }
    case 'fmf-demoivre': {
      const pair = pickOne(
        [
          { x: 3, y: -4, r: 5 },
          { x: 5, y: 12, r: 13 },
          { x: 8, y: -15, r: 17 },
        ],
        rng
      );
      const yStr = pair.y >= 0 ? `+ ${pair.y}i` : `− ${Math.abs(pair.y)}i`;
      return finish(
        `Find the modulus <strong>|z|</strong> of the complex number <strong>z = ${pair.x} ${yStr}</strong>.`,
        `${pair.r}`,
        [`${pair.r * pair.r}`, `${Math.abs(pair.x) + Math.abs(pair.y)}`, `${Math.abs(pair.x - pair.y)}`],
        `<strong>|z| = √(x<sup>2</sup> + y<sup>2</sup>)</strong> = √(${pair.x}<sup>2</sup> + (${pair.y})<sup>2</sup>) = <strong>${pair.r}</strong>.`
      );
    }
    case 'fmf-diff-first': {
      const a = pickOne([2, 3, 4], rng);
      const b = pickOne([5, 7, 9], rng);
      const x = pickOne([1, 2, 3], rng);
      const grad = 3 * a * x * x - b;
      return finish(
        `Find the gradient <strong>dy/dx</strong> of <strong>y = ${a}x<sup>3</sup> − ${b}x + 4</strong> at <strong>x = ${x}</strong>.`,
        `${grad}`,
        [`${3 * a * x * x + b}`, `${a * x * x * x - b * x + 4}`, `${grad + b}`],
        `dy/dx = ${3 * a}x<sup>2</sup> − ${b}. At x = ${x}, <strong>dy/dx = ${3 * a}(${x * x}) − ${b} = ${grad}</strong>.`
      );
    }
    case 'fmf-prod-quot-chain': {
      const k = pickOne([2, 3, 4], rng);
      const n = pickOne([3, 4, 5], rng);
      const out = n * k;
      return finish(
        `Differentiate <strong>y = (${k}x + 1)<sup>${n}</sup></strong> with respect to x using the Chain Rule.`,
        `${out}(${k}x + 1)^${n - 1}`,
        [`${n}(${k}x + 1)^${n - 1}`, `${out}(${k}x + 1)^${n}`, `${k}(${k}x + 1)^${n - 1}`],
        `By the Chain Rule, <strong>dy/dx = ${n}(${k}x + 1)<sup>${n - 1}</sup> × ${k} = ${out}(${k}x + 1)<sup>${n - 1}</sup></strong>.`
      );
    }
    case 'fmf-stationary': {
      const h = pickOne([2, 3, 5, 6], rng);
      const ymin = pickOne([1, 4, 7], rng);
      const c = h * h + ymin;
      return finish(
        `Find the minimum value of <strong>y = x<sup>2</sup> − ${2 * h}x + ${c}</strong>.`,
        `${ymin}`,
        [`${h}`, `${c}`, `${ymin - 2 * h}`],
        `Set dy/dx = 2x − ${2 * h} = 0 ⇒ x = ${h} (d<sup>2</sup>y/dx<sup>2</sup> = 2 &gt; 0). Substitute x = ${h}: <strong>y<sub>min</sub> = ${h * h} − ${2 * h * h} + ${c} = ${ymin}</strong>.`
      );
    }
    case 'fmf-int-parts': {
      const b = pickOne([2, 3, 4], rng);
      const k = pickOne([2, 4, 6], rng);
      const val = b * b * b + (k / 2) * b * b;
      return finish(
        `Evaluate the definite integral <strong>∫<sub>0</sub><sup>${b}</sup> (3x<sup>2</sup> + ${k}x) dx</strong>.`,
        `${val}`,
        [`${6 * b + k}`, `${val + b}`, `${b * b * b}`],
        `Antiderivative is [x<sup>3</sup> + ${k / 2}x<sup>2</sup>]<sub>0</sub><sup>${b}</sup> = ${b * b * b} + ${(k / 2) * b * b} = <strong>${val}</strong>.`
      );
    }
    case 'fmf-vol-rev': {
      const b = pickOne([2, 4, 6], rng);
      const coeff = (b * b) / 2;
      return finish(
        `The curve <strong>y = √x</strong> from <strong>x = 0</strong> to <strong>x = ${b}</strong> rotates 360° about the x-axis. Find the volume swept.`,
        `${coeff}π`,
        [`${coeff}`, `${b}π`, `${b * b}π`],
        `Using <strong>V = π ∫<sub>0</sub><sup>${b}</sup> y<sup>2</sup> dx</strong> = π ∫<sub>0</sub><sup>${b}</sup> x dx = π[${b}<sup>2</sup>/2] = <strong>${coeff}π</strong> cubic units.`
      );
    }
    case 'fmf-conics': {
      const a = pickOne([2, 3, 4, 5], rng);
      return finish(
        `Find the coordinates of the focus of the parabola <strong>y<sup>2</sup> = ${4 * a}x</strong>.`,
        `(${a}, 0)`,
        [`(${4 * a}, 0)`, `(0, ${a})`, `(−${a}, 0)`],
        `Comparing y<sup>2</sup> = ${4 * a}x with <strong>y<sup>2</sup> = 4ax</strong> gives 4a = ${4 * a} ⇒ a = ${a}, so Focus = <strong>(${a}, 0)</strong>.`
      );
    }
    case 'fmf-dot-prod': {
      const ax = pickOne([2, 3, 4], rng);
      const ay = pickOne([3, 4, 6], rng);
      const bx = ay;
      const p = ax;
      return finish(
        `Find <strong>p</strong> if 2D vectors <strong>a = ${ax}i − ${ay}j</strong> and <strong>b = ${bx}i + pj</strong> are perpendicular.`,
        `${p}`,
        [`−${p}`, `${(bx * ax) / 2}`, `${ax + ay}`],
        `Orthogonality requires <strong>a · b = 0</strong> ⇒ (${ax})(${bx}) + (−${ay})(p) = 0 ⇒ ${ax * bx} = ${ay}p ⇒ <strong>p = ${p}</strong>.`
      );
    }
    case 'fmf-unit-vec': {
      const v = pickOne(
        [
          { x: 2, y: -3, z: 6, m: 7 },
          { x: 1, y: 2, z: -2, m: 3 },
          { x: 3, y: 4, z: 12, m: 13 },
        ],
        rng
      );
      return finish(
        `Calculate the magnitude <strong>|r|</strong> of 3D vector <strong>r = ${v.x}i + (${v.y})j + (${v.z})k</strong>.`,
        `${v.m}`,
        [`${v.m * v.m}`, `${Math.abs(v.x) + Math.abs(v.y) + Math.abs(v.z)}`, `${v.m + 2}`],
        `<strong>|r| = √(${v.x}<sup>2</sup> + (${v.y})<sup>2</sup> + (${v.z})<sup>2</sup>)</strong> = √${v.m * v.m} = <strong>${v.m}</strong>.`
      );
    }
    case 'fmf-cross-prod': {
      const a = pickOne([4, 6, 8], rng);
      const b = pickOne([5, 10], rng);
      const cross = a * b * 0.5;
      const tri = cross / 2;
      return finish(
        `Adjacent sides of a triangle have vector magnitudes <strong>|AB| = ${a}</strong> and <strong>|AC| = ${b}</strong> with included angle <strong>30°</strong>. Find the triangle’s area.`,
        `${tri} sq. units`,
        [`${cross} sq. units`, `${a * b} sq. units`, `${(tri * 1.732).toFixed(1)} sq. units`],
        `<strong>Area<sub>△</sub> = ½|AB||AC| sin 30°</strong> = ½ × ${a} × ${b} × 0.5 = <strong>${tri} sq. units</strong>.`
      );
    }
    case 'fmf-projectile': {
      const u = pickOne([20, 30, 40], rng);
      const rMax = (u * u) / 10;
      return finish(
        `A projectile is launched at speed <strong>u = ${u} m s<sup>−1</sup></strong> over level ground (<strong>g = 10 m s<sup>−2</sup></strong>). Find its <strong>maximum possible horizontal range</strong>.`,
        `${rMax} m`,
        [`${rMax / 2} m`, `${(u * 2) / 10} m`, `${rMax * 2} m`],
        `Maximum range occurs at α = 45° (sin 90° = 1): <strong>R<sub>max</sub> = u<sup>2</sup> ÷ g</strong> = ${u * u} ÷ 10 = <strong>${rMax} m</strong>.`
      );
    }
    case 'fmf-lami': {
      const m = pickOne([4, 6, 8, 10], rng);
      const mu = pickOne([0.25, 0.5], rng);
      const fmax = m * 10 * 0.8 * mu;
      return finish(
        `A <strong>${m} kg</strong> block rests on a rough incline where <strong>cos θ = 0.8</strong> and <strong>μ = ${mu}</strong> (g = 10 m s<sup>−2</sup>). Find limiting friction <strong>F<sub>max</sub></strong>.`,
        `${fmax} N`,
        [`${m * 10 * mu} N`, `${m * 10 * 0.8} N`, `${fmax * 2} N`],
        `Normal reaction R = mg cos θ = ${m * 10 * 0.8} N. Thus <strong>F<sub>max</sub> = μR = ${mu} × ${m * 10 * 0.8} = ${fmax} N</strong>.`
      );
    }
    case 'fmf-pulley': {
      const pair = pickOne(
        [
          { m1: 6, m2: 4, a: 2, T: 48 },
          { m1: 7, m2: 3, a: 4, T: 42 },
          { m1: 3, m2: 1, a: 5, T: 15 },
        ],
        rng
      );
      return finish(
        `Masses <strong>${pair.m1} kg</strong> and <strong>${pair.m2} kg</strong> hang over a smooth light pulley (g = 10 m s<sup>−2</sup>). Find the common acceleration <strong>a</strong>.`,
        `${pair.a} m s⁻²`,
        [`${pair.T} m s⁻²`, `${10} m s⁻²`, `${pair.a + 2} m s⁻²`],
        `<strong>a = [(m<sub>1</sub> − m<sub>2</sub>) ÷ (m<sub>1</sub> + m<sub>2</sub>)]g</strong> = [(${pair.m1} − ${pair.m2}) ÷ ${pair.m1 + pair.m2}] × 10 = <strong>${pair.a} m s<sup>−2</sup></strong>.`
      );
    }
    case 'fmf-restitution': {
      const h0 = pickOne([16, 25, 36], rng);
      const eInfo = pickOne(
        [
          { label: '0.5', val: 0.5 },
          { label: '0.75', val: 0.75 },
        ],
        rng
      );
      const h1 = Number((eInfo.val * eInfo.val * h0).toFixed(2));
      return finish(
        `A sphere dropped from rest at height <strong>h<sub>0</sub> = ${h0} m</strong> hits a horizontal floor with coefficient of restitution <strong>e = ${eInfo.label}</strong>. Find the first rebound height <strong>h<sub>1</sub></strong>.`,
        `${h1} m`,
        [`${Number((eInfo.val * h0).toFixed(2))} m`, `${h0} m`, `${Number((h1 / 2).toFixed(2))} m`],
        `Since v = eu and h ∝ v<sup>2</sup>, <strong>h<sub>1</sub> = e<sup>2</sup>h<sub>0</sub></strong> = (${eInfo.label})<sup>2</sup> × ${h0} = <strong>${h1} m</strong>.`
      );
    }
    case 'fmf-perm-comb': {
      const n = pickOne([5, 6, 7], rng);
      const fact = (k: number): number => (k <= 1 ? 1 : k * fact(k - 1));
      const ans = fact(n - 1);
      return finish(
        `In how many distinct ways can <strong>${n}</strong> prefects be seated around a circular round table?`,
        `${ans}`,
        [`${fact(n)}`, `${ans / 2}`, `${n * (n - 1)}`],
        `Circular permutations of n distinct people = <strong>(n − 1)! = ${n - 1}! = ${ans}</strong>.`
      );
    }
    case 'fmf-binom-dist': {
      const n = pickOne([10, 20, 25], rng);
      const p = pickOne([0.2, 0.4, 0.5], rng);
      const mean = Number((n * p).toFixed(1));
      const variance = Number((n * p * (1 - p)).toFixed(2));
      return finish(
        `A random variable follows <strong>X ~ B(${n}, ${p})</strong>. Find its variance <strong>Var(X)</strong>.`,
        `${variance}`,
        [`${mean}`, `${Number(Math.sqrt(variance).toFixed(2))}`, `${Number((n * (1 - p)).toFixed(1))}`],
        `For B(n, p), <strong>Var(X) = np(1 − p)</strong> = ${n} × ${p} × ${(1 - p).toFixed(1)} = <strong>${variance}</strong>.`
      );
    }
    case 'fmf-poisson': {
      const lam = pickOne([2, 3, 4], rng);
      const fact = lam === 2 ? 2 : lam === 3 ? 6 : 24;
      const num = Math.pow(lam, lam);
      return finish(
        `If <strong>X ~ Po(${lam})</strong>, express <strong>P(X = ${lam})</strong> in exact form.`,
        `(${num}e^−${lam}) / ${fact}`,
        [`e^−${lam}`, `(${lam}e^−${lam}) / ${fact}`, `(${num}e^${lam}) / ${fact}`],
        `Using <strong>P(X = x) = (e<sup>−λ</sup>λ<sup>x</sup>) ÷ x!</strong> gives <strong>(${num}e<sup>−${lam}</sup>) ÷ ${fact}</strong>.`
      );
    }
    case 'fmf-spearman':
    default: {
      const sumD2 = pickOne([4, 6, 10, 12], rng);
      const rs = (1 - (6 * sumD2) / 120).toFixed(2).replace(/0$/, '');
      return finish(
        `Two judges rank <strong>n = 5</strong> debaters with <strong>∑d<sup>2</sup> = ${sumD2}</strong>. Calculate Spearman’s rank correlation <strong>r<sub>s</sub></strong>.`,
        `${rs}`,
        [`${((6 * sumD2) / 120).toFixed(2)}`, `${(1 - sumD2 / 120).toFixed(2)}`, `−${rs}`],
        `n(n<sup>2</sup> − 1) = 5 × 24 = 120. <strong>r<sub>s</sub> = 1 − (6 × ${sumD2}) ÷ 120 = ${rs}</strong>.`
      );
    }
  }
}

export function buildFMathFormulaDrillDeck(
  cat: FMathFormulaCatId | 'all',
  targetFormulaId: string | null,
  count = 8,
  seed = 204913
): FMathFormulaDrillQuestion[] {
  const rng = makeRng(seed);
  const pool = targetFormulaId
    ? FMATH_FORMULAS.filter((f) => f.id === targetFormulaId)
    : cat === 'all'
      ? FMATH_FORMULAS
      : FMATH_FORMULAS.filter((f) => f.cat === cat);
  const activePool = pool.length > 0 ? pool : FMATH_FORMULAS;

  const shuffled = [...activePool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const deck: FMathFormulaDrillQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const item = shuffled[i % shuffled.length];
    const qSeed = Math.floor(rng() * 1_000_000) + i * 7919 + 23;
    deck.push(generateFMathFormulaQuestion(item.id, qSeed));
  }
  return deck;
}
