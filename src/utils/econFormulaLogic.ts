import {
  ECON_FORMULAS,
  type EconFormulaCatId,
  type EconFormulaItem,
} from '../data/econFormulas';
import { htmlToSpeakableChem } from './chemVoiceLogic';

export interface EconFormulaDrillQuestion {
  id: string;
  formulaId: string;
  formulaName: string;
  cat: EconFormulaCatId;
  promptHtml: string;
  hintHtml: string;
  options: string[];
  answerIdx: number;
  explanationHtml: string;
}

export function filterEconFormulas(
  formulas: EconFormulaItem[],
  cat: EconFormulaCatId | 'all',
  query: string
): EconFormulaItem[] {
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

export function getEconFormulasForTopic(topicId: string): EconFormulaItem[] {
  return ECON_FORMULAS.filter((f) => f.topicId === topicId);
}

export function extractEconFormulaSpeechScript(
  item: EconFormulaItem,
  rearrIdx = 0,
  isFirstStep = false
): string {
  const rearr = item.rearrangements[rearrIdx] || item.rearrangements[0];
  const coreVars = item.variables
    .slice(0, 2)
    .map(([s, m]) => `${s} measures ${m}`)
    .join(', while ');
  const raw = [
    isFirstStep ? "Welcome to Dr. Ngozi's Economics Formula Studio." : '',
    `Let's unpack ${item.name} like an economist.`,
    `Here is the core intuition: ${item.summary}`,
    `When you write ${rearr.label}, ${rearr.exprHtml}, keep your eye on what moves: ${coreVars}.`,
    `Before you substitute numbers, watch this classic trap: ${item.trap}`,
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

export function generateEconFormulaQuestion(
  formulaId: string,
  seed = 404
): EconFormulaDrillQuestion {
  const rng = makeRng(seed);
  const meta = ECON_FORMULAS.find((f) => f.id === formulaId) || ECON_FORMULAS[0];
  const hintHtml = `<strong>${meta.rearrangements[0].exprHtml}</strong> — ${meta.trap}`;

  const finish = (
    promptHtml: string,
    correct: string,
    wrongs: string[],
    explanationHtml: string
  ): EconFormulaDrillQuestion => {
    const { options, answerIdx } = packChoices(correct, wrongs, rng);
    return {
      id: `ecfd-${meta.id}-${seed}`,
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
    case 'efm-ped': {
      const pctP = pickOne([10, 20, 25], rng);
      const mult = pickOne([0.4, 0.8, 1.6, 2.4], rng);
      const pctQ = Math.round(pctP * mult);
      const ed = (pctQ / pctP).toFixed(1);
      const inv = (pctP / pctQ).toFixed(2);
      return finish(
        `A <strong>${pctP}%</strong> rise in the price of yams leads to a <strong>${pctQ}%</strong> fall in quantity demanded. Calculate <strong>|E<sub>d</sub>|</strong>.`,
        `${ed}`,
        [`${inv}`, `${(Number(ed) + 1.0).toFixed(1)}`, `${pctQ - pctP}`],
        `Using <strong>|E<sub>d</sub>| = %ΔQ<sub>d</sub> ÷ %ΔP</strong> = ${pctQ}% ÷ ${pctP}% = <strong>${ed}</strong>.`
      );
    }
    case 'efm-ped-point': {
      const p1 = pickOne([20, 40, 50], rng);
      const dp = pickOne([5, 10], rng);
      const q1 = pickOne([100, 200], rng);
      const dq = pickOne([25, 50], rng);
      const ed = ((dq / dp) * (p1 / q1)).toFixed(2);
      const wrongInv = ((dq / dp) * (q1 / p1)).toFixed(2);
      return finish(
        `When price increases from <strong>₦${p1}</strong> to <strong>₦${p1 + dp}</strong>, quantity demanded falls from <strong>${q1}</strong> to <strong>${q1 - dq}</strong> units. Find point <strong>|E<sub>d</sub>|</strong>.`,
        `${ed}`,
        [`${wrongInv}`, `${(dq / dp).toFixed(2)}`, `${(Number(ed) + 0.5).toFixed(2)}`],
        `<strong>|E<sub>d</sub>| = (|ΔQ| ÷ |ΔP|) × (P<sub>1</sub> ÷ Q<sub>1</sub>)</strong> = (${dq} ÷ ${dp}) × (${p1} ÷ ${q1}) = <strong>${ed}</strong>.`
      );
    }
    case 'efm-yed': {
      const pctY = pickOne([10, 20, 25], rng);
      const pctQ = pickOne([-5, -10, 15, 30], rng);
      const ey = (pctQ / pctY).toFixed(1);
      const kind = Number(ey) < 0 ? 'Inferior good' : 'Normal good';
      const oppKind = Number(ey) < 0 ? 'Normal good' : 'Inferior good';
      return finish(
        `Consumer disposable income rises by <strong>${pctY}%</strong> and quantity demanded changes by <strong>${pctQ > 0 ? `+${pctQ}` : pctQ}%</strong>. Find <strong>E<sub>y</sub></strong> and classify the good.`,
        `${ey} (${kind})`,
        [
          `${ey} (${oppKind})`,
          `${(-Number(ey)).toFixed(1)} (${kind})`,
          `${(pctY / Math.abs(pctQ)).toFixed(1)} (${oppKind})`,
        ],
        `<strong>E<sub>y</sub> = %ΔQ<sub>d</sub> ÷ %ΔY</strong> = ${pctQ}% ÷ ${pctY}% = <strong>${ey}</strong> (${kind}).`
      );
    }
    case 'efm-xed': {
      const pctPy = pickOne([10, 20], rng);
      const pctQx = pickOne([-8, -12, 14, 24], rng);
      const exy = (pctQx / pctPy).toFixed(1);
      const rel = Number(exy) > 0 ? 'Substitutes' : 'Complements';
      const opp = Number(exy) > 0 ? 'Complements' : 'Substitutes';
      return finish(
        `A <strong>${pctPy}%</strong> rise in the price of Good Y causes quantity demanded of Good X to change by <strong>${pctQx > 0 ? `+${pctQx}` : pctQx}%</strong>. Find <strong>E<sub>xy</sub></strong>.`,
        `${exy} (${rel})`,
        [
          `${exy} (${opp})`,
          `${(-Number(exy)).toFixed(1)} (${rel})`,
          `${(pctPy / Math.abs(pctQx)).toFixed(1)} (${opp})`,
        ],
        `<strong>E<sub>xy</sub> = %ΔQ<sub>x</sub> ÷ %ΔP<sub>y</sub></strong> = ${pctQx}% ÷ ${pctPy}% = <strong>${exy}</strong> (${rel}).`
      );
    }
    case 'efm-mu': {
      const px = pickOne([10, 20, 25], rng);
      const ratio = pickOne([3, 4, 5], rng);
      const mux = px * ratio;
      const py = pickOne([15, 30, 40], rng);
      const muy = py * ratio;
      return finish(
        `A rational consumer maximizes utility across goods X and Y when <strong>MU<sub>x</sub> = ${mux} utils</strong>, <strong>P<sub>x</sub> = ₦${px}</strong>, and <strong>MU<sub>y</sub> = ${muy} utils</strong>. Find <strong>P<sub>y</sub></strong>.`,
        `₦${py}`,
        [`₦${py + 10}`, `₦${Math.max(5, py - 5)}`, `₦${muy - mux + px}`],
        `At equilibrium, <strong>MU<sub>x</sub> ÷ P<sub>x</sub> = MU<sub>y</sub> ÷ P<sub>y</sub></strong> → ${mux} ÷ ${px} = ${ratio} = ${muy} ÷ P<sub>y</sub> → P<sub>y</sub> = <strong>₦${py}</strong>.`
      );
    }
    case 'efm-eq': {
      const p = pickOne([6, 8, 10, 12], rng);
      const b = pickOne([2, 3], rng);
      const d = pickOne([2, 3, 4], rng);
      const c = pickOne([10, 14, 20], rng);
      const q = c + d * p;
      const a = q + b * p;
      return finish(
        `Given market demand <strong>Q<sub>d</sub> = ${a} − ${b}P</strong> and supply <strong>Q<sub>s</sub> = ${c} + ${d}P</strong>, find the equilibrium price <strong>P*</strong>.`,
        `₦${p}`,
        [`₦${p + 4}`, `₦${Math.round((a + c) / (b + d))}`, `₦${q}`],
        `Set Q<sub>d</sub> = Q<sub>s</sub>: ${a} − ${b}P = ${c} + ${d}P → ${a - c} = ${b + d}P → P* = <strong>₦${p}</strong> (with Q* = ${q} units).`
      );
    }
    case 'efm-ap-mp': {
      const l1 = pickOne([3, 4, 5], rng);
      const ap1 = pickOne([12, 15, 18], rng);
      const mpNext = pickOne([8, 10, 14, 20], rng);
      const tp1 = l1 * ap1;
      const tp2 = tp1 + mpNext;
      return finish(
        `<strong>${l1} workers</strong> produce an Average Product of <strong>${ap1} units</strong>. When worker <strong>#${l1 + 1}</strong> is hired, Total Product rises to <strong>${tp2} units</strong>. Find the Marginal Product of worker #${l1 + 1}.`,
        `${mpNext} units`,
        [`${tp2 - ap1} units`, `${Math.round(tp2 / (l1 + 1))} units`, `${mpNext + 6} units`],
        `First find TP<sub>${l1}</sub> = ${l1} × ${ap1} = ${tp1} units. Then <strong>MP = TP<sub>${l1 + 1}</sub> − TP<sub>${l1}</sub></strong> = ${tp2} − ${tp1} = <strong>${mpNext} units</strong>.`
      );
    }
    case 'efm-tc': {
      const tfc = pickOne([400, 600, 1000], rng);
      const avc = pickOne([15, 25, 30], rng);
      const q = pickOne([10, 12, 20], rng);
      const tc = tfc + avc * q;
      return finish(
        `A firm’s short-run Total Cost function is <strong>TC = ${tfc} + ${avc}Q</strong> (in ₦). Find Total Cost at <strong>Q = ${q} units</strong>.`,
        `₦${tc}`,
        [`₦${tfc + avc + q}`, `₦${avc * q}`, `₦${tc + tfc}`],
        `Here TFC = ₦${tfc} and TVC = ${avc} × ${q} = ₦${avc * q}. Thus <strong>TC = TFC + TVC = ₦${tc}</strong>.`
      );
    }
    case 'efm-ac-mc': {
      const q1 = pickOne([8, 10], rng);
      const tc1 = q1 * pickOne([50, 60, 80], rng);
      const mc = pickOne([35, 45, 70, 95], rng);
      const tc2 = tc1 + mc;
      return finish(
        `Total Cost rises from <strong>₦${tc1}</strong> at <strong>${q1} units</strong> to <strong>₦${tc2}</strong> at <strong>${q1 + 1} units</strong>. Find the Marginal Cost of the ${q1 + 1}th unit.`,
        `₦${mc}`,
        [`₦${tc1 / q1}`, `₦${Math.round(tc2 / (q1 + 1))}`, `₦${mc + 20}`],
        `<strong>MC = ΔTC ÷ ΔQ</strong> = (${tc2} − ${tc1}) ÷ (${q1 + 1} − ${q1}) = <strong>₦${mc}</strong>.`
      );
    }
    case 'efm-tr-mr': {
      const q1 = pickOne([4, 5], rng);
      const p1 = pickOne([30, 40, 50], rng);
      const p2 = p1 - 2;
      const tr1 = q1 * p1;
      const tr2 = (q1 + 1) * p2;
      const mr = tr2 - tr1;
      return finish(
        `A firm sells <strong>${q1} units</strong> at <strong>₦${p1}</strong> each, or <strong>${q1 + 1} units</strong> at <strong>₦${p2}</strong> each. Find the Marginal Revenue of the ${q1 + 1}th unit.`,
        `₦${mr}`,
        [`₦${p2}`, `₦${tr2}`, `₦${p1 - p2}`],
        `TR<sub>${q1}</sub> = ${q1} × ${p1} = ₦${tr1}; TR<sub>${q1 + 1}</sub> = ${q1 + 1} × ${p2} = ₦${tr2}. <strong>MR = ${tr2} − ${tr1} = ₦${mr}</strong>.`
      );
    }
    case 'efm-profit': {
      const p = pickOne([300, 400, 500], rng);
      const avc = pickOne([150, 200, 250], rng);
      const contrib = p - avc;
      const qBe = pickOne([40, 60, 80, 100], rng);
      const tfc = contrib * qBe;
      return finish(
        `A firm incurs Total Fixed Cost <strong>₦${tfc}</strong>, unit variable cost <strong>AVC = ₦${avc}</strong>, and sells each unit at <strong>P = ₦${p}</strong>. Find its break-even output <strong>Q<sub>BE</sub></strong>.`,
        `${qBe} units`,
        [`${Math.round(tfc / p)} units`, `${Math.round(tfc / avc)} units`, `${qBe + 25} units`],
        `Unit contribution = P − AVC = ${p} − ${avc} = ₦${contrib}. <strong>Q<sub>BE</sub> = TFC ÷ (P − AVC)</strong> = ${tfc} ÷ ${contrib} = <strong>${qBe} units</strong>.`
      );
    }
    case 'efm-mean': {
      const f1 = pickOne([2, 3], rng);
      const f2 = pickOne([4, 5], rng);
      const f3 = 10 - f1 - f2;
      const sumFx = f1 * 2 + f2 * 5 + f3 * 8;
      const mean = (sumFx / 10).toFixed(1);
      return finish(
        `Scores <strong>x = 2, 5, 8</strong> occur with frequencies <strong>f = ${f1}, ${f2}, ${f3}</strong>. Calculate the arithmetic mean <strong>x̄</strong>.`,
        `${mean}`,
        [`${(15 / 3).toFixed(1)}`, `${(sumFx / 15).toFixed(1)}`, `${(Number(mean) + 1.2).toFixed(1)}`],
        `∑fx = (${f1}×2) + (${f2}×5) + (${f3}×8) = ${sumFx}; ∑f = 10. <strong>x̄ = ${sumFx} ÷ 10 = ${mean}</strong>.`
      );
    }
    case 'efm-variance': {
      const d = pickOne([2, 3, 4], rng);
      const m = pickOne([10, 15, 20], rng);
      const nums = [m - d, m, m, m + d];
      const variance = (2 * d * d) / 4;
      return finish(
        `Calculate the population <strong>variance (σ<sup>2</sup>)</strong> of the four outputs: <strong>${nums.join(', ')}</strong>.`,
        `${variance}`,
        [`${Math.sqrt(variance).toFixed(2)}`, `${2 * d * d}`, `${m}`],
        `Mean x̄ = ${m}. Squared deviations = ${d * d} + 0 + 0 + ${d * d} = ${2 * d * d}. <strong>σ<sup>2</sup> = ${2 * d * d} ÷ 4 = ${variance}</strong>.`
      );
    }
    case 'efm-pie': {
      const deg = pickOne([72, 90, 108, 144], rng);
      const total = pickOne([200, 400, 500], rng);
      const val = (deg / 360) * total;
      return finish(
        `Health is represented by a <strong>${deg}°</strong> sector in a <strong>₦${total} billion</strong> national budget pie chart. Find the Health allocation.`,
        `₦${val} billion`,
        [`₦${(deg / 100) * total} billion`, `₦${val + 30} billion`, `₦${total - val} billion`],
        `<strong>Component = (θ ÷ 360°) × Total</strong> = (${deg}° ÷ 360°) × ${total} = <strong>₦${val} billion</strong>.`
      );
    }
    case 'efm-cpi': {
      const cpi1 = pickOne([120, 125, 150, 200], rng);
      const rate = pickOne([12, 16, 20, 24], rng);
      const cpi2 = cpi1 * (1 + rate / 100);
      const trapDiff = Math.round(cpi2 - cpi1);
      return finish(
        `The Consumer Price Index rises from <strong>${cpi1}</strong> in Year 1 to <strong>${cpi2}</strong> in Year 2. Find the annual inflation rate.`,
        `${rate}%`,
        [`${trapDiff}%`, `${((trapDiff / cpi2) * 100).toFixed(1)}%`, `${rate + 5}%`],
        `<strong>Inflation % = [(CPI<sub>2</sub> − CPI<sub>1</sub>) ÷ CPI<sub>1</sub>] × 100</strong> = (${trapDiff} ÷ ${cpi1}) × 100 = <strong>${rate}%</strong>.`
      );
    }
    case 'efm-gdp-exp': {
      const c = pickOne([200, 300], rng);
      const i = pickOne([60, 90], rng);
      const g = pickOne([100, 120], rng);
      const x = pickOne([50, 70], rng);
      const m = pickOne([40, 85], rng);
      const gdp = c + i + g + (x - m);
      return finish(
        `Given <strong>C = ₦${c}b</strong>, <strong>I = ₦${i}b</strong>, <strong>G = ₦${g}b</strong>, Exports <strong>X = ₦${x}b</strong>, and Imports <strong>M = ₦${m}b</strong>, find <strong>GDP</strong>.`,
        `₦${gdp}b`,
        [`₦${c + i + g + x + m}b`, `₦${c + i + g + (m - x)}b`, `₦${c + i + g}b`],
        `<strong>GDP = C + I + G + (X − M)</strong> = ${c} + ${i} + ${g} + (${x} − ${m}) = <strong>₦${gdp}b</strong>.`
      );
    }
    case 'efm-gnp-nnp': {
      const gdp = pickOne([500, 600], rng);
      const rec = pickOne([25, 40], rng);
      const paid = pickOne([50, 65], rng);
      const dep = pickOne([30, 45], rng);
      const nnp = gdp + (rec - paid) - dep;
      return finish(
        `Given <strong>GDP = ₦${gdp}b</strong>, income received from abroad = <strong>₦${rec}b</strong>, income paid to foreigners = <strong>₦${paid}b</strong>, and depreciation = <strong>₦${dep}b</strong>, find <strong>NNP</strong>.`,
        `₦${nnp}b`,
        [`₦${gdp + (paid - rec) - dep}b`, `₦${gdp + (rec - paid)}b`, `₦${gdp - dep}b`],
        `GNP = GDP + NFIA = ${gdp} + (${rec} − ${paid}) = ₦${gdp + rec - paid}b. <strong>NNP = GNP − Depreciation = ₦${nnp}b</strong>.`
      );
    }
    case 'efm-mpc-mps': {
      const dy = pickOne([200, 400, 500], rng);
      const mpc = pickOne([0.6, 0.75, 0.8], rng);
      const dc = dy * mpc;
      const mps = (1 - mpc).toFixed(2).replace(/0$/, '');
      return finish(
        `When disposable income increases by <strong>₦${dy}m</strong>, household consumption rises by <strong>₦${dc}m</strong>. Find <strong>MPS</strong>.`,
        `${mps}`,
        [`${mpc}`, `${(dy / dc).toFixed(2)}`, `${(mpc / 2).toFixed(2)}`],
        `MPC = ΔC ÷ ΔY = ${dc} ÷ ${dy} = ${mpc}. Since MPC + MPS = 1, <strong>MPS = 1 − ${mpc} = ${mps}</strong>.`
      );
    }
    case 'efm-multiplier': {
      const mpc = pickOne([0.6, 0.75, 0.8, 0.9], rng);
      const k = Math.round(1 / (1 - mpc));
      const di = pickOne([10, 15, 20, 25], rng);
      const dy = Math.round((1 / (1 - mpc)) * di);
      return finish(
        `In an economy with <strong>MPC = ${mpc}</strong>, autonomous investment rises by <strong>ΔI = ₦${di}b</strong>. Find the equilibrium increase in national income <strong>ΔY</strong>.`,
        `₦${dy}b`,
        [`₦${Math.round(di / mpc)}b`, `₦${Math.round(di * mpc)}b`, `₦${dy + di}b`],
        `Multiplier <strong>k = 1 ÷ (1 − ${mpc}) = ${(1 / (1 - mpc)).toFixed(1).replace('.0', '')}</strong> (≈ ${k}). Thus <strong>ΔY = k × ΔI = ₦${dy}b</strong>.`
      );
    }
    case 'efm-qtm': {
      const m = pickOne([200, 300, 500], rng);
      const v = pickOne([4, 5, 6], rng);
      const t = pickOne([100, 150], rng);
      const p = ((m * v) / t).toFixed(0);
      return finish(
        `Using Fisher’s equation <strong>MV = PT</strong>, find the price level <strong>P</strong> when money supply <strong>M = ₦${m}b</strong>, velocity <strong>V = ${v}</strong>, and output <strong>T = ${t}b units</strong>.`,
        `₦${p}`,
        [`₦${((m * t) / v).toFixed(0)}`, `₦${(m / (v * t)).toFixed(2)}`, `₦${Number(p) + 5}`],
        `<strong>P = (M × V) ÷ T</strong> = (${m} × ${v}) ÷ ${t} = <strong>₦${p}</strong>.`
      );
    }
    case 'efm-credit': {
      const init = pickOne([20000, 50000, 100000], rng);
      const rPct = pickOne([10, 20, 25], rng);
      const mult = 100 / rPct;
      const total = init * mult;
      return finish(
        `If the statutory Cash Reserve Ratio is <strong>${rPct}%</strong>, find the maximum <strong>total deposits</strong> created from a fresh <strong>₦${init.toLocaleString()}</strong> cash deposit.`,
        `₦${total.toLocaleString()}`,
        [
          `₦${(total - init).toLocaleString()}`,
          `₦${((init * rPct) / 100).toLocaleString()}`,
          `₦${(total * 2).toLocaleString()}`,
        ],
        `Credit multiplier m = 1 ÷ ${rPct / 100} = ${mult}. <strong>D<sub>max</sub> = ${mult} × ₦${init.toLocaleString()} = ₦${total.toLocaleString()}</strong>.`
      );
    }
    case 'efm-pop-growth': {
      const p0 = 100000;
      const b = pickOne([4500, 6000], rng);
      const d = pickOne([1500, 2000], rng);
      const imm = pickOne([1200, 1800], rng);
      const em = pickOne([700, 800], rng);
      const p1 = p0 + (b - d) + (imm - em);
      return finish(
        `A city of <strong>100,000</strong> records <strong>${b}</strong> births, <strong>${d}</strong> deaths, <strong>${imm}</strong> immigrants, and <strong>${em}</strong> emigrants. Find the new population.`,
        `${p1.toLocaleString()}`,
        [
          `${(p0 + (b - d)).toLocaleString()}`,
          `${(p0 + (b + d) - (imm + em)).toLocaleString()}`,
          `${(p1 + 2000).toLocaleString()}`,
        ],
        `ΔP = (${b} − ${d}) + (${imm} − ${em}) = ${p1 - p0}. New population = <strong>${p1.toLocaleString()}</strong>.`
      );
    }
    case 'efm-dep-pci': {
      const young = pickOne([35, 42, 45], rng);
      const aged = pickOne([5, 8, 10], rng);
      const working = pickOne([50, 50, 55], rng);
      const depPct = Math.round(((young + aged) / working) * 100);
      const wrongTotalPct = Math.round(((young + aged) / (young + aged + working)) * 100);
      return finish(
        `A country has <strong>${young}m</strong> youths (0–17), <strong>${working}m</strong> working-age adults (18–60), and <strong>${aged}m</strong> elderly (60+). Find the dependency ratio (%).`,
        `${depPct}%`,
        [`${wrongTotalPct}%`, `${Math.round((young / working) * 100)}%`, `${depPct + 18}%`],
        `Dependants = ${young}m + ${aged}m = ${young + aged}m. <strong>Dependency Ratio = (${young + aged} ÷ ${working}) × 100 = ${depPct}%</strong>.`
      );
    }
    case 'efm-tot':
    default: {
      const px = pickOne([120, 135, 150, 165], rng);
      const pm = pickOne([100, 125, 150], rng);
      const tot = ((px / pm) * 100).toFixed(0);
      const inv = ((pm / px) * 100).toFixed(0);
      return finish(
        `Given an export price index of <strong>${px}</strong> and an import price index of <strong>${pm}</strong>, calculate the Commodity Terms of Trade (<strong>TOT</strong>).`,
        `${tot}`,
        [`${inv !== tot ? inv : Number(tot) + 15}`, `${px - pm}`, `${px + pm}`],
        `<strong>TOT = (Export Price Index ÷ Import Price Index) × 100</strong> = (${px} ÷ ${pm}) × 100 = <strong>${tot}</strong>.`
      );
    }
  }
}

export function buildEconFormulaDrillDeck(
  cat: EconFormulaCatId | 'all',
  targetFormulaId: string | null,
  count = 8,
  seed = 104729
): EconFormulaDrillQuestion[] {
  const rng = makeRng(seed);
  const pool = targetFormulaId
    ? ECON_FORMULAS.filter((f) => f.id === targetFormulaId)
    : cat === 'all'
      ? ECON_FORMULAS
      : ECON_FORMULAS.filter((f) => f.cat === cat);
  const activePool = pool.length > 0 ? pool : ECON_FORMULAS;

  const shuffled = [...activePool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const deck: EconFormulaDrillQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const item = shuffled[i % shuffled.length];
    const qSeed = Math.floor(rng() * 1_000_000) + i * 7919 + 17;
    deck.push(generateEconFormulaQuestion(item.id, qSeed));
  }
  return deck;
}
