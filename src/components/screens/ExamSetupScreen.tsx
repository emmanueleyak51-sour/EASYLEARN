import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ExamTrack, SubjectId, UserProgress } from '../../types';
import { subjectToLiveCoachMode } from '../../context/LiveCoachContext';
import { SUBJECT_INFO } from '../../utils/engine';
import {
  ALL_SUBJECT_IDS,
  JAMB_SUBJECT_IDS,
  WAEC_SCHOOL_ONLY_SUBJECT_IDS,
  WAEC_TRADE_ONLY_SUBJECT_IDS,
} from '../../utils/examSubjects';
import {
  buildOnboardingTeacherLineup,
  normalizeJambQuartet,
  normalizeSubjectsForExamTrack,
  resolveExamTrack,
  resolveExamTrackFromToggles,
  type OnboardingTeacherCard,
} from '../../utils/examTrackLogic';
import {
  decodeTtsBase64Audio,
  playStudioWavPayload,
  unlockStudioAudioOnGesture,
  type ActiveAudioHandle,
  type DecodedTtsPayload,
} from '../../utils/studioAudioPlayer';
import { CrestSvg, Icon } from '../Icons';
import { LiquidCapsuleBar, SmoothCollapse, SmoothViewSwitch } from '../ULessonMotion';

const introTtsCache = new Map<string, Promise<DecodedTtsPayload>>();

function fetchTeacherIntroAudio(card: OnboardingTeacherCard): Promise<DecodedTtsPayload> {
  const mode = subjectToLiveCoachMode(card.subj);
  const cacheKey = `${mode}|${card.oneTimeIntroScript.trim()}`;
  const cached = introTtsCache.get(cacheKey);
  if (cached) return cached;

  const reqPromise = (async (): Promise<DecodedTtsPayload> => {
    const res = await fetch('/api/chem/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: card.oneTimeIntroScript,
        voiceProfile: mode,
        topicName: `${card.subjectName} Voice Setup`,
        stepTitle: 'One-Time Voice Greeting',
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.audioBase64) {
      throw new Error(data?.error || 'Could not load studio voice greeting. Tap Retry.');
    }
    return decodeTtsBase64Audio(data.audioBase64, data.mimeType || 'audio/wav');
  })();

  reqPromise.catch(() => {
    introTtsCache.delete(cacheKey);
  });

  if (introTtsCache.size >= 32) {
    const oldest = introTtsCache.keys().next().value;
    if (oldest) introTtsCache.delete(oldest);
  }
  introTtsCache.set(cacheKey, reqPromise);
  return reqPromise;
}

interface DepartmentPreset {
  id: string;
  label: string;
  quartet: SubjectId[];
  waecExtras: SubjectId[];
}

const DEPARTMENT_PRESETS: readonly DepartmentPreset[] = [
  {
    id: 'med',
    label: 'Medicine & Health',
    quartet: ['eng', 'bio', 'chem', 'phys'],
    waecExtras: ['maths', 'civic', 'fmaths'],
  },
  {
    id: 'engr',
    label: 'Engineering & Tech',
    quartet: ['eng', 'maths', 'phys', 'chem'],
    waecExtras: ['fmaths', 'civic', 'dataproc'],
  },
  {
    id: 'comm',
    label: 'Commercial & Econs',
    quartet: ['eng', 'maths', 'econ', 'acct'],
    waecExtras: ['comm', 'civic', 'govt'],
  },
  {
    id: 'law',
    label: 'Law & Humanities',
    quartet: ['eng', 'lit', 'govt', 'crs'],
    waecExtras: ['maths', 'civic', 'econ'],
  },
];

export interface ExamSetupResult {
  examTrack: ExamTrack;
  jambSubjects: SubjectId[];
  subjs: SubjectId[];
  primarySubj: SubjectId;
}

export function ExamSetupScreen({
  progress,
  isReconfigure = false,
  onCompleteSetup,
  onCancel,
}: {
  progress: UserProgress;
  muted?: boolean;
  isReconfigure?: boolean;
  onCompleteSetup: (result: ExamSetupResult) => void;
  onCancel?: () => void;
}) {
  const initialTrack = resolveExamTrack(progress);
  const [jambSelected, setJambSelected] = useState<boolean>(
    initialTrack === 'jamb' || initialTrack === 'both'
  );
  const [waecSelected, setWaecSelected] = useState<boolean>(
    initialTrack === 'waec' || initialTrack === 'both'
  );
  const [step, setStep] = useState<'track' | 'voices'>('track');
  const [validationMsg, setValidationMsg] = useState<string | null>(null);

  const [jambElectives, setJambElectives] = useState<SubjectId[]>(() => {
    const base = normalizeJambQuartet(
      progress.jambSubjects?.length ? progress.jambSubjects : progress.subjs
    );
    return base.filter((s) => s !== 'eng').slice(0, 3);
  });

  const [waecSubjects, setWaecSubjects] = useState<SubjectId[]>(() => {
    const normalized = normalizeSubjectsForExamTrack(
      initialTrack === 'jamb' ? 'both' : initialTrack,
      progress.subjs,
      progress.jambSubjects
    );
    return normalized.subjs;
  });

  const [showAllWaecExtras, setShowAllWaecExtras] = useState<boolean>(false);
  const [subjQuery, setSubjQuery] = useState<string>('');

  const activeTrack: ExamTrack | null = resolveExamTrackFromToggles(jambSelected, waecSelected);
  const effectiveTrack: ExamTrack = activeTrack || 'jamb';

  const jambQuartet = useMemo<SubjectId[]>(
    () => ['eng', ...jambElectives.slice(0, 3)],
    [jambElectives]
  );

  const resolvedEnrollment = useMemo(() => {
    if (effectiveTrack === 'jamb') {
      return {
        subjs: jambQuartet,
        jambQuartet,
      };
    }
    if (effectiveTrack === 'waec') {
      const unique: SubjectId[] = [];
      for (const s of ['eng', 'maths', ...waecSubjects] as SubjectId[]) {
        if (!unique.includes(s)) unique.push(s);
      }
      return {
        subjs: unique.slice(0, 12),
        jambQuartet,
      };
    }
    // 'both': 4 JAMB subjects (70% core) + additional WAEC subjects (30% focus)
    const combined: SubjectId[] = [...jambQuartet];
    for (const s of waecSubjects) {
      if (!combined.includes(s)) combined.push(s);
    }
    if (combined.length < 5) {
      for (const fallback of ['maths', 'civic', 'bio', 'econ'] as SubjectId[]) {
        if (combined.length >= 6) break;
        if (!combined.includes(fallback)) combined.push(fallback);
      }
    }
    return {
      subjs: combined.slice(0, 12),
      jambQuartet,
    };
  }, [effectiveTrack, jambQuartet, waecSubjects]);

  const teacherLineup = useMemo(
    () =>
      buildOnboardingTeacherLineup(
        effectiveTrack,
        resolvedEnrollment.subjs,
        resolvedEnrollment.jambQuartet
      ),
    [effectiveTrack, resolvedEnrollment.jambQuartet, resolvedEnrollment.subjs]
  );

  const [activeVoiceSubj, setActiveVoiceSubj] = useState<SubjectId>('eng');
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'loading' | 'playing'>('idle');
  const [voiceEngine, setVoiceEngine] = useState<'none' | 'webaudio' | 'htmlaudio'>('none');
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [heardTeachers, setHeardTeachers] = useState<Record<string, boolean>>({});
  const activeHandleRef = useRef<ActiveAudioHandle | null>(null);
  const playReqIdRef = useRef<number>(0);
  const mountedRef = useRef<boolean>(true);

  const stopVoicePlayback = useCallback(() => {
    playReqIdRef.current += 1;
    if (activeHandleRef.current) {
      activeHandleRef.current.stop();
      activeHandleRef.current = null;
    }
    setVoiceStatus('idle');
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      stopVoicePlayback();
    };
  }, [stopVoicePlayback]);

  useEffect(() => {
    if (!teacherLineup.some((t) => t.subj === activeVoiceSubj) && teacherLineup[0]) {
      setActiveVoiceSubj(teacherLineup[0].subj);
    }
  }, [activeVoiceSubj, teacherLineup]);

  const activeTeacher =
    teacherLineup.find((t) => t.subj === activeVoiceSubj) || teacherLineup[0];

  // While the current teacher is speaking on Step 2, quietly warm just the next teacher in line
  useEffect(() => {
    if (step !== 'voices' || voiceStatus !== 'playing' || teacherLineup.length <= 1) return;
    const curIdx = teacherLineup.findIndex((t) => t.subj === activeTeacher?.subj);
    const nextCard = teacherLineup[(Math.max(0, curIdx) + 1) % teacherLineup.length];
    if (!nextCard) return;
    const timer = window.setTimeout(() => {
      void fetchTeacherIntroAudio(nextCard).catch(() => {});
    }, 1200);
    return () => {
      window.clearTimeout(timer);
    };
  }, [activeTeacher?.subj, step, teacherLineup, voiceStatus]);

  const playTeacherVoice = useCallback(
    async (card: OnboardingTeacherCard | undefined = activeTeacher) => {
      if (!card) return;
      stopVoicePlayback();
      const reqId = playReqIdRef.current;
      window.dispatchEvent(new CustomEvent('rtc:stop-tts'));
      window.dispatchEvent(new CustomEvent('rtc:clear-live-audio'));

      setVoiceError(null);
      setVoiceStatus('loading');
      try {
        const payload = await fetchTeacherIntroAudio(card);
        if (!mountedRef.current || playReqIdRef.current !== reqId) return;

        const handle = await playStudioWavPayload(payload, {
          onEnded: () => {
            if (mountedRef.current && playReqIdRef.current === reqId) {
              activeHandleRef.current = null;
              setVoiceStatus('idle');
            }
          },
          onError: (err) => {
            if (mountedRef.current && playReqIdRef.current === reqId) {
              activeHandleRef.current = null;
              setVoiceStatus('idle');
              setVoiceError(err.message);
            }
          },
        });

        if (!mountedRef.current || playReqIdRef.current !== reqId) {
          handle.stop();
          return;
        }

        activeHandleRef.current = handle;
        setVoiceEngine(handle.engine);
        setVoiceStatus('playing');
        setHeardTeachers((prev) => ({ ...prev, [card.subj]: true }));
      } catch (err) {
        if (!mountedRef.current || playReqIdRef.current !== reqId) return;
        setVoiceStatus('idle');
        setVoiceError(
          err instanceof Error
            ? err.message
            : 'Could not play voice greeting right now. Tap Retry voice.'
        );
      }
    },
    [activeTeacher, stopVoicePlayback]
  );

  const handleToggleJambOption = () => {
    unlockStudioAudioOnGesture();
    setValidationMsg(null);
    setJambSelected((prev) => !prev);
  };

  const handleToggleWaecOption = () => {
    unlockStudioAudioOnGesture();
    setValidationMsg(null);
    setWaecSelected((prev) => !prev);
  };

  const handleApplyDepartmentPreset = (preset: DepartmentPreset) => {
    unlockStudioAudioOnGesture();
    setValidationMsg(null);
    setJambElectives(preset.quartet.filter((s) => s !== 'eng').slice(0, 3));
    setWaecSubjects([...preset.quartet, ...preset.waecExtras]);
  };

  const handleToggleJambElective = (sid: SubjectId) => {
    if (sid === 'eng') return;
    setValidationMsg(null);
    setJambElectives((prev) => {
      if (prev.includes(sid)) {
        return prev.filter((x) => x !== sid);
      }
      if (prev.length < 3) {
        return [...prev, sid];
      }
      // Replace the oldest chosen elective smoothly when already at 3 electives
      return [...prev.slice(1), sid];
    });
  };

  const handleToggleWaecSubject = (sid: SubjectId) => {
    if (sid === 'eng') return;
    setValidationMsg(null);
    setWaecSubjects((prev) => {
      if (prev.includes(sid)) {
        if (prev.length <= 3) return prev;
        return prev.filter((x) => x !== sid);
      }
      if (prev.length >= 12) return prev;
      return [...prev, sid];
    });
  };

  const handleProceedToVoices = () => {
    unlockStudioAudioOnGesture();
    if (!activeTrack) {
      setValidationMsg('Select at least one exam option (JAMB, WAEC, or both) to continue.');
      return;
    }
    if ((activeTrack === 'jamb' || activeTrack === 'both') && jambElectives.length !== 3) {
      setValidationMsg(
        `Pick ${3 - jambElectives.length} more JAMB subject${3 - jambElectives.length === 1 ? '' : 's'} so your 4 UTME subjects are complete.`
      );
      return;
    }
    if (activeTrack === 'waec' && resolvedEnrollment.subjs.length < 4) {
      setValidationMsg('Select at least 4 WAEC subjects to continue.');
      return;
    }
    setValidationMsg(null);
    const firstCard = teacherLineup[0];
    setActiveVoiceSubj(firstCard?.subj || 'eng');
    setStep('voices');
    if (firstCard) {
      void playTeacherVoice(firstCard);
    }
  };

  const handleFinishSetup = () => {
    if (!activeTrack) return;
    stopVoicePlayback();
    const finalSubjs = ALL_SUBJECT_IDS.filter((id) => resolvedEnrollment.subjs.includes(id));
    const orderedSubjs =
      activeTrack === 'jamb'
        ? resolvedEnrollment.jambQuartet
        : finalSubjs.length > 0
          ? finalSubjs
          : resolvedEnrollment.subjs;
    const primarySubj = orderedSubjs.includes(progress.subj)
      ? progress.subj
      : orderedSubjs[0] || 'eng';

    onCompleteSetup({
      examTrack: activeTrack,
      jambSubjects: resolvedEnrollment.jambQuartet,
      subjs: orderedSubjs,
      primarySubj,
    });
  };

  const cleanQuery = subjQuery.trim().toLowerCase();
  const jambElectivePool = useMemo(
    () =>
      JAMB_SUBJECT_IDS.filter((s) => s !== 'eng').filter((sid) => {
        if (!cleanQuery) return true;
        const info = SUBJECT_INFO[sid];
        return (
          info.name.toLowerCase().includes(cleanQuery) ||
          info.short.toLowerCase().includes(cleanQuery)
        );
      }),
    [cleanQuery]
  );

  const waecPool = useMemo(() => {
    const list =
      effectiveTrack === 'both'
        ? ALL_SUBJECT_IDS.filter((s) => !jambQuartet.includes(s))
        : ALL_SUBJECT_IDS.filter((s) => s !== 'eng');
    return list.filter((sid) => {
      if (!cleanQuery) return true;
      const info = SUBJECT_INFO[sid];
      return (
        info.name.toLowerCase().includes(cleanQuery) ||
        info.short.toLowerCase().includes(cleanQuery)
      );
    });
  }, [cleanQuery, effectiveTrack, jambQuartet]);

  const activeTeacherIndex = teacherLineup.findIndex((t) => t.subj === activeTeacher?.subj);

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-5 py-2 sm:py-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-[var(--line)]">
        <div className="flex items-center gap-3 min-w-0">
          <CrestSvg size={40} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 text-[12px] font-bold text-[var(--gold)]">
              <span>
                {step === 'track'
                  ? 'Step 1 of 2 · Exam Track'
                  : 'Step 2 of 2 · Meet Your Voice Teachers Once'}
              </span>
              {progress.leaderboardCampusGoal && (
                <>
                  <span aria-hidden="true" className="text-[var(--dim)]">·</span>
                  <span className="text-[var(--ink)] truncate">
                    {progress.leaderboardCampusGoal}
                  </span>
                </>
              )}
            </div>
            <h1 className="font-[var(--display)] font-extrabold text-[20px] sm:text-[24px] leading-tight text-[var(--ink)] truncate">
              {step === 'track'
                ? `Welcome${progress.name ? `, ${progress.name}` : ''} — Choose Your Exam`
                : effectiveTrack === 'jamb'
                  ? 'Your 4 JAMB Voice Teachers'
                  : effectiveTrack === 'both'
                    ? 'Your JAMB (70%) + WAEC (30%) Voice Lineup'
                    : 'Your WAEC Voice Teachers'}
            </h1>
          </div>
        </div>
        {isReconfigure && onCancel && (
          <button
            type="button"
            onClick={() => {
              stopVoicePlayback();
              onCancel();
            }}
            className="min-h-[38px] px-3.5 rounded-xl bg-[var(--card)] border border-[var(--line)] text-[13px] font-bold text-[var(--ink)] hover:border-[var(--acc-line)] cursor-pointer whitespace-nowrap shrink-0"
          >
            Back
          </button>
        )}
      </div>

      <SmoothViewSwitch viewKey={step}>
        {step === 'track' ? (
          <div className="flex flex-col gap-5">
            {/* Two Exam Option Cards (Pick One or Both) */}
            <section className="flex flex-col gap-2.5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-[var(--display)] font-bold text-[16px] text-[var(--ink)]">
                  Which exam are you preparing for?
                </h2>
                <span className="text-[12.5px] font-semibold text-[var(--dim)]">
                  Tap one or select both if you are in secondary school
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  aria-pressed={jambSelected}
                  onClick={handleToggleJambOption}
                  className={`p-4 rounded-[22px] border-2 text-left flex flex-col gap-2.5 transition-[border-color,background-color,transform] duration-150 active:translate-y-[1px] cursor-pointer ${
                    jambSelected
                      ? 'bg-[var(--acc-soft)] border-[var(--gold)]'
                      : 'bg-[var(--card)] border-[var(--line)] hover:border-[var(--acc-line)]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 w-full">
                    <span className="font-[var(--display)] font-extrabold text-[18px] text-[var(--ink)]">
                      JAMB UTME
                    </span>
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                        jambSelected
                          ? 'bg-[var(--gold)] border-[var(--gold)] text-[var(--on-acc)]'
                          : 'border-[var(--line)] text-transparent'
                      }`}
                    >
                      <Icon name="check" size={14} />
                    </span>
                  </div>
                  <p className="text-[13px] text-[var(--muted)] leading-relaxed">
                    Displays strictly your 4 JAMB subjects, trains you under tougher-than-UTME timing with tricky look-alike options, and unlocks Saturday /400 CBT rankings.
                  </p>
                  <div className="text-[12px] font-bold text-[var(--gold)]">
                    4 UTME subjects · Deep concepts · Tough /400 grading
                  </div>
                </button>

                <button
                  type="button"
                  aria-pressed={waecSelected}
                  onClick={handleToggleWaecOption}
                  className={`p-4 rounded-[22px] border-2 text-left flex flex-col gap-2.5 transition-[border-color,background-color,transform] duration-150 active:translate-y-[1px] cursor-pointer ${
                    waecSelected
                      ? 'bg-[var(--acc-soft)] border-[var(--gold)]'
                      : 'bg-[var(--card)] border-[var(--line)] hover:border-[var(--acc-line)]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 w-full">
                    <span className="font-[var(--display)] font-extrabold text-[18px] text-[var(--ink)]">
                      WAEC / SSCE
                    </span>
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                        waecSelected
                          ? 'bg-[var(--gold)] border-[var(--gold)] text-[var(--on-acc)]'
                          : 'border-[var(--line)] text-transparent'
                      }`}
                    >
                      <Icon name="check" size={14} />
                    </span>
                  </div>
                  <p className="text-[13px] text-[var(--muted)] leading-relaxed">
                    Trains you on WAEC Paper 1 Objectives + Paper 2 Theory marking-scheme points, practicals, and the common mistakes candidates must avoid.
                  </p>
                  <div className="text-[12px] font-bold text-[var(--gold)]">
                    Objectives + Theory rubric · Chief Examiner mistake shield
                  </div>
                </button>
              </div>
            </section>

            {/* Dynamic Track Commitment Callout */}
            <SmoothViewSwitch viewKey={activeTrack || 'none'}>
              {activeTrack === 'jamb' && (
                <div className="p-4 rounded-[20px] bg-[var(--card)] border border-[var(--acc-line)] flex flex-col gap-1.5">
                  <div className="font-[var(--display)] font-bold text-[14.5px] text-[var(--gold)]">
                    JAMB-Only Tough Mode Active
                  </div>
                  <p className="text-[13px] text-[var(--muted)] leading-relaxed">
                    Only your <strong>4 chosen JAMB subjects</strong> and <strong>4 Live Voice Teachers</strong> will appear across the app. Topic Tests require <strong>6/7 in 3:30</strong> with look-alike options so your real JAMB score matches or beats your Easy Learn score.
                  </p>
                </div>
              )}
              {activeTrack === 'both' && (
                <div className="p-4 rounded-[20px] bg-[var(--card)] border border-[var(--acc-line)] flex flex-col gap-1.5">
                  <div className="font-[var(--display)] font-bold text-[14.5px] text-[var(--gold)]">
                    Combined Secondary School Track · 70% JAMB + 30% WAEC
                  </div>
                  <p className="text-[13px] text-[var(--muted)] leading-relaxed">
                    Built for SS3 &amp; school candidates writing both exams: <strong>70% of your daily missions</strong> drill your 4 JAMB subjects under tough UTME conditions, while <strong>30%</strong> sharpens your WAEC theory steps and extra school subjects.
                  </p>
                </div>
              )}
              {activeTrack === 'waec' && (
                <div className="p-4 rounded-[20px] bg-[var(--card)] border border-[var(--acc-line)] flex flex-col gap-1.5">
                  <div className="font-[var(--display)] font-bold text-[14.5px] text-[var(--gold)]">
                    WAEC Distinction Track Active
                  </div>
                  <p className="text-[13px] text-[var(--muted)] leading-relaxed">
                    Trains you on how WASSCE papers are marked — full workings, SI units, labelled diagrams, and avoiding the top candidate mistakes flagged by WAEC Chief Examiners.
                  </p>
                </div>
              )}
              {!activeTrack && (
                <div className="p-4 rounded-[20px] bg-[var(--card)] border border-[var(--line)] text-[13px] font-semibold text-[var(--muted)]">
                  Tap <strong>JAMB UTME</strong>, <strong>WAEC / SSCE</strong>, or <strong>both</strong> above to configure your subjects.
                </div>
              )}
            </SmoothViewSwitch>

            {/* Quick Department Presets + Subject Search */}
            {activeTrack && (
              <section className="flex flex-col gap-4 bg-[var(--card)] p-4 sm:p-5 rounded-[22px] border border-[var(--line)]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[12.5px] font-bold text-[var(--dim)]">
                    Quick department combinations
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {DEPARTMENT_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleApplyDepartmentPreset(preset)}
                        className="min-h-[32px] px-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--acc-line)] text-[12px] font-bold text-[var(--ink)] cursor-pointer whitespace-nowrap"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="search"
                    value={subjQuery}
                    onChange={(e) => setSubjQuery(e.target.value)}
                    placeholder="Filter subjects (e.g. Physics, Literature, Economics)..."
                    aria-label="Filter subjects"
                    className="w-full min-h-[40px] px-3.5 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-[13.5px] text-[var(--ink)] placeholder:text-[var(--dim)] focus:outline-none focus:border-[var(--gold)]"
                  />
                </div>

                {/* JAMB 4-Subject Quartet Picker (Shown for 'jamb' and 'both') */}
                {(activeTrack === 'jamb' || activeTrack === 'both') && (
                  <div className="flex flex-col gap-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-[var(--display)] font-bold text-[15px] text-[var(--ink)]">
                        {activeTrack === 'both'
                          ? 'Your 4 Core JAMB Subjects (70% Focus)'
                          : 'Your 4 JAMB UTME Subjects (English + 3 Electives)'}
                      </h3>
                      <span className="text-[12.5px] font-bold text-[var(--gold)] tabular-nums">
                        {1 + jambElectives.length} / 4 selected
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 pb-1">
                      <span className="min-h-[34px] px-3 rounded-xl bg-[var(--gold)] text-[var(--on-acc)] text-[12.5px] font-bold inline-flex items-center gap-1.5 whitespace-nowrap">
                        <Icon name="lock" size={12} />
                        <span>English (Compulsory)</span>
                      </span>
                      {jambElectives.map((sid) => (
                        <button
                          key={sid}
                          type="button"
                          onClick={() => handleToggleJambElective(sid)}
                          className="min-h-[34px] px-3 rounded-xl bg-[var(--acc-soft)] border border-[var(--gold)] text-[var(--gold)] text-[12.5px] font-bold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                        >
                          <span>{SUBJECT_INFO[sid].short}</span>
                          <Icon name="x" size={12} />
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[260px] overflow-y-auto pr-1">
                      {jambElectivePool.map((sid) => {
                        const selected = jambElectives.includes(sid);
                        return (
                          <button
                            key={sid}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => handleToggleJambElective(sid)}
                            className={`min-h-[40px] px-3 rounded-xl border text-[13px] font-semibold flex items-center justify-between gap-2 text-left cursor-pointer transition-colors duration-150 ${
                              selected
                                ? 'bg-[var(--acc-soft)] border-[var(--gold)] text-[var(--gold)] font-bold'
                                : 'bg-[var(--bg)] border-[var(--line)] text-[var(--ink)] hover:border-[var(--acc-line)]'
                            }`}
                          >
                            <span className="truncate">{SUBJECT_INFO[sid].short}</span>
                            {selected && <Icon name="check" size={14} className="shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* WAEC Subjects Picker (Shown directly for 'waec', or collapsible 30% extras for 'both') */}
                {activeTrack === 'waec' && (
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-[var(--display)] font-bold text-[15px] text-[var(--ink)]">
                        Choose Your WAEC Subjects
                      </h3>
                      <span className="text-[12.5px] font-bold text-[var(--gold)] tabular-nums">
                        {resolvedEnrollment.subjs.length} selected
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[280px] overflow-y-auto pr-1">
                      {waecPool.map((sid) => {
                        const selected = resolvedEnrollment.subjs.includes(sid);
                        const isSchoolOrTrade =
                          WAEC_SCHOOL_ONLY_SUBJECT_IDS.includes(sid) ||
                          WAEC_TRADE_ONLY_SUBJECT_IDS.includes(sid);
                        return (
                          <button
                            key={sid}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => handleToggleWaecSubject(sid)}
                            className={`min-h-[40px] px-3 rounded-xl border text-[13px] font-semibold flex items-center justify-between gap-2 text-left cursor-pointer transition-colors duration-150 ${
                              selected
                                ? 'bg-[var(--acc-soft)] border-[var(--gold)] text-[var(--gold)] font-bold'
                                : 'bg-[var(--bg)] border-[var(--line)] text-[var(--ink)] hover:border-[var(--acc-line)]'
                            }`}
                          >
                            <span className="truncate">
                              {SUBJECT_INFO[sid].short}
                              {isSchoolOrTrade ? ' · WAEC' : ''}
                            </span>
                            {selected && <Icon name="check" size={14} className="shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeTrack === 'both' && (
                  <div className="pt-3 border-t border-[var(--line)] flex flex-col gap-2.5">
                    <button
                      type="button"
                      aria-expanded={showAllWaecExtras}
                      onClick={() => setShowAllWaecExtras((v) => !v)}
                      className="w-full flex items-center justify-between gap-2 text-left cursor-pointer py-1"
                    >
                      <div>
                        <div className="font-[var(--display)] font-bold text-[14.5px] text-[var(--ink)]">
                          Additional WAEC Subjects (30% Secondary Focus)
                        </div>
                        <div className="text-[12px] text-[var(--dim)]">
                          {resolvedEnrollment.subjs
                            .filter((s) => !jambQuartet.includes(s))
                            .map((s) => SUBJECT_INFO[s].short)
                            .join(' · ') || 'Tap to add extra WAEC school or trade subjects'}
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[12.5px] font-bold text-[var(--gold)] shrink-0 whitespace-nowrap">
                        <span>{showAllWaecExtras ? 'Hide' : 'Customize'}</span>
                        <Icon
                          name="chevron"
                          size={15}
                          className={`transition-transform duration-200 ${
                            showAllWaecExtras ? 'rotate-90' : ''
                          }`}
                        />
                      </span>
                    </button>

                    <SmoothCollapse open={showAllWaecExtras}>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[220px] overflow-y-auto pt-1 pr-1">
                        {waecPool.map((sid) => {
                          const selected = resolvedEnrollment.subjs.includes(sid);
                          return (
                            <button
                              key={sid}
                              type="button"
                              aria-pressed={selected}
                              onClick={() => handleToggleWaecSubject(sid)}
                              className={`min-h-[38px] px-3 rounded-xl border text-[12.5px] font-semibold flex items-center justify-between gap-2 text-left cursor-pointer ${
                                selected
                                  ? 'bg-[var(--acc-soft)] border-[var(--gold)] text-[var(--gold)] font-bold'
                                  : 'bg-[var(--bg)] border-[var(--line)] text-[var(--ink)] hover:border-[var(--acc-line)]'
                              }`}
                            >
                              <span className="truncate">{SUBJECT_INFO[sid].short}</span>
                              {selected && <Icon name="check" size={13} className="shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </SmoothCollapse>
                  </div>
                )}
              </section>
            )}

            {validationMsg && (
              <div
                role="alert"
                className="px-4 py-3 rounded-xl bg-[var(--peach-bg)] border border-[var(--peach-line)] text-[13px] font-bold text-[var(--peach-ink)]"
              >
                {validationMsg}
              </div>
            )}

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleProceedToVoices}
                className="min-h-[46px] px-6 rounded-[18px] bg-[var(--gold)] text-[var(--on-acc)] font-[var(--display)] font-extrabold text-[15px] inline-flex items-center gap-2 cursor-pointer hover:opacity-95 transition-opacity whitespace-nowrap"
              >
                <span>
                  {effectiveTrack === 'jamb'
                    ? 'Meet My 4 JAMB Voice Teachers'
                    : 'Meet My Voice Teachers'}
                </span>
                <Icon name="go" size={17} />
              </button>
            </div>
          </div>
        ) : (
          /* Step 2: One-Time AI Voice Assistant Lineup */
          <div className="flex flex-col gap-5">
            <p className="text-[13.5px] text-[var(--muted)] leading-relaxed">
              {effectiveTrack === 'jamb'
                ? 'Switch between your 4 JAMB Live Voice Teachers below just like choosing an AI voice assistant. They introduce themselves right here once — inside lessons and live calls, they skip all introductions and jump straight to teaching.'
                : 'Switch between your subject Live Voice Teachers below to hear their voices once. Inside your lessons and calls, they never repeat introductions — they go straight into teaching.'}
            </p>

            {/* Liquid Glass AI Voice Switcher */}
            <LiquidCapsuleBar
              roleType="tablist"
              ariaLabel="Switch AI voice teacher"
              size="lg"
              items={teacherLineup.map((card) => ({
                id: card.subj,
                label: card.shortName,
                icon: SUBJECT_INFO[card.subj].icon,
                sublabel:
                  effectiveTrack === 'both'
                    ? card.isPrimaryJamb
                      ? '70%'
                      : '30%'
                    : undefined,
              }))}
              value={activeTeacher?.subj || teacherLineup[0]?.subj || null}
              onChange={(sid) => {
                unlockStudioAudioOnGesture();
                setActiveVoiceSubj(sid);
                const picked = teacherLineup.find((t) => t.subj === sid);
                if (picked) {
                  void playTeacherVoice(picked);
                }
              }}
            />

            {/* Active AI Voice Assistant Stage */}
            {activeTeacher && (
              <SmoothViewSwitch viewKey={activeTeacher.subj}>
                <div
                  data-testid="voice-intro-stage"
                  data-voice-status={voiceStatus}
                  data-voice-engine={voiceEngine}
                  className="p-5 sm:p-6 rounded-[24px] bg-[var(--card)] border border-[var(--acc-line)] flex flex-col gap-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-14 h-14 rounded-2xl bg-[var(--acc-soft)] border border-[var(--acc-line)] text-[var(--gold)] flex items-center justify-center shrink-0">
                        <Icon name={SUBJECT_INFO[activeTeacher.subj].icon} size={26} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[12px] font-bold text-[var(--gold)]">
                          {activeTeacher.subjectName}
                          {effectiveTrack === 'both'
                            ? activeTeacher.isPrimaryJamb
                              ? ' · 70% JAMB Core'
                              : ' · 30% WAEC Focus'
                            : ' · Studio Voice'}
                        </div>
                        <h2 className="font-[var(--display)] font-extrabold text-[21px] text-[var(--ink)] truncate">
                          {activeTeacher.tutorName}
                        </h2>
                        <div className="text-[12.5px] font-semibold text-[var(--dim)] truncate">
                          {activeTeacher.personalityTag}
                        </div>
                      </div>
                    </div>

                    {/* Animated Voice Assistant Bars */}
                    <div
                      aria-hidden="true"
                      className="flex items-center gap-1 h-9 px-3.5 rounded-full bg-[var(--bg)] border border-[var(--line)]"
                    >
                      {(['h-3', 'h-5', 'h-6', 'h-3.5', 'h-5', 'h-3'] as const).map((hCls, idx) => (
                        <span
                          key={idx}
                          className={`w-1 rounded-full bg-[var(--gold)] transition-transform duration-200 ${
                            voiceStatus === 'playing' ? `${hCls} animate-pulse` : 'h-2 opacity-55'
                          }`}
                        />
                      ))}
                      <span className="ml-1.5 text-[11.5px] font-bold text-[var(--muted)] tabular-nums whitespace-nowrap">
                        {voiceStatus === 'loading'
                          ? 'Connecting...'
                          : voiceStatus === 'playing'
                            ? 'Speaking'
                            : heardTeachers[activeTeacher.subj]
                              ? 'Previewed'
                              : `${activeTeacherIndex + 1} of ${teacherLineup.length}`}
                      </span>
                    </div>
                  </div>

                  <blockquote className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--line)] text-[14px] text-[var(--ink)] leading-relaxed">
                    “{activeTeacher.oneTimeIntroScript}”
                  </blockquote>

                  {voiceError && (
                    <div
                      role="alert"
                      className="px-4 py-2.5 rounded-xl bg-[var(--bad-soft)] border border-[var(--bad-line)] text-[12.5px] text-[var(--coral-ink)] flex flex-wrap items-center justify-between gap-2"
                    >
                      <span className="font-semibold">{voiceError}</span>
                      <button
                        type="button"
                        onClick={() => {
                          unlockStudioAudioOnGesture();
                          void playTeacherVoice(activeTeacher);
                        }}
                        className="min-h-[30px] px-3 rounded-lg bg-[var(--card)] border border-[var(--bad-line)] text-[12px] font-bold text-[var(--ink)] cursor-pointer whitespace-nowrap"
                      >
                        Retry voice
                      </button>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (voiceStatus === 'playing' || voiceStatus === 'loading') {
                            stopVoicePlayback();
                          } else {
                            unlockStudioAudioOnGesture();
                            void playTeacherVoice(activeTeacher);
                          }
                        }}
                        className="min-h-[40px] px-4 rounded-xl bg-[var(--acc-soft)] border border-[var(--gold)] text-[var(--gold)] font-[var(--display)] font-bold text-[13.5px] inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
                      >
                        <Icon
                          name={voiceStatus === 'playing' ? 'pause' : 'vol'}
                          size={16}
                        />
                        <span>
                          {voiceStatus === 'playing'
                            ? 'Stop voice'
                            : voiceStatus === 'loading'
                              ? 'Loading voice...'
                              : heardTeachers[activeTeacher.subj]
                                ? 'Replay voice greeting'
                                : 'Play voice greeting'}
                        </span>
                      </button>

                      {teacherLineup.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            unlockStudioAudioOnGesture();
                            const nextIdx = (activeTeacherIndex + 1) % teacherLineup.length;
                            const nextCard = teacherLineup[nextIdx];
                            if (nextCard) {
                              setActiveVoiceSubj(nextCard.subj);
                              void playTeacherVoice(nextCard);
                            }
                          }}
                          className="min-h-[40px] px-3.5 rounded-xl bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--acc-line)] text-[var(--ink)] font-bold text-[13px] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                        >
                          <span>Next voice</span>
                          <Icon name="go" size={14} />
                        </button>
                      )}
                    </div>

                    <span className="text-[12px] font-semibold text-[var(--dim)]">
                      Zero intros inside lessons &amp; live calls
                    </span>
                  </div>
                </div>
              </SmoothViewSwitch>
            )}

            {/* Lineup Overview Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {teacherLineup.map((card) => {
                const isSelected = card.subj === activeTeacher?.subj;
                return (
                  <button
                    key={card.subj}
                    type="button"
                    onClick={() => {
                      unlockStudioAudioOnGesture();
                      setActiveVoiceSubj(card.subj);
                      void playTeacherVoice(card);
                    }}
                    className={`p-3 rounded-2xl border text-left flex flex-col gap-1 cursor-pointer transition-colors duration-150 ${
                      isSelected
                        ? 'bg-[var(--acc-soft)] border-[var(--gold)]'
                        : 'bg-[var(--card)] border-[var(--line)] hover:border-[var(--acc-line)]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="text-[11.5px] font-bold text-[var(--gold)] truncate">
                        {card.shortName}
                      </span>
                      {heardTeachers[card.subj] && (
                        <Icon name="check" size={13} className="text-[var(--gold)] shrink-0" />
                      )}
                    </div>
                    <span className="font-[var(--display)] font-bold text-[13.5px] text-[var(--ink)] truncate">
                      {card.tutorName}
                    </span>
                    <span className="text-[11px] text-[var(--dim)] truncate">
                      {card.personalityTag}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  stopVoicePlayback();
                  setStep('track');
                }}
                className="min-h-[44px] px-4 rounded-2xl bg-[var(--card)] border border-[var(--line)] hover:border-[var(--acc-line)] text-[13.5px] font-bold text-[var(--ink)] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Icon name="back" size={15} />
                <span>Adjust exam or subjects</span>
              </button>

              <button
                type="button"
                onClick={handleFinishSetup}
                className="min-h-[46px] px-6 rounded-[18px] bg-[var(--gold)] text-[var(--on-acc)] font-[var(--display)] font-extrabold text-[15px] inline-flex items-center gap-2 cursor-pointer hover:opacity-95 transition-opacity whitespace-nowrap"
              >
                <span>
                  {effectiveTrack === 'jamb'
                    ? 'Start Tough JAMB Training'
                    : effectiveTrack === 'both'
                      ? 'Start 70% JAMB + 30% WAEC Training'
                      : 'Start WAEC Training'}
                </span>
                <Icon name="go" size={17} />
              </button>
            </div>
          </div>
        )}
      </SmoothViewSwitch>
    </div>
  );
}
