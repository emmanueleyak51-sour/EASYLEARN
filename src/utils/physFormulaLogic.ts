import {
  PHYS_FORMULAS,
  type PhysFormulaCatId,
  type PhysFormulaItem,
} from '../data/physFormulas';
import { htmlToSpeakableChem } from './chemVoiceLogic';

export interface PhysFormulaDrillQuestion {
  id: string;
  formulaId: string;
  formulaName: string;
  cat: PhysFormulaCatId;
  promptHtml: string;
  hintHtml: string;
  options: string[];
  answerIdx: number;
  explanationHtml: string;
}

export function filterPhysFormulas(
  formulas: PhysFormulaItem[],
  cat: PhysFormulaCatId | 'all',
  query: string
): PhysFormulaItem[] {
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

export function getPhysFormulasForTopic(topicId: string): PhysFormulaItem[] {
  return PHYS_FORMULAS.filter((f) => f.topicId === topicId);
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

export function generatePhysFormulaQuestion(
  formulaId: string,
  seed = 202
): PhysFormulaDrillQuestion {
  const rng = makeRng(seed);
  const meta = PHYS_FORMULAS.find((f) => f.id === formulaId) || PHYS_FORMULAS[0];
  const hintHtml = `<strong>${meta.rearrangements[0].exprHtml}</strong> — ${meta.trap}`;

  const finish = (
    promptHtml: string,
    correct: string,
    wrongs: string[],
    explanationHtml: string
  ): PhysFormulaDrillQuestion => {
    const { options, answerIdx } = packChoices(correct, wrongs, rng);
    return {
      id: `pfd-${meta.id}-${seed}`,
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
    case 'pf-v-u-at': {
      const u = pickOne([0, 4, 6, 10], rng);
      const a = pickOne([2, 3, 4, 5], rng);
      const t = pickOne([4, 5, 6, 8], rng);
      const v = u + a * t;
      return finish(
        `A body starts with initial velocity <strong>${u} m s⁻¹</strong> and accelerates uniformly at <strong>${a} m s⁻²</strong> for <strong>${t} s</strong>. Find its final velocity <strong>v</strong>.`,
        `${v} m s⁻¹`,
        [`${u + a + t} m s⁻¹`, `${Math.abs(u - a * t)} m s⁻¹`, `${a * t + 5} m s⁻¹`],
        `Using <strong>v = u + at</strong>: v = ${u} + (${a} × ${t}) = <strong>${v} m s⁻¹</strong>.`
      );
    }
    case 'pf-v2-u2-2as': {
      const u = pickOne([10, 20, 30, 40], rng);
      const h = (u * u) / 20;
      return finish(
        `A stone is projected vertically upwards at <strong>${u} m s⁻¹</strong> (take g = 10 m s⁻²). Calculate the maximum height <strong>H</strong> reached.`,
        `${h} m`,
        [`${h * 2} m`, `${u} m`, `${h / 2} m`],
        `At max height v = 0, so <strong>0 = u² − 2gH</strong> ⇒ H = ${u}² ÷ 20 = <strong>${h} m</strong>.`
      );
    }
    case 'pf-projectile-range': {
      const u = pickOne([20, 30, 40, 50], rng);
      const rMax = (u * u) / 10;
      return finish(
        `A projectile is launched at <strong>${u} m s⁻¹</strong> at <strong>45°</strong> to the horizontal (g = 10 m s⁻²). What is its horizontal range?`,
        `${rMax} m`,
        [`${rMax / 2} m`, `${u * 2} m`, `${rMax * 2} m`],
        `At θ = 45°, sin 2θ = sin 90° = 1, so <strong>R = u² ÷ g</strong> = ${u}² ÷ 10 = <strong>${rMax} m</strong>.`
      );
    }
    case 'pf-newton-second': {
      const m = pickOne([4, 5, 8, 12], rng);
      const a = pickOne([2, 3, 5, 6], rng);
      const f = m * a;
      return finish(
        `Calculate the resultant force needed to give a mass of <strong>${m} kg</strong> an acceleration of <strong>${a} m s⁻²</strong>.`,
        `${f} N`,
        [`${(m / a).toFixed(1)} N`, `${m + a} N`, `${f * 2} N`],
        `By Newton’s second law <strong>F = ma</strong> = ${m} × ${a} = <strong>${f} N</strong>.`
      );
    }
    case 'pf-moments': {
      const [f1, d1, d2] = pickOne([[30, 40, 20], [50, 24, 30], [40, 30, 15], [60, 20, 40]], rng);
      const f2 = (f1 * d1) / d2;
      return finish(
        `A load of <strong>${f1} N</strong> acts <strong>${d1} cm</strong> left of a knife-edge pivot. What force at <strong>${d2} cm</strong> right of the pivot balances the beam?`,
        `${f2} N`,
        [`${f1} N`, `${f2 / 2} N`, `${f1 + d1} N`],
        `Equating moments <strong>F₁d₁ = F₂d₂</strong>: F₂ = (${f1} × ${d1}) ÷ ${d2} = <strong>${f2} N</strong>.`
      );
    }
    case 'pf-pendulum': {
      const t1 = pickOne([1.2, 1.5, 2.0], rng);
      const k = pickOne([4, 9], rng);
      const mult = Math.sqrt(k);
      const t2 = (t1 * mult).toFixed(1);
      return finish(
        `A simple pendulum of length <strong>L</strong> has period <strong>${t1.toFixed(1)} s</strong>. Find its new period when the length is increased to <strong>${k}L</strong>.`,
        `${t2} s`,
        [`${(t1 * k).toFixed(1)} s`, `${(t1 / mult).toFixed(2)} s`, `${t1.toFixed(1)} s`],
        `Since <strong>T ∝ √L</strong>, multiplying L by ${k} multiplies T by √${k} = ${mult} → <strong>${t2} s</strong>.`
      );
    }
    case 'pf-gravitation': {
      const [g, rKm, ans] = pickOne([
        [10, 6400, '11.3 km s⁻¹'],
        [4, 3200, '5.1 km s⁻¹'],
        [10, 1800, '6.0 km s⁻¹'],
      ], rng);
      return finish(
        `A planet has surface gravity <strong>g = ${g} m s⁻²</strong> and radius <strong>R = ${rKm} km</strong>. Find its escape velocity <strong>v<sub>e</sub> = √(2gR)</strong>.`,
        ans,
        ['8.0 km s⁻¹', '22.6 km s⁻¹', '3.2 km s⁻¹'],
        `Convert R = ${rKm * 1000} m and apply <strong>v<sub>e</sub> = √(2gR)</strong> = <strong>${ans}</strong>.`
      );
    }
    case 'pf-ke-pe': {
      const m = pickOne([2, 4, 6, 10], rng);
      const v = pickOne([3, 5, 6, 8], rng);
      const ke = 0.5 * m * v * v;
      return finish(
        `Calculate the kinetic energy of a <strong>${m} kg</strong> object moving at <strong>${v} m s⁻¹</strong>.`,
        `${ke} J`,
        [`${m * v * v} J`, `${m * v} J`, `${ke / 2} J`],
        `Using <strong>E<sub>k</sub> = ½mv²</strong> = 0.5 × ${m} × ${v}² = <strong>${ke} J</strong>.`
      );
    }
    case 'pf-machine-eff': {
      const [load, effF, vr] = pickOne([[400, 100, 5], [600, 200, 4], [360, 120, 4], [450, 150, 5]], rng);
      const ma = load / effF;
      const eta = Math.round((ma / vr) * 100);
      return finish(
        `A machine of velocity ratio <strong>${vr}</strong> lifts a <strong>${load} N</strong> load using an effort of <strong>${effF} N</strong>. Find its percentage efficiency.`,
        `${eta}%`,
        [`${eta - 15}%`, `${Math.min(100, eta + 15)}%`, `${ma * 10}%`],
        `MA = ${load} ÷ ${effF} = ${ma}; <strong>η = (MA ÷ VR) × 100%</strong> = (${ma} ÷ ${vr}) × 100% = <strong>${eta}%</strong>.`
      );
    }
    case 'pf-hooke-spring': {
      const k = pickOne([100, 200, 400], rng);
      const e = pickOne([0.04, 0.05, 0.1], rng);
      const en = Number((0.5 * k * e * e).toFixed(2));
      return finish(
        `A spiral spring of force constant <strong>${k} N m⁻¹</strong> is extended by <strong>${e} m</strong>. Find the elastic potential energy stored.`,
        `${en} J`,
        [`${Number((k * e * e).toFixed(2))} J`, `${Number((k * e).toFixed(1))} J`, `${Number((0.25 * k * e * e).toFixed(3))} J`],
        `Stored elastic energy <strong>E = ½ke²</strong> = 0.5 × ${k} × (${e})² = <strong>${en} J</strong>.`
      );
    }
    case 'pf-young-modulus': {
      const f = pickOne([100, 150, 200], rng);
      const l = pickOne([2, 3], rng);
      const val = ((f * l) / 100).toFixed(1);
      return finish(
        `A <strong>${l} m</strong> wire of cross-sectional area <strong>1.0 × 10⁻⁶ m²</strong> extends by <strong>1.0 × 10⁻⁴ m</strong> under a <strong>${f} N</strong> load. Find Young’s modulus.`,
        `${val} × 10¹² N m⁻²`,
        [`${val} × 10¹⁰ N m⁻²`, `${val} × 10⁸ N m⁻²`, `${f} × 10⁹ N m⁻²`],
        `<strong>E = FL ÷ (Ae)</strong> = (${f} × ${l}) ÷ (10⁻¹⁰) = <strong>${val} × 10¹² N m⁻²</strong>.`
      );
    }
    case 'pf-hydro-pressure': {
      const h = pickOne([8, 12, 20, 25], rng);
      const kpa = h * 10;
      return finish(
        `Calculate the gauge pressure due to fresh water (ρ = 1000 kg m⁻³, g = 10 m s⁻²) at a depth of <strong>${h} m</strong>.`,
        `${kpa} kPa`,
        [`${h} kPa`, `${kpa * 10} kPa`, `${kpa / 2} kPa`],
        `Using <strong>P = hρg</strong> = ${h} × 1000 × 10 = ${kpa * 1000} Pa = <strong>${kpa} kPa</strong>.`
      );
    }
    case 'pf-linear-exp': {
      const [l, dt] = pickOne([[10, 50], [20, 25], [25, 40]], rng);
      const mm = Number((1.2e-5 * l * dt * 1000).toFixed(1));
      return finish(
        `A steel bridge girder of length <strong>${l} m</strong> (α = 1.2 × 10⁻⁵ K⁻¹) experiences a <strong>${dt} °C</strong> temperature rise. Find its linear expansion Δl.`,
        `${mm} mm`,
        [`${mm * 10} mm`, `${(mm / 2).toFixed(1)} mm`, `${mm * 3} mm`],
        `Using <strong>Δl = α l₁ Δθ</strong> = 1.2 × 10⁻⁵ × ${l} × ${dt} m = <strong>${mm} mm</strong>.`
      );
    }
    case 'pf-shc': {
      const m = pickOne([0.5, 1.0, 2.0], rng);
      const dt = pickOne([10, 20, 30], rng);
      const kj = (m * 4200 * dt) / 1000;
      return finish(
        `How much thermal energy is needed to warm <strong>${m} kg</strong> of water (c = 4200 J kg⁻¹ K⁻¹) through <strong>${dt} °C</strong>?`,
        `${kj} kJ`,
        [`${kj / 2} kJ`, `${m * dt} kJ`, `${kj * 2} kJ`],
        `Using <strong>Q = mcΔθ</strong> = ${m} × 4200 × ${dt} = ${kj * 1000} J = <strong>${kj} kJ</strong>.`
      );
    }
    case 'pf-latent-heat': {
      const m = pickOne([0.1, 0.25, 0.5], rng);
      const kj = Number(((m * 3.36e5) / 1000).toFixed(1));
      return finish(
        `Calculate the heat required to completely melt <strong>${m} kg</strong> of ice at 0 °C into water at 0 °C [L<sub>f</sub> = 3.36 × 10⁵ J kg⁻¹].`,
        `${kj} kJ`,
        [`${(kj * 2).toFixed(1)} kJ`, `${(m * 4.2).toFixed(2)} kJ`, `${(kj / 10).toFixed(2)} kJ`],
        `During isothermal melting, <strong>Q = mL<sub>f</sub></strong> = ${m} × 3.36 × 10⁵ J = <strong>${kj} kJ</strong>.`
      );
    }
    case 'pf-gas-law': {
      const [v1, c1, c2] = pickOne([[300, 27, 127], [250, 27, 327], [400, 127, 227]], rng);
      const t1 = c1 + 273;
      const t2 = c2 + 273;
      const v2 = Math.round((v1 * t2) / t1);
      return finish(
        `A fixed mass of gas occupies <strong>${v1} cm³</strong> at <strong>${c1} °C</strong>. Find its volume at <strong>${c2} °C</strong> under constant pressure.`,
        `${v2} cm³`,
        [`${Math.round((v1 * c2) / c1)} cm³`, `${v1} cm³`, `${v2 + 100} cm³`],
        `Convert to Kelvin: T₁ = ${t1} K, T₂ = ${t2} K. By Charles’s law <strong>V₂ = V₁(T₂/T₁)</strong> = <strong>${v2} cm³</strong>.`
      );
    }
    case 'pf-wave-speed': {
      const [f, lam] = pickOne([[50, 6], [200, 1.7], [85, 4], [500, 0.68]], rng);
      const v = Math.round(f * lam);
      return finish(
        `A progressive wave has frequency <strong>${f} Hz</strong> and wavelength <strong>${lam} m</strong>. Find its wave speed <strong>v</strong>.`,
        `${v} m s⁻¹`,
        [`${(f / lam).toFixed(1)} m s⁻¹`, `${v / 2} m s⁻¹`, `${f + lam} m s⁻¹`],
        `Using <strong>v = fλ</strong> = ${f} × ${lam} = <strong>${v} m s⁻¹</strong>.`
      );
    }
    case 'pf-echo-sonar': {
      const [v, t] = pickOne([[340, 2], [340, 3], [1500, 0.8], [1500, 1.2]], rng);
      const d = (v * t) / 2;
      return finish(
        `An acoustic pulse returns as an echo after <strong>${t} s</strong> in a medium where wave speed is <strong>${v} m s⁻¹</strong>. Find the reflector distance <strong>d</strong>.`,
        `${d} m`,
        [`${v * t} m`, `${d / 2} m`, `${v + t} m`],
        `Because the wave travels there and back (2d), <strong>d = vt ÷ 2</strong> = (${v} × ${t}) ÷ 2 = <strong>${d} m</strong>.`
      );
    }
    case 'pf-snell-refraction': {
      const [realD, nStr, nVal] = pickOne([[2.4, '4/3', 4 / 3], [3.0, '1.5', 1.5], [1.6, '4/3', 4 / 3]], rng);
      const appD = (realD / nVal).toFixed(1);
      return finish(
        `An object lies at the bottom of a medium of refractive index <strong>${nStr}</strong> and real depth <strong>${realD} m</strong>. Find its apparent depth.`,
        `${appD} m`,
        [`${(realD * nVal).toFixed(1)} m`, `${(realD - Number(appD)).toFixed(1)} m`, `${realD.toFixed(1)} m`],
        `<strong>Apparent depth = Real depth ÷ n</strong> = ${realD} ÷ (${nStr}) = <strong>${appD} m</strong>.`
      );
    }
    case 'pf-mirror-lens': {
      const [u, f] = pickOne([[30, 10], [20, 10], [30, 15], [60, 20]], rng);
      const v = (u * f) / (u - f);
      return finish(
        `An object is placed <strong>${u} cm</strong> in front of a converging lens of focal length <strong>${f} cm</strong>. Calculate the real image distance <strong>v</strong>.`,
        `${v} cm`,
        [`${u + f} cm`, `${u - f} cm`, `${(v / 2).toFixed(1)} cm`],
        `From <strong>1/f = 1/u + 1/v</strong>: v = uf ÷ (u − f) = (${u} × ${f}) ÷ (${u} − ${f}) = <strong>${v} cm</strong>.`
      );
    }
    case 'pf-coulomb': {
      const [v, d] = pickOne([[400, 0.02], [600, 0.03], [500, 0.05]], rng);
      const e = v / d;
      return finish(
        `Two parallel plates separated by <strong>${d} m</strong> are maintained at a potential difference of <strong>${v} V</strong>. Find the electric field intensity <strong>E</strong>.`,
        `${e.toLocaleString()} V m⁻¹`,
        [`${(v * d).toFixed(1)} V m⁻¹`, `${(e / 10).toLocaleString()} V m⁻¹`, `${(e * 2).toLocaleString()} V m⁻¹`],
        `Uniform field between parallel plates: <strong>E = V ÷ d</strong> = ${v} ÷ ${d} = <strong>${e.toLocaleString()} V m⁻¹</strong>.`
      );
    }
    case 'pf-capacitors': {
      const [cUf, v] = pickOne([[10, 100], [20, 50], [4, 100], [50, 20]], rng);
      const w = Number((0.5 * cUf * 1e-6 * v * v).toFixed(3));
      return finish(
        `Calculate the electrostatic energy stored in a <strong>${cUf} μF</strong> capacitor charged to <strong>${v} V</strong>.`,
        `${w} J`,
        [`${w * 2} J`, `${Number((cUf * 1e-6 * v).toFixed(4))} J`, `${w * 10} J`],
        `Using <strong>W = ½CV²</strong> = 0.5 × (${cUf} × 10⁻⁶) × ${v}² = <strong>${w} J</strong>.`
      );
    }
    case 'pf-ohm-resistivity': {
      const [r1, r2] = pickOne([[6, 12], [4, 12], [10, 10], [20, 5]], rng);
      const req = (r1 * r2) / (r1 + r2);
      return finish(
        `Find the effective resistance of <strong>${r1} Ω</strong> and <strong>${r2} Ω</strong> resistors connected in <strong>parallel</strong>.`,
        `${req} Ω`,
        [`${r1 + r2} Ω`, `${Math.abs(r2 - r1) || 2} Ω`, `${(req / 2).toFixed(1)} Ω`],
        `For two parallel resistors, <strong>R<sub>eq</sub> = R₁R₂ ÷ (R₁ + R₂)</strong> = (${r1} × ${r2}) ÷ ${r1 + r2} = <strong>${req} Ω</strong>.`
      );
    }
    case 'pf-cell-emf': {
      const [emf, rInt, rLoad] = pickOne([[1.5, 0.5, 2.5], [2.0, 0.4, 3.6], [6.0, 1.0, 5.0]], rng);
      const i = emf / (rInt + rLoad);
      const vt = Number((i * rLoad).toFixed(2));
      return finish(
        `A cell of EMF <strong>${emf} V</strong> and internal resistance <strong>${rInt} Ω</strong> is connected to a <strong>${rLoad} Ω</strong> load. Find the terminal PD <strong>V</strong>.`,
        `${vt} V`,
        [`${emf} V`, `${Number((i * rInt).toFixed(2))} V`, `${Number((emf - rInt).toFixed(2))} V`],
        `Current I = ${emf} ÷ (${rLoad} + ${rInt}) = ${i} A; terminal PD <strong>V = IR</strong> = ${i} × ${rLoad} = <strong>${vt} V</strong>.`
      );
    }
    case 'pf-elec-power': {
      const [watts, hrs, rate] = pickOne([[2000, 3, 50], [1500, 4, 60], [1000, 5, 40]], rng);
      const kwh = (watts / 1000) * hrs;
      const cost = kwh * rate;
      return finish(
        `An appliance rated <strong>${watts} W</strong> operates for <strong>${hrs} hours</strong> at an electricity tariff of <strong>₦${rate} per kWh</strong>. Find the cost.`,
        `₦${cost}`,
        [`₦${cost * 10}`, `₦${cost / 2}`, `₦${kwh}`],
        `Energy = (${watts} ÷ 1000) × ${hrs} = ${kwh} kWh; Cost = ${kwh} × ₦${rate} = <strong>₦${cost}</strong>.`
      );
    }
    case 'pf-transformer': {
      const [vp, np, ns] = pickOne([[240, 1200, 60], [240, 800, 40], [200, 500, 1500]], rng);
      const vs = (vp * ns) / np;
      return finish(
        `An ideal transformer has <strong>N<sub>p</sub> = ${np}</strong> primary turns and <strong>N<sub>s</sub> = ${ns}</strong> secondary turns on a <strong>${vp} V</strong> AC supply. Find <strong>V<sub>s</sub></strong>.`,
        `${vs} V`,
        [`${Math.round((vp * np) / ns)} V`, `${vs * 2} V`, `${vp} V`],
        `By the turns ratio <strong>V<sub>s</sub> = V<sub>p</sub>(N<sub>s</sub> ÷ N<sub>p</sub>)</strong> = ${vp} × (${ns} ÷ ${np}) = <strong>${vs} V</strong>.`
      );
    }
    case 'pf-ac-rlc': {
      const [r, xl, xc, z] = pickOne([
        [3, 7, 3, 5],
        [8, 10, 4, 10],
        [5, 16, 4, 13],
        [6, 12, 4, 10],
      ], rng);
      return finish(
        `In a series RLC AC circuit, <strong>R = ${r} Ω</strong>, <strong>X<sub>L</sub> = ${xl} Ω</strong>, and <strong>X<sub>C</sub> = ${xc} Ω</strong>. Calculate total impedance <strong>Z</strong>.`,
        `${z} Ω`,
        [`${r + xl + xc} Ω`, `${r + xl - xc} Ω`, `${z * z} Ω`],
        `<strong>Z = √[R² + (X<sub>L</sub> − X<sub>C</sub>)²]</strong> = √(${r}² + ${xl - xc}²) = <strong>${z} Ω</strong>.`
      );
    }
    case 'pf-photoelectric': {
      const [hf, w0] = pickOne([[5.2, 2.3], [6.0, 4.2], [4.5, 2.0], [3.8, 1.9]], rng);
      const kmax = (hf - w0).toFixed(1);
      return finish(
        `Light of photon energy <strong>${hf} eV</strong> illuminates a metal surface of work function <strong>${w0} eV</strong>. Find the maximum photoelectron kinetic energy <strong>K<sub>max</sub></strong>.`,
        `${kmax} eV`,
        [`${(hf + w0).toFixed(1)} eV`, `${(hf / w0).toFixed(1)} eV`, `${w0.toFixed(1)} eV`],
        `By Einstein’s equation <strong>K<sub>max</sub> = hf − W₀</strong> = ${hf} − ${w0} = <strong>${kmax} eV</strong>.`
      );
    }
    case 'pf-half-life': {
      const [n0, th, nSteps] = pickOne([[64, 5, 3], [80, 4, 4], [120, 6, 3], [96, 10, 4]], rng);
      const t = th * nSteps;
      const rem = n0 / Math.pow(2, nSteps);
      return finish(
        `A <strong>${n0} g</strong> radioactive isotope has a half-life of <strong>${th} days</strong>. What mass remains undecayed after <strong>${t} days</strong>?`,
        `${rem} g`,
        [`${n0 - rem} g`, `${rem * 2} g`, `${n0 / nSteps} g`],
        `Number of half-lives n = ${t} ÷ ${th} = ${nSteps}; <strong>N = ${n0} × (½)<sup>${nSteps}</sup> = ${rem} g</strong>.`
      );
    }
    default: {
      const dmExp = pickOne([4, 5, 6], rng);
      const outExp = 16 - dmExp;
      return finish(
        `Calculate the nuclear energy released when a mass defect of <strong>2.0 × 10<sup>−${dmExp}</sup> kg</strong> is converted into energy [c = 3.0 × 10⁸ m s⁻¹].`,
        `1.8 × 10¹${outExp === 10 ? '⁰' : outExp === 11 ? '¹' : '²'} J`.replace('10¹10', '10¹⁰'),
        [`6.0 × 10⁸ J`, `9.0 × 10¹⁶ J`, `3.6 × 10⁹ J`],
        `Using <strong>ΔE = Δmc²</strong> = 2.0 × 10<sup>−${dmExp}</sup> × 9.0 × 10¹⁶ = <strong>1.8 × 10<sup>${outExp}</sup> J</strong>.`
      );
    }
  }
}

export function buildPhysFormulaDrillDeck(
  cat: PhysFormulaCatId | 'all',
  targetFormulaId: string | null,
  count = 8,
  baseSeed = Date.now()
): PhysFormulaDrillQuestion[] {
  const pool = targetFormulaId
    ? PHYS_FORMULAS.filter((f) => f.id === targetFormulaId)
    : cat === 'all'
      ? PHYS_FORMULAS
      : PHYS_FORMULAS.filter((f) => f.cat === cat);

  const activePool = pool.length > 0 ? pool : PHYS_FORMULAS;
  const rng = makeRng(baseSeed);
  const shuffled = [...activePool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const out: PhysFormulaDrillQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const item = shuffled[i % shuffled.length];
    const seed = (baseSeed + (i + 1) * 7919) >>> 0;
    out.push(generatePhysFormulaQuestion(item.id, seed));
  }
  return out;
}

export function extractPhysFormulaSpeechScript(
  formula: PhysFormulaItem,
  rearrIdx = 0
): string {
  const r = formula.rearrangements[rearrIdx] || formula.rearrangements[0];
  const varsText = formula.variables
    .slice(0, 2)
    .map(([sym, desc]) => `${sym} stands for ${desc}`)
    .join(', and ');
  const raw = [
    `Let's build physical intuition for ${formula.name}.`,
    formula.summary,
    `Using ${r.label}, ${r.exprHtml}${varsText ? `, notice how ${varsText}` : ''}.`,
    `Always check your SI units and signs — here is the #1 trap: ${formula.trap}`,
  ]
    .filter(Boolean)
    .join(' ');
  return htmlToSpeakableChem(raw);
}
