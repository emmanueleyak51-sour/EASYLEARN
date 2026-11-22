import type { SubjectId } from '../types';

export type SubjectStudioKind =
  | 'bible'
  | 'quran'
  | 'music'
  | 'art'
  | 'accounting'
  | 'business'
  | 'constitution'
  | 'literature'
  | 'history'
  | 'language'
  | 'computing'
  | 'phe'
  | 'kitchen'
  | 'construction'
  | 'electrical'
  | 'livestock'
  | 'vocational';

export interface SubjectStudioMeta {
  kind: SubjectStudioKind;
  title: string;
  subtitle: string;
  badge: string;
  icon: string;
}

/**
 * Companion interactive studio for every non-science-lab subject so every subject
 * has a practical, hands-on study tool right alongside its syllabus lessons.
 */
export const SUBJECT_STUDIO_META: Partial<Record<SubjectId, SubjectStudioMeta>> = {
  crs: {
    kind: 'bible',
    title: 'Study Bible (12 versions)',
    subtitle: 'Read RSV, KJV, NKJV, GNT (Good News), NLT, AMP, ESV, MSG & more side by side',
    badge: '12 versions',
    icon: 'book',
  },
  irs: {
    kind: 'quran',
    title: 'Study Qur’an & Hadith',
    subtitle: 'Read 5 Qur’an editions plus An-Nawawi Hadith cards',
    badge: '5 editions',
    icon: 'books',
  },
  music: {
    kind: 'music',
    title: 'Piano & Music Theory Studio',
    subtitle: 'Playable keyboard, chords, scales & Nigerian instruments',
    badge: 'Interactive audio',
    icon: 'vol',
  },
  art: {
    kind: 'art',
    title: 'Colour Wheel & Art Atlas',
    subtitle: 'Live colour harmony mixer & Nigerian art traditions',
    badge: 'Visual studio',
    icon: 'palette',
  },
  acct: {
    kind: 'accounting',
    title: 'Ledger & Trial Balance Lab',
    subtitle: 'Post Dr/Cr entries, balance accounts & calculate depreciation',
    badge: 'Workbench',
    icon: 'sigma',
  },
  bookkeep: {
    kind: 'accounting',
    title: 'Bookkeeping Ledger Workbench',
    subtitle: 'Practice double-entry Dr/Cr, Trial Balance & depreciation',
    badge: 'Workbench',
    icon: 'sigma',
  },
  comm: {
    kind: 'business',
    title: 'Trade & Profit Calculator',
    subtitle: 'Mark-up vs margin, break-even, insurance & stock levels',
    badge: 'Business tool',
    icon: 'chart',
  },
  marketing: {
    kind: 'business',
    title: 'Pricing & Break-Even Studio',
    subtitle: 'Compute margins, break-even units & 4Ps strategy check',
    badge: 'Business tool',
    icon: 'chart',
  },
  insurance: {
    kind: 'business',
    title: 'Claims & Average Clause Lab',
    subtitle: 'Calculate under-insurance claims, indemnity & risk terms',
    badge: 'Claims lab',
    icon: 'shield',
  },
  storemgt: {
    kind: 'business',
    title: 'Stock Control & Re-Order Lab',
    subtitle: 'Compute re-order level, min/max stock & FIFO valuation',
    badge: 'Stock lab',
    icon: 'grid',
  },
  officeprac: {
    kind: 'business',
    title: 'Office & Petty Cash Desk',
    subtitle: 'Imprest petty cash, trade discounts & filing systems guide',
    badge: 'Office desk',
    icon: 'pen',
  },
  govt: {
    kind: 'constitution',
    title: 'Constitution & Republics Atlas',
    subtitle: 'Explore Nigeria’s 1999 Constitution, rights & 4 republics',
    badge: 'Civic atlas',
    icon: 'scales',
  },
  civic: {
    kind: 'constitution',
    title: 'Rights & Constitution Explorer',
    subtitle: 'Search Chapter IV rights, duties & federal powers',
    badge: 'Civic atlas',
    icon: 'scales',
  },
  lit: {
    kind: 'literature',
    title: 'Unseen Poetry & Device Spotter',
    subtitle: 'Practise spotting figures of speech on original verses',
    badge: 'Reading lab',
    icon: 'pen',
  },
  hist: {
    kind: 'history',
    title: 'Nigerian History Timeline Atlas',
    subtitle: 'Filter pre-colonial kingdoms, empires & independence milestones',
    badge: 'Timeline',
    icon: 'map',
  },
  hausa: {
    kind: 'language',
    title: 'Hausa Phrase & Tone Studio',
    subtitle: 'Greetings, boko sounds, numbers & Hausa proverbs',
    badge: 'Language lab',
    icon: 'chat',
  },
  igbo: {
    kind: 'language',
    title: 'Igbo Orthography & Tone Studio',
    subtitle: 'Vowel harmony (ụdaume), greetings, numbers & ilu proverbs',
    badge: 'Language lab',
    icon: 'chat',
  },
  yoruba: {
    kind: 'language',
    title: 'Yoruba Tone & Owe Studio',
    subtitle: 'Do-Re-Mi tone marks, greetings, vigesimal numbers & proverbs',
    badge: 'Language lab',
    icon: 'chat',
  },
  french: {
    kind: 'language',
    title: 'French Conjugation & Phrase Lab',
    subtitle: 'Key verbs, everyday dialogues, gender & exam idioms',
    badge: 'Language lab',
    icon: 'chat',
  },
  arabic: {
    kind: 'language',
    title: 'Arabic Script & Phrase Studio',
    subtitle: 'Right-to-left phrases, grammar roots & vocabulary cards',
    badge: 'Language lab',
    icon: 'chat',
  },
  comp: {
    kind: 'computing',
    title: 'Binary & Logic Gate Bench',
    subtitle: 'Convert Bin/Oct/Dec/Hex & test live logic gate circuits',
    badge: 'Digital bench',
    icon: 'cpu',
  },
  phe: {
    kind: 'phe',
    title: 'Fitness, BMI & Courts Studio',
    subtitle: 'Calculate BMI, heart-rate zones & pitch dimensions',
    badge: 'Sports lab',
    icon: 'flame',
  },
  homeec: {
    kind: 'kitchen',
    title: 'Kitchen & Nutrition Converter',
    subtitle: 'Oven °C/°F/Gas Mark, food cost & vitamin deficiency guide',
    badge: 'Home studio',
    icon: 'home',
  },
  foodnut: {
    kind: 'kitchen',
    title: 'Nutrition & Oven Temp Studio',
    subtitle: 'Check vitamins, minerals, oven temperatures & meal ratios',
    badge: 'Nutrition lab',
    icon: 'home',
  },
  homemgt: {
    kind: 'kitchen',
    title: 'Household Budget & Care Studio',
    subtitle: 'Plan family budgets, kitchen temperatures & care labels',
    badge: 'Home studio',
    icon: 'home',
  },
  catering: {
    kind: 'kitchen',
    title: 'Catering Cost & HACCP Studio',
    subtitle: 'Oven Gas Marks, dish costing & colour-coded chopping boards',
    badge: 'Kitchen lab',
    icon: 'home',
  },
  techdraw: {
    kind: 'construction',
    title: 'Scale Drawing & Material Lab',
    subtitle: 'Convert architectural scales, 3-4-5 square & block counts',
    badge: 'Drawing lab',
    icon: 'pen',
  },
  carpentry: {
    kind: 'construction',
    title: 'Timber & Joinery Estimator',
    subtitle: 'Scale converter, board measures & common wood joints',
    badge: 'Workshop',
    icon: 'grid',
  },
  blocklay: {
    kind: 'construction',
    title: 'Blockwork & Concrete Estimator',
    subtitle: 'Estimate sandcrete blocks, mortar bags & 1:2:4 concrete mix',
    badge: 'Site lab',
    icon: 'grid',
  },
  elecinst: {
    kind: 'electrical',
    title: 'Circuit, Ohm’s Law & Fuse Lab',
    subtitle: 'Calculate current/power, choose fuses & decode resistors',
    badge: 'Wiring lab',
    icon: 'bolt',
  },
  automech: {
    kind: 'electrical',
    title: 'Auto Fault & Electrical Bench',
    subtitle: 'Diagnose engine symptoms, battery voltage & Ohm’s Law',
    badge: 'Auto bench',
    icon: 'bolt',
  },
  gsm: {
    kind: 'electrical',
    title: 'Phone Fault & Circuit Bench',
    subtitle: 'Trace charging/power faults, Ohm’s Law & SMD resistors',
    badge: 'Repair bench',
    icon: 'bolt',
  },
  animalhusb: {
    kind: 'livestock',
    title: 'Livestock FCR & Breeding Lab',
    subtitle: 'Calculate feed conversion ratio, gestation & brooding heat',
    badge: 'Farm studio',
    icon: 'leaf',
  },
  fisheries: {
    kind: 'livestock',
    title: 'Catfish Pond & FCR Studio',
    subtitle: 'Stocking density, feed conversion & pond water pH/DO guide',
    badge: 'Pond studio',
    icon: 'leaf',
  },
  garment: {
    kind: 'vocational',
    title: 'Fabric & Pattern Calculator',
    subtitle: 'Estimate yardage, seam allowances & fabric care symbols',
    badge: 'Sewing studio',
    icon: 'pen',
  },
  photo: {
    kind: 'vocational',
    title: 'Exposure Triangle Simulator',
    subtitle: 'Balance aperture, shutter speed & ISO for sharp photos',
    badge: 'Camera studio',
    icon: 'eye',
  },
  cosmet: {
    kind: 'vocational',
    title: 'Skin, Hair pH & Hygiene Desk',
    subtitle: 'Check product pH scale, skin types & salon sterilisation',
    badge: 'Salon desk',
    icon: 'star',
  },
  tourism: {
    kind: 'vocational',
    title: 'Nigeria Destinations & Tour Desk',
    subtitle: 'Explore heritage sites & calculate group tour package prices',
    badge: 'Travel desk',
    icon: 'globe',
  },
};

export function hasSubjectStudio(subj: SubjectId): boolean {
  return Boolean(SUBJECT_STUDIO_META[subj]);
}

/** Subjects that have dedicated formula sheets or English grammar rule sheets. */
export const FORMULA_SHEET_SUBJECTS: ReadonlySet<SubjectId> = new Set<SubjectId>([
  'maths',
  'chem',
  'phys',
  'fmaths',
  'geog',
  'econ',
  'eng',
  'digitech',
  'dataproc',
]);

export function hasFormulaSheet(subj: SubjectId): boolean {
  return FORMULA_SHEET_SUBJECTS.has(subj);
}
