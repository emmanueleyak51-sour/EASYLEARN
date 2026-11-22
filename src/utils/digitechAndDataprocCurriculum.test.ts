import test from 'node:test';
import assert from 'node:assert/strict';
import { SUBJECT_IDS, SUBJECTS, getTopicsForProgress } from '../data/curriculum';
import { getLabsForSubject } from '../data/labs';
import { makeBlankProgress, SUBJECT_INFO } from './engine';
import { typesetMathHtml } from './mathTypesetter';
import {
  DIGITECH_CLASSES,
  DIGITECH_NERDC_MAP,
  filterDigiTechTopicsByClass,
} from '../data/digitechNerdc2027';
import {
  DATAPROC_CLASSES,
  DATAPROC_NERDC_MAP,
  filterDataProcTopicsByClass,
} from '../data/dataprocNerdc2027';
import { DIGITECH_FORMULAS } from '../data/digitechFormulas';
import { DATAPROC_FORMULAS } from '../data/dataprocFormulas';
import {
  buildDigiTechFormulaDrillDeck,
  extractDigiTechFormulaSpeechScript,
  filterDigiTechFormulas,
} from './digitechFormulaLogic';
import {
  buildDataProcFormulaDrillDeck,
  extractDataProcFormulaSpeechScript,
  filterDataProcFormulas,
} from './dataprocFormulaLogic';
import {
  buildDigiTechCoachSystemPrompt,
  buildDataProcCoachSystemPrompt,
} from './chemVoiceLogic';

test('49-subject symmetry, blank progress defaults, mentor voices, and math typesetter slash protection', () => {
  assert.equal(SUBJECT_IDS.length, 49);
  const blank = makeBlankProgress();
  assert.deepEqual(blank.subjs, ['eng', 'maths']);
  assert.equal(getTopicsForProgress({ ...blank, subj: 'digitech' }).length, 30);
  assert.equal(getTopicsForProgress({ ...blank, subj: 'dataproc' }).length, 30);

  assert.equal(SUBJECT_INFO.digitech.short, 'DigiTech');
  assert.equal(SUBJECT_INFO.dataproc.short, 'DataProc');

  const dtPrompt = buildDigiTechCoachSystemPrompt({
    topicName: 'Von Neumann Architecture',
    stepText: 'Fetch, decode, and execute cycle in the CPU.',
  });
  const dpPrompt = buildDataProcCoachSystemPrompt({
    topicName: 'Database Normalization',
    stepText: '1NF, 2NF, and 3NF eliminate update anomalies.',
  });
  assert.ok(dtPrompt.includes('Engineer Tunde'));
  assert.ok(dpPrompt.includes('Mrs. Kemi'));

  const dtSlash = typesetMathHtml('Compare I/O bus and TCP/IP throughput over HTTP/HTTPS.', 'digitech');
  assert.equal(dtSlash.includes('class="fr"'), false, 'DigiTech technical slashes must not become vertical fractions');

  const dpSlash = typesetMathHtml('Client/Server RDBMS with SQL PL/SQL and CSV/JSON import/export.', 'dataproc');
  assert.equal(dpSlash.includes('class="fr"'), false, 'DataProc technical slashes must not become vertical fractions');

  const dpCode = typesetMathHtml(
    'Running `DELETE FROM Students;` without `WHERE Student_ID = 10` causes a `CROSS JOIN` or full wipe.',
    'dataproc'
  );
  assert.equal(dpCode.includes('`'), false, 'No literal markdown backticks should leak into rendered HTML');
  assert.ok(dpCode.includes('<code class="rtc-code">DELETE FROM Students;</code>'));
  assert.ok(dpCode.includes('<code class="rtc-code">WHERE Student_ID = 10</code>'), 'Identifiers inside backticks must not be mangled into subscripts');
  assert.ok(dpCode.includes('<code class="rtc-code">CROSS JOIN</code>'));
});

test('Digital Technologies SS1-SS3 curriculum (30 topics, 180 MCQs), 20 formulas, drills, zero raw LaTeX, and zero labs', () => {
  const dt = SUBJECTS.digitech;
  assert.equal(dt.topics.length, 30);
  assert.equal(
    dt.topics.reduce((acc, t) => acc + t.qs.length, 0),
    180
  );
  assert.equal(DIGITECH_CLASSES.length, 4);
  const dtDomains = new Set(Object.values(DIGITECH_NERDC_MAP).map((m) => m.domain));
  assert.equal(dtDomains.size, 5);
  assert.equal(filterDigiTechTopicsByClass(dt.topics, 'ss1').length, 10);
  assert.equal(filterDigiTechTopicsByClass(dt.topics, 'ss2').length, 10);
  assert.equal(filterDigiTechTopicsByClass(dt.topics, 'ss3').length, 10);
  assert.equal(getTopicsForProgress({ subj: 'digitech', digitechClass: 'ss2' }).length, 10);
  assert.equal(getLabsForSubject('digitech').length, 0);

  for (const t of dt.topics) {
    assert.ok(DIGITECH_NERDC_MAP[t.id], `Missing DIGITECH_NERDC_MAP for ${t.id}`);
    assert.ok(t.parts.length >= 2, `${t.id} should have at least 2 note chapters`);
    assert.ok(dt.il[t.id], `Missing interactive lesson for ${t.id}`);
    const serialized = JSON.stringify(t);
    assert.equal(serialized.includes('\\dfrac'), false, `Raw LaTeX \\dfrac in ${t.id}`);
    assert.equal(/\\(?:dfrac|frac|sqrt|times|cdot|leq|geq|neq)\b/.test(serialized), false, `Raw LaTeX command in ${t.id}`);
  }

  assert.equal(DIGITECH_FORMULAS.length, 20);
  assert.ok(filterDigiTechFormulas(DIGITECH_FORMULAS, 'binary', '').length >= 4);
  assert.ok(extractDigiTechFormulaSpeechScript(DIGITECH_FORMULAS[0], 0).length > 30);

  const deck = buildDigiTechFormulaDrillDeck('all', null, 8, 42);
  assert.equal(deck.length, 8);
  for (const item of deck) {
    assert.equal(item.options.length, 4);
    assert.ok(item.answerIdx >= 0 && item.answerIdx < 4);
    assert.equal(new Set(item.options).size, 4, `Duplicate options in ${item.id}`);
  }
});

test('Data Processing SS1-SS3 curriculum (30 topics, 180 MCQs), 20 SQL/relational/spreadsheet formulas, drills, zero raw LaTeX, and zero labs', () => {
  const dp = SUBJECTS.dataproc;
  assert.equal(dp.topics.length, 30);
  assert.equal(
    dp.topics.reduce((acc, t) => acc + t.qs.length, 0),
    180
  );
  assert.equal(DATAPROC_CLASSES.length, 4);
  const dpDomains = new Set(Object.values(DATAPROC_NERDC_MAP).map((m) => m.domain));
  assert.equal(dpDomains.size, 5);
  assert.equal(filterDataProcTopicsByClass(dp.topics, 'ss1').length, 10);
  assert.equal(filterDataProcTopicsByClass(dp.topics, 'ss2').length, 10);
  assert.equal(filterDataProcTopicsByClass(dp.topics, 'ss3').length, 10);
  assert.equal(getTopicsForProgress({ subj: 'dataproc', dataprocClass: 'ss3' }).length, 10);
  assert.equal(getLabsForSubject('dataproc').length, 0);

  for (const t of dp.topics) {
    assert.ok(DATAPROC_NERDC_MAP[t.id], `Missing DATAPROC_NERDC_MAP for ${t.id}`);
    assert.ok(t.parts.length >= 2, `${t.id} should have at least 2 note chapters`);
    assert.ok(dp.il[t.id], `Missing interactive lesson for ${t.id}`);
    const serialized = JSON.stringify(t);
    assert.equal(serialized.includes('\\dfrac'), false, `Raw LaTeX \\dfrac in ${t.id}`);
    assert.equal(/\\(?:dfrac|frac|sqrt|times|cdot|leq|geq|neq)\b/.test(serialized), false, `Raw LaTeX command in ${t.id}`);
  }

  assert.equal(DATAPROC_FORMULAS.length, 20);
  assert.ok(filterDataProcFormulas(DATAPROC_FORMULAS, 'sql', '').length >= 4);
  assert.ok(extractDataProcFormulaSpeechScript(DATAPROC_FORMULAS[0], 0).length > 30);

  const deck = buildDataProcFormulaDrillDeck('all', null, 8, 42);
  assert.equal(deck.length, 8);
  for (const item of deck) {
    assert.equal(item.options.length, 4);
    assert.ok(item.answerIdx >= 0 && item.answerIdx < 4);
    assert.equal(new Set(item.options).size, 4, `Duplicate options in ${item.id}`);
  }
});
