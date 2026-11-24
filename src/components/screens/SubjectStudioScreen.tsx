import React from 'react';
import type { SubjectId, UserProgress } from '../../types';
import { SUBJECT_INFO } from '../../utils/engine';
import { SUBJECT_STUDIO_META } from '../../utils/subjectStudioMeta';
import { SubscreenTopBar } from '../AppShell';
import { Icon } from '../Icons';
import { BibleStudio } from '../studios/BibleStudio';
import { QuranStudio } from '../studios/QuranStudio';
import { MusicAndArtStudio } from '../studios/MusicAndArtStudio';
import { AccountingAndBusinessStudio } from '../studios/AccountingAndBusinessStudio';
import { HumanitiesAndLanguageStudio } from '../studios/HumanitiesAndLanguageStudio';
import { AppliedAndTradesStudio } from '../studios/AppliedAndTradesStudio';
import { JambWaecNovelsStudio } from '../studios/JambWaecNovelsStudio';
import type { NovelFinalExamEvaluation } from '../../utils/novelsLogic';

export interface SubjectStudioScreenProps {
  subj: SubjectId;
  progress?: UserProgress;
  onToggleNovelChapterRead?: (novelId: string, chapterNumber: number) => void;
  onRecordNovelChapterQuiz?: (
    novelId: string,
    chapterNumber: number,
    score: number,
    total: number
  ) => void;
  onRecordNovelQuizScore?: (novelId: string, score: number, total: number) => void;
  onCompleteNovelFinalExam?: (novelId: string, evaluation: NovelFinalExamEvaluation) => {
    newlyAwardedRp: number;
    newlyAwardedXp: number;
  };
  onUpdateNovelNotes?: (novelId: string, notes: string) => void;
  onOpenCurriculumTopic?: (subj: SubjectId, topicId: string) => void;
  onBack: () => void;
}

export function SubjectStudioScreen({
  subj,
  progress,
  onToggleNovelChapterRead,
  onRecordNovelChapterQuiz,
  onRecordNovelQuizScore,
  onCompleteNovelFinalExam,
  onUpdateNovelNotes,
  onOpenCurriculumTopic,
  onBack,
}: SubjectStudioScreenProps) {
  const meta = SUBJECT_STUDIO_META[subj];
  const subjInfo = SUBJECT_INFO[subj];

  const renderStudio = () => {
    if (!meta) {
      return (
        <section className="rtc-card rounded-[26px] p-6">
          <h2 className="h22 text-[var(--ink)]">{subjInfo.name}</h2>
          <p className="text-[14.5px] text-[var(--dim)] mt-1">
            This subject already has its own dedicated interactive Labs and Formula Studio on the Topics screen.
          </p>
        </section>
      );
    }
    switch (meta.kind) {
      case 'novels':
        return (
          <JambWaecNovelsStudio
            progress={progress}
            initialNovelId="lekki-headmaster"
            initialFilter="all"
            onToggleChapterRead={onToggleNovelChapterRead}
            onRecordChapterQuiz={onRecordNovelChapterQuiz}
            onRecordQuizScore={onRecordNovelQuizScore}
            onCompleteFinalExam={onCompleteNovelFinalExam}
            onUpdateNotes={onUpdateNovelNotes}
            onOpenCurriculumTopic={onOpenCurriculumTopic}
          />
        );
      case 'bible':
        return <BibleStudio />;
      case 'quran':
        return <QuranStudio />;
      case 'music':
      case 'art':
        return <MusicAndArtStudio subj={subj} />;
      case 'accounting':
      case 'business':
        return <AccountingAndBusinessStudio subj={subj} />;
      case 'constitution':
      case 'literature':
      case 'history':
      case 'language':
        return (
          <HumanitiesAndLanguageStudio
            subj={subj}
            progress={progress}
            onToggleNovelChapterRead={onToggleNovelChapterRead}
            onRecordNovelChapterQuiz={onRecordNovelChapterQuiz}
            onRecordNovelQuizScore={onRecordNovelQuizScore}
            onCompleteNovelFinalExam={onCompleteNovelFinalExam}
            onUpdateNovelNotes={onUpdateNovelNotes}
            onOpenCurriculumTopic={onOpenCurriculumTopic}
          />
        );
      default:
        return <AppliedAndTradesStudio subj={subj} />;
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-10">
      <SubscreenTopBar
        title={meta?.title || `${subjInfo.name} companion`}
        subtitle={meta ? `${subjInfo.name} · ${meta.subtitle}` : subjInfo.name}
        onBack={onBack}
        right={
          meta ? (
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[12px] font-bold text-[var(--gold)]">
              <Icon name={meta.icon} size={14} />
              <span>{meta.badge}</span>
            </span>
          ) : undefined
        }
      />

      {renderStudio()}
    </div>
  );
}
