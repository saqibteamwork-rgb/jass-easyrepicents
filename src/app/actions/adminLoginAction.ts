'use server';
import { supabaseAdmin } from '../../lib/supabase-server';
import { cookies } from 'next/headers';

export async function verifyAdminLogin(pin: string) {
  const { data } = await supabaseAdmin.from('admin_settings').select('admin_pin').single();
  const validPin = data?.admin_pin;

  if (!validPin || pin !== validPin) {
    return false;
  }
  
  const cookieStore = await cookies();
  cookieStore.set('saqib_admin_pin', pin, { path: '/', maxAge: 86400, httpOnly: true, secure: process.env.NODE_ENV === 'production' });
  return true;
}