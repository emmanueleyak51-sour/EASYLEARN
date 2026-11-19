import test from 'node:test';
import assert from 'node:assert/strict';
import { SUBJECT_IDS, SUBJECTS } from '../data/curriculum';
import { getLabsForSubject } from '../data/labs';
import { FMATH_NERDC_MAP, filterFMathTopicsByClass } from '../data/fmathNerdc2027';
import { GEOG_NERDC_MAP, filterGeogTopicsByClass } from '../data/geogNerdc2027';
import { FMATH_FORMULAS } from '../data/fmathFormulas';
import { GEOG_FORMULAS } from '../data/geogFormulas';
import {
  buildFMathFormulaDrillDeck,
  extractFMathFormulaSpeechScript,
  filterFMathFormulas,
} from './fmathFormulaLogic';
import {
  buildGeogFormulaDrillDeck,
  extractGeogFormulaSpeechScript,
  filterGeogFormulas,
} from './geogFormulaLogic';

test('All 12 Nigerian SS1-SS3 faculties load with >=30 topics, interactive lessons, and 4-option MCQs', () => {
  assert.equal(SUBJECT_IDS.length, 12);
  let grandTotalTopics = 0;
  let grandTotalMcqs = 0;

  for (const sid of SUBJECT_IDS) {
    const subj = SUBJECTS[sid];
    assert.ok(subj, `Subject ${sid} must exist`);
    assert.ok(subj.topics.length >= 30, `${sid} must have at least 30 topics`);
    grandTotalTopics += subj.topics.length;

    const mcqCount = subj.topics.reduce((acc, t) => acc + t.qs.length, 0);
    assert.ok(mcqCount >= 180, `${sid} must have at least 180 calibrated MCQs`);
    grandTotalMcqs += mcqCount;

    for (const t of subj.topics) {
      assert.ok(t.parts.length >= 2, `${sid}:${t.id} should have multi-chapter notes`);
      assert.ok(subj.il[t.id], `${sid}:${t.id} should have a generated interactive lesson`);
      for (const q of t.qs) {
        assert.equal(q.o.length, 4, `${sid}:${t.id} MCQ must have 4 options`);
        assert.ok(q.a >= 0 && q.a < 4, `${sid}:${t.id} MCQ answer index must be 0..3`);
      }
    }
  }

  assert.ok(grandTotalTopics >= 360);
  assert.ok(grandTotalMcqs >= 2160);
});

test('Further Mathematics SS1-SS3 curriculum (30 topics, 180 MCQs), 25 formulas, numerical drills, zero raw LaTeX, and zero labs', () => {
  const fmaths = SUBJECTS.fmaths;
  assert.equal(fmaths.topics.length, 30);
  assert.equal(
    fmaths.topics.reduce((acc, t) => acc + t.qs.length, 0),
    180
  );
  assert.equal(filterFMathTopicsByClass(fmaths.topics, 'ss1').length, 10);
  assert.equal(filterFMathTopicsByClass(fmaths.topics, 'ss2').length, 10);
  assert.equal(filterFMathTopicsByClass(fmaths.topics, 'ss3').length, 10);
  assert.equal(getLabsForSubject('fmaths').length, 0);

  for (const t of fmaths.topics) {
    assert.ok(FMATH_NERDC_MAP[t.id], `Missing FMATH_NERDC_MAP for ${t.id}`);
    const serialized = JSON.stringify(t);
    assert.equal(serialized.includes('\\dfrac'), false, `Raw LaTeX \\dfrac in ${t.id}`);
  }

  assert.equal(FMATH_FORMULAS.length, 25);
  assert.ok(filterFMathFormulas(FMATH_FORMULAS, 'calculus', '').length >= 4);
  assert.ok(extractFMathFormulaSpeechScript(FMATH_FORMULAS[0], 0).length > 30);

  const deck = buildFMathFormulaDrillDeck('all', null, 8, 42);
  assert.equal(deck.length, 8);
  for (const item of deck) {
    assert.equal(item.options.length, 4);
    assert.ok(item.answerIdx >= 0 && item.answerIdx < 4);
    assert.equal(new Set(item.options).size, 4, `Duplicate options in ${item.id}`);
  }
});

test('Geography SS1-SS3 curriculum (30 topics, 180 MCQs), 20 quantitative formulas, numerical drills, zero raw LaTeX, and zero labs', () => {
  const geog = SUBJECTS.geog;
  assert.equal(geog.topics.length, 30);
  assert.equal(
    geog.topics.reduce((acc, t) => acc + t.qs.length, 0),
    180
  );
  assert.equal(filterGeogTopicsByClass(geog.topics, 'ss1').length, 10);
  assert.equal(filterGeogTopicsByClass(geog.topics, 'ss2').length, 10);
  assert.equal(filterGeogTopicsByClass(geog.topics, 'ss3').length, 10);
  assert.equal(getLabsForSubject('geog').length, 0);

  for (const t of geog.topics) {
    assert.ok(GEOG_NERDC_MAP[t.id], `Missing GEOG_NERDC_MAP for ${t.id}`);
    const serialized = JSON.stringify(t);
    assert.equal(serialized.includes('\\dfrac'), false, `Raw LaTeX \\dfrac in ${t.id}`);
    assert.equal(/\$[^$]+\$/.test(serialized), false, `Raw LaTeX $...$ in ${t.id}`);
  }

  assert.equal(GEOG_FORMULAS.length, 20);
  assert.ok(filterGeogFormulas(GEOG_FORMULAS, 'scale', '').length >= 4);
  assert.ok(extractGeogFormulaSpeechScript(GEOG_FORMULAS[0], 0).length > 30);

  const deck = buildGeogFormulaDrillDeck('all', null, 8, 42);
  assert.equal(deck.length, 8);
  for (const item of deck) {
    assert.equal(item.options.length, 4);
    assert.ok(item.answerIdx >= 0 && item.answerIdx < 4);
    assert.equal(new Set(item.options).size, 4, `Duplicate options in ${item.id}`);
  }
});
