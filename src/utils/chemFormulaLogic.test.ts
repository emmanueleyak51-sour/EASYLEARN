import test from 'node:test';
import assert from 'node:assert/strict';
import { CHEM_FORMULAS, CHEM_FORMULA_CATEGORIES } from '../data/chemFormulas';
import { SUBJECTS } from '../data/curriculum';
import {
  buildFormulaDrillDeck,
  extractFormulaSpeechScript,
  filterChemFormulas,
  generateFormulaQuestion,
  getFormulasForTopic,
} from './chemFormulaLogic';

test('CHEM_FORMULAS contains 30 complete formulas across all 7 Chemistry branches with valid topicIds', () => {
  assert.equal(CHEM_FORMULAS.length, 30);
  const validTopicIds = new Set(SUBJECTS.chem.topics.map((t) => t.id));
  const seenIds = new Set<string>();

  for (const cat of CHEM_FORMULA_CATEGORIES) {
    if (cat.id === 'all') continue;
    const inCat = filterChemFormulas(CHEM_FORMULAS, cat.id, '');
    assert.ok(inCat.length >= 3, `Category ${cat.id} should have >= 3 formulas, found ${inCat.length}`);
  }

  for (const f of CHEM_FORMULAS) {
    assert.ok(!seenIds.has(f.id), `Duplicate formula id: ${f.id}`);
    seenIds.add(f.id);
    assert.ok(validTopicIds.has(f.topicId), `Formula ${f.id} references unknown topicId ${f.topicId}`);
    assert.ok(f.name.trim().length > 0);
    assert.ok(f.rearrangements.length >= 1 && f.rearrangements[0].exprHtml.trim().length > 0);
    assert.ok(f.variables.length >= 2, `Formula ${f.id} needs >= 2 variable definitions`);
    assert.ok(f.trap.trim().length > 10);
    assert.ok(f.worked.qHtml.length > 0 && f.worked.stepsHtml.length > 0 && f.worked.ansHtml.length > 0);
  }
});

test('filterChemFormulas and getFormulasForTopic filter accurately by search keyword and topic', () => {
  const faradayMatches = filterChemFormulas(CHEM_FORMULAS, 'all', 'faraday');
  assert.ok(faradayMatches.length >= 2);
  assert.ok(faradayMatches.some((f) => f.id === 'f-faraday1'));

  const gasTopicFormulas = getFormulasForTopic('c-kin');
  assert.ok(gasTopicFormulas.length >= 6);
  assert.ok(gasTopicFormulas.some((f) => f.id === 'f-ideal-gas'));
});

test('generateFormulaQuestion produces valid 4-unique-option calculations across every formula and multiple seeds', () => {
  const seeds = [101, 2027, 8888, 42424];
  for (const f of CHEM_FORMULAS) {
    for (const seed of seeds) {
      const q = generateFormulaQuestion(f.id, seed);
      assert.equal(q.formulaId, f.id);
      assert.ok(q.promptHtml.trim().length > 12, `Empty prompt on ${f.id}`);
      assert.equal(q.options.length, 4, `Expected 4 options on ${f.id}`);
      const uniqueOpts = new Set(q.options);
      assert.equal(uniqueOpts.size, 4, `Duplicate options generated on ${f.id} seed ${seed}: ${q.options.join(' | ')}`);
      assert.ok(q.answerIdx >= 0 && q.answerIdx < 4, `Invalid answer index on ${f.id}: ${q.answerIdx}`);
      assert.ok(q.explanationHtml.trim().length > 15, `Empty explanation on ${f.id}`);
      assert.ok(q.hintHtml.trim().length > 3, `Empty hint on ${f.id}`);
    }
  }
});

test('buildFormulaDrillDeck and extractFormulaSpeechScript work deterministically', () => {
  const allDeck = buildFormulaDrillDeck('all', null, 8, 777);
  assert.equal(allDeck.length, 8);

  const focusedDeck = buildFormulaDrillDeck('all', 'f-titration', 6, 999);
  assert.equal(focusedDeck.length, 6);
  assert.ok(focusedDeck.every((q) => q.formulaId === 'f-titration'));

  const speech = extractFormulaSpeechScript(CHEM_FORMULAS[0], 1);
  assert.ok(speech.toLowerCase().includes('amount of substance') || speech.length > 30);
  assert.ok(!speech.includes('<sub'), 'Speech script must strip HTML tags');
});
