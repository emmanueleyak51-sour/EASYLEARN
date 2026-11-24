import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEMO_DURATION_MS,
  computeDemoSessionStatus,
  formatDemoCountdown,
  pauseDemoSessionKeepClock,
  startOrResumeDemoSession,
} from './demoSessionLogic';

test('strict 5-minute demo timer counts down accurately and expires at exactly 5:00', () => {
  assert.equal(DEMO_DURATION_MS, 300_000);
  assert.equal(formatDemoCountdown(300_000), '5:00');
  assert.equal(formatDemoCountdown(61_000), '1:01');
  assert.equal(formatDemoCountdown(9_001), '0:10');
  assert.equal(formatDemoCountdown(0), '0:00');

  const t0 = 1_700_000_000_000;
  const started = startOrResumeDemoSession(null, t0);
  assert.equal(started.startedAtMs, t0);
  assert.equal(started.active, true);

  // At 2 minutes elapsed -> 3:00 left, not warning, not expired
  const mid = computeDemoSessionStatus(started, t0 + 120_000);
  assert.equal(mid.isDemoActive, true);
  assert.equal(mid.formattedRemaining, '3:00');
  assert.equal(mid.isWarning, false);
  assert.equal(mid.isExpired, false);

  // At 4m 30s elapsed -> 0:30 left, warning active
  const warn = computeDemoSessionStatus(started, t0 + 270_000);
  assert.equal(warn.formattedRemaining, '0:30');
  assert.equal(warn.isWarning, true);
  assert.equal(warn.isExpired, false);

  // At exactly 5:00 elapsed -> strictly expired
  const expired = computeDemoSessionStatus(started, t0 + 300_000);
  assert.equal(expired.formattedRemaining, '0:00');
  assert.equal(expired.remainingMs, 0);
  assert.equal(expired.isExpired, true);
});

test('re-clicking Try Demo after pausing or expiring preserves original clock and cannot reset 5-minute limit', () => {
  const t0 = 1_700_000_000_000;
  const started = startOrResumeDemoSession(null, t0);
  const paused = pauseDemoSessionKeepClock(started);
  assert.equal(paused?.active, false);
  assert.equal(paused?.startedAtMs, t0);

  // User tries clicking "Try demo" again 6 minutes later
  const resumed = startOrResumeDemoSession(paused, t0 + 360_000);
  assert.equal(resumed.startedAtMs, t0);
  assert.equal(resumed.active, true);

  const status = computeDemoSessionStatus(resumed, t0 + 360_000);
  assert.equal(status.isExpired, true);
  assert.equal(status.remainingMs, 0);
});
