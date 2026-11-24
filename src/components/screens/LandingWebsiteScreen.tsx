import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  Download,
  Laptop,
  LayoutDashboard,
  LogIn,
  Play,
  Smartphone,
  Sparkles,
  Zap,
} from 'lucide-react';
import type { ExamTrack, MasteryThemeId, SubjectId, ThemeAppearanceMode } from '../../types';
import { subjectToLiveCoachMode } from '../../context/LiveCoachContext';
import { DEFAULT_MASTERY_THEME_ID, getMasteryThemeById } from '../../data/masteryThemes';
import { getTopics } from '../../data/curriculum';
import { getSaturdayCbtCampaign } from '../../utils/examTrackLogic';
import {
  decodeTtsBase64Audio,
  playStudioWavPayload,
  unlockStudioAudioOnGesture,
  type ActiveAudioHandle,
  type DecodedTtsPayload,
} from '../../utils/studioAudioPlayer';
import {
  EXAM_TRACK_SHOWCASES,
  PLATFORM_COMPARISON_ROWS,
  UNIVERSITY_COURSE_PRESETS,
  buildSubjectInspectorSummary,
  buildWebsiteBlueprintSummary,
  buildWebsiteSubjectDirectory,
  buildWebsiteTeacherForSubject,
  calculateCohortPassEstimate,
  filterWebsiteSubjects,
  formatNairaPrice,
  getCourseTeacherQuartet,
  getFeaturedWebsiteTeachers,
  getTeacherScriptForTrack,
  getWebsitePricingPlans,
  getWebsiteSubjectCounts,
  parseStoredWebsiteBlueprint,
  type ConnectedStudyMissionSlot,
  type FeaturedWebsiteTeacher,
  type UniversityCourseId,
  type WebsiteInstantAction,
  type WebsiteOnboardingPreset,
  type WebsiteSubjectCategory,
} from '../../utils/websiteContentLogic';
import {
  isValidEmailAddress,
  isValidPaystackReference,
  parseScholarEmailList,
} from '../../utils/paywallLogic';
import { AnimatedNumber } from '../AnimatedNumber';
import { CrestSvg, Icon } from '../Icons';
import {
  LiquidCapsuleBar,
  SmoothCollapse,
  SmoothProgressBar,
  SmoothViewSwitch,
} from '../ULessonMotion';
import {
  AdmissionCompassStage,
  HeroInteractivePreviewDeck,
  InteractiveTitrationMicroLab,
  InteractiveTrapArena,
  SaturdayLiveCohortPanel,
  StudyAtmosphereShowcase,
} from './WebsiteInteractiveStages';
import { JAMB_WAEC_NOVELS } from '../../data/jambWaecNovels';
import { PUBLIC_FREE_LAUNCH_ACTIVE } from '../../utils/freeLaunchAndPwaLogic';
import { InstallAppHubCard, PWAInstallModal } from '../PWAInstallBanner';
import { usePWAInstall } from '../../utils/usePWAInstall';
import { NovelBookCover } from '../studios/JambWaecNovelsStudio';

const HERO_SCHOLARS_IMG = '/src/assets/images/eyak_nigerian_scholars_hero_1795342156265.jpg';
const SATURDAY_CBT_IMG = '/src/assets/images/eyak_saturday_cbt_arena_1795342155704.jpg';
const VIRTUAL_LAB_IMG = '/src/assets/images/eyak_science_virtual_lab_1795342157621.jpg';

const websiteVoiceCache = new Map<string, Promise<DecodedTtsPayload>>();

function fetchWebsiteTeacherSample(
  teacher: FeaturedWebsiteTeacher,
  track: ExamTrack
): Promise<DecodedTtsPayload> {
  const mode = subjectToLiveCoachMode(teacher.subj);
  const script = getTeacherScriptForTrack(teacher, track).trim();
  const key = `${mode}|${script}`;
  const hit = websiteVoiceCache.get(key);
  if (hit) return hit;

  const req = (async (): Promise<DecodedTtsPayload> => {
    const res = await fetch('/api/chem/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: script,
        voiceProfile: mode,
        topicName: `${teacher.subjectName} Website Voice Sample`,
        stepTitle: 'One-Time Setup Greeting',
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.audioBase64) {
      throw new Error(data?.error || 'Voice studio is busy right now. Try again in a moment.');
    }
    return decodeTtsBase64Audio(data.audioBase64, data.mimeType || 'audio/wav');
  })();

  req.catch(() => {
    websiteVoiceCache.delete(key);
  });

  if (websiteVoiceCache.size >= 24) {
    const first = websiteVoiceCache.keys().next().value;
    if (first) websiteVoiceCache.delete(first);
  }
  websiteVoiceCache.set(key, req);
  return req;
}

const SCHOLAR_OUTCOMES: readonly {
  quote: string;
  name: string;
  role: string;
  institution: string;
  metricLine: string;
}[] = [
  {
    quote:
      'Before Easy Learn, Chemistry mole calculations and look-alike English stress options dragged my mock scores below 235. Drilling under the 6/7 in 3:30 topic bar made actual JAMB feel calm and familiar.',
    name: 'Chizaram Nwachukwu',
    role: 'UTME Medicine Aspirant',
    institution: 'Surulere, Lagos',
    metricLine: '228 first mock → 314 Saturday CBT average in 9 weeks',
  },
  {
    quote:
      'My SS3 science class needed JAMB speed without abandoning WAEC Paper 2 method steps. The 70/30 combined track kept their 4 UTME subjects sharp while Theory Coach fixed missing units and diagrams.',
    name: 'Mr. Babatunde Adebayo',
    role: 'Senior Physics & Further Maths Teacher',
    institution: 'Bodija, Ibadan',
    metricLine: '42 SS3 finalists · Saturday /400 cohort tracking',
  },
  {
    quote:
      'I love that Dr. Ngozi and Master Chike introduced themselves once when I picked my subjects and never repeated long greetings again. Every time I tap a lesson or voice call, we go straight to the calculation.',
    name: 'Aisha Abdullahi',
    role: 'SS3 Commercial Scholar',
    institution: 'Gwarinpa, Abuja',
    metricLine: 'Economics & Accounting · 88% topic mastery accuracy',
  },
];

const FAQ_ITEMS: readonly { q: string; a: string }[] = [
  {
    q: 'What happens after I choose JAMB Only, WAEC Only, or Both (70/30)?',
    a: 'If you choose JAMB Only, Easy Learn locks onto Use of English plus your 3 UTME electives, introduces only those 4 voice teachers once, hides WAEC-only trade subjects, and calibrates topic tests to 6/7 in 3:30 with twin-option traps. WAEC Only unlocks 7–9 school and trade subjects with Paper 2 Theory Coach and Chief Examiner mistake shields. Choosing Both combines them with 70% daily focus on your 4 JAMB subjects and 30% on WAEC.',
  },
  {
    q: 'Do the live voice teachers repeat their introduction every time I open a lesson?',
    a: 'No. Your teachers introduce themselves once during exam track setup so you can hear each teacher’s distinct personality. Inside lessons, chapter notes, and live two-way voice calls, they skip pleasantries and explain your exact step immediately.',
  },
  {
    q: 'How does the Saturday National CBT Arena ranking work?',
    a: 'Every Saturday (with early warm-up reminders from Thursday), Easy Learn opens the timed /400 UTME and WASSCE CBT Arena with double study XP. As soon as you submit, your scaled score and accuracy are ranked against every student who completed CBT that day, and missed questions move straight into your Mistake Vault.',
  },
  {
    q: 'How does the 1-day free trial and recurring subscription work?',
    a: 'Every new scholar account gets a 1-day (24-hour) free trial with a live countdown when you link your Google Payment Account or payment details — and you can cancel anytime. Monthly, 6-Month, and Yearly plans auto-renew at expiry unless cancelled beforehand (if cancelled, everything locks when time runs out until you resubscribe). Lifetime is a one-time payment and is never auto-debited.',
  },
];

const EQUALIZER_BARS = [
  { x: 4, cls: 'eyak-eq-bar-a' },
  { x: 14, cls: 'eyak-eq-bar-b' },
  { x: 24, cls: 'eyak-eq-bar-c' },
  { x: 34, cls: 'eyak-eq-bar-a' },
  { x: 44, cls: 'eyak-eq-bar-c' },
  { x: 54, cls: 'eyak-eq-bar-b' },
  { x: 64, cls: 'eyak-eq-bar-a' },
  { x: 74, cls: 'eyak-eq-bar-c' },
  { x: 84, cls: 'eyak-eq-bar-b' },
  { x: 94, cls: 'eyak-eq-bar-a' },
] as const;

type MobileJumpTarget =
  | 'exam-tracks'
  | 'admission-compass'
  | 'voice-teachers'
  | 'saturday-cbt'
  | 'subjects'
  | 'install-app'
  | 'pricing';

export interface LandingWebsiteScreenProps {
  studentName?: string;
  hasActiveSession?: boolean;
  initialExamTrack?: ExamTrack;
  appearanceMode?: ThemeAppearanceMode;
  muted?: boolean;
  onStartWithTrack: (
    mode: 'register' | 'login',
    track: ExamTrack,
    preferredSubject?: SubjectId,
    preset?: WebsiteOnboardingPreset
  ) => void;
  onContinueSession: () => void;
  onTryDemo: (track: ExamTrack) => void;
  onLaunchInstantAction?: (action: WebsiteInstantAction) => void;
  onToggleAppearance?: () => void;
}

export function LandingWebsiteScreen({
  studentName = '',
  hasActiveSession = false,
  initialExamTrack = 'both',
  appearanceMode = 'light',
  muted = false,
  onStartWithTrack,
  onContinueSession,
  onTryDemo,
  onLaunchInstantAction,
  onToggleAppearance,
}: LandingWebsiteScreenProps) {
  const prefersReduced = Boolean(useReducedMotion());
  const initialStoredBp = useMemo(() => {
    if (typeof window === 'undefined') return null;
    try {
      return parseStoredWebsiteBlueprint(
        window.sessionStorage.getItem('eyak_website_blueprint_v1')
      );
    } catch {
      return null;
    }
  }, []);

  const [selectedTrack, setSelectedTrack] = useState<ExamTrack>(
    () => initialStoredBp?.selectedTrack || initialExamTrack
  );
  const [selectedCourseId, setSelectedCourseId] = useState<UniversityCourseId>(
    () => initialStoredBp?.selectedCourseId || 'med'
  );
  const [practiceScore, setPracticeScore] = useState<number>(
    () => initialStoredBp?.practiceScore ?? 225
  );
  const [previewThemeId, setPreviewThemeId] = useState<MasteryThemeId>(
    () => initialStoredBp?.previewThemeId || DEFAULT_MASTERY_THEME_ID
  );
  const [activeSectionId, setActiveSectionId] = useState<MobileJumpTarget>('exam-tracks');
  const [mobileJump, setMobileJump] = useState<MobileJumpTarget>('exam-tracks');
  const [videoTourOpen, setVideoTourOpen] = useState(false);

  useEffect(() => {
    if (!videoTourOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setVideoTourOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [videoTourOpen]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.sessionStorage.setItem(
        'eyak_website_blueprint_v1',
        JSON.stringify({
          selectedTrack,
          selectedCourseId,
          practiceScore,
          previewThemeId,
        })
      );
    } catch {
      /* ignore sessionStorage quota errors */
    }
  }, [selectedTrack, selectedCourseId, practiceScore, previewThemeId]);

  const featuredTeachers = useMemo(() => getFeaturedWebsiteTeachers(), []);
  const courseQuartetTeachers = useMemo(
    () => getCourseTeacherQuartet(selectedCourseId),
    [selectedCourseId]
  );

  const [teacherMode, setTeacherMode] = useState<'quartet' | 'all8'>('quartet');
  const [selectedTeacherSubj, setSelectedTeacherSubj] = useState<SubjectId>('eng');
  const [voiceState, setVoiceState] = useState<'idle' | 'loading' | 'playing' | 'error'>('idle');
  const [relayActive, setRelayActive] = useState<boolean>(false);
  const [relayStepIndex, setRelayStepIndex] = useState<number>(0);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const audioHandleRef = useRef<ActiveAudioHandle | null>(null);
  const voiceReqIdRef = useRef<number>(0);

  const [subjectCategory, setSubjectCategory] = useState<WebsiteSubjectCategory>('all');
  const [subjectQuery, setSubjectQuery] = useState<string>('');
  const [showAllSubjects, setShowAllSubjects] = useState<boolean>(false);
  const [inspectedSubj, setInspectedSubj] = useState<SubjectId | null>(null);
  const [inspectorVoiceSubj, setInspectorVoiceSubj] = useState<SubjectId | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const [cbtImgFailed, setCbtImgFailed] = useState<boolean>(false);
  const [labImgFailed, setLabImgFailed] = useState<boolean>(false);
  const [selectedWebsiteNovelId, setSelectedWebsiteNovelId] =
    useState<string>('lekki-headmaster');

  // Automated Parent Sponsorship & School Seat Paystack Checkout state
  const [inquiryRole, setInquiryRole] = useState<'parent' | 'school' | 'student'>('parent');
  const [cohortPlanId, setCohortPlanId] = useState<'monthly' | 'biannual' | 'annual'>('annual');
  const [payerEmail, setPayerEmail] = useState<string>('');
  const [scholarEmailsInput, setScholarEmailsInput] = useState<string>('');
  const [sponsorError, setSponsorError] = useState<string | null>(null);
  const [sponsorBusy, setSponsorBusy] = useState<boolean>(false);
  const [sponsorStatusMsg, setSponsorStatusMsg] = useState<string | null>(null);
  const [sponsorCheckout, setSponsorCheckout] = useState<{
    authorizationUrl: string;
    reference: string;
    seats: number;
    totalNgn: number;
  } | null>(null);

  const allSubjects = useMemo(() => buildWebsiteSubjectDirectory(), []);
  const subjectCounts = useMemo(() => getWebsiteSubjectCounts(), []);
  const saturdayCampaign = useMemo(() => getSaturdayCbtCampaign(Date.now()), []);
  const filteredSubjects = useMemo(
    () => filterWebsiteSubjects(allSubjects, subjectCategory, subjectQuery),
    [allSubjects, subjectCategory, subjectQuery]
  );
  const visibleSubjects =
    showAllSubjects || subjectQuery.trim().length > 0
      ? filteredSubjects
      : filteredSubjects.slice(0, 16);

  const pricingData = useMemo(() => getWebsitePricingPlans(), []);
  const parsedScholarList = useMemo(
    () => parseScholarEmailList(scholarEmailsInput, 200),
    [scholarEmailsInput]
  );
  const effectiveSeatCountForEstimate =
    parsedScholarList.emails.length > 0
      ? parsedScholarList.emails.length
      : inquiryRole === 'school'
        ? 10
        : 1;
  const cohortEstimate = useMemo(
    () => calculateCohortPassEstimate(effectiveSeatCountForEstimate, cohortPlanId),
    [effectiveSeatCountForEstimate, cohortPlanId]
  );
  const blueprint = useMemo(
    () =>
      buildWebsiteBlueprintSummary(
        selectedTrack,
        selectedCourseId,
        practiceScore,
        previewThemeId
      ),
    [selectedTrack, selectedCourseId, practiceScore, previewThemeId]
  );
  const activeAtmosphereName = useMemo(
    () => getMasteryThemeById(previewThemeId).name,
    [previewThemeId]
  );
  const activeTrackSpec = EXAM_TRACK_SHOWCASES[selectedTrack];

  const activeTeacherRoster =
    teacherMode === 'quartet' ? courseQuartetTeachers : featuredTeachers;
  const activeTeacher =
    activeTeacherRoster.find((t) => t.subj === selectedTeacherSubj) || activeTeacherRoster[0];
  const activeTeacherScript = getTeacherScriptForTrack(activeTeacher, selectedTrack);
  const activeCourseTitle =
    UNIVERSITY_COURSE_PRESETS.find((c) => c.id === selectedCourseId)?.shortTab || 'Course';

  const inspectedSummary = useMemo(() => {
    if (!inspectedSubj) return null;
    const subjTopics = getTopics(inspectedSubj);
    return buildSubjectInspectorSummary(inspectedSubj, selectedTrack, subjTopics);
  }, [inspectedSubj, selectedTrack]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return;
    const sectionIds: MobileJumpTarget[] = [
      'exam-tracks',
      'admission-compass',
      'voice-teachers',
      'saturday-cbt',
      'subjects',
      'install-app',
      'pricing',
    ];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const topEntry = visible[0];
        if (topEntry?.target?.id) {
          const id = topEntry.target.id as MobileJumpTarget;
          setActiveSectionId(id);
          setMobileJump(id);
        }
      },
      { rootMargin: '-18% 0px -58% 0px', threshold: [0.08, 0.25, 0.5] }
    );
    for (const id of sectionIds) {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    }
    return () => observer.disconnect();
  }, []);

  const stopVoiceSample = () => {
    voiceReqIdRef.current += 1;
    if (audioHandleRef.current) {
      audioHandleRef.current.stop();
      audioHandleRef.current = null;
    }
    setRelayActive(false);
    setInspectorVoiceSubj(null);
    setVoiceState('idle');
  };

  useEffect(() => {
    return () => {
      voiceReqIdRef.current += 1;
      if (audioHandleRef.current) {
        audioHandleRef.current.stop();
        audioHandleRef.current = null;
      }
    };
  }, []);

  const playSingleOrRelayTeacher = async (
    roster: readonly FeaturedWebsiteTeacher[],
    index: number,
    isRelayRun: boolean,
    trackForSample: ExamTrack
  ) => {
    const targetTeacher = roster[index];
    if (!targetTeacher) {
      setRelayActive(false);
      setVoiceState('idle');
      return;
    }

    if (muted) {
      setRelayActive(false);
      setVoiceState('error');
      setVoiceError(
        'Sound is muted in your app settings. Unmute audio in Settings to hear voice samples.'
      );
      return;
    }

    unlockStudioAudioOnGesture();
    if (audioHandleRef.current) {
      audioHandleRef.current.stop();
      audioHandleRef.current = null;
    }

    const reqId = voiceReqIdRef.current + 1;
    voiceReqIdRef.current = reqId;
    setSelectedTeacherSubj(targetTeacher.subj);
    setRelayStepIndex(index);
    setRelayActive(isRelayRun);
    setVoiceError(null);
    setVoiceState('loading');

    // Warm next teacher in relay while current loads/plays
    if (isRelayRun && roster[index + 1]) {
      void fetchWebsiteTeacherSample(roster[index + 1], trackForSample).catch(() => {});
    }

    try {
      const payload = await fetchWebsiteTeacherSample(targetTeacher, trackForSample);
      if (voiceReqIdRef.current !== reqId) return;
      const handle = await playStudioWavPayload(payload, {
        onEnded: () => {
          if (voiceReqIdRef.current !== reqId) return;
          audioHandleRef.current = null;
          if (isRelayRun && index + 1 < roster.length) {
            void playSingleOrRelayTeacher(roster, index + 1, true, trackForSample);
          } else {
            setRelayActive(false);
            setVoiceState('idle');
          }
        },
        onError: (err) => {
          if (voiceReqIdRef.current === reqId) {
            audioHandleRef.current = null;
            setRelayActive(false);
            setVoiceState('error');
            setVoiceError(err.message);
          }
        },
      });
      if (voiceReqIdRef.current !== reqId) {
        handle.stop();
        return;
      }
      audioHandleRef.current = handle;
      setVoiceState('playing');
    } catch (err) {
      if (voiceReqIdRef.current !== reqId) return;
      setRelayActive(false);
      setVoiceState('error');
      setVoiceError(
        err instanceof Error ? err.message : 'Could not play studio voice sample right now.'
      );
    }
  };

  const handlePlayTeacherSample = () => {
    if (voiceState === 'playing' && !relayActive) {
      stopVoiceSample();
      return;
    }
    const idx = Math.max(
      0,
      activeTeacherRoster.findIndex((t) => t.subj === activeTeacher.subj)
    );
    void playSingleOrRelayTeacher(activeTeacherRoster, idx, false, selectedTrack);
  };

  const handlePlayQuartetRelay = () => {
    if (relayActive && (voiceState === 'playing' || voiceState === 'loading')) {
      stopVoiceSample();
      return;
    }
    setTeacherMode('quartet');
    void playSingleOrRelayTeacher(courseQuartetTeachers, 0, true, selectedTrack);
  };

  const heroTeacher = featuredTeachers[0];
  const heroTeacherScript = useMemo(
    () => getTeacherScriptForTrack(heroTeacher, selectedTrack),
    [heroTeacher, selectedTrack]
  );
  const isHeroVoicePlaying =
    voiceState === 'playing' &&
    !relayActive &&
    inspectorVoiceSubj === null &&
    selectedTeacherSubj === heroTeacher.subj;
  const isHeroVoiceLoading =
    voiceState === 'loading' &&
    !relayActive &&
    inspectorVoiceSubj === null &&
    selectedTeacherSubj === heroTeacher.subj;

  const handleToggleHeroVoice = () => {
    if (isHeroVoicePlaying || isHeroVoiceLoading) {
      stopVoiceSample();
      return;
    }
    void playSingleOrRelayTeacher([heroTeacher], 0, false, selectedTrack);
  };

  const handleSelectTeacher = (teacher: FeaturedWebsiteTeacher) => {
    if (audioHandleRef.current) {
      stopVoiceSample();
    }
    setVoiceError(null);
    setSelectedTeacherSubj(teacher.subj);
  };

  const handlePlayInspectorVoice = async (subj: SubjectId, isJambSubj: boolean) => {
    if (inspectorVoiceSubj === subj && (voiceState === 'playing' || voiceState === 'loading')) {
      stopVoiceSample();
      return;
    }
    if (muted) {
      setVoiceState('error');
      setVoiceError('Sound is muted in your app settings. Unmute audio to hear voice greetings.');
      return;
    }
    unlockStudioAudioOnGesture();
    if (audioHandleRef.current) {
      audioHandleRef.current.stop();
      audioHandleRef.current = null;
    }
    const reqId = voiceReqIdRef.current + 1;
    voiceReqIdRef.current = reqId;
    setRelayActive(false);
    setInspectorVoiceSubj(subj);
    setVoiceError(null);
    setVoiceState('loading');

    const teacher = buildWebsiteTeacherForSubject(subj);
    const effectiveTrack: ExamTrack = isJambSubj ? selectedTrack : 'waec';
    try {
      const payload = await fetchWebsiteTeacherSample(teacher, effectiveTrack);
      if (voiceReqIdRef.current !== reqId) return;
      const handle = await playStudioWavPayload(payload, {
        onEnded: () => {
          if (voiceReqIdRef.current !== reqId) return;
          audioHandleRef.current = null;
          setInspectorVoiceSubj(null);
          setVoiceState('idle');
        },
        onError: (err) => {
          if (voiceReqIdRef.current === reqId) {
            audioHandleRef.current = null;
            setInspectorVoiceSubj(null);
            setVoiceState('error');
            setVoiceError(err.message);
          }
        },
      });
      if (voiceReqIdRef.current !== reqId) {
        handle.stop();
        return;
      }
      audioHandleRef.current = handle;
      setVoiceState('playing');
    } catch (err) {
      if (voiceReqIdRef.current !== reqId) return;
      setInspectorVoiceSubj(null);
      setVoiceState('error');
      setVoiceError(
        err instanceof Error ? err.message : 'Could not play studio voice sample right now.'
      );
    }
  };

  const handleMobileSectionJump = (targetId: MobileJumpTarget) => {
    setMobileJump(targetId);
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
    }
  };

  const handleSponsorPaystackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSponsorError(null);
    setSponsorStatusMsg(null);

    if (!isValidEmailAddress(payerEmail)) {
      setSponsorError('Enter a valid receipt email address (for example parent@gmail.com).');
      return;
    }
    const parsed = parseScholarEmailList(scholarEmailsInput, 200);
    if (parsed.invalidEntries.length > 0) {
      setSponsorError(
        `Check scholar email format: "${parsed.invalidEntries[0]}" is not a valid email address.`
      );
      return;
    }
    if (parsed.emails.length < 1) {
      setSponsorError(
        inquiryRole === 'school'
          ? 'Enter at least one scholar account email address (separate multiple emails with commas or new lines).'
          : 'Enter the scholar’s account email address so Paystack unlocks their pass automatically.'
      );
      return;
    }

    setSponsorBusy(true);
    try {
      const resp = await fetch('/api/billing/paystack/sponsor-initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: inquiryRole,
          planId: cohortPlanId,
          payerEmail: payerEmail.trim(),
          scholarEmails: parsed.emails,
        }),
      });
      const data = (await resp.json().catch(() => null)) as {
        ok?: boolean;
        paystackDisabled?: boolean;
        error?: string;
        authorizationUrl?: string;
        reference?: string;
        seats?: number;
        totalNgn?: number;
        quote?: { seats: number; totalNgn: number; planName: string };
      } | null;

      if (resp.ok && data?.ok && data.authorizationUrl && data.reference) {
        const nextCheckout = {
          authorizationUrl: data.authorizationUrl,
          reference: data.reference,
          seats: data.seats || parsed.emails.length,
          totalNgn: data.totalNgn || cohortEstimate.totalNgn,
        };
        setSponsorCheckout(nextCheckout);
        if (typeof window !== 'undefined' && window.self === window.top) {
          window.location.assign(data.authorizationUrl);
        }
      } else if (data?.paystackDisabled) {
        const qSeats = data.quote?.seats || parsed.emails.length;
        const qTotal = data.quote?.totalNgn || cohortEstimate.totalNgn;
        setSponsorStatusMsg(
          `Paystack quote ready for ${qSeats} ${qSeats === 1 ? 'scholar' : 'scholars'} (${formatNairaPrice(qTotal)}). Add an active PAYSTACK_SECRET_KEY (sk_live_... or sk_test_...) in Settings -> Secrets to open Paystack checkout directly.`
        );
      } else {
        setSponsorError(
          data?.error || 'Could not start Paystack checkout right now. Please try again shortly.'
        );
      }
    } catch {
      setSponsorError('Unable to reach Paystack right now. Check your connection and retry.');
    } finally {
      setSponsorBusy(false);
    }
  };

  const handleVerifySponsorPaystack = async (referenceToCheck: string) => {
    if (!isValidPaystackReference(referenceToCheck)) return;
    setSponsorBusy(true);
    setSponsorError(null);
    try {
      const resp = await fetch('/api/billing/paystack/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference: referenceToCheck }),
      });
      const data = (await resp.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        planName?: string;
        activatedCount?: number;
      } | null;

      if (resp.ok && data?.ok) {
        const count = data.activatedCount || sponsorCheckout?.seats || 1;
        setSponsorStatusMsg(
          `Payment verified on Paystack! ${data.planName || 'Easy Learn Pass'} is now active for ${count} ${count === 1 ? 'scholar email' : 'scholar emails'} immediately upon sign-in.`
        );
        setSponsorCheckout(null);
        setScholarEmailsInput('');
      } else {
        setSponsorError(
          data?.error ||
            'Payment has not been marked complete yet. Finish checkout on Paystack, then tap Verify payment status.'
        );
      }
    } catch {
      setSponsorError('Network error while checking Paystack payment status. Please retry.');
    } finally {
      setSponsorBusy(false);
    }
  };

  const launchInstantOrFallback = (action: WebsiteInstantAction) => {
    if (audioHandleRef.current) stopVoiceSample();
    if (onLaunchInstantAction) {
      onLaunchInstantAction(action);
      return;
    }
    onTryDemo(action.examTrack);
  };

  const heroEnter = { opacity: 1, y: 0 };
  const heroInitial = prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0.92, y: 8 };
  const sectionInitial = prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0.94, y: 10 };
  const sectionTransition = { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const };

  const [installModalOpen, setInstallModalOpen] = useState(false);
  const { isInstalled } = usePWAInstall();

  useEffect(() => {
    if (!videoTourOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setVideoTourOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [videoTourOpen]);

  const desktopNavLinkCls = (id: MobileJumpTarget) =>
    activeSectionId === id
      ? 'text-[var(--ink)] underline decoration-[var(--gold)] decoration-2 underline-offset-[6px] transition-colors whitespace-nowrap shrink-0'
      : 'hover:text-[var(--ink)] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0';

  return (
    <div
      id="eyak-top"
      data-theme={previewThemeId}
      data-mode={appearanceMode}
      className="eyak-theme-stage min-h-screen w-full bg-[var(--bg)] text-[var(--ink)]"
    >
      {/* Strict 3-Zone Top Bar Contract + Compositor Scroll Progress Hairline */}
      <header className="sticky top-0 z-30 h-14 bg-[var(--card)]/95 backdrop-blur-md border-b border-[var(--line)] relative">
        <div className="max-w-[1200px] h-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8">
          <a
            href="#eyak-top"
            className="inline-flex items-center gap-2.5 eyak-display font-extrabold text-[20px] tracking-tight text-[var(--ink)] whitespace-nowrap shrink-0"
          >
            <CrestSvg size={32} />
            <span>Easy Learn</span>
          </a>

          <nav
            aria-label="Website sections"
            className="hidden md:flex items-center gap-6 text-[14px] font-semibold text-[var(--dim)]"
          >
            <a href="#exam-tracks" className={desktopNavLinkCls('exam-tracks')}>
              Exam Tracks
            </a>
            <a href="#admission-compass" className={desktopNavLinkCls('admission-compass')}>
              Courses
            </a>
            <a href="#voice-teachers" className={desktopNavLinkCls('voice-teachers')}>
              Voice Teachers
            </a>
            <a href="#subjects" className={desktopNavLinkCls('subjects')}>
              Subjects
            </a>
            {!isInstalled && (
              <a href="#install-app" className={desktopNavLinkCls('install-app')}>
                Install App
              </a>
            )}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                if (audioHandleRef.current) stopVoiceSample();
                setVideoTourOpen(true);
              }}
              aria-label="Watch 2-minute tour"
              title="Watch 2-min tour"
              className="group relative w-9 h-9 rounded-xl bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--acc-line)] hover:bg-[var(--acc-soft)] text-[var(--dim)] hover:text-[var(--gold)] inline-flex items-center justify-center transition-all duration-150 cursor-pointer shrink-0"
            >
              <Play size={15} className="fill-current translate-x-[0.5px]" />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-[var(--ink)] text-[var(--bg)] text-[11px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-150 shadow-sm"
              >
                2-min Tour
              </span>
            </button>

            {!isInstalled && (
              <button
                type="button"
                onClick={() => setInstallModalOpen(true)}
                aria-label="Install on Phone and Laptop"
                title="Install on Phone & Laptop"
                className="group relative h-9 px-2.5 rounded-xl bg-[var(--acc-soft)] border border-[var(--acc-line)] text-[var(--gold)] inline-flex items-center justify-center gap-1 hover:opacity-90 transition-all duration-150 cursor-pointer shrink-0"
              >
                <Smartphone size={14} />
                <Laptop size={15} />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-[var(--ink)] text-[var(--bg)] text-[11px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-150 shadow-sm"
                >
                  Install App
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                if (hasActiveSession) {
                  onContinueSession();
                } else {
                  onStartWithTrack(
                    'register',
                    selectedTrack,
                    blueprint.preset.jambQuartet?.[0],
                    blueprint.preset
                  );
                }
              }}
              aria-label={hasActiveSession ? 'Open Study Dashboard' : 'Start Studying'}
              title={hasActiveSession ? 'Study Dashboard' : 'Start Studying'}
              className="eyak-cta-sheen h-9 px-3.5 rounded-xl bg-[var(--gold)] text-[var(--on-acc)] eyak-display font-bold text-[13px] inline-flex items-center gap-1.5 hover:opacity-95 transition-opacity cursor-pointer whitespace-nowrap shrink-0"
            >
              {hasActiveSession ? <LayoutDashboard size={15} /> : <Sparkles size={15} />}
              <span>{hasActiveSession ? 'Hub' : 'Start'}</span>
            </button>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="eyak-scroll-beam pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-[var(--gold)]"
        />
      </header>

      {/* Act I — Interactive Product Hero + Architectural Proof Ledger */}
      <section className="border-b border-[var(--line)] bg-[var(--bg)]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-9 sm:pt-14 pb-12 sm:pb-16">
          {/* Non-sticky mobile liquid quick-jump strip (preserves <=15% sticky height cap) */}
          <div className="md:hidden mb-6">
            <LiquidCapsuleBar
              items={[
                { id: 'exam-tracks', label: 'Tracks' },
                { id: 'admission-compass', label: 'Courses' },
                { id: 'voice-teachers', label: 'Voices' },
                { id: 'subjects', label: '49 Subjects' },
                ...(isInstalled ? [] : [{ id: 'install-app' as const, label: 'Install App' }]),
                { id: 'pricing', label: 'Passes' },
              ]}
              value={mobileJump}
              onChange={handleMobileSectionJump}
              ariaLabel="Jump to website section"
              roleType="nav"
              size="sm"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            <motion.div
              initial={heroInitial}
              animate={heroEnter}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-6 flex flex-col justify-between gap-7"
            >
              <div className="flex flex-col gap-5">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] font-bold text-[var(--gold)]">
                  <span>Your Road to Campus</span>
                  <span aria-hidden="true" className="text-[var(--dim)]">·</span>
                  <span className="text-[var(--dim)]">JAMB UTME &amp; WASSCE</span>
                  <span aria-hidden="true" className="text-[var(--dim)]">·</span>
                  <span className="text-[var(--green)] eyak-mono text-[12px]">
                    {saturdayCampaign.isSaturday
                      ? 'Saturday CBT Live Today'
                      : `Next Saturday CBT in ${saturdayCampaign.daysUntilSaturday}d`}
                  </span>
                </div>

                <h1 className="eyak-display font-extrabold text-[clamp(2.35rem,4.1vw,3.75rem)] leading-[1.05] text-[var(--ink)] text-balance">
                  Train tougher than JAMB. Walk into your exam hall already ahead.
                </h1>

                <p className="text-[16px] sm:text-[16.5px] leading-[1.64] text-[var(--dim)] max-w-[56ch]">
                  Combine JAMB UTME speed with WAEC Paper 2 precision in one disciplined study studio. Meet your subject voice teachers once during setup, master look-alike examiner traps, and rank nationally every Saturday.
                </p>
              </div>

              <div className="flex flex-col gap-4 pt-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (hasActiveSession) {
                        onContinueSession();
                      } else {
                        onStartWithTrack(
                          'register',
                          selectedTrack,
                          blueprint.preset.jambQuartet?.[0],
                          blueprint.preset
                        );
                      }
                    }}
                    aria-label={
                      hasActiveSession
                        ? 'Open Study Dashboard'
                        : PUBLIC_FREE_LAUNCH_ACTIVE
                          ? 'Start Studying Free'
                          : 'Start 1-Day Free Trial'
                    }
                    className="eyak-cta-sheen min-h-[48px] px-5 py-3 rounded-xl bg-[var(--gold)] text-[var(--on-acc)] eyak-display font-bold text-[15px] inline-flex items-center gap-2.5 hover:opacity-95 active:translate-y-[1px] transition-[opacity,transform] duration-150 cursor-pointer whitespace-nowrap shrink-0 shadow-[0_6px_22px_rgba(124,92,255,0.22)]"
                  >
                    {hasActiveSession ? <LayoutDashboard size={18} /> : <Sparkles size={18} />}
                    <span>
                      {hasActiveSession
                        ? 'Dashboard'
                        : PUBLIC_FREE_LAUNCH_ACTIVE
                          ? 'Start Free'
                          : '1-Day Trial'}
                    </span>
                    <ArrowRight size={17} />
                  </button>

                  {/* Sleek Icon-First Quick Action Dock */}
                  <div
                    role="group"
                    aria-label="Quick platform actions"
                    className="inline-flex items-center gap-1.5 p-1 rounded-2xl bg-[var(--card)] border border-[var(--line)]"
                  >
                    {!isInstalled && (
                      <button
                        type="button"
                        onClick={() => setInstallModalOpen(true)}
                        aria-label="Install on Phone and Laptop"
                        title="Install on Phone & Laptop"
                        className="group relative h-[40px] px-3 rounded-xl bg-[var(--acc-soft)] border border-[var(--acc-line)] hover:brightness-110 text-[var(--gold)] inline-flex items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer shrink-0"
                      >
                        <Smartphone size={16} />
                        <Laptop size={17} />
                        <Download size={13} className="opacity-85" />
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-[var(--ink)] text-[var(--bg)] text-[11px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-150 shadow-md"
                        >
                          Install App
                        </span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        if (audioHandleRef.current) stopVoiceSample();
                        setVideoTourOpen(true);
                      }}
                      aria-label="Watch 2-minute video tour"
                      title="Watch 2-min tour"
                      className="group relative w-[40px] h-[40px] rounded-xl hover:bg-[var(--acc-soft)] text-[var(--ink)] hover:text-[var(--gold)] inline-flex items-center justify-center transition-colors duration-150 cursor-pointer shrink-0"
                    >
                      <Play size={17} className="fill-current translate-x-[0.5px]" />
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-[var(--ink)] text-[var(--bg)] text-[11px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-150 shadow-md"
                      >
                        2-min Tour
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        launchInstantOrFallback({
                          type: 'demo-dashboard',
                          examTrack: selectedTrack,
                          subj: blueprint.preset.jambQuartet?.[0],
                          preset: blueprint.preset,
                          previewThemeId,
                        })
                      }
                      aria-label="Try 5-minute instant demo"
                      title="Try 5-min instant demo"
                      className="group relative w-[40px] h-[40px] rounded-xl hover:bg-[var(--acc-soft)] text-[var(--ink)] hover:text-[var(--gold)] inline-flex items-center justify-center transition-colors duration-150 cursor-pointer shrink-0"
                    >
                      <Zap size={17} />
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-[var(--ink)] text-[var(--bg)] text-[11px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-150 shadow-md"
                      >
                        5-min Demo
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onStartWithTrack(
                          'login',
                          selectedTrack,
                          blueprint.preset.jambQuartet?.[0],
                          blueprint.preset
                        )
                      }
                      aria-label="Sign in"
                      title="Sign in"
                      className="group relative w-[40px] h-[40px] rounded-xl hover:bg-[var(--acc-soft)] text-[var(--ink)] hover:text-[var(--gold)] inline-flex items-center justify-center transition-colors duration-150 cursor-pointer shrink-0"
                    >
                      <LogIn size={17} />
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-[var(--ink)] text-[var(--bg)] text-[11px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-150 shadow-md"
                      >
                        Sign in
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[12.5px] font-semibold text-[var(--dim)]">
                  <span>
                    {PUBLIC_FREE_LAUNCH_ACTIVE
                      ? '100% Free Launch Access'
                      : '1-Day Free Trial · Cancel Anytime'}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Installable Android, iPhone &amp; Laptop App</span>
                  <span aria-hidden="true">·</span>
                  <span>All 49 Subjects &amp; 8 Prescribed Novels</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={heroInitial}
              animate={heroEnter}
              transition={{ duration: 0.28, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-6 flex"
            >
              <HeroInteractivePreviewDeck
                heroImageSrc={HERO_SCHOLARS_IMG}
                courseId={selectedCourseId}
                onChangeCourse={(nextCourse) => {
                  if (audioHandleRef.current) stopVoiceSample();
                  setSelectedCourseId(nextCourse);
                  const quartet = getCourseTeacherQuartet(nextCourse);
                  if (teacherMode === 'quartet' && quartet[0]) {
                    setSelectedTeacherSubj(quartet[0].subj);
                  }
                }}
                practiceScore={practiceScore}
                onChangePracticeScore={setPracticeScore}
                heroTeacher={heroTeacher}
                heroTeacherScript={heroTeacherScript}
                isVoicePlaying={isHeroVoicePlaying}
                isVoiceLoading={isHeroVoiceLoading}
                onToggleHeroVoice={handleToggleHeroVoice}
                onOpenLiveEnglishDrill={() =>
                  launchInstantOrFallback({
                    type: 'live-practice',
                    examTrack: selectedTrack,
                    subj: 'eng',
                    preset: blueprint.preset,
                    previewThemeId,
                  })
                }
                onJumpToArena={() => {
                  const el = document.getElementById('exam-tracks');
                  if (el) {
                    el.scrollIntoView({
                      behavior: prefersReduced ? 'auto' : 'smooth',
                      block: 'start',
                    });
                  }
                }}
              />
            </motion.div>
          </div>

          {/* Full-width 4-column Architectural Proof Ledger below the Hero split */}
          <div className="mt-12 pt-8 border-t border-[var(--line)] grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x lg:divide-[var(--line)]">
            <div className="flex flex-col gap-1.5 lg:pr-7">
              <div className="eyak-display font-extrabold text-[28px] sm:text-[32px] leading-none text-[var(--ink)] tabular-nums">
                <AnimatedNumber value={49} suffix=" Subjects" />
              </div>
              <div className="text-[13.5px] text-[var(--dim)] leading-snug">
                25 official JAMB UTME subjects plus 24 WAEC school &amp; trade syllabuses
              </div>
            </div>

            <div className="flex flex-col gap-1.5 lg:px-7">
              <div className="eyak-display font-extrabold text-[28px] sm:text-[32px] leading-none text-[var(--ink)] tabular-nums">
                6/7 in 3:30
              </div>
              <div className="text-[13.5px] text-[var(--dim)] leading-snug">
                Tough JAMB topic pass bar engineered with twin-option traps
              </div>
            </div>

            <div className="flex flex-col gap-1.5 lg:px-7">
              <div className="eyak-display font-extrabold text-[28px] sm:text-[32px] leading-none text-[var(--ink)] tabular-nums">
                /<AnimatedNumber value={400} suffix=" CBT" />
              </div>
              <div className="text-[13.5px] text-[var(--dim)] leading-snug">
                Every Saturday timed mock arena with same-day national student ranking
              </div>
            </div>

            <div className="flex flex-col gap-1.5 lg:pl-7">
              <div className="eyak-display font-extrabold text-[28px] sm:text-[32px] leading-none text-[var(--ink)] tabular-nums">
                <AnimatedNumber value={87} suffix=" Labs" />
              </div>
              <div className="text-[13.5px] text-[var(--dim)] leading-snug">
                Interactive Chemistry, Physics, Biology &amp; compass construction benches
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Act II — Sticky Split-Screen Scrollytelling: Exam Track Architecture & Trap Arena */}
      <section
        id="exam-tracks"
        className="scroll-mt-16 border-b border-[var(--line)] bg-[var(--card)]/55"
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left Sticky Narrative & Track Controller */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 flex flex-col gap-6">
              <div className="flex flex-col gap-2.5">
                <span className="text-[13px] font-bold text-[var(--gold)]">
                  01. Exam Track Architecture
                </span>
                <h2 className="eyak-display font-extrabold text-[26px] sm:text-[34px] leading-[1.12] text-[var(--ink)] text-balance">
                  Choose one exam or combine both. Watch Easy Learn re-weight your syllabus.
                </h2>
                <p className="text-[15px] text-[var(--dim)] leading-relaxed">
                  Switch tracks to see how your subject scope, daily mission split, and live trap drills adapt immediately on the right.
                </p>
              </div>

              <LiquidCapsuleBar
                items={[
                  { id: 'jamb', label: 'JAMB UTME' },
                  { id: 'waec', label: 'WAEC / SSCE' },
                  { id: 'both', label: 'Both (70/30)' },
                ]}
                value={selectedTrack}
                onChange={setSelectedTrack}
                ariaLabel="Preview exam track"
                size="sm"
                className="self-start"
              />

              <SmoothViewSwitch viewKey={selectedTrack}>
                <div className="flex flex-col gap-5 pt-2">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex flex-wrap items-center gap-2 text-[12.5px] font-bold text-[var(--gold)]">
                      <span>{activeTrackSpec.audienceLine}</span>
                      <span aria-hidden="true" className="text-[var(--dim)]">·</span>
                      <span className="text-[var(--dim)]">{activeTrackSpec.subjectScopeLabel}</span>
                    </div>
                    <h3 className="eyak-display font-extrabold text-[20px] sm:text-[22px] leading-snug text-[var(--ink)] text-balance">
                      {activeTrackSpec.headline}
                    </h3>
                    <p className="text-[14px] leading-relaxed text-[var(--dim)]">
                      {activeTrackSpec.summary}
                    </p>
                  </div>

                  {/* Animated Daily Mission Weight Bar */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-[12px] font-bold eyak-mono">
                      <span className="text-[var(--gold)]">
                        JAMB UTME: {activeTrackSpec.jambWeightPct}%
                      </span>
                      <span className="text-[var(--green)]">
                        WAEC / SSCE: {activeTrackSpec.waecWeightPct}%
                      </span>
                    </div>
                    <SmoothProgressBar
                      value={
                        activeTrackSpec.jambWeightPct > 0 ? activeTrackSpec.jambWeightPct : 100
                      }
                      max={100}
                      tone={activeTrackSpec.jambWeightPct === 0 ? 'emerald' : 'indigo'}
                      heightClass="h-2.5"
                      ariaLabel="JAMB versus WAEC daily study focus split"
                    />
                  </div>

                  {/* Unboxed Hairlined Architectural Rules */}
                  <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
                    {activeTrackSpec.pillars.map((pillar, idx) => (
                      <div key={pillar.title} className="py-3 flex flex-col gap-1">
                        <span className="text-[12.5px] font-bold text-[var(--gold)] tabular-nums">
                          0{idx + 1}. {pillar.title}
                        </span>
                        <p className="text-[13px] leading-relaxed text-[var(--dim)]">
                          {pillar.detail}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-[12.5px] font-semibold text-[var(--dim)]">
                      {activeTrackSpec.trainingStandardLabel}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        onStartWithTrack(
                          'register',
                          selectedTrack,
                          blueprint.preset.jambQuartet?.[0],
                          blueprint.preset
                        )
                      }
                      className="eyak-cta-sheen min-h-[42px] px-5 py-2.5 rounded-xl bg-[var(--gold)] text-[var(--on-acc)] eyak-display font-bold text-[13.5px] inline-flex items-center gap-2 hover:opacity-95 transition-opacity cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <span>{activeTrackSpec.ctaLabel}</span>
                      <Icon name="go" size={16} />
                    </button>
                  </div>
                </div>
              </SmoothViewSwitch>
            </div>

            {/* Right Interactive Workbench: Examiner Standard + Playable 5-Subject Trap Arena */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <SmoothViewSwitch viewKey={`example-${selectedTrack}`}>
                <div className="eyak-spotlight-surface rounded-2xl border border-[var(--line)] bg-[var(--card)] p-6 sm:p-7 flex flex-col gap-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[12.5px] font-bold text-[var(--gold)]">
                    <span>{activeTrackSpec.examExample.kicker}</span>
                    <span className="eyak-mono text-[11.5px] text-[var(--dim)]">
                      Marking Scheme Calibration
                    </span>
                  </div>
                  <p className="eyak-display font-bold text-[17.5px] sm:text-[19px] leading-snug text-[var(--ink)]">
                    {activeTrackSpec.examExample.prompt}
                  </p>
                  <div className="pt-3.5 border-t border-[var(--line)] grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13.5px] leading-relaxed">
                    <p className="text-[var(--coral-ink)]">
                      <strong>Common candidate slip:</strong> {activeTrackSpec.examExample.trapNote}
                    </p>
                    <p className="text-[var(--green)]">
                      <strong>Easy Learn training standard:</strong> {activeTrackSpec.examExample.winningRule}
                    </p>
                  </div>
                </div>
              </SmoothViewSwitch>

              <InteractiveTrapArena
                selectedTrack={selectedTrack}
                onStartWithSubject={(subj) =>
                  onStartWithTrack('register', selectedTrack, subj, blueprint.preset)
                }
                onPracticeSubjectLive={(subj) =>
                  launchInstantOrFallback({
                    type: 'live-practice',
                    examTrack: selectedTrack,
                    subj,
                    preset: blueprint.preset,
                    previewThemeId,
                  })
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* 02. Interactive Nigerian University Admission Compass */}
      <AdmissionCompassStage
        courseId={selectedCourseId}
        onChangeCourse={(nextCourse) => {
          if (audioHandleRef.current) stopVoiceSample();
          setSelectedCourseId(nextCourse);
          const quartet = getCourseTeacherQuartet(nextCourse);
          if (teacherMode === 'quartet' && quartet[0]) {
            setSelectedTeacherSubj(quartet[0].subj);
          }
        }}
        practiceScore={practiceScore}
        onChangePracticeScore={setPracticeScore}
        selectedTrack={selectedTrack}
        onLaunchCoursePreset={(track, preset) =>
          onStartWithTrack('register', track, preset.jambQuartet?.[0], {
            ...preset,
            previewThemeId,
          })
        }
        onPreviewCourseDashboard={(track, preset) =>
          launchInstantOrFallback({
            type: 'demo-dashboard',
            examTrack: track,
            subj: preset.jambQuartet?.[0],
            preset: { ...preset, previewThemeId },
            previewThemeId,
          })
        }
        onLaunchMissionSlot={(slot: ConnectedStudyMissionSlot, preset) => {
          const mergedPreset = { ...preset, previewThemeId };
          if (slot.activityKind === 'lesson') {
            launchInstantOrFallback({
              type: 'live-lesson',
              examTrack: selectedTrack,
              subj: slot.subj,
              preset: mergedPreset,
              previewThemeId,
            });
          } else if (slot.activityKind === 'lab') {
            launchInstantOrFallback({
              type: 'live-lab',
              examTrack: selectedTrack,
              subj: slot.subj === 'chem' ? 'chem' : 'maths',
              labId: slot.labId || 'c-titration',
              preset: mergedPreset,
              previewThemeId,
            });
          } else if (slot.activityKind === 'theory') {
            launchInstantOrFallback({
              type: 'live-theory',
              examTrack: selectedTrack,
              subj: slot.subj,
              preset: mergedPreset,
              previewThemeId,
            });
          } else {
            launchInstantOrFallback({
              type: 'live-practice',
              examTrack: selectedTrack,
              subj: slot.subj,
              preset: mergedPreset,
              previewThemeId,
            });
          }
        }}
        onAuditionCourseTeachers={(targetCourse) => {
          if (audioHandleRef.current) stopVoiceSample();
          setSelectedCourseId(targetCourse);
          setTeacherMode('quartet');
          const quartet = getCourseTeacherQuartet(targetCourse);
          if (quartet[0]) setSelectedTeacherSubj(quartet[0].subj);
          const el = document.getElementById('voice-teachers');
          if (el) {
            el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
          }
        }}
      />

      {/* Act IV — Nocturnal Obsidian Soundstage & Practical Theatre (Chapters 03 & 04) */}
      <div
        data-mode="dark"
        data-theme={previewThemeId}
        className="eyak-nocturnal-stage text-[var(--ink)]"
      >
        {/* 03. Interactive Live Voice Teacher Quartet Relay & Personalities */}
        <section
          id="voice-teachers"
          className="scroll-mt-16 border-b border-[var(--line)]"
        >
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 flex flex-col gap-9">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="flex flex-col gap-2 max-w-[68ch]">
                <span className="text-[13px] font-bold text-[var(--gold)]">
                  03. Nocturnal Voice Soundstage &amp; Quartet Relay
                </span>
                <h2 className="eyak-display font-extrabold text-[26px] sm:text-[34px] leading-[1.14] text-[var(--ink)] text-balance">
                  49 subject teachers, each with their own voice and personality — introduced only once.
                </h2>
              <p className="text-[15.5px] text-[var(--dim)] leading-relaxed">
                Audition your exact 4 {activeCourseTitle} JAMB teachers back-to-back in a single relay — just like Easy Learn’s one-time setup lineup — or explore individual specialists. Inside lessons, they skip small talk and teach immediately.
              </p>
            </div>

            <LiquidCapsuleBar
              items={[
                { id: 'quartet', label: `My 4 ${activeCourseTitle} Teachers` },
                { id: 'all8', label: '8 Flagship Specialists' },
              ]}
              value={teacherMode}
              onChange={(mode) => {
                if (audioHandleRef.current) stopVoiceSample();
                setTeacherMode(mode);
                const nextList = mode === 'quartet' ? courseQuartetTeachers : featuredTeachers;
                if (!nextList.some((t) => t.subj === selectedTeacherSubj) && nextList[0]) {
                  setSelectedTeacherSubj(nextList[0].subj);
                }
              }}
              ariaLabel="Switch voice teacher lineup mode"
              size="md"
              className="self-start"
            />
          </div>

          <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Teacher Audition Selector */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2 text-[13px] font-bold text-[var(--dim)]">
                  <span>
                    {teacherMode === 'quartet'
                      ? `4 UTME Teachers for ${activeCourseTitle}`
                      : '8 Specialist Tutors (49 in app)'}
                  </span>
                  {relayActive && (
                    <span className="text-[var(--gold)] tabular-nums">
                      Relay {relayStepIndex + 1} / {courseQuartetTeachers.length}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                  {activeTeacherRoster.map((teacher, idx) => {
                    const isSelected = teacher.subj === activeTeacher.subj;
                    return (
                      <button
                        key={teacher.subj}
                        type="button"
                        onClick={() => handleSelectTeacher(teacher)}
                        className={`eyak-tactile-card min-h-[50px] px-4 py-2.5 rounded-xl border text-left flex items-center justify-between gap-3 cursor-pointer ${
                          isSelected
                            ? 'bg-[var(--acc-soft)] border-[var(--acc-line)] text-[var(--ink)]'
                            : 'bg-[var(--bg)]/60 border-[var(--line)] text-[var(--dim)] hover:text-[var(--ink)] hover:border-[var(--acc-line)]'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="eyak-display font-bold text-[14.5px] text-[var(--ink)] truncate">
                            {teacherMode === 'quartet' ? `0${idx + 1}. ` : ''}
                            {teacher.tutorName}
                          </div>
                          <div className="text-[12px] text-[var(--dim)] truncate">
                            {teacher.subjectName} · {teacher.personalityTag}
                          </div>
                        </div>
                        <Icon
                          name={isSelected && voiceState === 'playing' ? 'pause' : 'volume'}
                          size={16}
                          className={
                            isSelected ? 'text-[var(--gold)] shrink-0' : 'text-[var(--dim)] shrink-0'
                          }
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={handlePlayQuartetRelay}
                className="w-full min-h-[42px] px-4 py-2.5 rounded-xl border border-[var(--acc-line)] bg-[var(--acc-soft)] text-[var(--gold)] eyak-display font-bold text-[13.5px] inline-flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
              >
                <Icon name={relayActive ? 'pause' : 'volume'} size={16} />
                <span>
                  {relayActive
                    ? 'Stop 4-teacher lineup relay'
                    : `Play all 4 ${activeCourseTitle} teachers in relay`}
                </span>
              </button>
            </div>

            {/* Active Teacher Voice Spotlight with Live SVG Equalizer */}
            <div className="lg:col-span-7 lg:pl-8 lg:border-l border-t lg:border-t-0 border-[var(--line)] pt-6 lg:pt-0 flex flex-col justify-between gap-6">
              <SmoothViewSwitch viewKey={`${activeTeacher.subj}-${selectedTrack}`}>
                <div className="flex flex-col gap-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2 text-[12.5px] font-bold text-[var(--gold)]">
                        <span>{activeTeacher.subjectName}</span>
                        <span aria-hidden="true" className="text-[var(--dim)]">·</span>
                        <span className="text-[var(--dim)]">{activeTeacher.personalityTag}</span>
                        <span aria-hidden="true" className="text-[var(--dim)]">·</span>
                        <span className="text-[var(--dim)]">{activeTeacher.departmentLabel}</span>
                      </div>
                      <h3 className="eyak-display font-extrabold text-[24px] sm:text-[28px] text-[var(--ink)]">
                        {activeTeacher.tutorName}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3">
                      <svg
                        viewBox="0 0 106 32"
                        aria-hidden="true"
                        className={`w-[86px] h-[28px] shrink-0 ${
                          voiceState === 'playing' ? 'eyak-eq-live opacity-100' : 'opacity-45'
                        }`}
                      >
                        {EQUALIZER_BARS.map((bar) => (
                          <rect
                            key={bar.x}
                            x={bar.x}
                            y="4"
                            width="5"
                            height="24"
                            rx="2.5"
                            fill="var(--gold)"
                            className={`eyak-eq-bar ${bar.cls}`}
                          />
                        ))}
                      </svg>

                      <button
                        type="button"
                        onClick={handlePlayTeacherSample}
                        disabled={voiceState === 'loading'}
                        className="eyak-cta-sheen min-h-[44px] px-5 py-2.5 rounded-xl bg-[var(--gold)] text-[var(--on-acc)] eyak-display font-bold text-[14px] inline-flex items-center gap-2 hover:opacity-95 disabled:opacity-70 transition-opacity cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <Icon
                          name={voiceState === 'playing' && !relayActive ? 'pause' : 'volume'}
                          size={17}
                        />
                        <span>
                          {voiceState === 'loading'
                            ? 'Loading voice...'
                            : voiceState === 'playing' && !relayActive
                              ? 'Stop sample'
                              : 'Play voice'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Liquid Track Script Switcher */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--line)] text-[12.5px]">
                    <span className="font-bold text-[var(--dim)]">
                      One-time setup greeting tailored to:
                    </span>
                    <LiquidCapsuleBar
                      items={[
                        { id: 'jamb', label: 'JAMB Mode' },
                        { id: 'waec', label: 'WAEC Mode' },
                        { id: 'both', label: '70/30 Combined' },
                      ]}
                      value={selectedTrack}
                      onChange={(trk) => {
                        if (audioHandleRef.current) stopVoiceSample();
                        setSelectedTrack(trk);
                      }}
                      ariaLabel="Switch teacher greeting exam mode"
                      size="sm"
                    />
                  </div>

                  <blockquote className="text-[16px] sm:text-[17px] leading-[1.68] text-[var(--ink)] font-medium pt-1">
                    “{activeTeacherScript}”
                  </blockquote>

                  {voiceState === 'playing' && (
                    <p className="text-[13px] font-bold text-[var(--green)]">
                      {relayActive
                        ? `Playing teacher ${relayStepIndex + 1} of ${courseQuartetTeachers.length}: ${activeTeacher.tutorName}`
                        : `Playing ${activeTeacher.tutorName}’s studio voice greeting...`}
                    </p>
                  )}

                  {voiceState === 'error' && voiceError && (
                    <p role="alert" className="text-[13px] font-semibold text-[var(--coral-ink)]">
                      {voiceError}
                    </p>
                  )}
                </div>
              </SmoothViewSwitch>

              <div className="pt-5 border-t border-[var(--line)] flex flex-wrap items-center justify-between gap-4">
                <div className="text-[13px] text-[var(--dim)]">
                  <strong className="text-[var(--ink)]">Classroom tools:</strong>{' '}
                  {activeTeacher.toolsSummary}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      launchInstantOrFallback({
                        type: 'live-lesson',
                        examTrack: selectedTrack,
                        subj: activeTeacher.subj,
                        preset: blueprint.preset,
                        previewThemeId,
                      })
                    }
                    className="text-[13.5px] font-bold text-[var(--gold)] hover:underline underline-offset-4 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Open live lesson with {activeTeacher.tutorName} →
                  </button>
                  <span aria-hidden="true" className="text-[var(--dim)]">·</span>
                  <button
                    type="button"
                    onClick={() =>
                      onStartWithTrack(
                        'register',
                        selectedTrack,
                        activeTeacher.subj,
                        blueprint.preset
                      )
                    }
                    className="text-[13.5px] font-bold text-[var(--ink)] hover:text-[var(--gold)] underline underline-offset-4 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Enroll with {activeTeacher.tutorName}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* 04. Asymmetric Bento: Saturday CBT Ranking + Virtual Science Labs + Live Cohort Preview */}
        <section
          id="saturday-cbt"
          className="scroll-mt-16 border-b border-[var(--line)]"
        >
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 flex flex-col gap-9">
            <div className="flex flex-col gap-2 max-w-[68ch]">
              <span className="text-[13px] font-bold text-[var(--gold)]">
                04. Exam Stamina &amp; Practical Mastery
              </span>
              <h2 className="eyak-display font-extrabold text-[26px] sm:text-[34px] leading-[1.14] text-[var(--ink)] text-balance">
                Saturday national CBT rankings, virtual practical benches, and mistake redemption.
              </h2>
            </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Marquee Capability: Saturday National CBT Arena (col-span-7) */}
            <article className="group lg:col-span-7 rounded-2xl border border-[var(--line)] bg-[var(--card)] overflow-hidden flex flex-col justify-between">
              <div className="h-[220px] sm:h-[270px] lg:h-[310px] w-full bg-[var(--deep)] overflow-hidden border-b border-[var(--line)]">
                {!cbtImgFailed ? (
                  <img
                    src={SATURDAY_CBT_IMG}
                    alt="Nigerian secondary school candidates taking a timed computer-based mock examination in a modern ICT hall"
                    referrerPolicy="no-referrer"
                    onError={() => setCbtImgFailed(true)}
                    className="w-full h-full object-cover eyak-media-zoom"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-[var(--hero-start)] to-[var(--hero-end)] flex items-center justify-center text-white eyak-display font-bold text-[20px]">
                    Saturday National CBT Arena · /400 Timed Simulation
                  </div>
                )}
              </div>

              <div className="p-6 sm:p-7 flex flex-col gap-4 flex-1 justify-between">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2 text-[12.5px] font-bold text-[var(--gold)] tabular-nums">
                    <span>Every Saturday</span>
                    <span aria-hidden="true" className="text-[var(--dim)]">·</span>
                    <span className="text-[var(--dim)]">
                      180 Questions · /400 UTME &amp; WASSCE Scale
                    </span>
                    <span aria-hidden="true" className="text-[var(--dim)]">·</span>
                    <span className="text-[var(--dim)]">2× Saturday XP</span>
                  </div>
                  <h3 className="eyak-display font-extrabold text-[22px] text-[var(--ink)]">
                    Saturday National CBT Arena &amp; Same-Day Cohort Rank
                  </h3>
                  <p className="text-[14.5px] leading-relaxed text-[var(--dim)]">
                    Every week builds toward Saturday morning. Sit a full timed 4-subject UTME paper under strict exam-hall rules, see your exact percentile and rank against every scholar who took CBT that Saturday, and clear every missed question inside your Mistake Vault.
                  </p>
                </div>

                <div className="pt-4 border-t border-[var(--line)] flex flex-wrap items-center justify-between gap-3 text-[13px]">
                  <span className="text-[var(--dim)] font-semibold">
                    Includes keyboard A–D shortcuts, calculator, and weak-topic breakdown
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      launchInstantOrFallback({
                        type: 'live-cbt',
                        examTrack: 'jamb',
                        preset: { ...blueprint.preset, postSetupDestination: 'cbt' },
                        previewThemeId,
                      })
                    }
                    className="font-bold text-[var(--gold)] hover:underline underline-offset-4 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Join next Saturday CBT →
                  </button>
                </div>
              </div>
            </article>

            {/* Secondary Capability: Virtual Labs & Theory Coach (col-span-5) */}
            <article className="group lg:col-span-5 rounded-2xl border border-[var(--line)] bg-[var(--card)] overflow-hidden flex flex-col justify-between">
              <div className="h-[220px] sm:h-[270px] lg:h-[310px] w-full bg-[var(--deep)] overflow-hidden border-b border-[var(--line)]">
                {!labImgFailed ? (
                  <img
                    src={VIRTUAL_LAB_IMG}
                    alt="Chemistry volumetric burette titration apparatus alongside a brass geometry compass and optical prism on a laboratory workbench"
                    referrerPolicy="no-referrer"
                    onError={() => setLabImgFailed(true)}
                    className="w-full h-full object-cover eyak-media-zoom"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[var(--hero-mid)] to-[var(--hero-end)] flex items-center justify-center text-white eyak-display font-bold text-[19px]">
                    87 Interactive Practicals &amp; Constructions
                  </div>
                )}
              </div>

              <div className="p-6 sm:p-7 flex flex-col gap-4 flex-1 justify-between">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2 text-[12.5px] font-bold text-[var(--gold)] tabular-nums">
                    <span>87 Virtual Practicals</span>
                    <span aria-hidden="true" className="text-[var(--dim)]">·</span>
                    <span className="text-[var(--dim)]">Formula Studios &amp; Peer Duels</span>
                  </div>
                  <h3 className="eyak-display font-extrabold text-[22px] text-[var(--ink)]">
                    Hands-On Science Labs &amp; Compass Constructions
                  </h3>
                  <p className="text-[14.5px] leading-relaxed text-[var(--dim)]">
                    Practise 20 Chemistry titrations and ion tests, 16 Physics optics and metre-bridge experiments, 28 Biology and Agric specimens, and 23 animated compass-and-ruler locus constructions — even if your school lab equipment is locked.
                  </p>
                </div>

                <div className="pt-4 border-t border-[var(--line)] flex flex-wrap items-center justify-between gap-3 text-[13px]">
                  <span className="text-[var(--dim)] font-semibold">
                    Plus 10-question Peer Duels via shareable match codes
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      launchInstantOrFallback({
                        type: 'live-lab',
                        examTrack: selectedTrack,
                        subj: 'chem',
                        labId: 'c-titration',
                        preset: blueprint.preset,
                        previewThemeId,
                      })
                    }
                    className="font-bold text-[var(--gold)] hover:underline underline-offset-4 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Launch live lab bench →
                  </button>
                </div>
              </div>
            </article>
          </div>

          {/* Interactive Dual-Bench Practical Stage (Chemistry Titration + Maths Compass & Locus) */}
          <motion.div
            initial={sectionInitial}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={sectionTransition}
          >
            <InteractiveTitrationMicroLab
              onExploreLabs={() =>
                launchInstantOrFallback({
                  type: 'demo-dashboard',
                  examTrack: selectedTrack,
                  subj: 'chem',
                  preset: blueprint.preset,
                  previewThemeId,
                })
              }
              onLaunchSpecificLab={(subj, labId) =>
                launchInstantOrFallback({
                  type: 'live-lab',
                  examTrack: selectedTrack,
                  subj,
                  labId,
                  preset: blueprint.preset,
                  previewThemeId,
                })
              }
              onOpenTheoryCoach={() =>
                launchInstantOrFallback({
                  type: 'live-theory',
                  examTrack: selectedTrack,
                  subj: blueprint.preset.jambQuartet?.[0],
                  preset: blueprint.preset,
                  previewThemeId,
                })
              }
              onOpenPeerDuel={() =>
                launchInstantOrFallback({
                  type: 'live-duel',
                  examTrack: selectedTrack,
                  subj: blueprint.preset.jambQuartet?.[0],
                  preset: blueprint.preset,
                  previewThemeId,
                })
              }
              onOpenStemSandboxes={() =>
                launchInstantOrFallback({
                  type: 'live-sandboxes',
                  examTrack: selectedTrack,
                  subj: 'fmaths',
                  preset: blueprint.preset,
                  previewThemeId,
                })
              }
            />
          </motion.div>

          {/* Live Saturday /400 Cohort Standings Preview */}
          <SaturdayLiveCohortPanel
            onJoinSaturdayCbt={() =>
              launchInstantOrFallback({
                type: 'live-cbt',
                examTrack: 'jamb',
                preset: { ...blueprint.preset, postSetupDestination: 'cbt' },
                previewThemeId,
              })
            }
          />

          {/* Adjacent Proof: Attributable Nigerian Scholar & Teacher Outcomes */}
          <div className="pt-8 border-t border-[var(--line)] grid grid-cols-1 md:grid-cols-3 gap-8">
            {SCHOLAR_OUTCOMES.map((item) => (
              <div key={item.name} className="flex flex-col justify-between gap-4">
                <p className="text-[14.5px] leading-relaxed text-[var(--ink)]">
                  “{item.quote}”
                </p>
                <div className="flex flex-col gap-0.5 text-[12.5px]">
                  <div className="font-bold text-[var(--ink)]">{item.name}</div>
                  <div className="text-[var(--dim)]">
                    {item.role} · {item.institution}
                  </div>
                  <div className="font-bold text-[var(--gold)] tabular-nums mt-0.5">
                    {item.metricLine}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        </section>
      </div>

      {/* Act V — Daylight 49-Subject Curriculum Explorer & Transparent Naira Passes */}
      <section
        id="subjects"
        className="scroll-mt-16 border-b border-[var(--line)] bg-[var(--card)]/55"
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 flex flex-col gap-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="flex flex-col gap-2 max-w-[65ch]">
              <span className="text-[13px] font-bold text-[var(--gold)]">
                05. Complete 49-Subject Curriculum
              </span>
              <h2 className="eyak-display font-extrabold text-[26px] sm:text-[34px] leading-[1.14] text-[var(--ink)] text-balance">
                Every JAMB, WAEC, NECO, and trade subject — mapped with its own specialist tutor.
              </h2>
            </div>

            <div className="w-full lg:w-[320px]">
              <label htmlFor="website-subj-search" className="sr-only">
                Search 49 subjects or teachers
              </label>
              <div className="relative flex items-center">
                <Icon
                  name="search"
                  size={16}
                  className="absolute left-3.5 text-[var(--dim)] pointer-events-none"
                />
                <input
                  id="website-subj-search"
                  type="search"
                  value={subjectQuery}
                  onChange={(e) => setSubjectQuery(e.target.value)}
                  placeholder="Search subject or tutor name..."
                  className="w-full min-h-[42px] pl-10 pr-4 rounded-xl bg-[var(--card)] border border-[var(--line)] focus:border-[var(--gold)] text-[14px] font-semibold text-[var(--ink)] outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Live Interactive Study Atmosphere & Mastery Theme Switcher */}
          <StudyAtmosphereShowcase
            previewThemeId={previewThemeId}
            appearanceMode={appearanceMode}
            onSelectTheme={setPreviewThemeId}
            onToggleAppearance={onToggleAppearance}
          />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <LiquidCapsuleBar
              items={[
                { id: 'all', label: `All Subjects (${subjectCounts.total})` },
                { id: 'jamb', label: `JAMB & WAEC (${subjectCounts.jamb})` },
                { id: 'waec-school', label: `WAEC School (${subjectCounts.waecSchool})` },
                { id: 'waec-trade', label: `WAEC Trade (${subjectCounts.waecTrade})` },
              ]}
              value={subjectCategory}
              onChange={setSubjectCategory}
              ariaLabel="Filter curriculum by exam category"
              roleType="group"
              size="sm"
            />

            <div className="text-[13px] font-semibold text-[var(--dim)] tabular-nums">
              Showing {visibleSubjects.length} of {filteredSubjects.length} matching subjects · Click any card to inspect topics &amp; tutor
            </div>
          </div>

          {/* Inline 49-Subject Syllabus, Topic Deep-Link & Voice Teacher Inspector */}
          <SmoothCollapse open={inspectedSummary !== null}>
            {inspectedSummary && (
              <div
                id="eyak-subject-inspector"
                className="rounded-2xl border border-[var(--acc-line)] bg-[var(--card)] p-5 sm:p-7 flex flex-col gap-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-[var(--line)]">
                  <div className="flex flex-col gap-1 max-w-[64ch]">
                    <div className="flex flex-wrap items-center gap-2 text-[12.5px] font-bold text-[var(--gold)] tabular-nums">
                      <span>{inspectedSummary.examStructureLine}</span>
                      <span aria-hidden="true" className="text-[var(--dim)]">·</span>
                      <span className="text-[var(--dim)]">
                        {inspectedSummary.totalTopics} Syllabus Topics
                      </span>
                    </div>
                    <h3 className="eyak-display font-extrabold text-[22px] sm:text-[25px] text-[var(--ink)]">
                      {inspectedSummary.name} — {inspectedSummary.tutorName} ({inspectedSummary.personalityTag})
                    </h3>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() =>
                        void handlePlayInspectorVoice(
                          inspectedSummary.subj,
                          inspectedSummary.isJamb
                        )
                      }
                      disabled={
                        inspectorVoiceSubj === inspectedSummary.subj && voiceState === 'loading'
                      }
                      className="min-h-[38px] px-4 py-2 rounded-xl bg-[var(--acc-soft)] text-[var(--gold)] eyak-display font-bold text-[13px] inline-flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <Icon
                        name={
                          inspectorVoiceSubj === inspectedSummary.subj && voiceState === 'playing'
                            ? 'pause'
                            : 'volume'
                        }
                        size={15}
                      />
                      <span>
                        {inspectorVoiceSubj === inspectedSummary.subj && voiceState === 'loading'
                          ? 'Loading voice...'
                          : inspectorVoiceSubj === inspectedSummary.subj && voiceState === 'playing'
                            ? 'Stop greeting'
                            : `Hear ${inspectedSummary.tutorName}`}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (inspectorVoiceSubj === inspectedSummary.subj) stopVoiceSample();
                        setInspectedSubj(null);
                      }}
                      aria-label={`Close ${inspectedSummary.name} inspector`}
                      className="min-h-[38px] px-3 py-2 rounded-xl border border-[var(--line)] bg-[var(--bg)] text-[12.5px] font-bold text-[var(--dim)] hover:text-[var(--ink)] transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Close
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-7 flex flex-col gap-2.5">
                    <div className="text-[12.5px] font-bold text-[var(--ink)]">
                      Click any syllabus topic below to open its interactive classroom directly:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {inspectedSummary.previewTopics.map((tp, idx) => (
                        <button
                          key={tp.id}
                          type="button"
                          onClick={() =>
                            launchInstantOrFallback({
                              type: 'live-lesson',
                              examTrack: inspectedSummary.isJamb ? selectedTrack : 'waec',
                              subj: inspectedSummary.subj,
                              topicId: tp.id,
                              preset: blueprint.preset,
                              previewThemeId,
                            })
                          }
                          className="eyak-tactile-card min-h-[42px] px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--bg)]/70 hover:border-[var(--acc-line)] text-left flex items-center justify-between gap-2 cursor-pointer"
                        >
                          <span className="text-[13px] font-semibold text-[var(--ink)] truncate">
                            <span className="eyak-mono text-[var(--gold)] font-bold mr-1.5">
                              0{idx + 1}.
                            </span>
                            {tp.name}
                          </span>
                          <span aria-hidden="true" className="text-[var(--gold)] font-bold text-[12px] shrink-0">
                            →
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-5 lg:pl-6 lg:border-l border-t lg:border-t-0 border-[var(--line)] pt-4 lg:pt-0 flex flex-col justify-between gap-4">
                    <div className="flex flex-col gap-2">
                      <span className="text-[12px] font-bold text-[var(--gold)]">
                        One-Time Teacher Greeting Preview
                      </span>
                      <p className="text-[13.5px] leading-relaxed text-[var(--dim)]">
                        “{inspectedSummary.voiceGreeting}”
                      </p>
                      <span className="text-[12px] text-[var(--dim)]">
                        <strong className="text-[var(--ink)]">Studio tools:</strong>{' '}
                        {inspectedSummary.toolsSummary}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-[var(--line)] flex flex-wrap items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() =>
                          launchInstantOrFallback({
                            type: 'live-lesson',
                            examTrack: inspectedSummary.isJamb ? selectedTrack : 'waec',
                            subj: inspectedSummary.subj,
                            preset: blueprint.preset,
                            previewThemeId,
                          })
                        }
                        className="eyak-cta-sheen min-h-[38px] px-4 py-2 rounded-xl bg-[var(--gold)] text-[var(--on-acc)] eyak-display font-bold text-[13px] hover:opacity-95 transition-opacity cursor-pointer whitespace-nowrap"
                      >
                        Open Live {inspectedSummary.shortName} Lesson →
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          launchInstantOrFallback({
                            type: 'live-practice',
                            examTrack: inspectedSummary.isJamb ? selectedTrack : 'waec',
                            subj: inspectedSummary.subj,
                            preset: blueprint.preset,
                            previewThemeId,
                          })
                        }
                        className="min-h-[38px] px-3.5 py-2 rounded-xl bg-[var(--acc-soft)] text-[var(--gold)] eyak-display font-bold text-[13px] hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
                      >
                        Start {inspectedSummary.shortName} Drill →
                      </button>

                      {inspectedSummary.recommendedLabId && (
                        <button
                          type="button"
                          onClick={() =>
                            launchInstantOrFallback({
                              type: 'live-lab',
                              examTrack: inspectedSummary.isJamb ? selectedTrack : 'waec',
                              subj: inspectedSummary.subj as
                                | 'chem'
                                | 'maths'
                                | 'phys'
                                | 'bio'
                                | 'agric',
                              labId: inspectedSummary.recommendedLabId!,
                              preset: blueprint.preset,
                              previewThemeId,
                            })
                          }
                          className="min-h-[38px] px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--bg)] text-[12.5px] font-bold text-[var(--ink)] hover:border-[var(--acc-line)] transition-colors cursor-pointer whitespace-nowrap"
                        >
                          Launch Practical Lab →
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          onStartWithTrack(
                            'register',
                            inspectedSummary.isJamb ? selectedTrack : 'waec',
                            inspectedSummary.subj,
                            blueprint.preset
                          )
                        }
                        className="text-[12.5px] font-bold text-[var(--ink)] hover:text-[var(--gold)] underline underline-offset-4 cursor-pointer whitespace-nowrap"
                      >
                        Enroll with {inspectedSummary.shortName}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </SmoothCollapse>

          <SmoothViewSwitch viewKey={`${subjectCategory}-${showAllSubjects ? 'all' : 'compact'}`}>
            {filteredSubjects.length === 0 ? (
              <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-8 text-center flex flex-col items-center gap-3">
                <p className="eyak-display font-bold text-[17px] text-[var(--ink)]">
                  No subject matched “{subjectQuery}” in this category.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubjectQuery('');
                    setSubjectCategory('all');
                  }}
                  className="min-h-[38px] px-4 py-2 rounded-xl bg-[var(--acc-soft)] text-[var(--gold)] text-[13px] font-bold cursor-pointer whitespace-nowrap"
                >
                  Reset subject filters
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {visibleSubjects.map((item) => {
                    const isInspected = inspectedSubj === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        aria-expanded={isInspected}
                        onClick={() => {
                          setInspectedSubj((prev) => (prev === item.id ? null : item.id));
                        }}
                        className={`eyak-tactile-card rounded-xl border p-4 text-left flex flex-col justify-between gap-2.5 cursor-pointer ${
                          isInspected
                            ? 'border-[var(--gold)] bg-[var(--acc-soft)]/55'
                            : 'border-[var(--line)] bg-[var(--card)] hover:border-[var(--acc-line)]'
                        }`}
                      >
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between gap-2 text-[11.5px] font-bold text-[var(--gold)]">
                            <span>{item.examBadgeText}</span>
                            <span className="text-[var(--dim)]">
                              {isInspected ? '− Open' : '+ Topics'}
                            </span>
                          </div>
                          <div className="eyak-display font-bold text-[15.5px] text-[var(--ink)] leading-snug">
                            {item.name}
                          </div>
                        </div>
                        <div className="pt-2 border-t border-[var(--line)] text-[12px] text-[var(--dim)] flex flex-col gap-0.5">
                          <span className="font-semibold text-[var(--ink)]">
                            {item.tutorName} · {item.personalityTag}
                          </span>
                          <span className="truncate">{item.companionText}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {filteredSubjects.length > 16 && subjectQuery.trim().length === 0 && (
                  <div className="flex justify-center pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAllSubjects((prev) => !prev)}
                      className="min-h-[42px] px-5 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--card)] text-[13.5px] font-bold text-[var(--ink)] hover:border-[var(--acc-line)] transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {showAllSubjects
                        ? 'Show compact 16-subject view'
                        : `View all ${filteredSubjects.length} subjects`}
                    </button>
                  </div>
                )}
              </div>
            )}
          </SmoothViewSwitch>

          {/* Official JAMB & WAEC Prescribed Novels Interactive Shelf */}
          {(() => {
            const previewNovel =
              JAMB_WAEC_NOVELS.find((n) => n.id === selectedWebsiteNovelId) ||
              JAMB_WAEC_NOVELS[0];
            const firstChapter = previewNovel.chapters[0];
            return (
              <div
                id="prescribed-novels"
                className="pt-10 border-t border-[var(--line)] flex flex-col gap-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                  <div className="flex flex-col gap-1.5 max-w-[66ch]">
                    <span className="text-[13px] font-bold text-[var(--gold)]">
                      Official JAMB &amp; WAEC Set Books Library (8 Complete Texts)
                    </span>
                    <h3 className="eyak-display font-extrabold text-[22px] sm:text-[28px] leading-[1.16] text-[var(--ink)] text-balance">
                      Every compulsory UTME Use of English novel &amp; 2026–2030 Literature prose text — chapter by chapter.
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      launchInstantOrFallback({
                        type: 'open-novel',
                        examTrack: selectedTrack,
                        novelId: previewNovel.id,
                        subj: previewNovel.subjectId,
                        preset: blueprint.preset,
                        previewThemeId,
                      })
                    }
                    className="eyak-cta-sheen self-start lg:self-auto min-h-[42px] px-5 py-2.5 rounded-xl bg-[var(--gold)] text-[var(--on-acc)] eyak-display font-bold text-[13.5px] hover:opacity-95 transition-opacity cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Study {previewNovel.title} Now →
                  </button>
                </div>

                {/* 8-Novel Selector Strip */}
                <div
                  role="tablist"
                  aria-label="Choose prescribed JAMB or WAEC novel to preview"
                  className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5"
                >
                  {JAMB_WAEC_NOVELS.map((novel) => {
                    const isSelected = novel.id === previewNovel.id;
                    return (
                      <button
                        key={novel.id}
                        role="tab"
                        aria-selected={isSelected}
                        type="button"
                        onClick={() => setSelectedWebsiteNovelId(novel.id)}
                        className={`eyak-tactile-card rounded-xl border p-2.5 text-left flex flex-col gap-2 cursor-pointer transition-colors ${
                          isSelected
                            ? 'border-[var(--gold)] bg-[var(--acc-soft)]/55'
                            : 'border-[var(--line)] bg-[var(--card)] hover:border-[var(--acc-line)]'
                        }`}
                      >
                        <NovelBookCover
                          novel={novel}
                          className="w-full aspect-[3/4] rounded-lg"
                        />
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <div className="text-[10.5px] font-bold text-[var(--gold)] truncate">
                            {novel.examBodies.join(' · ')}
                          </div>
                          <div className="eyak-display font-bold text-[12px] leading-tight text-[var(--ink)] line-clamp-2">
                            {novel.title}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Novel Live Study Preview */}
                <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-7 flex flex-col gap-2.5">
                    <div className="flex flex-wrap items-center gap-2 text-[12px] font-bold text-[var(--gold)] tabular-nums">
                      <span>{previewNovel.statusLabel}</span>
                      <span aria-hidden="true" className="text-[var(--dim)]">
                        ·
                      </span>
                      <span className="text-[var(--dim)]">{previewNovel.structureLabel}</span>
                      <span aria-hidden="true" className="text-[var(--dim)]">
                        ·
                      </span>
                      <span className="text-[var(--dim)]">{previewNovel.syllabusWindow}</span>
                    </div>

                    <h4 className="eyak-display font-extrabold text-[20px] sm:text-[23px] text-[var(--ink)]">
                      {previewNovel.title} — {previewNovel.author}
                    </h4>

                    <p className="text-[14px] leading-relaxed text-[var(--dim)]">
                      {previewNovel.overview}
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-[var(--dim)]">
                      <strong className="text-[var(--ink)]">Key characters:</strong>
                      {previewNovel.characters.slice(0, 4).map((ch, idx) => (
                        <React.Fragment key={ch.name}>
                          {idx > 0 && <span aria-hidden="true">·</span>}
                          <span>{ch.name}</span>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-5 lg:pl-6 lg:border-l border-t lg:border-t-0 border-[var(--line)] pt-4 lg:pt-0 flex flex-col justify-between gap-3.5">
                    <div className="flex flex-col gap-1.5">
                      <div className="text-[12px] font-bold text-[var(--gold)]">
                        Sample Chapter &amp; Examiner Trap · {firstChapter.title}
                      </div>
                      <p className="text-[13px] leading-relaxed text-[var(--ink)]">
                        {firstChapter.examTrap}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[var(--line)] flex flex-wrap items-center justify-between gap-2 text-[12px] text-[var(--dim)] tabular-nums">
                      <span>
                        {previewNovel.chapters.length} chapters · {previewNovel.characters.length}{' '}
                        characters · {previewNovel.questions.length} exam drills
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          launchInstantOrFallback({
                            type: 'open-novel',
                            examTrack: selectedTrack,
                            novelId: previewNovel.id,
                            subj: previewNovel.subjectId,
                            preset: blueprint.preset,
                            previewThemeId,
                          })
                        }
                        className="font-bold text-[var(--gold)] hover:underline cursor-pointer whitespace-nowrap"
                      >
                        Open full guide →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* 06. Honest Naira Passes, Spring FAQ & School/Parent Inquiry */}
      <section id="pricing" className="scroll-mt-16 border-b border-[var(--line)] bg-[var(--bg)]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 flex flex-col gap-12">
          <div className="flex flex-col gap-2 max-w-[68ch]">
            <span className="text-[13px] font-bold text-[var(--gold)]">
              {PUBLIC_FREE_LAUNCH_ACTIVE
                ? '06. Early Scholar Free Launch Active'
                : '06. Transparent Naira Passes'}
            </span>
            <h2 className="eyak-display font-extrabold text-[26px] sm:text-[34px] leading-[1.14] text-[var(--ink)] text-balance">
              {PUBLIC_FREE_LAUNCH_ACTIVE
                ? 'Currently 100% Free during Launch — all 49 subjects, 8 novels, CBT & labs unlocked.'
                : `Begin with a ${pricingData.freeTrialDays}-day free trial · Cancel anytime.`}
            </h2>
            <p className="text-[15.5px] text-[var(--dim)] leading-relaxed">
              {PUBLIC_FREE_LAUNCH_ACTIVE
                ? 'Every student can study, run virtual science labs, take full 180-question CBT mocks, and install the offline app completely free right now (₦0). Standard Paystack Naira passes below remain paused while Free Launch is active.'
                : 'Link your Google Payment Account or Paystack details for a 24-hour free trial with live countdown. Monthly, 6-Month, and Yearly subscriptions auto-renew unless cancelled beforehand; Lifetime is a one-time payment with no auto-debit.'}
            </p>
          </div>

          {/* Unified Connected Study Blueprint Card */}
          <div className="rounded-2xl border border-[var(--acc-line)] bg-[var(--card)] p-6 sm:p-7 flex flex-col gap-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[var(--line)]">
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2 text-[12.5px] font-bold text-[var(--gold)]">
                  <span>Your Connected Easy Learn Study Blueprint</span>
                  <span aria-hidden="true" className="text-[var(--dim)]">·</span>
                  <span className="text-[var(--dim)]">{blueprint.trackLabel}</span>
                  <span aria-hidden="true" className="text-[var(--dim)]">·</span>
                  <span className="text-[var(--dim)]">{activeAtmosphereName} Atmosphere</span>
                </div>
                <h3 className="eyak-display font-extrabold text-[20px] sm:text-[23px] text-[var(--ink)]">
                  {blueprint.courseTitle} — {blueprint.scoreLine}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    onStartWithTrack(
                      'register',
                      selectedTrack,
                      blueprint.preset.jambQuartet?.[0],
                      blueprint.preset
                    )
                  }
                  className="eyak-cta-sheen min-h-[42px] px-5 py-2.5 rounded-xl bg-[var(--gold)] text-[var(--on-acc)] eyak-display font-bold text-[13.5px] inline-flex items-center gap-2 hover:opacity-95 transition-opacity cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>Create Account with My Blueprint</span>
                  <Icon name="go" size={16} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    launchInstantOrFallback({
                      type: 'demo-dashboard',
                      examTrack: selectedTrack,
                      subj: blueprint.preset.jambQuartet?.[0],
                      preset: blueprint.preset,
                      previewThemeId,
                    })
                  }
                  className="min-h-[42px] px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--bg)] text-[var(--ink)] eyak-display font-bold text-[13.5px] hover:border-[var(--acc-line)] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  Open Blueprint in Live Demo →
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-[13.5px]">
              <div className="flex flex-col gap-1">
                <span className="text-[12px] font-bold text-[var(--dim)]">
                  Pre-Loaded 4 UTME Subjects
                </span>
                <span className="font-bold text-[var(--ink)]">{blueprint.subjectSummary}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[12px] font-bold text-[var(--dim)]">
                  Assigned Voice Teacher Quartet
                </span>
                <span className="font-bold text-[var(--ink)]">{blueprint.teacherSummary}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[12px] font-bold text-[var(--dim)]">
                  Campus Goal &amp; Target Accuracy
                </span>
                <span className="font-bold text-[var(--gold)] tabular-nums">
                  {blueprint.campusGoal} · {blueprint.preset.targetPct}% topic bar
                </span>
              </div>
            </div>
          </div>

          {/* Editorial Platform Comparison Matrix */}
          <motion.div
            initial={sectionInitial}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={sectionTransition}
            className="rounded-2xl border border-[var(--line)] bg-[var(--card)] overflow-hidden"
          >
            <div className="px-5 sm:px-7 py-4 border-b border-[var(--line)] flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-col gap-0.5">
                <span className="text-[12px] font-bold text-[var(--gold)]">
                  Direct Platform Comparison
                </span>
                <h3 className="eyak-display font-extrabold text-[18px] sm:text-[20px] text-[var(--ink)]">
                  Why SS3 scholars and lesson centres move from static PDFs to Easy Learn
                </h3>
              </div>
              <span className="text-[12.5px] font-semibold text-[var(--dim)]">
                Built natively for Nigerian exam marking schemes
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[640px]">
                <thead>
                  <tr className="border-b border-[var(--line)] bg-[var(--bg)]/55 text-[12.5px] font-bold text-[var(--dim)]">
                    <th scope="col" className="py-3 px-5 sm:px-7 w-[22%]">
                      Study Capability
                    </th>
                    <th scope="col" className="py-3 px-5 text-[var(--ink)] w-[42%]">
                      Easy Learn · Your Road to Campus
                    </th>
                    <th scope="col" className="py-3 px-5 sm:px-7 w-[36%]">
                      Typical Past-Question Apps &amp; PDFs
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--line)] text-[13.5px]">
                  {PLATFORM_COMPARISON_ROWS.map((row) => (
                    <tr key={row.dimension} className="hover:bg-[var(--bg)]/35 transition-colors">
                      <th
                        scope="row"
                        className="py-3.5 px-5 sm:px-7 eyak-display font-bold text-[var(--ink)] align-top"
                      >
                        {row.dimension}
                      </th>
                      <td className="py-3.5 px-5 text-[var(--ink)] font-medium align-top">
                        <span className="text-[var(--green)] font-extrabold mr-1.5" aria-hidden="true">
                          ✓
                        </span>
                        {row.eyakValue}
                      </td>
                      <td className="py-3.5 px-5 sm:px-7 text-[var(--dim)] align-top">
                        <span className="text-[var(--dim)] font-bold mr-1.5" aria-hidden="true">
                          —
                        </span>
                        {row.standardValue}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
            {pricingData.plans.map((plan) => (
              <div
                key={plan.id}
                className={`eyak-tactile-card rounded-2xl p-6 flex flex-col justify-between gap-6 border ${
                  plan.isRecommended
                    ? 'bg-[var(--card)] border-2 border-[var(--gold)]'
                    : 'bg-[var(--card)] border-[var(--line)]'
                }`}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-0.5">
                    <div className="text-[12px] font-bold text-[var(--gold)] min-h-[18px]">
                      {plan.highlightNote || `${plan.durationLabel} full access`}
                    </div>
                    <h3 className="eyak-display font-extrabold text-[20px] text-[var(--ink)]">
                      {plan.name}
                    </h3>
                  </div>

                  <div className="pt-2 border-t border-[var(--line)]">
                    {PUBLIC_FREE_LAUNCH_ACTIVE ? (
                      <>
                        <div className="flex items-baseline gap-2.5">
                          <span className="eyak-display font-extrabold text-[32px] leading-none text-[var(--green)] tabular-nums">
                            ₦0
                          </span>
                          {plan.priceFormatted !== '₦0' && (
                            <span className="eyak-display font-bold text-[16px] text-[var(--dim)] line-through tabular-nums">
                              {plan.priceFormatted}
                            </span>
                          )}
                        </div>
                        <div className="text-[12.5px] font-semibold text-[var(--green)] tabular-nums mt-1.5">
                          Free Launch Active · {plan.durationLabel} unlocked
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="eyak-display font-extrabold text-[32px] leading-none text-[var(--ink)] tabular-nums">
                          {plan.priceFormatted}
                        </div>
                        <div className="text-[12.5px] font-semibold text-[var(--dim)] tabular-nums mt-1.5">
                          {plan.durationLabel} · {plan.perMonthEquivalent}
                        </div>
                      </>
                    )}
                  </div>

                  <p className="text-[13.5px] leading-relaxed text-[var(--dim)]">
                    {plan.blurb}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const passPreset: WebsiteOnboardingPreset = {
                      ...blueprint.preset,
                      selectedPlanId: plan.id,
                      postSetupDestination: PUBLIC_FREE_LAUNCH_ACTIVE ? 'default' : 'paywall',
                    };
                    if (onLaunchInstantAction) {
                      onLaunchInstantAction({
                        type: 'choose-pass',
                        examTrack: selectedTrack,
                        planId: plan.id,
                        preset: passPreset,
                        previewThemeId,
                      });
                    } else {
                      onStartWithTrack(
                        'register',
                        selectedTrack,
                        blueprint.preset.jambQuartet?.[0],
                        passPreset
                      );
                    }
                  }}
                  className={`w-full min-h-[42px] px-4 py-2.5 rounded-xl eyak-display font-bold text-[13.5px] transition-opacity cursor-pointer whitespace-nowrap ${
                    plan.isRecommended
                      ? 'eyak-cta-sheen bg-[var(--gold)] text-[var(--on-acc)] hover:opacity-95'
                      : 'bg-[var(--acc-soft)] text-[var(--gold)] hover:opacity-90'
                  }`}
                >
                  {PUBLIC_FREE_LAUNCH_ACTIVE ? 'Start Free Now' : `Choose ${plan.name}`}
                </button>
              </div>
            ))}
          </div>

          {/* Split Row: SmoothCollapse Spring FAQ + Validated School / Parent Cohort Request Form */}
          <div className="pt-10 border-t border-[var(--line)] grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h3 className="eyak-display font-extrabold text-[22px] text-[var(--ink)]">
                  Questions from Students &amp; Parents
                </h3>
                <p className="text-[14px] text-[var(--dim)]">
                  Clear answers on how exam tracks, voice data, and Saturday rankings operate.
                </p>
              </div>

              <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
                {FAQ_ITEMS.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div key={faq.q} className="py-4">
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full flex items-center justify-between gap-4 text-left eyak-display font-bold text-[15.5px] text-[var(--ink)] hover:text-[var(--gold)] transition-colors cursor-pointer"
                      >
                        <span>{faq.q}</span>
                        <span
                          aria-hidden="true"
                          className={`text-[var(--gold)] font-bold text-[19px] shrink-0 transition-transform duration-200 ${
                            isOpen ? 'rotate-45' : 'rotate-0'
                          }`}
                        >
                          +
                        </span>
                      </button>
                      <SmoothCollapse open={isOpen}>
                        <p className="pt-2.5 text-[14px] leading-relaxed text-[var(--dim)] pr-6">
                          {faq.a}
                        </p>
                      </SmoothCollapse>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-6 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-6 sm:p-7 flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <span className="text-[12.5px] font-bold text-[var(--gold)]">
                  Parents, Schools &amp; Lesson Centres · 100% Paystack
                </span>
                <h3 className="eyak-display font-extrabold text-[21px] text-[var(--ink)]">
                  Sponsor a Scholar or Pay for School Seats on Paystack
                </h3>
                <p className="text-[13.5px] text-[var(--dim)] leading-relaxed">
                  Enter your scholar’s email (or paste a class email list for automatic 15%–25% volume discounts) and pay directly on Paystack. Every scholar unlocks automatically when they sign in.
                </p>
              </div>

              <form onSubmit={handleSponsorPaystackSubmit} noValidate className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <LiquidCapsuleBar
                    items={[
                      { id: 'parent', label: 'Parent / Guardian' },
                      { id: 'school', label: 'School / Centre' },
                      { id: 'student', label: 'Scholar' },
                    ]}
                    value={inquiryRole}
                    onChange={(r) => {
                      setInquiryRole(r);
                      setSponsorError(null);
                      setSponsorStatusMsg(null);
                    }}
                    ariaLabel="Select payer role"
                    roleType="group"
                    size="sm"
                  />

                  <LiquidCapsuleBar
                    items={[
                      { id: 'monthly', label: 'Monthly' },
                      { id: 'biannual', label: '6-Month' },
                      { id: 'annual', label: 'Yearly' },
                    ]}
                    value={cohortPlanId}
                    onChange={(p) => {
                      setCohortPlanId(p);
                      setSponsorError(null);
                      setSponsorStatusMsg(null);
                    }}
                    ariaLabel="Select pass duration for Paystack checkout"
                    roleType="group"
                    size="sm"
                  />
                </div>

                {/* Live Naira Paystack Seat Calculator */}
                <div className="rounded-xl border border-[var(--line)] bg-[var(--bg)]/70 p-4 flex flex-col gap-2">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-[12.5px] font-bold text-[var(--gold)]">
                      {cohortEstimate.discountLabel}
                    </span>
                    <span className="eyak-mono font-extrabold text-[20px] text-[var(--ink)] tabular-nums">
                      {formatNairaPrice(cohortEstimate.totalNgn)}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[12.5px] text-[var(--dim)] tabular-nums">
                    <span>
                      {cohortEstimate.scholars}{' '}
                      {cohortEstimate.scholars === 1 ? 'scholar seat' : 'scholar seats'} ·{' '}
                      {cohortEstimate.planLabel} ({formatNairaPrice(cohortEstimate.perScholarFinalNgn)}/scholar)
                    </span>
                    {cohortEstimate.savingsNgn > 0 && (
                      <span className="font-bold text-[var(--green)]">
                        Saves {formatNairaPrice(cohortEstimate.savingsNgn)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="eyak-sponsor-receipt" className="text-[12.5px] font-bold text-[var(--ink)]">
                    Your email for Paystack payment receipt
                  </label>
                  <input
                    id="eyak-sponsor-receipt"
                    type="email"
                    value={payerEmail}
                    onChange={(e) => {
                      setPayerEmail(e.target.value);
                      if (sponsorError) setSponsorError(null);
                    }}
                    placeholder={
                      inquiryRole === 'school'
                        ? 'bursar@kingsacademy.edu.ng'
                        : 'parent@example.com'
                    }
                    className="min-h-[42px] px-3.5 rounded-xl bg-[var(--bg)] border border-[var(--line)] focus:border-[var(--gold)] text-[14px] font-semibold text-[var(--ink)] outline-none transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <label
                      htmlFor="eyak-sponsor-scholars"
                      className="text-[12.5px] font-bold text-[var(--ink)]"
                    >
                      {inquiryRole === 'school'
                        ? 'Scholar account emails (comma or newline separated)'
                        : 'Scholar account email to unlock automatically'}
                    </label>
                    {parsedScholarList.emails.length > 0 && (
                      <span className="text-[11.5px] font-bold text-[var(--green)] tabular-nums">
                        {parsedScholarList.emails.length}{' '}
                        {parsedScholarList.emails.length === 1 ? 'valid email' : 'valid emails'}
                      </span>
                    )}
                  </div>
                  {inquiryRole === 'school' ? (
                    <textarea
                      id="eyak-sponsor-scholars"
                      rows={3}
                      value={scholarEmailsInput}
                      onChange={(e) => {
                        setScholarEmailsInput(e.target.value);
                        if (sponsorError) setSponsorError(null);
                      }}
                      placeholder="ada@gmail.com, chinedu@gmail.com, amina@gmail.com..."
                      className="p-3.5 rounded-xl bg-[var(--bg)] border border-[var(--line)] focus:border-[var(--gold)] text-[13.5px] font-medium text-[var(--ink)] outline-none transition-colors resize-y"
                    />
                  ) : (
                    <input
                      id="eyak-sponsor-scholars"
                      type="email"
                      value={scholarEmailsInput}
                      onChange={(e) => {
                        setScholarEmailsInput(e.target.value);
                        if (sponsorError) setSponsorError(null);
                      }}
                      placeholder="scholar@gmail.com"
                      className="min-h-[42px] px-3.5 rounded-xl bg-[var(--bg)] border border-[var(--line)] focus:border-[var(--gold)] text-[14px] font-semibold text-[var(--ink)] outline-none transition-colors"
                    />
                  )}
                </div>

                <SmoothCollapse open={Boolean(sponsorError)}>
                  {sponsorError && (
                    <p role="alert" className="text-[13px] font-semibold text-[var(--coral-ink)]">
                      {sponsorError}
                    </p>
                  )}
                </SmoothCollapse>

                <SmoothCollapse open={Boolean(sponsorStatusMsg)}>
                  {sponsorStatusMsg && (
                    <div
                      role="status"
                      className="rounded-xl border border-[var(--ok-line)] bg-[var(--ok-soft)] p-3.5 text-[13px] text-[var(--ink)] flex flex-col gap-2"
                    >
                      <div className="font-semibold text-[var(--ink)] leading-snug">
                        {sponsorStatusMsg}
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={() =>
                            onStartWithTrack(
                              'register',
                              selectedTrack,
                              blueprint.preset.jambQuartet?.[0],
                              {
                                ...blueprint.preset,
                                selectedPlanId: cohortPlanId,
                                postSetupDestination: 'paywall',
                              }
                            )
                          }
                          className="text-[12.5px] font-bold text-[var(--gold)] hover:underline cursor-pointer"
                        >
                          Open Scholar Setup &amp; 1-Day Free Trial →
                        </button>
                      </div>
                    </div>
                  )}
                </SmoothCollapse>

                {sponsorCheckout && (
                  <div className="rounded-xl border border-[var(--acc-line)] bg-[var(--bg)] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-[12.5px] text-[var(--dim)]">
                      <div className="font-bold text-[var(--ink)] tabular-nums">
                        Paystack session ready · {formatNairaPrice(sponsorCheckout.totalNgn)} (
                        {sponsorCheckout.seats}{' '}
                        {sponsorCheckout.seats === 1 ? 'seat' : 'seats'})
                      </div>
                      <div className="eyak-mono text-[11.5px] mt-0.5">
                        Ref: {sponsorCheckout.reference}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <a
                        href={sponsorCheckout.authorizationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-[36px] px-3 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--card)] text-[12.5px] font-bold text-[var(--ink)] inline-flex items-center whitespace-nowrap"
                      >
                        Open Paystack ↗
                      </a>
                      <button
                        type="button"
                        disabled={sponsorBusy}
                        onClick={() => void handleVerifySponsorPaystack(sponsorCheckout.reference)}
                        className="min-h-[36px] px-3 py-1.5 rounded-lg bg-[var(--gold)] text-[var(--on-acc)] text-[12.5px] font-bold inline-flex items-center whitespace-nowrap cursor-pointer"
                      >
                        {sponsorBusy ? 'Checking…' : 'Verify payment'}
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={sponsorBusy}
                    className="eyak-cta-sheen min-h-[44px] px-5 py-2.5 rounded-xl bg-[var(--gold)] text-[var(--on-acc)] eyak-display font-bold text-[14px] hover:opacity-95 disabled:opacity-70 transition-opacity cursor-pointer whitespace-nowrap inline-flex items-center gap-2 tabular-nums"
                  >
                    <Icon name="shield" size={16} />
                    <span>
                      {sponsorBusy
                        ? 'Connecting to Paystack…'
                        : `Pay ${formatNairaPrice(cohortEstimate.totalNgn)} on Paystack`}
                    </span>
                  </button>
                  <span className="text-[12px] text-[var(--dim)]">
                    Card · Instant Bank Transfer · USSD via Paystack
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 07. Installable Offline App & Public Share Link Hub (hidden when already installed) */}
      {!isInstalled && (
        <section
          id="install-app"
          className="scroll-mt-16 border-b border-[var(--line)] bg-[var(--card)]/45"
        >
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 flex flex-col gap-8">
            <div className="flex flex-col gap-2 max-w-[68ch]">
              <span className="text-[13px] font-bold text-[var(--gold)]">
                07. Installable App &amp; Live Website Link
              </span>
              <h2 className="eyak-display font-extrabold text-[26px] sm:text-[34px] leading-[1.14] text-[var(--ink)] text-balance">
                Get the installable Easy Learn app on Android, iPhone &amp; Laptop — completely free.
              </h2>
              <p className="text-[15.5px] text-[var(--dim)] leading-relaxed">
                Copy your live website link to share with classmates or schools, or install Easy Learn directly onto any home screen for fast, full-screen offline revision.
              </p>
            </div>

            <InstallAppHubCard />
          </div>
        </section>
      )}

      {/* Closing Nocturnal Campus Launch Stage */}
      <section
        data-mode="dark"
        data-theme={previewThemeId}
        className="eyak-nocturnal-stage border-b border-[var(--line)] text-[var(--ink)]"
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="flex flex-col gap-2.5 max-w-[62ch]">
            <div className="flex flex-wrap items-center gap-2 text-[12.5px] font-bold text-[var(--gold)]">
              <span>{blueprint.courseTitle}</span>
              <span aria-hidden="true" className="text-[var(--dim)]">·</span>
              <span className="text-[var(--dim)]">{blueprint.trackLabel}</span>
              <span aria-hidden="true" className="text-[var(--dim)]">·</span>
              <span className="eyak-mono text-[var(--green)]">{blueprint.scoreLine}</span>
            </div>
            <h2 className="eyak-display font-extrabold text-[28px] sm:text-[36px] leading-[1.1] text-[var(--ink)] text-balance">
              Step onto your Road to Campus with your subjects and voice teachers already waiting.
            </h2>
            <p className="text-[15px] text-[var(--dim)] leading-relaxed">
              {PUBLIC_FREE_LAUNCH_ACTIVE
                ? 'Start studying 100% free in under 60 seconds, install the offline app, or jump straight into an instant classroom session right now.'
                : 'Start your 1-day free trial (cancel anytime) in under 60 seconds, or try the strict 5-minute demo right now.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                if (hasActiveSession) {
                  onContinueSession();
                } else {
                  onStartWithTrack(
                    'register',
                    selectedTrack,
                    blueprint.preset.jambQuartet?.[0],
                    blueprint.preset
                  );
                }
              }}
              aria-label={
                hasActiveSession
                  ? 'Open Study Dashboard'
                  : PUBLIC_FREE_LAUNCH_ACTIVE
                    ? 'Start Studying Free'
                    : 'Start 1-Day Free Trial'
              }
              className="eyak-cta-sheen min-h-[48px] px-5 py-3 rounded-xl bg-[var(--gold)] text-[var(--on-acc)] eyak-display font-bold text-[15px] inline-flex items-center gap-2.5 hover:opacity-95 transition-opacity cursor-pointer whitespace-nowrap"
            >
              {hasActiveSession ? <LayoutDashboard size={18} /> : <Sparkles size={18} />}
              <span>
                {hasActiveSession
                  ? 'Dashboard'
                  : PUBLIC_FREE_LAUNCH_ACTIVE
                    ? 'Start Free'
                    : '1-Day Trial'}
              </span>
              <ArrowRight size={17} />
            </button>

            <div className="inline-flex items-center gap-1.5 p-1 rounded-2xl bg-[var(--card)] border border-[var(--line)]">
              {!isInstalled && (
                <button
                  type="button"
                  onClick={() => setInstallModalOpen(true)}
                  aria-label="Install on Phone and Laptop"
                  title="Install on Phone & Laptop"
                  className="group relative h-[40px] px-3 rounded-xl bg-[var(--acc-soft)] border border-[var(--acc-line)] hover:brightness-110 text-[var(--gold)] inline-flex items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer"
                >
                  <Smartphone size={16} />
                  <Laptop size={17} />
                  <Download size={13} className="opacity-85" />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-[var(--ink)] text-[var(--bg)] text-[11px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-150 shadow-md"
                  >
                    Install App
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  if (audioHandleRef.current) stopVoiceSample();
                  setVideoTourOpen(true);
                }}
                aria-label="Watch 2-minute tour"
                title="Watch 2-min tour"
                className="group relative w-[40px] h-[40px] rounded-xl hover:bg-[var(--acc-soft)] text-[var(--ink)] hover:text-[var(--gold)] inline-flex items-center justify-center transition-colors duration-150 cursor-pointer"
              >
                <Play size={17} className="fill-current translate-x-[0.5px]" />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-[var(--ink)] text-[var(--bg)] text-[11px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-150 shadow-md"
                >
                  2-min Tour
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quiet Footer */}
      <footer className="bg-[var(--card)]/65 py-10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <CrestSvg size={36} />
            <div className="flex flex-col">
              <span className="eyak-display font-extrabold text-[17px] text-[var(--ink)]">
                Easy Learn · Your Road to Campus
              </span>
              <span className="text-[12.5px] text-[var(--dim)]">
                JAMB UTME, WAEC &amp; NECO preparation across 49 Nigerian secondary subjects.
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-[13px] font-semibold text-[var(--dim)]">
            <a href="#exam-tracks" className="hover:text-[var(--ink)] whitespace-nowrap">
              Exam Tracks
            </a>
            <a href="#admission-compass" className="hover:text-[var(--ink)] whitespace-nowrap">
              Courses
            </a>
            <a href="#subjects" className="hover:text-[var(--ink)] whitespace-nowrap">
              49 Subjects
            </a>
            {!isInstalled && (
              <a href="#install-app" className="hover:text-[var(--ink)] whitespace-nowrap">
                Install App
              </a>
            )}
            <button
              type="button"
              onClick={() => onStartWithTrack('login', selectedTrack)}
              className="hover:text-[var(--ink)] cursor-pointer whitespace-nowrap"
            >
              Sign In
            </button>
            {onToggleAppearance && (
              <button
                type="button"
                onClick={onToggleAppearance}
                className="hover:text-[var(--ink)] cursor-pointer whitespace-nowrap"
              >
                {appearanceMode === 'dark' ? 'Light mode' : 'Dark mode'}
              </button>
            )}
          </div>
        </div>
      </footer>

      <PWAInstallModal open={installModalOpen} onClose={() => setInstallModalOpen(false)} />

      {/* Official 2-Minute Easy Learn Video Tour Modal */}
      {videoTourOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            data-theme={previewThemeId}
            data-mode={appearanceMode}
            role="dialog"
            aria-modal="true"
            aria-labelledby="easylearn-tour-title"
            className="eyak-theme-stage fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm text-[var(--ink)]"
            onClick={(e) => {
              if (e.target === e.currentTarget) setVideoTourOpen(false);
            }}
          >
            <div className="w-full max-w-[460px] rounded-2xl bg-[var(--card)] border border-[var(--line)] shadow-2xl p-4 sm:p-5 flex flex-col gap-3.5 max-h-[92vh] overflow-y-auto">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <CrestSvg size={30} />
                  <div className="min-w-0">
                    <h2
                      id="easylearn-tour-title"
                      className="eyak-display font-extrabold text-[17px] text-[var(--ink)] leading-tight truncate"
                    >
                      Easy Learn · 2-Minute Platform Tour
                    </h2>
                    <p className="text-[12px] text-[var(--dim)] truncate">
                      Your road to campus · JAMB UTME, WAEC &amp; NECO
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setVideoTourOpen(false)}
                  aria-label="Close video tour"
                  className="w-9 h-9 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-[var(--dim)] hover:text-[var(--ink)] flex items-center justify-center shrink-0 cursor-pointer transition-colors"
                >
                  <Icon name="x" size={16} />
                </button>
              </div>

              <div className="rounded-xl overflow-hidden bg-[#0B0326] border border-[var(--line)] flex items-center justify-center">
                <video
                  src="/assets/aistudio/EasyLearn_Advert_2min__1__db34b592.mp4"
                  poster="/easylearn-logo.png"
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                  className="h-[62vh] max-h-[560px] w-auto max-w-full aspect-[9/16] object-contain mx-auto"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-0.5">
                <span className="text-[12.5px] font-semibold text-[var(--dim)]">
                  1-day free trial (cancel anytime) · Full access from ₦1,000/month
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setVideoTourOpen(false);
                    if (hasActiveSession) {
                      onContinueSession();
                    } else {
                      onStartWithTrack(
                        'register',
                        selectedTrack,
                        blueprint.preset.jambQuartet?.[0],
                        blueprint.preset
                      );
                    }
                  }}
                  className="eyak-cta-sheen min-h-[40px] px-4 py-2 rounded-xl bg-[var(--gold)] text-[var(--on-acc)] eyak-display font-bold text-[13.5px] inline-flex items-center gap-2 hover:opacity-95 transition-opacity cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>{hasActiveSession ? 'Open Study Dashboard' : 'Start 1-Day Free Trial'}</span>
                  <Icon name="go" size={15} />
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
