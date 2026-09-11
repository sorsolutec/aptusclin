import { NextResponse } from 'next/server';
import { getAdminClient } from '@/utils/supabase/serverAdmin';

// GET /api/solicitacoes/protocolo/[protocolo] — Consulta pública pelo código de protocolo
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ protocolo: string }> }
) {
  try {
    const { protocolo } = await params;

    if (!protocolo || protocolo.trim().length < 5) {
      return NextResponse.json({ ok: false, message: 'Protocolo inválido.' }, { status: 400 });
    }

    const adminClient = getAdminClient();

    const { data: solicitacao, error } = await adminClient
      .from('solicitacoes_exames')
      .select(`
        protocolo,
        unidade_id,
        empresa_nome,
        empresa_cnpj,
        solicitante_nome,
        colaborador_nome,
        colaborador_cpf,
        colaborador_cargo,
        colaborador_setor,
        tipo_exame,
        exames_complementares,
        riscos_funcao,
        data_pretendida,
        status,
        data_agendamento,
        horario_agendamento,
        created_at,
        unidades:unidade_id (
          nome,
          cidade,
          estado,
          endereco,
          telefone,
          whatsapp,
          email,
          horario_funcionamento
        )
      `)
      .eq('protocolo', protocolo.trim().toUpperCase())
      .single();

    if (error || !solicitacao) {
      return NextResponse.json(
        { ok: false, message: 'Protocolo de solicitação não encontrado.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      solicitacao: {
        ...solicitacao,
        unidade: (solicitacao as any).unidades || null,
      },
    });
  } catch (err: unknown) {
    console.error('[GET /api/solicitacoes/protocolo/[protocolo]] Exceção:', err);
    return NextResponse.json(
      { ok: false, message: 'Erro ao consultar protocolo.' },
      { status: 500 }
    );
  }
}
