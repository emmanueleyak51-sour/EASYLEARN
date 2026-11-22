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
    console.error('EYAK ErrorBoundary caught:', error);
  }

  render() {
    if (this.state.hasError) {
      let friendly = 'Something went wrong while loading this page.';
      if (this.state.message.includes('Missing or insufficient permissions')) {
        friendly = 'Account check failed. Please sign in with your verified account or keep studying offline on this phone.';
      } else if (this.state.message.includes('Quota exceeded')) {
        friendly = 'Daily cloud save limit reached. Your study progress is still safe on this phone and cloud saving resets tomorrow.';
      }
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--ink)] p-6">
          <div className="rtc-card max-w-md w-full rounded-2xl p-6 flex flex-col gap-4">
            <h1 className="h22 text-[var(--ink)]">Study session interrupted</h1>
            <p className="text-[14.5px] text-[var(--dim)] leading-relaxed">{friendly}</p>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, message: '' });
                window.location.reload();
              }}
              className="btn-tactile indigo w-full"
            >
              Reload EYAK
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
