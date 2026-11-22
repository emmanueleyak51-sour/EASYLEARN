import React from 'react';
import type { SubjectId } from '../../types';
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

export interface SubjectStudioScreenProps {
  subj: SubjectId;
  onBack: () => void;
}

export function SubjectStudioScreen({ subj, onBack }: SubjectStudioScreenProps) {
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
        return <HumanitiesAndLanguageStudio subj={subj} />;
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
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--acc-soft)] border border-[var(--acc-line)] text-[12px] font-bold text-[var(--gold)]">
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
