import React, { useState, useEffect } from 'react';
import { verifyAdminLogin } from '../app/actions/adminLoginAction';
import { AdminSettings, UserUsageStats } from '../types/admin';
import { SlipData, SlipProvider } from '../types/slip';
import { UserProfile, UserPlan } from '../types/auth';
import { Coupon, CouponType } from '../types/coupon';
import { 
  fetchAllUsers, 
  adminUpdateUserPlan, 
  adminCreateUser, 
  adminDeleteUser, 
  fetchAuditLogs, 
  saveAdminSettings,
  AuditSlipRecord 
} from '../lib/adminService';
import { 
  fetchCoupons, 
  createCoupon, 
  updateCoupon, 
  deleteCoupon, 
  generate4DigitProCode, 
  generate5DigitPremiumCode, 
  generateCustomCouponCode 
} from '../lib/couponService';
import { PRESETS } from '../data/presets';
import { creatorPhotoBase64 } from '../assets/creatorAsset';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  KeyRound, 
  Sliders, 
  BarChart3, 
  Megaphone, 
  Layers, 
  FileText, 
  RefreshCw, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Eye, 
  EyeOff, 
  LogOut,
  Sparkles,
  Zap,
  Globe,
  Users,
  Search,
  Crown,
  Calendar,
  Check,
  UserPlus,
  X,
  Database,
  Copy,
  ExternalLink,
  Ticket,
  Plus,
  Edit2,
  Clock,
  SlidersHorizontal,
  Settings
} from 'lucide-react';

interface Props {
  settings: AdminSettings;
  onUpdateSettings: (newSettings: AdminSettings) => void;
  usageStats: UserUsageStats;
  onResetUsageStats: () => void;
  history: SlipData[];
  onClearHistory: () => void;
  onDeleteHistoryItem: (id: string) => void;
  onClose: () => void;
}

export const AdminPanel: React.FC<Props> = ({
  settings,
  onUpdateSettings,
  usageStats,
  onResetUsageStats,
  history,
  onClearHistory,
  onDeleteHistoryItem,
  onClose,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('saqib_admin_auth') === 'true';
  });

  
  
  
  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'coupons' | 'security' | 'engines' | 'broadcast' | 'logs'>('coupons');
  
  // Local editable settings
  const [localSettings, setLocalSettings] = useState<AdminSettings>(settings);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinChangeMsg, setPinChangeMsg] = useState<string | null>(null);

  // Users state
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState<'all' | 'free' | 'pro' | 'premium' | 'custom'>('all');
  const [userActionSuccess, setUserActionSuccess] = useState<string | null>(null);

  // User Subscription Modal State (Duration & Tier Customization)
  const [subscriptionModalUser, setSubscriptionModalUser] = useState<UserProfile | null>(null);
  const [subModalPlan, setSubModalPlan] = useState<UserPlan>('pro');
  const [subModalDurationPreset, setSubModalDurationPreset] = useState<'30' | '90' | '180' | '365' | 'lifetime' | 'custom'>('30');
  const [subModalCustomDays, setSubModalCustomDays] = useState<number>(30);
  const [subModalCustomDailyLimit, setSubModalCustomDailyLimit] = useState<number>(25);

  // Coupons State
  const [couponsList, setCouponsList] = useState<Coupon[]>([]);
  const [showCouponModal, setShowCouponModal] = useState<boolean>(false);
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponTypeInput, setCouponTypeInput] = useState<CouponType>('pro');
  const [couponTitleInput, setCouponTitleInput] = useState('');
  const [couponDurationInput, setCouponDurationInput] = useState<number>(30);
  const [couponMaxUsesInput, setCouponMaxUsesInput] = useState<number>(15);
  const [couponCustomLimitInput, setCouponCustomLimitInput] = useState<number>(25);
  const [couponIsActiveInput, setCouponIsActiveInput] = useState<boolean>(true);
  const [couponFilter, setCouponFilter] = useState<'all' | 'pro' | 'premium' | 'custom'>('all');

  // Add User Modal State
  const [showAddUserModal, setShowAddUserModal] = useState<boolean>(false);
  const [newEmail, setNewEmail] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPlan, setNewPlan] = useState<UserPlan>('free');
  const [newDuration, setNewDuration] = useState<number>(30);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditSlipRecord[]>([]);
  const [logSearch, setLogSearch] = useState('');

  // SQL Copy feedback
  const [sqlCopied, setSqlCopied] = useState(false);

  // Load all platform data
  const refreshData = async () => {
    setIsLoadingUsers(true);
    try {
      const [users, logs, coupons] = await Promise.all([
        fetchAllUsers(),
        fetchAuditLogs(),
        fetchCoupons(),
      ]);
      setUsersList(users);
      setAuditLogs(logs);
      setCouponsList(coupons);
      setUserActionSuccess('All data synchronized with Supabase Cloud!');
      setTimeout(() => setUserActionSuccess(null), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }
  }, [isAuthenticated]);

  

  const handleLogout = () => {
    sessionStorage.removeItem('saqib_admin_auth');
    window.location.reload();
  };

  const handleSaveSettings = async (updated: Partial<AdminSettings>) => {
    const next = { ...localSettings, ...updated };
    setLocalSettings(next);
    onUpdateSettings(next);
    const success = await saveAdminSettings(next);
    if (success) {
      setUserActionSuccess('Settings saved and synced to Supabase Cloud!');
      setTimeout(() => setUserActionSuccess(null), 3000);
    }
  };

  const handleUpdatePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPin || newPin.length < 4) {
      setPinChangeMsg('PIN must be at least 4 characters long.');
      return;
    }
    if (newPin !== confirmPin) {
      setPinChangeMsg('PINs do not match.');
      return;
    }
    
      try {
        const { adminChangePin } = await import('../app/actions/adminChangePin');
        await adminChangePin(newPin);
        
        // Update local settings just so UI knows
        setLocalSettings({...localSettings, adminPin: newPin});
      } catch (err: any) {
        setPinChangeMsg('Error changing PIN: ' + err.message);
        return;
      }

    setNewPin('');
    setConfirmPin('');
    setPinChangeMsg('Master Admin PIN updated and saved to Supabase!');
    setTimeout(() => setPinChangeMsg(null), 3500);
  };

  const toggleProvider = (provider: SlipProvider) => {
    const updated = {
      ...localSettings.enabledProviders,
      [provider]: !localSettings.enabledProviders[provider],
    };
    handleSaveSettings({ enabledProviders: updated });
  };

  const handleEnableAllProviders = () => {
    const allEnabled: Record<SlipProvider, boolean> = {
      jazzcash: true,
      easypaisa: true,
      raast: true,
      sadapay: true,
      nayapay: true,
      bank_alfalah: true,
      thermal: true,
    };
    handleSaveSettings({ enabledProviders: allEnabled });
  };

  const handleSetVerifiedOnlyProviders = () => {
    const verifiedOnly: Record<SlipProvider, boolean> = {
      jazzcash: true,
      easypaisa: true,
      raast: false,
      sadapay: false,
      nayapay: false,
      bank_alfalah: false,
      thermal: false,
    };
    handleSaveSettings({ enabledProviders: verifiedOnly });
  };

  // Open Manage Subscription Modal for a user
  const openSubscriptionModal = (user: UserProfile) => {
    setSubscriptionModalUser(user);
    setSubModalPlan(user.plan);
    setSubModalCustomDailyLimit(user.customDailyLimit || 25);
    
    if (user.plan === 'premium' && !user.expiresAt) {
      setSubModalDurationPreset('lifetime');
    } else if (user.expiresAt) {
      const diffDays = Math.ceil((new Date(user.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      if (diffDays <= 32 && diffDays >= 28) setSubModalDurationPreset('30');
      else if (diffDays <= 95 && diffDays >= 85) setSubModalDurationPreset('90');
      else if (diffDays <= 185 && diffDays >= 175) setSubModalDurationPreset('180');
      else if (diffDays <= 370 && diffDays >= 360) setSubModalDurationPreset('365');
      else {
        setSubModalDurationPreset('custom');
        setSubModalCustomDays(Math.max(1, diffDays));
      }
    } else {
      setSubModalDurationPreset('30');
    }
  };

  // Save User Subscription Customization
  const handleSaveUserSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscriptionModalUser) return;

    let targetDays: number | null = 30;
    if (subModalPlan === 'free') {
      targetDays = null;
    } else if (subModalDurationPreset === 'lifetime') {
      targetDays = null;
    } else if (subModalDurationPreset === '30') {
      targetDays = 30; // 1 Month
    } else if (subModalDurationPreset === '90') {
      targetDays = 90; // 3 Months
    } else if (subModalDurationPreset === '180') {
      targetDays = 180; // 6 Months
    } else if (subModalDurationPreset === '365') {
      targetDays = 365; // 1 Year
    } else if (subModalDurationPreset === 'custom') {
      targetDays = subModalCustomDays;
    }

    await adminUpdateUserPlan(
      subscriptionModalUser.id,
      subModalPlan,
      targetDays,
      subModalPlan === 'custom' ? subModalCustomDailyLimit : undefined
    );

    setSubscriptionModalUser(null);
    const refreshed = await fetchAllUsers();
    setUsersList(refreshed);
    const durationLabel = targetDays ? `${targetDays} days` : 'Lifetime';
    setUserActionSuccess(`User ${subscriptionModalUser.email} updated to ${subModalPlan.toUpperCase()} (${durationLabel})!`);
    setTimeout(() => setUserActionSuccess(null), 3500);
  };

  const handleCreateNewUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;

    try {
      const created = await adminCreateUser(newEmail, newUsername, newPlan, newDuration);
      setShowAddUserModal(false);
      setNewEmail('');
      setNewUsername('');
      setNewPlan('free');
      const refreshed = await fetchAllUsers();
      setUsersList(refreshed);
      setUserActionSuccess(`New user ${created.email} (${created.customId}) registered successfully!`);
      setTimeout(() => setUserActionSuccess(null), 3500);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (!window.confirm(`Are you sure you want to delete user account "${email}"? This action cannot be undone.`)) {
      return;
    }
    await adminDeleteUser(userId);
    const refreshed = await fetchAllUsers();
    setUsersList(refreshed);
    setUserActionSuccess(`User ${email} deleted successfully.`);
    setTimeout(() => setUserActionSuccess(null), 3000);
  };

  // COUPON ACTIONS
  const openCreateCoupon = (type: CouponType) => {
    setEditingCouponId(null);
    setCouponTypeInput(type);
    if (type === 'pro') {
      setCouponCodeInput(generate4DigitProCode());
      setCouponTitleInput('Pro Access 30 Days (4-Digit)');
      setCouponDurationInput(30);
      setCouponMaxUsesInput(15);
    } else if (type === 'premium') {
      setCouponCodeInput(generate5DigitPremiumCode());
      setCouponTitleInput('Premium Unlimited Access (5-Digit)');
      setCouponDurationInput(365);
      setCouponMaxUsesInput(10);
    } else {
      setCouponCodeInput(generateCustomCouponCode());
      setCouponTitleInput('Special 3 Days Quota');
      setCouponDurationInput(3);
      setCouponMaxUsesInput(20);
      setCouponCustomLimitInput(25);
    }
    setCouponIsActiveInput(true);
    setShowCouponModal(true);
  };

  const openEditCoupon = (coupon: Coupon) => {
    setEditingCouponId(coupon.id);
    setCouponCodeInput(coupon.code);
    setCouponTypeInput(coupon.type);
    setCouponTitleInput(coupon.title || '');
    setCouponDurationInput(coupon.durationDays);
    setCouponMaxUsesInput(coupon.maxUses);
    setCouponCustomLimitInput(coupon.customSlipLimit || 25);
    setCouponIsActiveInput(coupon.isActive);
    setShowCouponModal(true);
  };

  const handleSaveCouponForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;

    if (editingCouponId) {
      await updateCoupon(editingCouponId, {
        code: couponCodeInput.trim().toUpperCase(),
        type: couponTypeInput,
        title: couponTitleInput.trim() || `${couponTypeInput.toUpperCase()} Coupon`,
        durationDays: couponDurationInput,
        maxUses: couponMaxUsesInput,
        customSlipLimit: couponTypeInput === 'custom' ? couponCustomLimitInput : undefined,
        isActive: couponIsActiveInput,
      });
      setUserActionSuccess(`Coupon "${couponCodeInput.toUpperCase()}" updated successfully!`);
    } else {
      await createCoupon({
        code: couponCodeInput.trim().toUpperCase(),
        type: couponTypeInput,
        title: couponTitleInput.trim() || `${couponTypeInput.toUpperCase()} Coupon`,
        durationDays: couponDurationInput,
        maxUses: couponMaxUsesInput,
        customSlipLimit: couponTypeInput === 'custom' ? couponCustomLimitInput : undefined,
        isActive: couponIsActiveInput,
      });
      setUserActionSuccess(`Coupon "${couponCodeInput.toUpperCase()}" created and active!`);
    }

    setShowCouponModal(false);
    const refreshed = await fetchCoupons();
    setCouponsList(refreshed);
    setTimeout(() => setUserActionSuccess(null), 3000);
  };

  const handleDeleteCoupon = async (id: string, code: string) => {
    if (!window.confirm(`Delete coupon "${code}"? Users will no longer be able to claim it.`)) {
      return;
    }
    await deleteCoupon(id);
    const refreshed = await fetchCoupons();
    setCouponsList(refreshed);
    setUserActionSuccess(`Coupon "${code}" deleted.`);
    setTimeout(() => setUserActionSuccess(null), 3000);
  };

  const handleToggleCouponActive = async (coupon: Coupon) => {
    await updateCoupon(coupon.id, { isActive: !coupon.isActive });
    const refreshed = await fetchCoupons();
    setCouponsList(refreshed);
    setUserActionSuccess(`Coupon "${coupon.code}" ${coupon.isActive ? 'disabled' : 'enabled'}.`);
    setTimeout(() => setUserActionSuccess(null), 2500);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setUserActionSuccess(`Code "${code}" copied to clipboard! Share it with users.`);
    setTimeout(() => setUserActionSuccess(null), 2500);
  };

  const handleExportLogs = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditLogs.length > 0 ? auditLogs : history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `system-audit-logs-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredUsers = usersList.filter((u) => {
    const q = userSearchQuery.trim().toLowerCase();
    const matchesSearch = !q || (
      u.email.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      (u.customId || "").toLowerCase().includes(q)
    );
    const matchesPlan = planFilter === 'all' || u.plan === planFilter;
    return matchesSearch && matchesPlan;
  });

  const filteredCoupons = couponsList.filter((c) => {
    if (couponFilter === 'all') return true;
    return c.type === couponFilter;
  });

  const filteredLogs = auditLogs.filter((log) => {
    const q = logSearch.trim().toLowerCase();
    if (!q) return true;
    return (
      log.tid.toLowerCase().includes(q) ||
      log.provider.toLowerCase().includes(q) ||
      log.senderName.toLowerCase().includes(q) ||
      log.receiverName.toLowerCase().includes(q) ||
      log.userEmail.toLowerCase().includes(q)
    );
  });

  // Calculate live platform numbers
  const totalUsersCount = usersList.length;
  const proUsersCount = usersList.filter((u) => u.plan === 'pro').length;
  const premiumUsersCount = usersList.filter((u) => u.plan === 'premium').length;
  const freeUsersCount = usersList.filter((u) => u.plan === 'free').length;
  const customUsersCount = usersList.filter((u) => u.plan === 'custom').length;
  const enabledEnginesCount = Object.values(localSettings.enabledProviders).filter(Boolean).length;
  const totalCouponRedemptions = couponsList.reduce((acc, c) => acc + (c.usedCount || 0), 0);

  const copySupabaseSQL = () => {
    const sql = `-- =========================================================================
-- SYSTEM SAFE SUPABASE SQL MIGRATION (100% ERROR-FREE RUN)
-- =========================================================================

-- 1. Create Profiles Table if not exists & Add missing columns safely
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY,
    custom_id VARCHAR(30) UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    username TEXT NOT NULL,
    plan VARCHAR(20) DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'premium', 'custom')),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    expires_at TIMESTAMPTZ NULL,
    slips_created_today INT DEFAULT 0 NOT NULL,
    total_slips_created INT DEFAULT 0 NOT NULL,
    custom_daily_limit INT NULL,
    redeemed_coupon_code VARCHAR(50) NULL
);

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS custom_daily_limit INT NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS redeemed_coupon_code VARCHAR(50) NULL;
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_slip_date TIMESTAMPTZ NULL;
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS total_slips_created INT DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS slips_created_today INT DEFAULT 0 NOT NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS total_slips_created INT DEFAULT 0 NOT NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ NULL;

-- 2. Create Admin Settings Table & Add all missing tier columns safely
CREATE TABLE IF NOT EXISTS public.admin_settings (
    id TEXT PRIMARY KEY DEFAULT 'global',
    admin_pin TEXT DEFAULT 'saqib786',
    daily_slip_limit INT DEFAULT 15,
    free_tier_daily_limit INT DEFAULT 3,
    pro_tier_daily_limit INT DEFAULT 15,
    premium_tier_daily_limit INT DEFAULT 999999,
    enforce_limit BOOLEAN DEFAULT false,
    enforce_watermark BOOLEAN DEFAULT false,
    watermark_brand_text TEXT DEFAULT 'Verified System Slip',
    allow_classic_engines BOOLEAN DEFAULT true,
    enabled_providers JSONB DEFAULT '{"jazzcash": true, "easypaisa": true, "raast": true, "sadapay": true, "nayapay": true, "bank_alfalah": true, "thermal": true}'::jsonb,
    broadcast_banner JSONB DEFAULT '{"enabled": true, "text": "📢 Welcome to System! JazzCash & Easypaisa engines are 100% verified.", "variant": "info"}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.admin_settings ADD COLUMN IF NOT EXISTS free_tier_daily_limit INT DEFAULT 3;
ALTER TABLE public.admin_settings ADD COLUMN IF NOT EXISTS pro_tier_daily_limit INT DEFAULT 15;
ALTER TABLE public.admin_settings ADD COLUMN IF NOT EXISTS premium_tier_daily_limit INT DEFAULT 999999;
ALTER TABLE public.admin_settings ADD COLUMN IF NOT EXISTS daily_slip_limit INT DEFAULT 15;
ALTER TABLE public.admin_settings ADD COLUMN IF NOT EXISTS admin_pin TEXT DEFAULT 'saqib786';
ALTER TABLE public.admin_settings ADD COLUMN IF NOT EXISTS enforce_limit BOOLEAN DEFAULT false;
ALTER TABLE public.admin_settings ADD COLUMN IF NOT EXISTS enforce_watermark BOOLEAN DEFAULT false;
ALTER TABLE public.admin_settings ADD COLUMN IF NOT EXISTS watermark_brand_text TEXT DEFAULT 'Verified System Slip';
ALTER TABLE public.admin_settings ADD COLUMN IF NOT EXISTS allow_classic_engines BOOLEAN DEFAULT true;
ALTER TABLE public.admin_settings ADD COLUMN IF NOT EXISTS enabled_providers JSONB DEFAULT '{"jazzcash": true, "easypaisa": true, "raast": true, "sadapay": true, "nayapay": true, "bank_alfalah": true, "thermal": true}'::jsonb;
ALTER TABLE public.admin_settings ADD COLUMN IF NOT EXISTS broadcast_banner JSONB DEFAULT '{"enabled": true, "text": "📢 Welcome to System! JazzCash & Easypaisa engines are 100% verified.", "variant": "info"}'::jsonb;

-- 3. Audit Slips Table
CREATE TABLE IF NOT EXISTS public.audit_slips (
    id TEXT PRIMARY KEY,
    tid TEXT NOT NULL,
    provider TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    sender_name TEXT,
    receiver_name TEXT,
    user_email TEXT,
    user_plan TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Coupons & Promo Codes Table
CREATE TABLE IF NOT EXISTS public.coupons (
    id TEXT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('pro', 'premium', 'custom')),
    title TEXT,
    duration_days INT DEFAULT 30 NOT NULL,
    max_uses INT DEFAULT 10 NOT NULL,
    used_count INT DEFAULT 0 NOT NULL,
    custom_slip_limit INT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    expires_at TIMESTAMPTZ NULL,
    used_by_user_ids JSONB DEFAULT '[]'::jsonb
);

ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS used_by_user_ids JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS custom_slip_limit INT NULL;

-- 5. Coupon Redemptions Log Table
CREATE TABLE IF NOT EXISTS public.coupon_redemptions (
    id TEXT PRIMARY KEY,
    coupon_id TEXT NOT NULL,
    coupon_code VARCHAR(50) NOT NULL,
    user_id TEXT NOT NULL,
    user_email TEXT,
    redeemed_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_slips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_redemptions ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies (Safe drop & create)
DROP POLICY IF EXISTS "Allow all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow all admin_settings" ON public.admin_settings;
DROP POLICY IF EXISTS "Allow all audit_slips" ON public.audit_slips;
DROP POLICY IF EXISTS "Allow all coupons" ON public.coupons;
DROP POLICY IF EXISTS "Allow all coupon_redemptions" ON public.coupon_redemptions;

-- IMPORTANT SECURITY FIX: Only allow users to read their own profile. Lock everything else down.
  -- The admin dashboard uses Server Actions (Service Key) which bypasses RLS safely.
  CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING ((select auth.uid()::text) = id);

-- 8. Seed Default Settings & Coupons (Safe Upsert)
INSERT INTO public.admin_settings (id, admin_pin, free_tier_daily_limit, pro_tier_daily_limit, premium_tier_daily_limit)
VALUES ('global', 'saqib786', 3, 15, 999999)
ON CONFLICT (id) DO UPDATE 
SET free_tier_daily_limit = COALESCE(EXCLUDED.free_tier_daily_limit, 3),
    pro_tier_daily_limit = COALESCE(EXCLUDED.pro_tier_daily_limit, 15),
    premium_tier_daily_limit = COALESCE(EXCLUDED.premium_tier_daily_limit, 999999);

INSERT INTO public.coupons (id, code, type, title, duration_days, max_uses, used_count, is_active, created_at)
VALUES 
    ('cpn-1', '7862', 'pro', 'Pro Access 30 Days (4-Digit)', 30, 15, 0, true, NOW()),
    ('cpn-2', '98241', 'premium', 'Premium Unlimited Access (5-Digit)', 365, 10, 0, true, NOW()),
    ('cpn-3', 'SYSTEM3D', 'custom', 'Special 3 Days (25 Slips/Day)', 3, 20, 0, true, NOW())
ON CONFLICT (code) DO NOTHING;
`;
    navigator.clipboard.writeText(sql);
    setSqlCopied(true);
    setTimeout(() => setSqlCopied(false), 3000);
  };

    return (
      <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Admin Header Bar */}
      <div className="bg-gradient-to-r from-[#18201B] via-[#0E1510] to-[#18201B] border border-white/10 rounded-3xl p-5 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-[#00A859]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-[#00A859]/60 shrink-0 shadow-md">
              <img src={creatorPhotoBase64} alt="Admin" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight">System Master Control Console</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#00A859]/20 border border-[#00A859]/40 text-[#4ADE80] font-black text-[10px]">
                  <ShieldCheck className="w-3 h-3" />
                  SUPER ADMIN
                </span>
              </div>
              <p className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                <span>Manage Users, Durations (1M/3M/6M/1Y/Life), Tier Quotas &amp; Supabase DB</span>
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Supabase Connection Status Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-gray-300 font-mono">Supabase:</span>
              <span className="text-emerald-400 font-bold">Connected</span>
            </div>

            <button
              type="button"
              onClick={refreshData}
              disabled={isLoadingUsers}
              title="Refresh from Supabase Cloud"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingUsers ? 'animate-spin text-emerald-400' : ''}`} />
              <span>Sync Cloud</span>
            </button>

            <button
              type="button"
              onClick={() => openCreateCoupon('pro')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>+ Promo Code</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAddUserModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#00A859] to-[#008F4C] hover:from-[#00BA63] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add User</span>
            </button>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                title="Exit Admin Panel and Return to Studio"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                <span>← Back to Studio</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleLogout}
              title="Lock Admin Console"
              className="p-2 rounded-xl bg-white/10 hover:bg-rose-900/40 text-gray-300 hover:text-rose-400 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-white border border-[#ECE6E7] rounded-2xl p-1.5 flex items-center gap-1 overflow-x-auto no-scrollbar shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'users'
              ? 'bg-[#1E1B1C] text-white shadow-xs'
              : 'text-gray-600 hover:text-black hover:bg-gray-100'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-blue-500" />
          <span>Users &amp; Subscriptions ({usersList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('coupons')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'coupons'
              ? 'bg-[#1E1B1C] text-white shadow-xs'
              : 'text-gray-600 hover:text-black hover:bg-gray-100'
          }`}
        >
          <Ticket className="w-3.5 h-3.5 text-amber-500" />
          <span>Coupons &amp; Promo Codes ({couponsList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'security'
              ? 'bg-[#1E1B1C] text-white shadow-xs'
              : 'text-gray-600 hover:text-black hover:bg-gray-100'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Tier Quotas &amp; Limits</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-[#1E1B1C] text-white shadow-xs'
              : 'text-gray-600 hover:text-black hover:bg-gray-100'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-indigo-500" />
          <span>Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('engines')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'engines'
              ? 'bg-[#1E1B1C] text-white shadow-xs'
              : 'text-gray-600 hover:text-black hover:bg-gray-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-[#84142D]" />
          <span>Engine Controls ({enabledEnginesCount}/7)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('broadcast')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'broadcast'
              ? 'bg-[#1E1B1C] text-white shadow-xs'
              : 'text-gray-600 hover:text-black hover:bg-gray-100'
          }`}
        >
          <Megaphone className="w-3.5 h-3.5 text-amber-500" />
          <span>Broadcast Banner</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'logs'
              ? 'bg-[#1E1B1C] text-white shadow-xs'
              : 'text-gray-600 hover:text-black hover:bg-gray-100'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Audit Logs ({auditLogs.length || history.length})</span>
        </button>
      </div>

      {/* Action Success Alert Banner */}
      {userActionSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-extrabold flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00A859] shrink-0" />
            <span>{userActionSuccess}</span>
          </div>
          <button
            type="button"
            onClick={() => setUserActionSuccess(null)}
            className="text-emerald-700 hover:text-emerald-950 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* TAB: USERS & SUBSCRIPTIONS */}
      {activeTab === 'users' && (
        <div className="bg-white border border-[#ECE6E7] rounded-3xl p-6 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-[#1E1B1C]">User Management &amp; Tier Control</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  {usersList.length} Registered Accounts
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Customize every user&apos;s plan &amp; validity duration: <strong>1 Month, 3 Months, 6 Months, 1 Year, Lifetime, or Custom Days</strong>.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddUserModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#84142D] hover:bg-[#681023] text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create New Account</span>
            </button>
          </div>

          {/* Search Bar & Filters */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <input
                type="text"
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                placeholder="Search by Email (e.g. gmail.com), Username, or ID (e.g. USR-8291)..."
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#84142D] focus:bg-white"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Plan Filter Buttons */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs shrink-0">
              <button
                type="button"
                onClick={() => setPlanFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  planFilter === 'all' ? 'bg-white text-black shadow-xs' : 'text-gray-600 hover:text-black'
                }`}
              >
                All ({usersList.length})
              </button>
              <button
                type="button"
                onClick={() => setPlanFilter('free')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  planFilter === 'free' ? 'bg-white text-black shadow-xs' : 'text-gray-600 hover:text-black'
                }`}
              >
                Free ({freeUsersCount})
              </button>
              <button
                type="button"
                onClick={() => setPlanFilter('pro')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  planFilter === 'pro' ? 'bg-blue-600 text-white shadow-xs' : 'text-blue-700 hover:bg-white/60'
                }`}
              >
                Pro ({proUsersCount})
              </button>
              <button
                type="button"
                onClick={() => setPlanFilter('premium')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  planFilter === 'premium' ? 'bg-amber-500 text-white shadow-xs' : 'text-amber-800 hover:bg-white/60'
                }`}
              >
                Premium ({premiumUsersCount})
              </button>
              <button
                type="button"
                onClick={() => setPlanFilter('custom')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  planFilter === 'custom' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-800 hover:bg-white/60'
                }`}
              >
                Custom ({customUsersCount})
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto border border-gray-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold">
                  <th className="py-3 px-3">User ID</th>
                  <th className="py-3 px-3">Email &amp; Username</th>
                  <th className="py-3 px-3">Active Plan</th>
                  <th className="py-3 px-3">Daily Slips Quota</th>
                  <th className="py-3 px-3">Expiry Date / Duration</th>
                  <th className="py-3 px-3 text-center">Manage Tier &amp; Validity</th>
                  <th className="py-3 px-3 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-gray-400">
                      No user accounts match your search filter.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isPremium = u.plan === 'premium';
                    const isPro = u.plan === 'pro';
                    const isFree = u.plan === 'free';
                    const isCustom = u.plan === 'custom';

                    return (
                      <tr key={u.id} className="hover:bg-gray-50/80 transition-colors">
                        {/* Custom ID */}
                        <td className="py-3 px-3 font-mono font-bold text-[#1E1B1C]">
                          <span className="bg-gray-100 border border-gray-300 px-2 py-0.5 rounded text-[11px]">
                            {u.customId}
                          </span>
                        </td>

                        {/* Email & Username */}
                        <td className="py-3 px-3">
                          <div className="font-bold text-[#1E1B1C]">{u.email}</div>
                          <div className="text-[10px] text-gray-400 font-mono">
                            @{u.username}
                            {u.redeemedCouponCode && (
                              <span className="ml-1 text-amber-700 bg-amber-50 px-1 rounded border border-amber-200">
                                🎟️ {u.redeemedCouponCode}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Active Plan */}
                        <td className="py-3 px-3">
                          {isPremium && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 font-extrabold text-[10px]">
                              <Crown className="w-3 h-3 text-amber-600" />
                              PREMIUM
                            </span>
                          )}
                          {isPro && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-300 font-extrabold text-[10px]">
                              <Zap className="w-3 h-3 text-blue-600" />
                              PRO
                            </span>
                          )}
                          {isCustom && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 font-extrabold text-[10px]">
                              <Sliders className="w-3 h-3 text-emerald-600" />
                              CUSTOM
                            </span>
                          )}
                          {isFree && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-300 font-bold text-[10px]">
                                FREE
                              </span>
                            )}
                            
                          </td>

                        {/* Quota */}
                        <td className="py-3 px-3 text-gray-700 font-bold">
                          {isPremium ? (
                            <span className="text-amber-800 font-black">
                              {localSettings.premiumTierDailyLimit >= 999999 ? 'Unlimited' : `${localSettings.premiumTierDailyLimit} slips / day`}
                            </span>
                          ) : isPro ? (
                            <span className="text-blue-900">
                              {localSettings.proTierDailyLimit || 15} slips / day
                            </span>
                          ) : isCustom ? (
                            <span className="text-emerald-800">
                              {u.customDailyLimit || 25} slips / day
                            </span>
                          ) : (
                            <span className="text-gray-600">
                              {localSettings.freeTierDailyLimit || 3} slips / day
                            </span>
                          )}
                        </td>

                        {/* Expiry */}
                        <td className="py-3 px-3 text-gray-500 text-[11px]">
                          {u.expiresAt ? (
                            <span className="flex items-center gap-1 text-blue-700 font-medium">
                              <Calendar className="w-3 h-3" />
                              {new Date(u.expiresAt).toLocaleDateString()}
                            </span>
                          ) : (
                            <span className="text-emerald-700 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Lifetime / Ongoing
                            </span>
                          )}
                        </td>

                        {/* Manage Tier Button */}
                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => openSubscriptionModal(u)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#1E1B1C] hover:bg-black text-white font-extrabold text-[11px] shadow-xs transition-all cursor-pointer"
                          >
                            <Settings className="w-3 h-3 text-amber-400" />
                            <span>Manage Plan &amp; Days</span>
                          </button>
                        </td>

                        {/* Delete User */}
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u.id, u.email)}
                            title="Delete this user account"
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: TIER QUOTAS & LIMITS (GLOBAL PER-DAY SLIP LIMITS FOR FREE, PRO, PREMIUM) */}
      {activeTab === 'security' && (
        <div className="bg-white border border-[#ECE6E7] rounded-3xl p-6 shadow-2xs space-y-6">
          <div>
            <h2 className="text-base font-extrabold text-[#1E1B1C]">Tier Quotas &amp; Daily Slips Configuration</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Set how many slips Free, Pro, and Premium accounts can generate per day globally across the entire platform.
            </p>
          </div>

          <div className="space-y-4">
            {/* 3 Tier Daily Limits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Free Tier Limit */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-gray-800">Free / Guest Tier Limit</span>
                  {localSettings.freeTierDailyLimit === 0 ? (
                    <span className="text-[10px] font-black px-2 py-0.5 bg-amber-200 text-amber-900 rounded-full">
                      🔒 DEMO ONLY (0 REAL)
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-200 rounded-full text-gray-700">
                      {localSettings.freeTierDailyLimit} REAL / DAY
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={localSettings.freeTierDailyLimit ?? 0}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      handleSaveSettings({ freeTierDailyLimit: isNaN(val) ? 0 : Math.max(0, val) });
                    }}
                    className="w-24 px-3 py-2 text-sm font-bold bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-[#84142D]"
                  />
                  <span className="text-xs text-gray-600 font-semibold">real slips / day</span>
                </div>

                {/* Quick Presets for Free Tier */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => handleSaveSettings({ freeTierDailyLimit: 0 })}
                    className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                      localSettings.freeTierDailyLimit === 0
                        ? 'bg-amber-500 text-white shadow-2xs'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    0 (Demo Only)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveSettings({ freeTierDailyLimit: 2 })}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      localSettings.freeTierDailyLimit === 2
                        ? 'bg-[#84142D] text-white shadow-2xs'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    2 Slips / Day
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveSettings({ freeTierDailyLimit: 3 })}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      localSettings.freeTierDailyLimit === 3
                        ? 'bg-[#84142D] text-white shadow-2xs'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    3 Slips / Day
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveSettings({ freeTierDailyLimit: 5 })}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      localSettings.freeTierDailyLimit === 5
                        ? 'bg-[#84142D] text-white shadow-2xs'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    5 Slips / Day
                  </button>
                </div>

                <p className="text-[10px] text-gray-500 leading-tight">
                  {localSettings.freeTierDailyLimit === 0
                    ? '0 ka matlab: Free users real receipt edit nahi kar sakenge, sirf default demo slip max 4 prints test kar sakenge.'
                    : `Free users rozana ${localSettings.freeTierDailyLimit} real editable receipts download kar sakte hain.`}
                </p>
              </div>

              {/* Pro Tier Limit */}
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-blue-950">Pro Account Daily Limit</span>
                  <span className="text-[10px] font-black px-2 py-0.5 bg-blue-600 text-white rounded-full">PRO</span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={localSettings.proTierDailyLimit || 15}
                    onChange={(e) => handleSaveSettings({ proTierDailyLimit: Math.max(1, parseInt(e.target.value) || 1) })}
                    className="w-24 px-3 py-2 text-sm font-bold bg-white border border-blue-300 rounded-xl focus:outline-none focus:border-blue-600"
                  />
                  <span className="text-xs text-blue-900 font-semibold">slips / day</span>
                </div>
                <p className="text-[10px] text-blue-700 leading-tight">
                  Standard Pro subscription accounts quota (Default: 15 slips/day).
                </p>
              </div>

              {/* Premium Tier Limit */}
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-amber-950">Premium Account Daily Limit</span>
                  <span className="text-[10px] font-black px-2 py-0.5 bg-amber-500 text-white rounded-full">PREMIUM</span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="number"
                    min="1"
                    max="999999"
                    value={localSettings.premiumTierDailyLimit || 999999}
                    onChange={(e) => handleSaveSettings({ premiumTierDailyLimit: Math.max(1, parseInt(e.target.value) || 999999) })}
                    className="w-28 px-3 py-2 text-sm font-bold bg-white border border-amber-300 rounded-xl focus:outline-none focus:border-amber-600"
                  />
                  <span className="text-xs text-amber-900 font-semibold">
                    {localSettings.premiumTierDailyLimit >= 999999 ? '(Unlimited)' : 'slips/day'}
                  </span>
                </div>
                <p className="text-[10px] text-amber-800 leading-tight">
                  Set 999999 for truly unlimited slip generation for Premium tier.
                </p>
              </div>
            </div>

            {/* Toggle Quota Enforcement */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
              <div>
                <span className="text-sm font-bold text-[#1E1B1C] block">
                  Enforce Daily Slip Quotas
                </span>
                <span className="text-xs text-gray-500">
                  When enabled, users exceeding their tier quota are asked to redeem a coupon or upgrade.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.enforceLimit}
                  onChange={(e) => handleSaveSettings({ enforceLimit: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00A859]"></div>
              </label>
            </div>

            {/* Enforce Watermark */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
              <div>
                <span className="text-sm font-bold text-[#1E1B1C] block">
                  Mandatory Watermark Protection
                </span>
                <span className="text-xs text-gray-500">
                  Forces all slips to contain a security watermark tag.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.enforceWatermark}
                  onChange={(e) => handleSaveSettings({ enforceWatermark: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00A859]"></div>
              </label>
            </div>

            {/* Watermark Brand Text */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
              <label className="block text-xs font-bold text-gray-700">
                Watermark Brand Text
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={localSettings.watermarkBrandText}
                  onChange={(e) => handleSaveSettings({ watermarkBrandText: e.target.value })}
                  placeholder="e.g. Verified System Slip"
                  className="flex-1 px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-[#84142D]"
                />
              </div>
            </div>

            {/* Change Admin PIN */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
              <h3 className="text-sm font-bold text-[#1E1B1C] mb-2 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-[#84142D]" />
                Change Master Admin Passcode (PIN)
              </h3>
              <form onSubmit={handleUpdatePin} className="space-y-3 max-w-sm">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">New PIN</label>
                  <input
                    type="password"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    placeholder="Enter new PIN"
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#84142D]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Confirm New PIN</label>
                  <input
                    type="password"
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    placeholder="Confirm new PIN"
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#84142D]"
                  />
                </div>
                {pinChangeMsg && (
                  <p className="text-xs font-semibold text-emerald-700">{pinChangeMsg}</p>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1E1B1C] text-white text-xs font-bold rounded-xl hover:bg-black transition-colors cursor-pointer"
                >
                  Update Passcode &amp; Sync Cloud
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TAB: COUPONS & PROMO CODES */}
      {activeTab === 'coupons' && (
        <div className="bg-white border border-[#ECE6E7] rounded-3xl p-6 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-[#1E1B1C]">Coupon &amp; Promo Code Engine</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                  {couponsList.length} Active Codes
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {totalCouponRedemptions} Total Claims
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Generate Pro codes (15 slips/day), Premium codes (unlimited), or Custom Quota coupons. Set user limits &amp; expiry.
              </p>
            </div>

            {/* Quick Generator Buttons */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => openCreateCoupon('pro')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-extrabold transition-all cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-blue-600" />
                <span>+ Pro Code</span>
              </button>
              <button
                type="button"
                onClick={() => openCreateCoupon('premium')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black transition-all cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5 text-amber-600" />
                <span>+ Premium Code</span>
              </button>
              <button
                type="button"
                onClick={() => openCreateCoupon('custom')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-extrabold transition-all cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                <span>+ Custom Quota</span>
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl text-xs w-fit">
            <button
              type="button"
              onClick={() => setCouponFilter('all')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                couponFilter === 'all' ? 'bg-white text-black shadow-xs' : 'text-gray-600 hover:text-black'
              }`}
            >
              All ({couponsList.length})
            </button>
            <button
              type="button"
              onClick={() => setCouponFilter('pro')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                couponFilter === 'pro' ? 'bg-blue-600 text-white shadow-xs' : 'text-blue-800'
              }`}
            >
              Pro ({couponsList.filter((c) => c.type === 'pro').length})
            </button>
            <button
              type="button"
              onClick={() => setCouponFilter('premium')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                couponFilter === 'premium' ? 'bg-amber-500 text-white shadow-xs' : 'text-amber-800'
              }`}
            >
              Premium ({couponsList.filter((c) => c.type === 'premium').length})
            </button>
            <button
              type="button"
              onClick={() => setCouponFilter('custom')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                couponFilter === 'custom' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-800'
              }`}
            >
              Custom Quota ({couponsList.filter((c) => c.type === 'custom').length})
            </button>
          </div>

          {/* Coupons Table */}
          <div className="overflow-x-auto border border-gray-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold">
                  <th className="py-3 px-3">Coupon Code</th>
                  <th className="py-3 px-3">Type &amp; Tier</th>
                  <th className="py-3 px-3">Benefit &amp; Quota</th>
                  <th className="py-3 px-3">Validity</th>
                  <th className="py-3 px-3">Account Limit / Usage</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCoupons.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-gray-400">
                      No coupon codes found. Click one of the buttons above to create one.
                    </td>
                  </tr>
                ) : (
                  filteredCoupons.map((c) => {
                    const isFull = c.usedCount >= c.maxUses;
                    const percentUsed = Math.min(100, Math.round((c.usedCount / c.maxUses) * 100));

                    return (
                      <tr key={c.id} className="hover:bg-gray-50/80 transition-colors">
                        {/* Code + Copy */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-black text-sm bg-gray-100 border border-gray-300 px-2.5 py-1 rounded-xl text-[#1E1B1C] tracking-wider">
                              {c.code}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyCode(c.code)}
                              title="Copy coupon code"
                              className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          {c.title && (
                            <div className="text-[10px] text-gray-500 mt-0.5">{c.title}</div>
                          )}
                        </td>

                        {/* Type Badge */}
                        <td className="py-3 px-3">
                          {c.type === 'pro' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-300 font-extrabold text-[10px]">
                              <Zap className="w-3 h-3 text-blue-600" />
                              PRO
                            </span>
                          )}
                          {c.type === 'premium' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-300 font-black text-[10px]">
                              <Crown className="w-3 h-3 text-amber-600" />
                              PREMIUM
                            </span>
                          )}
                          {c.type === 'custom' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 font-extrabold text-[10px]">
                              <Sliders className="w-3 h-3 text-emerald-600" />
                              CUSTOM QUOTA
                            </span>
                          )}
                        </td>

                        {/* Benefit */}
                        <td className="py-3 px-3">
                          {c.type === 'pro' && (
                            <span className="font-bold text-blue-900">
                              {localSettings.proTierDailyLimit || 15} Slips / Day
                            </span>
                          )}
                          {c.type === 'premium' && (
                            <span className="font-black text-amber-800">Unlimited Slips</span>
                          )}
                          {c.type === 'custom' && (
                            <span className="font-bold text-emerald-800">
                              {c.customSlipLimit || 25} Slips / Day
                            </span>
                          )}
                        </td>

                        {/* Validity Days */}
                        <td className="py-3 px-3">
                          <span className="font-semibold text-gray-700 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            {c.durationDays} Days Access
                          </span>
                        </td>

                        {/* Account Limit / Progress */}
                        <td className="py-3 px-3 min-w-[130px]">
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="font-bold text-gray-700">
                              {c.usedCount} / {c.maxUses} Used
                            </span>
                            <span className={`text-[10px] font-bold ${isFull ? 'text-rose-600' : 'text-gray-400'}`}>
                              {isFull ? 'Quota Full' : `${c.maxUses - c.usedCount} left`}
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                isFull ? 'bg-rose-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${percentUsed}%` }}
                            />
                          </div>
                        </td>

                        {/* Status Toggle */}
                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleCouponActive(c)}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold transition-colors cursor-pointer ${
                              c.isActive && !isFull
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                            }`}
                          >
                            {isFull ? 'Full' : c.isActive ? 'Active' : 'Disabled'}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-3 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => openEditCoupon(c)}
                              title="Edit Coupon"
                              className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCoupon(c.id, c.code)}
                              title="Delete Coupon"
                              className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: OVERVIEW & ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="bg-white border border-[#ECE6E7] rounded-3xl p-6 shadow-2xs space-y-6">
          <div>
            <h2 className="text-base font-extrabold text-[#1E1B1C]">System Overview &amp; Live Telemetry</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Live statistics of user accounts, coupon claims, generated receipts, and database tables.
            </p>
          </div>

          {/* KPI Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200">
              <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">Total Users</span>
              <div className="text-2xl font-black text-blue-950 mt-1">{totalUsersCount}</div>
              <span className="text-[10px] text-blue-600 font-semibold">{freeUsersCount} Free • {proUsersCount} Pro • {premiumUsersCount} Prem</span>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200">
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">Coupons &amp; Claims</span>
              <div className="text-2xl font-black text-amber-950 mt-1">{totalCouponRedemptions}</div>
              <span className="text-[10px] text-amber-700 font-semibold">{couponsList.length} coupon codes active in system</span>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">Slips Today</span>
              <div className="text-2xl font-black text-emerald-950 mt-1">{usageStats.slipsCreatedToday}</div>
              <span className="text-[10px] text-emerald-600 font-semibold">{usageStats.totalLifetimeSlips} lifetime slips generated</span>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200">
              <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider block">Simulated Volume</span>
              <div className="text-2xl font-black text-purple-950 mt-1">
                PKR {usageStats.totalVolumeSimulated.toLocaleString()}
              </div>
              <span className="text-[10px] text-purple-700 font-semibold">Processed across Pakistani banks</span>
            </div>
          </div>

          
        </div>
      )}

      {/* TAB: ENGINE CONTROLS */}
      {activeTab === 'engines' && (
        <div className="bg-white border border-[#ECE6E7] rounded-3xl p-6 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-extrabold text-[#1E1B1C]">Active Providers &amp; Template Control</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Turn individual transaction engines ON or OFF across the entire platform.
              </p>
            </div>

            {/* Quick Bulk Presets */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleEnableAllProviders}
                className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs cursor-pointer"
              >
                Enable All Engines
              </button>
              <button
                type="button"
                onClick={handleSetVerifiedOnlyProviders}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs cursor-pointer"
              >
                Verified Only (JazzCash + Easypaisa)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(Object.keys(PRESETS) as SlipProvider[]).map((key) => {
              const preset = PRESETS[key];
              const isEnabled = localSettings.enabledProviders[key] !== false;
              const isVerified = key === 'jazzcash' || key === 'easypaisa';

              return (
                <div
                  key={key}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                    isEnabled
                      ? 'bg-white border-gray-200 shadow-2xs'
                      : 'bg-gray-100 border-dashed border-gray-300 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.color }} />
                    <div>
                      <div className="font-extrabold text-xs text-[#1E1B1C]">
                        {preset.name}
                      </div>
                      <div className="text-[10px] text-gray-500">
                        {isVerified ? '✓ 100% Verified Engine' : 'Classic v1 Engine'}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleProvider(key)}
                    className={`px-3 py-1 rounded-full text-[11px] font-extrabold transition-colors cursor-pointer ${
                      isEnabled
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {isEnabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: BROADCAST BANNER */}
      {activeTab === 'broadcast' && (
        <div className="bg-white border border-[#ECE6E7] rounded-3xl p-6 shadow-2xs space-y-6">
          <div>
            <h2 className="text-base font-extrabold text-[#1E1B1C]">Live Broadcast Announcement Bar</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Broadcast announcements to all users visiting the website in real time across the globe.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
              <div>
                <span className="text-sm font-bold text-[#1E1B1C] block">
                  Enable Broadcast Banner
                </span>
                <span className="text-xs text-gray-500">
                  Displays a prominent notification bar across the top of the Studio.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.broadcastBanner.enabled}
                  onChange={(e) =>
                    handleSaveSettings({
                      broadcastBanner: {
                        ...localSettings.broadcastBanner,
                        enabled: e.target.checked,
                      },
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00A859]"></div>
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Broadcast Announcement Text
              </label>
              <textarea
                rows={3}
                value={localSettings.broadcastBanner.text}
                onChange={(e) =>
                  handleSaveSettings({
                    broadcastBanner: {
                      ...localSettings.broadcastBanner,
                      text: e.target.value,
                    },
                  })
                }
                className="w-full p-3 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#84142D]"
                placeholder="Enter live announcement message..."
              />
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="text-gray-500 font-semibold self-center text-[11px]">Quick Presets:</span>
              <button
                type="button"
                onClick={() =>
                  handleSaveSettings({
                    broadcastBanner: {
                      ...localSettings.broadcastBanner,
                      enabled: true,
                      text: '?? Welcome to System! JazzCash & Easypaisa engines are 100% verified.',
                    },
                  })
                }
                className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-semibold cursor-pointer"
              >
                Welcome Announcement
              </button>
              <button
                type="button"
                onClick={() =>
                  handleSaveSettings({
                    broadcastBanner: {
                      ...localSettings.broadcastBanner,
                      enabled: true,
                      text: '⚡ Special Offer: Redeem coupon code 7862 for 30-Day Pro or 98241 for Lifetime Premium!',
                    },
                  })
                }
                className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-semibold cursor-pointer"
              >
                Coupon Code Promo
              </button>
              <button
                type="button"
                onClick={() =>
                  handleSaveSettings({
                    broadcastBanner: {
                      ...localSettings.broadcastBanner,
                      enabled: true,
                      text: '🛠️ Scheduled System Update: New micro-notch geometry added. All systems operating at 100% performance.',
                    },
                  })
                }
                className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-semibold cursor-pointer"
              >
                Engine Update
              </button>
            </div>

            {/* Live Preview of Banner */}
            <div className="p-4 rounded-2xl bg-[#1C2C22] border border-emerald-500/30 text-white text-xs">
              <span className="font-bold text-emerald-400 block mb-1">Live Banner Preview:</span>
              <div className="flex items-center gap-2 text-emerald-200">
                <Megaphone className="w-4 h-4 text-[#00A859] shrink-0" />
                <span className="font-medium">
                  {localSettings.broadcastBanner.text || '(No text configured)'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: AUDIT LOGS */}
      {activeTab === 'logs' && (
        <div className="bg-white border border-[#ECE6E7] rounded-3xl p-6 shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold text-[#1E1B1C]">Transaction Audit &amp; Activity Logs</h2>
              <p className="text-xs text-gray-500">
                Detailed record of simulated slips created across sessions and users.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportLogs}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-[#1E1B1C] font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>
              <button
                type="button"
                onClick={onClearHistory}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Logs</span>
              </button>
            </div>
          </div>

          {/* Log search */}
          <div className="relative">
            <input
              type="text"
              value={logSearch}
              onChange={(e) => setLogSearch(e.target.value)}
              placeholder="Search audit logs by TID, provider, sender or receiver name..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#84142D]"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {filteredLogs.length === 0 && history.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-xs">
              No transactions logged yet. When slips are exported, they will be saved here and in Supabase.
            </div>
          ) : (
            <div className="overflow-x-auto border border-gray-200 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold">
                    <th className="py-2.5 px-3">TID</th>
                    <th className="py-2.5 px-3">Provider</th>
                    <th className="py-2.5 px-3">Sender &amp; Recipient</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">User Email</th>
                    <th className="py-2.5 px-3">Created At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(filteredLogs.length > 0 ? filteredLogs : history.map(h => ({
                    id: h.id,
                    tid: h.tid,
                    provider: h.provider,
                    amount: h.amount,
                    senderName: h.senderName,
                    receiverName: h.recipientName,
                    userEmail: 'Local Session',
                    userPlan: 'standard',
                    createdAt: h.dateTime
                  }))).map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/80">
                      <td className="py-2.5 px-3 font-mono font-bold text-[#1E1B1C]">{item.tid}</td>
                      <td className="py-2.5 px-3 capitalize font-semibold">{item.provider}</td>
                      <td className="py-2.5 px-3 text-gray-700">
                        <div>{item.senderName} → {item.receiverName}</div>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-extrabold text-[#00A859]">
                        PKR {item.amount.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-gray-500 font-mono text-[11px]">{item.userEmail}</td>
                      <td className="py-2.5 px-3 text-gray-500 text-[11px]">{item.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* MODAL: MANAGE USER SUBSCRIPTION & VALIDITY (1M, 3M, 6M, 1Y, LIFETIME, CUSTOM) */}
      {subscriptionModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#1E1B1C]">
                    Manage Tier &amp; Validity Duration
                  </h3>
                  <p className="text-[11px] text-gray-500">{subscriptionModalUser.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSubscriptionModalUser(null)}
                className="text-gray-400 hover:text-black p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUserSubscription} className="space-y-4">
              {/* Target Plan */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1.5">
                  Select Subscription Tier *
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSubModalPlan('free')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      subModalPlan === 'free'
                        ? 'bg-gray-800 text-white border-black shadow-xs'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    Free
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubModalPlan('pro')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      subModalPlan === 'pro'
                        ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                        : 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
                    }`}
                  >
                    Pro
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubModalPlan('premium')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      subModalPlan === 'premium'
                        ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                        : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                    }`}
                  >
                    Premium
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubModalPlan('custom')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      subModalPlan === 'custom'
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    Custom
                  </button>
                </div>
              </div>

              {/* Duration Presets (1 Month, 3 Months, 6 Months, 1 Year, Lifetime, Custom) */}
              {subModalPlan !== 'free' && (
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1.5">
                    Select Validity Period / Duration *
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setSubModalDurationPreset('30')}
                      className={`py-2 px-1 rounded-xl font-bold border text-center transition-all ${
                        subModalDurationPreset === '30'
                          ? 'bg-[#1E1B1C] text-white border-black shadow-xs'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      1 Month (30D)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubModalDurationPreset('90')}
                      className={`py-2 px-1 rounded-xl font-bold border text-center transition-all ${
                        subModalDurationPreset === '90'
                          ? 'bg-[#1E1B1C] text-white border-black shadow-xs'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      3 Months (90D)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubModalDurationPreset('180')}
                      className={`py-2 px-1 rounded-xl font-bold border text-center transition-all ${
                        subModalDurationPreset === '180'
                          ? 'bg-[#1E1B1C] text-white border-black shadow-xs'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      6 Months (180D)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubModalDurationPreset('365')}
                      className={`py-2 px-1 rounded-xl font-bold border text-center transition-all ${
                        subModalDurationPreset === '365'
                          ? 'bg-[#1E1B1C] text-white border-black shadow-xs'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      1 Year (365D)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubModalDurationPreset('lifetime')}
                      className={`py-2 px-1 rounded-xl font-bold border text-center transition-all ${
                        subModalDurationPreset === 'lifetime'
                          ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                          : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                      }`}
                    >
                      👑 Lifetime
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubModalDurationPreset('custom')}
                      className={`py-2 px-1 rounded-xl font-bold border text-center transition-all ${
                        subModalDurationPreset === 'custom'
                          ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                          : 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
                      }`}
                    >
                      Custom Days
                    </button>
                  </div>
                </div>
              )}

              {/* Custom Days Input */}
              {subModalPlan !== 'free' && subModalDurationPreset === 'custom' && (
                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1">
                  <label className="block text-[11px] font-bold text-blue-950">
                    Exact Number of Days:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={subModalCustomDays}
                    onChange={(e) => setSubModalCustomDays(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 text-xs font-bold bg-white border border-blue-300 rounded-xl focus:outline-none focus:border-blue-600"
                  />
                  <span className="text-[10px] text-blue-800">
                    Account will expire in exactly {subModalCustomDays} days from today.
                  </span>
                </div>
              )}

              {/* Custom Slips Limit (if custom plan chosen) */}
              {subModalPlan === 'custom' && (
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
                  <label className="block text-[11px] font-bold text-emerald-950">
                    Custom Daily Slips Limit for this User:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={subModalCustomDailyLimit}
                    onChange={(e) => setSubModalCustomDailyLimit(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 text-xs font-bold bg-white border border-emerald-300 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                  <span className="text-[10px] text-emerald-800">
                    This user will be allowed {subModalCustomDailyLimit} slips per day.
                  </span>
                </div>
              )}

              {/* Summary Preview Box */}
              <div className="p-3.5 rounded-2xl bg-gray-100 border border-gray-200 text-xs">
                <span className="font-extrabold text-gray-800 block mb-0.5">Plan Preview:</span>
                <p className="text-gray-600 leading-tight">
                  User <code className="font-bold text-black">{subscriptionModalUser.username}</code> will be set to{' '}
                  <span className="font-bold text-[#84142D] uppercase">{subModalPlan}</span> tier{' '}
                  {subModalPlan === 'free'
                    ? 'with standard Free limits'
                    : subModalDurationPreset === 'lifetime'
                    ? 'for Lifetime (No Expiry)'
                    : `valid for ${subModalDurationPreset === 'custom' ? subModalCustomDays : subModalDurationPreset} days`}
                  .
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSubscriptionModalUser(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-extrabold bg-[#00A859] hover:bg-[#00914D] text-white shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Apply &amp; Sync to Cloud</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT COUPON */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
                  <Ticket className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#1E1B1C]">
                    {editingCouponId ? 'Edit Coupon Code' : 'Create New Coupon Code'}
                  </h3>
                  <p className="text-[11px] text-gray-500">Configure code, tier, duration &amp; user limit</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCouponModal(false)}
                className="text-gray-400 hover:text-black p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCouponForm} className="space-y-3.5">
              {/* Type Selection */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Coupon Type / Tier *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCouponTypeInput('pro');
                      if (!editingCouponId) {
                        setCouponCodeInput(generate4DigitProCode());
                        setCouponDurationInput(30);
                        setCouponMaxUsesInput(15);
                      }
                    }}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      couponTypeInput === 'pro'
                        ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    Pro
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCouponTypeInput('premium');
                      if (!editingCouponId) {
                        setCouponCodeInput(generate5DigitPremiumCode());
                        setCouponDurationInput(365);
                        setCouponMaxUsesInput(10);
                      }
                    }}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      couponTypeInput === 'premium'
                        ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    Prem (5-Digit)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCouponTypeInput('custom');
                      if (!editingCouponId) {
                        setCouponCodeInput(generateCustomCouponCode());
                        setCouponDurationInput(3);
                        setCouponCustomLimitInput(25);
                        setCouponMaxUsesInput(20);
                      }
                    }}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      couponTypeInput === 'custom'
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    Custom Quota
                  </button>
                </div>
              </div>

              {/* Coupon Code Input + Generator */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-gray-700">
                    Coupon Code *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (couponTypeInput === 'pro') setCouponCodeInput(generate4DigitProCode());
                      else if (couponTypeInput === 'premium') setCouponCodeInput(generate5DigitPremiumCode());
                      else setCouponCodeInput(generateCustomCouponCode());
                    }}
                    className="text-[10px] font-bold text-[#84142D] hover:underline"
                  >
                    Generate Random
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={couponCodeInput}
                  onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                  placeholder={couponTypeInput === 'pro' ? 'e.g. 7862' : couponTypeInput === 'premium' ? 'e.g. 98241' : 'e.g. VIP3D'}
                  className="w-full px-3 py-2 text-sm font-mono font-black uppercase bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-[#84142D]"
                />
              </div>

              {/* Title / Label */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Description / Title (Optional)
                </label>
                <input
                  type="text"
                  value={couponTitleInput}
                  onChange={(e) => setCouponTitleInput(e.target.value)}
                  placeholder="e.g. Eid Mubarak Special Pro Access"
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-[#84142D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Duration Days */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Validity (Days) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="730"
                    value={couponDurationInput}
                    onChange={(e) => setCouponDurationInput(Math.max(1, parseInt(e.target.value) || 30))}
                    className="w-full px-3 py-2 text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-[#84142D]"
                  />
                  <span className="text-[10px] text-gray-400">e.g. 30, 365, or 3 days</span>
                </div>

                {/* Max User Accounts Allowed */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Max User Accounts *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={couponMaxUsesInput}
                    onChange={(e) => setCouponMaxUsesInput(Math.max(1, parseInt(e.target.value) || 10))}
                    className="w-full px-3 py-2 text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-[#84142D]"
                  />
                  <span className="text-[10px] text-gray-400">e.g. max 10 or 15 users</span>
                </div>
              </div>

              {/* Custom Slips Limit (if custom type) */}
              {couponTypeInput === 'custom' && (
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
                  <label className="block text-[11px] font-bold text-emerald-950">
                    Custom Daily Slips Limit *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={couponCustomLimitInput}
                    onChange={(e) => setCouponCustomLimitInput(Math.max(1, parseInt(e.target.value) || 25))}
                    className="w-full px-3 py-2 text-xs font-bold bg-white border border-emerald-300 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                  <span className="text-[10px] text-emerald-800">
                    User will be granted this custom daily receipt quota.
                  </span>
                </div>
              )}

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-xs font-bold text-gray-800">Coupon Active Status</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={couponIsActiveInput}
                    onChange={(e) => setCouponIsActiveInput(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00A859]"></div>
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCouponModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-extrabold bg-[#00A859] hover:bg-[#00914D] text-white shadow-md cursor-pointer"
                >
                  {editingCouponId ? 'Save Changes' : 'Create Coupon Code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW USER */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-50 text-[#00A859] rounded-xl">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#1E1B1C]">Create New User Account</h3>
                  <p className="text-[11px] text-gray-500">Directly provision account in Supabase</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddUserModal(false)}
                className="text-gray-400 hover:text-black p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewUser} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. merchant@gmail.com"
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-[#84142D]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Username (Optional)
                </label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="e.g. SystemTrader"
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-[#84142D]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Subscription Tier *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewPlan('free')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      newPlan === 'free'
                        ? 'bg-gray-800 text-white border-black shadow-xs'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    Free
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewPlan('pro')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      newPlan === 'pro'
                        ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                        : 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
                    }`}
                  >
                    Pro
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewPlan('premium')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      newPlan === 'premium'
                        ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                        : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                    }`}
                  >
                    Premium
                  </button>
                </div>
              </div>

              {newPlan === 'pro' && (
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Pro Validity Period (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={newDuration}
                    onChange={(e) => setNewDuration(Math.max(1, parseInt(e.target.value) || 30))}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-[#84142D]"
                  />
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-extrabold bg-[#00A859] hover:bg-[#00914D] text-white shadow-md cursor-pointer"
                >
                  Create &amp; Provision User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

