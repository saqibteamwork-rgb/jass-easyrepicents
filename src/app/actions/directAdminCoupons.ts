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

export async function adminFetchCoupons() {
  await verifyAdmin();
  const { data, error } = await supabaseAdmin.from('coupons').select('*').order('created_at', { ascending: false });
  return { data, error };
}

export async function adminCreateCoupon(payload: any) {
  await verifyAdmin();
  const { data, error } = await supabaseAdmin.from('coupons').insert([payload]);
  return { data, error };
}

export async function adminUpdateCoupon(id: string, payload: any) {
  await verifyAdmin();
  const { data, error } = await supabaseAdmin.from('coupons').update(payload).eq('id', id);
  return { data, error };
}

export async function adminDeleteCoupon(id: string) {
  await verifyAdmin();
  const { data, error } = await supabaseAdmin.from('coupons').delete().eq('id', id);
  return { data, error };
}
