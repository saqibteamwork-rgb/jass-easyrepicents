import React from 'react';
import { SlipProvider } from '../types/slip';
import { PRESETS } from '../data/presets';
import { AlertTriangle, Sparkles, X, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';

interface Props {
  isOpen: boolean;
  targetProvider: SlipProvider | null;
  onClose: () => void;
  onConfirmForceOldVersion: (provider: SlipProvider) => void;
  onSwitchToVerified: (provider: 'jazzcash' | 'easypaisa') => void;
}

export const VersionWarningModal: React.FC<Props> = ({
  isOpen,
  targetProvider,
  onClose,
  onConfirmForceOldVersion,
  onSwitchToVerified,
}) => {
  if (!isOpen || !targetProvider) return null;

  const preset = PRESETS[targetProvider] || { name: targetProvider, badgeName: targetProvider };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#ECE6E7] text-left relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative top bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon & Tag */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0 shadow-xs">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[10px] font-extrabold text-amber-800 tracking-wide uppercase">
              Engine Upgrade Notice
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#1E1B1C] tracking-tight mt-0.5">
              New Version Coming Soon
            </h2>
          </div>
        </div>

        {/* Notice Body */}
        <div className="space-y-3 text-xs sm:text-[13px] text-[#5A5153] leading-relaxed">
          <p>
            You selected <strong className="text-[#1E1B1C] font-bold">{preset.name}</strong>. This template is currently available in the <strong className="text-[#1E1B1C]">Classic (Old) Version</strong>.
          </p>
          <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Version 2.0 In Progress</span>
            </div>
            <p className="text-[11.5px] text-amber-800 leading-normal">
              Official pixel-perfect assets and 1:1 certified layouts for {preset.name} are being finalized for the next release.
            </p>
          </div>
          <p className="text-[12px] text-[#786D70]">
            Meanwhile, <strong className="text-[#00A859]">Easypaisa</strong> and <strong className="text-[#84142D]">JazzCash</strong> are already 100% production-ready with real official 3D assets.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-2.5 pt-2 border-t border-gray-100">
          {/* Button 1: Force to use old version */}
          <button
            type="button"
            onClick={() => onConfirmForceOldVersion(targetProvider)}
            className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-extrabold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Force to Use Old Version</span>
          </button>

          {/* Button 2: Recommended switch to verified */}
          <div className="grid grid-cols-2 gap-2 mt-1">
            <button
              type="button"
              onClick={() => onSwitchToVerified('jazzcash')}
              className="py-2.5 px-3 bg-[#FDF1F3] hover:bg-[#F9E2E6] text-[#84142D] border border-[#F2C2C9] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Use JazzCash</span>
            </button>
            <button
              type="button"
              onClick={() => onSwitchToVerified('easypaisa')}
              className="py-2.5 px-3 bg-[#EBF7EE] hover:bg-[#D8F2DF] text-[#00A859] border border-[#BDE5C8] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Use Easypaisa</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
