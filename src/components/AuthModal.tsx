import React, { useState } from 'react';
import { registerUser, loginUser } from '../lib/authService';
import { UserProfile } from '../types/auth';
import { creatorPhotoBase64 } from '../assets/creatorAsset';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  KeyRound, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserProfile) => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (mode === 'register') {
      if (!email.trim() || !password || !confirmPassword) {
        setErrorMsg('Please fill in all required fields.');
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

      setIsLoading(true);
      try {
        const { user, error } = await registerUser(email, username, password);
        if (error || !user) {
          setErrorMsg(error || 'Failed to create account.');
        } else {
          onAuthSuccess(user);
          onClose();
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      // Login mode
      if (!email.trim() || !password) {
        setErrorMsg('Please enter your email/username and password.');
        return;
      }

      setIsLoading(true);
      try {
        const { user, error } = await loginUser(email, password);
        if (error || !user) {
          setErrorMsg(error || 'Invalid credentials.');
        } else {
          onAuthSuccess(user);
          onClose();
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#ECE6E7] text-left relative overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Border */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#84142D] via-[#00A859] to-[#84142D]" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Branding */}
        <div className="flex items-center gap-3 mb-5">
          <div className="relative w-12 h-12 rounded-full ring-2 ring-[#84142D] overflow-hidden shrink-0 shadow-sm">
            <img src={creatorPhotoBase64} alt="Admin" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold text-[#1E1B1C]">Crimson<span className="text-[#84142D]">Studio</span></span>
              
            </div>
            <p className="text-xs text-gray-500">
              {mode === 'login' ? 'Sign in to customize slips & edit fields' : 'Create an account to unlock full custom receipts'}
            </p>
          </div>
        </div>

        {/* Tab Switcher: Login vs Register */}
        <div className="flex items-center p-1 bg-[#F5ECED] rounded-xl border border-[#ECE6E7] mb-5">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-[#84142D] shadow-2xs'
                : 'text-gray-600 hover:text-black'
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
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-white text-[#84142D] shadow-2xs'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            Register (New Account)
          </button>
        </div>

        {/* Demo Notice */}
        <div className="mb-4 p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong>Guest Mode:</strong> You can view & download demo slips with default data. Sign in to edit names, amounts, TIDs, and phone numbers!
          </span>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Username / Display Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. AdminDev"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#84142D] focus:bg-white"
                  required
                />
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              {mode === 'register' ? 'Email Address' : 'Email or Username'}
            </label>
            <div className="relative">
              <input
                type={mode === 'register' ? 'email' : 'text'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={mode === 'register' ? 'yourname@gmail.com' : 'Enter email or username'}
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#84142D] focus:bg-white"
                required
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (min 6 chars)"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#84142D] focus:bg-white"
                required
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#84142D] focus:bg-white"
                  required
                />
                <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#84142D] to-[#61001B] hover:from-[#9B1937] hover:to-[#730823] active:scale-[0.98] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span>Processing...</span>
            ) : (
              <>
                <span>{mode === 'register' ? 'Register & Log In' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-4 pt-3 border-t border-gray-100 text-center">
          <p className="text-[11px] text-gray-500">
            {mode === 'login' ? (
              <>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-[#84142D] font-bold hover:underline"
                >
                  Create one now
                </button>
              </>
            ) : (
              <>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-[#84142D] font-bold hover:underline"
                >
                  Sign in here
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

