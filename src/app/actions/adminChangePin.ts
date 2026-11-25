'use server';
import { supabaseAdmin } from '../../lib/supabase-server';
import { cookies } from 'next/headers';

export async function adminChangePin(newPin: string) {
  // First verify the current admin is valid before allowing PIN change
  const cookieStore = await cookies();
  const currentPin = cookieStore.get('saqib_admin_pin')?.value;
  
  if (!currentPin) {
    throw new Error('Unauthorized');
  }

  const { data } = await supabaseAdmin.from('admin_settings').select('admin_pin').single();
  const validPin = data?.admin_pin;

  if (!validPin || currentPin !== validPin) {
    throw new Error('Unauthorized');
  }

  // Update PIN in DB
  const { error } = await supabaseAdmin
    .from('admin_settings')
    .update({ admin_pin: newPin })
    .eq('id', 'global');

  if (error) throw error;

  // Update session cookie to new PIN so they don't get logged out immediately
  cookieStore.set('saqib_admin_pin', newPin, { path: '/', maxAge: 86400, httpOnly: true, secure: process.env.NODE_ENV === 'production' });
  
  return true;
}
