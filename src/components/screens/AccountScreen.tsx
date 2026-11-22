import React, { useState } from 'react';
import type {
  ClockFormat,
  MasteryThemeId,
  SubjectId,
  ThemeAppearanceMode,
  ThemeLockMode,
  UserProgress,
} from '../../types';
import {
  SUBJECT_INFO,
  computeTopicsProgressPct,
  mpct,
  type BadgeDef,
} from '../../utils/engine';
import type { GoalMasterySnapshot } from '../../utils/masteryThemeLogic';
import { getAllTopicsBySubj, getTopics, getTopicsForProgress, SUBJECT_IDS } from '../../data/curriculum';
import {
  JAMB_SUBJECT_IDS,
  WAEC_SCHOOL_ONLY_SUBJECT_IDS,
  WAEC_TRADE_ONLY_SUBJECT_IDS,
  isWaecOnlySubject,
} from '../../utils/examSubjects';
import { SUBJECT_TUTOR_REGISTRY } from '../../utils/tutorRegistry';
import { ElementalRankShowcase } from '../ElementalRankVisuals';
import { Icon, MiniRing } from '../Icons';
import { MasteryThemeGallery } from '../MasteryThemePicker';
import { AdminVoucherStudio } from '../PaywallModal';
import { formatPremiumRemaining } from '../../utils/paywallLogic';
import { LiquidCapsuleBar, SmoothProgressBar, SmoothViewSwitch } from '../ULessonMotion';
import { normalizeJambQuartet, resolveExamTrack } from '../../utils/examTrackLogic';
import { ActivityBars } from './HomeScreen';
import { useCloudSync } from '../../context/CloudSyncContext';
import { useEntitlement } from '../../context/EntitlementContext';
import { PWAInstallButton } from '../PWAInstallBanner';
import { useQuestionBankCounts } from '../../utils/questionBankDb';
import { BANK_TARGET_PER_SUBJECT } from '../../utils/questionBankLogic';
import type { QuestionBankTab } from '../QuestionBankManagerModal';

export function AccountScreen({
  progress,
  effectiveThemeId,
  appearanceMode = 'light',
  isPremium = false,
  isAdmin = false,
  clockFormat = '12h',
  onSelectTheme,
  onChangeAppearanceMode,
  onChangeClockFormat,
  onOpenPaywall,
  onToggleMuted,
  onOpenSubjects,
  onOpenExamSetup,
  onOpenTranscript,
  onOpenLeaderboard,
  onOpenQuestionBank,
  onRetakeDiagnostic,
  onSignOut,
  onPreviewBadgeCelebration,
}: {
  progress: UserProgress;
  effectiveThemeId?: MasteryThemeId;
  appearanceMode?: ThemeAppearanceMode;
  isPremium?: boolean;
  isAdmin?: boolean;
  themeLockMode?: ThemeLockMode;
  themeAutoProgress?: boolean;
  clockFormat?: ClockFormat;
  goalSnapshot?: GoalMasterySnapshot;
  onSelectTheme?: (id: MasteryThemeId) => void;
  onChangeAppearanceMode?: (mode: ThemeAppearanceMode) => void;
  onChangeThemeLockMode?: (mode: ThemeLockMode) => void;
  onToggleThemeAutoProgress?: (enabled: boolean) => void;
  onChangeClockFormat?: (fmt: ClockFormat) => void;
  onOpenPaywall?: (reason?: string) => void;
  onToggleMuted: () => void;
  onOpenSubjects: () => void;
  onOpenExamSetup?: () => void;
  onOpenTranscript?: () => void;
  onOpenLeaderboard?: () => void;
  onOpenQuestionBank?: (subj?: SubjectId, tab?: QuestionBankTab) => void;
  onRetakeDiagnostic: () => void;
  onSignOut?: () => void;
  onPreviewBadgeCelebration?: (badge: BadgeDef, isPreview?: boolean) => void;
}) {
  const { user, syncStatus, lastSyncedLabel, syncError, signInWithGoogle, signOutCloud, syncNow } = useCloudSync();
  const { trialDaysRemaining } = useEntitlement();
  const { totalCount: bankTotalCount } = useQuestionBankCounts();

  const allTopicsBySubj = getAllTopicsBySubj();

  const topics = getTopicsForProgress(progress);
  const totalAns = progress.hist.length;
  const rightAns = progress.hist.filter((h) => h[1] === 1).length;
  const accPct = totalAns ? Math.round((rightAns / totalAns) * 100) : 0;

  const masteryPct = computeTopicsProgressPct(progress, topics);
  const examTrack = resolveExamTrack(progress);
  const examTrackSummary =
    examTrack === 'jamb'
      ? 'JAMB Only · 4 subjects'
      : examTrack === 'waec'
        ? 'WAEC Only · Paper 1 & 2'
        : 'JAMB 70% + WAEC 30%';

  return (
    <div className="flex flex-col gap-4 anim-rise">
      {/* Settings Header & Student Summary */}
      <section className="rtc-card rounded-2xl p-4 sm:p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        <div className="flex flex-col gap-0.5">
          <span className="eyebrow text-[var(--gold)]">Appearance, themes and study preferences</span>
          <h1 className="h24 text-[var(--ink)]">Settings</h1>
          <p className="text-[13px] text-[var(--dim)]">
            Switch between Light and Dark mode, view app colour themes, and manage audio and study settings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[var(--line)]">
          <div className="flex items-center gap-2.5">
            <div
              aria-hidden="true"
              className="w-10 h-10 rounded-xl bg-[var(--gold)] text-[var(--on-acc)] font-[var(--display)] font-extrabold text-[17px] flex items-center justify-center shrink-0 shadow-[0_2px_6px_rgba(15,23,42,0.16)]"
            >
              {(progress.name || 'S').slice(0, 1).toUpperCase()}
            </div>
            <div>
              <div className="font-[var(--display)] font-bold text-[15px] text-[var(--ink)] leading-tight">
                {progress.name || 'Scholar'}
              </div>
              <div className="flex items-center gap-1.5 text-[12.5px] font-bold text-[var(--gold)] tabular-nums mt-0.5">
                <span>{masteryPct}% progress</span>
                <span aria-hidden="true" className="text-[var(--dim)]">·</span>
                <span className="text-[var(--dim)]">{accPct}% accuracy</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plan & EYAK Full Access Pass */}
      <section className="rtc-card rounded-2xl p-4 sm:p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="eyebrow text-[var(--gold)]">Study plan and access</span>
          <h2 className="h20 text-[var(--ink)]">
            {isPremium
              ? `${progress.pro?.planName || 'EYAK Premium'} · ${
                  progress.pro
                    ? formatPremiumRemaining(progress.pro.until, undefined, progress.pro.pid)
                    : 'Owner access'
                }`
              : `3-day starter trial · ${trialDaysRemaining} ${
                  trialDaysRemaining === 1 ? 'day' : 'days'
                } left`}
          </h2>
          <p className="text-[13.5px] text-[var(--dim)] leading-relaxed max-w-[60ch]">
            {isPremium
              ? 'All 49 JAMB and WAEC/NECO subjects, Live Tutor, Voice Tutor, CBT Mock Exams, Virtual Labs and all 10 colour themes are unlocked.'
              : 'Starter trial includes basic topic notes and practice for 3 days max. Subscribe from ₦1,000/month (₦4,500 / 6 months · ₦9,000 / year · ₦27,800 / lifetime) for 100% full access.'}
          </p>
        </div>

        {onOpenPaywall && (
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() =>
                onOpenPaywall(
                  isPremium
                    ? 'Extend your EYAK study pass with another Pass PIN or online checkout'
                    : 'Subscribe from ₦1,000/month for 100% full access to Tutors, CBT Mocks, Virtual Labs and Colour Themes'
                )
              }
              className="btn-tactile indigo min-h-[40px] px-4 text-[13.5px] whitespace-nowrap"
            >
              <Icon name={isPremium ? 'crown' : 'unlock'} size={16} />
              <span>{isPremium ? 'Manage or extend pass' : 'Unlock full access'}</span>
            </button>
          </div>
        )}
      </section>

      {isAdmin && <AdminVoucherStudio />}

      {/* Account Backup & Offline App */}
      <section className="grid grid-cols-1 min-[820px]:grid-cols-12 gap-3.5 items-stretch">
        <div className="min-[820px]:col-span-5 rtc-card rounded-2xl p-4 flex flex-col justify-between gap-3.5">
          <div className="flex flex-col gap-1">
            <span className="eyebrow text-[var(--gold)]">Account backup</span>
            <h2 className="h20 text-[var(--ink)]">Save across devices</h2>
            <p className="text-[13.5px] text-[var(--dim)] leading-relaxed">
              {user
                ? `Signed in as ${user.displayName || user.email || user.phoneNumber || 'student'}. Your progress, mock scores and study plan stay saved across phone and laptop.`
                : 'Sign in so your lessons, mock exam scores, mistakes to fix and study plan stay safe if you switch phones.'}
            </p>
          </div>

          {syncError && (
            <div className="rounded-xl bg-[var(--bad-soft)] border border-[var(--bad-line)] px-3.5 py-2 text-[12.5px] font-semibold text-[var(--coral-ink)]">
              {syncError}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2.5">
            {user ? (
              <>
                <button
                  type="button"
                  onClick={() => void syncNow(progress)}
                  disabled={syncStatus === 'syncing'}
                  className="btn-tactile indigo min-h-[38px] text-[13px] px-4 whitespace-nowrap"
                >
                  <Icon name="check" size={15} />
                  <span>{syncStatus === 'syncing' ? 'Saving…' : 'Save now'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => void signOutCloud()}
                  className="btn-tactile paper min-h-[38px] text-[13px] px-3.5 whitespace-nowrap"
                >
                  Sign out
                </button>
                {lastSyncedLabel && (
                  <span className="text-[12px] font-semibold text-[var(--green)] mono tabular-nums">
                    Saved {lastSyncedLabel}
                  </span>
                )}
              </>
            ) : (
              <button
                type="button"
                onClick={() => void signInWithGoogle()}
                className="btn-tactile indigo w-full sm:w-auto min-h-[38px] text-[13px] px-5 whitespace-nowrap"
              >
                <Icon name="shield" size={15} />
                <span>Sign in with Google</span>
              </button>
            )}
          </div>
        </div>

        <div className="min-[820px]:col-span-7 rtc-card rounded-2xl p-4 flex flex-col justify-between gap-3.5">
          <div className="flex flex-col gap-1">
            <span className="eyebrow text-[var(--gold)]">Offline study and reports</span>
            <h2 className="h20 text-[var(--ink)]">App and report card</h2>
            <p className="text-[13.5px] text-[var(--dim)] leading-relaxed">
              Add EYAK to your home screen to study without mobile data, or print your report card.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <PWAInstallButton className="w-full min-h-[38px] text-[13px] px-3.5 justify-center" />
            {onOpenQuestionBank && (
              <button
                type="button"
                onClick={() => onOpenQuestionBank(progress.subj, 'overview')}
                className="btn-tactile paper w-full min-h-[38px] text-[13px] px-3.5 justify-center whitespace-nowrap"
              >
                <Icon name="database" size={15} className="text-[var(--gold)] shrink-0" />
                <span className="tabular-nums">Question bank ({bankTotalCount.toLocaleString()})</span>
              </button>
            )}
            {onOpenLeaderboard && (
              <button
                type="button"
                onClick={onOpenLeaderboard}
                className="btn-tactile paper w-full min-h-[38px] text-[13px] px-3.5 justify-center whitespace-nowrap"
              >
                <Icon name="crown" size={15} className="text-[var(--gold)] shrink-0" />
                <span>Leaderboard</span>
              </button>
            )}
            {onOpenTranscript && (
              <button
                type="button"
                onClick={onOpenTranscript}
                className="btn-tactile paper w-full min-h-[38px] text-[13px] px-3.5 justify-center whitespace-nowrap"
              >
                <Icon name="award" size={15} className="shrink-0" />
                <span>Report card</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Appearance (Light / Dark for all students) & Colour Themes (9 extra colours locked until subscribed) */}
      {effectiveThemeId && onSelectTheme && onChangeAppearanceMode && (
        <section className="rtc-card rounded-2xl p-4 sm:p-4.5 flex flex-col gap-3.5">
          <div className="flex flex-col gap-0.5">
            <span className="eyebrow text-[var(--gold)]">Appearance and themes</span>
            <h2 className="h20 text-[var(--ink)]">Display mode and colour themes</h2>
            <p className="text-[13px] text-[var(--dim)]">
              Switch between Light and Dark mode anytime. Extra colour themes unlock with any EYAK pass from ₦1,000/month.
            </p>
          </div>
          <MasteryThemeGallery
            effectiveThemeId={effectiveThemeId}
            appearanceMode={appearanceMode}
            isPremium={isPremium}
            onSelectTheme={onSelectTheme}
            onChangeAppearanceMode={onChangeAppearanceMode}
            onRequestUnlockPremium={onOpenPaywall}
          />
        </section>
      )}

      {/* Study & Audio Preferences */}
      <section className="rtc-card rounded-2xl p-4 sm:p-4.5 flex flex-col gap-3.5">
        <div className="flex flex-col gap-0.5">
          <span className="eyebrow text-[var(--gold)]">Preferences</span>
          <h2 className="h20 text-[var(--ink)]">Sound and study settings</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onToggleMuted}
            aria-pressed={!progress.muted}
            className="btn-tactile paper justify-between whitespace-nowrap"
          >
            <span className="flex items-center gap-2.5 min-w-0">
              <Icon name={progress.muted ? 'mute' : 'vol'} size={18} className="shrink-0" />
              <span className="truncate">Sound and voice: {progress.muted ? 'Off' : 'On'}</span>
            </span>
            <span className="text-[12px] font-bold text-[var(--gold)] shrink-0">
              {progress.muted ? 'Turn on' : 'Mute'}
            </span>
          </button>

          {onOpenExamSetup && (
            <button
              type="button"
              onClick={onOpenExamSetup}
              className="btn-tactile paper justify-between whitespace-nowrap"
            >
              <span className="flex items-center gap-2.5 min-w-0">
                <Icon name="mic" size={18} className="text-[var(--gold)] shrink-0" />
                <span className="truncate">Exam track &amp; voice teachers ({examTrackSummary})</span>
              </span>
              <Icon name="go" size={17} className="shrink-0" />
            </button>
          )}

          <button type="button" onClick={onOpenSubjects} className="btn-tactile paper justify-between whitespace-nowrap">
            <span className="flex items-center gap-2.5 min-w-0">
              <Icon name="books" size={18} className="shrink-0" />
              <span className="truncate">Subjects and target ({progress.subjs.length} · {progress.target}%)</span>
            </span>
            <Icon name="go" size={17} className="shrink-0" />
          </button>

          <button type="button" onClick={onRetakeDiagnostic} className="btn-tactile paper justify-between whitespace-nowrap">
            <span className="flex items-center gap-2.5 min-w-0">
              <Icon name="target" size={18} className="shrink-0" />
              <span className="truncate">Retake {SUBJECT_INFO[progress.subj].short} placement check</span>
            </span>
            <Icon name="go" size={17} className="shrink-0" />
          </button>

          {onSignOut && (
            <button type="button" onClick={onSignOut} className="btn-tactile paper justify-between whitespace-nowrap">
              <span className="flex items-center gap-2.5 min-w-0">
                <Icon name="logout" size={18} className="shrink-0" />
                <span className="truncate">Sign out</span>
              </span>
              <Icon name="go" size={17} className="shrink-0" />
            </button>
          )}
        </div>
      </section>

      {/* Syllabus Mastery + Quick Stats */}
      <div className="grid grid-cols-1 min-[780px]:grid-cols-12 gap-3.5">
        <section className="min-[780px]:col-span-6 rtc-card rounded-2xl p-4 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <h2 className="h18 text-[var(--ink)]">Syllabus Progress</h2>
            <span className="text-[12.5px] font-bold text-[var(--gold)] tabular-nums">
              {masteryPct}% of {SUBJECT_INFO[progress.subj].short}
            </span>
          </div>
          <svg
            className="w-full h-2.5 rounded-full overflow-hidden"
            viewBox="0 0 100 6"
            preserveAspectRatio="none"
            role="progressbar"
            aria-valuenow={masteryPct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Syllabus mastery progress"
          >
            <rect x="0" y="0" width="100" height="6" fill="var(--deep)" rx="3" />
            <rect x="0" y="0" width={masteryPct} height="6" fill="var(--gold)" rx="3" />
          </svg>
          <div className="grid grid-cols-3 gap-2 pt-1.5">
            <div className="rounded-xl bg-[var(--bg)] p-2.5 text-center">
              <div className="text-[11px] font-semibold text-[var(--dim)]">Answered</div>
              <div className="font-[var(--display)] font-extrabold text-[17px] text-[var(--ink)] tabular-nums">
                {totalAns}
              </div>
            </div>
            <div className="rounded-xl bg-[var(--bg)] p-2.5 text-center">
              <div className="text-[11px] font-semibold text-[var(--dim)]">Accuracy</div>
              <div className="font-[var(--display)] font-extrabold text-[17px] text-[var(--green)] tabular-nums">
                {accPct}%
              </div>
            </div>
            <div className="rounded-xl bg-[var(--bg)] p-2.5 text-center">
              <div className="text-[11px] font-semibold text-[var(--dim)]">Progress</div>
              <div className="font-[var(--display)] font-extrabold text-[17px] text-[var(--gold)] tabular-nums">
                {masteryPct}%
              </div>
            </div>
          </div>
        </section>

        <section className="min-[780px]:col-span-6 rtc-card rounded-2xl p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="h18 text-[var(--ink)]">7-Day Activity</h2>
            <span className="text-[12px] font-bold text-[var(--coral-ink)] flex items-center gap-1 tabular-nums">
              <Icon name="flame" size={14} />
              {progress.streak.n} day streak
            </span>
          </div>
          <ActivityBars act={progress.act} />
        </section>
      </div>

      {/* 8 Hard-Earned Elemental Rank Emblems (Image-First, Zero Wordy Text) */}
      <ElementalRankShowcase
        progress={progress}
        allTopicsBySubj={allTopicsBySubj}
        onOpenLeaderboard={onOpenLeaderboard}
        onPreviewBadgeCelebration={onPreviewBadgeCelebration}
      />
    </div>
  );
}

type SubjectCatalogFilter = 'all' | 'jamb' | 'waec-school' | 'waec-trade' | 'mine';

export function SubjectsScreen({
  progress,
  dueCount = 0,
  onSelectSubject,
  onToggleSubject,
  onUpdateTarget,
  onOpenExamSetup,
  onOpenReview,
  onOpenQuestionBank,
}: {
  progress: UserProgress;
  dueCount?: number;
  onSelectSubject?: (sid: SubjectId) => void;
  onToggleSubject: (sid: SubjectId) => void;
  onUpdateTarget: (t: number) => void;
  onOpenExamSetup?: () => void;
  onOpenReview?: () => void;
  onOpenQuestionBank?: (subj?: SubjectId, tab?: QuestionBankTab) => void;
  onBack?: () => void;
}) {
  const { counts: bankCounts, totalCount: bankTotalCount } = useQuestionBankCounts();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<SubjectCatalogFilter>('all');

  const examTrack = resolveExamTrack(progress);
  const jambQuartet = normalizeJambQuartet(
    progress.jambSubjects && progress.jambSubjects.length > 0
      ? progress.jambSubjects
      : progress.subjs
  );
  const activeFilter: SubjectCatalogFilter =
    examTrack === 'jamb' && (filter === 'waec-school' || filter === 'waec-trade' || filter === 'jamb')
      ? 'all'
      : filter;

  const normQuery = search.trim().toLowerCase();
  const matchesFilter = (sid: SubjectId) => {
    if (activeFilter === 'mine') {
      if (examTrack === 'jamb') {
        if (!jambQuartet.includes(sid)) return false;
      } else if (!progress.subjs.includes(sid)) {
        return false;
      }
    }
    if (!normQuery) return true;
    const meta = SUBJECT_TUTOR_REGISTRY[sid];
    const hay = `${meta.name} ${meta.short} ${meta.tutorName} ${meta.toolsSummary}`.toLowerCase();
    return hay.includes(normQuery);
  };

  const groups: { id: string; title: string; subtitle: string; ids: SubjectId[] }[] = (
    examTrack === 'jamb'
      ? [
          {
            id: 'jamb',
            title: 'Official JAMB UTME Subjects',
            subtitle:
              'English Language (compulsory) plus 3 JAMB electives — WAEC-only school and trade subjects are hidden in JAMB mode.',
            ids: [...JAMB_SUBJECT_IDS].filter(matchesFilter),
          },
        ]
      : [
          {
            id: 'jamb',
            title: examTrack === 'both' ? 'JAMB & WAEC Core Subjects (70% UTME Focus)' : 'JAMB and WAEC',
            subtitle:
              examTrack === 'both'
                ? 'Your 4 primary JAMB subjects receive 70% of daily study focus alongside WAEC theory & marking guides.'
                : 'All 25 official JAMB and WAEC shared subjects.',
            ids: (activeFilter === 'all' || activeFilter === 'jamb' || activeFilter === 'mine'
              ? [...JAMB_SUBJECT_IDS]
              : []
            ).filter(matchesFilter),
          },
          {
            id: 'waec-school',
            title: 'School subjects (WAEC/NECO only)',
            subtitle: 'Academic, technical and commercial school subjects — graded A1 to F9.',
            ids: (activeFilter === 'all' || activeFilter === 'waec-school' || activeFilter === 'mine'
              ? [...WAEC_SCHOOL_ONLY_SUBJECT_IDS]
              : []
            ).filter(matchesFilter),
          },
          {
            id: 'waec-trade',
            title: 'Trade subjects (WAEC/NECO only)',
            subtitle: 'Practical vocational and entrepreneurship subjects — Paper 1, 2 & Practical.',
            ids: (activeFilter === 'all' || activeFilter === 'waec-trade' || activeFilter === 'mine'
              ? [...WAEC_TRADE_ONLY_SUBJECT_IDS]
              : []
            ).filter(matchesFilter),
          },
        ]
  ).filter((g) => g.ids.length > 0);

  const totalVisible = groups.reduce((s, g) => s + g.ids.length, 0);

  const filterTabs: { id: SubjectCatalogFilter; label: string }[] =
    examTrack === 'jamb'
      ? [
          { id: 'mine', label: `My 4 JAMB (${jambQuartet.length})` },
          { id: 'all', label: `All JAMB (${JAMB_SUBJECT_IDS.length})` },
        ]
      : [
          { id: 'all', label: `All (${SUBJECT_IDS.length})` },
          { id: 'jamb', label: `JAMB and WAEC (${JAMB_SUBJECT_IDS.length})` },
          { id: 'waec-school', label: `School WAEC/NECO (${WAEC_SCHOOL_ONLY_SUBJECT_IDS.length})` },
          { id: 'waec-trade', label: `Trades (${WAEC_TRADE_ONLY_SUBJECT_IDS.length})` },
          { id: 'mine', label: `My subjects (${progress.subjs.length})` },
        ];

  return (
    <div className="flex flex-col gap-4 anim-rise">
      {/* Subjects Header */}
      <section className="rtc-card rounded-2xl p-4 sm:p-4.5 flex flex-col gap-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
          <div className="flex flex-col gap-0.5">
            <span className="eyebrow text-[var(--gold)]">
              {examTrack === 'jamb'
                ? 'JAMB UTME Track · 4 Subjects Only'
                : examTrack === 'both'
                  ? 'Combined Track · 70% JAMB / 30% WAEC'
                  : 'WAEC / NECO Track · Complete Syllabus'}
            </span>
            <h1 className="h24 text-[var(--ink)]">
              {examTrack === 'jamb' ? 'Your JAMB Subjects' : 'Subjects'}
            </h1>
            <p className="text-[13px] text-[var(--dim)]">
              {examTrack === 'jamb'
                ? `Showing strictly JAMB UTME subjects (${jambQuartet.map((s) => SUBJECT_INFO[s].short).join(' · ')} active).`
                : examTrack === 'both'
                  ? `Focusing 70% on your 4 JAMB subjects (${jambQuartet.map((s) => SUBJECT_INFO[s].short).join(', ')}) and 30% on your WAEC subjects.`
                  : `All ${SUBJECT_IDS.length} WAEC/NECO subjects with Paper 1, Paper 2 theory guides and common candidate mistakes (${progress.subjs.length} active).`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {onOpenExamSetup && (
              <button
                type="button"
                onClick={onOpenExamSetup}
                className="btn-tactile paper shrink-0 whitespace-nowrap"
              >
                <Icon name="mic" size={16} className="text-[var(--gold)]" />
                <span>Exam track &amp; teachers</span>
              </button>
            )}
            {onOpenQuestionBank && (
              <button
                type="button"
                onClick={() => onOpenQuestionBank(progress.subj, 'overview')}
                className="btn-tactile indigo shrink-0 whitespace-nowrap"
              >
                <Icon name="database" size={16} />
                <span>
                  Question bank ({bankTotalCount.toLocaleString()})
                </span>
              </button>
            )}
            {onOpenReview && (
              <button
                type="button"
                onClick={onOpenReview}
                className="btn-tactile paper shrink-0 whitespace-nowrap"
              >
                <Icon name="rev" size={17} className={dueCount > 0 ? 'text-[var(--coral-ink)]' : 'text-[var(--green)]'} />
                <span>
                  {dueCount > 0 ? `Revision (${dueCount} due)` : 'Revision'}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Search & Group Filter Bar */}
        <div className="flex flex-col gap-3 pt-3 border-t border-[var(--line)]">
          <div className="flex flex-col min-[1140px]:flex-row min-[1140px]:items-center justify-between gap-3">
            <LiquidCapsuleBar
              roleType="tablist"
              size="sm"
              ariaLabel="Filter subjects by exam board"
              items={filterTabs}
              value={activeFilter}
              onChange={setFilter}
            />

            <div className="relative w-full min-[1140px]:w-[270px] shrink-0">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search subjects"
                placeholder={
                  examTrack === 'jamb'
                    ? 'Search 25 JAMB subjects...'
                    : 'Search Government, Yoruba, GSM...'
                }
                className="w-full min-h-[40px] pl-3.5 pr-9 rounded-[16px] bg-[var(--bg)] border-2 border-[var(--line)] focus:border-[var(--gold)] focus:bg-[var(--card)] text-[14px] font-medium text-[var(--ink)] outline-none transition"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  aria-label="Clear subject search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md text-[var(--dim)] hover:text-[var(--ink)] flex items-center justify-center cursor-pointer"
                >
                  <Icon name="x" size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Grouped Subject Catalog */}
      <SmoothViewSwitch viewKey={`${examTrack}-${activeFilter}`}>
        <div className="flex flex-col gap-4">
          {totalVisible === 0 ? (
            <section className="rtc-card rounded-[22px] p-8 text-center flex flex-col items-center gap-3">
              <div className="font-[var(--display)] font-bold text-[18px] text-[var(--ink)]">
                No subject matches “{search}”
              </div>
              <p className="text-[14px] text-[var(--dim)] max-w-[420px]">
                Try another spelling or reset the filter to browse your syllabus subjects.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setFilter('all');
                }}
                className="btn-tactile paper min-h-[38px] px-4 text-[13px] whitespace-nowrap"
              >
                Show all subjects
              </button>
            </section>
          ) : (
            groups.map((group) => (
              <section key={group.id} aria-label={group.title} className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 px-1">
                  <div>
                    <h2 className="h20 text-[var(--ink)]">
                      {group.title}{' '}
                      <span className="text-[14px] font-semibold text-[var(--dim)] tabular-nums">
                        ({group.ids.length})
                      </span>
                    </h2>
                    <p className="text-[13px] text-[var(--dim)]">{group.subtitle}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 min-[740px]:grid-cols-2 gap-3">
                  {group.ids.map((sid) => {
                    const enrolled =
                      examTrack === 'jamb' ? jambQuartet.includes(sid) : progress.subjs.includes(sid);
                    const isJambCore = jambQuartet.includes(sid);
                    const isCurrent = progress.subj === sid;
                    const waecOnly = isWaecOnlySubject(sid);
                    const subjTopics = getTopics(sid);
                    const avgMastery = subjTopics.length
                      ? Math.round(
                          subjTopics.reduce((s, t) => s + mpct(progress, t.id), 0) / subjTopics.length
                        )
                      : 0;
                    const meta = SUBJECT_TUTOR_REGISTRY[sid];
                    const offlineQs = bankCounts[sid] || 0;
                    const isLockedCompulsoryEng = examTrack === 'jamb' && sid === 'eng';

                    return (
                      <article
                        key={sid}
                        className={`rounded-2xl p-3.5 sm:p-4 border flex flex-col justify-between gap-2.5 transition ${
                          isCurrent
                            ? 'rtc-card bg-[var(--acc-soft)]/45 border-[var(--gold)]'
                            : enrolled
                              ? 'rtc-card hover:border-[var(--acc-line)]'
                              : 'bg-[var(--card)]/90 border-[var(--line)] hover:border-[var(--acc-line)]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2.5">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-9 h-9 rounded-xl bg-[var(--bg)] border border-[var(--line)] flex items-center justify-center text-[var(--gold)] shrink-0">
                              <Icon name={SUBJECT_INFO[sid].icon} size={18} />
                            </span>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <div className="font-[var(--display)] font-bold text-[15px] text-[var(--ink)] truncate">
                                  {SUBJECT_INFO[sid].name}
                                </div>
                              </div>
                              <div className="text-[11.5px] text-[var(--dim)] flex items-center gap-1.5 flex-wrap tabular-nums">
                                <span>{subjTopics.length} topics</span>
                                <span aria-hidden="true">·</span>
                                <span>{avgMastery}% progress</span>
                                <span aria-hidden="true">·</span>
                                <span>{meta.tutorName}</span>
                                {examTrack === 'both' && enrolled && (
                                  <>
                                    <span aria-hidden="true">·</span>
                                    <span className="font-bold text-[var(--gold)]">
                                      {isJambCore ? '70% JAMB core' : '30% WAEC'}
                                    </span>
                                  </>
                                )}
                                {waecOnly && examTrack !== 'jamb' && (
                                  <>
                                    <span aria-hidden="true">·</span>
                                    <span className="font-bold text-[var(--gold)]">WAEC/NECO only</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <MiniRing value={avgMastery} size={38} />
                        </div>

                        <div className="text-[12px] text-[var(--dim)] leading-snug">{meta.toolsSummary}</div>

                        {offlineQs > 0 && (
                          <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] px-3 py-1.5 flex flex-col gap-1">
                            <div className="flex items-center justify-between gap-2 text-[11.5px]">
                              <span className="font-bold text-[var(--ink)] inline-flex items-center gap-1.5 tabular-nums">
                                <Icon name="database" size={12} className="text-[var(--gold)]" />
                                <span>{offlineQs.toLocaleString()} saved questions</span>
                              </span>
                              {onOpenQuestionBank && (
                                <button
                                  type="button"
                                  onClick={() => onOpenQuestionBank(sid, 'browse')}
                                  className="text-[11px] font-bold text-[var(--gold)] hover:underline cursor-pointer whitespace-nowrap"
                                >
                                  Browse →
                                </button>
                              )}
                            </div>
                            <SmoothProgressBar
                              value={offlineQs}
                              max={BANK_TARGET_PER_SUBJECT}
                              tone={offlineQs >= BANK_TARGET_PER_SUBJECT ? 'emerald' : 'indigo'}
                            />
                          </div>
                        )}

                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-[var(--line)]">
                          <button
                            type="button"
                            onClick={() => {
                              if (!enrolled) onToggleSubject(sid);
                              onSelectSubject?.(sid);
                            }}
                            className={`min-h-[34px] px-3 rounded-xl text-[12.5px] font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition ${
                              isCurrent
                                ? 'bg-[var(--gold)] text-[var(--on-acc)]'
                                : 'bg-[var(--bg)] text-[var(--ink)] border border-[var(--line)] hover:border-[var(--gold)]'
                            }`}
                          >
                            <span>{isCurrent ? 'Studying now' : 'Open subject'}</span>
                            <Icon name="go" size={13} />
                          </button>

                          <button
                            type="button"
                            onClick={() => onToggleSubject(sid)}
                            aria-pressed={enrolled}
                            disabled={
                              isLockedCompulsoryEng || (enrolled && progress.subjs.length <= 1)
                            }
                            className="min-h-[34px] px-2.5 rounded-xl text-[12px] font-bold text-[var(--dim)] hover:text-[var(--ink)] disabled:opacity-55 flex items-center gap-1 cursor-pointer whitespace-nowrap"
                          >
                            <Icon
                              name={enrolled ? 'check' : 'plus'}
                              size={13}
                              className={enrolled ? 'text-[var(--gold)]' : ''}
                            />
                            <span>
                              {isLockedCompulsoryEng
                                ? 'Compulsory'
                                : examTrack === 'jamb'
                                  ? enrolled
                                    ? 'In 4 JAMB'
                                    : 'Swap into 4'
                                  : enrolled
                                    ? 'In my bar'
                                    : 'Add to bar'}
                            </span>
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))
          )}
        </div>
      </SmoothViewSwitch>

      {/* Target Score Slider */}
      <section className="rtc-card rounded-2xl p-4 flex flex-col gap-2.5">
        <div className="flex items-baseline justify-between">
          <label htmlFor="subjs-target" className="h18 text-[var(--ink)]">
            Target score
          </label>
          <output htmlFor="subjs-target" className="font-[var(--display)] font-bold text-[22px] text-[var(--gold)] tabular-nums">
            {progress.target}%
          </output>
        </div>
        <input
          id="subjs-target"
          type="range"
          min={50}
          max={95}
          step={5}
          value={progress.target}
          onChange={(e) => onUpdateTarget(Number(e.target.value))}
          className="w-full accent-[var(--gold)] cursor-pointer"
        />
      </section>
    </div>
  );
}
