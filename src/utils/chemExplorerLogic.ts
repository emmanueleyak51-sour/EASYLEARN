export type ChemExplorerKind = 'gaslaw' | 'atombuild' | 'phscale' | 'gibbs' | 'equil';

/* ──────────────────────────────────────────────────────────────────────────
   1. GAS LAWS & KINETIC THEORY EXPLORER (Physical Chemistry Unit 3)
   ────────────────────────────────────────────────────────────────────────── */
export type GasLawMode = 'boyle' | 'charles' | 'ideal';
export type GasIdentity = 'H2' | 'CH4' | 'O2' | 'CO2' | 'SO2';

export interface GasLawState {
  mode: GasLawMode;
  V: number; // dm³ (1.0 .. 10.0)
  Tc: number; // °C (-73 .. 327 -> 200 K .. 600 K)
  n: number; // mol (0.5 .. 3.0)
  gas: GasIdentity;
}

export const GAS_SPECS: Record<
  GasIdentity,
  { formula: string; name: string; mr: number; color: string }
> = {
  H2: { formula: 'H₂', name: 'Hydrogen', mr: 2, color: '#8CCBFF' },
  CH4: { formula: 'CH₄', name: 'Methane', mr: 16, color: '#2BD67B' },
  O2: { formula: 'O₂', name: 'Oxygen', mr: 32, color: '#FFC531' },
  CO2: { formula: 'CO₂', name: 'Carbon(IV) oxide', mr: 44, color: '#FF9E64' },
  SO2: { formula: 'SO₂', name: 'Sulphur(IV) oxide', mr: 64, color: '#F67570' },
};

export function initGasLaw(cfg: Record<string, any> = {}): GasLawState {
  return {
    mode: cfg.mode ?? 'boyle',
    V: cfg.V ?? 4,
    Tc: cfg.Tc ?? 27,
    n: cfg.n ?? 1,
    gas: cfg.gas ?? 'O2',
  };
}

export function calcGasLaw(s: GasLawState) {
  const Tk = Math.max(100, s.Tc + 273);
  const spec = GAS_SPECS[s.gas] || GAS_SPECS.O2;
  // R = 0.08206 dm³ atm mol⁻¹ K⁻¹; in Boyle mode keep P*V = 12.0 atm·dm³ cleanly at 300 K
  let P: number;
  let V: number;
  if (s.mode === 'boyle') {
    V = s.V;
    P = 12 / V; // clean exact inverse: V=2->P=6, V=3->P=4, V=4->P=3, V=6->P=2
  } else if (s.mode === 'charles') {
    P = 1.0;
    // At 300 K (27 °C), V = 6.0 dm³ -> V = 0.02 * Tk (exact proportional: 200K->4, 300K->6, 450K->9)
    V = Number((0.02 * Tk).toFixed(2));
  } else {
    V = s.V;
    P = Number(((s.n * 0.0821 * Tk) / V).toFixed(2));
  }
  const vapourDensity = spec.mr / 2;
  // Relative diffusion rate compared to O₂ (Mr = 32): r / r(O2) = sqrt(32 / Mr)
  const relDiffusionVsO2 = Number(Math.sqrt(32 / spec.mr).toFixed(2));
  const realDeviation =
    P >= 4.5 && Tk <= 230
      ? 'High deviation (high P, low T — intermolecular attractions matter)'
      : 'Near-ideal behaviour (moderate/low P, high T)';

  return {
    P: Number(P.toFixed(2)),
    V: Number(V.toFixed(2)),
    Tk,
    PV: Number((P * V).toFixed(2)),
    VoverT: Number((V / Tk).toFixed(4)),
    vapourDensity,
    mr: spec.mr,
    formula: spec.formula,
    gasName: spec.name,
    color: spec.color,
    relDiffusionVsO2,
    realDeviation,
  };
}

export function gasLawHint(s: GasLawState): string {
  const c = calcGasLaw(s);
  if (s.mode === 'boyle') {
    return `At constant temperature (300 K), P × V stays locked at <b>${c.PV} atm·dm³</b>. Halving the volume doubles wall collisions, doubling pressure.`;
  }
  if (s.mode === 'charles') {
    return `Always convert °C to kelvin first: <b>${s.Tc} °C + 273 = ${c.Tk} K</b>. Notice V ÷ T stays constant at <b>0.020 dm³ K⁻¹</b>.`;
  }
  return `For ${c.formula}, M<sub>r</sub> = 2 × Vapour Density = 2 × ${c.vapourDensity} = <b>${c.mr}</b>. Lighter gases diffuse faster (Graham's law: ${c.relDiffusionVsO2}× O₂).`;
}

/* ──────────────────────────────────────────────────────────────────────────
   2. ATOMIC STRUCTURE, ORBITALS & PERIODICITY BUILDER Z=1..20 (Unit 4)
   ────────────────────────────────────────────────────────────────────────── */
export interface AtomBuildState {
  Z: number; // 1..20
  nDelta: number; // -1, 0, +1, +2 neutron isotope offset from standard mass
  charge: number; // -2 .. +3 ion charge
}

export interface Element20Info {
  Z: number;
  sym: string;
  name: string;
  stdN: number;
  group: string;
  family: string;
  kind: 'metal' | 'metalloid' | 'nonmetal' | 'noble';
}

export const ELEMENTS_1_TO_20: Element20Info[] = [
  { Z: 1, sym: 'H', name: 'Hydrogen', stdN: 0, group: 'I', family: 'Non-metal (unique)', kind: 'nonmetal' },
  { Z: 2, sym: 'He', name: 'Helium', stdN: 2, group: '0', family: 'Noble gas (duplet)', kind: 'noble' },
  { Z: 3, sym: 'Li', name: 'Lithium', stdN: 4, group: 'I', family: 'Alkali metal', kind: 'metal' },
  { Z: 4, sym: 'Be', name: 'Beryllium', stdN: 5, group: 'II', family: 'Alkaline-earth metal', kind: 'metal' },
  { Z: 5, sym: 'B', name: 'Boron', stdN: 6, group: 'III', family: 'Metalloid', kind: 'metalloid' },
  { Z: 6, sym: 'C', name: 'Carbon', stdN: 6, group: 'IV', family: 'Non-metal (tetravalent)', kind: 'nonmetal' },
  { Z: 7, sym: 'N', name: 'Nitrogen', stdN: 7, group: 'V', family: 'Non-metal (pnictogen)', kind: 'nonmetal' },
  { Z: 8, sym: 'O', name: 'Oxygen', stdN: 8, group: 'VI', family: 'Non-metal (chalcogen)', kind: 'nonmetal' },
  { Z: 9, sym: 'F', name: 'Fluorine', stdN: 10, group: 'VII', family: 'Halogen (most electronegative)', kind: 'nonmetal' },
  { Z: 10, sym: 'Ne', name: 'Neon', stdN: 10, group: '0', family: 'Noble gas (octet)', kind: 'noble' },
  { Z: 11, sym: 'Na', name: 'Sodium', stdN: 12, group: 'I', family: 'Alkali metal', kind: 'metal' },
  { Z: 12, sym: 'Mg', name: 'Magnesium', stdN: 12, group: 'II', family: 'Alkaline-earth metal', kind: 'metal' },
  { Z: 13, sym: 'Al', name: 'Aluminium', stdN: 14, group: 'III', family: 'Amphoteric metal', kind: 'metal' },
  { Z: 14, sym: 'Si', name: 'Silicon', stdN: 14, group: 'IV', family: 'Metalloid', kind: 'metalloid' },
  { Z: 15, sym: 'P', name: 'Phosphorus', stdN: 16, group: 'V', family: 'Non-metal', kind: 'nonmetal' },
  { Z: 16, sym: 'S', name: 'Sulphur', stdN: 16, group: 'VI', family: 'Non-metal', kind: 'nonmetal' },
  { Z: 17, sym: 'Cl', name: 'Chlorine', stdN: 18, group: 'VII', family: 'Halogen', kind: 'nonmetal' },
  { Z: 18, sym: 'Ar', name: 'Argon', stdN: 22, group: '0', family: 'Noble gas (octet)', kind: 'noble' },
  { Z: 19, sym: 'K', name: 'Potassium', stdN: 20, group: 'I', family: 'Alkali metal', kind: 'metal' },
  { Z: 20, sym: 'Ca', name: 'Calcium', stdN: 20, group: 'II', family: 'Alkaline-earth metal', kind: 'metal' },
];

export function initAtomBuild(cfg: Record<string, any> = {}): AtomBuildState {
  return {
    Z: cfg.Z ?? 11,
    nDelta: cfg.nDelta ?? 0,
    charge: cfg.charge ?? 0,
  };
}

export function calcAtomBuild(s: AtomBuildState) {
  const z = Math.max(1, Math.min(20, Math.round(s.Z)));
  const info = ELEMENTS_1_TO_20[z - 1];
  const neutrons = Math.max(0, info.stdN + s.nDelta);
  const A = z + neutrons;
  const electrons = Math.max(0, Math.min(20, z - s.charge));

  // Shells (2, 8, 8, 2) for <= 20 electrons
  const shells: number[] = [];
  let rem = electrons;
  const caps = [2, 8, 8, 2];
  for (const cap of caps) {
    if (rem <= 0) break;
    const take = Math.min(cap, rem);
    shells.push(take);
    rem -= take;
  }

  // Subshell Aufbau filling: 1s(2), 2s(2), 2p(6), 3s(2), 3p(6), 4s(2)
  const subCaps: [string, 's' | 'p', number][] = [
    ['1s', 's', 2],
    ['2s', 's', 2],
    ['2p', 'p', 6],
    ['3s', 's', 2],
    ['3p', 'p', 6],
    ['4s', 's', 2],
  ];
  let remSub = electrons;
  const subParts: string[] = [];
  let sElectrons = 0;
  let pElectrons = 0;
  for (const [label, orbType, cap] of subCaps) {
    if (remSub <= 0) break;
    const take = Math.min(cap, remSub);
    subParts.push(`${label}<sup>${take}</sup>`);
    if (orbType === 's') sElectrons += take;
    else pElectrons += take;
    remSub -= take;
  }

  // Ground-state neutral period & valence
  const neutralShells: number[] = [];
  let nRem = z;
  for (const cap of caps) {
    if (nRem <= 0) break;
    neutralShells.push(Math.min(cap, nRem));
    nRem -= Math.min(cap, nRem);
  }
  const period = neutralShells.length;
  const valence = neutralShells[neutralShells.length - 1] || 0;
  const isNobleConfig = electrons === 2 || electrons === 10 || electrons === 18;

  const chargeText =
    s.charge === 0
      ? ''
      : s.charge > 0
        ? s.charge === 1
          ? '⁺'
          : `${s.charge}⁺`
        : s.charge === -1
          ? '⁻'
          : `${Math.abs(s.charge)}⁻`;

  const bondTendency =
    info.kind === 'noble'
      ? 'Unreactive — full outer shell (Group 0)'
      : info.kind === 'metal'
        ? `Electrovalent donor — loses ${valence} e⁻ to form ${info.sym}${valence === 1 ? '⁺' : `${valence}⁺`}`
        : z === 6 || z === 14
          ? 'Covalent sharing — shares 4 valence electrons (tetravalent)'
          : `Electron acceptor / covalent sharer — needs ${8 - valence} e⁻ for octet`;

  return {
    Z: z,
    A,
    neutrons,
    electrons,
    sym: info.sym,
    name: info.name,
    group: info.group,
    period,
    valence,
    family: info.family,
    kind: info.kind,
    shells,
    shellText: shells.length ? shells.join(', ') : '0 (bare proton H⁺)',
    orbitalHtml: subParts.length ? subParts.join(' ') : '1s<sup>0</sup>',
    sElectrons,
    pElectrons,
    isNobleConfig,
    isIsotopeVariant: s.nDelta !== 0,
    nuclideHtml: `<sup>${A}</sup><sub>${z}</sub>${info.sym}${chargeText}`,
    bondTendency,
  };
}

export function atomBuildHint(s: AtomBuildState): string {
  const c = calcAtomBuild(s);
  if (s.nDelta !== 0) {
    return `Changing neutrons gives an <b>isotope</b> of ${c.name} (${c.nuclideHtml}): mass number A changes to ${c.A}, while chemical properties stay identical because Z = ${c.Z} and electrons = ${c.electrons}.`;
  }
  if (s.charge !== 0) {
    return `${c.nuclideHtml} is an <b>ion</b> (${c.electrons} e⁻ vs ${c.Z} protons). ${
      c.isNobleConfig ? 'It now has a stable noble-gas electronic structure!' : 'Adjust charge until its outer shell is full (2, 10 or 18 e⁻).'
    }`;
  }
  return `Period = ${c.period} shells; Group = ${c.group} (${c.valence} outer e⁻). Total s-orbital e⁻ = <b>${c.sElectrons}</b>, p-orbital e⁻ = <b>${c.pElectrons}</b>.`;
}

/* ──────────────────────────────────────────────────────────────────────────
   3. pH, pOH, INDICATORS, CONDUCTANCE & SALT HYDROLYSIS LAB (Unit 8)
   ────────────────────────────────────────────────────────────────────────── */
export type IndicatorKind = 'litmus' | 'methyl' | 'phenol' | 'universal';
export type PhPresetId =
  | 'custom'
  | 'hcl'
  | 'ethanoic'
  | 'nh4cl'
  | 'alcl3'
  | 'water'
  | 'ch3coona'
  | 'na2co3'
  | 'naoh';

export interface PhScaleState {
  pH: number; // 0 .. 14 (step 0.5)
  indicator: IndicatorKind;
  preset: PhPresetId;
}

export const PH_PRESETS: Record<
  Exclude<PhPresetId, 'custom'>,
  { label: string; pH: number; conductance: string; bulbLevel: 0 | 1 | 2; note: string }
> = {
  hcl: {
    label: '0.01 M HCl (strong acid)',
    pH: 2,
    conductance: 'High (bright bulb — 100% ionised)',
    bulbLevel: 2,
    note: 'Strong monobasic acid: [H₃O⁺] = 10⁻² mol dm⁻³, so pH = 2 and pOH = 12.',
  },
  alcl3: {
    label: 'AlCl₃(aq) salt hydrolysis',
    pH: 3,
    conductance: 'High (salt ions + H₃O⁺)',
    bulbLevel: 2,
    note: 'Salt of strong acid (HCl) + weak base Al(OH)₃ → hydrolyses to give an ACIDIC solution (pH < 7).',
  },
  ethanoic: {
    label: '0.1 M CH₃COOH (weak acid)',
    pH: 3,
    conductance: 'Low (dim bulb — partial ionisation)',
    bulbLevel: 1,
    note: 'Weak organic acid: low degree of dissociation gives few mobile ions and low conductance.',
  },
  nh4cl: {
    label: 'NH₄Cl(aq) salt hydrolysis',
    pH: 5,
    conductance: 'High (strong electrolyte salt)',
    bulbLevel: 2,
    note: 'NH₄Cl comes from strong acid (HCl) + weak base (NH₃) → acidic on hydrolysis (turns blue litmus red).',
  },
  water: {
    label: 'Pure H₂O / NaCl(aq)',
    pH: 7,
    conductance: 'Pure H₂O: virtually zero (NaCl(aq): high)',
    bulbLevel: 0,
    note: 'Neutral: [H₃O⁺] = [OH⁻] = 1.0 × 10⁻⁷ mol dm⁻³, so pH = 7 and pOH = 7.',
  },
  ch3coona: {
    label: 'CH₃COONa(aq) salt hydrolysis',
    pH: 9,
    conductance: 'High (strong electrolyte salt)',
    bulbLevel: 2,
    note: 'Salt of weak acid (CH₃COOH) + strong base (NaOH) → hydrolyses to give an ALKALINE solution (pH > 7).',
  },
  na2co3: {
    label: 'Na₂CO₃(aq) washing soda',
    pH: 11,
    conductance: 'High (strong electrolyte salt)',
    bulbLevel: 2,
    note: 'Trioxocarbonate(IV) of strong base NaOH + weak carbonic acid → basic solution (turns red litmus blue).',
  },
  naoh: {
    label: '0.01 M NaOH (strong alkali)',
    pH: 12,
    conductance: 'High (bright bulb — 100% dissociated)',
    bulbLevel: 2,
    note: '[OH⁻] = 10⁻² mol dm⁻³ → pOH = 2, so pH = 14 − 2 = 12.',
  },
};

export function initPhScale(cfg: Record<string, any> = {}): PhScaleState {
  const preset: PhPresetId = cfg.preset ?? 'hcl';
  const defaultPh = preset !== 'custom' ? PH_PRESETS[preset].pH : (cfg.pH ?? 7);
  return {
    pH: cfg.pH ?? defaultPh,
    indicator: cfg.indicator ?? 'methyl',
    preset,
  };
}

export function getIndicatorDisplay(indicator: IndicatorKind, pH: number): { color: string; name: string } {
  if (indicator === 'litmus') {
    if (pH < 6.5) return { color: '#EF5350', name: 'Red (acidic)' };
    if (pH > 7.5) return { color: '#42A5F5', name: 'Blue (alkaline)' };
    return { color: '#9575CD', name: 'Purple (neutral)' };
  }
  if (indicator === 'methyl') {
    if (pH < 3.2) return { color: '#EF5350', name: 'Red (acidic, pH < 3.2)' };
    if (pH <= 4.4) return { color: '#FFA726', name: 'Orange (end-point, 3.2–4.4)' };
    return { color: '#FFD54F', name: 'Yellow (pH > 4.4)' };
  }
  if (indicator === 'phenol') {
    if (pH < 8.3) return { color: '#DCE7E1', name: 'Colourless (pH < 8.3)' };
    if (pH < 10) return { color: '#F48FB1', name: 'Pale pink (end-point, 8.3–10)' };
    return { color: '#EC407A', name: 'Deep pink (alkaline, pH ≥ 10)' };
  }
  // universal
  if (pH <= 2) return { color: '#E53935', name: 'Red (strongly acidic)' };
  if (pH <= 5) return { color: '#FB8C00', name: 'Orange (weakly acidic)' };
  if (pH < 6.8) return { color: '#FDD835', name: 'Yellow (slightly acidic)' };
  if (pH <= 7.2) return { color: '#43A047', name: 'Green (neutral, pH 7)' };
  if (pH <= 10) return { color: '#1E88E5', name: 'Blue (weakly alkaline)' };
  return { color: '#7E57C2', name: 'Violet (strongly alkaline)' };
}

function fmtPow10(exp: number): string {
  if (Number.isInteger(exp)) {
    return exp === 0 ? '1.0' : `10<sup>${exp < 0 ? '−' + Math.abs(exp) : exp}</sup>`;
  }
  const val = Math.pow(10, exp);
  const e = Math.floor(Math.log10(val));
  const m = (val / Math.pow(10, e)).toFixed(1);
  return `${m} × 10<sup>${e < 0 ? '−' + Math.abs(e) : e}</sup>`;
}

export function calcPhScale(s: PhScaleState) {
  const pH = Math.max(0, Math.min(14, Number(s.pH.toFixed(1))));
  const pOH = Number((14 - pH).toFixed(1));
  const ind = getIndicatorDisplay(s.indicator, pH);
  const nature = pH < 7 ? 'Acidic (pH < 7)' : pH > 7 ? 'Alkaline / Basic (pH > 7)' : 'Neutral (pH = 7)';
  const presetMeta = s.preset !== 'custom' ? PH_PRESETS[s.preset] : null;
  const bulbLevel: 0 | 1 | 2 = presetMeta
    ? presetMeta.bulbLevel
    : pH <= 2 || pH >= 12
      ? 2
      : pH === 7
        ? 0
        : 1;
  const conductance = presetMeta
    ? presetMeta.conductance
    : bulbLevel === 2
      ? 'High (many mobile ions)'
      : bulbLevel === 1
        ? 'Moderate / Low (partial ionisation)'
        : 'Very low (10⁻⁷ M auto-ionisation)';

  return {
    pH,
    pOH,
    hConcHtml: `${fmtPow10(-pH)} mol dm⁻³`,
    ohConcHtml: `${fmtPow10(-pOH)} mol dm⁻³`,
    indicatorColor: ind.color,
    indicatorText: ind.name,
    nature,
    conductance,
    bulbLevel,
    note:
      presetMeta?.note ||
      `At 25 °C, pH + pOH = ${pH} + ${pOH} = 14. Every 1 unit drop in pH means 10× more H₃O⁺ ions.`,
  };
}

/* ──────────────────────────────────────────────────────────────────────────
   4. ENERGY PROFILE, CATALYST Ea & GIBBS SPONTANEITY (Units 11 & 12)
   ────────────────────────────────────────────────────────────────────────── */
export interface GibbsState {
  dH: number; // kJ mol⁻¹ (-100 .. +100)
  Ea: number; // uncatalysed activation energy kJ mol⁻¹ (50 .. 130)
  catalyst: boolean; // lowers Ea by 35 kJ mol⁻¹
  dS: number; // J mol⁻¹ K⁻¹ (-200 .. +200)
  T: number; // K (200 .. 1000)
}

export function initGibbs(cfg: Record<string, any> = {}): GibbsState {
  return {
    dH: cfg.dH ?? -60,
    Ea: cfg.Ea ?? 90,
    catalyst: cfg.catalyst ?? false,
    dS: cfg.dS ?? -120,
    T: cfg.T ?? 300,
  };
}

export function calcGibbs(s: GibbsState) {
  // Ensure physical validity: activation barrier from reactants must be at least max(15, dH + 15)
  const baseEa = Math.max(s.Ea, s.dH + 20, 25);
  const activeEa = s.catalyst ? Math.max(s.dH + 10, baseEa - 35) : baseEa;
  // Reverse activation energy Ea(rev) = Ea(fwd) - dH
  const revEa = activeEa - s.dH;
  // ΔG° = ΔH° - TΔS° (with ΔS° converted from J to kJ by dividing by 1000)
  const tdS = Number(((s.T * s.dS) / 1000).toFixed(1));
  const dG = Number((s.dH - tdS).toFixed(1));
  const heatType =
    s.dH < 0 ? 'Exothermic (−ΔH)' : s.dH > 0 ? 'Endothermic (+ΔH)' : 'Thermoneutral (ΔH = 0)';
  const spontaneity =
    Math.abs(dG) < 0.5
      ? 'At Equilibrium (ΔG° = 0)'
      : dG < 0
        ? 'Spontaneous / Feasible (ΔG° < 0)'
        : 'Non-spontaneous (ΔG° > 0)';

  return {
    dH: s.dH,
    baseEa,
    activeEa,
    revEa,
    tdS,
    dG,
    heatType,
    spontaneity,
    isSpontaneous: dG < -0.5,
    isEquilibrium: Math.abs(dG) <= 0.5,
  };
}

export function gibbsHint(s: GibbsState): string {
  const c = calcGibbs(s);
  if (s.catalyst) {
    return `Adding a catalyst lowers E<sub>a</sub> from <b>${c.baseEa}</b> to <b>${c.activeEa} kJ mol⁻¹</b> (faster rate!), while <b>ΔH° (${c.dH} kJ mol⁻¹)</b> and <b>ΔG° (${c.dG} kJ mol⁻¹)</b> do NOT change.`;
  }
  return `ΔG° = ΔH° − TΔS° = ${c.dH} − (${s.T} × ${s.dS / 1000}) = <b>${c.dG} kJ mol⁻¹</b> → ${c.spontaneity}.`;
}

/* ──────────────────────────────────────────────────────────────────────────
   5. LE CHATELIER DYNAMIC EQUILIBRIUM SANDBOX (Unit 13)
   ────────────────────────────────────────────────────────────────────────── */
export type EquilSystemId = 'haber' | 'no2' | 'iron';

export interface EquilState {
  sys: EquilSystemId;
  T: number; // °C (200 .. 600)
  P: number; // atm (1 .. 300)
  catalyst: boolean;
}

export const EQUIL_SYSTEMS: Record<
  EquilSystemId,
  {
    name: string;
    eqHtml: string;
    dH: number; // kJ mol⁻¹
    gasLeft: number;
    gasRight: number;
    baseTemp: number;
    basePress: number;
  }
> = {
  haber: {
    name: 'Haber Process (NH₃)',
    eqHtml: 'N₂(g) + 3H₂(g) ⇌ 2NH₃(g) &nbsp; ΔH = −92 kJ mol⁻¹',
    dH: -92,
    gasLeft: 4,
    gasRight: 2,
    baseTemp: 450,
    basePress: 200,
  },
  no2: {
    name: 'N₂O₄ / NO₂ Brown Gas',
    eqHtml: 'N₂O₄(g) [pale yellow] ⇌ 2NO₂(g) [dark brown] &nbsp; ΔH = +57 kJ mol⁻¹',
    dH: +57,
    gasLeft: 1,
    gasRight: 2,
    baseTemp: 200,
    basePress: 50,
  },
  iron: {
    name: 'Steam on Red-Hot Iron',
    eqHtml: '3Fe(s) + 4H₂O(g) ⇌ Fe₃O₄(s) + 4H₂(g) &nbsp; ΔH = −150 kJ mol⁻¹',
    dH: -150,
    gasLeft: 4,
    gasRight: 4,
    baseTemp: 400,
    basePress: 100,
  },
};

export function initEquil(cfg: Record<string, any> = {}): EquilState {
  const sys: EquilSystemId = cfg.sys ?? 'haber';
  return {
    sys,
    T: cfg.T ?? EQUIL_SYSTEMS[sys].baseTemp,
    P: cfg.P ?? EQUIL_SYSTEMS[sys].basePress,
    catalyst: cfg.catalyst ?? false,
  };
}

export function calcEquil(s: EquilState) {
  const spec = EQUIL_SYSTEMS[s.sys];
  // Compute pedagogical product yield % in [8, 94] that strictly obeys Le Chatelier's rules
  let yieldPct = 50;
  const tempDelta = (s.T - 400) / 200; // -1 .. +1
  if (spec.dH < 0) {
    // exothermic: higher T shifts LEFT (lower yield)
    yieldPct -= tempDelta * 24;
  } else {
    // endothermic: higher T shifts RIGHT (higher yield)
    yieldPct += tempDelta * 26;
  }

  const pressDelta = (s.P - 100) / 200; // -0.495 .. +1
  if (spec.gasLeft > spec.gasRight) {
    // fewer gas moles on right (Haber 4->2): higher P shifts RIGHT
    yieldPct += pressDelta * 22;
  } else if (spec.gasLeft < spec.gasRight) {
    // more gas moles on right (N2O4 1->2): higher P shifts LEFT
    yieldPct -= pressDelta * 22;
  }
  // Note: for iron + steam (4 gas -> 4 gas), pressure has ZERO effect on yieldPct!
  // Note: catalyst has ZERO effect on yieldPct or Kc (only speeds attainment of equilibrium)!

  const clampedYield = Math.max(8, Math.min(94, Math.round(yieldPct)));
  const kcChanged = s.T !== spec.baseTemp;
  const pressureEffect =
    spec.gasLeft === spec.gasRight
      ? 'No effect on position (4 moles gas on both sides; Fe & Fe₃O₄ are solids)'
      : spec.gasLeft > spec.gasRight
        ? 'High P shifts RIGHT (4 vol → 2 vol)'
        : 'High P shifts LEFT (2 vol → 1 vol)';

  return {
    spec,
    yieldPct: clampedYield,
    reactantPct: 100 - clampedYield,
    kcStatus: kcChanged
      ? `Changed (T ≠ ${spec.baseTemp} °C — only temperature alters K_c)`
      : `Constant (P & catalyst never alter K_c)`,
    pressureEffect,
    rateNote: s.catalyst
      ? 'Fast attainment (catalyst speeds forward & backward equally)'
      : 'Moderate attainment (no catalyst)',
  };
}

export function equilHint(s: EquilState): string {
  const c = calcEquil(s);
  if (s.sys === 'iron') {
    return `In 3Fe(s) + 4H₂O(g) ⇌ Fe₃O₄(s) + 4H₂(g), solids have fixed density and both sides have <b>4 volumes of gas</b>, so changing pressure leaves the yield at <b>${c.yieldPct}%</b>!`;
  }
  if (s.catalyst) {
    return `Catalyst ON: equilibrium is reached faster, yet equilibrium yield stays <b>${c.yieldPct}%</b> and K<sub>c</sub> is untouched.`;
  }
  return `${c.spec.dH < 0 ? 'Exothermic forward reaction: cooling favours products.' : 'Endothermic forward reaction: heating favours products (darker brown NO₂).'} ${c.pressureEffect}.`;
}
