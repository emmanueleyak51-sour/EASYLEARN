import {
  CHEM_FORMULAS,
  type ChemFormulaCatId,
  type ChemFormulaItem,
} from '../data/chemFormulas';
import { htmlToSpeakableChem } from './chemVoiceLogic';

export interface FormulaDrillQuestion {
  id: string;
  formulaId: string;
  formulaName: string;
  cat: ChemFormulaCatId;
  promptHtml: string;
  hintHtml: string;
  options: string[];
  answerIdx: number;
  explanationHtml: string;
}

export function filterChemFormulas(
  formulas: ChemFormulaItem[],
  cat: ChemFormulaCatId | 'all',
  query: string
): ChemFormulaItem[] {
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

export function getFormulasForTopic(topicId: string): ChemFormulaItem[] {
  return CHEM_FORMULAS.filter((f) => f.topicId === topicId);
}

/**
 *Deterministic PRNG (Mulberry32) so tests and seeded sessions are 100% reproducible.
 */
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
  // Fisher-Yates shuffle
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
 * Generates a fresh calculation or rearrangement drill question for any of the 28 Chemistry formulas.
 */
export function generateFormulaQuestion(
  formulaId: string,
  seed = 101
): FormulaDrillQuestion {
  const rng = makeRng(seed);
  const meta = CHEM_FORMULAS.find((f) => f.id === formulaId) || CHEM_FORMULAS[0];
  const hintHtml = `<strong>${meta.rearrangements[0].exprHtml}</strong> — ${meta.trap}`;

  const finish = (
    promptHtml: string,
    correct: string,
    wrongs: string[],
    explanationHtml: string
  ): FormulaDrillQuestion => {
    const { options, answerIdx } = packChoices(correct, wrongs, rng);
    return {
      id: `fd-${meta.id}-${seed}`,
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
    case 'f-mole-mass': {
      const salts: [string, number, string][] = [
        ['NaOH', 40, 'Na = 23, O = 16, H = 1'],
        ['CaCO₃', 100, 'Ca = 40, C = 12, O = 16'],
        ['Na₂CO₃', 106, 'Na = 23, C = 12, O = 16'],
        ['H₂SO₄', 98, 'H = 1, S = 32, O = 16'],
        ['O₂ gas', 32, 'O = 16'],
      ];
      const [name, M, ar] = pickOne(salts, rng);
      const n = pickOne([0.05, 0.1, 0.2, 0.25, 0.5, 1.5], rng);
      const m = Number((n * M).toFixed(2));
      return finish(
        `Calculate the amount in moles present in <strong>${m} g</strong> of <strong>${name}</strong> [${ar}].`,
        `${n.toFixed(2)} mol`,
        [
          `${(n * 2).toFixed(2)} mol`,
          `${(M / m).toFixed(2)} mol`,
          `${(n / 10).toFixed(3)} mol`,
        ],
        `Using <strong>n = m ÷ M</strong>: M(${name}) = ${M} g mol⁻¹. Therefore n = ${m} ÷ ${M} = <strong>${n.toFixed(2)} mol</strong>.`
      );
    }

    case 'f-avogadro': {
      const items: [string, string, number][] = [
        ['total ions', 'CaCl₂', 3],
        ['Cl⁻ ions', 'MgCl₂', 2],
        ['Na⁺ ions', 'Na₂SO₄', 2],
        ['O atoms', 'CO₂', 2],
      ];
      const [what, formula, iFactor] = pickOne(items, rng);
      const n = pickOne([0.1, 0.25, 0.5, 1.0], rng);
      const coeff = Number((n * iFactor * 6.02).toFixed(2));
      let exp = 23;
      let mant = coeff;
      if (mant >= 10) {
        mant = Number((mant / 10).toFixed(3));
        exp = 24;
      } else if (mant < 1) {
        mant = Number((mant * 10).toFixed(2));
        exp = 22;
      }
      const fmt = (val: number, e: number) => `${val} × 10<sup>${e}</sup>`;
      return finish(
        `How many <strong>${what}</strong> are present in <strong>${n} mol</strong> of <strong>${formula}</strong>? [L = 6.02 × 10²³ mol⁻¹]`,
        fmt(mant, exp),
        [
          fmt(Number((n * 6.02).toFixed(2)), 23),
          fmt(Number((mant / 2).toFixed(2)), exp),
          fmt(Number((mant * 2).toFixed(2)), exp),
        ],
        `Each formula unit of ${formula} yields <strong>${iFactor}</strong> ${what}. Using <strong>N = i × n × L</strong> = ${iFactor} × ${n} × 6.02 × 10²³ = <strong>${fmt(mant, exp)}</strong>.`
      );
    }

    case 'f-molar-vol': {
      const n = pickOne([0.05, 0.1, 0.25, 0.4, 0.5, 1.5], rng);
      const vDm = Number((n * 22.4).toFixed(2));
      const gas = pickOne(['CO₂', 'O₂', 'NH₃', 'H₂', 'SO₂'], rng);
      return finish(
        `What volume in dm³ does <strong>${n} mol</strong> of <strong>${gas}</strong> occupy at s.t.p.? [V<sub>m</sub> = 22.4 dm³ mol⁻¹]`,
        `${vDm} dm³`,
        [
          `${Number((n * 11.2).toFixed(2))} dm³`,
          `${Number((22.4 / n).toFixed(1))} dm³`,
          `${Number((vDm * 10).toFixed(1))} dm³`,
        ],
        `Using <strong>V = n × V<sub>m</sub></strong> at s.t.p.: V = ${n} × 22.4 = <strong>${vDm} dm³</strong>.`
      );
    }

    case 'f-pct-comp': {
      const cases: [string, string, number, number, string][] = [
        ['oxygen', 'CaCO₃', 48, 100, '3 × 16 = 48 out of Mᵣ = 100'],
        ['nitrogen', 'NH₄NO₃', 28, 80, '2 × 14 = 28 out of Mᵣ = 80'],
        ['water of crystallisation', 'CuSO₄·5H₂O', 90, 250, '5 × 18 = 90 out of Mᵣ = 250'],
        ['carbon', 'C₂H₅OH', 24, 46, '2 × 12 = 24 out of Mᵣ = 46'],
      ];
      const [el, comp, part, total, note] = pickOne(cases, rng);
      const pct = ((part / total) * 100).toFixed(1);
      return finish(
        `Calculate the percentage by mass of <strong>${el}</strong> in <strong>${comp}</strong> [M<sub>r</sub>(${comp}) = ${total}].`,
        `${pct}%`,
        [
          `${((part / (total * 2)) * 100).toFixed(1)}%`,
          `${(((total - part) / total) * 100).toFixed(1)}%`,
          `${((part / (total - part)) * 100).toFixed(1)}%`,
        ],
        `Using <strong>% Element = (k × A<sub>r</sub> ÷ M<sub>r</sub>) × 100%</strong>: (${note}) → (${part} ÷ ${total}) × 100% = <strong>${pct}%</strong>.`
      );
    }

    case 'f-yield-purity': {
      const theo = pickOne([20, 25, 40, 50, 80], rng);
      const pct = pickOne([60, 75, 80, 85, 90], rng);
      const actual = Number(((theo * pct) / 100).toFixed(1));
      return finish(
        `In a synthesis, the theoretical yield of product is <strong>${theo} g</strong>, while the actual laboratory mass collected is <strong>${actual} g</strong>. Calculate the percentage yield.`,
        `${pct}.0%`,
        [
          `${((theo / actual) * 100).toFixed(1)}%`,
          `${(100 - pct).toFixed(1)}%`,
          `${((actual / (theo + actual)) * 100).toFixed(1)}%`,
        ],
        `Using <strong>% Yield = (Actual ÷ Theoretical) × 100%</strong> = (${actual} ÷ ${theo}) × 100% = <strong>${pct}.0%</strong>.`
      );
    }

    case 'f-molarity': {
      const volCm = pickOne([100, 200, 250, 500], rng);
      const C = pickOne([0.1, 0.2, 0.4, 0.5], rng);
      const [salt, M] = pickOne<[string, number]>(
        [
          ['NaOH', 40],
          ['KOH', 56],
          ['Na₂CO₃', 106],
          ['H₂SO₄', 98],
        ],
        rng
      );
      const n = (C * volCm) / 1000;
      const mass = Number((n * M).toFixed(2));
      return finish(
        `What mass of <strong>${salt}</strong> (M = ${M} g mol⁻¹) is required to prepare <strong>${volCm} cm³</strong> of a <strong>${C} mol dm⁻³</strong> solution?`,
        `${mass} g`,
        [
          `${Number((mass * 10).toFixed(1))} g`,
          `${Number((C * M).toFixed(2))} g`,
          `${Number((mass / 2).toFixed(2))} g`,
        ],
        `Convert cm³ → dm³ first: n = (${C} × ${volCm}) ÷ 1000 = ${n.toFixed(3)} mol. Then <strong>m = n × M</strong> = ${n.toFixed(3)} × ${M} = <strong>${mass} g</strong>.`
      );
    }

    case 'f-mass-conc': {
      const [solute, M] = pickOne<[string, number]>(
        [
          ['NaOH', 40],
          ['HCl', 36.5],
          ['H₂SO₄', 98],
          ['KOH', 56],
        ],
        rng
      );
      const C = pickOne([0.05, 0.1, 0.2, 0.25, 0.5], rng);
      const rho = Number((C * M).toFixed(2));
      return finish(
        `A solution of <strong>${solute}</strong> (M = ${M} g mol⁻¹) has a mass concentration of <strong>${rho} g dm⁻³</strong>. Find its molarity.`,
        `${C.toFixed(2)} mol dm⁻³`,
        [
          `${(C * 2).toFixed(2)} mol dm⁻³`,
          `${(rho * M).toFixed(0)} mol dm⁻³`,
          `${(C / 10).toFixed(3)} mol dm⁻³`,
        ],
        `Using <strong>C = ρ ÷ M</strong> = ${rho} g dm⁻³ ÷ ${M} g mol⁻¹ = <strong>${C.toFixed(2)} mol dm⁻³</strong>.`
      );
    }

    case 'f-dilution': {
      const v1 = pickOne([20, 25, 50, 100], rng);
      const c1 = pickOne([1.0, 2.0, 4.0], rng);
      const factor = pickOne([4, 5, 8, 10], rng);
      const c2 = Number((c1 / factor).toFixed(3));
      const v2 = v1 * factor;
      const added = v2 - v1;
      return finish(
        `What volume of <strong>distilled water must be added</strong> to <strong>${v1} cm³</strong> of <strong>${c1.toFixed(1)} mol dm⁻³</strong> HCl to dilute it to <strong>${c2} mol dm⁻³</strong>?`,
        `${added} cm³`,
        [`${v2} cm³`, `${v1 * 2} cm³`, `${added + v1 * 2} cm³`],
        `By the dilution law <strong>C₁V₁ = C₂V₂</strong>: V₂ = (${c1.toFixed(1)} × ${v1}) ÷ ${c2} = ${v2} cm³ total volume. Water added = <strong>V₂ − V₁</strong> = ${v2} − ${v1} = <strong>${added} cm³</strong>.`
      );
    }

    case 'f-titration': {
      const va = pickOne([20.0, 25.0], rng);
      const vb = 25.0;
      const cb = pickOne([0.08, 0.12, 0.16, 0.2], rng);
      // H2SO4 + 2NaOH -> nA = 1, nB = 2
      const ca = Number(((cb * vb * 1) / (va * 2)).toFixed(3));
      return finish(
        `In a titration, <strong>${va.toFixed(1)} cm³</strong> of H₂SO₄ completely neutralised <strong>${vb.toFixed(1)} cm³</strong> of <strong>${cb.toFixed(2)} mol dm⁻³</strong> NaOH. Calculate the concentration of H₂SO₄.`,
        `${ca} mol dm⁻³`,
        [
          `${Number((ca * 2).toFixed(3))} mol dm⁻³`,
          `${Number((ca * 4).toFixed(3))} mol dm⁻³`,
          `${Number((ca / 2).toFixed(4))} mol dm⁻³`,
        ],
        `Equation: H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O (<strong>n<sub>A</sub> = 1, n<sub>B</sub> = 2</strong>). Using <strong>(C<sub>A</sub>V<sub>A</sub>)/(C<sub>B</sub>V<sub>B</sub>) = n<sub>A</sub>/n<sub>B</sub></strong>: C<sub>A</sub> = (${cb.toFixed(2)} × ${vb.toFixed(1)} × 1) ÷ (${va.toFixed(1)} × 2) = <strong>${ca} mol dm⁻³</strong>.`
      );
    }

    case 'f-solubility': {
      const vCm = pickOne([25, 50, 100, 200], rng);
      const S = pickOne([0.5, 1.0, 1.5, 2.0, 2.5], rng);
      const M = 101; // KNO3
      const m = Number(((S * M * vCm) / 1000).toFixed(2));
      return finish(
        `At 30 °C, <strong>${m} g</strong> of KNO₃ (M = 101 g mol⁻¹) saturates <strong>${vCm} cm³</strong> of water. Calculate its solubility in mol dm⁻³.`,
        `${S.toFixed(2)} mol dm⁻³`,
        [
          `${((m / M)).toFixed(3)} mol dm⁻³`,
          `${(S * 2).toFixed(2)} mol dm⁻³`,
          `${((m * 1000) / vCm).toFixed(1)} mol dm⁻³`,
        ],
        `Using <strong>Solubility = (m × 1000) ÷ (M × V<sub>cm³</sub>)</strong> = (${m} × 1000) ÷ (101 × ${vCm}) = <strong>${S.toFixed(2)} mol dm⁻³</strong>.`
      );
    }

    case 'f-boyle': {
      const p1 = pickOne([1.0, 1.5, 2.0, 3.0], rng);
      const v1 = pickOne([200, 300, 450, 600], rng);
      const p2 = pickOne([0.5, 2.5, 4.0, 6.0], rng);
      const v2 = Number(((p1 * v1) / p2).toFixed(1));
      return finish(
        `A fixed mass of gas occupies <strong>${v1} cm³</strong> at <strong>${p1} atm</strong>. Find its volume at <strong>${p2} atm</strong> if temperature remains constant.`,
        `${v2} cm³`,
        [
          `${Number(((p2 * v1) / p1).toFixed(1))} cm³`,
          `${Number((v2 / 2).toFixed(1))} cm³`,
          `${Number((v1 + 100).toFixed(1))} cm³`,
        ],
        `By Boyle’s Law <strong>P₁V₁ = P₂V₂</strong>: V₂ = (${p1} × ${v1}) ÷ ${p2} = <strong>${v2} cm³</strong>.`
      );
    }

    case 'f-charles': {
      const t1C = pickOne([27, 77, 127], rng);
      const t2C = pickOne([177, 227, 327], rng);
      const T1 = t1C + 273;
      const T2 = t2C + 273;
      const v1 = 300;
      const v2 = Number(((v1 * T2) / T1).toFixed(0));
      const trapCelsius = Number(((v1 * t2C) / t1C).toFixed(0));
      return finish(
        `A gas occupies <strong>${v1} cm³</strong> at <strong>${t1C} °C</strong>. What volume will it occupy at <strong>${t2C} °C</strong> at constant pressure?`,
        `${v2} cm³`,
        [`${trapCelsius} cm³`, `${Number(((v1 * T1) / T2).toFixed(0))} cm³`, `${v2 + 75} cm³`],
        `Convert to Kelvin first! T₁ = ${t1C} + 273 = ${T1} K; T₂ = ${t2C} + 273 = ${T2} K. Using <strong>V₂ = V₁T₂ ÷ T₁</strong> = (${v1} × ${T2}) ÷ ${T1} = <strong>${v2} cm³</strong>.`
      );
    }

    case 'f-general-gas': {
      const p1 = pickOne([380, 570, 760, 1140], rng);
      const v1 = 300;
      const T1 = 300; // 27 C
      const p2 = 760;
      const T2 = 273;
      const v2 = Number(((p1 * v1 * T2) / (p2 * T1)).toFixed(1));
      return finish(
        `<strong>${v1} cm³</strong> of a gas measured at <strong>27 °C</strong> and <strong>${p1} mmHg</strong> is converted to s.t.p. [760 mmHg, 273 K]. Find V₂.`,
        `${v2} cm³`,
        [
          `${Number(((p2 * v1 * T2) / (p1 * T1)).toFixed(1))} cm³`,
          `${Number(((p1 * v1) / p2).toFixed(1))} cm³`,
          `${Number((v2 + 60).toFixed(1))} cm³`,
        ],
        `T₁ = 27 + 273 = 300 K. Using <strong>V₂ = (P₁V₁T₂) ÷ (P₂T₁)</strong> = (${p1} × ${v1} × 273) ÷ (760 × 300) = <strong>${v2} cm³</strong>.`
      );
    }

    case 'f-ideal-gas': {
      const n = pickOne([0.25, 0.5, 1.0, 2.0], rng);
      const T = pickOne([300, 400], rng);
      const V = 8.21;
      const P = Number(((n * 0.0821 * T) / V).toFixed(2));
      return finish(
        `Calculate the pressure (in atm) exerted by <strong>${n} mol</strong> of an ideal gas in an <strong>8.21 dm³</strong> vessel at <strong>${T} K</strong> [R = 0.0821 atm dm³ K⁻¹ mol⁻¹].`,
        `${P.toFixed(2)} atm`,
        [
          `${(P * 2).toFixed(2)} atm`,
          `${(P / 10).toFixed(3)} atm`,
          `${((n * 8.314 * T) / V).toFixed(1)} atm`,
        ],
        `Using <strong>PV = nRT → P = nRT ÷ V</strong> = (${n} × 0.0821 × ${T}) ÷ 8.21 = <strong>${P.toFixed(2)} atm</strong>.`
      );
    }

    case 'f-vapour-density': {
      const vd = pickOne([14, 15, 22, 28, 32, 39], rng);
      const mr = vd * 2;
      return finish(
        `A gas X has a vapour density of <strong>${vd}</strong> relative to hydrogen. What is its relative molecular mass M<sub>r</sub>?`,
        `${mr}`,
        [`${vd}`, `${vd / 2}`, `${mr * 2}`],
        `Using <strong>M<sub>r</sub> = 2 × Vapour Density</strong> = 2 × ${vd} = <strong>${mr}</strong>.`
      );
    }

    case 'f-graham': {
      const pairs: [string, number, string, number, number][] = [
        ['H₂', 2, 'O₂', 32, 4],
        ['He', 4, 'SO₂', 64, 4],
        ['CH₄', 16, 'SO₂', 64, 2],
        ['He', 4, 'CH₄', 16, 2],
      ];
      const [gFast, mFast, gSlow, mSlow, ratio] = pickOne(pairs, rng);
      const tFast = pickOne([5, 8, 10, 12], rng);
      const tSlow = tFast * ratio;
      return finish(
        `50 cm³ of <strong>${gFast}</strong> (M = ${mFast}) diffuses through a porous plug in <strong>${tFast} s</strong>. How long will 50 cm³ of <strong>${gSlow}</strong> (M = ${mSlow}) take under identical conditions?`,
        `${tSlow} s`,
        [`${(tFast / ratio).toFixed(2)} s`, `${tFast * ratio * ratio} s`, `${tFast + ratio} s`],
        `By Graham’s Law for equal volumes: <strong>t₂ ÷ t₁ = √(M₂ ÷ M₁)</strong> = √(${mSlow} ÷ ${mFast}) = ${ratio}. Since heavier ${gSlow} diffuses slower, t(${gSlow}) = ${tFast} × ${ratio} = <strong>${tSlow} s</strong>.`
      );
    }

    case 'f-dalton': {
      const pTotal = pickOne([755, 760, 770, 780], rng);
      const pSvp = pickOne([18, 22, 27, 32], rng);
      const pDry = pTotal - pSvp;
      return finish(
        `Oxygen gas is collected over water at 25 °C and a barometric pressure of <strong>${pTotal} mmHg</strong>. If saturated water vapour pressure at 25 °C is <strong>${pSvp} mmHg</strong>, find the pressure of dry O₂.`,
        `${pDry} mmHg`,
        [`${pTotal + pSvp} mmHg`, `${pTotal} mmHg`, `${Math.round(pTotal / pSvp)} mmHg`],
        `By Dalton’s Law: <strong>P<sub>dry</sub> = P<sub>total</sub> − P<sub>SVP</sub></strong> = ${pTotal} − ${pSvp} = <strong>${pDry} mmHg</strong>.`
      );
    }

    case 'f-charge': {
      const amps = pickOne([2.0, 2.5, 4.0, 5.0], rng);
      const mins = pickOne([10, 20, 30, 40], rng);
      const secs = mins * 60;
      const Q = amps * secs;
      return finish(
        `Calculate the quantity of electricity in coulombs passed when a steady current of <strong>${amps.toFixed(1)} A</strong> flows for <strong>${mins} minutes</strong>.`,
        `${Q} C`,
        [`${amps * mins} C`, `${Q * 60} C`, `${Math.round(secs / amps)} C`],
        `Convert minutes to seconds first: t = ${mins} × 60 = ${secs} s. Using <strong>Q = I × t</strong> = ${amps.toFixed(1)} × ${secs} = <strong>${Q} C</strong>.`
      );
    }

    case 'f-faraday1': {
      const [metal, ion, M, z] = pickOne<[string, string, number, number]>(
        [
          ['silver', 'Ag⁺', 108, 1],
          ['copper', 'Cu²⁺', 64, 2],
          ['aluminium', 'Al³⁺', 27, 3],
        ],
        rng
      );
      const F_mult = pickOne([0.05, 0.1, 0.2, 0.3], rng);
      const Q = Math.round(F_mult * 96500);
      const m = Number(((F_mult * M) / z).toFixed(2));
      return finish(
        `What mass of <strong>${metal}</strong> (${ion}, A<sub>r</sub> = ${M}) is deposited at the cathode when <strong>${Q} C</strong> of electricity passes through the electrolyte? [1 F = 96,500 C mol⁻¹]`,
        `${m} g`,
        [
          `${Number((F_mult * M).toFixed(2))} g`,
          `${Number(((F_mult * M) / (z + 1)).toFixed(2))} g`,
          `${Number((m * z * 2).toFixed(2))} g`,
        ],
        `n(e⁻) = ${Q} ÷ 96,500 = ${F_mult} F. Since ${ion} + ${z}e⁻ → ${metal} (<strong>z = ${z}</strong>), <strong>m = (Q × M) ÷ (z × F)</strong> = (${F_mult} × ${M}) ÷ ${z} = <strong>${m} g</strong>.`
      );
    }

    case 'f-faraday2': {
      const nF = pickOne([0.1, 0.2, 0.3, 0.5], rng);
      const mAg = Number((nF * 108).toFixed(1));
      const mCu = Number(((nF / 2) * 64).toFixed(2));
      return finish(
        `AgNO₃(aq) and CuSO₄(aq) cells are connected in series. If <strong>${mAg} g of Ag</strong> (A<sub>r</sub> = 108) is deposited, what mass of <strong>Cu</strong> (A<sub>r</sub> = 64) is deposited in the second cell?`,
        `${mCu} g`,
        [
          `${Number((nF * 64).toFixed(2))} g`,
          `${Number((nF * 2 * 64).toFixed(2))} g`,
          `${Number((mAg / 2).toFixed(2))} g`,
        ],
        `n(Ag) = ${mAg} ÷ 108 = ${nF} mol (z = 1). By Faraday’s Second Law <strong>n₁z₁ = n₂z₂</strong>: n(Cu) × 2 = ${nF} × 1 → n(Cu) = ${nF / 2} mol → m(Cu) = ${nF / 2} × 64 = <strong>${mCu} g</strong>.`
      );
    }

    case 'f-cell-emf': {
      const pairs: [string, number, string, number][] = [
        ['Zn²⁺/Zn', -0.76, 'Cu²⁺/Cu', 0.34],
        ['Mg²⁺/Mg', -2.37, 'Cu²⁺/Cu', 0.34],
        ['Fe²⁺/Fe', -0.44, 'Ag⁺/Ag', 0.8],
        ['Zn²⁺/Zn', -0.76, 'Ag⁺/Ag', 0.8],
      ];
      const [anName, eAn, catName, eCat] = pickOne(pairs, rng);
      const emf = Number((eCat - eAn).toFixed(2));
      const signTrap = Number((eCat + eAn).toFixed(2));
      return finish(
        `Calculate E°<sub>cell</sub> for a galvanic cell combining <strong>${anName} (${eAn.toFixed(2)} V)</strong> and <strong>${catName} (+${eCat.toFixed(2)} V)</strong>.`,
        `+${emf.toFixed(2)} V`,
        [`${signTrap >= 0 ? '+' : ''}${signTrap.toFixed(2)} V`, `−${emf.toFixed(2)} V`, `+${(emf / 2).toFixed(2)} V`],
        `${catName} (+${eCat.toFixed(2)} V) is more positive (cathode) and ${anName} (${eAn.toFixed(2)} V) is anode. <strong>E°<sub>cell</sub> = E°<sub>cathode</sub> − E°<sub>anode</sub></strong> = (+${eCat.toFixed(2)}) − (${eAn.toFixed(2)}) = <strong>+${emf.toFixed(2)} V</strong>.`
      );
    }

    case 'f-ph': {
      const exp = pickOne([1, 2, 3, 4], rng);
      const conc = Math.pow(10, -exp);
      return finish(
        `What is the pH of a <strong>${conc} mol dm⁻³</strong> aqueous solution of HCl (monoprotic strong acid)?`,
        `pH = ${exp}.0`,
        [`pH = ${14 - exp}.0`, `pH = ${exp + 1}.0`, `pH = ${(exp / 2).toFixed(1)}`],
        `For monoprotic strong acid HCl, [H⁺] = ${conc} = 10<sup>−${exp}</sup> mol dm⁻³. Using <strong>pH = −log₁₀[H⁺]</strong> = <strong>${exp}.0</strong>.`
      );
    }

    case 'f-kw-poh': {
      const exp = pickOne([1, 2, 3, 4], rng);
      const conc = Math.pow(10, -exp);
      const ph = 14 - exp;
      return finish(
        `Calculate the <strong>pH</strong> at 25 °C of a <strong>${conc} mol dm⁻³</strong> NaOH(aq) solution.`,
        `pH = ${ph}.0`,
        [`pH = ${exp}.0`, `pH = ${14 + exp}.0`, `pH = 7.0`],
        `NaOH is a strong alkali: [OH⁻] = 10<sup>−${exp}</sup> M → pOH = ${exp}. Using <strong>pH = 14 − pOH</strong> = 14 − ${exp} = <strong>${ph}.0</strong>.`
      );
    }

    case 'f-kc': {
      const nh3 = pickOne([1.0, 2.0, 3.0], rng);
      const n2 = pickOne([0.5, 1.0], rng);
      const h2 = pickOne([1.0, 2.0], rng);
      const kc = Number(((nh3 * nh3) / (n2 * Math.pow(h2, 3))).toFixed(3));
      return finish(
        `For N₂(g) + 3H₂(g) ⇌ 2NH₃(g), equilibrium concentrations are [N₂] = ${n2} M, [H₂] = ${h2} M, and [NH₃] = ${nh3} M. Calculate K<sub>c</sub>.`,
        `${kc}`,
        [
          `${Number((nh3 / (n2 * h2)).toFixed(3))}`,
          `${Number(((n2 * Math.pow(h2, 3)) / (nh3 * nh3)).toFixed(3))}`,
          `${Number((kc * 4).toFixed(3))}`,
        ],
        `Using <strong>K<sub>c</sub> = [NH₃]² ÷ ([N₂][H₂]³)</strong> = (${nh3})² ÷ (${n2} × ${h2}³) = <strong>${kc}</strong>.`
      );
    }

    case 'f-calorimetry': {
      const dT = pickOne([5.0, 6.0, 6.5, 8.0, 10.0], rng);
      const vEach = 50; // 50 cm3 + 50 cm3 = 100 g
      const qJ = 100 * 4.2 * dT;
      const qKj = qJ / 1000;
      const n = 0.05; // 50 cm3 of 1.0 M
      const dH = Number((-qKj / n).toFixed(1));
      return finish(
        `Mixing 50 cm³ of 1.0 M HCl with 50 cm³ of 1.0 M NaOH causes a temperature rise of <strong>${dT.toFixed(1)} °C</strong>. Calculate ΔH<sub>neut</sub> [c = 4.2 J g⁻¹ K⁻¹].`,
        `${dH} kJ mol⁻¹`,
        [
          `+${Math.abs(dH)} kJ mol⁻¹`,
          `${(dH / 2).toFixed(1)} kJ mol⁻¹`,
          `−${qKj.toFixed(2)} kJ mol⁻¹`,
        ],
        `Total mass m = 50 + 50 = 100 g; q = mcΔT = 100 × 4.2 × ${dT.toFixed(1)} = ${qJ} J = ${qKj.toFixed(2)} kJ. With n = 0.050 mol and exothermic temperature rise, <strong>ΔH = −q ÷ n</strong> = <strong>${dH} kJ mol⁻¹</strong>.`
      );
    }

    case 'f-gibbs': {
      const dH = pickOne([30, 45, 60], rng);
      const dS_J = pickOne([120, 150, 200], rng); // J K-1 mol-1
      const T = pickOne([300, 400], rng);
      const dG = Number((dH - T * (dS_J / 1000)).toFixed(1));
      const trapNoDiv = dH - T * dS_J;
      return finish(
        `At <strong>${T} K</strong>, a reaction has <strong>ΔH = +${dH} kJ mol⁻¹</strong> and <strong>ΔS = +${dS_J} J K⁻¹ mol⁻¹</strong>. Calculate ΔG.`,
        `${dG > 0 ? '+' : ''}${dG} kJ mol⁻¹`,
        [
          `${trapNoDiv} kJ mol⁻¹`,
          `${dG > 0 ? '−' : '+'}${Math.abs(dG)} kJ mol⁻¹`,
          `+${(dH + T * (dS_J / 1000)).toFixed(1)} kJ mol⁻¹`,
        ],
        `Convert ΔS to kJ first: +${dS_J} J K⁻¹ mol⁻¹ = +${(dS_J / 1000).toFixed(3)} kJ K⁻¹ mol⁻¹. Using <strong>ΔG = ΔH − TΔS</strong> = ${dH} − (${T} × ${(dS_J / 1000).toFixed(3)}) = <strong>${dG > 0 ? '+' : ''}${dG} kJ mol⁻¹</strong>.`
      );
    }

    case 'f-halflife': {
      const k = pickOne([2, 3, 4], rng);
      const t12 = pickOne([5, 8, 12, 15], rng);
      const n0 = pickOne([32, 48, 64, 80, 96], rng);
      const rem = n0 / Math.pow(2, k);
      const elapsed = k * t12;
      return finish(
        `A radioisotope has a half-life of <strong>${t12} days</strong>. How much of a <strong>${n0} g</strong> sample remains undecayed after <strong>${elapsed} days</strong>?`,
        `${rem} g`,
        [`${n0 - rem} g`, `${rem * 2} g`, `${(n0 / k).toFixed(1)} g`],
        `Number of half-lives k = ${elapsed} ÷ ${t12} = ${k}. Using <strong>N = N₀ × (1/2)<sup>k</sup></strong> = ${n0} ÷ 2<sup>${k}</sup> = <strong>${rem} g</strong>.`
      );
    }

    case 'f-oxnum': {
      const species: [string, string, string[], string, string][] = [
        [
          'Cr in <strong>K₂Cr₂O₇</strong>',
          '+6',
          ['+7', '+3', '+12'],
          '2(+1) + 2x + 7(−2) = 0 → 2x − 12 = 0 → <strong>x = +6</strong>.',
          'What is the oxidation number of ',
        ],
        [
          'Mn in <strong>MnO₄⁻</strong>',
          '+7',
          ['+8', '+6', '+4'],
          'x + 4(−2) = −1 → x − 8 = −1 → <strong>x = +7</strong>.',
          'What is the oxidation number of ',
        ],
        [
          'S in <strong>Na₂S₂O₃</strong>',
          '+2',
          ['+4', '+6', '−2'],
          '2(+1) + 2x + 3(−2) = 0 → 2x − 4 = 0 → <strong>x = +2</strong>.',
          'What is the average oxidation number of ',
        ],
        [
          '<strong>iron(III) tetraoxosulphate(VI)</strong> from Fe³⁺ and SO₄²⁻',
          'Fe₂(SO₄)₃',
          ['FeSO₄', 'Fe₃(SO₄)₂', 'Fe₂SO₄'],
          'Cross over valencies (Fe = 3, SO₄ = 2): M³⁺ + X²⁻ → <strong>Fe₂(SO₄)₃</strong>.',
          'Using the cross-valency rule, what is the formula of ',
        ],
      ];
      const [sub, ok, bad, exp, prefix] = pickOne(species, rng);
      return finish(`${prefix}${sub}?`, ok, bad, exp);
    }

    case 'f-combustion': {
      const hydros: [string, string, number, number][] = [
        ['methane', 'CH₄', 1, 4],
        ['ethene', 'C₂H₄', 2, 4],
        ['propane', 'C₃H₈', 3, 8],
        ['butane', 'C₄H₁₀', 4, 10],
        ['ethyne', 'C₂H₂', 2, 2],
      ];
      const [hName, hForm, x, y] = pickOne(hydros, rng);
      const o2Moles = x + y / 4;
      const vHydro = 10;
      const vO2 = vHydro * o2Moles;
      return finish(
        `What volume of oxygen is required for the complete combustion of <strong>${vHydro} cm³</strong> of <strong>${hName} (${hForm})</strong> at constant T and P?`,
        `${vO2} cm³`,
        [`${vHydro * x} cm³`, `${vHydro * (x + y / 2)} cm³`, `${vO2 * 2} cm³`],
        `Using <strong>C<sub>x</sub>H<sub>y</sub> + (x + y/4)O₂ → xCO₂ + (y/2)H₂O</strong>: x + y/4 = ${x} + ${y}/4 = ${o2Moles}. For ${vHydro} cm³ of ${hForm}, V(O₂) = ${vHydro} × ${o2Moles} = <strong>${vO2} cm³</strong>.`
      );
    }

    case 'f-homologous':
    default: {
      const variants: [string, string, string[], string][] = [
        [
          'What is the molecular formula of the <strong>alkene</strong> with <strong>n = 4</strong> carbon atoms?',
          'C₄H₈',
          ['C₄H₁₀', 'C₄H₆', 'C₄H₉OH'],
          'Alkenes obey <strong>C<sub>n</sub>H<sub>2n</sub></strong>: for n = 4, 2(4) = 8 → <strong>C₄H₈</strong>.',
        ],
        [
          'What is the molecular formula of the <strong>alkyne</strong> with <strong>n = 3</strong> carbon atoms?',
          'C₃H₄',
          ['C₃H₆', 'C₃H₈', 'C₃H₆O'],
          'Alkynes obey <strong>C<sub>n</sub>H<sub>2n−2</sub></strong>: for n = 3, 2(3) − 2 = 4 → <strong>C₃H₄</strong> (propyne).',
        ],
        [
          'What is the molecular formula of the monohydric <strong>alkanol</strong> with <strong>n = 4</strong> carbon atoms?',
          'C₄H₉OH (C₄H₁₀O)',
          ['C₄H₈O', 'C₄H₈O₂', 'C₄H₁₀'],
          'Alkanols obey <strong>C<sub>n</sub>H<sub>2n+1</sub>OH</strong>: for n = 4 → <strong>C₄H₉OH</strong> (butanol).',
        ],
        [
          'What is the molecular formula of the saturated <strong>alkanoic acid</strong> containing <strong>n = 3</strong> carbon atoms?',
          'C₃H₆O₂ (CH₃CH₂COOH)',
          ['C₃H₈O', 'C₃H₆O', 'C₃H₄O₂'],
          'Alkanoic acids obey <strong>C<sub>n</sub>H<sub>2n</sub>O₂</strong>: for n = 3 → <strong>C₃H₆O₂</strong> (propanoic acid).',
        ],
      ];
      const [q, ok, bad, exp] = pickOne(variants, rng);
      return finish(q, ok, bad, exp);
    }
  }
}

/**
 * Builds an N-question Chemistry Formula practice deck for a category or specific formula.
 */
export function buildFormulaDrillDeck(
  cat: ChemFormulaCatId | 'all',
  targetFormulaId: string | null,
  count = 8,
  baseSeed = Date.now()
): FormulaDrillQuestion[] {
  const pool = targetFormulaId
    ? CHEM_FORMULAS.filter((f) => f.id === targetFormulaId)
    : cat === 'all'
      ? CHEM_FORMULAS
      : CHEM_FORMULAS.filter((f) => f.cat === cat);

  const activePool = pool.length > 0 ? pool : CHEM_FORMULAS;
  const rng = makeRng(baseSeed);
  const shuffled = [...activePool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const out: FormulaDrillQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const item = shuffled[i % shuffled.length];
    const seed = (baseSeed + (i + 1) * 7919) >>> 0;
    out.push(generateFormulaQuestion(item.id, seed));
  }
  return out;
}

/**
 * Builds a clean Professor Spark voice teaching script for any Chemistry formula card.
 */
export function extractFormulaSpeechScript(
  formula: ChemFormulaItem,
  rearrIdx = 0
): string {
  const r = formula.rearrangements[rearrIdx] || formula.rearrangements[0];
  const varsText = formula.variables
    .slice(0, 2)
    .map(([sym, desc]) => `${sym} represents ${desc}`)
    .join(', and ');
  const raw = [
    `Let's break down ${formula.name}.`,
    `The key relationship to picture is ${r.label}: ${r.exprHtml}.`,
    formula.summary,
    varsText ? `Notice how ${varsText}.` : '',
    `When solving problems, guard against this unit trap: ${formula.trap}`,
  ]
    .filter(Boolean)
    .join(' ');
  return htmlToSpeakableChem(raw);
}
