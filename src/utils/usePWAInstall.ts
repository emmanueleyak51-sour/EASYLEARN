import { useEffect, useMemo, useState } from 'react';
import {
  buildWhatsAppShareHref,
  detectInstallPlatform,
  detectInstalledAppMode,
  resolvePersonalInstallUrl,
  resolvePublicShareUrl,
  type InstallPlatformGuide,
} from './freeLaunchAndPwaLogic';

const PWA_SESSION_FLAG_KEY = 'eyak_pwa_launched_v1';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

let sharedDeferredPrompt: BeforeInstallPromptEvent | null = null;
let sharedIsInstalled = false;
let earlyCaptureAttached = false;
const listeners = new Set<() => void>();

function notifyListeners() {
  for (const fn of listeners) {
    fn();
  }
}

export function isStandaloneAppMode(): boolean {
  if (typeof window === 'undefined') return false;

  let sessionLaunchedAsPwa = false;
  try {
    sessionLaunchedAsPwa = window.sessionStorage.getItem(PWA_SESSION_FLAG_KEY) === '1';
  } catch {
    sessionLaunchedAsPwa = false;
  }

  const detected = detectInstalledAppMode({
    displayModeStandalone: window.matchMedia?.('(display-mode: standalone)')?.matches === true,
    displayModeFullscreen: window.matchMedia?.('(display-mode: fullscreen)')?.matches === true,
    displayModeMinimalUi: window.matchMedia?.('(display-mode: minimal-ui)')?.matches === true,
    displayModeWindowControlsOverlay:
      window.matchMedia?.('(display-mode: window-controls-overlay)')?.matches === true,
    navigatorStandalone:
      (window.navigator as unknown as { standalone?: boolean }).standalone === true,
    referrer: typeof document !== 'undefined' ? document.referrer : '',
    search: window.location?.search || '',
    sessionLaunchedAsPwa,
  });

  if (detected) {
    try {
      window.sessionStorage.setItem(PWA_SESSION_FLAG_KEY, '1');
    } catch {
      /* ignore restricted storage */
    }
  }

  return detected;
}

/**
 * Attaches window-level `beforeinstallprompt`, `appinstalled`, and display-mode
 * listeners immediately before React finishes mounting so early events are never missed.
 */
export function initEarlyPWAInstallCapture(): void {
  if (typeof window === 'undefined' || earlyCaptureAttached) return;
  earlyCaptureAttached = true;
  sharedIsInstalled = isStandaloneAppMode();

  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    sharedDeferredPrompt = e as BeforeInstallPromptEvent;
    notifyListeners();
  });

  window.addEventListener('appinstalled', () => {
    sharedIsInstalled = true;
    sharedDeferredPrompt = null;
    try {
      window.sessionStorage.setItem(PWA_SESSION_FLAG_KEY, '1');
    } catch {
      /* ignore */
    }
    notifyListeners();
  });

  try {
    const mq = window.matchMedia('(display-mode: standalone)');
    const onDisplayModeChange = () => {
      if (isStandaloneAppMode()) {
        sharedIsInstalled = true;
        sharedDeferredPrompt = null;
        notifyListeners();
      }
    };
    mq.addEventListener?.('change', onDisplayModeChange);
  } catch {
    /* ignore older browsers */
  }
}

export function usePWAInstall() {
  const [, setTick] = useState(0);
  const [isIOS, setIsIOS] = useState(false);
  const [isEmbeddedIframe, setIsEmbeddedIframe] = useState(false);
  const [userAgent, setUserAgent] = useState('');
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    initEarlyPWAInstallCapture();

    sharedIsInstalled = sharedIsInstalled || isStandaloneAppMode();
    const ua = window.navigator.userAgent || '';
    setUserAgent(ua);
    setIsIOS(/iphone|ipad|ipod/i.test(ua));
    setOrigin(window.location.origin);

    let inFrame = false;
    try {
      inFrame = window.self !== window.top;
    } catch {
      inFrame = true;
    }
    setIsEmbeddedIframe(inFrame);

    const onUpdate = () => setTick((t) => t + 1);
    listeners.add(onUpdate);
    onUpdate();

    return () => {
      listeners.delete(onUpdate);
    };
  }, []);

  const install = async (): Promise<boolean> => {
    if (!sharedDeferredPrompt) return false;
    await sharedDeferredPrompt.prompt();
    const { outcome } = await sharedDeferredPrompt.userChoice;
    if (outcome === 'accepted') {
      sharedIsInstalled = true;
      sharedDeferredPrompt = null;
      notifyListeners();
      return true;
    }
    return false;
  };

  const personalInstallUrl = useMemo(() => resolvePersonalInstallUrl(origin), [origin]);
  const publicShareUrl = useMemo(() => resolvePublicShareUrl(origin), [origin]);
  const whatsAppShareHref = useMemo(
    () => buildWhatsAppShareHref(publicShareUrl),
    [publicShareUrl]
  );
  const installGuide: InstallPlatformGuide = useMemo(
    () => detectInstallPlatform(userAgent, isEmbeddedIframe),
    [userAgent, isEmbeddedIframe]
  );

  return {
    isInstallable: Boolean(sharedDeferredPrompt),
    isInstalled: sharedIsInstalled,
    isIOS,
    isEmbeddedIframe,
    personalInstallUrl,
    publicShareUrl,
    whatsAppShareHref,
    installGuide,
    install,
  };
}

export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
