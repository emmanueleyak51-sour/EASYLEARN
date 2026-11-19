import type { SubjectId, Topic, UserProgress } from '../types';
import { mastery, tstate } from './engine';

export type ExamTargetType = 'jamb' | 'waec';

export interface StudyPlanConfig {
  examType: ExamTargetType;
  examDateIso: string; // YYYY-MM-DD in WAT
  dailyMinutes: number;
  focusSubjects: SubjectId[];
}

export interface ScheduledStudyTask {
  dayOffset: number;
  dateLabel: string;
  subj: SubjectId;
  topicId: string;
  topicName: string;
  stage: 'lesson' | 'practice' | 'boss';
  estMinutes: number;
}

export interface StudyPlanSnapshot {
  daysRemaining: number;
  totalTopics: number;
  masteredTopics: number;
  remainingTopics: number;
  coveragePct: number;
  requiredTopicsPerDay: number;
  paceStatus: 'ahead' | 'on_track' | 'stretch' | 'exam_day';
  paceHeadline: string;
  weeklyRoadmap: ScheduledStudyTask[];
}

export function defaultExamDateIso(now = new Date()): string {
  const d = new Date(now.getTime() + 45 * 86400000);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function getDefaultStudyPlan(subjs: SubjectId[], now = new Date()): StudyPlanConfig {
  const base: SubjectId[] = ['eng'];
  for (const s of ['maths', 'chem', 'phys', ...subjs] as SubjectId[]) {
    if (!base.includes(s) && base.length < 4) base.push(s);
  }
  return {
    examType: 'jamb',
    examDateIso: defaultExamDateIso(now),
    dailyMinutes: 45,
    focusSubjects: base.slice(0, 4),
  };
}

export function computeDaysRemainingWat(examDateIso: string, now = new Date()): number {
  const watNow = new Date(now.getTime() + 3600000);
  const todayUtc = Date.UTC(watNow.getUTCFullYear(), watNow.getUTCMonth(), watNow.getUTCDate());
  const parts = examDateIso.split('-').map(Number);
  if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return 30;
  const targetUtc = Date.UTC(parts[0], parts[1] - 1, parts[2]);
  return Math.max(0, Math.round((targetUtc - todayUtc) / 86400000));
}

export function buildAdaptiveStudyPlan(
  config: StudyPlanConfig,
  progress: UserProgress,
  topicsBySubj: Record<SubjectId, Topic[]>,
  now = new Date()
): StudyPlanSnapshot {
  const focus = config.focusSubjects.length ? config.focusSubjects : (['eng', 'maths', 'chem', 'phys'] as SubjectId[]);
  const daysRemaining = computeDaysRemainingWat(config.examDateIso, now);

  let totalTopics = 0;
  let masteredTopics = 0;
  const backlog: { subj: SubjectId; topic: Topic; stage: 'lesson' | 'practice' | 'boss'; score: number }[] = [];

  for (const sid of focus) {
    const list = topicsBySubj[sid] || [];
    totalTopics += list.length;
    for (const topic of list) {
      const st = tstate(progress, topic.id);
      if (st.boss) {
        masteredTopics++;
      } else {
        const stage: 'lesson' | 'practice' | 'boss' = !st.lesson
          ? 'lesson'
          : !st.practice
            ? 'practice'
            : 'boss';
        backlog.push({ subj: sid, topic, stage, score: mastery(progress, topic.id) });
      }
    }
  }

  // Round-robin interleave across focus subjects, weakest topics first
  const perSubj = new Map<SubjectId, typeof backlog>();
  for (const sid of focus) {
    perSubj.set(
      sid,
      backlog
        .filter((b) => b.subj === sid)
        .sort((a, b) => a.score - b.score)
    );
  }
  const interleaved: typeof backlog = [];
  let added = true;
  while (added) {
    added = false;
    for (const sid of focus) {
      const q = perSubj.get(sid);
      if (q && q.length > 0) {
        interleaved.push(q.shift()!);
        added = true;
      }
    }
  }

  const remainingTopics = Math.max(0, totalTopics - masteredTopics);
  const coveragePct = totalTopics > 0 ? Math.round((masteredTopics / totalTopics) * 100) : 0;
  const effectiveDays = Math.max(1, daysRemaining);
  const requiredTopicsPerDay = Number((remainingTopics / effectiveDays).toFixed(1));
  const capacityPerDay = Math.max(1, Math.min(4, Math.floor(config.dailyMinutes / 18)));

  let paceStatus: StudyPlanSnapshot['paceStatus'] = 'on_track';
  let paceHeadline = '';
  if (daysRemaining === 0) {
    paceStatus = 'exam_day';
    paceHeadline = 'Exam day has arrived — focus on light formula recall and calm rest.';
  } else if (remainingTopics === 0) {
    paceStatus = 'ahead';
    paceHeadline = '100% syllabus coverage achieved — switch to timed CBT mocks and Mistake Vault drills.';
  } else if (requiredTopicsPerDay <= capacityPerDay * 0.75) {
    paceStatus = 'ahead';
    paceHeadline = `${daysRemaining} days to ${config.examType.toUpperCase()} — ${Math.max(1, Math.ceil(requiredTopicsPerDay))} topic/day keeps you comfortably ahead of schedule.`;
  } else if (requiredTopicsPerDay <= capacityPerDay * 1.25) {
    paceStatus = 'on_track';
    paceHeadline = `${daysRemaining} days to ${config.examType.toUpperCase()} — ${requiredTopicsPerDay} topics/day hits full syllabus coverage before exam day.`;
  } else {
    paceStatus = 'stretch';
    paceHeadline = `${daysRemaining} days left — prioritize high-yield weak topics (${Math.ceil(requiredTopicsPerDay)} topics/day or raise daily minutes).`;
  }

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const tasksPerDay = Math.max(1, Math.min(3, Math.max(capacityPerDay, Math.ceil(requiredTopicsPerDay))));
  const weeklyRoadmap: ScheduledStudyTask[] = [];
  let cursor = 0;

  for (let offset = 0; offset < 7 && cursor < interleaved.length; offset++) {
    const d = new Date(now.getTime() + offset * 86400000);
    const label =
      offset === 0
        ? 'Today'
        : offset === 1
          ? 'Tomorrow'
          : `${dayNames[d.getDay()]} · ${d.getDate()} ${monthNames[d.getMonth()]}`;

    for (let slot = 0; slot < tasksPerDay && cursor < interleaved.length; slot++) {
      const item = interleaved[cursor++];
      weeklyRoadmap.push({
        dayOffset: offset,
        dateLabel: label,
        subj: item.subj,
        topicId: item.topic.id,
        topicName: item.topic.name,
        stage: item.stage,
        estMinutes: item.stage === 'lesson' ? 12 : item.stage === 'practice' ? 10 : 8,
      });
    }
  }

  return {
    daysRemaining,
    totalTopics,
    masteredTopics,
    remainingTopics,
    coveragePct,
    requiredTopicsPerDay,
    paceStatus,
    paceHeadline,
    weeklyRoadmap,
  };
}
