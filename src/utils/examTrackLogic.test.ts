import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildOnboardingTeacherLineup,
  calibrateToughJambScore400,
  getSaturdayCbtCampaign,
  getToughJambDrillConfig,
  getWaecMistakeGuidance,
  normalizeJambQuartet,
  normalizeSubjectsForExamTrack,
  pickWeightedBothTrackSlot,
  rankDailyCbtParticipants,
  resolveExamTrackFromToggles,
} from './examTrackLogic';

test('resolveExamTrackFromToggles handles single and dual exam selection', () => {
  assert.equal(resolveExamTrackFromToggles(true, false), 'jamb');
  assert.equal(resolveExamTrackFromToggles(false, true), 'waec');
  assert.equal(resolveExamTrackFromToggles(true, true), 'both');
  assert.equal(resolveExamTrackFromToggles(false, false), null);
});

test('JAMB track enforces strictly 4 official JAMB subjects with English compulsory and strips WAEC-only subjects', () => {
  const quartet = normalizeJambQuartet(['fmaths', 'civic', 'phys', 'chem', 'bio', 'econ']);
  assert.equal(quartet.length, 4);
  assert.equal(quartet[0], 'eng');
  assert.deepEqual(quartet, ['eng', 'phys', 'chem', 'bio']);

  const normalized = normalizeSubjectsForExamTrack('jamb', ['civic', 'catering', 'phys', 'chem', 'bio']);
  assert.deepEqual(normalized.subjs, ['eng', 'phys', 'chem', 'bio']);

  const lineup = buildOnboardingTeacherLineup('jamb', normalized.subjs, normalized.jambQuartet);
  assert.equal(lineup.length, 4);
  assert.equal(lineup[0].subj, 'eng');
  assert.equal(lineup[0].tutorName, 'Miss Adaeze');
});

test('Both track keeps 4 JAMB subjects first and schedules 70% JAMB / 30% WAEC across 10 slots', () => {
  const normalized = normalizeSubjectsForExamTrack(
    'both',
    ['eng', 'maths', 'chem', 'phys', 'civic', 'fmaths'],
    ['eng', 'maths', 'chem', 'phys']
  );
  assert.deepEqual(normalized.jambQuartet, ['eng', 'maths', 'chem', 'phys']);
  assert.equal(normalized.subjs.includes('civic'), true);
  assert.equal(normalized.subjs.includes('fmaths'), true);

  let jambCount = 0;
  let waecCount = 0;
  for (let i = 0; i < 10; i++) {
    const slot = pickWeightedBothTrackSlot(normalized.jambQuartet, normalized.subjs, i);
    if (slot.focusExam === 'jamb') {
      jambCount++;
      assert.equal(normalized.jambQuartet.includes(slot.subj), true);
    } else {
      waecCount++;
    }
  }
  assert.equal(jambCount, 7);
  assert.equal(waecCount, 3);
});

test('Tough JAMB conditions tighten Topic Test pass bar/timer and calibrate /400 conservatively', () => {
  const jambCfg = getToughJambDrillConfig('jamb', 'chem', ['eng', 'maths', 'chem', 'phys']);
  assert.equal(jambCfg.isToughJamb, true);
  assert.equal(jambCfg.bossHp, 6);
  assert.equal(jambCfg.bossTimeSec, 210);
  assert.equal(jambCfg.minStartLevel, 3);

  const waecCfg = getToughJambDrillConfig('waec', 'chem');
  assert.equal(waecCfg.isToughJamb, false);
  assert.equal(waecCfg.bossHp, 5);
  assert.equal(waecCfg.bossTimeSec, 300);

  const cal = calibrateToughJambScore400(300, { hist: [], cbtHistory: [] });
  assert.equal(cal.toughScore400 <= cal.rawScore400, true);
  assert.equal(cal.toughScore400 > 240 && cal.toughScore400 < 300, true);
});

test('Saturday WAT campaign detects Saturday live hall vs weekday countdown', () => {
  // 2026-11-21T12:00:00Z is Saturday 13:00 WAT
  const satMs = Date.parse('2026-11-21T12:00:00Z');
  const satCampaign = getSaturdayCbtCampaign(satMs, []);
  assert.equal(satCampaign.isSaturday, true);
  assert.equal(satCampaign.completedToday, false);
  assert.equal(satCampaign.bonusXpMultiplier, 2);

  // 2026-11-22T12:00:00Z is Sunday 13:00 WAT -> 6 days until Saturday
  const sunMs = Date.parse('2026-11-22T12:00:00Z');
  const sunCampaign = getSaturdayCbtCampaign(sunMs, []);
  assert.equal(sunCampaign.isSaturday, false);
  assert.equal(sunCampaign.daysUntilSaturday, 6);
});

test('rankDailyCbtParticipants ranks same-day students accurately and returns encouragement', () => {
  const report = rankDailyCbtParticipants(
    [
      {
        participantKey: 'u1',
        displayName: 'Chinedu',
        campusGoal: 'UNILAG',
        mode: 'jamb',
        scaledScore: 312,
        maxScale: 400,
        rawCorrect: 31,
        totalQuestions: 40,
        accuracyPct: 78,
        durationSec: 920,
      },
      {
        participantKey: 'me',
        displayName: 'Ada',
        campusGoal: 'UI',
        mode: 'jamb',
        scaledScore: 288,
        maxScale: 400,
        rawCorrect: 29,
        totalQuestions: 40,
        accuracyPct: 72,
        durationSec: 880,
      },
      {
        participantKey: 'u3',
        displayName: 'Musa',
        campusGoal: 'ABU',
        mode: 'jamb',
        scaledScore: 244,
        maxScale: 400,
        rawCorrect: 24,
        totalQuestions: 40,
        accuracyPct: 60,
        durationSec: 1100,
      },
    ],
    'me',
    'jamb',
    70
  );

  assert.equal(report.totalParticipants, 3);
  assert.equal(report.myRank, 2);
  assert.equal(report.aheadCount, 1);
  assert.equal(report.encouragementBody.length > 20, true);

  const waecGuide = getWaecMistakeGuidance('chem', 'Always state 2 decimal places on burette readings.');
  assert.equal(waecGuide.mistakesToAvoid.length >= 3, true);
});
