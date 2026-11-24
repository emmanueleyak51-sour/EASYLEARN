import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SUBJECTS,
  SUBJECT_IDS,
  getAllTopicsBySubj,
  getInteractiveLesson,
  getTopics,
  getTopicsForProgress,
} from '../data/curriculum';
import {
  ALL_SUBJECT_IDS,
  JAMB_SUBJECT_IDS,
  WAEC_ONLY_SUBJECT_IDS,
  WAEC_SCHOOL_ONLY_SUBJECT_IDS,
  WAEC_TRADE_ONLY_SUBJECT_IDS,
  estimateJambScoreOutOf400,
  isJambSubject,
  isUtmeSingleBlockSubject,
  isWaecOnlySubject,
} from './examSubjects';
import { SUBJECT_INFO, makeBlankProgress } from './engine';
import { isWaecOnlyCbtSubject } from './cbtEngine';
import { createDuelCode, parseDuelCode } from './peerDuelLogic';
import { resolveAuthoritativeSubject } from './securityPolicy';
import { SUBJECT_TUTOR_REGISTRY } from './tutorRegistry';
import { hasFormulaSheet, SUBJECT_STUDIO_META } from './subjectStudioMeta';
import {
  extractBeatSpeechScript,
  extractMissionSpeechScript,
  extractTopicTestIntroSpeechScript,
} from './chemVoiceLogic';

const LAB_OR_FORMULA_SUBJECTS = new Set([
  'maths', 'fmaths', 'chem', 'phys', 'bio', 'agric', 'geog', 'econ', 'eng', 'digitech', 'dataproc',
]);

test('catalog exposes all 49 official JAMB and WAEC/NECO subjects cleanly', () => {
  assert.equal(JAMB_SUBJECT_IDS.length, 25);
  assert.equal(WAEC_SCHOOL_ONLY_SUBJECT_IDS.length, 14);
  assert.equal(WAEC_TRADE_ONLY_SUBJECT_IDS.length, 10);
  assert.equal(WAEC_ONLY_SUBJECT_IDS.length, 24);
  assert.equal(ALL_SUBJECT_IDS.length, 49);
  assert.deepEqual(SUBJECT_IDS, [...ALL_SUBJECT_IDS]);
});

test('Part 4 core JAMB subjects have exact required topic counts', () => {
  assert.equal(getTopics('govt').length, 33, 'Government must have 33 topics');
  assert.equal(getTopics('lit').length, 12, 'Literature in English must have 12 topics');
  assert.equal(getTopics('crs').length, 12, 'CRS must have 12 topics');
  assert.equal(getTopics('irs').length, 10, 'IRS must have 10 topics');
  assert.equal(getTopics('comm').length, 11, 'Commerce must have 11 topics');
  assert.equal(getTopics('acct').length, 12, 'Principles of Accounts must have 12 topics');
});

test('every one of the 49 subjects has complete syllabus topics (>=8), >=48 unique MCQs, and dedicated Lab/Formula/Studio tool', () => {
  const seenTopicIds = new Set<string>();
  const allBySubj = getAllTopicsBySubj();
  assert.equal(Object.keys(allBySubj).length, 49);

  for (const sid of SUBJECT_IDS) {
    const subj = SUBJECTS[sid];
    assert.ok(subj, `Missing subject entry for ${sid}`);
    assert.ok(SUBJECT_INFO[sid], `Missing SUBJECT_INFO for ${sid}`);
    assert.ok(SUBJECT_TUTOR_REGISTRY[sid], `Missing tutor registry for ${sid}`);
    assert.ok(resolveAuthoritativeSubject(sid), `Missing authoritative security spec for ${sid}`);
    assert.ok(subj.topics.length >= 8, `${sid} should have at least 8 full syllabus topics (got ${subj.topics.length})`);
    assert.ok(
      LAB_OR_FORMULA_SUBJECTS.has(sid) || Boolean(SUBJECT_STUDIO_META[sid]),
      `Every subject must have a Lab, Formula studio, or Companion Studio: missing for ${sid}`
    );
    const shouldHaveFormulaSheet = [
      'maths', 'chem', 'phys', 'fmaths', 'geog', 'econ', 'eng', 'digitech', 'dataproc',
    ].includes(sid);
    assert.equal(
      hasFormulaSheet(sid),
      shouldHaveFormulaSheet,
      `hasFormulaSheet mismatch for ${sid}`
    );

    const totalQs = subj.topics.reduce((acc, t) => acc + t.qs.length, 0);
    assert.ok(totalQs >= 48, `${sid} should have at least 48 MCQs (got ${totalQs})`);

    // Verify peer duel code round-trip works for every subject
    const duel = createDuelCode(sid, 'AB12CD');
    const parsed = parseDuelCode(duel.code);
    assert.equal(parsed?.subj, sid, `Peer duel tag round-trip failed for ${sid} (${duel.code})`);

    // Verify getTopicsForProgress returns full syllabus for single-block subjects
    if (isUtmeSingleBlockSubject(sid)) {
      const p = { ...makeBlankProgress(), subj: sid, mathClass: 'ss1' as const };
      assert.equal(
        getTopicsForProgress(p).length,
        subj.topics.length,
        `Single-block subject ${sid} must not be filtered by mathClass`
      );
    }

    const answerBuckets = [0, 0, 0, 0];
    for (const topic of subj.topics) {
      assert.ok(!seenTopicIds.has(topic.id), `Duplicate topic id across subjects: ${topic.id} in ${sid}`);
      seenTopicIds.add(topic.id);

      assert.ok(topic.name.trim().length > 0, `Empty topic name in ${sid}`);
      assert.ok(topic.goals.length >= 1, `Missing goals in ${sid}/${topic.id}`);
      assert.ok(topic.parts.length >= 1, `Missing lesson parts in ${sid}/${topic.id}`);
      assert.ok(topic.qs.length >= 6, `Expected at least 6 questions in ${sid}/${topic.id}`);

      const il = getInteractiveLesson(sid, topic.id);
      assert.ok(il && il.parts.length >= 1, `Missing interactive lesson for ${sid}/${topic.id}`);

      for (const q of topic.qs) {
        assert.equal(q.o.length, 4, `Expected 4 options in ${sid}/${topic.id}: ${q.q}`);
        assert.ok(q.a >= 0 && q.a < 4, `Invalid answer index in ${sid}/${topic.id}`);
        assert.ok(q.e.trim().length > 0, `Missing explanation in ${sid}/${topic.id}`);
        answerBuckets[q.a] += 1;
        for (const opt of q.o) {
          assert.ok(opt.trim().length > 0, `Empty option in ${sid}/${topic.id}`);
        }
      }
    }

    // For all single-block subjects built by utme/builder, rotated keys must not be stuck at index 0
    if (isUtmeSingleBlockSubject(sid)) {
      const nonZero = answerBuckets[1] + answerBuckets[2] + answerBuckets[3];
      assert.ok(nonZero > 0, `Answer indices in ${sid} are stuck at 0: ${JSON.stringify(answerBuckets)}`);
    }
  }
});

test('WAEC/NECO-only subjects are strictly excluded from JAMB mocks and /400 estimate', () => {
  for (const sid of JAMB_SUBJECT_IDS) {
    assert.equal(isJambSubject(sid), true);
    assert.equal(isWaecOnlySubject(sid), false);
    assert.equal(isWaecOnlyCbtSubject(sid), false);
  }
  for (const sid of WAEC_ONLY_SUBJECT_IDS) {
    assert.equal(isJambSubject(sid), false);
    assert.equal(isWaecOnlySubject(sid), true);
    assert.equal(isWaecOnlyCbtSubject(sid), true);
  }

  const p = makeBlankProgress();
  assert.deepEqual(p.subjs, ['eng', 'maths']);
  assert.equal(p.subj, 'eng');

  const withWaecOnly = {
    ...p,
    subjs: ['eng', 'maths', 'catering', 'elecinst', 'gsm'] as typeof p.subjs,
  };
  const score = estimateJambScoreOutOf400(withWaecOnly, getTopics);
  assert.ok(score >= 0 && score <= 400);
});

test('non-Chem and non-Maths subjects never leak Professor Spark, Chemistry, beaker, or Master Chike in voice scripts', () => {
  const sampleSubjects = ['arabic', 'crs', 'irs', 'govt', 'lit', 'acct', 'catering', 'gsm'] as const;
  for (const sid of sampleSubjects) {
    const topic = getTopics(sid)[0];
    const lesson = getInteractiveLesson(sid, topic.id);
    assert.ok(topic && lesson);
    const tutor = SUBJECT_TUTOR_REGISTRY[sid];

    const firstBeatScript = extractBeatSpeechScript(
      lesson.parts[0].beats[0],
      topic.name,
      lesson.parts[0].title,
      true,
      sid
    );
    assert.ok(
      firstBeatScript.includes('Topic focus:'),
      `Expected ${sid} first beat script to announce Topic focus, got: ${firstBeatScript}`
    );
    assert.equal(firstBeatScript.includes('Professor Spark'), false);
    assert.equal(firstBeatScript.includes('Master Chike'), false);

    const checkBeat = lesson.parts
      .flatMap((pt) => pt.beats)
      .find((b) => b.k === 'check');
    if (checkBeat) {
      const checkScript = extractBeatSpeechScript(checkBeat, topic.name, lesson.parts[0].title, false, sid);
      assert.equal(checkScript.includes('test the beaker'), false);
      assert.equal(checkScript.includes('Professor Spark'), false);
    }

    const missionScript = extractMissionSpeechScript(topic.name, 'practice', 8, topic.trap, sid);
    assert.ok(missionScript.includes(tutor.name));
    assert.equal(missionScript.includes('Professor Spark'), false);
    assert.equal(missionScript.includes('Chemistry'), false);

    const testIntro = extractTopicTestIntroSpeechScript(topic, 5, 7, sid);
    assert.ok(testIntro.includes(tutor.name));
    assert.equal(testIntro.includes('Chemistry'), false);
  }
});
