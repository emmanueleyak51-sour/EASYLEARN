import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { getTopics, SUBJECT_IDS } from '../data/curriculum';
import { isTopicLocked, makeBlankProgress, nextMission } from './engine';
import {
  FREE_TRIAL_DAYS,
  PREMIUM_PLANS,
  buildCanonicalProPayloadV2,
  buildCanonicalTrialPayloadV1,
  computeTrialStatus,
  formatPremiumRemaining,
  generateDeviceSecretToken,
  getPremiumPlanById,
  hasActivePremium,
  isCbtPresetPaywalled,
  isTopicPaywalled,
  isValidDeviceId,
  isValidDeviceSecretToken,
  isValidEmailAddress,
  isValidPaystackReference,
  isValidVoucherCodeFormat,
  normalizeVoucherCode,
  verifySignedProReceiptAsync,
  verifySignedTrialReceiptAsync,
} from './paywallLogic';

const VALID_SIG = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

test('PREMIUM_PLANS defines Monthly (₦1k), 6-Month (₦4.5k), Yearly (₦9k), and Lifetime (₦27.8k) passes accurately', () => {
  assert.equal(PREMIUM_PLANS.length, 4);
  assert.equal(FREE_TRIAL_DAYS, 3);

  const monthly = getPremiumPlanById('monthly');
  assert.equal(monthly?.priceNgn, 1000);
  assert.equal(monthly?.priceKobo, 100_000);
  assert.equal(monthly?.days, 30);

  const biannual = getPremiumPlanById('biannual');
  assert.equal(biannual?.priceNgn, 4500);
  assert.equal(biannual?.priceKobo, 450_000);
  assert.equal(biannual?.days, 180);

  const annual = getPremiumPlanById('annual');
  assert.equal(annual?.priceNgn, 9000);
  assert.equal(annual?.priceKobo, 900_000);
  assert.equal(annual?.days, 365);
  assert.equal(annual?.popular, true);

  const lifetime = getPremiumPlanById('lifetime');
  assert.equal(lifetime?.priceNgn, 27800);
  assert.equal(lifetime?.priceKobo, 2_780_000);
  assert.equal(lifetime?.days, 36500);

  // Legacy aliases map cleanly
  assert.equal(getPremiumPlanById('weekly')?.id, 'monthly');
  assert.equal(getPremiumPlanById('season')?.id, 'annual');
  assert.equal(getPremiumPlanById('unknown'), null);
});

test('computeTrialStatus enforces exact 3-day starter trial window and Day-4 expiry', () => {
  const startDay = 20500;
  const student = { trial: { startedDay: startDay, untilDay: startDay + 2, sig: VALID_SIG } };

  // Day 1
  const d1 = computeTrialStatus(student, startDay);
  assert.equal(d1.daysRemaining, 3);
  assert.equal(d1.isTrialActive, true);
  assert.equal(d1.isTrialExpired, false);

  // Day 2
  const d2 = computeTrialStatus(student, startDay + 1);
  assert.equal(d2.daysRemaining, 2);
  assert.equal(d2.isTrialActive, true);
  assert.equal(d2.isTrialExpired, false);

  // Day 3 (last day of starter trial)
  const d3 = computeTrialStatus(student, startDay + 2);
  assert.equal(d3.daysRemaining, 1);
  assert.equal(d3.isTrialActive, true);
  assert.equal(d3.isTrialExpired, false);

  // Day 4+ -> expired
  const d4 = computeTrialStatus(student, startDay + 3);
  assert.equal(d4.daysRemaining, 0);
  assert.equal(d4.isTrialActive, false);
  assert.equal(d4.isTrialExpired, true);
});

test('topics stay open for basic notes & practice during Days 1-3, lock on Day 4+, and unlock on any paid plan including ₦1k monthly', () => {
  const startDay = 20500;
  const trialStudent = {
    ...makeBlankProgress(),
    trial: { startedDay: startDay, untilDay: startDay + 2, sig: VALID_SIG },
  };
  const monthlyStudent = {
    ...trialStudent,
    pro: { pid: 'monthly', on: startDay + 4, until: startDay + 34, code: 'EYAK-1000-PASS', sig: VALID_SIG },
  };

  for (const sid of SUBJECT_IDS) {
    const topics = getTopics(sid);
    assert.ok(topics.length >= 3, `${sid} should have at least 3 topics`);
    const sampleTid = topics[2].id;

    // Day 1-3: basic topic notes & practice open
    assert.equal(isTopicPaywalled(trialStudent, sampleTid, topics, startDay), false);
    assert.equal(isTopicLocked(trialStudent, sampleTid, topics, startDay + 2), false);

    // Day 4+: locked until subscribed
    assert.equal(isTopicPaywalled(trialStudent, sampleTid, topics, startDay + 3), true);
    assert.equal(isTopicLocked(trialStudent, sampleTid, topics, startDay + 3), true);

    // ₦1,000/month plan grants 100% full access even after trial window
    assert.equal(isTopicPaywalled(monthlyStudent, sampleTid, topics, startDay + 5), false);
    assert.equal(isTopicLocked(monthlyStudent, sampleTid, topics, startDay + 5), false);
  }

  // nextMission returns a topic during active 3-day trial, and null once expired without subscription
  const mathsTopics = getTopics('maths');
  assert.ok(nextMission(trialStudent, mathsTopics, mathsTopics, startDay + 1));
  assert.equal(nextMission(trialStudent, mathsTopics, mathsTopics, startDay + 3), null);
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
  assert.equal(normalizeVoucherCode(' eyak abcd 2345 '), 'EYAK-ABCD-2345');
  assert.equal(isValidVoucherCodeFormat('eyak-abcd-2345'), true);
  assert.equal(isValidVoucherCodeFormat('SHORT'), false);

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
