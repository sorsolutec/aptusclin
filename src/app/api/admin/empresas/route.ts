import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getAdminClient } from '@/utils/supabase/serverAdmin';

// GET /api/admin/empresas - list all companies (admin only)
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const role = user?.user_metadata?.role ?? user?.app_metadata?.role;
    if (!user || role !== 'admin') {
      return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
    }

    const supabaseAdmin = getAdminClient();
    const { data, error } = await supabaseAdmin
      .from('empresas')
      .select('id, name, cnpj, created_at')
      .order('name');

    if (error) {
      console.error('[GET /api/admin/empresas] Erro:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const formatado = (data || []).map((e: any) => ({
      id: e.id,
      nome: e.name,
      cnpj: e.cnpj,
      created_at: e.created_at,
    }));

    return NextResponse.json(formatado);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro ao listar empresas.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// POST /api/admin/empresas - create a new company (admin only)
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const role = user?.user_metadata?.role ?? user?.app_metadata?.role;
    if (!user || role !== 'admin') {
      return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
    }

    const payload = await request.json();
    const nome = payload.nome || payload.name;
    if (!nome?.trim()) {
      return NextResponse.json({ error: 'Nome é obrigatório.' }, { status: 400 });
    }

    const supabaseAdmin = getAdminClient();
    const { data, error } = await supabaseAdmin
      .from('empresas')
      .insert({
        name: nome.trim(),
        cnpj: payload.cnpj || null,
        contact_email: payload.email || payload.contact_email || null,
        phone: payload.telefone || payload.phone || null,
        tipo: payload.tipo || 'PJ',
      })
      .select()
      .single();

    if (error) {
      console.error('[POST /api/admin/empresas] Erro:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      id: data.id,
      nome: data.name,
      cnpj: data.cnpj,
      created_at: data.created_at,
    }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro ao criar empresa.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

