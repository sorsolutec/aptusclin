import { createClient } from '@/utils/supabase/server';
import { getAdminClient } from '@/utils/supabase/serverAdmin';
import { NextResponse } from 'next/server';

// GET /api/admin/users - list all users (admin only)
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const role = user?.user_metadata?.role ?? user?.app_metadata?.role;
  if (!user || role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { data, error } = await supabase.from('users').select('id, email, role, created_at');
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(data);
}

// POST /api/admin/users - create a new user (admin only)
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const role = user?.user_metadata?.role ?? user?.app_metadata?.role;
  if (!user || role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const payload = await request.json();
  if (!payload.email) {
    return NextResponse.json({ error: 'Email é obrigatório' }, { status: 400 });
  }

  const userRole = payload.role || 'user';
  const initialPassword = payload.password || 'TempPassword123!';

  // 1. Cria o usuário no Supabase Auth para permitir login
  const adminClient = getAdminClient();
  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
    email: payload.email,
    password: initialPassword,
    email_confirm: true,
    user_metadata: { role: userRole },
  });

  if (authError) {
    // Se o usuário já existir no Auth, tenta resgatar a ID
    console.warn('[POST /api/admin/users] Aviso no Auth:', authError.message);
  }

  const userId = authData?.user?.id;

  // 2. Insere/Atualiza a tabela customizada `users`
  const { data, error } = await supabase
    .from('users')
    .upsert(
      {
        id: userId,
        email: payload.email,
        role: userRole,
      },
      { onConflict: 'email' }
    )
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(data, { status: 201 });
}

