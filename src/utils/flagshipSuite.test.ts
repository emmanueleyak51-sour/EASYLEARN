import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateMathExpression } from './calculatorEngine';
import {
  classifyMistakeTrap,
  redeemMistakeRecord,
  summarizeMistakeVault,
  upsertMistakeRecord,
} from './mistakeVaultLogic';
import {
  buildAdaptiveStudyPlan,
  computeDaysRemainingWat,
  getDefaultStudyPlan,
} from './studyPlannerLogic';
import { buildCbtPaper, evaluateCbtSubmission, waecGradeFromPct } from './cbtEngine';
import {
  analyzeMatrix2x2,
  buildTruthTable,
  computeMapBearingAndGradient,
  convertNumberBase,
  evaluateCubicAndTangent,
  evaluateLogicGate,
  formatGridRefs,
  runSafeSqlQuery,
} from './sandboxEngines';
import { buildDuelQuestions, createDuelCode, parseDuelCode } from './peerDuelLogic';
import { makeBlankProgress } from './engine';
import { SUBJECTS, SUBJECT_IDS } from '../data/curriculum';
import type { SubjectId, Topic } from '../types';

function topicsMap(): Record<SubjectId, Topic[]> {
  const out = {} as Record<SubjectId, Topic[]>;
  for (const sid of SUBJECT_IDS) {
    out[sid] = SUBJECTS[sid].topics;
  }
  return out;
}

test('Calculator engine evaluates JAMB & WAEC scientific expressions safely', () => {
  const r1 = evaluateMathExpression('2 + 3 × 4');
  assert.equal(r1.ok, true);
  if (r1.ok) assert.equal(r1.value, 14);

  const r2 = evaluateMathExpression('sin(30) + cos(60)', 'deg');
  assert.equal(r2.ok, true);
  if (r2.ok) assert.ok(Math.abs(r2.value - 1) < 1e-6);

  const r3 = evaluateMathExpression('√(144) + log(1000) + 2^3');
  assert.equal(r3.ok, true);
  if (r3.ok) assert.equal(r3.value, 23);

  const divZero = evaluateMathExpression('10 / 0');
  assert.equal(divZero.ok, false);
});

test('CBT Engine builds 4-subject JAMB UTME paper and computes 400-scale & weak topics', () => {
  const progress = makeBlankProgress();
  const map = topicsMap();
  const paper = buildCbtPaper('jamb', 'sprint', ['eng', 'maths', 'chem', 'phys'], progress, map, 'seed-42');
  assert.equal(paper.length, 42); // 12 Eng + 10 Maths + 10 Chem + 10 Phys

  const answers: Record<string, number> = {};
  paper.forEach((item, idx) => {
    // Get first 32 right, miss last 10
    answers[item.key] = idx < 32 ? item.q.a : (item.q.a + 1) % item.q.o.length;
  });
  const report = evaluateCbtSubmission('jamb', paper, answers);
  assert.equal(report.maxScale, 400);
  assert.equal(report.rawCorrect, 32);
  assert.equal(report.bySubject.length, 4);
  assert.ok(report.scaledScore > 250 && report.scaledScore <= 400);
  assert.ok(report.weakTopics.length > 0);
  assert.equal(waecGradeFromPct(78), 'A1');
  assert.equal(waecGradeFromPct(52), 'C6');
});

test('Mistake Vault classifies traps and enforces 2-separate-day redemption rule', () => {
  const sampleQ = SUBJECTS.maths.topics[0].qs[0];
  const fullQ = { ...sampleQ, id: 'm-1', t: SUBJECTS.maths.topics[0].id };
  const trap = classifyMistakeTrap(
    { ...fullQ, q: 'Which of the following statements is EXCEPT true?' },
    'eng'
  );
  assert.equal(trap, 'exception_wording');

  let vault = upsertMistakeRecord({}, fullQ, 'maths', 1, 'cbt', 100);
  assert.equal(summarizeMistakeVault(vault).total, 1);

  // Day 101 first clear
  const r1 = redeemMistakeRecord(vault, 'm-1', 101, false);
  assert.equal(r1.countedToday, true);
  assert.equal(r1.graduated, false);
  vault = r1.nextVault;

  // Same day 101 second attempt does not graduate when allowSameDay=false
  const rSame = redeemMistakeRecord(vault, 'm-1', 101, false);
  assert.equal(rSame.countedToday, false);
  assert.equal(rSame.graduated, false);

  // Day 102 second clear graduates out of vault
  const r2 = redeemMistakeRecord(vault, 'm-1', 102, false);
  assert.equal(r2.graduated, true);
  assert.equal(summarizeMistakeVault(r2.nextVault).total, 0);
});

test('Adaptive Study Planner computes WAT countdown and interleaves weekly schedule', () => {
  const progress = makeBlankProgress();
  const now = new Date('2026-03-01T12:00:00Z');
  const cfg = { ...getDefaultStudyPlan(progress.subjs, now), examDateIso: '2026-04-15' };
  const days = computeDaysRemainingWat(cfg.examDateIso, now);
  assert.equal(days, 45);

  const snap = buildAdaptiveStudyPlan(cfg, progress, topicsMap(), now);
  assert.equal(snap.daysRemaining, 45);
  assert.ok(snap.totalTopics >= 100);
  assert.ok(snap.weeklyRoadmap.length >= 7);
});

test('Interactive Sandboxes: SQL, Logic Gates, Base Converter, Matrix, Calculus & Map Bearings', () => {
  // SQL WHERE + ORDER BY
  const sqlRes = runSafeSqlQuery("SELECT Full_Name, Score FROM Students WHERE Dept = 'Science' AND Score >= 85 ORDER BY Score DESC;");
  assert.equal(sqlRes.ok, true);
  if (sqlRes.ok) {
    assert.equal(sqlRes.rows.length, 3);
    assert.equal(sqlRes.rows[0].Full_Name, 'Yusuf Danjuma');
  }

  // SQL GROUP BY + AVG
  const groupRes = runSafeSqlQuery('SELECT Dept, COUNT(Student_ID) AS Total, AVG(Score) AS AvgScore FROM Students GROUP BY Dept ORDER BY AvgScore DESC;');
  assert.equal(groupRes.ok, true);
  if (groupRes.ok) {
    assert.equal(groupRes.rows.length, 3);
    assert.equal(groupRes.rows[0].Dept, 'Science');
  }

  // Logic Gates & Base Converter
  assert.equal(evaluateLogicGate('XOR', 1, 0), 1);
  assert.equal(evaluateLogicGate('NAND', 1, 1), 0);
  assert.equal(buildTruthTable('NOT').length, 2);
  const conv = convertNumberBase('157', 10);
  assert.equal(conv.ok, true);
  if (conv.ok) {
    assert.equal(conv.binary, '10011101');
    assert.equal(conv.hex, '9D');
  }

  // Further Maths Matrix & Cubic Derivative
  const mat = analyzeMatrix2x2(2, 0, 0, 3);
  assert.equal(mat.det, 6);
  assert.equal(mat.isSingular, false);
  const calc = evaluateCubicAndTangent(1, -3, 0, 2); // y = x^3 - 3x^2 => y' = 3x^2 - 6x => at x=2, y'=0 (min)
  assert.equal(calc.slope, 0);
  assert.match(calc.nature, /Minimum/i);

  // Geography Grid Ref & Bearing
  const refs = formatGridRefs({ easting: 12.4, northing: 25.7, elevationM: 120 });
  assert.equal(refs.fourFig, '1225');
  assert.equal(refs.sixFig, '124257');
  const mapRes = computeMapBearingAndGradient(
    { easting: 12, northing: 22, elevationM: 120 },
    { easting: 15, northing: 22, elevationM: 420 },
    50000
  );
  assert.equal(mapRes.forwardBearingStr, '090°');
  assert.equal(mapRes.backBearingStr, '270°');
  assert.equal(mapRes.groundDistanceKm, 3);
  assert.equal(mapRes.gradientRatio, '1 in 10');
});

test('Peer Study Duel codes parse deterministically and yield identical 10-question decks', () => {
  const spec = createDuelCode('chem', 'LAB99X');
  assert.equal(spec.code, 'RTC-CHM-LAB99X');
  const parsed = parseDuelCode(spec.code);
  assert.ok(parsed);
  assert.equal(parsed!.subj, 'chem');

  const p = makeBlankProgress();
  const d1 = buildDuelQuestions(parsed!, p, SUBJECTS.chem.topics);
  const d2 = buildDuelQuestions(parsed!, p, SUBJECTS.chem.topics);
  assert.equal(d1.length, 10);
  assert.deepEqual(
    d1.map((x) => x.q.id),
    d2.map((x) => x.q.id)
  );
});
