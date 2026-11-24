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
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import {
  BOSS_HP,
  BOSS_TIME,
  PRACTICE_LEN,
  STORAGE_KEY,
  SUBJECT_INFO,
  bossList,
  dueList,
  dxList,
  evaluateNewBadges,
  isTopicLocked,
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
  getAllTopicsBySubj,
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
import { getMasteryThemeById } from './data/masteryThemes';
import {
  hasPremiumThemeAccess,
  isThemeUnlocked,
  resolveEffectiveThemeMode,
} from './utils/masteryThemeLogic';
import {
  PUBLIC_FREE_LAUNCH_ACTIVE,
  resolveRuntimeThemeId,
} from './utils/freeLaunchAndPwaLogic';
import { isStandaloneAppMode } from './utils/usePWAInstall';
import {
  computeScreenTransition,
  type ScreenTransitionSpec,
} from './utils/screenTransitionLogic';
import { AppShell, type MainTab } from './components/AppShell';
import { ClockFormatProvider } from './components/WatClock';
import { FloatingLiveCoach } from './components/FloatingLiveCoach';
import { BadgeUnlockCelebration, type XpBurstItem } from './components/FxCelebration';
import {
  LiveCoachProvider,
  subjectToLiveCoachMode,
  type ActiveLiveContextEntry,
} from './context/LiveCoachContext';
import { SUBJECT_TUTOR_REGISTRY } from './utils/tutorRegistry';
import { DxIntroScreen, WelcomeScreen } from './components/screens/OnboardingScreen';
import { LandingWebsiteScreen } from './components/screens/LandingWebsiteScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { TopicsMapScreen } from './components/screens/TopicsMapScreen';
import { TopicHubScreen } from './components/screens/TopicHubScreen';
import { NotesScreen } from './components/screens/NotesScreen';
import { LessonScreen } from './components/screens/LessonScreen';
import { QuizScreen, SummaryScreen } from './components/screens/QuizScreen';
import { TopicTestScreen } from './components/screens/TopicTestScreen';
import { LabListScreen, LabPlayerScreen } from './components/screens/LabScreens';
import { SubjectStudioScreen } from './components/screens/SubjectStudioScreen';
import { NovelsStudioScreen } from './components/screens/NovelsStudioScreen';
import { ChemFormulasScreen } from './components/screens/ChemFormulasScreen';
import { hasFormulaSheet, hasSubjectStudio } from './utils/subjectStudioMeta';
import {
  getDefaultNovelIdForSubject,
  getNovelById,
  recordNovelChapterQuiz,
  recordNovelFinalExamAndRankPoints,
  recordNovelQuizScore,
  toggleNovelChapterRead,
  updateNovelPersonalNotes,
  type NovelFinalExamEvaluation,
} from './utils/novelsLogic';
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
import { CloudSyncProvider, mergeCloudProgress } from './context/CloudSyncContext';
import { installCopyProtection } from './utils/copyProtection';
import { OfflineIndicator } from './components/PWAInstallBanner';
import { redeemMistakeRecord, upsertMistakeRecord } from './utils/mistakeVaultLogic';
import { parseDuelCode } from './utils/peerDuelLogic';
import { getDefaultStudyPlan, type StudyPlanConfig } from './utils/studyPlannerLogic';
import { isJambSubject } from './utils/examSubjects';
import {
  getSaturdayCbtCampaign,
  getToughJambDrillConfig,
  normalizeJambQuartet,
  resolveExamTrack,
} from './utils/examTrackLogic';
import { ExamSetupScreen, type ExamSetupResult } from './components/screens/ExamSetupScreen';
import { QuestionBankManagerModal, type QuestionBankTab } from './components/QuestionBankManagerModal';
import { PaywallModal } from './components/PaywallModal';
import {
  DemoCountdownBar,
  DemoExpiredModal,
  TrialCountdownBar,
} from './components/DemoSessionBanner';
import {
  computeDemoSessionStatus,
  loadDemoSession,
  pauseDemoSessionKeepClock,
  saveDemoSession,
  startOrResumeDemoSession,
  type DemoSessionRecord,
} from './utils/demoSessionLogic';
import { EntitlementProvider } from './context/EntitlementContext';
import {
  FREE_TRIAL_DAYS,
  FREE_TRIAL_DURATION_MS,
  computeTrialCountdownStatus,
  computeTrialStatus,
  generateDeviceSecretToken,
  getPremiumPlanById,
  hasActivePremium,
  isValidDeviceSecretToken,
  isValidPaystackReference,
  verifySignedProReceiptAsync,
  verifySignedTrialReceiptAsync,
  type PremiumPlanId,
  type SubscriptionAutoRenewInfo,
  type TrialLinkInfo,
} from './utils/paywallLogic';
import {
  EXAM_TRACK_SHOWCASES,
  type WebsiteInstantAction,
  type WebsiteOnboardingPreset,
} from './utils/websiteContentLogic';

const ENTITLEMENT_PUBKEY_STORAGE_KEY = 'rtc_pub_jwk_v1';

function loadCachedEntitlementPubKey(): JsonWebKey | null {
  try {
    if (typeof window === 'undefined') return null;
    const raw = window.localStorage.getItem(ENTITLEMENT_PUBKEY_STORAGE_KEY);
    if (!raw || raw.length > 2048) return null;
    const jwk = JSON.parse(raw) as JsonWebKey;
    if (jwk && jwk.kty === 'EC' && jwk.crv === 'P-256' && typeof jwk.x === 'string' && typeof jwk.y === 'string') {
      return jwk;
    }
  } catch {
    /* ignore */
  }
  return null;
}

function saveCachedEntitlementPubKey(jwk: JsonWebKey | null | undefined): void {
  if (!jwk || jwk.kty !== 'EC' || typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(ENTITLEMENT_PUBKEY_STORAGE_KEY, JSON.stringify(jwk));
  } catch {
    /* ignore */
  }
}

function loadInitialProgress(): { progress: UserProgress; startScreen: ScreenName; initialDuelCode: string | null } {
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const autostart = params?.get('autostart') === '1';
  const forceWebsite = params?.get('site') === '1' || params?.get('screen') === 'landing';
  const screenParam = params?.get('screen');
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

  const safeDevToken = isValidDeviceSecretToken(parsed?.devToken)
    ? parsed.devToken.trim()
    : base.devToken || generateDeviceSecretToken();

  const curDay = today();
  const safeTrial =
    parsed?.trial &&
    typeof parsed.trial === 'object' &&
    Number.isFinite(Number(parsed.trial.startedDay))
      ? {
          startedDay: Math.min(curDay, Math.floor(Number(parsed.trial.startedDay))),
          untilDay:
            Math.min(curDay, Math.floor(Number(parsed.trial.startedDay))) + FREE_TRIAL_DAYS - 1,
          startedAtMs:
            typeof parsed.trial.startedAtMs === 'number' && Number.isFinite(parsed.trial.startedAtMs)
              ? parsed.trial.startedAtMs
              : undefined,
          endsAtMs:
            typeof parsed.trial.endsAtMs === 'number' && Number.isFinite(parsed.trial.endsAtMs)
              ? parsed.trial.endsAtMs
              : undefined,
          sig: typeof parsed.trial.sig === 'string' ? parsed.trial.sig : undefined,
        }
      : null;

  const merged: UserProgress = {
    ...base,
    ...parsed,
    owner: 0,
    devToken: safeDevToken,
    trial: safeTrial,
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

  // Keep enrolled subjects in clean canonical 49-subject order
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
    const initTheme = resolveRuntimeThemeId(merged);
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

  if (forceWebsite) {
    return { progress: merged, startScreen: 'landing', initialDuelCode: null };
  }

  if (screenParam === 'welcome') {
    return { progress: merged, startScreen: 'welcome', initialDuelCode: null };
  }

  if (screenParam === 'examsetup') {
    setSessionUnlocked();
    if (!merged.name) {
      merged.name = 'Ada';
      merged.ob = 1;
    }
    return { progress: merged, startScreen: 'examsetup', initialDuelCode: null };
  }

  if (screenParam === 'novels') {
    setSessionUnlocked();
    if (!merged.name) {
      merged.name = 'Ada';
      merged.ob = 1;
    }
    return { progress: merged, startScreen: 'novels', initialDuelCode: null };
  }

  if (!autostart && merged.name && isSessionUnlocked() && !merged.flags?.examSetupDone) {
    return { progress: merged, startScreen: 'examsetup', initialDuelCode: null };
  }

  if (autostart || (merged.name && isSessionUnlocked())) {
    return { progress: merged, startScreen: 'home', initialDuelCode: null };
  }

  // When launched from the installed app icon on Android, iPhone, or Laptop,
  // enter straight into the native app sign-in/get-started flow like a Play Store app.
  if (isStandaloneAppMode()) {
    return { progress: merged, startScreen: 'welcome', initialDuelCode: null };
  }

  return { progress: merged, startScreen: 'landing', initialDuelCode: null };
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
  const [lessonReturnScreen, setLessonReturnScreen] = useState<ScreenName>('topic');
  const [quizReturnScreen, setQuizReturnScreen] = useState<ScreenName | null>(null);
  const [companionReturnScreen, setCompanionReturnScreen] = useState<ScreenName>('home');
  const [studioReturnScreen, setStudioReturnScreen] = useState<ScreenName>('topics');
  const [activeNovelId, setActiveNovelId] = useState<string>('lekki-headmaster');
  const [novelsReturnScreen, setNovelsReturnScreen] = useState<ScreenName>('home');
  const [formulaTopicFilterId, setFormulaTopicFilterId] = useState<string | null>(null);
  const [formulaReturnScreen, setFormulaReturnScreen] = useState<ScreenName>('home');
  const [examSetupReturnScreen, setExamSetupReturnScreen] = useState<ScreenName>('home');
  const [welcomeAuthMode, setWelcomeAuthMode] = useState<'login' | 'register'>('register');
  const [fromWebsiteBlueprint, setFromWebsiteBlueprint] = useState<boolean>(false);
  const [pendingWebsiteIntent, setPendingWebsiteIntent] = useState<{
    destination: 'default' | 'cbt' | 'paywall';
    planId?: PremiumPlanId;
  } | null>(null);
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
  const [paywallModal, setPaywallModal] = useState<{
    open: boolean;
    reason?: string;
    initialRef?: string | null;
    initialPlanId?: PremiumPlanId | null;
  }>({ open: false });
  const [billingMeta, setBillingMeta] = useState<{
    paystackEnabled: boolean;
    isAdmin: boolean;
    trialLink: TrialLinkInfo | null;
    subscriptionAutoRenew: SubscriptionAutoRenewInfo | null;
  }>({
    paystackEnabled: false,
    isAdmin: false,
    trialLink: null,
    subscriptionAutoRenew: null,
  });
  const [demoSession, setDemoSession] = useState<DemoSessionRecord | null>(() => loadDemoSession());
  const [clockNowMs, setClockNowMs] = useState<number>(() => Date.now());
  const [isExamHallActive, setIsExamHallActive] = useState<boolean>(false);

  // Hold milestone pop-ups while inside an active lesson, quiz, topic test, or mock exam
  const deferredMilestonesRef = useRef<{
    toast: BadgeDef | null;
    badges: BadgeDef[];
  }>({ toast: null, badges: [] });
  const screenRef = useRef<ScreenName>(screen);
  screenRef.current = screen;
  const bossPhaseRef = useRef<string | null>(bossSession?.phase ?? null);
  bossPhaseRef.current = bossSession?.phase ?? null;

  const handleOpenQuestionBank = useCallback((subj?: SubjectId, tab: QuestionBankTab = 'overview') => {
    setQbankModal({ open: true, subject: subj || null, tab });
  }, []);

  const handleOpenPaywall = useCallback((reason?: string, initialPlanId?: PremiumPlanId | null) => {
    setPaywallModal({ open: true, reason, initialRef: null, initialPlanId: initialPlanId || null });
  }, []);

  const [entitlementPubKey, setEntitlementPubKey] = useState<JsonWebKey | null>(() =>
    loadCachedEntitlementPubKey()
  );

  // Sync authoritative Premium pass status, Paystack availability, and Owner status from Cloud SQL
  useEffect(() => {
    let cancelled = false;
    const checkStatus = async (firebaseUser = auth.currentUser) => {
      try {
        const headers: Record<string, string> = {};
        if (progress.devToken) {
          headers['X-Device-Token'] = progress.devToken;
        }
        if (firebaseUser) {
          try {
            const tok = await firebaseUser.getIdToken();
            if (tok) headers.Authorization = `Bearer ${tok}`;
          } catch {
            /* ignore token error */
          }
        }
        const resp = await fetch('/api/billing/status', { headers });
        if (!resp.ok || cancelled) return;
        const data = (await resp.json()) as {
          paystackEnabled?: boolean;
          isAdmin?: boolean;
          entitlementPublicKey?: JsonWebKey;
          pro?: NonNullable<UserProgress['pro']> | null;
          trial?: NonNullable<UserProgress['trial']> | null;
          trialLink?: TrialLinkInfo | null;
          subscriptionAutoRenew?: SubscriptionAutoRenewInfo | null;
        };
        if (cancelled) return;
        if (data.entitlementPublicKey && data.entitlementPublicKey.kty === 'EC') {
          saveCachedEntitlementPubKey(data.entitlementPublicKey);
          setEntitlementPubKey(data.entitlementPublicKey);
        }
        setBillingMeta({
          paystackEnabled: Boolean(data.paystackEnabled),
          isAdmin: Boolean(data.isAdmin),
          trialLink: data.trialLink || null,
          subscriptionAutoRenew: data.subscriptionAutoRenew || null,
        });
        setProgress((prev) => {
          const nextOwner = data.isAdmin ? 1 : 0;
          const nextPro =
            data.pro || (hasActivePremium({ pro: prev.pro, owner: 0 }) ? prev.pro : null);
          const nextTrial = data.trial || prev.trial || null;
          const samePro =
            prev.pro?.sig === nextPro?.sig && prev.pro?.until === nextPro?.until;
          const sameTrial =
            prev.trial?.sig === nextTrial?.sig &&
            prev.trial?.startedDay === nextTrial?.startedDay &&
            prev.trial?.endsAtMs === nextTrial?.endsAtMs;
          if (prev.owner === nextOwner && samePro && sameTrial) return prev;
          return {
            ...prev,
            owner: nextOwner,
            pro: nextPro,
            trial: nextTrial,
          };
        });
      } catch {
        /* offline fallback verifies local receipt cryptographically via WebCrypto */
      }
    };

    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        saveDemoSession(null);
        setDemoSession(null);
      }
      void checkStatus(u);
    });
    return () => {
      cancelled = true;
      unsub();
    };
  }, [progress.devToken]);

  // Offline tamper guard: verify any locally stored `pro` receipt against the server ECDSA P-256 public key
  useEffect(() => {
    if (!globalThis.crypto?.subtle) return;
    const currentPro = progress.pro;
    const pubKey = entitlementPubKey || loadCachedEntitlementPubKey();
    if (!currentPro || !pubKey) return;

    let cancelled = false;
    (async () => {
      const ok = await verifySignedProReceiptAsync(currentPro, pubKey);
      if (!ok && !cancelled) {
        setProgress((prev) =>
          prev.pro && prev.pro.sig === currentPro.sig ? { ...prev, pro: null } : prev
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [progress.pro, entitlementPubKey]);

  // Offline tamper guard for 3-day starter trial: reject forged signatures and clamp to expired
  useEffect(() => {
    if (!globalThis.crypto?.subtle) return;
    const currentTrial = progress.trial;
    const pubKey = entitlementPubKey || loadCachedEntitlementPubKey();
    if (!currentTrial || !currentTrial.sig || !pubKey) return;

    let cancelled = false;
    (async () => {
      const ok = await verifySignedTrialReceiptAsync(currentTrial, pubKey);
      if (!ok && !cancelled) {
        const d = today();
        setProgress((prev) =>
          prev.trial && prev.trial.sig === currentTrial.sig
            ? {
                ...prev,
                trial: {
                  startedDay: d - FREE_TRIAL_DAYS,
                  untilDay: d - 1,
                },
              }
            : prev
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [progress.trial, entitlementPubKey]);

  // Auto-verify returning Paystack checkout query parameter (?paystack_ref= or ?reference=)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    const refParam =
      url.searchParams.get('paystack_ref') ||
      url.searchParams.get('reference') ||
      url.searchParams.get('trxref');
    if (!refParam || !isValidPaystackReference(refParam)) return;

    url.searchParams.delete('paystack_ref');
    url.searchParams.delete('reference');
    url.searchParams.delete('trxref');
    window.history.replaceState({}, '', url.pathname + url.search + url.hash);

    let cancelled = false;
    (async () => {
      try {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (progress.devToken) {
          headers['X-Device-Token'] = progress.devToken;
        }
        if (auth.currentUser) {
          const tok = await auth.currentUser.getIdToken().catch(() => '');
          if (tok) headers.Authorization = `Bearer ${tok}`;
        }
        const resp = await fetch('/api/billing/paystack/verify', {
          method: 'POST',
          headers,
          body: JSON.stringify({ reference: refParam }),
        });
        const data = (await resp.json().catch(() => ({}))) as {
          ok?: boolean;
          entitlementPublicKey?: JsonWebKey;
          pro?: NonNullable<UserProgress['pro']>;
        };
        if (cancelled) return;
        if (data.entitlementPublicKey && data.entitlementPublicKey.kty === 'EC') {
          saveCachedEntitlementPubKey(data.entitlementPublicKey);
          setEntitlementPubKey(data.entitlementPublicKey);
        }
        if (resp.ok && data.ok && data.pro) {
          setProgress((prev) => ({ ...prev, pro: data.pro! }));
          setPaywallModal({
            open: true,
            reason: 'Payment verified! Your Easy Learn Premium pass is now active.',
            initialRef: null,
          });
        } else {
          setPaywallModal({
            open: true,
            reason: 'Complete or verify your Paystack checkout below.',
            initialRef: refParam,
          });
        }
      } catch {
        if (!cancelled) {
          setPaywallModal({
            open: true,
            reason: 'Verify your Paystack payment status below.',
            initialRef: refParam,
          });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [progress.dev]);

  const effectiveOwner = progress.owner || (billingMeta.isAdmin ? 1 : 0);
  const entitledProgress = React.useMemo(
    () => (effectiveOwner && !progress.owner ? { ...progress, owner: 1 } : progress),
    [progress, effectiveOwner]
  );
  const isPremiumStudent = React.useMemo(
    () => PUBLIC_FREE_LAUNCH_ACTIVE || hasPremiumThemeAccess(entitledProgress),
    [entitledProgress]
  );
  const demoStatus = React.useMemo(
    () => computeDemoSessionStatus(demoSession, clockNowMs),
    [demoSession, clockNowMs]
  );
  const trialStatus = React.useMemo(
    () => computeTrialStatus(entitledProgress),
    [entitledProgress]
  );
  const trialCountdown = React.useMemo(
    () =>
      computeTrialCountdownStatus({
        trial: entitledProgress.trial,
        trialLink: billingMeta.trialLink,
        nowMs: clockNowMs,
      }),
    [entitledProgress.trial, billingMeta.trialLink, clockNowMs]
  );
  const isWorkspaceScreen =
    screen !== 'landing' && screen !== 'welcome' && screen !== 'examsetup';
  const isInsideAppSession = screen !== 'landing' && screen !== 'welcome';
  const isDemoLockedOut =
    isInsideAppSession && !isPremiumStudent && demoStatus.isDemoActive && demoStatus.isExpired;
  const isTrialLockedOut =
    !PUBLIC_FREE_LAUNCH_ACTIVE &&
    isWorkspaceScreen &&
    !demoStatus.isDemoActive &&
    !isPremiumStudent &&
    (trialStatus.isTrialExpired || trialCountdown.isExpired);

  // Live 1-second ticker for active 5-minute demo countdown and active 1-day free trial countdown
  const shouldTickCountdown =
    (demoStatus.isDemoActive && !demoStatus.isExpired) ||
    (!PUBLIC_FREE_LAUNCH_ACTIVE &&
      isWorkspaceScreen &&
      !demoStatus.isDemoActive &&
      !isPremiumStudent &&
      !trialCountdown.isExpired);

  useEffect(() => {
    if (!shouldTickCountdown) return;
    setClockNowMs(Date.now());
    const id = window.setInterval(() => {
      setClockNowMs(Date.now());
    }, 1000);
    return () => window.clearInterval(id);
  }, [shouldTickCountdown]);
  const effectiveThemeMode = React.useMemo(
    () => resolveEffectiveThemeMode(entitledProgress),
    [entitledProgress]
  );
  const effectiveThemeId = React.useMemo(
    () => resolveRuntimeThemeId(entitledProgress),
    [entitledProgress]
  );

  // Confetti and floating XP bursts removed per calm Playful motion rules
  const triggerConfetti = useCallback(() => {
    setConfettiKey(0);
  }, []);

  const spawnXpBurst = useCallback((_label: string, _sub?: string) => {
    setXpBursts([]);
  }, []);

  const flushDeferredMilestones = useCallback(
    (muted: boolean) => {
      const pendingToast = deferredMilestonesRef.current.toast;
      const pendingBadges = deferredMilestonesRef.current.badges;
      if (!pendingToast && pendingBadges.length === 0) return;
      deferredMilestonesRef.current = { toast: null, badges: [] };
      if (pendingToast) {
        setBadgeToast(pendingToast);
        sfx('shimmer', muted);
      }
      if (pendingBadges.length > 0) {
        setBadgeBatchTotal((curTotal) =>
          badgeQueue.length > 0 ? curTotal + pendingBadges.length : pendingBadges.length
        );
        setBadgeQueue((cur) => [
          ...cur,
          ...pendingBadges.map((b) => ({ badge: b, isPreview: false })),
        ]);
        sfx('win', muted);
      }
    },
    [badgeQueue.length]
  );

  // Flush queued milestone pop-ups once the student finishes a lesson, quiz, or test
  useEffect(() => {
    const inActiveAssessment =
      screen === 'lesson' ||
      screen === 'quiz' ||
      (screen === 'boss' && bossSession?.phase === 'fight') ||
      (screen === 'cbt' && isExamHallActive);
    if (!inActiveAssessment) {
      flushDeferredMilestones(progress.muted);
    }
    if (screen !== 'cbt' && isExamHallActive) {
      setIsExamHallActive(false);
    }
  }, [screen, bossSession?.phase, isExamHallActive, flushDeferredMilestones, progress.muted]);

  // Sync [data-subj], [data-theme], [data-mode] & persist to localStorage
  useEffect(() => {
    document.documentElement.dataset.subj = progress.subj;
    document.documentElement.dataset.theme = effectiveThemeId;
    document.documentElement.dataset.mode = effectiveThemeMode;
    document.documentElement.classList.toggle('dark', effectiveThemeMode === 'dark');
    delete document.documentElement.dataset.template;
    delete document.body.dataset.template;
    document.body.dataset.theme = effectiveThemeId;
    document.body.dataset.mode = effectiveThemeMode;
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', effectiveThemeMode === 'dark' ? '#15102B' : '#5B2BD6');
    }
    try {
      // Never persist privileged `owner` session flag to localStorage
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...progress, owner: 0 }));
    } catch {
      /* ignore quota errors */
    }
  }, [progress, effectiveThemeId, effectiveThemeMode]);

  // App-wide Content Copy Protection (allows typing/copy/paste inside inputs & [data-allow-copy="true"])
  useEffect(() => {
    return installCopyProtection(document);
  }, []);

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

  const mutedRef = useRef<boolean>(progress.muted);
  mutedRef.current = progress.muted;

  // One capture-phase click listener for soft bubble tap sounds across buttons, links, tabs, radios, and switches
  useEffect(() => {
    const onCaptureClick = (ev: MouseEvent) => {
      if (mutedRef.current) return;
      const rawTarget = ev.target;
      if (!(rawTarget instanceof Element)) return;
      const control = rawTarget.closest(
        'button, a[href], [role="tab"], [role="radio"], [role="switch"]'
      );
      if (!control) return;
      if (
        (control as HTMLButtonElement).disabled ||
        control.getAttribute('aria-disabled') === 'true'
      ) {
        return;
      }
      if (control.closest('.eyak-hall') || control.closest('[data-no-sound]')) {
        return;
      }
      sfx('tap', false);
    };
    document.addEventListener('click', onCaptureClick, true);
    return () => document.removeEventListener('click', onCaptureClick, true);
  }, []);

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
      const allTopicsBySubj = getAllTopicsBySubj();
      const { progress: finalProgress, newlyEarned } = evaluateNewBadges(
        updated,
        topics,
        today(),
        allTopicsBySubj
      );

      const curScr = screenRef.current;
      const deferNow =
        curScr === 'lesson' ||
        curScr === 'quiz' ||
        (curScr === 'boss' && bossPhaseRef.current === 'fight') ||
        curScr === 'cbt';

      if (newlyEarned.length > 0) {
        if (deferNow) {
          deferredMilestonesRef.current.badges = [
            ...deferredMilestonesRef.current.badges,
            ...newlyEarned,
          ];
        } else {
          setBadgeBatchTotal((curTotal) =>
            badgeQueue.length > 0 ? curTotal + newlyEarned.length : newlyEarned.length
          );
          setBadgeQueue((cur) => [
            ...cur,
            ...newlyEarned.map((b) => ({ badge: b, isPreview: false })),
          ]);
          sfx('win', updated.muted);
        }
      }
      return finalProgress;
    });
  }, [badgeQueue.length]);

  const handleSelectTheme = useCallback(
    (id: MasteryThemeId) => {
      playSound('tap');
      setProgress((prev) => {
        const targetTheme = getMasteryThemeById(id);
        const checkState = {
          ...prev,
          owner: prev.owner || (billingMeta.isAdmin ? 1 : 0),
        };
        if (!isThemeUnlocked(targetTheme, checkState)) return prev;
        return {
          ...prev,
          themeId: id,
          flags: { ...prev.flags, themeTs: Date.now() },
        };
      });
    },
    [playSound, billingMeta.isAdmin]
  );

  const handleChangeThemeMode = useCallback(
    (mode: ThemeAppearanceMode) => {
      playSound('tap');
      setProgress((prev) => ({
        ...prev,
        themeMode: mode,
        flags: { ...prev.flags, themeTs: Date.now() },
      }));
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

  const openExamSetup = useCallback((returnTo: ScreenName) => {
    setExamSetupReturnScreen(returnTo);
    setScreen('examsetup');
  }, []);

  const handleCompleteExamSetup = useCallback(
    (res: ExamSetupResult) => {
      setProgress((prev) => {
        const basePlan = prev.studyPlan || getDefaultStudyPlan(res.subjs);
        return {
          ...prev,
          examTrack: res.examTrack,
          jambSubjects: res.jambSubjects,
          subjs: res.subjs,
          subj: res.primarySubj,
          studyPlan: {
            ...basePlan,
            examType: res.examTrack,
            focusSubjects: res.subjs.slice(0, 6),
          },
          flags: {
            ...prev.flags,
            examSetupDone: 1,
          },
        };
      });
      if (pendingWebsiteIntent?.destination === 'paywall') {
        const plan = pendingWebsiteIntent.planId
          ? getPremiumPlanById(pendingWebsiteIntent.planId)
          : null;
        setPendingWebsiteIntent(null);
        setScreen('home');
        handleOpenPaywall(
          plan
            ? `Activate your ${plan.name} (${plan.shortLabel}) pass for full 49-subject access.`
            : undefined,
          pendingWebsiteIntent.planId || null
        );
        return;
      }
      if (pendingWebsiteIntent?.destination === 'cbt') {
        setPendingWebsiteIntent(null);
        setScreen('home');
        const satOpen = getSaturdayCbtCampaign(Date.now(), progress.cbtHistory).isSaturday;
        if (hasActivePremium(progress) || satOpen) {
          setScreen('cbt');
        } else {
          handleOpenPaywall(
            'CBT Mock Exams unlock free every Saturday in the National CBT Arena, or subscribe from ₦1,000/month for daily UTME & WAEC mock access.'
          );
        }
        return;
      }
      setScreen(examSetupReturnScreen);
    },
    [examSetupReturnScreen, handleOpenPaywall, pendingWebsiteIntent, progress]
  );

  const handleCompleteOnboarding = (cfg: {
    name: string;
    subjs: SubjectId[];
    classLevel: ChemClassId;
    target: number;
  }) => {
    setSessionUnlocked();
    saveDemoSession(null);
    setDemoSession(null);
    const orderedSubjs = SUBJECT_IDS.filter((id) => cfg.subjs.includes(id));
    const finalSubjs = orderedSubjs.length > 0 ? orderedSubjs : cfg.subjs;
    const primarySubj = finalSubjs[0] || 'maths';
    const d = today();
    const nowMs = Date.now();
    const nextScreenAfterSetup: ScreenName = cfg.classLevel !== 'all' ? 'topics' : 'dxintro';
    setProgress((prev) => ({
      ...prev,
      name: cfg.name,
      subjs: finalSubjs,
      subj: primarySubj,
      trial: prev.trial || {
        startedDay: d,
        untilDay: d + FREE_TRIAL_DAYS - 1,
        startedAtMs: nowMs,
        endsAtMs: nowMs + FREE_TRIAL_DURATION_MS,
      },
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
    setExamSetupReturnScreen(nextScreenAfterSetup);
    setScreen('examsetup');
  };

  const handleAuthenticated = (cfg: {
    name: string;
    subjs?: SubjectId[];
    classLevel?: ChemClassId;
    target?: number;
    isExisting: boolean;
  }) => {
    setSessionUnlocked();
    saveDemoSession(null);
    setDemoSession(null);
    if (cfg.isExisting) {
      const d = today();
      const nowMs = Date.now();
      setProgress((prev) => ({
        ...prev,
        name: cfg.name || prev.name || 'Scholar',
        trial: prev.trial || {
          startedDay: d,
          untilDay: d + FREE_TRIAL_DAYS - 1,
          startedAtMs: nowMs,
          endsAtMs: nowMs + FREE_TRIAL_DURATION_MS,
        },
        ob: 1,
      }));
      if (!progress.flags?.examSetupDone) {
        setExamSetupReturnScreen('home');
        setScreen('examsetup');
      } else if (pendingWebsiteIntent?.destination === 'paywall') {
        const plan = pendingWebsiteIntent.planId
          ? getPremiumPlanById(pendingWebsiteIntent.planId)
          : null;
        setPendingWebsiteIntent(null);
        setScreen('home');
        handleOpenPaywall(
          plan
            ? `Activate your ${plan.name} (${plan.shortLabel}) pass for full 49-subject access.`
            : undefined,
          pendingWebsiteIntent.planId || null
        );
      } else if (pendingWebsiteIntent?.destination === 'cbt') {
        setPendingWebsiteIntent(null);
        openCbtGated();
      } else {
        setScreen('home');
      }
    } else {
      handleCompleteOnboarding({
        name: cfg.name,
        subjs: cfg.subjs && cfg.subjs.length > 0 ? cfg.subjs : ['eng', 'maths'],
        classLevel: cfg.classLevel || 'all',
        target: cfg.target || 75,
      });
    }
  };

  const startDemoMode = useCallback(() => {
    const nowMs = Date.now();
    const next = startOrResumeDemoSession(loadDemoSession(), nowMs);
    saveDemoSession(next);
    setDemoSession(next);
    setClockNowMs(nowMs);
  }, []);

  const exitDemoToScreen = useCallback((dest: 'landing' | 'welcome', authMode?: 'login' | 'register') => {
    const paused = pauseDemoSessionKeepClock(loadDemoSession());
    saveDemoSession(paused);
    setDemoSession(paused);
    if (authMode) setWelcomeAuthMode(authMode);
    setScreen(dest);
  }, []);

  const handleSkipToDemo = () => {
    setSessionUnlocked();
    startDemoMode();
    setProgress((prev) => ({
      ...prev,
      name: prev.name.trim() || 'Ada',
      ob: 1,
      examTrack: prev.examTrack || 'jamb',
      flags: { ...(prev.flags || {}), examSetupDone: 1 },
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
    const paused = pauseDemoSessionKeepClock(loadDemoSession());
    saveDemoSession(paused);
    setDemoSession(paused);
    setPaywallModal({ open: false, initialRef: null });
    setScreen('landing');
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
    if (isTopicLocked(progress, tid, topics)) {
      handleOpenPaywall(`Unlock “${topic.name}” practice and all 600+ topics`);
      return;
    }
    const curMastery = mastery(progress, tid);
    const drillCfg = getToughJambDrillConfig(
      resolveExamTrack(progress),
      progress.subj,
      progress.jambSubjects
    );
    const startLvl = Math.max(
      drillCfg.minStartLevel,
      curMastery > 0.7 ? 4 : curMastery > 0.5 ? 3 : 2
    );
    const firstQ = pickPractice(progress, topic, startLvl, []);
    if (!firstQ) return;
    setActiveTopicId(tid);
    setQuizReturnScreen(null);
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
    setQuizReturnScreen(null);
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
    const topics = getTopics(progress.subj);
    if (isTopicLocked(progress, tid, topics)) {
      handleOpenPaywall(`Unlock “${topic.name}” topic test and all 600+ topics`);
      return;
    }
    const drillCfg = getToughJambDrillConfig(
      resolveExamTrack(progress),
      progress.subj,
      progress.jambSubjects
    );
    const list = bossList(progress, topic);
    setActiveTopicId(tid);
    setBossSession({
      tid,
      phase: 'intro',
      list,
      i: 0,
      hp: drillCfg.bossHp,
      targetHp: drillCfg.bossHp,
      hits: 0,
      combo: 0,
      best: 0,
      time: drillCfg.bossTimeSec,
      totalTime: drillCfg.bossTimeSec,
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

    const drillCfg = getToughJambDrillConfig(
      resolveExamTrack(progress),
      progress.subj,
      progress.jambSubjects
    );
    setQuizSession((prev) => {
      if (!prev) return prev;
      let nextLvl = prev.lvl;
      if (prev.kind === 'practice') {
        if (ok && nextRun >= 2) nextLvl = Math.min(5, prev.lvl + 1);
        else if (!ok) nextLvl = Math.max(drillCfg.isToughJamb ? drillCfg.minStartLevel : 1, prev.lvl - 1);
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
          playSound('step');
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
      playSound('step');
      setQuizSession((prev) => (prev ? { ...prev, i: nextI, cur: nextQId, picked: null } : prev));
    } else {
      setScreen('sum');
    }
  };

  const handleBossPick = (q: Question, origIdx: number, ok: boolean) => {
    if (!bossSession || bossSession.picked !== null) return;
    const nextCombo = ok ? bossSession.combo + 1 : 0;
    if (ok) {
      playSound('right', nextCombo);
      buzz(25, progress.muted);
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
      const targetHp = prev.targetHp || BOSS_HP;
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
        hp: Math.max(0, targetHp - hits),
      };
    });
  };

  const handleBossNext = () => {
    if (!bossSession) return;
    const targetHp = bossSession.targetHp || BOSS_HP;
    const won = bossSession.hits >= targetHp;
    const nextI = bossSession.i + 1;
    const outOfQs = nextI >= bossSession.list.length;

    if (won || outOfQs || bossSession.time <= 0) {
      const passed = bossSession.hits >= targetHp;
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

    playSound('step');
    setBossSession((prev) =>
      prev ? { ...prev, i: nextI, picked: null, result: null } : prev
    );
  };

  const handleBossTick = useCallback(() => {
    setBossSession((prev) => {
      if (!prev || prev.phase !== 'fight' || prev.picked !== null) return prev;
      const targetHp = prev.targetHp || BOSS_HP;
      const nextTime = prev.time - 1;
      if (nextTime > 0 && nextTime <= 15) {
        sfx('tick', mutedRef.current, nextTime);
      }
      if (nextTime <= 0) {
        return { ...prev, time: 0, phase: prev.hits >= targetHp ? 'won' : 'lost' };
      }
      return { ...prev, time: nextTime };
    });
  }, []);

  const handleNavigateTab = (tab: MainTab) => {
    if (tab === 'cbt') {
      const satOpen = getSaturdayCbtCampaign(Date.now(), progress.cbtHistory).isSaturday;
      if (!isPremiumStudent && !satOpen) {
        handleOpenPaywall(
          'CBT Mock Exams unlock free every Saturday in the National CBT Arena, or subscribe from ₦1,000/month for daily UTME & WAEC mock access.'
        );
        return;
      }
      setScreen('cbt');
      return;
    }
    if (tab === 'home') setScreen('home');
    else if (tab === 'subjects') setScreen('subjs');
    else if (tab === 'topics') setScreen('topics');
    else setScreen('more');
  };

  const openCbtGated = () => {
    const satOpen = getSaturdayCbtCampaign(Date.now(), progress.cbtHistory).isSaturday;
    if (!isPremiumStudent && !satOpen) {
      handleOpenPaywall(
        'CBT Mock Exams unlock free every Saturday in the National CBT Arena, or subscribe from ₦1,000/month for daily UTME & WAEC mock access.'
      );
      return;
    }
    setScreen('cbt');
  };

  const openLabDirectoryGated = () => {
    if (!isPremiumStudent) {
      handleOpenPaywall(
        'Virtual Practical Labs are locked during your 1-day free trial. Subscribe from ₦1,000/month to unlock every practical lab.'
      );
      return;
    }
    setScreen('lab');
  };

  const openNovelsStudio = (returnTo: ScreenName, novelId?: string) => {
    setActiveNovelId(novelId || getDefaultNovelIdForSubject(progress.subj));
    setNovelsReturnScreen(returnTo);
    setScreen('novels');
  };

  const handleToggleNovelChapter = useCallback((novelId: string, chapterNumber: number) => {
    setProgress((prev) => ({
      ...prev,
      novelProgress: toggleNovelChapterRead(
        prev.novelProgress,
        novelId,
        chapterNumber,
        prev.novelNotebook
      ),
    }));
  }, []);

  const handleRecordNovelChapterQuiz = useCallback(
    (novelId: string, chapterNumber: number, score: number, total: number) => {
      setProgress((prev) => {
        const res = recordNovelChapterQuiz(
          prev.novelProgress,
          novelId,
          chapterNumber,
          score,
          total,
          prev.novelNotebook
        );
        return {
          ...prev,
          xp: prev.xp + (res.passed ? 15 : 0),
          novelProgress: res.novelProgress,
        };
      });
    },
    []
  );

  const handleRecordNovelQuiz = useCallback((novelId: string, score: number, total: number) => {
    setProgress((prev) => ({
      ...prev,
      novelProgress: recordNovelQuizScore(
        prev.novelProgress,
        novelId,
        score,
        total,
        prev.novelNotebook
      ),
    }));
  }, []);

  const handleCompleteNovelFinalExam = useCallback(
    (novelId: string, evaluation: NovelFinalExamEvaluation) => {
      const novel = getNovelById(novelId);
      let awarded = { newlyAwardedRp: 0, newlyAwardedXp: 0 };
      setProgress((prev) => {
        const res = recordNovelFinalExamAndRankPoints(
          prev.novelProgress,
          novel,
          evaluation,
          prev.novelNotebook
        );
        awarded = {
          newlyAwardedRp: res.newlyAwardedRp,
          newlyAwardedXp: res.newlyAwardedXp,
        };
        return {
          ...prev,
          xp: prev.xp + res.newlyAwardedXp,
          novelProgress: res.novelProgress,
        };
      });
      return awarded;
    },
    []
  );

  const handleUpdateNovelNotes = useCallback((novelId: string, notes: string) => {
    setProgress((prev) => ({
      ...prev,
      novelProgress: updateNovelPersonalNotes(
        prev.novelProgress,
        novelId,
        notes,
        prev.novelNotebook
      ),
    }));
  }, []);

  const handleOpenNovelCurriculumTopic = (targetSubj: SubjectId, topicId: string) => {
    const subjTopics = getTopics(targetSubj);
    if (!PUBLIC_FREE_LAUNCH_ACTIVE && isTopicLocked(progress, topicId, subjTopics)) {
      const lockedTopic = getTopic(targetSubj, topicId);
      handleOpenPaywall(
        lockedTopic
          ? `Unlock “${lockedTopic.name}” and all 600+ topics across 49 subjects`
          : 'Unlock all 600+ topics across 49 subjects'
      );
      return;
    }
    setProgress((prev) => {
      const hasSubj = prev.subjs.includes(targetSubj);
      const nextSubjs = hasSubj
        ? prev.subjs
        : SUBJECT_IDS.filter((id) => id === targetSubj || prev.subjs.includes(id));
      return {
        ...prev,
        subj: targetSubj,
        subjs: nextSubjs,
      };
    });
    setActiveTopicId(topicId);
    setScreen('topic');
  };

  const openStudioGated = (returnTo: ScreenName) => {
    if (progress.subj === 'eng') {
      openNovelsStudio(returnTo, 'lekki-headmaster');
      return;
    }
    if (progress.subj === 'lit') {
      setStudioReturnScreen(returnTo);
      setScreen('studio');
      return;
    }
    if (!isPremiumStudent) {
      handleOpenPaywall(
        'Subject Studios & Practical Companions are locked during your 1-day free trial. Subscribe from ₦1,000/month for 100% full access.'
      );
      return;
    }
    setStudioReturnScreen(returnTo);
    setScreen('studio');
  };

  const openSandboxesGated = () => {
    if (!isPremiumStudent) {
      handleOpenPaywall(
        'Interactive Try-it Labs are locked during your 1-day free trial. Subscribe from ₦1,000/month for 100% full access.'
      );
      return;
    }
    setCompanionReturnScreen('home');
    setScreen('sandboxes');
  };

  const openTopic = (tid: string) => {
    const topics = getTopics(progress.subj);
    if (!PUBLIC_FREE_LAUNCH_ACTIVE && isTopicLocked(progress, tid, topics)) {
      const lockedTopic = getTopic(progress.subj, tid);
      handleOpenPaywall(
        lockedTopic
          ? `Unlock “${lockedTopic.name}” and all 600+ topics across 49 subjects`
          : 'Unlock all 600+ topics across 49 subjects'
      );
      return;
    }
    setActiveTopicId(tid);
    setScreen('topic');
  };

  const openLesson = (tid: string) => {
    const topics = getTopics(progress.subj);
    if (!PUBLIC_FREE_LAUNCH_ACTIVE && isTopicLocked(progress, tid, topics)) {
      const lockedTopic = getTopic(progress.subj, tid);
      handleOpenPaywall(
        lockedTopic
          ? `Unlock “${lockedTopic.name}” lesson and all 600+ topics`
          : 'Unlock all 600+ topics across 49 subjects'
      );
      return;
    }
    setLessonReturnScreen('topic');
    setActiveTopicId(tid);
    setScreen('lesson');
  };

  const openLabPlayer = (labId: string, returnTo: ScreenName) => {
    if (!isPremiumStudent) {
      handleOpenPaywall(
        'Virtual Practical Labs are locked during your 1-day free trial. Subscribe from ₦1,000/month to unlock every practical lab.'
      );
      return;
    }
    setActiveLabId(labId);
    setLabReturnScreen(returnTo);
    setScreen('labrun');
  };

  const applyWebsiteBlueprintToState = (
    chosenTrack: UserProgress['examTrack'],
    preferredSubject?: SubjectId,
    preset?: WebsiteOnboardingPreset,
    previewThemeId?: MasteryThemeId,
    seedDemoScholar = false
  ) => {
    const d = today();
    setProgress((prev) => {
      const mergedIds = preset?.enrolledSubjs?.length
        ? SUBJECT_IDS.filter(
            (id) =>
              preset.enrolledSubjs!.includes(id) ||
              (preferredSubject && id === preferredSubject)
          )
        : preferredSubject && !prev.subjs.includes(preferredSubject)
          ? SUBJECT_IDS.filter((id) => id === preferredSubject || prev.subjs.includes(id))
          : prev.subjs;

      const finalSubjs = mergedIds.length > 0 ? mergedIds : prev.subjs;
      const nextSubj = preferredSubject || preset?.jambQuartet?.[0] || prev.subj;
      const nextThemeId =
        previewThemeId &&
        isThemeUnlocked(getMasteryThemeById(previewThemeId), {
          ...prev,
          owner: prev.owner || (billingMeta.isAdmin ? 1 : 0),
        })
          ? previewThemeId
          : prev.themeId;
      const basePlan = prev.studyPlan || getDefaultStudyPlan(finalSubjs);

      return {
        ...prev,
        name: seedDemoScholar ? prev.name.trim() || 'Ada' : prev.name,
        ob: seedDemoScholar ? 1 : prev.ob,
        dx: seedDemoScholar ? prev.dx || d : prev.dx,
        trial:
          seedDemoScholar && !prev.trial
            ? { startedDay: d, untilDay: d + FREE_TRIAL_DAYS - 1 }
            : prev.trial,
        examTrack: chosenTrack || prev.examTrack,
        flags: seedDemoScholar
          ? { ...(prev.flags || {}), examSetupDone: 1 }
          : prev.flags,
        jambSubjects: preset?.jambQuartet?.length ? [...preset.jambQuartet] : prev.jambSubjects,
        subj: nextSubj,
        subjs: finalSubjs,
        target: preset?.targetPct ?? prev.target,
        leaderboardCampusGoal: preset?.campusGoal || prev.leaderboardCampusGoal,
        themeId: nextThemeId,
        studyPlan: {
          ...basePlan,
          examType: chosenTrack || basePlan.examType,
          focusSubjects: finalSubjs.slice(0, 6),
        },
        sx: seedDemoScholar
          ? {
              maths: { dx: d },
              fmaths: { dx: d },
              chem: { dx: d },
              phys: { dx: d },
              bio: { dx: d },
              agric: { dx: d },
              geog: { dx: d },
              econ: { dx: d },
              eng: { dx: d },
              civic: { dx: d },
              digitech: { dx: d },
              dataproc: { dx: d },
              ...prev.sx,
            }
          : prev.sx,
      };
    });
  };

  const handleWebsiteInstantAction = (action: WebsiteInstantAction) => {
    if (action.type === 'choose-pass') {
      const plan = getPremiumPlanById(action.planId);
      applyWebsiteBlueprintToState(
        action.examTrack,
        action.preset?.jambQuartet?.[0],
        action.preset,
        action.previewThemeId,
        false
      );
      if (PUBLIC_FREE_LAUNCH_ACTIVE) {
        if (progress.name.trim() && isSessionUnlocked()) {
          setScreen('home');
        } else {
          setFromWebsiteBlueprint(true);
          setPendingWebsiteIntent(null);
          setWelcomeAuthMode('register');
          setScreen('welcome');
        }
        return;
      }
      if (progress.name.trim() && isSessionUnlocked()) {
        setScreen('home');
        handleOpenPaywall(
          plan
            ? `Activate your ${plan.name} (${plan.shortLabel}) pass for full 49-subject access.`
            : undefined,
          action.planId
        );
      } else {
        setFromWebsiteBlueprint(true);
        setPendingWebsiteIntent({ destination: 'paywall', planId: action.planId });
        setWelcomeAuthMode('register');
        setScreen('welcome');
      }
      return;
    }

    if (action.type === 'live-cbt') {
      applyWebsiteBlueprintToState(
        action.examTrack,
        action.preset?.jambQuartet?.[0] || 'eng',
        action.preset,
        action.previewThemeId,
        false
      );
      const satOpen = getSaturdayCbtCampaign(Date.now(), progress.cbtHistory).isSaturday;
      if (progress.name.trim() && isSessionUnlocked()) {
        if (isPremiumStudent || satOpen) {
          setScreen('cbt');
        } else {
          setScreen('home');
          handleOpenPaywall(
            'CBT Mock Exams unlock free every Saturday in the National CBT Arena, or subscribe from ₦1,000/month for daily UTME & WAEC mock access.'
          );
        }
      } else {
        setFromWebsiteBlueprint(true);
        setPendingWebsiteIntent({ destination: 'cbt' });
        setWelcomeAuthMode('register');
        setScreen('welcome');
      }
      return;
    }

    const isFullDemoDashboard =
      action.type === 'demo-dashboard' || action.type === 'open-novel';
    const isRealAuthenticatedUser = Boolean(
      auth.currentUser || (progress.name.trim() && isSessionUnlocked() && !demoSession?.active)
    );
    if (!isRealAuthenticatedUser) {
      startDemoMode();
    }
    if (isFullDemoDashboard) {
      setSessionUnlocked();
    }
    const targetSubj: SubjectId =
      ('subj' in action && action.subj) ||
      action.preset?.jambQuartet?.[0] ||
      progress.subj ||
      'eng';

    applyWebsiteBlueprintToState(
      action.examTrack,
      targetSubj,
      action.preset,
      action.previewThemeId,
      isFullDemoDashboard
    );

    if (action.type === 'demo-dashboard') {
      setScreen('home');
      return;
    }

    if (action.type === 'open-novel') {
      setActiveNovelId(action.novelId);
      setNovelsReturnScreen('landing');
      setScreen('novels');
      return;
    }

    if (action.type === 'live-lab') {
      setActiveLabId(action.labId);
      setLabReturnScreen('landing');
      setScreen('labrun');
      return;
    }

    if (action.type === 'live-theory') {
      setCompanionReturnScreen('landing');
      setScreen('theory');
      return;
    }

    if (action.type === 'live-duel') {
      setCompanionReturnScreen('landing');
      setActiveDuelCode(null);
      setScreen('duel');
      return;
    }

    if (action.type === 'live-sandboxes') {
      setCompanionReturnScreen('landing');
      setScreen('sandboxes');
      return;
    }

    const subjTopics = getTopics(targetSubj);
    const chosenTopic =
      (action.topicId ? subjTopics.find((t) => t.id === action.topicId) : undefined) ||
      subjTopics[0];
    if (!chosenTopic) {
      setScreen('home');
      return;
    }

    if (action.type === 'live-lesson') {
      setActiveTopicId(chosenTopic.id);
      setLessonReturnScreen('landing');
      setScreen('lesson');
      return;
    }

    if (action.type === 'live-practice') {
      const drillCfg = getToughJambDrillConfig(
        action.examTrack,
        targetSubj,
        action.preset?.jambQuartet || progress.jambSubjects
      );
      const startLvl = Math.max(drillCfg.minStartLevel, 2);
      const tempProgress: UserProgress = {
        ...progress,
        subj: targetSubj,
        examTrack: action.examTrack,
      };
      const firstQ = pickPractice(tempProgress, chosenTopic, startLvl, []);
      if (!firstQ) {
        setScreen('home');
        return;
      }
      setActiveTopicId(chosenTopic.id);
      setQuizReturnScreen('landing');
      setQuizSession({
        kind: 'practice',
        tid: chosenTopic.id,
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
        m0: mastery(tempProgress, chosenTopic.id),
        pred0: predicted(tempProgress, subjTopics),
      });
      setScreen('quiz');
    }
  };

  const handleHydrateFromCloud = useCallback(
    (remoteProgress: Record<string, unknown>) => {
      setProgress((prev) => {
        const merged = mergeCloudProgress(prev, remoteProgress);
        return {
          ...merged,
          owner: prev.owner || (billingMeta.isAdmin ? 1 : 0),
          devToken: prev.devToken,
          trial: prev.trial || merged.trial,
        };
      });
    },
    [billingMeta.isAdmin]
  );

  const handleOpenWeakTopic = useCallback(
    (subj: SubjectId, tid: string) => {
      const subjTopics = getTopics(subj);
      if (isTopicLocked(progress, tid, subjTopics)) {
        const lockedTopic = getTopic(subj, tid);
        handleOpenPaywall(
          lockedTopic
            ? `Unlock “${lockedTopic.name}” notes and full topic mastery`
            : 'Unlock all 600+ topics across 49 subjects'
        );
        return;
      }
      setProgress((prev) => ({
        ...prev,
        subj,
        subjs: prev.subjs.includes(subj)
          ? prev.subjs
          : SUBJECT_IDS.filter((id) => id === subj || prev.subjs.includes(id)),
      }));
      setActiveTopicId(tid);
      setScreen('notes');
    },
    [progress, handleOpenPaywall]
  );

  const handleLaunchPlannerTask = useCallback(
    (subj: SubjectId, tid: string, stage: 'lesson' | 'practice' | 'boss') => {
      const subjTopics = getTopics(subj);
      if (isTopicLocked(progress, tid, subjTopics)) {
        const lockedTopic = getTopic(subj, tid);
        handleOpenPaywall(
          lockedTopic
            ? `Unlock “${lockedTopic.name}” in your study plan`
            : 'Unlock all 600+ topics in your study plan'
        );
        return;
      }
      setProgress((prev) => ({
        ...prev,
        subj,
        subjs: prev.subjs.includes(subj)
          ? prev.subjs
          : SUBJECT_IDS.filter((id) => id === subj || prev.subjs.includes(id)),
      }));
      setActiveTopicId(tid);
      if (stage === 'lesson') setScreen('lesson');
      else setScreen('topic');
    },
    [progress, handleOpenPaywall]
  );

  const handleSaveStudyPlan = useCallback((cfg: StudyPlanConfig) => {
    setProgress((prev) => ({
      ...prev,
      studyPlan: cfg,
      flags: { ...prev.flags, examDateSet: 1 },
    }));
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
      const satCampaign = getSaturdayCbtCampaign(Date.now(), progress.cbtHistory);
      const xpEarned = Math.max(20, payload.report.rawCorrect * 8) * satCampaign.bonusXpMultiplier;
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
    [commitProgressWithBadges, playSound, progress.cbtHistory, spawnXpBurst, triggerConfetti]
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
  const showNav =
    screen !== 'landing' &&
    screen !== 'welcome' &&
    screen !== 'dxintro' &&
    screen !== 'examsetup';
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
    const mode = subjectToLiveCoachMode(progress.subj);
    const subjTitle = SUBJECT_TUTOR_REGISTRY[progress.subj]?.name || 'English Language';
    if (screen === 'landing' || screen === 'welcome') {
      return {
        stepKey: `scr:${screen}:${mode}`,
        mode,
        context: {
          topicName: screen === 'landing' ? 'Easy Learn Public Website' : 'Welcome & Class Setup',
          partTitle: subjTitle,
          stepLabel: screen === 'landing' ? 'Website' : 'Onboarding',
          stepText:
            'Exploring Easy Learn JAMB UTME and WAEC/NECO exam tracks, 49 live voice teachers, and Saturday CBT Arena.',
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
      const isMathSubj = progress.subj === 'maths';
      const isLegacy12 =
        isMathSubj ||
        isFMathSubj ||
        isChemSubj ||
        isPhysSubj ||
        isBioSubj ||
        isAgricSubj ||
        isGeogSubj ||
        isEconSubj ||
        isEngSubj ||
        isCivicSubj ||
        isDigiTechSubj ||
        isDataProcSubj;
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
                            : isMathSubj
                              ? progress.mathClass
                              : 'all';
      const clsLabel = isLegacy12 && cls && cls !== 'all' ? cls.toUpperCase() : 'Full Syllabus';
      return {
        stepKey: `scr:topics:${mode}:${clsLabel}`,
        mode,
        context: {
          topicName: `${subjTitle} Topics Map`,
          partTitle: clsLabel,
          stepLabel: 'Curriculum Map',
          stepText: !isLegacy12
            ? `Browsing ${subjTitle} syllabus topics, guided lessons, chapter notes, and exam practice.`
            : isDataProcSubj
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
      (progress.subj === 'maths' ||
        isChemSubj ||
        isPhysSubj ||
        isBioSubj ||
        isAgricSubj)
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
    progress.subj,
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
        <EntitlementProvider
          value={{
            isPremium: isPremiumStudent,
            trialDaysRemaining: trialStatus.daysRemaining,
            trialCountdownLabel: trialCountdown.formattedCountdown,
            trialIsWarning: trialCountdown.isWarning,
            isTrialExpired: trialStatus.isTrialExpired || trialCountdown.isExpired,
            openPaywall: handleOpenPaywall,
          }}
        >
        {isInsideAppSession && !isPremiumStudent && demoStatus.isDemoActive && !demoStatus.isExpired && (
          <DemoCountdownBar
            status={demoStatus}
            onCreateAccount={() => exitDemoToScreen('welcome', 'register')}
          />
        )}
        {!PUBLIC_FREE_LAUNCH_ACTIVE &&
          isWorkspaceScreen &&
          !isPremiumStudent &&
          !demoStatus.isDemoActive &&
          !trialCountdown.isExpired &&
          !(screen === 'cbt' && isExamHallActive) && (
            <TrialCountdownBar
              countdown={trialCountdown}
              trialLink={billingMeta.trialLink}
              onManageOrSubscribe={() =>
                handleOpenPaywall(
                  'Your 1-day free trial counts down live — subscribe from ₦1,000/month (auto-renews unless cancelled; Lifetime is one-time) or manage your linked payment account below.'
                )
              }
            />
          )}
        <AppShell
        screen={screen}
        progress={progress}
        dueCount={dueIds.length}
        showNav={showNav}
        isExamHall={screen === 'cbt' && isExamHallActive}
        badgeToast={badgeToast}
        xpBursts={xpBursts}
        confettiKey={confettiKey}
        screenTransition={screenTransition}
        onDismissToast={() => setBadgeToast(null)}
        onNavigateTab={handleNavigateTab}
        onSelectSubject={handleSelectSubject}
        onManageSubjects={() => setScreen('subjs')}
        onOpenStudio={
          hasSubjectStudio(progress.subj)
            ? () => openStudioGated(screen === 'topics' ? 'topics' : 'home')
            : undefined
        }
        onOpenLab={openLabDirectoryGated}
        onOpenWebsite={() => setScreen('landing')}
        onSignOut={handleSignOut}
      >
      {screen === 'landing' && (
        <LandingWebsiteScreen
          studentName={progress.name}
          hasActiveSession={Boolean(progress.name.trim() && isSessionUnlocked())}
          initialExamTrack={resolveExamTrack(progress)}
          appearanceMode={effectiveThemeMode}
          muted={progress.muted}
          onStartWithTrack={(authMode, chosenTrack, preferredSubject, preset) => {
            applyWebsiteBlueprintToState(
              chosenTrack,
              preferredSubject,
              preset,
              preset?.previewThemeId,
              false
            );
            setFromWebsiteBlueprint(Boolean(preset || preferredSubject));
            if (preset?.postSetupDestination === 'paywall' && preset.selectedPlanId) {
              setPendingWebsiteIntent({
                destination: 'paywall',
                planId: preset.selectedPlanId,
              });
            } else if (preset?.postSetupDestination === 'cbt') {
              setPendingWebsiteIntent({ destination: 'cbt' });
            } else {
              setPendingWebsiteIntent(null);
            }
            setWelcomeAuthMode(authMode);
            setScreen('welcome');
          }}
          onContinueSession={() => {
            if (progress.name.trim() && isSessionUnlocked()) {
              setScreen(progress.flags?.examSetupDone ? 'home' : 'examsetup');
            } else {
              setWelcomeAuthMode('login');
              setScreen('welcome');
            }
          }}
          onTryDemo={(chosenTrack) => {
            setProgress((prev) => ({
              ...prev,
              examTrack: chosenTrack,
            }));
            handleSkipToDemo();
          }}
          onLaunchInstantAction={handleWebsiteInstantAction}
          onToggleAppearance={() =>
            handleChangeThemeMode(effectiveThemeMode === 'dark' ? 'light' : 'dark')
          }
        />
      )}

      {screen === 'welcome' && (
        <WelcomeScreen
          key={welcomeAuthMode}
          initialName={progress.name}
          initialSubjs={progress.subjs}
          initialAuthMode={welcomeAuthMode}
          connectedSummary={
            fromWebsiteBlueprint || progress.leaderboardCampusGoal || pendingWebsiteIntent
              ? {
                  trackLabel: EXAM_TRACK_SHOWCASES[resolveExamTrack(progress)].tabLabel,
                  campusGoal: progress.leaderboardCampusGoal || undefined,
                  subjectNames: progress.subjs
                    .slice(0, 6)
                    .map((sid) => SUBJECT_INFO[sid].short)
                    .join(' · '),
                  selectedPlanLabel: pendingWebsiteIntent?.planId
                    ? (() => {
                        const pl = getPremiumPlanById(pendingWebsiteIntent.planId);
                        return pl
                          ? `${pl.name} (₦${pl.priceNgn.toLocaleString('en-NG')})`
                          : undefined;
                      })()
                    : undefined,
                  destinationNote:
                    pendingWebsiteIntent?.destination === 'cbt'
                      ? 'Next step after setup: Saturday National CBT Arena'
                      : pendingWebsiteIntent?.destination === 'paywall'
                        ? 'Next step after setup: Paystack Naira pass checkout'
                        : undefined,
                }
              : null
          }
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
          onBackToWebsite={() => setScreen('landing')}
        />
      )}

      {screen === 'examsetup' && (
        <ExamSetupScreen
          progress={progress}
          muted={progress.muted}
          isReconfigure={Boolean(progress.flags?.examSetupDone)}
          onCompleteSetup={handleCompleteExamSetup}
          onCancel={() => setScreen(examSetupReturnScreen)}
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
          onOpenExamSetup={() => openExamSetup('home')}
          onOpenTopic={openTopic}
          onStartMission={(tid, stage) => {
            if (stage === 'lesson') openLesson(tid);
            else if (stage === 'practice') startPractice(tid);
            else startTopicTest(tid);
          }}
          onOpenReview={() => setScreen('review')}
          onStartDiagnostic={() => startDiagnostic()}
          onOpenLab={openLabDirectoryGated}
          onOpenStudio={
            hasSubjectStudio(progress.subj)
              ? () => openStudioGated('home')
              : undefined
          }
          onOpenNovels={(novelId) => openNovelsStudio('home', novelId)}
          onOpenFormulas={
            hasFormulaSheet(progress.subj)
              ? () => openFormulasStudio('home', null)
              : undefined
          }
          onOpenTopicsMap={() => setScreen('topics')}
          onOpenCbt={openCbtGated}
          onOpenMistakes={() => setScreen('mistakes')}
          onOpenPlanner={() => setScreen('planner')}
          onOpenSandboxes={openSandboxesGated}
          onOpenTheory={() => {
            setCompanionReturnScreen('home');
            setScreen('theory');
          }}
          onOpenTranscript={() => setScreen('transcript')}
          onOpenDuel={() => {
            setCompanionReturnScreen('home');
            setActiveDuelCode(null);
            setScreen('duel');
          }}
          onOpenLeaderboard={() => setScreen('leaderboard')}
          onOpenQuestionBank={handleOpenQuestionBank}
          onOpenPaywall={handleOpenPaywall}
        />
      )}

      {screen === 'topics' && (
        <TopicsMapScreen
          progress={progress}
          onSelectSubject={handleSelectSubject}
          onSelectClass={(cls) => handleSelectSubjectClass(cls, false)}
          onManageSubjects={() => setScreen('subjs')}
          onOpenTopic={openTopic}
          onOpenLab={openLabDirectoryGated}
          onOpenStudio={
            hasSubjectStudio(progress.subj)
              ? () => openStudioGated('topics')
              : undefined
          }
          onOpenFormulas={
            hasFormulaSheet(progress.subj)
              ? () => openFormulasStudio('topics', null)
              : undefined
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
            hasFormulaSheet(progress.subj)
              ? (tid) => openFormulasStudio('topic', tid)
              : undefined
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
          onBack={() => setScreen(lessonReturnScreen)}
          onCompleteLesson={() => {
            commitProgressWithBadges((prev) => {
              const ts = tstate(prev, currentTopic.id);
              const firstTime = !ts.lesson;
              return {
                ...prev,
                xp: prev.xp + (firstTime ? 25 : 5),
                t: { ...prev.t, [currentTopic.id]: { ...ts, lesson: 1 } },
              };
            });
            window.setTimeout(() => flushDeferredMilestones(progress.muted), 60);
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
            if (quizReturnScreen) {
              const dest = quizReturnScreen;
              setQuizReturnScreen(null);
              setScreen(dest);
              return;
            }
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
            setQuizReturnScreen(null);
            if (quizSession.tid) startTopicTest(quizSession.tid);
          }}
          onPracticeAgain={() => {
            if (quizSession.tid) startPractice(quizSession.tid);
          }}
          onDone={() => {
            if (quizReturnScreen) {
              const dest = quizReturnScreen;
              setQuizReturnScreen(null);
              setScreen(dest);
              return;
            }
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
        (progress.subj === 'maths' ||
          progress.subj === 'chem' ||
          progress.subj === 'phys' ||
          progress.subj === 'bio' ||
          progress.subj === 'agric') && (
        <LabListScreen
          subj={progress.subj}
          flags={progress.flags}
          onBack={() => setScreen('topics')}
          onOpenLabItem={(id) => openLabPlayer(id, 'lab')}
          onOpenFormulas={
            hasFormulaSheet(progress.subj)
              ? () => openFormulasStudio('lab', null)
              : undefined
          }
        />
      )}

      {screen === 'labrun' &&
        (progress.subj === 'maths' ||
          progress.subj === 'chem' ||
          progress.subj === 'phys' ||
          progress.subj === 'bio' ||
          progress.subj === 'agric') &&
        currentLab && (
        <LabPlayerScreen
          lab={currentLab}
          muted={progress.muted}
          onBack={() => setScreen(labReturnScreen)}
          onCompleteLab={handleCompleteLab}
        />
      )}

      {screen === 'studio' && (
        <SubjectStudioScreen
          subj={progress.subj}
          progress={progress}
          onToggleNovelChapterRead={handleToggleNovelChapter}
          onRecordNovelChapterQuiz={handleRecordNovelChapterQuiz}
          onRecordNovelQuizScore={handleRecordNovelQuiz}
          onCompleteNovelFinalExam={handleCompleteNovelFinalExam}
          onUpdateNovelNotes={handleUpdateNovelNotes}
          onOpenCurriculumTopic={handleOpenNovelCurriculumTopic}
          onBack={() => setScreen(studioReturnScreen)}
        />
      )}

      {screen === 'novels' && (
        <NovelsStudioScreen
          progress={progress}
          initialNovelId={activeNovelId}
          onBack={() => setScreen(novelsReturnScreen)}
          onToggleChapterRead={handleToggleNovelChapter}
          onRecordChapterQuiz={handleRecordNovelChapterQuiz}
          onRecordQuizScore={handleRecordNovelQuiz}
          onCompleteFinalExam={handleCompleteNovelFinalExam}
          onUpdateNotes={handleUpdateNovelNotes}
          onOpenCurriculumTopic={handleOpenNovelCurriculumTopic}
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
          onOpenLab={openLabDirectoryGated}
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
          isPremium={isPremiumStudent}
          isAdmin={billingMeta.isAdmin}
          trialLink={billingMeta.trialLink}
          subscriptionAutoRenew={billingMeta.subscriptionAutoRenew}
          clockFormat={progress.clockFormat || '12h'}
          onSelectTheme={handleSelectTheme}
          onChangeAppearanceMode={handleChangeThemeMode}
          onChangeClockFormat={handleChangeClockFormat}
          onOpenPaywall={handleOpenPaywall}
          onProActivated={(pro) => {
            playSound('win');
            setProgress((prev) => ({ ...prev, pro }));
          }}
          onTrialLinkChanged={(nextLink, nextTrial) => {
            setBillingMeta((prev) => ({ ...prev, trialLink: nextLink }));
            if (nextTrial) {
              setProgress((prev) => ({ ...prev, trial: nextTrial }));
            }
          }}
          onSubscriptionAutoRenewChanged={(nextSub) => {
            setBillingMeta((prev) => ({ ...prev, subscriptionAutoRenew: nextSub }));
          }}
          onToggleMuted={() =>
            setProgress((prev) => ({ ...prev, muted: !prev.muted }))
          }
          onOpenSubjects={() => setScreen('subjs')}
          onOpenExamSetup={() => openExamSetup('more')}
          onOpenTranscript={() => setScreen('transcript')}
          onOpenLeaderboard={() => setScreen('leaderboard')}
          onOpenQuestionBank={handleOpenQuestionBank}
          onOpenWebsite={() => setScreen('landing')}
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
          onExamHallChange={setIsExamHallActive}
          onOpenPaywall={handleOpenPaywall}
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
          onBack={() => setScreen(companionReturnScreen)}
        />
      )}

      {screen === 'theory' && (
        <TheoryCoachScreen
          progress={progress}
          onSaveTheoryScore={handleSaveTheoryScore}
          onBack={() => setScreen(companionReturnScreen)}
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
          onBack={() => setScreen(companionReturnScreen)}
        />
      )}

      {screen === 'leaderboard' && (
        <LeaderboardScreen
          progress={progress}
          onBack={() => setScreen('home')}
          onUpdateLeaderboardPrefs={handleUpdateLeaderboardPrefs}
          onOpenCbt={openCbtGated}
          onOpenDuel={() => {
            setCompanionReturnScreen('home');
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
              const track = resolveExamTrack(prev);
              if (track === 'jamb') {
                if (!isJambSubject(sid) || sid === 'eng') return prev;
                const currentJamb = prev.subjs.filter((s) => isJambSubject(s));
                const has = currentJamb.includes(sid);
                if (has) {
                  if (currentJamb.length <= 2) return prev;
                  const trimmed = currentJamb.filter((x) => x !== sid);
                  const ordered = SUBJECT_IDS.filter((id) => id === 'eng' || trimmed.includes(id));
                  const nextSubj = ordered.includes(prev.subj) ? prev.subj : ordered[0];
                  return {
                    ...prev,
                    subjs: ordered,
                    jambSubjects: normalizeJambQuartet(ordered),
                    subj: nextSubj,
                  };
                }
                const electives = currentJamb.filter((x) => x !== 'eng');
                const nextElectives =
                  electives.length >= 3 ? [...electives.slice(1), sid] : [...electives, sid];
                const ordered = SUBJECT_IDS.filter(
                  (id) => id === 'eng' || nextElectives.includes(id)
                );
                const nextSubj = ordered.includes(prev.subj) ? prev.subj : ordered[0];
                return {
                  ...prev,
                  subjs: ordered,
                  jambSubjects: normalizeJambQuartet(ordered),
                  subj: nextSubj,
                };
              }
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
          onOpenExamSetup={() => openExamSetup('subjs')}
          onOpenReview={() => setScreen('review')}
          onOpenQuestionBank={handleOpenQuestionBank}
          onBack={() => setScreen('more')}
        />
      )}
      </AppShell>
      </EntitlementProvider>
      </ClockFormatProvider>
      <QuestionBankManagerModal
        open={qbankModal.open}
        initialSubject={qbankModal.subject}
        initialTab={qbankModal.tab}
        onClose={() => setQbankModal((prev) => ({ ...prev, open: false }))}
      />
      <DemoExpiredModal
        open={isDemoLockedOut}
        onCreateAccount={() => exitDemoToScreen('welcome', 'register')}
        onSignIn={() => exitDemoToScreen('welcome', 'login')}
        onBackToWebsite={() => exitDemoToScreen('landing')}
      />
      <PaywallModal
        open={paywallModal.open || isTrialLockedOut}
        blocking={isTrialLockedOut}
        trialDaysRemaining={trialStatus.daysRemaining}
        trialCountdownLabel={trialCountdown.formattedCountdown}
        trialLink={billingMeta.trialLink}
        subscriptionAutoRenew={billingMeta.subscriptionAutoRenew}
        onTrialLinkChanged={(nextLink, nextTrial) => {
          setBillingMeta((prev) => ({ ...prev, trialLink: nextLink }));
          if (nextTrial) {
            setProgress((prev) => ({ ...prev, trial: nextTrial }));
          }
        }}
        onSubscriptionAutoRenewChanged={(nextSub) => {
          setBillingMeta((prev) => ({ ...prev, subscriptionAutoRenew: nextSub }));
        }}
        onSignOut={handleSignOut}
        reason={paywallModal.reason}
        progress={progress}
        paystackEnabled={billingMeta.paystackEnabled}
        initialReference={paywallModal.initialRef}
        initialPlanId={paywallModal.initialPlanId}
        onActivated={(pro) => {
          playSound('win');
          setProgress((prev) => ({ ...prev, pro }));
        }}
        onClose={() => {
          if (isTrialLockedOut) return;
          setPaywallModal((prev) => ({
            ...prev,
            open: false,
            initialRef: null,
            initialPlanId: null,
          }));
        }}
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
      {isPremiumStudent && showNav && !(screen === 'cbt' && isExamHallActive) && (
        <FloatingLiveCoach muted={progress.muted} />
      )}
      <OfflineIndicator />
    </LiveCoachProvider>
    </CloudSyncProvider>
    </ErrorBoundary>
  );
}
