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
  getNationalDivisionBenchmarks,
  getStandingElementalRank,
  rankLeaderboardEntries,
  sanitizeCampusGoal,
  type LeaderboardCriterion,
  type LeaderboardStanding,
} from '../../utils/leaderboardLogic';
import { AnimatedNumber } from '../AnimatedNumber';
import {
  ElementalClimbSpine,
  ElementalEmblem,
  ElementalHeadingIndicator,
} from '../ElementalRankVisuals';
import { Icon } from '../Icons';
import { SubscreenTopBar } from '../AppShell';
import { getVisibleEnrolledSubjects } from '../../utils/examTrackLogic';
import { LiquidCapsuleBar, SmoothCollapse, SmoothProgressBar, SmoothViewSwitch } from '../ULessonMotion';

const CRITERIA_TABS: { id: LeaderboardCriterion; label: string; short: string; unit: string }[] = [
  { id: 'masteryIndex', label: 'Rank points', short: 'RP', unit: 'RP' },
  { id: 'topicsPassed', label: 'Topics passed', short: 'Topics', unit: 'topics' },
  { id: 'accuracyPct', label: 'Accuracy', short: 'Accuracy', unit: '%' },
  { id: 'bestCbtScore', label: 'Best mock', short: 'Mock', unit: '/400' },
  { id: 'streakCount', label: 'Streak', short: 'Streak', unit: 'd' },
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

  const selfElemental = useMemo(
    () => getStandingElementalRank(selfStanding),
    [selfStanding]
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
      setSyncNotice('Saved on this phone. Sign in to appear on live standings.');
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
          ? 'Your rank standing is live.'
          : 'Profile set to private.'
        : 'Saved locally — server sync will retry.'
    );
  };

  const handleCopyInvite = () => {
    const url = typeof window !== 'undefined' ? window.location.origin : '';
    const msg = `Climb Easy Learn Elemental Ranks with me! Current rank: ${selfElemental.currentLabel}${
      selfElemental.nextLabel ? ` → Heading to ${selfElemental.nextLabel}` : ''
    } (${selfStanding.masteryIndex} RP). Join here: ${url}`;
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
    return `${val} RP`;
  };

  const scoreColumnLabel =
    subjectFilter !== 'all' && criterion === 'masteryIndex'
      ? `${SUBJECT_INFO[subjectFilter].short} Mastery`
      : activeCriterionMeta.label;

  return (
    <div className="flex flex-col gap-5 anim-rise">
      <SubscreenTopBar
        title="Leaderboard"
        subtitle={
          user
            ? `Elemental standings · ${liveScholarCount} active student${liveScholarCount === 1 ? '' : 's'}`
            : 'Elemental rank climb · Sign in to compete live'
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
              {copiedInvite ? 'Invite copied' : 'Invite friends'}
            </span>
            <span className="sm:hidden">{copiedInvite ? 'Copied' : 'Invite'}</span>
          </button>
        }
      />

      {/* 1. FOCAL HERO: YOUR ELEMENTAL RANK, HEADING-TO TARGET & PROFILE */}
      <section className="rtc-eq-plate rounded-[24px] p-4 sm:p-6 text-white">
        <div className="relative z-10 grid grid-cols-1 min-[920px]:grid-cols-12 gap-5 items-stretch">
          {/* Left: Current Elemental Emblem -> Next Element Climb */}
          <div className="min-[920px]:col-span-7 flex flex-col justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <ElementalEmblem
                rankId={selfElemental.currentRank?.id || null}
                unlocked={Boolean(selfElemental.currentRank)}
                size={68}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-[12px] font-bold text-white/85 flex-wrap">
                  <span>{selfElemental.currentLabel}</span>
                  <span aria-hidden="true" className="opacity-50">·</span>
                  <span className="text-white/80 font-semibold truncate">
                    {selfStanding.campusGoal || 'Scholar'}
                  </span>
                </div>

                <div className="flex items-baseline gap-3 flex-wrap mt-0.5">
                  <div className="font-[var(--display)] font-extrabold text-[34px] sm:text-[42px] leading-none tracking-tight tabular-nums text-white">
                    <AnimatedNumber value={selfStanding.masteryIndex} />
                    <span className="text-[15px] sm:text-[17px] font-bold text-white/65 ml-1">
                      RP
                    </span>
                  </div>
                  {selfRow && (
                    <span className="text-[13px] font-bold text-[var(--hero-badge)] tabular-nums">
                      #{selfRow.rank} of {fullUnfilteredRows.length}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Heading To Next Element Strip */}
            <div className="rounded-2xl bg-black/25 border border-white/15 p-3.5 flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  {selfElemental.nextRank ? (
                    <>
                      <ElementalEmblem rankId={selfElemental.nextRank.id} unlocked size={32} />
                      <div className="min-w-0">
                        <div className="text-[12.5px] font-extrabold text-white truncate">
                          Heading to {selfElemental.nextLabel}
                        </div>
                        <div className="text-[11px] font-semibold text-white/70 tabular-nums truncate">
                          Need {selfElemental.nextRank.minRp} RP · {selfElemental.nextRank.minAccuracyPct}%+ acc · {selfElemental.nextRank.minTopicsPassed} topics
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-[13px] font-extrabold text-amber-300">
                      Solar Apex Reached — Defend #1
                    </div>
                  )}
                </div>
                <span className="font-[var(--display)] font-extrabold text-[15px] text-[var(--hero-badge)] tabular-nums shrink-0">
                  {selfElemental.progressToNextPct}%
                </span>
              </div>

              <SmoothProgressBar
                value={selfElemental.progressToNextPct}
                max={100}
                tone="gold"
                heightClass="h-2"
                trackClass="bg-white/15"
                ariaLabel="Progress toward next Elemental rank"
              />
            </div>

            {/* 4-Metric Smartness Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-white/15">
              <div>
                <div className="text-[11px] font-semibold text-white/65">Topics Passed</div>
                <div className="font-[var(--display)] font-extrabold text-[18px] tabular-nums">
                  {selfStanding.topicsPassed}
                </div>
              </div>
              <div>
                <div className="text-[11px] font-semibold text-white/65">Accuracy</div>
                <div className="font-[var(--display)] font-extrabold text-[18px] tabular-nums">
                  {selfStanding.accuracyPct}%
                </div>
              </div>
              <div>
                <div className="text-[11px] font-semibold text-white/65">Best Mock</div>
                <div className="font-[var(--display)] font-extrabold text-[18px] tabular-nums">
                  {selfStanding.bestCbtScore}/400
                </div>
              </div>
              <div>
                <div className="text-[11px] font-semibold text-white/65">Streak</div>
                <div className="font-[var(--display)] font-extrabold text-[18px] tabular-nums">
                  {selfStanding.streakCount}d
                </div>
              </div>
            </div>

            {/* Direct Climb CTAs */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onOpenCbt}
                className="btn-tactile paper min-h-[40px] px-3.5 text-[13px] whitespace-nowrap"
              >
                <Icon name="clock" size={15} />
                <span>Boost Mock</span>
              </button>
              <button
                type="button"
                onClick={onOpenTopics}
                className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 rounded-xl bg-white/12 hover:bg-white/20 text-white font-bold text-[13px] transition-colors cursor-pointer whitespace-nowrap"
              >
                <Icon name="map" size={15} />
                <span>Pass Topic Test</span>
              </button>
              <button
                type="button"
                onClick={onOpenDuel}
                className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 rounded-xl bg-white/12 hover:bg-white/20 text-white font-bold text-[13px] transition-colors cursor-pointer whitespace-nowrap"
              >
                <Icon name="trophy" size={15} />
                <span>Peer Duel</span>
              </button>
            </div>
          </div>

          {/* Right: Competitor Profile & Live Cloud Join Panel */}
          <div className="min-[920px]:col-span-5 rounded-2xl bg-black/25 border border-white/15 p-4 flex flex-col justify-between gap-3.5">
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[12px] font-bold tracking-wide text-[var(--hero-badge)]">
                  Competitor Profile
                </span>
                <span className="text-[12px] font-semibold text-white/80 truncate max-w-[140px]">
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
                    className="flex-1 min-w-0 rounded-xl bg-white/10 border border-white/20 px-3 py-2 text-[13px] font-semibold text-white placeholder:text-white/45 focus:outline-none focus:border-[var(--hero-badge)]"
                  />
                  <button
                    type="button"
                    onClick={() => void handleSaveCampusAndSync()}
                    disabled={syncBusy}
                    className="min-h-[38px] px-3.5 rounded-xl bg-white hover:bg-slate-100 text-[#141C33] font-[var(--display)] font-extrabold text-[12.5px] shadow-sm transition cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-60"
                  >
                    {syncBusy ? 'Saving…' : 'Save'}
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
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer whitespace-nowrap ${
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

            <div className="flex flex-col gap-2 pt-3 border-t border-white/15">
              {user ? (
                <div className="flex items-center justify-between gap-3">
                  <div className="text-[12px] text-white/85">
                    <span className="font-bold text-white">Public Standings</span>
                    <span className="block text-[11px] text-white/65">
                      {isPublic ? 'Visible on board' : 'Hidden from board'}
                    </span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isPublic}
                    onClick={() => void handleSaveCampusAndSync(campusInput, !isPublic)}
                    className={`min-h-[34px] px-3 rounded-xl text-[12px] font-bold transition cursor-pointer whitespace-nowrap shrink-0 ${
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
                  className="btn-tactile paper w-full justify-center min-h-[40px] text-[13px] whitespace-nowrap"
                >
                  <Icon name="shield" size={15} />
                  <span>Sign in with Google to Compete Live</span>
                </button>
              )}

              {syncNotice && (
                <p className="text-[11.5px] font-semibold text-[var(--hero-badge)] leading-snug">
                  {syncNotice}
                </p>
              )}
              {liveError && (
                <p className="text-[11.5px] font-semibold text-amber-200 leading-snug">
                  {liveError}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. TOP 3 PODIUM STAGE WITH ELEMENTAL EMBLEMS & HEADING-TO RANK */}
      {topThree.length >= 3 && (
        <section
          aria-label="Top three scholars podium"
          className="grid grid-cols-1 min-[780px]:grid-cols-3 gap-3.5 items-end"
        >
          {[topThree[1], topThree[0], topThree[2]].map((row) => {
            const isFirst = row.rank === 1;
            const isSecond = row.rank === 2;
            const rankBadgeCls = isFirst
              ? 'bg-[var(--gold)] text-[var(--on-acc)]'
              : isSecond
                ? 'bg-[var(--bg)] text-[var(--ink)]'
                : 'bg-[var(--bg)] text-[var(--coral-ink)]';

            return (
              <button
                key={row.entry.uid}
                type="button"
                onClick={() =>
                  setCompareUid((prev) => (prev === row.entry.uid ? null : row.entry.uid))
                }
                className={`rtc-card text-left rounded-2xl p-4 flex flex-col gap-2.5 cursor-pointer ${
                  isFirst
                    ? 'border-[var(--acc-line)] bg-gradient-to-b from-[var(--acc-soft)]/50 via-[var(--card)] to-[var(--card)] min-[780px]:pb-5'
                    : ''
                } ${row.entry.isSelf ? 'ring-2 ring-[var(--gold)]/40' : ''}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-[var(--display)] font-extrabold text-[13px] tabular-nums shrink-0 ${rankBadgeCls}`}
                    >
                      #{row.rank}
                    </span>
                    <ElementalHeadingIndicator standing={row.elemental} compact />
                  </div>
                  {isFirst && <Icon name="crown" size={17} className="text-[var(--gold)] shrink-0" />}
                </div>

                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="min-w-0 flex-1">
                    <div className="font-[var(--display)] font-bold text-[15px] text-[var(--ink)] truncate">
                      {row.entry.displayName}
                      {row.entry.isSelf ? ' · You' : ''}
                    </div>
                    <div className="text-[12px] text-[var(--dim)] truncate">
                      {row.entry.campusGoal || SUBJECT_INFO[row.entry.primarySubj].name}
                    </div>
                  </div>
                </div>

                <div className="flex items-baseline justify-between gap-2 pt-2 border-t border-[var(--line)]">
                  <div className="font-[var(--display)] font-extrabold text-[20px] text-[var(--ink)] tabular-nums leading-tight">
                    {formatScoreDisplay(row.scoreValue)}
                  </div>
                  <div className="text-right text-[11.5px] font-semibold text-[var(--dim)] tabular-nums">
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

      {/* 3. HEAD-TO-HEAD COMPARISON DRAWER */}
      <SmoothCollapse
        open={Boolean(activeCompareEntry && headToHead && activeCompareEntry.uid !== selfStanding.uid)}
      >
        {activeCompareEntry && headToHead && activeCompareEntry.uid !== selfStanding.uid && (
          <SmoothViewSwitch viewKey={activeCompareEntry.uid}>
            <section
              aria-label="Head to head comparison"
              className="rtc-card rounded-2xl border-[var(--acc-line)] p-4 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <span className="eyebrow text-[var(--gold)]">Head-to-Head</span>
                  <h2 className="h18 text-[var(--ink)]">
                    {selfStanding.displayName} vs {activeCompareEntry.displayName}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onOpenDuel}
                    className="btn-tactile indigo min-h-[36px] text-[12px] px-3 whitespace-nowrap"
                  >
                    <Icon name="trophy" size={14} />
                    <span>Peer Duel</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCompareUid(null)}
                    aria-label="Close comparison"
                    className="btn-tactile paper min-h-[36px] text-[12px] px-3 whitespace-nowrap"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {headToHead.map((row) => {
                  const ahead = row.delta > 0;
                  const tied = row.delta === 0;
                  return (
                    <div
                      key={row.metric}
                      className="rounded-xl bg-[var(--bg)] p-2.5 flex flex-col gap-0.5"
                    >
                      <span className="text-[11px] font-semibold text-[var(--dim)]">{row.metric}</span>
                      <div className="font-[var(--display)] font-extrabold text-[15.5px] text-[var(--ink)] tabular-nums">
                        {row.selfVal}
                        <span className="text-[11.5px] font-semibold text-[var(--dim)]">
                          {' '}vs {row.rivalVal}
                        </span>
                      </div>
                      <span
                        className={`text-[11.5px] font-bold tabular-nums ${
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
                            : `${Math.abs(row.delta)} behind`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          </SmoothViewSwitch>
        )}
      </SmoothCollapse>

      {/* 4. FILTER TOOLBAR + ELEMENTAL RANKED STANDINGS TABLE */}
      <section className="rtc-card rounded-2xl p-4 sm:p-5 flex flex-col gap-3.5">
        {/* Ranking Criterion Segmented Controls + Search */}
        <div className="flex flex-col min-[900px]:flex-row min-[900px]:items-center justify-between gap-2.5">
          <LiquidCapsuleBar
            roleType="tablist"
            size="sm"
            ariaLabel="Rank scholars by criterion"
            items={CRITERIA_TABS.map((tab) => ({ id: tab.id, label: tab.label }))}
            value={criterion}
            onChange={setCriterion}
          />

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scholar, campus, element…"
              aria-label="Search leaderboard"
              className="flex-1 min-w-[180px] rounded-xl bg-[var(--bg)] border border-[var(--line)] px-3 py-2 text-[13px] font-medium text-[var(--ink)] placeholder:text-[var(--dim)] focus:outline-none focus:border-[var(--acc-line)]"
            />
            <button
              type="button"
              onClick={() => setShowBenchmarks((v) => !v)}
              className={`min-h-[36px] px-3 rounded-xl border text-[12px] font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                showBenchmarks
                  ? 'bg-[var(--acc-soft)] border-[var(--acc-line)] text-[var(--gold)]'
                  : 'bg-[var(--bg)] border-[var(--line)] text-[var(--dim)] hover:text-[var(--ink)]'
              }`}
            >
              {showBenchmarks ? 'Gates: Shown' : 'Gates: Hidden'}
            </button>
          </div>
        </div>

        {/* Compact Subject Filter Bar */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSubjectFilter('all')}
            className={`px-2.5 py-1.5 rounded-lg text-[12px] font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              subjectFilter === 'all'
                ? 'bg-[var(--gold)] text-[var(--on-acc)]'
                : 'bg-[var(--bg)] text-[var(--dim)] hover:text-[var(--ink)]'
            }`}
          >
            All subjects
          </button>
          {getVisibleEnrolledSubjects(progress)
            .slice(0, 5)
            .map((sid) => {
              const active = subjectFilter === sid;
              return (
                <button
                  key={sid}
                  type="button"
                  onClick={() => {
                    setSubjectFilter(sid);
                    setCriterion('masteryIndex');
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-[12px] font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    active
                      ? 'bg-[var(--gold)] text-[var(--on-acc)]'
                      : 'bg-[var(--bg)] text-[var(--dim)] hover:text-[var(--ink)]'
                  }`}
                >
                  {SUBJECT_INFO[sid].short}
                </button>
              );
            })}
          <select
            aria-label="Filter leaderboard by any subject"
            value={subjectFilter}
            onChange={(e) => {
              const next = e.target.value as 'all' | SubjectId;
              setSubjectFilter(next);
              if (next !== 'all') setCriterion('masteryIndex');
            }}
            className="min-h-[32px] px-2.5 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-[12px] font-bold text-[var(--ink)] cursor-pointer focus:outline-none focus:border-[var(--gold)]"
          >
            <option value="all">All 49 subjects</option>
            {SUBJECT_IDS.map((sid) => (
              <option key={sid} value={sid}>
                {SUBJECT_INFO[sid].name}
              </option>
            ))}
          </select>
        </div>

        {/* Standings Table — Every Row Shows Current Element & Which Element They Are Heading To */}
        {liveLoading && liveEntries.length === 0 ? (
          <div className="py-8 text-center text-[13px] font-semibold text-[var(--dim)]">
            Loading live Elemental standings…
          </div>
        ) : rankedRows.length === 0 ? (
          <div className="py-8 text-center flex flex-col items-center gap-1.5">
            <div className="font-[var(--display)] font-bold text-[15px] text-[var(--ink)]">
              No matching scholars found
            </div>
            <p className="text-[12.5px] text-[var(--dim)]">
              Clear search or toggle Gates: Shown.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-2 px-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--line)] text-[11px] font-bold text-[var(--dim)]">
                  <th className="py-2 pr-2.5 w-11">#</th>
                  <th className="py-2 pr-3">Scholar</th>
                  <th className="py-2 pr-3 hidden md:table-cell">Element → Heading To</th>
                  <th className="py-2 pr-3 text-right">{scoreColumnLabel}</th>
                  <th className="py-2 pr-3 text-right hidden sm:table-cell">Accuracy</th>
                  <th className="py-2 pr-3 text-right hidden lg:table-cell">Topics</th>
                  <th className="py-2 text-right w-18">Compare</th>
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
                      <td className="py-3 pr-2.5 font-[var(--display)] font-extrabold text-[14px] tabular-nums text-[var(--ink)]">
                        #{row.rank}
                      </td>
                      <td className="py-3 pr-3">
                        <div className="flex flex-col gap-1 min-w-0">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-[var(--display)] font-bold text-[14px] text-[var(--ink)] truncate">
                              {row.entry.displayName}
                            </span>
                            {isSelf && (
                              <span className="text-[11px] font-bold text-[var(--gold)] shrink-0">
                                You
                              </span>
                            )}
                            {row.entry.isBenchmark && (
                              <span className="text-[11px] font-semibold text-[var(--dim)] shrink-0">
                                · Gate
                              </span>
                            )}
                          </div>
                          <div className="text-[11.5px] text-[var(--dim)] truncate">
                            {row.entry.campusGoal || SUBJECT_INFO[row.entry.primarySubj].short}
                          </div>
                          {/* Mobile inline Element -> Heading To */}
                          <div className="md:hidden pt-0.5">
                            <ElementalHeadingIndicator standing={row.elemental} compact />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-3 hidden md:table-cell whitespace-nowrap">
                        <ElementalHeadingIndicator standing={row.elemental} />
                      </td>
                      <td className="py-3 pr-3 text-right font-[var(--display)] font-extrabold text-[15px] text-[var(--gold)] tabular-nums whitespace-nowrap">
                        {formatScoreDisplay(row.scoreValue)}
                      </td>
                      <td className="py-3 pr-3 text-right hidden sm:table-cell text-[13px] font-bold text-[var(--green)] tabular-nums">
                        {row.entry.accuracyPct}%
                      </td>
                      <td className="py-3 pr-3 text-right hidden lg:table-cell text-[13px] font-bold text-[var(--ink)] tabular-nums">
                        {row.entry.topicsPassed}
                      </td>
                      <td className="py-3 text-right">
                        {isSelf ? (
                          <span className="text-[11.5px] font-bold text-[var(--gold)] whitespace-nowrap">
                            You
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              setCompareUid((prev) =>
                                prev === row.entry.uid ? null : row.entry.uid
                              )
                            }
                            className="text-[12px] font-bold text-[var(--gold)] hover:underline cursor-pointer whitespace-nowrap"
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

      {/* 5. ASCENDING ELEMENTAL CLIMB SPINE + COMPACT RP BREAKDOWN */}
      <div className="grid grid-cols-1 min-[860px]:grid-cols-12 gap-4 items-start">
        <div className="min-[860px]:col-span-7">
          <ElementalClimbSpine standing={selfElemental} />
        </div>

        <section className="min-[860px]:col-span-5 rtc-card rounded-2xl p-4 sm:p-5 flex flex-col gap-3">
          <div>
            <span className="eyebrow text-[var(--gold)]">Smartness Weighting</span>
            <h2 className="h18 text-[var(--ink)]">Rank Points (1,000 RP)</h2>
          </div>

          <div className="flex flex-col gap-2.5">
            {[
              {
                label: 'Syllabus Topics Passed',
                val: selfBreakdown.topicsPoints,
                max: 420,
              },
              {
                label: 'Precision Accuracy Curve',
                val: selfBreakdown.accuracyPoints,
                max: 320,
              },
              {
                label: 'Best Mock Score (/400)',
                val: selfBreakdown.cbtPoints,
                max: 180,
              },
              {
                label: 'Streak & Peer Duels',
                val: selfBreakdown.consistencyPoints,
                max: 80,
              },
            ].map((item) => (
              <div key={item.label} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-[12.5px] font-bold text-[var(--ink)] tabular-nums">
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
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
