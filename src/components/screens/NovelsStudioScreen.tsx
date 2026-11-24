import React from 'react';
import type { SubjectId, UserProgress } from '../../types';
import type { NovelFinalExamEvaluation, NovelShelfFilter } from '../../utils/novelsLogic';
import { SubscreenTopBar } from '../AppShell';
import { JambWaecNovelsStudio } from '../studios/JambWaecNovelsStudio';

export interface NovelsStudioScreenProps {
  progress: UserProgress;
  initialNovelId?: string;
  initialFilter?: NovelShelfFilter;
  onBack: () => void;
  onToggleChapterRead: (novelId: string, chapterNumber: number) => void;
  onRecordChapterQuiz?: (
    novelId: string,
    chapterNumber: number,
    score: number,
    total: number
  ) => void;
  onRecordQuizScore: (novelId: string, score: number, total: number) => void;
  onCompleteFinalExam?: (novelId: string, evaluation: NovelFinalExamEvaluation) => {
    newlyAwardedRp: number;
    newlyAwardedXp: number;
  };
  onUpdateNotes: (novelId: string, notes: string) => void;
  onOpenCurriculumTopic: (subj: SubjectId, topicId: string) => void;
}

export function NovelsStudioScreen({
  progress,
  initialNovelId,
  initialFilter = 'all',
  onBack,
  onToggleChapterRead,
  onRecordChapterQuiz,
  onRecordQuizScore,
  onCompleteFinalExam,
  onUpdateNotes,
  onOpenCurriculumTopic,
}: NovelsStudioScreenProps) {
  return (
    <div className="flex flex-col gap-4 pb-10">
      <SubscreenTopBar
        title="JAMB & WAEC Novels Library"
        subtitle="8 Official Prescribed Texts · Visual Memory Scenes · Studio Voice Audio · Rank Exams"
        onBack={onBack}
      />

      <JambWaecNovelsStudio
        progress={progress}
        initialNovelId={initialNovelId}
        initialFilter={initialFilter}
        onToggleChapterRead={onToggleChapterRead}
        onRecordChapterQuiz={onRecordChapterQuiz}
        onRecordQuizScore={onRecordQuizScore}
        onCompleteFinalExam={onCompleteFinalExam}
        onUpdateNotes={onUpdateNotes}
        onOpenCurriculumTopic={onOpenCurriculumTopic}
      />
    </div>
  );
}
