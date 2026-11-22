import React, { useState } from 'react';
import { useOnlineStatus, usePWAInstall } from '../utils/usePWAInstall';
import { Icon } from './Icons';

export function PWAInstallButton({
  compact = false,
  className = '',
}: {
  compact?: boolean;
  className?: string;
}) {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  if (isInstalled) {
    return compact ? null : (
      <div
        className={`inline-flex items-center justify-center gap-2 min-h-[38px] px-3.5 rounded-xl bg-[var(--ok-soft)] border border-[var(--ok-line)] text-[12.5px] font-semibold text-[var(--green)] whitespace-nowrap ${className}`}
      >
        <Icon name="check" size={15} />
        <span>Installed offline</span>
      </div>
    );
  }

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
        <Icon name="bolt" size={15} />
        <span>Install offline app</span>
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
            ? `w-full min-h-[36px] px-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--acc-line)] text-[12px] font-semibold text-[var(--dim)] hover:text-[var(--ink)] flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${className}`
            : `btn-tactile paper whitespace-nowrap ${className}`
        }
      >
        <Icon name="books" size={15} />
        <span>{isIOS ? 'Install on iPhone or iPad' : 'Install offline app'}</span>
      </button>

      {showGuide && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Install EYAK offline app"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs p-4"
        >
          <div className="rtc-card w-full max-w-sm rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="h20 text-[var(--ink)]">
                  {isIOS ? 'Install on iPhone / iPad' : 'Install EYAK'}
                </h3>
                <p className="text-[13px] text-[var(--dim)] mt-0.5">
                  Study notes, formulas, and practice banks with zero mobile data.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                aria-label="Close install instructions"
                className="p-1.5 rounded-lg text-[var(--dim)] hover:text-[var(--ink)] hover:bg-[var(--bg)] cursor-pointer"
              >
                <Icon name="x" size={16} />
              </button>
            </div>

            {isIOS ? (
              <ol className="text-[13.5px] text-[var(--ink)] space-y-2 list-decimal pl-5 leading-relaxed">
                <li>Tap the <strong>Share</strong> icon in Safari’s bottom toolbar.</li>
                <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
                <li>Tap <strong>Add</strong> to launch EYAK offline anytime.</li>
              </ol>
            ) : (
              <ol className="text-[13.5px] text-[var(--ink)] space-y-2 list-decimal pl-5 leading-relaxed">
                <li>Open your browser menu (<strong>⋮</strong> or the address bar install icon).</li>
                <li>Select <strong>Install EYAK</strong> or <strong>Add to Home Screen</strong>.</li>
                <li>All 49 JAMB and WAEC/NECO subjects save automatically so you can study offline.</li>
              </ol>
            )}

            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="btn-tactile indigo w-full"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
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
      <span>Offline mode · Your notes and practice questions are saved on this device</span>
    </div>
  );
}
