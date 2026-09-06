import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getAdminClient } from '@/utils/supabase/serverAdmin'
import bcrypt from 'bcryptjs'
import { criarSessaoPaciente } from '@/lib/paciente-session'

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

    const senhaHash = colaborador.senha_hash as string | null
    let autenticado = false

    if (senhaHash && senhaHash.startsWith('$2')) {
      // Senha já está em bcrypt — comparação segura
      autenticado = await bcrypt.compare(senha, senhaHash)
    } else {
      // Senha em texto puro (legado) — compara diretamente
      autenticado = senhaHash === senha

      if (autenticado) {
        // Lazy upgrade: atualiza para bcrypt de forma transparente
        const novoHash = await bcrypt.hash(senha, 10)
        const adminClient = getAdminClient()
        await adminClient
          .from('colaboradores')
          .update({ senha_hash: novoHash })
          .eq('id', colaborador.id)
      }
    }

    if (!autenticado) {
      return NextResponse.json(
        { message: 'Usuário ou senha incorretos.' },
        { status: 401 }
      )
    }

    // Emite o cookie de sessão httpOnly do paciente
    await criarSessaoPaciente(colaborador.id)

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
