import type { ChemClassId, Topic } from '../types';
import type { ChemClassMeta } from './chemNerdc2027';

export const BIO_CLASSES: ChemClassMeta[] = [
  {
    id: 'ss1',
    label: 'SS 1',
    shortLabel: 'SS 1',
    fullTitle: 'SS 1 Biology',
    kicker: 'NERDC Year 1 · Cells, Life Processes & Foundational Ecology',
    description:
      'Classification & 5 kingdoms, cell organelles, osmosis/plasmolysis, enzymes & photosynthesis, respiration, skeletal tissues, biomes & nutrient cycles.',
  },
  {
    id: 'ss2',
    label: 'SS 2',
    shortLabel: 'SS 2',
    fullTitle: 'SS 2 Biology',
    kicker: 'NERDC Year 2 · Mammalian & Plant Physiology, Coordination & Habitats',
    description:
      'Dentition & digestion, heart & xylem/phloem transport, gas exchange, nephron osmoregulation, homeostasis, neurones, eye/ear, habitats & flowering plants.',
  },
  {
    id: 'ss3',
    label: 'SS 3',
    shortLabel: 'SS 3',
    fullTitle: 'SS 3 Biology',
    kicker: 'NERDC Year 3 · Reproduction, Genetics, DNA, Evolution & Public Health',
    description:
      'Mammalian reproduction, Mendelian crosses, ABO/Rhesus & sex-linkage, DNA & biotechnology, variation, adaptation, Darwinian evolution, plant anatomy & tropical diseases.',
  },
  {
    id: 'all',
    label: 'All Classes',
    shortLabel: 'All',
    fullTitle: 'Complete Biology (SS1–SS3)',
    kicker: 'National Curriculum · 30 Topics',
    description:
      'Complete Nigerian NERDC SS1–SS3 Biology curriculum covering cell biology, physiology, plant science, ecology, genetics, and practical investigations.',
  },
];

export type BioDomainId = 'cells' | 'physiology' | 'plants' | 'ecology' | 'genetics';

export interface BioNerdcTopicPlacement {
  classId: 'ss1' | 'ss2' | 'ss3';
  term: 1 | 2 | 3;
  termLabel: 'First Term' | 'Second Term' | 'Third Term';
  nerdcTheme:
    | 'Organization of Life'
    | 'The Organism at Work'
    | 'The Organism & Its Environment'
    | 'Continuity of Life';
  order: number;
  domain: BioDomainId;
  keywords: string[];
}

export const BIO_NERDC_MAP: Record<string, BioNerdcTopicPlacement> = {
  // ─────────────────────────── SS 1 (10 Topics) ───────────────────────────
  'b-org': {
    classId: 'ss1',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Organization of Life',
    order: 1,
    domain: 'cells',
    keywords: ['binomial nomenclature', 'linnaeus', 'monera', 'protista', 'fungi', 'plantae', 'animalia', 'virus', 'levels of organization', 'amoeba', 'euglena'],
  },
  'b-cell': {
    classId: 'ss1',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Organization of Life',
    order: 2,
    domain: 'cells',
    keywords: ['cell theory', 'prokaryote', 'eukaryote', 'mitochondria', 'chloroplast', 'ribosome', 'golgi', 'lysosome', 'magnification', 'microscope'],
  },
  'b-transport-cell': {
    classId: 'ss1',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'The Organism at Work',
    order: 3,
    domain: 'cells',
    keywords: ['diffusion', 'osmosis', 'active transport', 'plasmolysis', 'haemolysis', 'crenation', 'turgidity', 'flaccidity', 'water potential'],
  },
  'b-nutrition': {
    classId: 'ss1',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'The Organism at Work',
    order: 4,
    domain: 'plants',
    keywords: ['photosynthesis', 'chemosynthesis', 'holozoic', 'saprophytic', 'parasitic', 'enzymes', 'biuret', 'benedict', 'iodine', 'sudan iii', 'mineral deficiency'],
  },
  'b-respiration': {
    classId: 'ss1',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'The Organism at Work',
    order: 5,
    domain: 'cells',
    keywords: ['glycolysis', 'krebs cycle', 'atp', 'aerobic', 'anaerobic', 'fermentation', 'lactic acid', 'oxygen debt', 'respiratory quotient'],
  },
  'b-excretion-growth': {
    classId: 'ss1',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'The Organism at Work',
    order: 6,
    domain: 'cells',
    keywords: ['contractile vacuole', 'flame cell', 'nephridium', 'malpighian tubule', 'mitosis', 'sigmoid growth curve', 'auxins', 'phototropism', 'geotropism'],
  },
  'b-skeleton': {
    classId: 'ss1',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Organization of Life',
    order: 7,
    domain: 'physiology',
    keywords: ['chitin', 'cartilage', 'bone', 'axial skeleton', 'appendicular', 'atlas', 'axis', 'thoracic', 'lumbar', 'synovial joint', 'collenchyma', 'sclerenchyma'],
  },
  'b-ecol-concepts': {
    classId: 'ss1',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'The Organism & Its Environment',
    order: 8,
    domain: 'ecology',
    keywords: ['ecosystem', 'biosphere', 'ecological niche', 'habitat', 'mangrove swamp', 'tropical rainforest', 'guinea savanna', 'sudan savanna', 'sahel'],
  },
  'b-trophic': {
    classId: 'ss1',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'The Organism & Its Environment',
    order: 9,
    domain: 'ecology',
    keywords: ['food chain', 'food web', 'trophic level', 'pyramid of energy', 'pyramid of numbers', 'carbon cycle', 'nitrogen cycle', 'nitrosomonas', 'nitrobacter', 'rhizobium'],
  },
  'b-pop-micro': {
    classId: 'ss1',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'The Organism & Its Environment',
    order: 10,
    domain: 'ecology',
    keywords: ['quadrat', 'transect', 'lincoln index', 'capture mark recapture', 'anemometer', 'secchi disc', 'koch postulates', 'pasteurization', 'bacteria', 'fungi'],
  },

  // ─────────────────────────── SS 2 (10 Topics) ───────────────────────────
  'b-digestion': {
    classId: 'ss2',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'The Organism at Work',
    order: 1,
    domain: 'physiology',
    keywords: ['dental formula', 'diastema', 'carnassial teeth', 'ptyalin', 'pepsin', 'rennin', 'trypsin', 'lipase', 'bile', 'emulsification', 'villi', 'lacteal', 'hepatic portal vein'],
  },
  'b-circulatory': {
    classId: 'ss2',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'The Organism at Work',
    order: 2,
    domain: 'physiology',
    keywords: ['double circulation', 'pulmonary artery', 'pulmonary vein', 'bicuspid', 'tricuspid', 'pacemaker', 'sinoatrial node', 'thrombokinase', 'fibrin', 'transpiration', 'potometer', 'translocation'],
  },
  'b-gas-exchange': {
    classId: 'ss2',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'The Organism at Work',
    order: 3,
    domain: 'physiology',
    keywords: ['alveoli', 'diaphragm', 'intercostal muscles', 'oxyhaemoglobin', 'counter-current flow', 'gill filaments', 'spiracles', 'tracheoles', 'stomata', 'lenticels'],
  },
  'b-kidney-liver': {
    classId: 'ss2',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'The Organism at Work',
    order: 4,
    domain: 'physiology',
    keywords: ['nephron', 'bowman capsule', 'glomerulus', 'ultrafiltration', 'selective reabsorption', 'loop of henle', 'antidiuretic hormone', 'adh', 'deamination', 'ornithine cycle'],
  },
  'b-homeostasis-skin': {
    classId: 'ss2',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'The Organism at Work',
    order: 5,
    domain: 'physiology',
    keywords: ['vasodilation', 'vasoconstriction', 'sebaceous gland', 'sweat gland', 'malpighian layer', 'insulin', 'glucagon', 'islets of langerhans', 'thyroxine', 'adrenaline', 'pituitary'],
  },
  'b-nervous': {
    classId: 'ss2',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'The Organism at Work',
    order: 6,
    domain: 'physiology',
    keywords: ['sensory neurone', 'motor neurone', 'relay neurone', 'myelin sheath', 'nodes of ranvier', 'synapse', 'acetylcholine', 'reflex arc', 'cerebrum', 'cerebellum', 'medulla oblongata', 'hypothalamus'],
  },
  'b-sense-organs': {
    classId: 'ss2',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'The Organism at Work',
    order: 7,
    domain: 'physiology',
    keywords: ['cornea', 'iris', 'ciliary muscle', 'suspensory ligament', 'accommodation', 'rods', 'cones', 'fovea', 'myopia', 'hypermetropia', 'astigmatism', 'ossicles', 'cochlea', 'semicircular canals'],
  },
  'b-aquatic-terrestrial': {
    classId: 'ss2',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'The Organism & Its Environment',
    order: 8,
    domain: 'ecology',
    keywords: ['marine habitat', 'estuarine', 'freshwater', 'xerophytes', 'hydrophytes', 'mesophytes', 'halophytes', 'pneumatophores', 'primary succession', 'secondary succession', 'climax community'],
  },
  'b-pollution-cons': {
    classId: 'ss2',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'The Organism & Its Environment',
    order: 9,
    domain: 'ecology',
    keywords: ['eutrophication', 'biochemical oxygen demand', 'bod', 'carbon monoxide', 'carboxyhaemoglobin', 'cfc', 'ozone', 'greenhouse', 'yankari', 'borgu', 'biological control'],
  },
  'b-flower-pollination': {
    classId: 'ss2',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Continuity of Life',
    order: 10,
    domain: 'plants',
    keywords: ['calyx', 'corolla', 'androecium', 'gynoecium', 'placentation', 'entomophilous', 'anemophilous', 'double fertilization', 'endosperm', 'epigeal', 'hypogeal', 'seed dispersal'],
  },

  // ─────────────────────────── SS 3 (10 Topics) ───────────────────────────
  'b-mammalian-repro': {
    classId: 'ss3',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Continuity of Life',
    order: 1,
    domain: 'physiology',
    keywords: ['seminiferous tubules', 'epididymis', 'acrosome', 'fallopian tube', 'oviduct', 'fsh', 'lh', 'oestrogen', 'progesterone', 'corpus luteum', 'placenta', 'amnion'],
  },
  'b-mendel': {
    classId: 'ss3',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Continuity of Life',
    order: 2,
    domain: 'genetics',
    keywords: ['law of segregation', 'independent assortment', 'monohybrid', 'dihybrid', 'test cross', 'back cross', 'incomplete dominance', 'codominance', 'punnett square'],
  },
  'b-sex-linkage': {
    classId: 'ss3',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Continuity of Life',
    order: 3,
    domain: 'genetics',
    keywords: ['sex-linked', 'haemophilia', 'red-green colour blindness', 'abo blood group', 'universal donor', 'universal recipient', 'rhesus factor', 'sickle cell anaemia', 'heterozygote advantage'],
  },
  'b-dna-biotech': {
    classId: 'ss3',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Continuity of Life',
    order: 4,
    domain: 'genetics',
    keywords: ['nucleotide', 'chargaff', 'watson and crick', 'semiconservative replication', 'transcription', 'translation', 'mrna', 'trna', 'meiosis', 'crossing over', 'chiasmata', 'recombinant insulin'],
  },
  'b-variation': {
    classId: 'ss3',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Continuity of Life',
    order: 5,
    domain: 'genetics',
    keywords: ['continuous variation', 'discontinuous variation', 'morphological', 'physiological', 'tongue rolling', 'fingerprints', 'arch', 'loop', 'whorl', 'mutation', 'polyploidy', 'down syndrome'],
  },
  'b-adaptation': {
    classId: 'ss3',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Continuity of Life',
    order: 6,
    domain: 'ecology',
    keywords: ['cryptic colouration', 'warning colouration', 'batesian mimicry', 'countershading', 'aestivation', 'hibernation', 'social insects', 'termites', 'honeybees', 'waggle dance', 'courtship'],
  },
  'b-evolution': {
    classId: 'ss3',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Continuity of Life',
    order: 7,
    domain: 'genetics',
    keywords: ['lamarck', 'use and disuse', 'darwin', 'natural selection', 'homologous structures', 'pentadactyl limb', 'analogous', 'vestigial organs', 'industrial melanism', 'peppered moth'],
  },
  'b-plant-anatomy': {
    classId: 'ss3',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Organization of Life',
    order: 8,
    domain: 'plants',
    keywords: ['dicot stem', 'monocot stem', 'dicot root', 'vascular cambium', 'casparian strip', 'endodermis', 'palisade mesophyll', 'spongy mesophyll', 'guard cells', 'annual rings'],
  },
  'b-soil-agric': {
    classId: 'ss3',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'The Organism & Its Environment',
    order: 9,
    domain: 'plants',
    keywords: ['sandy soil', 'clay soil', 'loamy soil', 'capillarity', 'porosity', 'water retention', 'humus', 'crop rotation', 'legumes', 'mycorrhiza', 'eutrophication'],
  },
  'b-public-health': {
    classId: 'ss3',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'The Organism & Its Environment',
    order: 10,
    domain: 'ecology',
    keywords: ['plasmodium', 'female anopheles', 'schistosoma', 'bulinus snail', 'onchocerca volvulus', 'simulium blackfly', 'trypanosoma', 'glossina tsetse', 'active immunity', 'passive immunity', 'vaccines'],
  },
};

export function getBioClassMeta(classId?: ChemClassId): ChemClassMeta {
  return BIO_CLASSES.find((c) => c.id === (classId || 'all')) || BIO_CLASSES[3];
}

export function filterBioTopicsByClass(topics: Topic[], classId?: ChemClassId): Topic[] {
  if (!classId || classId === 'all') return topics;
  return topics
    .filter((t) => BIO_NERDC_MAP[t.id]?.classId === classId)
    .sort((a, b) => (BIO_NERDC_MAP[a.id]?.order ?? 99) - (BIO_NERDC_MAP[b.id]?.order ?? 99));
}
