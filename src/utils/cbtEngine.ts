import type { Question, SubjectId, Topic, UserProgress } from '../types';
import { bankForTopic, perm } from './engine';
import { isWaecOnlySubject } from './examSubjects';
import { normalizeJambQuartet } from './examTrackLogic';

export type CbtExamMode = 'jamb' | 'waec';
export type CbtPresetId = 'sprint' | 'half' | 'full';

export interface CbtPreset {
  id: CbtPresetId;
  label: string;
  shortDesc: string;
  durationSec: number;
  jambPerSubj: { eng: number; other: number };
  waecCount: number;
}

export function isWaecOnlyCbtSubject(sid: SubjectId): boolean {
  return isWaecOnlySubject(sid);
}

export const CBT_PRESETS: Record<CbtPresetId, CbtPreset> = {
  sprint: {
    id: 'sprint',
    label: 'Quick 30 min',
    shortDesc: '45 questions (English 15, three subjects 10 each)',
    durationSec: 30 * 60,
    jambPerSubj: { eng: 15, other: 10 },
    waecCount: 25,
  },
  half: {
    id: 'half',
    label: 'Half paper 60 min',
    shortDesc: '90 questions (English 30, three subjects 20 each)',
    durationSec: 60 * 60,
    jambPerSubj: { eng: 30, other: 20 },
    waecCount: 40,
  },
  full: {
    id: 'full',
    label: 'Full UTME 120 min',
    shortDesc: '180 questions (English 60, three subjects 40 each)',
    durationSec: 120 * 60,
    jambPerSubj: { eng: 60, other: 40 },
    waecCount: 50,
  },
};

export interface CbtQuestionItem {
  key: string;
  subj: SubjectId;
  subjQuestionNo: number;
  subjQuestionTotal: number;
  topicId: string;
  topicName: string;
  q: Question;
  order: number[];
}

export interface CbtSubjectBreakdown {
  subj: SubjectId;
  correct: number;
  total: number;
  pct: number;
  jambScore100: number;
  waecGrade: string;
}

export interface CbtWeakTopic {
  subj: SubjectId;
  topicId: string;
  topicName: string;
  missed: number;
  total: number;
  marksLost: number;
}

export interface CbtDiagnosticReport {
  mode: CbtExamMode;
  rawCorrect: number;
  totalQuestions: number;
  accuracyPct: number;
  scaledScore: number;
  maxScale: number;
  waecGrade: string;
  standingLabel: string;
  bySubject: CbtSubjectBreakdown[];
  weakTopics: CbtWeakTopic[];
}

export function waecGradeFromPct(pct: number): string {
  if (pct >= 75) return 'A1';
  if (pct >= 70) return 'B2';
  if (pct >= 65) return 'B3';
  if (pct >= 60) return 'C4';
  if (pct >= 55) return 'C5';
  if (pct >= 50) return 'C6';
  if (pct >= 45) return 'D7';
  if (pct >= 40) return 'E8';
  return 'F9';
}

export function buildCbtPaper(
  mode: CbtExamMode,
  presetId: CbtPresetId,
  subjects: SubjectId[],
  progress: UserProgress,
  topicsBySubj: Record<SubjectId, Topic[]>,
  seedKey: string
): CbtQuestionItem[] {
  const preset = CBT_PRESETS[presetId];
  const chosenSubjs: SubjectId[] =
    mode === 'jamb'
      ? normalizeJambQuartet(
          subjects.length >= 4
            ? subjects
            : [...subjects, ...(progress.jambSubjects || []), ...progress.subjs]
        )
      : [subjects[0] || 'maths'];

  const paper: CbtQuestionItem[] = [];

  for (const sid of chosenSubjs) {
    const topics = topicsBySubj[sid] || [];
    const targetCount =
      mode === 'jamb'
        ? sid === 'eng'
          ? preset.jambPerSubj.eng
          : preset.jambPerSubj.other
        : preset.waecCount;

    const rawPool: { topic: Topic; q: Question }[] = [];
    for (const topic of topics) {
      for (const q of bankForTopic(progress, topic)) {
        rawPool.push({ topic, q });
      }
    }

    if (!rawPool.length) continue;

    // In JAMB mode, surface higher-difficulty (l >= 3) & look-alike trap questions first before lower-tier items
    const toughTier =
      mode === 'jamb'
        ? rawPool.filter((item) => item.q.l >= 3 || Boolean(item.q.w?.length))
        : [];
    const standardTier =
      mode === 'jamb'
        ? rawPool.filter((item) => !(item.q.l >= 3 || Boolean(item.q.w?.length)))
        : rawPool;

    const pickedItems: { topic: Topic; q: Question }[] = [];
    if (mode === 'jamb' && toughTier.length > 0) {
      const shuffledTough = perm(`${seedKey}|${sid}|tough|${toughTier.length}`, toughTier.length);
      for (let i = 0; i < shuffledTough.length && pickedItems.length < targetCount; i++) {
        pickedItems.push(toughTier[shuffledTough[i]]);
      }
      if (pickedItems.length < targetCount && standardTier.length > 0) {
        const shuffledStd = perm(`${seedKey}|${sid}|std|${standardTier.length}`, standardTier.length);
        for (let i = 0; i < shuffledStd.length && pickedItems.length < targetCount; i++) {
          pickedItems.push(standardTier[shuffledStd[i]]);
        }
      }
    }

    // If targetCount exceeds unique pool size, cycle deterministically
    let round = 0;
    while (pickedItems.length < targetCount) {
      const shuffledIdx = perm(`${seedKey}|${sid}|${rawPool.length}|r${round}`, rawPool.length);
      for (let i = 0; i < shuffledIdx.length && pickedItems.length < targetCount; i++) {
        pickedItems.push(rawPool[shuffledIdx[i]]);
      }
      round++;
      if (round > 10) break;
    }

    const totalForSubj = pickedItems.length;
    for (let i = 0; i < totalForSubj; i++) {
      const { topic, q } = pickedItems[i];
      paper.push({
        key: `${sid}:${q.id}:${i}`,
        subj: sid,
        subjQuestionNo: i + 1,
        subjQuestionTotal: totalForSubj,
        topicId: topic.id,
        topicName: topic.name,
        q,
        order: perm(`${seedKey}|opt|${sid}|${q.id}|${i}`, q.o.length),
      });
    }
  }

  return paper;
}

export function evaluateCbtSubmission(
  mode: CbtExamMode,
  paper: CbtQuestionItem[],
  answers: Record<string, number>
): CbtDiagnosticReport {
  const subjMap = new Map<SubjectId, { correct: number; total: number }>();
  const topicMap = new Map<string, CbtWeakTopic>();
  let rawCorrect = 0;

  for (const item of paper) {
    const picked = answers[item.key];
    const ok = picked !== undefined && picked === item.q.a;
    if (ok) rawCorrect++;

    const sRec = subjMap.get(item.subj) || { correct: 0, total: 0 };
    sRec.total++;
    if (ok) sRec.correct++;
    subjMap.set(item.subj, sRec);

    const tKey = `${item.subj}:${item.topicId}`;
    const tRec = topicMap.get(tKey) || {
      subj: item.subj,
      topicId: item.topicId,
      topicName: item.topicName,
      missed: 0,
      total: 0,
      marksLost: 0,
    };
    tRec.total++;
    if (!ok) tRec.missed++;
    topicMap.set(tKey, tRec);
  }

  const bySubject: CbtSubjectBreakdown[] = [];
  let jambAggregate = 0;

  for (const [subj, rec] of subjMap.entries()) {
    const pct = rec.total > 0 ? Math.round((rec.correct / rec.total) * 100) : 0;
    const jambScore100 = rec.total > 0 ? Math.round((rec.correct / rec.total) * 100) : 0;
    jambAggregate += jambScore100;
    bySubject.push({
      subj,
      correct: rec.correct,
      total: rec.total,
      pct,
      jambScore100,
      waecGrade: waecGradeFromPct(pct),
    });
  }

  const totalQuestions = paper.length;
  const accuracyPct = totalQuestions > 0 ? Math.round((rawCorrect / totalQuestions) * 100) : 0;
  const scaledScore = mode === 'jamb' ? jambAggregate : accuracyPct;
  const maxScale = mode === 'jamb' ? bySubject.length * 100 : 100;
  const waecGrade = waecGradeFromPct(accuracyPct);

  const weakTopics: CbtWeakTopic[] = [];
  for (const rec of topicMap.values()) {
    if (rec.missed <= 0) continue;
    const subjTotal = subjMap.get(rec.subj)?.total || 1;
    const perQWeight = mode === 'jamb' ? 100 / subjTotal : 100 / Math.max(1, totalQuestions);
    weakTopics.push({
      ...rec,
      marksLost: Math.max(1, Math.round(rec.missed * perQWeight)),
    });
  }
  weakTopics.sort((a, b) => b.marksLost - a.marksLost || b.missed - a.missed);

  let standingLabel = 'Keep practising weak topics';
  if (mode === 'jamb') {
    if (scaledScore >= 300) standingLabel = 'Strong score for competitive courses';
    else if (scaledScore >= 250) standingLabel = 'Solid university cut-off range';
    else if (scaledScore >= 200) standingLabel = 'Above general cut-off — keep building';
    else standingLabel = 'Focus on core topics to lift your score';
  } else {
    if (accuracyPct >= 75) standingLabel = 'Distinction level (A1)';
    else if (accuracyPct >= 65) standingLabel = 'Very good credit (B2–B3)';
    else if (accuracyPct >= 50) standingLabel = 'Credit pass (C4–C6)';
    else standingLabel = 'Below credit — practise missed topics';
  }

  return {
    mode,
    rawCorrect,
    totalQuestions,
    accuracyPct,
    scaledScore,
    maxScale,
    waecGrade,
    standingLabel,
    bySubject,
    weakTopics,
  };
}
