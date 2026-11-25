"use client";
import React, { useState, useRef, useEffect } from 'react';
import { SlipData, SlipProvider } from './types/slip';
import { PRESETS } from './data/presets';
import { AdminSettings, UserUsageStats, DEFAULT_ADMIN_SETTINGS } from './types/admin';
import { UserProfile } from './types/auth';
import { getCurrentUser, saveCurrentUser, syncUserFromCloud } from './lib/authService';
import { supabase } from './lib/supabase';
import { fetchAdminSettings, saveAdminSettings, recordAuditSlip } from './lib/adminService';
import { Navbar } from './components/Navbar';
import { ControlConsole } from './components/ControlConsole';
import { SlipCanvas } from './components/SlipCanvas';

import dynamic from 'next/dynamic';

const TemplatesView = dynamic(() => import('./components/TemplatesView').then(mod => mod.TemplatesView), { ssr: false });
const HistoryView = dynamic(() => import('./components/HistoryView').then(mod => mod.HistoryView), { ssr: false });
const ExportSettingsView = dynamic(() => import('./components/ExportSettingsView').then(mod => mod.ExportSettingsView), { ssr: false });
const AdminGate = dynamic(() => import('./components/AdminGate').then(mod => mod.AdminGate), { ssr: false });
const AuthModal = dynamic(() => import('./components/AuthModal').then(mod => mod.AuthModal), { ssr: false });
const RedeemCouponModal = dynamic(() => import('./components/RedeemCouponModal').then(mod => mod.RedeemCouponModal), { ssr: false });
const UpgradeModal = dynamic(() => import('./components/UpgradeModal').then(mod => mod.UpgradeModal), { ssr: false });
const FeatureCallouts = dynamic(() => import('./components/FeatureCallouts').then(mod => mod.FeatureCallouts), { ssr: false });
const Footer = dynamic(() => import('./components/FeatureCallouts').then(mod => mod.Footer), { ssr: false });









import { VersionWarningModal } from './components/VersionWarningModal';
import { WelcomeAnimation } from './components/WelcomeAnimation';
import { OfflineIndicator } from './components/OfflineIndicator';
import { 
  downloadSlipAsPng, 
  downloadSlipAsPdf, 
  copySlipImageToClipboard, 
  shareSlipToWhatsApp 
} from './utils/exportUtils';

import { 
  Check, 
  Info, 
  AlertCircle,
  AlertTriangle,
  SlidersHorizontal,
  Eye,
  MessageSquare,
  Download,
  Sparkles,
  Megaphone,
  Lock,
  Crown,
  Ticket
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa6';

const STORAGE_KEY = 'crimson_ledger_slip_data_v1';
const HISTORY_KEY = 'crimson_ledger_history_v1';
const ADMIN_SETTINGS_KEY = 'saqib_admin_settings_v1';
const USAGE_STATS_KEY = 'saqib_usage_stats_v1';

export default function App() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const [activeTab, setActiveTab] = useState<'studio' | 'templates' | 'history' | 'settings' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (
        path.includes('mradmin') ||
        path.includes('admin') ||
        hash.includes('mradmin') ||
        hash.includes('admin') ||
        search.includes('mradmin') ||
        search.includes('admin=true')
      ) {
        return 'admin';
      }
    }
    return 'studio';
  });

  // URL / Route Listener for secret /mradmin path or #mradmin hash
  useEffect(() => {
    const handleCheckUrl = () => {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname.toLowerCase();
        const hash = window.location.hash.toLowerCase();
        const search = window.location.search.toLowerCase();
        if (
          path.includes('mradmin') ||
          hash.includes('mradmin') ||
          search.includes('mradmin')
        ) {
          setActiveTab('admin');
        }
      }
    };

    window.addEventListener('popstate', handleCheckUrl);
    window.addEventListener('hashchange', handleCheckUrl);
    // Initial check
    handleCheckUrl();

    return () => {
      window.removeEventListener('popstate', handleCheckUrl);
      window.removeEventListener('hashchange', handleCheckUrl);
    };
  }, []);

  const [mobileStudioTab, setMobileStudioTab] = useState<'editor' | 'preview'>('editor');
  const [warningModalTarget, setWarningModalTarget] = useState<SlipProvider | null>(null);

  // User Auth State (Supabase / Local)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => getCurrentUser());
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showRedeemCouponModal, setShowRedeemCouponModal] = useState<boolean>(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);

  // Admin Settings State (Stored in localStorage)
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => {
    if (typeof window === 'undefined') return DEFAULT_ADMIN_SETTINGS;
    const saved = localStorage.getItem(ADMIN_SETTINGS_KEY);
    if (saved) {
      try {
        return { ...DEFAULT_ADMIN_SETTINGS, ...JSON.parse(saved) };
      } catch (e) {
        console.error('Failed to parse admin settings', e);
      }
    }
    return DEFAULT_ADMIN_SETTINGS;
  });

  // User Usage Stats State (tracks daily and lifetime limits)
  const [usageStats, setUsageStats] = useState<UserUsageStats>(() => {
    const today = new Date().toISOString().split('T')[0];
    if (typeof window === 'undefined') return { lastResetDate: today, slipsCreatedToday: 0 };
    const saved = localStorage.getItem(USAGE_STATS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.todayDate === today) {
          return parsed;
        } else {
          return {
            todayDate: today,
            slipsCreatedToday: 0,
            totalLifetimeSlips: parsed.totalLifetimeSlips || 0,
            totalVolumeSimulated: parsed.totalVolumeSimulated || 0,
          };
        }
      } catch (e) {}
    }
    return {
      todayDate: today,
      slipsCreatedToday: 0,
      totalLifetimeSlips: 0,
      totalVolumeSimulated: 0,
    };
  });

  // Fetch cloud Admin Settings on startup (from Supabase)
  useEffect(() => {
    fetchAdminSettings().then((cloudSettings) => {
      setAdminSettings(cloudSettings);
    });
  }, []);

  // Sync Current User Plan from Cloud
  useEffect(() => {
    if (!currentUser) return;
    
    const checkSync = async () => {
      const updated = await syncUserFromCloud(currentUser);
      if (updated) {
        setCurrentUser(updated);
        // Optional: show Toast that admin upgraded them!
      }
    };
    
    // Check immediately on mount
    checkSync();
    
    // Then check every 15 seconds
    const interval = setInterval(checkSync, 15000);
    return () => clearInterval(interval);
  }, [currentUser?.id, currentUser?.plan]);

  // Save Admin Settings
  useEffect(() => {
    localStorage.setItem(ADMIN_SETTINGS_KEY, JSON.stringify(adminSettings));
  }, [adminSettings]);

  // Save Usage Stats
  useEffect(() => {
    localStorage.setItem(USAGE_STATS_KEY, JSON.stringify(usageStats));
  }, [usageStats]);
  
  // Welcome Animation State: Displays on visit with creator photo & "System Loading"
  const [showWelcome, setShowWelcome] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return !sessionStorage.getItem('saqib_welcome_shown');
  });

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    sessionStorage.setItem('saqib_welcome_shown', 'true');
  };
  
  // Initial Slip State (JazzCash default)
  const [slipData, setSlipData] = useState<SlipData>(() => {
    if (typeof window === 'undefined') return { ...PRESETS.jazzcash.defaultData, id: 'slip-' + Date.now(), createdAt: Date.now(), provider: 'jazzcash' };
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.provider) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse saved slip', e);
      }
    }
    return {
      ...PRESETS.jazzcash.defaultData,
      id: 'slip-' + Date.now(),
      createdAt: Date.now(),
    };
  });

  const [history, setHistory] = useState<SlipData[]>(() => {
    if (typeof window === 'undefined') return [];
    const savedHistory = localStorage.getItem(HISTORY_KEY);
    if (savedHistory) {
      try {
        return JSON.parse(savedHistory);
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
    return [];
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const slipRef = useRef<HTMLDivElement>(null);

  // Save active slip to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slipData));
  }, [slipData]);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleToggleMobileStudioTab = (tab: 'editor' | 'preview') => {
    setMobileStudioTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    saveCurrentUser(null);
    showToast('Signed out. You are now browsing in Guest Demo mode.');
  };

  const recordSuccessfulSlipCreation = (amount: number) => {
    const today = new Date().toISOString().split('T')[0];
    setUsageStats((prev) => ({
      todayDate: today,
      slipsCreatedToday: (prev.todayDate === today ? prev.slipsCreatedToday : 0) + 1,
      totalLifetimeSlips: prev.totalLifetimeSlips + 1,
      totalVolumeSimulated: prev.totalVolumeSimulated + (amount || 0),
    }));

    if (currentUser) {
      const updatedUser: UserProfile = {
        ...currentUser,
        slipsCreatedToday: (currentUser.slipsCreatedToday || 0) + 1,
        totalSlipsCreated: (currentUser.totalSlipsCreated || 0) + 1,
      };
      setCurrentUser(updatedUser);
      saveCurrentUser(updatedUser);
    }
  };

  const handleSelectProvider = (provider: SlipProvider, force = false) => {
    // Check if provider is disabled by Administrator
    if (adminSettings.enabledProviders && adminSettings.enabledProviders[provider] === false) {
      showToast(`⚠️ ${PRESETS[provider]?.name || provider} is currently disabled by Administrator.`);
      return;
    }

    // If not JazzCash or Easypaisa, open warning modal unless user clicked force
    if (provider !== 'jazzcash' && provider !== 'easypaisa' && !force) {
      if (!adminSettings.allowClassicEngines) {
        showToast('Only certified engines (JazzCash & Easypaisa) are currently allowed by Administrator.');
        return;
      }
      setWarningModalTarget(provider);
      return;
    }

    const config = PRESETS[provider];
    if (config) {
      setSlipData({
        ...config.defaultData,
        id: 'slip-' + Date.now(),
        createdAt: Date.now(),
      });
      setIsSaved(false);
      setWarningModalTarget(null);
      
      if (provider === 'jazzcash' || provider === 'easypaisa') {
        showToast(`Switched to ${config.name} Blueprint (100% Ready)`);
      } else {
        showToast(`Loaded ${config.name} (Classic v1 Engine)`);
      }
    }
  };

  const handleExportPng = async () => {
    if (!slipRef.current) return;

    // 1. Server-side Quota Check for Logged in user
    if (currentUser) {
      try {
        const { incrementQuotaAction } = await import('./app/actions/incrementQuota');
        const quotaRes = await incrementQuotaAction(currentUser.id);
        if (!quotaRes.success) {
          showToast('⚠️ ' + quotaRes.message);
          return;
        }
      } catch (err) {
        console.error('Server quota check failed', err);
      }
    } else {
      // Guest demo user fallback
      const guestLimit = adminSettings.freeTierDailyLimit === 0 ? 4 : (adminSettings.freeTierDailyLimit || 3);
      if (usageStats.slipsCreatedToday >= guestLimit) {
        showToast(`⚠️ Daily Demo Limit Reached (${guestLimit} demo prints/day). Please sign in or redeem a coupon code to create receipts!`);
        return;
      }
    }

    setIsExporting(true);
    showToast('Securely generating receipt on backend...');
    try {
      const fileName = `${slipData.provider}-slip-${slipData.tid.replace(/[^a-zA-Z0-9]/g, '')}`;
      
      
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        if (!token) throw new Error('Missing Auth Token - Guest mode falling back to local');

        const res = await fetch('/api/generate-receipt', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ slipData })
        });
      const result = await res.json();
      
      if (!res.ok || !result.imageUrl) throw new Error('Backend failed to generate receipt');
      
      // Fetch the generated image and force download in browser
      const imgRes = await fetch(result.imageUrl);
      const blob = await imgRes.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}.png`;
      link.click();
      window.URL.revokeObjectURL(url);

      import('canvas-confetti').then((mod) => {
        const confetti = mod.default;
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 }, colors: ['#84142D', '#D4B8B1', '#00A859'] });
      });
      
      if (!currentUser) {
        showToast('Exported Demo Slip! Sign in to customize real details.');
      } else if (currentUser.plan === 'free' && (adminSettings.freeTierDailyLimit === 0)) {
        showToast(`Exported Demo Slip (${usageStats.slipsCreatedToday + 1}/4 prints today). Upgrade to customize!`);
      } else {
        showToast(`Receipt PNG generated securely!`);
      }
      
      // Auto save to history with image URL
      handleSaveToHistory(true, result.imageUrl);
      recordSuccessfulSlipCreation(slipData.amount);
      recordAuditSlip(slipData, currentUser);
    } catch (error) {
      console.error('Backend failed, using local secure generation fallback:', error);
      showToast('Server busy, generating receipt securely on your device...');
      try {
        const fileName = `${slipData.provider}-slip-${slipData.tid.replace(/[^a-zA-Z0-9]/g, '')}`;
        await downloadSlipAsPng(slipRef.current, fileName);
        import('canvas-confetti').then((mod) => {
        const confetti = mod.default;
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 }, colors: ['#84142D', '#D4B8B1', '#00A859'] });
      });
        showToast('Receipt PNG generated locally!');
        handleSaveToHistory(true, undefined);
        recordSuccessfulSlipCreation(slipData.amount);
        recordAuditSlip(slipData, currentUser);
      } catch (fallbackErr) {
        console.error('Fallback generation also failed', fallbackErr);
        showToast('Failed to generate receipt completely. Please try again.');
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPdf = async () => {
    // For now, PDF redirects to the secure backend PNG generator
    await handleExportPng();
  };

  const handleCopyImage = async () => {
    if (!slipRef.current) return;
    const success = await copySlipImageToClipboard(slipRef.current);
    if (success) {
      setIsCopied(true);
      showToast('Slip image copied to clipboard! Ready to paste.');
      setTimeout(() => setIsCopied(false), 3000);
    } else {
      showToast('Could not copy image to clipboard in this browser.');
    }
  };

  const handleCopyData = () => {
    const payload = JSON.stringify(slipData, null, 2);
    navigator.clipboard.writeText(payload);
    showToast('Transaction data JSON copied to clipboard');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    const preset = PRESETS[slipData.provider] || PRESETS.jazzcash;
    setSlipData({
      ...preset.defaultData,
      id: 'slip-' + Date.now(),
      createdAt: Date.now(),
    });
    setIsSaved(false);
    showToast('Reset slip to template default values');
  };

  const handleSaveToHistory = (silent = false, imageUrl?: string) => {
    const newRecord: SlipData = {
      ...slipData,
      id: 'slip-' + Date.now(),
      createdAt: Date.now(),
      imageUrl: imageUrl || slipData.imageUrl,
    };
    const updated = [newRecord, ...history.filter(h => h.tid !== newRecord.tid)].slice(0, 30);
    setHistory(updated);
    setIsSaved(true);
    if (!silent) {
      showToast('Receipt logged to transaction history');
    }
  };

  const handleLoadFromHistory = (item: SlipData) => {
    setSlipData(item);
    setActiveTab('studio');
    showToast(`Loaded transaction #${item.tid}`);
  };

  const handleDeleteHistory = (id: string) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    showToast('Transaction removed from history');
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
    showToast('Transaction history cleared');
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#FFF8F8] flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-full border-4 border-[#84142D]/20 border-t-[#84142D] animate-spin"></div>
        <span className="text-[#84142D] font-bold animate-pulse text-sm">Loading System...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F8] text-[#1E1B1C] flex flex-col font-sans antialiased pb-20 lg:pb-0 overflow-x-hidden w-full relative">
      {/* Welcome Intro Animation with Creator Photo */}
      {showWelcome && (
        <WelcomeAnimation onComplete={handleWelcomeComplete} />
      )}

      {/* Offline Mode Indicator */}
      <OfflineIndicator />

      {/* Auth Modal (Sign In / Register) */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          showToast(`Welcome ${user.username}! Signed in on ${user.plan.toUpperCase()} tier.`);
        }}
      />

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <UpgradeModal
          user={currentUser}
          adminSettings={adminSettings}
          onClose={() => setShowUpgradeModal(false)}
            onOpenCoupon={() => {
              setShowUpgradeModal(false);
              setShowRedeemCouponModal(true);
            }}
          />
      )}

      {/* Redeem Coupon Modal */}
      <RedeemCouponModal
        isOpen={showRedeemCouponModal}
        onClose={() => setShowRedeemCouponModal(false)}
        currentUser={currentUser}
        onRedeemSuccess={(updated) => {
          setCurrentUser(updated);
          showToast(`Coupon Activated! You are now on ${updated.plan.toUpperCase()} tier.`);
        }}
        onOpenAuth={() => setShowAuthModal(true)}
      />

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-50 flex items-center gap-2 bg-[#1E1B1C] text-white px-4 py-3 rounded-xl shadow-xl text-xs font-semibold animate-in fade-in slide-in-from-bottom-4 duration-200">
          <Info className="w-4 h-4 text-[#00A859]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Version Warning Modal (Popup before using old version) */}
      <VersionWarningModal
        isOpen={!!warningModalTarget}
        targetProvider={warningModalTarget}
        onClose={() => setWarningModalTarget(null)}
        onConfirmForceOldVersion={(provider) => {
          handleSelectProvider(provider, true);
          setActiveTab('studio');
        }}
        onSwitchToVerified={(provider) => {
          handleSelectProvider(provider);
          setActiveTab('studio');
        }}
      />

      {/* Top Application Navbar */}
      <div className="no-print">
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedProvider={slipData.provider}
          onSelectProvider={(p) => handleSelectProvider(p)}
          onExportPng={handleExportPng}
          onExportPdf={handleExportPdf}
          onPrint={handlePrint}
          onReset={handleReset}
          isExporting={isExporting}
          onReplayWelcome={() => setShowWelcome(true)}
          currentUser={currentUser}
          onOpenAuth={() => setShowAuthModal(true)}
          onLogout={handleLogout}
          enabledProviders={adminSettings.enabledProviders}
          onOpenRedeemCoupon={() => setShowRedeemCouponModal(true)}
          onOpenUpgrade={() => setShowUpgradeModal(true)}
        />
      </div>

      {/* Live Announcement Broadcast Bar (if enabled) */}
      {adminSettings.broadcastBanner?.enabled && adminSettings.broadcastBanner?.text && (
        <div className="no-print bg-gradient-to-r from-[#1C2C22] via-[#0F1D14] to-[#1C2C22] border-b border-emerald-500/30 text-white py-2 px-4 shadow-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2.5 text-xs text-center">
            <Megaphone className="w-3.5 h-3.5 text-[#00A859] shrink-0 animate-bounce" />
            <span className="font-semibold text-emerald-200">
              {adminSettings.broadcastBanner.text}
            </span>
          </div>
        </div>
      )}

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {activeTab === 'studio' && (
          <div className="space-y-4 sm:space-y-6">
            {/* User Plan Status Banner */}
            {currentUser && (
              <div className="bg-white border border-[#ECE6E7] rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2.5 text-xs">
                  <span className="font-bold text-[#1E1B1C]">
                    Logged in as <strong>{currentUser.username}</strong> ({currentUser.customId})
                  </span>
                  {currentUser.plan === 'premium' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-300 font-black text-[10px]">
                      <Crown className="w-3 h-3 text-amber-600" />
                      PREMIUM UNLIMITED
                    </span>
                  ) : currentUser.plan === 'pro' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-300 font-extrabold text-[10px]">
                      PRO TIER ({adminSettings.proTierDailyLimit || 15} Slips/Day)
                    </span>
                  ) : currentUser.plan === 'custom' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-300 font-extrabold text-[10px]">
                      CUSTOM ({currentUser.customDailyLimit || 25} Slips/Day)
                    </span>
                  ) : (adminSettings.freeTierDailyLimit ?? 0) === 0 ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-black text-[10px]">
                      <Lock className="w-3 h-3 text-amber-700" />
                      DEMO MODE (0 REAL SLIPS • MAX 4 PRINTS)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800 border border-gray-300 font-bold text-[10px]">
                      FREE TIER ({adminSettings.freeTierDailyLimit} Slips/Day)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="text-gray-600 font-medium">
                    Today&apos;s Slips:{' '}
                    <strong className={
                      currentUser.plan === 'free' && (adminSettings.freeTierDailyLimit ?? 0) === 0 && usageStats.slipsCreatedToday >= 4
                        ? 'text-rose-600'
                        : currentUser.plan === 'free' && (adminSettings.freeTierDailyLimit ?? 0) > 0 && usageStats.slipsCreatedToday >= (adminSettings.freeTierDailyLimit || 1)
                        ? 'text-rose-600'
                        : 'text-[#1E1B1C]'
                    }>
                      {usageStats.slipsCreatedToday} / {
                        currentUser.plan === 'premium'
                          ? '∞'
                          : currentUser.plan === 'pro'
                          ? (adminSettings.proTierDailyLimit || 15)
                          : currentUser.plan === 'custom'
                          ? (currentUser.customDailyLimit || 25)
                          : (adminSettings.freeTierDailyLimit ?? 0) === 0
                          ? 4
                          : (adminSettings.freeTierDailyLimit || 3)
                      }
                    </strong>
                  </span>
                  {currentUser.plan !== 'premium' && (
                    <button
                      type="button"
                      onClick={() => setShowUpgradeModal(true)}
                      className="text-[11px] font-extrabold text-[#84142D] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Crown className="w-3 h-3 text-[#84142D]" />
                      <span>Upgrade Plan / Coupon</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Classic Version Active Alert Banner */}
            {slipData.provider !== 'jazzcash' && slipData.provider !== 'easypaisa' && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 px-4 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
                <div className="flex items-center gap-2 text-amber-900 font-medium">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Currently using <strong>{PRESETS[slipData.provider]?.name || slipData.provider} (Classic v1 Engine)</strong>. Upgraded 1:1 certified v2.0 is scheduled soon.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectProvider('jazzcash')}
                    className="px-2.5 py-1 text-[11px] font-bold bg-[#84142D] hover:bg-[#681023] text-white rounded-lg transition-colors cursor-pointer"
                  >
                    Use JazzCash (100% Ready)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectProvider('easypaisa')}
                    className="px-2.5 py-1 text-[11px] font-bold bg-[#00A859] hover:bg-[#008A46] text-white rounded-lg transition-colors cursor-pointer"
                  >
                    Use Easypaisa (100% Ready)
                  </button>
                </div>
              </div>
            )}

            {/* Mobile View Switcher (< lg) - Non-sticky clean header */}
            <div className="lg:hidden flex items-center p-1 bg-[#F5ECED] rounded-xl border border-[#ECE6E7] mb-3">
              <button
                type="button"
                onClick={() => handleToggleMobileStudioTab('editor')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  mobileStudioTab === 'editor'
                    ? 'bg-white text-[#84142D] shadow-2xs'
                    : 'text-[#574143]'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Edit Receipt</span>
              </button>
              <button
                type="button"
                onClick={() => handleToggleMobileStudioTab('preview')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  mobileStudioTab === 'preview'
                    ? 'bg-white text-[#84142D] shadow-2xs'
                    : 'text-[#574143]'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Preview</span>
                <span className="w-2 h-2 rounded-full bg-[#00A859] animate-pulse" />
              </button>
            </div>

            {/* Split Pane: Control Console (Left) and Real-Time Slip Canvas (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              {/* Left Control Console */}
              <div className={`lg:col-span-7 no-print ${mobileStudioTab === 'editor' ? 'block' : 'hidden lg:block'}`}>
                <ControlConsole
                  data={slipData}
                  onChange={setSlipData}
                  onExportPng={handleExportPng}
                  onExportPdf={handleExportPdf}
                  onPrint={handlePrint}
                  onCopyData={handleCopyData}
                  onShareWhatsApp={() => shareSlipToWhatsApp(slipData)}
                  onSaveToHistory={handleSaveToHistory}
                  isSaved={isSaved}
                  isGuest={!currentUser}
                  userPlan={currentUser?.plan || 'free'}
                  freeTierDailyLimit={adminSettings.freeTierDailyLimit ?? 0}
                  onPromptAuth={() => setShowAuthModal(true)}
                  onOpenRedeem={() => setShowRedeemCouponModal(true)}
                />
              </div>

              {/* Right Slip Canvas */}
              <div className={`lg:col-span-5 w-full flex justify-center ${mobileStudioTab === 'preview' ? 'block' : 'hidden lg:block'}`}>
                <SlipCanvas
                  data={slipData}
                  slipRef={slipRef}
                  onExportPng={handleExportPng}
                  onExportPdf={handleExportPdf}
                  onCopyImage={handleCopyImage}
                  onShareWhatsApp={() => shareSlipToWhatsApp(slipData)}
                  isCopied={isCopied}
                />
              </div>
            </div>

            {/* Bottom 3 Feature Callouts */}
            <div className="no-print pt-6">
              <FeatureCallouts />
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="no-print">
            <TemplatesView
              activeProvider={slipData.provider}
              enabledProviders={adminSettings.enabledProviders}
              onSelectPreset={(provider) => {
                handleSelectProvider(provider);
                if (provider === 'jazzcash' || provider === 'easypaisa') {
                  setActiveTab('studio');
                }
              }}
            />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="no-print">
            <HistoryView
              history={history}
              onLoadSlip={handleLoadFromHistory}
              onDeleteSlip={handleDeleteHistory}
              onClearHistory={handleClearHistory}
            />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="no-print">
            <ExportSettingsView
              data={slipData}
              onChange={setSlipData}
            />
          </div>
        )}

        {/* Master Admin Panel */}
        {activeTab === 'admin' && (
          <div className="no-print">
            <AdminGate
              settings={adminSettings}
              onUpdateSettings={(newSettings) => {
                setAdminSettings(newSettings);
                showToast('Admin settings saved successfully');
              }}
              usageStats={usageStats}
              onResetUsageStats={() => {
                const today = new Date().toISOString().split('T')[0];
                const reset = { ...usageStats, todayDate: today, slipsCreatedToday: 0 };
                setUsageStats(reset);
                showToast('Daily usage counters reset to 0');
              }}
              history={history}
              onClearHistory={handleClearHistory}
              onDeleteHistoryItem={handleDeleteHistory}
              onClose={() => setActiveTab('studio')}
            />
          </div>
        )}
      </main>

      {/* Sticky Bottom Action Bar for Mobile View (< lg) */}
      {activeTab === 'studio' && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#ECE6E7] px-3 py-2 flex items-center justify-between gap-2 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
          <button
            type="button"
            onClick={() => handleToggleMobileStudioTab(mobileStudioTab === 'editor' ? 'preview' : 'editor')}
            className="flex-1 py-2.5 px-2 bg-[#F5ECED] hover:bg-[#EAE1E2] text-[#84142D] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            {mobileStudioTab === 'editor' ? (
              <>
                <Eye className="w-4 h-4 text-[#84142D]" />
                <span>View Slip</span>
              </>
            ) : (
              <>
                <SlidersHorizontal className="w-4 h-4 text-[#84142D]" />
                <span>Edit Slip</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => shareSlipToWhatsApp(slipData)}
            className="py-2.5 px-3 bg-[#EBF7EE] text-[#075E54] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-[#25D366]/40 hover:bg-[#25D366] hover:text-white transition-colors cursor-pointer group"
          >
            <FaWhatsapp className="w-4 h-4 text-[#25D366] group-hover:text-white transition-colors" />
            <span className="hidden xs:inline">WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={handleExportPng}
            disabled={isExporting}
            className="flex-1 py-2.5 px-2 bg-[#00A859] hover:bg-[#008F4C] text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Save PNG</span>
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="no-print">
        <Footer />
      </div>
    </div>
  );
}

