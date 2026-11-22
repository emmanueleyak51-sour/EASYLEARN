import React from 'react';
import type { BadgeDef, BadgeTier } from '../utils/engine';
import { ElementalEmblem } from './ElementalRankVisuals';
import { Icon } from './Icons';

export interface XpBurstItem {
  id: number;
  label: string;
  sub?: string;
}

/**
 * Confetti and floating XP bursts are intentionally disabled per EYAK calm motion rules.
 */
export function FxCelebration(_props: {
  bursts: XpBurstItem[];
  confettiKey?: number;
}) {
  return null;
}

export const BADGE_TIER_STYLE: Record<
  BadgeTier,
  {
    label: string;
    crestBg: string;
    crestBorder: string;
    crestText: string;
    kickerText: string;
  }
> = {
  bronze: {
    label: 'Bronze badge',
    crestBg: '#FFE1D1',
    crestBorder: '#F4B99B',
    crestText: '#5C1F00',
    kickerText: 'Milestone reached',
  },
  silver: {
    label: 'Silver badge',
    crestBg: '#DCEBFF',
    crestBorder: '#9EC5FF',
    crestText: '#0D3570',
    kickerText: 'Milestone reached',
  },
  gold: {
    label: 'Gold badge',
    crestBg: '#D3F5EA',
    crestBorder: '#8FD9C1',
    crestText: '#0B4A37',
    kickerText: 'Milestone reached',
  },
  mythic: {
    label: 'Top milestone',
    crestBg: 'var(--acc-soft)',
    crestBorder: 'var(--acc-line)',
    crestText: 'var(--gold)',
    kickerText: 'Milestone reached',
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
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-[#15102B]/70 backdrop-blur-xs"
      onClick={onDismiss}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="anim-badge-modal relative w-full max-w-[400px] rounded-[28px] bg-[var(--card)] border-2 border-[var(--line)] shadow-[0_4px_0_var(--line)] p-6 flex flex-col items-center text-center gap-4"
      >
        {queueTotal > 1 && (
          <div className="text-[12.5px] font-bold text-[var(--dim)] tabular-nums">
            Milestone {queueIndex} of {queueTotal}
          </div>
        )}

        {badge.elementId ? (
          <ElementalEmblem rankId={badge.elementId} unlocked size={108} />
        ) : (
          <div
            className="w-20 h-20 rounded-[22px] border-2 flex items-center justify-center"
            style={{
              background: tierStyle.crestBg,
              borderColor: tierStyle.crestBorder,
              color: tierStyle.crestText,
            }}
          >
            <Icon name={badge.icon} size={36} />
          </div>
        )}

        <div className="flex flex-col items-center gap-1">
          <span className="text-[12.5px] font-bold text-[var(--gold)]">
            {isPreview ? 'Elemental Rank' : 'Rank Unlocked'}
          </span>
          <h2
            id="badge-unlock-title"
            className="font-[var(--display)] font-extrabold text-[24px] text-[var(--ink)] leading-tight"
          >
            {badge.name}
          </h2>
        </div>

        <button
          type="button"
          onClick={onDismiss}
          className="btn-tactile indigo w-full justify-center whitespace-nowrap mt-1"
        >
          <span>{queueIndex < queueTotal ? 'Next milestone' : 'Continue'}</span>
          <Icon name="go" size={18} />
        </button>
      </div>
    </div>
  );
}
