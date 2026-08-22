import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Voltra Render Error caught by boundary:", error, errorInfo);
  }

  handleReset = () => {
    localStorage.removeItem('voltra_user');
    localStorage.removeItem('voltra_token');
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B0B0B] text-[#F5F3ED] flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full p-8 rounded-2xl bg-[#111111] border border-white/10 text-center space-y-6 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-[#A3FF6B]/10 border border-[#A3FF6B]/30 flex items-center justify-center mx-auto text-[#A3FF6B]">
              <AlertCircle className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-[#F5F3ED]">Voltra Interface Refresh</h2>
              <p className="text-xs text-[#8A8A84] leading-relaxed">
                A rendering update occurred. Click below to refresh your energy session and continue smoothly.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 rounded-lg bg-[#0B0B0B] border border-red-500/20 text-red-400 font-mono text-[11px] text-left overflow-auto max-h-24">
                {this.state.error.message}
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="editorial-btn-lime w-full text-xs py-3 flex items-center justify-center gap-2 font-bold"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Refresh & Clear Cache</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
