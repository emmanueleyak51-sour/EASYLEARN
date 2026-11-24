import type { ExamTrack, MasteryThemeId, SubjectId } from '../types';
import { MASTERY_THEMES } from '../data/masteryThemes';
import { SUBJECT_INFO } from './engine';
import {
  ALL_SUBJECT_IDS,
  JAMB_SUBJECT_IDS,
  WAEC_SCHOOL_ONLY_SUBJECT_IDS,
  WAEC_TRADE_ONLY_SUBJECT_IDS,
  hasFormulasForSubject,
  hasLabsForSubject,
  isJambSubject,
  isWaecOnlySubject,
} from './examSubjects';
import type { DailyCbtParticipantEntry } from './examTrackLogic';
import {
  PREMIUM_PLANS,
  FREE_TRIAL_DAYS,
  type PremiumPlanDef,
  type PremiumPlanId,
} from './paywallLogic';
import { TUTOR_PERSONALITY_PROFILES } from './tutorIntroPersonalities';
import { SUBJECT_TUTOR_REGISTRY } from './tutorRegistry';

export type WebsiteSubjectCategory = 'all' | 'jamb' | 'waec-school' | 'waec-trade';

export type WebsitePostSetupDestination = 'default' | 'cbt' | 'paywall';

export interface WebsiteOnboardingPreset {
  courseTitle?: string;
  jambQuartet?: SubjectId[];
  enrolledSubjs?: SubjectId[];
  campusGoal?: string;
  targetPct?: number;
  practiceScore400?: number;
  selectedPlanId?: PremiumPlanId;
  previewThemeId?: MasteryThemeId;
  postSetupDestination?: WebsitePostSetupDestination;
}

export type WebsiteInstantAction =
  | {
      type: 'demo-dashboard';
      examTrack: ExamTrack;
      subj?: SubjectId;
      preset?: WebsiteOnboardingPreset;
      previewThemeId?: MasteryThemeId;
    }
  | {
      type: 'live-practice';
      examTrack: ExamTrack;
      subj: SubjectId;
      topicId?: string;
      preset?: WebsiteOnboardingPreset;
      previewThemeId?: MasteryThemeId;
    }
  | {
      type: 'live-lesson';
      examTrack: ExamTrack;
      subj: SubjectId;
      topicId?: string;
      preset?: WebsiteOnboardingPreset;
      previewThemeId?: MasteryThemeId;
    }
  | {
      type: 'live-lab';
      examTrack: ExamTrack;
      subj: 'chem' | 'maths' | 'phys' | 'bio' | 'agric';
      labId: string;
      preset?: WebsiteOnboardingPreset;
      previewThemeId?: MasteryThemeId;
    }
  | {
      type: 'live-theory';
      examTrack: ExamTrack;
      subj?: SubjectId;
      preset?: WebsiteOnboardingPreset;
      previewThemeId?: MasteryThemeId;
    }
  | {
      type: 'live-duel';
      examTrack: ExamTrack;
      subj?: SubjectId;
      preset?: WebsiteOnboardingPreset;
      previewThemeId?: MasteryThemeId;
    }
  | {
      type: 'live-sandboxes';
      examTrack: ExamTrack;
      subj?: SubjectId;
      preset?: WebsiteOnboardingPreset;
      previewThemeId?: MasteryThemeId;
    }
  | {
      type: 'live-cbt';
      examTrack: ExamTrack;
      preset?: WebsiteOnboardingPreset;
      previewThemeId?: MasteryThemeId;
    }
  | {
      type: 'open-novel';
      examTrack: ExamTrack;
      novelId: string;
      subj: 'eng' | 'lit';
      preset?: WebsiteOnboardingPreset;
      previewThemeId?: MasteryThemeId;
    }
  | {
      type: 'choose-pass';
      examTrack: ExamTrack;
      planId: PremiumPlanId;
      preset?: WebsiteOnboardingPreset;
      previewThemeId?: MasteryThemeId;
    };

export interface ExamTrackShowcase {
  id: ExamTrack;
  tabLabel: string;
  shortLabel: string;
  headline: string;
  audienceLine: string;
  focusRatioLabel: string;
  jambWeightPct: number;
  waecWeightPct: number;
  subjectScopeLabel: string;
  trainingStandardLabel: string;
  summary: string;
  pillars: {
    title: string;
    detail: string;
  }[];
  examExample: {
    kicker: string;
    prompt: string;
    trapNote: string;
    winningRule: string;
  };
  ctaLabel: string;
}

export const EXAM_TRACK_SHOWCASES: Record<ExamTrack, ExamTrackShowcase> = {
  jamb: {
    id: 'jamb',
    tabLabel: 'JAMB UTME Only',
    shortLabel: 'JAMB Only',
    headline: 'Strict 4-subject UTME training built tougher than exam day.',
    audienceLine: 'For university aspirants targeting 280–360+ out of 400',
    focusRatioLabel: '100% UTME speed & deep concept drills',
    jambWeightPct: 100,
    waecWeightPct: 0,
    subjectScopeLabel: '4 JAMB subjects · Use of English + 3 electives',
    trainingStandardLabel: '6/7 in 3:30 topic bar · Look-alike distractor traps',
    summary:
      'Every non-JAMB school or trade subject disappears from your dashboard. You meet only your 4 JAMB voice teachers once during setup, then drill deep conceptual questions where twin options differ by a single sign, unit, or concord rule.',
    pillars: [
      {
        title: 'Tougher-than-UTME calibration',
        detail:
          'Practice starts at higher difficulty and topic tests require 6 out of 7 in 3 minutes 30 seconds so real JAMB feels calmer and slower.',
      },
      {
        title: 'Look-alike option discrimination',
        detail:
          'Questions intentionally pair near-identical distractors to cure rushing and surface-level cramming before examination day.',
      },
      {
        title: 'Every Saturday live /400 cohort ranking',
        detail:
          'Sit full 180-question timed UTME papers every Saturday and see where your /400 score ranks among every student who wrote that day.',
      },
    ],
    examExample: {
      kicker: 'Typical JAMB twin-option trap · Chemistry',
      prompt:
        'What volume of 0.25 mol/dm³ H₂SO₄ completely neutralizes 25.0 cm³ of 0.50 mol/dm³ NaOH?',
      trapNote:
        'Rushed candidates pick 50.0 cm³ by forgetting the 1 : 2 mole ratio between diprotic H₂SO₄ and NaOH.',
      winningRule:
        'Using CₐVₐ / CᵦVᵦ = nₐ / nᵦ gives (0.25 × Vₐ) / (0.50 × 25.0) = 1 / 2 → Vₐ = 25.0 cm³.',
    },
    ctaLabel: 'Start with JAMB UTME Track',
  },
  waec: {
    id: 'waec',
    tabLabel: 'WAEC / SSCE Only',
    shortLabel: 'WAEC Only',
    headline: 'Paper 1 objectives, Paper 2 theory marking schemes, and practical labs.',
    audienceLine: 'For SS1–SS3 & GCE candidates targeting A1–B2 credit distinctions',
    focusRatioLabel: 'Paper 1 Objective + Paper 2 Theory + Paper 3 Practicals',
    jambWeightPct: 0,
    waecWeightPct: 100,
    subjectScopeLabel: '7 to 9 subjects across all 49 NERDC school & trade syllabuses',
    trainingStandardLabel: 'Chief Examiner mistake alerts · Method-mark rubrics',
    summary:
      'Built around how WAEC and NECO scripts are actually graded. Learn step-by-step method workings, compulsory SI units, single-line biological diagrams, and non-lifted English summary clauses so you stop giving away easy marks.',
    pillars: [
      {
        title: 'Chief Examiner mistake shield',
        detail:
          'Every topic highlights the exact errors WAEC examiners penalize each year — from missing state symbols to unlabelled graph axes.',
      },
      {
        title: 'Paper 2 Theory Coach & self-grading rubrics',
        detail:
          'Practise structured essay and calculation questions line-by-line against official mark-allocation checkpoints.',
      },
      {
        title: 'Virtual science & locus construction benches',
        detail:
          'Run 20 Chemistry titrations, 16 Physics optics/circuit practicals, 28 Biology/Agric specimens, and 23 compass-and-ruler constructions.',
      },
    ],
    examExample: {
      kicker: 'Typical WAEC Paper 2 deduction · Mathematics & Physics',
      prompt:
        'Writing a correct numerical answer without intermediate substitution steps or final SI units.',
      trapNote:
        'In WAEC theory papers, the final answer often carries only A1 (1 mark) while method steps carry M1–M3 (3 to 4 marks).',
      winningRule:
        'State the formula, show clean substitution, keep 3 significant figures, and attach exact units on the final line.',
    },
    ctaLabel: 'Start with WAEC / SSCE Track',
  },
  both: {
    id: 'both',
    tabLabel: 'Both (70% JAMB · 30% WAEC)',
    shortLabel: 'Both 70/30',
    headline: 'One coordinated SS3 timetable: 70% tough JAMB power, 30% WAEC precision.',
    audienceLine: 'Recommended for SS3 secondary school students sitting both exams in one academic year',
    focusRatioLabel: '70% UTME 4-subject intensity · 30% WASSCE theory & school subjects',
    jambWeightPct: 70,
    waecWeightPct: 30,
    subjectScopeLabel: '4 priority JAMB subjects + up to 5 additional WAEC school/trade subjects',
    trainingStandardLabel: 'Dual /400 UTME & A1–F9 WASSCE readiness tracking',
    summary:
      'Secondary school finalists rarely have luxury to study JAMB and WAEC in separate silos. Easy Learn puts 70% of your daily mission weight behind your 4 high-stakes UTME subjects while keeping your WAEC theory rubrics, practicals, and extra school subjects sharp.',
    pillars: [
      {
        title: '70 / 30 weighted daily study planner',
        detail:
          'Seven out of every ten daily drills target your 4 JAMB subjects under tough time limits, while three maintain WAEC theory and extra subjects.',
      },
      {
        title: '4 primary JAMB voice teachers + full subject roster',
        detail:
          'Meet your 4 core UTME teachers during setup, with instant access to specialist tutors across Further Maths, Civic, Data Processing, and Trade subjects.',
      },
      {
        title: 'Saturday UTME cohort mocks + WASSCE theory checks',
        detail:
          'Compete every Saturday on the national /400 CBT leaderboard without neglecting Paper 2 written workings.',
      },
    ],
    examExample: {
      kicker: 'How 70 / 30 works in a single week · SS3 Science Scholar',
      prompt:
        'Mon–Thu: Tough JAMB drills in English, Maths, Physics & Chemistry · Fri: WAEC Theory & Further Maths/Civic · Sat: National /400 CBT Arena.',
      trapNote:
        'Students who abandon WAEC theory until May struggle to write full workings; students who ignore JAMB speed until March miss university cut-offs.',
      winningRule:
        'One unified syllabus map credits overlapping topics across both exams while training each paper’s distinct exam technique.',
    },
    ctaLabel: 'Start Combined 70/30 Track',
  },
};

export interface LiveTrapChallenge {
  id: string;
  subj: SubjectId;
  tabLabel: string;
  subjectLabel: string;
  tutorName: string;
  topicTitle: string;
  timeBudgetSec: number;
  stem: string;
  options: readonly [string, string, string, string];
  correctIdx: 0 | 1 | 2 | 3;
  twinTrapIdx: 0 | 1 | 2 | 3;
  trapWarningHeadline: string;
  optionFeedback: readonly [string, string, string, string];
  winningStep: string;
  waecRubricSteps: readonly {
    code: string;
    detail: string;
  }[];
}

export const LIVE_TRAP_CHALLENGES: readonly LiveTrapChallenge[] = [
  {
    id: 'chem-diprotic',
    subj: 'chem',
    tabLabel: 'Chemistry',
    subjectLabel: 'Chemistry · Volumetric Stoichiometry',
    tutorName: SUBJECT_TUTOR_REGISTRY.chem.tutorName,
    topicTitle: 'Acid-Base Mole Ratio Trap',
    timeBudgetSec: 30,
    stem: 'What volume of 0.25 mol/dm³ H₂SO₄ completely neutralizes 25.0 cm³ of 0.50 mol/dm³ NaOH?',
    options: ['12.5 cm³', '25.0 cm³', '50.0 cm³', '37.5 cm³'],
    correctIdx: 1,
    twinTrapIdx: 2,
    trapWarningHeadline: '50.0 cm³ is the classic 1 : 1 twin-option trap when candidates ignore diprotic H₂SO₄.',
    optionFeedback: [
      '12.5 cm³ divides by 2 twice after already applying the 1 : 2 mole ratio.',
      'Exact! H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O gives nₐ/nᵦ = 1/2, so (0.25 × Vₐ)/(0.50 × 25.0) = 1/2 → Vₐ = 25.0 cm³.',
      'Twin-option trap! 50.0 cm³ assumes CₐVₐ = CᵦVᵦ (1 : 1) instead of balancing H₂SO₄ + 2NaOH (1 : 2).',
      '37.5 cm³ averages the concentrations instead of using the stoichiometric mole ratio.',
    ],
    winningStep: 'Always write the balanced H⁺ : OH⁻ ratio first: 1 mole of H₂SO₄ neutralizes 2 moles of NaOH.',
    waecRubricSteps: [
      { code: 'M1', detail: 'Balanced equation: H₂SO₄(aq) + 2NaOH(aq) → Na₂SO₄(aq) + 2H₂O(l)' },
      { code: 'M1', detail: 'Correct substitution: (0.25 × Vₐ) / (0.50 × 25.0) = 1 / 2' },
      { code: 'A1', detail: 'Final evaluation with unit to 1 d.p.: Vₐ = 25.0 cm³' },
    ],
  },
  {
    id: 'eng-concord',
    subj: 'eng',
    tabLabel: 'Use of English',
    subjectLabel: 'Use of English · Lexis & Concord',
    tutorName: SUBJECT_TUTOR_REGISTRY.eng.tutorName,
    topicTitle: 'Parenthetical Accompaniment Trap',
    timeBudgetSec: 25,
    stem: 'Choose the option that best completes the sentence: “The principal, together with her three vice-principals, ____ attending Saturday’s education summit.”',
    options: ['are', 'were', 'is', 'have been'],
    correctIdx: 2,
    twinTrapIdx: 0,
    trapWarningHeadline: '“are” is the twin-option trap triggered by the nearby plural noun “vice-principals”.',
    optionFeedback: [
      'Twin-option trap! Phrases like “together with”, “as well as”, and “along with” do not make a singular subject plural.',
      '“were” is plural and clashes with the singular head noun “The principal” and upcoming Saturday context.',
      'Exact! The grammatical subject remains singular (“The principal”), so the singular verb “is” governs the clause.',
      '“have been” is plural; singular concord would require “has been” or “is”.',
    ],
    winningStep: 'Mentally bracket everything between commas — “The principal [together with ...] IS attending.”',
    waecRubricSteps: [
      { code: 'M1', detail: 'Identify head noun “The principal” (3rd-person singular) before the comma.' },
      { code: 'M1', detail: 'Treat “together with her three vice-principals” as a parenthetical modifier.' },
      { code: 'A1', detail: 'Select singular present progressive auxiliary “is”.' },
    ],
  },
  {
    id: 'maths-percent',
    subj: 'maths',
    tabLabel: 'Mathematics',
    subjectLabel: 'Mathematics · Commercial Arithmetic',
    tutorName: SUBJECT_TUTOR_REGISTRY.maths.tutorName,
    topicTitle: 'Reverse Cost-Price Percentage Trap',
    timeBudgetSec: 30,
    stem: 'A trader sells a scientific calculator for ₦13,800 and makes a profit of 15%. How much did the trader originally pay for the calculator?',
    options: ['₦11,730', '₦12,000', '₦12,300', '₦15,870'],
    correctIdx: 1,
    twinTrapIdx: 0,
    trapWarningHeadline: '₦11,730 is the twin-option trap from subtracting 15% of the selling price instead of dividing by 1.15.',
    optionFeedback: [
      'Twin-option trap! Taking 85% of ₦13,800 deducts 15% of the selling price, whereas profit is always based on cost price.',
      'Exact! Selling Price = 115% of Cost Price → Cost Price = 13,800 ÷ 1.15 = ₦12,000.',
      '₦12,300 subtracts a flat ₦1,500 guess instead of solving 1.15 × CP = 13,800.',
      '₦15,870 adds another 15% on top of the selling price instead of reversing the markup.',
    ],
    winningStep: 'Set Cost Price = 100%. At 15% profit, Selling Price = 115% = 1.15 × CP → CP = 13,800 / 1.15.',
    waecRubricSteps: [
      { code: 'M1', detail: 'Express relation: SP = CP × (1 + 15/100) = 1.15 × CP' },
      { code: 'M1', detail: 'Rearrange for Cost Price: CP = 13,800 ÷ 1.15' },
      { code: 'A1', detail: 'Exact Naira currency answer: ₦12,000' },
    ],
  },
  {
    id: 'phys-power',
    subj: 'phys',
    tabLabel: 'Physics',
    subjectLabel: 'Physics · Electric Circuits',
    tutorName: SUBJECT_TUTOR_REGISTRY.phys.tutorName,
    topicTitle: 'Voltage-Halving Power Dissipation Trap',
    timeBudgetSec: 30,
    stem: 'An electric heater of constant resistance dissipates 480 W when connected across a 240 V supply. What power does it dissipate across a 120 V supply?',
    options: ['240 W', '120 W', '960 W', '160 W'],
    correctIdx: 1,
    twinTrapIdx: 0,
    trapWarningHeadline: '240 W is the linear-proportion trap when candidates forget that P = V² / R squares voltage.',
    optionFeedback: [
      'Twin-option trap! Halving V does not halve P when resistance R stays constant — P varies as V².',
      'Exact! Since P = V² / R with constant R, halving voltage (120 / 240 = 1/2) quarters power: 480 × (1/2)² = 120 W.',
      '960 W doubles the power as if voltage and power were inversely related.',
      '160 W divides by 3 instead of squaring the 1/2 voltage ratio.',
    ],
    winningStep: 'For fixed resistance R, use P₂ / P₁ = (V₂ / V₁)² = (120 / 240)² = 1 / 4 → 120 W.',
    waecRubricSteps: [
      { code: 'M1', detail: 'State constant-resistance power formula: P = V² / R (or find R = 240² / 480 = 120 Ω)' },
      { code: 'M1', detail: 'Substitute new potential difference: P₂ = 120² / 120' },
      { code: 'A1', detail: 'Correct power with SI unit: P₂ = 120 W' },
    ],
  },
  {
    id: 'econ-elasticity',
    subj: 'econ',
    tabLabel: 'Economics',
    subjectLabel: 'Economics · Price Elasticity & Revenue',
    tutorName: SUBJECT_TUTOR_REGISTRY.econ.tutorName,
    topicTitle: 'Elastic Demand Total Revenue Trap',
    timeBudgetSec: 25,
    stem: 'If the price elasticity of demand for data bundles is 2.5 (price elastic), a 10% reduction in price will cause the seller’s total revenue to:',
    options: [
      'fall because unit price dropped by 10%',
      'rise because quantity demanded jumps by 25%',
      'remain constant because elasticity exceeds 1',
      'fall by 25% due to excess demand',
    ],
    correctIdx: 1,
    twinTrapIdx: 0,
    trapWarningHeadline: 'Assuming lower price always lowers revenue ignores the larger +25% surge in quantity sold.',
    optionFeedback: [
      'Twin-option trap! Revenue only falls with a price cut when demand is inelastic (PED < 1).',
      'Exact! %ΔQd = PED × %ΔP = 2.5 × 10% = +25%. A 25% volume surge outweighs a 10% price cut, raising total revenue.',
      'Total revenue remains constant only under unitary elasticity (PED = 1).',
      'Quantity demanded rises by 25%, which expands rather than shrinks total sales revenue.',
    ],
    winningStep: 'When PED > 1 (elastic), Price and Total Revenue move in opposite directions.',
    waecRubricSteps: [
      { code: 'M1', detail: 'Compute percentage change in quantity: %ΔQd = 2.5 × 10% = +25%' },
      { code: 'M1', detail: 'Compare +25% gain in quantity sold against −10% change in unit price' },
      { code: 'A1', detail: 'Conclude Total Revenue (P × Q) increases' },
    ],
  },
];

export interface TrapChallengeVerdict {
  isCorrect: boolean;
  fellForTwinTrap: boolean;
  paceVerdict: string;
  feedbackHeadline: string;
  selectedExplanation: string;
}

export function evaluateWebsiteTrapAttempt(
  challenge: LiveTrapChallenge,
  pickedIdx: number,
  elapsedSec: number
): TrapChallengeVerdict {
  const safeIdx = Math.max(0, Math.min(3, Math.floor(pickedIdx)));
  const cleanSec = Math.max(1, Math.round(elapsedSec));
  const isCorrect = safeIdx === challenge.correctIdx;
  const fellForTwinTrap = safeIdx === challenge.twinTrapIdx;
  const beatClock = cleanSec <= challenge.timeBudgetSec;

  const paceVerdict = beatClock
    ? `${cleanSec}s · Within ${challenge.timeBudgetSec}s Tough JAMB pace`
    : `${cleanSec}s · ${cleanSec - challenge.timeBudgetSec}s over Tough JAMB pace`;

  let feedbackHeadline: string;
  if (isCorrect && beatClock) {
    feedbackHeadline = 'Sharp eye — you beat both the twin-option trap and the 30s clock.';
  } else if (isCorrect) {
    feedbackHeadline = 'Correct concept — next step is locking it under the 30-second UTME pace.';
  } else if (fellForTwinTrap) {
    feedbackHeadline = 'Caught by the JAMB twin-option distractor — here is the exact fix:';
  } else {
    feedbackHeadline = 'Missed step — review the fast elimination rule below:';
  }

  return {
    isCorrect,
    fellForTwinTrap,
    paceVerdict,
    feedbackHeadline,
    selectedExplanation: challenge.optionFeedback[safeIdx] || challenge.winningStep,
  };
}

export type UniversityCourseId =
  | 'med'
  | 'cs'
  | 'law'
  | 'engr'
  | 'nurs'
  | 'pharm'
  | 'econ'
  | 'mass';

export interface UniversityCoursePreset {
  id: UniversityCourseId;
  shortTab: string;
  title: string;
  facultyLine: string;
  campusesLine: string;
  cutOffTarget400: number;
  jambQuartet: readonly [SubjectId, SubjectId, SubjectId, SubjectId];
  waecKeySubjects: readonly SubjectId[];
  visualSubj: SubjectId;
}

export const UNIVERSITY_COURSE_PRESETS: readonly UniversityCoursePreset[] = [
  {
    id: 'med',
    shortTab: 'Medicine',
    title: 'Medicine & Surgery (MBBS)',
    facultyLine: 'College of Medicine & Health Sciences',
    campusesLine: 'UNILAG · UI · UNN · ABU · UNIBEN · LASU',
    cutOffTarget400: 310,
    jambQuartet: ['eng', 'bio', 'chem', 'phys'],
    waecKeySubjects: ['eng', 'maths', 'bio', 'chem', 'phys'],
    visualSubj: 'bio',
  },
  {
    id: 'cs',
    shortTab: 'Comp. Science',
    title: 'Computer Science & Software Engineering',
    facultyLine: 'Computing, AI & Systems Engineering',
    campusesLine: 'UNILAG · OAU · FUTA · Covenant · UI · FUTMINNA',
    cutOffTarget400: 285,
    jambQuartet: ['eng', 'maths', 'phys', 'chem'],
    waecKeySubjects: ['eng', 'maths', 'phys', 'chem', 'dataproc'],
    visualSubj: 'digitech',
  },
  {
    id: 'law',
    shortTab: 'Law (LL.B)',
    title: 'Common & Civil Law (LL.B)',
    facultyLine: 'Faculty of Law & Jurisprudence',
    campusesLine: 'UNILAG · UI · OAU · UNIBEN · UNILORIN · BUK',
    cutOffTarget400: 292,
    jambQuartet: ['eng', 'lit', 'govt', 'crs'],
    waecKeySubjects: ['eng', 'maths', 'lit', 'govt', 'civic'],
    visualSubj: 'eng',
  },
  {
    id: 'engr',
    shortTab: 'Engineering',
    title: 'Electrical, Mechanical & Civil Engineering',
    facultyLine: 'Faculty of Engineering & Technology',
    campusesLine: 'UNILAG · OAU · FUTO · ABU · UNN · Covenant',
    cutOffTarget400: 278,
    jambQuartet: ['eng', 'maths', 'phys', 'chem'],
    waecKeySubjects: ['eng', 'maths', 'phys', 'chem', 'fmaths'],
    visualSubj: 'fmaths',
  },
  {
    id: 'nurs',
    shortTab: 'Nursing',
    title: 'Nursing Science (B.NSc)',
    facultyLine: 'Clinical Nursing & Allied Health',
    campusesLine: 'UI · OAU · UNILORIN · UNN · LASU · Babcock',
    cutOffTarget400: 282,
    jambQuartet: ['eng', 'bio', 'chem', 'phys'],
    waecKeySubjects: ['eng', 'maths', 'bio', 'chem', 'phys'],
    visualSubj: 'bio',
  },
  {
    id: 'pharm',
    shortTab: 'Pharmacy',
    title: 'Doctor of Pharmacy (Pharm.D)',
    facultyLine: 'Faculty of Pharmaceutical Sciences',
    campusesLine: 'UNILAG · UI · UNIBEN · OAU · ABU · UNN',
    cutOffTarget400: 295,
    jambQuartet: ['eng', 'chem', 'bio', 'phys'],
    waecKeySubjects: ['eng', 'maths', 'chem', 'bio', 'phys'],
    visualSubj: 'chem',
  },
  {
    id: 'econ',
    shortTab: 'Economics & Acct',
    title: 'Economics, Accounting & Finance',
    facultyLine: 'Management & Social Sciences',
    campusesLine: 'UNILAG · UI · Covenant · OAU · UNN · LASU',
    cutOffTarget400: 268,
    jambQuartet: ['eng', 'maths', 'econ', 'acct'],
    waecKeySubjects: ['eng', 'maths', 'econ', 'acct', 'comm'],
    visualSubj: 'econ',
  },
  {
    id: 'mass',
    shortTab: 'Mass Comm',
    title: 'Mass Communication & Media Studies',
    facultyLine: 'Communication & Media Arts',
    campusesLine: 'UNILAG · LASU · UNN · BUK · Covenant · DELSU',
    cutOffTarget400: 262,
    jambQuartet: ['eng', 'lit', 'govt', 'econ'],
    waecKeySubjects: ['eng', 'maths', 'lit', 'govt', 'civic'],
    visualSubj: 'geog',
  },
];

export interface FeaturedWebsiteTeacher {
  subj: SubjectId;
  tutorName: string;
  subjectName: string;
  shortName: string;
  personalityTag: string;
  departmentLabel: string;
  toolsSummary: string;
  jambScript: string;
  waecScript: string;
  bothScript: string;
}

const FEATURED_TEACHER_SUBJECTS: readonly SubjectId[] = [
  'eng',
  'maths',
  'chem',
  'phys',
  'bio',
  'econ',
  'govt',
  'lit',
];

const TEACHER_DEPARTMENT_LABELS: Partial<Record<SubjectId, string>> = {
  eng: 'Compulsory for All Candidates',
  maths: 'Science & Commercial Core',
  chem: 'Physical & Health Sciences',
  phys: 'Engineering & Physical Sciences',
  bio: 'Medicine & Life Sciences',
  econ: 'Commercial & Social Sciences',
  govt: 'Law, Arts & Governance',
  lit: 'Humanities & Law',
  crs: 'Humanities & Moral Philosophy',
  acct: 'Financial & Commercial Core',
};

export function buildWebsiteTeacherForSubject(subj: SubjectId): FeaturedWebsiteTeacher {
  const reg = SUBJECT_TUTOR_REGISTRY[subj] || SUBJECT_TUTOR_REGISTRY.eng;
  const profile = TUTOR_PERSONALITY_PROFILES[subj] || TUTOR_PERSONALITY_PROFILES.eng;
  return {
    subj,
    tutorName: reg.tutorName,
    subjectName: reg.name,
    shortName: reg.short,
    personalityTag: profile.personalityTag,
    departmentLabel: TEACHER_DEPARTMENT_LABELS[subj] || 'Secondary Curriculum',
    toolsSummary: reg.toolsSummary,
    jambScript: profile.jamb,
    waecScript: profile.waec,
    bothScript: profile.bothCore,
  };
}

export function getFeaturedWebsiteTeachers(): FeaturedWebsiteTeacher[] {
  return FEATURED_TEACHER_SUBJECTS.map((subj) => buildWebsiteTeacherForSubject(subj));
}

export function getCourseTeacherQuartet(courseId: UniversityCourseId): FeaturedWebsiteTeacher[] {
  const course =
    UNIVERSITY_COURSE_PRESETS.find((c) => c.id === courseId) || UNIVERSITY_COURSE_PRESETS[0];
  return course.jambQuartet.map((sid) => buildWebsiteTeacherForSubject(sid));
}

export function getTeacherScriptForTrack(
  teacher: FeaturedWebsiteTeacher,
  track: ExamTrack
): string {
  if (track === 'jamb') return teacher.jambScript;
  if (track === 'waec') return teacher.waecScript;
  return teacher.bothScript;
}

export interface AdmissionCompassPlan {
  course: UniversityCoursePreset;
  currentScore400: number;
  gapToCutOff: number;
  readinessPct: number;
  targetAccuracyPct: number;
  statusKind: 'exceeding' | 'close' | 'building';
  statusBadgeLabel: string;
  weeklyTopicsTarget: number;
  saturdayCbtGoal: number;
  jambSubjectDetails: {
    id: SubjectId;
    name: string;
    shortName: string;
    tutorName: string;
  }[];
  waecCreditDetails: {
    id: SubjectId;
    shortName: string;
  }[];
  fourTeachers: FeaturedWebsiteTeacher[];
}

export function computeAdmissionCompassPlan(
  courseId: UniversityCourseId,
  rawCurrentScore400: number
): AdmissionCompassPlan {
  const course =
    UNIVERSITY_COURSE_PRESETS.find((c) => c.id === courseId) || UNIVERSITY_COURSE_PRESETS[0];
  const currentScore400 = Math.max(140, Math.min(370, Math.round(Number(rawCurrentScore400) || 215)));
  const gapToCutOff = Math.max(0, course.cutOffTarget400 - currentScore400);
  const readinessPct = Math.max(
    18,
    Math.min(100, Math.round((currentScore400 / course.cutOffTarget400) * 100))
  );
  const targetAccuracyPct = Math.max(
    68,
    Math.min(92, Math.round((course.cutOffTarget400 / 400) * 100) + 4)
  );

  let statusKind: AdmissionCompassPlan['statusKind'];
  let statusBadgeLabel: string;
  let weeklyTopicsTarget: number;

  if (gapToCutOff === 0) {
    statusKind = 'exceeding';
    statusBadgeLabel = `Above ${course.cutOffTarget400}/400 merit cut-off · Defend every Saturday`;
    weeklyTopicsTarget = 6;
  } else if (gapToCutOff <= 35) {
    statusKind = 'close';
    statusBadgeLabel = `+${gapToCutOff} marks needed to clear ${course.cutOffTarget400}/400 merit zone`;
    weeklyTopicsTarget = 9;
  } else {
    statusKind = 'building';
    statusBadgeLabel = `+${gapToCutOff} marks gap · High-intensity 6/7 topic drills recommended`;
    weeklyTopicsTarget = 12;
  }

  const jambSubjectDetails = course.jambQuartet.map((sid) => ({
    id: sid,
    name: SUBJECT_INFO[sid].name,
    shortName: SUBJECT_INFO[sid].short,
    tutorName: SUBJECT_TUTOR_REGISTRY[sid].tutorName,
  }));

  const waecCreditDetails = course.waecKeySubjects.map((sid) => ({
    id: sid,
    shortName: SUBJECT_INFO[sid].short,
  }));

  return {
    course,
    currentScore400,
    gapToCutOff,
    readinessPct,
    targetAccuracyPct,
    statusKind,
    statusBadgeLabel,
    weeklyTopicsTarget,
    saturdayCbtGoal: Math.min(360, Math.max(course.cutOffTarget400, currentScore400 + 18)),
    jambSubjectDetails,
    waecCreditDetails,
    fourTeachers: getCourseTeacherQuartet(course.id),
  };
}

export const FALLBACK_SATURDAY_COHORT_ENTRIES: readonly DailyCbtParticipantEntry[] = [
  {
    participantKey: 'eyak-sat-1',
    displayName: 'Kamsiyochukwu O.',
    campusGoal: 'UNILAG · Medicine',
    mode: 'jamb',
    scaledScore: 334,
    maxScale: 400,
    rawCorrect: 151,
    totalQuestions: 180,
    accuracyPct: 84,
    durationSec: 5820,
  },
  {
    participantKey: 'eyak-sat-2',
    displayName: 'Inioluwa A.',
    campusGoal: 'UI · Computer Science',
    mode: 'jamb',
    scaledScore: 321,
    maxScale: 400,
    rawCorrect: 145,
    totalQuestions: 180,
    accuracyPct: 81,
    durationSec: 6040,
  },
  {
    participantKey: 'eyak-sat-3',
    displayName: 'Zainab M.',
    campusGoal: 'ABU · Pharmacy',
    mode: 'jamb',
    scaledScore: 309,
    maxScale: 400,
    rawCorrect: 139,
    totalQuestions: 180,
    accuracyPct: 77,
    durationSec: 6190,
  },
  {
    participantKey: 'eyak-sat-4',
    displayName: 'Tobiloba E.',
    campusGoal: 'OAU · Law (LL.B)',
    mode: 'jamb',
    scaledScore: 298,
    maxScale: 400,
    rawCorrect: 134,
    totalQuestions: 180,
    accuracyPct: 74,
    durationSec: 6310,
  },
];

export interface WebsiteSubjectDirectoryItem {
  id: SubjectId;
  name: string;
  shortName: string;
  tutorName: string;
  personalityTag: string;
  category: Exclude<WebsiteSubjectCategory, 'all'>;
  examBadgeText: string;
  companionText: string;
}

export function buildWebsiteSubjectDirectory(): WebsiteSubjectDirectoryItem[] {
  return ALL_SUBJECT_IDS.map((sid) => {
    const info = SUBJECT_INFO[sid];
    const reg = SUBJECT_TUTOR_REGISTRY[sid];
    const personality = TUTOR_PERSONALITY_PROFILES[sid];
    const isJamb = isJambSubject(sid);
    const isTrade = (WAEC_TRADE_ONLY_SUBJECT_IDS as readonly string[]).includes(sid);
    const category: Exclude<WebsiteSubjectCategory, 'all'> = isJamb
      ? 'jamb'
      : isTrade
        ? 'waec-trade'
        : 'waec-school';

    const examBadgeText = isJamb
      ? 'JAMB UTME · WAEC'
      : isTrade
        ? 'WAEC Trade Subject'
        : 'WAEC · NECO School';

    const hasLab = hasLabsForSubject(sid);
    const hasFormulas = hasFormulasForSubject(sid);
    const companionText =
      sid === 'eng'
        ? 'JAMB Novels Library · Grammar Studio'
        : sid === 'lit'
          ? '6 Prescribed Novels · Unseen Verse'
          : hasLab && hasFormulas
            ? 'Virtual Labs · Formula Studio'
            : hasLab
              ? 'Virtual Practicals Lab'
              : hasFormulas
                ? 'Formula & Rules Studio'
                : reg.studioLabel;

    return {
      id: sid,
      name: info.name,
      shortName: info.short,
      tutorName: reg.tutorName,
      personalityTag: personality.personalityTag,
      category,
      examBadgeText,
      companionText,
    };
  });
}

export function filterWebsiteSubjects(
  items: readonly WebsiteSubjectDirectoryItem[],
  category: WebsiteSubjectCategory,
  query: string
): WebsiteSubjectDirectoryItem[] {
  const normQuery = query.trim().toLowerCase();
  return items.filter((item) => {
    if (category !== 'all' && item.category !== category) {
      return false;
    }
    if (!normQuery) return true;
    const haystack =
      `${item.name} ${item.shortName} ${item.tutorName} ${item.personalityTag} ${item.examBadgeText} ${item.companionText}`.toLowerCase();
    return haystack.includes(normQuery);
  });
}

export function getWebsiteSubjectCounts(): {
  total: number;
  jamb: number;
  waecSchool: number;
  waecTrade: number;
  waecOnlyTotal: number;
} {
  return {
    total: ALL_SUBJECT_IDS.length,
    jamb: JAMB_SUBJECT_IDS.length,
    waecSchool: WAEC_SCHOOL_ONLY_SUBJECT_IDS.length,
    waecTrade: WAEC_TRADE_ONLY_SUBJECT_IDS.length,
    waecOnlyTotal: ALL_SUBJECT_IDS.filter((s) => isWaecOnlySubject(s)).length,
  };
}

export function formatNairaPrice(amountNgn: number): string {
  const safe = Math.max(0, Math.round(Number(amountNgn) || 0));
  return `₦${safe.toLocaleString('en-NG')}`;
}

export interface WebsitePricingDisplayPlan {
  id: PremiumPlanDef['id'];
  name: string;
  durationLabel: string;
  priceFormatted: string;
  perMonthEquivalent: string;
  blurb: string;
  highlightNote: string | null;
  isRecommended: boolean;
}

export function getWebsitePricingPlans(): {
  freeTrialDays: number;
  plans: WebsitePricingDisplayPlan[];
} {
  const plans = PREMIUM_PLANS.map((plan): WebsitePricingDisplayPlan => {
    const months = plan.id === 'monthly' ? 1 : plan.id === 'biannual' ? 6 : plan.id === 'annual' ? 12 : 0;
    const perMonthEquivalent =
      months > 0
        ? `${formatNairaPrice(Math.round(plan.priceNgn / months))}/month effective`
        : 'One-time payment · No renewals';
    const highlightNote = plan.popular
      ? `${plan.savingsBadge || 'Best value'} · Most chosen for SS3`
      : plan.savingsBadge || null;

    return {
      id: plan.id,
      name: plan.name,
      durationLabel: plan.shortLabel,
      priceFormatted: formatNairaPrice(plan.priceNgn),
      perMonthEquivalent,
      blurb: plan.blurb,
      highlightNote,
      isRecommended: Boolean(plan.popular),
    };
  });

  return {
    freeTrialDays: FREE_TRIAL_DAYS,
    plans,
  };
}

export interface SchoolInquiryInput {
  contactName: string;
  role: 'student' | 'parent' | 'school';
  emailOrPhone: string;
  schoolOrCity: string;
  studentCount: string;
}

export interface SchoolInquiryValidationResult {
  ok: boolean;
  error?: string;
  referenceCode?: string;
  summaryLine?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^(?:\+?234|0)[789][01]\d{8}$/;

export function validateSchoolParentInquiry(
  input: SchoolInquiryInput
): SchoolInquiryValidationResult {
  const name = input.contactName.trim();
  if (name.length < 2) {
    return {
      ok: false,
      error: 'Enter your full name (at least 2 characters).',
    };
  }

  const rawContact = input.emailOrPhone.trim();
  const compactPhone = rawContact.replace(/[\s()-]/g, '');
  const isEmail = EMAIL_RE.test(rawContact);
  const isNgPhone = PHONE_RE.test(compactPhone);
  if (!isEmail && !isNgPhone) {
    return {
      ok: false,
      error: 'Enter a valid email address or Nigerian phone number (e.g. 0803 123 4567).',
    };
  }

  const location = input.schoolOrCity.trim();
  if (location.length < 2) {
    return {
      ok: false,
      error: 'Enter your school name or city (e.g. Lagos, Abuja, Port Harcourt).',
    };
  }

  const parsedCount = Number(input.studentCount);
  if (!Number.isFinite(parsedCount) || parsedCount < 1 || parsedCount > 5000) {
    return {
      ok: false,
      error: 'Enter the number of scholars between 1 and 5,000.',
    };
  }

  const cleanCount = Math.round(parsedCount);
  let checksum = 0;
  const seed = `${name.toLowerCase()}|${rawContact.toLowerCase()}|${cleanCount}`;
  for (let i = 0; i < seed.length; i += 1) {
    checksum = (checksum * 31 + seed.charCodeAt(i)) % 5800;
  }
  const code = `ELRN-${4100 + checksum}`;
  const roleLabel =
    input.role === 'school'
      ? 'School cohort request'
      : input.role === 'parent'
        ? 'Parent sponsorship request'
        : 'Scholar onboarding inquiry';

  return {
    ok: true,
    referenceCode: code,
    summaryLine: `${roleLabel} logged for ${cleanCount} ${cleanCount === 1 ? 'scholar' : 'scholars'} in ${location}.`,
  };
}

export interface WebsiteTitrationState {
  acidVolumeCm3: number;
  equivalenceVolumeCm3: number;
  ph: number;
  phase: 'alkaline' | 'near-endpoint' | 'endpoint' | 'acidic';
  statusLabel: string;
  indicatorNote: string;
  flaskColorHex: string;
  flaskStrokeHex: string;
  buretteLiquidRatio: number;
  curveMarkerX: number;
  curveMarkerY: number;
}

/**
 * Exact stoichiometric pH simulator for titrating 25.0 cm³ of 0.50 mol/dm³ NaOH
 * with diprotic 0.25 mol/dm³ H₂SO₄ (equivalence volume = 25.00 cm³).
 */
export function computeWebsiteTitrationState(rawVolumeCm3: number): WebsiteTitrationState {
  const equivalenceVolumeCm3 = 25.0;
  const acidVolumeCm3 = Math.max(0, Math.min(35, Math.round(rawVolumeCm3 * 10) / 10));

  // Millimoles of OH- (25 * 0.50 = 12.5 mmol) vs H+ (2 * 0.25 * Va = 0.50 * Va mmol)
  const ohMmol = 12.5;
  const hMmol = 0.5 * acidVolumeCm3;
  const totalVol = 25.0 + acidVolumeCm3;

  let ph: number;
  if (Math.abs(ohMmol - hMmol) < 0.04) {
    ph = 7.0;
  } else if (ohMmol > hMmol) {
    const concOh = (ohMmol - hMmol) / totalVol;
    const pOh = -Math.log10(Math.max(1e-7, concOh));
    ph = Math.min(13.6, Math.max(7.1, 14 - pOh));
  } else {
    const concH = (hMmol - ohMmol) / totalVol;
    const rawPh = -Math.log10(Math.max(1e-7, concH));
    ph = Math.max(0.9, Math.min(6.9, rawPh));
  }
  const roundedPh = Math.round(ph * 10) / 10;

  let phase: WebsiteTitrationState['phase'];
  let statusLabel: string;
  let indicatorNote: string;
  let flaskColorHex: string;
  let flaskStrokeHex: string;

  if (acidVolumeCm3 >= 24.8 && acidVolumeCm3 <= 25.3) {
    phase = 'endpoint';
    statusLabel = '✓ END-POINT REACHED · 25.0 cm³ · Colourless';
    indicatorNote =
      'Phenolphthalein turns sharply from pale pink to clear colourless right at 25.0 cm³ (1 : 2 diprotic mole ratio).';
    flaskColorHex = '#E2E8F0';
    flaskStrokeHex = '#0F8A5F';
  } else if (acidVolumeCm3 >= 23.0 && acidVolumeCm3 < 24.8) {
    phase = 'near-endpoint';
    statusLabel = '● APPROACHING END-POINT · Faint Pink';
    indicatorNote =
      'Swirl the conical flask and add acid drop by drop — one drop past 25.0 cm³ collapses the pH from 11 to 7.';
    flaskColorHex = '#FBCFE8';
    flaskStrokeHex = '#DB2777';
  } else if (acidVolumeCm3 < 23.0) {
    phase = 'alkaline';
    statusLabel = '● ALKALINE · Deep Pink Phenolphthalein';
    indicatorNote =
      'Excess NaOH keeps the flask strongly alkaline (pH > 12). Phenolphthalein stays bright pink.';
    flaskColorHex = '#F472B6';
    flaskStrokeHex = '#BE185D';
  } else {
    phase = 'acidic';
    statusLabel = '▲ OVER-TITRATED · Excess H₂SO₄ Acid';
    indicatorNote =
      'Past 25.0 cm³, excess H⁺ ions drop pH below 2. Record titre at the exact first permanent disappearance of pink.';
    flaskColorHex = '#DBEAFE';
    flaskStrokeHex = '#0284C7';
  }

  // Graph box: x in [32, 232] for volume 0..35, y in [18, 128] for pH 14..0
  const curveMarkerX = Number((32 + (acidVolumeCm3 / 35) * 200).toFixed(1));
  const curveMarkerY = Number((128 - (roundedPh / 14) * 110).toFixed(1));
  const buretteLiquidRatio = Math.max(0.14, Math.min(0.95, 0.95 - (acidVolumeCm3 / 35) * 0.76));

  return {
    acidVolumeCm3,
    equivalenceVolumeCm3,
    ph: roundedPh,
    phase,
    statusLabel,
    indicatorNote,
    flaskColorHex,
    flaskStrokeHex,
    buretteLiquidRatio,
    curveMarkerX,
    curveMarkerY,
  };
}

export function buildTitrationCurvePolyline(): string {
  const pts: string[] = [];
  const sampleVolumes = [
    0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 23.5, 24.2, 24.6, 24.9, 25.0, 25.1, 25.4, 25.8,
    26.5, 28, 30, 32, 35,
  ];
  for (const v of sampleVolumes) {
    const st = computeWebsiteTitrationState(v);
    pts.push(`${st.curveMarkerX},${st.curveMarkerY}`);
  }
  return pts.join(' ');
}

export interface CohortPassEstimate {
  scholars: number;
  planId: 'monthly' | 'biannual' | 'annual';
  planLabel: string;
  unitPriceNgn: number;
  discountPct: number;
  discountLabel: string;
  subtotalNgn: number;
  savingsNgn: number;
  totalNgn: number;
  perScholarFinalNgn: number;
}

export function calculateCohortPassEstimate(
  rawScholars: string | number,
  planId: 'monthly' | 'biannual' | 'annual'
): CohortPassEstimate {
  const parsed = Math.round(Number(rawScholars) || 1);
  const scholars = Math.max(1, Math.min(5000, parsed));
  const plan = PREMIUM_PLANS.find((p) => p.id === planId) || PREMIUM_PLANS[2];
  const unitPriceNgn = plan.priceNgn;

  const discountPct = scholars >= 50 ? 25 : scholars >= 10 ? 15 : 0;
  const discountLabel =
    discountPct === 25
      ? '25% School Cohort Tier (50+ scholars)'
      : discountPct === 15
        ? '15% Class Cohort Tier (10–49 scholars)'
        : 'Standard Pass Pricing (bulk discounts start at 10+ scholars)';

  const subtotalNgn = scholars * unitPriceNgn;
  const savingsNgn = Math.round((subtotalNgn * discountPct) / 100);
  const totalNgn = subtotalNgn - savingsNgn;
  const perScholarFinalNgn = Math.round(totalNgn / scholars);

  return {
    scholars,
    planId,
    planLabel: plan.name,
    unitPriceNgn,
    discountPct,
    discountLabel,
    subtotalNgn,
    savingsNgn,
    totalNgn,
    perScholarFinalNgn,
  };
}

export interface PlatformComparisonRow {
  dimension: string;
  eyakValue: string;
  standardValue: string;
}

export const PLATFORM_COMPARISON_ROWS: readonly PlatformComparisonRow[] = [
  {
    dimension: 'Exam Track Focus',
    eyakValue: 'Strict 4-subject JAMB lock, full WAEC/SSCE, or 70/30 combined SS3 planner',
    standardValue: 'Mixed subject dump with no JAMB vs WAEC daily focus weighting',
  },
  {
    dimension: 'Voice Teachers',
    eyakValue: '49 distinct subject personalities — one-time intro, zero repetition in lessons',
    standardValue: 'Silent text screens or robotic voice greetings repeated every click',
  },
  {
    dimension: 'UTME Question Rigor',
    eyakValue: 'Twin-option look-alike distractors & 6/7 in 3:30 tougher-than-UTME drills',
    standardValue: 'Recycled surface questions with obvious throwaway options',
  },
  {
    dimension: 'Saturday Competition',
    eyakValue: 'Every Saturday /400 National CBT Arena with live same-day student rank',
    standardValue: 'Isolated solo quizzes with no national cohort benchmark',
  },
  {
    dimension: 'Science & Maths Practicals',
    eyakValue: '87 interactive Chemistry, Physics, Biology & compass construction labs',
    standardValue: 'Static scanned diagrams with no hands-on experimentation',
  },
  {
    dimension: 'WAEC Paper 2 Marking',
    eyakValue: 'Chief Examiner mistake shields + M1/M2/A1 step-by-step Theory Coach',
    standardValue: 'Multiple-choice only with no written method-mark coaching',
  },
];

export interface CompassConstructionState {
  angleDeg: number;
  bearingThreeFig: string;
  constructionKind: 'canonical-compass' | 'protractor-locus';
  statusLabel: string;
  methodSummary: string;
  rubricSteps: string[];
  originX: number;
  originY: number;
  baseEndX: number;
  baseEndY: number;
  rayEndX: number;
  rayEndY: number;
  bisectorEndX: number;
  bisectorEndY: number;
  arcPathD: string;
  guidePointPx: number;
  guidePointPy: number;
  guidePointQx: number;
  guidePointQy: number;
  bisectIntersectionX: number;
  bisectIntersectionY: number;
}

/**
 * Pure SVG geometric & WAEC Paper 2 ruler-and-compass construction engine.
 * Origin O = (46, 156), base ray OA horizontal right of length 158.
 */
export function computeCompassConstructionState(rawAngleDeg: number): CompassConstructionState {
  const angleDeg = Math.max(15, Math.min(150, Math.round(Number(rawAngleDeg) || 60)));
  const originX = 46;
  const originY = 156;
  const rayLen = 132;
  const baseArcR = 64;

  const rad = (angleDeg * Math.PI) / 180;
  const halfRad = rad / 2;

  const baseEndX = originX + 164;
  const baseEndY = originY;

  const rayEndX = Number((originX + rayLen * Math.cos(rad)).toFixed(1));
  const rayEndY = Number((originY - rayLen * Math.sin(rad)).toFixed(1));

  const bisectorEndX = Number((originX + (rayLen - 16) * Math.cos(halfRad)).toFixed(1));
  const bisectorEndY = Number((originY - (rayLen - 16) * Math.sin(halfRad)).toFixed(1));

  const guidePointPx = Number((originX + baseArcR).toFixed(1));
  const guidePointPy = originY;
  const guidePointQx = Number((originX + baseArcR * Math.cos(rad)).toFixed(1));
  const guidePointQy = Number((originY - baseArcR * Math.sin(rad)).toFixed(1));

  const bisectR = 98;
  const bisectIntersectionX = Number((originX + bisectR * Math.cos(halfRad)).toFixed(1));
  const bisectIntersectionY = Number((originY - bisectR * Math.sin(halfRad)).toFixed(1));

  const largeArc = angleDeg > 180 ? 1 : 0;
  const arcPathD = `M ${guidePointPx} ${guidePointPy} A ${baseArcR} ${baseArcR} 0 ${largeArc} 0 ${guidePointQx} ${guidePointQy}`;

  // Three-figure clockwise bearing from North (90° up on diagram corresponds to 000° North;
  // base ray East = 090°; constructed ray at elevation angleDeg from East -> bearing = (90 - angleDeg + 360) % 360)
  const rawBearing = ((90 - angleDeg) % 360 + 360) % 360;
  const bearingThreeFig = `${String(rawBearing).padStart(3, '0')}°`;

  const canonicalAngles: Record<number, { label: string; summary: string; steps: string[] }> = {
    30: {
      label: '✓ PURE COMPASS · 30° (Bisected 60° Arc)',
      summary:
        'Construct 60° first using equal-radius arcs OP = PQ, then bisect ∠QOP with intersecting arcs from P and Q.',
      steps: [
        'M1 · Swing base arc of radius r from O cutting OA at P, then step off equal chord PQ = r for 60°.',
        'M1 · From P and Q, strike equal arcs intersecting at R; leave all construction arcs visible.',
        'A1 · Rule straight ray OR cleanly through O for 30.0° (±1° examiner tolerance).',
      ],
    },
    45: {
      label: '✓ PURE COMPASS · 45° (Bisected 90° Perpendicular)',
      summary:
        'Erect a 90° perpendicular at O via 60° and 120° arcs, then bisect the right angle cleanly to 45°.',
      steps: [
        'M1 · Construct 90° perpendicular ray at O using intersecting arcs above 60° and 120° marks.',
        'M1 · Strike equal bisector arcs from the 0° base cut P and 90° cut Q meeting at R.',
        'A1 · Draw straightedge ray OR for 45.0° without erasing any construction arcs.',
      ],
    },
    60: {
      label: '✓ PURE COMPASS · 60° Equilateral Chord',
      summary:
        'Keeping the exact same compass radius r from O to P, place the needle on P and cut the base arc at Q.',
      steps: [
        'M1 · Draw base line OA and swing a wide arc centred at O cutting OA at P.',
        'M1 · Without changing compass width, centre at P and cut the first arc at Q (△OPQ is equilateral).',
        'A1 · Rule ray OQ cleanly for 60.0° and label the angle clearly.',
      ],
    },
    90: {
      label: '✓ PURE COMPASS · 90° Right-Angle Bisector',
      summary:
        'Step off two 60° chords along the base arc (60° and 120°), then bisect between them straight above O.',
      steps: [
        'M1 · Swing base arc centred at O and step off equal radius chords at 60° and 120°.',
        'M1 · From the 60° and 120° marks, strike equal arcs intersecting directly above O.',
        'A1 · Join O through the intersection for an exact 90.0° perpendicular.',
      ],
    },
    120: {
      label: '✓ PURE COMPASS · 120° Double Equilateral Step',
      summary:
        'Step the unchanged compass radius twice along the main arc from P (0° → 60° → 120°) and rule through O.',
      steps: [
        'M1 · Centre compass at O and draw a generous semicircular arc cutting OA at P.',
        'M1 · With unchanged radius, step from P to 60°, then from 60° to Q at 120°.',
        'A1 · Rule straight ray OQ for 120.0° leaving both step marks clearly visible.',
      ],
    },
  };

  const canonicalHit = canonicalAngles[angleDeg];
  if (canonicalHit) {
    return {
      angleDeg,
      bearingThreeFig,
      constructionKind: 'canonical-compass',
      statusLabel: canonicalHit.label,
      methodSummary: canonicalHit.summary,
      rubricSteps: canonicalHit.steps,
      originX,
      originY,
      baseEndX,
      baseEndY,
      rayEndX,
      rayEndY,
      bisectorEndX,
      bisectorEndY,
      arcPathD,
      guidePointPx,
      guidePointPy,
      guidePointQx,
      guidePointQy,
      bisectIntersectionX,
      bisectIntersectionY,
    };
  }

  return {
    angleDeg,
    bearingThreeFig,
    constructionKind: 'protractor-locus',
    statusLabel: `● PROTRACTOR & BISECTOR · ∠AOB = ${angleDeg}° (Bisector ${ (angleDeg / 2).toFixed(1) }°)`,
    methodSummary: `Ray OB is inclined at ${angleDeg}° to base OA, with locus bisector OM splitting ∠AOB into two equal ${(angleDeg / 2).toFixed(1)}° angles.`,
    rubricSteps: [
      `M1 · Align centre of protractor at O along OA and mark ${angleDeg}° accurately.`,
      `M1 · Swing equal arcs from P and Q intersecting at M to construct locus equidistant from OA and OB.`,
      `A1 · Rule rays OB and bisector OM cleanly with sharp pencil lines.`,
    ],
    originX,
    originY,
    baseEndX,
    baseEndY,
    rayEndX,
    rayEndY,
    bisectorEndX,
    bisectorEndY,
    arcPathD,
    guidePointPx,
    guidePointPy,
    guidePointQx,
    guidePointQy,
    bisectIntersectionX,
    bisectIntersectionY,
  };
}

export interface ConnectedStudyMissionSlot {
  slotNumber: number;
  subj: SubjectId;
  subjectShort: string;
  tutorName: string;
  missionTitle: string;
  examRoleLabel: string;
  activityKind: 'lesson' | 'practice' | 'lab' | 'theory';
  actionLabel: string;
  estimatedMinutes: number;
  labId?: string;
}

const CANONICAL_STARTER_TOPIC_TITLES: Partial<Record<SubjectId, string>> = {
  eng: 'Concord, Lexis & Stress Discrimination',
  maths: 'Indices, Logarithms & Quadratic Roots',
  chem: 'Stoichiometry, Mole Ratio & Titration',
  phys: 'Kinematics, Projectile Motion & Optics',
  bio: 'Cell Physiology, Genetics & Ecology',
  econ: 'Price Elasticity, Demand & Market Equilibrium',
  govt: 'Nigerian Federalism & Constitutional Development',
  lit: 'Poetic Devices, Unseen Prose & Drama Text',
  crs: 'Covenant, Leadership & Synoptic Gospels',
  acct: 'Double-Entry Ledger, Trial Balance & Depreciation',
  fmaths: 'Matrices, Polynomials & Calculus Tangents',
  civic: 'Citizenship, Rule of Law & Public Service',
  comm: 'Trade Channels, Banking & Insurance',
};

/**
 * Connects ExamTrack (Section 01) + UniversityCourseId & PracticeScore (Section 02)
 * + Voice Teachers (Section 03) + Practical Labs (Section 04) into a 4-slot live mission queue.
 */
export function buildConnectedStudyRoadmap(
  track: ExamTrack,
  courseId: UniversityCourseId,
  practiceScore400: number
): ConnectedStudyMissionSlot[] {
  const plan = computeAdmissionCompassPlan(courseId, practiceScore400);
  const quartet = plan.course.jambQuartet;
  const waecExtras = plan.course.waecKeySubjects.filter((s) => !quartet.includes(s));

  const pickTitle = (sid: SubjectId) =>
    CANONICAL_STARTER_TOPIC_TITLES[sid] || `${SUBJECT_INFO[sid].short} Core Exam Foundations`;

  if (track === 'jamb') {
    return quartet.map((sid, idx): ConnectedStudyMissionSlot => ({
      slotNumber: idx + 1,
      subj: sid,
      subjectShort: SUBJECT_INFO[sid].short,
      tutorName: SUBJECT_TUTOR_REGISTRY[sid].tutorName,
      missionTitle: pickTitle(sid),
      examRoleLabel: idx === 0 ? 'UTME Compulsory · 6/7 Drill' : 'UTME Elective · Twin-Option Drill',
      activityKind: idx === 0 ? 'lesson' : 'practice',
      actionLabel: idx === 0 ? 'Open Lesson' : 'Start Drill',
      estimatedMinutes: plan.gapToCutOff > 40 ? 15 : 12,
    }));
  }

  if (track === 'waec') {
    const waecLineup = plan.course.waecKeySubjects.slice(0, 4);
    return waecLineup.map((sid, idx): ConnectedStudyMissionSlot => {
      const hasPractical = sid === 'chem' || sid === 'maths';
      if (idx === 2 && hasPractical) {
        return {
          slotNumber: idx + 1,
          subj: sid,
          subjectShort: SUBJECT_INFO[sid].short,
          tutorName: SUBJECT_TUTOR_REGISTRY[sid].tutorName,
          missionTitle:
            sid === 'chem'
              ? 'Paper 3 Acid–Base Volumetric Titration'
              : 'Paper 2 Compass & Locus Construction',
          examRoleLabel: 'WAEC Practical Bench',
          activityKind: 'lab',
          actionLabel: 'Launch Lab',
          estimatedMinutes: 14,
          labId: sid === 'chem' ? 'c-titration' : 'angle-60',
        };
      }
      if (idx === 3) {
        return {
          slotNumber: idx + 1,
          subj: sid,
          subjectShort: SUBJECT_INFO[sid].short,
          tutorName: SUBJECT_TUTOR_REGISTRY[sid].tutorName,
          missionTitle: `${SUBJECT_INFO[sid].short} Paper 2 Structured Essay & Rubric`,
          examRoleLabel: 'WAEC Paper 2 · M1/A1 Coach',
          activityKind: 'theory',
          actionLabel: 'Open Theory Coach',
          estimatedMinutes: 15,
        };
      }
      return {
        slotNumber: idx + 1,
        subj: sid,
        subjectShort: SUBJECT_INFO[sid].short,
        tutorName: SUBJECT_TUTOR_REGISTRY[sid].tutorName,
        missionTitle: pickTitle(sid),
        examRoleLabel: 'WAEC Credit Core',
        activityKind: idx === 0 ? 'lesson' : 'practice',
        actionLabel: idx === 0 ? 'Open Lesson' : 'Start Practice',
        estimatedMinutes: 12,
      };
    });
  }

  // 'both' (70% JAMB Quartet + 30% WAEC Paper 2 / Extra Credit)
  const slot1 = quartet[0] || 'eng';
  const slot2 = quartet[1] || 'maths';
  const slot3 = quartet[2] || 'chem';
  const slot4 = waecExtras[0] || quartet[3] || 'maths';

  return [
    {
      slotNumber: 1,
      subj: slot1,
      subjectShort: SUBJECT_INFO[slot1].short,
      tutorName: SUBJECT_TUTOR_REGISTRY[slot1].tutorName,
      missionTitle: pickTitle(slot1),
      examRoleLabel: '70% JAMB Focus · Voice Lesson',
      activityKind: 'lesson',
      actionLabel: 'Open Lesson',
      estimatedMinutes: 12,
    },
    {
      slotNumber: 2,
      subj: slot2,
      subjectShort: SUBJECT_INFO[slot2].short,
      tutorName: SUBJECT_TUTOR_REGISTRY[slot2].tutorName,
      missionTitle: pickTitle(slot2),
      examRoleLabel: '70% JAMB Focus · Twin-Option Drill',
      activityKind: 'practice',
      actionLabel: 'Start Drill',
      estimatedMinutes: 14,
    },
    {
      slotNumber: 3,
      subj: slot3,
      subjectShort: SUBJECT_INFO[slot3].short,
      tutorName: SUBJECT_TUTOR_REGISTRY[slot3].tutorName,
      missionTitle:
        slot3 === 'chem'
          ? 'Volumetric Titration Practical & Stoichiometry'
          : pickTitle(slot3),
      examRoleLabel: slot3 === 'chem' ? 'JAMB + WAEC Paper 3 Lab' : '70% JAMB Focus · Core Drill',
      activityKind: slot3 === 'chem' ? 'lab' : 'practice',
      actionLabel: slot3 === 'chem' ? 'Launch Lab' : 'Start Drill',
      estimatedMinutes: 14,
      labId: slot3 === 'chem' ? 'c-titration' : undefined,
    },
    {
      slotNumber: 4,
      subj: slot4,
      subjectShort: SUBJECT_INFO[slot4].short,
      tutorName: SUBJECT_TUTOR_REGISTRY[slot4].tutorName,
      missionTitle: `${SUBJECT_INFO[slot4].short} WAEC Paper 2 Method-Mark Coach`,
      examRoleLabel: '30% WAEC Focus · M1/A1 Theory',
      activityKind: 'theory',
      actionLabel: 'Open Theory Coach',
      estimatedMinutes: 15,
    },
  ];
}

export interface WebsiteBlueprintSummary {
  trackLabel: string;
  courseTitle: string;
  campusGoal: string;
  scoreLine: string;
  subjectSummary: string;
  teacherSummary: string;
  preset: WebsiteOnboardingPreset;
}

export function buildWebsiteBlueprintSummary(
  track: ExamTrack,
  courseId: UniversityCourseId,
  practiceScore400: number,
  previewThemeId?: MasteryThemeId,
  selectedPlanId?: PremiumPlanId
): WebsiteBlueprintSummary {
  const plan = computeAdmissionCompassPlan(courseId, practiceScore400);
  const trackSpec = EXAM_TRACK_SHOWCASES[track];
  const enrolledSubjs =
    track === 'jamb'
      ? [...plan.course.jambQuartet]
      : Array.from(new Set([...plan.course.jambQuartet, ...plan.course.waecKeySubjects]));

  const campusPrimary = plan.course.campusesLine.split('·')[0].trim();
  const campusGoal = `${campusPrimary} · ${plan.course.shortTab}`;

  return {
    trackLabel: trackSpec.tabLabel,
    courseTitle: plan.course.title,
    campusGoal,
    scoreLine:
      plan.gapToCutOff > 0
        ? `${plan.currentScore400}/400 current → ${plan.course.cutOffTarget400}/400 target (+${plan.gapToCutOff})`
        : `${plan.currentScore400}/400 current (clears ${plan.course.cutOffTarget400}/400 merit cut-off)`,
    subjectSummary: plan.jambSubjectDetails.map((s) => s.shortName).join(' · '),
    teacherSummary: plan.fourTeachers.map((t) => t.tutorName).join(' · '),
    preset: {
      courseTitle: plan.course.title,
      jambQuartet: [...plan.course.jambQuartet],
      enrolledSubjs,
      campusGoal,
      targetPct: plan.targetAccuracyPct,
      practiceScore400: plan.currentScore400,
      previewThemeId,
      selectedPlanId,
    },
  };
}

export interface OpticsRaySegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface LensOpticsState {
  focalLengthCm: number;
  objectDistCm: number;
  imageDistCm: number | null; // positive = real on right, negative = virtual on left, null = infinity at F
  magnification: number | null;
  regime: 'beyond-2f' | 'at-2f' | 'between-f-2f' | 'at-f' | 'within-f';
  statusLabel: string;
  natureSummary: string;
  rubricSteps: string[];
  // SVG diagram coordinates (viewBox 0 0 264 176, lens centre L = (132, 92), scale = 3.1 px/cm)
  lensX: number;
  axisY: number;
  fLeftX: number;
  twoFLeftX: number;
  fRightX: number;
  twoFRightX: number;
  objX: number;
  objTopY: number;
  imgX: number | null;
  imgTopY: number | null;
  imgOnBench: boolean;
  isVirtual: boolean;
  ray1Incident: OpticsRaySegment;
  ray1Refracted: OpticsRaySegment;
  ray2ThroughCentre: OpticsRaySegment;
  virtualBackRay1: OpticsRaySegment | null;
  virtualBackRay2: OpticsRaySegment | null;
}

function clipRayFromPoint(
  x0: number,
  y0: number,
  dx: number,
  dy: number,
  bounds = { minX: 14, maxX: 250, minY: 18, maxY: 162 }
): { x: number; y: number } {
  let tMin = Infinity;
  if (dx > 1e-6) {
    tMin = Math.min(tMin, (bounds.maxX - x0) / dx);
  } else if (dx < -1e-6) {
    tMin = Math.min(tMin, (bounds.minX - x0) / dx);
  }
  if (dy > 1e-6) {
    tMin = Math.min(tMin, (bounds.maxY - y0) / dy);
  } else if (dy < -1e-6) {
    tMin = Math.min(tMin, (bounds.minY - y0) / dy);
  }
  const safeT = Number.isFinite(tMin) && tMin > 0 ? tMin : 0;
  return {
    x: Number((x0 + dx * safeT).toFixed(1)),
    y: Number((y0 + dy * safeT).toFixed(1)),
  };
}

/**
 * Pure WAEC Paper 3 & JAMB Physics converging thin-lens ray-optics simulator (1/f = 1/u + 1/v).
 * Focal length f = 10.0 cm; object distance u clamped to [6.0, 34.0] cm.
 */
export function computeLensOpticsState(
  rawObjectDistCm: number,
  focalLengthCm = 10
): LensOpticsState {
  const f = Math.max(5, Math.min(20, Number(focalLengthCm) || 10));
  const u = Math.max(6, Math.min(34, Math.round((Number(rawObjectDistCm) || 15) * 2) / 2));

  const lensX = 132;
  const axisY = 92;
  const scale = 3.1; // px per cm
  const objHeightPx = 20;
  const benchBounds = { minX: 14, maxX: 250, minY: 18, maxY: 162 };

  const fLeftX = Number((lensX - f * scale).toFixed(1));
  const twoFLeftX = Number((lensX - 2 * f * scale).toFixed(1));
  const fRightX = Number((lensX + f * scale).toFixed(1));
  const twoFRightX = Number((lensX + 2 * f * scale).toFixed(1));

  const objX = Number((lensX - u * scale).toFixed(1));
  const objTopY = Number((axisY - objHeightPx).toFixed(1));

  const ray1Incident: OpticsRaySegment = {
    x1: objX,
    y1: objTopY,
    x2: lensX,
    y2: objTopY,
  };

  // True physical directions for refracted Ray 1 (through F') and undeviated Ray 2 (through optical centre)
  const r1Dx = fRightX - lensX;
  const r1Dy = axisY - objTopY;
  const r2Dx = lensX - objX;
  const r2Dy = axisY - objTopY;

  if (Math.abs(u - f) < 0.25) {
    const r1End = clipRayFromPoint(lensX, objTopY, r1Dx, r1Dy, benchBounds);
    const r2End = clipRayFromPoint(objX, objTopY, r2Dx, r2Dy, benchBounds);
    return {
      focalLengthCm: f,
      objectDistCm: u,
      imageDistCm: null,
      magnification: null,
      regime: 'at-f',
      statusLabel: '▲ OBJECT AT PRINCIPAL FOCUS F · Parallel Emergent Rays (v = ∞)',
      natureSummary:
        'When u = f (10.0 cm), refracted rays emerge parallel at identical slope and never converge on a screen — the searchlight / collimator setting.',
      rubricSteps: [
        `M1 · Substitute into thin-lens formula: 1/v = 1/${f.toFixed(1)} − 1/${u.toFixed(1)} = 0 → v = ∞.`,
        'M1 · Avoid parallax error when aligning the optical object pin with the principal focus.',
        'A1 · State image nature: Formed at infinity, real, inverted, and highly magnified.',
      ],
      lensX,
      axisY,
      fLeftX,
      twoFLeftX,
      fRightX,
      twoFRightX,
      objX,
      objTopY,
      imgX: null,
      imgTopY: null,
      imgOnBench: false,
      isVirtual: false,
      ray1Incident,
      ray1Refracted: { x1: lensX, y1: objTopY, x2: r1End.x, y2: r1End.y },
      ray2ThroughCentre: { x1: objX, y1: objTopY, x2: r2End.x, y2: r2End.y },
      virtualBackRay1: null,
      virtualBackRay2: null,
    };
  }

  // 1/v = 1/f - 1/u = (u - f) / (f * u)
  const rawV = (f * u) / (u - f);
  const imageDistCm = Math.round(rawV * 10) / 10;
  const magnification = Math.round(Math.abs(rawV / u) * 100) / 100;
  const isVirtual = rawV < 0;

  const trueImgX = Number((lensX + rawV * scale).toFixed(1));
  const trueImgTopY = Number((axisY + objHeightPx * (rawV / u)).toFixed(1));
  const imgOnBench =
    trueImgX >= benchBounds.minX + 4 &&
    trueImgX <= benchBounds.maxX - 4 &&
    trueImgTopY >= benchBounds.minY + 4 &&
    trueImgTopY <= benchBounds.maxY - 4;

  const r1Clipped = clipRayFromPoint(lensX, objTopY, r1Dx, r1Dy, benchBounds);
  const r2Clipped = clipRayFromPoint(objX, objTopY, r2Dx, r2Dy, benchBounds);

  const ray1Refracted: OpticsRaySegment =
    !isVirtual && imgOnBench
      ? { x1: lensX, y1: objTopY, x2: trueImgX, y2: trueImgTopY }
      : { x1: lensX, y1: objTopY, x2: r1Clipped.x, y2: r1Clipped.y };

  const ray2ThroughCentre: OpticsRaySegment =
    !isVirtual && imgOnBench
      ? { x1: objX, y1: objTopY, x2: trueImgX, y2: trueImgTopY }
      : { x1: objX, y1: objTopY, x2: r2Clipped.x, y2: r2Clipped.y };

  let virtualBackRay1: OpticsRaySegment | null = null;
  let virtualBackRay2: OpticsRaySegment | null = null;
  if (isVirtual) {
    if (imgOnBench) {
      virtualBackRay1 = { x1: lensX, y1: objTopY, x2: trueImgX, y2: trueImgTopY };
      virtualBackRay2 = { x1: objX, y1: objTopY, x2: trueImgX, y2: trueImgTopY };
    } else {
      const vb1 = clipRayFromPoint(lensX, objTopY, -r1Dx, -r1Dy, benchBounds);
      const vb2 = clipRayFromPoint(objX, objTopY, -r2Dx, -r2Dy, benchBounds);
      virtualBackRay1 = { x1: lensX, y1: objTopY, x2: vb1.x, y2: vb1.y };
      virtualBackRay2 = { x1: objX, y1: objTopY, x2: vb2.x, y2: vb2.y };
    }
  }

  let regime: LensOpticsState['regime'];
  let statusLabel: string;
  let natureSummary: string;

  if (isVirtual) {
    regime = 'within-f';
    statusLabel = `▲ VIRTUAL MAGNIFIER · v = ${imageDistCm.toFixed(1)} cm · M = ${magnification.toFixed(2)}×`;
    natureSummary =
      'Inside the focal length (u < f), refracted rays diverge on the right and trace back to a virtual, erect, magnified image on the same side as the object.';
  } else if (Math.abs(u - 2 * f) < 0.35) {
    regime = 'at-2f';
    statusLabel = `✓ SYMMETRIC 2F BENCHMARK · v = +${imageDistCm.toFixed(1)} cm · M = 1.00×`;
    natureSummary =
      'At u = 2f (20.0 cm), the real inverted image forms at 2F on the opposite side with exact unit magnification (u + v = 4f minimum screen distance).';
  } else if (u < 2 * f) {
    regime = 'between-f-2f';
    statusLabel = `● REAL & MAGNIFIED · v = +${imageDistCm.toFixed(1)} cm · M = ${magnification.toFixed(2)}×`;
    natureSummary =
      'Between F and 2F (projector geometry), a real, inverted, magnified image forms beyond 2F on the white screen.';
  } else {
    regime = 'beyond-2f';
    statusLabel = `● REAL & DIMINISHED · v = +${imageDistCm.toFixed(1)} cm · M = ${magnification.toFixed(2)}×`;
    natureSummary =
      'Beyond 2F (camera geometry), a sharp, real, inverted, diminished image forms between F and 2F on the opposite side.';
  }

  return {
    focalLengthCm: f,
    objectDistCm: u,
    imageDistCm,
    magnification,
    regime,
    statusLabel,
    natureSummary,
    rubricSteps: [
      `M1 · Thin-lens substitution: 1/v = 1/${f.toFixed(1)} − 1/${u.toFixed(1)} → v = ${imageDistCm > 0 ? '+' : ''}${imageDistCm.toFixed(1)} cm.`,
      `M1 · Linear magnification: M = |v / u| = |${imageDistCm.toFixed(1)} / ${u.toFixed(1)}| = ${magnification.toFixed(2)}×.`,
      'A1 · WAEC Paper 3 precaution: Ensure lens sits vertically in its holder and read metre-rule scale perpendicular to eliminate parallax.',
    ],
    lensX,
    axisY,
    fLeftX,
    twoFLeftX,
    fRightX,
    twoFRightX,
    objX,
    objTopY,
    imgX: imgOnBench ? trueImgX : null,
    imgTopY: imgOnBench ? trueImgTopY : null,
    imgOnBench,
    isVirtual,
    ray1Incident,
    ray1Refracted,
    ray2ThroughCentre,
    virtualBackRay1,
    virtualBackRay2,
  };
}

export interface TopicPreviewItem {
  id: string;
  name: string;
  nerdcClass?: string;
}

export interface WebsiteSubjectInspectorSummary {
  subj: SubjectId;
  name: string;
  shortName: string;
  isJamb: boolean;
  isTrade: boolean;
  examStructureLine: string;
  tutorName: string;
  personalityTag: string;
  toolsSummary: string;
  voiceGreeting: string;
  totalTopics: number;
  previewTopics: TopicPreviewItem[];
  hasVirtualLabs: boolean;
  hasFormulaStudio: boolean;
  recommendedLabId: string | null;
}

const DEFAULT_LAB_FOR_SUBJECT: Partial<Record<SubjectId, string>> = {
  chem: 'c-titration',
  phys: 'p-lens-uv',
  maths: 'angle-60',
  bio: 'b-osmosis',
  agric: 'a-soil-ph',
};

export function buildSubjectInspectorSummary(
  subj: SubjectId,
  track: ExamTrack,
  rawTopics: readonly { id: string; name: string; nerdcClass?: string }[]
): WebsiteSubjectInspectorSummary {
  const teacher = buildWebsiteTeacherForSubject(subj);
  const info = SUBJECT_INFO[subj];
  const jambFlag = isJambSubject(subj);
  const tradeFlag = (WAEC_TRADE_ONLY_SUBJECT_IDS as readonly string[]).includes(subj);
  const effectiveTrackForSubject: ExamTrack = jambFlag ? track : 'waec';

  const examStructureLine = jambFlag
    ? subj === 'eng'
      ? 'JAMB UTME Compulsory (60 Qs) · WAEC Paper 1 Obj & Paper 2 Essay/Summary'
      : 'JAMB UTME Elective (40 Qs) · WAEC Paper 1 Obj & Paper 2 Structured Theory'
    : tradeFlag
      ? 'WAEC / NECO Entrepreneurship & Trade Syllabus · Paper 1 Obj & Paper 2 Practical/Theory'
      : 'WAEC / NECO Senior School Syllabus · Paper 1 Objective & Paper 2 Theory';

  const hasVirtualLabs = hasLabsForSubject(subj);
  const hasFormulaStudio = hasFormulasForSubject(subj);

  return {
    subj,
    name: info.name,
    shortName: info.short,
    isJamb: jambFlag,
    isTrade: tradeFlag,
    examStructureLine,
    tutorName: teacher.tutorName,
    personalityTag: teacher.personalityTag,
    toolsSummary: teacher.toolsSummary,
    voiceGreeting: getTeacherScriptForTrack(teacher, effectiveTrackForSubject),
    totalTopics: rawTopics.length,
    previewTopics: rawTopics.slice(0, 6).map((t) => ({
      id: t.id,
      name: t.name,
      nerdcClass: t.nerdcClass,
    })),
    hasVirtualLabs,
    hasFormulaStudio,
    recommendedLabId: DEFAULT_LAB_FOR_SUBJECT[subj] || null,
  };
}

export interface StoredWebsiteBlueprintState {
  selectedTrack: ExamTrack;
  selectedCourseId: UniversityCourseId;
  practiceScore: number;
  previewThemeId: MasteryThemeId;
}

const VALID_TRACKS: readonly ExamTrack[] = ['jamb', 'waec', 'both'];

export function parseStoredWebsiteBlueprint(
  rawJson: string | null | undefined
): Partial<StoredWebsiteBlueprintState> | null {
  if (!rawJson) return null;
  try {
    const parsed = JSON.parse(rawJson) as Record<string, unknown>;
    if (!parsed || typeof parsed !== 'object') return null;

    const out: Partial<StoredWebsiteBlueprintState> = {};
    if (
      typeof parsed.selectedTrack === 'string' &&
      (VALID_TRACKS as readonly string[]).includes(parsed.selectedTrack)
    ) {
      out.selectedTrack = parsed.selectedTrack as ExamTrack;
    }
    if (
      typeof parsed.selectedCourseId === 'string' &&
      UNIVERSITY_COURSE_PRESETS.some((c) => c.id === parsed.selectedCourseId)
    ) {
      out.selectedCourseId = parsed.selectedCourseId as UniversityCourseId;
    }
    if (typeof parsed.practiceScore === 'number' && Number.isFinite(parsed.practiceScore)) {
      out.practiceScore = Math.max(140, Math.min(370, Math.round(parsed.practiceScore)));
    }
    if (
      typeof parsed.previewThemeId === 'string' &&
      MASTERY_THEMES.some((t) => t.id === parsed.previewThemeId)
    ) {
      out.previewThemeId = parsed.previewThemeId as MasteryThemeId;
    }
    return Object.keys(out).length > 0 ? out : null;
  } catch {
    return null;
  }
}

export interface HeroQuickChallengeSpec {
  subj: SubjectId;
  subjectLabel: string;
  tutorName: string;
  topicTag: string;
  prompt: string;
  options: readonly [string, string, string, string];
  correctIdx: number;
  trapIdx: number;
}

export interface HeroQuickVerdict {
  isCorrect: boolean;
  isTrapOption: boolean;
  statusLine: string;
  explanation: string;
}

export const HERO_QUICK_CHALLENGE: HeroQuickChallengeSpec = {
  subj: 'eng',
  subjectLabel: 'Use of English (Compulsory)',
  tutorName: 'Miss Adaeze',
  topicTag: 'Proximity Concord · 15s Reflex',
  prompt:
    'Neither the vice-chancellor nor the newly admitted scholars ___ aware that Saturday CBT registration closes at noon.',
  options: ['was', 'were', 'is being', 'has been'],
  correctIdx: 1,
  trapIdx: 0,
};

export function evaluateHeroQuickChallenge(pickedIdx: number): HeroQuickVerdict {
  const safe = Math.max(0, Math.min(3, Math.floor(Number(pickedIdx) || 0)));
  if (safe === HERO_QUICK_CHALLENGE.correctIdx) {
    return {
      isCorrect: true,
      isTrapOption: false,
      statusLine: '✓ +12 XP · UTME Proximity Rule Mastered',
      explanation:
        'Under JAMB’s proximity rule (“neither … nor”), the verb agrees with the nearer noun (“scholars” → plural “were”).',
    };
  }
  if (safe === HERO_QUICK_CHALLENGE.trapIdx) {
    return {
      isCorrect: false,
      isTrapOption: true,
      statusLine: '▲ Twin-Option Trap Caught · Why “was” Fails',
      explanation:
        'Rushed candidates match singular “vice-chancellor” and pick “was”. With “neither … nor”, match the nearer subject (“scholars” → “were”).',
    };
  }
  return {
    isCorrect: false,
    isTrapOption: false,
    statusLine: '▲ Tense & Number Mismatch · Correct Answer: B (were)',
    explanation:
      'Because the nearer subject “scholars” is plural, singular forms (“is being”, “has been”) are eliminated immediately.',
  };
}



