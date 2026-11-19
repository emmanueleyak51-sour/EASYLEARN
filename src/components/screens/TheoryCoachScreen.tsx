import React, { useMemo, useState } from 'react';
import type { SubjectId, UserProgress } from '../../types';
import { WAEC_THEORY_BANK, type WaecTheoryPrompt } from '../../data/waecTheoryBank';
import { SUBJECT_INFO } from '../../utils/engine';
import { typesetMathHtml } from '../../utils/mathTypesetter';
import { SubscreenTopBar } from '../AppShell';
import { Icon } from '../Icons';
import { StudyToolsDrawer } from '../StudyToolsDrawer';

export function TheoryCoachScreen({
  progress,
  onSaveTheoryScore,
  onBack,
}: {
  progress: UserProgress;
  onSaveTheoryScore: (promptId: string, earned: number, max: number) => void;
  onBack: () => void;
}) {
  const [subjFilter, setSubjFilter] = useState<'all' | SubjectId>('all');
  const [activePromptId, setActivePromptId] = useState<string>(WAEC_THEORY_BANK[0].id);
  const [draftText, setDraftText] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [checkedMarks, setCheckedMarks] = useState<Record<number, boolean>>({});
  const [savedBanner, setSavedBanner] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  const filteredPrompts = useMemo(
    () =>
      subjFilter === 'all'
        ? WAEC_THEORY_BANK
        : WAEC_THEORY_BANK.filter((p) => p.subj === subjFilter),
    [subjFilter]
  );

  const activePrompt: WaecTheoryPrompt =
    filteredPrompts.find((p) => p.id === activePromptId) || filteredPrompts[0] || WAEC_THEORY_BANK[0];

  const selectPrompt = (id: string) => {
    setActivePromptId(id);
    setDraftText('');
    setRevealed(false);
    setCheckedMarks({});
    setSavedBanner(false);
  };

  const earnedMarks = activePrompt.rubric.reduce(
    (sum, item, idx) => sum + (checkedMarks[idx] ? item.marks : 0),
    0
  );

  const availableSubjects = useMemo(
    () => Array.from(new Set(WAEC_THEORY_BANK.map((p) => p.subj))),
    []
  );

  return (
    <div className="flex flex-col gap-5 anim-rise">
      <SubscreenTopBar
        title="WAEC Paper 2 Theory & Essay Coach"
        subtitle="Official Marking-Scheme Mode (B1 · M1 · A1 · Essay Rubrics)"
        onBack={onBack}
        right={
          <button
            type="button"
            onClick={() => setToolsOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-[var(--card)] border border-[var(--line)] hover:border-[var(--acc-line)] text-[12.5px] font-bold text-[var(--ink)] flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Icon name="sigma" size={14} className="text-[var(--gold)]" />
            <span>Calc &amp; Pad</span>
          </button>
        }
      />

      {/* Subject Filter */}
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => setSubjFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-[12.5px] font-bold border cursor-pointer ${
            subjFilter === 'all'
              ? 'bg-[var(--gold)] text-[var(--on-acc)] border-[var(--gold)]'
              : 'bg-[var(--card)] text-[var(--dim)] border-[var(--line)]'
          }`}
        >
          All Papers ({WAEC_THEORY_BANK.length})
        </button>
        {availableSubjects.map((sid) => (
          <button
            key={sid}
            type="button"
            onClick={() => {
              setSubjFilter(sid);
              const first = WAEC_THEORY_BANK.find((p) => p.subj === sid);
              if (first) selectPrompt(first.id);
            }}
            className={`px-3 py-1.5 rounded-lg text-[12.5px] font-bold border cursor-pointer ${
              subjFilter === sid
                ? 'bg-[var(--gold)] text-[var(--on-acc)] border-[var(--gold)]'
                : 'bg-[var(--card)] text-[var(--dim)] border-[var(--line)]'
            }`}
          >
            {SUBJECT_INFO[sid].short}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 min-[900px]:grid-cols-12 gap-5 items-start">
        {/* Prompt Directory */}
        <aside className="min-[900px]:col-span-4 flex flex-col gap-2">
          {filteredPrompts.map((p) => {
            const active = p.id === activePrompt.id;
            const prevScore = progress.theoryScores?.[p.id];
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => selectPrompt(p.id)}
                className={`text-left rounded-xl p-3.5 border transition cursor-pointer ${
                  active
                    ? 'rtc-card border-[var(--gold)] ring-1 ring-[var(--gold)]/25 bg-[var(--acc-soft)]/35'
                    : 'rtc-card hover:border-[var(--acc-line)]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-[11.5px] font-semibold text-[var(--gold)]">
                  <span>{SUBJECT_INFO[p.subj].name}</span>
                  <span className="font-mono tabular-nums">
                    {prevScore ? `${prevScore.earned}/${prevScore.max}` : `${p.totalMarks} marks`}
                  </span>
                </div>
                <div className="font-[var(--display)] font-bold text-[14.5px] text-[var(--ink)] mt-0.5 leading-snug">
                  {p.topic}
                </div>
                <div className="text-[11.5px] text-[var(--dim)] mt-0.5">{p.paper}</div>
              </button>
            );
          })}
        </aside>

        {/* Active Theory Workspace */}
        <section className="min-[900px]:col-span-8 flex flex-col gap-4">
          <div className="rtc-card rounded-2xl p-5 sm:p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="eyebrow text-[var(--gold)]">{activePrompt.paper}</span>
              <span className="text-[12.5px] font-mono font-bold text-[var(--dim)] tabular-nums">
                {activePrompt.totalMarks} marks · ~{activePrompt.estMinutes} min
              </span>
            </div>

            <div
              className="text-[16px] font-medium text-[var(--ink)] leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: typesetMathHtml(activePrompt.question, activePrompt.subj),
              }}
            />

            <label className="flex flex-col gap-1.5">
              <span className="text-[12.5px] font-bold text-[var(--dim)]">
                Your Structured Working / Essay Draft
              </span>
              <textarea
                rows={6}
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                placeholder="Write your step-by-step working, formulas, or essay outline here before opening the WAEC Marking Scheme..."
                className="w-full rounded-xl bg-[var(--bg)] border border-[var(--line)] p-3.5 text-[14.5px] text-[var(--ink)] leading-relaxed focus:outline-none focus:border-[var(--gold)]"
              />
            </label>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-[12.5px] text-[var(--dim)]">
                Examiner tip: {activePrompt.examinerNote}
              </span>
              <button
                type="button"
                onClick={() => setRevealed((r) => !r)}
                className="btn-tactile indigo whitespace-nowrap"
              >
                <span>{revealed ? 'Hide Marking Scheme' : 'Reveal Marking Scheme & Self-Grade'}</span>
              </button>
            </div>
          </div>

          {revealed && (
            <div className="rtc-card rounded-2xl p-5 sm:p-6 flex flex-col gap-4 border-[var(--acc-line)]">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <span className="eyebrow text-[var(--gold)]">Official Examiner Rubric</span>
                  <h3 className="h18 text-[var(--ink)]">Tick Every Checkpoint Present in Your Working</h3>
                </div>
                <div className="font-mono font-extrabold text-[22px] text-[var(--gold)] tabular-nums">
                  {earnedMarks} / {activePrompt.totalMarks}
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                {activePrompt.rubric.map((item, idx) => {
                  const checked = !!checkedMarks[idx];
                  return (
                    <label
                      key={idx}
                      className={`rounded-xl border p-3.5 flex items-start gap-3 cursor-pointer transition ${
                        checked
                          ? 'bg-[var(--ok-soft)] border-[var(--ok-line)]'
                          : 'bg-[var(--bg)] border-[var(--line)] hover:border-[var(--acc-line)]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          setCheckedMarks((prev) => ({ ...prev, [idx]: !prev[idx] }))
                        }
                        className="mt-1 w-4 h-4 accent-[var(--green)] cursor-pointer shrink-0"
                      />
                      <div className="flex-1 min-w-0 flex flex-col gap-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[12px] font-bold text-[var(--gold)]">
                            {item.code} (+{item.marks} {item.marks === 1 ? 'mark' : 'marks'})
                          </span>
                        </div>
                        <div className="text-[14px] font-semibold text-[var(--ink)]">{item.criterion}</div>
                        <div
                          className="text-[13px] text-[var(--dim)] bg-[var(--card)]/70 rounded-lg px-2.5 py-1.5 border border-[var(--line)] mt-0.5"
                          dangerouslySetInnerHTML={{
                            __html: typesetMathHtml(item.modelStep, activePrompt.subj),
                          }}
                        />
                      </div>
                    </label>
                  );
                })}
              </div>

              <div className="flex items-center justify-between gap-3 pt-2 border-t border-[var(--line)]">
                {savedBanner ? (
                  <span className="text-[13px] font-bold text-[var(--green)]">
                    Theory score saved ({earnedMarks}/{activePrompt.totalMarks})!
                  </span>
                ) : (
                  <span className="text-[12.5px] text-[var(--dim)]">
                    Honest self-marking builds WAEC Paper 2 precision.
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => {
                    onSaveTheoryScore(activePrompt.id, earnedMarks, activePrompt.totalMarks);
                    setSavedBanner(true);
                  }}
                  className="btn-tactile indigo whitespace-nowrap"
                >
                  <span>Record Score</span>
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      <StudyToolsDrawer open={toolsOpen} onClose={() => setToolsOpen(false)} />
    </div>
  );
}
