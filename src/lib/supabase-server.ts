import { createClient } from '@supabase/supabase-js';

// Keys hardcoded directly - no process.env dependency
// This client bypasses RLS completely. ONLY used in Server API routes.
export const supabaseAdmin = createClient(
  'https://wkkczzrsgakefciaqcqf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indra2N6enJzZ2FrZWZjaWFxY3FmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTI2MjAwMCwiZXhwIjoyMTA2ODM4MDAwfQ.FJnayo4njqvtSZjv2SgtUAPGG7ClsEJsTHV1Rbz_Ep0',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    }
  }
);
