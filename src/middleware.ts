/**
 * Next.js Middleware entry point.
 * Delegates all logic to the proxy module which handles:
 * - Supabase session refresh
 * - Auth-based route protection (/portal, /admin)
 * - Subdomain-based tenant routing
 */
export { proxy as middleware, config } from './proxy';
