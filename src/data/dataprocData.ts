import type {
  Beat,
  IdeaBeat,
  InteractiveLesson,
  TeachBeat,
  TeachBlock,
  Topic,
} from '../types';
import { perm } from '../utils/engine';
import { DATAPROC_TOPICS_PART1 } from './dataprocTopicsPart1';
import { DATAPROC_TOPICS_PART2 } from './dataprocTopicsPart2';
import { DATAPROC_TOPICS_PART3 } from './dataprocTopicsPart3';

interface DataProcTableSpec {
  title: string;
  headers: string[];
  rows: string[][];
}

const DATAPROC_TEACH_TABLES: Record<string, DataProcTableSpec> = {
  'dp-history-digitalization': {
    title: 'Landmarks of Computing & Digitalization Timeline',
    headers: ['Era / Pioneer', 'Device / Breakthrough', 'Data Processing Significance'],
    rows: [
      ['Manual & Mechanical', 'Abacus · Slide Rule (analog logs) · Pascaline · Leibniz Wheel', 'Positional bead counting → geared add/multiply registers'],
      ['Punched-Card Era', 'Jacquard Loom (1801) · Babbage Analytical Engine · Hollerith (1890)', 'Binary card control, stored-program blueprint & electromechanical census'],
      ['Electronic Era', 'ENIAC & UNIVAC I → Transistors → ICs → Microprocessors', 'Orders-of-magnitude leap in speed, reliability & compact storage'],
      ['Digitalization', 'Converting analog records/signals into discrete binary (0 & 1)', 'Enables instant SQL search, lossless replication & cryptographic security'],
    ],
  },
  'dp-data-vs-information': {
    title: 'Raw Data vs Processed Information & Quality Criteria',
    headers: ['Dimension', 'Data (Input)', 'Information (Output)'],
    rows: [
      ['Definition', 'Raw, unorganized facts, figures & observations (`78, 64, 91`)', 'Processed, contextualized output guiding decisions (`Class Mean = 77.7%`)'],
      ['Types & Sources', 'Quantitative (discrete/continuous) vs Qualitative · Primary vs Secondary', 'Must be Accurate, Timely, Complete, Relevant & Concise'],
      ['Manual vs Electronic', 'Paper ledgers: slow, high transcription error, bulky cabinets', 'Electronic DBMS: fast aggregation, validation checks & instant backup'],
    ],
  },
  'dp-data-processing-cycle': {
    title: 'Six-Stage Data Processing Cycle & Processing Modes',
    headers: ['Stage / Mode', 'Core Mechanism', 'Signature Real-World Workload'],
    rows: [
      ['Gathering → Collation → Input', 'Collect raw facts → sort/verify → capture via keyboard/scanner/API', 'Eliminates GIGO before CPU processing begins'],
      ['Processing → Storage → Output', 'Validate, sort, calculate → persist to DB/SSD → render reports', 'Feedback loop feeds output insights into next cycle'],
      ['Batch Processing', 'Accumulates transactions over a period and processes together offline', 'Monthly staff payroll, utility bill generation, clearing batches'],
      ['Online Real-Time & Distributed', 'Processes each event instantaneously (`<1 s`) across networked nodes', 'ATM cash withdrawals, airline seat booking, POS transfers'],
    ],
  },
  'dp-computer-classifications': {
    title: 'Three-Axis Classification of Computer Systems',
    headers: ['Classification Axis', 'Categories', 'Representative Example'],
    rows: [
      ['By Data Signal Type', 'Analog (continuous) · Digital (discrete 0/1) · Hybrid (both + ADC)', 'Analog: Bourdon gauge · Hybrid: Hospital ICU ECG monitor'],
      ['By Size & Capacity', 'Supercomputer → Mainframe → Minicomputer → Microcomputer', 'Supercomputer: FLOPS weather model · Mainframe: Bank TPS'],
      ['By Purpose', 'General-Purpose vs Special-Purpose (Dedicated / Embedded)', 'General: Laptop PC · Special: ATM controller, Traffic light MCU'],
    ],
  },
  'dp-ict-society-impacts': {
    title: 'Sectoral ICT Applications & Socio-Economic Trade-Offs',
    headers: ['Sector', 'Key Digital Systems', 'Operational Impact & Watchout'],
    rows: [
      ['Banking & Commerce', 'ATM, POS, EFT, NIBSS Instant Payment, BVN, E-Commerce', '24/7 cashless settlement; requires 2FA & anti-phishing vigilance'],
      ['Education & Health', 'CBT portals, LMS virtual labs, Telemedicine, EMR records', 'Equitable remote access; guarded by patient privacy laws'],
      ['Workforce & Society', 'Robotic automation, remote telecommuting, e-governance', 'Boosts productivity & new IT jobs, while routine clerical roles require reskilling'],
    ],
  },
  'dp-information-processing-transmission': {
    title: 'Ancient vs Modern Information Transmission & Link Modes',
    headers: ['Category', 'Methods / Modes', 'Technical Characteristic'],
    rows: [
      ['Ancient vs Modern Media', 'Town crier, talking drums, smoke vs Fibre, Satellite, Broadcast, IP', 'Modern digital channels overcome line-of-sight & distance limits'],
      ['Simplex / Half / Full Duplex', 'One-way (TV) · Two-way alternating (Walkie-talkie) · Simultaneous (Phone)', 'Full-duplex doubles effective conversational responsiveness'],
      ['Serial vs Parallel · Sync vs Async', '1-bit stream (USB/PCIe/Fibre) vs Multi-wire · Shared clock vs Start/Stop bits', 'High-speed long links use Serial to avoid multi-wire clock skew!'],
    ],
  },
  'dp-operating-systems-dp': {
    title: 'Operating System Classifications & File System Roles',
    headers: ['OS Type / Subsystem', 'Core Behaviour', 'Typical Platform'],
    rows: [
      ['Single-User Multitasking', 'One logged-in user running multiple apps via preemptive time-slicing', 'Windows 11, macOS, Ubuntu Desktop, Android'],
      ['Multi-User / Server OS', 'Isolates concurrent user sessions, quotas & permissions simultaneously', 'Linux Enterprise Server, UNIX, Windows Server'],
      ['Real-Time OS (RTOS)', 'Guarantees deterministic hard deadlines for safety-critical interrupts', 'Aircraft autopilot, ABS brakes, pacemakers'],
      ['File System & Hierarchy', 'NTFS / ext4 / APFS · Tree path (`Root → Folders → Files.ext`)', 'Tracks sectors, access control lists (ACLs) & metadata'],
    ],
  },
  'dp-word-processing': {
    title: 'Word Processing Features, Layout & Productivity Shortcuts',
    headers: ['Feature / Shortcut', 'Exact Function', 'Document Publishing Tip'],
    rows: [
      ['Mail Merge', 'Combines `Main Document Template` + `Data Source` (CSV/Excel)', 'Generates 500 personalized admission letters in seconds'],
      ['Page Setup & Gutter', 'Portrait vs Landscape · Gutter adds extra inner margin for binding', 'Prevents hole-punching or spiral binding from clipping text'],
      ['Review & Proofing', 'Track Changes, Comments, Find & Replace (`Ctrl+H`), Thesaurus (`Shift+F7`)', '`Ctrl+Enter` inserts clean Page Break (never tap Enter 20 times!)'],
      ['Essential Shortcuts', '`Ctrl+B/I/U`, `Ctrl+J` (Justify), `Ctrl+Z` (Undo), `Ctrl+Y` (Redo)', 'Styles (`Heading 1..3`) auto-build a dynamic Table of Contents'],
    ],
  },
  'dp-spreadsheet-fundamentals': {
    title: 'Spreadsheet Addressing, Functions & Error Diagnostics',
    headers: ['Concept', 'Syntax / Formula', 'Behaviour & Meaning'],
    rows: [
      ['Cell References', '`A1` (Relative) · `$A$1` (Absolute) · `$A1` / `A$1` (Mixed)', '`$` locks column and/or row when auto-filling formulas'],
      ['Core Functions', '`=SUM(B2:B9)`, `=AVERAGE(...)`, `=COUNT(...)`, `=COUNTA(...)`, `=COUNTIF(...)`', '`COUNT` counts numbers only; `COUNTA` counts all non-empty cells'],
      ['Decision & Lookup', '`=IF(C2>=50,"Pass","Fail")` · `=VLOOKUP(key, table, col, FALSE)`', '`FALSE` enforces exact-match lookup on IDs'],
      ['Error Codes', '`#####` (narrow col) · `#DIV/0!` · `#VALUE!` · `#REF!` · `#NAME?`', 'Widen column for `#####`; check deleted cells for `#REF!`'],
    ],
  },
  'dp-safety-ethics-ergonomics': {
    title: 'Computer Room Safety, Power Protection & Ergonomics',
    headers: ['Pillar', 'Standard Requirement', 'Hazard Prevented'],
    rows: [
      ['Fire Suppression', 'Class C **CO₂** or Dry-Powder / Clean-Agent extinguisher ONLY', 'Water/foam conducts electricity & ruins circuit boards!'],
      ['Power Conditioning', 'Surge Protector + Automatic Voltage Regulator (AVR) + **UPS**', 'UPS battery provides clean shutdown time during blackouts'],
      ['Ergonomics', 'Monitor top at eye level (`50–70 cm`), neutral wrists, lumbar chair, `20-20-20` rule', 'Prevents RSI / Carpal Tunnel, back strain & Computer Vision Syndrome'],
      ['Computer Ethics', 'Respect privacy, cite sources, never deploy malware or pirated software', 'Aligns with Ten Commandments of Computer Ethics & NDPA'],
    ],
  },
  'dp-data-models': {
    title: 'Data Abstraction Levels & Classic Database Models',
    headers: ['Model / Level', 'Structural Rule', 'Strength & Limitation'],
    rows: [
      ['Conceptual → Logical → Physical', 'Business entities → Normalized keys/tables → DBMS types & indexes', 'Separates stakeholder clarity from disk storage tuning'],
      ['Hierarchical Model', 'Tree structure: 1 parent → N children (each child has **1 parent**)', 'Fast 1:N traversal; cannot model M:N naturally without duplication'],
      ['Network Model', 'Directed graph: member child can have **multiple owner parents**', 'Handles M:N links, but complex pointer navigation'],
      ['Relational Model (Codd)', '2D Relations (tuples & attributes) linked logically by PK/FK values', 'Declarative SQL, data independence & strong mathematical foundation'],
    ],
  },
  'dp-entity-relationship-erd': {
    title: 'ER Diagram Symbols, Attributes & Cardinality Mapping',
    headers: ['ER Construct', 'Chen Notation & Rule', 'Relational Table Mapping'],
    rows: [
      ['Strong vs Weak Entity', 'Rectangle vs Double Rectangle (identifying relationship)', 'Weak entity PK includes owner entity’s Primary Key'],
      ['Attributes', 'Simple (oval), Composite (branched), Multivalued (double oval), Derived (dashed)', 'Multivalued → separate child table; Derived → computed in query/view'],
      ['1:1 & 1:N Links', 'Crow’s Foot `|` (one) vs three-pronged fork (many)', 'In `1:N`, place the **"1"-side PK as FK inside the "N"-side table**'],
      ['M:N Relationship', 'Many-to-Many (e.g. `Student ↔ Course`)', 'Create a **3rd Associative / Junction Table** `(StudentID, CourseID)`'],
    ],
  },
  'dp-relational-model-keys': {
    title: 'Relational Keys, Degree/Cardinality & Integrity Constraints',
    headers: ['Term / Constraint', 'Exact Definition', 'Integrity / Sizing Rule'],
    rows: [
      ['Degree vs Cardinality', 'Degree = # of Columns (attributes) · Cardinality = # of Rows (tuples)', '`R × S` has Degree `d₁ + d₂` and Cardinality `n₁ × n₂`'],
      ['Candidate / Primary / Alternate', 'Minimal superkeys (`k`) → 1 chosen PK + `(k − 1)` Alternate Keys', 'Superkey may have extra columns; Candidate key is minimal'],
      ['Entity Integrity', 'Applies to Primary Key (including every column of a composite PK)', 'PK must be **UNIQUE** and **NOT NULL**'],
      ['Referential Integrity', 'Applies to Foreign Key referencing parent Primary Key', 'Every non-null FK must match an existing parent PK'],
    ],
  },
  'dp-normalization': {
    title: 'Database Normalization Progression (UNF → 3NF)',
    headers: ['Normal Form', 'Eliminated Defect', 'Exact Structural Test'],
    rows: [
      ['First Normal Form (1NF)', 'Repeating groups & comma-separated multi-valued cells', 'Every cell is **atomic** + Primary Key defined'],
      ['Second Normal Form (2NF)', 'Partial functional dependency on part of a **composite** PK', 'In 1NF + every non-key attribute depends on the **WHOLE** PK'],
      ['Third Normal Form (3NF)', 'Transitive dependency (`PK → NonKeyA → NonKeyB`)', 'In 2NF + **no non-key column determines another non-key column**'],
      ['Anomalies Cured', 'Insertion, Update & Deletion anomalies', 'Single-column PK in 1NF is automatically in 2NF!'],
    ],
  },
  'dp-dbms-architecture': {
    title: 'DBMS Core Objects & Architecture Summary',
    headers: ['DBMS Component', 'Primary Role', 'Critical Distinction'],
    rows: [
      ['Table', 'Physically stores records (rows) and typed fields (columns)', 'The **ONLY** object among the four that stores raw data'],
      ['Query', 'Filters, joins, calculates & updates records via criteria/SQL', 'Dynamic question over Tables; does not duplicate storage'],
      ['Form', 'Graphical screen with dropdowns/validation for **data entry**', 'Protects clerks from editing raw datasheet tables directly'],
      ['Report & Data Dictionary', 'Read-only grouped **print/PDF** summary · System metadata catalog', 'Deleting a Report never deletes underlying Table rows'],
    ],
  },
  'dp-sql-ddl-dml': {
    title: 'SQL Sublanguages, Clause Order, Wildcards & Joins',
    headers: ['SQL Topic', 'Syntax / Rule', 'Exam Watchout'],
    rows: [
      ['DDL vs DML vs DCL vs TCL', 'DDL: `CREATE/ALTER/DROP` · DML: `SELECT/INSERT/UPDATE/DELETE`', 'DCL: `GRANT/REVOKE` · TCL: `COMMIT/ROLLBACK`'],
      ['SELECT Clause Order', '`SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY`', '`WHERE` filters rows before grouping; `HAVING` filters groups!'],
      ['Wildcards & NULLs', '`LIKE`: `%` (0+ chars), `_` (exact 1 char) · `IS NULL` / `IS NOT NULL`', '`WHERE col = NULL` always fails; `COUNT(col)` ignores NULLs'],
      ['INNER vs LEFT JOIN', 'Matched-only rows vs All left rows (`NULL` when unmatched on right)', 'Always include `WHERE` on `UPDATE`/`DELETE` or ALL rows change!'],
    ],
  },
  'dp-file-organization': {
    title: 'File Organization Methods, Blocking & Hashing',
    headers: ['Organization Method', 'Record Placement & Access', 'Storage Media & Best Workload'],
    rows: [
      ['Serial', 'Unsorted chronological arrival order; linear scan', 'Magnetic tape / append-only audit logs'],
      ['Sequential', 'Sorted by key field; fast batch sweep, slow single insert', 'Tape or Disk · High hit-ratio monthly payroll'],
      ['Indexed-Sequential (ISAM)', 'Sorted blocks + index table; supports BOTH batch & direct lookup', 'DASD (SSD/HDD) · Utility billing + live inquiries'],
      ['Direct / Hashed & Blocking', '`Address = K mod m` (`O(1)`) · `BF = ⌊BlockSize / RecordSize⌋`', 'SSD/HDD ONLY (never tape!) · ATM/POS real-time lookups'],
    ],
  },
  'dp-file-operations-classification': {
    title: 'Enterprise File Classes, Hit Ratio & GFS Rotation',
    headers: ['File Class / Metric', 'Definition', 'Operational Rule'],
    rows: [
      ['Master vs Transaction', 'Semi-permanent entity balances vs Daily change events', 'Transaction file updates Master file (`Father + Trans → Son`)'],
      ['Reference vs Scratch', 'Stable lookup table (tax rates) vs Temporary sort/merge workspace', 'Scratch/work files are deleted automatically when the job ends'],
      ['Hit Ratio (`HR`)', '`(Active Records Accessed ÷ Total Master Records) × 100%`', 'High `HR` → Sequential batch; Low `HR` → Direct/Indexed'],
      ['Grandfather–Father–Son', 'Retains 3 generations of Master files + Transaction logs', 'Corrupted `Son` is rebuilt by re-running `Father + Transactions`'],
    ],
  },
  'dp-presentation-packages': {
    title: 'Presentation Views, Slide Master & Delivery Controls',
    headers: ['Feature / Control', 'Shortcut / Location', 'Exact Purpose'],
    rows: [
      ['Slide Master vs Slide Sorter', 'View → Slide Master · View → Slide Sorter', 'Global branding/fonts across all slides vs Thumbnail reordering'],
      ['New Slide vs New Deck', '`Ctrl + M` (New Slide) vs `Ctrl + N` (New Presentation)', 'Classic exam trap — never confuse `Ctrl+M` with `Ctrl+N`!'],
      ['Start Slide Show', '`F5` (from Slide 1) · `Shift + F5` (from Current Slide)', 'Press `B` or `W` during delivery to pause on black/white screen'],
      ['Transition vs Animation', 'Between whole slides vs Individual objects inside one slide', 'Follow 6×6 legibility rule; keep full script in Speaker Notes'],
    ],
  },
  'dp-web-design-packages': {
    title: 'Web Technologies, Authoring Tools & Publishing Stack',
    headers: ['Layer / Service', 'Core Technology / Examples', 'Role in Live Website'],
    rows: [
      ['HTML / CSS / JS', 'HTML5 (`<a>`, `<img>`, `<form>`) · CSS3 layout · JavaScript logic', 'Structure & semantics · Visual styling · Client interactivity'],
      ['Authoring Suites', 'VS Code (code) · Dreamweaver/Webflow (WYSIWYG) · WordPress (CMS)', 'CMS stores dynamic content in a database for multi-editor teams'],
      ['Domain, DNS & Hosting', '`.ng` domain (NiRA) + DNS `A/CNAME` records + 24/7 Web Server', 'Domain = human name; Hosting = server files (`index.html` root)'],
      ['Secure Deployment', '`HTTPS` (TLS) + `SFTP` / Git CI-CD + `<form method="POST">`', 'Never send passwords via `GET` query strings or plain `FTP`!'],
    ],
  },
  'dp-graphic-packages': {
    title: 'Vector vs Raster Graphics, Colour Models & Print DPI',
    headers: ['Dimension', 'Vector Graphics', 'Raster / Bitmap Graphics'],
    rows: [
      ['Packages & Formats', 'CorelDRAW (`.cdr`), Illustrator (`.ai`), Inkscape (`.svg`)', 'Photoshop (`.psd`), GIMP (`.xcf`), MS Paint (`.png`, `.jpg`, `.bmp`)'],
      ['Scaling & Geometry', 'Mathematical Bézier paths → infinite zoom with **zero blur**', 'Fixed pixel grid → pixelates when enlarged beyond native size'],
      ['CorelDRAW Tools', '**Pick** (select/move/rotate) · **Shape `F10`** (edit curve nodes)', '`Ctrl` + Ellipse/Rectangle constrains exact circle / square'],
      ['Colour & Print Math', 'Screens = **RGB** (additive light) · Print = **CMYK** (`K` = Key Black)', '`Print Inches = Pixels ÷ DPI` (`300 DPI` standard offset print)'],
    ],
  },
  'dp-computer-maintenance': {
    title: 'Preventive, Corrective & Predictive Maintenance Guide',
    headers: ['Maintenance Type / Protocol', 'Actions & Tools', 'Safety / Hardware Watchout'],
    rows: [
      ['Preventive Maintenance', 'Scheduled dust blowing, OS/AV patching, UPS battery tests', 'Stops thermal throttling & sudden component failure before it starts'],
      ['Corrective Maintenance', 'Replacing dead PSU, cracked LCD, or unseated RAM after fault', 'POST beep codes diagnose pre-video RAM/GPU boot faults'],
      ['Predictive Maintenance', 'S.M.A.R.T. drive health & CPU/UPS telemetry trend alerts', 'Swaps degrading disks before catastrophic data loss'],
      ['ESD & Cleaning Rules', 'Unplug AC + **ESD wrist strap** + Compressed Air + **90%+ IPA**', 'NEVER use tap water/soap or plastic household vacuums on PCBs!'],
    ],
  },
  'dp-data-validation-verification': {
    title: 'Validation vs Verification, Parity & Check Digits',
    headers: ['Integrity Mechanism', 'How It Works', 'Errors Caught & Missed'],
    rows: [
      ['Data Validation', 'Automated rules: Presence, Type, Range, Length, Format, Lookup', 'Checks *reasonableness*; **misses valid typos** (`78` typed as `87`)!'],
      ['Data Verification', 'Double Entry (typing twice) & Visual Proofreading against source', 'Checks *exact transcription fidelity* against source document'],
      ['Even / Odd Parity Bit', 'Appends 1 bit so total `1`s is Even (or Odd)', 'Catches any 1-bit flip; **misses 2-bit flips** in the same byte'],
      ['Weighted Check Digit', 'Mod-10 / Mod-11 positional weights (ISBN, Luhn bank cards)', 'Distinct adjacent weights catch `47 ↔ 74` **transposition errors**'],
    ],
  },
  'dp-database-security-dba': {
    title: 'Database Security Controls & ACID Transaction Guarantees',
    headers: ['Security / ACID Pillar', 'Mechanism / SQL Construct', 'Protection Delivered'],
    rows: [
      ['DCL & Views', '`GRANT` / `REVOKE` + `CREATE VIEW` column/row projection', 'Enforces Least Privilege without duplicating base tables'],
      ['Encryption & Audit', 'TDE (at rest) + TLS (in transit) + Immutable Audit Trail', 'Protects stolen disks, network traffic & tracks insider actions'],
      ['Atomicity & Consistency', '`COMMIT` / `ROLLBACK` ("all-or-nothing") + PK/FK/`CHECK` rules', 'Prevents half-completed money transfers or invalid states'],
      ['Isolation & Durability', 'Locking / MVCC concurrency + Write-Ahead Log (WAL) on SSD', 'Blocks dirty reads; committed data survives sudden power cuts'],
    ],
  },
  'dp-parallel-distributed-db': {
    title: 'Parallel vs Distributed Databases, Fragmentation & Replication',
    headers: ['Architecture / Technique', 'Structure', 'Performance & Resilience Trade-Off'],
    rows: [
      ['Parallel DBMS', 'Shared-Memory, Shared-Disk, or **Shared-Nothing** in 1 data center', 'Shared-Nothing scales horizontally with private CPU/RAM/SSD'],
      ['Distributed DBMS', 'Geographically dispersed WAN sites with **Location Transparency**', 'Local branch speed + survives single-city outage'],
      ['Horizontal vs Vertical Frag.', 'Split by **Rows** (`UNION`) vs Split by **Columns** (`JOIN` via PK)', 'Vertical fragments MUST every one retain the Primary Key!'],
      ['Replication & 2PC', 'Copies across sites + Two-Phase Commit (`Prepare → Commit/Abort`)', 'Fast local reads & high availability; higher write sync cost'],
    ],
  },
  'dp-networking-internet-dp': {
    title: 'Intranet/Extranet Access & Precision Search Operators',
    headers: ['Network / Operator', 'Syntax / Scope', 'Exact Retrieval / Access Effect'],
    rows: [
      ['Internet / Intranet / Extranet', 'Public global · Internal staff only · Trusted external partners', 'Parent/supplier login slice of internal systems = **Extranet**'],
      ['Search Engine Pipeline', '**Crawling** (spiders) → **Indexing** (inverted index) → **Ranking**', 'Queries hit the pre-built index in ms, NOT billions of live sites'],
      ['Phrase & Exclusion', '`"exact phrase"` · `term -excluded` · `A OR B`', 'Eliminates noisy irrelevant results immediately'],
      ['Domain & Format Locks', '`site:edu.ng` · `site:gov.ng` · `filetype:pdf`', 'Targets authoritative academic/government PDFs & Cloud Version History'],
    ],
  },
  'dp-computer-viruses-malware': {
    title: 'Virus Subtypes, Malware Classes & Antivirus Engines',
    headers: ['Malware / Defense', 'Operating Mechanism', 'Key Identification / Countermeasure'],
    rows: [
      ['Boot-Sector vs File-Infector', 'Infects MBR/boot block at startup vs Attaches to `.exe`/`.dll`', 'Boot-sector loads before OS; disable USB AutoRun'],
      ['Macro vs Polymorphic Virus', 'VBA script inside `.docm`/`.xlsm` vs Mutates encrypted signature', 'Disable untrusted Office macros; requires heuristic emulation'],
      ['Worm vs Trojan vs Ransomware', 'Self-propagates on network vs Fake app/crack vs File encryption', 'Avoid pirated cracks; patch SMB/OS; keep offline backups'],
      ['Signature vs Heuristic + Quarantine', 'Known hash DB vs Behavioral sandbox · Encrypted vault isolation', 'Quarantine neutralizes execution while allowing false-positive recovery'],
    ],
  },
  'dp-backup-disaster-recovery': {
    title: 'Full, Incremental & Differential Backup Matrix',
    headers: ['Backup Strategy', 'What Is Copied & Archive Bit', 'Daily Speed / Size vs Restore Sets'],
    rows: [
      ['Full Backup', 'Copies **ALL** selected files · Clears archive bit', 'Slowest backup, largest size · **Fastest restore (`1 set`)**'],
      ['Incremental Backup', 'Changed since **LAST backup of ANY type** · Clears bit', 'Fastest nightly, smallest size · **Slowest restore (`1 Full + k Incr.`)**'],
      ['Differential Backup', 'Changed since **LAST FULL backup** · Keeps bit set', 'Moderate cumulative size · **Fast restore (`2 sets: Full + Latest Diff`)**'],
      ['3-2-1, RPO/RTO & Compression', '3 copies, 2 media, **1 off-site/offline** · `CR = Orig / Comp`', '`RPO` = max data-loss age; `RTO` = max outage duration (lossless only!)'],
    ],
  },
  'dp-data-warehousing-mining': {
    title: 'OLTP vs OLAP Data Warehousing, ETL & Data Mining',
    headers: ['Concept', 'Core Structure', 'Decision-Support Role'],
    rows: [
      ['OLTP vs OLAP', 'Live 3NF short writes (`INSERT/UPDATE`) vs Historical multi-year reads', 'Offloads heavy analytics from live cashier/ATM databases'],
      ['ETL & Data Mart', '**Extract → Transform** (clean/standardize) **→ Load** · Dept subset', 'Inmon DW: Subject-oriented, Integrated, Time-variant, Non-volatile'],
      ['Star Schema & Cube Ops', 'Central numeric **Fact** table + surrounding **Dimension** tables', '**Drill-Down** (Year→Month) vs **Roll-Up** (City→Country)'],
      ['Data Mining Tasks', 'Association Rules (Market-Basket), Classification, Clustering', 'Uncovers co-purchase patterns, churn risk & real-time fraud'],
    ],
  },
  'dp-careers-professional-bodies': {
    title: 'Data Careers & Nigerian ICT Bodies (CPN, NCS, NITDA, NDPC, NCC)',
    headers: ['Role / Institution', 'Mandate / Responsibility', 'Key Exam Distinction'],
    rows: [
      ['Systems Analyst vs Data Engineer', 'Requirements & workflow specs vs Automated ETL/warehouse pipelines', 'Data Analyst queries curated tables for KPIs & visual insights'],
      ['CPN (Act 49 of 1993)', 'Computer Professionals (Registration Council) of Nigeria', '**Statutory regulator** licensing & registering computing practice'],
      ['NCS', 'Nigeria Computer Society', 'Umbrella **voluntary professional association** & scholarly forum'],
      ['NITDA · NDPC · NCC', 'National IT Policy (NITDA) · Data Privacy (NDPC) · Telecoms (NCC)', 'NDPC enforces **NDPA 2023**; NCC regulates GSM spectrum & SIMs'],
    ],
  },
};

function shuffleMcq(
  key: string,
  o: string[],
  a: number,
  fb?: string[]
): { o: string[]; a: number; fb?: string[] } {
  const order = perm(key, o.length);
  return {
    o: order.map((idx) => o[idx]),
    a: Math.max(0, order.indexOf(a)),
    fb: fb ? order.map((idx) => fb[idx] ?? '') : undefined,
  };
}

function buildInteractiveForDataProcTopic(topic: Topic): InteractiveLesson {
  const tableSpec = DATAPROC_TEACH_TABLES[topic.id];

  return {
    title: topic.name,
    goals: topic.goals,
    trap: topic.trap,
    parts: topic.parts.map((part, pIdx) => {
      const beats: Beat[] = [];

      const ideaBeat: IdeaBeat = {
        k: 'idea',
        kl: `Chapter ${pIdx + 1} · Core Data Principle`,
        title: part.title,
        idea: part.idea,
        g: part.g,
        cap: part.cap,
        rules: part.rules,
        rh: 'Essential Data Processing, SQL & Systems Rules',
      };
      beats.push(ideaBeat);

      if (pIdx === 0 && tableSpec) {
        const body: TeachBlock[] = [
          ['h', tableSpec.title],
          ['tb', tableSpec.headers, tableSpec.rows],
          ['wn', `<b>Trap:</b> ${topic.trap}`],
        ];
        const teachBeat: TeachBeat = {
          k: 'teach',
          kl: 'Mastery Summary Table',
          title: tableSpec.title,
          body,
        };
        beats.push(teachBeat);
      }

      const fadeSteps = part.ex.steps.map((st, sIdx) => {
        const isLast = sIdx === part.ex.steps.length - 1;
        if (isLast && part.ex.why) {
          const [, wq, wo, wfb] = part.ex.why;
          return {
            m: st[0],
            why: st[1],
            whyQ: {
              q: wq,
              o: wo,
              a: 0,
              fb: wfb,
            },
          };
        }
        return {
          m: st[0],
          why: st[1],
        };
      });

      beats.push({
        k: 'fade',
        kl: 'Worked Data Walkthrough',
        lv: pIdx === 0 ? 'full' : 'one',
        title: `Worked Example — ${part.title}`,
        q: part.ex.q,
        g: part.ex.g,
        steps: fadeSteps,
      });

      if (topic.spot && topic.spot.part === pIdx) {
        const sp = shuffleMcq(
          `spot|${topic.id}|${pIdx}`,
          topic.spot.o,
          topic.spot.a ?? 0,
          topic.spot.fb
        );
        beats.push({
          k: 'spot',
          kl: 'Spot the Data Flaw',
          title: `Audit ${topic.spot.who}’s Solution`,
          who: topic.spot.who,
          q: topic.spot.q,
          lines: topic.spot.lines,
          bad: topic.spot.bad,
          okfb: topic.spot.okfb,
          o: sp.o,
          a: sp.a,
          fb: sp.fb || ['', '', '', ''],
          h: topic.spot.h,
          fix: topic.spot.fix,
        });
      }

      const defaultFb = part.tryit.o.map((_, idx) =>
        idx === part.tryit.a
          ? `Exact! ${part.tryit.e}`
          : `Review the step-by-step analysis: ${part.tryit.e}`
      );
      const cp = shuffleMcq(
        `tryit|${topic.id}|${pIdx}`,
        part.tryit.o,
        part.tryit.a,
        part.tryit.fb || defaultFb
      );
      beats.push({
        k: 'check',
        kl: 'Quick Mastery Check',
        title: `Your Turn — ${part.title}`,
        q: part.tryit.q,
        o: cp.o,
        a: cp.a,
        fb: cp.fb || defaultFb,
        h: [part.tryit.h],
      });

      return {
        title: part.title,
        beats,
      };
    }),
  };
}

export function buildDataProcCurriculum(): {
  topics: Topic[];
  il: Record<string, InteractiveLesson>;
} {
  const rawTopics: Topic[] = [
    ...DATAPROC_TOPICS_PART1,
    ...DATAPROC_TOPICS_PART2,
    ...DATAPROC_TOPICS_PART3,
  ];

  const topics: Topic[] = rawTopics.map((topic) => ({
    ...topic,
    qs: topic.qs.map((q, qIdx) => {
      const p = shuffleMcq(`q|${topic.id}|${qIdx}`, q.o, q.a, q.w);
      return {
        ...q,
        o: p.o,
        a: p.a,
        w: p.fb,
      };
    }),
  }));

  const il: Record<string, InteractiveLesson> = {};
  for (const t of rawTopics) {
    il[t.id] = buildInteractiveForDataProcTopic(t);
  }

  return { topics, il };
}
