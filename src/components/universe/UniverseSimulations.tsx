import React, { useState } from 'react';
import type { AvatarCustomization } from '../../utils/learningUniverseLogic';
import type { UniverseSimulationKind } from '../../data/learningUniverseWorlds';
import { triggerLightHaptic } from '../../utils/readingComfortLogic';
import {
  CONCORD_FORGE_CHALLENGES,
  computeMarketEquilibriumState,
  evaluateConcordSelection,
} from '../../utils/platformUpgradesLogic';
import { Icon } from '../Icons';

const OUTFIT_PALETTES: Record<
  AvatarCustomization['outfitColor'],
  { primary: string; secondary: string; trim: string; glow: string }
> = {
  indigo: { primary: '#4F46E5', secondary: '#312E81', trim: '#FACC15', glow: '#818CF8' },
  crimson: { primary: '#E11D48', secondary: '#881337', trim: '#FDE047', glow: '#FB7185' },
  emerald: { primary: '#059669', secondary: '#064E3B', trim: '#FCD34D', glow: '#34D399' },
  amber: { primary: '#D97706', secondary: '#78350F', trim: '#FEF08A', glow: '#FBBF24' },
};

/**
 * Custom layered SVG player character avatar reflecting Role, Outfit Colour, Headgear & Emblem.
 */
export function ExplorerAvatarSvg({
  avatar,
  size = 76,
  className = '',
}: {
  avatar: AvatarCustomization;
  size?: number;
  className?: string;
}) {
  const pal = OUTFIT_PALETTES[avatar.outfitColor] || OUTFIT_PALETTES.indigo;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      role="img"
      aria-label={`Player avatar (${avatar.role})`}
      className={`shrink-0 select-none ${className}`}
    >
      <rect width="96" height="96" rx="24" fill="#0F172A" />
      <circle cx="48" cy="48" r="38" fill={pal.secondary} fillOpacity="0.55" />
      <circle cx="48" cy="48" r="37" stroke={pal.glow} strokeOpacity="0.45" strokeWidth="1.5" />

      {/* Shoulders & Explorer Tunic */}
      <path
        d="M20 88 C22 67, 34 60, 48 60 C62 60, 74 67, 76 88 Z"
        fill={pal.primary}
        stroke="#0B1120"
        strokeWidth="2.2"
      />
      {/* Collar & trim */}
      <path d="M38 61 L48 73 L58 61" stroke={pal.trim} strokeWidth="3" strokeLinecap="round" />

      {/* Neck & Warm Nigerian Scholar Portrait */}
      <rect x="43" y="50" width="10" height="12" rx="4" fill="#8D5524" />
      <circle cx="48" cy="39" r="16" fill="#A66A38" stroke="#0B1120" strokeWidth="2" />

      {/* Hair */}
      <path
        d="M32 36 C32 23, 64 23, 64 36 C64 29, 57 25, 48 25 C39 25, 32 29, 32 36 Z"
        fill="#1E1B24"
      />

      {/* Eyes & Confident Smile */}
      <circle cx="42.5" cy="39" r="2" fill="#0F172A" />
      <circle cx="53.5" cy="39" r="2" fill="#0F172A" />
      <path
        d="M43 46 Q48 50 53 46"
        stroke="#27130A"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Headgear Layer */}
      {avatar.headgear === 'visor' && (
        <rect
          x="34"
          y="34"
          width="28"
          height="8"
          rx="4"
          fill="#38BDF8"
          fillOpacity="0.78"
          stroke={pal.trim}
          strokeWidth="1.6"
        />
      )}
      {avatar.headgear === 'goggles' && (
        <g>
          <rect x="33" y="25" width="30" height="6" rx="3" fill="#334155" />
          <circle cx="41" cy="28" r="5" fill="#34D399" stroke={pal.trim} strokeWidth="1.8" />
          <circle cx="55" cy="28" r="5" fill="#34D399" stroke={pal.trim} strokeWidth="1.8" />
        </g>
      )}
      {avatar.headgear === 'circlet' && (
        <g>
          <path d="M33 29 Q48 22 63 29" stroke={pal.trim} strokeWidth="3" fill="none" />
          <polygon points="48,20 51,26 48,30 45,26" fill="#38BDF8" />
        </g>
      )}
      {avatar.headgear === 'beret' && (
        <path
          d="M30 30 C32 18, 62 16, 66 28 C54 25, 38 26, 30 30 Z"
          fill={pal.primary}
          stroke={pal.trim}
          strokeWidth="1.8"
        />
      )}

      {/* Chest Emblem Badge */}
      <circle cx="48" cy="78" r="7" fill="#0F172A" stroke={pal.trim} strokeWidth="1.6" />
      {avatar.emblem === 'heart' && (
        <path
          d="M48 82 C44 79, 43 76, 45 74.5 C46.5 73.5, 48 75, 48 75 C48 75, 49.5 73.5, 51 74.5 C53 76, 52 79, 48 82 Z"
          fill="#FB7185"
        />
      )}
      {avatar.emblem === 'atom' && (
        <g stroke="#38BDF8" strokeWidth="1.2">
          <ellipse cx="48" cy="78" rx="4.5" ry="2" transform="rotate(30 48 78)" />
          <ellipse cx="48" cy="78" rx="4.5" ry="2" transform="rotate(-30 48 78)" />
        </g>
      )}
      {avatar.emblem === 'flask' && (
        <path d="M46.5 74 H49.5 M47 74 V76.5 L44.8 81 H51.2 L49 76.5 V74" stroke="#34D399" strokeWidth="1.4" />
      )}
      {avatar.emblem === 'compass' && (
        <polygon points="48,73.5 50,78 48,82.5 46,78" fill={pal.trim} />
      )}
    </svg>
  );
}

const HEART_CHECKPOINTS = [
  {
    id: 'vc-ra',
    shortLabel: '1. Vena Cava → Right Atrium',
    oxygenState: 'DEOXYGENATED · LOW O₂',
    isOxygenated: false,
    x: 92,
    y: 78,
    note: 'Deoxygenated venous blood from the body enters the thin-walled Right Atrium.',
  },
  {
    id: 'rv',
    shortLabel: '2. Tricuspid → Right Ventricle',
    oxygenState: 'DEOXYGENATED · LOW O₂',
    isOxygenated: false,
    x: 105,
    y: 152,
    note: 'Passes through the one-way tricuspid valve into the Right Ventricle.',
  },
  {
    id: 'pa-lungs',
    shortLabel: '3. Pulmonary Artery → Lungs',
    oxygenState: 'GAS EXCHANGE · CO₂ OUT, O₂ IN',
    isOxygenated: true,
    x: 160,
    y: 34,
    note: 'Right Ventricle pumps blood via the Pulmonary Artery to the lung alveoli for oxygenation!',
  },
  {
    id: 'pv-la',
    shortLabel: '4. Pulmonary Vein → Left Atrium',
    oxygenState: 'OXYGENATED · HIGH O₂',
    isOxygenated: true,
    x: 226,
    y: 78,
    note: 'Bright red oxygen-rich blood returns via the Pulmonary Vein into the Left Atrium.',
  },
  {
    id: 'lv',
    shortLabel: '5. Bicuspid → Left Ventricle',
    oxygenState: 'OXYGENATED · HIGH PRESSURE',
    isOxygenated: true,
    x: 214,
    y: 152,
    note: 'Flows past the bicuspid (mitral) valve into the thick, muscular Left Ventricle.',
  },
  {
    id: 'aorta',
    shortLabel: '6. Aorta → Whole Body',
    oxygenState: 'SYSTEMIC DELIVERY · COMPLETE',
    isOxygenated: true,
    x: 176,
    y: 54,
    note: 'Powerful left ventricular contraction surges oxygenated blood out the Aorta to the body!',
  },
];

/**
 * Interactive Stage 2 Sandbox Router following 6_education_simulations.md Two-Zone Layout:
 * Left/Top = Live responsive SVG system stage; Right/Bottom = Parameter controls + explicit state readouts.
 */
export function UniverseStageSimulation({
  kind,
  pathwayNodes,
  completed,
  onComplete,
}: {
  kind: UniverseSimulationKind;
  pathwayNodes?: { id: string; label: string; stateNote: string }[];
  completed: boolean;
  onComplete: () => void;
}) {
  // 1. Heart Circulation State
  const [heartStep, setHeartStep] = useState<number>(0);

  // 2. Osmosis Tonicity State (0.1% to 2.0% NaCl; 0.9% is isotonic)
  const [salinePct, setSalinePct] = useState<number>(0.2);
  const [osmosisVisitedExtremes, setOsmosisVisitedExtremes] = useState<boolean>(false);

  // 3. Enzyme State
  const [tempC, setTempC] = useState<number>(20);
  const [phVal, setPhVal] = useState<number>(2);

  // 4. Chem Atom State
  const [atomicZ, setAtomicZ] = useState<number>(11);
  const [inspectedHalogen, setInspectedHalogen] = useState<boolean>(false);

  // 5. Physics Escape Velocity State
  const [launchVelKmS, setLaunchVelKmS] = useState<number>(6.5);

  // 6. Maths Parabolic Bridge State
  const [rootA, setRootA] = useState<number>(1);
  const [rootB, setRootB] = useState<number>(5);

  // 7. English Concord Forge State
  const [concordIdx, setConcordIdx] = useState<number>(0);
  const [concordPicked, setConcordPicked] = useState<string | null>(null);
  const [concordSolvedMap, setConcordSolvedMap] = useState<Record<string, boolean>>({});

  // 8. Economics Supply & Demand Equilibrium State
  const [marketPrice, setMarketPrice] = useState<number>(300);
  const [testedDisequilibrium, setTestedDisequilibrium] = useState<boolean>(true);

  // 9. Generic Concept Pathway State
  const [pathIdx, setPathIdx] = useState<number>(0);

  if (kind === 'heart_circulation') {
    const cur = HEART_CHECKPOINTS[heartStep];
    const advanceHeart = (idx: number) => {
      triggerLightHaptic(8);
      setHeartStep(idx);
      if (idx >= HEART_CHECKPOINTS.length - 1 && !completed) {
        onComplete();
      }
    };

    return (
      <div className="grid grid-cols-1 min-[840px]:grid-cols-12 gap-4 items-stretch">
        {/* Left: Interactive 4-Chamber Cardiovascular Diagram */}
        <div className="min-[840px]:col-span-7 rounded-2xl bg-[#130912] border border-rose-500/30 p-4 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between gap-2 text-[12px] font-bold">
            <span className="text-rose-200">Interactive Four-Chamber Pathway</span>
            <span
              className={`tabular-nums ${
                cur.isOxygenated ? 'text-emerald-300' : 'text-sky-300'
              }`}
            >
              ● {cur.oxygenState}
            </span>
          </div>

          <svg
            viewBox="0 0 320 205"
            className="w-full max-h-[240px] mx-auto select-none"
            role="img"
            aria-label="Interactive human heart double circulation diagram"
          >
            {/* Lungs Capillary Bed Top */}
            <rect
              x="98"
              y="12"
              width="124"
              height="34"
              rx="17"
              fill={heartStep >= 2 ? 'rgba(225,29,72,0.28)' : 'rgba(14,165,233,0.18)'}
              stroke={heartStep === 2 ? '#34D399' : 'rgba(255,255,255,0.28)'}
              strokeWidth="1.6"
            />
            <text x="160" y="33" textAnchor="middle" fill="#F8FAFC" fontSize="11" fontWeight="700">
              LUNGS (Gas Exchange)
            </text>

            {/* Right Heart Chambers (Deoxygenated - Viewer's Left) */}
            <rect
              x="52"
              y="58"
              width="86"
              height="52"
              rx="14"
              fill={heartStep === 0 ? '#0284C7' : 'rgba(2,132,199,0.28)'}
              stroke="#38BDF8"
              strokeWidth="1.8"
            />
            <text x="95" y="82" textAnchor="middle" fill="#FFFFFF" fontSize="10.5" fontWeight="700">
              Right Atrium
            </text>
            <text x="95" y="97" textAnchor="middle" fill="#BAE6FD" fontSize="9">
              From Vena Cava
            </text>

            <rect
              x="52"
              y="122"
              width="92"
              height="64"
              rx="16"
              fill={heartStep === 1 ? '#0369A1' : 'rgba(3,105,161,0.32)'}
              stroke="#38BDF8"
              strokeWidth="2"
            />
            <text x="98" y="152" textAnchor="middle" fill="#FFFFFF" fontSize="10.5" fontWeight="700">
              Right Ventricle
            </text>
            <text x="98" y="167" textAnchor="middle" fill="#BAE6FD" fontSize="9">
              Pumps to Lungs
            </text>

            {/* Muscular Septum Divider */}
            <rect x="153" y="58" width="14" height="128" rx="6" fill="#4C1D24" />
            <text
              x="160"
              y="126"
              textAnchor="middle"
              fill="#FDA4AF"
              fontSize="8"
              fontWeight="700"
              transform="rotate(-90 160 126)"
            >
              SEPTUM
            </text>

            {/* Left Heart Chambers (Oxygenated - Viewer's Right, Thicker Wall!) */}
            <rect
              x="182"
              y="58"
              width="86"
              height="52"
              rx="14"
              fill={heartStep === 3 ? '#E11D48' : 'rgba(225,29,72,0.28)'}
              stroke="#FB7185"
              strokeWidth="1.8"
            />
            <text x="225" y="82" textAnchor="middle" fill="#FFFFFF" fontSize="10.5" fontWeight="700">
              Left Atrium
            </text>
            <text x="225" y="97" textAnchor="middle" fill="#FECDD3" fontSize="9">
              From Pulm. Vein
            </text>

            <rect
              x="176"
              y="122"
              width="94"
              height="64"
              rx="16"
              fill={heartStep >= 4 ? '#BE123C' : 'rgba(190,18,60,0.32)'}
              stroke="#FDA4AF"
              strokeWidth="4"
            />
            <text x="223" y="152" textAnchor="middle" fill="#FFFFFF" fontSize="10.5" fontWeight="700">
              Left Ventricle
            </text>
            <text x="223" y="167" textAnchor="middle" fill="#FECDD3" fontSize="9">
              Thick Wall → Aorta
            </text>

            {/* Flow Arrows */}
            <path d="M95 110 L95 122" stroke="#7DD3FC" strokeWidth="2.5" />
            <path d="M126 122 C132 82, 136 60, 142 46" stroke="#38BDF8" strokeWidth="2.5" strokeDasharray="4 3" />
            <path d="M188 46 C198 52, 212 55, 220 58" stroke="#FB7185" strokeWidth="2.5" strokeDasharray="4 3" />
            <path d="M225 110 L225 122" stroke="#FDA4AF" strokeWidth="2.5" />

            {/* Live Active Blood Pulse Marker */}
            <circle
              cx={cur.x}
              cy={cur.y}
              r="9"
              fill={cur.isOxygenated ? '#FB7185' : '#38BDF8'}
              stroke="#FFFFFF"
              strokeWidth="2.5"
            />
          </svg>

          <p className="text-[13px] text-rose-100/90 leading-snug">{cur.note}</p>
        </div>

        {/* Right: Step-by-Step Pathway Controller */}
        <div className="min-[840px]:col-span-5 rounded-2xl bg-[var(--card)] border border-[var(--line)] p-4 flex flex-col justify-between gap-3">
          <div className="flex flex-col gap-2">
            <div className="text-[12px] font-bold text-[var(--gold)] tabular-nums">
              Checkpoint {heartStep + 1} of {HEART_CHECKPOINTS.length}
            </div>
            <div className="flex flex-col gap-1.5">
              {HEART_CHECKPOINTS.map((cp, idx) => {
                const active = idx === heartStep;
                const reached = idx <= heartStep;
                return (
                  <button
                    key={cp.id}
                    type="button"
                    onClick={() => advanceHeart(idx)}
                    className={`min-h-[38px] px-3 py-1.5 rounded-xl text-left text-[12.5px] font-bold flex items-center justify-between gap-2 transition cursor-pointer ${
                      active
                        ? 'bg-[var(--gold)] text-[var(--on-acc)]'
                        : reached
                          ? 'bg-[var(--acc-soft)] text-[var(--ink)] border border-[var(--acc-line)]'
                          : 'bg-[var(--bg)] text-[var(--dim)] border border-[var(--line)] hover:text-[var(--ink)]'
                    }`}
                  >
                    <span className="truncate">{cp.shortLabel}</span>
                    {reached && <Icon name="check" size={14} className="shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              advanceHeart(Math.min(HEART_CHECKPOINTS.length - 1, heartStep + 1))
            }
            disabled={heartStep >= HEART_CHECKPOINTS.length - 1}
            className="btn-tactile indigo w-full whitespace-nowrap disabled:opacity-55"
          >
            <span>
              {completed
                ? 'Circulation Loop Verified'
                : `Advance Blood Pulse (${heartStep + 1}/6)`}
            </span>
            <Icon name={completed ? 'check' : 'go'} size={16} />
          </button>
        </div>
      </div>
    );
  }

  if (kind === 'cell_osmosis') {
    const state =
      salinePct < 0.75
        ? { label: '▲ HYPOTONIC · SWELLING / HAEMOLYSIS RISK', radius: 52, color: '#F43F5E' }
        : salinePct > 1.05
          ? { label: '▼ HYPERTONIC · SHRINKING (CRENATED)', radius: 26, color: '#F59E0B' }
          : { label: '● ISOTONIC (0.9% NaCl) · HEALTHY BICONCAVE', radius: 38, color: '#10B981' };

    const handleChangeSaline = (val: number) => {
      const rounded = Math.round(val * 10) / 10;
      setSalinePct(rounded);
      if (rounded <= 0.4 || rounded >= 1.4) {
        setOsmosisVisitedExtremes(true);
      }
      if (rounded >= 0.8 && rounded <= 1.0 && (osmosisVisitedExtremes || !completed)) {
        onComplete();
      }
    };

    return (
      <div className="grid grid-cols-1 min-[840px]:grid-cols-12 gap-4 items-stretch">
        <div className="min-[840px]:col-span-7 rounded-2xl bg-[#0B192C] border border-sky-500/30 p-4 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between gap-2 text-[12px] font-bold text-sky-100">
            <span>Red Blood Cell Osmometer</span>
            <span className="tabular-nums">{state.label}</span>
          </div>
          <svg viewBox="0 0 280 170" className="w-full max-h-[200px] mx-auto" role="img" aria-label="Red blood cell osmosis simulation">
            <rect x="14" y="14" width="252" height="142" rx="18" fill="rgba(14,165,233,0.14)" stroke="rgba(125,211,252,0.3)" />
            <circle
              cx="140"
              cy="85"
              r={state.radius}
              fill={state.color}
              fillOpacity="0.82"
              stroke="#FFE4E6"
              strokeWidth="3"
            />
            <circle
              cx="140"
              cy="85"
              r={Math.max(10, state.radius * 0.42)}
              fill="rgba(0,0,0,0.22)"
            />
            <text x="140" y="148" textAnchor="middle" fill="#E0F2FE" fontSize="11" fontWeight="700">
              External Drip: {salinePct.toFixed(1)}% NaCl · Cytoplasm: 0.9% NaCl
            </text>
          </svg>
        </div>

        <div className="min-[840px]:col-span-5 rounded-2xl bg-[var(--card)] border border-[var(--line)] p-4 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-3">
            <label htmlFor="saline-slider" className="text-[13px] font-bold text-[var(--ink)] flex justify-between tabular-nums">
              <span>External Saline Concentration</span>
              <span className="text-[var(--gold)]">{salinePct.toFixed(1)}% NaCl</span>
            </label>
            <input
              id="saline-slider"
              type="range"
              min={0.1}
              max={1.9}
              step={0.1}
              value={salinePct}
              onChange={(e) => handleChangeSaline(Number(e.target.value))}
              className="w-full accent-[var(--gold)] cursor-pointer"
            />
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: '0.1% Pure H₂O', val: 0.1 },
                { label: '0.9% Isotonic', val: 0.9 },
                { label: '1.8% Brine', val: 1.8 },
              ].map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    triggerLightHaptic(8);
                    handleChangeSaline(preset.val);
                  }}
                  className="min-h-[36px] px-2 rounded-xl bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--acc-line)] text-[11.5px] font-bold text-[var(--ink)] cursor-pointer whitespace-nowrap"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
          <div className="text-[12.5px] text-[var(--dim)]">
            {completed
              ? 'Isotonic 0.9% NaCl verified — zero net osmotic damage!'
              : 'Tap 0.9% Isotonic to stabilise the red blood cell membrane.'}
          </div>
        </div>
      </div>
    );
  }

  if (kind === 'enzyme_curve') {
    const tempFactor =
      tempC <= 37
        ? Math.max(0.1, 1 - Math.pow((37 - tempC) / 35, 2))
        : Math.max(0, 1 - Math.pow((tempC - 37) / 14, 1.5));
    const phFactor = Math.max(0.1, 1 - Math.abs(phVal - 2) * 0.16);
    const ratePct = tempC >= 55 ? 0 : Math.round(tempFactor * phFactor * 100);
    const denatured = tempC >= 55;

    const updateEnzyme = (nextTemp: number, nextPh: number) => {
      setTempC(nextTemp);
      setPhVal(nextPh);
      if (nextTemp >= 35 && nextTemp <= 40 && nextPh === 2 && !completed) {
        onComplete();
      }
    };

    return (
      <div className="grid grid-cols-1 min-[840px]:grid-cols-12 gap-4 items-stretch">
        <div className="min-[840px]:col-span-7 rounded-2xl bg-[#101827] border border-emerald-500/30 p-4 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between text-[12px] font-bold text-emerald-100">
            <span>Pepsin Catalytic Reactor</span>
            <span className="tabular-nums">
              {denatured
                ? '▲ DENATURED · 0% ACTIVITY'
                : `● REACTION RATE: ${ratePct}%`}
            </span>
          </div>
          <svg viewBox="0 0 280 150" className="w-full max-h-[180px]" role="img" aria-label="Enzyme reaction rate curve">
            <line x1="28" y1="125" x2="260" y2="125" stroke="#475569" strokeWidth="1.5" />
            <line x1="28" y1="20" x2="28" y2="125" stroke="#475569" strokeWidth="1.5" />
            <path
              d="M 32 115 Q 115 95, 162 28 Q 195 32, 225 124 L 255 124"
              fill="none"
              stroke="#34D399"
              strokeWidth="3"
            />
            <circle
              cx={32 + ((tempC - 5) / 65) * 220}
              cy={124 - (ratePct / 100) * 96}
              r="7"
              fill={denatured ? '#EF4444' : '#FACC15'}
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            <text x="162" y="18" textAnchor="middle" fill="#A7F3D0" fontSize="10" fontWeight="700">
              Optimum 37°C
            </text>
          </svg>
        </div>

        <div className="min-[840px]:col-span-5 rounded-2xl bg-[var(--card)] border border-[var(--line)] p-4 flex flex-col justify-between gap-3">
          <div className="flex flex-col gap-3">
            <label htmlFor="enzyme-temp" className="text-[12.5px] font-bold text-[var(--ink)] flex justify-between tabular-nums">
              <span>Temperature</span>
              <span className="text-[var(--gold)]">{tempC}°C</span>
            </label>
            <input
              id="enzyme-temp"
              type="range"
              min={5}
              max={70}
              step={1}
              value={tempC}
              onChange={(e) => updateEnzyme(Number(e.target.value), phVal)}
              className="w-full accent-[var(--gold)] cursor-pointer"
            />

            <div className="flex items-center justify-between gap-2 pt-1">
              {[
                { label: 'pH 2 (Stomach)', p: 2 },
                { label: 'pH 7 (Neutral)', p: 7 },
                { label: 'pH 8 (Duodenum)', p: 8 },
              ].map((b) => (
                <button
                  key={b.p}
                  type="button"
                  onClick={() => {
                    triggerLightHaptic(8);
                    updateEnzyme(37, b.p);
                  }}
                  className={`flex-1 min-h-[36px] px-2 rounded-xl text-[11.5px] font-bold cursor-pointer whitespace-nowrap ${
                    phVal === b.p
                      ? 'bg-[var(--gold)] text-[var(--on-acc)]'
                      : 'bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)]'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>
          <p className="text-[12px] text-[var(--dim)]">
            Tune to <strong>37°C</strong> and <strong>pH 2 (Stomach)</strong> to hit peak pepsin rate!
          </p>
        </div>
      </div>
    );
  }

  if (kind === 'chem_atom') {
    const shells =
      atomicZ === 11
        ? { symbol: 'Na', name: 'Sodium (Alkali Metal)', cfg: '2, 8, 1', valence: 1 }
        : { symbol: 'Cl', name: 'Chlorine (Halogen)', cfg: '2, 8, 7', valence: 7 };

    return (
      <div className="grid grid-cols-1 min-[840px]:grid-cols-12 gap-4 items-stretch">
        <div className="min-[840px]:col-span-7 rounded-2xl bg-[#0C1F1D] border border-emerald-500/30 p-4 flex flex-col items-center justify-between gap-2">
          <div className="w-full flex items-center justify-between text-[12px] font-bold text-emerald-100">
            <span>{shells.name}</span>
            <span className="tabular-nums">Z = {atomicZ} · Shells: {shells.cfg}</span>
          </div>
          <svg viewBox="0 0 220 180" className="w-full max-h-[185px]" role="img" aria-label="Atomic electron shells">
            <circle cx="110" cy="90" r="24" fill="none" stroke="rgba(52,211,153,0.35)" strokeWidth="1.5" />
            <circle cx="110" cy="90" r="48" fill="none" stroke="rgba(52,211,153,0.45)" strokeWidth="1.5" />
            <circle cx="110" cy="90" r="72" fill="none" stroke="#FACC15" strokeWidth="2" />
            <circle cx="110" cy="90" r="14" fill="#10B981" />
            <text x="110" y="94" textAnchor="middle" fill="#052E16" fontSize="11" fontWeight="800">
              {shells.symbol}
            </text>
            {Array.from({ length: shells.valence }).map((_, idx) => {
              const ang = (idx / shells.valence) * Math.PI * 2 - Math.PI / 2;
              return (
                <circle
                  key={idx}
                  cx={110 + Math.cos(ang) * 72}
                  cy={90 + Math.sin(ang) * 72}
                  r="5"
                  fill="#FACC15"
                />
              );
            })}
          </svg>
        </div>

        <div className="min-[840px]:col-span-5 rounded-2xl bg-[var(--card)] border border-[var(--line)] p-4 flex flex-col justify-between gap-3">
          <div className="flex flex-col gap-2">
            <span className="text-[12.5px] font-bold text-[var(--ink)]">
              Inspect Both Reacting Atoms
            </span>
            <button
              type="button"
              onClick={() => {
                triggerLightHaptic(8);
                setAtomicZ(11);
                if (inspectedHalogen && !completed) onComplete();
              }}
              className={`min-h-[42px] px-3 rounded-xl font-bold text-[13px] text-left cursor-pointer ${
                atomicZ === 11
                  ? 'bg-[var(--gold)] text-[var(--on-acc)]'
                  : 'bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)]'
              }`}
            >
              Z = 11 · Unknown Sample (2, 8, 1)
            </button>
            <button
              type="button"
              onClick={() => {
                triggerLightHaptic(8);
                setAtomicZ(17);
                setInspectedHalogen(true);
                if (!completed) onComplete();
              }}
              className={`min-h-[42px] px-3 rounded-xl font-bold text-[13px] text-left cursor-pointer ${
                atomicZ === 17
                  ? 'bg-[var(--gold)] text-[var(--on-acc)]'
                  : 'bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)]'
              }`}
            >
              Z = 17 · Chlorine Partner (2, 8, 7)
            </button>
          </div>
          <p className="text-[12px] text-[var(--dim)]">
            Notice how 1 outer electron from Z=11 completes the 7-electron outer shell of Z=17!
          </p>
        </div>
      </div>
    );
  }

  if (kind === 'phys_gravity') {
    const escaped = launchVelKmS >= 11.2;
    const inOrbit = launchVelKmS >= 7.9 && launchVelKmS < 11.2;

    return (
      <div className="grid grid-cols-1 min-[840px]:grid-cols-12 gap-4 items-stretch">
        <div className="min-[840px]:col-span-7 rounded-2xl bg-[#090D24] border border-sky-400/30 p-4 flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between text-[12px] font-bold text-sky-100">
            <span>Earth Gravitational Trajectory</span>
            <span className="tabular-nums">
              {escaped
                ? '● ESCAPE ACHIEVED (≥ 11.2 km/s)'
                : inOrbit
                  ? '◐ BOUND ORBIT (7.9–11.1 km/s)'
                  : '▼ SUB-ORBITAL FALLBACK'}
            </span>
          </div>
          <svg viewBox="0 0 280 165" className="w-full max-h-[180px]" role="img" aria-label="Escape velocity orbital arc">
            <circle cx="95" cy="110" r="38" fill="#1D4ED8" stroke="#60A5FA" strokeWidth="2" />
            <text x="95" y="114" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="700">
              EARTH
            </text>
            {escaped ? (
              <path
                d="M 95 72 Q 155 45, 265 18"
                fill="none"
                stroke="#34D399"
                strokeWidth="3.2"
              />
            ) : inOrbit ? (
              <ellipse
                cx="108"
                cy="110"
                rx="64"
                ry="48"
                fill="none"
                stroke="#FACC15"
                strokeWidth="2.5"
                strokeDasharray="5 3"
              />
            ) : (
              <path
                d="M 95 72 Q 135 48, 132 102"
                fill="none"
                stroke="#FB7185"
                strokeWidth="2.8"
              />
            )}
          </svg>
        </div>

        <div className="min-[840px]:col-span-5 rounded-2xl bg-[var(--card)] border border-[var(--line)] p-4 flex flex-col justify-between gap-3">
          <div className="flex flex-col gap-3">
            <label htmlFor="vel-slider" className="text-[13px] font-bold text-[var(--ink)] flex justify-between tabular-nums">
              <span>Launch Velocity (v)</span>
              <span className="text-[var(--gold)]">{launchVelKmS.toFixed(1)} km/s</span>
            </label>
            <input
              id="vel-slider"
              type="range"
              min={4.0}
              max={13.0}
              step={0.2}
              value={launchVelKmS}
              onChange={(e) => {
                const v = Number(e.target.value);
                setLaunchVelKmS(v);
                if (v >= 11.2 && !completed) onComplete();
              }}
              className="w-full accent-[var(--gold)] cursor-pointer"
            />
            <button
              type="button"
              onClick={() => {
                triggerLightHaptic(10);
                setLaunchVelKmS(11.2);
                if (!completed) onComplete();
              }}
              className="btn-tactile paper w-full whitespace-nowrap"
            >
              <span>Lock v_e = √(2gR) = 11.2 km/s</span>
            </button>
          </div>
          <p className="text-[12px] text-[var(--dim)]">
            Notice how 7.9 km/s orbits Earth, while 11.2 km/s breaks free permanently!
          </p>
        </div>
      </div>
    );
  }

  if (kind === 'math_temple') {
    const aligned =
      (rootA === 3 && rootB === 4) || (rootA === 4 && rootB === 3);

    const setRoots = (a: number, b: number) => {
      triggerLightHaptic(8);
      setRootA(a);
      setRootB(b);
      if (((a === 3 && b === 4) || (a === 4 && b === 3)) && !completed) {
        onComplete();
      }
    };

    const xScale = (val: number) => 36 + val * 36;

    return (
      <div className="grid grid-cols-1 min-[840px]:grid-cols-12 gap-4 items-stretch">
        <div className="min-[840px]:col-span-7 rounded-2xl bg-[#1E170C] border border-amber-500/30 p-4 flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between text-[12px] font-bold text-amber-100">
            <span>Seal: x² − 7x + 12 = 0</span>
            <span className="tabular-nums">
              {aligned ? '● BRIDGE LOCKED (x=3, x=4)' : `◐ DIALS AT x=${rootA}, x=${rootB}`}
            </span>
          </div>
          <svg viewBox="0 0 280 155" className="w-full max-h-[175px]" role="img" aria-label="Quadratic temple arch">
            <line x1="24" y1="115" x2="260" y2="115" stroke="#94A3B8" strokeWidth="2" />
            {/* Target Pillars at x=3 and x=4 */}
            <rect x={xScale(3) - 6} y="115" width="12" height="28" fill="#F59E0B" />
            <rect x={xScale(4) - 6} y="115" width="12" height="28" fill="#F59E0B" />
            <path
              d={`M ${xScale(rootA)} 115 Q ${xScale((rootA + rootB) / 2)} 35, ${xScale(rootB)} 115`}
              fill="none"
              stroke={aligned ? '#34D399' : '#FACC15'}
              strokeWidth="3.5"
            />
            <text x={xScale(3)} y="150" textAnchor="middle" fill="#FDE68A" fontSize="10" fontWeight="700">
              x=3
            </text>
            <text x={xScale(4)} y="150" textAnchor="middle" fill="#FDE68A" fontSize="10" fontWeight="700">
              x=4
            </text>
          </svg>
        </div>

        <div className="min-[840px]:col-span-5 rounded-2xl bg-[var(--card)] border border-[var(--line)] p-4 flex flex-col justify-between gap-3">
          <div className="flex flex-col gap-2.5">
            <span className="text-[12.5px] font-bold text-[var(--ink)]">
              Select the Root Pair for (x − 3)(x − 4) = 0
            </span>
            {[
              { label: 'x = 2 and x = 6', a: 2, b: 6 },
              { label: 'x = 3 and x = 4', a: 3, b: 4 },
              { label: 'x = 1 and x = 5', a: 1, b: 5 },
            ].map((pair) => (
              <button
                key={pair.label}
                type="button"
                onClick={() => setRoots(pair.a, pair.b)}
                className={`min-h-[40px] px-3 rounded-xl font-bold text-[13px] text-left cursor-pointer ${
                  rootA === pair.a && rootB === pair.b
                    ? 'bg-[var(--gold)] text-[var(--on-acc)]'
                    : 'bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)]'
                }`}
              >
                {pair.label}
              </button>
            ))}
          </div>
          <p className="text-[12px] text-[var(--dim)]">
            Sum = 3 + 4 = 7; Product = 3 × 4 = 12.
          </p>
        </div>
      </div>
    );
  }

  if (kind === 'eng_concord') {
    const ch = CONCORD_FORGE_CHALLENGES[concordIdx] || CONCORD_FORGE_CHALLENGES[0];
    const verdict = concordPicked ? evaluateConcordSelection(concordIdx, concordPicked) : null;
    const solvedCount = Object.keys(concordSolvedMap).length;

    const handlePickVerb = (choice: string) => {
      triggerLightHaptic(8);
      setConcordPicked(choice);
      const res = evaluateConcordSelection(concordIdx, choice);
      if (res.correct) {
        const nextMap = { ...concordSolvedMap, [ch.id]: true };
        setConcordSolvedMap(nextMap);
        if (Object.keys(nextMap).length >= CONCORD_FORGE_CHALLENGES.length && !completed) {
          onComplete();
        }
      }
    };

    return (
      <div className="grid grid-cols-1 min-[840px]:grid-cols-12 gap-4 items-stretch">
        {/* Left: Visual Sentence Structure & Subject-Verb Arc */}
        <div className="min-[840px]:col-span-7 rounded-2xl bg-[#191130] border border-purple-400/30 p-4 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between gap-2 text-[12px] font-bold text-purple-200">
            <span>{ch.ruleTag}</span>
            <span className="tabular-nums">
              {solvedCount}/{CONCORD_FORGE_CHALLENGES.length} Scrolls Verified
            </span>
          </div>

          <svg
            viewBox="0 0 320 140"
            className="w-full max-h-[160px] select-none"
            role="img"
            aria-label="Sentence subject-verb agreement diagram"
          >
            {/* Governing Subject Node */}
            <rect
              x="14"
              y="56"
              width="96"
              height="44"
              rx="10"
              fill="rgba(168,85,247,0.28)"
              stroke="#C084FC"
              strokeWidth="1.8"
            />
            <text x="62" y="76" textAnchor="middle" fill="#FAF5FF" fontSize="10" fontWeight="700">
              HEAD SUBJECT
            </text>
            <text x="62" y="90" textAnchor="middle" fill="#E9D5FF" fontSize="8.5">
              Governs Verb
            </text>

            {/* Bracketed Distractor Zone */}
            <rect
              x="118"
              y="60"
              width="92"
              height="36"
              rx="8"
              fill="rgba(148,163,184,0.12)"
              stroke="rgba(148,163,184,0.4)"
              strokeDasharray="4 3"
              strokeWidth="1.4"
            />
            <text x="164" y="81" textAnchor="middle" fill="#CBD5E1" fontSize="9">
              [Bracketed Trap]
            </text>

            {/* Target Verb Slot */}
            <rect
              x="218"
              y="56"
              width="88"
              height="44"
              rx="10"
              fill={verdict?.correct ? 'rgba(16,185,129,0.3)' : 'rgba(250,204,21,0.2)'}
              stroke={verdict?.correct ? '#34D399' : '#FACC15'}
              strokeWidth="2"
            />
            <text x="262" y="76" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="800">
              {concordPicked ? `"${concordPicked}"` : '[ ? VERB ]'}
            </text>
            <text x="262" y="90" textAnchor="middle" fill="#FDE68A" fontSize="8.5">
              {verdict?.correct ? '● AGREES' : 'Select Verb'}
            </text>

            {/* Agreement Arc Jumping Over Distractor */}
            <path
              d="M 62 56 Q 162 12, 262 56"
              fill="none"
              stroke={verdict?.correct ? '#34D399' : '#C084FC'}
              strokeWidth="2.4"
            />
            <text x="162" y="24" textAnchor="middle" fill="#E9D5FF" fontSize="9.5" fontWeight="700">
              Direct Concord Link
            </text>
          </svg>

          <div className="rounded-xl bg-white/8 border border-white/15 p-3 text-[13.5px] text-white leading-relaxed">
            <span className="font-bold text-amber-300">{ch.stemBefore}</span>{' '}
            <span className="text-slate-300 italic">{ch.parenthetical}</span>{' '}
            <span className="inline-block px-2 py-0.5 rounded bg-purple-500/30 border border-purple-300/40 font-mono font-bold text-amber-200">
              {concordPicked || '___'}
            </span>{' '}
            <span>{ch.stemAfter}</span>
          </div>
        </div>

        {/* Right: Interactive Concord Controls */}
        <div className="min-[840px]:col-span-5 rounded-2xl bg-[var(--card)] border border-[var(--line)] p-4 flex flex-col justify-between gap-3">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1.5">
              {CONCORD_FORGE_CHALLENGES.map((item, i) => {
                const done = Boolean(concordSolvedMap[item.id]);
                const active = i === concordIdx;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setConcordIdx(i);
                      setConcordPicked(done ? item.correctChoice : null);
                    }}
                    className={`flex-1 min-h-[34px] px-2 rounded-lg text-[11.5px] font-bold cursor-pointer whitespace-nowrap ${
                      active
                        ? 'bg-[var(--gold)] text-[var(--on-acc)]'
                        : done
                          ? 'bg-[var(--acc-soft)] text-[var(--ink)] border border-[var(--acc-line)]'
                          : 'bg-[var(--bg)] text-[var(--dim)] border border-[var(--line)]'
                    }`}
                  >
                    Scroll {i + 1} {done ? '✓' : ''}
                  </button>
                );
              })}
            </div>

            <span className="text-[12.5px] font-bold text-[var(--ink)]">
              Choose the grammatically sound verb:
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              {ch.choices.map((choice) => {
                const picked = concordPicked === choice;
                const isRight = choice === ch.correctChoice;
                return (
                  <button
                    key={choice}
                    type="button"
                    onClick={() => handlePickVerb(choice)}
                    className={`min-h-[44px] px-3 rounded-xl font-mono font-bold text-[15px] border cursor-pointer transition ${
                      picked && isRight
                        ? 'bg-[var(--ok-soft)] border-[var(--ok-line)] text-[var(--green)]'
                        : picked && !isRight
                          ? 'bg-[var(--bad-soft)] border-[var(--bad-line)] text-[var(--coral-ink)]'
                          : 'bg-[var(--bg)] border-[var(--line)] text-[var(--ink)] hover:border-[var(--acc-line)]'
                    }`}
                  >
                    {choice}
                  </button>
                );
              })}
            </div>

            {verdict && (
              <p className="text-[12.5px] text-[var(--dim)] leading-snug">{verdict.explanation}</p>
            )}
          </div>

          {verdict?.correct && concordIdx < CONCORD_FORGE_CHALLENGES.length - 1 ? (
            <button
              type="button"
              onClick={() => {
                const next = concordIdx + 1;
                setConcordIdx(next);
                setConcordPicked(
                  concordSolvedMap[CONCORD_FORGE_CHALLENGES[next].id]
                    ? CONCORD_FORGE_CHALLENGES[next].correctChoice
                    : null
                );
              }}
              className="btn-tactile indigo w-full whitespace-nowrap"
            >
              <span>Next Scroll ({concordIdx + 2}/3)</span>
              <Icon name="go" size={15} />
            </button>
          ) : (
            <div className="text-[12px] font-semibold text-[var(--dim)]">
              {completed
                ? 'All 3 Concord Scrolls authenticated!'
                : 'Authenticate all 3 scrolls above to unlock Stage 3.'}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (kind === 'econ_market') {
    const mkt = computeMarketEquilibriumState(marketPrice);
    // Map Q in [200..800] -> x in [48..252]; P in [200..800] -> y in [134..26]
    const qToX = (q: number) => 48 + ((q - 200) / 600) * 204;
    const pToY = (p: number) => 134 - ((p - 200) / 600) * 108;
    const curY = pToY(mkt.priceNaira);
    const xDemanded = qToX(mkt.quantityDemanded);
    const xSupplied = qToX(mkt.quantitySupplied);

    const handlePriceChange = (rawVal: number) => {
      const st = computeMarketEquilibriumState(rawVal);
      setMarketPrice(st.priceNaira);
      if (st.status !== 'equilibrium') {
        setTestedDisequilibrium(true);
      }
      if (st.status === 'equilibrium' && testedDisequilibrium && !completed) {
        onComplete();
      }
    };

    return (
      <div className="grid grid-cols-1 min-[840px]:grid-cols-12 gap-4 items-stretch">
        {/* Left: Live Supply & Demand Coordinate Plane */}
        <div className="min-[840px]:col-span-7 rounded-2xl bg-[#0D1B2A] border border-sky-500/30 p-4 flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between gap-2 text-[12px] font-bold text-sky-100">
            <span>Supply &amp; Demand Equilibrium Graph</span>
            <span
              className={`tabular-nums ${
                mkt.status === 'equilibrium'
                  ? 'text-emerald-300'
                  : mkt.status === 'shortage'
                    ? 'text-rose-300'
                    : 'text-amber-300'
              }`}
            >
              {mkt.statusLabel}
            </span>
          </div>

          <svg
            viewBox="0 0 290 160"
            className="w-full max-h-[185px] select-none"
            role="img"
            aria-label="Interactive supply and demand market equilibrium curve"
          >
            {/* Axes */}
            <line x1="44" y1="18" x2="44" y2="138" stroke="#64748B" strokeWidth="1.6" />
            <line x1="44" y1="138" x2="266" y2="138" stroke="#64748B" strokeWidth="1.6" />
            <text x="16" y="82" fill="#CBD5E1" fontSize="9.5" fontWeight="700">
              P (₦)
            </text>
            <text x="155" y="154" textAnchor="middle" fill="#CBD5E1" fontSize="9.5" fontWeight="700">
              Quantity (Qd &amp; Qs)
            </text>

            {/* Demand Curve D (downward sloping) & Supply Curve S (upward sloping) */}
            <line x1={qToX(200)} y1={pToY(800)} x2={qToX(800)} y2={pToY(200)} stroke="#38BDF8" strokeWidth="2.8" />
            <text x={qToX(800) + 8} y={pToY(200) + 3} fill="#38BDF8" fontSize="10" fontWeight="800">
              D
            </text>

            <line x1={qToX(200)} y1={pToY(200)} x2={qToX(800)} y2={pToY(800)} stroke="#F59E0B" strokeWidth="2.8" />
            <text x={qToX(800) + 8} y={pToY(800) + 3} fill="#F59E0B" fontSize="10" fontWeight="800">
              S
            </text>

            {/* Horizontal Market Price Line */}
            <line
              x1="44"
              y1={curY}
              x2="260"
              y2={curY}
              stroke={mkt.status === 'equilibrium' ? '#34D399' : '#F8FAFC'}
              strokeDasharray="4 3"
              strokeWidth="1.6"
            />

            {/* Shortage / Surplus Gap Highlight */}
            {mkt.status !== 'equilibrium' && (
              <line
                x1={Math.min(xDemanded, xSupplied)}
                y1={curY}
                x2={Math.max(xDemanded, xSupplied)}
                y2={curY}
                stroke={mkt.status === 'shortage' ? '#FB7185' : '#FACC15'}
                strokeWidth="4"
              />
            )}

            <circle cx={xDemanded} cy={curY} r="5" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx={xSupplied} cy={curY} r="5" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="1.5" />
          </svg>

          <div className="flex items-center justify-between text-[12px] text-slate-200 tabular-nums">
            <span>Price: ₦{mkt.priceNaira}</span>
            <span>Qd: {mkt.quantityDemanded} units</span>
            <span>Qs: {mkt.quantitySupplied} units</span>
          </div>
        </div>

        {/* Right: Market Price Slider & Presets */}
        <div className="min-[840px]:col-span-5 rounded-2xl bg-[var(--card)] border border-[var(--line)] p-4 flex flex-col justify-between gap-3">
          <div className="flex flex-col gap-3">
            <label
              htmlFor="econ-price-slider"
              className="text-[13px] font-bold text-[var(--ink)] flex justify-between tabular-nums"
            >
              <span>Market Price (P)</span>
              <span className="text-[var(--gold)]">₦{mkt.priceNaira}</span>
            </label>
            <input
              id="econ-price-slider"
              type="range"
              min={200}
              max={800}
              step={50}
              value={mkt.priceNaira}
              onChange={(e) => handlePriceChange(Number(e.target.value))}
              className="w-full accent-[var(--gold)] cursor-pointer"
            />
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: '₦300 Ceiling', p: 300 },
                { label: '₦500 P*', p: 500 },
                { label: '₦700 Floor', p: 700 },
              ].map((b) => (
                <button
                  key={b.p}
                  type="button"
                  onClick={() => {
                    triggerLightHaptic(8);
                    handlePriceChange(b.p);
                  }}
                  className={`min-h-[36px] px-2 rounded-xl text-[11.5px] font-bold cursor-pointer whitespace-nowrap ${
                    mkt.priceNaira === b.p
                      ? 'bg-[var(--gold)] text-[var(--on-acc)]'
                      : 'bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)]'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>
          <p className="text-[12px] text-[var(--dim)] leading-snug">
            {completed
              ? 'Market clearing price P* = ₦500 verified (Qd = Qs = 500)!'
              : 'Observe shortage below ₦500 or surplus above ₦500, then lock P* = ₦500.'}
          </p>
        </div>
      </div>
    );
  }

  // Fallback / Universal Two-Zone Concept Signal-Flow Simulator
  const nodes = pathwayNodes || [
    { id: 'c1', label: '1. Inspect Signal', stateNote: 'Identify given variables' },
    { id: 'c2', label: '2. Match Core Law', stateNote: 'Select governing principle' },
    { id: 'c3', label: '3. Filter Trap', stateNote: 'Check units and exceptions' },
    { id: 'c4', label: '4. Lock Readiness', stateNote: 'Ready for decision stage' },
  ];
  const activeNode = nodes[pathIdx] || nodes[0];

  return (
    <div className="grid grid-cols-1 min-[840px]:grid-cols-12 gap-4 items-stretch">
      {/* Left: Interactive 4-Node Signal Flow Canvas */}
      <div className="min-[840px]:col-span-7 rounded-2xl bg-[#111827] border border-indigo-400/30 p-4 flex flex-col justify-between gap-3">
        <div className="flex items-center justify-between text-[12px] font-bold text-indigo-200 tabular-nums">
          <span>Interactive Reasoning Signal Flow</span>
          <span>
            ● STAGE {pathIdx + 1} OF {nodes.length}
          </span>
        </div>
        <svg
          viewBox="0 0 320 110"
          className="w-full max-h-[130px] select-none"
          role="img"
          aria-label="Four-stage concept verification pipeline"
        >
          {nodes.slice(0, 4).map((nd, idx) => {
            const cx = 44 + idx * 77;
            const reached = idx <= pathIdx;
            const current = idx === pathIdx;
            return (
              <g key={nd.id}>
                {idx < Math.min(3, nodes.length - 1) && (
                  <line
                    x1={cx + 22}
                    y1="55"
                    x2={cx + 55}
                    y2="55"
                    stroke={idx < pathIdx ? '#34D399' : '#475569'}
                    strokeWidth="3"
                  />
                )}
                <circle
                  cx={cx}
                  cy="55"
                  r="22"
                  fill={current ? '#6366F1' : reached ? '#059669' : '#1E293B'}
                  stroke={current ? '#FACC15' : reached ? '#34D399' : '#475569'}
                  strokeWidth="2.5"
                />
                <text x={cx} y="59" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="800">
                  0{idx + 1}
                </text>
              </g>
            );
          })}
        </svg>
        <div className="rounded-xl bg-white/8 border border-white/15 p-3 text-[13px] text-slate-100">
          <div className="font-bold text-amber-300">{activeNode.label}</div>
          <p className="text-slate-200 mt-0.5 leading-snug">{activeNode.stateNote}</p>
        </div>
      </div>

      {/* Right: Step Controller */}
      <div className="min-[840px]:col-span-5 rounded-2xl bg-[var(--card)] border border-[var(--line)] p-4 flex flex-col justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          {nodes.map((n, idx) => {
            const reached = idx <= pathIdx;
            const current = idx === pathIdx;
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => {
                  triggerLightHaptic(8);
                  setPathIdx(idx);
                  if (idx >= nodes.length - 1 && !completed) onComplete();
                }}
                className={`min-h-[38px] px-3 py-1.5 rounded-xl text-left text-[12.5px] font-bold flex items-center justify-between gap-2 transition cursor-pointer ${
                  current
                    ? 'bg-[var(--gold)] text-[var(--on-acc)]'
                    : reached
                      ? 'bg-[var(--acc-soft)] text-[var(--ink)] border border-[var(--acc-line)]'
                      : 'bg-[var(--bg)] border border-[var(--line)] text-[var(--dim)] hover:text-[var(--ink)]'
                }`}
              >
                <span className="truncate">{n.label}</span>
                {reached && <Icon name="check" size={14} className="shrink-0" />}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          disabled={pathIdx >= nodes.length - 1 && completed}
          onClick={() => {
            triggerLightHaptic(8);
            const next = Math.min(nodes.length - 1, pathIdx + 1);
            setPathIdx(next);
            if (next >= nodes.length - 1 && !completed) onComplete();
          }}
          className="btn-tactile indigo w-full whitespace-nowrap disabled:opacity-55"
        >
          <span>
            {completed
              ? 'All Checkpoints Verified'
              : `Inspect Checkpoint (${pathIdx + 1}/${nodes.length})`}
          </span>
          <Icon name={completed ? 'check' : 'go'} size={15} />
        </button>
      </div>
    </div>
  );
}
