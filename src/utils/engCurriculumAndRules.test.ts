import test from 'node:test';
import assert from 'node:assert/strict';
import { SUBJECTS, SUBJECT_IDS } from '../data/curriculum';
import { getLabsForSubject } from '../data/labs';
import { ENG_NERDC_MAP, filterEngTopicsByClass } from '../data/engNerdc2027';
import { ENG_FORMULAS, ENG_FORMULA_CATEGORIES } from '../data/engFormulas';
import {
  buildEngFormulaDrillDeck,
  extractEngFormulaSpeechScript,
  filterEngFormulas,
  generateEngFormulaQuestion,
  getEngFormulasForTopic,
} from './engFormulaLogic';

test('English Language curriculum has 34 NERDC SS1-SS3 & JAMB Novel topics, zero labs, and 239 valid MCQs', () => {
  assert.equal(SUBJECT_IDS.length, 49);
  assert.ok(SUBJECT_IDS.includes('eng'));
  const eng = SUBJECTS.eng;
  assert.ok(eng, 'English subject exists');
  assert.equal(eng.topics.length, 34, '34 English topics');
  assert.equal(getLabsForSubject('eng').length, 0, 'STRICT NO-LAB RULE: English has zero labs');

  const ss1 = filterEngTopicsByClass(eng.topics, 'ss1');
  const ss2 = filterEngTopicsByClass(eng.topics, 'ss2');
  const ss3 = filterEngTopicsByClass(eng.topics, 'ss3');
  const all = filterEngTopicsByClass(eng.topics, 'all');
  assert.equal(ss1.length, 11, '11 SS1 English topics');
  assert.equal(ss2.length, 11, '11 SS2 English topics');
  assert.equal(ss3.length, 12, '12 SS3 English topics (including 2 JAMB novels)');
  assert.equal(all.length, 34, '34 total English topics');

  let totalQs = 0;
  for (const t of eng.topics) {
    assert.ok(ENG_NERDC_MAP[t.id], `NERDC map entry exists for ${t.id}`);
    assert.ok(t.parts.length >= 2, `${t.id} has at least 2 illustrated note chapters`);
    assert.ok(t.qs.length >= 7, `${t.id} has at least 7 MCQs`);
    totalQs += t.qs.length;

    t.qs.forEach((q, qIdx) => {
      const qLabel = `${t.id}-${qIdx + 1}`;
      assert.equal(q.o.length, 4, `question ${qLabel} has 4 options`);
      assert.ok(q.a >= 0 && q.a < 4, `question ${qLabel} has valid answer index`);
      assert.ok(q.e && q.e.length > 10, `question ${qLabel} has explanation`);
    });

    const il = eng.il[t.id];
    assert.ok(il && il.parts.length >= 2, `InteractiveLesson exists for ${t.id}`);
    const hasTable = il.parts.some((p) =>
      p.beats.some(
        (b) => b.k === 'teach' && b.body.some((blk) => blk[0] === 'tb')
      )
    );
    assert.ok(hasTable, `${t.id} interactive lesson includes custom study table`);
  }
  assert.equal(totalQs, 239, '239 total English MCQs');
});

test('English Grammar & Rules Studio has 30 rules linked to valid topics and clean drill decks', () => {
  assert.equal(ENG_FORMULAS.length, 30, '30 English rules');
  assert.equal(ENG_FORMULA_CATEGORIES.length, 7, 'All + 6 English rule categories');

  const topicIds = new Set(SUBJECTS.eng.topics.map((t) => t.id));
  for (const f of ENG_FORMULAS) {
    assert.ok(topicIds.has(f.topicId), `Rule ${f.id} links to existing topic ${f.topicId}`);
    assert.ok(f.rearrangements.length >= 2, `Rule ${f.id} has pattern variations`);

    for (const seed of [17, 503, 9973]) {
      const q = generateEngFormulaQuestion(f, seed);
      assert.equal(q.options.length, 4, `${f.id} drill question has 4 options`);
      const uniqueOpts = new Set(q.options);
      assert.equal(uniqueOpts.size, 4, `${f.id} drill options are distinct for seed ${seed}`);
      assert.ok(q.answerIdx >= 0 && q.answerIdx < 4, `${f.id} valid answerIdx`);
    }

    const spokenFirst = extractEngFormulaSpeechScript(f, 0, true);
    const spokenNext = extractEngFormulaSpeechScript(f, 0, false);
    assert.ok(spokenFirst.includes("Miss Adaeze's English Rules Studio"));
    assert.ok(!spokenNext.includes("Welcome to Miss Adaeze"));
  }

  const concordFiltered = filterEngFormulas(ENG_FORMULAS, 'concord', '');
  assert.equal(concordFiltered.length, 5);
  const searchFiltered = filterEngFormulas(ENG_FORMULAS, 'all', 'neither');
  assert.ok(searchFiltered.length >= 1);
  assert.ok(getEngFormulasForTopic('e-concord').length >= 2);

  const deck = buildEngFormulaDrillDeck('all', null, 8, 4242);
  assert.equal(deck.length, 8);
});
