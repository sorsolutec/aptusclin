import { NextResponse } from 'next/server';
import { validateContactLead } from '@/lib/contact';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const validation = validateContactLead(payload);

    if (!validation.valid) {
      return NextResponse.json(
        { ok: false, message: 'Dados inválidos.', errors: validation.errors },
        { status: 400 },
      );
    }

    // Salva o lead no Supabase
    const { getAdminClient } = await import('@/utils/supabase/serverAdmin');
    const adminClient = getAdminClient();
    
    const { error } = await adminClient.from('leads').insert({
      nome: payload.nome,
      empresa: payload.empresa,
      email: payload.email,
      telefone: payload.telefone,
      tipo: payload.tipo,
      mensagem: payload.mensagem,
    });

    if (error) {
      console.error('[contact] Erro ao salvar lead no Supabase:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        payload,
      });
      return NextResponse.json(
        {
          ok: false,
          message: 'Não foi possível salvar sua solicitação no momento. Por favor, tente novamente mais tarde.',
          ...(process.env.NODE_ENV !== 'production' ? { error: error.message } : {}),
        },
        { status: 500 }
      );
    }

    console.info('Novo lead de contato recebido e salvo no banco:', payload.email);

    return NextResponse.json({
      ok: true,
      message: 'Obrigado! Recebemos sua solicitação e entraremos em contato em breve.',
    });
  } catch (err: unknown) {
    console.error('[contact] Exceção inesperada na rota de contato:', err);
    return NextResponse.json(
      {
        ok: false,
        message: 'Não foi possível processar sua solicitação.',
        ...(process.env.NODE_ENV !== 'production' ? { error: String(err) } : {}),
      },
      { status: 500 }
    );
  }
}
