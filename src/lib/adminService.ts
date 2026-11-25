import { supabase } from './supabase';
import { adminFetchSettings, adminFetchUsers, adminUpdateUserPlan as directAdminUpdateUserPlan, adminCreateUser as directAdminCreateUser, adminDeleteUser as directAdminDeleteUser, adminFetchAuditLogs, adminSaveSettings } from '../app/actions/directAdminSystem';
import { AdminSettings, DEFAULT_ADMIN_SETTINGS } from '../types/admin';
import { UserProfile, UserPlan } from '../types/auth';
import { SlipData } from '../types/slip';

const ADMIN_STORAGE_KEY = 'saqib_admin_settings_v1';
const USERS_STORAGE_KEY = 'saqib_all_users_v1';
const AUDIT_STORAGE_KEY = 'saqib_audit_logs_v1';

export interface AuditSlipRecord {
  id: string;
  tid: string;
  provider: string;
  amount: number;
  senderName: string;
  receiverName: string;
  userEmail: string;
  userPlan: string;
  createdAt: string;
}

/**
 * Fetch Admin Settings: checks Supabase first, falls back to localStorage
 */
export async function fetchAdminSettings(): Promise<AdminSettings> {
  let local: AdminSettings = DEFAULT_ADMIN_SETTINGS;
  const saved = localStorage.getItem(ADMIN_STORAGE_KEY);
  if (saved) {
    try {
      local = { ...DEFAULT_ADMIN_SETTINGS, ...JSON.parse(saved) };
    } catch (e) {}
  }

  try {
    const { data, error } = await adminFetchSettings();

    if (data && !error) {
      const merged: AdminSettings = {
        ...local,
        adminPin: local.adminPin,
        dailySlipLimit: data.daily_slip_limit ?? local.dailySlipLimit,
        freeTierDailyLimit: data.free_tier_daily_limit ?? local.freeTierDailyLimit ?? 3,
        proTierDailyLimit: data.pro_tier_daily_limit ?? local.proTierDailyLimit ?? 15,
        premiumTierDailyLimit: data.premium_tier_daily_limit ?? local.premiumTierDailyLimit ?? 999999,
        enforceLimit: data.enforce_limit ?? local.enforceLimit,
        enforceWatermark: data.enforce_watermark ?? local.enforceWatermark,
        watermarkBrandText: data.watermark_brand_text || local.watermarkBrandText,
        allowClassicEngines: data.allow_classic_engines ?? local.allowClassicEngines,
        enabledProviders: data.enabled_providers || local.enabledProviders,
        broadcastBanner: data.broadcast_banner || local.broadcastBanner,
      };
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }
  } catch (err) {
    console.warn('Supabase admin_settings fetch notice:', err);
  }

  return local;
}

/**
 * Save Admin Settings: updates localStorage and Supabase
 */
  export async function saveAdminSettings(settings: AdminSettings, pin: string = 'saqib786'): Promise<boolean> {
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(settings));
  
    try {
      const fullPayload: any = {
        id: 'global',
        
        daily_slip_limit: settings.dailySlipLimit,
        free_tier_daily_limit: settings.freeTierDailyLimit,
        pro_tier_daily_limit: settings.proTierDailyLimit,
        premium_tier_daily_limit: settings.premiumTierDailyLimit,
        enforce_limit: settings.enforceLimit,
        enforce_watermark: settings.enforceWatermark,
        watermark_brand_text: settings.watermarkBrandText,
        allow_classic_engines: settings.allowClassicEngines,
        enabled_providers: settings.enabledProviders,
        broadcast_banner: settings.broadcastBanner,
        updated_at: new Date().toISOString(),
      };
  
      await adminSaveSettings(fullPayload);
  
      return true;
    } catch (err) {
      console.warn('Server Action admin_settings notice:', err);
      return true;
    }
  }

/**
 * Fetch All Users: reads from Supabase profiles, merges with local cache
 */
export async function fetchAllUsers(): Promise<UserProfile[]> {
  let localUsers: UserProfile[] = [];
  const saved = localStorage.getItem(USERS_STORAGE_KEY);
  if (saved) {
    try {
      localUsers = JSON.parse(saved);
    } catch (e) {}
  }

  try {
    const { data, error } = await adminFetchUsers();

    if (data && !error && data.length > 0) {
      const mapped: UserProfile[] = data.map((row: any) => ({
        id: row.id,
        customId: row.custom_id || `USR-${row.id.slice(0, 4)}`,
        email: row.email,
        username: row.username || row.email?.split('@')[0],
        plan: (row.plan as UserPlan) || 'free',
        createdAt: row.created_at,
        expiresAt: row.expires_at || null,
        slipsCreatedToday: row.slips_created_today || 0,
        totalSlipsCreated: row.total_slips_created || 0,
          customDailyLimit: row.custom_daily_limit || undefined,
          redeemedCouponCode: row.redeemed_coupon_code || undefined,
        }));

      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(mapped));
      return mapped;
    }
  } catch (err) {
    console.warn('Supabase profiles fetch notice:', err);
  }

  return localUsers.length > 0 ? localUsers : [
    {
      id: 'demo-user-1',
      customId: 'USR-8291',
      email: 'demo@crimsonledger.com',
      username: 'DemoTester',
      plan: 'free',
      createdAt: new Date().toISOString(),
      expiresAt: null,
      slipsCreatedToday: 1,
      totalSlipsCreated: 4,
    },
    {
      id: 'demo-user-2',
      customId: 'USR-4019',
      email: 'pro_merchant@gmail.com',
      username: 'HamzaTrader',
      plan: 'pro',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      slipsCreatedToday: 5,
      totalSlipsCreated: 42,
    },
  ];
}

/**
 * Update user plan in both Supabase and localStorage
 */
export async function adminUpdateUserPlan(
  userId: string,
  newPlan: UserPlan,
  durationDays: number | null = 30,
  customDailyLimit?: number,
  pin: string = 'saqib786'
): Promise<boolean> {
  const expiresAt =
    durationDays && durationDays > 0
      ? new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString()
      : null;

  // 1. Update Supabase via Server Action
  try {
    await directAdminUpdateUserPlan(userId, newPlan, customDailyLimit, expiresAt);
  } catch (e) {
    console.warn('Server Action Profile Update Failed:', e);
  }

  // 2. Update LocalStorage
  const saved = localStorage.getItem(USERS_STORAGE_KEY);
  if (saved) {
    try {
      const users: UserProfile[] = JSON.parse(saved);
      const updated = users.map((u) => {
        if (u.id === userId || u.customId === userId || u.email === userId) {
          return { 
            ...u, 
            plan: newPlan, 
            expiresAt,
            customDailyLimit: customDailyLimit ?? u.customDailyLimit,
          };
        }
        return u;
      });
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}
  }

  return true;
}

/**
 * Create a new user manually from Admin Panel
 */
  export async function adminCreateUser(
    email: string,
    username: string,
    plan: UserPlan,
    durationDays = 30,
    pin: string = 'saqib786'
  ): Promise<UserProfile> {
    const customId = `USR-${Math.floor(1000 + Math.random() * 9000)}`;
    const authId = 'usr-' + Date.now();
    const expiresAt =
      plan === 'pro'
        ? new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString()
        : null;
  
    const newUser: UserProfile = {
      id: authId,
      customId,
      email: email.trim(),
      username: username.trim() || email.split('@')[0],
      plan,
      createdAt: new Date().toISOString(),
      expiresAt,
      slipsCreatedToday: 0,
      totalSlipsCreated: 0,
    };
  
    // Sync Supabase via Server Action
    try {
      await directAdminCreateUser({
          id: newUser.id,
          custom_id: newUser.customId,
          email: newUser.email,
          username: newUser.username,
          plan: newUser.plan,
          created_at: newUser.createdAt,
          expires_at: newUser.expiresAt,
          slips_created_today: 0,
          total_slips_created: 0,
        });
    } catch (e) {
      console.warn('Server Action Create User Failed:', e);
    }

  // Update localStorage
  const saved = localStorage.getItem(USERS_STORAGE_KEY);
  let users: UserProfile[] = [];
  if (saved) {
    try {
      users = JSON.parse(saved);
    } catch (e) {}
  }
  users.unshift(newUser);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

  return newUser;
}

/**
 * Delete a user from Admin Panel
 */
export async function adminDeleteUser(userId: string, pin: string = 'saqib786'): Promise<boolean> {
  try {
    await directAdminDeleteUser(userId);
  } catch (e) {
    console.warn('Server Action Delete User Failed:', e);
  }

  const saved = localStorage.getItem(USERS_STORAGE_KEY);
  if (saved) {
    try {
      const users: UserProfile[] = JSON.parse(saved);
      const filtered = users.filter((u) => u.id !== userId && u.customId !== userId);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(filtered));
    } catch (e) {}
  }

  return true;
}

/**
 * Record a slip in audit logs (both Supabase & localStorage)
 */
export async function recordAuditSlip(slip: SlipData, user: UserProfile | null): Promise<void> {
  const auditItem: AuditSlipRecord = {
    id: 'log-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    tid: slip.tid,
    provider: slip.provider,
    amount: slip.amount,
    senderName: slip.senderName,
    receiverName: slip.recipientName,
    userEmail: user?.email || 'Guest Demo User',
    userPlan: user?.plan || 'guest',
    createdAt: new Date().toISOString(),
  };

  // 1. LocalStorage
  const saved = localStorage.getItem(AUDIT_STORAGE_KEY);
  let logs: AuditSlipRecord[] = [];
  if (saved) {
    try {
      logs = JSON.parse(saved);
    } catch (e) {}
  }
  logs.unshift(auditItem);
  if (logs.length > 200) logs = logs.slice(0, 200);
  localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(logs));

  // 2. Supabase Cloud Sync
  try {
    const { recordAuditSlipAction } = await import('../app/actions/recordAudit');
    await recordAuditSlipAction(auditItem);
  } catch (e) {}
}

/**
 * Fetch all audit logs (Supabase first, fallback local)
 */
export async function fetchAuditLogs(): Promise<AuditSlipRecord[]> {
  try {
    const { data, error } = await adminFetchAuditLogs();

    if (data && !error && data.length > 0) {
      return data.map((d: any) => ({
        id: d.id,
        tid: d.tid,
        provider: d.provider,
        amount: Number(d.amount),
        senderName: d.sender_name,
        receiverName: d.receiver_name,
        userEmail: d.user_email,
        userPlan: d.user_plan,
        createdAt: d.created_at,
      }));
    }
  } catch (e) {}

  const saved = localStorage.getItem(AUDIT_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {}
  }
  return [];
}

