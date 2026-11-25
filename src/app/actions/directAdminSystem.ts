'use server';
import { supabaseAdmin } from '../../lib/supabase-server';
import { cookies } from 'next/headers';

async function verifyAdmin() {
  const cookieStore = await cookies();
  const pin = cookieStore.get('saqib_admin_pin')?.value;
  
  if (!pin) {
    throw new Error('Unauthorized: No admin PIN provided');
  }

  // Check against DB settings
  const { data } = await supabaseAdmin.from('admin_settings').select('admin_pin').single();
  const validPin = data?.admin_pin;

  // We MUST have a valid PIN in DB to compare against.
  if (!validPin || pin !== validPin) {
    throw new Error('Unauthorized: Invalid admin PIN');
  }
}

export async function adminFetchUsers() {
  await verifyAdmin();
  const { data, error } = await supabaseAdmin.from('profiles').select('*').order('created_at', { ascending: false });
  return { data, error };
}

export async function adminUpdateUserPlan(userId: string, newPlan: string, customDailyLimit?: number, expiresAt?: string | null) {
  await verifyAdmin();
  const payload: any = { plan: newPlan };
  
  if (expiresAt !== undefined) {
    payload.expires_at = expiresAt;
  } else if (newPlan === 'pro') {
    payload.expires_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  } else if (newPlan === 'premium') {
    payload.expires_at = null; // Default premium to lifetime if not provided
  }

  if (customDailyLimit !== undefined) payload.custom_daily_limit = customDailyLimit;
  
  // Use eq('id') instead of .or to prevent VARCHAR length constraint errors
  const { error } = await supabaseAdmin.from('profiles').update(payload).eq('id', userId);
  
  if (error) {
    console.error('adminUpdateUserPlan error:', error);
    throw new Error(error.message);
  }
  return { error: null };
}

export async function adminCreateUser(payload: any) {
  await verifyAdmin();
  const { error } = await supabaseAdmin.from('profiles').insert([payload]);
  return { error };
}

export async function adminDeleteUser(userId: string) {
  await verifyAdmin();
  const { error } = await supabaseAdmin.from('profiles').delete().eq('id', userId);
  
  if (error) {
    console.error('adminDeleteUser error:', error);
    throw new Error(error.message);
  }
  return { error: null };
}

export async function adminFetchAuditLogs() {
  await verifyAdmin();
  const { data, error } = await supabaseAdmin.from('audit_slips').select('*').order('created_at', { ascending: false }).limit(100);
  return { data, error };
}

export async function adminSaveSettings(payload: any) {
  await verifyAdmin();
  const { error } = await supabaseAdmin.from('admin_settings').upsert({ id: 'global', ...payload });
  return { error };
}


export async function adminFetchSettings() {
  const { data, error } = await supabaseAdmin
    .from('admin_settings')
    .select('daily_slip_limit, free_tier_daily_limit, pro_tier_daily_limit, premium_tier_daily_limit, enforce_limit, enforce_watermark, watermark_brand_text, enabled_providers, broadcast_banner, allow_classic_engines')
    .eq('id', 'global')
    .maybeSingle();
  return { data, error };
}
