import React from 'react';
import type { MasteryThemeId, ThemeAppearanceMode, ThemeLockMode } from '../types';
import {
  MASTERY_THEMES,
  getMasteryThemeById,
  getThemePreview,
  type MasteryThemeDef,
} from '../data/masteryThemes';
import {
  isThemeUnlocked,
  type GoalMasterySnapshot,
} from '../utils/masteryThemeLogic';
import { Icon } from './Icons';
import { SlidingTabs, SmoothProgressBar } from './ULessonMotion';

function ThemeMiniPreview({
  theme,
  appearanceMode,
}: {
  theme: MasteryThemeDef;
  appearanceMode: ThemeAppearanceMode;
}) {
  const pal = getThemePreview(theme, appearanceMode);
  return (
    <div
      aria-hidden="true"
      className="w-full h-[66px] rounded-xl p-2 flex flex-col justify-between border overflow-hidden transition-colors"
      style={{
        backgroundColor: pal.bg,
        borderColor: pal.line,
      }}
    >
      {/* Mini Hero Strip */}
      <div
        className="h-5 rounded-md px-2 flex items-center justify-between"
        style={{
          background: `linear-gradient(135deg, ${pal.heroStart} 0%, ${pal.heroEnd} 100%)`,
        }}
      >
        <div className="flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: pal.badge }}
          />
          <span className="w-10 h-1.5 rounded-full bg-white/80" />
        </div>
        <span className="text-[9.5px] font-extrabold tracking-wide text-white/90 tabular-nums">
          {appearanceMode === 'dark' ? 'DARK' : 'LIGHT'}
        </span>
      </div>

      {/* Mini Surface Card + Accent Action */}
      <div
        className="h-6 rounded-md px-2 flex items-center justify-between border transition-colors"
        style={{
          backgroundColor: pal.card,
          borderColor: pal.line,
        }}
      >
        <div className="flex items-center gap-1.5">
          <span
            className="w-6 h-1.5 rounded-full"
            style={{ backgroundColor: pal.ink, opacity: 0.85 }}
          />
          <span
            className="w-4 h-1.5 rounded-full"
            style={{ backgroundColor: pal.ink, opacity: 0.35 }}
          />
        </div>
        <span
          className="w-8 h-3 rounded-[4px]"
          style={{ backgroundColor: pal.accent }}
        />
      </div>
    </div>
  );
}

export function MasteryThemeGallery({
  effectiveThemeId,
  appearanceMode,
  lockMode,
  autoProgress,
  goalSnapshot,
  onSelectTheme,
  onChangeAppearanceMode,
  onChangeLockMode,
  onToggleAutoProgress,
}: {
  effectiveThemeId: MasteryThemeId;
  appearanceMode: ThemeAppearanceMode;
  lockMode: ThemeLockMode;
  autoProgress: boolean;
  goalSnapshot: GoalMasterySnapshot;
  onSelectTheme: (id: MasteryThemeId) => void;
  onChangeAppearanceMode: (mode: ThemeAppearanceMode) => void;
  onChangeLockMode: (mode: ThemeLockMode) => void;
  onToggleAutoProgress: (enabled: boolean) => void;
}) {
  const activeTheme = getMasteryThemeById(effectiveThemeId);

  return (
    <div className="flex flex-col gap-5">
      {/* Light vs Dark Appearance Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="group" aria-label="Appearance mode">
        {(
          [
            {
              id: 'light' as ThemeAppearanceMode,
              title: 'Light Theme',
              desc: 'Crisp daylight paper & clear contrast for bright rooms',
              icon: 'sun',
              sampleBg: activeTheme.lightPreview.bg,
              sampleCard: activeTheme.lightPreview.card,
              sampleLine: activeTheme.lightPreview.line,
              sampleInk: activeTheme.lightPreview.ink,
              sampleAcc: activeTheme.lightPreview.accent,
            },
            {
              id: 'dark' as ThemeAppearanceMode,
              title: 'Dark Theme',
              desc: 'Deep nocturnal canvas for low-glare evening study',
              icon: 'moon',
              sampleBg: activeTheme.darkPreview.bg,
              sampleCard: activeTheme.darkPreview.card,
              sampleLine: activeTheme.darkPreview.line,
              sampleInk: activeTheme.darkPreview.ink,
              sampleAcc: activeTheme.darkPreview.accent,
            },
          ] as const
        ).map((opt) => {
          const selected = appearanceMode === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChangeAppearanceMode(opt.id)}
              className={`study-card rounded-2xl border p-4 text-left flex items-center justify-between gap-3.5 transition cursor-pointer ${
                selected
                  ? 'bg-[var(--acc-soft)]/55 border-[var(--gold)] ring-1 ring-[var(--gold)]/25'
                  : 'bg-[var(--bg)] border-[var(--line)] hover:border-[var(--acc-line)]'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  aria-hidden="true"
                  className="w-12 h-12 rounded-xl border flex flex-col justify-between p-1.5 shrink-0"
                  style={{
                    backgroundColor: opt.sampleBg,
                    borderColor: opt.sampleLine,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="w-5 h-5 rounded-md flex items-center justify-center"
                      style={{
                        backgroundColor: opt.sampleCard,
                        color: opt.sampleAcc,
                      }}
                    >
                      <Icon name={opt.icon} size={13} />
                    </span>
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: opt.sampleAcc }}
                    />
                  </div>
                  <span
                    className="w-full h-1.5 rounded-full"
                    style={{ backgroundColor: opt.sampleInk, opacity: 0.45 }}
                  />
                </div>
                <div className="min-w-0">
                  <div className="font-[var(--display)] font-bold text-[15.5px] text-[var(--ink)] flex items-center gap-2">
                    <span>{opt.title}</span>
                  </div>
                  <p className="text-[12.5px] text-[var(--dim)] leading-snug mt-0.5">
                    {opt.desc}
                  </p>
                </div>
              </div>
              <span
                className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ${
                  selected
                    ? 'bg-[var(--gold)] border-[var(--gold)] text-[var(--on-acc)]'
                    : 'bg-[var(--card)] border-[var(--line)] text-transparent'
                }`}
              >
                <Icon name="check" size={14} />
              </span>
            </button>
          );
        })}
      </div>

      {/* Goal Progress & Lock Mode Header */}
      <div className="rounded-2xl bg-[var(--bg)] border border-[var(--line)] p-4 sm:p-5 flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap text-[12.5px] font-bold">
              <span className="text-[var(--gold)]">
                Active: Stage {activeTheme.stage} · {activeTheme.name} ({appearanceMode === 'dark' ? 'Dark' : 'Light'})
              </span>
              <span aria-hidden="true" className="text-[var(--dim)]">·</span>
              <span className="text-[var(--ink)] tabular-nums">
                Goal progress: {goalSnapshot.goalPct}% of your {goalSnapshot.targetPct}% target
              </span>
            </div>
            <SmoothProgressBar
              value={goalSnapshot.goalPct}
              max={100}
              tone="indigo"
              heightClass="h-2"
              trackClass="bg-[var(--deep)]"
              ariaLabel="Mastery goal progression toward unlocking themes"
              className="max-w-[420px]"
            />
            <div className="text-[12.5px] text-[var(--dim)]">
              {goalSnapshot.nextTheme ? (
                <span>
                  Earned stage: <strong className="text-[var(--ink)]">Stage {goalSnapshot.highestUnlockedStage} ({goalSnapshot.highestUnlockedTheme.name})</strong> · Next unlock at{' '}
                  <strong className="text-[var(--ink)]">{goalSnapshot.nextTheme.unlockGoalPct}% of goal</strong> ({goalSnapshot.nextTheme.name})
                </span>
              ) : (
                <span className="text-[var(--green)] font-bold">
                  100% Goal Mastered — All 10 Mastery Themes permanently earned!
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <SlidingTabs
              items={[
                { id: 'unlocked', label: 'Preview All 10 (Test Mode)', icon: 'unlock' },
                { id: 'goal', label: 'Lock by Goal Progress', icon: 'lock' },
              ]}
              value={lockMode}
              onChange={onChangeLockMode}
              ariaLabel="Theme unlock mode"
              variant="indigo"
              size="sm"
              roleType="group"
              className="min-w-[320px] sm:min-w-[380px]"
            />
            <label className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-[var(--dim)] cursor-pointer select-none self-start">
              <input
                type="checkbox"
                checked={autoProgress}
                onChange={(e) => onToggleAutoProgress(e.target.checked)}
                className="w-4 h-4 rounded accent-[var(--gold)] cursor-pointer"
              />
              <span>Auto-advance theme when my goal passes a new stage</span>
            </label>
          </div>
        </div>
      </div>

      {/* 10-Stage Mastery Progression Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {MASTERY_THEMES.map((theme) => {
          const unlocked = isThemeUnlocked(theme, goalSnapshot.goalPct, lockMode);
          const earnedByGoal = goalSnapshot.goalPct >= theme.unlockGoalPct;
          const isActive = effectiveThemeId === theme.id;

          let statusText = '';
          if (isActive) {
            statusText = 'Active theme';
          } else if (!unlocked) {
            statusText = `Locked · ${theme.unlockGoalPct}% goal`;
          } else if (earnedByGoal) {
            statusText = 'Earned';
          } else {
            statusText = `Test · ${theme.unlockGoalPct}% goal`;
          }

          return (
            <button
              key={theme.id}
              type="button"
              disabled={!unlocked}
              aria-pressed={isActive}
              onClick={() => {
                if (unlocked) onSelectTheme(theme.id);
              }}
              className={`study-card text-left rounded-2xl border p-3 flex flex-col justify-between gap-2.5 transition ${
                isActive
                  ? 'bg-[var(--acc-soft)]/55 border-[var(--gold)] ring-1 ring-[var(--gold)]/25 cursor-pointer'
                  : unlocked
                    ? 'rtc-card hover:border-[var(--acc-line)] cursor-pointer'
                    : 'bg-[var(--bg)]/75 border-[var(--line)] opacity-65 cursor-not-allowed'
              }`}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-1.5 text-[11px] font-bold">
                  <span className="text-[var(--gold)] tabular-nums whitespace-nowrap">
                    Stage {theme.stage}
                  </span>
                  <span className="text-[var(--dim)] tabular-nums whitespace-nowrap">
                    {theme.unlockGoalPct === 0 ? 'Start (0%)' : `${theme.unlockGoalPct}% goal`}
                  </span>
                </div>

                <ThemeMiniPreview theme={theme} appearanceMode={appearanceMode} />

                <div>
                  <div className="font-[var(--display)] font-bold text-[14.5px] text-[var(--ink)] leading-tight">
                    {theme.name}
                  </div>
                  <div className="text-[11.5px] font-semibold text-[var(--dim)] mt-0.5">
                    {theme.tierLabel}
                  </div>
                  <p className="text-[11.5px] text-[var(--dim)] leading-snug mt-1 line-clamp-2">
                    {theme.tagline}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--line)] flex items-center justify-between gap-1.5 text-[11.5px] font-bold">
                <span
                  className={`truncate ${
                    isActive
                      ? 'text-[var(--gold)]'
                      : !unlocked
                        ? 'text-[var(--dim)]'
                        : earnedByGoal
                          ? 'text-[var(--green)]'
                          : 'text-[var(--ink)]'
                  }`}
                >
                  {statusText}
                </span>
                <Icon
                  name={isActive ? 'check' : !unlocked ? 'lock' : 'go'}
                  size={14}
                  className={
                    isActive
                      ? 'text-[var(--gold)] shrink-0'
                      : !unlocked
                        ? 'text-[var(--dim)] shrink-0'
                        : 'text-[var(--dim)] shrink-0'
                  }
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
