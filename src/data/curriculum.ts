import type { InteractiveLesson, Question, SubjectId, Topic, UserProgress } from '../types';
import { MATH_TOPICS } from './mathTopics';
import { applyMathGenerators } from './mathGenerators';
import { buildMathInteractiveLessons } from './mathInteractive';
import { buildChemCurriculum } from './chemData';
import { filterChemTopicsByClass } from './chemNerdc2027';
import { enrichMathCurriculum, filterMathTopicsByClass } from './mathNerdc2027';
import { buildEngCurriculum } from './engData';
import { filterEngTopicsByClass } from './engNerdc2027';
import { buildPhysCurriculum } from './physData';
import { filterPhysTopicsByClass } from './physNerdc2027';
import { buildBioCurriculum } from './bioData';
import { filterBioTopicsByClass } from './bioNerdc2027';
import { buildAgricCurriculum } from './agricData';
import { filterAgricTopicsByClass } from './agricNerdc2027';
import { buildEconCurriculum } from './econData';
import { filterEconTopicsByClass } from './econNerdc2027';
import { buildCivicCurriculum } from './civicData';
import { filterCivicTopicsByClass } from './civicNerdc2027';
import { buildFMathCurriculum } from './fmathData';
import { filterFMathTopicsByClass } from './fmathNerdc2027';
import { buildGeogCurriculum } from './geogData';
import { filterGeogTopicsByClass } from './geogNerdc2027';
import { buildDigiTechCurriculum } from './digitechData';
import { filterDigiTechTopicsByClass } from './digitechNerdc2027';
import { buildDataProcCurriculum } from './dataprocData';
import { filterDataProcTopicsByClass } from './dataprocNerdc2027';

// Part 4 core JAMB UTME subjects (single-block syllabi)
import { buildGovtCurriculum } from './utme/govt';
import { buildLitCurriculum } from './utme/lit';
import { buildCrsCurriculum } from './utme/crs';
import { buildIrsCurriculum } from './utme/irs';
import { buildCommCurriculum } from './utme/comm';
import { buildAcctCurriculum } from './utme/acct';

// Remaining 11 official JAMB UTME subjects
import {
  buildArtCurriculum,
  buildCompCurriculum,
  buildHistCurriculum,
  buildHomeEcCurriculum,
  buildMusicCurriculum,
  buildPheCurriculum,
} from './utme/jambHumanities';
import {
  buildArabicCurriculum,
  buildFrenchCurriculum,
  buildHausaCurriculum,
  buildIgboCurriculum,
  buildYorubaCurriculum,
} from './utme/jambLanguages';

// 20 additional WAEC/NECO-only school & trade subjects
import {
  buildAnimalHusbCurriculum,
  buildFisheriesCurriculum,
  buildFoodNutCurriculum,
  buildHomeMgtCurriculum,
  buildTechDrawCurriculum,
} from './utme/waecAppliedA';
import {
  buildBookKeepCurriculum,
  buildInsuranceCurriculum,
  buildMarketingCurriculum,
  buildOfficePracCurriculum,
  buildStoreMgtCurriculum,
} from './utme/waecAppliedB';
import {
  buildCateringCurriculum,
  buildCosmetCurriculum,
  buildGarmentCurriculum,
  buildPhotoCurriculum,
  buildTourismCurriculum,
} from './utme/waecTradesA';
import {
  buildAutoMechCurriculum,
  buildBlockLayCurriculum,
  buildCarpentryCurriculum,
  buildElecInstCurriculum,
  buildGsmCurriculum,
} from './utme/waecTradesB';

import { bankForTopic } from '../utils/engine';
import { ALL_SUBJECT_IDS } from '../utils/examSubjects';
import { calibrateSubjectCurriculum } from '../utils/jambDistractorCalibrator';
import {
  sanitizeLessonForNationalLearning,
  sanitizeTopicForNationalLearning,
} from '../utils/nationalLearningSanitizer';
import { SUBJECT_TUTOR_REGISTRY } from '../utils/tutorRegistry';

function finalizeSubjectCurriculum(
  subj: SubjectId,
  rawTopics: Topic[],
  rawIl: Record<string, InteractiveLesson>
): { topics: Topic[]; il: Record<string, InteractiveLesson> } {
  const calibrated = calibrateSubjectCurriculum(subj, rawTopics, rawIl);
  const topics = calibrated.topics.map(sanitizeTopicForNationalLearning);
  const il: Record<string, InteractiveLesson> = {};
  for (const [tid, lesson] of Object.entries(calibrated.il)) {
    const sanitized = sanitizeLessonForNationalLearning(lesson);
    if (sanitized) il[tid] = sanitized;
  }
  return { topics, il };
}

function buildEntry(
  id: SubjectId,
  raw: { topics: Topic[]; il: Record<string, InteractiveLesson> }
): SubjectData {
  const built = finalizeSubjectCurriculum(id, raw.topics, raw.il);
  const meta = SUBJECT_TUTOR_REGISTRY[id];
  return {
    id,
    name: meta.name,
    short: meta.short,
    topics: built.topics,
    il: built.il,
  };
}

const rawMathTopics = applyMathGenerators(MATH_TOPICS);
const rawMathIL = buildMathInteractiveLessons(rawMathTopics);
const enrichedMath = enrichMathCurriculum(rawMathTopics, rawMathIL);

export interface SubjectData {
  id: SubjectId;
  name: string;
  short: string;
  topics: Topic[];
  il: Record<string, InteractiveLesson>;
}

export const SUBJECTS: Record<SubjectId, SubjectData> = {
  // ── 25 Official JAMB UTME & WAEC/NECO Subjects ──
  eng: buildEntry('eng', buildEngCurriculum()),
  maths: buildEntry('maths', { topics: enrichedMath.topics, il: enrichedMath.il }),
  phys: buildEntry('phys', buildPhysCurriculum()),
  chem: buildEntry('chem', buildChemCurriculum()),
  bio: buildEntry('bio', buildBioCurriculum()),
  agric: buildEntry('agric', buildAgricCurriculum()),
  geog: buildEntry('geog', buildGeogCurriculum()),
  econ: buildEntry('econ', buildEconCurriculum()),
  govt: buildEntry('govt', buildGovtCurriculum()),
  lit: buildEntry('lit', buildLitCurriculum()),
  crs: buildEntry('crs', buildCrsCurriculum()),
  irs: buildEntry('irs', buildIrsCurriculum()),
  comm: buildEntry('comm', buildCommCurriculum()),
  acct: buildEntry('acct', buildAcctCurriculum()),
  hist: buildEntry('hist', buildHistCurriculum()),
  comp: buildEntry('comp', buildCompCurriculum()),
  homeec: buildEntry('homeec', buildHomeEcCurriculum()),
  phe: buildEntry('phe', buildPheCurriculum()),
  art: buildEntry('art', buildArtCurriculum()),
  music: buildEntry('music', buildMusicCurriculum()),
  french: buildEntry('french', buildFrenchCurriculum()),
  arabic: buildEntry('arabic', buildArabicCurriculum()),
  hausa: buildEntry('hausa', buildHausaCurriculum()),
  igbo: buildEntry('igbo', buildIgboCurriculum()),
  yoruba: buildEntry('yoruba', buildYorubaCurriculum()),

  // ── 24 WAEC/NECO-Only School & Trade Subjects ──
  fmaths: buildEntry('fmaths', buildFMathCurriculum()),
  civic: buildEntry('civic', buildCivicCurriculum()),
  digitech: buildEntry('digitech', buildDigiTechCurriculum()),
  dataproc: buildEntry('dataproc', buildDataProcCurriculum()),
  techdraw: buildEntry('techdraw', buildTechDrawCurriculum()),
  foodnut: buildEntry('foodnut', buildFoodNutCurriculum()),
  homemgt: buildEntry('homemgt', buildHomeMgtCurriculum()),
  animalhusb: buildEntry('animalhusb', buildAnimalHusbCurriculum()),
  fisheries: buildEntry('fisheries', buildFisheriesCurriculum()),
  marketing: buildEntry('marketing', buildMarketingCurriculum()),
  officeprac: buildEntry('officeprac', buildOfficePracCurriculum()),
  insurance: buildEntry('insurance', buildInsuranceCurriculum()),
  storemgt: buildEntry('storemgt', buildStoreMgtCurriculum()),
  bookkeep: buildEntry('bookkeep', buildBookKeepCurriculum()),
  catering: buildEntry('catering', buildCateringCurriculum()),
  garment: buildEntry('garment', buildGarmentCurriculum()),
  photo: buildEntry('photo', buildPhotoCurriculum()),
  cosmet: buildEntry('cosmet', buildCosmetCurriculum()),
  tourism: buildEntry('tourism', buildTourismCurriculum()),
  elecinst: buildEntry('elecinst', buildElecInstCurriculum()),
  automech: buildEntry('automech', buildAutoMechCurriculum()),
  carpentry: buildEntry('carpentry', buildCarpentryCurriculum()),
  blocklay: buildEntry('blocklay', buildBlockLayCurriculum()),
  gsm: buildEntry('gsm', buildGsmCurriculum()),
};

export const SUBJECT_IDS: SubjectId[] = [...ALL_SUBJECT_IDS];

export function getAllTopicsBySubj(): Record<SubjectId, Topic[]> {
  const out = {} as Record<SubjectId, Topic[]>;
  for (const sid of SUBJECT_IDS) {
    out[sid] = SUBJECTS[sid].topics;
  }
  return out;
}

export function getTopics(subj: SubjectId): Topic[] {
  return (SUBJECTS[subj] || SUBJECTS.maths).topics;
}

export function getTopicsForProgress(
  progress: Pick<
    UserProgress,
    | 'subj'
    | 'chemClass'
    | 'mathClass'
    | 'fmathClass'
    | 'physClass'
    | 'bioClass'
    | 'agricClass'
    | 'geogClass'
    | 'econClass'
    | 'engClass'
    | 'civicClass'
    | 'digitechClass'
    | 'dataprocClass'
  >
): Topic[] {
  const all = (SUBJECTS[progress.subj] || SUBJECTS.maths).topics;
  if (progress.subj === 'maths') {
    return filterMathTopicsByClass(all, progress.mathClass);
  }
  if (progress.subj === 'fmaths') {
    return filterFMathTopicsByClass(all, progress.fmathClass);
  }
  if (progress.subj === 'chem') {
    return filterChemTopicsByClass(all, progress.chemClass);
  }
  if (progress.subj === 'phys') {
    return filterPhysTopicsByClass(all, progress.physClass);
  }
  if (progress.subj === 'bio') {
    return filterBioTopicsByClass(all, progress.bioClass);
  }
  if (progress.subj === 'agric') {
    return filterAgricTopicsByClass(all, progress.agricClass);
  }
  if (progress.subj === 'geog') {
    return filterGeogTopicsByClass(all, progress.geogClass);
  }
  if (progress.subj === 'econ') {
    return filterEconTopicsByClass(all, progress.econClass);
  }
  if (progress.subj === 'eng') {
    return filterEngTopicsByClass(all, progress.engClass);
  }
  if (progress.subj === 'civic') {
    return filterCivicTopicsByClass(all, progress.civicClass);
  }
  if (progress.subj === 'digitech') {
    return filterDigiTechTopicsByClass(all, progress.digitechClass);
  }
  if (progress.subj === 'dataproc') {
    return filterDataProcTopicsByClass(all, progress.dataprocClass);
  }
  // All UTME / WAEC single-block subjects follow one complete syllabus with no SS1–SS3 tabs
  return all;
}

export function getTopic(subj: SubjectId, tid: string): Topic | undefined {
  return (SUBJECTS[subj] || SUBJECTS.maths).topics.find((t) => t.id === tid);
}

export function getInteractiveLesson(subj: SubjectId, tid: string): InteractiveLesson | undefined {
  return (SUBJECTS[subj] || SUBJECTS.maths).il[tid];
}

export function getAllQuestions(progress: UserProgress, subj: SubjectId): Question[] {
  return (SUBJECTS[subj] || SUBJECTS.maths).topics.flatMap((t) => bankForTopic(progress, t));
}

export function findQuestion(progress: UserProgress, subj: SubjectId, id: string): Question | undefined {
  for (const t of (SUBJECTS[subj] || SUBJECTS.maths).topics) {
    const q = bankForTopic(progress, t).find((x) => x.id === id);
    if (q) return q;
  }
  return undefined;
}
