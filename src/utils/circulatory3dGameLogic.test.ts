import test from 'node:test';
import assert from 'node:assert/strict';
import {
  advanceLinearVesselStep,
  applyExperimentUpdate,
  calculateCirculatoryAdventureReward,
  computePhysiologyExperiment,
  createInitialCirculatoryState,
  evaluateJunctionChoice,
  performAlveolarGasExchange,
} from './circulatory3dGameLogic';

test('initial state spawns deoxygenated RBC in Vena Cava on Mission 1', () => {
  const s0 = createInitialCirculatoryState();
  assert.equal(s0.currentNode, 'vena_cava');
  assert.equal(s0.missionPhase, 1);
  assert.equal(s0.gasExchangeCompleted, false);
  assert.equal(s0.oxygenBoundMolecules, 1);
});

test('wrong vessel choices at Right Ventricle explain septum & tricuspid valve science without advancing', () => {
  let s = createInitialCirculatoryState();
  s = advanceLinearVesselStep(s).nextState; // right_atrium
  s = advanceLinearVesselStep(s).nextState; // right_ventricle
  assert.equal(s.currentNode, 'right_ventricle');

  const wrongAorta = evaluateJunctionChoice(s, 'rv-to-aorta');
  assert.equal(wrongAorta.moved, false);
  assert.equal(wrongAorta.consequenceType, 'septum_block');
  assert.match(wrongAorta.feedbackMessage, /septum/i);
  assert.equal(wrongAorta.nextState.wrongChoicesCount, 1);
  assert.equal(wrongAorta.nextState.currentNode, 'right_ventricle');

  const wrongBackflow = evaluateJunctionChoice(wrongAorta.nextState, 'rv-to-ra-back');
  assert.equal(wrongBackflow.moved, false);
  assert.equal(wrongBackflow.consequenceType, 'valve_backflow');
  assert.match(wrongBackflow.feedbackMessage, /Tricuspid Valve/i);
  assert.equal(wrongBackflow.nextState.wrongChoicesCount, 2);

  const rightChoice = evaluateJunctionChoice(wrongBackflow.nextState, 'rv-to-pa');
  assert.equal(rightChoice.moved, true);
  assert.equal(rightChoice.nextState.currentNode, 'pulmonary_artery');
  assert.equal(rightChoice.nextState.missionPhase, 2);
});

test('alveolar lungs require O2/CO2 gas exchange before entering Pulmonary Vein', () => {
  let s = createInitialCirculatoryState();
  s = advanceLinearVesselStep(s).nextState; // right_atrium
  s = advanceLinearVesselStep(s).nextState; // right_ventricle
  s = evaluateJunctionChoice(s, 'rv-to-pa').nextState; // pulmonary_artery
  s = advanceLinearVesselStep(s).nextState; // alveoli_lungs
  assert.equal(s.currentNode, 'alveoli_lungs');

  // Cannot leave lungs before gas exchange
  const premature = evaluateJunctionChoice(s, 'lungs-to-pv');
  assert.equal(premature.moved, false);
  assert.equal(premature.consequenceType, 'needs_exchange');

  // Perform gas exchange -> 4 O2 bound, 0 CO2
  const oxygenated = performAlveolarGasExchange(s);
  assert.equal(oxygenated.gasExchangeCompleted, true);
  assert.equal(oxygenated.oxygenBoundMolecules, 4);
  assert.equal(oxygenated.co2LoadMolecules, 0);

  // Skipping Left Heart stalls due to low capillary pressure
  const skipHeart = evaluateJunctionChoice(oxygenated, 'lungs-to-body-direct');
  assert.equal(skipHeart.moved, false);
  assert.equal(skipHeart.consequenceType, 'low_pressure_stall');
  assert.match(skipHeart.feedbackMessage, /Double Circulation/i);

  // Pulmonary vein succeeds and advances to Mission 3
  const intoPv = evaluateJunctionChoice(oxygenated, 'lungs-to-pv');
  assert.equal(intoPv.moved, true);
  assert.equal(intoPv.nextState.currentNode, 'pulmonary_vein');
  assert.equal(intoPv.nextState.missionPhase, 3);
});

test('full double-circulation loop + live sprint physiology experiment unlocks mastery reward', () => {
  let s = createInitialCirculatoryState();
  s = advanceLinearVesselStep(s).nextState; // right_atrium
  s = advanceLinearVesselStep(s).nextState; // right_ventricle
  s = evaluateJunctionChoice(s, 'rv-to-pa').nextState; // pulmonary_artery
  s = advanceLinearVesselStep(s).nextState; // alveoli_lungs
  s = performAlveolarGasExchange(s);
  s = evaluateJunctionChoice(s, 'lungs-to-pv').nextState; // pulmonary_vein
  s = advanceLinearVesselStep(s).nextState; // left_atrium
  s = advanceLinearVesselStep(s).nextState; // left_ventricle
  assert.equal(s.currentNode, 'left_ventricle');

  s = evaluateJunctionChoice(s, 'lv-to-aorta').nextState; // aorta
  s = advanceLinearVesselStep(s).nextState; // body_capillaries
  assert.equal(s.currentNode, 'body_capillaries');

  // Advancing from body_capillaries triggers Mission 4 Sprint Crisis Lab
  const toCrisis = advanceLinearVesselStep(s);
  assert.equal(toCrisis.moved, true);
  assert.equal(toCrisis.nextState.missionPhase, 4);
  s = toCrisis.nextState;

  // Leaky valve drops cardiac output below sprint target even at 120 BPM
  const leakyMetrics = computePhysiologyExperiment({
    heartRateBpm: 120,
    inspiredOxygenPct: 98,
    valveRegurgitationPct: 30,
  });
  assert.equal(leakyMetrics.hasMurmurBackflow, true);
  assert.equal(leakyMetrics.sprintTargetMet, false);

  // Sealing valve + high BPM + 98% inspired O2 satisfies >= 9.5 L/min and >= 96% SpO2
  const solved = applyExperimentUpdate(s, {
    heartRateBpm: 128,
    inspiredOxygenPct: 98,
    valveRegurgitationPct: 0,
  });
  assert.equal(solved.metrics.sprintTargetMet, true);
  assert.ok(solved.metrics.cardiacOutputLMin >= 9.5);
  assert.ok(solved.metrics.arterialSpO2Pct >= 96);
  assert.equal(solved.justSolvedSprint, true);
  assert.equal(solved.nextState.completedAllMissions, true);

  const reward = calculateCirculatoryAdventureReward(solved.nextState);
  assert.ok(reward.xpEarned >= 270);
  assert.equal(reward.rankUnlocked, 'Cardiovascular Commander');
});
