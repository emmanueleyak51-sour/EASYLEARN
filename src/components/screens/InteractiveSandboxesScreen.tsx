import React, { useMemo, useState } from 'react';
import type { SubjectId } from '../../types';
import {
  LOGIC_GATE_META,
  NORMALIZATION_STAGES,
  SAMPLE_SQL_TABLES,
  analyzeMatrix2x2,
  buildTruthTable,
  computeMapBearingAndGradient,
  convertNumberBase,
  evaluateCubicAndTangent,
  evaluateLogicGate,
  formatGridRefs,
  runSafeSqlQuery,
  type LogicGateType,
  type MapPoint,
} from '../../utils/sandboxEngines';
import { SubscreenTopBar } from '../AppShell';
import { Icon } from '../Icons';
import { LiquidCapsuleBar } from '../ULessonMotion';

type SandboxTab = 'dataproc' | 'digitech' | 'fmaths' | 'geog';

const SQL_PRESETS = [
  { label: 'All Students', sql: 'SELECT * FROM Students;' },
  { label: 'SS3 High Scorers', sql: "SELECT Full_Name, State, Score FROM Students WHERE Class = 'SS3' AND Score >= 85 ORDER BY Score DESC;" },
  { label: 'Dept Averages (GROUP BY)', sql: 'SELECT Dept, COUNT(Student_ID) AS Total, AVG(Score) AS Avg_Score FROM Students GROUP BY Dept ORDER BY Avg_Score DESC;' },
  { label: 'INNER JOIN Subjects', sql: 'SELECT Students.Full_Name, Students.Dept, Subjects.Subject_Name, Subjects.Units FROM Students INNER JOIN Subjects ON Students.Dept = Subjects.Dept WHERE Students.Class = \'SS3\';' },
  { label: 'LIKE Filter (A%)', sql: "SELECT Student_ID, Full_Name, State FROM Students WHERE State LIKE 'A%';" },
];

const MATRIX_PRESETS: { label: string; m: [number, number, number, number] }[] = [
  { label: 'Identity', m: [1, 0, 0, 1] },
  { label: '90° Rotation', m: [0, -1, 1, 0] },
  { label: 'X-Shear', m: [1, 1, 0, 1] },
  { label: 'Reflect y = x', m: [0, 1, 1, 0] },
  { label: 'Scale 2×', m: [2, 0, 0, 2] },
  { label: 'Singular (det=0)', m: [2, 1, 2, 1] },
];

const ALL_GATES: LogicGateType[] = ['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR'];

function defaultTabForSubj(subj: SubjectId): SandboxTab {
  if (subj === 'dataproc') return 'dataproc';
  if (subj === 'digitech') return 'digitech';
  if (subj === 'fmaths' || subj === 'maths') return 'fmaths';
  if (subj === 'geog') return 'geog';
  return 'dataproc';
}

export function InteractiveSandboxesScreen({
  initialSubject,
  onBack,
}: {
  initialSubject: SubjectId;
  onBack: () => void;
}) {
  const [tab, setTab] = useState<SandboxTab>(() => defaultTabForSubj(initialSubject));

  // ── 1. Data Processing State ──
  const [sqlInput, setSqlInput] = useState<string>(SQL_PRESETS[1].sql);
  const [normIdx, setNormIdx] = useState<number>(0);
  const sqlResult = useMemo(() => runSafeSqlQuery(sqlInput), [sqlInput]);
  const activeNorm = NORMALIZATION_STAGES[normIdx];

  // ── 2. Digital Technologies State ──
  const [gate, setGate] = useState<LogicGateType>('XOR');
  const [inA, setInA] = useState<0 | 1>(1);
  const [inB, setInB] = useState<0 | 1>(0);
  const [baseFrom, setBaseFrom] = useState<2 | 8 | 10 | 16>(10);
  const [baseInput, setBaseInput] = useState<string>('45');

  const gateOut = evaluateLogicGate(gate, inA, inB);
  const truthTable = useMemo(() => buildTruthTable(gate), [gate]);
  const baseConv = useMemo(() => convertNumberBase(baseInput, baseFrom), [baseInput, baseFrom]);

  // ── 3. Further Maths State ──
  const [ma, setMa] = useState<number>(1.5);
  const [mb, setMb] = useState<number>(0.5);
  const [mc, setMc] = useState<number>(0);
  const [md, setMd] = useState<number>(1);
  const [calcX0, setCalcX0] = useState<number>(1.0);

  const matrixInfo = useMemo(() => analyzeMatrix2x2(ma, mb, mc, md), [ma, mb, mc, md]);
  const cubicInfo = useMemo(() => evaluateCubicAndTangent(0.5, -0.5, -1, calcX0), [calcX0]);

  // ── 4. Geography Map Work State ──
  const [ptA, setPtA] = useState<MapPoint>({ easting: 12.4, northing: 23.2, elevationM: 120 });
  const [ptB, setPtB] = useState<MapPoint>({ easting: 17.6, northing: 27.8, elevationM: 460 });
  const [rfScale, setRfScale] = useState<number>(50000);

  const refA = useMemo(() => formatGridRefs(ptA), [ptA]);
  const refB = useMemo(() => formatGridRefs(ptB), [ptB]);
  const mapMetrics = useMemo(() => computeMapBearingAndGradient(ptA, ptB, rfScale), [ptA, ptB, rfScale]);

  // Helper to convert math coordinates [-3..3] to SVG [0..260]
  const toSvgXY = (x: number, y: number): [number, number] => [130 + x * 34, 130 - y * 34];

  // Cubic path points for y = 0.5x^3 - 0.5x^2 - x over [-2.4, 2.8]
  const cubicPath = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 60; i++) {
      const x = -2.3 + (i / 60) * 5.0;
      const y = 0.5 * x * x * x - 0.5 * x * x - x;
      const sx = 140 + x * 44;
      const sy = 110 - y * 24;
      pts.push(`${i === 0 ? 'M' : 'L'} ${sx.toFixed(1)} ${Math.max(8, Math.min(212, sy)).toFixed(1)}`);
    }
    return pts.join(' ');
  }, []);

  const tangentLineCoords = useMemo(() => {
    const x1 = calcX0 - 1.4;
    const y1 = cubicInfo.y0 + cubicInfo.slope * (x1 - calcX0);
    const x2 = calcX0 + 1.4;
    const y2 = cubicInfo.y0 + cubicInfo.slope * (x2 - calcX0);
    return {
      x1: 140 + x1 * 44,
      y1: 110 - y1 * 24,
      x2: 140 + x2 * 44,
      y2: 110 - y2 * 24,
      px: 140 + calcX0 * 44,
      py: 110 - cubicInfo.y0 * 24,
    };
  }, [calcX0, cubicInfo]);

  return (
    <div className="flex flex-col gap-5 anim-rise">
      <SubscreenTopBar
        title="Try-it tools"
        subtitle="Hands-on SQL tables, logic gates, matrices, graphs and map reading"
        onBack={onBack}
      />

      {/* Studio Switcher */}
      <LiquidCapsuleBar
        roleType="tablist"
        layoutMode="grid"
        gridClassName="grid-cols-2 min-[780px]:grid-cols-4 gap-2"
        size="lg"
        ariaLabel="Try-it tools"
        items={[
          { id: 'dataproc' as SandboxTab, label: 'SQL tables', icon: 'database' },
          { id: 'digitech' as SandboxTab, label: 'Logic & binary', icon: 'cpu' },
          { id: 'fmaths' as SandboxTab, label: 'Matrices & graphs', icon: 'integral' },
          { id: 'geog' as SandboxTab, label: 'Map reading', icon: 'globe' },
        ]}
        value={tab}
        onChange={setTab}
      />

      {/* ═══════════════════ 1. DATA PROCESSING: SQL & 3NF ═══════════════════ */}
      {tab === 'dataproc' && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 min-[900px]:grid-cols-12 gap-5">
            {/* SQL Editor & Live Output */}
            <section className="min-[900px]:col-span-7 rtc-card rounded-2xl p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <span className="eyebrow text-[var(--gold)]">Live Relational SQL Engine</span>
                  <h2 className="h20 text-[var(--ink)]">Query Playground</h2>
                </div>
                <span className="text-[12px] font-semibold text-[var(--dim)] mono">
                  Tables: Students (8) · Subjects (4)
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {SQL_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setSqlInput(p.sql)}
                    className="px-2.5 py-1.5 rounded-lg bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--gold)] text-[12px] font-bold text-[var(--ink)] cursor-pointer transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              <label className="sr-only" htmlFor="sql-sandbox-input">
                SQL query editor
              </label>
              <textarea
                id="sql-sandbox-input"
                rows={3}
                value={sqlInput}
                onChange={(e) => setSqlInput(e.target.value)}
                spellCheck={false}
                className="w-full rounded-xl rtc-eq-plate p-3.5 mono text-[13.5px] text-emerald-300 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
              />

              {sqlResult.ok ? (
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between text-[12.5px] font-bold text-[var(--green)]">
                    <span>{sqlResult.explanation}</span>
                    <span className="mono text-[var(--dim)]">{sqlResult.columns.length} cols</span>
                  </div>
                  <div className="tw tw-compact">
                    <table>
                      <thead>
                        <tr>
                          {sqlResult.columns.map((c) => (
                            <th key={c}>{c}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sqlResult.rows.length > 0 ? (
                          sqlResult.rows.map((r, i) => (
                            <tr key={i}>
                              {sqlResult.columns.map((c) => (
                                <td key={c} className="mono">
                                  {String(r[c] ?? '')}
                                </td>
                              ))}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={sqlResult.columns.length} className="text-center text-[var(--dim)]">
                              0 rows matched your WHERE filter.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl bg-[var(--bad-soft)] border border-[var(--bad-line)] px-4 py-3 text-[13px] font-semibold text-[var(--coral-ink)]">
                  {sqlResult.error}
                </div>
              )}
            </section>

            {/* Schema Explorer */}
            <section className="min-[900px]:col-span-5 rtc-card rounded-2xl p-5 flex flex-col gap-4">
              <div>
                <span className="eyebrow text-[var(--gold)]">Relational Schema</span>
                <h2 className="h20 text-[var(--ink)]">Table Definitions</h2>
              </div>
              {Object.values(SAMPLE_SQL_TABLES).map((tbl) => (
                <div key={tbl.name} className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-3.5 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-[var(--display)] font-bold text-[15px] text-[var(--ink)]">{tbl.name}</span>
                    <span className="mono text-[11.5px] font-bold text-[var(--gold)]">PK: {tbl.primaryKey}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {tbl.columns.map((col) => (
                      <span key={col} className="rtc-code text-[11.5px]">
                        {col}
                        {col === tbl.primaryKey ? ' 🔑' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              <div className="rounded-xl bg-[var(--acc-soft)]/50 border border-[var(--acc-line)] p-3.5 text-[12.5px] text-[var(--ink)] leading-relaxed">
                <strong>WAEC Exam Tip:</strong> Supported clauses include <span className="rtc-code">DISTINCT</span>,{' '}
                <span className="rtc-code">INNER JOIN ... ON</span>, <span className="rtc-code">WHERE ... AND/OR</span>,{' '}
                <span className="rtc-code">LIKE</span>, <span className="rtc-code">GROUP BY</span>,{' '}
                <span className="rtc-code">COUNT/SUM/AVG/MIN/MAX</span>, and <span className="rtc-code">ORDER BY</span>.
              </div>
            </section>
          </div>

          {/* 1NF -> 3NF Normalization Stepper */}
          <section className="rtc-card rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="eyebrow text-[var(--gold)]">Database Design Studio</span>
                <h2 className="h20 text-[var(--ink)]">Interactive UNF → 1NF → 2NF → 3NF Normalizer</h2>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {NORMALIZATION_STAGES.map((st, idx) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setNormIdx(idx)}
                    className={`px-3 py-1.5 rounded-xl text-[12.5px] font-bold border cursor-pointer transition ${
                      normIdx === idx
                        ? 'bg-[var(--gold)] text-[var(--on-acc)] border-[var(--gold)]'
                        : 'bg-[var(--bg)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--gold)]'
                    }`}
                  >
                    {st.id.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded-xl bg-[var(--ok-soft)] border border-[var(--ok-line)] p-3.5 text-[13px] text-[var(--ink)]">
                <div className="font-bold text-[var(--green)] mb-1">{activeNorm.label} Rule</div>
                {activeNorm.rule}
              </div>
              <div className="rounded-xl bg-[var(--mark-soft)] border border-[var(--mark-line)] p-3.5 text-[13px] text-[var(--ink)]">
                <div className="font-bold text-[var(--ink)] mb-1">Anomaly Status</div>
                {activeNorm.anomaly}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeNorm.tables.map((t) => (
                <div key={t.title} className="flex flex-col gap-1.5">
                  <div className="text-[12.5px] font-bold text-[var(--gold)] mono">{t.title}</div>
                  <div className="tw tw-compact">
                    <table>
                      <thead>
                        <tr>
                          {t.cols.map((c) => (
                            <th key={c}>{c}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {t.rows.map((r, rIdx) => (
                          <tr key={rIdx}>
                            {r.map((cell, cIdx) => (
                              <td key={cIdx} className="mono">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ═══════════════════ 2. DIGITAL TECH: LOGIC GATES & BINARY ═══════════════════ */}
      {tab === 'digitech' && (
        <div className="grid grid-cols-1 min-[900px]:grid-cols-12 gap-5">
          {/* Logic Gate Simulator */}
          <section className="min-[900px]:col-span-7 rtc-card rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="eyebrow text-[var(--gold)]">Boolean Circuit Workbench</span>
                <h2 className="h20 text-[var(--ink)]">{gate} Logic Gate Simulator</h2>
              </div>
              <span className="mono text-[14px] font-bold text-[var(--gold)]">{LOGIC_GATE_META[gate].expr}</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {ALL_GATES.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGate(g)}
                  className={`px-3 py-1.5 rounded-xl text-[12.5px] font-bold border cursor-pointer transition ${
                    gate === g
                      ? 'bg-[var(--gold)] text-[var(--on-acc)] border-[var(--gold)]'
                      : 'bg-[var(--bg)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--gold)]'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* Interactive SVG Circuit Plate */}
            <div className="rtc-eq-plate rounded-2xl p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setInA((v) => (v === 1 ? 0 : 1))}
                    aria-pressed={inA === 1}
                    className={`min-h-[38px] px-3.5 rounded-xl font-bold mono text-[13px] border cursor-pointer transition ${
                      inA === 1
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                        : 'bg-white/5 border-white/15 text-slate-300'
                    }`}
                  >
                    Input A = {inA}
                  </button>
                  {!LOGIC_GATE_META[gate].unary && (
                    <button
                      type="button"
                      onClick={() => setInB((v) => (v === 1 ? 0 : 1))}
                      aria-pressed={inB === 1}
                      className={`min-h-[38px] px-3.5 rounded-xl font-bold mono text-[13px] border cursor-pointer transition ${
                        inB === 1
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                          : 'bg-white/5 border-white/15 text-slate-300'
                      }`}
                    >
                      Input B = {inB}
                    </button>
                  )}
                </div>
                <div
                  className={`px-3.5 py-1.5 rounded-xl mono text-[13.5px] font-extrabold border ${
                    gateOut === 1
                      ? 'bg-amber-400/20 border-amber-300 text-amber-300'
                      : 'bg-white/5 border-white/15 text-slate-400'
                  }`}
                >
                  Output Q = {gateOut} ({gateOut === 1 ? 'HIGH' : 'LOW'})
                </div>
              </div>

              <svg viewBox="0 0 380 140" className="w-full max-w-[440px] mx-auto" role="img" aria-label={`${gate} logic gate diagram`}>
                {/* Wire A */}
                <line
                  x1="36"
                  y1={LOGIC_GATE_META[gate].unary ? '70' : '48'}
                  x2="135"
                  y2={LOGIC_GATE_META[gate].unary ? '70' : '48'}
                  stroke={inA === 1 ? '#34D399' : '#64748B'}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <circle cx="32" cy={LOGIC_GATE_META[gate].unary ? '70' : '48'} r="11" fill={inA === 1 ? '#10B981' : '#334155'} />
                <text x="32" y={LOGIC_GATE_META[gate].unary ? '74' : '52'} textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="700">
                  A:{inA}
                </text>

                {/* Wire B */}
                {!LOGIC_GATE_META[gate].unary && (
                  <>
                    <line
                      x1="36"
                      y1="92"
                      x2="135"
                      y2="92"
                      stroke={inB === 1 ? '#34D399' : '#64748B'}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    <circle cx="32" cy="92" r="11" fill={inB === 1 ? '#10B981' : '#334155'} />
                    <text x="32" y="96" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="700">
                      B:{inB}
                    </text>
                  </>
                )}

                {/* Gate Body */}
                <rect x="135" y="28" width="105" height="84" rx="18" fill="#1E293B" stroke="#94A3B8" strokeWidth="2.5" />
                <text x="187" y="75" textAnchor="middle" fill="#F8FAFC" fontSize="18" fontWeight="800">
                  {gate}
                </text>
                {(gate === 'NOT' || gate === 'NAND' || gate === 'NOR' || gate === 'XNOR') && (
                  <circle cx="247" cy="70" r="7" fill="#0F172A" stroke="#F8FAFC" strokeWidth="2.5" />
                )}

                {/* Output Wire */}
                <line
                  x1={gate === 'NOT' || gate === 'NAND' || gate === 'NOR' || gate === 'XNOR' ? '254' : '240'}
                  y1="70"
                  x2="332"
                  y2="70"
                  stroke={gateOut === 1 ? '#FBBF24' : '#64748B'}
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                {/* Output LED */}
                <circle
                  cx="346"
                  cy="70"
                  r="16"
                  fill={gateOut === 1 ? '#FBBF24' : '#334155'}
                  stroke={gateOut === 1 ? '#FEF08A' : '#64748B'}
                  strokeWidth="2.5"
                />
                <text x="346" y="74" textAnchor="middle" fill={gateOut === 1 ? '#1E293B' : '#CBD5E1'} fontSize="12" fontWeight="800">
                  Q:{gateOut}
                </text>
              </svg>
              <p className="text-[12.5px] text-slate-300 text-center">{LOGIC_GATE_META[gate].rule}</p>
            </div>

            {/* Highlighted Truth Table */}
            <div className="tw tw-compact">
              <table>
                <thead>
                  <tr>
                    <th>Input A</th>
                    {!LOGIC_GATE_META[gate].unary && <th>Input B</th>}
                    <th>Output Q ({gate})</th>
                  </tr>
                </thead>
                <tbody>
                  {truthTable.map((row, idx) => {
                    const isActive =
                      row.a === inA && (LOGIC_GATE_META[gate].unary || row.b === inB);
                    return (
                      <tr key={idx} className={isActive ? 'bg-[var(--acc-soft)] font-bold' : ''}>
                        <td className="mono">{row.a}</td>
                        {!LOGIC_GATE_META[gate].unary && <td className="mono">{row.b}</td>}
                        <td className={`mono font-extrabold ${row.out === 1 ? 'text-[var(--green)]' : 'text-[var(--dim)]'}`}>
                          {row.out} {isActive ? '← active' : ''}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* 4-Way Number Base Converter */}
          <section className="min-[900px]:col-span-5 rtc-card rounded-2xl p-5 flex flex-col gap-4">
            <div>
              <span className="eyebrow text-[var(--gold)]">Number Systems Converter</span>
              <h2 className="h20 text-[var(--ink)]">Binary · Octal · Denary · Hex</h2>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {([2, 8, 10, 16] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => {
                    setBaseFrom(b);
                    if (baseConv.ok) {
                      setBaseInput(
                        b === 2 ? baseConv.binary : b === 8 ? baseConv.octal : b === 16 ? baseConv.hex : String(baseConv.denary)
                      );
                    }
                  }}
                  className={`py-2 rounded-xl text-[12px] font-bold border cursor-pointer transition ${
                    baseFrom === b
                      ? 'bg-[var(--gold)] text-[var(--on-acc)] border-[var(--gold)]'
                      : 'bg-[var(--bg)] text-[var(--ink)] border-[var(--line)]'
                  }`}
                >
                  Base {b}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={baseInput}
              onChange={(e) => setBaseInput(e.target.value)}
              placeholder={`Enter base-${baseFrom} value`}
              aria-label="Number value to convert"
              className="w-full rounded-xl bg-[var(--bg)] border border-[var(--line)] px-4 py-3 mono text-[18px] font-bold text-[var(--ink)] focus:outline-none focus:border-[var(--gold)]"
            />

            {baseConv.ok ? (
              <>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-3">
                    <div className="text-[11px] font-bold text-[var(--dim)]">Binary (Base 2)</div>
                    <div className="mono font-extrabold text-[16px] text-[var(--ink)] break-all">{baseConv.binary}₂</div>
                  </div>
                  <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-3">
                    <div className="text-[11px] font-bold text-[var(--dim)]">Octal (Base 8)</div>
                    <div className="mono font-extrabold text-[16px] text-[var(--ink)]">{baseConv.octal}₈</div>
                  </div>
                  <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-3">
                    <div className="text-[11px] font-bold text-[var(--dim)]">Denary (Base 10)</div>
                    <div className="mono font-extrabold text-[16px] text-[var(--gold)]">{baseConv.denary}₁₀</div>
                  </div>
                  <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-3">
                    <div className="text-[11px] font-bold text-[var(--dim)]">Hexadecimal (Base 16)</div>
                    <div className="mono font-extrabold text-[16px] text-[var(--green)]">0x{baseConv.hex}</div>
                  </div>
                </div>

                <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-3.5 flex flex-col gap-1.5">
                  <div className="text-[12px] font-bold text-[var(--gold)]">
                    Repeated Division by 2 (read remainders bottom → top)
                  </div>
                  <div className="mono text-[12px] text-[var(--ink)] space-y-1 max-h-[160px] overflow-y-auto">
                    {baseConv.steps.map((s, i) => (
                      <div key={i}>{s}</div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-xl bg-[var(--bad-soft)] border border-[var(--bad-line)] p-3 text-[13px] font-semibold text-[var(--coral-ink)]">
                {baseConv.error}
              </div>
            )}
          </section>
        </div>
      )}

      {/* ═══════════════════ 3. FURTHER MATHS: MATRICES & CALCULUS ═══════════════════ */}
      {tab === 'fmaths' && (
        <div className="grid grid-cols-1 min-[900px]:grid-cols-12 gap-5">
          {/* 2x2 Matrix Visualizer */}
          <section className="min-[900px]:col-span-6 rtc-card rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="eyebrow text-[var(--gold)]">Linear Transformation</span>
                <h2 className="h20 text-[var(--ink)]">2×2 Matrix Studio</h2>
              </div>
              <span
                className={`mono text-[13px] font-extrabold ${
                  matrixInfo.isSingular ? 'text-[var(--coral-ink)]' : 'text-[var(--green)]'
                }`}
              >
                det(M) = {matrixInfo.det}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {MATRIX_PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    setMa(p.m[0]);
                    setMb(p.m[1]);
                    setMc(p.m[2]);
                    setMd(p.m[3]);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--gold)] text-[11.5px] font-bold text-[var(--ink)] cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="rtc-eq-plate rounded-2xl p-3 flex justify-center">
              <svg viewBox="0 0 260 260" className="w-full max-w-[260px]" role="img" aria-label="2x2 matrix transformation plane">
                {/* Grid */}
                {[-3, -2, -1, 0, 1, 2, 3].map((v) => {
                  const [x] = toSvgXY(v, 0);
                  const [, y] = toSvgXY(0, v);
                  return (
                    <g key={v}>
                      <line x1={x} y1="10" x2={x} y2="250" stroke="rgba(148,163,184,0.16)" strokeWidth={v === 0 ? 1.8 : 1} />
                      <line x1="10" y1={y} x2="250" y2={y} stroke="rgba(148,163,184,0.16)" strokeWidth={v === 0 ? 1.8 : 1} />
                    </g>
                  );
                })}
                {/* Unit Square (dashed) */}
                <polygon
                  points={matrixInfo.unitSquare.map(([x, y]) => toSvgXY(x, y).join(',')).join(' ')}
                  fill="rgba(148,163,184,0.12)"
                  stroke="#94A3B8"
                  strokeDasharray="4 3"
                  strokeWidth="1.5"
                />
                {/* Transformed Polygon */}
                <polygon
                  points={matrixInfo.transformedSquare.map(([x, y]) => toSvgXY(x, y).join(',')).join(' ')}
                  fill={matrixInfo.isSingular ? 'rgba(248,113,113,0.28)' : 'rgba(52,211,153,0.24)'}
                  stroke={matrixInfo.isSingular ? '#F87171' : '#34D399'}
                  strokeWidth="2.5"
                />
                {/* Basis Vectors */}
                <line x1="130" y1="130" x2={toSvgXY(ma, mc)[0]} y2={toSvgXY(ma, mc)[1]} stroke="#FBBF24" strokeWidth="2.5" />
                <line x1="130" y1="130" x2={toSvgXY(mb, md)[0]} y2={toSvgXY(mb, md)[1]} stroke="#38BDF8" strokeWidth="2.5" />
              </svg>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  { label: 'a (row 1, col 1)', val: ma, set: setMa },
                  { label: 'b (row 1, col 2)', val: mb, set: setMb },
                  { label: 'c (row 2, col 1)', val: mc, set: setMc },
                  { label: 'd (row 2, col 2)', val: md, set: setMd },
                ] as const
              ).map((item) => (
                <label key={item.label} className="flex flex-col gap-1 text-[12px] font-semibold text-[var(--dim)]">
                  <span className="flex justify-between">
                    <span>{item.label}</span>
                    <span className="mono font-bold text-[var(--ink)]">{item.val.toFixed(1)}</span>
                  </span>
                  <input
                    type="range"
                    min={-2.5}
                    max={2.5}
                    step={0.5}
                    value={item.val}
                    onChange={(e) => item.set(Number(e.target.value))}
                    className="lab-slider"
                  />
                </label>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-[12.5px]">
              <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-3">
                <div className="text-[var(--dim)] font-semibold">Area Scale Factor</div>
                <div className="mono font-extrabold text-[15px] text-[var(--ink)]">
                  |det| = {matrixInfo.areaScale}× ({matrixInfo.orientation})
                </div>
              </div>
              <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-3">
                <div className="text-[var(--dim)] font-semibold">Inverse Matrix M⁻¹</div>
                <div className="mono font-bold text-[12.5px] text-[var(--gold)]">
                  {matrixInfo.inverse
                    ? `[[${matrixInfo.inverse[0].join(', ')}], [${matrixInfo.inverse[1].join(', ')}]]`
                    : 'No inverse (singular matrix)'}
                </div>
              </div>
            </div>
          </section>

          {/* Cubic Calculus Tangent Visualizer */}
          <section className="min-[900px]:col-span-6 rtc-card rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="eyebrow text-[var(--gold)]">Differential Calculus</span>
                <h2 className="h20 text-[var(--ink)]">Curve &amp; Tangent Slope Lab</h2>
              </div>
              <span className="mono text-[13px] font-bold text-[var(--gold)]">y = 0.5x³ − 0.5x² − x</span>
            </div>

            <div className="rtc-eq-plate rounded-2xl p-3 flex justify-center">
              <svg viewBox="0 0 280 220" className="w-full max-w-[340px]" role="img" aria-label="Cubic curve and tangent slope graph">
                <line x1="12" y1="110" x2="268" y2="110" stroke="rgba(148,163,184,0.35)" strokeWidth="1.4" />
                <line x1="140" y1="10" x2="140" y2="210" stroke="rgba(148,163,184,0.35)" strokeWidth="1.4" />
                <path d={cubicPath} fill="none" stroke="#38BDF8" strokeWidth="2.8" strokeLinecap="round" />
                <line
                  x1={tangentLineCoords.x1}
                  y1={tangentLineCoords.y1}
                  x2={tangentLineCoords.x2}
                  y2={tangentLineCoords.y2}
                  stroke="#FBBF24"
                  strokeWidth="2.5"
                  strokeDasharray="6 3"
                />
                <circle cx={tangentLineCoords.px} cy={tangentLineCoords.py} r="6" fill="#FBBF24" stroke="#0F172A" strokeWidth="2" />
              </svg>
            </div>

            <label className="flex flex-col gap-1.5 text-[13px] font-semibold text-[var(--dim)]">
              <span className="flex justify-between">
                <span>Slide point x₀ along the curve</span>
                <span className="mono font-extrabold text-[var(--gold)]">x₀ = {calcX0.toFixed(2)}</span>
              </span>
              <input
                type="range"
                min={-1.8}
                max={2.2}
                step={0.1}
                value={calcX0}
                onChange={(e) => setCalcX0(Number(e.target.value))}
                className="lab-slider"
              />
            </label>

            <div className="grid grid-cols-2 gap-2.5 text-[12.5px]">
              <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-3">
                <div className="text-[var(--dim)] font-semibold">Point (x₀, y₀)</div>
                <div className="mono font-extrabold text-[15px] text-[var(--ink)]">
                  ({calcX0.toFixed(1)}, {cubicInfo.y0})
                </div>
              </div>
              <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-3">
                <div className="text-[var(--dim)] font-semibold">Gradient dy/dx</div>
                <div className="mono font-extrabold text-[15px] text-[var(--gold)]">{cubicInfo.slope}</div>
              </div>
              <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-3">
                <div className="text-[var(--dim)] font-semibold">Second Derivative d²y/dx²</div>
                <div className="mono font-extrabold text-[15px] text-[var(--ink)]">{cubicInfo.secondDeriv}</div>
              </div>
              <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-3">
                <div className="text-[var(--dim)] font-semibold">Tangent Equation</div>
                <div className="mono font-extrabold text-[13.5px] text-[var(--green)]">{cubicInfo.tangentEq}</div>
              </div>
            </div>

            <div className="rounded-xl bg-[var(--acc-soft)]/50 border border-[var(--acc-line)] px-4 py-2.5 text-[13px] font-bold text-[var(--ink)]">
              Stationary / Curve Nature: <span className="text-[var(--gold)]">{cubicInfo.nature}</span>
            </div>
          </section>
        </div>
      )}

      {/* ═══════════════════ 4. GEOGRAPHY: TOPOGRAPHIC MAP & BEARINGS ═══════════════════ */}
      {tab === 'geog' && (
        <div className="grid grid-cols-1 min-[900px]:grid-cols-12 gap-5">
          {/* Interactive Grid Map */}
          <section className="min-[900px]:col-span-7 rtc-card rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="eyebrow text-[var(--gold)]">WAEC Map Reading Sheet</span>
                <h2 className="h20 text-[var(--ink)]">Grid Reference, Bearings &amp; Relief Lab</h2>
              </div>
              <div className="flex items-center gap-1.5">
                {[25000, 50000, 100000].map((rf) => (
                  <button
                    key={rf}
                    type="button"
                    onClick={() => setRfScale(rf)}
                    className={`px-2.5 py-1 rounded-lg text-[11.5px] font-bold border cursor-pointer mono ${
                      rfScale === rf
                        ? 'bg-[var(--gold)] text-[var(--on-acc)] border-[var(--gold)]'
                        : 'bg-[var(--bg)] text-[var(--ink)] border-[var(--line)]'
                    }`}
                  >
                    1:{rf.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <div className="rtc-eq-plate rounded-2xl p-4 flex justify-center">
              <svg viewBox="0 0 340 320" className="w-full max-w-[380px]" role="img" aria-label="Topographic grid sheet showing points A and B">
                {/* 10x10 Grid: Eastings 10..20, Northings 20..30 */}
                {Array.from({ length: 11 }, (_, idx) => {
                  const x = 40 + idx * 27;
                  const y = 280 - idx * 25;
                  return (
                    <g key={idx}>
                      <line x1={x} y1="30" x2={x} y2="280" stroke="rgba(148,163,184,0.22)" strokeWidth="1" />
                      <line x1="40" y1={y} x2="310" y2={y} stroke="rgba(148,163,184,0.22)" strokeWidth="1" />
                      {idx < 10 && (
                        <>
                          <text x={x + 13} y="298" textAnchor="middle" fill="#94A3B8" fontSize="10" fontWeight="700">
                            {10 + idx}
                          </text>
                          <text x="24" y={y - 9} textAnchor="middle" fill="#94A3B8" fontSize="10" fontWeight="700">
                            {20 + idx}
                          </text>
                        </>
                      )}
                    </g>
                  );
                })}
                {/* North Arrow */}
                <g transform="translate(318, 52)">
                  <line x1="0" y1="22" x2="0" y2="-10" stroke="#FBBF24" strokeWidth="2.2" />
                  <polygon points="0,-16 -5,-6 5,-6" fill="#FBBF24" />
                  <text x="0" y="-20" textAnchor="middle" fill="#FBBF24" fontSize="10" fontWeight="800">
                    N
                  </text>
                </g>
                {/* Bearing Line A -> B */}
                {(() => {
                  const ax = 40 + (ptA.easting - 10) * 27;
                  const ay = 280 - (ptA.northing - 20) * 25;
                  const bx = 40 + (ptB.easting - 10) * 27;
                  const by = 280 - (ptB.northing - 20) * 25;
                  return (
                    <>
                      <line x1={ax} y1={ay} x2={ax} y2={Math.max(30, ay - 46)} stroke="#FBBF24" strokeDasharray="4 3" strokeWidth="1.5" />
                      <line x1={ax} y1={ay} x2={bx} y2={by} stroke="#34D399" strokeWidth="2.8" />
                      <circle cx={ax} cy={ay} r="7" fill="#38BDF8" stroke="#0F172A" strokeWidth="2" />
                      <text x={ax + 10} y={ay + 4} fill="#38BDF8" fontSize="11" fontWeight="800">
                        A ({ptA.elevationM}m)
                      </text>
                      <circle cx={bx} cy={by} r="7" fill="#FBBF24" stroke="#0F172A" strokeWidth="2" />
                      <text x={bx + 10} y={by + 4} fill="#FBBF24" fontSize="11" fontWeight="800">
                        B ({ptB.elevationM}m)
                      </text>
                    </>
                  );
                })()}
                <text x="175" y="314" textAnchor="middle" fill="#CBD5E1" fontSize="10" fontWeight="700">
                  Eastings (10 – 19) · Northings (20 – 29)
                </text>
              </svg>
            </div>

            {/* Sliders for Point A and Point B */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-3.5 flex flex-col gap-2">
                <div className="font-bold text-[13px] text-[var(--gold)]">Station A · 6-Fig: {refA.sixFig}</div>
                <label className="text-[11.5px] flex flex-col gap-1 text-[var(--dim)]">
                  <span>Easting: {ptA.easting.toFixed(1)}</span>
                  <input type="range" min={10.1} max={19.5} step={0.1} value={ptA.easting} onChange={(e) => setPtA({ ...ptA, easting: Number(e.target.value) })} className="lab-slider" />
                </label>
                <label className="text-[11.5px] flex flex-col gap-1 text-[var(--dim)]">
                  <span>Northing: {ptA.northing.toFixed(1)}</span>
                  <input type="range" min={20.1} max={29.5} step={0.1} value={ptA.northing} onChange={(e) => setPtA({ ...ptA, northing: Number(e.target.value) })} className="lab-slider" />
                </label>
                <label className="text-[11.5px] flex flex-col gap-1 text-[var(--dim)]">
                  <span>Spot Height: {ptA.elevationM} m</span>
                  <input type="range" min={50} max={900} step={10} value={ptA.elevationM} onChange={(e) => setPtA({ ...ptA, elevationM: Number(e.target.value) })} className="lab-slider" />
                </label>
              </div>

              <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-3.5 flex flex-col gap-2">
                <div className="font-bold text-[13px] text-[var(--gold)]">Station B · 6-Fig: {refB.sixFig}</div>
                <label className="text-[11.5px] flex flex-col gap-1 text-[var(--dim)]">
                  <span>Easting: {ptB.easting.toFixed(1)}</span>
                  <input type="range" min={10.1} max={19.5} step={0.1} value={ptB.easting} onChange={(e) => setPtB({ ...ptB, easting: Number(e.target.value) })} className="lab-slider" />
                </label>
                <label className="text-[11.5px] flex flex-col gap-1 text-[var(--dim)]">
                  <span>Northing: {ptB.northing.toFixed(1)}</span>
                  <input type="range" min={20.1} max={29.5} step={0.1} value={ptB.northing} onChange={(e) => setPtB({ ...ptB, northing: Number(e.target.value) })} className="lab-slider" />
                </label>
                <label className="text-[11.5px] flex flex-col gap-1 text-[var(--dim)]">
                  <span>Spot Height: {ptB.elevationM} m</span>
                  <input type="range" min={50} max={900} step={10} value={ptB.elevationM} onChange={(e) => setPtB({ ...ptB, elevationM: Number(e.target.value) })} className="lab-slider" />
                </label>
              </div>
            </div>
          </section>

          {/* Computed Bearings & Relief Profile */}
          <section className="min-[900px]:col-span-5 rtc-card rounded-2xl p-5 flex flex-col gap-4">
            <div>
              <span className="eyebrow text-[var(--gold)]">Survey Telemetry</span>
              <h2 className="h20 text-[var(--ink)]">Live WAEC Calculations</h2>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-3">
                <div className="text-[11px] font-bold text-[var(--dim)]">Bearing B from A</div>
                <div className="mono font-extrabold text-[20px] text-[var(--gold)]">{mapMetrics.forwardBearingStr}</div>
                <div className="text-[11.5px] text-[var(--dim)]">{mapMetrics.compassQuadrant}</div>
              </div>
              <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-3">
                <div className="text-[11px] font-bold text-[var(--dim)]">Back Bearing (A from B)</div>
                <div className="mono font-extrabold text-[20px] text-[var(--ink)]">{mapMetrics.backBearingStr}</div>
                <div className="text-[11.5px] text-[var(--dim)]">±180° rule</div>
              </div>
              <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-3">
                <div className="text-[11px] font-bold text-[var(--dim)]">Ground Distance</div>
                <div className="mono font-extrabold text-[18px] text-[var(--green)]">{mapMetrics.groundDistanceKm} km</div>
                <div className="text-[11.5px] text-[var(--dim)]">Map: {mapMetrics.mapDistanceCm} cm</div>
              </div>
              <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-3">
                <div className="text-[11px] font-bold text-[var(--dim)]">Slope Gradient (VI / HE)</div>
                <div className="mono font-extrabold text-[16px] text-[var(--ink)]">{mapMetrics.gradientRatio}</div>
                <div className="text-[11.5px] text-[var(--dim)]">VI = {mapMetrics.verticalIntervalM} m</div>
              </div>
            </div>

            {/* Relief Cross-Section Profile */}
            <div className="rtc-eq-plate rounded-2xl p-4 flex flex-col gap-2">
              <div className="text-[11.5px] font-bold text-slate-300">Relief Cross-Section (A → B)</div>
              <svg viewBox="0 0 280 110" className="w-full" role="img" aria-label="Relief gradient cross section between A and B">
                {(() => {
                  const yA = 95 - (ptA.elevationM / 1000) * 75;
                  const yB = 95 - (ptB.elevationM / 1000) * 75;
                  return (
                    <>
                      <polygon points={`24,95 24,${yA} 256,${yB} 256,95`} fill="rgba(52,211,153,0.22)" />
                      <line x1="24" y1={yA} x2="256" y2={yB} stroke="#34D399" strokeWidth="3" />
                      <circle cx="24" cy={yA} r="4.5" fill="#38BDF8" />
                      <circle cx="256" cy={yB} r="4.5" fill="#FBBF24" />
                      <text x="24" y={Math.max(14, yA - 8)} fill="#38BDF8" fontSize="10" fontWeight="700">
                        A ({ptA.elevationM}m)
                      </text>
                      <text x="256" y={Math.max(14, yB - 8)} textAnchor="end" fill="#FBBF24" fontSize="10" fontWeight="700">
                        B ({ptB.elevationM}m)
                      </text>
                    </>
                  );
                })()}
              </svg>
            </div>

            <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-3.5 text-[12.5px] text-[var(--dim)] leading-relaxed">
              <strong className="text-[var(--ink)]">4-Figure vs 6-Figure:</strong> Station A is in grid square{' '}
              <span className="rtc-code">{refA.fourFig}</span> (exact: <span className="rtc-code">{refA.sixFig}</span>); Station B is in{' '}
              <span className="rtc-code">{refB.fourFig}</span> (exact: <span className="rtc-code">{refB.sixFig}</span>). Always read <strong>Eastings before Northings</strong> ("along the corridor, then up the stairs").
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
