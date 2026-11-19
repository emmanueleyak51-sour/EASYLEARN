import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  clampLivePos,
  computeDefaultLivePos,
  computePopoverPlacement,
  hasExceededDragThreshold,
  livePosToRatio,
  nudgeLivePos,
  ratioToLivePos,
} from './liveDragLogic';

describe('Floating Go Live draggable positioning & viewport math', () => {
  it('computes safe bottom-right default position on desktop and mobile (clearing mobile bottom nav)', () => {
    const desk = computeDefaultLivePos(1440, 900, 152, 46);
    assert.ok(desk.x > 1200 && desk.x + 152 <= 1440 - 22);
    assert.ok(desk.y > 800 && desk.y + 46 <= 900 - 22);

    const mob = computeDefaultLivePos(390, 844, 152, 46);
    assert.ok(mob.x >= 12 && mob.x + 152 <= 390 - 12);
    // Mobile bottom nav is 60px + 12px offset = 72px from bottom, so y + 46 should clear 844 - 72 = 772
    assert.ok(mob.y + 46 <= 765, `Expected mobile default y+h (${mob.y + 46}) to sit above bottom nav`);
  });

  it('clamps extreme negative and overflow coordinates strictly inside viewport bounds', () => {
    const topLeft = clampLivePos({ x: -500, y: -300 }, 1440, 900, 152, 46);
    assert.equal(topLeft.x, 18);
    assert.equal(topLeft.y, 18);

    const botRight = clampLivePos({ x: 9999, y: 9999 }, 1440, 900, 152, 46);
    assert.equal(botRight.x, 1440 - 152 - 22);
    assert.equal(botRight.y, 900 - 46 - 22);
  });

  it('round-trips normalized ratios cleanly across resizes', () => {
    const original = { x: 420, y: 260 };
    const ratio = livePosToRatio(original, 1440, 900, 152, 46);
    assert.ok(ratio.rx >= 0 && ratio.rx <= 1);
    assert.ok(ratio.ry >= 0 && ratio.ry <= 1);

    const restoredSame = ratioToLivePos(ratio, 1440, 900, 152, 46);
    assert.ok(Math.abs(restoredSame.x - original.x) <= 1);
    assert.ok(Math.abs(restoredSame.y - original.y) <= 1);

    const restoredSmaller = ratioToLivePos({ rx: 1, ry: 1 }, 390, 844, 152, 46);
    assert.ok(restoredSmaller.x + 152 <= 390 - 12);
    assert.ok(restoredSmaller.y + 46 <= 844 - 14);
  });

  it('distinguishes tap jitter (< 6px) from intentional pointer drag (>= 6px)', () => {
    assert.equal(hasExceededDragThreshold(100, 100, 103, 104), false); // 5px
    assert.equal(hasExceededDragThreshold(100, 100, 106, 100), true); // 6px
    assert.equal(hasExceededDragThreshold(100, 100, 60, 40), true);
  });

  it('nudges position with arrow keys and ignores unrelated keys', () => {
    const start = { x: 500, y: 500 };
    const up = nudgeLivePos(start, 'ArrowUp', 1440, 900, 152, 46, 28);
    assert.deepEqual(up, { x: 500, y: 472 });
    const left = nudgeLivePos(start, 'ArrowLeft', 1440, 900, 152, 46, 28);
    assert.deepEqual(left, { x: 472, y: 500 });
    assert.equal(nudgeLivePos(start, 'Enter', 1440, 900, 152, 46), null);
  });

  it('places the expanded Live Coach popover inside viewport bounds at all 4 corners', () => {
    const vw = 1440;
    const vh = 900;
    const panelW = 376;
    const panelH = 418;

    // Bottom-right corner -> opens ABOVE and right-aligned
    const br = computePopoverPlacement({ x: 1264, y: 830 }, vw, vh, 152, 46, panelW, panelH);
    assert.equal(br.placement, 'above');
    assert.ok(br.top >= 16 && br.top + panelH <= vh - 16);
    assert.ok(br.left >= 16 && br.left + panelW <= vw - 16);

    // Top-left corner -> opens BELOW and left-aligned
    const tl = computePopoverPlacement({ x: 18, y: 18 }, vw, vh, 152, 46, panelW, panelH);
    assert.equal(tl.placement, 'below');
    assert.equal(tl.left, 18);
    assert.ok(tl.top > 18 && tl.top + panelH <= vh - 16);

    // Top-right corner -> opens BELOW and stays inside right edge
    const tr = computePopoverPlacement({ x: 1264, y: 18 }, vw, vh, 152, 46, panelW, panelH);
    assert.equal(tr.placement, 'below');
    assert.ok(tr.left + panelW <= vw - 16);

    // Bottom-left corner -> opens ABOVE and stays inside left edge
    const bl = computePopoverPlacement({ x: 18, y: 830 }, vw, vh, 152, 46, panelW, panelH);
    assert.equal(bl.placement, 'above');
    assert.equal(bl.left, 18);
  });
});
