import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  ALOC_SUPPORTED_SUBJECTS,
  BANK_SUBJECT_MAP,
  QUESTION_BANK_SUBJECTS,
  computeQuestionHash,
  computeRetryDelayMs,
  deduplicateBankQuestions,
  normalizeAlocQuestion,
  normalizeQuestionText,
  parseAlocResponseEnvelope,
  renderInlineLatexToHtml,
  serializeBankExport,
  validateBankImportPayload,
  type BankQuestion,
} from './questionBankLogic';

describe('Hybrid Question Bank & Sync Engine (Pure Logic)', () => {
  it('defines all 12 required subjects with exact ALOC slug mapping and LaTeX flags', () => {
    assert.equal(QUESTION_BANK_SUBJECTS.length, 12);
    assert.equal(ALOC_SUPPORTED_SUBJECTS.length, 9);

    assert.equal(BANK_SUBJECT_MAP.maths.alocSlug, 'mathematics');
    assert.equal(BANK_SUBJECT_MAP.chem.alocSlug, 'chemistry');
    assert.equal(BANK_SUBJECT_MAP.phys.alocSlug, 'physics');
    assert.equal(BANK_SUBJECT_MAP.bio.alocSlug, 'biology');
    assert.equal(BANK_SUBJECT_MAP.agric.alocSlug, 'agric');
    assert.equal(BANK_SUBJECT_MAP.geog.alocSlug, 'geography');
    assert.equal(BANK_SUBJECT_MAP.econ.alocSlug, 'economics');
    assert.equal(BANK_SUBJECT_MAP.eng.alocSlug, 'english');
    assert.equal(BANK_SUBJECT_MAP.civic.alocSlug, 'civic-education');

    // Gemini-primary subjects without ALOC endpoints
    assert.equal(BANK_SUBJECT_MAP.fmaths.alocSlug, null);
    assert.equal(BANK_SUBJECT_MAP.digitech.alocSlug, null);
    assert.equal(BANK_SUBJECT_MAP.dataproc.alocSlug, null);

    // LaTeX flags
    assert.equal(BANK_SUBJECT_MAP.maths.requiresLatex, true);
    assert.equal(BANK_SUBJECT_MAP.fmaths.requiresLatex, true);
    assert.equal(BANK_SUBJECT_MAP.chem.requiresLatex, true);
    assert.equal(BANK_SUBJECT_MAP.phys.requiresLatex, true);
    assert.equal(BANK_SUBJECT_MAP.eng.requiresLatex, false);
  });

  it('deduplicates questions accurately by normalized question text across punctuation and case', () => {
    const q1: BankQuestion = {
      id: 'q1',
      subject: 'dataproc',
      examType: 'WAEC',
      year: 2024,
      topic: 'Normalization',
      question: 'Which normal form eliminates transitive dependencies?',
      options: { A: '1NF', B: '2NF', C: '3NF', D: 'UNF' },
      answer: 'C',
      explanation: '3NF removes transitive functional dependencies.',
      source: 'ai',
    };
    const q1Dup: BankQuestion = {
      ...q1,
      id: 'q1-duplicate',
      question: '  which NORMAL form   eliminates transitive dependencies?! ',
    };
    const q2: BankQuestion = {
      ...q1,
      id: 'q2',
      question: 'Which SQL clause filters grouped records?',
    };

    assert.equal(normalizeQuestionText(q1.question), normalizeQuestionText(q1Dup.question));
    assert.equal(computeQuestionHash('dataproc', q1.question), computeQuestionHash('dataproc', q1Dup.question));

    const existing = new Set<string>();
    const res1 = deduplicateBankQuestions([q1, q1Dup, q2], existing);
    assert.equal(res1.unique.length, 2);
    assert.equal(res1.duplicatesSkipped, 1);

    // Second pass with existing hashes populated skips all
    for (const u of res1.unique) existing.add(u.normHash!);
    const res2 = deduplicateBankQuestions([q1, q2], existing);
    assert.equal(res2.unique.length, 0);
    assert.equal(res2.duplicatesSkipped, 2);
  });

  it('normalizes ALOC v1 API question payloads and parses cursor envelopes', () => {
    const rawEnvelope = {
      status: 200,
      next_cursor: 'cur_9821',
      data: [
        {
          id: 4412,
          question: 'Calculate the molar mass of CaCO3 (Ca=40, C=12, O=16).',
          option: { a: '84 g/mol', b: '100 g/mol', c: '112 g/mol', d: '68 g/mol' },
          answer: 'b',
          solution: '40 + 12 + 3(16) = 100 g/mol.',
          examtype: 'utme',
          examyear: '2021',
          section: 'Stoichiometry',
        },
      ],
    };

    const env = parseAlocResponseEnvelope(rawEnvelope);
    assert.equal(env.nextCursor, 'cur_9821');
    assert.equal(env.items.length, 1);

    const normalized = normalizeAlocQuestion(env.items[0], 'chem', 'JAMB');
    assert.ok(normalized);
    assert.equal(normalized.subject, 'chem');
    assert.equal(normalized.examType, 'JAMB');
    assert.equal(normalized.year, 2021);
    assert.equal(normalized.answer, 'B');
    assert.equal(normalized.source, 'api');
    assert.equal(normalized.options.B, '100 g/mol');
  });

  it('validates JSON export/import round-trips and filters malformed records', () => {
    const sample: BankQuestion[] = [
      {
        id: 'ai-digitech-1',
        subject: 'digitech',
        examType: 'NECO',
        year: 2025,
        topic: 'Logic Gates',
        question: 'Which logic gate outputs 1 only when its two inputs differ?',
        options: { A: 'AND', B: 'OR', C: 'XOR', D: 'NAND' },
        answer: 'C',
        explanation: 'Exclusive OR (XOR) outputs HIGH only when inputs differ.',
        source: 'ai',
      },
    ];

    const exportedJson = serializeBankExport(sample);
    const parsed = JSON.parse(exportedJson);
    const validated = validateBankImportPayload({
      questions: [...parsed.questions, { bad: true }],
    });

    assert.equal(validated.ok, true);
    if (validated.ok) {
      assert.equal(validated.questions.length, 1);
      assert.equal(validated.invalidCount, 1);
      assert.equal(validated.questions[0].subject, 'digitech');
      assert.equal(validated.questions[0].answer, 'C');
    }

    const badPayload = validateBankImportPayload({ hello: 'world' });
    assert.equal(badPayload.ok, false);
  });

  it('computes exponential retry backoff and renders inline LaTeX cleanly', () => {
    assert.equal(computeRetryDelayMs(0), 2000);
    assert.equal(computeRetryDelayMs(1), 4000);
    assert.equal(computeRetryDelayMs(2), 8000);
    assert.equal(computeRetryDelayMs(6), 30000);

    const rendered = renderInlineLatexToHtml('Evaluate $\\frac{x^{2}+1}{\\sqrt{9}}$ for $x = 2$.');
    assert.ok(rendered.includes('class="fr"'));
    assert.ok(rendered.includes('class="m-rad"'));
    assert.ok(rendered.includes('<sup>2</sup>'));
    assert.ok(!rendered.includes('$'));
  });
});
