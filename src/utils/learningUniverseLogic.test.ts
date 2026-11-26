import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_UNIVERSE_PROFILE,
  calculateMissionMasteryReward,
  canUnlockSkillNode,
  computeUniverseLevelSummary,
  evaluateDailyUniverseQuests,
  parseUniverseProfile,
} from './learningUniverseLogic';
import { makeBlankProgress } from './engine';

test('clicking through without solving awards zero XP (anti-click-farming rule)', () => {
  const res = calculateMissionMasteryReward({
    baseXpReward: 250,
    explorationCompleted: true,
    decisionSolved: false,
    decisionWrongAttempts: 2,
    applicationSolved: false,
    applicationWrongAttempts: 1,
    teachBackSolved: false,
    teachBackWrongAttempts: 1,
  });

  assert.equal(res.passedMastery, false);
  assert.equal(res.rawEarnedXp, 0);
  assert.equal(res.netNewXpAwarded, 0);
});

test('first-try mastery awards full +250 XP and passes mastery check', () => {
  const res = calculateMissionMasteryReward({
    baseXpReward: 250,
    explorationCompleted: true,
    decisionSolved: true,
    decisionWrongAttempts: 0,
    applicationSolved: true,
    applicationWrongAttempts: 0,
    teachBackSolved: true,
    teachBackWrongAttempts: 0,
  });

  assert.equal(res.passedMastery, true);
  assert.equal(res.accuracyPct, 100);
  assert.equal(res.rawEarnedXp, 250);
  assert.equal(res.netNewXpAwarded, 250);
});

test('replaying with genuine improvement awards delta XP + improvement bonus, while repeat without improvement awards 0', () => {
  const firstRun = calculateMissionMasteryReward({
    baseXpReward: 250,
    explorationCompleted: true,
    decisionSolved: true,
    decisionWrongAttempts: 2,
    applicationSolved: true,
    applicationWrongAttempts: 1,
    teachBackSolved: true,
    teachBackWrongAttempts: 1,
  });

  assert.equal(firstRun.passedMastery, true);
  assert.ok(firstRun.rawEarnedXp < 250);

  // Replaying with exact same mistakes should award 0 new XP (prevents XP farming)
  const stagnantReplay = calculateMissionMasteryReward({
    baseXpReward: 250,
    explorationCompleted: true,
    decisionSolved: true,
    decisionWrongAttempts: 2,
    applicationSolved: true,
    applicationWrongAttempts: 1,
    teachBackSolved: true,
    teachBackWrongAttempts: 1,
    previousBestAccuracyPct: firstRun.accuracyPct,
    previousXpEarned: firstRun.rawEarnedXp,
  });
  assert.equal(stagnantReplay.netNewXpAwarded, 0);

  // Replaying cleanly with 0 mistakes rewards the XP delta + genuine improvement bonus
  const improvedReplay = calculateMissionMasteryReward({
    baseXpReward: 250,
    explorationCompleted: true,
    decisionSolved: true,
    decisionWrongAttempts: 0,
    applicationSolved: true,
    applicationWrongAttempts: 0,
    teachBackSolved: true,
    teachBackWrongAttempts: 0,
    previousBestAccuracyPct: firstRun.accuracyPct,
    previousXpEarned: firstRun.rawEarnedXp,
  });
  assert.ok(improvedReplay.improvementBonusXp >= 15);
  assert.equal(
    improvedReplay.netNewXpAwarded,
    250 - firstRun.rawEarnedXp + improvedReplay.improvementBonusXp
  );
});

test('skill tree enforces prerequisites and token costs accurately', () => {
  const profile = parseUniverseProfile(null);
  assert.equal(profile.avatar.role, DEFAULT_UNIVERSE_PROFILE.avatar.role);

  // Cannot unlock tier-2 skill before prerequisite
  const lockedCheck = canUnlockSkillNode('first_principles', profile, 3);
  assert.equal(lockedCheck.ok, false);

  // Can unlock root skill when tokens >= 1
  const rootCheck = canUnlockSkillNode('diagnostic_pulse', profile, 1);
  assert.equal(rootCheck.ok, true);

  const updatedProfile = {
    ...profile,
    unlockedSkills: ['diagnostic_pulse' as const],
  };
  const tier2Check = canUnlockSkillNode('first_principles', updatedProfile, 1);
  assert.equal(tier2Check.ok, true);
});

test('universe level summary and daily quests reflect genuine mission mastery', () => {
  const baseProgress = makeBlankProgress();
  const profile = {
    ...parseUniverseProfile(null),
    completedMissions: {
      'bio-heart-failing': {
        bestAccuracyPct: 100,
        xpEarned: 250,
        attempts: 1,
        firstTryDecision: true,
        unlockedTitle: 'Heart Explorer',
        completedDay: 20000,
      },
    },
  };

  const summary = computeUniverseLevelSummary(300, profile);
  assert.equal(summary.level, 2);
  assert.equal(summary.completedMissionCount, 1);
  assert.ok(summary.availableSkillTokens >= 1);

  const quests = evaluateDailyUniverseQuests(profile, baseProgress, 20000);
  assert.equal(quests.length, 3);
  assert.equal(quests[0].completed, true);
  assert.equal(quests[1].completed, true);
});

test('youth safety defaults to private guild alias and supports muting/reporting peers', async () => {
  const { formatSafeGuildDisplayName, muteOrReportGuildPeer } = await import(
    './learningUniverseLogic'
  );
  const fresh = parseUniverseProfile(null);
  assert.equal(fresh.privacySettings.hideRealNameInGuild, true);
  assert.match(formatSafeGuildDisplayName('Adaeze Okafor', true), /^Scholar #\d{3}$/);
  assert.equal(formatSafeGuildDisplayName('Adaeze Okafor', false), 'Adaeze');

  const moderated = muteOrReportGuildPeer(fresh, 'peer-ln-2', 'report');
  assert.ok(moderated.mutedPeerIds.includes('peer-ln-2'));
  assert.ok(moderated.reportedPeerIds.includes('peer-ln-2'));
});

