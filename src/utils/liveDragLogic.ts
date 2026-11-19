export interface LivePoint {
  x: number;
  y: number;
}

export interface LiveRatio {
  rx: number;
  ry: number;
}

export interface PopoverRect {
  left: number;
  top: number;
  placement: 'above' | 'below';
}

export const LIVE_POS_STORAGE_KEY = 'rtc_live_fab_pos_v1';
export const DRAG_THRESHOLD_PX = 6;

export function getEdgeMargins(viewportW: number): {
  left: number;
  right: number;
  top: number;
  bottom: number;
} {
  const isMobile = viewportW < 980;
  return {
    left: isMobile ? 12 : 18,
    right: isMobile ? 12 : 22,
    top: isMobile ? 12 : 18,
    // Keep default bottom clearance above the mobile pill navigation bar when < 980px
    bottom: isMobile ? 14 : 22,
  };
}

export function clampLivePos(
  pos: LivePoint,
  viewportW: number,
  viewportH: number,
  pillW: number,
  pillH: number
): LivePoint {
  const m = getEdgeMargins(viewportW);
  const minX = m.left;
  const maxX = Math.max(minX, viewportW - pillW - m.right);
  const minY = m.top;
  const maxY = Math.max(minY, viewportH - pillH - m.bottom);

  return {
    x: Math.round(Math.min(maxX, Math.max(minX, pos.x))),
    y: Math.round(Math.min(maxY, Math.max(minY, pos.y))),
  };
}

export function computeDefaultLivePos(
  viewportW: number,
  viewportH: number,
  pillW = 152,
  pillH = 46
): LivePoint {
  const isMobile = viewportW < 980;
  const defaultRightOffset = isMobile ? 14 : 24;
  // Sit comfortably above mobile bottom nav (60px + 12px bottom + 14px gap = 86px) on mobile, or 24px from bottom on desktop
  const defaultBottomOffset = isMobile ? 86 : 24;
  return clampLivePos(
    {
      x: viewportW - pillW - defaultRightOffset,
      y: viewportH - pillH - defaultBottomOffset,
    },
    viewportW,
    viewportH,
    pillW,
    pillH
  );
}

export function livePosToRatio(
  pos: LivePoint,
  viewportW: number,
  viewportH: number,
  pillW: number,
  pillH: number
): LiveRatio {
  const m = getEdgeMargins(viewportW);
  const spanX = Math.max(1, viewportW - pillW - m.left - m.right);
  const spanY = Math.max(1, viewportH - pillH - m.top - m.bottom);
  const clamped = clampLivePos(pos, viewportW, viewportH, pillW, pillH);
  return {
    rx: Math.min(1, Math.max(0, (clamped.x - m.left) / spanX)),
    ry: Math.min(1, Math.max(0, (clamped.y - m.top) / spanY)),
  };
}

export function ratioToLivePos(
  ratio: LiveRatio,
  viewportW: number,
  viewportH: number,
  pillW: number,
  pillH: number
): LivePoint {
  const m = getEdgeMargins(viewportW);
  const spanX = Math.max(0, viewportW - pillW - m.left - m.right);
  const spanY = Math.max(0, viewportH - pillH - m.top - m.bottom);
  return clampLivePos(
    {
      x: m.left + ratio.rx * spanX,
      y: m.top + ratio.ry * spanY,
    },
    viewportW,
    viewportH,
    pillW,
    pillH
  );
}

export function hasExceededDragThreshold(
  startX: number,
  startY: number,
  curX: number,
  curY: number,
  threshold = DRAG_THRESHOLD_PX
): boolean {
  const dx = curX - startX;
  const dy = curY - startY;
  return dx * dx + dy * dy >= threshold * threshold;
}

export function nudgeLivePos(
  pos: LivePoint,
  key: string,
  viewportW: number,
  viewportH: number,
  pillW: number,
  pillH: number,
  step = 28
): LivePoint | null {
  let dx = 0;
  let dy = 0;
  if (key === 'ArrowLeft') dx = -step;
  else if (key === 'ArrowRight') dx = step;
  else if (key === 'ArrowUp') dy = -step;
  else if (key === 'ArrowDown') dy = step;
  else return null;

  return clampLivePos({ x: pos.x + dx, y: pos.y + dy }, viewportW, viewportH, pillW, pillH);
}

/**
 * Computes viewport-safe coordinates for the expanded Live Studio panel
 * relative to wherever the user has dragged the Go Live button.
 */
export function computePopoverPlacement(
  pillPos: LivePoint,
  viewportW: number,
  viewportH: number,
  pillW: number,
  pillH: number,
  panelW: number,
  panelH: number,
  gap = 10
): PopoverRect {
  const margin = viewportW < 640 ? 10 : 16;
  const effectivePanelW = Math.min(panelW, Math.max(260, viewportW - margin * 2));

  // Prefer opening ABOVE if the button is in the lower half or there is enough room above;
  // otherwise open BELOW so it never clips at the top edge.
  const spaceAbove = pillPos.y - margin;
  const spaceBelow = viewportH - (pillPos.y + pillH) - margin;

  const openAbove =
    spaceAbove >= panelH + gap || (spaceAbove > spaceBelow && pillPos.y > viewportH * 0.45);

  const rawTop = openAbove ? pillPos.y - panelH - gap : pillPos.y + pillH + gap;
  const maxTop = Math.max(margin, viewportH - panelH - margin);
  const top = Math.round(Math.min(maxTop, Math.max(margin, rawTop)));

  // Align right edge with pill when pill is on the right half of the screen; otherwise align left edge
  const pillCenterX = pillPos.x + pillW / 2;
  const rawLeft =
    pillCenterX >= viewportW / 2 ? pillPos.x + pillW - effectivePanelW : pillPos.x;
  const maxLeft = Math.max(margin, viewportW - effectivePanelW - margin);
  const left = Math.round(Math.min(maxLeft, Math.max(margin, rawLeft)));

  return {
    left,
    top,
    placement: openAbove ? 'above' : 'below',
  };
}
