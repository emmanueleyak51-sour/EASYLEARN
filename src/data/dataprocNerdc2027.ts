import type { ChemClassId, Topic } from '../types';
import type { ChemClassMeta } from './chemNerdc2027';

export const DATAPROC_CLASSES: ChemClassMeta[] = [
  {
    id: 'ss1',
    label: 'SS 1',
    shortLabel: 'SS 1',
    fullTitle: 'SS 1 Data Processing',
    kicker: 'NERDC Year 1 · Digitalization, Data vs Information, Processing Cycle, OS, Word, Spreadsheets & Ethics',
    description:
      'History of computing & digitalization, data vs information, data processing cycle & batch/real-time modes, computer classifications, ICT in society, information transmission, operating systems, word processing, spreadsheets & lab safety.',
  },
  {
    id: 'ss2',
    label: 'SS 2',
    shortLabel: 'SS 2',
    fullTitle: 'SS 2 Data Processing',
    kicker: 'NERDC Year 2 · Data Models, ER Diagrams, Relational Keys, 1NF–3NF Normalization, DBMS, SQL & File Organization',
    description:
      'Conceptual/logical/physical data models, Entity–Relationship (ER) cardinality, relational tuples/keys, 1NF/2NF/3NF normalization, DBMS architecture, SQL DDL/DML queries, file organization (sequential/indexed/hashed), presentation & web design.',
  },
  {
    id: 'ss3',
    label: 'SS 3',
    shortLabel: 'SS 3',
    fullTitle: 'SS 3 Data Processing',
    kicker: 'NERDC Year 3 · Graphics Packages, Hardware Maintenance, Validation/Parity, DBA Security, Distributed DB, Backups & OLAP',
    description:
      'Vector/raster graphics packages, preventive/corrective maintenance, validation vs verification & parity/check digits, DBA & ACID security, parallel/distributed databases, malware defense, full/incremental/differential backups, OLAP & ICT careers.',
  },
  {
    id: 'all',
    label: 'All Classes',
    shortLabel: 'All',
    fullTitle: 'Complete Data Processing (SS1–SS3)',
    kicker: 'National Curriculum · 30 Topics',
    description:
      'Complete Nigerian NERDC SS1–SS3 Data Processing syllabus across Information Fundamentals, File Organization & Integrity, Relational Databases & SQL, Productivity & Design Packages, and System Maintenance & Security.',
  },
];

export type DataProcDomainId =
  | 'fundamentals'
  | 'files'
  | 'database'
  | 'packages'
  | 'maintenance';

export interface DataProcNerdcTopicPlacement {
  classId: 'ss1' | 'ss2' | 'ss3';
  term: 1 | 2 | 3;
  termLabel: 'First Term' | 'Second Term' | 'Third Term';
  nerdcTheme:
    | 'Information Age, Data Fundamentals & Transmission'
    | 'File Organization, Integrity & Storage Operations'
    | 'Data Modeling, Normalization, DBMS & SQL'
    | 'Application Packages: Office, Web & Graphics'
    | 'Computer Maintenance, Security, Backups & ICT Careers';
  order: number;
  domain: DataProcDomainId;
  keywords: string[];
}

export const DATAPROC_NERDC_MAP: Record<string, DataProcNerdcTopicPlacement> = {
  // ─────────────────────────── SS 1 (10 Topics) ───────────────────────────
  'dp-history-digitalization': {
    classId: 'ss1',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Information Age, Data Fundamentals & Transmission',
    order: 1,
    domain: 'fundamentals',
    keywords: ['digitalization', 'abacus', 'slide rule', 'pascaline', 'leibniz', 'jacquard', 'babbage', 'hollerith', 'eniac', 'univac', 'analog to digital'],
  },
  'dp-data-vs-information': {
    classId: 'ss1',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Information Age, Data Fundamentals & Transmission',
    order: 2,
    domain: 'fundamentals',
    keywords: ['raw data', 'processed information', 'quantitative data', 'qualitative data', 'primary source', 'secondary source', 'manual vs electronic handling', 'good information qualities'],
  },
  'dp-data-processing-cycle': {
    classId: 'ss1',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Information Age, Data Fundamentals & Transmission',
    order: 3,
    domain: 'fundamentals',
    keywords: ['data gathering', 'data collation', 'input stage', 'processing stage', 'storage', 'output', 'batch processing', 'online real-time', 'time-sharing', 'distributed processing'],
  },
  'dp-computer-classifications': {
    classId: 'ss1',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Information Age, Data Fundamentals & Transmission',
    order: 4,
    domain: 'fundamentals',
    keywords: ['analog', 'digital', 'hybrid', 'supercomputer', 'mainframe', 'minicomputer', 'microcomputer', 'general purpose', 'special purpose'],
  },
  'dp-ict-society-impacts': {
    classId: 'ss1',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Information Age, Data Fundamentals & Transmission',
    order: 5,
    domain: 'fundamentals',
    keywords: ['e-banking', 'atm', 'pos', 'eft', 'telemedicine', 'e-learning', 'cbt', 'e-commerce', 'e-governance', 'automation', 'deskilling'],
  },
  'dp-information-processing-transmission': {
    classId: 'ss1',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Information Age, Data Fundamentals & Transmission',
    order: 6,
    domain: 'fundamentals',
    keywords: ['ancient transmission', 'town crier', 'modern transmission', 'print', 'broadcast', 'satellite', 'synchronous', 'asynchronous', 'serial', 'parallel', 'simplex', 'duplex'],
  },
  'dp-operating-systems-dp': {
    classId: 'ss1',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Application Packages: Office, Web & Graphics',
    order: 7,
    domain: 'packages',
    keywords: ['single-user', 'multi-user', 'multitasking', 'multiprogramming', 'batch os', 'real-time os', 'file allocation', 'directory hierarchy', 'cli vs gui'],
  },
  'dp-word-processing': {
    classId: 'ss1',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Application Packages: Office, Web & Graphics',
    order: 8,
    domain: 'packages',
    keywords: ['word processor', 'mail merge', 'header and footer', 'track changes', 'find and replace', 'page orientation', 'gutter margin', 'thesaurus', 'shortcuts'],
  },
  'dp-spreadsheet-fundamentals': {
    classId: 'ss1',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Application Packages: Office, Web & Graphics',
    order: 9,
    domain: 'packages',
    keywords: ['workbook', 'worksheet', 'cell address', 'relative reference', 'absolute reference $a$1', 'mixed reference', 'sum average count countif if vlookup', 'error codes #div/0! #value! #ref!'],
  },
  'dp-safety-ethics-ergonomics': {
    classId: 'ss1',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Computer Maintenance, Security, Backups & ICT Careers',
    order: 10,
    domain: 'maintenance',
    keywords: ['computer room rules', 'co2 fire extinguisher', 'ups', 'surge protector', 'dust-free ventilation', 'ergonomics', 'rsi carpal tunnel', 'computer vision syndrome', 'ten commandments of computer ethics'],
  },

  // ─────────────────────────── SS 2 (10 Topics) ───────────────────────────
  'dp-data-models': {
    classId: 'ss2',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Data Modeling, Normalization, DBMS & SQL',
    order: 1,
    domain: 'database',
    keywords: ['conceptual model', 'logical model', 'physical model', 'flat-file model', 'hierarchical model', 'network model', 'relational model', 'object-oriented model', 'schema', 'instance'],
  },
  'dp-entity-relationship-erd': {
    classId: 'ss2',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Data Modeling, Normalization, DBMS & SQL',
    order: 2,
    domain: 'database',
    keywords: ['entity', 'weak entity', 'attribute', 'composite attribute', 'multivalued attribute', 'derived attribute', 'one-to-one', 'one-to-many', 'many-to-many', 'junction associative table', 'crows foot'],
  },
  'dp-relational-model-keys': {
    classId: 'ss2',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Data Modeling, Normalization, DBMS & SQL',
    order: 3,
    domain: 'database',
    keywords: ['relation', 'tuple', 'attribute', 'degree arity', 'cardinality', 'domain', 'superkey', 'candidate key', 'primary key', 'alternate key', 'foreign key', 'composite key', 'entity integrity', 'referential integrity'],
  },
  'dp-normalization': {
    classId: 'ss2',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Data Modeling, Normalization, DBMS & SQL',
    order: 4,
    domain: 'database',
    keywords: ['insertion anomaly', 'update anomaly', 'deletion anomaly', 'unnormalized form unf', '1nf atomic', '2nf partial dependency', '3nf transitive dependency', 'functional dependency'],
  },
  'dp-dbms-architecture': {
    classId: 'ss2',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Data Modeling, Normalization, DBMS & SQL',
    order: 5,
    domain: 'database',
    keywords: ['dbms', 'ms access', 'mysql', 'postgresql', 'oracle', 'data dictionary', 'tables', 'queries', 'forms', 'reports', 'data redundancy', 'data independence'],
  },
  'dp-sql-ddl-dml': {
    classId: 'ss2',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Data Modeling, Normalization, DBMS & SQL',
    order: 6,
    domain: 'database',
    keywords: ['ddl create alter drop', 'dml select insert update delete', 'where', 'like % _', 'order by', 'group by', 'having', 'inner join', 'left join', 'count sum avg'],
  },
  'dp-file-organization': {
    classId: 'ss2',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'File Organization, Integrity & Storage Operations',
    order: 7,
    domain: 'files',
    keywords: ['bit', 'byte', 'field', 'record', 'file', 'database', 'serial file', 'sequential file', 'indexed-sequential isam', 'random direct hashing', 'hash collision', 'blocking factor'],
  },
  'dp-file-operations-classification': {
    classId: 'ss2',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'File Organization, Integrity & Storage Operations',
    order: 8,
    domain: 'files',
    keywords: ['master file', 'transaction file', 'reference file', 'work scratch file', 'archive backup file', 'grandfather-father-son', 'hit ratio', 'overwrite vs delete'],
  },
  'dp-presentation-packages': {
    classId: 'ss2',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Application Packages: Office, Web & Graphics',
    order: 9,
    domain: 'packages',
    keywords: ['powerpoint', 'impress', 'slide master', 'slide transition', 'object animation', 'speaker notes', 'slide sorter', 'kiosk loop', '6x6 rule'],
  },
  'dp-web-design-packages': {
    classId: 'ss2',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Application Packages: Office, Web & Graphics',
    order: 10,
    domain: 'packages',
    keywords: ['wysiwyg editor', 'cms', 'wordpress', 'html tags', 'hyperlinks', 'tables and forms', 'web hosting', 'domain registration', 'ftp sftp deployment'],
  },

  // ─────────────────────────── SS 3 (10 Topics) ───────────────────────────
  'dp-graphic-packages': {
    classId: 'ss3',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Application Packages: Office, Web & Graphics',
    order: 1,
    domain: 'packages',
    keywords: ['coreldraw', 'illustrator', 'inkscape', 'photoshop', 'gimp', 'vector vs bitmap', 'bezier curve', 'pick tool', 'shape tool', 'cmyk print vs rgb screen', 'dpi vs ppi'],
  },
  'dp-computer-maintenance': {
    classId: 'ss3',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Computer Maintenance, Security, Backups & ICT Careers',
    order: 2,
    domain: 'maintenance',
    keywords: ['preventive maintenance', 'corrective maintenance', 'predictive maintenance', 'esd wrist strap', 'compressed air', 'isopropyl alcohol', 'thermal paste', 'beep codes', 'smart disk health'],
  },
  'dp-data-validation-verification': {
    classId: 'ss3',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'File Organization, Integrity & Storage Operations',
    order: 3,
    domain: 'files',
    keywords: ['gigo', 'validation vs verification', 'range check', 'type check', 'length check', 'format picture check', 'presence check', 'lookup check', 'check digit mod 10 mod 11', 'double entry', 'proofreading', 'even odd parity'],
  },
  'dp-database-security-dba': {
    classId: 'ss3',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Data Modeling, Normalization, DBMS & SQL',
    order: 4,
    domain: 'database',
    keywords: ['database administrator dba', 'grant and revoke dcl', 'database views', 'encryption at rest tde', 'audit trail', 'acid properties', 'atomicity consistency isolation durability', 'deadlock'],
  },
  'dp-parallel-distributed-db': {
    classId: 'ss3',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Data Modeling, Normalization, DBMS & SQL',
    order: 5,
    domain: 'database',
    keywords: ['centralized database', 'parallel database', 'shared-memory', 'shared-disk', 'shared-nothing', 'distributed database ddbs', 'horizontal fragmentation sharding', 'vertical fragmentation', 'replication', 'two-phase commit'],
  },
  'dp-networking-internet-dp': {
    classId: 'ss3',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Information Age, Data Fundamentals & Transmission',
    order: 6,
    domain: 'fundamentals',
    keywords: ['intranet', 'extranet', 'search engine crawlers', 'boolean search operators', 'exact phrase quotes', 'site: filetype:', 'cloud sync', 'collaborative editing'],
  },
  'dp-computer-viruses-malware': {
    classId: 'ss3',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Computer Maintenance, Security, Backups & ICT Careers',
    order: 7,
    domain: 'maintenance',
    keywords: ['boot sector virus', 'file infector', 'macro virus', 'polymorphic virus', 'worm', 'trojan', 'ransomware', 'signature detection', 'heuristic analysis', 'quarantine', 'sandbox'],
  },
  'dp-backup-disaster-recovery': {
    classId: 'ss3',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Computer Maintenance, Security, Backups & ICT Careers',
    order: 8,
    domain: 'maintenance',
    keywords: ['full backup', 'incremental backup', 'differential backup', 'archive bit', 'restore speed vs backup speed', '3-2-1 rule', 'off-site backup', 'compression ratio'],
  },
  'dp-data-warehousing-mining': {
    classId: 'ss3',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Data Modeling, Normalization, DBMS & SQL',
    order: 9,
    domain: 'database',
    keywords: ['oltp vs olap', 'data warehouse', 'etl extract transform load', 'star schema', 'fact table', 'dimension table', 'data mart', 'data mining', 'association rules'],
  },
  'dp-careers-professional-bodies': {
    classId: 'ss3',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Computer Maintenance, Security, Backups & ICT Careers',
    order: 10,
    domain: 'maintenance',
    keywords: ['data analyst', 'database administrator', 'systems analyst', 'data engineer', 'network engineer', 'cpn', 'ncs', 'nitda', 'ndpc', 'professional code of ethics'],
  },
};

export function getDataProcClassMeta(classId?: ChemClassId): ChemClassMeta {
  return DATAPROC_CLASSES.find((c) => c.id === (classId || 'all')) || DATAPROC_CLASSES[3];
}

export function filterDataProcTopicsByClass(topics: Topic[], classId?: ChemClassId): Topic[] {
  if (!classId || classId === 'all') return topics;
  return topics
    .filter((t) => DATAPROC_NERDC_MAP[t.id]?.classId === classId)
    .sort((a, b) => (DATAPROC_NERDC_MAP[a.id]?.order ?? 99) - (DATAPROC_NERDC_MAP[b.id]?.order ?? 99));
}
