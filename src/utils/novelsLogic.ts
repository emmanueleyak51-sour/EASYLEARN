import type { ExamTrack, SubjectId, UserProgress } from '../types';
import {
  JAMB_WAEC_NOVELS,
  type NovelChapterGuide,
  type NovelExamCategory,
  type NovelExamQuestion,
  type PrescribedNovel,
} from '../data/jambWaecNovels';
import {
  getChapterEnhancement,
  type NovelChapterEnhancement,
} from '../data/novelChapterEnhancements';

export type NovelShelfFilter = 'all' | NovelExamCategory;
export type NovelNarratorVoice = 'novelWarm' | 'novelClear' | 'novelClassic';

export interface NovelChapterQuizScore {
  best: number;
  total: number;
}

export interface NovelStudyEntryState {
  chaptersRead: number[];
  quizBestScore: number;
  quizTotal: number;
  notes: string;
  chapterQuizPassed: number[];
  chapterQuizScores: Record<number, NovelChapterQuizScore>;
  finalExamBestScore: number;
  finalExamTotal: number;
  finalExamPassed: boolean;
  rankPointsAwarded: number;
}

export interface NovelStudySummary {
  novelId: string;
  chaptersReadCount: number;
  totalChapters: number;
  chaptersPct: number;
  chapterQuizzesPassedCount: number;
  quizBestScore: number;
  quizTotal: number;
  quizPct: number;
  finalExamPassed: boolean;
  rankPointsAwarded: number;
  overallMasteryPct: number;
  hasNotes: boolean;
}

export interface NovelTtsBatchItem {
  chapterNumber: number;
  chapterIndex: number;
  title: string;
  narrationScript: string;
  enhancement: NovelChapterEnhancement;
}

export interface NovelGatheredExamQuestion extends NovelExamQuestion {
  sourceLabel: string;
  sourceChapterNumber: number | null;
}

export interface NovelFinalExamEvaluation {
  correctCount: number;
  totalQuestions: number;
  accuracyPct: number;
  passThresholdPct: number;
  passed: boolean;
  rankPointsEarned: number;
  xpEarned: number;
  missedChapterNumbers: number[];
}

export interface PersonalBookChapter {
  number: number;
  title: string;
  content: string;
  wordCount: number;
}

export const NOVEL_TTS_BATCH_SIZE = 5;
export const NOVEL_FINAL_EXAM_PASS_PCT = 70;

export function getNovelById(novelId: string): PrescribedNovel {
  return JAMB_WAEC_NOVELS.find((n) => n.id === novelId) || JAMB_WAEC_NOVELS[0];
}

export function getNovelCountsByCategory(novels: readonly PrescribedNovel[] = JAMB_WAEC_NOVELS): {
  all: number;
  'jamb-english': number;
  'african-prose': number;
  'non-african-prose': number;
} {
  return {
    all: novels.length,
    'jamb-english': novels.filter((n) => n.category === 'jamb-english').length,
    'african-prose': novels.filter((n) => n.category === 'african-prose').length,
    'non-african-prose': novels.filter((n) => n.category === 'non-african-prose').length,
  };
}

export function filterPrescribedNovels(
  filter: NovelShelfFilter,
  query: string,
  novels: readonly PrescribedNovel[] = JAMB_WAEC_NOVELS
): PrescribedNovel[] {
  const q = query.trim().toLowerCase();
  return novels.filter((novel) => {
    if (filter !== 'all' && novel.category !== filter) {
      return false;
    }
    if (!q) return true;
    const haystack = [
      novel.title,
      novel.author,
      novel.nationality,
      novel.syllabusWindow,
      novel.statusLabel,
      novel.setting,
      novel.logline,
      ...novel.examBodies,
      ...novel.characters.map((c) => `${c.name} ${c.role}`),
      ...novel.themes.map((t) => t.theme),
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });
}

export function getDefaultNovelIdForSubject(subj?: SubjectId): string {
  if (subj === 'lit') return 'so-the-path';
  return 'lekki-headmaster';
}

export function getRecommendedNovelsForStudent(
  examTrack: ExamTrack = 'jamb',
  enrolledSubjs: readonly SubjectId[] = ['eng']
): PrescribedNovel[] {
  const takesLit = enrolledSubjs.includes('lit');
  if (examTrack === 'jamb' && !takesLit) {
    return JAMB_WAEC_NOVELS.filter((n) => n.category === 'jamb-english');
  }
  if (examTrack === 'waec' && takesLit) {
    return JAMB_WAEC_NOVELS.filter((n) => n.subjectId === 'lit');
  }
  return [...JAMB_WAEC_NOVELS];
}

function serializeNovelEntry(entry: NovelStudyEntryState) {
  return {
    chaptersRead: entry.chaptersRead,
    quizBestScore: entry.quizBestScore,
    quizTotal: entry.quizTotal,
    notes: entry.notes,
    chapterQuizPassed: entry.chapterQuizPassed,
    chapterQuizScores: entry.chapterQuizScores,
    finalExamBestScore: entry.finalExamBestScore,
    finalExamTotal: entry.finalExamTotal,
    finalExamPassed: entry.finalExamPassed,
    rankPointsAwarded: entry.rankPointsAwarded,
  };
}

export function readNovelEntryFromProgress(
  progress: Pick<UserProgress, 'novelProgress' | 'novelNotebook'> | undefined,
  novelId: string
): NovelStudyEntryState {
  const entry = progress?.novelProgress?.[novelId];
  if (entry) {
    const cleanChapters = Array.isArray(entry.chaptersRead)
      ? Array.from(new Set(entry.chaptersRead.filter((n) => Number.isInteger(n) && n >= 1))).sort(
          (a, b) => a - b
        )
      : [];
    const cleanPassed = Array.isArray(entry.chapterQuizPassed)
      ? Array.from(
          new Set(entry.chapterQuizPassed.filter((n) => Number.isInteger(n) && n >= 1))
        ).sort((a, b) => a - b)
      : [];
    const cleanScores: Record<number, NovelChapterQuizScore> = {};
    if (entry.chapterQuizScores && typeof entry.chapterQuizScores === 'object') {
      for (const [k, v] of Object.entries(entry.chapterQuizScores)) {
        const chNum = Number(k);
        if (Number.isInteger(chNum) && chNum >= 1 && v && typeof v === 'object') {
          const total = Math.max(1, Math.floor(Number(v.total) || 1));
          const best = Math.max(0, Math.min(total, Math.floor(Number(v.best) || 0)));
          cleanScores[chNum] = { best, total };
        }
      }
    }
    return {
      chaptersRead: cleanChapters,
      quizBestScore: Math.max(0, Math.floor(Number(entry.quizBestScore) || 0)),
      quizTotal: Math.max(0, Math.floor(Number(entry.quizTotal) || 0)),
      notes: typeof entry.notes === 'string' ? entry.notes.slice(0, 4000) : '',
      chapterQuizPassed: cleanPassed,
      chapterQuizScores: cleanScores,
      finalExamBestScore: Math.max(0, Math.floor(Number(entry.finalExamBestScore) || 0)),
      finalExamTotal: Math.max(0, Math.floor(Number(entry.finalExamTotal) || 0)),
      finalExamPassed: Boolean(entry.finalExamPassed),
      rankPointsAwarded: Math.max(0, Math.floor(Number(entry.rankPointsAwarded) || 0)),
    };
  }

  // Seamless fallback if legacy novelNotebook had chapters recorded for primary JAMB novel
  if (novelId === 'lekki-headmaster' && progress?.novelNotebook) {
    const legacyChapters = Array.isArray(progress.novelNotebook.chaptersRead)
      ? Array.from(
          new Set(progress.novelNotebook.chaptersRead.filter((n) => Number.isInteger(n) && n >= 1))
        ).sort((a, b) => a - b)
      : [];
    const combinedLegacyNotes = [
      progress.novelNotebook.characters,
      progress.novelNotebook.themes,
      progress.novelNotebook.events,
    ]
      .filter(Boolean)
      .join('\n')
      .trim();
    return {
      chaptersRead: legacyChapters,
      quizBestScore: 0,
      quizTotal: 0,
      notes: combinedLegacyNotes.slice(0, 4000),
      chapterQuizPassed: [],
      chapterQuizScores: {},
      finalExamBestScore: 0,
      finalExamTotal: 0,
      finalExamPassed: false,
      rankPointsAwarded: 0,
    };
  }

  return {
    chaptersRead: [],
    quizBestScore: 0,
    quizTotal: 0,
    notes: '',
    chapterQuizPassed: [],
    chapterQuizScores: {},
    finalExamBestScore: 0,
    finalExamTotal: 0,
    finalExamPassed: false,
    rankPointsAwarded: 0,
  };
}

export function computeNovelStudyStats(
  novel: PrescribedNovel,
  progress?: Pick<UserProgress, 'novelProgress' | 'novelNotebook'>
): NovelStudySummary {
  const entry = readNovelEntryFromProgress(progress, novel.id);
  const validChapterNums = new Set(novel.chapters.map((c) => c.number));
  const readValid = entry.chaptersRead.filter((n) => validChapterNums.has(n));
  const passedQuizzesValid = entry.chapterQuizPassed.filter((n) => validChapterNums.has(n));
  const totalChapters = Math.max(1, novel.chapters.length);
  const chaptersPct = Math.min(100, Math.round((readValid.length / totalChapters) * 100));

  const gatheredTotal = buildNovelFinalExamQuestions(novel).length;
  const effectiveTotal = entry.finalExamTotal > 0 ? entry.finalExamTotal : Math.max(1, novel.questions.length);
  const effectiveBest =
    entry.finalExamTotal > 0
      ? Math.min(entry.finalExamTotal, entry.finalExamBestScore)
      : Math.min(effectiveTotal, entry.quizBestScore);
  const quizPct =
    entry.finalExamTotal > 0
      ? Math.min(100, Math.round((effectiveBest / Math.max(1, entry.finalExamTotal)) * 100))
      : entry.quizTotal > 0
        ? Math.min(100, Math.round((Math.min(novel.questions.length, entry.quizBestScore) / Math.max(1, novel.questions.length)) * 100))
        : 0;

  const chapterCheckPct = Math.min(100, Math.round((passedQuizzesValid.length / totalChapters) * 100));
  const overallMasteryPct =
    entry.finalExamTotal > 0 || entry.quizTotal > 0
      ? Math.round(chaptersPct * 0.4 + chapterCheckPct * 0.25 + quizPct * 0.35)
      : Math.round(chaptersPct * 0.55 + chapterCheckPct * 0.25);

  return {
    novelId: novel.id,
    chaptersReadCount: readValid.length,
    totalChapters,
    chaptersPct,
    chapterQuizzesPassedCount: passedQuizzesValid.length,
    quizBestScore: entry.finalExamTotal > 0 ? effectiveBest : Math.min(novel.questions.length, entry.quizBestScore),
    quizTotal: entry.finalExamTotal > 0 ? gatheredTotal : entry.quizTotal > 0 ? novel.questions.length : 0,
    quizPct,
    finalExamPassed: entry.finalExamPassed,
    rankPointsAwarded: entry.rankPointsAwarded,
    overallMasteryPct: Math.min(100, overallMasteryPct),
    hasNotes: entry.notes.trim().length > 0,
  };
}

export function computeOverallNovelsProgress(
  progress?: Pick<UserProgress, 'novelProgress' | 'novelNotebook'>,
  novels: readonly PrescribedNovel[] = JAMB_WAEC_NOVELS
): {
  chaptersReadTotal: number;
  chaptersAvailableTotal: number;
  novelsStartedCount: number;
  novelsCompletedCount: number;
  totalNovelRankPoints: number;
} {
  let chaptersReadTotal = 0;
  let chaptersAvailableTotal = 0;
  let novelsStartedCount = 0;
  let novelsCompletedCount = 0;
  let totalNovelRankPoints = 0;

  for (const novel of novels) {
    const stats = computeNovelStudyStats(novel, progress);
    chaptersReadTotal += stats.chaptersReadCount;
    chaptersAvailableTotal += stats.totalChapters;
    totalNovelRankPoints += stats.rankPointsAwarded;
    if (
      stats.chaptersReadCount > 0 ||
      stats.chapterQuizzesPassedCount > 0 ||
      stats.quizTotal > 0 ||
      stats.hasNotes
    ) {
      novelsStartedCount += 1;
    }
    if (stats.finalExamPassed || (stats.chaptersPct === 100 && stats.quizPct >= 75)) {
      novelsCompletedCount += 1;
    }
  }

  return {
    chaptersReadTotal,
    chaptersAvailableTotal,
    novelsStartedCount,
    novelsCompletedCount,
    totalNovelRankPoints,
  };
}

export function toggleNovelChapterRead(
  prevMap: UserProgress['novelProgress'],
  novelId: string,
  chapterNumber: number,
  legacyNotebook?: UserProgress['novelNotebook']
): NonNullable<UserProgress['novelProgress']> {
  const novel = getNovelById(novelId);
  const validNums = new Set(novel.chapters.map((c) => c.number));
  if (!validNums.has(chapterNumber)) {
    return { ...(prevMap || {}) };
  }
  const current = readNovelEntryFromProgress(
    { novelProgress: prevMap, novelNotebook: legacyNotebook },
    novelId
  );
  const exists = current.chaptersRead.includes(chapterNumber);
  const nextChapters = exists
    ? current.chaptersRead.filter((c) => c !== chapterNumber)
    : [...current.chaptersRead, chapterNumber].sort((a, b) => a - b);

  return {
    ...(prevMap || {}),
    [novelId]: serializeNovelEntry({
      ...current,
      chaptersRead: nextChapters,
    }),
  };
}

export function recordNovelChapterQuiz(
  prevMap: UserProgress['novelProgress'],
  novelId: string,
  chapterNumber: number,
  score: number,
  total: number,
  legacyNotebook?: UserProgress['novelNotebook']
): {
  novelProgress: NonNullable<UserProgress['novelProgress']>;
  passed: boolean;
} {
  const novel = getNovelById(novelId);
  const validNums = new Set(novel.chapters.map((c) => c.number));
  if (!validNums.has(chapterNumber)) {
    return { novelProgress: { ...(prevMap || {}) }, passed: false };
  }
  const current = readNovelEntryFromProgress(
    { novelProgress: prevMap, novelNotebook: legacyNotebook },
    novelId
  );
  const safeTotal = Math.max(1, Math.floor(total));
  const safeScore = Math.max(0, Math.min(safeTotal, Math.floor(score)));
  const passed = safeScore >= Math.ceil(safeTotal * 0.5);
  const prevBest = current.chapterQuizScores[chapterNumber]?.best || 0;
  const nextScores = {
    ...current.chapterQuizScores,
    [chapterNumber]: { best: Math.max(prevBest, safeScore), total: safeTotal },
  };
  const nextPassed = passed
    ? Array.from(new Set([...current.chapterQuizPassed, chapterNumber])).sort((a, b) => a - b)
    : current.chapterQuizPassed;
  const nextChaptersRead = passed
    ? Array.from(new Set([...current.chaptersRead, chapterNumber])).sort((a, b) => a - b)
    : current.chaptersRead;

  return {
    passed,
    novelProgress: {
      ...(prevMap || {}),
      [novelId]: serializeNovelEntry({
        ...current,
        chaptersRead: nextChaptersRead,
        chapterQuizPassed: nextPassed,
        chapterQuizScores: nextScores,
      }),
    },
  };
}

export function recordNovelQuizScore(
  prevMap: UserProgress['novelProgress'],
  novelId: string,
  score: number,
  total: number,
  legacyNotebook?: UserProgress['novelNotebook']
): NonNullable<UserProgress['novelProgress']> {
  const current = readNovelEntryFromProgress(
    { novelProgress: prevMap, novelNotebook: legacyNotebook },
    novelId
  );
  const safeTotal = Math.max(1, Math.floor(total));
  const safeScore = Math.max(0, Math.min(safeTotal, Math.floor(score)));
  const best = Math.max(current.quizBestScore, safeScore);

  return {
    ...(prevMap || {}),
    [novelId]: serializeNovelEntry({
      ...current,
      quizBestScore: best,
      quizTotal: safeTotal,
    }),
  };
}

export function updateNovelPersonalNotes(
  prevMap: UserProgress['novelProgress'],
  novelId: string,
  notes: string,
  legacyNotebook?: UserProgress['novelNotebook']
): NonNullable<UserProgress['novelProgress']> {
  const current = readNovelEntryFromProgress(
    { novelProgress: prevMap, novelNotebook: legacyNotebook },
    novelId
  );
  return {
    ...(prevMap || {}),
    [novelId]: serializeNovelEntry({
      ...current,
      notes: notes.slice(0, 4000),
    }),
  };
}

export function buildChapterNarrationScript(
  novel: PrescribedNovel,
  chapter: NovelChapterGuide,
  enhancement: NovelChapterEnhancement
): string {
  const eventsText = chapter.keyEvents.map((e, i) => `Point ${i + 1}: ${e}`).join(' ');
  return [
    `${novel.title}, by ${novel.author}.`,
    `${chapter.title}.`,
    chapter.summary,
    eventsText,
    `Visual memory anchor: ${enhancement.memoryAnchor}`,
    `Exam watchout: ${chapter.examTrap}`,
  ]
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 2600);
}

/**
 * Slices up to `batchSize` chapters (default 5) starting from the active chapter index,
 * returning narration-ready chapter objects for sequential Gemini TTS processing.
 */
export function getChapterTtsBatch(
  novel: PrescribedNovel,
  startChapterIndex: number,
  batchSize = NOVEL_TTS_BATCH_SIZE
): NovelTtsBatchItem[] {
  const safeSize = Math.max(1, Math.min(10, Math.floor(batchSize)));
  const clampedStart = Math.max(0, Math.min(novel.chapters.length - 1, Math.floor(startChapterIndex)));
  const slice = novel.chapters.slice(clampedStart, clampedStart + safeSize);

  return slice.map((chapter, offset) => {
    const enhancement = getChapterEnhancement(novel.id, chapter);
    return {
      chapterNumber: chapter.number,
      chapterIndex: clampedStart + offset,
      title: chapter.title,
      narrationScript: buildChapterNarrationScript(novel, chapter, enhancement),
      enhancement,
    };
  });
}

/**
 * Gathers ALL chapter comprehension questions across the entire novel plus the novel's
 * core exam questions into one unified End-of-Book Final Exam.
 */
export function buildNovelFinalExamQuestions(novel: PrescribedNovel): NovelGatheredExamQuestion[] {
  const gathered: NovelGatheredExamQuestion[] = [];
  const seenIds = new Set<string>();

  for (const ch of novel.chapters) {
    const enhancement = getChapterEnhancement(novel.id, ch);
    for (const q of enhancement.chapterQuiz) {
      if (seenIds.has(q.id)) continue;
      seenIds.add(q.id);
      gathered.push({
        ...q,
        sourceLabel: `Chapter ${ch.number}`,
        sourceChapterNumber: ch.number,
      });
    }
  }

  for (const q of novel.questions) {
    if (seenIds.has(q.id)) continue;
    seenIds.add(q.id);
    gathered.push({
      ...q,
      sourceLabel: 'Full Book Synthesis',
      sourceChapterNumber: null,
    });
  }

  return gathered;
}

export function getNovelMaxRankPoints(novel: PrescribedNovel): number {
  return novel.chapters.length >= 9 ? 25 : 20;
}

export function evaluateNovelFinalExam(
  novel: PrescribedNovel,
  answers: Record<string, number>,
  passThresholdPct = NOVEL_FINAL_EXAM_PASS_PCT
): NovelFinalExamEvaluation {
  const questions = buildNovelFinalExamQuestions(novel);
  const totalQuestions = questions.length;
  let correctCount = 0;
  const missedChapters = new Set<number>();

  for (const q of questions) {
    const picked = answers[q.id];
    if (picked === q.a) {
      correctCount += 1;
    } else if (q.sourceChapterNumber !== null) {
      missedChapters.add(q.sourceChapterNumber);
    }
  }

  const accuracyPct = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const passed = totalQuestions > 0 && accuracyPct >= passThresholdPct;
  const maxRp = getNovelMaxRankPoints(novel);
  const rankPointsEarned = passed
    ? Math.max(12, Math.round((accuracyPct / 100) * maxRp))
    : 0;
  const xpEarned = passed ? rankPointsEarned * 10 : 0;

  return {
    correctCount,
    totalQuestions,
    accuracyPct,
    passThresholdPct,
    passed,
    rankPointsEarned,
    xpEarned,
    missedChapterNumbers: Array.from(missedChapters).sort((a, b) => a - b),
  };
}

/**
 * Records the End-of-Book Final Exam result and calculates idempotent Rank Points & XP delta
 * (so a student cannot infinitely farm RP by retaking the same book, yet earns the upgrade delta
 * if they raise their passing accuracy from e.g. 72% to 96%).
 */
export function recordNovelFinalExamAndRankPoints(
  prevMap: UserProgress['novelProgress'],
  novel: PrescribedNovel,
  evaluation: NovelFinalExamEvaluation,
  legacyNotebook?: UserProgress['novelNotebook']
): {
  novelProgress: NonNullable<UserProgress['novelProgress']>;
  newlyAwardedRp: number;
  newlyAwardedXp: number;
} {
  const current = readNovelEntryFromProgress(
    { novelProgress: prevMap, novelNotebook: legacyNotebook },
    novel.id
  );
  const nextBestScore = Math.max(current.finalExamBestScore, evaluation.correctCount);
  const nextPassed = current.finalExamPassed || evaluation.passed;
  const prevRp = current.rankPointsAwarded;
  const nextRp = Math.max(prevRp, evaluation.rankPointsEarned);
  const newlyAwardedRp = Math.max(0, nextRp - prevRp);
  const newlyAwardedXp = newlyAwardedRp * 10;

  return {
    newlyAwardedRp,
    newlyAwardedXp,
    novelProgress: {
      ...(prevMap || {}),
      [novel.id]: serializeNovelEntry({
        ...current,
        quizBestScore: Math.max(current.quizBestScore, evaluation.correctCount),
        quizTotal: evaluation.totalQuestions,
        finalExamBestScore: nextBestScore,
        finalExamTotal: evaluation.totalQuestions,
        finalExamPassed: nextPassed,
        rankPointsAwarded: nextRp,
      }),
    },
  };
}

/**
 * Splits a student's own legally obtained personal `.txt` / `.md` book copy locally in-browser
 * into chapters (or clean ~2,200-char reading sections) for the 5-chapter Gemini TTS Reader.
 */
export function parseUploadedPersonalBook(
  rawText: string,
  fallbackTitle = 'Personal Book Copy'
): PersonalBookChapter[] {
  const normalized = rawText.replace(/\r\n/g, '\n').trim();
  if (!normalized) return [];

  const headingRegex = /^(?:chapter|part|prologue|epilogue)\s+[a-z0-9ivxlcdm]+.*$/gim;
  const matches = Array.from(normalized.matchAll(headingRegex));

  if (matches.length >= 2) {
    const chapters: PersonalBookChapter[] = [];
    for (let i = 0; i < matches.length; i += 1) {
      const start = matches[i].index ?? 0;
      const end = i + 1 < matches.length ? (matches[i + 1].index ?? normalized.length) : normalized.length;
      const heading = matches[i][0].trim().slice(0, 120);
      const body = normalized.slice(start + matches[i][0].length, end).trim();
      if (!body) continue;
      const words = body.split(/\s+/).filter(Boolean).length;
      chapters.push({
        number: chapters.length + 1,
        title: heading,
        content: body,
        wordCount: words,
      });
    }
    if (chapters.length > 0) return chapters;
  }

  // Fallback: chunk by paragraphs into crisp ~2,200-character readable chapters
  const paragraphs = normalized.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const chunks: PersonalBookChapter[] = [];
  let buf = '';
  for (const para of paragraphs) {
    if (buf.length > 0 && buf.length + para.length > 2200) {
      const content = buf.trim();
      chunks.push({
        number: chunks.length + 1,
        title: `${fallbackTitle} — Section ${chunks.length + 1}`,
        content,
        wordCount: content.split(/\s+/).filter(Boolean).length,
      });
      buf = para;
    } else {
      buf = buf ? `${buf}\n\n${para}` : para;
    }
  }
  if (buf.trim()) {
    const content = buf.trim();
    chunks.push({
      number: chunks.length + 1,
      title: `${fallbackTitle} — Section ${chunks.length + 1}`,
      content,
      wordCount: content.split(/\s+/).filter(Boolean).length,
    });
  }
  return chunks;
}

export function evaluateNovelQuizAnswer(
  novel: PrescribedNovel,
  questionIndex: number,
  pickedOptionIndex: number
): {
  isCorrect: boolean;
  correctOptionIndex: number;
  correctOptionText: string;
  explanation: string;
  trapNote: string;
} {
  const q = novel.questions[questionIndex];
  if (!q) {
    return {
      isCorrect: false,
      correctOptionIndex: 0,
      correctOptionText: '',
      explanation: '',
      trapNote: '',
    };
  }
  const isCorrect = pickedOptionIndex === q.a;
  return {
    isCorrect,
    correctOptionIndex: q.a,
    correctOptionText: q.o[q.a],
    explanation: q.explanation,
    trapNote: q.trapNote,
  };
}
