import type {
  Beat,
  DayoNode,
  ExplainWhySpec,
  InteractiveLesson,
  LabItem,
  LegacyPart,
  PredictSpec,
  TeachBlock,
  Topic,
} from '../types';

/**
 * Replaces legacy external exam-body acronyms (WAEC, JAMB, JAAMB, NECO, UTME, WASSCE, SSCE)
 * and rewrites "Exam trap" / "Exam watchout" to "Trap" so the entire platform speaks as a
 * unified National Learning Studio while preserving scientific, mathematical, and grammatical accuracy.
 */
export function sanitizeNationalText(input: string): string {
  if (!input) return input;
  let s = input;

  // 1. Replace compound exam-body phrases first (most specific -> general)
  s = s.replace(
    /\b(?:NERDC\s*[·,/&]+\s*)?(?:WAEC|WASSCE)(?:\s*(?:WASSCE))?\s*(?:[,/&·]|and|or)+\s*(?:NECO\s*(?:[,/&·]|and|or)+\s*)?(?:JAMB|JAAMB)(?:\s*UTME)?\b/gi,
    'National Curriculum'
  );
  s = s.replace(
    /\b(?:JAMB|JAAMB)(?:\s*UTME)?\s*(?:[,/&·]|and|or)+\s*(?:WAEC|WASSCE)(?:\s*(?:[,/&·]|and|or)+\s*NECO)?\b/gi,
    'National Curriculum'
  );
  s = s.replace(/\b(?:WAEC|WASSCE)\s*(?:[,/&·]|and|or)+\s*(?:UTME|NECO)\b/gi, 'National');
  s = s.replace(/\b(?:WASSCE|SSCE)\s*(?:[,/&·]|and|or)+\s*UTME\b/gi, 'Senior Secondary');
  s = s.replace(/\bWAEC\s+Paper\s*[123]\b/gi, 'Practical');
  s = s.replace(/\bWAEC\s+(?:WASSCE\s+)?(\d+-Mark)\b/gi, 'Standard $1');
  s = s.replace(/\bJAMB\s+UTME\b/gi, 'Senior Secondary');
  s = s.replace(/\bWAEC\s+WASSCE\b/gi, 'Senior Secondary');

  // 2. Replace standalone exam-body acronyms with natural contextual equivalents
  s = s.replace(/\b(?:WAEC|WASSCE|SSCE)\b/gi, 'standard');
  s = s.replace(/\b(?:JAMB|JAAMB)\b/gi, 'national');
  s = s.replace(/\bNECO\b/gi, 'curriculum');
  s = s.replace(/\bUTME\b/gi, 'mastery');

  // 3. Clean up any awkward duplicate words produced by adjacent replacements
  s = s.replace(/\b(standard|national|curriculum|mastery)\s+\1\b/gi, '$1');
  s = s.replace(/\ba\s+standard\s+national\b/gi, 'a national');
  s = s.replace(/\bin\s+standard\s+(?:and|or)\s+national\b/gi, 'in national');
  s = s.replace(/\bstandard,\s*curriculum\s*(?:&|and)\s*national\b/gi, 'SS1–SS3 National');

  // 4. Replace "Common Mistake & Exam Watchout", "Exam Watchout", and "Exam Trap(s)" -> "Trap" / "trap(s)"
  s = s.replace(/Common\s+Mistake\s*(?:&amp;|&)\s*Exam\s+Watchout/gi, 'Trap');
  s = s.replace(/\bExam\s+Watchouts?\b/g, (m) =>
    m[0] === 'E'
      ? m.toLowerCase().endsWith('s')
        ? 'Traps'
        : 'Trap'
      : m.toLowerCase().endsWith('s')
        ? 'traps'
        : 'trap'
  );
  s = s.replace(/\bclassic\s+exam\s+trap\b/gi, 'classic trap');
  s = s.replace(/\bfavourite\s+exam\s+trap\b/gi, 'classic trap');
  s = s.replace(/\b#1\s+exam\s+trap\b/gi, '#1 trap');
  s = s.replace(/\bExam\s+Traps\b/g, 'Traps');
  s = s.replace(/\bExam\s+trap\b/g, 'Trap');
  s = s.replace(/\bExam\s+Trap\b/g, 'Trap');
  s = s.replace(/\bexam\s+traps\b/gi, (m) => (m[0] === 'E' ? 'Traps' : 'traps'));
  s = s.replace(/\bexam\s+trap\b/gi, (m) => (m[0] === 'E' ? 'Trap' : 'trap'));

  return s;
}

function sanitizeStr<T>(val: T): T {
  return (typeof val === 'string' ? sanitizeNationalText(val) : val) as T;
}

function sanitizeStrList<T>(arr: T): T {
  if (Array.isArray(arr)) {
    return arr.map((item) =>
      typeof item === 'string' ? sanitizeNationalText(item) : item
    ) as unknown as T;
  }
  if (typeof arr === 'string') {
    return sanitizeNationalText(arr) as unknown as T;
  }
  return arr;
}

function sanitizeExplainWhy(spec: ExplainWhySpec | undefined): ExplainWhySpec | undefined {
  if (!spec) return spec;
  return {
    ...spec,
    q: sanitizeStr(spec.q),
    o: sanitizeStrList(spec.o),
    fb: sanitizeStrList(spec.fb),
  };
}

function sanitizePredict(spec: PredictSpec | undefined): PredictSpec | undefined {
  if (!spec) return spec;
  return {
    ...spec,
    q: sanitizeStr(spec.q),
    o: sanitizeStrList(spec.o),
    fb: sanitizeStrList(spec.fb),
  };
}

function sanitizeLegacyPart(part: LegacyPart): LegacyPart {
  return {
    ...part,
    title: sanitizeStr(part.title),
    idea: sanitizeStr(part.idea),
    cap: sanitizeStr(part.cap),
    rules: sanitizeStrList(part.rules),
    ex: part.ex
      ? {
          ...part.ex,
          q: sanitizeStr(part.ex.q),
          steps: Array.isArray(part.ex.steps)
            ? part.ex.steps.map((pair) =>
                Array.isArray(pair)
                  ? ([sanitizeStr(pair[0]), sanitizeStr(pair[1])] as [string, string])
                  : pair
              )
            : part.ex.steps,
          why: Array.isArray(part.ex.why)
            ? [
                part.ex.why[0],
                sanitizeStr(part.ex.why[1]),
                sanitizeStrList(part.ex.why[2]),
                sanitizeStrList(part.ex.why[3]),
              ]
            : part.ex.why,
        }
      : part.ex,
    tryit: part.tryit
      ? {
          ...part.tryit,
          q: sanitizeStr(part.tryit.q),
          given: sanitizeStrList(part.tryit.given),
          ask: sanitizeStr(part.tryit.ask),
          o: sanitizeStrList(part.tryit.o),
          h: sanitizeStr(part.tryit.h),
          e: sanitizeStr(part.tryit.e),
          fb: sanitizeStrList(part.tryit.fb),
        }
      : part.tryit,
  };
}

export function sanitizeTopicForNationalLearning(topic: Topic): Topic {
  return {
    ...topic,
    name: sanitizeStr(topic.name),
    sec: sanitizeStr(topic.sec),
    boss: sanitizeStr(topic.boss),
    trap: sanitizeStr(topic.trap),
    goals: sanitizeStrList(topic.goals),
    parts: Array.isArray(topic.parts) ? topic.parts.map(sanitizeLegacyPart) : topic.parts,
    qs: Array.isArray(topic.qs)
      ? topic.qs.map((q) => ({
          ...q,
          q: sanitizeStr(q.q),
          o: sanitizeStrList(q.o),
          e: sanitizeStr(q.e),
          w: sanitizeStrList(q.w),
        }))
      : topic.qs,
    spot: topic.spot
      ? {
          ...topic.spot,
          kl: sanitizeStr(topic.spot.kl),
          title: sanitizeStr(topic.spot.title),
          who: sanitizeStr(topic.spot.who),
          q: sanitizeStr(topic.spot.q),
          lines: sanitizeStrList(topic.spot.lines),
          okfb: sanitizeStrList(topic.spot.okfb),
          o: sanitizeStrList(topic.spot.o),
          fb: sanitizeStrList(topic.spot.fb),
          h: sanitizeStrList(topic.spot.h),
          why: sanitizeExplainWhy(topic.spot.why),
          fix: sanitizeStr(topic.spot.fix),
        }
      : topic.spot,
  };
}

function sanitizeTeachBlock(block: TeachBlock): TeachBlock {
  if (!Array.isArray(block)) return block;
  switch (block[0]) {
    case 'p':
      return ['p', sanitizeStr(block[1])];
    case 'h':
      return ['h', sanitizeStr(block[1])];
    case 'eg':
      return ['eg', sanitizeStr(block[1]), sanitizeStr(block[2])];
    case 'wn':
      return ['wn', sanitizeStr(block[1])];
    case 'key':
      return ['key', sanitizeStr(block[1])];
    case 'fig':
      return block[2] ? ['fig', block[1], sanitizeStr(block[2])] : block;
    case 'li':
      return ['li', sanitizeStrList(block[1])];
    case 'ol':
      return ['ol', sanitizeStrList(block[1])];
    case 'tb':
      return [
        'tb',
        sanitizeStrList(block[1]),
        Array.isArray(block[2]) ? block[2].map((r) => sanitizeStrList(r)) : block[2],
      ];
    default:
      return block;
  }
}

function sanitizeBeat(b: Beat): Beat {
  if (!b || typeof b !== 'object') return b;
  switch (b.k) {
    case 'idea':
      return {
        ...b,
        kl: sanitizeStr(b.kl),
        title: sanitizeStr(b.title),
        idea: sanitizeStr(b.idea),
        defs: Array.isArray(b.defs)
          ? b.defs.map((d) =>
              Array.isArray(d) ? ([sanitizeStr(d[0]), sanitizeStr(d[1])] as [string, string]) : d
            )
          : b.defs,
        laws: Array.isArray(b.laws)
          ? b.laws.map((l) =>
              Array.isArray(l) ? ([sanitizeStr(l[0]), sanitizeStr(l[1])] as [string, string]) : l
            )
          : b.laws,
        cap: sanitizeStr(b.cap),
        rules: sanitizeStrList(b.rules),
        rh: sanitizeStr(b.rh),
      };
    case 'explore':
      return {
        ...b,
        kl: sanitizeStr(b.kl),
        title: sanitizeStr(b.title),
        intro: sanitizeStr(b.intro),
        predict: sanitizePredict(b.predict),
        tasks: Array.isArray(b.tasks)
          ? b.tasks.map((t) => ({
              ...t,
              t: sanitizeStr(t.t),
              say: sanitizeStr(t.say),
            }))
          : b.tasks,
        found: sanitizeStr(b.found),
        rules: sanitizeStrList(b.rules),
      };
    case 'dayo': {
      const nextNodes: Record<string, DayoNode> = {};
      if (b.nodes && typeof b.nodes === 'object') {
        for (const [key, node] of Object.entries(b.nodes)) {
          if (!node) continue;
          nextNodes[key] = {
            ...node,
            say: sanitizeStr(node.say),
            opts: Array.isArray(node.opts)
              ? node.opts.map((opt) => ({
                  ...opt,
                  t: sanitizeStr(opt.t),
                  say: sanitizeStr(opt.say),
                }))
              : node.opts,
          };
        }
      }
      return {
        ...b,
        kl: sanitizeStr(b.kl),
        title: sanitizeStr(b.title),
        cap: sanitizeStr(b.cap),
        nodes: nextNodes,
      };
    }
    case 'fade':
      return {
        ...b,
        kl: sanitizeStr(b.kl),
        title: sanitizeStr(b.title),
        q: sanitizeStr(b.q),
        steps: Array.isArray(b.steps)
          ? b.steps.map((st) => ({
              ...st,
              m: sanitizeStr(st.m),
              why: sanitizeStr(st.why),
              ask: sanitizeStr(st.ask),
              o: sanitizeStrList(st.o),
              fb: sanitizeStrList(st.fb),
              h: sanitizeStrList(st.h),
              ex: sanitizeExplainWhy(st.ex),
              whyQ: sanitizeExplainWhy(st.whyQ),
            }))
          : b.steps,
      };
    case 'spot':
      return {
        ...b,
        kl: sanitizeStr(b.kl),
        title: sanitizeStr(b.title),
        who: sanitizeStr(b.who),
        q: sanitizeStr(b.q),
        lines: sanitizeStrList(b.lines),
        okfb: sanitizeStrList(b.okfb),
        o: sanitizeStrList(b.o),
        fb: sanitizeStrList(b.fb),
        h: sanitizeStrList(b.h),
        why: sanitizeExplainWhy(b.why),
        fix: sanitizeStr(b.fix),
      };
    case 'check':
      return {
        ...b,
        kl: sanitizeStr(b.kl),
        title: sanitizeStr(b.title),
        q: sanitizeStr(b.q),
        given: sanitizeStrList(b.given),
        ask: sanitizeStr(b.ask),
        o: sanitizeStrList(b.o),
        fb: sanitizeStrList(b.fb),
        h: sanitizeStrList(b.h),
        why: sanitizeExplainWhy(b.why),
      };
    case 'teach':
      return {
        ...b,
        kl: sanitizeStr(b.kl),
        title: sanitizeStr(b.title),
        body: Array.isArray(b.body) ? b.body.map(sanitizeTeachBlock) : b.body,
      };
    default:
      return b;
  }
}

export function sanitizeLessonForNationalLearning(
  il: InteractiveLesson | undefined
): InteractiveLesson | undefined {
  if (!il) return il;
  return {
    ...il,
    title: sanitizeStr(il.title),
    goals: sanitizeStrList(il.goals),
    trap: sanitizeStr(il.trap),
    parts: Array.isArray(il.parts)
      ? il.parts.map((p) => ({
          ...p,
          title: sanitizeStr(p.title),
          beats: Array.isArray(p.beats) ? p.beats.map(sanitizeBeat) : p.beats,
        }))
      : il.parts,
  };
}

export function sanitizeFormulaForNationalLearning<
  T extends {
    name: string;
    summary: string;
    trap: string;
    keywords: string[];
    variables: [string, string][];
    constants?: string[];
    rearrangements: { solveFor: string; label: string; exprHtml: string; note?: string }[];
    worked: { qHtml: string; stepsHtml: string[]; ansHtml: string };
  },
>(f: T): T {
  return {
    ...f,
    name: sanitizeNationalText(f.name),
    summary: sanitizeNationalText(f.summary),
    trap: sanitizeNationalText(f.trap),
    keywords: f.keywords.map(sanitizeNationalText),
    variables: f.variables.map(([sym, desc]) => [
      sanitizeNationalText(sym),
      sanitizeNationalText(desc),
    ]),
    ...(f.constants ? { constants: f.constants.map(sanitizeNationalText) } : {}),
    rearrangements: f.rearrangements.map((r) => ({
      ...r,
      label: sanitizeNationalText(r.label),
      exprHtml: sanitizeNationalText(r.exprHtml),
      ...(r.note ? { note: sanitizeNationalText(r.note) } : {}),
    })),
    worked: {
      qHtml: sanitizeNationalText(f.worked.qHtml),
      stepsHtml: f.worked.stepsHtml.map(sanitizeNationalText),
      ansHtml: sanitizeNationalText(f.worked.ansHtml),
    },
  };
}

export function sanitizeLabForNationalLearning(lab: LabItem): LabItem {
  return {
    ...lab,
    name: sanitizeNationalText(lab.name),
    blurb: sanitizeNationalText(lab.blurb),
    tip: lab.tip ? sanitizeNationalText(lab.tip) : lab.tip,
    steps: () =>
      lab.steps().map((s) => ({
        ...s,
        say: sanitizeNationalText(s.say),
      })),
  };
}
