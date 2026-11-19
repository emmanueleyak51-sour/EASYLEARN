import test from 'node:test';
import assert from 'node:assert/strict';
import { getLabById, getLabsForSubject } from '../data/labs';
import { getLabStepAudioCues } from './labAudioLogic';

test('Maths Constructions Lab generates ruler, chalkDraw, and compassSweep cues', () => {
  const bisect = getLabById('bisect-line');
  assert.ok(bisect, 'bisect-line lab exists');

  // Step 0 draws segment AB with ruler & pencil
  const step0Cues = getLabStepAudioCues(bisect, 0);
  assert.ok(step0Cues.some((c) => c.kind === 'rulerSlide'));
  assert.ok(step0Cues.some((c) => c.kind === 'chalkDraw'));
  assert.ok(step0Cues.some((c) => c.kind === 'pencilDot'));

  // Step 1 sweeps a compass arc
  const step1Cues = getLabStepAudioCues(bisect, 1);
  assert.ok(step1Cues.some((c) => c.kind === 'compassSet'));
  assert.ok(step1Cues.some((c) => c.kind === 'compassSweep'));
});

test('Protractor construction generates protractorSet and pencilDot cues', () => {
  const prot = getLabById('protractor');
  assert.ok(prot, 'protractor lab exists');
  const step1Cues = getLabStepAudioCues(prot, 1);
  assert.ok(step1Cues.some((c) => c.kind === 'protractorSet'));
  assert.ok(step1Cues.some((c) => c.kind === 'pencilDot'));
});

test('Chemistry Practicals Labs generate glassware, pouring, droplets, bubbles, and flame cues', () => {
  const titration = getLabById('c-titration');
  assert.ok(titration);
  // Step 0: flask + pipette + liquid fill
  const tit0 = getLabStepAudioCues(titration, 0);
  assert.ok(tit0.some((c) => c.kind === 'glassClink'));
  assert.ok(tit0.some((c) => c.kind === 'liquidPour'));

  // Step 3: burette droplets + draining/filling
  const tit3 = getLabStepAudioCues(titration, 3);
  assert.ok(tit3.some((c) => c.kind === 'droplet'));

  // Step 4: end-point shimmer
  const tit4 = getLabStepAudioCues(titration, 4);
  assert.ok(tit4.some((c) => c.kind === 'chemShimmer'));

  // Electrolysis step 3: oxygen bubbles
  const electro = getLabById('c-electro');
  assert.ok(electro);
  const el3 = getLabStepAudioCues(electro, 3);
  assert.ok(el3.some((c) => c.kind === 'bubbles'));

  // Flame test step 2: Bunsen flame + shimmer
  const flame = getLabById('c-flame');
  assert.ok(flame);
  const fl2 = getLabStepAudioCues(flame, 2);
  assert.ok(fl2.some((c) => c.kind === 'bunsenIgnite'));
  assert.ok(fl2.some((c) => c.kind === 'chemShimmer'));
});

test('All 43 Maths (23) and Chemistry (20) Labs produce valid ordered foley cues on every step', () => {
  const mathLabs = getLabsForSubject('maths');
  const chemLabs = getLabsForSubject('chem');
  assert.equal(mathLabs.length, 23);
  assert.equal(chemLabs.length, 20);
  const allLabs = [...mathLabs, ...chemLabs];
  assert.equal(allLabs.length, 43);

  // Verify specific new Chemistry practicals produce authentic acoustic foley
  const distill = getLabById('c-distill');
  assert.ok(distill);
  const dist2 = getLabStepAudioCues(distill, 2);
  assert.ok(dist2.some((c) => c.kind === 'bunsenIgnite' || c.kind === 'bubbles'));

  const hydrogen = getLabById('c-hydrogen');
  assert.ok(hydrogen);
  const hyd3 = getLabStepAudioCues(hydrogen, 3);
  assert.ok(hyd3.some((c) => c.kind === 'bunsenIgnite'));
  assert.ok(hyd3.some((c) => c.kind === 'chemShimmer'));

  const anions = getLabById('c-anions');
  assert.ok(anions);
  const an4 = getLabStepAudioCues(anions, 4);
  assert.ok(an4.some((c) => c.kind === 'chemShimmer'));

  for (const lab of allLabs) {
    const steps = lab.steps();
    assert.ok(steps.length > 0, `${lab.id} has steps`);
    steps.forEach((_, idx) => {
      const cues = getLabStepAudioCues(lab, idx);
      assert.ok(cues.length > 0, `${lab.id} step ${idx} produces at least one foley cue`);
      cues.forEach((c) => {
        assert.ok(Number.isFinite(c.at) && c.at >= 0);
        assert.ok(Number.isFinite(c.dur) && c.dur > 0);
      });
    });
  }
});
