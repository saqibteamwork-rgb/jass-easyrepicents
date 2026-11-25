import React, { useState } from 'react';
import { SlipProvider } from '../types/slip';
import { UserProfile } from '../types/auth';
import { creatorPhotoBase64 } from '../assets/creatorAsset';
import { PWAInstallButton } from './PWAInstallButton';
import { 
  FileDown, 
  Image as ImageIcon, 
  RotateCcw, 
  Layers, 
  History, 
  Sliders, 
  Sparkles,
  Printer,
  Lock,
  CheckCircle2,
  ShieldCheck,
  LogIn,
  LogOut,
  Ticket, Crown,
  Menu,
  X
} from 'lucide-react';

interface Props {
  activeTab: 'studio' | 'templates' | 'history' | 'settings' | 'admin';
  setActiveTab: (tab: 'studio' | 'templates' | 'history' | 'settings' | 'admin') => void;
  selectedProvider: SlipProvider;
  onSelectProvider: (provider: SlipProvider) => void;
  onExportPng: () => void;
  onExportPdf: () => void;
  onPrint: () => void;
  onReset: () => void;
  isExporting: boolean;
  onReplayWelcome?: () => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  enabledProviders?: Record<SlipProvider, boolean>;
  onOpenRedeemCoupon?: () => void;
  onOpenUpgrade?: () => void;
}

export const Navbar: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  selectedProvider,
  onSelectProvider,
  onExportPng,
  onExportPdf,
  onPrint,
  onReset,
  isExporting,
  onReplayWelcome,
  currentUser,
  onOpenAuth,
  onLogout,
  enabledProviders,
  onOpenRedeemCoupon,
  onOpenUpgrade,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const providers: { id: SlipProvider; label: string; color: string; isReady: boolean }[] = [
    { id: 'jazzcash', label: 'JazzCash', color: '#E02B3A', isReady: true },
    { id: 'easypaisa', label: 'Easypaisa', color: '#00B140', isReady: true },
    { id: 'raast', label: 'Raast P2P', color: '#F59E0B', isReady: false },
    { id: 'bank_alfalah', label: 'Bank Alfalah', color: '#DC2626', isReady: false },
    { id: 'nayapay', label: 'NayaPay', color: '#FF6B00', isReady: false },
    { id: 'sadapay', label: 'SadaPay', color: '#FF5A5F', isReady: false },
    { id: 'thermal', label: 'POS Thermal', color: '#4B5563', isReady: false },
  ];

  return (
    <header className="w-full bg-white border-b border-[#ECE6E7] sticky top-0 z-50 shadow-xs">
      {/* Main Top Header Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8">
        <div className="flex items-center justify-between h-15 sm:h-16 gap-2">
          
          {/* LEFT: Brand Identity */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={onReplayWelcome}
              title="CrimsonLedger • Click to replay welcome intro"
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full ring-2 ring-[#84142D] ring-offset-2 ring-offset-white overflow-hidden shrink-0 shadow-sm cursor-pointer active:scale-95 transition-transform"
            >
              <img
                src={creatorPhotoBase64}
                alt="System Logo"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#00A859] rounded-full ring-1 ring-white" />
            </button>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-[15px] sm:text-[17px] text-[#1E1B1C] tracking-tight">
                  Crimson<span className="text-[#84142D]">Studio</span>
                </span>
                <span className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-50 text-[#00A859] text-[9px] font-black tracking-wider border border-emerald-200">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  VERIFIED
                </span>
              </div>
              <span className="hidden sm:block text-[9px] font-semibold text-[#8A8183] tracking-wide uppercase">
                Receipt Engine
              </span>
            </div>
          </div>

          {/* CENTER: Navigation Tabs (Desktop xl/lg) */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#F5ECED] p-1 rounded-2xl border border-[#ECE6E7]">
            <button
              onClick={() => setActiveTab('studio')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'studio'
                  ? 'bg-[#84142D] text-white shadow-xs'
                  : 'text-[#574143] hover:text-[#1E1B1C] hover:bg-white/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Studio</span>
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'templates'
                  ? 'bg-[#84142D] text-white shadow-xs'
                  : 'text-[#574143] hover:text-[#1E1B1C] hover:bg-white/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Templates</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-[#84142D] text-white shadow-xs'
                  : 'text-[#574143] hover:text-[#1E1B1C] hover:bg-white/60'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>History</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#84142D] text-white shadow-xs'
                  : 'text-[#574143] hover:text-[#1E1B1C] hover:bg-white/60'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Setup</span>
            </button>

            {/* Secret Admin Mode Indicator when /mradmin is active */}
            {activeTab === 'admin' && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-[#1E1B1C] text-white shadow-xs ml-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin View</span>
                <button
                  type="button"
                  onClick={() => setActiveTab('studio')}
                  title="Exit Admin Panel"
                  className="ml-1 text-gray-400 hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </nav>

          {/* RIGHT: Action Controls & User Account */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">

            {/* Redeem Coupon Button */}
            {onOpenRedeemCoupon && (
              <button
                type="button"
                onClick={onOpenRedeemCoupon}
                title="Redeem Promo / Coupon Code"
                className="hidden sm:inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 hover:bg-amber-100 text-amber-900 font-extrabold text-xs transition-all cursor-pointer active:scale-95"
              >
                <Ticket className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden md:inline">Coupon</span>
              </button>
            )}

            {/* User Account / Sign In */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-xl text-xs shadow-2xs">
                <div className="flex flex-col text-right">
                  <div className="font-extrabold text-[#1E1B1C] flex items-center gap-1 justify-end text-[11px]">
                    <span className="truncate max-w-[50px] sm:max-w-[100px]">{currentUser.username}</span>
                    {currentUser.plan === 'premium' ? (
                      <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 border border-amber-300">PREMIUM</span>
                    ) : currentUser.plan === 'pro' ? (
                      <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-900 border border-blue-300">PRO</span>
                    ) : currentUser.plan === 'custom' ? (
                      <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">CUSTOM</span>
                    ) : (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-gray-200 text-gray-700">FREE</span>
                    )}
                  </div>
                  <span className="hidden sm:block text-[9px] text-gray-400 font-mono">{currentUser.customId}</span>
                  </div>
                  {currentUser.plan !== 'premium' && onOpenUpgrade && (
                    <button
                      type="button"
                      onClick={onOpenUpgrade}
                      className="hidden sm:block px-2 py-1 mx-0.5 text-[9px] font-black rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-sm hover:from-amber-500 hover:to-orange-600 transition-colors cursor-pointer"
                    >
                      UPGRADE
                    </button>
                  )}
                  <button
                  type="button"
                  onClick={onLogout}
                  title="Sign Out"
                  className="hidden sm:block p-1 hover:bg-gray-200 rounded-lg text-gray-500 hover:text-black cursor-pointer transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#84142D] to-[#61001B] hover:from-[#9E1B38] text-white font-extrabold text-xs shadow-2xs transition-all cursor-pointer active:scale-95"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* PWA Install Button */}
            <div className="hidden sm:block">
              <PWAInstallButton />
            </div>

            {/* Quick Export PNG Button */}
            <button
              onClick={onExportPng}
              disabled={isExporting}
              title="Download Receipt PNG"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-extrabold text-white bg-[#84142D] hover:bg-[#681023] rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">PNG</span>
            </button>

            {/* Mobile Menu Dropdown Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-gray-600 hover:text-black hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-down Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#ECE6E7] bg-white px-4 py-3 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setActiveTab('studio');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border ${
                activeTab === 'studio' ? 'bg-[#84142D] text-white border-transparent' : 'bg-gray-50 border-gray-200 text-gray-700'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Receipt Studio</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('templates');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border ${
                activeTab === 'templates' ? 'bg-[#84142D] text-white border-transparent' : 'bg-gray-50 border-gray-200 text-gray-700'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Templates</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('history');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border ${
                activeTab === 'history' ? 'bg-[#84142D] text-white border-transparent' : 'bg-gray-50 border-gray-200 text-gray-700'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Saved History</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('settings');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border ${
                activeTab === 'settings' ? 'bg-[#84142D] text-white border-transparent' : 'bg-gray-50 border-gray-200 text-gray-700'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Export Setup</span>
            </button>
          </div>

          {/* Secondary Mobile Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onExportPdf();
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-800 font-bold flex items-center gap-1"
              >
                <FileDown className="w-3.5 h-3.5 text-[#84142D]" />
                <span>PDF</span>
              </button>
              <button
                onClick={() => {
                  onPrint();
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-800 font-bold flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5 text-gray-600" />
                <span>Print</span>
              </button>
              <button
                onClick={() => {
                  onReset();
                  setMobileMenuOpen(false);
                }}
                className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:text-black"
                title="Reset Form"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {currentUser && (
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 font-bold sm:hidden"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}
            
            {onOpenRedeemCoupon && (
              <button
                onClick={() => {
                  onOpenRedeemCoupon();
                  setMobileMenuOpen(false);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 font-bold sm:hidden"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>Coupon</span>
              </button>
            )}

            {currentUser?.plan !== 'premium' && onOpenUpgrade && (
              <button
                onClick={() => {
                  onOpenUpgrade();
                  setMobileMenuOpen(false);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold sm:hidden"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Upgrade</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Provider Selector Sub-bar (Smooth Swipe Strip) */}
      <div className="bg-[#FAF7F7] border-t border-[#ECE6E7] px-3 sm:px-5 lg:px-8 py-2 overflow-x-auto no-scrollbar touch-pan-x">
        <div className="max-w-7xl mx-auto flex items-center gap-2 min-w-max text-xs">
          <span className="text-[11px] font-black text-[#7A7273] uppercase tracking-wider mr-1 shrink-0">
            PROVIDER:
          </span>
          {providers.map((p) => {
            const isSelected = selectedProvider === p.id;
            const isEngineEnabled = !enabledProviders || enabledProviders[p.id] !== false;

            return (
              <button
                key={p.id}
                onClick={() => onSelectProvider(p.id)}
                title={!isEngineEnabled ? 'Disabled by Administrator' : undefined}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  !isEngineEnabled
                    ? 'bg-gray-100 text-gray-400 border border-dashed border-gray-300 opacity-60'
                    : isSelected
                    ? 'bg-[#1E1B1C] text-white shadow-xs scale-102'
                    : p.isReady
                    ? 'bg-white text-[#1E1B1C] border border-[#D5CED0] hover:bg-[#F5ECED]'
                    : 'bg-[#F0ECEC]/70 text-[#8A8183] border border-dashed border-[#DDD7D8] opacity-70 hover:opacity-100'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: isEngineEnabled ? p.color : '#9CA3AF' }}
                />
                <span>{p.label}</span>
                {!isEngineEnabled ? (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-700">
                    Disabled
                  </span>
                ) : p.isReady ? (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#E8F7EE] text-[#00A859]">
                    Ready
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-medium px-1.5 py-0.2 rounded bg-gray-200 text-gray-600">
                    <Lock className="w-2.5 h-2.5" />
                    v2.0
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};



