import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff, CheckCircle2 } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-18 left-1/2 -translate-x-1/2 z-[90] flex items-center gap-2 rounded-full bg-amber-600/95 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-white shadow-xl animate-in slide-in-from-top-4 duration-300">
      <WifiOff className="w-3.5 h-3.5 animate-pulse" />
      <span>Offline Mode Active • Offline slip creation & cached assets ready</span>
    </div>
  );
};
