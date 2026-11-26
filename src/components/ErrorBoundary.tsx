import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error?.message || 'An unexpected error occurred.',
    };
  }

  componentDidCatch(error: Error) {
    console.error('Easy Learn ErrorBoundary caught:', error);
  }

  private handleResetCacheAndReload = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((r) => r.unregister()));
      }
      if ('caches' in window) {
        const keys = await window.caches.keys();
        await Promise.all(keys.map((k) => window.caches.delete(k)));
      }
    } catch {
      /* ignore sandboxed storage errors */
    }
    this.setState({ hasError: false, message: '' });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      let friendly = 'This screen hit a temporary hiccup. Your progress is safe.';
      if (this.state.message.includes('Missing or insufficient permissions')) {
        friendly = 'Sign-in verification expired. Sign in again or keep studying offline.';
      } else if (this.state.message.includes('Quota exceeded')) {
        friendly = 'Daily cloud sync limit reached. Local progress remains saved.';
      }
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--ink)] p-6">
          <div className="rtc-card max-w-sm w-full rounded-2xl p-6 flex flex-col gap-3.5">
            <h1 className="h22 text-[var(--ink)]">Session paused</h1>
            <p className="text-[14px] text-[var(--dim)] leading-relaxed">{friendly}</p>
            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, message: '' });
                  window.location.reload();
                }}
                className="btn-tactile indigo w-full justify-center"
              >
                Reload Easy Learn
              </button>
              <button
                type="button"
                onClick={() => void this.handleResetCacheAndReload()}
                className="btn-tactile paper w-full justify-center text-[13px]"
              >
                Clear Cache &amp; Reload
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

