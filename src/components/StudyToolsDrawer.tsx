import React, { useEffect, useRef, useState } from 'react';
import { evaluateMathExpression, type CalcAngleMode } from '../utils/calculatorEngine';
import { Icon } from './Icons';

type ToolTab = 'calc' | 'pad';
type CalcMode = 'jamb' | 'sci';
type PaperStyle = 'grid' | 'lined' | 'blank';

const PEN_COLORS = [
  { id: 'ink', label: 'Slate Ink', color: '#0F172A' },
  { id: 'indigo', label: 'Indigo', color: '#3346DB' },
  { id: 'crimson', label: 'Crimson', color: '#DC2626' },
  { id: 'emerald', label: 'Emerald', color: '#059669' },
];

export function StudyToolsDrawer({
  open,
  initialTab = 'calc',
  onClose,
}: {
  open: boolean;
  initialTab?: ToolTab;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<ToolTab>(initialTab);
  const [calcMode, setCalcMode] = useState<CalcMode>('jamb');
  const [angleMode, setAngleMode] = useState<CalcAngleMode>('deg');
  const [expr, setExpr] = useState('');
  const [resultText, setResultText] = useState('0');
  const [errorText, setErrorText] = useState<string | null>(null);
  const [memory, setMemory] = useState<number>(0);
  const [history, setHistory] = useState<{ expr: string; res: string }[]>([]);

  // Scratchpad state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const [penColor, setPenColor] = useState(PEN_COLORS[0].color);
  const [eraser, setEraser] = useState(false);
  const [paper, setPaper] = useState<PaperStyle>('grid');
  const strokesRef = useRef<ImageData[]>([]);

  useEffect(() => {
    if (open) setTab(initialTab);
  }, [open, initialTab]);

  useEffect(() => {
    if (!open || tab !== 'pad') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (canvas.width !== 380 || canvas.height !== 360) {
      canvas.width = 380;
      canvas.height = 360;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  }, [open, tab]);

  if (!open) return null;

  const appendToken = (tok: string) => {
    setErrorText(null);
    setExpr((prev) => prev + tok);
  };

  const handleEvaluate = () => {
    if (!expr.trim()) return;
    const res = evaluateMathExpression(expr, angleMode);
    if (res.ok) {
      setResultText(res.formatted);
      setErrorText(null);
      setHistory((prev) => [{ expr, res: res.formatted }, ...prev].slice(0, 6));
      setExpr(res.formatted);
    } else {
      setErrorText(res.error);
    }
  };

  const getPointerPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = e.currentTarget.width / rect.width;
    const scaleY = e.currentTarget.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    strokesRef.current = [...strokesRef.current.slice(-14), ctx.getImageData(0, 0, canvas.width, canvas.height)];
    const { x, y } = getPointerPos(e);
    drawingRef.current = true;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const { x, y } = getPointerPos(e);
    ctx.globalCompositeOperation = eraser ? 'destination-out' : 'source-over';
    ctx.strokeStyle = penColor;
    ctx.lineWidth = eraser ? 18 : 2.6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handlePointerUp = () => {
    drawingRef.current = false;
  };

  const handleUndo = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || strokesRef.current.length === 0) return;
    const prev = strokesRef.current.pop();
    if (prev) ctx.putImageData(prev, 0, 0);
  };

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    strokesRef.current = [...strokesRef.current.slice(-14), ctx.getImageData(0, 0, canvas.width, canvas.height)];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div
      role="dialog"
      aria-label="Exam Tools: Calculator and Scratchpad"
      className="fixed inset-y-0 right-0 z-50 w-full max-w-[420px] bg-[var(--card)] border-l border-[var(--line)] shadow-2xl flex flex-col"
    >
      <div className="px-4 py-3.5 border-b border-[var(--line)] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--bg)] border border-[var(--line)]">
          <button
            type="button"
            onClick={() => setTab('calc')}
            className={`px-3 py-1.5 rounded-lg text-[12.5px] font-bold transition cursor-pointer whitespace-nowrap ${
              tab === 'calc'
                ? 'bg-[var(--card)] text-[var(--gold)] shadow-xs'
                : 'text-[var(--dim)] hover:text-[var(--ink)]'
            }`}
          >
            Calculator
          </button>
          <button
            type="button"
            onClick={() => setTab('pad')}
            className={`px-3 py-1.5 rounded-lg text-[12.5px] font-bold transition cursor-pointer whitespace-nowrap ${
              tab === 'pad'
                ? 'bg-[var(--card)] text-[var(--gold)] shadow-xs'
                : 'text-[var(--dim)] hover:text-[var(--ink)]'
            }`}
          >
            Rough-Work Pad
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close exam tools"
          className="w-8 h-8 rounded-lg border border-[var(--line)] flex items-center justify-center text-[var(--dim)] hover:text-[var(--ink)] cursor-pointer"
        >
          <Icon name="x" size={16} />
        </button>
      </div>

      {tab === 'calc' ? (
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[var(--bg)] border border-[var(--line)]">
              <button
                type="button"
                onClick={() => setCalcMode('jamb')}
                className={`px-2.5 py-1 rounded-md text-[11.5px] font-bold cursor-pointer ${
                  calcMode === 'jamb' ? 'bg-[var(--gold)] text-[var(--on-acc)]' : 'text-[var(--dim)]'
                }`}
              >
                JAMB 8-Fn
              </button>
              <button
                type="button"
                onClick={() => setCalcMode('sci')}
                className={`px-2.5 py-1 rounded-md text-[11.5px] font-bold cursor-pointer ${
                  calcMode === 'sci' ? 'bg-[var(--gold)] text-[var(--on-acc)]' : 'text-[var(--dim)]'
                }`}
              >
                WAEC Scientific
              </button>
            </div>
            {calcMode === 'sci' && (
              <button
                type="button"
                onClick={() => setAngleMode((m) => (m === 'deg' ? 'rad' : 'deg'))}
                className="px-2.5 py-1 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-[11.5px] font-bold font-mono text-[var(--gold)] cursor-pointer"
              >
                {angleMode.toUpperCase()}
              </button>
            )}
          </div>

          <div className="rtc-eq-plate rounded-xl p-4 flex flex-col gap-1.5 text-right">
            <input
              type="text"
              aria-label="Calculator expression"
              value={expr}
              onChange={(e) => {
                setErrorText(null);
                setExpr(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleEvaluate();
                }
              }}
              placeholder="0"
              className="w-full bg-transparent text-right font-mono text-[14px] text-slate-300 outline-none"
            />
            <div
              data-testid="calc-display-result"
              className="font-mono font-bold text-[26px] text-white tabular-nums truncate"
            >
              {errorText ? 'Error' : resultText}
            </div>
            {errorText && <div className="text-[11.5px] text-amber-300">{errorText}</div>}
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-white/10">
              <span>MEM: {memory}</span>
              <span>{calcMode === 'jamb' ? 'UTME Standard' : `Scientific (${angleMode.toUpperCase()})`}</span>
            </div>
          </div>

          {/* Memory Row */}
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { label: 'MC', fn: () => setMemory(0) },
              { label: 'MR', fn: () => appendToken(String(memory)) },
              {
                label: 'M+',
                fn: () => {
                  const n = Number(resultText);
                  if (Number.isFinite(n)) setMemory((m) => Number((m + n).toFixed(6)));
                },
              },
              {
                label: '⌫',
                fn: () => setExpr((prev) => prev.slice(0, -1)),
              },
            ].map((b) => (
              <button
                key={b.label}
                type="button"
                onClick={b.fn}
                className="h-9 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-[12px] font-bold font-mono text-[var(--dim)] hover:text-[var(--ink)] hover:border-[var(--acc-line)] cursor-pointer"
              >
                {b.label}
              </button>
            ))}
          </div>

          {/* Scientific Row */}
          {calcMode === 'sci' && (
            <div className="grid grid-cols-4 gap-1.5">
              {['sin(', 'cos(', 'tan(', 'π', 'log(', 'ln(', '^', '('].map((tok) => (
                <button
                  key={tok}
                  type="button"
                  onClick={() => appendToken(tok)}
                  className="h-9 rounded-lg bg-[var(--acc-soft)] border border-[var(--acc-line)] text-[12.5px] font-bold font-mono text-[var(--gold)] hover:brightness-95 cursor-pointer"
                >
                  {tok}
                </button>
              ))}
            </div>
          )}

          {/* Main Keypad */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'C', kind: 'warn', fn: () => { setExpr(''); setResultText('0'); setErrorText(null); } },
              { label: '√(', kind: 'op', fn: () => appendToken('√(') },
              { label: calcMode === 'sci' ? ')' : '%', kind: 'op', fn: () => appendToken(calcMode === 'sci' ? ')' : '%') },
              { label: '÷', kind: 'op', fn: () => appendToken('÷') },
              { label: '7', fn: () => appendToken('7') },
              { label: '8', fn: () => appendToken('8') },
              { label: '9', fn: () => appendToken('9') },
              { label: '×', kind: 'op', fn: () => appendToken('×') },
              { label: '4', fn: () => appendToken('4') },
              { label: '5', fn: () => appendToken('5') },
              { label: '6', fn: () => appendToken('6') },
              { label: '−', kind: 'op', fn: () => appendToken('-') },
              { label: '1', fn: () => appendToken('1') },
              { label: '2', fn: () => appendToken('2') },
              { label: '3', fn: () => appendToken('3') },
              { label: '+', kind: 'op', fn: () => appendToken('+') },
              { label: '0', fn: () => appendToken('0') },
              { label: '.', fn: () => appendToken('.') },
              { label: '±', fn: () => setExpr((prev) => (prev.startsWith('-') ? prev.slice(1) : `-${prev}`)) },
              { label: '=', kind: 'eq', fn: handleEvaluate },
            ].map((k) => (
              <button
                key={k.label}
                type="button"
                onClick={k.fn}
                className={`h-11 rounded-xl font-mono font-bold text-[15px] transition active:scale-95 cursor-pointer ${
                  k.kind === 'eq'
                    ? 'bg-[var(--gold)] text-[var(--on-acc)] shadow-xs'
                    : k.kind === 'warn'
                      ? 'bg-[var(--bad-soft)] text-[var(--coral-ink)] border border-[var(--bad-line)]'
                      : k.kind === 'op'
                        ? 'bg-[var(--bg)] text-[var(--gold)] border border-[var(--line)] hover:border-[var(--acc-line)]'
                        : 'bg-[var(--card)] text-[var(--ink)] border border-[var(--line)] hover:bg-[var(--bg)]'
                }`}
              >
                {k.label}
              </button>
            ))}
          </div>

          {history.length > 0 && (
            <div className="pt-2 border-t border-[var(--line)] flex flex-col gap-1.5">
              <div className="text-[11.5px] font-semibold text-[var(--dim)]">Recent calculations</div>
              {history.map((h, i) => (
                <button
                  key={`${h.expr}-${i}`}
                  type="button"
                  onClick={() => setExpr(h.res)}
                  className="flex items-center justify-between text-left px-2.5 py-1.5 rounded-lg bg-[var(--bg)] text-[12px] font-mono hover:border-[var(--acc-line)] border border-transparent cursor-pointer"
                >
                  <span className="text-[var(--dim)] truncate">{h.expr}</span>
                  <span className="font-bold text-[var(--ink)] shrink-0 ml-2">= {h.res}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              {PEN_COLORS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  aria-label={`Pen color ${p.label}`}
                  onClick={() => {
                    setEraser(false);
                    setPenColor(p.color);
                  }}
                  className={`w-7 h-7 rounded-full border-2 cursor-pointer transition ${
                    !eraser && penColor === p.color ? 'border-[var(--gold)] scale-110' : 'border-transparent'
                  }`}
                  style={{ background: p.color }}
                />
              ))}
              <button
                type="button"
                onClick={() => setEraser((e) => !e)}
                className={`px-2.5 py-1 rounded-lg text-[12px] font-bold border cursor-pointer ${
                  eraser
                    ? 'bg-[var(--gold)] text-[var(--on-acc)] border-[var(--gold)]'
                    : 'bg-[var(--bg)] text-[var(--dim)] border-[var(--line)]'
                }`}
              >
                Eraser
              </button>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleUndo}
                className="px-2.5 py-1 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-[12px] font-semibold text-[var(--ink)] cursor-pointer"
              >
                Undo
              </button>
              <button
                type="button"
                onClick={handleClearCanvas}
                className="px-2.5 py-1 rounded-lg bg-[var(--bad-soft)] border border-[var(--bad-line)] text-[12px] font-semibold text-[var(--coral-ink)] cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 text-[12px]">
            <span className="text-[var(--dim)] font-medium">Paper background</span>
            <div className="flex items-center gap-1">
              {(['grid', 'lined', 'blank'] as const).map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setPaper(style)}
                  className={`px-2 py-0.5 rounded-md font-semibold capitalize cursor-pointer ${
                    paper === style
                      ? 'bg-[var(--acc-soft)] text-[var(--gold)]'
                      : 'text-[var(--dim)] hover:text-[var(--ink)]'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <div
            className="relative rounded-xl border border-[var(--line)] overflow-hidden bg-white shadow-inner"
            style={
              paper === 'grid'
                ? {
                    backgroundImage:
                      'linear-gradient(to right, rgba(148,163,184,0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.22) 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }
                : paper === 'lined'
                  ? {
                      backgroundImage: 'linear-gradient(to bottom, rgba(148,163,184,0.25) 1px, transparent 1px)',
                      backgroundSize: '100% 24px',
                    }
                  : undefined
            }
          >
            <canvas
              ref={canvasRef}
              width={380}
              height={360}
              data-testid="scratchpad-canvas"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="w-full h-[360px] touch-none cursor-crosshair block"
            />
          </div>
          <p className="text-[12px] text-[var(--dim)]">
            Sketch stoichiometry ratios, free-body diagrams, truth tables, or algebra steps directly with mouse or finger.
          </p>
        </div>
      )}
    </div>
  );
}
