import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/admin/empresas - list all companies (admin only)
export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const role = user?.user_metadata?.role ?? user?.app_metadata?.role;
  if (!user || role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { data, error } = await supabase.from('empresas').select('id, nome, cnpj, created_at');
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(data);
}

// POST /api/admin/empresas - create a new company (admin only)
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const role = user?.user_metadata?.role ?? user?.app_metadata?.role;
  if (!user || role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const payload = await request.json();
  if (!payload.nome) {
    return NextResponse.json({ error: 'Nome is required' }, { status: 400 });
  }

  const { data, error } = await supabase.from('empresas').insert({
    nome: payload.nome,
    cnpj: payload.cnpj || null,
  }).select('*').single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(data, { status: 201 });
}
