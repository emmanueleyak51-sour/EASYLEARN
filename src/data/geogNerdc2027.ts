import type { ChemClassId, Topic } from '../types';
import type { ChemClassMeta } from './chemNerdc2027';

export const GEOG_CLASSES: ChemClassMeta[] = [
  {
    id: 'ss1',
    label: 'SS 1',
    shortLabel: 'SS 1',
    fullTitle: 'SS 1 Geography',
    kicker: 'NERDC Year 1 · Solar System, Lat/Long, Rocks, Weather, Mapwork & GIS',
    description:
      'Solar system & Earth movements, latitude/longitude & time zones, rocks & tectonic landforms, weather instruments & Köppen climate, ocean currents, topographical scales/contours & GIS.',
  },
  {
    id: 'ss2',
    label: 'SS 2',
    shortLabel: 'SS 2',
    fullTitle: 'SS 2 Geography',
    kicker: 'NERDC Year 2 · Denudation, Fluvial/Karst/Arid/Coastal Landforms & Human Geography',
    description:
      'Weathering & mass wasting, river stages & drainage, karst/artesian water, desert wind, glacial & coastal landforms, environmental hazards, world population, settlements, transport & manufacturing.',
  },
  {
    id: 'ss3',
    label: 'SS 3',
    shortLabel: 'SS 3',
    fullTitle: 'SS 3 Geography',
    kicker: 'NERDC Year 3 · Regional Geography of Nigeria, West Africa (ECOWAS) & Africa',
    description:
      'Nigeria’s relief, drainage, ITD climate, vegetation, soils, crops, minerals/hydro power, industrial zones & trade, plus ECOWAS, Nile/Niger irrigation, African mining & Lake Chad sustainability.',
  },
  {
    id: 'all',
    label: 'All Classes',
    shortLabel: 'All',
    fullTitle: 'Complete Geography (SS1–SS3)',
    kicker: 'National Curriculum · 30 Topics',
    description:
      'Complete Nigerian NERDC SS1–SS3 Geography curriculum across Topographical Mapwork & GIS, Physical Geomorphology, Climatology & Environment, Human/Economic Geography, and Regional Nigeria & Africa.',
  },
];

export type GeogDomainId = 'mapwork' | 'physical' | 'climate' | 'human' | 'regional';

export interface GeogNerdcTopicPlacement {
  classId: 'ss1' | 'ss2' | 'ss3';
  term: 1 | 2 | 3;
  termLabel: 'First Term' | 'Second Term' | 'Third Term';
  nerdcTheme:
    | 'Practical Geography, Map Reading & GIS'
    | 'Earth Structure, Rocks & Geomorphology'
    | 'Climatology, Hydrosphere & Environment'
    | 'Human, Population, Settlement & Economic Geography'
    | 'Regional Geography of Nigeria & Africa';
  order: number;
  domain: GeogDomainId;
  keywords: string[];
}

export const GEOG_NERDC_MAP: Record<string, GeogNerdcTopicPlacement> = {
  // ─────────────────────────── SS 1 (10 Topics) ───────────────────────────
  'gg-solar-earth': {
    classId: 'ss1',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Earth Structure, Rocks & Geomorphology',
    order: 1,
    domain: 'physical',
    keywords: ['solar system', 'oblate spheroid', 'geoid', 'earth rotation', 'earth revolution', 'equinox', 'solstice', 'eclipse', 'dawn and twilight', 'coriolis'],
  },
  'gg-lat-long-time': {
    classId: 'ss1',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Practical Geography, Map Reading & GIS',
    order: 2,
    domain: 'mapwork',
    keywords: ['latitude', 'longitude', 'great circle', 'greenwich meridian', 'local time', 'standard time', 'international date line', '111 km', 'wat'],
  },
  'gg-structure-rocks': {
    classId: 'ss1',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Earth Structure, Rocks & Geomorphology',
    order: 3,
    domain: 'physical',
    keywords: ['crust', 'sial', 'sima', 'moho', 'mantle', 'barysphere', 'core', 'igneous', 'plutonic', 'volcanic', 'sedimentary', 'metamorphic', 'granite', 'basalt', 'limestone', 'marble'],
  },
  'gg-landforms-tectonic': {
    classId: 'ss1',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Earth Structure, Rocks & Geomorphology',
    order: 4,
    domain: 'physical',
    keywords: ['fold mountains', 'block mountains', 'horst', 'rift valley', 'graben', 'volcanic mountains', 'residual mountains', 'inselberg', 'tectonic plateau', 'alluvial plain'],
  },
  'gg-weather-elements': {
    classId: 'ss1',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Climatology, Hydrosphere & Environment',
    order: 5,
    domain: 'climate',
    keywords: ['weather', 'climate', 'rain gauge', 'sixs thermometer', 'hygrometer', 'wet and dry bulb', 'anemometer', 'wind vane', 'barometer', 'isobar', 'isohyet', 'isotherm', 'stevenson screen'],
  },
  'gg-climate-koppen': {
    classId: 'ss1',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Climatology, Hydrosphere & Environment',
    order: 6,
    domain: 'climate',
    keywords: ['environmental lapse rate', 'convectional rainfall', 'relief orographic rainfall', 'cyclonic frontal rainfall', 'land and sea breeze', 'koppen classification', 'Af Am Aw BWh BSh Cfb'],
  },
  'gg-oceans-water': {
    classId: 'ss1',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Climatology, Hydrosphere & Environment',
    order: 7,
    domain: 'physical',
    keywords: ['continental shelf', 'continental slope', 'abyssal plain', 'ocean trench', 'salinity', 'warm ocean current', 'cold ocean current', 'benguela', 'canary', 'guinea current', 'hydrological cycle'],
  },
  'gg-map-scales': {
    classId: 'ss1',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Practical Geography, Map Reading & GIS',
    order: 8,
    domain: 'mapwork',
    keywords: ['statement scale', 'representative fraction', 'linear scale', 'map enlargement', 'map reduction', 'ground distance', 'grid square area', 'true north', 'magnetic bearing'],
  },
  'gg-map-contours': {
    classId: 'ss1',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Practical Geography, Map Reading & GIS',
    order: 9,
    domain: 'mapwork',
    keywords: ['contour interval', 'vertical interval', 'horizontal equivalent', 'gradient', 'spur', 'valley', 'col', 'saddle', 'escarpment', 'conical hill', 'knoll', 'cross section', 'vertical exaggeration', 'intervisibility'],
  },
  'gg-gis-remote': {
    classId: 'ss1',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Practical Geography, Map Reading & GIS',
    order: 10,
    domain: 'mapwork',
    keywords: ['gis', 'geographic information system', 'raster', 'vector', 'gps', 'remote sensing', 'satellite imagery', 'chain surveying', 'prismatic compass', 'spatial data'],
  },

  // ─────────────────────────── SS 2 (10 Topics) ───────────────────────────
  'gg-weathering-mass': {
    classId: 'ss2',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Earth Structure, Rocks & Geomorphology',
    order: 1,
    domain: 'physical',
    keywords: ['exfoliation', 'frost action', 'freeze-thaw', 'carbonation', 'hydrolysis', 'oxidation', 'hydration', 'solution', 'soil creep', 'mudflow', 'landslide', 'rockfall'],
  },
  'gg-rivers-fluvial': {
    classId: 'ss2',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Earth Structure, Rocks & Geomorphology',
    order: 2,
    domain: 'physical',
    keywords: ['corrasion', 'attrition', 'hydraulic action', 'saltation', 'v-shaped valley', 'gorge', 'waterfall', 'plunge pool', 'meander', 'ox-bow lake', 'floodplain', 'levee', 'delta', 'dendritic', 'trellis', 'radial'],
  },
  'gg-karst-water': {
    classId: 'ss2',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Earth Structure, Rocks & Geomorphology',
    order: 3,
    domain: 'physical',
    keywords: ['water table', 'aquifer', 'aquiclude', 'artesian basin', 'spring', 'limestone', 'karst', 'grikes', 'clints', 'swallow hole', 'sinkhole', 'polje', 'stalactite', 'stalagmite', 'pillar'],
  },
  'gg-arid-wind': {
    classId: 'ss2',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Earth Structure, Rocks & Geomorphology',
    order: 4,
    domain: 'physical',
    keywords: ['deflation', 'abrasion', 'rock pedestal', 'zeugen', 'yardang', 'inselberg', 'barchan', 'seif dune', 'loess', 'wadi', 'bajada', 'playa', 'hamada', 'reg', 'erg'],
  },
  'gg-glacial-coastal': {
    classId: 'ss2',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Earth Structure, Rocks & Geomorphology',
    order: 5,
    domain: 'physical',
    keywords: ['plucking', 'corrie', 'cirque', 'arete', 'pyramidal peak', 'u-shaped trough', 'hanging valley', 'moraine', 'drumlin', 'esker', 'cliff', 'wave-cut platform', 'cave', 'arch', 'stack', 'stump', 'spit', 'tombolo', 'longshore drift', 'ria', 'fiord'],
  },
  'gg-env-hazards': {
    classId: 'ss2',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Climatology, Hydrosphere & Environment',
    order: 6,
    domain: 'climate',
    keywords: ['ecosystem', 'food chain', 'trophic level', 'sheet erosion', 'gully erosion', 'desertification', 'shelterbelt', 'afforestation', 'flooding', 'ozone depletion', 'greenhouse effect'],
  },
  'gg-world-pop': {
    classId: 'ss2',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Human, Population, Settlement & Economic Geography',
    order: 7,
    domain: 'human',
    keywords: ['population density', 'birth rate', 'death rate', 'natural increase', 'demographic transition', 'population pyramid', 'push and pull factors', 'rural-urban migration'],
  },
  'gg-settlements': {
    classId: 'ss2',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Human, Population, Settlement & Economic Geography',
    order: 8,
    domain: 'human',
    keywords: ['site and situation', 'nucleated', 'dispersed', 'linear settlement', 'conurbation', 'megalopolis', 'urban sprawl', 'rural-urban fringe', 'central business district'],
  },
  'gg-transport-comm': {
    classId: 'ss2',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Human, Population, Settlement & Economic Geography',
    order: 9,
    domain: 'human',
    keywords: ['road transport', 'rail gauge', 'inland waterways', 'ocean shipping', 'pipeline', 'air freight', 'seaport', 'entrepot', 'hinterland', 'telecommunications'],
  },
  'gg-world-industry-trade': {
    classId: 'ss2',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Human, Population, Settlement & Economic Geography',
    order: 10,
    domain: 'human',
    keywords: ['heavy industry', 'light industry', 'footloose industry', 'raw material orientation', 'market orientation', 'ruhr', 'great lakes', 'bilateral trade', 'multilateral trade'],
  },

  // ─────────────────────────── SS 3 (10 Topics) ───────────────────────────
  'gg-nig-relief-drainage': {
    classId: 'ss3',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Regional Geography of Nigeria & Africa',
    order: 1,
    domain: 'regional',
    keywords: ['4 to 14 north', '3 to 15 east', '923768 km2', 'north-central highlands', 'jos plateau', 'western uplands', 'eastern highlands', 'chappal waddi', 'sokoto plains', 'chad basin', 'river niger', 'river benue'],
  },
  'gg-nig-climate-veg': {
    classId: 'ss3',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Regional Geography of Nigeria & Africa',
    order: 2,
    domain: 'regional',
    keywords: ['tropical maritime', 'tropical continental', 'harmattan', 'inter-tropical discontinuity', 'itd', 'mangrove swamp', 'freshwater swamp', 'tropical rainforest', 'guinea savanna', 'sudan savanna', 'sahel savanna', 'montane'],
  },
  'gg-nig-soils-forest': {
    classId: 'ss3',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Regional Geography of Nigeria & Africa',
    order: 3,
    domain: 'regional',
    keywords: ['ferruginous soil', 'ferralsols', 'laterite', 'alluvial soil', 'hydromorphic', 'regosols', 'leaching', 'lumbering', 'sapele', 'benin', 'iroko', 'mahogany', 'obeche'],
  },
  'gg-nig-agriculture': {
    classId: 'ss3',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Regional Geography of Nigeria & Africa',
    order: 4,
    domain: 'regional',
    keywords: ['bush fallowing', 'cocoa belt', 'oil palm', 'rubber', 'groundnut', 'cotton', 'yam', 'cassava', 'millet', 'bakolori', 'kano river project', 'chad basin irrigation', 'nomadic pastoralism', 'tsetse fly'],
  },
  'gg-nig-minerals-power': {
    classId: 'ss3',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Regional Geography of Nigeria & Africa',
    order: 5,
    domain: 'regional',
    keywords: ['niger delta petroleum', 'oloibiri', 'bonny lng', 'enugu coal', 'jos tin columbite', 'itakpe iron ore', 'ewekoro limestone', 'kainji dam', 'shiroro', 'jebba', 'egbin thermal'],
  },
  'gg-nig-pop-industry': {
    classId: 'ss3',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Regional Geography of Nigeria & Africa',
    order: 6,
    domain: 'regional',
    keywords: ['kano close-settled zone', 'igboland high density', 'yorubaland urban', 'middle belt sparse', 'lagos-ota-ikeja', 'kano-kaduna-zaria', 'port harcourt-aba-onitsha'],
  },
  'gg-nig-trade-tourism': {
    classId: 'ss3',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Regional Geography of Nigeria & Africa',
    order: 7,
    domain: 'regional',
    keywords: ['north-south internal trade', 'cattle and kolanut', 'apapa tin can', 'onne', 'lekki deep sea port', 'yankari', 'obudu', 'olumo rock', 'erin ijesha', 'ogbunike'],
  },
  'gg-west-africa-ecowas': {
    classId: 'ss3',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Regional Geography of Nigeria & Africa',
    order: 8,
    domain: 'regional',
    keywords: ['west africa', 'anglophone', 'francophone', 'lusophone', 'ecowas', 'lagos treaty 1975', 'abuja headquarters', 'futa djallon', 'trans-west african highway'],
  },
  'gg-africa-basins-mining': {
    classId: 'ss3',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Regional Geography of Nigeria & Africa',
    order: 9,
    domain: 'regional',
    keywords: ['nile basin', 'aswan high dam', 'gezira scheme', 'kainji', 'kariba', 'akombo', 'volta', 'zambia-katanga copperbelt', 'witwatersrand gold', 'kimberley'],
  },
  'gg-africa-issues': {
    classId: 'ss3',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Regional Geography of Nigeria & Africa',
    order: 10,
    domain: 'regional',
    keywords: ['landlocked countries', 'lake chad shrinkage', 'sahel drought', 'great green wall', 'climate resilience', 'afcfta', 'african union', 'sustainable development'],
  },
};

export function getGeogClassMeta(classId?: ChemClassId): ChemClassMeta {
  return GEOG_CLASSES.find((c) => c.id === (classId || 'all')) || GEOG_CLASSES[3];
}

export function filterGeogTopicsByClass(topics: Topic[], classId?: ChemClassId): Topic[] {
  if (!classId || classId === 'all') return topics;
  return topics
    .filter((t) => GEOG_NERDC_MAP[t.id]?.classId === classId)
    .sort((a, b) => (GEOG_NERDC_MAP[a.id]?.order ?? 99) - (GEOG_NERDC_MAP[b.id]?.order ?? 99));
}
