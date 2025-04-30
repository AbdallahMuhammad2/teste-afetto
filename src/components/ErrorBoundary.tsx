import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="bg-black/90 flex flex-col items-center justify-center p-8 rounded-md text-center">
          <h2 className="text-[#D3A17E] text-xl mb-4">Material Preview Unavailable</h2>
          <p className="text-white/70 mb-6">
            The interactive material preview couldn't be loaded. 
            Please ensure your device supports WebGL or try a different browser.
          </p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="bg-[#D3A17E]/10 border border-[#D3A17E]/30 text-[#D3A17E] py-2 px-6 uppercase tracking-wider text-sm hover:bg-[#D3A17E]/20 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;