import test from 'node:test';
import assert from 'node:assert/strict';
import { JAMB_WAEC_NOVELS } from '../data/jambWaecNovels';
import { getTopics } from '../data/curriculum';
import { getChapterEnhancement } from '../data/novelChapterEnhancements';
import {
  buildNovelFinalExamQuestions,
  computeNovelStudyStats,
  computeOverallNovelsProgress,
  evaluateNovelFinalExam,
  evaluateNovelQuizAnswer,
  filterPrescribedNovels,
  getChapterTtsBatch,
  getDefaultNovelIdForSubject,
  getNovelById,
  getNovelCountsByCategory,
  getNovelMaxRankPoints,
  getRecommendedNovelsForStudent,
  parseUploadedPersonalBook,
  recordNovelChapterQuiz,
  recordNovelFinalExamAndRankPoints,
  recordNovelQuizScore,
  toggleNovelChapterRead,
  updateNovelPersonalNotes,
} from './novelsLogic';

test('JAMB_WAEC_NOVELS contains all 8 complete official prescribed novels with valid structure and >=5 chapters each', () => {
  assert.equal(JAMB_WAEC_NOVELS.length, 8);
  const ids = new Set(JAMB_WAEC_NOVELS.map((n) => n.id));
  assert.equal(ids.size, 8);

  const expectedIds = [
    'lekki-headmaster',
    'life-changer',
    'so-the-path',
    'redemption-road',
    'second-class-citizen',
    'unexpected-joy',
    'mockingbird',
    'path-of-lucas',
  ];
  for (const id of expectedIds) {
    assert.equal(ids.has(id), true, `Missing prescribed novel ${id}`);
  }

  for (const novel of JAMB_WAEC_NOVELS) {
    assert.ok(novel.chapters.length >= 5, `${novel.id} should have at least 5 chapters for 5-chapter TTS batches`);
    assert.ok(novel.characters.length >= 3, `${novel.id} should have major characters`);
    assert.ok(novel.themes.length >= 3, `${novel.id} should have themes`);
    assert.ok(novel.literaryDevices.length >= 2, `${novel.id} should have literary devices`);
    assert.ok(novel.questions.length >= 2, `${novel.id} should have exam questions`);
    assert.ok(novel.essayPrompts.length >= 1, `${novel.id} should have essay prompts`);

    for (const ch of novel.chapters) {
      const enh = getChapterEnhancement(novel.id, ch);
      assert.ok(enh.sceneArtworkKey, `Missing sceneArtworkKey for ${novel.id} ch ${ch.number}`);
      assert.ok(enh.sceneCaption.length > 10, `Missing sceneCaption for ${novel.id} ch ${ch.number}`);
      assert.ok(enh.memoryAnchor.length > 10, `Missing memoryAnchor for ${novel.id} ch ${ch.number}`);
      assert.ok(enh.chapterQuiz.length >= 2, `Expected >=2 chapter quiz Qs for ${novel.id} ch ${ch.number}`);
      for (const cq of enh.chapterQuiz) {
        assert.equal(cq.o.length, 4);
        assert.ok(cq.a >= 0 && cq.a <= 3);
      }
    }

    for (const q of novel.questions) {
      assert.equal(q.o.length, 4);
      assert.ok(q.a >= 0 && q.a <= 3);
      assert.ok(q.explanation.length > 10);
      assert.ok(q.trapNote.length > 10);
    }
  }
});

test('category counts and live search filter work accurately across JAMB & WAEC novels', () => {
  const counts = getNovelCountsByCategory();
  assert.deepEqual(counts, {
    all: 8,
    'jamb-english': 2,
    'african-prose': 4,
    'non-african-prose': 2,
  });

  const jambOnly = filterPrescribedNovels('jamb-english', '');
  assert.equal(jambOnly.length, 2);

  const buchiHit = filterPrescribedNovels('all', 'Adah Ofili');
  assert.equal(buchiHit.length, 1);
  assert.equal(buchiHit[0].id, 'second-class-citizen');

  const lekkiHit = filterPrescribedNovels('all', 'Stardom Schools');
  assert.equal(lekkiHit.length, 1);
  assert.equal(lekkiHit[0].id, 'lekki-headmaster');
});

test('chapter reading toggles, quiz scores, notes, and legacy notebook migration persist cleanly', () => {
  let map = toggleNovelChapterRead(undefined, 'lekki-headmaster', 1);
  map = toggleNovelChapterRead(map, 'lekki-headmaster', 3);
  assert.deepEqual(map['lekki-headmaster'].chaptersRead, [1, 3]);

  // Toggling chapter 1 again unmarks it
  map = toggleNovelChapterRead(map, 'lekki-headmaster', 1);
  assert.deepEqual(map['lekki-headmaster'].chaptersRead, [3]);

  // Record quiz score keeps highest best score
  map = recordNovelQuizScore(map, 'lekki-headmaster', 4, 6);
  map = recordNovelQuizScore(map, 'lekki-headmaster', 2, 6);
  assert.equal(map['lekki-headmaster'].quizBestScore, 4);
  assert.equal(map['lekki-headmaster'].quizTotal, 6);

  // Notes update preserves chapters & quiz score
  map = updateNovelPersonalNotes(map, 'lekki-headmaster', 'Bepo reverses Japa decision at Ikeja.');
  assert.equal(map['lekki-headmaster'].notes, 'Bepo reverses Japa decision at Ikeja.');
  assert.deepEqual(map['lekki-headmaster'].chaptersRead, [3]);

  const lekki = getNovelById('lekki-headmaster');
  const stats = computeNovelStudyStats(lekki, { novelProgress: map });
  assert.equal(stats.chaptersReadCount, 1);
  assert.equal(stats.totalChapters, 12);
  assert.equal(stats.hasNotes, true);
  assert.ok(stats.overallMasteryPct > 0);

  const overall = computeOverallNovelsProgress({ novelProgress: map });
  assert.equal(overall.chaptersReadTotal, 1);
  assert.equal(overall.novelsStartedCount, 1);
});

test('getChapterTtsBatch slices up to 5 chapters cleanly with non-empty narration scripts', () => {
  const lekki = getNovelById('lekki-headmaster');
  const batch1 = getChapterTtsBatch(lekki, 0, 5);
  assert.equal(batch1.length, 5);
  assert.deepEqual(
    batch1.map((b) => b.chapterNumber),
    [1, 2, 3, 4, 5]
  );
  assert.ok(batch1[0].narrationScript.includes('Lekki Headmaster'));

  // Near end of book: slices remaining chapters cleanly without overflow
  const batchTail = getChapterTtsBatch(lekki, 9, 5);
  assert.equal(batchTail.length, 3);
  assert.deepEqual(
    batchTail.map((b) => b.chapterNumber),
    [10, 11, 12]
  );
});

test('chapter comprehension quiz marks chapter read on pass and preserves highest score', () => {
  const first = recordNovelChapterQuiz(undefined, 'life-changer', 2, 2, 2);
  assert.equal(first.passed, true);
  assert.deepEqual(first.novelProgress['life-changer'].chapterQuizPassed, [2]);
  assert.deepEqual(first.novelProgress['life-changer'].chaptersRead, [2]);
  assert.deepEqual(first.novelProgress['life-changer'].chapterQuizScores?.[2], { best: 2, total: 2 });

  // Lower retake does not erase best score or pass
  const lowerRetake = recordNovelChapterQuiz(first.novelProgress, 'life-changer', 2, 0, 2);
  assert.equal(lowerRetake.passed, false);
  assert.deepEqual(lowerRetake.novelProgress['life-changer'].chapterQuizPassed, [2]);
  assert.deepEqual(lowerRetake.novelProgress['life-changer'].chapterQuizScores?.[2], { best: 2, total: 2 });
});

test('End-of-Book Final Exam gathers all chapter + synthesis questions and awards idempotent Rank Points', () => {
  const lekki = getNovelById('lekki-headmaster');
  const gathered = buildNovelFinalExamQuestions(lekki);
  const expectedMin = lekki.chapters.length * 2 + lekki.questions.length;
  assert.equal(gathered.length, expectedMin);
  assert.equal(new Set(gathered.map((q) => q.id)).size, gathered.length);

  // Failing attempt (<70%) awards 0 RP and 0 XP
  const failingAnswers: Record<string, number> = {};
  for (const q of gathered) {
    failingAnswers[q.id] = (q.a + 1) % 4;
  }
  const failEval = evaluateNovelFinalExam(lekki, failingAnswers);
  assert.equal(failEval.passed, false);
  assert.equal(failEval.rankPointsEarned, 0);
  assert.equal(failEval.xpEarned, 0);
  assert.ok(failEval.missedChapterNumbers.length > 0);

  // Passing attempt (~75%) awards partial RP
  const pass75Answers: Record<string, number> = {};
  const targetCorrect = Math.ceil(gathered.length * 0.75);
  gathered.forEach((q, idx) => {
    pass75Answers[q.id] = idx < targetCorrect ? q.a : (q.a + 1) % 4;
  });
  const pass75Eval = evaluateNovelFinalExam(lekki, pass75Answers);
  assert.equal(pass75Eval.passed, true);
  assert.ok(pass75Eval.rankPointsEarned >= 12);

  const firstAward = recordNovelFinalExamAndRankPoints(undefined, lekki, pass75Eval);
  assert.equal(firstAward.newlyAwardedRp, pass75Eval.rankPointsEarned);
  assert.equal(firstAward.newlyAwardedXp, pass75Eval.rankPointsEarned * 10);

  // Repeating the same score awards 0 extra RP (idempotent)
  const repeatAward = recordNovelFinalExamAndRankPoints(firstAward.novelProgress, lekki, pass75Eval);
  assert.equal(repeatAward.newlyAwardedRp, 0);
  assert.equal(repeatAward.newlyAwardedXp, 0);

  // Improving to 100% awards only the delta up to max RP
  const perfectAnswers: Record<string, number> = {};
  for (const q of gathered) {
    perfectAnswers[q.id] = q.a;
  }
  const perfectEval = evaluateNovelFinalExam(lekki, perfectAnswers);
  assert.equal(perfectEval.accuracyPct, 100);
  assert.equal(perfectEval.rankPointsEarned, getNovelMaxRankPoints(lekki));

  const upgradeAward = recordNovelFinalExamAndRankPoints(
    firstAward.novelProgress,
    lekki,
    perfectEval
  );
  assert.equal(
    upgradeAward.newlyAwardedRp,
    getNovelMaxRankPoints(lekki) - pass75Eval.rankPointsEarned
  );
  assert.equal(
    upgradeAward.novelProgress['lekki-headmaster'].rankPointsAwarded,
    getNovelMaxRankPoints(lekki)
  );
});

test('parseUploadedPersonalBook splits chapter headings and paragraph fallbacks cleanly', () => {
  const sampleBook = [
    'Chapter 1: Dawn at the Harbor',
    'The morning mist settled over the lagoon as fishermen prepared their canoes.',
    '',
    'Chapter 2: The Letter from Abroad',
    'An envelope stamped in London sat beside the kerosene lamp on the veranda.',
    '',
    'Chapter 3: The Decision',
    'By dusk, the elders had gathered beneath the mango tree.',
  ].join('\n');

  const chapters = parseUploadedPersonalBook(sampleBook, 'Harbor Tales');
  assert.equal(chapters.length, 3);
  assert.equal(chapters[0].title, 'Chapter 1: Dawn at the Harbor');
  assert.equal(chapters[2].number, 3);
  assert.ok(chapters[1].wordCount >= 10);

  const plainText = 'Paragraph one without headings.\n\nParagraph two with more content.';
  const fallbackChunks = parseUploadedPersonalBook(plainText, 'Notes');
  assert.equal(fallbackChunks.length, 1);
  assert.equal(fallbackChunks[0].title, 'Notes — Section 1');
});

test('evaluateNovelQuizAnswer & student recommendations behave deterministically', () => {
  const mockingbird = getNovelById('mockingbird');
  const firstQ = mockingbird.questions[0];
  const rightRes = evaluateNovelQuizAnswer(mockingbird, 0, firstQ.a);
  assert.equal(rightRes.isCorrect, true);
  assert.equal(rightRes.correctOptionText, firstQ.o[firstQ.a]);

  const wrongIdx = (firstQ.a + 1) % 4;
  const wrongRes = evaluateNovelQuizAnswer(mockingbird, 0, wrongIdx);
  assert.equal(wrongRes.isCorrect, false);

  assert.equal(getDefaultNovelIdForSubject('eng'), 'lekki-headmaster');
  assert.equal(getDefaultNovelIdForSubject('lit'), 'so-the-path');

  const scienceJambRecs = getRecommendedNovelsForStudent('jamb', ['eng', 'maths', 'chem', 'phys']);
  assert.equal(scienceJambRecs.length, 2);

  const artsBothRecs = getRecommendedNovelsForStudent('both', ['eng', 'lit', 'govt', 'crs']);
  assert.equal(artsBothRecs.length, 8);
});

test('curriculum integration exposes JAMB & WAEC set novels in Use of English and Literature', () => {
  const engTopics = getTopics('eng');
  const engIds = new Set(engTopics.map((t) => t.id));
  assert.equal(engIds.has('e-jamb-lekki'), true);
  assert.equal(engIds.has('e-jamb-lifechanger'), true);

  const litTopics = getTopics('lit');
  const litIds = new Set(litTopics.map((t) => t.id));
  assert.equal(litIds.has('lit-african-prose-set'), true);
  assert.equal(litIds.has('lit-nonafrican-prose-set'), true);
});
