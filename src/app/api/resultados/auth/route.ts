import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { usuario, senha } = body as { usuario?: string; senha?: string }

    if (!usuario || !senha) {
      return NextResponse.json(
        { message: 'Usuário e senha são obrigatórios.' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Busca colaborador pelo usuário ou pelo CPF (sem formatação)
    const cpfLimpo = usuario.replace(/\D/g, '')
    const { data: colaborador, error } = await supabase
      .from('colaboradores')
      .select('id, nome, usuario, senha_hash, ativo')
      .or(`usuario.eq.${usuario.trim()},cpf.eq.${cpfLimpo}`)
      .eq('ativo', true)
      .single()

    if (error || !colaborador) {
      return NextResponse.json(
        { message: 'Usuário ou senha incorretos.' },
        { status: 401 }
      )
    }

    // Verifica a senha (texto simples — migrar para bcrypt em produção)
    if (colaborador.senha_hash !== senha) {
      return NextResponse.json(
        { message: 'Usuário ou senha incorretos.' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { pacienteId: colaborador.id, nome: colaborador.nome },
      { status: 200 }
    )
  } catch (err) {
    console.error('[resultados/auth] erro:', err)
    return NextResponse.json(
      { message: 'Erro interno. Tente novamente.' },
      { status: 500 }
    )
  }
}
