import React, { useEffect, useId, useLayoutEffect, useRef } from 'react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion, type Variants } from 'motion/react';
import type { ScreenName, SubjectId, UserProgress } from '../types';
import type { BadgeDef } from '../utils/engine';
import { SUBJECT_INFO, tstate } from '../utils/engine';
import { getChemClassMeta } from '../data/chemNerdc2027';
import { getMathClassMeta } from '../data/mathNerdc2027';
import { getFMathClassMeta } from '../data/fmathNerdc2027';
import { getPhysClassMeta } from '../data/physNerdc2027';
import { getBioClassMeta } from '../data/bioNerdc2027';
import { getAgricClassMeta } from '../data/agricNerdc2027';
import { getGeogClassMeta } from '../data/geogNerdc2027';
import { getEconClassMeta } from '../data/econNerdc2027';
import { getEngClassMeta } from '../data/engNerdc2027';
import { getCivicClassMeta } from '../data/civicNerdc2027';
import { getDigiTechClassMeta } from '../data/digitechNerdc2027';
import { getDataProcClassMeta } from '../data/dataprocNerdc2027';
import { getTopicsForProgress, SUBJECT_IDS } from '../data/curriculum';
import type { ScreenTransitionSpec } from '../utils/screenTransitionLogic';
import { CrestSvg, Icon } from './Icons';
import { FxCelebration, type XpBurstItem } from './FxCelebration';
import { WatCompactStrip } from './WatClock';
import {
  FLUID_SCREEN_EXIT,
  FLUID_SCREEN_SPRING,
  LIQUID_CAPSULE_SPRING,
  SmoothProgressBar,
  usePostMountLayoutGate,
} from './ULessonMotion';

interface StageCustomPayload {
  spec: ScreenTransitionSpec;
  exitScrollY: number;
  reduced: boolean;
}

const SCREEN_STAGE_VARIANTS: Variants = {
  initial: (custom: StageCustomPayload) => {
    if (custom?.reduced) {
      return { opacity: 0 };
    }
    const spec = custom?.spec ?? { kind: 'fade', direction: 0 };
    const dir = spec.direction || 1;
    if (spec.kind === 'tab') {
      return { opacity: 0, x: dir * 28, y: 0, scale: 0.994 };
    }
    if (spec.kind === 'push') {
      return { opacity: 0, x: 34, y: 0, scale: 0.988 };
    }
    if (spec.kind === 'pop') {
      return { opacity: 0, x: -28, y: 0, scale: 0.992 };
    }
    return { opacity: 0, x: 0, y: 8, scale: 0.994 };
  },
  animate: (custom: StageCustomPayload) => ({
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: custom?.reduced ? { duration: 0.01 } : FLUID_SCREEN_SPRING,
  }),
  exit: (custom: StageCustomPayload) => {
    if (custom?.reduced) {
      return { opacity: 0, pointerEvents: 'none', transition: { duration: 0.01 } };
    }
    const spec = custom?.spec ?? { kind: 'fade', direction: 0 };
    const dir = spec.direction || 1;
    const exitX =
      spec.kind === 'tab'
        ? -dir * 22
        : spec.kind === 'push'
          ? -22
          : spec.kind === 'pop'
            ? 26
            : 0;
    const frozenY = -Math.max(0, Math.round(custom?.exitScrollY ?? 0));
    return {
      opacity: 0,
      x: exitX,
      y: frozenY,
      scale: 0.992,
      pointerEvents: 'none',
      transition: {
        ...FLUID_SCREEN_EXIT,
        y: { duration: 0 },
      },
    };
  },
};

export type MainTab = 'home' | 'subjects' | 'topics' | 'formulas' | 'more';

export function activeTabForScreen(scr: ScreenName): MainTab {
  if (scr === 'subjs') return 'subjects';
  if (scr === 'formulas') return 'formulas';
  if (scr === 'topics' || scr === 'topic' || scr === 'notes' || scr === 'lab' || scr === 'labrun') return 'topics';
  if (scr === 'more') return 'more';
  return 'home';
}

export function SubjectSwitcher({
  progress,
  onSelectSubject,
  onManageSubjects,
}: {
  progress: UserProgress;
  onSelectSubject: (s: SubjectId) => void;
  onManageSubjects: () => void;
}) {
  const uid = useId();
  const prefersReduced = useReducedMotion();
  const layoutReady = usePostMountLayoutGate();
  const capsuleTransition = prefersReduced ? { duration: 0 } : LIQUID_CAPSULE_SPRING;
  const subs = progress.subjs.length ? progress.subjs : (['maths'] as SubjectId[]);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div
        role="group"
        aria-label="Choose subject"
        className="grid grid-cols-2 min-[520px]:grid-cols-4 md:grid-cols-6 gap-1.5 w-full select-none"
      >
        {subs.map((sid) => {
          const active = progress.subj === sid;
          return (
            <button
              key={sid}
              type="button"
              onClick={() => onSelectSubject(sid)}
              aria-pressed={active}
              className={`relative min-h-[38px] px-2.5 rounded-xl font-semibold text-[12.5px] sm:text-[13px] flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap border transition-[color,border-color,transform] duration-150 active:scale-[0.97] ${
                active
                  ? 'text-[var(--on-acc)] border-[var(--gold)]'
                  : 'bg-[var(--card)] text-[var(--dim)] border-[var(--line)] hover:border-[var(--acc-line)] hover:text-[var(--ink)]'
              }`}
            >
              {active && (
                <motion.span
                  layoutId={layoutReady ? `subj-switcher-capsule-${uid}` : undefined}
                  aria-hidden="true"
                  transition={capsuleTransition}
                  className="pointer-events-none absolute inset-0 rounded-[11px] bg-[var(--gold)] shadow-xs"
                />
              )}
              <span className="relative z-10 inline-flex items-center gap-1.5 min-w-0">
                <Icon name={SUBJECT_INFO[sid].icon} size={14} className="shrink-0" />
                <span className="truncate">{SUBJECT_INFO[sid].short}</span>
              </span>
            </button>
          );
        })}
        {subs.length < SUBJECT_IDS.length && (
          <button
            type="button"
            onClick={onManageSubjects}
            aria-label="Manage subjects"
            className="min-h-[40px] px-2.5 rounded-xl text-[12.5px] font-bold bg-[var(--bg)] text-[var(--gold)] border border-dashed border-[var(--acc-line)] hover:bg-[var(--acc-soft)] flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors"
          >
            <Icon name="plus" size={14} />
            <span>Subjects</span>
          </button>
        )}
      </div>
    </div>
  );
}

export function AppShell({
  screen,
  progress,
  dueCount,
  showNav,
  badgeToast,
  xpBursts = [],
  confettiKey = 0,
  screenTransition = { kind: 'fade', direction: 0 },
  onDismissToast,
  onNavigateTab,
  onSelectSubject,
  onManageSubjects,
  onSignOut,
  children,
}: {
  screen: ScreenName;
  progress: UserProgress;
  dueCount: number;
  showNav: boolean;
  badgeToast: BadgeDef | null;
  xpBursts?: XpBurstItem[];
  confettiKey?: number;
  screenTransition?: ScreenTransitionSpec;
  onDismissToast: () => void;
  onNavigateTab: (tab: MainTab) => void;
  onSelectSubject: (s: SubjectId) => void;
  onManageSubjects: () => void;
  onSignOut?: () => void;
  children: React.ReactNode;
}) {
  const prefersReduced = Boolean(useReducedMotion());
  const capsuleTransition = prefersReduced ? { duration: 0 } : LIQUID_CAPSULE_SPRING;
  const activeTab = activeTabForScreen(screen);

  // Track live scroll offset so exiting tabs stay visually frozen in place while the incoming
  // tab starts cleanly at scrollY === 0 with zero mid-scroll chopped headers.
  const lastScrollYRef = useRef<number>(typeof window !== 'undefined' ? window.scrollY : 0);
  const scrollFreezeRef = useRef<{ screen: ScreenName; exitScrollY: number }>({
    screen,
    exitScrollY: 0,
  });

  if (scrollFreezeRef.current.screen !== screen) {
    scrollFreezeRef.current = {
      screen,
      exitScrollY: lastScrollYRef.current,
    };
  }

  useEffect(() => {
    const onScroll = () => {
      lastScrollYRef.current = window.scrollY || 0;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useLayoutEffect(() => {
    lastScrollYRef.current = 0;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [screen]);

  const stageCustom: StageCustomPayload = {
    spec: screenTransition,
    exitScrollY: scrollFreezeRef.current.exitScrollY,
    reduced: prefersReduced,
  };
  const topics = getTopicsForProgress(progress);
  const passedCount = topics.filter((t) => tstate(progress, t.id).boss).length;
  const activeClassId =
    progress.subj === 'fmaths'
      ? progress.fmathClass
      : progress.subj === 'chem'
        ? progress.chemClass
        : progress.subj === 'phys'
          ? progress.physClass
          : progress.subj === 'bio'
            ? progress.bioClass
            : progress.subj === 'agric'
              ? progress.agricClass
              : progress.subj === 'geog'
                ? progress.geogClass
                : progress.subj === 'econ'
                  ? progress.econClass
                  : progress.subj === 'eng'
                    ? progress.engClass
                    : progress.subj === 'civic'
                      ? progress.civicClass
                      : progress.subj === 'digitech'
                        ? progress.digitechClass
                        : progress.subj === 'dataproc'
                          ? progress.dataprocClass
                          : progress.mathClass;
  const activeClassLabel =
    activeClassId && activeClassId !== 'all'
      ? `${
          (progress.subj === 'fmaths'
            ? getFMathClassMeta(activeClassId)
            : progress.subj === 'chem'
              ? getChemClassMeta(activeClassId)
              : progress.subj === 'phys'
                ? getPhysClassMeta(activeClassId)
                : progress.subj === 'bio'
                  ? getBioClassMeta(activeClassId)
                  : progress.subj === 'agric'
                    ? getAgricClassMeta(activeClassId)
                    : progress.subj === 'geog'
                      ? getGeogClassMeta(activeClassId)
                      : progress.subj === 'econ'
                        ? getEconClassMeta(activeClassId)
                        : progress.subj === 'eng'
                          ? getEngClassMeta(activeClassId)
                          : progress.subj === 'civic'
                            ? getCivicClassMeta(activeClassId)
                            : progress.subj === 'digitech'
                              ? getDigiTechClassMeta(activeClassId)
                              : progress.subj === 'dataproc'
                                ? getDataProcClassMeta(activeClassId)
                                : getMathClassMeta(activeClassId)
          ).shortLabel
        } `
      : '';
  const hasFormulaStudio =
    progress.subj !== 'bio' && progress.subj !== 'agric' && progress.subj !== 'civic';

  const navItems: { id: MainTab; label: string; icon: string; badge?: number }[] = [
    { id: 'home', label: 'Home', icon: 'home' },
    {
      id: 'subjects',
      label: 'Subjects',
      icon: 'grid',
      badge: dueCount > 0 ? dueCount : undefined,
    },
    { id: 'topics', label: 'Topics', icon: 'map' },
    ...(hasFormulaStudio
      ? [
          {
            id: 'formulas' as const,
            label: progress.subj === 'eng' ? 'Rules' : 'Formulas',
            icon: progress.subj === 'eng' ? 'book' : 'sigma',
          },
        ]
      : []),
    { id: 'more', label: 'Settings', icon: 'settings' },
  ];

  const isStudyWorkbench =
    screen === 'lesson' ||
    screen === 'quiz' ||
    screen === 'boss' ||
    screen === 'labrun';

  return (
    <div className="min-h-screen flex flex-col min-[980px]:flex-row bg-[var(--bg)] text-[var(--ink)]">
      {showNav && (
        <aside
          aria-label="Primary navigation"
          className="hidden min-[980px]:flex min-[980px]:flex-col min-[980px]:w-[264px] min-[980px]:shrink-0 min-[980px]:sticky min-[980px]:top-0 min-[980px]:h-screen bg-[var(--card)] border-r border-[var(--line)] px-4 py-5 justify-between z-20 overflow-y-auto"
        >
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3 px-1">
              <CrestSvg size={38} />
              <div className="flex flex-col min-w-0">
                <span className="font-[var(--display)] font-extrabold text-[18px] leading-tight tracking-[0.04em] text-[var(--ink)] whitespace-nowrap">
                  EYAK
                </span>
                <span className="text-[11.5px] font-medium text-[var(--dim)] whitespace-nowrap">
                  National Learning Studio
                </span>
              </div>
            </div>

            <nav className="flex flex-col gap-1" aria-label="Main sections">
              {navItems.map((item) => {
                const isAct = activeTab === item.id;
                return (
                  <motion.button
                    key={item.id}
                    layout="position"
                    transition={capsuleTransition}
                    whileTap={prefersReduced ? undefined : { scale: 0.985 }}
                    type="button"
                    onClick={() => onNavigateTab(item.id)}
                    aria-current={isAct ? 'page' : undefined}
                    className={`group relative min-h-[40px] px-3 rounded-xl font-semibold text-[14px] flex items-center justify-between transition-colors duration-150 cursor-pointer whitespace-nowrap ${
                      isAct
                        ? 'text-[var(--gold)] font-bold'
                        : 'text-[var(--dim)] hover:text-[var(--ink)] hover:bg-[var(--bg)]/70'
                    }`}
                  >
                    {isAct && (
                      <motion.span
                        layoutId="desktop-nav-capsule"
                        aria-hidden="true"
                        transition={capsuleTransition}
                        className="pointer-events-none absolute inset-0 rounded-xl bg-[var(--acc-soft)]"
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2.5">
                      <Icon
                        name={item.icon}
                        size={17}
                        className={`transition-transform duration-150 ${
                          isAct ? 'text-[var(--gold)]' : 'opacity-80 group-hover:opacity-100'
                        }`}
                      />
                      <span>{item.label}</span>
                    </span>
                    {item.badge !== undefined && (
                      <span className="relative z-10 min-w-[20px] h-5 px-1.5 rounded-md bg-[var(--coral)] text-white text-[11px] font-bold flex items-center justify-center tabular-nums">
                        {item.badge}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </nav>
          </div>

          <div className="pt-4 border-t border-[var(--line)] flex flex-col gap-3 px-1">
            <div className="flex items-center justify-between gap-2 text-[13px]">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  aria-hidden="true"
                  className="w-7 h-7 rounded-lg bg-[var(--acc-soft)] text-[var(--gold)] font-[var(--display)] font-extrabold text-[12.5px] flex items-center justify-center shrink-0"
                >
                  {(progress.name || 'S').slice(0, 1).toUpperCase()}
                </span>
                <span className="font-bold text-[var(--ink)] truncate">{progress.name || 'Scholar'}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="inline-flex items-center gap-1 text-[12px] font-bold text-[var(--coral-ink)] tabular-nums">
                  <Icon name="flame" size={13} className={progress.streak.n > 0 ? 'anim-flicker' : ''} />
                  {progress.streak.n}d
                </span>
                {onSignOut && (
                  <button
                    type="button"
                    onClick={onSignOut}
                    aria-label="Sign out to scholar portal"
                    title="Sign out"
                    className="p-1.5 rounded-lg text-[var(--dim)] hover:text-[var(--ink)] hover:bg-[var(--bg)] transition cursor-pointer"
                  >
                    <Icon name="logout" size={14} />
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5 pt-2.5 border-t border-[var(--line)]">
              <div className="flex items-center justify-between text-[11.5px] font-semibold text-[var(--dim)]">
                <span className="truncate">
                  {activeClassLabel}{SUBJECT_INFO[progress.subj].short} mastery
                </span>
                <span className="tabular-nums font-bold text-[var(--ink)] shrink-0">
                  {passedCount}/{topics.length}
                </span>
              </div>
              <SmoothProgressBar
                value={passedCount}
                max={Math.max(1, topics.length)}
                tone="emerald"
                heightClass="h-1.5"
                trackClass="bg-[var(--deep)]"
              />
            </div>
          </div>
        </aside>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <FxCelebration bursts={xpBursts} confettiKey={confettiKey} />
        {badgeToast && (
          <div className="fixed bottom-20 min-[980px]:bottom-6 right-4 z-50 max-w-sm rounded-2xl bg-[var(--crest-bg)] text-white p-4 shadow-xl border border-white/15 flex items-center gap-3 anim-toast-in">
            <div className="w-10 h-10 rounded-xl bg-[var(--hero-badge)] text-[#141C33] flex items-center justify-center shrink-0">
              <Icon name={badgeToast.icon} size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11.5px] font-bold text-[var(--hero-badge)]">
                Milestone unlocked
              </div>
              <div className="font-[var(--display)] font-bold text-[15px]">{badgeToast.name}</div>
              <div className="text-[12px] text-white/80">{badgeToast.desc}</div>
            </div>
            <button
              type="button"
              onClick={onDismissToast}
              aria-label="Dismiss badge notification"
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 cursor-pointer"
            >
              <Icon name="x" size={16} />
            </button>
          </div>
        )}

        <main
          className={`flex-1 w-full mx-auto px-4 sm:px-6 ${
            isStudyWorkbench
              ? 'max-w-[1160px] pt-4 pb-24'
              : showNav
                ? 'max-w-[1060px] pt-5 pb-32 min-[980px]:pt-7 min-[980px]:pb-24'
                : 'max-w-[960px] py-4'
          }`}
        >
          <div className="rtc-screen-stage">
            <AnimatePresence initial={false} mode="popLayout" custom={stageCustom}>
              <motion.div
                key={screen}
                custom={stageCustom}
                variants={SCREEN_STAGE_VARIANTS}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full will-change-transform"
              >
                <LayoutGroup id={`rtc-stage-${screen}`}>{children}</LayoutGroup>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {showNav && !isStudyWorkbench && (
        <nav
          aria-label="Mobile navigation"
          className="min-[980px]:hidden fixed bottom-0 inset-x-0 z-30 bg-[var(--card)]/96 backdrop-blur-md border-t border-[var(--line)] px-2 pt-1.5 pb-[max(0.4rem,env(safe-area-inset-bottom))]"
        >
          <div
            className={`mx-auto max-w-[480px] h-[52px] grid items-center gap-1 ${
              navItems.length === 5 ? 'grid-cols-5' : 'grid-cols-4'
            }`}
          >
            {navItems.map((item) => {
              const isAct = activeTab === item.id;
              return (
                <motion.button
                  key={item.id}
                  layout="position"
                  transition={capsuleTransition}
                  whileTap={prefersReduced ? undefined : { scale: 0.94 }}
                  type="button"
                  onClick={() => onNavigateTab(item.id)}
                  aria-current={isAct ? 'page' : undefined}
                  className={`relative h-[46px] rounded-xl flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold transition-colors duration-150 cursor-pointer whitespace-nowrap ${
                    isAct ? 'text-[var(--gold)] font-bold' : 'text-[var(--dim)]'
                  }`}
                >
                  {isAct && (
                    <motion.span
                      layoutId="mobile-nav-capsule"
                      aria-hidden="true"
                      transition={capsuleTransition}
                      className="pointer-events-none absolute inset-0 rounded-xl bg-[var(--acc-soft)]"
                    />
                  )}
                  <span
                    className={`relative z-10 flex flex-col items-center justify-center gap-0.5 transition-transform duration-200 ${
                      isAct ? '-translate-y-[1px]' : ''
                    }`}
                  >
                    <Icon
                      name={item.icon}
                      size={18}
                      className={`transition-transform duration-200 ${isAct ? 'scale-105' : ''}`}
                    />
                    <span>{item.label}</span>
                  </span>
                  {item.badge !== undefined && (
                    <span className="absolute top-0.5 right-2 z-20 min-w-[18px] h-[18px] px-1 rounded-md bg-[var(--coral)] text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}

export function SubscreenTopBar({
  title,
  subtitle,
  onBack,
  right,
}: {
  title: string;
  subtitle?: string;
  onBack: () => void;
  right?: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 h-14 bg-[var(--bg)]/92 backdrop-blur-md border-b border-[var(--line)] flex items-center justify-between gap-2.5 sm:gap-3 mb-4">
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          className="w-9 h-9 rounded-xl bg-[var(--card)] border border-[var(--line)] shadow-xs flex items-center justify-center text-[var(--ink)] hover:border-[var(--acc-line)] hover:bg-[var(--row-alt)] shrink-0 cursor-pointer transition-colors"
        >
          <Icon name="back" size={18} />
        </button>
        <div className="min-w-0 flex-1">
          {subtitle && (
            <div className="text-[11px] sm:text-[11.5px] font-semibold text-[var(--gold)] truncate">
              {subtitle}
            </div>
          )}
          <h1 className="font-[var(--display)] font-bold text-[15.5px] sm:text-[16.5px] leading-tight text-[var(--ink)] truncate">
            {title}
          </h1>
        </div>
      </div>
      <div className="shrink-0 flex items-center gap-3">
        <div className="hidden lg:flex items-center">
          <WatCompactStrip surface="inline" />
        </div>
        {right && <div className="flex items-center gap-2">{right}</div>}
      </div>
    </header>
  );
}

export function SplitWorkbench({
  hasRightPane,
  left,
  right,
  footer,
}: {
  hasRightPane: boolean;
  left: React.ReactNode;
  right?: React.ReactNode;
  footer?: React.ReactNode;
}) {
  if (!hasRightPane) {
    return (
      <div className="w-full max-w-[680px] mx-auto flex flex-col gap-5">
        <div>{left}</div>
        {footer && <div>{footer}</div>}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 min-[980px]:grid-cols-12 gap-6 items-start">
      <div className="min-[980px]:col-span-6 flex flex-col gap-5 min-w-0">
        {left}
        {footer && <div className="min-[980px]:sticky min-[980px]:bottom-4">{footer}</div>}
      </div>
      <div className="hidden min-[980px]:block min-[980px]:col-span-6 min-[980px]:sticky min-[980px]:top-20 min-w-0">
        {right}
      </div>
    </div>
  );
}
