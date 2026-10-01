/**
 * BHARAT — Build the Civilization
 * Authentication Modal (Register & Login)
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Landmark, User, Mail, Lock, Sparkles, X, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
  onAuthSuccess?: (playerState?: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login',
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [civName, setCivName] = useState('My Bharat');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (mode === 'register') {
      if (!name.trim()) {
        setErrorMsg('Please enter your leader name.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }

      setIsSubmitting(true);
      const res = await register(name, email, password, civName);
      setIsSubmitting(false);

      if (res.success) {
        onAuthSuccess?.();
        onClose();
      } else {
        setErrorMsg(res.error || 'Registration failed.');
      }
    } else {
      if (!email.trim() || !password) {
        setErrorMsg('Please enter both email and password.');
        return;
      }

      setIsSubmitting(true);
      const res = await login(email, password);
      setIsSubmitting(false);

      if (res.success) {
        onAuthSuccess?.(res.playerState);
        onClose();
      } else {
        setErrorMsg(res.error || 'Login failed.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-stone-900 border border-amber-900/60 rounded-2xl shadow-2xl overflow-hidden text-stone-100">
        {/* Top Header Glow */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-700" />

        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-7 space-y-5">
          {/* Header Title */}
          <div className="text-center space-y-1">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-950/80 border border-amber-700/50 text-amber-400 mb-1">
              <Landmark className="w-6 h-6" />
            </div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-amber-200 tracking-wide">
              {mode === 'login' ? 'WELCOME TO BHARAT' : 'BEGIN YOUR CIVILIZATION'}
            </h2>
            <p className="text-xs text-stone-400">
              {mode === 'login'
                ? 'Sign in to access your persistent cloud civilization progress'
                : 'Create an account to preserve your historical legacy in Aiven Cloud'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-stone-950 rounded-xl border border-stone-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg(null);
              }}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-amber-600 text-stone-950 shadow-md font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMsg(null);
              }}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-amber-600 text-stone-950 shadow-md font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 bg-red-950/70 border border-red-800/80 rounded-xl text-red-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-300 uppercase tracking-wider mb-1">
                    Leader Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-stone-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Chandragupta / Aryabhata"
                      className="w-full bg-stone-950 border border-stone-750 focus:border-amber-500 rounded-lg pl-9 pr-3 py-2 text-sm text-stone-100 placeholder-stone-600 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-300 uppercase tracking-wider mb-1">
                    Civilization Name
                  </label>
                  <div className="relative">
                    <Sparkles className="absolute left-3 top-2.5 w-4 h-4 text-stone-500" />
                    <input
                      type="text"
                      value={civName}
                      onChange={(e) => setCivName(e.target.value)}
                      placeholder="e.g. My Bharat, Magadha Realm"
                      className="w-full bg-stone-950 border border-stone-750 focus:border-amber-500 rounded-lg pl-9 pr-3 py-2 text-sm text-stone-100 placeholder-stone-600 outline-none transition-colors"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-stone-300 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-stone-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="explorer@bharat.edu"
                  className="w-full bg-stone-950 border border-stone-750 focus:border-amber-500 rounded-lg pl-9 pr-3 py-2 text-sm text-stone-100 placeholder-stone-600 outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-300 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-stone-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-stone-950 border border-stone-750 focus:border-amber-500 rounded-lg pl-9 pr-3 py-2 text-sm text-stone-100 placeholder-stone-600 outline-none transition-colors"
                />
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-[11px] font-semibold text-stone-300 uppercase tracking-wider mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-2.5 w-4 h-4 text-stone-500" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full bg-stone-950 border border-stone-750 focus:border-amber-500 rounded-lg pl-9 pr-3 py-2 text-sm text-stone-100 placeholder-stone-600 outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold rounded-xl shadow-lg transition-all transform active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Connecting to Aiven Cloud...</span>
              ) : mode === 'login' ? (
                <>
                  <span>Sign In & Restore Civilization</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Create Account & Save Online</span>
                  <Sparkles className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Offline/Guest option */}
          <div className="pt-2 text-center border-t border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-stone-400 hover:text-amber-400 transition-colors cursor-pointer"
            >
              Continue playing locally (Guest Mode)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
