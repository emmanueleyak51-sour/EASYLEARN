import React, { useState } from 'react';
import type { SubjectId, Topic, UserProgress } from '../types';
import {
  ELEMENTAL_RANKS,
  computeGateCompletionPct,
  evaluateElementalRank,
  extractSmartnessMetricsFromProgress,
  getElementalRankById,
  type ElementalRankDef,
  type ElementalRankId,
  type ElementalRankStanding,
} from '../utils/elementalRankLogic';
import { BADGES, type BadgeDef } from '../utils/engine';
import { Icon } from './Icons';

import terraCrestUrl from '../assets/images/rank_terra_crest_1795319069813.jpg';
import frostCrestUrl from '../assets/images/rank_frost_crest_1795319070066.jpg';
import emberCrestUrl from '../assets/images/rank_ember_crest_1795319070438.jpg';
import tempestCrestUrl from '../assets/images/rank_tempest_crest_1795319070626.jpg';
import voltCrestUrl from '../assets/images/rank_volt_crest_1795319070379.jpg';
import plasmaCrestUrl from '../assets/images/rank_plasma_crest_1795319071831.jpg';
import aetherCrestUrl from '../assets/images/rank_aether_crest_1795319070628.jpg';
import solarCrestUrl from '../assets/images/rank_solar_crest_1795319070817.jpg';

export const ELEMENTAL_EMBLEM_URLS: Record<ElementalRankId, string> = {
  terra: terraCrestUrl,
  frost: frostCrestUrl,
  ember: emberCrestUrl,
  tempest: tempestCrestUrl,
  volt: voltCrestUrl,
  plasma: plasmaCrestUrl,
  aether: aetherCrestUrl,
  solar: solarCrestUrl,
};

const ELEMENTAL_FALLBACK_ICON: Record<ElementalRankId, string> = {
  terra: 'shield',
  frost: 'star',
  ember: 'flame',
  tempest: 'bolt',
  volt: 'bolt',
  plasma: 'atom',
  aether: 'award',
  solar: 'crown',
};

export function ElementalEmblem({
  rankId,
  unlocked = true,
  size = 64,
  showLockCorner = false,
  className = '',
}: {
  rankId: ElementalRankId | null;
  unlocked?: boolean;
  size?: number;
  showLockCorner?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!rankId) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`relative rounded-xl bg-[#0B0F19] border border-slate-700/80 flex items-center justify-center shrink-0 overflow-hidden ${className}`}
      >
        <svg
          width={Math.round(size * 0.48)}
          height={Math.round(size * 0.48)}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 2.5L20.5 12L12 21.5L3.5 12L12 2.5Z"
            stroke="#64748B"
            strokeWidth="1.8"
            fill="rgba(100,116,139,0.14)"
          />
          <circle cx="12" cy="12" r="2.2" fill="#94A3B8" />
        </svg>
      </div>
    );
  }

  const def = getElementalRankById(rankId);
  const src = ELEMENTAL_EMBLEM_URLS[rankId];

  return (
    <div
      style={{
        width: size,
        height: size,
        borderColor: unlocked ? def.accentHex : 'rgba(100,116,139,0.38)',
        boxShadow: unlocked ? `0 0 18px -4px ${def.glowRgba}` : 'none',
      }}
      className={`relative rounded-2xl bg-[#0B0F19] border flex items-center justify-center shrink-0 overflow-hidden select-none ${className}`}
    >
      {!failed ? (
        <img
          src={src}
          alt={`${def.element} rank emblem`}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={() => setFailed(true)}
          className={`w-full h-full object-cover transition-transform duration-200 ${
            unlocked
              ? 'opacity-100 brightness-105 contrast-105'
              : 'grayscale contrast-95 brightness-45 opacity-60'
          }`}
        />
      ) : (
        <span style={{ color: unlocked ? def.accentHex : '#64748B' }}>
          <Icon name={ELEMENTAL_FALLBACK_ICON[rankId]} size={Math.round(size * 0.48)} />
        </span>
      )}

      {!unlocked && showLockCorner && (
        <span
          aria-hidden="true"
          className="absolute bottom-1 right-1 w-5 h-5 rounded-md bg-black/75 border border-white/15 text-slate-300 flex items-center justify-center"
        >
          <Icon name="lock" size={11} />
        </span>
      )}
    </div>
  );
}

/**
 * Compact inline indicator showing a scholar's current Elemental Rank -> Next Target Element.
 * Used across Leaderboard podium cards and standings rows.
 */
export function ElementalHeadingIndicator({
  standing,
  compact = false,
  onDark = false,
}: {
  standing: ElementalRankStanding;
  compact?: boolean;
  onDark?: boolean;
}) {
  const curId = standing.currentRank?.id || null;
  const nextId = standing.nextRank?.id || null;
  const mutedText = onDark ? 'text-white/70' : 'text-[var(--dim)]';
  const mainText = onDark ? 'text-white' : 'text-[var(--ink)]';

  return (
    <div className="inline-flex items-center gap-1.5 min-w-0">
      <ElementalEmblem rankId={curId} unlocked={Boolean(curId)} size={compact ? 24 : 28} />
      <span
        className={`font-[var(--display)] font-bold ${
          compact ? 'text-[12px]' : 'text-[13px]'
        } ${mainText} whitespace-nowrap`}
      >
        {standing.currentLabel}
      </span>

      {nextId && standing.nextLabel ? (
        <>
          <span aria-hidden="true" className={`text-[11px] font-bold ${mutedText}`}>
            →
          </span>
          <ElementalEmblem rankId={nextId} unlocked size={compact ? 22 : 26} />
          <span
            className={`text-[11.5px] font-bold whitespace-nowrap tabular-nums ${mutedText}`}
          >
            {standing.nextLabel}
            {!compact && ` · ${standing.progressToNextPct}%`}
          </span>
        </>
      ) : (
        <span className="text-[11px] font-bold text-amber-400 whitespace-nowrap">· Apex</span>
      )}
    </div>
  );
}

/**
 * Image-First Elemental Rank Showcase for Settings -> Badges.
 * Shows ONLY the 8 Elemental Rank Emblems + single-word Element names + thin progress bar ("no much words").
 * Tapping any emblem opens a compact numeric gate sheet showing exact smartness requirements.
 */
export function ElementalRankShowcase({
  progress,
  allTopicsBySubj,
  onOpenLeaderboard,
  onPreviewBadgeCelebration,
}: {
  progress: UserProgress;
  allTopicsBySubj: Partial<Record<SubjectId, Topic[]>>;
  onOpenLeaderboard?: () => void;
  onPreviewBadgeCelebration?: (badge: BadgeDef, isPreview?: boolean) => void;
}) {
  const [activeModalRank, setActiveModalRank] = useState<ElementalRankDef | null>(null);

  const metrics = extractSmartnessMetricsFromProgress(progress, allTopicsBySubj);
  const standing = evaluateElementalRank(metrics);
  const unlockedSet = new Set<ElementalRankId>(standing.unlockedIds);

  return (
    <section className="rtc-card rounded-2xl p-4 sm:p-4.5 flex flex-col gap-3.5">
      {/* Compact Header Strip: Current Element -> Heading To Next Element */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <ElementalEmblem
            rankId={standing.currentRank?.id || null}
            unlocked={Boolean(standing.currentRank)}
            size={40}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h2 className="h18 text-[var(--ink)] leading-tight">Elemental Ranks</h2>
              <span className="text-[12px] font-bold text-[var(--dim)] tabular-nums">
                · {standing.unlockedIds.length}/{ELEMENTAL_RANKS.length}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[var(--dim)] tabular-nums">
              <span className="font-bold text-[var(--ink)]">{standing.currentLabel}</span>
              {standing.nextLabel && (
                <>
                  <span aria-hidden="true">→</span>
                  <span className="text-[var(--gold)] font-bold">{standing.nextLabel}</span>
                  <span>({standing.progressToNextPct}%)</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[12px] font-bold text-[var(--dim)] tabular-nums whitespace-nowrap">
            {metrics.rp} RP · {metrics.accuracyPct}% acc
          </span>
          {onOpenLeaderboard && (
            <button
              type="button"
              onClick={onOpenLeaderboard}
              className="btn-tactile paper min-h-[34px] px-3 text-[12px] whitespace-nowrap"
            >
              <span>Rank ladder</span>
              <Icon name="go" size={14} />
            </button>
          )}
        </div>
      </div>

      {/* 8 Elemental Rank Emblem Tiles — Strictly Image-First, Minimal Words */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {ELEMENTAL_RANKS.map((rank) => {
          const unlocked = unlockedSet.has(rank.id);
          const isNextTarget = standing.nextRank?.id === rank.id;
          const pct = unlocked ? 100 : computeGateCompletionPct(rank, metrics);

          return (
            <button
              key={rank.id}
              type="button"
              aria-label={`${rank.element} rank emblem, ${unlocked ? 'unlocked' : `${pct}% progress`}`}
              onClick={() => setActiveModalRank(rank)}
              style={{
                borderColor: unlocked
                  ? rank.accentHex
                  : isNextTarget
                    ? 'var(--acc-line)'
                    : 'rgba(148,163,184,0.18)',
                boxShadow: unlocked ? `0 6px 20px -8px ${rank.glowRgba}` : 'none',
              }}
              className="group relative rounded-2xl bg-[#0B0F19] border p-3 sm:p-3.5 flex flex-col items-center gap-2 text-center transition-transform duration-150 active:scale-[0.98] cursor-pointer overflow-hidden"
            >
              {/* Subtle top indicator for next target */}
              {isNextTarget && !unlocked && (
                <span className="text-[10px] font-bold tracking-wide text-amber-300/95 leading-none">
                  Next
                </span>
              )}

              <ElementalEmblem
                rankId={rank.id}
                unlocked={unlocked}
                size={84}
                showLockCorner={!unlocked}
                className="border-0 shadow-none group-hover:scale-[1.03] transition-transform"
              />

              <div className="w-full flex flex-col items-center gap-1">
                <span
                  style={{ color: unlocked ? '#F8FAFC' : '#94A3B8' }}
                  className="font-[var(--display)] font-extrabold text-[14px] leading-tight tracking-tight whitespace-nowrap"
                >
                  {rank.element}
                </span>

                <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
                  <div
                    style={{
                      width: `${pct}%`,
                      backgroundColor: unlocked ? rank.accentHex : 'rgba(148,163,184,0.55)',
                    }}
                    className="h-full rounded-full transition-all"
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Compact Numeric Gate Modal when an Emblem is Tapped */}
      {activeModalRank && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="elemental-gate-title"
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs"
          onClick={() => setActiveModalRank(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[340px] rounded-3xl bg-[#0B0F19] border border-white/15 p-5 text-white flex flex-col items-center gap-3.5 shadow-2xl"
          >
            <div className="w-full flex items-center justify-between">
              <span
                style={{ color: activeModalRank.accentHex }}
                className="text-[12px] font-bold tabular-nums"
              >
                Tier {activeModalRank.order} · {activeModalRank.symbol}
              </span>
              <button
                type="button"
                aria-label="Close emblem details"
                onClick={() => setActiveModalRank(null)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/15 flex items-center justify-center text-white/80 cursor-pointer"
              >
                <Icon name="x" size={15} />
              </button>
            </div>

            <ElementalEmblem
              rankId={activeModalRank.id}
              unlocked={unlockedSet.has(activeModalRank.id)}
              size={112}
            />

            <div className="text-center">
              <h3
                id="elemental-gate-title"
                className="font-[var(--display)] font-extrabold text-[22px] text-white leading-tight"
              >
                {activeModalRank.element}
              </h3>
              <span className="text-[12px] font-semibold text-slate-400">
                {unlockedSet.has(activeModalRank.id)
                  ? 'Unlocked'
                  : standing.nextRank?.id === activeModalRank.id
                    ? 'Heading here next'
                    : 'Locked — clear lower elements first'}
              </span>
            </div>

            {/* Compact Smartness Gate Numbers */}
            <div className="w-full grid grid-cols-2 gap-2 text-left">
              {[
                {
                  label: 'Rank Points',
                  cur: metrics.rp,
                  req: activeModalRank.minRp,
                  fmt: `${metrics.rp} / ${activeModalRank.minRp}`,
                },
                {
                  label: 'Accuracy',
                  cur: metrics.accuracyPct,
                  req: activeModalRank.minAccuracyPct,
                  fmt: `${metrics.accuracyPct}% / ${activeModalRank.minAccuracyPct}%`,
                },
                {
                  label: 'Topics Passed',
                  cur: metrics.topicsPassed,
                  req: activeModalRank.minTopicsPassed,
                  fmt: `${metrics.topicsPassed} / ${activeModalRank.minTopicsPassed}`,
                },
                {
                  label: 'Answered Qs',
                  cur: metrics.totalAnswered,
                  req: activeModalRank.minAnswered,
                  fmt: `${metrics.totalAnswered} / ${activeModalRank.minAnswered}`,
                },
                ...(activeModalRank.minCbtScore > 0
                  ? [
                      {
                        label: 'Best Mock',
                        cur: metrics.bestCbtScore,
                        req: activeModalRank.minCbtScore,
                        fmt: `${metrics.bestCbtScore} / ${activeModalRank.minCbtScore}`,
                      },
                    ]
                  : []),
              ].map((g) => {
                const met = g.cur >= g.req;
                return (
                  <div
                    key={g.label}
                    className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 flex flex-col gap-0.5"
                  >
                    <span className="text-[11px] font-semibold text-slate-400">{g.label}</span>
                    <span
                      className={`font-[var(--display)] font-bold text-[13.5px] tabular-nums ${
                        met ? 'text-emerald-400' : 'text-white'
                      }`}
                    >
                      {g.fmt}
                    </span>
                  </div>
                );
              })}
            </div>

            {unlockedSet.has(activeModalRank.id) && onPreviewBadgeCelebration && (
              <button
                type="button"
                onClick={() => {
                  const b = BADGES.find((item) => item.elementId === activeModalRank.id);
                  setActiveModalRank(null);
                  if (b) onPreviewBadgeCelebration(b, false);
                }}
                className="btn-tactile indigo w-full justify-center min-h-[40px] text-[13px]"
              >
                <span>Replay unlock</span>
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

/**
 * Ascending EYAK Elemental Rank Spine (Solar at apex down to Terra at base).
 * Connected by a clean vertical conduit with diamond milestone nodes, highlighting
 * the student's current Element and the next Element they are heading toward.
 */
export function ElementalClimbSpine({
  standing,
}: {
  standing: ElementalRankStanding;
}) {
  const unlockedSet = new Set<ElementalRankId>(standing.unlockedIds);
  const tiersTopDown = [...ELEMENTAL_RANKS].reverse();

  return (
    <section
      aria-label="Elemental rank climb ladder"
      className="rounded-2xl bg-[#0B0F19] border border-slate-800 p-4 sm:p-5 text-white flex flex-col gap-3"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-[var(--display)] font-extrabold text-[17px] text-white">
          Elemental Climb
        </h2>
        <span className="text-[12px] font-bold text-amber-300 tabular-nums">
          {standing.nextLabel ? `Heading to ${standing.nextLabel}` : 'Solar Apex'}
        </span>
      </div>

      <div className="relative flex flex-col">
        {tiersTopDown.map((tier, idx) => {
          const isUnlocked = unlockedSet.has(tier.id);
          const isCurrent = standing.currentRank?.id === tier.id;
          const isNext = standing.nextRank?.id === tier.id;
          const isLast = idx === tiersTopDown.length - 1;

          return (
            <div key={tier.id} className="relative flex items-center gap-3.5 py-2">
              {/* Vertical conduit line + Diamond Node */}
              <div className="relative flex flex-col items-center w-6 shrink-0 self-stretch justify-center">
                {!isLast && (
                  <span
                    aria-hidden="true"
                    style={{
                      backgroundColor: isUnlocked ? tier.accentHex : 'rgba(148,163,184,0.22)',
                    }}
                    className="absolute top-1/2 -bottom-4 w-[2px]"
                  />
                )}
                <span
                  aria-hidden="true"
                  style={{
                    borderColor: isUnlocked || isNext ? tier.accentHex : '#475569',
                    backgroundColor: isUnlocked ? tier.accentHex : '#0B0F19',
                  }}
                  className="relative z-10 w-3.5 h-3.5 rotate-45 border-2 transition-colors"
                />
              </div>

              {/* Emblem */}
              <ElementalEmblem rankId={tier.id} unlocked={isUnlocked || isNext} size={46} />

              {/* Concise Element Name & Gate */}
              <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      style={{ color: isUnlocked || isCurrent ? '#FFFFFF' : '#CBD5E1' }}
                      className="font-[var(--display)] font-extrabold text-[15px] truncate"
                    >
                      {isCurrent ? standing.currentLabel : tier.element}
                    </span>
                    {tier.hasSubDivisions && !isCurrent && (
                      <span className="text-[11px] font-semibold text-slate-500">I–III</span>
                    )}
                  </div>
                  <div className="text-[11.5px] text-slate-400 tabular-nums truncate">
                    {tier.minRp} RP · {tier.minAccuracyPct}%+ acc · {tier.minTopicsPassed} topics
                  </div>
                </div>

                <div className="text-right shrink-0">
                  {isCurrent ? (
                    <span className="text-[11.5px] font-extrabold text-emerald-400 whitespace-nowrap">
                      You
                    </span>
                  ) : isNext ? (
                    <span className="text-[11.5px] font-extrabold text-amber-300 tabular-nums whitespace-nowrap">
                      Next · {standing.progressToNextPct}%
                    </span>
                  ) : isUnlocked ? (
                    <span className="text-[11.5px] font-bold text-slate-400">Cleared</span>
                  ) : (
                    <span className="text-[11.5px] font-semibold text-slate-500 tabular-nums">
                      {tier.minRp}+
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
