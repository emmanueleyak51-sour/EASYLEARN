import type { SubjectId } from '../types';
import { sanitizeEducationalHtml } from './securityPolicy';

const PROSE_SLASH_WORDS = new Set([
  'and',
  'or',
  'yes',
  'no',
  'true',
  'false',
  'he',
  'she',
  'his',
  'her',
  'him',
  'in',
  'on',
  'to',
  'from',
  'up',
  'down',
  'left',
  'right',
  'input',
  'output',
  'profit',
  'loss',
  'buy',
  'sell',
  'buyer',
  'seller',
  'goods',
  'services',
  'demand',
  'supply',
  'exports',
  'imports',
  'export',
  'import',
  'urban',
  'rural',
  'formal',
  'informal',
  'semi-formal',
  'active',
  'passive',
  'direct',
  'indirect',
  'singular',
  'plural',
  'subject',
  'object',
  'phrase',
  'clause',
  'acid',
  'base',
  'alkali',
  'anode',
  'cathode',
  'oxidation',
  'reduction',
  'xylem',
  'phloem',
  'mitosis',
  'meiosis',
  'aerobic',
  'anaerobic',
  'flora',
  'fauna',
  'biotic',
  'abiotic',
  'genotype',
  'phenotype',
  'male',
  'female',
  'day',
  'night',
  'wet',
  'dry',
  'hot',
  'cold',
  'light',
  'dark',
  'series',
  'parallel',
  'real',
  'virtual',
  'sachet',
  'bottled',
  'food',
  'cash',
  'pre',
  'post',
  'either',
  'neither',
]);

const UNICODE_SUBS: Record<string, string> = {
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
  '₋': '−',
  '₌': '=',
  'ₐ': 'a',
  'ₑ': 'e',
  'ₒ': 'o',
  'ₓ': 'x',
  'ₙ': 'n',
  'ₘ': 'm',
  'ₖ': 'k',
  'ₚ': 'p',
  'ₛ': 's',
  'ₜ': 't',
  'ᵣ': 'r',
};

const UNICODE_SUPS: Record<string, string> = {
  '⁰': '0',
  '¹': '1',
  '²': '2',
  '³': '3',
  '⁴': '4',
  '⁵': '5',
  '⁶': '6',
  '⁷': '7',
  '⁸': '8',
  '⁹': '9',
  '⁺': '+',
  '⁻': '−',
  '⁼': '=',
  'ⁿ': 'n',
};

const VULGAR_FRACTIONS: Record<string, [string, string]> = {
  '½': ['1', '2'],
  '⅓': ['1', '3'],
  '⅔': ['2', '3'],
  '¼': ['1', '4'],
  '¾': ['3', '4'],
  '⅕': ['1', '5'],
  '⅖': ['2', '5'],
  '⅗': ['3', '5'],
  '⅘': ['4', '5'],
  '⅙': ['1', '6'],
  '⅚': ['5', '6'],
  '⅛': ['1', '8'],
  '⅜': ['3', '8'],
  '⅝': ['5', '8'],
  '⅞': ['7', '8'],
};

const UPRIGHT_FUNCS = new Set([
  'sin',
  'cos',
  'tan',
  'sec',
  'csc',
  'cosec',
  'cot',
  'log',
  'ln',
  'lim',
  'max',
  'min',
  'det',
  'mod',
]);

/**
 * Protects existing complex HTML math blocks (.fr, .m-rad, .mx, .dt, svg) with placeholders
 * so we never double-wrap already typeset markup.
 */
function protectBlocks(html: string): {
  masked: string;
  restore: (s: string) => string;
} {
  const vault: string[] = [];
  const stash = (fragment: string): string => {
    const id = `\uE000M${vault.length}M\uE001`;
    vault.push(fragment);
    return id;
  };

  let s = html;

  // Protect existing <code>...</code> blocks so SQL/Excel identifiers (Student_ID, $A$1, A/B) are never altered
  s = s.replace(/<code\b[^>]*>[\s\S]*?<\/code>/g, (m) => stash(m));

  // Protect existing stacked fractions, radicals, matrices, determinants
  s = s.replace(
    /<span\s+class="(?:fr|m-rad|mx|dt)[^"]*">[\s\S]*?<\/span>\s*<\/span>(?:\s*<\/span>)?/g,
    (m) => stash(m)
  );

  // Protect HTML opening/closing tags so attribute slashes/underscores are never altered
  s = s.replace(/<\/?[a-zA-Z][^>]*>/g, (tag) => stash(tag));

  const restore = (input: string): string => {
    let out = input;
    // Restore iteratively in case placeholders were nested inside newly created spans
    for (let pass = 0; pass < 4; pass++) {
      if (!out.includes('\uE000M')) break;
      out = out.replace(/\uE000M(\d+)M\uE001/g, (_, idx) => vault[Number(idx)] ?? '');
    }
    return out;
  };

  return { masked: s, restore };
}

function convertUnicodeScriptsAndVulgarFractions(text: string): string {
  let s = text;

  // Convert vulgar fractions (½, ¾, ⅔...) to vertical .fr spans
  s = s.replace(/[½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]/g, (ch) => {
    const pair = VULGAR_FRACTIONS[ch];
    if (!pair) return ch;
    return `<span class="fr fr-sm"><span>${pair[0]}</span><span>${pair[1]}</span></span>`;
  });

  // Convert contiguous runs of Unicode subscripts into <sub>...</sub>
  s = s.replace(/[₀₁₂₃₄₅₆₇₈₉₊₋₌ₐₑₒₓₙₘₖₚₛₜᵣ]+/g, (run) => {
    const mapped = Array.from(run)
      .map((c) => UNICODE_SUBS[c] ?? c)
      .join('');
    return `<sub>${mapped}</sub>`;
  });

  // Convert contiguous runs of Unicode superscripts into <sup>...</sup>
  s = s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼ⁿ]+/g, (run) => {
    const mapped = Array.from(run)
      .map((c) => UNICODE_SUPS[c] ?? c)
      .join('');
    return `<sup>${mapped}</sup>`;
  });

  return s;
}

function convertAsciiSubSup(text: string): string {
  let s = text;

  // Brace subscripts: X_{total} -> X<sub>total</sub>
  s = s.replace(/([A-Za-z0-9α-ωΑ-ΩΔθλμρσπ°)|\]])_\{([^}]+)\}/g, '$1<sub>$2</sub>');

  // Simple math/physics/econ subscripts: W_air, R_max, γ_real, Q_d, P_1, V_cm3
  s = s.replace(
    /\b([A-Za-zα-ωΑ-ΩΔθλμρσπ]{1,4})_([A-Za-z0-9+-]{1,8})\b/g,
    (_, base: string, sub: string) => `${base}<sub>${sub}</sub>`
  );

  // Brace superscripts: x^{2n-1} -> x<sup>2n−1</sup>
  s = s.replace(/([A-Za-z0-9α-ωΑ-Ω)|\]])\^\{([^}]+)\}/g, (_, base: string, sup: string) => {
    return `${base}<sup>${sup.replace(/-/g, '−')}</sup>`;
  });

  // Parenthesized fractional/algebraic superscripts: a^(2/3), (1 + r)^n, 10^(-6)
  s = s.replace(
    /([A-Za-z0-9α-ωΑ-Ω)|\]])\^\(([^()]{1,12})\)/g,
    (_, base: string, sup: string) => `${base}<sup>${sup.replace(/-/g, '−')}</sup>`
  );

  // Simple caret superscripts: x^2, 10^-3, r^n
  s = s.replace(
    /([A-Za-z0-9α-ωΑ-Ω)|\]])\^([+-]?[A-Za-z0-9]{1,4})\b/g,
    (_, base: string, sup: string) => `${base}<sup>${sup.replace(/-/g, '−')}</sup>`
  );

  return s;
}

/**
 * Converts √(...) and ∛(...) with balanced parentheses, plus simple √token radicals,
 * into true overbar radicals: <span class="m-rad"><span class="m-rad-surd">√</span><span class="m-rad-body">...</span></span>
 */
function convertRadicals(html: string): string {
  let s = html;

  // 1. Handle nth-root prefix like ³√(...) or ⁴√(...) or plain √(...) / ∛(...) / ∜(...)
  const radOpenRe = /(?:<sup>([2345n])<\/sup>)?([√∛∜])\s*([([[])/g;
  let match: RegExpExecArray | null;
  let cursor = 0;
  let built = '';

  while ((match = radOpenRe.exec(s)) !== null) {
    const start = match.index;
    if (start < cursor) continue;
    const indexSup = match[1] || (match[2] === '∛' ? '3' : match[2] === '∜' ? '4' : '');
    const openBracket = match[3];
    const closeBracket = openBracket === '(' ? ')' : ']';
    const bodyStart = start + match[0].length;

    // Scan forward for balanced bracket (ignoring HTML tags)
    let depth = 1;
    let i = bodyStart;
    while (i < s.length && depth > 0) {
      if (s[i] === '<') {
        const closeTag = s.indexOf('>', i);
        if (closeTag === -1) break;
        i = closeTag + 1;
        continue;
      }
      if (s[i] === openBracket) depth++;
      else if (s[i] === closeBracket) depth--;
      i++;
    }

    if (depth === 0) {
      const inner = s.slice(bodyStart, i - 1);
      built += s.slice(cursor, start);
      const idxMarkup = indexSup ? `<sup class="m-rad-idx">${indexSup}</sup>` : '';
      built += `<span class="m-rad">${idxMarkup}<span class="m-rad-surd" aria-hidden="true">√</span><span class="m-rad-body">${inner}</span></span>`;
      cursor = i;
      radOpenRe.lastIndex = cursor;
    }
  }
  built += s.slice(cursor);
  s = built;

  // 2. Simple unparenthesized radicals: √3, √2gR, √x², ³√27
  s = s.replace(
    /(?:<sup>([2345n])<\/sup>)?([√∛∜])([A-Za-z0-9α-ωΑ-ΩΔθλμρσπ]+(?:<(?:sub|sup)[^>]*>[^<]+<\/(?:sub|sup)>)*)/g,
    (_, supIdx: string | undefined, sym: string, body: string) => {
      const indexSup = supIdx || (sym === '∛' ? '3' : sym === '∜' ? '4' : '');
      const idxMarkup = indexSup ? `<sup class="m-rad-idx">${indexSup}</sup>` : '';
      return `<span class="m-rad">${idxMarkup}<span class="m-rad-surd" aria-hidden="true">√</span><span class="m-rad-body">${body}</span></span>`;
    }
  );

  return s;
}

function isLikelyMathOperand(raw: string): boolean {
  const clean = raw
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z]+;/gi, '')
    .trim();
  if (!clean || clean.length > 42) return false;

  // Reject pure multi-letter prose words in PROSE_SLASH_WORDS (e.g. "and", "profit", "urban")
  const lower = clean.toLowerCase();
  if (PROSE_SLASH_WORDS.has(lower)) return false;

  // Purely numeric or decimal
  if (/^[+-]?\d+(?:\.\d+)?%?$/.test(clean)) return true;

  // Contains math symbols, Greek letters, digits, Δ, %, parentheses, or subscripts/superscripts
  if (/[0-9Δθλμρσπαβγπ±×−+*=<>^%]/.test(clean) || /<(?:sub|sup)\b/.test(raw)) {
    return true;
  }

  // Short symbolic math/physics/economics token (1–4 chars, e.g. F, A, dx, dy, sin x, MU, PQ, VR, MA)
  if (/^[A-Za-z]{1,4}$/.test(clean) && !PROSE_SLASH_WORDS.has(lower)) {
    return true;
  }

  // Trig / log expression like "sin i", "sin r", "cos θ", "log a"
  if (/^(?:sin|cos|tan|log|ln)\s+[A-Za-z0-9θ]+$/i.test(clean)) {
    return true;
  }

  // Short two-word technical numerator/denominator inside explicit parens or formulas (e.g. "Real depth", "Actual", "Total Cost")
  return false;
}

/**
 * Converts inline mathematical ratios `(num) / (den)` and `a / b` into vertical `.fr` fractions,
 * while strictly leaving English prose slashes ("and/or", "profit/loss") and IPA ("/iː/") untouched.
 */
function convertMathFractions(html: string, subj?: SubjectId): string {
  if (subj === 'eng') return html;

  let s = html;

  // First convert fractional superscripts: <sup>2/3</sup> or <sup>−1/2</sup> -> <sup class="fr-sup"><span class="fr fr-sm">...
  s = s.replace(
    /<sup>\s*([+-−]?[A-Za-z0-9]+)\s*\/\s*([A-Za-z0-9]+)\s*<\/sup>/g,
    (_, num: string, den: string) =>
      `<sup class="fr-sup"><span class="fr fr-xs"><span>${num}</span><span>${den}</span></span></sup>`
  );

  // Skip strings that contain IPA phonetic slashes like /ˈkɜːnl/ or /iː/
  if (/\/[ˈˌɪʊʌɒəɜːʃʒθðŋæɑɔ]/.test(s)) {
    return s;
  }

  // Case A: Parenthesized numerator AND parenthesized denominator: (A) / (B) or (A) ÷ (B)
  s = s.replace(
    /\(([^()]{1,380})\)\s*(?:\/|÷)\s*\(([^()]{1,380})\)/g,
    (full, num: string, den: string) => {
      const nClean = num.replace(/<[^>]+>/g, '').trim().toLowerCase();
      const dClean = den.replace(/<[^>]+>/g, '').trim().toLowerCase();
      if (!nClean || !dClean || nClean.length > 48 || dClean.length > 48) return full;
      if (PROSE_SLASH_WORDS.has(nClean) && PROSE_SLASH_WORDS.has(dClean)) return full;
      return `<span class="fr"><span>${num.trim()}</span><span>${den.trim()}</span></span>`;
    }
  );

  // Case B: Parenthesized numerator over symbolic/numeric denominator: (y₂ − y₁) / 2 or (ΔQ) ÷ Q₁
  s = s.replace(
    /\(([^()]{1,380})\)\s*(?:\/|÷)\s*([A-Za-z0-9α-ωΑ-ΩΔθλμρσπ%]+(?:<(?:sub|sup)[^>]*>[\s\S]*?<\/(?:sub|sup)>)*)/g,
    (full, num: string, den: string) => {
      const nClean = num.replace(/<[^>]+>/g, '').trim();
      if (!nClean || nClean.length > 48) return full;
      if (!isLikelyMathOperand(den)) return full;
      return `<span class="fr"><span>${num.trim()}</span><span>${den.trim()}</span></span>`;
    }
  );

  // Case C: Symbolic/numeric numerator over parenthesized denominator: Δl / (l₁ Δθ) or 1 ÷ (1 − MPC)
  s = s.replace(
    /([A-Za-z0-9α-ωΑ-ΩΔθλμρσπ%]+(?:<(?:sub|sup)[^>]*>[\s\S]*?<\/(?:sub|sup)>)*)\s*(?:\/|÷)\s*\(([^()]{1,380})\)/g,
    (full, num: string, den: string) => {
      const dClean = den.replace(/<[^>]+>/g, '').trim();
      if (!dClean || dClean.length > 48) return full;
      if (!isLikelyMathOperand(num)) return full;
      return `<span class="fr"><span>${num.trim()}</span><span>${den.trim()}</span></span>`;
    }
  );

  // Case D:Trig ratios like "sin i / sin r" or "sin A / a"
  s = s.replace(
    /\b((?:sin|cos|tan)\s+[A-Za-z0-9θ°]+)\s*(?:\/|÷)\s*((?:sin|cos|tan)\s+[A-Za-z0-9θ°]+|[A-Za-z0-9θ]+)\b/g,
    (_, num: string, den: string) =>
      `<span class="fr"><span>${num.trim()}</span><span>${den.trim()}</span></span>`
  );

  // Case E: Compact atomic symbolic/numeric fractions: F / A, 1/R₁, %ΔQd / %ΔP, dy/dx, 22/7
  // Guard against dates like 10/10/2026 or SI unit slashes like "m/s" when preceded by a space+unit? Actually m/s -> let's keep unit words or allow clean fraction? Wait: in Physics/Maths "m/s" vs "m s⁻¹": let's NOT stack common prose unit pairs like km/h, m/s, g/cm³, J/kg so inline units stay compact on one line!
  const UNIT_SLASH_PAIRS = new Set([
    'm/s',
    'km/h',
    'km/hr',
    'cm/s',
    'g/cm',
    'kg/m',
    'j/kg',
    'j/g',
    'n/m',
    'v/m',
    'c/mol',
    'g/mol',
    'mol/dm',
    'g/dm',
    'l/min',
    'kg/ha',
    't/ha',
    'i/o',
    'r/w',
    'tcp/ip',
    'lan/wan',
    'ram/rom',
    'cd/dvd',
    'ar/vr',
    'ci/cd',
    'b/w',
    'p/e',
    'kb/s',
    'mb/s',
    'gb/s',
    'tb/s',
    'b/s',
    'bits/s',
  ]);

  const tokenPat =
    '(?:%?[Δ∂]?[A-Za-z0-9α-ωΑ-Ωθλμρσπ]+(?:<(?:sub|sup)[^>]*>[^<]*<\\/(?:sub|sup)>)*)';
  const atomicFracRe = new RegExp(
    `(^|[\\s(=+−×,;:[])(${tokenPat})\\s*(\\/|÷)\\s*(${tokenPat})(?=$|[\\s)=+−×,.;:\\]])`,
    'g'
  );

  s = s.replace(
    atomicFracRe,
    (full, lead: string, num: string, op: string, den: string) => {
      const nPlain = num.replace(/<[^>]+>/g, '').trim();
      const dPlain = den.replace(/<[^>]+>/g, '').trim();
      const pairKey = `${nPlain.toLowerCase()}/${dPlain.toLowerCase()}`;
      if (UNIT_SLASH_PAIRS.has(pairKey)) return full;

      // If BOTH are plain English words >= 2 letters with no sub/sup/digits/Greek and op is '/', only stack when at least one is <= 2 chars & uppercase/math-like or op === '÷'
      const bothMultiAlpha =
        /^[A-Za-z]{2,}$/.test(nPlain) &&
        /^[A-Za-z]{2,}$/.test(dPlain) &&
        !/<(?:sub|sup)\b/.test(num + den);

      if (bothMultiAlpha && op === '/') {
        const mathSymPair =
          /^(?:dy|dx|du|dv|dt|dp|dq|dr|ds|MU|TU|AP|MP|TC|AC|MC|TR|AR|MR|MA|VR|KE|PE|Qd|Qs)$/i.test(
            nPlain
          ) &&
          /^(?:dy|dx|du|dv|dt|dp|dq|dr|ds|MU|TU|AP|MP|TC|AC|MC|TR|AR|MR|MA|VR|KE|PE|Qd|Qs|Px|Py)$/i.test(
            dPlain
          );
        if (!mathSymPair) return full;
      }

      if (!isLikelyMathOperand(num) || !isLikelyMathOperand(den)) return full;
      return `${lead}<span class="fr"><span>${num}</span><span>${den}</span></span>`;
    }
  );

  return s;
}

/**
 * Normalizes typography inside math expressions:
 * - Converts hyphen minus between math tokens to true minus `−`
 * - Marks upright trig/log operators `<span class="m-fn">sin</span>`
 */
function polishMathOperators(html: string, subj?: SubjectId): string {
  if (subj === 'eng') return html;
  let s = html;

  // Replace spaced ASCII hyphen ` - ` between numbers/variables with proper minus ` − `
  s = s.replace(/([0-9A-Za-zα-ωΑ-Ω°)\]>])\s+-\s+([0-9A-Za-zα-ωΑ-Ω(√])/g, '$1 − $2');

  // Wrap standalone math function names before parens or variables in upright .m-fn
  s = s.replace(
    /\b(sin|cos|tan|sec|cosec|cot|log|ln|lim)(?=(?:<sub>[^<]+<\/sub>)?(?:\s*[A-Za-z0-9θ(]))/g,
    (fn) => (UPRIGHT_FUNCS.has(fn) ? `<span class="m-fn">${fn}</span>` : fn)
  );

  return s;
}

/**
 * Converts markdown inline backtick code tokens (e.g., `CROSS JOIN`, `DELETE FROM Students;`, `$A$1`)
 * into clean typographic `<code class="rtc-code">...</code>` spans without touching HTML tag attributes.
 */
function convertInlineBackticks(html: string): string {
  if (!html.includes('`')) return html;
  return html.replace(/`([^`\n<>]{1,120})`/g, (_, token: string) => {
    const clean = token.trim();
    if (!clean) return '';
    return `<code class="rtc-code">${clean}</code>`;
  });
}

/**
 * Master publication-grade mathematical HTML typesetter.
 * Safe to run on any curriculum rule, note paragraph, worked-example step, formula card, or quiz stem.
 */
export function typesetMathHtml(rawHtml: string, subj?: SubjectId): string {
  if (!rawHtml) return rawHtml;
  const withCode = convertInlineBackticks(rawHtml);

  if (subj === 'eng') {
    // For English Language, preserve all phonetic slashes (/iː/) and prose; sanitize before HTML sink
    return sanitizeEducationalHtml(withCode);
  }

  const { masked, restore } = protectBlocks(withCode);
  let work = convertUnicodeScriptsAndVulgarFractions(masked);
  work = convertAsciiSubSup(work);
  work = restore(work);

  // Protect code blocks again before running structural radical/fraction/operator converters
  const postCodeVault: string[] = [];
  work = work.replace(/<code\b[^>]*>[\s\S]*?<\/code>/g, (m) => {
    const token = `\uE002C${postCodeVault.length}C\uE003`;
    postCodeVault.push(m);
    return token;
  });

  // Now run structural radical + fraction converters on clean tag-aware HTML
  work = convertRadicals(work);
  work = convertMathFractions(work, subj);
  work = polishMathOperators(work, subj);

  if (postCodeVault.length > 0) {
    work = work.replace(/\uE002C(\d+)C\uE003/g, (_, idx) => postCodeVault[Number(idx)] ?? '');
  }

  return sanitizeEducationalHtml(work);
}

/**
 * Detects whether a note rule or worked step contains a genuine mathematical/scientific equation
 * (`LHS = RHS` or `⇌` or `→` reaction/formula) and splits out `{ leadHtml, eqHtml, tailHtml }`
 * so NotesScreen can highlight the equation in a crisp textbook plate when appropriate.
 */
export interface SplitRuleResult {
  hasEquation: boolean;
  leadHtml: string;
  eqHtml: string;
  tailHtml: string;
}

export function splitRuleEquation(ruleHtml: string, subj?: SubjectId): SplitRuleResult {
  const formatted = typesetMathHtml(ruleHtml, subj);
  if (subj === 'eng') {
    return { hasEquation: false, leadHtml: formatted, eqHtml: '', tailHtml: '' };
  }

  const plain = ruleHtml.replace(/<[^>]+>/g, '').trim();
  // Must contain `=` or `⇌` and look quantitative/symbolic (not a prose definition like "x = meaning of word" with 10+ prose words on both sides)
  if (!/[=⇌]/.test(plain)) {
    return { hasEquation: false, leadHtml: formatted, eqHtml: '', tailHtml: '' };
  }

  // Pattern: "Label: Equation" (e.g. "Boyle's Law: P₁V₁ = P₂V₂ (at constant T).")
  const colonIdx = plain.indexOf(':');
  if (colonIdx > 1 && colonIdx < 48) {
    const rawColonIdx = ruleHtml.indexOf(':');
    if (rawColonIdx > 1 && rawColonIdx < 70) {
      const leadRaw = ruleHtml.slice(0, rawColonIdx).trim();
      const restRaw = ruleHtml.slice(rawColonIdx + 1).trim();
      const restPlain = restRaw.replace(/<[^>]+>/g, '').trim();
      // Check that `restPlain` starts with or centers on an equation and isn't a 25-word prose paragraph
      if (/[=⇌]/.test(restPlain) && restPlain.length <= 120) {
        return {
          hasEquation: true,
          leadHtml: typesetMathHtml(leadRaw, subj),
          eqHtml: typesetMathHtml(restRaw.replace(/\.$/, ''), subj),
          tailHtml: '',
        };
      }
    }
  }

  // Whole short line is itself a compact equation (e.g. "v² = u² + 2as", "n = m / M")
  if (plain.length <= 85 && /[=⇌]/.test(plain)) {
    const words = plain.split(/\s+/).filter((w) => /^[a-z]{4,}$/.test(w));
    if (words.length <= 5) {
      return {
        hasEquation: true,
        leadHtml: '',
        eqHtml: formatted.replace(/\.$/, ''),
        tailHtml: '',
      };
    }
  }

  return { hasEquation: false, leadHtml: formatted, eqHtml: '', tailHtml: '' };
}
