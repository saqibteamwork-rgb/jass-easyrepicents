import { supabase } from './supabase';
import { adminFetchCoupons, adminCreateCoupon, adminUpdateCoupon, adminDeleteCoupon } from '../app/actions/directAdminCoupons';
import { Coupon, CouponType, CouponRedemptionResult } from '../types/coupon';
import { UserProfile, UserPlan } from '../types/auth';
import { saveCurrentUser, getCurrentUser, saveUsers, getAllUsers } from './authService';

const COUPONS_STORAGE_KEY = 'saqib_coupons_v1';

// Seed default initial coupons if empty
const getInitialCoupons = (): Coupon[] => {
  const saved = localStorage.getItem(COUPONS_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {}
  }

  return [
    {
      id: 'cpn-pro-1',
      code: '7862', // 4-digit Pro Coupon
      type: 'pro',
      title: 'Pro Access 30 Days (4-Digit)',
      durationDays: 30,
      maxUses: 15,
      usedCount: 2,
      isActive: true,
      createdAt: new Date().toISOString(),
      expiresAt: null,
      usedByUserIds: ['demo-1', 'demo-2'],
    },
    {
      id: 'cpn-prem-1',
      code: '98241', // 5-digit Premium Coupon
      type: 'premium',
      title: 'Premium Unlimited Access (5-Digit)',
      durationDays: 365,
      maxUses: 10,
      usedCount: 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      expiresAt: null,
      usedByUserIds: ['demo-2'],
    },
    {
      id: 'cpn-cust-1',
      code: 'CRIMSON3D', // Custom Quota Coupon
      type: 'custom',
      title: 'Special 3 Days (25 Slips/Day)',
      durationDays: 3,
      maxUses: 20,
      usedCount: 0,
      customSlipLimit: 25,
      isActive: true,
      createdAt: new Date().toISOString(),
      expiresAt: null,
      usedByUserIds: [],
    },
  ];
};

/**
 * Fetch all coupons from Supabase (fallback to localStorage)
 */
export async function fetchCoupons(): Promise<Coupon[]> {
  let localCoupons = getInitialCoupons();

  try {
    const { data, error } = await adminFetchCoupons();

    

      if (data && !error && data.length > 0) {
      const mapped: Coupon[] = data.map((d: any) => ({
        id: d.id,
        code: d.code,
        type: d.type as CouponType,
        title: d.title || `${d.type.toUpperCase()} Coupon`,
        durationDays: d.duration_days || 30,
        maxUses: d.max_uses || 10,
        usedCount: d.used_count || 0,
        customSlipLimit: d.custom_slip_limit,
        isActive: d.is_active ?? true,
        createdAt: d.created_at,
        expiresAt: d.expires_at || null,
        usedByUserIds: Array.isArray(d.used_by_user_ids) ? d.used_by_user_ids : [],
      }));

      localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(mapped));
      return mapped;
    }
  } catch (err) {
    console.warn('Supabase coupons fetch notice:', err);
  }

  return localCoupons;
}

/**
 * Save / Create a new coupon in Supabase and local cache
 */
export async function createCoupon(coupon: Omit<Coupon, 'id' | 'createdAt' | 'usedCount' | 'usedByUserIds'>): Promise<Coupon> {
  const newCoupon: Coupon = {
    ...coupon,
    id: 'cpn-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    usedCount: 0,
    usedByUserIds: [],
    createdAt: new Date().toISOString(),
  };

  // 1. Local Cache
  const existing = getInitialCoupons();
  const updated = [newCoupon, ...existing];
  localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(updated));

  // 2. Supabase Cloud Sync
  try {
    const payload = {
          id: newCoupon.id,
          code: newCoupon.code.trim().toUpperCase(),
          type: newCoupon.type,
          title: newCoupon.title,
          duration_days: newCoupon.durationDays,
          max_uses: newCoupon.maxUses,
          used_count: 0,
          custom_slip_limit: newCoupon.customSlipLimit || null,
          is_active: newCoupon.isActive,
          created_at: newCoupon.createdAt,
          expires_at: newCoupon.expiresAt || null,
          used_by_user_ids: [],
        };
        const { error } = await adminCreateCoupon(payload);
      
  } catch (err) {
    console.warn('Supabase insert coupon notice:', err);
  }

  return newCoupon;
}

/**
 * Update an existing coupon
 */
export async function updateCoupon(id: string, updates: Partial<Coupon>): Promise<boolean> {
  const existing = getInitialCoupons();
  const updated = existing.map((c) => (c.id === id ? { ...c, ...updates } : c));
  localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(updated));

  try {
    const payload: any = {};
    if (updates.code !== undefined) payload.code = updates.code.trim().toUpperCase();
    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.durationDays !== undefined) payload.duration_days = updates.durationDays;
    if (updates.maxUses !== undefined) payload.max_uses = updates.maxUses;
    if (updates.customSlipLimit !== undefined) payload.custom_slip_limit = updates.customSlipLimit;
    if (updates.isActive !== undefined) payload.is_active = updates.isActive;

    await adminUpdateCoupon(id, payload);
  } catch (err) {}

  return true;
}

/**
 * Delete a coupon
 */
export async function deleteCoupon(id: string): Promise<boolean> {
  const existing = getInitialCoupons();
  const filtered = existing.filter((c) => c.id !== id);
  localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(filtered));

  try {
    await adminDeleteCoupon(id);
  } catch (err) {}

  return true;
}

/**
 * Redeem a Coupon for the current user
 */
export async function redeemCoupon(
  code: string,
  user: UserProfile
): Promise<CouponRedemptionResult> {
  try {
    const { userRedeemCouponAction } = await import('../app/actions/userRedeemCoupon');
    const result = await userRedeemCouponAction(user.id, code);

    if (!result.success) {
      return { success: false, message: result.message };
    }

    // Update User Profile Locally
    const targetPlan = result.targetPlan as UserPlan || 'free';
    const updatedUser: UserProfile = {
      ...user,
      plan: targetPlan,
      expiresAt: result.expiresAt || null,
      customDailyLimit: result.customLimit,
      redeemedCouponCode: code.toUpperCase(),
    };

    saveCurrentUser(updatedUser);

    // Update in all users list locally
    const allUsers = getAllUsers();
    const updatedAllUsers = allUsers.map((u) => (u.id === user.id ? updatedUser : u));
    saveUsers(updatedAllUsers);

    return {
      success: true,
      message: `Congratulations! ${targetPlan.toUpperCase()} access unlocked successfully!`,
      
    };
  } catch (err) {
    console.error('Redeem error:', err);
    return { success: false, message: 'Server error while redeeming coupon. Please try again.' };
  }
}

/**
 * Random 4-digit code generator for PRO coupons
 */
export function generate4DigitProCode(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

/**
 * Random 5-digit code generator for PREMIUM coupons
 */
export function generate5DigitPremiumCode(): string {
  return String(Math.floor(10000 + Math.random() * 90000));
}

/**
 * Random Custom code generator
 */
export function generateCustomCouponCode(): string {
  const letters = 'CRIMSONVIP';
  const num = Math.floor(100 + Math.random() * 900);
  return `${letters.slice(0, 5)}${num}`;
}

