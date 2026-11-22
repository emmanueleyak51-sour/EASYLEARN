import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BIBLE_BOOKS_CATALOG,
  BIBLE_VERSION_IDS,
  cleanBibleVerseText,
  computeBmiAndHr,
  computeBreakEvenUnits,
  computeDepreciation,
  computeFcr,
  computeInsuranceAverageClaim,
  computeMarkupAndMargin,
  computeOhmsLaw,
  computeReorderLevel,
  computeTrialBalance,
  convertNumberBase,
  convertOvenTemp,
  estimateWallBlocks,
  evalLogicGate,
  validateBibleQuery,
  validateQuranSurah,
} from './studioCalculators';
import { BIBLE_VERSIONS, getOfflineBibleChapter } from '../data/reference/crsBibleData';
import { OFFLINE_QURAN_SURAHS, QURAN_EDITIONS } from '../data/reference/irsQuranData';

test('Bible catalog has all 66 canonical books and 12 Nigerian-favorite versions with strict allowlist validation', () => {
  assert.equal(BIBLE_BOOKS_CATALOG.length, 66);
  assert.equal(BIBLE_VERSION_IDS.length, 12);
  assert.equal(BIBLE_VERSIONS.length, 12);

  const ok = validateBibleQuery('Psalms', 23, 'rsv');
  assert.equal(ok.ok, true);
  if (ok.ok) {
    assert.equal(ok.book, 'Psalms');
    assert.equal(ok.bookNumber, 19);
    assert.equal(ok.chapter, 23);
    assert.equal(ok.version, 'rsv');
  }

  for (const popular of ['rsv', 'kjv', 'nkjv', 'gnt', 'nlt', 'amp', 'esv', 'msg', 'nasb', 'erv', 'web', 'bbe']) {
    assert.equal(validateBibleQuery('John', 3, popular).ok, true, `${popular} should be accepted`);
  }

  // Reject SSRF / invalid books / out-of-bounds chapters / unknown versions
  assert.equal(validateBibleQuery('http://127.0.0.1/etc', 1, 'kjv').ok, false);
  assert.equal(validateBibleQuery('Genesis', 51, 'kjv').ok, false);
  assert.equal(validateBibleQuery('Genesis', 0, 'kjv').ok, false);
  assert.equal(validateBibleQuery('Genesis', 1, 'unknown_ver').ok, false);

  // Clean HTML tags and Strong's concordance numbers cleanly
  assert.equal(
    cleanBibleVerseText('<i>A Psalm</i> of David<S>1732</S>.<br/>The LORD&#39;s mercy &amp; grace'),
    'A Psalm of David. The LORD’s mercy & grace'
  );

  // Every offline chapter has text for all 12 Bible versions
  for (const ver of BIBLE_VERSION_IDS) {
    const ch = getOfflineBibleChapter('Psalms', 23, ver);
    assert.ok(ch && ch.length >= 6, `Offline Psalm 23 missing for ${ver}`);
  }
});

test('Quran validator enforces 1..114 bounds and 5 editions exist offline', () => {
  assert.equal(QURAN_EDITIONS.length, 5);
  assert.equal(validateQuranSurah(1).ok, true);
  assert.equal(validateQuranSurah(114).ok, true);
  assert.equal(validateQuranSurah(0).ok, false);
  assert.equal(validateQuranSurah(115).ok, false);
  assert.equal(validateQuranSurah('1; DROP TABLE').ok, false);

  const fatihah = OFFLINE_QURAN_SURAHS[1];
  assert.equal(fatihah.length, 7);
  assert.ok(fatihah[0].arabic && fatihah[0].transliteration && fatihah[0].sahih && fatihah[0].yusufali && fatihah[0].pickthall);
});

test('Accounting trial balance and depreciation calculators compute accurate figures', () => {
  const tb = computeTrialBalance([
    { id: '1', label: 'Capital', debitAccount: 'Cash', creditAccount: 'Capital', amount: 100000 },
    { id: '2', label: 'Rent', debitAccount: 'Rent', creditAccount: 'Cash', amount: 25000 },
  ]);
  assert.equal(tb.balanced, true);
  assert.equal(tb.totalDebit, 100000);
  assert.equal(tb.totalCredit, 100000);

  const sl = computeDepreciation(500000, 50000, 5, 20, 'straight-line');
  assert.equal(sl.length, 5);
  assert.equal(sl[0].charge, 90000);
  assert.equal(sl[4].nbv, 50000);

  const rb = computeDepreciation(100000, 0, 2, 20, 'reducing-balance');
  assert.equal(rb[0].charge, 20000);
  assert.equal(rb[1].charge, 16000);
  assert.equal(rb[1].nbv, 64000);
});

test('Business, Commerce, Insurance and Store calculators match syllabus formulas', () => {
  const mm = computeMarkupAndMargin(800, 1000);
  assert.equal(mm.profit, 200);
  assert.equal(mm.markupPct, 25);
  assert.equal(mm.marginPct, 20);

  const be = computeBreakEvenUnits(100000, 500, 300);
  assert.equal(be.contributionPerUnit, 200);
  assert.equal(be.breakEvenUnits, 500);

  const ins = computeInsuranceAverageClaim(6000000, 10000000, 2500000);
  assert.equal(ins.underInsured, true);
  assert.equal(ins.payableClaim, 1500000);

  const stock = computeReorderLevel(50, 10, 20, 4, 400);
  assert.equal(stock.reorderLevel, 500);
  assert.equal(stock.minStock, 255);
  assert.equal(stock.maxStock, 820);
});

test('Computing, PHE, Kitchen, Blockwork, Electrical and Livestock calculators work accurately', () => {
  const b = convertNumberBase(42);
  assert.equal(b.binary, '101010');
  assert.equal(b.octal, '52');
  assert.equal(b.hex, '2A');

  assert.equal(evalLogicGate('AND', 1, 0), 0);
  assert.equal(evalLogicGate('XOR', 1, 0), 1);
  assert.equal(evalLogicGate('NAND', 1, 1), 0);
  assert.equal(evalLogicGate('NOT', 1, 0), 0);

  const fit = computeBmiAndHr(68, 170, 20);
  assert.equal(fit.bmi, 23.5);
  assert.equal(fit.maxHr, 200);

  const ov = convertOvenTemp(180);
  assert.equal(ov.fahrenheit, 356);
  assert.equal(ov.gasMark, 'Gas 4');

  const wall = estimateWallBlocks(6, 3, 2, 10);
  assert.equal(wall.netAreaM2, 16);
  assert.equal(wall.blocksNeeded, 176);

  const ohms = computeOhmsLaw(230, 46);
  assert.equal(ohms.currentAmps, 5);
  assert.equal(ohms.powerWatts, 1150);

  const fcr = computeFcr(140, 100);
  assert.equal(fcr.fcr, 1.4);
});
