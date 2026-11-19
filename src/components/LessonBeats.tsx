import React from 'react';
import type {
  Beat,
  CheckBeat,
  DayoBeat,
  ExplainWhySpec,
  ExploreBeat,
  FadeBeat,
  IdeaBeat,
  SpotBeat,
  SubjectId,
  TeachBeat,
  TeachBlock,
} from '../types';
import { perm } from '../utils/engine';
import { splitRuleEquation, typesetMathHtml } from '../utils/mathTypesetter';
import { DiagramFigure, Icon, RichHtml } from './Icons';
import { ExplorerCanvas } from './Explorers';

export const BEAT_META: Record<Beat['k'], { label: string; icon: string }> = {
  teach: { label: 'Learn', icon: 'book' },
  idea: { label: 'The Idea', icon: 'book' },
  explore: { label: 'Explore It', icon: 'target' },
  dayo: { label: 'With Senior Dayo', icon: 'chat' },
  fade: { label: 'Worked Example', icon: 'pen' },
  spot: { label: 'Spot the Mistake', icon: 'bolt' },
  check: { label: 'Your Turn', icon: 'pen' },
};

export interface BeatLocalState {
  pred: number | null;
  xpState: any;
  tasksDone: Record<number, number>;
  dayoStep: string;
  dayoHist: { who: 'd' | 'u'; text: string }[];
  fadeShow: number;
  fadeAns: Record<number, number>;
  fadeHint: number;
  fadeWhyPicked: Record<number, number>;
  spotLine: number | null;
  spotPicked: number | null;
  spotHint: number;
  spotWhyPicked: number | null;
  checkPicked: number | null;
  checkHint: number;
  checkWhyPicked: number | null;
}

export function makeInitialBeatState(beat: Beat, xpInit?: any): BeatLocalState {
  let dayoHist: { who: 'd' | 'u'; text: string }[] = [];
  if (beat.k === 'dayo' && beat.nodes.start) {
    dayoHist = [{ who: 'd', text: beat.nodes.start.say }];
  }
  return {
    pred: null,
    xpState: xpInit,
    tasksDone: {},
    dayoStep: 'start',
    dayoHist,
    fadeShow: 0,
    fadeAns: {},
    fadeHint: 0,
    fadeWhyPicked: {},
    spotLine: null,
    spotPicked: null,
    spotHint: 0,
    spotWhyPicked: null,
    checkPicked: null,
    checkHint: 0,
    checkWhyPicked: null,
  };
}

export function isBeatDone(beat: Beat, st: BeatLocalState): boolean {
  if (beat.k === 'teach' || beat.k === 'idea') return true;
  if (beat.k === 'dayo') return !!beat.nodes[st.dayoStep]?.end;
  if (beat.k === 'explore') {
    const predReady = !beat.predict || st.pred !== null;
    if (!predReady) return false;
    return beat.tasks.every((_, i) => !!st.tasksDone[i]);
  }
  if (beat.k === 'fade') {
    const allShown = st.fadeShow >= beat.steps.length;
    if (!allShown) return false;
    return beat.steps.every((step, j) => {
      if (step.o && step.o.length) {
        const rightIdx = step.a ?? 0;
        if (st.fadeAns[j] !== rightIdx) return false;
      }
      const ex = step.ex || step.whyQ;
      if (ex && st.fadeWhyPicked[j] !== (ex.a ?? 0)) return false;
      return true;
    });
  }
  if (beat.k === 'spot') {
    const rightDiag = beat.a ?? 0;
    if (st.spotLine !== beat.bad || st.spotPicked !== rightDiag) return false;
    if (beat.why && st.spotWhyPicked !== (beat.why.a ?? 0)) return false;
    return true;
  }
  if (beat.k === 'check') {
    const rightAns = beat.a ?? 0;
    if (st.checkPicked !== rightAns) return false;
    if (beat.why && st.checkWhyPicked !== (beat.why.a ?? 0)) return false;
    return true;
  }
  return true;
}

export function beatHasRightPane(beat: Beat, st: BeatLocalState): boolean {
  if (beat.k === 'explore') return !beat.predict || st.pred !== null;
  if (beat.k === 'idea' || beat.k === 'fade' || beat.k === 'spot' || beat.k === 'check' || beat.k === 'dayo') {
    return !!beat.g;
  }
  return false;
}

function DayoBadge({ text, subj }: { text: string; subj?: SubjectId }) {
  return (
    <div className="rtc-card rounded-2xl p-3.5 flex items-start gap-3 anim-rise">
      <span className="shrink-0 w-9 h-9 rounded-full bg-[var(--gold)] text-[var(--on-acc)] font-extrabold text-[13px] font-[var(--display)] flex items-center justify-center">
        SD
      </span>
      <div className="flex flex-col gap-0.5 text-[15px] leading-relaxed">
        <span className="text-[12px] font-bold text-[var(--gold)]">Senior Dayo</span>
        <div className="dayo text-[var(--ink)]" dangerouslySetInnerHTML={{ __html: typesetMathHtml(text, subj) }} />
      </div>
    </div>
  );
}

function ExplainWhyBlock({
  spec,
  seedKey,
  pickedOrig,
  subj,
  onPick,
}: {
  spec: ExplainWhySpec;
  seedKey: string;
  pickedOrig: number | null;
  subj?: SubjectId;
  onPick: (origIdx: number) => void;
}) {
  const order = perm(seedKey, spec.o.length);
  const rightOrig = spec.a ?? 0;
  const done = pickedOrig === rightOrig;

  return (
    <div className="rounded-2xl bg-[var(--hint-soft)] border border-[var(--hint-line)] p-4 flex flex-col gap-3 mt-1 anim-rise">
      <div className="flex items-center gap-2 text-[12.5px] font-bold text-[var(--hint)]">
        <Icon name="chat" size={14} />
        <span>Explain why</span>
      </div>
      <div className="text-[16px] font-semibold text-[var(--ink)]" dangerouslySetInnerHTML={{ __html: typesetMathHtml(spec.q, subj) }} />
      <div className="flex flex-col gap-2">
        {order.map((origIdx, dispIdx) => {
          const isPicked = pickedOrig === origIdx;
          const isRight = origIdx === rightOrig;
          const cls = isPicked
            ? isRight
              ? 'ok'
              : 'no anim-shake'
            : done
              ? 'opt-eliminated'
              : '';
          return (
            <button
              key={origIdx}
              type="button"
              disabled={done}
              onClick={() => onPick(origIdx)}
              className={`opt-tile ${cls}`}
            >
              <span className="w-7 h-7 rounded-lg bg-[var(--deep)] border border-[var(--line)] font-extrabold text-[13px] flex items-center justify-center shrink-0">
                {String.fromCharCode(65 + dispIdx)}
              </span>
              <span className="flex-1" dangerouslySetInnerHTML={{ __html: typesetMathHtml(spec.o[origIdx], subj) }} />
            </button>
          );
        })}
      </div>
      {pickedOrig !== null && spec.fb[pickedOrig] && (
        <div
          className={`anim-explain-reveal rounded-xl border p-3 text-[14px] leading-snug ${
            done
              ? 'bg-[var(--ok-soft)] border-[var(--ok-line)] text-[var(--ink)]'
              : 'bg-[var(--card)] border-[var(--bad-line)] text-[var(--ink)]'
          }`}
          dangerouslySetInnerHTML={{ __html: typesetMathHtml(spec.fb[pickedOrig], subj) }}
        />
      )}
    </div>
  );
}

function BeatRuleLi({ html, subj }: { html: string; subj?: SubjectId }) {
  const split = splitRuleEquation(html, subj);
  if (split.hasEquation) {
    return (
      <li className="flex flex-col gap-1.5">
        {split.leadHtml && (
          <span className="font-semibold text-[var(--ink)]" dangerouslySetInnerHTML={{ __html: split.leadHtml }} />
        )}
        <div className="math-eq-plate" dangerouslySetInnerHTML={{ __html: split.eqHtml }} />
      </li>
    );
  }
  return <li dangerouslySetInnerHTML={{ __html: split.leadHtml }} />;
}

function TeachBlockView({ block, subj }: { block: TeachBlock; subj?: SubjectId }) {
  switch (block[0]) {
    case 'p':
      return <p dangerouslySetInnerHTML={{ __html: typesetMathHtml(block[1], subj) }} />;
    case 'h':
      return <h3 dangerouslySetInnerHTML={{ __html: typesetMathHtml(block[1], subj) }} />;
    case 'eg':
      return (
        <div className="eg">
          <span className="tg">{block[1].toUpperCase()}</span>
          <p dangerouslySetInnerHTML={{ __html: typesetMathHtml(block[2], subj) }} />
        </div>
      );
    case 'wn':
      return (
        <div className="wn">
          <span className="tg">TRAP</span>
          <p dangerouslySetInnerHTML={{ __html: typesetMathHtml(block[1], subj) }} />
        </div>
      );
    case 'key':
      return (
        <div className="key">
          <span className="tg">REMEMBER</span>
          <p dangerouslySetInnerHTML={{ __html: typesetMathHtml(block[1], subj) }} />
        </div>
      );
    case 'fig':
      return <DiagramFigure g={block[1]} cap={block[2]} />;
    case 'li':
      return (
        <ul className="rules">
          {block[1].map((item, idx) => (
            <BeatRuleLi key={idx} html={item} subj={subj} />
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol>
          {block[1].map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: typesetMathHtml(item, subj) }} />
          ))}
        </ol>
      );
    case 'tb':
      return (
        <div className="tw">
          <table>
            <thead>
              <tr>
                {block[1].map((h, i) => (
                  <th key={i} dangerouslySetInnerHTML={{ __html: typesetMathHtml(h, subj) }} />
                ))}
              </tr>
            </thead>
            <tbody>
              {block[2].map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} dangerouslySetInnerHTML={{ __html: typesetMathHtml(cell, subj) }} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

export function BeatVisualPane({
  beat,
  st,
  onXpChange,
  onDrawSound,
}: {
  beat: Beat;
  st: BeatLocalState;
  onXpChange: (nextXp: any) => void;
  onDrawSound?: () => void;
}) {
  if (beat.k === 'explore') {
    if (beat.predict && st.pred === null) return null;
    return (
      <ExplorerCanvas
        kind={beat.xp}
        cfg={beat.cfg}
        state={st.xpState}
        onChange={onXpChange}
        onDrawSound={onDrawSound}
      />
    );
  }
  if ('g' in beat && beat.g) {
    return <DiagramFigure g={beat.g} cap={'cap' in beat ? beat.cap : undefined} />;
  }
  return null;
}

export function BeatMainContent({
  beat,
  beatKey,
  st,
  subj,
  onUpdate,
  inlineVisual,
  responsiveSplit = false,
  onSound,
}: {
  beat: Beat;
  beatKey: string;
  st: BeatLocalState;
  subj?: SubjectId;
  onUpdate: (patch: Partial<BeatLocalState>) => void;
  inlineVisual: boolean;
  responsiveSplit?: boolean;
  onSound: (kind: 'ok' | 'no' | 'draw') => void;
}) {
  const inlineCls = responsiveSplit ? 'min-[980px]:hidden' : '';
  if (beat.k === 'teach') {
    const b = beat as TeachBeat;
    const normTitle = (b.title || '').replace(/<[^>]+>/g, '').trim().toLowerCase();
    const filteredBody = b.body.filter(
      (blk) =>
        !(
          blk[0] === 'h' &&
          normTitle &&
          blk[1].replace(/<[^>]+>/g, '').trim().toLowerCase() === normTitle
        )
    );
    return (
      <div className="flex flex-col gap-4">
        {b.title && <h2 className="h22 text-[var(--ink)]">{b.title}</h2>}
        <div className="tch">
          {filteredBody.map((blk, i) => (
            <TeachBlockView key={i} block={blk} subj={subj} />
          ))}
        </div>
      </div>
    );
  }

  if (beat.k === 'idea') {
    const b = beat as IdeaBeat;
    return (
      <div className="flex flex-col gap-4">
        {b.title && <h2 className="h22 text-[var(--ink)]">{b.title}</h2>}
        {b.idea && (
          <p
            className="lead text-[var(--ink)]"
            dangerouslySetInnerHTML={{ __html: typesetMathHtml(b.idea, subj) }}
          />
        )}
        {inlineVisual && b.g && (
          <div className={inlineCls}>
            <DiagramFigure g={b.g} cap={b.cap} />
          </div>
        )}
        {b.defs && b.defs.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="eyebrow text-[var(--dim)]">Definitions</span>
            <div className="tw">
              <table>
                <thead>
                  <tr>
                    <th>Term</th>
                    <th>Exact Definition</th>
                  </tr>
                </thead>
                <tbody>
                  {b.defs.map(([term, def], idx) => (
                    <tr key={idx}>
                      <td dangerouslySetInnerHTML={{ __html: typesetMathHtml(term, subj) }} />
                      <td dangerouslySetInnerHTML={{ __html: typesetMathHtml(def, subj) }} />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {b.laws && b.laws.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="eyebrow text-[var(--gold)]">Laws &amp; principles</span>
            <div className="tw">
              <table>
                <thead>
                  <tr>
                    <th>Law / Principle</th>
                    <th>Statement &amp; Core Rule</th>
                  </tr>
                </thead>
                <tbody>
                  {b.laws.map(([name, stmt], idx) => (
                    <tr key={idx}>
                      <td dangerouslySetInnerHTML={{ __html: typesetMathHtml(name, subj) }} />
                      <td dangerouslySetInnerHTML={{ __html: typesetMathHtml(stmt, subj) }} />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {b.rules && b.rules.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="eyebrow text-[var(--dim)]">{b.rh || 'Key rules'}</span>
            <ul className="rules">
              {b.rules.map((r, i) => (
                <BeatRuleLi key={i} html={r} subj={subj} />
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  if (beat.k === 'explore') {
    const b = beat as ExploreBeat;
    if (b.predict && st.pred === null) {
      const order = perm(`${beatKey}|pred`, b.predict.o.length);
      return (
        <div className="flex flex-col gap-4">
          {b.title && <h2 className="h22 text-[var(--ink)]">{b.title}</h2>}
          <p className="lead text-[var(--ink)]" dangerouslySetInnerHTML={{ __html: typesetMathHtml(b.intro, subj) }} />
          <div className="rtc-card rounded-2xl p-5 flex flex-col gap-4">
            <span className="eyebrow text-[var(--gold)]">Predict first</span>
            {b.predict.g && <DiagramFigure g={b.predict.g} />}
            <div className="qt text-[var(--ink)]" dangerouslySetInnerHTML={{ __html: typesetMathHtml(b.predict.q, subj) }} />
            <div className="flex flex-col gap-2.5">
              {order.map((origIdx, dispIdx) => (
                <button
                  key={origIdx}
                  type="button"
                  onClick={() => {
                    if (origIdx === (b.predict?.a ?? 0)) {
                      onSound('ok');
                    }
                    onUpdate({ pred: origIdx });
                  }}
                  className="opt-tile"
                >
                  <span className="w-7 h-7 rounded-lg bg-[var(--deep)] border border-[var(--line)] font-extrabold text-[13px] flex items-center justify-center shrink-0">
                    {String.fromCharCode(65 + dispIdx)}
                  </span>
                  <span className="flex-1" dangerouslySetInnerHTML={{ __html: typesetMathHtml(b.predict!.o[origIdx], subj) }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    const doneMap = { ...st.tasksDone };
    b.tasks.forEach((task, i) => {
      if (!doneMap[i] && st.xpState && task.ok(st.xpState)) {
        doneMap[i] = 1;
      }
    });
    const allTasksDone = b.tasks.every((_, i) => !!doneMap[i]);

    return (
      <div className="flex flex-col gap-4">
        {b.title && <h2 className="h22 text-[var(--ink)]">{b.title}</h2>}
        {b.predict && st.pred !== null && b.predict.fb[st.pred] && (
          <DayoBadge text={b.predict.fb[st.pred]} subj={subj} />
        )}
        {inlineVisual && (
          <div className={inlineCls}>
            <ExplorerCanvas
              kind={b.xp}
              cfg={b.cfg}
              state={st.xpState}
              onDrawSound={() => onSound('draw')}
              onChange={(nextXp) => {
                const nextDone = { ...doneMap };
                b.tasks.forEach((task, i) => {
                  if (!nextDone[i] && task.ok(nextXp)) nextDone[i] = 1;
                });
                if (Object.keys(nextDone).length > Object.keys(doneMap).length) {
                  onSound('ok');
                }
                onUpdate({ xpState: nextXp, tasksDone: nextDone });
              }}
            />
          </div>
        )}
        <div className="rtc-card rounded-2xl p-4 flex flex-col gap-3">
          <span className="eyebrow text-[var(--dim)]">Try these moves</span>
          <div className="flex flex-col gap-2.5">
            {b.tasks.map((task, i) => {
              const done = !!doneMap[i];
              return (
                <div
                  key={i}
                  className={`rounded-xl border p-3 flex items-start gap-3 transition-colors duration-200 ${
                    done
                      ? 'bg-[var(--ok-soft)] border-[var(--ok-line)]'
                      : 'bg-[var(--deep)]/40 border-[var(--line)]'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 border ${
                      done
                        ? 'bg-[var(--green)] border-[var(--green)] text-white anim-popin'
                        : 'bg-[var(--card)] border-[var(--line)] text-transparent'
                    }`}
                  >
                    <Icon name="check" size={14} className={done ? 'anim-check-draw' : ''} />
                  </span>
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="text-[15px] font-semibold text-[var(--ink)]" dangerouslySetInnerHTML={{ __html: typesetMathHtml(task.t, subj) }} />
                    {done && (
                      <div className="anim-explain-reveal text-[14px] text-[var(--green)] font-medium leading-snug" dangerouslySetInnerHTML={{ __html: typesetMathHtml(task.say, subj) }} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {allTasksDone && (
          <div className="rounded-2xl bg-[var(--acc-soft)] border border-[var(--acc-line)] p-4 flex flex-col gap-3 anim-rise">
            <span className="eyebrow text-[var(--gold)]">What you just found</span>
            <p className="text-[16px] font-semibold text-[var(--ink)] leading-relaxed" dangerouslySetInnerHTML={{ __html: typesetMathHtml(b.found, subj) }} />
            {b.rules && b.rules.length > 0 && (
              <ul className="rules">
                {b.rules.map((r, idx) => (
                  <BeatRuleLi key={idx} html={r} subj={subj} />
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    );
  }

  if (beat.k === 'dayo') {
    const b = beat as DayoBeat;
    const node = b.nodes[st.dayoStep];
    return (
      <div className="flex flex-col gap-4">
        {b.title && <h2 className="h22 text-[var(--ink)]">{b.title}</h2>}
        {inlineVisual && b.g && (
          <div className={inlineCls}>
            <DiagramFigure g={b.g} cap={b.cap} />
          </div>
        )}
        <div className="flex flex-col gap-2.5">
          {st.dayoHist.map((msg, idx) =>
            msg.who === 'd' ? (
              <DayoBadge key={idx} text={msg.text} subj={subj} />
            ) : (
              <div
                key={idx}
                className="anim-rise self-end max-w-[85%] rounded-2xl rounded-br-sm bg-[var(--gold)] text-[var(--on-acc)] px-4 py-2.5 text-[15px] font-semibold shadow-sm"
                dangerouslySetInnerHTML={{ __html: typesetMathHtml(msg.text, subj) }}
              />
            )
          )}
        </div>
        {node && node.opts && !node.end && (
          <div className="flex flex-col gap-2 pt-1">
            {node.opts.map((opt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  const nextId = opt.next || '';
                  const nextNode = b.nodes[nextId];
                  const nextHist = [
                    ...st.dayoHist,
                    { who: 'u' as const, text: opt.t },
                    { who: 'd' as const, text: opt.say },
                  ];
                  if (nextNode && nextNode.say) {
                    nextHist.push({ who: 'd' as const, text: nextNode.say });
                  }
                  onUpdate({
                    dayoStep: nextId || st.dayoStep,
                    dayoHist: nextHist,
                  });
                }}
                className="opt-tile"
              >
                <span className="flex-1" dangerouslySetInnerHTML={{ __html: typesetMathHtml(opt.t, subj) }} />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (beat.k === 'fade') {
    const b = beat as FadeBeat;
    const stepCount = b.steps.length;
    const shown = Math.min(st.fadeShow, stepCount);
    const activeAskStep = shown < stepCount ? b.steps[shown] : null;
    const isAskStep = !!(activeAskStep && activeAskStep.o && activeAskStep.o.length > 0);
    const activeAnswered = st.fadeAns[shown] === (activeAskStep?.a ?? 0);

    return (
      <div className="flex flex-col gap-4">
        {b.title && <h2 className="h22 text-[var(--ink)]">{b.title}</h2>}
        <div className="rtc-card rounded-2xl p-4 flex flex-col gap-3">
          <div className="qt text-[var(--ink)]" dangerouslySetInnerHTML={{ __html: typesetMathHtml(b.q, subj) }} />
          {inlineVisual && b.g && (
            <div className={inlineCls}>
              <DiagramFigure g={b.g} />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2.5">
          {b.steps.slice(0, shown).map((step, j) => {
            const ex = step.ex || step.whyQ;
            return (
              <div
                key={j}
                className="rtc-card rounded-2xl p-3.5 flex flex-col gap-2 anim-rise"
              >
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[var(--acc-soft)] text-[var(--gold)] font-extrabold text-[12px] flex items-center justify-center shrink-0 mt-0.5">
                    {j + 1}
                  </span>
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="sm text-[var(--ink)]" dangerouslySetInnerHTML={{ __html: typesetMathHtml(step.m, subj) }} />
                    {step.why && (
                      <div className="text-[14px] text-[var(--dim)] leading-snug" dangerouslySetInnerHTML={{ __html: typesetMathHtml(step.why, subj) }} />
                    )}
                  </div>
                </div>
                {ex && (
                  <ExplainWhyBlock
                    spec={ex}
                    seedKey={`${beatKey}|why|${j}`}
                    pickedOrig={st.fadeWhyPicked[j] ?? null}
                    subj={subj}
                    onPick={(origIdx) => {
                      const ok = origIdx === (ex.a ?? 0);
                      onSound(ok ? 'ok' : 'no');
                      onUpdate({ fadeWhyPicked: { ...st.fadeWhyPicked, [j]: origIdx } });
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {shown < stepCount && isAskStep && activeAskStep && (
          <div className="rounded-2xl bg-[var(--card)] border-2 border-[var(--gold)] p-4 flex flex-col gap-3 anim-rise">
            <span className="eyebrow text-[var(--gold)]">Step {shown + 1} — fill it in</span>
            <div className="text-[16px] font-semibold text-[var(--ink)]" dangerouslySetInnerHTML={{ __html: typesetMathHtml(activeAskStep.ask || activeAskStep.m, subj) }} />
            <div className="flex flex-col gap-2">
              {perm(`${beatKey}|ask|${shown}`, activeAskStep.o!.length).map((origIdx, dispIdx) => {
                const isPicked = st.fadeAns[shown] === origIdx;
                const isRight = origIdx === (activeAskStep.a ?? 0);
                const cls = isPicked ? (isRight ? 'ok' : 'no') : '';
                return (
                  <button
                    key={origIdx}
                    type="button"
                    disabled={activeAnswered}
                    onClick={() => {
                      onSound(isRight ? 'ok' : 'no');
                      onUpdate({
                        fadeAns: { ...st.fadeAns, [shown]: origIdx },
                        fadeShow: isRight ? shown + 1 : shown,
                        fadeHint: isRight ? 0 : st.fadeHint,
                      });
                    }}
                    className={`opt-tile ${cls}`}
                  >
                    <span className="w-7 h-7 rounded-lg bg-[var(--deep)] border border-[var(--line)] font-extrabold text-[13px] flex items-center justify-center shrink-0">
                      {String.fromCharCode(65 + dispIdx)}
                    </span>
                    <span className="flex-1" dangerouslySetInnerHTML={{ __html: typesetMathHtml(activeAskStep.o![origIdx], subj) }} />
                  </button>
                );
              })}
            </div>
            {st.fadeAns[shown] != null && activeAskStep.fb && activeAskStep.fb[st.fadeAns[shown]] && (
              <div
                className="rounded-xl bg-[var(--bad-soft)] border border-[var(--bad-line)] p-3 text-[14px]"
                dangerouslySetInnerHTML={{ __html: typesetMathHtml(activeAskStep.fb[st.fadeAns[shown]], subj) }}
              />
            )}
            {activeAskStep.h && activeAskStep.h.length > 0 && st.fadeHint < activeAskStep.h.length && (
              <button
                type="button"
                onClick={() => onUpdate({ fadeHint: st.fadeHint + 1 })}
                className="self-start text-[13px] font-bold text-[var(--hint)] hover:underline cursor-pointer"
              >
                Need a hint?
              </button>
            )}
            {activeAskStep.h &&
              activeAskStep.h.slice(0, st.fadeHint).map((hint, hi) => (
                <div
                  key={hi}
                  className="rounded-xl bg-[var(--hint-soft)] border border-[var(--hint-line)] p-3 text-[14px]"
                  dangerouslySetInnerHTML={{ __html: typesetMathHtml(hint, subj) }}
                />
              ))}
          </div>
        )}

        {shown < stepCount && !isAskStep && (
          <button
            type="button"
            onClick={() => {
              onUpdate({ fadeShow: shown + 1 });
            }}
            className="btn-tactile paper w-full"
          >
            {shown === 0 ? 'Show step 1' : `Show step ${shown + 1}`}
          </button>
        )}
      </div>
    );
  }

  if (beat.k === 'spot') {
    const b = beat as SpotBeat;
    const foundLine = st.spotLine === b.bad;
    const rightDiag = b.a ?? 0;
    const diagSolved = st.spotPicked === rightDiag;
    const order = perm(`${beatKey}|spot`, b.o.length);

    return (
      <div className="flex flex-col gap-4">
        {b.title && <h2 className="h22 text-[var(--ink)]">{b.title}</h2>}
        <p className="text-[15px] text-[var(--dim)]">
          <strong>{b.who}</strong> solved this question, but something went wrong. Tap the line with the mistake.
        </p>
        <div className="rtc-card rounded-2xl p-4 flex flex-col gap-3">
          <div className="qt text-[var(--ink)]" dangerouslySetInnerHTML={{ __html: typesetMathHtml(b.q, subj) }} />
          {inlineVisual && b.g && (
            <div className={inlineCls}>
              <DiagramFigure g={b.g} />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {b.lines.map((line, i) => {
            const isSel = st.spotLine === i;
            const isBad = i === b.bad;
            const cls = isSel
              ? isBad
                ? 'bg-[var(--ok-soft)] border-[var(--green)]'
                : 'bg-[var(--bad-soft)] border-[var(--coral)]'
              : 'bg-[var(--card)] border-[var(--line)] hover:border-[var(--acc-line)]';
            return (
              <button
                key={i}
                type="button"
                disabled={foundLine}
                onClick={() => {
                  onSound(isBad ? 'ok' : 'no');
                  onUpdate({ spotLine: i });
                }}
                className={`rounded-2xl border-2 px-4 py-3.5 text-left flex items-center gap-3 transition cursor-pointer disabled:cursor-default ${cls}`}
              >
                <span className="w-7 h-7 rounded-lg bg-[var(--deep)] font-extrabold text-[12px] flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <span className="sm flex-1" dangerouslySetInnerHTML={{ __html: typesetMathHtml(line, subj) }} />
              </button>
            );
          })}
        </div>

        {st.spotLine !== null && !foundLine && (
          <div className="rounded-xl bg-[var(--bad-soft)] border border-[var(--bad-line)] p-3.5 text-[14px]">
            <RichHtml html={typesetMathHtml(b.okfb[st.spotLine] || 'That line is fine. Look closely at the other steps.', subj)} />
          </div>
        )}

        {foundLine && (
          <div className="rtc-card rounded-2xl p-4 flex flex-col gap-3 anim-rise">
            <span className="eyebrow text-[var(--gold)]">Now explain what went wrong</span>
            <div className="flex flex-col gap-2">
              {order.map((origIdx, dispIdx) => {
                const isPicked = st.spotPicked === origIdx;
                const isRight = origIdx === rightDiag;
                const cls = isPicked ? (isRight ? 'ok' : 'no') : '';
                return (
                  <button
                    key={origIdx}
                    type="button"
                    disabled={diagSolved}
                    onClick={() => {
                      onSound(isRight ? 'ok' : 'no');
                      onUpdate({ spotPicked: origIdx });
                    }}
                    className={`opt-tile ${cls}`}
                  >
                    <span className="w-7 h-7 rounded-lg bg-[var(--deep)] border border-[var(--line)] font-extrabold text-[13px] flex items-center justify-center shrink-0">
                      {String.fromCharCode(65 + dispIdx)}
                    </span>
                    <span className="flex-1" dangerouslySetInnerHTML={{ __html: typesetMathHtml(b.o[origIdx], subj) }} />
                  </button>
                );
              })}
            </div>
            {st.spotPicked !== null && b.fb[st.spotPicked] && (
              <div
                className={`rounded-xl border p-3.5 text-[14px] ${
                  diagSolved
                    ? 'bg-[var(--ok-soft)] border-[var(--ok-line)]'
                    : 'bg-[var(--bad-soft)] border-[var(--bad-line)]'
                }`}
                dangerouslySetInnerHTML={{ __html: typesetMathHtml(b.fb[st.spotPicked], subj) }}
              />
            )}
            {!diagSolved && b.h && b.h.length > 0 && st.spotHint < b.h.length && (
              <button
                type="button"
                onClick={() => onUpdate({ spotHint: st.spotHint + 1 })}
                className="self-start text-[13px] font-bold text-[var(--hint)] hover:underline cursor-pointer"
              >
                Need a hint?
              </button>
            )}
            {b.h &&
              b.h.slice(0, st.spotHint).map((hint, hi) => (
                <div
                  key={hi}
                  className="rounded-xl bg-[var(--hint-soft)] border border-[var(--hint-line)] p-3 text-[14px]"
                  dangerouslySetInnerHTML={{ __html: typesetMathHtml(hint, subj) }}
                />
              ))}
            {diagSolved && (
              <div className="rounded-xl bg-[var(--ok-soft)] border border-[var(--ok-line)] p-3.5 flex flex-col gap-1">
                <span className="eyebrow text-[var(--green)]">The right working</span>
                <div className="sm text-[var(--ink)]" dangerouslySetInnerHTML={{ __html: typesetMathHtml(b.fix, subj) }} />
              </div>
            )}
            {diagSolved && b.why && (
              <ExplainWhyBlock
                spec={b.why}
                seedKey={`${beatKey}|spotwhy`}
                pickedOrig={st.spotWhyPicked}
                subj={subj}
                onPick={(origIdx) => {
                  onSound(origIdx === (b.why?.a ?? 0) ? 'ok' : 'no');
                  onUpdate({ spotWhyPicked: origIdx });
                }}
              />
            )}
          </div>
        )}
      </div>
    );
  }

  // check beat
  const b = beat as CheckBeat;
  const order = perm(`${beatKey}|chk`, b.o.length);
  const rightOrig = b.a ?? 0;
  const solved = st.checkPicked === rightOrig;
  const compact = b.o.every((x) => x.replace(/<[^>]+>/g, '').length <= 8);

  return (
    <div className="flex flex-col gap-4">
      {b.title && <h2 className="h22 text-[var(--ink)]">{b.title}</h2>}
      <div className="rtc-card rounded-2xl p-4 flex flex-col gap-3">
        <div className="qt text-[var(--ink)]" dangerouslySetInnerHTML={{ __html: typesetMathHtml(b.q, subj) }} />
        {inlineVisual && b.g && (
          <div className={inlineCls}>
            <DiagramFigure g={b.g} />
          </div>
        )}
        {b.given && b.given.length > 0 && (
          <div className="flex flex-col gap-1.5 pt-2 border-t border-[var(--line)]">
            {b.given.map((g, i) => (
              <div key={i} className="sm text-[var(--dim)]" dangerouslySetInnerHTML={{ __html: typesetMathHtml(g, subj) }} />
            ))}
          </div>
        )}
        {b.ask && <div className="text-[16px] font-bold text-[var(--gold)]" dangerouslySetInnerHTML={{ __html: typesetMathHtml(b.ask, subj) }} />}
      </div>

      <div className={compact ? 'two grid grid-cols-2 gap-2.5' : 'flex flex-col gap-2.5'}>
        {order.map((origIdx, dispIdx) => {
          const isPicked = st.checkPicked === origIdx;
          const isRight = origIdx === rightOrig;
          const cls = isPicked
            ? isRight
              ? 'ok'
              : 'no anim-shake'
            : solved
              ? 'opt-eliminated'
              : '';
          return (
            <button
              key={origIdx}
              type="button"
              disabled={solved}
              onClick={() => {
                onSound(isRight ? 'ok' : 'no');
                onUpdate({ checkPicked: origIdx });
              }}
              className={`opt-tile ${compact ? 'two-col' : ''} ${cls}`}
            >
              {!compact && (
                <span className="w-7 h-7 rounded-lg bg-[var(--deep)] border border-[var(--line)] font-extrabold text-[13px] flex items-center justify-center shrink-0">
                  {String.fromCharCode(65 + dispIdx)}
                </span>
              )}
              <span className={compact ? 'opt' : 'flex-1'} dangerouslySetInnerHTML={{ __html: typesetMathHtml(b.o[origIdx], subj) }} />
              {solved && isRight && !compact && (
                <Icon name="check" size={18} className="text-[var(--green)] shrink-0 anim-check-draw" />
              )}
            </button>
          );
        })}
      </div>

      {st.checkPicked !== null && b.fb && b.fb[st.checkPicked] && (
        <div
          className={`anim-explain-reveal rounded-2xl border p-4 text-[15px] leading-relaxed ${
            solved ? 'bg-[var(--ok-soft)] border-[var(--ok-line)]' : 'bg-[var(--bad-soft)] border-[var(--bad-line)]'
          }`}
          dangerouslySetInnerHTML={{ __html: typesetMathHtml(b.fb[st.checkPicked], subj) }}
        />
      )}

      {!solved && b.h && b.h.filter(Boolean).length > 0 && st.checkHint < b.h.filter(Boolean).length && (
        <button
          type="button"
          onClick={() => onUpdate({ checkHint: st.checkHint + 1 })}
          className="self-start text-[14px] font-bold text-[var(--hint)] hover:underline cursor-pointer"
        >
          Show a hint
        </button>
      )}
      {b.h &&
        b.h
          .filter(Boolean)
          .slice(0, st.checkHint)
          .map((hint, hi) => (
            <div
              key={hi}
              className="rounded-2xl bg-[var(--hint-soft)] border border-[var(--hint-line)] p-3.5 text-[14px]"
              dangerouslySetInnerHTML={{ __html: typesetMathHtml(hint, subj) }}
            />
          ))}

      {solved && b.why && (
        <ExplainWhyBlock
          spec={b.why}
          seedKey={`${beatKey}|chkwhy`}
          pickedOrig={st.checkWhyPicked}
          subj={subj}
          onPick={(origIdx) => {
            onSound(origIdx === (b.why?.a ?? 0) ? 'ok' : 'no');
            onUpdate({ checkWhyPicked: origIdx });
          }}
        />
      )}
    </div>
  );
}
