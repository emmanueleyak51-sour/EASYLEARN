// ───────────────────────────────────────────────────────────────────────────
// 1. DATA PROCESSING: In-Browser SQL Query Engine & 1NF→3NF Normalization
// ───────────────────────────────────────────────────────────────────────────

export type SqlRow = Record<string, string | number>;

export interface SqlTableDef {
  name: string;
  primaryKey: string;
  columns: string[];
  rows: SqlRow[];
}

export const SAMPLE_SQL_TABLES: Record<string, SqlTableDef> = {
  Students: {
    name: 'Students',
    primaryKey: 'Student_ID',
    columns: ['Student_ID', 'Full_Name', 'Class', 'State', 'Score', 'Dept'],
    rows: [
      { Student_ID: 'ST01', Full_Name: 'Chidinma Okafor', Class: 'SS3', State: 'Anambra', Score: 91, Dept: 'Science' },
      { Student_ID: 'ST02', Full_Name: 'Ibrahim Musa', Class: 'SS3', State: 'Kano', Score: 84, Dept: 'Science' },
      { Student_ID: 'ST03', Full_Name: 'Tolu Adeyemi', Class: 'SS2', State: 'Lagos', Score: 76, Dept: 'Commercial' },
      { Student_ID: 'ST04', Full_Name: 'Amina Bello', Class: 'SS3', State: 'Kaduna', Score: 88, Dept: 'Science' },
      { Student_ID: 'ST05', Full_Name: 'Efe Oghene', Class: 'SS2', State: 'Delta', Score: 69, Dept: 'Arts' },
      { Student_ID: 'ST06', Full_Name: 'Ngozi Eze', Class: 'SS1', State: 'Enugu', Score: 82, Dept: 'Commercial' },
      { Student_ID: 'ST07', Full_Name: 'Yusuf Danjuma', Class: 'SS3', State: 'Abuja', Score: 95, Dept: 'Science' },
      { Student_ID: 'ST08', Full_Name: 'Bola Balogun', Class: 'SS1', State: 'Oyo', Score: 73, Dept: 'Arts' },
    ],
  },
  Subjects: {
    name: 'Subjects',
    primaryKey: 'Subj_Code',
    columns: ['Subj_Code', 'Subject_Name', 'Dept', 'Units'],
    rows: [
      { Subj_Code: 'MTH301', Subject_Name: 'Further Maths', Dept: 'Science', Units: 4 },
      { Subj_Code: 'DPR201', Subject_Name: 'Data Processing', Dept: 'Commercial', Units: 3 },
      { Subj_Code: 'CHM301', Subject_Name: 'Chemistry', Dept: 'Science', Units: 4 },
      { Subj_Code: 'GOV201', Subject_Name: 'Civic & Law', Dept: 'Arts', Units: 2 },
    ],
  },
};

export interface SqlQueryResult {
  ok: true;
  columns: string[];
  rows: SqlRow[];
  explanation: string;
}

export interface SqlQueryError {
  ok: false;
  error: string;
}

function resolveCol(row: SqlRow, rawCol: string): string | undefined {
  const clean = rawCol.trim().replace(/^[^.]+\./, '');
  return Object.keys(row).find((k) => k.toLowerCase() === clean.toLowerCase());
}

function evalSimpleCondition(row: SqlRow, cond: string): boolean {
  const m = cond.trim().match(/^([A-Za-z0-9_.]+)\s*(=|!=|<>|>=|<=|>|<|LIKE)\s*(.+)$/i);
  if (!m) throw new Error(`Invalid WHERE condition: "${cond.trim()}"`);
  const [, colRaw, opRaw, valRaw] = m;
  const col = resolveCol(row, colRaw);
  if (!col) throw new Error(`Unknown column "${colRaw}" in WHERE clause`);
  const op = opRaw.toUpperCase();
  const cell = row[col];
  const unquoted = valRaw.trim().replace(/^['"]|['"]$/g, '');
  const numVal = Number(unquoted);
  const isNumCompare = typeof cell === 'number' && !Number.isNaN(numVal) && !/^['"]/.test(valRaw.trim());

  if (op === 'LIKE') {
    const regexStr = '^' + unquoted.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/%/g, '.*').replace(/_/g, '.') + '$';
    return new RegExp(regexStr, 'i').test(String(cell));
  }
  if (op === '=') return isNumCompare ? cell === numVal : String(cell).toLowerCase() === unquoted.toLowerCase();
  if (op === '!=' || op === '<>') return isNumCompare ? cell !== numVal : String(cell).toLowerCase() !== unquoted.toLowerCase();
  if (op === '>') return Number(cell) > numVal;
  if (op === '<') return Number(cell) < numVal;
  if (op === '>=') return Number(cell) >= numVal;
  if (op === '<=') return Number(cell) <= numVal;
  return false;
}

function evalWhere(row: SqlRow, whereExpr: string): boolean {
  const orParts = whereExpr.split(/\s+OR\s+/i);
  return orParts.some((orPart) => {
    const andParts = orPart.split(/\s+AND\s+/i);
    return andParts.every((c) => evalSimpleCondition(row, c));
  });
}

export function runSafeSqlQuery(rawQuery: string): SqlQueryResult | SqlQueryError {
  const sql = rawQuery.trim().replace(/;+$/, '').replace(/\s+/g, ' ');
  if (!sql) return { ok: false, error: 'Enter a SELECT query to run.' };
  if (!/^SELECT\s+/i.test(sql)) {
    return { ok: false, error: 'Only read-only SELECT queries are supported in this playground.' };
  }

  try {
    const match = sql.match(
      /^SELECT\s+(DISTINCT\s+)?(.+?)\s+FROM\s+([A-Za-z0-9_]+)(?:\s+(?:INNER\s+)?JOIN\s+([A-Za-z0-9_]+)\s+ON\s+([A-Za-z0-9_.]+)\s*=\s*([A-Za-z0-9_.]+))?(?:\s+WHERE\s+(.+?))?(?:\s+GROUP\s+BY\s+([A-Za-z0-9_.]+))?(?:\s+ORDER\s+BY\s+([A-Za-z0-9_.()]+)(?:\s+(ASC|DESC))?)?(?:\s+LIMIT\s+(\d+))?$/i
    );
    if (!match) {
      return {
        ok: false,
        error: 'Syntax tip: SELECT cols FROM Students [JOIN Subjects ON ...] [WHERE ...] [GROUP BY col] [ORDER BY col ASC|DESC];',
      };
    }

    const [, distinctFlag, selectListRaw, fromTableRaw, joinTableRaw, joinLeft, joinRight, whereExpr, groupByRaw, orderByRaw, orderDirRaw, limitRaw] = match;

    const tableKey = Object.keys(SAMPLE_SQL_TABLES).find((k) => k.toLowerCase() === fromTableRaw.toLowerCase());
    if (!tableKey) {
      return { ok: false, error: `Table "${fromTableRaw}" not found. Available tables: Students, Subjects.` };
    }

    let workingRows: SqlRow[] = SAMPLE_SQL_TABLES[tableKey].rows.map((r) => ({ ...r }));

    if (joinTableRaw && joinLeft && joinRight) {
      const joinKey = Object.keys(SAMPLE_SQL_TABLES).find((k) => k.toLowerCase() === joinTableRaw.toLowerCase());
      if (!joinKey) {
        return { ok: false, error: `JOIN table "${joinTableRaw}" not found.` };
      }
      const rightRows = SAMPLE_SQL_TABLES[joinKey].rows;
      const joined: SqlRow[] = [];
      for (const lRow of workingRows) {
        const lCol = resolveCol(lRow, joinLeft) || resolveCol(lRow, joinRight);
        for (const rRow of rightRows) {
          const rCol = resolveCol(rRow, joinRight) || resolveCol(rRow, joinLeft);
          if (lCol && rCol && String(lRow[lCol]).toLowerCase() === String(rRow[rCol]).toLowerCase()) {
            joined.push({ ...rRow, ...lRow });
          }
        }
      }
      workingRows = joined;
    }

    if (whereExpr) {
      workingRows = workingRows.filter((row) => evalWhere(row, whereExpr));
    }

    const selectItems = selectListRaw.split(',').map((s) => s.trim());
    const hasAgg = selectItems.some((item) => /^(COUNT|SUM|AVG|MIN|MAX)\s*\(/i.test(item));

    let outRows: SqlRow[] = [];
    let outCols: string[] = [];

    if (groupByRaw || hasAgg) {
      const groups = new Map<string, SqlRow[]>();
      if (groupByRaw) {
        for (const r of workingRows) {
          const col = resolveCol(r, groupByRaw);
          if (!col) throw new Error(`Unknown GROUP BY column "${groupByRaw}"`);
          const gVal = String(r[col]);
          const bucket = groups.get(gVal) || [];
          bucket.push(r);
          groups.set(gVal, bucket);
        }
      } else {
        groups.set('__ALL__', workingRows);
      }

      for (const [, gRows] of groups.entries()) {
        const resRow: SqlRow = {};
        for (const rawItem of selectItems) {
          const aliasMatch = rawItem.match(/^(.+?)\s+AS\s+([A-Za-z0-9_]+)$/i);
          const expr = aliasMatch ? aliasMatch[1].trim() : rawItem;
          const label = aliasMatch ? aliasMatch[2].trim() : expr;
          const aggMatch = expr.match(/^(COUNT|SUM|AVG|MIN|MAX)\s*\(\s*([^)]+)\s*\)$/i);
          if (aggMatch) {
            const fn = aggMatch[1].toUpperCase();
            const arg = aggMatch[2].trim();
            if (fn === 'COUNT') {
              resRow[label] = gRows.length;
            } else {
              const vals = gRows
                .map((r) => {
                  const c = resolveCol(r, arg);
                  return c ? Number(r[c]) : NaN;
                })
                .filter((n) => !Number.isNaN(n));
              if (fn === 'SUM') resRow[label] = Number(vals.reduce((a, b) => a + b, 0).toFixed(2));
              else if (fn === 'AVG')
                resRow[label] = vals.length ? Number((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1)) : 0;
              else if (fn === 'MIN') resRow[label] = vals.length ? Math.min(...vals) : 0;
              else if (fn === 'MAX') resRow[label] = vals.length ? Math.max(...vals) : 0;
            }
          } else {
            const sample = gRows[0];
            const c = sample ? resolveCol(sample, expr) : undefined;
            if (!c && sample) throw new Error(`Column "${expr}" not found`);
            resRow[label] = c && sample ? sample[c] : '';
          }
        }
        outRows.push(resRow);
      }
      outCols = outRows.length ? Object.keys(outRows[0]) : selectItems;
    } else if (selectItems.length === 1 && selectItems[0] === '*') {
      outRows = workingRows;
      outCols = workingRows.length ? Object.keys(workingRows[0]) : SAMPLE_SQL_TABLES[tableKey].columns;
    } else {
      outCols = [];
      outRows = workingRows.map((row) => {
        const proj: SqlRow = {};
        for (const rawItem of selectItems) {
          const aliasMatch = rawItem.match(/^(.+?)\s+AS\s+([A-Za-z0-9_]+)$/i);
          const expr = aliasMatch ? aliasMatch[1].trim() : rawItem;
          const label = aliasMatch ? aliasMatch[2].trim() : expr;
          const c = resolveCol(row, expr);
          if (!c) throw new Error(`Unknown column "${expr}" in SELECT list`);
          proj[label] = row[c];
        }
        return proj;
      });
      outCols = outRows.length ? Object.keys(outRows[0]) : selectItems;
    }

    if (distinctFlag) {
      const seen = new Set<string>();
      outRows = outRows.filter((r) => {
        const key = JSON.stringify(r);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }

    if (orderByRaw) {
      const dir = (orderDirRaw || 'ASC').toUpperCase() === 'DESC' ? -1 : 1;
      outRows.sort((a, b) => {
        const k = resolveCol(a, orderByRaw) || orderByRaw;
        const av = a[k];
        const bv = b[k];
        if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
        return String(av ?? '').localeCompare(String(bv ?? '')) * dir;
      });
    }

    if (limitRaw) {
      outRows = outRows.slice(0, Math.max(1, Number(limitRaw)));
    }

    return {
      ok: true,
      columns: outCols,
      rows: outRows,
      explanation: `Returned ${outRows.length} ${outRows.length === 1 ? 'record' : 'records'} from ${tableKey}${joinTableRaw ? ` JOIN ${joinTableRaw}` : ''}.`,
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Query execution error' };
  }
}

export const NORMALIZATION_STAGES = [
  {
    id: 'unf',
    label: 'UNF (Unnormalized)',
    rule: 'Repeating groups inside a single cell violate atomicity.',
    anomaly: 'Update & Insertion anomalies: Subjects and HOD are duplicated per row.',
    tables: [
      {
        title: 'Raw_Register (UNF)',
        cols: ['Student_ID', 'Name', 'Subjects_List', 'Dept', 'Dept_HOD'],
        rows: [
          ['ST01', 'Chidinma', 'Maths, Chem, Phys', 'Science', 'Dr. Okoro'],
          ['ST03', 'Tolu', 'Econ, DataProc', 'Commercial', 'Mrs. Kemi'],
        ],
      },
    ],
  },
  {
    id: '1nf',
    label: '1NF (Atomic Cells)',
    rule: 'Eliminate repeating groups — every cell holds a single atomic value + composite primary key (Student_ID, Subject).',
    anomaly: 'Partial dependency remains: Name depends only on Student_ID, not the full composite key.',
    tables: [
      {
        title: 'Enrollments_1NF',
        cols: ['Student_ID*', 'Subject*', 'Name', 'Dept', 'Dept_HOD'],
        rows: [
          ['ST01', 'Maths', 'Chidinma', 'Science', 'Dr. Okoro'],
          ['ST01', 'Chem', 'Chidinma', 'Science', 'Dr. Okoro'],
          ['ST03', 'DataProc', 'Tolu', 'Commercial', 'Mrs. Kemi'],
        ],
      },
    ],
  },
  {
    id: '2nf',
    label: '2NF (No Partial Dependency)',
    rule: 'Split out attributes that depend on only part of the composite key into a Students table.',
    anomaly: 'Transitive dependency remains: Student_ID → Dept → Dept_HOD.',
    tables: [
      {
        title: 'Students_2NF',
        cols: ['Student_ID*', 'Name', 'Dept', 'Dept_HOD'],
        rows: [
          ['ST01', 'Chidinma', 'Science', 'Dr. Okoro'],
          ['ST03', 'Tolu', 'Commercial', 'Mrs. Kemi'],
        ],
      },
      {
        title: 'Student_Subjects',
        cols: ['Student_ID*', 'Subject*'],
        rows: [
          ['ST01', 'Maths'],
          ['ST01', 'Chem'],
          ['ST03', 'DataProc'],
        ],
      },
    ],
  },
  {
    id: '3nf',
    label: '3NF (No Transitive Dependency)',
    rule: 'Non-key attributes depend ONLY on the primary key — extract Dept_HOD into Departments.',
    anomaly: 'Zero redundancy! Changing a department HOD updates exactly one row.',
    tables: [
      {
        title: 'Students (3NF)',
        cols: ['Student_ID*', 'Name', 'Dept (FK)'],
        rows: [
          ['ST01', 'Chidinma', 'Science'],
          ['ST03', 'Tolu', 'Commercial'],
        ],
      },
      {
        title: 'Departments (3NF)',
        cols: ['Dept*', 'Dept_HOD'],
        rows: [
          ['Science', 'Dr. Okoro'],
          ['Commercial', 'Mrs. Kemi'],
        ],
      },
    ],
  },
] as const;

// ───────────────────────────────────────────────────────────────────────────
// 2. DIGITAL TECHNOLOGIES: Logic Gate Engine & Base Converter
// ───────────────────────────────────────────────────────────────────────────

export type LogicGateType = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR';

export const LOGIC_GATE_META: Record<
  LogicGateType,
  { expr: string; rule: string; unary?: boolean }
> = {
  AND: { expr: 'Q = A · B', rule: 'Output is 1 ONLY when both A and B are 1.' },
  OR: { expr: 'Q = A + B', rule: 'Output is 1 when A or B (or both) is 1.' },
  NOT: { expr: 'Q = Ā', rule: 'Inverter: flips input A (0 → 1, 1 → 0).', unary: true },
  NAND: { expr: 'Q = (A · B)̅', rule: 'Universal gate: 0 ONLY when both A and B are 1.' },
  NOR: { expr: 'Q = (A + B)̅', rule: 'Universal gate: 1 ONLY when both A and B are 0.' },
  XOR: { expr: 'Q = A ⊕ B', rule: 'Exclusive OR: 1 ONLY when inputs A and B differ.' },
  XNOR: { expr: 'Q = (A ⊕ B)̅', rule: 'Equivalence gate: 1 when inputs A and B match.' },
};

export function evaluateLogicGate(gate: LogicGateType, a: 0 | 1, b: 0 | 1): 0 | 1 {
  switch (gate) {
    case 'AND':
      return a === 1 && b === 1 ? 1 : 0;
    case 'OR':
      return a === 1 || b === 1 ? 1 : 0;
    case 'NOT':
      return a === 1 ? 0 : 1;
    case 'NAND':
      return a === 1 && b === 1 ? 0 : 1;
    case 'NOR':
      return a === 0 && b === 0 ? 1 : 0;
    case 'XOR':
      return a !== b ? 1 : 0;
    case 'XNOR':
      return a === b ? 1 : 0;
  }
}

export function buildTruthTable(gate: LogicGateType): { a: 0 | 1; b?: 0 | 1; out: 0 | 1 }[] {
  if (gate === 'NOT') {
    return [
      { a: 0, out: evaluateLogicGate('NOT', 0, 0) },
      { a: 1, out: evaluateLogicGate('NOT', 1, 0) },
    ];
  }
  const pairs: [0 | 1, 0 | 1][] = [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ];
  return pairs.map(([a, b]) => ({ a, b, out: evaluateLogicGate(gate, a, b) }));
}

export function convertNumberBase(
  rawValue: string,
  fromBase: 2 | 8 | 10 | 16
): {
  ok: true;
  denary: number;
  binary: string;
  octal: string;
  hex: string;
  steps: string[];
} | { ok: false; error: string } {
  const clean = rawValue.trim().toUpperCase();
  if (!clean) return { ok: false, error: 'Enter a number to convert.' };
  const regexMap: Record<2 | 8 | 10 | 16, RegExp> = {
    2: /^[01]+$/,
    8: /^[0-7]+$/,
    10: /^[0-9]+$/,
    16: /^[0-9A-F]+$/,
  };
  if (!regexMap[fromBase].test(clean)) {
    return { ok: false, error: `Invalid digit for base-${fromBase}.` };
  }
  const denary = parseInt(clean, fromBase);
  if (!Number.isSafeInteger(denary) || denary > 65535) {
    return { ok: false, error: 'Keep value within 16-bit unsigned range (0 – 65,535).' };
  }
  const steps: string[] = [];
  if (denary === 0) {
    steps.push('0 in any base equals 0.');
  } else {
    let q = denary;
    while (q > 0 && steps.length < 16) {
      const rem = q % 2;
      steps.push(`${q} ÷ 2 = ${Math.floor(q / 2)} remainder ${rem}`);
      q = Math.floor(q / 2);
    }
  }
  return {
    ok: true,
    denary,
    binary: denary.toString(2),
    octal: denary.toString(8),
    hex: denary.toString(16).toUpperCase(),
    steps,
  };
}

// ───────────────────────────────────────────────────────────────────────────
// 3. FURTHER MATHS: 2×2 Matrix Transformation & Calculus Tangent Engine
// ───────────────────────────────────────────────────────────────────────────

export interface Matrix2x2Analysis {
  det: number;
  isSingular: boolean;
  areaScale: number;
  orientation: 'preserved' | 'reversed' | 'collapsed';
  unitSquare: [number, number][];
  transformedSquare: [number, number][];
  inverse: [[number, number], [number, number]] | null;
}

export function analyzeMatrix2x2(a: number, b: number, c: number, d: number): Matrix2x2Analysis {
  const det = Number((a * d - b * c).toFixed(4));
  const isSingular = Math.abs(det) < 1e-9;
  const unitSquare: [number, number][] = [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1],
  ];
  const transform = ([x, y]: [number, number]): [number, number] => [
    Number((a * x + b * y).toFixed(3)),
    Number((c * x + d * y).toFixed(3)),
  ];
  return {
    det,
    isSingular,
    areaScale: Math.abs(det),
    orientation: isSingular ? 'collapsed' : det > 0 ? 'preserved' : 'reversed',
    unitSquare,
    transformedSquare: unitSquare.map(transform),
    inverse: isSingular
      ? null
      : [
          [Number((d / det).toFixed(3)), Number((-b / det).toFixed(3))],
          [Number((-c / det).toFixed(3)), Number((a / det).toFixed(3))],
        ],
  };
}

export function evaluateCubicAndTangent(
  a: number,
  b: number,
  c: number,
  x0: number
): { y0: number; slope: number; secondDeriv: number; nature: string; tangentEq: string } {
  const y0 = Number((a * x0 * x0 * x0 + b * x0 * x0 + c * x0).toFixed(3));
  const slope = Number((3 * a * x0 * x0 + 2 * b * x0 + c).toFixed(3));
  const secondDeriv = Number((6 * a * x0 + 2 * b).toFixed(3));
  const intercept = Number((y0 - slope * x0).toFixed(2));
  const sign = intercept >= 0 ? '+' : '−';
  const nature =
    Math.abs(slope) < 0.08
      ? secondDeriv > 0
        ? 'Local Minimum (turning point)'
        : secondDeriv < 0
          ? 'Local Maximum (turning point)'
          : 'Point of Inflection'
      : slope > 0
        ? 'Increasing curve (dy/dx > 0)'
        : 'Decreasing curve (dy/dx < 0)';
  return {
    y0,
    slope,
    secondDeriv,
    nature,
    tangentEq: `y = ${slope}x ${sign} ${Math.abs(intercept)}`,
  };
}

// ───────────────────────────────────────────────────────────────────────────
// 4. GEOGRAPHY: Map Work, 4/6-Figure Grid Ref, Bearings & Gradient Engine
// ───────────────────────────────────────────────────────────────────────────

export interface MapPoint {
  easting: number; // 10.0 to 19.9 (grid squares 10..19)
  northing: number; // 20.0 to 29.9 (grid squares 20..29)
  elevationM: number;
}

export function formatGridRefs(p: MapPoint): { fourFig: string; sixFig: string } {
  const eInt = Math.floor(p.easting + 1e-6);
  const eTenth = Math.min(9, Math.max(0, Math.floor((p.easting - eInt) * 10 + 1e-6)));
  const nInt = Math.floor(p.northing + 1e-6);
  const nTenth = Math.min(9, Math.max(0, Math.floor((p.northing - nInt) * 10 + 1e-6)));
  return {
    fourFig: `${eInt}${nInt}`,
    sixFig: `${eInt}${eTenth}${nInt}${nTenth}`,
  };
}

export function computeMapBearingAndGradient(
  from: MapPoint,
  to: MapPoint,
  rfDenominator = 50000
): {
  forwardBearingDeg: number;
  forwardBearingStr: string;
  backBearingDeg: number;
  backBearingStr: string;
  compassQuadrant: string;
  mapDistanceCm: number;
  groundDistanceKm: number;
  verticalIntervalM: number;
  gradientRatio: string;
} {
  const dE = to.easting - from.easting;
  const dN = to.northing - from.northing;
  // Whole-circle bearing clockwise from North (+N axis)
  const rad = Math.atan2(dE, dN);
  const rawDeg = (rad * 180) / Math.PI;
  const forwardBearingDeg = Math.round(((rawDeg % 360) + 360) % 360) % 360;
  const backBearingDeg = (forwardBearingDeg + 180) % 360;

  const fmt3 = (d: number) => `${String(d).padStart(3, '0')}°`;

  let compassQuadrant = 'N';
  if (forwardBearingDeg === 0) compassQuadrant = 'Due North';
  else if (forwardBearingDeg < 90) compassQuadrant = `N ${forwardBearingDeg}° E`;
  else if (forwardBearingDeg === 90) compassQuadrant = 'Due East';
  else if (forwardBearingDeg < 180) compassQuadrant = `S ${180 - forwardBearingDeg}° E`;
  else if (forwardBearingDeg === 180) compassQuadrant = 'Due South';
  else if (forwardBearingDeg < 270) compassQuadrant = `S ${forwardBearingDeg - 180}° W`;
  else if (forwardBearingDeg === 270) compassQuadrant = 'Due West';
  else compassQuadrant = `N ${360 - forwardBearingDeg}° W`;

  // Assume 1 grid square = 2 cm on a 1:50,000 standard WAEC sheet (1 km ground)
  const gridDist = Math.hypot(dE, dN);
  const mapDistanceCm = Number((gridDist * 2).toFixed(2));
  const groundDistanceM = Math.max(1, (mapDistanceCm * rfDenominator) / 100);
  const groundDistanceKm = Number((groundDistanceM / 1000).toFixed(2));
  const verticalIntervalM = Math.abs(Math.round(to.elevationM - from.elevationM));
  const gradientDenom = verticalIntervalM > 0 ? Math.max(1, Math.round(groundDistanceM / verticalIntervalM)) : 0;
  const gradientRatio = verticalIntervalM > 0 ? `1 in ${gradientDenom}` : 'Flat (0 gradient)';

  return {
    forwardBearingDeg,
    forwardBearingStr: fmt3(forwardBearingDeg),
    backBearingDeg,
    backBearingStr: fmt3(backBearingDeg),
    compassQuadrant,
    mapDistanceCm,
    groundDistanceKm,
    verticalIntervalM,
    gradientRatio,
  };
}
