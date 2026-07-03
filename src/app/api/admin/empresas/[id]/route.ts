import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/admin/empresas/[id] - get a single company (admin only)
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const role = user?.user_metadata?.role ?? user?.app_metadata?.role;
  if (!user || role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { data, error } = await supabase
    .from('empresas')
    .select('*')
    .eq('id', id)
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(data);
}

// PUT /api/admin/empresas/[id] - update a company (admin only)
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const role = user?.user_metadata?.role ?? user?.app_metadata?.role;
  if (!user || role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const payload = await request.json();
  const { data, error } = await supabase
    .from('empresas')
    .update({
      nome: payload.nome,
      cnpj: payload.cnpj,
      email: payload.email,
      telefone: payload.telefone,
    })
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(data);
}

// DELETE /api/admin/empresas/[id] - delete a company (admin only)
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const role = user?.user_metadata?.role ?? user?.app_metadata?.role;
  if (!user || role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { error } = await supabase.from('empresas').delete().eq('id', id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}
