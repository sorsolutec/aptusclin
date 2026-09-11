import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getAdminClient } from '@/utils/supabase/serverAdmin';

// Função auxiliar para gerar protocolo único legível
function generateProtocol(): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `APT-${year}-${randomSuffix}`;
}

// POST /api/solicitacoes — Criação pública de solicitação de exame ocupacional
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      unidade_id,
      empresa_nome,
      empresa_cnpj,
      solicitante_nome,
      solicitante_email,
      solicitante_telefone,
      colaborador_nome,
      colaborador_cpf,
      colaborador_cargo,
      colaborador_setor,
      tipo_exame,
      exames_complementares,
      riscos_funcao,
      data_pretendida,
      observacoes,
    } = body;

    // Validações básicas obrigatórias
    if (!unidade_id || !empresa_nome || !solicitante_nome || !solicitante_telefone || !colaborador_nome || !colaborador_cpf || !tipo_exame) {
      return NextResponse.json(
        { ok: false, message: 'Campos obrigatórios não preenchidos.' },
        { status: 400 }
      );
    }

    const adminClient = getAdminClient();
    const protocolo = generateProtocol();

    const payload = {
      protocolo,
      unidade_id: String(unidade_id).trim(),
      empresa_nome: String(empresa_nome).trim(),
      empresa_cnpj: empresa_cnpj ? String(empresa_cnpj).trim() : null,
      solicitante_nome: String(solicitante_nome).trim(),
      solicitante_email: String(solicitante_email).trim(),
      solicitante_telefone: String(solicitante_telefone).trim(),
      colaborador_nome: String(colaborador_nome).trim(),
      colaborador_cpf: String(colaborador_cpf).trim(),
      colaborador_cargo: colaborador_cargo ? String(colaborador_cargo).trim() : null,
      colaborador_setor: colaborador_setor ? String(colaborador_setor).trim() : null,
      tipo_exame: String(tipo_exame).trim(),
      exames_complementares: Array.isArray(exames_complementares) ? exames_complementares : [],
      riscos_funcao: riscos_funcao ? String(riscos_funcao).trim() : null,
      data_pretendida: data_pretendida || null,
      observacoes: observacoes ? String(observacoes).trim() : null,
      status: 'novo',
    };

    const { data, error } = await adminClient
      .from('solicitacoes_exames')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error('[POST /api/solicitacoes] Erro ao salvar solicitação:', error);
      return NextResponse.json(
        { ok: false, message: 'Erro ao registrar solicitação. Tente novamente mais tarde.', error: error.message },
        { status: 500 }
      );
    }

    // Busca dados complementares da unidade para o retorno completo da guia
    const { data: unidadeData } = await adminClient
      .from('unidades')
      .select('nome, cidade, estado, endereco, telefone, whatsapp, email, horario_funcionamento')
      .eq('id', payload.unidade_id)
      .single();

    return NextResponse.json({
      ok: true,
      protocolo,
      solicitacao: {
        ...data,
        unidade: unidadeData || null,
      },
      message: 'Solicitação de exame enviada com sucesso!',
    });
  } catch (err: unknown) {
    console.error('[POST /api/solicitacoes] Exceção inesperada:', err);
    return NextResponse.json(
      { ok: false, message: 'Falha no processamento da solicitação.' },
      { status: 500 }
    );
  }
}

// GET /api/solicitacoes — Listagem restrita para o Painel Administrativo
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const role = user?.user_metadata?.role ?? user?.app_metadata?.role;

    if (!user || role !== 'admin') {
      return NextResponse.json({ ok: false, message: 'Acesso negado.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || '';
    const unidade_id = searchParams.get('unidade_id') || '';
    const q = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '30', 10);
    const offset = (page - 1) * limit;

    const adminClient = getAdminClient();

    let query = adminClient
      .from('solicitacoes_exames')
      .select('*, unidades:unidade_id (nome, cidade)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status && status !== 'todos') {
      query = query.eq('status', status);
    }
    if (unidade_id && unidade_id !== 'todas') {
      query = query.eq('unidade_id', unidade_id);
    }
    if (q) {
      query = query.or(
        `protocolo.ilike.%${q}%,colaborador_nome.ilike.%${q}%,colaborador_cpf.ilike.%${q}%,empresa_nome.ilike.%${q}%`
      );
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('[GET /api/solicitacoes] Erro na consulta:', error);
      return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      solicitacoes: data || [],
      total: count || 0,
      page,
      limit,
    });
  } catch (err: unknown) {
    console.error('[GET /api/solicitacoes] Exceção:', err);
    return NextResponse.json({ ok: false, message: 'Erro ao buscar solicitações.' }, { status: 500 });
  }
}
