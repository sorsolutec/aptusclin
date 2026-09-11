import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getAdminClient } from '@/utils/supabase/serverAdmin';

// PATCH /api/solicitacoes/[id] — Atualização de status e triagem pelo operador
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const role = user?.user_metadata?.role ?? user?.app_metadata?.role;

    if (!user || role !== 'admin') {
      return NextResponse.json({ ok: false, message: 'Acesso negado.' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    const allowedFields = [
      'status',
      'data_agendamento',
      'horario_agendamento',
      'resposta_operador',
      'observacoes',
    ];

    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
      atendido_por: user.id,
    };

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    const adminClient = getAdminClient();
    const { data, error } = await adminClient
      .from('solicitacoes_exames')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[PATCH /api/solicitacoes/[id]] Erro ao atualizar:', error);
      return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      message: 'Solicitação atualizada com sucesso.',
      solicitacao: data,
    });
  } catch (err: unknown) {
    console.error('[PATCH /api/solicitacoes/[id]] Exceção:', err);
    return NextResponse.json({ ok: false, message: 'Erro ao processar atualização.' }, { status: 500 });
  }
}

// DELETE /api/solicitacoes/[id] — Exclusão pelo administrador
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const role = user?.user_metadata?.role ?? user?.app_metadata?.role;

    if (!user || role !== 'admin') {
      return NextResponse.json({ ok: false, message: 'Acesso negado.' }, { status: 403 });
    }

    const { id } = await params;
    const adminClient = getAdminClient();

    const { error } = await adminClient
      .from('solicitacoes_exames')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[DELETE /api/solicitacoes/[id]] Erro ao remover:', error);
      return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, message: 'Solicitação removida com sucesso.' });
  } catch (err: unknown) {
    console.error('[DELETE /api/solicitacoes/[id]] Exceção:', err);
    return NextResponse.json({ ok: false, message: 'Erro ao remover solicitação.' }, { status: 500 });
  }
}
