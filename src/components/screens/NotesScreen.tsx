import React, { useEffect, useMemo, useState } from 'react';
import type {
  ExploreBeat,
  IdeaBeat,
  InteractiveLesson,
  SubjectId,
  TeachBeat,
  TeachBlock,
  Topic,
} from '../../types';
import { CHEM_NERDC_MAP } from '../../data/chemNerdc2027';
import { MATH_NERDC_MAP } from '../../data/mathNerdc2027';
import { FMATH_NERDC_MAP } from '../../data/fmathNerdc2027';
import { PHYS_NERDC_MAP } from '../../data/physNerdc2027';
import { BIO_NERDC_MAP } from '../../data/bioNerdc2027';
import { AGRIC_NERDC_MAP } from '../../data/agricNerdc2027';
import { GEOG_NERDC_MAP } from '../../data/geogNerdc2027';
import { ECON_NERDC_MAP } from '../../data/econNerdc2027';
import { ENG_NERDC_MAP } from '../../data/engNerdc2027';
import { CIVIC_NERDC_MAP } from '../../data/civicNerdc2027';
import { DIGITECH_NERDC_MAP } from '../../data/digitechNerdc2027';
import { DATAPROC_NERDC_MAP } from '../../data/dataprocNerdc2027';
import { perm } from '../../utils/engine';
import {
  extractNotePartSpeechScript,
  extractRereadSheetSpeechScript,
} from '../../utils/chemVoiceLogic';
import { splitRuleEquation, typesetMathHtml } from '../../utils/mathTypesetter';
import { SubscreenTopBar } from '../AppShell';
import { ChemMadScientistBar } from '../ChemMadScientistBar';
import { ChemNoteVisual } from '../ChemNoteVisuals';
import { MathNoteVisual } from '../MathNoteVisuals';
import { PhysNoteVisual } from '../PhysNoteVisuals';
import { AgricNoteVisuals } from '../AgricNoteVisuals';
import { EngNoteVisual } from '../EngNoteVisuals';
import { CivicNoteVisual } from '../CivicNoteVisuals';
import { ExplorerCanvas, initExplorerState } from '../Explorers';
import { DiagramFigure, Icon } from '../Icons';
import { SlidingTabs, SmoothProgressBar } from '../ULessonMotion';

function RuleItemRenderer({ html, subj }: { html: string; subj: SubjectId }) {
  const split = splitRuleEquation(html, subj);
  if (split.hasEquation) {
    return (
      <li className="flex flex-col gap-1.5">
        {split.leadHtml && (
          <span
            className="font-semibold text-[var(--ink)]"
            dangerouslySetInnerHTML={{ __html: split.leadHtml }}
          />
        )}
        <div
          className="math-eq-plate"
          dangerouslySetInnerHTML={{ __html: split.eqHtml }}
        />
        {split.tailHtml && (
          <span
            className="text-[14px] text-[var(--dim)]"
            dangerouslySetInnerHTML={{ __html: split.tailHtml }}
          />
        )}
      </li>
    );
  }
  return <li dangerouslySetInnerHTML={{ __html: split.leadHtml }} />;
}

function NoteTeachBlock({ block, subj }: { block: TeachBlock; subj: SubjectId }) {
  switch (block[0]) {
    case 'p':
      return (
        <p
          className="text-[15.5px] leading-relaxed text-[var(--ink)]"
          dangerouslySetInnerHTML={{ __html: typesetMathHtml(block[1], subj) }}
        />
      );
    case 'h':
      return (
        <h4
          className="font-[var(--display)] font-bold text-[17px] text-[var(--ink)] pt-1"
          dangerouslySetInnerHTML={{ __html: typesetMathHtml(block[1], subj) }}
        />
      );
    case 'eg':
      return (
        <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-3.5 flex flex-col gap-1">
          <span className="text-[12px] font-bold text-[var(--gold)]">
            {block[1]}
          </span>
          <p
            className="text-[14.5px] leading-relaxed text-[var(--ink)]"
            dangerouslySetInnerHTML={{ __html: typesetMathHtml(block[2], subj) }}
          />
        </div>
      );
    case 'wn':
      return (
        <div className="rounded-xl bg-[var(--bad-soft)] border border-[var(--bad-line)] p-3.5 flex flex-col gap-1">
          <span className="text-[12px] font-bold text-[var(--coral-ink)]">
            Trap
          </span>
          <p
            className="text-[14.5px] leading-relaxed text-[var(--ink)]"
            dangerouslySetInnerHTML={{ __html: typesetMathHtml(block[1], subj) }}
          />
        </div>
      );
    case 'key':
      return (
        <div className="rounded-xl bg-[var(--acc-soft)] border border-[var(--acc-line)] p-3.5 flex flex-col gap-1">
          <span className="text-[12px] font-bold text-[var(--gold)]">
            Key Takeaway
          </span>
          <p
            className="text-[14.5px] leading-relaxed text-[var(--ink)] font-medium"
            dangerouslySetInnerHTML={{ __html: typesetMathHtml(block[1], subj) }}
          />
        </div>
      );
    case 'fig':
      return <DiagramFigure g={block[1]} cap={block[2]} />;
    case 'li':
      return (
        <ul className="rules">
          {block[1].map((item, idx) => (
            <RuleItemRenderer key={idx} html={item} subj={subj} />
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol className="list-decimal pl-5 space-y-1.5 text-[15px] text-[var(--ink)]">
          {block[1].map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: typesetMathHtml(item, subj) }} />
          ))}
        </ol>
      );
    case 'tb':
      return (
        <div className="tw overflow-x-auto">
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

function EmbeddedNoteExplorer({ beat }: { beat: ExploreBeat }) {
  const [xpState, setXpState] = useState(() => initExplorerState(beat.xp, beat.cfg));

  useEffect(() => {
    setXpState(initExplorerState(beat.xp, beat.cfg));
  }, [beat.xp, beat.cfg]);

  return (
    <div className="rtc-eq-plate rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-[11.5px] font-bold text-emerald-300">
            Live Interactive Simulation
          </span>
          <h4 className="font-[var(--display)] font-bold text-[17px] text-white">
            {beat.title || 'Explore the Concept Live'}
          </h4>
        </div>
        <button
          type="button"
          onClick={() => setXpState(initExplorerState(beat.xp, beat.cfg))}
          className="min-h-[34px] px-3 rounded-lg bg-white/10 hover:bg-white/15 text-white text-[12.5px] font-bold cursor-pointer whitespace-nowrap shrink-0"
        >
          Reset simulation
        </button>
      </div>
      <p
        className="text-[14px] text-[#CBE4D7] leading-relaxed"
        dangerouslySetInnerHTML={{ __html: beat.intro }}
      />
      <ExplorerCanvas
        kind={beat.xp}
        cfg={beat.cfg}
        state={xpState}
        onChange={setXpState}
      />
    </div>
  );
}

function BioNoteVisual({ topicId }: { topicId: string; partIdx?: number }) {
  const isGenetics = /gene|mendel|hered|evol|div|reprod/i.test(topicId);
  const isEcology = /ecol|biome|pop|pollut|soil|nutrient|energy/i.test(topicId);

  return (
    <figure className="rounded-2xl bg-[#11261D] border border-[#254A3A] p-4 flex flex-col gap-2.5 overflow-hidden">
      <div className="flex items-center justify-between gap-2 text-[11.5px] font-bold text-[#9ED6B5]">
        <span>
          {isGenetics
            ? 'Chromosomal Segregation & Mendelian 3 : 1 Punnett Plate'
            : isEcology
              ? 'Trophic 10% Energy Pyramid & Carbon-Nitrogen Cycling Plate'
              : 'Eukaryotic Organelles & Osmotic Water-Potential (Ψ) Plate'}
        </span>
        <span className="text-[#FFD84D]">Conceptual Diagram Guide</span>
      </div>
      <svg
        viewBox="0 0 640 190"
        className="w-full h-auto rounded-xl bg-[#0D1F17]"
        role="img"
        aria-label="Biology study diagram plate"
      >
        {/* Subtle biological reticle grid */}
        <g stroke="#1E3F30" strokeWidth="1">
          <line x1="215" y1="16" x2="215" y2="174" strokeDasharray="4 4" />
          <line x1="430" y1="16" x2="430" y2="174" strokeDasharray="4 4" />
        </g>

        {/* Panel 1: Labelled Eukaryotic Cell */}
        <g transform="translate(18, 18)">
          <rect x="0" y="0" width="180" height="154" rx="14" fill="#132C21" stroke="#2D5D47" strokeWidth="1.5" />
          <text x="12" y="20" fill="#9ED6B5" fontSize="10.5" fontWeight="700">1. Eukaryotic Cell</text>
          <rect x="24" y="34" width="110" height="96" rx="22" fill="#1A3E2F" stroke="#3BDC86" strokeWidth="2.2" />
          <rect x="31" y="41" width="96" height="82" rx="17" fill="#153326" stroke="#8CE8B5" strokeWidth="1" strokeDasharray="3 2" />
          {/* Sap vacuole */}
          <rect x="66" y="54" width="48" height="54" rx="12" fill="#21523E" stroke="#63D297" strokeWidth="1.2" />
          {/* Nucleus */}
          <circle cx="48" cy="66" r="13" fill="#2B4C7E" stroke="#93C5FD" strokeWidth="1.6" />
          <circle cx="48" cy="66" r="4.5" fill="#DBEAFE" />
          {/* Chloroplasts / Mitochondria */}
          <ellipse cx="48" cy="102" rx="10" ry="5.5" fill="#22C55E" />
          <ellipse cx="90" cy="115" rx="9" ry="4.5" fill="#F59E0B" />
          <text x="22" y="145" fill="#E2F2EA" fontSize="9.5" fontWeight="600">Nucleus · Vacuole · Plastid</text>
        </g>

        {/* Panel 2: Osmosis & Water Potential Ψ */}
        <g transform="translate(230, 18)">
          <rect x="0" y="0" width="184" height="154" rx="14" fill="#132C21" stroke="#2D5D47" strokeWidth="1.5" />
          <text x="12" y="20" fill="#9ED6B5" fontSize="10.5" fontWeight="700">2. Osmotic Flow (Ψ)</text>
          <rect x="20" y="38" width="144" height="82" rx="10" fill="#0F241B" stroke="#356B52" strokeWidth="1.4" />
          <line x1="92" y1="38" x2="92" y2="120" stroke="#FFD84D" strokeWidth="2" strokeDasharray="4 3" />
          <text x="30" y="58" fill="#93C5FD" fontSize="9.5" fontWeight="700">Hypotonic</text>
          <text x="30" y="72" fill="#CBE4D7" fontSize="9">High Ψ (−100)</text>
          <text x="102" y="58" fill="#FCA5A5" fontSize="9.5" fontWeight="700">Hypertonic</text>
          <text x="102" y="72" fill="#CBE4D7" fontSize="9">Low Ψ (−600)</text>
          {/* Net H2O arrow */}
          <path d="M 46 98 L 132 98" stroke="#3BDC86" strokeWidth="3" strokeLinecap="round" />
          <polygon points="138,98 128,92 128,104" fill="#3BDC86" />
          <text x="20" y="145" fill="#E2F2EA" fontSize="9.5" fontWeight="600">Net H₂O across semi-perm. membrane</text>
        </g>

        {/* Panel 3: Mendelian 3:1 Monohybrid Ratio */}
        <g transform="translate(444, 18)">
          <rect x="0" y="0" width="178" height="154" rx="14" fill="#132C21" stroke="#2D5D47" strokeWidth="1.5" />
          <text x="12" y="20" fill="#9ED6B5" fontSize="10.5" fontWeight="700">3. Mendel F₂ (3 : 1)</text>
          <g transform="translate(38, 34)">
            <rect x="0" y="0" width="104" height="84" rx="8" fill="#0F241B" stroke="#3BDC86" strokeWidth="1.5" />
            <line x1="52" y1="0" x2="52" y2="84" stroke="#2D5D47" strokeWidth="1.2" />
            <line x1="0" y1="42" x2="104" y2="42" stroke="#2D5D47" strokeWidth="1.2" />
            <text x="17" y="27" fill="#3BDC86" fontSize="13" fontWeight="800">TT</text>
            <text x="68" y="27" fill="#3BDC86" fontSize="13" fontWeight="800">Tt</text>
            <text x="18" y="68" fill="#3BDC86" fontSize="13" fontWeight="800">Tt</text>
            <text x="69" y="68" fill="#FFD84D" fontSize="13" fontWeight="800">tt</text>
          </g>
          <text x="20" y="145" fill="#E2F2EA" fontSize="9.5" fontWeight="600">Genotype 1:2:1 · Phenotype 3:1</text>
        </g>
      </svg>
    </figure>
  );
}

function EconNoteVisual({ topicId }: { topicId: string; partIdx?: number }) {
  const isMacro = /money|inf|public|nat-income|intl|bop|fx|integration|growth|petrol|global/i.test(topicId);
  const isQuant = /stats|elasticity|prod-func|costs|markets|utility/i.test(topicId);

  return (
    <figure className="rounded-2xl bg-[#11261D] border border-[#254A3A] p-4 flex flex-col gap-2.5 overflow-hidden">
      <div className="flex items-center justify-between gap-2 text-[11.5px] font-bold text-[#9ED6B5]">
        <span>
          {isMacro
            ? 'AD–AS Macroeconomic Equilibrium, PPC Frontier & Policy Curves'
            : isQuant
              ? 'Market Equilibrium (P*, Q*), Elasticity Slope & Short-Run MC–ATC Plate'
              : 'Market Equilibrium (D & S), Opportunity-Cost PPC & Cost-Curve Plate'}
        </span>
        <span className="text-[#FFD84D]">Conceptual Diagram Guide</span>
      </div>
      <svg
        viewBox="0 0 640 190"
        className="w-full h-auto rounded-xl bg-[#0D1F17]"
        role="img"
        aria-label="Economics study diagram plate"
      >
        <g stroke="#1E3F30" strokeWidth="1">
          <line x1="215" y1="16" x2="215" y2="174" strokeDasharray="4 4" />
          <line x1="430" y1="16" x2="430" y2="174" strokeDasharray="4 4" />
        </g>

        {/* Panel 1: Market Supply & Demand Equilibrium */}
        <g transform="translate(18, 18)">
          <rect x="0" y="0" width="180" height="154" rx="14" fill="#132C21" stroke="#2D5D47" strokeWidth="1.5" />
          <text x="12" y="20" fill="#9ED6B5" fontSize="10.5" fontWeight="700">1. Market Equilibrium</text>
          <line x1="26" y1="32" x2="26" y2="124" stroke="#CBE4D7" strokeWidth="1.6" />
          <line x1="26" y1="124" x2="156" y2="124" stroke="#CBE4D7" strokeWidth="1.6" />
          {/* Demand D */}
          <path d="M 38 42 L 146 114" stroke="#93C5FD" strokeWidth="2.4" strokeLinecap="round" />
          <text x="148" y="116" fill="#93C5FD" fontSize="10" fontWeight="800">D</text>
          {/* Supply S */}
          <path d="M 38 114 L 146 42" stroke="#3BDC86" strokeWidth="2.4" strokeLinecap="round" />
          <text x="148" y="45" fill="#3BDC86" fontSize="10" fontWeight="800">S</text>
          {/* Equilibrium E* */}
          <line x1="26" y1="78" x2="92" y2="78" stroke="#FFD84D" strokeWidth="1.3" strokeDasharray="3 3" />
          <line x1="92" y1="78" x2="92" y2="124" stroke="#FFD84D" strokeWidth="1.3" strokeDasharray="3 3" />
          <circle cx="92" cy="78" r="4.2" fill="#FFD84D" />
          <text x="12" y="81" fill="#FFD84D" fontSize="9.5" fontWeight="700">P*</text>
          <text x="86" y="135" fill="#FFD84D" fontSize="9.5" fontWeight="700">Q*</text>
          <text x="20" y="147" fill="#E2F2EA" fontSize="9" fontWeight="600">Qd = Qs clears surplus/shortage</text>
        </g>

        {/* Panel 2: Concave PPC & Opportunity Cost */}
        <g transform="translate(230, 18)">
          <rect x="0" y="0" width="184" height="154" rx="14" fill="#132C21" stroke="#2D5D47" strokeWidth="1.5" />
          <text x="12" y="20" fill="#9ED6B5" fontSize="10.5" fontWeight="700">2. Concave PPC Frontier</text>
          <line x1="28" y1="32" x2="28" y2="124" stroke="#CBE4D7" strokeWidth="1.6" />
          <line x1="28" y1="124" x2="158" y2="124" stroke="#CBE4D7" strokeWidth="1.6" />
          <path d="M 28 40 Q 124 44 146 124" fill="none" stroke="#3BDC86" strokeWidth="2.5" strokeLinecap="round" />
          {/* Efficient on curve, unemployed inside, unattainable outside */}
          <circle cx="95" cy="63" r="4" fill="#FFD84D" />
          <text x="103" y="65" fill="#FFD84D" fontSize="9" fontWeight="700">A (Efficient)</text>
          <circle cx="62" cy="96" r="3.6" fill="#FCA5A5" />
          <text x="70" y="99" fill="#FCA5A5" fontSize="8.8" fontWeight="700">U (Idle)</text>
          <circle cx="136" cy="44" r="3.6" fill="#93C5FD" />
          <text x="112" y="37" fill="#93C5FD" fontSize="8.8" fontWeight="700">X (Beyond)</text>
          <text x="18" y="147" fill="#E2F2EA" fontSize="9" fontWeight="600">Bowed out: rising opp. cost</text>
        </g>

        {/* Panel 3: Short-Run MC & ATC Cost Curves */}
        <g transform="translate(444, 18)">
          <rect x="0" y="0" width="178" height="154" rx="14" fill="#132C21" stroke="#2D5D47" strokeWidth="1.5" />
          <text x="12" y="20" fill="#9ED6B5" fontSize="10.5" fontWeight="700">3. MC Cuts Min ATC</text>
          <line x1="26" y1="32" x2="26" y2="124" stroke="#CBE4D7" strokeWidth="1.6" />
          <line x1="26" y1="124" x2="156" y2="124" stroke="#CBE4D7" strokeWidth="1.6" />
          {/* U-shaped ATC */}
          <path d="M 36 52 Q 92 120 150 62" fill="none" stroke="#93C5FD" strokeWidth="2.2" strokeLinecap="round" />
          <text x="140" y="57" fill="#93C5FD" fontSize="9.5" fontWeight="800">ATC</text>
          {/* J-shaped MC cutting ATC at minimum (94, 88) */}
          <path d="M 42 104 Q 76 112 94 88 T 136 38" fill="none" stroke="#FFD84D" strokeWidth="2.4" strokeLinecap="round" />
          <text x="138" y="42" fill="#FFD84D" fontSize="9.5" fontWeight="800">MC</text>
          <circle cx="94" cy="88" r="4" fill="#3BDC86" />
          <text x="18" y="147" fill="#E2F2EA" fontSize="9" fontWeight="600">Profit max: MR = MC · Min ATC</text>
        </g>
      </svg>
    </figure>
  );
}

function FMathNoteVisual({ topicId }: { topicId: string; partIdx?: number }) {
  const isCalc = /lim|diff|int|ode|maclaurin|curve/i.test(topicId);
  const isVecMech = /vec|mat|conic|stat|dyn|proj|work|imp/i.test(topicId);

  return (
    <figure className="rounded-2xl bg-[#11261D] border border-[#254A3A] p-4 flex flex-col gap-2.5 overflow-hidden">
      <div className="flex items-center justify-between gap-2 text-[11.5px] font-bold text-[#9ED6B5]">
        <span>
          {isCalc
            ? 'Calculus Gradient dy/dx, Definite Integral Area & Stationary Point Plate'
            : isVecMech
              ? '3D Vector Resolution (a · b), Connected Pulley Tension & Conic Locus Plate'
              : 'Calculus Area ∫ f(x) dx, Vector Dot Product & Normal Z-Distribution Plate'}
        </span>
        <span className="text-[#FFD84D]">Conceptual Diagram Guide</span>
      </div>
      <svg
        viewBox="0 0 640 190"
        className="w-full h-auto rounded-xl bg-[#0D1F17]"
        role="img"
        aria-label="Further Mathematics study diagram plate"
      >
        <g stroke="#1E3F30" strokeWidth="1">
          <line x1="215" y1="16" x2="215" y2="174" strokeDasharray="4 4" />
          <line x1="430" y1="16" x2="430" y2="174" strokeDasharray="4 4" />
        </g>

        {/* Panel 1: Calculus Tangent & Definite Integral Area */}
        <g transform="translate(18, 18)">
          <rect x="0" y="0" width="180" height="154" rx="14" fill="#132C21" stroke="#2D5D47" strokeWidth="1.5" />
          <text x="12" y="20" fill="#9ED6B5" fontSize="10.5" fontWeight="700">1. Calculus: dy/dx &amp; ∫ f(x) dx</text>
          <line x1="24" y1="32" x2="24" y2="124" stroke="#CBE4D7" strokeWidth="1.6" />
          <line x1="24" y1="124" x2="158" y2="124" stroke="#CBE4D7" strokeWidth="1.6" />
          {/* Shaded definite integral area from a to b */}
          <path
            d="M 54 124 L 54 88 Q 92 44 132 68 L 132 124 Z"
            fill="#3BDC86"
            fillOpacity="0.22"
            stroke="#3BDC86"
            strokeWidth="1.2"
          />
          {/* Smooth polynomial curve */}
          <path d="M 32 112 Q 86 30 152 78" fill="none" stroke="#3BDC86" strokeWidth="2.5" strokeLinecap="round" />
          {/* Tangent line at stationary/inflection point */}
          <line x1="56" y1="74" x2="128" y2="48" stroke="#FFD84D" strokeWidth="2" strokeDasharray="4 2" />
          <circle cx="92" cy="61" r="4" fill="#FFD84D" />
          <text x="50" y="135" fill="#9ED6B5" fontSize="9" fontWeight="700">a</text>
          <text x="129" y="135" fill="#9ED6B5" fontSize="9" fontWeight="700">b</text>
          <text x="16" y="147" fill="#E2F2EA" fontSize="9" fontWeight="600">F(b) − F(a) · Stationary dy/dx = 0</text>
        </g>

        {/* Panel 2: Vector Dot Product & Mechanics Pulley */}
        <g transform="translate(230, 18)">
          <rect x="0" y="0" width="184" height="154" rx="14" fill="#132C21" stroke="#2D5D47" strokeWidth="1.5" />
          <text x="12" y="20" fill="#9ED6B5" fontSize="10.5" fontWeight="700">2. Vectors &amp; Mechanics</text>
          {/* Vector angle theta */}
          <line x1="28" y1="112" x2="108" y2="112" stroke="#93C5FD" strokeWidth="2.5" strokeLinecap="round" />
          <polygon points="112,112 103,107 103,117" fill="#93C5FD" />
          <line x1="28" y1="112" x2="86" y2="52" stroke="#FFD84D" strokeWidth="2.5" strokeLinecap="round" />
          <polygon points="90,48 80,52 87,59" fill="#FFD84D" />
          <path d="M 52 112 A 24 24 0 0 0 45 95" fill="none" stroke="#3BDC86" strokeWidth="1.8" />
          <text x="56" y="103" fill="#3BDC86" fontSize="9.5" fontWeight="800">θ</text>
          <text x="92" y="54" fill="#FFD84D" fontSize="9.5" fontWeight="800">b</text>
          <text x="114" y="115" fill="#93C5FD" fontSize="9.5" fontWeight="800">a</text>
          {/* Smooth pulley mini-sketch */}
          <circle cx="146" cy="54" r="12" fill="#0F241B" stroke="#CBE4D7" strokeWidth="1.8" />
          <line x1="134" y1="54" x2="134" y2="96" stroke="#CBE4D7" strokeWidth="1.5" />
          <line x1="158" y1="54" x2="158" y2="106" stroke="#CBE4D7" strokeWidth="1.5" />
          <rect x="127" y="96" width="14" height="14" rx="3" fill="#3BDC86" />
          <rect x="151" y="106" width="14" height="16" rx="3" fill="#FCA5A5" />
          <text x="16" y="147" fill="#E2F2EA" fontSize="9" fontWeight="600">a·b = |a||b|cos θ · T − mg = ma</text>
        </g>

        {/* Panel 3: Standard Normal Z Curve & Binomial */}
        <g transform="translate(444, 18)">
          <rect x="0" y="0" width="178" height="154" rx="14" fill="#132C21" stroke="#2D5D47" strokeWidth="1.5" />
          <text x="12" y="20" fill="#9ED6B5" fontSize="10.5" fontWeight="700">3. Normal Z &amp; Binomial</text>
          <line x1="18" y1="118" x2="160" y2="118" stroke="#CBE4D7" strokeWidth="1.5" />
          {/* Shaded tail Z <= z */}
          <path
            d="M 24 118 Q 58 114 74 68 Q 84 42 89 42 L 116 74 L 116 118 Z"
            fill="#93C5FD"
            fillOpacity="0.24"
          />
          {/* Bell curve */}
          <path
            d="M 20 117 C 48 116, 68 42, 89 42 C 110 42, 130 116, 158 117"
            fill="none"
            stroke="#93C5FD"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <line x1="89" y1="42" x2="89" y2="118" stroke="#FFD84D" strokeWidth="1.4" strokeDasharray="3 3" />
          <line x1="116" y1="74" x2="116" y2="118" stroke="#3BDC86" strokeWidth="1.6" />
          <text x="84" y="130" fill="#FFD84D" fontSize="9" fontWeight="700">μ</text>
          <text x="112" y="130" fill="#3BDC86" fontSize="9" fontWeight="700">z</text>
          <text x="14" y="147" fill="#E2F2EA" fontSize="9" fontWeight="600">Z = (X − μ)/σ · nCr p^r q^(n−r)</text>
        </g>
      </svg>
    </figure>
  );
}

function GeogNoteVisual({ topicId }: { topicId: string; partIdx?: number }) {
  const isMap = /scale|contour|grad|gis|survey|stat-diag|solar|earth/i.test(topicId);
  const isNig = /nig|ecowas|pop|settle|trans|indus|agric/i.test(topicId);

  return (
    <figure className="rounded-2xl bg-[#11261D] border border-[#254A3A] p-4 flex flex-col gap-2.5 overflow-hidden">
      <div className="flex items-center justify-between gap-2 text-[11.5px] font-bold text-[#9ED6B5]">
        <span>
          {isMap
            ? 'Topographic Contours (VI / HE), Longitude Time (15° = 1 hr) & Relief Plate'
            : isNig
              ? 'Nigeria N–S Vegetation Profile, ITD Air-Mass Shift & Topographic Plate'
              : 'Topographic Gradient (VI / HE), ITD Air Masses & Nigeria Relief Belts'}
        </span>
        <span className="text-[#FFD84D]">Conceptual Diagram Guide</span>
      </div>
      <svg
        viewBox="0 0 640 190"
        className="w-full h-auto rounded-xl bg-[#0D1F17]"
        role="img"
        aria-label="Geography study diagram plate"
      >
        <g stroke="#1E3F30" strokeWidth="1">
          <line x1="215" y1="16" x2="215" y2="174" strokeDasharray="4 4" />
          <line x1="430" y1="16" x2="430" y2="174" strokeDasharray="4 4" />
        </g>

        {/* Panel 1: Topographic Contours & Gradient VI / HE */}
        <g transform="translate(18, 18)">
          <rect x="0" y="0" width="180" height="154" rx="14" fill="#132C21" stroke="#2D5D47" strokeWidth="1.5" />
          <text x="12" y="20" fill="#9ED6B5" fontSize="10.5" fontWeight="700">1. Contours &amp; Gradient</text>
          <ellipse cx="90" cy="80" rx="64" ry="40" fill="none" stroke="#3BDC86" strokeWidth="1.6" />
          <ellipse cx="92" cy="79" rx="44" ry="26" fill="none" stroke="#63D297" strokeWidth="1.6" />
          <ellipse cx="94" cy="78" rx="22" ry="13" fill="#1E4635" stroke="#FFD84D" strokeWidth="1.8" />
          <circle cx="95" cy="78" r="3" fill="#FFD84D" />
          <text x="101" y="81" fill="#FFD84D" fontSize="8.5" fontWeight="800">450m</text>
          <text x="32" y="52" fill="#9ED6B5" fontSize="8.5" fontWeight="700">100m</text>
          <line x1="34" y1="96" x2="95" y2="78" stroke="#93C5FD" strokeWidth="2" strokeDasharray="3 2" />
          <text x="16" y="145" fill="#E2F2EA" fontSize="9" fontWeight="600">Grad = VI / HE · Close = Steep</text>
        </g>

        {/* Panel 2: Longitude Time (15 deg = 1 hr) & ITD Air Masses */}
        <g transform="translate(230, 18)">
          <rect x="0" y="0" width="184" height="154" rx="14" fill="#132C21" stroke="#2D5D47" strokeWidth="1.5" />
          <text x="12" y="20" fill="#9ED6B5" fontSize="10.5" fontWeight="700">2. Earth Grid &amp; ITD Winds</text>
          <circle cx="92" cy="78" r="42" fill="#0F241B" stroke="#63D297" strokeWidth="1.8" />
          {/* Equator & Prime Meridian */}
          <line x1="50" y1="78" x2="134" y2="78" stroke="#FFD84D" strokeWidth="1.6" />
          <ellipse cx="92" cy="78" rx="18" ry="42" fill="none" stroke="#9ED6B5" strokeWidth="1.2" strokeDasharray="3 2" />
          {/* NE Trade Harmattan vs SW Monsoon meeting at ITD */}
          <path d="M 118 46 L 98 66" stroke="#FCA5A5" strokeWidth="2.2" strokeLinecap="round" />
          <polygon points="95,69 98,60 104,66" fill="#FCA5A5" />
          <path d="M 66 110 L 86 90" stroke="#93C5FD" strokeWidth="2.2" strokeLinecap="round" />
          <polygon points="89,87 80,90 86,96" fill="#93C5FD" />
          <text x="122" y="46" fill="#FCA5A5" fontSize="8.5" fontWeight="700">cT (NE)</text>
          <text x="20" y="114" fill="#93C5FD" fontSize="8.5" fontWeight="700">mT (SW)</text>
          <text x="16" y="145" fill="#E2F2EA" fontSize="9" fontWeight="600">15° = 1 hr (East +) · ITD Zone</text>
        </g>

        {/* Panel 3: Nigeria South-to-North Vegetation & Relief Profile */}
        <g transform="translate(444, 18)">
          <rect x="0" y="0" width="178" height="154" rx="14" fill="#132C21" stroke="#2D5D47" strokeWidth="1.5" />
          <text x="12" y="20" fill="#9ED6B5" fontSize="10.5" fontWeight="700">3. Nigeria S → N Belts</text>
          {/* Cross-section relief from Coast (S) through Jos Plateau to Sahel (N) */}
          <path
            d="M 18 118 L 48 114 L 78 96 L 106 58 L 128 84 L 160 88 L 160 124 L 18 124 Z"
            fill="#1D4634"
            stroke="#3BDC86"
            strokeWidth="2"
          />
          {/* Belt markers */}
          <circle cx="32" cy="115" r="3.5" fill="#93C5FD" />
          <circle cx="66" cy="102" r="3.5" fill="#3BDC86" />
          <circle cx="106" cy="58" r="4" fill="#FFD84D" />
          <circle cx="148" cy="86" r="3.5" fill="#FCA5A5" />
          <text x="18" y="106" fill="#93C5FD" fontSize="8.2" fontWeight="700">Coast</text>
          <text x="52" y="92" fill="#3BDC86" fontSize="8.2" fontWeight="700">Forest</text>
          <text x="95" y="49" fill="#FFD84D" fontSize="8.5" fontWeight="800">Jos</text>
          <text x="134" y="77" fill="#FCA5A5" fontSize="8.2" fontWeight="700">Sahel</text>
          <text x="14" y="145" fill="#E2F2EA" fontSize="9" fontWeight="600">Mangrove → Forest → Savanna</text>
        </g>
      </svg>
    </figure>
  );
}

function DigiTechNoteVisual({ topicId }: { topicId: string; partIdx?: number }) {
  const isNetCyber = /net|osi|ip|cloud|cyber|sec|crypt|ai|ethics/i.test(topicId);
  const isSoft = /alg|prog|code|web|sd|data-struct/i.test(topicId);

  return (
    <figure className="rounded-2xl bg-[#11261D] border border-[#254A3A] p-4 flex flex-col gap-2.5 overflow-hidden">
      <div className="flex items-center justify-between gap-2 text-[11.5px] font-bold text-[#9ED6B5]">
        <span>
          {isNetCyber
            ? 'OSI / TCP-IP Packet Stack, Subnetting & TLS Cryptography Plate'
            : isSoft
              ? 'Von Neumann Fetch–Decode–Execute, Logic Gates & Big-O Complexity Plate'
              : 'Von Neumann CPU Architecture, Binary Logic Gates & Network Stack Plate'}
        </span>
        <span className="text-[#FFD84D]">Conceptual Architecture Guide</span>
      </div>
      <svg
        viewBox="0 0 640 190"
        className="w-full h-auto rounded-xl bg-[#0D1F17]"
        role="img"
        aria-label="Digital Technologies architecture diagram plate"
      >
        <g stroke="#1E3F30" strokeWidth="1">
          <line x1="215" y1="16" x2="215" y2="174" strokeDasharray="4 4" />
          <line x1="430" y1="16" x2="430" y2="174" strokeDasharray="4 4" />
        </g>

        {/* Panel 1: Von Neumann CPU & Bus Architecture */}
        <g transform="translate(18, 18)">
          <rect x="0" y="0" width="180" height="154" rx="14" fill="#132C21" stroke="#2D5D47" strokeWidth="1.5" />
          <text x="12" y="20" fill="#9ED6B5" fontSize="10.5" fontWeight="700">1. CPU Fetch–Execute</text>
          <rect x="18" y="34" width="76" height="86" rx="10" fill="#0F241B" stroke="#3BDC86" strokeWidth="1.8" />
          <text x="34" y="54" fill="#FFD84D" fontSize="9.5" fontWeight="800">CU · PC</text>
          <rect x="28" y="64" width="56" height="22" rx="5" fill="#1D4634" stroke="#FFD84D" strokeWidth="1.3" />
          <text x="41" y="79" fill="#FFFFFF" fontSize="10" fontWeight="800">ALU</text>
          <text x="31" y="106" fill="#9ED6B5" fontSize="8.5" fontWeight="700">ACC · MAR</text>
          {/* System buses to RAM */}
          <line x1="94" y1="54" x2="118" y2="54" stroke="#93C5FD" strokeWidth="2" />
          <line x1="94" y1="77" x2="118" y2="77" stroke="#3BDC86" strokeWidth="2" />
          <line x1="94" y1="100" x2="118" y2="100" stroke="#FFD84D" strokeWidth="2" />
          <rect x="118" y="38" width="46" height="78" rx="8" fill="#0F241B" stroke="#93C5FD" strokeWidth="1.6" />
          <text x="127" y="64" fill="#93C5FD" fontSize="9.5" fontWeight="800">RAM</text>
          <text x="125" y="82" fill="#CBE4D7" fontSize="8" fontWeight="600">L1 / L2</text>
          <text x="125" y="98" fill="#CBE4D7" fontSize="8" fontWeight="600">Cache</text>
          <text x="14" y="145" fill="#E2F2EA" fontSize="9" fontWeight="600">Addr · Data · Control Bus</text>
        </g>

        {/* Panel 2: Two's Complement & Universal NAND Gate */}
        <g transform="translate(230, 18)">
          <rect x="0" y="0" width="184" height="154" rx="14" fill="#132C21" stroke="#2D5D47" strokeWidth="1.5" />
          <text x="12" y="20" fill="#9ED6B5" fontSize="10.5" fontWeight="700">2. Binary &amp; Logic Gate</text>
          {/* 8-bit register strip */}
          <rect x="16" y="34" width="152" height="24" rx="6" fill="#0F241B" stroke="#63D297" strokeWidth="1.3" />
          <text x="25" y="50" fill="#FFD84D" fontSize="10.5" fontFamily="monospace" fontWeight="800">1011 0110₂ = B6₁₆</text>
          {/* NAND gate schematic */}
          <line x1="26" y1="80" x2="62" y2="80" stroke="#93C5FD" strokeWidth="2" />
          <line x1="26" y1="104" x2="62" y2="104" stroke="#93C5FD" strokeWidth="2" />
          <path d="M 62 70 L 88 70 A 22 22 0 0 1 88 114 L 62 114 Z" fill="#1D4634" stroke="#3BDC86" strokeWidth="2" />
          <circle cx="115" cy="92" r="4.5" fill="#0F241B" stroke="#FFD84D" strokeWidth="2" />
          <line x1="120" y1="92" x2="154" y2="92" stroke="#FFD84D" strokeWidth="2.2" />
          <text x="16" y="83" fill="#93C5FD" fontSize="9" fontWeight="800">A</text>
          <text x="16" y="107" fill="#93C5FD" fontSize="9" fontWeight="800">B</text>
          <text x="134" y="84" fill="#FFD84D" fontSize="9" fontWeight="800">(A·B)&apos;</text>
          <text x="16" y="145" fill="#E2F2EA" fontSize="9" fontWeight="600">De Morgan: (A·B)&apos; = A&apos; + B&apos;</text>
        </g>

        {/* Panel 3: TCP/IP Stack & IPv4 /24 Subnet */}
        <g transform="translate(444, 18)">
          <rect x="0" y="0" width="178" height="154" rx="14" fill="#132C21" stroke="#2D5D47" strokeWidth="1.5" />
          <text x="12" y="20" fill="#9ED6B5" fontSize="10.5" fontWeight="700">3. OSI / TCP-IP &amp; CIDR</text>
          <rect x="20" y="32" width="138" height="20" rx="5" fill="#1D4634" stroke="#3BDC86" strokeWidth="1.3" />
          <text x="36" y="46" fill="#FFFFFF" fontSize="9" fontWeight="700">L7 Application (HTTPS)</text>
          <rect x="20" y="57" width="138" height="20" rx="5" fill="#17382A" stroke="#93C5FD" strokeWidth="1.3" />
          <text x="38" y="71" fill="#93C5FD" fontSize="9" fontWeight="700">L4 Transport (TCP/UDP)</text>
          <rect x="20" y="82" width="138" height="20" rx="5" fill="#143024" stroke="#FFD84D" strokeWidth="1.3" />
          <text x="36" y="96" fill="#FFD84D" fontSize="9" fontWeight="700">L3 Network (IP Router)</text>
          <rect x="20" y="107" width="138" height="20" rx="5" fill="#0F241B" stroke="#63D297" strokeWidth="1.3" />
          <text x="34" y="121" fill="#CBE4D7" fontSize="9" fontWeight="700">L2–L1 Link (MAC Switch)</text>
          <text x="16" y="145" fill="#E2F2EA" fontSize="9" fontWeight="600">Hosts = 2ʰ − 2 · TLS Cipher</text>
        </g>
      </svg>
    </figure>
  );
}

function DataProcNoteVisual({ topicId }: { topicId: string; partIdx?: number }) {
  const isDb = /db|er|norm|sql|key|rel/i.test(topicId);
  const isSheet = /spread|excel|pack|word|pres|chart/i.test(topicId);

  return (
    <figure className="rounded-2xl bg-[#11261D] border border-[#254A3A] p-4 flex flex-col gap-2.5 overflow-hidden">
      <div className="flex items-center justify-between gap-2 text-[11.5px] font-bold text-[#9ED6B5]">
        <span>
          {isDb
            ? 'ER 1 : M Foreign-Key Link, 1NF → 2NF → 3NF Normalization & SQL Pipeline'
            : isSheet
              ? 'Spreadsheet Cell Addressing ($A$1), Relational Keys & SQL Query Plate'
              : 'Information Cycle, Relational 1NF–3NF Keys & SQL / Spreadsheet Plate'}
        </span>
        <span className="text-[#FFD84D]">Relational &amp; Data Blueprint</span>
      </div>
      <svg
        viewBox="0 0 640 190"
        className="w-full h-auto rounded-xl bg-[#0D1F17]"
        role="img"
        aria-label="Data Processing study diagram plate"
      >
        <g stroke="#1E3F30" strokeWidth="1">
          <line x1="215" y1="16" x2="215" y2="174" strokeDasharray="4 4" />
          <line x1="430" y1="16" x2="430" y2="174" strokeDasharray="4 4" />
        </g>

        {/* Panel 1: 1:M Entity-Relationship PK -> FK Link */}
        <g transform="translate(18, 18)">
          <rect x="0" y="0" width="180" height="154" rx="14" fill="#132C21" stroke="#2D5D47" strokeWidth="1.5" />
          <text x="12" y="20" fill="#9ED6B5" fontSize="10.5" fontWeight="700">1. Relational PK → FK</text>
          <rect x="14" y="38" width="66" height="76" rx="8" fill="#0F241B" stroke="#FFD84D" strokeWidth="1.6" />
          <text x="22" y="54" fill="#FFD84D" fontSize="9" fontWeight="800">STUDENT</text>
          <line x1="14" y1="60" x2="80" y2="60" stroke="#2D5D47" strokeWidth="1" />
          <text x="20" y="75" fill="#FFFFFF" fontSize="8.5" fontWeight="700">PK StudID</text>
          <text x="20" y="91" fill="#CBE4D7" fontSize="8.5">FullName</text>
          <text x="20" y="106" fill="#CBE4D7" fontSize="8.5">ClassArm</text>
          {/* 1 : M Crow's Foot Connector */}
          <line x1="80" y1="76" x2="102" y2="76" stroke="#3BDC86" strokeWidth="2" />
          <line x1="85" y1="70" x2="85" y2="82" stroke="#3BDC86" strokeWidth="1.8" />
          <path d="M 95 76 L 103 70 M 95 76 L 103 82" stroke="#3BDC86" strokeWidth="1.8" />
          <rect x="103" y="38" width="64" height="76" rx="8" fill="#0F241B" stroke="#93C5FD" strokeWidth="1.6" />
          <text x="112" y="54" fill="#93C5FD" fontSize="9" fontWeight="800">SCORE</text>
          <line x1="103" y1="60" x2="167" y2="60" stroke="#2D5D47" strokeWidth="1" />
          <text x="109" y="75" fill="#FFFFFF" fontSize="8.5" fontWeight="700">PK ScoreID</text>
          <text x="109" y="91" fill="#FFD84D" fontSize="8.5" fontWeight="700">FK StudID</text>
          <text x="109" y="106" fill="#CBE4D7" fontSize="8.5">Mark</text>
          <text x="14" y="145" fill="#E2F2EA" fontSize="9" fontWeight="600">1 : M Referential Integrity</text>
        </g>

        {/* Panel 2: 1NF -> 2NF -> 3NF Normalization Ladder */}
        <g transform="translate(230, 18)">
          <rect x="0" y="0" width="184" height="154" rx="14" fill="#132C21" stroke="#2D5D47" strokeWidth="1.5" />
          <text x="12" y="20" fill="#9ED6B5" fontSize="10.5" fontWeight="700">2. 1NF → 2NF → 3NF</text>
          <rect x="18" y="34" width="148" height="26" rx="7" fill="#0F241B" stroke="#63D297" strokeWidth="1.4" />
          <text x="26" y="51" fill="#3BDC86" fontSize="9.2" fontWeight="800">1NF: Atomic cells (no lists)</text>
          <rect x="18" y="67" width="148" height="26" rx="7" fill="#0F241B" stroke="#93C5FD" strokeWidth="1.4" />
          <text x="26" y="84" fill="#93C5FD" fontSize="9.2" fontWeight="800">2NF: No partial PK depend.</text>
          <rect x="18" y="100" width="148" height="26" rx="7" fill="#1D4634" stroke="#FFD84D" strokeWidth="1.6" />
          <text x="26" y="117" fill="#FFD84D" fontSize="9.2" fontWeight="800">3NF: No transitive A→B→C</text>
          <text x="18" y="145" fill="#E2F2EA" fontSize="9" fontWeight="600">Eliminates update anomalies</text>
        </g>

        {/* Panel 3: SQL Execution Order & Spreadsheet Absolute Ref */}
        <g transform="translate(444, 18)">
          <rect x="0" y="0" width="178" height="154" rx="14" fill="#132C21" stroke="#2D5D47" strokeWidth="1.5" />
          <text x="12" y="20" fill="#9ED6B5" fontSize="10.5" fontWeight="700">3. SQL &amp; Excel Logic</text>
          <rect x="16" y="34" width="146" height="54" rx="8" fill="#0F241B" stroke="#3BDC86" strokeWidth="1.4" />
          <text x="24" y="50" fill="#93C5FD" fontSize="8.8" fontFamily="monospace" fontWeight="700">SELECT Dept, AVG(Pay)</text>
          <text x="24" y="64" fill="#CBE4D7" fontSize="8.8" fontFamily="monospace">FROM Staff WHERE Active=1</text>
          <text x="24" y="78" fill="#FFD84D" fontSize="8.8" fontFamily="monospace" fontWeight="700">GROUP BY Dept HAVING ...</text>
          <rect x="16" y="96" width="146" height="30" rx="7" fill="#17382A" stroke="#FFD84D" strokeWidth="1.3" />
          <text x="24" y="115" fill="#FFFFFF" fontSize="9.2" fontFamily="monospace" fontWeight="700">=SUM(B2:B9)*$D$1</text>
          <text x="16" y="145" fill="#E2F2EA" fontSize="9" fontWeight="600">WHERE rows · HAVING groups</text>
        </g>
      </svg>
    </figure>
  );
}

export function NotesScreen({
  topic,
  lesson,
  subj = 'maths',
  muted = false,
  flags = {},
  onToggleReadPart,
  onBack,
  onStartLesson,
  onStartPractice,
  onSound,
}: {
  topic: Topic;
  lesson?: InteractiveLesson;
  subj?: SubjectId;
  muted?: boolean;
  flags?: Record<string, number>;
  onToggleReadPart?: (partIdx: number, forceRead?: boolean) => void;
  onBack: () => void;
  onStartLesson: () => void;
  onStartPractice?: () => void;
  onSound?: (kind: 'ok' | 'no') => void;
}) {
  const [viewMode, setViewMode] = useState<'full' | 'reread'>('full');
  // Focused single-chapter pager by default so students never face a scary textbook wall
  const [chapterLayout, setChapterLayout] = useState<'single' | 'all'>('single');
  const [voicePartIdx, setVoicePartIdx] = useState(0);
  const [chapterDir, setChapterDir] = useState<'fwd' | 'back'>('fwd');
  const [hiddenExSteps, setHiddenExSteps] = useState<Record<number, boolean>>({});
  const [recallAnswers, setRecallAnswers] = useState<Record<number, number>>({});

  // Reset active chapter when topic changes (start at first unread chapter if any)
  useEffect(() => {
    const firstUnread = topic.parts.findIndex((_, idx) => !flags[`note:${topic.id}:${idx}`]);
    setVoicePartIdx(firstUnread >= 0 ? firstUnread : 0);
    setViewMode('full');
  }, [topic.id]);

  const isFMath = subj === 'fmaths';
  const isChem = subj === 'chem';
  const isPhys = subj === 'phys';
  const isBio = subj === 'bio';
  const isAgric = subj === 'agric';
  const isGeog = subj === 'geog';
  const isEcon = subj === 'econ';
  const isEng = subj === 'eng';
  const isCivic = subj === 'civic';
  const isDigiTech = subj === 'digitech';
  const isDataProc = subj === 'dataproc';
  const nerdc = isChem
    ? CHEM_NERDC_MAP[topic.id]
    : isFMath
      ? FMATH_NERDC_MAP[topic.id]
      : isPhys
        ? PHYS_NERDC_MAP[topic.id]
        : isBio
          ? BIO_NERDC_MAP[topic.id]
          : isAgric
            ? AGRIC_NERDC_MAP[topic.id]
            : isGeog
              ? GEOG_NERDC_MAP[topic.id]
              : isEcon
                ? ECON_NERDC_MAP[topic.id]
                : isEng
                  ? ENG_NERDC_MAP[topic.id]
                  : isCivic
                    ? CIVIC_NERDC_MAP[topic.id]
                    : isDigiTech
                      ? DIGITECH_NERDC_MAP[topic.id]
                      : isDataProc
                        ? DATAPROC_NERDC_MAP[topic.id]
                        : MATH_NERDC_MAP[topic.id];
  const safePartIdx = Math.min(voicePartIdx, Math.max(0, topic.parts.length - 1));
  const activePart = topic.parts[safePartIdx] || topic.parts[0];

  const isPartRead = (idx: number) => !!flags[`note:${topic.id}:${idx}`];
  const readCount = topic.parts.filter((_, idx) => isPartRead(idx)).length;
  const readPct = topic.parts.length ? Math.round((readCount / topic.parts.length) * 100) : 0;

  const goToChapter = (idx: number) => {
    const clamped = Math.max(0, Math.min(topic.parts.length - 1, idx));
    setChapterDir(clamped >= safePartIdx ? 'fwd' : 'back');
    setVoicePartIdx(clamped);
    if (viewMode !== 'full') setViewMode('full');
    if (chapterLayout === 'all') {
      window.requestAnimationFrame(() => {
        const el = document.getElementById(`note-part-${clamped}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Gather rich lesson beats per part
  const partExtras = useMemo(
    () =>
      topic.parts.map((_, idx) => {
        const lPart = lesson?.parts[idx];
        const ideas = (lPart?.beats.filter((b) => b.k === 'idea') || []) as IdeaBeat[];
        const teaches = (lPart?.beats.filter((b) => b.k === 'teach') || []) as TeachBeat[];
        const explores = (lPart?.beats.filter((b) => b.k === 'explore') || []) as ExploreBeat[];
        const defs = ideas.flatMap((b) => b.defs || []);
        const laws = ideas.flatMap((b) => b.laws || []);
        return { teaches, explores, defs, laws, trap: topic.trap };
      }),
    [topic.parts, topic.trap, lesson]
  );

  const allDefs = useMemo(() => partExtras.flatMap((x) => x.defs), [partExtras]);
  const allLaws = useMemo(() => partExtras.flatMap((x) => x.laws), [partExtras]);
  const allTables = useMemo(
    () =>
      partExtras.flatMap((x) =>
        x.teaches.flatMap((tb) =>
          tb.body
            .filter((blk) => blk[0] === 'tb')
            .map((blk) => ({ title: tb.title, block: blk }))
        )
      ),
    [partExtras]
  );

  // Full, non-skipping spoken scripts for EVERY chapter + the 1-Min Reread Sheet
  const allChapterScripts = useMemo(
    () =>
      topic.parts.map((p, idx) =>
        extractNotePartSpeechScript(topic.name, idx, p, partExtras[idx])
      ),
    [topic.name, topic.parts, partExtras]
  );

  const rereadScript = useMemo(
    () => extractRereadSheetSpeechScript(topic, allDefs, allLaws),
    [topic, allDefs, allLaws]
  );

  const activeStepScript =
    viewMode === 'reread' ? rereadScript : allChapterScripts[safePartIdx] || '';

  const upcomingNoteScripts = useMemo(() => {
    if (viewMode === 'reread') {
      return allChapterScripts;
    }
    return [
      ...allChapterScripts.filter((_, idx) => idx !== safePartIdx),
      rereadScript,
    ];
  }, [viewMode, allChapterScripts, safePartIdx, rereadScript]);

  const subtitleParts = [
    nerdc ? `${nerdc.classId.toUpperCase().replace('SS', 'SS ')} · ${nerdc.termLabel}` : null,
    topic.name,
  ].filter(Boolean);

  const visibleIndices =
    chapterLayout === 'single'
      ? [safePartIdx]
      : topic.parts.map((_, idx) => idx);

  const stepAnimCls = chapterDir === 'fwd' ? 'anim-step-fwd' : 'anim-step-back';

  return (
    <div className="max-w-[820px] mx-auto flex flex-col gap-5 anim-rise">
      <SubscreenTopBar
        title="Illustrated Study Notes"
        subtitle={subtitleParts.join(' · ')}
        onBack={onBack}
        right={
          <button
            type="button"
            onClick={onStartLesson}
            className="min-h-[36px] px-3.5 py-1.5 rounded-xl bg-[var(--gold)] hover:brightness-105 text-[var(--on-acc)] font-bold text-[13px] shadow-[0_1px_2px_rgba(15,23,42,0.16)] transition cursor-pointer whitespace-nowrap shrink-0"
          >
            Interactive lesson
          </button>
        }
      />

      {/* Calm Chapter Progress & Focused Reading Controls */}
      <section className="rtc-card rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[13px] font-bold text-[var(--dim)] flex-wrap">
              <span className="text-[var(--ink)] tabular-nums">
                {readCount} of {topic.parts.length}{' '}
                {topic.parts.length === 1 ? 'chapter' : 'short chapters'} read
              </span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums text-[var(--gold)]">~2 min per chapter</span>
            </div>
            <SmoothProgressBar
              value={readPct}
              max={100}
              tone="emerald"
              heightClass="h-2"
              ariaLabel="Notes completion progress"
              className="sm:w-64"
            />
          </div>

          <SlidingTabs
            items={[
              { id: 'full', label: 'Chapter Notes' },
              { id: 'reread', label: '1-Min Reread Sheet' },
            ]}
            value={viewMode}
            onChange={setViewMode}
            ariaLabel="Notes reading mode"
            variant="paper"
            size="sm"
            className="self-start sm:self-auto min-w-[290px]"
          />
        </div>

        {/* Chapter Pager Tabs + Focus / All Toggle */}
        {topic.parts.length > 1 && viewMode === 'full' && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
            <div className="flex items-center gap-2 overflow-x-auto pb-0.5" aria-label="Select chapter">
              {topic.parts.map((p, idx) => {
                const done = isPartRead(idx);
                const isCurrent = safePartIdx === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    aria-current={isCurrent ? 'step' : undefined}
                    onClick={() => goToChapter(idx)}
                    className={`min-h-[36px] px-3 rounded-xl text-[12.5px] font-bold border flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap shrink-0 ${
                      isCurrent
                        ? 'bg-[var(--acc-soft)] border-2 border-[var(--gold)] text-[var(--ink)]'
                        : done
                          ? 'bg-[var(--ok-soft)]/70 border-[var(--ok-line)] text-[var(--green)]'
                          : 'bg-[var(--bg)] border-[var(--line)] text-[var(--dim)] hover:text-[var(--ink)] hover:border-[var(--acc-line)]'
                    }`}
                  >
                    {done && <Icon name="check" size={13} />}
                    <span>
                      {idx + 1}. {p.title}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() =>
                setChapterLayout((prev) => (prev === 'single' ? 'all' : 'single'))
              }
              className="min-h-[32px] px-2.5 rounded-lg bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--acc-line)] text-[12px] font-bold text-[var(--dim)] hover:text-[var(--ink)] transition cursor-pointer whitespace-nowrap shrink-0"
            >
              {chapterLayout === 'single'
                ? `View all ${topic.parts.length} chapters`
                : 'Focus: 1 chapter at a time'}
            </button>
          </div>
        )}
      </section>

      {/* One-Tap Continuous Studio Voice Coach — Teaches Like a Classroom Mentor */}
      {activePart && (
        <ChemMadScientistBar
          mode={
            isDataProc
              ? 'dataproc'
              : isDigiTech
                ? 'digitech'
                : isCivic
                  ? 'civic'
                  : isEng
                    ? 'eng'
                    : isEcon
                      ? 'econ'
                      : isGeog
                        ? 'geog'
                        : isAgric
                          ? 'agric'
                          : isBio
                            ? 'bio'
                            : isPhys
                              ? 'phys'
                              : isChem
                                ? 'chem'
                                : isFMath
                                  ? 'fmath'
                                  : 'math'
          }
          variant="compact"
          muted={muted}
          sessionKey={`notes-session|${subj}|${topic.id}`}
          stepKey={
            viewMode === 'reread'
              ? `notes|${subj}|${topic.id}|reread`
              : `notes|${subj}|${topic.id}|${safePartIdx}`
          }
          upcomingScripts={upcomingNoteScripts}
          context={{
            topicName: topic.name,
            sectionName: topic.sec,
            partTitle: viewMode === 'reread' ? '1-Min Reread Sheet' : activePart.title,
            stepLabel:
              viewMode === 'reread'
                ? '1-Min Reread Summary'
                : `Chapter ${safePartIdx + 1} of ${topic.parts.length} · ${activePart.title}`,
            stepText: activeStepScript,
            examTrap: topic.trap,
            goals: topic.goals,
          }}
        />
      )}

      {viewMode === 'reread' ? (
        /* ─────────────── 1-MIN RAPID REREAD CHEAT-SHEET ─────────────── */
        <div className="flex flex-col gap-5 anim-rise">
          {isChem ? (
            <ChemNoteVisual topicId={topic.id} partIdx={topic.id === 'c-water' ? 2 : 0} />
          ) : isFMath ? (
            <FMathNoteVisual topicId={topic.id} partIdx={0} />
          ) : isPhys ? (
            <PhysNoteVisual topicId={topic.id} partIdx={0} />
          ) : isBio ? (
            <BioNoteVisual topicId={topic.id} partIdx={0} />
          ) : isAgric ? (
            <AgricNoteVisuals topicId={topic.id} />
          ) : isGeog ? (
            <GeogNoteVisual topicId={topic.id} partIdx={0} />
          ) : isEcon ? (
            <EconNoteVisual topicId={topic.id} partIdx={0} />
          ) : isEng ? (
            <EngNoteVisual topicId={topic.id} partIdx={0} />
          ) : isCivic ? (
            <CivicNoteVisual topicId={topic.id} partIdx={0} />
          ) : isDigiTech ? (
            <DigiTechNoteVisual topicId={topic.id} partIdx={0} />
          ) : isDataProc ? (
            <DataProcNoteVisual topicId={topic.id} partIdx={0} />
          ) : (
            <MathNoteVisual topicId={topic.id} partIdx={0} />
          )}

          {/* Learning Goals Summary */}
          {topic.goals.length > 0 && (
            <section className="rtc-card rounded-2xl p-5 flex flex-col gap-3">
              <h2 className="h20 text-[var(--ink)]">Core Mastery Checklist</h2>
              <ul className="space-y-2 text-[15px] text-[var(--ink)]">
                {topic.goals.map((g, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Icon name="check" size={16} className="text-[var(--green)] shrink-0 mt-1" />
                    <span dangerouslySetInnerHTML={{ __html: typesetMathHtml(g, subj) }} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Consolidated Definitions & Laws */}
          {(allDefs.length > 0 || allLaws.length > 0) && (
            <section className="rtc-card rounded-2xl p-5 flex flex-col gap-4">
              <h2 className="h20 text-[var(--ink)]">Essential Definitions &amp; Laws</h2>
              <div className="tw">
                <table>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Term / Principle</th>
                      <th>Exact Definition &amp; Core Rule</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allLaws.map(([term, stmt], idx) => (
                      <tr key={`law-${idx}`}>
                        <td>
                          <span className="text-[var(--gold)]">Law / Principle</span>
                        </td>
                        <td dangerouslySetInnerHTML={{ __html: typesetMathHtml(term, subj) }} />
                        <td dangerouslySetInnerHTML={{ __html: typesetMathHtml(stmt, subj) }} />
                      </tr>
                    ))}
                    {allDefs.map(([term, stmt], idx) => (
                      <tr key={`def-${idx}`}>
                        <td>
                          <span className="text-[var(--dim)]">Definition</span>
                        </td>
                        <td dangerouslySetInnerHTML={{ __html: typesetMathHtml(term, subj) }} />
                        <td dangerouslySetInnerHTML={{ __html: typesetMathHtml(stmt, subj) }} />
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Chapter-by-Chapter Key Rules Snapshot */}
          <section className="rtc-card rounded-2xl p-5 flex flex-col gap-4">
            <h2 className="h20 text-[var(--ink)]">Rapid Reread Key Rules</h2>
            <div className="flex flex-col gap-4 divide-y divide-[var(--line)]">
              {topic.parts.map((part, idx) => (
                <div key={idx} className={idx > 0 ? 'pt-4 flex flex-col gap-2' : 'flex flex-col gap-2'}>
                  <h3 className="font-[var(--display)] font-bold text-[16.5px] text-[var(--ink)]">
                    {idx + 1}. {part.title}
                  </h3>
                  <p
                    className="text-[14.5px] text-[var(--dim)] leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: typesetMathHtml(part.idea, subj) }}
                  />
                  {part.rules.length > 0 && (
                    <ul className="rules">
                      {part.rules.map((r, rIdx) => (
                        <RuleItemRenderer key={rIdx} html={r} subj={subj} />
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Reference Tables */}
          {allTables.length > 0 && (
            <section className="rtc-card rounded-2xl p-5 flex flex-col gap-4">
              <h2 className="h20 text-[var(--ink)]">Quick Comparison Tables</h2>
              {allTables.map((item, i) => (
                <div key={i} className="flex flex-col gap-2">
                  {item.title && (
                    <h3 className="font-[var(--display)] font-bold text-[16px] text-[var(--ink)]">
                      {item.title}
                    </h3>
                  )}
                  <NoteTeachBlock block={item.block} subj={subj} />
                </div>
              ))}
            </section>
          )}

          {/* Trap */}
          <div className="rounded-2xl bg-[var(--bad-soft)] border border-[var(--bad-line)] p-4 sm:p-5 flex items-start gap-3">
            <span className="w-8 h-8 rounded-xl bg-[var(--card)] text-[var(--coral-ink)] flex items-center justify-center shrink-0">
              <Icon name="bolt" size={16} />
            </span>
            <div>
              <span className="eyebrow text-[var(--coral-ink)]">Trap</span>
              <p
                className="text-[14.5px] text-[var(--ink)] mt-0.5 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: typesetMathHtml(topic.trap, subj) }}
              />
            </div>
          </div>
        </div>
      ) : (
        /* ─────────────── FOCUSED CHAPTER NOTES ─────────────── */
        <div className="flex flex-col gap-6">
          {visibleIndices.map((idx) => {
            const part = topic.parts[idx];
            if (!part) return null;
            const extra = partExtras[idx];
            const read = isPartRead(idx);
            const hideSteps = !!hiddenExSteps[idx];
            const pickedRecall = recallAnswers[idx] ?? null;
            const recallRight = part.tryit ? (part.tryit.a ?? 0) : 0;
            const recallSolved = pickedRecall === recallRight;
            const recallOrder = part.tryit ? perm(`note-recall|${topic.id}|${idx}`, part.tryit.o.length) : [];
            const showChemPlate =
              isChem &&
              (idx === 0 ||
                (topic.id === 'c-intro' && idx === 1) ||
                topic.id === 'c-water');
            const showFMathPlate = isFMath && idx === 0;
            const showPhysPlate = isPhys && idx === 0;
            const showBioPlate = isBio && idx === 0;
            const showAgricPlate = isAgric && idx === 0;
            const showGeogPlate = isGeog && idx === 0;
            const showEconPlate = isEcon && idx === 0;
            const showEngPlate = isEng && idx === 0;
            const showCivicPlate = isCivic && idx === 0;
            const showDigiTechPlate = isDigiTech && idx === 0;
            const showDataProcPlate = isDataProc && idx === 0;
            const showMathPlate =
              !isChem &&
              !isFMath &&
              !isPhys &&
              !isBio &&
              !isAgric &&
              !isGeog &&
              !isEcon &&
              !isEng &&
              !isCivic &&
              !isDigiTech &&
              !isDataProc &&
              idx === 0;

            return (
              <article
                id={`note-part-${idx}`}
                key={`${topic.id}-ch-${idx}`}
                onClick={() => {
                  if (chapterLayout === 'all' && safePartIdx !== idx) {
                    setVoicePartIdx(idx);
                  }
                }}
                className={`scroll-mt-20 rtc-card rounded-2xl p-5 sm:p-6 flex flex-col gap-5 ${
                  chapterLayout === 'single' ? stepAnimCls : ''
                }`}
              >
                {/* Chapter Header */}
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--line)] pb-3.5">
                  <div>
                    <div className="flex items-center gap-2 text-[12px] font-bold text-[var(--gold)]">
                      <span>
                        Chapter {idx + 1} of {topic.parts.length}
                      </span>
                      <span aria-hidden="true" className="text-[var(--dim)]">
                        ·
                      </span>
                      <span className="text-[var(--dim)]">~2 min read</span>
                      {read && (
                        <>
                          <span aria-hidden="true" className="text-[var(--dim)]">
                            ·
                          </span>
                          <span className="text-[var(--green)]">Completed</span>
                        </>
                      )}
                    </div>
                    <h2 className="h22 text-[var(--ink)] mt-0.5">{part.title}</h2>
                  </div>

                  {onToggleReadPart && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleReadPart(idx);
                      }}
                      aria-pressed={read}
                      className={`min-h-[36px] px-3 rounded-xl text-[12.5px] font-bold border flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap shrink-0 ${
                        read
                          ? 'bg-[var(--ok-soft)] border-[var(--ok-line)] text-[var(--green)]'
                          : 'bg-[var(--bg)] border-[var(--line)] text-[var(--ink)] hover:border-[var(--acc-line)]'
                      }`}
                    >
                      <Icon name="check" size={14} />
                      <span>{read ? 'Read' : 'Mark read'}</span>
                    </button>
                  )}
                </div>

                {/* Core Idea */}
                <p
                  className="lead text-[var(--ink)]"
                  dangerouslySetInnerHTML={{ __html: typesetMathHtml(part.idea, subj) }}
                />

                {/* Visual Plate(s) */}
                {showChemPlate && <ChemNoteVisual topicId={topic.id} partIdx={idx} />}
                {showFMathPlate && <FMathNoteVisual topicId={topic.id} partIdx={idx} />}
                {showPhysPlate && <PhysNoteVisual topicId={topic.id} partIdx={idx} />}
                {showBioPlate && <BioNoteVisual topicId={topic.id} partIdx={idx} />}
                {showAgricPlate && <AgricNoteVisuals topicId={topic.id} />}
                {showGeogPlate && <GeogNoteVisual topicId={topic.id} partIdx={idx} />}
                {showEconPlate && <EconNoteVisual topicId={topic.id} partIdx={idx} />}
                {showEngPlate && <EngNoteVisual topicId={topic.id} partIdx={idx} />}
                {showCivicPlate && <CivicNoteVisual topicId={topic.id} partIdx={idx} />}
                {showDigiTechPlate && <DigiTechNoteVisual topicId={topic.id} partIdx={idx} />}
                {showDataProcPlate && <DataProcNoteVisual topicId={topic.id} partIdx={idx} />}
                {showMathPlate && <MathNoteVisual topicId={topic.id} partIdx={idx} />}
                {part.g && <DiagramFigure g={part.g} cap={part.cap} />}

                {/* Live Interactive Simulation if mapped to this chapter */}
                {extra.explores.map((expBeat, expIdx) => (
                  <EmbeddedNoteExplorer key={expIdx} beat={expBeat} />
                ))}

                {/* Formal Definitions & Laws Table */}
                {(extra.defs.length > 0 || extra.laws.length > 0) && (
                  <div className="flex flex-col gap-2">
                    <span className="eyebrow text-[var(--dim)]">Key Definitions &amp; Principles</span>
                    <div className="tw">
                      <table>
                        <thead>
                          <tr>
                            <th>Category</th>
                            <th>Term / Principle</th>
                            <th>Definition &amp; Core Rule</th>
                          </tr>
                        </thead>
                        <tbody>
                          {extra.laws.map(([name, stmt], lIdx) => (
                            <tr key={`law-${lIdx}`}>
                              <td>
                                <span className="text-[var(--gold)]">Law / Principle</span>
                              </td>
                              <td dangerouslySetInnerHTML={{ __html: typesetMathHtml(name, subj) }} />
                              <td dangerouslySetInnerHTML={{ __html: typesetMathHtml(stmt, subj) }} />
                            </tr>
                          ))}
                          {extra.defs.map(([term, def], dIdx) => (
                            <tr key={`def-${dIdx}`}>
                              <td>
                                <span className="text-[var(--dim)]">Definition</span>
                              </td>
                              <td dangerouslySetInnerHTML={{ __html: typesetMathHtml(term, subj) }} />
                              <td dangerouslySetInnerHTML={{ __html: typesetMathHtml(def, subj) }} />
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Deep-Dive Teach Beats (Comparison Tables, Examples, Warnings) */}
                {extra.teaches.map((tb, tIdx) => {
                  const normTitle = (tb.title || '').replace(/<[^>]+>/g, '').trim().toLowerCase();
                  const filteredBody = tb.body.filter(
                    (blk) =>
                      !(
                        blk[0] === 'h' &&
                        normTitle &&
                        blk[1].replace(/<[^>]+>/g, '').trim().toLowerCase() === normTitle
                      )
                  );
                  return (
                    <div
                      key={tIdx}
                      className="pt-2 border-t border-[var(--line)] flex flex-col gap-3"
                    >
                      {tb.title && (
                        <h3 className="font-[var(--display)] font-bold text-[18px] text-[var(--ink)]">
                          {tb.title}
                        </h3>
                      )}
                      {filteredBody.map((blk, bIdx) => (
                        <NoteTeachBlock key={bIdx} block={blk} subj={subj} />
                      ))}
                    </div>
                  );
                })}

                {/* Key Rules */}
                {part.rules.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="eyebrow text-[var(--dim)]">Essential Rules &amp; Equations</span>
                    <ul className="rules">
                      {part.rules.map((r, rIdx) => (
                        <RuleItemRenderer key={rIdx} html={r} subj={subj} />
                      ))}
                    </ul>
                  </div>
                )}

                {/* Interactive Self-Testing Worked Example */}
                {part.ex && (
                  <div className="rounded-2xl bg-[var(--bg)] border border-[var(--line)] p-4 sm:p-5 flex flex-col gap-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="eyebrow text-[var(--gold)]">Step-by-Step Worked Example</span>
                      <button
                        type="button"
                        onClick={() =>
                          setHiddenExSteps((prev) => ({ ...prev, [idx]: !prev[idx] }))
                        }
                        className="min-h-[32px] px-3 rounded-lg bg-[var(--card)] border border-[var(--line)] hover:border-[var(--acc-line)] text-[12px] font-bold text-[var(--ink)] cursor-pointer whitespace-nowrap shrink-0"
                      >
                        {hideSteps ? 'Reveal solution steps' : 'Hide steps to self-test'}
                      </button>
                    </div>
                    <div
                      className="qt text-[var(--ink)]"
                      dangerouslySetInnerHTML={{ __html: typesetMathHtml(part.ex.q, subj) }}
                    />
                    {part.ex.g && <DiagramFigure g={part.ex.g} />}
                    {!hideSteps ? (
                      <div className="stagger-grid flex flex-col gap-2 pt-1">
                        {part.ex.steps.map(([stepMath, why], sIdx) => (
                          <div
                            key={sIdx}
                            className="rounded-xl bg-[var(--card)] border border-[var(--line)] p-3 flex items-start gap-3"
                          >
                            <span className="w-6 h-6 rounded-full bg-[var(--acc-soft)] text-[var(--gold)] font-extrabold text-[12px] flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                              {sIdx + 1}
                            </span>
                            <div className="flex-1 flex flex-col gap-0.5">
                              <div
                                className="sm text-[var(--ink)]"
                                dangerouslySetInnerHTML={{ __html: typesetMathHtml(stepMath, subj) }}
                              />
                              {why && (
                                <div
                                  className="text-[13px] text-[var(--dim)]"
                                  dangerouslySetInnerHTML={{ __html: typesetMathHtml(why, subj) }}
                                />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-xl bg-[var(--card)] border border-dashed border-[var(--acc-line)] p-4 text-center text-[14px] text-[var(--dim)]">
                        Work out the answer in your head or notebook first, then click{' '}
                        <strong className="text-[var(--ink)]">Reveal solution steps</strong> to check!
                      </div>
                    )}
                  </div>
                )}

                {/* Inline Quick Recall Check */}
                {part.tryit && (
                  <div className="rounded-2xl bg-[var(--deep)]/65 border border-[var(--line)] p-4 sm:p-5 flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="eyebrow text-[var(--gold)]">
                        Quick Recall Check · Chapter {idx + 1}
                      </span>
                      {recallSolved && (
                        <span className="text-[12.5px] font-bold text-[var(--green)]">
                          Solved ✓
                        </span>
                      )}
                    </div>
                    <div
                      className="text-[15.5px] font-semibold text-[var(--ink)]"
                      dangerouslySetInnerHTML={{ __html: typesetMathHtml(part.tryit.q, subj) }}
                    />
                    {part.tryit.ask && (
                      <div
                        className="text-[14.5px] font-bold text-[var(--gold)]"
                        dangerouslySetInnerHTML={{ __html: typesetMathHtml(part.tryit.ask, subj) }}
                      />
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {recallOrder.map((origIdx, dispIdx) => {
                        const isPicked = pickedRecall === origIdx;
                        const isRight = origIdx === recallRight;
                        const cls = isPicked ? (isRight ? 'ok' : 'no') : '';
                        return (
                          <button
                            key={origIdx}
                            type="button"
                            disabled={recallSolved}
                            onClick={() => {
                              setRecallAnswers((prev) => ({ ...prev, [idx]: origIdx }));
                              onSound?.(isRight ? 'ok' : 'no');
                              if (isRight && onToggleReadPart && !read) {
                                onToggleReadPart(idx, true);
                              }
                            }}
                            className={`opt-tile ${cls}`}
                          >
                            <span className="w-7 h-7 rounded-lg bg-[var(--deep)] border border-[var(--line)] font-extrabold text-[12.5px] flex items-center justify-center shrink-0">
                              {String.fromCharCode(65 + dispIdx)}
                            </span>
                            <span
                              className="flex-1 text-[14.5px]"
                              dangerouslySetInnerHTML={{ __html: typesetMathHtml(part.tryit.o[origIdx], subj) }}
                            />
                          </button>
                        );
                      })}
                    </div>
                    {pickedRecall !== null && (
                      <div
                        className={`rounded-xl border p-3.5 text-[14px] leading-relaxed ${
                          recallSolved
                            ? 'bg-[var(--ok-soft)] border-[var(--ok-line)] text-[var(--ink)]'
                            : 'bg-[var(--bad-soft)] border-[var(--bad-line)] text-[var(--ink)]'
                        }`}
                        dangerouslySetInnerHTML={{
                          __html: typesetMathHtml(
                            recallSolved
                              ? part.tryit.e
                              : part.tryit.h || 'Check the key rules above and try another option.',
                            subj
                          ),
                        }}
                      />
                    )}
                  </div>
                )}

                {/* Calm Chapter Pager Footer (in Focused Single-Chapter Mode) */}
                {chapterLayout === 'single' && topic.parts.length > 1 && (
                  <div className="pt-3 border-t border-[var(--line)] flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => goToChapter(idx - 1)}
                      className="btn-tactile paper min-h-[44px] px-4 whitespace-nowrap shrink-0"
                    >
                      <Icon name="back" size={16} />
                      <span>Previous chapter</span>
                    </button>

                    {idx < topic.parts.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (onToggleReadPart && !read) {
                            onToggleReadPart(idx, true);
                          }
                          goToChapter(idx + 1);
                        }}
                        className="btn-tactile indigo min-h-[44px] px-5 whitespace-nowrap shrink-0"
                      >
                        <span>
                          Next: Chapter {idx + 2} ({topic.parts[idx + 1]?.title})
                        </span>
                        <Icon name="go" size={17} className="ul-arrow" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          if (onToggleReadPart && !read) {
                            onToggleReadPart(idx, true);
                          }
                          setViewMode('reread');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="btn-tactile emerald min-h-[44px] px-5 whitespace-nowrap shrink-0"
                      >
                        <span>Finish &amp; open 1-Min Reread Sheet</span>
                        <Icon name="check" size={17} />
                      </button>
                    )}
                  </div>
                )}
              </article>
            );
          })}

          {/* Topic Trap & Next Step Footer (shown on final chapter or all-chapters view) */}
          {(chapterLayout === 'all' || safePartIdx === topic.parts.length - 1) && (
            <>
              <div className="rounded-2xl bg-[var(--bad-soft)] border border-[var(--bad-line)] p-4 sm:p-5 flex items-start gap-3">
                <span className="w-8 h-8 rounded-xl bg-[var(--card)] text-[var(--coral-ink)] flex items-center justify-center shrink-0">
                  <Icon name="bolt" size={16} />
                </span>
                <div>
                  <span className="eyebrow text-[var(--coral-ink)]">
                    Trap
                  </span>
                  <p
                    className="text-[14.5px] text-[var(--ink)] mt-0.5 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: typesetMathHtml(topic.trap, subj) }}
                  />
                </div>
              </div>

              <div className="rtc-card rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="h18 text-[var(--ink)]">
                    {readCount === topic.parts.length
                      ? 'All chapters read — ready to test your mastery!'
                      : 'Ready to practise what you just read?'}
                  </h3>
                  <p className="text-[14px] text-[var(--dim)] mt-0.5">
                    Switch to the <strong>1-Min Reread Sheet</strong> anytime for a rapid concept refresh.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={onStartLesson}
                    className="btn-tactile indigo whitespace-nowrap shrink-0"
                  >
                    <span>Interactive lesson</span>
                    <Icon name="go" size={17} />
                  </button>
                  {onStartPractice && (
                    <button
                      type="button"
                      onClick={onStartPractice}
                      className="btn-tactile paper whitespace-nowrap shrink-0"
                    >
                      <span>Practise questions</span>
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
