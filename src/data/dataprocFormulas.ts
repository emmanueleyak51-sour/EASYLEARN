import type { FormulaRearrangement } from './chemFormulas';

export type DataProcFormulaCatId =
  | 'relational'
  | 'storage'
  | 'spreadsheet'
  | 'sql'
  | 'integrity';

export interface DataProcFormulaCategory {
  id: DataProcFormulaCatId | 'all';
  label: string;
  shortLabel: string;
  desc: string;
}

export interface DataProcFormulaItem {
  id: string;
  cat: DataProcFormulaCatId;
  name: string;
  topicId: string;
  summary: string;
  rearrangements: FormulaRearrangement[];
  variables: [string, string][];
  constants?: string[];
  trap: string;
  worked: {
    qHtml: string;
    stepsHtml: string[];
    ansHtml: string;
  };
  keywords: string[];
}

export const DATAPROC_FORMULA_CATEGORIES: DataProcFormulaCategory[] = [
  {
    id: 'all',
    label: 'All Data Processing Formulas & Rules',
    shortLabel: 'All',
    desc: 'All 20 Data Processing formulas, relational rules, spreadsheet functions, SQL templates & validation checksums',
  },
  {
    id: 'relational',
    label: 'Relational Model, ER & Normalization',
    shortLabel: 'Relational & NF',
    desc: 'Table Degree vs Cardinality, Cartesian product R × S, ER 1:M & M:N key placement, and 1NF → 2NF → 3NF functional rules',
  },
  {
    id: 'storage',
    label: 'File Blocking, Hit Ratio, Hashing & Backups',
    shortLabel: 'Files & Backups',
    desc: 'Disk blocking factor ⌊B/R⌋, master-file hit ratio, modulo division hashing h(k) = k mod m & backup compression/restore counts',
  },
  {
    id: 'spreadsheet',
    label: 'Spreadsheet Ranges, $A$1 Locks & Functions',
    shortLabel: 'Spreadsheets',
    desc: 'Cell-range count (R₂−R₁+1)(C₂−C₁+1), relative vs $A$1 absolute copy-offset math, SUM/AVERAGE/COUNT & IF/COUNTIF evaluation',
  },
  {
    id: 'sql',
    label: 'SQL Clauses, Aggregates & JOIN Cardinality',
    shortLabel: 'SQL Queries',
    desc: 'SQL execution order (FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY), WHERE vs HAVING, LIKE wildcards & JOIN counts',
  },
  {
    id: 'integrity',
    label: 'Parity Bits, Check Digits & Print DPI',
    shortLabel: 'Integrity & DPI',
    desc: 'Even/Odd byte parity bits, Modulo-10/11 check-digit validation, ACID transaction invariants & print resolution (Pixels ÷ DPI)',
  },
];

export const DATAPROC_FORMULAS: DataProcFormulaItem[] = [
  /* ─────────────── 1. RELATIONAL MODEL, ER & NORMALIZATION (4) ─────────────── */
  {
    id: 'dpf-deg-card',
    cat: 'relational',
    name: 'Relational Degree (Arity) & Cardinality Law',
    topicId: 'dp-relational-model-keys',
    summary: 'Distinguishes the structural column count (Degree / Arity) of a relational table from its dynamic row count (Cardinality).',
    rearrangements: [
      { solveFor: 'deg', label: 'Degree (Arity)', exprHtml: 'Degree(R) = Number of Attributes (Columns)' },
      { solveFor: 'card', label: 'Cardinality', exprHtml: 'Cardinality(R) = Number of Tuples (Data Rows)' },
      { solveFor: 'cells', label: 'Total Data Cells', exprHtml: 'Cells = Degree(R) × Cardinality(R)' },
    ],
    variables: [
      ['Degree (Arity)', 'Count of vertical columns/attributes in the relation schema'],
      ['Cardinality', 'Count of horizontal data tuples/records (EXCLUDING the header row!)'],
    ],
    trap: 'NEVER count the column-header row in Cardinality, and NEVER swap Degree (columns) with Cardinality (rows)! Inserting a new student increases Cardinality while Degree stays constant.',
    worked: {
      qHtml: 'A printed `Students` table has <strong>1 header row + 45 student rows</strong> across <strong>6 columns</strong> (`MatricNo`, `Surname`, `FirstName`, `Class`, `Gender`, `DOB`). Find its Degree and Cardinality.',
      stepsHtml: [
        'Degree = number of attributes (columns) = 6',
        'Cardinality = number of data tuples (exclude header row!) = 45',
      ],
      ansHtml: 'Degree = 6, Cardinality = 45',
    },
    keywords: ['degree', 'arity', 'cardinality', 'tuple', 'attribute'],
  },
  {
    id: 'dpf-cartesian',
    cat: 'relational',
    name: 'Relational Cartesian Product (R × S) Size Law',
    topicId: 'dp-relational-model-keys',
    summary: 'Computes the exact Degree and Cardinality produced when two tables are combined without a JOIN filter condition (`CROSS JOIN`).',
    rearrangements: [
      { solveFor: 'deg', label: 'Product Degree', exprHtml: 'Degree(R × S) = Degree(R) + Degree(S)' },
      { solveFor: 'card', label: 'Product Cardinality', exprHtml: 'Cardinality(R × S) = Cardinality(R) × Cardinality(S)' },
    ],
    variables: [
      ['Degree(R), Degree(S)', 'Attribute counts of tables R and S (ADD for product)'],
      ['Card(R), Card(S)', 'Tuple counts of tables R and S (MULTIPLY for product)'],
    ],
    trap: 'Degrees ADD whereas Cardinalities MULTIPLY! Omitting the `WHERE` / `ON` join condition in SQL accidentally produces this huge `Card(R) × Card(S)` Cartesian explosion!',
    worked: {
      qHtml: 'Table `Dept` has Degree <strong>3</strong> and Cardinality <strong>5</strong>; Table `Staff` has Degree <strong>4</strong> and Cardinality <strong>20</strong>. Find the Degree and Cardinality of <strong>Dept × Staff</strong>.',
      stepsHtml: [
        'Degree(Dept × Staff) = 3 + 4 = 7 attributes',
        'Cardinality(Dept × Staff) = 5 × 20 = 100 tuples',
      ],
      ansHtml: 'Degree = 7, Cardinality = 100',
    },
    keywords: ['cartesian product', 'cross join', 'degree plus', 'cardinality times'],
  },
  {
    id: 'dpf-er-mapping',
    cat: 'relational',
    name: 'ER Relationship Key-Placement Rules (1:M & M:N)',
    topicId: 'dp-entity-relationship-erd',
    summary: 'Determines exact Foreign Key placement and total table count when converting Conceptual ER diagrams into Logical Relational tables.',
    rearrangements: [
      { solveFor: '1m', label: 'One-to-Many (1 : M)', exprHtml: 'Place Primary Key of "1" side as Foreign Key in "Many" side (2 tables total)' },
      { solveFor: 'mn', label: 'Many-to-Many (M : N)', exprHtml: 'Create a 3rd Junction Table with Composite PK = (PK<sub>A</sub>, PK<sub>B</sub>)' },
    ],
    variables: [
      ['1 : M', 'e.g. 1 Department employs Many Teachers → `DeptID` goes into `Teacher` table'],
      ['M : N', 'e.g. Students ↔ Subjects → requires 3rd Associative/Junction table `Enrollment(StudentID, SubjectID)`'],
    ],
    trap: 'A relational RDBMS CANNOT implement a Many-to-Many (M:N) relationship directly between 2 tables without repeating groups — you MUST decompose M:N into TWO 1:M links via a 3rd Junction Table!',
    worked: {
      qHtml: 'An ER model has <strong>4 strong entities</strong> connected by two `1:M` relationships and <strong>one `M:N` relationship</strong>. How many relational tables are required in 3NF?',
      stepsHtml: [
        '`1:M` relationships add Foreign Keys without creating extra tables (4 entity tables)',
        'The single `M:N` relationship requires +1 Junction (Associative) table ⇒ 4 + 1 = 5 tables',
      ],
      ansHtml: '5 relational tables',
    },
    keywords: ['one to many', 'many to many', 'junction table', 'foreign key placement', 'erd'],
  },
  {
    id: 'dpf-normal-forms',
    cat: 'relational',
    name: '1NF → 2NF → 3NF Functional Dependency Checklist',
    topicId: 'dp-normalization',
    summary: 'Eliminates repeating groups, partial dependencies, and transitive dependencies so every non-key attribute depends on "the key, the whole key, and nothing other than the key".',
    rearrangements: [
      { solveFor: '1nf', label: 'First Normal Form (1NF)', exprHtml: 'Atomic cell values + No repeating groups + Unique Primary Key' },
      { solveFor: '2nf', label: 'Second Normal Form (2NF)', exprHtml: 'In 1NF + No PARTIAL dependency on part of a Composite PK' },
      { solveFor: '3nf', label: 'Third Normal Form (3NF)', exprHtml: 'In 2NF + No TRANSITIVE dependency (Non-Key → Non-Key)' },
    ],
    variables: [
      ['A → B', 'Functional Dependency: knowing attribute A uniquely determines attribute B'],
      ['Partial Dependency', 'In `(StudentID, CourseID) → StudentName`, `StudentName` depends ONLY on `StudentID` (violates 2NF!)'],
      ['Transitive Dependency', 'In `StaffID → DeptID → DeptLocation`, non-key `DeptID` determines non-key `DeptLocation` (violates 3NF!)'],
    ],
    trap: 'Any 1NF table whose Primary Key is a SINGLE column (non-composite) is AUTOMATICALLY in 2NF (partial dependency is impossible on a 1-column key!), though it may still violate 3NF!',
    worked: {
      qHtml: 'Table `OrderLine(OrderID, ItemID, ItemName, Qty)` has composite primary key <strong>(OrderID, ItemID)</strong>, and `ItemID → ItemName`. Which Normal Form is violated?',
      stepsHtml: [
        'Cells are atomic with a primary key ⇒ satisfies 1NF',
        'Non-key `ItemName` depends on ONLY `ItemID` (part of composite PK `(OrderID, ItemID)`) ⇒ Partial Dependency violates 2NF!',
      ],
      ansHtml: 'Violates 2NF (split `Item(ItemID, ItemName)` out)',
    },
    keywords: ['normalization', '1nf', '2nf', '3nf', 'partial dependency', 'transitive dependency'],
  },

  /* ─────────────── 2. FILE STORAGE, HASHING, HIT RATIO & BACKUPS (5) ─────────────── */
  {
    id: 'dpf-blocking-factor',
    cat: 'storage',
    name: 'Disk Blocking Factor & Slack Space Formula',
    topicId: 'dp-file-organization',
    summary: 'Calculates how many complete fixed-length logical records fit inside one physical disk block (sector/page) without spanning blocks.',
    rearrangements: [
      { solveFor: 'bfr', label: 'Blocking Factor (bfr)', exprHtml: 'bfr = ⌊Block Size (B) ÷ Record Size (R)⌋' },
      { solveFor: 'blocks', label: 'Blocks Needed for N Records', exprHtml: 'Blocks = ⌈N ÷ bfr⌉' },
      { solveFor: 'slack', label: 'Internal Slack per Block', exprHtml: 'Unused Bytes = B − (bfr × R)' },
    ],
    variables: [
      ['B', 'Physical disk block / page size in Bytes (e.g. 4,096 B)'],
      ['R', 'Fixed logical record length in Bytes (e.g. 300 B)'],
      ['⌊…⌋, ⌈…⌉', 'Floor (round DOWN for records/block) and Ceiling (round UP for total blocks!)'],
    ],
    trap: 'Use FLOOR `⌊B ÷ R⌋` (round DOWN) for unspanned records per block, and CEILING `⌈N ÷ bfr⌉` (round UP) for total disk blocks needed!',
    worked: {
      qHtml: 'Fixed employee records of <strong>300 Bytes</strong> are stored unspanned in <strong>2,048-Byte</strong> disk blocks. Find the Blocking Factor and blocks needed for <strong>50 records</strong>.',
      stepsHtml: [
        'bfr = ⌊2,048 ÷ 300⌋ = ⌊6.826⌋ = 6 records per block (unused slack = 2,048 − 1,800 = 248 B)',
        'Blocks for 50 records = ⌈50 ÷ 6⌉ = ⌈8.33⌉ = 9 disk blocks',
      ],
      ansHtml: 'bfr = 6 records/block · 9 blocks',
    },
    keywords: ['blocking factor', 'disk blocks', 'record size', 'floor ceiling'],
  },
  {
    id: 'dpf-hit-ratio',
    cat: 'storage',
    name: 'Master-File Hit Ratio & Organization Selector',
    topicId: 'dp-file-operations-classification',
    summary: 'Measures the percentage of master-file records accessed during a processing run to choose between Sequential batch and Direct/Indexed access.',
    rearrangements: [
      { solveFor: 'hit', label: 'File Hit Ratio (%)', exprHtml: 'Hit Ratio = (Active Records Accessed ÷ Total Master Records) × 100%' },
    ],
    variables: [
      ['High Hit Ratio (>40%)', 'Monthly payroll touching ~98% of staff → Sequential / Indexed-Sequential batch shines'],
      ['Low Hit Ratio (<5%)', 'ATM withdrawal touching 1 of 5,000,000 accounts → Direct / Hashed or B-Tree Index mandatory!'],
    ],
    trap: 'Using pure Sequential tape/file scan when Hit Ratio is tiny (e.g. 1 ATM customer out of 2 million) wastes 99.9999% I/O; use Direct/Hashed or Indexed access!',
    worked: {
      qHtml: 'A daily bank clearing batch updates <strong>18,000</strong> customer accounts out of a Master File of <strong>450,000</strong> accounts. Calculate the Hit Ratio.',
      stepsHtml: ['Hit Ratio = (18,000 ÷ 450,000) × 100% = 0.04 × 100% = 4%'],
      ansHtml: '4%',
    },
    keywords: ['hit ratio', 'master file', 'transaction file', 'sequential vs direct'],
  },
  {
    id: 'dpf-hash-address',
    cat: 'storage',
    name: 'Direct File Modulo-Division Hash Function',
    topicId: 'dp-file-organization',
    summary: 'Computes an O(1) direct bucket/slot address directly from a record’s numeric key k using prime modulo division.',
    rearrangements: [
      { solveFor: 'slot', label: 'Division Hash Bucket', exprHtml: 'Address h(k) = k mod m &nbsp;(range: 0 to m − 1)' },
      { solveFor: 'probe', label: 'Linear Probing on Collision', exprHtml: 'h<sub>i</sub>(k) = (h(k) + i) mod m' },
    ],
    variables: [
      ['k', 'Numeric primary key of the record (e.g. Matric or Account ID)'],
      ['m', 'Number of hash buckets/slots (chosen as a PRIME number to spread keys evenly)'],
      ['Collision', 'Synonym event when two distinct keys k₁ ≠ k₂ map to the same slot h(k₁) = h(k₂)'],
    ],
    trap: 'When a collision occurs (`h(k₁) = h(k₂)`), the second record is NOT overwritten — Collision Resolution (Linear Probing or Overflow Chaining) places it in the next free slot or linked list!',
    worked: {
      qHtml: 'A direct-access file has <strong>m = 13</strong> buckets (0–12) using `h(k) = k mod 13`. Find the home bucket for `k = 109`, and where `k = 122` goes under Linear Probing.',
      stepsHtml: [
        'For k = 109: 109 = (13 × 8) + 5 ⇒ h(109) = 5 (stored in Bucket 5)',
        'For k = 122: 122 = (13 × 9) + 5 ⇒ h(122) = 5 (Collision at 5!) → Linear Probing places 122 in next free slot `(5 + 1) mod 13 = Bucket 6`',
      ],
      ansHtml: '109 → Bucket 5; 122 → Bucket 6',
    },
    keywords: ['hashing', 'direct file', 'modulo', 'collision', 'linear probing'],
  },
  {
    id: 'dpf-backup-sets',
    cat: 'storage',
    name: 'Full, Incremental & Differential Backup Restore Math',
    topicId: 'dp-backup-disaster-recovery',
    summary: 'Compares daily backup payload size and exact number of backup sets required to restore a crashed system.',
    rearrangements: [
      { solveFor: 'inc', label: 'Incremental Restore Sets', exprHtml: 'Sets = 1 Last Full + ALL Incrementals since Full' },
      { solveFor: 'diff', label: 'Differential Restore Sets', exprHtml: 'Sets = 1 Last Full + ONLY the LATEST Differential (Max 2 sets!)' },
    ],
    variables: [
      ['Full Backup', 'Copies ALL selected files & clears the archive bit (slowest backup, 1-set fastest restore)'],
      ['Incremental', 'Copies ONLY files changed since the LAST backup of ANY kind (clears archive bit → smallest daily size, slowest multi-set restore)'],
      ['Differential', 'Copies ALL files changed since the LAST FULL backup (does NOT clear archive bit → max 2 sets to restore!)'],
    ],
    trap: 'Restoring on Thursday after Sunday Full + Mon/Tue/Wed backups requires 4 sets (`Sun + Mon + Tue + Wed`) for INCREMENTAL, versus ONLY 2 sets (`Sun + Wed`) for DIFFERENTIAL!',
    worked: {
      qHtml: 'A server runs a <strong>Full backup every Sunday</strong> (80 GB) and changes <strong>5 GB of unique files each day</strong> Mon–Thu. Compare total backup storage used Mon–Thu and Thursday night restore sets for Incremental vs Differential.',
      stepsHtml: [
        'Incremental Mon–Thu sizes: 5 + 5 + 5 + 5 = 20 GB; Restore needs Sunday + Mon + Tue + Wed + Thu = 5 sets',
        'Differential Mon–Thu sizes (cumulative since Sun): 5 + 10 + 15 + 20 = 50 GB; Restore needs ONLY Sunday + Thursday = 2 sets!',
      ],
      ansHtml: 'Incremental: 20 GB (5 restore sets) · Differential: 50 GB (2 restore sets)',
    },
    keywords: ['full backup', 'incremental', 'differential', 'restore sets'],
  },
  {
    id: 'dpf-compression-ratio',
    cat: 'storage',
    name: 'Data Compression Ratio & Space Savings Percentage',
    topicId: 'dp-backup-disaster-recovery',
    summary: 'Quantifies archive shrinkage when compressing database dumps or backup volumes.',
    rearrangements: [
      { solveFor: 'ratio', label: 'Compression Ratio', exprHtml: 'Ratio = Uncompressed Size ÷ Compressed Size' },
      { solveFor: 'saving', label: 'Space Savings (%)', exprHtml: 'Savings (%) = [(Original − Compressed) ÷ Original] × 100%' },
    ],
    variables: [
      ['Original Size', 'Raw file size before lossless archive compression'],
      ['Compressed Size', 'Resulting `.zip` / `.gz` / `.zst` archive size'],
    ],
    trap: 'Do not confuse "Compression Ratio 4 : 1" (Compressed is 25% of original) with Space Savings (`1 − 0.25 = 75%` space saved)!',
    worked: {
      qHtml: 'A <strong>120 MB</strong> SQL dump compresses losslessly into a <strong>30 MB</strong> `.gz` archive. Find the Compression Ratio and Space Savings %.',
      stepsHtml: [
        'Compression Ratio = 120 MB ÷ 30 MB = 4 : 1 (or 4)',
        'Space Savings = [(120 − 30) ÷ 120] × 100% = (90 ÷ 120) × 100% = 75%',
      ],
      ansHtml: '4 : 1 ratio · 75% space saved',
    },
    keywords: ['compression ratio', 'space savings', 'archive size'],
  },

  /* ─────────────── 3. SPREADSHEET RANGES, $A$1 & FUNCTIONS (5) ─────────────── */
  {
    id: 'dpf-cell-count',
    cat: 'spreadsheet',
    name: 'Spreadsheet Rectangular Cell-Range Count',
    topicId: 'dp-spreadsheet-fundamentals',
    summary: 'Counts the exact number of cells inside any contiguous spreadsheet range `Col₁Row₁ : Col₂Row₂` inclusively.',
    rearrangements: [
      { solveFor: 'cells', label: 'Total Cells in Range', exprHtml: 'Cells = (R<sub>2</sub> − R<sub>1</sub> + 1) × (C<sub>2</sub> − C<sub>1</sub> + 1)' },
    ],
    variables: [
      ['R₁, R₂', 'Starting and ending row numbers (inclusive → remember `+ 1`!)'],
      ['C₁, C₂', 'Starting and ending column positions (`A=1, B=2, C=3, D=4, E=5, F=6…`)'],
    ],
    trap: 'The classic fencepost error is forgetting `+ 1`! Rows `2` through `6` contain `6 − 2 + 1 = 5` rows, NEVER `4`!',
    worked: {
      qHtml: 'How many individual cells are contained in the Excel/Calc range <strong>`B3:E10`</strong>?',
      stepsHtml: [
        'Rows: 10 − 3 + 1 = 8 rows (`3, 4, 5, 6, 7, 8, 9, 10`)',
        'Columns (`B=2` to `E=5`): 5 − 2 + 1 = 4 columns (`B, C, D, E`) ⇒ Total = 8 × 4 = 32 cells',
      ],
      ansHtml: '32 cells',
    },
    keywords: ['cell range', 'spreadsheet count', 'b3:e10', 'rows times columns'],
  },
  {
    id: 'dpf-cell-ref-offset',
    cat: 'spreadsheet',
    name: 'Relative (`A1`), Absolute (`$A$1`) & Mixed (`$A1` / `A$1`) Copy Rules',
    topicId: 'dp-spreadsheet-fundamentals',
    summary: 'Predicts the exact adjusted formula when copying or dragging a spreadsheet fill-handle across `ΔC` columns and `ΔR` rows.',
    rearrangements: [
      { solveFor: 'rel', label: 'Relative `C₁R₁`', exprHtml: 'Shifts BOTH column (+ΔC) and row (+ΔR)' },
      { solveFor: 'abs', label: 'Absolute `$C$R`', exprHtml: 'Locks BOTH column and row (never changes on copy!)' },
      { solveFor: 'mix', label: 'Mixed `$C1` / `C$1`', exprHtml: 'Dollar `$` locks ONLY the symbol immediately after `$`' },
    ],
    variables: [
      ['$ before Column (`$B4`)', 'Column `B` stays locked; Row `4` shifts by `+ΔR`'],
      ['$ before Row (`B$4`)', 'Column `B` shifts by `+ΔC`; Row `4` stays locked at `4`'],
    ],
    trap: 'The `$` sign locks ONLY what immediately follows it: in `C$2`, column `C` IS FREE to change when dragged right, while row `2` is locked!',
    worked: {
      qHtml: 'Cell <strong>`D3`</strong> contains the formula <strong>`=B3*$B$1+C$1`</strong>. What exact formula appears when `D3` is copied to <strong>`F7`</strong>?',
      stepsHtml: [
        'Offset from `D3` to `F7`: ΔC = +2 columns right (`D→F`), ΔR = +4 rows down (`3→7`)',
        '`B3` (relative) → `D7`; `$B$1` (both locked) → `$B$1`; `C$1` (col shifts +2, row locked) → `E$1`',
      ],
      ansHtml: '`=D7*$B$1+E$1`',
    },
    keywords: ['absolute reference', 'relative reference', 'mixed reference', '$a$1', 'autofill'],
  },
  {
    id: 'dpf-excel-aggregates',
    cat: 'spreadsheet',
    name: 'Spreadsheet `SUM`, `AVERAGE`, `COUNT` vs `COUNTA` Rules',
    topicId: 'dp-spreadsheet-fundamentals',
    summary: 'Evaluates core statistical spreadsheet functions accurately when ranges contain zeros, text labels, or blank cells.',
    rearrangements: [
      { solveFor: 'avg', label: 'AVERAGE Function', exprHtml: '=AVERAGE(range) = SUM(numeric cells) ÷ COUNT(numeric cells)' },
      { solveFor: 'cnt', label: 'COUNT vs COUNTA', exprHtml: 'COUNT = numeric cells only &nbsp;·&nbsp; COUNTA = ALL non-empty cells' },
    ],
    variables: [
      ['Zero `0` vs Blank', '`0` IS counted in both `COUNT` and `AVERAGE`; an empty blank cell or `"Absent"` text is IGNORED by `AVERAGE` and `COUNT`!'],
      ['Operator Precedence', 'Spreadsheet `= 10 + 6 / 2` evaluates `6 / 2` FIRST (`= 13`), following `() → ^ → *,/ → +,-`'],
    ],
    trap: 'Every spreadsheet formula MUST begin with `=` (typing `SUM(A1:A5)` without `=` stores plain text!). Also, `0` lowers `AVERAGE`, whereas `"ABS"` text is skipped by `AVERAGE` and counted only by `COUNTA`!',
    worked: {
      qHtml: 'Cells `A1:A5` contain: <strong>`10`, `20`, `0`, `"Absent"`, and _(blank)_</strong>. Evaluate `=COUNT(A1:A5)`, `=COUNTA(A1:A5)`, and `=AVERAGE(A1:A5)`.',
      stepsHtml: [
        '`COUNT` counts numeric values (`10, 20, 0`) = 3; `COUNTA` counts all non-blank (`10, 20, 0, "Absent"`) = 4',
        '`AVERAGE` = (10 + 20 + 0) ÷ 3 = 30 ÷ 3 = 10',
      ],
      ansHtml: 'COUNT = 3 · COUNTA = 4 · AVERAGE = 10',
    },
    keywords: ['sum', 'average', 'count', 'counta', 'blank vs zero'],
  },
  {
    id: 'dpf-excel-if-countif',
    cat: 'spreadsheet',
    name: 'Conditional Spreadsheet Functions (`IF`, `COUNTIF`, `SUMIF`)',
    topicId: 'dp-spreadsheet-fundamentals',
    summary: 'Automates pass/fail grading, commission tiers, and filtered tallies inside worksheet models.',
    rearrangements: [
      { solveFor: 'if', label: 'Logical IF Syntax', exprHtml: '=IF(condition, value_if_true, value_if_false)' },
      { solveFor: 'cntif', label: 'Conditional Tally', exprHtml: '=COUNTIF(range, "&gt;=50") &nbsp;·&nbsp; =SUMIF(range, criteria, sum_range)' },
    ],
    variables: [
      ['condition', 'Comparison using `=`, `<>` (not equal!), `<`, `<=`, `>`, `>=`, wrapped in `AND(...)` / `OR(...)`'],
      ['Criteria Quotes', 'In `COUNTIF`/`SUMIF`, comparison criteria MUST be enclosed in quotes, e.g. `">=70"`'],
    ],
    trap: '"Not equal to" in spreadsheets (and SQL!) is written `<>` (NOT `!=`), and text outputs inside `IF` must be wrapped in double quotes (`"Pass"`, `"Fail"`)!',
    worked: {
      qHtml: 'Given `C2 = 68` and `D2 = 45`, evaluate <strong>`=IF(AND(C2>=50, D2>=50), "Promoted", "Repeat")`</strong>.',
      stepsHtml: [
        'Check `C2 >= 50` (68 ≥ 50 → TRUE) and `D2 >= 50` (45 ≥ 50 → FALSE)',
        '`AND(TRUE, FALSE)` evaluates to FALSE ⇒ returns the 3rd argument `"Repeat"`',
      ],
      ansHtml: '`"Repeat"`',
    },
    keywords: ['if function', 'countif', 'sumif', 'nested if', 'spreadsheet logic'],
  },

  /* ─────────────── 4. SQL CLAUSES, AGGREGATES & JOINS (3) ─────────────── */
  {
    id: 'dpf-sql-order',
    cat: 'sql',
    name: 'SQL Lexical Syntax vs Logical Execution Order',
    topicId: 'dp-sql-ddl-dml',
    summary: 'Contrasts the mandatory written clause order of a SQL `SELECT` query with the internal engine execution sequence.',
    rearrangements: [
      { solveFor: 'write', label: 'Written SQL Syntax Order', exprHtml: 'SELECT … FROM … JOIN … WHERE … GROUP BY … HAVING … ORDER BY …' },
      { solveFor: 'exec', label: 'Engine Execution Order', exprHtml: '1. FROM/JOIN → 2. WHERE → 3. GROUP BY → 4. HAVING → 5. SELECT → 6. ORDER BY' },
    ],
    variables: [
      ['WHERE', 'Filters individual raw rows BEFORE grouping (CANNOT contain `COUNT()`, `SUM()`, or `AVG()`!)'],
      ['HAVING', 'Filters aggregated groups AFTER `GROUP BY` (e.g. `HAVING AVG(Score) >= 70`)'],
    ],
    trap: 'Writing `WHERE COUNT(*) > 5` is a guaranteed SQL syntax error! Row filters before grouping belong in `WHERE`; aggregate filters after `GROUP BY` MUST use `HAVING`!',
    worked: {
      qHtml: 'Write a SQL query on `Results(Dept, Score)` to list departments whose <strong>average score among students scoring ≥ 40</strong> exceeds <strong>65</strong>, highest average first.',
      stepsHtml: [
        'Filter raw rows first with `WHERE Score >= 40`, then group with `GROUP BY Dept`',
        'Filter group averages with `HAVING AVG(Score) > 65` and sort with `ORDER BY AVG(Score) DESC`',
      ],
      ansHtml: '`SELECT Dept, AVG(Score) FROM Results WHERE Score >= 40 GROUP BY Dept HAVING AVG(Score) > 65 ORDER BY AVG(Score) DESC;`',
    },
    keywords: ['sql order', 'where vs having', 'group by', 'order by', 'select'],
  },
  {
    id: 'dpf-sql-wildcards',
    cat: 'sql',
    name: 'SQL Pattern Matching (`LIKE` `%` vs `_`) & `NULL` Rules',
    topicId: 'dp-sql-ddl-dml',
    summary: 'Matches partial text strings accurately and handles unknown `NULL` values in SQL predicates and aggregates.',
    rearrangements: [
      { solveFor: 'like', label: 'LIKE Wildcards', exprHtml: '`%` = 0, 1, or many chars &nbsp;·&nbsp; `_` = EXACTLY 1 character' },
      { solveFor: 'null', label: 'NULL Predicate Rule', exprHtml: 'Use `IS NULL` / `IS NOT NULL` &nbsp;(NEVER `= NULL`!)' },
    ],
    variables: [
      ['`\'A%\'` vs `\'%a\'`', 'Starts with A vs Ends with a · `\'_a%\'` = second letter is `a`'],
      ['`COUNT(*)` vs `COUNT(col)`', '`COUNT(*)` counts ALL rows including NULLs; `COUNT(col)` and `AVG(col)` IGNORE `NULL` values!'],
    ],
    trap: 'In SQL three-valued logic, `Phone = NULL` evaluates to UNKNOWN (returning 0 rows!) — ALWAYS write `WHERE Phone IS NULL`!',
    worked: {
      qHtml: 'In a 10-row `Staff` table, 3 rows have `Bonus` = `NULL` and the other 7 rows have `Bonus` = `10,000`. Evaluate `COUNT(*)` vs `COUNT(Bonus)` vs `AVG(Bonus)`.',
      stepsHtml: [
        '`COUNT(*)` counts all 10 rows = 10; `COUNT(Bonus)` skips the 3 NULLs = 7',
        '`AVG(Bonus)` divides sum (70,000) by non-null count (7) = 10,000 (NOT 7,000!)',
      ],
      ansHtml: 'COUNT(*) = 10 · COUNT(Bonus) = 7 · AVG(Bonus) = 10,000',
    },
    keywords: ['sql like', 'wildcard % _', 'is null', 'count star vs count column'],
  },
  {
    id: 'dpf-sql-joins',
    cat: 'sql',
    name: 'SQL `INNER JOIN` vs `LEFT JOIN` Output Row Rules',
    topicId: 'dp-sql-ddl-dml',
    summary: 'Determines how many rows survive when joining a Parent table (`1`) and a Child table (`M`) with unmatched rows.',
    rearrangements: [
      { solveFor: 'inner', label: 'INNER JOIN', exprHtml: 'Returns ONLY rows with matching join keys in BOTH tables' },
      { solveFor: 'left', label: 'LEFT OUTER JOIN', exprHtml: 'Returns ALL Left-table rows + matched Right rows (`NULL` where unmatched)' },
    ],
    variables: [
      ['1 : M FK Match', 'If all `M` child rows have a non-null valid Foreign Key referencing Parent, `INNER JOIN` returns exactly `M` rows!'],
      ['Unmatched Parents', 'Departments with 0 employees vanish in `INNER JOIN`, and appear with `NULL` staff columns in `Department LEFT JOIN Staff`'],
    ],
    trap: 'To find parents with ZERO children (e.g. courses with 0 enrolled students), use `LEFT JOIN … WHERE child.id IS NULL` — `INNER JOIN` hides them completely!',
    worked: {
      qHtml: '`Departments` has <strong>6 rows</strong> (2 departments are brand-new with 0 staff). `Staff` has <strong>25 rows</strong>, each assigned to one of the other 4 departments. How many rows are returned by `Departments INNER JOIN Staff` vs `Departments LEFT JOIN Staff`?',
      stepsHtml: [
        '`INNER JOIN`: every one of the 25 staff matches 1 department (the 2 empty departments drop out) ⇒ 25 rows',
        '`LEFT JOIN`: 25 matched staff rows + 2 unmatched empty-department rows (padded with NULLs) ⇒ 27 rows',
      ],
      ansHtml: 'INNER JOIN = 25 rows · LEFT JOIN = 27 rows',
    },
    keywords: ['inner join', 'left join', 'unmatched rows', 'foreign key join'],
  },

  /* ─────────────── 5. DATA INTEGRITY, PARITY & PRINT DPI (3) ─────────────── */
  {
    id: 'dpf-parity-bit',
    cat: 'integrity',
    name: 'Even Parity & Odd Parity Single-Bit Error Detection',
    topicId: 'dp-data-validation-verification',
    summary: 'Appends 1 redundant parity bit to each 7-bit character so the total count of `1`-bits across all 8 bits is strictly even (or odd).',
    rearrangements: [
      { solveFor: 'even', label: 'Even Parity Rule', exprHtml: 'Total number of `1`-bits (Data + Parity) MUST be EVEN (XOR = 0)' },
      { solveFor: 'odd', label: 'Odd Parity Rule', exprHtml: 'Total number of `1`-bits (Data + Parity) MUST be ODD (XOR = 1)' },
    ],
    variables: [
      ['Single-bit flip', 'Always changes 1-count from Even ↔ Odd → 100% detected!'],
      ['Two-bit flip & Transposition', 'If TWO bits flip simultaneously (`01 → 10`), parity stays Even → UNDETECTED by simple 1D parity!'],
    ],
    trap: 'Simple parity detects ANY odd number of bit flips (1, 3, 5…), yet CANNOT detect an EVEN number of bit flips (e.g. 2 bits inverted) and cannot pinpoint which bit flipped without a 2D Parity Block / Hamming code!',
    worked: {
      qHtml: 'Determine the <strong>Even Parity bit</strong> appended to the 7-bit ASCII payload <strong>`1011001`</strong>.',
      stepsHtml: [
        'Count `1`-bits in `1011001`: there are four `1`s (`1, 1, 1, 1`)',
        'Since 4 is ALREADY even, set the Even Parity bit = `0` (transmitted byte = `10110010`)',
      ],
      ansHtml: 'Parity bit = `0` (`10110010`)',
    },
    keywords: ['even parity', 'odd parity', 'error detection', 'bit flip'],
  },
  {
    id: 'dpf-check-digit',
    cat: 'integrity',
    name: 'Modulo-10 / Modulo-11 Weighted Check-Digit Formula',
    topicId: 'dp-data-validation-verification',
    summary: 'Validates ISBNs, barcodes, bank accounts, and NIN/exam numbers against human transcription and adjacent-digit transposition errors.',
    rearrangements: [
      { solveFor: 'wsum', label: 'Weighted Sum S', exprHtml: 'S = ∑ (d<sub>i</sub> × w<sub>i</sub>)' },
      { solveFor: 'mod11', label: 'Mod-11 Check Digit', exprHtml: 'r = S mod 11 &nbsp;⇒&nbsp; Check Digit = (11 − r) mod 11 &nbsp;(10 → X)' },
    ],
    variables: [
      ['d_i', 'Individual digits of the account, barcode, or ISBN code'],
      ['w_i', 'Distinct positional weights (e.g. `5, 4, 3, 2` from left to right)'],
    ],
    trap: 'Because adjacent positions carry DIFFERENT weights (`w_i ≠ w_{i+1}`), swapping `47` into `74` changes the weighted sum and catches transposition errors — whereas an unweighted digit sum (`4+7 = 7+4`) misses swaps completely!',
    worked: {
      qHtml: 'Compute the Modulo-11 check digit for code <strong>`2 4 1 5`</strong> using positional weights <strong>`5, 4, 3, 2`</strong> (`Check = 11 − (S mod 11)`).',
      stepsHtml: [
        'Weighted sum S = (2 × 5) + (4 × 4) + (1 × 3) + (5 × 2) = 10 + 16 + 3 + 10 = 39',
        'Remainder r = 39 mod 11 = 6 (since 11 × 3 = 33) ⇒ Check Digit = 11 − 6 = 5 (full code `24155`)',
      ],
      ansHtml: 'Check Digit = 5 (`24155`)',
    },
    keywords: ['check digit', 'modulo 11', 'isbn', 'barcode', 'transposition error'],
  },
  {
    id: 'dpf-print-dpi',
    cat: 'integrity',
    name: 'Graphic Print Dimensions, Pixel Resolution & DPI Law',
    topicId: 'dp-graphic-packages',
    summary: 'Relates digital canvas pixel dimensions (`W_px × H_px`) to physical print size in inches at a target Dots-Per-Inch (DPI) density.',
    rearrangements: [
      { solveFor: 'inch', label: 'Print Size (inches)', exprHtml: 'Print Width (in) = Pixel Width ÷ DPI' },
      { solveFor: 'px', label: 'Required Pixels', exprHtml: 'Required Pixels = Print Width (in) × DPI' },
    ],
    variables: [
      ['DPI / PPI', 'Dots (or Pixels) Per Inch — commercial offset print standard = `300 DPI`; web screen preview = `72–96 PPI`'],
      ['Color Mode', 'Use `RGB` (additive light) for digital screens and `CMYK` (subtractive ink) for commercial press printing!'],
    ],
    trap: 'Designing a poster in `72 DPI RGB` instead of `300 DPI CMYK` causes blurry pixelation and dull color shifts when sent to a commercial printing press!',
    worked: {
      qHtml: 'A graphic designer exports an <strong>`8 inch × 10 inch`</strong> magazine cover for crisp <strong>`300 DPI`</strong> press printing. What exact pixel dimensions are required?',
      stepsHtml: [
        'Width_px = 8 in × 300 DPI = 2,400 pixels',
        'Height_px = 10 in × 300 DPI = 3,000 pixels',
      ],
      ansHtml: '2,400 × 3,000 pixels (in CMYK)',
    },
    keywords: ['dpi', 'print resolution', 'cmyk vs rgb', 'graphic packages'],
  },
  {
    id: 'dpf-sql-ddl-dml',
    cat: 'sql',
    name: 'SQL Sub-Languages: DDL vs DML & DELETE vs TRUNCATE vs DROP',
    topicId: 'dp-sql-ddl-dml',
    summary: 'Distinguishes schema-defining DDL commands (`CREATE, ALTER, DROP, TRUNCATE`) from row-manipulating DML commands (`SELECT, INSERT, UPDATE, DELETE`) and DCL/TCL.',
    rearrangements: [
      { solveFor: 'ddl', label: 'DDL (Schema Structure)', exprHtml: 'DDL = CREATE · ALTER · DROP · TRUNCATE &nbsp;(table schema)' },
      { solveFor: 'dml', label: 'DML (Row Records)', exprHtml: 'DML = SELECT · INSERT · UPDATE · DELETE &nbsp;(table rows)' },
    ],
    variables: [
      ['DELETE FROM T WHERE ...', 'DML command: removes matching rows ONLY; table structure & indexes remain; supports `ROLLBACK`'],
      ['TRUNCATE TABLE T', 'DDL command: wipes ALL rows rapidly without `WHERE`, keeping the empty table schema intact'],
      ['DROP TABLE T', 'DDL command: destroys BOTH all rows AND the entire table definition/schema permanently'],
    ],
    trap: 'Running `DELETE FROM Students;` WITHOUT a `WHERE` clause wipes every row in the table (though the empty table structure survives), whereas `DROP TABLE Students;` erases the table schema itself!',
    worked: {
      qHtml: 'A school DBA wants to empty all temporary mock-score rows from table <strong>`TempScores`</strong> while keeping its columns and structure ready for next term, vs completely removing an obsolete table <strong>`Old2019`</strong>. State the two exact SQL statements.',
      stepsHtml: [
        'Keep schema, wipe all rows rapidly → `TRUNCATE TABLE TempScores;` (or `DELETE FROM TempScores;`)',
        'Destroy both data AND table schema permanently → `DROP TABLE Old2019;`',
      ],
      ansHtml: 'TRUNCATE TABLE TempScores; and DROP TABLE Old2019;',
    },
    keywords: ['ddl vs dml', 'delete vs truncate vs drop', 'sql commands', 'schema'],
  },
];
