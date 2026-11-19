import type { LabItem } from '../types';
import { renderLabSvg } from '../data/labs';

export type LabFoleyKind =
  | 'rulerSlide'
  | 'chalkDraw'
  | 'compassSet'
  | 'compassSweep'
  | 'protractorSet'
  | 'pencilDot'
  | 'angleChime'
  | 'chalkShade'
  | 'glassClink'
  | 'liquidPour'
  | 'liquidDrain'
  | 'droplet'
  | 'bubbles'
  | 'bunsenIgnite'
  | 'chemShimmer';

export interface LabFoleyCue {
  kind: LabFoleyKind;
  /** Delay in seconds from the start of the step */
  at: number;
  /** Duration in seconds for continuous sounds */
  dur: number;
  /** Optional pitch/intensity hint (0..1) */
  accent?: number;
}

const MATHS_OP_DUR: Record<string, number> = {
  path: 1.1,
  seg: 1.7,
  arc: 1.7,
  pt: 0.35,
  ang: 0.5,
  rt: 0.4,
  lab: 0.3,
  prot: 2.4,
  x: 0.35,
  curve: 2.6,
  shade: 0.6,
  dot: 0.3,
};

/**
 * Extracts deterministic, animation-synchronized acoustic foley cues
 * for both Maths Constructions Lab (ruler, compass, protractor, chalk)
 * and Chemistry Practicals Lab (glassware, pouring, droplets, bubbles, Bunsen flame).
 */
export function getLabStepAudioCues(lab: LabItem, stepIdx: number): LabFoleyCue[] {
  const steps = lab.steps();
  if (!steps.length) return [];
  const clampedIdx = Math.max(0, Math.min(stepIdx, steps.length - 1));

  // ── Chemistry, Physics & Biology Practicals Labs ──
  if (lab.subj === 'chem' || lab.subj === 'phys' || lab.subj === 'bio') {
    return extractChemSceneCues(lab, clampedIdx);
  }

  // ── Maths Constructions Lab ──
  const step = steps[clampedIdx];
  const ops = Array.isArray(step?.ops) ? step.ops : [];
  const cues: LabFoleyCue[] = [];
  let t = 0.2;

  ops.forEach((op: Record<string, any>, idx: number) => {
    const opDur = typeof op.dur === 'number' ? op.dur : MATHS_OP_DUR[op.t] || 0.4;

    if (op.t === 'seg') {
      if (op.plain) {
        cues.push({ kind: 'chalkDraw', at: t, dur: 0.22, accent: 0.4 });
      } else {
        cues.push({ kind: 'rulerSlide', at: t, dur: 0.24 });
        cues.push({ kind: 'chalkDraw', at: t + 0.45, dur: 0.95, accent: op.dash ? 0.6 : 0.85 });
      }
    } else if (op.t === 'arc') {
      const sweepDur = Math.max(0.6, opDur - 0.45);
      cues.push({ kind: 'compassSet', at: t, dur: 0.12 });
      cues.push({ kind: 'compassSweep', at: t + 0.25, dur: sweepDur });
    } else if (op.t === 'prot') {
      cues.push({ kind: 'protractorSet', at: t, dur: 0.22 });
      cues.push({ kind: 'pencilDot', at: t + 0.92, dur: 0.08, accent: 0.9 });
    } else if (op.t === 'curve') {
      cues.push({ kind: 'chalkDraw', at: t, dur: Math.max(0.8, opDur - 0.2), accent: 0.95 });
    } else if (op.t === 'path') {
      cues.push({ kind: 'chalkDraw', at: t, dur: opDur, accent: 0.75 });
    } else if (op.t === 'shade') {
      cues.push({ kind: 'chalkShade', at: t, dur: 0.55 });
    } else if ((op.t === 'pt' || op.t === 'x' || op.t === 'dot') && !op.quiet) {
      cues.push({ kind: 'pencilDot', at: t, dur: 0.08, accent: 0.5 + (idx % 3) * 0.15 });
    } else if (op.t === 'ang' || op.t === 'rt') {
      cues.push({ kind: 'angleChime', at: t + 0.08, dur: 0.32 });
    }

    t += opDur;
  });

  if (cues.length === 0) {
    cues.push({ kind: 'pencilDot', at: 0.18, dur: 0.08 });
  }

  return cues;
}

function extractChemSceneCues(lab: LabItem, stepIdx: number): LabFoleyCue[] {
  const cues: LabFoleyCue[] = [];
  const { svg } = renderLabSvg(lab, stepIdx);
  const prevSvg = stepIdx > 0 ? renderLabSvg(lab, stepIdx - 1).svg : '';

  // 1. Newly introduced glassware / apparatus (cl-in containing cl-gl)
  if (/<g class="cl-in"[^>]*>[\s\S]*?class="cl-gl"/.test(svg)) {
    cues.push({ kind: 'glassClink', at: 0.18, dur: 0.18 });
  } else if (stepIdx === 0 && svg.includes('cl-gl')) {
    cues.push({ kind: 'glassClink', at: 0.16, dur: 0.18 });
  }

  // 2. Animated liquid height changes (<animate attributeName="height" from="h0" to="h1" begin="d" dur="dur")
  const liqRegex =
    /<animate attributeName="height" from="([\d.]+)" to="([\d.]+)" begin="([\d.]+)s" dur="([\d.]+)s"/g;
  let liqMatch: RegExpExecArray | null;
  let pourCount = 0;
  while ((liqMatch = liqRegex.exec(svg)) !== null) {
    const h0 = parseFloat(liqMatch[1]);
    const h1 = parseFloat(liqMatch[2]);
    const begin = parseFloat(liqMatch[3]);
    const dur = Math.min(2.8, parseFloat(liqMatch[4]));
    if (Math.abs(h1 - h0) > 2 && pourCount < 2) {
      cues.push({
        kind: h1 > h0 ? 'liquidPour' : 'liquidDrain',
        at: begin,
        dur,
      });
      pourCount += 1;
    }
  }

  // 3. Falling reagent droplets (<animate attributeName="cy" ... dur="0.42s" repeatCount="N")
  const dropRegex =
    /<animate attributeName="cy" from="[\d.]+" to="[\d.]+" begin="([\d.]+)s" dur="0\.42s" repeatCount="(\d+)"/g;
  let dropMatch: RegExpExecArray | null;
  let scheduledDrops = 0;
  while ((dropMatch = dropRegex.exec(svg)) !== null) {
    const begin = parseFloat(dropMatch[1]);
    const count = Math.min(8, parseInt(dropMatch[2], 10) || 1);
    // Avoid stacking 4 identical dropper columns in parallel (e.g. c-cations)
    if (scheduledDrops === 0) {
      for (let i = 0; i < count; i++) {
        cues.push({
          kind: 'droplet',
          at: Number((begin + 0.34 + i * 0.42).toFixed(2)),
          dur: 0.08,
          accent: (i % 4) * 0.2,
        });
      }
      scheduledDrops += count;
    }
  }

  // 4. Effervescence / gas bubbles (cl-bub newly active or active on this step)
  if (svg.includes('class="cl-bub"')) {
    cues.push({ kind: 'bubbles', at: 0.35, dur: 1.8 });
  }

  // 5. Bunsen burner / splint relighting flame or steam
  const flameCountNow = (svg.match(/class="cl-flame"/g) || []).length;
  const flameCountPrev = (prevSvg.match(/class="cl-flame"/g) || []).length;
  if (flameCountNow > flameCountPrev || (flameCountNow > 0 && stepIdx === 0) || svg.includes('class="cl-steam"')) {
    cues.push({
      kind: 'bunsenIgnite',
      at: (lab.id === 'c-oxygen' || lab.id === 'c-hydrogen') && stepIdx === 3 ? 1.15 : 0.25,
      dur: 1.2,
    });
  }

  // 6. Pencil start-line drawing in chromatography
  if (svg.includes('cl-pen lb-draw')) {
    cues.push({ kind: 'chalkDraw', at: 0.65, dur: 0.85, accent: 0.7 });
  }

  // 7. Chemical milestone shimmer (end-point, crystals, precipitate, Rf, copper deposit, flame colour, pop test, organic tests)
  const isChemMilestone =
    (lab.id === 'c-titration' && (stepIdx === 1 || stepIdx === 4)) ||
    (lab.id === 'c-stdsol' && (stepIdx === 3 || stepIdx === 4)) ||
    (lab.id === 'c-redox-tit' && stepIdx === 3) ||
    (lab.id === 'c-filter' && stepIdx === 4) ||
    (lab.id === 'c-chroma' && (stepIdx === 4 || stepIdx === 5)) ||
    (lab.id === 'c-distill' && (stepIdx === 3 || stepIdx === 4)) ||
    (lab.id === 'c-sublim' && (stepIdx === 2 || stepIdx === 3)) ||
    (lab.id === 'c-electro' && (stepIdx === 2 || stepIdx === 4)) ||
    (lab.id === 'c-oxygen' && stepIdx === 3) ||
    (lab.id === 'c-hydrogen' && stepIdx === 3) ||
    (lab.id === 'c-co2' && (stepIdx === 2 || stepIdx === 3)) ||
    (lab.id === 'c-ammonia' && (stepIdx === 2 || stepIdx === 3)) ||
    (lab.id === 'c-cations' && (stepIdx === 2 || stepIdx === 3)) ||
    (lab.id === 'c-cations-nh3' && (stepIdx === 1 || stepIdx === 2)) ||
    (lab.id === 'c-flame' && stepIdx >= 2) ||
    (lab.id === 'c-anions' && stepIdx >= 1) ||
    (lab.id === 'c-rate-thio' && (stepIdx === 2 || stepIdx === 3)) ||
    (lab.id === 'c-calorim' && (stepIdx === 2 || stepIdx === 3)) ||
    (lab.id === 'c-org-unsat' && stepIdx >= 1) ||
    (lab.id === 'c-food-tests' && stepIdx >= 0) ||
    ((lab.subj === 'phys' || lab.subj === 'bio') && stepIdx === lab.steps().length - 1);

  if (isChemMilestone) {
    cues.push({ kind: 'chemShimmer', at: 0.75, dur: 0.55, accent: (stepIdx % 4) * 0.25 });
  }

  if (cues.length === 0) {
    cues.push({ kind: 'glassClink', at: 0.2, dur: 0.16 });
  }

  return cues.sort((a, b) => a.at - b.at);
}
