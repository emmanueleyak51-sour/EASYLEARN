import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildOpeningWelcomeCopy,
  computeCrestParallaxTilt,
  generateWelcomeStarfield,
  getTimeOfDayGreeting,
  shouldShowOpeningWelcome,
} from './openingWelcomeLogic';

test('shouldShowOpeningWelcome plays once on fresh launch and respects autostart/splash query flags', () => {
  assert.equal(shouldShowOpeningWelcome('', false), true);
  assert.equal(shouldShowOpeningWelcome('', true), false);
  assert.equal(shouldShowOpeningWelcome('?autostart=1', false), false);
  assert.equal(shouldShowOpeningWelcome('?nosplash=1', false), false);
  assert.equal(shouldShowOpeningWelcome('?splash=1', true), true);
  assert.equal(shouldShowOpeningWelcome('splash=1&autostart=1', true), true);
});

test('buildOpeningWelcomeCopy personalizes greeting and readiness metadata for returning and new students', () => {
  assert.equal(getTimeOfDayGreeting(8), 'Good morning');
  assert.equal(getTimeOfDayGreeting(14), 'Good afternoon');
  assert.equal(getTimeOfDayGreeting(20), 'Good evening');

  const fresh = buildOpeningWelcomeCopy('', 9);
  assert.equal(fresh.greeting, 'Good morning, Scholar');
  assert.equal(fresh.headline, 'Welcome to Easy Learn');
  assert.equal(fresh.ctaLabel, 'Enter Studio');
  assert.deepEqual(fresh.readinessItems, [
    '49 Subjects',
    'Interactive Worlds',
    'Voice Teachers',
    'Virtual Labs',
  ]);

  const returning = buildOpeningWelcomeCopy('  Ada  ', 19, {
    subjectCount: 4,
    streakDays: 5,
  });
  assert.equal(returning.greeting, 'Good evening, Ada');
  assert.equal(returning.headline, 'Welcome back to Easy Learn');
  assert.equal(returning.ctaLabel, 'Continue Learning');
  assert.equal(returning.readinessItems[0], '4 Active Subjects');
  assert.equal(returning.readinessItems[3], '5d Streak');
});

test('computeCrestParallaxTilt clamps pointer offsets into bounded 3D rotation and glare coordinates', () => {
  const neutral = computeCrestParallaxTilt(0, 0, 10);
  assert.deepEqual(neutral, { rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });

  const extreme = computeCrestParallaxTilt(2.5, -3, 10);
  assert.equal(extreme.rotateX, 10);
  assert.equal(extreme.rotateY, 10);
  assert.equal(extreme.glareX, 84);
  assert.equal(extreme.glareY, 16);
});

test('generateWelcomeStarfield produces deterministic bounded coordinates without NaN', () => {
  const first = generateWelcomeStarfield(14);
  const second = generateWelcomeStarfield(14);
  assert.equal(first.length, 14);
  assert.deepEqual(first, second);
  for (const star of first) {
    assert.ok(star.xPct >= 6 && star.xPct <= 94);
    assert.ok(star.yPct >= 8 && star.yPct <= 92);
    assert.ok(star.sizePx >= 2 && star.sizePx <= 4);
  }
});
