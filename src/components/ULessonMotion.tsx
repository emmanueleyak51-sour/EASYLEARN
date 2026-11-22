import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { SubjectId } from '../types';
import { getRankProgress } from '../utils/engine';
import { computeLiquidScrollDrag, computeTargetScrollForBox } from '../utils/liquidScrollMath';
import { AnimatedNumber } from './AnimatedNumber';
import { Icon } from './Icons';

export interface SlidingTabItem<T extends string> {
  id: T;
  label: string;
  icon?: string;
}

export interface LiquidBarItem<T extends string> {
  id: T;
  label: string;
  icon?: string;
  badge?: number | string;
  sublabel?: string;
}

export const LIQUID_CAPSULE_SPRING = {
  duration: 0.2,
  ease: [0.22, 1, 0.36, 1] as const,
};

export const FLUID_SCREEN_SPRING = {
  duration: 0.28,
  ease: [0.22, 1, 0.36, 1] as const,
};

export const FLUID_SCREEN_EXIT = {
  duration: 0.14,
  ease: [0.22, 1, 0.36, 1] as const,
};

export function usePostMountLayoutGate(delayMs = 280): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), delayMs);
    return () => window.clearTimeout(id);
  }, [delayMs]);
  return ready;
}

interface ItemBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Liquid frosted capsule navigation bar with dual-layer `clip-path` active-color split,
 * critically-damped velocity droplet stretch, and 1:1 pointer drag-and-snap.
 * Animates via direct DOM `transform` + `clipPath` in a bounded `requestAnimationFrame`
 * loop (0% idle CPU, zero React re-renders at 60fps).
 */
export function LiquidCapsuleBar<T extends string>({
  items,
  value,
  onChange,
  ariaLabel,
  roleType = 'tablist',
  orientation = 'horizontal',
  layoutMode = 'flex',
  wrap = false,
  gridClassName = 'grid-cols-2 gap-1.5',
  pillRadiusPx,
  size = 'md',
  className = '',
  trailingSlot,
}: {
  items: readonly LiquidBarItem<T>[];
  value: T | null;
  onChange: (id: T) => void;
  ariaLabel: string;
  roleType?: 'tablist' | 'group' | 'nav';
  orientation?: 'horizontal' | 'vertical';
  layoutMode?: 'flex' | 'grid';
  wrap?: boolean;
  gridClassName?: string;
  pillRadiusPx?: number;
  size?: 'sm' | 'md' | 'lg' | 'nav-mobile' | 'nav-desktop';
  className?: string;
  trailingSlot?: React.ReactNode;
}) {
  const prefersReduced = Boolean(useReducedMotion());
  const scrollerRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const lensRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const itemElsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const boxesRef = useRef<ItemBox[]>([]);
  const stageSizeRef = useRef<{ cw: number; ch: number }>({ cw: 0, ch: 0 });
  const suppressClickRef = useRef(false);

  const itemsRef = useRef(items);
  itemsRef.current = items;
  const valueRef = useRef(value);
  valueRef.current = value;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const resolvedRadius =
    pillRadiusPx ??
    (size === 'nav-mobile' || size === 'nav-desktop'
      ? 999
      : size === 'lg'
        ? 14
        : size === 'sm'
          ? 10
          : 12);

  const radiusRef = useRef(resolvedRadius);
  radiusRef.current = resolvedRadius;

  const animRef = useRef({
    initialized: false,
    visible: false,
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    vx: 0,
    vy: 0,
    vw: 0,
    vh: 0,
    tx: 0,
    ty: 0,
    tw: 0,
    th: 0,
    rafId: 0,
    lastTs: 0,
    dragging: false,
  });

  const dragRef = useRef<{
    active: boolean;
    moved: boolean;
    pointerId: number;
    startClientX: number;
    startClientY: number;
    startScrollLeft: number;
    originX: number;
    originY: number;
    originW: number;
    originH: number;
    hoveredIdx: number;
  }>({
    active: false,
    moved: false,
    pointerId: -1,
    startClientX: 0,
    startClientY: 0,
    startScrollLeft: 0,
    originX: 0,
    originY: 0,
    originW: 0,
    originH: 0,
    hoveredIdx: -1,
  });

  const writeDomFrame = useCallback((sx = 1, sy = 1) => {
    const lens = lensRef.current;
    const overlay = overlayRef.current;
    if (!lens || !overlay) return;
    const st = animRef.current;
    const { cw, ch } = stageSizeRef.current;
    if (!st.visible || st.w <= 0 || st.h <= 0 || cw <= 0 || ch <= 0) {
      lens.style.opacity = '0';
      overlay.style.clipPath = 'inset(0px 100% 100% 0px)';
      return;
    }
    const rad = radiusRef.current;
    lens.style.opacity = '1';
    lens.style.width = `${st.w.toFixed(2)}px`;
    lens.style.height = `${st.h.toFixed(2)}px`;
    lens.style.borderRadius = `${rad}px`;
    lens.style.transform = `translate3d(${st.x.toFixed(2)}px, ${st.y.toFixed(2)}px, 0) scale(${sx.toFixed(3)}, ${sy.toFixed(3)})`;

    const cx = st.x + st.w * 0.5;
    const cy = st.y + st.h * 0.5;
    const ew = st.w * sx;
    const eh = st.h * sy;
    const left = cx - ew * 0.5;
    const top = cy - eh * 0.5;
    const right = cw - (left + ew);
    const bottom = ch - (top + eh);
    overlay.style.clipPath = `inset(${top.toFixed(1)}px ${right.toFixed(1)}px ${bottom.toFixed(1)}px ${left.toFixed(1)}px round ${rad}px)`;
  }, []);

  const stepSpring = useCallback(
    (ts: number) => {
      const st = animRef.current;
      const dt = st.lastTs ? Math.min(0.032, Math.max(0.004, (ts - st.lastTs) / 1000)) : 0.016;
      st.lastTs = ts;

      const stiffness = st.dragging ? 680 : 430;
      const damping = st.dragging ? 42 : 34;

      const ax = (st.tx - st.x) * stiffness - st.vx * damping;
      const ay = (st.ty - st.y) * stiffness - st.vy * damping;
      const aw = (st.tw - st.w) * stiffness - st.vw * damping;
      const ah = (st.th - st.h) * stiffness - st.vh * damping;

      st.vx += ax * dt;
      st.vy += ay * dt;
      st.vw += aw * dt;
      st.vh += ah * dt;

      st.x += st.vx * dt;
      st.y += st.vy * dt;
      st.w = Math.max(8, st.w + st.vw * dt);
      st.h = Math.max(8, st.h + st.vh * dt);

      const speedX = Math.abs(st.vx);
      const speedY = Math.abs(st.vy);
      let sx = 1;
      let sy = 1;
      if (!prefersReduced) {
        if (orientation === 'vertical' && speedY > speedX) {
          sy = 1 + Math.min(0.075, speedY / 2600);
          sx = 1 - Math.min(0.035, speedY / 5200);
        } else {
          sx = 1 + Math.min(0.085, speedX / 2500);
          sy = 1 - Math.min(0.042, speedX / 5000);
        }
        if (st.dragging) {
          sx *= 1.022;
          sy *= 1.022;
        }
      }

      const settled =
        !st.dragging &&
        Math.abs(st.tx - st.x) < 0.2 &&
        Math.abs(st.ty - st.y) < 0.2 &&
        Math.abs(st.tw - st.w) < 0.2 &&
        Math.abs(st.th - st.h) < 0.2 &&
        speedX < 1.5 &&
        speedY < 1.5 &&
        Math.abs(st.vw) < 1.5 &&
        Math.abs(st.vh) < 1.5;

      if (settled) {
        st.x = st.tx;
        st.y = st.ty;
        st.w = st.tw;
        st.h = st.th;
        st.vx = 0;
        st.vy = 0;
        st.vw = 0;
        st.vh = 0;
        st.rafId = 0;
        st.lastTs = 0;
        writeDomFrame(1, 1);
        return;
      }

      writeDomFrame(sx, sy);
      st.rafId = window.requestAnimationFrame(stepSpring);
    },
    [orientation, prefersReduced, writeDomFrame]
  );

  const ensureSpringRunning = useCallback(() => {
    const st = animRef.current;
    if (prefersReduced) {
      st.x = st.tx;
      st.y = st.ty;
      st.w = st.tw;
      st.h = st.th;
      st.vx = 0;
      st.vy = 0;
      st.vw = 0;
      st.vh = 0;
      if (st.rafId) {
        window.cancelAnimationFrame(st.rafId);
        st.rafId = 0;
      }
      writeDomFrame(1, 1);
      return;
    }
    if (!st.rafId) {
      st.lastTs = 0;
      st.rafId = window.requestAnimationFrame(stepSpring);
    }
  }, [prefersReduced, stepSpring, writeDomFrame]);

  const measureAndSync = useCallback(
    (snapImmediate = false) => {
      const stage = stageRef.current;
      if (!stage) return;
      stageSizeRef.current = {
        cw: Math.max(stage.clientWidth, stage.scrollWidth),
        ch: Math.max(stage.clientHeight, stage.scrollHeight),
      };
      const curItems = itemsRef.current;
      const measured: ItemBox[] = [];
      for (let i = 0; i < curItems.length; i++) {
        const el = itemElsRef.current[i];
        if (el) {
          measured.push({
            x: el.offsetLeft,
            y: el.offsetTop,
            w: el.offsetWidth,
            h: el.offsetHeight,
          });
        } else {
          measured.push({ x: 0, y: 0, w: 0, h: 0 });
        }
      }
      boxesRef.current = measured;

      if (dragRef.current.moved) return;

      const curVal = valueRef.current;
      const activeIdx = curVal === null ? -1 : curItems.findIndex((it) => it.id === curVal);
      const st = animRef.current;

      if (activeIdx < 0 || !measured[activeIdx] || measured[activeIdx].w === 0) {
        st.visible = false;
        if (st.rafId) {
          window.cancelAnimationFrame(st.rafId);
          st.rafId = 0;
        }
        writeDomFrame(1, 1);
        return;
      }

      const targetBox = measured[activeIdx];
      st.tx = targetBox.x;
      st.ty = targetBox.y;
      st.tw = targetBox.w;
      st.th = targetBox.h;
      const shouldSnap = snapImmediate || !st.initialized || !st.visible;
      st.visible = true;
      st.initialized = true;

      if (shouldSnap) {
        st.x = targetBox.x;
        st.y = targetBox.y;
        st.w = targetBox.w;
        st.h = targetBox.h;
        st.vx = 0;
        st.vy = 0;
        st.vw = 0;
        st.vh = 0;
        writeDomFrame(1, 1);
      } else {
        ensureSpringRunning();
      }
    },
    [ensureSpringRunning, writeDomFrame]
  );

  useLayoutEffect(() => {
    measureAndSync(false);
    const scroller = scrollerRef.current;
    if (
      scroller &&
      !dragRef.current.active &&
      orientation === 'horizontal' &&
      layoutMode === 'flex' &&
      !wrap &&
      scroller.scrollWidth > scroller.clientWidth + 1
    ) {
      const activeIdx = value === null ? -1 : items.findIndex((it) => it.id === value);
      const box = activeIdx >= 0 ? boxesRef.current[activeIdx] : undefined;
      if (box && box.w > 0) {
        const nextScroll = computeTargetScrollForBox({
          boxX: box.x,
          boxW: box.w,
          currentScrollLeft: scroller.scrollLeft,
          scrollWidth: scroller.scrollWidth,
          clientWidth: scroller.clientWidth,
        });
        if (Math.abs(nextScroll - scroller.scrollLeft) > 1) {
          scroller.scrollTo({
            left: nextScroll,
            behavior: prefersReduced ? 'auto' : 'smooth',
          });
        }
      }
    }
  }, [value, items, size, layoutMode, orientation, wrap, prefersReduced, measureAndSync]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => {
        measureAndSync(true);
      });
      ro.observe(stage);
    }
    const onWinResize = () => measureAndSync(true);
    window.addEventListener('resize', onWinResize);
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', onWinResize);
      if (animRef.current.rafId) {
        window.cancelAnimationFrame(animRef.current.rafId);
        animRef.current.rafId = 0;
      }
    };
  }, [measureAndSync]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    const targetEl = e.target as HTMLElement | null;
    if (targetEl?.closest('[data-liquid-ignore="true"]')) return;

    measureAndSync(true);
    const boxes = boxesRef.current;
    if (!boxes.length) return;

    const st = animRef.current;
    let originBox: ItemBox = { x: st.x, y: st.y, w: st.w, h: st.h };
    if (!st.visible || st.w <= 0) {
      const stageRect = stageRef.current?.getBoundingClientRect();
      const relX = stageRect ? e.clientX - stageRect.left : 0;
      const relY = stageRect ? e.clientY - stageRect.top : 0;
      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i < boxes.length; i++) {
        const b = boxes[i];
        const d = Math.hypot(b.x + b.w * 0.5 - relX, b.y + b.h * 0.5 - relY);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      }
      originBox = boxes[best];
    }

    dragRef.current = {
      active: true,
      moved: false,
      pointerId: e.pointerId,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startScrollLeft: scrollerRef.current?.scrollLeft ?? 0,
      originX: originBox.x,
      originY: originBox.y,
      originW: originBox.w,
      originH: originBox.h,
      hoveredIdx: -1,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const dr = dragRef.current;
    if (!dr.active || e.pointerId !== dr.pointerId) return;

    const dx = e.clientX - dr.startClientX;
    const dy = e.clientY - dr.startClientY;

    if (!dr.moved) {
      const primaryMove =
        orientation === 'vertical'
          ? Math.abs(dy)
          : layoutMode === 'grid' || wrap
            ? Math.hypot(dx, dy)
            : Math.abs(dx);
      if (primaryMove < 6) return;
      dr.moved = true;
      animRef.current.dragging = true;
      animRef.current.visible = true;
      if (lensRef.current) lensRef.current.dataset.dragging = 'true';
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        /* ignore capture errors */
      }
    }

    const boxes = boxesRef.current;
    if (!boxes.length) return;

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const b of boxes) {
      if (b.w <= 0) continue;
      if (b.x < minX) minX = b.x;
      if (b.x + b.w > maxX) maxX = b.x + b.w;
      if (b.y < minY) minY = b.y;
      if (b.y + b.h > maxY) maxY = b.y + b.h;
    }

    const st = animRef.current;
    const scroller = scrollerRef.current;
    const isHorizontalFlex =
      orientation === 'horizontal' && layoutMode === 'flex' && !wrap;

    let rawX = orientation === 'vertical' ? dr.originX : dr.originX + dx;
    let clampedX = Math.max(minX, Math.min(Math.max(minX, maxX - st.tw), rawX));

    if (isHorizontalFlex && scroller && scroller.scrollWidth > scroller.clientWidth + 1) {
      const sync = computeLiquidScrollDrag({
        dx,
        originX: dr.originX,
        originW: dr.originW,
        targetW: st.tw || dr.originW,
        minX,
        maxX,
        startScrollLeft: dr.startScrollLeft,
        scrollWidth: scroller.scrollWidth,
        clientWidth: scroller.clientWidth,
      });
      rawX = sync.rawX;
      clampedX = sync.clampedX;
      scroller.scrollLeft = sync.nextScrollLeft;
    }

    const rawY =
      orientation === 'vertical' || layoutMode === 'grid' || wrap ? dr.originY + dy : dr.originY;
    const clampedY = Math.max(minY, Math.min(Math.max(minY, maxY - st.th), rawY));

    const cx = clampedX + st.tw * 0.5;
    const cy = clampedY + st.th * 0.5;

    let closestIdx = 0;
    let closestDist = Infinity;
    for (let i = 0; i < boxes.length; i++) {
      const b = boxes[i];
      if (b.w <= 0) continue;
      const dist = Math.hypot(b.x + b.w * 0.5 - cx, b.y + b.h * 0.5 - cy);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = i;
      }
    }
    dr.hoveredIdx = closestIdx;
    const hoveredBox = boxes[closestIdx];

    st.tx = Math.max(minX, Math.min(Math.max(minX, maxX - hoveredBox.w), rawX));
    st.ty =
      orientation === 'vertical' || layoutMode === 'grid' || wrap
        ? Math.max(minY, Math.min(Math.max(minY, maxY - hoveredBox.h), rawY))
        : hoveredBox.y;
    st.tw = hoveredBox.w;
    st.th = hoveredBox.h;

    ensureSpringRunning();
  };

  const finishPointer = (e: React.PointerEvent<HTMLDivElement>, cancelled: boolean) => {
    const dr = dragRef.current;
    if (!dr.active || e.pointerId !== dr.pointerId) return;
    const wasMoved = dr.moved;
    const commitIdx = dr.hoveredIdx;
    dr.active = false;
    dr.moved = false;
    animRef.current.dragging = false;
    if (lensRef.current) delete lensRef.current.dataset.dragging;

    if (wasMoved) {
      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch {
        /* ignore */
      }
      suppressClickRef.current = true;
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 60);

      const curItems = itemsRef.current;
      const boxes = boxesRef.current;
      if (!cancelled && commitIdx >= 0 && curItems[commitIdx] && boxes[commitIdx]) {
        const chosen = curItems[commitIdx];
        const b = boxes[commitIdx];
        animRef.current.tx = b.x;
        animRef.current.ty = b.y;
        animRef.current.tw = b.w;
        animRef.current.th = b.h;
        ensureSpringRunning();
        if (chosen.id !== valueRef.current) {
          onChangeRef.current(chosen.id);
        }
      } else {
        measureAndSync(false);
      }
    }
  };

  const count = Math.max(1, items.length);

  const trackLayoutCls =
    layoutMode === 'grid'
      ? `grid ${gridClassName}`
      : orientation === 'vertical'
        ? 'flex flex-col gap-1.5'
        : wrap
          ? 'flex flex-wrap items-center gap-1'
          : `flex items-center ${count >= 5 ? 'gap-0.5' : 'gap-1'}`;

  const outerShapeCls =
    size === 'nav-mobile'
      ? 'p-1.5 rounded-full ul-liquid-bar border-2 border-[var(--line)]'
      : size === 'nav-desktop'
        ? 'p-1.5 rounded-[24px] ul-liquid-bar border border-[var(--line)]'
        : size === 'lg'
          ? 'p-1.5 rounded-[18px] ul-liquid-bar border border-[var(--line)]'
          : 'p-1 rounded-[16px] ul-liquid-bar border border-[var(--line)]';

  const getItemBtnCls = () => {
    if (size === 'nav-mobile') {
      return 'relative h-[46px] rounded-full flex flex-col items-center justify-center gap-0.5 text-[10.5px] font-[var(--display)] whitespace-nowrap';
    }
    if (size === 'nav-desktop') {
      return 'relative min-h-[44px] px-4 rounded-full font-[var(--display)] text-[14.5px] flex items-center justify-between gap-2 whitespace-nowrap text-left';
    }
    const hCls =
      size === 'sm'
        ? 'min-h-[34px] text-[12px]'
        : size === 'lg'
          ? 'min-h-[42px] text-[13.5px]'
          : 'min-h-[38px] text-[13px]';
    const padCls =
      layoutMode === 'grid'
        ? 'px-3 gap-1.5'
        : count >= 6
          ? 'px-2 gap-1 text-[11.5px]'
          : count >= 5
            ? 'px-2.5 gap-1 text-[12px]'
            : 'px-3.5 gap-1.5';
    const flexGrowCls = layoutMode === 'grid' ? '' : wrap ? 'shrink-0' : 'flex-auto shrink-0';
    return `relative ${flexGrowCls} ${hCls} ${padCls} rounded-[12px] flex items-center justify-center whitespace-nowrap`;
  };

  const btnBaseCls = getItemBtnCls();

  const renderItemInner = (item: LiquidBarItem<T>, isOverlay: boolean) => {
    if (size === 'nav-mobile') {
      return (
        <>
          <span className="inline-flex flex-col items-center justify-center gap-0.5">
            {item.icon && <Icon name={item.icon} size={18} />}
            <span>{item.label}</span>
          </span>
          {item.badge !== undefined && (
            <span
              className={`absolute top-0.5 right-1.5 min-w-[17px] h-[17px] px-1 rounded-full text-[9.5px] font-bold flex items-center justify-center tabular-nums ${
                isOverlay
                  ? 'bg-[var(--gold)] text-[var(--on-acc)]'
                  : 'bg-[var(--peach-bg)] text-[var(--peach-ink)] border border-[var(--card)]'
              }`}
            >
              {typeof item.badge === 'number' && item.badge > 9 ? '9+' : item.badge}
            </span>
          )}
        </>
      );
    }

    if (size === 'nav-desktop') {
      return (
        <>
          <span className="inline-flex items-center gap-2.5 min-w-0">
            {item.icon && <Icon name={item.icon} size={18} className="shrink-0" />}
            <span className="truncate">{item.label}</span>
          </span>
          {item.badge !== undefined && (
            <span
              className={`min-w-[22px] h-[22px] px-1.5 rounded-full text-[11px] font-bold flex items-center justify-center tabular-nums shrink-0 ${
                isOverlay
                  ? 'bg-[var(--gold)] text-[var(--on-acc)]'
                  : 'bg-[var(--peach-bg)] text-[var(--peach-ink)]'
              }`}
            >
              {item.badge}
            </span>
          )}
        </>
      );
    }

    return (
      <span className="inline-flex items-center justify-center gap-1.5 min-w-0 w-full">
        {item.icon && (
          <Icon name={item.icon} size={size === 'sm' ? 13.5 : 14.5} className="shrink-0" />
        )}
        <span className="truncate">{item.label}</span>
        {item.sublabel && (
          <span
            className={`text-[11px] font-bold tabular-nums shrink-0 ${
              isOverlay ? 'text-[var(--gold)]' : 'text-[var(--dim)]'
            }`}
          >
            {item.sublabel}
          </span>
        )}
        {item.badge !== undefined && (
          <span
            className={`min-w-[19px] h-[19px] px-1 rounded-full text-[10.5px] font-bold inline-flex items-center justify-center tabular-nums shrink-0 ${
              isOverlay
                ? 'bg-[var(--gold)] text-[var(--on-acc)]'
                : 'bg-[var(--acc-soft)] text-[var(--gold)]'
            }`}
          >
            {item.badge}
          </span>
        )}
      </span>
    );
  };

  const isPrimaryNav = size === 'nav-mobile' || size === 'nav-desktop';
  const isScrollableHorizontal =
    orientation === 'horizontal' && layoutMode === 'flex' && !wrap && !isPrimaryNav;
  const WrapperTag = roleType === 'nav' ? 'nav' : 'div';

  return (
    <WrapperTag
      ref={(el: HTMLElement | null) => {
        scrollerRef.current = el;
      }}
      role={roleType === 'nav' ? undefined : roleType}
      aria-label={ariaLabel}
      className={`select-none ${
        isScrollableHorizontal ? 'overflow-x-auto max-w-full ul-liquid-scroll' : ''
      } ${outerShapeCls} ${className}`}
    >
      <div
        ref={stageRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={(e) => finishPointer(e, false)}
        onPointerCancel={(e) => finishPointer(e, true)}
        className={`relative ${
          isScrollableHorizontal ? 'min-w-full w-max' : 'w-full'
        } ${orientation === 'vertical' ? 'touch-none' : 'touch-pan-y'}`}
      >
        {/* 1. Base Interactive Layer (Neutral muted tone across nav & tabs) */}
        <div className={`relative z-[1] ${trackLayoutCls}`}>
          {items.map((item, idx) => {
            const active = item.id === value;
            return (
              <button
                key={item.id}
                ref={(el) => {
                  itemElsRef.current[idx] = el;
                }}
                type="button"
                role={roleType === 'tablist' ? 'tab' : undefined}
                aria-selected={roleType === 'tablist' ? active : undefined}
                aria-pressed={roleType === 'group' ? active : undefined}
                aria-current={roleType === 'nav' && active ? 'page' : undefined}
                onClick={(e) => {
                  if (suppressClickRef.current) {
                    e.preventDefault();
                    return;
                  }
                  onChange(item.id);
                }}
                className={`${btnBaseCls} m-0 border-0 bg-transparent font-bold text-[var(--dim)] hover:text-[var(--ink)] transition-colors duration-150 cursor-pointer`}
              >
                {renderItemInner(item, false)}
              </button>
            );
          })}
          {trailingSlot && <div data-liquid-ignore="true">{trailingSlot}</div>}
        </div>

        {/* 2. Translucent Frosted Liquid Glass Lens */}
        <div
          ref={lensRef}
          aria-hidden="true"
          className="ul-liquid-lens pointer-events-none absolute top-0 left-0 z-[2] opacity-0"
        />

        {/* 3. Clipped Active Accent Layer (Sweeps Smoothly Across Icons & Labels) */}
        <div
          ref={overlayRef}
          aria-hidden="true"
          className={`pointer-events-none select-none absolute inset-0 z-[3] ${trackLayoutCls}`}
          style={{ clipPath: 'inset(0px 100% 100% 0px)' }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className={`${btnBaseCls} m-0 border-0 bg-transparent font-bold text-[var(--gold)]`}
            >
              {renderItemInner(item, true)}
            </div>
          ))}
          {trailingSlot && (
            <div className="invisible pointer-events-none">{trailingSlot}</div>
          )}
        </div>
      </div>
    </WrapperTag>
  );
}

/**
 * Stadium-rounded segmented control delegating to `LiquidCapsuleBar` so every
 * segmented switcher across the app shares the frosted liquid lens + `clip-path` color split.
 */
export function SlidingTabs<T extends string>({
  items,
  value,
  onChange,
  ariaLabel,
  size = 'md',
  roleType = 'tablist',
  className = '',
}: {
  items: readonly SlidingTabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  ariaLabel: string;
  variant?: 'indigo' | 'paper';
  size?: 'sm' | 'md';
  roleType?: 'tablist' | 'group';
  layoutId?: string;
  className?: string;
}) {
  return (
    <LiquidCapsuleBar
      items={items}
      value={value}
      onChange={onChange}
      ariaLabel={ariaLabel}
      size={size}
      roleType={roleType}
      pillRadiusPx={size === 'sm' ? 10 : 12}
      className={className}
    />
  );
}

/**
 * Smooth accordion / disclosure collapse wrapper for category drawers, topic sections,
 * and progressive worked-example reveals across the app.
 */
export function SmoothCollapse({
  open,
  children,
  className = '',
}: {
  open: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const prefersReduced = Boolean(useReducedMotion());
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={prefersReduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
          animate={prefersReduced ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
          exit={prefersReduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
          transition={
            prefersReduced
              ? { duration: 0.08 }
              : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }
          }
          className={`overflow-hidden ${className}`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Smooth crossfade + subtle vertical settle when switching tabs, categories,
 * subjects, or steps inside a screen.
 */
export function SmoothViewSwitch({
  viewKey,
  children,
  className = '',
}: {
  viewKey: string;
  children: React.ReactNode;
  className?: string;
}) {
  const prefersReduced = Boolean(useReducedMotion());
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={viewKey}
        initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={prefersReduced ? { opacity: 1 } : { opacity: 0, y: -4 }}
        transition={
          prefersReduced
            ? { duration: 0.01 }
            : { duration: 0.18, ease: [0.22, 1, 0.36, 1] }
        }
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Spring-animated linear progress bar (`scaleX` GPU transform).
 */
export function SmoothProgressBar({
  value,
  max = 100,
  tone = 'indigo',
  heightClass = 'h-3',
  trackClass = 'bg-[var(--line)]/80',
  ariaLabel,
  className = '',
}: {
  value: number;
  max?: number;
  tone?: 'indigo' | 'emerald' | 'gold';
  heightClass?: string;
  trackClass?: string;
  ariaLabel?: string;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  const safeMax = Math.max(1, max);
  const clamped = Math.max(0, Math.min(safeMax, value));
  const ratio = mounted ? clamped / safeMax : 0;

  const fillCls =
    tone === 'emerald'
      ? 'bg-[var(--green)]'
      : tone === 'gold'
        ? 'bg-[var(--hero-badge)]'
        : 'bg-[var(--gold)]';

  return (
    <div
      role={ariaLabel ? 'progressbar' : undefined}
      aria-valuenow={ariaLabel ? Math.round((clamped / safeMax) * 100) : undefined}
      aria-valuemin={ariaLabel ? 0 : undefined}
      aria-valuemax={ariaLabel ? 100 : undefined}
      aria-label={ariaLabel}
      className={`w-full ${heightClass} rounded-full overflow-hidden ${trackClass} ${className}`}
    >
      <div
        className={`h-full w-full rounded-full ul-bar-fill ${fillCls}`}
        style={{ transform: `scaleX(${ratio})` }}
      />
    </div>
  );
}

/**
 * Animated study level meter for sidebar profile card.
 */
export function RankProgressMeter({ xp }: { xp: number }) {
  const info = getRankProgress(xp);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-[12px] font-semibold">
        <span className="text-[var(--ink)] font-bold truncate">
          Level {info.level} · {info.currentTitle}
        </span>
        <span className="tabular-nums font-bold text-[var(--gold)] shrink-0">
          <AnimatedNumber value={xp} suffix=" pts" />
        </span>
      </div>
      <SmoothProgressBar
        value={Math.round(info.progressRatio * 100)}
        max={100}
        tone="indigo"
        heightClass="h-3"
        trackClass="bg-[var(--deep)]"
        ariaLabel="Study progress"
      />
      <div className="text-[11.5px] font-semibold text-[var(--dim)] tabular-nums">
        {info.nextTitle
          ? `${info.xpNeededForNext} points to ${info.nextTitle}`
          : 'Top level reached'}
      </div>
    </div>
  );
}

/**
 * Crisp, GPU-animated 2D vector illustration for all 6 core subjects.
 */
export function SubjectHeroIllustration({
  subj,
  className = '',
}: {
  subj: SubjectId;
  className?: string;
}) {
  if (subj === 'digitech') {
    return (
      <svg
        viewBox="0 0 220 136"
        fill="none"
        aria-hidden="true"
        className={`pointer-events-none select-none ${className}`}
      >
        {/* Microprocessor Silicon Die, Bus Pins & Binary Stream */}
        <g className="ul-float-slow" transform="translate(18 18)">
          <rect
            x="16"
            y="16"
            width="64"
            height="64"
            rx="12"
            fill="#FFFFFF"
            fillOpacity="0.1"
            stroke="#FFFFFF"
            strokeOpacity="0.78"
            strokeWidth="2"
          />
          <rect
            x="30"
            y="30"
            width="36"
            height="36"
            rx="6"
            fill="#3BDC86"
            fillOpacity="0.24"
            stroke="#3BDC86"
            strokeWidth="1.8"
          />
          {[28, 48, 68].map((pos) => (
            <React.Fragment key={pos}>
              <line x1={pos} y1="6" x2={pos} y2="16" stroke="#FFD84D" strokeWidth="2" strokeLinecap="round" />
              <line x1={pos} y1="80" x2={pos} y2="90" stroke="#FFD84D" strokeWidth="2" strokeLinecap="round" />
              <line x1="6" y1={pos} x2="16" y2={pos} stroke="#8CCBFF" strokeWidth="2" strokeLinecap="round" />
              <line x1="80" y1={pos} x2="90" y2={pos} stroke="#8CCBFF" strokeWidth="2" strokeLinecap="round" />
            </React.Fragment>
          ))}
          <text x="36" y="52" fill="#FFD84D" fontSize="9.5" fontWeight="800">ALU</text>
        </g>

        {/* Logic Gate & Binary Packet Signal */}
        <g className="ul-float-tilt" transform="translate(122 24)">
          <path
            d="M12 20 H34 C50 20 58 30 58 42 C58 54 50 64 34 64 H12 Z"
            fill="#8CCBFF"
            fillOpacity="0.2"
            stroke="#8CCBFF"
            strokeWidth="2"
          />
          <line x1="0" y1="32" x2="12" y2="32" stroke="#FFFFFF" strokeOpacity="0.7" strokeWidth="1.8" />
          <line x1="0" y1="52" x2="12" y2="52" stroke="#FFFFFF" strokeOpacity="0.7" strokeWidth="1.8" />
          <line x1="58" y1="42" x2="80" y2="42" stroke="#3BDC86" strokeWidth="2.2" />
          <circle cx="80" cy="42" r="3.8" fill="#3BDC86" />
          <text x="8" y="84" fill="#FFD84D" fontSize="10" fontWeight="800">10110₂</text>
        </g>
      </svg>
    );
  }

  if (subj === 'dataproc') {
    return (
      <svg
        viewBox="0 0 220 136"
        fill="none"
        aria-hidden="true"
        className={`pointer-events-none select-none ${className}`}
      >
        {/* 3-Tier Relational Database Cylinder Stack */}
        <g className="ul-float-slow" transform="translate(18 18)">
          <ellipse cx="44" cy="18" rx="34" ry="11" fill="#3BDC86" fillOpacity="0.26" stroke="#3BDC86" strokeWidth="2" />
          <path d="M10 18 V76 C10 82 25 87 44 87 C63 87 78 82 78 76 V18" stroke="#FFFFFF" strokeOpacity="0.78" strokeWidth="2" />
          <path d="M10 38 C10 44 25 49 44 49 C63 49 78 44 78 38" stroke="#8CCBFF" strokeWidth="1.7" />
          <path d="M10 57 C10 63 25 68 44 68 C63 68 78 63 78 57" stroke="#FFD84D" strokeWidth="1.7" />
          <circle cx="24" cy="31" r="2.5" fill="#FFD84D" />
          <circle cx="24" cy="50" r="2.5" fill="#3BDC86" />
          <circle cx="24" cy="69" r="2.5" fill="#8CCBFF" />
        </g>

        {/* Primary-to-Foreign Key Relation & SQL Table Card */}
        <g className="ul-float-tilt" transform="translate(116 22)">
          <rect x="8" y="8" width="76" height="52" rx="8" fill="#FFFFFF" fillOpacity="0.1" stroke="#FFD84D" strokeWidth="1.8" />
          <line x1="8" y1="24" x2="84" y2="24" stroke="#FFD84D" strokeOpacity="0.65" strokeWidth="1.5" />
          <line x1="34" y1="8" x2="34" y2="60" stroke="#FFFFFF" strokeOpacity="0.35" strokeWidth="1.3" />
          <text x="14" y="19" fill="#FFD84D" fontSize="8.5" fontWeight="800">PK</text>
          <text x="42" y="19" fill="#FFFFFF" fontSize="8.5" fontWeight="800">SQL 3NF</text>
          <line x1="14" y1="35" x2="28" y2="35" stroke="#3BDC86" strokeWidth="2" strokeLinecap="round" />
          <line x1="40" y1="35" x2="74" y2="35" stroke="#FFFFFF" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" />
          <line x1="14" y1="48" x2="28" y2="48" stroke="#8CCBFF" strokeWidth="2" strokeLinecap="round" />
          <line x1="40" y1="48" x2="68" y2="48" stroke="#FFFFFF" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" />
          <text x="12" y="82" fill="#9EF5C5" fontSize="9.5" fontWeight="800">SELECT *</text>
        </g>
      </svg>
    );
  }

  if (subj === 'fmaths') {
    return (
      <svg
        viewBox="0 0 220 136"
        fill="none"
        aria-hidden="true"
        className={`pointer-events-none select-none ${className}`}
      >
        {/* Definite Integral Shaded Area & Tangent Slope */}
        <g className="ul-float-slow" transform="translate(14 16)">
          <line x1="8" y1="92" x2="112" y2="92" stroke="#FFFFFF" strokeOpacity="0.4" strokeWidth="1.6" />
          <line x1="16" y1="10" x2="16" y2="100" stroke="#FFFFFF" strokeOpacity="0.4" strokeWidth="1.6" />
          <path
            d="M32 92 V 62 C 50 28 72 28 92 54 V 92 Z"
            fill="#3BDC86"
            fillOpacity="0.24"
          />
          <path
            d="M18 82 C 42 22 72 18 106 64"
            stroke="#FFD84D"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="ul-curve-draw"
          />
          <line x1="36" y1="54" x2="88" y2="22" stroke="#8CCBFF" strokeWidth="1.8" strokeDasharray="4 3" />
          <circle cx="62" cy="38" r="3.8" fill="#FFD84D" />
          <text x="48" y="80" fill="#FFFFFF" fontSize="11" fontWeight="800">∫f(x)dx</text>
        </g>

        {/* 3D Orthogonal Vector Triad (i, j, k) */}
        <g className="ul-float-tilt" transform="translate(136 24)">
          <line x1="32" y1="56" x2="32" y2="12" stroke="#FFD84D" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="32" y1="56" x2="72" y2="74" stroke="#3BDC86" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="32" y1="56" x2="4" y2="76" stroke="#8CCBFF" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="32" y1="56" x2="62" y2="24" stroke="#FFFFFF" strokeWidth="2.2" strokeDasharray="3 3" />
          <circle cx="62" cy="24" r="3.6" fill="#3BDC86" />
          <text x="36" y="16" fill="#FFD84D" fontSize="9.5" fontWeight="800">k</text>
          <text x="68" y="84" fill="#3BDC86" fontSize="9.5" fontWeight="800">j</text>
          <text x="2" y="86" fill="#8CCBFF" fontSize="9.5" fontWeight="800">i</text>
        </g>
      </svg>
    );
  }

  if (subj === 'geog') {
    return (
      <svg
        viewBox="0 0 220 136"
        fill="none"
        aria-hidden="true"
        className={`pointer-events-none select-none ${className}`}
      >
        {/* Terrestrial Lat/Long Globe & 15°E Meridian */}
        <g className="ul-float-slow" transform="translate(18 18)">
          <circle cx="48" cy="48" r="40" fill="#FFFFFF" fillOpacity="0.08" stroke="#FFFFFF" strokeOpacity="0.72" strokeWidth="2" />
          <ellipse cx="48" cy="48" rx="18" ry="40" stroke="#8CCBFF" strokeOpacity="0.7" strokeWidth="1.5" />
          <line x1="8" y1="48" x2="88" y2="48" stroke="#FFD84D" strokeWidth="1.8" />
          <path d="M13 30 Q 48 36 83 30" stroke="#FFFFFF" strokeOpacity="0.45" strokeWidth="1.3" strokeDasharray="3 3" />
          <path d="M13 66 Q 48 60 83 66" stroke="#FFFFFF" strokeOpacity="0.45" strokeWidth="1.3" strokeDasharray="3 3" />
          <circle cx="60" cy="40" r="3.8" fill="#3BDC86" />
        </g>

        {/* Topographical Contour Concentric Hill & North Compass */}
        <g className="ul-float-tilt" transform="translate(122 22)">
          <ellipse cx="44" cy="54" rx="38" ry="26" stroke="#9EF5C5" strokeOpacity="0.65" strokeWidth="1.6" />
          <ellipse cx="46" cy="52" rx="25" ry="16" stroke="#3BDC86" strokeWidth="1.8" />
          <ellipse cx="48" cy="50" rx="11" ry="7" fill="#FFD84D" fillOpacity="0.25" stroke="#FFD84D" strokeWidth="1.8" />
          <polygon points="74,4 79,18 74,15 69,18" fill="#FFD84D" />
          <text x="70" y="28" fill="#FFFFFF" fontSize="9" fontWeight="800">N</text>
        </g>
      </svg>
    );
  }

  if (subj === 'econ') {
    return (
      <svg
        viewBox="0 0 220 136"
        fill="none"
        aria-hidden="true"
        className={`pointer-events-none select-none ${className}`}
      >
        {/* Market Supply & Demand Equilibrium Cross (D, S, E*) */}
        <g className="ul-float-slow" transform="translate(16 18)">
          <line x1="8" y1="8" x2="8" y2="96" stroke="#FFFFFF" strokeOpacity="0.45" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="8" y1="96" x2="104" y2="96" stroke="#FFFFFF" strokeOpacity="0.45" strokeWidth="1.8" strokeLinecap="round" />
          {/* Demand curve D */}
          <path d="M18 22 L92 84" stroke="#8CCBFF" strokeWidth="2.4" strokeLinecap="round" />
          {/* Supply curve S */}
          <path d="M18 84 L92 22" stroke="#3BDC86" strokeWidth="2.4" strokeLinecap="round" />
          {/* Dashed equilibrium lines */}
          <line x1="8" y1="53" x2="55" y2="53" stroke="#FFD84D" strokeOpacity="0.7" strokeWidth="1.4" strokeDasharray="3 3" />
          <line x1="55" y1="53" x2="55" y2="96" stroke="#FFD84D" strokeOpacity="0.7" strokeWidth="1.4" strokeDasharray="3 3" />
          <circle cx="55" cy="53" r="4.5" fill="#FFD84D" />
          <text x="94" y="24" fill="#3BDC86" fontSize="10" fontWeight="800">S</text>
          <text x="94" y="88" fill="#8CCBFF" fontSize="10" fontWeight="800">D</text>
        </g>

        {/* Ascending Macro GDP Bars & Concave PPC Frontier */}
        <g className="ul-float-tilt" transform="translate(132 24)">
          <rect x="6" y="56" width="12" height="32" rx="3" fill="#FFFFFF" fillOpacity="0.22" />
          <rect x="24" y="40" width="12" height="48" rx="3" fill="#3BDC86" fillOpacity="0.45" />
          <rect x="42" y="22" width="12" height="66" rx="3" fill="#FFD84D" fillOpacity="0.75" />
          <path
            d="M4 14 Q 44 16 66 84"
            stroke="#9EF5C5"
            strokeWidth="2"
            strokeDasharray="4 3"
            strokeLinecap="round"
          />
        </g>
      </svg>
    );
  }

  if (subj === 'bio') {
    return (
      <svg
        viewBox="0 0 220 136"
        fill="none"
        aria-hidden="true"
        className={`pointer-events-none select-none ${className}`}
      >
        {/* Double-Helix DNA Strand */}
        <g className="ul-float-slow" transform="translate(22 14)">
          <path
            d="M12 10 C 44 26, 44 54, 12 70 C -12 84, 44 98, 44 108"
            stroke="#3BDC86"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M44 10 C 12 26, 12 54, 44 70 C 68 84, 12 98, 12 108"
            stroke="#FFD84D"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          {[20, 34, 48, 62, 82, 96].map((y, idx) => (
            <line
              key={y}
              x1="18"
              y1={y}
              x2="38"
              y2={y}
              stroke={idx % 2 === 0 ? '#FFFFFF' : '#9EF5C5'}
              strokeOpacity="0.72"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          ))}
        </g>

        {/* Eukaryotic Cell & Chloroplast Cross-Section */}
        <g className="ul-float-tilt" transform="translate(92 24)">
          <rect
            x="0"
            y="0"
            width="64"
            height="86"
            rx="18"
            fill="#3BDC86"
            fillOpacity="0.16"
            stroke="#FFFFFF"
            strokeOpacity="0.75"
            strokeWidth="2"
          />
          <rect
            x="6"
            y="6"
            width="52"
            height="74"
            rx="13"
            stroke="#9EF5C5"
            strokeOpacity="0.6"
            strokeWidth="1.4"
            strokeDasharray="4 3"
          />
          {/* Nucleus */}
          <circle cx="32" cy="30" r="11" fill="#FFD84D" fillOpacity="0.28" stroke="#FFD84D" strokeWidth="1.8" />
          <circle cx="32" cy="30" r="4" fill="#FFD84D" />
          {/* Central Vacuole & Chloroplasts */}
          <ellipse cx="32" cy="60" rx="16" ry="11" fill="#8CCBFF" fillOpacity="0.24" stroke="#8CCBFF" strokeWidth="1.5" />
          <circle cx="15" cy="48" r="3" fill="#3BDC86" />
          <circle cx="49" cy="46" r="3" fill="#3BDC86" />
        </g>

        {/* Compound Microscope Lens Reticle */}
        <g transform="translate(174 36)">
          <circle cx="16" cy="16" r="18" stroke="#FFFFFF" strokeOpacity="0.4" strokeWidth="1.6" />
          <circle cx="16" cy="16" r="11" stroke="#FFD84D" strokeOpacity="0.75" strokeWidth="1.4" strokeDasharray="3 3" />
          <line x1="16" y1="2" x2="16" y2="30" stroke="#FFFFFF" strokeOpacity="0.45" strokeWidth="1.2" />
          <line x1="2" y1="16" x2="30" y2="16" stroke="#FFFFFF" strokeOpacity="0.45" strokeWidth="1.2" />
        </g>
      </svg>
    );
  }

  if (subj === 'phys') {
    return (
      <svg
        viewBox="0 0 220 136"
        fill="none"
        aria-hidden="true"
        className={`pointer-events-none select-none ${className}`}
      >
        {/* Optical Prism & Dispersion Rays */}
        <g className="ul-float-slow" transform="translate(20 24)">
          <line x1="0" y1="48" x2="36" y2="42" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
          <polygon
            points="48,12 80,72 16,72"
            fill="#FFFFFF"
            fillOpacity="0.14"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <line x1="65" y1="40" x2="108" y2="26" stroke="#FFD84D" strokeWidth="2" strokeLinecap="round" />
          <line x1="67" y1="45" x2="110" y2="44" stroke="#3BDC86" strokeWidth="2" strokeLinecap="round" />
          <line x1="69" y1="50" x2="108" y2="62" stroke="#8CCBFF" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Harmonic Wave & Magnetic Field Ring */}
        <g className="ul-float-tilt" transform="translate(132 24)">
          <circle cx="38" cy="44" r="30" stroke="#FFFFFF" strokeOpacity="0.32" strokeWidth="1.5" strokeDasharray="4 4" />
          <path
            d="M8 44 Q 23 16 38 44 T 68 44"
            stroke="#FFD84D"
            strokeWidth="2.4"
            strokeLinecap="round"
            className="ul-curve-draw"
          />
          <circle cx="38" cy="44" r="4" fill="#3BDC86" />
        </g>
      </svg>
    );
  }

  if (subj === 'eng') {
    return (
      <svg
        viewBox="0 0 220 136"
        fill="none"
        aria-hidden="true"
        className={`pointer-events-none select-none ${className}`}
      >
        {/* Phonetic Soundwave & Stress Pulse */}
        <g className="ul-float-tilt" transform="translate(18 18)">
          <rect
            x="0"
            y="0"
            width="86"
            height="34"
            rx="10"
            fill="#FFFFFF"
            fillOpacity="0.12"
            stroke="#FFFFFF"
            strokeOpacity="0.38"
            strokeWidth="1.4"
          />
          <text
            x="10"
            y="21"
            fill="#FFD84D"
            fontSize="11.5"
            fontWeight="800"
            fontFamily="var(--display)"
          >
            /ə/ · ˈSTRESS
          </text>
          <path
            d="M12 48 Q 24 34 36 48 T 60 48 T 84 48"
            stroke="#3BDC86"
            strokeWidth="2.2"
            strokeLinecap="round"
            className="ul-curve-draw"
          />
        </g>

        {/* Open Literary Hardcover Book */}
        <g className="ul-float-slow" transform="translate(64 46)">
          <path
            d="M46 16 C 32 10 14 11 4 17 V 68 C 14 62 32 61 46 67 C 60 61 78 62 88 68 V 17 C 78 11 60 10 46 16 Z"
            fill="#FFFFFF"
            fillOpacity="0.14"
            stroke="#FFFFFF"
            strokeWidth="2.1"
            strokeLinejoin="round"
          />
          <line x1="46" y1="16" x2="46" y2="67" stroke="#FFD84D" strokeWidth="2" strokeLinecap="round" />
          <line x1="14" y1="28" x2="37" y2="26" stroke="#FFFFFF" strokeOpacity="0.7" strokeWidth="1.7" strokeLinecap="round" />
          <line x1="14" y1="38" x2="37" y2="36" stroke="#FFFFFF" strokeOpacity="0.55" strokeWidth="1.7" strokeLinecap="round" />
          <line x1="14" y1="48" x2="34" y2="46" stroke="#9EF5C5" strokeWidth="1.7" strokeLinecap="round" />
          <line x1="55" y1="26" x2="78" y2="28" stroke="#FFFFFF" strokeOpacity="0.7" strokeWidth="1.7" strokeLinecap="round" />
          <line x1="55" y1="36" x2="78" y2="38" stroke="#FFD84D" strokeOpacity="0.85" strokeWidth="1.7" strokeLinecap="round" />
          <line x1="55" y1="46" x2="74" y2="48" stroke="#FFFFFF" strokeOpacity="0.55" strokeWidth="1.7" strokeLinecap="round" />
        </g>

        {/* Floating Fountain Pen Nib */}
        <g className="ul-float-tilt" transform="translate(160 20)">
          <path
            d="M28 6 L42 20 L20 54 L6 58 L10 44 L28 6 Z"
            fill="#FFD84D"
            fillOpacity="0.24"
            stroke="#FFD84D"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <line x1="6" y1="58" x2="21" y2="43" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="21" cy="43" r="2.5" fill="#3BDC86" />
        </g>
      </svg>
    );
  }

  if (subj === 'chem') {
    return (
      <svg
        viewBox="0 0 220 136"
        fill="none"
        aria-hidden="true"
        className={`pointer-events-none select-none ${className}`}
      >
        {/* Hexagonal aromatic lattice motif */}
        <g className="ul-float-tilt" opacity="0.34" stroke="#FFFFFF" strokeWidth="1.6">
          <polygon points="34,26 48,18 62,26 62,42 48,50 34,42" />
          <polygon points="48,50 62,42 76,50 76,66 62,74 48,66" />
          <circle cx="48" cy="34" r="7" strokeDasharray="3 3" />
        </g>

        {/* Orbiting Bohr Atom */}
        <g transform="translate(162 46)">
          <circle cx="0" cy="0" r="6.5" fill="#FFD84D" />
          <circle cx="0" cy="0" r="12" stroke="#FFFFFF" strokeOpacity="0.22" strokeWidth="1.2" />
          <ellipse
            cx="0"
            cy="0"
            rx="32"
            ry="13"
            transform="rotate(-28)"
            stroke="#FFFFFF"
            strokeOpacity="0.45"
            strokeWidth="1.5"
          />
          <ellipse
            cx="0"
            cy="0"
            rx="32"
            ry="13"
            transform="rotate(32)"
            stroke="#8CCBFF"
            strokeOpacity="0.55"
            strokeWidth="1.5"
          />
          <g className="ul-orbit">
            <circle cx="26" cy="-11" r="3.5" fill="#3BDC86" />
            <circle cx="-25" cy="11" r="3" fill="#FFD84D" />
          </g>
        </g>

        {/* Floating Volumetric Flask with Effervescent Bubbles */}
        <g className="ul-float-slow" transform="translate(82 22)">
          <path
            d="M19 64L8 88C6.2 92 9.1 96.5 13.5 96.5H46.5C50.9 96.5 53.8 92 52 88L41 64H19Z"
            fill="#3BDC86"
            fillOpacity="0.38"
          />
          <path d="M18 66Q30 62 42 66" stroke="#9EF5C5" strokeWidth="2" strokeLinecap="round" />
          <circle cx="25" cy="84" r="2.6" fill="#FFD84D" className="ul-bub-1" />
          <circle cx="34" cy="88" r="2.1" fill="#FFFFFF" className="ul-bub-2" />
          <circle cx="30" cy="79" r="1.9" fill="#9EF5C5" className="ul-bub-3" />
          <path
            d="M23 18H37M26 18V46L8 86C5.8 91 9.5 96.5 15 96.5H45C50.5 96.5 54.2 91 52 86L34 46V18"
            stroke="#FFFFFF"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="25" y1="33" x2="33" y2="33" stroke="#FFD84D" strokeWidth="2" strokeLinecap="round" />
        </g>
      </svg>
    );
  }

  // Humanities, Languages, Literature, Religious Studies & Law/History
  if (
    subj === 'lit' ||
    subj === 'crs' ||
    subj === 'irs' ||
    subj === 'govt' ||
    subj === 'hist' ||
    subj === 'french' ||
    subj === 'arabic' ||
    subj === 'hausa' ||
    subj === 'igbo' ||
    subj === 'yoruba'
  ) {
    return (
      <svg
        viewBox="0 0 220 136"
        fill="none"
        aria-hidden="true"
        className={`pointer-events-none select-none ${className}`}
      >
        {/* Classic Open Volume with Golden Bookmark Ribbon */}
        <g className="ul-float-slow" transform="translate(24 30)">
          <path
            d="M52 16 C 36 9 16 10 4 17 V 76 C 16 69 36 68 52 75 C 68 68 88 69 100 76 V 17 C 88 10 68 9 52 16 Z"
            fill="#FFFFFF"
            fillOpacity="0.14"
            stroke="#FFFFFF"
            strokeWidth="2.1"
            strokeLinejoin="round"
          />
          <line x1="52" y1="16" x2="52" y2="75" stroke="#FFD84D" strokeWidth="2.1" strokeLinecap="round" />
          <path d="M52 72 V 89 L 47 84 L 42 89 V 72" fill="#FFD84D" fillOpacity="0.85" />
          <line x1="15" y1="30" x2="41" y2="28" stroke="#FFFFFF" strokeOpacity="0.72" strokeWidth="1.7" strokeLinecap="round" />
          <line x1="15" y1="42" x2="41" y2="40" stroke="#9EF5C5" strokeWidth="1.7" strokeLinecap="round" />
          <line x1="15" y1="54" x2="36" y2="52" stroke="#FFFFFF" strokeOpacity="0.55" strokeWidth="1.7" strokeLinecap="round" />
          <line x1="63" y1="28" x2="89" y2="30" stroke="#FFD84D" strokeOpacity="0.88" strokeWidth="1.7" strokeLinecap="round" />
          <line x1="63" y1="40" x2="89" y2="42" stroke="#FFFFFF" strokeOpacity="0.72" strokeWidth="1.7" strokeLinecap="round" />
          <line x1="63" y1="52" x2="84" y2="54" stroke="#FFFFFF" strokeOpacity="0.55" strokeWidth="1.7" strokeLinecap="round" />
        </g>

        {/* Illuminated Scroll Seal & Calligraphy Nib */}
        <g className="ul-float-tilt" transform="translate(144 22)">
          <circle cx="28" cy="28" r="21" fill="#FFD84D" fillOpacity="0.14" stroke="#FFD84D" strokeWidth="1.7" />
          <path
            d="M28 15 L31.5 23.5 L40.5 24 L33.5 30 L35.8 39 L28 34 L20.2 39 L22.5 30 L15.5 24 L24.5 23.5 Z"
            fill="#3BDC86"
            fillOpacity="0.38"
            stroke="#9EF5C5"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M16 64 H44 M20 74 H40"
            stroke="#8CCBFF"
            strokeOpacity="0.8"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
      </svg>
    );
  }

  // Business, Commerce, Accounting & Office Administration
  if (
    subj === 'comm' ||
    subj === 'acct' ||
    subj === 'marketing' ||
    subj === 'officeprac' ||
    subj === 'insurance' ||
    subj === 'storemgt' ||
    subj === 'bookkeep'
  ) {
    return (
      <svg
        viewBox="0 0 220 136"
        fill="none"
        aria-hidden="true"
        className={`pointer-events-none select-none ${className}`}
      >
        {/* Balanced Ledger Sheet */}
        <g className="ul-float-slow" transform="translate(20 22)">
          <rect
            x="4"
            y="6"
            width="86"
            height="78"
            rx="10"
            fill="#FFFFFF"
            fillOpacity="0.12"
            stroke="#FFFFFF"
            strokeOpacity="0.78"
            strokeWidth="2"
          />
          <line x1="4" y1="24" x2="90" y2="24" stroke="#FFD84D" strokeWidth="1.7" />
          <line x1="47" y1="24" x2="47" y2="84" stroke="#FFFFFF" strokeOpacity="0.35" strokeWidth="1.4" />
          <line x1="14" y1="38" x2="38" y2="38" stroke="#3BDC86" strokeWidth="2" strokeLinecap="round" />
          <line x1="56" y1="38" x2="80" y2="38" stroke="#8CCBFF" strokeWidth="2" strokeLinecap="round" />
          <line x1="14" y1="52" x2="34" y2="52" stroke="#FFFFFF" strokeOpacity="0.65" strokeWidth="2" strokeLinecap="round" />
          <line x1="56" y1="52" x2="76" y2="52" stroke="#FFFFFF" strokeOpacity="0.65" strokeWidth="2" strokeLinecap="round" />
          <line x1="14" y1="68" x2="38" y2="68" stroke="#FFD84D" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="56" y1="68" x2="80" y2="68" stroke="#FFD84D" strokeWidth="2.2" strokeLinecap="round" />
        </g>

        {/* Growth Bars & Coin Emblem */}
        <g className="ul-float-tilt" transform="translate(128 24)">
          <rect x="8" y="48" width="14" height="32" rx="4" fill="#8CCBFF" fillOpacity="0.45" stroke="#8CCBFF" strokeWidth="1.6" />
          <rect x="30" y="34" width="14" height="46" rx="4" fill="#3BDC86" fillOpacity="0.45" stroke="#3BDC86" strokeWidth="1.6" />
          <rect x="52" y="18" width="14" height="62" rx="4" fill="#FFD84D" fillOpacity="0.45" stroke="#FFD84D" strokeWidth="1.6" />
          <circle cx="22" cy="18" r="11" fill="#FFD84D" fillOpacity="0.22" stroke="#FFD84D" strokeWidth="1.8" />
        </g>
      </svg>
    );
  }

  // Creative Arts, Music, Photography & Fashion/Cosmetology
  if (
    subj === 'art' ||
    subj === 'music' ||
    subj === 'photo' ||
    subj === 'garment' ||
    subj === 'cosmet'
  ) {
    return (
      <svg
        viewBox="0 0 220 136"
        fill="none"
        aria-hidden="true"
        className={`pointer-events-none select-none ${className}`}
      >
        <g className="ul-float-slow" transform="translate(22 22)">
          <rect
            x="6"
            y="8"
            width="88"
            height="72"
            rx="14"
            fill="#FFFFFF"
            fillOpacity="0.12"
            stroke="#FFFFFF"
            strokeOpacity="0.76"
            strokeWidth="2"
          />
          <circle cx="50" cy="44" r="20" fill="#FFD84D" fillOpacity="0.18" stroke="#FFD84D" strokeWidth="2" />
          <circle cx="50" cy="44" r="9" fill="#3BDC86" fillOpacity="0.36" stroke="#9EF5C5" strokeWidth="1.6" />
          <circle cx="78" cy="22" r="3.5" fill="#8CCBFF" />
        </g>
        <g className="ul-float-tilt" transform="translate(130 28)">
          <path
            d="M6 48 Q 22 22 38 48 T 70 48"
            stroke="#FFD84D"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <circle cx="22" cy="22" r="6" fill="#3BDC86" fillOpacity="0.45" stroke="#3BDC86" strokeWidth="1.6" />
          <circle cx="54" cy="20" r="6" fill="#8CCBFF" fillOpacity="0.45" stroke="#8CCBFF" strokeWidth="1.6" />
        </g>
      </svg>
    );
  }

  // Health, Nutrition, Home Management, Catering, Livestock & Tourism
  if (
    subj === 'homeec' ||
    subj === 'phe' ||
    subj === 'foodnut' ||
    subj === 'homemgt' ||
    subj === 'animalhusb' ||
    subj === 'fisheries' ||
    subj === 'catering' ||
    subj === 'tourism'
  ) {
    return (
      <svg
        viewBox="0 0 220 136"
        fill="none"
        aria-hidden="true"
        className={`pointer-events-none select-none ${className}`}
      >
        <g className="ul-float-slow" transform="translate(24 22)">
          <path
            d="M42 10 L76 24 V 52 C 76 72 61 86 42 94 C 23 86 8 72 8 52 V 24 L 42 10 Z"
            fill="#FFFFFF"
            fillOpacity="0.12"
            stroke="#FFFFFF"
            strokeOpacity="0.78"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M42 30 C 56 30 60 46 42 66 C 24 46 28 30 42 30 Z"
            fill="#3BDC86"
            fillOpacity="0.34"
            stroke="#9EF5C5"
            strokeWidth="1.8"
          />
        </g>
        <g className="ul-float-tilt" transform="translate(128 28)">
          <circle cx="34" cy="38" r="26" fill="#FFD84D" fillOpacity="0.14" stroke="#FFD84D" strokeWidth="1.8" />
          <path d="M22 38 H46 M34 26 V50" stroke="#FFD84D" strokeWidth="2.4" strokeLinecap="round" />
        </g>
      </svg>
    );
  }

  // Computing, Engineering & Technical Trade Workshops
  if (
    subj === 'comp' ||
    subj === 'techdraw' ||
    subj === 'elecinst' ||
    subj === 'automech' ||
    subj === 'carpentry' ||
    subj === 'blocklay' ||
    subj === 'gsm'
  ) {
    return (
      <svg
        viewBox="0 0 220 136"
        fill="none"
        aria-hidden="true"
        className={`pointer-events-none select-none ${className}`}
      >
        {/* Set-Square & Technical Blueprint Grid */}
        <g className="ul-float-slow" transform="translate(20 20)">
          <polygon
            points="8,84 8,12 86,84"
            fill="#FFFFFF"
            fillOpacity="0.13"
            stroke="#FFFFFF"
            strokeOpacity="0.82"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <polygon
            points="22,72 22,38 58,72"
            fill="#8CCBFF"
            fillOpacity="0.2"
            stroke="#8CCBFF"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </g>
        {/* Precision Gear & Signal Pulse */}
        <g className="ul-float-tilt" transform="translate(126 24)">
          <circle cx="36" cy="40" r="22" fill="#FFD84D" fillOpacity="0.16" stroke="#FFD84D" strokeWidth="2" />
          <circle cx="36" cy="40" r="9" fill="#3BDC86" fillOpacity="0.36" stroke="#9EF5C5" strokeWidth="1.8" />
          <line x1="36" y1="10" x2="36" y2="18" stroke="#FFD84D" strokeWidth="2.4" strokeLinecap="round" />
          <line x1="36" y1="62" x2="36" y2="70" stroke="#FFD84D" strokeWidth="2.4" strokeLinecap="round" />
          <line x1="6" y1="40" x2="14" y2="40" stroke="#FFD84D" strokeWidth="2.4" strokeLinecap="round" />
          <line x1="58" y1="40" x2="66" y2="40" stroke="#FFD84D" strokeWidth="2.4" strokeLinecap="round" />
        </g>
      </svg>
    );
  }

  // Mathematics vector scene: Golden parabola + compass construction arc + floating 3D prism
  return (
    <svg
      viewBox="0 0 220 136"
      fill="none"
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
    >
      <g transform="translate(18 16)">
        <line x1="8" y1="88" x2="108" y2="88" stroke="#FFFFFF" strokeOpacity="0.32" strokeWidth="1.5" />
        <line x1="58" y1="12" x2="58" y2="102" stroke="#FFFFFF" strokeOpacity="0.32" strokeWidth="1.5" />
        <path
          d="M18 22 Q 58 118 98 22"
          stroke="#FFD84D"
          strokeWidth="2.6"
          strokeLinecap="round"
          className="ul-curve-draw"
        />
        <circle cx="36" cy="88" r="3.5" fill="#3BDC86" />
        <circle cx="80" cy="88" r="3.5" fill="#3BDC86" />
        <circle cx="58" cy="70" r="3.8" fill="#FFD84D" />
      </g>

      <g className="ul-float-slow" transform="translate(132 22)">
        <path
          d="M34 8L64 26V62L34 80L4 62V26L34 8Z"
          fill="#FFFFFF"
          fillOpacity="0.1"
          stroke="#FFFFFF"
          strokeOpacity="0.72"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M4 26L34 44L64 26M34 44V80"
          stroke="#8CCBFF"
          strokeOpacity="0.75"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <circle cx="34" cy="8" r="3" fill="#FFD84D" />
        <circle cx="64" cy="26" r="2.8" fill="#3BDC86" />
        <circle cx="4" cy="26" r="2.8" fill="#FFD84D" />
      </g>

      <path
        d="M118 108 A 42 42 0 0 1 186 92"
        stroke="#9EF5C5"
        strokeOpacity="0.55"
        strokeWidth="1.8"
        strokeDasharray="4 4"
        strokeLinecap="round"
        className="ul-float-tilt"
      />
    </svg>
  );
}
