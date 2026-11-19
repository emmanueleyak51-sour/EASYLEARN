import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const rulesSrc = fs.readFileSync('firestore.rules', 'utf8');
const blueprint = JSON.parse(fs.readFileSync('firebase-blueprint.json', 'utf8'));

test('firestore.rules uses rules_version 2 and global default-deny safety net', () => {
  assert.match(rulesSrc, /rules_version\s*=\s*'2'/);
  assert.match(rulesSrc, /match \/\{document=\*\*\}\s*\{\s*allow read, write: if false;\s*\}/);
});

test('all blueprint collections have explicit match blocks in firestore.rules', () => {
  const paths = Object.keys(blueprint.firestore || {});
  assert.ok(paths.length >= 5);
  assert.match(rulesSrc, /match \/users\/\{userId\}/);
  assert.match(rulesSrc, /match \/sync\/\{docId\}/);
  assert.match(rulesSrc, /match \/duels\/\{duelId\}/);
  assert.match(rulesSrc, /match \/entries\/\{entryId\}/);
  assert.match(rulesSrc, /match \/leaderboard\/\{userId\}/);
});

test('blueprint and rules share synchronized 12-subject enums and regex patterns', () => {
  const expectedSubjects = [
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
  ];
  assert.deepEqual(blueprint.entities.UserProfile.properties.activeSubj.enum, expectedSubjects);
  assert.deepEqual(blueprint.entities.PeerDuel.properties.subject.enum, expectedSubjects);
  assert.deepEqual(blueprint.entities.LeaderboardEntry.properties.primarySubj.enum, expectedSubjects);
  assert.equal(
    blueprint.entities.UserProfile.properties.examDate.pattern,
    '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
  );
  assert.equal(blueprint.entities.PeerDuel.properties.seed.pattern, '^[a-zA-Z0-9_\\-]+$');

  assert.match(rulesSrc, /function isValidSubject\(subj\)/);
  for (const subj of expectedSubjects) {
    assert.ok(rulesSrc.includes(`'${subj}'`), `firestore.rules must allow subject ${subj}`);
  }
  assert.match(rulesSrc, /data\.examDate\.matches\('\^\[0-9\]\{4\}-\[0-9\]\{2\}-\[0-9\]\{2\}\$'\)/);
  assert.match(rulesSrc, /data\.seed\.matches\('\^\[a-zA-Z0-9_\\\\-\]\+\$'\)/);
});

test('Dirty Dozen+ guards: email_verified, isValidId, canonical sync/main, Master Gates, hasOnly, affectedKeys, request.time, bounds', () => {
  assert.match(rulesSrc, /request\.auth\.token\.email_verified == true/);
  assert.match(rulesSrc, /function isValidId\(id\)/);
  assert.match(rulesSrc, /data\.keys\(\)\.hasOnly\(/);
  assert.match(rulesSrc, /data\.progress\.keys\(\)\.hasOnly\(/);
  assert.match(rulesSrc, /affectedKeys\(\)\.hasOnly\(/);
  assert.match(rulesSrc, /request\.time/);

  // Canonical sync/main document lock + parent profile Master Gate
  assert.match(rulesSrc, /docId == 'main'/);
  assert.match(rulesSrc, /exists\(\/databases\/\$\(database\)\/documents\/users\/\$\(userId\)\)/);

  // Duel entry Master Gate: parent duel must exist AND questionCount must match submitted total
  assert.match(rulesSrc, /exists\(\/databases\/\$\(database\)\/documents\/duels\/\$\(duelId\)\)/);
  assert.match(
    rulesSrc,
    /get\(\/databases\/\$\(database\)\/documents\/duels\/\$\(duelId\)\)\.data\.questionCount == incoming\(\)\.total/
  );

  // Owner-only user profile and no user/sync list scraping
  assert.match(rulesSrc, /allow list: if false;/);

  // Leaderboard list strictly enforces public opt-in and numeric score bounds
  assert.match(rulesSrc, /allow list: if isSignedIn\(\) && resource\.data\.isPublic == true;/);
  assert.match(rulesSrc, /data\.masteryIndex <= 1000/);
  assert.match(rulesSrc, /data\.bestCbtScore <= 400/);
  assert.match(rulesSrc, /data\.accuracyPct <= 100/);

  // Action-based update branches
  assert.match(rulesSrc, /Action 1: Profile display & target update/);
  assert.match(rulesSrc, /Action 1: Visibility or Campus Goal preference change/);

  // Immutable duel definitions & entries (cannot tamper scores after submit)
  assert.match(rulesSrc, /allow update: if false;/);
  assert.match(rulesSrc, /data\.score <= data\.total/);
});
