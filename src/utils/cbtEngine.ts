import type { Question, SubjectId, Topic, UserProgress } from '../types';
import { bankForTopic, perm } from './engine';

export type CbtExamMode = 'jamb' | 'waec';
export type CbtPresetId = 'sprint' | 'half' | 'full';

export interface CbtPreset {
  id: CbtPresetId;
  label: string;
  durationSec: number;
  jambPerSubj: { eng: number; other: number };
  waecCount: number;
}

export const CBT_PRESETS: Record<CbtPresetId, CbtPreset> = {
  sprint: {
    id: 'sprint',
    label: 'Quick CBT (30 min)',
    durationSec: 30 * 60,
    jambPerSubj: { eng: 12, other: 10 },
    waecCount: 25,
  },
  half: {
    id: 'half',
    label: 'Half Mock (60 min)',
    durationSec: 60 * 60,
    jambPerSubj: { eng: 25, other: 20 },
    waecCount: 40,
  },
  full: {
    id: 'full',
    label: 'Full Exam (120 min)',
    durationSec: 120 * 60,
    jambPerSubj: { eng: 60, other: 40 },
    waecCount: 50,
  },
};

export interface CbtQuestionItem {
  key: string;
  subj: SubjectId;
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
      ? (['eng', ...subjects.filter((s) => s !== 'eng').slice(0, 3)] as SubjectId[])
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

    const pool: { topic: Topic; q: Question }[] = [];
    for (const topic of topics) {
      for (const q of bankForTopic(progress, topic)) {
        pool.push({ topic, q });
      }
    }

    if (!pool.length) continue;
    const shuffledIdx = perm(`${seedKey}|${sid}|${pool.length}`, pool.length);
    const take = Math.min(targetCount, pool.length);

    for (let i = 0; i < take; i++) {
      const { topic, q } = pool[shuffledIdx[i]];
      paper.push({
        key: `${sid}:${q.id}:${i}`,
        subj: sid,
        topicId: topic.id,
        topicName: topic.name,
        q,
        order: perm(`${seedKey}|opt|${sid}|${q.id}`, q.o.length),
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

  // Estimate marks lost per weak topic
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

  let standingLabel = 'Needs targeted revision';
  if (mode === 'jamb') {
    if (scaledScore >= 300) standingLabel = 'Merit / First-Choice Competitive';
    else if (scaledScore >= 250) standingLabel = 'Strong University Cutoff Range';
    else if (scaledScore >= 200) standingLabel = 'Above General Cutoff — Push Higher';
    else standingLabel = 'Foundation Recovery Needed';
  } else {
    if (accuracyPct >= 75) standingLabel = 'A1 Distinction Standard';
    else if (accuracyPct >= 65) standingLabel = 'Very Good Credit (B2–B3)';
    else if (accuracyPct >= 50) standingLabel = 'Credit Pass (C4–C6)';
    else standingLabel = 'Below Credit — Fix Weak Topics';
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
