import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { MT, fr, ch, poly, frac } from './mathMarkup';
import {
  makeBlankProgress,
  mastery,
  mpct,
  predicted,
  nextMission,
  pickPractice,
  bossList,
  dxList,
  dueList,
  recordAnswer,
  evaluateNewBadges,
  getRankProgress,
  makeCode,
  today,
} from './engine';
import { SUBJECTS } from '../data/curriculum';
import { renderDiagram } from '../data/diagrams';
import { getLabsForSubject, renderLabSvg } from '../data/labs';
import {
  initParab,
  qroots,
  dragParab,
  initCirc,
  calcCirc,
  initCyc,
  cycAngles,
  initBag,
  actBag,
  initDice,
  diceCount,
  initTree,
  treeProb,
  actTree,
} from './explorerLogic';

describe('Math markup parser (MT)', () => {
  it('renders exponents, subscripts, fractions, and matrices cleanly', () => {
    assert.equal(MT.toMarkup('x^2 + H_{2}O + log_2 8'), 'x<sup>2</sup> + H<sub>2</sub>O + log<sub>2</sub> 8');
    assert.equal(
      MT.toMarkup('[x + 1 / 2]'),
      '<span class="fr"><span>x + 1</span><span>2</span></span>'
    );
    const mat = MT.toMarkup('[1 2; 3 4]');
    assert.match(mat, /^<span class="mx">/);
    assert.equal(MT.toSimple(mat), '[1 2; 3 4]');
  });

  it('escapes HTML safely inside MT and handles fr/ch/poly', () => {
    assert.equal(MT.toMarkup('<script>'), '&lt;script&gt;');
    assert.equal(ch('Al2(SO4)3'), 'Al<sub>2</sub>(SO<sub>4</sub>)<sub>3</sub>');
    assert.equal(fr(3, 4), '<span class="fr"><span>3</span><span>4</span></span>');
    assert.equal(poly(1, -5, 6), 'x² − 5x + 6');
    assert.equal(frac(6, 8), '<span class="fr"><span>3</span><span>4</span></span>');
  });
});

describe('Mastery, practice progression, and spaced repetition', () => {
  it('updates mastery upward on right answers and downward on wrong answers', () => {
    const p0 = makeBlankProgress();
    assert.equal(mastery(p0, 'bases'), 0.25);
    assert.equal(mpct(p0, 'bases'), 0);

    const q = SUBJECTS.maths.topics[0].qs[0];
    const fullQ = { ...q, id: 'bases-1', t: 'bases' };
    let p = recordAnswer(p0, fullQ, true, 'practice', 100);
    assert.ok(mastery(p, 'bases') > 0.25);
    assert.equal(mpct(p, 'bases') > 0, true);
    assert.equal(p.streak.n, 1);

    p = recordAnswer(p, fullQ, false, 'practice', 101);
    assert.equal(p.streak.n, 2);
    assert.equal(p.run, 0);
    assert.deepEqual(p.rev['bases-1'], { due: 102, st: 0 });
  });

  it('promotes review items across 1 -> 3 -> 7 days and clears on 3rd review hit', () => {
    const p0 = makeBlankProgress();
    const fullQ = { ...SUBJECTS.maths.topics[0].qs[0], id: 'bases-1', t: 'bases' };
    const findQ = (id: string) => (id === 'bases-1' ? fullQ : undefined);

    let p = recordAnswer(p0, fullQ, false, 'practice', 100);
    assert.deepEqual(dueList(p, findQ, false, 100), []);
    assert.deepEqual(dueList(p, findQ, false, 101), ['bases-1']);

    p = recordAnswer(p, fullQ, true, 'review', 101);
    assert.deepEqual(p.rev['bases-1'], { due: 104, st: 1 }); // +3 days

    p = recordAnswer(p, fullQ, true, 'review', 104);
    assert.deepEqual(p.rev['bases-1'], { due: 111, st: 2 }); // +7 days

    p = recordAnswer(p, fullQ, true, 'review', 111);
    assert.equal(p.rev['bases-1'], undefined); // cleared!
    assert.equal(p.revok, 3);
  });

  it('selects nextMission, adaptive practice, diagnostic list, and boss test questions', () => {
    const p = makeBlankProgress();
    const topics = SUBJECTS.maths.topics;
    const pred0 = predicted(p, topics);
    assert.equal(pred0, 25);

    const m = nextMission(p, topics);
    assert.ok(m);
    assert.equal(m.stage, 'lesson');

    const dx = dxList(p, topics);
    assert.ok(dx.length >= 10);

    const boss = bossList(p, topics[0]);
    assert.equal(boss.length, 7);

    const pq = pickPractice(p, topics[0], 3, []);
    assert.ok(pq);
  });

  it('evaluates badges deterministically', () => {
    let p = makeBlankProgress();
    p.dx = 1;
    p.hist = [['bases-1', 1, today()]];
    const res = evaluateNewBadges(p, SUBJECTS.maths.topics, 200);
    assert.ok(res.newlyEarned.some((b) => b.id === 'first'));
  });

  it('generates valid activation codes', () => {
    const code = makeCode('ABCD1234', 'W', 20000);
    assert.match(code, /^[A-Z0-9]{5}-[A-Z0-9]{5}$/);
  });

  it('computes rank level and XP progress ratios cleanly across thresholds', () => {
    const r0 = getRankProgress(0);
    assert.equal(r0.level, 1);
    assert.equal(r0.currentTitle, 'Fresh Starter');
    assert.equal(r0.nextTitle, 'Serious Learner');
    assert.equal(r0.progressRatio, 0);
    assert.equal(r0.xpNeededForNext, 300);

    const rMid = getRankProgress(150);
    assert.equal(rMid.level, 1);
    assert.equal(rMid.progressRatio, 0.5);
    assert.equal(rMid.xpNeededForNext, 150);

    const rMax = getRankProgress(12500);
    assert.equal(rMax.level, 7);
    assert.equal(rMax.currentTitle, 'National Laureate');
    assert.equal(rMax.nextTitle, null);
    assert.equal(rMax.progressRatio, 1);
  });
});

describe('Curriculum & Diagram integrity (Maths + Chemistry)', () => {
  for (const subj of ['maths', 'chem'] as const) {
    const expectedCount = 32;
    it(`${subj}: has ${expectedCount} topics, ${expectedCount} interactive lessons, and valid non-empty questions & diagrams`, () => {
      const data = SUBJECTS[subj];
      assert.equal(data.topics.length, expectedCount);
      for (const t of data.topics) {
        assert.ok(typeof t.boss === 'string' && t.boss.trim().length > 0, `Missing boss title for ${t.id}`);
        assert.ok(data.il[t.id], `Missing IL for ${t.id}`);
        assert.ok(data.il[t.id].parts.length > 0, `Empty IL parts for ${t.id}`);
        assert.ok(t.qs.length >= 6, `Too few qs for ${t.id}: ${t.qs.length}`);

        for (const q of t.qs) {
          assert.ok(q.q.trim().length > 0, `Empty question text in ${t.id}`);
          assert.equal(q.o.length, 4, `Expected 4 options in ${t.id}: ${q.q}`);
          assert.ok(q.a >= 0 && q.a < 4, `Invalid answer index in ${t.id}: ${q.a}`);
          assert.ok(q.e.trim().length > 0, `Empty explanation in ${t.id}`);
          if (q.g) {
            const svg = renderDiagram(q.g);
            assert.ok(svg.length > 20, `Empty diagram output in ${t.id}: ${q.g[0]}`);
          }
        }
      }
    });
  }

  it('renders all 23 Maths and 20 Chemistry Lab step SVGs without error and validates topic links', () => {
    const mathLabs = getLabsForSubject('maths');
    const chemLabs = getLabsForSubject('chem');
    assert.equal(mathLabs.length, 23, 'Expected 23 Maths constructions');
    assert.equal(chemLabs.length, 20, 'Expected 20 Chemistry practicals');

    const chemCats = new Set(chemLabs.map((l) => String(l.cat)));
    for (const c of ['q', 's', 'g', 'i', 'p', 'o']) {
      assert.ok(chemCats.has(c), `Missing Chemistry practical category ${c}`);
    }

    for (const lab of [...mathLabs, ...chemLabs]) {
      const steps = lab.steps();
      assert.ok(steps.length >= 3, `Lab ${lab.id} has < 3 steps`);
      steps.forEach((_, idx) => {
        const out = renderLabSvg(lab, idx);
        assert.ok(out.svg.includes('<svg'), `Lab ${lab.id} step ${idx} invalid svg`);
        assert.ok(out.dur > 0.2, `Lab ${lab.id} step ${idx} invalid duration`);
      });
    }
  });
});

describe('Explorer pure geometry & probability math', () => {
  it('calculates quadratic roots & vertex dragging accurately', () => {
    const p0 = initParab({ a: 1, b: -5, c: 6 });
    const r0 = qroots(p0.a, p0.b, p0.c);
    assert.deepEqual(r0.r, [2, 3]);
    assert.equal(r0.d, 1);

    const moved = dragParab(p0, 200, 120);
    assert.ok(Number.isInteger(moved.b) && Number.isInteger(moved.c));
  });

  it('satisfies circle theorem angle at centre = 2x angle at circumference', () => {
    const c = initCirc();
    const calc = calcCirc(c);
    assert.ok(Math.abs(calc.cen / 2 - calc.ins) < 0.05);
  });

  it('satisfies cyclic quadrilateral opposite angles summing to 180°', () => {
    const cyc = initCyc();
    const ang = cycAngles(cyc);
    assert.equal(ang.A + ang.C, 180);
    assert.equal(ang.B + ang.D, 180);
  });

  it('counts dice sample space and computes tree probabilities cleanly', () => {
    const d7 = initDice({ mode: 'tot', n: 7 });
    assert.equal(diceCount(d7), 6);
    const dbl = initDice({ mode: 'dbl' });
    assert.equal(diceCount(dbl), 6);
    const six = initDice({ mode: 'six' });
    assert.equal(diceCount(six), 11);

    const bag = actBag(initBag(), 'draw:10', () => 0.1);
    assert.equal(bag.n, 10);
    assert.equal(bag.t.r, 10);

    const tr0 = initTree({ r: 3, b: 2, rep: false, pick: 'rr' });
    assert.deepEqual([treeProb(tr0).num, treeProb(tr0).den], [6, 20]);
    const trRep = actTree(tr0, 'rep');
    assert.deepEqual([treeProb(trRep).num, treeProb(trRep).den], [9, 25]);
  });
});
