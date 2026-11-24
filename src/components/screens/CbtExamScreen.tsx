import React, { useEffect, useMemo, useState } from 'react';
import type { Question, SubjectId, Topic, UserProgress } from '../../types';
import { SUBJECTS, SUBJECT_IDS } from '../../data/curriculum';
import { SUBJECT_INFO, mmss, today } from '../../utils/engine';
import {
  CBT_PRESETS,
  buildCbtPaper,
  evaluateCbtSubmission,
  isWaecOnlyCbtSubject,
  type CbtDiagnosticReport,
  type CbtExamMode,
  type CbtPresetId,
  type CbtQuestionItem,
} from '../../utils/cbtEngine';
import { auth } from '../../firebase';
import { isCbtPresetPaywalled } from '../../utils/paywallLogic';
import { PUBLIC_FREE_LAUNCH_ACTIVE } from '../../utils/freeLaunchAndPwaLogic';
import {
  getSaturdayCbtCampaign,
  getToughJambDrillConfig,
  normalizeJambQuartet,
  rankDailyCbtParticipants,
  resolveExamTrack,
  type DailyCbtCohortReport,
  type DailyCbtParticipantEntry,
} from '../../utils/examTrackLogic';
import { typesetMathHtml } from '../../utils/mathTypesetter';
import { sfx } from '../../utils/sound';
import { AnimatedNumber } from '../AnimatedNumber';
import { SubscreenTopBar } from '../AppShell';
import { DiagramFigure, Icon } from '../Icons';
import { StudyToolsDrawer } from '../StudyToolsDrawer';
import { LiquidCapsuleBar, SmoothViewSwitch } from '../ULessonMotion';

type ReviewFilter = 'wrong' | 'skipped' | 'flagged' | 'all';

export function CbtExamScreen({
  progress,
  onCompleteCbt,
  onOpenWeakTopic,
  onExamHallChange,
  onOpenPaywall,
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
  onExamHallChange?: (inHall: boolean) => void;
  onOpenPaywall?: (reason?: string) => void;
  onBack: () => void;
}) {
  const examTrack = resolveExamTrack(progress);
  const satCampaign = getSaturdayCbtCampaign(Date.now(), progress.cbtHistory);
  const [phase, setPhase] = useState<'setup' | 'exam' | 'report'>('setup');
  const [mode, setMode] = useState<CbtExamMode>(() =>
    examTrack === 'waec' ? 'waec' : 'jamb'
  );
  const [preset, setPreset] = useState<CbtPresetId>('sprint');
  const [selectedOthers, setSelectedOthers] = useState<SubjectId[]>(() => {
    const quartet = normalizeJambQuartet(
      progress.jambSubjects && progress.jambSubjects.length > 0
        ? progress.jambSubjects
        : progress.subjs
    );
    return quartet.filter((s) => s !== 'eng').slice(0, 3);
  });
  const [waecSubj, setWaecSubj] = useState<SubjectId>(progress.subj);
  const [subjectSearch, setSubjectSearch] = useState('');
  const [todayCohortCount, setTodayCohortCount] = useState<number | null>(null);
  const [dailyCohort, setDailyCohort] = useState<DailyCbtCohortReport | null>(null);
  const [cohortLoading, setCohortLoading] = useState(false);

  // Active exam state
  const [paper, setPaper] = useState<CbtQuestionItem[]>([]);
  const [curIndex, setCurIndex] = useState(0);
  const [qDir, setQDir] = useState<'fwd' | 'back'>('fwd');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(1800);
  const [totalDuration, setTotalDuration] = useState(1800);
  const [elapsedUsed, setElapsedUsed] = useState(0);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileGridOpen, setMobileGridOpen] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [report, setReport] = useState<CbtDiagnosticReport | null>(null);
  const [barsReady, setBarsReady] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>('wrong');

  useEffect(() => {
    onExamHallChange?.(phase === 'exam');
    return () => onExamHallChange?.(false);
  }, [phase, onExamHallChange]);

  // Warn before closing or reloading tab while inside the exam hall
  useEffect(() => {
    if (phase !== 'exam') return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [phase]);

  // Staggered subject bars reveal on result screen
  useEffect(() => {
    if (phase !== 'report') {
      setBarsReady(false);
      return;
    }
    const id = window.requestAnimationFrame(() => setBarsReady(true));
    return () => window.cancelAnimationFrame(id);
  }, [phase]);

  const topicsMap = useMemo(() => {
    const map = {} as Record<SubjectId, Topic[]>;
    for (const sid of SUBJECT_IDS) map[sid] = SUBJECTS[sid].topics;
    return map;
  }, []);

  useEffect(() => {
    if (phase !== 'setup') return;
    let cancelled = false;
    const headers: Record<string, string> = {};
    if (progress.devToken) headers['X-Device-Token'] = progress.devToken;
    fetch(`/api/cloud/cbt-daily?mode=${mode}`, { headers })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { entries?: unknown[] } | null) => {
        if (!cancelled && data && Array.isArray(data.entries)) {
          setTodayCohortCount(data.entries.length);
        }
      })
      .catch(() => {
        /* ignore offline */
      });
    return () => {
      cancelled = true;
    };
  }, [mode, phase, progress.devToken]);

  const jambCandidateSubjects = useMemo(() => {
    const allJamb = SUBJECT_IDS.filter((sid) => !isWaecOnlyCbtSubject(sid));
    if (examTrack === 'jamb') {
      const quartet = normalizeJambQuartet(
        progress.jambSubjects && progress.jambSubjects.length > 0
          ? progress.jambSubjects
          : progress.subjs
      );
      return [...quartet, ...allJamb.filter((sid) => !quartet.includes(sid))];
    }
    return allJamb;
  }, [examTrack, progress.jambSubjects, progress.subjs]);

  const examSubjects = useMemo<SubjectId[]>(
    () => (mode === 'jamb' ? ['eng', ...selectedOthers.slice(0, 3)] : [waecSubj]),
    [mode, selectedOthers, waecSubj]
  );

  const toggleJambSubj = (sid: SubjectId) => {
    if (sid === 'eng' || isWaecOnlyCbtSubject(sid)) return;
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

  const navigateToIndex = (nextIdx: number) => {
    const clamped = Math.max(0, Math.min(paper.length - 1, nextIdx));
    if (clamped === curIndex) return;
    setQDir(clamped > curIndex ? 'fwd' : 'back');
    setCurIndex(clamped);
  };

  const handleStartExam = () => {
    if (!PUBLIC_FREE_LAUNCH_ACTIVE && isCbtPresetPaywalled(progress, preset)) {
      onOpenPaywall?.(
        'Unlock Half paper (90 questions) and Full 180-question UTME mock exams'
      );
      return;
    }
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
    setQDir('fwd');
    setAnswers({});
    setFlagged({});
    setTimeLeft(dur);
    setTotalDuration(dur);
    setElapsedUsed(0);
    setMobileGridOpen(false);
    setConfirmSubmit(false);
    setReport(null);
    setPhase('exam');
  };

  const finalizeExam = (
    currentPaper: CbtQuestionItem[],
    currentAnswers: Record<string, number>,
    elapsedSec: number
  ) => {
    const diag = evaluateCbtSubmission(mode, currentPaper, currentAnswers);
    const missedQuestions: { q: Question; subj: SubjectId; pickedIdx: number }[] = [];
    const answeredResults: { q: Question; ok: boolean }[] = [];
    let wrongCount = 0;
    for (const item of currentPaper) {
      const picked = currentAnswers[item.key];
      const ok = picked !== undefined && picked === item.q.a;
      if (picked !== undefined) {
        answeredResults.push({ q: item.q, ok });
        if (!ok) wrongCount++;
      }
      if (!ok) {
        missedQuestions.push({ q: item.q, subj: item.subj, pickedIdx: picked ?? -1 });
      }
    }
    setElapsedUsed(elapsedSec);
    setReport(diag);
    setReviewFilter(wrongCount > 0 ? 'wrong' : 'all');
    setPhase('report');
    setToolsOpen(false);
    setMobileGridOpen(false);
    setConfirmSubmit(false);
    onCompleteCbt({
      mode,
      subjects: examSubjects,
      report: diag,
      durationSec: elapsedSec,
      missedQuestions,
      answeredResults,
    });

    const localSelfKey = `local:${progress.devToken || 'student'}`;
    const selfEntry: DailyCbtParticipantEntry = {
      participantKey: localSelfKey,
      displayName: progress.name || 'Scholar',
      campusGoal: progress.leaderboardCampusGoal || 'National Scholar',
      mode,
      scaledScore: diag.scaledScore,
      maxScale: diag.maxScale,
      rawCorrect: diag.rawCorrect,
      totalQuestions: diag.totalQuestions,
      accuracyPct: diag.accuracyPct,
      durationSec: elapsedSec,
    };
    setDailyCohort(
      rankDailyCbtParticipants([selfEntry], localSelfKey, mode, progress.target || 70)
    );
    setCohortLoading(true);

    void (async () => {
      try {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (progress.devToken) headers['X-Device-Token'] = progress.devToken;
        if (auth.currentUser) {
          const tok = await auth.currentUser.getIdToken().catch(() => '');
          if (tok) headers.Authorization = `Bearer ${tok}`;
        }
        const resp = await fetch('/api/cloud/cbt-daily', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            displayName: progress.name || 'Scholar',
            campusGoal: progress.leaderboardCampusGoal || 'National Scholar',
            mode,
            subjects: examSubjects,
            scaledScore: diag.scaledScore,
            maxScale: diag.maxScale,
            rawCorrect: diag.rawCorrect,
            totalQuestions: diag.totalQuestions,
            accuracyPct: diag.accuracyPct,
            durationSec: elapsedSec,
          }),
        });
        if (!resp.ok) return;
        const data = (await resp.json()) as {
          ok?: boolean;
          myParticipantKey?: string;
          entries?: DailyCbtParticipantEntry[];
        };
        if (data.ok && Array.isArray(data.entries) && data.entries.length > 0) {
          const myKey = data.myParticipantKey || localSelfKey;
          setDailyCohort(
            rankDailyCbtParticipants(data.entries, myKey, mode, progress.target || 70)
          );
          setTodayCohortCount(data.entries.length);
        }
      } catch {
        /* fallback keeps local same-day standing */
      } finally {
        setCohortLoading(false);
      }
    })();
  };

  useEffect(() => {
    if (phase !== 'exam') return;
    const id = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(id);
          return 0;
        }
        const next = prev - 1;
        if (next > 0 && next <= 10) {
          sfx('tick', progress.muted, next);
        }
        return next;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [phase, progress.muted]);

  useEffect(() => {
    if (phase === 'exam' && timeLeft === 0 && paper.length > 0) {
      finalizeExam(paper, answers, totalDuration);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, phase]);

  // Keys A–D, N, P, F, S inside the exam hall
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
        if (curIndex < paper.length - 1) {
          setQDir('fwd');
          setCurIndex((i) => Math.min(paper.length - 1, i + 1));
        }
      } else if (key === 'P' || e.key === 'ArrowLeft') {
        e.preventDefault();
        if (curIndex > 0) {
          setQDir('back');
          setCurIndex((i) => Math.max(0, i - 1));
        }
      } else if (key === 'F') {
        e.preventDefault();
        setFlagged((prev) => ({ ...prev, [item.key]: !prev[item.key] }));
      } else if (key === 'S') {
        e.preventDefault();
        setConfirmSubmit(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, paper, curIndex, toolsOpen]);

  const answeredCount = Object.keys(answers).length;
  const flaggedCount = Object.values(flagged).filter(Boolean).length;

  // ── SETUP PHASE ──
  if (phase === 'setup') {
    const presetCfg = CBT_PRESETS[preset];
    const estQuestions =
      mode === 'jamb'
        ? presetCfg.jambPerSubj.eng + selectedOthers.length * presetCfg.jambPerSubj.other
        : presetCfg.waecCount;

    return (
      <div className="flex flex-col gap-5 anim-rise">
        <SubscreenTopBar
          title="Mock exam"
          subtitle={
            examTrack === 'jamb'
              ? 'Tough JAMB UTME Arena · Same-day student ranking'
              : examTrack === 'both'
                ? '70% JAMB UTME & 30% WAEC CBT Arena'
                : 'WAEC Paper 1 Objective & Mistake-Shield Arena'
          }
          onBack={onBack}
        />

        {/* Saturday National CBT Arena Habit Banner */}
        <section
          aria-label="Saturday National CBT Arena"
          className={`rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 ${
            satCampaign.isSaturday ? 'rtc-eq-plate text-white' : 'rtc-card border-[var(--acc-line)]'
          }`}
        >
          <div className="flex items-start gap-3 min-w-0">
            <span
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                satCampaign.isSaturday
                  ? 'tile-peach'
                  : 'bg-[var(--acc-soft)] text-[var(--gold)] border border-[var(--acc-line)]'
              }`}
            >
              <Icon name="trophy" size={19} />
            </span>
            <div className="flex flex-col gap-0.5 min-w-0">
              <div
                className={`flex items-center gap-2 flex-wrap text-[12px] font-bold tabular-nums ${
                  satCampaign.isSaturday ? 'text-[#FFE1D1]' : 'text-[var(--gold)]'
                }`}
              >
                <span>
                  {satCampaign.isSaturday
                    ? 'Saturday National CBT Arena · 2× XP Bonus'
                    : 'Every Saturday · Live National CBT Cohort'}
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  {todayCohortCount && todayCohortCount > 0
                    ? `${todayCohortCount} student${todayCohortCount === 1 ? '' : 's'} ranked today`
                    : 'Finish a paper to claim #1 on today’s board'}
                </span>
              </div>
              <div
                className={`font-[var(--display)] font-bold text-[16.5px] ${
                  satCampaign.isSaturday ? 'text-white' : 'text-[var(--ink)]'
                }`}
              >
                {satCampaign.headline}
              </div>
              <p
                className={`text-[13px] leading-snug ${
                  satCampaign.isSaturday ? 'text-white/90' : 'text-[var(--dim)]'
                }`}
              >
                At the end of your CBT, you are ranked live against every Easy Learn student who also wrote CBT today.
              </p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 min-[880px]:grid-cols-12 gap-5 items-start">
          <section className="min-[880px]:col-span-7 rtc-card p-5 sm:p-6 flex flex-col gap-6">
            {/* Step 1: Exam type */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[var(--acc-soft)] text-[var(--gold)] font-[var(--display)] font-bold text-[13px] flex items-center justify-center">
                  1
                </span>
                <h2 className="h18 text-[var(--ink)]">Choose exam type</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(
                  examTrack === 'jamb'
                    ? ([
                        [
                          'jamb',
                          'JAMB (Tough UTME)',
                          'English + 3 subjects · stricter distractors · scored /400',
                        ],
                      ] as const)
                    : examTrack === 'waec'
                      ? ([
                          [
                            'waec',
                            'WAEC',
                            'Single subject paper · graded A1 to F9 with examiner trap checks',
                          ],
                        ] as const)
                      : ([
                          ['jamb', 'JAMB (70% Core)', 'English + 3 subjects · tough UTME /400'],
                          ['waec', 'WAEC (30% Focus)', 'Single subject paper · graded A1 to F9'],
                        ] as const)
                ).map(([mId, title, desc]) => (
                  <button
                    key={mId}
                    type="button"
                    onClick={() => setMode(mId)}
                    className={`p-4 rounded-[16px] border-2 text-left transition cursor-pointer ${
                      mode === mId
                        ? 'bg-[var(--acc-soft)] border-[var(--gold)]'
                        : 'bg-[var(--bg)] border-[var(--line)] hover:border-[var(--acc-line)]'
                    }`}
                  >
                    <div className="font-[var(--display)] font-bold text-[16px] text-[var(--ink)]">
                      {title}
                    </div>
                    <div className="text-[13px] text-[var(--dim)] mt-0.5">{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Paper length */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[var(--acc-soft)] text-[var(--gold)] font-[var(--display)] font-bold text-[13px] flex items-center justify-center">
                  2
                </span>
                <h2 className="h18 text-[var(--ink)]">Choose paper length</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {(['sprint', 'half', 'full'] as const).map((pid) => {
                  const cfg = CBT_PRESETS[pid];
                  const locked = !PUBLIC_FREE_LAUNCH_ACTIVE && isCbtPresetPaywalled(progress, pid);
                  const active = preset === pid && !locked;
                  return (
                    <button
                      key={pid}
                      type="button"
                      onClick={() => {
                        if (locked) {
                          onOpenPaywall?.(
                            `Unlock ${cfg.label} (${
                              mode === 'jamb'
                                ? pid === 'full'
                                  ? '180-question UTME'
                                  : '90-question half paper'
                                : `${cfg.waecCount}-question WAEC paper`
                            }) with Easy Learn Premium`
                          );
                          return;
                        }
                        setPreset(pid);
                      }}
                      className={`p-3.5 rounded-[16px] border-2 text-left transition cursor-pointer ${
                        active
                          ? 'bg-[var(--gold)] text-[var(--on-acc)] border-[var(--acc-d)] shadow-[0_3px_0_var(--acc-d)]'
                          : 'bg-[var(--bg)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--acc-line)]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="font-[var(--display)] font-bold text-[15px]">
                          {cfg.label}
                        </span>
                        {locked ? (
                          <Icon name="lock" size={14} className="text-[var(--dim)] shrink-0" />
                        ) : null}
                      </div>
                      <div
                        className={`text-[12px] mt-0.5 ${
                          active ? 'text-[var(--on-acc)]/85' : 'text-[var(--dim)]'
                        }`}
                      >
                        {mode === 'jamb'
                          ? pid === 'full'
                            ? '180 questions (60 + 40 × 3)'
                            : pid === 'half'
                              ? '90 questions (30 + 20 × 3)'
                              : '45 questions (15 + 10 × 3)'
                          : `${cfg.waecCount} questions`}
                        {locked ? ' · Premium' : ''}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Subjects */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[var(--acc-soft)] text-[var(--gold)] font-[var(--display)] font-bold text-[13px] flex items-center justify-center">
                    3
                  </span>
                  <h2 className="h18 text-[var(--ink)]">
                    {mode === 'jamb'
                      ? 'English plus 3 JAMB subjects'
                      : 'Choose subject for WAEC'}
                  </h2>
                </div>
                <span className="text-[12.5px] font-bold text-[var(--gold)] tabular-nums">
                  {examSubjects.length} chosen
                </span>
              </div>

              <div className="relative">
                <input
                  type="search"
                  value={subjectSearch}
                  onChange={(e) => setSubjectSearch(e.target.value)}
                  aria-label="Filter exam subjects"
                  placeholder={
                    mode === 'jamb'
                      ? 'Find any of 25 JAMB subjects (e.g. Government, Yoruba, Accounts)...'
                      : 'Find any of 49 WAEC subjects (e.g. Catering, Electrical, Civic)...'
                  }
                  className="w-full min-h-[38px] pl-3.5 pr-9 rounded-[14px] bg-[var(--bg)] border border-[var(--line)] focus:border-[var(--gold)] focus:bg-[var(--card)] text-[13.5px] font-medium text-[var(--ink)] outline-none transition"
                />
                {subjectSearch && (
                  <button
                    type="button"
                    onClick={() => setSubjectSearch('')}
                    aria-label="Clear exam subject search"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md text-[var(--dim)] hover:text-[var(--ink)] flex items-center justify-center cursor-pointer"
                  >
                    <Icon name="x" size={14} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[310px] overflow-y-auto pr-0.5">
                {(mode === 'jamb' ? jambCandidateSubjects : SUBJECT_IDS)
                  .filter((sid) => {
                    const q = subjectSearch.trim().toLowerCase();
                    if (!q) return true;
                    return (
                      SUBJECT_INFO[sid].name.toLowerCase().includes(q) ||
                      SUBJECT_INFO[sid].short.toLowerCase().includes(q)
                    );
                  })
                  .map((sid) => {
                    const isLockedEng = mode === 'jamb' && sid === 'eng';
                    const active =
                      mode === 'jamb' ? isLockedEng || selectedOthers.includes(sid) : waecSubj === sid;
                    return (
                      <button
                        key={sid}
                        type="button"
                        onClick={() => (mode === 'jamb' ? toggleJambSubj(sid) : setWaecSubj(sid))}
                        className={`min-h-[42px] px-3 rounded-[16px] border-2 text-[13px] font-semibold flex items-center justify-between gap-1.5 transition cursor-pointer ${
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
                          <span className="text-[11px] font-bold text-[var(--gold)]">Compulsory</span>
                        ) : active ? (
                          <Icon name="check" size={14} className="text-[var(--gold)] shrink-0" />
                        ) : null}
                      </button>
                    );
                  })}
              </div>
              {mode === 'jamb' && (
                <p className="text-[12.5px] text-[var(--dim)]">
                  School and trade subjects (WAEC/NECO only) are left out of JAMB papers.
                </p>
              )}
            </div>
          </section>

          <aside className="min-[880px]:col-span-5 flex flex-col gap-4">
            {/* Exam slip summary */}
            <div className="rtc-eq-plate p-5 sm:p-6 text-white flex flex-col gap-5">
              <div>
                <span className="inline-flex px-2.5 py-0.5 rounded-[12px] tile-peach text-[12px] font-bold">
                  Exam slip
                </span>
                <div className="font-[var(--display)] font-bold text-[22px] leading-snug mt-2">
                  {mode === 'jamb'
                    ? `JAMB mock · ${presetCfg.label}`
                    : `WAEC ${SUBJECT_INFO[waecSubj].short} · ${presetCfg.label}`}
                </div>
                <div className="text-[13px] text-white/85 mt-1">
                  {examSubjects.map((s) => SUBJECT_INFO[s].short).join(' · ')}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-[16px] tile-peach p-3 text-center">
                  <div className="text-[11.5px] font-bold opacity-80">Questions</div>
                  <div className="font-[var(--display)] font-bold text-[20px] tabular-nums mt-0.5">
                    {estQuestions}
                  </div>
                </div>
                <div className="rounded-[16px] tile-mint p-3 text-center">
                  <div className="text-[11.5px] font-bold opacity-80">Time</div>
                  <div className="font-[var(--display)] font-bold text-[20px] tabular-nums mt-0.5">
                    {Math.round(presetCfg.durationSec / 60)} min
                  </div>
                </div>
                <div className="rounded-[16px] tile-sky p-3 text-center">
                  <div className="text-[11.5px] font-bold opacity-80">Score scale</div>
                  <div className="font-[var(--display)] font-bold text-[20px] tabular-nums mt-0.5">
                    {mode === 'jamb' ? '/400' : 'A1–F9'}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-[12px] text-white/85">
                <span className="inline-flex items-center gap-1">
                  <kbd className="eyak-kbd">A</kbd>–<kbd className="eyak-kbd">D</kbd> Answer
                </span>
                <span className="inline-flex items-center gap-1">
                  <kbd className="eyak-kbd">N</kbd>/<kbd className="eyak-kbd">P</kbd> Move
                </span>
                <span className="inline-flex items-center gap-1">
                  <kbd className="eyak-kbd">F</kbd> Flag
                </span>
                <span className="inline-flex items-center gap-1">
                  <kbd className="eyak-kbd">S</kbd> Submit
                </span>
              </div>

              <button
                type="button"
                onClick={handleStartExam}
                className="btn-tactile paper w-full font-bold text-[var(--ink)]"
              >
                <span>Start mock exam</span>
                <Icon name="go" size={18} className="ul-arrow" />
              </button>
            </div>

            {/* Past mock scores */}
            <div className="rtc-card p-5 flex flex-col gap-2.5">
              <h3 className="h18 text-[var(--ink)]">Past mock scores</h3>
              {!progress.cbtHistory || progress.cbtHistory.length === 0 ? (
                <p className="text-[13.5px] text-[var(--dim)]">
                  Your finished mock exam scores will appear here.
                </p>
              ) : (
                progress.cbtHistory
                  .slice(-5)
                  .reverse()
                  .map((rec) => (
                    <div
                      key={rec.id}
                      className="flex items-center justify-between gap-2 text-[13px] py-2 border-t border-[var(--line)] first:border-t-0"
                    >
                      <div className="min-w-0">
                        <div className="font-bold text-[var(--ink)] truncate">
                          {rec.mode === 'jamb' ? 'JAMB' : 'WAEC'} ·{' '}
                          {rec.subjects.map((s) => SUBJECT_INFO[s]?.compact || s).join(', ')}
                        </div>
                        <div className="text-[12px] text-[var(--dim)] tabular-nums">
                          {rec.rawCorrect} of {rec.totalQuestions} correct · {mmss(rec.durationSec)}
                        </div>
                      </div>
                      <span className="font-[var(--display)] font-bold text-[16px] text-[var(--gold)] tabular-nums shrink-0">
                        {rec.scaledScore}/{rec.maxScale}
                      </span>
                    </div>
                  ))
              )}
            </div>
          </aside>
        </div>
      </div>
    );
  }

  // ── RESULT PHASE ──
  if (phase === 'report' && report) {
    const secPerQuestion = Math.max(
      1,
      Math.round(elapsedUsed / Math.max(1, report.totalQuestions))
    );
    const toughPace = getToughJambDrillConfig(examTrack, 'eng', progress.jambSubjects).targetSecPerQ;
    const paceComparison =
      report.mode === 'jamb'
        ? secPerQuestion <= toughPace
          ? `Beats Easy Learn ${toughPace} s Tough JAMB target`
          : secPerQuestion <= 40
            ? 'Within 40 s UTME pace (aim ≤ 33 s)'
            : 'Slower than 40 s UTME pace'
        : secPerQuestion <= 45
          ? 'Steady WAEC Paper 1 pace'
          : 'Build faster recall on Paper 1';

    const wrongItems = paper.filter((it) => {
      const p = answers[it.key];
      return p !== undefined && p !== it.q.a;
    });
    const skippedItems = paper.filter((it) => answers[it.key] === undefined);
    const flaggedItems = paper.filter((it) => !!flagged[it.key]);
    const filteredReviewItems =
      reviewFilter === 'wrong'
        ? wrongItems
        : reviewFilter === 'skipped'
          ? skippedItems
          : reviewFilter === 'flagged'
            ? flaggedItems
            : paper;

    return (
      <div className="flex flex-col gap-5 anim-rise">
        <SubscreenTopBar
          title="Mock exam result"
          subtitle={report.mode === 'jamb' ? 'JAMB score out of 400' : 'WAEC objective result'}
          onBack={() => setPhase('setup')}
        />

        {/* Hero result card with count-up score, time used, and UTME pace */}
        <section className="rtc-eq-plate p-6 sm:p-7 text-white flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[13px] font-bold text-[#FFE1D1]">{report.standingLabel}</span>
              <h2 className="font-[var(--display)] font-bold text-[38px] sm:text-[46px] leading-none tabular-nums">
                <AnimatedNumber value={report.scaledScore} duration={720} />{' '}
                <span className="text-[22px] text-white/80">/ {report.maxScale}</span>
              </h2>
              <p className="text-[14px] text-white/85 mt-1">
                {report.rawCorrect} of {report.totalQuestions} correct ({report.accuracyPct}% · Grade{' '}
                {report.waecGrade}). Missed questions were saved to Mistakes to fix.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handleStartExam}
                className="btn-tactile paper text-[var(--ink)] whitespace-nowrap"
              >
                <span>Take another mock</span>
              </button>
              <button
                type="button"
                onClick={onBack}
                className="btn-tactile indigo whitespace-nowrap"
              >
                <span>Back to Home</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-[16px] tile-peach p-3.5">
              <div className="text-[12px] font-bold opacity-80">Time used</div>
              <div className="font-[var(--display)] font-bold text-[22px] tabular-nums mt-0.5">
                {mmss(elapsedUsed)}
              </div>
              <div className="text-[12px] opacity-80 mt-0.5">
                Out of {mmss(totalDuration)} allowed
              </div>
            </div>
            <div className="rounded-[16px] tile-mint p-3.5">
              <div className="text-[12px] font-bold opacity-80">Speed per question</div>
              <div className="font-[var(--display)] font-bold text-[22px] tabular-nums mt-0.5">
                {secPerQuestion} s / question
              </div>
              <div className="text-[12px] opacity-80 mt-0.5">{paceComparison}</div>
            </div>
            <div className="rounded-[16px] tile-sky p-3.5">
              <div className="text-[12px] font-bold opacity-80">Answered</div>
              <div className="font-[var(--display)] font-bold text-[22px] tabular-nums mt-0.5">
                {paper.length - skippedItems.length} / {paper.length}
              </div>
              <div className="text-[12px] opacity-80 mt-0.5">
                {skippedItems.length === 0
                  ? 'Every question answered'
                  : `${skippedItems.length} skipped`}
              </div>
            </div>
          </div>
        </section>

        {/* Same-Day CBT Student Ranking & Personalised Encouragement */}
        {dailyCohort && (
          <section
            aria-label="Today's CBT student ranking and encouragement"
            className="rtc-card p-5 sm:p-6 flex flex-col gap-4 border-[var(--acc-line)]"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3.5">
              <div className="flex items-start gap-3 min-w-0">
                <span className="w-11 h-11 rounded-2xl bg-[var(--acc-soft)] border border-[var(--acc-line)] text-[var(--gold)] flex items-center justify-center shrink-0">
                  <Icon name="trophy" size={22} />
                </span>
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap text-[12px] font-bold text-[var(--gold)] tabular-nums">
                    <span>Today&apos;s {report.mode.toUpperCase()} CBT Cohort</span>
                    <span aria-hidden="true" className="text-[var(--dim)]">·</span>
                    <span className="text-[var(--dim)]">
                      {cohortLoading
                        ? 'Updating live rankings…'
                        : `${dailyCohort.totalParticipants} student${
                            dailyCohort.totalParticipants === 1 ? '' : 's'
                          } took CBT today`}
                    </span>
                  </div>
                  <h3 className="h20 text-[var(--ink)]">{dailyCohort.encouragementTitle}</h3>
                  <p className="text-[14px] text-[var(--dim)] leading-relaxed max-w-[66ch]">
                    {dailyCohort.encouragementBody}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-[var(--bg)] border border-[var(--line)] px-4 py-3 text-left sm:text-right shrink-0">
                <div className="text-[11.5px] font-bold text-[var(--dim)]">Your rank today</div>
                <div className="font-[var(--display)] font-extrabold text-[26px] text-[var(--gold)] tabular-nums leading-tight">
                  #{dailyCohort.myRank}{' '}
                  <span className="text-[14px] font-semibold text-[var(--dim)]">
                    / {dailyCohort.totalParticipants}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col divide-y divide-[var(--line)] rounded-2xl bg-[var(--bg)] border border-[var(--line)] overflow-hidden">
              {dailyCohort.entries.slice(0, 8).map((row) => (
                <div
                  key={row.participantKey}
                  className={`px-4 py-2.5 flex items-center justify-between gap-3 text-[13.5px] ${
                    row.isMe ? 'bg-[var(--acc-soft)]/50 font-bold' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-7 h-7 rounded-lg font-[var(--display)] font-extrabold text-[12.5px] flex items-center justify-center shrink-0 tabular-nums ${
                        row.rank === 1
                          ? 'bg-[var(--gold)] text-[var(--on-acc)]'
                          : 'bg-[var(--card)] border border-[var(--line)] text-[var(--ink)]'
                      }`}
                    >
                      #{row.rank}
                    </span>
                    <div className="min-w-0">
                      <div className="text-[var(--ink)] truncate">
                        {row.displayName}
                        {row.isMe ? ' (You)' : ''}
                      </div>
                      <div className="text-[11.5px] text-[var(--dim)] truncate">
                        {row.campusGoal}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 tabular-nums">
                    <span className="text-[12px] text-[var(--dim)] hidden sm:inline">
                      {row.accuracyPct}% · {mmss(row.durationSec)}
                    </span>
                    <span className="font-[var(--display)] font-extrabold text-[15px] text-[var(--ink)]">
                      {row.scaledScore}/{row.maxScale}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Subject breakdown with staggered bar fill */}
        <section className="grid grid-cols-1 sm:grid-cols-2 min-[880px]:grid-cols-4 gap-3.5">
          {report.bySubject.map((sub, idx) => (
            <div key={sub.subj} className="rtc-card p-4 sm:p-5 flex flex-col gap-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-[var(--display)] font-bold text-[15px] text-[var(--ink)] truncate">
                  {SUBJECT_INFO[sub.subj].name}
                </span>
                <span className="text-[13px] font-[var(--display)] font-bold text-[var(--gold)]">
                  {sub.waecGrade}
                </span>
              </div>
              <div className="font-[var(--display)] font-bold text-[26px] text-[var(--ink)] tabular-nums leading-tight">
                {report.mode === 'jamb' ? `${sub.jambScore100}/100` : `${sub.pct}%`}
              </div>
              <div className="h-3 rounded-full bg-[var(--deep)] overflow-hidden">
                <div
                  className={`h-full w-full rounded-full ul-bar-fill ${
                    sub.pct >= 70
                      ? 'bg-[var(--green)]'
                      : sub.pct >= 50
                        ? 'bg-[var(--gold)]'
                        : 'bg-[var(--coral)]'
                  }`}
                  style={{
                    transform: `scaleX(${barsReady ? Math.max(0.04, Math.min(1, sub.pct / 100)) : 0})`,
                    transitionDelay: `${idx * 120}ms`,
                  }}
                />
              </div>
              <div className="text-[12.5px] text-[var(--dim)] tabular-nums">
                {sub.correct} of {sub.total} correct ({sub.pct}%)
              </div>
            </div>
          ))}
        </section>

        {/* Where marks were lost */}
        <section className="rtc-card p-5 flex flex-col gap-3.5">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div>
              <span className="eyebrow text-[var(--coral-ink)]">Where marks were lost</span>
              <h3 className="h20 text-[var(--ink)]">Topics to revise next</h3>
            </div>
            <span className="text-[12.5px] font-semibold text-[var(--dim)]">
              Tap a topic to read its chapter notes
            </span>
          </div>

          {report.weakTopics.length === 0 ? (
            <div className="rounded-[16px] bg-[var(--ok-soft)] border border-[var(--ok-line)] p-4 text-[14.5px] font-semibold text-[var(--ink)]">
              Clean sheet — you did not drop any marks on this paper!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {report.weakTopics.slice(0, 10).map((wt) => (
                <button
                  key={`${wt.subj}:${wt.topicId}`}
                  type="button"
                  onClick={() => onOpenWeakTopic(wt.subj, wt.topicId)}
                  className="text-left rounded-[16px] bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--acc-line)] p-3.5 flex items-center justify-between gap-3 transition cursor-pointer"
                >
                  <div className="min-w-0">
                    <div className="text-[12px] font-bold text-[var(--gold)]">
                      {SUBJECT_INFO[wt.subj].short} · −{wt.marksLost} marks
                    </div>
                    <div className="font-[var(--display)] font-bold text-[15px] text-[var(--ink)] truncate">
                      {wt.topicName}
                    </div>
                    <div className="text-[12.5px] text-[var(--dim)] tabular-nums">
                      Missed {wt.missed} of {wt.total} questions
                    </div>
                  </div>
                  <Icon name="go" size={16} className="text-[var(--gold)] shrink-0" />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Full answer review */}
        <section className="rtc-card p-5 sm:p-6 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="h20 text-[var(--ink)]">Answer review</h3>
              <p className="text-[13.5px] text-[var(--dim)]">
                Check the right answer, why a wrong option fails, and the full explanation.
              </p>
            </div>
            <LiquidCapsuleBar
              roleType="tablist"
              wrap
              size="sm"
              ariaLabel="Filter answer review"
              items={[
                { id: 'wrong' as ReviewFilter, label: `Wrong (${wrongItems.length})` },
                { id: 'skipped' as ReviewFilter, label: `Skipped (${skippedItems.length})` },
                { id: 'flagged' as ReviewFilter, label: `Flagged (${flaggedItems.length})` },
                { id: 'all' as ReviewFilter, label: `All (${paper.length})` },
              ]}
              value={reviewFilter}
              onChange={setReviewFilter}
            />
          </div>

          <SmoothViewSwitch viewKey={reviewFilter}>
            {filteredReviewItems.length === 0 ? (
              <div className="rounded-[16px] bg-[var(--bg)] border border-[var(--line)] p-5 text-center text-[14px] text-[var(--dim)]">
                No questions in this filter.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filteredReviewItems.map((item) => {
                  const picked = answers[item.key];
                  const isSkipped = picked === undefined;
                  const isRight = !isSkipped && picked === item.q.a;
                  const isFlg = !!flagged[item.key];
                  const chosenDispIdx = isSkipped ? -1 : item.order.indexOf(picked);
                  const rightDispIdx = item.order.indexOf(item.q.a);
                  const chosenLetter =
                    chosenDispIdx >= 0 ? String.fromCharCode(65 + chosenDispIdx) : '';
                  const rightLetter =
                    rightDispIdx >= 0 ? String.fromCharCode(65 + rightDispIdx) : '';

                  return (
                    <article
                      key={item.key}
                      className="rounded-[22px] bg-[var(--bg)] border border-[var(--line)] p-4 sm:p-5 flex flex-col gap-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 text-[12.5px]">
                        <div className="flex items-center gap-2 font-bold text-[var(--ink)]">
                          <span className="text-[var(--gold)]">
                            {SUBJECT_INFO[item.subj].short} Q{item.subjQuestionNo}
                          </span>
                          <span aria-hidden="true" className="text-[var(--dim)]">·</span>
                          <span className="text-[var(--dim)]">{item.topicName}</span>
                        </div>
                        <div className="flex items-center gap-2 font-bold">
                          {isFlg && <span className="text-amber-700 dark:text-amber-300">Flagged</span>}
                          <span
                            className={
                              isRight
                                ? 'text-[var(--green)]'
                                : isSkipped
                                  ? 'text-[var(--dim)]'
                                  : 'text-[var(--coral-ink)]'
                            }
                          >
                            {isRight ? 'Correct' : isSkipped ? 'Skipped' : 'Wrong'}
                          </span>
                        </div>
                      </div>

                      <div
                        className="qt text-[var(--ink)]"
                        dangerouslySetInnerHTML={{ __html: typesetMathHtml(item.q.q, item.subj) }}
                      />
                      {item.q.g && <DiagramFigure g={item.q.g} />}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {item.order.map((origIdx, dispIdx) => {
                          const letter = String.fromCharCode(65 + dispIdx);
                          const optIsRight = origIdx === item.q.a;
                          const optIsPicked = picked === origIdx;
                          const cls = optIsRight
                            ? 'ok'
                            : optIsPicked
                              ? 'no'
                              : 'opt-eliminated';
                          return (
                            <div key={origIdx} className={`opt-tile ${cls}`}>
                              <span className="opt-bubble">
                                <span>{letter}</span>
                              </span>
                              <span
                                className="flex-1"
                                dangerouslySetInnerHTML={{
                                  __html: typesetMathHtml(item.q.o[origIdx], item.subj),
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>

                      <div className="rounded-[16px] bg-[var(--card)] border border-[var(--line)] p-3.5 flex flex-col gap-2 text-[14px]">
                        <div className="font-bold text-[var(--ink)]">
                          Correct answer: {rightLetter}
                          {!isSkipped && !isRight && chosenLetter
                            ? ` · You chose ${chosenLetter}`
                            : isSkipped
                              ? ' · You left this blank'
                              : ''}
                        </div>
                        {!isSkipped && !isRight && item.q.w && item.q.w[picked] && (
                          <div
                            className="text-[var(--coral-ink)] font-medium leading-relaxed"
                            dangerouslySetInnerHTML={{
                              __html: typesetMathHtml(
                                `Why ${chosenLetter} is wrong: ${item.q.w[picked]}`,
                                item.subj
                              ),
                            }}
                          />
                        )}
                        <div
                          className="fb text-[var(--ink)] leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html: typesetMathHtml(item.q.e, item.subj),
                          }}
                        />
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </SmoothViewSwitch>
        </section>
      </div>
    );
  }

  // ── ACTIVE EXAM HALL (.eyak-hall — full screen, no sidebar, no tutor, no tap sounds) ──
  const curItem = paper[curIndex];
  if (!curItem) return null;
  const pickedOrig = answers[curItem.key];
  const isFlagged = !!flagged[curItem.key];
  const lowTime = timeLeft <= 180;

  const subjectStarts = examSubjects
    .map((sid) => ({ sid, idx: paper.findIndex((p) => p.subj === sid) }))
    .filter((x) => x.idx >= 0);

  const curSubjEntries = paper
    .map((item, globalIdx) => ({ item, globalIdx }))
    .filter((x) => x.item.subj === curItem.subj);

  const qSlideCls = qDir === 'fwd' ? 'anim-q-fwd' : 'anim-q-back';

  const renderQuestionGridButtons = (onAfterSelect?: () => void) => (
    <div className="grid grid-cols-6 sm:grid-cols-8 min-[960px]:grid-cols-6 gap-1.5 max-h-[290px] overflow-y-auto pr-1">
      {curSubjEntries.map(({ item, globalIdx }) => {
        const isCur = globalIdx === curIndex;
        const isAns = answers[item.key] !== undefined;
        const isFlg = !!flagged[item.key];
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => {
              navigateToIndex(globalIdx);
              onAfterSelect?.();
            }}
            aria-label={`${SUBJECT_INFO[item.subj].short} question ${item.subjQuestionNo}${
              isAns ? ', answered' : ''
            }${isFlg ? ', flagged' : ''}`}
            className={`h-9 rounded-[12px] font-[var(--display)] text-[13px] font-bold border transition cursor-pointer tabular-nums ${
              isCur
                ? 'bg-[var(--gold)] text-[var(--on-acc)] border-[var(--acc-d)]'
                : isFlg
                  ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/60'
                  : isAns
                    ? 'bg-[var(--ok-soft)] text-[var(--green)] border-[var(--ok-line)]'
                    : 'bg-[var(--bg)] text-[var(--dim)] border-[var(--line)] hover:border-[var(--acc-line)] hover:text-[var(--ink)]'
            }`}
          >
            {item.subjQuestionNo}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="eyak-hall max-w-[1140px] mx-auto w-full flex flex-col gap-4 py-1">
      {/* Top exam bar */}
      <header className="rtc-card px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="min-w-0">
            <div className="font-[var(--display)] font-bold text-[17px] text-[var(--ink)] truncate">
              {mode === 'jamb' ? 'JAMB mock exam' : `WAEC ${SUBJECT_INFO[waecSubj].short}`}
            </div>
            <div className="text-[12.5px] text-[var(--dim)] tabular-nums">
              {SUBJECT_INFO[curItem.subj].short} · Question {curItem.subjQuestionNo} of{' '}
              {curItem.subjQuestionTotal}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setToolsOpen(true)}
            className="min-h-[38px] px-3 rounded-[14px] bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--acc-line)] text-[13px] font-bold text-[var(--ink)] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Icon name="sigma" size={14} className="text-[var(--gold)]" />
            <span>Calculator</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileGridOpen(true)}
            className="min-[960px]:hidden min-h-[38px] px-3 rounded-[14px] bg-[var(--bg)] border border-[var(--line)] text-[13px] font-bold text-[var(--ink)] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap tabular-nums"
          >
            <span>Grid ({answeredCount}/{paper.length})</span>
          </button>

          <span
            aria-label="Time remaining"
            className={`min-h-[38px] px-3.5 rounded-[14px] border font-mono text-[14.5px] font-bold inline-flex items-center gap-1.5 tabular-nums ${
              lowTime
                ? 'bg-[var(--bad-soft)] border-[var(--coral)] text-[var(--coral-ink)] anim-timer-urgent'
                : 'bg-[var(--bg)] border-[var(--line)] text-[var(--ink)]'
            }`}
          >
            <Icon name="clock" size={14} />
            <span>{mmss(timeLeft)}</span>
          </span>

          <button
            type="button"
            onClick={() => setConfirmSubmit(true)}
            className="min-h-[38px] px-3.5 rounded-[14px] bg-[var(--gold)] text-[var(--on-acc)] font-[var(--display)] text-[13.5px] font-semibold cursor-pointer whitespace-nowrap"
          >
            Submit
          </button>
        </div>
      </header>

      {/* Subject tabs + overall 12px progress meter */}
      <div className="flex flex-col gap-2.5">
        {subjectStarts.length > 1 && (
          <LiquidCapsuleBar
            roleType="tablist"
            wrap
            size="md"
            ariaLabel="Exam subjects"
            items={subjectStarts.map((st) => {
              const subItems = paper.filter((p) => p.subj === st.sid);
              const subAns = subItems.filter((p) => answers[p.key] !== undefined).length;
              return {
                id: st.sid,
                label: SUBJECT_INFO[st.sid].short,
                sublabel: `${subAns}/${subItems.length}`,
              };
            })}
            value={curItem.subj}
            onChange={(sid) => {
              const found = subjectStarts.find((s) => s.sid === sid);
              if (found) navigateToIndex(found.idx);
            }}
          />
        )}

        <div className="flex items-center gap-3">
          <div className="flex-1 h-3 rounded-full bg-[var(--deep)] overflow-hidden" aria-hidden="true">
            <div
              className="h-full rounded-full bg-[var(--gold)] quiz-prog-fill"
              style={{ width: `${Math.round((answeredCount / Math.max(1, paper.length)) * 100)}%` }}
            />
          </div>
          <span className="text-[12.5px] font-bold text-[var(--dim)] tabular-nums whitespace-nowrap">
            {answeredCount} of {paper.length} answered
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 min-[960px]:grid-cols-12 gap-5 items-start">
        {/* Question paper card */}
        <div className="min-[960px]:col-span-8 flex flex-col gap-4">
          <div key={curItem.key} className={`rtc-card p-5 sm:p-7 flex flex-col gap-5 ${qSlideCls}`}>
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[var(--line)]">
              <div className="flex items-center gap-2 text-[13px] text-[var(--dim)] min-w-0">
                <span className="font-[var(--display)] font-bold text-[var(--gold)] tabular-nums whitespace-nowrap">
                  Question {curItem.subjQuestionNo} of {curItem.subjQuestionTotal}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-[var(--ink)] truncate">
                  {SUBJECT_INFO[curItem.subj].name}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {pickedOrig !== undefined && (
                  <button
                    type="button"
                    onClick={() =>
                      setAnswers((prev) => {
                        const next = { ...prev };
                        delete next[curItem.key];
                        return next;
                      })
                    }
                    className="min-h-[34px] px-3 rounded-[12px] bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--acc-line)] text-[12.5px] font-bold text-[var(--dim)] hover:text-[var(--ink)] cursor-pointer whitespace-nowrap"
                  >
                    Clear answer
                  </button>
                )}

                <button
                  type="button"
                  onClick={() =>
                    setFlagged((prev) => ({ ...prev, [curItem.key]: !prev[curItem.key] }))
                  }
                  className={`min-h-[34px] px-3 rounded-[12px] border text-[12.5px] font-bold inline-flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
                    isFlagged
                      ? 'bg-amber-500/15 border-amber-500/50 text-amber-800 dark:text-amber-300'
                      : 'bg-[var(--bg)] border-[var(--line)] text-[var(--dim)] hover:text-[var(--ink)]'
                  }`}
                >
                  <Icon name="flag" size={13} />
                  <span>{isFlagged ? 'Flagged' : 'Flag for review'}</span>
                  <kbd className="eyak-kbd hidden sm:inline-flex">F</kbd>
                </button>
              </div>
            </div>

            <div
              className="qt text-[var(--ink)]"
              dangerouslySetInnerHTML={{ __html: typesetMathHtml(curItem.q.q, curItem.subj) }}
            />
            {curItem.q.g && <DiagramFigure g={curItem.q.g} />}

            <div className="flex flex-col gap-2.5 pt-1" role="radiogroup" aria-label="Answer options">
              {curItem.order.map((origIdx, dispIdx) => {
                const selected = pickedOrig === origIdx;
                const letter = String.fromCharCode(65 + dispIdx);
                return (
                  <button
                    key={origIdx}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setAnswers((prev) => ({ ...prev, [curItem.key]: origIdx }))}
                    className={`opt-tile ${selected ? 'sel' : ''}`}
                  >
                    <span className="opt-bubble">
                      <span>{letter}</span>
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
              onClick={() => navigateToIndex(curIndex - 1)}
              className="btn-tactile paper disabled:opacity-40 whitespace-nowrap"
            >
              <span>Previous</span>
              <kbd className="eyak-kbd hidden sm:inline-flex">P</kbd>
            </button>
            <div className="hidden md:flex items-center gap-2 text-[12px] text-[var(--dim)]">
              <kbd className="eyak-kbd">A</kbd>–<kbd className="eyak-kbd">D</kbd>
              <span>choose</span>
              <span aria-hidden="true">·</span>
              <kbd className="eyak-kbd">N</kbd>
              <span>next</span>
              <span aria-hidden="true">·</span>
              <kbd className="eyak-kbd">S</kbd>
              <span>submit</span>
            </div>
            {curIndex < paper.length - 1 ? (
              <button
                type="button"
                onClick={() => navigateToIndex(curIndex + 1)}
                className="btn-tactile indigo whitespace-nowrap"
              >
                <span>Next question</span>
                <Icon name="go" size={16} className="ul-arrow" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmSubmit(true)}
                className="btn-tactile indigo whitespace-nowrap"
              >
                <span>Submit paper</span>
              </button>
            )}
          </div>
        </div>

        {/* Desktop Question grid side card */}
        <aside className="hidden min-[960px]:flex min-[960px]:col-span-4 rtc-card p-5 flex-col gap-4">
          <div className="flex items-center justify-between text-[13.5px]">
            <span className="font-[var(--display)] font-bold text-[var(--ink)]">
              {SUBJECT_INFO[curItem.subj].short} question grid
            </span>
            <span className="font-mono text-[12px] font-bold text-[var(--gold)] tabular-nums">
              {answeredCount}/{paper.length} total
            </span>
          </div>

          <div className="grid grid-cols-3 divide-x divide-[var(--line)] rounded-[16px] bg-[var(--bg)] border border-[var(--line)] text-center py-2.5">
            <div>
              <div className="font-[var(--display)] font-bold text-[16px] text-[var(--green)] tabular-nums">
                {answeredCount}
              </div>
              <div className="text-[11px] font-semibold text-[var(--dim)]">Answered</div>
            </div>
            <div>
              <div className="font-[var(--display)] font-bold text-[16px] text-amber-700 dark:text-amber-300 tabular-nums">
                {flaggedCount}
              </div>
              <div className="text-[11px] font-semibold text-[var(--dim)]">Flagged</div>
            </div>
            <div>
              <div className="font-[var(--display)] font-bold text-[16px] text-[var(--ink)] tabular-nums">
                {Math.max(0, paper.length - answeredCount)}
              </div>
              <div className="text-[11px] font-semibold text-[var(--dim)]">Left</div>
            </div>
          </div>

          {renderQuestionGridButtons()}

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--line)] text-[11.5px] font-semibold text-[var(--dim)]">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-[4px] bg-[var(--gold)]" aria-hidden="true" />
              Current
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-[4px] bg-[var(--ok-soft)] border border-[var(--ok-line)]"
                aria-hidden="true"
              />
              Answered
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-[4px] bg-amber-500/25 border border-amber-500/60"
                aria-hidden="true"
              />
              Flagged
            </span>
          </div>

          <button
            type="button"
            onClick={() => setConfirmSubmit(true)}
            className="btn-tactile indigo w-full"
          >
            <span>Submit paper</span>
          </button>
        </aside>
      </div>

      {/* Mobile bottom-sheet question grid */}
      {mobileGridOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Question grid"
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-3 min-[960px]:hidden"
          onClick={() => setMobileGridOpen(false)}
        >
          <div
            className="rtc-card w-full max-w-[520px] rounded-[28px] p-5 flex flex-col gap-4 anim-toast-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="h18 text-[var(--ink)]">Question grid</h3>
                <p className="text-[12.5px] text-[var(--dim)] tabular-nums">
                  {answeredCount} answered · {flaggedCount} flagged ·{' '}
                  {Math.max(0, paper.length - answeredCount)} left
                </p>
              </div>
              <button
                type="button"
                aria-label="Close question grid"
                onClick={() => setMobileGridOpen(false)}
                className="w-9 h-9 rounded-full bg-[var(--bg)] border border-[var(--line)] flex items-center justify-center text-[var(--ink)] cursor-pointer"
              >
                <Icon name="x" size={16} />
              </button>
            </div>

            {subjectStarts.length > 1 && (
              <div className="flex flex-wrap gap-1.5">
                {subjectStarts.map((st) => {
                  const active = curItem.subj === st.sid;
                  return (
                    <button
                      key={st.sid}
                      type="button"
                      onClick={() => navigateToIndex(st.idx)}
                      className={`px-3 py-1.5 rounded-[12px] text-[12.5px] font-bold border cursor-pointer ${
                        active
                          ? 'bg-[var(--gold)] text-[var(--on-acc)] border-[var(--acc-d)]'
                          : 'bg-[var(--bg)] text-[var(--dim)] border-[var(--line)]'
                      }`}
                    >
                      {SUBJECT_INFO[st.sid].short}
                    </button>
                  );
                })}
              </div>
            )}

            {renderQuestionGridButtons(() => setMobileGridOpen(false))}

            <button
              type="button"
              onClick={() => {
                setMobileGridOpen(false);
                setConfirmSubmit(true);
              }}
              className="btn-tactile indigo w-full"
            >
              <span>Submit paper</span>
            </button>
          </div>
        </div>
      )}

      {confirmSubmit && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Submit mock exam"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
        >
          <div className="rtc-card max-w-sm w-full p-6 flex flex-col gap-4">
            <h3 className="h20 text-[var(--ink)]">Submit your mock exam?</h3>
            <p className="text-[14.5px] text-[var(--dim)] leading-relaxed">
              You have answered <strong>{answeredCount} of {paper.length}</strong> questions with{' '}
              <strong>{mmss(timeLeft)}</strong> left on the clock.
            </p>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setConfirmSubmit(false)}
                className="btn-tactile paper flex-1"
              >
                Keep working
              </button>
              <button
                type="button"
                onClick={() =>
                  finalizeExam(paper, answers, Math.max(1, totalDuration - timeLeft))
                }
                className="btn-tactile indigo flex-1"
              >
                Submit now
              </button>
            </div>
          </div>
        </div>
      )}

      <StudyToolsDrawer open={toolsOpen} onClose={() => setToolsOpen(false)} />
    </div>
  );
}
