import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import type { SubjectId, UserProgress } from '../../types';
import { getTopics } from '../../data/curriculum';
import { SUBJECT_INFO, today } from '../../utils/engine';
import { getVisibleEnrolledSubjects } from '../../utils/examTrackLogic';
import { triggerLightHaptic } from '../../utils/readingComfortLogic';
import { sfx, type SoundEffectName } from '../../utils/sound';
import {
  EQUIPMENT_CATALOG,
  EXPLORER_ROLES,
  GUILD_DIRECTORY,
  GUILD_PEER_ROSTER,
  SAFE_GUILD_CHEERS,
  SKILL_TREE_NODES,
  calculateMissionMasteryReward,
  canUnlockSkillNode,
  computeUniverseLevelSummary,
  evaluateDailyUniverseQuests,
  formatSafeGuildDisplayName,
  loadUniverseProfile,
  muteOrReportGuildPeer,
  pickWeakTopicForCompanionAdventure,
  saveUniverseProfile,
  type EmblemId,
  type ExplorerRole,
  type GuildId,
  type HeadgearId,
  type MissionEvaluationResult,
  type OutfitColorId,
  type SkillNodeId,
  type UniverseProfile,
} from '../../utils/learningUniverseLogic';
import {
  buildDynamicTopicMission,
  getPlayableWorldForSubject,
  universeSanctumArt,
  type SubjectWorldDef,
  type UniverseMission,
  type WorldBossEncounter,
} from '../../data/learningUniverseWorlds';
import { ExplorerAvatarSvg, UniverseStageSimulation } from '../universe/UniverseSimulations';
import { Icon } from '../Icons';
import { SmoothProgressBar } from '../ULessonMotion';

const LazyCirculatoryAdventure3D = React.lazy(() =>
  import('../universe/CirculatoryAdventure3D').then((m) => ({
    default: m.CirculatoryAdventure3D,
  }))
);

type UniverseHubTab = 'worlds' | 'character' | 'guilds';
type MissionStageIndex = 1 | 2 | 3 | 4 | 'victory';

export function UniverseScreen({
  progress,
  onAwardUniverseXp,
  onSelectSubject,
  onOpenTopicNotes,
  onOpenCbt,
  onOpenDuel,
  onOpenLab,
  onBackHome,
}: {
  progress: UserProgress;
  onAwardUniverseXp: (xpDelta: number, solvedQuestionCount: number, label?: string) => void;
  onSelectSubject: (s: SubjectId) => void;
  onOpenTopicNotes: (subj: SubjectId, topicId?: string) => void;
  onOpenCbt: () => void;
  onOpenDuel: () => void;
  onOpenLab?: () => void;
  onBackHome: () => void;
}) {
  const [profile, setProfile] = useState<UniverseProfile>(() => loadUniverseProfile());
  const [hubTab, setHubTab] = useState<UniverseHubTab>('worlds');
  const [selectedWorldId, setSelectedWorldId] = useState<SubjectId | null>(null);
  const [activeMission, setActiveMission] = useState<UniverseMission | null>(null);
  const [showCirculatory3D, setShowCirculatory3D] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('adventure') === 'heart';
  });
  const [autostart3D] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('autostart') === '1';
  });
  const [missionStage, setMissionStage] = useState<MissionStageIndex>(1);
  const [heroArtFailed, setHeroArtFailed] = useState(false);
  const [failedWorldArt, setFailedWorldArt] = useState<Record<string, boolean>>({});

  // Stage 2, 3, 4 interactive state
  const [simCompleted, setSimCompleted] = useState(false);
  const [decisionPick, setDecisionPick] = useState<number | null>(null);
  const [decisionSubmitted, setDecisionSubmitted] = useState(false);
  const [decisionSolved, setDecisionSolved] = useState(false);
  const [decisionWrongCount, setDecisionWrongCount] = useState(0);
  const [showDecisionHint, setShowDecisionHint] = useState(false);

  const [appPick, setAppPick] = useState<number | null>(null);
  const [appSolved, setAppSolved] = useState(false);
  const [appWrongCount, setAppWrongCount] = useState(0);
  const [appFeedback, setAppFeedback] = useState<string | null>(null);

  const [tbPick, setTbPick] = useState<number | null>(null);
  const [tbSolved, setTbSolved] = useState(false);
  const [tbWrongCount, setTbWrongCount] = useState(0);
  const [tbFeedback, setTbFeedback] = useState<string | null>(null);

  const [missionSummary, setMissionSummary] = useState<MissionEvaluationResult | null>(null);

  // World Boss Encounter state
  const [activeBoss, setActiveBoss] = useState<WorldBossEncounter | null>(null);
  const [bossIdx, setBossIdx] = useState(0);
  const [bossShields, setBossShields] = useState(3);
  const [bossMaxShields, setBossMaxShields] = useState(3);
  const [bossHits, setBossHits] = useState(0);
  const [bossPick, setBossPick] = useState<number | null>(null);
  const [bossAnswered, setBossAnswered] = useState(false);
  const [bossFinished, setBossFinished] = useState<'won' | 'lost' | null>(null);

  // Personalised Topic Adventure Builder state
  const [builderSubj, setBuilderSubj] = useState<SubjectId>(() => progress.subj || 'bio');
  const builderTopics = useMemo(() => getTopics(builderSubj), [builderSubj]);
  const weakRescueForBuilder = useMemo(() => {
    const world = getPlayableWorldForSubject(builderSubj, progress);
    return pickWeakTopicForCompanionAdventure(
      builderSubj,
      builderTopics,
      progress,
      world.companionName
    );
  }, [builderSubj, builderTopics, progress]);

  const [builderTopicId, setBuilderTopicId] = useState<string>('');
  const [isGeneratingAdventure, setIsGeneratingAdventure] = useState(false);
  const [adventureNotice, setAdventureNotice] = useState<string | null>(null);

  // Guild feedback notice
  const [guildNotice, setGuildNotice] = useState<string | null>(null);

  useEffect(() => {
    if (weakRescueForBuilder?.topicId) {
      setBuilderTopicId(weakRescueForBuilder.topicId);
    } else if (builderTopics[0]?.id) {
      setBuilderTopicId(builderTopics[0].id);
    }
  }, [weakRescueForBuilder?.topicId, builderTopics]);

  const updateProfile = (updater: (prev: UniverseProfile) => UniverseProfile) => {
    setProfile((prev) => {
      const next = updater(prev);
      saveUniverseProfile(next);
      return next;
    });
  };

  const playFx = (name: SoundEffectName) => {
    sfx(name, progress.muted);
  };

  const levelSummary = useMemo(
    () => computeUniverseLevelSummary(progress.xp, profile),
    [progress.xp, profile]
  );

  const curDay = today();
  const dailyQuests = useMemo(
    () => evaluateDailyUniverseQuests(profile, progress, curDay),
    [profile, progress, curDay]
  );

  const worldSubjectIds = useMemo(() => {
    const coreOrder: SubjectId[] = ['bio', 'chem', 'phys', 'maths', 'eng'];
    const enrolled = getVisibleEnrolledSubjects(progress);
    const merged: SubjectId[] = [...coreOrder];
    for (const sid of enrolled) {
      if (!merged.includes(sid)) merged.push(sid);
    }
    return merged;
  }, [progress]);

  const worldCards = useMemo(
    () => worldSubjectIds.map((sid) => getPlayableWorldForSubject(sid, progress)),
    [worldSubjectIds, progress]
  );

  const activeWorld: SubjectWorldDef | null = useMemo(() => {
    if (!selectedWorldId) return null;
    return getPlayableWorldForSubject(selectedWorldId, progress);
  }, [selectedWorldId, progress]);

  const startMission = (mission: UniverseMission, worldId: SubjectId) => {
    triggerLightHaptic(10);
    playFx('tap');
    setSelectedWorldId(worldId);
    onSelectSubject(worldId);
    setActiveBoss(null);

    if (
      mission.id === 'bio-heart-failing' ||
      mission.stage2Explore.simulationKind === 'heart_circulation'
    ) {
      setActiveMission(null);
      setShowCirculatory3D(true);
      return;
    }

    setActiveMission(mission);
    setMissionStage(1);
    setSimCompleted(false);
    setDecisionPick(null);
    setDecisionSubmitted(false);
    setDecisionSolved(false);
    setDecisionWrongCount(0);
    setShowDecisionHint(false);
    setAppPick(null);
    setAppSolved(false);
    setAppWrongCount(0);
    setAppFeedback(null);
    setTbPick(null);
    setTbSolved(false);
    setTbWrongCount(0);
    setTbFeedback(null);
    setMissionSummary(null);
  };

  const handleCompleteCirculatory3D = (
    xpEarned: number,
    masteryAccuracyPct: number,
    rankTitle: string
  ) => {
    const prevRec = profile.completedMissions['bio-heart-failing'];
    const hasGuildVanguard = profile.unlockedSkills.includes('guild_vanguard');
    const netNewXp = Math.max(0, xpEarned - (prevRec?.xpEarned || 0));

    if (netNewXp > 0 || !prevRec) {
      onAwardUniverseXp(netNewXp > 0 ? netNewXp : 35, 4, 'Voyage Through the Living Heart');
    }

    updateProfile((prev) => {
      const oldRec = prev.completedMissions['bio-heart-failing'];
      const bestAcc = Math.max(oldRec?.bestAccuracyPct || 0, masteryAccuracyPct);
      const bestXp = Math.max(oldRec?.xpEarned || 0, xpEarned);
      const nextEquip = prev.unlockedEquipment.includes('bio-pulse-scanner')
        ? prev.unlockedEquipment
        : [...prev.unlockedEquipment, 'bio-pulse-scanner'];
      const guildGain = Math.round((netNewXp > 0 ? netNewXp : 35) * (hasGuildVanguard ? 1.25 : 1));

      return {
        ...prev,
        activeTitle: rankTitle || prev.activeTitle,
        unlockedEquipment: nextEquip,
        equippedRelic: prev.equippedRelic || 'bio-pulse-scanner',
        guildContributionXp: prev.guildContributionXp + guildGain,
        completedMissions: {
          ...prev.completedMissions,
          'bio-heart-failing': {
            bestAccuracyPct: bestAcc,
            xpEarned: bestXp,
            attempts: (oldRec?.attempts || 0) + 1,
            firstTryDecision: masteryAccuracyPct >= 90 || Boolean(oldRec?.firstTryDecision),
            unlockedTitle: rankTitle,
            completedDay: curDay,
          },
        },
      };
    });
  };

  const handleGeneratePersonalisedAdventure = async () => {
    const chosenTopic =
      builderTopics.find((t) => t.id === builderTopicId) || builderTopics[0];
    if (!chosenTopic) return;

    triggerLightHaptic(12);
    setIsGeneratingAdventure(true);
    setAdventureNotice(null);

    const targetWorld = getPlayableWorldForSubject(builderSubj, progress);

    try {
      const resp = await fetch('/api/universe/adventure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: builderSubj,
          topicName: chosenTopic.name,
          sectionName: chosenTopic.sec,
          examTrap: chosenTopic.trap,
          classLevel: 'SS1-SS3',
        }),
      });

      if (resp.ok) {
        const data = (await resp.json()) as { mission?: UniverseMission };
        if (data?.mission && data.mission.title && data.mission.stage3Decision?.options?.length) {
          const generated: UniverseMission = {
            ...data.mission,
            worldId: builderSubj,
            linkedTopicId: chosenTopic.id,
          };
          setIsGeneratingAdventure(false);
          startMission(generated, builderSubj);
          return;
        }
      }

      // Seamless curriculum-grounded fallback when offline or service quota reached
      const fallbackMission = buildDynamicTopicMission(
        builderSubj,
        chosenTopic,
        targetWorld.companionName,
        'Personalised Mission',
        true
      );
      setIsGeneratingAdventure(false);
      startMission(fallbackMission, builderSubj);
    } catch {
      const fallbackMission = buildDynamicTopicMission(
        builderSubj,
        chosenTopic,
        targetWorld.companionName,
        'Personalised Mission',
        true
      );
      setIsGeneratingAdventure(false);
      startMission(fallbackMission, builderSubj);
    }
  };

  const handleSubmitDecision = () => {
    if (!activeMission || decisionPick === null) return;
    triggerLightHaptic(10);
    setDecisionSubmitted(true);
    if (decisionPick === activeMission.stage3Decision.correctIndex) {
      setDecisionSolved(true);
      playFx('right');
    } else {
      setDecisionWrongCount((c) => c + 1);
      setShowDecisionHint(true);
      playFx('wrong');
    }
  };

  const handleCheckApplication = (idx: number) => {
    if (!activeMission || appSolved) return;
    triggerLightHaptic(8);
    setAppPick(idx);
    const ch = activeMission.stage4Complete.applicationChallenge;
    if (idx === ch.correctIndex) {
      setAppSolved(true);
      setAppFeedback(ch.explanation);
      playFx('right');
    } else {
      setAppWrongCount((c) => c + 1);
      setAppFeedback(ch.hints[Math.min(1, appWrongCount)]);
      playFx('wrong');
    }
  };

  const handleCheckTeachBack = (idx: number) => {
    if (!activeMission || tbSolved) return;
    triggerLightHaptic(8);
    setTbPick(idx);
    const ch = activeMission.stage4Complete.teachBackChallenge;
    if (idx === ch.correctIndex) {
      setTbSolved(true);
      setTbFeedback(ch.explanation);
      playFx('right');
    } else {
      setTbWrongCount((c) => c + 1);
      setTbFeedback(ch.hints[Math.min(1, tbWrongCount)]);
      playFx('wrong');
    }
  };

  const handleCompleteMission = () => {
    if (!activeMission) return;
    const prevRec = profile.completedMissions[activeMission.id];
    const hasComboSurge = profile.unlockedSkills.includes('combo_surge');
    const hasGuildVanguard = profile.unlockedSkills.includes('guild_vanguard');

    const result = calculateMissionMasteryReward({
      baseXpReward: activeMission.xpReward,
      explorationCompleted: simCompleted,
      decisionSolved,
      decisionWrongAttempts: decisionWrongCount,
      applicationSolved: appSolved,
      applicationWrongAttempts: appWrongCount,
      teachBackSolved: tbSolved,
      teachBackWrongAttempts: tbWrongCount,
      previousBestAccuracyPct: prevRec?.bestAccuracyPct,
      previousXpEarned: prevRec?.xpEarned,
      hasComboSurgeSkill: hasComboSurge,
    });

    setMissionSummary(result);
    setMissionStage('victory');
    playFx(result.passedMastery ? 'win' : 'done');

    const solvedCount =
      (decisionSolved ? 1 : 0) + (appSolved ? 1 : 0) + (tbSolved ? 1 : 0);

    if (result.netNewXpAwarded > 0 || solvedCount > 0) {
      onAwardUniverseXp(result.netNewXpAwarded, solvedCount, activeMission.title);
    }

    updateProfile((prev) => {
      const oldRec = prev.completedMissions[activeMission.id];
      const bestAcc = Math.max(oldRec?.bestAccuracyPct || 0, result.accuracyPct);
      const bestXp = Math.max(oldRec?.xpEarned || 0, result.rawEarnedXp);
      const nextEquip =
        result.passedMastery &&
        activeMission.unlockEquipmentId &&
        !prev.unlockedEquipment.includes(activeMission.unlockEquipmentId)
          ? [...prev.unlockedEquipment, activeMission.unlockEquipmentId]
          : prev.unlockedEquipment;

      const guildGain = Math.round(
        result.netNewXpAwarded * (hasGuildVanguard ? 1.25 : 1)
      );

      return {
        ...prev,
        activeTitle:
          result.passedMastery && activeMission.unlockTitle
            ? activeMission.unlockTitle
            : prev.activeTitle,
        unlockedEquipment: nextEquip,
        equippedRelic: prev.equippedRelic || nextEquip[0] || null,
        guildContributionXp: prev.guildContributionXp + guildGain,
        completedMissions: {
          ...prev.completedMissions,
          [activeMission.id]: {
            bestAccuracyPct: bestAcc,
            xpEarned: bestXp,
            attempts: (oldRec?.attempts || 0) + 1,
            firstTryDecision:
              Boolean(oldRec?.firstTryDecision) ||
              (decisionSolved && decisionWrongCount === 0),
            unlockedTitle: result.passedMastery ? activeMission.unlockTitle : oldRec?.unlockedTitle,
            completedDay: curDay,
          },
        },
      };
    });
  };

  const startBossBattle = (boss: WorldBossEncounter) => {
    triggerLightHaptic(12);
    playFx('slam');
    const maxS = profile.unlockedSkills.includes('second_wind_shield') ? 4 : 3;
    setActiveMission(null);
    setActiveBoss(boss);
    setBossIdx(0);
    setBossShields(maxS);
    setBossMaxShields(maxS);
    setBossHits(0);
    setBossPick(null);
    setBossAnswered(false);
    setBossFinished(null);
  };

  const handleBossAnswer = (idx: number) => {
    if (!activeBoss || bossAnswered || bossFinished) return;
    triggerLightHaptic(10);
    setBossPick(idx);
    setBossAnswered(true);
    const curQ = activeBoss.questions[bossIdx];
    if (idx === curQ.correctIndex) {
      setBossHits((h) => h + 1);
      playFx('right');
    } else {
      const nextShields = Math.max(0, bossShields - 1);
      setBossShields(nextShields);
      playFx('wrong');
      if (nextShields <= 0) {
        setBossFinished('lost');
      }
    }
  };

  const handleBossNext = () => {
    if (!activeBoss) return;
    if (bossIdx + 1 >= activeBoss.questions.length) {
      const finalHits = bossHits;
      const total = activeBoss.questions.length;
      const won = bossShields > 0 && finalHits >= Math.ceil(total * 0.75);
      setBossFinished(won ? 'won' : 'lost');
      if (won) {
        playFx('win');
        const prevBoss = profile.defeatedBosses[activeBoss.id];
        const earned = prevBoss ? 40 : activeBoss.xpReward;
        onAwardUniverseXp(earned, finalHits, activeBoss.name);
        updateProfile((prev) => ({
          ...prev,
          activeTitle: activeBoss.unlockTitle || prev.activeTitle,
          guildContributionXp: prev.guildContributionXp + earned,
          defeatedBosses: {
            ...prev.defeatedBosses,
            [activeBoss.id]: {
              bestScore: Math.max(prev.defeatedBosses[activeBoss.id]?.bestScore || 0, finalHits),
              total,
              xpEarned: Math.max(
                prev.defeatedBosses[activeBoss.id]?.xpEarned || 0,
                activeBoss.xpReward
              ),
            },
          },
        }));
      } else {
        playFx('done');
      }
      return;
    }
    setBossIdx((i) => i + 1);
    setBossPick(null);
    setBossAnswered(false);
  };

  const handleClaimQuest = (questId: string, rewardXp: number) => {
    triggerLightHaptic(10);
    playFx('win');
    onAwardUniverseXp(rewardXp, 0, 'Daily Quest');
    updateProfile((prev) => {
      const existing = prev.claimedQuestsByDay[curDay] || [];
      if (existing.includes(questId)) return prev;
      return {
        ...prev,
        guildContributionXp: prev.guildContributionXp + rewardXp,
        claimedQuestsByDay: {
          ...prev.claimedQuestsByDay,
          [curDay]: [...existing, questId],
        },
      };
    });
  };

  // ============================================================================
  // VIEW 0: FULL-VIEWPORT 3D HUMAN CIRCULATORY SYSTEM ADVENTURE
  // ============================================================================
  if (showCirculatory3D) {
    const fallbackEl = (
      <div className="fixed inset-0 z-[9999] w-screen h-screen bg-[#090712] text-slate-200 flex items-center justify-center p-6">
        <div className="text-sm font-semibold tracking-wide text-rose-200">
          Entering the Living Heart...
        </div>
      </div>
    );
    return (
      <React.Suspense
        fallback={
          typeof document !== 'undefined' ? createPortal(fallbackEl, document.body) : fallbackEl
        }
      >
        <LazyCirculatoryAdventure3D
          autostart={autostart3D}
          initialMuted={progress.muted}
          studentName={progress.name}
          onCompleteAdventure={handleCompleteCirculatory3D}
          onOpenSyllabusNotes={() => {
            setShowCirculatory3D(false);
            onOpenTopicNotes('bio');
          }}
          onExit={() => setShowCirculatory3D(false)}
        />
      </React.Suspense>
    );
  }

  // ============================================================================
  // VIEW 1: ACTIVE 4-STAGE MISSION PLAYER
  // ============================================================================
  if (activeMission && activeWorld) {
    const hasDiagnosticPulse = profile.unlockedSkills.includes('diagnostic_pulse');
    const hasFirstPrinciples = profile.unlockedSkills.includes('first_principles');

    return (
      <div className="flex flex-col gap-5">
        {/* Top Mission Bar */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-[var(--line)]">
          <button
            type="button"
            onClick={() => setActiveMission(null)}
            className="min-h-[40px] px-3.5 rounded-xl bg-[var(--card)] border border-[var(--line)] hover:border-[var(--acc-line)] text-[13px] font-bold text-[var(--ink)] inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <Icon name="back" size={16} />
            <span>Back to {activeWorld.worldTitle}</span>
          </button>

          <div className="flex items-center gap-2 text-[12.5px] font-bold text-[var(--dim)] tabular-nums">
            <span>{activeMission.levelLabel}</span>
            <span aria-hidden="true">·</span>
            <span className="text-[var(--gold)]">Up to {activeMission.xpReward} XP</span>
          </div>
        </div>

        {/* 4-Stage Progress Stepper */}
        <nav aria-label="Mission stages" className="grid grid-cols-4 gap-2">
          {(
            [
              { idx: 1, label: '1. Discover' },
              { idx: 2, label: '2. Explore' },
              { idx: 3, label: '3. Decide' },
              { idx: 4, label: '4. Complete' },
            ] as const
          ).map((s) => {
            const reached =
              missionStage === 'victory' ||
              (typeof missionStage === 'number' && missionStage >= s.idx);
            const current = missionStage === s.idx;
            return (
              <div key={s.idx} className="flex flex-col gap-1.5">
                <div
                  className={`h-2.5 rounded-full transition-colors ${
                    current
                      ? 'bg-[var(--gold)]'
                      : reached
                        ? 'bg-[var(--green)]'
                        : 'bg-[var(--bg-out)]'
                  }`}
                />
                <span
                  className={`text-[12px] font-bold truncate ${
                    current
                      ? 'text-[var(--gold)]'
                      : reached
                        ? 'text-[var(--ink)]'
                        : 'text-[var(--dim)]'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </nav>

        {/* Mission Title Header */}
        <header className="rtc-card rounded-2xl p-5 flex flex-col gap-2">
          <div className="text-[12px] font-bold text-[var(--dim)]">
            {activeWorld.subjectName} · {activeWorld.worldTitle} · Guide: {activeWorld.companionName}
          </div>
          <h1 className="h22 text-[var(--ink)]">{activeMission.title}</h1>
          <p className="text-[14.5px] text-[var(--dim)] leading-relaxed max-w-[68ch]">
            {activeMission.subtitle}
          </p>
        </header>

        {/* STAGE 1: DISCOVER */}
        {missionStage === 1 && (
          <section className="rtc-card rounded-2xl p-5 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <div className="text-[12px] font-bold text-[var(--gold)]">Stage 1 · Situation Briefing</div>
              <p className="text-[15.5px] font-semibold text-[var(--ink)] leading-relaxed max-w-[68ch]">
                {activeMission.stage1Discover.hook}
              </p>
              <p className="text-[14.5px] text-[var(--dim)] leading-relaxed max-w-[68ch]">
                <strong className="text-[var(--ink)]">{activeWorld.companionName}:</strong>{' '}
                {activeMission.stage1Discover.companionIntro}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-[var(--line)]">
              {activeMission.stage1Discover.keyFacts.map((fact, idx) => (
                <div
                  key={fact.label}
                  className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-4 flex flex-col gap-1.5"
                >
                  <div className="text-[12px] font-bold text-[var(--gold)] tabular-nums">
                    0{idx + 1}. {fact.label}
                  </div>
                  <p className="text-[13.5px] text-[var(--ink)] leading-snug">{fact.detail}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <span className="text-[12.5px] text-[var(--dim)]">
                Next: Test how the system behaves interactively
              </span>
              <button
                type="button"
                onClick={() => {
                  triggerLightHaptic(8);
                  setMissionStage(2);
                }}
                className="btn-tactile indigo whitespace-nowrap"
              >
                <span>Open Simulation Lab</span>
                <Icon name="go" size={16} />
              </button>
            </div>
          </section>
        )}

        {/* STAGE 2: EXPLORE (INTERACTIVE SIMULATION) */}
        {missionStage === 2 && (
          <section className="rtc-card rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="text-[12px] font-bold text-[var(--gold)]">
                  Stage 2 · Interactive Simulation
                </div>
                <p className="text-[14px] text-[var(--ink)] mt-0.5 max-w-[65ch]">
                  {activeMission.stage2Explore.instruction}
                </p>
              </div>
              <span className="text-[12.5px] font-bold tabular-nums text-[var(--dim)] shrink-0">
                {simCompleted ? 'Goal verified' : activeMission.stage2Explore.targetGoalLabel}
              </span>
            </div>

            <UniverseStageSimulation
              kind={activeMission.stage2Explore.simulationKind}
              pathwayNodes={activeMission.stage2Explore.pathwayNodes}
              completed={simCompleted}
              onComplete={() => {
                setSimCompleted(true);
                playFx('right');
              }}
            />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--line)]">
              <button
                type="button"
                onClick={() => setMissionStage(1)}
                className="btn-tactile paper whitespace-nowrap"
              >
                <span>Review briefing</span>
              </button>
              <div className="flex items-center gap-3">
                {!simCompleted && (
                  <span className="text-[12px] font-semibold text-[var(--dim)]">
                    Complete simulation above to unlock Stage 3
                  </span>
                )}
                <button
                  type="button"
                  disabled={!simCompleted}
                  onClick={() => {
                    triggerLightHaptic(8);
                    setMissionStage(3);
                  }}
                  className="btn-tactile indigo whitespace-nowrap disabled:opacity-50"
                >
                  <span>Proceed to Decision</span>
                  <Icon name="go" size={16} />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* STAGE 3: MAKE A DECISION */}
        {missionStage === 3 && (
          <section className="rtc-card rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="text-[12px] font-bold text-[var(--gold)]">
                Stage 3 · Critical Field Decision
              </div>
              <p className="text-[14px] text-[var(--dim)] leading-relaxed">
                {activeMission.stage3Decision.scenarioContext}
              </p>
              <h2 className="h18 text-[var(--ink)] pt-1">{activeMission.stage3Decision.prompt}</h2>
            </div>

            <div className="flex flex-col gap-2.5" role="radiogroup" aria-label="Decision options">
              {activeMission.stage3Decision.options.map((opt, idx) => {
                const selected = decisionPick === idx;
                const isCorrect = idx === activeMission.stage3Decision.correctIndex;
                let borderStyle = 'bg-[var(--bg)] border-[var(--line)] text-[var(--ink)]';
                if (decisionSubmitted && selected) {
                  borderStyle = isCorrect
                    ? 'bg-[var(--acc-soft)] border-[var(--green)] text-[var(--ink)]'
                    : 'bg-[var(--bad-soft)] border-[var(--coral-ink)] text-[var(--ink)]';
                } else if (selected) {
                  borderStyle = 'bg-[var(--acc-soft)] border-[var(--gold)] text-[var(--ink)]';
                }
                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={decisionSolved}
                    onClick={() => {
                      triggerLightHaptic(6);
                      setDecisionPick(idx);
                      setDecisionSubmitted(false);
                    }}
                    className={`min-h-[48px] px-4 py-3 rounded-xl border text-left text-[14px] font-semibold flex items-center justify-between gap-3 transition cursor-pointer ${borderStyle}`}
                  >
                    <span>{opt}</span>
                    {decisionSubmitted && selected && (
                      <Icon
                        name={isCorrect ? 'check' : 'x'}
                        size={17}
                        className={isCorrect ? 'text-[var(--green)] shrink-0' : 'text-[var(--coral-ink)] shrink-0'}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Companion Hint Trigger */}
            {(showDecisionHint || hasDiagnosticPulse) && !decisionSolved && (
              <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-3.5 text-[13.5px] text-[var(--dim)] flex flex-col gap-1">
                <div className="font-bold text-[var(--ink)]">
                  {activeWorld.companionName}&apos;s Clue
                </div>
                <p>{activeMission.stage3Decision.hints[0]}</p>
                {(decisionWrongCount >= 2 || hasDiagnosticPulse) && (
                  <p className="text-[var(--ink)] pt-1">{activeMission.stage3Decision.hints[1]}</p>
                )}
              </div>
            )}

            {decisionSubmitted && decisionPick !== null && (
              <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-4 text-[14px] leading-relaxed">
                <div className="font-bold text-[var(--ink)] mb-1">
                  {decisionSolved ? 'Decision Verified' : 'Recalibrate Your Approach'}
                </div>
                <p className="text-[var(--dim)]">
                  {activeMission.stage3Decision.optionFeedback?.[decisionPick] ||
                    (decisionSolved
                      ? activeMission.stage3Decision.explanation
                      : activeMission.stage3Decision.hints[0])}
                </p>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[var(--line)]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMissionStage(2)}
                  className="btn-tactile paper whitespace-nowrap"
                >
                  <span>Back to Lab</span>
                </button>
                {!showDecisionHint && !decisionSolved && (
                  <button
                    type="button"
                    onClick={() => setShowDecisionHint(true)}
                    className="min-h-[40px] px-3 rounded-xl text-[13px] font-bold text-[var(--gold)] hover:underline cursor-pointer whitespace-nowrap"
                  >
                    Ask {activeWorld.companionName} for a clue
                  </button>
                )}
              </div>

              {!decisionSolved ? (
                <button
                  type="button"
                  disabled={decisionPick === null}
                  onClick={handleSubmitDecision}
                  className="btn-tactile indigo whitespace-nowrap disabled:opacity-50"
                >
                  <span>Submit decision</span>
                  <Icon name="check" size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    triggerLightHaptic(8);
                    setMissionStage(4);
                  }}
                  className="btn-tactile indigo whitespace-nowrap"
                >
                  <span>Final Mastery Stage</span>
                  <Icon name="go" size={16} />
                </button>
              )}
            </div>
          </section>
        )}

        {/* STAGE 4: COMPLETE MISSION (APPLICATION + TEACH-BACK) */}
        {missionStage === 4 && (
          <section className="rtc-card rounded-2xl p-5 flex flex-col gap-5">
            <div>
              <div className="text-[12px] font-bold text-[var(--gold)]">
                Stage 4 · Prove Understanding to Complete Mission
              </div>
              <p className="text-[13.5px] text-[var(--dim)] mt-0.5">
                XP is earned through genuine problem-solving and explaining why the rule works.
              </p>
            </div>

            {hasFirstPrinciples && (
              <div className="rounded-xl bg-[var(--acc-soft)] border border-[var(--acc-line)] p-3.5 text-[13px] text-[var(--ink)]">
                <strong>First-Principles Lens Active:</strong>{' '}
                {activeMission.stage4Complete.applicationChallenge.hints[0]}
              </div>
            )}

            {/* Check A: Applied Challenge */}
            <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-4 flex flex-col gap-3">
              <div className="text-[12px] font-bold text-[var(--dim)]">
                Part A · Applied Problem Solving
              </div>
              <h2 className="font-[var(--display)] font-bold text-[15.5px] text-[var(--ink)] leading-snug">
                {activeMission.stage4Complete.applicationChallenge.prompt}
              </h2>
              <div className="flex flex-col gap-2">
                {activeMission.stage4Complete.applicationChallenge.options.map((opt, idx) => {
                  const picked = appPick === idx;
                  const right =
                    idx === activeMission.stage4Complete.applicationChallenge.correctIndex;
                  return (
                    <button
                      key={opt}
                      type="button"
                      disabled={appSolved}
                      onClick={() => handleCheckApplication(idx)}
                      className={`min-h-[44px] px-3.5 py-2.5 rounded-xl border text-left text-[13.5px] font-semibold flex items-center justify-between gap-2 cursor-pointer ${
                        picked && appSolved && right
                          ? 'bg-[var(--acc-soft)] border-[var(--green)] text-[var(--ink)]'
                          : picked && !right
                            ? 'bg-[var(--bad-soft)] border-[var(--coral-ink)] text-[var(--ink)]'
                            : 'bg-[var(--card)] border-[var(--line)] text-[var(--ink)] hover:border-[var(--acc-line)]'
                      }`}
                    >
                      <span>{opt}</span>
                      {picked && (
                        <Icon
                          name={right ? 'check' : 'x'}
                          size={16}
                          className={right ? 'text-[var(--green)] shrink-0' : 'text-[var(--coral-ink)] shrink-0'}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
              {appFeedback && (
                <p className="text-[13px] text-[var(--dim)] leading-relaxed pt-1">{appFeedback}</p>
              )}
            </div>

            {/* Check B: Teach-Back Verification */}
            <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-4 flex flex-col gap-3">
              <div className="text-[12px] font-bold text-[var(--dim)]">
                Part B · Confirm the Underlying Principle
              </div>
              <h2 className="font-[var(--display)] font-bold text-[15.5px] text-[var(--ink)] leading-snug">
                {activeMission.stage4Complete.teachBackChallenge.prompt}
              </h2>
              <div className="flex flex-col gap-2">
                {activeMission.stage4Complete.teachBackChallenge.options.map((opt, idx) => {
                  const picked = tbPick === idx;
                  const right =
                    idx === activeMission.stage4Complete.teachBackChallenge.correctIndex;
                  return (
                    <button
                      key={opt}
                      type="button"
                      disabled={tbSolved}
                      onClick={() => handleCheckTeachBack(idx)}
                      className={`min-h-[44px] px-3.5 py-2.5 rounded-xl border text-left text-[13.5px] font-semibold flex items-center justify-between gap-2 cursor-pointer ${
                        picked && tbSolved && right
                          ? 'bg-[var(--acc-soft)] border-[var(--green)] text-[var(--ink)]'
                          : picked && !right
                            ? 'bg-[var(--bad-soft)] border-[var(--coral-ink)] text-[var(--ink)]'
                            : 'bg-[var(--card)] border-[var(--line)] text-[var(--ink)] hover:border-[var(--acc-line)]'
                      }`}
                    >
                      <span>{opt}</span>
                      {picked && (
                        <Icon
                          name={right ? 'check' : 'x'}
                          size={16}
                          className={right ? 'text-[var(--green)] shrink-0' : 'text-[var(--coral-ink)] shrink-0'}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
              {tbFeedback && (
                <p className="text-[13px] text-[var(--dim)] leading-relaxed pt-1">{tbFeedback}</p>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 pt-2 border-t border-[var(--line)]">
              <button
                type="button"
                onClick={() => setMissionStage(3)}
                className="btn-tactile paper whitespace-nowrap"
              >
                <span>Back</span>
              </button>
              <button
                type="button"
                disabled={!appSolved || !tbSolved}
                onClick={handleCompleteMission}
                className="btn-tactile indigo whitespace-nowrap disabled:opacity-50"
              >
                <span>Complete mission</span>
                <Icon name="trophy" size={16} />
              </button>
            </div>
          </section>
        )}

        {/* MISSION VICTORY / MASTERY REPORT */}
        {missionStage === 'victory' && missionSummary && (
          <section className="rtc-card rounded-2xl p-6 flex flex-col gap-5 border-[var(--acc-line)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <div className="text-[12.5px] font-bold text-[var(--gold)]">
                  Mission Complete · {activeWorld.worldTitle}
                </div>
                <h2 className="h22 text-[var(--ink)]">{activeMission.title}</h2>
                <p className="text-[14.5px] text-[var(--dim)] leading-relaxed max-w-[60ch]">
                  {activeMission.stage4Complete.victoryNarrative}
                </p>
              </div>
              <div className="rounded-2xl bg-[var(--acc-soft)] border border-[var(--acc-line)] px-5 py-3.5 text-center shrink-0">
                <div className="font-[var(--display)] font-extrabold text-[26px] text-[var(--gold)] tabular-nums">
                  +{missionSummary.netNewXpAwarded > 0 ? missionSummary.netNewXpAwarded : missionSummary.rawEarnedXp} XP
                </div>
                <div className="text-[12px] font-bold text-[var(--ink)] tabular-nums">
                  {missionSummary.accuracyPct}% Mastery Score
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[var(--line)] tabular-nums">
              <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-3.5">
                <div className="text-[11.5px] font-bold text-[var(--dim)]">Lab Exploration</div>
                <div className="font-[var(--display)] font-bold text-[18px] text-[var(--ink)] mt-0.5">
                  +{missionSummary.breakdown.explorationXp} XP
                </div>
              </div>
              <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-3.5">
                <div className="text-[11.5px] font-bold text-[var(--dim)]">Stage 3 Decision</div>
                <div className="font-[var(--display)] font-bold text-[18px] text-[var(--ink)] mt-0.5">
                  +{missionSummary.breakdown.decisionXp} XP
                </div>
              </div>
              <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-3.5">
                <div className="text-[11.5px] font-bold text-[var(--dim)]">
                  Applied &amp; Principle Check
                </div>
                <div className="font-[var(--display)] font-bold text-[18px] text-[var(--ink)] mt-0.5">
                  +{missionSummary.breakdown.applicationAndTeachBackXp} XP
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1 text-[13.5px] text-[var(--dim)]">
              <p className="font-semibold text-[var(--ink)]">{missionSummary.feedbackSummary}</p>
              {missionSummary.passedMastery && (
                <p>
                  Unlocked Rank Title: <strong className="text-[var(--gold)]">{activeMission.unlockTitle}</strong>
                  {activeMission.unlockEquipmentId && EQUIPMENT_CATALOG[activeMission.unlockEquipmentId]
                    ? ` · Equipment: ${EQUIPMENT_CATALOG[activeMission.unlockEquipmentId].name}`
                    : ''}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[var(--line)]">
              <button
                type="button"
                onClick={() =>
                  onOpenTopicNotes(activeMission.worldId, activeMission.linkedTopicId)
                }
                className="btn-tactile paper whitespace-nowrap"
              >
                <Icon name="book" size={16} />
                <span>Read Syllabus Notes</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMission(null)}
                className="btn-tactile indigo whitespace-nowrap"
              >
                <span>Return to {activeWorld.worldTitle}</span>
                <Icon name="go" size={16} />
              </button>
            </div>
          </section>
        )}
      </div>
    );
  }

  // ============================================================================
  // VIEW 2: MULTI-PHASE WORLD BOSS ENCOUNTER
  // ============================================================================
  if (activeBoss && activeWorld) {
    const curQ = activeBoss.questions[bossIdx];
    const bossHpRemainingPct = Math.max(
      0,
      Math.round(((activeBoss.questions.length - bossHits) / activeBoss.questions.length) * 100)
    );

    return (
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-[var(--line)]">
          <button
            type="button"
            onClick={() => setActiveBoss(null)}
            className="min-h-[40px] px-3.5 rounded-xl bg-[var(--card)] border border-[var(--line)] text-[13px] font-bold text-[var(--ink)] inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <Icon name="back" size={16} />
            <span>Exit Boss Arena</span>
          </button>

          {/* Discrete Shield Pips */}
          <div className="flex items-center gap-2 text-[13px] font-bold tabular-nums">
            <span className="text-[var(--dim)]">Shields</span>
            <div className="flex items-center gap-1" aria-label={`${bossShields} of ${bossMaxShields} shields remaining`}>
              {Array.from({ length: bossMaxShields }).map((_, i) => (
                <span
                  key={i}
                  className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                    i < bossShields
                      ? 'bg-[var(--gold)] border-[var(--gold)] text-[var(--on-acc)]'
                      : 'bg-transparent border-[var(--line)] text-[var(--dim)] opacity-45'
                  }`}
                >
                  <Icon name="shield" size={12} />
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Boss Status Header */}
        <section className="rtc-card rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2 flex-wrap text-[12px] font-bold">
            <span className="text-[var(--gold)]">{activeBoss.title}</span>
            <span className="text-[var(--dim)] tabular-nums">
              Boss Integrity: {bossHpRemainingPct}%
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <h1 className="h22 text-[var(--ink)]">{activeBoss.name}</h1>
            <span className="text-[13px] font-bold text-[var(--dim)] tabular-nums whitespace-nowrap">
              Question {bossIdx + 1} / {activeBoss.questions.length}
            </span>
          </div>
          <SmoothProgressBar
            value={bossHpRemainingPct}
            max={100}
            tone="indigo"
            heightClass="h-2.5"
            ariaLabel="Boss integrity remaining"
          />
        </section>

        {bossFinished ? (
          <section className="rtc-card rounded-2xl p-6 flex flex-col gap-4">
            <div className="text-[12.5px] font-bold text-[var(--gold)]">
              {bossFinished === 'won' ? 'World Boss Defeated' : 'Shields Depleted'}
            </div>
            <h2 className="h22 text-[var(--ink)]">
              {bossFinished === 'won'
                ? `${activeBoss.name} Cleared!`
                : `Regroup and Challenge ${activeBoss.name} Again`}
            </h2>
            <p className="text-[14.5px] text-[var(--dim)] tabular-nums">
              Accuracy: <strong>{bossHits}</strong> / {activeBoss.questions.length} phases solved ·
              Shields remaining: <strong>{bossShields}</strong>
              {bossFinished === 'won' ? ` · Unlocked Title: ${activeBoss.unlockTitle}` : ''}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => startBossBattle(activeBoss)}
                className="btn-tactile indigo whitespace-nowrap"
              >
                <span>{bossFinished === 'won' ? 'Play Again' : 'Try Again'}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveBoss(null)}
                className="btn-tactile paper whitespace-nowrap"
              >
                <span>Return to World</span>
              </button>
            </div>
          </section>
        ) : (
          <section className="rtc-card rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <div className="text-[12px] font-bold text-[var(--gold)]">{curQ.phaseLabel}</div>
              <p className="text-[13px] text-[var(--dim)]">{curQ.telegraph}</p>
              <h2 className="h18 text-[var(--ink)] pt-1">{curQ.q}</h2>
            </div>

            <div className="flex flex-col gap-2.5">
              {curQ.options.map((opt, idx) => {
                const picked = bossPick === idx;
                const isRight = idx === curQ.correctIndex;
                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={bossAnswered}
                    onClick={() => handleBossAnswer(idx)}
                    className={`min-h-[46px] px-4 py-3 rounded-xl border text-left text-[14px] font-semibold flex items-center justify-between gap-3 cursor-pointer ${
                      bossAnswered && isRight
                        ? 'bg-[var(--acc-soft)] border-[var(--green)] text-[var(--ink)]'
                        : bossAnswered && picked && !isRight
                          ? 'bg-[var(--bad-soft)] border-[var(--coral-ink)] text-[var(--ink)]'
                          : 'bg-[var(--bg)] border-[var(--line)] text-[var(--ink)] hover:border-[var(--acc-line)]'
                    }`}
                  >
                    <span>{opt}</span>
                    {bossAnswered && (isRight || picked) && (
                      <Icon
                        name={isRight ? 'check' : 'x'}
                        size={16}
                        className={isRight ? 'text-[var(--green)] shrink-0' : 'text-[var(--coral-ink)] shrink-0'}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {bossAnswered && (
              <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-[13.5px] text-[var(--dim)] leading-relaxed">{curQ.explanation}</p>
                <button
                  type="button"
                  onClick={handleBossNext}
                  className="btn-tactile indigo shrink-0 whitespace-nowrap"
                >
                  <span>
                    {bossIdx + 1 >= activeBoss.questions.length ? 'Finish Battle' : 'Next Phase'}
                  </span>
                  <Icon name="go" size={16} />
                </button>
              </div>
            )}
          </section>
        )}
      </div>
    );
  }

  // ============================================================================
  // VIEW 3: INSIDE A SELECTED SUBJECT WORLD
  // ============================================================================
  if (activeWorld) {
    const showWorldArt = Boolean(activeWorld.keyArtUrl && !failedWorldArt[activeWorld.worldId]);
    const bossRecord = profile.defeatedBosses[activeWorld.boss.id];

    return (
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setSelectedWorldId(null)}
            className="min-h-[40px] px-3.5 rounded-xl bg-[var(--card)] border border-[var(--line)] hover:border-[var(--acc-line)] text-[13px] font-bold text-[var(--ink)] inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <Icon name="back" size={16} />
            <span>All Worlds</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenTopicNotes(activeWorld.worldId)}
              className="min-h-[38px] px-3 rounded-xl bg-[var(--card)] border border-[var(--line)] hover:border-[var(--acc-line)] text-[12.5px] font-bold text-[var(--ink)] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Icon name="book" size={15} className="text-[var(--gold)]" />
              <span>Syllabus Notes</span>
            </button>
            {onOpenLab &&
              (activeWorld.worldId === 'bio' ||
                activeWorld.worldId === 'chem' ||
                activeWorld.worldId === 'phys' ||
                activeWorld.worldId === 'maths' ||
                activeWorld.worldId === 'agric') && (
                <button
                  type="button"
                  onClick={onOpenLab}
                  className="min-h-[38px] px-3 rounded-xl bg-[var(--card)] border border-[var(--line)] hover:border-[var(--acc-line)] text-[12.5px] font-bold text-[var(--ink)] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Icon name="flask" size={15} className="text-[var(--gold)]" />
                  <span>Practical Labs</span>
                </button>
              )}
          </div>
        </div>

        {/* World Key-Art Hero Banner */}
        <section
          className="relative rounded-2xl overflow-hidden min-h-[220px] sm:min-h-[250px] flex items-end p-5 sm:p-7 border border-[var(--line)]"
          style={{ background: activeWorld.fallbackGradient }}
        >
          {showWorldArt && (
            <img
              src={activeWorld.keyArtUrl}
              alt={`${activeWorld.subjectName} — ${activeWorld.worldTitle}`}
              referrerPolicy="no-referrer"
              onError={() =>
                setFailedWorldArt((prev) => ({ ...prev, [activeWorld.worldId]: true }))
              }
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#090D16]/92 via-[#090D16]/55 to-[#090D16]/20" />

          <div className="relative z-10 w-full flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
            <div className="flex flex-col gap-1.5 max-w-[62ch]">
              <div className="text-[12.5px] font-bold text-amber-300">
                {activeWorld.subjectName} · {activeWorld.roleIdentity} · Guide:{' '}
                {activeWorld.companionName}
              </div>
              <h1 className="font-[var(--display)] font-extrabold text-[26px] sm:text-[32px] leading-tight">
                {activeWorld.worldTitle}
              </h1>
              <p className="text-[14.5px] text-slate-200 leading-snug">{activeWorld.tagline}</p>
            </div>

            <button
              type="button"
              onClick={() => startMission(activeWorld.missions[0], activeWorld.worldId)}
              className="btn-tactile indigo shrink-0 whitespace-nowrap"
            >
              <span>Start {activeWorld.missions[0].levelLabel}</span>
              <Icon name="play" size={15} />
            </button>
          </div>
        </section>

        {/* Playable Missions List */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="h18 text-[var(--ink)]">World Missions</h2>
              <p className="text-[13px] text-[var(--dim)]">
                Explore, simulate, decide, and prove mastery.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {activeWorld.missions.map((m) => {
              const rec = profile.completedMissions[m.id];
              return (
                <div
                  key={m.id}
                  className="rtc-card rounded-2xl p-5 flex flex-col justify-between gap-4"
                >
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-2 text-[12px] font-bold tabular-nums">
                      <span className="text-[var(--gold)]">
                        {m.levelLabel}
                        {m.isDynamicRescue ? ' · Tailored to your syllabus' : ''}
                      </span>
                      <span className="text-[var(--dim)]">
                        {rec ? `Best: ${rec.bestAccuracyPct}% · ${rec.xpEarned} XP` : `${m.xpReward} XP`}
                      </span>
                    </div>
                    <h3 className="font-[var(--display)] font-bold text-[17.5px] text-[var(--ink)]">
                      {m.title}
                    </h3>
                    <p className="text-[13.5px] text-[var(--dim)] leading-relaxed">{m.subtitle}</p>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-[var(--line)]">
                    <span className="text-[12px] font-semibold text-[var(--dim)] truncate">
                      Unlocks: {m.unlockTitle}
                    </span>
                    <button
                      type="button"
                      onClick={() => startMission(m, activeWorld.worldId)}
                      className="btn-tactile indigo whitespace-nowrap"
                    >
                      <span>{rec ? 'Replay Mission' : 'Start Mission'}</span>
                      <Icon name="go" size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* World Boss Encounter Banner */}
        <section className="rtc-card rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-[var(--acc-line)]">
          <div className="flex flex-col gap-1 max-w-[60ch]">
            <div className="text-[12px] font-bold text-[var(--gold)] tabular-nums">
              World Boss Battle · {activeWorld.boss.xpReward} XP ·{' '}
              {bossRecord
                ? `Cleared (${bossRecord.bestScore}/${bossRecord.total})`
                : `${activeWorld.boss.questions.length} Phases`}
            </div>
            <h2 className="h18 text-[var(--ink)]">{activeWorld.boss.name}</h2>
            <p className="text-[13.5px] text-[var(--dim)] leading-snug">
              {activeWorld.boss.premise}
            </p>
          </div>
          <button
            type="button"
            onClick={() => startBossBattle(activeWorld.boss)}
            className="btn-tactile paper shrink-0 whitespace-nowrap"
          >
            <Icon name="shield" size={16} className="text-[var(--gold)]" />
            <span>Challenge Boss</span>
          </button>
        </section>
      </div>
    );
  }

  // ============================================================================
  // VIEW 4: LEARNING UNIVERSE MAIN SANCTUM HUB
  // ============================================================================
  const activeRoleMeta =
    EXPLORER_ROLES.find((r) => r.id === profile.avatar.role) || EXPLORER_ROLES[0];
  const currentGuild =
    GUILD_DIRECTORY.find((g) => g.id === profile.guildId) || GUILD_DIRECTORY[0];
  const guildCombinedXp = currentGuild.communityBaseXp + profile.guildContributionXp;
  const guildPct = Math.min(
    100,
    Math.round((guildCombinedXp / currentGuild.weeklyTargetXp) * 100)
  );
  const visiblePeers = (GUILD_PEER_ROSTER[profile.guildId] || []).filter(
    (p) => !profile.mutedPeerIds.includes(p.id)
  );
  const studentGuildAlias = formatSafeGuildDisplayName(
    progress.name || 'Scholar',
    profile.privacySettings.hideRealNameInGuild
  );

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      {/* Explorer Sanctum Hero */}
      <section
        aria-label="Explorer Sanctum"
        className="relative rounded-2xl overflow-hidden border border-[var(--line)] min-h-[220px] flex items-end p-5 sm:p-6"
        style={{
          background: 'linear-gradient(135deg, #121833 0%, #261C4A 52%, #0F2938 100%)',
        }}
      >
        {!heroArtFailed && (
          <img
            src={universeSanctumArt}
            alt="Floating Learning Sanctum overlooking the subject worlds"
            referrerPolicy="no-referrer"
            onError={() => setHeroArtFailed(true)}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090D16]/96 via-[#090D16]/80 to-[#090D16]/45" />

        <div className="relative z-10 w-full flex flex-col min-[840px]:flex-row min-[840px]:items-center justify-between gap-5 text-white">
          <div className="flex items-start sm:items-center gap-4 min-w-0">
            <ExplorerAvatarSvg avatar={profile.avatar} size={78} />
            <div className="flex flex-col gap-1 min-w-0">
              <div className="text-[12px] font-bold text-amber-300 tabular-nums">
                Level {levelSummary.level} · {profile.activeTitle} · {levelSummary.baseName}
              </div>
              <h1 className="font-[var(--display)] font-extrabold text-[23px] sm:text-[28px] leading-tight">
                {progress.name || 'Scholar'}&apos;s Learning Universe
              </h1>
              <p className="text-[13.5px] text-slate-100 max-w-[50ch] leading-snug">
                Interactive subject worlds and live simulations built for JAMB &amp; WAEC mastery.
              </p>

              {/* Level XP Progress */}
              <div className="flex items-center gap-3 pt-1.5 max-w-md">
                <div className="flex-1">
                  <SmoothProgressBar
                    value={levelSummary.levelProgressPct}
                    max={100}
                    tone="emerald"
                    heightClass="h-2"
                    ariaLabel="Explorer level progress"
                  />
                </div>
                <span className="text-[12px] font-bold text-slate-100 tabular-nums whitespace-nowrap">
                  {levelSummary.totalXp} XP · {levelSummary.availableSkillTokens}{' '}
                  {levelSummary.availableSkillTokens === 1 ? 'Token' : 'Tokens'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                triggerLightHaptic(10);
                onSelectSubject('bio');
                setSelectedWorldId('bio');
                setShowCirculatory3D(true);
              }}
              data-start="true"
              className="btn-tactile indigo whitespace-nowrap"
            >
              <span>Enter 3D Living Heart</span>
              <Icon name="play" size={15} />
            </button>
            <button
              type="button"
              onClick={onBackHome}
              className="min-h-[42px] px-3.5 rounded-xl bg-white/14 hover:bg-white/22 border border-white/30 text-white text-[13px] font-bold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <span>Exam Dashboard</span>
            </button>
          </div>
        </div>
      </section>

      {/* Clean Segmented Hub Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div
          role="tablist"
          aria-label="Learning Universe sections"
          className="grid grid-cols-3 sm:inline-flex items-center gap-1 p-1 rounded-xl bg-[var(--card)] border border-[var(--line)] w-full sm:w-auto"
        >
          {(
            [
              { id: 'worlds', label: 'Subject Worlds' },
              { id: 'character', label: 'Explorer & Skills' },
              { id: 'guilds', label: 'Study Guilds' },
            ] as const
          ).map((t) => {
            const active = hubTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  triggerLightHaptic(6);
                  setHubTab(t.id);
                }}
                className={`min-h-[38px] px-2 sm:px-3.5 rounded-lg text-[12px] sm:text-[13px] font-bold transition cursor-pointer whitespace-nowrap truncate ${
                  active
                    ? 'bg-[var(--gold)] text-[var(--on-acc)]'
                    : 'text-[var(--dim)] hover:text-[var(--ink)]'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="text-[12.5px] font-semibold text-[var(--dim)] tabular-nums">
          {levelSummary.completedMissionCount} missions mastered · {levelSummary.defeatedBossCount}{' '}
          world bosses cleared
        </div>
      </div>

      {/* TAB 1: SUBJECT WORLDS + PERSONALISED TOPIC ADVENTURE GENERATOR */}
      {hubTab === 'worlds' && (
        <div className="flex flex-col gap-6">
          {/* Personalised Topic Adventure Builder */}
          <section
            aria-label="Personalised Topic Mission Builder"
            className="rtc-card rounded-2xl p-5 flex flex-col gap-4 border-[var(--acc-line)]"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="text-[12px] font-bold text-[var(--gold)]">
                  Adaptive Mission Builder
                </div>
                <h2 className="h18 text-[var(--ink)]">Turn Any Topic Into a Mission</h2>
                <p className="text-[13px] text-[var(--dim)] max-w-[56ch]">
                  Pick a subject and topic to launch a 4-stage interactive mission.
                </p>
              </div>
              {weakRescueForBuilder && (
                <span className="text-[12px] font-semibold text-[var(--dim)] shrink-0">
                  Recommended: {weakRescueForBuilder.topicName}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-4 flex flex-col gap-1">
                <label htmlFor="adv-subj" className="text-[12px] font-bold text-[var(--dim)]">
                  Subject
                </label>
                <select
                  id="adv-subj"
                  value={builderSubj}
                  onChange={(e) => setBuilderSubj(e.target.value as SubjectId)}
                  className="min-h-[42px] px-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-[13.5px] font-semibold text-[var(--ink)]"
                >
                  {worldSubjectIds.map((sid) => (
                    <option key={sid} value={sid}>
                      {SUBJECT_INFO[sid].name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-5 flex flex-col gap-1">
                <label htmlFor="adv-topic" className="text-[12px] font-bold text-[var(--dim)]">
                  Syllabus Topic
                </label>
                <select
                  id="adv-topic"
                  value={builderTopicId}
                  onChange={(e) => setBuilderTopicId(e.target.value)}
                  className="min-h-[42px] px-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-[13.5px] font-semibold text-[var(--ink)]"
                >
                  {builderTopics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.sec})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3">
                <button
                  type="button"
                  disabled={isGeneratingAdventure || builderTopics.length === 0}
                  onClick={handleGeneratePersonalisedAdventure}
                  className="btn-tactile indigo w-full whitespace-nowrap disabled:opacity-60"
                >
                  <span>{isGeneratingAdventure ? 'Preparing Mission...' : 'Start Topic Mission'}</span>
                  <Icon name="go" size={15} />
                </button>
              </div>
            </div>

            {adventureNotice && (
              <p className="text-[12.5px] text-[var(--dim)]">{adventureNotice}</p>
            )}
          </section>

          {/* Subject Worlds Grid */}
          <section aria-label="Learning Worlds" className="flex flex-col gap-3">
            <div>
              <h2 className="h18 text-[var(--ink)]">Explore Subject Worlds</h2>
              <p className="text-[13px] text-[var(--dim)]">
                Each world pairs interactive experiments with real JAMB &amp; WAEC concepts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {worldCards.map((w) => {
                const showArt = Boolean(w.keyArtUrl && !failedWorldArt[w.worldId]);
                const completedInWorld = w.missions.filter(
                  (m) => (profile.completedMissions[m.id]?.bestAccuracyPct || 0) >= 65
                ).length;

                return (
                  <article
                    key={w.worldId}
                    className="rtc-card rounded-2xl overflow-hidden flex flex-col justify-between"
                  >
                    <div
                      className="relative h-40 p-4 flex flex-col justify-end"
                      style={{ background: w.fallbackGradient }}
                    >
                      {showArt && (
                        <img
                          src={w.keyArtUrl}
                          alt={`${w.subjectName} — ${w.worldTitle}`}
                          referrerPolicy="no-referrer"
                          onError={() =>
                            setFailedWorldArt((prev) => ({ ...prev, [w.worldId]: true }))
                          }
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#090D16]/90 via-[#090D16]/45 to-transparent" />
                      <div className="relative z-10 text-white">
                        <div className="text-[11.5px] font-bold text-amber-300 tabular-nums">
                          {w.subjectName} · {completedInWorld}/{w.missions.length} Missions · Guide:{' '}
                          {w.companionName}
                        </div>
                        <h3 className="font-[var(--display)] font-extrabold text-[20px] leading-snug">
                          {w.worldTitle}
                        </h3>
                      </div>
                    </div>

                    <div className="p-4 flex flex-col justify-between gap-3.5 flex-1">
                      <p className="text-[13.5px] text-[var(--dim)] leading-snug">{w.tagline}</p>

                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-[var(--line)]">
                        <span className="text-[12px] font-semibold text-[var(--dim)] truncate">
                          Featured: {w.missions[0]?.title || w.heroMissionHeadline}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            triggerLightHaptic(8);
                            onSelectSubject(w.worldId);
                            setSelectedWorldId(w.worldId);
                          }}
                          className="btn-tactile paper whitespace-nowrap"
                        >
                          <span>Enter World</span>
                          <Icon name="go" size={15} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Daily Quests Strip */}
          <section aria-label="Daily Quests" className="rtc-card rounded-2xl p-5 flex flex-col gap-3.5">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="h18 text-[var(--ink)]">Daily Quests</h2>
                <p className="text-[12.5px] text-[var(--dim)]">
                  Earn XP by completing real study challenges.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {dailyQuests.map((q) => (
                <div
                  key={q.id}
                  className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-4 flex flex-col justify-between gap-3"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-2 text-[12px] font-bold tabular-nums">
                      <span className="text-[var(--gold)]">+{q.rewardXp} XP</span>
                      <span className="text-[var(--dim)]">
                        {q.current}/{q.target}
                      </span>
                    </div>
                    <h3 className="font-[var(--display)] font-bold text-[15px] text-[var(--ink)]">
                      {q.title}
                    </h3>
                    <p className="text-[12.5px] text-[var(--dim)] leading-snug">{q.description}</p>
                  </div>

                  {q.claimed ? (
                    <span className="text-[12.5px] font-bold text-[var(--green)] inline-flex items-center gap-1">
                      <Icon name="check" size={14} />
                      <span>Claimed today</span>
                    </span>
                  ) : q.completed ? (
                    <button
                      type="button"
                      onClick={() => handleClaimQuest(q.id, q.rewardXp)}
                      className="btn-tactile indigo w-full whitespace-nowrap"
                    >
                      <span>Claim +{q.rewardXp} XP</span>
                    </button>
                  ) : (
                    <SmoothProgressBar
                      value={Math.round((q.current / Math.max(1, q.target)) * 100)}
                      max={100}
                      tone="indigo"
                      heightClass="h-2"
                      ariaLabel={q.title}
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* TAB 2: EXPLORER AVATAR, PERSONAL BASE & SKILL TREE */}
      {hubTab === 'character' && (
        <div className="grid grid-cols-1 min-[880px]:grid-cols-12 gap-5 items-start">
          {/* Left: Avatar Customiser & Personal Base */}
          <section className="min-[880px]:col-span-5 rtc-card rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <ExplorerAvatarSvg avatar={profile.avatar} size={84} />
              <div className="min-w-0">
                <div className="text-[12px] font-bold text-[var(--gold)]">
                  {activeRoleMeta.title}
                </div>
                <h2 className="h18 text-[var(--ink)] truncate">{profile.activeTitle}</h2>
                <p className="text-[12.5px] text-[var(--dim)] leading-snug mt-0.5">
                  {activeRoleMeta.tagline}
                </p>
              </div>
            </div>

            {/* Role Selector */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-[var(--line)]">
              <span className="text-[12px] font-bold text-[var(--dim)]">Specialist Role</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {EXPLORER_ROLES.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      triggerLightHaptic(6);
                      updateProfile((p) => ({
                        ...p,
                        avatar: { ...p.avatar, role: r.id as ExplorerRole },
                      }));
                    }}
                    className={`min-h-[38px] px-2.5 rounded-xl text-[12.5px] font-bold cursor-pointer whitespace-nowrap truncate ${
                      profile.avatar.role === r.id
                        ? 'bg-[var(--gold)] text-[var(--on-acc)]'
                        : 'bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)]'
                    }`}
                  >
                    {r.title.replace('Field ', '').replace('Chief ', '').replace('Concept ', '').replace('Systems ', '').replace('Mission ', '')}
                  </button>
                ))}
              </div>
            </div>

            {/* Tunic Colour & Headgear */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <span className="text-[12px] font-bold text-[var(--dim)]">Outfit Colour</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['indigo', 'crimson', 'emerald', 'amber'] as OutfitColorId[]).map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() =>
                        updateProfile((p) => ({
                          ...p,
                          avatar: { ...p.avatar, outfitColor: col },
                        }))
                      }
                      className={`min-h-[34px] px-2 rounded-lg text-[12px] font-bold capitalize cursor-pointer ${
                        profile.avatar.outfitColor === col
                          ? 'bg-[var(--gold)] text-[var(--on-acc)]'
                          : 'bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)]'
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[12px] font-bold text-[var(--dim)]">Headgear</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['visor', 'goggles', 'circlet', 'beret'] as HeadgearId[]).map((hg) => (
                    <button
                      key={hg}
                      type="button"
                      onClick={() =>
                        updateProfile((p) => ({
                          ...p,
                          avatar: { ...p.avatar, headgear: hg },
                        }))
                      }
                      className={`min-h-[34px] px-2 rounded-lg text-[12px] font-bold capitalize cursor-pointer ${
                        profile.avatar.headgear === hg
                          ? 'bg-[var(--gold)] text-[var(--on-acc)]'
                          : 'bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)]'
                      }`}
                    >
                      {hg}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Crest Emblem */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[12px] font-bold text-[var(--dim)]">Chest Emblem</span>
              <div className="grid grid-cols-4 gap-1.5">
                {(['compass', 'heart', 'atom', 'flask'] as EmblemId[]).map((emb) => (
                  <button
                    key={emb}
                    type="button"
                    onClick={() =>
                      updateProfile((p) => ({
                        ...p,
                        avatar: { ...p.avatar, emblem: emb },
                      }))
                    }
                    className={`min-h-[34px] px-2 rounded-lg text-[12px] font-bold capitalize cursor-pointer ${
                      profile.avatar.emblem === emb
                        ? 'bg-[var(--gold)] text-[var(--on-acc)]'
                        : 'bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)]'
                    }`}
                  >
                    {emb}
                  </button>
                ))}
              </div>
            </div>

            {/* Personal Base Status */}
            <div className="pt-3 border-t border-[var(--line)] flex flex-col gap-1">
              <div className="text-[12px] font-bold text-[var(--gold)] tabular-nums">
                Personal Base · Tier {levelSummary.baseTier}/4
              </div>
              <div className="font-[var(--display)] font-bold text-[15px] text-[var(--ink)]">
                {levelSummary.baseName}
              </div>
              <p className="text-[12.5px] text-[var(--dim)]">{levelSummary.baseDescription}</p>
            </div>
          </section>

          {/* Right: Skill Tree & Unlocked Relics */}
          <div className="min-[880px]:col-span-7 flex flex-col gap-4">
            <section className="rtc-card rounded-2xl p-5 flex flex-col gap-3.5">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="h18 text-[var(--ink)]">Mastery Skill Tree</h2>
                  <p className="text-[12.5px] text-[var(--dim)]">
                    Earn Mastery Tokens by completing missions (65%+ accuracy) and defeating World
                    Bosses.
                  </p>
                </div>
                <span className="text-[13px] font-extrabold text-[var(--gold)] tabular-nums whitespace-nowrap">
                  {levelSummary.availableSkillTokens} Available
                </span>
              </div>

              <div className="flex flex-col gap-2.5">
                {SKILL_TREE_NODES.map((node) => {
                  const unlocked = profile.unlockedSkills.includes(node.id);
                  const check = canUnlockSkillNode(
                    node.id,
                    profile,
                    levelSummary.availableSkillTokens
                  );
                  return (
                    <div
                      key={node.id}
                      className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="w-9 h-9 rounded-xl bg-[var(--acc-soft)] text-[var(--gold)] flex items-center justify-center shrink-0">
                          <Icon name={node.icon} size={17} />
                        </span>
                        <div className="min-w-0">
                          <div className="text-[11.5px] font-bold text-[var(--dim)] tabular-nums">
                            {node.branch} · Cost: {node.costTokens}{' '}
                            {node.costTokens === 1 ? 'Token' : 'Tokens'}
                          </div>
                          <div className="font-[var(--display)] font-bold text-[15px] text-[var(--ink)]">
                            {node.name}
                          </div>
                          <p className="text-[12.5px] text-[var(--dim)] leading-snug">
                            {node.effectSummary}
                          </p>
                        </div>
                      </div>

                      {unlocked ? (
                        <span className="text-[12.5px] font-bold text-[var(--green)] inline-flex items-center gap-1 shrink-0">
                          <Icon name="check" size={15} />
                          <span>Active</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          disabled={!check.ok}
                          onClick={() => {
                            if (!check.ok) return;
                            triggerLightHaptic(10);
                            playFx('win');
                            updateProfile((p) => ({
                              ...p,
                              unlockedSkills: [...p.unlockedSkills, node.id as SkillNodeId],
                            }));
                          }}
                          className="btn-tactile paper shrink-0 whitespace-nowrap disabled:opacity-50"
                        >
                          <span>{check.ok ? 'Unlock Ability' : check.reason}</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Unlocked World Equipment */}
            <section className="rtc-card rounded-2xl p-5 flex flex-col gap-3">
              <h2 className="h18 text-[var(--ink)]">Field Equipment &amp; Relics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {Object.values(EQUIPMENT_CATALOG).map((item) => {
                  const owned = profile.unlockedEquipment.includes(item.id);
                  const equipped = profile.equippedRelic === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`rounded-xl border p-3.5 flex flex-col justify-between gap-2 ${
                        owned
                          ? 'bg-[var(--bg)] border-[var(--acc-line)]'
                          : 'bg-[var(--bg)] border-[var(--line)] opacity-65'
                      }`}
                    >
                      <div>
                        <div className="text-[11px] font-bold text-[var(--gold)]">
                          {item.slot} · {SUBJECT_INFO[item.worldId].short}
                        </div>
                        <div className="font-[var(--display)] font-bold text-[14.5px] text-[var(--ink)]">
                          {item.name}
                        </div>
                        <p className="text-[12px] text-[var(--dim)] mt-0.5">{item.perkSummary}</p>
                      </div>
                      {owned ? (
                        <button
                          type="button"
                          onClick={() =>
                            updateProfile((p) => ({ ...p, equippedRelic: item.id }))
                          }
                          className="text-[12px] font-bold text-[var(--gold)] text-left cursor-pointer"
                        >
                          {equipped ? 'Equipped on Explorer' : 'Equip Relic'}
                        </button>
                      ) : (
                        <span className="text-[11.5px] text-[var(--dim)]">
                          Complete &ldquo;{item.unlockMissionTitle}&rdquo;
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      )}

      {/* TAB 3: STUDY GUILDS, MULTIPLAYER CHALLENGES & YOUTH SAFETY */}
      {hubTab === 'guilds' && (
        <div className="grid grid-cols-1 min-[880px]:grid-cols-12 gap-5 items-start">
          {/* Left: Active Guild & Squad Standings */}
          <div className="min-[880px]:col-span-7 flex flex-col gap-4">
            <section className="rtc-card rounded-2xl p-5 flex flex-col gap-4 border-[var(--acc-line)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-[12px] font-bold text-[var(--gold)]">
                    Active Study Guild · {currentGuild.activeScholars} Scholars
                  </div>
                  <h2 className="h22 text-[var(--ink)]">{currentGuild.name}</h2>
                  <p className="text-[13.5px] text-[var(--dim)]">{currentGuild.motto}</p>
                </div>
                <div className="text-left sm:text-right tabular-nums">
                  <div className="font-[var(--display)] font-extrabold text-[20px] text-[var(--ink)]">
                    {guildCombinedXp.toLocaleString()} / {currentGuild.weeklyTargetXp.toLocaleString()} XP
                  </div>
                  <div className="text-[12px] font-bold text-[var(--gold)]">
                    Your contribution: +{profile.guildContributionXp} XP
                  </div>
                </div>
              </div>

              <SmoothProgressBar
                value={guildPct}
                max={100}
                tone="emerald"
                heightClass="h-2.5"
                ariaLabel="Weekly guild target progress"
              />

              <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-[var(--line)]">
                <button
                  type="button"
                  onClick={onOpenDuel}
                  className="btn-tactile indigo whitespace-nowrap"
                >
                  <Icon name="trophy" size={16} />
                  <span>10-Question Classmate Duel</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenCbt}
                  className="btn-tactile paper whitespace-nowrap"
                >
                  <Icon name="clock" size={16} />
                  <span>Enter Exam Arena</span>
                </button>
              </div>
            </section>

            {/* Moderated Squad Feed */}
            <section className="rtc-card rounded-2xl p-5 flex flex-col gap-3.5">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="h18 text-[var(--ink)]">Guild Activity</h3>
                  <p className="text-[12.5px] text-[var(--dim)]">
                    Appearing as <strong>{studentGuildAlias}</strong> · Safe preset encouragement
                    only
                  </p>
                </div>
              </div>

              {guildNotice && (
                <div className="rounded-xl bg-[var(--acc-soft)] border border-[var(--acc-line)] px-3.5 py-2.5 text-[12.5px] font-semibold text-[var(--ink)]">
                  {guildNotice}
                </div>
              )}

              <div className="flex flex-col gap-2.5">
                {visiblePeers.map((peer) => {
                  const cheered = profile.sentCheerIds.includes(peer.id);
                  return (
                    <div
                      key={peer.id}
                      className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-3.5 flex flex-col gap-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-[var(--display)] font-bold text-[14.5px] text-[var(--ink)]">
                            {peer.alias}{' '}
                            <span className="text-[12px] font-semibold text-[var(--gold)]">
                              · {peer.roleTitle}
                            </span>
                          </div>
                          <p className="text-[13px] text-[var(--dim)]">{peer.recentAchievement}</p>
                        </div>
                        <span className="text-[12px] font-bold text-[var(--ink)] tabular-nums shrink-0">
                          +{peer.weeklyXp} XP
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--line)]">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {SAFE_GUILD_CHEERS.map((ch) => (
                            <button
                              key={ch.id}
                              type="button"
                              disabled={cheered}
                              onClick={() => {
                                triggerLightHaptic(6);
                                updateProfile((p) => ({
                                  ...p,
                                  sentCheerIds: [...p.sentCheerIds, peer.id],
                                }));
                                setGuildNotice(`Sent "${ch.label}" to ${peer.alias}.`);
                              }}
                              className="min-h-[30px] px-2.5 rounded-lg bg-[var(--card)] border border-[var(--line)] hover:border-[var(--acc-line)] text-[11.5px] font-bold text-[var(--ink)] cursor-pointer disabled:opacity-55 whitespace-nowrap"
                            >
                              {cheered ? 'Encouraged' : ch.label}
                            </button>
                          ))}
                        </div>

                        <div className="flex items-center gap-2 text-[11.5px] font-semibold text-[var(--dim)]">
                          <button
                            type="button"
                            onClick={() => {
                              updateProfile((p) => muteOrReportGuildPeer(p, peer.id, 'mute'));
                              setGuildNotice(`${peer.alias} has been hidden from your guild feed.`);
                            }}
                            className="hover:text-[var(--ink)] cursor-pointer"
                          >
                            Mute
                          </button>
                          <span aria-hidden="true">·</span>
                          <button
                            type="button"
                            onClick={() => {
                              updateProfile((p) => muteOrReportGuildPeer(p, peer.id, 'report'));
                              setGuildNotice(
                                `Reported ${peer.alias} for safety review and hidden from your feed.`
                              );
                            }}
                            className="hover:text-[var(--coral-ink)] cursor-pointer"
                          >
                            Report
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Right: Switch Guild + Youth Safety & Privacy Controls */}
          <div className="min-[880px]:col-span-5 flex flex-col gap-4">
            <section className="rtc-card rounded-2xl p-5 flex flex-col gap-3.5">
              <div>
                <div className="text-[12px] font-bold text-[var(--gold)]">Student Safety</div>
                <h3 className="h18 text-[var(--ink)]">Privacy &amp; Safety Controls</h3>
                <p className="text-[12.5px] text-[var(--dim)]">
                  Designed for safe, distraction-free academic collaboration.
                </p>
              </div>

              <label className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-3.5 flex items-center justify-between gap-3 cursor-pointer">
                <div>
                  <div className="font-bold text-[13.5px] text-[var(--ink)]">
                    Use private Scholar Alias
                  </div>
                  <div className="text-[12px] text-[var(--dim)]">
                    Shows {formatSafeGuildDisplayName(progress.name, true)} instead of your first
                    name
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={profile.privacySettings.hideRealNameInGuild}
                  onChange={(e) =>
                    updateProfile((p) => ({
                      ...p,
                      privacySettings: {
                        ...p.privacySettings,
                        hideRealNameInGuild: e.target.checked,
                      },
                    }))
                  }
                  className="w-5 h-5 accent-[var(--gold)]"
                />
              </label>

              <label className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-3.5 flex items-center justify-between gap-3 cursor-pointer">
                <div>
                  <div className="font-bold text-[13.5px] text-[var(--ink)]">
                    Allow Duel Code Challenges
                  </div>
                  <div className="text-[12px] text-[var(--dim)]">
                    Join 10-question timed subject races via shared code
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={profile.privacySettings.allowDuelInvites}
                  onChange={(e) =>
                    updateProfile((p) => ({
                      ...p,
                      privacySettings: {
                        ...p.privacySettings,
                        allowDuelInvites: e.target.checked,
                      },
                    }))
                  }
                  className="w-5 h-5 accent-[var(--gold)]"
                />
              </label>

              {profile.mutedPeerIds.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    updateProfile((p) => ({ ...p, mutedPeerIds: [] }));
                    setGuildNotice('Restored hidden guild members.');
                  }}
                  className="text-[12px] font-bold text-[var(--gold)] text-left cursor-pointer"
                >
                  Restore {profile.mutedPeerIds.length} muted scholar
                  {profile.mutedPeerIds.length === 1 ? '' : 's'}
                </button>
              )}
            </section>

            {/* Switch Guild */}
            <section className="rtc-card rounded-2xl p-5 flex flex-col gap-3">
              <h3 className="h18 text-[var(--ink)]">Academic Guilds</h3>
              <div className="flex flex-col gap-2">
                {GUILD_DIRECTORY.map((g) => {
                  const joined = profile.guildId === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => {
                        triggerLightHaptic(8);
                        updateProfile((p) => ({ ...p, guildId: g.id as GuildId }));
                      }}
                      className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                        joined
                          ? 'bg-[var(--acc-soft)] border-[var(--acc-line)]'
                          : 'bg-[var(--bg)] border-[var(--line)] hover:border-[var(--acc-line)]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-[var(--display)] font-bold text-[14.5px] text-[var(--ink)]">
                          {g.name}
                        </span>
                        <span className="text-[11.5px] font-bold text-[var(--gold)]">
                          {joined ? 'Joined' : 'Switch'}
                        </span>
                      </div>
                      <p className="text-[12px] text-[var(--dim)] mt-0.5">{g.specialty}</p>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
