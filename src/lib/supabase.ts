import { createClient } from '@supabase/supabase-js';

// Keys hardcoded directly - no process.env dependency
export const supabase = createClient(
  'https://wkkczzrsgakefciaqcqf.supabase.co',
  'sb_publishable_Xl8x4zhhuBlP9T5z6M_hnQ_WqNXn_nx'
);
