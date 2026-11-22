import type { LabItem } from '../types';

export type SimStatusTone = 'nominal' | 'optimal' | 'endpoint' | 'caution';

export interface LabSimSliderSpec {
  id: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}

export interface LabSimMetric {
  label: string;
  value: string;
  unit: string;
}

export interface LabSimCurvePoint {
  x: number;
  y: number;
}

export interface LabSimEvaluation {
  primaryLabel: string;
  primaryValue: string;
  primaryUnit: string;
  equationHtml: string;
  statusTone: SimStatusTone;
  statusLabel: string;
  observationNote: string;
  metrics: LabSimMetric[];
  curve: {
    xLabel: string;
    yLabel: string;
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
    points: LabSimCurvePoint[];
    currentPoint: LabSimCurvePoint;
    targetY?: number;
    targetLabel?: string;
  };
}

export interface LabSimulationSpec {
  benchTitle: string;
  instrumentTag: string;
  sliders: LabSimSliderSpec[];
  evaluate: (values: Record<string, number>) => LabSimEvaluation;
}

export interface LoggedLabTrial {
  trialNo: number;
  inputsSummary: string;
  primaryOutput: string;
  statusLabel: string;
}

function makeCurve(
  xMin: number,
  xMax: number,
  fn: (x: number) => number,
  samples = 25
): { points: LabSimCurvePoint[]; yMin: number; yMax: number } {
  const points: LabSimCurvePoint[] = [];
  let yMin = Infinity;
  let yMax = -Infinity;
  for (let i = 0; i < samples; i++) {
    const x = xMin + ((xMax - xMin) * i) / (samples - 1);
    const y = fn(x);
    if (y < yMin) yMin = y;
    if (y > yMax) yMax = y;
    points.push({ x, y });
  }
  if (Math.abs(yMax - yMin) < 1e-6) {
    yMin -= 1;
    yMax += 1;
  }
  return { points, yMin, yMax };
}

/**
 * Returns a domain-authentic interactive virtual instrument specification for any practical lab
 * across Mathematics, Chemistry, Physics, Biology, and Agricultural Science.
 */
export function getLabSimulationSpec(lab: LabItem): LabSimulationSpec {
  const id = lab.id;
  const subj = lab.subj || 'maths';

  // ═══════════════════ CHEMISTRY ADVANCED PRACTICALS ═══════════════════
  if (subj === 'chem') {
    if (id.includes('titrat') || lab.cat === 'volumetric') {
      return {
        benchTitle: 'Acid-base titration in a burette',
        instrumentTag: 'Burette and flask · ±0.05 cm³',
        sliders: [
          {
            id: 'vb',
            label: 'Acid Titre Added (V_A)',
            unit: 'cm³',
            min: 0,
            max: 40,
            step: 0.5,
            defaultValue: 22.5,
          },
          {
            id: 'ca',
            label: 'Acid Concentration (C_A)',
            unit: 'mol dm⁻³',
            min: 0.05,
            max: 0.2,
            step: 0.01,
            defaultValue: 0.1,
          },
        ],
        evaluate: (vals) => {
          const va = vals.vb ?? 22.5;
          const ca = vals.ca ?? 0.1;
          // 25.0 cm3 of 0.10 M NaOH -> moles OH- = 0.0025 mol
          const nBase = 0.1 * 0.025;
          const vEq = (nBase / ca) * 1000;
          const calcPh = (v: number) => {
            const nAcid = ca * (v / 1000);
            const vTot = (25 + v) / 1000;
            const diff = nBase - nAcid;
            if (Math.abs(diff) < 1e-5) return 7.0;
            if (diff > 0) {
              const oh = diff / vTot;
              return Math.min(13.5, 14 + Math.log10(Math.max(1e-7, oh)));
            }
            const h = -diff / vTot;
            return Math.max(1.0, -Math.log10(Math.max(1e-7, h)));
          };
          const ph = calcPh(va);
          const { points } = makeCurve(0, 40, calcPh, 33);
          const nearEq = Math.abs(va - vEq) <= 0.6;
          return {
            primaryLabel: 'Flask Solution pH',
            primaryValue: ph.toFixed(2),
            primaryUnit: 'pH',
            equationHtml: 'C<sub>A</sub>V<sub>A</sub> / C<sub>B</sub>V<sub>B</sub> = n<sub>A</sub> / n<sub>B</sub>',
            statusTone: nearEq ? 'endpoint' : va > vEq ? 'caution' : 'nominal',
            statusLabel: nearEq
              ? '◆ Endpoint reached'
              : va > vEq
                ? '▲ Past endpoint'
                : '● Before endpoint',
            observationNote: nearEq
              ? `Sharp indicator colour flip at V_A = ${va.toFixed(2)} cm³ (equivalence point ${vEq.toFixed(2)} cm³).`
              : va < vEq
                ? `Alkaline excess remains in conical flask; add ${Math.max(0, vEq - va).toFixed(2)} cm³ carefully drop by drop.`
                : `Excess acid added past equivalence (${vEq.toFixed(2)} cm³) — repeat rough run for concordant ±0.10 cm³ titres.`,
            metrics: [
              { label: 'Equivalence V_A', value: vEq.toFixed(2), unit: 'cm³' },
              { label: 'Base Pipetted', value: '25.00', unit: 'cm³' },
              { label: 'Moles H⁺ Added', value: ((ca * va) / 1000).toFixed(4), unit: 'mol' },
            ],
            curve: {
              xLabel: 'Titre V_A (cm³)',
              yLabel: 'pH',
              xMin: 0,
              xMax: 40,
              yMin: 1,
              yMax: 13.5,
              points,
              currentPoint: { x: va, y: ph },
              targetY: 7.0,
              targetLabel: 'Equivalence pH 7.0',
            },
          };
        },
      };
    }

    if (id.includes('electro') || lab.cat === 'physical') {
      return {
        benchTitle: 'Reaction speed at different temperatures',
        instrumentTag: 'Water bath and stopwatch',
        sliders: [
          {
            id: 'temp',
            label: 'Bath Temperature (T)',
            unit: '°C',
            min: 20,
            max: 70,
            step: 5,
            defaultValue: 35,
          },
          {
            id: 'conc',
            label: 'Reagent Concentration (C)',
            unit: 'mol dm⁻³',
            min: 0.1,
            max: 1.0,
            step: 0.1,
            defaultValue: 0.4,
          },
        ],
        evaluate: (vals) => {
          const temp = vals.temp ?? 35;
          const conc = vals.conc ?? 0.4;
          const rateFn = (t: number) => conc * 0.045 * Math.pow(2, (t - 20) / 10);
          const rate = rateFn(temp);
          const timeCross = Math.max(3, 1 / Math.max(0.005, rate));
          const { points, yMin, yMax } = makeCurve(20, 70, rateFn, 25);
          return {
            primaryLabel: 'Reaction Rate (1/t)',
            primaryValue: rate.toFixed(3),
            primaryUnit: 's⁻¹',
            equationHtml: 'Rate = 1 / t &nbsp;∝&nbsp; [C] · e<sup>−E<sub>a</sub>/RT</sup>',
            statusTone: temp >= 60 ? 'caution' : temp >= 35 ? 'optimal' : 'nominal',
            statusLabel:
              temp >= 60 ? '▲ Fast reaction' : temp >= 35 ? '● Steady speed' : '● Slow start',
            observationNote: `Cross obscured in ${timeCross.toFixed(1)} s at ${temp} °C — every +10 °C roughly doubles collision frequency above E_a.`,
            metrics: [
              { label: 'Disappearance t', value: timeCross.toFixed(1), unit: 's' },
              { label: 'Kelvin Temp', value: `${temp + 273}`, unit: 'K' },
              { label: 'Molarity [C]', value: conc.toFixed(2), unit: 'M' },
            ],
            curve: {
              xLabel: 'Temperature (°C)',
              yLabel: 'Rate 1/t (s⁻¹)',
              xMin: 20,
              xMax: 70,
              yMin: Math.min(0, yMin),
              yMax: Math.max(0.5, yMax * 1.08),
              points,
              currentPoint: { x: temp, y: rate },
            },
          };
        },
      };
    }

    return {
      benchTitle: 'Collecting gas in a syringe',
      instrumentTag: 'Gas syringe at room pressure',
      sliders: [
        {
          id: 'mass',
          label: 'Reactant Sample Mass (m)',
          unit: 'g',
          min: 0.5,
          max: 5.0,
          step: 0.25,
          defaultValue: 2.0,
        },
        {
          id: 'purity',
          label: 'Reagent Purity',
          unit: '%',
          min: 50,
          max: 100,
          step: 5,
          defaultValue: 85,
        },
      ],
      evaluate: (vals) => {
        const mass = vals.mass ?? 2.0;
        const purity = vals.purity ?? 85;
        // CaCO3 (M=100) -> CO2 (22,400 cm3/mol at stp)
        const volFn = (m: number) => ((m * (purity / 100)) / 100) * 22400;
        const vol = volFn(mass);
        const moles = (mass * (purity / 100)) / 100;
        const { points, yMax } = makeCurve(0.5, 5.0, volFn, 25);
        return {
          primaryLabel: 'Dry Gas Volume (s.t.p.)',
          primaryValue: vol.toFixed(0),
          primaryUnit: 'cm³',
          equationHtml: 'V = n × V<sub>m</sub> = (m<sub>pure</sub> / M<sub>r</sub>) × 22,400 cm³',
          statusTone: purity >= 85 ? 'optimal' : 'nominal',
          statusLabel: purity >= 85 ? '● High purity' : '▲ Impure sample',
          observationNote: `${mass.toFixed(2)} g at ${purity}% purity yields ${moles.toFixed(4)} mol (${vol.toFixed(0)} cm³ dry gas at s.t.p.).`,
          metrics: [
            { label: 'Pure Mass', value: ((mass * purity) / 100).toFixed(2), unit: 'g' },
            { label: 'Active Moles', value: moles.toFixed(4), unit: 'mol' },
            { label: 'Molar Vol V_m', value: '22.4', unit: 'dm³' },
          ],
          curve: {
            xLabel: 'Sample Mass (g)',
            yLabel: 'Gas Volume (cm³)',
            xMin: 0.5,
            xMax: 5.0,
            yMin: 0,
            yMax: Math.max(500, yMax * 1.05),
            points,
            currentPoint: { x: mass, y: vol },
          },
        };
      },
    };
  }

  // ═══════════════════ PHYSICS ADVANCED PRACTICALS ═══════════════════
  if (subj === 'phys') {
    if (id.includes('pendulum')) {
      return {
        benchTitle: 'Swinging pendulum timer',
        instrumentTag: 'Stopwatch · g = 9.81 m s⁻²',
        sliders: [
          {
            id: 'len',
            label: 'Thread Length (L)',
            unit: 'cm',
            min: 20,
            max: 120,
            step: 5,
            defaultValue: 80,
          },
          {
            id: 'swings',
            label: 'Oscillations Timed (N)',
            unit: 'swings',
            min: 10,
            max: 30,
            step: 5,
            defaultValue: 20,
          },
        ],
        evaluate: (vals) => {
          const lenCm = vals.len ?? 80;
          const n = vals.swings ?? 20;
          const g = 9.81;
          const tSqFn = (lCm: number) => (4 * Math.PI * Math.PI * (lCm / 100)) / g;
          const tSq = tSqFn(lenCm);
          const period = Math.sqrt(tSq);
          const totalTime = period * n;
          const { points, yMax } = makeCurve(20, 120, tSqFn, 25);
          return {
            primaryLabel: 'Period Squared (T²)',
            primaryValue: tSq.toFixed(3),
            primaryUnit: 's²',
            equationHtml: 'T = 2π√(L / g) &nbsp;⇒&nbsp; T² = (4π² / g)L',
            statusTone: n >= 20 ? 'optimal' : 'caution',
            statusLabel: n >= 20 ? '● Good timing count' : '▲ Time at least 20 swings',
            observationNote: `${n} small-angle oscillations take t = ${totalTime.toFixed(2)} s, giving T = ${period.toFixed(3)} s and slope 4π²/g = 4.02 s² m⁻¹.`,
            metrics: [
              { label: 'Stopwatch t', value: totalTime.toFixed(2), unit: 's' },
              { label: 'Period T', value: period.toFixed(3), unit: 's' },
              { label: 'Derived g', value: '9.81', unit: 'm s⁻²' },
            ],
            curve: {
              xLabel: 'Length L (cm)',
              yLabel: 'T² (s²)',
              xMin: 20,
              xMax: 120,
              yMin: 0,
              yMax: yMax * 1.05,
              points,
              currentPoint: { x: lenCm, y: tSq },
            },
          };
        },
      };
    }

    if (lab.cat === 'optics') {
      return {
        benchTitle: 'Image distance with a converging lens',
        instrumentTag: 'Light box, lens and screen · ±0.1 cm',
        sliders: [
          {
            id: 'u',
            label: 'Object Distance (u)',
            unit: 'cm',
            min: 18,
            max: 60,
            step: 2,
            defaultValue: 30,
          },
          {
            id: 'f',
            label: 'Focal Length (f)',
            unit: 'cm',
            min: 10,
            max: 15,
            step: 1,
            defaultValue: 15,
          },
        ],
        evaluate: (vals) => {
          const u = vals.u ?? 30;
          const f = vals.f ?? 15;
          const vFn = (uVal: number) => (uVal * f) / Math.max(1.5, uVal - f);
          const v = vFn(u);
          const mag = v / u;
          const { points, yMax } = makeCurve(18, 60, vFn, 25);
          const is2f = Math.abs(u - 2 * f) <= 1;
          return {
            primaryLabel: 'Real Image Distance (v)',
            primaryValue: v.toFixed(1),
            primaryUnit: 'cm',
            equationHtml: '1 / f = 1 / u + 1 / v &nbsp;⇒&nbsp; v = uf / (u − f)',
            statusTone: is2f ? 'endpoint' : 'optimal',
            statusLabel: is2f ? '◆ Equal distance (2f)' : '● Sharp image on screen',
            observationNote: `Sharp inverted real image at v = ${v.toFixed(1)} cm with linear magnification M = v/u = ${mag.toFixed(2)}×.`,
            metrics: [
              { label: 'Magnification M', value: `${mag.toFixed(2)}×`, unit: '' },
              { label: 'u + v Span', value: (u + v).toFixed(1), unit: 'cm' },
              { label: '1/u + 1/v', value: (1 / f).toFixed(3), unit: 'cm⁻¹' },
            ],
            curve: {
              xLabel: 'Object Distance u (cm)',
              yLabel: 'Image Distance v (cm)',
              xMin: 18,
              xMax: 60,
              yMin: 15,
              yMax: Math.min(110, yMax),
              points,
              currentPoint: { x: u, y: v },
            },
          };
        },
      };
    }

    if (lab.cat === 'electricity') {
      return {
        benchTitle: 'Current and voltage in a circuit',
        instrumentTag: 'Cell, resistor, ammeter and voltmeter',
        sliders: [
          {
            id: 'rload',
            label: 'Standard Load Resistance (R)',
            unit: 'Ω',
            min: 1,
            max: 15,
            step: 0.5,
            defaultValue: 5,
          },
          {
            id: 'emf',
            label: 'Cell EMF (E)',
            unit: 'V',
            min: 1.5,
            max: 6.0,
            step: 0.5,
            defaultValue: 3.0,
          },
        ],
        evaluate: (vals) => {
          const rLoad = vals.rload ?? 5;
          const emf = vals.emf ?? 3.0;
          const rInt = 0.8;
          const iFn = (r: number) => emf / (r + rInt);
          const curr = iFn(rLoad);
          const vTerm = curr * rLoad;
          const { points, yMax } = makeCurve(1, 15, (r) => iFn(r) * r, 25);
          return {
            primaryLabel: 'Terminal Potential (V)',
            primaryValue: vTerm.toFixed(2),
            primaryUnit: 'V',
            equationHtml: 'I = E / (R + r) &nbsp;·&nbsp; V = E − Ir',
            statusTone: curr > 1.8 ? 'caution' : 'optimal',
            statusLabel: curr > 1.8 ? '▲ Wire getting warm' : '● Steady current',
            observationNote: `Current I = ${curr.toFixed(3)} A with internal lost volts Ir = ${(curr * rInt).toFixed(2)} V (open key between readings to keep T constant).`,
            metrics: [
              { label: 'Current I', value: curr.toFixed(3), unit: 'A' },
              { label: 'Lost Volts Ir', value: (curr * rInt).toFixed(2), unit: 'V' },
              { label: 'Power I²R', value: (curr * curr * rLoad).toFixed(2), unit: 'W' },
            ],
            curve: {
              xLabel: 'Load Resistance R (Ω)',
              yLabel: 'Terminal V (V)',
              xMin: 1,
              xMax: 15,
              yMin: 0,
              yMax: Math.max(emf, yMax * 1.05),
              points,
              currentPoint: { x: rLoad, y: vTerm },
            },
          };
        },
      };
    }

    return {
      benchTitle: 'Stretching a spring with weights',
      instrumentTag: 'Spring, ruler and slotted weights',
      sliders: [
        {
          id: 'mass',
          label: 'Slotted Mass Load (m)',
          unit: 'g',
          min: 50,
          max: 400,
          step: 25,
          defaultValue: 150,
        },
        {
          id: 'k',
          label: 'Spring Stiffness (k)',
          unit: 'N m⁻¹',
          min: 20,
          max: 80,
          step: 10,
          defaultValue: 40,
        },
      ],
      evaluate: (vals) => {
        const massG = vals.mass ?? 150;
        const k = vals.k ?? 40;
        const extCmFn = (mG: number) => (((mG / 1000) * 9.8) / k) * 100;
        const extCm = extCmFn(massG);
        const forceN = (massG / 1000) * 9.8;
        const energyJ = 0.5 * k * Math.pow(extCm / 100, 2);
        const { points, yMax } = makeCurve(50, 400, extCmFn, 25);
        return {
          primaryLabel: 'Spring Extension (e)',
          primaryValue: extCm.toFixed(2),
          primaryUnit: 'cm',
          equationHtml: 'F = ke &nbsp;·&nbsp; W = ½ke²',
          statusTone: extCm > 16 ? 'caution' : 'optimal',
          statusLabel: extCm > 16 ? '▲ Near elastic limit' : '● Straight-line stretch',
          observationNote: `Load F = ${forceN.toFixed(2)} N produces extension e = ${extCm.toFixed(2)} cm and stores ${energyJ.toFixed(3)} J of elastic potential energy.`,
          metrics: [
            { label: 'Applied Force F', value: forceN.toFixed(2), unit: 'N' },
            { label: 'Elastic Energy', value: energyJ.toFixed(3), unit: 'J' },
            { label: 'Slope F/e', value: `${k}`, unit: 'N m⁻¹' },
          ],
          curve: {
            xLabel: 'Slotted Mass (g)',
            yLabel: 'Extension e (cm)',
            xMin: 50,
            xMax: 400,
            yMin: 0,
            yMax: yMax * 1.08,
            points,
            currentPoint: { x: massG, y: extCm },
          },
        };
      },
    };
  }

  // ═══════════════════ BIOLOGY ADVANCED PRACTICALS ═══════════════════
  if (subj === 'bio') {
    if (id.includes('osmosis')) {
      return {
        benchTitle: 'Osmosis in potato strips',
        instrumentTag: 'Sugar solutions and balance · ±0.01 g',
        sliders: [
          {
            id: 'molarity',
            label: 'External Sucrose Conc.',
            unit: 'mol dm⁻³',
            min: 0.0,
            max: 0.8,
            step: 0.05,
            defaultValue: 0.3,
          },
          {
            id: 'mins',
            label: 'Immersion Duration',
            unit: 'min',
            min: 15,
            max: 60,
            step: 5,
            defaultValue: 40,
          },
        ],
        evaluate: (vals) => {
          const m = vals.molarity ?? 0.3;
          const mins = vals.mins ?? 40;
          const scale = mins / 40;
          const pctFn = (c: number) => (0.3 - c) * 38 * scale;
          const pct = pctFn(m);
          const { points, yMin, yMax } = makeCurve(0, 0.8, pctFn, 25);
          const isotonic = Math.abs(m - 0.3) < 0.03;
          return {
            primaryLabel: '% Change in Mass',
            primaryValue: `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}`,
            primaryUnit: '%',
            equationHtml: '% Δm = [(m<sub>final</sub> − m<sub>initial</sub>) / m<sub>initial</sub>] × 100%',
            statusTone: isotonic ? 'endpoint' : pct > 0 ? 'optimal' : 'caution',
            statusLabel: isotonic
              ? '◆ No mass change (0%)'
              : pct > 0
                ? '● Strip gained water'
                : '▲ Strip lost water',
            observationNote: isotonic
              ? `Zero net water movement at 0.30 mol dm⁻³ — external sucrose matches cell sap water potential!`
              : pct > 0
                ? `Hypotonic bath: water enters vacuoles by osmosis; cylinder becomes firm and turgid.`
                : `Hypertonic bath: water leaves cell sap across selectively permeable membranes; tissue loses turgor.`,
            metrics: [
              { label: 'Initial Mass', value: '2.50', unit: 'g' },
              { label: 'Final Mass', value: (2.5 * (1 + pct / 100)).toFixed(2), unit: 'g' },
              { label: 'Isotonic C_iso', value: '0.30', unit: 'M' },
            ],
            curve: {
              xLabel: 'Sucrose Molarity (M)',
              yLabel: '% Mass Change',
              xMin: 0,
              xMax: 0.8,
              yMin: Math.min(-18, yMin),
              yMax: Math.max(14, yMax),
              points,
              currentPoint: { x: m, y: pct },
              targetY: 0,
              targetLabel: 'Isotonic 0% Line',
            },
          };
        },
      };
    }

    if (id.includes('photo') || id.includes('potometer') || lab.cat === 'physiology') {
      return {
        benchTitle: 'Enzyme and leaf bubbles in a water bath',
        instrumentTag: 'Water bath and lamp',
        sliders: [
          {
            id: 'temp',
            label: 'Incubation Temperature',
            unit: '°C',
            min: 10,
            max: 60,
            step: 2,
            defaultValue: 37,
          },
          {
            id: 'light',
            label: 'Substrate / Light Intensity',
            unit: 'klux',
            min: 2,
            max: 20,
            step: 2,
            defaultValue: 12,
          },
        ],
        evaluate: (vals) => {
          const temp = vals.temp ?? 37;
          const light = vals.light ?? 12;
          const sat = light / (light + 5);
          const rateFn = (t: number) => {
            if (t <= 37) return 48 * sat * Math.exp(-Math.pow((t - 37) / 18, 2));
            return 48 * sat * Math.exp(-Math.pow((t - 37) / 8.5, 2));
          };
          const rate = rateFn(temp);
          const { points, yMax } = makeCurve(10, 60, rateFn, 29);
          const denatured = temp >= 45;
          const opt = temp >= 35 && temp <= 39;
          return {
            primaryLabel: 'Metabolic Rate',
            primaryValue: rate.toFixed(1),
            primaryUnit: 'bubbles min⁻¹',
            equationHtml: 'v = V<sub>max</sub>[S] / (K<sub>m</sub> + [S])',
            statusTone: opt ? 'endpoint' : denatured ? 'caution' : 'nominal',
            statusLabel: opt
              ? '◆ Best temperature (~37 °C)'
              : denatured
                ? '▲ Too hot — enzyme damaged'
                : '● Warming up',
            observationNote: denatured
              ? `Above 45 °C, thermal vibration breaks hydrogen bonds and irreversibly distorts the enzyme active site.`
              : `At ${temp} °C and ${light} klux, physiological rate reaches ${rate.toFixed(1)} bubbles min⁻¹.`,
            metrics: [
              { label: 'Optimum T_opt', value: '37.0', unit: '°C' },
              { label: 'Saturation', value: `${Math.round(sat * 100)}`, unit: '%' },
              { label: 'O₂ Evolved', value: (rate * 0.04).toFixed(2), unit: 'cm³ min⁻¹' },
            ],
            curve: {
              xLabel: 'Temperature (°C)',
              yLabel: 'Rate (bubbles/min)',
              xMin: 10,
              xMax: 60,
              yMin: 0,
              yMax: Math.max(40, yMax * 1.08),
              points,
              currentPoint: { x: temp, y: rate },
            },
          };
        },
      };
    }

    return {
      benchTitle: 'Microscope magnification and quadrat count',
      instrumentTag: 'Microscope lens and ruler',
      sliders: [
        {
          id: 'obj',
          label: 'Objective Lens Power',
          unit: '×',
          min: 4,
          max: 40,
          step: 6,
          defaultValue: 10,
        },
        {
          id: 'draw',
          label: 'Drawing Length on Paper',
          unit: 'mm',
          min: 30,
          max: 120,
          step: 5,
          defaultValue: 75,
        },
      ],
      evaluate: (vals) => {
        const obj = vals.obj ?? 10;
        const drawMm = vals.draw ?? 75;
        const totalMag = obj * 10;
        const specMm = 15;
        const magFn = (d: number) => d / specMm;
        const drawMag = magFn(drawMm);
        const { points, yMax } = makeCurve(30, 120, magFn, 25);
        return {
          primaryLabel: 'Drawing Magnification',
          primaryValue: `×${drawMag.toFixed(1)}`,
          primaryUnit: '',
          equationHtml: 'Magnification = Drawing Size / Actual Specimen Size',
          statusTone: 'optimal',
          statusLabel: `● ×${totalMag} lens view`,
          observationNote: `Eyepiece (×10) × Objective (×${obj}) = ×${totalMag} optical power; biological drawing scale = ${drawMm} mm ÷ ${specMm} mm = ×${drawMag.toFixed(1)}.`,
          metrics: [
            { label: 'Optical Power', value: `×${totalMag}`, unit: '' },
            { label: 'Specimen Length', value: `${specMm}`, unit: 'mm' },
            { label: 'Field Diameter', value: (18 / obj).toFixed(2), unit: 'mm' },
          ],
          curve: {
            xLabel: 'Drawing Size (mm)',
            yLabel: 'Scale (×)',
            xMin: 30,
            xMax: 120,
            yMin: 1,
            yMax: yMax * 1.08,
            points,
            currentPoint: { x: drawMm, y: drawMag },
          },
        };
      },
    };
  }

  // ═══════════════════ AGRICULTURAL SCIENCE ADVANCED PRACTICALS ═══════════════════
  if (subj === 'agric') {
    if (id === 'a-soil-ph' || id === 'a-soil-sediment' || id === 'a-soil-porosity') {
      return {
        benchTitle: 'Testing soil pH and adding lime',
        instrumentTag: 'Soil pH meter and lime',
        sliders: [
          {
            id: 'lime',
            label: 'Agricultural Lime Rate (CaCO₃)',
            unit: 't ha⁻¹',
            min: 0,
            max: 6,
            step: 0.5,
            defaultValue: 2.5,
          },
          {
            id: 'clay',
            label: 'Clay & Humus Colloid Fraction',
            unit: '%',
            min: 10,
            max: 50,
            step: 5,
            defaultValue: 25,
          },
        ],
        evaluate: (vals) => {
          const lime = vals.lime ?? 2.5;
          const clay = vals.clay ?? 25;
          // Higher clay buffers pH shift more strongly
          const bufferFactor = 0.58 - clay * 0.005;
          const phFn = (l: number) => Math.min(7.8, 4.6 + l * bufferFactor);
          const ph = phFn(lime);
          const availP = Math.round(100 * Math.exp(-Math.pow((ph - 6.5) / 1.4, 2)));
          const { points } = makeCurve(0, 6, phFn, 25);
          const sweetSpot = ph >= 6.0 && ph <= 7.0;
          return {
            primaryLabel: 'Soil Solution pH',
            primaryValue: ph.toFixed(2),
            primaryUnit: 'pH',
            equationHtml: 'CaCO<sub>3</sub> + 2H<sup>+</sup>(soil) &nbsp;→&nbsp; Ca<sup>2+</sup> + CO<sub>2</sub>↑ + H<sub>2</sub>O',
            statusTone: sweetSpot ? 'endpoint' : ph < 5.5 ? 'caution' : 'nominal',
            statusLabel: sweetSpot
              ? '◆ Best crop pH (6.0–7.0)'
              : ph < 5.5
                ? '▲ Too acidic'
                : '● Slightly alkaline',
            observationNote: sweetSpot
              ? `At pH ${ph.toFixed(2)}, NPK availability peaks (${availP}% phosphorus unlocked) and nitrifying bacteria thrive.`
              : ph < 5.5
                ? `Strongly acidic tropical soil locks phosphorus as insoluble AlPO₄/FePO₄ — increase CaCO₃ liming rate.`
                : `Over-liming above pH 7.2 can induce iron and zinc micronutrient deficiency in maize and citrus.`,
            metrics: [
              { label: 'Available P', value: `${availP}`, unit: '%' },
              { label: 'Water Retention', value: `${Math.round(18 + clay * 0.85)}`, unit: '%' },
              { label: 'CEC Buffer', value: (clay * 0.45).toFixed(1), unit: 'cmol/kg' },
            ],
            curve: {
              xLabel: 'Lime Applied (t ha⁻¹)',
              yLabel: 'Soil pH',
              xMin: 0,
              xMax: 6,
              yMin: 4.4,
              yMax: 8.0,
              points,
              currentPoint: { x: lime, y: ph },
              targetY: 6.5,
              targetLabel: 'Target pH 6.5',
            },
          };
        },
      };
    }

    if (id === 'a-feed-ration' || lab.cat === 'livestock') {
      return {
        benchTitle: 'Mixing livestock feed (Pearson square)',
        instrumentTag: 'Feed scale · 100 kg batch',
        sliders: [
          {
            id: 'targetCp',
            label: 'Target Ration Crude Protein',
            unit: '% CP',
            min: 14,
            max: 24,
            step: 1,
            defaultValue: 20,
          },
          {
            id: 'soyCp',
            label: 'Groundnut / Soya Cake CP',
            unit: '% CP',
            min: 38,
            max: 48,
            step: 1,
            defaultValue: 44,
          },
        ],
        evaluate: (vals) => {
          const target = vals.targetCp ?? 20;
          const soy = vals.soyCp ?? 44;
          const maize = 9; // Yellow maize 9% CP
          const maizePartsFn = (t: number) => Math.max(1, soy - t);
          const soyPartsFn = (t: number) => Math.max(1, t - maize);
          const soyPctFn = (t: number) =>
            (soyPartsFn(t) / (maizePartsFn(t) + soyPartsFn(t))) * 100;
          const soyKg = soyPctFn(target);
          const maizeKg = 100 - soyKg;
          const { points, yMax } = makeCurve(14, 24, soyPctFn, 25);
          return {
            primaryLabel: 'Protein Concentrate Share',
            primaryValue: soyKg.toFixed(1),
            primaryUnit: 'kg / 100 kg',
            equationHtml: 'Cake % = [(CP<sub>target</sub> − CP<sub>maize</sub>) / (CP<sub>cake</sub> − CP<sub>maize</sub>)] × 100',
            statusTone: target >= 20 && target <= 23 ? 'endpoint' : 'optimal',
            statusLabel:
              target >= 20 && target <= 23
                ? '◆ Starter chick mix'
                : '● Grower feed mix',
            observationNote: `Blend ${maizeKg.toFixed(1)} kg yellow maize (9% CP) with ${soyKg.toFixed(1)} kg cake (${soy}% CP) to hit exact ${target}% CP.`,
            metrics: [
              { label: 'Maize (9% CP)', value: maizeKg.toFixed(1), unit: 'kg' },
              { label: 'Cake Concentrate', value: soyKg.toFixed(1), unit: 'kg' },
              { label: 'Verified CP', value: `${target}.0`, unit: '%' },
            ],
            curve: {
              xLabel: 'Target Crude Protein (%)',
              yLabel: 'Cake Inclusion (kg)',
              xMin: 14,
              xMax: 24,
              yMin: 0,
              yMax: Math.max(50, yMax * 1.1),
              points,
              currentPoint: { x: target, y: soyKg },
            },
          };
        },
      };
    }

    return {
      benchTitle: 'Fertiliser rate and seed germination',
      instrumentTag: 'Farm plot trial',
      sliders: [
        {
          id: 'nRate',
          label: 'Nitrogen (NPK / Urea) Rate',
          unit: 'kg N ha⁻¹',
          min: 0,
          max: 180,
          step: 15,
          defaultValue: 90,
        },
        {
          id: 'germ',
          label: 'Seed Germination Viability',
          unit: '%',
          min: 60,
          max: 98,
          step: 2,
          defaultValue: 90,
        },
      ],
      evaluate: (vals) => {
        const nRate = vals.nRate ?? 90;
        const germ = vals.germ ?? 90;
        const yieldFn = (n: number) =>
          (germ / 95) * (1.8 + 4.6 * (1 - Math.exp(-0.022 * n)) - 0.000045 * n * n);
        const yTons = yieldFn(nRate);
        const { points, yMax } = makeCurve(0, 180, yieldFn, 25);
        const opt = nRate >= 90 && nRate <= 135 && germ >= 85;
        return {
          primaryLabel: 'Projected Grain Yield',
          primaryValue: yTons.toFixed(2),
          primaryUnit: 't ha⁻¹',
          equationHtml: 'Germination % = (Viable Seeds / Total Tested) × 100% &nbsp;·&nbsp; Required Rate = Base / Germ',
          statusTone: opt ? 'endpoint' : germ < 75 ? 'caution' : 'nominal',
          statusLabel: opt
            ? '◆ Best harvest yield'
            : germ < 75
              ? '▲ Low germination'
              : '● Growing plot',
          observationNote: `At ${nRate} kg N ha⁻¹ and ${germ}% viability, maize plot yields ${yTons.toFixed(2)} t ha⁻¹ (adjust seed rate by ×${(100 / germ).toFixed(2)} to avoid gappy stands).`,
          metrics: [
            { label: 'Grain Yield', value: yTons.toFixed(2), unit: 't ha⁻¹' },
            { label: 'Seed Multiplier', value: `×${(100 / germ).toFixed(2)}`, unit: '' },
            { label: 'Plant Stand', value: `${Math.round(53333 * (germ / 100)).toLocaleString()}`, unit: 'ha⁻¹' },
          ],
          curve: {
            xLabel: 'Nitrogen Rate (kg N ha⁻¹)',
            yLabel: 'Grain Yield (t ha⁻¹)',
            xMin: 0,
            xMax: 180,
            yMin: 1,
            yMax: Math.max(6.5, yMax * 1.06),
            points,
            currentPoint: { x: nRate, y: yTons },
          },
        };
      },
    };
  }

  // ═══════════════════ MATHEMATICS GEOMETRIC & GRAPHICAL LABS ═══════════════════
  return {
    benchTitle: 'Compass and protractor measurements',
    instrumentTag: 'Ruler, compasses and protractor · ±0.1°',
    sliders: [
      {
        id: 'radius',
        label: 'Base Length / Circle Radius (r)',
        unit: 'cm',
        min: 3,
        max: 12,
        step: 0.5,
        defaultValue: 7.0,
      },
      {
        id: 'angle',
        label: 'Constructed Angle (θ)',
        unit: '°',
        min: 30,
        max: 150,
        step: 15,
        defaultValue: 60,
      },
    ],
    evaluate: (vals) => {
      const r = vals.radius ?? 7.0;
      const deg = vals.angle ?? 60;
      const rad = (deg * Math.PI) / 180;
      const chordFn = (aDeg: number) => 2 * r * Math.sin(((aDeg / 2) * Math.PI) / 180);
      const chord = chordFn(deg);
      const arc = (deg / 360) * 2 * Math.PI * r;
      const sectorArea = (deg / 360) * Math.PI * r * r;
      const { points, yMax } = makeCurve(30, 150, chordFn, 25);
      const compassExact = deg % 15 === 0;
      return {
        primaryLabel: 'Subtended Chord |AB|',
        primaryValue: chord.toFixed(2),
        primaryUnit: 'cm',
        equationHtml: '|AB| = 2r sin(θ / 2) &nbsp;·&nbsp; L = (θ / 360°) × 2πr',
        statusTone: compassExact ? 'endpoint' : 'nominal',
        statusLabel: compassExact ? '◆ Compass angle' : '● Protractor check',
        observationNote: `For r = ${r.toFixed(1)} cm and θ = ${deg}°, chord |AB| = ${chord.toFixed(2)} cm, arc length L = ${arc.toFixed(2)} cm, and sector area = ${sectorArea.toFixed(2)} cm².`,
        metrics: [
          { label: 'Arc Length L', value: arc.toFixed(2), unit: 'cm' },
          { label: 'Sector Area', value: sectorArea.toFixed(2), unit: 'cm²' },
          { label: 'sin(θ/2)', value: Math.sin(rad / 2).toFixed(3), unit: '' },
        ],
        curve: {
          xLabel: 'Constructed Angle θ (°)',
          yLabel: 'Chord Length (cm)',
          xMin: 30,
          xMax: 150,
          yMin: 0,
          yMax: Math.max(10, yMax * 1.06),
          points,
          currentPoint: { x: deg, y: chord },
        },
      };
    },
  };
}

export function formatLabTrialRow(
  trialNo: number,
  spec: LabSimulationSpec,
  values: Record<string, number>,
  evalResult: LabSimEvaluation
): LoggedLabTrial {
  const inputsSummary = spec.sliders
    .map((s) => `${s.id.toUpperCase()}: ${values[s.id] ?? s.defaultValue}${s.unit ? ` ${s.unit}` : ''}`)
    .join(' · ');
  const primaryOutput = `${evalResult.primaryValue}${evalResult.primaryUnit ? ` ${evalResult.primaryUnit}` : ''}`;
  return {
    trialNo,
    inputsSummary,
    primaryOutput,
    statusLabel: evalResult.statusLabel.replace(/^[●◆▲]\s*/, ''),
  };
}
