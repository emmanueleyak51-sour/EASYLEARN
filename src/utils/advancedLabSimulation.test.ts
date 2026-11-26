import test from 'node:test';
import assert from 'node:assert/strict';
import { getLabsForSubject } from '../data/labs';
import {
  computeLabTrialStats,
  formatLabReportText,
  formatLabTrialRow,
  getLabSimulationSpec,
} from './advancedLabSimulation';

test('computeLabTrialStats calculates mean and linear best-fit slope across logged trials', () => {
  assert.deepEqual(computeLabTrialStats([]), { count: 0, meanY: null, slope: null });

  const single = computeLabTrialStats([
    {
      trialNo: 1,
      inputsSummary: 'L: 40 cm',
      primaryOutput: '1.27 s',
      statusLabel: 'Nominal',
      xValue: 10,
      yValue: 25,
    },
  ]);
  assert.equal(single.count, 1);
  assert.equal(single.meanY, 25);
  assert.equal(single.slope, null);

  // Exact y = 2.5x + 5 line across 3 points: (2, 10), (4, 15), (6, 20)
  const linear = computeLabTrialStats([
    {
      trialNo: 1,
      inputsSummary: 'X: 2',
      primaryOutput: '10',
      statusLabel: 'Nominal',
      xValue: 2,
      yValue: 10,
    },
    {
      trialNo: 2,
      inputsSummary: 'X: 4',
      primaryOutput: '15',
      statusLabel: 'Nominal',
      xValue: 4,
      yValue: 15,
    },
    {
      trialNo: 3,
      inputsSummary: 'X: 6',
      primaryOutput: '20',
      statusLabel: 'Endpoint',
      xValue: 6,
      yValue: 20,
    },
  ]);
  assert.equal(linear.count, 3);
  assert.equal(linear.meanY, 15);
  assert.ok(linear.slope !== null && Math.abs(linear.slope - 2.5) < 1e-9);

  const report = formatLabReportText('Simple Pendulum', 'Period T', [
    {
      trialNo: 1,
      inputsSummary: 'L: 40 cm',
      primaryOutput: '1.27 s',
      statusLabel: 'Nominal',
      xValue: 2,
      yValue: 10,
    },
    {
      trialNo: 2,
      inputsSummary: 'L: 80 cm',
      primaryOutput: '1.79 s',
      statusLabel: 'Nominal',
      xValue: 6,
      yValue: 20,
    },
  ], linear);
  assert.match(report, /Simple Pendulum — Practical Readings/);
  assert.match(report, /Best-fit slope \(Δy\/Δx\): 2\.500/);
});

test('formatLabTrialRow records numeric curve coordinates from getLabSimulationSpec', () => {
  const chemLab =
    getLabsForSubject('chem').find((l) => l.id === 'c-titration') || getLabsForSubject('chem')[0];
  const spec = getLabSimulationSpec(chemLab);
  const vals: Record<string, number> = {};
  for (const s of spec.sliders) {
    vals[s.id] = s.defaultValue;
  }
  const ev = spec.evaluate(vals);
  const logged = formatLabTrialRow(1, spec, vals, ev);
  assert.equal(logged.trialNo, 1);
  assert.equal(logged.xValue, ev.curve.currentPoint.x);
  assert.equal(logged.yValue, ev.curve.currentPoint.y);
  assert.ok(logged.statusLabel.length > 0);
});
