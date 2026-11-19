import type { Beat, IdeaBeat, InteractiveLesson, TeachBeat, TeachBlock, Topic } from '../types';
import { perm } from '../utils/engine';
import { ENG_TOPICS_PART1 } from './engTopicsPart1';
import { ENG_TOPICS_PART2 } from './engTopicsPart2';
import { ENG_TOPICS_PART3 } from './engTopicsPart3';
import { ENG_NERDC_MAP } from './engNerdc2027';

const ENG_TEACH_TABLES: Record<string, { title: string; headers: string[]; rows: string[][] }> = {
  'e-vowels': {
    title: 'Pure Vowel Minimal-Pair & Spelling Trap Reference',
    headers: ['IPA Vowel', 'Length & Position', 'Deceptive WAEC / JAMB Words'],
    rows: [
      ['/iː/ vs /ɪ/', 'Long vs Short Front', 'quay, police, foetus (/iː/) vs women, busy, village (/ɪ/)'],
      ['/e/ vs /æ/', 'Short Mid vs Open Front', 'bury, leopard, said (/e/) vs plait, plaid, marry (/æ/)'],
      ['/ɑː/ vs /ɒ/ vs /ɔː/', 'Back Vowels', 'clerk, heart (/ɑː/) · yacht, cough (/ɒ/) · sword, broad (/ɔː/)'],
      ['/ʌ/ vs /ɜː/ vs /ə/', 'Central Vowels', 'blood, flood (/ʌ/) · journey, colonel (/ɜː/) · police [1st] (/ə/)'],
    ],
  },
  'e-diphthongs': {
    title: '8 Diphthongs & Triphthongs Master Grid',
    headers: ['Glide Class', 'IPA Symbols', 'Exam Benchmark Words'],
    rows: [
      ['Closing → /ɪ/', '/eɪ/, /aɪ/, /ɔɪ/', 'gauge, steak (/eɪ/) · height, aisle (/aɪ/) · buoy, coin (/ɔɪ/)'],
      ['Closing → /ʊ/', '/əʊ/, /aʊ/', 'sew, brooch, soul (/əʊ/) · bough, drought, plough (/aʊ/)'],
      ['Centring → /ə/', '/ɪə/, /eə/, /ʊə/', 'weird, fierce (/ɪə/) · heir, scarce (/eə/) · tour, pure (/ʊə/)'],
      ['Triphthongs', '/aɪə/, /aʊə/, /eɪə/', 'choir, tyre (/aɪə/) · hour, coward (/aʊə/) · player (/eɪə/)'],
    ],
  },
  'e-nouns': {
    title: 'Uncountable Nouns & Pronoun Case Matrix',
    headers: ['Rule Category', 'Wrong Exam Trap', 'Correct Standard Form'],
    rows: [
      ['Mass / Uncountable', '*three equipments / *an advice', 'three pieces of equipment / a piece of advice'],
      ['Preposition + Pronoun', '*Between you and I', 'Between you and me (Objective case)'],
      ['Let + Pronoun', '*Let Tunde and I go', 'Let Tunde and me go (Objective case)'],
      ['Elliptical "than / as"', '*taller than me (informal)', 'taller than I [am] (Formal subjective)'],
    ],
  },
  'e-verbs': {
    title: 'Confusing Verb Triples & Time-Marker Rules',
    headers: ['Base (V₁)', 'Simple Past (V₂)', 'Past Participle (V₃) & Meaning'],
    rows: [
      ['lie (intransitive)', 'lay', 'lain — recline / rest (NO object)'],
      ['lay (transitive)', 'laid', 'laid — put down / lay eggs (NEEDS object)'],
      ['hang (objects vs law)', 'hung / hanged', 'hung (clothes/art) vs hanged (criminal execution)'],
      ['broadcast / cast', 'broadcast / cast', 'broadcast / cast (NEVER *broadcasted)'],
    ],
  },
  'e-concord': {
    title: 'Core Laws of Concord Quick-Switch Table',
    headers: ['Concord Pattern', 'Agreement Target', 'Model Exam Sentence'],
    rows: [
      ['A, as well as / with B', 'Match FIRST subject (A)', 'The captain, with his sailors, IS safe.'],
      ['Neither A nor / Either A or B', 'Match NEARER subject (B)', 'Neither the boys nor their mother WAS told.'],
      ['One of the + Pl. + who', 'PLURAL verb (unless "ONLY one")', 'Ada is one of the girls who HAVE passed.'],
      ['A number vs The number', 'Plural vs Singular', 'A number ARE absent; THE number IS rising.'],
    ],
  },
  'e-adj-adv': {
    title: 'OSASCOMP Royal Order of Adjectives',
    headers: ['Slot', 'Category', 'Examples Before Head Noun'],
    rows: [
      ['1 – 3', 'Det → Opinion → Size', 'two · sleek / lovely · small / tall'],
      ['4 – 6', 'Age → Shape → Colour', 'ancient / new · rectangular · black / crimson'],
      ['7 – 9', 'Origin → Material → Purpose', 'Nigerian / Italian · leather / iron · hunting / sports'],
      ['Latinate -or', 'senior, junior, superior, prefer', 'ALWAYS + "to" (NEVER "more" or "than")'],
    ],
  },
  'e-prep': {
    title: 'High-Frequency Prepositional Collocations',
    headers: ['Expression', 'Exam Trap', 'Standard English'],
    rows: [
      ['Active "comprise"', '*comprises of ten rooms', 'comprises ten rooms (= consists OF ten rooms)'],
      ['Prepositional "to + -ing"', '*look forward to see you', 'look forward to SEEING you'],
      ['Accuse vs Charge', '*accused for / charged of', 'accused OF fraud / charged WITH forgery'],
      ['Concession & Correlatives', '*despite of / *no sooner when', 'despite (= in spite of) / no sooner ... THAN'],
    ],
  },
  'e-lexis-syn': {
    title: 'Crucial Paronyms & Contextual Antonyms',
    headers: ['Confusable Pair', 'Meaning A', 'Meaning B'],
    rows: [
      ['eminent vs imminent', 'famous, respected scholar', 'about to happen very soon'],
      ['militate vs mitigate', 'militate AGAINST = hinder', 'mitigate = lessen severity / alleviate'],
      ['disinterested vs uninterested', 'impartial, unbiased (referee)', 'bored, lacking interest'],
      ['elicit vs illicit', 'draw out a response (verb)', 'unlawful, forbidden (adjective)'],
    ],
  },
  'e-mechanics': {
    title: 'WAEC Mechanical Accuracy Spelling & Punctuation Checklist',
    headers: ['Feature', 'Frequent Error', '100% Accurate Form'],
    rows: [
      ['Doubled Consonants', '*accomodation / *occurence', 'accommodation / occurrence / embarrassment'],
      ['Root Vowel Shift', '*pronounciation / *fourty', 'pronunciation / forty / maintenance / privilege'],
      ['Possessive Pronouns', '*it’s paw / *Yours’ faithfully,', 'its paw / Yours faithfully,'],
      ['Conjunctive Adverb', '*, however, (comma splice)', '; however, (semicolon before, comma after)'],
    ],
  },
  'e-comp-lit': {
    title: 'Authorial Tone & Comprehension Discipline',
    headers: ['Tone Label', 'Textual Signal', 'Meaning'],
    rows: [
      ['Objective / Analytical', 'Balanced statistics, neutral verbs', 'Unbiased, factual examination'],
      ['Satirical / Sarcastic', 'Mock praise ("What a marvel!")', 'Ridiculing folly or incompetence'],
      ['Indignant', 'Moral outrage at injustice', 'Righteously angry'],
      ['Nostalgic', 'Warm memories of bygone days', 'Wistful longing for the past'],
    ],
  },
  'e-informal-let': {
    title: 'Informal vs Semi-Formal Letter Comparison',
    headers: ['Slot', 'Informal (Peer / Sibling)', 'Semi-Formal (Adult Family Friend)'],
    rows: [
      ['Addresses & Heading', '1 address (top-right), NO heading', '1 address (top-right), NO heading'],
      ['Salutation', 'Dear Chidi, / My dear Sister,', 'Dear Mr Okafor, / Dear Mrs Bello,'],
      ['Body Tone', 'Warm, contractions allowed (I’m)', 'Respectful, polite, NO contractions/slang'],
      ['Subscription', 'Yours sincerely, + First Name (Tolu.)', 'Yours sincerely, + Full Name (Tolu Adeyemi.)'],
    ],
  },
  'e-consonants': {
    title: 'Voicing, Silent Letters & "-ed" Inflection Guide',
    headers: ['Phonetic Rule', 'Target Sound', 'WAEC / JAMB Trap Words'],
    rows: [
      ['Dental /θ/ vs /ð/', 'Voiceless vs Voiced', 'breath, worth (/θ/) vs breathe, worthy, smooth (/ð/)'],
      ['Palatal /ʃ/ vs /ʒ/', 'Voiceless vs Voiced', 'chalet, conscience (/ʃ/) vs seizure, leisure, genre (/ʒ/)'],
      ['Silent Consonants', 'Zero articulation', 'subtle, debt (b) · receipt, coup (p) · mortgage (t) · sword (w)'],
      ['Past "-ed" Ending', '/t/ · /d/ · /ɪd/', 'walked, laughed (/t/) · begged (/d/) · wanted (/ɪd/)'],
    ],
  },
  'e-stress': {
    title: 'Word Stress Suffix & Shift Laws',
    headers: ['Rule', 'Stress Position', 'Examples'],
    rows: [
      ['2-Syllable N/Adj vs V', '1st (Noun) vs 2nd (Verb)', 'EX-port / ex-PORT · RE-cord / re-CORD'],
      ['-ion, -ic, -ial, -ian', '2nd from END (Penultimate)', 'in-for-MA-tion, ec-o-NOM-ic (exc: POL-i-tics)'],
      ['-ity, -ate, -phy, -gy, -cy', '3rd from END (Antepenultimate)', 'op-por-TU-ni-ty, com-MU-ni-cate, pho-TOG-ra-phy'],
      ['1st-Syllable Traps', '1st Syllable', 'COL-league, MA-dam, CA-len-dar, MAIN-te-nance'],
    ],
  },
  'e-phrases': {
    title: 'WAEC Grammatical Name & Function: Phrases (No Finite Verb)',
    headers: ['Phrase Name', 'Diagnostic Test', 'Exact WAEC Function Wording'],
    rows: [
      ['Noun Phrase', 'Answers WHO/WHAT ("IT")', 'Subject / Object of the verb "___" · Object of prep. "___"'],
      ['Adjectival Phrase', 'Follows & identifies a Noun', 'Qualifies the noun "___"'],
      ['Adverbial Phrase', 'Answers WHEN/WHERE/HOW/WHY', 'Modifies the verb "___"'],
      ['Appositive NP', 'Renames adjacent Noun inside commas', 'In apposition to the noun "___"'],
    ],
  },
  'e-clauses': {
    title: 'WAEC Grammatical Name & Function: Subordinate Clauses (Has Finite Verb)',
    headers: ['Clause Name', 'Diagnostic Test', 'Exact WAEC Function Wording'],
    rows: [
      ['Noun Clause', 'Replaces "IT" / fails "which"-test', 'Subject / Object of verb · Object of prep. · In apposition'],
      ['Adjectival (Relative)', 'Follows Noun + passes "which/who"', 'Qualifies the noun/pronoun "___"'],
      ['Adverbial Clause', 'Time, Condition, Concession, Result', 'Modifies the verb "___" in the main clause'],
    ],
  },
  'e-modals-tags': {
    title: 'Question Tag Polarity & Special Exceptions',
    headers: ['Statement Pattern', 'Required Tag', 'Why'],
    rows: [
      ['I am punctual,', 'aren’t I?', 'Irregular 1st-person negative tag'],
      ['Let’s revise now,', 'shall we?', 'Inclusive suggestion ("Let us" permission → will you?)'],
      ['She hardly/little knows,', 'does she?', 'Semi-negatives count as NEGATIVE → positive tag!'],
      ['Everyone cheered,', 'didn’t they?', 'Indefinite human pronouns take plural "they"'],
    ],
  },
  'e-voice-speech': {
    title: 'Voice & Reported Speech Transformation Rules',
    headers: ['Transformation', 'Original Form', 'Converted Exam Form'],
    rows: [
      ['Continuous Passive', 'They are painting the hall.', 'The hall IS BEING painted (by them).'],
      ['Reported Wh-Question', '"Where do you live?" he asked.', 'He asked where I LIVED. (Statement order!)'],
      ['Reported Command', '"Don’t touch this wire now!"', '...warned them NOT TO touch THAT wire THEN.'],
      ['Deictic Time Shift', 'yesterday / tomorrow / ago', 'the previous day / the following day / before'],
    ],
  },
  'e-conditionals': {
    title: 'Conditionals & Subjunctive Formula Sheet',
    headers: ['Structure', 'Clause / Trigger', 'Mandatory Verb Form'],
    rows: [
      ['Type 2 (Unreal Now)', 'If I WERE you,', 'I WOULD accept the offer.'],
      ['Type 3 / Inverted', 'If I HAD known / Had I known,', 'I WOULD HAVE stayed at home.'],
      ['Past Subjunctive', 'It is high time + Subject', 'Simple Past V₂ ("It is high time we WENT")'],
      ['Mandative Subjunctive', 'insist / recommend that he...', 'Bare stem V₁ ("...that he BE suspended")'],
    ],
  },
  'e-registers': {
    title: 'High-Yield Exam Registers Snapshot',
    headers: ['Field', 'Core Specialist Terms', 'Key Collocation'],
    rows: [
      ['Law & Courts', 'plaintiff, subpoena, bail, verdict', 'discharged and acquitted · libel vs slander'],
      ['Medicine', 'triage, diagnosis, prognosis, theatre', 'diagnose an ailment · benign vs malignant'],
      ['Finance & Insurance', 'overdraft, dividend, bull market, premium', 'dishonour a cheque · pay an insurance premium'],
      ['Aviation & Media', 'hangar, taxi, runway · blurb, byline', 'taxi along the runway · foreword vs preface'],
    ],
  },
  'e-phrasal-idioms': {
    title: 'Phrasal Verbs & Idioms Decoder',
    headers: ['Expression', 'Trap Distractor', 'True Idiomatic Meaning'],
    rows: [
      ['round off vs round up', 'Swapping speeches & arrests', 'round OFF a speech (end) · round UP suspects (arrest)'],
      ['be taken in / make out', 'Literal indoor / outward sense', 'be deceived · decipher faint writing'],
      ['a white elephant', 'Wildlife / royal prestige', 'Costly, burdensome project of little practical use'],
      ['play to the gallery', 'Theatre music', 'Seek cheap popular applause over substance'],
    ],
  },
  'e-formal-let': {
    title: 'Formal Letter 7-Point WAEC Blueprint',
    headers: ['Element', 'Position & Punctuation', 'Strict Rule'],
    rows: [
      ['Two Addresses + Date', 'Writer top-right; Recipient left', 'Write month in full ("15th November, 2026.")'],
      ['Salutation & Heading', 'Dear Sir, / Dear Madam,', 'ALL CAPS (no underline) OR Title Case (underlined)'],
      ['Register', 'Paragraph 1 = direct purpose', 'ZERO greetings, ZERO contractions, ZERO slang'],
      ['Subscription', 'Bottom right', 'Yours faithfully, + Signature + Full Name'],
    ],
  },
  'e-summary': {
    title: 'WAEC 30-Mark Summary Marking & Penalty Rules',
    headers: ['Summary Rule', 'Error Committed', 'Mark Consequence'],
    rows: [
      ['Autonomous Sentence', 'Writing a phrase ("Poverty.")', 'Loses 50% of the mark for that point'],
      ['Own Words', 'Wholesale verbatim lifting', 'Scores ZERO (0) marks'],
      ['Pruning Lists', 'Copying "yams, maize, millet..."', 'Compress to hypernym ("food/staple crops")'],
      ['One Point per Slot', 'Writing 5 sentences when asked for 3', 'Examiner marks ONLY the first 3 written'],
    ],
  },
  'e-emphatic': {
    title: 'Emphatic Stress & Intonation Decision Matrix',
    headers: ['Feature', 'Trigger', 'Exam Rule'],
    rows: [
      ['Emphatic CAPS Word', 'Musa bought a NEW car.', 'Drop "NEW" in question; contrast it ("OLD / What kind?")'],
      ['Auxiliary CAPS', 'Ada DID submit the form.', 'Matches negative doubt ("Did Ada fail to submit...?")'],
      ['Falling Tune ↘', 'Statements, WH-questions, Commands', '"Where do you live? ↘" (Finality)'],
      ['Rising Tune ↗', 'Yes/No questions, Polite requests, Lists', '"Are you ready? ↗"'],
    ],
  },
  'e-rhyme-rhythm': {
    title: 'Phonetic Rhyme & C–V Syllable Structure',
    headers: ['Word', 'IPA Transcription', 'Rhyme Match & C–V Formula'],
    rows: [
      ['quay / suite', '/kiː/ · /swiːt/', 'Rhymes with free / neat · CV / CCVC'],
      ['queue / cute', '/kjuː/ · /kjuːt/', 'Hidden /j/ counts as C! → CCV / CCVC'],
      ['box / texts', '/bɒks/ · /teksts/', 'Letter "x" = /ks/ (CC)! → CVCC / CVCCCC'],
      ['colonel / draught', '/ˈkɜːnl/ · /drɑːft/', 'Rhymes with journal / laughed'],
    ],
  },
  'e-cloze': {
    title: 'Cloze Collocations & Discourse Connectors',
    headers: ['Collocation / Linker', 'Required Partner', 'Meaning'],
    rows: [
      ['wreak / tender / lodge', 'havoc / apology / complaint', 'Fixed formal verb-noun bonds'],
      ['tantamount / inimical / privy', '+ TO ("synonymous WITH")', 'equivalent to / harmful to / sharing secret'],
      ['on the contrary', 'Follows a NEGATIVE clause', 'Rebuts denial with opposite positive truth'],
      ['albeit / fraught with', 'Concession / Risk', 'although / filled with danger'],
    ],
  },
  'e-modifiers': {
    title: 'Dangling Modifiers, Parallelism & Inversion',
    headers: ['Structure', 'Flawed Trap', 'Corrected Exam Standard'],
    rows: [
      ['Opening Participle', '*Walking home, a snake bit Obi.', 'Walking home, OBI was bitten by a snake.'],
      ['Parallelism', '*reducing waste and job creation', 'reducing waste AND creating jobs'],
      ['Negative Opener', '*Little she knew / *Hardly he left', 'Little DID she know / Hardly HAD he left'],
      ['Only after [clause]', '*Only after he left we saw it', 'Only after he left DID we see it'],
    ],
  },
  'e-figures': {
    title: 'Figures of Speech Contrast Pairs',
    headers: ['Pair', 'Member A', 'Member B'],
    rows: [
      ['Oxymoron vs Paradox', '2 adjacent opposites ("open secret")', 'Full-sentence truth ("Child is father of the man")'],
      ['Synecdoche vs Metonymy', 'Physical part/whole ("seven mouths")', 'Associated symbol ("The Bench warned the Bar")'],
      ['Euphemism vs Litotes', 'Polite softening ("passed away")', 'Negating opposite ("no mean feat" = great)'],
    ],
  },
  'e-comp-crit': {
    title: 'Inference, Pivot Words & Classical Allusions',
    headers: ['Signal / Allusion', 'Reading Strategy / Meaning', 'Trap to Avoid'],
    rows: [
      ['"Critics claim X; yet Y"', 'Author’s real view is Y (after pivot)', 'Picking X as the author’s opinion'],
      ['Pyrrhic victory', 'Win achieved at ruinous cost', 'Reading as an easy triumph'],
      ['Achilles’ heel / Rubicon', 'Fatal weakness / Point of no return', 'Literal anatomy or geography'],
    ],
  },
  'e-essays': {
    title: 'Continuous Writing Genre Matrix (450+ Words)',
    headers: ['Essay Genre', 'Opening & Closing', 'Core Discipline'],
    rows: [
      ['Debate (Argumentative)', 'Ranked Vocatives → "Thank you."', 'Take ONE firm side + rebut opponent'],
      ['Expository Essay', 'Neat Title ONLY (no vocatives)', 'Objective explanation of process/causes'],
      ['Narrative (Proverb)', 'Title + Past-tense plot', 'Plot climax must prove the exact proverb'],
    ],
  },
  'e-speech-art': {
    title: 'Article for Publication vs Letter to the Editor vs Speech',
    headers: ['Feature', 'Newspaper / School Article', 'Letter to the Editor'],
    rows: [
      ['Addresses & Salutation', 'ZERO addresses, ZERO "Dear Sir"', '2 addresses + "Dear Sir,"'],
      ['Top Heading', 'Catchy Title at the top', 'Formal Subject Heading after "Dear Sir,"'],
      ['Ending', 'Full Name + Town / Class ("Kano." / "SS 3A")', 'Yours faithfully, + Signature + Full Name'],
    ],
  },
  'e-usage-traps': {
    title: 'Nigerian Exam Usage Traps vs Standard English',
    headers: ['Non-Standard Trap', 'Why It Fails', 'WAEC / JAMB Standard Form'],
    rows: [
      ['*return back / *night vigil', 'Pleonasm / tautology', 'return / vigil'],
      ['*should in case / *can be able', 'Double modal/conjunction', 'in case (or should...) / can (or is able)'],
      ['*matured man / *wake-keeping', 'Wrong form', 'a MATURE man / Christian WAKE (or wake-keep)'],
      ['*borrow me / *under the shade', 'Lexical/preposition error', 'LEND me / IN the shade (of a tree)'],
    ],
  },
  'e-register-syn': {
    title: 'High-Yield Sentence Interpretation Structures',
    headers: ['Prompt Structure', 'Exact Interpretation', 'Classic Distractor'],
    rows: [
      ['For all his wealth,...', 'Despite his wealth,...', '*Because of his wealth'],
      ['could not help laughing', 'Could not resist laughing (DID laugh)', '*Refused to assist'],
      ['all but dried up', 'Almost completely dried up', '*Everything except it dried'],
      ['leaves much to be desired', 'Is unsatisfactory / below standard', '*Is highly desirable'],
    ],
  },
};

function buildInteractiveForEngTopic(topic: Topic): InteractiveLesson {
  const meta = ENG_NERDC_MAP[topic.id];
  const tableSpec = ENG_TEACH_TABLES[topic.id];

  return {
    title: topic.name,
    goals: topic.goals,
    trap: topic.trap,
    parts: topic.parts.map((part, pIdx) => {
      const beats: Beat[] = [];

      // 1. Concept & Rules Beat
      const ideaBeat: IdeaBeat = {
        k: 'idea',
        kl: meta ? `${meta.classId.toUpperCase()} · ${meta.termLabel}` : topic.sec,
        title: part.title,
        idea: part.idea,
        rules: part.rules,
        rh: 'Core Exam Principles',
      };
      beats.push(ideaBeat);

      // 2. Structured Study Table + Exam Watchout TeachBeat on Part 0
      if (pIdx === 0 && tableSpec) {
        const body: TeachBlock[] = [
          ['h', tableSpec.title],
          ['tb', tableSpec.headers, tableSpec.rows],
          ['wn', `<b>WAEC & JAMB Watchout:</b> ${topic.trap}`],
        ];
        const teachBeat: TeachBeat = {
          k: 'teach',
          kl: 'Mastery Comparison Chart',
          title: tableSpec.title,
          body,
        };
        beats.push(teachBeat);
      }

      // 3. Guided Worked Analysis (FadeBeat)
      const fadeSteps = part.ex.steps.map((st, sIdx) => {
        const isLast = sIdx === part.ex.steps.length - 1;
        if (isLast && part.ex.why) {
          const [, wq, wo, wfb] = part.ex.why;
          return {
            m: st[0],
            why: st[1],
            whyQ: {
              q: wq,
              o: wo,
              a: 0,
              fb: wfb,
            },
          };
        }
        return {
          m: st[0],
          why: st[1],
        };
      });

      beats.push({
        k: 'fade',
        kl: 'Worked Exam Analysis',
        lv: pIdx === 0 ? 'full' : 'one',
        title: `Worked Example — ${part.title}`,
        q: part.ex.q,
        steps: fadeSteps,
      });

      // 4. Error-Spotting Beat (if attached to this part)
      if (topic.spot && topic.spot.part === pIdx) {
        const sp = shuffleMcq(
          `spot|${topic.id}|${pIdx}`,
          topic.spot.o,
          topic.spot.a ?? 0,
          topic.spot.fb
        );
        beats.push({
          k: 'spot',
          kl: 'Spot the Exam Trap',
          title: `Audit ${topic.spot.who}’s Working`,
          who: topic.spot.who,
          q: topic.spot.q,
          lines: topic.spot.lines,
          bad: topic.spot.bad,
          okfb: topic.spot.okfb,
          o: sp.o,
          a: sp.a,
          fb: sp.fb || ['', '', '', ''],
          h: topic.spot.h,
          fix: topic.spot.fix,
        });
      }

      // 5. Mastery Check Beat from part.tryit
      const defaultFb = part.tryit.o.map((_, idx) =>
        idx === part.tryit.a ? `Spot on! ${part.tryit.e}` : `Watch the rule: ${part.tryit.e}`
      );
      const cp = shuffleMcq(
        `tryit|${topic.id}|${pIdx}`,
        part.tryit.o,
        part.tryit.a,
        part.tryit.fb || defaultFb
      );
      beats.push({
        k: 'check',
        kl: 'Quick Exam Check',
        title: `Your Turn — ${part.title}`,
        q: part.tryit.q,
        o: cp.o,
        a: cp.a,
        fb: cp.fb || defaultFb,
        h: [part.tryit.h],
      });

      return {
        title: part.title,
        beats,
      };
    }),
  };
}

function shuffleMcq(
  key: string,
  o: string[],
  a: number,
  fb?: string[]
): { o: string[]; a: number; fb?: string[] } {
  const order = perm(key, o.length);
  return {
    o: order.map((idx) => o[idx]),
    a: Math.max(0, order.indexOf(a)),
    fb: fb ? order.map((idx) => fb[idx] ?? '') : undefined,
  };
}

export function buildEngCurriculum(): {
  topics: Topic[];
  il: Record<string, InteractiveLesson>;
} {
  const rawTopics: Topic[] = [
    ...ENG_TOPICS_PART1,
    ...ENG_TOPICS_PART2,
    ...ENG_TOPICS_PART3,
  ];

  // Deterministically permute MCQ options so correct answers aren't always index 0
  const topics: Topic[] = rawTopics.map((topic) => ({
    ...topic,
    qs: topic.qs.map((q, qIdx) => {
      const p = shuffleMcq(`q|${topic.id}|${qIdx}`, q.o, q.a, q.w);
      return {
        ...q,
        o: p.o,
        a: p.a,
        w: p.fb,
      };
    }),
  }));

  const il: Record<string, InteractiveLesson> = {};
  for (const t of rawTopics) {
    il[t.id] = buildInteractiveForEngTopic(t);
  }

  return { topics, il };
}
