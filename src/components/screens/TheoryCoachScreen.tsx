import React, { useMemo, useState } from 'react';
import type { SubjectId, UserProgress } from '../../types';
import { WAEC_THEORY_BANK, type WaecTheoryPrompt } from '../../data/waecTheoryBank';
import { SUBJECT_INFO } from '../../utils/engine';
import { typesetMathHtml } from '../../utils/mathTypesetter';
import { getWaecMistakeGuidance } from '../../utils/examTrackLogic';
import { SubscreenTopBar } from '../AppShell';
import { Icon } from '../Icons';
import { StudyToolsDrawer } from '../StudyToolsDrawer';
import { LiquidCapsuleBar, SmoothCollapse, SmoothViewSwitch } from '../ULessonMotion';

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
        title="Theory answers"
        subtitle="Practise written WAEC Paper 2 questions and mark your own work"
        onBack={onBack}
        right={
          <button
            type="button"
            onClick={() => setToolsOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-[var(--card)] border border-[var(--line)] hover:border-[var(--acc-line)] text-[12.5px] font-bold text-[var(--ink)] flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Icon name="sigma" size={14} className="text-[var(--gold)]" />
            <span>Calculator</span>
          </button>
        }
      />

      {/* Subject Filter */}
      <div className="overflow-x-auto max-w-full pb-0.5">
        <LiquidCapsuleBar
          roleType="tablist"
          size="sm"
          ariaLabel="Filter theory prompts by subject"
          items={[
            { id: 'all' as const, label: `All subjects (${WAEC_THEORY_BANK.length})` },
            ...availableSubjects.map((sid) => ({
              id: sid,
              label: SUBJECT_INFO[sid].short,
            })),
          ]}
          value={subjFilter}
          onChange={(next) => {
            setSubjFilter(next);
            if (next !== 'all') {
              const first = WAEC_THEORY_BANK.find((p) => p.subj === next);
              if (first) selectPrompt(first.id);
            }
          }}
        />
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
          <SmoothViewSwitch viewKey={activePrompt.id} className="flex flex-col gap-4">
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

              {/* WAEC Chief Examiner Mistakes to Avoid */}
              <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-3.5 flex flex-col gap-1.5">
                <div className="text-[12px] font-bold text-[var(--gold)]">
                  Common WAEC Paper 2 Mistakes to Avoid ({SUBJECT_INFO[activePrompt.subj].short})
                </div>
                <ul className="flex flex-col gap-1 text-[12.5px] text-[var(--dim)] list-disc pl-4">
                  {getWaecMistakeGuidance(activePrompt.subj)
                    .mistakesToAvoid.slice(0, 2)
                    .map((m, idx) => (
                      <li key={idx} className="leading-snug">
                        {m}
                      </li>
                    ))}
                </ul>
              </div>

              <label className="flex flex-col gap-1.5">
                <span className="text-[12.5px] font-bold text-[var(--dim)]">
                  Your written working or essay draft
                </span>
                <textarea
                  rows={6}
                  value={draftText}
                  onChange={(e) => setDraftText(e.target.value)}
                  placeholder="Write your step-by-step working, formulas or essay points here before opening the marking guide..."
                  className="w-full rounded-xl bg-[var(--bg)] border border-[var(--line)] p-3.5 text-[14.5px] text-[var(--ink)] leading-relaxed focus:outline-none focus:border-[var(--gold)]"
                />
              </label>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-[12.5px] text-[var(--dim)]">
                  Tip: {activePrompt.examinerNote}
                </span>
                <button
                  type="button"
                  onClick={() => setRevealed((r) => !r)}
                  className="btn-tactile indigo whitespace-nowrap"
                >
                  <span>{revealed ? 'Hide marking guide' : 'Show marking guide and mark your work'}</span>
                </button>
              </div>
            </div>

            <SmoothCollapse open={revealed}>
              <div className="rtc-card rounded-2xl p-5 sm:p-6 flex flex-col gap-4 border-[var(--acc-line)]">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <span className="eyebrow text-[var(--gold)]">Marking guide</span>
                    <h3 className="h18 text-[var(--ink)]">Tick every point you wrote clearly</h3>
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
                            <span className="font-mono text-[12px] font-bold text-[var(--gold)] tabular-nums">
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
                    <span className="text-[13px] font-bold text-[var(--green)] tabular-nums">
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
                    <span>Save score</span>
                  </button>
                </div>
              </div>
            </SmoothCollapse>
          </SmoothViewSwitch>
        </section>
      </div>

      <StudyToolsDrawer open={toolsOpen} onClose={() => setToolsOpen(false)} />
    </div>
  );
}
