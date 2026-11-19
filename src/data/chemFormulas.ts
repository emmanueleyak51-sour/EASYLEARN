export type ChemFormulaCatId =
  | 'mole'
  | 'solutions'
  | 'gases'
  | 'electro'
  | 'equil'
  | 'thermo'
  | 'organic';

export interface ChemFormulaCategory {
  id: ChemFormulaCatId | 'all';
  label: string;
  shortLabel: string;
  desc: string;
}

export interface FormulaRearrangement {
  solveFor: string;
  label: string;
  exprHtml: string;
  note?: string;
}

export interface ChemFormulaItem {
  id: string;
  cat: ChemFormulaCatId;
  name: string;
  topicId: string;
  summary: string;
  rearrangements: FormulaRearrangement[];
  variables: [string, string][];
  constants?: string[];
  trap: string;
  worked: {
    qHtml: string;
    stepsHtml: string[];
    ansHtml: string;
  };
  keywords: string[];
}

export const CHEM_FORMULA_CATEGORIES: ChemFormulaCategory[] = [
  {
    id: 'all',
    label: 'All Chemistry Formulas',
    shortLabel: 'All',
    desc: 'Every calculation equation, gas law, Faraday relation, pH rule & homologous formula',
  },
  {
    id: 'mole',
    label: 'Mole, Mass & Composition',
    shortLabel: 'Mole & Mass',
    desc: 'Moles, Avogadro constant, molar gas volume, % composition, empirical formula & % yield',
  },
  {
    id: 'solutions',
    label: 'Solutions, Dilution & Titration',
    shortLabel: 'Solutions & Titration',
    desc: 'Molarity, mass concentration, dilution law, acid–base titration & solubility',
  },
  {
    id: 'gases',
    label: 'Gas Laws, Vapour Density & Diffusion',
    shortLabel: 'Gas Laws',
    desc: 'Boyle, Charles, General & Ideal gas equations, vapour density, Graham & Dalton laws',
  },
  {
    id: 'electro',
    label: 'Electrolysis & Cell Potential',
    shortLabel: 'Electrolysis',
    desc: 'Quantity of charge, Faraday’s 1st & 2nd laws, and standard electrode cell EMF',
  },
  {
    id: 'equil',
    label: 'Acids, pH & Equilibrium',
    shortLabel: 'pH & Equilibrium',
    desc: 'Sørensen pH, water ionic product Kw, pOH, and equilibrium constant Kc',
  },
  {
    id: 'thermo',
    label: 'Energetics, Rates & Radioactivity',
    shortLabel: 'Thermo & Nuclear',
    desc: 'Calorimetry q = mcΔT, molar enthalpy, Gibbs ΔG = ΔH − TΔS, reaction rate & half-life',
  },
  {
    id: 'organic',
    label: 'Chemical & Homologous Formulas',
    shortLabel: 'Organic & Valency',
    desc: 'Ionic valency cross-over, alkanes/alkenes/alkynes/alkanols/acids & hydrocarbon combustion',
  },
];

export const CHEM_FORMULAS: ChemFormulaItem[] = [
  /* ─────────────── 1. MOLE, MASS & COMPOSITION ─────────────── */
  {
    id: 'f-mole-mass',
    cat: 'mole',
    name: 'Amount of Substance (Mole–Mass Relation)',
    topicId: 'c-mole',
    summary: 'Links chemical amount in moles to weighed laboratory mass and molar mass.',
    rearrangements: [
      { solveFor: 'n', label: 'Solve for moles (n)', exprHtml: 'n = m ÷ M' },
      { solveFor: 'm', label: 'Solve for mass (m)', exprHtml: 'm = n × M' },
      { solveFor: 'M', label: 'Solve for molar mass (M)', exprHtml: 'M = m ÷ n' },
    ],
    variables: [
      ['n', 'Amount of substance (mol)'],
      ['m', 'Reacting or weighed mass (g)'],
      ['M', 'Molar mass (g mol⁻¹)'],
    ],
    trap: 'Diatomic elements (O₂, H₂, N₂, Cl₂, Br₂, I₂) have M = 2 × Aᵣ — e.g. M(O₂) = 32 g mol⁻¹, not 16!',
    worked: {
      qHtml: 'Find the amount in moles of 10.6 g of anhydrous Na₂CO₃ [Na = 23, C = 12, O = 16].',
      stepsHtml: [
        'M(Na₂CO₃) = (2 × 23) + 12 + (3 × 16) = 46 + 12 + 48 = 106 g mol⁻¹',
        'n = m ÷ M = 10.6 ÷ 106 = 0.10 mol',
      ],
      ansHtml: '0.10 mol',
    },
    keywords: ['mole', 'mass', 'molar mass', 'stoichiometry', 'grams'],
  },
  {
    id: 'f-avogadro',
    cat: 'mole',
    name: 'Avogadro’s Particle Formula',
    topicId: 'c-mole',
    summary: 'Converts moles into exact numbers of atoms, molecules, ions, or electrons.',
    rearrangements: [
      { solveFor: 'N', label: 'Solve for particles (N)', exprHtml: 'N = n × L' },
      { solveFor: 'n', label: 'Solve for moles (n)', exprHtml: 'n = N ÷ L' },
      { solveFor: 'N_ions', label: 'Solve for total ions', exprHtml: 'N<sub>ions</sub> = i × n × L' },
    ],
    variables: [
      ['N', 'Number of specified particles (atoms, molecules, or ions)'],
      ['n', 'Amount of substance (mol)'],
      ['i', 'Ions/atoms per formula unit (e.g. i = 3 for CaCl₂ → Ca²⁺ + 2Cl⁻)'],
    ],
    constants: ['L = 6.02 × 10²³ mol⁻¹ (Avogadro’s constant)'],
    trap: 'Read whether the question asks for MOLECULES or ATOMS/IONS! 1 mol of H₂SO₄ has L molecules, 2L H atoms, and 7L total atoms.',
    worked: {
      qHtml: 'How many chloride ions (Cl⁻) are in 0.25 mol of MgCl₂? [L = 6.02 × 10²³ mol⁻¹]',
      stepsHtml: [
        'Each MgCl₂ unit dissociates into 1 Mg²⁺ and 2 Cl⁻ ions (i = 2 for Cl⁻)',
        'n(Cl⁻) = 2 × 0.25 = 0.50 mol',
        'N(Cl⁻) = 0.50 × 6.02 × 10²³ = 3.01 × 10²³ ions',
      ],
      ansHtml: '3.01 × 10²³ Cl⁻ ions',
    },
    keywords: ['avogadro', 'particles', 'atoms', 'molecules', 'ions', '6.02'],
  },
  {
    id: 'f-molar-vol',
    cat: 'mole',
    name: 'Molar Gas Volume at s.t.p.',
    topicId: 'c-mole',
    summary: 'One mole of any ideal gas occupies 22.4 dm³ (22,400 cm³) at standard temperature and pressure.',
    rearrangements: [
      { solveFor: 'n', label: 'Solve for gas moles (n)', exprHtml: 'n = V ÷ V<sub>m</sub>' },
      { solveFor: 'V', label: 'Solve for gas volume (V)', exprHtml: 'V = n × V<sub>m</sub>' },
    ],
    variables: [
      ['n', 'Amount of gas (mol)'],
      ['V', 'Gas volume at s.t.p. (dm³ or cm³)'],
      ['Vₘ', 'Molar volume = 22.4 dm³ mol⁻¹ or 22,400 cm³ mol⁻¹ at s.t.p.'],
    ],
    constants: ['s.t.p. = 273 K (0 °C) and 1 atm (101.3 kPa / 760 mmHg)'],
    trap: 'Never mix cm³ with 22.4 dm³! Either divide cm³ by 22,400 or convert V to dm³ first (÷ 1000).',
    worked: {
      qHtml: 'What volume of CO₂ at s.t.p. is liberated when 5.0 g of CaCO₃ reacts with excess HCl? [CaCO₃ = 100]',
      stepsHtml: [
        'CaCO₃(s) + 2HCl(aq) → CaCl₂(aq) + H₂O(l) + CO₂(g) (1 : 1 mole ratio)',
        'n(CaCO₃) = 5.0 ÷ 100 = 0.050 mol = n(CO₂)',
        'V(CO₂) = 0.050 × 22.4 = 1.12 dm³ (or 1,120 cm³)',
      ],
      ansHtml: '1.12 dm³',
    },
    keywords: ['molar volume', 'stp', '22.4', 'gas volume'],
  },
  {
    id: 'f-pct-comp',
    cat: 'mole',
    name: 'Percentage Composition & Molecular Formula',
    topicId: 'c-mole',
    summary: 'Finds the mass percentage of an element in a compound and scales empirical formula to molecular formula.',
    rearrangements: [
      {
        solveFor: '%E',
        label: '% by mass of element',
        exprHtml: '% Element = (k × A<sub>r</sub> ÷ M<sub>r</sub>) × 100%',
      },
      {
        solveFor: 'n',
        label: 'Molecular multiplier (n)',
        exprHtml: 'n = M<sub>r</sub> ÷ M<sub>empirical</sub>',
      },
    ],
    variables: [
      ['k', 'Number of atoms of the element in one formula unit'],
      ['Aᵣ', 'Relative atomic mass of the element'],
      ['Mᵣ', 'Relative molecular/formula mass of the compound'],
    ],
    trap: 'For hydrated salts like Na₂CO₃·10H₂O, add 10 × 18 = 180 to Mᵣ when finding % water of crystallisation!',
    worked: {
      qHtml: 'Find the percentage of nitrogen by mass in urea, CO(NH₂)₂ [C = 12, O = 16, N = 14, H = 1].',
      stepsHtml: [
        'Mᵣ of CO(NH₂)₂ = 12 + 16 + 2(14 + 2) = 28 + 32 = 60',
        'Mass of 2 N atoms = 2 × 14 = 28',
        '% N = (28 ÷ 60) × 100% = 46.7%',
      ],
      ansHtml: '46.7%',
    },
    keywords: ['percentage composition', 'empirical', 'molecular formula', 'water of crystallisation'],
  },
  {
    id: 'f-yield-purity',
    cat: 'mole',
    name: 'Percentage Yield & Percentage Purity',
    topicId: 'c-mole',
    summary: 'Measures reaction efficiency in industrial synthesis and pure substance fraction in an ore or sample.',
    rearrangements: [
      {
        solveFor: '%yield',
        label: 'Percentage yield',
        exprHtml: '% Yield = (Actual yield ÷ Theoretical yield) × 100%',
      },
      {
        solveFor: '%purity',
        label: 'Percentage purity',
        exprHtml: '% Purity = (Mass of pure substance ÷ Total impure sample mass) × 100%',
      },
    ],
    variables: [
      ['Actual yield', 'Measured mass/moles obtained experimentally (g or mol)'],
      ['Theoretical yield', 'Maximum mass/moles predicted by stoichiometry from limiting reactant'],
      ['Mass of pure', 'Reacting pure mass found from titration or gas volume (g)'],
    ],
    trap: 'Only the PURE fraction reacts stoichiometrically — never divide impure sample mass directly by Mᵣ to get reacting moles!',
    worked: {
      qHtml: 'Heating 10.0 g of impure limestone gave 1.68 dm³ of CO₂ at s.t.p. Calculate % purity of CaCO₃ [CaCO₃ = 100].',
      stepsHtml: [
        'n(CO₂) = 1.68 ÷ 22.4 = 0.075 mol = n(pure CaCO₃)',
        'Mass of pure CaCO₃ = 0.075 × 100 = 7.50 g',
        '% Purity = (7.50 ÷ 10.0) × 100% = 75.0%',
      ],
      ansHtml: '75.0%',
    },
    keywords: ['percentage yield', 'purity', 'impure', 'theoretical yield', 'limiting'],
  },

  /* ─────────────── 2. SOLUTIONS, DILUTION & TITRATION ─────────────── */
  {
    id: 'f-molarity',
    cat: 'solutions',
    name: 'Molar Concentration (Molarity)',
    topicId: 'c-vol',
    summary: 'Expresses moles of solute dissolved per cubic decimetre (1000 cm³) of solution.',
    rearrangements: [
      { solveFor: 'C', label: 'Solve for molarity (C)', exprHtml: 'C = n ÷ V<sub>(dm³)</sub> = (1000 × n) ÷ V<sub>(cm³)</sub>' },
      { solveFor: 'n', label: 'Solve for moles (n)', exprHtml: 'n = C × V<sub>(dm³)</sub> = (C × V<sub>(cm³)</sub>) ÷ 1000' },
      { solveFor: 'V', label: 'Solve for volume (V)', exprHtml: 'V<sub>(dm³)</sub> = n ÷ C' },
    ],
    variables: [
      ['C', 'Molar concentration (mol dm⁻³ or M)'],
      ['n', 'Amount of dissolved solute (mol)'],
      ['V', 'Volume of solution in dm³ (divide cm³ by 1000)'],
    ],
    trap: 'The #1 titration blunder is forgetting ÷ 1000 when V is given in cm³ (e.g. 25.0 cm³ = 0.0250 dm³).',
    worked: {
      qHtml: 'Calculate the mass of NaOH needed to prepare 250 cm³ of 0.20 mol dm⁻³ solution [NaOH = 40].',
      stepsHtml: [
        'n = (C × V_cm³) ÷ 1000 = (0.20 × 250) ÷ 1000 = 0.050 mol',
        'm = n × M = 0.050 × 40 = 2.0 g',
      ],
      ansHtml: '2.0 g',
    },
    keywords: ['molarity', 'concentration', 'mol dm-3', 'standard solution'],
  },
  {
    id: 'f-mass-conc',
    cat: 'solutions',
    name: 'Mass Concentration & Molarity Link',
    topicId: 'c-vol',
    summary: 'Converts directly between g dm⁻³ (mass concentration) and mol dm⁻³ (molar concentration).',
    rearrangements: [
      { solveFor: 'rho', label: 'Solve for mass conc. (ρ)', exprHtml: 'ρ = C × M' },
      { solveFor: 'C', label: 'Solve for molarity (C)', exprHtml: 'C = ρ ÷ M' },
      { solveFor: 'M', label: 'Solve for molar mass (M)', exprHtml: 'M = ρ ÷ C' },
    ],
    variables: [
      ['ρ', 'Mass concentration in g dm⁻³ (= mass in g ÷ volume in dm³)'],
      ['C', 'Molar concentration (mol dm⁻³)'],
      ['M', 'Molar mass of solute (g mol⁻¹)'],
    ],
    trap: 'If given "4.9 g in 500 cm³", scale to 1000 cm³ first: ρ = 4.9 × (1000 ÷ 500) = 9.8 g dm⁻³!',
    worked: {
      qHtml: 'A solution contains 4.9 g of H₂SO₄ in 500 cm³. Find its molarity [H₂SO₄ = 98].',
      stepsHtml: [
        'Mass conc. ρ = 4.9 ÷ 0.500 = 9.8 g dm⁻³',
        'Molarity C = ρ ÷ M = 9.8 ÷ 98 = 0.10 mol dm⁻³',
      ],
      ansHtml: '0.10 mol dm⁻³',
    },
    keywords: ['mass concentration', 'g dm-3', 'molar mass', 'molarity'],
  },
  {
    id: 'f-dilution',
    cat: 'solutions',
    name: 'Dilution Law',
    topicId: 'c-vol',
    summary: 'Adding distilled water changes volume and concentration inversely while keeping solute moles constant.',
    rearrangements: [
      { solveFor: 'C2', label: 'Final concentration (C₂)', exprHtml: 'C₂ = (C₁ × V₁) ÷ V₂' },
      { solveFor: 'V2', label: 'Final total volume (V₂)', exprHtml: 'V₂ = (C₁ × V₁) ÷ C₂' },
      { solveFor: 'V_water', label: 'Volume of water added', exprHtml: 'V<sub>added</sub> = V₂ − V₁' },
    ],
    variables: [
      ['C₁, V₁', 'Initial stock concentration and volume'],
      ['C₂, V₂', 'Final diluted concentration and TOTAL final volume'],
      ['V_added', 'Volume of distilled water added (V₂ − V₁)'],
    ],
    trap: 'Exams love asking "What volume of WATER must be added?" — compute V₂ first, then subtract V₁!',
    worked: {
      qHtml: 'What volume of distilled water must be added to 50 cm³ of 2.0 M HCl to obtain 0.25 M HCl?',
      stepsHtml: [
        'V₂ = (C₁ × V₁) ÷ C₂ = (2.0 × 50) ÷ 0.25 = 400 cm³',
        'Volume of water added = V₂ − V₁ = 400 − 50 = 350 cm³',
      ],
      ansHtml: '350 cm³',
    },
    keywords: ['dilution', 'c1v1', 'water added', 'stock'],
  },
  {
    id: 'f-titration',
    cat: 'solutions',
    name: 'Volumetric Acid–Base Titration Equation',
    topicId: 'c-vol',
    summary: 'Relates acid and base concentrations and volumes at the stoichiometric equivalence point.',
    rearrangements: [
      {
        solveFor: 'ratio',
        label: 'General titration form',
        exprHtml: '(C<sub>A</sub> × V<sub>A</sub>) ÷ (C<sub>B</sub> × V<sub>B</sub>) = n<sub>A</sub> ÷ n<sub>B</sub>',
      },
      {
        solveFor: 'CA',
        label: 'Solve for acid conc. (C_A)',
        exprHtml: 'C<sub>A</sub> = (C<sub>B</sub> × V<sub>B</sub> × n<sub>A</sub>) ÷ (V<sub>A</sub> × n<sub>B</sub>)',
      },
      {
        solveFor: 'CB',
        label: 'Solve for base conc. (C_B)',
        exprHtml: 'C<sub>B</sub> = (C<sub>A</sub> × V<sub>A</sub> × n<sub>B</sub>) ÷ (V<sub>B</sub> × n<sub>A</sub>)',
      },
    ],
    variables: [
      ['C_A, V_A', 'Molarity and average concordant titre of acid'],
      ['C_B, V_B', 'Molarity and pipette volume of base/alkali'],
      ['n_A : n_B', 'Balanced equation mole ratio (e.g. H₂SO₄ + 2NaOH → n_A = 1, n_B = 2)'],
    ],
    trap: 'Never assume n_A : n_B is 1 : 1! For H₂SO₄ + 2NaOH, n_A = 1 and n_B = 2; for 2HCl + Na₂CO₃, n_A = 2 and n_B = 1.',
    worked: {
      qHtml: '20.0 cm³ of H₂SO₄ neutralised 25.0 cm³ of 0.16 mol dm⁻³ NaOH. Find C_A.',
      stepsHtml: [
        'Balanced equation: H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O (n_A = 1, n_B = 2)',
        'C_A = (0.16 × 25.0 × 1) ÷ (20.0 × 2) = 4.0 ÷ 40.0 = 0.10 mol dm⁻³',
      ],
      ansHtml: '0.10 mol dm⁻³',
    },
    keywords: ['titration', 'cava', 'cbvb', 'neutralisation', 'burette', 'pipette'],
  },
  {
    id: 'f-solubility',
    cat: 'solutions',
    name: 'Solubility of a Solute at Temperature T',
    topicId: 'c-sol',
    summary: 'Expresses maximum moles of solute saturating 1 dm³ (1000 cm³) of solvent at a stated temperature.',
    rearrangements: [
      {
        solveFor: 'S',
        label: 'Solubility (mol dm⁻³)',
        exprHtml: 'S = (m × 1000) ÷ (M × V<sub>cm³</sub>)',
      },
      {
        solveFor: 'm',
        label: 'Mass dissolved in V cm³',
        exprHtml: 'm = (S × M × V<sub>cm³</sub>) ÷ 1000',
      },
    ],
    variables: [
      ['S', 'Solubility in mol dm⁻³ at temperature T'],
      ['m', 'Maximum mass of solute saturating V cm³ of water (g)'],
      ['M', 'Molar mass of solute (g mol⁻¹)'],
      ['V_cm³', 'Volume (or mass in g, since density of water = 1 g cm⁻³) of water'],
    ],
    trap: 'On cooling a saturated solution from T₁ to T₂, mass crystallised scales with the actual solvent volume (e.g. for 250 cm³, multiply Δn by 250/1000)!',
    worked: {
      qHtml: '10.1 g of KNO₃ saturates 50 cm³ of water at 30 °C. Calculate its solubility in mol dm⁻³ [KNO₃ = 101].',
      stepsHtml: [
        'n(KNO₃) = 10.1 ÷ 101 = 0.10 mol in 50 cm³',
        'Solubility S = (0.10 × 1000) ÷ 50 = 2.0 mol dm⁻³',
      ],
      ansHtml: '2.0 mol dm⁻³',
    },
    keywords: ['solubility', 'saturated', 'crystallisation', 'kno3'],
  },

  /* ─────────────── 3. GAS LAWS, VAPOUR DENSITY & DIFFUSION ─────────────── */
  {
    id: 'f-boyle',
    cat: 'gases',
    name: 'Boyle’s Law (Constant Temperature)',
    topicId: 'c-kin',
    summary: 'At constant temperature, the volume of a fixed mass of gas is inversely proportional to its pressure.',
    rearrangements: [
      { solveFor: 'V2', label: 'Solve for V₂', exprHtml: 'V₂ = (P₁ × V₁) ÷ P₂' },
      { solveFor: 'P2', label: 'Solve for P₂', exprHtml: 'P₂ = (P₁ × V₁) ÷ V₂' },
      { solveFor: 'const', label: 'Isothermal relation', exprHtml: 'P₁V₁ = P₂V₂ = k' },
    ],
    variables: [
      ['P₁, P₂', 'Initial and final gas pressures (same units: atm, kPa, or mmHg)'],
      ['V₁, V₂', 'Initial and final gas volumes (same units: cm³ or dm³)'],
    ],
    trap: 'Ensure P₁ and P₂ share the SAME pressure unit (1 atm = 760 mmHg = 101.3 kPa)!',
    worked: {
      qHtml: 'A gas occupies 400 cm³ at 760 mmHg. What volume will it occupy at 380 mmHg at constant temperature?',
      stepsHtml: ['V₂ = (P₁ × V₁) ÷ P₂ = (760 × 400) ÷ 380 = 800 cm³'],
      ansHtml: '800 cm³',
    },
    keywords: ['boyle', 'pressure', 'volume', 'p1v1'],
  },
  {
    id: 'f-charles',
    cat: 'gases',
    name: 'Charles’s Law (Constant Pressure)',
    topicId: 'c-kin',
    summary: 'At constant pressure, the volume of a fixed mass of gas is directly proportional to its Kelvin temperature.',
    rearrangements: [
      { solveFor: 'V2', label: 'Solve for V₂', exprHtml: 'V₂ = (V₁ × T₂) ÷ T₁' },
      { solveFor: 'T2', label: 'Solve for T₂ (K)', exprHtml: 'T₂ = (T₁ × V₂) ÷ V₁' },
      { solveFor: 'K', label: 'Kelvin conversion', exprHtml: 'T (K) = θ (°C) + 273' },
    ],
    variables: [
      ['V₁, V₂', 'Initial and final volumes (cm³ or dm³)'],
      ['T₁, T₂', 'Absolute temperatures in KELVIN (K = °C + 273)'],
    ],
    trap: 'NEVER substitute °C directly into V₁/T₁ = V₂/T₂! Convert to Kelvin (+273) before dividing, and subtract 273 if final answer is requested in °C.',
    worked: {
      qHtml: '300 cm³ of a gas at 27 °C is heated to 127 °C at constant pressure. Find the new volume.',
      stepsHtml: [
        'T₁ = 27 + 273 = 300 K;  T₂ = 127 + 273 = 400 K',
        'V₂ = (300 × 400) ÷ 300 = 400 cm³',
      ],
      ansHtml: '400 cm³',
    },
    keywords: ['charles', 'kelvin', 'temperature', 'v1/t1'],
  },
  {
    id: 'f-general-gas',
    cat: 'gases',
    name: 'General (Combined) Gas Equation',
    topicId: 'c-kin',
    summary: 'Combines Boyle’s and Charles’s laws when pressure, volume, and temperature all change simultaneously.',
    rearrangements: [
      { solveFor: 'V2', label: 'Solve for V₂', exprHtml: 'V₂ = (P₁ × V₁ × T₂) ÷ (P₂ × T₁)' },
      { solveFor: 'P2', label: 'Solve for P₂', exprHtml: 'P₂ = (P₁ × V₁ × T₂) ÷ (V₂ × T₁)' },
      { solveFor: 'T2', label: 'Solve for T₂', exprHtml: 'T₂ = (P₂ × V₂ × T₁) ÷ (P₁ × V₁)' },
    ],
    variables: [
      ['P₁, V₁, T₁', 'Initial pressure, volume, and Kelvin temperature'],
      ['P₂, V₂, T₂', 'Final pressure, volume, and Kelvin temperature (e.g. s.t.p.: P₂ = 760 mmHg, T₂ = 273 K)'],
    ],
    trap: 'When "reducing a gas volume to s.t.p.", substitute P₂ = 760 mmHg (or 1 atm) and T₂ = 273 K.',
    worked: {
      qHtml: 'Convert 300 cm³ of gas collected at 27 °C and 700 mmHg to its volume at s.t.p. [760 mmHg, 273 K].',
      stepsHtml: [
        'T₁ = 27 + 273 = 300 K;  T₂ = 273 K;  P₂ = 760 mmHg',
        'V₂ = (700 × 300 × 273) ÷ (760 × 300) = (700 × 273) ÷ 760 = 251.4 cm³',
      ],
      ansHtml: '251.4 cm³',
    },
    keywords: ['general gas', 'combined gas', 'stp', 'p1v1/t1'],
  },
  {
    id: 'f-ideal-gas',
    cat: 'gases',
    name: 'Ideal Gas Equation',
    topicId: 'c-kin',
    summary: 'Relates P, V, n, and T of an ideal gas via the universal molar gas constant R.',
    rearrangements: [
      { solveFor: 'PV', label: 'Standard form', exprHtml: 'P × V = n × R × T' },
      { solveFor: 'n', label: 'Solve for moles (n)', exprHtml: 'n = (P × V) ÷ (R × T)' },
      { solveFor: 'M', label: 'Solve for molar mass (M)', exprHtml: 'M = (m × R × T) ÷ (P × V)' },
    ],
    variables: [
      ['P', 'Pressure (atm with dm³, or Pa/N m⁻² with m³)'],
      ['V', 'Volume (dm³ with atm, or m³ with Pa)'],
      ['n', 'Moles of gas (mol)'],
      ['T', 'Absolute temperature (K)'],
    ],
    constants: [
      'R = 0.0821 atm dm³ K⁻¹ mol⁻¹ (when P in atm, V in dm³)',
      'R = 8.314 J K⁻¹ mol⁻¹ (when P in Pa, V in m³)',
    ],
    trap: 'Match R to your P and V units! With R = 8.314, P must be in Pa (kPa × 1000) and V in m³ (dm³ ÷ 1000).',
    worked: {
      qHtml: 'Find the pressure exerted by 0.50 mol of N₂ in an 8.21 dm³ cylinder at 300 K [R = 0.0821 atm dm³ K⁻¹ mol⁻¹].',
      stepsHtml: [
        'P = nRT ÷ V = (0.50 × 0.0821 × 300) ÷ 8.21 = 12.315 ÷ 8.21 = 1.50 atm',
      ],
      ansHtml: '1.50 atm',
    },
    keywords: ['ideal gas', 'pv=nrt', 'gas constant', '8.314', '0.0821'],
  },
  {
    id: 'f-vapour-density',
    cat: 'gases',
    name: 'Relative Molecular Mass & Vapour Density',
    topicId: 'c-kin',
    summary: 'Deduces relative molecular mass directly from vapour density relative to hydrogen.',
    rearrangements: [
      { solveFor: 'Mr', label: 'Solve for Mᵣ', exprHtml: 'M<sub>r</sub> = 2 × V.D.' },
      { solveFor: 'VD', label: 'Solve for vapour density', exprHtml: 'V.D. = M<sub>r</sub> ÷ 2' },
    ],
    variables: [
      ['Mᵣ', 'Relative molecular mass of the gas or vapour (dimensionless)'],
      ['V.D.', 'Vapour density = mass of V of gas ÷ mass of equal V of H₂ at same T and P'],
    ],
    trap: 'Do not divide by 2 when asked for Mᵣ — multiply V.D. by 2 because Mᵣ(H₂) = 2!',
    worked: {
      qHtml: 'A hydrocarbon has a vapour density of 28 and empirical formula CH₂. Find its molecular formula [C = 12, H = 1].',
      stepsHtml: [
        'Mᵣ = 2 × V.D. = 2 × 28 = 56',
        'Empirical mass M(CH₂) = 12 + 2 = 14 → n = 56 ÷ 14 = 4 → Molecular formula = C₄H₈',
      ],
      ansHtml: 'C₄H₈ (Mᵣ = 56)',
    },
    keywords: ['vapour density', 'relative molecular mass', '2 x vd'],
  },
  {
    id: 'f-graham',
    cat: 'gases',
    name: 'Graham’s Law of Diffusion',
    topicId: 'c-kin',
    summary: 'Lighter gases diffuse faster: rate is inversely proportional to the square root of molar mass or density.',
    rearrangements: [
      {
        solveFor: 'rate',
        label: 'Diffusion rate ratio',
        exprHtml: 'r₁ ÷ r₂ = √(M₂ ÷ M₁) = √(d₂ ÷ d₁)',
      },
      {
        solveFor: 'time',
        label: 'Diffusion time ratio (equal V)',
        exprHtml: 't₁ ÷ t₂ = √(M₁ ÷ M₂)',
      },
      {
        solveFor: 'M2',
        label: 'Unknown molar mass (M₂)',
        exprHtml: 'M₂ = M₁ × (r₁ ÷ r₂)² = M₁ × (t₂ ÷ t₁)²',
      },
    ],
    variables: [
      ['r₁, r₂', 'Rates of diffusion (cm³ s⁻¹) where r = V ÷ t'],
      ['t₁, t₂', 'Times taken for EQUAL volumes of gas 1 and gas 2 to diffuse (s)'],
      ['M₁, M₂', 'Molar masses of gas 1 and gas 2 (g mol⁻¹)'],
    ],
    trap: 'Rate and Time are reciprocals! Faster gas = HIGHER rate r, SMALLER time t. Square the ratio to remove the square root!',
    worked: {
      qHtml: '50 cm³ of O₂ (M = 32) diffuses in 20 s. How long will 50 cm³ of H₂ (M = 2) take under identical conditions?',
      stepsHtml: [
        'For equal volumes: t(H₂) ÷ t(O₂) = √(M_H₂ ÷ M_O₂) = √(2 ÷ 32) = √(1/16) = 1/4',
        't(H₂) = 20 × (1/4) = 5.0 s',
      ],
      ansHtml: '5.0 s',
    },
    keywords: ['graham', 'diffusion', 'effusion', 'rate', 'molar mass'],
  },
  {
    id: 'f-dalton',
    cat: 'gases',
    name: 'Dalton’s Law of Partial Pressures & Wet Gas',
    topicId: 'c-kin',
    summary: 'Finds dry gas pressure when collected over water and relates partial pressure to mole fraction.',
    rearrangements: [
      { solveFor: 'Pdry', label: 'Dry gas collected over water', exprHtml: 'P<sub>dry</sub> = P<sub>total</sub> − P<sub>SVP</sub>' },
      { solveFor: 'Pi', label: 'Partial pressure from mole fraction', exprHtml: 'P<sub>A</sub> = (n<sub>A</sub> ÷ n<sub>total</sub>) × P<sub>total</sub>' },
    ],
    variables: [
      ['P_total', 'Total measured atmospheric/mixture pressure'],
      ['P_SVP', 'Saturated vapour pressure (aqueous tension) of water at temperature T'],
      ['n_A / n_total', 'Mole fraction χ_A of gas A in the non-reacting gas mixture'],
    ],
    trap: 'Whenever a gas is collected OVER WATER, subtract saturated water vapour pressure (P_SVP) before applying P₁V₁/T₁ = P₂V₂/T₂!',
    worked: {
      qHtml: 'A mixture of 2 mol N₂ and 3 mol O₂ exerts a total pressure of 5.0 atm. Find the partial pressure of O₂.',
      stepsHtml: [
        'n_total = 2 + 3 = 5 mol → mole fraction χ(O₂) = 3 ÷ 5 = 0.60',
        'P(O₂) = 0.60 × 5.0 = 3.0 atm',
      ],
      ansHtml: '3.0 atm',
    },
    keywords: ['dalton', 'partial pressure', 'mole fraction', 'vapour pressure', 'over water'],
  },

  /* ─────────────── 4. ELECTROLYSIS & CELL POTENTIAL ─────────────── */
  {
    id: 'f-charge',
    cat: 'electro',
    name: 'Quantity of Electricity & Moles of Electrons',
    topicId: 'c-elec',
    summary: 'Calculates electric charge in coulombs and converts coulombs into Faradays (moles of electrons).',
    rearrangements: [
      { solveFor: 'Q', label: 'Solve for charge (Q)', exprHtml: 'Q = I × t' },
      { solveFor: 'ne', label: 'Moles of electrons (Faradays)', exprHtml: 'n(e⁻) = Q ÷ F = (I × t) ÷ 96,500' },
      { solveFor: 't', label: 'Solve for time (t)', exprHtml: 't = Q ÷ I' },
    ],
    variables: [
      ['Q', 'Quantity of electric charge (coulombs, C)'],
      ['I', 'Steady electric current (amperes, A)'],
      ['t', 'Time in SECONDS (minutes × 60; hours × 3600)'],
    ],
    constants: ['1 Faraday (F) = 96,500 C mol⁻¹ = 1 mole of electrons'],
    trap: 'Time t MUST be in seconds! 32 minutes 10 seconds = (32 × 60) + 10 = 1,930 s.',
    worked: {
      qHtml: 'How many moles of electrons pass when a current of 5.0 A flows for 1930 seconds? [F = 96,500 C mol⁻¹]',
      stepsHtml: [
        'Q = I × t = 5.0 × 1930 = 9,650 C',
        'n(e⁻) = 9,650 ÷ 96,500 = 0.10 mol of electrons (0.10 F)',
      ],
      ansHtml: '0.10 mol of e⁻',
    },
    keywords: ['coulomb', 'charge', 'current', 'faraday', 'q=it'],
  },
  {
    id: 'f-faraday1',
    cat: 'electro',
    name: 'Faraday’s First Law (Mass Liberated at Electrode)',
    topicId: 'c-elec',
    summary: 'Computes the exact mass of metal deposited or gas liberated during electrolysis.',
    rearrangements: [
      { solveFor: 'm', label: 'Solve for mass deposited (m)', exprHtml: 'm = (I × t × M) ÷ (z × F)' },
      { solveFor: 'z', label: 'Solve for ion charge (z)', exprHtml: 'z = (I × t × M) ÷ (m × F)' },
      { solveFor: 'I', label: 'Solve for current (I)', exprHtml: 'I = (m × z × F) ÷ (t × M)' },
    ],
    variables: [
      ['m', 'Mass of element discharged at electrode (g)'],
      ['M', 'Molar mass (Aᵣ for metals: Cu = 64, Ag = 108, Al = 27)'],
      ['z', 'Electrons per mole of product (Ag⁺ = 1, Cu²⁺ = 2, Al³⁺ = 3; for O₂ gas z = 4!)'],
    ],
    constants: ['F = 96,500 C mol⁻¹'],
    trap: 'For O₂ liberated at the anode (4OH⁻ → 2H₂O + O₂ + 4e⁻), z = 4 moles of electrons per 1 mole of O₂ (22.4 dm³ at s.t.p.)!',
    worked: {
      qHtml: 'Calculate the mass of copper deposited when 2.0 A flows through CuSO₄(aq) for 1930 s [Cu = 64, F = 96,500].',
      stepsHtml: [
        'Cathode half-equation: Cu²⁺ + 2e⁻ → Cu (z = 2)',
        'm = (2.0 × 1930 × 64) ÷ (2 × 96,500) = (3860 × 64) ÷ 193,000 = 1.28 g',
      ],
      ansHtml: '1.28 g',
    },
    keywords: ['faraday first law', 'electrolysis', 'mass deposited', 'copper', 'silver'],
  },
  {
    id: 'f-faraday2',
    cat: 'electro',
    name: 'Faraday’s Second Law (Electrolytic Cells in Series)',
    topicId: 'c-elec',
    summary: 'When the same charge Q passes through cells in series, moles deposited are inversely proportional to ion charge z.',
    rearrangements: [
      { solveFor: 'n', label: 'Mole–charge balance', exprHtml: 'n₁ × z₁ = n₂ × z₂' },
      { solveFor: 'm2', label: 'Solve for m₂ in series', exprHtml: '(m₁ ÷ M₁) × z₁ = (m₂ ÷ M₂) × z₂' },
    ],
    variables: [
      ['n₁, n₂', 'Moles of elements 1 and 2 discharged by the same Q'],
      ['z₁, z₂', 'Charges on the respective ions (e.g. Ag⁺ = 1, Cu²⁺ = 2, Al³⁺ = 3)'],
    ],
    trap: 'Higher ion charge means FEWER moles deposited for the same charge: 1 F deposits 1 mol Ag, 1/2 mol Cu, and 1/3 mol Al!',
    worked: {
      qHtml: 'An electric current passed through AgNO₃ and CuSO₄ in series deposits 10.8 g of Ag. What mass of Cu is deposited? [Ag = 108, Cu = 64]',
      stepsHtml: [
        'n(Ag) = 10.8 ÷ 108 = 0.10 mol (z_Ag = 1)',
        'n(Cu) × 2 = 0.10 × 1 → n(Cu) = 0.050 mol',
        'm(Cu) = 0.050 × 64 = 3.20 g',
      ],
      ansHtml: '3.20 g',
    },
    keywords: ['faraday second law', 'series', 'equivalent', 'silver', 'copper'],
  },
  {
    id: 'f-cell-emf',
    cat: 'electro',
    name: 'Standard Electrochemical Cell Potential (E°cell)',
    topicId: 'c-redox',
    summary: 'Determines the voltage and spontaneity of a galvanic/voltaic cell from standard reduction potentials.',
    rearrangements: [
      { solveFor: 'Ecell', label: 'Standard cell EMF', exprHtml: 'E°<sub>cell</sub> = E°<sub>cathode</sub> − E°<sub>anode</sub>' },
      { solveFor: 'Ecath', label: 'Solve for E°_cathode', exprHtml: 'E°<sub>cathode</sub> = E°<sub>cell</sub> + E°<sub>anode</sub>' },
    ],
    variables: [
      ['E°_cathode', 'Standard reduction potential of the MORE positive half-cell (reduction)'],
      ['E°_anode', 'Standard reduction potential of the MORE negative half-cell (oxidation)'],
    ],
    trap: 'Keep negative signs intact inside parentheses! E.g. (+0.34) − (−0.76) = +1.10 V, never −0.42 V.',
    worked: {
      qHtml: 'Calculate E°_cell for the Daniell cell: Zn²⁺/Zn = −0.76 V and Cu²⁺/Cu = +0.34 V.',
      stepsHtml: [
        'Cu²⁺/Cu (+0.34 V) is more positive → cathode; Zn²⁺/Zn (−0.76 V) → anode',
        'E°_cell = (+0.34) − (−0.76) = +1.10 V (spontaneous since E°_cell > 0)',
      ],
      ansHtml: '+1.10 V',
    },
    keywords: ['electrode potential', 'emf', 'ecell', 'daniell', 'voltaic'],
  },

  /* ─────────────── 5. ACIDS, pH & EQUILIBRIUM ─────────────── */
  {
    id: 'f-ph',
    cat: 'equil',
    name: 'Sørensen pH & Hydrogen Ion Concentration',
    topicId: 'c-acid',
    summary: 'Measures acidity on a logarithmic scale from molar hydrogen/oxonium ion concentration.',
    rearrangements: [
      { solveFor: 'pH', label: 'Solve for pH', exprHtml: 'pH = −log₁₀[H⁺]' },
      { solveFor: 'H', label: 'Solve for [H⁺]', exprHtml: '[H⁺] = 10<sup>−pH</sup> mol dm⁻³' },
    ],
    variables: [
      ['[H⁺]', 'Hydrogen (or H₃O⁺) ion concentration in mol dm⁻³'],
      ['pH', 'Dimensionless acidity index (each 1 unit drop in pH = 10× rise in [H⁺])'],
    ],
    trap: 'For diprotic strong acid H₂SO₄, [H⁺] = 2 × C_acid! So 0.005 M H₂SO₄ gives [H⁺] = 0.01 M → pH = 2, not 2.3!',
    worked: {
      qHtml: 'Calculate the pH of 0.005 mol dm⁻³ tetraoxosulphate(VI) acid, H₂SO₄ (assuming complete ionisation).',
      stepsHtml: [
        'H₂SO₄(aq) → 2H⁺(aq) + SO₄²⁻(aq) → [H⁺] = 2 × 0.005 = 0.010 = 10⁻² mol dm⁻³',
        'pH = −log₁₀(10⁻²) = 2.0',
      ],
      ansHtml: 'pH = 2.0',
    },
    keywords: ['ph', 'hydrogen ion', 'logarithm', 'acidity'],
  },
  {
    id: 'f-kw-poh',
    cat: 'equil',
    name: 'Ionic Product of Water (Kw) & pH + pOH = 14',
    topicId: 'c-acid',
    summary: 'Connects [H⁺], [OH⁻], pH, and pOH in any aqueous solution at 25 °C.',
    rearrangements: [
      { solveFor: 'pH', label: 'pH from pOH (at 25 °C)', exprHtml: 'pH = 14 − pOH' },
      { solveFor: 'Kw', label: 'Ionic product of water', exprHtml: 'K<sub>w</sub> = [H⁺][OH⁻] = 1.0 × 10⁻¹⁴ mol² dm⁻⁶' },
      { solveFor: 'H', label: '[H⁺] from [OH⁻]', exprHtml: '[H⁺] = 1.0 × 10⁻¹⁴ ÷ [OH⁻]' },
    ],
    variables: [
      ['pOH', '−log₁₀[OH⁻]'],
      ['Kw', '1.0 × 10⁻¹⁴ mol² dm⁻⁶ at 298 K (25 °C)'],
    ],
    trap: 'For an alkali like 0.01 M NaOH, −log(0.01) = 2 is pOH, NOT pH! Always subtract from 14: pH = 14 − 2 = 12!',
    worked: {
      qHtml: 'Find the pH of 0.001 mol dm⁻³ KOH(aq) at 25 °C.',
      stepsHtml: [
        '[OH⁻] = 0.001 = 10⁻³ mol dm⁻³ → pOH = −log₁₀(10⁻³) = 3',
        'pH = 14 − 3 = 11.0',
      ],
      ansHtml: 'pH = 11.0',
    },
    keywords: ['poh', 'kw', 'alkali', 'hydroxide', '14'],
  },
  {
    id: 'f-kc',
    cat: 'equil',
    name: 'Equilibrium Constant Expression (Kc)',
    topicId: 'c-equil',
    summary: 'Quantifies dynamic chemical equilibrium using molar concentrations raised to stoichiometric powers.',
    rearrangements: [
      {
        solveFor: 'Kc',
        label: 'Law of mass action',
        exprHtml: 'K<sub>c</sub> = ([C]<sup>c</sup>[D]<sup>d</sup>) ÷ ([A]<sup>a</sup>[B]<sup>b</sup>)',
      },
      {
        solveFor: 'unit',
        label: 'Units of Kc',
        exprHtml: '(mol dm⁻³)<sup>Δn</sup>  where Δn = (c + d) − (a + b)',
      },
    ],
    variables: [
      ['[A], [B]', 'Equilibrium molar concentrations of reactants (mol dm⁻³)'],
      ['[C], [D]', 'Equilibrium molar concentrations of products (mol dm⁻³)'],
      ['a, b, c, d', 'Stoichiometric coefficients in the balanced reversible equation'],
    ],
    trap: 'OMIT pure solids (s) and pure liquids (l) from Kc! Only temperature changes Kc — catalysts and pressure never alter Kc.',
    worked: {
      qHtml: 'At equilibrium for N₂(g) + 3H₂(g) ⇌ 2NH₃(g), [N₂] = 0.5 M, [H₂] = 1.0 M, and [NH₃] = 1.0 M. Find Kc.',
      stepsHtml: [
        'Kc = [NH₃]² ÷ ([N₂][H₂]³) = (1.0)² ÷ (0.5 × 1.0³) = 1.0 ÷ 0.5 = 2.0 mol⁻² dm⁶',
      ],
      ansHtml: '2.0 mol⁻² dm⁶',
    },
    keywords: ['equilibrium constant', 'kc', 'mass action', 'reversible'],
  },

  /* ─────────────── 6. ENERGETICS, RATES & RADIOACTIVITY ─────────────── */
  {
    id: 'f-calorimetry',
    cat: 'thermo',
    name: 'Calorimetry & Molar Enthalpy Change (ΔH)',
    topicId: 'c-energy',
    summary: 'Calculates heat absorbed by solution/water and scales to 1 mole of limiting reactant.',
    rearrangements: [
      { solveFor: 'q', label: 'Heat energy (J)', exprHtml: 'q = m × c × ΔT' },
      { solveFor: 'dH', label: 'Molar enthalpy (J mol⁻¹)', exprHtml: 'ΔH = −q ÷ n' },
    ],
    variables: [
      ['q', 'Heat absorbed or released by solution (J)'],
      ['m', 'Total mass of solution heated in g (≈ total cm³ for dilute aqueous solutions)'],
      ['c', 'Specific heat capacity of water = 4.2 J g⁻¹ K⁻¹ (or 4.18 J g⁻¹ K⁻¹)'],
      ['ΔT', 'Temperature change T_final − T_initial (K or °C)'],
    ],
    trap: 'When mixing 50 cm³ acid + 50 cm³ alkali, m = 50 + 50 = 100 g (TOTAL solution mass), and ΔH is NEGATIVE when temperature rises!',
    worked: {
      qHtml: 'Mixing 50 cm³ of 1.0 M HCl and 50 cm³ of 1.0 M NaOH raised temperature by 6.5 °C. Find ΔH_neut [c = 4.2 J g⁻¹ K⁻¹].',
      stepsHtml: [
        'Total solution mass m = 50 + 50 = 100 g;  n(H₂O formed) = 1.0 × 0.050 = 0.050 mol',
        'q = 100 × 4.2 × 6.5 = 2,730 J = 2.73 kJ',
        'ΔH_neut = −2.73 ÷ 0.050 = −54.6 kJ mol⁻¹',
      ],
      ansHtml: '−54.6 kJ mol⁻¹',
    },
    keywords: ['calorimetry', 'enthalpy', 'neutralisation', 'mcdeltat', 'specific heat'],
  },
  {
    id: 'f-gibbs',
    cat: 'thermo',
    name: 'Gibbs Free Energy & Spontaneity',
    topicId: 'c-energy',
    summary: 'Combines enthalpy ΔH and entropy ΔS at Kelvin temperature T to predict reaction spontaneity.',
    rearrangements: [
      { solveFor: 'dG', label: 'Solve for ΔG', exprHtml: 'ΔG = ΔH − TΔS' },
      { solveFor: 'Teq', label: 'Crossover / equilibrium T (ΔG = 0)', exprHtml: 'T<sub>eq</sub> = ΔH ÷ ΔS' },
    ],
    variables: [
      ['ΔG', 'Free energy change (< 0 spontaneous, = 0 equilibrium, > 0 non-spontaneous)'],
      ['ΔH', 'Enthalpy change (convert kJ mol⁻¹ — match units with ΔS!)'],
      ['T', 'Absolute temperature in Kelvin (K = °C + 273)'],
      ['ΔS', 'Entropy change (usually given in J K⁻¹ mol⁻¹ → divide by 1000 for kJ K⁻¹ mol⁻¹!)'],
    ],
    trap: 'ΔH is given in kJ mol⁻¹ while ΔS is given in J K⁻¹ mol⁻¹! Divide ΔS by 1000 BEFORE computing ΔH − TΔS.',
    worked: {
      qHtml: 'For a reaction at 300 K, ΔH = +40 kJ mol⁻¹ and ΔS = +150 J K⁻¹ mol⁻¹. Find ΔG and state if spontaneous.',
      stepsHtml: [
        'Convert ΔS: +150 J K⁻¹ mol⁻¹ = +0.150 kJ K⁻¹ mol⁻¹',
        'ΔG = +40 − (300 × 0.150) = 40 − 45 = −5.0 kJ mol⁻¹ (spontaneous since ΔG < 0)',
      ],
      ansHtml: '−5.0 kJ mol⁻¹ (Spontaneous)',
    },
    keywords: ['gibbs', 'free energy', 'entropy', 'spontaneous', 'dg=dh-tds'],
  },
  {
    id: 'f-halflife',
    cat: 'thermo',
    name: 'Radioactive Half-Life & Reaction Rate',
    topicId: 'c-nuc',
    summary: 'Computes remaining undecayed nuclide mass after k half-lives and average chemical reaction rate.',
    rearrangements: [
      {
        solveFor: 'N',
        label: 'Remaining mass/count (N)',
        exprHtml: 'N = N₀ × (1/2)<sup>t / t½</sup>',
      },
      {
        solveFor: 't12',
        label: 'Half-life (t½)',
        exprHtml: 't<sub>½</sub> = t ÷ k   where (N₀ ÷ N) = 2<sup>k</sup>',
      },
      {
        solveFor: 'rate',
        label: 'Average reaction rate',
        exprHtml: 'Rate = Δ(mass, volume, or conc.) ÷ Δt',
      },
    ],
    variables: [
      ['N₀, N', 'Initial mass/activity and remaining undecayed mass/activity after time t'],
      ['k', 'Number of elapsed half-lives = t ÷ t½'],
      ['t½', 'Half-life of the radioisotope (independent of T, P, or catalyst)'],
    ],
    trap: 'Watch whether the question asks for mass REMAINING (N) or mass DECAYED (N₀ − N)!',
    worked: {
      qHtml: 'A 48 g sample of a radioisotope decays to 6 g in 36 days. Find its half-life.',
      stepsHtml: [
        'Ratio N₀ ÷ N = 48 ÷ 6 = 8 = 2³ → k = 3 half-lives elapsed',
        't½ = 36 days ÷ 3 = 12 days',
      ],
      ansHtml: '12 days',
    },
    keywords: ['half-life', 'radioactivity', 'decay', 'reaction rate'],
  },

  /* ─────────────── 7. ORGANIC & CHEMICAL VALENCY FORMULAS ─────────────── */
  {
    id: 'f-homologous',
    cat: 'organic',
    name: 'Homologous Series General Formulas & Ionic Valency Rule',
    topicId: 'c-func',
    summary: 'Generates molecular formulas across organic homologous series, combustion equations, and ionic cross-valency.',
    rearrangements: [
      {
        solveFor: 'hydro',
        label: 'Hydrocarbons',
        exprHtml: 'Alkane: C<sub>n</sub>H<sub>2n+2</sub> · Alkene: C<sub>n</sub>H<sub>2n</sub> · Alkyne: C<sub>n</sub>H<sub>2n−2</sub>',
      },
      {
        solveFor: 'oxy',
        label: 'Alkanols, Acids & Esters',
        exprHtml: 'Alkanol: C<sub>n</sub>H<sub>2n+1</sub>OH · Acid / Ester: C<sub>n</sub>H<sub>2n</sub>O₂',
      },
      {
        solveFor: 'comb',
        label: 'Hydrocarbon combustion & Ionic valency',
        exprHtml: 'C<sub>x</sub>H<sub>y</sub> + (x + y/4)O₂ → xCO₂ + (y/2)H₂O  ·  M<sup>a+</sup> + X<sup>b−</sup> → M<sub>b</sub>X<sub>a</sub>',
      },
    ],
    variables: [
      ['n', 'Number of carbon atoms in the molecule (adjacent homologues differ by −CH₂−, Mᵣ = 14)'],
      ['x + y/4', 'Moles of O₂ required for complete combustion of 1 mole of CₓHᵧ'],
      ['a, b', 'Valency magnitudes crossed over and reduced to lowest whole-number ratio'],
    ],
    trap: 'Alkenes start at n = 2 (C₂H₄, ethene) — there is no "methene"! And reduce ionic subscripts when valencies share a factor (e.g. Ca²⁺ + O²⁻ → CaO, not Ca₂O₂).',
    worked: {
      qHtml: 'What is the molecular formula of the alkene containing 5 carbon atoms, and what is its empirical formula?',
      stepsHtml: [
        'Alkenes follow CₙH₂ₙ → for n = 5, molecular formula = C₅H₁₀ (pentene)',
        'Divide subscripts by 5 → empirical formula = CH₂ (shared by all alkenes!)',
      ],
      ansHtml: 'C₅H₁₀ (empirical: CH₂)',
    },
    keywords: ['homologous', 'alkane', 'alkene', 'alkyne', 'alkanol', 'alkanoic'],
  },
  {
    id: 'f-oxnum',
    cat: 'organic',
    name: 'Oxidation Number Sum & Ionic Cross-Valency Rule',
    topicId: 'c-redox',
    summary: 'Finds unknown oxidation states for IUPAC naming and builds neutral ionic formulas from ion charges.',
    rearrangements: [
      {
        solveFor: 'ON',
        label: 'Sum of oxidation numbers',
        exprHtml: '∑ (Oxidation numbers of all atoms) = Overall charge (0 or ±q)',
      },
      {
        solveFor: 'ion',
        label: 'Ionic cross-valency rule',
        exprHtml: 'M<sup>a+</sup> + X<sup>b−</sup> → M<sub>b</sub>X<sub>a</sub>  (reduced to simplest ratio)',
      },
    ],
    variables: [
      ['O', 'Usually −2 (except −1 in peroxides H₂O₂/Na₂O₂, and +2 in OF₂)'],
      ['H', 'Usually +1 (except −1 in metal hydrides NaH, CaH₂)'],
      ['Group 1, 2, Al', 'Fixed at +1 (Na, K), +2 (Mg, Ca), and +3 (Al) in compounds'],
    ],
    trap: 'In polyatomic ions like Cr₂O₇²⁻ or MnO₄⁻, equate the sum to the ION CHARGE (−2 or −1), NOT zero, and divide by the metal subscript!',
    worked: {
      qHtml: 'Find the oxidation number of chromium in Cr₂O₇²⁻ and state its IUPAC name.',
      stepsHtml: [
        'Let oxidation state of Cr = x:  2x + 7(−2) = −2',
        '2x − 14 = −2 → 2x = +12 → x = +6 (heptaoxodichromate(VI) ion)',
      ],
      ansHtml: '+6',
    },
    keywords: ['oxidation number', 'iupac', 'valency', 'ionic formula', 'redox'],
  },
  {
    id: 'f-combustion',
    cat: 'organic',
    name: 'Hydrocarbon Complete Combustion & Eudiometry',
    topicId: 'c-hydro',
    summary: 'Balances oxygen demand, CO₂ produced, and H₂O formed for any hydrocarbon CₓHᵧ in excess oxygen.',
    rearrangements: [
      {
        solveFor: 'eq',
        label: 'General combustion equation',
        exprHtml: 'C<sub>x</sub>H<sub>y</sub> + (x + y/4)O₂ → xCO₂ + (y/2)H₂O',
      },
      {
        solveFor: 'x',
        label: 'Carbon number x from CO₂ volume',
        exprHtml: 'x = V(CO₂ produced) ÷ V(C<sub>x</sub>H<sub>y</sub> burnt)',
      },
    ],
    variables: [
      ['x', 'Atoms of carbon per molecule = moles/volume of CO₂ absorbed by KOH(aq)'],
      ['y', 'Atoms of hydrogen per molecule; moles of O₂ used = x + y/4'],
    ],
    trap: 'In eudiometry at room temperature, H₂O condenses to a negligible liquid volume, and KOH(aq) absorbs CO₂ selectively!',
    worked: {
      qHtml: '10 cm³ of a gaseous hydrocarbon required 50 cm³ of O₂ for complete combustion and produced 30 cm³ of CO₂. Find its formula.',
      stepsHtml: [
        'x = V(CO₂) ÷ V(CₓHᵧ) = 30 ÷ 10 = 3',
        'x + y/4 = V(O₂) ÷ V(CₓHᵧ) = 50 ÷ 10 = 5 → 3 + y/4 = 5 → y = 8 → C₃H₈',
      ],
      ansHtml: 'C₃H₈ (Propane)',
    },
    keywords: ['combustion', 'eudiometry', 'hydrocarbon', 'oxygen', 'co2', 'koh'],
  },
];
