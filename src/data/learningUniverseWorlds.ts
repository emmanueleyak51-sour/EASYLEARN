import type { SubjectId, Topic, UserProgress } from '../types';
import { getTopics } from './curriculum';
import { SUBJECT_TUTOR_REGISTRY } from '../utils/tutorRegistry';
import { pickWeakTopicForCompanionAdventure } from '../utils/learningUniverseLogic';

import universeSanctumArt from '../assets/images/universe_home_sanctum_1795581352889.jpg';
import bioWorldArt from '../assets/images/world_biology_living_1795581351630.jpg';
import chemWorldArt from '../assets/images/world_chemistry_alchemist_1795581353726.jpg';
import physWorldArt from '../assets/images/world_physics_cosmos_1795581354474.jpg';
import mathsWorldArt from '../assets/images/world_maths_kingdom_1795581355295.jpg';

export { universeSanctumArt };

export type UniverseSimulationKind =
  | 'heart_circulation'
  | 'cell_osmosis'
  | 'enzyme_curve'
  | 'chem_atom'
  | 'phys_gravity'
  | 'math_temple'
  | 'concept_pathway';

export interface MissionQuestionCheck {
  prompt: string;
  options: string[];
  correctIndex: number;
  hints: [string, string];
  explanation: string;
  optionFeedback?: string[];
}

export interface UniverseMission {
  id: string;
  worldId: SubjectId;
  levelLabel: string;
  title: string;
  subtitle: string;
  linkedTopicId?: string;
  xpReward: number;
  unlockTitle: string;
  unlockEquipmentId?: string;
  isDynamicRescue?: boolean;
  stage1Discover: {
    hook: string;
    companionIntro: string;
    keyFacts: { label: string; detail: string }[];
  };
  stage2Explore: {
    simulationKind: UniverseSimulationKind;
    instruction: string;
    targetGoalLabel: string;
    pathwayNodes?: { id: string; label: string; stateNote: string }[];
  };
  stage3Decision: MissionQuestionCheck & {
    scenarioContext: string;
  };
  stage4Complete: {
    applicationChallenge: MissionQuestionCheck;
    teachBackChallenge: MissionQuestionCheck;
    victoryNarrative: string;
  };
}

export interface WorldBossEncounter {
  id: string;
  worldId: SubjectId;
  name: string;
  title: string;
  premise: string;
  xpReward: number;
  unlockTitle: string;
  questions: {
    id: string;
    phaseLabel: string;
    telegraph: string;
    q: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface SubjectWorldDef {
  worldId: SubjectId;
  subjectName: string;
  worldTitle: string;
  tagline: string;
  heroMissionHeadline: string;
  roleIdentity: string;
  companionName: string;
  companionRole: string;
  keyArtUrl?: string;
  fallbackGradient: string;
  accentHex: string;
  icon: string;
  missions: UniverseMission[];
  boss: WorldBossEncounter;
}

const BIOLOGY_WORLD: SubjectWorldDef = {
  worldId: 'bio',
  subjectName: 'Biology',
  worldTitle: 'The Living World',
  tagline:
    'Explore the human body, travel through the bloodstream, investigate cells and solve biological mysteries.',
  heroMissionHeadline: 'Save the Human Body',
  roleIdentity: 'Bio-Explorer & Cellular Specialist',
  companionName: 'Dr. Amaka',
  companionRole: 'Bio-Expedition Field Guide',
  keyArtUrl: bioWorldArt,
  fallbackGradient: 'linear-gradient(135deg, #2A0810 0%, #681224 55%, #0F2938 100%)',
  accentHex: '#E11D48',
  icon: 'dna',
  missions: [
    {
      id: 'bio-heart-failing',
      worldId: 'bio',
      levelLabel: '3D Expedition',
      title: 'Voyage Through the Living Heart',
      subtitle:
        'Pilot a red blood cell inside a beating 3D human heart, exchange CO₂ for oxygen inside living alveoli, and run live cardiac experiments.',
      xpReward: 300,
      unlockTitle: 'Cardiovascular Commander',
      unlockEquipmentId: 'bio-pulse-scanner',
      stage1Discover: {
        hook: 'Oxygen saturation is dropping across the body! You pilot your micro-vessel into the vena cava and face two distinct circulation loops.',
        companionIntro:
          'Welcome inside the heart! Humans use double circulation: the right side pumps deoxygenated blood to the lungs to pick up oxygen, while the muscular left side pumps freshly oxygenated blood at high pressure to the whole body.',
        keyFacts: [
          {
            label: 'Right Side (Pulmonary Loop)',
            detail:
              'Receives low-oxygen blood from the body via the Vena Cava into the Right Atrium, then Right Ventricle, and sends it to the Lungs.',
          },
          {
            label: 'One-Way Valves',
            detail:
              'Tricuspid (right) and Bicuspid/Mitral (left) valves, plus semilunar valves, stop blood from flowing backward.',
          },
          {
            label: 'Left Side (Systemic Loop)',
            detail:
              'Oxygen-rich blood returns from the lungs via the Pulmonary Vein into the Left Atrium, then the thick-walled Left Ventricle pumps it out through the Aorta.',
          },
        ],
      },
      stage2Explore: {
        simulationKind: 'heart_circulation',
        instruction:
          'Step the blood pulse through all 6 checkpoints in the exact physiological order from Vena Cava to Aorta and observe where oxygen exchange happens.',
        targetGoalLabel: 'Complete full double-circulation loop (6/6 checkpoints)',
      },
      stage3Decision: {
        scenarioContext:
          'Emergency alert: Deoxygenated blood has just passed through the tricuspid valve and entered the right ventricle. Contraction begins!',
        prompt: 'The blood has entered the right ventricle. Where should it go next?',
        options: [
          'To the lungs through the pulmonary artery',
          'To the rest of the body through the aorta',
          'To the left atrium directly',
        ],
        correctIndex: 0,
        hints: [
          'Check the oxygen status: blood in the right ventricle is still deoxygenated (dark blue-red) and needs gas exchange first.',
          'Arteries carry blood away from the heart, and "pulmonary" always refers to the lungs.',
        ],
        explanation:
          'From the right ventricle, deoxygenated blood is pumped through the semilunar valve into the pulmonary artery, which carries it to the lungs to release CO₂ and absorb fresh O₂.',
        optionFeedback: [
          'Spot on! The pulmonary artery is the only artery in adults that carries deoxygenated blood — straight from the right ventricle to the lungs.',
          'Not yet! The aorta leaves the left ventricle with oxygenated blood. Sending deoxygenated blood to the body would starve tissues of oxygen.',
          'A solid septum wall separates the right and left sides of a healthy mammalian heart so deoxygenated and oxygenated blood never mix.',
        ],
      },
      stage4Complete: {
        applicationChallenge: {
          prompt:
            'Freshly oxygenated blood now returns from the lungs via the pulmonary vein into the left atrium and enters the left ventricle. Why is the muscular wall of the left ventricle much thicker than the right ventricle?',
          options: [
            'It must generate high pressure to pump oxygenated blood through the aorta to the entire body',
            'It stores extra red blood cells during rest',
            'It filters carbon dioxide directly out of the blood plasma',
          ],
          correctIndex: 0,
          hints: [
            'Compare the distance: the right ventricle only pumps to the nearby lungs, whereas the left ventricle pumps from head to toe.',
            'Longer systemic distance requires stronger cardiac muscle contraction and higher blood pressure.',
          ],
          explanation:
            'The left ventricle pumps blood into the systemic circulation (head, organs, limbs), requiring far greater pressure than the short trip from the right ventricle to the lungs.',
        },
        teachBackChallenge: {
          prompt:
            'Dr. Amaka asks you to lock in the rule: Which exception makes the pulmonary artery and pulmonary vein famous in exam questions?',
          options: [
            'The pulmonary artery carries deoxygenated blood away from the heart, while the pulmonary vein carries oxygenated blood back to the heart',
            'Both the pulmonary artery and pulmonary vein carry oxygenated blood away from the heart',
            'Veins always carry oxygenated blood and arteries always carry deoxygenated blood',
          ],
          correctIndex: 0,
          hints: [
            'Remember: "Artery = Away from heart" and "Vein = Toward heart", regardless of oxygen level.',
            'Going away to the lungs means carrying deoxygenated blood; returning from the lungs means carrying oxygenated blood.',
          ],
          explanation:
            'Arteries always carry blood away from the heart and veins return blood to the heart. In the pulmonary circuit, blood going to the lungs is deoxygenated (pulmonary artery) and blood returning from the lungs is oxygenated (pulmonary vein).',
        },
        victoryNarrative:
          'Sinus rhythm restored! Oxygenated blood surges cleanly from the left ventricle through the aorta, saving the patient.',
      },
    },
    {
      id: 'bio-osmosis-rescue',
      worldId: 'bio',
      levelLabel: 'Level 05',
      title: 'Cellular Osmosis Emergency',
      subtitle:
        'Red blood cells are swelling and bursting in an IV line! Calibrate water potential and tonicity across semi-permeable membranes.',
      xpReward: 220,
      unlockTitle: 'Membrane Guardian',
      unlockEquipmentId: 'membrane-osmometer',
      stage1Discover: {
        hook: 'An incorrect drip was prepared in the field clinic! Red blood cells are changing shape rapidly.',
        companionIntro:
          'Osmosis is the net movement of water molecules from a dilute solution (higher water potential) to a more concentrated solution (lower water potential) across a selectively permeable membrane.',
        keyFacts: [
          {
            label: 'Hypotonic Solution (< 0.9% NaCl)',
            detail:
              'Higher water potential outside the cell: water rushes IN. Animal cells swell and burst (haemolysis); plant cells become turgid.',
          },
          {
            label: 'Isotonic Solution (0.9% NaCl)',
            detail:
              'Equal water potential inside and outside: zero net water movement, keeping red blood cells healthy and biconcave.',
          },
          {
            label: 'Hypertonic Solution (> 0.9% NaCl)',
            detail:
              'Lower water potential outside: water leaves the cell. Red blood cells shrink and wrinkle (crenation); plant cells undergo plasmolysis.',
          },
        ],
      },
      stage2Explore: {
        simulationKind: 'cell_osmosis',
        instruction:
          'Adjust the external saline concentration slider to observe hypotonic bursting, hypertonic shrinking, and stabilise the cell at isotonic 0.9% NaCl.',
        targetGoalLabel: 'Test extremes and lock onto isotonic 0.9% saline',
      },
      stage3Decision: {
        scenarioContext:
          'A dehydrated patient needs an intravenous drip. Pure distilled water (0.0% salt) and normal saline (0.9% salt) are on the tray.',
        prompt:
          'What happens to the patient’s red blood cells if pure distilled water is injected directly into the bloodstream?',
        options: [
          'Water enters the cells by osmosis until they swell and burst (haemolysis)',
          'Water leaves the cells by osmosis causing them to shrink (crenation)',
          'Cell walls prevent the red blood cells from bursting',
        ],
        correctIndex: 0,
        hints: [
          'Distilled water has a much higher water potential than red blood cell cytoplasm.',
          'Remember: animal cells (like red blood cells) have NO cellulose cell wall to stop them from bursting!',
        ],
        explanation:
          'Distilled water is strongly hypotonic relative to blood cytoplasm. Water rushes in by osmosis, and because animal cells lack a rigid cell wall, the red blood cells burst (haemolysis).',
      },
      stage4Complete: {
        applicationChallenge: {
          prompt:
            'Why does a plant cell placed in the exact same distilled water become firm (turgid) instead of bursting?',
          options: [
            'Its rigid, inelastic cellulose cell wall exerts turgor pressure that resists bursting',
            'Plant cell membranes block water molecules completely',
            'Chloroplasts pump excess water out using sunlight',
          ],
          correctIndex: 0,
          hints: [
            'Think about the structural outer layer found in plant cells but absent in animal cells.',
            'As the vacuole swells, it pushes against a strong outer wall.',
          ],
          explanation:
            'Plant cells possess a tough cellulose cell wall outside the plasma membrane. When water enters by osmosis, wall pressure balances osmotic intake, making the cell turgid rather than bursting.',
        },
        teachBackChallenge: {
          prompt:
            'Confirm your mastery: Which three conditions are always present whenever osmosis occurs?',
          options: [
            'Water molecules, a water-potential gradient, and a selectively permeable membrane',
            'ATP energy, carrier proteins, and movement against a concentration gradient',
            'Oxygen gas, dry air, and open stomata',
          ],
          correctIndex: 0,
          hints: [
            'Osmosis is passive (needs no ATP) and specifically moves water.',
            'What separates the two solutions of different concentrations?',
          ],
          explanation:
            'Osmosis is passive movement of water molecules down a water-potential gradient across a selectively (semi-) permeable membrane.',
        },
        victoryNarrative:
          'IV drip recalibrated to 0.9% isotonic saline! Red blood cells regain their healthy biconcave shape.',
      },
    },
    {
      id: 'bio-enzyme-mystery',
      worldId: 'bio',
      levelLabel: 'Level 06',
      title: 'The Enzyme Lock-and-Key Mystery',
      subtitle:
        'Digestive catalysis has ground to a halt! Tune temperature and pH without denaturing biological catalysts.',
      xpReward: 240,
      unlockTitle: 'Catalyst Master',
      unlockEquipmentId: 'catalyst-resonator',
      stage1Discover: {
        hook: 'Inside the metabolic reactor, starch and protein digestion has stalled because chamber pH and heat were misconfigured.',
        companionIntro:
          'Enzymes are biological catalysts made of protein. Each enzyme has a uniquely shaped active site complementary to its substrate — like a lock and key — and works best at its optimum temperature (~37°C in humans) and specific optimum pH.',
        keyFacts: [
          {
            label: 'Temperature Effect',
            detail:
              'Warming up to 37°C increases kinetic collisions, doubling rate per 10°C. Above ~45°C, hydrogen bonds break and the active site denatures irreversibly.',
          },
          {
            label: 'Specific pH Zones',
            detail:
              'Pepsin thrives in acidic stomach juice (pH ~2), salivary amylase prefers neutral pH (~7), and trypsin works in alkaline duodenum fluid (pH ~8).',
          },
          {
            label: 'Unchanged at End',
            detail:
              'An enzyme lowers activation energy and releases products while remaining chemically unchanged to catalyse thousands more reactions.',
          },
        ],
      },
      stage2Explore: {
        simulationKind: 'enzyme_curve',
        instruction:
          'Dial the chamber temperature to human optimum (37°C) and test stomach pH (2) vs intestinal pH (8) to watch the active site catalyse substrates.',
        targetGoalLabel: 'Reach peak catalytic rate at 37°C without denaturing',
      },
      stage3Decision: {
        scenarioContext:
          'You need pepsin to digest dietary protein inside the stomach chamber, which contains hydrochloric acid.',
        prompt: 'Which temperature and pH setting will give pepsin its maximum reaction rate?',
        options: [
          '37°C and pH 2.0 (strongly acidic)',
          '65°C and pH 2.0 (boiling acidic)',
          '37°C and pH 8.5 (alkaline)',
        ],
        correctIndex: 0,
        hints: [
          'At 65°C, human protein enzymes lose their 3D active site shape.',
          'Gastric juice in the stomach contains HCl — is that acidic or alkaline?',
        ],
        explanation:
          'Human pepsin has an optimum temperature of 37°C (body temperature) and an optimum acidic pH around 2.0 provided by stomach HCl.',
      },
      stage4Complete: {
        applicationChallenge: {
          prompt:
            'A technician heats an enzyme solution to 75°C for 10 minutes, then cools it back down to 37°C. Why does reaction rate stay at zero?',
          options: [
            'Extreme heat irreversibly denatured the protein, permanently altering its active site shape',
            'The enzyme was used up completely as a reactant',
            'Enzymes freeze solid whenever cooled back to 37°C',
          ],
          correctIndex: 0,
          hints: [
            'Think about boiling an egg white: does cooling it turn it liquid again?',
            'When the active site loses its 3D shape, the substrate can no longer fit.',
          ],
          explanation:
            'Denaturation above ~60°C breaks intramolecular bonds holding the protein’s 3D active site. Cooling cannot restore the complementary shape, unlike low-temperature inactivation which is reversible.',
        },
        teachBackChallenge: {
          prompt:
            'Contrast low temperature (5°C) with high temperature (70°C) on human enzymes:',
          options: [
            '5°C merely slows kinetic collisions (reversible inactivation), whereas 70°C destroys the active site shape (irreversible denaturation)',
            'Both 5°C and 70°C permanently denature the active site',
            '5°C speeds up enzymes while 70°C slows them down slightly',
          ],
          correctIndex: 0,
          hints: [
            'Why can biological samples be stored safely in a refrigerator and work again when warmed to 37°C?',
            'Low kinetic energy slows collisions without breaking protein folding.',
          ],
          explanation:
            'At 5°C, molecules move slowly so enzymes are inactive but intact (warming restores activity). At 70°C, thermal agitation unfolds the active site permanently.',
        },
        victoryNarrative:
          'Metabolic reactor stabilised! Substrates lock cleanly into intact active sites at 37°C.',
      },
    },
  ],
  boss: {
    id: 'boss-bio-systemic',
    worldId: 'bio',
    name: 'Systemic Collapse Titan',
    title: 'Multi-Organ Crisis Boss Battle',
    premise:
      'Combine your mastery of heart circulation, cellular osmosis, and enzyme catalysis to stabilise all vital signs before shield integrity runs out!',
    xpReward: 320,
    unlockTitle: 'Chief Bio-Commander',
    questions: [
      {
        id: 'bb-1',
        phaseLabel: 'Phase 1 · Cardiac Valve Check',
        telegraph: 'Backflow pressure spike detected between the left atrium and left ventricle!',
        q: 'Which valve prevents oxygenated blood in the left ventricle from flowing backward into the left atrium during systole?',
        options: [
          'Bicuspid (mitral) valve',
          'Tricuspid valve',
          'Pulmonary semilunar valve',
          'Hepatic portal valve',
        ],
        correctIndex: 0,
        explanation:
          'The bicuspid (mitral) valve guards the opening between the left atrium and left ventricle; the tricuspid valve is on the right side.',
      },
      {
        id: 'bb-2',
        phaseLabel: 'Phase 2 · Vessel Oxygen Audit',
        telegraph: 'Sensor scan on the four great vessels connected to the heart!',
        q: 'Which blood vessel carries freshly oxygenated blood directly from the lungs into the left atrium?',
        options: ['Pulmonary vein', 'Pulmonary artery', 'Vena cava', 'Renal artery'],
        correctIndex: 0,
        explanation:
          'The pulmonary vein brings oxygenated blood from the lungs to the left atrium.',
      },
      {
        id: 'bb-3',
        phaseLabel: 'Phase 3 · Plasma Tonicity Surge',
        telegraph: 'Blood plasma salt concentration spikes to 2.2% hypertonic!',
        q: 'How will red blood cells respond if surrounded by a strongly hypertonic 2.2% salt solution?',
        options: [
          'They lose water by osmosis and shrink/wrinkle (crenation)',
          'They gain water by osmosis and burst (haemolysis)',
          'They divide rapidly by mitosis',
          'They become turgid due to their cellulose wall',
        ],
        correctIndex: 0,
        explanation:
          'In a hypertonic medium, water leaves red blood cells down the water-potential gradient, causing crenation.',
      },
      {
        id: 'bb-4',
        phaseLabel: 'Phase 4 · Duodenal pH Shift',
        telegraph: 'Chyme moves from the acidic stomach (pH 2) into the alkaline duodenum (pH 8)!',
        q: 'What happens to stomach pepsin once food enters the alkaline duodenum (pH 8), and which protease takes over?',
        options: [
          'Pepsin loses activity as pH shifts away from 2, and pancreatic trypsin takes over at pH ~8',
          'Pepsin speeds up tenfold in alkaline bile',
          'Salivary ptyalin digests all proteins at pH 8',
          'Hydrochloric acid is secreted by the pancreas',
        ],
        correctIndex: 0,
        explanation:
          'Bile and pancreatic juice neutralise chyme to ~pH 8, halting pepsin while activating pancreatic trypsin.',
      },
      {
        id: 'bb-5',
        phaseLabel: 'Final Phase · Full-System Synthesis',
        telegraph: 'Final resuscitation pulse charging!',
        q: 'Why do active cardiac muscle cells contain an unusually high density of mitochondria?',
        options: [
          'To supply continuous ATP via aerobic respiration so heart muscle contracts rhythmically without fatigue',
          'To carry oxygen using haemoglobin',
          'To digest starch into maltose',
          'To store excess urea for excretion',
        ],
        correctIndex: 0,
        explanation:
          'Cardiac muscle contracts nonstop throughout life and relies on abundant mitochondria for continuous aerobic ATP synthesis.',
      },
    ],
  },
};

const CHEMISTRY_WORLD: SubjectWorldDef = {
  worldId: 'chem',
  subjectName: 'Chemistry',
  worldTitle: "The Alchemist's Lab",
  tagline:
    'Mix elements, investigate reactions and discover why substances behave differently.',
  heroMissionHeadline: 'Decode the Unknown Element',
  roleIdentity: 'Master Alchemist & Reaction Investigator',
  companionName: 'Prof. Spark',
  companionRole: 'Chief Reaction Alchemist',
  keyArtUrl: chemWorldArt,
  fallbackGradient: 'linear-gradient(135deg, #0D231E 0%, #134E4A 55%, #3B2106 100%)',
  accentHex: '#10B981',
  icon: 'flask',
  missions: [
    {
      id: 'chem-unknown-element',
      worldId: 'chem',
      levelLabel: 'Level 03',
      title: 'Decode the Unknown Element',
      subtitle:
        'A glowing crystalline sample arrived unlabelled! Use atomic number, electron shells (2,8,x) and periodic trends to identify its reactivity.',
      xpReward: 240,
      unlockTitle: 'Element Decoder',
      unlockEquipmentId: 'alchemist-spectacles',
      stage1Discover: {
        hook: 'An unknown reactive metal sits sealed under argon oil. Dropping the wrong reagent could trigger a violent hydrogen flash!',
        companionIntro:
          'Every element’s chemical personality comes from its valence (outermost) electrons! The number of occupied shells tells you the Period, while the number of outer electrons tells you the Group.',
        keyFacts: [
          {
            label: 'Atomic Number (Z)',
            detail:
              'Equals the number of protons in the nucleus — and in a neutral atom, equals the total number of electrons.',
          },
          {
            label: 'Shell Filling (2, 8, 8, 2)',
            detail:
              'Element Z = 11 configures as 2, 8, 1: 3 shells (Period 3) and 1 valence electron (Group 1 Alkali Metal — Sodium!).',
          },
          {
            label: 'Ion Formation',
            detail:
              'Group 1 metals lose 1 outer electron to form +1 cations (Na⁺), whereas Group 17 halogens gain 1 electron to form −1 anions (Cl⁻).',
          },
        ],
      },
      stage2Explore: {
        simulationKind: 'chem_atom',
        instruction:
          'Configure the unknown atom’s proton/electron count to Z = 11 (2, 8, 1) and Z = 17 (2, 8, 7) to inspect their valence shells.',
        targetGoalLabel: 'Inspect Alkali Metal (Z=11) and Halogen (Z=17) shells',
      },
      stage3Decision: {
        scenarioContext:
          'Spectroscopy confirms the unknown sample has atomic number Z = 11 and mass number A = 23.',
        prompt:
          'What is the electronic configuration of this neutral atom, and what happens when it reacts with chlorine (Z = 17)?',
        options: [
          'Configuration 2, 8, 1 — it transfers 1 outer electron to chlorine to form an electrovalent (ionic) compound NaCl',
          'Configuration 2, 8, 2 — it shares 2 electrons covalently to form a gas',
          'Configuration 2, 9 — it is an unreactive noble gas',
        ],
        correctIndex: 0,
        hints: [
          'First shell holds at most 2 electrons; second shell holds at most 8. How many remain out of 11?',
          'A metal (2,8,1) meeting a non-metal (2,8,7) transfers 1 electron so both achieve a stable octet (2,8 and 2,8,8).',
        ],
        explanation:
          'Z = 11 arranges as 2, 8, 1 (Sodium). Donating its 1 valence electron to Chlorine (2, 8, 7) gives Na⁺ (2,8) and Cl⁻ (2,8,8), forming high-melting ionic NaCl.',
      },
      stage4Complete: {
        applicationChallenge: {
          prompt:
            'How many neutrons are inside the nucleus of this Z = 11, A = 23 sodium atom, and why does molten NaCl conduct electricity while solid NaCl does not?',
          options: [
            '12 neutrons; melting frees Na⁺ and Cl⁻ ions from the rigid crystal lattice so they can move and carry charge',
            '23 neutrons; melting creates free delocalised electrons',
            '11 neutrons; solid NaCl has no ions until heated',
          ],
          correctIndex: 0,
          hints: [
            'Neutrons = Mass number (A) − Atomic number (Z) = 23 − 11.',
            'Ionic solids already contain ions, but they are locked in fixed positions until melted or dissolved in water.',
          ],
          explanation:
            'Neutrons = 23 − 11 = 12. Solid NaCl has ions locked in a lattice; melting or dissolving mobilises Na⁺ and Cl⁻ ions to carry electric current.',
        },
        teachBackChallenge: {
          prompt:
            'Prof. Spark’s mastery check: Two atoms have Z = 17, A = 35 and Z = 17, A = 37. Why do they show identical chemical reactions?',
          options: [
            'They are isotopes with the exact same electronic configuration (2, 8, 7), and chemical reactions depend on valence electrons',
            'They have the same number of neutrons in their nuclei',
            'Mass number alone determines chemical group',
          ],
          correctIndex: 0,
          hints: [
            'Same Z = 17 means both have 17 protons and 17 electrons.',
            'Chemical bonding involves outer electrons, not neutron count.',
          ],
          explanation:
            'Isotopes share the same atomic number (17 protons, 17 electrons → 2,8,7) and differ only in neutron count (18 vs 20), so their chemical behaviour is identical.',
        },
        victoryNarrative:
          'Unknown crystal decoded! You safely neutralised and catalogued Period 3 Sodium and its isotopic chlorine partner.',
      },
    },
    {
      id: 'chem-acid-neutralise',
      worldId: 'chem',
      levelLabel: 'Level 04',
      title: 'Neutralise the Acid Reactor',
      subtitle:
        'A hydrochloric acid vat is at pH 1! Calculate exact molar neutralisation so you hit pH 7.0 without overshooting into caustic alkali.',
      xpReward: 230,
      unlockTitle: 'Stoichiometry Alchemist',
      stage1Discover: {
        hook: 'Corrosive HCl fumes fill the chamber! You must meter NaOH through the brass burette to reach exact equivalence.',
        companionIntro:
          'Neutralisation pairs H⁺(aq) from an acid with OH⁻(aq) from an alkali to form neutral water: H⁺ + OH⁻ → H₂O. Using CₐVₐ / CᵦVᵦ = nₐ / nᵦ lets you calculate the exact volume before opening the valve!',
        keyFacts: [
          {
            label: 'pH Scale (0 to 14)',
            detail:
              'pH < 7 is acidic (high [H⁺]), pH = 7 is neutral, and pH > 7 is alkaline (high [OH⁻]). Every 1 unit drop in pH means 10× higher [H⁺].',
          },
          {
            label: 'Mole Ratio Matters',
            detail:
              'HCl + NaOH is 1 : 1, whereas diprotic H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O requires 2 moles of NaOH per 1 mole of acid!',
          },
        ],
      },
      stage2Explore: {
        simulationKind: 'chem_atom',
        instruction:
          'Use the laboratory explorer to inspect Proton/Electron balance so you understand H⁺ (Z=1 without its electron) vs Na⁺ (Z=11 ion).',
        targetGoalLabel: 'Verify atomic species involved in neutralisation',
      },
      stage3Decision: {
        scenarioContext:
          'The reactor holds 25.0 cm³ of 0.20 mol/dm³ H₂SO₄ (diprotic acid). Your supply tank contains 0.20 mol/dm³ NaOH.',
        prompt:
          'What exact volume of 0.20 mol/dm³ NaOH must you release to completely neutralise 25.0 cm³ of 0.20 mol/dm³ H₂SO₄?',
        options: ['50.0 cm³ of NaOH', '25.0 cm³ of NaOH', '12.5 cm³ of NaOH'],
        correctIndex: 0,
        hints: [
          'Write the balanced equation: H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O (mole ratio nₐ : nᵦ = 1 : 2).',
          'Since concentrations are equal (0.20 M), you need twice the volume of NaOH!',
        ],
        explanation:
          'Using (CₐVₐ)/(CᵦVᵦ) = 1/2: (0.20 × 25.0)/(0.20 × Vᵦ) = 1/2 ⇒ Vᵦ = 50.0 cm³.',
      },
      stage4Complete: {
        applicationChallenge: {
          prompt:
            'Which indicator is best suited for a titration between a weak acid (ethanoic acid) and a strong base (NaOH)?',
          options: [
            'Phenolphthalein (changes colour in the alkaline Equivalence range ~8.2–10)',
            'Methyl orange (changes in the strongly acidic range 3.1–4.4)',
            'Blue litmus paper dipped once at the start',
          ],
          correctIndex: 0,
          hints: [
            'Weak acid + strong base produces a slightly alkaline salt solution at equivalence.',
            'Choose the indicator whose pH transition matches the steep vertical jump above pH 7.',
          ],
          explanation:
            'Weak acid vs strong base has its equivalence point above pH 7 (~8.7), making phenolphthalein the sharp, accurate choice.',
        },
        teachBackChallenge: {
          prompt:
            'If Solution X has pH 2 and Solution Y has pH 5, how does the hydrogen ion concentration [H⁺] of X compare to Y?',
          options: [
            'Solution X has 1,000 times (10³×) higher [H⁺] than Solution Y',
            'Solution X has 3 times higher [H⁺] than Solution Y',
            'Solution Y is more acidic than Solution X',
          ],
          correctIndex: 0,
          hints: [
            'Remember pH = −log₁₀[H⁺]: each 1 unit difference is a factor of 10.',
            'A difference of 3 pH units (5 − 2 = 3) equals 10 × 10 × 10.',
          ],
          explanation:
            'pH is logarithmic: [H⁺] = 10⁻² vs 10⁻⁵ mol/dm³, so pH 2 is 10³ = 1,000 times more concentrated in H⁺ ions than pH 5.',
        },
        victoryNarrative:
          'Burette locked at 50.0 cm³ — reactor settles cleanly at neutral pH 7.0!',
      },
    },
  ],
  boss: {
    id: 'boss-chem-core',
    worldId: 'chem',
    name: 'The Unstable Isotope Sentinel',
    title: 'Alchemist Sanctum Boss Battle',
    premise: 'Prove your mastery of atomic structure, bonding, pH, and gas stoichiometry!',
    xpReward: 300,
    unlockTitle: 'Grand Alchemist',
    questions: [
      {
        id: 'cb-1',
        phaseLabel: 'Phase 1 · Periodic Identity',
        telegraph: 'Valence scanner sweeps an element with configuration 2, 8, 6!',
        q: 'To which Group and Period does an element with electronic configuration 2, 8, 6 belong?',
        options: [
          'Group 16 (VI) and Period 3',
          'Group 6 and Period 6',
          'Group 3 and Period 6',
          'Group 18 and Period 3',
        ],
        correctIndex: 0,
        explanation:
          '3 occupied shells = Period 3; 6 valence electrons = Group VI (IUPAC Group 16, Sulfur).',
      },
      {
        id: 'cb-2',
        phaseLabel: 'Phase 2 · Bond Architecture',
        telegraph: 'High-melting white crystal resists thermal cleavage!',
        q: 'Why does magnesium oxide (MgO) have a much higher melting point than sodium chloride (NaCl)?',
        options: [
          'Mg²⁺ and O²⁻ carry double charges (±2), creating much stronger electrostatic attraction in the ionic lattice',
          'MgO is a giant covalent network like diamond',
          'NaCl is held together only by weak van der Waals forces',
          'MgO is a liquid at room temperature',
        ],
        correctIndex: 0,
        explanation:
          'Lattice energy increases sharply with ionic charge: +2/−2 attraction in MgO far exceeds +1/−1 in NaCl.',
      },
      {
        id: 'cb-3',
        phaseLabel: 'Phase 3 · Redox Audit',
        telegraph: 'Electron transfer arc jumps across the electrochemical cell!',
        q: 'In the reaction Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s), what happens to Zinc?',
        options: [
          'Zinc loses 2 electrons — it is oxidised and acts as the reducing agent',
          'Zinc gains 2 electrons — it is reduced',
          'Zinc acts as the oxidising agent',
          'Its oxidation number decreases from +2 to 0',
        ],
        correctIndex: 0,
        explanation:
          'OIL RIG: Oxidation Is Loss of electrons (Zn → Zn²⁺ + 2e⁻), making Zn the reducing agent that reduces Cu²⁺.',
      },
      {
        id: 'cb-4',
        phaseLabel: 'Final Phase · Molar Gas Lock',
        telegraph: 'Gas pressure rises at STP (22.4 dm³/mol)!',
        q: 'What volume of carbon(IV) oxide (CO₂) is liberated at STP when 0.50 mol of CaCO₃ decomposes completely (CaCO₃ → CaO + CO₂)?',
        options: ['11.2 dm³', '22.4 dm³', '44.8 dm³', '5.6 dm³'],
        correctIndex: 0,
        explanation:
          '1 mol CaCO₃ yields 1 mol CO₂, so 0.50 mol yields 0.50 × 22.4 dm³ = 11.2 dm³ at STP.',
      },
    ],
  },
};

const PHYSICS_WORLD: SubjectWorldDef = {
  worldId: 'phys',
  subjectName: 'Physics',
  worldTitle: 'The Laws of the Universe',
  tagline:
    'Control gravity, launch rockets, solve energy puzzles and experiment with motion.',
  heroMissionHeadline: "Escape Earth's Gravity",
  roleIdentity: 'Orbital Commander & Energy Engineer',
  companionName: 'Dr. Faraday',
  companionRole: 'Chief Orbital Physicist',
  keyArtUrl: physWorldArt,
  fallbackGradient: 'linear-gradient(135deg, #090D24 0%, #1E1B4B 55%, #431407 100%)',
  accentHex: '#38BDF8',
  icon: 'atom',
  missions: [
    {
      id: 'phys-escape-gravity',
      worldId: 'phys',
      levelLabel: 'Level 04',
      title: "Escape Earth's Gravity",
      subtitle:
        'Launch the research probe cleanly out of Earth’s gravitational well by mastering thrust, weight, and escape velocity.',
      xpReward: 250,
      unlockTitle: 'Orbital Commander',
      unlockEquipmentId: 'orbital-thruster-core',
      stage1Discover: {
        hook: 'Countdown is at T-minus 90 seconds! Too little velocity drops the probe back to Earth; exact orbital physics sends it to the stars.',
        companionIntro:
          'To break free of a planet’s gravitational pull without further propulsion, kinetic energy (½mv²) must match gravitational potential energy (GMm/R). Watch what cancels out: the rocket’s own mass m!',
        keyFacts: [
          {
            label: 'Net Launch Acceleration',
            detail:
              'By Newton’s Second Law: F_net = Thrust − mg = ma. Thrust must exceed weight (mg) just to lift off the pad!',
          },
          {
            label: 'Orbital vs Escape Speed',
            detail:
              'Low-Earth circular orbit needs v_o = √(gR) ≈ 7.9 km/s, whereas full escape velocity needs v_e = √(2gR) ≈ 11.2 km/s.',
          },
          {
            label: 'Mass Independence',
            detail:
              'Because v_e = √(2gR), a 500 kg probe and a 50,000 kg spacecraft require the exact same 11.2 km/s escape speed!',
          },
        ],
      },
      stage2Explore: {
        simulationKind: 'phys_gravity',
        instruction:
          'Dial launch velocity from sub-orbital (< 7.9 km/s) through stable orbit (7.9 km/s) up to Earth escape velocity (11.2 km/s).',
        targetGoalLabel: 'Achieve clean escape trajectory at ≥ 11.2 km/s',
      },
      stage3Decision: {
        scenarioContext:
          'Mission Control doubles the payload mass of your probe from 1,000 kg to 2,000 kg while launching from the same Earth pad (g = 9.8 m/s², R = 6.4 × 10⁶ m).',
        prompt:
          'How does doubling the probe’s mass affect the escape velocity required to leave Earth’s gravitational field?',
        options: [
          'Escape velocity stays unchanged at 11.2 km/s (though engines must supply twice the kinetic energy)',
          'Escape velocity doubles to 22.4 km/s',
          'Escape velocity drops by half to 5.6 km/s',
        ],
        correctIndex: 0,
        hints: [
          'Look closely at the formula v_e = √(2gR) — does the probe’s mass m appear anywhere inside the square root?',
          'Equating ½mv² = mgR cancels m from both sides!',
        ],
        explanation:
          'Escape velocity v_e = √(2gR) depends only on the planet’s mass/gravity and radius, never on the mass of the escaping object (though heavier rockets require more fuel to reach 11.2 km/s).',
      },
      stage4Complete: {
        applicationChallenge: {
          prompt:
            'At liftoff, your 2,000 kg rocket fires engines producing 30,000 N of upward thrust (take g = 10 m/s²). What is its initial upward acceleration?',
          options: [
            '5.0 m/s² upward',
            '15.0 m/s² upward',
            '10.0 m/s² upward',
          ],
          correctIndex: 0,
          hints: [
            'First subtract downward weight W = mg = 2,000 × 10 = 20,000 N from the 30,000 N upward thrust.',
            'Now divide net force F_net = 10,000 N by mass m = 2,000 kg!',
          ],
          explanation:
            'Weight = mg = 20,000 N. Net upward force = 30,000 − 20,000 = 10,000 N. Acceleration a = F_net / m = 10,000 / 2,000 = 5.0 m/s².',
        },
        teachBackChallenge: {
          prompt:
            'How is Earth’s escape velocity (v_e) mathematically related to its close-surface circular orbital velocity (v_o = √(gR))?',
          options: [
            'v_e = √2 × v_o',
            'v_e = 2 × v_o',
            'v_e = ½ × v_o',
          ],
          correctIndex: 0,
          hints: [
            'Compare √(2gR) with √(gR).',
            'Factor out √2 from √(2gR)!',
          ],
          explanation:
            'Since v_o = √(gR) and v_e = √(2gR), escape velocity is exactly √2 (≈ 1.414) times circular orbital velocity.',
        },
        victoryNarrative:
          'Main engine cut-off confirmed at 11.2 km/s! Your probe glides cleanly onto a deep-space hyperbolic trajectory.',
      },
    },
    {
      id: 'phys-power-grid',
      worldId: 'phys',
      levelLabel: 'Level 05',
      title: 'Stabilise the Station Power Grid',
      subtitle:
        'Life-support modules are tripping breakers! Balance voltage, resistance, and parallel vs series circuits using Ohm’s Law.',
      xpReward: 240,
      unlockTitle: 'Grid Engineer',
      stage1Discover: {
        hook: 'Solar arrays deliver 24 V DC, but connecting habitats in series dimmed every life-support lamp!',
        companionIntro:
          'In a parallel circuit, every branch receives the full supply voltage and operates independently. Adding another parallel resistor actually lowers total equivalent resistance!',
        keyFacts: [
          {
            label: 'Ohm’s Law (V = IR)',
            detail:
              'Current I = V / R. Doubling resistance at constant voltage halves the current.',
          },
          {
            label: 'Series vs Parallel Resistance',
            detail:
              'Series: R_total = R₁ + R₂. Parallel: 1/R_total = 1/R₁ + 1/R₂ (so two equal 6 Ω resistors in parallel give 3 Ω!).',
          },
        ],
      },
      stage2Explore: {
        simulationKind: 'phys_gravity',
        instruction:
          'Explore energy conservation on the orbital bench before locking in the station’s electrical load equations.',
        targetGoalLabel: 'Calibrate orbital station energy telemetry',
      },
      stage3Decision: {
        scenarioContext:
          'You connect two identical 6 Ω habitat heaters in parallel across a 12 V battery bank with negligible internal resistance.',
        prompt:
          'What is the combined equivalent resistance of the two 6 Ω heaters in parallel, and what total current leaves the 12 V battery?',
        options: [
          '3 Ω equivalent resistance; 4 A total current',
          '12 Ω equivalent resistance; 1 A total current',
          '3 Ω equivalent resistance; 2 A total current',
        ],
        correctIndex: 0,
        hints: [
          'For two resistors in parallel: R_eq = (R₁ × R₂) / (R₁ + R₂) = 36 / 12 = 3 Ω.',
          'Now apply I = V / R_eq = 12 V / 3 Ω.',
        ],
        explanation:
          'Two 6 Ω branches in parallel have R_eq = 3 Ω. Total current from the 12 V supply is I = 12 / 3 = 4 A (2 A through each branch).',
      },
      stage4Complete: {
        applicationChallenge: {
          prompt:
            'Why are domestic and space-station appliances wired in parallel rather than in series?',
          options: [
            'Each appliance receives the full rated supply voltage and keeps working if another branch switches off',
            'Parallel wiring reduces total current drawn from the source to zero',
            'Series wiring gives every bulb a higher voltage than the battery',
          ],
          correctIndex: 0,
          hints: [
            'What happens to a string of series bulbs if just one filament blows?',
            'In parallel, each branch connects directly across the full voltage rails.',
          ],
          explanation:
            'Parallel wiring ensures independent switching and full supply voltage across every load.',
        },
        teachBackChallenge: {
          prompt:
            'How much electrical energy (E = IVt) is converted by a 12 V, 2 A heater running for 5 minutes (300 seconds)?',
          options: ['7,200 J (7.2 kJ)', '120 J', '2,400 J'],
          correctIndex: 0,
          hints: [
            'Always convert time into SI seconds first: 5 minutes = 5 × 60 = 300 s!',
            'Multiply E = V × I × t = 12 × 2 × 300.',
          ],
          explanation:
            'Power P = IV = 2 × 12 = 24 W. In 300 seconds, Energy E = 24 × 300 = 7,200 J.',
        },
        victoryNarrative:
          'Station grid balanced! Parallel buses hold rock-steady at 12 V across all habitats.',
      },
    },
  ],
  boss: {
    id: 'boss-phys-cosmos',
    worldId: 'phys',
    name: 'Singularity Guardian',
    title: 'Orbital Physics Boss Battle',
    premise: 'Combine mechanics, gravity, optics, and electricity to hold the orbital station!',
    xpReward: 320,
    unlockTitle: 'Laws of Nature Master',
    questions: [
      {
        id: 'pb-1',
        phaseLabel: 'Phase 1 · Projectile Kinematics',
        telegraph: 'Booster stage separates vertically at 40 m/s (g = 10 m/s²)!',
        q: 'A test pod is projected vertically upward at u = 40 m/s (g = 10 m/s²). What maximum height does it reach above launch point?',
        options: ['80 m', '160 m', '40 m', '20 m'],
        correctIndex: 0,
        explanation: 'At max height v = 0: H = u² / (2g) = 1600 / 20 = 80 m.',
      },
      {
        id: 'pb-2',
        phaseLabel: 'Phase 2 · Total Internal Reflection',
        telegraph: 'Laser comms beam enters glass fibre core!',
        q: 'Which two conditions are strictly required for Total Internal Reflection of light?',
        options: [
          'Light must travel from optically denser to less dense medium, and angle of incidence must exceed the critical angle',
          'Light must travel from air into glass at 90°',
          'Angle of incidence must be smaller than the critical angle',
          'The two media must have identical refractive indices',
        ],
        correctIndex: 0,
        explanation:
          'TIR occurs only when light goes from higher refractive index to lower refractive index with i > c.',
      },
      {
        id: 'pb-3',
        phaseLabel: 'Phase 3 · Gravitational Field Scaling',
        telegraph: 'Orbiting probe moves from surface radius R out to distance 2R from Earth’s centre!',
        q: 'If a satellite moves from Earth’s surface (distance R from centre) to an orbit at distance 2R from Earth’s centre, gravitational force becomes:',
        options: ['One-quarter (¼) of its surface weight', 'One-half (½) of its surface weight', 'Twice its surface weight', 'Zero'],
        correctIndex: 0,
        explanation:
          'By Newton’s inverse-square law F ∝ 1/r², doubling r from R to 2R reduces gravitational force to 1/(2²) = ¼.',
      },
      {
        id: 'pb-4',
        phaseLabel: 'Final Phase · Transformer Core',
        telegraph: 'Step-down transformer hums at 240 V primary!',
        q: 'An ideal step-down transformer has 1,200 primary turns and 120 secondary turns on a 240 V AC supply. What is the secondary output voltage?',
        options: ['24 V', '2,400 V', '12 V', '48 V'],
        correctIndex: 0,
        explanation: 'V_s / V_p = N_s / N_p ⇒ V_s = 240 × (120 / 1200) = 24 V.',
      },
    ],
  },
};

const MATHS_WORLD: SubjectWorldDef = {
  worldId: 'maths',
  subjectName: 'Mathematics',
  worldTitle: 'The Puzzle Kingdom',
  tagline:
    'Solve mathematical puzzles, unlock doors and use calculations to overcome obstacles.',
  heroMissionHeadline: 'Unlock the Ancient Temple',
  roleIdentity: 'Grand Architect & Cipher Solver',
  companionName: 'Master Chike',
  companionRole: 'Keeper of the Geometric Seals',
  keyArtUrl: mathsWorldArt,
  fallbackGradient: 'linear-gradient(135deg, #271C09 0%, #5C3D0E 55%, #1E293B 100%)',
  accentHex: '#F59E0B',
  icon: 'sigma',
  missions: [
    {
      id: 'maths-ancient-temple',
      worldId: 'maths',
      levelLabel: 'Level 03',
      title: 'Unlock the Ancient Temple',
      subtitle:
        'Two stone pillars guard the inner sanctum! Align the parabolic arch and solve quadratic roots to lower the golden drawbridge.',
      xpReward: 250,
      unlockTitle: 'Temple Cipher',
      unlockEquipmentId: 'temple-astrolabe-key',
      stage1Discover: {
        hook: 'Carved into the sandstone gate is the equation x² − 7x + 12 = 0. Only setting the two root dial stones to the exact x-intercepts opens the seal!',
        companionIntro:
          'Every quadratic equation ax² + bx + c = 0 forms a symmetrical parabola! Where the arch crosses ground level (y = 0) are its roots — and for x² − (α + β)x + αβ = 0, the sum of roots is −b/a and their product is c/a.',
        keyFacts: [
          {
            label: 'Factorising x² + bx + c = 0',
            detail:
              'Find two numbers that multiply to c and add to b. For x² − 7x + 12 = 0: (−3) × (−4) = +12 and (−3) + (−4) = −7 → (x − 3)(x − 4) = 0.',
          },
          {
            label: 'Sign Flip From Factor to Root',
            detail:
              'If (x − 3)(x − 4) = 0, then x = +3 or x = +4 (watch out for the classic sign-flip trap!).',
          },
          {
            label: 'Axis of Symmetry',
            detail:
              'The peak/trough sits halfway between the two roots at x = −b / (2a). Between 3 and 4, symmetry is at x = 3.5.',
          },
        ],
      },
      stage2Explore: {
        simulationKind: 'math_temple',
        instruction:
          'Set the two sandstone root dials so the parabolic stone arch lands cleanly on pillars x = 3 and x = 4.',
        targetGoalLabel: 'Align parabolic bridge roots to x = 3 and x = 4',
      },
      stage3Decision: {
        scenarioContext:
          'The inner sanctum door displays a second quadratic seal: 2x² − 5x − 3 = 0.',
        prompt: 'Which pair of root values (x) unlocks the seal 2x² − 5x − 3 = 0?',
        options: [
          'x = 3 and x = −½',
          'x = −3 and x = +½',
          'x = 3 and x = +½',
        ],
        correctIndex: 0,
        hints: [
          'Multiply a × c = 2 × (−3) = −6. Which two numbers multiply to −6 and add to −5? (−6 and +1!)',
          'Factorise 2x² − 6x + x − 3 = 2x(x − 3) + 1(x − 3) = (2x + 1)(x − 3) = 0.',
        ],
        explanation:
          '(2x + 1)(x − 3) = 0 gives 2x + 1 = 0 ⇒ x = −½, or x − 3 = 0 ⇒ x = 3.',
      },
      stage4Complete: {
        applicationChallenge: {
          prompt:
            'The Architect asks you to build a reverse seal: Which quadratic equation has roots x = −2 and x = 5?',
          options: [
            'x² − 3x − 10 = 0',
            'x² + 3x − 10 = 0',
            'x² − 7x + 10 = 0',
          ],
          correctIndex: 0,
          hints: [
            'Sum of roots α + β = (−2) + 5 = +3; Product αβ = (−2)(5) = −10.',
            'Substitute into x² − (sum)x + (product) = 0!',
          ],
          explanation:
            'Sum = 3, Product = −10. Using x² − (sum)x + (product) = 0 gives x² − 3x − 10 = 0.',
        },
        teachBackChallenge: {
          prompt:
            'What does the discriminant Δ = b² − 4ac tell you when b² − 4ac = 0?',
          options: [
            'The parabola touches the x-axis at one single point — the equation has two equal (repeated) real roots',
            'The equation has no real roots at all',
            'The equation has two distinct irrational roots',
          ],
          correctIndex: 0,
          hints: [
            'Look at x = (−b ± √(b² − 4ac)) / 2a when the square root becomes √0.',
            'Adding and subtracting 0 gives the exact same value −b / (2a).',
          ],
          explanation:
            'When b² − 4ac = 0, ±√Δ vanishes, leaving one repeated real root x = −b/(2a) where the parabola is tangent to the x-axis.',
        },
        victoryNarrative:
          'Astrolabe rings click into alignment! The ancient sandstone temple gates swing wide open.',
      },
    },
    {
      id: 'maths-circle-chasm',
      worldId: 'maths',
      levelLabel: 'Level 04',
      title: 'Bridge the Chasm of Angles',
      subtitle:
        'Rotate the celestial astrolabe using Circle Theorems to project the light bridge across the canyon!',
      xpReward: 230,
      unlockTitle: 'Geometry Sovereign',
      stage1Discover: {
        hook: 'Light enters the circular lens ring at chord AB. You must calculate the inscribed angle at the rim to focus the beam!',
        companionIntro:
          'Three golden Circle Theorems solve 90% of geometry puzzles: (1) Angle at the centre is twice the angle at the circumference, (2) Angle in a semicircle is 90°, and (3) Opposite angles of a cyclic quadrilateral add up to 180°.',
        keyFacts: [
          {
            label: 'Centre = 2 × Circumference',
            detail:
              'If arc AB subtends 110° at centre O, it subtends 55° at any point on the remaining circumference.',
          },
          {
            label: 'Cyclic Quadrilateral',
            detail:
              'When all 4 vertices touch the circle, opposite interior angles sum to 180°.',
          },
        ],
      },
      stage2Explore: {
        simulationKind: 'math_temple',
        instruction:
          'Calibrate the temple geometric arch to verify symmetry before firing the astrolabe beam.',
        targetGoalLabel: 'Verify temple geometric symmetry',
      },
      stage3Decision: {
        scenarioContext:
          'Chord PQ subtends an angle of 136° at the centre O of the astrolabe ring.',
        prompt:
          'What angle does chord PQ subtend at a point R on the major arc of the circumference?',
        options: ['68°', '136°', '44°'],
        correctIndex: 0,
        hints: [
          'Angle at the centre = 2 × Angle at the circumference.',
          'Divide 136° by 2!',
        ],
        explanation:
          'By the angle-at-the-centre theorem, ∠PRQ = ½ × ∠POQ = ½ × 136° = 68°.',
      },
      stage4Complete: {
        applicationChallenge: {
          prompt:
            'Points P, Q, R, S lie on the circle forming cyclic quadrilateral PQRS. If ∠PQR = 68°, what is the opposite angle ∠PSR?',
          options: ['112°', '68°', '122°'],
          correctIndex: 0,
          hints: [
            'Opposite angles of a cyclic quadrilateral are supplementary (sum to 180°).',
            'Compute 180° − 68°.',
          ],
          explanation: '∠PSR = 180° − 68° = 112°.',
        },
        teachBackChallenge: {
          prompt:
            'If AB is a diameter of a circle with centre O and C is any point on the circumference, what is ∠ACB?',
          options: ['Always 90° (a right angle)', 'Always 60°', 'Always 180°'],
          correctIndex: 0,
          hints: [
            'A diameter makes a straight-line angle of 180° at the centre O.',
            'Half of 180° at the circumference is...',
          ],
          explanation:
            'Thales’ theorem: the angle in a semicircle (subtended by a diameter) is ½ × 180° = 90°.',
        },
        victoryNarrative:
          'Light beam refracts at 68° and 112°, forming a shimmering bridge across the chasm!',
      },
    },
  ],
  boss: {
    id: 'boss-maths-sphinx',
    worldId: 'maths',
    name: 'The Sphinx of Equations',
    title: 'Puzzle Kingdom Boss Battle',
    premise: 'Solve indices, quadratics, circle geometry, and probability to claim the Crown of Proofs!',
    xpReward: 320,
    unlockTitle: 'Sovereign of Proofs',
    questions: [
      {
        id: 'mb-1',
        phaseLabel: 'Phase 1 · Law of Indices',
        telegraph: 'Exponential rune glows: 3^(2x − 1) = 27!',
        q: 'Solve for x in the exponential equation 3^(2x − 1) = 27.',
        options: ['x = 2', 'x = 3', 'x = 1.5', 'x = 4'],
        correctIndex: 0,
        explanation: 'Since 27 = 3³, equate powers: 2x − 1 = 3 ⇒ 2x = 4 ⇒ x = 2.',
      },
      {
        id: 'mb-2',
        phaseLabel: 'Phase 2 · Quadratic Sum & Product',
        telegraph: 'Twin pillars shift on 3x² − 12x + 9 = 0!',
        q: 'What is the sum of the roots of 3x² − 12x + 9 = 0?',
        options: ['4', '−4', '12', '3'],
        correctIndex: 0,
        explanation: 'Sum of roots α + β = −b / a = −(−12) / 3 = +4.',
      },
      {
        id: 'mb-3',
        phaseLabel: 'Phase 3 · Tangent-Radius Seal',
        telegraph: 'Golden tangent beam grazes the astrolabe rim at point T!',
        q: 'What angle does the radius OT make with a tangent line touching the circle at point T?',
        options: ['90°', '45°', '60°', '180°'],
        correctIndex: 0,
        explanation: 'A tangent to a circle is always perpendicular (90°) to the radius at the point of contact.',
      },
      {
        id: 'mb-4',
        phaseLabel: 'Final Phase · Vault of Odds',
        telegraph: 'Final chest holds 5 gold keys and 3 silver keys!',
        q: 'A chest holds 5 gold keys and 3 silver keys. If one key is drawn at random, what is the probability of drawing a gold key?',
        options: ['5/8', '3/8', '5/3', '1/5'],
        correctIndex: 0,
        explanation: 'Total keys = 5 + 3 = 8, so P(Gold) = 5/8.',
      },
    ],
  },
};

const ENGLISH_WORLD: SubjectWorldDef = {
  worldId: 'eng',
  subjectName: 'English Language',
  worldTitle: 'The Chronicle Citadel',
  tagline:
    'Decode lost manuscripts, master vowel phonetics, sharpen concord rules and unravel literary mysteries.',
  heroMissionHeadline: 'Restore the Lost Chronicle',
  roleIdentity: 'Chronicle Detective & Master Orator',
  companionName: 'Miss Adaeze',
  companionRole: 'Chief Diction & Chronicle Guide',
  fallbackGradient: 'linear-gradient(135deg, #1E1348 0%, #4C1D95 55%, #31102F 100%)',
  accentHex: '#A855F7',
  icon: 'book',
  missions: [
    {
      id: 'eng-chronicle-concord',
      worldId: 'eng',
      levelLabel: 'Level 03',
      title: 'Voices of the Lost Manuscript',
      subtitle:
        'Counterfeit scrolls have scrambled royal decrees! Spot subtle subject-verb concord traps and oral vowel contrasts to authenticate the true text.',
      xpReward: 240,
      unlockTitle: 'Chronicle Orator',
      unlockEquipmentId: 'chronicle-quill',
      stage1Discover: {
        hook: 'Three messengers arrive with rival scrolls, but two contain classic concord and vowel traps!',
        companionIntro:
          'When phrases like "as well as", "together with", or "along with" follow a singular subject, the verb ignores the phrase and agrees strictly with the first true subject!',
        keyFacts: [
          {
            label: 'Accompaniment Concord Rule',
            detail:
              '"The Principal, together with the teachers, IS arriving" — the singular head noun "The Principal" controls the verb.',
          },
          {
            label: 'Neither...Nor Proximity Rule',
            detail:
              'With "Neither A nor B", the verb agrees with the nearer subject B: "Neither the captain nor the players WERE ready."',
          },
          {
            label: 'Short /ɪ/ vs Long /iː/',
            detail:
              '"ship /ʃɪp/" uses short vowel /ɪ/, while "sheep /ʃiːp/" and "seat /siːt/" use long tense vowel /iː/.',
          },
        ],
      },
      stage2Explore: {
        simulationKind: 'concept_pathway',
        instruction:
          'Trace the 4 linguistic verification checkpoints to unlock the Citadel seal.',
        targetGoalLabel: 'Verify all 4 grammar & phonetic checkpoints',
        pathwayNodes: [
          {
            id: 'n1',
            label: '1. Isolate True Subject',
            stateNote: 'Bracket away "together with / as well as ..."',
          },
          {
            id: 'n2',
            label: '2. Check Number (Singular/Plural)',
            stateNote: 'Match singular subject → singular verb (-s / is / has)',
          },
          {
            id: 'n3',
            label: '3. Test Proximity Pairings',
            stateNote: 'Either/Or & Neither/Nor match the closer noun',
          },
          {
            id: 'n4',
            label: '4. Verify Vowel Length',
            stateNote: 'Distinguish short /ɪ/ (sit) from long /iː/ (seat)',
          },
        ],
      },
      stage3Decision: {
        scenarioContext:
          'You inspect the royal decree at the Citadel gate. Only the grammatically sound line opens the archive.',
        prompt: 'Which sentence obeys standard English concord accurately?',
        options: [
          'The Commander, along with her scouts, has reached the northern tower.',
          'The Commander, along with her scouts, have reached the northern tower.',
          'Each of the scouts have reported to the northern tower.',
        ],
        correctIndex: 0,
        hints: [
          'Mentally cross out ", along with her scouts," — what is the true subject?',
          '"The Commander" is singular, and "Each of..." also always takes a singular verb ("has").',
        ],
        explanation:
          'Parenthetical expressions like "along with her scouts" do not make a singular subject plural; "The Commander ... has reached" is correct.',
      },
      stage4Complete: {
        applicationChallenge: {
          prompt:
            'Choose the word that contains the exact same long pure vowel sound /iː/ as the underlined letters in "p_ea_ce":',
          options: ['key', 'sit', 'head'],
          correctIndex: 0,
          hints: [
            'Say "peace" aloud: /piːs/ has a long smiling vowel.',
            '"head" has short /e/, "sit" has short /ɪ/, whereas "key" is pronounced /kiː/!',
          ],
          explanation:
            'Spelling can disguise sound: "key" (/kiː/) and "peace" (/piːs/) share the long high front vowel /iː/.',
        },
        teachBackChallenge: {
          prompt:
            'Complete the proximity concord rule: "Neither the guards nor the gatekeeper ___ asleep when the bell rang."',
          options: ['was', 'were', 'are'],
          correctIndex: 0,
          hints: [
            'With "Neither ... nor ...", look at the noun closest to the verb.',
            '"the gatekeeper" is singular and the sentence is in past tense ("when the bell rang").',
          ],
          explanation:
            'Under proximity concord ("neither...nor"), the verb agrees with the nearer subject ("the gatekeeper" → singular past "was").',
        },
        victoryNarrative:
          'The authentic scroll glows gold! You unlocked the Chronicle Citadel archives.',
      },
    },
  ],
  boss: {
    id: 'boss-eng-citadel',
    worldId: 'eng',
    name: 'The Phantom Grammarian',
    title: 'Chronicle Citadel Boss Battle',
    premise: 'Defeat deceptive look-alike options in concord, lexis, stress, and oral vowels!',
    xpReward: 280,
    unlockTitle: 'Grand Orator',
    questions: [
      {
        id: 'eb-1',
        phaseLabel: 'Phase 1 · Indefinite Concord',
        telegraph: 'Trap pronoun "Everybody" echoes across the hall!',
        q: 'Complete accurately: "Everybody in the hall ___ expected to submit ___ script quietly."',
        options: ['is / his or her', 'are / their', 'were / our', 'have / their'],
        correctIndex: 0,
        explanation: 'Indefinite pronouns like Everybody/Everyone take a singular verb ("is").',
      },
      {
        id: 'eb-2',
        phaseLabel: 'Phase 2 · Emphatic Stress',
        telegraph: 'Capitalised word marks the contrasted focus!',
        q: 'ADE rode the bicycle to school yesterday. Which question does this emphatic stress answer?',
        options: [
          'Did Musa ride the bicycle to school yesterday?',
          'Did Ade walk to school yesterday?',
          'Did Ade ride the bicycle to the market yesterday?',
          'Did Ade ride the bicycle to school today?',
        ],
        correctIndex: 0,
        explanation:
          'Emphatic stress on ADE contrasts the subject ("Musa" vs "ADE") while keeping all other words unchanged.',
      },
      {
        id: 'eb-3',
        phaseLabel: 'Final Phase · Idiomatic Meaning',
        telegraph: 'Decode the figurative expression in context!',
        q: 'In "Chidi decided to turn over a new leaf before the final exam", what does "turn over a new leaf" mean?',
        options: [
          'Change his behaviour for the better',
          'Open a brand-new textbook',
          'Study Agricultural Science',
          'Borrow notes from a classmate',
        ],
        correctIndex: 0,
        explanation: '"Turn over a new leaf" is an idiom meaning to reform and adopt better habits.',
      },
    ],
  },
};

export const CORE_UNIVERSE_WORLDS: Record<string, SubjectWorldDef> = {
  bio: BIOLOGY_WORLD,
  chem: CHEMISTRY_WORLD,
  phys: PHYSICS_WORLD,
  maths: MATHS_WORLD,
  eng: ENGLISH_WORLD,
};

/**
 * Converts a real curriculum Topic into a dynamic 4-stage Companion Rescue Mission
 * so every single subject (all 49!) has playable missions grounded in real exam content!
 */
export function buildDynamicTopicMission(
  subj: SubjectId,
  topic: Topic,
  companionName: string,
  indexLabel = 'Field Mission',
  isRescue = false
): UniverseMission {
  const part0 = topic.parts[0];
  const q1 = topic.qs[0];
  const q2 = topic.qs[1] || topic.qs[0];
  const q3 = topic.qs[2] || topic.qs[0];

  const cleanText = (html: string) =>
    html
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const rules = (part0?.rules || topic.goals || []).slice(0, 3);

  return {
    id: isRescue ? `rescue-${subj}-${topic.id}` : `world-${subj}-${topic.id}`,
    worldId: subj,
    levelLabel: indexLabel,
    title: isRescue ? `Rescue Operation: ${topic.name}` : `Expedition: ${topic.name}`,
    subtitle: cleanText(part0?.idea || topic.goals[0] || `Master ${topic.name} in the field.`),
    linkedTopicId: topic.id,
    xpReward: isRescue ? 240 : 210,
    unlockTitle: `${topic.name.split(' ')[0]} Specialist`,
    isDynamicRescue: isRescue,
    stage1Discover: {
      hook: isRescue
        ? `${companionName} flagged a vulnerability in ${topic.name}. Complete this targeted field mission to turn your weak spot into a strength!`
        : `You arrive at the ${topic.sec} frontier to investigate ${topic.name}.`,
      companionIntro: cleanText(
        part0?.idea || `${companionName} walks you through the core mechanism of ${topic.name}.`
      ),
      keyFacts:
        rules.length > 0
          ? rules.map((r, idx) => ({
              label: `Core Principle 0${idx + 1}`,
              detail: cleanText(r),
            }))
          : [
              {
                label: 'Watch the Exam Trap',
                detail: cleanText(topic.trap || `Focus on first principles in ${topic.name}.`),
              },
            ],
    },
    stage2Explore: {
      simulationKind: 'concept_pathway',
      instruction: `Step through each reasoning checkpoint for ${topic.name} and inspect how examiners set traps.`,
      targetGoalLabel: 'Inspect all 4 field checkpoints',
      pathwayNodes: [
        {
          id: 'p1',
          label: '1. Core Concept',
          stateNote: cleanText(topic.goals[0] || topic.name).slice(0, 90),
        },
        {
          id: 'p2',
          label: '2. Key Rule',
          stateNote: cleanText(rules[0] || part0?.title || topic.sec).slice(0, 90),
        },
        {
          id: 'p3',
          label: '3. Trap Radar',
          stateNote: cleanText(topic.trap || 'Eliminate look-alike distractors carefully').slice(
            0,
            90
          ),
        },
        {
          id: 'p4',
          label: '4. Ready for Action',
          stateNote: 'Apply the rule under real mission conditions',
        },
      ],
    },
    stage3Decision: {
      scenarioContext: `Field checkpoint in ${topic.sec}: apply your understanding of ${topic.name}.`,
      prompt: q1 ? cleanText(q1.q) : `Which principle governs ${topic.name}?`,
      options: q1 ? q1.o.map(cleanText) : ['Apply first principles', 'Guess randomly', 'Skip units'],
      correctIndex: q1 ? q1.a : 0,
      hints: [
        cleanText(topic.trap || 'Re-read the exact condition in the question stem.'),
        cleanText(q1?.e || 'Match the governing rule from Stage 1.'),
      ],
      explanation: cleanText(q1?.e || `Verified using the core rule of ${topic.name}.`),
    },
    stage4Complete: {
      applicationChallenge: {
        prompt: q2 ? cleanText(q2.q) : `Apply ${topic.name} to solve the second lock:`,
        options: q2 ? q2.o.map(cleanText) : ['Verified solution', 'Incorrect assumption', 'Reversed sign'],
        correctIndex: q2 ? q2.a : 0,
        hints: [
          'Check units, signs, and key qualifiers before locking in.',
          cleanText(q2?.e || 'Use the principle discovered in Stage 1.'),
        ],
        explanation: cleanText(q2?.e || 'Cleanly solved!'),
      },
      teachBackChallenge: {
        prompt: q3 ? cleanText(q3.q) : `Final mastery verification on ${topic.name}:`,
        options: q3 ? q3.o.map(cleanText) : ['Mastery confirmed', 'Unclear step', 'Omitted condition'],
        correctIndex: q3 ? q3.a : 0,
        hints: [
          `Watch out for: ${cleanText(topic.trap).slice(0, 110)}`,
          cleanText(q3?.e || 'Confirm why your chosen answer holds.'),
        ],
        explanation: cleanText(q3?.e || 'Mastery verified!'),
      },
      victoryNarrative: `Field operation complete! ${companionName} logged your mastery of ${topic.name}.`,
    },
  };
}

/**
 * Returns a complete playable SubjectWorldDef for ANY SubjectId (the 5 bespoke worlds + 44 dynamic curriculum worlds),
 * automatically appending a personalised Companion Weak-Topic Rescue Mission from the student's real progress!
 */
export function getPlayableWorldForSubject(
  subj: SubjectId,
  progress: UserProgress
): SubjectWorldDef {
  const topics = getTopics(subj);
  const tutor = SUBJECT_TUTOR_REGISTRY[subj] || SUBJECT_TUTOR_REGISTRY.bio;
  const baseWorld = CORE_UNIVERSE_WORLDS[subj];

  if (baseWorld) {
    const rescuePick = pickWeakTopicForCompanionAdventure(
      subj,
      topics,
      progress,
      baseWorld.companionName
    );
    const rescueTopic = rescuePick
      ? topics.find((t) => t.id === rescuePick.topicId)
      : undefined;
    const dynamicMissions = rescueTopic
      ? [
          ...baseWorld.missions,
          buildDynamicTopicMission(
            subj,
            rescueTopic,
            baseWorld.companionName,
            'Adaptive Rescue',
            true
          ),
        ]
      : baseWorld.missions;

    return {
      ...baseWorld,
      missions: dynamicMissions,
    };
  }

  // Dynamic world for any other JAMB/WAEC subject!
  const sampleTopics = topics.slice(0, 3);
  const generatedMissions = sampleTopics.map((t, idx) =>
    buildDynamicTopicMission(subj, t, tutor.tutorName, `Level 0${idx + 1}`, false)
  );

  const bossQuestions = topics.slice(0, 4).map((t, idx) => {
    const q = t.qs[0];
    const clean = (s: string) => s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return {
      id: `dyn-boss-${subj}-${idx}`,
      phaseLabel: `Phase ${idx + 1} · ${t.name}`,
      telegraph: `${tutor.tutorName} spots a high-stakes challenge on ${t.name}!`,
      q: q ? clean(q.q) : `Mastery check on ${t.name}`,
      options: q ? q.o.map(clean) : ['Correct principle', 'Distractor A', 'Distractor B', 'Distractor C'],
      correctIndex: q ? q.a : 0,
      explanation: q ? clean(q.e) : `Verified in ${t.name}.`,
    };
  });

  return {
    worldId: subj,
    subjectName: tutor.name,
    worldTitle: `${tutor.short} Realm`,
    tagline: `Step into the ${tutor.studioLabel} with ${tutor.tutorName} and conquer real syllabus missions.`,
    heroMissionHeadline: `Master ${tutor.short}`,
    roleIdentity: `${tutor.short} Field Specialist`,
    companionName: tutor.tutorName,
    companionRole: tutor.roleTitle,
    fallbackGradient: 'linear-gradient(135deg, #131C31 0%, #1E3A5F 55%, #312E81 100%)',
    accentHex: '#6366F1',
    icon: tutor.icon,
    missions: generatedMissions,
    boss: {
      id: `boss-dyn-${subj}`,
      worldId: subj,
      name: `${tutor.short} Grand Guardian`,
      title: `${tutor.name} World Boss`,
      premise: `Prove multi-topic mastery across ${tutor.name} to claim the Realm Crest!`,
      xpReward: 280,
      unlockTitle: `${tutor.short} Vanguard`,
      questions: bossQuestions,
    },
  };
}
