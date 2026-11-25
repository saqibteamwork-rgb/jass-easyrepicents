'use server';

import { supabaseAdmin } from '../../lib/supabase-server';

export async function incrementQuotaAction(userId: string): Promise<{ success: boolean; message: string }> {
  try {
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('plan, custom_daily_limit, slips_created_today, last_slip_date, total_slips_created')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      return { success: false, message: 'DB Error: ' + (error?.message || 'User not found') };
    }

    const { data: adminSettings } = await supabaseAdmin.from('admin_settings').select('*').single();
    
    // Determine limit
    let limit = adminSettings?.free_tier_daily_limit ?? 3;
    if (profile.plan === 'pro') limit = adminSettings?.pro_tier_daily_limit ?? 15;
    if (profile.plan === 'premium') limit = adminSettings?.premium_tier_daily_limit ?? 999999;
    if (profile.plan === 'custom') limit = profile.custom_daily_limit ?? 25;

    const today = new Date().toISOString().split('T')[0];
    const lastDate = profile.last_slip_date ? profile.last_slip_date.split('T')[0] : null;

    let currentUsage = profile.slips_created_today;
    
    // Reset if it's a new day
    if (lastDate !== today) {
      currentUsage = 0;
    }

    if (currentUsage >= limit) {
      return { success: false, message: `Server quota reached. Your plan allows ${limit} slips/day. Upgrade to Premium!` };
    }

    // Increment usage
    await supabaseAdmin
      .from('profiles')
      .update({ 
        slips_created_today: currentUsage + 1,
        last_slip_date: new Date().toISOString(),
        total_slips_created: (profile.total_slips_created || 0) + 1
      })
      .eq('id', userId);

    return { success: true, message: 'Quota incremented.' };

  } catch (err: any) {
    // If column doesn't exist, just allow it for now rather than breaking the app
    console.error('Quota Error:', err);
    return { success: true, message: 'Quota check bypassed due to DB schema' };
  }
}
