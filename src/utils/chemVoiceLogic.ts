import type { Beat, LabStep, LegacyPart, Question, SubjectId, TeachBlock, Topic } from '../types';
import { getSubjectTutor } from './tutorRegistry';

export interface ChemLessonVoiceContext {
  topicName: string;
  sectionName?: string;
  partTitle?: string;
  stepLabel?: string;
  stepText: string;
  examTrap?: string;
  goals?: string[];
}

const SUBSCRIPT_MAP: Record<string, string> = {
  '₀': '0',
  '₁': '1',
  '₂': '2',
  '₃': '3',
  '₄': '4',
  '₅': '5',
  '⁶': '6',
  '₆': '6',
  '₇': '7',
  '₈': '8',
  '₉': '9',
  '₊': '+',
  '₋': '-',
};

const SUPERSCRIPT_MAP: Record<string, string> = {
  '⁰': '0',
  '¹': '1',
  '²': '2',
  '³': '3',
  '⁴': '4',
  '⁵': '5',
  '⁶': '6',
  '⁷': '7',
  '⁸': '8',
  '⁹': '9',
  '⁺': ' plus ',
  '⁻': ' minus ',
};

/**
 * Converts rich HTML, Naira amounts, statistical symbols, Chemistry & Math notation
 * into natural spoken English so Gemini TTS pronounces every concept cleanly.
 */
export function htmlToSpeakableChem(rawHtml: string): string {
  if (!rawHtml) return '';

  let s = rawHtml;

  // Convert stacked HTML fractions <span class="fr"><span>num</span><span>den</span></span> or nested fr-num/fr-den
  s = s.replace(
    /<span[^>]*class="[^"]*\bfr(?:-sup)?\b[^"]*"[^>]*>\s*<span[^>]*>([\s\S]*?)<\/span>\s*<span[^>]*>([\s\S]*?)<\/span>\s*<\/span>/gi,
    (_m, num, den) => ` ${num} over ${den} `
  );

  // Convert vinculum radicals <span class="m-rad">...</span>
  s = s.replace(
    /<span[^>]*class="[^"]*\bm-rad\b[^"]*"[^>]*>(?:<sup[^>]*>([\s\S]*?)<\/sup>)?\s*<span[^>]*>√<\/span>\s*<span[^>]*>([\s\S]*?)<\/span>\s*<\/span>/gi,
    (_m, idx, body) =>
      idx ? ` ${idx === '3' ? 'cube' : `${idx}th`} root of ${body} ` : ` square root of ${body} `
  );

  // Convert HTML matrices <span class="mx">...</span> into readable rows
  s = s.replace(
    /<span[^>]*class="[^"]*\bmx\b[^"]*"[^>]*>([\s\S]*?)<\/span>/gi,
    (_m, inner) => {
      const cleaned = String(inner)
        .replace(/<\/span>\s*<span[^>]*>/gi, ', ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      return ` matrix ${cleaned} `;
    }
  );

  // Convert <sub>...</sub> and <sup>...</sup> into spaced tokens
  s = s.replace(/<sub>([\s\S]*?)<\/sub>/gi, (_m, inner) => ` ${inner} `);
  s = s.replace(/<sup>([\s\S]*?)<\/sup>/gi, (_m, inner) => {
    const cleaned = String(inner)
      .replace(/\+/g, ' plus ')
      .replace(/[-−]/g, ' minus ');
    return ` ${cleaned} `;
  });

  // Replace block boundaries with sentence pauses
  s = s.replace(/<\/(p|li|h3|div|tr)>/gi, '. ');
  s = s.replace(/<br\s*\/?>/gi, ', ');

  // Strip remaining HTML tags
  s = s.replace(/<[^>]+>/g, ' ');

  // Decode common HTML entities
  s = s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, ' and ')
    .replace(/&lt;/g, ' less than ')
    .replace(/&gt;/g, ' greater than ')
    .replace(/&minus;/g, ' minus ')
    .replace(/&times;/g, ' times ')
    .replace(/&divide;/g, ' divided by ')
    .replace(/&rarr;/g, ' yields ')
    .replace(/&harr;/g, ' is in equilibrium with ');

  // Convert Naira currency amounts naturally (e.g. ₦5,000 -> 5,000 naira, ₦40bn -> 40 billion naira)
  s = s.replace(/₦\s*([\d,.]+)\s*bn\b/gi, ' $1 billion naira ');
  s = s.replace(/₦\s*([\d,.]+)\s*(billion|million|trillion)\b/gi, ' $1 $2 naira ');
  s = s.replace(/₦\s*([\d,.]+)/g, ' $1 naira ');
  s = s.replace(/₦/g, ' naira ');

  // Convert agronomic and scientific per-hectare / per-dm3 units cleanly before superscript conversion
  s = s
    .replace(/\bt\s*ha⁻¹/g, ' tonnes per hectare ')
    .replace(/\bkg\s*ha⁻¹/g, ' kilograms per hectare ')
    .replace(/\bmol\s*dm⁻³/g, ' moles per cubic decimetre ')
    .replace(/\bg\s*dm⁻³/g, ' grams per cubic decimetre ');

  // Convert agronomic and scientific per-hectare / per-dm3 units cleanly before superscript conversion
  s = s
    .replace(/\bt\s*ha⁻¹/g, ' tonnes per hectare ')
    .replace(/\bkg\s*ha⁻¹/g, ' kilograms per hectare ')
    .replace(/\bmol\s*dm⁻³/g, ' moles per cubic decimetre ')
    .replace(/\bg\s*dm⁻³/g, ' grams per cubic decimetre ');

  // Convert Unicode subscripts and superscripts
  s = s.replace(/[₀₁₂₃₄₅₆₇₈₉₊₋]/g, (ch) => ` ${SUBSCRIPT_MAP[ch] ?? ch} `);
  s = s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻]/g, (ch) => ` ${SUPERSCRIPT_MAP[ch] ?? ch} `);

  // Convert common Oral English IPA transcriptions in slashes into natural spoken cues
  s = s.replace(/\/([^/\s]{1,5})\//g, (_m, ipa: string) => {
    const IPA_SPOKEN: Record<string, string> = {
      'iː': 'long ee sound',
      'ɪ': 'short ih sound',
      'e': 'short eh sound',
      'æ': 'short ah sound as in cat',
      'ɑː': 'long ah sound as in father',
      'ɒ': 'short oh sound as in pot',
      'ɔː': 'long aw sound as in law',
      'ʊ': 'short oo sound as in book',
      'uː': 'long oo sound as in food',
      'ʌ': 'central uh sound as in cup',
      'ɜː': 'long er sound as in bird',
      'ə': 'schwa sound',
      'eɪ': 'ay diphthong',
      'aɪ': 'eye diphthong',
      'ɔɪ': 'oy diphthong',
      'əʊ': 'oh diphthong',
      'aʊ': 'ow diphthong',
      'ɪə': 'ear diphthong',
      'eə': 'air diphthong',
      'ʊə': 'oor diphthong',
      'θ': 'voiceless th sound as in thin',
      'ð': 'voiced th sound as in this',
      'ʃ': 'sh sound as in shoe',
      'ʒ': 'zh sound as in measure',
      'tʃ': 'ch sound as in church',
      'dʒ': 'j sound as in judge',
      'ŋ': 'ng nasal sound as in sing',
      'j': 'y glide sound as in yes',
    };
    return ` ${IPA_SPOKEN[ipa] || `sound ${ipa}`} `;
  });

  // Statistical x-bar symbol
  s = s.replace(/x̄/g, ' x bar ');

  // Convert chemistry reaction arrows, statistical symbols & math operators
  s = s
    .replace(/⇌|↔/g, ' is in reversible equilibrium with ')
    .replace(/⇔/g, ' if and only if ')
    .replace(/⇒/g, ' implies ')
    .replace(/→|⟶/g, ' reacts to form ')
    .replace(/↑/g, ' gas evolved ')
    .replace(/↓/g, ' precipitate ')
    .replace(/ΔH/g, ' delta H ')
    .replace(/ΔG/g, ' delta G ')
    .replace(/ΔS/g, ' delta S ')
    .replace(/Δ/g, ' change in ')
    .replace(/°C/g, ' degrees Celsius ')
    .replace(/°/g, ' degrees ')
    .replace(/×/g, ' times ')
    .replace(/÷/g, ' divided by ')
    .replace(/−/g, ' minus ')
    .replace(/±/g, ' plus or minus ')
    .replace(/≤/g, ' is less than or equal to ')
    .replace(/≥/g, ' is greater than or equal to ')
    .replace(/≠/g, ' is not equal to ')
    .replace(/≡/g, ' is congruent to ')
    .replace(/≈/g, ' is approximately ')
    .replace(/√/g, ' square root of ')
    .replace(/π/g, ' pi ')
    .replace(/σ/g, ' sigma ')
    .replace(/θ/g, ' theta ')
    .replace(/α/g, ' alpha ')
    .replace(/β/g, ' beta ')
    .replace(/λ/g, ' lambda ')
    .replace(/∫/g, ' the integral of ')
    .replace(/∑|Σ/g, ' sum of ')
    .replace(/∩/g, ' intersection ')
    .replace(/∪/g, ' union ')
    .replace(/∈/g, ' is an element of ')
    .replace(/⊂/g, ' is a subset of ')
    .replace(/∞/g, ' infinity ')
    .replace(/′/g, ' prime ');

  // Expand state symbols like (aq), (s), (l), (g) when attached to formulas
  s = s
    .replace(/\(aq\)/gi, ' aqueous ')
    .replace(/\(g\)/g, ' gas ')
    .replace(/\(l\)/g, ' liquid ')
    .replace(/\(s\)/g, ' solid ');

  // Space out compact multi-capital chemical formulas with digits (e.g. H2SO4 -> H 2 S O 4)
  s = s.replace(/\b([A-Z][a-z]?\d+){1,}[A-Z0-9a-z]*\b/g, (formula) => {
    return formula.replace(/([A-Z][a-z]?|\d+)/g, '$1 ').trim();
  });

  // Collapse extra whitespace and repeated punctuation
  s = s
    .replace(/\s*\.\s*\./g, '.')
    .replace(/\s+/g, ' ')
    .trim();

  return s;
}

/**
 * Extracts at most `maxSentences` crisp sentences from a longer note paragraph
 * so the teacher explains the core intuition instead of reading printed prose word-for-word.
 */
function takeCoreSentences(raw: string, maxSentences = 2, maxChars = 280): string {
  const cleaned = raw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (!cleaned) return '';
  const sentences = cleaned.match(/[^.!?]+[.!?]+/g);
  if (!sentences || sentences.length === 0) {
    return cleaned.length <= maxChars ? cleaned : `${cleaned.slice(0, maxChars).trim()}.`;
  }
  let acc = '';
  let count = 0;
  for (const s of sentences) {
    const trimmed = s.trim();
    if (!trimmed) continue;
    if (count > 0 && acc.length + trimmed.length > maxChars) break;
    acc = acc ? `${acc} ${trimmed}` : trimmed;
    count += 1;
    if (count >= maxSentences) break;
  }
  return acc || sentences[0].trim();
}

/**
 * Synthesizes a TeachBeat's blocks like a real classroom teacher — coaching how to read
 * comparison tables and spotlighting warnings/keys instead of reading every table cell verbatim.
 */
function coachTeachBlocks(blocks: TeachBlock[]): string {
  const insights: string[] = [];
  let paragraphAdded = false;

  for (const block of blocks) {
    switch (block[0]) {
      case 'p': {
        if (!paragraphAdded) {
          insights.push(takeCoreSentences(block[1], 2, 240));
          paragraphAdded = true;
        }
        break;
      }
      case 'key':
        insights.push(`Pause and lock in this anchor principle: ${takeCoreSentences(block[1], 1, 200)}`);
        break;
      case 'wn':
        insights.push(`Watch out for this classic trap: ${takeCoreSentences(block[1], 1, 210)}`);
        break;
      case 'eg':
        insights.push(`Picture a concrete case — ${block[1]}: ${takeCoreSentences(block[2], 1, 180)}`);
        break;
      case 'fig':
        if (block[2]) {
          insights.push(`Trace the diagram on your screen and notice how ${takeCoreSentences(block[2], 1, 170)}`);
        }
        break;
      case 'li':
      case 'ol':
        if (block[1].length > 0 && !paragraphAdded) {
          insights.push(`Anchor first on ${takeCoreSentences(block[1][0], 1, 170)}`);
          paragraphAdded = true;
        }
        break;
      case 'tb': {
        const headers = block[1];
        const rows = block[2];
        if (rows.length >= 2) {
          const r0 = rows[0][0];
          const r1 = rows[1][0];
          const dim = headers[1] || headers[2] || 'key properties';
          insights.push(
            `Instead of cramming every cell in the table on your screen, contrast ${r0} directly against ${r1} across ${dim} — once you see why they differ, the whole chart makes sense.`
          );
        } else if (rows.length === 1) {
          insights.push(`Use the summary chart on screen to anchor ${rows[0][0]}.`);
        }
        break;
      }
      case 'h':
      default:
        break;
    }
  }

  return insights.filter(Boolean).join(' ');
}

function clipSpeechScript(spoken: string, maxLen = 920): string {
  if (spoken.length <= maxLen) return spoken;
  const clipped = spoken.slice(0, maxLen - 20);
  const lastStop = Math.max(clipped.lastIndexOf('. '), clipped.lastIndexOf('! '), clipped.lastIndexOf('? '));
  return lastStop > 280 ? clipped.slice(0, lastStop + 1) : `${clipped}...`;
}

/**
 * Extracts a vivid, mentor-style teaching script from any lesson beat across all 7 subjects.
 * Introduces the studio & topic ONLY on Step 1 (isFirstStep === true), and teaches concepts
 * conversationally rather than reading raw lists or table cells verbatim.
 */
export function extractBeatSpeechScript(
  beat: Beat,
  topicName: string,
  partTitle?: string,
  isFirstStep = false,
  subj: SubjectId = 'chem'
): string {
  const parts: string[] = [];
  const isChem = subj === 'chem';
  const isMath = subj === 'maths';
  const isFMath = subj === 'fmaths';
  const isPhys = subj === 'phys';
  const isBio = subj === 'bio';
  const isAgric = subj === 'agric';
  const isGeog = subj === 'geog';
  const isEcon = subj === 'econ';
  const isEng = subj === 'eng';
  const isCivic = subj === 'civic';
  const isDigiTech = subj === 'digitech';
  const isDataProc = subj === 'dataproc';
  const tutor = getSubjectTutor(subj);

  if (isFirstStep && topicName) {
    parts.push(`Topic focus: ${topicName}`);
  }

  if (beat.k === 'teach') {
    if (beat.title) parts.push(`Let's unpack ${beat.title} together`);
    const coached = coachTeachBlocks(beat.body);
    if (coached) parts.push(coached);
  } else if (beat.k === 'idea') {
    const heading = beat.title || partTitle;
    if (heading) {
      parts.push(isFirstStep ? `Picture the core idea behind ${heading}` : `Now see how this builds into ${heading}`);
    }
    if (beat.idea) {
      parts.push(takeCoreSentences(beat.idea, 2, 290));
    }
    if (beat.laws && beat.laws.length > 0) {
      const [lawName, lawStmt] = beat.laws[0];
      parts.push(`Anchor your thinking on ${lawName}: ${takeCoreSentences(lawStmt, 1, 190)}`);
    } else if (beat.defs && beat.defs.length > 0) {
      const [term, def] = beat.defs[0];
      parts.push(`Notice the exact meaning of ${term}: ${takeCoreSentences(def, 1, 180)}`);
    }
    if (beat.rules && beat.rules.length > 0) {
      parts.push(`Above all, keep this principle sharp: ${takeCoreSentences(beat.rules[0], 1, 200)}`);
    }
  } else if (beat.k === 'explore') {
    if (beat.title) parts.push(`Let's experiment live with ${beat.title}`);
    parts.push(takeCoreSentences(beat.intro, 2, 240));
    if (beat.predict) {
      parts.push(`Pause and predict before touching a control: ${beat.predict.q}`);
    } else if (beat.tasks.length > 0) {
      parts.push(`Try ${beat.tasks[0].t} on the interactive board and watch what changes!`);
    }
  } else if (beat.k === 'dayo') {
    const startSay = beat.nodes.start?.say;
    if (startSay) parts.push(startSay);
  } else if (beat.k === 'fade') {
    parts.push(`Let's reason through this worked example from first principles rather than memorizing steps`);
    const firstStep = beat.steps[0];
    const lastStep = beat.steps[beat.steps.length - 1];
    if (firstStep) {
      parts.push(`Start by setting up ${firstStep.ask || firstStep.m}${firstStep.why ? ` — because ${firstStep.why}` : ''}`);
    }
    if (lastStep && lastStep !== firstStep) {
      parts.push(
        `Then watch the decisive move at the end: ${lastStep.why ? `${lastStep.why}, landing cleanly on ` : ''}${lastStep.ask || lastStep.m}`
      );
    }
  } else if (beat.k === 'spot') {
    parts.push(
      `Put on your teacher's red pen! ${beat.who} attempted this problem, and one line hides a classic ${
        isDataProc
          ? 'Data Processing'
          : isDigiTech
            ? 'Digital Technologies'
            : isCivic
              ? 'Civic Education'
              : isEng
                ? 'English usage'
                : isEcon
                  ? 'Economics'
                  : isGeog
                    ? 'Geography'
                    : isAgric
                      ? 'Agricultural Science'
                      : isBio
                        ? 'Biology'
                        : isPhys
                          ? 'Physics'
                          : isFMath
                            ? 'Further Mathematics'
                            : isMath
                              ? 'working'
                              : isChem
                                ? 'Chemistry'
                                : tutor.name
      } trap. Scan each step carefully and tap the exact line where the reasoning went off track!`
    );
  } else if (beat.k === 'check') {
    parts.push(
      `${
        isDataProc
          ? 'Your turn at the Database & SQL console!'
          : isDigiTech
            ? 'Your turn at the Digital Architecture bench!'
            : isCivic
              ? 'Your turn in the Civic Chambers!'
              : isEng
                ? 'Your turn in the English Studio!'
                : isEcon
                  ? 'Your turn at the Economics policy desk!'
                  : isGeog
                    ? 'Your turn at the Cartography desk!'
                    : isAgric
                      ? 'Your turn on the Agronomy bench!'
                      : isBio
                        ? 'Your turn on the Biology bench!'
                        : isPhys
                          ? 'Your turn on the Physics bench!'
                          : isFMath
                            ? 'Your turn at the Calculus board!'
                            : isMath
                              ? 'Your turn at the chalkboard!'
                              : isChem
                                ? 'Your turn to test the beaker!'
                                : `Your turn in the ${tutor.studioLabel}!`
      } Ask yourself what principle is at work before looking at the options: ${takeCoreSentences(beat.q, 2, 240)}`
    );
  }

  return clipSpeechScript(htmlToSpeakableChem(parts.join('. ')), 920);
}

/**
 * Formats Lab step speech script for Chemistry, Physics, Biology, Agricultural Science, and Maths Labs.
 * Introduces the lab & experiment ONLY on Step 1 (stepIdx === 0); Steps 2+ coach the step directly.
 */
export function extractLabStepSpeechScript(
  labName: string,
  stepIdx: number,
  step: LabStep,
  tip?: string,
  isLast?: boolean,
  subj: SubjectId = 'chem'
): string {
  const cleanName = labName.replace(/<[^>]+>/g, '').trim();
  const lead =
    stepIdx === 0
      ? `Investigation: ${cleanName}. Step 1:`
      : `Step ${stepIdx + 1}:`;

  const raw = [lead, step.say, isLast && tip ? `Practical tip: ${tip}` : '']
    .filter(Boolean)
    .join(' ');
  return clipSpeechScript(htmlToSpeakableChem(raw), 900);
}

/**
 * Formats Today's Mission voice briefing on the Home screen for all 7 subjects.
 */
export function extractMissionSpeechScript(
  topicName: string,
  stage: 'lesson' | 'practice' | 'boss',
  gain: number,
  trap?: string,
  subj: SubjectId = 'chem'
): string {
  const isChem = subj === 'chem';
  const isMath = subj === 'maths';
  const isFMath = subj === 'fmaths';
  const isPhys = subj === 'phys';
  const isBio = subj === 'bio';
  const isAgric = subj === 'agric';
  const isGeog = subj === 'geog';
  const isEcon = subj === 'econ';
  const isEng = subj === 'eng';
  const isCivic = subj === 'civic';
  const isDigiTech = subj === 'digitech';
  const isDataProc = subj === 'dataproc';
  const tutor = getSubjectTutor(subj);
  const subjLabel = tutor.name;
  const stageLine =
    stage === 'lesson'
      ? `Jump into the guided lesson on ${topicName} — mastering this unlocks up to plus ${gain} percent on your mastery score.`
      : stage === 'practice'
        ? `Tackle 6 progressive ${subjLabel} questions on ${topicName} for up to plus ${gain} percent on your mastery score.`
        : `You're ready for the timed Topic Test on ${topicName} to lock in up to plus ${gain} percent!`;
  const parts = [
    `Your ${subjLabel} focus today is ${topicName}.`,
    stageLine,
    trap ? `Stay sharp against this classic trap: ${takeCoreSentences(trap, 1, 210)}` : '',
  ].filter(Boolean);
  return clipSpeechScript(htmlToSpeakableChem(parts.join(' ')), 850);
}

/**
 * Formats a Topic Hub voice briefing like a seasoned subject mentor framing the big picture & #1 trap.
 */
export function extractTopicOverviewSpeechScript(topic: Topic): string {
  const topGoals = topic.goals.slice(0, 2).join('; and ');
  const parts: string[] = [
    `Let's map out how to master ${topic.name}.`,
    topGoals
      ? `Everything in this topic revolves around two core abilities: ${topGoals}.`
      : '',
    topic.trap
      ? `Most learners slip here on one subtle trap — ${takeCoreSentences(topic.trap, 2, 230)}`
      : '',
    `Start with the study notes or interactive lesson to build real intuition first, then test your mastery!`,
  ].filter(Boolean);
  return clipSpeechScript(htmlToSpeakableChem(parts.join(' ')), 880);
}

export interface NoteChapterExtraBlocks {
  defs?: [string, string][];
  laws?: [string, string][];
  teaches?: { title?: string; body: TeachBlock[] }[];
  explores?: { title?: string; intro: string }[];
  trap?: string;
}

/**
 * Teaches the current Study Notes chapter like a warm, Socratic master classroom teacher (~35–50 seconds)
 * instead of reading the entire printed notes page word-for-word:
 * 1. Opens with a vivid real-world or conceptual hook so the learner sees WHY the chapter matters.
 * 2. Unpacks the core intuition and spotlights the single governing principle / equation on screen.
 * 3. Walks the learner's eye across the decisive turning point in the worked example (not every line).
 * 4. Calls out the #1 conceptual trap and poses a quick mental check question.
 */
export function extractNotePartSpeechScript(
  topicName: string,
  partIdx: number,
  part: LegacyPart,
  extra?: NoteChapterExtraBlocks
): string {
  const parts: string[] = [
    partIdx === 0
      ? `Come closer — let's teach through ${topicName}, starting with ${part.title}, rather than just reading the page.`
      : `Now watch how Chapter ${partIdx + 1}, ${part.title}, builds directly on what we just learned.`,
  ];

  // 1. Core intuition (distilled to the key idea with teacher warmth)
  const coreIntuition = takeCoreSentences(part.idea, 2, 280);
  if (coreIntuition) {
    parts.push(`Picture the big idea first: ${coreIntuition}`);
  }

  // 2. Anchor rule, law, or chart contrast on this screen (never dumping whole tables or bullet lists!)
  const hasTable = extra?.teaches?.some((tb) => tb.body.some((b) => b[0] === 'tb'));
  if (extra?.laws && extra.laws.length > 0) {
    const [lawName, lawStmt] = extra.laws[0];
    parts.push(`Everything here obeys ${lawName}: ${takeCoreSentences(lawStmt, 1, 190)}`);
  } else if (part.rules.length > 0) {
    parts.push(`Look at the highlighted equation or rule on your screen — here is why it works: ${takeCoreSentences(part.rules[0], 1, 200)}`);
  } else if (extra?.defs && extra.defs.length > 0) {
    const [term, def] = extra.defs[0];
    parts.push(`Keep the exact distinction of ${term} crystal clear: ${takeCoreSentences(def, 1, 180)}`);
  }

  if (hasTable && extra?.teaches) {
    for (const tb of extra.teaches) {
      const tbBlock = tb.body.find((b) => b[0] === 'tb');
      if (tbBlock && tbBlock[0] === 'tb' && tbBlock[2].length >= 2) {
        parts.push(
          `Glance at the comparison chart on your screen and contrast ${tbBlock[2][0][0]} against ${tbBlock[2][1][0]} — spotting that boundary is what separates deep understanding from guesswork.`
        );
        break;
      }
    }
  } else if (extra?.explores && extra.explores.length > 0) {
    parts.push(`Drag the live simulation controls on this page and watch that relationship respond in real time.`);
  }

  // 3. Coach the decisive move in the worked example on screen (instead of reading Step 1, Step 2, Step 3 verbatim)
  if (part.ex && part.ex.steps.length > 0) {
    const lastStep = part.ex.steps[part.ex.steps.length - 1];
    const pivotStep =
      part.ex.steps.find(([, why]) => Boolean(why && why.trim())) || part.ex.steps[0];
    if (pivotStep && pivotStep[1]) {
      parts.push(
        `Now trace the worked example with me: notice why the key step works — ${takeCoreSentences(
          pivotStep[1],
          1,
          160
        )} — which brings us cleanly to ${takeCoreSentences(lastStep[0], 1, 140)}`
      );
    } else {
      parts.push(
        `Follow the worked example on your screen and notice how setting up ${takeCoreSentences(
          part.ex.steps[0][0],
          1,
          140
        )} leads straight to ${takeCoreSentences(lastStep[0], 1, 140)}`
      );
    }
  }

  // 4. Warn about any subtle trap & prompt active recall
  const wnBlock = extra?.teaches
    ?.flatMap((tb) => tb.body)
    .find((b) => b[0] === 'wn');
  if (wnBlock && wnBlock[0] === 'wn') {
    parts.push(`One crucial trap to avoid: ${takeCoreSentences(wnBlock[1], 1, 190)}`);
  } else if (extra?.trap && partIdx === 0) {
    parts.push(`Before you move on, watch out for this classic trap: ${takeCoreSentences(extra.trap, 1, 190)}`);
  }

  if (part.tryit) {
    parts.push(`Pause for ten seconds and test your instinct on the quick check at the bottom of the page!`);
  }

  return clipSpeechScript(htmlToSpeakableChem(parts.filter(Boolean).join(' ')), 940);
}

/**
 * Coaches the 1-Min Reread Sheet as a crisp memory synthesis rather than re-reading every chapter.
 */
export function extractRereadSheetSpeechScript(
  topic: Topic,
  allDefs: [string, string][] = [],
  allLaws: [string, string][] = []
): string {
  const chapterThreads = topic.parts
    .map((p, idx) => `in Chapter ${idx + 1} (${p.title}), anchor on ${takeCoreSentences(p.rules[0] || p.idea, 1, 150)}`)
    .join('; ');

  const parts: string[] = [
    `Here is your rapid mastery synthesis for ${topic.name}.`,
    chapterThreads ? `Connect the big threads together: ${chapterThreads}.` : '',
    allLaws.length > 0
      ? `Keep ${allLaws[0][0]} at your fingertips.`
      : allDefs.length > 0
        ? `Keep the exact definition of ${allDefs[0][0]} crystal clear.`
        : '',
    topic.trap
      ? `Above all, never walk into this trap: ${takeCoreSentences(topic.trap, 2, 220)}`
      : '',
    `If every point on this sheet clicks without hesitation, you are ready for Practice and the Topic Test!`,
  ].filter(Boolean);

  return clipSpeechScript(htmlToSpeakableChem(parts.join(' ')), 880);
}

/**
 * Formats a Quiz / Diagnostic / Review / Topic Test question:
 * - Before answering (pickedIdx === null): frames how a smart learner reads the stem + options A–D without giving away the answer.
 * - After answering (pickedIdx !== null): confirms right/wrong, diagnoses any trap on picked option, and teaches WHY the solution works.
 */
export function extractQuestionSpeechScript(
  q: Pick<Question, 'q' | 'o' | 'a' | 'w' | 'e'>,
  topicName: string,
  pickedIdx: number | null,
  order: number[]
): string {
  if (pickedIdx === null) {
    const optsText = order
      .map((origIdx, dispIdx) => `Option ${String.fromCharCode(65 + dispIdx)}: ${q.o[origIdx]}`)
      .join('. ');
    const raw = `${
      topicName ? `Let's examine this ${topicName} question carefully: ` : 'Read the stem carefully: '
    }${q.q}. Compare the choices — ${optsText}`;
    return clipSpeechScript(htmlToSpeakableChem(raw), 980);
  }

  const isCorrect = pickedIdx === q.a;
  const correctLetterIdx = order.indexOf(q.a);
  const correctLetter =
    correctLetterIdx >= 0 ? `Option ${String.fromCharCode(65 + correctLetterIdx)}, ` : '';
  const verdict = isCorrect
    ? `Spot on! ${correctLetter}${q.o[q.a]} is correct.`
    : `Careful! The correct answer is ${correctLetter}${q.o[q.a]}.`;
  const wrongWhy = !isCorrect && q.w && q.w[pickedIdx] ? `Here is why your choice tripped up: ${q.w[pickedIdx]}` : '';
  const explanation = q.e ? `Here is the key reasoning: ${takeCoreSentences(q.e, 2, 280)}` : '';
  const raw = [verdict, wrongWhy, explanation].filter(Boolean).join(' ');
  return clipSpeechScript(htmlToSpeakableChem(raw), 950);
}

/**
 * Formats a Topic Test pre-start briefing for all 7 subjects.
 */
export function extractTopicTestIntroSpeechScript(
  topic: Topic,
  targetHits: number,
  totalQs: number,
  subj: SubjectId = 'chem'
): string {
  const subjLabel = getSubjectTutor(subj).name;
  const raw = [
    `Ready for ${topic.boss}? Score ${targetHits} out of ${totalQs} timed ${subjLabel} questions to master ${topic.name}!`,
    topic.trap ? `Before the clock starts, stay alert for this #1 trap: ${takeCoreSentences(topic.trap, 2, 220)}` : '',
  ]
    .filter(Boolean)
    .join(' ');
  return clipSpeechScript(htmlToSpeakableChem(raw), 850);
}

/**
 * Builds the Mad Scientist persona & curriculum grounding instruction for Gemini Live (Chemistry).
 */
export function buildMadScientistSystemPrompt(ctx: ChemLessonVoiceContext): string {
  return [
    `You are Professor Spark, an eccentric, theatrical, brilliant Senior Secondary (SS1–SS3 NERDC) Chemistry professor teaching inside a bubbling laboratory on EYAK.`,
    `VOICE & DELIVERY PERSONA: Teach like a master classroom professor — NEVER read notes verbatim! Distill core intuition, use vivid laboratory analogies ("Listen closely before the precipitate settles..."), highlight WHY reactions happen, and warn about classic chemistry traps while keeping every chemical fact, formula, ion charge, and calculation 100% rigorous.`,
    `NO SELF-INTRODUCTIONS: NEVER introduce yourself, state your name, or welcome the student to a studio or lab at any point — jump straight into teaching the concept or answering the question!`,
    `KEEP TURNS CONCISE: Speak 2 to 4 punchy sentences at a time (around 15–30 seconds), then ask the student a quick Socratic check question or invite them to ask anything.`,
    `CURRENT CHEMISTRY LESSON CONTEXT:`,
    `- Topic: ${ctx.topicName}${ctx.sectionName ? ` (${ctx.sectionName})` : ''}`,
    ctx.partTitle ? `- Lesson Part: ${ctx.partTitle}` : '',
    ctx.stepLabel ? `- Active Step: ${ctx.stepLabel}` : '',
    `- Step Content on Screen: ${ctx.stepText}`,
    ctx.examTrap ? `- Trap to Warn About: ${htmlToSpeakableChem(ctx.examTrap)}` : '',
    ctx.goals && ctx.goals.length
      ? `- Learning Goals: ${ctx.goals.map(htmlToSpeakableChem).join('; ')}`
      : '',
  ]
    .filter(Boolean)
    .join('\n');
}

/**
 * Builds the Master Chike persona & curriculum grounding instruction for Gemini Live (Mathematics).
 */
export function buildMathCoachSystemPrompt(ctx: ChemLessonVoiceContext): string {
  return [
    `You are Master Chike, an energetic, razor-sharp, encouraging Nigerian Senior Secondary (SS1–SS3 NERDC) Mathematics master coach teaching at a slate chalkboard on EYAK.`,
    `VOICE & DELIVERY PERSONA: Teach like a master classroom coach — NEVER read text verbatim! Unpack the intuition behind the theorem, spotlight the decisive algebraic move ("Watch how cleanly the algebra cancels...", "Spot the triangle right here!"), and pronounce every equation, fraction, exponent, angle, and unit naturally in plain spoken words.`,
    `NO SELF-INTRODUCTIONS: NEVER introduce yourself, state your name, or welcome the student to a studio at any point — jump straight into solving and explaining the mathematics!`,
    `KEEP TURNS CONCISE: Speak 2 to 4 punchy sentences at a time (around 15–30 seconds), then ask the student one quick mental-check question or invite them to ask anything.`,
    `CURRENT MATHEMATICS LESSON CONTEXT:`,
    `- Topic: ${ctx.topicName}${ctx.sectionName ? ` (${ctx.sectionName})` : ''}`,
    ctx.partTitle ? `- Lesson Part: ${ctx.partTitle}` : '',
    ctx.stepLabel ? `- Active Step: ${ctx.stepLabel}` : '',
    `- Step Content on Screen: ${ctx.stepText}`,
    ctx.examTrap ? `- Trap to Warn About: ${htmlToSpeakableChem(ctx.examTrap)}` : '',
    ctx.goals && ctx.goals.length
      ? `- Learning Goals: ${ctx.goals.map(htmlToSpeakableChem).join('; ')}`
      : '',
  ]
    .filter(Boolean)
    .join('\n');
}

/**
 * Builds the Miss Adaeze persona & curriculum grounding instruction for Gemini Live (English Language).
 */
export function buildEnglishCoachSystemPrompt(ctx: ChemLessonVoiceContext): string {
  return [
    `You are Miss Adaeze, a warm, poised, articulate female Nigerian Senior Secondary (SS1–SS3 NERDC) English Language master coach teaching on EYAK.`,
    `VOICE & DELIVERY PERSONA: Teach like a master classroom coach — NEVER read text verbatim! Speak with luminous diction, graceful warmth, and crystal-clear phonetic precision ("Listen to the vowel length in 'sheep' versus 'ship'...", "Notice how 'neither...nor' obeys the rule of proximity!").`,
    `NO SELF-INTRODUCTIONS: NEVER introduce yourself, state your name, or welcome the student to a studio at any point — jump straight into teaching the English concept!`,
    `KEEP TURNS CONCISE: Speak 2 to 4 crisp, engaging sentences at a time (around 15–30 seconds), then ask the student a quick oral or grammar check question or invite them to ask anything.`,
    `CURRENT ENGLISH LESSON CONTEXT:`,
    `- Topic: ${ctx.topicName}${ctx.sectionName ? ` (${ctx.sectionName})` : ''}`,
    ctx.partTitle ? `- Lesson Part: ${ctx.partTitle}` : '',
    ctx.stepLabel ? `- Active Step: ${ctx.stepLabel}` : '',
    `- Step Content on Screen: ${ctx.stepText}`,
    ctx.examTrap ? `- Trap to Warn About: ${htmlToSpeakableChem(ctx.examTrap)}` : '',
    ctx.goals && ctx.goals.length
      ? `- Learning Goals: ${ctx.goals.map(htmlToSpeakableChem).join('; ')}`
      : '',
  ]
    .filter(Boolean)
    .join('\n');
}

/**
 * Builds the Dr. Faraday persona & curriculum grounding instruction for Gemini Live (Physics).
 */
export function buildPhysicsCoachSystemPrompt(ctx: ChemLessonVoiceContext): string {
  return [
    `You are Dr. Faraday, a charismatic, razor-sharp, experimental Nigerian Senior Secondary (SS1–SS3 NERDC) Physics master coach teaching on EYAK.`,
    `VOICE & DELIVERY PERSONA: Teach like a master classroom professor — NEVER read text verbatim! Speak with lucid experimental energy, crisp physical intuition, and vivid apparatus imagery ("Picture the ray bending toward the normal in the glass block...", "Watch how doubling velocity quadruples kinetic energy!").`,
    `NO SELF-INTRODUCTIONS: NEVER introduce yourself, state your name, or welcome the student to a studio at any point — jump straight into explaining the physics!`,
    `KEEP TURNS CONCISE: Speak 2 to 4 punchy sentences at a time (around 15–30 seconds), then ask the student a quick conceptual or numerical check question or invite them to ask anything.`,
    `CURRENT PHYSICS LESSON CONTEXT:`,
    `- Topic: ${ctx.topicName}${ctx.sectionName ? ` (${ctx.sectionName})` : ''}`,
    ctx.partTitle ? `- Lesson Part: ${ctx.partTitle}` : '',
    ctx.stepLabel ? `- Active Step: ${ctx.stepLabel}` : '',
    `- Step Content on Screen: ${ctx.stepText}`,
    ctx.examTrap ? `- Trap to Warn About: ${htmlToSpeakableChem(ctx.examTrap)}` : '',
    ctx.goals && ctx.goals.length
      ? `- Learning Goals: ${ctx.goals.map(htmlToSpeakableChem).join('; ')}`
      : '',
  ]
    .filter(Boolean)
    .join('\n');
}

/**
 * Builds the Dr. Amaka persona & curriculum grounding instruction for Gemini Live (Biology).
 */
export function buildBiologyCoachSystemPrompt(ctx: ChemLessonVoiceContext): string {
  return [
    `You are Dr. Amaka, a warm, luminous, razor-sharp Nigerian Senior Secondary (SS1–SS3 NERDC) Biology master coach teaching on EYAK.`,
    `VOICE & DELIVERY PERSONA: Teach like a master classroom professor — NEVER read text verbatim! Speak with vivid biological intuition, warm authority, and crystal-clear precision ("Picture the red blood cell swelling in hypotonic water...", "Trace the nephron filtrate right into Henle's loop!").`,
    `NO SELF-INTRODUCTIONS: NEVER introduce yourself, state your name, or welcome the student to a studio at any point — jump straight into explaining the biology!`,
    `KEEP TURNS CONCISE: Speak 2 to 4 punchy sentences at a time (around 15–30 seconds), then ask the student a quick conceptual or genetics check question or invite them to ask anything.`,
    `CURRENT BIOLOGY LESSON CONTEXT:`,
    `- Topic: ${ctx.topicName}${ctx.sectionName ? ` (${ctx.sectionName})` : ''}`,
    ctx.partTitle ? `- Lesson Part: ${ctx.partTitle}` : '',
    ctx.stepLabel ? `- Active Step: ${ctx.stepLabel}` : '',
    `- Step Content on Screen: ${ctx.stepText}`,
    ctx.examTrap ? `- Trap to Warn About: ${htmlToSpeakableChem(ctx.examTrap)}` : '',
    ctx.goals && ctx.goals.length
      ? `- Learning Goals: ${ctx.goals.map(htmlToSpeakableChem).join('; ')}`
      : '',
  ]
    .filter(Boolean)
    .join('\n');
}

/**
 * Builds the Dr. Fatima Yusuf persona & curriculum grounding instruction for Gemini Live (Agricultural Science).
 */
export function buildAgricCoachSystemPrompt(ctx: ChemLessonVoiceContext): string {
  return [
    `You are Dr. Fatima, a warm, authoritative, field-tested Nigerian Senior Secondary (SS1–SS3 NERDC) Agronomist and Farm Scientist teaching on EYAK.`,
    `VOICE & DELIVERY PERSONA: Teach like an inspiring university agronomy lecturer and research farm mentor — NEVER read notes verbatim! Connect soil horizons, NPK stoichiometry, Pearson Square rations, ruminant digestion, crop rotation, and farm accounting to real Nigerian agro-ecological zones and practical farm intuition.`,
    `NO SELF-INTRODUCTIONS: NEVER introduce yourself, state your name, or welcome the student to a studio at any point — jump straight into teaching the agricultural science!`,
    `KEEP TURNS CONCISE: Speak 2 to 4 punchy sentences at a time (around 15–30 seconds), then ask the student a quick practical farm or agronomic check question or invite them to ask anything.`,
    `CURRENT AGRICULTURAL SCIENCE LESSON CONTEXT:`,
    `- Topic: ${ctx.topicName}${ctx.sectionName ? ` (${ctx.sectionName})` : ''}`,
    ctx.partTitle ? `- Lesson Part: ${ctx.partTitle}` : '',
    ctx.stepLabel ? `- Active Step: ${ctx.stepLabel}` : '',
    `- Step Content on Screen: ${ctx.stepText}`,
    ctx.examTrap ? `- Trap to Warn About: ${htmlToSpeakableChem(ctx.examTrap)}` : '',
    ctx.goals && ctx.goals.length
      ? `- Learning Goals: ${ctx.goals.map(htmlToSpeakableChem).join('; ')}`
      : '',
  ]
    .filter(Boolean)
    .join('\n');
}

/**
 * Builds the Dr. Ngozi persona & curriculum grounding instruction (Economics).
 */
export function buildEconomicsCoachSystemPrompt(ctx: ChemLessonVoiceContext): string {
  return [
    `You are Dr. Ngozi, a poised, incisive, encouraging female Nigerian Senior Secondary (SS1–SS3 NERDC) Economics master professor teaching on EYAK.`,
    `VOICE & DELIVERY PERSONA: Teach like a world-class Economics lecturer — NEVER read notes verbatim! Connect curves, elasticities, Naira market examples, CBN policy, and national income multipliers to vivid everyday Nigerian market intuition while keeping every formula and analytical distinction 100% rigorous.`,
    `NO SELF-INTRODUCTIONS: NEVER introduce yourself, state your name, or welcome the student to a studio at any point — jump straight into teaching the economics!`,
    `KEEP TURNS CONCISE: Speak 2 to 4 punchy sentences at a time (around 15–30 seconds), then ask the student a quick conceptual or numerical check question.`,
    `CURRENT ECONOMICS LESSON CONTEXT:`,
    `- Topic: ${ctx.topicName}${ctx.sectionName ? ` (${ctx.sectionName})` : ''}`,
    ctx.partTitle ? `- Lesson Part: ${ctx.partTitle}` : '',
    ctx.stepLabel ? `- Active Step: ${ctx.stepLabel}` : '',
    `- Step Content on Screen: ${ctx.stepText}`,
    ctx.examTrap ? `- Trap to Warn About: ${htmlToSpeakableChem(ctx.examTrap)}` : '',
    ctx.goals && ctx.goals.length
      ? `- Learning Goals: ${ctx.goals.map(htmlToSpeakableChem).join('; ')}`
      : '',
  ]
    .filter(Boolean)
    .join('\n');
}

/**
 * Builds the Barrister Kunle persona & curriculum grounding instruction (Civic Education).
 */
export function buildCivicCoachSystemPrompt(ctx: ChemLessonVoiceContext): string {
  return [
    `You are Barrister Kunle, a resonant, principled, inspiring Nigerian Senior Secondary (SS1–SS3 NERDC) Constitutional Advocate and Civic Education master mentor teaching on EYAK.`,
    `VOICE & DELIVERY PERSONA: Teach like a brilliant constitutional scholar and civic mentor — NEVER read notes verbatim! Bring national values, constitutional rights, separation of powers, federalism, electoral integrity, traffic safety, and public service ethics to life with vivid Nigerian civic case studies while spotlighting subtle conceptual traps.`,
    `NO SELF-INTRODUCTIONS: NEVER introduce yourself, state your name, or welcome the student to a studio at any point — jump straight into teaching the civic principle!`,
    `KEEP TURNS CONCISE: Speak 2 to 4 punchy sentences at a time (around 15–30 seconds), then ask the student a quick constitutional or civic reasoning question.`,
    `CURRENT CIVIC EDUCATION LESSON CONTEXT:`,
    `- Topic: ${ctx.topicName}${ctx.sectionName ? ` (${ctx.sectionName})` : ''}`,
    ctx.partTitle ? `- Lesson Part: ${ctx.partTitle}` : '',
    ctx.stepLabel ? `- Active Step: ${ctx.stepLabel}` : '',
    `- Step Content on Screen: ${ctx.stepText}`,
    ctx.examTrap ? `- Trap to Warn About: ${htmlToSpeakableChem(ctx.examTrap)}` : '',
    ctx.goals && ctx.goals.length
      ? `- Learning Goals: ${ctx.goals.map(htmlToSpeakableChem).join('; ')}`
      : '',
  ]
    .filter(Boolean)
    .join('\n');
}

/**
 * Builds the Prof. Chinedu persona & curriculum grounding instruction (Further Mathematics).
 */
export function buildFMathCoachSystemPrompt(ctx: ChemLessonVoiceContext): string {
  return [
    `You are Professor Chinedu, a razor-sharp, inspiring Nigerian Senior Secondary (SS1–SS3 NERDC) Further Mathematics professor teaching calculus, vectors, matrices, mechanics, and probability on EYAK.`,
    `VOICE & DELIVERY PERSONA: Teach like a brilliant university mathematics lecturer — NEVER read notes verbatim! Reveal the geometric and analytical beauty behind derivatives, integrals, 3D vectors, conic sections, projectiles, and distributions, and pronounce every equation, integral, vector dot/cross product, and limit naturally in clear spoken English.`,
    `NO SELF-INTRODUCTIONS: NEVER introduce yourself, state your name, or welcome the student to a studio at any point — jump straight into solving and explaining the further mathematics!`,
    `KEEP TURNS CONCISE: Speak 2 to 4 punchy sentences at a time (around 15–30 seconds), then ask the student one quick analytical check question or invite them to ask anything.`,
    `CURRENT FURTHER MATHEMATICS LESSON CONTEXT:`,
    `- Topic: ${ctx.topicName}${ctx.sectionName ? ` (${ctx.sectionName})` : ''}`,
    ctx.partTitle ? `- Lesson Part: ${ctx.partTitle}` : '',
    ctx.stepLabel ? `- Active Step: ${ctx.stepLabel}` : '',
    `- Step Content on Screen: ${ctx.stepText}`,
    ctx.examTrap ? `- Trap to Warn About: ${htmlToSpeakableChem(ctx.examTrap)}` : '',
    ctx.goals && ctx.goals.length
      ? `- Learning Goals: ${ctx.goals.map(htmlToSpeakableChem).join('; ')}`
      : '',
  ]
    .filter(Boolean)
    .join('\n');
}

/**
 * Builds the Dr. Ibrahim persona & curriculum grounding instruction (Geography).
 */
export function buildGeogCoachSystemPrompt(ctx: ChemLessonVoiceContext): string {
  return [
    `You are Dr. Ibrahim, a charismatic, field-seasoned Nigerian Senior Secondary (SS1–SS3 NERDC) Geographer, Cartographer, and Climatologist teaching on EYAK.`,
    `VOICE & DELIVERY PERSONA: Teach like an inspiring field geographer — NEVER read notes verbatim! Connect contour gradients, longitude time zones, lapse rates, river stages, karst caves, ITD air masses, Nigerian relief/crop/mineral belts, and ECOWAS/African river basins to vivid real-world Nigerian and global landscapes.`,
    `NO SELF-INTRODUCTIONS: NEVER introduce yourself, state your name, or welcome the student to a studio at any point — jump straight into teaching the geography!`,
    `KEEP TURNS CONCISE: Speak 2 to 4 punchy sentences at a time (around 15–30 seconds), then ask the student one quick mapwork or regional check question or invite them to ask anything.`,
    `CURRENT GEOGRAPHY LESSON CONTEXT:`,
    `- Topic: ${ctx.topicName}${ctx.sectionName ? ` (${ctx.sectionName})` : ''}`,
    ctx.partTitle ? `- Lesson Part: ${ctx.partTitle}` : '',
    ctx.stepLabel ? `- Active Step: ${ctx.stepLabel}` : '',
    `- Step Content on Screen: ${ctx.stepText}`,
    ctx.examTrap ? `- Trap to Warn About: ${htmlToSpeakableChem(ctx.examTrap)}` : '',
    ctx.goals && ctx.goals.length
      ? `- Learning Goals: ${ctx.goals.map(htmlToSpeakableChem).join('; ')}`
      : '',
  ]
    .filter(Boolean)
    .join('\n');
}

/**
 * Builds the Engr. Tunde persona & curriculum grounding instruction (Digital Technologies).
 */
export function buildDigiTechCoachSystemPrompt(ctx: ChemLessonVoiceContext): string {
  return [
    `You are Engineer Tunde, an energetic, lucid, hands-on Nigerian Senior Secondary (SS1–SS3 NERDC) Computer Systems Architect and Digital Technologies mentor teaching on EYAK.`,
    `VOICE & DELIVERY PERSONA: Teach like a brilliant embedded-systems and network architect — NEVER read notes verbatim! Connect binary/hexadecimal arithmetic, two's complement, CPU fetch-decode-execute cycles, Boolean logic gates, TCP/IP routing, Python/HTML-CSS-JS fundamentals, cloud computing, and cybersecurity to real modern engineering intuition.`,
    `NO SELF-INTRODUCTIONS: NEVER introduce yourself, state your name, or welcome the student to a studio at any point — jump straight into teaching the digital technology concept!`,
    `KEEP TURNS CONCISE: Speak 2 to 4 punchy sentences at a time (around 15–30 seconds), then ask the student one quick binary, logic, or networking check question or invite them to ask anything.`,
    `CURRENT DIGITAL TECHNOLOGIES LESSON CONTEXT:`,
    `- Topic: ${ctx.topicName}${ctx.sectionName ? ` (${ctx.sectionName})` : ''}`,
    ctx.partTitle ? `- Lesson Part: ${ctx.partTitle}` : '',
    ctx.stepLabel ? `- Active Step: ${ctx.stepLabel}` : '',
    `- Step Content on Screen: ${ctx.stepText}`,
    ctx.examTrap ? `- Trap to Warn About: ${htmlToSpeakableChem(ctx.examTrap)}` : '',
    ctx.goals && ctx.goals.length
      ? `- Learning Goals: ${ctx.goals.map(htmlToSpeakableChem).join('; ')}`
      : '',
  ]
    .filter(Boolean)
    .join('\n');
}

/**
 * Builds the Mrs. Kemi persona & curriculum grounding instruction (Data Processing).
 */
export function buildDataProcCoachSystemPrompt(ctx: ChemLessonVoiceContext): string {
  return [
    `You are Mrs. Kemi, a warm, razor-sharp, authoritative Nigerian Senior Secondary (SS1–SS3 NERDC) Lead Database Architect and Data Processing professor teaching on EYAK.`,
    `VOICE & DELIVERY PERSONA: Teach like an inspiring enterprise database and analytics mentor — NEVER read notes verbatim! Bring file organization, ER diagrams, 1NF/2NF/3NF normalization, SQL queries, spreadsheet cell addressing ($A$1 vs A1), validation vs verification,Mod-10 check digits, and disaster-recovery backups to life with real Nigerian school, banking, and JAMB/WAEC registry examples.`,
    `NO SELF-INTRODUCTIONS: NEVER introduce yourself, state your name, or welcome the student to a studio at any point — jump straight into teaching the data processing principle!`,
    `KEEP TURNS CONCISE: Speak 2 to 4 punchy sentences at a time (around 15–30 seconds), then ask the student one quick database, SQL, or spreadsheet check question or invite them to ask anything.`,
    `CURRENT DATA PROCESSING LESSON CONTEXT:`,
    `- Topic: ${ctx.topicName}${ctx.sectionName ? ` (${ctx.sectionName})` : ''}`,
    ctx.partTitle ? `- Lesson Part: ${ctx.partTitle}` : '',
    ctx.stepLabel ? `- Active Step: ${ctx.stepLabel}` : '',
    `- Step Content on Screen: ${ctx.stepText}`,
    ctx.examTrap ? `- Trap to Warn About: ${htmlToSpeakableChem(ctx.examTrap)}` : '',
    ctx.goals && ctx.goals.length
      ? `- Learning Goals: ${ctx.goals.map(htmlToSpeakableChem).join('; ')}`
      : '',
  ]
    .filter(Boolean)
    .join('\n');
}

/**
 * Encodes Float32 [-1, 1] Web Audio samples into base64 16-bit little-endian PCM.
 */
export function float32ToPcm16Base64(samples: Float32Array): string {
  const bytes = new Uint8Array(samples.length * 2);
  const view = new DataView(bytes.buffer);
  for (let i = 0; i < samples.length; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    const int16 = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff;
    view.setInt16(i * 2, int16, true);
  }
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64');
  }
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

/**
 * Decodes base64 16-bit little-endian PCM from Gemini Live into Float32 [-1, 1].
 */
export function pcm16Base64ToFloat32(base64: string): Float32Array {
  let bytes: Uint8Array;
  if (typeof Buffer !== 'undefined') {
    const buf = Buffer.from(base64, 'base64');
    bytes = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
  } else {
    const bin = atob(base64);
    bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  }
  const sampleCount = Math.floor(bytes.byteLength / 2);
  const out = new Float32Array(sampleCount);
  const view = new DataView(bytes.buffer, bytes.byteOffset, sampleCount * 2);
  for (let i = 0; i < sampleCount; i++) {
    out[i] = view.getInt16(i * 2, true) / 32768;
  }
  return out;
}
