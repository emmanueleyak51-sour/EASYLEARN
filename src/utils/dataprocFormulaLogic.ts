import {
  DATAPROC_FORMULAS,
  type DataProcFormulaCatId,
  type DataProcFormulaItem,
} from '../data/dataprocFormulas';
import { htmlToSpeakableChem } from './chemVoiceLogic';

export interface DataProcFormulaDrillQuestion {
  id: string;
  formulaId: string;
  formulaName: string;
  cat: DataProcFormulaCatId;
  promptHtml: string;
  hintHtml: string;
  options: string[];
  answerIdx: number;
  explanationHtml: string;
}

export function filterDataProcFormulas(
  formulas: DataProcFormulaItem[],
  cat: DataProcFormulaCatId | 'all',
  query: string
): DataProcFormulaItem[] {
  const q = query.trim().toLowerCase();
  return formulas.filter((f) => {
    if (cat !== 'all' && f.cat !== cat) return false;
    if (!q) return true;
    const hay = [
      f.name,
      f.summary,
      f.trap,
      ...f.keywords,
      ...f.rearrangements.map((r) => `${r.label} ${r.exprHtml}`),
      ...f.variables.map(([s, m]) => `${s} ${m}`),
    ]
      .join(' ')
      .toLowerCase();
    return hay.includes(q);
  });
}

export function getDataProcFormulasForTopic(topicId: string): DataProcFormulaItem[] {
  return DATAPROC_FORMULAS.filter((f) => f.topicId === topicId);
}

export function extractDataProcFormulaSpeechScript(
  item: DataProcFormulaItem,
  rearrIdx = 0,
  isFirstStep = false
): string {
  const rearr = item.rearrangements[rearrIdx] || item.rearrangements[0];
  const coreVars = item.variables
    .slice(0, 2)
    .map(([s, m]) => `${s} denotes ${m}`)
    .join(', while ');
  const raw = [
    isFirstStep ? "Welcome to Mrs. Kemi's Data Processing SQL and Formula Studio." : '',
    `Let's master ${item.name}.`,
    `Core data-processing rule: ${item.summary}`,
    `Applying ${rearr.label}, ${rearr.exprHtml}, remember that ${coreVars}.`,
    `Avoid this common trap: ${item.trap}`,
  ]
    .filter(Boolean)
    .join(' ');
  return htmlToSpeakableChem(raw);
}

function makeRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickOne<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length) % arr.length];
}

function packChoices(
  correct: string,
  wrongs: string[],
  rng: () => number
): { options: string[]; answerIdx: number } {
  const uniqueWrongs: string[] = [];
  for (const w of wrongs) {
    if (w !== correct && !uniqueWrongs.includes(w)) {
      uniqueWrongs.push(w);
    }
  }
  let bump = 2;
  while (uniqueWrongs.length < 3) {
    const candidate = `${correct} (${bump})`;
    if (!uniqueWrongs.includes(candidate)) uniqueWrongs.push(candidate);
    bump++;
  }
  const pool = [correct, ...uniqueWrongs.slice(0, 3)];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return {
    options: pool,
    answerIdx: pool.indexOf(correct),
  };
}

export function generateDataProcFormulaQuestion(
  formulaId: string,
  seed = 809
): DataProcFormulaDrillQuestion {
  const rng = makeRng(seed);
  const meta = DATAPROC_FORMULAS.find((f) => f.id === formulaId) || DATAPROC_FORMULAS[0];
  const hintHtml = `<strong>${meta.rearrangements[0].exprHtml}</strong> — ${meta.trap}`;

  const finish = (
    promptHtml: string,
    correct: string,
    wrongs: string[],
    explanationHtml: string
  ): DataProcFormulaDrillQuestion => {
    const { options, answerIdx } = packChoices(correct, wrongs, rng);
    return {
      id: `dpfd-${meta.id}-${seed}`,
      formulaId: meta.id,
      formulaName: meta.name,
      cat: meta.cat,
      promptHtml,
      hintHtml,
      options,
      answerIdx,
      explanationHtml,
    };
  };

  switch (meta.id) {
    case 'dpf-deg-card': {
      const cols = pickOne([5, 6, 7, 8], rng);
      const rows = pickOne([30, 42, 65, 120], rng);
      return finish(
        `A relational table displays <strong>1 column-header row + ${rows} student records</strong> across <strong>${cols} attributes</strong>. State its <strong>(Degree, Cardinality)</strong>.`,
        `Degree = ${cols}, Cardinality = ${rows}`,
        [
          `Degree = ${rows}, Cardinality = ${cols}`,
          `Degree = ${cols}, Cardinality = ${rows + 1}`,
          `Degree = ${cols + 1}, Cardinality = ${rows * cols}`,
        ],
        `Degree counts attributes (<strong>${cols}</strong> columns); Cardinality counts data tuples excluding the header row (<strong>${rows}</strong> rows).`
      );
    }
    case 'dpf-cartesian': {
      const d1 = pickOne([3, 4], rng);
      const c1 = pickOne([4, 6, 8], rng);
      const d2 = pickOne([5, 6], rng);
      const c2 = pickOne([10, 15, 20], rng);
      return finish(
        `Relation <strong>R</strong> has Degree <strong>${d1}</strong> and Cardinality <strong>${c1}</strong>; Relation <strong>S</strong> has Degree <strong>${d2}</strong> and Cardinality <strong>${c2}</strong>. Find <strong>(Degree, Cardinality)</strong> of <strong>R × S</strong>.`,
        `Degree = ${d1 + d2}, Cardinality = ${c1 * c2}`,
        [
          `Degree = ${d1 * d2}, Cardinality = ${c1 + c2}`,
          `Degree = ${d1 + d2}, Cardinality = ${c1 + c2}`,
          `Degree = ${Math.max(d1, d2)}, Cardinality = ${c1 * c2}`,
        ],
        `In a Cartesian product R × S, Degrees ADD (<strong>${d1} + ${d2} = ${d1 + d2}</strong>) while Cardinalities MULTIPLY (<strong>${c1} × ${c2} = ${c1 * c2}</strong>).`
      );
    }
    case 'dpf-er-mapping': {
      const entities = pickOne([3, 4, 5], rng);
      const mnCount = pickOne([1, 2], rng);
      const totalTables = entities + mnCount;
      return finish(
        `An ER diagram contains <strong>${entities} strong entities</strong> linked by one 1:M relationship and <strong>${mnCount} Many-to-Many (M:N) relationship(s)</strong>. How many relational tables are required in 3NF?`,
        `${totalTables} tables`,
        [`${entities} tables`, `${entities + mnCount + 1} tables`, `${entities * 2} tables`],
        `1:M links add a Foreign Key without new tables, while each M:N relationship requires 1 Junction Table: <strong>${entities} + ${mnCount} = ${totalTables} tables</strong>.`
      );
    }
    case 'dpf-normal-forms': {
      const scenario = pickOne(
        [
          {
            q: 'Table `Result(MatricNo, CourseCode, CourseTitle, Score)` has composite PK `(MatricNo, CourseCode)`, where `CourseCode → CourseTitle`. Which Normal Form is violated?',
            ans: '2NF (Partial Dependency on part of composite PK)',
            w1: '1NF (Repeating multi-valued cell)',
            w2: '3NF only (already satisfies 2NF)',
            w3: 'No Normal Form is violated',
          },
          {
            q: 'Table `Staff(StaffID, Name, DeptID, DeptPhone)` has single-column PK `StaffID`, where `DeptID → DeptPhone`. Which Normal Form is violated?',
            ans: '3NF (Transitive Dependency: Non-Key → Non-Key)',
            w1: '1NF (Non-atomic cell)',
            w2: '2NF (Partial Dependency on single-column PK)',
            w3: 'Already in 3NF',
          },
          {
            q: 'Table `Pupil(PupilID, Name, SubjectsTaken)` stores `"Maths, English, Civic"` inside a single `SubjectsTaken` cell. Which Normal Form is violated first?',
            ans: '1NF (Non-atomic multi-valued cell)',
            w1: 'Satisfies 1NF and 2NF',
            w2: 'Satisfies 3NF',
            w3: 'Only BCNF is violated',
          },
        ],
        rng
      );
      return finish(
        scenario.q,
        scenario.ans,
        [scenario.w1, scenario.w2, scenario.w3],
        `1NF demands atomic cells; 2NF removes partial dependencies on composite PKs; 3NF removes transitive Non-Key → Non-Key dependencies: <strong>${scenario.ans}</strong>.`
      );
    }
    case 'dpf-blocking-factor': {
      const pair = pickOne(
        [
          { b: 1024, r: 200 },
          { b: 2048, r: 300 },
          { b: 4096, r: 500 },
          { b: 4096, r: 600 },
        ],
        rng
      );
      const bfr = Math.floor(pair.b / pair.r);
      const slack = pair.b - bfr * pair.r;
      return finish(
        `Unspanned fixed-length records of <strong>${pair.r} Bytes</strong> are stored in <strong>${pair.b.toLocaleString()}-Byte</strong> disk blocks. Find the <strong>Blocking Factor (bfr)</strong> and unused slack per block.`,
        `bfr = ${bfr} records/block (${slack} B slack)`,
        [
          `bfr = ${bfr + 1} records/block (0 B slack)`,
          `bfr = ${Math.round(pair.b / pair.r) + 2} records/block`,
          `bfr = ${bfr - 1} records/block (${pair.b - (bfr - 1) * pair.r} B slack)`,
        ],
        `<strong>bfr = ⌊${pair.b} ÷ ${pair.r}⌋ = ${bfr}</strong> complete records per block, leaving ${pair.b} − (${bfr} × ${pair.r}) = <strong>${slack} B</strong> slack.`
      );
    }
    case 'dpf-hit-ratio': {
      const pair = pickOne(
        [
          { active: 15000, master: 300000, pct: '5%' },
          { active: 45000, master: 50000, pct: '90%' },
          { active: 12000, master: 150000, pct: '8%' },
          { active: 75000, master: 100000, pct: '75%' },
        ],
        rng
      );
      return finish(
        `A processing run accesses <strong>${pair.active.toLocaleString()}</strong> records out of a Master File containing <strong>${pair.master.toLocaleString()}</strong> records. Calculate the <strong>Hit Ratio</strong>.`,
        pair.pct,
        ['20%', '50%', '100%'],
        `<strong>Hit Ratio = (${pair.active.toLocaleString()} ÷ ${pair.master.toLocaleString()}) × 100% = ${pair.pct}</strong>.`
      );
    }
    case 'dpf-hash-address': {
      const m = pickOne([11, 13, 17], rng);
      const q = pickOne([6, 8, 9], rng);
      const rem = pickOne([3, 4, 7], rng);
      const k = m * q + rem;
      return finish(
        `A direct-access hashed file uses <strong>h(k) = k mod ${m}</strong>. Which bucket (0 to ${m - 1}) stores record key <strong>k = ${k}</strong>?`,
        `Bucket ${rem}`,
        [`Bucket ${q}`, `Bucket ${(rem + 2) % m}`, `Bucket ${m}`],
        `Dividing ${k} by ${m} gives ${m} × ${q} = ${m * q} with remainder <strong>${rem}</strong> ⇒ <strong>h(${k}) = Bucket ${rem}</strong>.`
      );
    }
    case 'dpf-backup-sets': {
      const dayItem = pickOne(
        [
          { day: 'Wednesday night (after Mon, Tue, Wed daily backups)', incSets: 4, diffSets: 2 },
          { day: 'Thursday night (after Mon–Thu daily backups)', incSets: 5, diffSets: 2 },
          { day: 'Friday night (after Mon–Fri daily backups)', incSets: 6, diffSets: 2 },
        ],
        rng
      );
      return finish(
        `A database runs a <strong>Full backup every Sunday</strong>. If the disk fails right after ${dayItem.day}, how many backup sets are needed to restore under <strong>Incremental</strong> vs <strong>Differential</strong> policy?`,
        `Incremental = ${dayItem.incSets} sets · Differential = ${dayItem.diffSets} sets`,
        [
          `Incremental = ${dayItem.diffSets} sets · Differential = ${dayItem.incSets} sets`,
          `Incremental = 1 set · Differential = 1 set`,
          `Incremental = ${dayItem.incSets + 2} sets · Differential = 4 sets`,
        ],
        `Incremental requires Last Full + EVERY daily incremental (${dayItem.incSets} sets), whereas Differential requires ONLY Last Full + Latest Differential (always <strong>2 sets</strong>).`
      );
    }
    case 'dpf-compression-ratio': {
      const pair = pickOne(
        [
          { orig: 200, comp: 50, ratio: '4 : 1', save: '75%' },
          { orig: 150, comp: 30, ratio: '5 : 1', save: '80%' },
          { orig: 180, comp: 90, ratio: '2 : 1', save: '50%' },
        ],
        rng
      );
      return finish(
        `A <strong>${pair.orig} MB</strong> backup file compresses losslessly to <strong>${pair.comp} MB</strong>. Find the <strong>Compression Ratio</strong> and <strong>Space Savings %</strong>.`,
        `${pair.ratio} (${pair.save} saved)`,
        [`${pair.save} ratio (${pair.comp}% saved)`, `1 : 4 (25% saved)`, `10 : 1 (90% saved)`],
        `Ratio = ${pair.orig} ÷ ${pair.comp} = <strong>${pair.ratio}</strong>; Space Saved = [(${pair.orig} − ${pair.comp}) ÷ ${pair.orig}] × 100% = <strong>${pair.save}</strong>.`
      );
    }
    case 'dpf-cell-count': {
      const cPair = pickOne(
        [
          { c1: 'A', c2: 'D', nCol: 4 },
          { c1: 'B', c2: 'F', nCol: 5 },
          { c1: 'C', c2: 'E', nCol: 3 },
        ],
        rng
      );
      const r1 = pickOne([2, 3, 4], rng);
      const r2 = pickOne([9, 11, 13], rng);
      const nRow = r2 - r1 + 1;
      const total = nRow * cPair.nCol;
      const fenceTrap = (r2 - r1) * (cPair.nCol - 1);
      return finish(
        `How many cells are contained in the rectangular spreadsheet range <strong>${cPair.c1}${r1}:${cPair.c2}${r2}</strong>?`,
        `${total} cells`,
        [`${fenceTrap} cells`, `${(r2 - r1) * cPair.nCol} cells`, `${nRow + cPair.nCol} cells`],
        `Rows = ${r2} − ${r1} + 1 = ${nRow}; Columns (${cPair.c1}..${cPair.c2}) = ${cPair.nCol}. Total = <strong>${nRow} × ${cPair.nCol} = ${total} cells</strong>.`
      );
    }
    case 'dpf-cell-ref-offset': {
      const variant = pickOne(
        [
          {
            src: 'C2',
            dst: 'E5',
            f: '=A2*$A$1+B$1',
            ans: '=C5*$A$1+D$1',
            w1: '=C5*$C$4+D$4',
            w2: '=A2*$A$1+B$4',
            w3: '=C5*$A$4+B$1',
          },
          {
            src: 'D4',
            dst: 'F8',
            f: '=$B4+C$2*$A$1',
            ans: '=$B8+E$2*$A$1',
            w1: '=$D8+E$6*$A$1',
            w2: '=$B4+E$6*$C$5',
            w3: '=$D4+C$6*$A$1',
          },
        ],
        rng
      );
      return finish(
        `Cell <strong>${variant.src}</strong> contains <strong>${variant.f}</strong>. What exact formula is produced when copied to <strong>${variant.dst}</strong>?`,
        variant.ans,
        [variant.w1, variant.w2, variant.w3],
        `Apply column/row offsets ONLY to coordinates NOT preceded by <strong>$</strong>, yielding <strong>${variant.ans}</strong>.`
      );
    }
    case 'dpf-excel-aggregates': {
      const a = pickOne([12, 18, 24], rng);
      const b = pickOne([6, 12, 18], rng);
      const avg = (a + b + 0) / 3;
      const trapDiv4 = (a + b) / 4;
      const trapSkip0 = (a + b) / 2;
      return finish(
        `Cells <strong>B1:B4</strong> contain <strong>${a}, ${b}, 0, and "ABS"</strong>. What value does <strong>=AVERAGE(B1:B4)</strong> return?`,
        `${avg}`,
        [`${trapSkip0}`, `${trapDiv4}`, `#VALUE!`],
        `\`AVERAGE\` includes numeric \`0\` and ignores text \`"ABS"\`: (${a} + ${b} + 0) ÷ 3 = <strong>${avg}</strong>.`
      );
    }
    case 'dpf-excel-if-countif': {
      const score = pickOne([42, 50, 68, 75], rng);
      const cutoff = 50;
      const out = score >= cutoff ? '"Pass"' : '"Retake"';
      const opp = score >= cutoff ? '"Retake"' : '"Pass"';
      return finish(
        `If cell <strong>A2 = ${score}</strong>, what does <strong>=IF(A2&gt;=${cutoff}, "Pass", "Retake")</strong> return?`,
        out,
        [opp, `${score}`, 'TRUE'],
        `Since ${score} >= ${cutoff} is ${score >= cutoff ? 'TRUE' : 'FALSE'}, \`IF\` returns <strong>${out}</strong>.`
      );
    }
    case 'dpf-sql-order': {
      return finish(
        `Which SQL clause MUST be used (instead of \`WHERE\`) to filter aggregated groups such as <strong>AVG(Score) &gt;= 70</strong> after \`GROUP BY Dept\`?`,
        'HAVING AVG(Score) >= 70',
        ['WHERE AVG(Score) >= 70', 'ORDER BY AVG(Score) >= 70', 'ALTER AVG(Score) >= 70'],
        `\`WHERE\` executes BEFORE \`GROUP BY\` on individual rows; aggregate group conditions execute AFTER \`GROUP BY\` inside <strong>HAVING</strong>.`
      );
    }
    case 'dpf-sql-wildcards': {
      const item = pickOne(
        [
          {
            pat: "LIKE '_a%'",
            ans: 'Any string whose SECOND character is "a" (e.g. "Lagos", "Kano")',
            w1: 'Any string starting with "a"',
            w2: 'Only 2-letter strings ending in "a"',
            w3: 'Strings containing literally an underscore',
          },
          {
            pat: "LIKE 'N%a'",
            ans: 'Any string starting with "N" and ending with "a" (e.g. "Nigeria", "Nnewi" fails)',
            w1: 'Only 2-character strings "Na"',
            w2: 'Any string containing "N" anywhere',
            w3: 'Strings where "a" is the second letter',
          },
        ],
        rng
      );
      return finish(
        `In a SQL \`WHERE Name ${item.pat}\` filter, which values match?`,
        item.ans,
        [item.w1, item.w2, item.w3],
        `\`_\` matches EXACTLY 1 character while \`%\` matches 0 or more characters: <strong>${item.ans}</strong>.`
      );
    }
    case 'dpf-sql-joins': {
      const depts = pickOne([5, 6, 8], rng);
      const emptyDepts = pickOne([1, 2], rng);
      const staff = pickOne([20, 30, 40], rng);
      return finish(
        `\`Dept\` has <strong>${depts} rows</strong> (${emptyDepts} empty departments have 0 staff). \`Staff\` has <strong>${staff} rows</strong>, each linked to an active department. Find the row counts of <strong>Dept INNER JOIN Staff</strong> vs <strong>Dept LEFT JOIN Staff</strong>.`,
        `INNER JOIN = ${staff} rows · LEFT JOIN = ${staff + emptyDepts} rows`,
        [
          `INNER JOIN = ${depts} rows · LEFT JOIN = ${staff} rows`,
          `INNER JOIN = ${depts * staff} rows · LEFT JOIN = ${depts + staff} rows`,
          `INNER JOIN = ${staff + emptyDepts} rows · LEFT JOIN = ${staff} rows`,
        ],
        `\`INNER JOIN\` returns the ${staff} matched staff rows; \`LEFT JOIN\` preserves the ${emptyDepts} unmatched \`Dept\` row(s) with NULLs → <strong>${staff + emptyDepts} rows</strong>.`
      );
    }
    case 'dpf-parity-bit': {
      const sample = pickOne(
        [
          { bits: '1011001', ones: 4, mode: 'Even', p: '0' },
          { bits: '1101001', ones: 4, mode: 'Odd', p: '1' },
          { bits: '1110101', ones: 5, mode: 'Even', p: '1' },
          { bits: '1001100', ones: 3, mode: 'Odd', p: '0' },
        ],
        rng
      );
      const fullByte = `${sample.bits}${sample.p}`;
      const wrongByte = `${sample.bits}${sample.p === '0' ? '1' : '0'}`;
      return finish(
        `Append the correct <strong>${sample.mode} Parity bit</strong> to the end of 7-bit data <strong>${sample.bits}</strong>.`,
        `${fullByte} (parity bit = ${sample.p})`,
        [`${wrongByte} (parity bit = ${sample.p === '0' ? '1' : '0'})`, `${sample.bits}2`, `00000000`],
        `\`${sample.bits}\` contains ${sample.ones} ones; for <strong>${sample.mode} Parity</strong>, append <strong>${sample.p}</strong> so total ones = ${sample.ones + Number(sample.p)}.`
      );
    }
    case 'dpf-check-digit': {
      const item = pickOne(
        [
          { code: '2 4 1 5', sum: 39, rem: 6, chk: '5' },
          { code: '1 3 2 1', sum: 25, rem: 3, chk: '8' },
          { code: '3 1 4 2', sum: 35, rem: 2, chk: '9' },
        ],
        rng
      );
      return finish(
        `Compute the Modulo-11 check digit \`(11 − (S mod 11))\` for <strong>${item.code}</strong> using weights <strong>5, 4, 3, 2</strong>.`,
        item.chk,
        [`${item.rem}`, `${(Number(item.chk) + 2) % 10}`, '0'],
        `Weighted sum S = ${item.sum}; S mod 11 = ${item.rem}; Check Digit = 11 − ${item.rem} = <strong>${item.chk}</strong>.`
      );
    }
    case 'dpf-sql-ddl-dml': {
      const scenario = pickOne(
        [
          {
            q: 'Which SQL command removes BOTH every row AND the entire table schema definition permanently from the database?',
            ans: 'DROP TABLE Students;',
            w1: 'DELETE FROM Students;',
            w2: 'TRUNCATE TABLE Students;',
            w3: 'ALTER TABLE Students;',
            why: '`DROP TABLE` (DDL) destroys both the stored rows and the table structure itself, whereas `DELETE` and `TRUNCATE` keep the table schema.',
          },
          {
            q: 'Which SQL statement belongs strictly to Data Manipulation Language (DML) rather than Data Definition Language (DDL)?',
            ans: 'UPDATE Staff SET Salary = Salary * 1.10 WHERE Grade = 9;',
            w1: 'ALTER TABLE Staff ADD Email VARCHAR(120);',
            w2: 'CREATE TABLE Staff (StaffID INT PRIMARY KEY);',
            w3: 'DROP TABLE Staff;',
            why: '`SELECT`, `INSERT`, `UPDATE`, and `DELETE` are DML (row data); `CREATE`, `ALTER`, `DROP`, and `TRUNCATE` are DDL (schema structure).',
          },
        ],
        rng
      );
      return finish(scenario.q, scenario.ans, [scenario.w1, scenario.w2, scenario.w3], scenario.why);
    }
    case 'dpf-print-dpi':
    default: {
      const dims = pickOne(
        [
          { w: 6, h: 9, dpi: 300 },
          { w: 8, h: 10, dpi: 300 },
          { w: 4, h: 6, dpi: 300 },
        ],
        rng
      );
      const pw = dims.w * dims.dpi;
      const ph = dims.h * dims.dpi;
      return finish(
        `A publisher needs a <strong>${dims.w} in × ${dims.h} in</strong> book cover exported at <strong>${dims.dpi} DPI</strong>. Find the required pixel resolution.`,
        `${pw.toLocaleString()} × ${ph.toLocaleString()} px`,
        [
          `${dims.w * 72} × ${dims.h * 72} px`,
          `${(pw / 2).toLocaleString()} × ${(ph / 2).toLocaleString()} px`,
          `${dims.dpi} × ${dims.dpi} px`,
        ],
        `Multiply inches × DPI: ${dims.w} × ${dims.dpi} = <strong>${pw.toLocaleString()} px</strong> by ${dims.h} × ${dims.dpi} = <strong>${ph.toLocaleString()} px</strong>.`
      );
    }
  }
}

export function buildDataProcFormulaDrillDeck(
  cat: DataProcFormulaCatId | 'all',
  targetFormulaId: string | null,
  count = 8,
  seed = 271828
): DataProcFormulaDrillQuestion[] {
  const rng = makeRng(seed);
  const pool = targetFormulaId
    ? DATAPROC_FORMULAS.filter((f) => f.id === targetFormulaId)
    : cat === 'all'
      ? DATAPROC_FORMULAS
      : DATAPROC_FORMULAS.filter((f) => f.cat === cat);
  const activePool = pool.length > 0 ? pool : DATAPROC_FORMULAS;

  const shuffled = [...activePool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const deck: DataProcFormulaDrillQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const item = shuffled[i % shuffled.length];
    const qSeed = Math.floor(rng() * 1_000_000) + i * 7919 + 37;
    deck.push(generateDataProcFormulaQuestion(item.id, qSeed));
  }
  return deck;
}
