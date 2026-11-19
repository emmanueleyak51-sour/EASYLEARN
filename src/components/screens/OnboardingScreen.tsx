import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { ChemClassId, SubjectId } from '../../types';
import { CHEM_CLASSES } from '../../data/chemNerdc2027';
import { SUBJECT_IDS } from '../../data/curriculum';
import { SUBJECT_INFO } from '../../utils/engine';
import {
  authenticateAccount,
  buildRegisteredAccount,
  findAccountByIdentifier,
  generateScholarOtp,
  loadAccounts,
  saveAccounts,
  setSessionUnlocked,
  validateOtpCode,
  validateRegisterInput,
} from '../../utils/authAccounts';
import { AdirePattern, CrestSvg, Icon } from '../Icons';

type AuthStage = 'split' | 'otp' | 'verified';
type SplitMode = 'login' | 'register';

interface PendingScholarPayload {
  name: string;
  email: string;
  subjs: SubjectId[];
  classLevel: ChemClassId;
  target: number;
  otpCode: string;
  reason: 'register' | 'recovery';
  passwordToSave?: string;
}

const CONFETTI_SPECS = [
  { left: '12%', delay: '0s', bg: '#10B981' },
  { left: '22%', delay: '0.08s', bg: '#FFD84D' },
  { left: '34%', delay: '0.04s', bg: '#3B82F6' },
  { left: '46%', delay: '0.12s', bg: '#F59E0B' },
  { left: '58%', delay: '0.02s', bg: '#10B981' },
  { left: '70%', delay: '0.10s', bg: '#EC4899' },
  { left: '82%', delay: '0.06s', bg: '#FFD84D' },
  { left: '90%', delay: '0.14s', bg: '#06B6D4' },
];

export function WelcomeScreen({
  initialName,
  initialSubjs,
  initialClassLevel = 'ss1',
  initialTarget,
  onComplete,
  onAuthenticated,
  onSkipToDemo,
}: {
  initialName: string;
  initialSubjs: SubjectId[];
  initialClassLevel?: ChemClassId;
  initialTarget: number;
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
}) {
  const accounts = useMemo(() => loadAccounts(), []);
  const hasReturningScholar = Boolean(initialName.trim() || accounts.length > 0);

  const [stage, setStage] = useState<AuthStage>('split');
  const [mode, setMode] = useState<SplitMode>('login');

  // Login state
  const [loginId, setLoginId] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register state
  const [regName, setRegName] = useState(initialName || '');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [showRegPass, setShowRegPass] = useState(false);
  const [classLevel, setClassLevel] = useState<ChemClassId>(initialClassLevel || 'ss1');
  const [subjs, setSubjs] = useState<SubjectId[]>(
    initialSubjs.length ? initialSubjs : [...SUBJECT_IDS]
  );
  const [target] = useState<number>(initialTarget || 75);
  const [regError, setRegError] = useState('');

  // OTP & Verified state
  const [pending, setPending] = useState<PendingScholarPayload | null>(null);
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [otpShake, setOtpShake] = useState(false);
  const [verifiedPayload, setVerifiedPayload] = useState<{
    name: string;
    subjs: SubjectId[];
    classLevel: ChemClassId;
    target: number;
    isExisting: boolean;
  } | null>(null);

  const otpRefs = [
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
  ];

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

  useEffect(() => {
    if (stage !== 'verified' || !verifiedPayload) return;
    const timer = window.setTimeout(() => {
      finalizeEntry(verifiedPayload);
    }, 950);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, verifiedPayload]);

  useEffect(() => {
    if (stage === 'otp') {
      window.setTimeout(() => otpRefs[0].current?.focus(), 60);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  const toggleSubj = (sid: SubjectId) => {
    setSubjs((prev) => {
      if (prev.includes(sid)) {
        return prev.length > 1 ? prev.filter((x) => x !== sid) : prev;
      }
      return SUBJECT_IDS.filter((id) => id === sid || prev.includes(id));
    });
  };

  const switchSplitMode = (nextMode: SplitMode) => {
    setLoginError('');
    setRegError('');
    setMode(nextMode);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentAccounts = loadAccounts();
    const res = authenticateAccount(currentAccounts, loginId, loginPass, initialName);
    if (!res.ok) {
      setLoginError(res.error || 'Please check your credentials and try again.');
      return;
    }
    setLoginError('');
    const acc = res.account;
    setVerifiedPayload({
      name: acc ? acc.username : initialName.trim() || loginId.trim(),
      subjs: acc?.subjs?.length ? acc.subjs : subjs,
      classLevel: acc?.classLevel || classLevel,
      target: acc?.target || target,
      isExisting: true,
    });
    setStage('verified');
  };

  const handleForgotPasscode = () => {
    const clean = loginId.trim() || initialName.trim() || accounts[0]?.email || '';
    if (!clean) {
      setLoginError('Enter your username or email first so we can generate a 4-digit recovery code.');
      return;
    }
    const currentAccounts = loadAccounts();
    const found = findAccountByIdentifier(currentAccounts, clean);
    const scholarName = found?.username || initialName.trim() || clean;
    const otpCode = generateScholarOtp(found?.email || scholarName);
    setLoginError('');
    setOtpDigits(['', '', '', '']);
    setOtpError('');
    setPending({
      name: scholarName,
      email: found?.email || `${scholarName.toLowerCase().replace(/\s+/g, '')}@campus.ng`,
      subjs: found?.subjs?.length ? found.subjs : subjs,
      classLevel: found?.classLevel || classLevel,
      target: found?.target || target,
      otpCode,
      reason: 'recovery',
    });
    setStage('otp');
  };

  const handleResumeSavedScholar = () => {
    const fallbackAcc = accounts[0];
    const resolvedName = initialName.trim() || fallbackAcc?.username || 'Scholar';
    setVerifiedPayload({
      name: resolvedName,
      subjs: initialSubjs.length ? initialSubjs : fallbackAcc?.subjs || [...SUBJECT_IDS],
      classLevel: initialClassLevel || fallbackAcc?.classLevel || 'ss1',
      target: initialTarget || fallbackAcc?.target || 75,
      isExisting: true,
    });
    setStage('verified');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateRegisterInput(regName, regEmail, regPass);
    if (!check.ok) {
      setRegError(check.error || 'Complete all registration fields.');
      return;
    }
    setRegError('');
    const otpCode = generateScholarOtp(regEmail);
    setOtpDigits(['', '', '', '']);
    setOtpError('');
    setPending({
      name: regName.trim(),
      email: regEmail.trim().toLowerCase(),
      subjs,
      classLevel,
      target,
      otpCode,
      reason: 'register',
      passwordToSave: regPass,
    });
    setStage('otp');
  };

  const handleOtpDigitChange = (idx: number, rawVal: string) => {
    const clean = rawVal.replace(/\D/g, '');
    if (clean.length > 1) {
      // Handle multi-digit paste/autofill
      const chars = clean.slice(0, 4).split('');
      const next = ['', '', '', ''];
      chars.forEach((c, i) => {
        next[i] = c;
      });
      setOtpDigits(next);
      setOtpError('');
      const focusIdx = Math.min(3, chars.length - 1);
      otpRefs[focusIdx].current?.focus();
      return;
    }

    const digit = clean.slice(-1);
    const next = [...otpDigits];
    next[idx] = digit;
    setOtpDigits(next);
    if (otpError) setOtpError('');
    if (digit && idx < 3) {
      otpRefs[idx + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[idx] && idx > 0) {
      otpRefs[idx - 1].current?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (!pasted) return;
    e.preventDefault();
    const next = ['', '', '', ''];
    pasted.split('').forEach((ch, idx) => {
      next[idx] = ch;
    });
    setOtpDigits(next);
    setOtpError('');
    otpRefs[Math.min(3, pasted.length - 1)].current?.focus();
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pending) return;
    const res = validateOtpCode(otpDigits, pending.otpCode);
    if (!res.ok) {
      setOtpError(res.error || 'Invalid 4-digit verification code.');
      setOtpShake(true);
      window.setTimeout(() => setOtpShake(false), 420);
      return;
    }

    if (pending.reason === 'register' && pending.passwordToSave) {
      const current = loadAccounts();
      const { accounts: updated } = buildRegisteredAccount(current, {
        username: pending.name,
        email: pending.email,
        password: pending.passwordToSave,
        classLevel: pending.classLevel,
        subjs: pending.subjs,
        target: pending.target,
      });
      saveAccounts(updated);
    }

    setOtpError('');
    setVerifiedPayload({
      name: pending.name,
      subjs: pending.subjs,
      classLevel: pending.classLevel,
      target: pending.target,
      isExisting: pending.reason === 'recovery',
    });
    setStage('verified');
  };

  // ── Stage 2: 4-Digit OTP Verification Card (LxImXhpwC_g) ──
  if (stage === 'otp' && pending) {
    return (
      <div className="min-h-[82vh] flex flex-col items-center justify-center py-6 px-4">
        <section
          aria-label="4-digit scholar verification"
          className={`w-full max-w-[460px] rounded-[26px] bg-[var(--card)] border-2 border-[var(--gold)] shadow-[0_0_32px_var(--acc-glow)] p-6 sm:p-8 flex flex-col items-center text-center gap-5 anim-rise ${
            otpShake ? 'anim-shake' : ''
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-[var(--acc-soft)] border border-[var(--acc-line)] text-[var(--gold)] flex items-center justify-center">
            <Icon name="shield" size={32} />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="eyebrow text-[var(--gold)]">Identity Check</span>
            <h1 className="h26 text-[var(--ink)]">OTP Verification</h1>
            <p className="text-[14px] text-[var(--dim)] leading-relaxed">
              Enter the 4-digit studio code generated for{' '}
              <strong className="text-[var(--ink)]">{pending.email}</strong>
            </p>
          </div>

          {/* Instant local studio passcode helper so offline learners are never blocked */}
          <div className="w-full rounded-xl bg-[var(--bg)] border border-[var(--line)] px-3.5 py-2.5 flex items-center justify-between gap-2 text-[13px]">
            <span className="text-[var(--dim)]">
              Studio code:{' '}
              <strong className="font-mono text-[15px] tracking-widest text-[var(--gold)] tabular-nums">
                {pending.otpCode}
              </strong>
            </span>
            <button
              type="button"
              onClick={() => {
                setOtpDigits(pending.otpCode.split(''));
                setOtpError('');
              }}
              className="px-2.5 py-1 rounded-lg bg-[var(--acc-soft)] text-[var(--gold)] font-bold text-[12px] hover:brightness-95 cursor-pointer whitespace-nowrap"
            >
              Auto-fill code
            </button>
          </div>

          <form onSubmit={handleVerifyOtp} className="w-full flex flex-col items-center gap-5" noValidate>
            <div className="flex items-center justify-center gap-3" role="group" aria-label="4-digit verification code">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={otpRefs[idx]}
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  aria-label={`Verification digit ${idx + 1}`}
                  value={digit}
                  onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  onPaste={handleOtpPaste}
                  className={`rtc-otp-box ${digit ? 'is-filled' : ''}`}
                />
              ))}
            </div>

            {otpError && (
              <p role="alert" className="text-[13px] font-semibold text-[var(--coral-ink)]">
                {otpError}
              </p>
            )}

            <button type="submit" className="rtc-auth-pill-cta">
              <span>Verify &amp; Unlock Studio</span>
              <Icon name="check" size={18} />
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setStage('split');
              setOtpError('');
            }}
            className="text-[13px] font-bold text-[var(--dim)] hover:text-[var(--gold)] cursor-pointer"
          >
            Back to {pending.reason === 'register' ? 'Registration' : 'Sign In'}
          </button>
        </section>
      </div>
    );
  }

  // ── Stage 3: Successfully Verified! Emerald Checkmark & Confetti (LxImXhpwC_g) ──
  if (stage === 'verified' && verifiedPayload) {
    return (
      <div className="min-h-[82vh] flex flex-col items-center justify-center py-6 px-4">
        <section
          aria-label="Verification complete"
          className="relative overflow-hidden w-full max-w-[460px] rounded-[26px] bg-[var(--card)] border-2 border-[#10B981] shadow-[0_0_38px_rgba(16,185,129,0.28)] p-7 sm:p-9 flex flex-col items-center text-center gap-5 anim-rise"
        >
          {/* Celebratory confetti burst */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            {CONFETTI_SPECS.map((c, idx) => (
              <span
                key={idx}
                className="confetti-piece"
                style={{
                  left: c.left,
                  top: '-10px',
                  backgroundColor: c.bg,
                  animationDelay: c.delay,
                }}
              />
            ))}
          </div>

          <div className="rtc-verified-orb w-20 h-20 rounded-full bg-[#10B981] text-white flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 13l4.5 4.5L19 7.5"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="rtc-verified-stroke"
              />
            </svg>
          </div>

          <div className="flex flex-col gap-1.5 relative z-10">
            <span className="eyebrow text-[#10B981]">Identity Confirmed</span>
            <h1 className="h28 text-[var(--ink)]">Successfully Verified!</h1>
            <p className="text-[14.5px] text-[var(--dim)] leading-relaxed">
              Welcome, <strong className="text-[var(--ink)]">{verifiedPayload.name}</strong>. Opening your{' '}
              {verifiedPayload.subjs.length}-subject National Learning Studio...
            </p>
          </div>

          <button
            type="button"
            onClick={() => finalizeEntry(verifiedPayload)}
            className="rtc-auth-pill-cta relative z-10"
          >
            <span>Enter Studio Now</span>
            <Icon name="go" size={18} />
          </button>
        </section>
      </div>
    );
  }

  // ── Stage 1: Diagonal Sweeping Split-Panel Login / Register Card (ITWVROnwt_s) ──
  const isRegister = mode === 'register';

  return (
    <div className="min-h-[84vh] flex flex-col items-center justify-center py-4 px-2 sm:px-4">
      <div className={`rtc-auth-shell ${isRegister ? 'is-register' : ''}`}>
        {/* Sweeping Diagonal Hero Curtain */}
        <div className="rtc-auth-curtain" aria-hidden="true">
          <AdirePattern />
        </div>

        <div className="relative z-10 grid grid-cols-1 min-[820px]:grid-cols-12 min-h-[540px]">
          {!isRegister ? (
            <>
              {/* LEFT PANEL: Login Form */}
              <section
                aria-label="Scholar Sign In"
                className="min-[820px]:col-span-6 p-6 sm:p-9 min-[820px]:pr-11 flex flex-col justify-between gap-5"
              >
                <form
                  key="login-form"
                  onSubmit={handleLoginSubmit}
                  className="flex flex-col gap-5 my-auto"
                  noValidate
                >
                  <div className="rtc-auth-stagger-1">
                    <span className="eyebrow text-[var(--gold)]">Scholar Portal</span>
                    <h1 className="font-[var(--display)] font-extrabold text-[30px] leading-tight text-[var(--ink)] mt-1">
                      Login
                    </h1>
                    <p className="text-[13.5px] text-[var(--dim)] mt-1">
                      Sign in to sync your mastery across all 12 SS1–SS3 subjects.
                    </p>
                  </div>

                  {hasReturningScholar && (
                    <button
                      type="button"
                      onClick={handleResumeSavedScholar}
                      className="rtc-auth-stagger-2 w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-[var(--acc-soft)] border border-[var(--acc-line)] text-[var(--gold)] text-[13px] font-bold flex items-center justify-between gap-2 hover:brightness-95 transition cursor-pointer"
                    >
                      <span className="truncate">
                        Continue as {initialName.trim() || accounts[0]?.username}
                      </span>
                      <Icon name="go" size={16} className="shrink-0" />
                    </button>
                  )}

                  <div className="rtc-auth-field rtc-auth-stagger-2">
                    <input
                      id="rtc-login-id"
                      type="text"
                      placeholder=" "
                      autoComplete="username"
                      value={loginId}
                      onChange={(e) => {
                        setLoginId(e.target.value);
                        if (loginError) setLoginError('');
                      }}
                      className="rtc-auth-input"
                    />
                    <label htmlFor="rtc-login-id" className="rtc-auth-label">
                      Username or Email
                    </label>
                    <span className="rtc-auth-icon" aria-hidden="true">
                      <Icon name="user" size={18} />
                    </span>
                  </div>

                  <div className="rtc-auth-field rtc-auth-stagger-3">
                    <input
                      id="rtc-login-pass"
                      type={showLoginPass ? 'text' : 'password'}
                      placeholder=" "
                      autoComplete="current-password"
                      value={loginPass}
                      onChange={(e) => {
                        setLoginPass(e.target.value);
                        if (loginError) setLoginError('');
                      }}
                      className="rtc-auth-input"
                    />
                    <label htmlFor="rtc-login-pass" className="rtc-auth-label">
                      Passcode
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowLoginPass((v) => !v)}
                      aria-label={showLoginPass ? 'Hide passcode' : 'Show passcode'}
                      className="rtc-auth-icon cursor-pointer hover:text-[var(--gold)]"
                    >
                      <Icon name={showLoginPass ? 'eyeOff' : 'eye'} size={18} />
                    </button>
                  </div>

                  <div className="rtc-auth-stagger-3 flex items-center justify-end -mt-2">
                    <button
                      type="button"
                      onClick={handleForgotPasscode}
                      className="text-[12.5px] font-bold text-[var(--dim)] hover:text-[var(--gold)] cursor-pointer"
                    >
                      Forgot passcode? Verify via OTP
                    </button>
                  </div>

                  {loginError && (
                    <p role="alert" className="text-[13px] font-semibold text-[var(--coral-ink)]">
                      {loginError}
                    </p>
                  )}

                  <div className="rtc-auth-stagger-4 flex flex-col gap-3 pt-1">
                    <button type="submit" className="rtc-auth-pill-cta">
                      <span>Login</span>
                      <Icon name="go" size={18} />
                    </button>

                    <p className="text-center text-[13.5px] text-[var(--dim)]">
                      Don&apos;t have an account?{' '}
                      <button
                        type="button"
                        onClick={() => switchSplitMode('register')}
                        className="font-extrabold text-[var(--gold)] hover:underline cursor-pointer"
                      >
                        Sign Up
                      </button>
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setSessionUnlocked();
                        onSkipToDemo();
                      }}
                      className="text-center text-[12.5px] font-bold text-[var(--dim)] hover:text-[var(--ink)] py-1 cursor-pointer"
                    >
                      Or explore sample workspace right away
                    </button>
                  </div>
                </form>
              </section>

              {/* RIGHT PANEL: Diagonal Welcome Back Hero */}
              <aside className="min-[820px]:col-span-6 relative p-6 sm:p-9 flex flex-col justify-between text-white adire-panel min-[820px]:bg-transparent min-[820px]:border-0 min-[820px]:shadow-none">
                <div className="min-[820px]:hidden">
                  <AdirePattern />
                </div>
                <div className="relative z-10 flex items-center justify-end gap-3 rtc-auth-hero-right">
                  <div className="text-right">
                    <div className="font-[var(--display)] font-extrabold text-[20px] leading-tight tracking-[0.05em] text-white">
                      EYAK
                    </div>
                    <div className="text-[12px] font-semibold text-white/80">
                      National Learning Studio
                    </div>
                  </div>
                  <CrestSvg size={42} />
                </div>

                <div className="relative z-10 my-auto min-[820px]:pl-10 min-[820px]:text-right flex flex-col gap-3 rtc-auth-hero-right">
                  <span className="text-[11px] font-extrabold tracking-widest uppercase text-[#FFD84D]">
                    SS1 – SS3 Mastery
                  </span>
                  <h2 className="font-[var(--display)] font-extrabold text-[32px] leading-[1.08] text-white text-balance">
                    WELCOME BACK!
                  </h2>
                  <p className="text-[14.5px] leading-relaxed text-white/90 min-[820px]:ml-auto max-w-[300px]">
                    Pick up right where you left off across Mathematics, Further Maths, Sciences, Digital Tech, Data Processing, Geography, Economics, English, and Civic Education.
                  </p>
                </div>

                <div className="relative z-10 flex items-center min-[820px]:justify-end gap-2 text-[12px] font-semibold text-white/80 rtc-auth-hero-right">
                  <span>12 Core Subjects</span>
                  <span aria-hidden="true">·</span>
                  <span>360 Topics</span>
                  <span aria-hidden="true">·</span>
                  <span>AI Voice Mentors</span>
                </div>
              </aside>
            </>
          ) : (
            <>
              {/* LEFT PANEL: Diagonal Welcome Hero (Swept Left!) */}
              <aside className="min-[820px]:col-span-5 relative p-6 sm:p-8 min-[820px]:pr-10 flex flex-col justify-between text-white adire-panel min-[820px]:bg-transparent min-[820px]:border-0 min-[820px]:shadow-none order-2 min-[820px]:order-1">
                <div className="min-[820px]:hidden">
                  <AdirePattern />
                </div>
                <div className="relative z-10 flex items-center gap-3 rtc-auth-hero-left">
                  <CrestSvg size={42} />
                  <div>
                    <div className="font-[var(--display)] font-extrabold text-[20px] leading-tight tracking-[0.05em] text-white">
                      EYAK
                    </div>
                    <div className="text-[12px] font-semibold text-white/80">
                      National Learning Studio
                    </div>
                  </div>
                </div>

                <div className="relative z-10 my-auto flex flex-col gap-3 rtc-auth-hero-left">
                  <span className="text-[11px] font-extrabold tracking-widest uppercase text-[#FFD84D]">
                    New Scholar Account
                  </span>
                  <h2 className="font-[var(--display)] font-extrabold text-[30px] leading-[1.08] text-white text-balance">
                    WELCOME!
                  </h2>
                  <p className="text-[13.5px] leading-relaxed text-white/90 max-w-[235px]">
                    Create your personal study profile, select your class level &amp; subjects, and verify with a 4-digit code.
                  </p>
                </div>

                <div className="relative z-10 flex items-center gap-2 text-[12px] font-semibold text-white/80 rtc-auth-hero-left">
                  <span>Light &amp; Dark Themes</span>
                  <span aria-hidden="true">·</span>
                  <span>Offline Ready</span>
                </div>
              </aside>

              {/* RIGHT PANEL: Register Form */}
              <section
                aria-label="Scholar Registration"
                className="min-[820px]:col-span-7 p-6 sm:p-8 min-[820px]:pl-11 flex flex-col justify-between order-1 min-[820px]:order-2"
              >
                <form
                  key="register-form"
                  onSubmit={handleRegisterSubmit}
                  className="flex flex-col gap-3.5 my-auto"
                  noValidate
                >
                  <div className="rtc-auth-stagger-1">
                    <span className="eyebrow text-[var(--gold)]">Create Profile</span>
                    <h1 className="font-[var(--display)] font-extrabold text-[28px] leading-tight text-[var(--ink)]">
                      Register
                    </h1>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rtc-auth-stagger-2">
                    <div className="rtc-auth-field">
                      <input
                        id="rtc-reg-name"
                        type="text"
                        placeholder=" "
                        autoComplete="given-name"
                        value={regName}
                        onChange={(e) => {
                          setRegName(e.target.value);
                          if (regError) setRegError('');
                        }}
                        className="rtc-auth-input"
                      />
                      <label htmlFor="rtc-reg-name" className="rtc-auth-label">
                        First Name / Username
                      </label>
                      <span className="rtc-auth-icon" aria-hidden="true">
                        <Icon name="user" size={17} />
                      </span>
                    </div>

                    <div className="rtc-auth-field">
                      <input
                        id="rtc-reg-email"
                        type="email"
                        placeholder=" "
                        autoComplete="email"
                        value={regEmail}
                        onChange={(e) => {
                          setRegEmail(e.target.value);
                          if (regError) setRegError('');
                        }}
                        className="rtc-auth-input"
                      />
                      <label htmlFor="rtc-reg-email" className="rtc-auth-label">
                        Email Address
                      </label>
                      <span className="rtc-auth-icon" aria-hidden="true">
                        <Icon name="mail" size={17} />
                      </span>
                    </div>
                  </div>

                  <div className="rtc-auth-field rtc-auth-stagger-3">
                    <input
                      id="rtc-reg-pass"
                      type={showRegPass ? 'text' : 'password'}
                      placeholder=" "
                      autoComplete="new-password"
                      value={regPass}
                      onChange={(e) => {
                        setRegPass(e.target.value);
                        if (regError) setRegError('');
                      }}
                      className="rtc-auth-input"
                    />
                    <label htmlFor="rtc-reg-pass" className="rtc-auth-label">
                      Create Passcode (4+ chars)
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowRegPass((v) => !v)}
                      aria-label={showRegPass ? 'Hide passcode' : 'Show passcode'}
                      className="rtc-auth-icon cursor-pointer hover:text-[var(--gold)]"
                    >
                      <Icon name={showRegPass ? 'eyeOff' : 'eye'} size={17} />
                    </button>
                  </div>

                  {/* Compact Class Level Selector */}
                  <div className="flex flex-col gap-1.5 rtc-auth-stagger-3">
                    <span className="text-[12px] font-bold text-[var(--dim)]">Class level</span>
                    <div className="grid grid-cols-4 gap-1.5" role="group" aria-label="Select class level">
                      {CHEM_CLASSES.map((cls) => {
                        const active = classLevel === cls.id;
                        return (
                          <button
                            key={cls.id}
                            type="button"
                            aria-pressed={active}
                            onClick={() => setClassLevel(cls.id)}
                            className={`min-h-[36px] px-2 rounded-xl border text-[12px] font-bold transition cursor-pointer whitespace-nowrap ${
                              active
                                ? 'bg-[var(--gold)] text-[var(--on-acc)] border-[var(--gold)]'
                                : 'bg-[var(--bg)] text-[var(--dim)] border-[var(--line)] hover:text-[var(--ink)]'
                            }`}
                          >
                            {cls.shortLabel}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Compact 12-Subject Grid */}
                  <div className="flex flex-col gap-1.5 rtc-auth-stagger-4">
                    <span className="text-[12px] font-bold text-[var(--dim)]">
                      Active subjects ({subjs.length}/{SUBJECT_IDS.length})
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5" role="group" aria-label="Select active subjects">
                      {SUBJECT_IDS.map((sid) => {
                        const active = subjs.includes(sid);
                        return (
                          <button
                            key={sid}
                            type="button"
                            aria-pressed={active}
                            onClick={() => toggleSubj(sid)}
                            className={`min-h-[38px] px-2 rounded-xl border text-[12px] font-bold flex items-center justify-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
                              active
                                ? 'bg-[var(--acc-soft)] border-[var(--gold)] text-[var(--gold)]'
                                : 'bg-[var(--bg)] border-[var(--line)] text-[var(--dim)] hover:text-[var(--ink)]'
                            }`}
                          >
                            <Icon name={SUBJECT_INFO[sid].icon} size={13} className="shrink-0" />
                            <span>{SUBJECT_INFO[sid].compact}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {regError && (
                    <p role="alert" className="text-[13px] font-semibold text-[var(--coral-ink)]">
                      {regError}
                    </p>
                  )}

                  <div className="rtc-auth-stagger-5 flex flex-col gap-2.5 pt-1">
                    <button type="submit" className="rtc-auth-pill-cta">
                      <span>Register &amp; Send OTP</span>
                      <Icon name="go" size={18} />
                    </button>
                    <p className="text-center text-[13px] text-[var(--dim)]">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => switchSplitMode('login')}
                        className="font-extrabold text-[var(--gold)] hover:underline cursor-pointer"
                      >
                        Sign In
                      </button>
                    </p>
                  </div>
                </form>
              </section>
            </>
          )}
        </div>
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
    <div className="max-w-[600px] mx-auto py-8 flex flex-col gap-6 anim-rise">
      <div className="adire-panel rounded-[26px] p-7 sm:p-8 flex flex-col gap-4">
        <AdirePattern />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center text-[#FFD84D]">
            <Icon name="target" size={26} />
          </div>
          <div>
            <span className="eyebrow text-[#FFD84D]">Quick check</span>
            <h1 className="h28 text-white">Welcome, {name}</h1>
          </div>
        </div>
        <p className="relative z-10 text-[16px] leading-relaxed text-white/90">
          Before you dive in, let’s run a {questionCount}-question {SUBJECT_INFO[subj].name} diagnostic. It takes about 5 minutes and sets your starting mastery baseline across the syllabus.
        </p>
      </div>

      <div className="rounded-2xl bg-[var(--card)] border border-[var(--line)] shadow-[0_3px_0_var(--line)] p-5 flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <span className="w-8 h-8 rounded-xl bg-[var(--acc-soft)] text-[var(--gold)] flex items-center justify-center shrink-0">
            <Icon name="bolt" size={16} />
          </span>
          <div className="text-[14px] text-[var(--dim)] leading-relaxed">
            <strong className="text-[var(--ink)]">No pressure:</strong> If you don’t know one yet, pick your best idea — we’ll queue the missed ones for spaced review and teach them step by step.
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button type="button" onClick={onStartDiagnostic} className="btn-tactile indigo w-full">
          <span>Start {SUBJECT_INFO[subj].name} diagnostic</span>
          <Icon name="go" size={18} />
        </button>
        <button type="button" onClick={onSkipToHome} className="btn-tactile paper w-full">
          <span>Skip diagnostic and go to Home</span>
        </button>
      </div>
    </div>
  );
}
