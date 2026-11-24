import '@fontsource/fredoka/500.css';
import '@fontsource/fredoka/600.css';
import '@fontsource/fredoka/700.css';
import '@fontsource/nunito/400.css';
import '@fontsource/nunito/500.css';
import '@fontsource/nunito/600.css';
import '@fontsource/nunito/700.css';
import '@fontsource/nunito/800.css';
import '@fontsource/nunito/400-italic.css';
import '@fontsource/nunito/600-italic.css';
import '@fontsource/nunito/700-italic.css';
import '@fontsource/stix-two-text/400.css';
import '@fontsource/stix-two-text/500.css';
import '@fontsource/stix-two-text/600.css';
import '@fontsource/stix-two-text/700.css';
import '@fontsource/stix-two-text/400-italic.css';
import '@fontsource/stix-two-text/500-italic.css';
import '@fontsource/stix-two-text/600-italic.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';

import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';
import { initEarlyPWAInstallCapture } from './utils/usePWAInstall';

initEarlyPWAInstallCapture();

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

