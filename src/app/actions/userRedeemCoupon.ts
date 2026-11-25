'use server';

import { supabaseAdmin } from '../../lib/supabase-server';
import { CouponRedemptionResult } from '../../types/coupon';

export async function userRedeemCouponAction(
  userId: string,
  code: string,
  customDailyLimitFallback: number = 25
): Promise<{ success: boolean; message: string; targetPlan?: string; expiresAt?: string | null; customLimit?: number }> {
  const searchCode = code.trim().toUpperCase();

  // Fetch coupon securely with admin privileges
  const { data: coupon, error } = await supabaseAdmin
    .from('coupons')
    .select('*')
    .eq('code', searchCode)
    .single();

  if (error || !coupon) {
    return { success: false, message: 'Invalid coupon code. Please check and try again.' };
  }

  if (!coupon.is_active) {
    return { success: false, message: 'This coupon code is currently disabled by Admin.' };
  }

  if (coupon.used_count >= coupon.max_uses) {
    return { success: false, message: `Coupon quota filled! This coupon had a limit of ${coupon.max_uses} users and is now expired.` };
  }

  const usedBy = Array.isArray(coupon.used_by_user_ids) ? coupon.used_by_user_ids : [];
  if (usedBy.includes(userId)) {
    return { success: false, message: 'You have already redeemed this coupon.' };
  }

  // Calculate new expiration date
  let durationDays = coupon.duration_days || 30;
  
  const newExpiry = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();
  const expiresAtFinal = coupon.type === 'premium' ? null : newExpiry;
  const customLimit = coupon.type === 'custom' ? (coupon.custom_slip_limit || customDailyLimitFallback) : undefined;

  // Update User Profile
  const payload: any = {
    plan: coupon.type,
    expires_at: expiresAtFinal,
    redeemed_coupon_code: searchCode,
  };
  if (customLimit !== undefined) {
    payload.custom_daily_limit = customLimit;
  }

  const { error: updateError } = await supabaseAdmin
    .from('profiles')
    .update(payload)
    .eq('id', userId);

  if (updateError) {
    console.error('Update profile error:', updateError);
    return { success: false, message: 'Failed to apply coupon: ' + updateError.message };
  }

  // Increment coupon uses and record user ID
  await supabaseAdmin
    .from('coupons')
    .update({ 
      used_count: coupon.used_count + 1,
      used_by_user_ids: [...usedBy, userId]
    })
    .eq('id', coupon.id);

  return {
    success: true,
    message: 'Coupon applied successfully!',
    targetPlan: coupon.type,
    expiresAt: expiresAtFinal,
    customLimit,
  };
}
