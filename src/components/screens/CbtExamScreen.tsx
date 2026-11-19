import React, { useEffect, useMemo, useState } from 'react';
import type { Question, SubjectId, Topic, UserProgress } from '../../types';
import { SUBJECTS, SUBJECT_IDS } from '../../data/curriculum';
import { SUBJECT_INFO, mmss, today } from '../../utils/engine';
import {
  CBT_PRESETS,
  buildCbtPaper,
  evaluateCbtSubmission,
  type CbtDiagnosticReport,
  type CbtExamMode,
  type CbtPresetId,
  type CbtQuestionItem,
} from '../../utils/cbtEngine';
import { typesetMathHtml } from '../../utils/mathTypesetter';
import { SubscreenTopBar } from '../AppShell';
import { DiagramFigure, Icon } from '../Icons';
import { StudyToolsDrawer } from '../StudyToolsDrawer';

export function CbtExamScreen({
  progress,
  onCompleteCbt,
  onOpenWeakTopic,
  onBack,
}: {
  progress: UserProgress;
  onCompleteCbt: (payload: {
    mode: CbtExamMode;
    subjects: SubjectId[];
    report: CbtDiagnosticReport;
    durationSec: number;
    missedQuestions: { q: Question; subj: SubjectId; pickedIdx: number }[];
    answeredResults: { q: Question; ok: boolean }[];
  }) => void;
  onOpenWeakTopic: (subj: SubjectId, topicId: string) => void;
  onBack: () => void;
}) {
  const [phase, setPhase] = useState<'setup' | 'exam' | 'report'>('setup');
  const [mode, setMode] = useState<CbtExamMode>('jamb');
  const [preset, setPreset] = useState<CbtPresetId>('sprint');
  const [selectedOthers, setSelectedOthers] = useState<SubjectId[]>(() => {
    const defaults: SubjectId[] = [];
    for (const s of ['maths', 'chem', 'phys', ...progress.subjs] as SubjectId[]) {
      if (s !== 'eng' && !defaults.includes(s) && defaults.length < 3) defaults.push(s);
    }
    return defaults;
  });
  const [waecSubj, setWaecSubj] = useState<SubjectId>(progress.subj);

  // Active exam state
  const [paper, setPaper] = useState<CbtQuestionItem[]>([]);
  const [curIndex, setCurIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(1800);
  const [totalDuration, setTotalDuration] = useState(1800);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [report, setReport] = useState<CbtDiagnosticReport | null>(null);

  const topicsMap = useMemo(() => {
    const map = {} as Record<SubjectId, Topic[]>;
    for (const sid of SUBJECT_IDS) map[sid] = SUBJECTS[sid].topics;
    return map;
  }, []);

  const examSubjects = useMemo<SubjectId[]>(
    () => (mode === 'jamb' ? ['eng', ...selectedOthers.slice(0, 3)] : [waecSubj]),
    [mode, selectedOthers, waecSubj]
  );

  const toggleJambSubj = (sid: SubjectId) => {
    if (sid === 'eng') return;
    setSelectedOthers((prev) => {
      if (prev.includes(sid)) {
        return prev.length > 1 ? prev.filter((x) => x !== sid) : prev;
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), sid];
      }
      return [...prev, sid];
    });
  };

  const handleStartExam = () => {
    const built = buildCbtPaper(
      mode,
      preset,
      examSubjects,
      progress,
      topicsMap,
      `cbt-${today()}-${Date.now()}`
    );
    if (!built.length) return;
    const dur = CBT_PRESETS[preset].durationSec;
    setPaper(built);
    setCurIndex(0);
    setAnswers({});
    setFlagged({});
    setTimeLeft(dur);
    setTotalDuration(dur);
    setConfirmSubmit(false);
    setReport(null);
    setPhase('exam');
  };

  const finalizeExam = (currentPaper: CbtQuestionItem[], currentAnswers: Record<string, number>, elapsedSec: number) => {
    const diag = evaluateCbtSubmission(mode, currentPaper, currentAnswers);
    const missedQuestions: { q: Question; subj: SubjectId; pickedIdx: number }[] = [];
    const answeredResults: { q: Question; ok: boolean }[] = [];
    for (const item of currentPaper) {
      const picked = currentAnswers[item.key];
      const ok = picked !== undefined && picked === item.q.a;
      if (picked !== undefined) {
        answeredResults.push({ q: item.q, ok });
      }
      if (!ok) {
        missedQuestions.push({ q: item.q, subj: item.subj, pickedIdx: picked ?? -1 });
      }
    }
    setReport(diag);
    setPhase('report');
    setToolsOpen(false);
    onCompleteCbt({
      mode,
      subjects: examSubjects,
      report: diag,
      durationSec: elapsedSec,
      missedQuestions,
      answeredResults,
    });
  };

  useEffect(() => {
    if (phase !== 'exam') return;
    const id = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase === 'exam' && timeLeft === 0 && paper.length > 0) {
      finalizeExam(paper, answers, totalDuration);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, phase]);

  // Official JAMB CBT keyboard shortcuts: A/B/C/D, N (next), P (prev), F (flag)
  useEffect(() => {
    if (phase !== 'exam' || !paper[curIndex] || toolsOpen) return;
    const item = paper[curIndex];
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.metaKey || e.ctrlKey || e.altKey) return;
      const key = e.key.toUpperCase();
      const letterIdx = ['A', 'B', 'C', 'D'].indexOf(key);
      if (letterIdx >= 0 && letterIdx < item.order.length) {
        e.preventDefault();
        const origIdx = item.order[letterIdx];
        setAnswers((prev) => ({ ...prev, [item.key]: origIdx }));
      } else if (key === 'N' || e.key === 'ArrowRight') {
        e.preventDefault();
        setCurIndex((i) => Math.min(paper.length - 1, i + 1));
      } else if (key === 'P' || e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurIndex((i) => Math.max(0, i - 1));
      } else if (key === 'F') {
        e.preventDefault();
        setFlagged((prev) => ({ ...prev, [item.key]: !prev[item.key] }));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, paper, curIndex, toolsOpen]);

  const answeredCount = Object.keys(answers).length;
  const flaggedCount = Object.values(flagged).filter(Boolean).length;

  if (phase === 'setup') {
    const presetCfg = CBT_PRESETS[preset];
    const estQuestions =
      mode === 'jamb'
        ? presetCfg.jambPerSubj.eng + selectedOthers.length * presetCfg.jambPerSubj.other
        : presetCfg.waecCount;

    return (
      <div className="flex flex-col gap-5 anim-rise">
        <SubscreenTopBar
          title="JAMB UTME & WAEC CBT Simulator"
          subtitle="Official Timed Exam Engine"
          onBack={onBack}
        />

        <div className="grid grid-cols-1 min-[880px]:grid-cols-12 gap-5 items-start">
          <section className="min-[880px]:col-span-7 rtc-card rounded-2xl p-5 sm:p-6 flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <span className="eyebrow text-[var(--gold)]">Exam Configuration</span>
              <h2 className="h22 text-[var(--ink)]">Configure Your CBT Sitting</h2>
              <p className="text-[14px] text-[var(--dim)]">
                Practice under authentic CBT conditions with official 400-score scaling, keyboard shortcuts (A–D, N, P, F), on-screen calculator, and weak-topic diagnostics.
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="grid grid-cols-2 gap-2.5">
              {(
                [
                  ['jamb', 'JAMB UTME (4 Subjects)', 'English + 3 faculties · /400 scale'],
                  ['waec', 'WAEC Objective Mock', 'Single faculty · A1–F9 grading'],
                ] as const
              ).map(([mId, title, desc]) => (
                <button
                  key={mId}
                  type="button"
                  onClick={() => setMode(mId)}
                  className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                    mode === mId
                      ? 'bg-[var(--acc-soft)] border-[var(--gold)] ring-1 ring-[var(--gold)]/25'
                      : 'bg-[var(--bg)] border-[var(--line)] hover:border-[var(--acc-line)]'
                  }`}
                >
                  <div className="font-[var(--display)] font-bold text-[14.5px] text-[var(--ink)]">{title}</div>
                  <div className="text-[12px] text-[var(--dim)] mt-0.5">{desc}</div>
                </button>
              ))}
            </div>

            {/* Preset Duration */}
            <div className="flex flex-col gap-2">
              <span className="text-[13px] font-bold text-[var(--ink)]">Session Length</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {(['sprint', 'half', 'full'] as const).map((pid) => (
                  <button
                    key={pid}
                    type="button"
                    onClick={() => setPreset(pid)}
                    className={`px-3 py-2.5 rounded-xl border text-[12.5px] font-bold transition cursor-pointer whitespace-nowrap ${
                      preset === pid
                        ? 'bg-[var(--gold)] text-[var(--on-acc)] border-[var(--gold)]'
                        : 'bg-[var(--bg)] text-[var(--dim)] border-[var(--line)] hover:text-[var(--ink)]'
                    }`}
                  >
                    {CBT_PRESETS[pid].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject Picker */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-[var(--ink)]">
                  {mode === 'jamb' ? 'Use of English + Pick 3 Faculties' : 'Choose Subject for WAEC Mock'}
                </span>
                <span className="text-[12px] font-semibold text-[var(--gold)] tabular-nums">
                  {examSubjects.length} selected
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SUBJECT_IDS.map((sid) => {
                  const isLockedEng = mode === 'jamb' && sid === 'eng';
                  const active =
                    mode === 'jamb' ? isLockedEng || selectedOthers.includes(sid) : waecSubj === sid;
                  return (
                    <button
                      key={sid}
                      type="button"
                      onClick={() => (mode === 'jamb' ? toggleJambSubj(sid) : setWaecSubj(sid))}
                      className={`min-h-[38px] px-3 rounded-xl border text-[12.5px] font-semibold flex items-center justify-between gap-1.5 transition cursor-pointer ${
                        active
                          ? 'bg-[var(--acc-soft)] border-[var(--gold)] text-[var(--ink)] font-bold'
                          : 'bg-[var(--bg)] border-[var(--line)] text-[var(--dim)] hover:text-[var(--ink)]'
                      }`}
                    >
                      <span className="inline-flex items-center gap-1.5 truncate">
                        <Icon name={SUBJECT_INFO[sid].icon} size={14} className="shrink-0" />
                        <span className="truncate">{SUBJECT_INFO[sid].short}</span>
                      </span>
                      {isLockedEng ? (
                        <span className="text-[10.5px] font-bold text-[var(--gold)]">Core</span>
                      ) : active ? (
                        <Icon name="check" size={13} className="text-[var(--gold)] shrink-0" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <aside className="min-[880px]:col-span-5 flex flex-col gap-4">
            <div className="rtc-eq-plate rounded-2xl p-5 text-white flex flex-col gap-4">
              <div>
                <div className="text-[12px] font-semibold text-amber-300">Ready to Sit Exam</div>
                <div className="font-[var(--display)] font-bold text-[20px] mt-0.5">
                  {mode === 'jamb' ? 'JAMB UTME CBT Paper' : `WAEC ${SUBJECT_INFO[waecSubj].short} Paper 1`}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-white/10 p-2.5">
                  <div className="text-[11px] text-slate-300">Questions</div>
                  <div className="font-mono font-bold text-[18px] tabular-nums">{estQuestions}</div>
                </div>
                <div className="rounded-xl bg-white/10 p-2.5">
                  <div className="text-[11px] text-slate-300">Timer</div>
                  <div className="font-mono font-bold text-[18px] tabular-nums">
                    {Math.round(presetCfg.durationSec / 60)}m
                  </div>
                </div>
                <div className="rounded-xl bg-white/10 p-2.5">
                  <div className="text-[11px] text-slate-300">Scale</div>
                  <div className="font-mono font-bold text-[18px] tabular-nums">
                    {mode === 'jamb' ? '/400' : 'A1–F9'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleStartExam}
                className="btn-tactile indigo w-full"
              >
                <span>Start Timed CBT Exam</span>
                <Icon name="go" size={18} />
              </button>
            </div>

            {progress.cbtHistory && progress.cbtHistory.length > 0 && (
              <div className="rtc-card rounded-2xl p-4 flex flex-col gap-2.5">
                <div className="text-[13px] font-bold text-[var(--ink)]">Recent CBT Sittings</div>
                {progress.cbtHistory.slice(-4).reverse().map((rec) => (
                  <div
                    key={rec.id}
                    className="flex items-center justify-between gap-2 text-[12.5px] py-2 border-t border-[var(--line)] first:border-t-0"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-[var(--ink)] uppercase">
                        {rec.mode} · {rec.subjects.map((s) => SUBJECT_INFO[s].compact).join(', ')}
                      </div>
                      <div className="text-[11.5px] text-[var(--dim)] tabular-nums">
                        {rec.rawCorrect}/{rec.totalQuestions} correct
                      </div>
                    </div>
                    <span className="font-mono font-bold text-[14px] text-[var(--gold)] tabular-nums shrink-0">
                      {rec.scaledScore}/{rec.maxScale}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </aside>
        </div>
      </div>
    );
  }

  if (phase === 'report' && report) {
    return (
      <div className="flex flex-col gap-5 anim-rise">
        <SubscreenTopBar
          title="CBT Diagnostic Report"
          subtitle={report.mode === 'jamb' ? 'JAMB UTME 400-Scale Breakdown' : 'WAEC Objective Evaluation'}
          onBack={() => setPhase('setup')}
        />

        <section className="rtc-eq-plate rounded-2xl p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex flex-col gap-1">
            <span className="text-[12.5px] font-semibold text-amber-300">{report.standingLabel}</span>
            <h2 className="font-[var(--display)] font-extrabold text-[34px] sm:text-[42px] leading-none tabular-nums">
              {report.scaledScore} <span className="text-[20px] text-slate-300">/ {report.maxScale}</span>
            </h2>
            <p className="text-[13.5px] text-slate-300 mt-1">
              Raw score: {report.rawCorrect}/{report.totalQuestions} ({report.accuracyPct}% · Grade {report.waecGrade}). Missed questions were automatically saved to your Mistake Vault.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5 shrink-0">
            <button type="button" onClick={handleStartExam} className="btn-tactile indigo whitespace-nowrap">
              <span>Retake New Paper</span>
            </button>
            <button type="button" onClick={onBack} className="btn-tactile paper whitespace-nowrap">
              <span>Back to Home</span>
            </button>
          </div>
        </section>

        {/* Subject Breakdown */}
        <section className="grid grid-cols-1 sm:grid-cols-2 min-[880px]:grid-cols-4 gap-3.5">
          {report.bySubject.map((sub) => (
            <div key={sub.subj} className="rtc-card rounded-2xl p-4 flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-[var(--display)] font-bold text-[14.5px] text-[var(--ink)] truncate">
                  {SUBJECT_INFO[sub.subj].name}
                </span>
                <span className="text-[12px] font-mono font-bold text-[var(--gold)]">{sub.waecGrade}</span>
              </div>
              <div className="font-mono font-extrabold text-[24px] text-[var(--ink)] tabular-nums">
                {report.mode === 'jamb' ? `${sub.jambScore100}/100` : `${sub.pct}%`}
              </div>
              <div className="text-[12px] text-[var(--dim)] tabular-nums">
                {sub.correct} of {sub.total} correct
              </div>
            </div>
          ))}
        </section>

        {/* Weak-Topic Diagnostic Report */}
        <section className="rtc-card rounded-2xl p-5 flex flex-col gap-3.5">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div>
              <span className="eyebrow text-[var(--coral-ink)]">Weak-Topic Diagnostic</span>
              <h3 className="h20 text-[var(--ink)]">Exact Marks Lost by Syllabus Unit</h3>
            </div>
            <span className="text-[12.5px] font-semibold text-[var(--dim)]">
              Click any topic to open Notes &amp; targeted drills
            </span>
          </div>

          {report.weakTopics.length === 0 ? (
            <div className="rounded-xl bg-[var(--ok-soft)] border border-[var(--ok-line)] p-4 text-[14px] font-semibold text-[var(--ink)]">
              Flawless CBT sitting — zero marks dropped across all topics!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {report.weakTopics.slice(0, 10).map((wt) => (
                <button
                  key={`${wt.subj}:${wt.topicId}`}
                  type="button"
                  onClick={() => onOpenWeakTopic(wt.subj, wt.topicId)}
                  className="text-left rounded-xl bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--acc-line)] p-3.5 flex items-center justify-between gap-3 transition cursor-pointer"
                >
                  <div className="min-w-0">
                    <div className="text-[11.5px] font-semibold text-[var(--gold)]">
                      {SUBJECT_INFO[wt.subj].short} · −{wt.marksLost} est. marks
                    </div>
                    <div className="font-[var(--display)] font-bold text-[14.5px] text-[var(--ink)] truncate">
                      {wt.topicName}
                    </div>
                    <div className="text-[12px] text-[var(--dim)] tabular-nums">
                      Missed {wt.missed} of {wt.total} questions
                    </div>
                  </div>
                  <Icon name="go" size={16} className="text-[var(--gold)] shrink-0" />
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    );
  }

  // Active Exam Phase
  const curItem = paper[curIndex];
  if (!curItem) return null;
  const pickedOrig = answers[curItem.key];
  const isFlagged = !!flagged[curItem.key];
  const lowTime = timeLeft <= 180;

  // Subject start indices for quick subject tabs
  const subjectStarts = examSubjects
    .map((sid) => ({ sid, idx: paper.findIndex((p) => p.subj === sid) }))
    .filter((x) => x.idx >= 0);

  return (
    <div className="flex flex-col gap-4 anim-rise">
      <SubscreenTopBar
        title={mode === 'jamb' ? 'JAMB UTME CBT' : `WAEC ${SUBJECT_INFO[waecSubj].short} CBT`}
        subtitle={`Question ${curIndex + 1} of ${paper.length} · ${SUBJECT_INFO[curItem.subj].short}`}
        onBack={() => setConfirmSubmit(true)}
        right={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setToolsOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-[var(--card)] border border-[var(--line)] hover:border-[var(--acc-line)] text-[12.5px] font-bold text-[var(--ink)] flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Icon name="sigma" size={14} className="text-[var(--gold)]" />
              <span>Calc &amp; Pad</span>
            </button>
            <span
              className={`px-3 py-1.5 rounded-xl border font-mono text-[13.5px] font-bold tabular-nums ${
                lowTime
                  ? 'bg-[var(--bad-soft)] border-[var(--coral)] text-[var(--coral-ink)]'
                  : 'bg-[var(--card)] border-[var(--line)] text-[var(--ink)]'
              }`}
            >
              {mmss(timeLeft)}
            </span>
          </div>
        }
      />

      {/* Subject Switch Tabs (JAMB 4-Subject Bar) */}
      {subjectStarts.length > 1 && (
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[var(--card)] border border-[var(--line)]">
          {subjectStarts.map((st) => {
            const active = curItem.subj === st.sid;
            const subItems = paper.filter((p) => p.subj === st.sid);
            const subAns = subItems.filter((p) => answers[p.key] !== undefined).length;
            return (
              <button
                key={st.sid}
                type="button"
                onClick={() => setCurIndex(st.idx)}
                className={`px-3 py-1.5 rounded-lg text-[12.5px] font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-[var(--gold)] text-[var(--on-acc)]'
                    : 'text-[var(--dim)] hover:text-[var(--ink)]'
                }`}
              >
                <span>{SUBJECT_INFO[st.sid].short}</span>
                <span className="font-mono text-[11px] opacity-85 tabular-nums">
                  {subAns}/{subItems.length}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 min-[960px]:grid-cols-12 gap-5 items-start">
        {/* Question Card */}
        <div className="min-[960px]:col-span-8 flex flex-col gap-4">
          <div className="rtc-card rounded-2xl p-5 sm:p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2 text-[12.5px] text-[var(--dim)]">
              <span className="font-semibold">
                {SUBJECT_INFO[curItem.subj].name} · {curItem.topicName}
              </span>
              <button
                type="button"
                onClick={() => setFlagged((prev) => ({ ...prev, [curItem.key]: !prev[curItem.key] }))}
                className={`px-2.5 py-1 rounded-lg border text-[12px] font-bold cursor-pointer ${
                  isFlagged
                    ? 'bg-amber-500/15 border-amber-500/50 text-amber-600 dark:text-amber-300'
                    : 'bg-[var(--bg)] border-[var(--line)] text-[var(--dim)] hover:text-[var(--ink)]'
                }`}
              >
                {isFlagged ? 'Flagged for Review' : 'Flag (F)'}
              </button>
            </div>

            <div
              className="qt text-[var(--ink)]"
              dangerouslySetInnerHTML={{ __html: typesetMathHtml(curItem.q.q, curItem.subj) }}
            />
            {curItem.q.g && <DiagramFigure g={curItem.q.g} />}

            <div className="flex flex-col gap-2.5 pt-1">
              {curItem.order.map((origIdx, dispIdx) => {
                const selected = pickedOrig === origIdx;
                const letter = String.fromCharCode(65 + dispIdx);
                return (
                  <button
                    key={origIdx}
                    type="button"
                    onClick={() => setAnswers((prev) => ({ ...prev, [curItem.key]: origIdx }))}
                    className={`opt-tile ${
                      selected ? 'border-[var(--gold)] bg-[var(--acc-soft)] ring-1 ring-[var(--gold)]/30' : ''
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg border font-mono font-bold text-[13px] flex items-center justify-center shrink-0 ${
                        selected
                          ? 'bg-[var(--gold)] text-[var(--on-acc)] border-[var(--gold)]'
                          : 'bg-[var(--deep)] border-[var(--line)]'
                      }`}
                    >
                      {letter}
                    </span>
                    <span
                      className="flex-1"
                      dangerouslySetInnerHTML={{
                        __html: typesetMathHtml(curItem.q.o[origIdx], curItem.subj),
                      }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={curIndex === 0}
              onClick={() => setCurIndex((i) => Math.max(0, i - 1))}
              className="btn-tactile paper disabled:opacity-40 whitespace-nowrap"
            >
              <span>Previous (P)</span>
            </button>
            <span className="hidden sm:inline text-[12px] text-[var(--dim)] font-mono">
              Keys: A–D answer · N next · P prev · F flag
            </span>
            {curIndex < paper.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurIndex((i) => Math.min(paper.length - 1, i + 1))}
                className="btn-tactile indigo whitespace-nowrap"
              >
                <span>Next (N)</span>
                <Icon name="go" size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmSubmit(true)}
                className="btn-tactile indigo whitespace-nowrap"
              >
                <span>Submit Exam</span>
              </button>
            )}
          </div>
        </div>

        {/* Question Navigator Grid */}
        <aside className="min-[960px]:col-span-4 rtc-card rounded-2xl p-4 flex flex-col gap-3.5">
          <div className="flex items-center justify-between text-[12.5px]">
            <span className="font-bold text-[var(--ink)]">Question Navigator</span>
            <span className="font-mono text-[var(--dim)] tabular-nums">
              {answeredCount}/{paper.length} done{flaggedCount ? ` · ${flaggedCount} flagged` : ''}
            </span>
          </div>

          <div className="grid grid-cols-7 sm:grid-cols-10 min-[960px]:grid-cols-6 gap-1.5 max-h-[280px] overflow-y-auto pr-1">
            {paper.map((item, idx) => {
              const isCur = idx === curIndex;
              const isAns = answers[item.key] !== undefined;
              const isFlg = !!flagged[item.key];
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setCurIndex(idx)}
                  aria-label={`Question ${idx + 1}`}
                  className={`h-8 rounded-lg font-mono text-[12px] font-bold border transition cursor-pointer ${
                    isCur
                      ? 'bg-[var(--gold)] text-[var(--on-acc)] border-[var(--gold)]'
                      : isFlg
                        ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/50'
                        : isAns
                          ? 'bg-[var(--ok-soft)] text-[var(--green)] border-[var(--ok-line)]'
                          : 'bg-[var(--bg)] text-[var(--dim)] border-[var(--line)] hover:border-[var(--acc-line)]'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setConfirmSubmit(true)}
            className="btn-tactile indigo w-full"
          >
            <span>Submit &amp; Grade Exam</span>
          </button>
        </aside>
      </div>

      {confirmSubmit && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Confirm CBT submission"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs p-4"
        >
          <div className="rtc-card max-w-sm w-full rounded-2xl p-6 flex flex-col gap-4">
            <h3 className="h20 text-[var(--ink)]">Submit CBT Exam?</h3>
            <p className="text-[14px] text-[var(--dim)] leading-relaxed">
              You have answered <strong>{answeredCount} of {paper.length}</strong> questions with{' '}
              <strong>{mmss(timeLeft)}</strong> remaining. Submitting will score your paper and generate your Weak-Topic Diagnostic Report.
            </p>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setConfirmSubmit(false)}
                className="btn-tactile paper flex-1"
              >
                Keep Working
              </button>
              <button
                type="button"
                onClick={() => finalizeExam(paper, answers, Math.max(1, totalDuration - timeLeft))}
                className="btn-tactile indigo flex-1"
              >
                Submit Now
              </button>
            </div>
          </div>
        </div>
      )}

      <StudyToolsDrawer open={toolsOpen} onClose={() => setToolsOpen(false)} />
    </div>
  );
}
