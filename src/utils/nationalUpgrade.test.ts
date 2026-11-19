import test from 'node:test';
import assert from 'node:assert/strict';
import { SUBJECTS, SUBJECT_IDS, getInteractiveLesson, getTopics, getTopicsForProgress } from '../data/curriculum';
import { AGRIC_CLASSES, AGRIC_NERDC_MAP, filterAgricTopicsByClass } from '../data/agricNerdc2027';
import { getLabsForSubject } from '../data/labs';
import { CHEM_FORMULAS } from '../data/chemFormulas';
import { MATH_FORMULAS } from '../data/mathFormulas';
import { PHYS_FORMULAS } from '../data/physFormulas';
import { ECON_FORMULAS } from '../data/econFormulas';
import { ENG_FORMULAS } from '../data/engFormulas';
import {
  sanitizeFormulaForNationalLearning,
  sanitizeNationalText,
} from './nationalLearningSanitizer';
import { splitRuleEquation, typesetMathHtml } from './mathTypesetter';
import { formatLabTrialRow, getLabSimulationSpec } from './advancedLabSimulation';

const FORBIDDEN_EXAM_RE = /\b(WAEC|JAMB|JAAMB|NECO|UTME|WASSCE|SSCE)\b|exam\s+trap|exam\s+watchout/i;

test('all 12 core subjects exist with complete SS1-SS3 topics, questions, and interactive lessons', () => {
  assert.deepEqual(SUBJECT_IDS, [
    'maths',
    'fmaths',
    'chem',
    'phys',
    'bio',
    'agric',
    'geog',
    'econ',
    'eng',
    'civic',
    'digitech',
    'dataproc',
  ]);
  for (const sid of SUBJECT_IDS) {
    const topics = getTopics(sid);
    assert.ok(topics.length >= 26, `${sid} should have at least 26 topics, got ${topics.length}`);
    for (const t of topics) {
      assert.ok(t.qs.length >= 4, `${sid}:${t.id} should have at least 4 questions`);
      for (const q of t.qs) {
        assert.equal(q.o.length, 4, `${sid}:${q.id} must have 4 options`);
        assert.ok(q.a >= 0 && q.a < 4, `${sid}:${q.id} must have valid answer index`);
      }
      const il = getInteractiveLesson(sid, t.id);
      assert.ok(il && il.parts.length >= 1, `${sid}:${t.id} must have an interactive lesson`);
    }
  }
});

test('Agricultural Science has 30 NERDC SS1-SS3 topics (10 per class) and 180 MCQs', () => {
  const agricTopics = getTopics('agric');
  assert.equal(agricTopics.length, 30);
  const totalQs = agricTopics.reduce((acc, t) => acc + t.qs.length, 0);
  assert.equal(totalQs, 180);

  const ss1 = filterAgricTopicsByClass(agricTopics, 'ss1');
  const ss2 = filterAgricTopicsByClass(agricTopics, 'ss2');
  const ss3 = filterAgricTopicsByClass(agricTopics, 'ss3');
  assert.equal(ss1.length, 10);
  assert.equal(ss2.length, 10);
  assert.equal(ss3.length, 10);
  assert.equal(AGRIC_CLASSES.length, 4);

  for (const t of agricTopics) {
    assert.ok(AGRIC_NERDC_MAP[t.id], `Missing AGRIC_NERDC_MAP entry for ${t.id}`);
  }
  assert.equal(getTopicsForProgress({ subj: 'agric', agricClass: 'ss2' }).length, 10);
});

test('strict subject lab matrix: Maths, Chem, Phys, Bio, Agric have labs; Econ and Eng have zero labs', () => {
  assert.equal(getLabsForSubject('econ').length, 0);
  assert.equal(getLabsForSubject('eng').length, 0);
  assert.equal(getLabsForSubject('agric').length, 14);
  assert.ok(getLabsForSubject('maths').length >= 20);
  assert.ok(getLabsForSubject('chem').length >= 20);
  assert.ok(getLabsForSubject('phys').length >= 14);
  assert.ok(getLabsForSubject('bio').length >= 14);
});

test('zero forbidden exam-body acronyms or "Exam trap" strings remain across all 7 subjects, labs, and sanitized formulas', () => {
  for (const sid of SUBJECT_IDS) {
    const subjJson = JSON.stringify(SUBJECTS[sid]);
    const match = subjJson.match(FORBIDDEN_EXAM_RE);
    assert.equal(
      match,
      null,
      `Found forbidden exam text "${match?.[0]}" inside SUBJECTS.${sid}`
    );

    for (const lab of getLabsForSubject(sid)) {
      const stepsJson = JSON.stringify(lab.steps());
      const labBlob = `${lab.name} ${lab.blurb} ${lab.tip || ''} ${stepsJson}`;
      const labMatch = labBlob.match(FORBIDDEN_EXAM_RE);
      assert.equal(
        labMatch,
        null,
        `Found forbidden exam text "${labMatch?.[0]}" inside lab ${lab.id}`
      );
    }
  }

  const allFormulas = [
    ...MATH_FORMULAS,
    ...CHEM_FORMULAS,
    ...PHYS_FORMULAS,
    ...ECON_FORMULAS,
    ...ENG_FORMULAS,
  ].map((f) => sanitizeFormulaForNationalLearning(f));

  const formulaBlob = JSON.stringify(allFormulas);
  const fMatch = formulaBlob.match(FORBIDDEN_EXAM_RE);
  assert.equal(
    fMatch,
    null,
    `Found forbidden exam text "${fMatch?.[0]}" inside sanitized formulas`
  );

  assert.equal(
    sanitizeNationalText('Common Mistake & Exam Watchout: Watch this WAEC / JAMB UTME exam trap!'),
    'Trap: Watch this National Curriculum trap!'
  );
});

test('typesetMathHtml renders vertical .fr fractions and .m-rad radicals while preserving English prose and IPA slashes', () => {
  const quad = typesetMathHtml('x = (−b ± √(b² − 4ac)) / (2a)', 'maths');
  assert.ok(quad.includes('class="fr"'), 'Expected vertical .fr fraction');
  assert.ok(quad.includes('class="m-rad"'), 'Expected .m-rad overbar radical');
  assert.ok(quad.includes('<sup>2</sup>'), 'Expected clean <sup>2</sup> superscript');

  const fracPow = typesetMathHtml('a^(2/3) + H₂SO₄', 'chem');
  assert.ok(fracPow.includes('fr-sup'), 'Expected fractional exponent markup');
  assert.ok(fracPow.includes('<sub>2</sub>'), 'Expected chemical subscript');

  const prose = typesetMathHtml('Compare urban/rural goods/services and profit/loss in /iː/ vs /ɪ/.', 'econ');
  assert.ok(!prose.includes('class="fr"'), 'Must not turn prose slashes or IPA into fractions');

  const engIpa = typesetMathHtml('Long vowel /iː/ in seat vs short /ɪ/ in sit and/or bit.', 'eng');
  assert.equal(engIpa, 'Long vowel /iː/ in seat vs short /ɪ/ in sit and/or bit.');

  const split = splitRuleEquation("Boyle's Law: P₁V₁ = P₂V₂", 'phys');
  assert.equal(split.hasEquation, true);
  assert.ok(split.eqHtml.includes('<sub>1</sub>'));
});

test('advancedLabSimulation generates interactive sliders, finite readouts, and 25-point curves for all 5 lab subjects', () => {
  for (const sid of ['maths', 'chem', 'phys', 'bio', 'agric'] as const) {
    const labs = getLabsForSubject(sid);
    assert.ok(labs.length > 0);
    for (const lab of labs.slice(0, 3)) {
      const spec = getLabSimulationSpec(lab);
      assert.ok(spec.sliders.length >= 2, `${lab.id} should expose at least 2 interactive sliders`);
      const defaults: Record<string, number> = {};
      for (const p of spec.sliders) {
        assert.ok(p.unit.length >= 0);
        defaults[p.id] = p.defaultValue;
      }
      const res = spec.evaluate(defaults);
      assert.ok(res.curve.points.length >= 25);
      assert.ok(res.metrics.length >= 2);
      const row = formatLabTrialRow(1, spec, defaults, res);
      assert.equal(row.trialNo, 1);
      assert.ok(row.inputsSummary.length > 0);
      assert.ok(row.primaryOutput.length > 0);
    }
  }
});
