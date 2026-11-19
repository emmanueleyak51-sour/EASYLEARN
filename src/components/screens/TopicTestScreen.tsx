import React, { useEffect, useMemo, useState } from 'react';
import type { Question, Topic, TopicTestSession, UserProgress } from '../../types';
import { BOSS_HP, BOSS_TIME, mmss, perm, predicted } from '../../utils/engine';
import {
  extractQuestionSpeechScript,
  extractTopicTestIntroSpeechScript,
} from '../../utils/chemVoiceLogic';
import { findQuestion, getTopics } from '../../data/curriculum';
import { typesetMathHtml } from '../../utils/mathTypesetter';
import { AdirePattern, DiagramFigure, Icon } from '../Icons';
import { ChemMadScientistBar } from '../ChemMadScientistBar';
import { AnimatedNumber } from '../AnimatedNumber';
import { SplitWorkbench, SubscreenTopBar } from '../AppShell';
import { StudyToolsDrawer } from '../StudyToolsDrawer';

export function TopicTestScreen({
  session,
  topic,
  progress,
  onStartFight,
  onPickAnswer,
  onNextQuestion,
  onTick,
  onRetry,
  onExit,
}: {
  session: TopicTestSession;
  topic: Topic;
  progress: UserProgress;
  onStartFight: () => void;
  onPickAnswer: (q: Question, origIdx: number, ok: boolean) => void;
  onNextQuestion: () => void;
  onTick: () => void;
  onRetry: () => void;
  onExit: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [eliminated, setEliminated] = useState<Record<number, boolean>>({});
  const [toolsOpen, setToolsOpen] = useState(false);
  const currentQid = session.list[session.i];

  useEffect(() => {
    setEliminated({});
  }, [currentQid, session.phase]);

  const bossUpcomingScripts = useMemo(() => {
    const out: string[] = [];
    for (const id of session.list.slice(0, 6)) {
      const item = findQuestion(progress, progress.subj, id);
      if (item) {
        const ord = perm(`${topic.id}|boss|${item.id}`, item.o.length);
        out.push(extractQuestionSpeechScript(item, topic.name, item.a, ord));
      }
    }
    return out;
  }, [progress, session.list, topic.id, topic.name]);

  useEffect(() => {
    if (session.phase !== 'fight' || session.picked !== null) return;
    const timer = window.setInterval(() => {
      onTick();
    }, 1000);
    return () => window.clearInterval(timer);
  }, [session.phase, session.picked, onTick]);

  useEffect(() => {
    if (session.phase !== 'fight') return;
    const qItem = findQuestion(progress, progress.subj, session.list[session.i]);
    if (!qItem) return;
    const ord = perm(`${topic.id}|boss|${qItem.id}`, qItem.o.length);
    const isAns = session.picked !== null;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.metaKey || e.ctrlKey || e.altKey) {
        return;
      }
      if (!isAns) {
        const letterIdx = ['A', 'B', 'C', 'D'].indexOf(e.key.toUpperCase());
        const numIdx = ['1', '2', '3', '4'].indexOf(e.key);
        const dispIdx = letterIdx >= 0 ? letterIdx : numIdx;
        if (dispIdx >= 0 && dispIdx < ord.length) {
          e.preventDefault();
          const origIdx = ord[dispIdx];
          onPickAnswer(qItem, origIdx, origIdx === qItem.a);
        }
      } else if (e.key === 'Enter' || e.key === 'ArrowRight') {
        e.preventDefault();
        onNextQuestion();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onNextQuestion, onPickAnswer, progress, session.i, session.list, session.phase, session.picked, topic.id]);

  if (session.phase === 'intro') {
    return (
      <div className="max-w-[600px] mx-auto py-4 flex flex-col gap-5 anim-rise">
        <SubscreenTopBar title="Topic Test" subtitle={topic.name} onBack={onExit} />
        <section className="adire-panel rounded-[26px] p-7 flex flex-col gap-4">
          <AdirePattern />
          <div className="relative z-10 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/15 text-[var(--hero-badge)] flex items-center justify-center shrink-0">
              <Icon name="bolt" size={26} />
            </div>
            <div>
              <span className="eyebrow text-[var(--hero-badge)]">Topic mastery test</span>
              <h1 className="h28 text-white">{topic.boss}</h1>
            </div>
          </div>
          <p className="relative z-10 text-[16px] text-white/90 leading-relaxed">
            Answer <strong>{BOSS_HP} out of {session.list.length}</strong> mastery questions correctly within <strong>{mmss(BOSS_TIME)}</strong> to pass {topic.name}.
          </p>
          <div className="relative z-10 grid grid-cols-3 gap-2.5 pt-1">
            <div className="rounded-xl bg-white/12 p-3 text-center">
              <div className="text-[11px] font-bold uppercase text-white/75">Questions</div>
              <div className="font-[var(--display)] font-extrabold text-[20px] text-white">{session.list.length}</div>
            </div>
            <div className="rounded-xl bg-white/12 p-3 text-center">
              <div className="text-[11px] font-bold uppercase text-white/75">Pass mark</div>
              <div className="font-[var(--display)] font-extrabold text-[20px] text-[var(--hero-badge)]">{BOSS_HP}</div>
            </div>
            <div className="rounded-xl bg-white/12 p-3 text-center">
              <div className="text-[11px] font-bold uppercase text-white/75">Timer</div>
              <div className="font-[var(--display)] font-extrabold text-[20px] text-white">{mmss(BOSS_TIME)}</div>
            </div>
          </div>
        </section>

        <ChemMadScientistBar
          mode={
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
                                  : 'math'
          }
          variant="compact"
          muted={progress.muted}
          sessionKey={`boss-session|${progress.subj}|${topic.id}`}
          stepKey={`boss-intro|${progress.subj}|${topic.id}`}
          upcomingScripts={bossUpcomingScripts}
          context={{
            topicName: topic.name,
            sectionName: topic.sec,
            stepLabel: topic.boss,
            stepText: extractTopicTestIntroSpeechScript(
              topic,
              BOSS_HP,
              session.list.length,
              progress.subj
            ),
            examTrap: topic.trap,
            goals: topic.goals,
          }}
        />

        <button type="button" onClick={onStartFight} className="btn-tactile indigo w-full">
          <span>Start timed test</span>
          <Icon name="go" size={18} />
        </button>
      </div>
    );
  }

  if (session.phase === 'won' || session.phase === 'lost') {
    const won = session.phase === 'won';
    const topics = getTopics(progress.subj);
    const newPred = predicted(progress, topics);
    const shareText = `I just ${won ? 'passed' : 'tackled'} ${topic.boss} (${topic.name}) on EYAK with ${session.hits}/${session.list.length} right! Mastery score: ${newPred}%.`;

    const handleCopyShare = async () => {
      try {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2500);
      } catch {
        setCopied(true);
      }
    };

    return (
      <div className="max-w-[620px] mx-auto py-4 flex flex-col gap-5 anim-rise">
        <section
          className={`rounded-[26px] p-7 text-center flex flex-col items-center gap-3 ${
            won
              ? 'adire-panel'
              : 'rtc-card border-[var(--bad-line)]'
          }`}
        >
          {won && <AdirePattern />}
          <div
            className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg anim-stamp ${
              won ? 'bg-[var(--hero-badge)] text-[#141C33]' : 'bg-[var(--bad-soft)] text-[var(--coral-ink)]'
            }`}
          >
            <Icon name={won ? 'crown' : 'rev'} size={34} />
          </div>
          <div className="relative z-10 flex flex-col gap-1">
            <span className={`eyebrow ${won ? 'text-[var(--hero-badge)]' : 'text-[var(--coral-ink)]'}`}>
              {won ? 'Topic passed!' : 'Not this time'}
            </span>
            <h1 className={`h34 tabular-nums ${won ? 'text-white' : 'text-[var(--ink)]'}`}>
              <AnimatedNumber value={session.hits} /> / {BOSS_HP} target hits
            </h1>
            <p className={`text-[15px] max-w-md mx-auto ${won ? 'text-white/85' : 'text-[var(--dim)]'}`}>
              {won
                ? `${topic.name} is now marked complete, and your mastery score stands at ${newPred}%.`
                : 'Review the questions you missed and try this topic test again when ready.'}
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-3 w-full max-w-xs pt-2">
            <div className={`rounded-xl p-3 ${won ? 'bg-white/12 text-white' : 'bg-[var(--bg)] text-[var(--ink)]'}`}>
              <div className="text-[11px] font-bold uppercase opacity-75">Best combo</div>
              <div className="font-[var(--display)] font-extrabold text-[20px]">{session.best}x</div>
            </div>
            <div className={`rounded-xl p-3 ${won ? 'bg-white/12 text-white' : 'bg-[var(--bg)] text-[var(--ink)]'}`}>
              <div className="text-[11px] font-bold uppercase opacity-75">Time left</div>
              <div className="font-[var(--display)] font-extrabold text-[20px] tabular-nums">{mmss(session.time)}</div>
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-3">
          {won && (
            <button type="button" onClick={handleCopyShare} className="btn-tactile paper w-full">
              <Icon name="check" size={18} />
              <span>{copied ? 'Result summary copied to clipboard!' : 'Copy result to share'}</span>
            </button>
          )}
          {!won && (
            <button type="button" onClick={onRetry} className="btn-tactile indigo w-full">
              <span>Retry topic test</span>
              <Icon name="go" size={18} />
            </button>
          )}
          <button type="button" onClick={onExit} className={`btn-tactile ${won ? 'indigo' : 'paper'} w-full`}>
            <span>Back to topic hub</span>
          </button>
        </div>
      </div>
    );
  }

  // Fight phase
  const qid = session.list[session.i];
  const q = findQuestion(progress, progress.subj, qid);
  if (!q) {
    return null;
  }

  const order = perm(`${topic.id}|boss|${q.id}`, q.o.length);
  const compact = q.o.every((x) => x.replace(/<[^>]+>/g, '').length <= 8);
  const answered = session.picked !== null;
  const isRight = session.result === 'right';
  const lowTime = session.time <= 45;

  return (
    <div className="flex flex-col gap-4 anim-rise">
      <SubscreenTopBar
        title={topic.boss}
        subtitle={`Question ${session.i + 1} of ${session.list.length}`}
        onBack={onExit}
        right={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setToolsOpen(true)}
              className="min-h-[32px] px-2.5 rounded-xl bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--gold)] text-[11.5px] font-bold text-[var(--ink)] flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              <Icon name="sigma" size={13} className="text-[var(--gold)]" />
              <span>Calc &amp; Pad</span>
            </button>
            {session.combo >= 2 && (
              <span
                key={session.combo}
                className="px-2.5 py-1 rounded-full bg-[var(--hero-badge)] text-[#141C33] text-[12px] font-extrabold anim-streak-pop"
              >
                {session.combo}x streak
              </span>
            )}
            <span
              className={`px-3 py-1 rounded-full border text-[13px] font-extrabold tabular-nums ${
                lowTime
                  ? 'bg-[var(--bad-soft)] border-[var(--coral)] text-[var(--coral-ink)] anim-timer-urgent'
                  : 'bg-[var(--card)] border-[var(--line)] text-[var(--ink)]'
              }`}
            >
              {mmss(session.time)}
            </span>
          </div>
        }
      />

      {/* Hits Meter */}
      <div className="rounded-2xl bg-[var(--card)] border border-[var(--line)] p-3 flex items-center justify-between gap-4">
        <span className="text-[13px] font-bold text-[var(--dim)]">Target hits ({session.hits}/{BOSS_HP})</span>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: BOSS_HP }, (_, idx) => (
            <span
              key={idx}
              className={`w-6 h-3 rounded-full transition ${
                idx < session.hits ? 'bg-[var(--green)]' : 'bg-[var(--line)]'
              }`}
            />
          ))}
        </div>
      </div>

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
              <div className="flex flex-col gap-3 anim-explain-reveal">
                <div
                  className={`rounded-2xl border p-4 flex flex-col gap-2 ${
                    isRight
                      ? 'bg-[var(--ok-soft)] border-[var(--ok-line)]'
                      : 'bg-[var(--bad-soft)] border-[var(--bad-line)]'
                  }`}
                >
                  <div className="font-[var(--display)] font-bold text-[15px] text-[var(--ink)]">
                    {isRight ? 'Hit landed!' : 'Missed — keep pushing!'}
                  </div>
                  <div
                    className="fb text-[14px] text-[var(--ink)] leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: typesetMathHtml(q.e, progress.subj) }}
                  />
                </div>
                <ChemMadScientistBar
                  mode={
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
                                          : 'math'
                  }
                  variant="compact"
                  muted={progress.muted}
                  sessionKey={`boss-session|${progress.subj}|${topic.id}`}
                  stepKey={`boss-ans|${progress.subj}|${q.id}|${session.picked}`}
                  upcomingScripts={bossUpcomingScripts}
                  context={{
                    topicName: topic.name,
                    sectionName: topic.sec,
                    stepLabel: `${topic.boss} · Q${session.i + 1} Explanation`,
                    stepText: extractQuestionSpeechScript(q, topic.name, session.picked, order),
                    examTrap: topic.trap,
                  }}
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
            <button type="button" onClick={onNextQuestion} className="btn-tactile indigo w-full">
              <span>Continue</span>
              <Icon name="go" size={18} />
            </button>
          ) : undefined
        }
      />
      <StudyToolsDrawer open={toolsOpen} onClose={() => setToolsOpen(false)} />
    </div>
  );
}
