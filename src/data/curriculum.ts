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
import { bankForTopic } from '../utils/engine';
import { calibrateSubjectCurriculum } from '../utils/jambDistractorCalibrator';
import {
  sanitizeLessonForNationalLearning,
  sanitizeTopicForNationalLearning,
} from '../utils/nationalLearningSanitizer';

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

const rawMathTopics = applyMathGenerators(MATH_TOPICS);
const rawMathIL = buildMathInteractiveLessons(rawMathTopics);
const enrichedMath = enrichMathCurriculum(rawMathTopics, rawMathIL);
const builtMath = finalizeSubjectCurriculum('maths', enrichedMath.topics, enrichedMath.il);

const rawChem = buildChemCurriculum();
const builtChem = finalizeSubjectCurriculum('chem', rawChem.topics, rawChem.il);

const rawPhys = buildPhysCurriculum();
const builtPhys = finalizeSubjectCurriculum('phys', rawPhys.topics, rawPhys.il);

const rawBio = buildBioCurriculum();
const builtBio = finalizeSubjectCurriculum('bio', rawBio.topics, rawBio.il);

const rawAgric = buildAgricCurriculum();
const builtAgric = finalizeSubjectCurriculum('agric', rawAgric.topics, rawAgric.il);

const rawEcon = buildEconCurriculum();
const builtEcon = finalizeSubjectCurriculum('econ', rawEcon.topics, rawEcon.il);

const rawEng = buildEngCurriculum();
const builtEng = finalizeSubjectCurriculum('eng', rawEng.topics, rawEng.il);

const rawCivic = buildCivicCurriculum();
const builtCivic = finalizeSubjectCurriculum('civic', rawCivic.topics, rawCivic.il);

const rawFMath = buildFMathCurriculum();
const builtFMath = finalizeSubjectCurriculum('fmaths', rawFMath.topics, rawFMath.il);

const rawGeog = buildGeogCurriculum();
const builtGeog = finalizeSubjectCurriculum('geog', rawGeog.topics, rawGeog.il);

const rawDigiTech = buildDigiTechCurriculum();
const builtDigiTech = finalizeSubjectCurriculum('digitech', rawDigiTech.topics, rawDigiTech.il);

const rawDataProc = buildDataProcCurriculum();
const builtDataProc = finalizeSubjectCurriculum('dataproc', rawDataProc.topics, rawDataProc.il);

export interface SubjectData {
  id: SubjectId;
  name: string;
  short: string;
  topics: Topic[];
  il: Record<string, InteractiveLesson>;
}

export const SUBJECTS: Record<SubjectId, SubjectData> = {
  maths: {
    id: 'maths',
    name: 'Mathematics',
    short: 'Maths',
    topics: builtMath.topics,
    il: builtMath.il,
  },
  fmaths: {
    id: 'fmaths',
    name: 'Further Mathematics',
    short: 'F.Maths',
    topics: builtFMath.topics,
    il: builtFMath.il,
  },
  chem: {
    id: 'chem',
    name: 'Chemistry',
    short: 'Chemistry',
    topics: builtChem.topics,
    il: builtChem.il,
  },
  phys: {
    id: 'phys',
    name: 'Physics',
    short: 'Physics',
    topics: builtPhys.topics,
    il: builtPhys.il,
  },
  bio: {
    id: 'bio',
    name: 'Biology',
    short: 'Biology',
    topics: builtBio.topics,
    il: builtBio.il,
  },
  agric: {
    id: 'agric',
    name: 'Agricultural Science',
    short: 'Agric',
    topics: builtAgric.topics,
    il: builtAgric.il,
  },
  geog: {
    id: 'geog',
    name: 'Geography',
    short: 'Geog',
    topics: builtGeog.topics,
    il: builtGeog.il,
  },
  econ: {
    id: 'econ',
    name: 'Economics',
    short: 'Economics',
    topics: builtEcon.topics,
    il: builtEcon.il,
  },
  eng: {
    id: 'eng',
    name: 'English Language',
    short: 'English',
    topics: builtEng.topics,
    il: builtEng.il,
  },
  civic: {
    id: 'civic',
    name: 'Civic Education',
    short: 'Civic',
    topics: builtCivic.topics,
    il: builtCivic.il,
  },
  digitech: {
    id: 'digitech',
    name: 'Digital Technologies',
    short: 'DigiTech',
    topics: builtDigiTech.topics,
    il: builtDigiTech.il,
  },
  dataproc: {
    id: 'dataproc',
    name: 'Data Processing',
    short: 'DataProc',
    topics: builtDataProc.topics,
    il: builtDataProc.il,
  },
};

export const SUBJECT_IDS: SubjectId[] = [
  'maths',
  'fmaths',
  'chem',
  'phys',
  'bio',
  'agric',
  'geog',
  'econ',
  'eng',
  'civic',
  'digitech',
  'dataproc',
];

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
  return filterMathTopicsByClass(all, progress.mathClass);
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
