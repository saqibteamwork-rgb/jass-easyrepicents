'use server';
import { supabaseAdmin } from '../../lib/supabase-server';

export async function recordAuditSlipAction(auditItem: any) {
  try {
    await supabaseAdmin.from('audit_slips').insert([
      {
        id: auditItem.id,
        tid: auditItem.tid,
        provider: auditItem.provider,
        amount: auditItem.amount,
        sender_name: auditItem.senderName,
        receiver_name: auditItem.receiverName,
        user_email: auditItem.userEmail,
        user_plan: auditItem.userPlan,
        created_at: auditItem.createdAt,
      },
    ]);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
