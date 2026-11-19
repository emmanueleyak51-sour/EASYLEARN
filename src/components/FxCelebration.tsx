import React from 'react';
import { Icon } from './Icons';

export interface XpBurstItem {
  id: number;
  label: string;
  sub?: string;
}

const CONFETTI_PIECES: {
  dx: number;
  dy: number;
  rot: number;
  color: string;
  delay: number;
  w: number;
  h: number;
}[] = [
  { dx: -180, dy: 165, rot: -210, color: '#FFD84D', delay: 0.0, w: 9, h: 6 },
  { dx: -145, dy: 210, rot: 160, color: '#3346DB', delay: 0.03, w: 8, h: 8 },
  { dx: -110, dy: 185, rot: -145, color: '#0F8A4A', delay: 0.06, w: 10, h: 5 },
  { dx: -75, dy: 230, rot: 225, color: '#FF6B57', delay: 0.02, w: 7, h: 7 },
  { dx: -42, dy: 195, rot: -180, color: '#3BDC86', delay: 0.05, w: 9, h: 5 },
  { dx: -12, dy: 240, rot: 140, color: '#FFD84D', delay: 0.01, w: 8, h: 8 },
  { dx: 18, dy: 225, rot: -195, color: '#3346DB', delay: 0.04, w: 10, h: 5 },
  { dx: 48, dy: 190, rot: 175, color: '#0F8A4A', delay: 0.07, w: 8, h: 6 },
  { dx: 82, dy: 235, rot: -240, color: '#FF6B57', delay: 0.02, w: 7, h: 7 },
  { dx: 118, dy: 180, rot: 195, color: '#FFD84D', delay: 0.05, w: 9, h: 6 },
  { dx: 152, dy: 215, rot: -165, color: '#3BDC86', delay: 0.03, w: 8, h: 5 },
  { dx: 185, dy: 170, rot: 215, color: '#3346DB', delay: 0.06, w: 9, h: 7 },
  { dx: -128, dy: 140, rot: 120, color: '#7339E0', delay: 0.08, w: 7, h: 6 },
  { dx: 132, dy: 145, rot: -130, color: '#7339E0', delay: 0.08, w: 7, h: 6 },
];

export function FxCelebration({
  bursts,
  confettiKey = 0,
}: {
  bursts: XpBurstItem[];
  confettiKey?: number;
}) {
  if (!bursts.length && !confettiKey) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-14 inset-x-0 z-50 flex flex-col items-center gap-2 overflow-visible"
    >
      {/* #41 Confetti Celebration / #70 Milestone Celebration */}
      {confettiKey > 0 && (
        <div key={`cf-${confettiKey}`} className="relative w-0 h-0">
          {CONFETTI_PIECES.map((p, idx) => (
            <span
              key={idx}
              className="confetti-piece"
              style={
                {
                  '--cf-dx': `${p.dx}px`,
                  '--cf-dy': `${p.dy}px`,
                  '--cf-rot': `${p.rot}deg`,
                  animationDelay: `${p.delay}s`,
                  width: `${p.w}px`,
                  height: `${p.h}px`,
                  backgroundColor: p.color,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      )}

      {/* Floating Streak & Milestone Bursts */}
      {bursts.map((b) => (
        <div
          key={b.id}
          className="anim-xp-float rounded-2xl bg-[#FFD84D] text-[#141C33] border-2 border-[#141C33]/15 shadow-[0_6px_0_#C79B12,0_14px_28px_rgba(20,28,51,0.18)] px-4 py-1.5 flex items-center gap-2 font-[var(--display)] font-extrabold text-[15px]"
        >
          <Icon name="bolt" size={16} className="text-[#3346DB]" />
          <span>{b.label}</span>
          {b.sub && (
            <span className="text-[12px] font-bold text-[#141C33]/75">· {b.sub}</span>
          )}
        </div>
      ))}
    </div>
  );
}

import type { BadgeDef, BadgeTier } from '../utils/engine';

const MODAL_CONFETTI_PIECES = Array.from({ length: 36 }, (_, i) => {
  const angle = (i / 36) * Math.PI * 2;
  const dist = 115 + (i % 4) * 44;
  const dx = Math.round(Math.cos(angle) * dist);
  const dy = Math.round(Math.sin(angle) * dist + 55);
  const palette = ['#FFD84D', '#3BDC86', '#38BDF8', '#FF6B57', '#C084FC', '#F59E0B'];
  return {
    dx,
    dy,
    rot: (i % 2 === 0 ? 1 : -1) * (160 + (i % 5) * 45),
    color: palette[i % palette.length],
    delay: (i % 6) * 0.03,
    w: i % 3 === 0 ? 11 : 8,
    h: i % 2 === 0 ? 6 : 8,
  };
});

export const BADGE_TIER_STYLE: Record<
  BadgeTier,
  {
    label: string;
    crestBg: string;
    crestBorder: string;
    crestText: string;
    glowColor: string;
    rayStroke: string;
    kickerText: string;
  }
> = {
  bronze: {
    label: 'Bronze Crest',
    crestBg: 'linear-gradient(145deg, #E39A5C 0%, #B4622A 58%, #7C3D12 100%)',
    crestBorder: '#F7C59F',
    crestText: '#FFF8F1',
    glowColor: 'rgba(227, 154, 92, 0.42)',
    rayStroke: '#F59E0B',
    kickerText: 'Bronze Achievement Unlocked',
  },
  silver: {
    label: 'Silver Crest',
    crestBg: 'linear-gradient(145deg, #F1F5F9 0%, #94A3B8 55%, #475569 100%)',
    crestBorder: '#FFFFFF',
    crestText: '#0F172A',
    glowColor: 'rgba(148, 163, 184, 0.48)',
    rayStroke: '#7DD3FC',
    kickerText: 'Silver Achievement Unlocked',
  },
  gold: {
    label: 'Gold Crest',
    crestBg: 'linear-gradient(145deg, #FFF08A 0%, #F59E0B 56%, #B45309 100%)',
    crestBorder: '#FEF08A',
    crestText: '#1E1B0C',
    glowColor: 'rgba(245, 158, 11, 0.52)',
    rayStroke: '#FFD84D',
    kickerText: 'Gold Achievement Unlocked',
  },
  mythic: {
    label: 'Mythic Honours',
    crestBg: 'linear-gradient(145deg, #F0ABFC 0%, #8B5CF6 52%, #312E81 100%)',
    crestBorder: '#F5D0FE',
    crestText: '#FFFFFF',
    glowColor: 'rgba(168, 85, 247, 0.58)',
    rayStroke: '#E879F9',
    kickerText: 'Mythic Chancellor Crest Unlocked',
  },
};

export function BadgeUnlockCelebration({
  badge,
  queueIndex = 1,
  queueTotal = 1,
  isPreview = false,
  onDismiss,
}: {
  badge: BadgeDef | null;
  queueIndex?: number;
  queueTotal?: number;
  isPreview?: boolean;
  onDismiss: () => void;
}) {
  React.useEffect(() => {
    if (!badge) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        e.preventDefault();
        onDismiss();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [badge, onDismiss]);

  if (!badge) return null;
  const tierStyle = BADGE_TIER_STYLE[badge.tier];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="badge-unlock-title"
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-[#0B1120]/80 backdrop-blur-sm"
      onClick={onDismiss}
    >
      {/* Radial 36-piece confetti burst */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 flex items-center justify-center overflow-hidden">
        <div key={`bd-cf-${badge.id}-${queueIndex}`} className="relative w-0 h-0">
          {MODAL_CONFETTI_PIECES.map((p, idx) => (
            <span
              key={idx}
              className="confetti-piece"
              style={
                {
                  '--cf-dx': `${p.dx}px`,
                  '--cf-dy': `${p.dy}px`,
                  '--cf-rot': `${p.rot}deg`,
                  animationDelay: `${p.delay}s`,
                  width: `${p.w}px`,
                  height: `${p.h}px`,
                  backgroundColor: p.color,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      </div>

      {/* Main Celebration Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="anim-badge-modal relative w-full max-w-[430px] rounded-[28px] bg-[var(--card)] border-2 border-[var(--acc-line)] shadow-[0_24px_64px_rgba(0,0,0,0.45)] p-6 sm:p-7 flex flex-col items-center text-center gap-4 overflow-hidden"
      >
        {/* Queue indicator when multiple badges unlock together */}
        {queueTotal > 1 && (
          <div className="text-[12px] font-bold text-[var(--dim)] tabular-nums">
            Badge {queueIndex} of {queueTotal}
          </div>
        )}

        {/* Crest Stage with Rotating Sunburst Rays & Pulsing Halo */}
        <div className="relative w-40 h-40 flex items-center justify-center my-1">
          <svg
            aria-hidden="true"
            viewBox="0 0 200 200"
            className="anim-badge-rays absolute inset-0 w-full h-full opacity-45"
          >
            {Array.from({ length: 12 }, (_, idx) => {
              const deg = idx * 30;
              return (
                <polygon
                  key={deg}
                  points="100,100 91,8 109,8"
                  fill={tierStyle.rayStroke}
                  fillOpacity="0.28"
                  transform={`rotate(${deg} 100 100)`}
                />
              );
            })}
          </svg>

          <div
            aria-hidden="true"
            className="anim-badge-ring absolute w-28 h-28 rounded-full"
            style={{
              boxShadow: `0 0 42px 12px ${tierStyle.glowColor}`,
              border: `2px solid ${tierStyle.crestBorder}`,
            }}
          />

          <div
            className="anim-badge-crest bd-hex relative z-10 w-24 h-24 flex items-center justify-center shadow-xl"
            style={{
              background: tierStyle.crestBg,
              color: tierStyle.crestText,
            }}
          >
            <Icon name={badge.icon} size={40} />
          </div>
        </div>

        {/* Tier & Title */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[12px] font-extrabold tracking-wider uppercase text-[var(--gold)]">
            {isPreview ? `${tierStyle.label} · Celebration Preview` : tierStyle.kickerText}
          </span>
          <h2
            id="badge-unlock-title"
            className="font-[var(--display)] font-extrabold text-[26px] text-[var(--ink)] leading-tight"
          >
            {badge.name}
          </h2>
          <p className="text-[14.5px] text-[var(--dim)] leading-relaxed max-w-[330px]">
            {badge.desc}
          </p>
        </div>

        {/* Academic Distinction Callout */}
        <div className="w-full rounded-2xl bg-[var(--bg)] border border-[var(--line)] px-4 py-3 flex items-center justify-between gap-3">
          <span className="text-[13px] font-semibold text-[var(--dim)]">
            Academic Distinction
          </span>
          <span className="font-[var(--display)] font-extrabold text-[15px] text-[var(--green)] flex items-center gap-1.5">
            <Icon name="check" size={16} />
            <span>{tierStyle.label}</span>
          </span>
        </div>

        <button
          type="button"
          onClick={onDismiss}
          className="btn-tactile indigo w-full justify-center whitespace-nowrap mt-1"
        >
          <span>{queueIndex < queueTotal ? 'Next Unlocked Badge' : 'Awesome — Continue'}</span>
          <Icon name="go" size={18} />
        </button>
      </div>
    </div>
  );
}
