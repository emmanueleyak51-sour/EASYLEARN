import React, { useEffect, useMemo, useState } from 'react';
import type { SubjectId, UserProgress } from '../../types';
import { getTopics, SUBJECT_IDS } from '../../data/curriculum';
import { SUBJECT_INFO } from '../../utils/engine';
import { useCloudSync } from '../../context/CloudSyncContext';
import {
  buildStandingFromProgress,
  CAMPUS_GOAL_PRESETS,
  computeHeadToHead,
  computeMasteryIndexBreakdown,
  getDivisionForIndex,
  getNationalDivisionBenchmarks,
  LEADERBOARD_DIVISIONS,
  rankLeaderboardEntries,
  sanitizeCampusGoal,
  type LeaderboardCriterion,
  type LeaderboardStanding,
} from '../../utils/leaderboardLogic';
import { AnimatedNumber } from '../AnimatedNumber';
import { AdirePattern, Icon } from '../Icons';
import { SubscreenTopBar } from '../AppShell';
import { SmoothProgressBar } from '../ULessonMotion';

const CRITERIA_TABS: { id: LeaderboardCriterion; label: string; short: string; unit: string }[] = [
  { id: 'masteryIndex', label: 'Mastery Index', short: 'Index', unit: '/1000' },
  { id: 'topicsPassed', label: 'Topics Mastered', short: 'Topics', unit: 'topics' },
  { id: 'accuracyPct', label: 'Accuracy', short: 'Accuracy', unit: '%' },
  { id: 'bestCbtScore', label: 'Best CBT', short: 'CBT', unit: '/400' },
  { id: 'streakCount', label: 'Study Streak', short: 'Streak', unit: 'd' },
];

export function LeaderboardScreen({
  progress,
  onBack,
  onUpdateLeaderboardPrefs,
  onOpenCbt,
  onOpenDuel,
  onOpenTopics,
}: {
  progress: UserProgress;
  onBack: () => void;
  onUpdateLeaderboardPrefs: (prefs: { campusGoal?: string; isPublic?: boolean }) => void;
  onOpenCbt: () => void;
  onOpenDuel: () => void;
  onOpenTopics: () => void;
}) {
  const {
    user,
    authReady,
    signInWithGoogle,
    publishLeaderboardStanding,
    subscribeToLeaderboard,
  } = useCloudSync();

  const [criterion, setCriterion] = useState<LeaderboardCriterion>('masteryIndex');
  const [subjectFilter, setSubjectFilter] = useState<SubjectId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBenchmarks, setShowBenchmarks] = useState(true);
  const [liveEntries, setLiveEntries] = useState<LeaderboardStanding[]>([]);
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveError, setLiveError] = useState<string | null>(null);
  const [campusInput, setCampusInput] = useState(
    progress.leaderboardCampusGoal || 'National Scholar'
  );
  const [syncNotice, setSyncNotice] = useState<string | null>(null);
  const [syncBusy, setSyncBusy] = useState(false);
  const [compareUid, setCompareUid] = useState<string | null>(null);
  const [copiedInvite, setCopiedInvite] = useState(false);

  const isPublic = progress.leaderboardPublic !== false;

  const allTopicsBySubj = useMemo(
    () =>
      Object.fromEntries(SUBJECT_IDS.map((sid) => [sid, getTopics(sid)])) as Record<
        SubjectId,
        ReturnType<typeof getTopics>
      >,
    []
  );

  const selfStanding = useMemo(
    () =>
      buildStandingFromProgress(progress, allTopicsBySubj, {
        uid: user?.uid || 'local-self',
        campusGoal: progress.leaderboardCampusGoal ?? campusInput,
        isPublic,
      }),
    [allTopicsBySubj, campusInput, isPublic, progress, user?.uid]
  );

  const selfBreakdown = useMemo(
    () =>
      computeMasteryIndexBreakdown({
        topicsPassed: selfStanding.topicsPassed,
        totalAnswered: selfStanding.totalAnswered,
        accuracyPct: selfStanding.accuracyPct,
        bestCbtScore: selfStanding.bestCbtScore,
        streakCount: selfStanding.streakCount,
        duelsCompleted: selfStanding.duelsCompleted,
        theoryCount: Object.keys(progress.theoryScores || {}).length,
      }),
    [progress.theoryScores, selfStanding]
  );

  const divisionInfo = useMemo(
    () => getDivisionForIndex(selfStanding.masteryIndex),
    [selfStanding.masteryIndex]
  );

  useEffect(() => {
    if (!authReady || !user) {
      setLiveEntries([]);
      setLiveLoading(false);
      setLiveError(null);
      return;
    }
    setLiveLoading(true);
    setLiveError(null);
    const unsub = subscribeToLeaderboard(
      (entries) => {
        setLiveEntries(entries);
        setLiveLoading(false);
      },
      (errMsg) => {
        setLiveError(errMsg);
        setLiveLoading(false);
      }
    );
    return unsub;
  }, [authReady, subscribeToLeaderboard, user]);

  // Combine real live Firestore scholars + your own freshest standing + optional National Division Cut-Offs
  const combinedEntries = useMemo(() => {
    const base: LeaderboardStanding[] = [];
    for (const row of liveEntries) {
      if (row.uid !== selfStanding.uid) {
        base.push(row);
      }
    }
    base.push(selfStanding);
    if (showBenchmarks) {
      base.push(...getNationalDivisionBenchmarks());
    }
    return base;
  }, [liveEntries, selfStanding, showBenchmarks]);

  const rankedRows = useMemo(
    () => rankLeaderboardEntries(combinedEntries, criterion, subjectFilter, searchQuery),
    [combinedEntries, criterion, searchQuery, subjectFilter]
  );

  const fullUnfilteredRows = useMemo(
    () => rankLeaderboardEntries(combinedEntries, criterion, subjectFilter, ''),
    [combinedEntries, criterion, subjectFilter]
  );

  const selfRow = useMemo(
    () => fullUnfilteredRows.find((r) => r.entry.uid === selfStanding.uid) || null,
    [fullUnfilteredRows, selfStanding.uid]
  );

  const nextRivalAbove = useMemo(() => {
    if (!selfRow || selfRow.rank <= 1) return null;
    return fullUnfilteredRows.find((r) => r.rank === selfRow.rank - 1) || null;
  }, [fullUnfilteredRows, selfRow]);

  const activeCompareEntry = useMemo(() => {
    if (!compareUid) return null;
    return combinedEntries.find((e) => e.uid === compareUid) || null;
  }, [combinedEntries, compareUid]);

  const headToHead = useMemo(() => {
    if (!activeCompareEntry) return null;
    return computeHeadToHead(selfStanding, activeCompareEntry);
  }, [activeCompareEntry, selfStanding]);

  const topThree = useMemo(() => fullUnfilteredRows.slice(0, 3), [fullUnfilteredRows]);
  const liveScholarCount = useMemo(() => {
    const realUids = new Set(liveEntries.map((e) => e.uid));
    if (user && isPublic) realUids.add(user.uid);
    return realUids.size;
  }, [isPublic, liveEntries, user]);

  const activeCriterionMeta =
    CRITERIA_TABS.find((t) => t.id === criterion) || CRITERIA_TABS[0];

  const handleSaveCampusAndSync = async (overrideGoal?: string, overridePublic?: boolean) => {
    const cleanGoal = sanitizeCampusGoal(overrideGoal ?? campusInput) || 'National Scholar';
    const nextPublic = overridePublic !== undefined ? overridePublic : isPublic;
    setCampusInput(cleanGoal);
    onUpdateLeaderboardPrefs({ campusGoal: cleanGoal, isPublic: nextPublic });

    if (!user) {
      setSyncNotice('Campus goal saved locally. Sign in with Google to publish live.');
      return;
    }
    setSyncBusy(true);
    setSyncNotice(null);
    const ok = await publishLeaderboardStanding(
      { ...progress, leaderboardCampusGoal: cleanGoal, leaderboardPublic: nextPublic },
      { campusGoal: cleanGoal, isPublic: nextPublic }
    );
    setSyncBusy(false);
    setSyncNotice(
      ok
        ? nextPublic
          ? 'Live standing synced to the National Leaderboard.'
          : 'Profile set to private (hidden from public standings).'
        : 'Could not reach cloud right now. Local standing is saved.'
    );
  };

  const handleCopyInvite = () => {
    const url = typeof window !== 'undefined' ? window.location.origin : '';
    const msg = `Compete with me on the EYAK National Scholars Leaderboard! My current Mastery Index is ${selfStanding.masteryIndex}/1000 (${divisionInfo.current.title}). Join here: ${url}`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(msg).catch(() => {});
    }
    setCopiedInvite(true);
    window.setTimeout(() => setCopiedInvite(false), 2400);
  };

  const formatScoreDisplay = (val: number) => {
    if (subjectFilter !== 'all' && criterion === 'masteryIndex') {
      return `${val}%`;
    }
    if (criterion === 'accuracyPct') return `${val}%`;
    if (criterion === 'streakCount') return `${val}d`;
    if (criterion === 'bestCbtScore') return `${val}/400`;
    if (criterion === 'topicsPassed') return `${val}`;
    return `${val}`;
  };

  const scoreColumnLabel =
    subjectFilter !== 'all' && criterion === 'masteryIndex'
      ? `${SUBJECT_INFO[subjectFilter].short} Mastery`
      : activeCriterionMeta.label;

  return (
    <div className="flex flex-col gap-6 anim-rise">
      <SubscreenTopBar
        title="National Scholars Leaderboard"
        subtitle={
          user
            ? `Live Cloud Standings · ${liveScholarCount} active scholar${liveScholarCount === 1 ? '' : 's'}`
            : 'Academic Mastery Standings · Sign in to compete live'
        }
        onBack={onBack}
        right={
          <button
            type="button"
            onClick={handleCopyInvite}
            className="btn-tactile paper min-h-[36px] sm:min-h-[38px] text-[12px] sm:text-[12.5px] px-2.5 sm:px-3.5 whitespace-nowrap"
          >
            <Icon name={copiedInvite ? 'check' : 'trophy'} size={15} />
            <span className="hidden sm:inline">
              {copiedInvite ? 'Invite Copied' : 'Invite Friends'}
            </span>
            <span className="sm:hidden">{copiedInvite ? 'Copied' : 'Invite'}</span>
          </button>
        }
      />

      {/* 1. FOCAL HERO: YOUR LIVE STANDING & COMPETITOR PROFILE */}
      <section className="adire-panel rounded-[24px] p-5 sm:p-7 text-white">
        <AdirePattern />
        <div className="relative z-10 grid grid-cols-1 min-[920px]:grid-cols-12 gap-6 items-stretch">
          {/* Left: Your Rank, Mastery Index & Climb Path */}
          <div className="min-[920px]:col-span-7 flex flex-col justify-between gap-5">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[12.5px] font-bold text-[var(--hero-badge)] flex-wrap">
                <span>{divisionInfo.current.title}</span>
                <span aria-hidden="true" className="opacity-50">·</span>
                <span className="text-white/85 font-semibold">
                  {selfStanding.campusGoal || 'National Scholar'}
                </span>
                <span aria-hidden="true" className="opacity-50">·</span>
                <span className="text-white/75 font-semibold">
                  {user ? (isPublic ? 'Live on Board' : 'Private Mode') : 'Local Preview'}
                </span>
              </div>

              <div className="flex items-baseline gap-4 flex-wrap">
                <div className="font-[var(--display)] font-extrabold text-[40px] sm:text-[48px] leading-none tracking-tight tabular-nums text-white">
                  <AnimatedNumber value={selfStanding.masteryIndex} />
                  <span className="text-[18px] sm:text-[20px] font-bold text-white/60 ml-1">
                    / 1,000
                  </span>
                </div>
                {selfRow && (
                  <div className="text-[14px] font-bold text-[var(--hero-badge)] tabular-nums">
                    Ranked #{selfRow.rank} of {fullUnfilteredRows.length}
                  </div>
                )}
              </div>

              <p className="text-[14px] text-white/80 leading-relaxed max-w-xl">
                {nextRivalAbove
                  ? `${Math.max(1, nextRivalAbove.scoreValue - (selfRow?.scoreValue || 0))} ${
                      subjectFilter !== 'all' && criterion === 'masteryIndex'
                        ? '% mastery'
                        : criterion === 'masteryIndex'
                          ? 'index points'
                          : criterion === 'bestCbtScore'
                            ? 'CBT points'
                            : criterion === 'streakCount'
                              ? 'days'
                              : criterion === 'accuracyPct'
                                ? '% accuracy'
                                : 'topics'
                    } behind ${nextRivalAbove.entry.displayName} (#${nextRivalAbove.rank}). Pass a Topic Test or beat your JAMB CBT record to climb.`
                  : divisionInfo.next
                    ? `${divisionInfo.pointsToNext} index points to unlock ${divisionInfo.next.title}. Keep building mastery across subjects.`
                    : "You stand at the summit of the Chancellor's List. Defend your #1 spot with daily accuracy."}
              </p>
            </div>

            {/* Climb Progress Bar toward next Division */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-[12px] font-semibold text-white/85 tabular-nums">
                <span>
                  {divisionInfo.next
                    ? `Climb to ${divisionInfo.next.title} (${divisionInfo.next.minIndex} index)`
                    : "Chancellor's List Summit Reached"}
                </span>
                <span>{divisionInfo.tierProgressPct}%</span>
              </div>
              <SmoothProgressBar
                value={divisionInfo.tierProgressPct}
                max={100}
                tone="gold"
                heightClass="h-2"
                trackClass="bg-white/15"
                ariaLabel="Progress to next academic division"
              />
            </div>

            {/* 4-Metric Personal Breakdown Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/15">
              <div>
                <div className="text-[11.5px] font-semibold text-white/65">Topics Mastered</div>
                <div className="font-[var(--display)] font-extrabold text-[20px] tabular-nums">
                  {selfStanding.topicsPassed}
                </div>
              </div>
              <div>
                <div className="text-[11.5px] font-semibold text-white/65">Accuracy</div>
                <div className="font-[var(--display)] font-extrabold text-[20px] tabular-nums">
                  {selfStanding.accuracyPct}%
                </div>
              </div>
              <div>
                <div className="text-[11.5px] font-semibold text-white/65">Best CBT</div>
                <div className="font-[var(--display)] font-extrabold text-[20px] tabular-nums">
                  {selfStanding.bestCbtScore}/400
                </div>
              </div>
              <div>
                <div className="text-[11.5px] font-semibold text-white/65">Study Streak</div>
                <div className="font-[var(--display)] font-extrabold text-[20px] tabular-nums">
                  {selfStanding.streakCount}d
                </div>
              </div>
            </div>

            {/* Direct Climb CTAs */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={onOpenCbt}
                className="btn-tactile paper min-h-[42px] px-4 text-[13.5px] whitespace-nowrap"
              >
                <Icon name="clock" size={16} />
                <span>Boost CBT Score</span>
              </button>
              <button
                type="button"
                onClick={onOpenTopics}
                className="inline-flex items-center gap-2 min-h-[42px] px-4 rounded-xl bg-white/12 hover:bg-white/20 text-white font-bold text-[13.5px] transition-colors cursor-pointer whitespace-nowrap"
              >
                <Icon name="map" size={16} />
                <span>Pass a Topic Test</span>
              </button>
              <button
                type="button"
                onClick={onOpenDuel}
                className="inline-flex items-center gap-2 min-h-[42px] px-4 rounded-xl bg-white/12 hover:bg-white/20 text-white font-bold text-[13.5px] transition-colors cursor-pointer whitespace-nowrap"
              >
                <Icon name="trophy" size={16} />
                <span>Peer Duel</span>
              </button>
            </div>
          </div>

          {/* Right: Competitor Profile & Live Cloud Join Panel */}
          <div className="min-[920px]:col-span-5 rounded-2xl bg-black/25 border border-white/15 p-4 sm:p-5 flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[12px] font-bold tracking-wide text-[var(--hero-badge)]">
                  Competitor Profile
                </span>
                <span className="text-[12px] font-semibold text-white/75 tabular-nums">
                  {selfStanding.displayName}
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="leaderboard-campus-goal"
                  className="text-[12px] font-semibold text-white/80"
                >
                  Target University / Aspiration
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="leaderboard-campus-goal"
                    type="text"
                    maxLength={48}
                    value={campusInput}
                    onChange={(e) => setCampusInput(e.target.value)}
                    placeholder="e.g. UNILAG · Medicine"
                    className="flex-1 min-w-0 rounded-xl bg-white/10 border border-white/20 px-3 py-2 text-[13.5px] font-semibold text-white placeholder:text-white/45 focus:outline-none focus:border-[var(--hero-badge)]"
                  />
                  <button
                    type="button"
                    onClick={() => void handleSaveCampusAndSync()}
                    disabled={syncBusy}
                    className="min-h-[38px] px-3.5 rounded-xl bg-[var(--hero-badge)] text-[#141C33] font-extrabold text-[12.5px] hover:opacity-95 transition cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-60"
                  >
                    {syncBusy ? 'Syncing…' : user ? 'Save & Sync' : 'Save'}
                  </button>
                </div>
              </div>

              {/* Quick Campus Presets */}
              <div className="flex flex-wrap gap-1.5">
                {CAMPUS_GOAL_PRESETS.slice(0, 6).map((preset) => {
                  const selected = campusInput === preset;
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => void handleSaveCampusAndSync(preset)}
                      className={`px-2.5 py-1 rounded-lg text-[11.5px] font-semibold transition cursor-pointer whitespace-nowrap ${
                        selected
                          ? 'bg-[var(--hero-badge)] text-[#141C33]'
                          : 'bg-white/10 text-white/80 hover:bg-white/20'
                      }`}
                    >
                      {preset}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-2.5 pt-3 border-t border-white/15">
              {user ? (
                <div className="flex items-center justify-between gap-3">
                  <div className="text-[12.5px] text-white/85">
                    <span className="font-bold text-white">Public Standings</span>
                    <span className="block text-[11.5px] text-white/65">
                      {isPublic
                        ? 'Other scholars can see your name & mastery score.'
                        : 'Hidden from other scholars.'}
                    </span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isPublic}
                    onClick={() => void handleSaveCampusAndSync(campusInput, !isPublic)}
                    className={`min-h-[36px] px-3.5 rounded-xl text-[12px] font-bold transition cursor-pointer whitespace-nowrap shrink-0 ${
                      isPublic
                        ? 'bg-emerald-400 text-[#0B1120]'
                        : 'bg-white/15 text-white hover:bg-white/25'
                    }`}
                  >
                    {isPublic ? 'Visible' : 'Private'}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => void signInWithGoogle()}
                  className="btn-tactile paper w-full justify-center min-h-[42px] text-[13.5px] whitespace-nowrap"
                >
                  <Icon name="shield" size={16} />
                  <span>Sign in with Google to Compete Live</span>
                </button>
              )}

              {syncNotice && (
                <p className="text-[12px] font-semibold text-[var(--hero-badge)] leading-snug">
                  {syncNotice}
                </p>
              )}
              {liveError && (
                <p className="text-[12px] font-semibold text-amber-200 leading-snug">
                  {liveError}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. TOP 3 PODIUM STAGE */}
      {topThree.length >= 3 && (
        <section aria-label="Top three scholars podium" className="grid grid-cols-1 min-[780px]:grid-cols-3 gap-4 items-end">
          {[topThree[1], topThree[0], topThree[2]].map((row) => {
            const isFirst = row.rank === 1;
            const isSecond = row.rank === 2;
            const accentColor = isFirst
              ? 'var(--gold)'
              : isSecond
                ? 'var(--ink)'
                : 'var(--coral-ink)';

            return (
              <button
                key={row.entry.uid}
                type="button"
                onClick={() =>
                  setCompareUid((prev) => (prev === row.entry.uid ? null : row.entry.uid))
                }
                className={`rtc-card text-left rounded-2xl p-5 flex flex-col gap-3 transition-transform hover:-translate-y-0.5 cursor-pointer ${
                  isFirst
                    ? 'border-[var(--acc-line)] bg-gradient-to-b from-[var(--acc-soft)]/50 via-[var(--card)] to-[var(--card)] min-[780px]:pb-7'
                    : ''
                } ${row.entry.isSelf ? 'ring-2 ring-[var(--gold)]/40' : ''}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-8 h-8 rounded-xl flex items-center justify-center font-[var(--display)] font-extrabold text-[14px] tabular-nums"
                      style={{
                        background: isFirst ? 'var(--gold)' : 'var(--bg)',
                        color: isFirst ? 'var(--on-acc)' : accentColor,
                      }}
                    >
                      #{row.rank}
                    </span>
                    <span className="text-[12px] font-bold text-[var(--dim)]">
                      {row.division.title}
                      {row.entry.isBenchmark ? ' · Standard' : row.entry.isSelf ? ' · You' : ''}
                    </span>
                  </div>
                  {isFirst && <Icon name="crown" size={18} className="text-[var(--gold)] shrink-0" />}
                </div>

                <div className="flex items-center gap-3 min-w-0">
                  <div
                    aria-hidden="true"
                    className="w-11 h-11 rounded-xl bg-[var(--bg)] border border-[var(--line)] font-[var(--display)] font-extrabold text-[16px] text-[var(--ink)] flex items-center justify-center shrink-0"
                  >
                    {row.entry.displayName.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-[var(--display)] font-bold text-[16px] text-[var(--ink)] truncate">
                      {row.entry.displayName}
                    </div>
                    <div className="text-[12.5px] text-[var(--dim)] truncate">
                      {row.entry.campusGoal || SUBJECT_INFO[row.entry.primarySubj].name}
                    </div>
                  </div>
                </div>

                <div className="flex items-baseline justify-between gap-2 pt-2 border-t border-[var(--line)]">
                  <div>
                    <div className="text-[11px] font-semibold text-[var(--dim)]">
                      {scoreColumnLabel}
                    </div>
                    <div className="font-[var(--display)] font-extrabold text-[24px] text-[var(--ink)] tabular-nums leading-tight">
                      {formatScoreDisplay(row.scoreValue)}
                    </div>
                  </div>
                  <div className="text-right text-[12px] font-semibold text-[var(--dim)] tabular-nums">
                    <span>{row.entry.topicsPassed} topics</span>
                    <span aria-hidden="true"> · </span>
                    <span>{row.entry.accuracyPct}% acc</span>
                  </div>
                </div>
              </button>
            );
          })}
        </section>
      )}

      {/* 3. HEAD-TO-HEAD COMPARISON DRAWER (WHEN A SCHOLAR OR BENCHMARK IS SELECTED) */}
      {activeCompareEntry && headToHead && activeCompareEntry.uid !== selfStanding.uid && (
        <section
          aria-label="Head to head comparison"
          className="rtc-card rounded-2xl border-[var(--acc-line)] p-5 flex flex-col gap-4"
        >
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <span className="eyebrow text-[var(--gold)]">Head-to-Head Comparison</span>
              <h2 className="h18 text-[var(--ink)]">
                {selfStanding.displayName} vs {activeCompareEntry.displayName}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenDuel}
                className="btn-tactile indigo min-h-[38px] text-[12.5px] px-3.5 whitespace-nowrap"
              >
                <Icon name="trophy" size={14} />
                <span>Start Peer Duel</span>
              </button>
              <button
                type="button"
                onClick={() => setCompareUid(null)}
                aria-label="Close comparison"
                className="btn-tactile paper min-h-[38px] text-[12.5px] px-3 whitespace-nowrap"
              >
                Close
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {headToHead.map((row) => {
              const ahead = row.delta > 0;
              const tied = row.delta === 0;
              return (
                <div
                  key={row.metric}
                  className="rounded-xl bg-[var(--bg)] p-3 flex flex-col gap-1"
                >
                  <span className="text-[11.5px] font-semibold text-[var(--dim)]">
                    {row.metric}
                  </span>
                  <div className="font-[var(--display)] font-extrabold text-[17px] text-[var(--ink)] tabular-nums">
                    {row.selfVal}
                    <span className="text-[12px] font-semibold text-[var(--dim)]">
                      {' '}vs {row.rivalVal}
                    </span>
                  </div>
                  <span
                    className={`text-[12px] font-bold tabular-nums ${
                      ahead
                        ? 'text-[var(--green)]'
                        : tied
                          ? 'text-[var(--dim)]'
                          : 'text-[var(--coral-ink)]'
                    }`}
                  >
                    {ahead
                      ? `+${row.delta} ahead`
                      : tied
                        ? 'Even'
                        : `${Math.abs(row.delta)} to catch`}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. FILTER TOOLBAR + RANKED STANDINGS TABLE */}
      <section className="rtc-card rounded-2xl p-5 sm:p-6 flex flex-col gap-4">
        {/* Ranking Criterion Segmented Controls + Search */}
        <div className="flex flex-col min-[900px]:flex-row min-[900px]:items-center justify-between gap-3">
          <div
            role="tablist"
            aria-label="Rank scholars by criterion"
            className="flex items-center gap-1 p-1 rounded-xl bg-[var(--bg)] border border-[var(--line)] overflow-x-auto"
          >
            {CRITERIA_TABS.map((tab) => {
              const active = criterion === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setCriterion(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-[12.5px] font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[var(--card)] text-[var(--ink)] shadow-xs border border-[var(--acc-line)]'
                      : 'text-[var(--dim)] hover:text-[var(--ink)]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scholar, campus, division…"
              aria-label="Search leaderboard"
              className="flex-1 min-w-[200px] rounded-xl bg-[var(--bg)] border border-[var(--line)] px-3.5 py-2 text-[13px] font-medium text-[var(--ink)] placeholder:text-[var(--dim)] focus:outline-none focus:border-[var(--acc-line)]"
            />
            <button
              type="button"
              onClick={() => setShowBenchmarks((v) => !v)}
              className={`min-h-[38px] px-3 rounded-xl border text-[12px] font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                showBenchmarks
                  ? 'bg-[var(--acc-soft)] border-[var(--acc-line)] text-[var(--gold)]'
                  : 'bg-[var(--bg)] border-[var(--line)] text-[var(--dim)] hover:text-[var(--ink)]'
              }`}
            >
              {showBenchmarks ? 'Cut-Offs: Shown' : 'Cut-Offs: Hidden'}
            </button>
          </div>
        </div>

        {/* 12-Subject Filter Strip */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSubjectFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              subjectFilter === 'all'
                ? 'bg-[var(--gold)] text-[var(--on-acc)]'
                : 'bg-[var(--bg)] text-[var(--dim)] hover:text-[var(--ink)]'
            }`}
          >
            All 12 Subjects
          </button>
          {SUBJECT_IDS.map((sid) => {
            const active = subjectFilter === sid;
            return (
              <button
                key={sid}
                type="button"
                onClick={() => {
                  setSubjectFilter(sid);
                  setCriterion('masteryIndex');
                }}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  active
                    ? 'bg-[var(--gold)] text-[var(--on-acc)]'
                    : 'bg-[var(--bg)] text-[var(--dim)] hover:text-[var(--ink)]'
                }`}
              >
                {SUBJECT_INFO[sid].short}
              </button>
            );
          })}
        </div>

        {/* Standings Table */}
        {liveLoading && liveEntries.length === 0 ? (
          <div className="py-10 text-center text-[13.5px] font-semibold text-[var(--dim)]">
            Loading live National Leaderboard standings…
          </div>
        ) : rankedRows.length === 0 ? (
          <div className="py-10 text-center flex flex-col items-center gap-2">
            <div className="font-[var(--display)] font-bold text-[16px] text-[var(--ink)]">
              No matching scholars found
            </div>
            <p className="text-[13px] text-[var(--dim)]">
              Try clearing your search filter or showing National Cut-Off Benchmarks.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-2 px-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--line)] text-[11.5px] font-bold text-[var(--dim)]">
                  <th className="py-2.5 pr-3 w-14">Rank</th>
                  <th className="py-2.5 pr-4">Scholar &amp; Goal</th>
                  <th className="py-2.5 pr-4 hidden md:table-cell">Division</th>
                  <th className="py-2.5 pr-4 text-right">{scoreColumnLabel}</th>
                  <th className="py-2.5 pr-4 text-right hidden sm:table-cell">Topics</th>
                  <th className="py-2.5 pr-4 text-right hidden sm:table-cell">Accuracy</th>
                  <th className="py-2.5 pr-4 text-right hidden lg:table-cell">Best CBT</th>
                  <th className="py-2.5 pr-3 text-right hidden lg:table-cell">Streak</th>
                  <th className="py-2.5 text-right w-24">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {rankedRows.map((row) => {
                  const isSelf = Boolean(row.entry.isSelf);
                  const isComparing = compareUid === row.entry.uid;
                  return (
                    <tr
                      key={row.entry.uid}
                      className={`transition-colors ${
                        isSelf
                          ? 'bg-[var(--acc-soft)]/55'
                          : isComparing
                            ? 'bg-[var(--bg)]'
                            : 'hover:bg-[var(--bg)]/60'
                      }`}
                    >
                      <td className="py-3.5 pr-3 font-[var(--display)] font-extrabold text-[15px] tabular-nums text-[var(--ink)]">
                        #{row.rank}
                      </td>
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            aria-hidden="true"
                            className={`w-9 h-9 rounded-xl font-[var(--display)] font-extrabold text-[14px] flex items-center justify-center shrink-0 ${
                              isSelf
                                ? 'bg-[var(--gold)] text-[var(--on-acc)]'
                                : 'bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)]'
                            }`}
                          >
                            {row.entry.displayName.slice(0, 1).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="font-[var(--display)] font-bold text-[14.5px] text-[var(--ink)] truncate">
                              {row.entry.displayName}
                              {isSelf && (
                                <span className="ml-2 text-[11.5px] font-bold text-[var(--gold)]">
                                  (You)
                                </span>
                              )}
                              {row.entry.isBenchmark && (
                                <span className="ml-2 text-[11.5px] font-semibold text-[var(--dim)]">
                                  · National Benchmark
                                </span>
                              )}
                            </div>
                            <div className="text-[12px] text-[var(--dim)] truncate">
                              {row.entry.campusGoal || SUBJECT_INFO[row.entry.primarySubj].name}
                              <span aria-hidden="true"> · </span>
                              {SUBJECT_INFO[row.entry.primarySubj].short}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4 hidden md:table-cell text-[12.5px] font-semibold text-[var(--dim)] whitespace-nowrap">
                        {row.division.title}
                      </td>
                      <td className="py-3.5 pr-4 text-right font-[var(--display)] font-extrabold text-[16px] text-[var(--gold)] tabular-nums whitespace-nowrap">
                        {formatScoreDisplay(row.scoreValue)}
                      </td>
                      <td className="py-3.5 pr-4 text-right hidden sm:table-cell text-[13.5px] font-bold text-[var(--ink)] tabular-nums">
                        {row.entry.topicsPassed}
                      </td>
                      <td className="py-3.5 pr-4 text-right hidden sm:table-cell text-[13.5px] font-bold text-[var(--green)] tabular-nums">
                        {row.entry.accuracyPct}%
                      </td>
                      <td className="py-3.5 pr-4 text-right hidden lg:table-cell text-[13.5px] font-semibold text-[var(--ink)] tabular-nums">
                        {row.entry.bestCbtScore}/400
                      </td>
                      <td className="py-3.5 pr-3 text-right hidden lg:table-cell text-[13px] font-bold text-[var(--coral-ink)] tabular-nums">
                        {row.entry.streakCount}d
                      </td>
                      <td className="py-3.5 text-right">
                        {isSelf ? (
                          <span className="text-[12px] font-bold text-[var(--gold)] whitespace-nowrap">
                            Your row
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              setCompareUid((prev) =>
                                prev === row.entry.uid ? null : row.entry.uid
                              )
                            }
                            className="text-[12.5px] font-bold text-[var(--gold)] hover:underline cursor-pointer whitespace-nowrap"
                          >
                            {isComparing ? 'Hide' : 'Compare'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* 5. TRANSPARENT 1,000-POINT MASTERY INDEX FORMULA & 5 ACADEMIC DIVISIONS */}
      <div className="grid grid-cols-1 min-[860px]:grid-cols-12 gap-5">
        <section className="min-[860px]:col-span-6 rtc-card rounded-2xl p-5 flex flex-col gap-3.5">
          <div>
            <span className="eyebrow text-[var(--gold)]">Transparent Merit Formula</span>
            <h2 className="h18 text-[var(--ink)]">How Your 1,000-Point Index Is Calculated</h2>
          </div>

          <div className="flex flex-col gap-3">
            {[
              {
                label: 'Topics Mastered (Topic Tests Passed)',
                val: selfBreakdown.topicsPoints,
                max: 400,
                hint: 'Pass 25 syllabus topics across your subjects for full 400',
              },
              {
                label: 'Weighted Exam Accuracy',
                val: selfBreakdown.accuracyPoints,
                max: 250,
                hint: 'Accuracy % scaled by question volume (full weight at 60+ answered)',
              },
              {
                label: 'Best JAMB / WAEC CBT Score',
                val: selfBreakdown.cbtPoints,
                max: 200,
                hint: 'Your highest timed CBT simulation scaled to 400',
              },
              {
                label: 'Daily Consistency & Peer Duels',
                val: selfBreakdown.consistencyPoints,
                max: 150,
                hint: 'Active study streak days + completed Peer Duels & Theory scripts',
              },
            ].map((item) => (
              <div key={item.label} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-[13px] font-bold text-[var(--ink)] tabular-nums">
                  <span>{item.label}</span>
                  <span className="text-[var(--gold)]">
                    {item.val} / {item.max}
                  </span>
                </div>
                <SmoothProgressBar
                  value={item.val}
                  max={item.max}
                  tone="indigo"
                  heightClass="h-1.5"
                  trackClass="bg-[var(--deep)]"
                />
                <span className="text-[11.5px] text-[var(--dim)]">{item.hint}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="min-[860px]:col-span-6 rtc-card rounded-2xl p-5 flex flex-col gap-3.5">
          <div>
            <span className="eyebrow text-[var(--gold)]">National Standing Tiers</span>
            <h2 className="h18 text-[var(--ink)]">5 Academic Divisions</h2>
          </div>

          <div className="divide-y divide-[var(--line)]">
            {LEADERBOARD_DIVISIONS.slice()
              .reverse()
              .map((div) => {
                const isCurrent = divisionInfo.current.id === div.id;
                const unlocked = selfStanding.masteryIndex >= div.minIndex;
                return (
                  <div
                    key={div.id}
                    className={`py-2.5 flex items-center justify-between gap-3 ${
                      isCurrent ? 'text-[var(--ink)]' : ''
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-[14px] font-[var(--display)] font-bold text-[var(--ink)]">
                        <span>{div.title}</span>
                        {isCurrent && (
                          <span className="text-[11.5px] font-bold text-[var(--gold)]">
                            · Current Division
                          </span>
                        )}
                      </div>
                      <div className="text-[12px] text-[var(--dim)]">{div.tagline}</div>
                    </div>
                    <div className="text-right shrink-0 tabular-nums">
                      <div
                        className={`font-[var(--display)] font-extrabold text-[14px] ${
                          unlocked ? 'text-[var(--green)]' : 'text-[var(--dim)]'
                        }`}
                      >
                        {div.minIndex}+
                      </div>
                      <div className="text-[11px] font-semibold text-[var(--dim)]">
                        {unlocked ? 'Reached' : `${div.minIndex - selfStanding.masteryIndex} away`}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </section>
      </div>
    </div>
  );
}
