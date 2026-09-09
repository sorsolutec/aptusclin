import { createClient } from '@/utils/supabase/server';
import { getAdminClient } from '@/utils/supabase/serverAdmin';
import { NextResponse } from 'next/server';

// GET /api/admin/exames/[id] - get a single exam (admin only)
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const role = user?.user_metadata?.role ?? user?.app_metadata?.role;
    if (!user || role !== 'admin') {
      return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
    }

    const supabaseAdmin = getAdminClient();
    const { data, error } = await supabaseAdmin
      .from('exames')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(data);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro ao buscar exame.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// PUT /api/admin/exames/[id] - update an exam (admin only)
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const role = user?.user_metadata?.role ?? user?.app_metadata?.role;
    if (!user || role !== 'admin') {
      return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
    }

    const payload = await request.json();
    const supabaseAdmin = getAdminClient();
    const { data, error } = await supabaseAdmin
      .from('exames')
      .update({
        title: payload.title,
        description: payload.description,
        start_at: payload.start_at,
        end_at: payload.end_at,
        location: payload.location,
        company_id: payload.company_id || null,
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(data);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro ao atualizar exame.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// DELETE /api/admin/exames/[id] - delete an exam (admin only)
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const role = user?.user_metadata?.role ?? user?.app_metadata?.role;
    if (!user || role !== 'admin') {
      return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
    }

    const supabaseAdmin = getAdminClient();
    const { error } = await supabaseAdmin.from('exames').delete().eq('id', id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro ao excluir exame.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

