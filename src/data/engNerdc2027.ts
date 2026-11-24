import type { ChemClassId, Topic } from '../types';

export type EngDomainId = 'oral' | 'lexis' | 'grammar' | 'comp' | 'writing';

export interface EngClassMeta {
  id: ChemClassId;
  label: string;
  shortLabel: string;
  fullTitle: string;
  kicker: string;
  description: string;
}

export const ENG_CLASSES: EngClassMeta[] = [
  {
    id: 'ss1',
    label: 'SS 1',
    shortLabel: 'SS 1',
    fullTitle: 'SS 1 English Language',
    kicker: 'NERDC Year 1 · Sounds, Core Grammar & Letters',
    description:
      'Pure vowels, diphthongs, nouns & pronoun case, verb tenses, the 12 laws of concord, royal adjective order, prepositions, synonyms/antonyms, punctuation, literal comprehension & informal letters.',
  },
  {
    id: 'ss2',
    label: 'SS 2',
    shortLabel: 'SS 2',
    fullTitle: 'SS 2 English Language',
    kicker: 'NERDC Year 2 · Stress, Clauses, Registers & Summary',
    description:
      'Consonants & silent letters, word stress rules, grammatical names & functions of phrases and clauses, modals & question tags, active/passive & reported speech, conditionals/subjunctive, registers, idioms, formal letters & summary pruning.',
  },
  {
    id: 'ss3',
    label: 'SS 3',
    shortLabel: 'SS 3',
    fullTitle: 'SS 3 English Language',
    kicker: 'NERDC Year 3 · Emphatic Stress, Rhetoric & JAMB Novels',
    description:
      'Emphatic stress & intonation tunes, rhymes & syllable clusters, cloze cohesion, dangling modifiers & parallelism, figures of speech, critical inference, argumentative essays, Nigerian usage traps, and JAMB prescribed novels (The Lekki Headmaster & The Life Changer).',
  },
  {
    id: 'all',
    label: 'All Classes',
    shortLabel: 'All',
    fullTitle: 'Complete English Language (SS1–SS3)',
    kicker: 'National Curriculum · 34 Topics + JAMB Novels',
    description:
      'Complete Nigerian NERDC SS1–SS3 English Language curriculum covering oral English, grammar, lexis, comprehension, summary, composition, and official JAMB UTME prescribed novels.',
  },
];

export function getEngClassMeta(cls?: ChemClassId): EngClassMeta {
  return ENG_CLASSES.find((c) => c.id === (cls || 'all')) || ENG_CLASSES[3];
}

export interface EngNerdcTopicPlacement {
  classId: 'ss1' | 'ss2' | 'ss3';
  term: 1 | 2 | 3;
  termLabel: 'First Term' | 'Second Term' | 'Third Term';
  nerdcTheme:
    | 'Oral English / Spoken English'
    | 'Vocabulary & Lexis'
    | 'English Grammar & Structure'
    | 'Reading Comprehension & Summary'
    | 'Continuous Writing & Rhetoric';
  order: number;
  domain: EngDomainId;
  keywords: string[];
}

export const ENG_NERDC_MAP: Record<string, EngNerdcTopicPlacement> = {
  // ─────────────────────────── SS 1 (11 Topics) ───────────────────────────
  'e-vowels': {
    classId: 'ss1',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Oral English / Spoken English',
    order: 1,
    domain: 'oral',
    keywords: ['pure vowels', 'monophthongs', 'schwa', 'short vowels', 'long vowels', 'phonetics', 'ipa', 'vowel sounds'],
  },
  'e-diphthongs': {
    classId: 'ss1',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Oral English / Spoken English',
    order: 2,
    domain: 'oral',
    keywords: ['diphthongs', 'triphthongs', 'gliding vowels', 'closing diphthongs', 'centring diphthongs', 'oral english'],
  },
  'e-nouns': {
    classId: 'ss1',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'English Grammar & Structure',
    order: 3,
    domain: 'grammar',
    keywords: ['nouns', 'uncountable nouns', 'pronouns', 'pronoun case', 'reflexive', 'possessive', 'collective nouns', 'equipment', 'furniture', 'information'],
  },
  'e-verbs': {
    classId: 'ss1',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'English Grammar & Structure',
    order: 4,
    domain: 'grammar',
    keywords: ['verbs', 'tense', 'aspect', 'present perfect', 'past perfect', 'stative verbs', 'irregular verbs', 'sequence of tenses'],
  },
  'e-concord': {
    classId: 'ss1',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'English Grammar & Structure',
    order: 5,
    domain: 'grammar',
    keywords: ['concord', 'subject verb agreement', 'proximity concord', 'notional concord', 'as well as', 'together with', 'neither nor', 'each', 'many a'],
  },
  'e-adj-adv': {
    classId: 'ss1',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'English Grammar & Structure',
    order: 6,
    domain: 'grammar',
    keywords: ['adjectives', 'adverbs', 'osascomp', 'order of adjectives', 'comparatives', 'superlatives', 'hardly', 'scarcely'],
  },
  'e-prep': {
    classId: 'ss1',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'English Grammar & Structure',
    order: 7,
    domain: 'grammar',
    keywords: ['prepositions', 'conjunctions', 'collocations', 'correlative conjunctions', 'prefer to', 'comprise', 'accused of', 'congratulate on'],
  },
  'e-lexis-syn': {
    classId: 'ss1',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Vocabulary & Lexis',
    order: 8,
    domain: 'lexis',
    keywords: ['synonyms', 'antonyms', 'nearest in meaning', 'opposite in meaning', 'affixes', 'prefixes', 'suffixes', 'homonyms', 'malapropism'],
  },
  'e-mechanics': {
    classId: 'ss1',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'English Grammar & Structure',
    order: 9,
    domain: 'writing',
    keywords: ['punctuation', 'apostrophe', 'semicolon', 'colon', 'hyphen', 'capitalisation', 'spelling', 'accommodation', 'privilege', 'occurence'],
  },
  'e-comp-lit': {
    classId: 'ss1',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Reading Comprehension & Summary',
    order: 10,
    domain: 'comp',
    keywords: ['comprehension', 'main idea', 'topic sentence', 'author tone', 'contextual vocabulary', 'scanning', 'skimming'],
  },
  'e-informal-let': {
    classId: 'ss1',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Continuous Writing & Rhetoric',
    order: 11,
    domain: 'writing',
    keywords: ['informal letter', 'semi-formal letter', 'salutation', 'subscription', 'yours sincerely', 'friendly letter'],
  },

  // ─────────────────────────── SS 2 (11 Topics) ───────────────────────────
  'e-consonants': {
    classId: 'ss2',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Oral English / Spoken English',
    order: 1,
    domain: 'oral',
    keywords: ['consonants', 'voiced', 'voiceless', 'fricatives', 'plosives', 'affricates', 'nasals', 'silent letters', 'past tense ed'],
  },
  'e-stress': {
    classId: 'ss2',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Oral English / Spoken English',
    order: 2,
    domain: 'oral',
    keywords: ['word stress', 'primary stress', 'syllable stress', 'noun verb shift', 'ion', 'ic', 'ity', 'ate', 'polysyllabic stress'],
  },
  'e-phrases': {
    classId: 'ss2',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'English Grammar & Structure',
    order: 3,
    domain: 'grammar',
    keywords: ['grammatical name', 'grammatical function', 'noun phrase', 'adjectival phrase', 'adverbial phrase', 'prepositional phrase', 'gerund', 'infinitive'],
  },
  'e-clauses': {
    classId: 'ss2',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'English Grammar & Structure',
    order: 4,
    domain: 'grammar',
    keywords: ['noun clause', 'adjectival clause', 'relative clause', 'adverbial clause', 'simple', 'compound', 'complex sentence', 'finite verb'],
  },
  'e-modals-tags': {
    classId: 'ss2',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'English Grammar & Structure',
    order: 5,
    domain: 'grammar',
    keywords: ['modal auxiliaries', 'question tags', 'shall we', 'aren’t i', 'hardly', 'little', 'used to', 'need', 'dare', 'ought to'],
  },
  'e-voice-speech': {
    classId: 'ss2',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'English Grammar & Structure',
    order: 6,
    domain: 'grammar',
    keywords: ['active voice', 'passive voice', 'direct speech', 'indirect speech', 'reported speech', 'backshift', 'deictic shift'],
  },
  'e-conditionals': {
    classId: 'ss2',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'English Grammar & Structure',
    order: 7,
    domain: 'grammar',
    keywords: ['conditionals', 'zero', 'first', 'second', 'third conditional', 'subjunctive', 'it is high time', 'if i were', 'had i known', 'would rather'],
  },
  'e-registers': {
    classId: 'ss2',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Vocabulary & Lexis',
    order: 8,
    domain: 'lexis',
    keywords: ['register', 'law', 'medicine', 'banking', 'aviation', 'journalism', 'publishing', 'agriculture', 'sports', 'government'],
  },
  'e-phrasal-idioms': {
    classId: 'ss2',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Vocabulary & Lexis',
    order: 9,
    domain: 'lexis',
    keywords: ['phrasal verbs', 'idioms', 'idiomatic expressions', 'proverbs', 'put up with', 'call off', 'turn down', 'white elephant'],
  },
  'e-formal-let': {
    classId: 'ss2',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Continuous Writing & Rhetoric',
    order: 10,
    domain: 'writing',
    keywords: ['formal letter', 'official letter', 'application letter', 'letter to the editor', 'petition', 'two addresses', 'yours faithfully'],
  },
  'e-summary': {
    classId: 'ss2',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Reading Comprehension & Summary',
    order: 11,
    domain: 'comp',
    keywords: ['summary writing', 'concise summary', 'pruning', 'lifting penalty', 'preamble', 'concise sentences', 'extraneous material'],
  },

  // ─────────────────────────── SS 3 (10 Topics) ───────────────────────────
  'e-emphatic': {
    classId: 'ss3',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Oral English / Spoken English',
    order: 1,
    domain: 'oral',
    keywords: ['emphatic stress', 'contrastive stress', 'intonation', 'falling tune', 'rising tune', 'spoken english', 'capitalised word'],
  },
  'e-rhyme-rhythm': {
    classId: 'ss3',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Oral English / Spoken English',
    order: 2,
    domain: 'oral',
    keywords: ['rhyme', 'consonant clusters', 'syllable structure', 'ccvcc', 'stress-timed rhythm', 'weak forms', 'phonetic transcription'],
  },
  'e-cloze': {
    classId: 'ss3',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Vocabulary & Lexis',
    order: 3,
    domain: 'lexis',
    keywords: ['cloze passage', 'collocation', 'discourse markers', 'cohesion', 'transitional devices', 'lexical gap'],
  },
  'e-modifiers': {
    classId: 'ss3',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'English Grammar & Structure',
    order: 4,
    domain: 'grammar',
    keywords: ['dangling modifier', 'misplaced modifier', 'parallelism', 'negative inversion', 'no sooner than', 'hardly when', 'not only but also'],
  },
  'e-figures': {
    classId: 'ss3',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Reading Comprehension & Summary',
    order: 5,
    domain: 'comp',
    keywords: ['figures of speech', 'metaphor', 'simile', 'personification', 'oxymoron', 'paradox', 'synecdoche', 'metonymy', 'euphemism', 'litotes', 'irony'],
  },
  'e-comp-crit': {
    classId: 'ss3',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Reading Comprehension & Summary',
    order: 6,
    domain: 'comp',
    keywords: ['inference', 'deduction', 'logical implication', 'writer attitude', 'critical reading', 'evaluative comprehension'],
  },
  'e-essays': {
    classId: 'ss3',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Continuous Writing & Rhetoric',
    order: 7,
    domain: 'writing',
    keywords: ['argumentative essay', 'debate', 'expository essay', 'narrative essay', 'descriptive essay', 'coma', 'content organisation expression mechanical accuracy'],
  },
  'e-speech-art': {
    classId: 'ss3',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Continuous Writing & Rhetoric',
    order: 8,
    domain: 'writing',
    keywords: ['article for publication', 'speech writing', 'vocatives', 'report writing', 'minutes of meeting', 'byline'],
  },
  'e-usage-traps': {
    classId: 'ss3',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'English Grammar & Structure',
    order: 9,
    domain: 'grammar',
    keywords: ['redundancy', 'tautology', 'pleonasm', 'return back', 'repeat again', 'night vigil', 'wake-keeping', 'mature', 'being that', 'one of the boys'],
  },
  'e-register-syn': {
    classId: 'ss3',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Vocabulary & Lexis',
    order: 10,
    domain: 'lexis',
    keywords: ['sentence interpretation', 'most appropriate interpretation', 'advanced lexis', 'contextual idiom', 'figurative meaning'],
  },
  'e-jamb-lekki': {
    classId: 'ss3',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Reading Comprehension & Summary',
    order: 11,
    domain: 'comp',
    keywords: ['the lekki headmaster', 'kabir alabi garba', 'bepo adewale', 'stardom schools', 'seri', 'ibidun gloss', 'japa', 'jamb novel', 'dusk', 'dawn'],
  },
  'e-jamb-lifechanger': {
    classId: 'ss3',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Reading Comprehension & Summary',
    order: 12,
    domain: 'comp',
    keywords: ['the life changer', 'khadija abubakar jalli', 'ummi', 'omar', 'bint', 'salma', 'talle', 'salim', 'jamb novel'],
  },
};

export function filterEngTopicsByClass(topics: Topic[], cls?: ChemClassId): Topic[] {
  if (!cls || cls === 'all') return topics;
  return topics.filter((t) => ENG_NERDC_MAP[t.id]?.classId === cls);
}
