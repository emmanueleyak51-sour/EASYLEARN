import {
  ENG_FORMULAS,
  type EngFormulaCatId,
  type EngFormulaItem,
} from '../data/engFormulas';
import { htmlToSpeakableChem } from './chemVoiceLogic';

export interface EngFormulaDrillQuestion {
  id: string;
  formulaId: string;
  formulaName: string;
  cat: EngFormulaCatId;
  promptHtml: string;
  hintHtml: string;
  options: string[];
  answerIdx: number;
  explanationHtml: string;
}

export function filterEngFormulas(
  formulas: EngFormulaItem[],
  cat: EngFormulaCatId | 'all',
  query: string
): EngFormulaItem[] {
  const q = query.trim().toLowerCase();
  return formulas.filter((f) => {
    if (cat !== 'all' && f.cat !== cat) return false;
    if (!q) return true;
    const hay = [
      f.name,
      f.summary,
      f.trap,
      ...f.keywords,
      ...f.rearrangements.map((r) => `${r.label} ${r.exprHtml}`),
      ...f.variables.map(([s, m]) => `${s} ${m}`),
    ]
      .join(' ')
      .toLowerCase();
    return hay.includes(q);
  });
}

export function getEngFormulasForTopic(topicId: string): EngFormulaItem[] {
  return ENG_FORMULAS.filter((f) => f.topicId === topicId);
}

function makeRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickOne<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length) % arr.length];
}

function packChoices(
  correct: string,
  wrongs: string[],
  rng: () => number
): { options: string[]; answerIdx: number } {
  const uniqueWrongs: string[] = [];
  for (const w of wrongs) {
    if (w !== correct && !uniqueWrongs.includes(w)) {
      uniqueWrongs.push(w);
    }
  }
  while (uniqueWrongs.length < 3) {
    uniqueWrongs.push(`None of these (${uniqueWrongs.length + 1})`);
  }
  const pool = [correct, ...uniqueWrongs.slice(0, 3)];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return {
    options: pool,
    answerIdx: pool.indexOf(correct),
  };
}

interface BankItem {
  q: string;
  c: string;
  w: [string, string, string];
  e: string;
}

const RULE_VARIATION_BANK: Record<string, BankItem[]> = {
  'ef-accomp-prox': [
    {
      q: 'Complete: "The principal, together with four senior teachers, _____ inspecting the hostel."',
      c: 'is',
      w: ['are', 'were', 'have been'],
      e: 'Accompaniment phrase "together with..." is parenthetical; match singular head subject "The principal" → "is".',
    },
    {
      q: 'Complete: "Neither the prefects nor the housemaster _____ informed about the power cut."',
      c: 'was',
      w: ['were', 'are', 'have been'],
      e: 'By Proximity Concord after "neither...nor", match the nearer singular subject "the housemaster" → "was".',
    },
    {
      q: 'Complete: "Either the driver or his two apprentices _____ the spare tyre key."',
      c: 'keep',
      w: ['keeps', 'is keeping', 'has kept'],
      e: 'With "either...or", match the nearer plural subject "his two apprentices" → plural verb "keep".',
    },
  ],
  'ef-one-of-who': [
    {
      q: 'Complete: "Zainab is one of the students who _____ won the national essay prize."',
      c: 'have',
      w: ['has', 'is having', 'was'],
      e: 'Without "only", relative pronoun "who" refers to plural "students" → plural verb "have".',
    },
    {
      q: 'Complete: "Chidi is the ONLY one of the applicants who _____ three Nigerian languages fluently."',
      c: 'speaks',
      w: ['speak', 'are speaking', 'have spoken'],
      e: '"the ONLY one" restricts the clause to Chidi alone → singular verb "speaks".',
    },
  ],
  'ef-number-many-a': [
    {
      q: 'Complete: "The number of registered scholarship applicants _____ risen, while a number of centres _____ ready."',
      c: 'has / are',
      w: ['have / is', 'have / are', 'has / is'],
      e: '"THE number" (singular figure) takes "has"; "A number of" (= many) takes plural "are".',
    },
    {
      q: 'Complete: "Many a young graduate _____ this concord rule during interviews."',
      c: 'forgets',
      w: ['forget', 'are forgetting', 'have forgotten'],
      e: '"Many a + singular noun" strictly requires a singular verb ("forgets").',
    },
  ],
  'ef-uncountable': [
    {
      q: 'Choose the standard sentence:',
      c: 'The ministry donated four pieces of laboratory equipment.',
      w: [
        'The ministry donated four new laboratory equipments.',
        'She gave me an important advice.',
        'All their luggages are in the boot.',
      ],
      e: '"equipment, advice, luggage" are uncountable mass nouns and never take plural "-s" or "an".',
    },
    {
      q: 'Complete: "Fire caused _____ to the factory, so the owner sued for heavy _____."',
      c: 'much damage / damages',
      w: ['many damages / damage', 'a damage / damages', 'much damages / damage'],
      e: 'Physical harm is uncountable "much damage"; legal monetary compensation is plural "damages".',
    },
  ],
  'ef-pronoun-case': [
    {
      q: 'Complete: "Strictly between you and _____, let Tolu and _____ verify the figures."',
      c: 'me / me',
      w: ['I / I', 'I / me', 'me / I'],
      e: 'Both preposition "between" and verb "let" govern the objective case ("me").',
    },
    {
      q: 'Complete in formal English: "Halima solved the equation much faster than _____."',
      c: 'I',
      w: ['me', 'myself', 'mine'],
      e: 'Expand the elliptical clause: "faster than I [solved it]" → formal subjective "I".',
    },
  ],
  'ef-high-time': [
    {
      q: 'Complete: "It is high time we _____ for the airport."',
      c: 'left',
      w: ['leave', 'should leave', 'have left'],
      e: '"It is high time + subject" ALWAYS takes the Simple Past subjunctive ("left").',
    },
    {
      q: 'Complete: "I would rather _____ here, and I would rather you _____ outside."',
      c: 'wait / waited',
      w: ['waited / wait', 'wait / wait', 'to wait / waited'],
      e: 'Same subject ("I") takes bare V₁ ("wait"); a new subject ("you") takes Simple Past V₂ ("waited").',
    },
  ],
  'ef-conditionals': [
    {
      q: 'Complete: "Had I seen the notice on the board, I _____ the seminar."',
      c: 'would have attended',
      w: ['would attend', 'will attend', 'had attended'],
      e: 'Inverted Type 3 ("Had I seen..." = "If I had seen...") pairs with "would have + V₃".',
    },
    {
      q: 'Complete: "If I _____ the Minister of Education, I _____ upgrade every public library."',
      c: 'were / would',
      w: ['was / will', 'am / would', 'had been / will'],
      e: 'Type 2 unreal present uses subjunctive "were" + "would + V₁".',
    },
  ],
  'ef-mandative': [
    {
      q: 'Complete: "The senate panel recommended that the director _____ immediately."',
      c: 'step aside',
      w: ['steps aside', 'stepped aside', 'is stepping aside'],
      e: 'Mandative subjunctive after "recommended that + singular subject" takes bare stem V₁ ("step aside").',
    },
    {
      q: 'Complete: "It is imperative that every candidate _____ seated thirty minutes early."',
      c: 'be',
      w: ['is', 'was', 'has been'],
      e: 'After mandative adjective "imperative that...", use uninflected subjunctive "be".',
    },
  ],
  'ef-question-tags': [
    {
      q: 'Add the correct question tag: "Bisi scarcely ever misses morning prep, _____?"',
      c: 'does she',
      w: ['doesn’t she', 'did she', 'isn’t it'],
      e: 'Semi-negative "scarcely" makes the statement negative, requiring positive tag "does she?".',
    },
    {
      q: 'Add the correct tags: "I am on the list, _____? And let’s leave early, _____?"',
      c: 'aren’t I / shall we',
      w: ['amn’t I / will you', 'aren’t I / don’t we', 'isn’t it / shall we'],
      e: '"I am" takes "aren’t I?", and inclusive "Let’s" takes "shall we?".',
    },
  ],
  'ef-tense-seq': [
    {
      q: 'Complete: "It has been three years since Uncle Kunle _____ from Port Harcourt."',
      c: 'moved',
      w: ['has moved', 'moves', 'had moved'],
      e: 'After temporal "since" marking a past starting point, use Simple Past ("moved").',
    },
    {
      q: 'Complete: "Exhausted from farming, Musa _____ on the mat where he had _____ his hoe."',
      c: 'lay / laid',
      w: ['laid / lain', 'lied / laid', 'lay / lain'],
      e: 'Intransitive recline V₂ = "lay"; transitive place-an-object V₃ ("had ___ his hoe") = "laid".',
    },
  ],
  'ef-voice-speech': [
    {
      q: 'Change to Passive: "Engineers are testing the new solar inverter."',
      c: 'The new solar inverter is being tested by engineers.',
      w: [
        'The new solar inverter is tested by engineers.',
        'The new solar inverter has been tested by engineers.',
        'The new solar inverter was being tested by engineers.',
      ],
      e: 'Present Continuous Active ("are testing") becomes Present Continuous Passive ("is being tested").',
    },
    {
      q: 'Report accurately: "Where are you travelling tomorrow?" she asked me.',
      c: 'She asked me where I was travelling the following day.',
      w: [
        'She asked me where was I travelling the following day.',
        'She asked me where I am travelling tomorrow.',
        'She asked me that where I was travelling the next day.',
      ],
      e: 'Reported wh-questions revert to statement order ("where I was") and shift "tomorrow → the following day".',
    },
  ],
  'ef-phrase-clause': [
    {
      q: 'State the grammatical name & function: "<u>Winning the continental debate trophy</u> brought honour to our school."',
      c: 'Noun phrase; subject of the verb "brought"',
      w: [
        'Noun clause; subject of the verb "brought"',
        'Adjectival phrase; qualifies "honour"',
        'Adverbial phrase; modifies "brought"',
      ],
      e: '"Winning" has no finite auxiliary (→ Phrase) and answers "WHAT brought honour?" → Noun phrase, subject of "brought".',
    },
    {
      q: 'State the grammatical name & function: "The trader <u>in the yellow headscarf</u> sold fresh mangoes."',
      c: 'Adjectival phrase; qualifies the noun "trader"',
      w: [
        'Adverbial phrase of place; modifies "sold"',
        'Adjectival clause; qualifies "trader"',
        'Noun phrase; subject of "sold"',
      ],
      e: 'No finite verb inside, placed right after "trader" to tell WHICH trader → Adjectival phrase qualifying "trader".',
    },
  ],
  'ef-clause-trio': [
    {
      q: 'State the grammatical name & function: "The belief <u>that malaria comes from eating palm oil</u> is false."',
      c: 'Noun clause; in apposition to the noun "belief"',
      w: [
        'Adjectival clause; qualifies the noun "belief"',
        'Adverbial clause of reason; modifies "is"',
        'Noun phrase; in apposition to "belief"',
      ],
      e: 'Fails the "which" test (*"The belief which malaria comes...") and states the content of "belief" → Noun clause in apposition!',
    },
    {
      q: 'State the grammatical name & function: "Everything depends on <u>whether the rain stops before kickoff</u>."',
      c: 'Noun clause; object (complement) of the preposition "on"',
      w: [
        'Adverbial clause of condition; modifies "depends"',
        'Noun phrase; object of "on"',
        'Adjectival clause; qualifies "Everything"',
      ],
      e: 'Contains finite verb "stops" and serves directly as complement of preposition "on" → Noun clause!',
    },
  ],
  'ef-osascomp': [
    {
      q: 'Apply OSASCOMP: "Grandmother gifted me a _____ box."',
      c: 'beautiful little ancient square brown Benin wooden jewellery',
      w: [
        'wooden jewellery Benin brown square ancient little beautiful',
        'little beautiful brown ancient wooden Benin square jewellery',
        'Benin wooden beautiful little ancient square brown jewellery',
      ],
      e: 'Opinion (beautiful) → Size (little) → Age (ancient) → Shape (square) → Colour (brown) → Origin (Benin) → Material (wooden) → Purpose (jewellery).',
    },
    {
      q: 'Complete: "Of the two finalists, Ngozi is _____, and she is two years junior _____ Emeka."',
      c: 'the more articulate / to',
      w: ['the most articulate / than', 'more articulate / than', 'the most articulate / to'],
      e: 'For TWO people use "the + comparative", and Latinate "junior" takes "to" (never "than").',
    },
  ],
  'ef-neg-inversion': [
    {
      q: 'Complete: "Scarcely _____ the auditorium when the power went off."',
      c: 'had we entered',
      w: ['we had entered', 'did we entered', 'had we enter'],
      e: 'Fronted "Scarcely" triggers Past Perfect inversion: "had + subject + V₃".',
    },
    {
      q: 'Complete: "Never before _____ such a thrilling penalty shootout."',
      c: 'have the spectators witnessed',
      w: ['the spectators have witnessed', 'did the spectators witnessed', 'has the spectators witness'],
      e: 'Fronted negative "Never before" requires Subject–Auxiliary inversion ("have the spectators witnessed").',
    },
  ],
  'ef-dangling-parallel': [
    {
      q: 'Choose the sentence with ZERO dangling modifier:',
      c: 'Walking through the laboratory, the teacher noticed a cracked burette.',
      w: [
        'Walking through the laboratory, a cracked burette caught the teacher’s eye.',
        'Covered in hot pepper sauce, Emeka devoured the grilled fish.',
        'Having scored three goals, the stadium cheered the striker.',
      ],
      e: 'Only "the teacher" actually walked through the laboratory and sits right after the comma!',
    },
    {
      q: 'Choose the strictly parallel sentence:',
      c: 'Academic mastery demands reading widely, practising daily, and managing time wisely.',
      w: [
        'Academic mastery demands reading widely, daily practice, and to manage time.',
        'Academic mastery demands to read widely, practising daily, and time management.',
        'He is famous not only for singing and also dances.',
      ],
      e: 'Coordinates three matching "-ing" gerund phrases ("reading..., practising..., and managing...").',
    },
  ],
  'ef-vowel-traps': [
    {
      q: 'Which pair of words shares the EXACT same vowel sound?',
      c: 'bury / leopard  (/e/)',
      w: ['women / woman', 'sew / new', 'blood / food'],
      e: 'Both "bury" (/ˈberi/) and "leopard" (/ˈlepəd/) have short front vowel /e/!',
    },
    {
      q: 'Which pair shares the exact same vowel sound?',
      c: 'colonel / journey  (/ɜː/)',
      w: ['quay / play', 'plait / wait', 'brooch / broom'],
      e: 'Both "colonel" (/ˈkɜːnl/) and "journey" (/ˈdʒɜːni/) contain long central vowel /ɜː/.',
    },
  ],
  'ef-ed-silent': [
    {
      q: 'In which group do ALL THREE words end with the voiceless /t/ sound for "-ed"?',
      c: 'walked, laughed, washed',
      w: ['begged, played, judged', 'wanted, landed, folded', 'robbed, breathed, kissed'],
      e: '/k/, /f/, and /ʃ/ are voiceless, assimilating "-ed" to voiceless /t/.',
    },
    {
      q: 'Identify the silent consonant in each word of: "subtle, receipt, mortgage, sword":',
      c: 'b, p, t, w',
      w: ['t, p, g, r', 'b, c, t, d', 'l, p, t, w'],
      e: '/ˈsʌtl/ (b), /rɪˈsiːt/ (p), /ˈmɔːɡɪdʒ/ (t), /sɔːd/ (w).',
    },
  ],
  'ef-word-stress': [
    {
      q: 'Choose the option where EVERY word has correct primary stress:',
      c: 'COL-league · CA-len-dar · com-MU-ni-cate',
      w: [
        'col-LEAGUE · ca-LEN-dar · com-mu-ni-CATE',
        'COL-league · ca-LEN-dar · com-MU-ni-cate',
        'col-LEAGUE · CA-len-dar · com-mu-ni-CATE',
      ],
      e: '"colleague" and "calendar" stress syllable 1; 4-syllable "-ate" verb "communicate" stresses the 3rd from end.',
    },
    {
      q: 'Choose the right primary stress pair for "photography" and "economic":',
      c: 'pho-TOG-ra-phy / ec-o-NOM-ic',
      w: ['pho-to-GRA-phy / EC-o-nom-ic', 'PHO-to-gra-phy / ec-o-NOM-ic', 'pho-TOG-ra-phy / EC-o-nom-ic'],
      e: '"-phy" stresses 3rd from end (TOG); "-ic" stresses 2nd from end (NOM).',
    },
  ],
  'ef-emphatic-inton': [
    {
      q: 'Emphatic Stress: "Halima baked a CHOCOLATE cake on Sunday." Matching question:',
      c: 'Did Halima bake a vanilla cake on Sunday?',
      w: [
        'Did Amina bake a chocolate cake on Sunday?',
        'Did Halima buy a chocolate cake on Sunday?',
        'Did Halima bake a chocolate cake on Tuesday?',
      ],
      e: 'Replaces ONLY stressed "CHOCOLATE" (with "vanilla") while keeping Halima, bake, cake, and Sunday unchanged.',
    },
    {
      q: 'Which utterance naturally ends with a FALLING tune (↘)?',
      c: 'Why did the referee stop the match?',
      w: [
        'Have you submitted your chemistry workbook?',
        'Could you kindly pass me the ruler, please?',
        'Are the buses still running tonight?',
      ],
      e: 'WH-questions ("Why...?") take a Falling Tune (↘), whereas Yes/No questions and polite requests take a Rising Tune (↗).',
    },
  ],
  'ef-syllable-rhyme': [
    {
      q: 'Give the exact C–V phoneme structure of "queue" and "box":',
      c: 'CCV and CVCC',
      w: ['CVVVV and CVC', 'CV and CVCC', 'CCV and CVC'],
      e: '"queue" = /k-j-uː/ (CCV); "box" = /b-ɒ-k-s/ (CVCC, since "x" = /ks/).',
    },
    {
      q: 'Which word is a perfect phonetic rhyme for "quay" (/kiː/)?',
      c: 'free',
      w: ['way', 'tray', 'buy'],
      e: '"quay" is pronounced /kiː/, rhyming with "free" (/friː/).',
    },
  ],
  'ef-zero-prep': [
    {
      q: 'Choose the completely standard sentence:',
      c: 'The senate discussed the bill with a view to curbing inflation.',
      w: [
        'The senate discussed about the bill with a view to curb inflation.',
        'The flat comprises of three bedrooms.',
        'We congratulated Musa for winning the scholarship.',
      ],
      e: '"discuss" takes no "about", and "with a view to" takes "-ing" ("curbing").',
    },
  ],
  'ef-correlatives': [
    {
      q: 'Complete: "No sooner had the plane landed _____ applause broke out, _____ the two-hour delay."',
      c: 'than / despite',
      w: ['when / despite of', 'than / although', 'before / in spite'],
      e: '"No sooner" locks onto "than", and before a noun phrase ("the two-hour delay") use "despite" (never *"despite of").',
    },
  ],
  'ef-pleonasm-usage': [
    {
      q: 'Choose the sentence 100% free of Nigerian exam usage traps:',
      c: 'Please lend me your pen while we sit in the shade; Tunde is a mature prefect.',
      w: [
        'Please borrow me your pen while we sit under the shade; Tunde is a matured prefect.',
        'Should in case he returns back, pay installmentally.',
        'We attended the late chief’s night wake-keeping.',
      ],
      e: '"lend me", "in the shade", and adjective "mature" are all impeccable exam English.',
    },
  ],
  'ef-paronyms': [
    {
      q: 'Complete: "An _____ jurist warned that biased rulings _____ against public trust."',
      c: 'eminent / militate',
      w: ['imminent / mitigate', 'eminent / mitigate', 'imminent / militate'],
      e: '"eminent" = distinguished/famous; "militate against" = work against/undermine.',
    },
  ],
  'ef-interpretation': [
    {
      q: 'Interpret: "The principal’s speech left no one in doubt, whereas the hostel meals leave much to be desired."',
      c: 'The speech was crystal clear, whereas the hostel meals are unsatisfactory.',
      w: [
        'Everyone doubted the speech, and everyone desires more hostel meals.',
        'Both the speech and the hostel meals were outstanding.',
        'Nobody understood the speech, and the meals were delicious.',
      ],
      e: '"leave no one in doubt" = clear/unambiguous; "leave much to be desired" = poor/inadequate.',
    },
  ],
  'ef-summary-laws': [
    {
      q: 'Which summary response earns FULL marks (5/5) for "State one effect of bush burning"?',
      c: 'Bush burning destroys soil nutrients.',
      w: [
        'Destruction of soil nutrients.',
        'Like a hungry dragon, bush burning wipes out worms, beetles, and humus in Oyo.',
        'Bush burning destroys soil nutrients and pollutes village streams.',
      ],
      e: 'Complete autonomous sentence, concise, own words, and strictly ONE point!',
    },
  ],
  'ef-letter-matrix': [
    {
      q: 'Which letter type has ONE address, NO heading, NO contractions/slang, and closes "Yours sincerely," + FULL NAME?',
      c: 'Semi-formal letter (e.g. to an adult family friend)',
      w: [
        'Formal official letter',
        'Informal letter to a classmate',
        'Article for publication',
      ],
      e: 'Semi-formal keeps 1 address + "Yours sincerely," like informal, but uses polite uncontracted prose + full name.',
    },
  ],
  'ef-article-debate': [
    {
      q: 'How does an Article for Publication in a national newspaper differ structurally from a Letter to the Editor?',
      c: 'An article has NO postal addresses, NO "Dear Sir,", and NO "Yours faithfully," — just Title + Prose + Full Name & Town.',
      w: [
        'An article requires three postal addresses and a stamp.',
        'An article opens with "Mr Chairman, Panel of Judges, Timekeeper...".',
        'A Letter to the Editor has no addresses.',
      ],
      e: 'Articles speak directly to public readers under a title and end with a Name + Town/Class byline.',
    },
  ],
  'ef-figures-mechanics': [
    {
      q: 'Pick the option with 100% accurate spelling AND correct figure of speech for "open secret":',
      c: 'accommodation, pronunciation, privilege  —  Oxymoron',
      w: [
        'accomodation, pronounciation, priviledge  —  Paradox',
        'accommodation, pronounciation, privilege  —  Simile',
        'acommodation, pronunciation, privilege  —  Litotes',
      ],
      e: 'aCCoMModation, pronUNciation, privilege (no d); two adjacent opposites ("open secret") = Oxymoron.',
    },
  ],
};

/**
 * Generates a fresh usage, concord, phonetic, or transformation drill question for any of the 30 English rules.
 */
export function generateEngFormulaQuestion(
  formulaOrId: string | EngFormulaItem,
  seed = 307
): EngFormulaDrillQuestion {
  const rng = makeRng(seed);
  const formulaId = typeof formulaOrId === 'string' ? formulaOrId : formulaOrId.id;
  const meta = ENG_FORMULAS.find((f) => f.id === formulaId) || ENG_FORMULAS[0];
  const hintHtml = `<strong>${meta.rearrangements[0].exprHtml}</strong> — ${meta.trap}`;

  const variations = RULE_VARIATION_BANK[meta.id];
  if (variations && variations.length > 0) {
    const picked = pickOne(variations, rng);
    const { options, answerIdx } = packChoices(picked.c, picked.w, rng);
    return {
      id: `efd-${meta.id}-${seed}`,
      formulaId: meta.id,
      formulaName: meta.name,
      cat: meta.cat,
      promptHtml: picked.q,
      hintHtml,
      options,
      answerIdx,
      explanationHtml: picked.e,
    };
  }

  const fallbackCorrect = meta.worked.ansHtml;
  const fallbackWrongs = ['None of these patterns', 'Violates standard concord', 'Uses non-standard pleonasm'];
  const { options, answerIdx } = packChoices(fallbackCorrect, fallbackWrongs, rng);
  return {
    id: `efd-${meta.id}-${seed}`,
    formulaId: meta.id,
    formulaName: meta.name,
    cat: meta.cat,
    promptHtml: meta.worked.qHtml,
    hintHtml,
    options,
    answerIdx,
    explanationHtml: meta.worked.stepsHtml.join(' → '),
  };
}

export function buildEngFormulaDrillDeck(
  cat: EngFormulaCatId | 'all',
  targetFormulaId: string | null = null,
  count = 8,
  baseSeed = Date.now()
): EngFormulaDrillQuestion[] {
  const focused = targetFormulaId
    ? ENG_FORMULAS.find((f) => f.id === targetFormulaId)
    : undefined;
  const pool = focused
    ? [focused]
    : cat === 'all'
      ? ENG_FORMULAS
      : ENG_FORMULAS.filter((f) => f.cat === cat);
  if (pool.length === 0) return [];
  const rng = makeRng(baseSeed);
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const deck: EngFormulaDrillQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const f = shuffled[i % shuffled.length];
    deck.push(generateEngFormulaQuestion(f, baseSeed + i * 101 + 19));
  }
  return deck;
}

export function extractEngFormulaSpeechScript(
  formula: EngFormulaItem,
  rearrIdx = 0,
  isFirst = false
): string {
  const intro = isFirst
    ? `Welcome to Miss Adaeze's English Rules Studio! Let's master ${formula.name}. `
    : `Let's unpack ${formula.name}. `;
  const activeRearr = formula.rearrangements[rearrIdx] || formula.rearrangements[0];
  const mainPattern = htmlToSpeakableChem(activeRearr?.exprHtml || '');
  const summary = htmlToSpeakableChem(formula.summary);
  const trap = htmlToSpeakableChem(formula.trap);
  return `${intro}${summary} Listen for this structural cue — ${activeRearr?.label ? `${activeRearr.label}: ` : ''}${mainPattern}. And watch out for this classic trap: ${trap}`;
}
