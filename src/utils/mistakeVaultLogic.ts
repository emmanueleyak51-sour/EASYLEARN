import type { Question, SubjectId } from '../types';
import { today } from './engine';

export type MistakeTrapCategory =
  | 'formula_calc'
  | 'sign_unit'
  | 'exception_wording'
  | 'concept_recall';

export interface MistakeEntry {
  qid: string;
  subj: SubjectId;
  tid: string;
  trap: MistakeTrapCategory;
  missCount: number;
  clearCount: number; // Needs 2 clears on distinct days to graduate
  lastMissedDay: number;
  lastClearedDay: number | null;
  pickedIdx: number;
  source: 'dx' | 'practice' | 'review' | 'boss' | 'cbt' | 'duel';
}

export const TRAP_META: Record<
  MistakeTrapCategory,
  { label: string; tip: string; shortLabel: string }
> = {
  formula_calc: {
    label: 'Formula & Calculation',
    shortLabel: 'Formula / Calc',
    tip: 'Write the governing formula first, substitute SI units, then simplify.',
  },
  sign_unit: {
    label: 'Sign & Unit Conversion',
    shortLabel: 'Sign / Unit',
    tip: 'Double-check negative signs, cm↔m / g↔kg / K↔°C conversions, and exponents.',
  },
  exception_wording: {
    label: 'Misread "EXCEPT / NOT" Trap',
    shortLabel: 'Wording Trap',
    tip: 'Underline EXCEPT, NOT, LEAST, or INCORRECT before reading option A.',
  },
  concept_recall: {
    label: 'Concept & Rule Recall',
    shortLabel: 'Concept Recall',
    tip: 'Review the core rule in Notes and test yourself with a 1-sentence summary.',
  },
};

export function classifyMistakeTrap(q: Question, subj: SubjectId): MistakeTrapCategory {
  const plain = `${q.q} ${q.e}`.replace(/<[^>]+>/g, ' ').toLowerCase();
  if (/\b(except|not true|incorrect|false|least likely|which of the following is not)\b/i.test(plain)) {
    return 'exception_wording';
  }
  if (
    /\b(cm|mm|km|kg|mol|dm|kelvin|°c|negative|minus|sign|clockwise|anticlockwise|bearing|binary|hex|byte|bit)\b/i.test(
      plain
    )
  ) {
    return 'sign_unit';
  }
  if (
    subj === 'maths' ||
    subj === 'fmaths' ||
    subj === 'phys' ||
    subj === 'chem' ||
    subj === 'econ' ||
    /[=+\-×÷^√∫]|calculate|find the value|solve|evaluate|formula|sql|select\s/i.test(plain)
  ) {
    return 'formula_calc';
  }
  return 'concept_recall';
}

export function upsertMistakeRecord(
  vault: Record<string, MistakeEntry>,
  q: Question,
  subj: SubjectId,
  pickedIdx: number,
  source: MistakeEntry['source'],
  day = today()
): Record<string, MistakeEntry> {
  const existing = vault[q.id];
  return {
    ...vault,
    [q.id]: {
      qid: q.id,
      subj,
      tid: q.t,
      trap: existing?.trap || classifyMistakeTrap(q, subj),
      missCount: (existing?.missCount || 0) + 1,
      clearCount: 0, // Reset graduation counter when missed again
      lastMissedDay: day,
      lastClearedDay: null,
      pickedIdx,
      source,
    },
  };
}

/**
 * Records a correct redemption answer in the Mistake Vault.
 * Enforces the 2-separate-day rule (or immediate graduation when `allowSameDay` is enabled for intensive drills).
 */
export function redeemMistakeRecord(
  vault: Record<string, MistakeEntry>,
  qid: string,
  day = today(),
  allowSameDay = false
): {
  nextVault: Record<string, MistakeEntry>;
  graduated: boolean;
  countedToday: boolean;
} {
  const entry = vault[qid];
  if (!entry) return { nextVault: vault, graduated: false, countedToday: false };

  if (!allowSameDay && entry.lastClearedDay === day) {
    return { nextVault: vault, graduated: false, countedToday: false };
  }

  const nextClears = entry.clearCount + 1;
  if (nextClears >= 2) {
    const nextVault = { ...vault };
    delete nextVault[qid];
    return { nextVault, graduated: true, countedToday: true };
  }

  return {
    nextVault: {
      ...vault,
      [qid]: {
        ...entry,
        clearCount: nextClears,
        lastClearedDay: day,
      },
    },
    graduated: false,
    countedToday: true,
  };
}

export function summarizeMistakeVault(vault: Record<string, MistakeEntry>) {
  const list = Object.values(vault).sort((a, b) => b.lastMissedDay - a.lastMissedDay || b.missCount - a.missCount);
  const byTrap: Record<MistakeTrapCategory, number> = {
    formula_calc: 0,
    sign_unit: 0,
    exception_wording: 0,
    concept_recall: 0,
  };
  const bySubj: Partial<Record<SubjectId, number>> = {};
  for (const item of list) {
    byTrap[item.trap] = (byTrap[item.trap] || 0) + 1;
    bySubj[item.subj] = (bySubj[item.subj] || 0) + 1;
  }
  return { total: list.length, list, byTrap, bySubj };
}
