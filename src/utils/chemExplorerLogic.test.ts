import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  initGasLaw,
  calcGasLaw,
  initAtomBuild,
  calcAtomBuild,
  initPhScale,
  calcPhScale,
  initGibbs,
  calcGibbs,
  initEquil,
  calcEquil,
} from './chemExplorerLogic';
import { CHEM_NERDC_MAP, filterChemTopicsByClass } from '../data/chemNerdc2027';
import { SUBJECTS, getTopicsForProgress } from '../data/curriculum';

describe('Chemistry Chalkboard Explorers pure logic', () => {
  it('GasLaw: obeys Boyle PV = constant, Charles V/T = constant, and Graham diffusion ratio', () => {
    const b1 = calcGasLaw(initGasLaw({ mode: 'boyle', V: 2 }));
    const b2 = calcGasLaw(initGasLaw({ mode: 'boyle', V: 6 }));
    assert.equal(b1.P, 6);
    assert.equal(b2.P, 2);
    assert.equal(b1.PV, b2.PV);

    const c1 = calcGasLaw(initGasLaw({ mode: 'charles', Tc: 27 })); // 300 K
    const c2 = calcGasLaw(initGasLaw({ mode: 'charles', Tc: 177 })); // 450 K
    assert.equal(c1.Tk, 300);
    assert.equal(c2.Tk, 450);
    assert.equal(c1.VoverT, c2.VoverT);

    const h2 = calcGasLaw(initGasLaw({ gas: 'H2' }));
    assert.equal(h2.relDiffusionVsO2, 4); // sqrt(32/2) = 4
    assert.equal(h2.vapourDensity, 1);
  });

  it('AtomBuild: computes shells, s/p subshells, isotopes, and noble-gas ions for Z=1..20', () => {
    const na = calcAtomBuild(initAtomBuild({ Z: 11, nDelta: 0, charge: 0 }));
    assert.equal(na.sym, 'Na');
    assert.deepEqual(na.shells, [2, 8, 1]);
    assert.equal(na.period, 3);
    assert.equal(na.group, 'I');
    assert.equal(na.sElectrons, 5);
    assert.equal(na.pElectrons, 6);
    assert.equal(na.isNobleConfig, false);

    const naPlus = calcAtomBuild(initAtomBuild({ Z: 11, nDelta: 0, charge: 1 }));
    assert.equal(naPlus.electrons, 10);
    assert.equal(naPlus.isNobleConfig, true);

    const cl37 = calcAtomBuild(initAtomBuild({ Z: 17, nDelta: 2, charge: 0 }));
    assert.equal(cl37.A, 37);
    assert.equal(cl37.isIsotopeVariant, true);
  });

  it('PhScale: enforces pH + pOH = 14, indicator transitions, and salt hydrolysis presets', () => {
    const hcl = calcPhScale(initPhScale({ preset: 'hcl', indicator: 'methyl' }));
    assert.equal(hcl.pH + hcl.pOH, 14);
    assert.match(hcl.indicatorText, /Red/);

    const ch3coona = calcPhScale(initPhScale({ preset: 'ch3coona', indicator: 'phenol' }));
    assert.equal(ch3coona.pH, 9);
    assert.match(ch3coona.nature, /Alkaline/);
    assert.match(ch3coona.indicatorText, /pink/i);
  });

  it('Gibbs: lowers Ea with catalyst without altering dH or dG, and computes spontaneity', () => {
    const g0 = calcGibbs(initGibbs({ dH: -60, Ea: 90, catalyst: false, dS: -100, T: 300 }));
    const gCat = calcGibbs(initGibbs({ dH: -60, Ea: 90, catalyst: true, dS: -100, T: 300 }));
    assert.ok(gCat.activeEa < g0.activeEa);
    assert.equal(gCat.dH, g0.dH);
    assert.equal(gCat.dG, g0.dG);
    assert.equal(g0.dG, -30); // -60 - (300 * -0.1) = -30
    assert.equal(g0.isSpontaneous, true);
  });

  it('Equil: obeys Le Chatelier for temperature, gas-mole pressure shifts, and catalyst invariance', () => {
    const haberLowP = calcEquil(initEquil({ sys: 'haber', T: 450, P: 50, catalyst: false }));
    const haberHighP = calcEquil(initEquil({ sys: 'haber', T: 450, P: 250, catalyst: false }));
    const haberCat = calcEquil(initEquil({ sys: 'haber', T: 450, P: 250, catalyst: true }));
    assert.ok(haberHighP.yieldPct > haberLowP.yieldPct);
    assert.equal(haberHighP.yieldPct, haberCat.yieldPct);

    // Equal gas volumes on both sides (3Fe + 4H2O(g) <-> Fe3O4 + 4H2(g)) -> pressure has zero effect
    const feLowP = calcEquil(initEquil({ sys: 'iron', T: 400, P: 20 }));
    const feHighP = calcEquil(initEquil({ sys: 'iron', T: 400, P: 280 }));
    assert.equal(feLowP.yieldPct, feHighP.yieldPct);
  });
});

describe('NERDC SS1–SS3 + JAMB 2027 Chemistry Curriculum Mapping', () => {
  it('maps all 32 Chemistry topics cleanly across SS1 (11), SS2 (12), and SS3 (9) and Terms 1–3', () => {
    const allChem = SUBJECTS.chem.topics;
    assert.equal(allChem.length, 32);

    const ss1 = filterChemTopicsByClass(allChem, 'ss1');
    const ss2 = filterChemTopicsByClass(allChem, 'ss2');
    const ss3 = filterChemTopicsByClass(allChem, 'ss3');

    assert.equal(ss1.length, 11);
    assert.equal(ss2.length, 12);
    assert.equal(ss3.length, 9);
    assert.equal(ss1.length + ss2.length + ss3.length, 32);

    // Verify getTopicsForProgress scopes Chemistry by class and leaves Maths untouched
    assert.equal(
      getTopicsForProgress({
        subj: 'chem',
        chemClass: 'ss1',
        mathClass: 'all',
        physClass: 'all',
        bioClass: 'all',
        engClass: 'all',
      }).length,
      11
    );
    assert.equal(
      getTopicsForProgress({
        subj: 'chem',
        chemClass: 'all',
        mathClass: 'all',
        physClass: 'all',
        bioClass: 'all',
        engClass: 'all',
      }).length,
      32
    );
    assert.equal(
      getTopicsForProgress({
        subj: 'maths',
        chemClass: 'ss1',
        mathClass: 'all',
        physClass: 'all',
        bioClass: 'all',
        engClass: 'all',
      }).length,
      32
    );

    // Every Chemistry topic has NERDC metadata, 3 terms represented per class, and interactive lessons
    for (const cls of [ss1, ss2, ss3]) {
      const terms = new Set(cls.map((t) => CHEM_NERDC_MAP[t.id]?.term));
      assert.deepEqual([...terms].sort(), [1, 2, 3]);
    }

    // Verify all 6 new NERDC-specific topics + 2 JAMB 2027 new units exist
    for (const id of ['c-intro', 'c-part', 'c-carbon', 'c-water', 'c-petro', 'c-ethics', 'c-ind', 'c-astro']) {
      const found = allChem.find((t) => t.id === id);
      assert.ok(found, `Expected Chemistry topic ${id} to exist`);
      assert.ok(found.parts.length >= 2, `Expected >=2 parts in ${id}`);
      assert.ok(found.qs.length >= 8, `Expected >=8 questions in ${id}`);
    }
  });
});
