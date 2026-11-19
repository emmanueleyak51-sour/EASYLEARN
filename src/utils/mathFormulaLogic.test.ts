import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { SUBJECTS, getTopicsForProgress } from '../data/curriculum';
import {
  MATH_CLASSES,
  MATH_NERDC_MAP,
  filterMathTopicsByClass,
  getMathClassMeta,
} from '../data/mathNerdc2027';
import { MATH_FORMULAS, MATH_FORMULA_CATEGORIES } from '../data/mathFormulas';
import { MATH_LAB_FOR_TOPIC, getLabById } from '../data/labs';
import {
  buildMathFormulaDrillDeck,
  extractMathFormulaSpeechScript,
  filterMathFormulas,
  generateMathFormulaQuestion,
  getMathFormulasForTopic,
} from './mathFormulaLogic';
import {
  buildMathCoachSystemPrompt,
  extractBeatSpeechScript,
  extractMissionSpeechScript,
  htmlToSpeakableChem,
} from './chemVoiceLogic';

describe('Mathematics NERDC SS1–SS3 + WAEC/JAMB 32-Topic Curriculum', () => {
  it('maps all 32 Mathematics topics into SS1 (11), SS2 (11), and SS3 (10) across Terms 1–3', () => {
    const allTopics = SUBJECTS.maths.topics;
    assert.equal(allTopics.length, 32);

    const ss1 = filterMathTopicsByClass(allTopics, 'ss1');
    const ss2 = filterMathTopicsByClass(allTopics, 'ss2');
    const ss3 = filterMathTopicsByClass(allTopics, 'ss3');
    const all = filterMathTopicsByClass(allTopics, 'all');

    assert.equal(ss1.length, 11, 'Expected 11 SS1 Maths topics');
    assert.equal(ss2.length, 11, 'Expected 11 SS2 Maths topics');
    assert.equal(ss3.length, 10, 'Expected 10 SS3 Maths topics');
    assert.equal(all.length, 32);

    for (const cls of ['ss1', 'ss2', 'ss3'] as const) {
      const clsTopics = filterMathTopicsByClass(allTopics, cls);
      const terms = new Set(clsTopics.map((t) => MATH_NERDC_MAP[t.id]?.term));
      assert.deepEqual([...terms].sort(), [1, 2, 3], `${cls} must cover First, Second & Third Term`);
    }

    assert.equal(MATH_CLASSES.length, 4);
    assert.equal(getMathClassMeta('ss2').fullTitle, 'SS 2 Mathematics');
    assert.equal(getTopicsForProgress({ subj: 'maths', mathClass: 'ss1' }).length, 11);
    assert.equal(getTopicsForProgress({ subj: 'maths', mathClass: 'ss3' }).length, 10);
  });

  it('links Mathematics topics in MATH_LAB_FOR_TOPIC to valid Constructions Lab IDs', () => {
    const entries = Object.entries(MATH_LAB_FOR_TOPIC);
    assert.ok(entries.length >= 15);
    for (const [tid, labId] of entries) {
      assert.ok(
        SUBJECTS.maths.topics.some((t) => t.id === tid),
        `Unknown Maths topic id in MATH_LAB_FOR_TOPIC: ${tid}`
      );
      const lab = getLabById(labId);
      assert.ok(lab, `Missing lab ${labId} linked from Maths topic ${tid}`);
      assert.equal(lab.subj || 'maths', 'maths');
    }
  });
});

describe('Mathematics Formula & Calculation Studio (30 Formulas)', () => {
  it('validates all 30 Mathematics formulas have valid topics, rearrangements, and worked examples', () => {
    assert.equal(MATH_FORMULAS.length, 30);
    assert.equal(MATH_FORMULA_CATEGORIES.length, 7);

    const seenIds = new Set<string>();
    for (const f of MATH_FORMULAS) {
      assert.ok(f.id.startsWith('mf-'), `Expected mf-* prefix on ${f.id}`);
      assert.equal(seenIds.has(f.id), false, `Duplicate formula id: ${f.id}`);
      seenIds.add(f.id);

      assert.ok(
        SUBJECTS.maths.topics.some((t) => t.id === f.topicId),
        `Formula ${f.id} references unknown Maths topic ${f.topicId}`
      );
      assert.ok(f.rearrangements.length >= 1, `Formula ${f.id} needs rearrangements`);
      assert.ok(f.variables.length >= 2, `Formula ${f.id} needs variables`);
      assert.ok(f.worked.stepsHtml.length >= 2, `Formula ${f.id} needs worked steps`);
    }
  });

  it('generates valid 4-unique-option calculation questions for every Mathematics formula across seeds', () => {
    for (const f of MATH_FORMULAS) {
      for (const seed of [101, 2027, 99991]) {
        const q = generateMathFormulaQuestion(f, seed);
        assert.equal(q.formulaId, f.id);
        assert.equal(q.options.length, 4, `Expected 4 options for ${f.id}`);
        assert.equal(new Set(q.options).size, 4, `Duplicate options in ${f.id}: ${q.options.join(' | ')}`);
        assert.ok(q.answerIdx >= 0 && q.answerIdx < 4, `Invalid answerIdx in ${f.id}`);
        assert.ok(q.promptHtml.length > 15);
        assert.ok(q.explanationHtml.length > 15);
      }
    }

    const deck = buildMathFormulaDrillDeck('trig', null, 8, 4242);
    assert.equal(deck.length, 8);
    assert.ok(deck.every((q) => q.cat === 'trig'));

    assert.ok(filterMathFormulas(MATH_FORMULAS, 'all', 'cosine').length >= 1);
    assert.ok(getMathFormulasForTopic('quad').length >= 2);
  });

  it('formats speakable Mathematics formula and lesson scripts with intro ONLY on Step 1', () => {
    const quad = MATH_FORMULAS.find((f) => f.id === 'mf-quad-formula')!;
    const script = extractMathFormulaSpeechScript(quad, 0);
    assert.ok(!script.includes('<span'), 'Speech script must strip HTML tags');
    assert.ok(script.includes('Quadratic Formula'));

    const spokenSymbols = htmlToSpeakableChem('√x + πr² ⇒ A ∩ B ≡ 3 (mod 5)');
    assert.ok(spokenSymbols.includes('square root of'));
    assert.ok(spokenSymbols.includes('pi'));
    assert.ok(spokenSymbols.includes('implies'));
    assert.ok(spokenSymbols.includes('intersection'));
    assert.ok(spokenSymbols.includes('is congruent to'));

    const sampleBeat = SUBJECTS.maths.il['m-mod'].parts[0].beats[0];
    const step1 = extractBeatSpeechScript(sampleBeat, 'Modular Arithmetic', 'Clock Arithmetic', true, 'maths');
    const step2 = extractBeatSpeechScript(sampleBeat, 'Modular Arithmetic', 'Clock Arithmetic', false, 'maths');

    assert.ok(step1.includes("Welcome to Master Chike's Mathematics Studio"));
    assert.equal(step2.includes("Welcome to Master Chike's Mathematics Studio"), false);

    const mission = extractMissionSpeechScript('Quadratic Equations', 'lesson', 4, 'Watch signs', 'maths');
    assert.ok(mission.includes("Master Chike's Mathematics Studio"));

    const livePrompt = buildMathCoachSystemPrompt({
      topicName: 'Bearings & Distances',
      stepText: 'Back bearing adds or subtracts 180 degrees.',
    });
    assert.ok(livePrompt.includes('Master Chike'));
    assert.ok(livePrompt.includes('NEVER re-introduce yourself'));
  });
});
