import test from 'node:test';
import assert from 'node:assert/strict';
import { getTopics } from '../data/curriculum';
import { evaluateHomeQuickWarmup, pickHomeQuickWarmup } from './homeQuickCheckLogic';

test('pickHomeQuickWarmup selects deterministic syllabus questions and cycles cleanly with offset', () => {
  const chemTopics = getTopics('chem');
  const first = pickHomeQuickWarmup(chemTopics, chemTopics[0]?.id, 0);
  assert.ok(first, 'should return a valid warm-up card for Chemistry');
  assert.equal(first.topicId, chemTopics[0]?.id);
  assert.ok(first.options.length >= 2 && first.options.length <= 4);
  assert.ok(first.correctIndex >= 0 && first.correctIndex < first.options.length);

  const second = pickHomeQuickWarmup(chemTopics, chemTopics[0]?.id, 1);
  assert.ok(second);
  assert.notDeepEqual(
    `${first.topicId}:${first.questionIndex}:${first.prompt}`,
    `${second.topicId}:${second.questionIndex}:${second.prompt}`,
    'offset=1 should advance to the next warm-up question'
  );
});

test('evaluateHomeQuickWarmup scores correct and distractor selections accurately', () => {
  const engTopics = getTopics('eng');
  const card = pickHomeQuickWarmup(engTopics, null, 0);
  assert.ok(card);

  const right = evaluateHomeQuickWarmup(card, card.correctIndex);
  assert.equal(right.isCorrect, true);
  assert.ok(right.explanation.length > 5);

  const wrongIdx = (card.correctIndex + 1) % card.options.length;
  const wrong = evaluateHomeQuickWarmup(card, wrongIdx);
  assert.equal(wrong.isCorrect, false);
  assert.ok(wrong.explanation.length > 5);
});
