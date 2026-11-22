export interface LiquidScrollDragInput {
  dx: number;
  originX: number;
  originW: number;
  targetW: number;
  minX: number;
  maxX: number;
  startScrollLeft: number;
  scrollWidth: number;
  clientWidth: number;
}

export interface LiquidScrollDragResult {
  rawX: number;
  clampedX: number;
  nextScrollLeft: number;
}

/**
 * Computes 1:1 finger-locked stage coordinates and container `scrollLeft` when dragging
 * a horizontal `LiquidCapsuleBar` whose items overflow its visible viewport.
 *
 * Guarantees:
 *  - Zero scroll jump at `dx = 0` from any starting tab or scroll offset.
 *  - Dragging to the right edge of the bar reaches the final offscreen item (`maxX - targetW`)
 *    while sliding `scrollLeft` all the way to `maxScroll`.
 *  - Dragging to the left edge reaches `minX` while sliding `scrollLeft` back to `0`.
 */
export function computeLiquidScrollDrag(input: LiquidScrollDragInput): LiquidScrollDragResult {
  const {
    dx,
    originX,
    originW,
    targetW,
    minX,
    maxX,
    startScrollLeft,
    scrollWidth,
    clientWidth,
  } = input;

  const maxScroll = Math.max(0, scrollWidth - clientWidth);
  const maxStageOrigin = Math.max(minX, maxX - originW);
  const maxStageTarget = Math.max(minX, maxX - targetW);

  if (maxScroll <= 0.5) {
    const rawX = originX + dx;
    const clampedX = Math.max(minX, Math.min(maxStageTarget, rawX));
    return { rawX, clampedX, nextScrollLeft: 0 };
  }

  const clampedStartScroll = Math.max(0, Math.min(maxScroll, startScrollLeft));

  if (dx >= 0) {
    const remStage = Math.max(0, maxStageOrigin - originX);
    const remScroll = Math.max(0, maxScroll - clampedStartScroll);
    const remScreen = Math.max(28, remStage - remScroll);
    const scale = remStage > 0 ? Math.min(4, Math.max(1, remStage / remScreen)) : 1;
    const rawX = originX + dx * scale;
    const clampedX = Math.max(minX, Math.min(maxStageTarget, rawX));
    const denom = Math.max(1, maxStageTarget - originX);
    const progress =
      maxStageTarget > originX ? Math.min(1, Math.max(0, (clampedX - originX) / denom)) : 1;
    const nextScrollLeft = clampedStartScroll + progress * remScroll;
    return {
      rawX,
      clampedX,
      nextScrollLeft: Math.max(0, Math.min(maxScroll, nextScrollLeft)),
    };
  }

  const remStageL = Math.max(0, originX - minX);
  const remScrollL = Math.max(0, clampedStartScroll);
  const remScreenL = Math.max(28, remStageL - remScrollL);
  const scaleL = remStageL > 0 ? Math.min(4, Math.max(1, remStageL / remScreenL)) : 1;
  const rawX = originX + dx * scaleL;
  const clampedX = Math.max(minX, Math.min(maxStageTarget, rawX));
  const denomL = Math.max(1, originX - minX);
  const progressL =
    originX > minX ? Math.min(1, Math.max(0, (originX - clampedX) / denomL)) : 1;
  const nextScrollLeft = clampedStartScroll - progressL * remScrollL;
  return {
    rawX,
    clampedX,
    nextScrollLeft: Math.max(0, Math.min(maxScroll, nextScrollLeft)),
  };
}

/**
 * Computes a comfortable target `scrollLeft` so a selected item (plus neighbour peek margin)
 * is cleanly visible inside a horizontally scrollable `LiquidCapsuleBar`.
 */
export function computeTargetScrollForBox(opts: {
  boxX: number;
  boxW: number;
  currentScrollLeft: number;
  scrollWidth: number;
  clientWidth: number;
  peekPx?: number;
}): number {
  const { boxX, boxW, currentScrollLeft, scrollWidth, clientWidth, peekPx = 32 } = opts;
  const maxScroll = Math.max(0, scrollWidth - clientWidth);
  if (maxScroll <= 0) return 0;

  const desiredLeft = boxX - peekPx;
  const desiredRight = boxX + boxW + peekPx;

  let next = currentScrollLeft;
  if (desiredLeft < currentScrollLeft) {
    next = desiredLeft;
  } else if (desiredRight > currentScrollLeft + clientWidth) {
    next = desiredRight - clientWidth;
  }
  return Math.max(0, Math.min(maxScroll, Math.round(next)));
}
