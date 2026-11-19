import type { LabItem } from '../types';

export const ALAB_CATS: Record<string, string> = {
  soil: 'Soil Physics, Chemistry & Liming Labs',
  crop: 'Seed Viability, Propagation & NPK Agronomy',
  prot: 'Crop Protection, Weeds & Sprayer Calibration',
  livestock: 'Ruminant/Avian Digestion, Candling & Feed Formulation',
  aqua: 'Aquaculture Water Quality & Chain Surveying',
};

export const ALAB_IC: Record<string, string> = {
  'a-soil-sediment': '<rect x="8" y="3" width="8" height="18" rx="1"/><path class="ia" d="M8 9h8M8 13h8M8 17h8"/>',
  'a-soil-porosity': '<path d="M6 4v15a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4"/><path class="ia" d="M6 12h12"/><circle cx="10" cy="16" r="1"/><circle cx="14" cy="17" r="1"/>',
  'a-soil-ph': '<path d="M9 3v14a3 3 0 0 0 6 0V3M7 3h10"/><path class="ia" d="M9.5 12h5"/><circle cx="18" cy="8" r="2"/>',
  'a-seed-viability': '<rect x="4" y="6" width="16" height="12" rx="2"/><path class="ia" d="M8 14c0-3 2-5 4-5s4 2 4 5"/><circle cx="9" cy="14" r="1.2"/><circle cx="15" cy="14" r="1.2"/>',
  'a-budding-graft': '<path d="M12 3v18M9 9h6M12 9l4-4"/><circle class="ia" cx="12" cy="11" r="2"/>',
  'a-npk-yield': '<path d="M5 19h14M7 19v-6M12 19V8M17 19v-9"/><path class="ia" d="M7 13l5-5 5 2"/>',
  'a-sprayer-calib': '<rect x="6" y="6" width="8" height="13" rx="2"/><path class="ia" d="M14 9h4l2 4M18 15l2 3M16 15l1 3"/>',
  'a-pest-disease': '<circle cx="12" cy="13" r="5"/><path class="ia" d="M9 9l-2-2M15 9l2-2M7 13H4M20 13h-3"/>',
  'a-ruminant-tract': '<path d="M5 12c0-4 4-6 8-5 3 .8 6 3 6 6s-3 5-7 5-7-2-7-6z"/><path class="ia" d="M11 8v9M15 9v8"/>',
  'a-egg-candling': '<ellipse cx="12" cy="11" rx="5" ry="6.5"/><path class="ia" d="M9 20h6M12 17.5V20"/><circle class="ia" cx="12" cy="10.5" r="1.8"/>',
  'a-feed-ration': '<rect x="5" y="5" width="14" height="14" rx="1.5"/><path class="ia" d="M5 5l14 14M19 5L5 19"/><circle cx="12" cy="12" r="2.2"/>',
  'a-parasite-id': '<path d="M12 4c4 3 5 8 0 16-5-8-4-13 0-16z"/><circle class="ia" cx="12" cy="9" r="1.5"/>',
  'a-pond-quality': '<path d="M3 9c3-2 6 2 9 0s6-2 9 0v10H3z"/><circle class="ia" cx="12" cy="14" r="2.5"/><path d="M12 5v6.5"/>',
  'a-chain-survey': '<path d="M4 18L20 6"/><path class="ia" d="M9 14.2l2.4 3.2M14 10.5l3 4"/><circle cx="4" cy="18" r="1.6"/><circle cx="20" cy="6" r="1.6"/>',
};

export const AGRIC_LAB_FOR_TOPIC: Record<string, string> = {
  'ag-intro': 'a-seed-viability',
  'ag-land-tenure': 'a-chain-survey',
  'ag-ecology': 'a-soil-porosity',
  'ag-rocks-soil': 'a-soil-sediment',
  'ag-soil-props': 'a-soil-ph',
  'ag-tools-machinery': 'a-sprayer-calib',
  'ag-power-mech': 'a-sprayer-calib',
  'ag-crop-class': 'a-seed-viability',
  'ag-crop-husbandry': 'a-npk-yield',
  'ag-pasture': 'a-npk-yield',
  'ag-nutrients': 'a-soil-ph',
  'ag-fertilizers': 'a-npk-yield',
  'ag-irrigation': 'a-soil-porosity',
  'ag-surveying': 'a-chain-survey',
  'ag-forestry': 'a-budding-graft',
  'ag-pests': 'a-pest-disease',
  'ag-diseases': 'a-pest-disease',
  'ag-weeds': 'a-sprayer-calib',
  'ag-animal-anat': 'a-ruminant-tract',
  'ag-animal-repro': 'a-egg-candling',
  'ag-livestock': 'a-egg-candling',
  'ag-nutrition': 'a-feed-ration',
  'ag-animal-health': 'a-parasite-id',
  'ag-fisheries': 'a-pond-quality',
  'ag-apiculture': 'a-parasite-id',
  'ag-crop-breed': 'a-budding-graft',
  'ag-animal-breed': 'a-egg-candling',
  'ag-econ-accounts': 'a-feed-ration',
  'ag-marketing': 'a-seed-viability',
  'ag-extension': 'a-npk-yield',
};

const CWATER = 'rgba(125,211,252,.34)';
const CSOIL_GRAVEL = '#785A3C';
const CSOIL_SAND = '#D6A86E';
const CSOIL_SILT = '#A37B52';
const CSOIL_CLAY = 'rgba(180,142,104,.62)';
const CHUMUS = '#292524';
const CGREEN = '#34D399';
const CGOLD = '#FBBF24';

export function buildAgricLabs(CLK: any): LabItem[] {
  const K = CLK;

  return [
    /* 1. Soil Mechanical Analysis (Sedimentation Cylinder) */
    {
      id: 'a-soil-sediment',
      subj: 'agric',
      cat: 'soil',
      h: 290,
      name: 'Soil mechanical sedimentation & texture profile',
      blurb: 'Disperse garden loam with Calgon and measure gravel, sand, silt, clay & floating humus',
      tip: 'Adding sodium hexametaphosphate (Calgon) disperses cemented clay-humus crumbs into individual mineral particles so Stokes’ Law sorts them cleanly by diameter.',
      steps: () => [
        { say: 'Place 50 g of air-dried, sieved garden loam into a 250 cm³ graduated measuring cylinder and add 150 cm³ of distilled water plus 5 cm³ of sodium hexametaphosphate (Calgon) dispersing agent.' },
        { say: 'Stopper the cylinder, shake vigorously end-over-end for 3 minutes to break all soil aggregates, then stand upright on a vibration-free bench for 24 hours.' },
        { say: 'Observe Stokes’ Law settling from bottom to top: heavy Gravel (>2 mm) settles immediately, followed by Coarse Sand, Fine Sand, Silt (0.02–0.002 mm), suspended Clay (<0.002 mm), and floating dark Organic Humus at the meniscus.' },
        { say: 'Read each layer height against total mineral column height H: % Sand = (h_sand ÷ H) × 100%, % Silt = (h_silt ÷ H) × 100%, % Clay = (h_clay ÷ H) × 100%, and classify texture on the soil triangle.' },
      ],
      scene: () => [
        K.show(0, K.bench(262) + `<rect class="cl-gl" x="136" y="48" width="68" height="212" rx="3"/><rect x="138" y="120" width="64" height="138" fill="${CWATER}"/>`, { dur: 0.5 }),
        K.lab(0, [170, 36], '250 cm³ sedimentation cylinder', { cls: 'dimm' }),
        K.show(1, `<circle cx="158" cy="160" r="3" fill="${CSOIL_SAND}"/><circle cx="182" cy="182" r="2.5" fill="${CSOIL_SILT}"/><circle cx="168" cy="144" r="2" fill="${CHUMUS}"/>`, { until: 1, dur: 0.6 }),
        K.lab(1, [284, 150], 'Calgon disperses crumbs', { cls: 'bold', until: 1 }),
        K.show(2, `<rect x="138" y="236" width="64" height="22" fill="${CSOIL_GRAVEL}"/><rect x="138" y="192" width="64" height="44" fill="${CSOIL_SAND}"/><rect x="138" y="166" width="64" height="26" fill="${CSOIL_SILT}"/><rect x="138" y="138" width="64" height="28" fill="${CSOIL_CLAY}"/><rect x="138" y="118" width="64" height="5" fill="${CHUMUS}"/>`, { dur: 0.8 }),
        K.lab(2, [214, 121], 'floating humus', { anchor: 'start', cls: 'dimm' }),
        K.lab(2, [214, 152], 'clay (<0.002 mm)', { anchor: 'start', cls: 'bold' }),
        K.lab(2, [214, 180], 'silt (0.002–0.02 mm)', { anchor: 'start', cls: 'dimm' }),
        K.lab(2, [214, 214], 'sand (0.02–2.0 mm)', { anchor: 'start', cls: 'bold' }),
        K.lab(2, [214, 248], 'gravel (>2.0 mm)', { anchor: 'start', cls: 'dimm' }),
        K.lab(3, [76, 185], '% Layer = (h ÷ H) × 100%', { cls: 'eq' }),
      ],
    },

    /* 2. Soil Porosity, Water Retention & Capillarity across Sand, Clay & Loam */
    {
      id: 'a-soil-porosity',
      subj: 'agric',
      cat: 'soil',
      h: 290,
      name: 'Water retention & capillarity in sand, loam & clay',
      blurb: 'Compare drainage volume, retained capillary water & ultimate capillary rise across 3 soils',
      tip: 'Plug all three funnel necks equally with cotton wool and use identical dry masses (50 g) and water volumes (50 cm³) for a controlled agronomic comparison.',
      steps: () => [
        { say: 'Plug three identical filter funnels A (Sand), B (Loam), and C (Clay) loosely with equal wads of cotton wool, weigh 50 g of oven-dry soil into each, and stand over 100 cm³ measuring cylinders.' },
        { say: 'Pour 50 cm³ of water simultaneously onto each soil sample and start the stopwatch to monitor percolation rate and volume of gravitational filtrate collected.' },
        { say: 'Sand drains fastest (collecting ~36 cm³ filtrate → retains only 14 cm³); Clay drains slowest (collecting ~12 cm³ → retains 38 cm³ but waterlogs); Loam balances drainage and retention (~24 cm³ drained, 26 cm³ capillary water retained).' },
        { say: 'In inverted glass tubes standing in a water trough, Sand shows the fastest initial rise in 15 min, whereas fine Clay achieves the highest ultimate capillary column after 24 hours!' },
      ],
      scene: () => [
        K.show(0, K.bench(262) + `<polygon class="cl-gl" points="54,78 106,78 86,128 74,128"/><polygon class="cl-gl" points="154,78 206,78 186,128 174,128"/><polygon class="cl-gl" points="254,78 306,78 286,128 274,128"/><rect class="cl-gl" x="62" y="142" width="36" height="118"/><rect class="cl-gl" x="162" y="142" width="36" height="118"/><rect class="cl-gl" x="262" y="142" width="36" height="118"/>`, { dur: 0.5 }),
        K.lab(0, [80, 66], 'A: Sand', { cls: 'bold' }),
        K.lab(0, [180, 66], 'B: Loam', { cls: 'bold' }),
        K.lab(0, [280, 66], 'C: Clay', { cls: 'bold' }),
        K.show(1, `<polygon points="60,90 100,90 85,124 75,124" fill="${CSOIL_SAND}"/><polygon points="160,90 200,90 185,124 175,124" fill="#6B4F35"/><polygon points="260,90 300,90 285,124 275,124" fill="${CSOIL_SILT}"/>`, { dur: 0.5 }),
        K.show(2, `<rect x="64" y="182" width="32" height="76" fill="${CWATER}"/><rect x="164" y="206" width="32" height="52" fill="${CWATER}"/><rect x="264" y="234" width="32" height="24" fill="${CWATER}"/>`, { dur: 0.8 }),
        K.lab(2, [80, 172], '36 cm³', { cls: 'dimm' }),
        K.lab(2, [180, 196], '24 cm³', { cls: 'bold' }),
        K.lab(2, [280, 224], '12 cm³', { cls: 'dimm' }),
        K.lab(3, [180, 40], 'Retained = V_added − V_drained', { cls: 'eq' }),
      ],
    },

    /* 3. Soil pH Colourimetric Test & CaCO3 Liming Curve */
    {
      id: 'a-soil-ph',
      subj: 'agric',
      cat: 'soil',
      h: 286,
      name: 'Colorimetric soil pH determination & liming requirement',
      blurb: 'Test tropical soil acidity with BaSO₄ + BDH Universal Indicator and titrate CaCO₃ lime',
      tip: 'Analytical Barium tetraoxosulphate(VI) (BaSO₄) is chemically neutral and flocculates turbid clay colloids so you see the true indicator colour in the clear supernatant.',
      steps: () => [
        { say: 'Place 1 spatula of air-dried topsoil + 1 spatula of white chemically neutral BaSO₄ powder into a clean test tube and add 10 cm³ of distilled water.' },
        { say: 'Add 5 drops of BDH Universal Indicator, stopper, shake thoroughly for 1 minute, and allow BaSO₄ to pull suspended clay cleanly to the bottom.' },
        { say: 'Match the clear supernatant tint against the standard pH colour chart: Red/Orange = strongly acidic (pH 4.5–5.0); Yellow-Green = optimum arable (pH 6.0–6.8); Blue-Violet = alkaline (>7.5).' },
        { say: 'Compute agricultural CaCO₃ liming rate to raise acidic soil into the pH 6.2–6.8 sweet spot where soil phosphate unlocks and Rhizobium/Nitrosomonas bacteria peak.' },
      ],
      scene: () => [
        K.show(0, K.bench(258) + `<rect class="cl-gl" x="68" y="92" width="32" height="162" rx="14"/><rect class="cl-gl" x="164" y="92" width="32" height="162" rx="14"/><rect class="cl-gl" x="260" y="92" width="32" height="162" rx="14"/>`, { dur: 0.5 }),
        K.show(1, `<rect x="70" y="218" width="28" height="34" fill="#E5E7EB"/><rect x="166" y="218" width="28" height="34" fill="#E5E7EB"/><rect x="262" y="218" width="28" height="34" fill="#E5E7EB"/>`, { dur: 0.5 }),
        K.lab(1, [180, 274], 'BaSO₄ clears clay turbidity', { cls: 'dimm' }),
        K.show(2, `<rect x="70" y="136" width="28" height="82" fill="rgba(239,68,68,.65)"/><rect x="166" y="136" width="28" height="82" fill="rgba(52,211,153,.65)"/><rect x="262" y="136" width="28" height="82" fill="rgba(99,102,241,.65)"/>`, { dur: 0.8 }),
        K.lab(2, [84, 78], 'pH 4.8 (Acid)', { cls: 'bold' }),
        K.lab(2, [180, 78], 'pH 6.5 (Optimal)', { cls: 'bold' }),
        K.lab(2, [276, 78], 'pH 8.0 (Alkali)', { cls: 'dimm' }),
        K.lab(3, [180, 44], 'CaCO₃ + 2H⁺ → Ca²⁺ + CO₂↑ + H₂O', { cls: 'eq' }),
      ],
    },

    /* 4. Seed Viability (Tetrazolium & Petri Germination Assay) */
    {
      id: 'a-seed-viability',
      subj: 'agric',
      cat: 'crop',
      h: 286,
      name: 'Seed germination percentage & adjusted seed-rate test',
      blurb: 'Run a 100-seed Petri germination & floatation test to calibrate field seed rate',
      tip: 'Always count ONLY normal vigorous seedlings with healthy radicles and plumules, and adjust field sowing rate upward whenever germination falls below 95%.',
      steps: () => [
        { say: 'Perform rapid water floatation first: bruchid-hollowed or shrivelled non-viable seeds float on water and are skimmed off; dense filled seeds sink.' },
        { say: 'Arrange 100 randomly sampled maize or cowpea seeds in a 10 × 10 grid on moist filter paper inside covered Petri dishes at warm room temperature (27–30 °C) for 5–7 days.' },
        { say: 'Count normal sprouted seedlings (e.g., 85 viable seedlings out of 100) → Germination Percentage = (85 ÷ 100) × 100% = 85%.' },
        { say: 'Adjust field seed rate: if base requirement at 100% viability is 20 kg ha⁻¹, Required Seed Rate = 20 ÷ 0.85 = 23.5 kg ha⁻¹ (tetrazolium chloride stains living respiring embryos carmine red in 2 hours!).' },
      ],
      scene: () => [
        K.show(0, K.bench(258) + `<ellipse class="cl-gl" cx="110" cy="176" rx="74" ry="44"/><ellipse cx="110" cy="176" rx="66" ry="36" fill="rgba(255,255,255,.08)"/>`, { dur: 0.5 }),
        K.lab(0, [110, 118], '100-seed moist Petri dish', { cls: 'dimm' }),
        K.show(1, `<circle cx="80" cy="168" r="5" fill="${CGOLD}"/><circle cx="105" cy="168" r="5" fill="${CGOLD}"/><circle cx="130" cy="168" r="5" fill="${CGOLD}"/><circle cx="92" cy="188" r="5" fill="${CGOLD}"/><circle cx="122" cy="188" r="5" fill="#94A3B8"/>`, { dur: 0.5 }),
        K.show(2, `<path d="M80 168c2-12 8-16 12-18M105 168c2-12 8-16 12-18M130 168c2-12 8-16 12-18M92 188c2-12 8-16 12-18" stroke="${CGREEN}" stroke-width="2.4" fill="none"/>`, { dur: 0.7 }),
        K.lab(2, [272, 146], '85 / 100 sprouted = 85%', { cls: 'bold' }),
        K.lab(3, [264, 196], 'Rate = Base ÷ (Germ % / 100)', { cls: 'eq' }),
      ],
    },

    /* 5. Citrus / Rubber T-Budding & Cleft Grafting */
    {
      id: 'a-budding-graft',
      subj: 'agric',
      cat: 'crop',
      h: 286,
      name: 'Vegetative T-budding & cambial alignment technique',
      blurb: 'Insert an elite Sweet Orange scion bud onto a disease-hardy Rough Lemon rootstock',
      tip: 'Never touch the freshly cut inner cambial surface of the bud shield with dirty fingers, and leave the bud eye itself uncovered when wrapping polythene tape.',
      steps: () => [
        { say: 'Select a pencil-thick, root-rot-resistant Rough Lemon rootstock seedling and make a clean T-shaped bark incision 25 cm above ground using a razor-sharp budding knife.' },
        { say: 'Slice a boat-shaped bud shield (scion) bearing one healthy plump axillary bud (with petiole stub handle) from a high-yielding mature Sweet Orange mother tree.' },
        { say: 'Gently lift the two bark flaps of the T-cut, slide the scion bud shield snugly downward so vascular cambium layers make intimate contact, and wrap tightly with clear polythene budding tape (leaving the bud eye exposed!).' },
        { say: 'Inspect at Day 14–21: if the bud stays green and petiole drops cleanly on touch, bud-take succeeded — cut back the rootstock stem 2 cm above the union and rub off all wild suckers below!' },
      ],
      scene: () => [
        K.show(0, K.bench(258) + `<rect x="88" y="64" width="26" height="194" rx="4" fill="#5C4033" stroke="#A37B52" stroke-width="1.5"/><path d="M93 136h16M101 136v38" stroke="#FEF08A" stroke-width="2.2"/>`, { dur: 0.5 }),
        K.lab(0, [101, 50], 'Rootstock T-incision (25 cm)', { cls: 'dimm' }),
        K.show(1, `<ellipse cx="215" cy="146" rx="12" ry="26" fill="#65A30D" stroke="#BEF264" stroke-width="1.5"/><circle cx="215" cy="146" r="3.5" fill="#ECFCCB"/>`, { dur: 0.6 }),
        K.lab(1, [215, 106], 'Elite scion bud shield', { cls: 'bold' }),
        K.show(2, `<rect x="85" y="128" width="32" height="52" rx="3" fill="rgba(186,230,253,.28)" stroke="#7DD3FC" stroke-width="1.4"/><circle cx="101" cy="154" r="3.5" fill="#4ADE80"/>`, { dur: 0.7 }),
        K.lab(2, [252, 168], 'Cambium aligned + polythene wrap', { cls: 'bold' }),
        K.show(3, `<path d="M104 154c18-16 34-28 48-48" stroke="${CGREEN}" stroke-width="3" fill="none"/><ellipse cx="146" cy="112" rx="12" ry="6" fill="${CGREEN}"/>`, { dur: 0.7 }),
        K.lab(3, [242, 224], 'Prune wild shoots BELOW union!', { cls: 'eq' }),
      ],
    },

    /* 6. NPK Fertilizer Placement & Maize Yield Response Plot */
    {
      id: 'a-npk-yield',
      subj: 'agric',
      cat: 'crop',
      h: 286,
      name: 'NPK ring/band placement & Mitscherlich yield curve',
      blurb: 'Compare unfertilized control, ring-placed NPK 15:15:15, and osmotic stem-burn hazard',
      tip: 'Place soluble NPK or Urea granules in a 5–8 cm groove away from the tender maize stalk and cover with moist soil to stop ammonia volatilization and rain wash-off.',
      steps: () => [
        { say: 'Lay out three uniform maize ridges at 75 cm × 25 cm spacing (53,333 plants ha⁻¹): Plot A = zero-NPK control, Plot B = 5–8 cm ring/band placement covered with soil, Plot C = granules dumped directly touching stem collars.' },
        { say: 'Weigh out the exact calibrated dose: for 300 kg ha⁻¹ of NPK 15:15:15 across 53,333 stands, each maize stand receives 300,000 g ÷ 53,333 ≈ 5.6 g (one level soda bottle cap!).' },
        { say: 'Observe after 10 days: Plot C seedlings wilt with scorched brown collars due to hypertonic exosmosis ("fertilizer burn"), while Plot B develops deep dark-green leaves.' },
        { say: 'Plot grain yield (t ha⁻¹) against Nitrogen rate (0–180 kg N ha⁻¹) to identify the Stage II economic optimum before diminishing returns flatten the curve.' },
      ],
      scene: () => [
        K.show(0, K.bench(258) + `<path d="M36 236q38-28 76 0t76 0 76 0 60 0" fill="none" stroke="#854D0E" stroke-width="4"/>`, { dur: 0.5 }),
        K.show(1, `<line x1="180" y1="224" x2="180" y2="128" stroke="${CGREEN}" stroke-width="4"/><path d="M180 156c-22-18-40-10-48 4M180 144c22-18 40-10 48 4" stroke="${CGREEN}" stroke-width="3" fill="none"/><ellipse cx="180" cy="226" rx="28" ry="8" fill="none" stroke="${CGOLD}" stroke-width="2" stroke-dasharray="4 3"/>`, { dur: 0.7 }),
        K.lab(1, [180, 98], '5–8 cm ring groove around stand', { cls: 'bold' }),
        K.lab(2, [84, 180], '5.6 g NPK / stand', { cls: 'dimm' }),
        K.lab(3, [180, 56], '53,333 stands/ha @ 75 × 25 cm', { cls: 'eq' }),
      ],
    },

    /* 7. Knapsack Sprayer Calibration & Herbicide Selectivity */
    {
      id: 'a-sprayer-calib',
      subj: 'agric',
      cat: 'prot',
      h: 286,
      name: 'Knapsack sprayer calibration & nozzle swath test',
      blurb: 'Determine exact L ha⁻¹ spray delivery rate and herbicide tank dilution per 15-L load',
      tip: 'Always calibrate using clean plain water first on a measured test strip at steady walking pace and constant pump pressure — never guess chemical dilution.',
      steps: () => [
        { say: 'Measure a test strip 50 m long by 2 m nozzle swath width (Test Area = 100 m²) and fill a 15-litre CP-15 knapsack sprayer to the mark with clean water.' },
        { say: 'Pump to steady operating pressure and walk the 50 m strip at a uniform pace holding the flat-fan herbicide nozzle 45–50 cm above ground.' },
        { say: 'Refill the tank from a graduated cylinder to measure water sprayed: if 2.5 litres covered 100 m², Spray Volume Rate = (2.5 L ÷ 100 m²) × 10,000 m² ha⁻¹ = 250 L ha⁻¹.' },
        { say: 'Compute chemical per 15-L knapsack load: if Atrazine label specifies 3.0 L (3,000 cm³) per hectare, number of loads ha⁻¹ = 250 ÷ 15 = 16.67 → add 3,000 ÷ 16.67 = 180 cm³ per tank!' },
      ],
      scene: () => [
        K.show(0, K.bench(258) + `<rect x="58" y="96" width="54" height="112" rx="10" fill="rgba(56,189,248,.28)" stroke="#38BDF8" stroke-width="2"/><line x1="112" y1="168" x2="196" y2="192" stroke="#E2E8F0" stroke-width="2.5"/>`, { dur: 0.5 }),
        K.lab(0, [85, 82], '15-L Knapsack Tank', { cls: 'bold' }),
        K.show(1, `<polygon points="196,192 162,254 230,254" fill="rgba(125,211,252,.22)" stroke="#7DD3FC" stroke-dasharray="3 3"/>`, { dur: 0.6 }),
        K.lab(1, [252, 224], '2.0 m flat-fan swath', { anchor: 'start', cls: 'dimm' }),
        K.lab(2, [238, 118], '2.5 L on 100 m² ⇒ 250 L/ha', { cls: 'bold' }),
        K.lab(3, [224, 154], 'Tank Dose = Rate_ha × (15 ÷ L_ha)', { cls: 'eq' }),
      ],
    },

    /* 8. Crop Pest & Disease Specimen Diagnostics */
    {
      id: 'a-pest-disease',
      subj: 'agric',
      cat: 'prot',
      h: 286,
      name: 'Storage weevil, viral mosaic & black-pod diagnostics',
      blurb: 'Identify Sitophilus rostrum, Bemisia whitefly mosaic, and Phytophthora cocoa rot',
      tip: 'Check mouthparts under a ×10 hand lens: Sitophilus grain weevils bear an elongated snout (rostrum) with biting mandibles at the tip, whereas aphids/whiteflies bear piercing stylets.',
      steps: () => [
        { say: 'Examine Specimen A (perforated maize grains + Sitophilus zeamais): note the elongated curved snout (rostrum) used by females to bore egg cavities inside kernels before sealing with a gelatinous plug.' },
        { say: 'Examine Specimen B (Cassava leaf with yellow-green chlorotic mosaic distortion): caused by Cassava Mosaic Begomovirus transmitted by whitefly (Bemisia tabaci) and infected cuttings.' },
        { say: 'Examine Specimen C (dark-brown rotting Cocoa pod coated in white powdery sporangia): Phytophthora palmivora Black Pod — control by shade pruning, pod sanitation, and Bordeaux mixture fungicide.' },
        { say: 'Contrast Specimen D (Tomato roots with integral bead-like Root-Knot Meloidogyne galls) vs Specimen E (Cowpea roots with smooth lateral detachable pink Rhizobium N₂-fixing nodules!).' },
      ],
      scene: () => [
        K.show(0, K.bench(258) + `<ellipse cx="78" cy="168" rx="34" ry="46" fill="#FACC15" stroke="#CA8A04" stroke-width="2"/><circle cx="72" cy="156" r="4" fill="#1E293B"/><circle cx="88" cy="178" r="4" fill="#1E293B"/>`, { dur: 0.5 }),
        K.lab(0, [78, 108], 'A: Weevil-bored maize', { cls: 'bold' }),
        K.show(1, `<ellipse cx="182" cy="168" rx="34" ry="48" fill="#451A03" stroke="#92400E" stroke-width="2"/><ellipse cx="188" cy="158" rx="18" ry="22" fill="rgba(248,250,252,.45)"/>`, { dur: 0.6 }),
        K.lab(1, [182, 108], 'C: Cocoa Black Pod', { cls: 'bold' }),
        K.show(2, `<line x1="288" y1="126" x2="288" y2="226" stroke="#D97706" stroke-width="3"/><circle cx="288" cy="156" r="7" fill="#B45309"/><circle cx="288" cy="188" r="8" fill="#B45309"/><circle cx="301" cy="212" r="5" fill="#FDA4AF"/>`, { dur: 0.7 }),
        K.lab(2, [288, 108], 'D/E: Gall vs Nodule', { cls: 'bold' }),
        K.lab(3, [180, 54], 'Galls swell core · Nodules detach!', { cls: 'eq' }),
      ],
    },

    /* 9. Ruminant 4-Chamber vs Avian Gizzard Comparative Dissection */
    {
      id: 'a-ruminant-tract',
      subj: 'agric',
      cat: 'livestock',
      h: 286,
      name: 'Ruminant stomach & avian foregut specimen lab',
      blurb: 'Identify Rumen papillae, Reticulum honeycomb, Omasum folds, Abomasum & Bird Gizzard',
      tip: 'Look at the internal mucosal lining of preserved ruminant specimens: towel-like papillae = Rumen; 5/6-sided honeycomb cells = Reticulum; book leaves = Omasum; smooth glandular folds = Abomasum.',
      steps: () => [
        { say: 'Inspect Specimen A (Rumen + Reticulum): identify dense finger-like papillae absorbing Volatile Fatty Acids in the rumen, and hexagonal honeycomb ridges in the reticulum.' },
        { say: 'Inspect Specimen B (Omasum) & C (Abomasum): count the muscular longitudinal laminae ("manyplies" squeezing water) in the omasum vs smooth acid-pepsin secretory mucosa in the abomasum.' },
        { say: 'Inspect Specimen D (Avian Crop, Proventriculus & Gizzard): slit open the thick biconvex muscular Gizzard to reveal tough yellowish koilin lining and quartz grit stones.' },
        { say: 'Relate anatomy to ration design: ruminants convert high-fibre roughage + controlled urea into microbial protein; poultry/pigs require low-fibre concentrates with preformed lysine & methionine.' },
      ],
      scene: () => [
        K.show(0, K.bench(258) + `<ellipse cx="106" cy="162" rx="56" ry="44" fill="rgba(217,119,6,.32)" stroke="#F59E0B" stroke-width="2"/><circle cx="174" cy="176" r="22" fill="rgba(251,191,36,.32)" stroke="#FBBF24" stroke-width="2"/>`, { dur: 0.5 }),
        K.lab(0, [106, 104], '1. Rumen (VFA vat)', { cls: 'bold' }),
        K.lab(0, [178, 214], '2. Reticulum', { cls: 'dimm' }),
        K.show(1, `<circle cx="218" cy="144" r="22" fill="rgba(52,211,153,.28)" stroke="#34D399" stroke-width="2"/><ellipse cx="274" cy="176" rx="34" ry="22" fill="rgba(244,63,94,.32)" stroke="#FB7185" stroke-width="2"/>`, { dur: 0.6 }),
        K.lab(1, [218, 108], '3. Omasum', { cls: 'dimm' }),
        K.lab(1, [274, 214], '4. Abomasum (HCl)', { cls: 'bold' }),
        K.lab(3, [180, 54], 'Rumen → Reticulum → Omasum → Abomasum', { cls: 'eq' }),
      ],
    },

    /* 10. Egg Candling, Structure & Hatchery Quality Control */
    {
      id: 'a-egg-candling',
      subj: 'agric',
      cat: 'livestock',
      h: 286,
      name: 'Incubation egg candling & internal egg anatomy',
      blurb: 'Distinguish fertile vascularized Day-7 embryos, infertile clears, blood rings & air cells',
      tip: 'Hold the blunt end of the egg tilted slightly against the candler aperture in a darkened room — the air space always sits at the blunt pole between inner and outer shell membranes.',
      steps: () => [
        { say: 'Examine internal anatomy of a fresh egg first: porous CaCO₃ shell, outer & inner shell membranes enclosing the blunt-pole Air Space, twisted protein Chalazae anchoring central Yolk, Blastodisc, and thick/thin Albumen.' },
        { say: 'Hold Incubated Egg A (Day 7) against the bright LED candler aperture in a dark room: observe a dark motile embryo eye-spot with radiating red spider-web blood vessels → FERTILE LIVE EMBRYO.' },
        { say: 'Compare Egg B (glows uniformly clear yellow-orange with zero blood vessels → INFERTILE "clear", remove!) and Egg C (static red circle stuck to shell without vessels → EARLY EMBRYONIC DEATH "blood ring", discard!).' },
        { say: 'Re-candle at Day 18 transfer to hatcher trays: a healthy chick fills nearly the entire dark egg beneath an enlarged sloped air cell ready for internal pipping on Day 20–21.' },
      ],
      scene: () => [
        K.show(0, K.bench(258) + `<ellipse cx="86" cy="162" rx="36" ry="48" fill="rgba(254,240,138,.25)" stroke="#FDE047" stroke-width="2"/><ellipse cx="184" cy="162" rx="36" ry="48" fill="rgba(254,240,138,.45)" stroke="#FDE047" stroke-width="2"/><ellipse cx="282" cy="162" rx="36" ry="48" fill="rgba(254,240,138,.22)" stroke="#F87171" stroke-width="2"/>`, { dur: 0.5 }),
        K.show(1, `<circle cx="86" cy="164" r="6" fill="#DC2626"/><path d="M86 164l-18-14M86 164l18-12M86 164l-16 16M86 164l19 14" stroke="#EF4444" stroke-width="1.8"/>`, { dur: 0.6 }),
        K.lab(1, [86, 98], 'Live Fertile (Day 7)', { cls: 'bold' }),
        K.lab(2, [184, 98], 'Infertile "Clear"', { cls: 'dimm' }),
        K.show(2, `<circle cx="282" cy="166" r="18" fill="none" stroke="#DC2626" stroke-width="2.2"/>`, { dur: 0.6 }),
        K.lab(2, [282, 98], 'Dead Blood Ring', { cls: 'bold' }),
        K.lab(3, [184, 50], '37.7 °C · 55–60% RH · 21 Days', { cls: 'eq' }),
      ],
    },

    /* 11. Pearson Square Feed Formulation Bench */
    {
      id: 'a-feed-ration',
      subj: 'agric',
      cat: 'livestock',
      h: 286,
      name: 'Pearson Square ration formulation & proximate check',
      blurb: 'Blend Yellow Maize (9% CP) and Soybean Cake (44% CP) to exact starter/grower protein targets',
      tip: 'Always verify that your target Crude Protein lies strictly between the two ingredients’ CP values, and reserve 3–5% of the batch for bone meal, oyster shell, salt & vitamin-mineral premix.',
      steps: () => [
        { say: 'Inspect feed specimens: Yellow Maize (9% CP energy basal), Toasted Soybean Meal (44% CP plant protein), Fishmeal (65% CP animal protein), Calcined Bone Meal (Ca + P), and Oyster Shell (CaCO₃).' },
        { say: 'Draw the Pearson Square with Target 20% CP at the centre, Maize (9%) at top-left, and Soybean Meal (44%) at bottom-left.' },
        { say: 'Subtract diagonally across the centre (ignoring signs): Parts of Maize (top-right) = 44 − 20 = 24 parts; Parts of Soybean Meal (bottom-right) = 20 − 9 = 11 parts → Total = 35 parts.' },
        { say: 'Convert to a 100 kg batch: Maize = (24 ÷ 35) × 100 = 68.6 kg; Soybean Meal = (11 ÷ 35) × 100 = 31.4 kg. Cross-check CP: (68.6 × 0.09) + (31.4 × 0.44) = 6.17 + 13.83 = 20.0 kg CP!' },
      ],
      scene: () => [
        K.show(0, K.bench(258) + `<rect x="116" y="88" width="128" height="118" fill="none" stroke="#7DD3FC" stroke-width="2"/>`, { dur: 0.5 }),
        K.show(1, `<line x1="116" y1="88" x2="244" y2="206" stroke="#94A3B8" stroke-dasharray="4 3"/><line x1="244" y1="88" x2="116" y2="206" stroke="#94A3B8" stroke-dasharray="4 3"/><circle cx="180" cy="147" r="20" fill="#0F172A" stroke="${CGOLD}" stroke-width="2"/>`, { dur: 0.5 }),
        K.lab(1, [180, 151], '20%', { cls: 'bold' }),
        K.lab(1, [74, 94], 'Maize 9%', { cls: 'dimm' }),
        K.lab(1, [74, 204], 'SBM 44%', { cls: 'dimm' }),
        K.lab(2, [286, 94], '24 parts', { cls: 'bold' }),
        K.lab(2, [286, 204], '11 parts', { cls: 'bold' }),
        K.lab(3, [180, 50], '68.6 kg Maize + 31.4 kg SBM = 20% CP', { cls: 'eq' }),
      ],
    },

    /* 12. Veterinary Ectoparasite & Endoparasite Identification */
    {
      id: 'a-parasite-id',
      subj: 'agric',
      cat: 'livestock',
      h: 286,
      name: 'Tick, liver fluke & tapeworm veterinary specimen lab',
      blurb: 'Identify 8-legged Hard Ticks, leaf-shaped Fasciola + Lymnaea snail, and Taenia scolex',
      tip: 'Adult ticks have 4 pairs of jointed legs (8 legs — Class Arachnida, NOT 6-legged Insecta!) and lack antennae or wings.',
      steps: () => [
        { say: 'Examine Specimen A (Hard Cattle Tick — Boophilus / Amblyomma): count 4 pairs of legs (arachnid), piercing mouthparts (capitulum), and leathery scutum; transmits Babesia redwater & Heartwater.' },
        { say: 'Examine Specimen B (Fasciola gigantica Liver Fluke + Lymnaea mud snail): flattened leaf-like unsegmented trematode with oral and ventral suckers inhabiting cattle/sheep bile ducts.' },
        { say: 'Examine Specimen C (Taenia solium Tapeworm): pin-head Scolex bearing 4 suckers + double crown of hooks (rostellum), short budding neck, and ribbon of gravid hermaphrodite proglottids.' },
        { say: 'Match integrated break-points: acaricide dipping + rotational paddocking for ticks; pasture drainage against Lymnaea snails; latrine hygiene + pork/beef inspection & thorough cooking against Taenia.' },
      ],
      scene: () => [
        K.show(0, K.bench(258) + `<ellipse cx="78" cy="164" rx="22" ry="28" fill="#7C2D12" stroke="#F97316" stroke-width="2"/><path d="M56 150l-12-8M56 160l-14-2M56 170l-14 4M56 180l-12 10M100 150l12-8M100 160l14-2M100 170l14 4M100 180l12 10" stroke="#FDBA74" stroke-width="1.8"/>`, { dur: 0.5 }),
        K.lab(0, [78, 112], 'A: Tick (8 legs)', { cls: 'bold' }),
        K.show(1, `<path d="M180 124c22 18 26 52 0 84-26-32-22-66 0-84z" fill="rgba(16,185,129,.35)" stroke="#34D399" stroke-width="2"/><circle cx="180" cy="142" r="4" fill="#A7F3D0"/>`, { dur: 0.6 }),
        K.lab(1, [180, 108], 'B: Liver Fluke', { cls: 'bold' }),
        K.show(2, `<circle cx="282" cy="132" r="8" fill="#E2E8F0"/><path d="M282 140v12h12v14h-24v16h28v18h-32" fill="none" stroke="#E2E8F0" stroke-width="2.2"/>`, { dur: 0.6 }),
        K.lab(2, [282, 108], 'C: Tapeworm', { cls: 'bold' }),
        K.lab(3, [180, 52], 'Break host-vector contact!', { cls: 'eq' }),
      ],
    },

    /* 13. Aquaculture Pond Secchi Turbidity, pH & Dissolved Oxygen Rig */
    {
      id: 'a-pond-quality',
      subj: 'agric',
      cat: 'aqua',
      h: 286,
      name: 'Fishpond Secchi disc plankton & dissolved oxygen test',
      blurb: 'Measure 30–45 cm Secchi phytoplankton visibility, pond liming pH, and DO ≥ 5 mg L⁻¹',
      tip: 'Always take Secchi disc readings between 10:00 a.m. and 2:00 p.m. on the sunny side of the pond without sunglasses, averaging disappearance and reappearance depths.',
      steps: () => [
        { say: 'Lower a weighted 20 cm black-and-white quadrant Secchi Disc on a graduated cord vertically into the fishpond until the quadrants just disappear from view (d₁), then raise slowly until it reappears (d₂).' },
        { say: 'Compute Secchi Visibility Z = (d₁ + d₂) ÷ 2: 30–45 cm indicates an ideal green phytoplankton bloom; >60 cm means pond needs NPK/poultry-manure fertilization; <20 cm risks dawn oxygen crash!' },
        { say: 'Verify pond pH (ideal 6.5–8.5) and Dissolved Oxygen (ideal ≥ 5.0 mg L⁻¹ for Tilapia & Clarias growth) using a DO probe or Winkler titration.' },
        { say: 'Inspect hydraulic structures: check Inlet screen mesh against wild predators, Spillway trash rack, and Monk boards regulating bottom-water drainage.' },
      ],
      scene: () => [
        K.show(0, K.bench(258) + `<rect x="44" y="108" width="272" height="148" fill="rgba(16,185,129,.26)" stroke="#34D399" stroke-width="2"/><line x1="180" y1="62" x2="180" y2="178" stroke="#F8FAFC" stroke-width="1.8"/><ellipse cx="180" cy="178" rx="22" ry="8" fill="#F8FAFC" stroke="#0F172A" stroke-width="1.5"/>`, { dur: 0.6 }),
        K.lab(0, [180, 50], 'Graduated Secchi Disc cord', { cls: 'bold' }),
        K.lab(1, [258, 178], 'Z = 35 cm (Optimal!)', { cls: 'bold' }),
        K.lab(2, [104, 140], 'DO ≥ 5.0 mg/L', { cls: 'dimm' }),
        K.lab(3, [180, 236], 'pH 6.5–8.5 · Limed Clay Basin', { cls: 'eq' }),
      ],
    },

    /* 14. Gunter's Chain Baseline & Offset Area Surveying */
    {
      id: 'a-chain-survey',
      subj: 'agric',
      cat: 'aqua',
      h: 286,
      name: 'Gunter’s chain baseline, ranging & offset triangulation',
      blurb: 'Align red-and-white ranging poles, pull a 20.12 m Gunter’s chain, and compute acreage',
      tip: 'Keep the chain taut and horizontal on slopes, count the follower’s collected steel arrows carefully, and drop offsets strictly at 90° using a cross-staff or optical square.',
      steps: () => [
        { say: 'Walk the farm perimeter reconnaissance first, drive station pegs at corners, and erect red-and-white Ranging Poles along the longest unobstructed central Baseline AB.' },
        { say: 'The Follower holds one brass handle of the 20.12 m (66 ft, 100-link) Gunter’s Chain at Station A and sights the Leader into exact alignment with Station B before the Leader inserts a red-tagged steel Arrow.' },
        { say: 'At stations along AB, use a Cross-Staff and graduated Offset Staff to measure perpendicular 90° offsets (h₁, h₂, …) out to irregular boundary bends.' },
        { say: 'Compute total plot area by summing right-angled triangles (½ × b × h) and trapeziums (½(h₁ + h₂) × d), then divide m² by 10,000 for hectares (or sq chains by 10 for acres).' },
      ],
      scene: () => [
        K.show(0, K.bench(258) + `<polygon points="56,216 144,92 296,118 268,226" fill="rgba(52,211,153,.12)" stroke="#34D399" stroke-width="1.8"/><line x1="56" y1="216" x2="296" y2="118" stroke="${CGOLD}" stroke-width="2.6"/>`, { dur: 0.6 }),
        K.lab(0, [186, 184], 'Baseline AB (chains)', { cls: 'bold' }),
        K.show(1, `<line x1="56" y1="216" x2="56" y2="182" stroke="#EF4444" stroke-width="3"/><line x1="296" y1="118" x2="296" y2="84" stroke="#EF4444" stroke-width="3"/>`, { dur: 0.5 }),
        K.lab(1, [56, 172], 'Pole A', { cls: 'dimm' }),
        K.lab(1, [296, 74], 'Pole B', { cls: 'dimm' }),
        K.show(2, `<line x1="162" y1="173" x2="144" y2="92" stroke="#7DD3FC" stroke-width="2" stroke-dasharray="4 3"/>`, { dur: 0.6 }),
        K.lab(2, [120, 134], '90° offset h', { cls: 'bold' }),
        K.lab(3, [180, 48], '1 Chain = 20.12 m · 10 sq ch = 1 Acre', { cls: 'eq' }),
      ],
    },
  ];
}
