import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeScreenTransition,
  computeSubjectSwitchDirection,
  SCREEN_HIERARCHY_DEPTH,
} from './screenTransitionLogic';

test('all 5 primary tabs sit on depth 0 and glide directionally left/right', () => {
  for (const scr of ['home', 'subjs', 'topics', 'cbt', 'more'] as const) {
    assert.equal(SCREEN_HIERARCHY_DEPTH[scr], 0, `${scr} must sit at depth 0`);
  }

  // Moving rightward across primary tabs -> kind: 'tab', direction: +1
  assert.deepEqual(computeScreenTransition('home', 'subjs'), { kind: 'tab', direction: 1 });
  assert.deepEqual(computeScreenTransition('subjs', 'topics'), { kind: 'tab', direction: 1 });
  assert.deepEqual(computeScreenTransition('topics', 'cbt'), { kind: 'tab', direction: 1 });
  assert.deepEqual(computeScreenTransition('cbt', 'more'), { kind: 'tab', direction: 1 });
  assert.deepEqual(computeScreenTransition('home', 'more'), { kind: 'tab', direction: 1 });

  // Moving leftward across primary tabs -> kind: 'tab', direction: -1
  assert.deepEqual(computeScreenTransition('more', 'cbt'), { kind: 'tab', direction: -1 });
  assert.deepEqual(computeScreenTransition('more', 'topics'), { kind: 'tab', direction: -1 });
  assert.deepEqual(computeScreenTransition('more', 'home'), { kind: 'tab', direction: -1 });
  assert.deepEqual(computeScreenTransition('topics', 'subjs'), { kind: 'tab', direction: -1 });
  assert.deepEqual(computeScreenTransition('subjs', 'home'), { kind: 'tab', direction: -1 });
});

test('drill-down and back navigation resolve to push (+1) and pop (-1)', () => {
  assert.deepEqual(computeScreenTransition('topics', 'topic'), { kind: 'push', direction: 1 });
  assert.deepEqual(computeScreenTransition('topic', 'notes'), { kind: 'push', direction: 1 });
  assert.deepEqual(computeScreenTransition('subjs', 'review'), { kind: 'push', direction: 1 });
  assert.deepEqual(computeScreenTransition('home', 'formulas'), { kind: 'push', direction: 1 });

  assert.deepEqual(computeScreenTransition('notes', 'topic'), { kind: 'pop', direction: -1 });
  assert.deepEqual(computeScreenTransition('topic', 'topics'), { kind: 'pop', direction: -1 });
  assert.deepEqual(computeScreenTransition('review', 'subjs'), { kind: 'pop', direction: -1 });
  assert.deepEqual(computeScreenTransition('formulas', 'home'), { kind: 'pop', direction: -1 });
});

test('computeSubjectSwitchDirection resolves canonical subject direction', () => {
  assert.equal(computeSubjectSwitchDirection('maths', 'civic'), 1);
  assert.equal(computeSubjectSwitchDirection('chem', 'bio'), 1);
  assert.equal(computeSubjectSwitchDirection('civic', 'maths'), -1);
  assert.equal(computeSubjectSwitchDirection('eng', 'econ'), 1);
  assert.equal(computeSubjectSwitchDirection('econ', 'eng'), -1);
  assert.equal(computeSubjectSwitchDirection('civic', 'civic'), 0);
});

test('landing website transitions smoothly via crossfade to welcome and home', () => {
  assert.equal(SCREEN_HIERARCHY_DEPTH.landing, 0);
  assert.deepEqual(computeScreenTransition('landing', 'welcome'), { kind: 'fade', direction: 1 });
  assert.deepEqual(computeScreenTransition('welcome', 'landing'), { kind: 'fade', direction: -1 });
  assert.deepEqual(computeScreenTransition('home', 'landing'), { kind: 'fade', direction: -1 });
});

