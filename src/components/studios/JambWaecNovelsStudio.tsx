import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { SubjectId, UserProgress } from '../../types';
import {
  JAMB_WAEC_NOVELS,
  type NovelArtworkKey,
  type PrescribedNovel,
} from '../../data/jambWaecNovels';
import { getChapterEnhancement } from '../../data/novelChapterEnhancements';
import {
  NOVEL_FINAL_EXAM_PASS_PCT,
  NOVEL_TTS_BATCH_SIZE,
  buildNovelFinalExamQuestions,
  computeNovelStudyStats,
  computeOverallNovelsProgress,
  evaluateNovelFinalExam,
  filterPrescribedNovels,
  getChapterTtsBatch,
  getNovelById,
  getNovelCountsByCategory,
  getNovelMaxRankPoints,
  parseUploadedPersonalBook,
  readNovelEntryFromProgress,
  recordNovelChapterQuiz,
  recordNovelFinalExamAndRankPoints,
  toggleNovelChapterRead,
  updateNovelPersonalNotes,
  type NovelFinalExamEvaluation,
  type NovelNarratorVoice,
  type NovelShelfFilter,
  type PersonalBookChapter,
} from '../../utils/novelsLogic';
import {
  decodeTtsBase64Audio,
  playStudioWavPayload,
  unlockStudioAudioOnGesture,
  type ActiveAudioHandle,
  type DecodedTtsPayload,
} from '../../utils/studioAudioPlayer';
import { NOVEL_SCENE_ARTWORK } from './novelSceneArtwork';
import { Icon } from '../Icons';
import { SmoothProgressBar } from '../ULessonMotion';
import {
  loadReadingComfortPrefs,
  saveReadingComfortPrefs,
  triggerLightHaptic,
  type ReadingComfortPrefs,
  type ReadingFontScale,
  type ReadingSurface,
} from '../../utils/readingComfortLogic';

import lekkiCoverUrl from '../../assets/images/novel_lekki_headmaster_1795401841840.jpg';
import lifeChangerCoverUrl from '../../assets/images/novel_life_changer_1795401841190.jpg';
import africanProseCoverUrl from '../../assets/images/novel_african_prose_1795401840831.jpg';
import nonAfricanProseCoverUrl from '../../assets/images/novel_non_african_prose_1795401840181.jpg';

export const NOVEL_COVER_URLS: Record<NovelArtworkKey, string> = {
  lekki: lekkiCoverUrl,
  'life-changer': lifeChangerCoverUrl,
  african: africanProseCoverUrl,
  'non-african': nonAfricanProseCoverUrl,
};

export function getCurriculumTopicForNovel(novel: PrescribedNovel): {
  subj: 'eng' | 'lit';
  topicId: string;
  label: string;
} {
  if (novel.id === 'lekki-headmaster') {
    return {
      subj: 'eng',
      topicId: 'e-jamb-lekki',
      label: 'Open Use of English Syllabus Lesson',
    };
  }
  if (novel.id === 'life-changer') {
    return {
      subj: 'eng',
      topicId: 'e-jamb-lifechanger',
      label: 'Open Use of English Syllabus Lesson',
    };
  }
  if (novel.category === 'non-african-prose') {
    return {
      subj: 'lit',
      topicId: 'lit-nonafrican-prose-set',
      label: 'Open Non-African Prose Syllabus Lesson',
    };
  }
  return {
    subj: 'lit',
    topicId: 'lit-african-prose-set',
    label: 'Open African Prose Syllabus Lesson',
  };
}

type NovelWorkbenchTab =
  | 'chapters'
  | 'final-exam'
  | 'characters'
  | 'themes'
  | 'essays'
  | 'personal-copy';

type TtsChapterStatus = 'queued' | 'processing' | 'ready' | 'playing' | 'done' | 'error';

interface ActiveTtsBatchItemState {
  key: string;
  chapterNumber: number;
  chapterIndex: number;
  title: string;
  script: string;
  status: TtsChapterStatus;
  errorMsg?: string;
}

export interface JambWaecNovelsStudioProps {
  progress?: Pick<UserProgress, 'novelProgress' | 'novelNotebook'>;
  initialNovelId?: string;
  initialFilter?: NovelShelfFilter;
  onToggleChapterRead?: (novelId: string, chapterNumber: number) => void;
  onRecordChapterQuiz?: (
    novelId: string,
    chapterNumber: number,
    score: number,
    total: number
  ) => void;
  onRecordQuizScore?: (novelId: string, score: number, total: number) => void;
  onCompleteFinalExam?: (
    novelId: string,
    evaluation: NovelFinalExamEvaluation
  ) => {
    newlyAwardedRp: number;
    newlyAwardedXp: number;
  };
  onUpdateNotes?: (novelId: string, notes: string) => void;
  onOpenCurriculumTopic?: (subj: SubjectId, topicId: string) => void;
}

export function NovelBookCover({
  novel,
  className = '',
  showOverlayLabel = false,
}: {
  novel: PrescribedNovel;
  className?: string;
  showOverlayLabel?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const src = NOVEL_COVER_URLS[novel.artworkKey];

  if (failed || !src) {
    return (
      <div
        className={`relative overflow-hidden bg-[var(--acc-soft)] border border-[var(--acc-line)] flex flex-col justify-between p-3 select-none ${className}`}
      >
        <div className="text-[10.5px] font-bold text-[var(--gold)] truncate">
          {novel.examBodies.join(' · ')}
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="font-[var(--display)] font-extrabold text-[13px] leading-tight text-[var(--ink)] line-clamp-2">
            {novel.title}
          </div>
          <div className="text-[11px] text-[var(--dim)] truncate">{novel.author}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden bg-[var(--bg)] border border-[var(--line)] ${className}`}
    >
      <img
        src={src}
        alt={`${novel.title} by ${novel.author} cover illustration`}
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="w-full h-full object-cover"
      />
      {showOverlayLabel && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex flex-col justify-end p-3">
          <div className="font-[var(--display)] font-bold text-[12.5px] leading-snug text-white line-clamp-2">
            {novel.title}
          </div>
          <div className="text-[11px] text-white/85 truncate">{novel.author}</div>
        </div>
      )}
    </div>
  );
}

const NARRATOR_OPTIONS: { id: NovelNarratorVoice; label: string }[] = [
  { id: 'novelWarm', label: 'Warm Storyteller' },
  { id: 'novelClear', label: 'Clear Lit Coach' },
  { id: 'novelClassic', label: 'Classic Narrator' },
];

const SPEED_OPTIONS = [0.9, 1.0, 1.15] as const;

export function JambWaecNovelsStudio({
  progress,
  initialNovelId,
  initialFilter = 'all',
  onToggleChapterRead,
  onRecordChapterQuiz,
  onRecordQuizScore,
  onCompleteFinalExam,
  onUpdateNotes,
  onOpenCurriculumTopic,
}: JambWaecNovelsStudioProps) {
  const [shelfFilter, setShelfFilter] = useState<NovelShelfFilter>(initialFilter);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedNovelId, setSelectedNovelId] = useState<string>(
    () => initialNovelId || JAMB_WAEC_NOVELS[0].id
  );
  const [activeTab, setActiveTab] = useState<NovelWorkbenchTab>('chapters');
  const [activeChapterIdx, setActiveChapterIdx] = useState<number>(0);

  // Local fallback progress when rendered standalone
  const [localProgress, setLocalProgress] = useState<NonNullable<UserProgress['novelProgress']>>(
    {}
  );

  // Scene image fallback tracker
  const [failedSceneKeys, setFailedSceneKeys] = useState<Record<string, boolean>>({});

  // Chapter short-test state: key = `${novelId}:${chapterNumber}:${q.id}` -> picked option idx
  const [chapterQuizPicks, setChapterQuizPicks] = useState<Record<string, number>>({});
  const [chapterQuizSubmitted, setChapterQuizSubmitted] = useState<Record<string, boolean>>({});

  // End-of-book gathered final exam state
  const [finalExamIdx, setFinalExamIdx] = useState<number>(0);
  const [finalExamPicks, setFinalExamPicks] = useState<Record<string, number>>({});
  const [finalExamFinished, setFinalExamFinished] = useState<boolean>(false);
  const [finalExamRewardNotice, setFinalExamRewardNotice] = useState<{
    newlyAwardedRp: number;
    newlyAwardedXp: number;
  } | null>(null);

  const [notesSavedFeedback, setNotesSavedFeedback] = useState<boolean>(false);

  // Personal licensed full-book reader state (stays 100% private in browser memory)
  const [personalBookTitle, setPersonalBookTitle] = useState<string>('');
  const [personalChapters, setPersonalChapters] = useState<PersonalBookChapter[]>([]);
  const [personalChapterIdx, setPersonalChapterIdx] = useState<number>(0);
  const [personalPasteInput, setPersonalPasteInput] = useState<string>('');
  const [personalUploadError, setPersonalUploadError] = useState<string>('');

  // Gemini TTS 5-chapter audiobook engine state
  const [narratorVoice, setNarratorVoice] = useState<NovelNarratorVoice>('novelWarm');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [ttsBatch, setTtsBatch] = useState<ActiveTtsBatchItemState[]>([]);
  const [activePlayingKey, setActivePlayingKey] = useState<string | null>(null);
  const [ttsGlobalError, setTtsGlobalError] = useState<string>('');
  const [ttsModeLabel, setTtsModeLabel] = useState<string>('');
  const [comfort, setComfort] = useState<ReadingComfortPrefs>(() => loadReadingComfortPrefs());
  const [showComfortBar, setShowComfortBar] = useState<boolean>(false);

  const updateComfort = (patch: Partial<ReadingComfortPrefs>) => {
    triggerLightHaptic(8);
    setComfort((prev) => {
      const next = { ...prev, ...patch };
      saveReadingComfortPrefs(next);
      return next;
    });
  };

  const audioCacheRef = useRef<Map<string, DecodedTtsPayload>>(new Map());
  const activeHandleRef = useRef<ActiveAudioHandle | null>(null);
  const batchRunIdRef = useRef<number>(0);
  const activeBatchItemsRef = useRef<ActiveTtsBatchItemState[]>([]);
  const playbackSpeedRef = useRef<number>(1.0);

  useEffect(() => {
    playbackSpeedRef.current = playbackSpeed;
  }, [playbackSpeed]);

  const stopAudiobook = useCallback(() => {
    batchRunIdRef.current += 1;
    if (activeHandleRef.current) {
      activeHandleRef.current.stop();
      activeHandleRef.current = null;
    }
    setActivePlayingKey(null);
    setTtsBatch((prev) =>
      prev.map((item) => (item.status === 'playing' ? { ...item, status: 'ready' } : item))
    );
  }, []);

  useEffect(() => {
    return () => {
      batchRunIdRef.current += 1;
      if (activeHandleRef.current) {
        activeHandleRef.current.stop();
        activeHandleRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (initialNovelId) {
      setSelectedNovelId(initialNovelId);
      setActiveChapterIdx(0);
      setFinalExamIdx(0);
      setFinalExamPicks({});
      setFinalExamFinished(false);
      setFinalExamRewardNotice(null);
      stopAudiobook();
    }
  }, [initialNovelId, stopAudiobook]);

  const effectiveProgress = useMemo<Pick<UserProgress, 'novelProgress' | 'novelNotebook'>>(
    () => ({
      novelProgress: progress?.novelProgress ?? localProgress,
      novelNotebook: progress?.novelNotebook,
    }),
    [progress?.novelProgress, progress?.novelNotebook, localProgress]
  );

  const categoryCounts = useMemo(() => getNovelCountsByCategory(), []);
  const filteredNovels = useMemo(
    () => filterPrescribedNovels(shelfFilter, searchQuery),
    [shelfFilter, searchQuery]
  );
  const activeNovel = useMemo(() => getNovelById(selectedNovelId), [selectedNovelId]);
  const overallStats = useMemo(
    () => computeOverallNovelsProgress(effectiveProgress),
    [effectiveProgress]
  );
  const activeStats = useMemo(
    () => computeNovelStudyStats(activeNovel, effectiveProgress),
    [activeNovel, effectiveProgress]
  );
  const activeEntry = useMemo(
    () => readNovelEntryFromProgress(effectiveProgress, activeNovel.id),
    [effectiveProgress, activeNovel.id]
  );

  const activeChapter = activeNovel.chapters[activeChapterIdx] || activeNovel.chapters[0];
  const activeEnhancement = useMemo(
    () => getChapterEnhancement(activeNovel.id, activeChapter),
    [activeNovel.id, activeChapter]
  );
  const activeSceneMeta = NOVEL_SCENE_ARTWORK[activeEnhancement.sceneArtworkKey];

  const finalExamQuestions = useMemo(
    () => buildNovelFinalExamQuestions(activeNovel),
    [activeNovel]
  );
  const finalExamEvaluation = useMemo(
    () => evaluateNovelFinalExam(activeNovel, finalExamPicks, NOVEL_FINAL_EXAM_PASS_PCT),
    [activeNovel, finalExamPicks]
  );
  const maxBookRp = useMemo(() => getNovelMaxRankPoints(activeNovel), [activeNovel]);

  const previewBatch = useMemo(
    () => getChapterTtsBatch(activeNovel, activeChapterIdx, NOVEL_TTS_BATCH_SIZE),
    [activeNovel, activeChapterIdx]
  );

  const handleSelectNovel = (novelId: string) => {
    stopAudiobook();
    setTtsBatch([]);
    setTtsGlobalError('');
    setSelectedNovelId(novelId);
    setActiveChapterIdx(0);
    setFinalExamIdx(0);
    setFinalExamPicks({});
    setFinalExamFinished(false);
    setFinalExamRewardNotice(null);
    setActiveTab('chapters');
  };

  const handleToggleChapter = (chapterNumber: number) => {
    if (onToggleChapterRead) {
      onToggleChapterRead(activeNovel.id, chapterNumber);
    } else {
      setLocalProgress((prev) => toggleNovelChapterRead(prev, activeNovel.id, chapterNumber));
    }
  };

  const handleChapterQuizSelect = (qId: string, optIdx: number) => {
    const chKey = `${activeNovel.id}:${activeChapter.number}`;
    if (chapterQuizSubmitted[chKey]) return;
    setChapterQuizPicks((prev) => ({
      ...prev,
      [`${chKey}:${qId}`]: optIdx,
    }));
  };

  const handleSubmitChapterQuiz = () => {
    const chKey = `${activeNovel.id}:${activeChapter.number}`;
    const qs = activeEnhancement.chapterQuiz;
    let right = 0;
    for (const q of qs) {
      if (chapterQuizPicks[`${chKey}:${q.id}`] === q.a) {
        right += 1;
      }
    }
    setChapterQuizSubmitted((prev) => ({ ...prev, [chKey]: true }));
    if (onRecordChapterQuiz) {
      onRecordChapterQuiz(activeNovel.id, activeChapter.number, right, qs.length);
    } else {
      setLocalProgress((prev) =>
        recordNovelChapterQuiz(prev, activeNovel.id, activeChapter.number, right, qs.length)
          .novelProgress
      );
    }
  };

  const handleRetryChapterQuiz = () => {
    const chKey = `${activeNovel.id}:${activeChapter.number}`;
    setChapterQuizSubmitted((prev) => ({ ...prev, [chKey]: false }));
    setChapterQuizPicks((prev) => {
      const next = { ...prev };
      for (const q of activeEnhancement.chapterQuiz) {
        delete next[`${chKey}:${q.id}`];
      }
      return next;
    });
  };

  const handlePickFinalExamOption = (questionId: string, optionIdx: number) => {
    if (finalExamPicks[questionId] !== undefined) return;
    setFinalExamPicks((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleFinishFinalExam = () => {
    const evalRes = evaluateNovelFinalExam(activeNovel, finalExamPicks, NOVEL_FINAL_EXAM_PASS_PCT);
    setFinalExamFinished(true);
    if (onCompleteFinalExam) {
      const reward = onCompleteFinalExam(activeNovel.id, evalRes);
      setFinalExamRewardNotice(reward);
    } else {
      const res = recordNovelFinalExamAndRankPoints(localProgress, activeNovel, evalRes);
      setLocalProgress(res.novelProgress);
      setFinalExamRewardNotice({
        newlyAwardedRp: res.newlyAwardedRp,
        newlyAwardedXp: res.newlyAwardedXp,
      });
    }
    if (onRecordQuizScore) {
      onRecordQuizScore(activeNovel.id, evalRes.correctCount, evalRes.totalQuestions);
    }
  };

  const handleResetFinalExam = () => {
    setFinalExamIdx(0);
    setFinalExamPicks({});
    setFinalExamFinished(false);
    setFinalExamRewardNotice(null);
  };

  const handleNotesChange = (val: string) => {
    if (onUpdateNotes) {
      onUpdateNotes(activeNovel.id, val);
    } else {
      setLocalProgress((prev) => updateNovelPersonalNotes(prev, activeNovel.id, val));
    }
    setNotesSavedFeedback(true);
    window.setTimeout(() => setNotesSavedFeedback(false), 1500);
  };

  // ── Gemini TTS 5-Chapter Batch Engine ───────────────────────────────────────
  const fetchOrGetChapterAudio = useCallback(
    async (cacheKey: string, text: string, voice: NovelNarratorVoice): Promise<DecodedTtsPayload> => {
      const cached = audioCacheRef.current.get(cacheKey);
      if (cached) return cached;

      const resp = await fetch('/api/novels/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.slice(0, 2600),
          voiceProfile: voice,
        }),
      });
      const body = await resp.json().catch(() => ({}));
      if (!resp.ok || !body?.audioBase64) {
        throw new Error(
          typeof body?.error === 'string'
            ? body.error
            : `Studio audio narrator could not generate audio (HTTP ${resp.status}).`
        );
      }
      const decoded = decodeTtsBase64Audio(body.audioBase64, body.mimeType || 'audio/wav');
      audioCacheRef.current.set(cacheKey, decoded);
      return decoded;
    },
    []
  );

  const playBatchItemAtIndex = useCallback(
    async (
      runId: number,
      idx: number,
      voice: NovelNarratorVoice,
      syncActiveChapter: (chapterIdx: number) => void
    ) => {
      if (batchRunIdRef.current !== runId) return;
      const items = activeBatchItemsRef.current;
      const item = items[idx];
      if (!item) {
        setActivePlayingKey(null);
        return;
      }

      syncActiveChapter(item.chapterIndex);

      const cacheKey = `${voice}:${item.key}`;
      let payload = audioCacheRef.current.get(cacheKey);
      if (!payload) {
        setTtsBatch((prev) =>
          prev.map((it) => (it.key === item.key ? { ...it, status: 'processing', errorMsg: undefined } : it))
        );
        try {
          payload = await fetchOrGetChapterAudio(cacheKey, item.script, voice);
        } catch (err) {
          if (batchRunIdRef.current !== runId) return;
          const message = err instanceof Error ? err.message : 'Unable to generate chapter narration audio.';
          setTtsGlobalError(message);
          setTtsBatch((prev) =>
            prev.map((it) => (it.key === item.key ? { ...it, status: 'error', errorMsg: message } : it))
          );
          setActivePlayingKey(null);
          return;
        }
      }

      if (batchRunIdRef.current !== runId) return;

      if (activeHandleRef.current) {
        activeHandleRef.current.stop();
        activeHandleRef.current = null;
      }

      setActivePlayingKey(item.key);
      setTtsBatch((prev) =>
        prev.map((it) =>
          it.key === item.key
            ? { ...it, status: 'playing', errorMsg: undefined }
            : it.status === 'playing'
              ? { ...it, status: 'ready' }
              : it
        )
      );

      try {
        const handle = await playStudioWavPayload(payload, {
          playbackRate: playbackSpeedRef.current,
          onEnded: () => {
            if (batchRunIdRef.current !== runId) return;
            setTtsBatch((prev) =>
              prev.map((it) => (it.key === item.key ? { ...it, status: 'done' } : it))
            );
            const nextIdx = idx + 1;
            if (nextIdx < activeBatchItemsRef.current.length) {
              void playBatchItemAtIndex(runId, nextIdx, voice, syncActiveChapter);
            } else {
              setActivePlayingKey(null);
            }
          },
          onError: (err) => {
            if (batchRunIdRef.current !== runId) return;
            setTtsGlobalError(err.message);
            setActivePlayingKey(null);
          },
        });
        if (batchRunIdRef.current !== runId) {
          handle.stop();
          return;
        }
        activeHandleRef.current = handle;
      } catch (err) {
        if (batchRunIdRef.current !== runId) return;
        const msg = err instanceof Error ? err.message : 'Audio playback was interrupted.';
        setTtsGlobalError(msg);
        setActivePlayingKey(null);
      }
    },
    [fetchOrGetChapterAudio]
  );

  const launchFiveChapterTtsBatch = useCallback(
    (
      batchItems: ActiveTtsBatchItemState[],
      modeLabel: string,
      syncActiveChapter: (chapterIdx: number) => void
    ) => {
      if (batchItems.length === 0) return;
      unlockStudioAudioOnGesture();
      if (activeHandleRef.current) {
        activeHandleRef.current.stop();
        activeHandleRef.current = null;
      }

      const runId = batchRunIdRef.current + 1;
      batchRunIdRef.current = runId;
      const voice = narratorVoice;
      setTtsGlobalError('');
      setTtsModeLabel(modeLabel);

      const initialized = batchItems.map((it) => ({
        ...it,
        status: (audioCacheRef.current.has(`${voice}:${it.key}`) ? 'ready' : 'queued') as TtsChapterStatus,
      }));
      activeBatchItemsRef.current = initialized;
      setTtsBatch(initialized);

      // Start playing item 0 as soon as ready, and pre-process all 5 chapters sequentially via Gemini TTS
      void (async () => {
        for (let i = 0; i < initialized.length; i += 1) {
          if (batchRunIdRef.current !== runId) return;
          const item = initialized[i];
          const cacheKey = `${voice}:${item.key}`;

          if (!audioCacheRef.current.has(cacheKey)) {
            setTtsBatch((prev) =>
              prev.map((it) =>
                it.key === item.key && it.status !== 'playing'
                  ? { ...it, status: 'processing', errorMsg: undefined }
                  : it
              )
            );
            try {
              await fetchOrGetChapterAudio(cacheKey, item.script, voice);
              if (batchRunIdRef.current !== runId) return;
              setTtsBatch((prev) =>
                prev.map((it) =>
                  it.key === item.key && it.status !== 'playing' ? { ...it, status: 'ready' } : it
                )
              );
            } catch (err) {
              if (batchRunIdRef.current !== runId) return;
              const message =
                err instanceof Error ? err.message : 'Audio narration failed for this chapter.';
              setTtsBatch((prev) =>
                prev.map((it) =>
                  it.key === item.key ? { ...it, status: 'error', errorMsg: message } : it
                )
              );
              if (i === 0) {
                setTtsGlobalError(message);
                return;
              }
              continue;
            }
          }

          if (i === 0 && batchRunIdRef.current === runId) {
            void playBatchItemAtIndex(runId, 0, voice, syncActiveChapter);
          }
        }
      })();
    },
    [fetchOrGetChapterAudio, narratorVoice, playBatchItemAtIndex]
  );

  const handleReadPrescribedFiveChapters = () => {
    const batch = getChapterTtsBatch(activeNovel, activeChapterIdx, NOVEL_TTS_BATCH_SIZE);
    const items: ActiveTtsBatchItemState[] = batch.map((b) => ({
      key: `novel:${activeNovel.id}:ch:${b.chapterNumber}`,
      chapterNumber: b.chapterNumber,
      chapterIndex: b.chapterIndex,
      title: b.title,
      script: b.narrationScript,
      status: 'queued',
    }));
    const firstCh = batch[0]?.chapterNumber ?? 1;
    const lastCh = batch[batch.length - 1]?.chapterNumber ?? firstCh;
    launchFiveChapterTtsBatch(
      items,
      `${activeNovel.title} · Ch. ${firstCh}–${lastCh}`,
      (idx) => setActiveChapterIdx(idx)
    );
  };

  const handleReadPersonalFiveChapters = () => {
    if (personalChapters.length === 0) return;
    const slice = personalChapters.slice(
      personalChapterIdx,
      personalChapterIdx + NOVEL_TTS_BATCH_SIZE
    );
    const items: ActiveTtsBatchItemState[] = slice.map((ch, offset) => ({
      key: `personal:${personalBookTitle || 'book'}:ch:${ch.number}`,
      chapterNumber: ch.number,
      chapterIndex: personalChapterIdx + offset,
      title: ch.title,
      script: `${ch.title}. ${ch.content}`.slice(0, 2600),
      status: 'queued',
    }));
    const firstCh = slice[0]?.number ?? 1;
    const lastCh = slice[slice.length - 1]?.number ?? firstCh;
    launchFiveChapterTtsBatch(
      items,
      `${personalBookTitle || 'My Licensed Book'} · Ch. ${firstCh}–${lastCh}`,
      (idx) => setPersonalChapterIdx(idx)
    );
  };

  const handleJumpToBatchChapter = (idx: number) => {
    unlockStudioAudioOnGesture();
    const runId = batchRunIdRef.current;
    const isPersonal = activeTab === 'personal-copy';
    void playBatchItemAtIndex(runId, idx, narratorVoice, (chIdx) => {
      if (isPersonal) setPersonalChapterIdx(chIdx);
      else setActiveChapterIdx(chIdx);
    });
  };

  const handlePersonalFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPersonalUploadError('');
    if (file.size > 4 * 1024 * 1024) {
      setPersonalUploadError('Please choose a plain-text (.txt or .md) book file under 4 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : '';
      const cleanTitle = file.name.replace(/\.(txt|md)$/i, '').trim() || 'My Licensed Book';
      const parsed = parseUploadedPersonalBook(text, cleanTitle);
      if (parsed.length === 0) {
        setPersonalUploadError('The uploaded file appears empty. Paste or upload a plain-text book copy.');
        return;
      }
      stopAudiobook();
      setPersonalBookTitle(cleanTitle);
      setPersonalChapters(parsed);
      setPersonalChapterIdx(0);
    };
    reader.onerror = () => {
      setPersonalUploadError('Could not read the selected file on this device.');
    };
    reader.readAsText(file);
  };

  const handleLoadPastedBook = () => {
    setPersonalUploadError('');
    const parsed = parseUploadedPersonalBook(
      personalPasteInput,
      personalBookTitle.trim() || `${activeNovel.title} (Personal Copy)`
    );
    if (parsed.length === 0) {
      setPersonalUploadError('Paste your legally owned book text first before loading chapters.');
      return;
    }
    stopAudiobook();
    setPersonalBookTitle(personalBookTitle.trim() || `${activeNovel.title} (Personal Copy)`);
    setPersonalChapters(parsed);
    setPersonalChapterIdx(0);
  };

  const topicLink = getCurriculumTopicForNovel(activeNovel);
  const currentChKey = `${activeNovel.id}:${activeChapter.number}`;
  const currentChQuiz = activeEnhancement.chapterQuiz;
  const currentChSubmitted = Boolean(chapterQuizSubmitted[currentChKey]);
  const currentChAnsweredCount = currentChQuiz.filter(
    (q) => chapterQuizPicks[`${currentChKey}:${q.id}`] !== undefined
  ).length;
  const currentChCorrectCount = currentChQuiz.filter(
    (q) => chapterQuizPicks[`${currentChKey}:${q.id}`] === q.a
  ).length;
  const currentChPassedSaved = activeEntry.chapterQuizPassed.includes(activeChapter.number);

  const currentFinalQ = finalExamQuestions[finalExamIdx] || finalExamQuestions[0];
  const answeredFinalCount = Object.keys(finalExamPicks).length;
  const batchRangeLabel =
    previewBatch.length > 1
      ? `Ch. ${previewBatch[0].chapterNumber}–${previewBatch[previewBatch.length - 1].chapterNumber}`
      : `Ch. ${activeChapter.number}`;

  return (
    <div className="flex flex-col gap-6">
      {/* ── Library Header & Live Progress Summary ── */}
      <section className="rtc-card rounded-2xl p-5 sm:p-7 flex flex-col gap-5">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="flex flex-col gap-1.5 max-w-2xl">
            <div className="text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--gold)]">
              Easy Learn Prescribed Literature · JAMB UTME &amp; WAEC/NECO
            </div>
            <h2 className="h24 sm:text-[28px] text-[var(--ink)] tracking-tight">
              Official JAMB &amp; WAEC Novels Studio
            </h2>
            <p className="text-[14px] text-[var(--dim)] leading-relaxed">
              Cross-checked chapter guides across all 8 prescribed novels — with visual event
              illustrations for memory retention, 5-chapter studio voice audiobook reading,
              end-of-chapter checks, and gathered end-of-book Rank Point exams.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 shrink-0">
            <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] px-3.5 py-2.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--dim)]">
                Books
              </div>
              <div className="font-[var(--display)] font-extrabold text-[20px] text-[var(--ink)] mt-0.5">
                {JAMB_WAEC_NOVELS.length}
              </div>
            </div>
            <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] px-3.5 py-2.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--dim)]">
                Chapters
              </div>
              <div className="font-[var(--display)] font-extrabold text-[20px] text-[var(--gold)] mt-0.5">
                {overallStats.chaptersReadTotal}/{overallStats.chaptersAvailableTotal}
              </div>
            </div>
            <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] px-3.5 py-2.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--dim)]">
                Novel RP
              </div>
              <div className="font-[var(--display)] font-extrabold text-[20px] text-[var(--green)] mt-0.5">
                +{overallStats.totalNovelRankPoints}
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter & Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-1 border-t border-[var(--line)]">
          <div className="flex items-center gap-1.5 flex-wrap">
            {(
              [
                { id: 'all', label: `All Books (${categoryCounts.all})` },
                { id: 'jamb-english', label: `JAMB English (${categoryCounts['jamb-english']})` },
                {
                  id: 'african-prose',
                  label: `African Prose (${categoryCounts['african-prose']})`,
                },
                {
                  id: 'non-african-prose',
                  label: `Non-African (${categoryCounts['non-african-prose']})`,
                },
              ] as const
            ).map((f) => {
              const active = shelfFilter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setShelfFilter(f.id)}
                  className={`min-h-[38px] px-3.5 rounded-xl text-[13px] font-bold border transition-colors cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-[var(--gold)] text-[var(--on-acc)] border-[var(--gold)]'
                      : 'bg-[var(--bg)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--gold)]'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          <div className="relative md:w-72">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search novel, author, character..."
              aria-label="Search JAMB and WAEC novels"
              className="w-full min-h-[40px] pl-3.5 pr-9 rounded-xl bg-[var(--bg)] border border-[var(--line)] focus:border-[var(--gold)] text-[13.5px] text-[var(--ink)] outline-none"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--dim)]">
              <Icon name="search" size={15} />
            </span>
          </div>
        </div>

        {/* Visual Bookshelf Grid */}
        {filteredNovels.length === 0 ? (
          <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-6 text-center text-[14px] text-[var(--dim)]">
            No prescribed novel matched “{searchQuery}”. Try searching for Bepo, Ummi, Fina, Bendu,
            Atticus, Adah, or Nii.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {filteredNovels.map((novel) => {
              const isSelected = novel.id === activeNovel.id;
              const stats = computeNovelStudyStats(novel, effectiveProgress);
              return (
                <button
                  key={novel.id}
                  type="button"
                  onClick={() => handleSelectNovel(novel.id)}
                  className={`group text-left rounded-2xl border p-3.5 flex flex-col gap-3 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--acc-soft)] border-[var(--gold)] shadow-sm'
                      : 'bg-[var(--bg)] border-[var(--line)] hover:border-[var(--gold)]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <NovelBookCover
                      novel={novel}
                      className="w-[58px] h-[82px] rounded-xl shrink-0"
                    />
                    <div className="min-w-0 flex-1 flex flex-col gap-1">
                      <div className="text-[11px] font-bold text-[var(--gold)] truncate">
                        {novel.examBodies.join(' · ')}
                      </div>
                      <h3 className="font-[var(--display)] font-extrabold text-[14.5px] leading-snug text-[var(--ink)] line-clamp-2">
                        {novel.title}
                      </h3>
                      <div className="text-[12px] text-[var(--dim)] truncate">{novel.author}</div>
                      <div className="text-[11.5px] font-semibold text-[var(--ink)]/75 mt-0.5">
                        {stats.rankPointsAwarded > 0
                          ? `Passed · +${stats.rankPointsAwarded} RP`
                          : `${stats.chapterQuizzesPassedCount}/${stats.totalChapters} checks`}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-[11.5px] font-semibold text-[var(--dim)]">
                      <span>
                        {stats.chaptersReadCount}/{stats.totalChapters} ch. read
                      </span>
                      <span className="text-[var(--ink)]">{stats.overallMasteryPct}%</span>
                    </div>
                    <SmoothProgressBar
                      value={stats.overallMasteryPct}
                      tone={stats.finalExamPassed ? 'emerald' : 'gold'}
                      ariaLabel={`${novel.title} mastery progress`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Active Novel Detailed Study Workbench ── */}
      <section className="rtc-card rounded-2xl overflow-hidden">
        {/* Book Hero Banner */}
        <div className="p-5 sm:p-7 border-b border-[var(--line)] bg-[var(--bg)]/55 flex flex-col md:flex-row gap-5 md:gap-7">
          <NovelBookCover
            novel={activeNovel}
            className="w-[126px] h-[178px] rounded-2xl shrink-0 shadow-md mx-auto md:mx-0"
          />

          <div className="flex-1 min-w-0 flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-[12px] font-bold text-[var(--gold)]">
                {activeNovel.statusLabel} · {activeNovel.syllabusWindow} ·{' '}
                {activeNovel.structureLabel}
              </div>
              {onOpenCurriculumTopic && (
                <button
                  type="button"
                  onClick={() => onOpenCurriculumTopic(topicLink.subj, topicLink.topicId)}
                  className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-[var(--gold)] hover:underline cursor-pointer whitespace-nowrap"
                >
                  <span>{topicLink.label}</span>
                  <Icon name="go" size={14} />
                </button>
              )}
            </div>

            <div>
              <h3 className="font-[var(--display)] font-extrabold text-[24px] sm:text-[28px] leading-tight text-[var(--ink)]">
                {activeNovel.title}
              </h3>
              <p className="text-[14px] font-semibold text-[var(--dim)] mt-0.5">
                By {activeNovel.author} ({activeNovel.nationality}) · {activeNovel.examBodies.join(' / ')}
              </p>
            </div>

            <p className="text-[14.5px] leading-relaxed text-[var(--ink)]/90">
              {activeNovel.overview}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-[12.5px]">
              <div className="rounded-xl bg-[var(--card)] border border-[var(--line)] px-3.5 py-2.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--dim)]">
                  Setting
                </div>
                <div className="font-semibold text-[var(--ink)] mt-0.5">{activeNovel.setting}</div>
              </div>
              <div className="rounded-xl bg-[var(--card)] border border-[var(--line)] px-3.5 py-2.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--dim)]">
                  Chapter Checks
                </div>
                <div className="font-semibold text-[var(--ink)] mt-0.5">
                  {activeStats.chapterQuizzesPassedCount} of {activeStats.totalChapters} passed
                </div>
              </div>
              <div className="rounded-xl bg-[var(--card)] border border-[var(--line)] px-3.5 py-2.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--dim)]">
                  Book Rank Points
                </div>
                <div className="font-semibold text-[var(--green)] mt-0.5">
                  {activeStats.rankPointsAwarded > 0
                    ? `+${activeStats.rankPointsAwarded} RP earned`
                    : `Up to +${maxBookRp} RP on Final Exam`}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Workbench Tabs */}
        <div
          role="tablist"
          aria-label="Novel study sections"
          className="px-4 sm:px-6 pt-3 border-b border-[var(--line)] flex items-center gap-1 overflow-x-auto"
        >
          {(
            [
              {
                id: 'chapters',
                label: `Read & Audio (${activeNovel.chapters.length})`,
              },
              {
                id: 'final-exam',
                label: `Final Exam (+${maxBookRp} RP)`,
              },
              { id: 'characters', label: `Characters (${activeNovel.characters.length})` },
              { id: 'themes', label: `Themes (${activeNovel.themes.length})` },
              { id: 'essays', label: 'Essays & Notes' },
              { id: 'personal-copy', label: 'My Full Copy' },
            ] as const
          ).map((t) => {
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(t.id)}
                className={`min-h-[42px] px-3 text-[13px] font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  active
                    ? 'border-[var(--gold)] text-[var(--gold)]'
                    : 'border-transparent text-[var(--dim)] hover:text-[var(--ink)]'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="p-5 sm:p-7">
          {/* ── TAB 1: CHAPTER READER + SCENE ILLUSTRATION + 5-CH GEMINI TTS + CHAPTER SHORT TEST ── */}
          {activeTab === 'chapters' && (
            <div className="flex flex-col gap-5">
              {/* Gemini TTS 5-Chapter Audiobook Studio Bar */}
              <div className="rounded-2xl bg-[var(--bg)] border border-[var(--line)] p-4 sm:p-5 flex flex-col gap-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
                  <div className="flex flex-col gap-0.5">
                    <div className="text-[11.5px] font-bold uppercase tracking-wider text-[var(--gold)]">
                      Studio Voice Reader · 5-Chapter Batch
                    </div>
                    <div className="font-[var(--display)] font-bold text-[16px] text-[var(--ink)]">
                      Listen hands-free while following event illustrations
                    </div>
                    <p className="text-[12.5px] text-[var(--dim)]">
                      Tap Read to narrate up to {NOVEL_TTS_BATCH_SIZE} chapters at once ({batchRangeLabel}) with natural studio voice playback and auto-advance.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <select
                      aria-label="Narrator voice style"
                      value={narratorVoice}
                      onChange={(e) => setNarratorVoice(e.target.value as NovelNarratorVoice)}
                      className="min-h-[40px] px-3 rounded-xl bg-[var(--card)] border border-[var(--line)] text-[13px] font-semibold text-[var(--ink)] cursor-pointer"
                    >
                      {NARRATOR_OPTIONS.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.label}
                        </option>
                      ))}
                    </select>

                    <div className="inline-flex items-center rounded-xl bg-[var(--card)] border border-[var(--line)] p-0.5">
                      {SPEED_OPTIONS.map((sp) => (
                        <button
                          key={sp}
                          type="button"
                          onClick={() => setPlaybackSpeed(sp)}
                          className={`min-h-[34px] px-2.5 rounded-lg text-[12px] font-bold cursor-pointer whitespace-nowrap ${
                            playbackSpeed === sp
                              ? 'bg-[var(--gold)] text-[var(--on-acc)]'
                              : 'text-[var(--dim)] hover:text-[var(--ink)]'
                          }`}
                        >
                          {sp}×
                        </button>
                      ))}
                    </div>

                    {activePlayingKey ? (
                      <button
                        type="button"
                        onClick={stopAudiobook}
                        className="min-h-[40px] px-4 rounded-xl bg-[var(--bad)] text-white text-[13px] font-bold inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
                      >
                        <Icon name="x" size={14} />
                        <span>Stop Reading</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleReadPrescribedFiveChapters}
                        className="min-h-[40px] px-4 rounded-xl bg-[var(--gold)] text-[var(--on-acc)] text-[13.5px] font-bold inline-flex items-center gap-2 hover:opacity-95 cursor-pointer whitespace-nowrap"
                      >
                        <Icon name="vol" size={15} />
                        <span>
                          Read {previewBatch.length} {previewBatch.length === 1 ? 'Chapter' : 'Chapters'} ({batchRangeLabel})
                        </span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Live 5-Chapter Batch Queue Strip */}
                {ttsBatch.length > 0 && (
                  <div className="flex flex-col gap-2 pt-3 border-t border-[var(--line)]">
                    <div className="flex items-center justify-between gap-2 text-[12px] font-semibold text-[var(--dim)]">
                      <span>Active 5-Chapter Batch · {ttsModeLabel}</span>
                      <span>
                        {ttsBatch.filter((b) => b.status === 'ready' || b.status === 'playing' || b.status === 'done').length}
                        /{ttsBatch.length} chapters processed
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                      {ttsBatch.map((item, idx) => {
                        const isPlaying = item.status === 'playing';
                        const isError = item.status === 'error';
                        const isDone = item.status === 'done';
                        const statusText =
                          item.status === 'playing'
                            ? 'Playing'
                            : item.status === 'processing'
                              ? 'Processing...'
                              : item.status === 'ready'
                                ? 'Ready'
                                : item.status === 'done'
                                  ? 'Finished'
                                  : item.status === 'error'
                                    ? 'Error'
                                    : 'Queued';
                        return (
                          <button
                            key={item.key}
                            type="button"
                            onClick={() => handleJumpToBatchChapter(idx)}
                            className={`text-left rounded-xl border px-3 py-2 transition-colors cursor-pointer ${
                              isPlaying
                                ? 'bg-[var(--acc-soft)] border-[var(--gold)] text-[var(--ink)]'
                                : isError
                                  ? 'bg-[var(--bad-soft)] border-[var(--bad-line)] text-[var(--ink)]'
                                  : isDone
                                    ? 'bg-[var(--ok-soft)] border-[var(--ok-line)] text-[var(--ink)]'
                                    : 'bg-[var(--card)] border-[var(--line)] text-[var(--ink)] hover:border-[var(--gold)]'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1 text-[11px] font-bold">
                              <span>Ch. {item.chapterNumber}</span>
                              <span
                                className={
                                  isPlaying
                                    ? 'text-[var(--gold)]'
                                    : isError
                                      ? 'text-[var(--bad)]'
                                      : isDone
                                        ? 'text-[var(--green)]'
                                        : 'text-[var(--dim)]'
                                }
                              >
                                {statusText}
                              </span>
                            </div>
                            <div className="text-[11.5px] text-[var(--dim)] truncate mt-0.5">
                              {item.title.replace(/^Chapter\s+\d+:\s*/i, '')}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {ttsGlobalError && (
                  <div className="rounded-xl bg-[var(--bad-soft)] border border-[var(--bad-line)] px-3.5 py-2.5 text-[13px] font-semibold text-[var(--bad)]">
                    {ttsGlobalError}
                  </div>
                )}
              </div>

              {/* Chapter Sidebar + Main Visual Reader & Short Comprehension Check */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Chapter List Sidebar */}
                <div className="lg:col-span-4 flex flex-col gap-2 max-h-[680px] overflow-y-auto pr-1">
                  {activeNovel.chapters.map((ch, idx) => {
                    const isRead = activeEntry.chaptersRead.includes(ch.number);
                    const isCheckPassed = activeEntry.chapterQuizPassed.includes(ch.number);
                    const isCurrent = idx === activeChapterIdx;
                    return (
                      <button
                        key={ch.number}
                        type="button"
                        onClick={() => setActiveChapterIdx(idx)}
                        className={`text-left rounded-xl border p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                          isCurrent
                            ? 'bg-[var(--acc-soft)] border-[var(--gold)]'
                            : 'bg-[var(--bg)] border-[var(--line)] hover:border-[var(--gold)]'
                        }`}
                      >
                        <span
                          className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-[12px] font-extrabold ${
                            isCheckPassed
                              ? 'bg-[var(--green)] text-white'
                              : isRead
                                ? 'bg-[var(--ok-soft)] text-[var(--green)] border border-[var(--ok-line)]'
                                : isCurrent
                                  ? 'bg-[var(--gold)] text-[var(--on-acc)]'
                                  : 'bg-[var(--card)] text-[var(--dim)] border border-[var(--line)]'
                          }`}
                        >
                          {isCheckPassed ? '✓' : ch.number}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-[13.5px] font-bold text-[var(--ink)] leading-snug">
                            {ch.title}
                          </div>
                          <div className="text-[11.5px] text-[var(--dim)] mt-0.5">
                            {isCheckPassed
                              ? 'Check passed · Understood'
                              : isRead
                                ? 'Read · Short check pending'
                                : 'Unread · Includes 2-Q check'}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Active Chapter Reader Pane */}
                <div
                  className="lg:col-span-8 eyak-reading-canvas flex flex-col gap-5"
                  data-reading-surface={comfort.surface}
                  data-reading-scale={comfort.fontScale}
                >
                  <div className="rounded-2xl bg-[var(--bg)] border border-[var(--line)] overflow-hidden flex flex-col">
                    {/* Event-Based Memory-Retention Scene Illustration */}
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--card)]">
                      {!failedSceneKeys[activeEnhancement.sceneArtworkKey] ? (
                        <img
                          src={activeSceneMeta.src}
                          alt={activeSceneMeta.alt}
                          referrerPolicy="no-referrer"
                          onError={() =>
                            setFailedSceneKeys((prev) => ({
                              ...prev,
                              [activeEnhancement.sceneArtworkKey]: true,
                            }))
                          }
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center p-6 text-white font-[var(--display)] font-bold text-[18px]"
                          style={{ background: activeSceneMeta.fallbackGradient }}
                        >
                          {activeSceneMeta.badgeLabel}
                        </div>
                      )}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-4 sm:p-5">
                        <div className="text-[11.5px] font-bold text-amber-300">
                          Visual Event Scene · Chapter {activeChapter.number} of{' '}
                          {activeNovel.chapters.length}
                        </div>
                        <p className="text-[13.5px] sm:text-[14.5px] font-semibold text-white leading-snug mt-1">
                          {activeEnhancement.sceneCaption}
                        </p>
                      </div>
                    </div>

                    {/* Visual Memory Anchor Strip */}
                    <div className="px-5 py-3.5 bg-[var(--acc-soft)] border-b border-[var(--acc-line)] flex items-start gap-2.5">
                      <span className="text-[var(--gold)] mt-0.5 shrink-0">
                        <Icon name="spark" size={16} />
                      </span>
                      <div className="text-[13.5px] leading-snug text-[var(--ink)]">
                        <span className="font-bold text-[var(--gold)]">Memory Hook: </span>
                        {activeEnhancement.memoryAnchor}
                      </div>
                    </div>

                    {/* Chapter Body */}
                    <div className="p-5 sm:p-6 flex flex-col gap-5">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <div className="text-[12px] font-bold text-[var(--gold)]">
                            Chapter {activeChapter.number} of {activeNovel.chapters.length} ·{' '}
                            {activeNovel.title}
                          </div>
                          <h4 className="font-[var(--display)] font-extrabold text-[20px] sm:text-[22px] text-[var(--ink)] mt-0.5">
                            {activeChapter.title}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            aria-expanded={showComfortBar}
                            aria-label="Reading comfort: paper tone and text size"
                            title="Reading comfort (Aa)"
                            onClick={() => {
                              triggerLightHaptic(8);
                              setShowComfortBar((v) => !v);
                            }}
                            className={`min-h-[38px] min-w-[40px] px-2.5 rounded-xl border font-[var(--display)] font-bold text-[13.5px] inline-flex items-center justify-center cursor-pointer transition ${
                              showComfortBar || comfort.surface !== 'default' || comfort.fontScale !== 'comfort'
                                ? 'bg-[var(--acc-soft)] border-[var(--gold)] text-[var(--gold)]'
                                : 'bg-[var(--card)] border-[var(--line)] text-[var(--ink)] hover:border-[var(--gold)]'
                            }`}
                          >
                            <span>Aa</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              triggerLightHaptic(12);
                              handleToggleChapter(activeChapter.number);
                            }}
                            className={`min-h-[38px] px-3.5 rounded-xl text-[13px] font-bold border transition-colors cursor-pointer whitespace-nowrap active:scale-[0.98] ${
                              activeEntry.chaptersRead.includes(activeChapter.number)
                                ? 'bg-[var(--ok-soft)] border-[var(--ok-line)] text-[var(--green)]'
                                : 'bg-[var(--card)] border-[var(--line)] text-[var(--ink)] hover:border-[var(--gold)]'
                            }`}
                          >
                            {activeEntry.chaptersRead.includes(activeChapter.number)
                              ? 'Marked Read ✓'
                              : 'Mark Chapter Read'}
                          </button>
                        </div>
                      </div>

                      {showComfortBar && (
                        <div
                          aria-label="Novel reading appearance controls"
                          className="rounded-xl bg-[var(--card)] border border-[var(--line)] p-3 flex flex-wrap items-center justify-between gap-2.5 anim-rise"
                        >
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[11.5px] font-bold text-[var(--dim)] mr-0.5">Paper</span>
                            {(
                              [
                                {
                                  id: 'default',
                                  label: 'Default',
                                  aria: 'Default theme paper',
                                  swatch: 'bg-[var(--card)] border-[var(--line)]',
                                },
                                {
                                  id: 'sepia',
                                  label: 'Sepia',
                                  aria: 'Warm Sepia paper',
                                  swatch: 'bg-[#F5EEDB] border-[#DFC196]',
                                },
                                {
                                  id: 'night',
                                  label: 'Night',
                                  aria: 'Quiet Night paper',
                                  swatch: 'bg-[#161B29] border-[#344773]',
                                },
                              ] as Array<{
                                id: ReadingSurface;
                                label: string;
                                aria: string;
                                swatch: string;
                              }>
                            ).map((opt) => {
                              const active = comfort.surface === opt.id;
                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  aria-label={opt.aria}
                                  aria-pressed={active}
                                  onClick={() => updateComfort({ surface: opt.id })}
                                  className={`min-h-[34px] px-2.5 rounded-lg border text-[12px] font-bold inline-flex items-center gap-1.5 cursor-pointer transition whitespace-nowrap ${
                                    active
                                      ? 'bg-[var(--acc-soft)] border-[var(--gold)] text-[var(--ink)]'
                                      : 'bg-[var(--bg)] border-[var(--line)] text-[var(--dim)] hover:text-[var(--ink)]'
                                  }`}
                                >
                                  <span className={`w-3 h-3 rounded-full border ${opt.swatch} shrink-0`} />
                                  <span>{opt.label}</span>
                                </button>
                              );
                            })}
                          </div>
                          <div className="flex items-center gap-1">
                            {(
                              [
                                { id: 'compact', label: 'A−', aria: 'Compact text size' },
                                { id: 'comfort', label: 'Aa', aria: 'Comfortable text size' },
                                { id: 'large', label: 'A+', aria: 'Large text size' },
                              ] as Array<{ id: ReadingFontScale; label: string; aria: string }>
                            ).map((sz) => {
                              const active = comfort.fontScale === sz.id;
                              return (
                                <button
                                  key={sz.id}
                                  type="button"
                                  aria-label={sz.aria}
                                  aria-pressed={active}
                                  onClick={() => updateComfort({ fontScale: sz.id })}
                                  className={`min-h-[34px] min-w-[38px] px-2 rounded-lg border font-[var(--display)] font-bold text-[12.5px] inline-flex items-center justify-center cursor-pointer transition ${
                                    active
                                      ? 'bg-[var(--acc-soft)] border-[var(--gold)] text-[var(--gold)]'
                                      : 'bg-[var(--bg)] border-[var(--line)] text-[var(--dim)] hover:text-[var(--ink)]'
                                  }`}
                                >
                                  {sz.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <p className="lead text-[var(--ink)]">
                        {activeChapter.summary}
                      </p>

                      <div className="flex flex-col gap-2">
                        <div className="text-[12px] font-bold uppercase tracking-wider text-[var(--dim)]">
                          Key Events to Remember
                        </div>
                        <ul className="flex flex-col gap-2">
                          {activeChapter.keyEvents.map((ev, i) => (
                            <li
                              key={i}
                              className="rounded-xl bg-[var(--card)] border border-[var(--line)] px-4 py-3 text-[14px] text-[var(--ink)] flex items-start gap-2.5"
                            >
                              <span className="text-[var(--gold)] font-extrabold shrink-0">
                                {i + 1}.
                              </span>
                              <span>{ev}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-xl bg-[var(--warn-soft)] border border-[var(--warn-line)] p-4">
                        <div className="text-[12px] font-bold uppercase tracking-wider text-[var(--gold)]">
                          Examiner Trap Alert
                        </div>
                        <p className="text-[14px] text-[var(--ink)] mt-1 leading-relaxed">
                          {activeChapter.examTrap}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ── End-of-Chapter Short Comprehension Test ── */}
                  <div className="rounded-2xl bg-[var(--bg)] border border-[var(--line)] p-5 sm:p-6 flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <div className="text-[12px] font-bold uppercase tracking-wider text-[var(--gold)]">
                          Chapter {activeChapter.number} Understanding Check
                        </div>
                        <h5 className="font-[var(--display)] font-extrabold text-[18px] text-[var(--ink)] mt-0.5">
                          Quick Comprehension Test ({currentChQuiz.length} Questions)
                        </h5>
                        <p className="text-[13px] text-[var(--dim)] mt-0.5">
                          Confirm you understood this chapter before moving on — all chapter checks
                          also feed into your End-of-Book Rank Point Exam.
                        </p>
                      </div>
                      {currentChPassedSaved && (
                        <span className="text-[12.5px] font-bold text-[var(--green)]">
                          Chapter Understood ✓
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-4">
                      {currentChQuiz.map((q, qIdx) => {
                        const pick = chapterQuizPicks[`${currentChKey}:${q.id}`];
                        return (
                          <div
                            key={q.id}
                            className="rounded-xl bg-[var(--card)] border border-[var(--line)] p-4 flex flex-col gap-3"
                          >
                            <div className="text-[14.5px] font-bold text-[var(--ink)] leading-snug">
                              {qIdx + 1}. {q.q}
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                              {q.o.map((opt, optIdx) => {
                                const isPicked = pick === optIdx;
                                const isRight = optIdx === q.a;
                                let cls =
                                  'bg-[var(--bg)] border-[var(--line)] text-[var(--ink)] hover:border-[var(--gold)]';
                                if (currentChSubmitted) {
                                  if (isRight) {
                                    cls =
                                      'bg-[var(--ok-soft)] border-[var(--ok-line)] text-[var(--ink)]';
                                  } else if (isPicked) {
                                    cls =
                                      'bg-[var(--bad-soft)] border-[var(--bad-line)] text-[var(--ink)]';
                                  } else {
                                    cls =
                                      'bg-[var(--bg)] border-[var(--line)] text-[var(--dim)] opacity-70';
                                  }
                                } else if (isPicked) {
                                  cls =
                                    'bg-[var(--acc-soft)] border-[var(--gold)] text-[var(--ink)]';
                                }
                                return (
                                  <button
                                    key={optIdx}
                                    type="button"
                                    disabled={currentChSubmitted}
                                    onClick={() => handleChapterQuizSelect(q.id, optIdx)}
                                    className={`text-left rounded-xl border px-3.5 py-2.5 text-[13.5px] font-semibold flex items-start gap-2.5 transition-colors cursor-pointer disabled:cursor-default ${cls}`}
                                  >
                                    <span className="font-extrabold text-[var(--gold)] shrink-0">
                                      {String.fromCharCode(65 + optIdx)}.
                                    </span>
                                    <span>{opt}</span>
                                  </button>
                                );
                              })}
                            </div>

                            {currentChSubmitted && (
                              <div className="rounded-lg bg-[var(--bg)] border border-[var(--line)] p-3 text-[13px] leading-relaxed">
                                <div
                                  className={`font-bold ${
                                    pick === q.a ? 'text-[var(--green)]' : 'text-[var(--bad)]'
                                  }`}
                                >
                                  {pick === q.a
                                    ? 'Correct!'
                                    : `Correct Answer: ${String.fromCharCode(65 + q.a)}. ${q.o[q.a]}`}
                                </div>
                                <p className="text-[var(--ink)] mt-1">{q.explanation}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between gap-3 flex-wrap pt-2 border-t border-[var(--line)]">
                      {!currentChSubmitted ? (
                        <>
                          <span className="text-[13px] font-semibold text-[var(--dim)]">
                            Answered {currentChAnsweredCount}/{currentChQuiz.length}
                          </span>
                          <button
                            type="button"
                            disabled={currentChAnsweredCount < currentChQuiz.length}
                            onClick={handleSubmitChapterQuiz}
                            className="min-h-[42px] px-5 rounded-xl bg-[var(--gold)] text-[var(--on-acc)] text-[13.5px] font-bold disabled:opacity-40 cursor-pointer whitespace-nowrap"
                          >
                            Check Chapter Understanding
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-3 flex-wrap">
                            <span
                              className={`text-[14px] font-extrabold ${
                                currentChCorrectCount >= Math.ceil(currentChQuiz.length * 0.5)
                                  ? 'text-[var(--green)]'
                                  : 'text-[var(--bad)]'
                              }`}
                            >
                              Score: {currentChCorrectCount}/{currentChQuiz.length}
                              {currentChCorrectCount >= Math.ceil(currentChQuiz.length * 0.5)
                                ? ' · Chapter Passed ✓'
                                : ' · Review & Retry'}
                            </span>
                            <button
                              type="button"
                              onClick={handleRetryChapterQuiz}
                              className="min-h-[38px] px-3.5 rounded-xl bg-[var(--card)] border border-[var(--line)] text-[13px] font-bold text-[var(--ink)] cursor-pointer whitespace-nowrap"
                            >
                              Retry Check
                            </button>
                          </div>

                          {activeChapterIdx < activeNovel.chapters.length - 1 ? (
                            <button
                              type="button"
                              onClick={() => setActiveChapterIdx((i) => i + 1)}
                              className="min-h-[42px] px-5 rounded-xl bg-[var(--gold)] text-[var(--on-acc)] text-[13.5px] font-bold cursor-pointer whitespace-nowrap"
                            >
                              Continue to Chapter {activeNovel.chapters[activeChapterIdx + 1].number} →
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                handleResetFinalExam();
                                setActiveTab('final-exam');
                              }}
                              className="min-h-[42px] px-5 rounded-xl bg-[var(--green)] text-white text-[13.5px] font-bold cursor-pointer whitespace-nowrap"
                            >
                              Take End-of-Book Final Exam (+{maxBookRp} RP) →
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Bottom Chapter Navigation */}
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      disabled={activeChapterIdx === 0}
                      onClick={() => setActiveChapterIdx((i) => Math.max(0, i - 1))}
                      className="min-h-[40px] px-4 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-[13px] font-bold text-[var(--ink)] disabled:opacity-40 cursor-pointer whitespace-nowrap"
                    >
                      ← Previous Chapter
                    </button>
                    <button
                      type="button"
                      disabled={activeChapterIdx >= activeNovel.chapters.length - 1}
                      onClick={() =>
                        setActiveChapterIdx((i) => Math.min(activeNovel.chapters.length - 1, i + 1))
                      }
                      className="min-h-[40px] px-4 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-[13px] font-bold text-[var(--ink)] disabled:opacity-40 cursor-pointer whitespace-nowrap"
                    >
                      Next Chapter →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 2: END-OF-BOOK GATHERED FINAL EXAM + RANK POINTS AWARD ── */}
          {activeTab === 'final-exam' && (
            <div className="max-w-3xl mx-auto flex flex-col gap-5">
              {/* Exam Overview Banner */}
              <div className="rounded-2xl bg-[var(--bg)] border border-[var(--line)] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-[12px] font-bold uppercase tracking-wider text-[var(--gold)]">
                    End-of-Book Gathered Final Exam · {activeNovel.title}
                  </div>
                  <h4 className="font-[var(--display)] font-extrabold text-[19px] text-[var(--ink)] mt-0.5">
                    All {finalExamQuestions.length} Chapter &amp; Full-Book Questions Gathered
                  </h4>
                  <p className="text-[13px] text-[var(--dim)] mt-0.5">
                    Score {NOVEL_FINAL_EXAM_PASS_PCT}% or higher to unlock up to{' '}
                    <strong className="text-[var(--green)]">+{maxBookRp} Official Rank Points (RP)</strong>{' '}
                    and <strong className="text-[var(--gold)]">+{maxBookRp * 10} XP</strong> for your
                    Elemental Rank.
                  </p>
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <div className="text-[12px] font-bold text-[var(--dim)]">
                    Chapters Checked: {activeStats.chapterQuizzesPassedCount}/{activeStats.totalChapters}
                  </div>
                  <div className="text-[14px] font-extrabold text-[var(--green)] mt-0.5">
                    {activeStats.rankPointsAwarded > 0
                      ? `Earned: +${activeStats.rankPointsAwarded} RP`
                      : `Reward: Up to +${maxBookRp} RP`}
                  </div>
                </div>
              </div>

              {finalExamFinished ? (
                <div className="rounded-2xl bg-[var(--bg)] border border-[var(--line)] p-6 flex flex-col gap-5">
                  <div className="flex flex-col gap-1.5">
                    <div
                      className={`text-[12px] font-bold uppercase tracking-wider ${
                        finalExamEvaluation.passed ? 'text-[var(--green)]' : 'text-[var(--bad)]'
                      }`}
                    >
                      {finalExamEvaluation.passed
                        ? 'Book Mastered · Rank Points Unlocked'
                        : 'Pass Mark Not Reached Yet (70% Required for Rank Points)'}
                    </div>
                    <h4 className="font-[var(--display)] font-extrabold text-[26px] text-[var(--ink)]">
                      {finalExamEvaluation.correctCount} / {finalExamEvaluation.totalQuestions}{' '}
                      Correct ({finalExamEvaluation.accuracyPct}%)
                    </h4>
                  </div>

                  {finalExamEvaluation.passed ? (
                    <div className="rounded-2xl bg-[var(--ok-soft)] border border-[var(--ok-line)] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="font-[var(--display)] font-extrabold text-[18px] text-[var(--green)]">
                          +{finalExamEvaluation.rankPointsEarned} Rank Points (RP) · +
                          {finalExamEvaluation.xpEarned} Study XP
                        </div>
                        <p className="text-[13.5px] text-[var(--ink)] mt-1">
                          {finalExamRewardNotice && finalExamRewardNotice.newlyAwardedRp > 0
                            ? `Added +${finalExamRewardNotice.newlyAwardedRp} new RP and +${finalExamRewardNotice.newlyAwardedXp} XP directly to your Elemental Rank profile.`
                            : 'Your highest Rank Points for this novel are already locked into your Elemental Rank profile.'}
                        </p>
                      </div>
                      <Icon name="trophy" size={32} className="text-[var(--green)] shrink-0" />
                    </div>
                  ) : (
                    <div className="rounded-2xl bg-[var(--warn-soft)] border border-[var(--warn-line)] p-4 text-[13.5px] text-[var(--ink)] leading-relaxed">
                      Score at least <strong>{NOVEL_FINAL_EXAM_PASS_PCT}%</strong> on the gathered
                      end-of-book exam to claim your official Rank Points. Review the missed
                      chapters below and retry!
                    </div>
                  )}

                  {finalExamEvaluation.missedChapterNumbers.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <div className="text-[12px] font-bold uppercase tracking-wider text-[var(--dim)]">
                        Chapters to Review Before Retrying
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {finalExamEvaluation.missedChapterNumbers.map((chNum) => {
                          const targetIdx = activeNovel.chapters.findIndex(
                            (c) => c.number === chNum
                          );
                          return (
                            <button
                              key={chNum}
                              type="button"
                              onClick={() => {
                                if (targetIdx >= 0) setActiveChapterIdx(targetIdx);
                                setActiveTab('chapters');
                              }}
                              className="min-h-[36px] px-3.5 rounded-xl bg-[var(--card)] border border-[var(--line)] hover:border-[var(--gold)] text-[13px] font-bold text-[var(--ink)] cursor-pointer whitespace-nowrap"
                            >
                              Review Chapter {chNum} →
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 flex-wrap pt-2 border-t border-[var(--line)]">
                    <button
                      type="button"
                      onClick={handleResetFinalExam}
                      className="min-h-[42px] px-5 rounded-xl bg-[var(--gold)] text-[var(--on-acc)] text-[13.5px] font-bold cursor-pointer whitespace-nowrap"
                    >
                      Retake Gathered Exam
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('chapters')}
                      className="min-h-[42px] px-4 rounded-xl bg-[var(--card)] border border-[var(--line)] text-[13.5px] font-bold text-[var(--ink)] cursor-pointer whitespace-nowrap"
                    >
                      Back to Chapters
                    </button>
                  </div>
                </div>
              ) : (
                currentFinalQ && (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-2 flex-wrap text-[13px]">
                      <div className="font-bold text-[var(--gold)]">
                        Question {finalExamIdx + 1} of {finalExamQuestions.length} ·{' '}
                        {currentFinalQ.sourceLabel} · {currentFinalQ.examTag}
                      </div>
                      <div className="font-semibold text-[var(--dim)]">
                        Answered: {answeredFinalCount}/{finalExamQuestions.length}
                      </div>
                    </div>

                    <SmoothProgressBar
                      value={Math.round((answeredFinalCount / Math.max(1, finalExamQuestions.length)) * 100)}
                      tone="gold"
                      ariaLabel="End-of-book final exam progress"
                    />

                    <div className="rounded-2xl bg-[var(--bg)] border border-[var(--line)] p-5 sm:p-6 flex flex-col gap-4">
                      <h4 className="font-[var(--display)] font-bold text-[18px] leading-snug text-[var(--ink)]">
                        {currentFinalQ.q}
                      </h4>

                      <div className="grid grid-cols-1 gap-2.5">
                        {currentFinalQ.o.map((opt, optIdx) => {
                          const picked = finalExamPicks[currentFinalQ.id];
                          const isAnswered = picked !== undefined;
                          const isPicked = picked === optIdx;
                          const isRight = optIdx === currentFinalQ.a;
                          const cls = !isAnswered
                            ? 'bg-[var(--card)] border-[var(--line)] text-[var(--ink)] hover:border-[var(--gold)]'
                            : isRight
                              ? 'bg-[var(--ok-soft)] border-[var(--ok-line)] text-[var(--ink)]'
                              : isPicked
                                ? 'bg-[var(--bad-soft)] border-[var(--bad-line)] text-[var(--ink)]'
                                : 'bg-[var(--card)] border-[var(--line)] text-[var(--dim)] opacity-65';

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              disabled={isAnswered}
                              onClick={() => handlePickFinalExamOption(currentFinalQ.id, optIdx)}
                              className={`text-left rounded-xl border px-4 py-3 text-[14px] font-semibold flex items-start gap-3 transition-colors cursor-pointer disabled:cursor-default ${cls}`}
                            >
                              <span className="font-extrabold text-[var(--gold)] shrink-0">
                                {String.fromCharCode(65 + optIdx)}.
                              </span>
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {finalExamPicks[currentFinalQ.id] !== undefined && (
                        <div className="rounded-xl bg-[var(--card)] border border-[var(--line)] p-4 flex flex-col gap-2">
                          <div
                            className={`text-[13.5px] font-extrabold ${
                              finalExamPicks[currentFinalQ.id] === currentFinalQ.a
                                ? 'text-[var(--green)]'
                                : 'text-[var(--bad)]'
                            }`}
                          >
                            {finalExamPicks[currentFinalQ.id] === currentFinalQ.a
                              ? 'Correct!'
                              : `Correct Answer: ${String.fromCharCode(65 + currentFinalQ.a)}. ${currentFinalQ.o[currentFinalQ.a]}`}
                          </div>
                          <p className="text-[13.5px] text-[var(--ink)] leading-relaxed">
                            {currentFinalQ.explanation}
                          </p>
                          <p className="text-[12.5px] text-[var(--dim)]">
                            <strong className="text-[var(--gold)]">Exam Tip:</strong>{' '}
                            {currentFinalQ.trapNote}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-[var(--line)] flex-wrap">
                        <button
                          type="button"
                          disabled={finalExamIdx === 0}
                          onClick={() => setFinalExamIdx((i) => Math.max(0, i - 1))}
                          className="min-h-[40px] px-4 rounded-xl bg-[var(--card)] border border-[var(--line)] text-[13px] font-bold text-[var(--ink)] disabled:opacity-40 cursor-pointer whitespace-nowrap"
                        >
                          ← Previous
                        </button>

                        <div className="flex items-center gap-2">
                          {finalExamIdx < finalExamQuestions.length - 1 ? (
                            <button
                              type="button"
                              onClick={() => setFinalExamIdx((i) => i + 1)}
                              className="min-h-[40px] px-4 rounded-xl bg-[var(--gold)] text-[var(--on-acc)] text-[13.5px] font-bold cursor-pointer whitespace-nowrap"
                            >
                              Next Question →
                            </button>
                          ) : null}

                          {answeredFinalCount === finalExamQuestions.length && (
                            <button
                              type="button"
                              onClick={handleFinishFinalExam}
                              className="min-h-[40px] px-5 rounded-xl bg-[var(--green)] text-white text-[13.5px] font-bold cursor-pointer whitespace-nowrap"
                            >
                              Submit Exam &amp; Claim Rank Points →
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {/* ── TAB 3: CHARACTERS ── */}
          {activeTab === 'characters' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeNovel.characters.map((ch) => (
                <div
                  key={ch.name}
                  className="rounded-2xl bg-[var(--bg)] border border-[var(--line)] p-5 flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-[var(--display)] font-extrabold text-[17px] text-[var(--ink)]">
                      {ch.name}
                    </h4>
                  </div>
                  <div className="text-[12.5px] font-bold text-[var(--gold)]">{ch.role}</div>
                  <div className="text-[13px] text-[var(--dim)]">
                    <strong className="text-[var(--ink)]">Traits:</strong> {ch.traits}
                  </div>
                  <p className="text-[13.5px] leading-relaxed text-[var(--ink)]/90 mt-1">
                    {ch.examNote}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* ── TAB 4: THEMES & LITERARY DEVICES ── */}
          {activeTab === 'themes' && (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeNovel.themes.map((th) => (
                  <div
                    key={th.theme}
                    className="rounded-2xl bg-[var(--bg)] border border-[var(--line)] p-5 flex flex-col gap-2"
                  >
                    <h4 className="font-[var(--display)] font-extrabold text-[16.5px] text-[var(--gold)]">
                      {th.theme}
                    </h4>
                    <p className="text-[14px] leading-relaxed text-[var(--ink)]">{th.analysis}</p>
                    <div className="text-[12.5px] text-[var(--dim)] pt-2 border-t border-[var(--line)]">
                      <strong className="text-[var(--ink)]">Literary Link:</strong>{' '}
                      {th.deviceConnection}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                <h4 className="font-[var(--display)] font-extrabold text-[17px] text-[var(--ink)]">
                  Key Narrative &amp; Literary Devices
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activeNovel.literaryDevices.map((d) => (
                    <div
                      key={d.device}
                      className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-4"
                    >
                      <div className="font-bold text-[14px] text-[var(--gold)]">{d.device}</div>
                      <p className="text-[13.5px] text-[var(--ink)] mt-1 leading-relaxed">
                        {d.example}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 5: WAEC ESSAYS & PERSONAL STUDY NOTES ── */}
          {activeTab === 'essays' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-7 flex flex-col gap-4">
                <h4 className="font-[var(--display)] font-extrabold text-[17px] text-[var(--ink)]">
                  WAEC / NECO Paper 2 Essay Models
                </h4>
                {activeNovel.essayPrompts.map((ep, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl bg-[var(--bg)] border border-[var(--line)] p-5 flex flex-col gap-3"
                  >
                    <div className="text-[12px] font-bold text-[var(--gold)]">{ep.examPaper}</div>
                    <h5 className="font-[var(--display)] font-bold text-[16px] text-[var(--ink)] leading-snug">
                      {ep.prompt}
                    </h5>
                    <ul className="flex flex-col gap-1.5 text-[13.5px] text-[var(--ink)]/90">
                      {ep.markingPoints.map((pt, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-[var(--gold)] font-bold">•</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-5 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-[var(--display)] font-extrabold text-[17px] text-[var(--ink)]">
                    Personal Revision Notes
                  </h4>
                  {notesSavedFeedback && (
                    <span className="text-[12px] font-bold text-[var(--green)]">Saved ✓</span>
                  )}
                </div>
                <textarea
                  rows={12}
                  value={activeEntry.notes}
                  onChange={(e) => handleNotesChange(e.target.value)}
                  placeholder={`Write your own quotes, character links, or chapter reminders for ${activeNovel.title}...`}
                  className="w-full rounded-2xl bg-[var(--bg)] border border-[var(--line)] focus:border-[var(--gold)] p-4 text-[14px] text-[var(--ink)] leading-relaxed outline-none resize-y"
                />
                <p className="text-[12px] text-[var(--dim)]">
                  Saved automatically on your device so you can revise offline before exam day.
                </p>
              </div>
            </div>
          )}

          {/* ── TAB 6: PERSONAL LICENSED FULL-BOOK COPY READER (LOCAL ONLY) ── */}
          {activeTab === 'personal-copy' && (
            <div className="flex flex-col gap-5">
              <div className="rounded-2xl bg-[var(--bg)] border border-[var(--line)] p-5 flex flex-col gap-3">
                <div className="text-[12px] font-bold uppercase tracking-wider text-[var(--gold)]">
                  Private Local Full-Book Reader · 5-Chapter Studio Voice
                </div>
                <h4 className="font-[var(--display)] font-extrabold text-[19px] text-[var(--ink)]">
                  Read Your Own Legally Obtained Book Copy with Studio Audio
                </h4>
                <p className="text-[13.5px] text-[var(--dim)] leading-relaxed">
                  Published JAMB &amp; WAEC novels are protected by copyright, so Easy Learn
                  includes complete syllabus chapter guides, memory illustrations, and Rank Point
                  exams rather than redistributing copyrighted book text. If you or your school own
                  a licensed plain-text (<code>.txt</code> / <code>.md</code>) copy of a book, you
                  can load it privately right here in your browser — it stays 100% on your device,
                  splits automatically into chapters, and plays 5 chapters at a time with studio voice narration.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <label className="min-h-[42px] px-4 rounded-xl bg-[var(--gold)] text-[var(--on-acc)] text-[13.5px] font-bold inline-flex items-center gap-2 cursor-pointer whitespace-nowrap">
                    <Icon name="book" size={15} />
                    <span>Load .txt / .md Book File</span>
                    <input
                      type="file"
                      accept=".txt,.md,text/plain,text/markdown"
                      onChange={handlePersonalFileUpload}
                      className="sr-only"
                    />
                  </label>
                  <input
                    type="text"
                    value={personalBookTitle}
                    onChange={(e) => setPersonalBookTitle(e.target.value)}
                    placeholder="Book title (optional)"
                    className="min-h-[42px] px-3.5 rounded-xl bg-[var(--card)] border border-[var(--line)] text-[13.5px] text-[var(--ink)] flex-1 min-w-[200px]"
                  />
                </div>

                {personalChapters.length === 0 && (
                  <div className="flex flex-col gap-2 pt-2">
                    <textarea
                      rows={5}
                      value={personalPasteInput}
                      onChange={(e) => setPersonalPasteInput(e.target.value)}
                      placeholder="Or paste chapters from your personal copy here (e.g., Chapter 1 ... Chapter 2 ...) — stays strictly in your browser memory."
                      className="w-full rounded-xl bg-[var(--card)] border border-[var(--line)] p-3.5 text-[13.5px] text-[var(--ink)] outline-none"
                    />
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleLoadPastedBook}
                        className="min-h-[38px] px-4 rounded-xl bg-[var(--card)] border border-[var(--line)] hover:border-[var(--gold)] text-[13px] font-bold text-[var(--ink)] cursor-pointer whitespace-nowrap"
                      >
                        Split into Chapters
                      </button>
                    </div>
                  </div>
                )}

                {personalUploadError && (
                  <div className="rounded-xl bg-[var(--bad-soft)] border border-[var(--bad-line)] px-3.5 py-2.5 text-[13px] font-semibold text-[var(--bad)]">
                    {personalUploadError}
                  </div>
                )}
              </div>

              {personalChapters.length > 0 && (
                <div className="flex flex-col gap-4">
                  <div className="rounded-2xl bg-[var(--bg)] border border-[var(--line)] p-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="font-[var(--display)] font-extrabold text-[16px] text-[var(--ink)]">
                        {personalBookTitle} · {personalChapters.length} Chapters Loaded
                      </div>
                      <div className="text-[12.5px] text-[var(--dim)]">
                        Reading Chapter {personalChapters[personalChapterIdx]?.number} · Private
                        in-browser session
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {activePlayingKey ? (
                        <button
                          type="button"
                          onClick={stopAudiobook}
                          className="min-h-[40px] px-4 rounded-xl bg-[var(--bad)] text-white text-[13px] font-bold cursor-pointer whitespace-nowrap"
                        >
                          Stop Audio
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleReadPersonalFiveChapters}
                          className="min-h-[40px] px-4 rounded-xl bg-[var(--gold)] text-[var(--on-acc)] text-[13.5px] font-bold inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
                        >
                          <Icon name="vol" size={15} />
                          <span>Read Next 5 Chapters Aloud</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          stopAudiobook();
                          setPersonalChapters([]);
                          setPersonalPasteInput('');
                        }}
                        className="min-h-[40px] px-3.5 rounded-xl bg-[var(--card)] border border-[var(--line)] text-[13px] font-bold text-[var(--dim)] hover:text-[var(--ink)] cursor-pointer whitespace-nowrap"
                      >
                        Clear Copy
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    <div className="lg:col-span-4 flex flex-col gap-1.5 max-h-[520px] overflow-y-auto pr-1">
                      {personalChapters.map((ch, idx) => (
                        <button
                          key={ch.number}
                          type="button"
                          onClick={() => setPersonalChapterIdx(idx)}
                          className={`text-left rounded-xl border px-3.5 py-2.5 text-[13px] font-bold cursor-pointer ${
                            idx === personalChapterIdx
                              ? 'bg-[var(--acc-soft)] border-[var(--gold)] text-[var(--ink)]'
                              : 'bg-[var(--bg)] border-[var(--line)] text-[var(--ink)] hover:border-[var(--gold)]'
                          }`}
                        >
                          <div className="truncate">{ch.title}</div>
                          <div className="text-[11px] font-normal text-[var(--dim)]">
                            {ch.wordCount.toLocaleString()} words
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="lg:col-span-8 rounded-2xl bg-[var(--bg)] border border-[var(--line)] p-5 sm:p-6 flex flex-col gap-3 max-h-[520px] overflow-y-auto">
                      <h5 className="font-[var(--display)] font-extrabold text-[19px] text-[var(--ink)]">
                        {personalChapters[personalChapterIdx]?.title}
                      </h5>
                      <div className="text-[15px] leading-relaxed text-[var(--ink)] whitespace-pre-line">
                        {personalChapters[personalChapterIdx]?.content}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
