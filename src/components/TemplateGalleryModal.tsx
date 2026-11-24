import React, { useMemo, useState } from 'react';
import {
  EYAK_DESIGN_TEMPLATES,
  type DesignTemplateId,
  type DesignTemplateSpec,
  type TemplateCategory,
} from '../data/designTemplates';
import { Icon } from './Icons';

const CATEGORY_FILTERS: { id: 'all' | TemplateCategory; label: string }[] = [
  { id: 'all', label: 'All 10 Templates' },
  { id: 'editorial', label: 'Editorial & Prestige' },
  { id: 'minimal', label: 'Minimal & Pro' },
  { id: 'interactive', label: 'Interactive' },
  { id: 'exam', label: 'Exam & Classroom' },
];

const LAYOUT_LABELS: Record<DesignTemplateSpec['layoutStyle'], string> = {
  sidebar: 'Sidebar Studio',
  topbar: 'Top-Bar Editorial',
  'compact-rail': 'Compact Rail',
  focused: 'Focused Column',
};

function MiniTemplateMockup({ tpl }: { tpl: DesignTemplateSpec }) {
  const p = tpl.preview;
  const r = Math.max(3, Math.min(12, Math.round(p.radiusPx * 0.65)));

  return (
    <div
      className="relative w-full h-[182px] overflow-hidden select-none flex flex-col"
      style={{
        background: p.canvas,
        color: p.ink,
        borderBottom: `1px solid ${p.border}`,
        fontFamily: tpl.bodyFontStack,
      }}
    >
      {tpl.layoutStyle === 'topbar' ? (
        <>
          {/* Top-Bar Architecture (Broadsheet #8) */}
          <div
            className="h-8 px-3 flex items-center justify-between shrink-0"
            style={{ background: p.sidebar, borderBottom: `1px solid ${p.border}` }}
          >
            <div className="flex items-center gap-1.5">
              <span
                className="w-3.5 h-3.5 flex items-center justify-center text-[8px] font-black"
                style={{ background: p.accent, color: p.onAccent, borderRadius: Math.max(2, r - 2) }}
              >
                E
              </span>
              <span
                className="text-[10px] font-extrabold tracking-[0.04em]"
                style={{ fontFamily: tpl.displayFontStack }}
              >
                Easy Learn
              </span>
            </div>
            <div className="flex items-center gap-2 text-[8px] font-semibold" style={{ color: p.dim }}>
              <span style={{ color: p.accent, fontWeight: 700 }}>Home</span>
              <span>Subjects</span>
              <span>Topics</span>
              <span>CBT</span>
            </div>
            <span
              className="px-1.5 py-0.5 text-[7.5px] font-bold"
              style={{ background: p.accent, color: p.onAccent, borderRadius: Math.max(2, r - 3) }}
            >
              Launch
            </span>
          </div>
          <div className="flex-1 p-3 flex flex-col gap-2 min-h-0">
            <div
              className="p-2.5 text-white flex items-center justify-between gap-2"
              style={{ background: p.heroBg, borderRadius: r }}
            >
              <div className="min-w-0">
                <div className="text-[7px] font-bold uppercase tracking-wider" style={{ color: p.heroAccent }}>
                  Mathematics · SS 3
                </div>
                <div
                  className="text-[12px] font-bold leading-tight truncate mt-0.5"
                  style={{ fontFamily: tpl.displayFontStack }}
                >
                  Number Bases &amp; Modular Proofs
                </div>
              </div>
              <span
                className="px-2 py-1 text-[8px] font-bold shrink-0"
                style={{ background: p.accent, color: p.onAccent, borderRadius: Math.max(2, r - 2) }}
              >
                Start →
              </span>
            </div>
            <div className="grid grid-cols-12 gap-2 flex-1 min-h-0">
              <div
                className="col-span-7 p-2 flex flex-col justify-between"
                style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: r }}
              >
                <div className="flex items-center justify-between text-[7.5px] font-bold" style={{ color: p.dim }}>
                  <span style={{ color: p.accent }}>Q01 · CBT Paper</span>
                  <span>29:45</span>
                </div>
                <div className="text-[9px] font-semibold leading-snug" style={{ fontFamily: tpl.displayFontStack }}>
                  Convert 234₅ to base ten.
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {['A · 64', 'B · 69'].map((opt, idx) => (
                    <div
                      key={opt}
                      className="px-1.5 py-1 text-[7.5px] font-bold"
                      style={{
                        background: idx === 1 ? p.accentSoft : p.canvas,
                        border: `1px solid ${idx === 1 ? p.accent : p.border}`,
                        color: idx === 1 ? p.accent : p.ink,
                        borderRadius: Math.max(2, r - 3),
                      }}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              </div>
              <div
                className="col-span-5 p-2 flex flex-col justify-between"
                style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: r }}
              >
                <div className="text-[7.5px] font-bold" style={{ color: p.dim }}>
                  Mastery Score
                </div>
                <div className="text-[15px] font-extrabold leading-none" style={{ color: p.accent }}>
                  84%
                </div>
                <div className="h-1.5 w-full overflow-hidden" style={{ background: p.canvas, borderRadius: 99 }}>
                  <div className="h-full w-4/5" style={{ background: p.accent }} />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Sidebar / Compact Rail / Focused Column Mockups */
        <div className="flex flex-1 min-h-0">
          <div
            className="shrink-0 p-2 flex flex-col justify-between"
            style={{
              width: tpl.layoutStyle === 'compact-rail' ? 42 : 66,
              background: p.sidebar,
              borderRight: `1px solid ${p.border}`,
            }}
          >
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1 pb-1.5" style={{ borderBottom: `1px solid ${p.border}` }}>
                <span
                  className="w-3.5 h-3.5 flex items-center justify-center text-[7.5px] font-black shrink-0"
                  style={{ background: p.accent, color: p.onAccent, borderRadius: Math.max(2, r - 3) }}
                >
                  E
                </span>
                {tpl.layoutStyle !== 'compact-rail' && (
                  <span
                    className="text-[8px] font-extrabold tracking-tight truncate"
                    style={{ fontFamily: tpl.displayFontStack }}
                  >
                    Easy Learn
                  </span>
                )}
              </div>
              {['Home', 'Subj', 'Topics', 'CBT'].map((lbl, idx) => (
                <div
                  key={lbl}
                  className="h-4 px-1.5 flex items-center gap-1 text-[7.5px] font-semibold"
                  style={{
                    background: idx === 0 ? p.accentSoft : 'transparent',
                    color: idx === 0 ? p.accent : p.dim,
                    borderRadius: Math.max(2, r - 3),
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: idx === 0 ? p.accent : p.border }}
                  />
                  {tpl.layoutStyle !== 'compact-rail' && <span className="truncate">{lbl}</span>}
                </div>
              ))}
            </div>
            <div className="h-1.5 w-full overflow-hidden" style={{ background: p.canvas, borderRadius: 99 }}>
              <div className="h-full w-2/3" style={{ background: p.accent }} />
            </div>
          </div>

          <div
            className={`flex-1 p-2.5 flex flex-col gap-2 min-w-0 ${
              tpl.layoutStyle === 'focused' ? 'px-5' : ''
            }`}
          >
            {/* Mini Hero Banner */}
            <div
              className="p-2.5 text-white flex items-center justify-between gap-2"
              style={{ background: p.heroBg, borderRadius: r }}
            >
              <div className="min-w-0">
                <div className="text-[7px] font-bold tracking-wide" style={{ color: p.heroAccent }}>
                  JAMB &amp; WAEC · 45d left
                </div>
                <div
                  className="text-[11px] font-bold leading-tight truncate mt-0.5"
                  style={{ fontFamily: tpl.displayFontStack }}
                >
                  Good evening, Scholar
                </div>
              </div>
              <span
                className="px-1.5 py-0.5 text-[7.5px] font-bold shrink-0"
                style={{ background: p.accent, color: p.onAccent, borderRadius: Math.max(2, r - 3) }}
              >
                CBT →
              </span>
            </div>

            {/* Mini Study Row */}
            <div className="grid grid-cols-12 gap-2 flex-1 min-h-0">
              <div
                className="col-span-7 p-2 flex flex-col justify-between"
                style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: r }}
              >
                <div className="text-[7.5px] font-bold" style={{ color: p.accent }}>
                  Today&apos;s Step · 5 min
                </div>
                <div
                  className="text-[10px] font-bold leading-tight truncate"
                  style={{ fontFamily: tpl.displayFontStack }}
                >
                  Number Bases
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className="px-2 py-0.5 text-[7.5px] font-bold"
                    style={{
                      background: p.accent,
                      color: p.onAccent,
                      borderRadius: Math.max(2, r - 2),
                    }}
                  >
                    Start lesson
                  </span>
                  <span
                    className="px-1.5 py-0.5 text-[7px] font-semibold"
                    style={{
                      background: p.canvas,
                      border: `1px solid ${p.border}`,
                      color: p.dim,
                      borderRadius: Math.max(2, r - 2),
                    }}
                  >
                    Notes
                  </span>
                </div>
              </div>

              <div
                className="col-span-5 p-2 flex flex-col justify-between"
                style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: r }}
              >
                <div className="flex items-center justify-between text-[7px] font-bold" style={{ color: p.dim }}>
                  <span>Q01</span>
                  <span style={{ color: p.accent }}>A–D</span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {['A', 'B', 'C', 'D'].map((ltr, i) => (
                    <div
                      key={ltr}
                      className="h-4 flex items-center justify-center text-[7.5px] font-bold"
                      style={{
                        background: i === 0 ? p.accentSoft : p.canvas,
                        border: `1px solid ${i === 0 ? p.accent : p.border}`,
                        color: i === 0 ? p.accent : p.dim,
                        borderRadius: Math.max(2, r - 3),
                      }}
                    >
                      {ltr}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between text-[7px] font-semibold" style={{ color: p.dim }}>
                  <span>Lab Ready</span>
                  <span style={{ color: p.accent }}>12 Subj</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function TemplateGalleryModal({
  open,
  activeTemplateId,
  onSelectTemplate,
  onResetDefault,
  onClose,
}: {
  open: boolean;
  activeTemplateId: DesignTemplateId | null;
  onSelectTemplate: (id: DesignTemplateId, startPreviewBar: boolean) => void;
  onResetDefault: () => void;
  onClose: () => void;
}) {
  const [filter, setFilter] = useState<'all' | TemplateCategory>('all');

  const visibleTemplates = useMemo(
    () =>
      filter === 'all'
        ? EYAK_DESIGN_TEMPLATES
        : EYAK_DESIGN_TEMPLATES.filter((t) => t.category === filter),
    [filter]
  );

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Easy Learn 10 Design Templates Preview Studio"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#090E1B]/72 backdrop-blur-sm anim-fade"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-[1120px] max-h-[90vh] rounded-2xl bg-[var(--bg)] border border-[var(--line)] shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <header className="px-5 sm:px-6 py-4 bg-[var(--card)] border-b border-[var(--line)] flex flex-col gap-3 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-[11.5px] font-bold text-[var(--gold)]">
                Easy Learn Live Template Studio · 10 Full-Platform Designs
              </div>
              <h2 className="font-[var(--display)] font-extrabold text-[20px] sm:text-[23px] text-[var(--ink)] leading-tight mt-0.5">
                Preview &amp; Choose Your Easy Learn Design Template
              </h2>
              <p className="text-[13px] text-[var(--dim)] mt-0.5">
                Click <strong>Preview Live</strong> on any template to transform the real app instantly — browse Home, CBT Simulator, Lessons, and Dark Mode before deciding.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {activeTemplateId && (
                <button
                  type="button"
                  onClick={onResetDefault}
                  className="min-h-[34px] px-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--acc-line)] text-[12px] font-bold text-[var(--dim)] hover:text-[var(--ink)] cursor-pointer transition-colors whitespace-nowrap"
                >
                  Reset Default
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close template gallery"
                className="w-9 h-9 rounded-xl bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--acc-line)] text-[var(--ink)] flex items-center justify-center cursor-pointer transition-colors"
              >
                <Icon name="x" size={16} />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            {CATEGORY_FILTERS.map((c) => {
              const active = filter === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setFilter(c.id)}
                  className={`min-h-[32px] px-3 rounded-lg text-[12px] font-bold whitespace-nowrap cursor-pointer transition-colors border ${
                    active
                      ? 'bg-[var(--gold)] text-[var(--on-acc)] border-[var(--gold)]'
                      : 'bg-[var(--bg)] text-[var(--dim)] border-[var(--line)] hover:text-[var(--ink)]'
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </header>

        {/* Scrollable 10-Template Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {visibleTemplates.map((tpl) => {
              const isSelected = activeTemplateId === tpl.id;
              return (
                <article
                  key={tpl.id}
                  className={`rounded-2xl overflow-hidden bg-[var(--card)] border transition-all flex flex-col ${
                    isSelected
                      ? 'border-[var(--gold)] ring-2 ring-[var(--acc-soft)] shadow-md'
                      : 'border-[var(--line)] hover:border-[var(--acc-line)] shadow-xs'
                  }`}
                >
                  <MiniTemplateMockup tpl={tpl} />

                  <div className="p-4 flex flex-col gap-3 flex-1 justify-between">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-[var(--display)] font-extrabold text-[16.5px] text-[var(--ink)] leading-snug">
                            {tpl.index}. {tpl.name}
                          </h3>
                          <div className="text-[12px] font-semibold text-[var(--gold)]">
                            {tpl.subtitle} · {LAYOUT_LABELS[tpl.layoutStyle]}
                          </div>
                        </div>

                        {/* Palette Swatches */}
                        <div className="flex items-center gap-1 shrink-0 pt-0.5" aria-label="Color palette">
                          {[tpl.preview.canvas, tpl.preview.surface, tpl.preview.accent, tpl.preview.heroAccent].map(
                            (hex, idx) => (
                              <span
                                key={`${tpl.id}-sw-${idx}`}
                                className="w-4 h-4 rounded-full border border-black/15"
                                style={{ background: hex }}
                                title={hex}
                              />
                            )
                          )}
                        </div>
                      </div>

                      <p className="text-[13px] text-[var(--dim)] leading-relaxed">{tpl.summary}</p>

                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11.5px] text-[var(--dim)] pt-0.5">
                        <span>
                          <strong className="text-[var(--ink)]">{tpl.displayFontName}</strong> + {tpl.bodyFontName}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{tpl.radiusLabel}</span>
                        <span aria-hidden="true">·</span>
                        <span>{tpl.preferredMode === 'dark' ? 'Dark-first OLED' : 'Light + Dark ready'}</span>
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-[var(--line)] flex items-center justify-between gap-2">
                      <span className="text-[11.5px] text-[var(--dim)] truncate">
                        Best for: <span className="text-[var(--ink)] font-medium">{tpl.bestFor}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => onSelectTemplate(tpl.id, true)}
                        className={`min-h-[34px] px-3.5 rounded-xl text-[12.5px] font-bold flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors whitespace-nowrap ${
                          isSelected
                            ? 'bg-[var(--green)] text-white'
                            : 'bg-[var(--gold)] text-[var(--on-acc)] hover:opacity-92'
                        }`}
                      >
                        <Icon name={isSelected ? 'check' : 'go'} size={13} />
                        <span>{isSelected ? 'Active · Inspect' : 'Preview Live'}</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function TemplatePreviewDock({
  template,
  onPrev,
  onNext,
  onOpenGallery,
  onKeep,
  onReset,
}: {
  template: DesignTemplateSpec;
  onPrev: () => void;
  onNext: () => void;
  onOpenGallery: () => void;
  onKeep: () => void;
  onReset: () => void;
}) {
  return (
    <div
      role="region"
      aria-label="Live template preview controls"
      className="no-print fixed bottom-[68px] min-[980px]:bottom-4 left-3 right-[60px] sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-40 sm:max-w-[calc(100vw-24px)] rounded-xl bg-[var(--card)]/96 backdrop-blur-md border border-[var(--gold)] shadow-xl px-2 sm:px-3 py-1.5 sm:py-2 flex items-center justify-between sm:justify-start gap-1.5 sm:gap-2"
    >
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={onPrev}
          aria-label="Previous design template"
          className="w-7 h-7 rounded-lg bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--gold)] text-[var(--ink)] flex items-center justify-center cursor-pointer transition-colors"
        >
          <Icon name="back" size={14} />
        </button>
        <button
          type="button"
          onClick={onNext}
          aria-label="Next design template"
          className="w-7 h-7 rounded-lg bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--gold)] text-[var(--ink)] flex items-center justify-center cursor-pointer transition-colors"
        >
          <Icon name="go" size={14} />
        </button>
      </div>

      <div className="min-w-0 px-1 flex items-center gap-1.5">
        <span className="mono text-[11px] font-extrabold text-[var(--gold)] tabular-nums shrink-0">
          #{String(template.index).padStart(2, '0')}/10
        </span>
        <span className="font-[var(--display)] font-bold text-[12.5px] sm:text-[13px] text-[var(--ink)] truncate max-w-[130px] sm:max-w-[190px]">
          {template.name}
        </span>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={onOpenGallery}
          className="min-h-[28px] px-2.5 rounded-lg bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--gold)] text-[11.5px] font-bold text-[var(--ink)] cursor-pointer transition-colors whitespace-nowrap"
        >
          All 10
        </button>
        <button
          type="button"
          onClick={onKeep}
          className="min-h-[28px] px-2.5 rounded-lg bg-[var(--gold)] text-[var(--on-acc)] text-[11.5px] font-bold cursor-pointer hover:opacity-92 transition-opacity whitespace-nowrap"
        >
          Keep
        </button>
        <button
          type="button"
          onClick={onReset}
          aria-label="Reset to default Easy Learn design"
          title="Reset to default design"
          className="w-7 h-7 rounded-lg text-[var(--dim)] hover:text-[var(--coral-ink)] hover:bg-[var(--bad-soft)] flex items-center justify-center cursor-pointer transition-colors"
        >
          <Icon name="x" size={13} />
        </button>
      </div>
    </div>
  );
}
