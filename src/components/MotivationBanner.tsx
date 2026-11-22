import React from 'react';
import type { SubjectId } from '../types';
import { today } from '../utils/engine';
import { getDailyQuietLine } from '../utils/motivationLogic';
import { Icon } from './Icons';

export function MotivationBanner({
  variant = 'hero',
}: {
  variant?: 'hero' | 'compact';
  studentName?: string;
  subj?: SubjectId;
}) {
  const line = getDailyQuietLine(today());

  if (variant === 'compact') {
    return (
      <div
        aria-label="Thought for today"
        className="rounded-2xl ul-liquid-bar border border-[var(--acc-line)] px-3.5 py-2 flex items-center gap-2 text-[13px] font-semibold text-[var(--ink)]"
      >
        <Icon name="bolt" size={15} className="text-[#F59E0B] shrink-0" />
        <span className="leading-snug">{line}</span>
      </div>
    );
  }

  return (
    <div
      aria-label="Thought for today"
      className="rounded-full ul-liquid-bar border border-[var(--acc-line)] px-4 py-2.5 flex items-center justify-center gap-2 text-center shadow-sm"
    >
      <Icon name="bolt" size={16} className="text-[#F59E0B] shrink-0" />
      <span className="text-[14px] font-bold text-[var(--ink)] leading-snug">{line}</span>
    </div>
  );
}
