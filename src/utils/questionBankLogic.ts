import type { SubjectId } from '../types';
import { stripPrototypePollution } from './securityPolicy';

export type BankExamType = 'JAMB' | 'WAEC' | 'NECO';
export type BankQuestionSource = 'api' | 'ai';
export type BankOptionKey = 'A' | 'B' | 'C' | 'D';

export interface BankQuestion {
  id: string;
  subject: SubjectId;
  examType: BankExamType;
  year: number;
  topic: string;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  answer: BankOptionKey;
  explanation: string;
  source: BankQuestionSource;
  /** Internal normalized key used by IndexedDB unique index for deduplication */
  normHash?: string;
}

export interface BankSubjectConfig {
  id: SubjectId;
  uiName: string;
  fullName: string;
  alocSlug: string | null;
  requiresLatex: boolean;
  targetCount: number;
  sourceStrategy: 'aloc+gemini' | 'gemini-primary';
}

export const BANK_TARGET_PER_SUBJECT = 1000;
export const BANK_TOTAL_TARGET = 12000;

export const QUESTION_BANK_SUBJECTS: BankSubjectConfig[] = [
  { id: 'maths', uiName: 'Maths', fullName: 'Mathematics', alocSlug: 'mathematics', requiresLatex: true, targetCount: 1000, sourceStrategy: 'aloc+gemini' },
  { id: 'fmaths', uiName: 'F.Maths', fullName: 'Further Mathematics', alocSlug: null, requiresLatex: true, targetCount: 1000, sourceStrategy: 'gemini-primary' },
  { id: 'chem', uiName: 'Chem', fullName: 'Chemistry', alocSlug: 'chemistry', requiresLatex: true, targetCount: 1000, sourceStrategy: 'aloc+gemini' },
  { id: 'phys', uiName: 'Phys', fullName: 'Physics', alocSlug: 'physics', requiresLatex: true, targetCount: 1000, sourceStrategy: 'aloc+gemini' },
  { id: 'bio', uiName: 'Bio', fullName: 'Biology', alocSlug: 'biology', requiresLatex: false, targetCount: 1000, sourceStrategy: 'aloc+gemini' },
  { id: 'agric', uiName: 'Agric', fullName: 'Agricultural Science', alocSlug: 'agric', requiresLatex: false, targetCount: 1000, sourceStrategy: 'aloc+gemini' },
  { id: 'geog', uiName: 'Geog', fullName: 'Geography', alocSlug: 'geography', requiresLatex: false, targetCount: 1000, sourceStrategy: 'aloc+gemini' },
  { id: 'econ', uiName: 'Econ', fullName: 'Economics', alocSlug: 'economics', requiresLatex: false, targetCount: 1000, sourceStrategy: 'aloc+gemini' },
  { id: 'eng', uiName: 'Eng', fullName: 'English Language', alocSlug: 'english', requiresLatex: false, targetCount: 1000, sourceStrategy: 'aloc+gemini' },
  { id: 'civic', uiName: 'Civic', fullName: 'Civic Education', alocSlug: 'civic-education', requiresLatex: false, targetCount: 1000, sourceStrategy: 'aloc+gemini' },
  { id: 'digitech', uiName: 'DigiTech', fullName: 'Digital Technologies', alocSlug: null, requiresLatex: false, targetCount: 1000, sourceStrategy: 'gemini-primary' },
  { id: 'dataproc', uiName: 'DataProc', fullName: 'Data Processing', alocSlug: null, requiresLatex: false, targetCount: 1000, sourceStrategy: 'gemini-primary' },
];

export const BANK_SUBJECT_MAP: Record<SubjectId, BankSubjectConfig> = QUESTION_BANK_SUBJECTS.reduce(
  (acc, item) => {
    acc[item.id] = item;
    return acc;
  },
  {} as Record<SubjectId, BankSubjectConfig>
);

export const ALOC_SUPPORTED_SUBJECTS: BankSubjectConfig[] = QUESTION_BANK_SUBJECTS.filter(
  (s) => s.alocSlug !== null
);

export const GEMINI_PRIMARY_SUBJECTS: SubjectId[] = ['digitech', 'dataproc', 'fmaths'];

/**
 * Normalizes question text for reliable cross-source deduplication.
 * Strips HTML tags, LaTeX delimiters, punctuation, and redundant whitespace.
 */
export function normalizeQuestionText(text: string): string {
  return String(text || '')
    .toLowerCase()
    .replace(/<[^>]+>/g, ' ')
    .replace(/\\(frac|sqrt|times|cdot|left|right|text|mathrm)/g, '$1')
    .replace(/[$`'"“”‘’.,;:?!()[\]{}—–-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Computes a deterministic deduplication key combining subject + normalized question text.
 */
export function computeQuestionHash(subject: SubjectId, question: string): string {
  const norm = normalizeQuestionText(question);
  // Dual 32-bit FNV-1a hash for compact, collision-resistant unique index keys in IndexedDB
  let h1 = 0x811c9dc5;
  let h2 = 0x9e3779b1;
  const input = `${subject}|${norm}`;
  for (let i = 0; i < input.length; i++) {
    const c = input.charCodeAt(i);
    h1 ^= c;
    h1 = Math.imul(h1, 0x01000193);
    h2 ^= c;
    h2 = Math.imul(h2, 0x85ebca6b);
  }
  const hex1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const hex2 = (h2 >>> 0).toString(16).padStart(8, '0');
  return `${subject}:${hex1}${hex2}:${norm.slice(0, 48)}`;
}

export function normalizeExamType(raw: unknown, fallback: BankExamType = 'JAMB'): BankExamType {
  const s = String(raw || '').trim().toUpperCase();
  if (s === 'WAEC' || s === 'WASSCE') return 'WAEC';
  if (s === 'NECO' || s === 'SSCE') return 'NECO';
  if (s === 'JAMB' || s === 'UTME') return 'JAMB';
  return fallback;
}

export function normalizeOptionKey(raw: unknown): BankOptionKey | null {
  const s = String(raw || '').trim().toUpperCase();
  if (s === 'A' || s === 'B' || s === 'C' || s === 'D') return s;
  if (s.startsWith('A')) return 'A';
  if (s.startsWith('B')) return 'B';
  if (s.startsWith('C')) return 'C';
  if (s.startsWith('D')) return 'D';
  return null;
}

export function resolveSubjectId(raw: unknown): SubjectId | null {
  const s = String(raw || '').trim().toLowerCase();
  if (!s) return null;
  for (const cfg of QUESTION_BANK_SUBJECTS) {
    if (
      cfg.id === s ||
      cfg.uiName.toLowerCase() === s ||
      cfg.fullName.toLowerCase() === s ||
      (cfg.alocSlug && cfg.alocSlug === s)
    ) {
      return cfg.id;
    }
  }
  if (s === 'math' || s === 'mathematics') return 'maths';
  if (s === 'f.maths' || s === 'fmath' || s === 'further mathematics' || s === 'further maths') return 'fmaths';
  if (s === 'chemistry') return 'chem';
  if (s === 'physics') return 'phys';
  if (s === 'biology') return 'bio';
  if (s === 'agricultural science' || s === 'agriculture') return 'agric';
  if (s === 'geography') return 'geog';
  if (s === 'economics') return 'econ';
  if (s === 'english' || s === 'english language' || s === 'use of english') return 'eng';
  if (s === 'civic' || s === 'civic education' || s === 'civic-education') return 'civic';
  if (s === 'digitech' || s === 'digital tech' || s === 'digital technologies' || s === 'computer studies') return 'digitech';
  if (s === 'dataproc' || s === 'data processing' || s === 'data-processing') return 'dataproc';
  return null;
}

/**
 * Deduplicates incoming questions both against existing hashes and within the incoming batch itself.
 */
export function deduplicateBankQuestions(
  incoming: BankQuestion[],
  existingHashes: Set<string>
): { unique: BankQuestion[]; duplicatesSkipped: number } {
  const seen = new Set<string>(existingHashes);
  const unique: BankQuestion[] = [];
  let duplicatesSkipped = 0;

  for (const item of incoming) {
    const hash = item.normHash || computeQuestionHash(item.subject, item.question);
    if (seen.has(hash)) {
      duplicatesSkipped++;
      continue;
    }
    seen.add(hash);
    unique.push({
      ...item,
      normHash: hash,
    });
  }

  return { unique, duplicatesSkipped };
}

/**
 * Maps a raw ALOC v1 API question object into the normalized BankQuestion schema.
 */
export function normalizeAlocQuestion(
  raw: Record<string, unknown>,
  subject: SubjectId,
  fallbackExamType: BankExamType = 'JAMB'
): BankQuestion | null {
  const questionText = String(raw.question || '').trim();
  if (questionText.length < 6) return null;

  const optRaw = (raw.option || raw.options || {}) as Record<string, unknown>;
  const A = String(optRaw.a ?? optRaw.A ?? '').trim();
  const B = String(optRaw.b ?? optRaw.B ?? '').trim();
  const C = String(optRaw.c ?? optRaw.C ?? '').trim();
  const D = String(optRaw.d ?? optRaw.D ?? '').trim();
  if (!A || !B || !C || !D) return null;

  const answer = normalizeOptionKey(raw.answer);
  if (!answer) return null;

  const examType = normalizeExamType(raw.examtype ?? raw.examType, fallbackExamType);
  const parsedYear = Number.parseInt(String(raw.examyear ?? raw.year ?? ''), 10);
  const year = Number.isFinite(parsedYear) && parsedYear >= 1978 && parsedYear <= 2030 ? parsedYear : 2023;
  const topic = String(raw.section || raw.topic || 'General Syllabus').trim().slice(0, 120) || 'General Syllabus';
  const explanation =
    String(raw.solution || raw.explanation || '').trim() ||
    `Correct option is ${answer} (${examType} ${year} past paper).`;

  const hash = computeQuestionHash(subject, questionText);
  const rawId = raw.id !== undefined && raw.id !== null ? String(raw.id) : hash.slice(0, 22);

  return {
    id: `aloc-${subject}-${rawId}`,
    subject,
    examType,
    year,
    topic,
    question: questionText,
    options: { A, B, C, D },
    answer,
    explanation,
    source: 'api',
    normHash: hash,
  };
}

/**
 * Extracts question items & next cursor from ALOC v1 response shapes.
 */
export function parseAlocResponseEnvelope(payload: unknown): {
  items: Record<string, unknown>[];
  nextCursor: string | null;
} {
  if (!payload || typeof payload !== 'object') {
    return { items: [], nextCursor: null };
  }
  const obj = payload as Record<string, unknown>;
  const data = obj.data;
  const items: Record<string, unknown>[] = Array.isArray(data)
    ? (data.filter((x) => x && typeof x === 'object') as Record<string, unknown>[])
    : Array.isArray(obj.questions)
      ? (obj.questions.filter((x) => x && typeof x === 'object') as Record<string, unknown>[])
      : [];

  const meta = (obj.meta || obj.pagination || {}) as Record<string, unknown>;
  const cursorRaw =
    obj.next_cursor ??
    obj.nextCursor ??
    obj.cursor ??
    meta.next_cursor ??
    meta.nextCursor ??
    meta.cursor ??
    null;

  const nextCursor =
    typeof cursorRaw === 'string' && cursorRaw.trim().length > 0
      ? cursorRaw.trim()
      : typeof cursorRaw === 'number'
        ? String(cursorRaw)
        : null;

  return { items, nextCursor };
}

/**
 * Validates and normalizes an imported JSON bank file (either `{ questions: [...] }` or raw array `[...]`).
 */
const MAX_IMPORT_QUESTIONS = 25000;

export function validateBankImportPayload(raw: unknown):
  | { ok: true; questions: BankQuestion[]; invalidCount: number }
  | { ok: false; error: string } {
  const safeRaw = stripPrototypePollution(raw);
  const rawArr = Array.isArray(safeRaw)
    ? safeRaw
    : safeRaw && typeof safeRaw === 'object' && Array.isArray((safeRaw as Record<string, unknown>).questions)
      ? ((safeRaw as Record<string, unknown>).questions as unknown[])
      : null;

  if (!rawArr) {
    return { ok: false, error: 'JSON file must be an array of questions or an object containing a "questions" array.' };
  }
  if (rawArr.length > MAX_IMPORT_QUESTIONS) {
    return {
      ok: false,
      error: `Import exceeds maximum safety limit of ${MAX_IMPORT_QUESTIONS.toLocaleString()} questions per file.`,
    };
  }

  const questions: BankQuestion[] = [];
  let invalidCount = 0;

  for (let i = 0; i < rawArr.length; i++) {
    const item = rawArr[i];
    if (!item || typeof item !== 'object') {
      invalidCount++;
      continue;
    }
    const r = item as Record<string, unknown>;
    const subject = resolveSubjectId(r.subject);
    const question = String(r.question || '').trim().slice(0, 4000);
    const answer = normalizeOptionKey(r.answer);
    const opt = (r.options || r.option || {}) as Record<string, unknown>;
    const A = String(opt.A ?? opt.a ?? '').trim().slice(0, 1000);
    const B = String(opt.B ?? opt.b ?? '').trim().slice(0, 1000);
    const C = String(opt.C ?? opt.c ?? '').trim().slice(0, 1000);
    const D = String(opt.D ?? opt.d ?? '').trim().slice(0, 1000);

    if (!subject || question.length < 4 || !answer || !A || !B || !C || !D) {
      invalidCount++;
      continue;
    }

    const examType = normalizeExamType(r.examType ?? r.examtype, 'JAMB');
    const parsedYear = Number.parseInt(String(r.year ?? r.examyear ?? 2024), 10);
    const year = Number.isFinite(parsedYear) && parsedYear >= 1978 && parsedYear <= 2030 ? parsedYear : 2024;
    const topic = String(r.topic || 'General Syllabus').trim().slice(0, 120) || 'General Syllabus';
    const explanation = String(r.explanation || r.solution || `Correct option is ${answer}.`).trim().slice(0, 4000);
    const source: BankQuestionSource = r.source === 'api' ? 'api' : 'ai';
    const normHash = computeQuestionHash(subject, question);
    const rawId = typeof r.id === 'string' ? r.id.trim().replace(/[^a-zA-Z0-9_.:-]/g, '').slice(0, 128) : '';
    const id =
      rawId.length > 0
        ? rawId
        : `imp-${subject}-${normHash.slice(subject.length + 1, subject.length + 17)}-${i}`;

    questions.push({
      id,
      subject,
      examType,
      year,
      topic,
      question,
      options: { A, B, C, D },
      answer,
      explanation,
      source,
      normHash,
    });
  }

  return { ok: true, questions, invalidCount };
}

export function serializeBankExport(questions: BankQuestion[]): string {
  const clean = questions.map(({ normHash: _omit, ...rest }) => rest);
  return JSON.stringify(
    {
      format: 'road-to-campus-question-bank-v1',
      exportedAt: new Date().toISOString(),
      totalQuestions: clean.length,
      questions: clean,
    },
    null,
    2
  );
}

/**
 * Exponential backoff delay (ms) for 429 / transient rate-limit retries.
 * Attempt 0 -> 2000ms, 1 -> 4000ms, 2 -> 8000ms, 3 -> 16000ms, capped at 30000ms.
 */
export function computeRetryDelayMs(attempt: number, baseMs = 2000, maxMs = 30000): number {
  const safeAttempt = Math.max(0, Math.floor(attempt));
  return Math.min(maxMs, baseMs * Math.pow(2, safeAttempt));
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function convertLatexFragment(expr: string): string {
  let out = escapeHtml(expr.trim());
  // Common LaTeX symbols & text wrappers first
  const symbols: [RegExp, string][] = [
    [/\\times/g, '×'],
    [/\\cdot/g, '·'],
    [/\\div/g, '÷'],
    [/\\pm/g, '±'],
    [/\\leq|\\le\b/g, '≤'],
    [/\\geq|\\ge\b/g, '≥'],
    [/\\neq|\\ne\b/g, '≠'],
    [/\\approx/g, '≈'],
    [/\\rightarrow|\\to\b/g, '→'],
    [/\\rightleftharpoons/g, '⇌'],
    [/\\pi\b/g, 'π'],
    [/\\theta\b/g, 'θ'],
    [/\\alpha\b/g, 'α'],
    [/\\beta\b/g, 'β'],
    [/\\gamma\b/g, 'γ'],
    [/\\lambda\b/g, 'λ'],
    [/\\mu\b/g, 'μ'],
    [/\\omega\b/g, 'ω'],
    [/\\Omega\b/g, 'Ω'],
    [/\\Delta\b/g, 'Δ'],
    [/\\sigma\b/g, 'σ'],
    [/\\infty\b/g, '∞'],
    [/\\int\b/g, '∫'],
    [/\\sum\b/g, '∑'],
    [/\\degree|\^\\circ/g, '°'],
    [/\\text\{([^{}]+)\}/g, '$1'],
    [/\\mathrm\{([^{}]+)\}/g, '$1'],
    [/\\left|\\right/g, ''],
  ];
  for (const [rx, rep] of symbols) {
    out = out.replace(rx, rep);
  }
  // Superscripts, subscripts & square roots BEFORE \frac so \frac{x^{2}+1}{\sqrt{9}} resolves cleanly
  out = out.replace(/\^\{([^{}]+)\}/g, '<sup>$1</sup>');
  out = out.replace(/_\{([^{}]+)\}/g, '<sub>$1</sub>');
  out = out.replace(/\^([A-Za-z0-9+-])/g, '<sup>$1</sup>');
  out = out.replace(/_([A-Za-z0-9+-])/g, '<sub>$1</sub>');
  for (let pass = 0; pass < 2; pass++) {
    out = out.replace(
      /\\sqrt\{([^{}]+)\}/g,
      '<span class="m-rad"><span class="m-rad-surd">√</span><span class="m-rad-body">$1</span></span>'
    );
  }
  // Handle nested \frac{a}{b} (up to 3 passes)
  for (let pass = 0; pass < 3; pass++) {
    out = out.replace(
      /\\frac\{([^{}]+)\}\{([^{}]+)\}/g,
      '<span class="fr"><span>$1</span><span>$2</span></span>'
    );
  }
  return `<span class="math-inline">${out}</span>`;
}

/**
 * Renders text containing inline LaTeX `$...$` or `$$...$$` into clean HTML for display.
 */
export function renderInlineLatexToHtml(raw: string): string {
  const input = String(raw || '');
  if (!input.includes('$')) {
    return escapeHtml(input);
  }
  // Replace $$...$$ first, then $...$
  const parts: string[] = [];
  const tokenRegex = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(input)) !== null) {
    if (match.index > lastIndex) {
      parts.push(escapeHtml(input.slice(lastIndex, match.index)));
    }
    const mathBody = match[1] ?? match[2] ?? '';
    parts.push(convertLatexFragment(mathBody));
    lastIndex = tokenRegex.lastIndex;
  }
  if (lastIndex < input.length) {
    parts.push(escapeHtml(input.slice(lastIndex)));
  }
  return parts.join('');
}
