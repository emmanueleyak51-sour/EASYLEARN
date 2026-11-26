import React, { useMemo, useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase';
import type { ChemClassId, SubjectId } from '../../types';
import { SUBJECT_INFO } from '../../utils/engine';
import {
  authenticateAccount,
  loadAccounts,
  registerAccountStrict,
  resetAccountPasswordWithGoogle,
  saveAccounts,
  setSessionUnlocked,
  validateRegisterInput,
} from '../../utils/authAccounts';
import { typesetMathHtml } from '../../utils/mathTypesetter';
import { CrestSvg, Icon } from '../Icons';
import { StudyBuddy } from '../StudyBuddy';
import { LiquidCapsuleBar } from '../ULessonMotion';

type SplitMode = 'login' | 'register';

interface SampleQuestionSpec {
  id: string;
  subjectLabel: string;
  subj: SubjectId;
  stem: string;
  options: string[];
  correct: number;
  whyWrong: string[];
  explanation: string;
}

const SAMPLE_QUESTIONS: SampleQuestionSpec[] = [
  {
    id: 'sq-maths',
    subjectLabel: 'Mathematics',
    subj: 'maths',
    stem: 'A trader bought a school bag for ₦8,000 and sold it for ₦9,600. What was her percentage profit?',
    options: ['15%', '16.7%', '20%', '25%'],
    correct: 2,
    whyWrong: [
      '15% comes from guessing instead of dividing ₦1,600 by the cost price ₦8,000.',
      '16.7% divides the profit by the selling price (₦9,600) instead of the cost price (₦8,000).',
      '',
      '25% would mean a profit of ₦2,000 on ₦8,000, not ₦1,600.',
    ],
    explanation:
      'Profit = selling price − cost price = ₦9,600 − ₦8,000 = ₦1,600. Percentage profit is always measured on the cost price: (1,600 ÷ 8,000) × 100% = 20%.',
  },
  {
    id: 'sq-eng',
    subjectLabel: 'Use of English',
    subj: 'eng',
    stem: 'Choose the option that best completes the sentence: Neither the captain nor the players _____ aware of the new kick-off time.',
    options: ['was', 'were', 'is', 'has been'],
    correct: 1,
    whyWrong: [
      '"Was" agrees with "captain", but with "neither … nor" the verb must agree with the nearer subject ("players").',
      '',
      '"Is" is singular, while the nearer subject "players" is plural.',
      '"Has been" is singular, so it cannot match the plural noun "players".',
    ],
    explanation:
      'When two subjects are joined by "neither … nor" or "either … or", the verb agrees with the subject closer to it. Because "players" is plural, the correct verb is "were".',
  },
  {
    id: 'sq-chem',
    subjectLabel: 'Chemistry',
    subj: 'chem',
    stem: 'An element X has atomic number 11 and mass number 23. How many neutrons are in one atom of X?',
    options: ['11', '12', '23', '34'],
    correct: 1,
    whyWrong: [
      '11 is the number of protons (and electrons in a neutral atom), not neutrons.',
      '',
      '23 is the total mass number (protons + neutrons together).',
      '34 adds the mass number and atomic number instead of subtracting.',
    ],
    explanation:
      'Mass number = protons + neutrons. Subtract the atomic number from the mass number: 23 − 11 = 12 neutrons.',
  },
];

export interface ConnectedBlueprintNotice {
  trackLabel: string;
  campusGoal?: string;
  subjectNames: string;
  selectedPlanLabel?: string;
  destinationNote?: string;
}

export function WelcomeScreen({
  initialName,
  initialSubjs,
  initialClassLevel = 'ss1',
  initialTarget,
  initialAuthMode,
  connectedSummary,
  onComplete,
  onAuthenticated,
  onSkipToDemo,
  onBackToWebsite,
}: {
  initialName: string;
  initialSubjs: SubjectId[];
  initialClassLevel?: ChemClassId;
  initialTarget: number;
  initialAuthMode?: SplitMode;
  connectedSummary?: ConnectedBlueprintNotice | null;
  onComplete: (cfg: {
    name: string;
    subjs: SubjectId[];
    classLevel: ChemClassId;
    target: number;
  }) => void;
  onAuthenticated?: (cfg: {
    name: string;
    subjs?: SubjectId[];
    classLevel?: ChemClassId;
    target?: number;
    isExisting: boolean;
  }) => void;
  onSkipToDemo: () => void;
  onBackToWebsite?: () => void;
}) {
  const accounts = useMemo(() => loadAccounts(), []);
  const hasReturningStudent = Boolean(initialName.trim() || accounts.length > 0);

  const [mode, setMode] = useState<SplitMode>(initialAuthMode || 'register');

  // Interactive sample question state matched to preferred subject when possible
  const [sampleIdx, setSampleIdx] = useState(() => {
    const first = initialSubjs?.[0];
    if (first === 'eng') return 1;
    if (first === 'chem') return 2;
    return 0;
  });
  const [samplePicked, setSamplePicked] = useState<number | null>(null);
  const sample = SAMPLE_QUESTIONS[sampleIdx];

  // Sign in state
  const [loginId, setLoginId] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginNotice, setLoginNotice] = useState('');
  const [authBusy, setAuthBusy] = useState(false);

  // Create account state (always start blank so a public link never prefills another user's name)
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [showRegPass, setShowRegPass] = useState(false);
  const [regError, setRegError] = useState('');

  // Forgot-password via Google verification state
  const [googleVerifiedRecovery, setGoogleVerifiedRecovery] = useState<{
    email: string;
    displayName: string;
    idToken: string;
  } | null>(null);
  const [recoveryNewPass, setRecoveryNewPass] = useState('');
  const [recoveryError, setRecoveryError] = useState('');

  const defaultSubjs: SubjectId[] =
    initialSubjs && initialSubjs.length > 0 ? initialSubjs : ['eng', 'maths'];

  const finalizeEntry = (payload: {
    name: string;
    subjs: SubjectId[];
    classLevel: ChemClassId;
    target: number;
    isExisting: boolean;
  }) => {
    setSessionUnlocked();
    if (onAuthenticated) {
      onAuthenticated(payload);
      return;
    }
    onComplete({
      name: payload.name,
      subjs: payload.subjs,
      classLevel: payload.classLevel,
      target: payload.target,
    });
  };

  const redirectToLoginForExistingEmail = (email: string, noticeMessage?: string) => {
    setMode('login');
    setLoginId(email);
    setLoginPass('');
    setLoginError('');
    setRegError('');
    setLoginNotice(
      noticeMessage ||
        `An Easy Learn account already exists for ${email}. Sign in with your password below, or tap "Forgot password? Recover with Google".`
    );
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authBusy) return;
    const cleanId = loginId.trim();
    if (!cleanId || !loginPass.trim()) {
      setLoginError('Enter your email address and your password.');
      return;
    }
    setAuthBusy(true);
    setLoginError('');
    setLoginNotice('');

    try {
      const currentAccounts = loadAccounts();
      const isEmail = cleanId.includes('@');

      if (isEmail) {
        try {
          const resp = await fetch('/api/auth/login-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: cleanId.toLowerCase(), password: loginPass }),
          });
          const body = await resp.json().catch(() => ({}));
          if (resp.ok && body?.ok) {
            const synced = resetAccountPasswordWithGoogle(currentAccounts, {
              email: body.email || cleanId.toLowerCase(),
              displayName: body.displayName,
              newPassword: loginPass,
              subjs: defaultSubjs,
              target: initialTarget || 75,
            });
            saveAccounts(synced.accounts);
            finalizeEntry({
              name: synced.account.username,
              subjs: synced.account.subjs,
              classLevel: synced.account.classLevel,
              target: synced.account.target,
              isExisting: true,
            });
            return;
          }
          if (resp.status === 401) {
            setLoginError(
              typeof body?.error === 'string'
                ? body.error
                : 'Incorrect password. Try again or tap "Forgot password? Recover with Google".'
            );
            return;
          }
        } catch {
          /* offline or server unavailable — fall through to local account verification */
        }
      }

      const res = authenticateAccount(currentAccounts, cleanId, loginPass, initialName);
      if (!res.ok) {
        setLoginError(
          res.error ||
            'Incorrect details. Check your password or tap "Forgot password? Recover with Google".'
        );
        return;
      }
      const acc = res.account;
      finalizeEntry({
        name: acc ? acc.username : initialName.trim() || cleanId,
        subjs: acc?.subjs?.length ? acc.subjs : defaultSubjs,
        classLevel: acc?.classLevel || initialClassLevel || 'all',
        target: acc?.target || initialTarget || 75,
        isExisting: true,
      });
    } finally {
      setAuthBusy(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authBusy) return;
    const check = validateRegisterInput(regName, regEmail, regPass);
    if (!check.ok) {
      setRegError(check.error || 'Fill in your first name, email address and password.');
      return;
    }

    const cleanName = regName.trim();
    const cleanEmail = regEmail.trim().toLowerCase();
    const current = loadAccounts();

    // 1. Instant local duplicate check — block duplicate account & redirect straight to Login
    const localAttempt = registerAccountStrict(current, {
      username: cleanName,
      email: cleanEmail,
      password: regPass,
      classLevel: 'all',
      subjs: defaultSubjs,
      target: initialTarget || 75,
    });
    if (!localAttempt.ok && localAttempt.duplicateEmail) {
      redirectToLoginForExistingEmail(cleanEmail, localAttempt.error);
      return;
    }

    // 2. Authoritative cross-device server unique-email check & registration
    setAuthBusy(true);
    setRegError('');
    try {
      const resp = await fetch('/api/auth/register-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          displayName: cleanName,
          password: regPass,
        }),
      });
      const body = await resp.json().catch(() => ({}));
      if (resp.status === 409 || body?.duplicateEmail) {
        redirectToLoginForExistingEmail(
          cleanEmail,
          typeof body?.error === 'string' ? body.error : undefined
        );
        return;
      }
      if (!resp.ok && resp.status >= 400 && resp.status < 500) {
        setRegError(
          typeof body?.error === 'string'
            ? body.error
            : 'Please check your registration details and try again.'
        );
        return;
      }
    } catch {
      /* offline PWA fallback: localAttempt already verified uniqueness on this device */
    } finally {
      setAuthBusy(false);
    }

    if (localAttempt.ok) {
      saveAccounts(localAttempt.accounts);
    }
    finalizeEntry({
      name: cleanName,
      subjs: defaultSubjs,
      classLevel: 'all',
      target: initialTarget || 75,
      isExisting: false,
    });
  };

  const handleGoogleSignInOrRecover = async (forPasswordRecovery: boolean) => {
    if (authBusy) return;
    setAuthBusy(true);
    setLoginError('');
    setRegError('');
    setRecoveryError('');
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const googleEmail = (cred.user.email || '').trim().toLowerCase();
      if (!googleEmail) {
        setLoginError('Google did not return an email address. Please try another Google account.');
        return;
      }
      const idToken = await cred.user.getIdToken();
      const displayName = (cred.user.displayName || googleEmail.split('@')[0] || 'Scholar').trim();

      if (forPasswordRecovery) {
        setMode('login');
        setLoginId(googleEmail);
        setGoogleVerifiedRecovery({ email: googleEmail, displayName, idToken });
        setRecoveryNewPass('');
        setLoginNotice(
          `Google verified ${googleEmail}. Set a new Easy Learn password below or sign straight in.`
        );
        return;
      }

      // Direct "Continue with Google" — sync account & enter immediately (no duplicates ever)
      try {
        await fetch('/api/auth/google-recover', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({}),
        });
      } catch {
        /* continue offline safely */
      }

      const current = loadAccounts();
      const synced = resetAccountPasswordWithGoogle(current, {
        email: googleEmail,
        displayName,
        subjs: defaultSubjs,
        target: initialTarget || 75,
      });
      saveAccounts(synced.accounts);
      finalizeEntry({
        name: synced.account.username,
        subjs: synced.account.subjs,
        classLevel: synced.account.classLevel,
        target: synced.account.target,
        isExisting: true,
      });
    } catch (err) {
      const code = (err as { code?: string })?.code || '';
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        return;
      }
      const msg =
        code === 'auth/popup-blocked'
          ? 'Your browser blocked the Google sign-in popup. Please allow popups and try again.'
          : 'Could not complete Google verification right now. Please try again.';
      if (mode === 'register') setRegError(msg);
      else setLoginError(msg);
    } finally {
      setAuthBusy(false);
    }
  };

  const handleSaveRecoveredPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleVerifiedRecovery || authBusy) return;
    if (recoveryNewPass.length < 4) {
      setRecoveryError('Create a new password of at least 4 characters.');
      return;
    }
    setAuthBusy(true);
    setRecoveryError('');
    try {
      const resp = await fetch('/api/auth/google-recover', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${googleVerifiedRecovery.idToken}`,
        },
        body: JSON.stringify({ newPassword: recoveryNewPass }),
      });
      if (!resp.ok) {
        const body = await resp.json().catch(() => ({}));
        setRecoveryError(
          typeof body?.error === 'string'
            ? body.error
            : 'Could not update your password right now. Please try again.'
        );
        return;
      }
    } catch {
      /* offline fallback updates local store */
    } finally {
      setAuthBusy(false);
    }

    const current = loadAccounts();
    const synced = resetAccountPasswordWithGoogle(current, {
      email: googleVerifiedRecovery.email,
      displayName: googleVerifiedRecovery.displayName,
      newPassword: recoveryNewPass,
      subjs: defaultSubjs,
      target: initialTarget || 75,
    });
    saveAccounts(synced.accounts);
    setGoogleVerifiedRecovery(null);
    finalizeEntry({
      name: synced.account.username,
      subjs: synced.account.subjs,
      classLevel: synced.account.classLevel,
      target: synced.account.target,
      isExisting: true,
    });
  };

  const handleResumeSavedStudent = () => {
    const fallbackAcc = accounts[0];
    const resolvedName = initialName.trim() || fallbackAcc?.username || 'Student';
    finalizeEntry({
      name: resolvedName,
      subjs: initialSubjs.length ? initialSubjs : fallbackAcc?.subjs || ['eng', 'maths'],
      classLevel: initialClassLevel || fallbackAcc?.classLevel || 'all',
      target: initialTarget || fallbackAcc?.target || 75,
      isExisting: true,
    });
  };

  const buddyMood =
    samplePicked === null
      ? 'happy'
      : samplePicked === sample.correct
        ? 'cheer'
        : 'think';

  return (
    <div className="max-w-[1060px] mx-auto py-4 sm:py-8 px-1 sm:px-3 flex flex-col gap-6 anim-rise">
      {/* Top brand bar */}
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          {onBackToWebsite && (
            <button
              type="button"
              onClick={onBackToWebsite}
              aria-label="Back to website"
              className="min-h-[38px] px-3 py-1.5 rounded-xl bg-[var(--card)] border border-[var(--line)] text-[13px] font-bold text-[var(--ink)] hover:border-[var(--acc-line)] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Icon name="back" size={16} />
              <span>Website</span>
            </button>
          )}
          <CrestSvg size={38} />
          <span className="font-[var(--display)] font-bold text-[22px] tracking-tight text-[var(--ink)] whitespace-nowrap shrink-0">
            Easy Learn
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSkipToDemo}
            className="text-[13px] font-bold text-[var(--gold)] hover:underline cursor-pointer whitespace-nowrap"
          >
            Try demo
          </button>
          <span className="hidden sm:inline text-[13px] font-semibold text-[var(--dim)] whitespace-nowrap">
            Full access from ₦1,000/month
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 min-[900px]:grid-cols-12 gap-6 items-start">
        {/* Left column: Plain pitch + real interactive sample question */}
        <section className="min-[900px]:col-span-7 flex flex-col gap-5">
          <div className="rtc-eq-plate p-6 sm:p-7 flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <div className="rounded-[22px] bg-[var(--card)] p-2 shrink-0">
                <StudyBuddy mood={buddyMood} size={54} />
              </div>
              <div className="flex flex-col gap-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-[12.5px] font-bold text-[#FFE1D1]">
                  <span>Road to Campus</span>
                  <span aria-hidden="true" className="text-white/65">·</span>
                  <span className="text-white/85">JAMB UTME &amp; WASSCE Prep</span>
                </div>
                <h1 className="h28 sm:h34 text-white">
                  Pass JAMB with calm, clear daily practice.
                </h1>
              </div>
            </div>
            <p className="text-[15px] text-white/90 leading-snug">
              Clear lessons, timed /400 mocks, and step-by-step solutions for every missed question.
            </p>
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <div className="rounded-[16px] tile-peach p-3">
                <div className="font-[var(--display)] font-bold text-[18px] leading-tight">Short lessons</div>
                <div className="text-[12.5px] opacity-85 mt-0.5">Worked examples first</div>
              </div>
              <div className="rounded-[16px] tile-mint p-3">
                <div className="font-[var(--display)] font-bold text-[18px] leading-tight">Mock exams</div>
                <div className="text-[12.5px] opacity-85 mt-0.5">Full /400 UTME timing</div>
              </div>
              <div className="rounded-[16px] tile-sky p-3">
                <div className="font-[var(--display)] font-bold text-[18px] leading-tight">Voice tutor</div>
                <div className="text-[12.5px] opacity-85 mt-0.5">Ask questions out loud</div>
              </div>
            </div>
          </div>

          {/* Real sample question */}
          <div className="rtc-card p-5 sm:p-6 flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[var(--line)]">
              <div className="flex items-center gap-2 text-[13px] font-bold text-[var(--ink)]">
                <span className="text-[var(--gold)]">Try a sample question</span>
                <span aria-hidden="true" className="text-[var(--dim)]">·</span>
                <span className="text-[var(--dim)]">{sample.subjectLabel}</span>
              </div>
              <LiquidCapsuleBar
                roleType="group"
                size="sm"
                ariaLabel="Sample subject"
                items={SAMPLE_QUESTIONS.map((sq) => ({
                  id: sq.id,
                  label: sq.subjectLabel,
                }))}
                value={sample.id}
                onChange={(pickedId) => {
                  const idx = SAMPLE_QUESTIONS.findIndex((sq) => sq.id === pickedId);
                  if (idx >= 0) {
                    setSampleIdx(idx);
                    setSamplePicked(null);
                  }
                }}
              />
            </div>

            <div
              className="qt text-[var(--ink)]"
              dangerouslySetInnerHTML={{ __html: typesetMathHtml(sample.stem, sample.subj) }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {sample.options.map((opt, idx) => {
                const answered = samplePicked !== null;
                const isRight = idx === sample.correct;
                const isChosen = samplePicked === idx;
                let stateCls = '';
                if (answered) {
                  if (isRight) stateCls = 'ok';
                  else if (isChosen) stateCls = 'no';
                  else stateCls = 'opt-eliminated';
                }
                const letter = String.fromCharCode(65 + idx);
                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={answered}
                    onClick={() => setSamplePicked(idx)}
                    className={`opt-tile ${stateCls}`}
                  >
                    <span className="opt-bubble">
                      <span>{letter}</span>
                    </span>
                    <span
                      className="flex-1"
                      dangerouslySetInnerHTML={{ __html: typesetMathHtml(opt, sample.subj) }}
                    />
                  </button>
                );
              })}
            </div>

            {samplePicked !== null && (
              <div
                className={`rounded-[22px] border-2 p-4 flex flex-col gap-2 anim-explain-reveal ${
                  samplePicked === sample.correct
                    ? 'bg-[var(--ok-soft)] border-[var(--ok-line)]'
                    : 'bg-[var(--bad-soft)] border-[var(--bad-line)]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Icon
                      name={samplePicked === sample.correct ? 'check' : 'x'}
                      size={18}
                      className={
                        samplePicked === sample.correct
                          ? 'text-[var(--green)]'
                          : 'text-[var(--coral-ink)]'
                      }
                    />
                    <span className="font-[var(--display)] font-bold text-[16px] text-[var(--ink)]">
                      {samplePicked === sample.correct ? 'Spot on!' : 'Not quite — here is why:'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSampleIdx((i) => (i + 1) % SAMPLE_QUESTIONS.length);
                      setSamplePicked(null);
                    }}
                    className="text-[12.5px] font-bold text-[var(--gold)] hover:underline cursor-pointer whitespace-nowrap"
                  >
                    Next sample
                  </button>
                </div>

                {samplePicked !== sample.correct && sample.whyWrong[samplePicked] && (
                  <p className="text-[14px] text-[var(--ink)] bg-[var(--card)]/85 rounded-[16px] p-3 border border-[var(--bad-line)]">
                    {sample.whyWrong[samplePicked]}
                  </p>
                )}

                <p className="text-[14.5px] text-[var(--ink)] leading-relaxed">
                  {sample.explanation}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Right column: Clear Sign in / Create account card */}
        <section
          aria-label={mode === 'login' ? 'Sign in' : 'Create account'}
          className="min-[900px]:col-span-5 rtc-card p-6 sm:p-7 flex flex-col gap-5"
        >
          <LiquidCapsuleBar
            roleType="tablist"
            size="lg"
            layoutMode="grid"
            gridClassName="grid-cols-2 gap-1.5"
            ariaLabel="Account mode"
            items={[
              { id: 'register' as const, label: 'Create account' },
              { id: 'login' as const, label: 'Sign in' },
            ]}
            value={mode}
            onChange={(nextMode) => {
              setLoginError('');
              setRegError('');
              setMode(nextMode);
            }}
          />

          {connectedSummary && (
            <div className="rounded-[18px] border border-[var(--acc-line)] bg-[var(--acc-soft)] p-3.5 flex flex-col gap-1.5 text-[12.5px]">
              <div className="flex items-center justify-between gap-2 font-bold">
                <span className="text-[var(--gold)]">Connected Blueprint</span>
                <span className="text-[var(--ink)]">{connectedSummary.trackLabel}</span>
              </div>
              {connectedSummary.campusGoal && (
                <div className="font-bold text-[var(--ink)]">
                  Goal: {connectedSummary.campusGoal}
                </div>
              )}
              <div className="text-[var(--dim)] leading-snug">
                <strong className="text-[var(--ink)]">Subjects ready:</strong>{' '}
                {connectedSummary.subjectNames}
              </div>
              {connectedSummary.selectedPlanLabel && (
                <div className="font-semibold text-[var(--green)]">
                  Selected pass: {connectedSummary.selectedPlanLabel}
                </div>
              )}
              {connectedSummary.destinationNote && (
                <div className="text-[var(--dim)]">{connectedSummary.destinationNote}</div>
              )}
            </div>
          )}

          {mode === 'login' && hasReturningStudent && (
            <button
              type="button"
              onClick={handleResumeSavedStudent}
              className="w-full min-h-[44px] px-4 py-2.5 rounded-[16px] bg-[var(--acc-soft)] border border-[var(--acc-line)] text-[var(--gold)] text-[13.5px] font-bold flex items-center justify-between gap-2 cursor-pointer"
            >
              <span className="truncate">Resume saved session on this device</span>
              <Icon name="go" size={16} className="shrink-0" />
            </button>
          )}

          {mode === 'register' ? (
            <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4" noValidate>
              <div>
                <h2 className="h22 text-[var(--ink)]">Create your account</h2>
                <p className="text-[13.5px] text-[var(--dim)] mt-0.5">
                  All 49 JAMB &amp; WAEC subjects, virtual labs, and set novels.
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="eyak-reg-name" className="text-[13px] font-bold text-[var(--ink)]">
                  First name
                </label>
                <input
                  id="eyak-reg-name"
                  type="text"
                  autoComplete="given-name"
                  placeholder="e.g. Chinedu or Amina"
                  value={regName}
                  onChange={(e) => {
                    setRegName(e.target.value);
                    if (regError) setRegError('');
                  }}
                  className="min-h-[46px] px-3.5 rounded-[16px] bg-[var(--bg)] border-2 border-[var(--line)] focus:border-[var(--gold)] text-[15px] font-semibold text-[var(--ink)] outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="eyak-reg-email" className="text-[13px] font-bold text-[var(--ink)]">
                  Email address
                </label>
                <input
                  id="eyak-reg-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={regEmail}
                  onChange={(e) => {
                    setRegEmail(e.target.value);
                    if (regError) setRegError('');
                  }}
                  className="min-h-[46px] px-3.5 rounded-[16px] bg-[var(--bg)] border-2 border-[var(--line)] focus:border-[var(--gold)] text-[15px] font-semibold text-[var(--ink)] outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="eyak-reg-pass" className="text-[13px] font-bold text-[var(--ink)]">
                  Password
                </label>
                <div className="relative flex items-center">
                  <input
                    id="eyak-reg-pass"
                    type={showRegPass ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="At least 6 characters"
                    value={regPass}
                    onChange={(e) => {
                      setRegPass(e.target.value);
                      if (regError) setRegError('');
                    }}
                    className="w-full min-h-[46px] pl-3.5 pr-11 rounded-[16px] bg-[var(--bg)] border-2 border-[var(--line)] focus:border-[var(--gold)] text-[15px] font-semibold text-[var(--ink)] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPass((v) => !v)}
                    aria-label={showRegPass ? 'Hide password' : 'Show password'}
                    className="absolute right-3 text-[var(--dim)] hover:text-[var(--ink)] cursor-pointer"
                  >
                    <Icon name={showRegPass ? 'eyeOff' : 'eye'} size={18} />
                  </button>
                </div>
              </div>

              {regError && (
                <p role="alert" className="text-[13px] font-semibold text-[var(--coral-ink)]">
                  {regError}
                </p>
              )}

              <button type="submit" disabled={authBusy} className="btn-tactile indigo w-full">
                <span>{authBusy ? 'Checking email...' : 'Create account'}</span>
                <Icon name="go" size={18} className="ul-arrow" />
              </button>

              <div className="flex items-center gap-3 text-[12px] font-semibold text-[var(--dim)]">
                <span className="h-px flex-1 bg-[var(--line)]" />
                <span>or</span>
                <span className="h-px flex-1 bg-[var(--line)]" />
              </div>

              <button
                type="button"
                disabled={authBusy}
                onClick={() => void handleGoogleSignInOrRecover(false)}
                className="w-full min-h-[46px] px-4 rounded-[16px] bg-[var(--bg)] border-2 border-[var(--line)] hover:border-[var(--gold)] text-[14px] font-bold text-[var(--ink)] flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
              >
                <Icon name="user" size={17} className="text-[var(--gold)]" />
                <span>Continue with Google</span>
              </button>
            </form>
          ) : (
            <div className="flex flex-col gap-4">
              {loginNotice && (
                <div
                  role="status"
                  className="rounded-[16px] bg-[var(--acc-soft)] border border-[var(--acc-line)] px-4 py-3 text-[13px] font-semibold text-[var(--ink)] leading-snug"
                >
                  {loginNotice}
                </div>
              )}

              {googleVerifiedRecovery ? (
                <form
                  onSubmit={handleSaveRecoveredPassword}
                  className="rounded-[18px] bg-[var(--bg)] border-2 border-[var(--gold)] p-4 flex flex-col gap-3"
                  noValidate
                >
                  <div>
                    <div className="text-[12px] font-bold uppercase tracking-wider text-[var(--green)]">
                      Google Verified · {googleVerifiedRecovery.email}
                    </div>
                    <h3 className="h18 text-[var(--ink)] mt-0.5">Set a new Easy Learn password</h3>
                    <p className="text-[12.5px] text-[var(--dim)] mt-0.5">
                      Save a new password for future email sign-ins, or sign straight into your
                      account now.
                    </p>
                  </div>

                  <input
                    type="password"
                    autoComplete="new-password"
                    placeholder="Enter new password (4+ characters)"
                    value={recoveryNewPass}
                    onChange={(e) => {
                      setRecoveryNewPass(e.target.value);
                      if (recoveryError) setRecoveryError('');
                    }}
                    className="w-full min-h-[44px] px-3.5 rounded-[14px] bg-[var(--card)] border-2 border-[var(--line)] focus:border-[var(--gold)] text-[14.5px] font-semibold text-[var(--ink)] outline-none"
                  />

                  {recoveryError && (
                    <p role="alert" className="text-[12.5px] font-semibold text-[var(--coral-ink)]">
                      {recoveryError}
                    </p>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      type="submit"
                      disabled={authBusy}
                      className="btn-tactile indigo flex-1"
                    >
                      <span>{authBusy ? 'Saving...' : 'Save password & Sign in'}</span>
                    </button>
                    <button
                      type="button"
                      disabled={authBusy}
                      onClick={() => {
                        const synced = resetAccountPasswordWithGoogle(loadAccounts(), {
                          email: googleVerifiedRecovery.email,
                          displayName: googleVerifiedRecovery.displayName,
                          subjs: defaultSubjs,
                          target: initialTarget || 75,
                        });
                        saveAccounts(synced.accounts);
                        setGoogleVerifiedRecovery(null);
                        finalizeEntry({
                          name: synced.account.username,
                          subjs: synced.account.subjs,
                          classLevel: synced.account.classLevel,
                          target: synced.account.target,
                          isExisting: true,
                        });
                      }}
                      className="min-h-[44px] px-4 rounded-[14px] bg-[var(--card)] border border-[var(--line)] text-[13px] font-bold text-[var(--ink)] cursor-pointer whitespace-nowrap"
                    >
                      Skip &amp; Enter Now
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4" noValidate>
                  <div>
                    <h2 className="h22 text-[var(--ink)]">Welcome back</h2>
                    <p className="text-[13.5px] text-[var(--dim)] mt-0.5">
                      Sign in with email or continue with Google.
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="eyak-login-id"
                      className="text-[13px] font-bold text-[var(--ink)]"
                    >
                      Email address
                    </label>
                    <input
                      id="eyak-login-id"
                      type="email"
                      autoComplete="username"
                      placeholder="you@example.com"
                      value={loginId}
                      onChange={(e) => {
                        setLoginId(e.target.value);
                        if (loginError) setLoginError('');
                      }}
                      className="min-h-[46px] px-3.5 rounded-[16px] bg-[var(--bg)] border-2 border-[var(--line)] focus:border-[var(--gold)] text-[15px] font-semibold text-[var(--ink)] outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <label
                        htmlFor="eyak-login-pass"
                        className="text-[13px] font-bold text-[var(--ink)]"
                      >
                        Password
                      </label>
                      <button
                        type="button"
                        disabled={authBusy}
                        onClick={() => void handleGoogleSignInOrRecover(true)}
                        className="text-[12.5px] font-bold text-[var(--gold)] hover:underline cursor-pointer whitespace-nowrap"
                      >
                        Forgot password? Recover with Google
                      </button>
                    </div>
                    <div className="relative flex items-center">
                      <input
                        id="eyak-login-pass"
                        type={showLoginPass ? 'text' : 'password'}
                        autoComplete="current-password"
                        placeholder="Your password"
                        value={loginPass}
                        onChange={(e) => {
                          setLoginPass(e.target.value);
                          if (loginError) setLoginError('');
                        }}
                        className="w-full min-h-[46px] pl-3.5 pr-11 rounded-[16px] bg-[var(--bg)] border-2 border-[var(--line)] focus:border-[var(--gold)] text-[15px] font-semibold text-[var(--ink)] outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPass((v) => !v)}
                        aria-label={showLoginPass ? 'Hide password' : 'Show password'}
                        className="absolute right-3 text-[var(--dim)] hover:text-[var(--ink)] cursor-pointer"
                      >
                        <Icon name={showLoginPass ? 'eyeOff' : 'eye'} size={18} />
                      </button>
                    </div>
                  </div>

                  {loginError && (
                    <p role="alert" className="text-[13px] font-semibold text-[var(--coral-ink)]">
                      {loginError}
                    </p>
                  )}

                  <button type="submit" disabled={authBusy} className="btn-tactile indigo w-full">
                    <span>{authBusy ? 'Signing in...' : 'Sign in'}</span>
                    <Icon name="go" size={18} className="ul-arrow" />
                  </button>

                  <div className="flex items-center gap-3 text-[12px] font-semibold text-[var(--dim)]">
                    <span className="h-px flex-1 bg-[var(--line)]" />
                    <span>or</span>
                    <span className="h-px flex-1 bg-[var(--line)]" />
                  </div>

                  <button
                    type="button"
                    disabled={authBusy}
                    onClick={() => void handleGoogleSignInOrRecover(false)}
                    className="w-full min-h-[46px] px-4 rounded-[16px] bg-[var(--bg)] border-2 border-[var(--line)] hover:border-[var(--gold)] text-[14px] font-bold text-[var(--ink)] flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <Icon name="user" size={17} className="text-[var(--gold)]" />
                    <span>Continue with Google</span>
                  </button>
                </form>
              )}
            </div>
          )}

          <div className="pt-3 border-t border-[var(--line)] text-[12.5px] text-[var(--dim)] leading-snug">
            One account per email. Recover your password anytime with Google.
          </div>
        </section>
      </div>
    </div>
  );
}

export function DxIntroScreen({
  name,
  subj,
  questionCount,
  onStartDiagnostic,
  onSkipToHome,
}: {
  name: string;
  subj: SubjectId;
  questionCount: number;
  onStartDiagnostic: () => void;
  onSkipToHome: () => void;
}) {
  return (
    <div className="max-w-[600px] mx-auto py-8 flex flex-col gap-5 anim-rise">
      <div className="rtc-eq-plate p-6 sm:p-8 flex flex-col gap-4">
        <div className="flex items-center gap-3.5">
          <div className="rounded-[18px] bg-[var(--card)] p-1.5 shrink-0">
            <StudyBuddy mood="happy" size={46} />
          </div>
          <div>
            <span className="eyebrow text-[#FFE1D1]">Placement check</span>
            <h1 className="h28 text-white">Welcome, {name}</h1>
          </div>
        </div>
        <p className="text-[15px] leading-snug text-white/90">
          {questionCount} quick {SUBJECT_INFO[subj].name} questions (~5 min) to pinpoint your starting level.
        </p>
      </div>

      <div className="rtc-card p-5 flex items-start gap-3">
        <span className="w-9 h-9 rounded-[14px] bg-[var(--acc-soft)] text-[var(--gold)] flex items-center justify-center shrink-0">
          <Icon name="bolt" size={17} />
        </span>
        <p className="text-[14px] text-[var(--dim)] leading-snug">
          <strong className="text-[var(--ink)]">No pressure:</strong> Pick your best answer — missed items go straight to revision with worked steps.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <button type="button" onClick={onStartDiagnostic} className="btn-tactile indigo w-full">
          <span>Start {SUBJECT_INFO[subj].name} placement check</span>
          <Icon name="go" size={18} className="ul-arrow" />
        </button>
        <button type="button" onClick={onSkipToHome} className="btn-tactile paper w-full">
          <span>Skip for now and go to Home</span>
        </button>
      </div>
    </div>
  );
}
