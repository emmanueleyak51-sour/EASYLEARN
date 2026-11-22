import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ELEMENTAL_RANKS,
  computeElementalRpBreakdown,
  evaluateElementalRank,
} from './elementalRankLogic';
import { computeLiquidScrollDrag, computeTargetScrollForBox } from './liquidScrollMath';

test('Elemental Ranks enforce strict smartness & accuracy gates so guessing cannot unlock badges', () => {
  assert.equal(ELEMENTAL_RANKS.length, 8);
  assert.deepEqual(
    ELEMENTAL_RANKS.map((r) => r.element),
    ['Terra', 'Frost', 'Ember', 'Tempest', 'Volt', 'Plasma', 'Aether', 'Solar']
  );

  // Starter student (13 Qs, 46% accuracy, 1 topic) -> Unranked, Heading to Terra I
  const starter = evaluateElementalRank({
    rp: 18,
    topicsPassed: 1,
    totalAnswered: 13,
    accuracyPct: 46,
    bestCbtScore: 40,
  });
  assert.equal(starter.currentRank, null);
  assert.equal(starter.currentLabel, 'Unranked');
  assert.equal(starter.nextLabel, 'Terra I');
  assert.equal(starter.unlockedIds.length, 0);

  // High-volume guesser (800 Qs at 42% accuracy, 25 topics) -> blocked from Terra because accuracy < 60%
  const guesserRp = computeElementalRpBreakdown({
    topicsPassed: 25,
    totalAnswered: 800,
    accuracyPct: 42,
    bestCbtScore: 180,
    streakCount: 10,
    duelsCompleted: 2,
  });
  const guesser = evaluateElementalRank({
    rp: guesserRp.total,
    topicsPassed: 25,
    totalAnswered: 800,
    accuracyPct: 42,
    bestCbtScore: 180,
  });
  assert.equal(guesser.currentRank, null, 'Low-accuracy guesser must remain Unranked');
  assert.equal(guesser.nextLabel, 'Terra I');
});

test('Elemental Ranks progress cleanly through I / II / III sub-divisions up to Solar apex', () => {
  // Ember scholar heading to Tempest I
  const emberMid = evaluateElementalRank({
    rp: 395,
    topicsPassed: 24,
    totalAnswered: 360,
    accuracyPct: 76,
    bestCbtScore: 240,
  });
  assert.equal(emberMid.currentRank?.id, 'ember');
  assert.equal(emberMid.subDivision, 'II');
  assert.equal(emberMid.currentLabel, 'Ember II');
  assert.equal(emberMid.nextRank?.id, 'tempest');
  assert.equal(emberMid.nextLabel, 'Tempest I');
  assert.ok(emberMid.progressToNextPct > 0 && emberMid.progressToNextPct < 100);

  // Solar apex scholar
  const solarApex = evaluateElementalRank({
    rp: 985,
    topicsPassed: 120,
    totalAnswered: 2000,
    accuracyPct: 97,
    bestCbtScore: 385,
  });
  assert.equal(solarApex.currentRank?.id, 'solar');
  assert.equal(solarApex.currentLabel, 'Solar');
  assert.equal(solarApex.nextRank, null);
  assert.equal(solarApex.nextLabel, null);
  assert.equal(solarApex.unlockedIds.length, 8);
});

test('computeLiquidScrollDrag slides horizontal scrollLeft smoothly with liquid capsule without jumps', () => {
  // 310px viewport, 480px total stage width (maxScroll = 170), pill width = 80px
  const atZero = computeLiquidScrollDrag({
    dx: 0,
    originX: 180,
    originW: 80,
    targetW: 80,
    minX: 0,
    maxX: 480,
    startScrollLeft: 20,
    scrollWidth: 480,
    clientWidth: 310,
  });
  assert.equal(atZero.clampedX, 180);
  assert.equal(atZero.nextScrollLeft, 20, 'Zero jump when drag begins');

  // Dragging all the way right from first tab reaches maxX - targetW (400) and maxScroll (170)
  const fullRight = computeLiquidScrollDrag({
    dx: 230,
    originX: 0,
    originW: 80,
    targetW: 80,
    minX: 0,
    maxX: 480,
    startScrollLeft: 0,
    scrollWidth: 480,
    clientWidth: 310,
  });
  assert.equal(fullRight.clampedX, 400);
  assert.equal(fullRight.nextScrollLeft, 170);

  // Dragging all the way left from rightmost tab returns to minX (0) and scrollLeft (0)
  const fullLeft = computeLiquidScrollDrag({
    dx: -230,
    originX: 400,
    originW: 80,
    targetW: 80,
    minX: 0,
    maxX: 480,
    startScrollLeft: 170,
    scrollWidth: 480,
    clientWidth: 310,
  });
  assert.equal(fullLeft.clampedX, 0);
  assert.equal(fullLeft.nextScrollLeft, 0);

  // Tapping an offscreen right tab scrolls it into view with peek margin
  const targetScroll = computeTargetScrollForBox({
    boxX: 390,
    boxW: 85,
    currentScrollLeft: 0,
    scrollWidth: 480,
    clientWidth: 310,
    peekPx: 24,
  });
  assert.equal(targetScroll, 170);
});
