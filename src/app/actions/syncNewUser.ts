'use server';

import { supabaseAdmin } from '../../lib/supabase-server';

export async function syncNewUserAction(
  id: string,
  customId: string,
  email: string,
  username: string
) {
  try {
    // Only allow inserting with 'free' plan from this action
    const { error } = await supabaseAdmin.from('profiles').insert([
      {
        id,
        custom_id: customId,
        email,
        username,
        plan: 'free',
        created_at: new Date().toISOString(),
      },
    ]);
    
    if (error) {
      console.error('Failed to insert user into profiles:', error);
      // If it's a unique violation (code 23505), maybe the trigger already created it!
      if (error.code === '23505') {
        // Just update the custom_id and username since the trigger might not have them
        const { error: updateError } = await supabaseAdmin.from('profiles').update({
          custom_id: customId,
          username: username
        }).eq('id', id);
        
        if (updateError) {
           return { success: false, error: updateError.message };
        }
        return { success: true };
      }
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
