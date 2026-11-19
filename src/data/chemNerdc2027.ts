import type { Beat, ChemClassId, Topic } from '../types';

export interface ChemClassMeta {
  id: ChemClassId;
  label: string;
  shortLabel: string;
  fullTitle: string;
  kicker: string;
  description: string;
}

export const CHEM_CLASSES: ChemClassMeta[] = [
  {
    id: 'ss1',
    label: 'SS 1',
    shortLabel: 'SS 1',
    fullTitle: 'SS 1 Chemistry',
    kicker: 'NERDC Year 1 · Foundation',
    description: 'Intro to chemistry, lab safety, separation, particulate matter, atoms, bonding, mole concept, gas laws, acids & carbon.',
  },
  {
    id: 'ss2',
    label: 'SS 2',
    shortLabel: 'SS 2',
    fullTitle: 'SS 2 Chemistry',
    kicker: 'NERDC Year 2 · Physical, Inorganic & Organic',
    description: 'Water & hardness, solutions & colloids, energetics, rates, equilibrium, redox, electrolysis, non-metals & organic chemistry.',
  },
  {
    id: 'ss3',
    label: 'SS 3',
    shortLabel: 'SS 3',
    fullTitle: 'SS 3 Chemistry',
    kicker: 'NERDC Year 3 · Industrial, Analysis & Advanced',
    description: 'Petroleum & petrochemicals, metals & alloys, soaps & macromolecules, pollution, titrations, ion tests, nuclear, ethics & space.',
  },
  {
    id: 'all',
    label: 'All Classes',
    shortLabel: 'All',
    fullTitle: 'Complete Chemistry (SS1–SS3)',
    kicker: 'National Curriculum · 32 Topics',
    description: 'Complete Nigerian NERDC SS1–SS3 Chemistry curriculum covering physical, inorganic, organic, industrial, and analytical chemistry.',
  },
];

export interface ChemNerdcTopicPlacement {
  classId: 'ss1' | 'ss2' | 'ss3';
  term: 1 | 2 | 3;
  termLabel: 'First Term' | 'Second Term' | 'Third Term';
  nerdcTheme:
    | 'The Chemical World'
    | 'Chemistry & Environment'
    | 'Chemistry & Industry'
    | 'The Chemistry of Life';
  order: number;
  domain: 'physical' | 'inorganic' | 'organic' | 'applied';
  keywords: string[];
}

/**
 * Maps all 32 Chemistry topics across SS1–SS3
 * to their exact Nigerian NERDC Senior Secondary Class (SS1, SS2, SS3), Term (1st, 2nd, 3rd), and Theme.
 */
export const CHEM_NERDC_MAP: Record<string, ChemNerdcTopicPlacement> = {
  // ─────────────────────────── SS 1 (11 Topics) ───────────────────────────
  'c-intro': {
    classId: 'ss1',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'The Chemical World',
    order: 1,
    domain: 'applied',
    keywords: ['scientific method', 'hypothesis', 'theory', 'apparatus', 'burette', 'pipette', 'desiccator', 'kipp', 'safety', 'hazard symbols', 'careers'],
  },
  'c-sep': {
    classId: 'ss1',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Chemistry & Environment',
    order: 2,
    domain: 'physical',
    keywords: ['filtration', 'distillation', 'chromatography', 'sublimation', 'crystallisation', 'centrifugation', 'purity', 'mixture', 'compound'],
  },
  'c-part': {
    classId: 'ss1',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'The Chemical World',
    order: 3,
    domain: 'physical',
    keywords: ['atomicity', 'dalton', 'valency', 'radicals', 'iupac nomenclature', 'atoms', 'molecules', 'ions', 'formulae', 'oxidation state'],
  },
  'c-atom': {
    classId: 'ss1',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'The Chemical World',
    order: 4,
    domain: 'physical',
    keywords: ['thomson', 'rutherford', 'millikan', 'bohr', 'isotopes', 'orbitals', 'quantum numbers', 'aufbau', 'hund', 'pauli', 'electronic configuration'],
  },
  'c-per': {
    classId: 'ss1',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'The Chemical World',
    order: 5,
    domain: 'inorganic',
    keywords: ['periodic law', 'groups', 'periods', 'ionisation energy', 'electron affinity', 'electronegativity', 'atomic radius', 'alkali metals', 'transition'],
  },
  'c-bond': {
    classId: 'ss1',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'The Chemical World',
    order: 6,
    domain: 'physical',
    keywords: ['ionic', 'electrovalent', 'covalent', 'coordinate', 'dative', 'hydrogen bond', 'metallic', 'van der waals', 'tetrahedral', 'linear', 'bent'],
  },
  'c-mole': {
    classId: 'ss1',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'The Chemical World',
    order: 7,
    domain: 'physical',
    keywords: ['conservation of mass', 'definite proportions', 'multiple proportions', 'reciprocal proportions', 'mole', 'avogadro', 'empirical formula', 'stoichiometry'],
  },
  'c-kin': {
    classId: 'ss1',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'The Chemical World',
    order: 8,
    domain: 'physical',
    keywords: ['kinetic theory', 'brownian', 'boyle', 'charles', 'graham', 'dalton partial pressure', 'ideal gas', 'vapour density', 'kelvin'],
  },
  'c-acid': {
    classId: 'ss1',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Chemistry & Environment',
    order: 9,
    domain: 'physical',
    keywords: ['acids', 'bases', 'alkalis', 'salts', 'ph', 'poh', 'buffers', 'salt hydrolysis', 'efflorescence', 'deliquescence', 'hygroscopic', 'indicators'],
  },
  'c-carbon': {
    classId: 'ss1',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'The Chemistry of Life',
    order: 10,
    domain: 'inorganic',
    keywords: ['diamond', 'graphite', 'allotropes', 'coal', 'coke', 'coal tar', 'producer gas', 'water gas', 'carbon(iv) oxide', 'carbon(ii) oxide', 'charcoal'],
  },
  'c-ind': {
    classId: 'ss1',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Chemistry & Industry',
    order: 11,
    domain: 'applied',
    keywords: ['heavy chemicals', 'fine chemicals', 'raw materials', 'cement', 'glass', 'ceramics', 'biotechnology', 'biogas', 'fermentation'],
  },

  // ─────────────────────────── SS 2 (12 Topics) ───────────────────────────
  'c-water': {
    classId: 'ss2',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Chemistry & Environment',
    order: 1,
    domain: 'inorganic',
    keywords: ['water', 'temporary hardness', 'permanent hardness', 'washing soda', 'slaked lime', 'permutit', 'ion exchange', 'alum', 'chlorination', 'anhydrous cuso4'],
  },
  'c-sol': {
    classId: 'ss2',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Chemistry & Environment',
    order: 2,
    domain: 'physical',
    keywords: ['solubility', 'saturated', 'supersaturated', 'solvents', 'turpentine', 'colloids', 'suspensions', 'tyndall', 'harmattan', 'milk', 'fog'],
  },
  'c-energy': {
    classId: 'ss2',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Chemistry & Industry',
    order: 3,
    domain: 'physical',
    keywords: ['exothermic', 'endothermic', 'enthalpy', 'entropy', 'gibbs free energy', 'spontaneity', 'activation energy', 'heat of neutralisation'],
  },
  'c-rate': {
    classId: 'ss2',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Chemistry & Industry',
    order: 4,
    domain: 'physical',
    keywords: ['reaction rate', 'collision theory', 'catalyst', 'surface area', 'photochemical', 'photosynthesis', 'silver bromide'],
  },
  'c-equil': {
    classId: 'ss2',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Chemistry & Environment',
    order: 5,
    domain: 'physical',
    keywords: ['reversible', 'dynamic equilibrium', 'le chatelier', 'equilibrium constant', 'haber', 'contact'],
  },
  'c-redox': {
    classId: 'ss2',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Chemistry & Environment',
    order: 6,
    domain: 'physical',
    keywords: ['oxidation', 'reduction', 'oxidising agent', 'reducing agent', 'oxidation number', 'electron transfer', 'iupac'],
  },
  'c-elec': {
    classId: 'ss2',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Chemistry & Environment',
    order: 7,
    domain: 'physical',
    keywords: ['electrolysis', 'electrolytes', 'faraday', 'preferential discharge', 'electroplating', 'electrochemical cell', 'daniell cell', 'corrosion', 'galvanizing'],
  },
  'c-air': {
    classId: 'ss2',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'The Chemical World',
    order: 8,
    domain: 'inorganic',
    keywords: ['air', 'oxygen', 'hydrogen', 'noble gases', 'argon', 'oxides', 'amphoteric', 'ozone', 'combustion'],
  },
  'c-hal': {
    classId: 'ss2',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'The Chemical World',
    order: 9,
    domain: 'inorganic',
    keywords: ['halogens', 'chlorine', 'bleaching', 'hydrogen chloride', 'fountain experiment', 'halides', 'silver nitrate'],
  },
  'c-nsc': {
    classId: 'ss2',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'The Chemical World',
    order: 10,
    domain: 'inorganic',
    keywords: ['nitrogen', 'ammonia', 'haber', 'ostwald', 'trioxonitrate(v)', 'sulphur', 'allotropes', 'rhombic', 'monoclinic', 'h2s', 'so2', 'contact process', 'h2so4'],
  },
  'c-hydro': {
    classId: 'ss2',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'The Chemistry of Life',
    order: 11,
    domain: 'organic',
    keywords: ['homologous series', 'isomerism', 'alkanes', 'alkenes', 'alkynes', 'benzene', 'bromine water', 'ammoniacal silver nitrate', 'markovnikov'],
  },
  'c-func': {
    classId: 'ss2',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'The Chemistry of Life',
    order: 12,
    domain: 'organic',
    keywords: ['alkanols', 'lucas test', 'alkanals', 'alkanones', 'fehling', 'tollens', 'alkanoic acids', 'esterification', 'alkanoates', 'amines'],
  },

  // ─────────────────────────── SS 3 (9 Topics) ───────────────────────────
  'c-petro': {
    classId: 'ss3',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'The Chemical World',
    order: 1,
    domain: 'organic',
    keywords: ['petroleum', 'crude oil', 'bonny light', 'fractional distillation', 'bitumen', 'cracking', 'reforming', 'octane number', 'knocking', 'petrochemicals', 'natural gas'],
  },
  'c-metal': {
    classId: 'ss3',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'The Chemical World',
    order: 2,
    domain: 'inorganic',
    keywords: ['metals', 'sodium', 'downs cell', 'solvay', 'calcium', 'aluminium', 'bauxite', 'cryolite', 'iron', 'blast furnace', 'tin', 'cassiterite', 'copper', 'alloys', 'brass', 'bronze', 'duralumin'],
  },
  'c-poly': {
    classId: 'ss3',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'The Chemistry of Life',
    order: 3,
    domain: 'organic',
    keywords: ['fats and oils', 'margarine', 'saponification', 'soap', 'detergents', 'carbohydrates', 'glucose', 'starch', 'proteins', 'biuret', 'million', 'polymers', 'vulcanization', 'nylon'],
  },
  'c-env': {
    classId: 'ss3',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Chemistry & Environment',
    order: 4,
    domain: 'applied',
    keywords: ['pollution', 'acid rain', 'cfc', 'ozone depletion', 'greenhouse effect', 'eutrophication', 'oil spillage', 'sewage', 'biodegradable'],
  },
  'c-vol': {
    classId: 'ss3',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Chemistry & Industry',
    order: 5,
    domain: 'physical',
    keywords: ['titration', 'volumetric analysis', 'standard solution', 'end point', 'methyl orange', 'phenolphthalein', 'concordant titres', 'molarity'],
  },
  'c-qual': {
    classId: 'ss3',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Chemistry & Industry',
    order: 6,
    domain: 'inorganic',
    keywords: ['qualitative analysis', 'cations', 'anions', 'brown ring test', 'barium chloride', 'flame test', 'sodium hydroxide', 'aqueous ammonia', 'gas tests'],
  },
  'c-nuc': {
    classId: 'ss3',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'The Chemical World',
    order: 7,
    domain: 'physical',
    keywords: ['radioactivity', 'alpha', 'beta', 'gamma', 'half-life', 'nuclear fission', 'nuclear fusion', 'carbon-14', 'binding energy'],
  },
  'c-ethics': {
    classId: 'ss3',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'The Chemical World',
    order: 8,
    domain: 'applied',
    keywords: ['ethics', 'nafdac', 'son', 'nesrea', 'chemical waste', 'drying agents', 'water of crystallisation', 'percentage purity', 'green chemistry'],
  },
  'c-astro': {
    classId: 'ss3',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Chemistry & Environment',
    order: 9,
    domain: 'applied',
    keywords: ['astronomical chemistry', 'solar system', 'planets', 'mercury', 'jupiter', 'neptune', 'pluto', 'moon', 'atmosphere', 'hydrosphere', 'lithosphere'],
  },
};

export function getChemClassMeta(classId?: ChemClassId): ChemClassMeta {
  return CHEM_CLASSES.find((c) => c.id === (classId || 'all')) || CHEM_CLASSES[3];
}

export function filterChemTopicsByClass(topics: Topic[], classId?: ChemClassId): Topic[] {
  if (!classId || classId === 'all') return topics;
  return topics
    .filter((t) => CHEM_NERDC_MAP[t.id]?.classId === classId)
    .sort((a, b) => (CHEM_NERDC_MAP[a.id]?.order ?? 99) - (CHEM_NERDC_MAP[b.id]?.order ?? 99));
}

export const NERDC_EXTRA_DEFS: Record<
  string,
  { d?: [string, string][]; l?: [string, string][]; idea?: string; r?: string[] }[]
> = {
  'c-intro': [
    {
      d: [
        ['Chemistry', 'Chemistry is the branch of physical science that studies the composition, structure, properties and transformations of matter, together with the energy changes accompanying those transformations.'],
        ['Fine vs Applied Science', 'Chemistry bridges physics, biology, geology, medicine, engineering and agriculture—often called the "central science".'],
      ],
      idea: 'Every everyday material—clean tap water, paracetamol, cement, fertilizer, nylon fabric, soap and phone batteries—is designed or purified using chemical principles.',
      r: [
        'Positive contributions: medicines/vaccines, fertilizers/agrochemicals, treated water, fuels, plastics, textiles and food preservation.',
        'Adverse effects requiring control: environmental pollution, rusting/corrosion of iron, drug abuse/addiction, and chemical weapons.',
        'Chemistry-based careers: Chemical engineer, Pharmacist, Biochemist, Analytical chemist, Food technologist, Petroleum engineer, Metallurgist.',
      ],
    },
    {
      d: [
        ['Hypothesis', 'A hypothesis is a reasonable, testable scientific explanation proposed for an observation before thorough experimental proof.'],
        ['Scientific Theory', 'A theory is a well-tested hypothesis supported by many independent experiments that explains why a phenomenon occurs (it can still be refined if new evidence appears).'],
        ['Scientific Law', 'A scientific law is a concise statement or mathematical summary of a consistent natural pattern verified repeatedly without exception under stated conditions (e.g. Boyle’s law).'],
      ],
      idea: 'Chemists never rely on guesswork—discoveries follow the systematic Scientific Method.',
      r: [
        'Order of the Scientific Method: Observation → Problem definition → Hypothesis → Controlled Experiment → Theory → Scientific Law.',
        'A control experiment keeps all variables constant except the single factor under investigation.',
      ],
    },
    {
      d: [
        ['Desiccator', 'An airtight glass vessel containing a drying agent (such as anhydrous CaCl₂ or silica gel) used to keep solids dry and cool.'],
        ['Kipp’s apparatus', 'A three-bulb glass apparatus used for the intermittent laboratory supply of gases such as H₂S, CO₂ and H₂ without heating.'],
      ],
      idea: 'Choosing the right glass apparatus and obeying laboratory safety rules prevent accidents and guarantee accurate measurements.',
      r: [
        'Pipette & burette measure accurate liquid volumes in titration; measuring cylinder gives approximate volumes; volumetric flask prepares standard solutions.',
        'Always add concentrated acid slowly to water with stirring—NEVER pour water into concentrated tetraoxosulphate(VI) acid!',
        'Perform experiments evolving poisonous or irritating gases (Cl₂, H₂S, NO₂, SO₂, HCl) inside a fume cupboard.',
      ],
    },
  ],

  'c-part': [
    {
      d: [
        ['Atom', 'An atom is the smallest particle of an element that can take part in a chemical reaction.'],
        ['Molecule', 'A molecule is the smallest particle of an element or covalent compound capable of independent existence while retaining the chemical properties of that substance.'],
        ['Atomicity', 'Atomicity is the number of atoms in one molecule of an element: monoatomic (He, Ne, Ar = 1), diatomic (H₂, O₂, N₂, Cl₂ = 2), triatomic (O₃ = 3), tetratomic (P₄ = 4), octatomic (S₈ = 8).'],
        ['Ion', 'An ion is an electrically charged atom or group of atoms formed by the loss (cation, +) or gain (anion, −) of electrons.'],
      ],
      idea: 'All matter is built from discrete particles—atoms, molecules or ions—and Dalton’s original atomic theory has been updated to reflect subatomic particles, isotopes and nuclear chemistry.',
      r: [
        'Modified Dalton points: (1) Atoms are divisible into protons, neutrons and electrons; (2) Isotopes give atoms of the same element different masses; (3) Giant organic polymers contain thousands of atoms.',
      ],
    },
    {
      d: [
        ['Valency', 'The valency (combining power) of an element or radical is the number of hydrogen atoms (or electrons lost, gained or shared) that one atom/radical combines with or displaces.'],
        ['Radical', 'A radical (polyatomic ion) is a group of covalently bonded atoms carrying a net charge that behaves as a single unit in chemical reactions (e.g. NH₄⁺, SO₄²⁻, CO₃²⁻, NO₃⁻).'],
      ],
      idea: 'To write any neutral chemical formula quickly, write the symbols side-by-side, place their valencies above, divide by any common factor, and cross-multiply (swap) the valencies as subscripts.',
      r: [
        'Monovalent (1): H⁺, Na⁺, K⁺, Ag⁺, NH₄⁺ | OH⁻, Cl⁻, NO₃⁻, HCO₃⁻, MnO₄⁻.',
        'Divalent (2): Mg²⁺, Ca²⁺, Zn²⁺, Cu²⁺, Fe²⁺, Pb²⁺ | O²⁻, S²⁻, SO₄²⁻, SO₃²⁻, CO₃²⁻, Cr₂O₇²⁻.',
        'Trivalent (3): Al³⁺, Fe³⁺ | N³⁻, PO₄³⁻.',
      ],
    },
    {
      d: [
        ['IUPAC Nomenclature', 'The International Union of Pure and Applied Chemistry (IUPAC) system names inorganic compounds unambiguously using oxidation numbers in Roman numerals and Greek oxo-prefixes (mono-, di-, tri-, tetra-, penta-, hexa-, hepta-).'],
      ],
      idea: 'In Senior Secondary Chemistry, traditional names like "potassium permanganate" or "ferrous sulphate" are replaced by systematic IUPAC names based on oxidation states.',
      r: [
        'KMnO₄ → potassium tetraoxomanganate(VII); K₂Cr₂O₇ → potassium heptaoxodichromate(VI).',
        'NaClO → sodium oxochlorate(I); KClO₃ → potassium trioxochlorate(V); Na₂SO₃ → sodium trioxosulphate(IV).',
        'H₂SO₄ → tetraoxosulphate(VI) acid; HNO₃ → trioxonitrate(V) acid; H₃PO₄ → tetraoxophosphate(V) acid.',
      ],
    },
  ],

  'c-carbon': [
    {
      d: [
        ['Allotropy', 'Allotropy is the existence of an element in two or more different structural forms in the same physical state (e.g. diamond, graphite and fullerenes for solid carbon).'],
      ],
      idea: 'Diamond and graphite are both pure carbon—both burn in excess oxygen to form CO₂ only—yet their crystal bonding makes diamond the hardest insulator and graphite a soft electrical conductor!',
      r: [
        'Diamond: sp³ tetrahedral 3D covalent network (all 4 valence electrons bonded) → hardest natural substance, high density (3.5 g cm⁻³), non-conductor; used in rock drills & glass cutters.',
        'Graphite: sp² hexagonal flat layers held by weak van der Waals forces (1 delocalised electron per C) → conducts electricity, soft & slippery; used as electrodes, dry lubricant & pencil leads.',
        'Amorphous carbon: animal charcoal (decolourises brown sugar), wood charcoal (adsorbs poisonous gases in gas masks), lampblack/carbon black (printer’s ink, shoe polish & tyre reinforcement).',
      ],
    },
    {
      d: [
        ['Destructive distillation of coal', 'Heating bituminous coal strongly (~1000 °C) in the complete absence of air to yield coke (solid), ammoniacal liquor (liquid), coal tar (liquid) and coal gas (gaseous fuel).'],
        ['Producer gas vs Water gas', 'Producer gas is CO + N₂ (air over red-hot coke, exothermic, lower calorific value); Water gas is CO + H₂ (steam over white-hot coke at 1000 °C, endothermic, higher calorific value because both CO and H₂ burn!).'],
      ],
      idea: 'Coal formed over millions of years by carbonisation of prehistoric vegetation: Peat → Lignite → Bituminous coal → Anthracite (~90%+ carbon, cleanest smokeless coal).',
      r: [
        'Coke is a smokeless solid fuel and the chief reducing agent in iron & tin extraction.',
        'Coal tar is fractionally distilled into benzene, toluene, phenol, naphthalene and road pitch.',
        'Ammoniacal liquor is reacted with H₂SO₄ to manufacture (NH₄)₂SO₄ fertilizer.',
      ],
    },
    {
      d: [
        ['Carbon(IV) oxide (CO₂)', 'Colourless, odourless, dense acidic gas (1.5× denser than air) prepared in the lab from marble chips (CaCO₃) and dilute HCl; turns limewater Ca(OH)₂ milky.'],
        ['Carbon(II) oxide (CO)', 'Colourless, odourless, neutral, poisonous gas slightly lighter than air; combines irreversibly ~200× faster than O₂ with haemoglobin to form stable carboxyhaemoglobin.'],
      ],
      idea: 'Excess CO₂ bubbling redissolves milky CaCO₃ precipitate into soluble Ca(HCO₃)₂! Meanwhile, burning magnesium ribbon continues to burn in CO₂ (2Mg + CO₂ → 2MgO + C black specks).',
      r: [
        'Never use dilute H₂SO₄ on CaCO₃ to prepare CO₂: insoluble CaSO₄ coats the marble chips and stops the reaction!',
        'CO is prepared in the lab by dehydrating methanoic acid (HCOOH) or ethanedioic acid (H₂C₂O₄) with concentrated H₂SO₄ (pass through KOH to absorb any CO₂).',
        'Na₂CO₃ and K₂CO₃ are soluble in water and DO NOT decompose on Bunsen heating; all other common carbonates (CaCO₃, CuCO₃, ZnCO₃) are insoluble and decompose to MO + CO₂.',
      ],
    },
  ],

  'c-water': [
    {
      d: [
        ['Anomalous expansion of water', 'Water reaches its maximum density (1.00 g cm⁻³) at 4 °C and expands on freezing at 0 °C, so ice floats on liquid water and insulates aquatic life in winter.'],
      ],
      idea: 'Water is a bent (104.5°) polar molecule with strong intermolecular hydrogen bonds, giving it an unusually high boiling point (100 °C) and making it a universal solvent for ionic and polar substances.',
      r: [
        'Chemical tests for water: (1) turns white anhydrous CuSO₄ blue (CuSO₄·5H₂O); (2) turns blue dry cobalt(II) chloride paper pink (CoCl₂·6H₂O).',
        'Note: Those chemical tests prove ONLY the presence of water—to prove water is PURE, check that it boils sharply at 100 °C and freezes at 0 °C at 1 atm!',
      ],
    },
    {
      d: [
        ['Hard water', 'Hard water is water that does not lather readily with ordinary soap, forming an insoluble grey scum (calcium or magnesium octadecanoate/stearate) instead.'],
        ['Temporary hardness', 'Caused by dissolved calcium or magnesium hydrogentrioxocarbonate(IV), Ca(HCO₃)₂ or Mg(HCO₃)₂—formed when rainwater containing CO₂ flows over limestone (CaCO₃).'],
        ['Permanent hardness', 'Caused by dissolved calcium or magnesium tetraoxosulphate(VI) or chlorides (CaSO₄, MgSO₄, CaCl₂) from gypsum rocks—cannot be removed by boiling.'],
      ],
      idea: 'Temporary hardness is removed by simple boiling (Ca(HCO₃)₂ → CaCO₃↓ kettle fur + H₂O + CO₂) or calculated slaked lime Ca(OH)₂. Permanent hardness requires washing soda (Na₂CO₃), permutit/ion-exchange resin, caustic soda or distillation.',
      r: [
        'Washing soda (Na₂CO₃), permutit zeolite (Na₂Y) and distillation remove BOTH temporary and permanent hardness!',
        'Advantages of hard water: Ca²⁺ builds strong bones, teeth & snail/crab shells; tastes pleasant; does not dissolve poisonous lead pipes.',
        'Disadvantages: wastes soap as scum; deposits CaCO₃ "fur" in kettles & industrial boilers (wasting fuel and risking boiler explosions); spoils dyeing/tanning.',
      ],
    },
    {
      d: [
        ['Potash alum coagulation', 'Adding potash alum KAl(SO₄)₂·12H₂O causes fine suspended clay particles to clump together (flocculate) into heavy flocs that settle rapidly.'],
      ],
      idea: 'Municipal waterworks purify raw river/dam water through physical clarification followed by chemical disinfection so it is potable (safe for drinking).',
      r: [
        'Correct Township Water Treatment sequence: Screening/Aeration → Coagulation (add alum) → Sedimentation → Sand-bed Filtration → Chlorination (kills bacteria/germs) + pH adjustment (slaked lime) + Fluoridation (prevents tooth decay).',
      ],
    },
  ],

  'c-petro': [
    {
      d: [
        ['Petroleum (crude oil)', 'A dark, viscous, complex mixture of gaseous, liquid and solid hydrocarbons (alkanes, cycloalkanes and aromatics) formed from ancient marine organisms under heat and pressure.'],
        ['Bonny Light crude', 'Nigeria’s benchmark Niger Delta crude oil—prized worldwide as "sweet" crude because it has a very low sulphur content (< 0.2%), minimising corrosive SO₂ pollution and catalyst poisoning.'],
      ],
      idea: 'Crude oil is useless raw, so it is separated physically in a tall fractionating tower according to boiling-point ranges—shortest chains rise to the cool top, longest chains stay at the hot bottom.',
      r: [
        'Tower order (Top / coolest → Bottom / hottest): Refinery gas (C₁–C₄, LPG cooking gas) → Petrol/Gasoline (C₅–C₁₀) → Naphtha (chemical feedstock) → Kerosene (C₁₁–C₁₆, jet/lamp fuel) → Diesel/Gas oil (C₁₆–C₂₀, trucks/generators) → Lubricating oil & Paraffin wax → Bitumen/Asphalt (road surfacing & roofing).',
      ],
    },
    {
      d: [
        ['Cracking', 'The thermal or catalytic breaking down of large, high-boiling, low-demand alkane molecules (such as heavy gas oil) into smaller, high-demand branched petrol molecules AND reactive alkenes (ethene, propene).'],
        ['Catalytic reforming', 'Converting straight-chain alkanes (C₆–C₈) over a platinum/rhenium catalyst into branched-chain alkanes, cycloalkanes and benzene aromatics (plus H₂) without breaking the carbon count, raising octane quality.'],
        ['Octane number', 'A measure of a petrol’s resistance to premature auto-ignition ("engine knocking") on a scale where straight-chain heptane = 0 and branched 2,2,4-trimethylpentane (iso-octane) = 100.'],
      ],
      idea: 'Catalytic cracking (using aluminosilicate zeolite catalyst at ~500 °C) is preferred over thermal cracking because it works at lower temperatures/pressures and yields higher-octane branched alkanes.',
      r: [
        'Example cracking equation: C₁₂H₂₆ (heavy oil) → C₈H₁₈ (octane for petrol) + 2C₂H₄ (ethene for polythene plastics).',
        'Tetraethyllead(IV) Pb(C₂H₅)₄ was formerly added as an anti-knock agent, but modern unleaded petrol uses branched/aromatic hydrocarbons or ethanol/MTBE to avoid toxic lead pollution.',
      ],
    },
    {
      d: [
        ['Petrochemicals', 'Value-added industrial chemicals manufactured from petroleum fractions (especially naphtha) or natural gas—such as ethene, propene, benzene, methanol, synthetic rubber, PVC, nylon, detergents and insecticides.'],
      ],
      idea: 'Natural gas (found alongside crude oil in the Niger Delta and liquefied at Bonny Island NLNG) is ~85–95% methane (CH₄) and serves as both a clean fuel and feedstock for hydrogen & ammonia fertilizer.',
      r: [
        'Gas flaring wastes energy and releases CO₂/soot; channelling associated gas into LPG cylinders, power turbines and fertilizer plants boosts Nigeria’s economy and protects the Niger Delta.',
      ],
    },
  ],

  'c-ethics': [
    {
      d: [
        ['Green Chemistry', 'Designing chemical products and processes that reduce or eliminate the use and generation of hazardous substances, favouring renewable feedstocks and biodegradable products.'],
      ],
      idea: 'Professional chemists carry legal and ethical duties to ensure public safety, accurate drug/food quality, safe laboratory waste disposal and environmental stewardship.',
      r: [
        'Key Nigerian regulatory bodies: NAFDAC (regulates food, drugs, cosmetics, medical devices & packaged water), SON (Standards Organisation of Nigeria—industrial product standards), NESREA (environmental protection & industrial effluent enforcement), NDLEA (narcotics & controlled substances).',
        'Laboratory chemical waste: never flush heavy-metal salts (Pb²⁺, Hg²⁺, Cr₂O₇²⁻), cyanides or organic solvents down ordinary sinks—neutralise dilute acids/alkalis and collect toxic waste in labelled containers.',
      ],
    },
    {
      d: [
        ['Drying agent (desiccant)', 'A hygroscopic or deliquescent substance that removes water vapour from a moist gas WITHOUT chemically reacting with that gas!'],
      ],
      idea: 'One of the most important practical chemistry questions asks how a gas is dried and collected in the laboratory.',
      r: [
        'Ammonia (NH₃) is alkaline → dry ONLY with quicklime (CaO)! NEVER use conc. H₂SO₄ (forms (NH₄)₂SO₄) or anhydrous CaCl₂ (forms complex CaCl₂·8NH₃).',
        'Hydrogen sulphide (H₂S) is a strong reducing agent → dry with fused CaCl₂ or silica gel, NEVER conc. H₂SO₄ (which oxidises H₂S to yellow sulphur!).',
        'Acidic/neutral gases (Cl₂, HCl, SO₂, CO₂, O₂, H₂, N₂) can be dried safely by bubbling through concentrated H₂SO₄.',
        'Gas collection: Upward delivery (downward displacement of air) for gases lighter than air (H₂, NH₃); Downward delivery (upward displacement of air) for dense soluble gases (Cl₂, HCl, SO₂, CO₂, H₂S).',
      ],
    },
    {
      d: [
        ['Percentage purity', '% Purity = (mass of pure active substance found by titration ÷ total mass of impure sample dissolved) × 100%.'],
        ['Water of crystallisation (x)', 'Found by comparing the molar mass of the hydrated salt (e.g. Na₂CO₃·xH₂O = 106 + 18x) determined from titration with the anhydrous molar mass (106).'],
      ],
      idea: 'Every practical titration calculation rests on one golden bridge: Molar concentration (mol dm⁻³) = Mass concentration (g dm⁻³) ÷ Molar mass (g mol⁻¹).',
      r: [
        'Mass concentration (g dm⁻³) = mass in grams dissolved in 1000 cm³ (1 dm³) of solution.',
        'Solubility (mol dm⁻³) = (mass dissolved in V cm³ × 1000) ÷ (Molar mass × V).',
      ],
    },
  ],
};

export const NERDC_EXTRA_TEACH: Record<string, Record<number, Beat[]>> = {
  'c-intro': {
    2: [
      {
        k: 'teach',
        title: 'Essential Chemistry Apparatus & Hazard Symbols (SS1 Practical Foundation)',
        body: [
          [
            'tb',
            ['Apparatus', 'Primary Laboratory Function', 'Key Precaution'],
            [
              ['Pipette (20 or 25 cm³)', 'Delivers an exact fixed volume of liquid (aliquot)', 'Rinse with the solution it will measure; do NOT blow out the last drop'],
              ['Burette (0–50.00 cm³)', 'Delivers variable volumes accurately to 0.05 cm³ in titration', 'Rinse with titrant; remove funnel before reading bottom of meniscus at eye level'],
              ['Volumetric (standard) flask', 'Prepares a standard solution of exact known concentration', 'Fill with distilled water until meniscus touches the etched calibration mark'],
              ['Separating funnel', 'Separates immiscible liquids of different densities (kerosene + water)', 'Open stopper briefly after shaking to release vapour pressure'],
              ['Liebig condenser', 'Cools and condenses hot vapour into liquid distillate', 'Cold tap water MUST enter at the bottom jacket and leave at the top'],
              ['Desiccator', 'Stores dried solids in a moisture-free atmosphere', 'Slide the greased lid sideways—never lift straight up'],
            ],
          ],
          ['wn', 'In Liebig condensation, cold water always enters from the <b>lowest</b> inlet (counter-current flow) so the cooling jacket stays completely full!'],
        ],
      },
    ],
  },
  'c-part': {
    2: [
      {
        k: 'teach',
        title: 'Fast Oxidation-Number Method for IUPAC Names',
        body: [
          ['p', 'To find the IUPAC name of any oxo-salt or oxo-acid, set the sum of oxidation states equal to zero (or the ion charge), using K = +1, Na = +1, H = +1, O = −2:'],
          [
            'tb',
            ['Formula', 'Oxidation State Working', 'Systematic IUPAC Name'],
            [
              ['KMnO₄', '(+1) + Mn + 4(−2) = 0 ⇒ Mn = +7', 'Potassium tetraoxomanganate(VII)'],
              ['K₂Cr₂O₇', '2(+1) + 2Cr + 7(−2) = 0 ⇒ Cr = +6', 'Potassium heptaoxodichromate(VI)'],
              ['Na₂S₂O₃', '2(+1) + 2S + 3(−2) = 0 ⇒ S = +2', 'Sodium trioxothiosulphate(II) / thiosulphate'],
              ['NaClO', '(+1) + Cl + (−2) = 0 ⇒ Cl = +1', 'Sodium oxochlorate(I)'],
              ['KClO₃', '(+1) + Cl + 3(−2) = 0 ⇒ Cl = +5', 'Potassium trioxochlorate(V)'],
              ['HNO₂ vs HNO₃', 'N = +3 vs N = +5', 'Dioxonitrate(III) acid vs Trioxonitrate(V) acid'],
            ],
          ],
        ],
      },
    ],
  },
  'c-carbon': {
    0: [
      {
        k: 'teach',
        title: 'Diamond vs Graphite — Structure Explains Every Property!',
        body: [
          [
            'tb',
            ['Feature', 'Diamond', 'Graphite'],
            [
              ['Hybridisation & geometry', 'sp³ — rigid 3D tetrahedral network', 'sp² — flat hexagonal layers held by weak van der Waals forces'],
              ['Electrical conductivity', 'Non-conductor (all 4 valence e⁻ localised in σ bonds)', 'Good conductor (1 delocalised mobile electron per C atom along layers)'],
              ['Hardness & density', 'Hardest natural substance; dense (3.5 g cm⁻³)', 'Soft, flaky & slippery; less dense (2.3 g cm⁻³)'],
              ['Appearance', 'Transparent, colourless sparkling octahedron (high refractive index)', 'Opaque, black/grey with metallic lustre'],
              ['Key industrial uses', 'Drilling bits, cutting glass/stone, abrasives, jewellery', 'Inert electrodes in electrolysis, high-temperature dry lubricant, pencil leads, nuclear moderator'],
            ],
          ],
          ['key', 'Chemical proof that diamond and graphite are allotropes of the same element: equal masses (e.g. 1.2 g) burned completely in pure oxygen produce the <b>exact same mass (4.4 g) of CO₂ ONLY</b>, leaving no other product!'],
        ],
      },
    ],
  },
  'c-water': {
    1: [
      {
        k: 'teach',
        title: 'Summary of Water Hardness & Softening Reactions',
        body: [
          [
            'tb',
            ['Type of Hardness', 'Dissolved Salt(s)', 'How to Remove It'],
            [
              ['Temporary hardness', 'Ca(HCO₃)₂, Mg(HCO₃)₂', '(1) Boil: Ca(HCO₃)₂ → CaCO₃↓ + H₂O + CO₂; (2) Calculated slaked lime Ca(OH)₂; (3) Na₂CO₃; (4) Ion-exchange'],
              ['Permanent hardness', 'CaSO₄, MgSO₄, CaCl₂, MgCl₂', 'Boiling FAILS! Use: (1) Washing soda Na₂CO₃ (CaSO₄ + Na₂CO₃ → CaCO₃↓ + Na₂SO₄); (2) Permutit ion-exchange resin; (3) Caustic soda NaOH; (4) Distillation'],
            ],
          ],
          ['wn', 'Adding <b>excess</b> slaked lime Ca(OH)₂ when treating temporary hardness makes the water hard again because soluble Ca²⁺ ions remain in solution! Always use a <b>calculated</b> amount of Ca(OH)₂.'],
        ],
      },
    ],
  },
  'c-petro': {
    0: [
      {
        k: 'teach',
        title: 'Fractional Distillation of Crude Oil (Top → Bottom of Tower)',
        body: [
          [
            'tb',
            ['Fraction', 'Carbon Chain & Boiling Range', 'Major Everyday & Industrial Uses'],
            [
              ['Refinery / Petroleum gas', 'C₁ – C₄ (< 40 °C)', 'Liquefied Petroleum Gas (LPG) for domestic cooking & heating'],
              ['Petrol (Gasoline)', 'C₅ – C₁₀ (40 – 170 °C)', 'Fuel for motor car spark-ignition engines; solvent'],
              ['Naphtha', 'C₇ – C₁₂ (90 – 180 °C)', 'Primary feedstock cracked for the petrochemical & plastics industry'],
              ['Kerosene (Paraffin oil)', 'C₁₁ – C₁₆ (170 – 250 °C)', 'Aviation jet-engine fuel; domestic lamps & kerosene stoves'],
              ['Diesel oil (Gas oil)', 'C₁₆ – C₂₀ (250 – 350 °C)', 'Fuel for lorries, buses, trains, boats & electricity generators; cracked to make petrol'],
              ['Lubricating oil & Wax', 'C₂₀ – C₃₅ (> 350 °C)', 'Engine lubricants, Vaseline (petroleum jelly), candles & polish'],
              ['Bitumen / Asphalt', '> C₃₅ (non-volatile residue)', 'Tarring/surfacing roads and waterproofing roofs'],
            ],
          ],
        ],
      },
    ],
  },
  'c-ethics': {
    1: [
      {
        k: 'teach',
        title: 'Laboratory Gas Drying & Collection Master Table',
        body: [
          [
            'tb',
            ['Gas', 'Formula & Nature', 'Correct Drying Agent', 'Collection Method (Air = 14.4 VD)'],
            [
              ['Ammonia', 'NH₃ (VD = 8.5, basic, very soluble)', 'Quicklime (CaO) ONLY', 'Upward delivery (lighter than air)'],
              ['Hydrogen chloride', 'HCl (VD = 18.25, acidic, very soluble)', 'Conc. H₂SO₄ or fused CaCl₂', 'Downward delivery (denser than air)'],
              ['Chlorine', 'Cl₂ (VD = 35.5, acidic/oxidising)', 'Conc. H₂SO₄ or fused CaCl₂', 'Downward delivery or over brine'],
              ['Sulphur(IV) oxide', 'SO₂ (VD = 32, acidic/reducing)', 'Conc. H₂SO₄ or CaCl₂', 'Downward delivery'],
              ['Hydrogen sulphide', 'H₂S (VD = 17, acidic, strong reductant)', 'Fused CaCl₂ or silica gel (NEVER conc. H₂SO₄!)', 'Downward delivery or over warm water'],
              ['Hydrogen / Oxygen', 'H₂ (VD = 1) / O₂ (VD = 16)', 'Conc. H₂SO₄ or CaCl₂ (if dry needed)', 'Over water (insoluble) or upward/downward if dry'],
            ],
          ],
        ],
      },
    ],
  },
};

export const NERDC_EXTRA_TOPICS: Topic[] = [
  // 1. SS1 First Term: Introduction to Chemistry, Scientific Method & Lab Safety
  {
    id: 'c-intro',
    name: 'Introduction to Chemistry, Scientific Method & Lab Safety',
    sec: 'SS 1 · First Term · The Chemical World',
    boss: 'Intro to Chemistry & Lab Safety Test',
    goals: [
      'Explain the meaning of Chemistry, its branches, everyday applications, adverse effects and career prospects',
      'Order and apply the stages of the Scientific Method (observation, hypothesis, experiment, theory and law)',
      'Identify standard laboratory apparatus, their specific uses, safety rules and chemical hazard symbols',
    ],
    trap: 'Do NOT confuse a hypothesis with a scientific law, and NEVER pour water into concentrated H₂SO₄ when diluting—always add concentrated acid slowly into water while stirring!',
    parts: [
      {
        title: 'Meaning, applications and careers in Chemistry',
        idea: 'Chemistry studies the composition, properties and chemical changes of matter. It underpins medicine, agriculture, clean water, textiles, energy and manufacturing, opening careers from pharmacy and chemical engineering to food technology.',
        rules: [
          'Uses of chemistry: drugs & vaccines (health), NPK/urea fertilizers & pesticides (agriculture), cement & steel (housing), soap/detergents & water treatment.',
          'Adverse effects of chemistry: rusting/corrosion, industrial & plastic pollution, drug abuse, and chemical warfare.',
          'Careers requiring Chemistry: Pharmacist, Chemical/Petroleum Engineer, Biochemist, Doctor, Metallurgist, Food Technologist, Analytical Chemist.',
        ],
        ex: {
          q: 'Give two ways Chemistry improves food production in Nigeria and one adverse chemical effect farmers must guard against.',
          steps: [
            ['Manufacture of fertilizers (urea, NPK, ammonium tetraoxosulphate(VI)) and selective herbicides/insecticides', 'Boosts crop yield and protects stored grains from pests.'],
            ['Food preservatives and modern packaging polymers', 'Extend shelf-life and reduce post-harvest spoilage.'],
            ['Adverse effect: fertilizer run-off (eutrophication) and pesticide residue', 'Excess nitrates/phosphates pollute rivers, requiring responsible application.'],
          ],
        },
        tryit: {
          q: 'Which of the following is considered an adverse effect of chemistry on society?',
          ask: 'Select the adverse effect.',
          o: ['Corrosion of iron bridges and environmental pollution from industrial effluents', 'Purification of municipal water using chlorine', 'Production of analgesic drugs and vaccines', 'Vulcanization of rubber for vehicle tyres'],
          a: 0,
          h: 'Which option represents damage or harm rather than a beneficial application?',
          e: 'Corrosion (rusting), pollution and drug abuse are classic adverse effects of chemical processes.',
          fb: ['', 'Water chlorination prevents water-borne diseases like cholera.', 'Vaccines and analgesics save lives.', 'Vulcanization improves tyre durability and safety.'],
        },
      },
      {
        title: 'The Scientific Method',
        idea: 'Chemists investigate nature systematically: careful observation leads to a testable hypothesis; repeated controlled experiments either refute the hypothesis or elevate it into a scientific theory and eventually a scientific law.',
        rules: [
          'Correct sequence: Observation → Hypothesis → Experimentation → Theory → Scientific Law.',
          'Hypothesis: a tentative, testable explanation ("educated scientific guess") for an observation.',
          'Theory vs Law: a Theory explains WHY a phenomenon behaves as observed; a Law states WHAT consistently happens (often as an equation like PV = k).',
        ],
        ex: {
          q: 'A student notices iron nails rust near the Lagos lagoon faster than in dry Kano air, and proposes: "Dissolved salt speeds up rusting." What stage of the scientific method is this statement, and what comes next?',
          steps: [
            ['Stage: Hypothesis', 'It is a testable tentative explanation for the observation made.'],
            ['Next stage: Controlled Experimentation', 'Place identical clean iron nails in pure water vs salt water at the same temperature and compare rusting rates.'],
          ],
          why: [
            0,
            'Why is the student’s statement not yet a scientific theory?',
            [
              'It has not yet been tested and confirmed by repeated controlled experiments',
              'Hypotheses only apply to physics, not chemistry',
              'A theory comes before observation',
            ],
            [
              'Spot on! Only after rigorous experimental verification by many scientists does a hypothesis become a theory.',
              'Every experimental science uses hypotheses.',
              'Observation always comes before both hypothesis and theory.',
            ],
          ],
        },
        tryit: {
          q: 'What is the correct sequence of steps in the scientific method?',
          ask: 'Choose the right order.',
          o: [
            'Observation → Hypothesis → Experiment → Theory → Law',
            'Theory → Hypothesis → Observation → Law → Experiment',
            'Hypothesis → Law → Observation → Theory → Experiment',
            'Experiment → Law → Theory → Hypothesis → Observation',
          ],
          a: 0,
          h: 'You first notice something (observation), propose a testable idea (hypothesis), and test it (experiment).',
          e: 'Science begins with observation, forms a hypothesis, tests it by experiment, builds an explanatory theory, and states universal regularities as laws.',
          fb: ['', 'You cannot form a theory before observing and experimenting.', 'A law comes after extensive testing, never before observation.', 'Observation precedes hypothesis and experimentation.'],
        },
      },
      {
        title: 'Laboratory apparatus and safety rules',
        idea: 'Each piece of glassware has a specific precision role—and strict laboratory safety rules protect students from chemical burns, explosions and toxic fumes.',
        rules: [
          'Accurate volume apparatus: pipette (fixed volume, e.g. 25.0 cm³), burette (variable titration volume to 0.05 cm³), volumetric flask (standard solution). Beakers and conical flasks do NOT measure accurate volumes!',
          'Desiccator keeps solids dry; Kipp’s apparatus supplies intermittent gases (CO₂, H₂, H₂S); separating funnel separates immiscible liquids.',
          'Safety: wear goggles & lab coat; dilute conc. H₂SO₄ by pouring acid slowly into water; use a fume cupboard for Cl₂, H₂S, SO₂ and NO₂.',
        ],
        ex: {
          q: 'Why is it dangerous to pour water into concentrated tetraoxosulphate(VI) acid (H₂SO₄)?',
          steps: [
            ['Hydration of conc. H₂SO₄ is violently exothermic and water is less dense than conc. H₂SO₄', 'Water floats on the dense acid (1.84 g cm⁻³), boils explosively at the surface, and spatters corrosive acid!'],
            ['Safe procedure: add concentrated acid slowly down the side of the beaker INTO a large volume of water while stirring', 'The denser acid sinks and heat is safely absorbed by the surrounding water.'],
          ],
        },
        tryit: {
          q: 'Which laboratory apparatus is specifically designed to prepare 250 cm³ of a standard solution of exact molar concentration?',
          ask: 'Select the right glassware.',
          o: ['Volumetric (standard) flask', 'Conical flask', 'Separating funnel', 'Desiccator'],
          a: 0,
          h: 'Look for the pear-shaped flat-bottomed flask with a long narrow neck and a single calibration mark.',
          e: 'A volumetric (standard) flask has a single etched mark on its narrow neck to prepare exact standard volumes (e.g. 250.0 cm³ or 1000.0 cm³).',
          fb: ['', 'A conical flask holds the reaction mixture during titration to prevent splashing without measuring exact volume.', 'A separating funnel separates immiscible liquids like oil and water.', 'A desiccator stores dry solids free from moisture.'],
        },
      },
    ],
    spot: {
      part: 2,
      who: 'Kemi',
      q: 'How should you dilute concentrated H₂SO₄ and where should you connect tap water on a Liebig condenser?',
      lines: [
        'Wear safety goggles and a buttoned laboratory coat before handling concentrated acid',
        'Measure 50 cm³ of concentrated H₂SO₄ into a beaker and pour distilled water onto it quickly',
        'On a Liebig condenser, attach the cold water tap to the lower inlet and drain from the upper outlet',
      ],
      bad: 1,
      okfb: ['Correct—PPE protects eyes and skin.', 'Correct—counter-current flow keeps the condenser jacket full of cold water.'],
      o: [
        'Never pour water onto concentrated H₂SO₄; always add the acid slowly into water while stirring',
        'You should never wear goggles in the lab',
        'Water must enter the top of a Liebig condenser',
        'Concentrated H₂SO₄ cannot dissolve in water',
      ],
      fb: [
        'Spot on! Adding water to dense conc. H₂SO₄ causes localized boiling and dangerous acid spattering.',
        'Goggles are mandatory when handling corrosive reagents.',
        'Entering at the bottom ensures the jacket fills completely.',
        'H₂SO₄ is completely miscible with water in a strongly exothermic process.',
      ],
      h: ['Remember the lab rhyme: "Do as you oughta—add acid to water!"'],
      fix: 'Pour the required water into the beaker first, then add concentrated H₂SO₄ slowly down a glass rod while stirring continuously.',
    },
    qs: [
      { l: 1, dx: 1, q: 'In the scientific method, a tentative testable explanation proposed to account for an observation is called a', o: ['hypothesis', 'scientific law', 'conclusion', 'fact'], a: 0, e: 'A hypothesis is a testable scientific proposition formed after observation and tested via experiments.', w: ['', 'A law summarises universally verified behaviour after extensive experiments.', 'A conclusion is drawn after analysing experimental data.', 'Facts are direct verified observations.'] },
      { l: 1, q: 'Which apparatus is used in the laboratory to keep hygroscopic solids dry and free from atmospheric moisture?', o: ['Desiccator', 'Kipp’s apparatus', 'Liebig condenser', 'Burette'], a: 0, e: 'A desiccator contains a drying agent (anhydrous CaCl₂ or silica gel) in its base.', w: ['', 'Kipp’s apparatus generates intermittent gases like H₂S or CO₂.', 'Liebig condenser condenses vapours during distillation.', 'A burette delivers measured volumes of liquid in titration.'] },
      { l: 2, q: 'Why must experiments that generate chlorine (Cl₂) or hydrogen sulphide (H₂S) gas be carried out inside a fume cupboard?', o: ['Both gases are poisonous and irritating when inhaled', 'Both gases explode on contact with light', 'Fume cupboards increase the yield of gas', 'Both gases are lighter than hydrogen'], a: 0, e: 'Cl₂ chokes the lungs and H₂S is as toxic as HCN; a fume cupboard safely extracts poisonous vapours.', w: ['', 'H₂S does not explode in light.', 'A fume cupboard is for ventilation safety, not reaction yield.', 'Both Cl₂ (Mᵣ 71) and H₂S (Mᵣ 34) are much heavier than H₂ (Mᵣ 2).'] },
      { l: 2, q: 'Which of the following pairs of apparatus measures liquid volumes with the highest precision during volumetric analysis?', o: ['Pipette and burette', 'Beaker and conical flask', 'Test tube and evaporating dish', 'Thistle funnel and wash bottle'], a: 0, e: 'Pipettes and burettes are calibrated to ±0.05 cm³; beakers and conical flasks only hold approximate volumes.', w: ['', 'Graduations on beakers and conical flasks are only rough guides (±5%).', 'Test tubes and evaporating dishes are uncalibrated reaction/heating vessels.', 'Funnels and wash bottles transfer liquids without measuring volume.'] },
      { l: 2, q: 'Kipp’s apparatus is used in the school chemistry laboratory for the', o: ['intermittent supply of gases prepared from a solid and a liquid without heating', 'fractional distillation of crude oil', 'determination of relative molecular mass', 'electrolysis of acidified water'], a: 0, e: 'Opening or closing the tap brings acid into contact with or pushes it away from the solid (e.g. marble + HCl → CO₂, FeS + HCl → H₂S, Zn + H₂SO₄ → H₂).', w: ['', 'Fractionating columns distill miscible liquids.', 'Mass spectrometers or Victor Meyer apparatus find molar mass.', 'Hofmann voltameter electrolyses acidified water.'] },
      { l: 3, q: 'When diluting concentrated tetraoxosulphate(VI) acid in the laboratory, the safe procedure is to', o: ['add the acid slowly into a large volume of water while stirring', 'pour water rapidly into the concentrated acid', 'boil the concentrated acid first before adding water', 'shake equal volumes in a sealed glass bottle'], a: 0, e: 'Dense conc. H₂SO₄ sinks in water so the large heat of hydration dissipates smoothly on stirring.', w: ['', 'Water floats on conc. H₂SO₄, boils violently and spatters acid.', 'Boiling conc. H₂SO₄ is extremely hazardous.', 'Sealing an exothermic dilution builds dangerous pressure.'] },
      { l: 3, q: 'During simple distillation using a Liebig condenser, cooling tap water is passed in through the lower inlet and out through the upper outlet so that', o: ['the condenser jacket remains completely filled with cold water for efficient cooling', 'the distillate boils faster', 'water mixes directly with the distillate vapour', 'air bubbles collect at the top of the flask'], a: 0, e: 'Counter-current flow from bottom to top keeps the outer jacket completely full of cold water.', w: ['', 'The condenser cools vapour; heating happens in the distillation flask.', 'Cooling water stays in the outer jacket and never touches the inner distillate tube.', 'Filling from the bottom expels air pockets rather than trapping them.'] },
      { l: 1, q: 'Which of the following professions does NOT require a strong foundation in Chemistry?', o: ['Jurisprudence / Legal drafting', 'Pharmacy', 'Chemical engineering', 'Food technology'], a: 0, e: 'Pharmacy, chemical engineering and food technology all rely directly on chemical science.', w: ['', 'Pharmacists formulate, analyse and dispense chemical drugs.', 'Chemical engineers scale up chemical reactions into industrial plants.', 'Food technologists analyse nutrients, preservatives and food chemistry.'] },
      { l: 3, q: 'A bottle of concentrated trioxonitrate(V) acid in a school store carries a symbol showing liquid dripping onto a hand and a metal bar. This hazard symbol warns that the chemical is', o: ['corrosive', 'radioactive', 'biohazardous', 'non-flammable'], a: 0, e: 'The dripping test-tube damaging skin and metal is the international GHS symbol for corrosive substances (conc. acids and alkalis).', w: ['', 'Radioactive uses a three-bladed trefoil symbol.', 'Biohazard uses three interlocking crescents.', 'There is no dripping-liquid symbol for non-flammable materials.'] },
      { l: 4, q: 'How does a scientific theory differ from a scientific law?', o: ['A theory explains WHY a natural phenomenon occurs, whereas a law summarises WHAT consistently happens', 'A hypothesis is more proven than a law', 'A law is an untested guess whereas a theory is a mathematical equation', 'A theory can never be modified even when new experimental evidence contradicts it'], a: 0, e: 'For example, Boyle’s Law states P ∝ 1/V (what happens), while the Kinetic Theory of Gases explains why gas pressure rises when volume shrinks (more frequent wall collisions).', w: ['', 'A law has withstood universal experimental verification; a hypothesis is initial.', 'That reverses the meaning of law and hypothesis.', 'Scientific theories are refined whenever new evidence demands it (as Dalton’s atomic theory was).'] },
    ],
  },

  // 2. SS1 First Term: Particulate Nature of Matter, Valency & IUPAC Nomenclature
  {
    id: 'c-part',
    name: 'Particulate Nature of Matter, Valency & IUPAC Nomenclature',
    sec: 'SS 1 · First Term · The Chemical World',
    boss: 'Particles, Formulae & IUPAC Mastery Test',
    goals: [
      'Distinguish between atoms, molecules and ions, state the atomicity of elements, and explain modern modifications to Dalton’s Atomic Theory',
      'Use valencies of elements and common radicals to deduce chemical formulae of compounds',
      'Determine oxidation numbers and write systematic IUPAC names for binary compounds, oxo-acids and oxo-salts',
    ],
    trap: 'Atomicity is the number of atoms in ONE molecule—ozone (O₃) is triatomic, white phosphorus (P₄) is tetratomic, and rhombic sulphur (S₈) is octatomic, whereas noble gases (He, Ne, Ar) are monoatomic (1)!',
    parts: [
      {
        title: 'Atoms, molecules, atomicity and ions',
        idea: 'Matter is not continuous—evidence from diffusion, Brownian motion, osmosis and crystal cleavage proves matter consists of tiny discrete particles: atoms, molecules or ions.',
        rules: [
          'Atomicity of common elements: He, Ne, Ar = 1 (monoatomic); H₂, O₂, N₂, F₂, Cl₂, Br₂, I₂ = 2 (diatomic); O₃ = 3 (triatomic); P₄ = 4 (tetratomic); S₈ = 8 (octatomic).',
          'Cation (+): formed when a neutral atom loses electron(s), e.g. Na → Na⁺ + e⁻ (protons > electrons).',
          'Anion (−): formed when a neutral atom gains electron(s), e.g. Cl + e⁻ → Cl⁻ (electrons > protons).',
        ],
        ex: {
          q: 'State the atomicity of (i) Argon, (ii) Chlorine gas, (iii) Ozone, and (iv) White phosphorus.',
          steps: [
            ['Argon (Ar) = 1 (monoatomic)', 'Noble gases have full valence shells and exist as single uncombined atoms.'],
            ['Chlorine (Cl₂) = 2 (diatomic); Ozone (O₃) = 3 (triatomic)', 'Count the subscript atoms in one free molecule.'],
            ['White phosphorus (P₄) = 4 (tetratomic)', 'Each molecule contains four covalently bonded P atoms at the corners of a tetrahedron.'],
          ],
        },
        tryit: {
          q: 'What are the atomicities of neon, oxygen gas, ozone and phosphorus vapour (P₄) respectively?',
          ask: 'Pick the matching sequence.',
          o: ['1, 2, 3 and 4', '2, 2, 3 and 1', '1, 1, 2 and 4', '2, 3, 4 and 8'],
          a: 0,
          h: 'Ne is a noble gas (1); oxygen gas is O₂ (2); ozone is O₃ (3); phosphorus is P₄ (4).',
          e: 'Ne = 1, O₂ = 2, O₃ = 3, P₄ = 4.',
          fb: ['', 'Neon is a monoatomic noble gas (1), not diatomic.', 'Oxygen gas is diatomic (O₂ = 2), and ozone is triatomic (O₃ = 3).', '8 is the atomicity of sulphur (S₈).'],
        },
      },
      {
        title: 'Valency, radicals and writing chemical formulae',
        idea: 'A compound is electrically neutral: the total positive charge (valency) from cations must balance the total negative charge (valency) from anions or acid radicals.',
        rules: [
          'Key radicals & charges: ammonium NH₄⁺ (+1), hydroxide OH⁻ (−1), trioxonitrate(V) NO₃⁻ (−1), hydrogentrioxocarbonate(IV) HCO₃⁻ (−1), trioxocarbonate(IV) CO₃²⁻ (−2), tetraoxosulphate(VI) SO₄²⁻ (−2), tetraoxophosphate(V) PO₄³⁻ (−3).',
          'Enclose a polyatomic radical in brackets ONLY when two or more of that radical are needed, e.g. Ca(NO₃)₂, Al₂(SO₄)₃, (NH₄)₂CO₃.',
        ],
        ex: {
          q: 'Write the chemical formula of aluminium tetraoxosulphate(VI) and count the total number of atoms in one formula unit.',
          steps: [
            ['Write ions and valencies: Al³⁺ (valency 3) and SO₄²⁻ (valency 2)', 'Swap valencies as subscripts: Al gets 2 and the SO₄ radical gets 3 in brackets.'],
            ['Formula: Al₂(SO₄)₃', 'Check neutrality: 2(+3) + 3(−2) = +6 − 6 = 0.'],
            ['Total atoms = 2 Al + 3 S + (3 × 4) O = 2 + 3 + 12 = 17 atoms', 'Multiply every subscript inside brackets by the subscript outside!'],
          ],
        },
        tryit: {
          q: 'If element X belongs to Group 2 (valency 2) and combines with the tetraoxophosphate(V) radical PO₄³⁻ (valency 3), what is the formula of the salt formed?',
          ask: 'Swap the valencies cleanly.',
          o: ['X₃(PO₄)₂', 'X₂(PO₄)₃', 'XPO₄', 'X₃PO₄'],
          a: 0,
          h: 'X²⁺ needs 3 ions (+6) to balance 2 ions of PO₄³⁻ (−6).',
          e: 'Crossing valency 2 on X²⁺ and valency 3 on PO₄³⁻ gives X₃(PO₄)₂ (like Ca₃(PO₄)₂).',
          fb: ['', 'You forgot to swap the valencies—3 goes to X and 2 goes to (PO₄).', 'Valencies are 2 and 3, not equal.', 'Put brackets around PO₄ with subscript 2 so charges balance: 3(+2) + 2(−3) = 0.'],
        },
      },
      {
        title: 'Systematic IUPAC nomenclature',
        idea: 'IUPAC names tell you the exact composition and oxidation state of variable-valency elements using Roman numerals in brackets right after the element or oxo-anion stem.',
        rules: [
          'Count oxygen atoms with mono- (1, oxo-), di- (2, dioxo-), tri- (3, trioxo-), tetra- (4, tetraoxo-), hepta- (7, heptaoxo-).',
          'Name the central non-metal/metal with "-ate" followed by its oxidation number in Roman numerals: e.g. SO₃²⁻ is trioxosulphate(IV); SO₄²⁻ is tetraoxosulphate(VI).',
          'Binary salts of transition metals: FeCl₂ = iron(II) chloride; FeCl₃ = iron(III) chloride; Cu₂O = copper(I) oxide; CuO = copper(II) oxide.',
        ],
        ex: {
          q: 'Give the systematic IUPAC name of NaClO₃ (the active weedkiller salt).',
          steps: [
            ['Find oxidation number of Cl in NaClO₃', '(+1) + Cl + 3(−2) = 0 ⇒ Cl − 5 = 0 ⇒ Cl = +5.'],
            ['Count oxygens (3 = trioxo) + chlorate + (V)', 'IUPAC name: sodium trioxochlorate(V).'],
          ],
        },
        tryit: {
          q: 'What is the systematic IUPAC name of K₂Cr₂O₇?',
          ask: 'Calculate the oxidation number of Cr first.',
          o: [
            'Potassium heptaoxodichromate(VI)',
            'Potassium heptaoxochromate(VII)',
            'Potassium tetraoxochromate(VI)',
            'Dipotasium dichromate(XII)',
          ],
          a: 0,
          h: '2(+1) + 2Cr + 7(−2) = 0 ⇒ 2Cr = +12 ⇒ Cr = +6! Note 7 oxygens (heptaoxo) and 2 Cr atoms (dichromate).',
          e: '7 oxygens = heptaoxo, 2 chromiums = dichromate, and each Cr has oxidation state +6 → potassium heptaoxodichromate(VI).',
          fb: ['', 'There are two Cr atoms (dichromate), and each Cr is +6, not +7.', 'K₂CrO₄ (4 oxygens) is potassium tetraoxochromate(VI); K₂Cr₂O₇ has 7 oxygens.', 'Divide +12 by the 2 Cr atoms to get +6 per chromium atom!'],
        },
      },
    ],
    spot: {
      part: 1,
      who: 'Sadiq',
      q: 'Write the formula of ammonium trioxocarbonate(IV) and count the hydrogen atoms in one formula unit.',
      lines: [
        'Ammonium ion is NH₄⁺ (valency 1) and trioxocarbonate(IV) ion is CO₃²⁻ (valency 2)',
        'Swapping valencies gives the formula NH₄₂CO₃',
        'Therefore one formula unit contains 8 hydrogen atoms',
      ],
      bad: 1,
      okfb: ['Correct ions and valencies.', 'Once written properly as (NH₄)₂CO₃, 2 × 4 = 8 H atoms is right!'],
      o: [
        'A polyatomic radical must be enclosed in brackets when its subscript is 2 or more: (NH₄)₂CO₃, not NH₄₂CO₃',
        'Ammonium has valency 2, so the formula is NH₄CO₃',
        'Trioxocarbonate(IV) is CO₄²⁻',
        'There are 42 hydrogen atoms',
      ],
      fb: [
        'Exactly! Without brackets, NH₄₂CO₃ looks like 1 nitrogen and 42 hydrogens! Always write (NH₄)₂CO₃.',
        'NH₄⁺ has charge +1, so two NH₄⁺ ions are needed for one CO₃²⁻.',
        'Trioxocarbonate(IV) has 3 oxygens: CO₃²⁻.',
        'NH₄₂CO₃ was a bracket mistake; the true formula (NH₄)₂CO₃ has 8 hydrogens.',
      ],
      h: ['Look closely at how NH₄⁺ was multiplied by 2—what is missing around NH₄?'],
      fix: 'Enclose the ammonium radical in brackets: (NH₄)₂CO₃ (2 N, 8 H, 1 C and 3 O = 14 atoms total).',
    },
    qs: [
      { l: 1, dx: 1, q: 'Which of the following modifications of Dalton’s Atomic Theory accounts for the existence of ³⁵Cl and ³⁷Cl?', o: ['Atoms of the same element may not all have the same mass because of different neutron numbers (isotopes)', 'Atoms can neither be created nor destroyed', 'All matter is made of indivisible particles', 'Chemical combination occurs only in large polymer ratios'], a: 0, e: 'Isotopes of chlorine have 17 protons each, but 18 and 20 neutrons respectively, disproving Dalton’s claim that all atoms of an element have identical mass.', w: ['', 'That is Dalton’s original postulate.', 'Subatomic particles disproved indivisibility, whereas ³⁵Cl/³⁷Cl specifically illustrate isotopy.', '³⁵Cl and ³⁷Cl are isotopes, not giant polymers.'] },
      { l: 1, q: 'What is the atomicity of a molecule of rhombic sulphur (S₈)?', o: ['8 (octatomic)', '2 (diatomic)', '4 (tetratomic)', '1 (monoatomic)'], a: 0, e: 'One molecule of solid sulphur is a puckered ring of 8 sulphur atoms, S₈.', w: ['', 'O₂, N₂ and Cl₂ are diatomic (2).', 'White phosphorus (P₄) is tetratomic (4).', 'Noble gases (He, Ne, Ar) are monoatomic (1).'] },
      { l: 2, q: 'What is the chemical formula of calcium tetraoxophosphate(V)?', o: ['Ca₃(PO₄)₂', 'Ca₂(PO₄)₃', 'CaPO₄', 'Ca₃PO₄'], a: 0, e: 'Ca²⁺ (valency 2) and PO₄³⁻ (valency 3) cross-multiply to give Ca₃(PO₄)₂.', w: ['', 'Valencies were not swapped: Ca is 2 and PO₄ is 3.', 'Charges +2 and −3 do not cancel 1:1.', 'Brackets and subscript 2 are required on PO₄³⁻.'] },
      { l: 2, q: 'How many total atoms are present in one formula unit of hydrated sodium trioxocarbonate(IV) decahydrate, Na₂CO₃·10H₂O?', o: ['36', '16', '26', '19'], a: 0, e: 'Na₂CO₃ = 2 + 1 + 3 = 6 atoms; 10H₂O = 10 × (2 + 1) = 30 atoms; total = 6 + 30 = 36 atoms!', w: ['', '16 counts only 10 + 6 without multiplying H₂O’s 3 atoms by 10.', '26 misses 10 atoms from 10H₂O.', 'Count carefully: (2 Na + 1 C + 3 O) + 10(2 H + 1 O) = 6 + 30 = 36.'] },
      { l: 2, q: 'The systematic IUPAC name of H₂SO₃ is', o: ['trioxosulphate(IV) acid', 'tetraoxosulphate(VI) acid', 'dioxosulphate(II) acid', 'hydrogen sulphide'], a: 0, e: '2(+1) + S + 3(−2) = 0 ⇒ S = +4; 3 oxygens = trioxo → trioxosulphate(IV) acid.', w: ['', 'Tetraoxosulphate(VI) acid is H₂SO₄.', 'There are 3 oxygens (trioxo) and S is +4.', 'Hydrogen sulphide is H₂S.'] },
      { l: 3, q: 'What is the IUPAC name of NaClO (the active bleaching salt in household Jik/bleach)?', o: ['Sodium oxochlorate(I)', 'Sodium trioxochlorate(V)', 'Sodium chloride', 'Sodium tetraoxochlorate(VII)'], a: 0, e: '(+1) + Cl + (−2) = 0 ⇒ Cl = +1; 1 oxygen = oxo → sodium oxochlorate(I).', w: ['', 'Sodium trioxochlorate(V) is NaClO₃.', 'Sodium chloride is NaCl (no oxygen).', 'Sodium tetraoxochlorate(VII) is NaClO₄.'] },
      { l: 3, q: 'What is the IUPAC name of Fe₂(SO₄)₃?', o: ['Iron(III) tetraoxosulphate(VI)', 'Iron(II) tetraoxosulphate(VI)', 'Diiron trisulphate(IV)', 'Iron(III) trioxosulphate(IV)'], a: 0, e: 'Three SO₄²⁻ ions give −6, so two Fe ions total +6 ⇒ each Fe is +3 → iron(III) tetraoxosulphate(VI).', w: ['', 'Iron(II) tetraoxosulphate(VI) is FeSO₄.', 'Use Roman oxidation states, not Greek prefixes on cations, and SO₄²⁻ has S = +6.', 'SO₄²⁻ has 4 oxygens (tetraoxo) and S = +6.'] },
      { l: 3, q: 'An ion M³⁺ has 10 electrons and 14 neutrons. What are the atomic number and mass number of neutral atom M?', o: ['Atomic number = 13, Mass number = 27', 'Atomic number = 10, Mass number = 24', 'Atomic number = 7, Mass number = 21', 'Atomic number = 13, Mass number = 24'], a: 0, e: 'M³⁺ lost 3 electrons to leave 10 e⁻, so neutral M has 10 + 3 = 13 protons (Al). Mass number A = 13 + 14 = 27.', w: ['', '10 is the electron count of the M³⁺ ion; add back the 3 lost electrons to get Z = 13.', 'Positive ions LOSE electrons, so Z = 10 + 3 = 13, not 10 − 3.', 'Mass number = protons (13) + neutrons (14) = 27.'] },
      { l: 4, q: 'What is the oxidation number of phosphorus in calcium tetraoxophosphate(V), Ca₃(PO₄)₂?', o: ['+5', '+3', '+10', '−3'], a: 0, e: 'In PO₄³⁻: P + 4(−2) = −3 ⇒ P = +5 (which is also stated directly by the Roman numeral V!).', w: ['', '+3 is the oxidation state of P in PO₃³⁻.', '+10 is for two P atoms combined; oxidation number is always per single atom (+5).', '−3 is the charge on the entire PO₄³⁻ radical, not phosphorus.'] },
      { l: 4, q: 'An oxide of nitrogen contains 30.4% nitrogen and 69.6% oxygen by mass (N = 14, O = 16). If its vapour density is 46, what are its molecular formula and IUPAC name?', o: ['N₂O₄ — dinitrogen tetraoxide', 'NO₂ — nitrogen(IV) oxide', 'N₂O — nitrogen(I) oxide', 'N₂O₅ — dinitrogen pentaoxide'], a: 0, e: 'Mole ratio N : O = (30.4/14) : (69.6/16) = 2.17 : 4.35 = 1 : 2 → empirical formula NO₂ (mass 46). Mᵣ = 2 × VD = 2 × 46 = 92 ⇒ n = 92/46 = 2 → N₂O₄!', w: ['', 'NO₂ is the empirical formula (Mᵣ 46), but VD = 46 means Mᵣ = 2 × 46 = 92 = N₂O₄!', 'N₂O has Mᵣ = 44 (VD = 22).', 'N₂O₅ has Mᵣ = 108 (VD = 54).'] },
    ],
  },

  // 3. SS1 Third Term: Carbon, Allotropes, Coal & Oxides of Carbon
  {
    id: 'c-carbon',
    name: 'Carbon, Allotropes, Coal & Oxides of Carbon',
    sec: 'SS 1 · Third Term · The Chemistry of Life',
    boss: 'Carbon & Its Compounds Mastery Test',
    goals: [
      'Compare crystalline allotropes (diamond, graphite, fullerenes) and amorphous forms of carbon by bonding, properties and uses',
      'Describe coal types, destructive distillation of coal, and distinguish producer gas from water gas',
      'Prepare, test and contrast carbon(IV) oxide (CO₂), carbon(II) oxide (CO) and trioxocarbonates(IV)',
    ],
    trap: 'Graphite conducts electricity because each sp² carbon uses only 3 of its 4 valence electrons in covalent bonds, leaving 1 delocalised electron—whereas diamond uses ALL 4 electrons in sp³ tetrahedral bonds!',
    parts: [
      {
        title: 'Allotropes of carbon: diamond, graphite & amorphous carbon',
        idea: 'Carbon exhibits allotropy: crystalline diamond and graphite plus amorphous forms (coal, coke, wood charcoal, animal charcoal and lampblack).',
        rules: [
          'Diamond: tetrahedral sp³ giant covalent network → hardest natural substance, non-conductor; drills, saws & jewellery.',
          'Graphite: layered hexagonal sp² rings with mobile delocalised electrons & weak interlayer van der Waals forces → conducts electricity, slippery lubricant & pencil lead.',
          'Animal charcoal decolourises crude brown sugar; wood charcoal adsorbs toxic gases; lampblack makes printer’s ink & black tyre rubber.',
        ],
        ex: {
          q: 'Why is graphite used both as an electrode in electrolysis and as a lubricant in hot heavy machinery where oil would char?',
          steps: [
            ['Electrode use: delocalised fourth valence electron per carbon + chemical inertness + high melting point', 'Conducts electric current freely without reacting with most electrolytes.'],
            ['High-temperature lubricant use: weak van der Waals forces between flat hexagonal layers', 'Layers slide easily over one another and do not decompose or vaporise at high temperatures like hydrocarbon grease.'],
          ],
        },
        tryit: {
          q: 'Which form of amorphous carbon is specifically used in sugar refineries to remove brown colouring matter from raw sugar solution?',
          ask: 'Select the best decolorising adsorbent.',
          o: ['Animal charcoal (bone black)', 'Diamond dust', 'Anthracite coal', 'Lampblack'],
          a: 0,
          h: 'Prepared by heating animal bones in the absence of air—famous for decolourising liquids!',
          e: 'Animal charcoal (containing finely divided carbon on a calcium phosphate porous skeleton) strongly adsorbs coloured impurities from brown sugar.',
          fb: ['', 'Diamond is crystalline and does not adsorb dyes.', 'Anthracite is a high-rank solid fuel coal.', 'Lampblack (soot) is used for printer’s ink, shoe polish and rubber tyres.'],
        },
      },
      {
        title: 'Coal, destructive distillation & gaseous fuels',
        idea: 'Destructive distillation heats bituminous coal (~1000 °C) without air to yield four industrial products, while passing air or steam over red-hot coke yields producer gas or water gas.',
        rules: [
          'Coal rank (increasing % carbon): Peat (~50–60%) → Lignite → Bituminous coal → Anthracite (~90%+ C).',
          '4 products of destructive distillation of coal: Coke (solid reducing agent/fuel), Ammoniacal liquor ((NH₄)₂SO₄ fertilizer), Coal tar (benzene, phenol, naphthalene, pitch), Coal gas (H₂, CH₄, CO fuel).',
          'Producer gas (CO + N₂, lower heat value because N₂ is non-combustible) vs Water gas (CO + H₂, higher heat value because BOTH CO and H₂ burn!).',
        ],
        ex: {
          q: 'Explain why water gas has a much higher calorific (heating) value than producer gas.',
          steps: [
            ['Water gas consists of equimolar CO and H₂ (C + H₂O(g) → CO + H₂)', 'Both CO and H₂ burn exothermically in oxygen to release large amounts of heat.'],
            ['Producer gas consists of ~1/3 CO and ~2/3 non-combustible N₂ from air', 'Around 67% of producer gas is inert nitrogen that absorbs heat instead of burning!'],
          ],
        },
        tryit: {
          q: 'Which of the following sets correctly lists the four main products obtained from the destructive distillation of bituminous coal?',
          ask: 'Identify all four products.',
          o: [
            'Coke, ammoniacal liquor, coal tar and coal gas',
            'Petrol, kerosene, diesel and bitumen',
            'Charcoal, pyroligneous acid, wood tar and wood gas',
            'Diamond, graphite, fullerene and lampblack',
          ],
          a: 0,
          h: 'One solid residue, two liquid fractions, and one combustible gas mixture from coal.',
          e: 'Heating bituminous coal in the absence of air produces coke, ammoniacal liquor, coal tar and coal gas.',
          fb: ['', 'Those come from fractional distillation of crude petroleum.', 'Those come from destructive distillation of WOOD (pyroligneous acid contains ethanoic acid & methanol).', 'Those are allotropes/forms of carbon, not coal distillation fractions.'],
        },
      },
      {
        title: 'Oxides of carbon (CO₂ and CO) & trioxocarbonates(IV)',
        idea: 'Carbon forms two key oxides: acidic, non-combustible CO₂ (fire extinguishers, fizzy drinks, photosynthesis) and neutral, toxic, reducing CO (blast-furnace extraction).',
        rules: [
          'Lab prep of CO₂: CaCO₃(s) + 2HCl(aq) → CaCl₂(aq) + H₂O(l) + CO₂(g). Test: turns limewater Ca(OH)₂ milky (CaCO₃↓); excess CO₂ clears it back to colourless Ca(HCO₃)₂(aq).',
          'CO₂ extinguishes most fires because it is 1.5× denser than air (blankets the fire) and does not support ordinary combustion—EXCEPT burning Mg ribbon!',
          'CO is a neutral oxide (insoluble in water & alkalis), burns with a pale blue flame (2CO + O₂ → 2CO₂), reduces heated CuO/Fe₂O₃ to metal, and causes carbon monoxide poisoning.',
        ],
        ex: {
          q: 'What is observed when carbon(IV) oxide is bubbled into limewater (a) for a short time, and (b) in excess? Write equations.',
          steps: [
            ['(a) Short time: limewater turns milky (cloudy white)', 'Ca(OH)₂(aq) + CO₂(g) → CaCO₃(s)↓ (insoluble white precipitate) + H₂O(l).'],
            ['(b) In excess: milkiness disappears to give a clear colourless solution', 'CaCO₃(s) + H₂O(l) + CO₂(g) → Ca(HCO₃)₂(aq) (soluble calcium hydrogentrioxocarbonate(IV) — temporary hard water!).'],
          ],
        },
        tryit: {
          q: 'Why is carbon(II) oxide (CO) extremely poisonous when inhaled in poorly ventilated rooms with generators or charcoal stoves?',
          ask: 'Select the biochemical reason.',
          o: [
            'It combines irreversibly with haemoglobin to form stable carboxyhaemoglobin, starving tissues of oxygen',
            'It dissolves in blood water to form concentrated tetraoxosulphate(VI) acid',
            'It freezes lung alveoli like dry ice',
            'It oxidises red blood cells into solid iron(III) oxide',
          ],
          a: 0,
          h: 'How does CO compete with O₂ for haemoglobin in red blood cells?',
          e: 'CO binds to haemoglobin ~200× more strongly than O₂ to form stable bright-red carboxyhaemoglobin, preventing oxygen transport and causing suffocation.',
          fb: ['', 'CO contains no sulphur and is a neutral oxide.', 'Dry ice is solid CO₂ at −78 °C, not CO.', 'CO is a reducing agent, not an oxidising agent, and acts by blocking haemoglobin.'],
        },
      },
    ],
    spot: {
      part: 2,
      who: 'Tunde',
      q: 'How do you prepare a steady stream of pure dry CO₂ in the lab from marble chips (CaCO₃)?',
      lines: [
        'Place marble chips (CaCO₃) inside a flat-bottomed flask or Kipp’s apparatus',
        'Pour dilute tetraoxosulphate(VI) acid (H₂SO₄) onto the marble chips to generate rapid CO₂',
        'Dry the gas through concentrated H₂SO₄ and collect by downward delivery',
      ],
      bad: 1,
      okfb: ['Good setup for room-temperature gas generation.', 'Correct drying and collection—CO₂ is acidic and 1.5× denser than air.'],
      o: [
        'Use dilute HCl (or HNO₃), NOT dilute H₂SO₄—insoluble CaSO₄ coats the marble chips and stops the reaction almost immediately',
        'Marble chips require strong Bunsen heating with water',
        'CO₂ is basic so conc. H₂SO₄ absorbs it',
        'CO₂ is lighter than air so use upward delivery',
      ],
      fb: [
        'Spot on! CaCO₃ + H₂SO₄ forms an impervious crust of insoluble CaSO₄ around the marble, halting effervescence after a few seconds.',
        'Acid + carbonate reacts briskly at room temperature.',
        'CO₂ is an acidic oxide, so conc. H₂SO₄ dries it cleanly without reacting.',
        'Mᵣ(CO₂) = 44 vs air ≈ 29, so CO₂ is denser than air (downward delivery).',
      ],
      h: ['Is calcium tetraoxosulphate(VI), CaSO₄, soluble or insoluble in water?'],
      fix: 'React marble chips (CaCO₃) with dilute hydrochloric acid (2HCl) so soluble CaCl₂ forms and CO₂ evolves steadily.',
    },
    qs: [
      { l: 1, dx: 1, q: 'Graphite conducts electricity whereas diamond does not because graphite', o: ['possesses mobile delocalised electrons between its hexagonal sp² carbon layers', 'has a higher density than diamond', 'contains free metallic ions in its lattice', 'is soluble in water'], a: 0, e: 'Each carbon in graphite bonds covalently to 3 neighbours, leaving 1 free valence electron per atom to conduct current.', w: ['', 'Diamond (3.5 g cm⁻³) is denser than graphite (2.3 g cm⁻³).', 'Graphite is a pure covalent non-metal with no metal ions.', 'Both diamond and graphite are completely insoluble in all solvents.'] },
      { l: 1, q: 'Which rank of coal has the highest percentage of carbon (~90%+) and burns with almost no smoke?', o: ['Anthracite', 'Peat', 'Lignite', 'Bituminous coal'], a: 0, e: 'Coal maturity rises from peat → lignite → bituminous → anthracite (highest carbon content, highest calorific value).', w: ['', 'Peat is the youngest, lowest-carbon stage.', 'Lignite (brown coal) has ~65% carbon.', 'Bituminous is common household/coking coal (~80% C), below anthracite.'] },
      { l: 2, q: 'Producer gas is a mixture of', o: ['carbon(II) oxide and nitrogen (CO + N₂)', 'carbon(II) oxide and hydrogen (CO + H₂)', 'methane and carbon(IV) oxide (CH₄ + CO₂)', 'propane and butane'], a: 0, e: 'Passing air (O₂ + N₂) through red-hot coke converts O₂ to CO while N₂ passes through unchanged → CO + N₂.', w: ['', 'CO + H₂ is water gas (synthesis gas).', 'CH₄ + CO₂ is biogas.', 'Propane + butane is Liquefied Petroleum Gas (LPG).'] },
      { l: 2, q: 'Which trioxocarbonate(IV) salt does NOT decompose into an oxide and CO₂ upon ordinary Bunsen heating?', o: ['Na₂CO₃ (sodium trioxocarbonate(IV))', 'CaCO₃', 'CuCO₃', 'ZnCO₃'], a: 0, e: 'Anhydrous Na₂CO₃ and K₂CO₃ are thermally stable to Bunsen heat (note: NaHCO₃ decomposes to Na₂CO₃ + H₂O + CO₂, then stops!).', w: ['', 'CaCO₃ decomposes at ~900 °C to quicklime CaO + CO₂.', 'Green CuCO₃ decomposes easily on heating to black CuO + CO₂.', 'White ZnCO₃ decomposes to ZnO (yellow when hot, white when cold) + CO₂.'] },
      { l: 3, q: 'A gas X burns in air with a pale blue flame to form a gas Y that turns limewater milky, but X itself has no effect on litmus or limewater. Gas X is', o: ['carbon(II) oxide (CO)', 'carbon(IV) oxide (CO₂)', 'sulphur(IV) oxide (SO₂)', 'ammonia (NH₃)'], a: 0, e: 'CO is neutral (no effect on litmus or limewater) and burns with a characteristic blue flame: 2CO + O₂ → 2CO₂.', w: ['', 'CO₂ does not burn and immediately turns limewater milky.', 'SO₂ is acidic, does not burn with a blue flame to CO₂, and turns acidified K₂Cr₂O₇ green.', 'NH₃ is alkaline (turns red litmus blue).'] },
      { l: 3, q: 'When a strip of burning magnesium ribbon is lowered into a gas jar of carbon(IV) oxide (CO₂), it', o: ['continues to burn brightly, leaving white magnesium oxide ash and black specks of carbon', 'goes out immediately without any reaction', 'explodes to form methane', 'turns the gas jar deep purple'], a: 0, e: 'Burning Mg is hot enough to strip oxygen from CO₂: 2Mg(s) + CO₂(g) → 2MgO(s) (white) + C(s) (black specks)! Never use a CO₂ extinguisher on a magnesium metal fire.', w: ['', 'CO₂ extinguishes wood/petrol fires, NOT reactive burning metals like Mg!', 'No hydrogen is present to form methane.', 'MgO is white and C is black.'] },
      { l: 2, q: 'Solid carbon(IV) oxide ("dry ice") is preferred over ordinary ice for refrigerating ice-cream vans and stage fog because it', o: ['sublimes directly from solid to gas at −78 °C without leaving any messy liquid wetness', 'melts at +4 °C into pure water', 'is flammable and warms food gently', 'is a strong alkaline solid'], a: 0, e: 'Dry ice sublimes directly to cold CO₂(g) at −78.5 °C, keeping goods dry and much colder than 0 °C water ice.', w: ['', 'Water ice melts at 0 °C; dry ice sublimes at −78.5 °C.', 'CO₂ is completely non-flammable.', 'CO₂ is weakly acidic, not alkaline.'] },
      { l: 3, q: 'In the laboratory preparation of pure carbon(II) oxide by dehydrating ethanedioic acid crystals (H₂C₂O₄) with warm concentrated H₂SO₄, why is the evolved gas bubbled through concentrated KOH solution?', o: ['To absorb the carbon(IV) oxide (CO₂) co-produced alongside CO', 'To dry the carbon(II) oxide', 'To oxidise CO into CO₂', 'To dissolve the CO and leave CO₂ behind'], a: 0, e: 'H₂C₂O₄ → CO(g) + CO₂(g) + H₂O(l). Concentrated KOH absorbs acidic CO₂ (2KOH + CO₂ → K₂CO₃ + H₂O) while neutral CO passes through!', w: ['', 'Aqueous KOH adds moisture; drying uses conc. H₂SO₄ or CaCl₂.', 'KOH is an alkali, not an oxidising agent.', 'CO is neutral and insoluble in KOH(aq).'] },
      { l: 3, q: 'Destructive distillation of wood (as opposed to coal) yields wood charcoal, wood tar, wood gas and a watery distillate called pyroligneous acid, which contains mainly', o: ['ethanoic acid, methanol and propanone', 'benzene, phenol and naphthalene', 'petrol and kerosene', 'tetraoxosulphate(VI) acid and ammonia'], a: 0, e: 'Pyroligneous acid from wood distillation is the classic historical source of methanol ("wood spirit"), ethanoic acid and propanone.', w: ['', 'Benzene, phenol and naphthalene come from coal tar.', 'Petrol and kerosene come from crude petroleum.', 'Ammoniacal liquor comes from coal distillation; H₂SO₄ comes from the Contact process.'] },
      { l: 4, q: 'If 5.0 g of impure limestone (CaCO₃, Mᵣ = 100) reacts with excess dilute HCl to liberate 0.896 dm³ of CO₂ at s.t.p. (molar gas volume = 22.4 dm³), what is the percentage purity of the limestone?', o: ['80%', '40%', '89.6%', '50%'], a: 0, e: 'n(CO₂) = 0.896 / 22.4 = 0.040 mol. From CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂, n(CaCO₃) = 0.040 mol ⇒ mass pure CaCO₃ = 0.040 × 100 = 4.0 g. % purity = (4.0 / 5.0) × 100% = 80%.', w: ['', '0.040 × 100 = 4.0 g pure out of 5.0 g = 80%, not 40%.', 'Divide gas volume by 22.4 dm³ mol⁻¹ first.', '4.0 g ÷ 5.0 g × 100% = 80%.'] },
    ],
  },

  // 4. SS2 First Term: Water, Hardness of Water & Municipal Treatment
  {
    id: 'c-water',
    name: 'Water, Hardness of Water & Municipal Water Treatment',
    sec: 'SS 2 · First Term · Chemistry & Environment',
    boss: 'Water & Hardness Mastery Test',
    goals: [
      'Explain hydrogen bonding in water, its anomalous density maximum at 4 °C, chemical tests for water and criteria for purity',
      'Distinguish temporary hardness from permanent hardness by causative ions, equations and softening methods',
      'Describe the step-by-step municipal purification of town water and the specific role of alum, sand filters, chlorine, lime and fluoride',
    ],
    trap: 'Turning white anhydrous CuSO₄ blue (or blue CoCl₂ pink) ONLY proves that a liquid CONTAINS water—even muddy salty water passes that test! Only a sharp boiling point of 100 °C (and freezing point 0 °C) at 1 atm proves water is PURE.',
    parts: [
      {
        title: 'Properties and tests for water',
        idea: 'Water (H₂O) has a bent V-shape (104.5°) and strong intermolecular hydrogen bonds, explaining why H₂O is a liquid boiling at 100 °C whereas H₂S (heavier, Mᵣ = 34) is a gas boiling at −60 °C!',
        rules: [
          'Presence of water test #1: white anhydrous CuSO₄(s) + 5H₂O(l) → blue hydrated CuSO₄·5H₂O(s).',
          'Presence of water test #2: blue anhydrous CoCl₂(s) + 6H₂O(l) → pink hydrated CoCl₂·6H₂O(s).',
          'Purity of water test: boils at a constant 100 °C at 760 mmHg (1 atm), freezes at 0 °C, density = 1.00 g cm⁻³ at 4 °C, neutral to litmus (pH 7).',
        ],
        ex: {
          q: 'A colourless liquid turns dry blue cobalt(II) chloride paper pink and boils over the range 102–104 °C at 1 atm. What can you deduce about the liquid?',
          steps: [
            ['Turns dry blue CoCl₂ paper pink', 'Confirms the liquid contains water.'],
            ['Boils above 100 °C over a range (102–104 °C)', 'Proves the water is IMPURE—dissolved impurities elevate the boiling point and destroy its sharpness!'],
          ],
        },
        tryit: {
          q: 'Which observation conclusively proves that a colourless, odourless liquid is PURE water at standard atmospheric pressure?',
          ask: 'Distinguish presence test from purity test.',
          o: [
            'It boils sharply at 100 °C and freezes sharply at 0 °C',
            'It turns white anhydrous copper(II) tetraoxosulphate(VI) blue',
            'It turns blue cobalt(II) chloride paper pink',
            'It dissolves sodium chloride crystals',
          ],
          a: 0,
          h: 'Dilute salt solution ALSO turns CuSO₄ blue and CoCl₂ pink!',
          e: 'Sharp melting (0 °C) and boiling (100 °C) points are the definitive physical criteria for pure water.',
          fb: ['', 'Any aqueous solution or damp liquid turns anhydrous CuSO₄ blue.', 'Any liquid containing water turns blue CoCl₂ pink.', 'Dilute acids and impure water also dissolve NaCl.'],
        },
      },
      {
        title: 'Temporary vs permanent hardness of water',
        idea: 'Hard water contains dissolved Ca²⁺ or Mg²⁺ ions that precipitate soap (sodium octadecanoate, NaSt) as insoluble grey scum: Ca²⁺(aq) + 2St⁻(aq) → CaSt₂(s)↓.',
        rules: [
          'Temporary hardness: caused by Ca(HCO₃)₂ or Mg(HCO₃)₂. Removed by boiling (Ca(HCO₃)₂ → CaCO₃↓ + H₂O + CO₂) or calculated slaked lime Ca(OH)₂.',
          'Permanent hardness: caused by CaSO₄, MgSO₄, CaCl₂ or MgCl₂. Removed by washing soda (Na₂CO₃), permutit ion-exchange resin, caustic soda or distillation.',
          'Synthetic soapless detergents do NOT form scum in hard water because their calcium and magnesium salts are soluble in water!',
        ],
        ex: {
          q: 'Write the balanced chemical equation showing how washing soda (Na₂CO₃) softens water with permanent hardness caused by CaSO₄.',
          steps: [
            ['Double decomposition precipitates Ca²⁺ as insoluble CaCO₃', 'CaSO₄(aq) + Na₂CO₃(aq) → CaCO₃(s)↓ + Na₂SO₄(aq).'],
            ['Why the water is now soft', 'Ca²⁺ ions are removed from solution; the remaining Na⁺ ions do not precipitate soap!'],
          ],
          why: [
            1,
            'Why doesn’t the dissolved Na₂SO₄ left behind cause hardness?',
            [
              'Sodium ions (Na⁺) are already the cation in soluble soap, so they never form insoluble scum',
              'Na₂SO₄ evaporates during washing',
              'SO₄²⁻ precipitates soap',
            ],
            [
              'Exactly! Ordinary soap is a sodium salt (RCOO⁻Na⁺), so Na⁺ ions stay completely soluble.',
              'Na₂SO₄ is a non-volatile ionic salt.',
              'Only multivalent cations like Ca²⁺, Mg²⁺ and Fe²⁺ precipitate soap anions.',
            ],
          ],
        },
        tryit: {
          q: 'Which of the following substances causes temporary hardness of water?',
          ask: 'Pick the hydrogentrioxocarbonate(IV) salt.',
          o: [
            'Calcium hydrogentrioxocarbonate(IV), Ca(HCO₃)₂',
            'Calcium tetraoxosulphate(VI), CaSO₄',
            'Magnesium chloride, MgCl₂',
            'Sodium trioxocarbonate(IV), Na₂CO₃',
          ],
          a: 0,
          h: 'Temporary hardness decomposes on boiling to deposit CaCO₃ kettle fur.',
          e: 'Ca(HCO₃)₂ and Mg(HCO₃)₂ decompose on boiling into insoluble carbonates, so they cause temporary hardness.',
          fb: ['', 'CaSO₄ causes permanent hardness (not decomposed by boiling).', 'MgCl₂ causes permanent hardness.', 'Na₂CO₃ (washing soda) SOFTENS hard water rather than causing hardness!'],
        },
      },
      {
        title: 'Municipal water purification',
        idea: 'Township waterworks turn turbid, microbe-laden river water into safe drinking water through coagulation, sedimentation, sand filtration and chlorination.',
        rules: [
          'Potash alum KAl(SO₄)₂·12H₂O: coagulates/flocculates fine colloidal clay particles so they settle in sedimentation tanks.',
          'Chlorine (or bleaching powder / NaClO): added in controlled trace amounts to kill disease-causing bacteria (typhoid, cholera).',
          'Slaked lime Ca(OH)₂ adjusts acidic pH to prevent pipe corrosion; trace sodium fluoride (≈1 ppm F⁻) prevents dental caries (tooth decay); potassium iodide prevents goitre.',
        ],
        ex: {
          q: 'State the exact role of (i) potash alum, (ii) sand/gravel beds, and (iii) chlorine gas in a municipal water treatment plant.',
          steps: [
            ['(i) Potash alum: Coagulation', 'Al³⁺ neutralises charges on suspended clay colloids, clumping them into heavy flocs that sink.'],
            ['(ii) Sand & gravel beds: Filtration', 'Traps remaining suspended solid particles physically, yielding clear water (still NOT germ-free!).'],
            ['(iii) Chlorine: Disinfection / Sterilisation', 'Forms oxochlorate(I) acid (HOCl) which kills pathogenic microorganisms.'],
          ],
        },
        tryit: {
          q: 'In municipal water purification, potash alum is added to raw river water primarily to',
          ask: 'Identify the function of alum.',
          o: [
            'coagulate fine suspended clay particles so they settle rapidly',
            'kill cholera and typhoid bacteria',
            'remove permanent hardness caused by CaSO₄',
            'prevent tooth decay in children',
          ],
          a: 0,
          h: 'Think of flocculation/clumping before sedimentation.',
          e: 'Alum coagulates colloidal dirt/clay; chlorine kills bacteria; fluoride prevents tooth decay.',
          fb: ['', 'Chlorine (or ozone/UV) kills bacteria, not alum.', 'Alum actually adds sulphate ions—washing soda removes permanent hardness.', 'Fluoride ions (fluoridation) prevent tooth decay.'],
        },
      },
    ],
    spot: {
      part: 1,
      who: 'Ngozi',
      q: 'A borehole sample contains dissolved CaSO₄ and Ca(HCO₃)₂. How can ALL hardness be removed simply?',
      lines: [
        'Ca(HCO₃)₂ causes temporary hardness and CaSO₄ causes permanent hardness',
        'Boil the water vigorously for 15 minutes and filter off the white CaCO₃ precipitate',
        'The filtered water is now completely soft and lathers immediately with soap',
      ],
      bad: 2,
      okfb: ['Correct classification of both salts.', 'Boiling does decompose Ca(HCO₃)₂ into insoluble CaCO₃.'],
      o: [
        'Boiling removes ONLY temporary hardness—the dissolved CaSO₄ remains in the filtrate, so the water still has permanent hardness!',
        'Boiling converts CaSO₄ into pure steam',
        'Ca(HCO₃)₂ cannot decompose on boiling',
        'Filtering re-dissolves CaCO₃',
      ],
      fb: [
        'Spot on! To remove BOTH temporary and permanent hardness completely, treat with washing soda (Na₂CO₃), permutit ion-exchange resin, or distill the water.',
        'CaSO₄ is non-volatile and thermally stable at 100 °C.',
        'Ca(HCO₃)₂ readily decomposes at 100 °C.',
        'CaCO₃ is insoluble in boiled water.',
      ],
      h: ['What happened to the CaSO₄ when the water was boiled?'],
      fix: 'Boiling removes only Ca(HCO₃)₂; add washing soda (Na₂CO₃) or pass through an ion-exchange resin to remove the remaining CaSO₄ permanent hardness.',
    },
    qs: [
      { l: 1, dx: 1, q: 'Water has a much higher boiling point (100 °C) than hydrogen sulphide, H₂S (−60 °C), mainly because water molecules are held together by', o: ['strong intermolecular hydrogen bonds', 'electrovalent bonds', 'metallic bonds', 'coordinate covalent bonds'], a: 0, e: 'High electronegativity of oxygen creates strong O–H···O hydrogen bonds between H₂O molecules, whereas H₂S has only weak van der Waals forces.', w: ['', 'Water is covalent, not ionic.', 'Metallic bonds occur in metals.', 'Within neutral H₂O, bonds are polar covalent; between H₂O molecules, hydrogen bonds raise the boiling point.'] },
      { l: 1, q: 'When a drop of water is added to white anhydrous copper(II) tetraoxosulphate(VI) powder, the colour changes to', o: ['blue', 'pink', 'brick-red', 'pale green'], a: 0, e: 'CuSO₄(s) (white) + 5H₂O(l) → CuSO₄·5H₂O(s) (blue) with evolution of heat.', w: ['', 'Anhydrous CoCl₂ turns from blue to pink.', 'Brick-red is Ca²⁺ flame or Cu₂O precipitate.', 'Pale green is aqueous Fe²⁺.'] },
      { l: 2, q: 'Which of the following methods removes BOTH temporary and permanent hardness of water?', o: ['Addition of washing soda (Na₂CO₃) or use of an ion-exchange resin', 'Boiling the water strongly', 'Filtration through clean sand and gravel', 'Addition of chlorine gas'], a: 0, e: 'Na₂CO₃ precipitates all Ca²⁺/Mg²⁺ as insoluble carbonates; ion-exchange swaps Ca²⁺/Mg²⁺ for Na⁺.', w: ['', 'Boiling removes temporary hardness only.', 'Sand filtration removes insoluble suspended solids, not dissolved Ca²⁺/Mg²⁺ ions.', 'Chlorination kills germs without softening water.'] },
      { l: 2, q: 'The white scale ("fur") deposited inside electric kettles in hard-water areas consists mainly of', o: ['calcium trioxocarbonate(IV), CaCO₃', 'sodium chloride, NaCl', 'calcium chloride, CaCl₂', 'potash alum'], a: 0, e: 'Boiling decomposes soluble Ca(HCO₃)₂ into insoluble CaCO₃ scale + H₂O + CO₂.', w: ['', 'NaCl is very soluble in hot water.', 'CaCl₂ is very soluble and deliquescent.', 'Alum is soluble and added at waterworks.'] },
      { l: 2, q: 'Which of the following is an ADVANTAGE of drinking moderately hard water?', o: ['It supplies calcium ions needed for strong bones, teeth and shells of aquatic animals', 'It forms grey scum with toilet soap', 'It coats industrial boiler pipes with insulating scale', 'It requires more soap for laundry'], a: 0, e: 'Dissolved Ca²⁺ aids bone/tooth development, helps crustaceans/snails build shells, and prevents lead dissolution from old lead pipes.', w: ['', 'Scum formation is a disadvantage.', 'Boiler scale wastes fuel and risks explosions (disadvantage).', 'Wasting soap is an economic disadvantage.'] },
      { l: 3, q: 'What is the correct sequence of stages in the purification of river water for municipal town supply?', o: ['Coagulation → Sedimentation → Filtration → Chlorination', 'Chlorination → Coagulation → Boiling → Distillation', 'Distillation → Filtration → Sedimentation → Coagulation', 'Filtration → Coagulation → Evaporation → Freezing'], a: 0, e: 'Raw water is dosed with alum (coagulation), left for flocs to settle (sedimentation), passed through sand beds (filtration), and sterilised with Cl₂ (chlorination).', w: ['', 'Large-scale town water is never boiled or distilled (far too expensive!).', 'Distillation is not used for municipal tap water.', 'Evaporation and freezing are not town waterworks steps.'] },
      { l: 3, q: 'Why do synthetic soapless detergents lather easily even in hard water whereas ordinary soap forms scum?', o: ['The calcium and magnesium salts of soapless detergents are soluble in water', 'Soapless detergents precipitate CaSO₄', 'Soapless detergents boil the water chemically', 'Ordinary soap contains no sodium ions'], a: 0, e: 'Alkylbenzenesulphonate anions in detergents form water-soluble Ca²⁺/Mg²⁺ salts, so no insoluble scum precipitates.', w: ['', 'CaSO₄ is already in permanent hard water.', 'Detergents do not boil water.', 'Ordinary soap is sodium octadecanoate (contains Na⁺).'] },
      { l: 3, q: 'Trace amounts of fluorine compounds (≈1 ppm fluoride) are added to municipal drinking water in order to', o: ['prevent dental caries (tooth decay)', 'coagulate clay particles', 'soften permanent hardness', 'bleach brown humic stains'], a: 0, e: 'Fluoride strengthens tooth enamel as fluorapatite, reducing tooth decay.', w: ['', 'Alum coagulates clay.', 'Na₂CO₃ softens permanent hardness.', 'Activated carbon or chlorine removes colour/germs.'] },
      { l: 3, q: 'Why must ONLY a calculated (stoichiometric) quantity of slaked lime, Ca(OH)₂, be used in Clark’s method for softening temporary hard water?', o: ['Excess Ca(OH)₂ dissolves slightly to put fresh Ca²⁺ ions back into the water, making it hard again!', 'Excess Ca(OH)₂ turns the water into concentrated acid', 'Ca(OH)₂ explodes in cold water', 'Slaked lime contains chlorine'], a: 0, e: 'Ca(HCO₃)₂ + Ca(OH)₂ → 2CaCO₃↓ + 2H₂O removes ALL Ca²⁺ only when 1 : 1 molar; any excess Ca(OH)₂ re-introduces Ca²⁺ hardness!', w: ['', 'Ca(OH)₂ is an alkali, not an acid.', 'Slaked lime is already hydrated CaO and dissolves calmly.', 'Slaked lime is Ca(OH)₂; bleaching powder contains chlorine.'] },
      { l: 4, q: 'In a Permutit (zeolite, Na₂Y) ion-exchange water softener, an exhausted resin column that has become saturated with Ca²⁺ and Mg²⁺ ions is regenerated for reuse by flushing it with', o: ['concentrated sodium chloride solution (brine)', 'dilute tetraoxosulphate(VI) acid', 'limewater, Ca(OH)₂', 'boiling river water'], a: 0, e: 'High [Na⁺] in concentrated brine drives the equilibrium CaY(s) + 2Na⁺(aq) → Na₂Y(s) + Ca²⁺(aq), restoring the sodium zeolite!', w: ['', 'Acid would destroy or protonate the zeolite rather than restoring Na₂Y.', 'Limewater adds more Ca²⁺!', 'River water cannot displace bound Ca²⁺.'] },
    ],
  },

  // 5. SS3 First Term: Petroleum (Crude Oil), Cracking, Octane Rating & Petrochemicals
  {
    id: 'c-petro',
    name: 'Petroleum (Crude Oil), Cracking, Octane Rating & Petrochemicals',
    sec: 'SS 3 · First Term · The Chemical World',
    boss: 'Petroleum & Petrochemicals Mastery Test',
    goals: [
      'Describe the origin of crude oil, why Nigerian Bonny Light crude is prized, and order the fractions from fractional distillation by boiling point and uses',
      'Distinguish thermal cracking, catalytic cracking and catalytic reforming, and write balanced cracking equations',
      'Explain engine knocking, define octane number using n-heptane (0) and 2,2,4-trimethylpentane (100), and identify key petrochemicals and natural gas uses',
    ],
    trap: 'Fractional distillation of crude oil is a PHYSICAL separation (no covalent bonds broken, no alkenes formed), whereas CRACKING is a CHEMICAL decomposition that breaks C–C bonds to produce shorter alkanes + alkenes!',
    parts: [
      {
        title: 'Nigerian crude oil & fractional distillation',
        idea: 'Nigerian Niger Delta crude ("Bonny Light") is low-sulphur ("sweet") crude oil. In a refinery fractionating column, vaporised crude rises and condenses on trays at different temperatures according to molecular size and boiling point.',
        rules: [
          'Sweet crude = very low sulphur content (< 0.5%), so it produces far less SO₂ acid-rain gas and does not poison refinery platinum catalysts.',
          'Order from top (lowest b.p., shortest carbon chain, lightest, least viscous, most flammable) to bottom: Refinery gas (LPG) → Petrol → Naphtha → Kerosene → Diesel/Gas oil → Lubricating oil/Wax → Bitumen.',
        ],
        ex: {
          q: 'Arrange Kerosene, Bitumen, Petrol and Diesel oil in order of INCREASING boiling point, and state one major use of Bitumen.',
          steps: [
            ['Order of increasing boiling point: Petrol (40–170 °C) < Kerosene (170–250 °C) < Diesel oil (250–350 °C) < Bitumen (> 350 °C)', 'Longer carbon chains have stronger van der Waals intermolecular forces and higher boiling points.'],
            ['Use of Bitumen: road surfacing (asphalt) and waterproofing roofs', 'It is the sticky, non-volatile black residue at the bottom of the tower.'],
          ],
        },
        tryit: {
          q: 'Why is Nigeria’s Bonny Light crude oil highly sought after on the international market?',
          ask: 'Select the chemical reason.',
          o: [
            'It has a very low sulphur content ("sweet crude") and yields a high proportion of light fuels like petrol and kerosene',
            'It consists of 100% pure octane ready for car engines without refining',
            'It contains high levels of tetraoxosulphate(VI) acid',
            'It is denser than bitumen and does not burn',
          ],
          a: 0,
          h: 'Think of what "sweet" vs "sour" crude means in petroleum chemistry.',
          e: 'Low-sulphur ("sweet") light crude requires less desulphurisation, causes less SO₂ pollution, and gives high yields of premium light distillates.',
          fb: ['', 'All crude oil is a mixture that must be refined by fractional distillation.', 'Sulphur compounds are undesirable impurities in crude oil.', 'Bonny Light is a light, low-density crude rich in volatile hydrocarbons.'],
        },
      },
      {
        title: 'Cracking, reforming and octane number',
        idea: 'Fractional distillation produces too much heavy gas oil and not enough petrol. Refineries solve both fuel quantity and fuel quality using cracking and catalytic reforming.',
        rules: [
          'Cracking: heavy alkane → shorter alkane (petrol) + alkene(s) (petrochemical monomers). Catalytic cracking uses zeolite (SiO₂/Al₂O₃) at ~500 °C.',
          'Reforming: straight-chain alkane → branched alkane or cycloalkane/benzene (same carbon count, much higher octane rating!).',
          'Octane scale: n-heptane = 0 (knocks badly); 2,2,4-trimethylpentane ("iso-octane") = 100 (smooth combustion). Petrol marked 92 octane performs like 92% iso-octane + 8% n-heptane.',
        ],
        ex: {
          q: 'Complete the cracking equation: C₁₄H₃₀ → C₈H₁₈ + 2X. Identify X and state one industrial use of X.',
          steps: [
            ['Balance C and H atoms: C left = 14 − 8 = 6 ⇒ 2X has 6 C so X has 3 C; H left = 30 − 18 = 12 ⇒ 2X has 12 H so X has 6 H', 'X = C₃H₆ (propene).'],
            ['Industrial use of propene (C₃H₆)', 'Polymerised to manufacture polypropene (crates, ropes, carpets, chairs).'],
          ],
          why: [
            0,
            'Why MUST at least one product of cracking an alkane be an unsaturated alkene?',
            [
              'An alkane has 2n + 2 hydrogens; splitting it into two saturated alkanes would require 2n + 4 hydrogens (2 extra H atoms that aren’t there!)',
              'Catalysts add oxygen atoms',
              'Alkanes cannot contain fewer than 8 carbons',
            ],
            [
              'Brilliant conservation-of-atoms reasoning! Because no extra H₂ is added, at least one fragment must have formula CₘH₂ₘ (an alkene).',
              'Cracking takes place in the absence of oxygen so the hydrocarbons do not burn.',
              'Methane (CH₄) has 1 carbon.',
            ],
          ],
        },
        tryit: {
          q: 'A petrol sample that behaves in an engine like a mixture of 85% 2,2,4-trimethylpentane and 15% n-heptane has an octane number of',
          ask: 'Read the octane rating directly.',
          o: ['85', '15', '100', '70'],
          a: 0,
          h: 'Octane number equals the volume percentage of 2,2,4-trimethylpentane (iso-octane) in the reference blend.',
          e: 'By definition, octane rating = % of 2,2,4-trimethylpentane (assigned 100) in an iso-octane / n-heptane blend = 85.',
          fb: ['', '15% is the n-heptane (octane 0) percentage.', '100 is pure 2,2,4-trimethylpentane.', 'Do not subtract 15 from 85; read the iso-octane percentage directly (85).'],
        },
      },
      {
        title: 'Natural gas and Nigerian petrochemicals',
        idea: 'Natural gas (chiefly methane CH₄) and cracked alkenes (ethene, propene) + aromatics (benzene, methylbenzene) feed the petrochemical industry—turning oil & gas into plastics, fibres, synthetic rubber, detergents and fertilizers.',
        rules: [
          'Natural gas (~90% CH₄): cleanest fossil fuel; trace foul-smelling ethyl mercaptan (ethanethiol, C₂H₅SH) is added to LPG/natural gas so leaks can be smelled immediately!',
          'Key petrochemical chains: Ethene → polythene, PVC, ethanol, ethane-1,2-diol (antifreeze); Benzene → nylon, polystyrene, detergents, phenol.',
        ],
        ex: {
          q: 'Pure butane/propane (LPG) and methane are odourless. Why can you smell a cooking-gas leak in the kitchen immediately?',
          steps: [
            ['Refineries deliberately add trace volatile organic sulphur compounds (thiols/mercaptans such as ethanethiol, C₂H₅SH)', 'Provides a pungent warning smell at tiny concentrations long before an explosive gas-air mixture builds up!'],
          ],
        },
        tryit: {
          q: 'Which petroleum process is a CHEMICAL reaction that simultaneously increases petrol supply and provides alkenes for manufacturing plastics?',
          ask: 'Contrast physical separation with chemical breakdown.',
          o: ['Catalytic cracking', 'Fractional distillation', 'Sedimentation', 'Desalting of crude oil'],
          a: 0,
          h: 'Which process breaks covalent C–C bonds in heavy gas oil?',
          e: 'Catalytic cracking chemically cleaves C–C bonds in heavy fractions into branched petrol alkanes and alkene monomers.',
          fb: ['', 'Fractional distillation only separates existing hydrocarbons physically by boiling point.', 'Sedimentation settles insoluble solids.', 'Desalting washes dissolved salts out of raw crude before distillation.'],
        },
      },
    ],
    spot: {
      part: 1,
      who: 'Emeka',
      q: 'How can a refinery convert straight-chain octane (C₈H₁₈, low octane rating) into high-octane branched/aromatic petrol components without losing carbon chain length?',
      lines: [
        'Straight-chain alkanes auto-ignite prematurely in car cylinders, causing engine knocking',
        'To convert C₈H₁₈ into branched isomers or dimethylbenzene (C₈H₁₀), pass it through thermal cracking at 900 °C',
        'Branched and aromatic hydrocarbons burn smoothly and raise the octane number of the petrol',
      ],
      bad: 1,
      okfb: ['True—straight-chain alkanes have very low octane numbers (n-heptane = 0).', 'True—branching and aromatisation dramatically boost octane number.'],
      o: [
        'Use catalytic REFORMING (over a platinum catalyst), NOT thermal cracking—cracking breaks C₈ into tiny C₂–C₄ gases, whereas reforming rearranges/cyclises C₈ molecules!',
        'Use simple filtration',
        'Straight-chain alkanes have octane number 100',
        'Add n-heptane to raise the octane number',
      ],
      fb: [
        'Spot on! Reforming isomerises and aromatises C₆–C₈ naphtha fractions over Pt without breaking them into tiny gaseous fragments.',
        'Filtration cannot rearrange covalent C–C skeletons.',
        '2,2,4-trimethylpentane is 100; straight-chain n-heptane is 0.',
        'Adding n-heptane LOWERS the octane number.',
      ],
      h: ['Does cracking keep 8 carbons together, or split the chain into smaller pieces? Which process rearranges C₈ molecules?'],
      fix: 'Pass the C₈ fraction over a platinum catalyst at ~500 °C (catalytic reforming) to isomerise/cyclise straight chains into high-octane branched alkanes and aromatics.',
    },
    qs: [
      { l: 1, dx: 1, q: 'Fractional distillation of crude oil is based on differences in the', o: ['boiling points of its hydrocarbon fractions', 'chemical reactivity with oxygen', 'solubility of fractions in water', 'octane numbers of its alkenes'], a: 0, e: 'Hydrocarbons of different chain lengths condense at different tray temperatures according to their boiling points.', w: ['', 'Air/oxygen is excluded from the fractionating column to prevent fire.', 'All hydrocarbon fractions are insoluble in water.', 'Crude oil contains virtually no alkenes before cracking.'] },
      { l: 1, q: 'Which petroleum fraction is collected at the very top of the fractionating column (below 40 °C) and bottled for domestic cooking gas (LPG)?', o: ['Refinery / petroleum gas (propane & butane)', 'Naphtha', 'Kerosene', 'Bitumen'], a: 0, e: 'C₁–C₄ gases have the lowest boiling points and exit at the cool top; propane and butane are liquefied under pressure as LPG.', w: ['', 'Naphtha boils around 90–180 °C.', 'Kerosene boils around 170–250 °C.', 'Bitumen is the non-volatile residue at the bottom.'] },
      { l: 2, q: 'On the octane rating scale for motor spirit (petrol), an octane number of 0 is assigned to', o: ['n-heptane', '2,2,4-trimethylpentane', 'benzene', 'methane'], a: 0, e: 'Straight-chain n-heptane knocks severely (octane = 0), whereas branched 2,2,4-trimethylpentane burns smoothly (octane = 100).', w: ['', '2,2,4-trimethylpentane (iso-octane) is assigned 100!', 'Benzene is an aromatic ring with high anti-knock value (>100).', 'Methane is natural gas, not the liquid petrol zero-reference.'] },
      { l: 2, q: 'When dodecane (C₁₂H₂₆) undergoes catalytic cracking to yield one molecule of octane (C₈H₁₈) and one other molecule Z, what is Z?', o: ['Butene (C₄H₈)', 'Butane (C₄H₁₀)', 'Ethene (C₂H₄)', 'Propene (C₃H₆)'], a: 0, e: 'C₁₂H₂₆ → C₈H₁₈ + Z ⇒ C = 12 − 8 = 4, H = 26 − 18 = 8 ⇒ Z = C₄H₈ (butene) (since the question specifies ONE molecule of Z!).', w: ['', 'C₄H₁₀ would require 28 H atoms total on the right.', 'Two molecules of C₂H₄ would form, not one molecule Z.', 'C₃H₆ leaves 1 C and 2 H unaccounted for.'] },
      { l: 2, q: 'The main constituent of natural gas found in Nigeria’s Niger Delta is', o: ['methane (CH₄)', 'butane (C₄H₁₀)', 'ethene (C₂H₄)', 'carbon(II) oxide (CO)'], a: 0, e: 'Natural gas contains ~85–95% methane (CH₄) with small amounts of ethane, propane and butane.', w: ['', 'Butane is the main component of cylinder LPG from refineries.', 'Ethene is a manufactured petrochemical from cracking.', 'CO is absent from natural gas.'] },
      { l: 3, q: 'How does catalytic reforming differ from catalytic cracking?', o: ['Reforming converts straight-chain alkanes into branched/cyclic/aromatic hydrocarbons of similar carbon count, whereas cracking splits large alkanes into smaller ones', 'Reforming is a physical process whereas cracking is biological', 'Cracking increases carbon chain length whereas reforming shortens it', 'Reforming produces bitumen from methane'], a: 0, e: 'Reforming upgrades petrol quality (octane rating) over Pt catalyst; cracking converts heavy gas oil into petrol + alkenes.', w: ['', 'Both are high-temperature catalytic chemical processes.', 'Cracking shortens carbon chains (polymerisation lengthens them).', 'Bitumen is a heavy crude residue, not made from methane.'] },
      { l: 3, q: 'Why have most countries phased out tetraethyllead(IV), Pb(C₂H₅)₄, as an anti-knock additive in petrol?', o: ['Exhaust lead compounds are cumulative neurotoxins and poison catalytic converters in cars', 'Tetraethyllead lowers the octane number of petrol', 'Lead freezes petrol at 25 °C', 'Lead reacts explosively with nitrogen in air'], a: 0, e: 'Lead causes brain damage in children and coats Pt/Rh catalytic converters, rendering them useless.', w: ['', 'Tetraethyllead raises octane number; it was banned for toxicity, not ineffectiveness.', 'It does not freeze petrol.', 'Lead does not explode with N₂.'] },
      { l: 2, q: 'Which fraction of crude oil serves both as aviation turbine (jet) fuel and domestic illuminating/stove oil?', o: ['Kerosene (paraffin oil)', 'Diesel oil', 'Naphtha', 'Lubricating oil'], a: 0, e: 'Refined kerosene (C₁₁–C₁₆) powers jet aircraft engines and domestic kerosene lamps/stoves.', w: ['', 'Diesel powers heavy compression-ignition road vehicles and generators.', 'Naphtha is cracked for petrochemicals.', 'Lubricating oil reduces friction in engine parts.'] },
      { l: 3, q: 'Which of the following substances is NOT a petrochemical?', o: ['Portland cement', 'Poly(chloroethene) (PVC)', 'Polystyrene', 'Synthetic soapless detergent'], a: 0, e: 'Cement is an inorganic silicate material made from limestone and clay; PVC, polystyrene and alkylbenzenesulphonate detergents are petrochemicals.', w: ['', 'PVC is made from petrochemically derived chloroethene.', 'Polystyrene comes from petrochemical phenylethene (styrene).', 'Synthetic detergents are made from petrochemical alkylbenzenes.'] },
      { l: 4, q: 'Why is a tiny trace of ethanethiol (ethyl mercaptan, C₂H₅SH) blended into domestic Liquefied Petroleum Gas (LPG) cylinders?', o: ['To give the naturally odourless gas a strong smell so dangerous leaks are detected early', 'To increase the calorific heat output by 50%', 'To solidify the gas inside the steel cylinder', 'To prevent rusting of the burner nozzle'], a: 0, e: 'Pure propane and butane are odourless; pungent C₂H₅SH alerts users immediately if a valve or hose leaks.', w: ['', 'At parts-per-million levels it adds negligible heat.', 'LPG liquefies by pressure, not mercaptan.', 'Sulphur compounds do not prevent rusting.'] },
    ],
  },

  // 6. SS3 Third Term: Chemical Ethics, Regulatory Standards & Practical Mastery
  {
    id: 'c-ethics',
    name: 'Chemical Ethics, Standards & Practical Gas/Titration Mastery',
    sec: 'SS 3 · Third Term · The Chemical World',
    boss: 'Chemical Ethics & Practical Mastery Test',
    goals: [
      'Evaluate ethical, legal and environmental responsibilities in chemistry and state the roles of NAFDAC, SON, NESREA and NDLEA in Nigeria',
      'Select compatible drying agents and collection methods for laboratory gases (NH₃, HCl, Cl₂, SO₂, H₂S, CO₂, H₂, O₂)',
      'Solve practical volumetric analysis problems on mass concentration, molarity, percentage purity and water of crystallisation (xH₂O)',
    ],
    trap: 'NEVER dry ammonia (NH₃) with concentrated H₂SO₄ or anhydrous CaCl₂—both react chemically with NH₃! Dry ammonia ONLY over quicklime (CaO), and NEVER dry H₂S with conc. H₂SO₄ (oxidises H₂S to sulphur).',
    parts: [
      {
        title: 'Ethical, legal & regulatory issues in Chemistry',
        idea: 'From fake pharmaceuticals and toxic industrial effluent to banned chemical weapons and hazardous waste, chemists work within strict ethical codes and national regulatory laws.',
        rules: [
          'NAFDAC: National Agency for Food and Drug Administration and Control — tests, registers and polices food, drugs, cosmetics, bottled/sachet water and chemicals in Nigeria.',
          'SON: Standards Organisation of Nigeria — sets quality standards (NIS) for manufactured industrial goods (cement, steel rods, cables, paints).',
          'NESREA: National Environmental Standards and Regulations Enforcement Agency — enforces industrial pollution, effluent treatment and air/soil environmental laws.',
        ],
        ex: {
          q: 'A dyeing factory plans to discharge untreated chromium(VI) and strongly alkaline waste directly into a village stream. Which Nigerian agency enforces compliance, and what should the chemist do before discharge?',
          steps: [
            ['Regulatory agency: NESREA (and State Environmental Protection Agencies)', 'Mandated to enforce effluent limits and prosecute environmental polluters.'],
            ['Ethical chemical treatment before discharge', 'Reduce toxic Cr(VI) and precipitate heavy-metal hydroxides, neutralise alkaline pH to ~6.5–8.0, and dispose solid sludge safely.'],
          ],
        },
        tryit: {
          q: 'Which Nigerian agency is legally responsible for testing, registering and combating counterfeit medicines, packaged foods and sachet/bottled water?',
          ask: 'Select the right regulatory agency.',
          o: ['NAFDAC', 'FIRS', 'NERDC', 'FRSC'],
          a: 0,
          h: 'Check your sachet water ("Pure Water") or medicine packet—whose registration number is printed on it?',
          e: 'NAFDAC regulates and controls the manufacture, importation, distribution and sale of food, drugs, cosmetics, medical devices and packaged water.',
          fb: ['', 'FIRS administers federal tax revenue collection.', 'NERDC develops national school curricula.', 'FRSC regulates road traffic safety.'],
        },
      },
      {
        title: 'Drying agents and gas collection in practical exams',
        idea: 'In practical chemistry, a drying agent must absorb moisture WITHOUT reacting with the gas, and the collection method depends on both solubility in water and vapour density relative to air (VD of air ≈ 14.4, Mᵣ ≈ 29).',
        rules: [
          'Ammonia (NH₃, Mᵣ = 17 < 29, basic, soluble): dry with quicklime (CaO) ONLY; collect by upward delivery.',
          'Hydrogen sulphide (H₂S, Mᵣ = 34 > 29, reducing): dry with fused CaCl₂ or silica gel (conc. H₂SO₄ oxidises it: H₂S + H₂SO₄ → S↓ + SO₂ + 2H₂O!).',
          'Cl₂ (71), HCl (36.5), SO₂ (64), CO₂ (44): acidic & denser than air → dry with conc. H₂SO₄ and collect by downward delivery.',
        ],
        ex: {
          q: 'Give two reasons why ammonia gas cannot be collected over water and explain why concentrated H₂SO₄ cannot be used to dry it.',
          steps: [
            ['Why not over water: NH₃ is extremely soluble in water (1 cm³ dissolves ~700 cm³ of NH₃!)', 'Water would rush back ("suck back") into the hot reaction tube—compare the Fountain Experiment!'],
            ['Why not conc. H₂SO₄: alkaline NH₃ reacts with acidic H₂SO₄ in neutralisation', '2NH₃(g) + H₂SO₄(l) → (NH₄)₂SO₄(s)—no ammonia gas would emerge! Use quicklime (CaO) instead.'],
          ],
        },
        tryit: {
          q: 'Which reagent is the ONLY suitable common laboratory drying agent for ammonia gas (NH₃)?',
          ask: 'Pick a basic drying agent that will not react with basic NH₃.',
          o: [
            'Quicklime (calcium oxide, CaO)',
            'Concentrated tetraoxosulphate(VI) acid (H₂SO₄)',
            'Anhydrous calcium chloride (CaCl₂)',
            'Phosphorus(V) oxide (P₄O₁₀)',
          ],
          a: 0,
          h: 'Both NH₃ and CaO are basic, so they do not react with each other!',
          e: 'CaO absorbs water (CaO + H₂O → Ca(OH)₂) while leaving basic NH₃ untouched. H₂SO₄ and P₄O₁₀ are acidic, and CaCl₂ forms CaCl₂·8NH₃.',
          fb: ['', 'Acidic H₂SO₄ neutralises NH₃ to form (NH₄)₂SO₄.', 'Fused CaCl₂ reacts with NH₃ to form the solid addition compound CaCl₂·8NH₃!', 'P₄O₁₀ is a strongly acidic oxide that reacts with basic NH₃.'],
        },
      },
      {
        title: 'Practical calculations: purity & water of crystallisation',
        idea: 'Volumetric titration determines ONLY the moles of chemically active solute—allowing you to calculate % purity of impure samples and x in hydrated crystals like Na₂CO₃·xH₂O.',
        rules: [
          'Molarity (mol dm⁻³) = Mass concentration (g dm⁻³) ÷ Molar mass (g mol⁻¹).',
          '% Purity = (Pure mass concentration from titration ÷ Total impure mass concentration weighed) × 100%.',
          'For Na₂CO₃·xH₂O: Molar mass M = (Mass conc of crystals in g dm⁻³) ÷ (Molarity found by titration). Then 106 + 18x = M!',
        ],
        ex: {
          q: '14.3 g dm⁻³ of hydrated Na₂CO₃·xH₂O crystals was found by acid–base titration to have a molar concentration of 0.050 mol dm⁻³. Find x (Na = 23, C = 12, O = 16, H = 1).',
          steps: [
            ['Find molar mass M of Na₂CO₃·xH₂O = mass conc ÷ molarity', 'M = 14.3 g dm⁻³ ÷ 0.050 mol dm⁻³ = 286 g mol⁻¹.'],
            ['Equate 106 + 18x = 286 (since Na₂CO₃ = 2(23)+12+48 = 106 and H₂O = 18)', '18x = 286 − 106 = 180 ⇒ x = 180 ÷ 18 = 10 (washing soda, Na₂CO₃·10H₂O!).'],
          ],
        },
        tryit: {
          q: '6.30 g of hydrated ethanedioic acid crystals, H₂C₂O₄·xH₂O, was dissolved to make 1.0 dm³ of solution. Titration showed its concentration was 0.050 mol dm⁻³. What is x? (H₂C₂O₄ = 90, H₂O = 18)',
          ask: 'Compute molar mass first, then solve 90 + 18x = M.',
          o: ['2', '5', '10', '1'],
          a: 0,
          h: 'M = 6.30 ÷ 0.050 = 126 g mol⁻¹. Now solve 90 + 18x = 126.',
          e: 'Molar mass = 6.30 / 0.050 = 126 g mol⁻¹. 90 + 18x = 126 ⇒ 18x = 36 ⇒ x = 2 (H₂C₂O₄·2H₂O).',
          fb: ['', '90 + 18(5) = 180, not 126.', '10 is for Na₂CO₃·10H₂O.', '90 + 18(1) = 108, not 126.'],
        },
      },
    ],
    spot: {
      part: 1,
      who: 'Bola',
      q: 'Prepare dry hydrogen sulphide (H₂S) gas from iron(II) sulphide and dilute HCl.',
      lines: [
        'React FeS(s) with dilute HCl(aq) in a Kipp’s apparatus inside a fume cupboard',
        'Bubble the moist H₂S gas through a wash-bottle of concentrated H₂SO₄ to dry it',
        'Collect the dry H₂S by downward delivery since Mᵣ(H₂S) = 34 > 29 (air)',
      ],
      bad: 1,
      okfb: ['Correct reaction and fume-cupboard safety!', 'Correct collection—H₂S is denser than air.'],
      o: [
        'Concentrated H₂SO₄ is an oxidising agent that oxidises H₂S to a yellow precipitate of sulphur (H₂S + H₂SO₄ → S↓ + SO₂ + 2H₂O); dry H₂S with fused CaCl₂ or silica gel instead',
        'H₂S is strongly alkaline like ammonia',
        'H₂S is lighter than air (Mᵣ = 2)',
        'FeS does not react with dilute HCl',
      ],
      fb: [
        'Spot on! Hot or cold concentrated H₂SO₄ oxidises reducing H₂S gas into yellow sulphur and SO₂!',
        'H₂S is a weak diprotic acid, not alkaline—the problem is redox, not acid–base!',
        'Mᵣ(H₂S) = 2(1) + 32 = 34, which is heavier than air (~29).',
        'FeS + 2HCl → FeCl₂ + H₂S↑ works smoothly at room temperature.',
      ],
      h: ['Remember H₂S is a strong reducing agent and concentrated H₂SO₄ is an oxidising agent!'],
      fix: 'Pass moist H₂S through a U-tube packed with fused anhydrous CaCl₂ (or silica gel) instead of concentrated H₂SO₄.',
    },
    qs: [
      { l: 1, dx: 1, q: 'Which Nigerian agency enforces industrial effluent standards and environmental protection regulations across factories?', o: ['NESREA', 'NAFDAC', 'NIMASA', 'CBN'], a: 0, e: 'NESREA (National Environmental Standards and Regulations Enforcement Agency) monitors and enforces environmental compliance.', w: ['', 'NAFDAC regulates food, drugs, cosmetics and packaged water.', 'NIMASA regulates maritime administration and shipping safety.', 'CBN is the Central Bank of Nigeria.'] },
      { l: 1, q: 'Before buying a sachet or bottle of drinking water in Nigeria, consumers check for a registration number issued by', o: ['NAFDAC', 'NDLEA', 'FIRS', 'NNPC'], a: 0, e: 'NAFDAC tests and certifies packaged water, food and pharmaceuticals for public safety.', w: ['', 'NDLEA combats illicit drug trafficking.', 'FIRS collects federal taxes and inland revenue.', 'NNPC operates in the petroleum sector.'] },
      { l: 2, q: 'Why is hydrogen chloride (HCl) gas collected by downward delivery (upward displacement of air) rather than over water?', o: ['It is denser than air (Mᵣ = 36.5) and extremely soluble in water', 'It is lighter than air and insoluble in water', 'It explodes violently on touching cold water', 'It reacts with nitrogen in air'], a: 0, e: 'HCl dissolves avidly in water to form hydrochloric acid, and Mᵣ = 36.5 > 29 (air) so it sinks into an upright gas jar.', w: ['', 'HCl is denser than air and very soluble (Fountain Experiment).', 'HCl dissolves exothermically (suck-back risk), not explosively.', 'HCl does not react with N₂.'] },
      { l: 2, q: 'Why can anhydrous calcium chloride (CaCl₂) NOT be used to dry ammonia gas?', o: ['It reacts chemically with ammonia to form an addition complex, CaCl₂·8NH₃', 'CaCl₂ is a strong liquid acid', 'CaCl₂ oxidises ammonia to nitrogen(IV) oxide', 'CaCl₂ sublimes at room temperature'], a: 0, e: 'Anhydrous CaCl₂ absorbs NH₃ chemically (CaCl₂ + 8NH₃ → CaCl₂·8NH₃); quicklime (CaO) must be used instead.', w: ['', 'CaCl₂ is a neutral white solid salt.', 'CaCl₂ is not an oxidising agent.', 'CaCl₂ is a high-melting ionic solid (m.p. 772 °C).'] },
      { l: 3, q: 'How should a school chemistry laboratory safely dispose of 200 cm³ of waste dilute hydrochloric acid left after a titration practical?', o: ['Neutralise it carefully with sodium trioxocarbonate(IV) or dilute alkali until near pH 7, then flush with plenty of tap water', 'Pour it into a bottle of concentrated trioxonitrate(V) acid', 'Mix it with potassium manganate(VII) to generate chlorine gas in the classroom', 'Seal it tightly with zinc granules inside a glass bottle'], a: 0, e: 'Dilute mineral acids are safely neutralised (e.g. with Na₂CO₃ or NaHCO₃ until fizzing stops) before flushing with abundant water.', w: ['', 'Mixing HCl and conc. HNO₃ makes corrosive aqua regia!', 'HCl + KMnO₄ evolves poisonous Cl₂ gas!', 'Zn + HCl evolves H₂ gas, shattering a sealed bottle!'] },
      { l: 3, q: '5.00 g of impure NaOH was dissolved to make 1.00 dm³ of solution. If titration against standard HCl showed the concentration of pure NaOH was 0.100 mol dm⁻³, what is the percentage purity of the NaOH? (NaOH = 40)', o: ['80%', '50%', '40%', '90%'], a: 0, e: 'Mass conc of pure NaOH = molarity × Mᵣ = 0.100 × 40 = 4.00 g dm⁻³. % Purity = (4.00 / 5.00) × 100% = 80%.', w: ['', '4.00 ÷ 5.00 × 100% = 80%, not 50%.', '4.00 g is the pure mass in 5.00 g, which is 80%.', '0.100 × 40 = 4.00 g, not 4.50 g.'] },
      { l: 3, q: 'What is the mass concentration (in g dm⁻³) of a 0.25 mol dm⁻³ solution of potassium hydroxide, KOH? (K = 39, O = 16, H = 1)', o: ['14.0 g dm⁻³', '56.0 g dm⁻³', '28.0 g dm⁻³', '7.0 g dm⁻³'], a: 0, e: 'Mᵣ(KOH) = 39 + 16 + 1 = 56 g mol⁻¹. Mass concentration = 0.25 × 56 = 14.0 g dm⁻³.', w: ['', '56.0 g dm⁻³ is for a 1.0 mol dm⁻³ solution.', '28.0 g dm⁻³ is for 0.50 mol dm⁻³.', '0.25 × 56 = 14.0, not 7.0.'] },
      { l: 4, q: '24.6 g of hydrated magnesium tetraoxosulphate(VI) crystals, MgSO₄·xH₂O, was heated to constant mass, leaving 12.0 g of anhydrous MgSO₄. Find x (MgSO₄ = 120, H₂O = 18).', o: ['7', '5', '10', '2'], a: 0, e: 'Mass of water lost = 24.6 − 12.0 = 12.6 g. Moles MgSO₄ = 12.0 / 120 = 0.10 mol; moles H₂O = 12.6 / 18 = 0.70 mol. Ratio 1 : x = 0.10 : 0.70 = 1 : 7 (Epsom salt, MgSO₄·7H₂O!).', w: ['', '5 is for CuSO₄·5H₂O.', '10 is for Na₂CO₃·10H₂O.', '12.6 ÷ 18 = 0.70 mol H₂O per 0.10 mol MgSO₄ ⇒ x = 7.'] },
      { l: 2, q: 'Green Chemistry principles encourage chemical industries to', o: ['use catalysts, renewable feedstocks and biodegradable products that minimise hazardous waste at the source', 'dump heavy-metal sludge into deep rivers at night', 'maximise the number of toxic organic solvents per synthesis step', 'replace recyclable packaging with non-biodegradable CFCs'], a: 0, e: 'Green chemistry prevents waste generation, improves atom economy, uses safer solvents/catalysts and designs for degradation.', w: ['', 'Illegal dumping violates environmental law and ethics.', 'Green chemistry eliminates or replaces toxic solvents with water or supercritical CO₂.', 'CFCs destroy stratospheric ozone and are banned under the Montreal Protocol.'] },
      { l: 3, q: 'Which pair of gases is collected in the laboratory by UPWARD delivery (downward displacement of air)?', o: ['Hydrogen (H₂) and ammonia (NH₃)', 'Chlorine (Cl₂) and carbon(IV) oxide (CO₂)', 'Hydrogen chloride (HCl) and sulphur(IV) oxide (SO₂)', 'Nitrogen(IV) oxide (NO₂) and hydrogen sulphide (H₂S)'], a: 0, e: 'Upward delivery is used for gases LESS dense than air (Mᵣ < 29): H₂ (Mᵣ = 2) and NH₃ (Mᵣ = 17).', w: ['', 'Cl₂ (71) and CO₂ (44) are denser than air (downward delivery).', 'HCl (36.5) and SO₂ (64) are denser than air.', 'NO₂ (46) and H₂S (34) are denser than air.'] },
    ],
  },
];
