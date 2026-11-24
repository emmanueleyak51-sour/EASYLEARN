import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CANONICAL_SHARED_APP_URL,
  OWNER_PERSONAL_APP_URL,
  PUBLIC_FREE_LAUNCH_ACTIVE,
  buildWhatsAppShareHref,
  detectInstallPlatform,
  detectInstalledAppMode,
  resolvePersonalInstallUrl,
  resolvePublicShareUrl,
  resolveRuntimeThemeId,
} from './freeLaunchAndPwaLogic';

test('PUBLIC_FREE_LAUNCH_ACTIVE is disabled so 1-day free trial countdown and expiry lock are enforced', () => {
  assert.equal(PUBLIC_FREE_LAUNCH_ACTIVE, false);
});

test('resolvePersonalInstallUrl preserves live ais-dev and ais-pre origins for immediate owner laptop/phone install', () => {
  assert.equal(resolvePersonalInstallUrl(), OWNER_PERSONAL_APP_URL);
  assert.equal(resolvePersonalInstallUrl('http://localhost:3000'), OWNER_PERSONAL_APP_URL);
  assert.equal(
    resolvePersonalInstallUrl('https://ais-dev-5m5y6hqcrfm7brakopopis-230466638364.europe-west2.run.app/'),
    OWNER_PERSONAL_APP_URL
  );
  assert.equal(
    resolvePersonalInstallUrl('https://ais-pre-5m5y6hqcrfm7brakopopis-230466638364.europe-west2.run.app/'),
    CANONICAL_SHARED_APP_URL
  );
});

test('resolvePublicShareUrl normalizes localhost and dev container hosts to canonical public URL', () => {
  assert.equal(resolvePublicShareUrl(), CANONICAL_SHARED_APP_URL);
  assert.equal(resolvePublicShareUrl('http://localhost:3000'), CANONICAL_SHARED_APP_URL);
  assert.equal(resolvePublicShareUrl('http://127.0.0.1:3000/'), CANONICAL_SHARED_APP_URL);
  assert.equal(
    resolvePublicShareUrl('https://ais-dev-5m5y6hqcrfm7brakopopis-230466638364.europe-west2.run.app'),
    CANONICAL_SHARED_APP_URL
  );
  assert.equal(
    resolvePublicShareUrl('https://ais-pre-5m5y6hqcrfm7brakopopis-230466638364.europe-west2.run.app/'),
    CANONICAL_SHARED_APP_URL
  );
  assert.equal(
    resolvePublicShareUrl('https://easylearn.ng/some/path'),
    'https://easylearn.ng'
  );
});

test('buildWhatsAppShareHref encodes canonical share link cleanly', () => {
  const href = buildWhatsAppShareHref('http://localhost:3000');
  assert.ok(href.startsWith('https://wa.me/?text='));
  assert.ok(decodeURIComponent(href).includes(CANONICAL_SHARED_APP_URL));
});

test('detectInstallPlatform returns accurate OS-specific PWA install steps', () => {
  const ios = detectInstallPlatform(
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15',
    false
  );
  assert.equal(ios.platform, 'ios');
  assert.equal(ios.steps.length, 3);
  assert.ok(ios.steps[1].includes('Add to Home Screen'));

  const androidIframe = detectInstallPlatform(
    'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/124.0',
    true
  );
  assert.equal(androidIframe.platform, 'android');
  assert.equal(androidIframe.isEmbeddedIframe, true);
  assert.ok(androidIframe.steps[0].includes('Open Direct App Link'));

  const desktop = detectInstallPlatform(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0',
    false
  );
  assert.equal(desktop.platform, 'desktop');
  assert.equal(desktop.steps.length, 3);
});

test('resolveRuntimeThemeId unlocks all 10 colour themes during free launch and enforces premium when disabled', () => {
  const standardUser = { themeId: 'stage-9-starlight' as const, pro: null, owner: 0 };
  assert.equal(resolveRuntimeThemeId(standardUser, true), 'stage-9-starlight');
  assert.equal(resolveRuntimeThemeId(standardUser, false), 'stage-1-adire');
});

test('detectInstalledAppMode reliably identifies installed PWA/TWA launches and normal browser tabs', () => {
  assert.equal(detectInstalledAppMode({}), false);
  assert.equal(detectInstalledAppMode({ search: '?website=1', referrer: 'https://google.com/' }), false);
  assert.equal(detectInstalledAppMode({ displayModeStandalone: true }), true);
  assert.equal(detectInstalledAppMode({ displayModeMinimalUi: true }), true);
  assert.equal(detectInstalledAppMode({ displayModeWindowControlsOverlay: true }), true);
  assert.equal(detectInstalledAppMode({ navigatorStandalone: true }), true);
  assert.equal(detectInstalledAppMode({ referrer: 'android-app://com.easylearn.app' }), true);
  assert.equal(detectInstalledAppMode({ search: '?source=pwa' }), true);
  assert.equal(detectInstalledAppMode({ search: '?autostart=1&source=twa' }), true);
  assert.equal(detectInstalledAppMode({ sessionLaunchedAsPwa: true }), true);
});
