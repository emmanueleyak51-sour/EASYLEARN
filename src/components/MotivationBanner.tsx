import React, { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { SubjectId } from '../types';
import {
  MOTIVATION_ROTATION_MS,
  MOTIVATION_SLIDES,
  getMotivationSlotAtTime,
  getPersonalizedGreetingLine,
  type MotivationSlide,
} from '../utils/motivationLogic';
import { AdirePattern, Icon } from './Icons';
import { LIQUID_CAPSULE_SPRING, usePostMountLayoutGate } from './ULessonMotion';
import { WatCompactStrip, WatHeroPane } from './WatClock';

// Shared in-memory offset so manual slide inspection syncs across screens during a session
let sharedManualOffset = 0;
let lastSlideDirection: 1 | -1 = 1;
const offsetListeners = new Set<() => void>();

const HERO_PILLAR_LABELS = ['Vision', 'Resilience', 'Momentum', 'Clarity', 'Campus'] as const;

function setSharedOffset(next: number, dir: 1 | -1 = 1) {
  sharedManualOffset = next;
  lastSlideDirection = dir;
  offsetListeners.forEach((fn) => fn());
}

export function useMotivationBannerState() {
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [, bump] = useState(0);
  const prevIndexRef = useRef<number | null>(null);

  useEffect(() => {
    const onOffset = () => bump((x) => x + 1);
    offsetListeners.add(onOffset);

    const id = window.setInterval(() => {
      setNowMs(Date.now());
    }, 2_000);

    return () => {
      offsetListeners.delete(onOffset);
      window.clearInterval(id);
    };
  }, []);

  const activeIndex = getMotivationSlotAtTime(nowMs, sharedManualOffset);
  if (prevIndexRef.current !== null && prevIndexRef.current !== activeIndex) {
    prevIndexRef.current = activeIndex;
  } else if (prevIndexRef.current === null) {
    prevIndexRef.current = activeIndex;
  }

  const slide = MOTIVATION_SLIDES[activeIndex] || MOTIVATION_SLIDES[0];
  const cyclePct = Math.min(
    100,
    Math.max(4, ((nowMs % MOTIVATION_ROTATION_MS) / MOTIVATION_ROTATION_MS) * 100)
  );

  const selectSlide = (targetIdx: number, explicitDir?: 1 | -1) => {
    const n = MOTIVATION_SLIDES.length;
    const normalizedTarget = ((targetIdx % n) + n) % n;
    if (normalizedTarget === activeIndex) return;
    const dir: 1 | -1 =
      explicitDir ?? (normalizedTarget > activeIndex ? 1 : -1);
    const baseIdx = getMotivationSlotAtTime(Date.now(), 0);
    setSharedOffset((((normalizedTarget - baseIdx) % n) + n) % n, dir);
  };

  const stepSlide = (delta: 1 | -1) => {
    const n = MOTIVATION_SLIDES.length;
    selectSlide((activeIndex + delta + n) % n, delta);
  };

  return {
    slide,
    activeIndex,
    direction: lastSlideDirection,
    cyclePct,
    selectSlide,
    stepSlide,
    slides: MOTIVATION_SLIDES,
  };
}

function MotivationMotifArtwork({
  motif,
  accentColor,
}: {
  motif: MotivationSlide['motif'];
  accentColor: string;
}) {
  return (
    <svg
      viewBox="0 0 148 112"
      aria-hidden="true"
      className="w-[132px] h-[100px] shrink-0 select-none"
    >
      {motif === 'sunrise' && (
        <g>
          <circle cx="74" cy="76" r="32" fill={accentColor} fillOpacity="0.22" />
          <path d="M44 76 A30 30 0 0 1 104 76 Z" fill={accentColor} />
          <line
            x1="20"
            y1="78"
            x2="128"
            y2="78"
            stroke="#FFFFFF"
            strokeOpacity="0.5"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <line
            x1="36"
            y1="90"
            x2="112"
            y2="90"
            stroke={accentColor}
            strokeOpacity="0.55"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {[-60, -30, 0, 30, 60].map((deg) => (
            <line
              key={deg}
              x1="74"
              y1="36"
              x2="74"
              y2="20"
              stroke={accentColor}
              strokeWidth="3"
              strokeLinecap="round"
              transform={`rotate(${deg} 74 76)`}
            />
          ))}
        </g>
      )}

      {motif === 'torch' && (
        <g>
          <circle cx="74" cy="44" r="28" fill={accentColor} fillOpacity="0.18" />
          <path
            d="M74 18 C88 32, 92 48, 74 58 C56 48, 60 32, 74 18 Z"
            fill={accentColor}
          />
          <path
            d="M74 30 C81 38, 82 47, 74 53 C66 47, 67 38, 74 30 Z"
            fill="#FFFFFF"
            fillOpacity="0.85"
          />
          <path d="M58 60 H90 L83 72 H65 Z" fill="#E2E8F0" fillOpacity="0.9" />
          <rect x="69" y="72" width="10" height="26" rx="4" fill="#CBD5E1" fillOpacity="0.85" />
        </g>
      )}

      {motif === 'summit' && (
        <g>
          <polygon
            points="22,94 64,34 104,94"
            fill="#FFFFFF"
            fillOpacity="0.16"
            stroke="#FFFFFF"
            strokeOpacity="0.45"
            strokeWidth="2"
          />
          <polygon
            points="62,94 96,46 130,94"
            fill="#FFFFFF"
            fillOpacity="0.24"
            stroke="#FFFFFF"
            strokeOpacity="0.55"
            strokeWidth="2"
          />
          <polygon points="64,34 51,53 64,49 77,53" fill={accentColor} />
          <line
            x1="64"
            y1="34"
            x2="64"
            y2="14"
            stroke={accentColor}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <polygon points="64,14 86,20 64,27" fill={accentColor} />
        </g>
      )}

      {motif === 'compass' && (
        <g>
          <circle
            cx="74"
            cy="56"
            r="38"
            fill="#FFFFFF"
            fillOpacity="0.1"
            stroke="#FFFFFF"
            strokeOpacity="0.45"
            strokeWidth="2.2"
          />
          <circle
            cx="74"
            cy="56"
            r="30"
            fill="none"
            stroke={accentColor}
            strokeOpacity="0.4"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <polygon points="74,24 83,56 74,50 65,56" fill={accentColor} />
          <polygon points="74,88 83,56 74,62 65,56" fill="#FFFFFF" fillOpacity="0.7" />
          <circle cx="74" cy="56" r="4" fill="#FFFFFF" />
        </g>
      )}

      {motif === 'laurel' && (
        <g>
          <circle cx="74" cy="54" r="26" fill={accentColor} fillOpacity="0.16" />
          <path
            d="M46 78 C34 62, 38 36, 56 24"
            fill="none"
            stroke={accentColor}
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M102 78 C114 62, 110 36, 92 24"
            fill="none"
            stroke={accentColor}
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <polygon
            points="74,30 79,43 93,43 82,51 86,65 74,57 62,65 66,51 55,43 69,43"
            fill={accentColor}
          />
        </g>
      )}
    </svg>
  );
}

export function MotivationBanner({
  variant = 'hero',
  studentName,
  subj,
}: {
  variant?: 'hero' | 'compact';
  studentName?: string;
  subj?: SubjectId;
}) {
  const uid = useId();
  const { slide, activeIndex, direction, selectSlide, slides } = useMotivationBannerState();
  const prefersReduced = useReducedMotion();
  const layoutReady = usePostMountLayoutGate();
  const personalLine = getPersonalizedGreetingLine(studentName, subj);

  const easeSettling = [0.16, 1, 0.3, 1] as const;
  const capsuleTransition = prefersReduced ? { duration: 0 } : LIQUID_CAPSULE_SPRING;

  if (variant === 'compact') {
    return (
      <section
        aria-label="Scholar motivation banner"
        className="relative overflow-hidden rounded-2xl p-4 sm:px-5 sm:py-4 text-white shadow-sm transition-[background,border-color] duration-300"
        style={{
          border: `1px solid ${slide.borderAccent}`,
          background: slide.bgGradient,
        }}
      >
        <AdirePattern />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0 flex-1 overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={slide.id}
                initial={prefersReduced ? { opacity: 0 } : { opacity: 0, x: direction * 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={prefersReduced ? { opacity: 0 } : { opacity: 0, x: direction * -12 }}
                transition={{ duration: 0.18, ease: easeSettling }}
              >
                <div
                  className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11.5px] font-bold"
                  style={{ color: slide.accentColor }}
                >
                  <span>{slide.kicker}</span>
                  <span aria-hidden="true" className="hidden sm:inline text-white/50">
                    ·
                  </span>
                  <span className="text-white/80 font-semibold">{slide.authorOrPillar}</span>
                </div>
                <p className="font-[var(--display)] font-bold text-[15.5px] sm:text-[16.5px] text-white leading-snug mt-0.5">
                  {slide.headline}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <WatCompactStrip surface="glass" accentColor={slide.accentColor} />
            <div
              role="tablist"
              aria-label="Motivation panels"
              className="inline-flex items-center gap-0.5 p-1 rounded-xl bg-[#090F1E]/32 border border-white/14 shrink-0"
            >
              {slides.map((s, idx) => {
                const active = idx === activeIndex;
                const label = HERO_PILLAR_LABELS[idx] ?? `${idx + 1}`;
                return (
                  <button
                    key={s.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-label={`${label} motivation (${idx + 1} of ${slides.length})`}
                    onClick={() => selectSlide(idx)}
                    className={`relative min-h-[28px] px-2.5 rounded-[9px] text-[11.5px] font-bold cursor-pointer whitespace-nowrap transition-colors duration-150 ${
                      active ? 'text-[#0F172A]' : 'text-white/75 hover:text-white'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId={layoutReady ? `compact-mot-capsule-${uid}` : undefined}
                        aria-hidden="true"
                        transition={capsuleTransition}
                        className="pointer-events-none absolute inset-0 rounded-[9px] bg-white shadow-xs"
                      />
                    )}
                    <span className="relative z-10">{idx + 1}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-label="Scholar motivation showcase"
      className="relative overflow-hidden rounded-[22px] p-5 sm:p-6 text-white shadow-[var(--shadow-hero)] transition-[background,border-color] duration-300"
      style={{
        background: slide.bgGradient,
        border: `1px solid ${slide.borderAccent}`,
      }}
    >
      <AdirePattern />

      <div className="relative z-10 flex flex-col min-[820px]:flex-row min-[820px]:items-center justify-between gap-5">
        <div className="flex flex-col gap-3 max-w-[630px] min-w-0 flex-1">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={slide.id}
              initial={prefersReduced ? { opacity: 0 } : { opacity: 0, x: direction * 14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, x: direction * -14 }}
              transition={{ duration: 0.2, ease: easeSettling }}
              className="flex flex-col gap-2"
            >
              <div
                className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12px] font-semibold"
                style={{ color: slide.accentColor }}
              >
                <span>{slide.kicker}</span>
                <span aria-hidden="true" className="hidden sm:inline text-white/40">
                  ·
                </span>
                <span className="text-white/85 font-medium">{personalLine}</span>
              </div>

              <h2
                className="font-[var(--display)] font-extrabold text-[21px] sm:text-[24px] text-white leading-snug tracking-tight"
                style={{ textWrap: 'balance' }}
              >
                {slide.headline}
              </h2>

              <p className="text-[14px] sm:text-[14.5px] text-white/85 leading-relaxed">
                {slide.body}
              </p>

              <div
                className="flex items-center gap-2 text-[12.5px] font-semibold pt-0.5"
                style={{ color: slide.accentColor }}
              >
                <Icon name="star" size={14} />
                <span>{slide.takeaway}</span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Architectural Segmented Pillar Switcher */}
          <div className="pt-0.5 w-full sm:w-auto">
            <div
              role="tablist"
              aria-label="Motivation pillars"
              className="grid grid-cols-5 sm:inline-flex items-center gap-0.5 p-1 rounded-xl bg-[#090F1E]/32 border border-white/14"
            >
              {slides.map((s, idx) => {
                const active = idx === activeIndex;
                const label = HERO_PILLAR_LABELS[idx] ?? `Slide ${idx + 1}`;
                return (
                  <button
                    key={s.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => selectSlide(idx)}
                    className={`relative min-h-[30px] px-1 sm:px-3.5 rounded-[9px] text-[10.5px] sm:text-[12px] font-semibold text-center cursor-pointer whitespace-nowrap transition-colors duration-150 ${
                      active ? 'text-[#0F172A] font-bold' : 'text-white/75 hover:text-white'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId={layoutReady ? `hero-mot-capsule-${uid}` : undefined}
                        aria-hidden="true"
                        transition={capsuleTransition}
                        className="pointer-events-none absolute inset-0 rounded-[9px] bg-white shadow-xs"
                      />
                    )}
                    <span className="relative z-10">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="w-full min-[820px]:w-auto shrink-0">
          <WatHeroPane
            accentColor={slide.accentColor}
            pillarLabel={slide.authorOrPillar}
          />
        </div>
      </div>
    </section>
  );
}
