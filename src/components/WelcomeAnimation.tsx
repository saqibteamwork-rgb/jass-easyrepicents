import React, { useState, useEffect } from 'react';
import { creatorPhotoBase64 } from '../assets/creatorAsset';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Zap } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

export const WelcomeAnimation: React.FC<Props> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Smooth progress animation over 2.4 seconds
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2.5;
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        handleEnter();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  const handleEnter = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 400);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 bg-[#0A0D0B] text-white select-none transition-all duration-500 overflow-hidden ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-[#00A859]/20 via-[#84142D]/25 to-transparent rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-[#00A859]/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Main Glassmorphic Card */}
      <div className="relative z-10 w-full max-w-md bg-[#131915]/90 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.8)] text-center flex flex-col items-center">
        {/* Top Highlight Tag: System Initializing */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-950/80 via-[#1C2C22] to-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-black tracking-widest uppercase shadow-[0_0_20px_rgba(0,168,89,0.3)] mb-6 animate-bounce">
          <Sparkles className="w-3.5 h-3.5 text-emerald-300 animate-spin" style={{ animationDuration: '4s' }} />
          <span>System Initializing</span>
        </div>

        {/* Creator Photo Frame with Glowing Ring */}
        <div className="relative mb-5 group">
          <div className="absolute -inset-1.5 bg-gradient-to-tr from-[#00A859] via-[#E07A26] to-[#84142D] rounded-full blur-md opacity-80 animate-pulse" />
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-[#131915] ring-2 ring-white/20 overflow-hidden shadow-2xl">
            <img
              src={creatorPhotoBase64}
              alt="System Admin"
              className="w-full h-full object-cover rounded-full transform group-hover:scale-105 transition-transform duration-300"
              loading="eager"
            />
          </div>
          
          {/* Verified Badge */}
          <div className="absolute bottom-0 right-1 bg-[#00A859] text-white p-1.5 rounded-full ring-4 ring-[#131915] shadow-lg flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 fill-white text-[#00A859]" />
          </div>
        </div>

        {/* Creator Name & Title */}
        <div className="mb-4">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center justify-center gap-1.5">
            <span>Admin</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
              Lead Architect
            </span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Welcome to the Next-Gen Pakistani Fintech Slip Studio
          </p>
        </div>

        {/* Quick Feature Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold text-emerald-300">
            <Zap className="w-3 h-3 text-emerald-400" />
            Easypaisa 100% Ready
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold text-rose-300">
            <Zap className="w-3 h-3 text-rose-400" />
            JazzCash 100% Ready
          </span>
        </div>

        {/* Animated Progress Loader Bar */}
        <div className="w-full mb-6 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-gray-400">
            <span className="tracking-wider">INITIALIZING ENGINE...</span>
            <span className="font-bold text-emerald-400">{Math.min(100, Math.round(progress))}%</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#84142D] via-amber-500 to-[#00A859] rounded-full transition-all duration-100 ease-out shadow-[0_0_12px_rgba(0,168,89,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Skip / Enter Studio Button */}
        <button
          type="button"
          onClick={handleEnter}
          className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-[#00A859] to-[#008A46] hover:from-[#00B862] hover:to-[#009E50] active:scale-[0.98] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_4px_24px_rgba(0,168,89,0.4)] transition-all cursor-pointer"
        >
          <span>Enter Studio</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-[10px] text-gray-500 mt-3 font-mono">
          CrimsonStudio • FinTech Slip Studio v4.9.2
        </p>
      </div>
    </div>
  );
};

