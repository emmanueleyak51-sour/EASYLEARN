/**
 * Pure, Zero-Dependency A4 Vector PDF 1.4 Generator (`%PDF-1.4`)
 *
 * Generates multi-page, crisp vector PDFs for EYAK Student Report Cards and
 * Subject Formula / Grammar Cheat Sheets without relying on `window.print()`,
 * so PDF export works reliably inside sandboxed iframes, mobile WebViews,
 * Android Chrome/PWAs, and completely offline.
 */

export interface ReportCardSubjectRow {
  name: string;
  lessonsDone: number;
  totalTopics: number;
  passed: number;
  avgMastery: number;
  waec: string;
}

export interface ReportCardPdfInput {
  studentName: string;
  issuedDate: string;
  predictedUtme: number;
  overallAvg: number;
  overallWaec: string;
  targetPct: number;
  accuracyPct: number;
  totalAnswered: number;
  bestCbt: number | null;
  cbtCount: number;
  mistakesCount: number;
  streakDays: number;
  enrolledCount: number;
  rows: ReportCardSubjectRow[];
}

export interface FormulaSheetPdfItem {
  name: string;
  expressionHtml: string;
  trapHtml: string;
}

export interface FormulaSheetPdfInput {
  subjectLabel: string;
  itemNounPlural?: string;
  issuedDate?: string;
  items: FormulaSheetPdfItem[];
}

const PAGE_W = 595.28; // A4 width in points
const PAGE_H = 841.89; // A4 height in points
const MARGIN_X = 36;
const CONTENT_W = PAGE_W - MARGIN_X * 2;

const SUPERSCRIPT_MAP: Record<string, string> = {
  '⁰': '^0',
  '¹': '\u00B9',
  '²': '\u00B2',
  '³': '\u00B3',
  '⁴': '^4',
  '⁵': '^5',
  '⁶': '^6',
  '⁷': '^7',
  '⁸': '^8',
  '⁹': '^9',
  '⁺': '^+',
  '⁻': '^-',
  '⁼': '^=',
  'ⁿ': '^n',
  'ⁱ': '^i',
};

const SUBSCRIPT_MAP: Record<string, string> = {
  '₀': '0',
  '₁': '1',
  '₂': '2',
  '₃': '3',
  '₄': '4',
  '₅': '5',
  '₆': '6',
  '₇': '7',
  '₈': '8',
  '₉': '9',
  '₊': '+',
  '₋': '-',
  '₌': '=',
  'ₐ': 'a',
  'ₑ': 'e',
  'ₒ': 'o',
  'ₓ': 'x',
  'ₙ': 'n',
};

const MATH_SYMBOL_MAP: Record<string, string> = {
  '₦': 'NGN ',
  '→': ' -> ',
  '←': ' <- ',
  '↔': ' <-> ',
  '⇌': ' <=> ',
  '⇒': ' => ',
  '⇔': ' <=> ',
  '↑': '(up)',
  '↓': '(down)',
  '≤': ' <= ',
  '≥': ' >= ',
  '≠': ' != ',
  '≈': ' ~= ',
  '≡': ' === ',
  '∝': ' prop. to ',
  '∞': 'inf',
  '√': 'sqrt',
  '∛': 'cbrt',
  '∑': 'sum',
  '∏': 'prod',
  '∫': 'integral ',
  '∂': 'd',
  '∆': 'Delta',
  'Δ': 'Delta',
  '∇': 'nabla',
  'α': 'alpha',
  'β': 'beta',
  'γ': 'gamma',
  'δ': 'delta',
  'ε': 'epsilon',
  'θ': 'theta',
  'λ': 'lambda',
  'μ': '\u00B5',
  'π': 'pi',
  'ρ': 'rho',
  'σ': 'sigma',
  'τ': 'tau',
  'φ': 'phi',
  'ω': 'omega',
  'Ω': 'Ohm',
  '−': '-',
  '–': '-',
  '—': ' - ',
  '‘': "'",
  '’': "'",
  '“': '"',
  '”': '"',
  '•': '\u00B7',
  '…': '...',
  '⋅': '\u00B7',
  '∙': '\u00B7',
  '∩': ' intersect ',
  '∪': ' union ',
  '∈': ' in ',
  '∉': ' not in ',
  '⊂': ' subset ',
  '⊆': ' subset= ',
  '∅': '{}',
  '∠': 'angle ',
  '⊥': ' perp ',
  '∥': ' || ',
  '∴': 'therefore ',
  '∵': 'because ',
};

const HTML_ENTITIES: Record<string, string> = {
  '&nbsp;': ' ',
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&apos;': "'",
  '&times;': '\u00D7',
  '&divide;': '\u00F7',
  '&plusmn;': '\u00B1',
  '&deg;': '\u00B0',
  '&middot;': '\u00B7',
  '&Delta;': 'Delta',
  '&pi;': 'pi',
  '&theta;': 'theta',
  '&lambda;': 'lambda',
  '&Omega;': 'Ohm',
  '&alpha;': 'alpha',
  '&beta;': 'beta',
  '&gamma;': 'gamma',
  '&mu;': '\u00B5',
  '&le;': '<=',
  '&ge;': '>=',
  '&ne;': '!=',
  '&approx;': '~=',
  '&rarr;': '->',
  '&harr;': '<->',
  '&infin;': 'inf',
  '&radic;': 'sqrt',
};

/**
 * Converts HTML/typeset math markup (including `.fr` stacked fractions,
 * `.m-rad` radicals, `<sup>`, `<sub>`, entities, and Unicode math glyphs)
 * into clean WinAnsi-compatible plain text suitable for standard PDF Type-1 fonts.
 */
export function htmlToPdfPlainText(input: string): string {
  if (!input) return '';
  let s = String(input);

  // 1. Convert explicit <sup>...</sup> and <sub>...</sub> first (innermost)
  s = s.replace(/<sup[^>]*>([\s\S]*?)<\/sup>/gi, (_m, inner: string) => {
    const clean = inner.replace(/<[^>]+>/g, '').trim();
    if (clean === '1') return '\u00B9';
    if (clean === '2') return '\u00B2';
    if (clean === '3') return '\u00B3';
    if (!clean) return '';
    return clean.length === 1 ? `^${clean}` : `^(${clean})`;
  });
  s = s.replace(/<sub[^>]*>([\s\S]*?)<\/sub>/gi, (_m, inner: string) => {
    const clean = inner.replace(/<[^>]+>/g, '').trim();
    return clean;
  });

  // 2. Convert vinculum radical spans: <span class="m-rad">...<span class="m-rad-body">x</span></span>
  s = s.replace(
    /<span[^>]*class="[^"]*\bm-rad\b[^"]*"[^>]*>(?:<sup[^>]*>([\s\S]*?)<\/sup>)?[\s\S]*?<span[^>]*class="[^"]*\bm-rad-body\b[^"]*"[^>]*>([\s\S]*?)<\/span>\s*<\/span>/gi,
    (_m, idx: string | undefined, body: string) => {
      const cleanBody = body.replace(/<[^>]+>/g, '').trim();
      const cleanIdx = (idx || '').replace(/<[^>]+>/g, '').trim();
      return cleanIdx ? `root${cleanIdx}(${cleanBody})` : `sqrt(${cleanBody})`;
    }
  );

  // 3. Convert stacked fraction spans: <span class="fr..."><span>num</span><span>den</span></span>
  let prev = '';
  while (s !== prev) {
    prev = s;
    s = s.replace(
      /<span[^>]*class="[^"]*\bfr\b[^"]*"[^>]*>\s*<span[^>]*>([\s\S]*?)<\/span>\s*<span[^>]*>([\s\S]*?)<\/span>\s*<\/span>/gi,
      (_m, num: string, den: string) => {
        const cleanNum = num.replace(/<[^>]+>/g, '').trim();
        const cleanDen = den.replace(/<[^>]+>/g, '').trim();
        const nWrap = cleanNum.length > 2 && /[+\-\u2212\u00B1\s]/.test(cleanNum) ? `(${cleanNum})` : cleanNum;
        const dWrap = cleanDen.length > 2 && /[+\-\u2212\u00B1\s*/]/.test(cleanDen) ? `(${cleanDen})` : cleanDen;
        return `${nWrap}/${dWrap}`;
      }
    );
  }

  // Preserve line breaks on <br> and block boundaries before stripping tags
  s = s.replace(/<br\s*\/?>/gi, ' ');
  s = s.replace(/<\/(p|div|li|tr)>/gi, ' ');
  s = s.replace(/<[^>]+>/g, '');

  // Decode named & numeric HTML entities
  s = s.replace(/&[a-zA-Z0-9#]+;/g, (ent) => {
    if (ent in HTML_ENTITIES) return HTML_ENTITIES[ent];
    const dec = /^&#(\d+);$/.exec(ent);
    if (dec) {
      const code = Number(dec[1]);
      if (Number.isFinite(code) && code > 0 && code <= 0x10ffff) {
        return String.fromCodePoint(code);
      }
    }
    const hex = /^&#x([0-9a-fA-F]+);$/.exec(ent);
    if (hex) {
      const code = parseInt(hex[1], 16);
      if (Number.isFinite(code) && code > 0 && code <= 0x10ffff) {
        return String.fromCodePoint(code);
      }
    }
    return ent;
  });

  // Normalize Unicode math, superscripts, subscripts, and keep WinAnsi Latin-1 range
  let out = '';
  for (const ch of s) {
    if (ch in SUPERSCRIPT_MAP) {
      out += SUPERSCRIPT_MAP[ch];
      continue;
    }
    if (ch in SUBSCRIPT_MAP) {
      out += SUBSCRIPT_MAP[ch];
      continue;
    }
    if (ch in MATH_SYMBOL_MAP) {
      out += MATH_SYMBOL_MAP[ch];
      continue;
    }
    const code = ch.codePointAt(0) || 32;
    if (code === 9 || code === 10 || code === 13) {
      out += ' ';
    } else if ((code >= 0x20 && code <= 0x7e) || (code >= 0xa0 && code <= 0xff)) {
      out += ch;
    } else {
      // Strip diacritics if possible (e.g. accented Latin characters)
      const decomposed = ch.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
      let pushed = false;
      for (const dc of decomposed) {
        const dCode = dc.codePointAt(0) || 0;
        if ((dCode >= 0x20 && dCode <= 0x7e) || (dCode >= 0xa0 && dCode <= 0xff)) {
          out += dc;
          pushed = true;
        }
      }
      if (!pushed) out += ' ';
    }
  }

  return out.replace(/\s+/g, ' ').trim();
}

/**
 * Escapes a WinAnsi-clean string into a pure 7-bit ASCII PDF literal string `(...)`.
 * Non-ASCII WinAnsi bytes (`0xA0..0xFF`) are emitted as 3-digit octal escapes `\ddd`
 * so the resulting PDF file is 100% 1-char-per-byte ASCII with exact `xref` offsets.
 */
function pdfLiteral(text: string): string {
  const clean = htmlToPdfPlainText(text);
  let out = '(';
  for (let i = 0; i < clean.length; i++) {
    const code = clean.charCodeAt(i);
    if (code === 0x28) {
      out += '\\(';
    } else if (code === 0x29) {
      out += '\\)';
    } else if (code === 0x5c) {
      out += '\\\\';
    } else if (code >= 0x20 && code <= 0x7e) {
      out += clean[i];
    } else if (code >= 0xa0 && code <= 0xff) {
      out += '\\' + code.toString(8).padStart(3, '0');
    }
  }
  out += ')';
  return out;
}

function estimateCharWidthFactor(ch: string, bold: boolean): number {
  if ('ilI.,:;\'|! '.includes(ch)) return bold ? 0.31 : 0.28;
  if ('()[]{}ftj-'.includes(ch)) return bold ? 0.36 : 0.33;
  if ('mwMW@%&'.includes(ch)) return bold ? 0.84 : 0.78;
  if (ch >= 'A' && ch <= 'Z') return bold ? 0.69 : 0.64;
  return bold ? 0.56 : 0.52;
}

export function measurePdfTextWidth(text: string, fontSize: number, bold = false): number {
  const clean = htmlToPdfPlainText(text);
  let sum = 0;
  for (let i = 0; i < clean.length; i++) {
    sum += estimateCharWidthFactor(clean[i], bold) * fontSize;
  }
  return sum;
}

export function wrapPdfText(
  rawText: string,
  maxWidthPt: number,
  fontSize: number,
  bold = false
): string[] {
  const clean = htmlToPdfPlainText(rawText);
  if (!clean) return [''];
  const words = clean.split(' ');
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    if (!word) continue;
    const candidate = current ? `${current} ${word}` : word;
    if (measurePdfTextWidth(candidate, fontSize, bold) <= maxWidthPt) {
      current = candidate;
      continue;
    }
    if (current) {
      lines.push(current);
      current = '';
    }
    // Break overly long token (e.g. dense unspaced equation) cleanly across lines
    if (measurePdfTextWidth(word, fontSize, bold) > maxWidthPt) {
      let chunk = '';
      for (const ch of word) {
        const nextChunk = chunk + ch;
        if (measurePdfTextWidth(nextChunk, fontSize, bold) > maxWidthPt && chunk) {
          lines.push(chunk);
          chunk = ch;
        } else {
          chunk = nextChunk;
        }
      }
      current = chunk;
    } else {
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines.length > 0 ? lines : [''];
}

function fmtNum(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/\.?0+$/, '');
}

type RgbTuple = [number, number, number];

class PdfPageCommands {
  private ops: string[] = [];

  private toPdfY(topY: number): number {
    return PAGE_H - topY;
  }

  fillRect(x: number, topY: number, w: number, h: number, rgb: RgbTuple): void {
    const y = this.toPdfY(topY + h);
    this.ops.push(
      `${fmtNum(rgb[0])} ${fmtNum(rgb[1])} ${fmtNum(rgb[2])} rg`,
      `${fmtNum(x)} ${fmtNum(y)} ${fmtNum(w)} ${fmtNum(h)} re f`
    );
  }

  strokeRect(
    x: number,
    topY: number,
    w: number,
    h: number,
    rgb: RgbTuple,
    lineWidth = 0.75
  ): void {
    const y = this.toPdfY(topY + h);
    this.ops.push(
      `${fmtNum(lineWidth)} w`,
      `${fmtNum(rgb[0])} ${fmtNum(rgb[1])} ${fmtNum(rgb[2])} RG`,
      `${fmtNum(x)} ${fmtNum(y)} ${fmtNum(w)} ${fmtNum(h)} re S`
    );
  }

  fillAndStrokeRect(
    x: number,
    topY: number,
    w: number,
    h: number,
    fillRgb: RgbTuple,
    strokeRgb: RgbTuple,
    lineWidth = 0.75
  ): void {
    const y = this.toPdfY(topY + h);
    this.ops.push(
      `${fmtNum(lineWidth)} w`,
      `${fmtNum(fillRgb[0])} ${fmtNum(fillRgb[1])} ${fmtNum(fillRgb[2])} rg`,
      `${fmtNum(strokeRgb[0])} ${fmtNum(strokeRgb[1])} ${fmtNum(strokeRgb[2])} RG`,
      `${fmtNum(x)} ${fmtNum(y)} ${fmtNum(w)} ${fmtNum(h)} re B`
    );
  }

  line(
    x1: number,
    topY1: number,
    x2: number,
    topY2: number,
    rgb: RgbTuple,
    lineWidth = 0.6
  ): void {
    this.ops.push(
      `${fmtNum(lineWidth)} w`,
      `${fmtNum(rgb[0])} ${fmtNum(rgb[1])} ${fmtNum(rgb[2])} RG`,
      `${fmtNum(x1)} ${fmtNum(this.toPdfY(topY1))} m ${fmtNum(x2)} ${fmtNum(this.toPdfY(topY2))} l S`
    );
  }

  text(
    str: string,
    x: number,
    baselineTopY: number,
    opts: {
      font?: 'F1' | 'F2' | 'F3';
      size?: number;
      color?: RgbTuple;
      align?: 'left' | 'right' | 'center';
    } = {}
  ): void {
    const font = opts.font || 'F1';
    const size = opts.size || 10;
    const color = opts.color || [0.09, 0.08, 0.16];
    let drawX = x;
    if (opts.align === 'right' || opts.align === 'center') {
      const w = measurePdfTextWidth(str, size, font === 'F2');
      drawX = opts.align === 'right' ? x - w : x - w / 2;
    }
    const y = this.toPdfY(baselineTopY);
    this.ops.push(
      'BT',
      `/${font} ${fmtNum(size)} Tf`,
      `${fmtNum(color[0])} ${fmtNum(color[1])} ${fmtNum(color[2])} rg`,
      `1 0 0 1 ${fmtNum(drawX)} ${fmtNum(y)} Tm`,
      `${pdfLiteral(str)} Tj`,
      'ET'
    );
  }

  buildStream(): string {
    return this.ops.join('\n');
  }
}

function compilePdfDocument(pages: PdfPageCommands[], docTitle: string): Uint8Array {
  // Object IDs:
  // 1: Catalog
  // 2: Pages
  // 3: Font F1 (Helvetica)
  // 4: Font F2 (Helvetica-Bold)
  // 5: Font F3 (Courier)
  // 6: Info dictionary
  // For each page i (0..N-1):
  //   pageObjId = 7 + i * 2
  //   contentObjId = 8 + i * 2
  const totalObjects = 6 + pages.length * 2;
  const objects: string[] = new Array(totalObjects + 1).fill('');

  const kidsRefs = pages.map((_p, idx) => `${7 + idx * 2} 0 R`).join(' ');

  objects[1] = `<< /Type /Catalog /Pages 2 0 R >>`;
  objects[2] = `<< /Type /Pages /Kids [ ${kidsRefs} ] /Count ${pages.length} >>`;
  objects[3] = `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>`;
  objects[4] = `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>`;
  objects[5] = `<< /Type /Font /Subtype /Type1 /BaseFont /Courier /Encoding /WinAnsiEncoding >>`;
  objects[6] = `<< /Title ${pdfLiteral(docTitle)} /Creator (EYAK Road to Campus) /Producer (EYAK Vector PDF Engine) >>`;

  pages.forEach((page, idx) => {
    const pageObjId = 7 + idx * 2;
    const contentObjId = 8 + idx * 2;
    const stream = page.buildStream();
    objects[pageObjId] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [ 0 0 ${fmtNum(PAGE_W)} ${fmtNum(PAGE_H)} ] ` +
      `/Resources << /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R >> >> /Contents ${contentObjId} 0 R >>`;
    objects[contentObjId] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
  });

  const chunks: string[] = ['%PDF-1.4\n'];
  let byteOffset = chunks[0].length;
  const offsets: number[] = new Array(totalObjects + 1).fill(0);

  for (let id = 1; id <= totalObjects; id++) {
    offsets[id] = byteOffset;
    const block = `${id} 0 obj\n${objects[id]}\nendobj\n`;
    chunks.push(block);
    byteOffset += block.length;
  }

  const xrefOffset = byteOffset;
  chunks.push(`xref\n0 ${totalObjects + 1}\n`);
  chunks.push('0000000000 65535 f \n');
  for (let id = 1; id <= totalObjects; id++) {
    chunks.push(`${String(offsets[id]).padStart(10, '0')} 00000 n \n`);
  }
  chunks.push(
    `trailer\n<< /Size ${totalObjects + 1} /Root 1 0 R /Info 6 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`
  );

  const fullAscii = chunks.join('');
  const bytes = new Uint8Array(fullAscii.length);
  for (let i = 0; i < fullAscii.length; i++) {
    bytes[i] = fullAscii.charCodeAt(i) & 0x7f;
  }
  return bytes;
}

const COL_BRAND: RgbTuple = [0.357, 0.169, 0.839]; // #5B2BD6
const COL_BRAND_DEEP: RgbTuple = [0.18, 0.11, 0.39]; // #2E1C63
const COL_GOLD_BADGE: RgbTuple = [1, 0.88, 0.4]; // #FFE066
const COL_INK: RgbTuple = [0.09, 0.08, 0.16]; // #171429
const COL_DIM: RgbTuple = [0.37, 0.35, 0.46]; // #5E5975
const COL_LINE: RgbTuple = [0.85, 0.83, 0.92]; // #D9D4EB
const COL_SOFT: RgbTuple = [0.965, 0.957, 0.992]; // #F6F4FD
const COL_MINT_BG: RgbTuple = [0.91, 0.98, 0.94];
const COL_SKY_BG: RgbTuple = [0.91, 0.96, 0.995];
const COL_PEACH_BG: RgbTuple = [0.995, 0.95, 0.91];
const COL_GREEN: RgbTuple = [0.05, 0.52, 0.34];
const COL_TRAP_BG: RgbTuple = [0.996, 0.968, 0.92];
const COL_TRAP_INK: RgbTuple = [0.48, 0.25, 0.04];

function drawPageFooter(
  page: PdfPageCommands,
  leftNote: string,
  pageNum: number,
  totalPages: number
): void {
  const footerY = PAGE_H - 28;
  page.line(MARGIN_X, footerY - 11, PAGE_W - MARGIN_X, footerY - 11, COL_LINE, 0.6);
  page.text(leftNote, MARGIN_X, footerY, { font: 'F1', size: 8.5, color: COL_DIM });
  page.text(`Page ${pageNum} of ${totalPages}`, PAGE_W - MARGIN_X, footerY, {
    font: 'F2',
    size: 8.5,
    color: COL_DIM,
    align: 'right',
  });
}

/**
 * Builds a multi-page A4 vector PDF for the Student Report Card (`TranscriptScreen`).
 */
export function buildStudentReportCardPdf(data: ReportCardPdfInput): Uint8Array {
  const pages: PdfPageCommands[] = [];
  let page = new PdfPageCommands();
  pages.push(page);

  // Header Banner
  page.fillRect(MARGIN_X, 32, CONTENT_W, 66, COL_BRAND_DEEP);
  page.fillRect(MARGIN_X, 32, 6, 66, COL_GOLD_BADGE);
  page.text('EYAK · ROAD TO CAMPUS PROGRESS REPORT', MARGIN_X + 18, 50, {
    font: 'F2',
    size: 8.5,
    color: COL_GOLD_BADGE,
  });
  page.text('Student Report Card', MARGIN_X + 18, 70, {
    font: 'F2',
    size: 19,
    color: [1, 1, 1],
  });
  page.text(
    `Student: ${data.studentName || 'Student'}  ·  Issued: ${data.issuedDate}`,
    MARGIN_X + 18,
    86,
    {
      font: 'F1',
      size: 9.5,
      color: [0.9, 0.88, 0.98],
    }
  );

  // Right-aligned Predicted JAMB Score Box inside Banner
  page.text('ESTIMATED JAMB SCORE', PAGE_W - MARGIN_X - 16, 50, {
    font: 'F2',
    size: 8,
    color: [0.9, 0.88, 0.98],
    align: 'right',
  });
  page.text(`${data.predictedUtme} / 400`, PAGE_W - MARGIN_X - 16, 71, {
    font: 'F2',
    size: 18,
    color: COL_GOLD_BADGE,
    align: 'right',
  });
  page.text(`WAEC Grade: ${data.overallWaec}`, PAGE_W - MARGIN_X - 16, 86, {
    font: 'F2',
    size: 9.5,
    color: [0.68, 0.96, 0.82],
    align: 'right',
  });

  // 4 KPI Cards
  const kpiTop = 110;
  const kpiGap = 8;
  const kpiW = (CONTENT_W - kpiGap * 3) / 4;
  const kpiH = 52;
  const kpis: Array<{ label: string; value: string; sub: string; bg: RgbTuple }> = [
    {
      label: 'Average Mastery',
      value: `${data.overallAvg}%`,
      sub: `Target: ${data.targetPct}%`,
      bg: COL_MINT_BG,
    },
    {
      label: 'Accuracy',
      value: `${data.accuracyPct}%`,
      sub: `${data.totalAnswered} answered`,
      bg: COL_SKY_BG,
    },
    {
      label: 'Mock Exams',
      value: data.bestCbt !== null ? `${data.bestCbt}/400` : `${data.cbtCount} taken`,
      sub: `${data.cbtCount} timed papers`,
      bg: COL_PEACH_BG,
    },
    {
      label: 'Mistakes to Fix',
      value: `${data.mistakesCount}`,
      sub: data.mistakesCount === 0 ? 'All mistakes cleared' : 'Ready to practise',
      bg: COL_SOFT,
    },
  ];

  kpis.forEach((k, idx) => {
    const kx = MARGIN_X + idx * (kpiW + kpiGap);
    page.fillAndStrokeRect(kx, kpiTop, kpiW, kpiH, k.bg, COL_LINE, 0.7);
    page.text(k.label, kx + 10, kpiTop + 15, { font: 'F2', size: 8.5, color: COL_DIM });
    page.text(k.value, kx + 10, kpiTop + 34, { font: 'F2', size: 15, color: COL_INK });
    page.text(k.sub, kx + 10, kpiTop + 46, { font: 'F1', size: 8, color: COL_DIM });
  });

  // Section Title
  let cursorY = 180;
  page.text('Progress by Subject', MARGIN_X, cursorY, {
    font: 'F2',
    size: 12.5,
    color: COL_INK,
  });
  page.text(
    `Streak: ${data.streakDays} days  ·  Enrolled subjects: ${data.enrolledCount}`,
    PAGE_W - MARGIN_X,
    cursorY,
    {
      font: 'F1',
      size: 9,
      color: COL_DIM,
      align: 'right',
    }
  );
  cursorY += 10;

  const drawTableHeader = (p: PdfPageCommands, topY: number): number => {
    p.fillAndStrokeRect(MARGIN_X, topY, CONTENT_W, 22, COL_SOFT, COL_LINE, 0.7);
    p.text('Subject', MARGIN_X + 10, topY + 14.5, { font: 'F2', size: 8.8, color: COL_DIM });
    p.text('Lessons', MARGIN_X + 225, topY + 14.5, { font: 'F2', size: 8.8, color: COL_DIM });
    p.text('Topics Passed', MARGIN_X + 295, topY + 14.5, {
      font: 'F2',
      size: 8.8,
      color: COL_DIM,
    });
    p.text('Mastery Score', MARGIN_X + 385, topY + 14.5, {
      font: 'F2',
      size: 8.8,
      color: COL_DIM,
    });
    p.text('Grade', PAGE_W - MARGIN_X - 10, topY + 14.5, {
      font: 'F2',
      size: 8.8,
      color: COL_DIM,
      align: 'right',
    });
    return topY + 22;
  };

  cursorY = drawTableHeader(page, cursorY);
  const rowH = 19.5;
  const maxY = PAGE_H - 52;

  data.rows.forEach((row, idx) => {
    if (cursorY + rowH > maxY) {
      page = new PdfPageCommands();
      pages.push(page);
      page.text(
        `EYAK Student Report Card — ${data.studentName || 'Student'} (continued)`,
        MARGIN_X,
        36,
        { font: 'F2', size: 10.5, color: COL_BRAND_DEEP }
      );
      cursorY = drawTableHeader(page, 46);
    }

    if (idx % 2 === 1) {
      page.fillRect(MARGIN_X, cursorY, CONTENT_W, rowH, [0.985, 0.982, 0.996]);
    }
    page.line(MARGIN_X, cursorY + rowH, PAGE_W - MARGIN_X, cursorY + rowH, COL_LINE, 0.45);

    const textY = cursorY + 13;
    const subjLabel =
      measurePdfTextWidth(row.name, 9.2, true) > 205
        ? wrapPdfText(row.name, 205, 9.2, true)[0]
        : row.name;
    page.text(subjLabel, MARGIN_X + 10, textY, { font: 'F2', size: 9.2, color: COL_INK });
    page.text(`${row.lessonsDone}/${row.totalTopics}`, MARGIN_X + 225, textY, {
      font: 'F3',
      size: 8.8,
      color: COL_DIM,
    });
    page.text(`${row.passed}/${row.totalTopics}`, MARGIN_X + 295, textY, {
      font: 'F3',
      size: 8.8,
      color: COL_DIM,
    });

    // Mini vector progress bar
    const barX = MARGIN_X + 385;
    const barW = 54;
    const barH = 5.5;
    const barTop = cursorY + 7;
    page.fillRect(barX, barTop, barW, barH, [0.9, 0.88, 0.95]);
    const pctClamped = Math.min(100, Math.max(0, row.avgMastery));
    if (pctClamped > 0) {
      page.fillRect(
        barX,
        barTop,
        Math.max(2, (barW * pctClamped) / 100),
        barH,
        pctClamped >= 70 ? COL_GREEN : COL_BRAND
      );
    }
    page.text(`${pctClamped}%`, barX + barW + 6, textY, {
      font: 'F2',
      size: 8.8,
      color: COL_INK,
    });

    page.text(row.waec, PAGE_W - MARGIN_X - 10, textY, {
      font: 'F2',
      size: 9.2,
      color: COL_BRAND,
      align: 'right',
    });

    cursorY += rowH;
  });

  const footerNote = `Prepared on EYAK (Road to Campus) · ${data.studentName || 'Student'} · ${data.issuedDate}`;
  pages.forEach((p, idx) => drawPageFooter(p, footerNote, idx + 1, pages.length));

  return compilePdfDocument(
    pages,
    `EYAK Report Card - ${data.studentName || 'Student'}`
  );
}

/**
 * Builds a clean, paginated 2-column A4 vector PDF for any Subject Formula or
 * Grammar Rules sheet (`TranscriptScreen` Cheat Sheet & `ChemFormulasScreen`).
 */
export function buildFormulaSheetPdf(data: FormulaSheetPdfInput): Uint8Array {
  const noun = data.itemNounPlural || 'Formulas & Exam Traps';
  const dateStr =
    data.issuedDate ||
    new Date().toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'Africa/Lagos',
    });

  const pages: PdfPageCommands[] = [];
  let page = new PdfPageCommands();
  pages.push(page);

  // Page 1 Header Banner
  page.fillRect(MARGIN_X, 30, CONTENT_W, 54, COL_BRAND_DEEP);
  page.fillRect(MARGIN_X, 30, 6, 54, COL_GOLD_BADGE);
  page.text('EYAK · JAMB UTME & WAEC QUICK REVISION SHEET', MARGIN_X + 16, 47, {
    font: 'F2',
    size: 8.2,
    color: COL_GOLD_BADGE,
  });
  page.text(`${data.subjectLabel} — ${noun}`, MARGIN_X + 16, 67, {
    font: 'F2',
    size: 16.5,
    color: [1, 1, 1],
  });
  page.text(`${data.items.length} items`, PAGE_W - MARGIN_X - 14, 65, {
    font: 'F2',
    size: 11,
    color: COL_GOLD_BADGE,
    align: 'right',
  });

  const colGap = 10;
  const colW = (CONTENT_W - colGap) / 2;
  const innerPad = 8;
  const textMaxW = colW - innerPad * 2;
  const maxBottomY = PAGE_H - 48;

  // Pre-measure every formula card
  const measured = data.items.map((item, idx) => {
    const titleLines = wrapPdfText(`${idx + 1}. ${item.name}`, textMaxW, 9.5, true);
    const exprLines = wrapPdfText(item.expressionHtml, textMaxW - 8, 9.2, true);
    const trapLines = wrapPdfText(`Trap: ${item.trapHtml}`, textMaxW, 8.2, false);
    const titleBlockH = titleLines.length * 11.5;
    const exprBoxH = exprLines.length * 11.5 + 7;
    const trapBlockH = trapLines.length * 10.2;
    const totalH = innerPad + titleBlockH + 4 + exprBoxH + 5 + trapBlockH + innerPad;
    return {
      titleLines,
      exprLines,
      trapLines,
      exprBoxH,
      totalH,
    };
  });

  // Render cards in paired 2-column rows so reading order (1, 2 / 3, 4) stays clean
  let cursorY = 96;
  for (let i = 0; i < measured.length; i += 2) {
    const leftCard = measured[i];
    const rightCard = measured[i + 1];
    const rowH = rightCard ? Math.max(leftCard.totalH, rightCard.totalH) : leftCard.totalH;

    if (cursorY + rowH > maxBottomY) {
      page = new PdfPageCommands();
      pages.push(page);
      page.text(
        `EYAK · ${data.subjectLabel} — ${noun} (continued)`,
        MARGIN_X,
        36,
        { font: 'F2', size: 10, color: COL_BRAND_DEEP }
      );
      page.line(MARGIN_X, 42, PAGE_W - MARGIN_X, 42, COL_LINE, 0.6);
      cursorY = 52;
    }

    const rowCards = rightCard ? [leftCard, rightCard] : [leftCard];
    rowCards.forEach((card, colIdx) => {
      const cx = MARGIN_X + colIdx * (colW + colGap);
      page.fillAndStrokeRect(cx, cursorY, colW, rowH, [1, 1, 1], COL_LINE, 0.7);

      let y = cursorY + innerPad + 8.5;
      for (const tl of card.titleLines) {
        page.text(tl, cx + innerPad, y, { font: 'F2', size: 9.5, color: COL_INK });
        y += 11.5;
      }

      const eqTop = y - 6.5;
      page.fillAndStrokeRect(
        cx + innerPad,
        eqTop,
        textMaxW,
        card.exprBoxH,
        COL_SOFT,
        [0.82, 0.78, 0.95],
        0.55
      );
      let eqTextY = eqTop + 10.5;
      for (const el of card.exprLines) {
        page.text(el, cx + innerPad + 5, eqTextY, {
          font: 'F2',
          size: 9.2,
          color: COL_BRAND,
        });
        eqTextY += 11.5;
      }

      y = eqTop + card.exprBoxH + 10.5;
      const trapBoxTop = eqTop + card.exprBoxH + 3;
      const trapBoxH = card.trapLines.length * 10.2 + 4;
      page.fillRect(cx + innerPad, trapBoxTop, textMaxW, trapBoxH, COL_TRAP_BG);
      for (const trl of card.trapLines) {
        page.text(trl, cx + innerPad + 4, y, {
          font: 'F1',
          size: 8.2,
          color: COL_TRAP_INK,
        });
        y += 10.2;
      }
    });

    cursorY += rowH + 8;
  }

  const footerNote = `EYAK (Road to Campus) · ${data.subjectLabel} Revision Sheet · ${dateStr}`;
  pages.forEach((p, idx) => drawPageFooter(p, footerNote, idx + 1, pages.length));

  return compilePdfDocument(pages, `EYAK ${data.subjectLabel} Revision Sheet`);
}

export function sanitizePdfFilename(raw: string): string {
  const base = raw
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  const clean = base || 'eyak-document';
  return clean.toLowerCase().endsWith('.pdf') ? clean : `${clean}.pdf`;
}

/**
 * Triggers a direct browser file download of `bytes` as `application/pdf`
 * without calling `window.open` or `window.print()`.
 */
export function downloadPdfBytes(bytes: Uint8Array, filename: string): void {
  if (typeof document === 'undefined' || typeof URL === 'undefined') return;
  const safeName = sanitizePdfFilename(filename);
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  const blob = new Blob([copy], { type: 'application/pdf' });
  const blobUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = blobUrl;
  anchor.download = safeName;
  anchor.rel = 'noopener';
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
  }, 15_000);
}
