import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getAdminClient } from '@/utils/supabase/serverAdmin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const role = user?.user_metadata?.role ?? user?.app_metadata?.role;

    if (!user || role !== 'admin') {
      return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim() || '';
    const status = searchParams.get('status')?.trim() || '';

    const adminClient = getAdminClient();
    let query = adminClient
      .from('leads')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (status && status !== 'todos') {
      query = query.eq('status', status);
    }

    if (q) {
      query = query.or(`nome.ilike.%${q}%,empresa.ilike.%${q}%,email.ilike.%${q}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('[GET /api/admin/leads] Erro:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      leads: data || [],
      total: count || (data?.length ?? 0),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro ao listar leads.';
    console.error('[GET /api/admin/leads] Exceção:', err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
