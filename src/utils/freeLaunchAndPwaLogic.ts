import type { MasteryThemeId, UserProgress } from '../types';
import { DEFAULT_MASTERY_THEME_ID, getMasteryThemeById } from '../data/masteryThemes';
import { resolveEffectiveThemeId } from './masteryThemeLogic';

/**
 * Master switch for an unrestricted Free Launch override.
 * Set to `false` so students experience the strict 5-minute demo, 1-day (24-hour) free trial
 * with live countdown & linked Google Pay / payment account (cancel anytime), and full-app
 * lock on trial expiry until subscribed via Paystack or an owner-issued Pass PIN.
 */
export const PUBLIC_FREE_LAUNCH_ACTIVE = false;

/**
 * Publicly accessible hosted Web & PWA URL for sharing with students, parents, and schools.
 */
export const CANONICAL_SHARED_APP_URL =
  'https://ais-pre-5m5y6hqcrfm7brakopopis-230466638364.europe-west2.run.app';

/**
 * Direct owner preview URL that works immediately on the owner's laptop and phone
 * (when signed in with the owner Google account) even before public link sharing is toggled on.
 */
export const OWNER_PERSONAL_APP_URL =
  'https://ais-dev-5m5y6hqcrfm7brakopopis-230466638364.europe-west2.run.app';

export type InstallPlatformKind = 'android' | 'ios' | 'desktop';

export interface InstallPlatformGuide {
  platform: InstallPlatformKind;
  isEmbeddedIframe: boolean;
  headline: string;
  steps: string[];
}

/**
 * Resolves the direct URL for the owner's own laptop & phone installation right now.
 * Preserves live hosted origins (`ais-dev-...`, `ais-pre-...`, or custom domains) so opening
 * a standalone tab or scanning the QR code always hits the live running server immediately.
 */
export function resolvePersonalInstallUrl(currentOrigin?: string | null): string {
  if (!currentOrigin || typeof currentOrigin !== 'string') {
    return OWNER_PERSONAL_APP_URL;
  }
  const trimmed = currentOrigin.trim().replace(/\/+$/, '');
  if (!trimmed) return OWNER_PERSONAL_APP_URL;

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase();
    if (host === 'localhost' || host === '127.0.0.1' || host === '[::1]') {
      return OWNER_PERSONAL_APP_URL;
    }
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return `${parsed.protocol}//${parsed.host}`;
    }
  } catch {
    return OWNER_PERSONAL_APP_URL;
  }

  return OWNER_PERSONAL_APP_URL;
}

/**
 * Resolves the canonical public URL students should open or install from.
 * Replaces localhost, loopback, or private dev-container hosts (`ais-dev-...`)
 * with the public shared app URL, while preserving custom production domains.
 */
export function resolvePublicShareUrl(currentOrigin?: string | null): string {
  if (!currentOrigin || typeof currentOrigin !== 'string') {
    return CANONICAL_SHARED_APP_URL;
  }
  const trimmed = currentOrigin.trim().replace(/\/+$/, '');
  if (!trimmed) return CANONICAL_SHARED_APP_URL;

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase();
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '[::1]' ||
      host.startsWith('ais-dev-')
    ) {
      return CANONICAL_SHARED_APP_URL;
    }
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return `${parsed.protocol}//${parsed.host}`;
    }
  } catch {
    return CANONICAL_SHARED_APP_URL;
  }

  return CANONICAL_SHARED_APP_URL;
}

/**
 * Builds a pre-filled WhatsApp share link so teachers, parents, and students
 * can forward the free Easy Learn website & installable app in one tap.
 */
export function buildWhatsAppShareHref(shareUrl: string): string {
  const cleanUrl = resolvePublicShareUrl(shareUrl);
  const message = `Study JAMB UTME & WAEC/NECO 100% free on Easy Learn — 49 subjects, all 8 JAMB & WAEC novels, CBT mock exams, virtual labs & offline installable app: ${cleanUrl}`;
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

/**
 * Detects the visitor's OS/browser family and whether the page is currently inside
 * an embedded preview iframe (where browsers require opening the direct tab to install).
 */
export function detectInstallPlatform(
  userAgent: string,
  isEmbeddedIframe = false
): InstallPlatformGuide {
  const ua = (userAgent || '').toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(ua);
  const isAndroid = /android/.test(ua);

  if (isIOS) {
    return {
      platform: 'ios',
      isEmbeddedIframe,
      headline: 'Install on iPhone or iPad (Safari)',
      steps: [
        isEmbeddedIframe
          ? 'Tap “Open Direct App Link” below in Safari first so Easy Learn opens in its own browser tab.'
          : 'Open Easy Learn in Safari on your iPhone or iPad.',
        'Tap the Share icon at the bottom of Safari, then scroll down and tap “Add to Home Screen”.',
        'Tap “Add” in the top-right corner — Easy Learn appears on your home screen as a full-screen offline app.',
      ],
    };
  }

  if (isAndroid) {
    return {
      platform: 'android',
      isEmbeddedIframe,
      headline: 'Install on Android Phone or Tablet (Chrome)',
      steps: [
        isEmbeddedIframe
          ? 'Tap “Open Direct App Link” below in Google Chrome so Android unlocks native app installation.'
          : 'Tap “Install App Now” or open Chrome’s menu (⋮) in the top-right corner.',
        'Select “Install app” (or “Add to Home screen”) and confirm.',
        'Launch Easy Learn directly from your Android app drawer — notes, novels & drills work even offline.',
      ],
    };
  }

  return {
    platform: 'desktop',
    isEmbeddedIframe,
    headline: 'Install on Windows, Mac, or Chromebook',
    steps: [
      isEmbeddedIframe
        ? 'Click “Open Direct App Link” below to open Easy Learn in a full Chrome or Edge browser tab.'
        : 'Open Easy Learn in Google Chrome or Microsoft Edge.',
      'Click the Install Easy Learn icon on the right side of your address bar (or Menu ⋮ → Cast, save, and share → Install page as app).',
      'Confirm “Install” to pin Easy Learn to your Taskbar, Dock, or Desktop with offline study support.',
    ],
  };
}

/**
 * Resolves the active MasteryThemeId during runtime:
 * When `freeLaunch` is true, all 10 colour atmospheres are unlocked for every student;
 * otherwise delegates to strict `resolveEffectiveThemeId`.
 */
export function resolveRuntimeThemeId(
  progress: Pick<UserProgress, 'themeId' | 'pro' | 'owner'>,
  freeLaunch = PUBLIC_FREE_LAUNCH_ACTIVE
): MasteryThemeId {
  if (freeLaunch) {
    return getMasteryThemeById(progress.themeId || DEFAULT_MASTERY_THEME_ID).id;
  }
  return resolveEffectiveThemeId(progress);
}

export interface InstalledAppModeSignals {
  displayModeStandalone?: boolean;
  displayModeFullscreen?: boolean;
  displayModeMinimalUi?: boolean;
  displayModeWindowControlsOverlay?: boolean;
  navigatorStandalone?: boolean;
  referrer?: string;
  search?: string;
  sessionLaunchedAsPwa?: boolean;
}

/**
 * Pure detector for whether Easy Learn is running as an installed app
 * (Android WebAPK, Google Play Trusted Web Activity, iOS Home Screen app,
 * or Windows/Mac/Chromebook installed PWA window).
 */
export function detectInstalledAppMode(signals: InstalledAppModeSignals): boolean {
  if (
    signals.displayModeStandalone ||
    signals.displayModeFullscreen ||
    signals.displayModeMinimalUi ||
    signals.displayModeWindowControlsOverlay ||
    signals.navigatorStandalone ||
    signals.sessionLaunchedAsPwa
  ) {
    return true;
  }

  const ref = (signals.referrer || '').trim().toLowerCase();
  if (ref.startsWith('android-app://')) {
    return true;
  }

  const search = (signals.search || '').trim();
  if (search) {
    try {
      const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
      const source = (params.get('source') || '').trim().toLowerCase();
      if (source === 'pwa' || source === 'twa' || source === 'app') {
        return true;
      }
    } catch {
      /* ignore malformed query string */
    }
  }

  return false;
}

