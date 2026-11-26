import '@fontsource/bricolage-grotesque/latin-600.css';
import '@fontsource/bricolage-grotesque/latin-700.css';
import '@fontsource/bricolage-grotesque/latin-800.css';
import '@fontsource/bricolage-grotesque/latin-ext-700.css';
import '@fontsource/plus-jakarta-sans/latin-400.css';
import '@fontsource/plus-jakarta-sans/latin-500.css';
import '@fontsource/plus-jakarta-sans/latin-600.css';
import '@fontsource/plus-jakarta-sans/latin-700.css';
import '@fontsource/plus-jakarta-sans/latin-ext-500.css';
import '@fontsource/stix-two-text/400.css';
import '@fontsource/stix-two-text/600.css';
import '@fontsource/stix-two-text/400-italic.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';

import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';
import { initEarlyPWAInstallCapture } from './utils/usePWAInstall';

initEarlyPWAInstallCapture();

if (typeof window !== 'undefined') {
  window.addEventListener('vite:preloadError', (event) => {
    event.preventDefault();
    try {
      const key = 'rtc_chunk_reload_ts';
      const prev = Number(window.sessionStorage.getItem(key) || '0');
      if (Date.now() - prev > 15_000) {
        window.sessionStorage.setItem(key, String(Date.now()));
        window.location.reload();
      }
    } catch {
      /* ignore storage restrictions */
    }
  });
}

if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  let hasRefreshedForSwUpdate = false;
  const hadController = Boolean(navigator.serviceWorker.controller);
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController || hasRefreshedForSwUpdate) return;
    hasRefreshedForSwUpdate = true;
    window.location.reload();
  });

  registerSW({
    immediate: true,
    onRegisteredSW(_swUrl, registration) {
      if (registration) {
        registration.update().catch(() => {
          /* ignore offline SW update check errors */
        });
      }
    },
    onRegisterError() {
      /* ignore sandboxed iframe SW restrictions */
    },
  });
}

createRoot(document.getElementById('root')!).render(<App />);


