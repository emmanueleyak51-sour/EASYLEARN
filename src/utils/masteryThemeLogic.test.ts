import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MASTERY_THEMES,
  getMasteryThemeById,
  getThemePreview,
} from '../data/masteryThemes';
import { getTopics } from '../data/curriculum';
import { makeBlankProgress, recordAnswer } from './engine';
import {
  computeGoalProgress,
  isThemeUnlocked,
  resolveEffectiveThemeId,
  resolveEffectiveThemeMode,
} from './masteryThemeLogic';

test('MASTERY_THEMES defines 10 stages from 0% to 100% of goal, each with Light and Dark palettes', () => {
  assert.equal(MASTERY_THEMES.length, 10);
  MASTERY_THEMES.forEach((theme, idx) => {
    assert.equal(theme.stage, idx + 1);
    if (idx > 0) {
      assert.ok(
        theme.unlockGoalPct > MASTERY_THEMES[idx - 1].unlockGoalPct,
        `Stage ${theme.stage} threshold (${theme.unlockGoalPct}) must exceed Stage ${idx}`
      );
    }
    const light = getThemePreview(theme, 'light');
    const dark = getThemePreview(theme, 'dark');
    assert.notEqual(light.bg, dark.bg, `${theme.id} light and dark backgrounds must differ`);
    assert.notEqual(light.ink, dark.ink, `${theme.id} light and dark inks must differ`);
    assert.match(light.bg, /^#[EF][0-9A-F]{5}$/i, `${theme.id} light bg (${light.bg}) is daylight`);
    assert.match(dark.bg, /^#[01][0-9A-F]{5}$/i, `${theme.id} dark bg (${dark.bg}) is nocturnal`);
  });
  assert.equal(MASTERY_THEMES[0].unlockGoalPct, 0);
  assert.equal(MASTERY_THEMES[9].unlockGoalPct, 100);
});

test('resolveEffectiveThemeMode defaults to light and switches cleanly to dark across any stage', () => {
  const blank = makeBlankProgress();
  assert.equal(blank.themeMode, 'light');
  assert.equal(resolveEffectiveThemeMode({}), 'light');
  assert.equal(resolveEffectiveThemeMode({ themeMode: 'light' }), 'light');
  assert.equal(resolveEffectiveThemeMode({ themeMode: 'dark' }), 'dark');
});

test('fresh blank progress starts at 0% goal progress and Stage 1 (no Bayesian prior leak)', () => {
  const blank = makeBlankProgress();
  const engTopics = getTopics('eng');
  const snap = computeGoalProgress(blank, engTopics);
  assert.equal(snap.goalPct, 0);
  assert.equal(snap.highestUnlockedStage, 1);
  assert.equal(snap.highestUnlockedTheme.id, 'stage-1-adire');
  assert.equal(snap.nextTheme?.stage, 2);
});

test('goal progress increases monotonically as lessons, practice, and topic tests are completed up to 100%', () => {
  let p = makeBlankProgress();
  p.subj = 'eng';
  p.target = 75;
  const topics = getTopics('eng');

  const s0 = computeGoalProgress(p, topics);
  assert.equal(s0.goalPct, 0);

  // Complete 4 lessons
  for (let i = 0; i < 4; i++) {
    const tid = topics[i].id;
    p = {
      ...p,
      t: { ...p.t, [tid]: { att: [], lesson: 1, practice: 0, boss: 0 } },
    };
  }
  const sLessons = computeGoalProgress(p, topics);
  assert.ok(sLessons.goalPct > s0.goalPct, 'completing lessons advances goalPct');

  // Answer questions accurately and pass half of topics
  for (let i = 0; i < Math.floor(topics.length / 2); i++) {
    const t = topics[i];
    const q = { ...t.qs[0], id: `${t.id}-1`, t: t.id };
    p = recordAnswer(p, q, true, 'boss');
    p = {
      ...p,
      t: {
        ...p.t,
        [t.id]: { ...p.t[t.id], lesson: 1, practice: 1, boss: 1 },
      },
    };
  }
  const sHalf = computeGoalProgress(p, topics);
  assert.ok(sHalf.goalPct >= 48, `half syllabus passed should reach >=48% (got ${sHalf.goalPct}%)`);
  assert.ok(sHalf.highestUnlockedStage >= 5, 'Stage 5+ should be unlocked halfway');

  // Pass all topics -> 100% goal & Stage 10 unlocked
  for (const t of topics) {
    p = {
      ...p,
      t: {
        ...p.t,
        [t.id]: { att: [[1, 5]], lesson: 1, practice: 1, boss: 1 },
      },
    };
  }
  const sFull = computeGoalProgress(p, topics);
  assert.equal(sFull.goalPct, 100);
  assert.equal(sFull.highestUnlockedStage, 10);
  assert.equal(sFull.highestUnlockedTheme.id, 'stage-10-chancellor');
  assert.equal(sFull.nextTheme, null);
});

test('unlocked Test Mode allows selecting all 10 themes while Goal-Lock Mode enforces earned milestones', () => {
  const stage10 = getMasteryThemeById('stage-10-chancellor');
  const stage4 = getMasteryThemeById('stage-4-lagoon'); // 36%

  // In 'unlocked' test mode, Stage 10 is selectable even at 0% goal
  assert.equal(isThemeUnlocked(stage10, 0, 'unlocked'), true);
  assert.equal(
    resolveEffectiveThemeId({ themeId: 'stage-10-chancellor', themeLockMode: 'unlocked' }, 0),
    'stage-10-chancellor'
  );

  // Switch to 'goal' lock mode at 0% -> Stage 10 and Stage 4 lock, effective theme clamps to Stage 1
  assert.equal(isThemeUnlocked(stage10, 0, 'goal'), false);
  assert.equal(isThemeUnlocked(stage4, 0, 'goal'), false);
  assert.equal(
    resolveEffectiveThemeId({ themeId: 'stage-10-chancellor', themeLockMode: 'goal' }, 0),
    'stage-1-adire'
  );

  // At 40% goal in 'goal' lock mode -> Stage 4 (36%) is unlocked, Stage 10 clamps to Stage 4
  assert.equal(isThemeUnlocked(stage4, 40, 'goal'), true);
  assert.equal(
    resolveEffectiveThemeId({ themeId: 'stage-4-lagoon', themeLockMode: 'goal' }, 40),
    'stage-4-lagoon'
  );
  assert.equal(
    resolveEffectiveThemeId({ themeId: 'stage-10-chancellor', themeLockMode: 'goal' }, 40),
    'stage-4-lagoon'
  );
});
