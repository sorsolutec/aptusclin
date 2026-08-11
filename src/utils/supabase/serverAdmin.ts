import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase client with Service Role key for server‑side admin operations.
 * Use this client only in server code (API routes, server components).
 * Lazy-initialized to avoid build-time errors when env vars are not yet available.
 */
let _adminClient: SupabaseClient | null = null;

export function getAdminClient(): SupabaseClient {
  if (!_adminClient) {
    _adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return _adminClient;
}

/** @deprecated Use getAdminClient() instead */
export const supabaseAdmin = {
  get auth() {
    return getAdminClient().auth;
  },
  from: (...args: Parameters<SupabaseClient['from']>) => {
    return getAdminClient().from(...args);
  },
};
