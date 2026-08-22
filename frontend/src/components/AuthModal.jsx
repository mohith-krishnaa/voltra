import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User as UserIcon, 
  KeyRound, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles
} from 'lucide-react';
import VoltraLogo from './common/VoltraLogo';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [authMode, setAuthMode] = useState('login'); // 'login', 'register', 'forgot_email', 'forgot_otp'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [demoOtpHint, setDemoOtpHint] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    const isLogin = authMode === 'login';
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin
      ? { email, password }
      : { email, password, full_name: fullName || 'Eco Consumer' };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      let data = {};
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        data = { detail: text || 'Server connection issue' };
      }

      if (!res.ok) {
        throw new Error(data.detail || (isLogin ? 'Incorrect email or password' : 'Registration failed'));
      }

      localStorage.setItem('voltra_token', data.access_token);
      localStorage.setItem('voltra_user', JSON.stringify(data.user));
      onLoginSuccess(data.user);
      onClose();
    } catch (err) {
      setError(err.message || 'Unable to authenticate with Voltra server');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail || email })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Could not generate reset OTP');

      if (data.demo_otp) {
        setDemoOtpHint(data.demo_otp);
      }
      setSuccessMsg('A 6-digit verification OTP has been generated.');
      setAuthMode('forgot_otp');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: resetEmail || email,
          otp: resetOtp,
          new_password: newPassword
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Password reset failed');

      localStorage.setItem('voltra_token', data.access_token);
      localStorage.setItem('voltra_user', JSON.stringify(data.user));
      setSuccessMsg('Password updated successfully! Logging you in...');
      setTimeout(() => {
        onLoginSuccess(data.user);
        onClose();
      }, 800);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl max-w-sm w-full relative shadow-2xl space-y-6">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <VoltraLogo size="default" showText={false} />
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              {authMode === 'login' && 'Sign In to Voltra'}
              {authMode === 'register' && 'Create Free Account'}
              {authMode === 'forgot_email' && 'Password Recovery'}
              {authMode === 'forgot_otp' && 'Enter Verification OTP'}
            </h3>
            <p className="text-xs text-slate-500">
              Sync domestic households, smart tariffs and bills
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-mono">
            {successMsg}
          </div>
        )}

        {/* Sign In / Register Form */}
        {(authMode === 'login' || authMode === 'register') && (
          <>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {authMode === 'register' && (
                <div>
                  <label className="block text-slate-500 mb-1 font-mono uppercase tracking-wider text-[10px]">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. Mohith Krishna"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-[#E15B2D]"
                      required={authMode === 'register'}
                    />
                    <UserIcon className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-slate-500 mb-1 font-mono uppercase tracking-wider text-[10px]">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-[#E15B2D]"
                    required
                  />
                  <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-slate-500 font-mono uppercase tracking-wider text-[10px]">Password</label>
                  {authMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => { setResetEmail(email); setAuthMode('forgot_email'); setError(''); setSuccessMsg(''); }}
                      className="text-[10px] font-mono text-[#E15B2D] hover:underline"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-[#E15B2D]"
                    required
                  />
                  <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-orange-primary w-full py-2.5 text-xs font-bold"
              >
                {loading ? 'Please wait...' : authMode === 'login' ? 'Sign In' : 'Create Free Account'}
              </button>
            </form>

            <div className="text-center text-xs text-slate-500 pt-2">
              {authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setError(''); setSuccessMsg(''); }}
                className="text-[#E15B2D] font-bold hover:underline"
              >
                {authMode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </div>
          </>
        )}

        {/* Forgot Password Flows */}
        {authMode === 'forgot_email' && (
          <form onSubmit={handleRequestOtp} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-500 mb-1 font-mono uppercase tracking-wider text-[10px]">Account Email</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-[#E15B2D]"
                  required
                />
                <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-orange-primary w-full py-2.5 text-xs font-bold">
              {loading ? 'Generating OTP...' : 'Send 6-Digit OTP'}
            </button>

            <div className="text-center">
              <button type="button" onClick={() => setAuthMode('login')} className="text-xs text-slate-500 hover:text-slate-900">
                ← Back to Sign In
              </button>
            </div>
          </form>
        )}

        {authMode === 'forgot_otp' && (
          <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
            {demoOtpHint && (
              <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 text-[11px] font-mono text-[#E15B2D]">
                ⚡ Verification Code: <strong>{demoOtpHint}</strong>
              </div>
            )}

            <div>
              <label className="block text-slate-500 mb-1 font-mono uppercase tracking-wider text-[10px]">6-Digit Verification OTP</label>
              <input
                type="text"
                maxLength={6}
                placeholder="123456"
                value={resetOtp}
                onChange={(e) => setResetOtp(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-center font-mono font-bold text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#E15B2D]"
                required
              />
            </div>

            <div>
              <label className="block text-slate-500 mb-1 font-mono uppercase tracking-wider text-[10px]">New Password</label>
              <input
                type="password"
                placeholder="Min 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-[#E15B2D]"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn-orange-primary w-full py-2.5 text-xs font-bold">
              {loading ? 'Updating Password...' : 'Reset and Log In'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
