import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { ThemeAppearanceMode } from '../types';
import {
  buildOpeningWelcomeCopy,
  computeCrestParallaxTilt,
  generateWelcomeStarfield,
  shouldShowOpeningWelcome,
} from '../utils/openingWelcomeLogic';
import { playWelcomeChord } from '../utils/sound';
import { EasyLearnAnimatedIcon } from './EasyLearnAnimatedIcon';
import { Icon } from './Icons';

const SPLASH_SESSION_KEY = 'rtc_welcome_splash_seen_v1';
let splashPlayedInMemory = false;

function hasPlayedInSession(): boolean {
  if (splashPlayedInMemory) return true;
  try {
    if (typeof window !== 'undefined') {
      return window.sessionStorage.getItem(SPLASH_SESSION_KEY) === '1';
    }
  } catch {
    /* ignore storage errors */
  }
  return false;
}

function markPlayedInSession(): void {
  splashPlayedInMemory = true;
  try {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(SPLASH_SESSION_KEY, '1');
    }
  } catch {
    /* ignore storage errors */
  }
}

export function AnimatedEasyLearnCrest({
  size = 112,
  reduced = false,
}: {
  size?: number;
  reduced?: boolean;
}) {
  const outerSize = Math.round(size * 1.36);

  return (
    <div
      style={{ width: outerSize, height: outerSize }}
      className="relative inline-flex items-center justify-center select-none shrink-0"
      aria-hidden="true"
    >
      {/* Ambient Breathing Sapphire-Gold Halo */}
      <motion.div
        initial={{ opacity: 0.55, scale: 0.92 }}
        animate={
          reduced
            ? { opacity: 0.65, scale: 1 }
            : { opacity: [0.48, 0.86, 0.5], scale: [0.92, 1.08, 0.92] }
        }
        transition={
          reduced
            ? { duration: 0.2 }
            : { duration: 2.6, repeat: Infinity, ease: 'easeInOut' }
        }
        style={{
          width: Math.round(size * 1.24),
          height: Math.round(size * 1.24),
          background:
            'radial-gradient(circle, rgba(29,78,216,0.38) 0%, rgba(124,58,237,0.26) 44%, rgba(245,158,11,0.2) 66%, transparent 78%)',
        }}
        className="absolute rounded-full pointer-events-none blur-lg will-change-transform"
      />

      {/* Outer Orbiting Ring + Golden Campus Star Satellite */}
      <motion.svg
        width={outerSize}
        height={outerSize}
        viewBox="0 0 220 220"
        fill="none"
        animate={reduced ? { rotate: 0 } : { rotate: 360 }}
        transition={
          reduced
            ? { duration: 0 }
            : { duration: 11, repeat: Infinity, ease: 'linear' }
        }
        className="absolute inset-0 pointer-events-none will-change-transform"
      >
        <defs>
          <linearGradient id="el-stage-orbit" x1="0" y1="0" x2="220" y2="220" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.88" />
            <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <circle
          cx="110"
          cy="110"
          r="102"
          stroke="url(#el-stage-orbit)"
          strokeWidth="1.75"
          strokeDasharray="175 56"
          strokeLinecap="round"
        />
        <g transform="translate(110, 8)">
          <circle cx="0" cy="0" r="8" fill="#FEF08A" fillOpacity="0.32" />
          <polygon
            points="0,-6.2 1.8,-1.9 6.3,-1.4 2.8,1.6 3.9,6.1 0,3.7 -3.9,6.1 -2.8,1.6 -6.3,-1.4 -1.8,-1.9"
            fill="#F59E0B"
          />
        </g>
      </motion.svg>

      {/* Inner Counter-Rotating Precision Ring */}
      <motion.svg
        width={outerSize}
        height={outerSize}
        viewBox="0 0 220 220"
        fill="none"
        animate={reduced ? { rotate: 0 } : { rotate: -360 }}
        transition={
          reduced
            ? { duration: 0 }
            : { duration: 16, repeat: Infinity, ease: 'linear' }
        }
        className="absolute inset-0 pointer-events-none opacity-65 will-change-transform"
      >
        <circle
          cx="110"
          cy="110"
          r="91"
          stroke="currentColor"
          strokeOpacity="0.18"
          strokeWidth="1.25"
          strokeDasharray="6 9"
        />
      </motion.svg>

      {/* Multi-Part Choreographed Easy Learn Icon */}
      <motion.div
        initial={{ opacity: 1, scale: 0.96, y: 0 }}
        animate={
          reduced
            ? { opacity: 1, scale: 1, y: 0 }
            : { opacity: 1, scale: 1, y: [0, -5, 0] }
        }
        transition={
          reduced
            ? { duration: 0.15 }
            : {
                scale: { duration: 0.36, ease: [0.16, 1, 0.3, 1] },
                y: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
              }
        }
        className="relative z-10 will-change-transform"
      >
        <EasyLearnAnimatedIcon size={size} reduced={reduced} />
      </motion.div>
    </div>
  );
}

export function OpeningWelcomeSplash({
  studentName,
  appearanceMode,
  subjectCount,
  streakDays,
  muted = false,
}: {
  studentName?: string;
  appearanceMode: ThemeAppearanceMode;
  subjectCount?: number;
  streakDays?: number;
  muted?: boolean;
}) {
  const prefersReduced = Boolean(useReducedMotion());
  const [visible, setVisible] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return shouldShowOpeningWelcome(window.location.search, hasPlayedInSession());
  });

  const tiltRef = useRef<HTMLDivElement | null>(null);

  const copy = useMemo(
    () =>
      buildOpeningWelcomeCopy(studentName, new Date().getHours(), {
        subjectCount,
        streakDays,
      }),
    [streakDays, studentName, subjectCount]
  );

  const starfield = useMemo(() => generateWelcomeStarfield(16), []);

  const dismissSplash = useCallback(
    (withChime = false) => {
      if (withChime) {
        playWelcomeChord(muted);
      }
      markPlayedInSession();
      setVisible(false);
    },
    [muted]
  );

  useEffect(() => {
    if (!visible) return;
    markPlayedInSession();

    const durationMs = prefersReduced ? 650 : 2550;
    const timer = window.setTimeout(() => {
      setVisible(false);
    }, durationMs);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        e.preventDefault();
        playWelcomeChord(muted);
        setVisible(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [muted, prefersReduced, visible]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (prefersReduced || !tiltRef.current) return;
      const rect = e.currentTarget.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      const { rotateX, rotateY } = computeCrestParallaxTilt(normX, normY, 10);
      tiltRef.current.style.transform = `perspective(920px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    },
    [prefersReduced]
  );

  const handlePointerLeave = useCallback(() => {
    if (!tiltRef.current) return;
    tiltRef.current.style.transform = 'perspective(920px) rotateX(0deg) rotateY(0deg)';
  }, []);

  const isDark = appearanceMode === 'dark';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="easy-learn-opening-welcome"
          data-testid="easy-learn-opening-welcome"
          role="region"
          aria-label={`${copy.greeting}. ${copy.headline}`}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          initial={{ opacity: 1 }}
          exit={
            prefersReduced
              ? { opacity: 0, transition: { duration: 0.14 } }
              : {
                  opacity: 0,
                  scale: 1.028,
                  transition: { duration: 0.34, ease: [0.22, 1, 0.36, 1] },
                }
          }
          className={`fixed inset-0 z-[90] overflow-hidden flex flex-col items-center justify-center px-6 select-none ${
            isDark
              ? 'bg-[#090F1E] text-[#F8FAFC]'
              : 'bg-[#F4F7FD] text-[#0F172A]'
          }`}
        >
          {/* Architectural Studio Grid + Radial Sapphire-Gold Spotlight */}
          <div
            aria-hidden="true"
            style={{
              backgroundImage: isDark
                ? 'radial-gradient(circle at 50% 38%, rgba(37,99,235,0.22) 0%, rgba(109,40,217,0.14) 34%, transparent 68%), linear-gradient(rgba(148,163,184,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.055) 1px, transparent 1px)'
                : 'radial-gradient(circle at 50% 38%, rgba(29,78,216,0.13) 0%, rgba(124,58,237,0.08) 36%, transparent 68%), linear-gradient(rgba(15,23,42,0.038) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.038) 1px, transparent 1px)',
              backgroundSize: '100% 100%, 44px 44px, 44px 44px',
            }}
            className="absolute inset-0 pointer-events-none"
          />

          {/* Ambient Twinkling Constellation Motes */}
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
            {starfield.map((star) => (
              <motion.span
                key={star.id}
                initial={{ opacity: 0.2, scale: 0.85 }}
                animate={
                  prefersReduced
                    ? { opacity: 0.38, scale: 1 }
                    : { opacity: [0.18, 0.78, 0.18], scale: [0.85, 1.25, 0.85] }
                }
                transition={
                  prefersReduced
                    ? { duration: 0 }
                    : {
                        duration: star.durationSec,
                        delay: star.delaySec,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }
                }
                style={{
                  left: `${star.xPct}%`,
                  top: `${star.yPct}%`,
                  width: star.sizePx,
                  height: star.sizePx,
                }}
                className={`absolute rounded-full will-change-transform ${
                  star.isGold
                    ? 'bg-[#F59E0B]'
                    : isDark
                      ? 'bg-[#93C5FD]'
                      : 'bg-[#2563EB]/60'
                }`}
              />
            ))}
          </div>

          {/* Centerpiece Welcome Stage */}
          <div className="relative z-10 max-w-lg w-full flex flex-col items-center text-center gap-6">
            <div
              ref={tiltRef}
              style={{
                transform: 'perspective(920px) rotateX(0deg) rotateY(0deg)',
                transition: 'transform 160ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="will-change-transform"
            >
              <AnimatedEasyLearnCrest size={160} reduced={prefersReduced} />
            </div>

            <motion.div
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0.92, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-2"
            >
              <span
                className={`text-[13.5px] font-bold tracking-tight ${
                  isDark ? 'text-[#60A5FA]' : 'text-[#1D4ED8]'
                }`}
              >
                {copy.greeting}
              </span>
              <h1 className="font-[var(--display)] font-extrabold text-[28px] sm:text-[36px] leading-[1.12] tracking-tight text-balance">
                {copy.headline}
              </h1>
              <p
                className={`text-[14.5px] font-medium max-w-[44ch] leading-snug ${
                  isDark ? 'text-[#CBD5E1]' : 'text-[#475569]'
                }`}
              >
                {copy.subline}
              </p>

              {/* Clean Unboxed Readiness Metadata Strip (Zero-Pill Discipline) */}
              <div
                className={`pt-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[12.5px] font-semibold ${
                  isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'
                }`}
              >
                {copy.readinessItems.map((item, idx) => (
                  <React.Fragment key={item}>
                    {idx > 0 && <span aria-hidden="true">·</span>}
                    <span>{item}</span>
                  </React.Fragment>
                ))}
              </div>
            </motion.div>

            {/* GPU Progress Beam + Single Primary Enter Action */}
            <div className="w-full max-w-[260px] flex flex-col items-center gap-4">
              <div
                aria-hidden="true"
                className={`w-full h-1.5 rounded-full overflow-hidden ${
                  isDark ? 'bg-slate-800/90' : 'bg-slate-200'
                }`}
              >
                <motion.div
                  initial={{ scaleX: 0.14 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    duration: prefersReduced ? 0.45 : 2.25,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{ transformOrigin: 'left center' }}
                  className="w-full h-full rounded-full bg-gradient-to-r from-[#1D4ED8] via-[#6366F1] to-[#F59E0B] will-change-transform"
                />
              </div>

              <button
                type="button"
                data-testid="enter-easy-learn-btn"
                onClick={() => dismissSplash(true)}
                className="min-h-[42px] px-6 py-2 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-[var(--display)] font-bold text-[14px] shadow-[0_10px_24px_-8px_rgba(29,78,216,0.55)] inline-flex items-center gap-2 cursor-pointer transition-transform duration-150 active:scale-[0.98] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B82F6]"
              >
                <span>{copy.ctaLabel}</span>
                <Icon name="go" size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
