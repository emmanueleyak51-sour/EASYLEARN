import React, { useRef, useState } from 'react';
import {
  BALL_COLORS,
  BNAME,
  CIRCLE_CENTER,
  CIRCLE_RADIUS,
  DMODE,
  QN,
  actBag,
  actTree,
  bagHint,
  bagList,
  calcCirc,
  circHint,
  cycAngles,
  diceCount,
  diceHint,
  diceHit,
  dirTo,
  dragCirc,
  dragCyc,
  dragParab,
  dragRoots,
  frame,
  initBag,
  initCirc,
  initCyc,
  initDice,
  initParab,
  initRoots,
  initTree,
  md360,
  moveCirc,
  moveCyc,
  onCircle,
  parabHint,
  parabSummary,
  qroots,
  r1,
  rad2,
  rootsFrame,
  rootsHint,
  treeBranches,
  treePaths,
  treeProb,
  type BagState,
  type CircState,
  type CycState,
  type DiceMode,
  type DiceState,
  type ExplorerKind,
  type Frame,
  type ParabState,
  type RootsState,
  type TreePick,
  type TreeState,
} from '../utils/explorerLogic';
import { MN, fr, frac, gcd, nm, poly } from '../utils/mathMarkup';
import {
  initAtomBuild,
  initEquil,
  initGasLaw,
  initGibbs,
  initPhScale,
  type ChemExplorerKind,
} from '../utils/chemExplorerLogic';
import { ChemExplorerView } from './ChemExplorers';

const CHEM_EXPLORER_KINDS: ChemExplorerKind[] = ['gaslaw', 'atombuild', 'phscale', 'gibbs', 'equil'];

export function initExplorerState(kind: ExplorerKind, cfg: Record<string, any> = {}): any {
  switch (kind) {
    case 'parab':
      return initParab(cfg);
    case 'roots':
      return initRoots(cfg);
    case 'circ':
      return initCirc(cfg);
    case 'cyc':
      return initCyc(cfg);
    case 'bag':
      return initBag(cfg);
    case 'dice':
      return initDice(cfg);
    case 'tree':
      return initTree(cfg);
    case 'gaslaw':
      return initGasLaw(cfg);
    case 'atombuild':
      return initAtomBuild(cfg);
    case 'phscale':
      return initPhScale(cfg);
    case 'gibbs':
      return initGibbs(cfg);
    case 'equil':
      return initEquil(cfg);
  }
}

function SliderRow({
  label,
  min,
  max,
  step,
  value,
  display,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  display?: string;
  onChange: (val: number) => void;
}) {
  return (
    <label className="flex items-center gap-3 min-h-[38px] text-[14px] font-semibold text-white/85 select-none">
      <span className="min-w-[82px] text-[var(--dim)]">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 accent-[var(--gold)] h-2 cursor-pointer"
      />
      <output className="min-w-[44px] text-right font-bold tabular-nums text-[var(--gold)] font-[var(--display)]">
        {display ?? nm(value)}
      </output>
    </label>
  );
}

function Stepper({
  label,
  value,
  color,
  canDec,
  canInc,
  onDec,
  onInc,
}: {
  label: string;
  value: number;
  color: string;
  canDec: boolean;
  canInc: boolean;
  onDec: () => void;
  onInc: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 bg-[#15241C] border border-white/10 rounded-xl px-3 py-2">
      <div className="flex items-center gap-2.5 text-[14px] font-semibold">
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
          <circle cx="7" cy="7" r="6" fill={color} />
        </svg>
        <span>{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onDec}
          disabled={!canDec}
          aria-label={`Remove ${label}`}
          className="w-10 h-10 rounded-xl bg-[var(--card)] border border-[var(--line)] text-white font-bold text-lg flex items-center justify-center disabled:opacity-35 cursor-pointer"
        >
          −
        </button>
        <span className="min-w-[24px] text-center font-extrabold tabular-nums text-[var(--gold)]">
          {value}
        </span>
        <button
          type="button"
          onClick={onInc}
          disabled={!canInc}
          aria-label={`Add ${label}`}
          className="w-10 h-10 rounded-xl bg-[var(--card)] border border-[var(--line)] text-white font-bold text-lg flex items-center justify-center disabled:opacity-35 cursor-pointer"
        >
          +
        </button>
      </div>
    </div>
  );
}

function ReadRow({ label, html }: { label: string; html: string }) {
  return (
    <div className="xr">
      <span dangerouslySetInnerHTML={{ __html: label }} />
      <b dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

function renderAxesSvg(F: Frame, xstep: number, ystep: number, ylab: boolean): string {
  let g = '';
  for (let x = Math.ceil(F.x0); x <= F.x1; x++) {
    g += `<line class="gr" x1="${F.X(x)}" y1="${F.T}" x2="${F.X(x)}" y2="${F.T + F.h}"/>`;
  }
  if (ystep) {
    for (let y = Math.ceil(F.y0 / ystep) * ystep; y <= F.y1; y += ystep) {
      g += `<line class="gr" x1="${F.L}" y1="${F.Y(y)}" x2="${F.L + F.w}" y2="${F.Y(y)}"/>`;
    }
  }
  g += `<line class="ax" x1="${F.L}" y1="${F.Y(0)}" x2="${F.L + F.w}" y2="${F.Y(0)}"/>`;
  g += `<line class="ax" x1="${F.X(0)}" y1="${F.T}" x2="${F.X(0)}" y2="${F.T + F.h}"/>`;
  for (let x = Math.ceil(F.x0 / xstep) * xstep; x <= F.x1; x += xstep) {
    if (x) g += `<text class="tk" x="${F.X(x)}" y="${F.Y(0) + 13}" text-anchor="middle">${nm(x)}</text>`;
  }
  if (ystep && ylab) {
    for (let y = Math.ceil(F.y0 / ystep) * ystep; y <= F.y1; y += ystep) {
      if (y) g += `<text class="tk" x="${F.X(0) - 4}" y="${F.Y(y) + 3}" text-anchor="end">${nm(y)}</text>`;
    }
  }
  g += `<text class="tk" x="${F.L + F.w - 2}" y="${F.Y(0) - 5}" text-anchor="end">x</text>`;
  return g;
}

function renderCurvePath(F: Frame, f: (x: number) => number): string {
  let d = '';
  let on = false;
  for (let i = 0; i <= 200; i++) {
    const x = F.x0 + ((F.x1 - F.x0) * i) / 200;
    const y = f(x);
    const ok = y >= F.y0 - 2 && y <= F.y1 + 2;
    if (ok) {
      const cy = Math.max(F.y0 - 2, Math.min(F.y1 + 2, y));
      d += `${on ? 'L' : 'M'}${F.X(x).toFixed(1)} ${F.Y(cy).toFixed(1)}`;
      on = true;
    } else {
      on = false;
    }
  }
  return `<clipPath id="ilclip"><rect x="${F.L}" y="${F.T}" width="${F.w}" height="${F.h}"/></clipPath><path class="cv" clip-path="url(#ilclip)" d="${d}"/>`;
}

function DragHandle({
  name,
  x,
  y,
  color,
  label,
}: {
  name: string;
  x: number;
  y: number;
  color: string;
  label?: string;
}) {
  return (
    <g className="hd" data-drag={name} color={color}>
      <circle className="hit" cx={x.toFixed(1)} cy={y.toFixed(1)} r={22} />
      <circle className="ring" cx={x.toFixed(1)} cy={y.toFixed(1)} r={13} />
      <circle cx={x.toFixed(1)} cy={y.toFixed(1)} r={7.5} fill={color} stroke="#0F1D16" strokeWidth={2} />
      {label && (
        <text
          className="mk"
          fill={color}
          x={x.toFixed(1)}
          y={(y - 18).toFixed(1)}
          textAnchor="middle"
        >
          {label}
        </text>
      )}
    </g>
  );
}

function arcMarkSvg(
  v: [number, number],
  d0: number,
  span: number,
  r: number,
  cls: string,
  label: string,
  ld?: number
): string {
  const a: [number, number] = [v[0] + r * Math.cos(rad2(d0)), v[1] - r * Math.sin(rad2(d0))];
  const e: [number, number] = [v[0] + r * Math.cos(rad2(d0 + span)), v[1] - r * Math.sin(rad2(d0 + span))];
  const m = d0 + span / 2;
  const dist = ld || r + 16;
  const lp: [number, number] = [v[0] + dist * Math.cos(rad2(m)), v[1] - dist * Math.sin(rad2(m))];
  return `<path class="${cls}" d="M${a[0].toFixed(1)} ${a[1].toFixed(1)} A${r} ${r} 0 ${span > 180 ? 1 : 0} 0 ${e[0].toFixed(1)} ${e[1].toFixed(1)}"/><text class="mk ${cls === 'lg' ? 'mg' : cls === 'lb' ? 'mb' : 'mgr'}" x="${lp[0].toFixed(1)}" y="${lp[1].toFixed(1)}" text-anchor="middle" dy=".35em">${label}</text>`;
}

function insMarkSvg(
  v: [number, number],
  p: [number, number],
  q: [number, number],
  cls: string,
  label: string,
  r = 20
): string {
  const dA = dirTo(v, p);
  const dB = dirTo(v, q);
  let s0 = dA;
  let sp = md360(dB - dA);
  if (sp > 180) {
    s0 = dB;
    sp = 360 - sp;
  }
  return arcMarkSvg(v, s0, sp, r, cls, label, r + 17);
}

const degs = (v: number) => `${nm(r1(v))}°`;

export function ExplorerCanvas({
  kind,
  cfg = {},
  state,
  onChange,
  onDrawSound,
}: {
  kind: ExplorerKind;
  cfg?: Record<string, any>;
  state: any;
  onChange: (nextState: any) => void;
  onDrawSound?: (count?: number) => void;
}) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);

  if (CHEM_EXPLORER_KINDS.includes(kind as ChemExplorerKind)) {
    return <ChemExplorerView kind={kind as ChemExplorerKind} state={state} onChange={onChange} />;
  }

  const toSvgCoords = (clientX: number, clientY: number): [number, number] | null => {
    const svg = svgRef.current;
    if (!svg) return null;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const out = pt.matrixTransform(ctm.inverse());
    return [out.x, out.y];
  };

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    const target = (e.target as Element).closest('[data-drag]');
    if (!target) return;
    const name = target.getAttribute('data-drag');
    if (!name) return;
    e.preventDefault();
    setDragging(name);
    svgRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const pt = toSvgCoords(e.clientX, e.clientY);
    if (!pt) return;
    const [px, py] = pt;
    if (kind === 'parab') onChange(dragParab(state as ParabState, px, py));
    else if (kind === 'roots') onChange(dragRoots(state as RootsState, dragging as 'p' | 'q', px));
    else if (kind === 'circ') onChange(dragCirc(state as CircState, dragging as any, px, py));
    else if (kind === 'cyc') onChange(dragCyc(state as CycState, dragging as any, px, py));
  };

  const handlePointerUp = () => {
    setDragging(null);
  };

  let visual: React.ReactNode = null;
  let controls: React.ReactNode = null;
  let readouts: React.ReactNode = null;
  let hintText = '';

  if (kind === 'parab') {
    const s = state as ParabState;
    const F = frame(-8, 8, -10, 12);
    const R = qroots(s.a, s.b, s.c);
    const sum = parabSummary(s, cfg);
    hintText = parabHint(s);
    const h = s.a ? -s.b / (2 * s.a) : 0;
    const k = s.a ? s.c - (s.b * s.b) / (4 * s.a) : 0;
    const showVertex = s.a !== 0 && h > -8 && h < 8 && k > -10 && k < 12;

    visual = (
      <svg
        ref={svgRef}
        id="ilx-svg"
        viewBox="0 0 320 240"
        role="img"
        aria-label={`Graph of y = ${poly(s.a, s.b, s.c).replace(/<[^>]+>/g, '')}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <g
          dangerouslySetInnerHTML={{
            __html: renderAxesSvg(F, 2, 2, false) + renderCurvePath(F, (x) => s.a * x * x + s.b * x + s.c),
          }}
        />
        {R.r.map((r, idx) =>
          r >= -8 && r <= 8 ? (
            <circle key={idx} className="rt" cx={F.X(r).toFixed(1)} cy={F.Y(0)} r={6} />
          ) : null
        )}
        {showVertex && <DragHandle name="v" x={F.X(h)} y={F.Y(k)} color="#FFC531" />}
      </svg>
    );

    controls = (
      <div className="flex flex-col gap-1.5">
        {cfg.showA && (
          <SliderRow
            label="a (x²)"
            min={-3}
            max={3}
            step={1}
            value={s.a}
            onChange={(v) => onChange({ ...s, a: v })}
          />
        )}
        <SliderRow
          label="b (x)"
          min={-8}
          max={8}
          step={1}
          value={s.b}
          onChange={(v) => onChange({ ...s, b: v })}
        />
        <SliderRow
          label="c (number)"
          min={-12}
          max={12}
          step={1}
          value={s.c}
          onChange={(v) => onChange({ ...s, c: v })}
        />
        <p className="text-[12px] text-[var(--dim)]">Drag the gold turning point, or adjust the sliders.</p>
      </div>
    );

    readouts = (
      <div className="xread">
        <div className="xeq" dangerouslySetInnerHTML={{ __html: sum.eqHtml }} />
        {cfg.disc && s.a !== 0 && (
          <ReadRow
            label="b² − 4ac"
            html={`${sum.discText} <span class="badge2 ${sum.discBadge.cls}">${sum.discBadge.text}</span>`}
          />
        )}
        <ReadRow label="Roots (where y = 0)" html={sum.rootsHtml} />
        {sum.factHtml && <ReadRow label="Factorised" html={sum.factHtml} />}
      </div>
    );
  } else if (kind === 'roots') {
    const s = state as RootsState;
    const F = rootsFrame(s);
    const S = s.p + s.q;
    const Pr = s.p * s.q;
    hintText = rootsHint(s);

    visual = (
      <svg
        ref={svgRef}
        id="ilx-svg"
        viewBox="0 0 320 240"
        role="img"
        aria-label={`Graph with roots ${s.p} and ${s.q}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <g
          dangerouslySetInnerHTML={{
            __html: renderAxesSvg(F, 1, 0, false) + renderCurvePath(F, (x) => (x - s.p) * (x - s.q)),
          }}
        />
        <DragHandle name="p" x={F.X(s.p)} y={F.Y(0)} color="#2BD67B" label="α" />
        <DragHandle name="q" x={F.X(s.q)} y={F.Y(0)} color="#FFC531" label="β" />
      </svg>
    );

    controls = (
      <div className="flex flex-col gap-1.5">
        <SliderRow label="Root α" min={-6} max={6} step={1} value={s.p} onChange={(v) => onChange({ ...s, p: v })} />
        <SliderRow label="Root β" min={-6} max={6} step={1} value={s.q} onChange={(v) => onChange({ ...s, q: v })} />
        <p className="text-[12px] text-[var(--dim)]">Drag α or β along the x-axis, or adjust the sliders.</p>
      </div>
    );

    readouts = (
      <div className="xread">
        <div className="xeq" dangerouslySetInnerHTML={{ __html: `${poly(1, -S, Pr)} = 0` }} />
        <ReadRow
          label="Sum α + β"
          html={`${nm(s.p)} + ${s.p < 0 || s.q < 0 ? `(${nm(s.q)})` : nm(s.q)} = ${nm(S)}`}
        />
        <ReadRow
          label="Product αβ"
          html={`${nm(s.p)} × ${s.q < 0 ? `(${nm(s.q)})` : nm(s.q)} = ${nm(Pr)}`}
        />
        <ReadRow label="x² − (sum)x + (product)" html={`x² − (${nm(S)})x + (${nm(Pr)})`} />
      </div>
    );
  } else if (kind === 'circ') {
    const s = state as CircState;
    const c = calcCirc(s);
    const A = onCircle(s.A);
    const B = onCircle(s.B);
    const P = onCircle(s.P);
    const Q = onCircle(s.Q);
    hintText = circHint(s);

    const ptLab = (d: number, t: string) => {
      const pt = onCircle(d, CIRCLE_RADIUS + 15);
      return `<text class="pl" x="${pt[0].toFixed(1)}" y="${pt[1].toFixed(1)}" text-anchor="middle" dy=".35em">${t}</text>`;
    };
    const ln = (p: [number, number], q: [number, number], cl: string) =>
      `<line class="${cl}" x1="${p[0].toFixed(1)}" y1="${p[1].toFixed(1)}" x2="${q[0].toFixed(1)}" y2="${q[1].toFixed(1)}"/>`;

    let g =
      `<circle class="ln" cx="${CIRCLE_CENTER[0]}" cy="${CIRCLE_CENTER[1]}" r="${CIRCLE_RADIUS}"/>` +
      ln(CIRCLE_CENTER, A, 'lgr') +
      ln(CIRCLE_CENTER, B, 'lgr') +
      ln(P, A, 'lg') +
      ln(P, B, 'lg');
    if (s.showQ) g += ln(Q, A, 'lb') + ln(Q, B, 'lb');
    g += arcMarkSvg(
      CIRCLE_CENTER,
      c.pAB ? s.B : s.A,
      c.cen,
      c.cen > 180 ? 16 : 22,
      'lgr',
      degs(c.cen),
      c.cen > 180 ? 34 : 40
    );
    g += insMarkSvg(P, A, B, 'lg', degs(c.ins));
    if (s.showQ) g += insMarkSvg(Q, A, B, 'lb', degs(c.insQ));
    const oYOff = Math.sin(rad2((c.pAB ? s.B : s.A) + c.cen / 2)) > 0 ? 16 : -12;
    g += `<circle cx="${CIRCLE_CENTER[0]}" cy="${CIRCLE_CENTER[1]}" r="3.5" fill="currentColor"/><text class="pl" x="${CIRCLE_CENTER[0]}" y="${CIRCLE_CENTER[1] + oYOff}" text-anchor="middle">O</text>`;
    g += ptLab(s.A, 'A') + ptLab(s.B, 'B') + ptLab(s.P, 'P') + (s.showQ ? ptLab(s.Q, 'Q') : '');

    visual = (
      <svg
        ref={svgRef}
        id="ilx-svg"
        viewBox="0 0 320 244"
        role="img"
        aria-label={`Circle with centre O. Angle at the centre ${r1(c.cen)} degrees, angle APB ${r1(c.ins)} degrees`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <g dangerouslySetInnerHTML={{ __html: g }} />
        <DragHandle name="A" x={A[0]} y={A[1]} color="#F2F7F3" />
        <DragHandle name="B" x={B[0]} y={B[1]} color="#F2F7F3" />
        <DragHandle name="P" x={P[0]} y={P[1]} color="#FFC531" />
        {s.showQ && <DragHandle name="Q" x={Q[0]} y={Q[1]} color="#8CCBFF" />}
      </svg>
    );

    controls = (
      <div className="flex flex-col gap-2">
        <SliderRow label="Move P" min={0} max={359} step={1} value={s.P} display={`${s.P}°`} onChange={(v) => onChange(moveCirc(s, 'P', v))} />
        <SliderRow label="Move A" min={0} max={358} step={2} value={s.A} display={`${s.A}°`} onChange={(v) => onChange(moveCirc(s, 'A', v))} />
        <SliderRow label="Move B" min={0} max={358} step={2} value={s.B} display={`${s.B}°`} onChange={(v) => onChange(moveCirc(s, 'B', v))} />
        {s.showQ && (
          <SliderRow label="Move Q" min={0} max={359} step={1} value={s.Q} display={`${s.Q}°`} onChange={(v) => onChange(moveCirc(s, 'Q', v))} />
        )}
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={() => onChange({ ...s, showQ: !s.showQ })}
            className={`chip min-h-[40px] px-3.5 rounded-full text-[13px] font-bold border transition cursor-pointer ${s.showQ ? 'on' : ''}`}
          >
            {s.showQ ? 'Hide point Q' : 'Add a second point Q'}
          </button>
        </div>
        <p className="text-[12px] text-[var(--dim)]">Drag any point round the circle.</p>
      </div>
    );

    readouts = (
      <div className="xread">
        <ReadRow
          label="Angle at the centre, on the arc P faces"
          html={`<span class="green-t">${degs(c.cen)}</span>${c.cen > 180 ? ' (reflex)' : ''}`}
        />
        <ReadRow label="∠APB at the circumference" html={`<span class="gold-t">${degs(c.ins)}</span>`} />
        {s.showQ && <ReadRow label="∠AQB" html={`<span class="text-[#8CCBFF]">${degs(c.insQ)}</span>`} />}
        <ReadRow
          label="Half the angle at the centre"
          html={`½ × ${degs(c.cen)} = ${degs(c.cen / 2)} ${Math.abs(c.cen / 2 - c.ins) < 0.6 ? '<span class="badge2 g">= ∠APB</span>' : ''}`}
        />
      </div>
    );
  } else if (kind === 'cyc') {
    const s = state as CycState;
    const P = s.p.map((d) => onCircle(d));
    const a = cycAngles(s);
    const cols = ['lg', 'lb', 'lg', 'lb'];

    const ptLab = (d: number, t: string) => {
      const pt = onCircle(d, CIRCLE_RADIUS + 15);
      return `<text class="pl" x="${pt[0].toFixed(1)}" y="${pt[1].toFixed(1)}" text-anchor="middle" dy=".35em">${t}</text>`;
    };

    let g = `<circle class="ln" cx="${CIRCLE_CENTER[0]}" cy="${CIRCLE_CENTER[1]}" r="${CIRCLE_RADIUS}"/>`;
    g += `<circle cx="${CIRCLE_CENTER[0]}" cy="${CIRCLE_CENTER[1]}" r="3" fill="currentColor" opacity=".5"/>`;
    g += `<polygon class="ln" points="${P.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ')}"/>`;
    QN.forEach((n, i) => {
      g += insMarkSvg(P[i], P[(i + 3) % 4], P[(i + 1) % 4], cols[i], degs(a[n]), 18);
    });
    if (s.ext) {
      const C = P[2];
      const D = P[3];
      const u = [C[0] - D[0], C[1] - D[1]];
      const L = Math.hypot(u[0], u[1]) || 1;
      const E: [number, number] = [C[0] + (u[0] / L) * 64, C[1] + (u[1] / L) * 64];
      g += `<line class="ln dsh" x1="${C[0].toFixed(1)}" y1="${C[1].toFixed(1)}" x2="${E[0].toFixed(1)}" y2="${E[1].toFixed(1)}"/>`;
      g += insMarkSvg(C, E, P[1], 'lg', degs(a.A), 26);
    }
    QN.forEach((n, i) => {
      g += ptLab(s.p[i], n);
    });

    visual = (
      <svg
        ref={svgRef}
        id="ilx-svg"
        viewBox="0 0 320 244"
        role="img"
        aria-label={`Cyclic quadrilateral ABCD. Angles A ${a.A}, B ${a.B}, C ${a.C}, D ${a.D} degrees`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <g dangerouslySetInnerHTML={{ __html: g }} />
        {QN.map((n, i) => (
          <DragHandle key={n} name={n} x={P[i][0]} y={P[i][1]} color={i % 2 ? '#8CCBFF' : '#FFC531'} />
        ))}
      </svg>
    );

    controls = (
      <div className="flex flex-col gap-1.5">
        {QN.map((n, i) => (
          <SliderRow
            key={n}
            label={`Move ${n}`}
            min={0}
            max={358}
            step={2}
            value={s.p[i]}
            display={`${s.p[i]}°`}
            onChange={(v) => onChange(moveCyc(s, i, v))}
          />
        ))}
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={() => onChange({ ...s, ext: !s.ext })}
            className={`chip min-h-[40px] px-3.5 rounded-full text-[13px] font-bold border transition cursor-pointer ${s.ext ? 'on' : ''}`}
          >
            {s.ext ? 'Hide the exterior angle at C' : 'Show the exterior angle at C'}
          </button>
        </div>
        <p className="text-[12px] text-[var(--dim)]">Drag the corners round the circle. They stay in order.</p>
      </div>
    );

    readouts = (
      <div className="xread">
        <ReadRow label='<span class="gold-t">∠A + ∠C</span>' html={`${degs(a.A)} + ${degs(a.C)} = <b class="gold-t">${degs(a.A + a.C)}</b>`} />
        <ReadRow label='<span class="text-[#8CCBFF]">∠B + ∠D</span>' html={`${degs(a.B)} + ${degs(a.D)} = <b class="text-[#8CCBFF]">${degs(a.B + a.D)}</b>`} />
        {s.ext && <ReadRow label="Exterior angle at C" html={`${degs(a.A)}, the same as ∠A`} />}
      </div>
    );
  } else if (kind === 'bag') {
    const s = state as BagState;
    const L = bagList(s);
    const N = L.length;
    const p = N ? s.r / N : 0;
    const X = (v: number) => 30 + 260 * v;
    hintText = bagHint(s);

    visual = (
      <svg id="ilx-svg" viewBox="0 0 320 250" role="img" aria-label={`Bag with ${s.r} red, ${s.b} blue and ${s.g} green balls`}>
        <path
          d="M70 52 Q70 34 98 34 L222 34 Q250 34 250 52 L268 176 Q272 204 242 204 L78 204 Q48 204 52 176 Z"
          fill="#15241C"
          stroke="currentColor"
          strokeOpacity={0.5}
          strokeWidth={2}
        />
        <path d="M98 34 Q160 18 222 34" fill="none" stroke="currentColor" strokeOpacity={0.35} strokeWidth={2} />
        {!N && (
          <text className="tk" x={160} y={122} textAnchor="middle">
            Empty bag. Add some balls.
          </text>
        )}
        {L.map((c, i) => {
          const row = Math.floor(i / 7);
          const col = i % 7;
          const inRow = Math.min(7, N - row * 7);
          const x = 160 - (inRow - 1) * 13 + col * 26;
          const y = 186 - row * 26;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={11}
              fill={BALL_COLORS[c]}
              stroke={i === s.last ? '#FFC531' : '#0F1D16'}
              strokeWidth={i === s.last ? 4 : 2}
            />
          );
        })}
        <line className="ax" x1={30} y1={226} x2={290} y2={226} />
        {[0, 0.5, 1].map((v, idx) => (
          <g key={v}>
            <line className="ax" x1={X(v)} y1={221} x2={X(v)} y2={231} />
            <text className="tk" x={X(v)} y={244} textAnchor="middle">
              {['0 impossible', '½', '1 certain'][idx]}
            </text>
          </g>
        ))}
        {N > 0 && <path d={`M${X(p) - 7} 212 L${X(p) + 7} 212 L${X(p)} 222 Z`} fill="#FFC531" />}
        {s.n > 0 && (
          <path
            d={`M${X(s.t.r / s.n) - 7} 240 L${X(s.t.r / s.n) + 7} 240 L${X(s.t.r / s.n)} 230 Z`}
            fill="#2BD67B"
          />
        )}
      </svg>
    );

    controls = (
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1.5">
          <Stepper
            label="Red balls"
            value={s.r}
            color={BALL_COLORS.r}
            canDec={s.r > 0}
            canInc={s.r < 9}
            onDec={() => onChange(actBag(s, 'r:-1'))}
            onInc={() => onChange(actBag(s, 'r:1'))}
          />
          <Stepper
            label="Blue balls"
            value={s.b}
            color={BALL_COLORS.b}
            canDec={s.b > 0}
            canInc={s.b < 9}
            onDec={() => onChange(actBag(s, 'b:-1'))}
            onInc={() => onChange(actBag(s, 'b:1'))}
          />
          <Stepper
            label="Green balls"
            value={s.g}
            color={BALL_COLORS.g}
            canDec={s.g > 0}
            canInc={s.g < 9}
            onDec={() => onChange(actBag(s, 'g:-1'))}
            onInc={() => onChange(actBag(s, 'g:1'))}
          />
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            disabled={!N}
            onClick={() => {
              onDrawSound?.(1);
              onChange(actBag(s, 'draw:1'));
            }}
            className="mini gold min-h-[40px] px-3.5 rounded-xl font-bold text-[13px] cursor-pointer disabled:opacity-40"
          >
            Draw once
          </button>
          <button
            type="button"
            disabled={!N}
            onClick={() => {
              onDrawSound?.(4);
              onChange(actBag(s, 'draw:100'));
            }}
            className="mini gold min-h-[40px] px-3.5 rounded-xl font-bold text-[13px] cursor-pointer disabled:opacity-40"
          >
            Draw 100 times
          </button>
          {s.n > 0 && (
            <button
              type="button"
              onClick={() => onChange(actBag(s, 'reset'))}
              className="mini min-h-[40px] px-3.5 rounded-xl font-bold text-[13px] border cursor-pointer"
            >
              Clear the draws
            </button>
          )}
        </div>
        <p className="text-[12px] text-[var(--dim)]">Every draw is put back before the next one.</p>
      </div>
    );

    readouts = (
      <div className="xread">
        <ReadRow
          label='<span class="gold-t">▼</span> P(red), the theory'
          html={N ? `${s.r} out of ${N} = ${frac(s.r, N)} = ${nm(s.r / N)}` : 'no balls'}
        />
        <ReadRow
          label='<span class="green-t">▲</span> Your draws'
          html={s.n ? `${s.t.r} red out of ${s.n} = ${nm(s.t.r / s.n)}` : 'none yet'}
        />
        {s.n > 0 && (
          <ReadRow
            label="All draws"
            html={(['r', 'b', 'g'] as const).map((c) => `${s.t[c]} ${BNAME[c]}`).join(', ')}
          />
        )}
      </div>
    );
  } else if (kind === 'dice') {
    const s = state as DiceState;
    const count = diceCount(s);
    const c = 36;
    const x0 = 50;
    const y0 = 46;
    hintText = diceHint(s);

    visual = (
      <svg id="ilx-svg" viewBox="0 0 280 270" role="img" aria-label={`Table of totals for two dice with ${count} squares highlighted`}>
        <text className="tk" x={x0 + 3 * c} y={14} textAnchor="middle">
          Second die
        </text>
        <text
          className="tk"
          x={14}
          y={y0 + 3 * c}
          textAnchor="middle"
          transform={`rotate(-90 14 ${y0 + 3 * c})`}
        >
          First die
        </text>
        {[1, 2, 3, 4, 5, 6].map((k) => (
          <g key={k}>
            <text className="pl" x={x0 + (k - 0.5) * c} y={y0 - 10} textAnchor="middle">
              {k}
            </text>
            <text className="pl" x={x0 - 12} y={y0 + (k - 0.5) * c + 5} textAnchor="middle">
              {k}
            </text>
          </g>
        ))}
        {[1, 2, 3, 4, 5, 6].flatMap((i) =>
          [1, 2, 3, 4, 5, 6].map((j) => {
            const on = diceHit(s, i, j);
            const x = x0 + (j - 1) * c;
            const y = y0 + (i - 1) * c;
            return (
              <g key={`${i}-${j}`}>
                <rect
                  x={x + 1.5}
                  y={y + 1.5}
                  width={c - 3}
                  height={c - 3}
                  rx={7}
                  fill={on ? '#FFC531' : '#15241C'}
                  stroke={on ? '#FFC531' : '#243A2F'}
                />
                <text
                  x={x + c / 2}
                  y={y + c / 2 + 5}
                  textAnchor="middle"
                  className="font-bold text-[14px]"
                  fill={on ? '#0C1712' : '#A3B8AC'}
                >
                  {i + j}
                </text>
              </g>
            );
          })
        )}
      </svg>
    );

    controls = (
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(DMODE) as DiceMode[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => onChange({ ...s, mode: k })}
              className={`chip min-h-[40px] px-3.5 rounded-full text-[13px] font-bold border transition cursor-pointer ${s.mode === k ? 'on' : ''}`}
            >
              {DMODE[k]}
            </button>
          ))}
        </div>
        {s.mode === 'tot' && (
          <SliderRow label="Total" min={2} max={12} step={1} value={s.n} onChange={(v) => onChange({ ...s, n: v })} />
        )}
      </div>
    );

    const probLabel =
      s.mode === 'tot' ? `P(total of ${s.n})` : s.mode === 'dbl' ? 'P(a double)' : 'P(at least one 6)';
    readouts = (
      <div className="xread">
        <ReadRow label="Squares that fit" html={`${count} of 36`} />
        <ReadRow label={probLabel} html={`${fr(count, 36)}${gcd(count, 36) > 1 ? ` = ${frac(count, 36)}` : ''}`} />
      </div>
    );
  } else if (kind === 'tree') {
    const s = state as TreeState;
    const T = treeBranches(s);
    const on = treePaths(s);
    const pr = treeProb(s);
    const f = (a: [number, number]) => `${a[0]}/${a[1]}`;
    const N: Record<string, [number, number]> = {
      o: [22, 112],
      R: [128, 60],
      B: [128, 164],
      RR: [226, 26],
      RB: [226, 88],
      BR: [226, 136],
      BB: [226, 198],
    };
    const lit = (k: string) => on.some((p) => p.startsWith(k) || p === k);
    const edge = (a: string, b: string, lab: string, k: string) => {
      const A = N[a];
      const Bp = N[b];
      const m = [(A[0] + Bp[0]) / 2, (A[1] + Bp[1]) / 2];
      const up = Bp[1] < A[1];
      return (
        `<line class="${lit(k) ? 'lg' : 'ln'}" x1="${A[0]}" y1="${A[1]}" x2="${Bp[0] - 10}" y2="${Bp[1]}" ${lit(k) ? '' : 'opacity=".45"'}/>` +
        `<text class="mk ${lit(k) ? 'mg' : ''}" x="${m[0] - 4}" y="${m[1] + (up ? -9 : 15)}" text-anchor="middle">${lab}</text>`
      );
    };
    const dot = (k: string, c: 'r' | 'b') =>
      `<circle cx="${N[k][0]}" cy="${N[k][1]}" r="9" fill="${BALL_COLORS[c]}" stroke="#0F1D16" stroke-width="2"/>`;

    let g =
      edge('o', 'R', f(T.R), 'R') +
      edge('o', 'B', f(T.B), 'B') +
      edge('R', 'RR', f(T.RR), 'RR') +
      edge('R', 'RB', f(T.RB), 'RB') +
      edge('B', 'BR', f(T.BR), 'BR') +
      edge('B', 'BB', f(T.BB), 'BB');
    g += `<circle cx="22" cy="112" r="5" fill="currentColor"/>` + dot('R', 'r') + dot('B', 'b');
    (['RR', 'RB', 'BR', 'BB'] as const).forEach((k) => {
      const a = T[k[0] as 'R' | 'B'];
      const b = T[k];
      const L = on.includes(k);
      g +=
        dot(k, k[1].toLowerCase() as 'r' | 'b') +
        `<text class="${L ? 'mk mg' : 'tk'}" x="${N[k][0] + 16}" y="${N[k][1] + 4}">${k[0]}${k[1]}: ${a[0] * b[0]}/${a[1] * b[1]}</text>`;
    });

    visual = (
      <svg
        id="ilx-svg"
        viewBox="0 0 320 222"
        role="img"
        aria-label={`Tree diagram for two picks from ${s.r} red and ${s.b} blue, ${s.rep ? 'with' : 'without'} replacement`}
        dangerouslySetInnerHTML={{ __html: g }}
      />
    );

    controls = (
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1.5">
          <Stepper
            label="Red balls"
            value={s.r}
            color={BALL_COLORS.r}
            canDec={s.r > 1}
            canInc={s.r < 8}
            onDec={() => onChange(actTree(s, 'r:-1'))}
            onInc={() => onChange(actTree(s, 'r:1'))}
          />
          <Stepper
            label="Blue balls"
            value={s.b}
            color={BALL_COLORS.b}
            canDec={s.b > 1}
            canInc={s.b < 8}
            onDec={() => onChange(actTree(s, 'b:-1'))}
            onInc={() => onChange(actTree(s, 'b:1'))}
          />
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={() => onChange(actTree(s, 'rep'))}
            className={`chip min-h-[40px] px-3.5 rounded-full text-[13px] font-bold border transition cursor-pointer ${s.rep ? 'on' : ''}`}
          >
            {s.rep ? 'Put back: on' : 'Put back: off'}
          </button>
          {(
            [
              ['rr', 'Both red'],
              ['bb', 'Both blue'],
              ['mix', 'One of each'],
            ] as [TreePick, string][]
          ).map(([k, lab]) => (
            <button
              key={k}
              type="button"
              onClick={() => onChange(actTree(s, `pick:${k}`))}
              className={`chip min-h-[40px] px-3.5 rounded-full text-[13px] font-bold border transition cursor-pointer ${s.pick === k ? 'on' : ''}`}
            >
              {lab}
            </button>
          ))}
        </div>
      </div>
    );

    readouts = (
      <div className="xread">
        <ReadRow
          label={pr.label}
          html={`${pr.parts.join(' + ')} = ${fr(pr.num, pr.den)}${gcd(pr.num, pr.den) > 1 && pr.num ? ` = ${frac(pr.num, pr.den)}` : ''}`}
        />
        <ReadRow
          label="Second pick out of"
          html={`${T.t2} balls ${s.rep ? '(the first one went back)' : '(one is gone)'}`}
        />
      </div>
    );
  }

  return (
    <section className="xp">
      <div className="xv">{visual}</div>
      {readouts}
      {controls}
      {hintText && (
        <div className="rounded-xl bg-[#15241C] border border-[var(--line)] p-3 flex items-start gap-2.5 text-[14px]">
          <span className="shrink-0 w-7 h-7 rounded-full bg-[var(--gold)] text-[#0C1712] font-extrabold text-[11px] flex items-center justify-center">
            SD
          </span>
          <p className="text-white/95 leading-snug" dangerouslySetInnerHTML={{ __html: hintText }} />
        </div>
      )}
    </section>
  );
}
