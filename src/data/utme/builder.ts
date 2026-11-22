import type {
  Beat,
  CheckBeat,
  FadeBeat,
  IdeaBeat,
  InteractiveLesson,
  LegacyPart,
  Question,
  TeachBeat,
  Topic,
} from '../../types';

export interface UtmeCheckSpec {
  q: string;
  o: [string, string, string, string];
  a: 0 | 1 | 2 | 3;
  /** Progressive step-by-step hints revealed one by one on wrong tries (never spoiling the final letter/answer). */
  h: [string, string, ...string[]];
  /** Full explanation shown after solving (and used in study notes). */
  e: string;
  /** Optional non-spoiler guiding nudges per option; defaults to progressive guidance if omitted. */
  fb?: [string, string, string, string];
}

export interface UtmePartSpec {
  title: string;
  idea: string;
  terms: [string, string][];
  rules: string[];
  table: {
    headers: string[];
    rows: string[][];
    trapNote?: string;
  };
  example: {
    q: string;
    steps: [string, string][];
  };
  yourTurn: UtmeCheckSpec;
}

export interface UtmeQuestionSpec {
  l?: number;
  q: string;
  o: [string, string, string, string];
  a: 0 | 1 | 2 | 3;
  w?: [string, string, string, string];
  e: string;
}

export interface UtmeTopicSpec {
  id: string;
  name: string;
  sec: string;
  goals: [string, string, ...string[]];
  trap: string;
  parts: [UtmePartSpec, UtmePartSpec];
  qs: [
    UtmeQuestionSpec,
    UtmeQuestionSpec,
    UtmeQuestionSpec,
    UtmeQuestionSpec,
    UtmeQuestionSpec,
    UtmeQuestionSpec,
  ];
}

function hashKey(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rotateCheckSpec(spec: UtmeCheckSpec): UtmeCheckSpec {
  const shift = hashKey(spec.q) % 4;
  if (shift === 0) return spec;
  const o: [string, string, string, string] = [
    spec.o[(4 - shift) % 4],
    spec.o[(5 - shift) % 4],
    spec.o[(6 - shift) % 4],
    spec.o[(7 - shift) % 4],
  ];
  const fb = spec.fb
    ? ([
        spec.fb[(4 - shift) % 4],
        spec.fb[(5 - shift) % 4],
        spec.fb[(6 - shift) % 4],
        spec.fb[(7 - shift) % 4],
      ] as [string, string, string, string])
    : undefined;
  return {
    ...spec,
    o,
    a: ((spec.a + shift) % 4) as 0 | 1 | 2 | 3,
    fb,
  };
}

function buildGuidingFeedback(spec: UtmeCheckSpec): [string, string, string, string] {
  if (spec.fb) return spec.fb;
  const out = ['', '', '', ''] as [string, string, string, string];
  for (let i = 0; i < 4; i++) {
    if (i === spec.a) {
      out[i] = `Well spotted. ${spec.e}`;
    } else {
      out[i] =
        'Not quite — that option mixes up a key rule from this part. Check the hint below and try another choice.';
    }
  }
  return out;
}

function buildLegacyPart(p: UtmePartSpec): LegacyPart {
  const yt = rotateCheckSpec(p.yourTurn);
  return {
    title: p.title,
    idea: p.idea,
    rules: p.rules,
    ex: {
      q: p.example.q,
      steps: p.example.steps,
    },
    tryit: {
      q: yt.q,
      o: [...yt.o],
      a: yt.a,
      h: yt.h[0],
      e: yt.e,
      fb: buildGuidingFeedback(yt),
    },
  };
}

function buildPartBeats(p: UtmePartSpec, topicTrap: string, partIndex: number): Beat[] {
  const yt = rotateCheckSpec(p.yourTurn);
  const ideaBeat: IdeaBeat = {
    k: 'idea',
    kl: 'Core idea & key terms',
    title: p.title,
    idea: p.idea,
    defs: p.terms,
    rules: p.rules,
    rh: 'Key rules to remember',
  };

  const teachBeat: TeachBeat = {
    k: 'teach',
    kl: 'Comparison table',
    title: `${p.title}: side-by-side comparison`,
    body: [
      ['tb', p.table.headers, p.table.rows],
      ['wn', p.table.trapNote || topicTrap],
    ],
  };

  const fadeBeat: FadeBeat = {
    k: 'fade',
    kl: 'Worked example',
    title: 'Worked example',
    q: p.example.q,
    steps: p.example.steps.map(([m, why]) => ({ m, why })),
  };

  const checkBeat: CheckBeat = {
    k: 'check',
    kl: 'Your turn',
    title: partIndex === 0 ? 'Your turn (part 1)' : 'Your turn (part 2)',
    q: yt.q,
    o: [...yt.o],
    a: yt.a,
    fb: buildGuidingFeedback(yt),
    h: [...yt.h],
  };

  return [ideaBeat, teachBeat, fadeBeat, checkBeat];
}

function buildQuestion(q: UtmeQuestionSpec, idx: number): Omit<Question, 'id' | 't'> {
  const defaultLevels = [2, 2, 3, 3, 4, 5];
  const shift = hashKey(q.q) % 4;
  const rotatedO = [
    q.o[(4 - shift) % 4],
    q.o[(5 - shift) % 4],
    q.o[(6 - shift) % 4],
    q.o[(7 - shift) % 4],
  ];
  const rotatedA = (q.a + shift) % 4;
  const rawW = q.w
    ? [
        q.w[(4 - shift) % 4],
        q.w[(5 - shift) % 4],
        q.w[(6 - shift) % 4],
        q.w[(7 - shift) % 4],
      ]
    : [0, 1, 2, 3].map((optIdx) =>
        optIdx === rotatedA
          ? ''
          : 'This choice does not match the required condition in the question.'
      );
  return {
    l: q.l ?? defaultLevels[idx] ?? 3,
    q: q.q,
    o: rotatedO,
    a: rotatedA,
    w: rawW,
    e: q.e,
    dx: idx < 2 ? 1 : undefined,
  };
}

/**
 * Shared builder for JAMB UTME single-block subjects (`src/data/utme/*.ts`).
 */
export function buildUtmeSubjectCurriculum(specs: UtmeTopicSpec[]): {
  topics: Topic[];
  il: Record<string, InteractiveLesson>;
} {
  const topics: Topic[] = [];
  const il: Record<string, InteractiveLesson> = {};

  specs.forEach((spec, index) => {
    const topic: Topic = {
      id: spec.id,
      num: index + 1,
      name: spec.name,
      sec: spec.sec,
      boss: `${spec.name} topic test`,
      goals: [...spec.goals],
      trap: spec.trap,
      parts: [buildLegacyPart(spec.parts[0]), buildLegacyPart(spec.parts[1])],
      qs: spec.qs.map((q, qi) => buildQuestion(q, qi)),
    };
    topics.push(topic);

    il[spec.id] = {
      title: spec.name,
      goals: [...spec.goals],
      trap: spec.trap,
      parts: [
        {
          title: spec.parts[0].title,
          beats: buildPartBeats(spec.parts[0], spec.trap, 0),
        },
        {
          title: spec.parts[1].title,
          beats: buildPartBeats(spec.parts[1], spec.trap, 1),
        },
      ],
    };
  });

  return { topics, il };
}

export interface CompactPartInput {
  title: string;
  idea: string;
  terms: [string, string][];
  rules: [string, string, ...string[]];
  headers: string[];
  rows: string[][];
  exQ: string;
  exSteps: [string, string][];
  checkQ: string;
  checkO: [string, string, string, string];
  checkH: [string, string];
  checkE: string;
}

export interface CompactTopicInput {
  id: string;
  name: string;
  sec: string;
  goals: [string, string];
  trap: string;
  p1: CompactPartInput;
  p2: CompactPartInput;
  /** Six real subject-specific questions: [question, correctAnswer, d1, d2, d3, explanation] */
  qs: [string, string, string, string, string, string][];
}

function toPartSpec(p: CompactPartInput): UtmePartSpec {
  return {
    title: p.title,
    idea: p.idea,
    terms: p.terms,
    rules: p.rules,
    table: { headers: p.headers, rows: p.rows },
    example: { q: p.exQ, steps: p.exSteps },
    yourTurn: {
      q: p.checkQ,
      o: p.checkO,
      a: 0,
      h: p.checkH,
      e: p.checkE,
    },
  };
}

export function compactUtmeTopic(input: CompactTopicInput): UtmeTopicSpec {
  const qs = input.qs.map(([q, ans, d1, d2, d3, e]) => ({
    q,
    o: [ans, d1, d2, d3] as [string, string, string, string],
    a: 0 as const,
    e,
  })) as UtmeTopicSpec['qs'];

  return {
    id: input.id,
    name: input.name,
    sec: input.sec,
    goals: input.goals,
    trap: input.trap,
    parts: [toPartSpec(input.p1), toPartSpec(input.p2)],
    qs,
  };
}

/**
 * Concise syllabus topic builder producing complete 2-part lessons (idea, key terms,
 * rules, comparison table, worked example, and "your turn" check) plus 6 distinct
 * exam-style questions with rotated answer keys and explanations.
 */
export interface QuickPartInput {
  title: string;
  idea: string;
  terms: [string, string][];
  rules: [string, string, ...string[]];
  headers: [string, string];
  rows: [string, string][];
  exQ: string;
  exSteps: [string, string][];
  /** [question, correctAnswer, d1, d2, d3, explanation] */
  check: [string, string, string, string, string, string];
}

export interface QuickTopicInput {
  id: string;
  name: string;
  sec: string;
  goals: [string, string];
  trap: string;
  p1: QuickPartInput;
  p2: QuickPartInput;
  /** Six real subject-specific questions: [question, correctAnswer, d1, d2, d3, explanation] */
  qs: [string, string, string, string, string, string][];
}

function quickPartToCompact(p: QuickPartInput): CompactPartInput {
  const [cq, ca, d1, d2, d3, ce] = p.check;
  const firstRule = p.rules[0] || p.idea;
  const firstTerm = p.terms[0]?.[0] || p.title;
  return {
    title: p.title,
    idea: p.idea,
    terms: p.terms,
    rules: p.rules,
    headers: p.headers,
    rows: p.rows,
    exQ: p.exQ,
    exSteps: p.exSteps,
    checkQ: cq,
    checkO: [ca, d1, d2, d3],
    checkH: [
      `Re-read the key rule on ${firstTerm.toLowerCase()}.`,
      firstRule.length > 140 ? `${firstRule.slice(0, 137)}...` : firstRule,
    ],
    checkE: ce,
  };
}

export function quickUtmeTopic(input: QuickTopicInput): UtmeTopicSpec {
  return compactUtmeTopic({
    id: input.id,
    name: input.name,
    sec: input.sec,
    goals: input.goals,
    trap: input.trap,
    p1: quickPartToCompact(input.p1),
    p2: quickPartToCompact(input.p2),
    qs: input.qs,
  });
}

export interface SlimTopicSpec {
  id: string;
  name: string;
  sec: string;
  trap: string;
  p1: [
    title: string,
    idea: string,
    terms: [string, string][],
    rules: [string, string],
    exQ: string,
    exAns: string,
  ];
  p2: [
    title: string,
    idea: string,
    terms: [string, string][],
    rules: [string, string],
    exQ: string,
    exAns: string,
  ];
  /** Six real subject-specific MCQs: [q, correct, d1, d2, d3, explanation] */
  qs: [string, string, string, string, string, string][];
}

export function slimUtmeTopic(s: SlimTopicSpec): UtmeTopicSpec {
  const buildPart = (
    p: SlimTopicSpec['p1'],
    qCheck: [string, string, string, string, string, string],
  ): QuickPartInput => {
    const [title, idea, terms, rules, exQ, exAns] = p;
    return {
      title,
      idea,
      terms,
      rules,
      headers: ['Key concept', 'Core meaning / rule'],
      rows: terms.map(([k, v]) => [k, v]),
      exQ,
      exSteps: [
        ['Key principle', rules[0]],
        ['Conclusion', exAns],
      ],
      check: qCheck,
    };
  };
  return quickUtmeTopic({
    id: s.id,
    name: s.name,
    sec: s.sec,
    goals: [
      `Explain ${s.p1[0].toLowerCase()} clearly for JAMB and WAEC exams.`,
      `Apply ${s.p2[0].toLowerCase()} to real Nigerian exam questions.`,
    ],
    trap: s.trap,
    p1: buildPart(s.p1, s.qs[0]),
    p2: buildPart(s.p2, s.qs[1]),
    qs: s.qs,
  });
}



