export type SubjectId =
  // 25 Official JAMB UTME & WAEC/NECO subjects
  | 'eng'
  | 'maths'
  | 'phys'
  | 'chem'
  | 'bio'
  | 'agric'
  | 'geog'
  | 'econ'
  | 'govt'
  | 'lit'
  | 'crs'
  | 'irs'
  | 'comm'
  | 'acct'
  | 'hist'
  | 'comp'
  | 'homeec'
  | 'phe'
  | 'art'
  | 'music'
  | 'french'
  | 'arabic'
  | 'hausa'
  | 'igbo'
  | 'yoruba'
  // 24 WAEC/NECO-only school & trade subjects
  | 'fmaths'
  | 'civic'
  | 'digitech'
  | 'dataproc'
  | 'techdraw'
  | 'foodnut'
  | 'homemgt'
  | 'animalhusb'
  | 'fisheries'
  | 'marketing'
  | 'officeprac'
  | 'insurance'
  | 'storemgt'
  | 'bookkeep'
  | 'catering'
  | 'garment'
  | 'photo'
  | 'cosmet'
  | 'tourism'
  | 'elecinst'
  | 'automech'
  | 'carpentry'
  | 'blocklay'
  | 'gsm';

export type ChemClassId = 'ss1' | 'ss2' | 'ss3' | 'all';

export type MasteryThemeId =
  | 'stage-1-adire'
  | 'stage-2-savanna'
  | 'stage-3-jade'
  | 'stage-4-lagoon'
  | 'stage-5-garnet'
  | 'stage-6-bronze'
  | 'stage-7-plum'
  | 'stage-8-scholar'
  | 'stage-9-starlight'
  | 'stage-10-chancellor';

export type ThemeLockMode = 'unlocked' | 'goal';

export type ThemeAppearanceMode = 'light' | 'dark';

export type ClockFormat = '12h' | '24h';

export type ExamTrack = 'jamb' | 'waec' | 'both';

export type ScreenName =
  | 'landing'
  | 'welcome'
  | 'examsetup'
  | 'dxintro'
  | 'home'
  | 'topics'
  | 'topic'
  | 'notes'
  | 'lesson'
  | 'quiz'
  | 'boss'
  | 'sum'
  | 'review'
  | 'lab'
  | 'labrun'
  | 'studio'
  | 'formulas'
  | 'cbt'
  | 'mistakes'
  | 'planner'
  | 'sandboxes'
  | 'theory'
  | 'transcript'
  | 'duel'
  | 'leaderboard'
  | 'novels'
  | 'universe'
  | 'more'
  | 'subjs';

export type DiagramSpec = [string, Record<string, any>];

export interface Question {
  id: string;
  t: string;
  l: number;
  q: string;
  o: string[];
  a: number;
  w?: string[];
  e: string;
  g?: DiagramSpec;
  dx?: number;
  gen?: number;
}

export interface LegacyStep {
  0: string;
  1: string;
}

export interface LegacyPart {
  title: string;
  idea: string;
  g?: DiagramSpec;
  cap?: string;
  rules: string[];
  ex: {
    q: string;
    g?: DiagramSpec;
    steps: [string, string][];
    why?: [number, string, string[], string[]];
  };
  tryit: {
    q: string;
    g?: DiagramSpec;
    given?: string[];
    ask?: string;
    o: string[];
    a: number;
    h: string;
    e: string;
    fb?: string[];
  };
}

export interface Topic {
  id: string;
  num?: number;
  name: string;
  sec: string;
  sub?: string;
  boss: string;
  goals: string[];
  trap: string;
  parts: LegacyPart[];
  qs: (Omit<Question, 'id' | 't'> & { id?: string })[];
  spot?: Omit<SpotBeat, 'k'> & { part: number };
}

export interface PredictSpec {
  q: string;
  o: string[];
  a?: number;
  fb: string[];
  g?: DiagramSpec;
}

export interface ExplorerTask {
  t: string;
  ok: (s: any) => boolean;
  say: string;
}

export interface ExploreBeat {
  k: 'explore';
  xp:
    | 'parab'
    | 'roots'
    | 'circ'
    | 'cyc'
    | 'bag'
    | 'dice'
    | 'tree'
    | 'gaslaw'
    | 'atombuild'
    | 'phscale'
    | 'gibbs'
    | 'equil';
  kl?: string;
  title?: string;
  intro: string;
  cfg?: Record<string, any>;
  predict?: PredictSpec;
  tasks: ExplorerTask[];
  found: string;
  rules?: string[];
}

export interface DayoOption {
  t: string;
  say: string;
  next?: string;
}

export interface DayoNode {
  say: string;
  opts?: DayoOption[];
  end?: boolean;
}

export interface DayoBeat {
  k: 'dayo';
  kl?: string;
  title?: string;
  g?: DiagramSpec;
  cap?: string;
  nodes: Record<string, DayoNode>;
}

export interface ExplainWhySpec {
  q: string;
  o: string[];
  a?: number;
  fb: string[];
}

export interface FadeStep {
  m: string;
  why?: string;
  ask?: string;
  o?: string[];
  a?: number;
  fb?: string[];
  h?: string[];
  ex?: ExplainWhySpec;
  whyQ?: ExplainWhySpec;
}

export interface FadeBeat {
  k: 'fade';
  kl?: string;
  lv?: 'full' | 'one' | 'two' | 'solo';
  title?: string;
  q: string;
  g?: DiagramSpec;
  steps: FadeStep[];
}

export interface SpotBeat {
  k: 'spot';
  kl?: string;
  title?: string;
  who: string;
  q: string;
  g?: DiagramSpec;
  lines: string[];
  bad: number;
  okfb: string[];
  o: string[];
  a?: number;
  fb: string[];
  h: string[];
  why?: ExplainWhySpec;
  fix: string;
}

export interface CheckBeat {
  k: 'check';
  kl?: string;
  title?: string;
  q: string;
  g?: DiagramSpec;
  given?: string[];
  ask?: string;
  o: string[];
  a?: number;
  fb: string[];
  h: string[];
  why?: ExplainWhySpec;
}

export interface IdeaBeat {
  k: 'idea';
  kl?: string;
  title?: string;
  idea?: string;
  defs?: [string, string][];
  laws?: [string, string][];
  g?: DiagramSpec;
  cap?: string;
  rules?: string[];
  rh?: string;
}

export type TeachBlock =
  | ['p', string]
  | ['h', string]
  | ['eg', string, string]
  | ['wn', string]
  | ['key', string]
  | ['fig', DiagramSpec, string?]
  | ['li', string[]]
  | ['ol', string[]]
  | ['tb', string[], string[][]];

export interface TeachBeat {
  k: 'teach';
  kl?: string;
  title?: string;
  body: TeachBlock[];
}

export interface PredictBeat {
  k: 'predict';
  kl?: string;
  title?: string;
  intro?: string;
  q: string;
  o: string[];
  g?: DiagramSpec;
}

export type Beat =
  | PredictBeat
  | ExploreBeat
  | DayoBeat
  | FadeBeat
  | SpotBeat
  | CheckBeat
  | IdeaBeat
  | TeachBeat;

export interface LessonPart {
  title: string;
  beats: Beat[];
}

export interface InteractiveLesson {
  title?: string;
  goals?: string[];
  trap?: string;
  parts: LessonPart[];
}

export interface TopicProgress {
  att: [number, number][]; // [ok (1/0), level]
  lesson: number;
  practice: number;
  boss: number;
}

export interface ReviewEntry {
  due: number;
  st: number;
}

export type CurriculumTrack = 'senior' | 'junior';

export type Jss3TermId = 'all' | 't1' | 't2' | 't3';

export type JuniorThemeId = 'lagoon-mint' | 'mango-pop' | 'berry-bounce' | 'sky-explorer';

export interface UserProgress {
  name: string;
  target: number;
  dx: number;
  subj: SubjectId;
  subjs: SubjectId[];
  examTrack?: ExamTrack;
  jambSubjects?: SubjectId[];
  curriculumTrack?: CurriculumTrack;
  jss3Term?: Jss3TermId;
  juniorThemeId?: JuniorThemeId;
  chemClass?: ChemClassId;
  mathClass?: ChemClassId;
  fmathClass?: ChemClassId;
  physClass?: ChemClassId;
  bioClass?: ChemClassId;
  agricClass?: ChemClassId;
  geogClass?: ChemClassId;
  econClass?: ChemClassId;
  engClass?: ChemClassId;
  civicClass?: ChemClassId;
  digitechClass?: ChemClassId;
  dataprocClass?: ChemClassId;
  themeId?: MasteryThemeId;
  themeMode?: ThemeAppearanceMode;
  themeLockMode?: ThemeLockMode;
  themeAutoProgress?: boolean;
  clockFormat?: ClockFormat;
  sx: Record<string, { dx?: number }>;
  t: Record<string, TopicProgress>;
  hist: [string, number, number][]; // [questionId, ok, day]
  rev: Record<string, ReviewEntry>;
  streak: { d: number; n: number };
  muted: boolean;
  flags: Record<string, number>;
  cust: {
    add: Question[];
    edit: Record<string, Partial<Question>>;
    del: Record<string, number>;
  };
  xp: number;
  badges: Record<string, number>;
  act: Record<number, number>;
  run: number;
  revok: number;
  pro: {
    pid: string;
    until: number;
    code: string;
    on: number;
    sig?: string;
    source?: 'voucher' | 'paystack' | 'admin';
    planName?: string;
  } | null;
  trial?: {
    startedDay: number;
    untilDay: number;
    startedAtMs?: number;
    endsAtMs?: number;
    sig?: string;
  } | null;
  owner: number;
  sales: { d: number; dev: string; pid: string; code: string; price: number }[];
  ob: number;
  dev: string;
  devToken?: string;
  mistakes?: Record<
    string,
    {
      qid: string;
      subj: SubjectId;
      tid: string;
      trap: 'formula_calc' | 'sign_unit' | 'exception_wording' | 'concept_recall';
      missCount: number;
      clearCount: number;
      lastMissedDay: number;
      lastClearedDay: number | null;
      pickedIdx: number;
      source: 'dx' | 'practice' | 'review' | 'boss' | 'cbt' | 'duel';
    }
  >;
  studyPlan?: {
    examType: 'jamb' | 'waec' | 'both';
    examDateIso: string;
    dailyMinutes: number;
    focusSubjects: SubjectId[];
  };
  cbtHistory?: {
    id: string;
    mode: 'jamb' | 'waec';
    dateDay: number;
    subjects: SubjectId[];
    scaledScore: number;
    maxScale: number;
    rawCorrect: number;
    totalQuestions: number;
    durationSec: number;
  }[];
  theoryScores?: Record<string, { earned: number; max: number; day: number }>;
  duelHistory?: {
    code: string;
    subj: SubjectId;
    title: string;
    score: number;
    total: number;
    timeSec: number;
    day: number;
  }[];
  leaderboardCampusGoal?: string;
  leaderboardPublic?: boolean;
  novelNotebook?: {
    chaptersRead: number[];
    characters: string;
    themes: string;
    events: string;
  };
  novelProgress?: Record<
    string,
    {
      chaptersRead: number[];
      quizBestScore?: number;
      quizTotal?: number;
      notes?: string;
      chapterQuizPassed?: number[];
      chapterQuizScores?: Record<number, { best: number; total: number }>;
      finalExamBestScore?: number;
      finalExamTotal?: number;
      finalExamPassed?: boolean;
      rankPointsAwarded?: number;
    }
  >;
}

export interface QuizSession {
  kind: 'dx' | 'practice' | 'review';
  tid?: string;
  list?: string[];
  i: number;
  n: number;
  cur: string;
  lvl: number;
  run: number;
  right: number;
  picked: number | null;
  done: boolean;
  seen?: string[];
  res: [string, number][];
  m0: number;
  pred0: number;
}

export interface TopicTestSession {
  tid: string;
  phase: 'intro' | 'fight' | 'won' | 'lost';
  list: string[];
  i: number;
  hp: number;
  targetHp?: number;
  hits: number;
  combo: number;
  best: number;
  time: number;
  totalTime?: number;
  picked: number | null;
  result: 'right' | 'wrong' | null;
  pred0: number;
  res?: { qid: string; picked: number; ok: boolean }[];
}

export interface LabStep {
  say: string;
  ops?: any[];
}

export interface LabItem {
  id: string;
  subj?: SubjectId;
  cat: number | string;
  name: string;
  blurb: string;
  tip?: string;
  h?: number;
  vy?: number;
  cm?: number;
  defs?: string;
  steps: () => LabStep[];
  scene?: () => any[];
}
