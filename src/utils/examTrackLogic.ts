import type { ExamTrack, SubjectId, UserProgress } from '../types';
import { ALL_SUBJECT_IDS, JAMB_SUBJECT_IDS, isJambSubject, isWaecOnlySubject } from './examSubjects';
import { SUBJECT_TUTOR_REGISTRY } from './tutorRegistry';
import { buildPersonalityIntroScript } from './tutorIntroPersonalities';

export const DEFAULT_JAMB_ELECTIVES: readonly SubjectId[] = [
  'maths',
  'chem',
  'phys',
  'bio',
  'econ',
  'govt',
  'lit',
  'crs',
  'comm',
  'acct',
  'agric',
  'geog',
];

export interface OnboardingTeacherCard {
  subj: SubjectId;
  subjectName: string;
  shortName: string;
  tutorName: string;
  roleTitle: string;
  personalityTag: string;
  studioLabel: string;
  geminiVoice: string;
  isPrimaryJamb: boolean;
  oneTimeIntroScript: string;
}

export interface ToughJambDrillConfig {
  isToughJamb: boolean;
  bossHp: number;
  bossTimeSec: number;
  minStartLevel: number;
  targetSecPerQ: number;
  badgeLabel: string;
  conditionSummary: string;
}

export interface CalibratedJambScore {
  toughScore400: number;
  rawScore400: number;
  rigorFactorPct: number;
  calibrationNote: string;
}

export interface DailyCbtParticipantEntry {
  participantKey: string;
  displayName: string;
  campusGoal: string;
  mode: 'jamb' | 'waec';
  scaledScore: number;
  maxScale: number;
  rawCorrect: number;
  totalQuestions: number;
  accuracyPct: number;
  durationSec: number;
}

export interface RankedDailyCbtParticipant extends DailyCbtParticipantEntry {
  rank: number;
  isMe: boolean;
}

export interface DailyCbtCohortReport {
  myRank: number;
  totalParticipants: number;
  topPercentile: number;
  aheadCount: number;
  entries: RankedDailyCbtParticipant[];
  encouragementTitle: string;
  encouragementBody: string;
}

export interface SaturdayCbtCampaign {
  isSaturday: boolean;
  watDayOfWeek: number; // 0 = Sun ... 6 = Sat
  watDayNumber: number;
  daysUntilSaturday: number;
  hoursLeftTodayWat: number;
  completedToday: boolean;
  saturdayStreak: number;
  bonusXpMultiplier: number;
  headline: string;
  subheadline: string;
  ctaLabel: string;
}

export interface WaecMistakeGuidance {
  headline: string;
  examFormatLine: string;
  mistakesToAvoid: string[];
}

const VALID_SUBJECT_SET: ReadonlySet<string> = new Set(ALL_SUBJECT_IDS);

/**
 * Resolves a student's active ExamTrack ('jamb' | 'waec' | 'both') from progress.
 */
export function resolveExamTrack(
  progress: Pick<UserProgress, 'examTrack' | 'studyPlan' | 'subjs'>
): ExamTrack {
  if (
    progress.examTrack === 'jamb' ||
    progress.examTrack === 'waec' ||
    progress.examTrack === 'both'
  ) {
    return progress.examTrack;
  }
  if (
    progress.studyPlan?.examType === 'jamb' ||
    progress.studyPlan?.examType === 'waec' ||
    progress.studyPlan?.examType === 'both'
  ) {
    return progress.studyPlan.examType;
  }
  const hasWaecOnly = (progress.subjs || []).some((s) => isWaecOnlySubject(s));
  if (hasWaecOnly) return 'both';
  return 'jamb';
}

/**
 * Resolves ExamTrack from the two independent onboarding toggles (JAMB & WAEC).
 * Returns null if neither exam is selected.
 */
export function resolveExamTrackFromToggles(jambSelected: boolean, waecSelected: boolean): ExamTrack | null {
  if (jambSelected && waecSelected) return 'both';
  if (jambSelected) return 'jamb';
  if (waecSelected) return 'waec';
  return null;
}

/**
 * Normalizes any candidate subject list into a strict 4-subject JAMB UTME quartet:
 * English Language ('eng') is compulsory + 3 distinct JAMB UTME subjects.
 */
export function normalizeJambQuartet(candidates: readonly SubjectId[] | undefined): SubjectId[] {
  const picked: SubjectId[] = ['eng'];
  if (Array.isArray(candidates)) {
    for (const sid of candidates) {
      if (sid !== 'eng' && isJambSubject(sid) && !picked.includes(sid)) {
        picked.push(sid);
        if (picked.length === 4) break;
      }
    }
  }
  for (const fallback of DEFAULT_JAMB_ELECTIVES) {
    if (picked.length >= 4) break;
    if (!picked.includes(fallback) && isJambSubject(fallback)) {
      picked.push(fallback);
    }
  }
  return picked.slice(0, 4);
}

/**
 * Enforces subject visibility & enrollment rules per ExamTrack:
 * - 'jamb': Strictly the 4 JAMB UTME subjects (all WAEC-only subjects stripped).
 * - 'waec': Valid WAEC subjects (English + Maths + chosen school/trade subjects, min 4).
 * - 'both': 4 primary JAMB subjects first (70% core) + additional WAEC subjects (30% secondary focus).
 */
export function normalizeSubjectsForExamTrack(
  track: ExamTrack,
  enrolled: readonly SubjectId[] | undefined,
  jambSubjects?: readonly SubjectId[]
): {
  subjs: SubjectId[];
  jambQuartet: SubjectId[];
} {
  const cleanEnrolled = (enrolled || []).filter((s): s is SubjectId => VALID_SUBJECT_SET.has(s));
  const jambQuartet = normalizeJambQuartet(
    jambSubjects && jambSubjects.length > 0 ? jambSubjects : cleanEnrolled
  );

  if (track === 'jamb') {
    return {
      subjs: jambQuartet,
      jambQuartet,
    };
  }

  if (track === 'waec') {
    const unique: SubjectId[] = [];
    for (const sid of ['eng', 'maths', ...cleanEnrolled] as SubjectId[]) {
      if (VALID_SUBJECT_SET.has(sid) && !unique.includes(sid)) {
        unique.push(sid);
      }
    }
    for (const extra of ['bio', 'econ', 'civic', 'chem', 'phys'] as SubjectId[]) {
      if (unique.length >= 5) break;
      if (!unique.includes(extra)) unique.push(extra);
    }
    return {
      subjs: unique.slice(0, 12),
      jambQuartet,
    };
  }

  // 'both' -> 4 JAMB subjects lead first, followed by extra WAEC subjects (e.g. Civic, F.Maths, Biology, Trade)
  const combined: SubjectId[] = [...jambQuartet];
  for (const sid of cleanEnrolled) {
    if (!combined.includes(sid) && VALID_SUBJECT_SET.has(sid)) {
      combined.push(sid);
    }
  }
  if (combined.length < 6) {
    for (const extra of ['civic', 'bio', 'econ', 'fmaths'] as SubjectId[]) {
      if (combined.length >= 6) break;
      if (!combined.includes(extra)) combined.push(extra);
    }
  }
  return {
    subjs: combined.slice(0, 12),
    jambQuartet,
  };
}

/**
 * Returns visible enrolled subjects for navigation bars (`AppShell`, `HomeScreen`, `TopicsMapScreen`).
 * When `track === 'jamb'`, strictly restricts to JAMB subjects (never showing WAEC-only subjects).
 */
export function getVisibleEnrolledSubjects(progress: UserProgress): SubjectId[] {
  const track = resolveExamTrack(progress);
  if (track === 'jamb') {
    return normalizeJambQuartet(
      progress.jambSubjects && progress.jambSubjects.length > 0
        ? progress.jambSubjects
        : progress.subjs
    );
  }
  const valid = (progress.subjs || []).filter((sid) => VALID_SUBJECT_SET.has(sid));
  return valid.length > 0 ? valid : ['eng', 'maths', 'chem', 'phys'];
}

/**
 * Determines whether Tough JAMB UTME training conditions apply for the given subject.
 * Applies to all subjects in 'jamb' track, and to the student's JAMB subjects in 'both' track (70% JAMB focus).
 */
export function isToughJambModeForSubject(
  track: ExamTrack,
  subj: SubjectId,
  jambSubjects?: readonly SubjectId[]
): boolean {
  if (track === 'waec') return false;
  if (!isJambSubject(subj)) return false;
  if (track === 'jamb') return true;
  const quartet = normalizeJambQuartet(jambSubjects);
  return quartet.includes(subj);
}

/**
 * Returns stricter-than-UTME drill parameters for JAMB subjects so students train under tougher
 * time and accuracy pressure than the real JAMB hall.
 */
export function getToughJambDrillConfig(
  track: ExamTrack,
  subj: SubjectId,
  jambSubjects?: readonly SubjectId[]
): ToughJambDrillConfig {
  const tough = isToughJambModeForSubject(track, subj, jambSubjects);
  if (tough) {
    return {
      isToughJamb: true,
      bossHp: 6, // 6/7 (86%) required instead of 5/7 (71%)
      bossTimeSec: 210, // 3m 30s instead of 5m 00s (30s per question)
      minStartLevel: 3, // Starts directly on harder conceptual & look-alike distractor items
      targetSecPerQ: 33, // Faster than official JAMB 40s/question
      badgeLabel: 'Tough JAMB Condition · 6/7 in 3:30',
      conditionSummary:
        'Stricter timer (30s/question), 86% pass bar, and close look-alike options so your real JAMB score matches or beats your Easy Learn score.',
    };
  }
  return {
    isToughJamb: false,
    bossHp: 5,
    bossTimeSec: 300,
    minStartLevel: 2,
    targetSecPerQ: 45,
    badgeLabel: 'WAEC Exam Standard · 5/7 in 5:00',
    conditionSummary:
      'Focuses on WAEC Paper 1 & Theory Paper 2 marking-scheme accuracy, clear workings, and avoiding common candidate mistakes.',
  };
}

/**
 * Conservatively calibrates the student's estimated /400 JAMB score under tough training conditions.
 * Never inflates raw estimates — applies an exam-pressure factor (88%–97%) anchored to real timed CBT runs
 * so a student's actual UTME hall score equals or exceeds their EYAK score.
 */
export function calibrateToughJambScore400(
  rawEstimate400: number,
  progress: Pick<UserProgress, 'cbtHistory' | 'hist'>
): CalibratedJambScore {
  const clampedRaw = Math.max(0, Math.min(400, Math.round(rawEstimate400)));
  const jambCbts = (progress.cbtHistory || []).filter((c) => c.mode === 'jamb' && c.maxScale === 400);

  const totalAns = (progress.hist || []).length;
  const rightAns = (progress.hist || []).filter((h) => h[1] === 1).length;
  const overallAcc = totalAns > 0 ? rightAns / totalAns : 0.5;

  // Rigor factor starts conservative (0.88) and rises toward 0.96 only as timed CBTs + high accuracy prove stamina
  const cbtMaturityBonus = Math.min(0.05, jambCbts.length * 0.015);
  const accuracyBonus = overallAcc >= 0.8 ? 0.03 : overallAcc >= 0.68 ? 0.015 : 0;
  const rigorFactor = Math.min(0.96, 0.88 + cbtMaturityBonus + accuracyBonus);

  let blended = clampedRaw * rigorFactor;
  if (jambCbts.length > 0) {
    const recent = jambCbts.slice(-3);
    const avgCbt = recent.reduce((acc, item) => acc + item.scaledScore, 0) / recent.length;
    // Blend conservative topic mastery with actual timed CBT hall performance, capped at rawEstimate400
    blended = Math.min(clampedRaw, Math.round(blended * 0.55 + avgCbt * 0.96 * 0.45));
  }

  const toughScore400 = Math.max(0, Math.min(clampedRaw, Math.round(blended)));
  const rigorFactorPct = Math.round(rigorFactor * 100);

  return {
    toughScore400,
    rawScore400: clampedRaw,
    rigorFactorPct,
    calibrationNote:
      jambCbts.length > 0
        ? `Strict UTME grading (${rigorFactorPct}% pressure factor + ${jambCbts.length} timed CBT${jambCbts.length === 1 ? '' : 's'}) — real JAMB typically matches or beats this.`
        : 'Strict UTME grading — take a Saturday CBT mock to lock in your exam-hall stamina.',
  };
}

/**
 * Deterministic 70% JAMB / 30% WAEC study slot allocator for secondary school students taking Both exams.
 * Across every 10 study slots, 7 slots target the 4 JAMB subjects and 3 slots target WAEC subjects / theory prep.
 */
const BOTH_TRACK_PATTERN: readonly ('jamb' | 'waec')[] = [
  'jamb',
  'jamb',
  'waec',
  'jamb',
  'jamb',
  'waec',
  'jamb',
  'jamb',
  'jamb',
  'waec',
];

export function pickWeightedBothTrackSlot(
  jambQuartet: readonly SubjectId[],
  allEnrolled: readonly SubjectId[],
  slotIndex: number
): {
  focusExam: 'jamb' | 'waec';
  subj: SubjectId;
  weightLabel: string;
} {
  const safeQuartet = normalizeJambQuartet(jambQuartet);
  const waecPool = allEnrolled.filter((s) => !safeQuartet.includes(s));
  const effectiveWaecPool = waecPool.length > 0 ? waecPool : allEnrolled.length > 0 ? allEnrolled : safeQuartet;

  const safeIdx = Math.abs(Math.floor(slotIndex));
  const focusExam = BOTH_TRACK_PATTERN[safeIdx % BOTH_TRACK_PATTERN.length];

  if (focusExam === 'jamb') {
    const subj = safeQuartet[safeIdx % safeQuartet.length];
    return {
      focusExam: 'jamb',
      subj,
      weightLabel: '70% JAMB Core Focus',
    };
  }

  const subj = effectiveWaecPool[safeIdx % effectiveWaecPool.length];
  return {
    focusExam: 'waec',
    subj,
    weightLabel: '30% WAEC Theory & Mistakes Focus',
  };
}

/**
 * Builds the one-time AI Voice Assistant teacher lineup shown ONLY during ExamSetupScreen.
 * - 'jamb': Strictly the 4 Live Teachers for their 4 chosen JAMB subjects.
 * - 'both': The 4 primary JAMB Live Teachers first (70% core) + extra WAEC teachers tagged clearly.
 * - 'waec': Their selected WAEC subject Live Teachers (up to 6 in the quick voice switcher).
 */
export function buildOnboardingTeacherLineup(
  track: ExamTrack,
  enrolledSubjs: readonly SubjectId[],
  jambSubjects?: readonly SubjectId[]
): OnboardingTeacherCard[] {
  const { subjs, jambQuartet } = normalizeSubjectsForExamTrack(track, enrolledSubjs, jambSubjects);

  const targetSubjects: SubjectId[] =
    track === 'jamb'
      ? jambQuartet
      : track === 'both'
        ? subjs.slice(0, 8)
        : subjs.slice(0, 6);

  return targetSubjects.map((subj) => {
    const meta = SUBJECT_TUTOR_REGISTRY[subj] || SUBJECT_TUTOR_REGISTRY.eng;
    const isPrimaryJamb = jambQuartet.includes(subj);
    const { personalityTag, script } = buildPersonalityIntroScript(subj, track, isPrimaryJamb);

    return {
      subj,
      subjectName: meta.name,
      shortName: meta.short,
      tutorName: meta.tutorName,
      roleTitle: meta.roleTitle,
      personalityTag,
      studioLabel: meta.studioLabel,
      geminiVoice: meta.geminiVoice,
      isPrimaryJamb,
      oneTimeIntroScript: script,
    };
  });
}

/**
 * Subject-specific WAEC Chief Examiner pitfalls & marking-scheme guidance so WAEC students
 * know how the real WAEC paper is graded and which mistakes cost easy marks.
 */
export function getWaecMistakeGuidance(subj: SubjectId, topicTrap?: string): WaecMistakeGuidance {
  const cleanTrap = topicTrap ? topicTrap.replace(/<[^>]+>/g, '').trim() : '';

  const baseBySubj: Partial<Record<SubjectId, { format: string; mistakes: string[] }>> = {
    eng: {
      format: 'Paper 1 (Lexis & Structure) · Paper 2 (Essay, Comprehension & Summary) · Paper 3 (Oral English)',
      mistakes: [
        'Lifting whole sentences verbatim from the passage in Summary instead of writing concise, original clauses.',
        'Breaking tense consistency or subject-verb concord when a long phrase separates subject and verb.',
        'Exceeding the 450-word essay target with unfocused paragraphs that miss formal letter salutations.',
      ],
    },
    maths: {
      format: 'Paper 1 (50 Objectives) · Paper 2 (Compulsory Part I + 5 Extended Theory Questions)',
      mistakes: [
        'Skipping intermediate algebraic steps — WAEC awards Method Marks (M1) even before the final Accuracy Mark (A1).',
        'Rounding off prematurely mid-calculation instead of keeping 4 significant figures until the final line.',
        'Omitting units (cm, cm², °) or forgetting to draw neat, ruler-labeled diagrams on bearings and mensuration.',
      ],
    },
    chem: {
      format: 'Paper 1 (Objectives) · Paper 2 (Theory) · Paper 3 (Volumetric & Qualitative Practical)',
      mistakes: [
        'Writing unbalanced chemical equations or omitting state symbols (s, l, g, aq) when required.',
        'Recording burette titre values to 1 decimal place instead of 2 decimal places (e.g. 24.50 cm³, not 24.5).',
        'Confusing observation ("reddish-brown gas evolved") with inference ("NO₂ from trioxonitrate(V)").',
      ],
    },
    phys: {
      format: 'Paper 1 (Objectives) · Paper 2 (Theory Derivations & Problems) · Paper 3 (Practical)',
      mistakes: [
        'Forgetting to convert cm, g, or minutes into standard SI units (m, kg, s) before substituting into formulas.',
        'Stating laws in incomplete everyday words without the condition (e.g. omitting "at constant temperature" in Ohm’s or Boyle’s law).',
        'Plotting tiny graph scales that cover less than half of the WAEC graph sheet when finding a slope.',
      ],
    },
    bio: {
      format: 'Paper 1 (Objectives) · Paper 2 (Essay & Diagrams) · Paper 3 (Practical Specimens)',
      mistakes: [
        'Misspelling technical biological terms or writing scientific names without underlining Genus and species separately.',
        'Drawing woolly, shaded, or crossed guidelines on biological diagrams instead of crisp single-line labels with magnification.',
        'Giving one-word answers in Paper 2 where WAEC requires structure linked directly to function.',
      ],
    },
    econ: {
      format: 'Paper 1 (Objectives) · Paper 2 (Section A Data-Response Calculation + Section B Theory Essays)',
      mistakes: [
        'Drawing supply/demand curves without labeling Price (P), Quantity (Q), initial equilibrium, and directional arrows.',
        'Listing bare bullet points without explaining each economic point in full sentences for 3-mark subsections.',
        'Leaving out formulas and Naira/percentage units in Section A national income or elasticity calculations.',
      ],
    },
  };

  const specific = baseBySubj[subj] || {
    format: 'WAEC Paper 1 (Multiple Choice) + Paper 2 (Structured Theory & Marking-Scheme Essays)',
    mistakes: [
      'Listing bare keywords without explaining each point in a complete sentence as required by the WAEC marking scheme.',
      'Misreading command words ("State" vs "Explain" vs "Distinguish between" — comparisons must pair both sides).',
      'Skipping definitions, examples, or units that carry dedicated bonus marks in Paper 2.',
    ],
  };

  const mistakes = cleanTrap ? [cleanTrap, ...specific.mistakes.slice(0, 2)] : specific.mistakes;

  return {
    headline: 'WAEC Exam Format & Common Candidate Mistakes to Avoid',
    examFormatLine: specific.format,
    mistakesToAvoid: mistakes,
  };
}

/**
 * Computes West Africa Time (WAT, UTC+1) day index and day-of-week so Saturday CBT triggers
 * accurately for every Nigerian student regardless of device timezone quirks.
 */
export function getWatCalendarMeta(nowMs = Date.now()): {
  watDayNumber: number;
  watDayOfWeek: number;
  hoursLeftTodayWat: number;
} {
  const watMs = nowMs + 3600 * 1000; // UTC+1
  const watDayNumber = Math.floor(watMs / 86_400_000);
  const watDate = new Date(watMs);
  const watDayOfWeek = watDate.getUTCDay(); // 0 = Sun ... 6 = Sat
  const hoursElapsed =
    watDate.getUTCHours() + watDate.getUTCMinutes() / 60 + watDate.getUTCSeconds() / 3600;
  const hoursLeftTodayWat = Math.max(1, Math.ceil(24 - hoursElapsed));
  return { watDayNumber, watDayOfWeek, hoursLeftTodayWat };
}

/**
 * Builds the Saturday National CBT Arena habit campaign.
 * Every Saturday (WAT), opening the app spotlights the live cohort mock with 2x XP/Rank bonus
 * and countdown urgency; on Sun–Fri, it builds anticipation for Saturday.
 */
export function getSaturdayCbtCampaign(
  nowMs = Date.now(),
  cbtHistory?: UserProgress['cbtHistory']
): SaturdayCbtCampaign {
  const { watDayNumber, watDayOfWeek, hoursLeftTodayWat } = getWatCalendarMeta(nowMs);
  const isSaturday = watDayOfWeek === 6;
  const daysUntilSaturday = isSaturday ? 0 : (6 - watDayOfWeek + 7) % 7;

  const localDayNumber = Math.floor(nowMs / 86_400_000);
  const history = cbtHistory || [];
  const completedToday = history.some(
    (entry) => entry.dateDay === watDayNumber || entry.dateDay === localDayNumber
  );

  // Count distinct Saturdays completed in CBT history
  const saturdayDays = new Set<number>();
  for (const entry of history) {
    // Epoch day 0 (1970-01-01) was Thursday (4); (day + 4) % 7 === 6 => Saturday
    if ((entry.dateDay + 4) % 7 === 6) {
      saturdayDays.add(entry.dateDay);
    }
  }
  const saturdayStreak = saturdayDays.size;

  if (isSaturday && !completedToday) {
    return {
      isSaturday: true,
      watDayOfWeek,
      watDayNumber,
      daysUntilSaturday: 0,
      hoursLeftTodayWat,
      completedToday: false,
      saturdayStreak,
      bonusXpMultiplier: 2,
      headline: `Saturday National CBT Arena is LIVE · Closes in ${hoursLeftTodayWat}h`,
      subheadline:
        'Students across Easy Learn are writing their Saturday CBT right now. Take yours before midnight to get ranked on today’s live board and earn 2× Rank Points!',
      ctaLabel: 'Enter Saturday CBT Now',
    };
  }

  if (isSaturday && completedToday) {
    return {
      isSaturday: true,
      watDayOfWeek,
      watDayNumber,
      daysUntilSaturday: 0,
      hoursLeftTodayWat,
      completedToday: true,
      saturdayStreak: Math.max(1, saturdayStreak),
      bonusXpMultiplier: 2,
      headline: 'Saturday CBT Completed · Live Ranking Active',
      subheadline:
        'Great job showing up this Saturday! Beat your score before midnight to climb higher on today’s student ranking.',
      ctaLabel: 'Beat Today’s Score',
    };
  }

  return {
    isSaturday: false,
    watDayOfWeek,
    watDayNumber,
    daysUntilSaturday,
    hoursLeftTodayWat,
    completedToday,
    saturdayStreak,
    bonusXpMultiplier: 1,
    headline:
      daysUntilSaturday === 1
        ? 'Saturday National CBT Arena opens tomorrow · 2× Rank Bonus'
        : `Saturday National CBT Arena in ${daysUntilSaturday} days · 2× Rank Bonus`,
    subheadline:
      'Every Saturday, serious candidates write a full CBT together and get ranked live. Do a quick warm-up mock today so Saturday feels effortless.',
    ctaLabel: 'Warm-up CBT Today',
  };
}

/**
 * Ranks every student who completed CBT on the same day and generates warm, honest encouragement
 * tailored to their score, standing, and exam mode.
 */
export function rankDailyCbtParticipants(
  entries: readonly DailyCbtParticipantEntry[],
  myParticipantKey: string,
  mode: 'jamb' | 'waec',
  targetPct = 70
): DailyCbtCohortReport {
  const deduped = new Map<string, DailyCbtParticipantEntry>();
  for (const item of entries) {
    if (item.mode !== mode) continue;
    const prev = deduped.get(item.participantKey);
    if (
      !prev ||
      item.scaledScore > prev.scaledScore ||
      (item.scaledScore === prev.scaledScore && item.accuracyPct > prev.accuracyPct) ||
      (item.scaledScore === prev.scaledScore &&
        item.accuracyPct === prev.accuracyPct &&
        item.durationSec < prev.durationSec)
    ) {
      deduped.set(item.participantKey, item);
    }
  }

  const sorted = Array.from(deduped.values()).sort((a, b) => {
    if (b.scaledScore !== a.scaledScore) return b.scaledScore - a.scaledScore;
    if (b.accuracyPct !== a.accuracyPct) return b.accuracyPct - a.accuracyPct;
    return a.durationSec - b.durationSec;
  });

  const ranked: RankedDailyCbtParticipant[] = sorted.map((entry, index) => ({
    ...entry,
    rank: index + 1,
    isMe: entry.participantKey === myParticipantKey,
  }));

  const totalParticipants = ranked.length;
  const me = ranked.find((r) => r.isMe) || ranked[0];
  const myRank = me ? me.rank : 1;
  const aheadCount = Math.max(0, totalParticipants - myRank);
  const topPercentile =
    totalParticipants <= 1
      ? 1
      : Math.max(1, Math.min(99, Math.round((myRank / totalParticipants) * 100)));

  const myAcc = me ? me.accuracyPct : 0;
  const myScore = me ? me.scaledScore : 0;

  let encouragementTitle: string;
  let encouragementBody: string;

  if (totalParticipants === 1) {
    encouragementTitle = 'First Pacesetter on Today’s CBT Board!';
    encouragementBody =
      mode === 'jamb'
        ? `You set today’s opening Tough JAMB mark (${myScore}/400). Because Easy Learn grades stricter than real UTME, every student who writes CBT today now has to chase your standard — review your missed traps now to push even higher!`
        : `You set today’s opening WAEC mark (${myScore}%). Review any missed questions in your Mistake Vault so your Paper 1 and Paper 2 stay airtight!`;
  } else if (myRank === 1) {
    encouragementTitle = `#1 Out of ${totalParticipants} Students Today!`;
    encouragementBody =
      mode === 'jamb'
        ? `Outstanding discipline — you are leading all ${totalParticipants} students who wrote JAMB CBT today with ${myScore}/400 under tough conditions. Keep your head cool and fix the few tricky distractors you missed!`
        : `Brilliant work — you are #1 out of ${totalParticipants} WAEC students today (${myScore}%). Keep sharpening your structured theory points to lock in an A1!`;
  } else if (topPercentile <= 25 || myAcc >= targetPct) {
    encouragementTitle = `Strong Standing · #${myRank} of ${totalParticipants} Today (Top ${topPercentile}%)`;
    encouragementBody =
      mode === 'jamb'
        ? `You outscored ${aheadCount} student${aheadCount === 1 ? '' : 's'} under tough JAMB conditions today (${myScore}/400). Fix just 3–4 look-alike traps from this paper and your real UTME score will climb even higher!`
        : `You placed #${myRank} of ${totalParticipants} students today (${myScore}%). Clear the examiner traps from this paper to move into the #1 spot!`;
  } else {
    encouragementTitle = `#${myRank} of ${totalParticipants} Today — Every Tough Paper Builds Your Real Score!`;
    encouragementBody =
      mode === 'jamb'
        ? `Do not be discouraged by a tough score (${myScore}/400) — Easy Learn trains you with harder distractors and tighter timing than real JAMB on purpose. Study the explanations for your missed questions right now and watch your next CBT jump!`
        : `Showing up and finishing today’s paper (${myScore}%) puts you ahead of everyone who didn’t practise. Review the missed topics step by step and come back stronger on your next run!`;
  }

  return {
    myRank,
    totalParticipants,
    topPercentile,
    aheadCount,
    entries: ranked,
    encouragementTitle,
    encouragementBody,
  };
}
