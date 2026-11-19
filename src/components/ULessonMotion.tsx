import React, { useEffect, useId, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { SubjectId } from '../types';
import { getRankProgress } from '../utils/engine';
import { AnimatedNumber } from './AnimatedNumber';
import { Icon } from './Icons';

export interface SlidingTabItem<T extends string> {
  id: T;
  label: string;
  icon?: string;
}

export const LIQUID_CAPSULE_SPRING = {
  type: 'spring' as const,
  stiffness: 390,
  damping: 32,
  mass: 0.68,
};

export const FLUID_SCREEN_SPRING = {
  type: 'spring' as const,
  stiffness: 350,
  damping: 34,
  mass: 0.72,
};

export const FLUID_SCREEN_EXIT = {
  duration: 0.2,
  ease: [0.22, 1, 0.36, 1] as const,
};

/**
 * Prevents child `layoutId` pills from measuring a distorted bounding box while an ancestor
 * screen container is mid-slide on initial mount, then enables liquid spring morphing for all
 * subsequent clicks within that mounted view.
 */
export function usePostMountLayoutGate(delayMs = 280): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), delayMs);
    return () => window.clearTimeout(id);
  }, [delayMs]);
  return ready;
}

/**
 * Stadium-rounded segmented control with a shared-layout liquid sliding capsule
 * (`motion.span` `layoutId`) that morphs cleanly to each item's natural width.
 */
export function SlidingTabs<T extends string>({
  items,
  value,
  onChange,
  ariaLabel,
  variant = 'indigo',
  size = 'md',
  roleType = 'tablist',
  layoutId,
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
  const uid = useId();
  const prefersReduced = useReducedMotion();
  const layoutReady = usePostMountLayoutGate();
  const capsuleId = layoutId || `ul-capsule-${uid}`;
  const count = Math.max(1, items.length);

  const heightCls =
    size === 'sm' ? 'min-h-[34px] text-[12.5px]' : 'min-h-[38px] text-[13px]';
  const padCls =
    count >= 6
      ? 'px-1 gap-0 text-[11px]'
      : count >= 5
        ? 'px-1.5 gap-0.5 text-[11.5px]'
        : count >= 3
          ? 'px-2.5 gap-1.5 text-[12.5px]'
          : 'px-3.5 gap-1.5';
  const thumbToneCls =
    variant === 'indigo'
      ? 'bg-[var(--gold)] shadow-[0_1px_2px_rgba(15,23,42,0.18)]'
      : 'bg-[var(--card)] shadow-[0_1px_2px_rgba(15,23,42,0.1)] border border-[var(--acc-line)]';

  return (
    <div
      role={roleType}
      aria-label={ariaLabel}
      className={`relative flex items-center ${count >= 5 ? 'gap-0' : 'gap-0.5'} p-1 rounded-xl bg-[var(--bg)] border border-[var(--line)] select-none ${className}`}
    >
      {items.map((item) => {
        const active = item.id === value;
        const activeTextCls =
          variant === 'indigo' ? 'text-[var(--on-acc)] font-bold' : 'text-[var(--ink)] font-bold';
        return (
          <button
            key={item.id}
            type="button"
            role={roleType === 'tablist' ? 'tab' : undefined}
            aria-selected={roleType === 'tablist' ? active : undefined}
            aria-pressed={roleType === 'group' ? active : undefined}
            onClick={() => onChange(item.id)}
            className={`relative flex-auto ${heightCls} ${padCls} rounded-[9px] font-semibold flex items-center justify-center cursor-pointer whitespace-nowrap shrink-0 transition-colors duration-150 ${
              active ? activeTextCls : 'text-[var(--dim)] hover:text-[var(--ink)]'
            }`}
          >
            {active && (
              <motion.span
                layoutId={layoutReady ? capsuleId : undefined}
                aria-hidden="true"
                transition={prefersReduced ? { duration: 0 } : LIQUID_CAPSULE_SPRING}
                className={`pointer-events-none absolute inset-0 rounded-[9px] ${thumbToneCls}`}
              />
            )}
            <span className="relative z-10 inline-flex items-center justify-center gap-1.5">
              {item.icon && (
                <Icon
                  name={item.icon}
                  size={size === 'sm' ? 13.5 : 15}
                />
              )}
              <span>{item.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * Spring-animated linear progress bar (`scaleX` GPU transform).
 */
export function SmoothProgressBar({
  value,
  max = 100,
  tone = 'indigo',
  heightClass = 'h-2',
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
 * Animated Rank & XP level meter for sidebar profile card.
 */
export function RankProgressMeter({ xp }: { xp: number }) {
  const info = getRankProgress(xp);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-[12px] font-semibold">
        <span className="text-[var(--ink)] font-bold truncate">
          Lv. {info.level} · {info.currentTitle}
        </span>
        <span className="tabular-nums font-extrabold text-[var(--gold)] shrink-0">
          <AnimatedNumber value={xp} suffix=" XP" />
        </span>
      </div>
      <SmoothProgressBar
        value={Math.round(info.progressRatio * 100)}
        max={100}
        tone="indigo"
        heightClass="h-1.5"
        trackClass="bg-[var(--deep)]"
        ariaLabel="Rank XP progress"
      />
      <div className="text-[11px] font-semibold text-[var(--dim)] tabular-nums">
        {info.nextTitle
          ? `${info.xpNeededForNext} XP to ${info.nextTitle}`
          : 'Top rank unlocked'}
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
