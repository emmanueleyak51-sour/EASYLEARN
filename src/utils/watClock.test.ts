import test from 'node:test';
import assert from 'node:assert/strict';
import { formatWatClock } from './watClock';

test('formatWatClock converts UTC to WAT (UTC+1) in both 12h and 24h formats', () => {
  // 2026-11-17T20:30:45Z -> 21:30:45 WAT on Tue, 17 Nov 2026
  const utcEvening = Date.UTC(2026, 10, 17, 20, 30, 45);

  const c12 = formatWatClock(utcEvening, '12h');
  assert.equal(c12.hoursMinutes, '09:30');
  assert.equal(c12.seconds, '45');
  assert.equal(c12.period, 'PM');
  assert.equal(c12.formattedTime, '09:30:45 PM');
  assert.equal(c12.dateLong, 'Tue, 17 Nov 2026');
  assert.equal(c12.dateNumeric, '17 / 11 / 2026');
  assert.equal(c12.zoneFull, 'WAT · UTC+1');

  const c24 = formatWatClock(utcEvening, '24h');
  assert.equal(c24.hoursMinutes, '21:30');
  assert.equal(c24.seconds, '45');
  assert.equal(c24.period, null);
  assert.equal(c24.formattedTime, '21:30:45');
  assert.equal(c24.dateLong, 'Tue, 17 Nov 2026');
});

test('formatWatClock handles WAT midnight rollover and 12:xx AM/PM edge cases', () => {
  // 2026-11-16T23:05:09Z -> 2026-11-17 00:05:09 WAT (rolls into Nov 17 in Lagos!)
  const utcLateNight = Date.UTC(2026, 10, 16, 23, 5, 9);

  const m12 = formatWatClock(utcLateNight, '12h');
  assert.equal(m12.formattedTime, '12:05:09 AM');
  assert.equal(m12.dateLong, 'Tue, 17 Nov 2026');
  assert.equal(m12.dateNumeric, '17 / 11 / 2026');

  const m24 = formatWatClock(utcLateNight, '24h');
  assert.equal(m24.formattedTime, '00:05:09');
  assert.equal(m24.dateLong, 'Tue, 17 Nov 2026');

  // 2026-11-17T11:15:00Z -> 12:15:00 WAT (Noon)
  const utcNoonWat = Date.UTC(2026, 10, 17, 11, 15, 0);
  assert.equal(formatWatClock(utcNoonWat, '12h').formattedTime, '12:15:00 PM');
  assert.equal(formatWatClock(utcNoonWat, '24h').formattedTime, '12:15:00');
});
