"use server";
import { supabaseAdmin } from '../../lib/supabase-server';
import { UserPlan } from '../../types/auth';

import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || process.env.SUPABASE_SERVICE_KEY || 'unsecure_fallback');

async function verifyAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (!token) throw new Error('Unauthorized');
  
  try {
    await jwtVerify(token, JWT_SECRET);
  } catch (err) {
    throw new Error('Unauthorized');
  }
}

export async function serverFetchUsers(pin: string) {
  await verifyAuth();
  const { data, error } = await supabaseAdmin.from('profiles').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function serverUpdateUserPlan(pin: string, userId: string, newPlan: UserPlan, customDailyLimit?: number) {
  await verifyAuth();
  const payload: any = { plan: newPlan };
  if (newPlan === 'pro') payload.expires_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  if (customDailyLimit !== undefined) payload.custom_daily_limit = customDailyLimit;
  
  const { error } = await supabaseAdmin.from('profiles').update(payload).or(`id.eq.${userId},custom_id.eq.${userId},email.eq.${userId}`);
  if (error) throw error;
  return true;
}

export async function serverDeleteUser(pin: string, userId: string) {
  await verifyAuth();
  const { error } = await supabaseAdmin.from('profiles').delete().or(`id.eq.${userId},custom_id.eq.${userId}`);
  if (error) throw error;
  return true;
}

export async function serverCreateCoupon(pin: string, couponCode: string, plan: UserPlan, limit: number, customDailyLimit?: number) {
  await verifyAuth();
  const { error } = await supabaseAdmin.from('coupons').insert([{
    code: couponCode,
    plan_granted: plan,
    max_uses: limit,
    used_count: 0,
    is_active: true,
    custom_daily_limit: customDailyLimit
  }]);
  if (error) throw error;
  return true;
}

export async function serverUpdateAdminSettings(pin: string, payload: any) {
  await verifyAuth();
  const { error } = await supabaseAdmin.from('admin_settings').upsert({ id: 'global', ...payload });
  if (error) throw error;
  return true;
}

export async function serverCreateUser(pin: string, payload: any) {
  await verifyAuth();
  const { error } = await supabaseAdmin.from('profiles').insert([payload]);
  if (error) throw error;
  return true;
}