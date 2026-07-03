import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client with Service Role key for server‑side admin operations.
 * Use this client only in server code (API routes, server components).
 */
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export function getAdminClient() {
  return supabaseAdmin;
}
