import type { Beat, Question, Topic } from '../types';
import type { Rng } from '../utils/engine';
import { RA } from '../utils/mathMarkup';

export type ChemDomainId = 'all' | 'physical' | 'inorganic' | 'organic' | 'applied';

export interface ChemSyllabusUnitMeta {
  unit: number;
  sec: string;
  domain: Exclude<ChemDomainId, 'all'>;
  name?: string;
  goals: string[];
  trap?: string;
  keywords: string[];
}

/**
 * Official 18-Unit JAMB UTME 2027 Chemistry Syllabus Blueprint & Ordering.
 * Maps all 26 Chemistry topics in exact syllabus unit order (Units 1 through 18).
 */
export const CHEM_SYLLABUS_ORDER: string[] = [
  'c-sep',    // Unit 1
  'c-mole',   // Unit 2
  'c-kin',    // Unit 3
  'c-atom',   // Unit 4a
  'c-per',    // Unit 4b
  'c-bond',   // Unit 4c-d
  'c-nuc',    // Unit 5
  'c-sol',    // Unit 6
  'c-env',    // Unit 7
  'c-acid',   // Unit 8a-c, e
  'c-vol',    // Unit 8d
  'c-redox',  // Unit 9
  'c-elec',   // Unit 10
  'c-energy', // Unit 11
  'c-rate',   // Unit 12
  'c-equil',  // Unit 13
  'c-air',    // Unit 14a, c(i)
  'c-hal',    // Unit 14b
  'c-nsc',    // Unit 14c(ii), d, e
  'c-qual',   // Unit 14/15 Qualitative tests
  'c-metal',  // Unit 15
  'c-hydro',  // Unit 16a-b
  'c-func',   // Unit 16c-g
  'c-poly',   // Unit 16f, h-j
  'c-ind',    // Unit 17
  'c-astro',  // Unit 18
];

export const CHEM_SYLLABUS_2027_META: Record<string, ChemSyllabusUnitMeta> = {
  'c-sep': {
    unit: 1,
    sec: 'Unit 1 · Separation of Mixtures & Purification',
    domain: 'physical',
    name: 'Separation of Mixtures & Purification',
    goals: [
      'Distinguish between elements, compounds and mixtures, and between physical and chemical changes',
      'Use sharp melting and boiling points (and density) as criteria for purity of chemical substances',
      'Specify the physical principle behind filtration, evaporation, simple/fractional distillation, sublimation, crystallisation, paper & column chromatography, centrifugation and magnetisation',
    ],
    keywords: ['filtration', 'distillation', 'chromatography', 'sublimation', 'centrifugation', 'purity', 'rf value', 'crystallisation'],
  },
  'c-mole': {
    unit: 2,
    sec: 'Unit 2 · Chemical Combination & Stoichiometry',
    domain: 'physical',
    name: 'Chemical Combination, Formulae & Mole Concept',
    goals: [
      'Deduce the laws of conservation of matter, definite, multiple and reciprocal proportions from experimental data',
      'Calculate relative atomic/molecular masses (based on ¹²C = 12), empirical and molecular formulae',
      'Perform mole-concept and stoichiometric calculations involving masses, molar volumes and solutions',
    ],
    keywords: ['definite proportions', 'multiple proportions', 'reciprocal proportions', 'mole', 'stoichiometry', 'empirical formula', 'avogadro'],
  },
  'c-kin': {
    unit: 3,
    sec: 'Unit 3 · Kinetic Theory of Matter & Gas Laws',
    domain: 'physical',
    name: 'Kinetic Theory of Matter & Gas Laws',
    goals: [
      'Apply kinetic theory and Brownian movement to explain solids, liquids, gases and changes of state',
      'Deduce and calculate with Boyle’s, Charles’, Avogadro’s, Gay-Lussac’s, Graham’s and Dalton’s partial-pressure laws plus PV = nRT',
      'Relate vapour density to relative molecular mass (M<sub>r</sub> = 2 × VD) and state why real gases deviate from ideal behaviour',
    ],
    keywords: ['boyle', 'charles', 'graham', 'dalton partial pressure', 'ideal gas', 'vapour density', 'brownian', 'real gas'],
  },
  'c-atom': {
    unit: 4,
    sec: 'Unit 4 · Atomic Structure, Periodicity & Bonding',
    domain: 'physical',
    name: 'Atomic Structure, Orbitals & Quantum Numbers',
    goals: [
      'Identify the contributions of Dalton, J.J. Thomson, Millikan, Rutherford, Moseley and Bohr to atomic structure',
      'Deduce protons, neutrons and electrons from Z and A, and calculate relative atomic mass from isotopic abundances',
      'Apply the four quantum numbers (n, l, m, s), Aufbau, Pauli and Hund’s rules to elements Z = 1–20 and distinguish s and p orbital shapes',
    ],
    keywords: ['dalton', 'thomson', 'millikan', 'rutherford', 'moseley', 'bohr', 'quantum numbers', 'isotopes', 'orbitals', 'aufbau', 'hund'],
  },
  'c-per': {
    unit: 4,
    sec: 'Unit 4 · Atomic Structure, Periodicity & Bonding',
    domain: 'physical',
    name: 'The Periodic Table & Periodicity',
    goals: [
      'Relate atomic number and electron configuration to an element’s group and period (alkali, alkaline-earth, halogens, noble gases, transition metals)',
      'Explain periodic variations in ionisation energy, ionic/atomic radii, electron affinity, electronegativity, and electrical/thermal conductivities',
    ],
    keywords: ['periodic table', 'ionisation energy', 'electronegativity', 'electron affinity', 'alkali metals', 'noble gases'],
  },
  'c-bond': {
    unit: 4,
    sec: 'Unit 4 · Atomic Structure, Periodicity & Bonding',
    domain: 'physical',
    name: 'Chemical Bonding & Shapes of Molecules',
    goals: [
      'Differentiate electrovalent, covalent, coordinate (dative), hydrogen, metallic and van der Waals bonding and relate them to physical properties',
      'Identify coordinate bonding in complex ions such as [Fe(CN)₆]³⁻, [Fe(CN)₆]⁴⁻, [Cu(NH₃)₄]²⁺ and [Ag(NH₃)₂]⁺',
      'Differentiate molecular shapes: linear (H₂, O₂, Cl₂, HCl, CO₂), bent/non-linear (H₂O), pyramidal (NH₃) and tetrahedral (CH₄)',
    ],
    keywords: ['ionic', 'covalent', 'dative', 'coordinate', 'complex ions', 'hydrogen bond', 'tetrahedral', 'pyramidal', 'vsepr'],
  },
  'c-nuc': {
    unit: 5,
    sec: 'Unit 5 · Nuclear Chemistry',
    domain: 'physical',
    name: 'Nuclear Chemistry & Radioactivity',
    goals: [
      'Distinguish nuclear reactions from ordinary chemical reactions, and natural from artificial radioactivity',
      'Compare α, β and γ radiations, balance nuclear equations, and solve half-life calculations',
      'Distinguish nuclear fission and fusion and state medical, industrial and archaeological uses of radioisotopes',
    ],
    keywords: ['alpha', 'beta', 'gamma', 'half-life', 'fission', 'fusion', 'radioactivity', 'carbon-14'],
  },
  'c-sol': {
    unit: 6,
    sec: 'Unit 6 · Solubility, Solvents & Colloids',
    domain: 'physical',
    name: 'Solubility, Solvents & Colloids',
    goals: [
      'Distinguish unsaturated, saturated and supersaturated solutions, interpret solubility curves, and calculate solubility in mol dm⁻³',
      'Relate non-aqueous solvents (turpentine, petrol, ethanol, propanone) to removing fat, oil, paint and perspiration stains',
      'Differentiate true solutions, suspensions (Harmattan haze, water paint) and colloids (fog, milk, blood, aerosol, emulsion paint, rubber solution)',
    ],
    keywords: ['solubility curve', 'saturated', 'colloids', 'suspensions', 'tyndall', 'harmattan haze', 'stain removal', 'solvents'],
  },
  'c-env': {
    unit: 7,
    sec: 'Unit 7 · Environmental Pollution',
    domain: 'inorganic',
    name: 'Environmental Pollution (Air, Water & Soil)',
    goals: [
      'Give reasons why air is a mixture and specify the natural proportions and uses of N₂, O₂, CO₂, water vapour and noble gases',
      'Identify sources and effects of air pollutants (H₂S, CO, SO₂, NOₓ, CFCs, dust), water pollutants (sewage, oil spills) and soil pollutants',
      'Classify pollutants as biodegradable or non-biodegradable and state practical pollution-control measures',
    ],
    keywords: ['air pollution', 'cfc', 'ozone', 'oil spillage', 'sewage', 'biodegradable', 'non-biodegradable', 'acid rain'],
  },
  'c-acid': {
    unit: 8,
    sec: 'Unit 8 · Acids, Bases, pH & Salts',
    domain: 'physical',
    name: 'Acids, Bases, pH, Buffers & Salt Hydrolysis',
    goals: [
      'Determine basicity of acids, compare conductance of strong vs weak electrolytes, and classify normal, acidic, basic and double salts (alums)',
      'Calculate pH and pOH (pH + pOH = 14) and state everyday applications of pH and buffer solutions',
      'Predict whether aqueous solutions of salts (NH₄Cl, AlCl₃, Na₂CO₃, CH₃COONa) are acidic, basic or neutral by hydrolysis',
    ],
    keywords: ['ph', 'poh', 'buffer', 'salt hydrolysis', 'basicity', 'alum', 'conductance', 'ethanoic', 'citric', 'tartaric'],
  },
  'c-vol': {
    unit: 8,
    sec: 'Unit 8 · Acids, Bases, pH & Salts',
    domain: 'physical',
    name: 'Acid–Base Titrations & Volumetric Analysis',
    goals: [
      'Select the appropriate indicator (methyl orange vs phenolphthalein) by interpreting acid–base titration curves',
      'Perform mole-ratio calculations for molar concentration, mass concentration, percentage purity and water of crystallisation',
    ],
    keywords: ['titration', 'methyl orange', 'phenolphthalein', 'burette', 'pipette', 'molarity', 'titration curve'],
  },
  'c-redox': {
    unit: 9,
    sec: 'Unit 9 · Oxidation and Reduction (Redox)',
    domain: 'physical',
    name: 'Oxidation and Reduction (Redox)',
    goals: [
      'Define oxidation and reduction in terms of oxygen, hydrogen, electron transfer and oxidation number changes',
      'Deduce oxidation numbers, apply IUPAC Stock nomenclature, and balance redox equations',
      'Distinguish oxidising and reducing agents using standard chemical tests (acidified KMnO₄, K₂Cr₂O₇, KI, H₂S, SO₂)',
    ],
    keywords: ['redox', 'oxidation number', 'oxidising agent', 'reducing agent', 'iupac nomenclature', 'kmno4'],
  },
  'c-elec': {
    unit: 10,
    sec: 'Unit 10 · Electrolysis & Electrochemical Cells',
    domain: 'physical',
    name: 'Electrolysis, Electrochemical Cells & Corrosion',
    goals: [
      'Predict electrode products in dilute H₂SO₄, aq. CuSO₄, CuCl₂, dilute/conc. NaCl and fused NaCl, and calculate masses using Faraday’s laws',
      'Use the electrochemical series (K to Au) and half-cell potentials to calculate E°<sub>cell</sub>',
      'Explain rusting/corrosion as an electrolytic process and compare cathodic/sacrificial protection, galvanizing, electroplating and oiling',
    ],
    keywords: ['faraday', 'electrolysis', 'electrochemical series', 'electrode potential', 'cathodic protection', 'galvanizing', 'brine'],
  },
  'c-energy': {
    unit: 11,
    sec: 'Unit 11 · Energy Changes (Thermochemistry)',
    domain: 'physical',
    name: 'Energy Changes, Entropy & Spontaneity',
    goals: [
      'Distinguish exothermic (−ΔH) and endothermic (+ΔH) physical/chemical changes (e.g. dissolving NaOH vs NH₄Cl) and read energy profiles',
      'Relate entropy (ΔS°) to physical state (solid < liquid < gas) and degree of disorder',
      'Solve spontaneity problems using ΔG° = ΔH° − TΔS° (ΔG° < 0 spontaneous, ΔG° = 0 equilibrium, ΔG° > 0 non-spontaneous)',
    ],
    keywords: ['enthalpy', 'exothermic', 'endothermic', 'entropy', 'gibbs free energy', 'spontaneity'],
  },
  'c-rate': {
    unit: 12,
    sec: 'Unit 12 · Rates of Chemical Reaction',
    domain: 'physical',
    name: 'Rates of Chemical Reaction',
    goals: [
      'Explain how temperature, concentration/pressure, surface area (powdered vs lump marble), catalysts (MnO₂) and light (photochemical halogenation) affect reaction rate',
      'Interpret reaction rate curves, deduce activation energy (E<sub>a</sub>), and relate collision theory & Arrhenius’ law to kinetic theory',
    ],
    keywords: ['collision theory', 'activation energy', 'catalyst', 'surface area', 'iodine clock', 'photochemical', 'arrhenius'],
  },
  'c-equil': {
    unit: 13,
    sec: 'Unit 13 · Chemical Equilibria',
    domain: 'physical',
    name: 'Chemical Equilibria & Le Chatelier’s Principle',
    goals: [
      'Define reversible reactions and dynamic equilibrium, including 3Fe(s) + 4H₂O(g) ⇌ Fe₃O₄(s) + 4H₂(g) and N₂O₄(g) ⇌ 2NO₂(g)',
      'Apply Le Chatelier’s principle to predict shifts in equilibrium position and industrial conditions (Haber & Contact processes)',
      'State why temperature is the ONLY factor that alters the equilibrium constant K<sub>c</sub>',
    ],
    keywords: ['le chatelier', 'dynamic equilibrium', 'haber process', 'contact process', 'equilibrium constant'],
  },
  'c-air': {
    unit: 14,
    sec: 'Unit 14 · Non-Metals and their Compounds',
    domain: 'inorganic',
    name: 'Hydrogen, Oxygen, Ozone & Water Supply',
    goals: [
      'Specify lab and industrial preparations, properties, uses and tests for H₂ (water gas, cracking) and O₂, plus ozone (O₃) significance and oxide classes',
      'Distinguish temporary vs permanent water hardness, softening methods, town water supply treatment steps, and efflorescence, deliquescence & hygroscopy',
    ],
    keywords: ['hydrogen', 'oxygen', 'ozone', 'amphoteric oxide', 'hard water', 'town water treatment', 'deliquescent', 'efflorescent', 'hygroscopic'],
  },
  'c-hal': {
    unit: 14,
    sec: 'Unit 14 · Non-Metals and their Compounds',
    domain: 'inorganic',
    name: 'Halogens: Chlorine, HCl & Chlorides',
    goals: [
      'Predict reagents and conditions for lab and electrolytic preparation of Cl₂, its bleaching action, water sterilisation and industrial uses',
      'Compare dry HCl(g) and hydrochloric acid HCl(aq), fountain experiment, and the AgNO₃ / NH₃(aq) confirmatory test for Cl⁻',
    ],
    keywords: ['chlorine', 'bleaching', 'hydrogen chloride', 'halogens', 'silver nitrate', 'fountain experiment'],
  },
  'c-nsc': {
    unit: 14,
    sec: 'Unit 14 · Non-Metals and their Compounds',
    domain: 'inorganic',
    name: 'Sulphur, Nitrogen & Carbon Compounds',
    goals: [
      'Specify allotropes and chemistry of Sulphur (SO₂, H₂SO₃, Contact H₂SO₄, H₂S) and Nitrogen (Haber NH₃, HNO₃, nitrates, N₂O/NO/NO₂, nitrogen cycle)',
      'Compare Carbon allotropes, CO₂ vs CO toxicity, coal types, destructive distillation of coal & wood, and coke gasification (producer & synthesis/water gas)',
    ],
    keywords: ['contact process', 'haber', 'allotropes', 'coal', 'destructive distillation', 'producer gas', 'water gas', 'synthesis gas', 'nitrogen cycle'],
  },
  'c-qual': {
    unit: 14,
    sec: 'Unit 14 · Non-Metals and their Compounds',
    domain: 'inorganic',
    name: 'Qualitative Analysis: Tests for Ions & Gases',
    goals: [
      'Identify cations (Ca²⁺, Al³⁺, Zn²⁺, Pb²⁺, Fe²⁺, Fe³⁺, Cu²⁺, NH₄⁺, Na⁺) using NaOH(aq), NH₃(aq) and flame tests',
      'Determine specific confirmatory tests for anions (Cl⁻, SO₄²⁻, SO₃²⁻, S²⁻, NO₃⁻ brown ring, CO₃²⁻, HCO₃⁻) and common JAMB gases',
    ],
    keywords: ['brown ring test', 'cations', 'anions', 'flame test', 'limewater', 'amphoteric hydroxides'],
  },
  'c-metal': {
    unit: 15,
    sec: 'Unit 15 · Metals and their Compounds',
    domain: 'inorganic',
    name: 'Metals, Extraction, Transition Series & Alloys',
    goals: [
      'Relate reactivity to extraction of Na (Downs), NaOH/Solvay Na₂CO₃, Ca/cement, Al (Bayer + Hall-Héroult), Sn (cassiterite), Fe (blast furnace) & Cu',
      'Explain characteristic properties of first-row transition metals (coloured ions, variable oxidation states, complexes, catalysis) and name simple complexes',
      'Specify constituents and uses of steel, stainless steel, brass, bronze, type-metal, duralumin, soft solder, permalloy and alnico',
    ],
    keywords: ['solvay process', 'bauxite', 'cassiterite', 'tin', 'blast furnace', 'cement', 'transition metals', 'brass', 'bronze', 'duralumin', 'permalloy', 'alnico', 'solder', 'type-metal'],
  },
  'c-hydro': {
    unit: 16,
    sec: 'Unit 16 · Organic Compounds',
    domain: 'organic',
    name: 'Hydrocarbons, Isomerism, Petroleum & Benzene',
    goals: [
      'Apply carbon tetravalency/catenation, IUPAC naming, empirical/molecular formulae, structural isomerism (≤ C₆) and cis/trans geometric isomerism',
      'Relate petroleum fractions, cracking, reforming and octane number to fuel quality',
      'Distinguish alkanes, alkenes (bromine test), terminal alkynes (CaC₂ prep; ammoniacal AgNO₃ / CuCl test) and aromatic benzene',
    ],
    keywords: ['alkanes', 'alkenes', 'alkynes', 'ethyne', 'benzene', 'isomerism', 'octane number', 'cracking', 'terminal alkyne'],
  },
  'c-func': {
    unit: 16,
    sec: 'Unit 16 · Organic Compounds',
    domain: 'organic',
    name: 'Alkanols, Alkanals, Alkanones, Acids & Amines',
    goals: [
      'Classify 1°, 2° and 3° alkanols, explain palm-wine/sugar fermentation, glycerol, oxidation and the Lucas test',
      'Distinguish alkanals from alkanones (Fehling’s & Tollens’ silver-mirror tests), and compare alkanoic acids (ethanoic, oxalic, benzoic), alkanoates and 1°/2°/3° amines',
    ],
    keywords: ['alkanols', 'lucas test', 'fermentation', 'alkanals', 'alkanones', 'fehling', 'tollens', 'esterification', 'oxalic acid', 'amines'],
  },
  'c-poly': {
    unit: 16,
    sec: 'Unit 16 · Organic Compounds',
    domain: 'organic',
    name: 'Fats, Soaps, Carbohydrates, Proteins & Polymers',
    goals: [
      'Explain saponification of fats/oils, margarine hydrogenation, and distinguish soaps from soapless detergents',
      'Classify mono-, di- and polysaccharides (hydrolysis, conc. H₂SO₄ dehydration, reducing-sugar tests) and proteins (peptide link, Enzymes, Ninhydrin, Biuret, Millon’s & Xanthoproteic tests)',
      'Distinguish natural vs synthetic rubber (vulcanization), addition vs condensation polymers, and thermoplastics vs thermosets',
    ],
    keywords: ['saponification', 'detergent', 'margarine', 'carbohydrates', 'proteins', 'biuret', 'millon', 'xanthoproteic', 'ninhydrin', 'vulcanization', 'thermoplastic', 'thermosetting'],
  },
  'c-ind': {
    unit: 17,
    sec: 'Unit 17 · Chemistry and Industry',
    domain: 'applied',
    name: 'Chemical Industries, Raw Materials & Biotechnology',
    goals: [
      'Classify chemical industries by products and identify local and industrial raw materials for petrochemicals, cement, fertilizers, glass, soap, plastics and metallurgy',
      'Distinguish heavy chemicals (high tonnage, e.g. H₂SO₄, NaOH, NH₃) from fine chemicals (high purity, low tonnage, e.g. drugs, dyes, analytical reagents)',
      'Relate industrial chemical processes to biotechnology (yeast fermentation, biogas generation, industrial enzymes and waste treatment)',
    ],
    keywords: ['heavy chemicals', 'fine chemicals', 'biotechnology', 'raw materials', 'petrochemicals', 'fertilizer', 'biogas'],
  },
  'c-astro': {
    unit: 18,
    sec: 'Unit 18 · Astronomical Chemistry',
    domain: 'applied',
    name: 'Astronomical Chemistry & Earth Segments',
    goals: [
      'State the chemical composition of the Solar System (Sun, 8 planets Mercury–Neptune, dwarf planets, asteroids, comets) and name Earth’s natural satellite (the Moon)',
      'List the planets in order from the Sun and identify Mercury/Neptune (plus JAMB’s classical Pluto note for smallest & farthest)',
      'Identify and compare the chemical composition of the three segments of the Earth: Atmosphere, Hydrosphere and Lithosphere',
    ],
    keywords: ['solar system', 'planets', 'mercury', 'neptune', 'pluto', 'moon', 'satellite', 'atmosphere', 'lithosphere', 'hydrosphere', 'crust'],
  },
};

/* ──────────────────────────────────────────────────────────────────────────
   NEW SYLLABUS UNITS 17 & 18: COMPLETE TOPICS + DEFINITIONS
   ────────────────────────────────────────────────────────────────────────── */
export const NEW_CHEM_2027_DEFS: Record<string, any[]> = {
  'c-ind': [
    {
      d: [
        [
          'Heavy chemicals',
          'Heavy chemicals are chemicals produced in very large quantities (tonnes) for wide industrial demand, usually at moderate purity. Examples: H₂SO₄, NaOH, NH₃, Cl₂, Na₂CO₃ and HNO₃.',
        ],
        [
          'Fine chemicals',
          'Fine chemicals are chemicals produced in relatively small quantities but to a very high degree of purity for specialized uses. Examples: pharmaceuticals (drugs), analytical laboratory reagents, dyes, perfumes and photographic chemicals.',
        ],
      ],
      idea: 'Tetraoxosulphate(VI) acid (H₂SO₄) is often called the "king of heavy chemicals" because almost every manufacturing sector—fertilizers, detergents, batteries, paints and textiles—uses it.',
      r: [
        'Heavy chemicals = high tonnage, lower unit cost, industrial-grade purity (e.g. H₂SO₄, NaOH, NH₃).',
        'Fine chemicals = low tonnage, higher unit cost, analytical/medical purity (e.g. drugs, dyes, food additives).',
        'Factors siting a chemical plant: proximity to raw materials, reliable power/water, transport network, labour and market.',
      ],
    },
    {
      d: [
        [
          'Petrochemicals',
          'Petrochemicals are basic organic chemicals (such as ethene, propene, benzene and synthesis gas) derived from petroleum or natural gas and used to make plastics, synthetic fibres, rubbers and detergents.',
        ],
        [
          'Metallurgy',
          'Metallurgy is the science and industrial technology of extracting metals from their ores, refining them, and compounding alloys.',
        ],
      ],
      idea: 'Every chemical industry transforms accessible natural raw materials—air, water, limestone, brine, sulphur, crude oil, bauxite, haematite—into higher-value products.',
      r: [
        'Cement raw materials: limestone (CaCO₃) and clay (aluminosilicates), heated in a rotary kiln with a little gypsum (CaSO₄·2H₂O) to regulate setting.',
        'Glass raw materials: clean sand (SiO₂), soda ash (Na₂CO₃) and limestone (CaCO₃).',
        'Fertilizer raw materials: natural gas + air (NH₃, urea, NH₄NO₃), sulphur + phosphate rock (superphosphate), potassium salts (NPK).',
      ],
    },
    {
      d: [
        [
          'Biotechnology',
          'Biotechnology is the industrial use of living microorganisms (such as yeast and bacteria) or biological catalysts (enzymes) to manufacture useful products or treat waste.',
        ],
        [
          'Biogas',
          'Biogas is a renewable fuel mixture—mainly methane (CH₄, 55–70%) and carbon(IV) oxide (CO₂)—produced by the anaerobic bacterial digestion of animal dung, sewage or crop waste.',
        ],
      ],
      idea: 'Biotechnology operates at mild temperatures and pressures (saving energy) and turns agricultural waste into ethanol, biogas, organic acids, antibiotics and clean compost.',
      r: [
        'Yeast zymase ferments glucose to ethanol + CO₂ (brewing, baking and biofuel).',
        'Acetobacter oxidises ethanol to ethanoic acid (vinegar); protease and lipase enzymes boost biological washing powders.',
        'Anaerobic digesters produce methane biogas for cooking/electricity while leaving nutrient-rich digester slurry as fertilizer.',
      ],
    },
  ],
  'c-astro': [
    {
      d: [
        [
          'Solar System',
          'The Solar System consists of the Sun at the centre and all celestial bodies bound to it by gravity: eight planets, their natural satellites (moons), dwarf planets (such as Pluto), asteroids, comets and meteoroids.',
        ],
        [
          'Natural satellite',
          'A natural satellite is a celestial body that orbits a planet. Earth has one natural satellite: the Moon.',
        ],
      ],
      idea: 'The Sun contains over 99.8% of the mass of the Solar System and is composed mainly of hydrogen (~73%) and helium (~25%), powered by nuclear fusion of hydrogen into helium.',
      r: [
        'Order of the 8 planets from the Sun: Mercury, Venus, Earth, Mars (inner rocky/terrestrial planets), then Jupiter, Saturn, Uranus, Neptune (outer gas/ice giants).',
        'Modern IAU classification: Mercury is the smallest planet and closest to the Sun; Jupiter is the largest; Neptune is the farthest planet from the Sun.',
        'JAMB Syllabus Note on Pluto: Before 2006 Pluto was listed as the 9th planet—both the smallest and farthest from the Sun. If Pluto appears in the options for "smallest planet that is also farthest from the Sun", JAMB’s syllabus objective (v) points directly to Pluto; if only the 8 IAU planets are listed, Neptune is farthest and Mercury is smallest.',
      ],
    },
    {
      d: [
        [
          'Atmosphere',
          'The atmosphere is the gaseous envelope surrounding the Earth, retained by gravity and composed of ~78% N₂, ~21% O₂, ~0.93% Ar, ~0.04% CO₂, trace noble gases and variable water vapour.',
        ],
        [
          'Hydrosphere',
          'The hydrosphere comprises all liquid, solid and gaseous water on, under and just above Earth’s surface: oceans and seas (~97%), polar ice caps/glaciers, rivers, lakes and groundwater.',
        ],
      ],
      idea: 'Earth is uniquely suited for life because its atmosphere shields against UV radiation (stratospheric ozone, O₃) and regulates temperature, while its hydrosphere provides liquid water as a universal biological solvent.',
      r: [
        'Atmospheric layers from ground up: Troposphere (weather) → Stratosphere (ozone layer) → Mesosphere → Thermosphere/Ionosphere.',
        'Sea water contains ~3.5% dissolved salts, predominantly Na⁺ and Cl⁻, followed by Mg²⁺, SO₄²⁻, Ca²⁺ and K⁺.',
      ],
    },
    {
      d: [
        [
          'Lithosphere',
          'The lithosphere is the solid, rocky outer shell of the Earth, comprising the crust and the rigid uppermost part of the mantle.',
        ],
      ],
      idea: 'Chemically, the Earth’s crust is dominated by oxides and silicates rather than free elements.',
      r: [
        'Most abundant elements by mass in Earth’s crust (lithosphere): Oxygen (~46.6%) > Silicon (~27.7%) > Aluminium (~8.1%) > Iron (~5.0%) > Calcium (~3.6%) > Sodium > Potassium > Magnesium.',
        'Most abundant element in the crust overall = Oxygen; most abundant metalloid = Silicon; most abundant metal in the crust = Aluminium (followed by Iron).',
        'Earth’s deep core (beneath the mantle) is rich in dense Iron (Fe) and Nickel (Ni).',
      ],
    },
  ],
};

export const NEW_CHEM_2027_TOPICS: Topic[] = [
  {
    id: 'c-ind',
    name: 'Chemical Industries, Raw Materials & Biotechnology',
    sec: 'Unit 17 · Chemistry and Industry',
    boss: 'Chemistry & Industry Mastery Test',
    goals: CHEM_SYLLABUS_2027_META['c-ind'].goals,
    trap: 'Do not confuse "heavy" chemicals with high density! "Heavy" refers to huge industrial tonnage (like H₂SO₄, NaOH and NH₃), whereas "fine" chemicals (drugs, dyes, analytical reagents) are made in small batches to ultra-high purity.',
    parts: [
      {
        title: 'Heavy chemicals vs fine chemicals',
        idea: 'Chemical industries convert raw materials into useful products and are grouped either by product type (fertilizers, cement, plastics, pharmaceuticals) or by scale and purity into heavy chemicals and fine chemicals.',
        rules: [
          'Heavy chemicals: produced in huge tonnage at moderate purity (H₂SO₄, NaOH, NH₃, Cl₂, Na₂CO₃, CaO).',
          'Fine chemicals: produced in small quantities to very high purity (drugs/pharmaceuticals, analytical reagents, dyes, fragrances).',
          'Key siting factors: nearness to raw materials, energy/water supply, transport links, skilled labour and market.',
        ],
        ex: {
          q: 'Classify tetraoxosulphate(VI) acid (H₂SO₄) and paracetamol (an analgesic drug) as heavy or fine chemicals, giving one reason each.',
          steps: [
            ['H₂SO₄ is a heavy chemical', 'It is manufactured in millions of tonnes via the Contact process for fertilizers, detergents and car batteries.'],
            ['Paracetamol is a fine chemical', 'It is manufactured in smaller batches to strict pharmaceutical purity because humans ingest it.'],
          ],
          why: [
            1,
            'Why must fine chemicals like drugs and analytical reagents have much stricter purity than heavy chemicals?',
            [
              'Even trace impurities could harm patients or ruin quantitative chemical analyses',
              'Fine chemicals have higher relative molecular masses',
              'Heavy chemicals cannot be purified',
            ],
            [
              'Correct. A 0.5% toxic impurity in a medicine is dangerous, so fine chemicals prioritize purity over bulk tonnage.',
              'Molecular mass has nothing to do with the heavy vs fine classification.',
              'Heavy chemicals can be purified, but ultra-purification is unnecessary and costly for bulk uses like fertilizer manufacture.',
            ],
          ],
        },
        tryit: {
          q: 'Which of the following is classified as a fine chemical rather than a heavy chemical?',
          ask: 'Select the fine chemical.',
          o: ['Analytical-grade silver trioxonitrate(V) / pharmaceutical dye', 'Tetraoxosulphate(VI) acid (H₂SO₄)', 'Sodium hydroxide (caustic soda)', 'Ammonia (NH₃)'],
          a: 0,
          h: 'Which one is made in small, ultra-pure batches rather than millions of tonnes?',
          e: 'Analytical reagents, dyes and drugs are fine chemicals. H₂SO₄, NaOH and NH₃ are classic heavy chemicals.',
          fb: [
            '',
            'H₂SO₄ is the quintessential heavy chemical, produced in the largest industrial tonnage.',
            'Caustic soda (NaOH) is a bulk heavy chemical from brine electrolysis.',
            'Ammonia is a bulk heavy chemical from the Haber process.',
          ],
        },
      },
      {
        title: 'Major chemical industries and their raw materials',
        idea: 'JAMB tests your ability to match each Nigerian and global chemical industry—petrochemicals, cement, glass, soap, fertilizers, plastics and metallurgy—to its primary natural raw materials.',
        rules: [
          'Cement: limestone (CaCO₃) + clay/shale heated strongly, plus gypsum (CaSO₄·2H₂O) added to prevent flash setting.',
          'Glass: silica sand (SiO₂) + soda ash (Na₂CO₃) + limestone (CaCO₃); Plastics/Petrochemicals: ethene & propene from petroleum cracking.',
          'Soap: palm oil / palm kernel oil (alkanoates) + caustic soda (NaOH) or caustic potash (KOH).',
        ],
        ex: {
          q: 'Name the two main raw materials heated in the kiln to make Portland cement, and state why a little gypsum is added at the end.',
          steps: [
            ['Limestone (CaCO₃) and clay (aluminosilicates)', 'Roasted together at ~1450 °C to form calcium silicates and calcium aluminates (clinker).'],
            ['2–5% gypsum (CaSO₄·2H₂O) is ground with the clinker', 'Slows down and regulates the setting time of cement when water is added.'],
          ],
        },
        tryit: {
          q: 'What are the main raw materials used in the manufacture of ordinary soda-lime glass?',
          ask: 'Pick the correct combination.',
          o: ['Sand (SiO₂), sodium trioxocarbonate(IV) (Na₂CO₃) and limestone (CaCO₃)', 'Bauxite, cryolite and graphite', 'Palm oil, sodium hydroxide and brine', 'Sulphur, air and vanadium(V) oxide'],
          a: 0,
          h: 'Glass is a mixture of sodium and calcium silicates.',
          e: 'Heating SiO₂ with Na₂CO₃ and CaCO₃ produces sodium and calcium trioxosilicates(IV)—ordinary soda-lime glass.',
          fb: [
            '',
            'Those are for extracting aluminium (Hall–Héroult process).',
            'Those are for manufacturing soap (saponification and salting out).',
            'Those are for the Contact process (H₂SO₄).',
          ],
        },
      },
      {
        title: 'Biotechnology in chemical processes',
        idea: 'Biotechnology harnesses living microbes (yeast, bacteria) and enzymes to carry out chemical transformations cleanly at ambient temperatures—from ethanol fermentation and baking to biogas generation and sewage treatment.',
        rules: [
          'Alcoholic fermentation: yeast enzymes (invertase & zymase) convert sucrose/glucose into ethanol and CO₂.',
          'Biogas production: anaerobic bacteria digest animal manure and plant waste to yield methane (CH₄) + CO₂ fuel.',
          'Industrial enzymes: proteases & lipases in biological detergents; pectinase in fruit juice clarification; bioremediation of oil spills.',
        ],
        ex: {
          q: 'How does anaerobic digestion of cow dung in a biogas plant benefit both energy supply and agriculture?',
          steps: [
            ['Anaerobic bacteria break down organic waste without oxygen', 'Produces biogas rich in methane (CH₄), a clean fuel for cooking and electricity.'],
            ['Leaves behind nitrogen- and phosphorus-rich digester slurry', 'Used directly on farms as a safe organic fertilizer while reducing pathogens and odour.'],
          ],
        },
        tryit: {
          q: 'The main combustible gas present in biogas produced from the anaerobic fermentation of organic waste is',
          ask: 'Identify the fuel gas.',
          o: ['methane (CH₄)', 'carbon(IV) oxide (CO₂)', 'sulphur(IV) oxide (SO₂)', 'nitrogen (N₂)'],
          a: 0,
          h: 'Think of the simplest alkane, also called marsh gas.',
          e: 'Biogas contains 55–70% methane (CH₄), which burns exothermically, alongside non-combustible CO₂.',
          fb: [
            '',
            'CO₂ is present in biogas (~30–40%) but it does not burn.',
            'SO₂ is an acidic air pollutant, not the main biogas fuel.',
            'Nitrogen is inert.',
          ],
        },
      },
    ],
    spot: {
      part: 0,
      who: 'Chidi',
      q: 'Why is tetraoxosulphate(VI) acid (H₂SO₄) called a heavy chemical?',
      lines: [
        'H₂SO₄ has a relative molecular mass of 98',
        'Its liquid density is 1.84 g cm⁻³, which is heavier than water',
        'Therefore it is classified as a heavy chemical because of its high density',
      ],
      bad: 2,
      okfb: ['True: 2(1) + 32 + 4(16) = 98.', 'True: concentrated H₂SO₄ is indeed dense (1.84 g cm⁻³).'],
      o: [
        '"Heavy chemical" means it is produced in huge industrial tonnage, not that its physical density is high',
        'H₂SO₄ is actually a fine chemical',
        'Its molar mass is 49, not 98',
        'Concentrated H₂SO₄ is lighter than water',
      ],
      fb: [
        'Spot on! Ammonia (NH₃) is a gas much lighter than air, yet NH₃ is ALSO a heavy chemical because millions of tonnes are made annually.',
        'H₂SO₄ is the #1 heavy chemical worldwide.',
        'Its molar mass is 98 g mol⁻¹.',
        'Concentrated H₂SO₄ is denser than water.',
      ],
      h: ['Ammonia gas (Mᵣ = 17) is also a heavy chemical. Can "heavy" mean high physical density?'],
      fix: 'H₂SO₄ is a heavy chemical because it is manufactured on a massive industrial scale (millions of tonnes per year) for fertilizers, detergents, paints and batteries.',
    },
    qs: [
      { l: 1, dx: 1, q: 'Chemicals produced in very small quantities but to a very high degree of purity are known as', o: ['fine chemicals', 'heavy chemicals', 'petrochemicals', 'agrochemicals'], a: 0, e: 'Drugs, analytical reagents and dyes are fine chemicals—small batch size, ultra-high purity.', w: ['', 'Heavy chemicals are bulk tonnage chemicals like H₂SO₄ and NaOH.', 'Petrochemicals are chemicals derived from petroleum/natural gas (many are heavy chemicals).', 'Agrochemicals are fertilizers and pesticides.'] },
      { l: 1, q: 'Which of the following is a heavy chemical?', o: ['Tetraoxosulphate(VI) acid (H₂SO₄)', 'Quinine', 'Analytical-grade methyl orange', 'Perfume ester'], a: 0, e: 'H₂SO₄ is manufactured in massive industrial tonnage via the Contact process.', w: ['', 'Quinine is a pharmaceutical drug (fine chemical).', 'Indicators are made in small high-purity batches (fine chemicals).', 'Perfume esters are fine chemicals.'] },
      { l: 2, q: 'Which pair of raw materials is heated together in a rotary kiln to manufacture cement?', o: ['Limestone and clay', 'Sand and caustic soda', 'Bauxite and cryolite', 'Haematite and brine'], a: 0, e: 'Limestone (CaCO₃) and clay (aluminosilicates) form cement clinker when strongly heated.', w: ['', 'Sand, soda ash and limestone make glass.', 'Bauxite and cryolite are used in aluminium extraction.', 'Haematite is iron ore; brine is concentrated NaCl(aq).'] },
      { l: 2, q: 'Why is a small percentage of gypsum (CaSO₄·2H₂O) added to cement clinker during grinding?', o: ['To slow down and regulate the setting time of the cement', 'To give cement its grey colour', 'To make the cement dissolve completely in water', 'To act as a fuel in the kiln'], a: 0, e: 'Without gypsum, tricalcium aluminate reacts with water too rapidly ("flash set").', w: ['', 'Grey colour comes from iron compounds in the clay.', 'Cement sets into an insoluble rigid matrix, not a solution.', 'Gypsum is added after the kiln firing, during grinding.'] },
      { l: 2, q: 'Which of the following is the primary raw material for the petrochemical plastics industry?', o: ['Ethene and propene from cracking of petroleum fractions', 'Coal tar from wood', 'Limestone and silica sand', 'palm kernel oil and brine'], a: 0, e: 'Alkenes such as ethene and propene from steam/catalytic cracking are polymerised into polythene and polypropene.', w: ['', 'Wood distillation yields charcoal and pyroligneous acid; petroleum cracking supplies modern plastics.', 'Those make glass.', 'Those make soap.'] },
      { l: 3, q: 'Which of the following processes is an industrial application of biotechnology?', o: ['Production of ethanol from cassava starch using enzymes and yeast', 'Manufacture of ammonia from nitrogen and hydrogen over iron', 'Fractional distillation of liquid air', 'Electrolysis of concentrated brine'], a: 0, e: 'Biotechnology uses living organisms (yeast) or biological enzymes (diastase/maltase/zymase) to transform raw materials.', w: ['', 'The Haber process is purely inorganic catalysis at high T and P.', 'Liquid air separation is a physical fractional distillation.', 'Brine electrolysis is an electrochemical process.'] },
      { l: 3, q: 'Biogas produced by anaerobic digestion of animal waste consists mainly of', o: ['methane and carbon(IV) oxide', 'butane and propane', 'carbon(II) oxide and hydrogen', 'ethene and ethyne'], a: 0, e: 'Anaerobic bacteria decompose organic waste into ~60% CH₄ and ~35% CO₂ (with traces of H₂S).', w: ['', 'Propane and butane are Liquefied Petroleum Gas (LPG) from crude oil.', 'CO + H₂ is water gas (synthesis gas) from steam + red-hot coke.', 'Ethene and ethyne are unsaturated hydrocarbons.'] },
      { l: 3, q: 'In soap manufacture, sodium chloride (brine) is added after boiling palm oil with NaOH in order to', o: ['decrease the solubility of the soap and precipitate ("salt out") the soap', 'neutralise excess glycerol', 'bleach the palm oil white', 'saponify the fatty acids'], a: 0, e: 'Common-ion / salting-out effect lowers soap solubility so solid soap floats as a crust above the spent lye.', w: ['', 'Glycerol is neutral.', 'Brine does not bleach palm oil.', 'NaOH performs saponification; NaCl salts out the soap formed.'] },
      { l: 3, q: 'Which chemical industry uses brine, ammonia and limestone as its three principal raw materials?', o: ['Manufacture of Na₂CO₃ by the Solvay process', 'Manufacture of H₂SO₄ by the Contact process', 'Extraction of iron in the blast furnace', 'Production of margarine'], a: 0, e: 'The Solvay process uses ammoniated brine + CO₂ (from limestone) to precipitate NaHCO₃, which is heated to Na₂CO₃.', w: ['', 'Contact process uses sulphur, air and water.', 'Blast furnace uses iron ore, coke and limestone.', 'Margarine uses vegetable oil and hydrogen over nickel.'] },
      { l: 4, q: 'Enzymes are increasingly preferred over harsh inorganic catalysts in industrial biotechnology because enzymes', o: ['are highly specific and work efficiently at mild temperatures and pH', 'never denature even at 500 °C', 'increase the equilibrium yield of reversible reactions', 'are inorganic transition metals'], a: 0, e: 'Enzymes are biological protein catalysts that give clean, specific products at 30–45 °C, saving energy.', w: ['', 'Enzymes are proteins and denature above ~60 °C.', 'No catalyst alters the equilibrium yield.', 'Enzymes are globular proteins, not inorganic metals.'] },
      { l: 4, q: 'Fine chemicals command a much higher price per kilogram than heavy chemicals primarily because', o: ['costly multi-stage purification and strict quality control are required', 'their raw materials only come from outer space', 'they can only be prepared by nuclear fission', 'they contain noble gases'], a: 0, e: 'Pharmaceuticals and analytical reagents require multi-step synthesis, recrystallisation/chromatography and strict assay testing.', w: ['', 'Their raw materials often come from ordinary petrochemicals or plants.', 'They are made by ordinary chemical or biotechnological synthesis.', 'Noble gases are rarely present in fine chemicals.'] },
      { l: 5, q: 'Which pair correctly matches a Nigerian industrial sector with its local mineral raw material?', o: ['Iron & steel (Ajaokuta) — haematite iron ore and limestone', 'Aluminium smelting — cassiterite (SnO₂)', 'Cement manufacture — galena (PbS)', 'Glass manufacture — pitchblende (UO₂)'], a: 0, e: 'Iron & steel uses iron ore (haematite, Fe₂O₃, e.g. Itakpe) and limestone flux. Cassiterite is tin ore, galena is lead ore, and pitchblende is uranium ore.', w: ['', 'Cassiterite (SnO₂, Jos Plateau) is the ore of tin; aluminium uses bauxite.', 'Galena (PbS) is lead ore; cement uses limestone and clay.', 'Pitchblende is uranium ore; glass uses silica sand (SiO₂), soda ash and limestone.'] },
    ],
  },

  {
    id: 'c-astro',
    name: 'Astronomical Chemistry & Earth Segments',
    sec: 'Unit 18 · Astronomical Chemistry',
    boss: 'Astronomical Chemistry Mastery Test',
    goals: CHEM_SYLLABUS_2027_META['c-astro'].goals,
    trap: 'Know both the 8 IAU planets in order (Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune — Mercury smallest, Neptune farthest) AND JAMB’s classical 9-planet syllabus phrasing where Pluto is cited when a question asks for "the smallest planet that is also the farthest from the Sun". Also never confuse the most abundant gas in the atmosphere (N₂, 78%) with the most abundant element in Earth’s crust/lithosphere (Oxygen, ~46.6%).',
    parts: [
      {
        title: 'The Solar System, Planets & Earth’s Satellite',
        idea: 'The Solar System is bound by the gravity of the Sun—a giant sphere of glowing plasma (~73% hydrogen, ~25% helium) powered by nuclear fusion. Orbiting the Sun are eight planets, dwarf planets (such as Pluto), moons, asteroids and icy comets.',
        rules: [
          'Order from the Sun ("My Very Educated Mother Just Served Us Noodles"): Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.',
          'Inner 4 (Mercury–Mars) are rocky silicate/iron terrestrial planets; Outer 4 (Jupiter–Neptune) are gas/ice giants rich in H₂, He, CH₄ and NH₃.',
          'Earth’s natural satellite is the Moon. Under IAU rules: Mercury = smallest planet, Jupiter = largest, Neptune = farthest; in classical 9-planet JAMB questions asking "smallest planet that is also farthest from the Sun", the intended answer is Pluto (now classified as a dwarf planet).',
        ],
        ex: {
          q: 'List the planets of the Solar System in order of increasing distance from the Sun, and name the natural satellite of the Earth.',
          steps: [
            ['Inner rocky planets: Mercury, Venus, Earth, Mars', 'Composed mainly of silicate rocks and iron-nickel cores.'],
            ['Outer giant planets: Jupiter, Saturn, Uranus, Neptune', 'Rich in H₂ and He (Jupiter, Saturn) or H₂O, NH₃ and CH₄ ices (Uranus, Neptune).'],
            ['Natural satellite of the Earth: The Moon', 'Orbits the Earth every ~27.3 days; Mars has Phobos & Deimos, while Mercury and Venus have zero moons.'],
          ],
          why: [
            1,
            'How should you handle a JAMB question asking for "the smallest planet that is also the farthest from the Sun"?',
            [
              'Check the options: if Pluto is listed, select Pluto (classical syllabus objective v); if only the 8 IAU planets are listed, Mercury is smallest and Neptune is farthest',
              'Mars is both smallest and farthest',
              'Jupiter is the smallest planet',
            ],
            [
              'Exactly! JAMB Objective 18(v) retains the classic phrasing describing Pluto. Knowing both IAU facts and the Pluto objective guarantees full marks.',
              'Mars is the 4th planet from the Sun.',
              'Jupiter is the largest planet in the Solar System.',
            ],
          ],
        },
        tryit: {
          q: 'What is the name of the natural satellite of the Earth?',
          ask: 'Select Earth’s natural satellite.',
          o: ['The Moon', 'Titan', 'Phobos', 'Halley’s comet'],
          a: 0,
          h: 'Which natural body orbits the Earth once a month?',
          e: 'The Moon (Luna) is Earth’s sole natural satellite. Titan orbits Saturn; Phobos orbits Mars.',
          fb: [
            '',
            'Titan is the largest moon of Saturn (with a dense nitrogen-methane atmosphere).',
            'Phobos is one of the two small moons of Mars.',
            'Halley’s comet orbits the Sun in a long ellipse, not the Earth.',
          ],
        },
      },
      {
        title: 'Segments of the Earth: Atmosphere & Hydrosphere',
        idea: 'Chemists divide the outer Earth into three interacting chemical spheres: the gaseous Atmosphere, the aqueous Hydrosphere, and the rocky Lithosphere (plus the Biosphere of living organisms).',
        rules: [
          'Dry Atmosphere by volume: Nitrogen (78.1%), Oxygen (20.9%), Argon (0.93%), Carbon(IV) oxide (0.03–0.04%), plus trace Ne, He, CH₄, Kr and variable H₂O vapour.',
          'Atmospheric layers: Troposphere (0–12 km, weather & clouds) → Stratosphere (12–50 km, contains the O₃ ozone layer absorbing harmful UV) → Mesosphere → Thermosphere.',
          'Hydrosphere: covers ~71% of Earth’s surface; oceans hold ~97% of Earth’s water (~3.5% dissolved salts, mainly NaCl and Mg²⁺ salts), while ~3% is fresh water (ice caps, groundwater, rivers).',
        ],
        ex: {
          q: 'Arrange the top four gases in clean, dry air in decreasing order of percentage by volume, and state which atmospheric layer contains the protective ozone shield.',
          steps: [
            ['N₂ (78%) > O₂ (21%) > Ar (0.93%) > CO₂ (0.04%)', 'Argon—a noble gas—is the 3rd most abundant gas in dry air, ahead of CO₂!'],
            ['Stratosphere contains the ozone (O₃) layer', 'Trioxygen (O₃) absorbs high-energy solar ultraviolet radiation before it can damage living cells.'],
          ],
        },
        tryit: {
          q: 'Which is the third most abundant gas in clean, dry atmospheric air?',
          ask: 'Watch out for the classic CO₂ trap!',
          o: ['Argon (0.93%)', 'Carbon(IV) oxide (0.04%)', 'Hydrogen', 'Neon'],
          a: 0,
          h: 'Compare 0.93% (argon) with 0.04% (CO₂).',
          e: 'After N₂ (78%) and O₂ (21%), Argon makes up 0.93% of dry air—more than twenty times the 0.04% of CO₂!',
          fb: [
            '',
            'CO₂ is fourth (~0.04%). Argon (0.93%) is third!',
            'Free H₂ is < 0.0001% because Earth’s gravity loses light H₂ from the upper atmosphere.',
            'Neon is present only in trace amounts (~0.0018%).',
          ],
        },
      },
      {
        title: 'The Lithosphere: Chemical Composition of Earth’s Crust',
        idea: 'The lithosphere is the solid rocky crust and upper mantle of the Earth. Nearly three-quarters of the mass of the Earth’s crust consists of just two elements—Oxygen and Silicon—chemically bound together in silicate and aluminosilicate minerals.',
        rules: [
          'Order of abundance in Earth’s crust by mass: Oxygen (46.6%) > Silicon (27.7%) > Aluminium (8.1%) > Iron (5.0%) > Calcium (3.6%) > Sodium (2.8%) > Potassium (2.6%) > Magnesium (2.1%).',
          'Most abundant element overall in the lithosphere = Oxygen; most abundant metal in the crust = Aluminium (Iron is 2nd most abundant metal in the crust, though Iron dominates Earth’s deep core).',
          'Common crustal minerals: quartz/sand (SiO₂), bauxite (Al₂O₃·2H₂O), haematite (Fe₂O₃), limestone (CaCO₃), clay/feldspar (aluminosilicates).',
        ],
        ex: {
          q: 'What are the first, second and third most abundant elements by mass in the Earth’s crust (lithosphere)?',
          steps: [
            ['1st: Oxygen (~46.6%)', 'Bound with metals and silicon in oxide, silicate and carbonate rocks.'],
            ['2nd: Silicon (~27.7%)', 'Forms the SiO₄⁴⁻ silicate backbone of sand, quartz, granite and clay.'],
            ['3rd: Aluminium (~8.1%)', 'Makes Aluminium the most abundant metallic element in the Earth’s crust.'],
          ],
        },
        tryit: {
          q: 'Which is the most abundant METALLIC element in the Earth’s crust (lithosphere)?',
          ask: 'Read carefully: metallic element in the crust.',
          o: ['Aluminium', 'Oxygen', 'Silicon', 'Copper'],
          a: 0,
          h: 'Oxygen is a non-metal and Silicon is a metalloid. Which metal comes next at 8.1%?',
          e: 'Oxygen (46.6%) is a non-metal and Silicon (27.7%) is a metalloid, so Aluminium (8.1%) is the most abundant metal in the Earth’s crust (ahead of Iron at 5.0%).',
          fb: [
            '',
            'Oxygen is the most abundant element overall in the crust, but it is a non-metal, not a metal!',
            'Silicon (2nd overall) is a metalloid, not a metal.',
            'Copper is a trace crustal metal (< 0.01%).',
          ],
        },
      },
    ],
    spot: {
      part: 2,
      who: 'Amina',
      q: 'Name the most abundant element in the Earth’s atmosphere and the most abundant metal in the Earth’s lithosphere.',
      lines: [
        'Atmosphere: Nitrogen (78% by volume) is the most abundant gas',
        'Lithosphere: Oxygen (46.6%) and Silicon (27.7%) are the top two elements',
        'Therefore Silicon is the most abundant metal in the lithosphere',
      ],
      bad: 2,
      okfb: ['Correct: N₂ makes up ~78% of dry air.', 'Correct: O (46.6%) and Si (27.7%) top the Earth’s crust.'],
      o: [
        'Silicon is a metalloid; Aluminium (8.1%) is the most abundant metal in the lithosphere',
        'Oxygen is a metal',
        'Oxygen (21%) is more abundant than Nitrogen in air',
        'Gold is the most abundant metal in the crust',
      ],
      fb: [
        'Exact! Always check whether JAMB asks for "most abundant element" (Oxygen), "second most abundant element" (Silicon), or "most abundant metal" (Aluminium).',
        'Oxygen is a Group VI non-metal.',
        'Nitrogen (78%) is nearly four times as abundant as Oxygen (21%) in air.',
        'Gold is an extremely rare noble metal.',
      ],
      h: ['Is Silicon a metal or a metalloid? Which true metal comes third in crustal abundance?'],
      fix: 'Aluminium (~8.1% by mass) is the most abundant metallic element in the Earth’s lithosphere.',
    },
    qs: [
      { l: 1, dx: 1, q: 'The three main physical segments of the Earth studied in chemistry are the', o: ['atmosphere, hydrosphere and lithosphere', 'troposphere, sun and moon', 'ionosphere, comets and asteroids', 'core, nebula and galaxy'], a: 0, e: 'Earth consists of the gaseous atmosphere, aqueous hydrosphere and solid rocky lithosphere.', w: ['', 'The Sun and Moon are separate celestial bodies.', 'Comets and asteroids orbit the Sun in space.', 'Nebulae and galaxies are deep-space structures.'] },
      { l: 1, q: 'The natural satellite of the Earth is', o: ['the Moon', 'Venus', 'the Sun', 'Ganymede'], a: 0, e: 'The Moon is Earth’s only natural satellite.', w: ['', 'Venus is a planet orbiting the Sun.', 'The Sun is the central star of the Solar System.', 'Ganymede is a moon of Jupiter.'] },
      { l: 1, q: 'The energy radiated by the Sun is produced mainly by the', o: ['nuclear fusion of hydrogen nuclei into helium', 'combustion of hydrogen in oxygen', 'nuclear fission of uranium-235', 'radioactive decay of carbon-14'], a: 0, e: 'At ~15 million K in the Sun’s core, hydrogen nuclei fuse into helium, releasing vast energy.', w: ['', 'Burning H₂ in O₂ is an ordinary chemical reaction—far too weak and there is little O₂.', 'Fission of U-235 powers Earth nuclear reactors, not stars.', 'C-14 is used for radiocarbon dating.'] },
      { l: 2, q: 'Which list gives the four inner terrestrial planets in correct order outward from the Sun?', o: ['Mercury, Venus, Earth, Mars', 'Venus, Mercury, Earth, Mars', 'Mercury, Earth, Venus, Jupiter', 'Mars, Earth, Venus, Mercury'], a: 0, e: 'From the Sun outward: Mercury (1st), Venus (2nd), Earth (3rd), Mars (4th).', w: ['', 'Mercury is closer to the Sun than Venus.', 'Venus lies between Mercury and Earth; Jupiter is 5th.', 'That is the reverse order.'] },
      { l: 2, q: 'In the classical 9-planet JAMB syllabus classification, which body was identified as the smallest planet that is also the farthest from the Sun?', o: ['Pluto', 'Mercury', 'Jupiter', 'Venus'], a: 0, e: 'Historically Pluto was the 9th planet—both smallest and farthest from the Sun (reclassified as a dwarf planet by the IAU in 2006; among the 8 planets, Mercury is smallest and Neptune is farthest).', w: ['', 'Mercury is the smallest of the 8 IAU planets, but it is closest to the Sun, not farthest.', 'Jupiter is the largest planet and 5th from the Sun.', 'Venus is the 2nd planet from the Sun.'] },
      { l: 2, q: 'Among the eight IAU-recognised planets of the Solar System, which planet is farthest from the Sun?', o: ['Neptune', 'Uranus', 'Saturn', 'Mars'], a: 0, e: 'Order of the outer giant planets: Jupiter (5th), Saturn (6th), Uranus (7th), Neptune (8th and farthest).', w: ['', 'Uranus is 7th; Neptune is 8th.', 'Saturn is 6th.', 'Mars is 4th.'] },
      { l: 2, q: 'Which two elements make up over 98% of the mass of the Sun and the gas giant Jupiter?', o: ['Hydrogen and helium', 'Oxygen and silicon', 'Iron and nickel', 'Nitrogen and oxygen'], a: 0, e: 'Both the Sun and gas giants (Jupiter, Saturn) are composed predominantly of hydrogen and helium.', w: ['', 'Oxygen and silicon dominate Earth’s rocky lithosphere.', 'Iron and nickel dominate Earth’s metallic core and iron meteorites.', 'Nitrogen and oxygen dominate Earth’s atmosphere.'] },
      { l: 3, q: 'The two most abundant elements by mass in the Earth’s lithosphere (crust) are', o: ['oxygen and silicon', 'nitrogen and oxygen', 'iron and aluminium', 'hydrogen and helium'], a: 0, e: 'Earth’s crust is ~46.6% oxygen and ~27.7% silicon by mass (mainly silicate minerals).', w: ['', 'Nitrogen and oxygen dominate the atmosphere, not the rocky crust.', 'Aluminium (8.1%) and iron (5.0%) are 3rd and 4th in the crust.', 'Hydrogen and helium dominate the Sun and universe, not Earth’s crust.'] },
      { l: 3, q: 'Which metal is the most abundant metallic element in the Earth’s crust?', o: ['Aluminium', 'Iron', 'Calcium', 'Sodium'], a: 0, e: 'In the crust: O (46.6%) > Si (27.7%) > Al (8.1%) > Fe (5.0%). Aluminium is the #1 metal in the crust.', w: ['', 'Iron is 2nd among metals in the crust (though #1 in Earth’s deep core).', 'Calcium (~3.6%) is 3rd among crustal metals.', 'Sodium (~2.8%) is 4th among crustal metals.'] },
      { l: 3, q: 'Which region of the Earth’s atmosphere contains the ozone (O₃) layer that absorbs harmful solar ultraviolet radiation?', o: ['Stratosphere', 'Troposphere', 'Lithosphere', 'Hydrosphere'], a: 0, e: 'The ozone shield sits in the stratosphere (~15–35 km altitude).', w: ['', 'The troposphere is the lowest layer where clouds and weather occur.', 'The lithosphere is the solid rock crust.', 'The hydrosphere is Earth’s water envelope.'] },
      { l: 4, q: 'Approximately what percentage of the Earth’s water in the hydrosphere is saline ocean and sea water, and what is its main dissolved salt?', o: ['About 97%, mainly sodium chloride (NaCl)', 'About 21%, mainly calcium trioxocarbonate(IV)', 'About 50%, mainly tetraoxosulphate(VI) acid', 'About 10%, mainly potassium trioxonitrate(V)'], a: 0, e: 'Oceans hold ~97% of Earth’s water with ~3.5% salinity, dominated by Na⁺ and Cl⁻ ions.', w: ['', '21% is the volume % of O₂ in air.', 'Oceans account for ~97%, and they are slightly alkaline (~pH 8.1), not H₂SO₄.', 'Fresh water is ~3% and oceans are ~97%.'] },
      { l: 4, q: 'Venus has a higher average surface temperature (~465 °C) than Mercury even though Mercury is closer to the Sun because Venus', o: ['has a thick carbon(IV) oxide atmosphere causing an extreme greenhouse effect', 'undergoes nuclear fusion in its crust', 'has three moons reflecting sunlight onto it', 'is composed entirely of molten uranium'], a: 0, e: 'Venus’s dense ~96% CO₂ atmosphere traps infrared heat—a classic astronomical chemistry illustration of the greenhouse effect.', w: ['', 'Planets are far too light for core nuclear fusion.', 'Venus has zero natural satellites.', 'Venus is a rocky silicate planet with an iron core.'] },
    ],
  },
];

/* ──────────────────────────────────────────────────────────────────────────
   INTERACTIVE EXPLORERS, SOCRATIC DIALOGUES & 2027 SYLLABUS TEACH BLOCKS
   ────────────────────────────────────────────────────────────────────────── */
export const CHEM_2027_PREPENDED_BEATS: Record<string, Record<number, Beat[]>> = {
  'c-mole': {
    2: [
      {
        k: 'teach',
        title: 'All Four Laws of Chemical Combination (2027 Syllabus)',
        body: [
          ['p', 'JAMB tests <b>four</b> laws of chemical combination—especially deducing which law a numerical experiment illustrates:'],
          [
            'tb',
            ['Law', 'Key Signature in Exam Data', 'Example'],
            [
              ['Conservation of Matter', 'Total mass before reaction = total mass after reaction in a closed vessel', 'AgNO₃ + NaCl → AgCl↓ + NaNO₃ (mass unchanged)'],
              ['Definite Proportions', 'Same compound prepared by different routes always has the SAME % by mass', 'CuO from heating CuCO₃ vs Cu(NO₃)₂ is always 80% Cu, 20% O'],
              ['Multiple Proportions', 'Two elements A & B form 2+ compounds (e.g. CO and CO₂); masses of B for fixed A are in simple whole-number ratio', 'For 12 g C: O is 16 g in CO and 32 g in CO₂ → ratio 1 : 2'],
              ['Reciprocal Proportions', 'THREE elements A, B, C combine in pairs (AB, AC, BC); masses of A & B combining with fixed C are simple multiples of the ratio in which A & B combine with each other', 'C, H, O in CH₄, H₂O and CO₂'],
            ],
          ],
          ['wn', 'Two compounds of the SAME two elements → <b>Multiple Proportions</b>. Same compound from DIFFERENT methods → <b>Definite Proportions</b>. THREE elements combining in pairs → <b>Reciprocal Proportions</b>.'],
        ],
      },
    ],
  },

  'c-kin': {
    1: [
      {
        k: 'explore',
        xp: 'gaslaw',
        cfg: { mode: 'boyle', V: 4, Tc: 27, n: 1, gas: 'O2' },
        title: 'Explore Gas Laws, Vapour Density & Diffusion Live',
        intro: 'Use the interactive gas cylinder to compress a gas, heat it in kelvin, and compare molecular speeds across different gases.',
        predict: {
          q: 'A gas occupies 4.0 dm³ at 3.0 atm and constant temperature. Before moving the slider: what happens to the pressure if you compress the volume to 2.0 dm³?',
          o: [
            'It doubles to 6.0 atm because particles hit the walls twice as often',
            'It halves to 1.5 atm',
            'It stays at 3.0 atm because temperature is constant',
            'It rises to 5.0 atm',
          ],
          fb: [
            'Spot on! P₁V₁ = P₂V₂ → 3.0 × 4.0 = P₂ × 2.0 → P₂ = 6.0 atm.',
            'Smaller volume crowds the molecules into half the space, raising—not lowering—pressure.',
            'Constant temperature keeps average speed constant, but halving volume doubles collision frequency.',
            'Gas pressure scales inversely by multiplication (×2), not addition (+2).',
          ],
        },
        tasks: [
          {
            t: "In Boyle's mode, compress Volume V to 2.0 dm³ so Pressure reaches 6.0 atm.",
            ok: (s) => s.mode === 'boyle' && s.V === 2,
            say: 'P × V = 6.0 × 2.0 = 12.0 atm·dm³—identical to 3.0 × 4.0!',
          },
          {
            t: "Switch to Charles' mode and heat the gas to 177 °C (450 K).",
            ok: (s) => s.mode === 'charles' && s.Tc === 177,
            say: 'At 450 K (1.5 × 300 K), Volume expands proportionally from 6.0 dm³ to 9.0 dm³!',
          },
          {
            t: 'Switch to PV = nRT & Diffusion mode and select Hydrogen (H₂) to see its Vapour Density and diffusion rate.',
            ok: (s) => s.mode === 'ideal' && s.gas === 'H2',
            say: 'H₂ has Mᵣ = 2, Vapour Density = 1, and diffuses √(32/2) = 4× as fast as O₂!',
          },
        ],
        found: 'Boyle: P₁V₁ = P₂V₂ (const T). Charles: V₁/T₁ = V₂/T₂ in KELVIN. Relative molecular mass Mᵣ = 2 × Vapour Density, and lighter gases diffuse faster: r₁/r₂ = √(M₂/M₁).',
        rules: [
          'Dalton’s law of partial pressures: P_total = P_A + P_B + … (for non-reacting gases); P_dry gas = P_atm − P_water vapour.',
          'Mᵣ = 2 × Vapour Density (VD). Ideal gas equation: PV = nRT.',
          'Real gases deviate from ideal behaviour at HIGH pressure and LOW temperature because intermolecular attractions become significant and molecular volume is non-zero.',
        ],
      },
    ],
  },

  'c-atom': {
    0: [
      {
        k: 'teach',
        title: 'Pioneers of Atomic Structure (JAMB Objective 4a)',
        body: [
          ['p', 'JAMB frequently asks which scientist discovered each feature of the atom:'],
          [
            'tb',
            ['Scientist', 'Key Experiment', 'Contribution to Atomic Structure'],
            [
              ['John Dalton (1808)', 'Chemical combination ratios', 'Proposed atomic theory: matter consists of indivisible atoms of each element'],
              ['J.J. Thomson (1897)', 'Cathode-ray discharge tube', 'Discovered the electron, measured charge-to-mass ratio (e/m), proposed "plum-pudding" model'],
              ['R.A. Millikan (1909)', 'Oil-drop experiment', 'Measured the fundamental electric charge on a single electron (1.60 × 10⁻¹⁹ C)'],
              ['Ernest Rutherford (1911)', 'Gold-foil α-particle scattering', 'Discovered the tiny, dense, positively charged nucleus; showed atom is mostly empty space'],
              ['Henry Moseley (1913)', 'X-ray spectra of elements', 'Established Atomic Number (Z = nuclear proton count) as the true basis of the Periodic Table'],
              ['Niels Bohr (1913)', 'Hydrogen line emission spectrum', 'Proposed quantised circular electron shells/energy levels (K, L, M, N) around the nucleus'],
            ],
          ],
          ['key', 'Cathode rays → <b>J.J. Thomson</b>. Oil drop → <b>Millikan</b>. Gold-foil nucleus → <b>Rutherford</b>. X-ray atomic number → <b>Moseley</b>. Quantised shells → <b>Bohr</b>.'],
        ],
      },
      {
        k: 'explore',
        xp: 'atombuild',
        cfg: { Z: 11, nDelta: 0, charge: 0 },
        title: 'Build Atoms, Isotopes, Ions & Subshells (Z = 1 to 20)',
        intro: 'Slide Atomic Number Z from Hydrogen (1) to Calcium (20), add neutrons to form isotopes, or adjust charge to form noble-gas ions.',
        predict: {
          q: 'Sodium has Z = 11. When a neutral Na atom (2, 8, 1) loses 1 electron to form Na⁺, how many electrons are in s orbitals and p orbitals?',
          o: [
            '4 electrons in s orbitals (1s² 2s²) and 6 in p orbitals (2p⁶)',
            '2 in s orbitals and 8 in p orbitals',
            '5 in s orbitals and 6 in p orbitals',
            '6 in s orbitals and 4 in p orbitals',
          ],
          fb: [
            'Yes! Na⁺ has 10 electrons: 1s² 2s² 2p⁶ → (2 + 2) = 4 s-electrons and 6 p-electrons, matching Neon.',
            'Each s subshell holds 2 electrons: 1s² + 2s² = 4 s-electrons, leaving 6 in 2p⁶.',
            '5 + 6 = 11 electrons—that is neutral Na (1s² 2s² 2p⁶ 3s¹), before losing the 3s¹ electron.',
            'p orbitals start at shell 2 (2p⁶ holds 6 electrons).',
          ],
        },
        tasks: [
          {
            t: 'Form the sodium ion Na⁺ (Z = 11, Charge = +1) so it attains a Neon octet (2, 8).',
            ok: (s) => s.Z === 11 && s.charge === 1,
            say: 'Na⁺ has 11 protons and 10 electrons (1s² 2s² 2p⁶)—a stable Neon octet!',
          },
          {
            t: 'Set Z = 17 (Chlorine, neutral) and set Isotope Δn⁰ = +2 to build Chlorine-37 (³⁷₁₇Cl).',
            ok: (s) => s.Z === 17 && s.nDelta === 2 && s.charge === 0,
            say: '³⁵₁₇Cl (75%) and ³⁷₁₇Cl (25%) are isotopes: same Z = 17, giving Aᵣ = 35.5!',
          },
          {
            t: 'Set Z = 20 (Calcium, neutral) to verify how shells fill 2, 8, 8, 2 via 4s².',
            ok: (s) => s.Z === 20 && s.charge === 0,
            say: 'Calcium (Z = 20): 1s² 2s² 2p⁶ 3s² 3p⁶ 4s² → Period 4, Group II alkaline-earth metal!',
          },
        ],
        found: 'Atomic number Z fixes the element and position on the periodic table; neutrons only change mass number A (isotopes); outer-shell electrons fix chemical bonding.',
      },
    ],
    2: [
      {
        k: 'teach',
        title: 'The Four Quantum Numbers & Orbital Shapes (s vs p)',
        body: [
          ['p', 'Every electron in an atom is uniquely described by <b>four quantum numbers</b> (Pauli’s exclusion principle states no two electrons in the same atom share all four):'],
          [
            'tb',
            ['Quantum Number', 'Symbol', 'Allowed Values & Meaning'],
            [
              ['Principal', 'n', '1, 2, 3, 4 … (K, L, M, N main energy shell & size; max electrons in shell = 2n²)'],
              ['Subsidiary / Azimuthal', 'l', '0 to (n − 1): defines subshell shape → l = 0 (s), l = 1 (p), l = 2 (d), l = 3 (f)'],
              ['Magnetic', 'm (or m_l)', '−l … 0 … +l: orientation in space → s has 1 orbital (0); p has 3 orbitals (−1, 0, +1: pₓ, pᵧ, p₂)'],
              ['Spin', 's (or m_s)', '+½ or −½: direction of electron spin inside an orbital (max 2 opposite-spin e⁻ per orbital)'],
            ],
          ],
          ['li', [
            '<b>Shape of s orbital:</b> spherical and non-directional (1 orbital per s subshell, holds max 2 e⁻).',
            '<b>Shape of p orbital:</b> dumbbell-shaped along x, y and z axes (3 degenerate orbitals pₓ, pᵧ, p₂ per p subshell, holds max 6 e⁻).',
          ]],
        ],
      },
    ],
  },

  'c-per': {
    0: [
      {
        k: 'explore',
        xp: 'atombuild',
        cfg: { Z: 12, nDelta: 0, charge: 0 },
        title: 'Explore Periodic Families Across Z = 1 to 20',
        intro: 'Step across Period 2 (Z = 3–10) and Period 3 (Z = 11–18) to watch shells stay constant while outer electrons increase from 1 to 8.',
        tasks: [
          {
            t: 'Find the most electronegative element (Fluorine, Z = 9, Group VII halogen).',
            ok: (s) => s.Z === 9 && s.charge === 0,
            say: 'Fluorine (2, 7) has only 2 shells and 7 valence electrons—giving it the highest electronegativity on the periodic table.',
          },
          {
            t: 'Select Aluminium (Z = 13), the Period 3 Group III amphoteric metal.',
            ok: (s) => s.Z === 13 && s.charge === 0,
            say: 'Al (2, 8, 3) has 3 shells (Period 3) and 3 valence electrons (Group III); its oxide Al₂O₃ is amphoteric.',
          },
          {
            t: 'Select Argon (Z = 18), the Period 3 noble gas.',
            ok: (s) => s.Z === 18 && s.charge === 0,
            say: 'Argon (2, 8, 8) has a complete octet—chemically unreactive and ~0.93% of air!',
          },
        ],
        found: 'Across a period (left → right): nuclear charge rises so atomic radius shrinks, ionisation energy & electronegativity INCREASE, and metallic electrical/thermal conductivity drops from metals (Na, Mg, Al) to non-metals.',
      },
    ],
  },

  'c-bond': {
    1: [
      {
        k: 'teach',
        title: 'Coordinate (Dative) Complexes & Shapes of Molecules',
        body: [
          ['p', 'In a <b>coordinate (dative) covalent bond</b>, one atom (the ligand with a lone pair, such as :NH₃, :CN⁻, H₂O: or Cl⁻) donates <i>both</i> shared electrons to an empty orbital on a proton or metal ion:'],
          ['li', [
            '<b>Ammonium & hydroxonium ions:</b> NH₃ + H⁺ → NH₄⁺ (tetrahedral); H₂O + H⁺ → H₃O⁺.',
            '<b>Syllabus Transition-Metal Complexes:</b> [Cu(NH₃)₄]²⁺ (deep-blue tetraamminecopper(II) ion), [Ag(NH₃)₂]⁺ (diamminesilver(I) ion in Tollens’ reagent), [Fe(CN)₆]⁴⁻ (hexacyanoferrate(II)), and [Fe(CN)₆]³⁻ (hexacyanoferrate(III)).',
          ]],
          [
            'tb',
            ['Molecule / Ion', 'Bonding Pairs + Lone Pairs on Central Atom', 'Molecular Shape & Bond Angle'],
            [
              ['H₂, O₂, Cl₂, HCl', 'Diatomic (2 atoms only)', 'Linear'],
              ['CO₂ (O=C=O)', '2 double-bond regions, 0 lone pairs on C', 'Linear (180°)'],
              ['CH₄ (methane)', '4 bonding pairs, 0 lone pairs on C', 'Tetrahedral (109.5°)'],
              ['NH₃ (ammonia)', '3 bonding pairs, 1 lone pair on N', 'Trigonal pyramidal (107°)'],
              ['H₂O (water)', '2 bonding pairs, 2 lone pairs on O', 'Non-linear / V-shaped / Bent (104.5°)'],
            ],
          ],
          ['wn', 'CO₂ and H₂O both have 3 atoms, yet CO₂ is <b>linear (180°)</b> because carbon has NO lone pairs, whereas H₂O is <b>bent (104.5°)</b> because oxygen has TWO lone pairs pushing the O–H bonds together!'],
        ],
      },
    ],
  },

  'c-sol': {
    2: [
      {
        k: 'teach',
        title: 'Non-Aqueous Solvents, Stain Removal, Suspensions & Colloids',
        body: [
          ['h', '1. Solvents for Fats, Oils, Paints & Stain Removal ("Like Dissolves Like")'],
          ['p', 'Water is polar, so covalent grease, oil, paint and wax do not dissolve in plain water. Match each stain to its syllabus solvent:'],
          [
            'tb',
            ['Substance / Stain', 'Suitable Solvent', 'Everyday Use'],
            [
              ['Fats, grease & oil stains', 'Petrol, hexane, propanone or tetrachloromethane', 'Dry-cleaning clothes without shrinking wool/silk'],
              ['Oil paint & resin varnish', 'Turpentine (or kerosene)', 'Cleaning paint brushes & thinning oil paints'],
              ['Nail varnish / resin lacquer', 'Propanone (acetone) or ethyl ethanoate', 'Nail polish remover'],
              ['Chlorophyll (grass stain) & iodine', 'Ethanol (methylated spirit)', 'Tincture of iodine; removing leaf stains'],
              ['Coffee, tea or perspiration stains', 'Warm borax solution or dilute aqueous ammonia', 'Emulsifies acidic sweat oils'],
              ['Natural rubber', 'Benzene or methylbenzene (toluene)', 'Vulcanizing / rubber solution adhesive'],
            ],
          ],
          ['h', '2. True Solutions vs False Solutions (Suspensions & Colloids)'],
          [
            'tb',
            ['Property', 'True Solution', 'Colloid ("False Solution")', 'Suspension'],
            [
              ['Particle size', '< 1 nm (ions / small molecules)', '1 – 1000 nm (macromolecules / clusters)', '> 1000 nm (visible aggregates)'],
              ['Settles on standing?', 'Never settles', 'Does NOT settle', 'Settles out on standing'],
              ['Filter paper?', 'Passes through', 'Passes through ordinary filter paper (stopped by dialysing membrane)', 'Retained on filter paper'],
              ['Light beam (Tyndall effect)', 'Transparent — no scattering', 'Scatters light beam (Tyndall effect!)', 'Opaque / scatters then settles'],
              ['JAMB Syllabus Examples', 'NaCl(aq), sugar in water, clean air', 'Fog, mist, aerosol spray, milk, blood, emulsion paint, starch sol, rubber solution, smoke', 'Harmattan haze (dust in air), water paint, muddy river water, chalk in water'],
            ],
          ],
          ['wn', 'Memorise JAMB’s exact contrast: <b>Harmattan haze</b> and <b>water paints</b> are <b>suspensions</b> (particles eventually settle); <b>fog, milk, blood, aerosol spray, emulsion paints</b> and <b>rubber solution</b> are <b>colloids</b>!'],
        ],
      },
    ],
  },

  'c-acid': {
    1: [
      {
        k: 'explore',
        xp: 'phscale',
        cfg: { preset: 'hcl', indicator: 'methyl' },
        title: 'Explore pH, pOH, Conductance & Salt Hydrolysis',
        intro: 'Test strong vs weak acids, alkalis, and hydrolysed salts (NH₄Cl, AlCl₃, CH₃COONa, Na₂CO₃) with indicators and a conductivity bulb!',
        predict: {
          q: 'Ammonium chloride (NH₄Cl) is a normal salt with no H or OH written in an acid/alkali formula. What happens to the pH when pure NH₄Cl dissolves in distilled water?',
          o: [
            'The solution becomes acidic (pH < 7) because NH₄Cl comes from a strong acid (HCl) and a weak base (NH₃)',
            'The solution stays strictly neutral at pH = 7.0',
            'The solution becomes strongly alkaline (pH > 11)',
            'NH₄Cl is insoluble in water',
          ],
          fb: [
            'Brilliant! NH₄⁺ hydrolyses slightly (NH₄⁺ + H₂O ⇌ NH₃ + H₃O⁺), making NH₄Cl(aq) acidic!',
            'Only salts of a strong acid + strong base (such as NaCl or KNO₃) give neutral pH 7 solutions.',
            'Salts of a weak acid + strong base (such as CH₃COONa or Na₂CO₃) become alkaline.',
            'All ammonium salts are soluble in water.',
          ],
        },
        tasks: [
          {
            t: 'Click 0.1 M CH₃COOH (ethanoic acid) and compare its dim conductivity bulb with 0.01 M HCl.',
            ok: (s) => s.preset === 'ethanoic',
            say: 'Weak acids ionise only partially → fewer mobile ions → low molar conductance (dim bulb)!',
          },
          {
            t: 'Click NH₄Cl(aq) or AlCl₃(aq) to verify acidic salt hydrolysis (pH < 7).',
            ok: (s) => s.preset === 'nh4cl' || s.preset === 'alcl3',
            say: 'Strong acid + weak base salt → acidic solution (turns blue litmus red)!',
          },
          {
            t: 'Click CH₃COONa(aq) or Na₂CO₃(aq) and switch indicator to Phenolphthalein.',
            ok: (s) => (s.preset === 'ch3coona' || s.preset === 'na2co3') && s.indicator === 'phenol',
            say: 'Weak acid + strong base salt → basic solution (pH > 7, pink in phenolphthalein)!',
          },
        ],
        found: 'At 25 °C, pH + pOH = 14. Strong electrolytes have high conductance. In salt hydrolysis, the stronger parent wins: NH₄Cl & AlCl₃ are acidic; Na₂CO₃ & CH₃COONa are basic; NaCl & K₂SO₄ are neutral.',
        rules: [
          'Naturally occurring organic acids: ethanoic acid (vinegar), citric acid (unripe citrus/lemons), tartaric acid (grapes/baking powder), lactic acid (sour milk).',
          'Buffer solution: resists change in pH when small amounts of acid or alkali are added (e.g. CH₃COOH/CH₃COONa or human blood HCO₃⁻/H₂CO₃ at pH 7.4).',
          'Alums (e.g. potash alum KAl(SO₄)₂·12H₂O) are double salts that ionise in water to yield K⁺, Al³⁺ and SO₄²⁻ ions and coagulate fine clay in water treatment.',
        ],
      },
    ],
  },

  'c-vol': {
    0: [
      {
        k: 'teach',
        title: 'Titration Curves & Choosing the Right Indicator (Unit 8d)',
        body: [
          ['p', 'An indicator works only if its colour-change pH range falls inside the steep vertical jump on the titration curve:'],
          [
            'tb',
            ['Titration Type', 'Example', 'Suitable Indicator(s)', 'Why'],
            [
              ['Strong acid + Strong base', 'HCl + NaOH', 'Methyl orange OR Phenolphthalein', 'Huge vertical pH jump (pH 3 → 11) covers both indicators'],
              ['Strong acid + Weak base', 'HCl + NH₃(aq) or Na₂CO₃', 'Methyl orange ONLY', 'End-point is acidic (pH 3–6); phenolphthalein changes too high'],
              ['Weak acid + Strong base', 'CH₃COOH or H₂C₂O₄ + NaOH', 'Phenolphthalein ONLY', 'End-point is alkaline (pH 8–10); methyl orange changes too early'],
              ['Weak acid + Weak base', 'CH₃COOH + NH₃(aq)', 'NO simple indicator suitable', 'No sharp vertical pH jump at equivalence'],
            ],
          ],
          ['key', 'Strong acid vs Weak base (including Na₂CO₃!) → <b>Methyl orange</b>. Weak organic acid (ethanoic/oxalic) vs Strong alkali → <b>Phenolphthalein</b>.'],
        ],
      },
    ],
  },

  'c-elec': {
    2: [
      {
        k: 'teach',
        title: 'Electrochemical Cells (E°_cell) & Corrosion Protection (Unit 10d–e)',
        body: [
          ['p', 'While an <b>electrolytic cell</b> uses electrical energy to force a non-spontaneous decomposition, an <b>electrochemical (galvanic/voltaic) cell</b> such as the Daniell cell (Zn | Zn²⁺ || Cu²⁺ | Cu) converts chemical energy spontaneously into electricity.'],
          ['li', [
            '<b>JAMB Electrochemical Series:</b> K, Ca, Na, Mg, Al, Zn, Fe, Sn, Pb, <b>H</b>, Cu, Hg, Ag, Au (most negative E° / strongest reducing agent at top; most positive E° / easiest cation to discharge at bottom).',
            '<b>Cell e.m.f. formula:</b> E°<sub>cell</sub> = E°<sub>cathode (reduction, more +ve)</sub> − E°<sub>anode (oxidation, more −ve)</sub>. Example: Zn²⁺/Zn = −0.76 V and Cu²⁺/Cu = +0.34 V → E°<sub>cell</sub> = +0.34 − (−0.76) = <b>+1.10 V</b>.',
            '<b>Primary vs Secondary cells:</b> Leclanché dry cell is non-rechargeable (primary); the lead–acid car accumulator (Pb / PbO₂ in H₂SO₄) is rechargeable (secondary).',
          ]],
          ['h', 'Corrosion of Iron as an Electrolytic Process'],
          ['p', 'Rusting requires <b>both oxygen and water</b> (accelerated by acids and dissolved NaCl). Tiny anodic and cathodic regions form on wet iron, oxidising Fe → Fe²⁺ → hydrated iron(III) oxide (Fe₂O₃·xH₂O).'],
          ['li', [
            '<b>Barrier methods:</b> painting, greasing/oiling, plastic coating, tin-plating (food cans—note: if scratched, iron rusts <i>faster</i> because Fe is above Sn in the series!).',
            '<b>Sacrificial / Cathodic protection:</b> galvanizing with <b>Zinc</b> or bolting <b>Magnesium/Zinc blocks</b> to ship hulls and underground steel pipelines. Because Zn and Mg are higher in the electrochemical series than Fe, they corrode preferentially (sacrificially) even if scratched, forcing iron to remain the cathode!',
          ]],
        ],
      },
    ],
  },

  'c-energy': {
    2: [
      {
        k: 'explore',
        xp: 'gibbs',
        cfg: { dH: -60, Ea: 90, catalyst: false, dS: -100, T: 300 },
        title: 'Explore Energy Profiles, Entropy & Gibbs Spontaneity (ΔG° = ΔH° − TΔS°)',
        intro: 'Adjust ΔH°, entropy ΔS°, temperature T and a catalyst to see when a reaction is spontaneous (ΔG° < 0), at equilibrium (ΔG° = 0) or non-spontaneous (ΔG° > 0).',
        predict: {
          q: 'If a reaction is endothermic (ΔH° = +40 kJ mol⁻¹) with a positive entropy increase (ΔS° = +100 J mol⁻¹ K⁻¹ = +0.10 kJ mol⁻¹ K⁻¹), above what temperature T does it become spontaneous?',
          o: [
            'Above 400 K, where TΔS° outweighs +ΔH° so ΔG° becomes negative',
            'Below 400 K',
            'Never—endothermic reactions can never be spontaneous',
            'At all temperatures',
          ],
          fb: [
            'Exact! At T = 400 K, ΔG° = 40 − 400(0.10) = 0 (equilibrium). Above 400 K, ΔG° < 0 (spontaneous)!',
            'Below 400 K (say 300 K), ΔG° = 40 − 30 = +10 kJ mol⁻¹ > 0 (non-spontaneous).',
            'Dissolving NH₄Cl in water is endothermic yet spontaneous at room temperature because ΔS° is strongly positive!',
            'At low temperatures +ΔH° dominates, making ΔG° positive.',
          ],
        },
        tasks: [
          {
            t: 'Set ΔH° = +40 kJ, ΔS° = +100 J/K and T = 400 K to hit exact Equilibrium (ΔG° = 0).',
            ok: (s) => s.dH === 40 && s.dS === 100 && s.T === 400,
            say: 'ΔG° = +40 − (400 × 0.10) = 0 kJ mol⁻¹ — the exact criterion for equilibrium!',
          },
          {
            t: 'Now raise Temperature T above 400 K (e.g. 600 K) so the endothermic reaction becomes Spontaneous!',
            ok: (s) => s.dH === 40 && s.dS === 100 && s.T >= 500,
            say: 'ΔG° is now negative! High temperature drives disorder-increasing (+ΔS°) reactions.',
          },
          {
            t: 'Click "Add Catalyst (MnO₂)" and observe what happens to Eₐ versus ΔH° and ΔG°.',
            ok: (s) => s.catalyst === true,
            say: 'Catalyst lowers Eₐ by 35 kJ mol⁻¹ (faster reaction), while ΔH° and ΔG° stay completely unchanged!',
          },
        ],
        found: 'Order of entropy (disorder): Solid < Liquid < Gas. A reaction is spontaneous when ΔG° = ΔH° − TΔS° < 0, at equilibrium when ΔG° = 0, and non-spontaneous when ΔG° > 0.',
      },
    ],
  },

  'c-rate': {
    0: [
      {
        k: 'explore',
        xp: 'gibbs',
        cfg: { dH: -80, Ea: 100, catalyst: false, dS: 50, T: 300 },
        title: 'See How MnO₂ Catalyst Lowers Activation Energy (Eₐ)',
        intro: 'In decomposing H₂O₂ or KClO₃, adding black MnO₂ makes O₂ fizz out rapidly. Toggle the catalyst on the energy profile to see why.',
        tasks: [
          {
            t: 'Toggle "Add Catalyst (MnO₂)" ON to watch the activation energy hump drop.',
            ok: (s) => s.catalyst === true,
            say: 'A lower activation barrier means far more colliding molecules have E ≥ Eₐ!',
          },
          {
            t: 'Set Uncat. Eₐ to 120 kJ with Catalyst ON to see Eₐ drop to 85 kJ while ΔH° stays fixed.',
            ok: (s) => s.catalyst === true && s.Ea === 120,
            say: 'Reverse Eₐ = Eₐ(fwd) − ΔH°. Both forward and reverse barriers drop by the exact same 35 kJ!',
          },
        ],
        found: 'Rate increases with Temperature (faster particles + more with E ≥ Eₐ), Concentration/Pressure, Surface area (powdered CaCO₃ > marble lumps), Catalyst (MnO₂ lowers Eₐ), and UV Light in photochemical reactions (e.g. chlorination of methane CH₄ + Cl₂ and photosynthesis).',
      },
    ],
  },

  'c-equil': {
    1: [
      {
        k: 'explore',
        xp: 'equil',
        cfg: { sys: 'haber', T: 450, P: 200, catalyst: false },
        title: 'Le Chatelier Equilibrium Sandbox (Haber, N₂O₄ & Steam + Iron)',
        intro: 'Push three classic JAMB 2027 reversible reactions with temperature, pressure and catalysts and watch how equilibrium responds.',
        predict: {
          q: 'In the action of steam on red-hot iron, 3Fe(s) + 4H₂O(g) ⇌ Fe₃O₄(s) + 4H₂(g), what happens to the equilibrium position when pressure is doubled?',
          o: [
            'No shift — both sides have 4 moles of gas (Fe and Fe₃O₄ are solids)',
            'Shifts to the right because there are 7 moles on the left and 5 on the right',
            'Shifts to the left',
            'K_c doubles',
          ],
          fb: [
            'Bullseye! Count ONLY gaseous moles: 4H₂O(g) on the left vs 4H₂(g) on the right → Δn(gas) = 0, so pressure has no effect on position!',
            'Classic JAMB trap! Solids (3Fe and Fe₃O₄) have negligible volume compared with gases; never count solid moles for pressure shifts.',
            'Equal gas volumes (4 vs 4) mean neither side relieves pressure.',
            'Pressure NEVER changes K_c—only temperature alters K_c.',
          ],
        },
        tasks: [
          {
            t: 'In Haber Process (N₂ + 3H₂ ⇌ 2NH₃, ΔH = −92 kJ), cool T to 250 °C and raise P to 300 atm for maximum NH₃ yield.',
            ok: (s) => s.sys === 'haber' && s.T <= 250 && s.P >= 280,
            say: 'Over 80% NH₃ yield! In industry 450 °C + Fe catalyst is used as a compromise so the rate isn’t too slow.',
          },
          {
            t: 'Switch to "N₂O₄ / NO₂ Brown Gas" (ΔH = +57 kJ) and heat to 550 °C to turn the vessel dark brown.',
            ok: (s) => s.sys === 'no2' && s.T >= 550,
            say: 'Heating an endothermic forward reaction shifts RIGHT, producing dark reddish-brown NO₂ and increasing K_c!',
          },
          {
            t: 'Switch to "Steam on Red-Hot Iron" and change Pressure P to verify the yield % does NOT budge!',
            ok: (s) => s.sys === 'iron' && s.P !== 100,
            say: '4 gas volumes ⇌ 4 gas volumes: pressure has zero effect on the equilibrium position!',
          },
        ],
        found: 'Le Chatelier: raising T favours the ENDOTHERMIC direction (and changes K_c); raising P favours the side with FEWER gas moles; a catalyst changes neither position nor K_c.',
      },
    ],
  },

  'c-air': {
    1: [
      {
        k: 'teach',
        title: 'Town Water Supply Treatment & Hygroscopic / Deliquescent / Efflorescent Salts',
        body: [
          ['p', 'JAMB tests the exact sequence of steps used to purify raw river water for <b>town water supply</b>:'],
          ['ol', [
            '<b>Aeration:</b> spraying water into air removes volatile smelly gases (H₂S) and oxidises dissolved Fe²⁺ to insoluble Fe(OH)₃.',
            '<b>Coagulation (Flocculation):</b> adding <b>potash alum</b> (KAl(SO₄)₂·12H₂O) or sodium aluminate clumps tiny suspended clay colloids into heavy flocs.',
            '<b>Sedimentation:</b> flocs settle to the bottom of large settling tanks.',
            '<b>Sand Filtration:</b> passing water through slow sand/gravel beds removes remaining fine suspended solids.',
            '<b>Disinfection (Chlorination):</b> adding controlled <b>chlorine</b> (Cl₂ or NaClO) kills typhoid/cholera bacteria. <b>Slaked lime, Ca(OH)₂</b> is also added to adjust pH so pipes do not corrode, plus trace fluoride (F⁻) to prevent tooth decay.',
          ]],
          ['wn', 'Chlorination kills germs—it does NOT soften hard water! Alum coagulates suspended clay—it does NOT kill bacteria!'],
        ],
      },
    ],
  },

  'c-nsc': {
    2: [
      {
        k: 'teach',
        title: 'Coal Types, Destructive Distillation & Coke Gasification (Unit 14e)',
        body: [
          ['p', 'As buried plant matter matures under heat and pressure (coalification), carbon content rises in the order: <b>Peat (~60% C) → Lignite (brown coal, ~70%) → Bituminous coal (household/coking coal, ~85%) → Anthracite (~92–95% C, hardest & cleanest burning)</b>.'],
          [
            'tb',
            ['Process (Heating in ABSENCE of Air)', 'Products Obtained & Key Uses'],
            [
              ['Destructive distillation of Coal', '1. <b>Coke</b> (solid carbon → iron extraction & water/producer gas)<br>2. <b>Coal tar</b> (thick liquid → benzene, phenol, naphthalene, dyes, drugs, road surfacing)<br>3. <b>Ammoniacal liquor</b> (aqueous NH₃ → (NH₄)₂SO₄ fertilizer)<br>4. <b>Coal gas</b> (H₂, CH₄, CO → industrial gaseous fuel)'],
              ['Destructive distillation of Wood', '1. <b>Wood charcoal</b> (adsorbent & fuel)<br>2. <b>Pyroligneous acid</b> (aqueous fraction containing ethanoic acid, methanol & propanone)<br>3. <b>Wood tar</b> & 4. <b>Wood gas</b>'],
            ],
          ],
          ['h', 'Gasification of Red-Hot Coke: Producer Gas vs Water (Synthesis) Gas'],
          ['li', [
            '<b>Producer gas (CO + N₂):</b> pass <b>air</b> over red-hot coke: 2C + O₂ + 4N₂ → 2CO + 4N₂ (exothermic; lower calorific value because ~67% N₂ is non-combustible).',
            '<b>Water gas / Synthesis gas (CO + H₂):</b> pass <b>steam</b> over white-hot coke (~1000 °C): C(s) + H₂O(g) → CO(g) + H₂(g) (endothermic; higher calorific value because BOTH CO and H₂ burn! Used to manufacture H₂ and methanol).',
          ]],
        ],
      },
    ],
  },

  'c-metal': {
    1: [
      {
        k: 'teach',
        title: 'Solvay Process, Tin Extraction, Transition Series & Complete JAMB 2027 Alloys',
        body: [
          ['li', [
            '<b>Solvay Process (Na₂CO₃ & NaHCO₃):</b> Ammoniated brine absorbs CO₂ (from heating CaCO₃): NaCl + NH₃ + CO₂ + H₂O → <b>NaHCO₃(s)↓</b> + NH₄Cl(aq). NaHCO₃ precipitates because it is sparingly soluble in cold solution, then is heated: 2NaHCO₃ → Na₂CO₃ + H₂O + CO₂. Ammonia is recovered by heating NH₄Cl with slaked lime Ca(OH)₂ (making Solvay economical!).',
            '<b>Tin (Sn):</b> Extracted from <b>cassiterite (tinstone, SnO₂</b>—mined in Jos, Nigeria) by roasting to remove S/As impurities and reducing SnO₂ with coke (carbon) in a reverberatory furnace: SnO₂ + 2C → Sn + 2CO. Used for tin-plating food cans (non-toxic, resists weak food acids) and soft solder.',
            '<b>First Transition Series (Sc to Zn):</b> Incomplete 3d orbitals give (i) variable oxidation states, (ii) coloured hydrated/complex ions, (iii) complex ion formation, (iv) catalytic activity (Fe in Haber, V₂O₅ in Contact, Ni in hydrogenation), and (v) paramagnetism. (Note: Zn²⁺ and Sc³⁺ are colourless because 3d¹⁰ is full and 3d⁰ is empty!)',
          ]],
          [
            'tb',
            ['Alloy (JAMB 2027 List)', 'Constituents', 'Principal Use'],
            [
              ['Steel', 'Fe + C (0.1–1.5%)', 'Bridges, car bodies, machinery, rails'],
              ['Stainless steel', 'Fe + Cr + Ni (+ trace C)', 'Cutlery, surgical instruments, chemical vats (resists rust)'],
              ['Brass', 'Cu + Zn', 'Screws, musical instruments, taps, cartridge casings'],
              ['Bronze', 'Cu + Sn (tin)', 'Medals, statues, coins, ship propellers, machine bearings'],
              ['Duralumin', 'Al + Cu + Mg + Mn', 'Aircraft bodies & frames (very light yet strong)'],
              ['Soft solder', 'Pb + Sn', 'Joining electrical wires and sheet metal (low melting point)'],
              ['Type-metal', 'Pb + Sb (antimony) + Sn', 'Printing type (expands slightly on solidifying for sharp letters)'],
              ['Permalloy', 'Fe + Ni (~78% Ni)', 'Transformer cores & electromagnets (high magnetic permeability)'],
              ['Alnico', 'Fe + Al + Ni + Co', 'Powerful permanent magnets in loudspeakers & motors'],
            ],
          ],
        ],
      },
    ],
  },

  'c-hydro': {
    1: [
      {
        k: 'teach',
        title: 'Geometric Isomerism, Alkynes (CaC₂) & Aromatic Benzene (Unit 16a–b)',
        body: [
          ['li', [
            '<b>Structural vs Geometric (cis/trans) Isomerism:</b> Alkanes show only structural isomerism (starting at butane C₄H₁₀: n-butane and 2-methylpropane; pentane C₅H₁₂ has 3 isomers: pentane, 2-methylbutane, 2,2-dimethylpropane). Alkenes such as <b>but-2-ene</b> also show <b>geometric (cis–trans) isomerism</b> because the C=C double bond cannot rotate freely.',
            '<b>Laboratory Prep of Ethyne (C₂H₂):</b> Cold water dropped onto <b>calcium dicarbide (CaC₂)</b>: CaC₂(s) + 2H₂O(l) → Ca(OH)₂(aq) + C₂H₂(g). Passed through acidified CuSO₄ to remove PH₃/H₂S impurities.',
            '<b>Confirmatory Test for Terminal Alkynes (–C≡CH):</b> Ethyne and propyne have an acidic ≡C–H proton and form a <b>white/pale-yellow precipitate with ammoniacal AgNO₃</b> (silver dicarbide) or a <b>reddish-brown precipitate with ammoniacal copper(I) chloride (CuCl)</b>. Non-terminal alkynes (but-2-yne) and alkenes (ethene) give NO precipitate!',
            '<b>Benzene (C₆H₆):</b> Planar hexagonal ring with 6 delocalised π-electrons (resonance hybrid). Although unsaturated in formula, benzene resists bromine-water decolourisation and prefers <b>electrophilic substitution</b> (nitration, halogenation with FeBr₃) to preserve its stable aromatic ring, undergoing addition (e.g. + 3H₂ → cyclohexane over Ni, or + 3Cl₂ in UV → benzene hexachloride) only under vigorous conditions.',
          ]],
        ],
      },
    ],
  },

  'c-func': {
    0: [
      {
        k: 'teach',
        title: '1°, 2°, 3° Alkanols (Lucas Test), Alkanals vs Alkanones & Amines (Unit 16c–g)',
        body: [
          [
            'tb',
            ['Class of Alkanol', 'Structure & Example', 'Acidified K₂Cr₂O₇ / KMnO₄ Oxidation', 'Lucas Test (Anhydrous ZnCl₂ + conc. HCl)'],
            [
              ['Primary (1°)', 'R–CH₂OH (ethanol, propan-1-ol)', 'Oxidised first to Alkanal (aldehyde), then to Alkanoic acid', 'No cloudiness at room temp (reacts only on heating)'],
              ['Secondary (2°)', 'R₂CHOH (propan-2-ol)', 'Oxidised to Alkanone (ketone) ONLY', 'Cloudiness / oily layer appears in 5–10 minutes'],
              ['Tertiary (3°)', 'R₃COH (2-methylpropan-2-ol)', 'Resists oxidation (no H on C–OH carbon)', 'Immediate cloudiness / two layers at room temperature!'],
            ],
          ],
          ['li', [
            '<b>Polyhydric alkanol:</b> <b>Propane-1,2,3-triol (glycerol)</b> has three –OH groups; obtained as a valuable by-product of soap making (saponification) and used in cosmetics and nitroglycerine.',
            '<b>Alkanals (R–CHO) vs Alkanones (R–CO–R′):</b> Alkanals are reducing agents—they give a <b>brick-red Cu₂O precipitate with Fehling’s solution</b> and a <b>silver mirror with Tollens’ reagent ([Ag(NH₃)₂]⁺)</b>. Alkanones give a negative test with both!',
            '<b>Special Alkanoic Acids:</b> <b>Ethanedioic (oxalic) acid</b>, (COOH)₂, is a dicarboxylic acid; <b>benzenecarboxylic (benzoic) acid</b>, C₆H₅COOH, is an aromatic acid whose sodium salt preserves foods.',
            '<b>Amines (Alkanamines):</b> Organic derivatives of NH₃ classified by how many alkyl groups replace H on nitrogen: <b>1° (R–NH₂</b>, ethylamine), <b>2° (R₂NH</b>, diethylamine) and <b>3° (R₃N</b>, triethylamine). They are weak organic bases that turn moist red litmus blue and react with acids to form alkylammonium salts.',
          ]],
        ],
      },
    ],
  },

  'c-poly': {
    2: [
      {
        k: 'teach',
        title: 'Margarine, Vulcanization, Carbohydrates & Protein Tests (Unit 16f, h–j)',
        body: [
          ['li', [
            '<b>Margarine:</b> Liquid vegetable oils (unsaturated glycerides with C=C bonds) are hardened by <b>catalytic hydrogenation with H₂ gas over finely divided Nickel at ~180 °C</b>, then churned with skimmed milk and vitamins.',
            '<b>Soaps vs Soapless Detergents:</b> Soaps (RCOO⁻Na⁺) are biodegradable, but form insoluble <b>scum</b> with Ca²⁺/Mg²⁺ in hard water. Soapless detergents (alkylbenzenesulphonates, R–C₆H₄–SO₃⁻Na⁺) have soluble Ca²⁺/Mg²⁺ salts so they lather freely in hard water, though branched-chain detergents can be non-biodegradable.',
            '<b>Vulcanization of Rubber:</b> Natural rubber is poly(2-methylbuta-1,3-diene) (<i>cis</i>-polyisoprene)—soft, sticky when hot, brittle when cold. Heating with <b>sulphur</b> forms <b>disulphide cross-links</b> between chains (vulcanization), making car tyres tough, elastic and heat-resistant.',
          ]],
          ['h', 'Carbohydrates & Protein Confirmatory Tests'],
          [
            'tb',
            ['Biomolecule / Test', 'Reagent & Condition', 'Positive Observation & Meaning'],
            [
              ['Reducing sugars (glucose, fructose, maltose)', 'Warm with Fehling’s or Benedict’s solution', 'Brick-red precipitate of copper(I) oxide (Cu₂O). (Sucrose is non-reducing until hydrolysed with dilute HCl!)'],
              ['Starch (from cassava/yam)', 'Add a drop of iodine solution (I₂/KI)', 'Blue-black colouration (disappears on heating, returns on cooling)'],
              ['Dehydration of carbohydrates', 'Add concentrated H₂SO₄ to sugar/cellulose', 'Chars to a black porous mass of carbon: C₁₂H₂₂O₁₁ → 12C + 11H₂O'],
              ['Biuret test (Proteins)', 'NaOH(aq) + a few drops of dilute CuSO₄(aq)', 'Violet / purple colour (detects peptide –CO–NH– linkages)'],
              ['Millon’s test (Proteins)', 'Warm with Millon’s reagent', 'White precipitate turning brick-red on heating (phenolic tyrosine residue)'],
              ['Xanthoproteic test (Proteins)', 'Concentrated HNO₃, then excess NH₃(aq)', 'Yellow colour turning deep orange with alkali (aromatic rings in protein)'],
              ['Ninhydrin test (Proteins / Amino acids)', 'Warm with ninhydrin solution', 'Deep blue / purple colour (detects α-amino acids from protein hydrolysis)'],
            ],
          ],
        ],
      },
    ],
  },
};

/* ──────────────────────────────────────────────────────────────────────────
   TARGETED 2027 SYLLABUS EXAM QUESTIONS APPENDED TO EXISTING TOPICS
   ────────────────────────────────────────────────────────────────────────── */
export const CHEM_2027_EXTRA_QS: Record<string, Omit<Question, 'id' | 't'>[]> = {
  'c-mole': [
    {
      l: 3,
      q: 'Carbon combines with hydrogen to form CH₄ and with oxygen to form CO₂, while hydrogen and oxygen combine to form H₂O in a related mass ratio. Which law does this illustrate?',
      o: ['Law of reciprocal proportions', 'Law of multiple proportions', 'Law of definite proportions', 'Avogadro’s law'],
      a: 0,
      e: 'Three elements (C, H, O) combining in pairs in simple related mass ratios illustrates the law of reciprocal proportions.',
      w: ['', 'Multiple proportions involves only TWO elements forming two or more compounds.', 'Definite proportions deals with pure samples of a single compound.', 'Avogadro’s law compares gas volumes and molecule counts.'],
    },
  ],
  'c-kin': [
    {
      l: 2,
      q: 'If the vapour density of a gas X is 22, what is its relative molecular mass?',
      o: ['44', '11', '22', '88'],
      a: 0,
      e: 'Relative molecular mass Mᵣ = 2 × Vapour Density = 2 × 22 = 44 (e.g. CO₂ or C₃H₈).',
      w: ['', 'You halved instead of doubling. Mᵣ = 2 × VD.', 'Mᵣ equals 2 × VD, not VD.', 'You multiplied by 4 instead of 2.'],
    },
    {
      l: 3,
      q: 'Real gases deviate most strongly from ideal gas behaviour under conditions of',
      o: ['high pressure and low temperature', 'low pressure and high temperature', 'high temperature and constant volume', 'low density and high kinetic energy'],
      a: 0,
      e: 'At high pressure and low temperature molecules are close together and moving slowly, so intermolecular attractions and finite molecular volume cannot be ignored.',
      w: ['', 'Low pressure and high temperature make real gases behave MOST like an ideal gas.', 'High temperature favours ideal behaviour.', 'Low density means molecules are far apart (ideal behaviour).'],
    },
    {
      l: 3,
      q: 'Oxygen gas is collected over water at 27 °C and a total pressure of 755 mmHg. If the saturated vapour pressure of water at 27 °C is 27 mmHg, what is the pressure of dry oxygen?',
      o: ['728 mmHg', '782 mmHg', '755 mmHg', '27.9 mmHg'],
      a: 0,
      e: 'By Dalton’s law of partial pressures, P(dry O₂) = P(total) − P(water vapour) = 755 − 27 = 728 mmHg.',
      w: ['', 'Subtract the saturated vapour pressure of water; do not add it.', 'Wet gas includes 27 mmHg of water vapour.', 'You divided instead of subtracting.'],
    },
  ],
  'c-atom': [
    {
      l: 2,
      q: 'Which scientist used the oil-drop experiment to determine the magnitude of the electric charge on an electron?',
      o: ['R.A. Millikan', 'J.J. Thomson', 'Ernest Rutherford', 'Henry Moseley'],
      a: 0,
      e: 'Millikan’s oil-drop experiment measured the charge on the electron (1.6 × 10⁻¹⁹ C). Thomson measured e/m; Rutherford discovered the nucleus; Moseley established atomic number via X-rays.',
      w: ['', 'J.J. Thomson discovered the electron and measured its charge-to-mass ratio (e/m), not charge alone.', 'Rutherford performed the gold-foil α-scattering experiment.', 'Moseley used X-ray spectra to determine atomic numbers.'],
    },
    {
      l: 3,
      q: 'What are the shapes of the s and p atomic orbitals respectively?',
      o: ['Spherical and dumbbell-shaped', 'Dumbbell-shaped and spherical', 'Tetrahedral and linear', 'Circular and square planar'],
      a: 0,
      e: 'An s orbital is spherically symmetrical around the nucleus, whereas each p orbital (pₓ, pᵧ, p₂) has two lobes (dumbbell shape).',
      w: ['', 'That is the wrong way round: s is spherical, p is dumbbell-shaped.', 'Tetrahedral and linear describe molecular geometries, not s and p orbitals.', 'Orbitals are 3D probability clouds, not flat circles or squares.'],
    },
    {
      l: 3,
      q: 'Which quantum number specifies the spatial orientation of an orbital in a magnetic field?',
      o: ['Magnetic quantum number (m)', 'Principal quantum number (n)', 'Subsidiary/azimuthal quantum number (l)', 'Spin quantum number (s)'],
      a: 0,
      e: 'Principal (n) gives shell size/energy; subsidiary (l) gives orbital shape; magnetic (m) gives spatial orientation (e.g. pₓ, pᵧ, p₂); spin (s) gives spin direction.',
      w: ['', 'n gives the main energy level/shell.', 'l gives the subshell shape (s, p, d, f).', 'Spin (+½ or −½) gives the electron’s intrinsic spin direction.'],
    },
  ],
  'c-bond': [
    {
      l: 3,
      q: 'Which types of chemical bonding are present in the tetraamminecopper(II) complex ion, [Cu(NH₃)₄]²⁺?',
      o: ['Covalent and coordinate (dative) bonds', 'Electrovalent bonds only', 'Metallic and van der Waals bonds', 'Hydrogen bonds only'],
      a: 0,
      e: 'Each NH₃ has polar covalent N–H bonds, and each nitrogen donates its lone pair to Cu²⁺ via a coordinate (dative) covalent bond.',
      w: ['', 'Within the [Cu(NH₃)₄]²⁺ ion itself, bonds are covalent (N–H) and coordinate (H₃N→Cu²⁺).', 'Metallic bonding occurs in solid metals.', 'Hydrogen bonding is an intermolecular attraction, not the ligand-to-metal bond.'],
    },
    {
      l: 2,
      q: 'What are the shapes of CO₂, H₂O, NH₃ and CH₄ molecules respectively?',
      o: ['Linear, bent (non-linear), trigonal pyramidal and tetrahedral', 'Bent, linear, tetrahedral and pyramidal', 'Linear, linear, planar and tetrahedral', 'Tetrahedral, bent, linear and pyramidal'],
      a: 0,
      e: 'CO₂ = linear (180°), H₂O = bent/V-shaped (104.5°), NH₃ = trigonal pyramidal (107°), CH₄ = tetrahedral (109.5°).',
      w: ['', 'CO₂ has no lone pairs on C so it is linear; H₂O has 2 lone pairs on O so it is bent.', 'H₂O is bent (not linear) and NH₃ is pyramidal (1 lone pair on N).', 'CO₂ has only 3 atoms and is linear.'],
    },
  ],
  'c-sol': [
    {
      l: 2,
      q: 'According to the JAMB Chemistry syllabus, Harmattan haze and milk are classified respectively as a',
      o: ['suspension and a colloid', 'colloid and a true solution', 'true solution and a suspension', 'colloid and a suspension'],
      a: 0,
      e: 'Harmattan haze (fine dust suspended in air that settles) and water paints are suspensions; milk, fog, blood, aerosol spray and emulsion paints are colloids.',
      w: ['', 'Harmattan haze settles out so it is a suspension; milk is an emulsion colloid, not a true solution.', 'Neither Harmattan haze nor milk is a true solution.', 'Reversed: Harmattan haze = suspension, milk = colloid.'],
    },
    {
      l: 2,
      q: 'Which solvent is most suitable for removing an oil-paint stain from clothing or cleaning a used paint brush?',
      o: ['Turpentine', 'Distilled water', 'Aqueous sodium chloride', 'Limewater'],
      a: 0,
      e: 'Turpentine is a non-polar organic solvent that dissolves dried/wet oil paint resins ("like dissolves like").',
      w: ['', 'Water is polar and immiscible with oil-based paint.', 'Brine is even more polar than pure water.', 'Limewater is aqueous Ca(OH)₂ used to test for CO₂.'],
    },
  ],
  'c-acid': [
    {
      l: 3,
      q: 'An aqueous solution of ammonium chloride (NH₄Cl) turns blue litmus paper red because',
      o: ['it undergoes hydrolysis, being a salt of a strong acid (HCl) and a weak base (NH₃)', 'NH₄Cl is a double salt', 'NH₄Cl is a strong base', 'Cl⁻ ions donate protons to water'],
      a: 0,
      e: 'NH₄⁺ + H₂O ⇌ NH₃ + H₃O⁺. Salts of a strong acid + weak base (NH₄Cl, AlCl₃, FeCl₃) hydrolyse to give acidic solutions.',
      w: ['', 'NH₄Cl is a normal salt, not a double salt like alum.', 'NH₄Cl is a salt whose solution is slightly acidic.', 'Cl⁻ is the conjugate of strong HCl and does not hydrolyse.'],
    },
    {
      l: 3,
      q: 'Which aqueous salt solution has a pH greater than 7?',
      o: ['CH₃COONa (sodium ethanoate)', 'NH₄Cl (ammonium chloride)', 'AlCl₃ (aluminium chloride)', 'NaCl (sodium chloride)'],
      a: 0,
      e: 'CH₃COONa (and Na₂CO₃) is formed from a weak acid and a strong base (NaOH), so hydrolysis yields OH⁻ ions (pH > 7).',
      w: ['', 'NH₄Cl gives an acidic solution (pH < 7).', 'AlCl₃ hydrolyses strongly to give an acidic solution (pH < 7).', 'NaCl comes from strong acid + strong base and is neutral (pH = 7).'],
    },
    {
      l: 2,
      q: 'What is the pOH of a 0.001 mol dm⁻³ solution of HCl at 25 °C?',
      o: ['11', '3', '7', '14'],
      a: 0,
      e: '[H⁺] = 10⁻³ mol dm⁻³, so pH = 3. Since pH + pOH = 14, pOH = 14 − 3 = 11.',
      w: ['', '3 is the pH, not the pOH! Remember pH + pOH = 14.', '7 is for neutral pure water.', 'pOH = 14 would correspond to 1 M HCl (pH = 0).'],
    },
  ],
  'c-vol': [
    {
      l: 3,
      q: 'Which indicator is most suitable for titrating ethanoic acid (CH₃COOH) against sodium hydroxide (NaOH)?',
      o: ['Phenolphthalein', 'Methyl orange', 'Litmus paper', 'Starch solution'],
      a: 0,
      e: 'Weak acid vs strong base has its equivalence point in the alkaline region (pH 8–10), matching phenolphthalein’s range (8.3–10.0).',
      w: ['', 'Methyl orange changes at pH 3.2–4.4, well before equivalence in a weak-acid titration.', 'Litmus has too broad a range for sharp volumetric end-points.', 'Starch is an indicator for iodine redox titrations, not acid–base.'],
    },
  ],
  'c-elec': [
    {
      l: 3,
      q: 'Given E°(Zn²⁺/Zn) = −0.76 V and E°(Cu²⁺/Cu) = +0.34 V, what is the standard e.m.f. (E°cell) of the electrochemical cell Zn(s) | Zn²⁺(aq) || Cu²⁺(aq) | Cu(s)?',
      o: ['+1.10 V', '−1.10 V', '+0.42 V', '−0.42 V'],
      a: 0,
      e: 'E°cell = E°(cathode, Cu) − E°(anode, Zn) = +0.34 − (−0.76) = +1.10 V.',
      w: ['', 'A spontaneous galvanic cell has a positive e.m.f. (+1.10 V).', 'Subtract (−0.76) from +0.34: +0.34 − (−0.76) = +1.10 V, do not add −0.76.', 'Check signs: E°cathode − E°anode = +1.10 V.'],
    },
    {
      l: 2,
      q: 'Galvanized iron does not rust easily even when its zinc coating is scratched because',
      o: ['zinc is higher than iron in the electrochemical series and corrodes sacrificially', 'zinc is less reactive than iron', 'iron forms an alloy with oxygen', 'zinc is a non-electrolyte'],
      a: 0,
      e: 'Zinc is more electropositive than iron, so Zn acts as the sacrificial anode and donates electrons to keep Fe cathodic.',
      w: ['', 'Zinc is MORE reactive than iron (tin is less reactive).', 'Rust is hydrated iron(III) oxide, not a protective alloy.', 'Metals conduct via delocalised electrons; sacrificial protection is electrochemical.'],
    },
  ],
  'c-energy': [
    {
      l: 3,
      q: 'For a chemical reaction at 300 K, ΔH° = −45 kJ mol⁻¹ and ΔS° = −100 J mol⁻¹ K⁻¹. What is ΔG° and is the reaction spontaneous?',
      o: ['−15 kJ mol⁻¹; spontaneous', '−75 kJ mol⁻¹; spontaneous', '+29 955 kJ mol⁻¹; non-spontaneous', '+15 kJ mol⁻¹; non-spontaneous'],
      a: 0,
      e: 'Convert ΔS° to kJ first: −100 J K⁻¹ = −0.10 kJ K⁻¹. ΔG° = ΔH° − TΔS° = −45 − 300(−0.10) = −45 + 30 = −15 kJ mol⁻¹ (< 0, spontaneous).',
      w: ['', 'Watch the double negative: −TΔS° = −300(−0.10) = +30, so −45 + 30 = −15 kJ mol⁻¹.', 'You forgot to divide ΔS° in J by 1000 to match ΔH° in kJ!', 'Check signs: ΔG° is −15 kJ mol⁻¹, which is negative (spontaneous).'],
    },
  ],
  'c-rate': [
    {
      l: 2,
      q: 'The substitution reaction between methane (CH₄) and chlorine (Cl₂) does not occur in the dark at room temperature because it is a',
      o: ['photochemical reaction requiring ultraviolet light to split Cl₂ into radicals', 'nuclear fusion reaction', 'neutralisation reaction', 'reversible reaction with zero activation energy'],
      a: 0,
      e: 'Halogenation of alkanes is a photochemical free-radical chain reaction initiated by UV sunlight (Cl₂ → 2Cl•).',
      w: ['', 'It is an ordinary organic covalent reaction, not nuclear.', 'Neither CH₄ nor Cl₂ is an acid–alkali pair.', 'It has a high activation barrier unless UV light cleaves Cl–Cl.'],
    },
  ],
  'c-equil': [
    {
      l: 3,
      q: 'In the reversible reaction 3Fe(s) + 4H₂O(g) ⇌ Fe₃O₄(s) + 4H₂(g), increasing the total pressure at constant temperature will',
      o: ['have no effect on the equilibrium position', 'shift equilibrium to the right', 'shift equilibrium to the left', 'increase the equilibrium constant Kc'],
      a: 0,
      e: 'Only gaseous moles count for pressure shifts: 4 moles of H₂O(g) on the left equal 4 moles of H₂(g) on the right.',
      w: ['', 'Do not count solid Fe or Fe₃O₄—gaseous moles are 4 on both sides.', 'Gaseous moles are equal (4 vs 4).', 'Only temperature alters Kc.'],
    },
  ],
  'c-air': [
    {
      l: 2,
      q: 'During the treatment of raw river water for town supply, potash alum is added to',
      o: ['coagulate fine suspended clay particles so they settle', 'kill pathogenic bacteria', 'remove permanent hardness', 'prevent tooth decay'],
      a: 0,
      e: 'Al³⁺ ions from alum neutralise charges on colloidal clay particles (coagulation/flocculation). Chlorine kills bacteria; Na₂CO₃ removes hardness; fluoride prevents tooth decay.',
      w: ['', 'Chlorination kills bacteria, not alum.', 'Alum actually adds SO₄²⁻ ions; washing soda (Na₂CO₃) softens hard water.', 'Fluoridation prevents tooth decay.'],
    },
  ],
  'c-nsc': [
    {
      l: 2,
      q: 'Why does water gas (CO + H₂) have a higher calorific value as an industrial fuel than producer gas (CO + N₂)?',
      o: ['Both components of water gas (CO and H₂) are combustible, whereas N₂ in producer gas does not burn', 'Nitrogen burns more slowly than hydrogen', 'Producer gas contains carbon(IV) oxide only', 'Water gas is a solid fuel'],
      a: 0,
      e: 'In water gas both CO and H₂ burn exothermically; producer gas is ~67% inert non-combustible N₂.',
      w: ['', 'N₂ is non-combustible under fuel-burning conditions.', 'Producer gas contains CO (~30%) + N₂ (~67%).', 'Both are gaseous fuels made from red-hot coke.'],
    },
    {
      l: 2,
      q: 'Which of the following is NOT a direct product of the destructive distillation of coal?',
      o: ['Bitumen', 'Coke', 'Coal tar', 'Ammoniacal liquor'],
      a: 0,
      e: 'Destructive distillation of coal yields coke, coal tar, ammoniacal liquor and coal gas. Bitumen is the residue from fractional distillation of crude petroleum!',
      w: ['', 'Coke is the solid carbon residue from coal.', 'Coal tar is the liquid organic condensate from coal.', 'Ammoniacal liquor is the aqueous NH₃ condensate from coal.'],
    },
  ],
  'c-metal': [
    {
      l: 2,
      q: 'The chief ore from which tin (Sn) is extracted by carbon reduction is',
      o: ['cassiterite (SnO₂)', 'bauxite (Al₂O₃·2H₂O)', 'haematite (Fe₂O₃)', 'galena (PbS)'],
      a: 0,
      e: 'Cassiterite (tinstone, SnO₂), abundant on the Jos Plateau, is reduced with coke to metallic tin.',
      w: ['', 'Bauxite is the chief ore of aluminium.', 'Haematite is the chief ore of iron.', 'Galena is the chief ore of lead.'],
    },
    {
      l: 3,
      q: 'Which alloy is used to construct aircraft bodies because it is light yet strong, and what are its main constituents?',
      o: ['Duralumin — Al, Cu, Mg and Mn', 'Bronze — Cu and Sn', 'Soft solder — Pb and Sn', 'Type-metal — Pb, Sb and Sn'],
      a: 0,
      e: 'Duralumin (~95% Al with Cu, Mg and Mn) combines low density with high tensile strength for aircraft.',
      w: ['', 'Bronze is dense and used for statues, medals and bearings.', 'Soft solder has a low melting point for electrical joints.', 'Type-metal is dense and used for printing type.'],
    },
    {
      l: 3,
      q: 'What is the IUPAC name of the complex ion [Fe(CN)₆]⁴⁻?',
      o: ['Hexacyanoferrate(II) ion', 'Hexacyanoferrate(III) ion', 'Tetraammineiron(II) ion', 'Iron(IV) hexacyanide'],
      a: 0,
      e: 'Let Fe = x: x + 6(−1) = −4 → x = +2. Six CN⁻ ligands on anionic iron at +2 = hexacyanoferrate(II) ion.',
      w: ['', 'Hexacyanoferrate(III) is [Fe(CN)₆]³⁻ (where x − 6 = −3 → +3).', 'The ligand here is cyano (CN⁻), not ammine (NH₃).', 'Oxidation state of Fe is +2, not +4.'],
    },
  ],
  'c-hydro': [
    {
      l: 3,
      q: 'Which reagent distinguishes ethyne (a terminal alkyne) from ethene?',
      o: ['Ammoniacal silver trioxonitrate(V) solution', 'Bromine water', 'Acidified KMnO₄ solution', 'Limewater'],
      a: 0,
      e: 'Both ethene and ethyne decolourise bromine water and acidified KMnO₄, ONLY terminal alkynes (–C≡CH) give a white/pale-yellow precipitate with ammoniacal AgNO₃ (or red-brown with ammoniacal CuCl).',
      w: ['', 'Both alkenes and alkynes are unsaturated and decolourise bromine water!', 'Both decolourise purple acidified KMnO₄.', 'Limewater tests for CO₂.'],
    },
  ],
  'c-func': [
    {
      l: 3,
      q: 'When treated at room temperature with Lucas reagent (anhydrous ZnCl₂ in concentrated HCl), which alkanol gives an immediate cloudy two-layer separation?',
      o: ['2-methylpropan-2-ol (a tertiary alkanol)', 'Ethanol (a primary alkanol)', 'Propan-1-ol (a primary alkanol)', 'Methanol'],
      a: 0,
      e: 'Lucas test distinguishes 1°, 2° and 3° alkanols: 3° reacts immediately, 2° in 5–10 min, and 1° shows no cloudiness at room temperature.',
      w: ['', 'Ethanol is a 1° alkanol and does not cloud at room temperature.', 'Propan-1-ol is also 1°.', 'Methanol gives no cloudiness at room temperature.'],
    },
    {
      l: 2,
      q: 'Propanal (an alkanal) can be distinguished from propanone (an alkanone) because propanal',
      o: ['gives a brick-red precipitate on warming with Fehling’s solution (or silver mirror with Tollens’ reagent)', 'turns blue litmus red', 'is a hydrocarbon', 'does not contain a carbonyl group'],
      a: 0,
      e: 'Alkanals are easily oxidised to alkanoic acids so they reduce Fehling’s (Cu²⁺ → Cu₂O brick-red) and Tollens’ ([Ag(NH₃)₂]⁺ → Ag mirror); alkanones do not.',
      w: ['', 'Neither alkanals nor alkanones are acids.', 'Both contain oxygen (CₙH₂ₙO).', 'Both contain the C=O carbonyl group.'],
    },
  ],
  'c-poly': [
    {
      l: 2,
      q: 'Addition of dilute NaOH(aq) followed by a few drops of CuSO₄(aq) to egg albumen produces a violet colouration. This test is the',
      o: ['Biuret test for proteins', 'Fehling’s test for reducing sugars', 'Iodine test for starch', 'Lucas test for alkanols'],
      a: 0,
      e: 'NaOH(aq) + trace CuSO₄(aq) giving violet/purple is the Biuret test for peptide bonds in proteins.',
      w: ['', 'Fehling’s uses alkaline Cu²⁺ tartrate + heat to give a brick-red Cu₂O precipitate with reducing sugars.', 'Iodine gives blue-black with starch.', 'Lucas uses ZnCl₂/conc. HCl for alkanols.'],
    },
    {
      l: 2,
      q: 'Vulcanization improves the elasticity and toughness of natural rubber by heating raw rubber with',
      o: ['sulphur to form disulphide cross-links between polymer chains', 'concentrated NaOH to saponify it', 'hydrogen over nickel at 180 °C', 'chlorine in sunlight'],
      a: 0,
      e: 'Sulphur forms covalent –S–S– bridges between polyisoprene chains so tyres do not turn sticky in heat or brittle in cold.',
      w: ['', 'Boiling with NaOH is saponification of fats/oils.', 'H₂ over Ni hardens vegetable oils into margarine.', 'Chlorination in UV is alkane substitution.'],
    },
  ],
};

/* ──────────────────────────────────────────────────────────────────────────
   PARAMETRIC 2027 SYLLABUS CALCULATION GENERATORS (QG)
   ────────────────────────────────────────────────────────────────────────── */
const fmt = (x: number) => String(Number(x.toPrecision(3)));

export const CHEM_2027_EXTRA_QG: Record<string, { l: number; n: number; f: (R: Rng) => any }[]> = {
  'c-kin': [
    {
      l: 2,
      n: 3,
      f: (R) => {
        const [name, vd] = R.pick([
          ['a hydrocarbon gas', 8],
          ['a gaseous alkene', 14],
          ['a gaseous oxide', 22],
          ['an acidic gas', 32],
          ['chlorine gas', 35.5],
          ['ammonia gas', 8.5],
        ] as [string, number][]);
        const mr = vd * 2;
        return {
          q: `The vapour density of ${name} is ${vd}. Calculate its relative molecular mass (M<sub>r</sub>).`,
          o: [`${fmt(mr)}`, `${fmt(vd / 2)}`, `${fmt(vd)}`, `${fmt(vd * 4)}`],
          w: [
            '',
            'You divided by 2. Remember Mᵣ = 2 × Vapour Density.',
            'Vapour density is half of Mᵣ, so double it.',
            'Multiply Vapour Density by 2, not 4.',
          ],
          e: `Relative molecular mass M<sub>r</sub> = 2 × Vapour Density = 2 × ${vd} = ${fmt(mr)}.`,
        };
      },
    },
  ],
  'c-atom': [
    {
      l: 3,
      n: 3,
      f: (R) => {
        const [sym, m1, p1, m2] = R.pick([
          ['Cl', 35, 75, 37],
          ['Cu', 63, 70, 65],
          ['B', 10, 20, 11],
          ['Br', 79, 50, 81],
          ['Li', 6, 10, 7],
        ] as [string, number, number, number][]);
        const p2 = 100 - p1;
        const ar = (m1 * p1 + m2 * p2) / 100;
        const mid = (m1 + m2) / 2;
        const swapped = (m1 * p2 + m2 * p1) / 100;
        if (Math.abs(ar - mid) < 0.05 || Math.abs(ar - swapped) < 0.05) return null;
        return {
          q: `Naturally occurring ${sym} consists of ${p1}% of <sup>${m1}</sup>${sym} and ${p2}% of <sup>${m2}</sup>${sym}. Calculate its relative atomic mass.`,
          o: [ar.toFixed(1), swapped.toFixed(1), mid.toFixed(1), String(m1 + m2)],
          w: [
            '',
            'You swapped the percentage abundances of the two isotopes.',
            'Do not take a simple 50 : 50 average when abundances are unequal.',
            'Divide the weighted sum by 100.',
          ],
          e: `A<sub>r</sub> = (${m1} × ${p1} + ${m2} × ${p2}) ÷ 100 = ${ar.toFixed(1)}.`,
        };
      },
    },
  ],
  'c-acid': [
    {
      l: 3,
      n: 3,
      f: (R) => {
        const exp = R.pick([1, 2, 3, 4]);
        const isAcid = R.pick([true, false]);
        const concStr = `1.0 × 10<sup>−${exp}</sup> mol dm⁻³`;
        const pH = isAcid ? exp : 14 - exp;
        const pOH = 14 - pH;
        const askPh = R.pick([true, false]);
        const species = isAcid ? 'HNO₃' : 'KOH';
        const ans = askPh ? pH : pOH;
        const other = askPh ? pOH : pH;
        if (ans === other) return null;
        return {
          q: `Calculate the <b>${askPh ? 'pH' : 'pOH'}</b> of a ${concStr} aqueous solution of ${species} at 25 °C.`,
          o: [`${ans}`, `${other}`, `${14 + exp}`, `${exp / 2}`],
          w: [
            '',
            `Careful! ${other} is the ${askPh ? 'pOH' : 'pH'}. Remember pH + pOH = 14.`,
            'pH and pOH of dilute solutions lie between 0 and 14; subtract from 14, do not add.',
            `${species} is monobasic/monoacidic, so use −log₁₀(10⁻${exp}) = ${exp}.`,
          ],
          e: `${isAcid ? `[H⁺] = 10<sup>−${exp}</sup> ⇒ pH = ${exp}, pOH = 14 − ${exp} = ${pOH}` : `[OH⁻] = 10<sup>−${exp}</sup> ⇒ pOH = ${exp}, pH = 14 − ${exp} = ${pH}`}. Therefore ${askPh ? 'pH' : 'pOH'} = ${ans}.`,
        };
      },
    },
  ],
  'c-energy': [
    {
      l: 4,
      n: 3,
      f: (R) => {
        const dH = R.pick([-80, -60, -40, 40, 60]);
        const dS = R.pick([-150, -100, 100, 150]); // J mol⁻¹ K⁻¹
        const T = R.pick([300, 400, 500]);
        const tdS = (T * dS) / 1000;
        const dG = dH - tdS;
        const wrongSign = dH + tdS;
        const wrongUnits = dH - T * dS;
        if (dG === wrongSign || dG === dH) return null;
        return {
          q: `Calculate ΔG° at ${T} K for a reaction with ΔH° = ${dH > 0 ? '+' : ''}${dH} kJ mol⁻¹ and ΔS° = ${dS > 0 ? '+' : ''}${dS} J mol⁻¹ K⁻¹.`,
          o: [
            `${dG > 0 ? '+' : ''}${dG} kJ mol⁻¹`,
            `${wrongSign > 0 ? '+' : ''}${wrongSign} kJ mol⁻¹`,
            `${wrongUnits} kJ mol⁻¹`,
            `${dH > 0 ? '+' : ''}${dH} kJ mol⁻¹`,
          ],
          w: [
            '',
            'Watch the minus sign in ΔG° = ΔH° − TΔS°.',
            'Convert ΔS° from J mol⁻¹ K⁻¹ to kJ mol⁻¹ K⁻¹ by dividing by 1000 first!',
            'That is ΔH° alone; subtract TΔS°.',
          ],
          e: `ΔS° = ${dS} ÷ 1000 = ${dS / 1000} kJ mol⁻¹ K⁻¹. ΔG° = ${dH} − (${T} × ${dS / 1000}) = ${dG > 0 ? '+' : ''}${dG} kJ mol⁻¹ (${dG < 0 ? 'spontaneous' : dG === 0 ? 'at equilibrium' : 'non-spontaneous'}).`,
        };
      },
    },
  ],
};
