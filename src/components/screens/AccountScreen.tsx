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
  BADGES,
  SUBJECT_INFO,
  mpct,
  tstate,
  type BadgeDef,
  type BadgeTier,
} from '../../utils/engine';
import type { GoalMasterySnapshot } from '../../utils/masteryThemeLogic';
import { getTopics, getTopicsForProgress, SUBJECT_IDS } from '../../data/curriculum';
import { BADGE_TIER_STYLE } from '../FxCelebration';
import { Icon, MiniRing } from '../Icons';
import { MasteryThemeGallery } from '../MasteryThemePicker';
import { SlidingTabs, SmoothProgressBar } from '../ULessonMotion';
import { WatCompactStrip } from '../WatClock';
import { ActivityBars } from './HomeScreen';
import { useCloudSync } from '../../context/CloudSyncContext';
import { PWAInstallButton } from '../PWAInstallBanner';
import { useQuestionBankCounts } from '../../utils/questionBankDb';
import { BANK_TARGET_PER_SUBJECT, BANK_TOTAL_TARGET } from '../../utils/questionBankLogic';
import type { QuestionBankTab } from '../QuestionBankManagerModal';

export function AccountScreen({
  progress,
  effectiveThemeId,
  appearanceMode = 'light',
  themeLockMode,
  themeAutoProgress,
  clockFormat = '12h',
  goalSnapshot,
  onSelectTheme,
  onChangeAppearanceMode,
  onChangeThemeLockMode,
  onToggleThemeAutoProgress,
  onChangeClockFormat,
  onToggleMuted,
  onOpenSubjects,
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
  themeLockMode?: ThemeLockMode;
  themeAutoProgress?: boolean;
  clockFormat?: ClockFormat;
  goalSnapshot?: GoalMasterySnapshot;
  onSelectTheme?: (id: MasteryThemeId) => void;
  onChangeAppearanceMode?: (mode: ThemeAppearanceMode) => void;
  onChangeThemeLockMode?: (mode: ThemeLockMode) => void;
  onToggleThemeAutoProgress?: (enabled: boolean) => void;
  onChangeClockFormat?: (fmt: ClockFormat) => void;
  onToggleMuted: () => void;
  onOpenSubjects: () => void;
  onOpenTranscript?: () => void;
  onOpenLeaderboard?: () => void;
  onOpenQuestionBank?: (subj?: SubjectId, tab?: QuestionBankTab) => void;
  onRetakeDiagnostic: () => void;
  onSignOut?: () => void;
  onPreviewBadgeCelebration?: (badge: BadgeDef, isPreview?: boolean) => void;
}) {
  const [badgeFilter, setBadgeFilter] = useState<'all' | 'earned' | BadgeTier>('all');
  const { user, syncStatus, lastSyncedLabel, syncError, signInWithGoogle, signOutCloud, syncNow } = useCloudSync();
  const { totalCount: bankTotalCount } = useQuestionBankCounts();

  const allTopicsBySubj = {
    maths: getTopics('maths'),
    fmaths: getTopics('fmaths'),
    chem: getTopics('chem'),
    phys: getTopics('phys'),
    bio: getTopics('bio'),
    agric: getTopics('agric'),
    geog: getTopics('geog'),
    econ: getTopics('econ'),
    eng: getTopics('eng'),
    civic: getTopics('civic'),
    digitech: getTopics('digitech'),
    dataproc: getTopics('dataproc'),
  };

  const topics = getTopicsForProgress(progress);
  const passedCount = topics.filter((t) => tstate(progress, t.id).boss).length;
  const totalAns = progress.hist.length;
  const rightAns = progress.hist.filter((h) => h[1] === 1).length;
  const accPct = totalAns ? Math.round((rightAns / totalAns) * 100) : 0;

  const masteryPct = topics.length ? Math.round((passedCount / topics.length) * 100) : 0;

  return (
    <div className="flex flex-col gap-6 anim-rise">
      {/* Settings Header & Student Summary */}
      <section className="rtc-card rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="eyebrow text-[var(--gold)]">Appearance, Themes &amp; Study Preferences</span>
          <h1 className="h28 text-[var(--ink)]">Settings</h1>
          <p className="text-[14px] text-[var(--dim)]">
            Customize Light or Dark mode, explore your 10-stage Mastery Themes, and manage audio &amp; study preferences.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[var(--line)]">
          <WatCompactStrip surface="card" />
          <div className="flex items-center gap-3">
            <div
              aria-hidden="true"
              className="w-11 h-11 rounded-xl bg-[var(--gold)] text-[var(--on-acc)] font-[var(--display)] font-extrabold text-[19px] flex items-center justify-center shrink-0 shadow-[0_2px_6px_rgba(15,23,42,0.16)]"
            >
              {(progress.name || 'S').slice(0, 1).toUpperCase()}
            </div>
            <div>
              <div className="font-[var(--display)] font-bold text-[16px] text-[var(--ink)] leading-tight">
                {progress.name || 'Scholar'}
              </div>
              <div className="flex items-center gap-1.5 text-[13px] font-bold text-[var(--gold)] tabular-nums mt-0.5">
                <span>{passedCount}/{topics.length} mastered</span>
                <span aria-hidden="true" className="text-[var(--dim)]">·</span>
                <span className="text-[var(--dim)]">{accPct}% accuracy</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cloud Sync (Google Auth) & Offline PWA App */}
      <section className="grid grid-cols-1 min-[820px]:grid-cols-12 gap-4 items-stretch">
        <div className="min-[820px]:col-span-5 rtc-card rounded-2xl p-5 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="eyebrow text-[var(--gold)]">Cross-Device Cloud Backup</span>
            <h2 className="h20 text-[var(--ink)]">Google Cloud Sync</h2>
            <p className="text-[13.5px] text-[var(--dim)] leading-relaxed">
              {user
                ? `Signed in as ${user.displayName || user.email}. Progress, Mistake Vault, CBT scores & study plan sync across phone and laptop.`
                : 'Sign in with Google to back up your 12-subject mastery, CBT scores, Mistake Vault, and Peer Duel rankings.'}
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
                  <span>{syncStatus === 'syncing' ? 'Syncing…' : 'Sync Now'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => void signOutCloud()}
                  className="btn-tactile paper min-h-[38px] text-[13px] px-3.5 whitespace-nowrap"
                >
                  Sign Out Google
                </button>
                {lastSyncedLabel && (
                  <span className="text-[12px] font-semibold text-[var(--green)] mono tabular-nums">
                    Synced {lastSyncedLabel}
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

        <div className="min-[820px]:col-span-7 rtc-card rounded-2xl p-5 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="eyebrow text-[var(--gold)]">Offline Study &amp; Transcripts</span>
            <h2 className="h20 text-[var(--ink)]">Offline App &amp; Reports</h2>
            <p className="text-[13.5px] text-[var(--dim)] leading-relaxed">
              Install EYAK on your home screen for zero-data study, or print your Parent/Teacher Readiness Transcript.
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
                <span className="tabular-nums">Question Bank ({bankTotalCount.toLocaleString()})</span>
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
                <span>Readiness Transcript</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Appearance (Light / Dark) & 10-Stage Mastery Progression Themes */}
      {effectiveThemeId &&
        themeLockMode &&
        goalSnapshot &&
        onSelectTheme &&
        onChangeAppearanceMode &&
        onChangeThemeLockMode &&
        onToggleThemeAutoProgress && (
          <section className="rtc-card rounded-2xl p-5 sm:p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-0.5">
              <span className="eyebrow text-[var(--gold)]">Appearance &amp; 10-Stage Progression</span>
              <h2 className="h20 text-[var(--ink)]">Theme &amp; Display Mode</h2>
              <p className="text-[13.5px] text-[var(--dim)]">
                Switch between Light and Dark themes anytime, preview all 10 Mastery Themes in Test Mode, or lock stages so they unlock as you advance from 0% to 100% of your goal.
              </p>
            </div>
            <MasteryThemeGallery
              effectiveThemeId={effectiveThemeId}
              appearanceMode={appearanceMode}
              lockMode={themeLockMode}
              autoProgress={themeAutoProgress !== false}
              goalSnapshot={goalSnapshot}
              onSelectTheme={onSelectTheme}
              onChangeAppearanceMode={onChangeAppearanceMode}
              onChangeLockMode={onChangeThemeLockMode}
              onToggleAutoProgress={onToggleThemeAutoProgress}
            />
          </section>
        )}

      {/* Live WAT Timezone & Clock Format (12-Hour vs 24-Hour) */}
      <section
        aria-label="Live WAT Clock Format"
        className="rtc-card rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex flex-col gap-1.5 max-w-[540px]">
          <span className="eyebrow text-[var(--gold)]">West Africa Time · WAT (UTC+1)</span>
          <h2 className="h20 text-[var(--ink)]">Live WAT Clock Format</h2>
          <p className="text-[13.5px] text-[var(--dim)]">
            Choose between 12-hour (AM/PM) and 24-hour time for the live WAT clock and calendar displayed across all study panes.
          </p>
          <WatCompactStrip surface="inline" className="pt-0.5" />
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <SlidingTabs
            items={[
              { id: '12h', label: '12-Hour (AM/PM)', icon: 'clock' },
              { id: '24h', label: '24-Hour (24H)', icon: 'clock' },
            ]}
            value={clockFormat}
            onChange={(nextFmt) => onChangeClockFormat?.(nextFmt)}
            ariaLabel="Select live WAT clock format"
            variant="indigo"
          />
        </div>
      </section>

      {/* Study & Audio Preferences */}
      <section className="rtc-card rounded-2xl p-5 sm:p-6 flex flex-col gap-4">
        <div className="flex flex-col gap-0.5">
          <span className="eyebrow text-[var(--gold)]">Preferences &amp; Controls</span>
          <h2 className="h20 text-[var(--ink)]">Audio &amp; Study Settings</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onToggleMuted}
            aria-pressed={!progress.muted}
            className="btn-tactile paper justify-between whitespace-nowrap"
          >
            <span className="flex items-center gap-2.5 min-w-0">
              <Icon name={progress.muted ? 'mute' : 'vol'} size={18} className="shrink-0" />
              <span className="truncate">Sound &amp; Voice: {progress.muted ? 'Off' : 'On'}</span>
            </span>
            <span className="text-[12px] font-bold text-[var(--gold)] shrink-0">
              {progress.muted ? 'Turn on' : 'Mute'}
            </span>
          </button>

          <button type="button" onClick={onOpenSubjects} className="btn-tactile paper justify-between whitespace-nowrap">
            <span className="flex items-center gap-2.5 min-w-0">
              <Icon name="books" size={18} className="shrink-0" />
              <span className="truncate">Subjects &amp; Target ({progress.subjs.length} · {progress.target}%)</span>
            </span>
            <Icon name="go" size={17} className="shrink-0" />
          </button>

          <button type="button" onClick={onRetakeDiagnostic} className="btn-tactile paper justify-between whitespace-nowrap">
            <span className="flex items-center gap-2.5 min-w-0">
              <Icon name="target" size={18} className="shrink-0" />
              <span className="truncate">Retake {SUBJECT_INFO[progress.subj].short} diagnostic</span>
            </span>
            <Icon name="go" size={17} className="shrink-0" />
          </button>

          {onSignOut && (
            <button type="button" onClick={onSignOut} className="btn-tactile paper justify-between whitespace-nowrap">
              <span className="flex items-center gap-2.5 min-w-0">
                <Icon name="logout" size={18} className="shrink-0" />
                <span className="truncate">Sign out to Scholar Portal</span>
              </span>
              <Icon name="go" size={17} className="shrink-0" />
            </button>
          )}
        </div>
      </section>

      {/* Syllabus Mastery + Quick Stats */}
      <div className="grid grid-cols-1 min-[780px]:grid-cols-12 gap-5">
        <section className="min-[780px]:col-span-6 rtc-card rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="h18 text-[var(--ink)]">Syllabus Mastery</h2>
            <span className="text-[13px] font-bold text-[var(--gold)] tabular-nums">
              {masteryPct}% of {SUBJECT_INFO[progress.subj].short}
            </span>
          </div>
          <svg
            className="w-full h-3 rounded-full overflow-hidden"
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
          <div className="grid grid-cols-3 gap-2.5 pt-2">
            <div className="rounded-xl bg-[var(--bg)] p-3 text-center">
              <div className="text-[11px] font-semibold text-[var(--dim)]">Answered</div>
              <div className="font-[var(--display)] font-extrabold text-[19px] text-[var(--ink)] tabular-nums">
                {totalAns}
              </div>
            </div>
            <div className="rounded-xl bg-[var(--bg)] p-3 text-center">
              <div className="text-[11px] font-semibold text-[var(--dim)]">Accuracy</div>
              <div className="font-[var(--display)] font-extrabold text-[19px] text-[var(--green)] tabular-nums">
                {accPct}%
              </div>
            </div>
            <div className="rounded-xl bg-[var(--bg)] p-3 text-center">
              <div className="text-[11px] font-semibold text-[var(--dim)]">Passed</div>
              <div className="font-[var(--display)] font-extrabold text-[19px] text-[var(--gold)] tabular-nums">
                {passedCount}/{topics.length}
              </div>
            </div>
          </div>
        </section>

        <section className="min-[780px]:col-span-6 rtc-card rounded-2xl p-5 flex flex-col gap-2">
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

      {/* 28 Hard-Earned Tiered Achievement Badges */}
      <section className="rtc-card rounded-2xl p-5 sm:p-6 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="eyebrow text-[var(--gold)]">Hard-Earned Honours &amp; Milestones</span>
            <h2 className="h20 text-[var(--ink)]">Achievement Badges</h2>
            <p className="text-[13.5px] text-[var(--dim)]">
              Every badge honours a real mastery milestone and triggers a celebration fanfare when unlocked. Tap any earned badge to replay its celebration.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-[13px] font-bold text-[var(--gold)] tabular-nums whitespace-nowrap">
              {BADGES.filter((b) => !!progress.badges[b.id]).length} / {BADGES.length} earned
            </span>
            {onPreviewBadgeCelebration && (
              <button
                type="button"
                onClick={() => {
                  const sample =
                    BADGES.find((b) => !!progress.badges[b.id]) ||
                    BADGES.find((b) => b.tier === 'mythic') ||
                    BADGES[0];
                  onPreviewBadgeCelebration(sample, !progress.badges[sample.id]);
                }}
                className="btn-tactile paper min-h-[38px] text-[12.5px] px-3 whitespace-nowrap"
              >
                <Icon name="star" size={15} />
                <span>Preview Celebration</span>
              </button>
            )}
          </div>
        </div>

        {/* Tier Filter Bar */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[var(--bg)] border border-[var(--line)]">
          {(
            [
              ['all', `All (${BADGES.length})`],
              ['earned', `Earned (${BADGES.filter((b) => !!progress.badges[b.id]).length})`],
              ['bronze', 'Bronze'],
              ['silver', 'Silver'],
              ['gold', 'Gold'],
              ['mythic', 'Mythic'],
            ] as const
          ).map(([fid, label]) => {
            const active = badgeFilter === fid;
            return (
              <button
                key={fid}
                type="button"
                onClick={() => setBadgeFilter(fid)}
                className={`px-3 py-1.5 rounded-lg text-[12.5px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  active
                    ? 'bg-[var(--card)] text-[var(--ink)] shadow-xs border border-[var(--acc-line)]'
                    : 'text-[var(--dim)] hover:text-[var(--ink)]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 min-[920px]:grid-cols-4 gap-3">
          {BADGES.filter((b) => {
            if (badgeFilter === 'all') return true;
            if (badgeFilter === 'earned') return !!progress.badges[b.id];
            return b.tier === badgeFilter;
          }).map((b) => {
            const earned = !!progress.badges[b.id];
            const tierMeta = BADGE_TIER_STYLE[b.tier];
            const prog = b.progress ? b.progress(progress, topics, allTopicsBySubj) : null;

            return (
              <div
                key={b.id}
                onClick={() => {
                  if (earned && onPreviewBadgeCelebration) {
                    onPreviewBadgeCelebration(b, false);
                  }
                }}
                role={earned && onPreviewBadgeCelebration ? 'button' : undefined}
                tabIndex={earned && onPreviewBadgeCelebration ? 0 : undefined}
                onKeyDown={(e) => {
                  if (earned && onPreviewBadgeCelebration && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onPreviewBadgeCelebration(b, false);
                  }
                }}
                className={`rounded-2xl border p-4 flex flex-col justify-between gap-3 transition-transform ${
                  earned
                    ? 'bg-[var(--acc-soft)]/45 border-[var(--acc-line)] hover:-translate-y-0.5 cursor-pointer'
                    : 'bg-[var(--bg)]/65 border-[var(--line)]'
                }`}
              >
                <div className="flex items-start justify-between gap-2.5">
                  <div
                    className="bd-hex w-12 h-12 flex items-center justify-center shrink-0"
                    style={
                      earned
                        ? { background: tierMeta.crestBg, color: tierMeta.crestText }
                        : { background: 'var(--line)', color: 'var(--dim)' }
                    }
                  >
                    <Icon name={b.icon} size={21} />
                  </div>
                  <div className="text-right text-[11.5px] font-bold">
                    <div className="text-[var(--gold)]">{tierMeta.label}</div>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="font-[var(--display)] font-bold text-[15px] text-[var(--ink)] leading-snug">
                    {b.name}
                  </div>
                  <div className="text-[12.5px] text-[var(--dim)] leading-snug">{b.desc}</div>
                </div>

                {earned ? (
                  <div className="pt-2 border-t border-[var(--line)] flex items-center justify-between text-[12px] font-bold text-[var(--green)]">
                    <span className="flex items-center gap-1">
                      <Icon name="check" size={14} />
                      <span>Unlocked</span>
                    </span>
                    {onPreviewBadgeCelebration && (
                      <span className="text-[var(--gold)]">Replay ↗</span>
                    )}
                  </div>
                ) : prog ? (
                  <div className="pt-2 border-t border-[var(--line)] flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[11.5px] font-semibold text-[var(--dim)] tabular-nums">
                      <span>Progress</span>
                      <span>
                        {prog.cur} / {prog.max} {prog.unit || ''}
                      </span>
                    </div>
                    <SmoothProgressBar
                      value={prog.cur}
                      max={Math.max(1, prog.max)}
                      tone="indigo"
                      heightClass="h-1.5"
                    />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

const SUBJECT_CAPABILITY_COPY: Record<SubjectId, { mentor: string; tools: string }> = {
  maths: { mentor: 'Master Chike', tools: 'Lessons · Constructions Lab · Formula Studio' },
  fmaths: { mentor: 'Prof. Chinedu', tools: 'Lessons · Illustrated Diagrams · Formula Studio' },
  chem: { mentor: 'Prof. Spark', tools: 'Lessons · Practicals Lab · Formula Studio' },
  phys: { mentor: 'Dr. Faraday', tools: 'Lessons · Practicals Lab · Formula Studio' },
  bio: { mentor: 'Dr. Amaka', tools: 'Lessons · Microscopy & Practicals Lab' },
  agric: { mentor: 'Dr. Fatima', tools: 'Lessons · Agronomy & Farm Practicals Lab' },
  geog: { mentor: 'Dr. Ibrahim', tools: 'Lessons · Map & Relief Diagrams · Calculations Studio' },
  econ: { mentor: 'Dr. Ngozi', tools: 'Lessons · Quantitative Formula Studio' },
  eng: { mentor: 'Miss Adaeze', tools: 'Lessons · Grammar & Diction Rules Studio' },
  civic: { mentor: 'Barrister Kunle', tools: 'Lessons · Constitutional Case Studies & Diagrams' },
  digitech: { mentor: 'Engr. Tunde', tools: 'Lessons · Architecture Diagrams · Formula Studio' },
  dataproc: { mentor: 'Mrs. Kemi', tools: 'Lessons · Relational Diagrams · SQL & Formula Studio' },
};

export function SubjectsScreen({
  progress,
  dueCount = 0,
  onSelectSubject,
  onToggleSubject,
  onUpdateTarget,
  onOpenReview,
  onOpenQuestionBank,
}: {
  progress: UserProgress;
  dueCount?: number;
  onSelectSubject?: (sid: SubjectId) => void;
  onToggleSubject: (sid: SubjectId) => void;
  onUpdateTarget: (t: number) => void;
  onOpenReview?: () => void;
  onOpenQuestionBank?: (subj?: SubjectId, tab?: QuestionBankTab) => void;
  onBack?: () => void;
}) {
  const { counts: bankCounts, totalCount: bankTotalCount } = useQuestionBankCounts();

  return (
    <div className="flex flex-col gap-5 anim-rise">
      {/* Flagship 12-Subject Hub Header */}
      <section className="rtc-card rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="eyebrow text-[var(--gold)]">SS1–SS3 National Curriculum</span>
          <h1 className="h28 text-[var(--ink)]">Subjects Hub</h1>
          <p className="text-[14px] text-[var(--dim)]">
            Switch your active study faculty, track mastery &amp; offline IndexedDB question banks across all {SUBJECT_IDS.length} subjects ({progress.subjs.length}/{SUBJECT_IDS.length} active).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <WatCompactStrip surface="card" />
          {onOpenQuestionBank && (
            <button
              type="button"
              onClick={() => onOpenQuestionBank(progress.subj, 'overview')}
              className="btn-tactile indigo shrink-0 whitespace-nowrap"
            >
              <Icon name="database" size={16} />
              <span>
                Question Bank ({bankTotalCount.toLocaleString()} / {BANK_TOTAL_TARGET.toLocaleString()})
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
                {dueCount > 0 ? `Spaced Review (${dueCount} due)` : 'Spaced Review'}
              </span>
            </button>
          )}
        </div>
      </section>

      {/* Symmetrical 2-Column × 6-Row Faculty Grid */}
      <section aria-label="All 12 SS1–SS3 subjects" className="grid grid-cols-1 min-[740px]:grid-cols-2 gap-4">
        {SUBJECT_IDS.map((sid) => {
          const enrolled = progress.subjs.includes(sid);
          const isCurrent = progress.subj === sid;
          const subjTopics = getTopics(sid);
          const passed = subjTopics.filter((t) => tstate(progress, t.id).boss).length;
          const avgMastery = subjTopics.length
            ? Math.round(subjTopics.reduce((s, t) => s + mpct(progress, t.id), 0) / subjTopics.length)
            : 0;
          const cap = SUBJECT_CAPABILITY_COPY[sid];
          const offlineQs = bankCounts[sid] || 0;

          return (
            <article
              key={sid}
              className={`rounded-2xl p-4 sm:p-5 border flex flex-col justify-between gap-3.5 transition ${
                isCurrent
                  ? 'rtc-card bg-gradient-to-br from-[var(--acc-soft)]/50 via-[var(--card)] to-[var(--card)] border-[var(--gold)] ring-1 ring-[var(--gold)]/25'
                  : enrolled
                    ? 'rtc-card hover:border-[var(--acc-line)]'
                    : 'bg-[var(--card)]/75 border-dashed border-[var(--line)] opacity-85'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-11 h-11 rounded-xl bg-[var(--bg)] border border-[var(--line)] flex items-center justify-center text-[var(--gold)] shrink-0">
                    <Icon name={SUBJECT_INFO[sid].icon} size={21} />
                  </span>
                  <div className="min-w-0">
                    <div className="font-[var(--display)] font-bold text-[17px] text-[var(--ink)] truncate">
                      {SUBJECT_INFO[sid].name}
                    </div>
                    <div className="text-[12.5px] text-[var(--dim)] flex items-center gap-1.5 flex-wrap">
                      <span>{subjTopics.length} topics</span>
                      <span aria-hidden="true">·</span>
                      <span>{passed} passed</span>
                      <span aria-hidden="true">·</span>
                      <span>{cap.mentor}</span>
                    </div>
                  </div>
                </div>
                <MiniRing value={avgMastery} size={46} />
              </div>

              <div className="text-[12.5px] text-[var(--dim)]">{cap.tools}</div>

              {/* Live IndexedDB Offline Question Bank Bar */}
              <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] px-3 py-2 flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2 text-[12px]">
                  <span className="font-bold text-[var(--ink)] inline-flex items-center gap-1.5 tabular-nums">
                    <Icon name="database" size={13} className="text-[var(--gold)]" />
                    <span>
                      {offlineQs.toLocaleString()} / {BANK_TARGET_PER_SUBJECT.toLocaleString()} offline questions
                    </span>
                  </span>
                  {onOpenQuestionBank && (
                    <button
                      type="button"
                      onClick={() => onOpenQuestionBank(sid, offlineQs > 0 ? 'browse' : 'overview')}
                      className="text-[11.5px] font-bold text-[var(--gold)] hover:underline cursor-pointer whitespace-nowrap"
                    >
                      {offlineQs > 0 ? 'Browse / Drill →' : 'Sync / Generate →'}
                    </button>
                  )}
                </div>
                <SmoothProgressBar
                  value={offlineQs}
                  max={BANK_TARGET_PER_SUBJECT}
                  tone={offlineQs >= BANK_TARGET_PER_SUBJECT ? 'emerald' : 'indigo'}
                  heightClass="h-1.5"
                />
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-[var(--line)]">
                <button
                  type="button"
                  onClick={() => {
                    if (!enrolled) onToggleSubject(sid);
                    onSelectSubject?.(sid);
                  }}
                  className={`min-h-[38px] px-4 rounded-xl text-[13px] font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition ${
                    isCurrent
                      ? 'bg-[var(--gold)] text-[var(--on-acc)] shadow-[0_1px_2px_rgba(15,23,42,0.16)]'
                      : 'bg-[var(--bg)] text-[var(--ink)] border border-[var(--line)] hover:border-[var(--gold)]'
                  }`}
                >
                  <span>{isCurrent ? 'Studying now' : 'Switch & Study'}</span>
                  <Icon name="go" size={14} />
                </button>

                <button
                  type="button"
                  onClick={() => onToggleSubject(sid)}
                  aria-pressed={enrolled}
                  disabled={enrolled && progress.subjs.length <= 1}
                  className="min-h-[38px] px-3 rounded-xl text-[12.5px] font-bold text-[var(--dim)] hover:text-[var(--ink)] disabled:opacity-45 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Icon name={enrolled ? 'check' : 'plus'} size={14} className={enrolled ? 'text-[var(--gold)]' : ''} />
                  <span>{enrolled ? 'Active' : 'Add to bar'}</span>
                </button>
              </div>
            </article>
          );
        })}
      </section>

      {/* Target Score Slider */}
      <section className="rtc-card rounded-2xl p-5 flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <label htmlFor="subjs-target" className="h18 text-[var(--ink)]">
            Target Mastery Score
          </label>
          <output htmlFor="subjs-target" className="font-[var(--display)] font-extrabold text-[22px] text-[var(--gold)] tabular-nums">
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
