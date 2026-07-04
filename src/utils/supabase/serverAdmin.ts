import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

/**
 * Supabase client with Service Role key for server‑side admin operations.
 * Use this client only in server code (API routes, server components).
 * Lazy-initialized to avoid build-time errors when env vars are not yet available.
 */
let _adminClient: ReturnType<typeof createClient> | null = null;

export function getAdminClient() {
  if (!_adminClient) {
    _adminClient = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return _adminClient;
}

/** @deprecated Use getAdminClient() instead */
export const supabaseAdmin = {
  get auth() { return getAdminClient().auth },
  from: (...args: Parameters<ReturnType<typeof createClient>['from']>) => getAdminClient().from(...args),
};
