import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildFormulaSheetPdf,
  buildStudentReportCardPdf,
  htmlToPdfPlainText,
  sanitizePdfFilename,
} from './pdfExport';

function decodeAscii(bytes: Uint8Array): string {
  return new TextDecoder('ascii').decode(bytes);
}

function assertValidPdfStructure(bytes: Uint8Array): string {
  assert.ok(bytes.byteLength > 800, 'PDF byte payload should be non-trivial');
  const text = decodeAscii(bytes);
  assert.equal(text.startsWith('%PDF-1.4\n'), true, 'PDF must start with %PDF-1.4 header');
  assert.equal(text.trimEnd().endsWith('%%EOF'), true, 'PDF must end with %%EOF trailer');

  // Verify startxref points to exact byte offset of `xref\n`
  const startxrefMatch = /startxref\n(\d+)\n%%EOF/.exec(text);
  assert.ok(startxrefMatch, 'PDF must contain startxref offset');
  const xrefPos = Number(startxrefMatch[1]);
  assert.equal(
    text.slice(xrefPos, xrefPos + 5),
    'xref\n',
    'startxref byte offset must point directly at xref table'
  );
  return text;
}

test('htmlToPdfPlainText converts stacked fractions, radicals, superscripts, and Naira cleanly', () => {
  const html =
    'x = <span class="fr"><span>−b ± <span class="m-rad"><span class="m-rad-surd">√</span><span class="m-rad-body">b<sup>2</sup> − 4ac</span></span></span><span>2a</span></span> · Cost = ₦4,500 · A ⇌ B';
  const plain = htmlToPdfPlainText(html);
  assert.equal(plain.includes('(-b \u00B1 sqrt(b\u00B2 - 4ac))/2a'), true);
  assert.equal(plain.includes('NGN 4,500'), true);
  assert.equal(plain.includes('<=>'), true);
  assert.equal(plain.includes('<span'), false);
});

test('buildStudentReportCardPdf builds multi-page valid PDF 1.4 with exact xref offsets', () => {
  const rows = Array.from({ length: 49 }, (_, i) => ({
    name: `Subject ${i + 1}`,
    lessonsDone: (i % 8) + 1,
    totalTopics: 12,
    passed: i % 6,
    avgMastery: (i * 7) % 100,
    waec: i % 2 === 0 ? 'A1' : 'B2',
  }));

  const bytes = buildStudentReportCardPdf({
    studentName: 'Adaeze Okafor',
    issuedDate: '21 November 2026',
    predictedUtme: 316,
    overallAvg: 79,
    overallWaec: 'A1',
    targetPct: 85,
    accuracyPct: 84,
    totalAnswered: 240,
    bestCbt: 328,
    cbtCount: 4,
    mistakesCount: 3,
    streakDays: 12,
    enrolledCount: 4,
    rows,
  });

  const pdfText = assertValidPdfStructure(bytes);
  assert.equal(pdfText.includes('Student Report Card'), true);
  assert.equal(pdfText.includes('Adaeze Okafor'), true);
  assert.equal(pdfText.includes('316 / 400'), true);
  assert.equal(pdfText.includes('/Count 2'), true, '49 subjects should paginate across 2 A4 pages');
});

test('buildFormulaSheetPdf paginates formula cards cleanly with valid PDF structure', () => {
  const items = Array.from({ length: 24 }, (_, i) => ({
    name: `Law ${i + 1} (Boyle & Charles)`,
    expressionHtml: 'P<sub>1</sub>V<sub>1</sub> = P<sub>2</sub>V<sub>2</sub>',
    trapHtml: 'Always convert °C to Kelvin (K = °C + 273) before dividing!',
  }));

  const bytes = buildFormulaSheetPdf({
    subjectLabel: 'Chemistry',
    itemNounPlural: 'Formulas and Traps',
    issuedDate: '21 Nov 2026',
    items,
  });

  const pdfText = assertValidPdfStructure(bytes);
  assert.equal(pdfText.includes('Chemistry'), true);
  assert.equal(pdfText.includes('P1V1 = P2V2'), true);
  assert.equal(pdfText.includes('Page 1 of'), true);
});

test('sanitizePdfFilename produces safe lowercase-extension filenames', () => {
  assert.equal(
    sanitizePdfFilename('EYAK Report Card — Emmanuel / 2026'),
    'EYAK-Report-Card-Emmanuel-2026.pdf'
  );
  assert.equal(sanitizePdfFilename('chemistry-sheet.PDF'), 'chemistry-sheet.PDF');
});
