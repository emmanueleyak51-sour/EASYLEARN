import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { SubjectId } from '../types';
import { getTopics } from '../data/curriculum';
import { SUBJECT_INFO } from '../utils/engine';
import {
  ALOC_SUPPORTED_SUBJECTS,
  BANK_SUBJECT_MAP,
  BANK_TARGET_PER_SUBJECT,
  BANK_TOTAL_TARGET,
  GEMINI_PRIMARY_SUBJECTS,
  QUESTION_BANK_SUBJECTS,
  computeRetryDelayMs,
  normalizeAlocQuestion,
  parseAlocResponseEnvelope,
  renderInlineLatexToHtml,
  serializeBankExport,
  type BankExamType,
  type BankOptionKey,
  type BankQuestion,
} from '../utils/questionBankLogic';
import {
  clearAllQuestionsInDb,
  clearSubjectQuestionsInDb,
  exportAllQuestionsFromDb,
  getQuestionCountsBySubject,
  importQuestionsFromJsonPayload,
  queryQuestionsFromDb,
  saveQuestionsDeduplicated,
  useQuestionBankCounts,
} from '../utils/questionBankDb';
import { Icon } from './Icons';
import { SmoothProgressBar } from './ULessonMotion';

export type QuestionBankTab = 'overview' | 'aloc' | 'gemini' | 'browse';

const ALOC_KEY_STORAGE = 'rtc_aloc_api_key_v1';
const BATCH_SIZE = 25;
const ALOC_LIMIT = 15;
const MAX_RETRY_ATTEMPTS = 5;

type QueueStatus = 'idle' | 'running' | 'paused' | 'done' | 'error';

interface SubjectRunStat {
  savedThisRun: number;
  dupesThisRun: number;
  batchesCompleted: number;
  state: 'queued' | 'active' | 'retrying' | 'done' | 'error';
  note?: string;
}

export function QuestionBankManagerModal({
  open,
  initialSubject,
  initialTab = 'overview',
  onClose,
}: {
  open: boolean;
  initialSubject?: SubjectId | null;
  initialTab?: QuestionBankTab;
  onClose: () => void;
}) {
  const { counts, totalCount, refresh } = useQuestionBankCounts();
  const [tab, setTab] = useState<QuestionBankTab>(initialTab);

  // Import / Export feedback banner
  const [ioNotice, setIoNotice] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const [ioBusy, setIoBusy] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Source A — ALOC State
  const [alocKey, setAlocKey] = useState<string>(() => {
    try {
      return window.localStorage.getItem(ALOC_KEY_STORAGE) || '';
    } catch {
      return '';
    }
  });
  const [showAlocKey, setShowAlocKey] = useState<boolean>(false);
  const [alocSubject, setAlocSubject] = useState<SubjectId | 'ALL_ALOC'>('maths');
  const [alocExamType, setAlocExamType] = useState<'jamb' | 'waec' | 'neco' | 'all'>('jamb');
  const [alocMaxPages, setAlocMaxPages] = useState<number>(10);
  const [alocStatus, setAlocStatus] = useState<QueueStatus>('idle');
  const [alocMessage, setAlocMessage] = useState<string>('');
  const [alocStats, setAlocStats] = useState<{
    pagesFetched: number;
    saved: number;
    duplicates: number;
    lastCursor: string | null;
    activeLabel: string;
  }>({
    pagesFetched: 0,
    saved: 0,
    duplicates: 0,
    lastCursor: null,
    activeLabel: '',
  });
  const alocPauseRef = useRef<boolean>(false);
  const alocStopRef = useRef<boolean>(false);

  // Source B — Gemini Queue State
  const [selectedGeminiSubjects, setSelectedGeminiSubjects] = useState<SubjectId[]>(() => [
    ...GEMINI_PRIMARY_SUBJECTS,
  ]);
  const [geminiExamMode, setGeminiExamMode] = useState<'MIXED' | BankExamType>('MIXED');
  const [geminiTargetPerSubj, setGeminiTargetPerSubj] = useState<number>(1000);
  const [geminiStatus, setGeminiStatus] = useState<QueueStatus>('idle');
  const [geminiMessage, setGeminiMessage] = useState<string>('');
  const [geminiRunStats, setGeminiRunStats] = useState<Partial<Record<SubjectId, SubjectRunStat>>>({});
  const [retryCountdownSec, setRetryCountdownSec] = useState<number>(0);
  const geminiPauseRef = useRef<boolean>(false);
  const geminiStopRef = useRef<boolean>(false);

  // Browse & Offline Drill State
  const [browseSubject, setBrowseSubject] = useState<SubjectId | 'ALL'>('ALL');
  const [browseExamType, setBrowseExamType] = useState<'ALL' | BankExamType>('ALL');
  const [browseTopic, setBrowseTopic] = useState<string>('');
  const [browseSearch, setBrowseSearch] = useState<string>('');
  const [browseRows, setBrowseRows] = useState<BankQuestion[]>([]);
  const [browseLoading, setBrowseLoading] = useState<boolean>(false);
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [drillMode, setDrillMode] = useState<boolean>(false);
  const [drillAnswers, setDrillAnswers] = useState<Record<string, BankOptionKey>>({});
  const [confirmClearTarget, setConfirmClearTarget] = useState<SubjectId | 'ALL' | null>(null);

  // Sync initial props only when modal opens (closed -> open transition)
  const wasOpenRef = useRef<boolean>(false);
  useEffect(() => {
    if (open && !wasOpenRef.current) {
      setTab(initialTab);
      if (initialSubject) {
        setBrowseSubject(initialSubject);
        const cfg = BANK_SUBJECT_MAP[initialSubject];
        if (cfg?.alocSlug) setAlocSubject(initialSubject);
        setSelectedGeminiSubjects([initialSubject]);
      } else {
        setBrowseSubject('ALL');
      }
      refresh();
    }
    wasOpenRef.current = open;
  }, [open, initialSubject, initialTab, refresh]);

  // Escape key to close modal
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Persist ALOC API key locally
  useEffect(() => {
    try {
      if (alocKey.trim()) {
        window.localStorage.setItem(ALOC_KEY_STORAGE, alocKey.trim());
      } else {
        window.localStorage.removeItem(ALOC_KEY_STORAGE);
      }
    } catch {
      /* ignore storage errors */
    }
  }, [alocKey]);

  // Query IndexedDB directly when Browse tab or filters change
  const loadBrowseRows = useCallback(async () => {
    setBrowseLoading(true);
    try {
      const rows = await queryQuestionsFromDb({
        subject: browseSubject === 'ALL' ? undefined : browseSubject,
        examType: browseExamType,
        topic: browseTopic,
        search: browseSearch,
        limit: 120,
      });
      setBrowseRows(rows);
    } catch {
      setBrowseRows([]);
    } finally {
      setBrowseLoading(false);
    }
  }, [browseSubject, browseExamType, browseTopic, browseSearch]);

  useEffect(() => {
    if (open && tab === 'browse') {
      void loadBrowseRows();
    }
  }, [open, tab, totalCount, loadBrowseRows]);

  // Helper to sleep while respecting pause/stop
  const interruptibleSleep = async (
    ms: number,
    stopRef: React.MutableRefObject<boolean>,
    onTickSec?: (secLeft: number) => void
  ): Promise<boolean> => {
    const start = Date.now();
    while (Date.now() - start < ms) {
      if (stopRef.current) {
        onTickSec?.(0);
        return false;
      }
      const left = Math.ceil((ms - (Date.now() - start)) / 1000);
      onTickSec?.(Math.max(0, left));
      await new Promise((r) => setTimeout(r, 250));
    }
    onTickSec?.(0);
    return !stopRef.current;
  };

  const waitWhilePaused = async (
    pauseRef: React.MutableRefObject<boolean>,
    stopRef: React.MutableRefObject<boolean>
  ): Promise<boolean> => {
    while (pauseRef.current && !stopRef.current) {
      await new Promise((r) => setTimeout(r, 250));
    }
    return !stopRef.current;
  };

  // Export Bank (JSON)
  const handleExportJson = async () => {
    setIoBusy(true);
    setIoNotice(null);
    try {
      const all = await exportAllQuestionsFromDb();
      const json = serializeBankExport(all);
      const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const stamp = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `road-to-campus-question-bank-${stamp}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setIoNotice({
        kind: 'ok',
        text: `Exported ${all.length.toLocaleString()} questions to road-to-campus-question-bank-${stamp}.json.`,
      });
    } catch (err) {
      setIoNotice({
        kind: 'err',
        text: err instanceof Error ? err.message : 'Failed to export question bank.',
      });
    } finally {
      setIoBusy(false);
    }
  };

  // Import Bank (JSON)
  const handleImportFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setIoBusy(true);
    setIoNotice(null);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const res = await importQuestionsFromJsonPayload(parsed);
      if (!res.ok) {
        setIoNotice({ kind: 'err', text: res.error });
      } else {
        setIoNotice({
          kind: 'ok',
          text: `Imported ${res.saved.toLocaleString()} new questions (${res.duplicates.toLocaleString()} duplicates skipped${
            res.invalid > 0 ? `, ${res.invalid} invalid ignored` : ''
          }).`,
        });
        refresh();
        if (tab === 'browse') void loadBrowseRows();
      }
    } catch (err) {
      setIoNotice({
        kind: 'err',
        text: err instanceof Error ? `Invalid JSON file: ${err.message}` : 'Could not parse JSON file.',
      });
    } finally {
      setIoBusy(false);
    }
  };

  // Source A — ALOC Past Questions Batch Fetcher
  const handleStartAlocFetch = async () => {
    if (!alocKey.trim()) {
      setAlocStatus('error');
      setAlocMessage('Enter your ALOC API key first (saved locally in this browser).');
      return;
    }

    alocStopRef.current = false;
    alocPauseRef.current = false;
    setAlocStatus('running');
    setAlocMessage('Connecting to ALOC v1 API…');
    setAlocStats({ pagesFetched: 0, saved: 0, duplicates: 0, lastCursor: null, activeLabel: '' });

    const targetSubjects =
      alocSubject === 'ALL_ALOC'
        ? ALOC_SUPPORTED_SUBJECTS
        : ALOC_SUPPORTED_SUBJECTS.filter((s) => s.id === alocSubject);
    const examList: ('jamb' | 'waec' | 'neco')[] =
      alocExamType === 'all' ? ['jamb', 'waec', 'neco'] : [alocExamType];

    let totalPages = 0;
    let totalSaved = 0;
    let totalDupes = 0;

    try {
      for (const cfg of targetSubjects) {
        if (!cfg.alocSlug) continue;
        for (const ex of examList) {
          let cursor: string | null = null;
          let emptyStreak = 0;

          for (let page = 1; page <= alocMaxPages; page++) {
            const okToContinue = await waitWhilePaused(alocPauseRef, alocStopRef);
            if (!okToContinue) {
              setAlocStatus('idle');
              setAlocMessage(`Stopped ALOC sync. Saved ${totalSaved.toLocaleString()} new past questions.`);
              return;
            }

            const liveCounts = await getQuestionCountsBySubject();
            if ((liveCounts[cfg.id] || 0) >= BANK_TARGET_PER_SUBJECT) {
              setAlocMessage(`${cfg.uiName} reached 1,000 offline questions — advancing.`);
              break;
            }

            const label = `${cfg.uiName} (${cfg.alocSlug}) · ${ex.toUpperCase()} · Page ${page}`;
            setAlocStats((prev) => ({ ...prev, activeLabel: label, lastCursor: cursor }));
            setAlocMessage(`Fetching ${label}…`);

            let payload: unknown = null;
            let succeeded = false;

            for (let attempt = 0; attempt <= MAX_RETRY_ATTEMPTS; attempt++) {
              if (alocStopRef.current) break;
              const resp = await fetch('/api/question-bank/aloc', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  apiKey: alocKey.trim(),
                  alocSlug: cfg.alocSlug,
                  examType: ex,
                  limit: ALOC_LIMIT,
                  cursor: cursor || undefined,
                }),
              });

              const data = await resp.json().catch(() => ({}));
              if (resp.ok) {
                payload = data;
                succeeded = true;
                break;
              }

              if (resp.status === 429 || resp.status >= 500) {
                if (attempt < MAX_RETRY_ATTEMPTS) {
                  const delayMs = computeRetryDelayMs(attempt);
                  setAlocMessage(
                    `ALOC rate limit (${resp.status}) on ${cfg.uiName}. Retrying in ${Math.round(delayMs / 1000)}s (attempt ${attempt + 1}/${MAX_RETRY_ATTEMPTS})…`
                  );
                  const slept = await interruptibleSleep(delayMs, alocStopRef);
                  if (!slept) break;
                  continue;
                }
              }

              const errText =
                typeof data?.error === 'string' && data.error
                  ? data.error
                  : `ALOC request failed (HTTP ${resp.status}).`;
              setAlocStatus('error');
              setAlocMessage(errText);
              return;
            }

            if (!succeeded || alocStopRef.current) {
              setAlocStatus('idle');
              setAlocMessage(`ALOC sync halted. Saved ${totalSaved.toLocaleString()} questions.`);
              return;
            }

            const { items, nextCursor } = parseAlocResponseEnvelope(payload);
            const fallbackExam: BankExamType = ex === 'waec' ? 'WAEC' : ex === 'neco' ? 'NECO' : 'JAMB';
            const normalized: BankQuestion[] = [];
            for (const raw of items) {
              const q = normalizeAlocQuestion(raw, cfg.id, fallbackExam);
              if (q) normalized.push(q);
            }

            const { saved, duplicates } = await saveQuestionsDeduplicated(normalized);
            totalPages++;
            totalSaved += saved;
            totalDupes += duplicates;
            cursor = nextCursor;

            setAlocStats({
              pagesFetched: totalPages,
              saved: totalSaved,
              duplicates: totalDupes,
              lastCursor: cursor,
              activeLabel: label,
            });

            if (items.length === 0) {
              break;
            }
            if (saved === 0) {
              emptyStreak++;
              if (emptyStreak >= 3) break;
            } else {
              emptyStreak = 0;
            }
            if (!cursor && items.length < ALOC_LIMIT) {
              break;
            }

            // Polite pacing between ALOC cursor pages
            await interruptibleSleep(450, alocStopRef);
          }
        }
      }

      setAlocStatus('done');
      setAlocMessage(
        `ALOC sync finished: ${totalSaved.toLocaleString()} new past questions stored offline (${totalDupes.toLocaleString()} duplicates deduplicated).`
      );
      refresh();
    } catch (err) {
      setAlocStatus('error');
      setAlocMessage(err instanceof Error ? err.message : 'Unexpected error during ALOC sync.');
    }
  };

  // Source B — Gemini Batch Generator Queue Controller
  const toggleGeminiSubject = (sid: SubjectId) => {
    setSelectedGeminiSubjects((prev) =>
      prev.includes(sid) ? prev.filter((x) => x !== sid) : [...prev, sid]
    );
  };

  const handleStartGeminiQueue = async () => {
    if (selectedGeminiSubjects.length === 0) {
      setGeminiStatus('error');
      setGeminiMessage('Select at least one subject to generate questions.');
      return;
    }

    geminiStopRef.current = false;
    geminiPauseRef.current = false;
    setGeminiStatus('running');
    setRetryCountdownSec(0);
    setGeminiMessage('Initializing Gemini Structured JSON Batch Queue…');

    const orderedQueue = QUESTION_BANK_SUBJECTS.filter((s) => selectedGeminiSubjects.includes(s.id));
    const initStats: Partial<Record<SubjectId, SubjectRunStat>> = {};
    for (const s of orderedQueue) {
      initStats[s.id] = {
        savedThisRun: 0,
        dupesThisRun: 0,
        batchesCompleted: 0,
        state: 'queued',
      };
    }
    setGeminiRunStats(initStats);

    let grandSaved = 0;
    let grandDupes = 0;

    try {
      for (const cfg of orderedQueue) {
        let liveCounts = await getQuestionCountsBySubject();
        let currentCount = liveCounts[cfg.id] || 0;
        const targetCap = Math.min(BANK_TARGET_PER_SUBJECT, Math.max(25, geminiTargetPerSubj));

        if (currentCount >= targetCap) {
          setGeminiRunStats((prev) => ({
            ...prev,
            [cfg.id]: {
              ...(prev[cfg.id] || { savedThisRun: 0, dupesThisRun: 0, batchesCompleted: 0 }),
              state: 'done',
              note: `Already at ${currentCount.toLocaleString()} / ${targetCap.toLocaleString()}`,
            },
          }));
          continue;
        }

        const syllabusTopics = getTopics(cfg.id).map((t) => t.name);
        let batchIndex = 1;
        let zeroGainStreak = 0;

        while (currentCount < targetCap) {
          const okToContinue = await waitWhilePaused(geminiPauseRef, geminiStopRef);
          if (!okToContinue) {
            setGeminiStatus('idle');
            setGeminiMessage(
              `Queue stopped. Saved ${grandSaved.toLocaleString()} new questions to IndexedDB.`
            );
            return;
          }

          const remainingNeeded = targetCap - currentCount;
          const requestSize = Math.min(BATCH_SIZE, Math.max(5, remainingNeeded));

          // Rotate syllabus topics slice so every batch covers fresh subtopics
          const topicOffset = ((batchIndex - 1) * 6) % Math.max(1, syllabusTopics.length);
          const batchTopics: string[] = [];
          for (let k = 0; k < Math.min(8, syllabusTopics.length); k++) {
            batchTopics.push(syllabusTopics[(topicOffset + k) % syllabusTopics.length]);
          }

          // Sample up to 12 existing questions for this subject to discourage repeats
          const existingRows = await queryQuestionsFromDb({ subject: cfg.id, limit: 12 });
          const existingSamples = existingRows.map((r) => r.question.slice(0, 110));

          setGeminiRunStats((prev) => ({
            ...prev,
            [cfg.id]: {
              ...(prev[cfg.id] || { savedThisRun: 0, dupesThisRun: 0, batchesCompleted: 0 }),
              state: 'active',
              note: `Generating batch #${batchIndex} (${requestSize} Qs)…`,
            },
          }));
          setGeminiMessage(
            `${cfg.uiName}: ${currentCount.toLocaleString()} / ${targetCap.toLocaleString()} — Generating batch #${batchIndex} (${requestSize} questions via Gemini)…`
          );

          let generated: BankQuestion[] | null = null;
          let fatalError: string | null = null;

          for (let attempt = 0; attempt <= MAX_RETRY_ATTEMPTS; attempt++) {
            if (geminiStopRef.current) break;

            const resp = await fetch('/api/question-bank/generate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                subject: cfg.id,
                subjectName: cfg.fullName,
                examType: geminiExamMode,
                batchSize: requestSize,
                requiresLatex: cfg.requiresLatex,
                topics: batchTopics,
                existingSamples,
                batchIndex,
              }),
            });

            const data = await resp.json().catch(() => ({}));
            if (resp.ok && Array.isArray(data?.questions)) {
              generated = data.questions as BankQuestion[];
              break;
            }

            const isRetryable = resp.status === 429 || resp.status >= 500 || resp.status === 502;
            if (isRetryable && attempt < MAX_RETRY_ATTEMPTS) {
              const delayMs = computeRetryDelayMs(attempt);
              setGeminiRunStats((prev) => ({
                ...prev,
                [cfg.id]: {
                  ...(prev[cfg.id] || { savedThisRun: 0, dupesThisRun: 0, batchesCompleted: 0 }),
                  state: 'retrying',
                  note: `Rate limit (${resp.status}) — retry #${attempt + 1}/${MAX_RETRY_ATTEMPTS}`,
                },
              }));
              setGeminiMessage(
                `Rate limit or transient error (${resp.status}) on ${cfg.uiName}. Auto-retrying with exponential backoff in ${Math.round(delayMs / 1000)}s…`
              );
              const slept = await interruptibleSleep(delayMs, geminiStopRef, setRetryCountdownSec);
              if (!slept) break;
              continue;
            }

            fatalError =
              typeof data?.error === 'string' && data.error
                ? data.error
                : `Gemini generator failed (HTTP ${resp.status}).`;
            break;
          }

          if (geminiStopRef.current) {
            setGeminiStatus('idle');
            setGeminiMessage(
              `Queue stopped. Stored ${grandSaved.toLocaleString()} new questions offline.`
            );
            return;
          }

          if (fatalError || !generated) {
            setGeminiRunStats((prev) => ({
              ...prev,
              [cfg.id]: {
                ...(prev[cfg.id] || { savedThisRun: 0, dupesThisRun: 0, batchesCompleted: 0 }),
                state: 'error',
                note: fatalError || 'Batch failed',
              },
            }));
            setGeminiStatus('error');
            setGeminiMessage(fatalError || 'Generation batch failed.');
            return;
          }

          const { saved, duplicates } = await saveQuestionsDeduplicated(generated);
          grandSaved += saved;
          grandDupes += duplicates;
          liveCounts = await getQuestionCountsBySubject();
          currentCount = liveCounts[cfg.id] || 0;

          setGeminiRunStats((prev) => {
            const cur = prev[cfg.id] || {
              savedThisRun: 0,
              dupesThisRun: 0,
              batchesCompleted: 0,
              state: 'active' as const,
            };
            return {
              ...prev,
              [cfg.id]: {
                savedThisRun: cur.savedThisRun + saved,
                dupesThisRun: cur.dupesThisRun + duplicates,
                batchesCompleted: cur.batchesCompleted + 1,
                state: currentCount >= targetCap ? 'done' : 'active',
                note: `+${saved} saved (${duplicates} dupes)`,
              },
            };
          });

          if (saved === 0) {
            zeroGainStreak++;
            if (zeroGainStreak >= 3) break;
          } else {
            zeroGainStreak = 0;
          }

          batchIndex++;
          // Gentle pacing between batches to stay well within rate limits
          if (currentCount < targetCap) {
            await interruptibleSleep(600, geminiStopRef);
          }
        }

        setGeminiRunStats((prev) => ({
          ...prev,
          [cfg.id]: {
            ...(prev[cfg.id] || { savedThisRun: 0, dupesThisRun: 0, batchesCompleted: 0 }),
            state: 'done',
          },
        }));
      }

      setGeminiStatus('done');
      setGeminiMessage(
        `Gemini batch generation complete! Added ${grandSaved.toLocaleString()} unique questions (${grandDupes.toLocaleString()} duplicates filtered).`
      );
      refresh();
    } catch (err) {
      setGeminiStatus('error');
      setGeminiMessage(err instanceof Error ? err.message : 'Unexpected queue error.');
    }
  };

  const handlePauseGemini = () => {
    geminiPauseRef.current = true;
    setGeminiStatus('paused');
    setGeminiMessage('Queue paused — tap Resume to continue from the next batch.');
  };

  const handleResumeGemini = () => {
    geminiPauseRef.current = false;
    setGeminiStatus('running');
    setGeminiMessage('Resuming Gemini batch queue…');
  };

  const handleStopGemini = () => {
    geminiStopRef.current = true;
    geminiPauseRef.current = false;
  };

  const handlePauseAloc = () => {
    alocPauseRef.current = true;
    setAlocStatus('paused');
    setAlocMessage('ALOC fetcher paused — tap Resume to continue cursor pagination.');
  };

  const handleResumeAloc = () => {
    alocPauseRef.current = false;
    setAlocStatus('running');
    setAlocMessage('Resuming ALOC fetcher…');
  };

  const handleStopAloc = () => {
    alocStopRef.current = true;
    alocPauseRef.current = false;
  };

  const handleConfirmClear = async () => {
    if (!confirmClearTarget) return;
    if (confirmClearTarget === 'ALL') {
      await clearAllQuestionsInDb();
      setIoNotice({ kind: 'ok', text: 'Cleared all questions from IndexedDB offline bank.' });
    } else {
      const removed = await clearSubjectQuestionsInDb(confirmClearTarget);
      const label = BANK_SUBJECT_MAP[confirmClearTarget]?.uiName || confirmClearTarget;
      setIoNotice({
        kind: 'ok',
        text: `Removed ${removed.toLocaleString()} offline questions for ${label}.`,
      });
    }
    setConfirmClearTarget(null);
    setDrillAnswers({});
    refresh();
    if (tab === 'browse') void loadBrowseRows();
  };

  const drillStats = useMemo(() => {
    let answered = 0;
    let correct = 0;
    for (const q of browseRows) {
      const picked = drillAnswers[q.id];
      if (picked) {
        answered++;
        if (picked === q.answer) correct++;
      }
    }
    return { answered, correct };
  }, [browseRows, drillAnswers]);

  if (!open) return null;

  const overallPct = Math.min(100, Math.round((totalCount / BANK_TOTAL_TARGET) * 100));

  return (
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center p-2.5 sm:p-5 bg-slate-950/70 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qbank-modal-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-[1040px] max-h-[92vh] rounded-2xl bg-[var(--card)] border border-[var(--line)] shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[var(--line)] bg-[var(--bg)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-start justify-between gap-2.5 min-w-0 flex-1">
            <div className="flex items-start gap-3 min-w-0">
              <span className="w-10 h-10 rounded-xl bg-[var(--gold)] text-[var(--on-acc)] flex items-center justify-center shrink-0">
                <Icon name="database" size={20} />
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 id="qbank-modal-title" className="h20 text-[var(--ink)] truncate">
                    Question Bank Manager
                  </h2>
                  <span className="text-[11.5px] font-bold px-2 py-0.5 rounded-md bg-[var(--acc-soft)] text-[var(--gold)] mono tabular-nums">
                    {totalCount.toLocaleString()} / {BANK_TOTAL_TARGET.toLocaleString()} offline
                  </span>
                </div>
                <p className="text-[12px] sm:text-[12.5px] text-[var(--dim)] leading-snug mt-0.5">
                  IndexedDB Offline Engine · ALOC Past Questions + Gemini Structured JSON Batch Generator
                </p>
              </div>
            </div>
            {/* Mobile-only top-right close button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Question Bank Manager"
              className="sm:hidden w-9 h-9 rounded-xl bg-[var(--card)] border border-[var(--line)] text-[var(--dim)] hover:text-[var(--ink)] flex items-center justify-center shrink-0 cursor-pointer"
            >
              <Icon name="x" size={18} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => void handleExportJson()}
              disabled={ioBusy}
              className="min-h-[36px] px-2.5 sm:px-3 rounded-xl bg-[var(--card)] border border-[var(--line)] hover:border-[var(--gold)] text-[12px] sm:text-[12.5px] font-bold text-[var(--ink)] flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap disabled:opacity-50"
            >
              <Icon name="book" size={14} className="text-[var(--gold)] shrink-0" />
              <span>Export Bank (JSON)</span>
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={ioBusy}
              className="min-h-[36px] px-2.5 sm:px-3 rounded-xl bg-[var(--card)] border border-[var(--line)] hover:border-[var(--gold)] text-[12px] sm:text-[12.5px] font-bold text-[var(--ink)] flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap disabled:opacity-50"
            >
              <Icon name="plus" size={14} className="text-[var(--green)] shrink-0" />
              <span>Import Bank (JSON)</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              onChange={(e) => void handleImportFileChange(e)}
              className="hidden"
              aria-label="Import question bank JSON file"
            />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Question Bank Manager"
              className="hidden sm:flex w-9 h-9 rounded-xl bg-[var(--card)] border border-[var(--line)] hover:border-[var(--acc-line)] text-[var(--dim)] hover:text-[var(--ink)] items-center justify-center cursor-pointer"
            >
              <Icon name="x" size={18} />
            </button>
          </div>
        </header>

        {/* Tab Bar */}
        <nav
          aria-label="Question Bank sections"
          className="px-4 sm:px-6 pt-3 pb-2.5 border-b border-[var(--line)] bg-[var(--card)] flex items-center gap-1.5 overflow-x-auto shrink-0"
        >
          {(
            [
              { id: 'overview', label: '12-Subject Sync Grid', icon: 'grid' },
              { id: 'aloc', label: 'Source A · ALOC Past Qs', icon: 'key' },
              { id: 'gemini', label: 'Source B · Gemini Generator', icon: 'bolt' },
              { id: 'browse', label: `Browse & Drill (${totalCount.toLocaleString()})`, icon: 'books' },
            ] as const
          ).map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`min-h-[38px] px-3.5 rounded-xl text-[12.5px] font-bold flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
                  active
                    ? 'bg-[var(--gold)] text-[var(--on-acc)] shadow-xs'
                    : 'bg-[var(--bg)] text-[var(--dim)] border border-[var(--line)] hover:text-[var(--ink)] hover:border-[var(--acc-line)]'
                }`}
              >
                <Icon name={item.icon} size={14} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Global IO Notice Banner */}
        {ioNotice && (
          <div
            className={`mx-4 sm:mx-6 mt-3 px-3.5 py-2.5 rounded-xl border text-[12.5px] font-semibold flex items-center justify-between gap-3 shrink-0 ${
              ioNotice.kind === 'ok'
                ? 'bg-[var(--ok-soft)] border-[var(--green)]/35 text-[var(--green)]'
                : 'bg-[var(--bad-soft)] border-[var(--bad-line)] text-[var(--coral-ink)]'
            }`}
          >
            <span>{ioNotice.text}</span>
            <button
              type="button"
              onClick={() => setIoNotice(null)}
              aria-label="Dismiss notice"
              className="opacity-75 hover:opacity-100 cursor-pointer"
            >
              <Icon name="x" size={14} />
            </button>
          </div>
        )}

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-5">
          {/* TAB 1: OVERVIEW & 12-SUBJECT SYNC GRID */}
          {tab === 'overview' && (
            <>
              <section className="rounded-2xl bg-[var(--bg)] border border-[var(--line)] p-4 flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="font-[var(--display)] font-bold text-[15.5px] text-[var(--ink)]">
                      IndexedDB Offline Storage Capacity
                    </div>
                    <div className="text-[12.5px] text-[var(--dim)]">
                      Object store <code className="mono font-bold text-[var(--ink)]">questions</code> indexed by{' '}
                      <code className="mono">subject</code>, <code className="mono">examType</code>,{' '}
                      <code className="mono">topic</code> &amp; unique normalized text hash — zero 5MB localStorage limit.
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-[var(--display)] font-extrabold text-[22px] text-[var(--gold)] tabular-nums leading-tight">
                      {totalCount.toLocaleString()} / {BANK_TOTAL_TARGET.toLocaleString()}
                    </div>
                    <div className="text-[11.5px] font-semibold text-[var(--dim)] tabular-nums">
                      {overallPct}% of 12,000 target
                    </div>
                  </div>
                </div>
                <SmoothProgressBar value={totalCount} max={BANK_TOTAL_TARGET} tone="indigo" heightClass="h-2.5" />
              </section>

              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {QUESTION_BANK_SUBJECTS.map((cfg) => {
                  const n = counts[cfg.id] || 0;
                  const pct = Math.min(100, Math.round((n / BANK_TARGET_PER_SUBJECT) * 100));
                  return (
                    <div
                      key={cfg.id}
                      className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-3.5 flex flex-col gap-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-8 h-8 rounded-lg bg-[var(--card)] border border-[var(--line)] text-[var(--gold)] flex items-center justify-center shrink-0">
                            <Icon name={SUBJECT_INFO[cfg.id].icon} size={16} />
                          </span>
                          <div className="min-w-0">
                            <div className="font-[var(--display)] font-bold text-[14px] text-[var(--ink)] truncate">
                              {cfg.uiName}
                              <span className="font-normal text-[12px] text-[var(--dim)]"> · {cfg.fullName}</span>
                            </div>
                            <div className="text-[11px] font-semibold text-[var(--dim)] flex items-center gap-1.5 flex-wrap">
                              <span>
                                {cfg.alocSlug ? `ALOC: ${cfg.alocSlug}` : 'Gemini Primary'}
                              </span>
                              {cfg.requiresLatex && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <span className="text-[var(--gold)]">LaTeX $...$</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className="text-[12px] font-extrabold text-[var(--ink)] tabular-nums whitespace-nowrap">
                          {n.toLocaleString()} / 1,000
                        </span>
                      </div>

                      <SmoothProgressBar value={n} max={BANK_TARGET_PER_SUBJECT} tone={pct >= 100 ? 'emerald' : 'indigo'} heightClass="h-1.5" />

                      <div className="flex items-center justify-between gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setBrowseSubject(cfg.id);
                            setTab('browse');
                          }}
                          className="min-h-[30px] px-2.5 rounded-lg bg-[var(--card)] border border-[var(--line)] hover:border-[var(--gold)] text-[11.5px] font-bold text-[var(--ink)] cursor-pointer"
                        >
                          Browse ({n})
                        </button>
                        <div className="flex items-center gap-1.5">
                          {cfg.alocSlug && (
                            <button
                              type="button"
                              onClick={() => {
                                setAlocSubject(cfg.id);
                                setTab('aloc');
                              }}
                              className="min-h-[30px] px-2.5 rounded-lg bg-[var(--card)] border border-[var(--line)] hover:border-[var(--gold)] text-[11.5px] font-bold text-[var(--dim)] hover:text-[var(--ink)] cursor-pointer"
                            >
                              ALOC
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedGeminiSubjects([cfg.id]);
                              setTab('gemini');
                            }}
                            className="min-h-[30px] px-2.5 rounded-lg bg-[var(--acc-soft)] border border-[var(--acc-line)] text-[11.5px] font-bold text-[var(--gold)] cursor-pointer"
                          >
                            + Gemini
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </section>
            </>
          )}

          {/* TAB 2: SOURCE A — REAL PAST QUESTIONS FETCHER (ALOC API) */}
          {tab === 'aloc' && (
            <div className="flex flex-col gap-4">
              <section className="rounded-2xl bg-[var(--bg)] border border-[var(--line)] p-4 sm:p-5 flex flex-col gap-4">
                <div>
                  <span className="eyebrow text-[var(--gold)]">Source A · Official Past Questions</span>
                  <h3 className="h18 text-[var(--ink)]">ALOC v1 Batch Fetcher</h3>
                  <p className="text-[13px] text-[var(--dim)] mt-0.5">
                    Streams real JAMB, WAEC, and NECO past papers from{' '}
                    <code className="mono text-[12px] text-[var(--ink)]">https://dev.aloc.com.ng/api/v1/questions</code>{' '}
                    using <code className="mono text-[12px]">X-API-Key</code>, <code className="mono text-[12px]">limit=15</code>, and{' '}
                    <code className="mono text-[12px]">cursor</code> pagination. Every question is deduplicated before saving to IndexedDB.
                  </p>
                </div>

                {/* ALOC API Key Input */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="aloc-api-key-input" className="text-[12.5px] font-bold text-[var(--ink)]">
                    ALOC API Key <span className="font-normal text-[var(--dim)]">(saved locally in this browser)</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        id="aloc-api-key-input"
                        type={showAlocKey ? 'text' : 'password'}
                        value={alocKey}
                        onChange={(e) => setAlocKey(e.target.value)}
                        autoComplete="off"
                        spellCheck={false}
                        maxLength={256}
                        placeholder="Paste your ALOC X-API-Key (e.g. ALOC-...)"
                        className="w-full min-h-[42px] pl-3.5 pr-10 rounded-xl bg-[var(--card)] border border-[var(--line)] focus:border-[var(--gold)] outline-none text-[13.5px] text-[var(--ink)] mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAlocKey((s) => !s)}
                        aria-label={showAlocKey ? 'Hide ALOC API key' : 'Show ALOC API key'}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--dim)] hover:text-[var(--ink)] cursor-pointer p-1"
                      >
                        <Icon name={showAlocKey ? 'eyeOff' : 'eye'} size={16} />
                      </button>
                    </div>
                    {alocKey && (
                      <button
                        type="button"
                        onClick={() => setAlocKey('')}
                        className="min-h-[42px] px-3 rounded-xl bg-[var(--card)] border border-[var(--line)] text-[12px] font-bold text-[var(--dim)] hover:text-[var(--coral-ink)] cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Controls Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="aloc-subject-select" className="text-[12.5px] font-bold text-[var(--ink)]">
                      Subject (ALOC Slug Map)
                    </label>
                    <select
                      id="aloc-subject-select"
                      value={alocSubject}
                      onChange={(e) => setAlocSubject(e.target.value as SubjectId | 'ALL_ALOC')}
                      disabled={alocStatus === 'running' || alocStatus === 'paused'}
                      className="min-h-[40px] px-3 rounded-xl bg-[var(--card)] border border-[var(--line)] text-[13px] font-semibold text-[var(--ink)]"
                    >
                      <option value="ALL_ALOC">All 9 ALOC Subjects</option>
                      {ALOC_SUPPORTED_SUBJECTS.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.uiName} → {s.alocSlug} ({(counts[s.id] || 0).toLocaleString()} stored)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="aloc-exam-select" className="text-[12.5px] font-bold text-[var(--ink)]">
                      Exam Body
                    </label>
                    <select
                      id="aloc-exam-select"
                      value={alocExamType}
                      onChange={(e) => setAlocExamType(e.target.value as 'jamb' | 'waec' | 'neco' | 'all')}
                      disabled={alocStatus === 'running' || alocStatus === 'paused'}
                      className="min-h-[40px] px-3 rounded-xl bg-[var(--card)] border border-[var(--line)] text-[13px] font-semibold text-[var(--ink)]"
                    >
                      <option value="jamb">JAMB (jamb)</option>
                      <option value="waec">WAEC (waec)</option>
                      <option value="neco">NECO (neco)</option>
                      <option value="all">All 3 (JAMB + WAEC + NECO)</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="aloc-pages-select" className="text-[12.5px] font-bold text-[var(--ink)]">
                      Pages per Subject (15 Qs/page)
                    </label>
                    <select
                      id="aloc-pages-select"
                      value={alocMaxPages}
                      onChange={(e) => setAlocMaxPages(Number(e.target.value))}
                      disabled={alocStatus === 'running' || alocStatus === 'paused'}
                      className="min-h-[40px] px-3 rounded-xl bg-[var(--card)] border border-[var(--line)] text-[13px] font-semibold text-[var(--ink)]"
                    >
                      <option value={5}>5 pages (up to 75 Qs)</option>
                      <option value={10}>10 pages (up to 150 Qs)</option>
                      <option value={25}>25 pages (up to 375 Qs)</option>
                      <option value={70}>70 pages (up to 1,000 Qs)</option>
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  {alocStatus !== 'running' && alocStatus !== 'paused' ? (
                    <button
                      type="button"
                      onClick={() => void handleStartAlocFetch()}
                      className="btn-tactile indigo min-h-[40px] px-5 text-[13.5px]"
                    >
                      <Icon name="play" size={15} />
                      <span>Fetch Past Questions</span>
                    </button>
                  ) : (
                    <>
                      {alocStatus === 'running' ? (
                        <button
                          type="button"
                          onClick={handlePauseAloc}
                          className="btn-tactile paper min-h-[40px] px-4 text-[13px]"
                        >
                          <Icon name="pause" size={15} />
                          <span>Pause</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResumeAloc}
                          className="btn-tactile indigo min-h-[40px] px-4 text-[13px]"
                        >
                          <Icon name="play" size={15} />
                          <span>Resume</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleStopAloc}
                        className="min-h-[40px] px-4 rounded-xl bg-[var(--bad-soft)] border border-[var(--bad-line)] text-[var(--coral-ink)] text-[13px] font-bold cursor-pointer"
                      >
                        Stop
                      </button>
                    </>
                  )}
                </div>

                {alocMessage && (
                  <div
                    className={`rounded-xl px-3.5 py-2.5 border text-[12.5px] font-semibold ${
                      alocStatus === 'error'
                        ? 'bg-[var(--bad-soft)] border-[var(--bad-line)] text-[var(--coral-ink)]'
                        : alocStatus === 'done'
                          ? 'bg-[var(--ok-soft)] border-[var(--green)]/35 text-[var(--green)]'
                          : 'bg-[var(--card)] border-[var(--line)] text-[var(--ink)]'
                    }`}
                  >
                    <div>{alocMessage}</div>
                    {(alocStats.pagesFetched > 0 || alocStats.saved > 0) && (
                      <div className="text-[11.5px] text-[var(--dim)] mt-1 mono tabular-nums">
                        Pages: {alocStats.pagesFetched} · New Saved: {alocStats.saved} · Duplicates Skipped:{' '}
                        {alocStats.duplicates}
                        {alocStats.lastCursor ? ` · Cursor: ${alocStats.lastCursor.slice(0, 20)}` : ''}
                      </div>
                    )}
                  </div>
                )}
              </section>

              {/* ALOC Slug Reference Table */}
              <section className="rounded-2xl bg-[var(--bg)] border border-[var(--line)] p-4">
                <div className="text-[12.5px] font-bold text-[var(--ink)] mb-2.5">
                  Mapped ALOC Subject Slugs (9 Supported · Use Source B Gemini for F.Maths, DigiTech &amp; DataProc)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ALOC_SUPPORTED_SUBJECTS.map((s) => (
                    <div
                      key={s.id}
                      className="px-3 py-2 rounded-lg bg-[var(--card)] border border-[var(--line)] flex items-center justify-between gap-2 text-[12px]"
                    >
                      <span className="font-bold text-[var(--ink)]">{s.uiName}</span>
                      <code className="mono text-[11.5px] text-[var(--gold)]">{s.alocSlug}</code>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* TAB 3: SOURCE B — GEMINI BATCH GENERATOR */}
          {tab === 'gemini' && (
            <div className="flex flex-col gap-4">
              <section className="rounded-2xl bg-[var(--bg)] border border-[var(--line)] p-4 sm:p-5 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <span className="eyebrow text-[var(--gold)]">Source B · Structured JSON Output (25 Qs / Call)</span>
                    <h3 className="h18 text-[var(--ink)]">Gemini Batch Question Generator</h3>
                    <p className="text-[13px] text-[var(--dim)] mt-0.5">
                      Generates authentic NERDC/JAMB/WAEC/NECO questions in batches of 25 via server-side Gemini{' '}
                      <code className="mono text-[12px]">responseSchema</code> with automatic retry &amp; exponential backoff on rate limits.
                      Clean LaTeX (<code className="mono text-[12px]">$...$</code>) is enforced for Maths, F.Maths, Chem, and Phys.
                    </p>
                  </div>
                </div>

                {/* Subject Presets */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[12px] font-bold text-[var(--dim)]">Quick select:</span>
                  <button
                    type="button"
                    disabled={geminiStatus === 'running' || geminiStatus === 'paused'}
                    onClick={() => setSelectedGeminiSubjects([...GEMINI_PRIMARY_SUBJECTS])}
                    className="min-h-[30px] px-2.5 rounded-lg bg-[var(--acc-soft)] border border-[var(--acc-line)] text-[12px] font-bold text-[var(--gold)] cursor-pointer disabled:opacity-50"
                  >
                    DigiTech + DataProc + F.Maths
                  </button>
                  <button
                    type="button"
                    disabled={geminiStatus === 'running' || geminiStatus === 'paused'}
                    onClick={() => setSelectedGeminiSubjects(QUESTION_BANK_SUBJECTS.map((s) => s.id))}
                    className="min-h-[30px] px-2.5 rounded-lg bg-[var(--card)] border border-[var(--line)] text-[12px] font-bold text-[var(--ink)] cursor-pointer disabled:opacity-50"
                  >
                    All 12 Subjects
                  </button>
                  <button
                    type="button"
                    disabled={geminiStatus === 'running' || geminiStatus === 'paused'}
                    onClick={() => setSelectedGeminiSubjects([])}
                    className="min-h-[30px] px-2.5 rounded-lg bg-[var(--card)] border border-[var(--line)] text-[12px] font-bold text-[var(--dim)] cursor-pointer disabled:opacity-50"
                  >
                    Clear
                  </button>
                </div>

                {/* 12-Subject Multi-Select Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {QUESTION_BANK_SUBJECTS.map((cfg) => {
                    const checked = selectedGeminiSubjects.includes(cfg.id);
                    const n = counts[cfg.id] || 0;
                    return (
                      <button
                        key={cfg.id}
                        type="button"
                        disabled={geminiStatus === 'running' || geminiStatus === 'paused'}
                        onClick={() => toggleGeminiSubject(cfg.id)}
                        aria-pressed={checked}
                        className={`p-2.5 rounded-xl border text-left transition cursor-pointer disabled:opacity-65 ${
                          checked
                            ? 'bg-[var(--acc-soft)] border-[var(--gold)] ring-1 ring-[var(--gold)]/25'
                            : 'bg-[var(--card)] border-[var(--line)] hover:border-[var(--acc-line)]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-[12.5px] text-[var(--ink)]">{cfg.uiName}</span>
                          {cfg.requiresLatex && (
                            <span className="text-[10px] font-bold text-[var(--gold)] mono">TeX</span>
                          )}
                        </div>
                        <div className="text-[11.5px] font-semibold text-[var(--dim)] tabular-nums mt-0.5">
                          {n.toLocaleString()} / 1,000
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Config Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="gemini-exam-mode" className="text-[12.5px] font-bold text-[var(--ink)]">
                      Target Exam Distribution
                    </label>
                    <select
                      id="gemini-exam-mode"
                      value={geminiExamMode}
                      onChange={(e) => setGeminiExamMode(e.target.value as 'MIXED' | BankExamType)}
                      disabled={geminiStatus === 'running' || geminiStatus === 'paused'}
                      className="min-h-[40px] px-3 rounded-xl bg-[var(--card)] border border-[var(--line)] text-[13px] font-semibold text-[var(--ink)]"
                    >
                      <option value="MIXED">Mixed JAMB + WAEC + NECO</option>
                      <option value="JAMB">JAMB UTME Only</option>
                      <option value="WAEC">WAEC WASSCE Only</option>
                      <option value="NECO">NECO SSCE Only</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="gemini-target-cap" className="text-[12.5px] font-bold text-[var(--ink)]">
                      Target Offline Count per Selected Subject
                    </label>
                    <select
                      id="gemini-target-cap"
                      value={geminiTargetPerSubj}
                      onChange={(e) => setGeminiTargetPerSubj(Number(e.target.value))}
                      disabled={geminiStatus === 'running' || geminiStatus === 'paused'}
                      className="min-h-[40px] px-3 rounded-xl bg-[var(--card)] border border-[var(--line)] text-[13px] font-semibold text-[var(--ink)]"
                    >
                      <option value={25}>25 Qs (1 quick batch)</option>
                      <option value={100}>100 Qs (4 batches)</option>
                      <option value={250}>250 Qs (10 batches)</option>
                      <option value={500}>500 Qs (20 batches)</option>
                      <option value={1000}>1,000 Qs (Full 1,000/subject cap)</option>
                    </select>
                  </div>
                </div>

                {/* Queue Controls: Start / Pause / Resume / Stop */}
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  {geminiStatus !== 'running' && geminiStatus !== 'paused' ? (
                    <button
                      type="button"
                      onClick={() => void handleStartGeminiQueue()}
                      disabled={selectedGeminiSubjects.length === 0}
                      className="btn-tactile indigo min-h-[40px] px-5 text-[13.5px] disabled:opacity-50"
                    >
                      <Icon name="play" size={15} />
                      <span>
                        Start Generation Queue ({selectedGeminiSubjects.length}{' '}
                        {selectedGeminiSubjects.length === 1 ? 'subject' : 'subjects'})
                      </span>
                    </button>
                  ) : (
                    <>
                      {geminiStatus === 'running' ? (
                        <button
                          type="button"
                          onClick={handlePauseGemini}
                          className="btn-tactile paper min-h-[40px] px-4 text-[13px]"
                        >
                          <Icon name="pause" size={15} />
                          <span>Pause Queue</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResumeGemini}
                          className="btn-tactile indigo min-h-[40px] px-4 text-[13px]"
                        >
                          <Icon name="play" size={15} />
                          <span>Resume Queue</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleStopGemini}
                        className="min-h-[40px] px-4 rounded-xl bg-[var(--bad-soft)] border border-[var(--bad-line)] text-[var(--coral-ink)] text-[13px] font-bold cursor-pointer"
                      >
                        Stop
                      </button>
                    </>
                  )}
                  {retryCountdownSec > 0 && (
                    <span className="text-[12px] font-bold text-[var(--coral-ink)] mono">
                      Backoff retry in {retryCountdownSec}s…
                    </span>
                  )}
                </div>

                {geminiMessage && (
                  <div
                    className={`rounded-xl px-3.5 py-2.5 border text-[12.5px] font-semibold ${
                      geminiStatus === 'error'
                        ? 'bg-[var(--bad-soft)] border-[var(--bad-line)] text-[var(--coral-ink)]'
                        : geminiStatus === 'done'
                          ? 'bg-[var(--ok-soft)] border-[var(--green)]/35 text-[var(--green)]'
                          : 'bg-[var(--card)] border-[var(--line)] text-[var(--ink)]'
                    }`}
                  >
                    {geminiMessage}
                  </div>
                )}
              </section>

              {/* Per-Subject Live Progress Bars (e.g. "DataProc: 125 / 1,000") */}
              <section className="rounded-2xl bg-[var(--bg)] border border-[var(--line)] p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-[var(--display)] font-bold text-[14.5px] text-[var(--ink)]">
                    Per-Subject Progress
                  </div>
                  <span className="text-[12px] text-[var(--dim)] tabular-nums">
                    Target: {geminiTargetPerSubj.toLocaleString()} / subject
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {QUESTION_BANK_SUBJECTS.filter((s) => selectedGeminiSubjects.includes(s.id)).map((cfg) => {
                    const n = counts[cfg.id] || 0;
                    const stat = geminiRunStats[cfg.id];
                    return (
                      <div
                        key={cfg.id}
                        className="rounded-xl bg-[var(--card)] border border-[var(--line)] p-3 flex flex-col gap-1.5"
                      >
                        <div className="flex items-center justify-between gap-2 text-[12.5px]">
                          <span className="font-bold text-[var(--ink)] tabular-nums">
                            {cfg.uiName}: {n.toLocaleString()} / {BANK_TARGET_PER_SUBJECT.toLocaleString()}
                          </span>
                          {stat && (
                            <span
                              className={`text-[11px] font-bold ${
                                stat.state === 'done'
                                  ? 'text-[var(--green)]'
                                  : stat.state === 'error'
                                    ? 'text-[var(--coral-ink)]'
                                    : stat.state === 'retrying'
                                      ? 'text-amber-500'
                                      : 'text-[var(--gold)]'
                              }`}
                            >
                              {stat.note || stat.state}
                            </span>
                          )}
                        </div>
                        <SmoothProgressBar
                          value={n}
                          max={BANK_TARGET_PER_SUBJECT}
                          tone={n >= geminiTargetPerSubj ? 'emerald' : 'indigo'}
                          heightClass="h-2"
                        />
                      </div>
                    );
                  })}
                  {selectedGeminiSubjects.length === 0 && (
                    <div className="text-[13px] text-[var(--dim)] col-span-full py-2">
                      Select one or more subjects above to monitor their generation progress.
                    </div>
                  )}
                </div>
              </section>
            </div>
          )}

          {/* TAB 4: BROWSE OFFLINE BANK, DRILL & EXPORT / IMPORT */}
          {tab === 'browse' && (
            <div className="flex flex-col gap-4">
              {/* Filter Bar */}
              <section className="rounded-2xl bg-[var(--bg)] border border-[var(--line)] p-3.5 sm:p-4 flex flex-col gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                  <select
                    aria-label="Filter by subject"
                    value={browseSubject}
                    onChange={(e) => {
                      setBrowseSubject(e.target.value as SubjectId | 'ALL');
                      setDrillAnswers({});
                    }}
                    className="min-h-[38px] px-3 rounded-xl bg-[var(--card)] border border-[var(--line)] text-[13px] font-semibold text-[var(--ink)]"
                  >
                    <option value="ALL">All 12 Subjects ({totalCount.toLocaleString()})</option>
                    {QUESTION_BANK_SUBJECTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.uiName} ({(counts[s.id] || 0).toLocaleString()})
                      </option>
                    ))}
                  </select>

                  <select
                    aria-label="Filter by exam type"
                    value={browseExamType}
                    onChange={(e) => setBrowseExamType(e.target.value as 'ALL' | BankExamType)}
                    className="min-h-[38px] px-3 rounded-xl bg-[var(--card)] border border-[var(--line)] text-[13px] font-semibold text-[var(--ink)]"
                  >
                    <option value="ALL">All Exams (JAMB/WAEC/NECO)</option>
                    <option value="JAMB">JAMB</option>
                    <option value="WAEC">WAEC</option>
                    <option value="NECO">NECO</option>
                  </select>

                  <input
                    type="text"
                    value={browseTopic}
                    onChange={(e) => setBrowseTopic(e.target.value)}
                    placeholder="Filter by topic…"
                    aria-label="Filter by topic"
                    className="min-h-[38px] px-3 rounded-xl bg-[var(--card)] border border-[var(--line)] text-[13px] text-[var(--ink)]"
                  />

                  <input
                    type="search"
                    value={browseSearch}
                    onChange={(e) => setBrowseSearch(e.target.value)}
                    placeholder="Search question text…"
                    aria-label="Search question text"
                    className="min-h-[38px] px-3 rounded-xl bg-[var(--card)] border border-[var(--line)] text-[13px] text-[var(--ink)]"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[var(--line)]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        setDrillMode((m) => !m);
                        setDrillAnswers({});
                      }}
                      className={`min-h-[34px] px-3 rounded-lg text-[12px] font-bold flex items-center gap-1.5 cursor-pointer ${
                        drillMode
                          ? 'bg-[var(--gold)] text-[var(--on-acc)]'
                          : 'bg-[var(--card)] border border-[var(--line)] text-[var(--ink)] hover:border-[var(--gold)]'
                      }`}
                    >
                      <Icon name="target" size={14} />
                      <span>{drillMode ? 'Exit Offline Drill' : 'Practice Offline Drill'}</span>
                    </button>
                    {drillMode && (
                      <span className="text-[12px] font-bold text-[var(--green)] tabular-nums">
                        Score: {drillStats.correct} / {drillStats.answered} answered
                      </span>
                    )}
                    <span className="text-[12px] text-[var(--dim)] tabular-nums">
                      Showing {browseRows.length} matching offline {browseRows.length === 1 ? 'question' : 'questions'}
                    </span>
                  </div>

                  {/* Safe 2-step Clear Controls */}
                  {totalCount > 0 && (
                    <div className="flex items-center gap-2">
                      {confirmClearTarget ? (
                        <div className="flex items-center gap-1.5 bg-[var(--bad-soft)] border border-[var(--bad-line)] px-2.5 py-1 rounded-lg">
                          <span className="text-[11.5px] font-bold text-[var(--coral-ink)]">
                            Clear {confirmClearTarget === 'ALL' ? 'entire bank' : BANK_SUBJECT_MAP[confirmClearTarget]?.uiName}?
                          </span>
                          <button
                            type="button"
                            onClick={() => void handleConfirmClear()}
                            className="px-2 py-0.5 rounded bg-[var(--coral-ink)] text-white text-[11px] font-bold cursor-pointer"
                          >
                            Confirm
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmClearTarget(null)}
                            className="px-2 py-0.5 rounded bg-[var(--card)] text-[var(--ink)] text-[11px] font-bold cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            setConfirmClearTarget(browseSubject === 'ALL' ? 'ALL' : browseSubject)
                          }
                          className="text-[12px] font-bold text-[var(--dim)] hover:text-[var(--coral-ink)] cursor-pointer"
                        >
                          {browseSubject === 'ALL'
                            ? 'Clear All Bank'
                            : `Clear ${BANK_SUBJECT_MAP[browseSubject]?.uiName}`}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </section>

              {/* Question List */}
              {browseLoading ? (
                <div className="py-10 text-center text-[13.5px] text-[var(--dim)]">
                  Querying IndexedDB…
                </div>
              ) : browseRows.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[var(--line)] p-8 text-center flex flex-col items-center gap-3">
                  <Icon name="database" size={28} className="text-[var(--dim)]" />
                  <div className="font-[var(--display)] font-bold text-[16px] text-[var(--ink)]">
                    No offline questions stored for this filter yet
                  </div>
                  <p className="text-[13px] text-[var(--dim)] max-w-[440px]">
                    Fetch real past questions via ALOC (Source A), run the Gemini Batch Generator (Source B), or click{' '}
                    <strong>Import Bank (JSON)</strong> to preload questions offline.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setTab('gemini')}
                      className="btn-tactile indigo min-h-[38px] text-[13px] px-4"
                    >
                      <Icon name="bolt" size={14} />
                      <span>Open Gemini Generator</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTab('aloc')}
                      className="btn-tactile paper min-h-[38px] text-[13px] px-4"
                    >
                      <Icon name="key" size={14} />
                      <span>Open ALOC Fetcher</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {browseRows.map((q, idx) => {
                    const subjCfg = BANK_SUBJECT_MAP[q.subject];
                    const picked = drillAnswers[q.id];
                    const revealed = drillMode ? Boolean(picked) : Boolean(revealedIds[q.id]);

                    return (
                      <article
                        key={q.id}
                        className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-4 flex flex-col gap-3"
                      >
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2 flex-wrap text-[11.5px] font-bold">
                            <span className="px-2 py-0.5 rounded bg-[var(--acc-soft)] text-[var(--gold)]">
                              #{idx + 1} · {subjCfg?.uiName || q.subject}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-[var(--card)] border border-[var(--line)] text-[var(--ink)]">
                              {q.examType} {q.year}
                            </span>
                            <span className="text-[var(--dim)]">{q.topic}</span>
                          </div>
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded mono ${
                              q.source === 'api'
                                ? 'bg-[var(--ok-soft)] text-[var(--green)]'
                                : 'bg-[var(--card)] border border-[var(--line)] text-[var(--dim)]'
                            }`}
                          >
                            {q.source === 'api' ? 'ALOC API' : 'Gemini AI'}
                          </span>
                        </div>

                        <div
                          className="text-[14.5px] font-semibold text-[var(--ink)] leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: renderInlineLatexToHtml(q.question) }}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {(['A', 'B', 'C', 'D'] as BankOptionKey[]).map((letter) => {
                            const isCorrect = q.answer === letter;
                            const isPicked = picked === letter;
                            let cls =
                              'bg-[var(--card)] border-[var(--line)] text-[var(--ink)]';
                            if (revealed && isCorrect) {
                              cls = 'bg-[var(--ok-soft)] border-[var(--green)] text-[var(--ink)] font-bold';
                            } else if (drillMode && isPicked && !isCorrect) {
                              cls = 'bg-[var(--bad-soft)] border-[var(--coral-ink)] text-[var(--coral-ink)]';
                            }

                            if (drillMode) {
                              return (
                                <button
                                  key={letter}
                                  type="button"
                                  disabled={Boolean(picked)}
                                  onClick={() =>
                                    setDrillAnswers((prev) => ({ ...prev, [q.id]: letter }))
                                  }
                                  className={`p-2.5 rounded-lg border text-left text-[13px] flex items-start gap-2 cursor-pointer disabled:cursor-default ${cls}`}
                                >
                                  <span className="font-extrabold text-[var(--gold)] shrink-0">{letter}.</span>
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: renderInlineLatexToHtml(q.options[letter]),
                                    }}
                                  />
                                </button>
                              );
                            }

                            return (
                              <div
                                key={letter}
                                className={`p-2.5 rounded-lg border text-[13px] flex items-start gap-2 ${cls}`}
                              >
                                <span className="font-extrabold text-[var(--gold)] shrink-0">{letter}.</span>
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: renderInlineLatexToHtml(q.options[letter]),
                                  }}
                                />
                              </div>
                            );
                          })}
                        </div>

                        {!drillMode && (
                          <div className="flex items-center justify-between gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() =>
                                setRevealedIds((prev) => ({ ...prev, [q.id]: !prev[q.id] }))
                              }
                              className="text-[12px] font-bold text-[var(--gold)] hover:underline cursor-pointer"
                            >
                              {revealed ? 'Hide answer & explanation' : 'Show answer & explanation'}
                            </button>
                          </div>
                        )}

                        {revealed && (
                          <div className="rounded-lg bg-[var(--card)] border border-[var(--line)] p-3 text-[12.5px] text-[var(--dim)] leading-relaxed">
                            <span className="font-extrabold text-[var(--green)]">
                              Answer: {q.answer} —{' '}
                            </span>
                            <span
                              dangerouslySetInnerHTML={{
                                __html: renderInlineLatexToHtml(q.explanation),
                              }}
                            />
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
