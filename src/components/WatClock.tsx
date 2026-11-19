import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ClockFormat } from '../types';
import { formatWatClock, type WatClockSnapshot } from '../utils/watClock';
import { Icon } from './Icons';

interface ClockFormatContextValue {
  clockFormat: ClockFormat;
  onChangeClockFormat?: (fmt: ClockFormat) => void;
}

const ClockFormatContext = createContext<ClockFormatContextValue>({
  clockFormat: '12h',
});

export function ClockFormatProvider({
  format,
  onChangeFormat,
  children,
}: {
  format: ClockFormat;
  onChangeFormat?: (fmt: ClockFormat) => void;
  children: React.ReactNode;
}) {
  return (
    <ClockFormatContext.Provider
      value={{ clockFormat: format, onChangeClockFormat: onChangeFormat }}
    >
      {children}
    </ClockFormatContext.Provider>
  );
}

export function useClockFormat(): ClockFormatContextValue {
  return useContext(ClockFormatContext);
}

// Single shared 1-second clock subscribers so all panes tick in exact lockstep
let currentNowMs = Date.now();
const tickSubscribers = new Set<(ms: number) => void>();
let sharedIntervalId: number | null = null;

function subscribeWatTick(cb: (ms: number) => void): () => void {
  tickSubscribers.add(cb);
  if (sharedIntervalId === null && typeof window !== 'undefined') {
    sharedIntervalId = window.setInterval(() => {
      currentNowMs = Date.now();
      tickSubscribers.forEach((listener) => listener(currentNowMs));
    }, 1000);
  }
  return () => {
    tickSubscribers.delete(cb);
    if (tickSubscribers.size === 0 && sharedIntervalId !== null && typeof window !== 'undefined') {
      window.clearInterval(sharedIntervalId);
      sharedIntervalId = null;
    }
  };
}

export function useLiveWatClock(overrideFormat?: ClockFormat): WatClockSnapshot {
  const { clockFormat } = useClockFormat();
  const effectiveFormat = overrideFormat ?? clockFormat;
  const [nowMs, setNowMs] = useState<number>(() => Date.now());

  useEffect(() => {
    setNowMs(Date.now());
    return subscribeWatTick((ms) => setNowMs(ms));
  }, []);

  return formatWatClock(nowMs, effectiveFormat);
}

/**
 * Designated Live WAT Timepiece & Full Calendar Pane for the Hero Motivation Showcase
 * (replaces the static motif card in Image 3 and stays live across all 5 rotating pillars).
 */
export function WatHeroPane({
  accentColor = '#FFD84D',
  pillarLabel,
}: {
  accentColor?: string;
  pillarLabel?: string;
}) {
  const snap = useLiveWatClock();

  return (
    <div
      role="region"
      aria-label="Live West Africa Time and Date"
      className="flex flex-col justify-between rounded-2xl bg-[#090F1E]/38 backdrop-blur-md border border-white/15 px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_12px_28px_-10px_rgba(2,6,23,0.42)] min-w-[256px] gap-2.5 select-none"
    >
      <div className="flex items-center justify-between gap-3 text-[11px] font-semibold tracking-wide">
        <span
          className="inline-flex items-center gap-1.5 whitespace-nowrap"
          style={{ color: accentColor }}
        >
          <Icon name="clock" size={13} />
          <span>{snap.zoneFull}</span>
        </span>
        <span className="font-[var(--mono)] text-[10.5px] text-white/70 font-semibold whitespace-nowrap">
          {snap.format === '24h' ? '24-HR' : '12-HR'}
        </span>
      </div>

      <div className="flex items-baseline gap-1 font-[var(--mono)] tabular-nums leading-none py-0.5">
        <span className="font-bold text-[28px] sm:text-[31px] tracking-tight text-white">
          {snap.hoursMinutes}
        </span>
        <span className="font-semibold text-[15px] text-white/75">
          :{snap.seconds}
        </span>
        {snap.period && (
          <span
            className="font-bold text-[12px] ml-1 tracking-wide"
            style={{ color: accentColor }}
          >
            {snap.period}
          </span>
        )}
      </div>

      <div className="pt-2.5 border-t border-white/14 flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2 text-[12.5px] font-semibold text-white tabular-nums whitespace-nowrap">
          <span className="inline-flex items-center gap-1.5">
            <Icon name="calendar" size={13} className="text-white/75 shrink-0" />
            <span>{snap.dateLong}</span>
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 text-[11px] font-medium text-white/74 tabular-nums">
          <span className="font-[var(--mono)] text-[10.5px] whitespace-nowrap shrink-0">
            {snap.dateNumeric}
          </span>
          {pillarLabel && (
            <span className="truncate text-right min-w-0">{pillarLabel}</span>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Compact Live WAT Clock + Date/Month/Year strip used across all other platform panes
 * (Compact Motivation Banner on Topics/Formulas/Review, Subjects Hub, Settings, and Subscreen headers).
 */
export function WatCompactStrip({
  surface = 'card',
  accentColor,
  className = '',
}: {
  surface?: 'glass' | 'card' | 'inline';
  accentColor?: string;
  className?: string;
}) {
  const snap = useLiveWatClock();

  if (surface === 'glass') {
    return (
      <div
        role="region"
        aria-label="Live West Africa Time and Date"
        className={`flex flex-col justify-center rounded-xl bg-[#090F1E]/36 backdrop-blur-sm border border-white/15 px-3.5 py-2 text-white shrink-0 select-none ${className}`}
      >
        <div className="flex items-baseline gap-1 font-[var(--mono)] tabular-nums leading-tight whitespace-nowrap">
          <Icon
            name="clock"
            size={12.5}
            className="self-center mr-1 shrink-0 opacity-85"
          />
          <span className="font-bold text-[14px] text-white">
            {snap.hoursMinutes}:{snap.seconds}
          </span>
          {snap.period && (
            <span
              className="font-bold text-[11px] ml-0.5"
              style={{ color: accentColor || '#FFD84D' }}
            >
              {snap.period}
            </span>
          )}
          <span className="font-[var(--body)] text-[10.5px] font-semibold text-white/70 ml-1">WAT</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-white/80 tabular-nums whitespace-nowrap mt-0.5">
          <span>{snap.dateLong}</span>
          <span aria-hidden="true" className="text-white/40">·</span>
          <span className="font-[var(--mono)] text-[10.5px] text-white/70">{snap.dateNumeric}</span>
        </div>
      </div>
    );
  }

  if (surface === 'inline') {
    return (
      <div
        aria-label="Live West Africa Time and Date"
        className={`inline-flex items-center gap-1.5 text-[12px] font-semibold text-[var(--dim)] tabular-nums whitespace-nowrap select-none ${className}`}
      >
        <Icon name="clock" size={13.5} className="text-[var(--gold)] shrink-0" />
        <span className="font-[var(--mono)] text-[var(--ink)] font-bold">
          {snap.formattedTime}
        </span>
        <span>WAT</span>
        <span aria-hidden="true">·</span>
        <span>{snap.dateLong}</span>
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-label="Live West Africa Time and Date"
      className={`rounded-xl bg-[var(--bg)] border border-[var(--line)] px-3.5 py-2 flex flex-col justify-center gap-0.5 shrink-0 select-none ${className}`}
    >
      <div className="flex items-baseline gap-1 font-[var(--mono)] tabular-nums leading-tight whitespace-nowrap">
        <Icon name="clock" size={13.5} className="text-[var(--gold)] self-center mr-1 shrink-0" />
        <span className="font-bold text-[15px] text-[var(--ink)]">
          {snap.hoursMinutes}:{snap.seconds}
        </span>
        {snap.period && (
          <span className="font-bold text-[11.5px] text-[var(--gold)] ml-0.5">
            {snap.period}
          </span>
        )}
        <span className="font-[var(--body)] text-[11px] font-semibold text-[var(--dim)] ml-1">
          {snap.zoneFull}
        </span>
      </div>
      <div className="flex items-center gap-1.5 text-[11.5px] font-medium text-[var(--dim)] tabular-nums whitespace-nowrap">
        <span>{snap.dateLong}</span>
        <span aria-hidden="true">·</span>
        <span className="font-[var(--mono)] text-[10.5px]">{snap.dateNumeric}</span>
      </div>
    </div>
  );
}
