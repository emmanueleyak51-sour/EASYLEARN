import React, { useEffect, useRef, useState } from 'react';

/**
 * Smoothly counts from the previous numeric value (or 0 on mount) to `value`
 * using an ease-out cubic curve (#39 Score Counter / #71 Progress Number Counting / #106 Number Counting).
 * Respects `prefers-reduced-motion: reduce`.
 */
export function AnimatedNumber({
  value,
  duration = 560,
  prefix = '',
  suffix = '',
  className = '',
}: {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const [display, setDisplay] = useState<number>(0);
  const prevRef = useRef<number>(0);

  useEffect(() => {
    const target = Number.isFinite(value) ? Math.round(value) : 0;
    const reduced =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced || duration <= 0) {
      prevRef.current = target;
      setDisplay(target);
      return;
    }

    const from = prevRef.current;
    if (from === target) {
      setDisplay(target);
      return;
    }

    const start = performance.now();
    let rafId = 0;

    const step = (now: number) => {
      const t = Math.max(0, Math.min(1, (now - start) / duration));
      const eased = 1 - Math.pow(1 - t, 3);
      const next = Math.round(from + (target - from) * eased);
      setDisplay(next);
      if (t < 1) {
        rafId = window.requestAnimationFrame(step);
      } else {
        prevRef.current = target;
      }
    };

    rafId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(rafId);
  }, [value, duration]);

  return (
    <span className={`tabular-nums ${className}`}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
