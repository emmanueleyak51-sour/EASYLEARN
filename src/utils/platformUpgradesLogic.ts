import type { ScreenName, SubjectId } from '../types';

export type GlobalCatalogCategory = 'topic' | 'world' | 'lab' | 'novel' | 'tool';
export type GlobalCatalogFilter = 'all' | GlobalCatalogCategory;

export interface GlobalCatalogRouteAction {
  kind:
    | 'screen'
    | 'subject-home'
    | 'topic'
    | 'lesson'
    | 'world'
    | 'heart-3d'
    | 'lab'
    | 'novel'
    | 'formulas';
  screen?: ScreenName;
  subj?: SubjectId;
  topicId?: string;
  labId?: string;
  novelId?: string;
}

export interface GlobalCatalogItem {
  id: string;
  category: GlobalCatalogCategory;
  title: string;
  subtitle: string;
  keywords: string;
  icon: string;
  priority: number;
  action: GlobalCatalogRouteAction;
}

function normalizeSearchText(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s+-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Ranks and filters global catalog items across Topics, Worlds, Practical Labs, Set Novels, and Workspaces.
 */
export function searchGlobalCatalog(
  catalog: readonly GlobalCatalogItem[],
  rawQuery: string,
  categoryFilter: GlobalCatalogFilter = 'all',
  limit = 18
): GlobalCatalogItem[] {
  const safeLimit = Math.max(1, Math.min(50, limit));
  const filteredByCat =
    categoryFilter === 'all'
      ? catalog
      : catalog.filter((item) => item.category === categoryFilter);

  const query = normalizeSearchText(rawQuery);
  if (!query) {
    return [...filteredByCat]
      .sort((a, b) => b.priority - a.priority || a.title.localeCompare(b.title))
      .slice(0, safeLimit);
  }

  const tokens = query.split(' ').filter(Boolean);
  const scored: { item: GlobalCatalogItem; score: number }[] = [];

  for (const item of filteredByCat) {
    const normTitle = normalizeSearchText(item.title);
    const normSub = normalizeSearchText(item.subtitle);
    const normKw = normalizeSearchText(item.keywords);
    const haystack = `${normTitle} ${normSub} ${normKw}`;

    // Every query token must match somewhere in title, subtitle, or keywords
    let allMatched = true;
    let tokenScore = 0;

    for (const tok of tokens) {
      if (normTitle === tok) {
        tokenScore += 140;
      } else if (normTitle.startsWith(tok)) {
        tokenScore += 95;
      } else if (normTitle.includes(` ${tok}`)) {
        tokenScore += 75;
      } else if (normTitle.includes(tok)) {
        tokenScore += 52;
      } else if (normSub.startsWith(tok) || normSub.includes(` ${tok}`)) {
        tokenScore += 36;
      } else if (haystack.includes(tok)) {
        tokenScore += 20;
      } else {
        allMatched = false;
        break;
      }
    }

    if (!allMatched) continue;

    if (normTitle === query) tokenScore += 180;
    else if (normTitle.startsWith(query)) tokenScore += 80;

    scored.push({
      item,
      score: tokenScore + item.priority * 0.25,
    });
  }

  scored.sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title));
  return scored.slice(0, safeLimit).map((s) => s.item);
}

/**
 * Splits a teacher voice script into clean, readable teleprompter caption sentences
 * without breaking decimals (e.g. "0.9% NaCl", "11.2 km/s") or honorifics ("Dr. Amaka").
 */
export function splitSpeechIntoCaptions(rawScript: string): string[] {
  const cleaned = rawScript
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!cleaned) return [];

  const protectedText = cleaned
    .replace(/\b(Dr|Mr|Mrs|Ms|Prof|St|Fig|No|vs)\.\s+/gi, '$1__DOT__ ')
    .replace(/(\d)\.(\d)/g, '$1__DEC__$2');

  const rawParts = protectedText
    .split(/(?<=[.!?;])\s+/)
    .map((part) =>
      part
        .replace(/__DOT__/g, '.')
        .replace(/__DEC__/g, '.')
        .trim()
    )
    .filter((part) => part.length > 0);

  if (rawParts.length <= 1) return rawParts;

  // Merge tiny fragments (< 10 chars) into adjacent sentences so captions read smoothly
  const merged: string[] = [];
  for (const part of rawParts) {
    if (merged.length > 0 && part.length < 10) {
      merged[merged.length - 1] = `${merged[merged.length - 1]} ${part}`;
    } else {
      merged.push(part);
    }
  }
  return merged;
}

/**
 * Resolves which caption index is active at normalized playback progress [0..1],
 * weighting each sentence by character length for natural synchronization.
 */
export function resolveActiveCaptionIndex(captions: readonly string[], progress01: number): number {
  if (captions.length === 0) return -1;
  if (captions.length === 1) return 0;

  const clamped = Math.max(0, Math.min(0.9999, Number.isFinite(progress01) ? progress01 : 0));
  const weights = captions.map((c) => Math.max(8, c.length));
  const totalWeight = weights.reduce((acc, w) => acc + w, 0);
  const targetChar = clamped * totalWeight;

  let cumulative = 0;
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (targetChar < cumulative) return i;
  }
  return captions.length - 1;
}

export function stripHtmlToPlain(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Synthesizes a concise, non-spoiling Examiner Clue before a student answers a quiz question.
 * Redacts explicit answer letters ("Option A") and verbatim multi-character correct option giveaways.
 */
export function buildGuidedQuestionClue(params: {
  questionHtml: string;
  explanationHtml?: string;
  optionsHtml: readonly string[];
  correctIndex: number;
  topicTrap?: string;
}): { principle: string; trapNote: string | null } {
  const { explanationHtml, optionsHtml, correctIndex, topicTrap } = params;
  const correctPlain = stripHtmlToPlain(optionsHtml[correctIndex] || '');
  const cleanTrap = topicTrap ? stripHtmlToPlain(topicTrap) : '';

  const redactAnswerLeak = (text: string): string => {
    let out = text.replace(/\b(option|choice)\s+[A-D]\b/gi, 'the matching option');
    out = out.replace(/\b(correct answer|answer)\s+(is|=|:)\s*[^.;]+/gi, 'apply this relation carefully');
    if (correctPlain.length >= 4) {
      const escaped = correctPlain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      out = out.replace(new RegExp(escaped, 'gi'), '[target value]');
    }
    return out.replace(/\s+/g, ' ').trim();
  };

  const expSentences = splitSpeechIntoCaptions(explanationHtml || '');
  const firstSentence = expSentences[0] ? redactAnswerLeak(expSentences[0]) : '';

  const principle =
    firstSentence && firstSentence.length >= 16
      ? firstSentence
      : cleanTrap
        ? redactAnswerLeak(cleanTrap)
        : 'Identify the governing formula or rule in the stem, check units, and cross out look-alike distractors.';

  const trapNote =
    cleanTrap && cleanTrap !== firstSentence ? redactAnswerLeak(cleanTrap) : null;

  return { principle, trapNote };
}

export interface ConcordForgeChallenge {
  id: string;
  ruleTag: string;
  stemBefore: string;
  parenthetical: string;
  stemAfter: string;
  choices: [string, string];
  correctChoice: string;
  why: string;
}

export const CONCORD_FORGE_CHALLENGES: readonly ConcordForgeChallenge[] = [
  {
    id: 'accompaniment',
    ruleTag: 'Rule 1 · Accompaniment Concord',
    stemBefore: 'The Principal',
    parenthetical: ', together with all senior teachers,',
    stemAfter: 'addressing the assembly now.',
    choices: ['is', 'are'],
    correctChoice: 'is',
    why: 'Bracket away "together with..." — singular head subject "The Principal" takes singular "is".',
  },
  {
    id: 'proximity',
    ruleTag: 'Rule 2 · Proximity (Neither...Nor)',
    stemBefore: 'Neither the captain nor the players',
    parenthetical: '(nearer noun = plural)',
    stemAfter: 'ready before the whistle blew.',
    choices: ['were', 'was'],
    correctChoice: 'were',
    why: 'With "Neither A nor B", the verb agrees with the nearer subject ("the players" → "were").',
  },
  {
    id: 'indefinite',
    ruleTag: 'Rule 3 · Indefinite Pronoun Trap',
    stemBefore: 'Each of the shortlisted candidates',
    parenthetical: '(distributive singular)',
    stemAfter: 'submitted a verified slip.',
    choices: ['has', 'have'],
    correctChoice: 'has',
    why: '"Each of..." always governs a singular verb ("has"), even when followed by a plural noun.',
  },
];

export function evaluateConcordSelection(
  challengeIndex: number,
  pickedChoice: string
): { correct: boolean; explanation: string } {
  const ch =
    CONCORD_FORGE_CHALLENGES[
      Math.max(0, Math.min(CONCORD_FORGE_CHALLENGES.length - 1, challengeIndex))
    ];
  return {
    correct: pickedChoice === ch.correctChoice,
    explanation: ch.why,
  };
}

export interface MarketEquilibriumState {
  priceNaira: number;
  quantityDemanded: number;
  quantitySupplied: number;
  gapUnits: number;
  status: 'shortage' | 'equilibrium' | 'surplus';
  statusLabel: string;
}

/**
 * Computes demand, supply, and market disequilibrium state for the Economics Interactive Equilibrium Sandbox.
 * Equilibrium occurs at P* = ₦500, Q* = 500 bags.
 */
export function computeMarketEquilibriumState(rawPriceNaira: number): MarketEquilibriumState {
  const priceNaira = Math.round(Math.max(200, Math.min(800, rawPriceNaira)) / 50) * 50;
  const quantityDemanded = 1000 - priceNaira;
  const quantitySupplied = priceNaira;
  const gapUnits = Math.abs(quantitySupplied - quantityDemanded);

  if (priceNaira === 500) {
    return {
      priceNaira,
      quantityDemanded,
      quantitySupplied,
      gapUnits: 0,
      status: 'equilibrium',
      statusLabel: '● MARKET EQUILIBRIUM (Qd = Qs = 500)',
    };
  }
  if (priceNaira < 500) {
    return {
      priceNaira,
      quantityDemanded,
      quantitySupplied,
      gapUnits,
      status: 'shortage',
      statusLabel: `▼ EXCESS DEMAND / SHORTAGE (${gapUnits} units)`,
    };
  }
  return {
    priceNaira,
    quantityDemanded,
    quantitySupplied,
    gapUnits,
    status: 'surplus',
    statusLabel: `▲ EXCESS SUPPLY / SURPLUS (${gapUnits} units)`,
  };
}

/**
 * Resolves whether a CBT paper length preset can be started under the student's current access state.
 * During an active 24-hour Free Trial, the 45-question Sprint CBT preset is unlocked immediately,
 * while Half (90Q) and Full (180Q) unlock with Premium or on Free Saturday National CBT days.
 */
export function canRunCbtPresetInCurrentAccess(params: {
  preset: 'sprint' | 'half' | 'full';
  isBasePaywalled: boolean;
  isActiveCountdownTrial: boolean;
  isPublicFreeLaunch: boolean;
}): boolean {
  const { preset, isBasePaywalled, isActiveCountdownTrial, isPublicFreeLaunch } = params;
  if (isPublicFreeLaunch || !isBasePaywalled) return true;
  if (isActiveCountdownTrial && preset === 'sprint') return true;
  return false;
}

/**
 * Builds a concise, plain-text prompt for the Live Voice Teacher from any exam, topic test, or lab viva question.
 */
export function buildLiveTeacherPromptForQuestion(params: {
  subjectName: string;
  topicName: string;
  questionHtml: string;
  chosenOptionHtml?: string;
  correctOptionHtml: string;
  isCorrect: boolean;
}): string {
  const stem = stripHtmlToPlain(params.questionHtml);
  const correctText = stripHtmlToPlain(params.correctOptionHtml);
  const chosenText = params.chosenOptionHtml ? stripHtmlToPlain(params.chosenOptionHtml) : '';

  if (params.isCorrect) {
    return `In ${params.subjectName} (${params.topicName}), I got "${stem}" right (${correctText}). Teach me the fastest exam-hall shortcut for this type of question in 3 short steps.`;
  }
  if (chosenText) {
    return `In ${params.subjectName} (${params.topicName}), please explain why "${chosenText}" is wrong and why "${correctText}" is right for: "${stem}". Keep it simple and step-by-step.`;
  }
  return `In ${params.subjectName} (${params.topicName}), I skipped: "${stem}". Teach me how to arrive at "${correctText}" step by step.`;
}

