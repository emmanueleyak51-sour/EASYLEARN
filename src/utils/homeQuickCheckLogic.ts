import type { Topic } from '../types';

export interface HomeQuickWarmupCard {
  topicId: string;
  topicName: string;
  sectionName: string;
  questionIndex: number;
  totalInTopic: number;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  distractorWhy?: string[];
}

export interface HomeQuickWarmupVerdict {
  isCorrect: boolean;
  verdictLabel: string;
  explanation: string;
}

/**
 * Deterministically picks a concise, valid 4-option syllabus question for the
 * interactive Home quick-check workbench without network latency or randomness.
 */
export function pickHomeQuickWarmup(
  topics: readonly Topic[],
  preferredTopicId?: string | null,
  offset = 0
): HomeQuickWarmupCard | null {
  if (!topics || topics.length === 0) return null;

  const eligibleTopics = topics.filter(
    (t) =>
      Array.isArray(t.qs) &&
      t.qs.some(
        (q) =>
          typeof q.q === 'string' &&
          q.q.trim().length > 0 &&
          Array.isArray(q.o) &&
          q.o.length >= 2 &&
          typeof q.a === 'number' &&
          q.a >= 0 &&
          q.a < q.o.length
      )
  );

  if (eligibleTopics.length === 0) return null;

  const preferredIdx = preferredTopicId
    ? eligibleTopics.findIndex((t) => t.id === preferredTopicId)
    : -1;
  const baseTopicIdx = preferredIdx >= 0 ? preferredIdx : 0;

  // Flatten valid questions starting from the preferred topic so "Next question" cycles cleanly
  const orderedTopics = [
    ...eligibleTopics.slice(baseTopicIdx),
    ...eligibleTopics.slice(0, baseTopicIdx),
  ];

  const pool: HomeQuickWarmupCard[] = [];
  for (const topic of orderedTopics) {
    const validQs = topic.qs.filter(
      (q) =>
        typeof q.q === 'string' &&
        q.q.trim().length > 0 &&
        Array.isArray(q.o) &&
        q.o.length >= 2 &&
        typeof q.a === 'number' &&
        q.a >= 0 &&
        q.a < q.o.length &&
        !q.g
    );
    const sourceList =
      validQs.length > 0
        ? validQs
        : topic.qs.filter(
            (q) =>
              typeof q.q === 'string' &&
              Array.isArray(q.o) &&
              q.o.length >= 2 &&
              typeof q.a === 'number' &&
              q.a >= 0 &&
              q.a < q.o.length
          );

    sourceList.slice(0, 4).forEach((q, idx) => {
      pool.push({
        topicId: topic.id,
        topicName: topic.name,
        sectionName: topic.sec,
        questionIndex: idx,
        totalInTopic: sourceList.length,
        prompt: q.q,
        options: q.o.slice(0, 4),
        correctIndex: q.a,
        explanation: q.e || 'Review the core principle in the topic notes.',
        distractorWhy: q.w,
      });
    });
  }

  if (pool.length === 0) return null;
  const safeIdx = ((Math.trunc(offset) % pool.length) + pool.length) % pool.length;
  return pool[safeIdx];
}

export function evaluateHomeQuickWarmup(
  card: HomeQuickWarmupCard,
  pickedIndex: number
): HomeQuickWarmupVerdict {
  const isCorrect = pickedIndex === card.correctIndex;
  const specificTrap =
    !isCorrect &&
    Array.isArray(card.distractorWhy) &&
    typeof card.distractorWhy[pickedIndex] === 'string' &&
    card.distractorWhy[pickedIndex].trim().length > 0
      ? card.distractorWhy[pickedIndex].trim()
      : null;

  return {
    isCorrect,
    verdictLabel: isCorrect ? 'Correct — exam reflex sharp' : 'Trap spotted — check the rule',
    explanation: specificTrap ? `${specificTrap} ${card.explanation}` : card.explanation,
  };
}
