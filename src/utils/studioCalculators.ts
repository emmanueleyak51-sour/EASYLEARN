export type BibleVersionId =
  | 'rsv'
  | 'kjv'
  | 'nkjv'
  | 'gnt'
  | 'nlt'
  | 'amp'
  | 'esv'
  | 'msg'
  | 'nasb'
  | 'erv'
  | 'web'
  | 'bbe';

export interface BibleBookMeta {
  name: string;
  testament: 'OT' | 'NT';
  chapters: number;
  category: string;
}

export const BIBLE_VERSION_IDS: readonly BibleVersionId[] = [
  'rsv',
  'kjv',
  'nkjv',
  'gnt',
  'nlt',
  'amp',
  'esv',
  'msg',
  'nasb',
  'erv',
  'web',
  'bbe',
] as const;

export const BIBLE_BOOKS_CATALOG: readonly BibleBookMeta[] = [
  // Old Testament (39)
  { name: 'Genesis', testament: 'OT', chapters: 50, category: 'Law' },
  { name: 'Exodus', testament: 'OT', chapters: 40, category: 'Law' },
  { name: 'Leviticus', testament: 'OT', chapters: 27, category: 'Law' },
  { name: 'Numbers', testament: 'OT', chapters: 36, category: 'Law' },
  { name: 'Deuteronomy', testament: 'OT', chapters: 34, category: 'Law' },
  { name: 'Joshua', testament: 'OT', chapters: 24, category: 'History' },
  { name: 'Judges', testament: 'OT', chapters: 21, category: 'History' },
  { name: 'Ruth', testament: 'OT', chapters: 4, category: 'History' },
  { name: '1 Samuel', testament: 'OT', chapters: 31, category: 'History' },
  { name: '2 Samuel', testament: 'OT', chapters: 24, category: 'History' },
  { name: '1 Kings', testament: 'OT', chapters: 22, category: 'History' },
  { name: '2 Kings', testament: 'OT', chapters: 25, category: 'History' },
  { name: '1 Chronicles', testament: 'OT', chapters: 29, category: 'History' },
  { name: '2 Chronicles', testament: 'OT', chapters: 36, category: 'History' },
  { name: 'Ezra', testament: 'OT', chapters: 10, category: 'History' },
  { name: 'Nehemiah', testament: 'OT', chapters: 13, category: 'History' },
  { name: 'Esther', testament: 'OT', chapters: 10, category: 'History' },
  { name: 'Job', testament: 'OT', chapters: 42, category: 'Wisdom' },
  { name: 'Psalms', testament: 'OT', chapters: 150, category: 'Wisdom' },
  { name: 'Proverbs', testament: 'OT', chapters: 31, category: 'Wisdom' },
  { name: 'Ecclesiastes', testament: 'OT', chapters: 12, category: 'Wisdom' },
  { name: 'Song of Solomon', testament: 'OT', chapters: 8, category: 'Wisdom' },
  { name: 'Isaiah', testament: 'OT', chapters: 66, category: 'Major Prophets' },
  { name: 'Jeremiah', testament: 'OT', chapters: 52, category: 'Major Prophets' },
  { name: 'Lamentations', testament: 'OT', chapters: 5, category: 'Major Prophets' },
  { name: 'Ezekiel', testament: 'OT', chapters: 48, category: 'Major Prophets' },
  { name: 'Daniel', testament: 'OT', chapters: 12, category: 'Major Prophets' },
  { name: 'Hosea', testament: 'OT', chapters: 14, category: 'Minor Prophets' },
  { name: 'Joel', testament: 'OT', chapters: 3, category: 'Minor Prophets' },
  { name: 'Amos', testament: 'OT', chapters: 9, category: 'Minor Prophets' },
  { name: 'Obadiah', testament: 'OT', chapters: 1, category: 'Minor Prophets' },
  { name: 'Jonah', testament: 'OT', chapters: 4, category: 'Minor Prophets' },
  { name: 'Micah', testament: 'OT', chapters: 7, category: 'Minor Prophets' },
  { name: 'Nahum', testament: 'OT', chapters: 3, category: 'Minor Prophets' },
  { name: 'Habakkuk', testament: 'OT', chapters: 3, category: 'Minor Prophets' },
  { name: 'Zephaniah', testament: 'OT', chapters: 3, category: 'Minor Prophets' },
  { name: 'Haggai', testament: 'OT', chapters: 2, category: 'Minor Prophets' },
  { name: 'Zechariah', testament: 'OT', chapters: 14, category: 'Minor Prophets' },
  { name: 'Malachi', testament: 'OT', chapters: 4, category: 'Minor Prophets' },
  // New Testament (27)
  { name: 'Matthew', testament: 'NT', chapters: 28, category: 'Gospels' },
  { name: 'Mark', testament: 'NT', chapters: 16, category: 'Gospels' },
  { name: 'Luke', testament: 'NT', chapters: 24, category: 'Gospels' },
  { name: 'John', testament: 'NT', chapters: 21, category: 'Gospels' },
  { name: 'Acts', testament: 'NT', chapters: 28, category: 'History' },
  { name: 'Romans', testament: 'NT', chapters: 16, category: 'Epistles' },
  { name: '1 Corinthians', testament: 'NT', chapters: 16, category: 'Epistles' },
  { name: '2 Corinthians', testament: 'NT', chapters: 13, category: 'Epistles' },
  { name: 'Galatians', testament: 'NT', chapters: 6, category: 'Epistles' },
  { name: 'Ephesians', testament: 'NT', chapters: 6, category: 'Epistles' },
  { name: 'Philippians', testament: 'NT', chapters: 4, category: 'Epistles' },
  { name: 'Colossians', testament: 'NT', chapters: 4, category: 'Epistles' },
  { name: '1 Thessalonians', testament: 'NT', chapters: 5, category: 'Epistles' },
  { name: '2 Thessalonians', testament: 'NT', chapters: 3, category: 'Epistles' },
  { name: '1 Timothy', testament: 'NT', chapters: 6, category: 'Epistles' },
  { name: '2 Timothy', testament: 'NT', chapters: 4, category: 'Epistles' },
  { name: 'Titus', testament: 'NT', chapters: 3, category: 'Epistles' },
  { name: 'Philemon', testament: 'NT', chapters: 1, category: 'Epistles' },
  { name: 'Hebrews', testament: 'NT', chapters: 13, category: 'Epistles' },
  { name: 'James', testament: 'NT', chapters: 5, category: 'Epistles' },
  { name: '1 Peter', testament: 'NT', chapters: 5, category: 'Epistles' },
  { name: '2 Peter', testament: 'NT', chapters: 3, category: 'Epistles' },
  { name: '1 John', testament: 'NT', chapters: 5, category: 'Epistles' },
  { name: '2 John', testament: 'NT', chapters: 1, category: 'Epistles' },
  { name: '3 John', testament: 'NT', chapters: 1, category: 'Epistles' },
  { name: 'Jude', testament: 'NT', chapters: 1, category: 'Epistles' },
  { name: 'Revelation', testament: 'NT', chapters: 22, category: 'Prophecy' },
] as const;

const BIBLE_BOOK_BY_LOWER = new Map<string, { meta: BibleBookMeta; bookNumber: number }>(
  BIBLE_BOOKS_CATALOG.map((meta, idx) => [meta.name.toLowerCase(), { meta, bookNumber: idx + 1 }])
);

export function validateBibleQuery(
  rawBook: unknown,
  rawChapter: unknown,
  rawVersion: unknown
):
  | { ok: true; book: string; bookNumber: number; chapter: number; version: BibleVersionId }
  | { ok: false; error: string } {
  const bookStr = typeof rawBook === 'string' ? rawBook.trim().toLowerCase() : '';
  const found = BIBLE_BOOK_BY_LOWER.get(bookStr);
  if (!found) {
    return { ok: false, error: 'Please select a valid Bible book.' };
  }
  const { meta, bookNumber } = found;
  const chapterNum = Number(rawChapter);
  if (!Number.isInteger(chapterNum) || chapterNum < 1 || chapterNum > meta.chapters) {
    return { ok: false, error: `${meta.name} has chapters 1 to ${meta.chapters}.` };
  }
  const verStr = typeof rawVersion === 'string' ? rawVersion.trim().toLowerCase() : 'rsv';
  if (!(BIBLE_VERSION_IDS as readonly string[]).includes(verStr)) {
    return { ok: false, error: 'Unsupported Bible version requested.' };
  }
  return { ok: true, book: meta.name, bookNumber, chapter: chapterNum, version: verStr as BibleVersionId };
}

export function cleanBibleVerseText(raw: string): string {
  return raw
    .replace(/<S>[\s\S]*?<\/S>/gi, '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, '’')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

export function validateQuranSurah(
  rawSurah: unknown
): { ok: true; surah: number } | { ok: false; error: string } {
  const num = Number(rawSurah);
  if (!Number.isInteger(num) || num < 1 || num > 114) {
    return { ok: false, error: 'Surah number must be between 1 and 114.' };
  }
  return { ok: true, surah: num };
}

/* ---------- Accounting & Bookkeeping ---------- */

export interface JournalEntry {
  id: string;
  label: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
}

export interface TrialBalanceLine {
  account: string;
  debit: number;
  credit: number;
}

export function computeTrialBalance(entries: JournalEntry[]): {
  lines: TrialBalanceLine[];
  totalDebit: number;
  totalCredit: number;
  balanced: boolean;
} {
  const netByAccount = new Map<string, number>();
  for (const e of entries) {
    const amt = Number.isFinite(e.amount) && e.amount > 0 ? e.amount : 0;
    if (!amt) continue;
    const dr = e.debitAccount.trim();
    const cr = e.creditAccount.trim();
    if (dr) netByAccount.set(dr, (netByAccount.get(dr) || 0) + amt);
    if (cr) netByAccount.set(cr, (netByAccount.get(cr) || 0) - amt);
  }
  const lines: TrialBalanceLine[] = [];
  let totalDebit = 0;
  let totalCredit = 0;
  for (const [account, net] of netByAccount.entries()) {
    if (Math.abs(net) < 0.005) continue;
    if (net > 0) {
      const d = Math.round(net * 100) / 100;
      lines.push({ account, debit: d, credit: 0 });
      totalDebit += d;
    } else {
      const c = Math.round(Math.abs(net) * 100) / 100;
      lines.push({ account, debit: 0, credit: c });
      totalCredit += c;
    }
  }
  totalDebit = Math.round(totalDebit * 100) / 100;
  totalCredit = Math.round(totalCredit * 100) / 100;
  return {
    lines,
    totalDebit,
    totalCredit,
    balanced: Math.abs(totalDebit - totalCredit) < 0.01,
  };
}

export function computeDepreciation(
  cost: number,
  salvage: number,
  years: number,
  ratePct: number,
  method: 'straight-line' | 'reducing-balance'
): { year: number; charge: number; accumulated: number; nbv: number }[] {
  const safeCost = Math.max(0, Number.isFinite(cost) ? cost : 0);
  const safeSalvage = Math.max(0, Math.min(safeCost, Number.isFinite(salvage) ? salvage : 0));
  const safeYears = Math.max(1, Math.min(20, Math.floor(Number.isFinite(years) ? years : 1)));
  const safeRate = Math.max(1, Math.min(90, Number.isFinite(ratePct) ? ratePct : 20)) / 100;
  const rows: { year: number; charge: number; accumulated: number; nbv: number }[] = [];
  let nbv = safeCost;
  let accumulated = 0;
  const annualSL = (safeCost - safeSalvage) / safeYears;
  for (let y = 1; y <= safeYears; y++) {
    const rawCharge = method === 'straight-line' ? annualSL : nbv * safeRate;
    const charge = Math.round(Math.min(rawCharge, nbv) * 100) / 100;
    accumulated = Math.round((accumulated + charge) * 100) / 100;
    nbv = Math.max(0, Math.round((safeCost - accumulated) * 100) / 100);
    rows.push({ year: y, charge, accumulated, nbv });
  }
  return rows;
}

/* ---------- Commerce, Marketing, Insurance, Store Management ---------- */

export function computeMarkupAndMargin(costPrice: number, sellingPrice: number): {
  profit: number;
  markupPct: number;
  marginPct: number;
} {
  const profit = Math.round((sellingPrice - costPrice) * 100) / 100;
  const markupPct = costPrice > 0 ? Math.round((profit / costPrice) * 1000) / 10 : 0;
  const marginPct = sellingPrice > 0 ? Math.round((profit / sellingPrice) * 1000) / 10 : 0;
  return { profit, markupPct, marginPct };
}

export function computeBreakEvenUnits(
  fixedCost: number,
  sellingPricePerUnit: number,
  variableCostPerUnit: number
): { contributionPerUnit: number; breakEvenUnits: number | null; breakEvenRevenue: number | null } {
  const contribution = sellingPricePerUnit - variableCostPerUnit;
  if (contribution <= 0 || fixedCost < 0) {
    return { contributionPerUnit: Math.round(contribution * 100) / 100, breakEvenUnits: null, breakEvenRevenue: null };
  }
  const units = Math.ceil(fixedCost / contribution);
  return {
    contributionPerUnit: Math.round(contribution * 100) / 100,
    breakEvenUnits: units,
    breakEvenRevenue: Math.round(units * sellingPricePerUnit * 100) / 100,
  };
}

export function computeInsuranceAverageClaim(
  sumInsured: number,
  actualValue: number,
  actualLoss: number
): { payableClaim: number; underInsured: boolean } {
  const safeSum = Math.max(0, sumInsured);
  const safeVal = Math.max(1, actualValue);
  const safeLoss = Math.max(0, Math.min(actualLoss, safeVal));
  if (safeSum >= safeVal) {
    return { payableClaim: Math.round(safeLoss * 100) / 100, underInsured: false };
  }
  const payable = (safeSum / safeVal) * safeLoss;
  return { payableClaim: Math.round(payable * 100) / 100, underInsured: true };
}

export function computeReorderLevel(
  maxDailyUsage: number,
  maxLeadDays: number,
  minDailyUsage: number,
  minLeadDays: number,
  reorderQty: number
): { reorderLevel: number; minStock: number; maxStock: number } {
  const rol = Math.max(0, Math.round(maxDailyUsage * maxLeadDays));
  const avgUsage = (maxDailyUsage + minDailyUsage) / 2;
  const avgLead = (maxLeadDays + minLeadDays) / 2;
  const minStock = Math.max(0, Math.round(rol - avgUsage * avgLead));
  const maxStock = Math.max(rol, Math.round(rol + reorderQty - minDailyUsage * minLeadDays));
  return { reorderLevel: rol, minStock, maxStock };
}

/* ---------- Computer Studies, PHE, Home Ec, Trades, Livestock ---------- */

export function convertNumberBase(decimalValue: number): {
  decimal: number;
  binary: string;
  octal: string;
  hex: string;
} {
  const safe = Math.max(0, Math.min(65535, Math.floor(Number.isFinite(decimalValue) ? decimalValue : 0)));
  return {
    decimal: safe,
    binary: safe.toString(2),
    octal: safe.toString(8),
    hex: safe.toString(16).toUpperCase(),
  };
}

export type LogicGateType = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR';

export function evalLogicGate(gate: LogicGateType, a: 0 | 1, b: 0 | 1): 0 | 1 {
  switch (gate) {
    case 'AND':
      return a && b ? 1 : 0;
    case 'OR':
      return a || b ? 1 : 0;
    case 'NOT':
      return a ? 0 : 1;
    case 'NAND':
      return a && b ? 0 : 1;
    case 'NOR':
      return a || b ? 0 : 1;
    case 'XOR':
      return a !== b ? 1 : 0;
  }
}

export function computeBmiAndHr(weightKg: number, heightCm: number, age: number): {
  bmi: number;
  category: string;
  maxHr: number;
  aerobicMin: number;
  aerobicMax: number;
} {
  const hM = Math.max(0.5, heightCm / 100);
  const bmi = Math.round((Math.max(10, weightKg) / (hM * hM)) * 10) / 10;
  let category = 'Healthy weight';
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi >= 30) category = 'Obese';
  else if (bmi >= 25) category = 'Overweight';
  const maxHr = Math.max(100, 220 - Math.max(10, Math.min(90, Math.round(age))));
  return {
    bmi,
    category,
    maxHr,
    aerobicMin: Math.round(maxHr * 0.6),
    aerobicMax: Math.round(maxHr * 0.8),
  };
}

export function convertOvenTemp(celsius: number): {
  celsius: number;
  fahrenheit: number;
  gasMark: string;
  stage: string;
} {
  const c = Math.max(100, Math.min(260, Math.round(celsius)));
  const f = Math.round((c * 9) / 5 + 32);
  let gasMark = 'Gas 4';
  let stage = 'Moderate oven';
  if (c < 145) {
    gasMark = 'Gas 1';
    stage = 'Very slow oven';
  } else if (c < 165) {
    gasMark = 'Gas 2–3';
    stage = 'Slow oven';
  } else if (c < 185) {
    gasMark = 'Gas 4';
    stage = 'Moderate oven';
  } else if (c < 205) {
    gasMark = 'Gas 5–6';
    stage = 'Moderately hot';
  } else if (c < 225) {
    gasMark = 'Gas 7';
    stage = 'Hot oven';
  } else {
    gasMark = 'Gas 8–9';
    stage = 'Very hot oven';
  }
  return { celsius: c, fahrenheit: f, gasMark, stage };
}

export function estimateWallBlocks(
  lengthM: number,
  heightM: number,
  openingsAreaM2: number,
  wastePct = 10
): { netAreaM2: number; blocksNeeded: number; mortarCementBags: number } {
  const gross = Math.max(0, lengthM) * Math.max(0, heightM);
  const netAreaM2 = Math.max(0, Math.round((gross - Math.max(0, openingsAreaM2)) * 100) / 100);
  // Standard Nigerian 450mm x 225mm sandcrete block covers ~0.10125 m² => ~10 blocks/m²
  const rawBlocks = netAreaM2 * 10;
  const blocksNeeded = Math.ceil(rawBlocks * (1 + Math.max(0, wastePct) / 100));
  // Roughly 1 bag of 50 kg cement lays ~65 blocks in 1:6 mortar
  const mortarCementBags = Math.max(0, Math.ceil(blocksNeeded / 65));
  return { netAreaM2, blocksNeeded, mortarCementBags };
}

export function computeOhmsLaw(voltage: number, resistance: number): {
  currentAmps: number;
  powerWatts: number;
  recommendedFuse: string;
} {
  const v = Math.max(0, voltage);
  const r = Math.max(0.1, resistance);
  const i = Math.round((v / r) * 100) / 100;
  const p = Math.round(v * i * 100) / 100;
  const recommendedFuse = i <= 2.5 ? '3 A' : i <= 4.5 ? '5 A' : i <= 11.5 ? '13 A' : '15 A+ MCB';
  return { currentAmps: i, powerWatts: p, recommendedFuse };
}

export function computeFcr(totalFeedKg: number, totalWeightGainKg: number): {
  fcr: number;
  rating: string;
} {
  const gain = Math.max(0.01, totalWeightGainKg);
  const fcr = Math.round((Math.max(0, totalFeedKg) / gain) * 100) / 100;
  let rating = 'Good efficiency';
  if (fcr <= 1.5) rating = 'Excellent conversion (catfish / broiler target)';
  else if (fcr <= 2.2) rating = 'Good conversion';
  else rating = 'High FCR — check feed quality, water, or health';
  return { fcr, rating };
}
