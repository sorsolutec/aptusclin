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
      console.error('[contact] Erro ao salvar lead:', error.message);
      // Podemos escolher não falhar a requisição para o usuário, mas vamos retornar erro 500
      return NextResponse.json({ ok: false, message: 'Não foi possível salvar sua solicitação.' }, { status: 500 });
    }

    console.info('Novo lead de contato recebido e salvo no banco:', payload.email);

    return NextResponse.json({
      ok: true,
      message: 'Obrigado! Recebemos sua solicitação e entraremos em contato em breve.',
    });
  } catch {
    return NextResponse.json({ ok: false, message: 'Não foi possível processar sua solicitação.' }, { status: 500 });
  }
}
