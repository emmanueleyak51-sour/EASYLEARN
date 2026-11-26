import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_READING_COMFORT,
  buildCalmMomentumCopy,
  estimateReadingMinutesFromHtml,
  parseReadingComfortPrefs,
  serializeReadingComfortPrefs,
} from './readingComfortLogic';

test('parseReadingComfortPrefs returns calm defaults on empty or malformed input', () => {
  assert.deepEqual(parseReadingComfortPrefs(null), DEFAULT_READING_COMFORT);
  assert.deepEqual(parseReadingComfortPrefs(''), DEFAULT_READING_COMFORT);
  assert.deepEqual(parseReadingComfortPrefs('{broken-json'), DEFAULT_READING_COMFORT);
  assert.deepEqual(
    parseReadingComfortPrefs(JSON.stringify({ surface: 'neon', fontScale: 'huge' })),
    DEFAULT_READING_COMFORT
  );
});

test('parseReadingComfortPrefs and serializeReadingComfortPrefs round-trip valid Apple Books settings', () => {
  const serialized = serializeReadingComfortPrefs({ surface: 'sepia', fontScale: 'large' });
  const parsed = parseReadingComfortPrefs(serialized);
  assert.deepEqual(parsed, { surface: 'sepia', fontScale: 'large' });

  const nightCompact = parseReadingComfortPrefs(
    serializeReadingComfortPrefs({ surface: 'night', fontScale: 'compact' })
  );
  assert.deepEqual(nightCompact, { surface: 'night', fontScale: 'compact' });
});

test('estimateReadingMinutesFromHtml strips HTML tags and computes realistic study minutes', () => {
  assert.equal(estimateReadingMinutesFromHtml([]), 2);
  const shortChunk = '<p>Force equals mass times acceleration: <b>F = ma</b>.</p>';
  assert.equal(estimateReadingMinutesFromHtml([shortChunk]), 1);

  const words400 = Array.from({ length: 400 }, () => 'equilibrium').join(' ');
  assert.equal(estimateReadingMinutesFromHtml([`<div>${words400}</div>`]), 3);
});

test('buildCalmMomentumCopy adapts warmly to streak, mastery, and completion', () => {
  const fresh = buildCalmMomentumCopy({
    streakDays: 0,
    subjectShort: 'Maths',
    passedTopics: 0,
    totalTopics: 20,
    dueCount: 0,
  });
  assert.equal(fresh.headlineTag, 'Today’s focus');
  assert.match(fresh.encouragement, /Learn, practise 6 questions/);

  const streak = buildCalmMomentumCopy({
    streakDays: 5,
    subjectShort: 'Chem',
    passedTopics: 3,
    totalTopics: 18,
    dueCount: 2,
  });
  assert.equal(streak.headlineTag, '5-day rhythm');
  assert.match(streak.encouragement, /5 days running/);

  const done = buildCalmMomentumCopy({
    streakDays: 10,
    subjectShort: 'Physics',
    passedTopics: 15,
    totalTopics: 15,
    dueCount: 4,
  });
  assert.equal(done.headlineTag, 'Physics mastered');
  assert.match(done.encouragement, /4 due for recall/);
});
