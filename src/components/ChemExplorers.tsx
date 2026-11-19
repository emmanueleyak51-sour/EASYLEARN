import React from 'react';
import {
  EQUIL_SYSTEMS,
  GAS_SPECS,
  PH_PRESETS,
  atomBuildHint,
  calcAtomBuild,
  calcEquil,
  calcGasLaw,
  calcGibbs,
  calcPhScale,
  equilHint,
  gasLawHint,
  gibbsHint,
  type AtomBuildState,
  type ChemExplorerKind,
  type EquilState,
  type EquilSystemId,
  type GasIdentity,
  type GasLawMode,
  type GasLawState,
  type GibbsState,
  type IndicatorKind,
  type PhPresetId,
  type PhScaleState,
} from '../utils/chemExplorerLogic';
import { nm } from '../utils/mathMarkup';

function ChemSliderRow({
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
    <label className="flex items-center gap-3 min-h-[38px] text-[13.5px] font-semibold text-white/90 select-none">
      <span className="min-w-[96px] text-[#B9CCC1]">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 accent-[#FFC531] h-2 cursor-pointer"
      />
      <output className="min-w-[68px] text-right font-bold tabular-nums text-[#FFC531] font-[var(--display)]">
        {display ?? nm(value)}
      </output>
    </label>
  );
}

function ChemReadRow({ label, html }: { label: string; html: string }) {
  return (
    <div className="xr">
      <span dangerouslySetInnerHTML={{ __html: label }} />
      <b className="tabular-nums" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

export function ChemExplorerView({
  kind,
  state,
  onChange,
}: {
  kind: ChemExplorerKind;
  state: any;
  onChange: (next: any) => void;
}) {
  let visual: React.ReactNode = null;
  let controls: React.ReactNode = null;
  let readouts: React.ReactNode = null;
  let hintText = '';

  /* ── 1. GAS LAWS & KINETIC PARTICLE SIMULATOR ── */
  if (kind === 'gaslaw') {
    const s = state as GasLawState;
    const c = calcGasLaw(s);
    hintText = gasLawHint(s);

    // Piston top Y maps volume V (1..10 dm³) inside cylinder [y=36 .. y=204]
    const vNorm = Math.max(0.12, Math.min(1, c.V / 10));
    const cylBottom = 204;
    const cylMaxH = 152;
    const gasHeight = Math.max(24, cylMaxH * vNorm);
    const pistonY = cylBottom - gasHeight;

    // Speed factor from sqrt(T / Mr)
    const speedDur = Math.max(0.55, Math.min(2.8, 2.2 / Math.sqrt((c.Tk / 300) * (32 / c.mr))));
    const particles = Array.from({ length: Math.min(16, Math.max(5, Math.round(s.n * 8))) }, (_, idx) => {
      const fx = ((idx * 37 + 19) % 82) / 100;
      const fy = ((idx * 53 + 11) % 78) / 100;
      const x1 = 44 + fx * 104;
      const y1 = pistonY + 12 + fy * Math.max(10, gasHeight - 22);
      const dx = idx % 2 === 0 ? 18 : -18;
      const dy = idx % 3 === 0 ? -12 : 12;
      const x2 = Math.max(40, Math.min(152, x1 + dx));
      const y2 = Math.max(pistonY + 10, Math.min(cylBottom - 8, y1 + dy));
      return { idx, x1, y1, x2, y2 };
    });

    // Right side mini curve: Boyle hyperbola P=12/V or Charles line V=0.02T
    const gx0 = 192;
    const gy0 = 196;
    const gw = 110;
    const gh = 136;
    let curvePath = '';
    if (s.mode === 'charles') {
      curvePath = `M${gx0} ${gy0} L${gx0 + gw} ${gy0 - gh * 0.9}`;
    } else {
      for (let i = 0; i <= 36; i++) {
        const vVal = 1.5 + (8.5 * i) / 36;
        const pVal = s.mode === 'boyle' ? 12 / vVal : (s.n * 0.0821 * c.Tk) / vVal;
        const px = gx0 + ((vVal - 1) / 9) * gw;
        const py = gy0 - Math.min(1, pVal / 9) * gh;
        curvePath += `${i === 0 ? 'M' : 'L'}${px.toFixed(1)} ${py.toFixed(1)}`;
      }
    }
    const dotX =
      s.mode === 'charles'
        ? gx0 + ((c.Tk - 150) / 450) * gw
        : gx0 + ((c.V - 1) / 9) * gw;
    const dotY =
      s.mode === 'charles'
        ? gy0 - Math.min(1, c.V / 12) * gh
        : gy0 - Math.min(1, c.P / 9) * gh;

    visual = (
      <svg
        id="ilx-svg"
        viewBox="0 0 320 232"
        role="img"
        aria-label={`Gas cylinder at ${c.P} atmospheres, volume ${c.V} cubic decimetres, temperature ${c.Tk} kelvin`}
      >
        {/* Cylinder walls */}
        <rect
          x={32}
          y={44}
          width={128}
          height={162}
          rx={8}
          fill="#102119"
          stroke="#7CA08D"
          strokeWidth={2}
        />
        {/* Gas chamber tint */}
        <rect
          x={34}
          y={pistonY}
          width={124}
          height={cylBottom - pistonY}
          fill={c.color}
          fillOpacity={0.12}
        />
        {/* Piston head & shaft */}
        <rect x={88} y={14} width={16} height={Math.max(8, pistonY - 18)} fill="#94B0A1" rx={3} />
        <rect
          x={34}
          y={pistonY - 10}
          width={124}
          height={12}
          rx={3}
          fill="#FFC531"
          stroke="#0C1712"
          strokeWidth={1.5}
        />
        {/* Kinetic particles */}
        {particles.map((pt) => (
          <circle key={pt.idx} r={4.2} fill={c.color} opacity={0.95}>
            <animate
              attributeName="cx"
              values={`${pt.x1.toFixed(1)};${pt.x2.toFixed(1)};${pt.x1.toFixed(1)}`}
              dur={`${(speedDur * (0.85 + (pt.idx % 4) * 0.12)).toFixed(2)}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="cy"
              values={`${pt.y1.toFixed(1)};${pt.y2.toFixed(1)};${pt.y1.toFixed(1)}`}
              dur={`${(speedDur * (0.9 + (pt.idx % 3) * 0.15)).toFixed(2)}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
        <text x={96} y={221} textAnchor="middle" fill="#D4E4DC" fontSize={11} fontWeight={700}>
          {c.formula} · {c.Tk} K · {c.P} atm
        </text>

        {/* Live Graph Axes */}
        <line x1={gx0} y1={gy0} x2={gx0 + gw} y2={gy0} stroke="#7CA08D" strokeWidth={1.5} />
        <line x1={gx0} y1={gy0} x2={gx0} y2={gy0 - gh} stroke="#7CA08D" strokeWidth={1.5} />
        {s.mode === 'charles' && (
          <line
            x1={gx0}
            y1={gy0}
            x2={gx0 + 24}
            y2={gy0 - gh * 0.2}
            stroke="#FFC531"
            strokeDasharray="3 3"
            strokeWidth={1.5}
          />
        )}
        <path d={curvePath} fill="none" stroke="#2BD67B" strokeWidth={2.4} />
        <circle cx={dotX} cy={dotY} r={5.5} fill="#FFC531" stroke="#0C1712" strokeWidth={2} />
        <text x={gx0 + gw / 2} y={214} textAnchor="middle" fill="#A9C0B4" fontSize={10.5} fontWeight={700}>
          {s.mode === 'charles' ? 'T (Kelvin, 0 K origin)' : 'Volume V (dm³)'}
        </text>
        <text x={gx0 + 4} y={gy0 - gh + 10} fill="#A9C0B4" fontSize={10.5} fontWeight={700}>
          {s.mode === 'charles' ? 'V (dm³)' : 'P (atm)'}
        </text>
      </svg>
    );

    controls = (
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              ['boyle', "Boyle's (const T)"],
              ['charles', "Charles' (const P)"],
              ['ideal', 'PV = nRT & Diffusion'],
            ] as [GasLawMode, string][]
          ).map(([m, label]) => (
            <button
              key={m}
              type="button"
              onClick={() => onChange({ ...s, mode: m })}
              className={`chip min-h-[36px] px-3 rounded-xl text-[12.5px] font-bold border transition cursor-pointer whitespace-nowrap ${
                s.mode === m ? 'on' : ''
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {s.mode !== 'charles' && (
          <ChemSliderRow
            label="Volume V"
            min={2}
            max={10}
            step={1}
            value={s.V}
            display={`${s.V.toFixed(1)} dm³`}
            onChange={(V) => onChange({ ...s, V })}
          />
        )}
        {s.mode !== 'boyle' && (
          <ChemSliderRow
            label="Temp (°C)"
            min={-73}
            max={327}
            step={25}
            value={s.Tc}
            display={`${s.Tc} °C (${s.Tc + 273} K)`}
            onChange={(Tc) => onChange({ ...s, Tc })}
          />
        )}
        {s.mode === 'ideal' && (
          <>
            <ChemSliderRow
              label="Moles n"
              min={0.5}
              max={2.5}
              step={0.5}
              value={s.n}
              display={`${s.n.toFixed(1)} mol`}
              onChange={(n) => onChange({ ...s, n })}
            />
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {(Object.keys(GAS_SPECS) as GasIdentity[]).map((gKey) => (
                <button
                  key={gKey}
                  type="button"
                  onClick={() => onChange({ ...s, gas: gKey })}
                  className={`chip min-h-[34px] px-2.5 rounded-lg text-[12px] font-bold border transition cursor-pointer ${
                    s.gas === gKey ? 'on' : ''
                  }`}
                >
                  {GAS_SPECS[gKey].formula} (Mᵣ {GAS_SPECS[gKey].mr})
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );

    readouts = (
      <div className="xread">
        <ChemReadRow label="Pressure P &amp; Volume V" html={`${c.P} atm &nbsp;·&nbsp; ${c.V} dm³`} />
        <ChemReadRow label="Kelvin Temperature T" html={`${s.mode === 'boyle' ? '300 K (fixed)' : `${s.Tc} + 273 = ${c.Tk} K`}`} />
        {s.mode === 'boyle' && <ChemReadRow label="P × V product" html={`${c.P} × ${c.V} = <span class="gold-t">${c.PV} atm·dm³</span>`} />}
        {s.mode === 'charles' && <ChemReadRow label="V ÷ T ratio" html={`${c.V} ÷ ${c.Tk} = <span class="gold-t">${c.VoverT} dm³ K⁻¹</span>`} />}
        {s.mode === 'ideal' && (
          <>
            <ChemReadRow
              label="Vapour Density (Mᵣ ÷ 2)"
              html={`VD = ${c.vapourDensity} &nbsp;(M<sub>r</sub> = ${c.mr})`}
            />
            <ChemReadRow
              label="Diffusion rate vs O₂"
              html={`${c.relDiffusionVsO2}× O₂ &nbsp;·&nbsp; ${c.realDeviation.split(' (')[0]}`}
            />
          </>
        )}
      </div>
    );
  }

  /* ── 2. BOHR, QUANTUM SUBSHELLS & PERIODICITY BUILDER (Z = 1..20) ── */
  else if (kind === 'atombuild') {
    const s = state as AtomBuildState;
    const c = calcAtomBuild(s);
    hintText = atomBuildHint(s);

    const shellRadii = [34, 56, 78, 98];
    visual = (
      <svg
        id="ilx-svg"
        viewBox="0 0 320 236"
        role="img"
        aria-label={`${c.name} atom or ion with ${c.Z} protons, ${c.neutrons} neutrons, and ${c.electrons} electrons`}
      >
        {/* Concentric electron shells */}
        {c.shells.map((count, sIdx) => {
          const r = shellRadii[sIdx];
          return (
            <g key={sIdx}>
              <circle
                cx={122}
                cy={118}
                r={r}
                fill="none"
                stroke={sIdx === c.shells.length - 1 ? '#FFC531' : '#537866'}
                strokeOpacity={sIdx === c.shells.length - 1 ? 0.75 : 0.45}
                strokeWidth={1.5}
                strokeDasharray={sIdx === c.shells.length - 1 ? undefined : '3 3'}
              />
              {Array.from({ length: count }, (_, eIdx) => {
                const ang = (2 * Math.PI * eIdx) / count - Math.PI / 2;
                const ex = 122 + r * Math.cos(ang);
                const ey = 118 + r * Math.sin(ang);
                const isValence = sIdx === c.shells.length - 1;
                return (
                  <circle
                    key={eIdx}
                    cx={ex.toFixed(1)}
                    cy={ey.toFixed(1)}
                    r={isValence ? 4.8 : 4}
                    fill={isValence ? '#FFC531' : '#8CCBFF'}
                    stroke="#0C1712"
                    strokeWidth={1.4}
                  />
                );
              })}
            </g>
          );
        })}

        {/* Nucleus */}
        <circle cx={122} cy={118} r={20} fill="#1E4636" stroke="#2BD67B" strokeWidth={2} />
        <text x={122} y={116} textAnchor="middle" fill="#FFFFFF" fontSize={12} fontWeight={800}>
          {c.Z}p⁺
        </text>
        <text x={122} y={129} textAnchor="middle" fill="#B9CCC1" fontSize={10} fontWeight={700}>
          {c.neutrons}n⁰
        </text>

        {/* Right Nuclide & Subshell Energy Ladder */}
        <rect x={232} y={22} width={78} height={64} rx={10} fill="#152A21" stroke="#355848" />
        <text x={271} y={42} textAnchor="middle" fill="#A9C0B4" fontSize={10} fontWeight={700}>
          NUCLIDE
        </text>
        <text x={252} y={56} textAnchor="end" fill="#FFC531" fontSize={10} fontWeight={800}>
          {c.A}
        </text>
        <text x={252} y={71} textAnchor="end" fill="#8CCBFF" fontSize={10} fontWeight={800}>
          {c.Z}
        </text>
        <text x={272} y={67} textAnchor="middle" fill="#FFFFFF" fontSize={20} fontWeight={800}>
          {c.sym}
        </text>
        {s.charge !== 0 && (
          <text x={292} y={55} textAnchor="start" fill="#2BD67B" fontSize={11} fontWeight={800}>
            {s.charge > 0 ? `${s.charge === 1 ? '' : s.charge}+` : `${Math.abs(s.charge) === 1 ? '' : Math.abs(s.charge)}−`}
          </text>
        )}

        {/* Group / Period / Orbital shapes summary */}
        <rect x={232} y={96} width={78} height={116} rx={10} fill="#152A21" stroke="#355848" />
        <text x={271} y={114} textAnchor="middle" fill="#FFC531" fontSize={10.5} fontWeight={800}>
          Period {c.period}
        </text>
        <text x={271} y={130} textAnchor="middle" fill="#2BD67B" fontSize={10.5} fontWeight={800}>
          Group {c.group}
        </text>
        <line x1={242} y1={139} x2={300} y2={139} stroke="#2B483B" />
        <circle cx={252} cy={158} r={7} fill="none" stroke="#8CCBFF" strokeWidth={1.6} />
        <text x={266} y={162} fill="#E4EFE9" fontSize={10.5} fontWeight={700}>
          s: {c.sElectrons}e⁻
        </text>
        <path
          d="M252 186 C244 178, 244 194, 252 186 C260 178, 260 194, 252 186 Z"
          fill="none"
          stroke="#FFC531"
          strokeWidth={1.6}
        />
        <text x={266} y={190} fill="#E4EFE9" fontSize={10.5} fontWeight={700}>
          p: {c.pElectrons}e⁻
        </text>
      </svg>
    );

    controls = (
      <div className="flex flex-col gap-2">
        <ChemSliderRow
          label="Atomic No. Z"
          min={1}
          max={20}
          step={1}
          value={c.Z}
          display={`Z = ${c.Z} (${c.sym})`}
          onChange={(Z) => onChange({ ...s, Z, nDelta: 0, charge: 0 })}
        />
        <ChemSliderRow
          label="Isotope Δn⁰"
          min={-1}
          max={2}
          step={1}
          value={s.nDelta}
          display={`A = ${c.A}`}
          onChange={(nDelta) => onChange({ ...s, nDelta })}
        />
        <ChemSliderRow
          label="Ion Charge"
          min={-2}
          max={3}
          step={1}
          value={s.charge}
          display={s.charge === 0 ? 'Neutral (0)' : s.charge > 0 ? `+${s.charge}` : `−${Math.abs(s.charge)}`}
          onChange={(charge) => onChange({ ...s, charge })}
        />
      </div>
    );

    readouts = (
      <div className="xread">
        <ChemReadRow label={`${c.name} (${c.nuclideHtml})`} html={c.family} />
        <ChemReadRow label="Shells (K, L, M, N)" html={c.shellText} />
        <ChemReadRow label="s, p Subshell Config" html={c.orbitalHtml} />
        <ChemReadRow label="Bonding Behaviour" html={c.bondTendency} />
      </div>
    );
  }

  /* ── 3. pH, pOH, INDICATORS, CONDUCTANCE & SALT HYDROLYSIS LAB ── */
  else if (kind === 'phscale') {
    const s = state as PhScaleState;
    const c = calcPhScale(s);
    hintText = c.note;

    const scaleX = (phVal: number) => 24 + (phVal / 14) * 272;
    const markerX = scaleX(c.pH);
    const bulbFill = c.bulbLevel === 2 ? '#FFE066' : c.bulbLevel === 1 ? '#C79F32' : '#2C3E35';

    visual = (
      <svg
        id="ilx-svg"
        viewBox="0 0 320 232"
        role="img"
        aria-label={`Solution at pH ${c.pH}, pOH ${c.pOH}, indicator colour ${c.indicatorText}`}
      >
        {/* Beaker & Solution */}
        <path
          d="M44 48 L44 152 Q44 166 58 166 L148 166 Q162 166 162 152 L162 48"
          fill="none"
          stroke="#DCE7E1"
          strokeWidth={2.5}
        />
        <path
          d="M46 82 L46 151 Q46 164 58 164 L148 164 Q160 164 160 151 L160 82 Z"
          fill={c.indicatorColor}
          fillOpacity={0.78}
        />
        <ellipse cx={103} cy={82} rx={57} ry={6} fill={c.indicatorColor} fillOpacity={0.95} />
        <text x={103} y={126} textAnchor="middle" fill="#0C1712" fontSize={14} fontWeight={800}>
          pH {c.pH.toFixed(1)}
        </text>
        <text x={103} y={144} textAnchor="middle" fill="#0C1712" fontSize={10.5} fontWeight={700}>
          pOH {c.pOH.toFixed(1)}
        </text>

        {/* Conductance Electrodes + Bulb */}
        <line x1={76} y1={34} x2={76} y2={136} stroke="#94B0A1" strokeWidth={3} />
        <line x1={130} y1={34} x2={130} y2={136} stroke="#94B0A1" strokeWidth={3} />
        <path d="M76 34 L76 22 L222 22 L222 48" fill="none" stroke="#94B0A1" strokeWidth={1.8} />
        <path d="M130 34 L130 28 L252 28 L252 48" fill="none" stroke="#94B0A1" strokeWidth={1.8} />

        {/* Conductivity Bulb */}
        {c.bulbLevel === 2 && <circle cx={237} cy={66} r={26} fill="#FFE066" fillOpacity={0.25} />}
        <circle cx={237} cy={66} r={16} fill={bulbFill} stroke="#DCE7E1" strokeWidth={2} />
        <rect x={230} y={81} width={14} height={9} rx={2} fill="#8FA89B" />
        <text x={237} y={108} textAnchor="middle" fill="#E4EFE9" fontSize={10.5} fontWeight={700}>
          {c.bulbLevel === 2 ? 'Bright bulb' : c.bulbLevel === 1 ? 'Dim bulb' : 'Bulb off'}
        </text>
        <text x={237} y={122} textAnchor="middle" fill="#A9C0B4" fontSize={9.5} fontWeight={600}>
          (Conductance)
        </text>

        {/* 0–14 pH Scale Bar */}
        {[
          ['#E53935', 0],
          ['#FB8C00', 1],
          ['#FDD835', 2],
          ['#43A047', 3],
          ['#1E88E5', 4],
          ['#5E35B1', 5],
        ].map(([col, idx]) => (
          <rect
            key={idx}
            x={24 + Number(idx) * (272 / 6)}
            y={192}
            width={272 / 6 + 0.5}
            height={12}
            rx={Number(idx) === 0 || Number(idx) === 5 ? 4 : 0}
            fill={String(col)}
          />
        ))}
        <polygon
          points={`${markerX - 6},182 ${markerX + 6},182 ${markerX},191`}
          fill="#FFC531"
          stroke="#0C1712"
          strokeWidth={1.2}
        />
        {[0, 3, 7, 11, 14].map((v) => (
          <text
            key={v}
            x={scaleX(v)}
            y={219}
            textAnchor="middle"
            fill="#C9DBD1"
            fontSize={10}
            fontWeight={700}
          >
            {v === 7 ? '7 (neutral)' : v}
          </text>
        ))}
      </svg>
    );

    controls = (
      <div className="flex flex-col gap-2">
        <ChemSliderRow
          label="pH Value"
          min={0}
          max={14}
          step={0.5}
          value={c.pH}
          display={`pH ${c.pH.toFixed(1)}`}
          onChange={(pH) => onChange({ ...s, pH, preset: 'custom' })}
        />

        <div className="flex flex-wrap gap-1.5">
          {(
            [
              ['methyl', 'Methyl orange'],
              ['phenol', 'Phenolphthalein'],
              ['litmus', 'Litmus'],
              ['universal', 'Universal'],
            ] as [IndicatorKind, string][]
          ).map(([ind, lab]) => (
            <button
              key={ind}
              type="button"
              onClick={() => onChange({ ...s, indicator: ind })}
              className={`chip min-h-[34px] px-2.5 rounded-lg text-[12px] font-bold border transition cursor-pointer ${
                s.indicator === ind ? 'on' : ''
              }`}
            >
              {lab}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {(Object.keys(PH_PRESETS) as Exclude<PhPresetId, 'custom'>[]).map((pid) => (
            <button
              key={pid}
              type="button"
              onClick={() => onChange({ ...s, preset: pid, pH: PH_PRESETS[pid].pH })}
              className={`chip min-h-[32px] px-2.5 rounded-lg text-[11.5px] font-bold border transition cursor-pointer ${
                s.preset === pid ? 'on' : ''
              }`}
            >
              {PH_PRESETS[pid].label.split(' (')[0]}
            </button>
          ))}
        </div>
      </div>
    );

    readouts = (
      <div className="xread">
        <ChemReadRow label="Nature &amp; Indicator" html={`${c.nature} &nbsp;·&nbsp; ${c.indicatorText}`} />
        <ChemReadRow label="[H₃O⁺] &amp; [OH⁻]" html={`[H⁺] = ${c.hConcHtml} &nbsp;·&nbsp; [OH⁻] = ${c.ohConcHtml}`} />
        <ChemReadRow label="pH + pOH = 14" html={`${c.pH.toFixed(1)} + ${c.pOH.toFixed(1)} = 14.0`} />
        <ChemReadRow label="Electrolyte Conductance" html={c.conductance} />
      </div>
    );
  }

  /* ── 4. ENERGY PROFILE, CATALYST Ea & GIBBS SPONTANEITY ── */
  else if (kind === 'gibbs') {
    const s = state as GibbsState;
    const c = calcGibbs(s);
    hintText = gibbsHint(s);

    // Map energy (-110 .. +150) to SVG y (196 .. 28)
    const ey = (E: number) => 136 - E * 0.68;
    const yReact = ey(0);
    const yProd = ey(c.dH);
    const yPeakUncat = ey(c.baseEa);
    const yPeakCat = ey(c.activeEa);

    visual = (
      <svg
        id="ilx-svg"
        viewBox="0 0 320 232"
        role="img"
        aria-label={`Energy profile diagram: delta H ${c.dH} kilojoules per mole, activation energy ${c.activeEa}, delta G ${c.dG}`}
      >
        {/* Axes */}
        <line x1={34} y1={202} x2={302} y2={202} stroke="#7CA08D" strokeWidth={1.6} />
        <line x1={34} y1={202} x2={34} y2={20} stroke="#7CA08D" strokeWidth={1.6} />
        <text x={168} y={221} textAnchor="middle" fill="#B9CCC1" fontSize={10.5} fontWeight={700}>
          Reaction pathway (progress of reaction)
        </text>
        <text
          x={15}
          y={112}
          textAnchor="middle"
          fill="#B9CCC1"
          fontSize={10.5}
          fontWeight={700}
          transform="rotate(-90 15 112)"
        >
          Enthalpy H (kJ mol⁻¹)
        </text>

        {/* Uncatalysed curve (dashed if catalyst ON) */}
        <path
          d={`M46 ${yReact.toFixed(1)} L98 ${yReact.toFixed(1)} C130 ${yReact.toFixed(1)}, 142 ${yPeakUncat.toFixed(1)}, 168 ${yPeakUncat.toFixed(1)} C194 ${yPeakUncat.toFixed(1)}, 206 ${yProd.toFixed(1)}, 238 ${yProd.toFixed(1)} L292 ${yProd.toFixed(1)}`}
          fill="none"
          stroke={s.catalyst ? '#7CA08D' : '#FFC531'}
          strokeWidth={s.catalyst ? 1.8 : 2.8}
          strokeDasharray={s.catalyst ? '4 4' : undefined}
        />

        {/* Catalysed lower-Ea curve */}
        {s.catalyst && (
          <path
            d={`M98 ${yReact.toFixed(1)} C130 ${yReact.toFixed(1)}, 142 ${yPeakCat.toFixed(1)}, 168 ${yPeakCat.toFixed(1)} C194 ${yPeakCat.toFixed(1)}, 206 ${yProd.toFixed(1)}, 238 ${yProd.toFixed(1)}`}
            fill="none"
            stroke="#2BD67B"
            strokeWidth={2.8}
          />
        )}

        {/* Reference dashed lines for Reactants & Products */}
        <line x1={98} y1={yReact} x2={245} y2={yReact} stroke="#537866" strokeDasharray="2 3" />
        <text x={72} y={yReact - 6} textAnchor="middle" fill="#FFFFFF" fontSize={10.5} fontWeight={700}>
          Reactants
        </text>
        <text x={266} y={yProd - 6} textAnchor="middle" fill="#FFFFFF" fontSize={10.5} fontWeight={700}>
          Products
        </text>

        {/* Ea vertical marker */}
        <line
          x1={168}
          y1={yReact}
          x2={168}
          y2={s.catalyst ? yPeakCat : yPeakUncat}
          stroke="#8CCBFF"
          strokeWidth={1.8}
        />
        <text
          x={174}
          y={(yReact + (s.catalyst ? yPeakCat : yPeakUncat)) / 2 + 3}
          fill="#8CCBFF"
          fontSize={10.5}
          fontWeight={800}
        >
          Eₐ = {c.activeEa}
        </text>

        {/* ΔG spontaneity status banner */}
        <rect
          x={186}
          y={18}
          width={122}
          height={26}
          rx={7}
          fill={c.isSpontaneous ? '#134E32' : c.isEquilibrium ? '#4D3D12' : '#522024'}
          stroke={c.isSpontaneous ? '#2BD67B' : c.isEquilibrium ? '#FFC531' : '#F67570'}
        />
        <text x={247} y={35} textAnchor="middle" fill="#FFFFFF" fontSize={10.5} fontWeight={800}>
          ΔG° = {c.dG > 0 ? `+${c.dG}` : c.dG} kJ/mol
        </text>
      </svg>
    );

    controls = (
      <div className="flex flex-col gap-1.5">
        <ChemSliderRow
          label="ΔH° (heat)"
          min={-100}
          max={100}
          step={20}
          value={s.dH}
          display={`${s.dH > 0 ? '+' : ''}${s.dH} kJ`}
          onChange={(dH) => onChange({ ...s, dH })}
        />
        <ChemSliderRow
          label="Uncat. Eₐ"
          min={50}
          max={130}
          step={10}
          value={s.Ea}
          display={`${c.baseEa} kJ`}
          onChange={(Ea) => onChange({ ...s, Ea })}
        />
        <ChemSliderRow
          label="ΔS° (entropy)"
          min={-200}
          max={200}
          step={50}
          value={s.dS}
          display={`${s.dS > 0 ? '+' : ''}${s.dS} J/K`}
          onChange={(dS) => onChange({ ...s, dS })}
        />
        <ChemSliderRow
          label="Temp T"
          min={200}
          max={1000}
          step={100}
          value={s.T}
          display={`${s.T} K`}
          onChange={(T) => onChange({ ...s, T })}
        />
        <div className="pt-1">
          <button
            type="button"
            onClick={() => onChange({ ...s, catalyst: !s.catalyst })}
            className={`chip min-h-[36px] px-3.5 rounded-xl text-[12.5px] font-bold border transition cursor-pointer ${
              s.catalyst ? 'on' : ''
            }`}
          >
            {s.catalyst ? 'Catalyst (MnO₂): ON — lower Eₐ' : 'Add Catalyst (MnO₂)'}
          </button>
        </div>
      </div>
    );

    readouts = (
      <div className="xread">
        <ChemReadRow label="Enthalpy Change ΔH°" html={`${s.dH > 0 ? '+' : ''}${s.dH} kJ mol⁻¹ (${c.heatType})`} />
        <ChemReadRow
          label="Activation Energy Eₐ"
          html={`${c.activeEa} kJ mol⁻¹ ${s.catalyst ? `(down from ${c.baseEa})` : ''}`}
        />
        <ChemReadRow
          label="ΔG° = ΔH° − TΔS°"
          html={`${c.dG > 0 ? '+' : ''}${c.dG} kJ mol⁻¹ → <span>${c.spontaneity}</span>`}
        />
      </div>
    );
  }

  /* ── 5. LE CHATELIER DYNAMIC EQUILIBRIUM SANDBOX ── */
  else if (kind === 'equil') {
    const s = state as EquilState;
    const c = calcEquil(s);
    hintText = equilHint(s);

    // Vessel tint for N2O4/NO2 brown gas vs Haber/Iron
    const vesselTint =
      s.sys === 'no2'
        ? `rgba(186, 86, 36, ${(0.14 + (c.yieldPct / 100) * 0.68).toFixed(2)})`
        : s.sys === 'haber'
          ? `rgba(43, 214, 123, ${(0.1 + (c.yieldPct / 100) * 0.42).toFixed(2)})`
          : `rgba(140, 203, 255, ${(0.12 + (c.yieldPct / 100) * 0.36).toFixed(2)})`;

    visual = (
      <svg
        id="ilx-svg"
        viewBox="0 0 320 226"
        role="img"
        aria-label={`${c.spec.name} equilibrium with ${c.yieldPct} percent products`}
      >
        {/* Reaction Vessel */}
        <rect x={22} y={24} width={276} height={92} rx={14} fill="#102119" stroke="#6E9481" strokeWidth={2} />
        <rect x={24} y={26} width={272} height={88} rx={12} fill={vesselTint} />
        <text x={160} y={52} textAnchor="middle" fill="#FFFFFF" fontSize={12.5} fontWeight={800}>
          {c.spec.name}
        </text>
        <text x={160} y={74} textAnchor="middle" fill="#FFE599" fontSize={11.5} fontWeight={700}>
          Dynamic Equilibrium: forward rate = backward rate
        </text>
        <text x={160} y={96} textAnchor="middle" fill="#D5E5DD" fontSize={11} fontWeight={700}>
          {s.T} °C &nbsp;·&nbsp; {s.P} atm &nbsp;·&nbsp; {s.catalyst ? 'Fe Catalyst ON' : 'No catalyst'}
        </text>

        {/* Equilibrium Mixture Bar */}
        <text x={24} y={142} fill="#B9CCC1" fontSize={11} fontWeight={700}>
          Reactants ({c.reactantPct}%)
        </text>
        <text x={296} y={142} textAnchor="end" fill="#2BD67B" fontSize={11} fontWeight={800}>
          Products ({c.yieldPct}%)
        </text>
        <rect x={24} y={150} width={272} height={22} rx={8} fill="#213A2E" />
        <rect
          x={24 + (272 * c.reactantPct) / 100}
          y={150}
          width={(272 * c.yieldPct) / 100}
          height={22}
          rx={6}
          fill="#2BD67B"
        />
        <line
          x1={24 + (272 * c.reactantPct) / 100}
          y1={145}
          x2={24 + (272 * c.reactantPct) / 100}
          y2={177}
          stroke="#FFC531"
          strokeWidth={3}
        />
        <text x={160} y={202} textAnchor="middle" fill="#E4EFE9" fontSize={11} fontWeight={700}>
          K_c: {c.kcStatus}
        </text>
      </svg>
    );

    controls = (
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(EQUIL_SYSTEMS) as EquilSystemId[]).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() =>
                onChange({
                  sys: id,
                  T: EQUIL_SYSTEMS[id].baseTemp,
                  P: EQUIL_SYSTEMS[id].basePress,
                  catalyst: false,
                })
              }
              className={`chip min-h-[34px] px-2.5 rounded-lg text-[12px] font-bold border transition cursor-pointer ${
                s.sys === id ? 'on' : ''
              }`}
            >
              {EQUIL_SYSTEMS[id].name}
            </button>
          ))}
        </div>
        <ChemSliderRow
          label="Temp T"
          min={200}
          max={600}
          step={50}
          value={s.T}
          display={`${s.T} °C`}
          onChange={(T) => onChange({ ...s, T })}
        />
        <ChemSliderRow
          label="Pressure P"
          min={10}
          max={300}
          step={10}
          value={s.P}
          display={`${s.P} atm`}
          onChange={(P) => onChange({ ...s, P })}
        />
        <div>
          <button
            type="button"
            onClick={() => onChange({ ...s, catalyst: !s.catalyst })}
            className={`chip min-h-[34px] px-3 rounded-xl text-[12px] font-bold border transition cursor-pointer ${
              s.catalyst ? 'on' : ''
            }`}
          >
            {s.catalyst ? 'Catalyst: ON (faster, same yield)' : 'Add Catalyst'}
          </button>
        </div>
      </div>
    );

    readouts = (
      <div className="xread">
        <div className="xeq text-[13.5px]" dangerouslySetInnerHTML={{ __html: c.spec.eqHtml }} />
        <ChemReadRow label="Equilibrium Yield" html={`<span class="green-t">${c.yieldPct}% products</span>`} />
        <ChemReadRow label="Pressure Rule" html={c.pressureEffect} />
        <ChemReadRow label="Equilibrium Constant K_c" html={c.kcStatus} />
      </div>
    );
  }

  return (
    <section className="xp">
      <div className="xv">{visual}</div>
      {readouts}
      {controls}
      {hintText && (
        <div className="rounded-xl bg-[#15241C] border border-[var(--line)] p-3 flex items-start gap-2.5 text-[13.5px]">
          <span className="shrink-0 w-7 h-7 rounded-full bg-[#FFC531] text-[#0C1712] font-extrabold text-[11px] flex items-center justify-center">
            PS
          </span>
          <p className="text-white/95 leading-snug" dangerouslySetInnerHTML={{ __html: hintText }} />
        </div>
      )}
    </section>
  );
}
