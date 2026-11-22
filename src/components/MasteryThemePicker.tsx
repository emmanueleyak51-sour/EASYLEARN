import React from 'react';
import type { MasteryThemeId, ThemeAppearanceMode } from '../types';
import {
  MASTERY_THEMES,
  getMasteryThemeById,
  getThemePreview,
  type MasteryThemeDef,
} from '../data/masteryThemes';
import { Icon } from './Icons';

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
      className="w-full h-[56px] rounded-lg p-1.5 flex flex-col justify-between border overflow-hidden transition-colors"
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
        <span className="text-[10px] font-bold text-white/90">
          {appearanceMode === 'dark' ? 'Dark' : 'Light'}
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
function LockedThemeVaultPreview() {
  return (
    <div
      aria-hidden="true"
      className="w-full h-[56px] rounded-lg p-1.5 flex flex-col items-center justify-center gap-1 border border-dashed border-[var(--line)] bg-[var(--bg)] text-[var(--dim)] select-none"
    >
      <span className="w-6 h-6 rounded-full bg-[var(--card)] border border-[var(--line)] flex items-center justify-center text-[var(--dim)]">
        <Icon name="lock" size={13} />
      </span>
      <span className="text-[10px] font-bold tracking-tight">Colour locked</span>
    </div>
  );
}
export function MasteryThemeGallery({
  effectiveThemeId,
  appearanceMode,
  isPremium = false,
  onSelectTheme,
  onChangeAppearanceMode,
  onRequestUnlockPremium,
}: {
  effectiveThemeId: MasteryThemeId;
  appearanceMode: ThemeAppearanceMode;
  isPremium?: boolean;
  onSelectTheme: (id: MasteryThemeId) => void;
  onChangeAppearanceMode: (mode: ThemeAppearanceMode) => void;
  onRequestUnlockPremium?: (reason: string) => void;
}) {
  const activeTheme = getMasteryThemeById(effectiveThemeId);

  return (
    <div className="flex flex-col gap-3.5">
      {/* Light vs Dark Appearance Selector (Available to all students) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5" role="group" aria-label="Appearance mode">
        {(
          [
            {
              id: 'light' as ThemeAppearanceMode,
              title: 'Light theme',
              desc: 'Crisp daylight paper and clear contrast for bright rooms',
              icon: 'sun',
              sampleBg: activeTheme.lightPreview.bg,
              sampleCard: activeTheme.lightPreview.card,
              sampleLine: activeTheme.lightPreview.line,
              sampleInk: activeTheme.lightPreview.ink,
              sampleAcc: activeTheme.lightPreview.accent,
            },
            {
              id: 'dark' as ThemeAppearanceMode,
              title: 'Dark theme',
              desc: 'Deep evening canvas for comfortable low-glare study',
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
              className={`study-card rounded-xl border p-3 text-left flex items-center justify-between gap-3 transition cursor-pointer ${
                selected
                  ? 'bg-[var(--acc-soft)]/55 border-[var(--gold)] ring-1 ring-[var(--gold)]/25'
                  : 'bg-[var(--bg)] border-[var(--line)] hover:border-[var(--acc-line)]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  aria-hidden="true"
                  className="w-10 h-10 rounded-lg border flex flex-col justify-between p-1.5 shrink-0"
                  style={{
                    backgroundColor: opt.sampleBg,
                    borderColor: opt.sampleLine,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="w-4 h-4 rounded flex items-center justify-center"
                      style={{
                        backgroundColor: opt.sampleCard,
                        color: opt.sampleAcc,
                      }}
                    >
                      <Icon name={opt.icon} size={11} />
                    </span>
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: opt.sampleAcc }}
                    />
                  </div>
                  <span
                    className="w-full h-1 rounded-full"
                    style={{ backgroundColor: opt.sampleInk, opacity: 0.45 }}
                  />
                </div>
                <div className="min-w-0">
                  <div className="font-[var(--display)] font-bold text-[14.5px] text-[var(--ink)] flex items-center gap-2">
                    <span>{opt.title}</span>
                  </div>
                  <p className="text-[12px] text-[var(--dim)] leading-snug mt-0.5">
                    {opt.desc}
                  </p>
                </div>
              </div>
              <span
                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                  selected
                    ? 'bg-[var(--gold)] border-[var(--gold)] text-[var(--on-acc)]'
                    : 'bg-[var(--card)] border-[var(--line)] text-transparent'
                }`}
              >
                <Icon name="check" size={12} />
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Theme Summary & Premium Collection Header */}
      <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] px-3.5 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap text-[12.5px] font-bold">
          <span className="text-[var(--gold)]">
            Active theme: {activeTheme.name} ({appearanceMode === 'dark' ? 'Dark' : 'Light'})
          </span>
        </div>
        <div className="flex items-center gap-3 flex-wrap text-[12.5px] font-semibold text-[var(--dim)]">
          {isPremium ? (
            <span className="text-[var(--green)] font-bold">
              Premium active · All 10 colour themes unlocked
            </span>
          ) : (
            <>
              <span>Extra colour themes below are reserved for Premium students</span>
              {onRequestUnlockPremium && (
                <button
                  type="button"
                  onClick={() =>
                    onRequestUnlockPremium(
                      'Unlock all 9 Premium colour themes in Light and Dark mode'
                    )
                  }
                  className="text-[12.5px] font-bold text-[var(--gold)] hover:underline cursor-pointer whitespace-nowrap"
                >
                  Unlock 9 themes →
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Standard + Premium Colour Themes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
        {MASTERY_THEMES.map((theme) => {
          const unlocked = !theme.premiumOnly || isPremium;
          const isActive = effectiveThemeId === theme.id;

          let statusText = '';
          if (isActive) {
            statusText = 'Active theme';
          } else if (unlocked) {
            statusText = 'Use theme';
          } else {
            statusText = 'Unlock with Premium';
          }

          return (
            <button
              key={theme.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => {
                if (unlocked) {
                  onSelectTheme(theme.id);
                } else {
                  onRequestUnlockPremium?.(
                    `Unlock ${theme.name} and all 9 Premium colour themes`
                  );
                }
              }}
              className={`study-card text-left rounded-xl border p-2.5 flex flex-col justify-between gap-2 transition cursor-pointer ${
                isActive
                  ? 'bg-[var(--acc-soft)]/55 border-[var(--gold)] ring-1 ring-[var(--gold)]/25'
                  : unlocked
                    ? 'rtc-card hover:border-[var(--acc-line)]'
                    : 'bg-[var(--bg)]/80 border-[var(--line)] hover:border-[var(--acc-line)] opacity-85'
              }`}
            >
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-1.5 text-[11px] font-bold">
                  <span className={theme.premiumOnly ? 'text-[var(--dim)]' : 'text-[var(--gold)]'}>
                    {theme.premiumOnly ? 'Premium' : 'Standard'}
                  </span>
                  <span className="text-[var(--dim)]">
                    {theme.premiumOnly ? (isPremium ? 'Unlocked' : 'Locked') : 'Free'}
                  </span>
                </div>

                {unlocked ? (
                  <ThemeMiniPreview theme={theme} appearanceMode={appearanceMode} />
                ) : (
                  <LockedThemeVaultPreview />
                )}

                <div>
                  <div className="font-[var(--display)] font-bold text-[13.5px] text-[var(--ink)] leading-tight">
                    {theme.name}
                  </div>
                  <p className="text-[11px] text-[var(--dim)] leading-snug mt-0.5 line-clamp-2">
                    {unlocked
                      ? theme.tagline
                      : 'Subscribe to any EYAK pass to unlock and view this colour theme.'}
                  </p>
                </div>
              </div>

              <div className="pt-1.5 border-t border-[var(--line)] flex items-center justify-between gap-1.5 text-[11px] font-bold">
                <span
                  className={`truncate ${
                    isActive
                      ? 'text-[var(--gold)]'
                      : unlocked
                        ? 'text-[var(--ink)]'
                        : 'text-[var(--dim)]'
                  }`}
                >
                  {statusText}
                </span>
                <Icon
                  name={isActive ? 'check' : unlocked ? 'go' : 'lock'}
                  size={14}
                  className={
                    isActive
                      ? 'text-[var(--gold)] shrink-0'
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
