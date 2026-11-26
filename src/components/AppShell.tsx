import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion, type Variants } from 'motion/react';
import type { ScreenName, SubjectId, UserProgress } from '../types';
import type { BadgeDef } from '../utils/engine';
import { SUBJECT_INFO, computeTopicsProgressPct } from '../utils/engine';
import { getVisibleEnrolledSubjects, resolveExamTrack } from '../utils/examTrackLogic';
import { SUBJECT_STUDIO_META } from '../utils/subjectStudioMeta';
import { getTopicsForProgress, SUBJECT_IDS } from '../data/curriculum';
import type { ScreenTransitionSpec } from '../utils/screenTransitionLogic';
import { CrestSvg, Icon } from './Icons';
import { ElementalEmblem } from './ElementalRankVisuals';
import { FxCelebration, type XpBurstItem } from './FxCelebration';
import {
  FLUID_SCREEN_EXIT,
  FLUID_SCREEN_SPRING,
  LIQUID_CAPSULE_SPRING,
  LiquidCapsuleBar,
  SmoothProgressBar,
} from './ULessonMotion';
import { useEntitlement } from '../context/EntitlementContext';
import { PWAInstallButton } from './PWAInstallBanner';
import { usePWAInstall } from '../utils/usePWAInstall';

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
      return { opacity: 0, x: dir * 28, y: 0 };
    }
    if (spec.kind === 'push') {
      return { opacity: 0, x: 32, y: 0 };
    }
    if (spec.kind === 'pop') {
      return { opacity: 0, x: -32, y: 0 };
    }
    return { opacity: 0, x: 0, y: 0 };
  },
  animate: (custom: StageCustomPayload) => ({
    opacity: 1,
    x: 0,
    y: 0,
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
          ? -24
          : spec.kind === 'pop'
            ? 24
            : 0;
    const frozenY = -Math.max(0, Math.round(custom?.exitScrollY ?? 0));
    return {
      opacity: 0,
      x: exitX,
      y: frozenY,
      pointerEvents: 'none',
      transition: {
        ...FLUID_SCREEN_EXIT,
        y: { duration: 0 },
      },
    };
  },
};

export type MainTab = 'home' | 'worlds' | 'subjects' | 'topics' | 'cbt' | 'more';

export function activeTabForScreen(scr: ScreenName): MainTab {
  if (scr === 'universe') return 'worlds';
  if (scr === 'subjs' || scr === 'studio' || scr === 'novels' || scr === 'lab' || scr === 'labrun') return 'worlds';
  if (scr === 'cbt') return 'cbt';
  if (
    scr === 'topics' ||
    scr === 'topic' ||
    scr === 'notes' ||
    scr === 'formulas'
  ) {
    return 'topics';
  }
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
  const examTrack = resolveExamTrack(progress);
  const subs = getVisibleEnrolledSubjects(progress);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <LiquidCapsuleBar
        roleType="group"
        ariaLabel="Choose subject"
        layoutMode="grid"
        gridClassName={
          examTrack === 'jamb'
            ? 'grid-cols-2 min-[520px]:grid-cols-4 gap-2'
            : 'grid-cols-2 min-[520px]:grid-cols-4 md:grid-cols-6 gap-2'
        }
        size="md"
        items={subs.map((sid) => ({
          id: sid,
          label: SUBJECT_INFO[sid].short,
          icon: SUBJECT_INFO[sid].icon,
        }))}
        value={subs.includes(progress.subj) ? progress.subj : subs[0]}
        onChange={onSelectSubject}
        trailingSlot={
          examTrack !== 'jamb' && subs.length < SUBJECT_IDS.length ? (
            <button
              type="button"
              onClick={onManageSubjects}
              aria-label="Choose more subjects"
              className="w-full min-h-[38px] px-3 rounded-xl text-[12.5px] font-bold bg-[var(--acc-soft)] text-[var(--gold)] border border-[var(--acc-line)] hover:bg-[var(--card)] flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap transition-[background-color,transform] duration-150 active:translate-y-[1px]"
            >
              <Icon name="plus" size={13} />
              <span>Subjects</span>
            </button>
          ) : undefined
        }
      />
    </div>
  );
}

export function AppShell({
  screen,
  progress,
  dueCount,
  showNav,
  isExamHall = false,
  badgeToast,
  xpBursts = [],
  confettiKey = 0,
  screenTransition = { kind: 'fade', direction: 0 },
  onDismissToast,
  onNavigateTab,
  onOpenStudio,
  onOpenLab,
  onOpenWebsite,
  onSignOut,
  children,
}: {
  screen: ScreenName;
  progress: UserProgress;
  dueCount: number;
  showNav: boolean;
  isExamHall?: boolean;
  badgeToast: BadgeDef | null;
  xpBursts?: XpBurstItem[];
  confettiKey?: number;
  screenTransition?: ScreenTransitionSpec;
  onDismissToast: () => void;
  onNavigateTab: (tab: MainTab) => void;
  onSelectSubject?: (s: SubjectId) => void;
  onManageSubjects?: () => void;
  onOpenStudio?: () => void;
  onOpenLab?: () => void;
  onOpenWebsite?: () => void;
  onSignOut?: () => void;
  children: React.ReactNode;
}) {
  const prefersReduced = Boolean(useReducedMotion());
  const capsuleTransition = prefersReduced ? { duration: 0 } : LIQUID_CAPSULE_SPRING;
  const activeTab = activeTabForScreen(screen);
  useEntitlement();

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
  const subjectPct = computeTopicsProgressPct(progress, topics);
  const { isInstalled } = usePWAInstall();

  const navItems: { id: MainTab; label: string; icon: string; badge?: number }[] = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'worlds', label: 'Worlds', icon: 'compass' },
    {
      id: 'topics',
      label: 'Topics',
      icon: 'map',
      badge: dueCount > 0 ? dueCount : undefined,
    },
    { id: 'cbt', label: 'Exam Arena', icon: 'clock' },
    { id: 'more', label: 'Settings', icon: 'settings' },
  ];

  const activeStudioMeta = SUBJECT_STUDIO_META[progress.subj];
  const hasSubjectLab =
    progress.subj === 'maths' ||
    progress.subj === 'chem' ||
    progress.subj === 'phys' ||
    progress.subj === 'bio' ||
    progress.subj === 'agric';
  const showCompanionNav = Boolean((activeStudioMeta && onOpenStudio) || (hasSubjectLab && onOpenLab));
  const isCompanionScreen = screen === 'studio' || screen === 'lab' || screen === 'labrun';

  const isStudyWorkbench =
    screen === 'lesson' ||
    screen === 'quiz' ||
    screen === 'boss' ||
    screen === 'labrun';

  const effectiveShowNav = showNav && !isExamHall;

  return (
    <div className="min-h-screen flex flex-col min-[980px]:flex-row bg-[var(--bg)] text-[var(--ink)]">
      {effectiveShowNav && (
        <aside
          aria-label="Primary navigation"
          className="hidden min-[980px]:flex min-[980px]:flex-col min-[980px]:w-[260px] min-[980px]:shrink-0 min-[980px]:sticky min-[980px]:top-0 min-[980px]:h-screen bg-[var(--card)] border-r-2 border-[var(--line)] px-4 py-5 justify-between z-20 overflow-y-auto"
        >
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3 px-1 pb-4 border-b-2 border-[var(--line)]">
              <CrestSvg size={38} />
              <span className="font-[var(--display)] font-extrabold text-[21px] leading-tight text-[var(--ink)] whitespace-nowrap">
                Easy Learn
              </span>
            </div>

            <LiquidCapsuleBar
              roleType="nav"
              orientation="vertical"
              size="nav-desktop"
              ariaLabel="Main sections"
              items={navItems}
              value={showCompanionNav && isCompanionScreen ? null : activeTab}
              onChange={onNavigateTab}
            />

            {showCompanionNav && (
              <div className="pt-3 border-t border-[var(--line)] flex flex-col gap-1.5">
                <span className="px-2 text-[11.5px] font-bold text-[var(--dim)]">
                  {SUBJECT_INFO[progress.subj].short} companion
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (activeStudioMeta && onOpenStudio) onOpenStudio();
                    else if (onOpenLab) onOpenLab();
                  }}
                  aria-current={isCompanionScreen ? 'page' : undefined}
                  className={`group relative min-h-[44px] px-4 rounded-full font-[var(--display)] font-semibold text-[13.5px] flex items-center gap-2.5 transition-[color,background-color,transform] duration-150 active:translate-y-[1px] cursor-pointer text-left ${
                    isCompanionScreen
                      ? 'text-[var(--gold)] font-bold'
                      : 'text-[var(--ink)] bg-[var(--acc-soft)]/55 border border-[var(--acc-line)] hover:bg-[var(--acc-soft)]'
                  }`}
                >
                  {isCompanionScreen && (
                    <motion.span
                      layoutId="desktop-nav-capsule"
                      aria-hidden="true"
                      transition={capsuleTransition}
                      className="ul-liquid-lens pointer-events-none absolute inset-0 rounded-full"
                    />
                  )}
                  <Icon
                    name={activeStudioMeta ? activeStudioMeta.icon : 'flask'}
                    size={17}
                    className="relative z-10 shrink-0 text-[var(--gold)]"
                  />
                  <span className="relative z-10 truncate">
                    {activeStudioMeta
                      ? activeStudioMeta.title
                      : `${SUBJECT_INFO[progress.subj].short} labs`}
                  </span>
                </button>
              </div>
            )}
          </div>

          <div className="pt-4 border-t-2 border-[var(--line)] flex flex-col gap-3.5 px-1">
            <div className="flex items-center justify-between gap-2 text-[13.5px]">
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  aria-hidden="true"
                  className="w-8 h-8 rounded-[12px] bg-[var(--acc-soft)] text-[var(--gold)] font-[var(--display)] font-bold text-[14px] flex items-center justify-center shrink-0"
                >
                  {(progress.name || 'S').slice(0, 1).toUpperCase()}
                </span>
                <span className="font-bold text-[var(--ink)] truncate">
                  {progress.name || 'Student'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="inline-flex items-center gap-1 text-[12.5px] font-bold text-[var(--peach-ink)] bg-[var(--peach-bg)] px-2 py-0.5 rounded-full tabular-nums">
                  <Icon name="flame" size={13} />
                  {progress.streak.n}d
                </span>
                {onSignOut && (
                  <button
                    type="button"
                    onClick={onSignOut}
                    aria-label="Sign out"
                    title="Sign out"
                    className="p-1.5 rounded-[12px] text-[var(--dim)] hover:text-[var(--ink)] hover:bg-[var(--bg)] transition-colors duration-150 cursor-pointer"
                  >
                    <Icon name="logout" size={15} />
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5 pt-3 border-t border-[var(--line)]">
              <div className="flex items-center justify-between text-[12px] font-bold text-[var(--dim)]">
                <span className="truncate">{SUBJECT_INFO[progress.subj].short} progress</span>
                <span className="tabular-nums font-bold text-[var(--ink)] shrink-0">
                  {subjectPct}%
                </span>
              </div>
              <SmoothProgressBar
                value={subjectPct}
                max={100}
                tone="emerald"
                heightClass="h-2.5"
                trackClass="bg-[var(--bg-out)]"
              />
            </div>

            <PWAInstallButton compact label="Install offline app" />

            {onOpenWebsite && !isInstalled && (
              <button
                type="button"
                onClick={onOpenWebsite}
                className="min-h-[36px] px-3 py-1.5 rounded-xl bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--acc-line)] text-[12.5px] font-bold text-[var(--dim)] hover:text-[var(--ink)] flex items-center justify-between gap-2 transition-colors cursor-pointer whitespace-nowrap"
              >
                <span className="inline-flex items-center gap-2">
                  <Icon name="globe" size={14} className="text-[var(--gold)]" />
                  <span>Public website</span>
                </span>
                <Icon name="go" size={14} />
              </button>
            )}
          </div>
        </aside>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <FxCelebration bursts={xpBursts} confettiKey={confettiKey} />
        {badgeToast && (
          <div className="fixed bottom-24 min-[980px]:bottom-6 right-4 z-50 max-w-sm rounded-[22px] bg-[var(--card)] text-[var(--ink)] p-3.5 border border-[var(--acc-line)] shadow-lg flex items-center gap-3 anim-toast-in">
            {badgeToast.elementId ? (
              <ElementalEmblem rankId={badgeToast.elementId} unlocked size={44} />
            ) : (
              <div className="w-11 h-11 rounded-[16px] bg-[var(--acc-soft)] text-[var(--gold)] flex items-center justify-center shrink-0">
                <Icon name={badgeToast.icon} size={22} />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-[11.5px] font-bold text-[var(--gold)]">Rank unlocked</div>
              <div className="font-[var(--display)] font-extrabold text-[15.5px] leading-snug">
                {badgeToast.name}
              </div>
            </div>
            <button
              type="button"
              onClick={onDismissToast}
              aria-label="Close milestone message"
              className="p-1.5 rounded-[12px] text-[var(--dim)] hover:text-[var(--ink)] hover:bg-[var(--bg)] cursor-pointer"
            >
              <Icon name="x" size={16} />
            </button>
          </div>
        )}

        <main
          className={`flex-1 w-full mx-auto ${
            isExamHall || screen === 'landing'
              ? 'max-w-none p-0'
              : isStudyWorkbench
                ? 'max-w-[1120px] px-4 sm:px-6 min-[1200px]:px-8 pt-4 pb-24'
                : effectiveShowNav
                  ? 'max-w-[1080px] px-4 sm:px-6 min-[1200px]:px-8 pt-4 pb-32 min-[980px]:pt-7 min-[980px]:pb-24'
                  : 'max-w-[980px] px-4 sm:px-6 py-4'
          }`}
        >
          {effectiveShowNav && !isStudyWorkbench && (
            <div className="min-[980px]:hidden flex items-center justify-between gap-2 pb-2.5 mb-3.5 border-b border-[var(--line)]">
              <div className="flex items-center gap-2 shrink-0">
                <CrestSvg size={32} />
                <span className="font-[var(--display)] font-extrabold text-[18.5px] tracking-tight text-[var(--ink)] whitespace-nowrap">
                  Easy Learn
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[12px] font-extrabold shrink-0">
                <PWAInstallButton iconOnly label="Install offline app" />
                {onOpenWebsite && !isInstalled && (
                  <button
                    type="button"
                    onClick={onOpenWebsite}
                    aria-label="Open public website"
                    title="Public website"
                    className="w-8 h-8 min-[460px]:w-auto min-[460px]:px-2.5 rounded-full bg-[var(--card)] border border-[var(--line)] text-[var(--ink)] hover:border-[var(--acc-line)] inline-flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Icon name="globe" size={13} className="text-[var(--gold)]" />
                    <span className="hidden min-[460px]:inline">Website</span>
                  </button>
                )}
                <span className="inline-flex items-center gap-1 text-[var(--peach-ink)] bg-[var(--peach-bg)] border border-[var(--peach-line)] px-2.5 h-7 rounded-full tabular-nums">
                  <Icon name="flame" size={13} className="text-[#EA580C]" />
                  {progress.streak.n}d
                </span>
                <span className="inline-flex items-center px-2.5 h-7 rounded-full bg-[var(--gold)] text-[var(--on-acc)] tabular-nums">
                  {subjectPct}%
                </span>
              </div>
            </div>
          )}

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

      {effectiveShowNav && !isStudyWorkbench && (
        <div className="min-[980px]:hidden fixed bottom-3 inset-x-3 z-30 mx-auto max-w-[460px]">
          <LiquidCapsuleBar
            roleType="nav"
            size="nav-mobile"
            layoutMode="grid"
            gridClassName="grid-cols-5 items-center gap-1"
            pillRadiusPx={999}
            ariaLabel="Mobile navigation"
            items={navItems}
            value={activeTab}
            onChange={onNavigateTab}
            className="shadow-[0_6px_22px_-6px_rgba(15,23,42,0.22)]"
          />
        </div>
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
    <header className="sticky top-0 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 h-12 ul-liquid-bar border-b border-[var(--line)] flex items-center justify-between gap-2.5 sm:gap-3 mb-3.5">
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          className="w-9 h-9 rounded-xl bg-[var(--card)] border border-[var(--line)] shadow-[0_2px_0_var(--line)] flex items-center justify-center text-[var(--ink)] hover:border-[var(--acc-line)] active:translate-y-[1px] shrink-0 cursor-pointer transition-[border-color,transform] duration-150"
        >
          <Icon name="back" size={17} />
        </button>
        <div className="min-w-0 flex-1">
          {subtitle && (
            <div className="text-[11px] font-bold text-[var(--gold)] truncate">{subtitle}</div>
          )}
          <h1 className="font-[var(--display)] font-bold text-[15.5px] sm:text-[17px] leading-tight text-[var(--ink)] truncate">
            {title}
          </h1>
        </div>
      </div>
      {right && <div className="shrink-0 flex items-center gap-2">{right}</div>}
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
