import React, { useEffect, useMemo, useState } from 'react';
import type { Question, Topic, TopicTestSession, UserProgress } from '../../types';
import { BOSS_HP, BOSS_TIME, SUBJECT_INFO, mmss, perm, predicted } from '../../utils/engine';
import {
  extractQuestionSpeechScript,
  extractTopicTestIntroSpeechScript,
} from '../../utils/chemVoiceLogic';
import { findQuestion, getTopics } from '../../data/curriculum';
import { typesetMathHtml } from '../../utils/mathTypesetter';
import { buildLiveTeacherPromptForQuestion } from '../../utils/platformUpgradesLogic';
import { DiagramFigure, Icon } from '../Icons';
import { ChemMadScientistBar } from '../ChemMadScientistBar';
import { subjectToLiveCoachMode } from '../../context/LiveCoachContext';
import { AnimatedNumber } from '../AnimatedNumber';
import { SplitWorkbench, SubscreenTopBar } from '../AppShell';
import { SmoothProgressBar } from '../ULessonMotion';
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
  const targetHp = session.targetHp || BOSS_HP;
  const totalTime = session.totalTime || BOSS_TIME;
  const isToughJamb = targetHp > BOSS_HP || totalTime < BOSS_TIME;

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

  const voiceMode = subjectToLiveCoachMode(progress.subj);

  if (session.phase === 'intro') {
    return (
      <div className="max-w-[600px] mx-auto py-4 flex flex-col gap-5 anim-rise">
        <SubscreenTopBar title="Topic test" subtitle={topic.name} onBack={onExit} />
        <section className="rtc-eq-plate p-6 sm:p-7 flex flex-col gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-[16px] tile-peach flex items-center justify-center shrink-0">
              <Icon name="bolt" size={24} />
            </div>
            <div>
              <span className="eyebrow text-[#FFE1D1]">
                {isToughJamb ? 'Tough JAMB condition · Topic test' : 'Topic test'}
              </span>
              <h1 className="h28 text-white">{topic.name}</h1>
            </div>
          </div>
          <p className="text-[15.5px] text-white/90 leading-relaxed">
            Get <strong>{targetHp} out of {session.list.length}</strong> questions right within{' '}
            <strong>{mmss(totalTime)}</strong> to pass this topic.
          </p>
          {isToughJamb && (
            <div className="rounded-[14px] bg-white/12 border border-white/20 px-3.5 py-2.5 text-[13px] text-white/95 leading-snug">
              Trained stricter than UTME so your real exam score matches or beats your practice score. Read every word carefully — options A–D include close look-alike traps.
            </div>
          )}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <div className="rounded-[16px] tile-peach p-3 text-center">
              <div className="text-[12px] font-bold opacity-80">Questions</div>
              <div className="font-[var(--display)] font-bold text-[20px] tabular-nums">
                {session.list.length}
              </div>
            </div>
            <div className="rounded-[16px] tile-mint p-3 text-center">
              <div className="text-[12px] font-bold opacity-80">Pass mark</div>
              <div className="font-[var(--display)] font-bold text-[20px] tabular-nums">
                {targetHp}
              </div>
            </div>
            <div className="rounded-[16px] tile-sky p-3 text-center">
              <div className="text-[12px] font-bold opacity-80">Time limit</div>
              <div className="font-[var(--display)] font-bold text-[20px] tabular-nums">
                {mmss(totalTime)}
              </div>
            </div>
          </div>
        </section>

        <ChemMadScientistBar
          mode={voiceMode}
          variant="compact"
          muted={progress.muted}
          sessionKey={`boss-session|${progress.subj}|${topic.id}`}
          stepKey={`boss-intro|${progress.subj}|${topic.id}`}
          upcomingScripts={bossUpcomingScripts}
          context={{
            topicName: topic.name,
            sectionName: topic.sec,
            stepLabel: `Topic test · ${topic.name}`,
            stepText: extractTopicTestIntroSpeechScript(
              topic,
              targetHp,
              session.list.length,
              progress.subj
            ),
            examTrap: topic.trap,
            goals: topic.goals,
          }}
        />

        <button type="button" onClick={onStartFight} className="btn-tactile indigo w-full">
          <span>Start topic test</span>
          <Icon name="go" size={18} className="ul-arrow" />
        </button>
      </div>
    );
  }

  if (session.phase === 'won' || session.phase === 'lost') {
    const won = session.phase === 'won';
    const topics = getTopics(progress.subj);
    const newPred = predicted(progress, topics);
    const shareText = `I just ${won ? 'passed' : 'practised'} the ${topic.name} topic test on Easy Learn with ${session.hits}/${session.list.length} correct! Subject mastery: ${newPred}%.`;

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
          className={`p-6 sm:p-7 text-center flex flex-col items-center gap-4 ${
            won ? 'rtc-eq-plate' : 'rtc-card border-[var(--bad-line)]'
          }`}
        >
          <div
            className={`w-14 h-14 rounded-[18px] flex items-center justify-center ${
              won ? 'tile-peach' : 'bg-[var(--bad-soft)] text-[var(--coral-ink)]'
            }`}
          >
            <Icon name={won ? 'crown' : 'rev'} size={30} />
          </div>
          <div className="flex flex-col gap-1">
            <span className={`eyebrow ${won ? 'text-[#FFE1D1]' : 'text-[var(--coral-ink)]'}`}>
              {won ? 'Topic passed' : 'Not passed yet'}
            </span>
            <h1 className={`h34 tabular-nums ${won ? 'text-white' : 'text-[var(--ink)]'}`}>
              <AnimatedNumber value={session.hits} duration={680} /> / {targetHp} needed
            </h1>
            <p className={`text-[15px] max-w-md mx-auto ${won ? 'text-white/90' : 'text-[var(--dim)]'}`}>
              {won
                ? `${topic.name} is now marked complete, and your subject mastery stands at ${newPred}%.`
                : 'Read through the questions you missed and try this topic test again when you are ready.'}
            </p>
          </div>

          <div className="w-full max-w-md">
            <SmoothProgressBar
              value={Math.min(targetHp, session.hits)}
              max={targetHp}
              tone="emerald"
              heightClass="h-3"
              trackClass={won ? 'bg-white/20' : 'bg-[var(--deep)]'}
              ariaLabel="Pass mark progress"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 w-full max-w-xs pt-1">
            <div className={`rounded-[16px] p-3 ${won ? 'tile-mint' : 'bg-[var(--bg)] text-[var(--ink)]'}`}>
              <div className="text-[12px] font-bold opacity-80">In a row</div>
              <div className="font-[var(--display)] font-bold text-[20px] tabular-nums">
                {session.best}
              </div>
            </div>
            <div className={`rounded-[16px] p-3 ${won ? 'tile-sky' : 'bg-[var(--bg)] text-[var(--ink)]'}`}>
              <div className="text-[12px] font-bold opacity-80">Time left</div>
              <div className="font-[var(--display)] font-bold text-[20px] tabular-nums">
                {mmss(session.time)}
              </div>
            </div>
          </div>
        </section>

        {(session.res || []).some((entry) => !entry.ok) && (
          <section className="rtc-card p-4 sm:p-5 flex flex-col gap-3.5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="h18 text-[var(--ink)]">Questions you missed</h2>
              <span className="text-[12px] font-bold text-[var(--coral-ink)] tabular-nums">
                {(session.res || []).filter((e) => !e.ok).length} to review
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {(session.res || [])
                .filter((entry) => !entry.ok)
                .map((entry) => {
                  const mq = findQuestion(progress, progress.subj, entry.qid);
                  if (!mq) return null;
                  return (
                    <article
                      key={entry.qid}
                      className="rounded-2xl bg-[var(--bg)] border border-[var(--line)] p-3.5 sm:p-4 flex flex-col gap-2.5"
                    >
                      <div
                        className="text-[14.5px] font-semibold text-[var(--ink)] leading-snug"
                        dangerouslySetInnerHTML={{ __html: typesetMathHtml(mq.q, progress.subj) }}
                      />
                      <div className="flex flex-wrap items-center justify-between gap-2 text-[12.5px]">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-[var(--coral-ink)]">
                            Your choice:{' '}
                            <span
                              dangerouslySetInnerHTML={{
                                __html: typesetMathHtml(mq.o[entry.picked] || '—', progress.subj),
                              }}
                            />
                          </span>
                          <span aria-hidden="true" className="text-[var(--dim)]">·</span>
                          <span className="font-bold text-[var(--green)]">
                            Correct:{' '}
                            <span
                              dangerouslySetInnerHTML={{
                                __html: typesetMathHtml(mq.o[mq.a] || '', progress.subj),
                              }}
                            />
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            window.dispatchEvent(
                              new CustomEvent('rtc:open-live-coach', {
                                detail: {
                                  mode: subjectToLiveCoachMode(progress.subj),
                                  prompt: buildLiveTeacherPromptForQuestion({
                                    subjectName: SUBJECT_INFO[progress.subj].name,
                                    topicName: topic.name,
                                    questionHtml: mq.q,
                                    chosenOptionHtml: mq.o[entry.picked],
                                    correctOptionHtml: mq.o[mq.a] || '',
                                    isCorrect: false,
                                  }),
                                },
                              })
                            );
                          }}
                          className="min-h-[30px] px-2.5 rounded-xl bg-[var(--acc-soft)] border border-[var(--acc-line)] hover:brightness-95 text-[11.5px] font-bold text-[var(--gold)] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                        >
                          <Icon name="phone" size={12} />
                          <span>Ask Live Teacher</span>
                        </button>
                      </div>
                      <div
                        className="text-[13.5px] text-[var(--dim)] leading-relaxed pt-2 border-t border-[var(--line)]"
                        dangerouslySetInnerHTML={{ __html: typesetMathHtml(mq.e, progress.subj) }}
                      />
                    </article>
                  );
                })}
            </div>
          </section>
        )}

        <div className="flex flex-col gap-3">
          {won && (
            <button type="button" onClick={handleCopyShare} className="btn-tactile paper w-full">
              <Icon name="check" size={18} />
              <span>{copied ? 'Result copied!' : 'Copy result to share'}</span>
            </button>
          )}
          {!won && (
            <button type="button" onClick={onRetry} className="btn-tactile indigo w-full">
              <span>Try topic test again</span>
              <Icon name="go" size={18} className="ul-arrow" />
            </button>
          )}
          <button type="button" onClick={onExit} className={`btn-tactile ${won ? 'indigo' : 'paper'} w-full`}>
            <span>Back to topic</span>
          </button>
        </div>
      </div>
    );
  }

  // Active test phase
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
        title={`Topic test · ${topic.name}`}
        subtitle={`Question ${session.i + 1} of ${session.list.length}`}
        onBack={onExit}
        right={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setToolsOpen(true)}
              className="min-h-[34px] px-3 rounded-[14px] bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--gold)] text-[12px] font-bold text-[var(--ink)] flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Icon name="sigma" size={13} className="text-[var(--gold)]" />
              <span>Calculator</span>
            </button>
            {session.combo >= 2 && (
              <span className="px-2.5 py-1 rounded-[12px] tile-peach text-[12px] font-bold tabular-nums whitespace-nowrap">
                {session.combo} in a row
              </span>
            )}
            <span
              className={`min-h-[34px] px-3 rounded-[14px] border text-[13px] font-bold mono tabular-nums inline-flex items-center gap-1.5 whitespace-nowrap ${
                lowTime
                  ? 'bg-[var(--bad-soft)] border-[var(--coral)] text-[var(--coral-ink)] anim-timer-urgent'
                  : 'bg-[var(--card)] border-[var(--line)] text-[var(--ink)]'
              }`}
            >
              <Icon name="clock" size={13.5} className={lowTime ? 'text-[var(--coral-ink)]' : 'text-[var(--gold)]'} />
              <span>{mmss(session.time)}</span>
            </span>
          </div>
        }
      />

      {/* Pass mark progress meter + Segmented Question Pips Rail */}
      <div className="rtc-card px-4 py-3 flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[13px] font-bold whitespace-nowrap">
            <span className="text-[var(--dim)]">
              {isToughJamb ? 'Tough JAMB pass mark' : 'Pass mark'}
            </span>
            <span className="font-[var(--display)] font-bold text-[var(--ink)] tabular-nums">
              {session.hits}/{targetHp} correct
            </span>
          </div>
          <div className="flex-1 max-w-[240px]">
            <SmoothProgressBar
              value={Math.min(targetHp, session.hits)}
              max={targetHp}
              tone="emerald"
              heightClass="h-2.5"
              trackClass="bg-[var(--deep)]"
              ariaLabel="Topic test pass mark"
            />
          </div>
        </div>

        <div
          aria-label="Topic test question progress"
          className="grid gap-1.5"
          style={{ gridTemplateColumns: `repeat(${Math.max(1, session.list.length)}, minmax(0, 1fr))` }}
        >
          {session.list.map((itemQid, idx) => {
            const past = (session.res || [])[idx];
            const isCur = idx === session.i;
            const statusCls = past
              ? past.ok
                ? 'bg-[var(--green)] text-white border-[var(--green)]'
                : 'bg-[var(--coral)] text-white border-[var(--coral)]'
              : isCur
                ? 'bg-[var(--acc-soft)] text-[var(--gold)] border-[var(--gold)]'
                : 'bg-[var(--bg)] text-[var(--dim)] border-[var(--line)]';
            return (
              <div
                key={`${itemQid}-${idx}`}
                className={`h-5 rounded-md border text-[10.5px] font-bold tabular-nums flex items-center justify-center transition-colors ${statusCls}`}
              >
                {past ? (past.ok ? '✓' : '×') : idx + 1}
              </div>
            );
          })}
        </div>
      </div>

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
                  <span className="text-[var(--ink)] truncate">{topic.name}</span>
                </div>
                {!answered && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11.5px] font-semibold text-[var(--dim)] shrink-0">
                    <kbd className="eyak-kbd">A</kbd>–<kbd className="eyak-kbd">D</kbd>
                    <span>answer</span>
                  </span>
                )}
              </div>
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
              <div className="flex flex-col gap-3 anim-explain-reveal">
                <div
                  className={`rounded-[22px] border-2 p-4 sm:p-5 flex flex-col gap-2 ${
                    isRight
                      ? 'bg-[var(--ok-soft)] border-[var(--ok-line)]'
                      : 'bg-[var(--bad-soft)] border-[var(--bad-line)]'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Icon
                        name={isRight ? 'check' : 'x'}
                        size={18}
                        className={isRight ? 'text-[var(--green)]' : 'text-[var(--coral-ink)]'}
                      />
                      <div className="font-[var(--display)] font-bold text-[16px] text-[var(--ink)]">
                        {isRight ? 'Correct!' : 'Not quite — see why:'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        window.dispatchEvent(
                          new CustomEvent('rtc:open-live-coach', {
                            detail: {
                              mode: subjectToLiveCoachMode(progress.subj),
                              prompt: buildLiveTeacherPromptForQuestion({
                                subjectName: SUBJECT_INFO[progress.subj].name,
                                topicName: topic.name,
                                questionHtml: q.q,
                                chosenOptionHtml: session.picked !== null ? q.o[session.picked] : undefined,
                                correctOptionHtml: q.o[q.a] || '',
                                isCorrect: isRight,
                              }),
                            },
                          })
                        );
                      }}
                      className="min-h-[32px] px-3 rounded-xl bg-[var(--card)] border border-[var(--acc-line)] hover:border-[var(--gold)] text-[12px] font-bold text-[var(--gold)] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <Icon name="phone" size={13} />
                      <span>{isRight ? 'Ask for Shortcut' : 'Ask Live Teacher Why'}</span>
                    </button>
                  </div>
                  {!isRight && q.w && q.w[session.picked!] && (
                    <div
                      className="fb text-[14px] text-[var(--ink)] leading-relaxed bg-[var(--card)]/85 rounded-[16px] p-3 border border-[var(--bad-line)]"
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
                <ChemMadScientistBar
                  mode={voiceMode}
                  variant="compact"
                  muted={progress.muted}
                  sessionKey={`boss-session|${progress.subj}|${topic.id}`}
                  stepKey={`boss-ans|${progress.subj}|${q.id}|${session.picked}`}
                  upcomingScripts={bossUpcomingScripts}
                  context={{
                    topicName: topic.name,
                    sectionName: topic.sec,
                    stepLabel: `Topic test · Question ${session.i + 1} explanation`,
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
            <div className="rtc-card p-4 flex flex-col gap-3">
              <span className="eyebrow text-[var(--dim)] px-1">Question diagram</span>
              <DiagramFigure g={q.g} />
            </div>
          ) : undefined
        }
        footer={
          answered ? (
            <button type="button" onClick={onNextQuestion} className="btn-tactile indigo w-full">
              <span>Continue</span>
              <Icon name="go" size={18} className="ul-arrow" />
            </button>
          ) : undefined
        }
      />
      <StudyToolsDrawer open={toolsOpen} onClose={() => setToolsOpen(false)} />
    </div>
  );
}
