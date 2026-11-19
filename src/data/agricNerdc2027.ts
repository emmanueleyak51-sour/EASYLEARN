import type { ChemClassId, Topic } from '../types';
import type { ChemClassMeta } from './chemNerdc2027';

export const AGRIC_CLASSES: ChemClassMeta[] = [
  {
    id: 'ss1',
    label: 'SS 1',
    shortLabel: 'SS 1',
    fullTitle: 'SS 1 Agricultural Science',
    kicker: 'NERDC Year 1 · Ecology, Rocks & Soil Science, Farm Power, Crop Husbandry & Pasture',
    description:
      'Scope of agriculture, land tenure systems, agro-ecological zones, rock weathering & soil formation, soil texture & pH, farm tools & mechanization, crop classification, staple crop husbandry & forage.',
  },
  {
    id: 'ss2',
    label: 'SS 2',
    shortLabel: 'SS 2',
    fullTitle: 'SS 2 Agricultural Science',
    kicker: 'NERDC Year 2 · Plant Nutrients, Irrigation, Surveying, Forestry, Crop Protection & Animal Physiology',
    description:
      'Macro & micronutrients, NPK fertilizers & liming, irrigation & drainage, Gunter’s chain surveying, agroforestry, insect pests, plant pathogens, weed control, ruminant digestion & animal reproduction.',
  },
  {
    id: 'ss3',
    label: 'SS 3',
    shortLabel: 'SS 3',
    fullTitle: 'SS 3 Agricultural Science',
    kicker: 'NERDC Year 3 · Livestock Systems, Feed Rationing, Aquaculture, Breeding & Agribusiness Economics',
    description:
      'Poultry/cattle/swine husbandry, Pearson Square ration formulation, livestock diseases & parasites, pond aquaculture, apiculture & snailery, Mendelian crop & animal breeding, farm accounts, marketing & extension.',
  },
  {
    id: 'all',
    label: 'All Classes',
    shortLabel: 'All Classes',
    fullTitle: 'Complete Agricultural Science (SS1–SS3 National Curriculum)',
    kicker: 'All-Round National Curriculum · 30 Topics',
    description:
      'Complete Nigerian NERDC SS1–SS3 Agricultural Science curriculum covering soil science, agronomy, crop protection, farm engineering, animal science, aquaculture, genetics & agribusiness management.',
  },
];

export type AgricDomainId = 'ecology' | 'soil' | 'crops' | 'livestock' | 'agribiz';

export interface AgricNerdcTopicPlacement {
  classId: 'ss1' | 'ss2' | 'ss3';
  term: 1 | 2 | 3;
  termLabel: 'First Term' | 'Second Term' | 'Third Term';
  nerdcTheme:
    | 'Basic Concepts, Land & Agro-Ecology'
    | 'Soil Science & Agricultural Engineering'
    | 'Crop Production, Forestry & Protection'
    | 'Animal Science, Fisheries & Breeding'
    | 'Agricultural Economics & Extension';
  order: number;
  domain: AgricDomainId;
  keywords: string[];
}

export const AGRIC_NERDC_MAP: Record<string, AgricNerdcTopicPlacement> = {
  // ─────────────────────────── SS 1 (10 Topics) ───────────────────────────
  'ag-intro': {
    classId: 'ss1',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Basic Concepts, Land & Agro-Ecology',
    order: 1,
    domain: 'ecology',
    keywords: ['subsistence farming', 'commercial agriculture', 'agronomy', 'horticulture', 'heliciculture', 'apiculture', 'food security', 'agro-allied industries', 'iita', 'nihort', 'crin', 'nifor'],
  },
  'ag-land-tenure': {
    classId: 'ss1',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Basic Concepts, Land & Agro-Ecology',
    order: 2,
    domain: 'ecology',
    keywords: ['land tenure', 'communal ownership', 'inheritance', 'leasehold', 'freehold', 'land use act 1978', 'certificate of occupancy', 'fragmentation'],
  },
  'ag-ecology': {
    classId: 'ss1',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Basic Concepts, Land & Agro-Ecology',
    order: 3,
    domain: 'ecology',
    keywords: ['agro-ecology', 'biotic factors', 'edaphic factors', 'climatic factors', 'photoperiodism', 'rainforest', 'guinea savanna', 'sudan savanna', 'sahel'],
  },
  'ag-rocks-soil': {
    classId: 'ss1',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Soil Science & Agricultural Engineering',
    order: 4,
    domain: 'soil',
    keywords: ['igneous', 'granite', 'basalt', 'sedimentary', 'limestone', 'sandstone', 'metamorphic', 'marble', 'gneiss', 'hydrolysis', 'carbonation', 'soil profile', 'horizons'],
  },
  'ag-soil-props': {
    classId: 'ss1',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Soil Science & Agricultural Engineering',
    order: 5,
    domain: 'soil',
    keywords: ['mineral matter 45%', 'organic matter 5%', 'soil water 25%', 'soil air 25%', 'sandy', 'clay', 'loam', 'capillarity', 'porosity', 'hygroscopic water', 'capillary water', 'soil ph', 'liming'],
  },
  'ag-tools-machinery': {
    classId: 'ss1',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Soil Science & Agricultural Engineering',
    order: 6,
    domain: 'soil',
    keywords: ['cutlass', 'hoe', 'secateurs', 'shears', 'go-to-hell', 'burdizzo', 'trocar and cannula', 'disc plough', 'disc harrow', 'ridger', 'seed planter', 'combine harvester'],
  },
  'ag-power-mech': {
    classId: 'ss1',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Soil Science & Agricultural Engineering',
    order: 7,
    domain: 'soil',
    keywords: ['human power', 'draught animals', 'pto shaft', 'internal combustion engine', 'four-stroke', 'two-stroke', 'solar power', 'biogas', 'mechanization'],
  },
  'ag-crop-class': {
    classId: 'ss1',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Crop Production, Forestry & Protection',
    order: 8,
    domain: 'crops',
    keywords: ['annuals', 'biennials', 'perennials', 'ephemerals', 'cereals', 'legumes', 'roots and tubers', 'oil crops', 'fibre crops', 'latex', 'monocot', 'dicot'],
  },
  'ag-crop-husbandry': {
    classId: 'ss1',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Crop Production, Forestry & Protection',
    order: 9,
    domain: 'crops',
    keywords: ['maize zea mays', 'rice oryza sativa', 'cassava manihot esculenta', 'yam dioscorea', 'cocoa theobroma cacao', 'oil palm elaeis guineensis', 'seed rate', 'plant population', 'staking', 'supplying', 'thinning'],
  },
  'ag-pasture': {
    classId: 'ss1',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Crop Production, Forestry & Protection',
    order: 10,
    domain: 'crops',
    keywords: ['elephant grass pennisetum purpureum', 'guinea grass panicum maximum', 'centrosema', 'stylosanthes', 'pueraria', 'rotational grazing', 'paddocking', 'silage', 'hay', 'stocking rate'],
  },

  // ─────────────────────────── SS 2 (10 Topics) ───────────────────────────
  'ag-nutrients': {
    classId: 'ss2',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Soil Science & Agricultural Engineering',
    order: 1,
    domain: 'soil',
    keywords: ['macronutrients', 'micronutrients', 'chlorosis', 'purpling', 'marginal scorching', 'rhizobium', 'nitrosomonas', 'nitrobacter', 'azotobacter', 'denitrification', 'pseudomonas'],
  },
  'ag-fertilizers': {
    classId: 'ss2',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Soil Science & Agricultural Engineering',
    order: 2,
    domain: 'soil',
    keywords: ['farmyard manure', 'compost', 'green manure', 'npk 15:15:15', 'urea 46% n', 'single superphosphate', 'muriate of potash', 'ring placement', 'band placement', 'top dressing', 'foliar spray', 'crop rotation'],
  },
  'ag-irrigation': {
    classId: 'ss2',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Soil Science & Agricultural Engineering',
    order: 3,
    domain: 'soil',
    keywords: ['drip irrigation', 'sprinkler', 'furrow', 'flooding', 'salinization', 'surface drainage', 'subsurface tile drainage', 'waterlogging', 'denitrification'],
  },
  'ag-surveying': {
    classId: 'ss2',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Soil Science & Agricultural Engineering',
    order: 4,
    domain: 'soil',
    keywords: ['gunter chain 20.12m', 'ranging pole', 'offset staff', 'theodolite', 'prismatic compass', 'dumpy level', 'abney level', 'farmstead layout', 'baseline', 'triangulation'],
  },
  'ag-forestry': {
    classId: 'ss2',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Crop Production, Forestry & Protection',
    order: 5,
    domain: 'crops',
    keywords: ['silviculture', 'taungya farming', 'alley cropping', 'selective exploitation', 'afforestation', 'reforestation', 'shelterbelt', 'iroko', 'mahogany', 'obeche', 'teak'],
  },
  'ag-pests': {
    classId: 'ss2',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Crop Production, Forestry & Protection',
    order: 6,
    domain: 'crops',
    keywords: ['biting and chewing', 'piercing and sucking', 'boring insects', 'sitophilus weevil', 'callosobruchus', 'bemisia whitefly', 'aphid', 'mirid capsid', 'stem borer', 'integrated pest management'],
  },
  'ag-diseases': {
    classId: 'ss2',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Crop Production, Forestry & Protection',
    order: 7,
    domain: 'crops',
    keywords: ['phytophthora black pod', 'maize smut', 'rice blast', 'cassava mosaic virus', 'groundnut rosette', 'cocoa swollen shoot', 'bacterial blight', 'root-knot nematode', 'bordeaux mixture'],
  },
  'ag-weeds': {
    classId: 'ss2',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Crop Production, Forestry & Protection',
    order: 8,
    domain: 'crops',
    keywords: ['spear grass imperata cylindrica', 'striga hermonthica witchweed', 'chromolaena odorata siam weed', 'tridax procumbens', 'water hyacinth', 'paraquat', 'glyphosate', 'atrazine', '2,4-d', 'pre-emergence'],
  },
  'ag-animal-anat': {
    classId: 'ss2',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Animal Science, Fisheries & Breeding',
    order: 9,
    domain: 'livestock',
    keywords: ['ruminant', 'polygastric', 'rumen', 'reticulum', 'omasum', 'abomasum', 'monogastric', 'crop', 'proventriculus', 'gizzard', 'cellulose fermentation', 'cauda'],
  },
  'ag-animal-repro': {
    classId: 'ss2',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Animal Science, Fisheries & Breeding',
    order: 10,
    domain: 'livestock',
    keywords: ['oestrus cycle', 'heat signs', 'ovulation', 'gestation period', 'parturition', 'oxytocin', 'prolactin', 'progesterone', 'colostrum', 'egg formation', 'infundibulum', 'magnum', 'isthmus', 'uterus shell gland'],
  },

  // ─────────────────────────── SS 3 (10 Topics) ───────────────────────────
  'ag-livestock': {
    classId: 'ss3',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Animal Science, Fisheries & Breeding',
    order: 1,
    domain: 'livestock',
    keywords: ['deep litter', 'battery cage', 'brooding', 'candling', 'incubation 21 days', 'debeaking', 'white fulani', 'ndama trypanotolerant', 'sokoto gudali', 'large white pig', 'culling'],
  },
  'ag-nutrition': {
    classId: 'ss3',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Animal Science, Fisheries & Breeding',
    order: 2,
    domain: 'livestock',
    keywords: ['concentrates', 'roughages', 'maintenance ration', 'production ration', 'flushing', 'steaming up', 'pearson square', 'feed conversion ratio', 'rickets', 'osteomalacia', 'curled-toe paralysis'],
  },
  'ag-animal-health': {
    classId: 'ss3',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Animal Science, Fisheries & Breeding',
    order: 3,
    domain: 'livestock',
    keywords: ['foot-and-mouth', 'newcastle disease', 'rinderpest', 'anthrax bacillus', 'brucellosis', 'aspergillosis', 'coccidiosis eimeria', 'trypanosomiasis tsetse', 'fasciola liver fluke', 'lymnaea snail', 'tapeworm', 'tick'],
  },
  'ag-fisheries': {
    classId: 'ss3',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Animal Science, Fisheries & Breeding',
    order: 4,
    domain: 'livestock',
    keywords: ['clarias gariepinus', 'oreochromis niloticus', 'monk', 'spillway', 'pond liming', 'pond fertilization', 'phytoplankton bloom', 'secchi disc', 'dissolved oxygen', 'smoking', 'salting', 'eez'],
  },
  'ag-apiculture': {
    classId: 'ss3',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Animal Science, Fisheries & Breeding',
    order: 5,
    domain: 'livestock',
    keywords: ['apis mellifera', 'kenya top-bar hive', 'langstroth hive', 'queen', 'drone', 'worker', 'smoker', 'bee veil', 'archachatina marginata', 'achatina achatina', 'aestivation', 'calcium shell'],
  },
  'ag-crop-breed': {
    classId: 'ss3',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Crop Production, Forestry & Protection',
    order: 6,
    domain: 'crops',
    keywords: ['mendel laws', 'monohybrid 3:1', 'dihybrid 9:3:3:1', 'test cross 1:1', 'introduction', 'mass selection', 'pure-line selection', 'hybridization', 'heterosis hybrid vigour', 'polyploidy', 'grafting', 'scion', 'rootstock'],
  },
  'ag-animal-breed': {
    classId: 'ss3',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Animal Science, Fisheries & Breeding',
    order: 7,
    domain: 'livestock',
    keywords: ['inbreeding', 'inbreeding depression', 'line breeding', 'outbreeding', 'crossbreeding', 'upgrading', 'artificial insemination', 'liquid nitrogen -196', 'progeny testing'],
  },
  'ag-econ-accounts': {
    classId: 'ss3',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Agricultural Economics & Extension',
    order: 8,
    domain: 'agribiz',
    keywords: ['diminishing returns', 'farm inventory', 'cash book', 'profit and loss account', 'balance sheet', 'net worth', 'solvency', 'straight-line depreciation', 'salvage value', 'gross margin'],
  },
  'ag-marketing': {
    classId: 'ss3',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Agricultural Economics & Extension',
    order: 9,
    domain: 'agribiz',
    keywords: ['assembling', 'grading', 'standardization', 'packaging', 'storage', 'processing', 'commodity exchange', 'producers cooperative', 'patronage dividend', 'price stabilization'],
  },
  'ag-extension': {
    classId: 'ss3',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Agricultural Economics & Extension',
    order: 10,
    domain: 'agribiz',
    keywords: ['individual method', 'group method', 'result demonstration', 'method demonstration', 'mass media', 'innovators', 'early adopters', 'laggards', 'agricultural credit', 'boa', 'acgsf', 'naic insurance'],
  },
};

export function getAgricClassMeta(classId?: ChemClassId): ChemClassMeta {
  return AGRIC_CLASSES.find((c) => c.id === (classId || 'all')) || AGRIC_CLASSES[3];
}

export function filterAgricTopicsByClass(topics: Topic[], classId?: ChemClassId): Topic[] {
  if (!classId || classId === 'all') return topics;
  return topics
    .filter((t) => AGRIC_NERDC_MAP[t.id]?.classId === classId)
    .sort((a, b) => (AGRIC_NERDC_MAP[a.id]?.order ?? 99) - (AGRIC_NERDC_MAP[b.id]?.order ?? 99));
}
