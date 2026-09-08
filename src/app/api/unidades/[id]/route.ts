import { createClient } from '@/utils/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function getAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Helper para tratar aliases de slug (nova-ubirata / hova-ubirata)
function getTargetIds(id: string): string[] {
  if (id === 'nova-ubirata' || id === 'hova-ubirata') {
    return ['nova-ubirata', 'hova-ubirata'];
  }
  return [id];
}

// GET /api/unidades/[id] — detalhe de uma unidade (acesso público)
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const targetIds = getTargetIds(id);

  const { data, error } = await supabase
    .from('unidades')
    .select('*')
    .in('id', targetIds)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: 'Unidade não encontrada' }, { status: 404 });
  }

  return NextResponse.json(data);
}

// PUT /api/unidades/[id] — atualiza dados e slides de uma unidade (admin only)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  const role = user?.user_metadata?.role ?? user?.app_metadata?.role;
  if (!user || role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const payload = await request.json();
  const allowed = [
    'nome',
    'cidade',
    'estado',
    'endereco',
    'telefone',
    'email',
    'descricao',
    'slides',
    'foto_url',
    'horario',
    'exames_disponiveis',
    'ativo',
    'instagram',
    'facebook',
    'whatsapp'
  ];
  const updates: Record<string, unknown> = {};
  for (const key of allowed) {
    if (payload[key] !== undefined) {
      updates[key] = payload[key];
    }
  }

  const targetIds = getTargetIds(id);
  const { data, error } = await getAdminClient()
    .from('unidades')
    .update(updates)
    .in('id', targetIds)
    .select()
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}

