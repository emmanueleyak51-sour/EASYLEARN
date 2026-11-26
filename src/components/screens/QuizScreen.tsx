import React, { useEffect, useMemo, useState } from 'react';
import type { Question, QuizSession, Topic, UserProgress } from '../../types';
import { SUBJECT_INFO, perm, predicted } from '../../utils/engine';
import { extractQuestionSpeechScript } from '../../utils/chemVoiceLogic';
import { findQuestion, getTopics } from '../../data/curriculum';
import { typesetMathHtml } from '../../utils/mathTypesetter';
import { DiagramFigure, Icon } from '../Icons';
import { ChemMadScientistBar } from '../ChemMadScientistBar';
import { subjectToLiveCoachMode } from '../../context/LiveCoachContext';
import { AnimatedNumber } from '../AnimatedNumber';
import { SplitWorkbench, SubscreenTopBar } from '../AppShell';
import { SmoothProgressBar } from '../ULessonMotion';
import { StudyToolsDrawer } from '../StudyToolsDrawer';
import { buildGuidedQuestionClue, stripHtmlToPlain } from '../../utils/platformUpgradesLogic';

export function QuizScreen({
  session,
  progress,
  topic,
  onPickAnswer,
  onNextQuestion,
  onExit,
}: {
  session: QuizSession;
  progress: UserProgress;
  topic?: Topic;
  onPickAnswer: (q: Question, origIdx: number, ok: boolean) => void;
  onNextQuestion: () => void;
  onExit: () => void;
}) {
  const q = findQuestion(progress, progress.subj, session.cur);
  const [eliminated, setEliminated] = useState<Record<number, boolean>>({});
  const [toolsOpen, setToolsOpen] = useState(false);
  const [clueOpen, setClueOpen] = useState(false);

  useEffect(() => {
    setEliminated({});
    setClueOpen(false);
  }, [session.cur]);

  const upcomingScripts = useMemo(() => {
    const scripts: string[] = [];
    const topicLabel = topic?.name || SUBJECT_INFO[progress.subj].short;
    if (q) {
      const qOrder = perm(q.id, q.o.length);
      scripts.push(extractQuestionSpeechScript(q, topicLabel, q.a, qOrder));
    }
    const futureIds = session.list ? session.list.slice(session.i + 1, session.i + 6) : [];
    for (const fid of futureIds) {
      const fq = findQuestion(progress, progress.subj, fid);
      if (fq) {
        const fOrder = perm(fq.id, fq.o.length);
        scripts.push(extractQuestionSpeechScript(fq, topicLabel, null, fOrder));
      }
    }
    return scripts;
  }, [progress, q, session.i, session.list, topic?.name]);

  useEffect(() => {
    if (!q) return;
    const order = perm(q.id, q.o.length);
    const answered = session.picked !== null;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.metaKey || e.ctrlKey || e.altKey) {
        return;
      }
      if (!answered) {
        const upper = e.key.toUpperCase();
        const letterIdx = ['A', 'B', 'C', 'D'].indexOf(upper);
        const numIdx = ['1', '2', '3', '4'].indexOf(e.key);
        const dispIdx = letterIdx >= 0 ? letterIdx : numIdx;
        if (dispIdx >= 0 && dispIdx < order.length) {
          e.preventDefault();
          const origIdx = order[dispIdx];
          onPickAnswer(q, origIdx, origIdx === q.a);
        }
      } else if (e.key === 'Enter' || e.key === 'ArrowRight') {
        e.preventDefault();
        onNextQuestion();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onNextQuestion, onPickAnswer, q, session.picked]);

  if (!q) {
    return (
      <div className="max-w-[640px] mx-auto py-8 flex flex-col gap-4">
        <SubscreenTopBar title="Question unavailable" onBack={onExit} />
        <div className="rtc-card p-6 text-center">
          <p className="text-[15px] text-[var(--dim)]">Could not load this question.</p>
          <button type="button" onClick={onExit} className="btn-tactile indigo mt-4">
            Return
          </button>
        </div>
      </div>
    );
  }

  const order = perm(q.id, q.o.length);
  const compact = q.o.every((x) => x.replace(/<[^>]+>/g, '').length <= 8);
  const answered = session.picked !== null;
  const isCorrect = answered && session.picked === q.a;
  const voiceMode = subjectToLiveCoachMode(progress.subj);
  const kindLabel =
    session.kind === 'dx'
      ? `${SUBJECT_INFO[progress.subj].short} placement check`
      : session.kind === 'review'
        ? 'Revision'
        : topic?.name || 'Practice';
  const progressPct = Math.round(((session.i + (answered ? 1 : 0)) / Math.max(1, session.n)) * 100);

  const guidedClue = buildGuidedQuestionClue({
    questionHtml: q.q,
    explanationHtml: q.e,
    optionsHtml: q.o,
    correctIndex: q.a,
    topicTrap: topic?.trap,
  });

  const handleAskLiveTeacherWhy = () => {
    const pickedPlain =
      session.picked !== null && q.o[session.picked]
        ? stripHtmlToPlain(q.o[session.picked])
        : '';
    const rightPlain = q.o[q.a] ? stripHtmlToPlain(q.o[q.a]) : '';
    const qPlain = stripHtmlToPlain(q.q);
    const prompt = isCorrect
      ? `I got this ${SUBJECT_INFO[progress.subj].name} question right ("${qPlain}" -> "${rightPlain}"). Give me one quick exam shortcut so I solve similar questions even faster.`
      : `Help me understand why "${pickedPlain}" is wrong and why "${rightPlain}" is right for: "${qPlain}".`;
    window.dispatchEvent(
      new CustomEvent('rtc:open-live-coach', {
        detail: { mode: voiceMode, prompt },
      })
    );
  };

  return (
    <div className="flex flex-col gap-4 anim-rise">
      <SubscreenTopBar
        title={kindLabel}
        subtitle={`Question ${session.i + 1} of ${session.n}`}
        onBack={onExit}
        right={
          <div className="flex items-center gap-2 text-[12.5px] font-bold text-[var(--dim)] tabular-nums">
            {session.run >= 2 && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[var(--gold)] whitespace-nowrap">
                <Icon name="flame" size={13} />
                <span>{session.run} in a row</span>
              </span>
            )}
            <button
              type="button"
              onClick={() => setToolsOpen(true)}
              className="min-h-[34px] px-3 rounded-[14px] bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--gold)] text-[12px] font-bold text-[var(--ink)] flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Icon name="sigma" size={13} className="text-[var(--gold)]" />
              <span>Calculator</span>
            </button>
            <span className="text-[var(--ink)]">{session.right} right</span>
          </div>
        }
      />

      {/* Segmented Question Pips Rail */}
      <div
        role="group"
        aria-label={`Question ${session.i + 1} of ${session.n}, ${progressPct}% complete`}
        className="grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${Math.max(1, session.n)}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: Math.max(1, session.n) }).map((_, idx) => {
          const pastEntry = idx < session.res.length ? session.res[idx] : undefined;
          const pastVerdict = pastEntry ? pastEntry[1] : undefined;
          const isCurrent = idx === session.i;
          let barClass = 'bg-[var(--deep)]';
          if (pastVerdict === 1 || (isCurrent && answered && isCorrect)) {
            barClass = 'bg-[var(--green)]';
          } else if (pastVerdict === 0 || (isCurrent && answered && !isCorrect)) {
            barClass = 'bg-[var(--coral-ink)]';
          } else if (isCurrent) {
            barClass = 'bg-[var(--gold)]';
          }
          return <div key={idx} className={`h-2.5 rounded-full transition-colors ${barClass}`} />;
        })}
      </div>

      <ChemMadScientistBar
        mode={voiceMode}
        variant="compact"
        muted={progress.muted}
        sessionKey={`quiz-session|${session.kind}|${progress.subj}|${session.tid || 'all'}`}
        stepKey={`quiz|${progress.subj}|${q.id}|${answered ? `ans-${session.picked}` : 'ask'}`}
        upcomingScripts={upcomingScripts}
        context={{
          topicName: topic?.name || SUBJECT_INFO[progress.subj].name,
          sectionName: topic?.sec || kindLabel,
          stepLabel: answered ? 'Answer explanation' : `Question ${session.i + 1} of ${session.n}`,
          stepText: extractQuestionSpeechScript(
            q,
            topic?.name || SUBJECT_INFO[progress.subj].short,
            session.picked,
            order
          ),
          examTrap: topic?.trap,
        }}
      />

      <SplitWorkbench
        hasRightPane={!!q.g}
        left={
          <div key={q.id} className="flex flex-col gap-4 anim-q-fwd">
            <div className="rtc-card p-5 sm:p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-[var(--line)]">
                <div className="flex items-center gap-2 text-[12.5px] font-bold min-w-0">
                  <span className="font-[var(--display)] font-bold text-[var(--gold)] tabular-nums">
                    Question {session.i + 1}
                  </span>
                  <span className="text-[var(--dim)]" aria-hidden="true">·</span>
                  <span className="text-[var(--ink)] truncate">{kindLabel}</span>
                </div>
                {!answered && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      aria-expanded={clueOpen}
                      onClick={() => setClueOpen((v) => !v)}
                      className={`min-h-[30px] px-2.5 rounded-lg border text-[11.5px] font-bold inline-flex items-center gap-1 cursor-pointer transition whitespace-nowrap ${
                        clueOpen
                          ? 'bg-[var(--acc-soft)] border-[var(--acc-line)] text-[var(--gold)]'
                          : 'bg-[var(--bg)] border-[var(--line)] text-[var(--ink)] hover:border-[var(--acc-line)]'
                      }`}
                    >
                      <Icon name="key" size={12} className="text-[var(--gold)]" />
                      <span>{clueOpen ? 'Hide Clue' : 'Examiner Clue'}</span>
                    </button>
                    <span className="hidden sm:inline-flex items-center gap-1 text-[11.5px] font-semibold text-[var(--dim)]">
                      <kbd className="eyak-kbd">A</kbd>–<kbd className="eyak-kbd">D</kbd>
                    </span>
                  </div>
                )}
              </div>
              {clueOpen && !answered && (
                <div className="rounded-xl bg-[var(--bg)] border border-[var(--acc-line)] px-3.5 py-3 text-[13px] flex flex-col gap-1">
                  <span className="font-bold text-[var(--gold)] text-[11.5px]">
                    First-Principles Clue
                  </span>
                  <p className="text-[var(--ink)] leading-snug">{guidedClue.principle}</p>
                  {guidedClue.trapNote && (
                    <p className="text-[12px] text-[var(--dim)] leading-snug">
                      Watch trap: {guidedClue.trapNote}
                    </p>
                  )}
                </div>
              )}
              <div
                className="qt text-[var(--ink)]"
                dangerouslySetInnerHTML={{ __html: typesetMathHtml(q.q, progress.subj) }}
              />
              {q.g && (
                <div className="min-[980px]:hidden">
                  <DiagramFigure g={q.g} />
                </div>
              )}
            </div>

            <div className={compact ? 'two grid grid-cols-2 gap-3' : 'flex flex-col gap-2.5'}>
              {order.map((origIdx, dispIdx) => {
                const isThisPicked = session.picked === origIdx;
                const isRightOpt = origIdx === q.a;
                const isCrossed = !!eliminated[origIdx] && !answered;
                let stateCls = '';
                if (answered) {
                  if (isRightOpt) stateCls = 'ok';
                  else if (isThisPicked) stateCls = 'no';
                  else stateCls = 'opt-eliminated';
                }
                const optLetter = String.fromCharCode(65 + dispIdx);
                return compact ? (
                  <button
                    key={origIdx}
                    type="button"
                    disabled={answered}
                    onClick={() => onPickAnswer(q, origIdx, origIdx === q.a)}
                    className={`opt-tile ${stateCls}`}
                  >
                    <span className="opt-bubble">
                      <span>{optLetter}</span>
                    </span>
                    <span
                      className="opt flex-1 text-left"
                      dangerouslySetInnerHTML={{
                        __html: typesetMathHtml(q.o[origIdx], progress.subj),
                      }}
                    />
                  </button>
                ) : (
                  <div key={origIdx} className="flex items-stretch gap-2">
                    <button
                      type="button"
                      disabled={answered}
                      onClick={() => onPickAnswer(q, origIdx, origIdx === q.a)}
                      className={`opt-tile flex-1 ${stateCls} ${isCrossed ? 'opacity-45' : ''}`}
                    >
                      <span className="opt-bubble">
                        <span>{optLetter}</span>
                      </span>
                      <span
                        className={`flex-1 ${isCrossed ? 'line-through text-[var(--dim)]' : ''}`}
                        dangerouslySetInnerHTML={{
                          __html: typesetMathHtml(q.o[origIdx], progress.subj),
                        }}
                      />
                    </button>

                    {!answered && (
                      <button
                        type="button"
                        aria-pressed={isCrossed}
                        aria-label={
                          isCrossed
                            ? `Restore option ${optLetter}`
                            : `Cross out option ${optLetter}`
                        }
                        title={isCrossed ? 'Restore option' : 'Cross out wrong option'}
                        onClick={() =>
                          setEliminated((prev) => ({ ...prev, [origIdx]: !prev[origIdx] }))
                        }
                        className={`w-11 rounded-[22px] border-2 flex items-center justify-center transition cursor-pointer shrink-0 ${
                          isCrossed
                            ? 'bg-[var(--bad-soft)] border-[var(--bad-line)] text-[var(--coral-ink)]'
                            : 'bg-[var(--card)] border-[var(--line)] text-[var(--dim)] hover:text-[var(--ink)] hover:border-[var(--acc-line)]'
                        }`}
                      >
                        <Icon name="x" size={14} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {answered && (
              <div
                className={`rounded-[22px] border-2 p-4 sm:p-5 flex flex-col gap-2 anim-explain-reveal ${
                  isCorrect
                    ? 'bg-[var(--ok-soft)] border-[var(--ok-line)]'
                    : 'bg-[var(--bad-soft)] border-[var(--bad-line)]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Icon
                      name={isCorrect ? 'check' : 'x'}
                      size={18}
                      className={isCorrect ? 'text-[var(--green)]' : 'text-[var(--coral-ink)]'}
                    />
                    <span className="font-[var(--display)] font-bold text-[16px] text-[var(--ink)]">
                      {isCorrect ? 'Spot on!' : 'Not quite — see why:'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAskLiveTeacherWhy}
                    className="min-h-[32px] px-3 rounded-xl bg-[var(--card)] border border-[var(--line)] hover:border-[var(--acc-line)] text-[12px] font-bold text-[var(--ink)] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <Icon name="phoneCall" size={13} className="text-[var(--gold)]" />
                    <span>{isCorrect ? 'Ask for Shortcut' : 'Ask Live Teacher Why'}</span>
                  </button>
                </div>
                {!isCorrect && q.w && q.w[session.picked!] && (
                  <div
                    className="fb text-[14.5px] text-[var(--ink)] leading-relaxed bg-[var(--card)]/85 rounded-[16px] p-3 border border-[var(--bad-line)]"
                    dangerouslySetInnerHTML={{
                      __html: typesetMathHtml(q.w[session.picked!], progress.subj),
                    }}
                  />
                )}
                <div
                  className="fb text-[14.5px] text-[var(--ink)] leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: typesetMathHtml(q.e, progress.subj) }}
                />
              </div>
            )}
          </div>
        }
        right={
          q.g ? (
            <div className="rtc-card p-4 flex flex-col gap-3">
              <span className="eyebrow text-[var(--dim)] px-1">Question diagram</span>
              <DiagramFigure g={q.g} />
            </div>
          ) : undefined
        }
        footer={
          answered ? (
            <div className="pt-1">
              <button type="button" onClick={onNextQuestion} className="btn-tactile indigo w-full">
                <span>{session.i + 1 >= session.n ? 'See results' : 'Next question'}</span>
                <Icon name="go" size={18} className="ul-arrow" />
              </button>
            </div>
          ) : undefined
        }
      />
      <StudyToolsDrawer open={toolsOpen} onClose={() => setToolsOpen(false)} />
    </div>
  );
}

export function SummaryScreen({
  session,
  progress,
  topic,
  onTakeTopicTest,
  onPracticeAgain,
  onDone,
}: {
  session: QuizSession;
  progress: UserProgress;
  topic?: Topic;
  onTakeTopicTest: () => void;
  onPracticeAgain: () => void;
  onDone: () => void;
}) {
  const topics = getTopics(progress.subj);
  const newPred = predicted(progress, topics);
  const predDelta = newPred - session.pred0;
  const accuracy = Math.round((session.right / Math.max(1, session.n)) * 100);
  const title =
    session.kind === 'dx'
      ? 'Placement check finished'
      : session.kind === 'review'
        ? 'Revision finished'
        : `${topic?.name || 'Practice'} finished`;

  return (
    <div className="max-w-[640px] mx-auto py-4 flex flex-col gap-5 anim-rise">
      <section className="rtc-eq-plate p-6 sm:p-7 text-center flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-[18px] tile-peach flex items-center justify-center">
          <Icon name={accuracy >= 70 ? 'crown' : 'target'} size={28} />
        </div>
        <div className="flex flex-col gap-1">
          <span className="eyebrow text-[#FFE1D1]">{title}</span>
          <h1 className="h34 text-white tabular-nums">
            <AnimatedNumber value={session.right} duration={680} /> / {session.n} correct
          </h1>
          <p className="text-[15px] text-white/90 max-w-md mx-auto">
            {accuracy >= 80
              ? 'Great work — you handled these questions cleanly.'
              : accuracy >= 50
                ? 'Good progress — any missed questions were saved for revision.'
                : 'Keep going — missed questions are saved in Mistakes to fix with step-by-step explanations.'}
          </p>
        </div>

        <div className="w-full max-w-md">
          <SmoothProgressBar
            value={accuracy}
            max={100}
            tone="emerald"
            heightClass="h-3"
            trackClass="bg-white/20"
            ariaLabel="Accuracy"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 w-full max-w-sm pt-1">
          <div className="rounded-[16px] tile-mint p-3">
            <div className="text-[12px] font-bold opacity-80">Subject mastery</div>
            <div className="font-[var(--display)] font-bold text-[22px] tabular-nums">
              <AnimatedNumber value={newPred} duration={680} suffix="%" />
            </div>
          </div>
          <div className="rounded-[16px] tile-sky p-3">
            <div className="text-[12px] font-bold opacity-80">Change</div>
            <div className="font-[var(--display)] font-bold text-[22px] tabular-nums">
              {predDelta >= 0 ? `+${predDelta}%` : `${predDelta}%`}
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-3">
        {session.kind === 'practice' && topic && (
          <button type="button" onClick={onTakeTopicTest} className="btn-tactile indigo w-full">
            <span>Take topic test</span>
            <Icon name="go" size={18} className="ul-arrow" />
          </button>
        )}
        {session.kind === 'practice' && (
          <button type="button" onClick={onPracticeAgain} className="btn-tactile paper w-full">
            <span>Practise another 6 questions</span>
          </button>
        )}
        <button type="button" onClick={onDone} className="btn-tactile paper w-full">
          <span>{session.kind === 'practice' && topic ? 'Back to topic' : 'Back to Home'}</span>
        </button>
      </div>
    </div>
  );
}
