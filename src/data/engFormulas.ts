import type { FormulaRearrangement } from './chemFormulas';

export type EngFormulaCatId =
  | 'concord'
  | 'tense'
  | 'clauses'
  | 'oral'
  | 'lexis'
  | 'writing';

export interface EngFormulaCategory {
  id: EngFormulaCatId | 'all';
  label: string;
  shortLabel: string;
  desc: string;
}

export interface EngFormulaItem {
  id: string;
  cat: EngFormulaCatId;
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

export const ENG_FORMULA_CATEGORIES: EngFormulaCategory[] = [
  {
    id: 'all',
    label: 'All English Rules & Patterns',
    shortLabel: 'All',
    desc: 'Every high-yield concord law, subjunctive & tag rule, WAEC clause/phrase test, Oral English sound law, collocation & essay blueprint',
  },
  {
    id: 'concord',
    label: 'Concord & Pronoun Case Laws',
    shortLabel: 'Concord & Case',
    desc: 'Accompaniment, proximity, "one of the + Pl. + who", "a number vs the number", uncountables & pronoun case',
  },
  {
    id: 'tense',
    label: 'Tense, Subjunctive, Tags & Voice',
    shortLabel: 'Tense & Tags',
    desc: '"It is high time + V₂", conditionals, question-tag polarity, active/passive & reported speech backshift',
  },
  {
    id: 'clauses',
    label: 'Clauses, Phrases, Order & Inversion',
    shortLabel: 'Clauses & Order',
    desc: 'WAEC Grammatical Name & Function, OSASCOMP adjective order, dangling modifiers, parallelism & negative inversion',
  },
  {
    id: 'oral',
    label: 'Oral English, Stress & Syllable Laws',
    shortLabel: 'Oral & Stress',
    desc: 'Pure vowel/diphthong spelling traps, "-ed" voicing, suffix stress laws, emphatic stress & C–V syllable structure',
  },
  {
    id: 'lexis',
    label: 'Collocations, Idioms & Usage Traps',
    shortLabel: 'Lexis & Usage',
    desc: 'Zero-preposition verbs, correlative pairs, paronyms, pleonasm traps & JAMB sentence interpretation rules',
  },
  {
    id: 'writing',
    label: 'Summary, Letters, Essays & Mechanics',
    shortLabel: 'Writing & Summary',
    desc: 'WAEC 30-mark Summary pruning laws, Formal vs Informal vs Article layouts, Debate vocatives & spelling accuracy',
  },
];

export const ENG_FORMULAS: EngFormulaItem[] = [
  /* ─────────────── 1. CONCORD & PRONOUN CASE (5) ─────────────── */
  {
    id: 'ef-accomp-prox',
    cat: 'concord',
    name: 'Accompaniment vs Proximity Concord Law',
    topicId: 'e-concord',
    summary: 'Separates parenthetical linkers (match FIRST subject) from correlative "or/nor" linkers (match NEARER subject).',
    rearrangements: [
      {
        solveFor: 'Accomp.',
        label: 'Accompaniment (with / as well as)',
        exprHtml: '[Subject 1] + as well as / together with [Subject 2] → Verb matches Subject 1',
      },
      {
        solveFor: 'Proximity',
        label: 'Proximity (neither...nor / either...or)',
        exprHtml: 'Neither [Subject 1] nor [Subject 2] → Verb matches Subject 2 (nearest)',
      },
    ],
    variables: [
      ['Subject 1', 'Grammatical head noun before "with / along with / as well as"'],
      ['Subject 2', 'Nearer noun right before the verb in "or / nor / but also"'],
    ],
    trap: 'Never treat "as well as" or "together with" like "and" — they NEVER turn a singular head subject into a plural!',
    worked: {
      qHtml: 'Choose the right verbs: "The coach, with his players, ___ (is/are) here; neither the players nor the coach ___ (was/were) late."',
      stepsHtml: [
        'Clause 1 uses "with" → match singular "The coach" → is',
        'Clause 2 uses "neither...nor" → match nearer singular "the coach" → was',
      ],
      ansHtml: 'is / was',
    },
    keywords: ['concord', 'as well as', 'together with', 'neither nor', 'either or', 'proximity'],
  },
  {
    id: 'ef-one-of-who',
    cat: 'concord',
    name: 'Relative Antecedent Law ("One of the... who")',
    topicId: 'e-concord',
    summary: 'Determines whether the verb after "who / that" is plural or singular after "one of the + plural noun".',
    rearrangements: [
      {
        solveFor: 'Plural',
        label: 'Standard "one of the..."',
        exprHtml: 'X is one of the [Plural Noun] + who/that + PLURAL Verb',
      },
      {
        solveFor: 'Singular',
        label: 'Exception: "the ONLY one..."',
        exprHtml: 'X is the ONLY one of the [Plural Noun] + who/that + SINGULAR Verb',
      },
    ],
    variables: [
      ['Plural Noun', 'True antecedent of "who/that" when "only" is absent'],
      ['the ONLY one', 'Restricts the relative clause to a single individual'],
    ],
    trap: 'Without the word "ONLY", the verb after "who" MUST be plural ("one of the girls who HAVE passed")!',
    worked: {
      qHtml: 'Complete: "Bola is one of the finalists who ___ (merit/merits) the prize, and the only one who ___ (speaks/speak) Arabic."',
      stepsHtml: [
        'First gap: no "only" → antecedent is plural "finalists" → merit',
        'Second gap: "the ONLY one" → singular → speaks',
      ],
      ansHtml: 'merit / speaks',
    },
    keywords: ['one of the', 'only one', 'relative pronoun', 'who', 'concord'],
  },
  {
    id: 'ef-number-many-a',
    cat: 'concord',
    name: '"A Number" vs "The Number" & "Many a" Concord',
    topicId: 'e-concord',
    summary: 'Contrasts quantifier "a number of" (plural) against headcount "the number of" and "many a" (singular).',
    rearrangements: [
      {
        solveFor: 'A number',
        label: 'A number of (= many)',
        exprHtml: 'A number of + Plural Noun + PLURAL Verb',
      },
      {
        solveFor: 'The number',
        label: 'THE number of (= figure)',
        exprHtml: 'The number of + Plural Noun + SINGULAR Verb',
      },
      {
        solveFor: 'Many a',
        label: 'Many a / More than one',
        exprHtml: 'Many a + Singular Noun + SINGULAR Verb',
      },
    ],
    variables: [
      ['A number of', 'Indefinite quantifier meaning "several/many"'],
      ['The number of', 'Definite singular noun phrase referring to one numerical total'],
    ],
    trap: '"Many a student" means "many students" in sense, yet grammatically it ALWAYS takes a singular noun and a SINGULAR verb ("fails")!',
    worked: {
      qHtml: 'Complete: "The number of road accidents ___ fallen, though many a motorist still ___ recklessly."',
      stepsHtml: [
        '"The number" = singular figure → has',
        '"many a motorist" = singular concord → drives',
      ],
      ansHtml: 'has / drives',
    },
    keywords: ['a number of', 'the number of', 'many a', 'more than one', 'police', 'the poor'],
  },
  {
    id: 'ef-uncountable',
    cat: 'concord',
    name: 'Uncountable Mass Noun & Partitive Rule',
    topicId: 'e-nouns',
    summary: 'Governs mass nouns (equipment, information, advice, furniture, luggage, stationery) that forbid plural -s.',
    rearrangements: [
      {
        solveFor: 'Mass',
        label: 'Uncountable General Form',
        exprHtml: 'much / little / some + [Mass Noun] + SINGULAR Verb (NO "a/an", NO "-s")',
      },
      {
        solveFor: 'Counted',
        label: 'Counting Individual Units',
        exprHtml: 'a piece of / three items of + [Singular Mass Noun]',
      },
    ],
    variables: [
      ['Mass Nouns', 'information, advice, equipment, furniture, luggage, traffic, damage, news'],
      ['Law Shift', '"damage" = destruction (mass); "damages" = court financial compensation'],
    ],
    trap: 'Never write *"informations", *"equipments", *"furnitures", or *"an advice"!',
    worked: {
      qHtml: 'Fix: "We bought two new laboratory equipments."',
      stepsHtml: [
        'Remove illegal plural -s on "equipment"',
        'Insert unit counter "pieces of"',
      ],
      ansHtml: 'We bought two new pieces of laboratory equipment.',
    },
    keywords: ['uncountable', 'equipment', 'information', 'advice', 'furniture', 'damages'],
  },
  {
    id: 'ef-pronoun-case',
    cat: 'concord',
    name: 'Pronoun Case Law (Prepositions, "Let" & "Than")',
    topicId: 'e-nouns',
    summary: 'Selects Objective vs Subjective pronouns after prepositions, "Let", and elliptical "than/as" clauses.',
    rearrangements: [
      {
        solveFor: 'Obj.',
        label: 'After Preposition or "Let"',
        exprHtml: 'between / except / for / Let + [Noun] and + OBJECTIVE (me, him, her, us, them, whom)',
      },
      {
        solveFor: 'Subj.',
        label: 'Formal Elliptical Comparison',
        exprHtml: '[Subject] + Verb + Adj-er + than / as + SUBJECTIVE (I, he, she, we, they)',
      },
    ],
    variables: [
      ['Subjective', 'I, we, he, she, they, who'],
      ['Objective', 'me, us, him, her, them, whom'],
    ],
    trap: '"Between you and I" is ALWAYS wrong in exams — "between" is a preposition requiring objective "between you and ME"!',
    worked: {
      qHtml: 'Complete: "Strictly between you and ___, Ada is taller than ___."',
      stepsHtml: [
        'After preposition "between" → objective "me"',
        'Expand "taller than ___ [am]" → formal subjective "I"',
      ],
      ansHtml: 'me / I',
    },
    keywords: ['pronoun case', 'between you and me', 'let', 'who', 'whom', 'one’s'],
  },

  /* ─────────────── 2. TENSE, SUBJUNCTIVE, TAGS & VOICE (6) ─────────────── */
  {
    id: 'ef-high-time',
    cat: 'tense',
    name: 'Past Subjunctive ("It is high time" & "Would rather")',
    topicId: 'e-conditionals',
    summary: 'Uses Simple Past (V₂) to express urgent present action or preference when a subject follows.',
    rearrangements: [
      {
        solveFor: 'High time',
        label: 'It is (high / about) time',
        exprHtml: 'It is (high) time + [Subject] + SIMPLE PAST (V₂)',
      },
      {
        solveFor: 'Diff. Subj',
        label: 'Would rather (2 subjects)',
        exprHtml: 'S₁ would rather + [S₂] + SIMPLE PAST (V₂)',
      },
      {
        solveFor: 'Same Subj',
        label: 'Would rather (1 subject)',
        exprHtml: 'S₁ would rather + BARE INFINITIVE (V₁)',
      },
    ],
    variables: [
      ['V₂', 'Simple Past form (went, left, started, stayed, did not use)'],
      ['No Subject', 'If no subject follows: "It is time TO GO"'],
    ],
    trap: 'Never pick "go" or "should go" after "It is high time we..." — ALWAYS pick Simple Past "WENT"!',
    worked: {
      qHtml: 'Complete: "It is high time the students ___ (settle) down; I would rather you ___ (keep) quiet."',
      stepsHtml: [
        'After "It is high time + the students" → V₂ = settled',
        'After "I would rather + you" (new subject) → V₂ = kept',
      ],
      ansHtml: 'settled / kept',
    },
    keywords: ['it is high time', 'would rather', 'subjunctive', 'i wish', 'if only'],
  },
  {
    id: 'ef-conditionals',
    cat: 'tense',
    name: 'Conditional Equations (Types 1, 2, 3 & Inverted "Had")',
    topicId: 'e-conditionals',
    summary: 'Locks each if-clause tense to its exact main-clause modal structure.',
    rearrangements: [
      {
        solveFor: 'Type 2',
        label: 'Type 2 (Unreal Present)',
        exprHtml: 'If + Subject + V₂ (were)  →  Subject + would / could + V₁',
      },
      {
        solveFor: 'Type 3',
        label: 'Type 3 (Impossible Past)',
        exprHtml: 'If + Subject + had + V₃  →  Subject + would / could + HAVE + V₃',
      },
      {
        solveFor: 'Inverted',
        label: 'Formal Inverted Type 3',
        exprHtml: 'Had + Subject + V₃,  Subject + would have + V₃',
      },
    ],
    variables: [
      ['were', 'Used for ALL persons (I/he/she were) in Type 2 unreal condition'],
      ['Unless', 'Means "If ... NOT" (never add a second negative in the unless-clause)'],
    ],
    trap: 'NEVER put "would" or "would have" inside the "if"-clause itself!',
    worked: {
      qHtml: 'Complete: "Had the goalkeeper dived earlier, he ___ (save) the penalty."',
      stepsHtml: [
        '"Had the goalkeeper dived" = inverted Type 3 ("If he had dived")',
        'Main clause takes "would have + V₃" → would have saved',
      ],
      ansHtml: 'would have saved',
    },
    keywords: ['conditionals', 'had i known', 'if i were', 'unless', 'would have'],
  },
  {
    id: 'ef-mandative',
    cat: 'tense',
    name: 'Mandative Subjunctive ("insist / recommend that + V₁")',
    topicId: 'e-conditionals',
    summary: 'Uses uninflected bare stem (be, go, apologise) for ALL subjects after verbs/adjectives of demand or proposal.',
    rearrangements: [
      {
        solveFor: 'Active',
        label: 'Mandative Active',
        exprHtml: 'suggest / recommend / insist / vital + that + [Subject] + BARE STEM (V₁)',
      },
      {
        solveFor: 'Passive',
        label: 'Mandative Passive',
        exprHtml: 'ordered / demanded + that + [Subject] + BE + V₃',
      },
    ],
    variables: [
      ['Triggers', 'suggest, recommend, propose, insist, demand, urge, essential, imperative'],
      ['Bare Stem', 'No "-s" on 3rd singular and no "-ed" even after past main verb!'],
    ],
    trap: 'Even when the main verb is past ("recommended") and the subject is singular ("the cashier"), keep bare "apologise" or "be suspended"!',
    worked: {
      qHtml: 'Complete: "The board insisted that the manager ___ (resign) and that the audit ___ (be) published."',
      stepsHtml: [
        'Mandative trigger "insisted that" → bare V₁ "resign" (no -s, no -ed)',
        'Passive mandative → "be published"',
      ],
      ansHtml: 'resign / be',
    },
    keywords: ['mandative subjunctive', 'recommend that', 'insist that', 'bare infinitive'],
  },
  {
    id: 'ef-question-tags',
    cat: 'tense',
    name: 'Question Tag Polarity & Semi-Negative Law',
    topicId: 'e-modals-tags',
    summary: 'Flips statement polarity and handles semi-negatives, "I am", "Let’s", and indefinite pronouns.',
    rearrangements: [
      {
        solveFor: 'Semi-Neg',
        label: 'Hardly / Scarcely / Little / Seldom',
        exprHtml: '[Subject] + hardly/seldom/little + V  →  POSITIVE Tag (does she? / is there?)',
      },
      {
        solveFor: 'Specials',
        label: 'I am · Let’s · Everyone',
        exprHtml: 'I am → aren’t I?  |  Let’s → shall we?  |  Everyone V₂ → didn’t they?',
      },
    ],
    variables: [
      ['little / few', 'WITHOUT "a" = negative → positive tag ("is there?")'],
      ['a little / a few', 'WITH "a" = positive → negative tag ("isn’t there?")'],
    ],
    trap: 'Never use universal *"isn’t it?" — and remember "hardly / scarcely / rarely / seldom" are ALREADY negative!',
    worked: {
      qHtml: 'Add tags: (1) "Musa seldom complains, ___?" (2) "Everyone cheered, ___?"',
      stepsHtml: [
        '"seldom" = negative + Simple Present "complains" → does he?',
        '"Everyone" → pronoun "they" + Simple Past positive "cheered" → didn’t they?',
      ],
      ansHtml: 'does he / didn’t they',
    },
    keywords: ['question tag', 'aren’t i', 'shall we', 'hardly', 'scarcely', 'little'],
  },
  {
    id: 'ef-tense-seq',
    cat: 'tense',
    name: 'Sequence of Tenses ("Since", Past Perfect & Lie/Lay)',
    topicId: 'e-verbs',
    summary: 'Separates finished past time from "since + V₂" and transitive "lay" from intransitive "lie".',
    rearrangements: [
      {
        solveFor: 'Since',
        label: 'Present Perfect + SINCE + V₂',
        exprHtml: 'has/have + V₃ (or It has been X years) + SINCE + [Subject] + SIMPLE PAST (V₂)',
      },
      {
        solveFor: '2 Past',
        label: 'Earlier of Two Past Events',
        exprHtml: 'By the time [S + V₂ (2nd)],  [S + HAD + V₃ (1st)]',
      },
      {
        solveFor: 'Lie/Lay',
        label: 'Intransitive Lie vs Transitive Lay',
        exprHtml: 'lie – lay – lain (recline, NO obj)  |  lay – laid – laid (put, HAS obj)',
      },
    ],
    variables: [
      ['Definite Past', 'yesterday, ago, in 2019 → Simple Past V₂ ONLY (never "has + V₃")'],
      ['hanged vs hung', 'hanged = executed by law; hung = suspended on a hook/wall'],
    ],
    trap: 'Inside a temporal "since"-clause, use Simple Past ("since he LEFT"), NEVER Present Perfect (*"since he has left")!',
    worked: {
      qHtml: 'Complete: "The patient had ___ (lie) in bed for an hour since the nurse ___ (leave)."',
      stepsHtml: [
        'Intransitive recline after "had" requires V₃ of "lie" → lain',
        'After temporal "since" → V₂ = left',
      ],
      ansHtml: 'lain / left',
    },
    keywords: ['since', 'past perfect', 'lie lay lain', 'lay laid laid', 'hanged', 'broadcast'],
  },
  {
    id: 'ef-voice-speech',
    cat: 'tense',
    name: 'Passive Voice & Reported Question Transformation',
    topicId: 'e-voice-speech',
    summary: 'Preserves exact aspect in Passive [BE + V₃] and restores statement order in Reported Questions.',
    rearrangements: [
      {
        solveFor: 'Cont. Pass',
        label: 'Continuous Active → Passive',
        exprHtml: 'am/is/are/was/were + V-ing  →  am/is/are/was/were + BEING + V₃',
      },
      {
        solveFor: 'Rep. Q',
        label: 'Direct → Indirect Question',
        exprHtml: 'asked + if/whether/wh-word + [Subject] + [Backshifted Verb] (NO inversion!)',
      },
    ],
    variables: [
      ['Time Shifts', 'tomorrow → the following day · yesterday → the previous day · ago → before'],
      ['Intransitives', 'occur, happen, arrive, sleep CANNOT be made passive'],
    ],
    trap: 'Reported questions NEVER invert like direct questions: write "asked where I WAS", NEVER *"asked where was I"!',
    worked: {
      qHtml: 'Report: "Where did you keep this file yesterday?" Ada asked Obi.',
      stepsHtml: [
        'Keep "where" + statement order (Obi/he + Past Perfect "had kept")',
        'Shift "this → that" and "yesterday → the previous day"',
      ],
      ansHtml: 'Ada asked Obi where he had kept that file the previous day.',
    },
    keywords: ['passive voice', 'being', 'reported speech', 'indirect question', 'backshift'],
  },

  /* ─────────────── 3. CLAUSES, PHRASES, ORDER & INVERSION (5) ─────────────── */
  {
    id: 'ef-phrase-clause',
    cat: 'clauses',
    name: 'WAEC Phrase vs Clause Finite-Verb Test',
    topicId: 'e-phrases',
    summary: 'Separates Phrases (zero finite verbs inside) from Clauses (has a finite verb inside) before naming.',
    rearrangements: [
      {
        solveFor: 'Phrase',
        label: 'No Finite Verb Inside',
        exprHtml: 'Noun / Adjectival / Adverbial PHRASE (includes standalone V-ing & to + V₁)',
      },
      {
        solveFor: 'Clause',
        label: 'Has Finite Verb Inside',
        exprHtml: 'Noun / Adjectival (Relative) / Adverbial CLAUSE',
      },
    ],
    variables: [
      ['Finite Verb', 'Shows tense/number/person (writes, wrote, is, were, had eaten)'],
      ['Non-Finite', 'Infinitive (to go), participle/gerund (going, broken) without finite aux'],
    ],
    trap: 'Always quote the EXACT word modified in your WAEC function ("Subject of the verb \'collapsed\'", NEVER just "Subject")!',
    worked: {
      qHtml: 'Name & Function: "<u>Reading under dim candlelight</u> strains the eyes."',
      stepsHtml: [
        '"Reading" has no auxiliary → non-finite → Phrase ("strains" is outside!)',
        'Answers "WHAT strains the eyes?" → Noun phrase, subject of the verb "strains"',
      ],
      ansHtml: 'Noun phrase; subject of the verb "strains"',
    },
    keywords: ['grammatical name', 'grammatical function', 'noun phrase', 'adjectival phrase', 'adverbial phrase'],
  },
  {
    id: 'ef-clause-trio',
    cat: 'clauses',
    name: 'Lookalike Clause Splitter ("where / that" Test)',
    topicId: 'e-clauses',
    summary: 'Distinguishes Noun, Adjectival, and Adverbial clauses even when they start with the exact same word.',
    rearrangements: [
      {
        solveFor: 'Noun Cl.',
        label: 'Replaces "IT" / Appositive',
        exprHtml: 'After transitive verb, prep., or abstract noun (failing "which" test) → NOUN CLAUSE',
      },
      {
        solveFor: 'Adj. Cl.',
        label: 'Follows Noun Antecedent',
        exprHtml: '[Noun] + who/which/that/where (passing "which/in which" test) → ADJECTIVAL CLAUSE',
      },
      {
        solveFor: 'Adv. Cl.',
        label: 'Modifies Main Verb',
        exprHtml: 'Answers WHEN / WHERE / IF / ALTHOUGH / SO...THAT → ADVERBIAL CLAUSE',
      },
    ],
    variables: [
      ['Appositive Test', '"The rumour that fees rose" (cannot say *"which fees rose") → Noun Clause in apposition!'],
      ['Relative Test', '"The rumour that he spread" (= "which he spread") → Adjectival Clause!'],
    ],
    trap: 'A clause immediately following a preposition ("depends on <u>how you answer</u>") is ALWAYS a Noun Clause (object of the preposition)!',
    worked: {
      qHtml: 'Compare: (1) "Tell me <u>where she lives</u>." vs (2) "I saw the house <u>where she lives</u>."',
      stepsHtml: [
        '(1) Answers "Tell me WHAT?" → Noun clause, direct object of "Tell"',
        '(2) Identifies noun "house" → Adjectival clause, qualifies "house"',
      ],
      ansHtml: '(1) Noun clause · (2) Adjectival clause',
    },
    keywords: ['noun clause', 'adjectival clause', 'adverbial clause', 'apposition', 'relative'],
  },
  {
    id: 'ef-osascomp',
    cat: 'clauses',
    name: 'OSASCOMP Royal Order of Adjectives & Comparatives',
    topicId: 'e-adj-adv',
    summary: 'Orders stacked adjectives before a noun and enforces comparative rules ("the taller of two", "superior TO").',
    rearrangements: [
      {
        solveFor: 'OSASCOMP',
        label: 'Pre-Noun Adjective Order',
        exprHtml: 'Det → Opinion → Size → Age → Shape → Colour → Origin → Material → Purpose + NOUN',
      },
      {
        solveFor: '2 vs 3+',
        label: 'Two Items vs Latinate -or',
        exprHtml: 'Of the TWO: "the + Comparative"  |  senior / junior / superior / prefer + TO',
      },
    ],
    variables: [
      ['Origin–Mat–Purp', 'Always sit closest to the head noun ("Nigerian leather school bag")'],
      ['Adverb MPT', 'Manner → Place → Time ("sang sweetly in chapel yesterday")'],
    ],
    trap: 'Never use superlative (-est / most) when comparing ONLY TWO people ("Of the twins, Taiwo is the TALLER")!',
    worked: {
      qHtml: 'Order before "car": (sports / Japanese / sleek / red / new).',
      stepsHtml: [
        'Opinion (sleek) → Age (new) → Colour (red) → Origin (Japanese) → Purpose (sports)',
      ],
      ansHtml: 'a sleek new red Japanese sports car',
    },
    keywords: ['osascomp', 'order of adjectives', 'superior to', 'prefer to', 'comparative'],
  },
  {
    id: 'ef-neg-inversion',
    cat: 'clauses',
    name: 'Fronted Negative Inversion ("Hardly / Little / No sooner")',
    topicId: 'e-modifiers',
    summary: 'Inverts Auxiliary before Subject whenever a negative or restrictive expression starts a clause.',
    rearrangements: [
      {
        solveFor: 'Simple',
        label: 'Never / Seldom / Little',
        exprHtml: 'Little / Never / Seldom + DO/DOES/DID + [Subject] + Bare V₁',
      },
      {
        solveFor: 'Perfect',
        label: 'No sooner...than / Hardly...when',
        exprHtml: 'No sooner + HAD + [Subject] + V₃ ... THAN  |  Hardly + HAD + [S] + V₃ ... WHEN',
      },
    ],
    variables: [
      ['Triggers', 'Never, Rarely, Little, Hardly, Scarcely, No sooner, Not only, Under no circumstances, Only after [clause]'],
    ],
    trap: 'After inverted "did", the main verb MUST revert to bare V₁ ("Little DID Kola KNOW", NEVER *"did Kola knew")!',
    worked: {
      qHtml: 'Complete: "No sooner ___ (the bell / ring) ___ the students ran out."',
      stepsHtml: [
        'Fronted "No sooner" triggers Past Perfect inversion: had the bell rung',
        'Correlative partner of "No sooner" is strictly "than"',
      ],
      ansHtml: 'had the bell rung / than',
    },
    keywords: ['inversion', 'no sooner than', 'hardly when', 'little did', 'under no circumstances'],
  },
  {
    id: 'ef-dangling-parallel',
    cat: 'clauses',
    name: 'Participial Attachment & Parallel Structure Law',
    topicId: 'e-modifiers',
    summary: 'Anchors opening modifiers to the subject right after the comma and aligns coordinated grammatical forms.',
    rearrangements: [
      {
        solveFor: 'Modifier',
        label: 'Dangling Modifier Cure',
        exprHtml: '[V-ing / V₃ Opener], + [ACTUAL DOER / RECEIVER as Subject] + Finite Verb',
      },
      {
        solveFor: 'Parallel',
        label: 'Correlative & List Balance',
        exprHtml: 'not only [Form X] but also [Form X]  |  V-ing, V-ing, and V-ing',
      },
    ],
    variables: [
      ['Comma Subject', 'Must logically perform "Walking..." or undergo "Stung by..."'],
    ],
    trap: '*"Walking home, rain drenched Obi" makes "rain" the walker! Fix: "Walking home, OBI was drenched by rain."',
    worked: {
      qHtml: 'Fix: "Plunging into the lagoon, the fisherman’s net was rescued by Chidi."',
      stepsHtml: [
        'WHO plunged into the lagoon? Chidi (not the net!)',
        'Place "Chidi" right after the comma: "Plunging into the lagoon, Chidi rescued the fisherman’s net."',
      ],
      ansHtml: 'Plunging into the lagoon, Chidi rescued the fisherman’s net.',
    },
    keywords: ['dangling modifier', 'misplaced modifier', 'parallelism', 'not only but also'],
  },

  /* ─────────────── 4. ORAL ENGLISH, STRESS & SYLLABLE LAWS (5) ─────────────── */
  {
    id: 'ef-vowel-traps',
    cat: 'oral',
    name: 'Oral English Vowel & Diphthong Spelling-Trap Decoder',
    topicId: 'e-vowels',
    summary: 'Maps deceptive English spellings to their true IPA pure vowels and diphthongs.',
    rearrangements: [
      {
        solveFor: 'Pure',
        label: 'High-Yield Pure Vowels',
        exprHtml: 'quay /iː/ · women, busy /ɪ/ · bury, leopard /e/ · plait /æ/ · blood /ʌ/ · colonel /ɜː/',
      },
      {
        solveFor: 'Glides',
        label: 'High-Yield Diphthongs',
        exprHtml: 'sew, brooch /əʊ/ · gauge, steak /eɪ/ · height /aɪ/ · bough /aʊ/ · heir /eə/ · buoy /ɔɪ/',
      },
    ],
    variables: [
      ['Schwa /ə/', 'Weakest central vowel — occurs ONLY in unstressed syllables (p-o-lice, doct-or)'],
      ['ː mark', 'Marks the 5 long pure vowels: /iː, ɑː, ɔː, uː, ɜː/'],
    ],
    trap: '"women" (/ˈwɪmɪn/) has /ɪ/ in BOTH syllables; "bury" (/ˈberi/) has /e/; "sew" (/səʊ/) rhymes with "go"!',
    worked: {
      qHtml: 'Match the vowel sound in "pl<u>ai</u>t" to: (plate / pat / part / port).',
      stepsHtml: [
        'Pronunciation of "plait" is /plæt/ (short front vowel /æ/)',
        'Matches "pat" (/pæt/)!',
      ],
      ansHtml: 'pat (/æ/)',
    },
    keywords: ['vowels', 'diphthongs', 'quay', 'women', 'bury', 'plait', 'sew', 'colonel', 'schwa'],
  },
  {
    id: 'ef-ed-silent',
    cat: 'oral',
    name: 'Past "-ed" Voicing Assimilation & Silent Consonants',
    topicId: 'e-consonants',
    summary: 'Predicts whether "-ed" sounds like /t/, /d/, or /ɪd/ and flags silent consonants.',
    rearrangements: [
      {
        solveFor: '-ed Rule',
        label: '3-Way Past "-ed" Sound',
        exprHtml: 'Voiceless + ed → /t/ (laughed)  |  Voiced + ed → /d/ (begged)  |  /t, d/ + ed → /ɪd/ (landed)',
      },
      {
        solveFor: 'Silent',
        label: 'Silent Letter Champions',
        exprHtml: 'b (subtle, debt) · p (receipt, coup) · t (mortgage, chalet) · w (sword) · l (salmon)',
      },
    ],
    variables: [
      ['Voiceless Set', '/p, k, f, θ, s, ʃ, tʃ/ (walked, laughed, washed, kissed → /t/)'],
      ['Letter x', '/ɡz/ before a STRESSED vowel (exam, exact, exhaust); /ks/ elsewhere'],
    ],
    trap: '"laughed" ends in /f/ (voiceless), so "-ed" is /t/ (/lɑːft/) — and "th" in "breathe / smooth / worthy" is VOICED /ð/!',
    worked: {
      qHtml: 'Identify the final sound of "watched" and the silent letter in "subtle".',
      stepsHtml: [
        '"watch" ends in voiceless /tʃ/ → "-ed" = /t/ (/wɒtʃt/)',
        '"subtle" = /ˈsʌtl/ → silent "b"',
      ],
      ansHtml: '/t/ and silent "b"',
    },
    keywords: ['consonants', 'silent letters', 'past ed', 'voicing', 'subtle', 'receipt', 'sword'],
  },
  {
    id: 'ef-word-stress',
    cat: 'oral',
    name: 'Suffix-Driven Word Stress Laws (2nd vs 3rd from End)',
    topicId: 'e-stress',
    summary: 'Locates primary stress instantly by counting backwards from the word’s suffix.',
    rearrangements: [
      {
        solveFor: '2nd End',
        label: 'Penultimate (2nd from End)',
        exprHtml: '-ion · -ic · -ics · -ial · -ian · -ious  →  in-for-MA-tion, dra-MAT-ic',
      },
      {
        solveFor: '3rd End',
        label: 'Antepenultimate (3rd from End)',
        exprHtml: '-ity · -ate (3+ syl) · -phy · -gy · -cy  →  u-ni-VER-si-ty, com-MU-ni-cate',
      },
      {
        solveFor: '1st Traps',
        label: '1st-Syllable Exam Traps',
        exprHtml: 'COL-league · MA-dam · CA-len-dar · MAIN-te-nance · POL-i-tics · TRI-bal-ism',
      },
    ],
    variables: [
      ['2-Syl Shift', 'Noun/Adj = 1st (EX-port, RE-cord); Verb = 2nd (ex-PORT, re-CORD)'],
      ['End-Stressed', '-ee, -eer, -ese, -ique → ref-er-EE, vol-un-TEER, tech-NIQUE'],
    ],
    trap: 'Never stress the last syllable of 3+ syllable "-ate" verbs: say "ED-u-cate / in-VES-ti-gate / com-MU-ni-cate"!',
    worked: {
      qHtml: 'Place primary stress on "democracy" and "economic".',
      stepsHtml: [
        '"de-moc-ra-cy" ends in "-cy" → 3rd from end = de-MOC-ra-cy',
        '"ec-o-nom-ic" ends in "-ic" → 2nd from end = ec-o-NOM-ic',
      ],
      ansHtml: 'de-MOC-ra-cy · ec-o-NOM-ic',
    },
    keywords: ['word stress', 'primary stress', 'suffixes', 'colleague', 'calendar', 'communicate'],
  },
  {
    id: 'ef-emphatic-inton',
    cat: 'oral',
    name: 'Emphatic Stress 2-Check Filter & Intonation Tunes',
    topicId: 'e-emphatic',
    summary: 'Matches CAPITALISED contrastive stress to its exact prompt question and assigns Falling vs Rising tunes.',
    rearrangements: [
      {
        solveFor: 'Emphatic',
        label: 'Emphatic Stress Question Rule',
        exprHtml: '1. Omit/replace ONLY the CAPITALISED word  +  2. Keep EVERY other word identical!',
      },
      {
        solveFor: 'Tunes',
        label: 'Falling (↘) vs Rising (↗)',
        exprHtml: 'Falling ↘: Statements, WH-Questions, Commands  |  Rising ↗: Yes/No Qs, Polite Requests, Lists',
      },
    ],
    variables: [
      ['CAPS Aux', '"Ada DID come" rebuts negative doubt → "Didn’t Ada come? / Did Ada fail to come?"'],
    ],
    trap: 'WH-questions ("Where are you going? ↘") take a FALLING tune, NOT a rising tune!',
    worked: {
      qHtml: 'Prompt: "Tunde lent Bisi FIVE novels." Pick matching question.',
      stepsHtml: [
        'Drop "FIVE" and keep Tunde, lend, Bisi, and novels intact',
        'Match: "How many novels did Tunde lend Bisi?" (or "Did Tunde lend Bisi TWO novels?")',
      ],
      ansHtml: 'How many novels did Tunde lend Bisi?',
    },
    keywords: ['emphatic stress', 'contrastive stress', 'intonation', 'falling tune', 'rising tune'],
  },
  {
    id: 'ef-syllable-rhyme',
    cat: 'oral',
    name: 'C–V Syllable Phoneme Formula & Phonetic Rhyme',
    topicId: 'e-rhyme-rhythm',
    summary: 'Counts IPA phonemes (never letters!) for (C₀₋₃)V(C₀₋₄) structure and matches rhyme from stressed vowel to end.',
    rearrangements: [
      {
        solveFor: 'C–V Count',
        label: 'Phoneme-First C–V Rule',
        exprHtml: 'queue = /kjuː/ → CCV  |  box = /bɒks/ → CVCC  |  church = /tʃɜːtʃ/ → CVC',
      },
      {
        solveFor: 'Rhyme',
        label: 'Rhyme Definition',
        exprHtml: 'Different Onset + Identical [Last Stressed Vowel + Coda Sounds]',
      },
    ],
    variables: [
      ['Hidden /j/', 'Words like "use /juːz/, cute /kjuːt/, queue /kjuː/" have consonant /j/!'],
      ['Letter x', 'Counts as TWO consonants /ks/ in coda ("texts" = /teksts/ → CVCCCC)'],
    ],
    trap: 'Count SOUNDS, not spelling letters: "caught" (/kɔːt/) is CVC, NOT CVVCCC!',
    worked: {
      qHtml: 'Give the C–V structure of "stew" (/stjuː/) and a rhyme for "draught" (/drɑːft/).',
      stepsHtml: [
        '/s/ + /t/ + /j/ + /uː/ = CCCV',
        '"draught" (/drɑːft/) shares /-ɑːft/ with "laughed" (/lɑːft/) or "craft"!',
      ],
      ansHtml: 'CCCV · laughed / craft',
    },
    keywords: ['syllable', 'cv structure', 'consonant cluster', 'rhyme', 'queue', 'draught'],
  },

  /* ─────────────── 5. COLLOCATIONS, IDIOMS & USAGE TRAPS (5) ─────────────── */
  {
    id: 'ef-zero-prep',
    cat: 'lexis',
    name: 'Zero-Preposition Verbs & Prepositional "to + -ing"',
    topicId: 'e-prep',
    summary: 'Eliminates illegal prepositions after transitive verbs and requires "-ing" after prepositional "to".',
    rearrangements: [
      {
        solveFor: 'Zero Prep',
        label: 'Transitive Verbs (NO Preposition)',
        exprHtml: 'comprise [X] · discuss [X] · emphasise [X] · stress [X] · request [X]',
      },
      {
        solveFor: 'Prep "to"',
        label: 'Phrases Taking "to + V-ing"',
        exprHtml: 'look forward to / be used to / object to / with a view to + V-ING (Gerund)',
      },
    ],
    variables: [
      ['comprise', 'Active "comprises 6 rooms" = "consists OF 6 rooms" (NEVER *"comprises of"!)'],
      ['accuse / charge', 'accused OF theft · charged WITH theft · congratulate ON'],
    ],
    trap: 'After "look forward to" and "with a view to", NEVER use base V₁ — ALWAYS use "-ing" ("with a view to SOLVING")!',
    worked: {
      qHtml: 'Complete: "The committee ___ (comprises / comprises of) six deans who look forward to ___ (meet / meeting) you."',
      stepsHtml: [
        'Active "comprise" takes no "of" → comprises',
        '"look forward to" takes gerund → meeting',
      ],
      ansHtml: 'comprises / meeting',
    },
    keywords: ['comprise', 'discuss', 'look forward to', 'with a view to', 'congratulate on'],
  },
  {
    id: 'ef-correlatives',
    cat: 'lexis',
    name: 'Locked Correlative Conjunctions & Concession Pairs',
    topicId: 'e-prep',
    summary: 'Pairs fixed correlative twins and separates clause-taking "Although" from phrase-taking "Despite".',
    rearrangements: [
      {
        solveFor: 'Pairs',
        label: 'Correlative Twins',
        exprHtml: 'No sooner...THAN · Hardly/Scarcely...WHEN · Between X AND Y · Prefer X TO Y',
      },
      {
        solveFor: 'Concess.',
        label: 'Although vs Despite',
        exprHtml: 'Although + [Subj + Verb] (NO "but"!)  |  Despite / In spite of + [Noun Phrase]',
      },
    ],
    variables: [
      ['Despite', 'NEVER takes "of" (*"despite of" is always wrong!)'],
      ['On the contrary', 'Used after a NEGATIVE statement to assert the opposite truth'],
    ],
    trap: 'Never write *"Although he tried, but he failed" — drop "but"!',
    worked: {
      qHtml: 'Complete: "___ the heavy traffic, we arrived between noon ___ 1 p.m."',
      stepsHtml: [
        'Before noun phrase "the heavy traffic" → Despite (or In spite of)',
        '"between" pairs strictly with "and"',
      ],
      ansHtml: 'Despite / and',
    },
    keywords: ['despite', 'in spite of', 'although', 'between and', 'scarcely when'],
  },
  {
    id: 'ef-pleonasm-usage',
    cat: 'lexis',
    name: 'Tautology Eliminator & Standard Usage Rules',
    topicId: 'e-usage-traps',
    summary: 'Strips redundant words and fixes high-frequency Nigerian-to-Standard-English exam traps.',
    rearrangements: [
      {
        solveFor: 'Tautology',
        label: 'Delete Redundant Twin',
        exprHtml: 'return (NOT *back) · repeat (NOT *again) · vigil (NOT *night) · can (NOT *be able)',
      },
      {
        solveFor: 'Standard',
        label: 'WAEC / JAMB Idiom Fixes',
        exprHtml: 'a MATURE person · Christian WAKE · BY INSTALMENTS · LEND me · IN the shade',
      },
    ],
    variables: [
      ['Should in case', 'Split into EITHER "In case it rains" OR "Should it rain" — never both!'],
      ['round off/up', 'round OFF a speech (conclude); round UP suspects (arrest)'],
    ],
    trap: 'You sit UNDER a tree, but IN the shade — and you ask a friend to LEND you a pen (never *"borrow me")!',
    worked: {
      qHtml: 'Fix: "Should in case he returns back, borrow him my umbrella."',
      stepsHtml: [
        '"Should in case" → "In case"; "returns back" → "returns"',
        '"borrow him" → "lend him"',
      ],
      ansHtml: 'In case he returns, lend him my umbrella.',
    },
    keywords: ['tautology', 'pleonasm', 'return back', 'mature', 'wake-keeping', 'instalments', 'lend'],
  },
  {
    id: 'ef-paronyms',
    cat: 'lexis',
    name: 'High-Risk Paronym & Collocation Decoder',
    topicId: 'e-lexis-syn',
    summary: 'Distinguishes near-homophone exam word pairs and strong formal collocations.',
    rearrangements: [
      {
        solveFor: 'Paronyms',
        label: 'Lookalike Word Pairs',
        exprHtml: 'eminent (famous) / imminent (soon)  |  disinterested (impartial) / uninterested (bored)',
      },
      {
        solveFor: 'Colloc.',
        label: 'Legal & Formal Collocations',
        exprHtml: 'militate AGAINST · wreak havoc · prefer charges · proffer solutions · tantamount TO',
      },
    ],
    variables: [
      ['elicit / illicit', 'elicit = draw out (verb); illicit = unlawful (adjective)'],
      ['libel / slander', 'libel = written defamation; slander = spoken defamation'],
    ],
    trap: 'A good judge MUST be "disinterested" (= unbiased/neutral) — its opposite is "biased", NOT "enthusiastic"!',
    worked: {
      qHtml: 'Complete: "Lack of power continues to ___ against growth, so experts ___ urgent remedies."',
      stepsHtml: [
        '"___ against" = militate (not mitigate!)',
        'Offer remedies = proffer (not prefer!)',
      ],
      ansHtml: 'militate / proffer',
    },
    keywords: ['eminent', 'imminent', 'militate', 'mitigate', 'disinterested', 'elicit', 'wreak havoc'],
  },
  {
    id: 'ef-interpretation',
    cat: 'lexis',
    name: 'JAMB Sentence Interpretation Structural Keys',
    topicId: 'e-register-syn',
    summary: 'Cracks deceptive structural idioms tested in JAMB & WAEC Sentence Interpretation.',
    rearrangements: [
      {
        solveFor: 'Grammar',
        label: 'Deceptive Structural Idioms',
        exprHtml: 'For all X = Despite X  |  all but V = almost V  |  could not help V-ing = could not resist',
      },
      {
        solveFor: 'Figurative',
        label: 'Core Exam Idioms',
        exprHtml: 'leaves much to be desired = unsatisfactory  |  pinch of salt = doubt  |  clean breast = confess',
      },
    ],
    variables: [
      ['But for X', 'Means "If it had not been for X" (X saved the situation!)'],
      ['white elephant', 'Expensive project with little practical utility'],
    ],
    trap: '"His work leaves much to be desired" is NEGATIVE (= poor/unsatisfactory), never positive!',
    worked: {
      qHtml: 'Interpret: "For all her wealth, Chief Mrs Ojo lives modestly, and the stream had all but dried up."',
      stepsHtml: [
        '"For all her wealth" = Despite her wealth',
        '"all but dried up" = almost completely dried up',
      ],
      ansHtml: 'Despite her wealth ... almost completely dried up',
    },
    keywords: ['sentence interpretation', 'for all', 'all but', 'could not help', 'but for'],
  },

  /* ─────────────── 6. SUMMARY, LETTERS, ESSAYS & MECHANICS (4) ─────────────── */
  {
    id: 'ef-summary-laws',
    cat: 'writing',
    name: 'WAEC 30-Mark Summary 5-Point Formula',
    topicId: 'e-summary',
    summary: 'Converts dense passage paragraphs into full-mark autonomous summary sentences.',
    rearrangements: [
      {
        solveFor: 'Formula',
        label: 'Full-Mark Summary Equation',
        exprHtml: '[Specific Subject] + [Paraphrased Finite Verb] + [Generalised Core Point].',
      },
      {
        solveFor: 'Penalties',
        label: 'Mark Deduction Triggers',
        exprHtml: 'Wholesale Lifting = 0  |  Phrase Fragment = −50%  |  Grammar/Spelling Slip = −½ mark',
      },
    ],
    variables: [
      ['Hypernym', 'Replace lists ("yams, maize, beans") with one category noun ("food crops")'],
      ['First N Rule', 'Examiners mark ONLY the first N sentences requested!'],
    ],
    trap: 'Skip risky colon preambles — write clean, self-contained numbered sentences, ONE point per sentence!',
    worked: {
      qHtml: 'Compress: "Flooding washed away cars, buses, lorries, and tricycles."',
      stepsHtml: [
        'Replace vehicle list with umbrella noun "vehicles" and paraphrase "washed away" → "destroyed"',
      ],
      ansHtml: 'Flooding destroyed vehicles.',
    },
    keywords: ['summary', 'lifting', 'preamble', 'hypernym', 'pruning'],
  },
  {
    id: 'ef-letter-matrix',
    cat: 'writing',
    name: 'Letter Genre Architecture (Formal vs Semi-Formal vs Informal)',
    topicId: 'e-formal-let',
    summary: 'Locks address count, salutation, heading, register, and subscription across all 3 letter types.',
    rearrangements: [
      {
        solveFor: 'Formal',
        label: 'Formal / Official Letter',
        exprHtml: '2 Addresses + Dear Sir, + HEADING + No Contractions + Yours faithfully, + Sign + Full Name',
      },
      {
        solveFor: 'Informal',
        label: 'Informal (Peer / Sibling)',
        exprHtml: '1 Address + Dear Kemi, + ZERO Heading + Warm Contractions + Yours sincerely, + First Name',
      },
      {
        solveFor: 'Semi',
        label: 'Semi-Formal (Adult Friend)',
        exprHtml: '1 Address + Dear Mr Obi, + ZERO Heading + No Slang/Contractions + Yours sincerely, + Full Name',
      },
    ],
    variables: [
      ['Heading Rule', 'ALL CAPS = NO underline; Title Case = underline cleanly (never both!)'],
      ['Yours', 'Capital Y, NO apostrophe ever (*Yours’ is penalized!)'],
    ],
    trap: 'NEVER put family greetings in a Formal Letter, and NEVER sign a signature on an Informal Letter!',
    worked: {
      qHtml: 'Match closing to salutation: (1) "Dear Madam," → ? (2) "Dear Chinedu," → ?',
      stepsHtml: [
        '(1) Formal → Yours faithfully, + Signature + Full Name',
        '(2) Informal → Yours sincerely, + First Name ONLY',
      ],
      ansHtml: '(1) Yours faithfully, + Sign + Full Name · (2) Yours sincerely, + First Name',
    },
    keywords: ['formal letter', 'informal letter', 'semi-formal', 'yours faithfully', 'yours sincerely'],
  },
  {
    id: 'ef-article-debate',
    cat: 'writing',
    name: 'Article vs Letter to Editor vs Debate Protocol',
    topicId: 'e-speech-art',
    summary: 'Prevents fatal WAEC format cross-overs between Newspaper Articles, Letters to the Editor, and Debates.',
    rearrangements: [
      {
        solveFor: 'Article',
        label: 'Article for Publication',
        exprHtml: 'ZERO Addresses + Catchy TITLE at Top + Public Prose + Bottom Byline (Full Name, Town / Class)',
      },
      {
        solveFor: 'Debate',
        label: 'Argumentative Debate Speech',
        exprHtml: 'Ranked Vocatives (Mr Chairman, Panel of Judges...) + ONE Firm Stance + Rebuttal + "Thank you."',
      },
    ],
    variables: [
      ['COEMA (50)', 'Content (10) + Organisation (10) + Expression (20) + Mechanical Accuracy (10)'],
      ['Word Count', 'Minimum 450 words for WASSCE Paper 1 essays'],
    ],
    trap: 'Putting postal addresses or "Yours faithfully" on an Article for Publication costs heavy Organisation marks!',
    worked: {
      qHtml: 'How does Ngozi Eze in Enugu end an Article for a National Newspaper vs a School Magazine?',
      stepsHtml: [
        'National Newspaper → Ngozi Eze, / Enugu.',
        'School Magazine → Ngozi Eze, / SS 3B.',
      ],
      ansHtml: 'Ngozi Eze, Enugu. (National) · Ngozi Eze, SS 3B. (School)',
    },
    keywords: ['article for publication', 'debate', 'vocatives', 'byline', 'coema'],
  },
  {
    id: 'ef-figures-mechanics',
    cat: 'writing',
    name: 'Figures of Speech Contrast & Spelling Accuracy Law',
    topicId: 'e-figures',
    summary: 'Separates high-confusion figurative pairs and locks down top WAEC spelling traps.',
    rearrangements: [
      {
        solveFor: 'Figures',
        label: 'Figurative Contrast Pairs',
        exprHtml: 'Oxymoron (2 words) vs Paradox (sentence)  |  Synecdoche (part/whole) vs Metonymy (symbol)  |  Litotes ("no small")',
      },
      {
        solveFor: 'Spelling',
        label: 'Mechanical Accuracy Champions',
        exprHtml: 'accommodation · occurrence · embarrassment · pronunciation · maintenance · privilege · forty · auxiliary',
      },
    ],
    variables: [
      ['Semicolon', 'Joins clauses before conjunctive adverbs: "; however," / "; nevertheless,"'],
      ['Possessive', 'boys’ school (plural) · women’s hall (irreg. plural) · its paw (no apostrophe!)'],
    ],
    trap: 'Spell "pronunciation" WITHOUT "o" in the second syllable, and "accommodation" with DOUBLE c and DOUBLE m!',
    worked: {
      qHtml: 'Identify the figure in "no mean achievement" and check spelling of "priviledge".',
      stepsHtml: [
        '"no mean" negates the opposite to affirm greatness → Litotes',
        '"priviledge" has an illegal "d" → correct spelling is "privilege"',
      ],
      ansHtml: 'Litotes · privilege',
    },
    keywords: ['oxymoron', 'paradox', 'synecdoche', 'metonymy', 'litotes', 'spelling', 'accommodation'],
  },
];
