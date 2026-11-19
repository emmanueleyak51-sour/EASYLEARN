import type { ChemClassId, Topic } from '../types';
import type { ChemClassMeta } from './chemNerdc2027';

export const CIVIC_CLASSES: ChemClassMeta[] = [
  {
    id: 'ss1',
    label: 'SS 1',
    shortLabel: 'SS 1',
    fullTitle: 'SS 1 Civic Education',
    kicker: 'NERDC Year 1 · National Values, Citizenship, Pillars of Democracy, Federalism & UDHR',
    description:
      'Integrity, honesty, selflessness & community service, public health & anti-stigma awareness, youth empowerment, citizenship acquisition & duties, representative democracy, rule of law, federalism, UDHR (1948) & orderliness.',
  },
  {
    id: 'ss2',
    label: 'SS 2',
    shortLabel: 'SS 2',
    fullTitle: 'SS 2 Civic Education',
    kicker: 'NERDC Year 2 · National Consciousness, Political Participation, Rights Limits, Safety & Peace',
    description:
      'National consciousness & symbols, capitalist democracy, political apathy, popular participation, lawful limitations on human rights, NDLEA/NAFDAC substance enforcement, responsible parenthood, FRSC road regulations & conflict resolution.',
  },
  {
    id: 'ss3',
    label: 'SS 3',
    shortLabel: 'SS 3',
    fullTitle: 'SS 3 Civic Education',
    kicker: 'NERDC Year 3 · Human Rights Generations, Public Service, CSOs, Elections, Anti-Corruption & ADR',
    description:
      'Generations of human rights, public service neutrality & Ombudsman (PCC), civil society organizations, electoral integrity (INEC), constitutional democracy, NAPTIP anti-trafficking, ICPC/EFCC/CCB accountability, national integration & ADR.',
  },
  {
    id: 'all',
    label: 'All Classes',
    shortLabel: 'All Classes',
    fullTitle: 'Complete Civic Education (SS1–SS3 National Curriculum)',
    kicker: 'All-Round National Curriculum · 30 Topics',
    description:
      'Complete Nigerian NERDC SS1–SS3 Civic Education curriculum covering national ethics, constitutional law, human rights, democratic governance, public service accountability, civic safety & peaceful dispute resolution.',
  },
];

export type CivicDomainId = 'values' | 'citizenship' | 'democracy' | 'rights' | 'governance';

export interface CivicNerdcTopicPlacement {
  classId: 'ss1' | 'ss2' | 'ss3';
  term: 1 | 2 | 3;
  termLabel: 'First Term' | 'Second Term' | 'Third Term';
  nerdcTheme:
    | 'National Values, Ethics & Community Service'
    | 'Citizenship, National Consciousness & Integration'
    | 'Democracy, Constitutionalism & Participation'
    | 'Human Rights, Rule of Law & Dispute Resolution'
    | 'Public Institutions, Civic Safety & Accountability';
  order: number;
  domain: CivicDomainId;
  keywords: string[];
}

export const CIVIC_NERDC_MAP: Record<string, CivicNerdcTopicPlacement> = {
  // ─────────────────────────── SS 1 (10 Topics) ───────────────────────────
  'cv-values': {
    classId: 'ss1',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'National Values, Ethics & Community Service',
    order: 1,
    domain: 'values',
    keywords: ['integrity', 'probity', 'honesty', 'contentment', 'discipline', 'fair play', 'moral compass', 'social trust'],
  },
  'cv-selflessness': {
    classId: 'ss1',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'National Values, Ethics & Community Service',
    order: 2,
    domain: 'values',
    keywords: ['selflessness', 'altruism', 'distributive justice', 'procedural justice', 'moral courage', 'volunteerism', 'community development'],
  },
  'cv-hiv': {
    classId: 'ss1',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Public Institutions, Civic Safety & Accountability',
    order: 3,
    domain: 'governance',
    keywords: ['hiv', 'aids', 'cd4 t-lymphocytes', 'antiretroviral therapy', 'pmtct', 'stigma', 'anti-discrimination act 2014', 'naca'],
  },
  'cv-youth': {
    classId: 'ss1',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'National Values, Ethics & Community Service',
    order: 4,
    domain: 'values',
    keywords: ['youth empowerment', 'life coping skills', 'manipulative skills', 'intellectual skills', 'communicative skills', 'artistic skills', 'nde', 'entrepreneurship'],
  },
  'cv-citizenship': {
    classId: 'ss1',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Citizenship, National Consciousness & Integration',
    order: 5,
    domain: 'citizenship',
    keywords: ['citizenship by birth', 'registration', 'naturalization', 'jus sanguinis', 'jus soli', 'dual citizenship', 'rights', 'duties', 'obligations'],
  },
  'cv-democracy': {
    classId: 'ss1',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Democracy, Constitutionalism & Participation',
    order: 6,
    domain: 'democracy',
    keywords: ['demos', 'kratos', 'direct democracy', 'indirect representative democracy', 'periodic elections', 'majority rule', 'minority rights', 'universal adult suffrage'],
  },
  'cv-pillars': {
    classId: 'ss1',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Democracy, Constitutionalism & Participation',
    order: 7,
    domain: 'democracy',
    keywords: ['constitution', 'legislature', 'executive', 'judiciary', 'separation of powers', 'montesquieu', 'rule of law', 'av dicey', 'supremacy', 'equality before law'],
  },
  'cv-federalism': {
    classId: 'ss1',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Democracy, Constitutionalism & Participation',
    order: 8,
    domain: 'democracy',
    keywords: ['federalism', 'exclusive legislative list', 'concurrent legislative list', 'residual list', 'bicameralism', 'senate', 'house of representatives', 'local government autonomy'],
  },
  'cv-udhr': {
    classId: 'ss1',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Human Rights, Rule of Law & Dispute Resolution',
    order: 9,
    domain: 'rights',
    keywords: ['udhr 1948', '10 december', 'eleanor roosevelt', '30 articles', 'seven core freedoms', 'inalienable rights', 'chapter iv 1999 constitution'],
  },
  'cv-cultism': {
    classId: 'ss1',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'National Values, Ethics & Community Service',
    order: 10,
    domain: 'values',
    keywords: ['orderliness', 'queuing culture', 'decorum', 'constituted authority', 'max weber', 'traditional', 'charismatic', 'legal-rational', 'secret cults', 'peer pressure'],
  },

  // ─────────────────────────── SS 2 (10 Topics) ───────────────────────────
  'cv-cit-ed': {
    classId: 'ss2',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Citizenship, National Consciousness & Integration',
    order: 1,
    domain: 'citizenship',
    keywords: ['citizenship education', 'national consciousness', 'coat of arms', 'national flag taiwo akinkunmi', 'mace', 'national passport', 'patriotism', 'sectionalism'],
  },
  'cv-cap-dem': {
    classId: 'ss2',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Democracy, Constitutionalism & Participation',
    order: 2,
    domain: 'democracy',
    keywords: ['capitalist democracy', 'mixed economy', 'multi-party competition', 'private property', 'consumer sovereignty', 'manifesto', 'social safety nets'],
  },
  'cv-apathy': {
    classId: 'ss2',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Democracy, Constitutionalism & Participation',
    order: 3,
    domain: 'democracy',
    keywords: ['political apathy', 'voter abstention', 'unfulfilled promises', 'electoral violence', 'godfatherism', 'bad governance', 'civic voter education'],
  },
  'cv-participation': {
    classId: 'ss2',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Democracy, Constitutionalism & Participation',
    order: 4,
    domain: 'democracy',
    keywords: ['popular participation', 'traditional face-to-face', 'modern digital civic engagement', 'public hearings', 'petitions', 'recall', 'referendum'],
  },
  'cv-hr-limits': {
    classId: 'ss2',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Human Rights, Rule of Law & Dispute Resolution',
    order: 5,
    domain: 'rights',
    keywords: ['state of emergency', 'curfew', 'libel', 'slander', 'defamation', 'quarantine', 'compulsory acquisition compensation', 'extradition', 'lawful detention'],
  },
  'cv-drugs': {
    classId: 'ss2',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Public Institutions, Civic Safety & Accountability',
    order: 6,
    domain: 'governance',
    keywords: ['drug abuse', 'self-medication', 'dependency', 'ndlea', 'nafdac', 'counterfeit medicines', 'rehabilitation', 'psychotropic substances'],
  },
  'cv-parenthood': {
    classId: 'ss2',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'National Values, Ethics & Community Service',
    order: 7,
    domain: 'values',
    keywords: ['responsible parenthood', 'primary socialization', 'child rights act', 'immunization', 'moral guidance', 'juvenile delinquency', 'family planning'],
  },
  'cv-traffic': {
    classId: 'ss2',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Public Institutions, Civic Safety & Accountability',
    order: 8,
    domain: 'governance',
    keywords: ['traffic regulations', 'regulatory signs circular', 'warning signs triangular', 'informative signs rectangular', 'frsc 1988', 'vio', 'zebra crossing', 'speed limits'],
  },
  'cv-interpersonal': {
    classId: 'ss2',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'National Values, Ethics & Community Service',
    order: 9,
    domain: 'values',
    keywords: ['interpersonal relationships', 'platonic', 'peer', 'family', 'civic workplace', 'george levinger stages', 'active listening', 'empathy', 'tolerance'],
  },
  'cv-intercommunal': {
    classId: 'ss2',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Citizenship, National Consciousness & Integration',
    order: 10,
    domain: 'citizenship',
    keywords: ['inter-communal relationships', 'boundary disputes', 'resource sharing', 'dialogue', 'mediation', 'conciliation', 'arbitration', 'peacebuilding'],
  },

  // ─────────────────────────── SS 3 (10 Topics) ───────────────────────────
  'cv-hr-cat': {
    classId: 'ss3',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Human Rights, Rule of Law & Dispute Resolution',
    order: 1,
    domain: 'rights',
    keywords: ['karel vasak', 'first generation civil political', 'second generation socio-economic cultural', 'third generation solidarity environmental', 'justiciability', 'chapter ii vs chapter iv'],
  },
  'cv-public-service': {
    classId: 'ss3',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Public Institutions, Civic Safety & Accountability',
    order: 2,
    domain: 'governance',
    keywords: ['public service', 'civil service', 'political neutrality', 'anonymity', 'permanence', 'meritocracy', 'red tapism', 'public complaints commission', 'ombudsman', 'servicom'],
  },
  'cv-civil-society': {
    classId: 'ss3',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Democracy, Constitutionalism & Participation',
    order: 3,
    domain: 'democracy',
    keywords: ['civil society organizations', 'non-partisan', 'election observation', 'whistleblowing', 'foi act 2011', 'donor dependency', 'human rights advocacy'],
  },
  'cv-elections': {
    classId: 'ss3',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Democracy, Constitutionalism & Participation',
    order: 4,
    domain: 'democracy',
    keywords: ['free and fair elections', 'secret ballot', 'inec', 'bvas', 'irev', 'electoral act', 'delimitation', 'returning officer', 'election tribunal'],
  },
  'cv-const-dem': {
    classId: 'ss3',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Democracy, Constitutionalism & Participation',
    order: 5,
    domain: 'democracy',
    keywords: ['constitutional democracy', 'written vs unwritten', 'rigid vs flexible', 'checks and balances', 'impeachment', 'veto override', 'judicial review', 'ultra vires'],
  },
  'cv-trafficking': {
    classId: 'ss3',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Public Institutions, Civic Safety & Accountability',
    order: 6,
    domain: 'governance',
    keywords: ['human trafficking', 'forced labour', 'debt bondage', 'organ harvesting', 'naptip 2003', 'palermo protocol', 'victim shelter', 'reintegration'],
  },
  'cv-corruption': {
    classId: 'ss3',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Public Institutions, Civic Safety & Accountability',
    order: 7,
    domain: 'governance',
    keywords: ['icpc 2000', 'efcc 2004', 'code of conduct bureau', 'code of conduct tribunal', 'asset declaration', 'money laundering', 'procurement transparency', 'nepotism'],
  },
  'cv-integration': {
    classId: 'ss3',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Citizenship, National Consciousness & Integration',
    order: 8,
    domain: 'citizenship',
    keywords: ['national integration', 'nysc 1973', 'unity schools', 'federal character commission', 'section 14(3)', 'inter-ethnic harmony', 'pluralism'],
  },
  'cv-civic-duties': {
    classId: 'ss3',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Citizenship, National Consciousness & Integration',
    order: 9,
    domain: 'citizenship',
    keywords: ['direct tax paye', 'indirect tax vat', 'tax evasion', 'tax avoidance', 'public infrastructure protection', 'fccpc consumer rights', 'son', 'environmental sanitation'],
  },
  'cv-rule-adr': {
    classId: 'ss3',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Human Rights, Rule of Law & Dispute Resolution',
    order: 10,
    domain: 'rights',
    keywords: ['due process', 'habeas corpus', 'presumption of innocence', 'audi alteram partem', 'nemo judex in causa sua', 'legal aid council', 'multi-door courthouse', 'adr'],
  },
};

export function getCivicClassMeta(classId?: ChemClassId): ChemClassMeta {
  return CIVIC_CLASSES.find((c) => c.id === (classId || 'all')) || CIVIC_CLASSES[3];
}

export function filterCivicTopicsByClass(topics: Topic[], classId?: ChemClassId): Topic[] {
  if (!classId || classId === 'all') return topics;
  return topics
    .filter((t) => CIVIC_NERDC_MAP[t.id]?.classId === classId)
    .sort((a, b) => (CIVIC_NERDC_MAP[a.id]?.order ?? 99) - (CIVIC_NERDC_MAP[b.id]?.order ?? 99));
}
