export type CirculatoryNodeId =
  | 'vena_cava'
  | 'right_atrium'
  | 'right_ventricle'
  | 'pulmonary_artery'
  | 'alveoli_lungs'
  | 'pulmonary_vein'
  | 'left_atrium'
  | 'left_ventricle'
  | 'aorta'
  | 'body_capillaries';

export type InspectableAnatomyId =
  | CirculatoryNodeId
  | 'tricuspid_valve'
  | 'pulmonary_valve'
  | 'mitral_valve'
  | 'aortic_valve';

export type CirculatoryMissionPhase =
  | 1 // Pulmonary Launch: Vena Cava -> Right Heart -> Pulmonary Artery
  | 2 // Alveolar Gas Exchange: Lungs CO2/O2 exchange -> Pulmonary Vein
  | 3 // Systemic Surge: Left Heart -> Thick Left Ventricle -> Aorta -> Body
  | 4; // Physiology Crisis Lab: Athlete Sprint Cardiac Output & Valve Seal Experiment

export type CameraPresetId = 'overview' | 'follow' | 'heart_interior' | 'lungs' | 'aortic_arch';

export interface JunctionOption {
  id: string;
  label: string;
  keyHint: '1' | '2' | '3';
  targetNode: CirculatoryNodeId | null;
  isCorrect: boolean;
  consequenceType: 'advance' | 'septum_block' | 'valve_backflow' | 'low_pressure_stall';
  scientificFeedback: string;
  principleTag: string;
}

export interface CirculatoryNodeSpec {
  id: CirculatoryNodeId;
  orderIndex: number;
  name: string;
  regionLabel: 'Right Heart · Venous' | 'Pulmonary Circuit · Lungs' | 'Left Heart · Arterial' | 'Systemic Circuit';
  bloodState: 'deoxygenated' | 'exchanging' | 'oxygenated';
  defaultSpO2: number;
  pressureMmHg: string;
  curveProgress: number; // [0..1] along the closed double-circulation spline
  liveObservation: string;
  requiresGasExchange?: boolean;
  junctionPrompt?: string;
  junctionOptions?: JunctionOption[];
}

export interface AnatomyInspectionCard {
  id: InspectableAnatomyId;
  title: string;
  category: 'Chamber' | 'One-Way Valve' | 'Blood Vessel' | 'Gas Exchange Surface';
  bloodStatus: string;
  actionSummary: string;
}

export interface PhysiologyExperimentParams {
  heartRateBpm: number; // 45..165
  inspiredOxygenPct: number; // 55..100
  valveRegurgitationPct: number; // 0..35
}

export interface PhysiologyExperimentMetrics {
  heartRateBpm: number;
  effectiveStrokeVolumeMl: number;
  cardiacOutputLMin: number;
  arterialSpO2Pct: number;
  venousReturnSpO2Pct: number;
  flowSpeedMultiplier: number;
  systolicPressureMmHg: number;
  hasMurmurBackflow: boolean;
  sprintTargetMet: boolean;
  diagnosticNote: string;
}

export interface CirculatoryAdventureState {
  missionPhase: CirculatoryMissionPhase;
  currentNode: CirculatoryNodeId;
  oxygenBoundMolecules: number; // 0..4 O2 bound to hero RBC haemoglobin
  co2LoadMolecules: number; // 0..4 CO2 carried
  gasExchangeCompleted: boolean;
  wrongChoicesCount: number;
  inspectedIds: InspectableAnatomyId[];
  experiment: PhysiologyExperimentParams;
  experimentTestedLeak: boolean;
  experimentSolved: boolean;
  completedAllMissions: boolean;
}

export const SPRINT_TARGET_CO_L_MIN = 9.5;
export const SPRINT_TARGET_SPO2_PCT = 96;

export const CIRCULATORY_NODE_ORDER: CirculatoryNodeId[] = [
  'vena_cava',
  'right_atrium',
  'right_ventricle',
  'pulmonary_artery',
  'alveoli_lungs',
  'pulmonary_vein',
  'left_atrium',
  'left_ventricle',
  'aorta',
  'body_capillaries',
];

export const CIRCULATORY_NODES: Record<CirculatoryNodeId, CirculatoryNodeSpec> = {
  vena_cava: {
    id: 'vena_cava',
    orderIndex: 0,
    name: 'Vena Cava',
    regionLabel: 'Right Heart · Venous',
    bloodState: 'deoxygenated',
    defaultSpO2: 44,
    pressureMmHg: '4 mmHg',
    curveProgress: 0.03,
    liveObservation:
      'Dark deoxygenated blood returns from respiring body tissues at low pressure, carrying CO₂ toward the Right Atrium.',
  },
  right_atrium: {
    id: 'right_atrium',
    orderIndex: 1,
    name: 'Right Atrium',
    regionLabel: 'Right Heart · Venous',
    bloodState: 'deoxygenated',
    defaultSpO2: 44,
    pressureMmHg: '6 mmHg',
    curveProgress: 0.11,
    liveObservation:
      'The pacemaker node triggers atrial contraction, pushing blood downward through the three-flap Tricuspid Valve.',
  },
  right_ventricle: {
    id: 'right_ventricle',
    orderIndex: 2,
    name: 'Right Ventricle',
    regionLabel: 'Right Heart · Venous',
    bloodState: 'deoxygenated',
    defaultSpO2: 45,
    pressureMmHg: '25 mmHg',
    curveProgress: 0.20,
    liveObservation:
      'The Tricuspid Valve snaps shut ("Lub") as the Right Ventricle contracts! Choose the correct exit vessel.',
    junctionPrompt: 'Right Ventricle contracting with deoxygenated blood — choose your vessel:',
    junctionOptions: [
      {
        id: 'rv-to-pa',
        label: 'Pulmonary Artery (to Lungs)',
        keyHint: '1',
        targetNode: 'pulmonary_artery',
        isCorrect: true,
        consequenceType: 'advance',
        scientificFeedback:
          'Pulmonary Semilunar Valve opens! Deoxygenated blood surges into the Pulmonary Artery toward the lungs.',
        principleTag: 'Arteries carry blood away from the heart',
      },
      {
        id: 'rv-to-aorta',
        label: 'Aorta (directly to Body)',
        keyHint: '2',
        targetNode: null,
        isCorrect: false,
        consequenceType: 'septum_block',
        scientificFeedback:
          'Blocked by the muscular septum! The Aorta exits the Left Ventricle—pumping deoxygenated blood to the body would starve brain cells of O₂.',
        principleTag: 'Septum prevents mixing of O₂-poor & O₂-rich blood',
      },
      {
        id: 'rv-to-ra-back',
        label: 'Back into Right Atrium',
        keyHint: '3',
        targetNode: null,
        isCorrect: false,
        consequenceType: 'valve_backflow',
        scientificFeedback:
          'The Tricuspid Valve slammed shut under ventricular pressure! One-way heart valves prevent venous backflow.',
        principleTag: 'Tricuspid valve enforces one-way flow',
      },
    ],
  },
  pulmonary_artery: {
    id: 'pulmonary_artery',
    orderIndex: 3,
    name: 'Pulmonary Artery',
    regionLabel: 'Pulmonary Circuit · Lungs',
    bloodState: 'deoxygenated',
    defaultSpO2: 45,
    pressureMmHg: '22 mmHg',
    curveProgress: 0.31,
    liveObservation:
      'Famous biology exception: this artery carries deoxygenated blood away from the heart at gentle pressure to protect lung capillaries.',
  },
  alveoli_lungs: {
    id: 'alveoli_lungs',
    orderIndex: 4,
    name: 'Alveolar Lung Capillaries',
    regionLabel: 'Pulmonary Circuit · Lungs',
    bloodState: 'exchanging',
    defaultSpO2: 98,
    pressureMmHg: '10 mmHg',
    curveProgress: 0.46,
    requiresGasExchange: true,
    liveObservation:
      'One-cell-thick alveolar walls surround you! Release CO₂ into the air sac and bind 4 O₂ molecules onto haemoglobin.',
    junctionPrompt: 'Haemoglobin is now bright scarlet with O₂! Where must blood travel next?',
    junctionOptions: [
      {
        id: 'lungs-to-pv',
        label: 'Pulmonary Vein (to Left Atrium)',
        keyHint: '1',
        targetNode: 'pulmonary_vein',
        isCorrect: true,
        consequenceType: 'advance',
        scientificFeedback:
          'Oxygen-rich blood glides along the Pulmonary Vein back to the Left Atrium for a high-pressure boost!',
        principleTag: 'Pulmonary vein carries oxygenated blood to heart',
      },
      {
        id: 'lungs-to-body-direct',
        label: 'Skip Heart → Straight to Body Organs',
        keyHint: '2',
        targetNode: null,
        isCorrect: false,
        consequenceType: 'low_pressure_stall',
        scientificFeedback:
          'Flow stalls! Tiny lung capillaries drained blood pressure to 10 mmHg. Blood must return to the Left Heart to be re-pressurised (Double Circulation).',
        principleTag: 'Why mammals require double circulation',
      },
      {
        id: 'lungs-to-pa-back',
        label: 'Reverse into Pulmonary Artery',
        keyHint: '3',
        targetNode: null,
        isCorrect: false,
        consequenceType: 'valve_backflow',
        scientificFeedback:
          'The Pulmonary Semilunar Valve closed behind you ("Dub"), keeping flow strictly forward toward the Left Atrium.',
        principleTag: 'Semilunar valves stop arterial backflow',
      },
    ],
  },
  pulmonary_vein: {
    id: 'pulmonary_vein',
    orderIndex: 5,
    name: 'Pulmonary Vein',
    regionLabel: 'Pulmonary Circuit · Lungs',
    bloodState: 'oxygenated',
    defaultSpO2: 98,
    pressureMmHg: '9 mmHg',
    curveProgress: 0.59,
    liveObservation:
      'Second key exception: the Pulmonary Vein is a vein because it flows toward the heart, yet it glows scarlet with fresh O₂.',
  },
  left_atrium: {
    id: 'left_atrium',
    orderIndex: 6,
    name: 'Left Atrium',
    regionLabel: 'Left Heart · Arterial',
    bloodState: 'oxygenated',
    defaultSpO2: 98,
    pressureMmHg: '10 mmHg',
    curveProgress: 0.68,
    liveObservation:
      'Oxygenated blood fills the Left Atrium and streams downward through the two-leaflet Mitral (Bicuspid) Valve.',
  },
  left_ventricle: {
    id: 'left_ventricle',
    orderIndex: 7,
    name: 'Left Ventricle',
    regionLabel: 'Left Heart · Arterial',
    bloodState: 'oxygenated',
    defaultSpO2: 98,
    pressureMmHg: '120 mmHg',
    curveProgress: 0.77,
    liveObservation:
      'Look at this muscular wall—3× thicker than the Right Ventricle! Launch oxygenated blood to the entire body.',
    junctionPrompt: 'Thick-walled Left Ventricle reaches peak systolic pressure (120 mmHg) — launch into:',
    junctionOptions: [
      {
        id: 'lv-to-aorta',
        label: 'Aorta (High-Pressure Systemic Arch)',
        keyHint: '1',
        targetNode: 'aorta',
        isCorrect: true,
        consequenceType: 'advance',
        scientificFeedback:
          'Aortic Semilunar Valve bursts open! Thick left-ventricular muscle launches scarlet blood from brain to toes.',
        principleTag: 'Thick left ventricle generates 120 mmHg systemic pressure',
      },
      {
        id: 'lv-to-la-back',
        label: 'Back through Mitral (Bicuspid) Valve',
        keyHint: '2',
        targetNode: null,
        isCorrect: false,
        consequenceType: 'valve_backflow',
        scientificFeedback:
          'Tendon cords hold the Bicuspid/Mitral leaflets tightly sealed so 120 mmHg pressure cannot surge backward into the lungs!',
        principleTag: 'Mitral valve & chordae tendineae prevent regurgitation',
      },
      {
        id: 'lv-to-pa-wrong',
        label: 'Pulmonary Artery (back to Lungs)',
        keyHint: '3',
        targetNode: null,
        isCorrect: false,
        consequenceType: 'septum_block',
        scientificFeedback:
          'The interventricular septum blocks that route—and your haemoglobin is already 98% saturated with O₂! Head for the Aorta.',
        principleTag: 'Systemic loop delivers O₂ to respiring organs',
      },
    ],
  },
  aorta: {
    id: 'aorta',
    orderIndex: 8,
    name: 'Aortic Arch',
    regionLabel: 'Systemic Circuit',
    bloodState: 'oxygenated',
    defaultSpO2: 98,
    pressureMmHg: '118 mmHg',
    curveProgress: 0.87,
    liveObservation:
      'Thick elastic walls stretch and recoil with every heartbeat, feeding coronary, carotid, and systemic arteries.',
  },
  body_capillaries: {
    id: 'body_capillaries',
    orderIndex: 9,
    name: 'Systemic Body Tissues',
    regionLabel: 'Systemic Circuit',
    bloodState: 'oxygenated',
    defaultSpO2: 97,
    pressureMmHg: '30 → 12 mmHg',
    curveProgress: 0.96,
    liveObservation:
      'Oxygen diffuses into active muscle & brain cells for aerobic respiration while CO₂ boards for the return trip!',
  },
};

export const ANATOMY_INSPECTABLES: Record<InspectableAnatomyId, AnatomyInspectionCard> = {
  vena_cava: {
    id: 'vena_cava',
    title: 'Superior & Inferior Vena Cava',
    category: 'Blood Vessel',
    bloodStatus: 'Deoxygenated · Low Pressure',
    actionSummary: 'Wide lumen veins returning CO₂-rich blood from the head, organs, and limbs into the Right Atrium.',
  },
  right_atrium: {
    id: 'right_atrium',
    title: 'Right Atrium & Pacemaker (SAN)',
    category: 'Chamber',
    bloodStatus: 'Deoxygenated · 6 mmHg',
    actionSummary: 'Thin-walled receiving chamber housing the sinoatrial node that sets natural heart rhythm.',
  },
  tricuspid_valve: {
    id: 'tricuspid_valve',
    title: 'Tricuspid Valve (Right AV)',
    category: 'One-Way Valve',
    bloodStatus: 'Opens in Diastole · Seals in Systole',
    actionSummary: 'Three fibrous flaps anchored by heartstrings; snaps shut ("Lub") to stop backflow into the Right Atrium.',
  },
  right_ventricle: {
    id: 'right_ventricle',
    title: 'Right Ventricle',
    category: 'Chamber',
    bloodStatus: 'Deoxygenated · 25 mmHg',
    actionSummary: 'Thinner muscular wall than the left side because it pumps only a short distance to the nearby lungs.',
  },
  pulmonary_valve: {
    id: 'pulmonary_valve',
    title: 'Pulmonary Semilunar Valve',
    category: 'One-Way Valve',
    bloodStatus: 'Prevents Lung-to-Heart Backflow',
    actionSummary: 'Three half-moon pockets forced open by right ventricular contraction and closed ("Dub") when it relaxes.',
  },
  pulmonary_artery: {
    id: 'pulmonary_artery',
    title: 'Pulmonary Artery',
    category: 'Blood Vessel',
    bloodStatus: 'Deoxygenated · Away from Heart',
    actionSummary: 'The only adult artery carrying deoxygenated blood—branches left and right into the lungs.',
  },
  alveoli_lungs: {
    id: 'alveoli_lungs',
    title: 'Alveoli & Lung Capillaries',
    category: 'Gas Exchange Surface',
    bloodStatus: 'CO₂ Out · O₂ Binds Haemoglobin',
    actionSummary: 'Millions of moist, one-cell-thick air sacs create a huge surface area and steep diffusion gradient.',
  },
  pulmonary_vein: {
    id: 'pulmonary_vein',
    title: 'Pulmonary Vein',
    category: 'Blood Vessel',
    bloodStatus: 'Oxygenated · Toward Heart',
    actionSummary: 'The adult vein that carries freshly oxygenated scarlet blood from the lungs into the Left Atrium.',
  },
  left_atrium: {
    id: 'left_atrium',
    title: 'Left Atrium',
    category: 'Chamber',
    bloodStatus: 'Oxygenated · 10 mmHg',
    actionSummary: 'Receives oxygen-saturated blood from the lungs and contracts to top up the Left Ventricle.',
  },
  mitral_valve: {
    id: 'mitral_valve',
    title: 'Bicuspid (Mitral) Valve',
    category: 'One-Way Valve',
    bloodStatus: 'Withstands 120 mmHg Pressure',
    actionSummary: 'Two strong cusps between Left Atrium and Left Ventricle; if leaky, blood regurgitates and lowers output.',
  },
  left_ventricle: {
    id: 'left_ventricle',
    title: 'Left Ventricle (Thick Myocardium)',
    category: 'Chamber',
    bloodStatus: 'Oxygenated · 120 mmHg Peak',
    actionSummary: 'Wall is 3× thicker than the Right Ventricle to generate high pressure for the entire body.',
  },
  aortic_valve: {
    id: 'aortic_valve',
    title: 'Aortic Semilunar Valve',
    category: 'One-Way Valve',
    bloodStatus: 'High-Pressure Systemic Gate',
    actionSummary: 'Opens under powerful left ventricular systole and seals during diastole to feed coronary arteries.',
  },
  aorta: {
    id: 'aorta',
    title: 'Aorta (Main Systemic Artery)',
    category: 'Blood Vessel',
    bloodStatus: 'Oxygenated · Elastic Recoil',
    actionSummary: 'Largest artery in the body; thick elastic and muscular walls smooth pulsatile pressure waves.',
  },
  body_capillaries: {
    id: 'body_capillaries',
    title: 'Systemic Tissue Capillaries',
    category: 'Gas Exchange Surface',
    bloodStatus: 'O₂ Unloaded to Cells · CO₂ Picked Up',
    actionSummary: 'Narrow lumen forces red blood cells single-file so oxygen rapidly diffuses into respiring tissues.',
  },
};

export function createInitialCirculatoryState(): CirculatoryAdventureState {
  return {
    missionPhase: 1,
    currentNode: 'vena_cava',
    oxygenBoundMolecules: 1,
    co2LoadMolecules: 3,
    gasExchangeCompleted: false,
    wrongChoicesCount: 0,
    inspectedIds: ['vena_cava'],
    experiment: {
      heartRateBpm: 72,
      inspiredOxygenPct: 98,
      valveRegurgitationPct: 0,
    },
    experimentTestedLeak: false,
    experimentSolved: false,
    completedAllMissions: false,
  };
}

export function computePhysiologyExperiment(
  params: PhysiologyExperimentParams
): PhysiologyExperimentMetrics {
  const hr = Math.min(165, Math.max(45, Math.round(params.heartRateBpm)));
  const inspired = Math.min(100, Math.max(55, Math.round(params.inspiredOxygenPct)));
  const leakPct = Math.min(35, Math.max(0, Math.round(params.valveRegurgitationPct)));

  // Frank-Starling & filling time curve: SV peaks around 110-135 BPM during exercise, tapers slightly above 152 BPM
  const exerciseInotropyBonus = hr > 85 ? Math.min(14, (hr - 85) * 0.24) : 0;
  const rapidFillingPenalty = hr > 150 ? (hr - 150) * 0.65 : 0;
  const baseStrokeVolumeMl = 80 + exerciseInotropyBonus - rapidFillingPenalty;

  const effectiveStrokeVolumeMl = Math.max(
    36,
    Math.round(baseStrokeVolumeMl * (1 - leakPct / 100))
  );
  const cardiacOutputLMin = Number(((hr * effectiveStrokeVolumeMl) / 1000).toFixed(1));

  const arterialSpO2Pct = Math.min(
    99,
    Math.max(54, Math.round(47 + inspired * 0.52 - leakPct * 0.22))
  );
  const venousReturnSpO2Pct = Math.max(
    28,
    Math.round(arterialSpO2Pct - (hr > 105 ? 52 : 44))
  );

  const flowSpeedMultiplier = Number(
    Math.max(0.45, (cardiacOutputLMin / 5.8) * (1 - leakPct * 0.006)).toFixed(2)
  );
  const systolicPressureMmHg = Math.round(
    96 + (hr - 60) * 0.42 + (effectiveStrokeVolumeMl - 75) * 0.55
  );
  const hasMurmurBackflow = leakPct >= 10;

  const sprintTargetMet =
    cardiacOutputLMin >= SPRINT_TARGET_CO_L_MIN &&
    arterialSpO2Pct >= SPRINT_TARGET_SPO2_PCT &&
    leakPct === 0;

  let diagnosticNote = 'Resting sinus rhythm — balanced oxygen delivery.';
  if (hasMurmurBackflow) {
    diagnosticNote =
      'Valve regurgitation active: blood leaks backward across the mitral valve, dropping forward stroke volume!';
  } else if (inspired < 82) {
    diagnosticNote =
      'Low alveolar oxygen gradient: haemoglobin leaves the lungs partially unsaturated (hypoxaemia).';
  } else if (sprintTargetMet) {
    diagnosticNote =
      'Sprint demand satisfied! High heart rate + sealed valves + rich alveolar O₂ deliver >= 9.5 L/min.';
  } else if (cardiacOutputLMin < SPRINT_TARGET_CO_L_MIN) {
    diagnosticNote = `Cardiac output (${cardiacOutputLMin.toFixed(1)} L/min) is below the 9.5 L/min sprint demand — raise Heart Rate!`;
  }

  return {
    heartRateBpm: hr,
    effectiveStrokeVolumeMl,
    cardiacOutputLMin,
    arterialSpO2Pct,
    venousReturnSpO2Pct,
    flowSpeedMultiplier,
    systolicPressureMmHg,
    hasMurmurBackflow,
    sprintTargetMet,
    diagnosticNote,
  };
}

export interface StepAdvanceOutcome {
  nextState: CirculatoryAdventureState;
  moved: boolean;
  consequenceType: 'advance' | 'septum_block' | 'valve_backflow' | 'low_pressure_stall' | 'needs_exchange';
  feedbackMessage: string;
  principleTag: string;
  phaseJustAdvancedTo?: CirculatoryMissionPhase;
}

export function performAlveolarGasExchange(
  state: CirculatoryAdventureState
): CirculatoryAdventureState {
  if (state.currentNode !== 'alveoli_lungs') return state;
  const nextInspected = state.inspectedIds.includes('alveoli_lungs')
    ? state.inspectedIds
    : [...state.inspectedIds, 'alveoli_lungs' as InspectableAnatomyId];

  return {
    ...state,
    oxygenBoundMolecules: 4,
    co2LoadMolecules: 0,
    gasExchangeCompleted: true,
    inspectedIds: nextInspected,
  };
}

export function advanceLinearVesselStep(
  state: CirculatoryAdventureState
): StepAdvanceOutcome {
  const spec = CIRCULATORY_NODES[state.currentNode];

  if (spec.requiresGasExchange && !state.gasExchangeCompleted) {
    return {
      nextState: state,
      moved: false,
      consequenceType: 'needs_exchange',
      feedbackMessage:
        'Exchange gases first! Release CO₂ and bind 4 O₂ molecules inside the alveolar capillaries before leaving the lungs.',
      principleTag: 'Diffusion across one-cell-thick alveoli',
    };
  }

  if (spec.junctionOptions && spec.junctionOptions.length > 0) {
    return {
      nextState: state,
      moved: false,
      consequenceType: 'needs_exchange',
      feedbackMessage: spec.junctionPrompt || 'Choose the correct vessel branch to continue.',
      principleTag: 'Active vessel routing required',
    };
  }

  const nextIdx = spec.orderIndex + 1;
  if (nextIdx >= CIRCULATORY_NODE_ORDER.length) {
    // Reached systemic body capillaries -> enter Mission 4 Physiology Crisis Lab!
    const crisisState: CirculatoryAdventureState = {
      ...state,
      missionPhase: 4,
      oxygenBoundMolecules: 1,
      co2LoadMolecules: 3,
      experiment: {
        heartRateBpm: 76,
        inspiredOxygenPct: 78,
        valveRegurgitationPct: 22,
      },
    };
    return {
      nextState: crisisState,
      moved: true,
      consequenceType: 'advance',
      feedbackMessage:
        'Oxygen delivered to respiring muscle cells! Alert: Athlete Sprint Crisis triggered—stabilise 9.5 L/min output & seal the leaky valve!',
      principleTag: 'Cardiac Output = Heart Rate × Stroke Volume',
      phaseJustAdvancedTo: 4,
    };
  }

  const targetNode = CIRCULATORY_NODE_ORDER[nextIdx];
  return transitionToNode(state, targetNode, CIRCULATORY_NODES[targetNode].liveObservation, 'One-way double circulation');
}

export function evaluateJunctionChoice(
  state: CirculatoryAdventureState,
  optionId: string
): StepAdvanceOutcome {
  const spec = CIRCULATORY_NODES[state.currentNode];
  if (spec.requiresGasExchange && !state.gasExchangeCompleted) {
    return {
      nextState: state,
      moved: false,
      consequenceType: 'needs_exchange',
      feedbackMessage:
        'Your haemoglobin is still dark and deoxygenated! Bind O₂ and release CO₂ in the alveoli before exiting the lungs.',
      principleTag: 'Oxyhaemoglobin formation in alveoli',
    };
  }

  const option = spec.junctionOptions?.find((o) => o.id === optionId);
  if (!option) {
    return {
      nextState: state,
      moved: false,
      consequenceType: 'septum_block',
      feedbackMessage: 'Select one of the connected anatomical vessels.',
      principleTag: 'Closed circulatory network',
    };
  }

  if (!option.isCorrect || !option.targetNode) {
    return {
      nextState: {
        ...state,
        wrongChoicesCount: state.wrongChoicesCount + 1,
      },
      moved: false,
      consequenceType: option.consequenceType,
      feedbackMessage: option.scientificFeedback,
      principleTag: option.principleTag,
    };
  }

  return transitionToNode(state, option.targetNode, option.scientificFeedback, option.principleTag);
}

function transitionToNode(
  state: CirculatoryAdventureState,
  targetNode: CirculatoryNodeId,
  feedbackMessage: string,
  principleTag: string
): StepAdvanceOutcome {
  let nextPhase: CirculatoryMissionPhase = state.missionPhase;
  let phaseJustAdvancedTo: CirculatoryMissionPhase | undefined;

  if (targetNode === 'pulmonary_artery' && state.missionPhase < 2) {
    nextPhase = 2;
    phaseJustAdvancedTo = 2;
  } else if (targetNode === 'pulmonary_vein' && state.missionPhase < 3) {
    nextPhase = 3;
    phaseJustAdvancedTo = 3;
  }

  const nextInspected = state.inspectedIds.includes(targetNode)
    ? state.inspectedIds
    : [...state.inspectedIds, targetNode];

  return {
    nextState: {
      ...state,
      currentNode: targetNode,
      missionPhase: nextPhase,
      inspectedIds: nextInspected,
    },
    moved: true,
    consequenceType: 'advance',
    feedbackMessage,
    principleTag,
    phaseJustAdvancedTo,
  };
}

export function applyExperimentUpdate(
  state: CirculatoryAdventureState,
  patch: Partial<PhysiologyExperimentParams>
): { nextState: CirculatoryAdventureState; metrics: PhysiologyExperimentMetrics; justSolvedSprint: boolean } {
  const merged: PhysiologyExperimentParams = {
    heartRateBpm: patch.heartRateBpm ?? state.experiment.heartRateBpm,
    inspiredOxygenPct: patch.inspiredOxygenPct ?? state.experiment.inspiredOxygenPct,
    valveRegurgitationPct: patch.valveRegurgitationPct ?? state.experiment.valveRegurgitationPct,
  };
  const metrics = computePhysiologyExperiment(merged);
  const testedLeak = state.experimentTestedLeak || merged.valveRegurgitationPct > 0;
  const solvedNow = state.missionPhase === 4 && metrics.sprintTargetMet;
  const justSolvedSprint = solvedNow && !state.experimentSolved;

  return {
    nextState: {
      ...state,
      experiment: merged,
      experimentTestedLeak: testedLeak,
      experimentSolved: state.experimentSolved || solvedNow,
      completedAllMissions: state.completedAllMissions || solvedNow,
    },
    metrics,
    justSolvedSprint,
  };
}

export function calculateCirculatoryAdventureReward(state: CirculatoryAdventureState): {
  xpEarned: number;
  masteryAccuracyPct: number;
  rankUnlocked: string;
} {
  if (!state.completedAllMissions || !state.gasExchangeCompleted || !state.experimentSolved) {
    return {
      xpEarned: 0,
      masteryAccuracyPct: 0,
      rankUnlocked: 'Bio-Cadet',
    };
  }

  const penaltyPct = Math.min(28, state.wrongChoicesCount * 6);
  const inspectionBonusPct = Math.min(6, Math.floor(state.inspectedIds.length / 3) * 2);
  const masteryAccuracyPct = Math.min(100, Math.max(70, 96 - penaltyPct + inspectionBonusPct));
  const xpEarned = Math.round(300 * (masteryAccuracyPct / 100));

  return {
    xpEarned,
    masteryAccuracyPct,
    rankUnlocked: masteryAccuracyPct >= 88 ? 'Cardiovascular Commander' : 'Heart Explorer',
  };
}

export function getDeterministicCompanionGuidance(
  state: CirculatoryAdventureState
): { guidance: string; scientificPrinciple: string } {
  if (state.missionPhase === 4) {
    const m = computePhysiologyExperiment(state.experiment);
    if (m.hasMurmurBackflow) {
      return {
        guidance:
          'Hear that systolic whoosh? Blood is leaking backward through the Mitral Valve! Seal the valve to 0% leak so every beat drives blood forward.',
        scientificPrinciple: 'One-Way Valve Competence',
      };
    }
    if (m.arterialSpO2Pct < SPRINT_TARGET_SPO2_PCT) {
      return {
        guidance:
          'Haemoglobin is leaving the lungs below 96% saturation. Raise Alveolar O₂ Efficiency to restore a steep diffusion gradient!',
        scientificPrinciple: 'Fick’s Law of Alveolar Diffusion',
      };
    }
    if (m.cardiacOutputLMin < SPRINT_TARGET_CO_L_MIN) {
      return {
        guidance: `Sprinting muscles need at least 9.5 L/min, and we are at ${m.cardiacOutputLMin.toFixed(1)} L/min. Increase Heart Rate above 115 BPM!`,
        scientificPrinciple: 'Cardiac Output = HR × Stroke Volume',
      };
    }
    return {
      guidance:
        'Textbook cardiovascular control! Sealed valves, steep alveolar O₂ diffusion, and elevated heart rate are powering the sprint cleanly.',
      scientificPrinciple: 'Homeostatic Oxygen Delivery',
    };
  }

  if (state.currentNode === 'right_ventricle') {
    return {
      guidance:
        'Look at your cell’s dark venous tint—it is still low in O₂! Pump away from the Right Ventricle through the Pulmonary Artery to visit the lungs first.',
      scientificPrinciple: 'Pulmonary Circuit First',
    };
  }

  if (state.currentNode === 'alveoli_lungs' && !state.gasExchangeCompleted) {
    return {
      guidance:
        'You are inside a moist, one-cell-thick alveolar capillary! Trigger Gas Exchange to unload CO₂ and bind 4 fresh O₂ molecules onto haemoglobin.',
      scientificPrinciple: 'Alveolar Gas Exchange (Hb + 4O₂)',
    };
  }

  if (state.currentNode === 'alveoli_lungs' && state.gasExchangeCompleted) {
    return {
      guidance:
        'Your haemoglobin now glows scarlet with O₂, but lung capillaries dropped blood pressure! Ride the Pulmonary Vein back to the Left Atrium.',
      scientificPrinciple: 'Double Circulation Pressure Boost',
    };
  }

  if (state.currentNode === 'left_ventricle') {
    return {
      guidance:
        'Notice how the Left Ventricle’s muscular wall is 3× thicker than the right! Launch through the Aortic Valve into the Aorta to supply the whole body.',
      scientificPrinciple: 'Left Ventricular Systemic Pressure',
    };
  }

  return {
    guidance: CIRCULATORY_NODES[state.currentNode].liveObservation,
    scientificPrinciple: CIRCULATORY_NODES[state.currentNode].regionLabel,
  };
}

export function getMissionBannerSpec(state: CirculatoryAdventureState): {
  phaseTitle: string;
  objectiveText: string;
} {
  if (state.missionPhase === 1) {
    return {
      phaseTitle: 'Mission 1/4 · Pulmonary Launch',
      objectiveText:
        state.currentNode === 'right_ventricle'
          ? 'Route deoxygenated blood out of the Right Ventricle toward the Lungs.'
          : 'Pilot your deoxygenated Red Blood Cell from the Vena Cava into the Right Ventricle.',
    };
  }
  if (state.missionPhase === 2) {
    if (state.currentNode === 'alveoli_lungs' && !state.gasExchangeCompleted) {
      return {
        phaseTitle: 'Mission 2/4 · Alveolar Gas Exchange',
        objectiveText: 'Inside the Lungs: Release CO₂ and bind 4 O₂ molecules onto haemoglobin.',
      };
    }
    return {
      phaseTitle: 'Mission 2/4 · Alveolar Gas Exchange',
      objectiveText: 'Guide freshly oxygenated blood from the Pulmonary Artery & Lungs into the Pulmonary Vein.',
    };
  }
  if (state.missionPhase === 3) {
    return {
      phaseTitle: 'Mission 3/4 · High-Pressure Systemic Surge',
      objectiveText:
        state.currentNode === 'left_ventricle'
          ? 'Contract the thick-walled Left Ventricle to launch oxygenated blood into the Aorta.'
          : 'Travel through the Left Heart, surge out the Aorta, and deliver O₂ to body tissues.',
    };
  }
  return {
    phaseTitle: 'Mission 4/4 · Sprint Physiology Lab',
    objectiveText:
      'Experiment with Heart Rate, Alveolar O₂ & Valve Seal to deliver ≥ 9.5 L/min at ≥ 96% SpO₂ with 0% backflow.',
  };
}
