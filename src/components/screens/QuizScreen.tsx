import React, { useEffect, useMemo, useState } from 'react';
import type { Question, QuizSession, Topic, UserProgress } from '../../types';
import { SUBJECT_INFO, perm, predicted } from '../../utils/engine';
import { extractQuestionSpeechScript } from '../../utils/chemVoiceLogic';
import { findQuestion, getTopics } from '../../data/curriculum';
import { typesetMathHtml } from '../../utils/mathTypesetter';
import { AdirePattern, DiagramFigure, Icon } from '../Icons';
import { ChemMadScientistBar } from '../ChemMadScientistBar';
import { AnimatedNumber } from '../AnimatedNumber';
import { SplitWorkbench, SubscreenTopBar } from '../AppShell';
import { SmoothProgressBar } from '../ULessonMotion';
import { StudyToolsDrawer } from '../StudyToolsDrawer';

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

  useEffect(() => {
    setEliminated({});
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
        <SubscreenTopBar title="Question Unavailable" onBack={onExit} />
        <div className="rounded-2xl bg-[var(--card)] border border-[var(--line)] p-6 text-center">
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
  const kindLabel =
    session.kind === 'dx'
      ? `${SUBJECT_INFO[progress.subj].short} Diagnostic`
      : session.kind === 'review'
        ? 'Spaced Review'
        : topic?.name || 'Practice';
  const progressPct = Math.round(((session.i + (answered ? 1 : 0)) / Math.max(1, session.n)) * 100);

  return (
    <div className="flex flex-col gap-4 anim-rise">
      <SubscreenTopBar
        title={kindLabel}
        subtitle={`Question ${session.i + 1} of ${session.n}`}
        onBack={onExit}
        right={
          <div className="flex items-center gap-2 text-[12.5px] font-extrabold text-[var(--dim)] tabular-nums">
            <button
              type="button"
              onClick={() => setToolsOpen(true)}
              className="min-h-[32px] px-2.5 rounded-xl bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--gold)] text-[11.5px] font-bold text-[var(--ink)] flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              <Icon name="sigma" size={13} className="text-[var(--gold)]" />
              <span>Calc &amp; Pad</span>
            </button>
            {session.kind === 'practice' && (
              <>
                <span className="text-[var(--gold)]">Level {q.l}/5</span>
                <span aria-hidden="true">·</span>
              </>
            )}
            <span className="text-[var(--ink)]">{session.right} right</span>
          </div>
        }
      />

      {/* Smooth GPU Progress Track */}
      <SmoothProgressBar
        value={progressPct}
        max={100}
        tone="indigo"
        heightClass="h-2"
        trackClass="bg-[var(--deep)]"
        ariaLabel="Quiz progress"
      />

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
          stepLabel: answered ? 'Worked Answer Explanation' : `Question ${session.i + 1} of ${session.n}`,
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
          <div key={q.id} className="flex flex-col gap-4 anim-q-enter">
            <div className="rtc-card rounded-2xl p-5 flex flex-col gap-4">
              <div
                className="qt text-[var(--ink)]"
                dangerouslySetInnerHTML={{ __html: typesetMathHtml(q.q, progress.subj) }}
              />
              {q.g && (
                <div className="min-[980px]:hidden">
                  <DiagramFigure g={q.g} />
                </div>
              )}
              {!answered && !compact && (
                <div className="flex items-center justify-between gap-2 text-[11.5px] font-semibold text-[var(--dim)] pt-1 border-t border-[var(--line)]/60">
                  <span>Tip: Cross out tricky distractors with ✕ before choosing</span>
                  <span className="hidden sm:inline">Keys: A–D to answer</span>
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
                  else if (isThisPicked) stateCls = 'no anim-shake';
                  else stateCls = 'opt-eliminated';
                }
                const optLetter = String.fromCharCode(65 + dispIdx);
                return compact ? (
                  <button
                    key={origIdx}
                    type="button"
                    disabled={answered}
                    onClick={() => onPickAnswer(q, origIdx, origIdx === q.a)}
                    className={`opt-tile two-col ${stateCls}`}
                  >
                    <span
                      className="opt"
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
                      <span className="w-7 h-7 rounded-lg bg-[var(--deep)] border border-[var(--line)] font-extrabold text-[13px] flex items-center justify-center shrink-0">
                        {optLetter}
                      </span>
                      <span
                        className={`flex-1 ${isCrossed ? 'line-through text-[var(--dim)]' : ''}`}
                        dangerouslySetInnerHTML={{
                          __html: typesetMathHtml(q.o[origIdx], progress.subj),
                        }}
                      />
                      {answered && isRightOpt && (
                        <Icon name="check" size={18} className="text-[var(--green)] shrink-0 anim-check-draw" />
                      )}
                    </button>

                    {!answered && (
                      <button
                        type="button"
                        aria-pressed={isCrossed}
                        aria-label={
                          isCrossed
                            ? `Restore option ${optLetter}`
                            : `Eliminate option ${optLetter}`
                        }
                        title={isCrossed ? 'Restore option' : 'Cross out distractor'}
                        onClick={() =>
                          setEliminated((prev) => ({ ...prev, [origIdx]: !prev[origIdx] }))
                        }
                        className={`w-10 rounded-2xl border flex items-center justify-center transition cursor-pointer shrink-0 ${
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
                className={`rounded-2xl border p-4 sm:p-5 flex flex-col gap-2 anim-explain-reveal ${
                  isCorrect
                    ? 'bg-[var(--ok-soft)] border-[var(--ok-line)]'
                    : 'bg-[var(--bad-soft)] border-[var(--bad-line)]'
                }`}
              >
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
                {!isCorrect && q.w && q.w[session.picked!] && (
                  <div
                    className="fb text-[14.5px] text-[var(--ink)] leading-relaxed bg-[var(--card)]/85 rounded-xl p-3 border border-[var(--bad-line)]"
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
            <div className="rtc-card rounded-[20px] p-4 flex flex-col gap-3">
              <span className="eyebrow text-[var(--dim)] px-1">Question Diagram</span>
              <DiagramFigure g={q.g} />
            </div>
          ) : undefined
        }
        footer={
          answered ? (
            <div className="pt-1">
              <button type="button" onClick={onNextQuestion} className="btn-tactile indigo w-full">
                <span>{session.i + 1 >= session.n ? 'See results' : 'Next question'}</span>
                <Icon name="go" size={18} />
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
      ? 'Diagnostic Complete'
      : session.kind === 'review'
        ? 'Review Session Done'
        : `${topic?.name || 'Practice'} Complete`;

  return (
    <div className="max-w-[640px] mx-auto py-4 flex flex-col gap-5 anim-rise">
      <section className="adire-panel rounded-[26px] p-7 text-center flex flex-col items-center gap-3">
        <AdirePattern />
        <div className="relative z-10 w-16 h-16 rounded-2xl bg-[var(--hero-badge)] text-[#141C33] flex items-center justify-center shadow-lg anim-stamp">
          <Icon name={accuracy >= 70 ? 'crown' : 'target'} size={32} />
        </div>
        <div className="relative z-10 flex flex-col gap-1">
          <span className="eyebrow text-[var(--hero-badge)]">{title}</span>
          <h1 className="h34 text-white tabular-nums">
            <AnimatedNumber value={session.right} /> / {session.n} correct
          </h1>
          <p className="text-[15px] text-white/85">
            {accuracy >= 80
              ? 'Sharp work! You’re commanding these questions cleanly.'
              : accuracy >= 50
                ? 'Solid effort — missed questions were added to your spaced review.'
                : 'Keep going — every missed question is queued for review so it clicks next time.'}
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-3 w-full max-w-sm pt-2">
          <div className="rounded-2xl bg-white/12 border border-white/15 p-3">
            <div className="text-[11px] font-bold uppercase text-white/75">Mastery Score</div>
            <div className="font-[var(--display)] font-extrabold text-[22px] text-white tabular-nums">
              <AnimatedNumber value={newPred} suffix="%" />
            </div>
          </div>
          <div className="rounded-2xl bg-white/12 border border-white/15 p-3">
            <div className="text-[11px] font-bold uppercase text-white/75">Movement</div>
            <div className="font-[var(--display)] font-extrabold text-[22px] text-[var(--hero-badge)] tabular-nums">
              {predDelta >= 0 ? `+${predDelta}%` : `${predDelta}%`}
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-3">
        {session.kind === 'practice' && topic && (
          <button type="button" onClick={onTakeTopicTest} className="btn-tactile indigo w-full">
            <span>Take topic test ({topic.boss})</span>
            <Icon name="go" size={18} />
          </button>
        )}
        {session.kind === 'practice' && (
          <button type="button" onClick={onPracticeAgain} className="btn-tactile paper w-full">
            <span>Practise another 6 questions</span>
          </button>
        )}
        <button type="button" onClick={onDone} className="btn-tactile paper w-full">
          <span>{session.kind === 'practice' && topic ? 'Back to topic hub' : 'Back to Home'}</span>
        </button>
      </div>
    </div>
  );
}
