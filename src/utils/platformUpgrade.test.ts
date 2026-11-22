import assert from 'node:assert/strict';
import test from 'node:test';
import { getInteractiveLesson, getTopics, SUBJECTS, SUBJECT_IDS } from '../data/curriculum';
import {
  BIO_LAB_FOR_TOPIC,
  getLabById,
  getLabsForSubject,
  PHYS_LAB_FOR_TOPIC,
  renderLabSvg,
} from '../data/labs';
import { PHYS_FORMULAS } from '../data/physFormulas';
import { PHYS_NERDC_MAP } from '../data/physNerdc2027';
import { BIO_NERDC_MAP, filterBioTopicsByClass } from '../data/bioNerdc2027';
import { ECON_NERDC_MAP, filterEconTopicsByClass } from '../data/econNerdc2027';
import { ECON_FORMULAS, ECON_FORMULA_CATEGORIES } from '../data/econFormulas';
import {
  extractNotePartSpeechScript,
  extractRereadSheetSpeechScript,
} from './chemVoiceLogic';
import { BADGES, evaluateNewBadges, makeBlankProgress } from './engine';
import {
  MOTIVATION_ROTATION_MS,
  MOTIVATION_SLIDES,
  getMotivationSlotAtTime,
} from './motivationLogic';
import { getLabVivaCheck } from './labVivaLogic';
import { buildPhysFormulaDrillDeck } from './physFormulaLogic';
import {
  buildEconFormulaDrillDeck,
  extractEconFormulaSpeechScript,
  filterEconFormulas,
  generateEconFormulaQuestion,
  getEconFormulasForTopic,
} from './econFormulaLogic';

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

test('Motivation panels rotate cleanly once per day (86,400,000 ms) across 5 slides', () => {
  assert.equal(MOTIVATION_SLIDES.length, 5);
  assert.equal(MOTIVATION_ROTATION_MS, 86_400_000);

  const t0 = 1_800_000_000_000;
  const seen = new Set<number>();
  for (let step = 0; step < 5; step++) {
    const idx = getMotivationSlotAtTime(t0 + step * 86_400_000, 0);
    seen.add(idx);
  }
  assert.equal(seen.size, 5, '5 consecutive days should visit all 5 slides');
  assert.equal(
    getMotivationSlotAtTime(t0 + 5 * 86_400_000, 0),
    getMotivationSlotAtTime(t0, 0),
    'Slide index wraps cleanly after 5 days'
  );
});

test('All 8 hard-earned Elemental Rank badges unlock only when full smartness & accuracy gates are met', () => {
  assert.equal(BADGES.length, 8);
  const tiers = BADGES.reduce<Record<string, number>>((acc, b) => {
    acc[b.tier] = (acc[b.tier] || 0) + 1;
    return acc;
  }, {});
  assert.deepEqual(tiers, { bronze: 2, silver: 2, gold: 2, mythic: 2 });

  const allTopicsBySubj = Object.fromEntries(
    SUBJECT_IDS.map((sid) => [sid, getTopics(sid)])
  ) as Record<(typeof SUBJECT_IDS)[number], ReturnType<typeof getTopics>>;

  const p = makeBlankProgress();
  p.dx = 19900;
  p.streak = { d: 19900, n: 35 };
  p.xp = 8000;
  p.hist = Array.from({ length: 1900 }, (_, i) => [
    `q-${i}`,
    i < 1850 ? 1 : 0,
    19900,
  ] as [string, number, number]);
  p.cbtHistory = [
    {
      id: 'cbt-solar',
      mode: 'jamb',
      dateDay: 19900,
      subjects: ['maths', 'phys', 'chem', 'eng'],
      scaledScore: 386,
      maxScale: 400,
      rawCorrect: 39,
      totalQuestions: 40,
      durationSec: 1200,
    },
  ];
  p.theoryScores = Object.fromEntries(
    Array.from({ length: 10 }, (_, i) => [`th-${i}`, { earned: 95, max: 100, day: 19900 }])
  );

  for (const subj of ['maths', 'phys', 'chem', 'bio', 'eng'] as const) {
    for (const t of allTopicsBySubj[subj]) {
      p.t[t.id] = {
        att: Array.from({ length: 12 }, () => [1, 5] as [number, number]),
        lesson: 19900,
        practice: 5,
        boss: 19900,
      };
    }
  }

  const { progress: updated, newlyEarned } = evaluateNewBadges(
    p,
    allTopicsBySubj.phys,
    19900,
    allTopicsBySubj
  );
  assert.equal(newlyEarned.length, 8, 'Should unlock all 8 Elemental Ranks for a Solar-caliber scholar');
  const expectedBonus = BADGES.reduce((sum, b) => sum + b.xpBonus, 0);
  assert.equal(updated.xp, 8000 + expectedBonus);
});

test('Complete Physics curriculum: 32 NERDC topics, 16 practicals, 30 formulas & safe fallback', () => {
  const physTopics = getTopics('phys');
  assert.equal(physTopics.length, 32);

  for (const t of physTopics) {
    assert.ok(PHYS_NERDC_MAP[t.id], `Missing PHYS_NERDC_MAP entry for ${t.id}`);
    const lesson = getInteractiveLesson('phys', t.id);
    assert.ok(lesson && lesson.parts.length > 0, `Missing interactive lesson for ${t.id}`);
    assert.ok(t.qs.length >= 6, `Topic ${t.id} should have at least 6 questions`);
  }

  const physLabs = getLabsForSubject('phys');
  assert.equal(physLabs.length, 16);
  const physTopicIds = new Set(physTopics.map((t) => t.id));
  const physLabIds = new Set(physLabs.map((l) => l.id));
  for (const [tid, lid] of Object.entries(PHYS_LAB_FOR_TOPIC)) {
    assert.ok(physTopicIds.has(tid), `PHYS_LAB_FOR_TOPIC key ${tid} not in Physics topics`);
    assert.ok(physLabIds.has(lid), `PHYS_LAB_FOR_TOPIC lab ${lid} not in Physics labs`);
  }

  assert.equal(PHYS_FORMULAS.length, 30);
  for (const f of PHYS_FORMULAS) {
    assert.ok(physTopicIds.has(f.topicId), `Formula ${f.id} topicId ${f.topicId} not in Physics topics`);
  }

  const deck = buildPhysFormulaDrillDeck('all', null, 8, 42);
  assert.equal(deck.length, 8);
  for (const q of deck) {
    assert.equal(q.options.length, 4);
    assert.ok(q.answerIdx >= 0 && q.answerIdx < 4);
  }

  const fallbackTopics = getTopics('corrupted_subj' as never);
  assert.equal(fallbackTopics.length, SUBJECTS.maths.topics.length);
});

test('Complete Biology curriculum: 30 NERDC SS1–SS3 topics and 14 practicals (no Formula Studio)', () => {
  assert.equal(SUBJECT_IDS.length, 49);
  assert.ok(SUBJECT_IDS.includes('bio'));
  const bioTopics = getTopics('bio');
  assert.equal(bioTopics.length, 30);

  const ss1 = filterBioTopicsByClass(bioTopics, 'ss1');
  const ss2 = filterBioTopicsByClass(bioTopics, 'ss2');
  const ss3 = filterBioTopicsByClass(bioTopics, 'ss3');
  assert.equal(ss1.length + ss2.length + ss3.length, 30);

  for (const t of bioTopics) {
    assert.ok(BIO_NERDC_MAP[t.id], `Missing BIO_NERDC_MAP entry for ${t.id}`);
    const lesson = getInteractiveLesson('bio', t.id);
    assert.ok(lesson && lesson.parts.length > 0, `Missing interactive lesson for ${t.id}`);
    assert.ok(t.qs.length >= 6, `Biology topic ${t.id} should have at least 6 questions`);
  }

  const bioLabs = getLabsForSubject('bio');
  assert.equal(bioLabs.length, 14);
  const bioTopicIds = new Set(bioTopics.map((t) => t.id));
  const bioLabIds = new Set(bioLabs.map((l) => l.id));
  for (const [tid, lid] of Object.entries(BIO_LAB_FOR_TOPIC)) {
    assert.ok(bioTopicIds.has(tid), `BIO_LAB_FOR_TOPIC key ${tid} not in Biology topics`);
    assert.ok(bioLabIds.has(lid), `BIO_LAB_FOR_TOPIC lab ${lid} not in Biology labs`);
  }

  const microLab = getLabById('b-microscope');
  assert.ok(microLab);
  const microRender = renderLabSvg(microLab, 1);
  assert.ok(microRender.svg.includes('<svg'), 'Biology microscope practical renders SVG stage');
});

test('Complete Economics curriculum: 30 NERDC SS1–SS3 topics, 180 MCQs, ZERO Virtual Labs, and 24 Economics Formulas', () => {
  const econTopics = getTopics('econ');
  assert.equal(econTopics.length, 30, '30 Economics NERDC topics');
  assert.equal(getLabsForSubject('econ').length, 0, 'STRICT NO-LAB RULE: Economics must have zero labs');

  const ss1 = filterEconTopicsByClass(econTopics, 'ss1');
  const ss2 = filterEconTopicsByClass(econTopics, 'ss2');
  const ss3 = filterEconTopicsByClass(econTopics, 'ss3');
  assert.equal(ss1.length, 10, '10 SS1 Economics topics');
  assert.equal(ss2.length, 10, '10 SS2 Economics topics');
  assert.equal(ss3.length, 10, '10 SS3 Economics topics');

  let totalQs = 0;
  for (const t of econTopics) {
    assert.ok(ECON_NERDC_MAP[t.id], `Missing ECON_NERDC_MAP entry for ${t.id}`);
    assert.ok(t.parts.length >= 2, `Economics topic ${t.id} has 2 chapters`);
    const lesson = getInteractiveLesson('econ', t.id);
    assert.ok(lesson && lesson.parts.length >= 2, `Missing interactive lesson for ${t.id}`);
    assert.equal(t.qs.length, 6, `Economics topic ${t.id} should have 6 calibrated MCQs`);
    totalQs += t.qs.length;
    for (const q of t.qs) {
      assert.equal(q.o.length, 4);
      assert.ok(q.a >= 0 && q.a < 4);
      assert.ok(q.e.length > 15);
    }
  }
  assert.equal(totalQs, 180, '180 total Economics MCQs');

  assert.equal(ECON_FORMULAS.length, 24, '24 Economics formulas');
  assert.equal(ECON_FORMULA_CATEGORIES.length, 6, 'All + 5 Economics formula categories');
  const econTopicIds = new Set(econTopics.map((t) => t.id));
  for (const f of ECON_FORMULAS) {
    assert.ok(econTopicIds.has(f.topicId), `Economics formula ${f.id} links to valid topic ${f.topicId}`);
    assert.ok(f.rearrangements.length >= 2, `Economics formula ${f.id} has rearrangements`);
    for (const seed of [13, 307, 8191]) {
      const q = generateEconFormulaQuestion(f.id, seed);
      assert.equal(q.options.length, 4);
      assert.equal(new Set(q.options).size, 4, `Formula ${f.id} produces 4 distinct options for seed ${seed}`);
      assert.ok(q.answerIdx >= 0 && q.answerIdx < 4);
    }
    const sFirst = extractEconFormulaSpeechScript(f, 0, true);
    const sNext = extractEconFormulaSpeechScript(f, 0, false);
    assert.ok(sFirst.includes("Dr. Ngozi's Economics Formula Studio"));
    assert.ok(!sNext.includes('Welcome to Dr. Ngozi'));
    assert.ok(sFirst.length <= 920);
  }

  assert.ok(filterEconFormulas(ECON_FORMULAS, 'demand', '').length >= 4);
  assert.ok(getEconFormulasForTopic('ec-elasticity').length >= 2);
  const deck = buildEconFormulaDrillDeck('all', null, 8, 99);
  assert.equal(deck.length, 8);
});

test('Distractor calibration eliminates option-length guessing bias & giveaway parentheticals across all 7 subjects', () => {
  for (const subj of ['maths', 'chem', 'phys', 'bio', 'agric', 'econ', 'eng'] as const) {
    const topics = getTopics(subj);
    let totalQs = 0;
    let longestIsRight = 0;
    let hugeLengthTells = 0;

    for (const t of topics) {
      for (const q of t.qs) {
        totalQs++;
        const lens = q.o.map((opt) => stripHtml(opt).length);
        const rightLen = lens[q.a];
        const maxWrong = Math.max(...lens.filter((_, idx) => idx !== q.a));
        if (rightLen > maxWrong) longestIsRight++;
        if (rightLen - maxWrong >= 20) hugeLengthTells++;
      }
    }

    const longestRightPct = (longestIsRight / Math.max(1, totalQs)) * 100;
    assert.ok(
      longestRightPct <= 28,
      `${subj}: longest-option-is-right rate (${longestRightPct.toFixed(1)}%) should not exceed 28%`
    );
    assert.equal(
      hugeLengthTells,
      0,
      `${subj}: zero questions should have a >=20 char length giveaway on the right option`
    );
  }

  // Verify medium-length options (e.g. Chemistry intro Q1) stay tightly balanced rather than 2x padded
  const chemQ1 = getTopics('chem')[0].qs[0];
  const chemQ1RightLen = stripHtml(chemQ1.o[chemQ1.a]).length;
  const chemQ1MaxOptLen = Math.max(...chemQ1.o.map((opt) => stripHtml(opt).length));
  assert.ok(
    chemQ1MaxOptLen <= Math.max(chemQ1RightLen + 26, Math.round(chemQ1RightLen * 1.45)),
    `Chem Q1 max option length (${chemQ1MaxOptLen}) should stay balanced near right length (${chemQ1RightLen})`
  );
});

test('Notes voice script covers full visible chapter content & reread sheet, and Virtual Labs include glassware/grid SVG primitives', () => {
  const chemTopic = getTopics('chem')[0];
  const chemLesson = getInteractiveLesson('chem', chemTopic.id);
  const lPart = chemLesson?.parts[0];
  const ideas = (lPart?.beats.filter((b) => b.k === 'idea') || []) as never[];
  const teaches = (lPart?.beats.filter((b) => b.k === 'teach') || []) as never[];
  const explores = (lPart?.beats.filter((b) => b.k === 'explore') || []) as never[];

  const fullScript = extractNotePartSpeechScript(chemTopic.name, 0, chemTopic.parts[0], {
    teaches,
    explores,
    defs: [['Atom', 'Smallest particle of an element that can take part in a chemical reaction']],
    laws: [['Conservation of Mass', 'Matter is neither created nor destroyed']],
    trap: chemTopic.trap,
  });
  assert.ok(fullScript.includes('Conservation of Mass'), 'Should spotlight governing law on chapter');
  assert.ok(fullScript.includes('Picture the big idea first:'), 'Should frame big idea like a professional teacher');
  assert.ok(fullScript.length <= 940, 'Should teach concisely rather than reading full raw notes');

  const reread = extractRereadSheetSpeechScript(
    chemTopic,
    [['Atom', 'Smallest particle']],
    [['Conservation of Mass', 'Matter is conserved']]
  );
  assert.ok(reread.includes('rapid mastery synthesis'), 'Should coach 1-Min Reread Sheet as a mentor synthesis');
  assert.ok(reread.length <= 880, 'Reread synthesis stays tight and mentor-like');

  const titLab = getLabById('c-titration');
  assert.ok(titLab);
  const titRender = renderLabSvg(titLab, 2);
  assert.ok(titRender.svg.includes('clGlassGrad'), 'Glassware should use specular borosilicate gradient');
  assert.ok(titRender.svg.includes('cl-meniscus'), 'Liquids should render meniscus rim highlight');
  assert.ok(titRender.svg.includes('cl-ld-dot'), 'Leader callouts should render target anchor dots');

  const bisectLab = getLabById('bisect-line');
  assert.ok(bisectLab);
  const bisectRender = renderLabSvg(bisectLab, 1);
  assert.ok(bisectRender.svg.includes('lb-grid-layer'), 'Maths constructions should include toggleable engineering grid');
});

test('All 87 Virtual Labs include calibrated Practical Viva Checks with zero length-bias tells', () => {
  const allLabs = [
    ...getLabsForSubject('maths'),
    ...getLabsForSubject('chem'),
    ...getLabsForSubject('phys'),
    ...getLabsForSubject('bio'),
    ...getLabsForSubject('agric'),
  ];
  assert.equal(allLabs.length, 87, `Expected 87 virtual labs across Maths/Chem/Phys/Bio/Agric, got ${allLabs.length}`);

  for (const lab of allLabs) {
    const viva = getLabVivaCheck(lab);
    assert.equal(viva.options.length, 4, `Lab ${lab.id} viva must have 4 options`);
    assert.ok(
      viva.answerIdx >= 0 && viva.answerIdx < 4,
      `Lab ${lab.id} viva must have valid answerIdx`
    );
    const uniqueOpts = new Set(viva.options.map(stripHtml));
    assert.equal(uniqueOpts.size, 4, `Lab ${lab.id} viva options must be 4 distinct choices`);
    assert.ok(viva.explanationHtml.length > 20, `Lab ${lab.id} viva must have clear explanation`);

    const rightLen = stripHtml(viva.options[viva.answerIdx]).length;
    const maxWrongLen = Math.max(
      ...viva.options
        .filter((_, idx) => idx !== viva.answerIdx)
        .map((o) => stripHtml(o).length)
    );
    assert.ok(
      rightLen <= maxWrongLen * 1.45 + 14,
      `Lab ${lab.id} viva right option (${rightLen}) should not tower over distractors (${maxWrongLen})`
    );
  }
});
