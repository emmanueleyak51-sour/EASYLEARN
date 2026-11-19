import {
  MATH_FORMULAS,
  type MathFormulaCatId,
  type MathFormulaItem,
} from '../data/mathFormulas';
import { htmlToSpeakableChem } from './chemVoiceLogic';

export interface MathFormulaDrillQuestion {
  id: string;
  formulaId: string;
  formulaName: string;
  cat: MathFormulaCatId;
  promptHtml: string;
  hintHtml: string;
  options: string[];
  answerIdx: number;
  explanationHtml: string;
}

export function filterMathFormulas(
  formulas: MathFormulaItem[],
  cat: MathFormulaCatId | 'all',
  query: string
): MathFormulaItem[] {
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

export function getMathFormulasForTopic(topicId: string): MathFormulaItem[] {
  return MATH_FORMULAS.filter((f) => f.topicId === topicId);
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
  while (uniqueWrongs.length < 3) {
    uniqueWrongs.push(`None of these (${uniqueWrongs.length + 1})`);
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

/**
 * Generates a fresh calculation or rearrangement drill question for any of the 30 Mathematics formulas.
 */
export function generateMathFormulaQuestion(
  formulaOrId: string | MathFormulaItem,
  seed = 203
): MathFormulaDrillQuestion {
  const rng = makeRng(seed);
  const formulaId = typeof formulaOrId === 'string' ? formulaOrId : formulaOrId.id;
  const meta = MATH_FORMULAS.find((f) => f.id === formulaId) || MATH_FORMULAS[0];
  const hintHtml = `<strong>${meta.rearrangements[0].exprHtml}</strong> — ${meta.trap}`;

  const finish = (
    promptHtml: string,
    correct: string,
    wrongs: string[],
    explanationHtml: string
  ): MathFormulaDrillQuestion => {
    const { options, answerIdx } = packChoices(correct, wrongs, rng);
    return {
      id: `mfd-${meta.id}-${seed}`,
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
    case 'mf-pct-error': {
      const pairs: [number, number][] = [
        [20, 19],
        [25, 24],
        [40, 42],
        [50, 48],
        [80, 84],
      ];
      const [actual, measured] = pickOne(pairs, rng);
      const diff = Math.abs(measured - actual);
      const pct = Number(((diff / actual) * 100).toFixed(2));
      const wrongDen = Number(((diff / measured) * 100).toFixed(2));
      return finish(
        `A length of actual value <strong>${actual} cm</strong> is measured as <strong>${measured} cm</strong>. Calculate the percentage error.`,
        `${pct}%`,
        [`${wrongDen}%`, `${pct * 2}%`, `${diff}%`],
        `Absolute error = |${measured} − ${actual}| = ${diff} cm. % Error = (${diff} ÷ ${actual}) × 100% = <strong>${pct}%</strong>.`
      );
    }

    case 'mf-indices': {
      const items: [string, string, string[], string][] = [
        ['27<sup>2/3</sup>', '9', ['6', '18', '3'], '(³√27)² = 3² = <strong>9</strong>.'],
        ['16<sup>3/4</sup>', '8', ['12', '4', '6'], '(⁴√16)³ = 2³ = <strong>8</strong>.'],
        ['8<sup>−2/3</sup>', '1/4', ['−4', '4', '1/8'], '1 ÷ (³√8)² = 1 ÷ 2² = <strong>1/4</strong>.'],
        ['32<sup>2/5</sup>', '4', ['8', '6.4', '2'], '(⁵√32)² = 2² = <strong>4</strong>.'],
        ['25<sup>−1/2</sup>', '1/5', ['−5', '5', '1/25'], '1 ÷ √25 = <strong>1/5</strong>.'],
      ];
      const [expr, ans, bad, exp] = pickOne(items, rng);
      return finish(`Evaluate <strong>${expr}</strong> without tables.`, ans, bad, exp);
    }

    case 'mf-logs': {
      const items: [string, string, string[], string][] = [
        [
          'log<sub>3</sub> 54 − log<sub>3</sub> 2',
          '3',
          ['2', '4', '27'],
          'log<sub>3</sub>(54 ÷ 2) = log<sub>3</sub> 27 = log<sub>3</sub>(3³) = <strong>3</strong>.',
        ],
        [
          'log<sub>2</sub> 8 + log<sub>2</sub> 4',
          '5',
          ['12', '6', '3'],
          'log<sub>2</sub> 8 + log<sub>2</sub> 4 = 3 + 2 = <strong>5</strong>.',
        ],
        [
          'log<sub>5</sub> 50 − log<sub>5</sub> 2',
          '2',
          ['5', '25', '3'],
          'log<sub>5</sub>(50 ÷ 2) = log<sub>5</sub> 25 = <strong>2</strong>.',
        ],
        [
          'log<sub>10</sub> 25 + log<sub>10</sub> 4',
          '2',
          ['1', '29', '10'],
          'log<sub>10</sub>(25 × 4) = log<sub>10</sub> 100 = <strong>2</strong>.',
        ],
      ];
      const [expr, ans, bad, exp] = pickOne(items, rng);
      return finish(`Simplify and evaluate <strong>${expr}</strong>.`, ans, bad, exp);
    }

    case 'mf-simple-int': {
      const P = pickOne([20000, 40000, 50000, 80000], rng);
      const R = pickOne([5, 6, 8, 10], rng);
      const T = pickOne([2, 3, 4], rng);
      const I = (P * R * T) / 100;
      return finish(
        `Calculate the simple interest on <strong>₦${P.toLocaleString()}</strong> for <strong>${T} years</strong> at <strong>${R}% per annum</strong>.`,
        `₦${I.toLocaleString()}`,
        [
          `₦${(P + I).toLocaleString()}`,
          `₦${(I / 2).toLocaleString()}`,
          `₦${((P * R) / 100).toLocaleString()}`,
        ],
        `I = (P × R × T) ÷ 100 = (${P.toLocaleString()} × ${R} × ${T}) ÷ 100 = <strong>₦${I.toLocaleString()}</strong>.`
      );
    }

    case 'mf-compound-int': {
      const P = pickOne([10000, 20000, 50000, 100000], rng);
      const R = pickOne([10, 20], rng);
      const factor = (1 + R / 100) ** 2;
      const A = Math.round(P * factor);
      const CI = A - P;
      const simpleI = (P * R * 2) / 100;
      return finish(
        `Find the <strong>compound interest</strong> on <strong>₦${P.toLocaleString()}</strong> for <strong>2 years</strong> at <strong>${R}% per annum</strong>.`,
        `₦${CI.toLocaleString()}`,
        [
          `₦${A.toLocaleString()}`,
          `₦${simpleI.toLocaleString()}`,
          `₦${(CI + P / 10).toLocaleString()}`,
        ],
        `Amount A = ${P.toLocaleString()}(1 + ${R}/100)² = ₦${A.toLocaleString()}. Subtract P: CI = ${A.toLocaleString()} − ${P.toLocaleString()} = <strong>₦${CI.toLocaleString()}</strong>.`
      );
    }

    case 'mf-quad-formula': {
      const r1 = pickOne([2, 3, 4, 5], rng);
      const r2 = r1 + pickOne([2, 3, 4], rng);
      const b = -(r1 + r2);
      const c = r1 * r2;
      const disc = b * b - 4 * c;
      return finish(
        `Calculate the discriminant <strong>Δ = b² − 4ac</strong> of <strong>x² ${b}x + ${c} = 0</strong>.`,
        `${disc}`,
        [`${b * b + 4 * c}`, `${Math.sqrt(disc)}`, `${-disc}`],
        `Here a = 1, b = ${b}, c = ${c}. Δ = (${b})² − 4(1)(${c}) = ${b * b} − ${4 * c} = <strong>${disc}</strong>.`
      );
    }

    case 'mf-quad-roots': {
      const a = pickOne([2, 3], rng);
      const sNum = pickOne([5, 7, 8], rng);
      const pNum = pickOne([3, 4, 5], rng);
      return finish(
        `If α and β are the roots of <strong>${a}x² − ${sNum}x + ${pNum} = 0</strong>, find the value of <strong>α + β</strong>.`,
        `${sNum}/${a}`,
        [`−${sNum}/${a}`, `${pNum}/${a}`, `${a}/${sNum}`],
        `For ax² + bx + c = 0, α + β = −b/a = −(−${sNum})/${a} = <strong>${sNum}/${a}</strong>.`
      );
    }

    case 'mf-ap-nth': {
      const a = pickOne([3, 5, 7, 10], rng);
      const d = pickOne([3, 4, 5, 6], rng);
      const n = pickOne([10, 12, 15, 20], rng);
      const tn = a + (n - 1) * d;
      return finish(
        `Find the <strong>${n}th term</strong> of the Arithmetic Progression <strong>${a}, ${a + d}, ${a + 2 * d}, …</strong>`,
        `${tn}`,
        [`${a + n * d}`, `${tn - d}`, `${a * n + d}`],
        `a = ${a}, d = ${d}. T<sub>${n}</sub> = ${a} + (${n} − 1)(${d}) = ${a} + ${(n - 1) * d} = <strong>${tn}</strong>.`
      );
    }

    case 'mf-ap-sum': {
      const a = pickOne([2, 4, 5], rng);
      const d = pickOne([2, 3, 4], rng);
      const n = pickOne([8, 10, 12], rng);
      const sn = (n / 2) * (2 * a + (n - 1) * d);
      const badForget2 = (n / 2) * (a + (n - 1) * d);
      return finish(
        `Find the sum of the first <strong>${n} terms</strong> of the AP with first term <strong>a = ${a}</strong> and common difference <strong>d = ${d}</strong>.`,
        `${sn}`,
        [`${badForget2}`, `${sn + n * d}`, `${a + (n - 1) * d}`],
        `S<sub>${n}</sub> = (${n}/2)[2(${a}) + (${n} − 1)(${d})] = ${n / 2} × ${2 * a + (n - 1) * d} = <strong>${sn}</strong>.`
      );
    }

    case 'mf-gp-sum': {
      const cases: [number, string, number, number][] = [
        [16, '1/2', 0.5, 32],
        [18, '1/3', 1 / 3, 27],
        [20, '3/5', 0.6, 50],
        [12, '1/4', 0.25, 16],
        [30, '2/5', 0.4, 50],
      ];
      const [a, rStr, rNum, sinf] = pickOne(cases, rng);
      return finish(
        `Find the sum to infinity <strong>S<sub>∞</sub></strong> of a GP with first term <strong>a = ${a}</strong> and common ratio <strong>r = ${rStr}</strong>.`,
        `${sinf}`,
        [`${Math.round(a * (1 + rNum))}`, `${sinf / 2}`, `${Math.round(a / rNum)}`],
        `Since |r| = ${rStr} &lt; 1, S<sub>∞</sub> = a ÷ (1 − r) = ${a} ÷ (1 − ${rStr}) = <strong>${sinf}</strong>.`
      );
    }

    case 'mf-matrix-det': {
      const a = pickOne([3, 4, 5, 6], rng);
      const d = pickOne([2, 3, 4, 5], rng);
      const b = pickOne([1, 2, 3], rng);
      const c = pickOne([2, 3, 4], rng);
      const det = a * d - b * c;
      const wrongPlus = a * d + b * c;
      return finish(
        `Find the determinant of the 2×2 matrix <strong>A = [${a}  ${b};  ${c}  ${d}]</strong>.`,
        `${det}`,
        [`${wrongPlus}`, `${b * c - a * d}`, `${a + d - (b + c)}`],
        `|A| = ad − bc = (${a} × ${d}) − (${b} × ${c}) = ${a * d} − ${b * c} = <strong>${det}</strong>.`
      );
    }

    case 'mf-sets-union': {
      const both = pickOne([8, 10, 12, 15], rng);
      const onlyA = pickOne([10, 12, 14], rng);
      const onlyB = pickOne([7, 9, 11], rng);
      const neither = pickOne([4, 5, 6], rng);
      const nA = onlyA + both;
      const nB = onlyB + both;
      const total = onlyA + onlyB + both + neither;
      return finish(
        `In a group of <strong>${total}</strong> students, <strong>${nA}</strong> study Maths, <strong>${nB}</strong> study Chemistry, and <strong>${neither}</strong> study neither. How many study <strong>both</strong> subjects?`,
        `${both}`,
        [`${both + neither}`, `${nA + nB - total}`, `${onlyA}`],
        `n(M ∪ C) = ${total} − ${neither} = ${total - neither}. Then n(M ∩ C) = ${nA} + ${nB} − ${total - neither} = <strong>${both}</strong>.`
      );
    }

    case 'mf-poly-angles': {
      const polygons: [number, number][] = [
        [6, 120],
        [8, 135],
        [9, 140],
        [10, 144],
        [12, 150],
        [15, 156],
      ];
      const [n, intAng] = pickOne(polygons, rng);
      const extAng = 180 - intAng;
      return finish(
        `Each interior angle of a regular polygon is <strong>${intAng}°</strong>. How many sides does the polygon have?`,
        `${n} sides`,
        [`${n - 2} sides`, `${n + 2} sides`, `${extAng} sides`],
        `Each exterior angle e = 180° − ${intAng}° = ${extAng}°. Number of sides n = 360° ÷ ${extAng}° = <strong>${n} sides</strong>.`
      );
    }

    case 'mf-sector': {
      const r = pickOne([7, 14, 21], rng);
      const theta = pickOne([60, 90, 120, 180], rng);
      const arc = Math.round((theta / 360) * 2 * (22 / 7) * r);
      const perim = arc + 2 * r;
      return finish(
        `Calculate the <strong>perimeter</strong> of a sector of radius <strong>${r} cm</strong> subtending <strong>${theta}°</strong> at the centre [take π = 22/7].`,
        `${perim} cm`,
        [`${arc} cm`, `${arc + r} cm`, `${Math.round((theta / 360) * (22 / 7) * r * r)} cm`],
        `Arc length L = (${theta}/360) × 2 × (22/7) × ${r} = ${arc} cm. Perimeter = L + 2r = ${arc} + ${2 * r} = <strong>${perim} cm</strong>.`
      );
    }

    case 'mf-cylinder': {
      const r = pickOne([7, 14], rng);
      const h = pickOne([5, 10, 12], rng);
      const vol = Math.round((22 / 7) * r * r * h);
      const csa = Math.round(2 * (22 / 7) * r * h);
      return finish(
        `Find the <strong>volume</strong> of a circular cylinder of radius <strong>${r} cm</strong> and height <strong>${h} cm</strong> [π = 22/7].`,
        `${vol} cm³`,
        [`${csa} cm³`, `${vol / 2} cm³`, `${Math.round(vol / 3)} cm³`],
        `V = πr²h = (22/7) × ${r}² × ${h} = <strong>${vol} cm³</strong>.`
      );
    }

    case 'mf-cone': {
      const triples: [number, number, number][] = [
        [3, 4, 5],
        [6, 8, 10],
        [5, 12, 13],
        [8, 15, 17],
      ];
      const [r, h, l] = pickOne(triples, rng);
      const csaCoeff = r * l;
      const tsaCoeff = r * (l + r);
      return finish(
        `A right circular cone has base radius <strong>${r} cm</strong> and vertical height <strong>${h} cm</strong>. Find its <strong>curved surface area</strong> in terms of π.`,
        `${csaCoeff}π cm²`,
        [`${r * h}π cm²`, `${tsaCoeff}π cm²`, `${Math.round((r * r * h) / 3)}π cm²`],
        `Slant height l = √(${r}² + ${h}²) = ${l} cm. Curved surface area = πrl = π × ${r} × ${l} = <strong>${csaCoeff}π cm²</strong>.`
      );
    }

    case 'mf-sphere': {
      const r = pickOne([7, 14], rng);
      const sa = Math.round(4 * (22 / 7) * r * r);
      const hemiTsa = Math.round(3 * (22 / 7) * r * r);
      const circleA = Math.round((22 / 7) * r * r);
      return finish(
        `Find the <strong>total surface area</strong> of a solid sphere of radius <strong>${r} cm</strong> [π = 22/7].`,
        `${sa} cm²`,
        [`${hemiTsa} cm²`, `${circleA * 2} cm²`, `${circleA} cm²`],
        `Surface area of sphere A = 4πr² = 4 × (22/7) × ${r}² = <strong>${sa} cm²</strong>.`
      );
    }

    case 'mf-earth-dist': {
      const R = 6400;
      const items: [string, number, string, string[]][] = [
        [
          '60°N',
          3200,
          'r = R cos 60° = 6,400 × 0.5 = <strong>3,200 km</strong>.',
          ['6,400 km', '4,800 km', '1,600 km'],
        ],
        [
          '0° (the Equator)',
          6400,
          'At α = 0°, cos 0° = 1, so r = <strong>6,400 km</strong>.',
          ['3,200 km', '0 km', '12,800 km'],
        ],
      ];
      const [latLabel, rVal, exp, bad] = pickOne(items, rng);
      return finish(
        `Taking the Earth as a sphere of radius <strong>R = ${R.toLocaleString()} km</strong>, find the radius of the parallel of latitude <strong>${latLabel}</strong>.`,
        `${rVal.toLocaleString()} km`,
        bad,
        exp
      );
    }

    case 'mf-pythag-trig': {
      const triples: [number, number, number][] = [
        [3, 4, 5],
        [5, 12, 13],
        [8, 15, 17],
        [7, 24, 25],
      ];
      const [opp, adj, hyp] = pickOne(triples, rng);
      return finish(
        `If <strong>sin θ = ${opp}/${hyp}</strong> and θ is acute, find the exact value of <strong>cos θ</strong>.`,
        `${adj}/${hyp}`,
        [`${opp}/${adj}`, `${adj}/${opp}`, `${hyp - opp}/${hyp}`],
        `By Pythagoras, Adjacent = √(${hyp}² − ${opp}²) = ${adj}. Therefore cos θ = Adj/Hyp = <strong>${adj}/${hyp}</strong>.`
      );
    }

    case 'mf-sine-rule': {
      const a = pickOne([6, 8, 10, 12], rng);
      return finish(
        `In △ABC, <strong>∠A = 30°</strong>, <strong>∠B = 90°</strong>, and side <strong>a = ${a} cm</strong>. Find side <strong>b</strong> using the Sine Rule.`,
        `${2 * a} cm`,
        [`${a} cm`, `${a / 2} cm`, `${a}√3 cm`],
        `b ÷ sin 90° = ${a} ÷ sin 30° → b ÷ 1 = ${a} ÷ 0.5 = <strong>${2 * a} cm</strong>.`
      );
    }

    case 'mf-cosine-rule': {
      const pairs: [number, number, number][] = [
        [5, 8, 7],
        [3, 8, 7],
        [7, 8, 7],
      ];
      const [b, c, aAns] = pickOne(pairs, rng);
      const aSq = b * b + c * c - b * c;
      return finish(
        `In △ABC, <strong>b = ${b} cm</strong>, <strong>c = ${c} cm</strong>, and included angle <strong>A = 60°</strong>. Find side <strong>a</strong>.`,
        `${aAns} cm`,
        [`${aSq} cm`, `${Math.round(Math.sqrt(b * b + c * c))} cm`, `${b + c - aAns} cm`],
        `a² = ${b}² + ${c}² − 2(${b})(${c}) cos 60° = ${b * b} + ${c * c} − ${b * c} = ${aSq} → a = √${aSq} = <strong>${aAns} cm</strong>.`
      );
    }

    case 'mf-tri-area': {
      const a = pickOne([8, 10, 12, 14], rng);
      const b = pickOne([6, 10, 12], rng);
      const area = (a * b) / 4; // 1/2 * a * b * sin 30 (0.5)
      return finish(
        `Find the area of △PQR with sides <strong>p = ${a} cm</strong>, <strong>q = ${b} cm</strong>, and included angle <strong>∠R = 30°</strong>.`,
        `${area} cm²`,
        [`${(a * b) / 2} cm²`, `${a * b} cm²`, `${area / 2} cm²`],
        `Area = ½pq sin R = ½ × ${a} × ${b} × sin 30° = ${(a * b) / 2} × 0.5 = <strong>${area} cm²</strong>.`
      );
    }

    case 'mf-coord-grad': {
      const x1 = pickOne([1, 2, 3], rng);
      const y1 = pickOne([2, 4, 5], rng);
      const m = pickOne([2, 3, -2, -3], rng);
      const dx = pickOne([2, 3, 4], rng);
      const x2 = x1 + dx;
      const y2 = y1 + m * dx;
      return finish(
        `Find the gradient of the straight line joining <strong>A(${x1}, ${y1})</strong> and <strong>B(${x2}, ${y2})</strong>.`,
        `${m}`,
        [`${-m}`, `1/${Math.abs(m)}`, `${y2 + y1}`],
        `m = (y₂ − y₁) ÷ (x₂ − x₁) = (${y2} − ${y1}) ÷ (${x2} − ${x1}) = ${y2 - y1} ÷ ${dx} = <strong>${m}</strong>.`
      );
    }

    case 'mf-coord-line': {
      const p = pickOne([2, 3, 4, 5], rng);
      const q = pickOne([3, 5, 7], rng);
      if (p === q) {
        return finish(
          `Find the gradient of a line <strong>perpendicular</strong> to <strong>y = 2x − 5</strong>.`,
          `−1/2`,
          [`2`, `1/2`, `−2`],
          `m₁ = 2, so perpendicular gradient m₂ = −1/m₁ = <strong>−1/2</strong>.`
        );
      }
      return finish(
        `Find the gradient of a line <strong>perpendicular</strong> to the line <strong>${p}x + ${q}y − 10 = 0</strong>.`,
        `${q}/${p}`,
        [`−${p}/${q}`, `${p}/${q}`, `−${q}/${p}`],
        `Rearrange: ${q}y = −${p}x + 10 → m₁ = −${p}/${q}. Perpendicular gradient m₂ = −1 ÷ m₁ = <strong>${q}/${p}</strong>.`
      );
    }

    case 'mf-vec-dot': {
      const pairs: [number, number, number][] = [
        [3, 4, 5],
        [6, 8, 10],
        [5, 12, 13],
        [8, 15, 17],
      ];
      const [x, y, mod] = pickOne(pairs, rng);
      return finish(
        `Calculate the magnitude (modulus) <strong>|r|</strong> of the vector <strong>r = ${x}i − ${y}j</strong>.`,
        `${mod}`,
        [`${x + y}`, `${Math.abs(x - y)}`, `${mod * mod}`],
        `|r| = √(${x}² + (−${y})²) = √(${x * x} + ${y * y}) = √${mod * mod} = <strong>${mod}</strong>.`
      );
    }

    case 'mf-sim-scale': {
      const ratios: [number, number, number][] = [
        [1, 2, 5],
        [2, 3, 16],
        [1, 3, 4],
        [2, 5, 16],
      ];
      const [r1, r2, v1] = pickOne(ratios, rng);
      const v2 = (v1 * r2 ** 3) / r1 ** 3;
      const wrongArea = (v1 * r2 ** 2) / r1 ** 2;
      const wrongLin = (v1 * r2) / r1;
      return finish(
        `Two similar solids have corresponding heights in the ratio <strong>${r1} : ${r2}</strong>. If the smaller has volume <strong>${v1} cm³</strong>, find the volume of the larger solid.`,
        `${v2} cm³`,
        [`${wrongArea} cm³`, `${wrongLin} cm³`, `${v2 * 2} cm³`],
        `Volume ratio = (${r1}/${r2})³ = ${r1 ** 3}/${r2 ** 3}. Thus V₂ = ${v1} × ${r2 ** 3} ÷ ${r1 ** 3} = <strong>${v2} cm³</strong>.`
      );
    }

    case 'mf-diff-power': {
      const a = pickOne([2, 3, 4], rng);
      const b = pickOne([3, 5, 7], rng);
      const x0 = pickOne([1, 2, 3], rng);
      const grad = 2 * a * x0 - b;
      return finish(
        `Find the gradient <strong>dy/dx</strong> of the curve <strong>y = ${a}x² − ${b}x + 6</strong> at the point where <strong>x = ${x0}</strong>.`,
        `${grad}`,
        [`${2 * a * x0 + b}`, `${a * x0 * x0 - b * x0 + 6}`, `${2 * a - b}`],
        `dy/dx = ${2 * a}x − ${b}. At x = ${x0}: dy/dx = ${2 * a}(${x0}) − ${b} = <strong>${grad}</strong>.`
      );
    }

    case 'mf-integ-power': {
      const k = pickOne([1, 2, 3], rng);
      const upper = pickOne([2, 3], rng);
      const val = k * upper ** 3;
      return finish(
        `Evaluate the definite integral <strong>∫<sub>0</sub><sup>${upper}</sup> ${3 * k}x² dx</strong>.`,
        `${val}`,
        [`${6 * k * upper}`, `${k * upper ** 2}`, `${val / 2}`],
        `∫ ${3 * k}x² dx = [${k}x³]<sub>0</sub><sup>${upper}</sup> = ${k}(${upper}³) − 0 = <strong>${val}</strong>.`
      );
    }

    case 'mf-stats-sd': {
      const shift = pickOne([0, 2, 5, 10], rng);
      const nums = [2 + shift, 4 + shift, 6 + shift, 8 + shift];
      const mean = 5 + shift;
      return finish(
        `Find the <strong>population variance (σ²)</strong> of the four scores: <strong>${nums.join(', ')}</strong>.`,
        `5`,
        [`√5`, `20`, `${mean}`],
        `Mean x̄ = ${mean}. Deviations from mean are −3, −1, +1, +3; squared sum = 9 + 1 + 1 + 9 = 20. Variance = 20 ÷ 4 = <strong>5</strong>.`
      );
    }

    case 'mf-perm-comb':
    default: {
      const choices: [number, number, number, number][] = [
        [6, 2, 15, 30],
        [7, 3, 35, 210],
        [8, 2, 28, 56],
        [5, 3, 10, 60],
      ];
      const [n, r, comb, permVal] = pickOne(choices, rng);
      return finish(
        `In how many ways can a committee of <strong>${r}</strong> be selected from <strong>${n}</strong> candidates?`,
        `${comb} ways`,
        [`${permVal} ways`, `${n * r} ways`, `${comb * 2} ways`],
        `Committee order does not matter → <sup>${n}</sup>C<sub>${r}</sub> = ${n}! ÷ [${r}!(${n - r})!] = <strong>${comb} ways</strong>.`
      );
    }
  }
}

export function buildMathFormulaDrillDeck(
  cat: MathFormulaCatId | 'all',
  targetFormulaId: string | null,
  count = 8,
  baseSeed = Date.now()
): MathFormulaDrillQuestion[] {
  const pool = targetFormulaId
    ? MATH_FORMULAS.filter((f) => f.id === targetFormulaId)
    : cat === 'all'
      ? MATH_FORMULAS
      : MATH_FORMULAS.filter((f) => f.cat === cat);

  const activePool = pool.length > 0 ? pool : MATH_FORMULAS;
  const rng = makeRng(baseSeed);
  const shuffled = [...activePool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const out: MathFormulaDrillQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const item = shuffled[i % shuffled.length];
    const seed = (baseSeed + (i + 1) * 7919) >>> 0;
    out.push(generateMathFormulaQuestion(item.id, seed));
  }
  return out;
}

export function extractMathFormulaSpeechScript(
  formula: MathFormulaItem,
  rearrIdx = 0
): string {
  const r = formula.rearrangements[rearrIdx] || formula.rearrangements[0];
  const varsText = formula.variables
    .slice(0, 2)
    .map(([sym, desc]) => `${sym} is ${desc}`)
    .join(', while ');
  const raw = [
    `Let's see why ${formula.name} works.`,
    formula.summary,
    `In the form ${r.label}, ${r.exprHtml}${varsText ? `, remember that ${varsText}` : ''}.`,
    `Before you solve, watch this classic trap: ${formula.trap}`,
  ]
    .filter(Boolean)
    .join(' ');
  return htmlToSpeakableChem(raw);
}
