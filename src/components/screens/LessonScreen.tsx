import React, { useMemo, useState } from 'react';
import type { Beat, InteractiveLesson, LessonPart, Topic, UserProgress } from '../../types';
import { tstate } from '../../utils/engine';
import { extractBeatSpeechScript } from '../../utils/chemVoiceLogic';
import { typesetMathHtml } from '../../utils/mathTypesetter';
import { AdirePattern, Icon } from '../Icons';
import { initExplorerState } from '../Explorers';
import {
  BEAT_META,
  BeatLocalState,
  BeatMainContent,
  BeatVisualPane,
  beatHasRightPane,
  isBeatDone,
  makeInitialBeatState,
} from '../LessonBeats';
import { ChemMadScientistBar } from '../ChemMadScientistBar';
import { SplitWorkbench, SubscreenTopBar } from '../AppShell';

interface FlatStep {
  partIdx: number;
  partTitle: string;
  beatIdx: number;
  beat: Beat;
}

function buildSteps(lesson: InteractiveLesson | undefined, topic: Topic): FlatStep[] {
  if (lesson && lesson.parts.length > 0) {
    const flat: FlatStep[] = [];
    lesson.parts.forEach((p: LessonPart, pi: number) => {
      p.beats.forEach((b: Beat, bi: number) => {
        flat.push({ partIdx: pi, partTitle: p.title, beatIdx: bi, beat: b });
      });
    });
    return flat;
  }
  const flat: FlatStep[] = [];
  topic.parts.forEach((p, pi) => {
    flat.push({
      partIdx: pi,
      partTitle: p.title,
      beatIdx: 0,
      beat: { k: 'idea', title: p.title, idea: p.idea, g: p.g, cap: p.cap, rules: p.rules },
    });
  });
  return flat;
}

function beatToneClass(k: Beat['k']): string {
  if (k === 'explore') return 'text-[var(--hint)]';
  if (k === 'dayo') return 'text-[var(--green)]';
  if (k === 'spot') return 'text-[var(--coral-ink)]';
  return 'text-[var(--gold)]';
}

export function LessonScreen({
  topic,
  lesson,
  progress,
  onBack,
  onCompleteLesson,
  onStartPractice,
  onSound,
}: {
  topic: Topic;
  lesson: InteractiveLesson | undefined;
  progress: UserProgress;
  onBack: () => void;
  onCompleteLesson: () => void;
  onStartPractice: () => void;
  onSound: (kind: 'ok' | 'no' | 'done' | 'draw') => void;
}) {
  const steps = useMemo(() => buildSteps(lesson, topic), [lesson, topic]);
  const [stepIdx, setStepIdx] = useState(0);
  const [stepDir, setStepDir] = useState<'fwd' | 'back'>('fwd');
  const [completed, setCompleted] = useState(false);
  const [beatStates, setBeatStates] = useState<Record<number, BeatLocalState>>({});

  if (steps.length === 0) {
    return (
      <div className="max-w-[680px] mx-auto py-8 flex flex-col gap-4">
        <SubscreenTopBar title={topic.name} subtitle="Lesson" onBack={onBack} />
        <div className="rounded-2xl bg-[var(--card)] border border-[var(--line)] p-6 text-center">
          <p className="text-[16px] text-[var(--dim)]">No lesson steps found for this topic yet.</p>
        </div>
      </div>
    );
  }

  const currentStep = steps[Math.min(stepIdx, steps.length - 1)];
  const currentBeat = currentStep.beat;
  const beatKey = `${topic.id}|${currentStep.partIdx}|${currentStep.beatIdx}`;

  const getBeatState = (idx: number, b: Beat): BeatLocalState => {
    if (beatStates[idx]) return beatStates[idx];
    const xpInit = b.k === 'explore' ? initExplorerState(b.xp, b.cfg || {}) : undefined;
    return makeInitialBeatState(b, xpInit);
  };

  const st = getBeatState(stepIdx, currentBeat);
  const patchBeatState = (patch: Partial<BeatLocalState>) => {
    setBeatStates((prev) => {
      const base = prev[stepIdx] || getBeatState(stepIdx, currentBeat);
      return { ...prev, [stepIdx]: { ...base, ...patch } };
    });
  };

  const done = isBeatDone(currentBeat, st);
  const hasRight = beatHasRightPane(currentBeat, st);
  const meta = BEAT_META[currentBeat.k];
  const isLast = stepIdx === steps.length - 1;
  const alreadyDone = !!tstate(progress, topic.id).lesson;
  const voiceMode =
    progress.subj === 'dataproc'
      ? 'dataproc'
      : progress.subj === 'digitech'
        ? 'digitech'
        : progress.subj === 'civic'
          ? 'civic'
          : progress.subj === 'eng'
            ? 'eng'
            : progress.subj === 'econ'
              ? 'econ'
              : progress.subj === 'geog'
                ? 'geog'
                : progress.subj === 'agric'
                  ? 'agric'
                  : progress.subj === 'bio'
                    ? 'bio'
                    : progress.subj === 'phys'
                      ? 'phys'
                      : progress.subj === 'chem'
                        ? 'chem'
                        : progress.subj === 'fmaths'
                          ? 'fmath'
                          : 'math';

  const allBeatScripts = useMemo(
    () =>
      steps.map((s, idx) =>
        extractBeatSpeechScript(
          s.beat,
          topic.name,
          s.partTitle,
          idx === 0,
          progress.subj
        )
      ),
    [steps, topic.name, progress.subj]
  );

  const lessonVoiceContext = useMemo(
    () => ({
      topicName: topic.name,
      sectionName: topic.sec,
      partTitle: currentStep.partTitle,
      stepLabel: currentBeat.kl || meta.label,
      stepText: allBeatScripts[stepIdx] || '',
      examTrap: topic.trap,
      goals: topic.goals,
    }),
    [
      allBeatScripts,
      topic.name,
      topic.sec,
      topic.trap,
      topic.goals,
      currentStep.partTitle,
      currentBeat.kl,
      meta.label,
      stepIdx,
    ]
  );

  const handleNext = () => {
    if (!done) return;
    if (isLast) {
      onSound('done');
      if (!completed) {
        onCompleteLesson();
      }
      setCompleted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setStepDir('fwd');
      setStepIdx((i) => Math.min(steps.length - 1, i + 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (stepIdx > 0) {
      setStepDir('back');
      setStepIdx((i) => Math.max(0, i - 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (completed) {
    return (
      <div className="max-w-[640px] mx-auto py-6 flex flex-col gap-5 anim-rise">
        <SubscreenTopBar title="Lesson Complete" subtitle={topic.name} onBack={onBack} />
        <section className="adire-panel rounded-[26px] p-7 sm:p-8 text-center flex flex-col items-center gap-4">
          <AdirePattern />
          <div className="relative z-10 w-16 h-16 rounded-2xl bg-[var(--hero-badge)] text-[#141C33] flex items-center justify-center shadow-lg anim-stamp">
            <Icon name="check" size={34} />
          </div>
          <div className="relative z-10 flex flex-col gap-1.5">
            <span className="eyebrow text-[var(--hero-badge)]">Lesson Mastered</span>
            <h1 className="h28 text-white">You finished {topic.name}!</h1>
            <p className="text-[15px] text-white/85 max-w-md mx-auto">
              Now lock in what you learned with 6 mastery practice questions.
            </p>
          </div>
        </section>

        <div className="rounded-2xl bg-[var(--bad-soft)] border border-[var(--bad-line)] p-5 flex items-start gap-3.5">
          <span className="w-9 h-9 rounded-xl bg-[var(--card)] text-[var(--coral-ink)] flex items-center justify-center shrink-0">
            <Icon name="bolt" size={18} />
          </span>
          <div>
            <span className="eyebrow text-[var(--coral-ink)]">Trap</span>
            <p
              className="text-[15px] text-[var(--ink)] mt-1 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: typesetMathHtml(topic.trap, progress.subj) }}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button type="button" onClick={onStartPractice} className="btn-tactile indigo flex-1">
            <span>Start practice (6 questions)</span>
            <Icon name="go" size={18} />
          </button>
          <button type="button" onClick={onBack} className="btn-tactile paper">
            <span>Back to topic</span>
          </button>
        </div>
      </div>
    );
  }

  const stepAnimCls = stepDir === 'fwd' ? 'anim-step-fwd' : 'anim-step-back';

  return (
    <div className="flex flex-col gap-4 anim-rise">
      <SubscreenTopBar
        title={topic.name}
        subtitle={`Part ${currentStep.partIdx + 1} · ${currentStep.partTitle}`}
        onBack={onBack}
        right={
          <span className="text-[13px] font-extrabold tabular-nums text-[var(--dim)] whitespace-nowrap">
            Step {stepIdx + 1} / {steps.length}
          </span>
        }
      />

      {/* Unified Interactive Segmented Progress Bar */}
      <div
        role="progressbar"
        aria-label="Lesson progress"
        aria-valuemin={1}
        aria-valuemax={steps.length}
        aria-valuenow={stepIdx + 1}
        className="flex items-center gap-1.5"
      >
        {steps.map((_, idx) => {
          const canJump = alreadyDone || idx <= stepIdx;
          const isCurrent = idx === stepIdx;
          const isPast = idx < stepIdx;
          return (
            <button
              key={idx}
              type="button"
              aria-label={`Jump to step ${idx + 1} of ${steps.length}`}
              aria-current={isCurrent ? 'step' : undefined}
              disabled={!canJump}
              onClick={() => {
                if (canJump && idx !== stepIdx) {
                  setStepDir(idx > stepIdx ? 'fwd' : 'back');
                  setStepIdx(idx);
                }
              }}
              className={`h-2 flex-1 rounded-full transition-all duration-150 ${
                canJump ? 'cursor-pointer hover:opacity-85' : 'cursor-default'
              } ${
                isPast
                  ? 'bg-[var(--green)]'
                  : isCurrent
                    ? 'bg-[var(--gold)] ring-2 ring-[var(--acc-glow)]'
                    : 'bg-[var(--line)]/90'
              }`}
            />
          );
        })}
      </div>

      {/* One-Tap Continuous Studio TTS & Live Tutor */}
      <ChemMadScientistBar
        mode={voiceMode}
        sessionKey={`lesson-session|${progress.subj}|${topic.id}`}
        stepKey={`${progress.subj}|${beatKey}`}
        upcomingScripts={allBeatScripts.filter((_, idx) => idx !== stepIdx)}
        muted={progress.muted}
        context={lessonVoiceContext}
      />

      {/* Beat Category Label */}
      <div className="flex items-center justify-between gap-2 pt-0.5">
        <div className={`inline-flex items-center gap-2 text-[13px] font-bold ${beatToneClass(currentBeat.k)}`}>
          <Icon name={meta.icon} size={15} />
          <span>{currentBeat.kl || meta.label}</span>
        </div>
        {!done && (
          <span className="text-[12.5px] font-semibold text-[var(--dim)]">
            Complete this activity to continue
          </span>
        )}
      </div>

      <SplitWorkbench
        hasRightPane={hasRight}
        left={
          <div key={beatKey} className={stepAnimCls}>
            <BeatMainContent
              beat={currentBeat}
              beatKey={beatKey}
              st={st}
              subj={progress.subj}
              onUpdate={patchBeatState}
              inlineVisual={true}
              responsiveSplit={hasRight}
              onSound={(k) => onSound(k)}
            />
          </div>
        }
        right={
          hasRight ? (
            <div key={`${beatKey}-vis`} className="rtc-card rounded-[20px] p-4 flex flex-col gap-3 anim-rise">
              <div className="flex items-center justify-between px-1">
                <span className="eyebrow text-[var(--dim)]">
                  {currentBeat.k === 'explore' ? 'Interactive Chalkboard' : 'Chalkboard Diagram'}
                </span>
              </div>
              <BeatVisualPane
                beat={currentBeat}
                st={st}
                onDrawSound={() => onSound('draw')}
                onXpChange={(nextXp) => {
                  const nextDone = { ...st.tasksDone };
                  if (currentBeat.k === 'explore') {
                    currentBeat.tasks.forEach((task, i) => {
                      if (!nextDone[i] && task.ok(nextXp)) nextDone[i] = 1;
                    });
                    if (Object.keys(nextDone).length > Object.keys(st.tasksDone).length) {
                      onSound('ok');
                    }
                  }
                  patchBeatState({ xpState: nextXp, tasksDone: nextDone });
                }}
              />
            </div>
          ) : undefined
        }
        footer={
          <div className="rtc-card rounded-2xl bg-[var(--card)]/95 backdrop-blur-md p-3 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handlePrev}
              disabled={stepIdx === 0}
              className="btn-tactile paper min-h-[46px] px-4 whitespace-nowrap"
            >
              <Icon name="back" size={17} />
              <span>Previous</span>
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={!done}
              className={`btn-tactile indigo flex-1 min-h-[46px] whitespace-nowrap ${done ? 'anim-pop' : ''}`}
            >
              <span>{isLast ? 'Finish lesson' : 'Continue'}</span>
              <Icon name="go" size={18} className="ul-arrow" />
            </button>
          </div>
        }
      />
    </div>
  );
}
