import { createClient } from '@/utils/supabase/server';
import { getAdminClient } from '@/utils/supabase/serverAdmin';
import { NextResponse } from 'next/server';

// PUT /api/admin/users/[id] - update user (admin only)
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const role = user?.user_metadata?.role ?? user?.app_metadata?.role;
  if (!user || role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const payload = await request.json();

  // 1. Atualiza a tabela `users` no banco
  const { data, error } = await supabase
    .from('users')
    .update({
      email: payload.email,
      role: payload.role,
    })
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // 2. Sincroniza com o Supabase Auth (email + role no user_metadata)
  const adminClient = getAdminClient();
  const updateAuthPayload: Record<string, unknown> = {};
  if (payload.email) updateAuthPayload.email = payload.email;
  if (payload.role) updateAuthPayload.user_metadata = { role: payload.role };

  if (Object.keys(updateAuthPayload).length > 0) {
    const { error: authError } = await adminClient.auth.admin.updateUserById(id, updateAuthPayload);
    if (authError) {
      // Não bloqueia a resposta, mas registra o erro de sincronização
      console.error('[PUT /api/admin/users] Auth sync error:', authError.message);
    }
  }

  return NextResponse.json(data);
}

// DELETE /api/admin/users/[id] - delete user (admin only)
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const role = user?.user_metadata?.role ?? user?.app_metadata?.role;
  if (!user || role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // 1. Remove da tabela `users`
  const { error: dbError } = await supabase.from('users').delete().eq('id', id);
  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 400 });
  }

  // 2. Remove do Supabase Auth para que o usuário não possa mais fazer login
  const adminClient = getAdminClient();
  const { error: authError } = await adminClient.auth.admin.deleteUser(id);
  if (authError) {
    console.error('[DELETE /api/admin/users] Auth delete error:', authError.message);
    // Retorna aviso mas não falha — o registro já foi removido da tabela
    return NextResponse.json({
      success: true,
      warning: 'Usuário removido da tabela mas pode ainda existir no Auth. Verifique o Supabase Dashboard.',
    });
  }

  return NextResponse.json({ success: true });
}
