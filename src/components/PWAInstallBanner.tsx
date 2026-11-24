import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import QRCode from 'qrcode';
import {
  detectInstallPlatform,
  type InstallPlatformKind,
} from '../utils/freeLaunchAndPwaLogic';
import { useOnlineStatus, usePWAInstall } from '../utils/usePWAInstall';
import { CrestSvg, Icon } from './Icons';

type LinkAudienceMode = 'personal' | 'public';

const PLATFORM_TABS: { id: InstallPlatformKind; label: string; uaSample: string }[] = [
  {
    id: 'android',
    label: 'Android Phone',
    uaSample: 'Mozilla/5.0 (Linux; Android 14) Chrome/124.0',
  },
  {
    id: 'ios',
    label: 'iPhone / iPad',
    uaSample: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) Safari/605.1',
  },
  {
    id: 'desktop',
    label: 'Laptop (Win/Mac)',
    uaSample: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0',
  },
];

async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fallback below */
  }
  try {
    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
}

function PhoneInstallQrCode({
  url,
  size = 136,
}: {
  url: string;
  size?: number;
}) {
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(url, {
      width: size * 2,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#18142B',
        light: '#FFFFFF',
      },
    })
      .then((generated) => {
        if (!cancelled) setDataUrl(generated);
      })
      .catch(() => {
        if (!cancelled) setDataUrl('');
      });
    return () => {
      cancelled = true;
    };
  }, [url, size]);

  return (
    <div className="bg-white p-2.5 rounded-xl border border-[var(--line)] inline-flex items-center justify-center shrink-0 shadow-xs">
      {dataUrl ? (
        <img
          src={dataUrl}
          alt="Scan QR code with your phone camera to open and install Easy Learn"
          width={size}
          height={size}
          className="rounded-md select-none block"
        />
      ) : (
        <div
          aria-hidden="true"
          className="w-[136px] h-[136px] rounded-md bg-slate-100 flex items-center justify-center text-[11px] font-semibold text-slate-500"
        >
          Generating QR…
        </div>
      )}
    </div>
  );
}

export function PWAInstallModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const {
    isInstallable,
    isInstalled,
    isEmbeddedIframe,
    personalInstallUrl,
    publicShareUrl,
    installGuide,
    install,
  } = usePWAInstall();

  const [audienceMode, setAudienceMode] = useState<LinkAudienceMode>('personal');
  const [selectedTab, setSelectedTab] = useState<InstallPlatformKind>(
    installGuide.platform === 'desktop' ? 'android' : installGuide.platform
  );
  const [copied, setCopied] = useState(false);

  if (!open || typeof document === 'undefined') return null;

  const activeUrl = audienceMode === 'personal' ? personalInstallUrl : publicShareUrl;
  const activeWhatsAppHref = `https://wa.me/?text=${encodeURIComponent(
    audienceMode === 'personal'
      ? `Open Easy Learn on my phone to install the offline app: ${activeUrl}`
      : `Study JAMB UTME & WAEC/NECO 100% free on Easy Learn — 49 subjects, all 8 JAMB & WAEC novels, CBT mock exams & offline app: ${activeUrl}`
  )}`;

  const activeTabMeta =
    PLATFORM_TABS.find((t) => t.id === selectedTab) || PLATFORM_TABS[0];
  const activeGuide = detectInstallPlatform(activeTabMeta.uaSample, false);

  const handleCopy = async () => {
    const ok = await copyTextToClipboard(activeUrl);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    }
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Install Easy Learn on your phone and laptop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="rtc-card w-full max-w-[540px] rounded-2xl p-5 sm:p-6 flex flex-col gap-4 max-h-[92vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <CrestSvg size={38} />
            <div className="min-w-0">
              <h3 className="h20 text-[var(--ink)] truncate">
                Install on Your Laptop &amp; Phone
              </h3>
              <p className="text-[12.5px] text-[var(--dim)]">
                Works right now on Windows/Mac, Android &amp; iPhone — zero app store needed
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close install instructions"
            className="p-1.5 rounded-lg text-[var(--dim)] hover:text-[var(--ink)] hover:bg-[var(--bg)] cursor-pointer shrink-0"
          >
            <Icon name="x" size={16} />
          </button>
        </div>

        {/* Mode Switcher: Personal Install Right Now vs Public Link for Students */}
        {personalInstallUrl !== publicShareUrl && (
          <div
            role="tablist"
            aria-label="Choose install link mode"
            className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-[var(--bg)] border border-[var(--line)]"
          >
            <button
              role="tab"
              aria-selected={audienceMode === 'personal'}
              type="button"
              onClick={() => setAudienceMode('personal')}
              className={`min-h-[34px] px-3 rounded-lg text-[12px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
                audienceMode === 'personal'
                  ? 'bg-[var(--gold)] text-[var(--on-acc)]'
                  : 'text-[var(--dim)] hover:text-[var(--ink)]'
              }`}
            >
              My Phone &amp; Laptop (Now)
            </button>
            <button
              role="tab"
              aria-selected={audienceMode === 'public'}
              type="button"
              onClick={() => setAudienceMode('public')}
              className={`min-h-[34px] px-3 rounded-lg text-[12px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
                audienceMode === 'public'
                  ? 'bg-[var(--gold)] text-[var(--on-acc)]'
                  : 'text-[var(--dim)] hover:text-[var(--ink)]'
              }`}
            >
              Public Link (Students)
            </button>
          </div>
        )}

        {/* STEP 1: Install on This Laptop */}
        <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-4 flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[12.5px] font-extrabold text-[var(--gold)]">
              1. Install on This Laptop (Windows / Mac / Chromebook)
            </span>
          </div>

          {isInstalled ? (
            <div className="rounded-xl bg-[var(--ok-soft)] border border-[var(--ok-line)] p-3 text-[13px] font-semibold text-[var(--ink)] flex items-center gap-2">
              <Icon name="check" size={16} className="text-[var(--green)] shrink-0" />
              <span>Easy Learn is already installed on this device.</span>
            </div>
          ) : isInstallable ? (
            <button
              type="button"
              onClick={() => void install()}
              className="btn-tactile indigo w-full min-h-[44px] justify-center whitespace-nowrap"
            >
              <Icon name="download" size={16} />
              <span>Install on This Laptop Now</span>
            </button>
          ) : isEmbeddedIframe ? (
            <>
              <a
                href={activeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[var(--gold)] text-[var(--on-acc)] text-[13.5px] font-bold inline-flex items-center justify-center gap-2 hover:opacity-95 transition-opacity whitespace-nowrap"
              >
                <Icon name="download" size={16} />
                <span>Open Full Tab on Laptop to Install ↗</span>
              </a>
              <p className="text-[12px] text-[var(--dim)] leading-relaxed">
                Preview frames block browser install popups. Click above to open Easy Learn in a full Chrome or Edge tab, then click the <strong>Install Easy Learn</strong> icon on the right side of your address bar.
              </p>
            </>
          ) : (
            <p className="text-[13px] text-[var(--ink)] leading-relaxed">
              Click the <strong>Install Easy Learn</strong> icon on the right side of your Chrome or Edge address bar (or Menu <strong>⋮ → Cast, save, and share → Install page as app</strong>) to pin it to your Taskbar or Dock.
            </p>
          )}
        </div>

        {/* STEP 2: Scan QR Code to Install on Phone */}
        <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[12.5px] font-extrabold text-[var(--gold)]">
              2. Install on Your Phone (Scan QR or Send Link)
            </span>
            {copied && <span className="text-[12px] font-bold text-[var(--green)]">Copied ✓</span>}
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <PhoneInstallQrCode url={activeUrl} size={132} />
            <div className="flex-1 min-w-0 flex flex-col gap-2.5 w-full">
              <p className="text-[12.5px] text-[var(--ink)] leading-relaxed">
                Point your <strong>Android</strong> or <strong>iPhone</strong> camera at this QR code to open Easy Learn directly on your phone.
                {audienceMode === 'personal' && personalInstallUrl.includes('ais-dev-')
                  ? ' Sign in with your Google account if prompted.'
                  : ''}
              </p>
              <div className="font-mono text-[11.5px] text-[var(--ink)] bg-[var(--card)] border border-[var(--line)] rounded-lg px-2.5 py-2 truncate select-all">
                {activeUrl}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => void handleCopy()}
                  className="flex-1 min-h-[36px] px-3 rounded-xl bg-[var(--gold)] text-[var(--on-acc)] text-[12px] font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Icon name={copied ? 'check' : 'copy'} size={14} />
                  <span>{copied ? 'Copied' : 'Copy Link'}</span>
                </button>
                <a
                  href={activeWhatsAppHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-h-[36px] px-3 rounded-xl bg-[var(--ok-soft)] border border-[var(--ok-line)] text-[12px] font-bold text-[var(--ink)] inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <span>Send via WhatsApp ↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Device Step-by-Step Tabs */}
        <div className="flex flex-col gap-2.5">
          <div
            role="tablist"
            aria-label="Choose device type for installation steps"
            className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[var(--bg)] border border-[var(--line)]"
          >
            {PLATFORM_TABS.map((tab) => {
              const active = selectedTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={active}
                  type="button"
                  onClick={() => setSelectedTab(tab.id)}
                  className={`min-h-[34px] px-2.5 rounded-lg text-[12px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-[var(--gold)] text-[var(--on-acc)]'
                      : 'text-[var(--dim)] hover:text-[var(--ink)]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-3.5 flex flex-col gap-1.5">
            <div className="text-[12.5px] font-bold text-[var(--ink)]">{activeGuide.headline}</div>
            <ol className="text-[12.5px] text-[var(--ink)] space-y-1.5 list-decimal pl-5 leading-relaxed">
              {activeGuide.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="min-h-[40px] px-4 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-[13px] font-bold text-[var(--ink)] hover:border-[var(--acc-line)] cursor-pointer whitespace-nowrap"
        >
          Done
        </button>
      </div>
    </div>,
    document.body
  );
}

export function PWAInstallButton({
  compact = false,
  label,
  className = '',
}: {
  compact?: boolean;
  label?: string;
  className?: string;
}) {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  const buttonText =
    label || (isIOS ? 'Install on iPhone / iPad' : 'Install offline app');

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={() => void install()}
        className={
          compact
            ? `w-full min-h-[36px] px-3 rounded-xl bg-[var(--acc-soft)] border border-[var(--acc-line)] text-[12.5px] font-bold text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--on-acc)] flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${className}`
            : `btn-tactile indigo whitespace-nowrap ${className}`
        }
      >
        <Icon name="download" size={15} />
        <span>{label || 'Install Easy Learn App'}</span>
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowGuide(true)}
        className={
          compact
            ? `w-full min-h-[36px] px-3 rounded-xl bg-[var(--acc-soft)]/70 border border-[var(--acc-line)] hover:bg-[var(--acc-soft)] text-[12.5px] font-bold text-[var(--gold)] flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${className}`
            : `btn-tactile paper whitespace-nowrap ${className}`
        }
      >
        <Icon name="download" size={15} className="text-[var(--gold)] shrink-0" />
        <span>{buttonText}</span>
      </button>

      <PWAInstallModal open={showGuide} onClose={() => setShowGuide(false)} />
    </>
  );
}

/**
 * Full-width Website & Account Hub card providing:
 * 1) Direct Laptop One-Click Tab / Native Install + Scannable Phone QR Code (works right now!)
 * 2) Toggleable Public Student Share URL + WhatsApp share
 */
export function InstallAppHubCard() {
  const {
    isInstallable,
    isInstalled,
    isEmbeddedIframe,
    personalInstallUrl,
    publicShareUrl,
    installGuide,
    install,
  } = usePWAInstall();

  const [audienceMode, setAudienceMode] = useState<LinkAudienceMode>('personal');
  const [selectedPlatform, setSelectedPlatform] = useState<InstallPlatformKind>(
    installGuide.platform === 'desktop' ? 'android' : installGuide.platform
  );
  const [copied, setCopied] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);

  const activeUrl = audienceMode === 'personal' ? personalInstallUrl : publicShareUrl;
  const activeWhatsAppHref = `https://wa.me/?text=${encodeURIComponent(
    audienceMode === 'personal'
      ? `Open Easy Learn on my phone to install the offline app: ${activeUrl}`
      : `Study JAMB UTME & WAEC/NECO 100% free on Easy Learn — 49 subjects, all 8 JAMB & WAEC novels, CBT mock exams, virtual labs & offline installable app: ${activeUrl}`
  )}`;

  const activePlatformMeta =
    PLATFORM_TABS.find((t) => t.id === selectedPlatform) || PLATFORM_TABS[0];
  const activeSteps = detectInstallPlatform(activePlatformMeta.uaSample, false);

  const handleCopyUrl = async () => {
    const ok = await copyTextToClipboard(activeUrl);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: 'Easy Learn — Offline JAMB & WAEC App',
          text: 'Open Easy Learn to install the offline app:',
          url: activeUrl,
        });
        return;
      } catch {
        /* user cancelled or unsupported in iframe; fallback to copy */
      }
    }
    await handleCopyUrl();
  };

  if (isInstalled) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Laptop Direct Install + Phone QR Scan */}
      <div className="lg:col-span-6 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2 text-[12.5px] font-bold text-[var(--gold)]">
            <span>Install on Phone &amp; Laptop</span>
            <span aria-hidden="true" className="text-[var(--dim)]">·</span>
            <span className="text-[var(--green)]">Works Offline</span>
            <span aria-hidden="true" className="text-[var(--dim)]">·</span>
            <span className="text-[var(--dim)]">Android, iPhone, Windows &amp; Mac</span>
          </div>
          <h3 className="font-[var(--display)] font-extrabold text-[23px] sm:text-[27px] leading-tight text-[var(--ink)] text-balance">
            Install Easy Learn on your laptop now, or scan the QR code with your phone.
          </h3>
          <p className="text-[14px] leading-relaxed text-[var(--dim)]">
            No Play Store or App Store needed. Open the full tab on your laptop to pin Easy Learn to your Taskbar/Dock, and scan the QR code below with your phone camera to add it to your Android or iPhone home screen.
          </p>
        </div>

        {/* Personal (Works Right Now) vs Public Link Switcher */}
        {personalInstallUrl !== publicShareUrl && (
          <div
            role="tablist"
            aria-label="Select personal device install link or public student link"
            className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-[var(--bg)] border border-[var(--line)]"
          >
            <button
              role="tab"
              aria-selected={audienceMode === 'personal'}
              type="button"
              onClick={() => setAudienceMode('personal')}
              className={`min-h-[36px] px-3 rounded-lg text-[12.5px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
                audienceMode === 'personal'
                  ? 'bg-[var(--gold)] text-[var(--on-acc)]'
                  : 'text-[var(--dim)] hover:text-[var(--ink)]'
              }`}
            >
              My Phone &amp; Laptop (Now)
            </button>
            <button
              role="tab"
              aria-selected={audienceMode === 'public'}
              type="button"
              onClick={() => setAudienceMode('public')}
              className={`min-h-[36px] px-3 rounded-lg text-[12.5px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
                audienceMode === 'public'
                  ? 'bg-[var(--gold)] text-[var(--on-acc)]'
                  : 'text-[var(--dim)] hover:text-[var(--ink)]'
              }`}
            >
              Public Link (For Students)
            </button>
          </div>
        )}

        {/* QR + Link Box */}
        <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-4 flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <PhoneInstallQrCode url={activeUrl} size={136} />
          <div className="flex-1 min-w-0 flex flex-col gap-2.5 w-full">
            <div className="flex items-center justify-between gap-2 text-[12px] font-bold">
              <span className="text-[var(--ink)]">
                {audienceMode === 'personal'
                  ? 'Scan with Phone Camera · Direct Install URL'
                  : 'Public Student Website & App URL'}
              </span>
              {copied && <span className="text-[var(--green)]">Copied ✓</span>}
            </div>

            <div className="font-mono text-[12px] font-semibold text-[var(--ink)] bg-[var(--card)] border border-[var(--line)] rounded-lg px-3 py-2 truncate select-all">
              {activeUrl}
            </div>

            <p className="text-[12px] text-[var(--dim)] leading-snug">
              {audienceMode === 'personal' && activeUrl.includes('ais-dev-')
                ? 'Works immediately on your own phone & laptop when signed into your Google account — no public publishing needed yet.'
                : 'Share this public link with students once Share is enabled in the top-right toolbar.'}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => void handleCopyUrl()}
                className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-[var(--gold)] text-[var(--on-acc)] text-[12.5px] font-bold inline-flex items-center gap-1.5 hover:opacity-95 transition-opacity cursor-pointer whitespace-nowrap shrink-0"
              >
                <Icon name={copied ? 'check' : 'copy'} size={14} />
                <span>{copied ? 'Link Copied ✓' : 'Copy Link'}</span>
              </button>

              <a
                href={activeWhatsAppHref}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-[var(--ok-soft)] border border-[var(--ok-line)] text-[12.5px] font-bold text-[var(--ink)] inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
              >
                <span>Send to WhatsApp ↗</span>
              </a>

              <button
                type="button"
                onClick={() => void handleNativeShare()}
                className="min-h-[38px] px-3 py-1.5 rounded-xl bg-[var(--card)] border border-[var(--line)] hover:border-[var(--acc-line)] text-[12.5px] font-bold text-[var(--ink)] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Icon name="share" size={14} className="text-[var(--gold)]" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Primary Laptop Install CTA */}
        <div className="flex flex-wrap items-center gap-3">
          {isInstalled ? (
            <div className="min-h-[44px] px-4 rounded-xl bg-[var(--ok-soft)] border border-[var(--ok-line)] text-[13.5px] font-bold text-[var(--green)] inline-flex items-center gap-2 whitespace-nowrap">
              <Icon name="check" size={16} />
              <span>Easy Learn App Installed on This Device</span>
            </div>
          ) : isInstallable ? (
            <button
              type="button"
              onClick={() => void install()}
              className="min-h-[46px] px-5 py-2.5 rounded-xl bg-[var(--gold)] text-[var(--on-acc)] font-[var(--display)] font-bold text-[14.5px] inline-flex items-center gap-2 hover:opacity-95 transition-opacity cursor-pointer whitespace-nowrap shrink-0"
            >
              <Icon name="download" size={17} />
              <span>Install on This Laptop Now</span>
            </button>
          ) : isEmbeddedIframe ? (
            <a
              href={activeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[46px] px-5 py-2.5 rounded-xl bg-[var(--gold)] text-[var(--on-acc)] font-[var(--display)] font-bold text-[14px] inline-flex items-center gap-2 hover:opacity-95 transition-opacity whitespace-nowrap shrink-0"
            >
              <Icon name="download" size={16} />
              <span>Open Full Laptop Tab to Install ↗</span>
            </a>
          ) : (
            <button
              type="button"
              onClick={() => setShowGuideModal(true)}
              className="min-h-[46px] px-5 py-2.5 rounded-xl bg-[var(--acc-soft)] border border-[var(--acc-line)] text-[var(--gold)] font-[var(--display)] font-bold text-[14px] inline-flex items-center gap-2 hover:opacity-95 transition-opacity cursor-pointer whitespace-nowrap shrink-0"
            >
              <Icon name="download" size={16} />
              <span>Open Phone &amp; Laptop Install Popup</span>
            </button>
          )}
        </div>
        <PWAInstallModal open={showGuideModal} onClose={() => setShowGuideModal(false)} />
      </div>

      {/* Right Column: Interactive Android / iPhone / Laptop Step-by-Step Guide */}
      <div className="lg:col-span-6 rounded-2xl bg-[var(--bg)] border border-[var(--line)] p-5 sm:p-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className="text-[12px] font-bold text-[var(--gold)]">
            Step-by-Step Setup (Under 15 Seconds)
          </div>
          <h4 className="font-[var(--display)] font-extrabold text-[18px] text-[var(--ink)]">
            How to install on your phone &amp; laptop right now
          </h4>
        </div>

        <div
          role="tablist"
          aria-label="Select device to view app installation steps"
          className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[var(--card)] border border-[var(--line)]"
        >
          {PLATFORM_TABS.map((tab) => {
            const active = selectedPlatform === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={active}
                type="button"
                onClick={() => setSelectedPlatform(tab.id)}
                className={`min-h-[36px] px-2.5 rounded-lg text-[12px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-[var(--gold)] text-[var(--on-acc)]'
                    : 'text-[var(--dim)] hover:text-[var(--ink)]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="rounded-xl bg-[var(--card)] border border-[var(--line)] p-4 flex flex-col gap-2.5">
          <div className="font-[var(--display)] font-bold text-[15px] text-[var(--ink)]">
            {activeSteps.headline}
          </div>
          <ol className="text-[13.5px] text-[var(--ink)] space-y-2.5 list-decimal pl-5 leading-relaxed">
            {activeSteps.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-semibold text-[var(--dim)] pt-1">
          <span>Full-screen standalone window</span>
          <span aria-hidden="true">·</span>
          <span>Offline notes, 8 novels &amp; drills</span>
          <span aria-hidden="true">·</span>
          <span>Auto-updates silently</span>
        </div>
      </div>
    </div>
  );
}

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;

  return (
    <div
      role="status"
      className="fixed bottom-16 min-[980px]:bottom-5 left-4 z-50 rounded-xl bg-amber-600 text-white px-3.5 py-2 text-[12.5px] font-semibold shadow-lg flex items-center gap-2 border border-amber-400/40"
    >
      <Icon name="shield" size={15} />
      <span>Offline mode · Cached lessons, novels and practice banks remain active</span>
    </div>
  );
}
