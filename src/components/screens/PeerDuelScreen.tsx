import React, { useEffect, useMemo, useState } from 'react';
import type { Question, SubjectId, UserProgress } from '../../types';
import { SUBJECT_IDS, getTopics } from '../../data/curriculum';
import { SUBJECT_INFO, mmss } from '../../utils/engine';
import {
  buildDuelQuestions,
  buildDuelShareUrl,
  createDuelCode,
  parseDuelCode,
  type PeerDuelSpec,
} from '../../utils/peerDuelLogic';
import { useCloudSync, type CloudDuelEntry } from '../../context/CloudSyncContext';
import { typesetMathHtml } from '../../utils/mathTypesetter';
import { SubscreenTopBar } from '../AppShell';
import { DiagramFigure, Icon } from '../Icons';
import { StudyToolsDrawer } from '../StudyToolsDrawer';

const DUEL_DURATION_SEC = 300; // 5-minute 10-question sprint

export function PeerDuelScreen({
  progress,
  initialDuelCode,
  onCompleteDuel,
  onBack,
}: {
  progress: UserProgress;
  initialDuelCode?: string | null;
  onCompleteDuel: (payload: {
    spec: PeerDuelSpec;
    score: number;
    total: number;
    timeSec: number;
    missedQuestions: { q: Question; subj: SubjectId; pickedIdx: number }[];
  }) => void;
  onBack: () => void;
}) {
  const { user, publishDuelAndScore, loadDuelEntries, signInWithGoogle } = useCloudSync();

  const [selectedSubj, setSelectedSubj] = useState<SubjectId>(progress.subj);
  const [subjectSearch, setSubjectSearch] = useState('');
  const [joinCodeInput, setJoinCodeInput] = useState<string>(initialDuelCode || '');
  const [joinError, setJoinError] = useState<string | null>(null);
  const [copiedMsg, setCopiedMsg] = useState<string | null>(null);

  const visibleDuelSubjects = useMemo(() => {
    const q = subjectSearch.trim().toLowerCase();
    const list = SUBJECT_IDS.filter((sid) => {
      if (!q) return true;
      return (
        SUBJECT_INFO[sid].name.toLowerCase().includes(q) ||
        SUBJECT_INFO[sid].short.toLowerCase().includes(q)
      );
    });
    return [...list].sort((a, b) => {
      const aRank = a === selectedSubj ? 0 : progress.subjs.includes(a) ? 1 : 2;
      const bRank = b === selectedSubj ? 0 : progress.subjs.includes(b) ? 1 : 2;
      return aRank - bRank;
    });
  }, [subjectSearch, selectedSubj, progress.subjs]);

  const [activeSpec, setActiveSpec] = useState<PeerDuelSpec | null>(() =>
    initialDuelCode ? parseDuelCode(initialDuelCode) : null
  );
  const [phase, setPhase] = useState<'lobby' | 'active' | 'result'>('lobby');
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [missedList, setMissedList] = useState<{ q: Question; subj: SubjectId; pickedIdx: number }[]>([]);
  const [timeLeft, setTimeLeft] = useState(DUEL_DURATION_SEC);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [cloudEntries, setCloudEntries] = useState<CloudDuelEntry[]>([]);
  const [loadingBoard, setLoadingBoard] = useState(false);

  const duelQuestions = useMemo(() => {
    if (!activeSpec) return [];
    return buildDuelQuestions(activeSpec, progress, getTopics(activeSpec.subj));
  }, [activeSpec, progress]);

  useEffect(() => {
    if (initialDuelCode) {
      const parsed = parseDuelCode(initialDuelCode);
      if (parsed) {
        setActiveSpec(parsed);
        setJoinCodeInput(parsed.code);
      }
    }
  }, [initialDuelCode]);

  // Load cloud leaderboard whenever viewing a duel result or spec while signed in
  useEffect(() => {
    if (!activeSpec || !user) {
      setCloudEntries([]);
      return;
    }
    let alive = true;
    setLoadingBoard(true);
    void loadDuelEntries(activeSpec.code).then((list) => {
      if (alive) {
        setCloudEntries(list);
        setLoadingBoard(false);
      }
    });
    return () => {
      alive = false;
    };
  }, [activeSpec, user, phase, loadDuelEntries]);

  // Countdown timer during active sprint
  useEffect(() => {
    if (phase !== 'active') return;
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

  // Auto-finish if timer hits 0
  useEffect(() => {
    if (phase === 'active' && timeLeft === 0 && activeSpec) {
      finishDuel(score, missedList, DUEL_DURATION_SEC);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, timeLeft]);

  const finishDuel = (
    finalScore: number,
    finalMissed: { q: Question; subj: SubjectId; pickedIdx: number }[],
    usedSec: number
  ) => {
    if (!activeSpec) return;
    setElapsedSec(usedSec);
    setPhase('result');
    onCompleteDuel({
      spec: activeSpec,
      score: finalScore,
      total: duelQuestions.length,
      timeSec: usedSec,
      missedQuestions: finalMissed,
    });
    if (user) {
      void publishDuelAndScore(
        activeSpec,
        progress.name || user.displayName || 'Scholar',
        finalScore,
        duelQuestions.length,
        usedSec
      ).then(() => {
        void loadDuelEntries(activeSpec.code).then(setCloudEntries);
      });
    }
  };

  const handleCreateDuel = () => {
    const spec = createDuelCode(selectedSubj);
    setActiveSpec(spec);
    setJoinCodeInput(spec.code);
    setJoinError(null);
  };

  const handleJoinCode = () => {
    const parsed = parseDuelCode(joinCodeInput);
    if (!parsed) {
      setJoinError('Enter a valid challenge code like RTC-CHM-7K2M9P.');
      return;
    }
    setActiveSpec(parsed);
    setJoinError(null);
  };

  const startDuelSprint = () => {
    if (!activeSpec || !duelQuestions.length) return;
    setIdx(0);
    setPicked(null);
    setScore(0);
    setMissedList([]);
    setTimeLeft(DUEL_DURATION_SEC);
    setElapsedSec(0);
    setPhase('active');
  };

  const handleCopyShare = async (mode: 'link' | 'code') => {
    if (!activeSpec) return;
    const text = mode === 'link' ? buildDuelShareUrl(activeSpec.code) : activeSpec.code;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMsg(mode === 'link' ? 'Share link copied!' : 'Duel code copied!');
      window.setTimeout(() => setCopiedMsg(null), 2400);
    } catch {
      setCopiedMsg(`Code: ${activeSpec.code}`);
    }
  };

  const currentItem = duelQuestions[idx];

  const handlePickOption = (origIdx: number) => {
    if (!currentItem || picked !== null || !activeSpec) return;
    setPicked(origIdx);
    const ok = origIdx === currentItem.q.a;
    if (ok) {
      setScore((s) => s + 1);
    } else {
      setMissedList((prev) => [...prev, { q: currentItem.q, subj: activeSpec.subj, pickedIdx: origIdx }]);
    }
  };

  const handleNext = () => {
    if (!activeSpec) return;
    if (idx + 1 >= duelQuestions.length) {
      finishDuel(score, missedList, Math.max(1, DUEL_DURATION_SEC - timeLeft));
      return;
    }
    setIdx((i) => i + 1);
    setPicked(null);
  };

  return (
    <div className="flex flex-col gap-5 anim-rise">
      <SubscreenTopBar
        title="Duels"
        subtitle={
          phase === 'active' && activeSpec
            ? `${activeSpec.code} · Question ${idx + 1} of ${duelQuestions.length}`
            : '10-question timed race you can share with friends'
        }
        onBack={() => {
          if (phase === 'active') setPhase('lobby');
          else onBack();
        }}
        right={
          phase === 'active' ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setToolsOpen(true)}
                className="min-h-[34px] px-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--gold)] text-[12px] font-bold text-[var(--ink)] flex items-center gap-1.5 cursor-pointer"
              >
                <Icon name="sigma" size={14} className="text-[var(--gold)]" />
                <span>Calculator</span>
              </button>
              <span
                className={`px-3 py-1 rounded-full border text-[13px] font-extrabold mono ${
                  timeLeft <= 45
                    ? 'bg-[var(--bad-soft)] border-[var(--coral)] text-[var(--coral-ink)]'
                    : 'bg-[var(--card)] border-[var(--line)] text-[var(--ink)]'
                }`}
              >
                {mmss(timeLeft)}
              </span>
            </div>
          ) : undefined
        }
      />

      {/* ═══════════════════ LOBBY ═══════════════════ */}
      {phase === 'lobby' && (
        <div className="grid grid-cols-1 min-[860px]:grid-cols-12 gap-5">
          {/* Create or Join Challenge */}
          <section className="min-[860px]:col-span-7 rtc-card rounded-2xl p-5 sm:p-6 flex flex-col gap-5">
            <div>
              <span className="eyebrow text-[var(--gold)]">10-question timed duel</span>
              <h2 className="h20 text-[var(--ink)]">Pick a subject and create a duel code</h2>
              <p className="text-[13.5px] text-[var(--dim)] mt-0.5">
                Every friend who enters your code gets the exact same 10 questions in the same order.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <input
                type="search"
                value={subjectSearch}
                onChange={(e) => setSubjectSearch(e.target.value)}
                aria-label="Search duel subjects"
                placeholder="Find any of 49 subjects..."
                className="w-full min-h-[38px] px-3.5 rounded-xl bg-[var(--bg)] border border-[var(--line)] focus:border-[var(--gold)] text-[13.5px] font-medium text-[var(--ink)] outline-none"
              />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[220px] overflow-y-auto pr-0.5">
                {visibleDuelSubjects.map((sid) => {
                  const active = selectedSubj === sid;
                  return (
                    <button
                      key={sid}
                      type="button"
                      onClick={() => setSelectedSubj(sid)}
                      className={`min-h-[38px] px-2.5 rounded-xl border text-[12.5px] font-bold flex items-center gap-1.5 cursor-pointer transition ${
                        active
                          ? 'bg-[var(--acc-soft)] border-[var(--gold)] text-[var(--ink)]'
                          : 'bg-[var(--bg)] border-[var(--line)] text-[var(--dim)] hover:text-[var(--ink)]'
                      }`}
                    >
                      <Icon name={SUBJECT_INFO[sid].icon} size={14} className="text-[var(--gold)] shrink-0" />
                      <span className="truncate">{SUBJECT_INFO[sid].compact}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button type="button" onClick={handleCreateDuel} className="btn-tactile indigo w-full">
              <Icon name="bolt" size={17} />
              <span>Create {SUBJECT_INFO[selectedSubj].short} duel code</span>
            </button>

            <div className="pt-4 border-t border-[var(--line)] flex flex-col gap-2.5">
              <label htmlFor="duel-code-input" className="text-[13px] font-bold text-[var(--ink)]">
                Or enter a friend’s duel code
              </label>
              <div className="flex gap-2">
                <input
                  id="duel-code-input"
                  type="text"
                  value={joinCodeInput}
                  onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                  placeholder="e.g. RTC-CHM-7K2M9P"
                  className="flex-1 rounded-xl bg-[var(--bg)] border border-[var(--line)] px-3.5 py-2.5 mono text-[14px] font-bold text-[var(--ink)] focus:outline-none focus:border-[var(--gold)]"
                />
                <button type="button" onClick={handleJoinCode} className="btn-tactile paper whitespace-nowrap">
                  Open code
                </button>
              </div>
              {joinError && <p className="text-[12.5px] font-semibold text-[var(--coral-ink)]">{joinError}</p>}
            </div>
          </section>

          {/* Ready Challenge Room + Local History */}
          <div className="min-[860px]:col-span-5 flex flex-col gap-4">
            <section className="rtc-card rounded-2xl p-5 flex flex-col gap-4">
              <span className="eyebrow text-[var(--gold)]">Active duel</span>
              {activeSpec ? (
                <>
                  <div className="rtc-eq-plate rounded-2xl p-4 flex flex-col gap-1 text-white">
                    <div className="text-[11.5px] text-white/80 font-semibold">{activeSpec.title}</div>
                    <div className="mono font-bold text-[22px] text-white tracking-wide">
                      {activeSpec.code}
                    </div>
                    <div className="text-[12px] text-white/85">
                      {duelQuestions.length} questions · 5:00 timer
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => void handleCopyShare('link')}
                      className="flex-1 min-h-[38px] px-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--gold)] text-[12.5px] font-bold text-[var(--ink)] cursor-pointer"
                    >
                      Copy invite link
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleCopyShare('code')}
                      className="flex-1 min-h-[38px] px-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--gold)] text-[12.5px] font-bold text-[var(--ink)] cursor-pointer"
                    >
                      Copy code
                    </button>
                  </div>
                  {copiedMsg && <div className="text-[12px] font-bold text-[var(--green)]">{copiedMsg}</div>}

                  <button type="button" onClick={startDuelSprint} className="btn-tactile indigo w-full">
                    <span>Start 10-question duel</span>
                    <Icon name="go" size={17} />
                  </button>
                </>
              ) : (
                <p className="text-[13.5px] text-[var(--dim)] leading-relaxed">
                  Pick a subject on the left and tap <strong>Create duel code</strong>, or paste a friend’s code to open their paper.
                </p>
              )}
            </section>

            {/* Recent Duels */}
            {(progress.duelHistory?.length || 0) > 0 && (
              <section className="rtc-card rounded-2xl p-4 flex flex-col gap-2.5">
                <div className="text-[13px] font-bold text-[var(--ink)]">Recent duels</div>
                {(progress.duelHistory || []).slice(-4).reverse().map((h, i) => (
                  <div
                    key={`${h.code}-${i}`}
                    className="rounded-xl bg-[var(--bg)] border border-[var(--line)] px-3 py-2 flex items-center justify-between text-[12.5px]"
                  >
                    <div>
                      <div className="mono font-bold text-[var(--gold)]">{h.code}</div>
                      <div className="text-[11.5px] text-[var(--dim)]">{h.title}</div>
                    </div>
                    <div className="text-right mono font-extrabold text-[var(--ink)]">
                      {h.score}/{h.total}
                      <div className="text-[11px] font-semibold text-[var(--dim)]">{mmss(h.timeSec)}</div>
                    </div>
                  </div>
                ))}
              </section>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════ ACTIVE SPRINT ═══════════════════ */}
      {phase === 'active' && activeSpec && currentItem && (
        <section className="rtc-card rounded-2xl p-5 sm:p-6 flex flex-col gap-4 max-w-[760px] mx-auto w-full">
          <div className="flex items-center justify-between text-[12.5px] font-bold text-[var(--dim)]">
            <span className="text-[var(--gold)]">{currentItem.topicName}</span>
            <span className="mono">
              Score: {score}/{idx + (picked !== null ? 1 : 0)}
            </span>
          </div>

          <div
            className="qt text-[var(--ink)]"
            dangerouslySetInnerHTML={{ __html: typesetMathHtml(currentItem.q.q, activeSpec.subj) }}
          />
          {currentItem.q.g && <DiagramFigure g={currentItem.q.g} />}

          <div className="flex flex-col gap-2.5">
            {currentItem.order.map((origIdx, dispIdx) => {
              const answered = picked !== null;
              const isPicked = picked === origIdx;
              const isRight = origIdx === currentItem.q.a;
              const letter = String.fromCharCode(65 + dispIdx);
              const stateCls = answered
                ? isRight
                  ? 'ok'
                  : isPicked
                    ? 'no anim-shake'
                    : 'opt-eliminated'
                : '';
              return (
                <button
                  key={origIdx}
                  type="button"
                  disabled={answered}
                  onClick={() => handlePickOption(origIdx)}
                  className={`opt-tile ${stateCls}`}
                >
                  <span className="opt-bubble">
                    <span>{letter}</span>
                  </span>
                  <span
                    className="flex-1 text-[15px] leading-snug"
                    dangerouslySetInnerHTML={{ __html: typesetMathHtml(currentItem.q.o[origIdx], activeSpec.subj) }}
                  />
                </button>
              );
            })}
          </div>

          {picked !== null && (
            <div className="pt-2 flex flex-col gap-3 anim-explain-reveal">
              <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-3.5 text-[13.5px] text-[var(--ink)]">
                <strong>Explanation:</strong>{' '}
                <span dangerouslySetInnerHTML={{ __html: typesetMathHtml(currentItem.q.e, activeSpec.subj) }} />
              </div>
              <button type="button" onClick={handleNext} className="btn-tactile indigo w-full">
                <span>{idx + 1 >= duelQuestions.length ? 'Finish and see scoreboard' : 'Next question'}</span>
                <Icon name="go" size={17} />
              </button>
            </div>
          )}
        </section>
      )}

      {/* ═══════════════════ RESULT & SCOREBOARD ═══════════════════ */}
      {phase === 'result' && activeSpec && (
        <div className="grid grid-cols-1 min-[820px]:grid-cols-12 gap-5">
          <section className="min-[820px]:col-span-6 rtc-card rounded-2xl p-6 flex flex-col gap-4">
            <span className="eyebrow text-[var(--gold)]">Duel complete · {activeSpec.code}</span>
            <h2 className="h26 text-[var(--ink)]">
              You scored {score} / {duelQuestions.length}
            </h2>
            <p className="text-[14px] text-[var(--dim)]">
              Finished in <strong className="text-[var(--ink)]">{mmss(elapsedSec)}</strong>.{' '}
              {missedList.length > 0
                ? `${missedList.length} missed question${missedList.length === 1 ? '' : 's'} added to Mistakes to fix.`
                : 'Every question right — zero mistakes!'}
            </p>
            <div className="flex flex-wrap gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => void handleCopyShare('link')}
                className="btn-tactile indigo flex-1"
              >
                <span>Share link to challenge friends</span>
              </button>
              <button
                type="button"
                onClick={() => setPhase('lobby')}
                className="btn-tactile paper"
              >
                New duel
              </button>
            </div>
            {copiedMsg && <div className="text-[12.5px] font-bold text-[var(--green)]">{copiedMsg}</div>}
          </section>

          <section className="min-[820px]:col-span-6 rtc-card rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="eyebrow text-[var(--gold)]">Duel scoreboard</span>
                <h3 className="h20 text-[var(--ink)]">Head-to-head scores</h3>
              </div>
              <Icon name="trophy" size={20} className="text-[var(--gold)]" />
            </div>

            {!user ? (
              <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-4 flex flex-col gap-3">
                <p className="text-[13px] text-[var(--dim)] leading-relaxed">
                  Sign in with Google to publish your duel time to the live cloud scoreboard and compare scores with classmates using code <span className="rtc-code">{activeSpec.code}</span>.
                </p>
                <button type="button" onClick={() => void signInWithGoogle()} className="btn-tactile paper">
                  Sign in with Google to Publish Score
                </button>
              </div>
            ) : loadingBoard ? (
              <p className="text-[13px] text-[var(--dim)]">Loading live scoreboard…</p>
            ) : cloudEntries.length > 0 ? (
              <div className="flex flex-col gap-2">
                {cloudEntries.map((entry, rankIdx) => (
                  <div
                    key={entry.uid}
                    className={`rounded-xl border px-3.5 py-2.5 flex items-center justify-between ${
                      entry.uid === user.uid
                        ? 'bg-[var(--acc-soft)] border-[var(--gold)]'
                        : 'bg-[var(--bg)] border-[var(--line)]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="mono font-extrabold text-[13px] text-[var(--gold)]">#{rankIdx + 1}</span>
                      <span className="font-bold text-[14px] text-[var(--ink)]">{entry.displayName}</span>
                    </div>
                    <div className="mono text-[13.5px] font-extrabold text-[var(--ink)]">
                      {entry.score}/{entry.total}{' '}
                      <span className="text-[11.5px] font-semibold text-[var(--dim)]">({mmss(entry.timeSeconds)})</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-[var(--dim)]">
                Your score has been posted! Share code <span className="rtc-code">{activeSpec.code}</span> so friends appear here.
              </p>
            )}
          </section>
        </div>
      )}

      <StudyToolsDrawer open={toolsOpen} onClose={() => setToolsOpen(false)} />
    </div>
  );
}
