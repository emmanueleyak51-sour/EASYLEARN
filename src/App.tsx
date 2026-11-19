import React, { useCallback, useEffect, useRef, useState } from 'react';
import type {
  ChemClassId,
  ClockFormat,
  MasteryThemeId,
  Question,
  QuizSession,
  ScreenName,
  SubjectId,
  ThemeAppearanceMode,
  ThemeLockMode,
  TopicTestSession,
  UserProgress,
} from './types';
import {
  BOSS_HP,
  BOSS_TIME,
  PRACTICE_LEN,
  STORAGE_KEY,
  bossList,
  dueList,
  dxList,
  evaluateNewBadges,
  makeBlankProgress,
  mastery,
  pickPractice,
  predicted,
  recordAnswer,
  today,
  tstate,
  type BadgeDef,
} from './utils/engine';
import {
  SUBJECT_IDS,
  findQuestion,
  getInteractiveLesson,
  getTopic,
  getTopics,
  getTopicsForProgress,
} from './data/curriculum';
import { getLabById } from './data/labs';
import { buzz, sfx, type SoundEffectName } from './utils/sound';
import { stripPrototypePollution } from './utils/securityPolicy';
import {
  clearSessionUnlock,
  isSessionUnlocked,
  setSessionUnlocked,
} from './utils/authAccounts';
import {
  computeGoalProgress,
  resolveEffectiveThemeId,
  resolveEffectiveThemeMode,
} from './utils/masteryThemeLogic';
import {
  computeScreenTransition,
  type ScreenTransitionSpec,
} from './utils/screenTransitionLogic';
import { AppShell, type MainTab } from './components/AppShell';
import { ClockFormatProvider } from './components/WatClock';
import { FloatingLiveCoach } from './components/FloatingLiveCoach';
import { BadgeUnlockCelebration, type XpBurstItem } from './components/FxCelebration';
import { LiveCoachProvider, type ActiveLiveContextEntry } from './context/LiveCoachContext';
import { DxIntroScreen, WelcomeScreen } from './components/screens/OnboardingScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { TopicsMapScreen } from './components/screens/TopicsMapScreen';
import { TopicHubScreen } from './components/screens/TopicHubScreen';
import { NotesScreen } from './components/screens/NotesScreen';
import { LessonScreen } from './components/screens/LessonScreen';
import { QuizScreen, SummaryScreen } from './components/screens/QuizScreen';
import { TopicTestScreen } from './components/screens/TopicTestScreen';
import { LabListScreen, LabPlayerScreen } from './components/screens/LabScreens';
import { ChemFormulasScreen } from './components/screens/ChemFormulasScreen';
import { ReviewScreen } from './components/screens/ReviewScreen';
import { AccountScreen, SubjectsScreen } from './components/screens/AccountScreen';
import { CbtExamScreen } from './components/screens/CbtExamScreen';
import { MistakeVaultScreen } from './components/screens/MistakeVaultScreen';
import { StudyPlannerScreen } from './components/screens/StudyPlannerScreen';
import { InteractiveSandboxesScreen } from './components/screens/InteractiveSandboxesScreen';
import { TheoryCoachScreen } from './components/screens/TheoryCoachScreen';
import { TranscriptScreen } from './components/screens/TranscriptScreen';
import { PeerDuelScreen } from './components/screens/PeerDuelScreen';
import { LeaderboardScreen } from './components/screens/LeaderboardScreen';
import { ErrorBoundary } from './components/ErrorBoundary';
import { CloudSyncProvider } from './context/CloudSyncContext';
import { OfflineIndicator } from './components/PWAInstallBanner';
import { redeemMistakeRecord, upsertMistakeRecord } from './utils/mistakeVaultLogic';
import { parseDuelCode } from './utils/peerDuelLogic';
import type { StudyPlanConfig } from './utils/studyPlannerLogic';
import { QuestionBankManagerModal, type QuestionBankTab } from './components/QuestionBankManagerModal';

function loadInitialProgress(): { progress: UserProgress; startScreen: ScreenName; initialDuelCode: string | null } {
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const autostart = params?.get('autostart') === '1';
  const duelParam = params?.get('duel') || null;
  const parsedDuel = duelParam ? parseDuelCode(duelParam) : null;

  let parsed: Partial<UserProgress> | null = null;
  try {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (raw && raw.length <= 2_000_000) {
      const obj = JSON.parse(raw);
      if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
        parsed = stripPrototypePollution(obj) as Partial<UserProgress>;
      }
    }
  } catch {
    parsed = null;
  }

  const base = makeBlankProgress();
  const safeTarget = Number.isFinite(Number(parsed?.target))
    ? Math.min(100, Math.max(50, Math.round(Number(parsed?.target))))
    : base.target;
  const safeSubj =
    typeof parsed?.subj === 'string' && (SUBJECT_IDS as readonly string[]).includes(parsed.subj)
      ? (parsed.subj as SubjectId)
      : base.subj;
  const safeSubjs = Array.isArray(parsed?.subjs)
    ? (parsed.subjs.filter((s): s is SubjectId =>
        typeof s === 'string' && (SUBJECT_IDS as readonly string[]).includes(s)
      ) as SubjectId[])
    : [];

  const merged: UserProgress = {
    ...base,
    ...parsed,
    name: typeof parsed?.name === 'string' ? parsed.name.trim().slice(0, 60) : base.name,
    target: safeTarget,
    subj: safeSubj,
    streak: {
      d: Number.isFinite(Number(parsed?.streak?.d)) ? Math.max(0, Math.floor(Number(parsed?.streak?.d))) : base.streak.d,
      n: Number.isFinite(Number(parsed?.streak?.n)) ? Math.min(3650, Math.max(0, Math.floor(Number(parsed?.streak?.n)))) : base.streak.n,
    },
    cust: {
      add: Array.isArray(parsed?.cust?.add) ? parsed.cust.add.slice(0, 500) : [],
      edit: parsed?.cust?.edit && typeof parsed.cust.edit === 'object' ? parsed.cust.edit : {},
      del: parsed?.cust?.del && typeof parsed.cust.del === 'object' ? parsed.cust.del : {},
    },
    subjs: safeSubjs.length > 0 ? safeSubjs : base.subjs,
  };

  // One-time migrations so returning localStorage users automatically see English & Physics
  if (!merged.flags['migrated:eng_v1']) {
    if (!merged.subjs.includes('eng')) {
      merged.subjs = [...merged.subjs, 'eng'];
    }
    merged.flags = { ...merged.flags, 'migrated:eng_v1': 1 };
  }
  if (!merged.flags['migrated:phys_v1']) {
    if (!merged.subjs.includes('phys')) {
      merged.subjs = [...merged.subjs, 'phys'];
    }
    merged.flags = { ...merged.flags, 'migrated:phys_v1': 1 };
  }
  if (!merged.flags['migrated:bio_v1']) {
    if (!merged.subjs.includes('bio')) {
      const engIdx = merged.subjs.indexOf('eng');
      if (engIdx >= 0) {
        merged.subjs = [
          ...merged.subjs.slice(0, engIdx),
          'bio',
          ...merged.subjs.slice(engIdx),
        ];
      } else {
        merged.subjs = [...merged.subjs, 'bio'];
      }
    }
    merged.flags = { ...merged.flags, 'migrated:bio_v1': 1 };
  }
  if (!merged.flags['migrated:econ_v1']) {
    if (!merged.subjs.includes('econ')) {
      const engIdx = merged.subjs.indexOf('eng');
      if (engIdx >= 0) {
        merged.subjs = [
          ...merged.subjs.slice(0, engIdx),
          'econ',
          ...merged.subjs.slice(engIdx),
        ];
      } else {
        merged.subjs = [...merged.subjs, 'econ'];
      }
    }
    merged.flags = { ...merged.flags, 'migrated:econ_v1': 1 };
  }
  if (!merged.flags['migrated:agric_v1']) {
    if (!merged.subjs.includes('agric')) {
      const econIdx = merged.subjs.indexOf('econ');
      const engIdx = merged.subjs.indexOf('eng');
      const insertIdx = econIdx >= 0 ? econIdx : engIdx;
      if (insertIdx >= 0) {
        merged.subjs = [
          ...merged.subjs.slice(0, insertIdx),
          'agric',
          ...merged.subjs.slice(insertIdx),
        ];
      } else {
        merged.subjs = [...merged.subjs, 'agric'];
      }
    }
    merged.flags = { ...merged.flags, 'migrated:agric_v1': 1 };
  }
  if (!merged.flags['migrated:civic_v1']) {
    if (!merged.subjs.includes('civic')) {
      merged.subjs = [...merged.subjs, 'civic'];
    }
    merged.flags = { ...merged.flags, 'migrated:civic_v1': 1 };
  }
  if (!merged.flags['migrated:fmaths_v1']) {
    if (!merged.subjs.includes('fmaths')) {
      merged.subjs = [...merged.subjs, 'fmaths'];
    }
    merged.flags = { ...merged.flags, 'migrated:fmaths_v1': 1 };
  }
  if (!merged.flags['migrated:geog_v1']) {
    if (!merged.subjs.includes('geog')) {
      merged.subjs = [...merged.subjs, 'geog'];
    }
    merged.flags = { ...merged.flags, 'migrated:geog_v1': 1 };
  }
  if (!merged.flags['migrated:digitech_v1']) {
    if (!merged.subjs.includes('digitech')) {
      merged.subjs = [...merged.subjs, 'digitech'];
    }
    merged.flags = { ...merged.flags, 'migrated:digitech_v1': 1 };
  }
  if (!merged.flags['migrated:dataproc_v1']) {
    if (!merged.subjs.includes('dataproc')) {
      merged.subjs = [...merged.subjs, 'dataproc'];
    }
    merged.flags = { ...merged.flags, 'migrated:dataproc_v1': 1 };
  }

  // Keep enrolled subjects in clean canonical 12-subject order
  const canonicalSubjs = SUBJECT_IDS.filter((id) => merged.subjs.includes(id));
  if (canonicalSubjs.length > 0) {
    merged.subjs = canonicalSubjs;
  }

  if (autostart) {
    setSessionUnlocked();
    if (!merged.name) {
      merged.name = 'Ada';
      merged.ob = 1;
      merged.dx = today();
      merged.sx = {
        maths: { dx: today() },
        fmaths: { dx: today() },
        chem: { dx: today() },
        phys: { dx: today() },
        bio: { dx: today() },
        agric: { dx: today() },
        geog: { dx: today() },
        econ: { dx: today() },
        eng: { dx: today() },
        civic: { dx: today() },
        digitech: { dx: today() },
        dataproc: { dx: today() },
      };
    }
  }

  if (typeof document !== 'undefined') {
    const initGoal = computeGoalProgress(merged, getTopics(merged.subj));
    const initTheme = resolveEffectiveThemeId(merged, initGoal.goalPct);
    const initMode = resolveEffectiveThemeMode(merged);
    document.documentElement.dataset.theme = initTheme;
    document.documentElement.dataset.mode = initMode;
    document.documentElement.classList.toggle('dark', initMode === 'dark');
    document.body.dataset.theme = initTheme;
    document.body.dataset.mode = initMode;
  }

  if (parsedDuel) {
    setSessionUnlocked();
    if (!merged.name) {
      merged.name = 'Scholar';
      merged.ob = 1;
    }
    return { progress: merged, startScreen: 'duel', initialDuelCode: parsedDuel.code };
  }

  if (autostart || (merged.name && isSessionUnlocked())) {
    return { progress: merged, startScreen: 'home', initialDuelCode: null };
  }

  return { progress: merged, startScreen: 'welcome', initialDuelCode: null };
}

export default function App() {
  const initial = useRef(loadInitialProgress()).current;
  const [progress, setProgress] = useState<UserProgress>(initial.progress);
  const [screen, setScreen] = useState<ScreenName>(initial.startScreen);
  const navTransitionRef = useRef<{ screen: ScreenName; spec: ScreenTransitionSpec }>({
    screen: initial.startScreen,
    spec: { kind: 'fade', direction: 0 },
  });
  if (navTransitionRef.current.screen !== screen) {
    navTransitionRef.current = {
      screen,
      spec: computeScreenTransition(navTransitionRef.current.screen, screen),
    };
  }
  const screenTransition = navTransitionRef.current.spec;
  const [activeTopicId, setActiveTopicId] = useState<string>('quad');
  const [activeLabId, setActiveLabId] = useState<string>('bisect-line');
  const [labReturnScreen, setLabReturnScreen] = useState<ScreenName>('topics');
  const [formulaTopicFilterId, setFormulaTopicFilterId] = useState<string | null>(null);
  const [formulaReturnScreen, setFormulaReturnScreen] = useState<ScreenName>('home');
  const [quizSession, setQuizSession] = useState<QuizSession | null>(null);
  const [bossSession, setBossSession] = useState<TopicTestSession | null>(null);
  const [badgeToast, setBadgeToast] = useState<BadgeDef | null>(null);
  const [badgeQueue, setBadgeQueue] = useState<{ badge: BadgeDef; isPreview?: boolean }[]>([]);
  const [badgeBatchTotal, setBadgeBatchTotal] = useState<number>(1);
  const [xpBursts, setXpBursts] = useState<XpBurstItem[]>([]);
  const [confettiKey, setConfettiKey] = useState<number>(0);
  const [activeDuelCode, setActiveDuelCode] = useState<string | null>(initial.initialDuelCode);
  const [qbankModal, setQbankModal] = useState<{
    open: boolean;
    subject: SubjectId | null;
    tab: QuestionBankTab;
  }>({ open: false, subject: null, tab: 'overview' });
  const burstIdRef = useRef(1);

  const handleOpenQuestionBank = useCallback((subj?: SubjectId, tab: QuestionBankTab = 'overview') => {
    setQbankModal({ open: true, subject: subj || null, tab });
  }, []);

  const goalSnapshot = React.useMemo(
    () => computeGoalProgress(progress, getTopics(progress.subj)),
    [progress]
  );
  const themeLockMode: ThemeLockMode = progress.themeLockMode || 'unlocked';
  const themeAutoProgress = progress.themeAutoProgress !== false;
  const effectiveThemeMode = React.useMemo(
    () => resolveEffectiveThemeMode(progress),
    [progress]
  );
  const effectiveThemeId = React.useMemo(
    () => resolveEffectiveThemeId(progress, goalSnapshot.goalPct),
    [progress, goalSnapshot.goalPct]
  );

  const triggerConfetti = useCallback(() => {
    setConfettiKey((k) => k + 1);
  }, []);

  const spawnXpBurst = useCallback((label: string, sub?: string) => {
    const id = burstIdRef.current++;
    setXpBursts((prev) => [...prev.slice(-2), { id, label, sub }]);
    window.setTimeout(() => {
      setXpBursts((prev) => prev.filter((b) => b.id !== id));
    }, 1300);
  }, []);

  // Sync [data-subj], [data-theme], and [data-mode] / .dark for CSS typography/theme rules & persist to localStorage
  useEffect(() => {
    document.documentElement.dataset.subj = progress.subj;
    document.documentElement.dataset.theme = effectiveThemeId;
    document.documentElement.dataset.mode = effectiveThemeMode;
    document.documentElement.classList.toggle('dark', effectiveThemeMode === 'dark');
    document.body.dataset.theme = effectiveThemeId;
    document.body.dataset.mode = effectiveThemeMode;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      /* ignore quota errors */
    }
  }, [progress, effectiveThemeId, effectiveThemeMode]);

  // Body data-screen & data-subj attribute for inspectability
  useEffect(() => {
    document.body.dataset.screen = screen;
    document.body.dataset.subj = progress.subj;
  }, [screen, progress.subj]);

  // Auto-dismiss badge unlock toast after 4.2s
  useEffect(() => {
    if (!badgeToast) return;
    const t = window.setTimeout(() => setBadgeToast(null), 4200);
    return () => window.clearTimeout(t);
  }, [badgeToast]);

  const playSound = useCallback(
    (name: SoundEffectName, streakN?: number) => {
      sfx(name, progress.muted, streakN);
    },
    [progress.muted]
  );

  const commitProgressWithBadges = useCallback((updater: (prev: UserProgress) => UserProgress) => {
    setProgress((prev) => {
      const updated = updater(prev);
      const topics = getTopics(updated.subj);
      const allTopicsBySubj: Partial<Record<SubjectId, ReturnType<typeof getTopics>>> = {
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
      const prevGoal = computeGoalProgress(prev, getTopics(prev.subj));
      const nextGoal = computeGoalProgress(updated, topics);
      const { progress: badgedBase, newlyEarned } = evaluateNewBadges(
        updated,
        topics,
        today(),
        allTopicsBySubj
      );
      let finalProgress = badgedBase;

      if (
        prev.subj === updated.subj &&
        nextGoal.highestUnlockedStage > prevGoal.highestUnlockedStage
      ) {
        if (finalProgress.themeAutoProgress !== false) {
          finalProgress = {
            ...finalProgress,
            themeId: nextGoal.highestUnlockedTheme.id,
          };
        }
        setBadgeToast({
          id: nextGoal.highestUnlockedTheme.id,
          name: `Stage ${nextGoal.highestUnlockedStage}: ${nextGoal.highestUnlockedTheme.name}`,
          desc: `Goal reached ${nextGoal.goalPct}% — new Mastery Theme unlocked!`,
          icon: 'palette',
          tier: 'gold',
          xpBonus: 0,
          ok: () => true,
        });
        sfx('shimmer', updated.muted);
      }

      if (newlyEarned.length > 0) {
        setBadgeBatchTotal((curTotal) =>
          badgeQueue.length > 0 ? curTotal + newlyEarned.length : newlyEarned.length
        );
        setBadgeQueue((cur) => [
          ...cur,
          ...newlyEarned.map((b) => ({ badge: b, isPreview: false })),
        ]);
        sfx('win', updated.muted);
        sfx('shimmer', updated.muted);
      }
      return finalProgress;
    });
  }, [badgeQueue.length]);

  const handleSelectTheme = useCallback(
    (id: MasteryThemeId) => {
      playSound('tap');
      setProgress((prev) => ({ ...prev, themeId: id }));
    },
    [playSound]
  );

  const handleChangeThemeMode = useCallback(
    (mode: ThemeAppearanceMode) => {
      playSound('tap');
      setProgress((prev) => ({ ...prev, themeMode: mode }));
    },
    [playSound]
  );

  const handleChangeThemeLockMode = useCallback(
    (mode: ThemeLockMode) => {
      playSound('tap');
      setProgress((prev) => ({ ...prev, themeLockMode: mode }));
    },
    [playSound]
  );

  const handleToggleThemeAutoProgress = useCallback((enabled: boolean) => {
    setProgress((prev) => ({ ...prev, themeAutoProgress: enabled }));
  }, []);

  const handleChangeClockFormat = useCallback(
    (fmt: ClockFormat) => {
      playSound('tap');
      setProgress((prev) => ({ ...prev, clockFormat: fmt }));
    },
    [playSound]
  );

  const handleSelectSubject = (sid: SubjectId) => {
    setProgress((prev) => ({
      ...prev,
      subj: sid,
      subjs: prev.subjs.includes(sid)
        ? prev.subjs
        : SUBJECT_IDS.filter((id) => id === sid || prev.subjs.includes(id)),
    }));
    if (screen === 'formulas') {
      setFormulaTopicFilterId(null);
      if (sid === 'bio' || sid === 'agric' || sid === 'civic') {
        setScreen('home');
      }
    }
    if (
      (sid === 'fmaths' ||
        sid === 'geog' ||
        sid === 'eng' ||
        sid === 'econ' ||
        sid === 'civic' ||
        sid === 'digitech' ||
        sid === 'dataproc') &&
      (screen === 'lab' || screen === 'labrun')
    ) {
      setScreen('topics');
    }
  };

  const handleSelectSubjectClass = (cls: ChemClassId, navigateToTopics = false) => {
    setProgress((prev) => ({
      ...prev,
      ...(prev.subj === 'fmaths'
        ? { fmathClass: cls }
        : prev.subj === 'chem'
          ? { chemClass: cls }
          : prev.subj === 'phys'
            ? { physClass: cls }
            : prev.subj === 'bio'
              ? { bioClass: cls }
              : prev.subj === 'agric'
                ? { agricClass: cls }
                : prev.subj === 'geog'
                  ? { geogClass: cls }
                  : prev.subj === 'econ'
                    ? { econClass: cls }
                    : prev.subj === 'eng'
                      ? { engClass: cls }
                      : prev.subj === 'civic'
                        ? { civicClass: cls }
                        : prev.subj === 'digitech'
                          ? { digitechClass: cls }
                          : prev.subj === 'dataproc'
                            ? { dataprocClass: cls }
                            : { mathClass: cls }),
    }));
    if (navigateToTopics) {
      setScreen('topics');
    }
  };

  const handleToggleNoteRead = (tid: string, partIdx: number, forceRead?: boolean) => {
    const flagKey = `note:${tid}:${partIdx}`;
    commitProgressWithBadges((prev) => {
      const nextVal = forceRead !== undefined ? (forceRead ? 1 : 0) : prev.flags[flagKey] ? 0 : 1;
      const nextFlags = { ...prev.flags };
      if (nextVal) nextFlags[flagKey] = 1;
      else delete nextFlags[flagKey];
      return {
        ...prev,
        xp: nextVal && !prev.flags[flagKey] ? prev.xp + 5 : prev.xp,
        flags: nextFlags,
      };
    });
  };

  const handleCompleteLab = useCallback(
    (labId: string) => {
      const flagKey = `lab:${labId}`;
      commitProgressWithBadges((prev) => {
        if (prev.flags[flagKey]) return prev;
        spawnXpBurst('Practical Complete', 'Lab verified');
        return {
          ...prev,
          xp: prev.xp + 15,
          flags: { ...prev.flags, [flagKey]: 1 },
        };
      });
    },
    [commitProgressWithBadges, spawnXpBurst]
  );

  const handleRecordFormulaAttempt = useCallback(
    (formulaId: string, ok: boolean) => {
      if (!ok) return;
      const flagKey = `fmaster:${formulaId}`;
      const d = today();
      spawnXpBurst(formulaId.startsWith('ef-') ? 'Rule Mastered' : 'Formula Solved');
      commitProgressWithBadges((prev) => ({
        ...prev,
        xp: prev.xp + 10,
        act: { ...prev.act, [d]: (prev.act[d] || 0) + 1 },
        flags: { ...prev.flags, [flagKey]: 1 },
      }));
    },
    [commitProgressWithBadges, spawnXpBurst]
  );

  const openFormulasStudio = (returnTo: ScreenName, topicId?: string | null) => {
    if (progress.subj === 'bio' || progress.subj === 'agric' || progress.subj === 'civic') return;
    setFormulaReturnScreen(returnTo);
    setFormulaTopicFilterId(topicId || null);
    setScreen('formulas');
  };

  const handleCompleteOnboarding = (cfg: {
    name: string;
    subjs: SubjectId[];
    classLevel: ChemClassId;
    target: number;
  }) => {
    setSessionUnlocked();
    const orderedSubjs = SUBJECT_IDS.filter((id) => cfg.subjs.includes(id));
    const finalSubjs = orderedSubjs.length > 0 ? orderedSubjs : cfg.subjs;
    const primarySubj = finalSubjs[0] || 'maths';
    setProgress((prev) => ({
      ...prev,
      name: cfg.name,
      subjs: finalSubjs,
      subj: primarySubj,
      chemClass: cfg.classLevel,
      mathClass: cfg.classLevel,
      fmathClass: cfg.classLevel,
      physClass: cfg.classLevel,
      bioClass: cfg.classLevel,
      agricClass: cfg.classLevel,
      geogClass: cfg.classLevel,
      econClass: cfg.classLevel,
      engClass: cfg.classLevel,
      civicClass: cfg.classLevel,
      digitechClass: cfg.classLevel,
      dataprocClass: cfg.classLevel,
      target: cfg.target,
      ob: 1,
    }));
    if (cfg.classLevel !== 'all') {
      setScreen('topics');
    } else {
      setScreen('dxintro');
    }
  };

  const handleAuthenticated = (cfg: {
    name: string;
    subjs?: SubjectId[];
    classLevel?: ChemClassId;
    target?: number;
    isExisting: boolean;
  }) => {
    setSessionUnlocked();
    if (cfg.isExisting) {
      setProgress((prev) => ({
        ...prev,
        name: cfg.name || prev.name || 'Scholar',
        ob: 1,
      }));
      setScreen('home');
    } else {
      handleCompleteOnboarding({
        name: cfg.name,
        subjs: cfg.subjs && cfg.subjs.length > 0 ? cfg.subjs : SUBJECT_IDS,
        classLevel: cfg.classLevel || 'ss1',
        target: cfg.target || 80,
      });
    }
  };

  const handleSkipToDemo = () => {
    setSessionUnlocked();
    setProgress((prev) => ({
      ...prev,
      name: prev.name.trim() || 'Ada',
      ob: 1,
      dx: prev.dx || today(),
      sx: {
        maths: { dx: today() },
        fmaths: { dx: today() },
        chem: { dx: today() },
        phys: { dx: today() },
        bio: { dx: today() },
        agric: { dx: today() },
        geog: { dx: today() },
        econ: { dx: today() },
        eng: { dx: today() },
        civic: { dx: today() },
        digitech: { dx: today() },
        dataproc: { dx: today() },
        ...prev.sx,
      },
    }));
    setScreen('home');
  };

  const handleSignOut = () => {
    clearSessionUnlock();
    setScreen('welcome');
  };

  const startDiagnostic = (subjOverride?: SubjectId) => {
    const sid = subjOverride || progress.subj;
    const topics = getTopicsForProgress({
      subj: sid,
      chemClass: progress.chemClass,
      mathClass: progress.mathClass,
      fmathClass: progress.fmathClass,
      physClass: progress.physClass,
      bioClass: progress.bioClass,
      agricClass: progress.agricClass,
      geogClass: progress.geogClass,
      econClass: progress.econClass,
      engClass: progress.engClass,
      civicClass: progress.civicClass,
      digitechClass: progress.digitechClass,
      dataprocClass: progress.dataprocClass,
    });
    const list = dxList(progress, topics);
    if (!list.length) {
      setScreen('home');
      return;
    }
    const pred0 = predicted(progress, topics);
    setQuizSession({
      kind: 'dx',
      list,
      i: 0,
      n: list.length,
      cur: list[0],
      lvl: 3,
      run: 0,
      right: 0,
      picked: null,
      done: false,
      res: [],
      m0: 0,
      pred0,
    });
    setScreen('quiz');
  };

  const startPractice = (tid: string) => {
    const topic = getTopic(progress.subj, tid);
    if (!topic) return;
    const topics = getTopics(progress.subj);
    const curMastery = mastery(progress, tid);
    const startLvl = curMastery > 0.7 ? 4 : curMastery > 0.5 ? 3 : 2;
    const firstQ = pickPractice(progress, topic, startLvl, []);
    if (!firstQ) return;
    setActiveTopicId(tid);
    setQuizSession({
      kind: 'practice',
      tid,
      i: 0,
      n: PRACTICE_LEN,
      cur: firstQ.id,
      lvl: startLvl,
      run: 0,
      right: 0,
      picked: null,
      done: false,
      seen: [firstQ.id],
      res: [],
      m0: curMastery,
      pred0: predicted(progress, topics),
    });
    setScreen('quiz');
  };

  const startReview = (early: boolean) => {
    const list = dueList(progress, (id) => findQuestion(progress, progress.subj, id), early);
    if (!list.length) return;
    const topics = getTopics(progress.subj);
    setQuizSession({
      kind: 'review',
      list,
      i: 0,
      n: list.length,
      cur: list[0],
      lvl: 3,
      run: 0,
      right: 0,
      picked: null,
      done: false,
      res: [],
      m0: 0,
      pred0: predicted(progress, topics),
    });
    setScreen('quiz');
  };

  const startTopicTest = (tid: string) => {
    const topic = getTopic(progress.subj, tid);
    if (!topic) return;
    const list = bossList(progress, topic);
    const topics = getTopics(progress.subj);
    setActiveTopicId(tid);
    setBossSession({
      tid,
      phase: 'intro',
      list,
      i: 0,
      hp: BOSS_HP,
      hits: 0,
      combo: 0,
      best: 0,
      time: BOSS_TIME,
      picked: null,
      result: null,
      pred0: predicted(progress, topics),
    });
    setScreen('boss');
  };

  const handleQuizAnswer = (q: Question, origIdx: number, ok: boolean) => {
    if (!quizSession || quizSession.picked !== null) return;
    const nextRun = ok ? quizSession.run + 1 : 0;
    if (ok) {
      playSound('right', nextRun);
      buzz(20, progress.muted);
      if (nextRun >= 2) spawnXpBurst(`${nextRun}x Streak`, 'Locked in');
    } else {
      playSound('wrong');
      buzz([30, 40, 30], progress.muted);
    }

    commitProgressWithBadges((prev) => {
      const next = recordAnswer(prev, q, ok, quizSession.kind);
      if (!ok) {
        return {
          ...next,
          mistakes: upsertMistakeRecord(next.mistakes || {}, q, next.subj, origIdx, quizSession.kind, today()),
        };
      }
      return next;
    });

    setQuizSession((prev) => {
      if (!prev) return prev;
      let nextLvl = prev.lvl;
      if (prev.kind === 'practice') {
        if (ok && nextRun >= 2) nextLvl = Math.min(5, prev.lvl + 1);
        else if (!ok) nextLvl = Math.max(1, prev.lvl - 1);
      }
      return {
        ...prev,
        picked: origIdx,
        right: prev.right + (ok ? 1 : 0),
        run: nextRun,
        lvl: nextLvl,
        res: [...prev.res, [q.id, ok ? 1 : 0]],
      };
    });
  };

  const handleQuizNext = () => {
    if (!quizSession) return;
    const nextI = quizSession.i + 1;

    if (nextI >= quizSession.n) {
      commitProgressWithBadges((prev) => {
        if (quizSession.kind === 'dx') {
          const d = today();
          return {
            ...prev,
            dx: prev.dx || d,
            sx: { ...prev.sx, [prev.subj]: { ...(prev.sx[prev.subj] || {}), dx: d } },
          };
        }
        if (quizSession.kind === 'practice' && quizSession.tid) {
          const ts = tstate(prev, quizSession.tid);
          return {
            ...prev,
            t: { ...prev.t, [quizSession.tid]: { ...ts, practice: 1 } },
          };
        }
        return prev;
      });
      if (quizSession.right / Math.max(1, quizSession.n) >= 0.7) {
        triggerConfetti();
      }
      setQuizSession((prev) => (prev ? { ...prev, done: true } : prev));
      setScreen('sum');
      return;
    }

    if (quizSession.kind === 'practice' && quizSession.tid) {
      const topic = getTopic(progress.subj, quizSession.tid);
      if (topic) {
        const seen = quizSession.seen || [];
        const nextQ = pickPractice(progress, topic, quizSession.lvl, seen);
        if (nextQ) {
          setQuizSession((prev) =>
            prev
              ? {
                  ...prev,
                  i: nextI,
                  cur: nextQ.id,
                  picked: null,
                  seen: [...seen, nextQ.id],
                }
              : prev
          );
          return;
        }
      }
      // Ran out of unseen questions early
      commitProgressWithBadges((prev) => {
        const ts = tstate(prev, quizSession.tid!);
        return { ...prev, t: { ...prev.t, [quizSession.tid!]: { ...ts, practice: 1 } } };
      });
      setQuizSession((prev) => (prev ? { ...prev, n: nextI, done: true } : prev));
      setScreen('sum');
      return;
    }

    const nextQId = quizSession.list?.[nextI];
    if (nextQId) {
      setQuizSession((prev) => (prev ? { ...prev, i: nextI, cur: nextQId, picked: null } : prev));
    } else {
      setScreen('sum');
    }
  };

  const handleBossPick = (q: Question, origIdx: number, ok: boolean) => {
    if (!bossSession || bossSession.picked !== null) return;
    if (ok) {
      playSound('hit');
      buzz(25, progress.muted);
      const nextCombo = bossSession.combo + 1;
      if (nextCombo >= 2) spawnXpBurst(`${nextCombo}x Hit`, 'Combo');
    } else {
      playSound('wrong');
      buzz([35, 40, 35], progress.muted);
    }

    commitProgressWithBadges((prev) => {
      const next = recordAnswer(prev, q, ok, 'boss');
      if (!ok) {
        return {
          ...next,
          mistakes: upsertMistakeRecord(next.mistakes || {}, q, next.subj, origIdx, 'boss', today()),
        };
      }
      return next;
    });

    setBossSession((prev) => {
      if (!prev) return prev;
      const hits = prev.hits + (ok ? 1 : 0);
      const combo = ok ? prev.combo + 1 : 0;
      const best = Math.max(prev.best, combo);
      return {
        ...prev,
        picked: origIdx,
        result: ok ? 'right' : 'wrong',
        hits,
        combo,
        best,
        hp: Math.max(0, BOSS_HP - hits),
      };
    });
  };

  const handleBossNext = () => {
    if (!bossSession) return;
    const won = bossSession.hits >= BOSS_HP;
    const nextI = bossSession.i + 1;
    const outOfQs = nextI >= bossSession.list.length;

    if (won || outOfQs || bossSession.time <= 0) {
      const passed = bossSession.hits >= BOSS_HP;
      playSound(passed ? 'win' : 'lose');
      if (passed) {
        triggerConfetti();
        spawnXpBurst('Topic Passed!', 'Mastery unlocked');
        commitProgressWithBadges((prev) => {
          const ts = tstate(prev, bossSession.tid);
          const nextBadges = { ...prev.badges };
          if (bossSession.best >= 5 && !nextBadges.combo5) {
            nextBadges.combo5 = today();
          }
          const isFlawless = bossSession.hits === bossSession.list.length;
          return {
            ...prev,
            xp: prev.xp + 60,
            badges: nextBadges,
            flags: isFlawless
              ? { ...prev.flags, flawless_boss: (prev.flags.flawless_boss || 0) + 1 }
              : prev.flags,
            t: {
              ...prev.t,
              [bossSession.tid]: { ...ts, boss: 1, practice: 1 },
            },
          };
        });
      }
      setBossSession((prev) => (prev ? { ...prev, phase: passed ? 'won' : 'lost' } : prev));
      return;
    }

    setBossSession((prev) =>
      prev ? { ...prev, i: nextI, picked: null, result: null } : prev
    );
  };

  const handleBossTick = useCallback(() => {
    setBossSession((prev) => {
      if (!prev || prev.phase !== 'fight' || prev.picked !== null) return prev;
      const nextTime = prev.time - 1;
      if (nextTime <= 0) {
        return { ...prev, time: 0, phase: prev.hits >= BOSS_HP ? 'won' : 'lost' };
      }
      return { ...prev, time: nextTime };
    });
  }, []);

  const handleNavigateTab = (tab: MainTab) => {
    if (tab === 'home') setScreen('home');
    else if (tab === 'subjects') setScreen('subjs');
    else if (tab === 'topics') setScreen('topics');
    else if (tab === 'formulas') openFormulasStudio('home', null);
    else setScreen('more');
  };

  const openTopic = (tid: string) => {
    setActiveTopicId(tid);
    setScreen('topic');
  };

  const openLesson = (tid: string) => {
    setActiveTopicId(tid);
    setScreen('lesson');
  };

  const openLabPlayer = (labId: string, returnTo: ScreenName) => {
    setActiveLabId(labId);
    setLabReturnScreen(returnTo);
    setScreen('labrun');
  };

  const handleHydrateFromCloud = useCallback((merged: UserProgress) => {
    setProgress(merged);
  }, []);

  const handleOpenWeakTopic = useCallback((subj: SubjectId, tid: string) => {
    setProgress((prev) => ({
      ...prev,
      subj,
      subjs: prev.subjs.includes(subj) ? prev.subjs : SUBJECT_IDS.filter((id) => id === subj || prev.subjs.includes(id)),
    }));
    setActiveTopicId(tid);
    setScreen('notes');
  }, []);

  const handleLaunchPlannerTask = useCallback(
    (subj: SubjectId, tid: string, stage: 'lesson' | 'practice' | 'boss') => {
      setProgress((prev) => ({
        ...prev,
        subj,
        subjs: prev.subjs.includes(subj) ? prev.subjs : SUBJECT_IDS.filter((id) => id === subj || prev.subjs.includes(id)),
      }));
      setActiveTopicId(tid);
      if (stage === 'lesson') setScreen('lesson');
      else setScreen('topic');
    },
    []
  );

  const handleSaveStudyPlan = useCallback((cfg: StudyPlanConfig) => {
    setProgress((prev) => ({ ...prev, studyPlan: cfg }));
  }, []);

  const handleUpdateLeaderboardPrefs = useCallback(
    (prefs: { campusGoal?: string; isPublic?: boolean }) => {
      setProgress((prev) => ({
        ...prev,
        leaderboardCampusGoal:
          prefs.campusGoal !== undefined ? prefs.campusGoal : prev.leaderboardCampusGoal,
        leaderboardPublic:
          prefs.isPublic !== undefined ? prefs.isPublic : prev.leaderboardPublic,
      }));
    },
    []
  );

  const handleRedeemMistake = useCallback(
    (qid: string, ok: boolean, allowSameDay: boolean) => {
      playSound(ok ? 'right' : 'wrong', 1);
      if (ok) spawnXpBurst('Mistake Cleared', 'Redemption');
      commitProgressWithBadges((prev) => {
        if (!ok) return prev;
        const res = redeemMistakeRecord(prev.mistakes || {}, qid, today(), allowSameDay);
        return {
          ...prev,
          xp: prev.xp + 15,
          mistakes: res.nextVault,
        };
      });
    },
    [commitProgressWithBadges, playSound, spawnXpBurst]
  );

  const handleSaveTheoryScore = useCallback(
    (promptId: string, earned: number, max: number) => {
      playSound('done');
      spawnXpBurst(`Theory ${earned}/${max}`, 'Score saved');
      commitProgressWithBadges((prev) => ({
        ...prev,
        xp: prev.xp + 25,
        theoryScores: {
          ...(prev.theoryScores || {}),
          [promptId]: { earned, max, day: today() },
        },
      }));
    },
    [commitProgressWithBadges, playSound, spawnXpBurst]
  );

  const handleCompleteCbt = useCallback(
    (payload: {
      mode: 'jamb' | 'waec';
      subjects: SubjectId[];
      report: { scaledScore: number; maxScale: number; rawCorrect: number; totalQuestions: number; accuracyPct: number };
      durationSec: number;
      missedQuestions: { q: Question; subj: SubjectId; pickedIdx: number }[];
      answeredResults: { q: Question; ok: boolean }[];
    }) => {
      const xpEarned = Math.max(20, payload.report.rawCorrect * 8);
      if (payload.report.accuracyPct >= 65) triggerConfetti();
      playSound(payload.report.accuracyPct >= 60 ? 'win' : 'done');
      spawnXpBurst(`CBT ${payload.report.scaledScore}/${payload.report.maxScale}`, `${payload.report.accuracyPct}% accuracy`);
      const d = today();
      commitProgressWithBadges((prev) => {
        let next = prev;
        for (const item of payload.answeredResults) {
          next = recordAnswer(next, item.q, item.ok, 'practice');
        }
        let nextMistakes = next.mistakes || {};
        for (const miss of payload.missedQuestions) {
          nextMistakes = upsertMistakeRecord(nextMistakes, miss.q, miss.subj, miss.pickedIdx, 'cbt', d);
        }
        const histEntry = {
          id: `cbt-${d}-${Date.now()}`,
          mode: payload.mode,
          dateDay: d,
          subjects: payload.subjects,
          scaledScore: payload.report.scaledScore,
          maxScale: payload.report.maxScale,
          rawCorrect: payload.report.rawCorrect,
          totalQuestions: payload.report.totalQuestions,
          durationSec: payload.durationSec,
        };
        return {
          ...next,
          xp: next.xp + xpEarned,
          mistakes: nextMistakes,
          cbtHistory: [...(next.cbtHistory || []).slice(-24), histEntry],
        };
      });
    },
    [commitProgressWithBadges, playSound, spawnXpBurst, triggerConfetti]
  );

  const handleCompleteDuel = useCallback(
    (payload: {
      spec: { code: string; subj: SubjectId; title: string };
      score: number;
      total: number;
      timeSec: number;
      missedQuestions: { q: Question; subj: SubjectId; pickedIdx: number }[];
    }) => {
      const xpEarned = Math.max(15, payload.score * 10);
      if (payload.score >= 7) triggerConfetti();
      playSound(payload.score >= 7 ? 'win' : 'done');
      spawnXpBurst(`Duel ${payload.score}/${payload.total}`, 'Match complete');
      const d = today();
      commitProgressWithBadges((prev) => {
        let nextMistakes = prev.mistakes || {};
        for (const miss of payload.missedQuestions) {
          nextMistakes = upsertMistakeRecord(nextMistakes, miss.q, miss.subj, miss.pickedIdx, 'duel', d);
        }
        return {
          ...prev,
          xp: prev.xp + xpEarned,
          mistakes: nextMistakes,
          duelHistory: [
            ...(prev.duelHistory || []).slice(-24),
            {
              code: payload.spec.code,
              subj: payload.spec.subj,
              title: payload.spec.title,
              score: payload.score,
              total: payload.total,
              timeSec: payload.timeSec,
              day: d,
            },
          ],
        };
      });
    },
    [commitProgressWithBadges, playSound, spawnXpBurst, triggerConfetti]
  );

  const dueIds = dueList(progress, (id) => findQuestion(progress, progress.subj, id));
  const showNav = screen !== 'welcome' && screen !== 'dxintro';
  const currentTopic = getTopic(progress.subj, activeTopicId) || getTopics(progress.subj)[0];
  const currentLesson = currentTopic ? getInteractiveLesson(progress.subj, currentTopic.id) : undefined;
  const currentLab = getLabById(activeLabId) || getLabById('bisect-line')!;

  const isFMathSubj = progress.subj === 'fmaths';
  const isChemSubj = progress.subj === 'chem';
  const isPhysSubj = progress.subj === 'phys';
  const isBioSubj = progress.subj === 'bio';
  const isAgricSubj = progress.subj === 'agric';
  const isGeogSubj = progress.subj === 'geog';
  const isEconSubj = progress.subj === 'econ';
  const isEngSubj = progress.subj === 'eng';
  const isCivicSubj = progress.subj === 'civic';
  const isDigiTechSubj = progress.subj === 'digitech';
  const isDataProcSubj = progress.subj === 'dataproc';
  const fallbackLiveEntry: ActiveLiveContextEntry = React.useMemo(() => {
    const mode:
      | 'chem'
      | 'math'
      | 'fmath'
      | 'phys'
      | 'bio'
      | 'agric'
      | 'geog'
      | 'econ'
      | 'eng'
      | 'civic'
      | 'digitech'
      | 'dataproc' = isDataProcSubj
      ? 'dataproc'
      : isDigiTechSubj
        ? 'digitech'
        : isCivicSubj
          ? 'civic'
          : isEngSubj
            ? 'eng'
            : isEconSubj
              ? 'econ'
              : isGeogSubj
                ? 'geog'
                : isAgricSubj
                  ? 'agric'
                  : isBioSubj
                    ? 'bio'
                    : isPhysSubj
                      ? 'phys'
                      : isChemSubj
                        ? 'chem'
                        : isFMathSubj
                          ? 'fmath'
                          : 'math';
    const subjTitle = isDataProcSubj
      ? 'Data Processing'
      : isDigiTechSubj
        ? 'Digital Technologies'
        : isCivicSubj
          ? 'Civic Education'
          : isEngSubj
            ? 'English Language'
            : isEconSubj
              ? 'Economics'
              : isGeogSubj
                ? 'Geography'
                : isAgricSubj
                  ? 'Agricultural Science'
                  : isBioSubj
                    ? 'Biology'
                    : isPhysSubj
                      ? 'Physics'
                      : isChemSubj
                        ? 'Chemistry'
                        : isFMathSubj
                          ? 'Further Mathematics'
                          : 'Mathematics';
    if (screen === 'welcome') {
      return {
        stepKey: `scr:welcome:${mode}`,
        mode,
        context: {
          topicName: 'Welcome & Class Setup',
          partTitle: subjTitle,
          stepLabel: 'Onboarding',
          stepText:
            'Signing in or registering a scholar profile across all 12 NERDC subjects (SS 1, SS 2, SS 3, or All Classes).',
        },
      };
    }
    if (screen === 'dxintro') {
      return {
        stepKey: `scr:dxintro:${mode}`,
        mode,
        context: {
          topicName: `${subjTitle} Diagnostic Check`,
          partTitle: 'Readiness Check',
          stepLabel: 'Diagnostic Intro',
          stepText: `Quick ${subjTitle} diagnostic check to map strong and weak topics.`,
        },
      };
    }
    if (screen === 'topics') {
      const cls = isDataProcSubj
        ? progress.dataprocClass
        : isDigiTechSubj
          ? progress.digitechClass
          : isCivicSubj
            ? progress.civicClass
            : isEngSubj
              ? progress.engClass
              : isEconSubj
                ? progress.econClass
                : isGeogSubj
                  ? progress.geogClass
                  : isAgricSubj
                    ? progress.agricClass
                    : isBioSubj
                      ? progress.bioClass
                      : isPhysSubj
                        ? progress.physClass
                        : isChemSubj
                          ? progress.chemClass
                          : isFMathSubj
                            ? progress.fmathClass
                            : progress.mathClass;
      const clsLabel = cls && cls !== 'all' ? cls.toUpperCase() : 'All Classes';
      return {
        stepKey: `scr:topics:${mode}:${clsLabel}`,
        mode,
        context: {
          topicName: `${subjTitle} Topics Map`,
          partTitle: clsLabel,
          stepLabel: 'Curriculum Map',
          stepText: isDataProcSubj
            ? 'Browsing Data Processing NERDC First, Second, and Third Term topics across Information Systems, File Organization, Relational Databases & 3NF, Spreadsheets & SQL, Integrity, and the Data Processing Formula Studio.'
            : isDigiTechSubj
              ? 'Browsing Digital Technologies NERDC First, Second, and Third Term topics across Computer Architecture, Binary & Logic Gates, Software & Algorithms, Networks & Cloud, Cybersecurity & AI, and the Digital Tech Formula Studio.'
              : isCivicSubj
                ? 'Browsing Civic Education NERDC First, Second, and Third Term topics across Values & Citizenship, Constitutional Democracy, Human Rights, Governance, and Global Order.'
                : isEngSubj
                  ? 'Browsing English Language NERDC First, Second, and Third Term topics across Oral English, Lexis, Grammar, Comprehension, Writing, and the Rules Studio.'
                  : isEconSubj
                    ? 'Browsing Economics NERDC First, Second, and Third Term topics across Principles, Microeconomics, Quantitative Tools, Macroeconomics, Development, and the Economics Formula Studio.'
                    : isGeogSubj
                      ? 'Browsing Geography NERDC First, Second, and Third Term topics across Map Reading & GIS, Physical Landforms, Climatology, Human Geography, Nigeria & Africa, and the Geography Calculations Studio.'
                      : isFMathSubj
                        ? 'Browsing Further Mathematics NERDC First, Second, and Third Term topics across Pure Algebra, Calculus, Vectors & Matrices, Mechanics, Probability & Statistics, and the Further Maths Formula Studio.'
                        : isAgricSubj || isBioSubj
                          ? `Browsing ${subjTitle} NERDC First, Second, and Third Term topics and Practicals Laboratory experiments.`
                          : `Browsing ${subjTitle} NERDC First, Second, and Third Term topics, Lab experiments, and Formula Studio.`,
        },
      };
    }
    if (
      screen === 'lab' &&
      !isFMathSubj &&
      !isGeogSubj &&
      !isEngSubj &&
      !isEconSubj &&
      !isCivicSubj &&
      !isDigiTechSubj &&
      !isDataProcSubj
    ) {
      return {
        stepKey: `scr:lab:${mode}`,
        mode,
        context: {
          topicName: isChemSubj
            ? 'Chemistry Practicals Lab'
            : isAgricSubj
              ? 'Agricultural Science Practicals Lab'
              : isBioSubj
                ? 'Biology Practicals Lab'
                : isPhysSubj
                  ? 'Physics Practicals Lab'
                  : 'Maths Constructions Lab',
          partTitle: isChemSubj
            ? '20 Virtual Experiments'
            : isAgricSubj
              ? '14 Virtual Practicals'
              : isBioSubj
                ? '14 Virtual Practicals'
                : isPhysSubj
                  ? '16 Virtual Experiments'
                  : '23 Animated Constructions',
          stepLabel: 'Lab Directory',
          stepText: isChemSubj
            ? 'Exploring titration, qualitative analysis, gas tests, electrolysis, and organic practicals.'
            : isAgricSubj
              ? 'Exploring soil sedimentation, water retention, soil pH liming, NPK fertilizer tests, seed germination, ruminant digestion, egg candling, and farm records practicals.'
              : isBioSubj
                ? 'Exploring microscopy, osmosis, food tests, photosynthesis, potometer transpiration, enzyme kinetics, quadrat ecology, floral dissection, vertebrae, and Mendelian inheritance.'
                : isPhysSubj
                  ? 'Exploring mechanics, pendulum, calorimetry, glass-block refraction, thin lenses, Ohm’s law, metre bridge, and potentiometer practicals.'
                  : 'Exploring compass, ruler, protractor, locus, bearing, and graph constructions.',
        },
      };
    }
    if (screen === 'formulas') {
      return {
        stepKey: `scr:formulas:${mode}:${formulaTopicFilterId || 'all'}`,
        mode,
        context: {
          topicName: isEngSubj
            ? 'English Grammar & Rules Studio'
            : isDataProcSubj
              ? 'Data Processing SQL & Formula Studio'
              : isDigiTechSubj
                ? 'Digital Tech Formula & Binary Studio'
                : `${subjTitle} Formula & Calculation Studio`,
          partTitle: isChemSubj
            ? '28 Core Formulas'
            : isFMathSubj
              ? '25 Core Formulas'
              : isGeogSubj || isDigiTechSubj
                ? '20 Core Formulas'
                : isDataProcSubj
                  ? '20 Formulas & SQL Rules'
                  : isEconSubj
                    ? '24 Core Formulas'
                    : isEngSubj
                      ? '30 Core Rules'
                      : '30 Core Formulas',
          stepLabel: isEngSubj ? 'Rules Studio' : 'Formula Studio',
          stepText: isEngSubj
            ? 'Mastering English concord laws, subjunctive & question tags, grammatical names/functions, Oral English stress rules, and usage drills.'
            : isDataProcSubj
              ? 'Mastering relational degree/cardinality, 1NF–3NF normalization, storage sizing, Excel cell formulas, SQL aggregates, and check-digit drills.'
              : isDigiTechSubj
                ? 'Mastering binary/hex conversions, two’s complement ranges, Boolean logic laws, CPU clock cycles, network throughput, and subnetting drills.'
                : `Rearranging ${subjTitle} equations, checking unit & sign traps, and practising numerical drills.`,
        },
      };
    }
    if (screen === 'review') {
      return {
        stepKey: `scr:review:${mode}:${dueIds.length}`,
        mode,
        context: {
          topicName: `${subjTitle} Spaced Repetition Review`,
          partTitle: `${dueIds.length} cards due`,
          stepLabel: 'Spaced Review',
          stepText: `Reviewing ${subjTitle} questions across 1-day, 3-day, and 7-day memory intervals.`,
        },
      };
    }
    if (screen === 'sum') {
      return {
        stepKey: `scr:sum:${mode}:${quizSession?.right ?? 0}`,
        mode,
        context: {
          topicName: currentTopic?.name || `${subjTitle} Practice Summary`,
          partTitle: 'Session Results',
          stepLabel: 'Summary',
          stepText: quizSession
            ? `Scored ${quizSession.right} out of ${quizSession.n} questions in ${currentTopic?.name || subjTitle}.`
            : `Reviewing recent ${subjTitle} practice performance.`,
        },
      };
    }
    if (screen === 'leaderboard') {
      return {
        stepKey: `scr:leaderboard:${mode}`,
        mode,
        context: {
          topicName: 'National Scholars Leaderboard',
          partTitle: `${progress.streak.n}d study streak`,
          stepLabel: 'Leaderboard',
          stepText: `Coaching ${progress.name || 'student'} on climbing the National Scholars Leaderboard by passing topic tests, improving accuracy, and raising JAMB/WAEC CBT scores.`,
        },
      };
    }
    if (screen === 'more' || screen === 'subjs') {
      return {
        stepKey: `scr:${screen}:${mode}`,
        mode,
        context: {
          topicName: screen === 'subjs' ? 'Subjects & Mastery Goal' : 'Settings & Study Profile',
          partTitle: `${progress.streak.n}d study streak`,
          stepLabel: 'Settings',
          stepText: `Coaching ${progress.name || 'student'} on ${subjTitle} study strategy, weak topics, and subject mastery.`,
        },
      };
    }
    return {
      stepKey: `scr:${screen}:${mode}:${currentTopic?.id || 'main'}`,
      mode,
      context: {
        topicName: currentTopic?.name || subjTitle,
        partTitle: currentTopic?.sec || 'Overview',
        stepLabel: screen,
        stepText: currentTopic?.trap || `Studying ${subjTitle} concepts and problem-solving techniques.`,
      },
    };
  }, [
    currentTopic?.id,
    currentTopic?.name,
    currentTopic?.sec,
    currentTopic?.trap,
    dueIds.length,
    formulaTopicFilterId,
    isAgricSubj,
    isBioSubj,
    isChemSubj,
    isCivicSubj,
    isDataProcSubj,
    isDigiTechSubj,
    isEconSubj,
    isEngSubj,
    isFMathSubj,
    isGeogSubj,
    isPhysSubj,
    progress.agricClass,
    progress.bioClass,
    progress.chemClass,
    progress.civicClass,
    progress.dataprocClass,
    progress.digitechClass,
    progress.econClass,
    progress.engClass,
    progress.fmathClass,
    progress.geogClass,
    progress.mathClass,
    progress.physClass,
    progress.name,
    progress.streak.n,
    quizSession,
    screen,
  ]);

  return (
    <ErrorBoundary>
      <CloudSyncProvider progress={progress} onHydrateFromCloud={handleHydrateFromCloud}>
      <LiveCoachProvider fallbackEntry={fallbackLiveEntry}>
        <ClockFormatProvider
          format={progress.clockFormat || '12h'}
          onChangeFormat={handleChangeClockFormat}
        >
        <AppShell
        screen={screen}
        progress={progress}
        dueCount={dueIds.length}
        showNav={showNav}
        badgeToast={badgeToast}
        xpBursts={xpBursts}
        confettiKey={confettiKey}
        screenTransition={screenTransition}
        onDismissToast={() => setBadgeToast(null)}
        onNavigateTab={handleNavigateTab}
        onSelectSubject={handleSelectSubject}
        onManageSubjects={() => setScreen('subjs')}
        onSignOut={handleSignOut}
      >
      {screen === 'welcome' && (
        <WelcomeScreen
          initialName={progress.name}
          initialSubjs={progress.subjs}
          initialClassLevel={
            progress.subj === 'fmaths'
              ? progress.fmathClass
              : progress.subj === 'chem'
                ? progress.chemClass
                : progress.subj === 'phys'
                  ? progress.physClass
                  : progress.subj === 'bio'
                    ? progress.bioClass
                    : progress.subj === 'agric'
                      ? progress.agricClass
                      : progress.subj === 'geog'
                        ? progress.geogClass
                        : progress.subj === 'econ'
                          ? progress.econClass
                          : progress.subj === 'eng'
                            ? progress.engClass
                            : progress.subj === 'civic'
                              ? progress.civicClass
                              : progress.subj === 'digitech'
                                ? progress.digitechClass
                                : progress.subj === 'dataproc'
                                  ? progress.dataprocClass
                                  : progress.mathClass || progress.chemClass
          }
          initialTarget={progress.target}
          onComplete={handleCompleteOnboarding}
          onAuthenticated={handleAuthenticated}
          onSkipToDemo={handleSkipToDemo}
        />
      )}

      {screen === 'dxintro' && (
        <DxIntroScreen
          name={progress.name || 'Student'}
          subj={progress.subj}
          questionCount={dxList(progress, getTopicsForProgress(progress)).length}
          onStartDiagnostic={() => startDiagnostic()}
          onSkipToHome={() => setScreen('home')}
        />
      )}

      {screen === 'home' && (
        <HomeScreen
          progress={progress}
          dueIds={dueIds}
          onSelectSubject={handleSelectSubject}
          onSelectClassAndBrowse={(cls) => handleSelectSubjectClass(cls, true)}
          onManageSubjects={() => setScreen('subjs')}
          onOpenTopic={openTopic}
          onStartMission={(tid, stage) => {
            if (stage === 'lesson') openLesson(tid);
            else if (stage === 'practice') startPractice(tid);
            else startTopicTest(tid);
          }}
          onOpenReview={() => setScreen('review')}
          onStartDiagnostic={() => startDiagnostic()}
          onOpenLab={() => setScreen('lab')}
          onOpenFormulas={
            progress.subj === 'bio' || progress.subj === 'agric' || progress.subj === 'civic'
              ? undefined
              : () => openFormulasStudio('home', null)
          }
          onOpenTopicsMap={() => setScreen('topics')}
          onOpenCbt={() => setScreen('cbt')}
          onOpenMistakes={() => setScreen('mistakes')}
          onOpenPlanner={() => setScreen('planner')}
          onOpenSandboxes={() => setScreen('sandboxes')}
          onOpenTheory={() => setScreen('theory')}
          onOpenTranscript={() => setScreen('transcript')}
          onOpenDuel={() => {
            setActiveDuelCode(null);
            setScreen('duel');
          }}
          onOpenLeaderboard={() => setScreen('leaderboard')}
          onOpenQuestionBank={handleOpenQuestionBank}
        />
      )}

      {screen === 'topics' && (
        <TopicsMapScreen
          progress={progress}
          onSelectSubject={handleSelectSubject}
          onSelectClass={(cls) => handleSelectSubjectClass(cls, false)}
          onManageSubjects={() => setScreen('subjs')}
          onOpenTopic={openTopic}
          onOpenLab={() => setScreen('lab')}
          onOpenFormulas={
            progress.subj === 'bio' || progress.subj === 'agric' || progress.subj === 'civic'
              ? undefined
              : () => openFormulasStudio('topics', null)
          }
        />
      )}

      {screen === 'topic' && currentTopic && (
        <TopicHubScreen
          topic={currentTopic}
          lesson={currentLesson}
          progress={progress}
          onBack={() => setScreen('topics')}
          onStartLesson={() => openLesson(currentTopic.id)}
          onOpenNotes={() => setScreen('notes')}
          onStartPractice={() => startPractice(currentTopic.id)}
          onStartTopicTest={() => startTopicTest(currentTopic.id)}
          onOpenLab={(labId) => openLabPlayer(labId, 'topic')}
          onOpenFormulas={
            progress.subj === 'bio' || progress.subj === 'agric' || progress.subj === 'civic'
              ? undefined
              : (tid) => openFormulasStudio('topic', tid)
          }
        />
      )}

      {screen === 'notes' && currentTopic && (
        <NotesScreen
          key={currentTopic.id}
          topic={currentTopic}
          lesson={currentLesson}
          subj={progress.subj}
          muted={progress.muted}
          flags={progress.flags}
          onToggleReadPart={(partIdx, forceRead) =>
            handleToggleNoteRead(currentTopic.id, partIdx, forceRead)
          }
          onBack={() => setScreen('topic')}
          onStartLesson={() => openLesson(currentTopic.id)}
          onStartPractice={() => startPractice(currentTopic.id)}
          onSound={(k) => playSound(k === 'ok' ? 'right' : 'wrong', 1)}
        />
      )}

      {screen === 'lesson' && currentTopic && (
        <LessonScreen
          key={currentTopic.id}
          topic={currentTopic}
          lesson={currentLesson}
          progress={progress}
          onBack={() => setScreen('topic')}
          onCompleteLesson={() => {
            spawnXpBurst('Lesson Complete', 'Ready to practise');
            commitProgressWithBadges((prev) => {
              const ts = tstate(prev, currentTopic.id);
              const firstTime = !ts.lesson;
              return {
                ...prev,
                xp: prev.xp + (firstTime ? 25 : 5),
                t: { ...prev.t, [currentTopic.id]: { ...ts, lesson: 1 } },
              };
            });
          }}
          onStartPractice={() => startPractice(currentTopic.id)}
          onSound={(k) => {
            if (k === 'ok') playSound('right', 1);
            else if (k === 'no') playSound('wrong');
            else if (k === 'done') playSound('done');
            else if (k === 'draw') playSound('draw', 2);
          }}
        />
      )}

      {screen === 'quiz' && quizSession && (
        <QuizScreen
          session={quizSession}
          progress={progress}
          topic={quizSession.tid ? getTopic(progress.subj, quizSession.tid) : undefined}
          onPickAnswer={handleQuizAnswer}
          onNextQuestion={handleQuizNext}
          onExit={() => {
            setScreen(quizSession.kind === 'practice' && quizSession.tid ? 'topic' : 'home');
          }}
        />
      )}

      {screen === 'sum' && quizSession && (
        <SummaryScreen
          session={quizSession}
          progress={progress}
          topic={quizSession.tid ? getTopic(progress.subj, quizSession.tid) : undefined}
          onTakeTopicTest={() => {
            if (quizSession.tid) startTopicTest(quizSession.tid);
          }}
          onPracticeAgain={() => {
            if (quizSession.tid) startPractice(quizSession.tid);
          }}
          onDone={() => {
            setScreen(quizSession.kind === 'practice' && quizSession.tid ? 'topic' : 'home');
          }}
        />
      )}

      {screen === 'boss' && bossSession && (
        <TopicTestScreen
          session={bossSession}
          topic={getTopic(progress.subj, bossSession.tid) || currentTopic}
          progress={progress}
          onStartFight={() => {
            playSound('slam');
            setBossSession((prev) => (prev ? { ...prev, phase: 'fight' } : prev));
          }}
          onPickAnswer={handleBossPick}
          onNextQuestion={handleBossNext}
          onTick={handleBossTick}
          onRetry={() => startTopicTest(bossSession.tid)}
          onExit={() => setScreen('topic')}
        />
      )}

      {screen === 'lab' &&
        progress.subj !== 'fmaths' &&
        progress.subj !== 'geog' &&
        progress.subj !== 'eng' &&
        progress.subj !== 'econ' &&
        progress.subj !== 'civic' &&
        progress.subj !== 'digitech' &&
        progress.subj !== 'dataproc' && (
        <LabListScreen
          subj={progress.subj}
          flags={progress.flags}
          onBack={() => setScreen('topics')}
          onOpenLabItem={(id) => openLabPlayer(id, 'lab')}
          onOpenFormulas={
            progress.subj === 'bio' || progress.subj === 'agric'
              ? undefined
              : () => openFormulasStudio('lab', null)
          }
        />
      )}

      {screen === 'labrun' &&
        progress.subj !== 'fmaths' &&
        progress.subj !== 'geog' &&
        progress.subj !== 'eng' &&
        progress.subj !== 'econ' &&
        progress.subj !== 'civic' &&
        progress.subj !== 'digitech' &&
        progress.subj !== 'dataproc' &&
        currentLab && (
        <LabPlayerScreen
          lab={currentLab}
          muted={progress.muted}
          onBack={() => setScreen(labReturnScreen)}
          onCompleteLab={handleCompleteLab}
        />
      )}

      {screen === 'formulas' &&
        progress.subj !== 'bio' &&
        progress.subj !== 'agric' &&
        progress.subj !== 'civic' && (
        <ChemFormulasScreen
          progress={progress}
          initialTopicId={formulaTopicFilterId}
          onBack={() => setScreen(formulaReturnScreen)}
          onOpenLab={() => setScreen('lab')}
          onOpenTopic={(tid) => openTopic(tid)}
          onRecordFormulaAttempt={handleRecordFormulaAttempt}
          onCelebrate={triggerConfetti}
          onSound={(k) => {
            if (k === 'ok') playSound('right', 1);
            else if (k === 'no') playSound('wrong');
            else playSound('done');
          }}
        />
      )}

      {screen === 'review' && (
        <ReviewScreen progress={progress} onStartReview={startReview} />
      )}

      {screen === 'more' && (
        <AccountScreen
          progress={progress}
          effectiveThemeId={effectiveThemeId}
          appearanceMode={effectiveThemeMode}
          themeLockMode={themeLockMode}
          themeAutoProgress={themeAutoProgress}
          clockFormat={progress.clockFormat || '12h'}
          goalSnapshot={goalSnapshot}
          onSelectTheme={handleSelectTheme}
          onChangeAppearanceMode={handleChangeThemeMode}
          onChangeThemeLockMode={handleChangeThemeLockMode}
          onToggleThemeAutoProgress={handleToggleThemeAutoProgress}
          onChangeClockFormat={handleChangeClockFormat}
          onToggleMuted={() =>
            setProgress((prev) => ({ ...prev, muted: !prev.muted }))
          }
          onOpenSubjects={() => setScreen('subjs')}
          onOpenTranscript={() => setScreen('transcript')}
          onOpenLeaderboard={() => setScreen('leaderboard')}
          onOpenQuestionBank={handleOpenQuestionBank}
          onRetakeDiagnostic={() => startDiagnostic()}
          onSignOut={handleSignOut}
          onPreviewBadgeCelebration={(badge, isPreview) => {
            playSound('shimmer');
            setBadgeBatchTotal(1);
            setBadgeQueue([{ badge, isPreview }]);
          }}
        />
      )}

      {screen === 'cbt' && (
        <CbtExamScreen
          progress={progress}
          onCompleteCbt={handleCompleteCbt}
          onOpenWeakTopic={handleOpenWeakTopic}
          onBack={() => setScreen('home')}
        />
      )}

      {screen === 'mistakes' && (
        <MistakeVaultScreen
          progress={progress}
          onRedeemMistake={handleRedeemMistake}
          onOpenTopicNotes={handleOpenWeakTopic}
          onBack={() => setScreen('home')}
        />
      )}

      {screen === 'planner' && (
        <StudyPlannerScreen
          progress={progress}
          onSavePlan={handleSaveStudyPlan}
          onLaunchTask={handleLaunchPlannerTask}
          onBack={() => setScreen('home')}
        />
      )}

      {screen === 'sandboxes' && (
        <InteractiveSandboxesScreen
          initialSubject={progress.subj}
          onBack={() => setScreen('home')}
        />
      )}

      {screen === 'theory' && (
        <TheoryCoachScreen
          progress={progress}
          onSaveTheoryScore={handleSaveTheoryScore}
          onBack={() => setScreen('home')}
        />
      )}

      {screen === 'transcript' && (
        <TranscriptScreen
          progress={progress}
          onBack={() => setScreen('home')}
        />
      )}

      {screen === 'duel' && (
        <PeerDuelScreen
          progress={progress}
          initialDuelCode={activeDuelCode}
          onCompleteDuel={handleCompleteDuel}
          onBack={() => setScreen('home')}
        />
      )}

      {screen === 'leaderboard' && (
        <LeaderboardScreen
          progress={progress}
          onBack={() => setScreen('home')}
          onUpdateLeaderboardPrefs={handleUpdateLeaderboardPrefs}
          onOpenCbt={() => setScreen('cbt')}
          onOpenDuel={() => {
            setActiveDuelCode(null);
            setScreen('duel');
          }}
          onOpenTopics={() => setScreen('topics')}
        />
      )}

      {screen === 'subjs' && (
        <SubjectsScreen
          progress={progress}
          dueCount={dueIds.length}
          onSelectSubject={(sid) => {
            handleSelectSubject(sid);
            setScreen('home');
          }}
          onToggleSubject={(sid) => {
            setProgress((prev) => {
              const has = prev.subjs.includes(sid);
              if (has && prev.subjs.length <= 1) return prev;
              const rawSubjs = has ? prev.subjs.filter((x) => x !== sid) : [...prev.subjs, sid];
              const nextSubjs = SUBJECT_IDS.filter((id) => rawSubjs.includes(id));
              const nextSubj = nextSubjs.includes(prev.subj) ? prev.subj : nextSubjs[0];
              return { ...prev, subjs: nextSubjs, subj: nextSubj };
            });
          }}
          onUpdateTarget={(t) =>
            setProgress((prev) => ({ ...prev, target: t }))
          }
          onOpenReview={() => setScreen('review')}
          onOpenQuestionBank={handleOpenQuestionBank}
          onBack={() => setScreen('more')}
        />
      )}
      </AppShell>
      </ClockFormatProvider>
      <QuestionBankManagerModal
        open={qbankModal.open}
        initialSubject={qbankModal.subject}
        initialTab={qbankModal.tab}
        onClose={() => setQbankModal((prev) => ({ ...prev, open: false }))}
      />
      <BadgeUnlockCelebration
        badge={badgeQueue[0]?.badge || null}
        isPreview={badgeQueue[0]?.isPreview}
        queueIndex={Math.max(1, badgeBatchTotal - badgeQueue.length + 1)}
        queueTotal={badgeBatchTotal}
        onDismiss={() => {
          setBadgeQueue((cur) => cur.slice(1));
        }}
      />
      {showNav && <FloatingLiveCoach muted={progress.muted} />}
      <OfflineIndicator />
    </LiveCoachProvider>
    </CloudSyncProvider>
    </ErrorBoundary>
  );
}
