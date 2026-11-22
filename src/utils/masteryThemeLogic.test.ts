import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_MASTERY_THEME_ID,
  MASTERY_THEMES,
  getMasteryThemeById,
  getThemePreview,
} from '../data/masteryThemes';
import { getTopics } from '../data/curriculum';
import { makeBlankProgress, today } from './engine';
import {
  computeGoalProgress,
  hasPremiumThemeAccess,
  isThemeUnlocked,
  resolveEffectiveThemeId,
  resolveEffectiveThemeMode,
} from './masteryThemeLogic';

test('MASTERY_THEMES defines Playful grape as standard free theme and reserves the remaining 9 for Premium', () => {
  assert.equal(MASTERY_THEMES.length, 10);
  assert.equal(MASTERY_THEMES[0].id, DEFAULT_MASTERY_THEME_ID);
  assert.equal(MASTERY_THEMES[0].premiumOnly, false);

  for (let i = 1; i < MASTERY_THEMES.length; i++) {
    const theme = MASTERY_THEMES[i];
    assert.equal(theme.premiumOnly, true, `${theme.id} must be reserved for Premium`);
  }

  MASTERY_THEMES.forEach((theme) => {
    const light = getThemePreview(theme, 'light');
    const dark = getThemePreview(theme, 'dark');
    assert.notEqual(light.bg, dark.bg, `${theme.id} light and dark backgrounds must differ`);
    assert.notEqual(light.ink, dark.ink, `${theme.id} light and dark inks must differ`);
    assert.match(light.bg, /^#[EF][0-9A-F]{5}$/i, `${theme.id} light bg (${light.bg}) is daylight`);
    assert.match(dark.bg, /^#[01][0-9A-F]{5}$/i, `${theme.id} dark bg (${dark.bg}) is nocturnal`);
  });
});

test('resolveEffectiveThemeMode allows both Light and Dark mode for all students while locking extra colour themes', () => {
  const curDay = 20500;
  const blank = makeBlankProgress();
  assert.equal(blank.themeMode, 'light');
  assert.equal(blank.themeAutoProgress, false);
  assert.equal(resolveEffectiveThemeMode({}, curDay), 'light');
  assert.equal(resolveEffectiveThemeMode({ themeMode: 'light' }, curDay), 'light');
  // Every student (including unsubscribed starter-trial students) can freely use Dark mode on Playful grape
  assert.equal(resolveEffectiveThemeMode({ themeMode: 'dark' }, curDay), 'dark');
});

test('standard students always stay on Playful grape even if a legacy stage theme was previously saved or syllabus is 100%', () => {
  const curDay = today();
  const standardUser = makeBlankProgress();

  assert.equal(hasPremiumThemeAccess(standardUser, curDay), false);
  assert.equal(isThemeUnlocked(getMasteryThemeById('stage-1-adire'), standardUser, curDay), true);
  assert.equal(isThemeUnlocked(getMasteryThemeById('stage-9-starlight'), standardUser, curDay), false);
  assert.equal(isThemeUnlocked(getMasteryThemeById('stage-10-chancellor'), standardUser, curDay), false);

  // Even if localStorage previously stored stage-9-starlight or stage-10-chancellor, effective theme is Playful grape
  assert.equal(
    resolveEffectiveThemeId({ themeId: 'stage-9-starlight', pro: null, owner: 0 }, curDay),
    'stage-1-adire'
  );
  assert.equal(
    resolveEffectiveThemeId({ themeId: 'stage-10-chancellor', pro: null, owner: 0 }, curDay),
    'stage-1-adire'
  );

  // Completing 100% of topics does not unlock Premium themes without Premium status
  const topics = getTopics('eng');
  let mastered = makeBlankProgress();
  for (const t of topics) {
    mastered = {
      ...mastered,
      t: { ...mastered.t, [t.id]: { att: [[1, 5]], lesson: 1, practice: 1, boss: 1 } },
    };
  }
  const snap = computeGoalProgress(mastered, topics);
  assert.equal(snap.goalPct, 100);
  assert.equal(
    resolveEffectiveThemeId({ ...mastered, themeId: 'stage-10-chancellor' }, curDay),
    'stage-1-adire'
  );
});

test('Premium students (active pro pass or owner) can unlock and select any of the 10 colour themes', () => {
  const curDay = 20500;
  const premiumStudent = {
    themeId: 'stage-9-starlight' as const,
    pro: {
      pid: 'season',
      until: curDay + 30,
      code: 'EYAK-ABCD-2345',
      on: curDay,
      sig: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
    },
    owner: 0,
  };

  assert.equal(hasPremiumThemeAccess(premiumStudent, curDay), true);
  for (const theme of MASTERY_THEMES) {
    assert.equal(isThemeUnlocked(theme, premiumStudent, curDay), true);
  }
  assert.equal(resolveEffectiveThemeId(premiumStudent, curDay), 'stage-9-starlight');

  // Unsigned client-forged pro object without server sig is rejected
  const unsignedStudent = {
    themeId: 'stage-9-starlight' as const,
    pro: { pid: 'season', until: curDay + 30, code: 'FORGED', on: curDay },
    owner: 0,
  };
  assert.equal(hasPremiumThemeAccess(unsignedStudent, curDay), false);
  assert.equal(resolveEffectiveThemeId(unsignedStudent, curDay), 'stage-1-adire');

  // Expired pass reverts cleanly to Playful grape
  const expiredStudent = {
    themeId: 'stage-9-starlight' as const,
    pro: {
      pid: 'weekly',
      until: curDay - 1,
      code: 'EYAK-EXPD-9999',
      on: curDay - 8,
      sig: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
    },
    owner: 0,
  };
  assert.equal(hasPremiumThemeAccess(expiredStudent, curDay), false);
  assert.equal(resolveEffectiveThemeId(expiredStudent, curDay), 'stage-1-adire');

  // Owner account also has full access
  const ownerStudent = {
    themeId: 'stage-10-chancellor' as const,
    pro: null,
    owner: 1,
  };
  assert.equal(hasPremiumThemeAccess(ownerStudent, curDay), true);
  assert.equal(resolveEffectiveThemeId(ownerStudent, curDay), 'stage-10-chancellor');
});
