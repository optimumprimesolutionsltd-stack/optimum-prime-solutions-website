import React, { ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { isStaleChunkError, reloadForStaleChunk } from '../lib/staleChunk';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  // A chunk from before the latest deploy failed to load and the page is
  // reloading to pick up the new one — see lib/staleChunk.
  reloading: boolean;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, reloading: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, reloading: isStaleChunkError(error) };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (this.state.reloading) {
      // Reloaded moments ago and still failing: the chunk really is missing.
      if (!reloadForStaleChunk()) this.setState({ reloading: false });
      return;
    }
    // Log error details
    console.error('Error caught by boundary:', error, errorInfo);
    // Could send to error tracking service here (e.g., Sentry)
  }

  render() {
    if (this.state.reloading) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4 text-sm text-slate-600">
          Loading the latest version…
        </div>
      );
    }

    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md w-full">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg">
              <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-slate-950 mb-2">Something Went Wrong</h1>
              <p className="text-slate-600 mb-4">
                We encountered an unexpected error. Reloading the page usually fixes it.
              </p>
              <p className="text-xs text-slate-700 mb-6 break-words font-mono bg-slate-100 p-3 rounded">
                {this.state.error?.message || 'Unknown error'}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 rounded-lg bg-red-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-600 transition flex items-center justify-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </button>
                <button
                  onClick={() => (window.location.href = '/')}
                  className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-100 transition"
                >
                  Go Home
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
