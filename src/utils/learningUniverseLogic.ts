import type { SubjectId, Topic, UserProgress } from '../types';

export const UNIVERSE_PROFILE_STORAGE_KEY = 'eyak_universe_profile_v1';

export type ExplorerRole = 'explorer' | 'scientist' | 'detective' | 'inventor' | 'commander';

export type OutfitColorId = 'crimson' | 'emerald' | 'indigo' | 'amber';
export type HeadgearId = 'visor' | 'goggles' | 'circlet' | 'beret' | 'none';
export type EmblemId = 'heart' | 'atom' | 'flask' | 'compass';

export interface AvatarCustomization {
  role: ExplorerRole;
  outfitColor: OutfitColorId;
  headgear: HeadgearId;
  emblem: EmblemId;
}

export type SkillNodeId =
  | 'diagnostic_pulse'
  | 'first_principles'
  | 'second_wind_shield'
  | 'combo_surge'
  | 'guild_vanguard';

export type GuildId =
  | 'savanna-titans'
  | 'lagoon-navigators'
  | 'sahel-inventors'
  | 'rainforest-guardians';

export interface CompletedMissionRecord {
  bestAccuracyPct: number;
  xpEarned: number;
  attempts: number;
  firstTryDecision: boolean;
  unlockedTitle?: string;
  completedDay: number;
}

export interface DefeatedBossRecord {
  bestScore: number;
  total: number;
  xpEarned: number;
}

export interface UniverseProfile {
  avatar: AvatarCustomization;
  unlockedSkills: SkillNodeId[];
  unlockedEquipment: string[];
  equippedRelic: string | null;
  activeTitle: string;
  completedMissions: Record<string, CompletedMissionRecord>;
  defeatedBosses: Record<string, DefeatedBossRecord>;
  claimedQuestsByDay: Record<number, string[]>;
  guildId: GuildId;
  guildContributionXp: number;
  preferredHomeMode: 'universe' | 'classic';
  privacySettings: {
    hideRealNameInGuild: boolean;
    allowDuelInvites: boolean;
  };
  sentCheerIds: string[];
  mutedPeerIds: string[];
  reportedPeerIds: string[];
}

export interface SkillNodeDef {
  id: SkillNodeId;
  name: string;
  branch: 'Discovery' | 'Mastery' | 'Resilience';
  costTokens: number;
  requires?: SkillNodeId;
  effectSummary: string;
  icon: string;
}

export interface EquipmentItemDef {
  id: string;
  name: string;
  slot: 'Scanner' | 'Lens' | 'Thruster' | 'Cipher' | 'Crest';
  worldId: SubjectId;
  perkSummary: string;
  unlockMissionTitle: string;
}

export interface GuildDef {
  id: GuildId;
  name: string;
  motto: string;
  specialty: string;
  weeklyTargetXp: number;
  communityBaseXp: number;
  activeScholars: number;
  accentHex: string;
}

export interface DailyQuestDef {
  id: string;
  title: string;
  description: string;
  rewardXp: number;
  current: number;
  target: number;
  completed: boolean;
  claimed: boolean;
}

export const EXPLORER_ROLES: {
  id: ExplorerRole;
  title: string;
  tagline: string;
  specialty: string;
}[] = [
  {
    id: 'explorer',
    title: 'Field Explorer',
    tagline: 'Charts unknown biological & geographical worlds',
    specialty: 'Pathway & System Mapping',
  },
  {
    id: 'scientist',
    title: 'Chief Scientist',
    tagline: 'Tests hypotheses through controlled experiments',
    specialty: 'Reaction & Lab Precision',
  },
  {
    id: 'detective',
    title: 'Concept Detective',
    tagline: 'Spots hidden traps and diagnoses root causes',
    specialty: 'Diagnostic Clue Detection',
  },
  {
    id: 'inventor',
    title: 'Systems Inventor',
    tagline: 'Builds formulas, circuits, and working models',
    specialty: 'Applied Problem Solving',
  },
  {
    id: 'commander',
    title: 'Mission Commander',
    tagline: 'Leads guild squads and conquers boss arenas',
    specialty: 'Multi-Concept Boss Tactics',
  },
];

export const SKILL_TREE_NODES: SkillNodeDef[] = [
  {
    id: 'diagnostic_pulse',
    name: 'Diagnostic Pulse',
    branch: 'Discovery',
    costTokens: 1,
    effectSummary: 'Unlocks deep companion pathway clues during Stage 3 decisions.',
    icon: 'eye',
  },
  {
    id: 'first_principles',
    name: 'First-Principles Lens',
    branch: 'Mastery',
    costTokens: 1,
    requires: 'diagnostic_pulse',
    effectSummary: 'Highlights core scientific & mathematical laws in Stage 4 challenges.',
    icon: 'spark',
  },
  {
    id: 'second_wind_shield',
    name: 'Second-Wind Shield',
    branch: 'Resilience',
    costTokens: 1,
    effectSummary: 'Grants +1 extra shield pip (4 total) in World Boss Battles.',
    icon: 'shield',
  },
  {
    id: 'combo_surge',
    name: 'Mastery Surge',
    branch: 'Mastery',
    costTokens: 2,
    requires: 'first_principles',
    effectSummary: 'Awards +15% bonus XP when solving both Stage 3 & Stage 4 on the first try.',
    icon: 'bolt',
  },
  {
    id: 'guild_vanguard',
    name: 'Guild Vanguard',
    branch: 'Resilience',
    costTokens: 2,
    requires: 'second_wind_shield',
    effectSummary: 'Adds +25% bonus contribution points toward your Guild weekly target.',
    icon: 'crown',
  },
];

export const EQUIPMENT_CATALOG: Record<string, EquipmentItemDef> = {
  'bio-pulse-scanner': {
    id: 'bio-pulse-scanner',
    name: 'Bio-Pulse Scanner',
    slot: 'Scanner',
    worldId: 'bio',
    perkSummary: 'Monitors chamber oxygenation and circulation flow',
    unlockMissionTitle: 'The Heart Is Failing!',
  },
  'membrane-osmometer': {
    id: 'membrane-osmometer',
    name: 'Semi-Permeable Osmometer',
    slot: 'Lens',
    worldId: 'bio',
    perkSummary: 'Tracks tonicity balance across living cell membranes',
    unlockMissionTitle: 'Cellular Osmosis Emergency',
  },
  'catalyst-resonator': {
    id: 'catalyst-resonator',
    name: 'Active-Site Resonator',
    slot: 'Crest',
    worldId: 'bio',
    perkSummary: 'Stabilises enzyme optimum temperature and pH readings',
    unlockMissionTitle: 'The Enzyme Lock-and-Key Mystery',
  },
  'alchemist-spectacles': {
    id: 'alchemist-spectacles',
    name: 'Alchemist Valence Lens',
    slot: 'Lens',
    worldId: 'chem',
    perkSummary: 'Reveals outer electron shells and periodic group valency',
    unlockMissionTitle: 'Decode the Unknown Element',
  },
  'orbital-thruster-core': {
    id: 'orbital-thruster-core',
    name: 'Escape-Velocity Thruster',
    slot: 'Thruster',
    worldId: 'phys',
    perkSummary: 'Calibrates gravitational escape trajectories (11.2 km/s)',
    unlockMissionTitle: "Escape Earth's Gravity",
  },
  'temple-astrolabe-key': {
    id: 'temple-astrolabe-key',
    name: 'Golden Astrolabe Key',
    slot: 'Cipher',
    worldId: 'maths',
    perkSummary: 'Unlocks quadratic roots and geometric temple seals',
    unlockMissionTitle: 'Unlock the Ancient Temple',
  },
  'chronicle-quill': {
    id: 'chronicle-quill',
    name: 'Sovereign Concord Quill',
    slot: 'Crest',
    worldId: 'eng',
    perkSummary: 'Sharpens vowel phonetics, stress patterns, and concord precision',
    unlockMissionTitle: 'Voices of the Lost Manuscript',
  },
};

export const GUILD_DIRECTORY: GuildDef[] = [
  {
    id: 'savanna-titans',
    name: 'Savanna Titans',
    motto: 'Precision under pressure, mastery in every step.',
    specialty: 'Sciences & Quantitative Problem Solving',
    weeklyTargetXp: 12000,
    communityBaseXp: 9420,
    activeScholars: 184,
    accentHex: '#D97706',
  },
  {
    id: 'lagoon-navigators',
    name: 'Lagoon Navigators',
    motto: 'Chart the system, understand the whole.',
    specialty: 'Biology, Medicine & Life Systems',
    weeklyTargetXp: 12000,
    communityBaseXp: 10150,
    activeScholars: 212,
    accentHex: '#0284C7',
  },
  {
    id: 'sahel-inventors',
    name: 'Sahel Inventors',
    motto: 'First principles build unshakeable minds.',
    specialty: 'Engineering, Physics & Mathematics',
    weeklyTargetXp: 12000,
    communityBaseXp: 8890,
    activeScholars: 163,
    accentHex: '#7C3AED',
  },
  {
    id: 'rainforest-guardians',
    name: 'Rainforest Guardians',
    motto: 'Deep roots, clear reasoning, shared victory.',
    specialty: 'All-Rounders, Humanities & Life Sciences',
    weeklyTargetXp: 12000,
    communityBaseXp: 9780,
    activeScholars: 196,
    accentHex: '#059669',
  },
];

export const DEFAULT_UNIVERSE_PROFILE: UniverseProfile = {
  avatar: {
    role: 'explorer',
    outfitColor: 'indigo',
    headgear: 'visor',
    emblem: 'compass',
  },
  unlockedSkills: [],
  unlockedEquipment: [],
  equippedRelic: null,
  activeTitle: 'Cadet Explorer',
  completedMissions: {},
  defeatedBosses: {},
  claimedQuestsByDay: {},
  guildId: 'lagoon-navigators',
  guildContributionXp: 0,
  preferredHomeMode: 'universe',
  privacySettings: {
    hideRealNameInGuild: true,
    allowDuelInvites: true,
  },
  sentCheerIds: [],
  mutedPeerIds: [],
  reportedPeerIds: [],
};

export interface GuildPeerEntry {
  id: string;
  alias: string;
  roleTitle: string;
  weeklyXp: number;
  recentAchievement: string;
}

export const GUILD_PEER_ROSTER: Record<GuildId, GuildPeerEntry[]> = {
  'lagoon-navigators': [
    {
      id: 'peer-ln-1',
      alias: 'Scholar #214',
      roleTitle: 'Heart Explorer',
      weeklyXp: 840,
      recentAchievement: 'Completed Double Circulation Lab with 100% accuracy',
    },
    {
      id: 'peer-ln-2',
      alias: 'Scholar #509',
      roleTitle: 'Membrane Guardian',
      weeklyXp: 710,
      recentAchievement: 'Cleared Osmosis Emergency on first try',
    },
    {
      id: 'peer-ln-3',
      alias: 'Scholar #832',
      roleTitle: 'Catalyst Master',
      weeklyXp: 645,
      recentAchievement: 'Solved 3 enzyme kinetics challenges',
    },
  ],
  'savanna-titans': [
    {
      id: 'peer-st-1',
      alias: 'Scholar #118',
      roleTitle: 'Element Decoder',
      weeklyXp: 890,
      recentAchievement: 'Decoded Period 3 valence shells without hints',
    },
    {
      id: 'peer-st-2',
      alias: 'Scholar #407',
      roleTitle: 'Orbital Commander',
      weeklyXp: 760,
      recentAchievement: 'Locked 11.2 km/s escape trajectory',
    },
    {
      id: 'peer-st-3',
      alias: 'Scholar #691',
      roleTitle: 'Temple Cipher',
      weeklyXp: 620,
      recentAchievement: 'Completed Quadratic Temple Seal',
    },
  ],
  'sahel-inventors': [
    {
      id: 'peer-si-1',
      alias: 'Scholar #305',
      roleTitle: 'Grid Engineer',
      weeklyXp: 815,
      recentAchievement: 'Balanced parallel station power circuits',
    },
    {
      id: 'peer-si-2',
      alias: 'Scholar #744',
      roleTitle: 'Geometry Sovereign',
      weeklyXp: 695,
      recentAchievement: 'Solved cyclic quadrilateral angle proof',
    },
    {
      id: 'peer-si-3',
      alias: 'Scholar #912',
      roleTitle: 'Stoichiometry Alchemist',
      weeklyXp: 590,
      recentAchievement: 'Reached exact pH 7.0 equivalence',
    },
  ],
  'rainforest-guardians': [
    {
      id: 'peer-rg-1',
      alias: 'Scholar #162',
      roleTitle: 'Chronicle Orator',
      weeklyXp: 830,
      recentAchievement: 'Mastered accompaniment and proximity concord',
    },
    {
      id: 'peer-rg-2',
      alias: 'Scholar #488',
      roleTitle: 'Chief Bio-Commander',
      weeklyXp: 740,
      recentAchievement: 'Defeated the Systemic Collapse Boss',
    },
    {
      id: 'peer-rg-3',
      alias: 'Scholar #627',
      roleTitle: 'Temple Cipher',
      weeklyXp: 610,
      recentAchievement: 'Raised quadratic accuracy from 67% to 100%',
    },
  ],
};

export const SAFE_GUILD_CHEERS: { id: string; label: string }[] = [
  { id: 'well-reasoned', label: 'Sharp reasoning!' },
  { id: 'keep-going', label: 'Keep the streak alive!' },
  { id: 'great-improvement', label: 'Great improvement!' },
];

const VALID_ROLES = new Set<ExplorerRole>([
  'explorer',
  'scientist',
  'detective',
  'inventor',
  'commander',
]);
const VALID_COLORS = new Set<OutfitColorId>(['crimson', 'emerald', 'indigo', 'amber']);
const VALID_HEADGEAR = new Set<HeadgearId>(['visor', 'goggles', 'circlet', 'beret', 'none']);
const VALID_EMBLEMS = new Set<EmblemId>(['heart', 'atom', 'flask', 'compass']);
const VALID_SKILLS = new Set<SkillNodeId>(SKILL_TREE_NODES.map((s) => s.id));
const VALID_GUILDS = new Set<GuildId>(GUILD_DIRECTORY.map((g) => g.id));

export function parseUniverseProfile(raw: string | null | undefined): UniverseProfile {
  if (!raw || raw.length > 200_000) {
    return structuredCloneDefaultProfile();
  }
  try {
    const p = JSON.parse(raw) as Partial<UniverseProfile>;
    if (!p || typeof p !== 'object' || Array.isArray(p)) {
      return structuredCloneDefaultProfile();
    }
    const role = VALID_ROLES.has(p.avatar?.role as ExplorerRole)
      ? (p.avatar!.role as ExplorerRole)
      : DEFAULT_UNIVERSE_PROFILE.avatar.role;
    const outfitColor = VALID_COLORS.has(p.avatar?.outfitColor as OutfitColorId)
      ? (p.avatar!.outfitColor as OutfitColorId)
      : DEFAULT_UNIVERSE_PROFILE.avatar.outfitColor;
    const headgear = VALID_HEADGEAR.has(p.avatar?.headgear as HeadgearId)
      ? (p.avatar!.headgear as HeadgearId)
      : DEFAULT_UNIVERSE_PROFILE.avatar.headgear;
    const emblem = VALID_EMBLEMS.has(p.avatar?.emblem as EmblemId)
      ? (p.avatar!.emblem as EmblemId)
      : DEFAULT_UNIVERSE_PROFILE.avatar.emblem;

    const unlockedSkills = Array.isArray(p.unlockedSkills)
      ? p.unlockedSkills.filter((id): id is SkillNodeId => VALID_SKILLS.has(id as SkillNodeId))
      : [];
    const unlockedEquipment = Array.isArray(p.unlockedEquipment)
      ? p.unlockedEquipment
          .filter((x): x is string => typeof x === 'string' && x.length <= 64)
          .slice(0, 60)
      : [];
    const equippedRelic =
      typeof p.equippedRelic === 'string' && unlockedEquipment.includes(p.equippedRelic)
        ? p.equippedRelic
        : unlockedEquipment[0] || null;

    const completedMissions: Record<string, CompletedMissionRecord> = {};
    if (p.completedMissions && typeof p.completedMissions === 'object') {
      for (const [k, v] of Object.entries(p.completedMissions)) {
        if (v && typeof v === 'object' && k.length <= 80) {
          completedMissions[k] = {
            bestAccuracyPct: Math.max(0, Math.min(100, Math.round(Number(v.bestAccuracyPct) || 0))),
            xpEarned: Math.max(0, Math.min(5000, Math.round(Number(v.xpEarned) || 0))),
            attempts: Math.max(1, Math.min(999, Math.round(Number(v.attempts) || 1))),
            firstTryDecision: Boolean(v.firstTryDecision),
            unlockedTitle:
              typeof v.unlockedTitle === 'string' ? v.unlockedTitle.slice(0, 60) : undefined,
            completedDay: Math.max(0, Math.round(Number(v.completedDay) || 0)),
          };
        }
      }
    }

    const defeatedBosses: Record<string, DefeatedBossRecord> = {};
    if (p.defeatedBosses && typeof p.defeatedBosses === 'object') {
      for (const [k, v] of Object.entries(p.defeatedBosses)) {
        if (v && typeof v === 'object' && k.length <= 80) {
          defeatedBosses[k] = {
            bestScore: Math.max(0, Math.round(Number(v.bestScore) || 0)),
            total: Math.max(1, Math.round(Number(v.total) || 5)),
            xpEarned: Math.max(0, Math.min(5000, Math.round(Number(v.xpEarned) || 0))),
          };
        }
      }
    }

    const claimedQuestsByDay: Record<number, string[]> = {};
    if (p.claimedQuestsByDay && typeof p.claimedQuestsByDay === 'object') {
      for (const [dayKey, arr] of Object.entries(p.claimedQuestsByDay)) {
        const dayNum = Number(dayKey);
        if (Number.isFinite(dayNum) && Array.isArray(arr)) {
          claimedQuestsByDay[dayNum] = arr
            .filter((q): q is string => typeof q === 'string' && q.length <= 50)
            .slice(0, 10);
        }
      }
    }

    return {
      avatar: { role, outfitColor, headgear, emblem },
      unlockedSkills: Array.from(new Set(unlockedSkills)),
      unlockedEquipment: Array.from(new Set(unlockedEquipment)),
      equippedRelic,
      activeTitle:
        typeof p.activeTitle === 'string' && p.activeTitle.trim().length > 0
          ? p.activeTitle.trim().slice(0, 50)
          : DEFAULT_UNIVERSE_PROFILE.activeTitle,
      completedMissions,
      defeatedBosses,
      claimedQuestsByDay,
      guildId: VALID_GUILDS.has(p.guildId as GuildId)
        ? (p.guildId as GuildId)
        : DEFAULT_UNIVERSE_PROFILE.guildId,
      guildContributionXp: Math.max(0, Math.round(Number(p.guildContributionXp) || 0)),
      preferredHomeMode: p.preferredHomeMode === 'classic' ? 'classic' : 'universe',
      privacySettings: {
        hideRealNameInGuild:
          typeof p.privacySettings?.hideRealNameInGuild === 'boolean'
            ? p.privacySettings.hideRealNameInGuild
            : true,
        allowDuelInvites:
          typeof p.privacySettings?.allowDuelInvites === 'boolean'
            ? p.privacySettings.allowDuelInvites
            : true,
      },
      sentCheerIds: Array.isArray(p.sentCheerIds)
        ? p.sentCheerIds.filter((x): x is string => typeof x === 'string' && x.length <= 64).slice(0, 80)
        : [],
      mutedPeerIds: Array.isArray(p.mutedPeerIds)
        ? p.mutedPeerIds.filter((x): x is string => typeof x === 'string' && x.length <= 64).slice(0, 80)
        : [],
      reportedPeerIds: Array.isArray(p.reportedPeerIds)
        ? p.reportedPeerIds.filter((x): x is string => typeof x === 'string' && x.length <= 64).slice(0, 80)
        : [],
    };
  } catch {
    return structuredCloneDefaultProfile();
  }
}

function structuredCloneDefaultProfile(): UniverseProfile {
  return {
    avatar: { ...DEFAULT_UNIVERSE_PROFILE.avatar },
    unlockedSkills: [],
    unlockedEquipment: [],
    equippedRelic: null,
    activeTitle: DEFAULT_UNIVERSE_PROFILE.activeTitle,
    completedMissions: {},
    defeatedBosses: {},
    claimedQuestsByDay: {},
    guildId: DEFAULT_UNIVERSE_PROFILE.guildId,
    guildContributionXp: 0,
    preferredHomeMode: 'universe',
    privacySettings: { ...DEFAULT_UNIVERSE_PROFILE.privacySettings },
    sentCheerIds: [],
    mutedPeerIds: [],
    reportedPeerIds: [],
  };
}

export function formatSafeGuildDisplayName(rawName: string, hideRealName: boolean): string {
  const trimmed = (rawName || '').trim();
  if (hideRealName || !trimmed) {
    let hash = 0;
    const seed = trimmed || 'scholar';
    for (let i = 0; i < seed.length; i++) {
      hash = (hash * 31 + seed.charCodeAt(i)) % 900;
    }
    return `Scholar #${100 + hash}`;
  }
  const firstWord = trimmed.split(/\s+/)[0] || 'Scholar';
  return firstWord.slice(0, 20);
}

export function muteOrReportGuildPeer(
  profile: UniverseProfile,
  peerId: string,
  action: 'mute' | 'report'
): UniverseProfile {
  const cleanId = peerId.trim().slice(0, 64);
  if (!cleanId) return profile;
  const nextMuted = Array.from(new Set([...profile.mutedPeerIds, cleanId]));
  const nextReported =
    action === 'report'
      ? Array.from(new Set([...profile.reportedPeerIds, cleanId]))
      : profile.reportedPeerIds;
  return {
    ...profile,
    mutedPeerIds: nextMuted,
    reportedPeerIds: nextReported,
  };
}

export function loadUniverseProfile(): UniverseProfile {
  if (typeof window === 'undefined') return structuredCloneDefaultProfile();
  try {
    return parseUniverseProfile(window.localStorage.getItem(UNIVERSE_PROFILE_STORAGE_KEY));
  } catch {
    return structuredCloneDefaultProfile();
  }
}

export function saveUniverseProfile(profile: UniverseProfile): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(UNIVERSE_PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch {
    /* ignore storage quota */
  }
}

export interface MissionEvaluationInput {
  baseXpReward: number;
  explorationCompleted: boolean;
  decisionSolved: boolean;
  decisionWrongAttempts: number;
  applicationSolved: boolean;
  applicationWrongAttempts: number;
  teachBackSolved: boolean;
  teachBackWrongAttempts: number;
  previousBestAccuracyPct?: number;
  previousXpEarned?: number;
  hasComboSurgeSkill?: boolean;
}

export interface MissionEvaluationResult {
  passedMastery: boolean;
  accuracyPct: number;
  rawEarnedXp: number;
  netNewXpAwarded: number;
  improvementBonusXp: number;
  skillBonusXp: number;
  breakdown: {
    explorationXp: number;
    decisionXp: number;
    applicationAndTeachBackXp: number;
  };
  feedbackSummary: string;
}

/**
 * Enforces the strict pedagogical rule:
 * "Don't award all the XP just for clicking through lessons.
 *  Reward actual understanding, problem-solving and improvement."
 */
export function calculateMissionMasteryReward(
  input: MissionEvaluationInput
): MissionEvaluationResult {
  const maxReward = Math.max(50, Math.round(input.baseXpReward));
  const solvedCount =
    (input.decisionSolved ? 1 : 0) +
    (input.applicationSolved ? 1 : 0) +
    (input.teachBackSolved ? 1 : 0);

  // Zero click-through farming: if no reasoning problems were solved, 0 XP is awarded.
  if (solvedCount === 0) {
    return {
      passedMastery: false,
      accuracyPct: 0,
      rawEarnedXp: 0,
      netNewXpAwarded: 0,
      improvementBonusXp: 0,
      skillBonusXp: 0,
      breakdown: {
        explorationXp: 0,
        decisionXp: 0,
        applicationAndTeachBackXp: 0,
      },
      feedbackSummary:
        'Solve the mission decision and mastery check to earn XP through genuine understanding.',
    };
  }

  // Penalty per wrong guess before getting it right encourages thoughtful reasoning over blind clicking
  const decisionFactor = input.decisionSolved
    ? Math.max(0.45, 1 - input.decisionWrongAttempts * 0.25)
    : 0;
  const applicationFactor = input.applicationSolved
    ? Math.max(0.45, 1 - input.applicationWrongAttempts * 0.25)
    : 0;
  const teachBackFactor = input.teachBackSolved
    ? Math.max(0.5, 1 - input.teachBackWrongAttempts * 0.25)
    : 0;

  const accuracyPct = Math.round(
    ((decisionFactor + applicationFactor + teachBackFactor) / 3) * 100
  );

  // Exploration accounts for only 14% of base XP (and requires solving at least 1 check);
  // 86% comes strictly from Stage 3 Decision + Stage 4 Application & Teach-Back!
  const explorationXp = input.explorationCompleted ? Math.round(maxReward * 0.14) : 0;
  const decisionXp = Math.round(maxReward * 0.36 * decisionFactor);
  const applicationAndTeachBackXp = Math.round(
    maxReward * 0.5 * ((applicationFactor + teachBackFactor) / 2)
  );

  const rawSubtotal = explorationXp + decisionXp + applicationAndTeachBackXp;
  const passedMastery =
    input.decisionSolved && input.applicationSolved && input.teachBackSolved && accuracyPct >= 65;

  const isPerfectFirstTry =
    passedMastery &&
    input.explorationCompleted &&
    input.decisionWrongAttempts === 0 &&
    input.applicationWrongAttempts === 0 &&
    input.teachBackWrongAttempts === 0;

  const rawEarnedXp = isPerfectFirstTry ? maxReward : Math.min(maxReward, rawSubtotal);
  const prevXp = Math.max(0, Math.round(input.previousXpEarned || 0));
  const prevAcc = Math.max(0, Math.round(input.previousBestAccuracyPct || 0));

  // Reward genuine improvement when a student raises their accuracy on a replay!
  const improvedAccuracy = prevAcc > 0 && accuracyPct > prevAcc;
  const improvementBonusXp = improvedAccuracy
    ? Math.max(15, Math.round(((accuracyPct - prevAcc) / 100) * 50))
    : 0;

  const deltaBaseXp = Math.max(0, rawEarnedXp - prevXp);
  const skillBonusXp =
    isPerfectFirstTry && input.hasComboSurgeSkill && deltaBaseXp > 0
      ? Math.round(deltaBaseXp * 0.15)
      : 0;

  const netNewXpAwarded = deltaBaseXp + improvementBonusXp + skillBonusXp;

  let feedbackSummary = 'Solid reasoning — your mastery score reflects what you truly understand.';
  if (isPerfectFirstTry) {
    feedbackSummary =
      'Flawless first-try mastery! You proved both how the system works and why.';
  } else if (improvedAccuracy) {
    feedbackSummary = `Genuine improvement! You raised your understanding from ${prevAcc}% to ${accuracyPct}%.`;
  } else if (prevXp >= rawEarnedXp && prevXp > 0) {
    feedbackSummary =
      'Great practice! Improve on your previous accuracy or tackle a new mission to earn more XP.';
  }

  return {
    passedMastery,
    accuracyPct,
    rawEarnedXp,
    netNewXpAwarded,
    improvementBonusXp,
    skillBonusXp,
    breakdown: {
      explorationXp,
      decisionXp,
      applicationAndTeachBackXp,
    },
    feedbackSummary,
  };
}

export interface UniverseLevelSummary {
  level: number;
  levelTitle: string;
  totalXp: number;
  currentLevelXp: number;
  nextLevelThresholdXp: number;
  levelProgressPct: number;
  baseTier: 1 | 2 | 3 | 4;
  baseName: string;
  baseDescription: string;
  earnedSkillTokens: number;
  availableSkillTokens: number;
  completedMissionCount: number;
  defeatedBossCount: number;
}

export function computeUniverseLevelSummary(
  appXp: number,
  profile: UniverseProfile
): UniverseLevelSummary {
  const safeXp = Math.max(0, Math.round(appXp || 0));
  // Smooth RPG curve: Level 1 (0..249), Level 2 (250..549), Level 3 (550..899), Level 4 (900..1299)...
  let level = 1;
  let thresholdStart = 0;
  let span = 250;
  while (safeXp >= thresholdStart + span && level < 30) {
    thresholdStart += span;
    level += 1;
    span = 250 + (level - 1) * 75;
  }

  const currentLevelXp = safeXp - thresholdStart;
  const nextLevelThresholdXp = span;
  const levelProgressPct = Math.min(
    100,
    Math.max(4, Math.round((currentLevelXp / Math.max(1, nextLevelThresholdXp)) * 100))
  );

  const levelTitle =
    level >= 12
      ? 'Grand Universe Commander'
      : level >= 8
        ? 'Master Systems Architect'
        : level >= 5
          ? 'Senior Field Specialist'
          : level >= 3
            ? 'Rising World Explorer'
            : 'Initiate Explorer';

  const baseTier: 1 | 2 | 3 | 4 =
    level >= 9 ? 4 : level >= 6 ? 3 : level >= 3 ? 2 : 1;

  const baseMeta: Record<1 | 2 | 3 | 4, { name: string; desc: string }> = {
    1: {
      name: 'Skybridge Field Outpost',
      desc: 'Your personal expedition camp overlooking the subject worlds.',
    },
    2: {
      name: 'Solar Observatory Sanctum',
      desc: 'Upgraded base with a live specimen bench and world telescope.',
    },
    3: {
      name: 'Bio-Dome Command Citadel',
      desc: 'Multi-wing academy citadel housing your unlocked relics and guild banner.',
    },
    4: {
      name: 'Grand Astral Nexus',
      desc: 'Legendary floating sanctuary powered by cross-subject mastery.',
    },
  };

  const completedMissionCount = Object.values(profile.completedMissions).filter(
    (m) => m.bestAccuracyPct >= 65
  ).length;
  const defeatedBossCount = Object.keys(profile.defeatedBosses).length;
  const spentTokens = profile.unlockedSkills.reduce((sum, id) => {
    const node = SKILL_TREE_NODES.find((n) => n.id === id);
    return sum + (node ? node.costTokens : 1);
  }, 0);

  // Give 1 starter token on first completed mission + 1 per mission + 2 per boss (+1 at Level >= 2)
  const levelBonusTokens = Math.floor((level - 1) / 2);
  const earnedSkillTokens =
    completedMissionCount + defeatedBossCount * 2 + levelBonusTokens;
  const availableSkillTokens = Math.max(0, earnedSkillTokens - spentTokens);

  return {
    level,
    levelTitle,
    totalXp: safeXp,
    currentLevelXp,
    nextLevelThresholdXp,
    levelProgressPct,
    baseTier,
    baseName: baseMeta[baseTier].name,
    baseDescription: baseMeta[baseTier].desc,
    earnedSkillTokens,
    availableSkillTokens,
    completedMissionCount,
    defeatedBossCount,
  };
}

export function canUnlockSkillNode(
  nodeId: SkillNodeId,
  profile: UniverseProfile,
  availableTokens: number
): { ok: boolean; reason?: string } {
  if (profile.unlockedSkills.includes(nodeId)) {
    return { ok: false, reason: 'Already unlocked' };
  }
  const node = SKILL_TREE_NODES.find((n) => n.id === nodeId);
  if (!node) return { ok: false, reason: 'Unknown ability' };
  if (node.requires && !profile.unlockedSkills.includes(node.requires)) {
    const reqNode = SKILL_TREE_NODES.find((n) => n.id === node.requires);
    return { ok: false, reason: `Requires ${reqNode?.name || node.requires} first` };
  }
  if (availableTokens < node.costTokens) {
    return {
      ok: false,
      reason: `Needs ${node.costTokens} Mastery Token${node.costTokens > 1 ? 's' : ''}`,
    };
  }
  return { ok: true };
}

export function evaluateDailyUniverseQuests(
  profile: UniverseProfile,
  progress: UserProgress,
  curDay: number
): DailyQuestDef[] {
  const claimedSet = new Set(profile.claimedQuestsByDay[curDay] || []);
  const missionsToday = Object.values(profile.completedMissions).filter(
    (m) => m.completedDay === curDay && m.bestAccuracyPct >= 65
  );
  const firstTryCount = Object.values(profile.completedMissions).filter(
    (m) => m.firstTryDecision
  ).length;
  const todayAnswered = progress.act[curDay] || 0;

  const rawQuests: Omit<DailyQuestDef, 'completed' | 'claimed'>[] = [
    {
      id: 'quest-complete-mission',
      title: 'Complete a World Mission',
      description: 'Finish all 4 stages of any learning mission with at least 65% understanding.',
      rewardXp: 60,
      current: Math.min(1, missionsToday.length),
      target: 1,
    },
    {
      id: 'quest-sharp-decision',
      title: 'First-Try Tactical Decision',
      description: 'Solve a Stage 3 mission decision on your very first attempt.',
      rewardXp: 50,
      current: Math.min(1, firstTryCount),
      target: 1,
    },
    {
      id: 'quest-guild-momentum',
      title: 'Guild Study Contribution',
      description: 'Solve 4 mission or practice questions today to power your Academic Guild.',
      rewardXp: 75,
      current: Math.min(4, todayAnswered + missionsToday.length * 3),
      target: 4,
    },
  ];

  return rawQuests.map((q) => ({
    ...q,
    completed: q.current >= q.target,
    claimed: claimedSet.has(q.id),
  }));
}

export interface CompanionRescueSuggestion {
  topicId: string;
  topicName: string;
  sectionName: string;
  reasonLine: string;
  companionHook: string;
}

/**
 * Inspects the student's real curriculum history & mistakes to suggest a tailored weak-topic adventure.
 */
export function pickWeakTopicForCompanionAdventure(
  subj: SubjectId,
  topics: Topic[],
  progress: UserProgress,
  companionName: string
): CompanionRescueSuggestion | null {
  if (!topics || topics.length === 0) return null;

  // 1. Prioritize any open mistake in this subject
  const mistakesList = Object.values(progress.mistakes || {}).filter(
    (m) => m.subj === subj && m.clearCount < m.missCount
  );
  if (mistakesList.length > 0) {
    const topMistake = mistakesList.sort((a, b) => b.missCount - a.missCount)[0];
    const matched = topics.find((t) => t.id === topMistake.tid);
    if (matched) {
      return {
        topicId: matched.id,
        topicName: matched.name,
        sectionName: matched.sec,
        reasonLine: `Targeted from your recent slip-up (${topMistake.missCount} open miss${
          topMistake.missCount > 1 ? 'es' : ''
        })`,
        companionHook: `${companionName} built a rescue mission around ${matched.name} so that exam trap never catches you again.`,
      };
    }
  }

  // 2. Otherwise pick the first unpassed syllabus topic
  const unpassed = topics.find((t) => !progress.t[t.id]?.boss);
  const chosen = unpassed || topics[0];
  return {
    topicId: chosen.id,
    topicName: chosen.name,
    sectionName: chosen.sec,
    reasonLine: unpassed ? 'Next frontier on your syllabus map' : 'Mastery reinforcement mission',
    companionHook: `${companionName} scouted a playable field mission on ${chosen.name} tailored to your level.`,
  };
}
