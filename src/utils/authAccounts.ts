import type { ChemClassId, SubjectId } from '../types';
import { h53 } from './engine';

export const ACCOUNTS_STORAGE_KEY = 'rtc_accounts_v1';
export const SESSION_UNLOCK_KEY = 'rtc_session_unlocked_v2';

export interface StoredScholarAccount {
  id: string;
  username: string;
  email: string;
  passwordHash: number;
  classLevel: ChemClassId;
  subjs: SubjectId[];
  target: number;
  createdAt: number;
}

export interface ValidationResult {
  ok: boolean;
  field?: 'identifier' | 'username' | 'email' | 'password' | 'otp';
  error?: string;
}

export function normalizeIdentifier(raw: string): string {
  return String(raw || '').trim().toLowerCase();
}

export function hashPasscode(password: string): number {
  return h53(`rtc-scholar-auth|${password}`, 2027);
}

export function generateScholarOtp(seedSource: string): string {
  const hash = Math.abs(h53(`rtc-otp|${normalizeIdentifier(seedSource)}`, 97));
  const num = (hash % 9000) + 1000;
  return String(num).padStart(4, '0');
}

export function validateLoginInput(identifier: string, password: string): ValidationResult {
  const cleanId = String(identifier || '').trim();
  if (!cleanId) {
    return {
      ok: false,
      field: 'identifier',
      error: 'Enter your username or email address to sign in.',
    };
  }
  if (cleanId.length < 2) {
    return {
      ok: false,
      field: 'identifier',
      error: 'Username or email must be at least 2 characters.',
    };
  }
  const cleanPass = String(password || '');
  if (!cleanPass) {
    return {
      ok: false,
      field: 'password',
      error: 'Enter your passcode to unlock your study workspace.',
    };
  }
  if (cleanPass.length < 4) {
    return {
      ok: false,
      field: 'password',
      error: 'Passcode must be at least 4 characters.',
    };
  }
  return { ok: true };
}

export function validateRegisterInput(
  username: string,
  email: string,
  password: string
): ValidationResult {
  const cleanUser = String(username || '').trim();
  if (!cleanUser) {
    return {
      ok: false,
      field: 'username',
      error: 'Enter your first name or scholar username.',
    };
  }
  if (cleanUser.length < 2) {
    return {
      ok: false,
      field: 'username',
      error: 'Name must be at least 2 characters long.',
    };
  }

  const cleanEmail = String(email || '').trim();
  if (!cleanEmail) {
    return {
      ok: false,
      field: 'email',
      error: 'Enter your email address for verification.',
    };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(cleanEmail)) {
    return {
      ok: false,
      field: 'email',
      error: 'Enter a valid email address (for example, amina@school.ng).',
    };
  }

  const cleanPass = String(password || '');
  if (!cleanPass) {
    return {
      ok: false,
      field: 'password',
      error: 'Create a passcode of at least 4 characters.',
    };
  }
  if (cleanPass.length < 4) {
    return {
      ok: false,
      field: 'password',
      error: 'Passcode must be at least 4 characters long.',
    };
  }

  return { ok: true };
}

export function validateOtpCode(enteredDigits: string[], expectedCode: string): ValidationResult {
  const joined = enteredDigits.map((d) => String(d || '').trim()).join('');
  if (joined.length < 4 || !/^\d{4}$/.test(joined)) {
    return {
      ok: false,
      field: 'otp',
      error: 'Enter all 4 verification digits.',
    };
  }
  if (joined !== expectedCode) {
    return {
      ok: false,
      field: 'otp',
      error: 'That 4-digit code does not match. Check your studio passcode and try again.',
    };
  }
  return { ok: true };
}

export function parseAccountsJson(raw: string | null): StoredScholarAccount[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is StoredScholarAccount =>
        Boolean(
          x &&
            typeof x.username === 'string' &&
            typeof x.email === 'string' &&
            typeof x.passwordHash === 'number'
        )
    );
  } catch {
    return [];
  }
}

export function loadAccounts(): StoredScholarAccount[] {
  if (typeof window === 'undefined') return [];
  try {
    return parseAccountsJson(window.localStorage.getItem(ACCOUNTS_STORAGE_KEY));
  } catch {
    return [];
  }
}

export function saveAccounts(accounts: StoredScholarAccount[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  } catch {
    /* ignore storage quota errors */
  }
}

export function findAccountByIdentifier(
  accounts: StoredScholarAccount[],
  identifier: string
): StoredScholarAccount | undefined {
  const norm = normalizeIdentifier(identifier);
  if (!norm) return undefined;
  return accounts.find(
    (acc) =>
      normalizeIdentifier(acc.username) === norm || normalizeIdentifier(acc.email) === norm
  );
}

export function authenticateAccount(
  accounts: StoredScholarAccount[],
  identifier: string,
  password: string,
  fallbackSavedName?: string
): {
  ok: boolean;
  account?: StoredScholarAccount;
  matchedLegacyProfile?: boolean;
  error?: string;
} {
  const validation = validateLoginInput(identifier, password);
  if (!validation.ok) {
    return { ok: false, error: validation.error };
  }

  const found = findAccountByIdentifier(accounts, identifier);
  if (found) {
    if (found.passwordHash !== hashPasscode(password)) {
      return {
        ok: false,
        error: 'Incorrect passcode for this scholar account. Try again or tap Forgot passcode.',
      };
    }
    return { ok: true, account: found };
  }

  // Allow seamless sign-in for returning localStorage scholars created before accounts v1
  if (
    fallbackSavedName &&
    normalizeIdentifier(fallbackSavedName) === normalizeIdentifier(identifier)
  ) {
    return { ok: true, matchedLegacyProfile: true };
  }

  if (accounts.length === 0 && !fallbackSavedName) {
    return {
      ok: false,
      error: 'No scholar account found yet. Click Sign Up to register in seconds.',
    };
  }

  return {
    ok: false,
    error: 'We could not find that username or email. Check spelling or click Sign Up.',
  };
}

export function findAccountByEmail(
  accounts: StoredScholarAccount[],
  email: string
): StoredScholarAccount | undefined {
  const norm = normalizeIdentifier(email);
  if (!norm) return undefined;
  return accounts.find((acc) => normalizeIdentifier(acc.email) === norm);
}

export function registerAccountStrict(
  existing: StoredScholarAccount[],
  input: {
    username: string;
    email: string;
    password: string;
    classLevel: ChemClassId;
    subjs: SubjectId[];
    target: number;
    nowMs?: number;
  }
):
  | {
      ok: false;
      duplicateEmail: true;
      existingAccount: StoredScholarAccount;
      error: string;
    }
  | {
      ok: true;
      duplicateEmail: false;
      accounts: StoredScholarAccount[];
      account: StoredScholarAccount;
    } {
  const cleanEmail = input.email.trim().toLowerCase();
  const duplicate = findAccountByEmail(existing, cleanEmail);
  if (duplicate) {
    return {
      ok: false,
      duplicateEmail: true,
      existingAccount: duplicate,
      error: `An Easy Learn account already exists for ${cleanEmail}. Please sign in below, or use Google to recover your password.`,
    };
  }
  const built = buildRegisteredAccount(existing, input);
  return {
    ok: true,
    duplicateEmail: false,
    accounts: built.accounts,
    account: built.account,
  };
}

export function resetAccountPasswordWithGoogle(
  existing: StoredScholarAccount[],
  input: {
    email: string;
    newPassword?: string;
    displayName?: string;
    classLevel?: ChemClassId;
    subjs?: SubjectId[];
    target?: number;
    nowMs?: number;
  }
): { accounts: StoredScholarAccount[]; account: StoredScholarAccount } {
  const cleanEmail = input.email.trim().toLowerCase();
  const existingMatch = findAccountByEmail(existing, cleanEmail);
  const now = input.nowMs || Date.now();
  const resolvedName =
    existingMatch?.username ||
    (input.displayName || '').trim() ||
    cleanEmail.split('@')[0] ||
    'Scholar';
  const nextPasswordHash =
    typeof input.newPassword === 'string' && input.newPassword.length >= 4
      ? hashPasscode(input.newPassword)
      : existingMatch?.passwordHash ?? hashPasscode(`google-oauth-${cleanEmail}-${now}`);

  const updatedAccount: StoredScholarAccount = {
    id: existingMatch?.id || `sch_${Math.abs(h53(cleanEmail, now))}`,
    username: resolvedName,
    email: cleanEmail,
    passwordHash: nextPasswordHash,
    classLevel: existingMatch?.classLevel || input.classLevel || 'all',
    subjs: existingMatch?.subjs?.length
      ? existingMatch.subjs
      : input.subjs?.length
        ? input.subjs
        : ['eng', 'maths'],
    target: existingMatch?.target || input.target || 75,
    createdAt: existingMatch?.createdAt || now,
  };

  const rest = existing.filter((a) => normalizeIdentifier(a.email) !== cleanEmail);
  return {
    accounts: [updatedAccount, ...rest].slice(0, 20),
    account: updatedAccount,
  };
}

export function buildRegisteredAccount(
  existing: StoredScholarAccount[],
  input: {
    username: string;
    email: string;
    password: string;
    classLevel: ChemClassId;
    subjs: SubjectId[];
    target: number;
    nowMs?: number;
  }
): { accounts: StoredScholarAccount[]; account: StoredScholarAccount } {
  const cleanUsername = input.username.trim();
  const cleanEmail = input.email.trim().toLowerCase();
  const account: StoredScholarAccount = {
    id: `sch_${Math.abs(h53(cleanEmail || cleanUsername, input.nowMs || Date.now()))}`,
    username: cleanUsername,
    email: cleanEmail,
    passwordHash: hashPasscode(input.password),
    classLevel: input.classLevel,
    subjs: input.subjs,
    target: input.target,
    createdAt: input.nowMs || Date.now(),
  };

  const filtered = existing.filter(
    (a) =>
      normalizeIdentifier(a.email) !== normalizeIdentifier(cleanEmail) &&
      normalizeIdentifier(a.username) !== normalizeIdentifier(cleanUsername)
  );
  const next = [account, ...filtered].slice(0, 20);
  return { accounts: next, account };
}

export function isSessionUnlocked(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.sessionStorage.getItem(SESSION_UNLOCK_KEY) === '1';
  } catch {
    return false;
  }
}

export function setSessionUnlocked(): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(SESSION_UNLOCK_KEY, '1');
  } catch {
    /* ignore */
  }
}

export function clearSessionUnlock(): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.removeItem(SESSION_UNLOCK_KEY);
  } catch {
    /* ignore */
  }
}
