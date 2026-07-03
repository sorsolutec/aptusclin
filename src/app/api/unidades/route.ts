import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// GET /api/unidades — lista todas as unidades ativas (acesso público)
export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('unidades')
    .select('id, nome, cidade, estado, endereco, telefone, email, descricao, slides')
    .eq('ativo', true)
    .order('nome');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
