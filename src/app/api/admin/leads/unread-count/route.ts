import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getAdminClient } from '@/utils/supabase/serverAdmin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const role = user?.user_metadata?.role ?? user?.app_metadata?.role;

    if (!user || role !== 'admin') {
      return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
    }

    const adminClient = getAdminClient();
    const { count, error } = await adminClient
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'novo');

    if (error) {
      console.error('[GET /api/admin/leads/unread-count] Erro:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ count: count || 0 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro ao contar leads não lidos.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
