import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { getTopics, SUBJECT_IDS } from '../data/curriculum';
import { isTopicLocked, makeBlankProgress, nextMission } from './engine';
import {
  FREE_TRIAL_DAYS,
  FREE_TRIAL_DURATION_MS,
  PREMIUM_PLANS,
  buildCanonicalProPayloadV2,
  buildCanonicalTrialPayloadV1,
  buildPassPinWhatsAppUrl,
  computeTrialCountdownStatus,
  computeTrialStatus,
  formatPassPinClipboardBatch,
  formatPremiumRemaining,
  formatTrialCountdown,
  generateDeviceSecretToken,
  getPremiumPlanById,
  hasActivePremium,
  isCbtPresetPaywalled,
  isRecurringPlanId,
  isTopicPaywalled,
  isValidDeviceId,
  isValidDeviceSecretToken,
  isValidEmailAddress,
  isValidPaystackReference,
  isValidVoucherCodeFormat,
  looksLikeRawCardNumber,
  normalizeVoucherCode,
  verifySignedProReceiptAsync,
  verifySignedTrialReceiptAsync,
} from './paywallLogic';

const VALID_SIG = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

test('PREMIUM_PLANS defines recurring Monthly/6-Month/Yearly plans and one-time Lifetime (excluded from auto-debit)', () => {
  assert.equal(PREMIUM_PLANS.length, 4);
  assert.equal(FREE_TRIAL_DAYS, 1);

  const monthly = getPremiumPlanById('monthly');
  assert.equal(monthly?.priceNgn, 1000);
  assert.equal(monthly?.priceKobo, 100_000);
  assert.equal(monthly?.days, 30);
  assert.equal(monthly?.isRecurring, true);
  assert.equal(isRecurringPlanId('monthly'), true);

  const biannual = getPremiumPlanById('biannual');
  assert.equal(biannual?.priceNgn, 4500);
  assert.equal(biannual?.priceKobo, 450_000);
  assert.equal(biannual?.days, 180);
  assert.equal(biannual?.isRecurring, true);
  assert.equal(isRecurringPlanId('biannual'), true);

  const annual = getPremiumPlanById('annual');
  assert.equal(annual?.priceNgn, 9000);
  assert.equal(annual?.priceKobo, 900_000);
  assert.equal(annual?.days, 365);
  assert.equal(annual?.popular, true);
  assert.equal(annual?.isRecurring, true);
  assert.equal(isRecurringPlanId('annual'), true);

  const lifetime = getPremiumPlanById('lifetime');
  assert.equal(lifetime?.priceNgn, 27800);
  assert.equal(lifetime?.priceKobo, 2_780_000);
  assert.equal(lifetime?.days, 36500);
  assert.equal(lifetime?.isRecurring, false);
  assert.equal(isRecurringPlanId('lifetime'), false);

  // Legacy aliases map cleanly
  assert.equal(getPremiumPlanById('weekly')?.id, 'monthly');
  assert.equal(getPremiumPlanById('season')?.id, 'annual');
  assert.equal(getPremiumPlanById('unknown'), null);
});

test('computeTrialStatus & computeTrialCountdownStatus enforce exact 1-day (24h) free trial and hard expiry lock', () => {
  const startDay = 20500;
  const startMs = 1_770_000_000_000;
  const student = {
    trial: {
      startedDay: startDay,
      untilDay: startDay,
      startedAtMs: startMs,
      endsAtMs: startMs + FREE_TRIAL_DURATION_MS,
      sig: VALID_SIG,
    },
  };

  // Day 1 active
  const d1 = computeTrialStatus(student, startDay);
  assert.equal(d1.daysRemaining, 1);
  assert.equal(d1.isTrialActive, true);
  assert.equal(d1.isTrialExpired, false);

  // Day 2+ -> expired immediately
  const d2 = computeTrialStatus(student, startDay + 1);
  assert.equal(d2.daysRemaining, 0);
  assert.equal(d2.isTrialActive, false);
  assert.equal(d2.isTrialExpired, true);

  // Live 24h countdown formatting & warning window (< 2 hours)
  assert.equal(formatTrialCountdown(FREE_TRIAL_DURATION_MS), '24:00:00');
  const cdFresh = computeTrialCountdownStatus({
    trial: student.trial,
    nowMs: startMs + 60_000,
    currentDay: startDay,
  });
  assert.equal(cdFresh.isExpired, false);
  assert.equal(cdFresh.isWarning, false);
  assert.equal(cdFresh.formattedCountdown, '23:59:00');

  const cdWarn = computeTrialCountdownStatus({
    trial: student.trial,
    nowMs: startMs + FREE_TRIAL_DURATION_MS - 3_600_000,
    currentDay: startDay,
  });
  assert.equal(cdWarn.isExpired, false);
  assert.equal(cdWarn.isWarning, true);
  assert.equal(cdWarn.formattedCountdown, '01:00:00');

  const cdExpired = computeTrialCountdownStatus({
    trial: student.trial,
    nowMs: startMs + FREE_TRIAL_DURATION_MS + 1000,
    currentDay: startDay,
  });
  assert.equal(cdExpired.isExpired, true);
  assert.equal(cdExpired.remainingMs, 0);
  assert.equal(cdExpired.formattedCountdown, '00:00:00');

  // Raw card PAN guard rejects raw card numbers in display labels
  assert.equal(looksLikeRawCardNumber('Personal Google Pay'), false);
  assert.equal(looksLikeRawCardNumber('GTBank Account'), false);
  assert.equal(looksLikeRawCardNumber('4242 4242 4242 4242'), true);
});

test('topics stay open during Day 1 free trial, lock on Day 2+, and unlock on any paid plan including ₦1k monthly', () => {
  const startDay = 20500;
  const trialStudent = {
    ...makeBlankProgress(),
    trial: { startedDay: startDay, untilDay: startDay, sig: VALID_SIG },
  };
  const monthlyStudent = {
    ...trialStudent,
    pro: { pid: 'monthly', on: startDay + 2, until: startDay + 32, code: 'ELRN-1000-PASS', sig: VALID_SIG },
  };

  for (const sid of SUBJECT_IDS) {
    const topics = getTopics(sid);
    assert.ok(topics.length >= 3, `${sid} should have at least 3 topics`);
    const sampleTid = topics[2].id;

    // Day 1: basic topic notes & practice open
    assert.equal(isTopicPaywalled(trialStudent, sampleTid, topics, startDay), false);
    assert.equal(isTopicLocked(trialStudent, sampleTid, topics, startDay), false);

    // Day 2+: locked until subscribed
    assert.equal(isTopicPaywalled(trialStudent, sampleTid, topics, startDay + 1), true);
    assert.equal(isTopicLocked(trialStudent, sampleTid, topics, startDay + 1), true);

    // ₦1,000/month plan grants 100% full access even after trial window
    assert.equal(isTopicPaywalled(monthlyStudent, sampleTid, topics, startDay + 5), false);
    assert.equal(isTopicLocked(monthlyStudent, sampleTid, topics, startDay + 5), false);
  }

  // nextMission returns a topic during active 1-day trial, and null once expired without subscription
  const mathsTopics = getTopics('maths');
  assert.ok(nextMission(trialStudent, mathsTopics, mathsTopics, startDay));
  assert.equal(nextMission(trialStudent, mathsTopics, mathsTopics, startDay + 1), null);
  assert.ok(nextMission(monthlyStudent, mathsTopics, mathsTopics, startDay + 5));
});

test('CBT mock exam is completely locked across all presets during unsubscribed trial and unlocked on any paid plan', () => {
  const curDay = 20500;
  const trialStudent = {
    ...makeBlankProgress(),
    trial: { startedDay: curDay, untilDay: curDay + 2, sig: VALID_SIG },
  };
  const monthlyStudent = {
    ...trialStudent,
    pro: { pid: 'monthly', on: curDay, until: curDay + 30, code: 'EYAK-TEST-2026', sig: VALID_SIG },
  };

  assert.equal(isCbtPresetPaywalled(trialStudent, 'sprint', curDay), true);
  assert.equal(isCbtPresetPaywalled(trialStudent, 'half', curDay), true);
  assert.equal(isCbtPresetPaywalled(trialStudent, 'full', curDay), true);

  assert.equal(isCbtPresetPaywalled(monthlyStudent, 'sprint', curDay), false);
  assert.equal(isCbtPresetPaywalled(monthlyStudent, 'half', curDay), false);
  assert.equal(isCbtPresetPaywalled(monthlyStudent, 'full', curDay), false);
});

test('voucher code, device ID, email, Paystack reference, and lifetime remaining-days helpers validate strictly', () => {
  assert.equal(normalizeVoucherCode(' elrn 7k4m 9p2q '), 'ELRN-7K4M-9P2Q');
  assert.equal(isValidVoucherCodeFormat('elrn-7k4m-9p2q'), true);
  assert.equal(normalizeVoucherCode(' eyak abcd 2345 '), 'EYAK-ABCD-2345');
  assert.equal(isValidVoucherCodeFormat('eyak-abcd-2345'), true);
  assert.equal(isValidVoucherCodeFormat('SHORT'), false);

  const waUrl = buildPassPinWhatsAppUrl({
    code: 'ELRN-7K4M-9P2Q',
    planName: 'Yearly pass',
    days: 365,
    note: 'Chinedu SS3',
  });
  assert.ok(waUrl.startsWith('https://wa.me/?text='));
  assert.ok(decodeURIComponent(waUrl).includes('ELRN-7K4M-9P2Q'));
  assert.ok(decodeURIComponent(waUrl).includes('Chinedu SS3'));

  assert.equal(
    formatPassPinClipboardBatch([
      { code: 'ELRN-7K4M-9P2Q', planName: 'Monthly pass', days: 30 },
    ]),
    'ELRN-7K4M-9P2Q'
  );
  const multi = formatPassPinClipboardBatch([
    { code: 'ELRN-7K4M-9P2Q', planName: 'Monthly pass', days: 30, note: 'Batch A' },
    { code: 'ELRN-8M2P-4Q9W', planName: 'Monthly pass', days: 30, note: 'Batch A' },
  ]);
  assert.ok(multi.includes('1. ELRN-7K4M-9P2Q'));
  assert.ok(multi.includes('2. ELRN-8M2P-4Q9W'));

  assert.equal(isValidDeviceId('ABCD-1234-EF'), true);
  assert.equal(isValidDeviceId('12'), false);

  assert.equal(isValidEmailAddress('ada@campus.ng'), true);
  assert.equal(isValidEmailAddress('not-an-email'), false);

  assert.equal(isValidPaystackReference('eyak_annual_17300000_ab12cd34'), true);
  assert.equal(isValidPaystackReference('../bad/path'), false);

  assert.equal(hasActivePremium({ pro: null, owner: 0 }, 20500), false);
  assert.equal(
    hasActivePremium(
      { pro: { pid: 'annual', on: 20500, until: 20900, code: 'EYAK', sig: 'not-hex-signature-value!!' }, owner: 0 },
      20500
    ),
    false
  );
  assert.equal(formatPremiumRemaining(20500, 20500), 'Expires today');
  assert.equal(formatPremiumRemaining(20501, 20500), '1 day left');
  assert.equal(formatPremiumRemaining(20530, 20500), '30 days left');
  assert.equal(formatPremiumRemaining(57000, 20500, 'lifetime'), 'Lifetime access');

  const secretTok = generateDeviceSecretToken();
  assert.equal(secretTok.length, 48);
  assert.equal(isValidDeviceSecretToken(secretTok), true);
  assert.equal(isValidDeviceSecretToken('short'), false);
});

test('verifySignedProReceiptAsync & verifySignedTrialReceiptAsync verify genuine ECDSA P-256 receipts and reject localStorage tampering', async () => {
  const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', { namedCurve: 'prime256v1' });
  const pubExport = publicKey.export({ format: 'jwk' });
  const publicKeyJwk: JsonWebKey = {
    kty: 'EC',
    crv: 'P-256',
    x: pubExport.x,
    y: pubExport.y,
  };

  // 1. Pro receipt verification
  const proFields = { pid: 'lifetime', on: 20500, until: 57000, code: 'EYAK-SAFE-2026' };
  const proSig = crypto
    .sign('sha256', Buffer.from(buildCanonicalProPayloadV2(proFields), 'utf8'), {
      key: privateKey,
      dsaEncoding: 'ieee-p1363',
    })
    .toString('hex');

  const genuinePro = { ...proFields, sig: proSig };
  assert.equal(await verifySignedProReceiptAsync(genuinePro, publicKeyJwk), true);
  assert.equal(await verifySignedProReceiptAsync({ ...genuinePro, until: 99999 }, publicKeyJwk), false);
  assert.equal(await verifySignedProReceiptAsync({ ...proFields, sig: 'a'.repeat(128) }, publicKeyJwk), false);

  // 2. Trial receipt verification
  const trialFields = { startedDay: 20500, untilDay: 20502 };
  const trialSig = crypto
    .sign('sha256', Buffer.from(buildCanonicalTrialPayloadV1(trialFields), 'utf8'), {
      key: privateKey,
      dsaEncoding: 'ieee-p1363',
    })
    .toString('hex');

  const genuineTrial = { ...trialFields, sig: trialSig };
  assert.equal(await verifySignedTrialReceiptAsync(genuineTrial, publicKeyJwk), true);

  // Extending startedDay or untilDay in localStorage fails cryptographic verification
  assert.equal(
    await verifySignedTrialReceiptAsync({ ...genuineTrial, startedDay: 20510 }, publicKeyJwk),
    false
  );
  assert.equal(
    await verifySignedTrialReceiptAsync({ ...genuineTrial, untilDay: 20999 }, publicKeyJwk),
    false
  );
});

test('parseScholarEmailList and calculatePaystackSeatQuote compute exact Paystack Naira & kobo totals', async () => {
  const {
    parseScholarEmailList,
    calculatePaystackSeatQuote,
    isConfiguredPaystackSecretKey,
  } = await import('./paywallLogic');

  assert.equal(isConfiguredPaystackSecretKey(''), false);
  assert.equal(isConfiguredPaystackSecretKey('pk_live_0123456789abcdef0123456789abcdef'), false);
  assert.equal(isConfiguredPaystackSecretKey('sk_test_your_secret_key_here'), false);
  assert.equal(isConfiguredPaystackSecretKey('YOUR_PAYSTACK_SECRET_KEY'), false);
  assert.equal(
    isConfiguredPaystackSecretKey('sk_live_9f8e7d6c5b4a39281726354433221100aabbccdd'),
    true
  );

  const parsed = parseScholarEmailList(
    'Chinedu@Gmail.com, ada@school.edu.ng\nchinedu@gmail.com; bad-email'
  );
  assert.deepEqual(parsed.emails, ['chinedu@gmail.com', 'ada@school.edu.ng']);
  assert.deepEqual(parsed.invalidEntries, ['bad-email']);

  const singleMonthly = calculatePaystackSeatQuote(1, 'monthly');
  assert.equal(singleMonthly.seats, 1);
  assert.equal(singleMonthly.discountPct, 0);
  assert.equal(singleMonthly.totalNgn, 1000);
  assert.equal(singleMonthly.totalKobo, 100_000);

  const classCohort = calculatePaystackSeatQuote(20, 'annual');
  assert.equal(classCohort.discountPct, 15);
  assert.equal(classCohort.subtotalNgn, 180_000);
  assert.equal(classCohort.savingsNgn, 27_000);
  assert.equal(classCohort.totalNgn, 153_000);
  assert.equal(classCohort.totalKobo, 15_300_000);

  const schoolCohort = calculatePaystackSeatQuote(50, 'biannual');
  assert.equal(schoolCohort.discountPct, 25);
  assert.equal(schoolCohort.subtotalNgn, 225_000);
  assert.equal(schoolCohort.totalNgn, 168_750);
  assert.equal(schoolCohort.totalKobo, 16_875_000);
});

