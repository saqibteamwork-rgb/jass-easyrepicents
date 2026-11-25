import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { DownloadCloud, Smartphone, X, CheckCircle2 } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide install prompt
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#84142D] to-[#61001B] hover:from-[#9E1B38] hover:to-[#730823] active:scale-95 text-white font-extrabold text-xs shadow-xs transition-all cursor-pointer"
      >
        <DownloadCloud className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not supported by WebKit)
  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 active:scale-95 text-[11px] font-bold transition-all cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5 text-gray-500" />
          <span>Install on iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-gray-100 text-left relative animate-in zoom-in-95 duration-200">
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-700 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-[#84142D] mb-3">
                <Smartphone className="w-5 h-5" />
              </div>

              <h3 className="text-base font-extrabold text-[#1E1B1C]">Install on iPhone / iPad</h3>
              <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                Enjoy offline access and 1-tap receipt generation on your home screen:
              </p>

              <ol className="mt-3 text-xs text-[#1E1B1C] space-y-2 bg-gray-50 p-3.5 rounded-2xl border border-gray-200 font-medium">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#84142D]">1.</span>
                  <span>Tap the <strong>Share</strong> button (box with upward arrow) in Safari bottom bar.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#84142D]">2.</span>
                  <span>Scroll down and tap <strong>Add to Home Screen</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#84142D]">3.</span>
                  <span>Tap <strong>Add</strong> at the top right corner.</span>
                </li>
              </ol>

              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full py-2.5 rounded-xl bg-[#84142D] hover:bg-[#681023] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
