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

    // Simulação de envio seguro para demonstração. Em produção, isso pode ser ligado a um webhook ou e-mail.
    console.info('Novo lead de contato recebido:', payload);

    return NextResponse.json({
      ok: true,
      message: 'Obrigado! Recebemos sua solicitação e entraremos em contato em breve.',
    });
  } catch {
    return NextResponse.json({ ok: false, message: 'Não foi possível processar sua solicitação.' }, { status: 500 });
  }
}
