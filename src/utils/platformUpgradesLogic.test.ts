import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildGuidedQuestionClue,
  buildLiveTeacherPromptForQuestion,
  canRunCbtPresetInCurrentAccess,
  computeMarketEquilibriumState,
  evaluateConcordSelection,
  resolveActiveCaptionIndex,
  searchGlobalCatalog,
  splitSpeechIntoCaptions,
  type GlobalCatalogItem,
} from './platformUpgradesLogic';

const SAMPLE_CATALOG: GlobalCatalogItem[] = [
  {
    id: 'world-bio-heart',
    category: 'world',
    title: '3D Living Heart Expedition',
    subtitle: 'Biology World · Double circulation & alveoli gas exchange',
    keywords: 'circulatory system blood heart lungs aorta vena cava',
    icon: 'dna',
    priority: 100,
    action: { kind: 'heart-3d', subj: 'bio' },
  },
  {
    id: 'lab-chem-titration',
    category: 'lab',
    title: 'Acid-Base Titration Practical',
    subtitle: 'Chemistry Virtual Lab · Burette, pipette & methyl orange',
    keywords: 'volumetric analysis hcl naoh endpoint equivalence',
    icon: 'flask',
    priority: 85,
    action: { kind: 'lab', subj: 'chem', labId: 'c-titration' },
  },
  {
    id: 'novel-lekki',
    category: 'novel',
    title: 'The Lekki Headmaster',
    subtitle: 'JAMB Use of English Set Novel · Kabir Alabi Garba',
    keywords: 'bepo stardom schools japa',
    icon: 'book',
    priority: 92,
    action: { kind: 'novel', subj: 'eng', novelId: 'lekki-headmaster' },
  },
  {
    id: 'tool-cbt',
    category: 'tool',
    title: 'CBT Exam Arena',
    subtitle: 'Timed 4-subject UTME & WAEC mock simulator',
    keywords: 'mock exam saturday jamb waec timer',
    icon: 'clock',
    priority: 95,
    action: { kind: 'screen', screen: 'cbt' },
  },
];

test('searchGlobalCatalog returns priority-ordered items on empty query and filters by category', () => {
  const topAll = searchGlobalCatalog(SAMPLE_CATALOG, '', 'all', 10);
  assert.equal(topAll[0]?.id, 'world-bio-heart');
  assert.equal(topAll[1]?.id, 'tool-cbt');

  const labsOnly = searchGlobalCatalog(SAMPLE_CATALOG, '', 'lab', 10);
  assert.equal(labsOnly.length, 1);
  assert.equal(labsOnly[0]?.id, 'lab-chem-titration');
});

test('searchGlobalCatalog ranks multi-token queries across title, subtitle, and keywords', () => {
  const res1 = searchGlobalCatalog(SAMPLE_CATALOG, 'titration burette', 'all', 5);
  assert.equal(res1.length, 1);
  assert.equal(res1[0]?.id, 'lab-chem-titration');

  const res2 = searchGlobalCatalog(SAMPLE_CATALOG, 'lekki', 'all', 5);
  assert.equal(res2[0]?.id, 'novel-lekki');

  const empty = searchGlobalCatalog(SAMPLE_CATALOG, 'quantum chromodynamics', 'all', 5);
  assert.equal(empty.length, 0);
});

test('splitSpeechIntoCaptions preserves decimals and honorifics while splitting sentences cleanly', () => {
  const script =
    'Dr. Amaka says isotonic saline is 0.9% NaCl in human blood. At 11.2 km/s, a probe escapes Earth gravity! Ready to test it?';
  const captions = splitSpeechIntoCaptions(script);
  assert.equal(captions.length, 3);
  assert.match(captions[0]!, /^Dr\. Amaka says isotonic saline is 0\.9% NaCl/);
  assert.match(captions[1]!, /^At 11\.2 km\/s/);
  assert.equal(captions[2], 'Ready to test it?');
});

test('resolveActiveCaptionIndex maps normalized progress proportionally to sentence length', () => {
  const captions = ['Short intro here.', 'This middle explanation sentence is substantially longer than the intro.', 'Final check now.'];
  assert.equal(resolveActiveCaptionIndex(captions, 0), 0);
  assert.equal(resolveActiveCaptionIndex(captions, 0.5), 1);
  assert.equal(resolveActiveCaptionIndex(captions, 0.98), 2);
});

test('buildGuidedQuestionClue redacts explicit option letters and exact multi-char answer leaks', () => {
  const clue = buildGuidedQuestionClue({
    questionHtml: 'What volume of 0.20 M NaOH neutralises 25.0 cm³ of 0.20 M H₂SO₄?',
    explanationHtml:
      'Write the balanced mole ratio 1:2 using CaVa/CbVb = na/nb before substituting values. Therefore Option A (50.0 cm³) is correct.',
    optionsHtml: ['50.0 cm³', '25.0 cm³', '12.5 cm³', '100.0 cm³'],
    correctIndex: 0,
    topicTrap: 'Watch diprotic H₂SO₄: 1 mole of acid reacts with 2 moles of NaOH, not 1:1.',
  });

  assert.ok(!clue.principle.includes('50.0 cm³'));
  assert.ok(!/option a/i.test(clue.principle));
  assert.ok(clue.trapNote && clue.trapNote.includes('diprotic'));
});

test('evaluateConcordSelection and computeMarketEquilibriumState evaluate domain simulators accurately', () => {
  assert.equal(evaluateConcordSelection(0, 'is').correct, true);
  assert.equal(evaluateConcordSelection(0, 'are').correct, false);
  assert.equal(evaluateConcordSelection(1, 'were').correct, true);

  const shortage = computeMarketEquilibriumState(300);
  assert.equal(shortage.status, 'shortage');
  assert.equal(shortage.gapUnits, 400);

  const eq = computeMarketEquilibriumState(500);
  assert.equal(eq.status, 'equilibrium');
  assert.equal(eq.quantityDemanded, 500);
  assert.equal(eq.quantitySupplied, 500);

  const surplus = computeMarketEquilibriumState(700);
  assert.equal(surplus.status, 'surplus');
  assert.equal(surplus.gapUnits, 400);
});

test('canRunCbtPresetInCurrentAccess unlocks Sprint CBT during active Free Trial while protecting Half & Full', () => {
  assert.equal(
    canRunCbtPresetInCurrentAccess({
      preset: 'sprint',
      isBasePaywalled: true,
      isActiveCountdownTrial: true,
      isPublicFreeLaunch: false,
    }),
    true
  );
  assert.equal(
    canRunCbtPresetInCurrentAccess({
      preset: 'half',
      isBasePaywalled: true,
      isActiveCountdownTrial: true,
      isPublicFreeLaunch: false,
    }),
    false
  );
  assert.equal(
    canRunCbtPresetInCurrentAccess({
      preset: 'full',
      isBasePaywalled: false,
      isActiveCountdownTrial: false,
      isPublicFreeLaunch: false,
    }),
    true
  );
  assert.equal(
    canRunCbtPresetInCurrentAccess({
      preset: 'sprint',
      isBasePaywalled: true,
      isActiveCountdownTrial: false,
      isPublicFreeLaunch: false,
    }),
    false
  );
});

test('buildLiveTeacherPromptForQuestion strips HTML tags and tailors explanation or shortcut requests', () => {
  const wrongPrompt = buildLiveTeacherPromptForQuestion({
    subjectName: 'Chemistry',
    topicName: 'Volumetric Analysis',
    questionHtml: 'What volume of <b>0.25 M H<sub>2</sub>SO<sub>4</sub></b> neutralises NaOH?',
    chosenOptionHtml: '<span>50.0 cm<sup>3</sup></span>',
    correctOptionHtml: '<span>25.0 cm<sup>3</sup></span>',
    isCorrect: false,
  });
  assert.ok(!wrongPrompt.includes('<b>'));
  assert.match(wrongPrompt, /why "50\.0 cm3" is wrong/i);
  assert.match(wrongPrompt, /why "25\.0 cm3" is right/i);

  const rightPrompt = buildLiveTeacherPromptForQuestion({
    subjectName: 'Physics',
    topicName: 'Motion',
    questionHtml: 'Find final velocity v.',
    correctOptionHtml: '20 m/s',
    isCorrect: true,
  });
  assert.match(rightPrompt, /fastest exam-hall shortcut/i);
});

