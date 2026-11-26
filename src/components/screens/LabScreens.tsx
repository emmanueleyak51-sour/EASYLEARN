import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { LabItem, SubjectId } from '../../types';
import { BLAB_CATS } from '../../data/bioLabs';
import {
  ALAB_CATS,
  CLAB_CATS,
  LAB_CATS,
  PLAB_CATS,
  getLabsForSubject,
  renderLabSvg,
} from '../../data/labs';
import { SUBJECT_INFO } from '../../utils/engine';
import { extractLabStepSpeechScript, htmlToSpeakableChem } from '../../utils/chemVoiceLogic';
import { getLabStepAudioCues } from '../../utils/labAudioLogic';
import { getLabVivaCheck } from '../../utils/labVivaLogic';
import {
  computeLabTrialStats,
  formatLabReportText,
  formatLabTrialRow,
  getLabSimulationSpec,
  type LoggedLabTrial,
} from '../../utils/advancedLabSimulation';
import { typesetMathHtml } from '../../utils/mathTypesetter';
import { playLabFoleySchedule } from '../../utils/sound';
import { Icon, LabGlyph } from '../Icons';
import { ChemMadScientistBar } from '../ChemMadScientistBar';
import { SubscreenTopBar } from '../AppShell';
import { LiquidCapsuleBar, SmoothCollapse, SmoothViewSwitch } from '../ULessonMotion';

const CHEM_CAT_SHORT: Record<string, string> = {
  q: 'Volumetric',
  s: 'Separation',
  g: 'Gases',
  i: 'Ion & Salt Tests',
  p: 'Rates, Heat & Electrolysis',
  o: 'Organic & Food Tests',
};

const PHYS_CAT_SHORT: Record<string, string> = {
  mech: 'Mechanics',
  heat: 'Heat & Calorimetry',
  opt: 'Optics',
  elec: 'Electricity',
  wave: 'Waves & Resonance',
};

const BIO_CAT_SHORT: Record<string, string> = {
  cell: 'Cells & Osmosis',
  food: 'Food & Enzymes',
  plant: 'Plant Physiology',
  ecol: 'Ecology & Soil',
  anat: 'Anatomy & Genetics',
};

const AGRIC_CAT_SHORT: Record<string, string> = {
  soil: 'Soil Science',
  crop: 'Crop & NPK',
  prot: 'Crop Protection',
  livestock: 'Animal & Feed',
  aqua: 'Aquaculture & Survey',
};

function InteractiveLabInstrumentDeck({ lab }: { lab: LabItem }) {
  const spec = useMemo(() => getLabSimulationSpec(lab), [lab]);
  const [sliderValues, setSliderValues] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    for (const s of spec.sliders) init[s.id] = s.defaultValue;
    return init;
  });
  const [trials, setTrials] = useState<LoggedLabTrial[]>([]);
  const [copiedLog, setCopiedLog] = useState(false);

  useEffect(() => {
    const init: Record<string, number> = {};
    for (const s of spec.sliders) init[s.id] = s.defaultValue;
    setSliderValues(init);
    setTrials([]);
    setCopiedLog(false);
  }, [lab.id, spec]);

  const evalResult = useMemo(() => spec.evaluate(sliderValues), [spec, sliderValues]);
  const trialStats = useMemo(() => computeLabTrialStats(trials), [trials]);
  const curve = evalResult.curve;

  const statusPillCls =
    evalResult.statusTone === 'endpoint' || evalResult.statusTone === 'optimal'
      ? 'bg-[#173D2B] border-[#3BDC86]/50 text-[#6EE7B7]'
      : evalResult.statusTone === 'caution'
        ? 'bg-[#3D221E] border-[#F87171]/50 text-[#FCA5A5]'
        : 'bg-[#1D352B] border-[#FFC531]/45 text-[#FFD84D]';

  // Map curve coordinates into SVG viewport [42..362] x [16..126]
  const padL = 42;
  const padR = 18;
  const padT = 16;
  const padB = 28;
  const plotW = 380 - padL - padR;
  const plotH = 154 - padT - padB;
  const xSpan = Math.max(1e-6, curve.xMax - curve.xMin);
  const ySpan = Math.max(1e-6, curve.yMax - curve.yMin);
  const toSvgX = (x: number) => padL + ((x - curve.xMin) / xSpan) * plotW;
  const toSvgY = (y: number) =>
    padT + plotH - Math.max(0, Math.min(1, (y - curve.yMin) / ySpan)) * plotH;

  const polylinePoints = curve.points
    .map((pt) => `${toSvgX(pt.x).toFixed(1)},${toSvgY(pt.y).toFixed(1)}`)
    .join(' ');
  const curCx = toSvgX(curve.currentPoint.x);
  const curCy = toSvgY(curve.currentPoint.y);

  const handleLogReading = () => {
    setTrials((prev) => [
      ...prev.slice(-7),
      formatLabTrialRow(prev.length + 1, spec, sliderValues, evalResult),
    ]);
  };

  const handleResetSliders = () => {
    const init: Record<string, number> = {};
    for (const s of spec.sliders) init[s.id] = s.defaultValue;
    setSliderValues(init);
  };

  return (
    <section
      aria-label={spec.benchTitle}
      className="rounded-2xl bg-[#10261D] border border-[#24493B] text-[#F4F8F5] p-4 flex flex-col gap-3.5"
    >
      {/* Instrument Header + Dual-Coded Status Telemetry */}
      <div className="flex flex-wrap items-start justify-between gap-2.5 border-b border-[#24493B] pb-3">
        <div>
          <span className="text-[11.5px] font-bold text-[#FFC531]">
            Try it yourself · {spec.instrumentTag}
          </span>
          <h3 className="font-[var(--display)] font-bold text-[16.5px] text-white mt-0.5">
            {spec.benchTitle}
          </h3>
        </div>
        <span
          className={`px-2.5 py-1 rounded-lg border text-[11.5px] font-bold whitespace-nowrap ${statusPillCls}`}
        >
          {evalResult.statusLabel}
        </span>
      </div>

      {/* Two-Column Instrument Controls & Live Calibration Graph */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-stretch">
        {/* Left: Labeled Sliders + Primary Digital Meter */}
        <div className="sm:col-span-6 flex flex-col justify-between gap-3">
          <div className="flex flex-col gap-2.5">
            {spec.sliders.map((s) => {
              const val = sliderValues[s.id] ?? s.defaultValue;
              const decimals = s.step < 0.1 ? 2 : s.step < 1 ? 1 : 0;
              return (
                <div
                  key={s.id}
                  className="rounded-xl bg-[#163428] border border-[#285240] px-3 py-2.5 flex flex-col gap-1.5"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <label
                      htmlFor={`lab-sim-${lab.id}-${s.id}`}
                      className="text-[12px] font-bold text-[#D6E8DF]"
                    >
                      {s.label}
                    </label>
                    <output
                      htmlFor={`lab-sim-${lab.id}-${s.id}`}
                      className="font-[var(--display)] font-extrabold text-[13.5px] text-[#FFC531] tabular-nums whitespace-nowrap"
                    >
                      {val.toFixed(decimals)}
                      {s.unit ? ` ${s.unit}` : ''}
                    </output>
                  </div>
                  <input
                    id={`lab-sim-${lab.id}-${s.id}`}
                    type="range"
                    min={s.min}
                    max={s.max}
                    step={s.step}
                    value={val}
                    onChange={(e) =>
                      setSliderValues((prev) => ({
                        ...prev,
                        [s.id]: Number(e.target.value),
                      }))
                    }
                    className="lab-slider"
                  />
                </div>
              );
            })}
          </div>

          {/* Primary Digital Readout + Secondary Metrics */}
          <div className="rounded-xl bg-[#0C1D16] border border-[#285240] p-3 flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[11.5px] font-bold text-[#9ED6B5]">
                {evalResult.primaryLabel}
              </span>
              <span className="font-[var(--display)] font-extrabold text-[20px] text-[#3BDC86] tabular-nums">
                {evalResult.primaryValue}
                {evalResult.primaryUnit ? (
                  <span className="text-[12.5px] font-bold text-[#B9CCC1] ml-1">
                    {evalResult.primaryUnit}
                  </span>
                ) : null}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 pt-1.5 border-t border-[#1E3F30]">
              {evalResult.metrics.map((m) => (
                <div key={m.label} className="flex flex-col">
                  <span className="text-[10px] font-semibold text-[#9ED6B5] truncate">
                    {m.label}
                  </span>
                  <span className="text-[12px] font-extrabold text-white tabular-nums truncate">
                    {m.value}
                    {m.unit ? ` ${m.unit}` : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Live 25-Point Calibration / Response Curve */}
        <div className="sm:col-span-6 rounded-xl bg-[#0C1D16] border border-[#285240] p-2.5 flex flex-col justify-between gap-1.5">
          <div className="flex items-center justify-between gap-2 px-1 text-[10.5px] font-bold text-[#9ED6B5]">
            <span className="truncate">{curve.yLabel}</span>
            <span className="text-[#FFC531] tabular-nums">Live Response Curve</span>
          </div>
          <svg
            viewBox="0 0 380 154"
            className="w-full h-auto block"
            role="img"
            aria-label={`${curve.yLabel} versus ${curve.xLabel}`}
          >
            {/* Subtle scientific reticle */}
            <line
              x1={padL}
              y1={padT + plotH / 2}
              x2={380 - padR}
              y2={padT + plotH / 2}
              stroke="#1C3D31"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <line
              x1={padL + plotW / 2}
              y1={padT}
              x2={padL + plotW / 2}
              y2={padT + plotH}
              stroke="#1C3D31"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            {/* Axes */}
            <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#5F8D78" strokeWidth="1.4" />
            <line
              x1={padL}
              y1={padT + plotH}
              x2={380 - padR}
              y2={padT + plotH}
              stroke="#5F8D78"
              strokeWidth="1.4"
            />
            {/* Optional target threshold line */}
            {curve.targetY !== undefined && (
              <g>
                <line
                  x1={padL}
                  y1={toSvgY(curve.targetY)}
                  x2={380 - padR}
                  y2={toSvgY(curve.targetY)}
                  stroke="#FFC531"
                  strokeWidth="1.2"
                  strokeDasharray="4 3"
                />
                {curve.targetLabel && (
                  <text
                    x={380 - padR - 4}
                    y={Math.max(12, toSvgY(curve.targetY) - 4)}
                    textAnchor="end"
                    fill="#FFC531"
                    fontSize="9.5"
                    fontWeight="700"
                  >
                    {curve.targetLabel}
                  </text>
                )}
              </g>
            )}
            {/* Response curve */}
            <polyline
              fill="none"
              stroke="#3BDC86"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={polylinePoints}
            />
            {/* Logged trial markers on calibration graph */}
            {trials.map((tr) => (
              <circle
                key={tr.trialNo}
                cx={toSvgX(tr.xValue)}
                cy={toSvgY(tr.yValue)}
                r="3.6"
                fill="#38BDF8"
                stroke="#0C1D16"
                strokeWidth="1.4"
              />
            ))}
            {/* Active crosshair */}
            <line
              x1={curCx}
              y1={curCy}
              x2={curCx}
              y2={padT + plotH}
              stroke="#FFC531"
              strokeWidth="1.1"
              strokeDasharray="2 2"
            />
            <circle cx={curCx} cy={curCy} r="5" fill="#FFC531" stroke="#0C1D16" strokeWidth="1.8" />
            {/* Axis bounds & X label */}
            <text x={padL - 5} y={padT + 8} textAnchor="end" fill="#9ED6B5" fontSize="9.5">
              {curve.yMax.toFixed(curve.yMax >= 10 ? 0 : 1)}
            </text>
            <text x={padL - 5} y={padT + plotH} textAnchor="end" fill="#9ED6B5" fontSize="9.5">
              {curve.yMin.toFixed(curve.yMin >= 10 || curve.yMin === 0 ? 0 : 1)}
            </text>
            <text x={padL} y={148} textAnchor="start" fill="#9ED6B5" fontSize="9.5">
              {curve.xMin}
            </text>
            <text x={padL + plotW / 2} y={148} textAnchor="middle" fill="#D6E8DF" fontSize="10" fontWeight="700">
              {curve.xLabel}
            </text>
            <text x={380 - padR} y={148} textAnchor="end" fill="#9ED6B5" fontSize="9.5">
              {curve.xMax}
            </text>
          </svg>
        </div>
      </div>

      {/* Governing Equation + Live Observation Summary + Trial Logger Action */}
      <div className="rounded-xl bg-[#163428] border border-[#285240] px-3.5 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="min-w-0 flex-1 flex flex-col gap-0.5">
          <div
            className="text-[13px] font-bold text-[#FFD84D] leading-snug"
            dangerouslySetInnerHTML={{
              __html: typesetMathHtml(evalResult.equationHtml, lab.subj),
            }}
          />
          <p className="text-[12px] text-[#CBE4D7] leading-snug">
            {evalResult.observationNote}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleResetSliders}
            className="min-h-[34px] px-2.5 rounded-lg bg-[#24493B] hover:bg-[#2E5B4A] border border-[#33604E] text-[12px] font-bold text-[#E7EFEA] cursor-pointer whitespace-nowrap"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleLogReading}
            className="min-h-[34px] px-3 rounded-lg bg-[#FFC531] hover:brightness-105 text-[#10261D] text-[12px] font-extrabold shadow-[0_2px_0_#B58407] cursor-pointer whitespace-nowrap"
          >
            + Log reading
          </button>
        </div>
      </div>

      {/* Multi-Trial Observation Data Logger Table + WAEC Slope / Mean Readout */}
      {trials.length > 0 && (
        <div className="rounded-xl bg-[#0C1D16] border border-[#285240] p-3 flex flex-col gap-2 anim-rise">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2 text-[11.5px] font-bold text-[#9ED6B5] tabular-nums">
              <span>
                Readings ({trials.length})
              </span>
              {trialStats.meanY !== null && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#3BDC86]">
                    Mean: {trialStats.meanY.toFixed(2)}
                    {evalResult.primaryUnit ? ` ${evalResult.primaryUnit}` : ''}
                  </span>
                </>
              )}
              {trialStats.slope !== null && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#FFC531]">
                    Slope (Δy/Δx): {trialStats.slope.toFixed(3)}
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const report = formatLabReportText(
                    lab.name.replace(/<[^>]+>/g, ''),
                    evalResult.primaryLabel,
                    trials,
                    trialStats
                  );
                  navigator.clipboard?.writeText(report).then(
                    () => {
                      setCopiedLog(true);
                      window.setTimeout(() => setCopiedLog(false), 1800);
                    },
                    () => {}
                  );
                }}
                className="text-[11.5px] font-bold text-[#38BDF8] hover:underline cursor-pointer whitespace-nowrap"
              >
                {copiedLog ? 'Copied' : 'Copy table'}
              </button>
              <button
                type="button"
                onClick={() => setTrials([])}
                className="text-[11.5px] font-bold text-[#FCA5A5] hover:underline cursor-pointer whitespace-nowrap"
              >
                Clear
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px] tabular-nums border-collapse">
              <thead>
                <tr className="border-b border-[#24493B] text-[#9ED6B5]">
                  <th className="py-1.5 pr-2 font-bold">#</th>
                  <th className="py-1.5 pr-3 font-bold">Inputs</th>
                  <th className="py-1.5 pr-3 font-bold">{evalResult.primaryLabel}</th>
                  <th className="py-1.5 font-bold">State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A382B]">
                {trials.map((tr) => (
                  <tr key={tr.trialNo}>
                    <td className="py-1.5 pr-2 font-extrabold text-[#FFC531]">{tr.trialNo}</td>
                    <td className="py-1.5 pr-3 text-[#D6E8DF]">{tr.inputsSummary}</td>
                    <td className="py-1.5 pr-3 font-bold text-[#3BDC86]">{tr.primaryOutput}</td>
                    <td className="py-1.5 text-[#B9CCC1]">{tr.statusLabel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}

function extractLabEquipmentList(lab: LabItem, stepsSayJoined: string): string[] {
  const hay = `${lab.name} ${lab.blurb} ${stepsSayJoined}`.toLowerCase();
  if (lab.subj === 'chem') {
    const candidates: [RegExp, string][] = [
      [/burette/, '50 cm³ Burette & Stand'],
      [/pipette/, '25.0 cm³ Bulb Pipette'],
      [/conical flask/, 'Conical Flask & White Tile'],
      [/indicator|phenolphthalein|methyl orange/, 'Acid–Base Indicator'],
      [/beaker/, 'Borosilicate Beaker'],
      [/funnel/, 'Filter Funnel'],
      [/filter paper/, 'Filter Paper'],
      [/evaporating dish/, 'Porcelain Evaporating Dish'],
      [/bunsen|flame|heat/, 'Bunsen Burner & Tripod'],
      [/test tube|boiling tube/, 'Test Tubes & Rack'],
      [/dropper|dropping/, 'Reagent Dropper'],
      [/electrode|cathode|anode/, 'Inert Carbon Electrodes & DC Cell'],
      [/gas jar|trough/, 'Gas Jar & Delivery Tube'],
      [/thermometer/, '0–110 °C Thermometer'],
      [/chromatography|solvent/, 'Chromatography Paper & Chamber'],
      [/condenser|distill/, 'Liebig Condenser & Still Head'],
      [/volumetric flask/, '250 cm³ Volumetric Flask'],
      [/balance|weigh/, 'Electronic Analytical Balance'],
    ];
    const matched = candidates.filter(([re]) => re.test(hay)).map(([, label]) => label);
    return matched.length > 0
      ? matched.slice(0, 6)
      : ['Borosilicate Glassware', 'Measured Reagents', 'Lab Safety Bench'];
  }
  if (lab.subj === 'phys') {
    const candidates: [RegExp, string][] = [
      [/vernier|caliper/, 'Vernier Calipers (0.01 cm)'],
      [/micrometer/, 'Micrometer Screw Gauge'],
      [/pendulum|bob|string/, 'Retort Stand, Thread & Brass Bob'],
      [/stop\s*watch|oscillation|period/, 'Digital Stopwatch'],
      [/spring|hooke|pointer/, 'Helical Spring & Slotted Masses'],
      [/metre rule|knife\s*edge|pivot/, 'Uniform Metre Rule & Knife-Edge'],
      [/calorimeter|lagged/, 'Lagged Copper Calorimeter & Stirrer'],
      [/thermometer/, 'Mercury-in-Glass Thermometer'],
      [/prism|pins|glass block/, 'Optical Block / Prism & Search Pins'],
      [/lens|screen|illuminated/, 'Converging Lens, Holder & Screen'],
      [/ammeter|voltmeter|rheostat|ohm/, 'DC Source, Ammeter, Voltmeter & Rheostat'],
      [/jockey|bridge|potentiometer|galvanometer/, '100 cm Resistance Wire, Jockey & Galvanometer'],
      [/tuning fork|resonance/, 'Tuning Fork & Resonance Tube'],
    ];
    const matched = candidates.filter(([re]) => re.test(hay)).map(([, label]) => label);
    return matched.length > 0
      ? matched.slice(0, 6)
      : ['Calibrated Scale', 'Retort Stand', 'Precision Timing / Meter'];
  }
  if (lab.subj === 'bio') {
    const candidates: [RegExp, string][] = [
      [/microscope|slide|coverslip|stain/, 'Compound Light Microscope & Coverslip'],
      [/osmosis|yam|potato|sucrose|turgid/, 'Yam Cylinders, Cork Borer & Sucrose Baths'],
      [/iodine|benedict|biuret|million|sudan|emulsion/, 'Iodine, Benedict’s & Biuret Reagents'],
      [/water\s*bath|boil|ethanol|methylated/, 'Thermostated Water Bath & Ethanol'],
      [/potometer|transpir|vaseline|shoot/, 'Bubble Potometer, Capillary Scale & Vaseline'],
      [/elodea|hydrilla|funnel|pondweed/, 'Submerged Pondweed, Funnel & Glowing Splint'],
      [/limewater|bicarbonate|germinat|soda lime/, 'Respiration Flasks & Fresh Limewater'],
      [/ptyalin|saliva|amylase|37/, '37 °C Water Bath, Spotting Tile & Dropper'],
      [/quadrat|transect|throw/, '1 m × 1 m Metal Quadrat Frame & Tally Sheet'],
      [/soil|measuring cylinder|humus|crucible/, 'Measuring Cylinders, Filter Funnel & Crucible'],
      [/flower|hibiscus|scalpel|hand lens|vertebra/, 'Hand Lens (×10), Forceps & Sharp HB Pencil'],
      [/mendel|bead|allele|ratio/, 'Coloured Genetic Beads & Tally Beakers'],
    ];
    const matched = candidates.filter(([re]) => re.test(hay)).map(([, label]) => label);
    return matched.length > 0
      ? matched.slice(0, 6)
      : ['Specimen Stage', 'Hand Lens (×10)', 'Reagent Bench & Sharp HB Pencil'];
  }
  if (lab.subj === 'agric') {
    const candidates: [RegExp, string][] = [
      [/sediment|jar|horizon|soil/, 'Measuring Cylinder, Calgon Dispersant & Soil Auger'],
      [/ph|lime|indicator|barium/, 'Soil pH Meter, Universal Indicator & Porcelain Tile'],
      [/poros|percolat|funnel|water-hold/, 'Filter Funnels, Cotton Plugs & Graduated Cylinders'],
      [/seed|tetrazolium|petri|germinat/, 'Petri Dishes, Moist Filter Paper & Tetrazolium'],
      [/bud|graft|scion|stock/, 'Budding Knife, Grafting Tape & Healthy Scion'],
      [/npk|fertilizer|plot|yield/, 'Calibrated Weighing Scale, NPK Granules & Plot Pegs'],
      [/sprayer|nozzle|swath/, 'Knapsack Sprayer, Stopwatch & Calibration Jug'],
      [/rumen|gizzard|crop|tract/, 'Dissecting Tray, Hand Lens (×10) & Specimen Labels'],
      [/candl|egg|incubat/, 'Darkroom Candling Lamp, Thermometer & Hygrometer'],
      [/pearson|ration|maize|groundnut/, 'Feed Scoops, Platform Scale & Ration Worksheet'],
      [/pond|secchi|dissolved/, 'Secchi Disc, DO/pH Test Kit & Plankton Net'],
      [/chain|gunter|ranging|offset/, 'Gunter’s Chain, Ranging Poles, Arrows & Cross-Staff'],
    ];
    const matched = candidates.filter(([re]) => re.test(hay)).map(([, label]) => label);
    return matched.length > 0
      ? matched.slice(0, 6)
      : ['Agronomy Field Kit', 'Calibrated Scale', 'Specimen & Soil Bench'];
  }
  const mathTools: [RegExp, string][] = [
    [/ruler|straight line|join/, ' Millimetre Straightedge Ruler'],
    [/compass|arc|radius|circle/, 'Precision Pair of Compasses'],
    [/protractor|clockwise|65°/, '180° Semi-Circular Protractor'],
    [/table|axes|curve|plot|bar|ogive/, 'Calibrated Coordinate Axes'],
    [/sharp|pencil|dot|cross/, 'Sharp 2H Drafting Pencil'],
  ];
  const matched = mathTools.filter(([re]) => re.test(hay)).map(([, label]) => label.trim());
  return matched.length > 0 ? matched : ['Straightedge Ruler', 'Pair of Compasses', '2H Drafting Pencil'];
}

export function LabListScreen({
  subj,
  flags = {},
  onBack,
  onOpenLabItem,
  onOpenFormulas,
}: {
  subj: SubjectId;
  flags?: Record<string, number>;
  onBack: () => void;
  onOpenLabItem: (id: string) => void;
  onOpenFormulas?: () => void;
}) {
  const [catFilter, setCatFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [expandAllGroups, setExpandAllGroups] = useState(false);

  useEffect(() => {
    setCatFilter('all');
    setSearchQuery('');
    setExpandedGroups({});
    setExpandAllGroups(false);
  }, [subj]);

  const labs = getLabsForSubject(subj);
  const completedCount = useMemo(
    () => labs.filter((item) => !!flags[`lab:${item.id}`]).length,
    [labs, flags]
  );
  const recommendedLab = useMemo(
    () => labs.find((item) => !flags[`lab:${item.id}`]) || labs[0],
    [labs, flags]
  );

  const catTabs = useMemo(() => {
    const out: { id: string; label: string; count: number }[] = [
      { id: 'all', label: 'All', count: labs.length },
    ];
    if (subj === 'chem') {
      for (const [k, fullTitle] of Object.entries(CLAB_CATS)) {
        const count = labs.filter((x) => String(x.cat) === k).length;
        if (count > 0) {
          out.push({ id: k, label: CHEM_CAT_SHORT[k] || fullTitle, count });
        }
      }
    } else if (subj === 'phys') {
      for (const [k, fullTitle] of Object.entries(PLAB_CATS)) {
        const count = labs.filter((x) => String(x.cat) === k).length;
        if (count > 0) {
          out.push({ id: k, label: PHYS_CAT_SHORT[k] || fullTitle, count });
        }
      }
    } else if (subj === 'bio') {
      for (const [k, fullTitle] of Object.entries(BLAB_CATS)) {
        const count = labs.filter((x) => String(x.cat) === k).length;
        if (count > 0) {
          out.push({ id: k, label: BIO_CAT_SHORT[k] || fullTitle, count });
        }
      }
    } else if (subj === 'agric') {
      for (const [k, fullTitle] of Object.entries(ALAB_CATS)) {
        const count = labs.filter((x) => String(x.cat) === k).length;
        if (count > 0) {
          out.push({ id: k, label: AGRIC_CAT_SHORT[k] || fullTitle, count });
        }
      }
    } else {
      for (const [k, fullTitle] of Object.entries(LAB_CATS)) {
        const count = labs.filter((x) => String(x.cat || 1) === String(k)).length;
        if (count > 0) {
          out.push({ id: String(k), label: String(fullTitle), count });
        }
      }
    }
    return out;
  }, [labs, subj]);

  const filteredLabs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return labs.filter((item) => {
      const catKey =
        subj === 'chem' || subj === 'phys' || subj === 'bio' || subj === 'agric'
          ? String(item.cat)
          : String(item.cat || 1);
      if (catFilter !== 'all' && catKey !== catFilter) return false;
      if (!q) return true;
      const hay = `${item.name} ${item.blurb} ${item.tip || ''}`
        .replace(/<[^>]+>/g, ' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [labs, subj, catFilter, searchQuery]);

  const groups = useMemo(() => {
    const map: { title: string; items: LabItem[] }[] = [];
    for (const item of filteredLabs) {
      const catTitle =
        subj === 'chem'
          ? (CLAB_CATS as Record<string, string>)[String(item.cat)] || 'Practicals'
          : subj === 'phys'
            ? (PLAB_CATS as Record<string, string>)[String(item.cat)] || 'Practicals'
            : subj === 'bio'
              ? (BLAB_CATS as Record<string, string>)[String(item.cat)] || 'Practicals'
              : subj === 'agric'
                ? (ALAB_CATS as Record<string, string>)[String(item.cat)] || 'Practicals'
                : LAB_CATS[Number(item.cat) || 1] || 'Constructions';
      let g = map.find((x) => x.title === catTitle);
      if (!g) {
        g = { title: catTitle, items: [] };
        map.push(g);
      }
      g.items.push(item);
    }
    return map;
  }, [filteredLabs, subj]);

  const isPracticalSubj =
    subj === 'chem' || subj === 'phys' || subj === 'bio' || subj === 'agric';
  const isFiltering = searchQuery.trim().length > 0 || catFilter !== 'all';

  const defaultOpenGroupTitle = useMemo(() => {
    const firstWithPending = groups.find((g) => g.items.some((it) => !flags[`lab:${it.id}`]));
    return firstWithPending?.title || groups[0]?.title || '';
  }, [groups, flags]);

  const hasExplicitToggle = Object.keys(expandedGroups).length > 0;
  const isGroupExpanded = (title: string): boolean => {
    if (isFiltering || expandAllGroups) return true;
    if (hasExplicitToggle) return Boolean(expandedGroups[title]);
    return title === defaultOpenGroupTitle;
  };

  if (subj === 'econ' || subj === 'eng') {
    return null;
  }

  return (
    <div className="flex flex-col gap-5 anim-rise">
      <SubscreenTopBar
        title="Labs"
        subtitle={`${SUBJECT_INFO[subj].name} · ${completedCount} of ${labs.length} ${
          isPracticalSubj ? 'practicals' : 'constructions'
        } completed`}
        onBack={onBack}
        right={
          onOpenFormulas && subj !== 'bio' && subj !== 'agric' ? (
            <button
              type="button"
              onClick={onOpenFormulas}
              className="min-h-[38px] px-3.5 rounded-xl bg-[var(--gold)] text-[var(--on-acc)] text-[12.5px] font-bold flex items-center gap-1.5 shadow-[0_2px_0_var(--acc-d)] cursor-pointer whitespace-nowrap shrink-0"
            >
              <Icon name="sigma" size={15} />
              <span>Formulas</span>
            </button>
          ) : undefined
        }
      />

      {/* Calm Spotlight: Recommended Next Practical (~3 min) */}
      {recommendedLab && (
        <section className="rounded-2xl bg-[var(--card)] border-2 border-[var(--gold)] shadow-[0_4px_0_var(--acc-line)] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <span className="w-12 h-12 rounded-2xl bg-[#1C3D31] text-[#FFC531] flex items-center justify-center shrink-0 shadow-[0_2px_0_#10261D]">
              <LabGlyph id={recommendedLab.id} size={25} />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[12px] font-bold">
                <span className="text-[var(--gold)]">Next {isPracticalSubj ? 'practical' : 'construction'}</span>
                <span aria-hidden="true" className="text-[var(--dim)]">·</span>
                <span className="text-[var(--green)] font-bold">~3 min interactive bench</span>
              </div>
              <h2 className="h20 text-[var(--ink)] mt-0.5 truncate">{recommendedLab.name}</h2>
              <p
                className="text-[13.5px] text-[var(--dim)] truncate mt-0.5"
                dangerouslySetInnerHTML={{ __html: recommendedLab.blurb }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenLabItem(recommendedLab.id)}
            className="btn-tactile indigo min-h-[42px] px-4 text-[13.5px] whitespace-nowrap shrink-0"
          >
            <span>Open workbench</span>
            <Icon name="go" size={16} />
          </button>
        </section>
      )}

      {/* Category Filter + Search Bar */}
      <div className="rounded-2xl bg-[var(--card)] border border-[var(--line)] shadow-[0_2px_0_var(--line)] p-4 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <span className="text-[12.5px] font-bold text-[var(--dim)]">
            Filter by {isPracticalSubj ? 'category' : 'group'} ({filteredLabs.length} shown)
          </span>
          <div className="relative sm:w-[300px] shrink-0">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label={
                subj === 'chem'
                  ? 'Search Chemistry practicals'
                  : subj === 'phys'
                    ? 'Search Physics practicals'
                    : subj === 'bio'
                      ? 'Search Biology practicals'
                      : subj === 'agric'
                        ? 'Search Agricultural Science practicals'
                        : 'Search Maths constructions'
              }
              placeholder={
                subj === 'chem'
                  ? 'Search titration, ammonia, anions...'
                  : subj === 'phys'
                    ? 'Search vernier, pendulum, lens, Ohm...'
                    : subj === 'bio'
                      ? 'Search microscope, osmosis, food test, quadrat...'
                      : subj === 'agric'
                        ? 'Search soil pH, NPK, Pearson Square, candling...'
                        : 'Search bisect, locus, triangle...'
              }
              className="w-full min-h-[38px] pl-3.5 pr-9 rounded-xl bg-[var(--bg)] border border-[var(--line)] focus:border-[var(--gold)] focus:bg-[var(--card)] text-[13.5px] font-medium text-[var(--ink)] outline-none transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear lab search"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md text-[var(--dim)] hover:text-[var(--ink)] flex items-center justify-center cursor-pointer"
              >
                <Icon name="x" size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="overflow-x-auto max-w-full pb-0.5">
            <LiquidCapsuleBar
              roleType="group"
              size="sm"
              pillRadiusPx={999}
              ariaLabel="Filter lab experiments by category"
              items={catTabs.map((tab) => ({
                id: tab.id,
                label: `${tab.label} (${tab.count})`,
              }))}
              value={catFilter}
              onChange={setCatFilter}
            />
          </div>

          {!isFiltering && groups.length > 1 && (
            <button
              type="button"
              onClick={() => {
                setExpandAllGroups((v) => !v);
                setExpandedGroups({});
              }}
              className="min-h-[32px] px-3 rounded-lg bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--acc-line)] text-[12px] font-bold text-[var(--dim)] hover:text-[var(--ink)] transition cursor-pointer whitespace-nowrap shrink-0"
            >
              {expandAllGroups ? 'Focus current group' : `Expand all ${groups.length} groups`}
            </button>
          )}
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="rounded-2xl bg-[var(--card)] border border-[var(--line)] p-6 text-center flex flex-col items-center gap-3">
          <p className="text-[15px] font-semibold text-[var(--ink)]">
            No {isPracticalSubj ? 'practicals' : 'constructions'} matched “{searchQuery}”.
          </p>
          <button
            type="button"
            onClick={() => {
              setCatFilter('all');
              setSearchQuery('');
            }}
            className="btn-tactile paper min-h-[38px] px-4 text-[13.5px] whitespace-nowrap"
          >
            <span>Reset filters</span>
          </button>
        </div>
      ) : (
        <SmoothViewSwitch viewKey={catFilter} className="flex flex-col gap-3">
          {groups.map((group) => {
            const open = isGroupExpanded(group.title);
            const groupDone = group.items.filter((it) => !!flags[`lab:${it.id}`]).length;
            return (
              <section
                key={group.title}
                className="rounded-2xl bg-[var(--card)] border border-[var(--line)] shadow-[0_2px_0_var(--line)] overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => {
                    if (expandAllGroups) {
                      const nextMap: Record<string, boolean> = {};
                      for (const g of groups) {
                        nextMap[g.title] = g.title !== group.title;
                      }
                      setExpandAllGroups(false);
                      setExpandedGroups(nextMap);
                    } else if (isFiltering) {
                      setExpandedGroups((prev) => ({
                        ...prev,
                        [group.title]: !open,
                      }));
                    } else {
                      setExpandedGroups(open ? { [group.title]: false } : { [group.title]: true });
                    }
                  }}
                  className="w-full px-3.5 sm:px-4 py-3 flex items-center justify-between gap-3 text-left hover:bg-[var(--bg)]/60 transition cursor-pointer"
                >
                  <div>
                    <h2 className="h18 text-[var(--ink)]">{group.title}</h2>
                    <p className="text-[12px] text-[var(--dim)] mt-0.5">
                      {group.items.length}{' '}
                      {group.items.length === 1
                        ? isPracticalSubj
                          ? 'practical'
                          : 'construction'
                        : isPracticalSubj
                          ? 'practicals'
                          : 'constructions'}{' '}
                      (~3 min each)
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[12.5px] font-extrabold tabular-nums ${
                        groupDone === group.items.length && group.items.length > 0
                          ? 'text-[var(--green)]'
                          : groupDone > 0
                            ? 'text-[var(--gold)]'
                            : 'text-[var(--dim)]'
                      }`}
                    >
                      {group.items.length ? Math.round((groupDone / group.items.length) * 100) : 0}%
                    </span>
                    <span className="w-6 h-6 rounded-md bg-[var(--bg)] border border-[var(--line)] flex items-center justify-center text-[var(--dim)]">
                      <Icon
                        name="go"
                        size={13}
                        className={`transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
                      />
                    </span>
                  </div>
                </button>

                <SmoothCollapse open={open}>
                  <div className="px-3.5 sm:px-4 pb-3.5 pt-2 border-t border-[var(--line)]/70 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {group.items.map((item) => {
                      const isDone = !!flags[`lab:${item.id}`];
                      const stepCount = item.steps().length;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => onOpenLabItem(item.id)}
                          className={`study-card text-left rounded-xl border px-3 py-2.5 sm:px-3.5 sm:py-3 flex items-center gap-3 cursor-pointer ${
                            isDone
                              ? 'bg-[var(--ok-soft)]/50 border-[var(--ok-line)]'
                              : 'bg-[var(--bg)]/55 border-[var(--line)] hover:border-[var(--acc-line)] hover:bg-[var(--card)]'
                          }`}
                        >
                          <span className="w-9 h-9 rounded-lg bg-[#1C3D31] text-[#FFC531] flex items-center justify-center shrink-0 shadow-[0_2px_0_#10261D]">
                            <LabGlyph id={item.id} size={20} />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="font-[var(--display)] font-bold text-[14.5px] text-[var(--ink)] leading-snug">
                              {item.name}
                            </div>
                            <div
                              className="text-[12px] text-[var(--dim)] truncate mt-0.5"
                              dangerouslySetInnerHTML={{ __html: item.blurb }}
                            />
                            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--dim)] mt-0.5 tabular-nums">
                              <span>{stepCount} steps</span>
                              <span aria-hidden="true">·</span>
                              <span>+Viva check</span>
                              {isDone && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <span className="text-[var(--green)] font-bold">Completed</span>
                                </>
                              )}
                            </div>
                          </div>
                          <Icon
                            name={isDone ? 'check' : 'go'}
                            size={15}
                            className={isDone ? 'text-[var(--green)] shrink-0' : 'text-[var(--dim)] shrink-0'}
                          />
                        </button>
                      );
                    })}
                  </div>
                </SmoothCollapse>
              </section>
            );
          })}
        </SmoothViewSwitch>
      )}
    </div>
  );
}

export function LabPlayerScreen({
  lab,
  muted,
  onBack,
  onCompleteLab,
}: {
  lab: LabItem;
  muted: boolean;
  onBack: () => void;
  onCompleteLab?: (labId: string) => void;
}) {
  const steps = useMemo(() => lab.steps(), [lab]);
  const [stepIdx, setStepIdx] = useState(0);
  const [stepDir, setStepDir] = useState<'fwd' | 'back'>('fwd');
  const [replayTick, setReplayTick] = useState(0);
  const [animPaused, setAnimPaused] = useState(false);
  const [animFinished, setAnimFinished] = useState(false);
  const [fxOn, setFxOn] = useState(true);
  const [zoomed, setZoomed] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showEquipment, setShowEquipment] = useState(false);
  const [vivaPicked, setVivaPicked] = useState<number | null>(null);
  const [vivaEliminated, setVivaEliminated] = useState<Record<number, boolean>>({});

  const svgHostRef = useRef<HTMLDivElement | null>(null);
  const tlSvgRef = useRef<SVGSVGElement | null>(null);
  const foleyStopRef = useRef<(() => void) | null>(null);
  const remainingMsRef = useRef<number>(2000);
  const startedAtRef = useRef<number>(0);
  const completedLabRef = useRef<string | null>(null);

  const isChem = lab.subj === 'chem';
  const isPhys = lab.subj === 'phys';
  const isBio = lab.subj === 'bio';
  const isAgric = lab.subj === 'agric';
  const cleanLabName = useMemo(() => lab.name.replace(/<[^>]+>/g, ''), [lab.name]);
  const rendered = useMemo(() => renderLabSvg(lab, stepIdx), [lab, stepIdx, replayTick]);
  const currentStep = steps[stepIdx] || steps[0];
  const isLast = stepIdx >= steps.length - 1;
  const fxActive = fxOn && !muted;
  const vivaCheck = useMemo(() => getLabVivaCheck(lab), [lab]);
  const vivaExplainScript = useMemo(
    () =>
      htmlToSpeakableChem(
        `Practical Viva explanation for ${cleanLabName}: ${vivaCheck.explanationHtml}`
      ),
    [cleanLabName, vivaCheck.explanationHtml]
  );

  const equipmentList = useMemo(
    () => extractLabEquipmentList(lab, steps.map((s) => s.say).join(' ')),
    [lab, steps]
  );

  // Pre-compute speech scripts for every step in this lab so tapping Teach once
  // pre-synthesizes the entire practical and teaches seamlessly as the student advances!
  const allStepScripts = useMemo(
    () =>
      steps.map((s, idx) =>
        extractLabStepSpeechScript(
          cleanLabName,
          idx,
          s,
          lab.tip,
          idx === steps.length - 1,
          lab.subj
        )
      ),
    [cleanLabName, lab.subj, lab.tip, steps]
  );

  useEffect(() => {
    if (isLast && completedLabRef.current !== lab.id) {
      completedLabRef.current = lab.id;
      onCompleteLab?.(lab.id);
    }
  }, [isLast, lab.id, onCompleteLab]);

  const labVoiceContext = useMemo(() => {
    if (!currentStep) return null;
    return {
      topicName: cleanLabName,
      sectionName: isChem
        ? 'Chemistry Practicals Lab'
        : isPhys
          ? 'Physics Practicals Lab'
          : isBio
            ? 'Biology Practicals Lab'
            : isAgric
              ? 'Agricultural Science Practicals Lab'
              : 'Maths Constructions Lab',
      partTitle: `Step ${stepIdx + 1} of ${steps.length}`,
      stepLabel: `${isChem || isPhys || isBio || isAgric ? 'Experiment' : 'Construction'} Step ${stepIdx + 1}`,
      stepText: allStepScripts[stepIdx] || '',
      examTrap: lab.tip,
    };
  }, [allStepScripts, cleanLabName, currentStep, isAgric, isBio, isChem, isPhys, lab.tip, stepIdx, steps.length]);

  const setSvgAnimationsPaused = (pause: boolean) => {
    const stageSvg = svgHostRef.current?.querySelector('svg') as
      | (SVGSVGElement & { pauseAnimations?: () => void; unpauseAnimations?: () => void })
      | null;
    const tlSvg = tlSvgRef.current as
      | (SVGSVGElement & { pauseAnimations?: () => void; unpauseAnimations?: () => void })
      | null;
    try {
      if (pause) {
        stageSvg?.pauseAnimations?.();
        tlSvg?.pauseAnimations?.();
      } else {
        stageSvg?.unpauseAnimations?.();
        tlSvg?.unpauseAnimations?.();
      }
    } catch {
      /* ignore */
    }
  };

  // Reset step when lab changes
  useEffect(() => {
    setStepIdx(0);
    setStepDir('fwd');
    setAnimPaused(false);
    setAnimFinished(false);
    setReplayTick(0);
    setZoomed(false);
    setVivaPicked(null);
    setVivaEliminated({});
  }, [lab.id]);

  // Reset pause/finished timer on every new step or replay
  useEffect(() => {
    setAnimPaused(false);
    setAnimFinished(false);
    remainingMsRef.current = Math.max(450, Math.round(rendered.dur * 1000));
    startedAtRef.current = performance.now();

    const stageSvg = svgHostRef.current?.querySelector('svg') as
      | (SVGSVGElement & { setCurrentTime?: (t: number) => void; unpauseAnimations?: () => void })
      | null;
    const tlSvg = tlSvgRef.current as
      | (SVGSVGElement & { setCurrentTime?: (t: number) => void; unpauseAnimations?: () => void })
      | null;
    try {
      stageSvg?.setCurrentTime?.(0);
      stageSvg?.unpauseAnimations?.();
      tlSvg?.setCurrentTime?.(0);
      tlSvg?.unpauseAnimations?.();
    } catch {
      /* ignore */
    }
  }, [lab.id, stepIdx, replayTick, rendered.dur]);

  // Track when the current step's drawing animation completes so Pause switches cleanly to Play
  useEffect(() => {
    if (animPaused || animFinished) return;
    startedAtRef.current = performance.now();
    const timer = window.setTimeout(() => {
      remainingMsRef.current = 0;
      setAnimFinished(true);
    }, Math.max(80, remainingMsRef.current));
    return () => window.clearTimeout(timer);
  }, [animPaused, animFinished, lab.id, stepIdx, replayTick]);

  // Schedule synchronized Lab foley acoustics when step starts/replays
  useEffect(() => {
    foleyStopRef.current?.();
    foleyStopRef.current = null;
    if (!fxActive) return;
    const cues = getLabStepAudioCues(lab, stepIdx);
    const cleanup = playLabFoleySchedule(cues, false);
    foleyStopRef.current = cleanup;
    return () => {
      cleanup();
      foleyStopRef.current = null;
    };
  }, [lab, stepIdx, replayTick, fxActive]);

  const handleTogglePause = () => {
    if (animFinished) {
      setReplayTick((n) => n + 1);
      return;
    }
    if (!animPaused) {
      const elapsed = performance.now() - startedAtRef.current;
      remainingMsRef.current = Math.max(80, remainingMsRef.current - elapsed);
      foleyStopRef.current?.();
      setSvgAnimationsPaused(true);
      setAnimPaused(true);
    } else {
      startedAtRef.current = performance.now();
      setSvgAnimationsPaused(false);
      setAnimPaused(false);
    }
  };

  // Keyboard ArrowLeft / ArrowRight navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setStepDir('fwd');
        setStepIdx((i) => (i >= steps.length - 1 ? 0 : i + 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setStepDir('back');
        setStepIdx((i) => Math.max(0, i - 1));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [steps.length]);

  const stepAnimCls = stepDir === 'fwd' ? 'anim-step-fwd' : 'anim-step-back';

  return (
    <div className="flex flex-col gap-4 anim-rise">
      <SubscreenTopBar
        title={cleanLabName}
        subtitle={`${
          isChem
            ? 'Chemistry Practical'
            : isPhys
              ? 'Physics Practical'
              : isBio
                ? 'Biology Practical'
                : isAgric
                  ? 'Agricultural Science Practical'
                  : 'Maths Construction'
        } · Step ${stepIdx + 1} of ${steps.length}`}
        onBack={onBack}
      />

      {/* One-Tap Continuous Studio Voice Tutor */}
      {labVoiceContext && (
        <ChemMadScientistBar
          mode={isChem ? 'chem' : isAgric ? 'agric' : isBio ? 'bio' : isPhys ? 'phys' : 'mathLab'}
          muted={muted}
          sessionKey={`lab-session|${lab.id}`}
          stepKey={vivaPicked !== null ? `${lab.id}|viva-${vivaPicked}` : `${lab.id}|${stepIdx}`}
          upcomingScripts={[
            ...allStepScripts.filter((_, idx) => idx !== stepIdx),
            vivaExplainScript,
          ]}
          context={
            vivaPicked !== null
              ? {
                  ...labVoiceContext,
                  stepLabel: 'Practical Viva Explanation',
                  stepText: vivaExplainScript,
                }
              : labVoiceContext
          }
        />
      )}

      {/* Single-Mount Responsive Workbench */}
      <div className="grid grid-cols-1 min-[980px]:grid-cols-12 gap-5 items-start">
        {/* Precision Stage + Workbench HUD + Transport Controls + Interactive Instrument Deck */}
        <div className="order-1 min-[980px]:order-2 min-[980px]:col-span-7 flex flex-col gap-4 min-w-0">
          <div className="rounded-[24px] bg-[var(--card)] border border-[var(--line)] shadow-[0_4px_0_var(--line)] p-3.5 flex flex-col gap-2.5">
            {/* Precision Workbench Header HUD */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-1">
              <div className="flex items-center gap-2 text-[12px] font-bold text-[var(--dim)]">
                <span className="text-[var(--ink)] font-extrabold">
                  {isChem
                    ? 'Apparatus Bench'
                    : isPhys
                      ? 'Optical & Meter Bench'
                      : isBio
                        ? 'Specimen & Assay Bench'
                        : isAgric
                          ? 'Agronomy & Farm Assay Bench'
                          : 'Drafting Slate'}
                </span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">
                  Step {stepIdx + 1}/{steps.length}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  aria-pressed={showEquipment}
                  onClick={() => setShowEquipment((v) => !v)}
                  className={`min-h-[30px] px-2.5 rounded-lg text-[11.5px] font-bold border transition cursor-pointer whitespace-nowrap shrink-0 ${
                    showEquipment
                      ? 'bg-[var(--acc-soft)] border-[var(--acc-line)] text-[var(--gold)]'
                      : 'bg-[var(--bg)] border-[var(--line)] text-[var(--dim)] hover:text-[var(--ink)]'
                  }`}
                >
                  {isChem || isPhys || isBio || isAgric ? 'Apparatus' : 'Instruments'} ({equipmentList.length})
                </button>

                <button
                  type="button"
                  aria-pressed={showGrid}
                  onClick={() => setShowGrid((v) => !v)}
                  className={`min-h-[30px] px-2.5 rounded-lg text-[11.5px] font-bold border transition cursor-pointer whitespace-nowrap shrink-0 ${
                    showGrid
                      ? 'bg-[var(--acc-soft)] border-[var(--acc-line)] text-[var(--gold)]'
                      : 'bg-[var(--bg)] border-[var(--line)] text-[var(--dim)] hover:text-[var(--ink)]'
                  }`}
                >
                  Grid: {showGrid ? 'On' : 'Off'}
                </button>

                <button
                  type="button"
                  aria-pressed={zoomed}
                  onClick={() => setZoomed((v) => !v)}
                  className={`min-h-[30px] px-2.5 rounded-lg text-[11.5px] font-bold border transition cursor-pointer whitespace-nowrap shrink-0 ${
                    zoomed
                      ? 'bg-[var(--gold)] border-[var(--gold)] text-[var(--on-acc)]'
                      : 'bg-[var(--bg)] border-[var(--line)] text-[var(--dim)] hover:text-[var(--ink)]'
                  }`}
                >
                  {zoomed ? '1.25× Inspect' : '1× Fit'}
                </button>
              </div>
            </div>

            {/* Collapsible Apparatus & Instruments Tray */}
            {showEquipment && (
              <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] px-3 py-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12px] anim-rise">
                <span className="font-bold text-[11.5px] text-[var(--gold)]">
                  {isChem || isPhys || isBio || isAgric ? 'Bench setup:' : 'Tools used:'}
                </span>
                {equipmentList.map((eq, idx) => (
                  <span key={eq} className="font-semibold text-[var(--ink)] inline-flex items-center gap-1.5">
                    {idx > 0 && (
                      <span aria-hidden="true" className="text-[var(--dim)]">
                        ·
                      </span>
                    )}
                    <span>{eq}</span>
                  </span>
                ))}
              </div>
            )}

            {/* Animated SVG Workbench Stage */}
            <div
              key={`${lab.id}-${stepIdx}-${replayTick}`}
              ref={svgHostRef}
              className={`fig lb-fig ${isLast ? 'lb-done' : ''} ${animPaused ? 'lb-paused' : ''} ${
                !showGrid ? 'lb-grid-off' : ''
              } ${zoomed ? 'lb-zoomed' : ''}`}
            >
              <div className="w-full" dangerouslySetInnerHTML={{ __html: rendered.svg }} />
            </div>

            {/* Real-time Step Animation Sweep Timeline */}
            <svg
              key={`tl-${lab.id}-${stepIdx}-${replayTick}`}
              ref={tlSvgRef}
              className="w-full h-1.5 rounded-full overflow-hidden"
              viewBox="0 0 400 6"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <rect x="0" y="0" width="400" height="6" fill="var(--deep)" rx="3" />
              <rect x="0" y="0" width="0" height="6" fill={isLast ? 'var(--green)' : 'var(--gold)'} rx="3">
                <animate
                  attributeName="width"
                  from="0"
                  to="400"
                  dur={`${Math.max(0.45, rendered.dur)}s`}
                  fill="freeze"
                />
              </rect>
            </svg>

            {/* Video-Player Transport Controls Beneath the Lab Drawing */}
            <div
              className="flex items-center justify-between gap-2 px-1 pt-0.5"
              role="group"
              aria-label="Animation player controls"
            >
              <button
                type="button"
                onClick={() => setReplayTick((n) => n + 1)}
                aria-label="Replay step animation"
                title="Replay step"
                className="w-10 h-10 rounded-full bg-[var(--bg)] border border-[var(--line)] text-[var(--gold)] hover:bg-[var(--acc-soft)] hover:border-[var(--acc-line)] flex items-center justify-center transition cursor-pointer shrink-0"
              >
                <Icon name="replay" size={18} />
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  disabled={stepIdx === 0}
                  onClick={() => {
                    setStepDir('back');
                    setStepIdx((i) => Math.max(0, i - 1));
                  }}
                  aria-label="Previous step"
                  title="Previous step"
                  className="min-h-[40px] px-3.5 rounded-full bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)] hover:border-[var(--acc-line)] disabled:opacity-35 disabled:cursor-default flex items-center gap-1.5 text-[13px] font-bold transition cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Icon name="skipPrev" size={16} />
                  <span className="hidden sm:inline">Prev</span>
                </button>

                <button
                  type="button"
                  onClick={handleTogglePause}
                  aria-label={
                    animPaused
                      ? 'Resume animation'
                      : animFinished
                        ? 'Play step animation'
                        : 'Pause animation'
                  }
                  title={animPaused ? 'Resume' : animFinished ? 'Play' : 'Pause'}
                  className="w-12 h-12 rounded-full bg-[var(--gold)] text-[var(--on-acc)] shadow-[0_3px_0_var(--acc-d)] active:translate-y-[2px] active:shadow-[0_1px_0_var(--acc-d)] flex items-center justify-center transition cursor-pointer shrink-0"
                >
                  <Icon name={animPaused || animFinished ? 'play' : 'pause'} size={19} />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStepDir('fwd');
                    if (isLast) {
                      setStepIdx(0);
                    } else {
                      setStepIdx((i) => Math.min(steps.length - 1, i + 1));
                    }
                  }}
                  aria-label={isLast ? 'Start over from step 1' : 'Next step'}
                  title={isLast ? 'Start over' : 'Next step'}
                  className="min-h-[40px] px-3.5 rounded-full bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)] hover:border-[var(--acc-line)] flex items-center gap-1.5 text-[13px] font-bold transition cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span className="hidden sm:inline">{isLast ? 'Restart' : 'Next'}</span>
                  <Icon name="skipNext" size={16} />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setFxOn((v) => !v)}
                aria-pressed={fxActive}
                aria-label={fxActive ? 'Sound effects on — click to turn off' : 'Sound effects off — click to turn on'}
                title={fxActive ? 'Sound effects on' : 'Sound effects off'}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition cursor-pointer shrink-0 ${
                  fxActive
                    ? 'bg-[var(--green)] text-white shadow-[0_2px_0_#0A6334]'
                    : 'bg-[var(--deep)] text-[var(--dim)] border border-[var(--line)]'
                }`}
              >
                <Icon name="vol" size={18} />
              </button>
            </div>
          </div>

          {/* Interactive Virtual Instrument, Live Calibration Curve & Data Logger */}
          <InteractiveLabInstrumentDeck lab={lab} />
        </div>

        {/* Left Deck: Active Step Card + Full Interactive Procedure Navigator + Precaution */}
        <div className="order-2 min-[980px]:order-1 min-[980px]:col-span-5 flex flex-col gap-3.5 min-w-0">
          {/* Active Step Card */}
          <div
            key={`${lab.id}-say-${stepIdx}`}
            className={`rounded-2xl bg-[var(--card)] border-2 border-[var(--gold)] shadow-[0_3px_0_var(--acc-line)] p-4 sm:p-5 flex flex-col gap-2 ${stepAnimCls}`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="eyebrow text-[var(--gold)]">
                Active Step {stepIdx + 1} of {steps.length}
              </span>
              <span className="text-[11.5px] font-bold text-[var(--dim)]">
                {stepIdx === 0 ? 'Setup' : isLast ? 'Conclusion & Reading' : 'Observation'}
              </span>
            </div>
            <p
              className="text-[15.5px] sm:text-[16px] leading-relaxed text-[var(--ink)] font-medium"
              dangerouslySetInnerHTML={{ __html: typesetMathHtml(currentStep?.say || '', lab.subj) }}
            />
          </div>

          {/* Practical Precaution / Accuracy Tip */}
          {lab.tip && (
            <div
              className={`rounded-2xl border p-3.5 flex items-start gap-3 ${
                isLast
                  ? 'bg-[var(--ok-soft)] border-[var(--ok-line)] anim-rise'
                  : 'bg-[var(--card)] border-[var(--line)]'
              }`}
            >
              <span
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isLast
                    ? 'bg-[var(--green)] text-white'
                    : 'bg-[var(--acc-soft)] text-[var(--gold)]'
                }`}
              >
                <Icon name={isLast ? 'check' : 'bolt'} size={16} />
              </span>
              <div className="min-w-0">
                <span className={`eyebrow ${isLast ? 'text-[var(--green)]' : 'text-[var(--gold)]'}`}>
                  {isChem || isPhys || isBio || isAgric ? 'Practical Precaution' : 'Construction Accuracy Rule'}
                </span>
                <p
                  className="text-[13.5px] text-[var(--ink)] mt-0.5 leading-snug"
                  dangerouslySetInnerHTML={{ __html: typesetMathHtml(lab.tip, lab.subj) }}
                />
              </div>
            </div>
          )}

          {/* Full Interactive Procedure Log — Click any step to inspect */}
          <div className="rounded-2xl bg-[var(--card)] border border-[var(--line)] shadow-[0_2px_0_var(--line)] p-3.5 flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[12px] font-bold text-[var(--dim)]">
                All steps ({steps.length})
              </span>
              <span className="text-[11.5px] font-semibold text-[var(--dim)]">
                Tap any step to jump
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              {steps.map((s, idx) => {
                const isCurrent = idx === stepIdx;
                const isDoneStep = idx < stepIdx;
                const cleanSay = s.say.replace(/<[^>]+>/g, '');
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (idx !== stepIdx) {
                        setStepDir(idx > stepIdx ? 'fwd' : 'back');
                        setStepIdx(idx);
                      }
                    }}
                    className={`w-full text-left rounded-xl px-3 py-2.5 border flex items-start gap-2.5 transition cursor-pointer ${
                      isCurrent
                        ? 'bg-[var(--acc-soft)]/75 border-[var(--gold)]'
                        : isDoneStep
                          ? 'bg-[var(--ok-soft)]/35 border-[var(--ok-line)]/70 hover:border-[var(--ok-line)]'
                          : 'bg-[var(--bg)]/60 border-[var(--line)] hover:border-[var(--acc-line)]'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full text-[11.5px] font-extrabold flex items-center justify-center shrink-0 mt-0.5 tabular-nums ${
                        isCurrent
                          ? 'bg-[var(--gold)] text-[var(--on-acc)]'
                          : isDoneStep
                            ? 'bg-[var(--green)] text-white'
                            : 'bg-[var(--card)] border border-[var(--line)] text-[var(--dim)]'
                      }`}
                    >
                      {isDoneStep ? '✓' : idx + 1}
                    </span>
                    <span
                      className={`text-[13px] leading-snug line-clamp-2 ${
                        isCurrent
                          ? 'font-bold text-[var(--ink)]'
                          : 'font-medium text-[var(--dim)]'
                      }`}
                    >
                      {cleanSay}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Practical Mastery Viva Check */}
          <section className="rounded-2xl bg-[var(--card)] border border-[var(--line)] shadow-[0_3px_0_var(--line)] p-4 sm:p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <span className="eyebrow text-[var(--gold)]">
                {isChem || isPhys || isBio || isAgric ? 'Practical Mastery Viva Check' : 'Construction Mastery Check'}
              </span>
              <span className="text-[11.5px] font-bold text-[var(--dim)]">
                {vivaPicked !== null ? 'Completed' : 'Test your understanding'}
              </span>
            </div>

            <p
              className="text-[14.5px] font-semibold text-[var(--ink)] leading-snug"
              dangerouslySetInnerHTML={{ __html: typesetMathHtml(vivaCheck.promptHtml, lab.subj) }}
            />

            <div className="flex flex-col gap-2">
              {vivaCheck.options.map((optText, idx) => {
                const answered = vivaPicked !== null;
                const isRightOpt = idx === vivaCheck.answerIdx;
                const isPickedOpt = vivaPicked === idx;
                const isCrossed = !!vivaEliminated[idx] && !answered;

                let stateCls = '';
                if (answered) {
                  if (isRightOpt) stateCls = 'ok';
                  else if (isPickedOpt) stateCls = 'no anim-shake';
                  else stateCls = 'opt-eliminated';
                }

                return (
                  <div key={idx} className="flex items-stretch gap-1.5">
                    <button
                      type="button"
                      disabled={answered}
                      onClick={() => setVivaPicked(idx)}
                      className={`opt-tile flex-1 text-left ${stateCls} ${
                        isCrossed ? 'opacity-45' : ''
                      }`}
                    >
                      <span className="opt-bubble">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span
                        className={`flex-1 text-[13.5px] leading-snug ${
                          isCrossed ? 'line-through text-[var(--dim)]' : ''
                        }`}
                        dangerouslySetInnerHTML={{ __html: typesetMathHtml(optText, lab.subj) }}
                      />
                      {answered && isRightOpt && (
                        <Icon name="check" size={17} className="text-[var(--green)] shrink-0" />
                      )}
                    </button>

                    {!answered && (
                      <button
                        type="button"
                        aria-pressed={isCrossed}
                        aria-label={
                          isCrossed
                            ? `Restore option ${String.fromCharCode(65 + idx)}`
                            : `Eliminate option ${String.fromCharCode(65 + idx)}`
                        }
                        title={isCrossed ? 'Restore option' : 'Cross out distractor'}
                        onClick={() =>
                          setVivaEliminated((prev) => ({ ...prev, [idx]: !prev[idx] }))
                        }
                        className={`w-9 rounded-xl border flex items-center justify-center text-[11px] font-bold transition cursor-pointer shrink-0 ${
                          isCrossed
                            ? 'bg-[var(--bad-soft)] border-[var(--bad-line)] text-[var(--coral-ink)]'
                            : 'bg-[var(--bg)] border-[var(--line)] text-[var(--dim)] hover:text-[var(--ink)]'
                        }`}
                      >
                        <Icon name="x" size={13} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {vivaPicked !== null && (
              <div
                className={`rounded-xl border p-3.5 flex flex-col gap-1.5 anim-explain-reveal ${
                  vivaPicked === vivaCheck.answerIdx
                    ? 'bg-[var(--ok-soft)] border-[var(--ok-line)]'
                    : 'bg-[var(--bad-soft)] border-[var(--bad-line)]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-[var(--display)] font-bold text-[14px] text-[var(--ink)]">
                    {vivaPicked === vivaCheck.answerIdx
                      ? 'Spot on — full practical mastery!'
                      : 'Trap spotted — see why:'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setVivaPicked(null);
                      setVivaEliminated({});
                    }}
                    className="text-[12px] font-bold text-[var(--gold)] hover:underline cursor-pointer whitespace-nowrap"
                  >
                    Try again
                  </button>
                </div>
                <p
                  className="text-[13.5px] text-[var(--ink)] leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: typesetMathHtml(vivaCheck.explanationHtml, lab.subj),
                  }}
                />
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
