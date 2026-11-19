import test from 'node:test';
import assert from 'node:assert/strict';
import {
  authenticateAccount,
  buildRegisteredAccount,
  generateScholarOtp,
  validateLoginInput,
  validateOtpCode,
  validateRegisterInput,
} from './authAccounts';
import { SUBJECT_IDS, SUBJECTS } from '../data/curriculum';
import { getLabsForSubject } from '../data/labs';
import { filterCivicTopicsByClass } from '../data/civicNerdc2027';

test('validateLoginInput enforces non-empty identifier and >=4 char passcode', () => {
  assert.equal(validateLoginInput('', '1234').ok, false);
  assert.equal(validateLoginInput('a', '1234').ok, false);
  assert.equal(validateLoginInput('Amina', '').ok, false);
  assert.equal(validateLoginInput('Amina', '123').ok, false);
  assert.equal(validateLoginInput('Amina', '2027').ok, true);
});

test('validateRegisterInput validates username, email format, and passcode', () => {
  assert.equal(validateRegisterInput('', 'amina@school.ng', '2027').ok, false);
  assert.equal(validateRegisterInput('Amina', 'not-an-email', '2027').ok, false);
  assert.equal(validateRegisterInput('Amina', 'amina@school.ng', '12').ok, false);
  assert.equal(validateRegisterInput('Amina', 'amina@school.ng', 'scholar1').ok, true);
});

test('generateScholarOtp & validateOtpCode verify deterministic 4-digit OTP codes', () => {
  const otp = generateScholarOtp('amina@school.ng');
  assert.match(otp, /^\d{4}$/);
  assert.equal(generateScholarOtp('AMINA@SCHOOL.NG'), otp);

  const digits = otp.split('');
  assert.equal(validateOtpCode(digits, otp).ok, true);
  assert.equal(validateOtpCode(['0', '0', '0', '0'], otp === '0000' ? '1111' : otp).ok, false);
  assert.equal(validateOtpCode(['1', '2', '', '4'], otp).ok, false);
});

test('buildRegisteredAccount & authenticateAccount round-trip by username or email', () => {
  const { accounts, account } = buildRegisteredAccount([], {
    username: 'Chinedu',
    email: 'Chinedu@Campus.ng',
    password: 'pass2027',
    classLevel: 'ss2',
    subjs: ['maths', 'civic'],
    target: 80,
    nowMs: 1700000000000,
  });

  assert.equal(accounts.length, 1);
  assert.equal(account.email, 'chinedu@campus.ng');

  const byUser = authenticateAccount(accounts, 'chinedu', 'pass2027');
  assert.equal(byUser.ok, true);
  assert.equal(byUser.account?.username, 'Chinedu');

  const byEmail = authenticateAccount(accounts, 'CHINEDU@CAMPUS.NG', 'pass2027');
  assert.equal(byEmail.ok, true);

  const wrongPass = authenticateAccount(accounts, 'Chinedu', 'wrong99');
  assert.equal(wrongPass.ok, false);
});

test('12-subject matrix: Civic, Further Maths, Geography, DigiTech & DataProc have 30 SS1-SS3 topics and ZERO labs', () => {
  assert.deepEqual(SUBJECT_IDS, [
    'maths',
    'fmaths',
    'chem',
    'phys',
    'bio',
    'agric',
    'geog',
    'econ',
    'eng',
    'civic',
    'digitech',
    'dataproc',
  ]);

  const civic = SUBJECTS.civic;
  assert.equal(civic.topics.length, 30);
  assert.equal(filterCivicTopicsByClass(civic.topics, 'ss1').length, 10);
  assert.equal(filterCivicTopicsByClass(civic.topics, 'ss2').length, 10);
  assert.equal(filterCivicTopicsByClass(civic.topics, 'ss3').length, 10);

  const totalQs = civic.topics.reduce((s, t) => s + t.qs.length, 0);
  assert.equal(totalQs, 180);

  // Civic, F.Maths, Geography, Economics, English, DigiTech & DataProc have NO labs; Bio & Agric DO have labs
  assert.equal(getLabsForSubject('fmaths').length, 0);
  assert.equal(getLabsForSubject('geog').length, 0);
  assert.equal(getLabsForSubject('civic').length, 0);
  assert.equal(getLabsForSubject('econ').length, 0);
  assert.equal(getLabsForSubject('eng').length, 0);
  assert.equal(getLabsForSubject('digitech').length, 0);
  assert.equal(getLabsForSubject('dataproc').length, 0);
  assert.ok(getLabsForSubject('bio').length > 0);
  assert.ok(getLabsForSubject('agric').length > 0);
});
