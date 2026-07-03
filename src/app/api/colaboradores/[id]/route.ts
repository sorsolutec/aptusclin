import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

type Params = { params: Promise<{ id: string }> }

function gerarSenha(tamanho = 8): string {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789'
  return Array.from({ length: tamanho }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

// GET /api/colaboradores/[id]
export async function GET(_req: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('colaboradores')
    .select('*, empresas(id, nome)')
    .eq('id', id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Colaborador não encontrado.' }, { status: 404 })
  }
  return NextResponse.json({ colaborador: data })
}

// PUT /api/colaboradores/[id]
export async function PUT(request: Request, { params }: Params) {
  const { id } = await params
  try {
    const body = await request.json()
    const supabase = await createClient()

    const updateData: Record<string, unknown> = {
      nome: body.nome?.trim(),
      cpf: body.cpf?.replace(/\D/g, ''),
      data_nascimento: body.data_nascimento || null,
      data_admissao: body.data_admissao || null,
      cargo: body.cargo?.trim() || null,
      empresa_id: body.empresa_id || null,
      unidade_id: body.unidade_id || null,
      telefone: body.telefone?.trim() || null,
      email: body.email?.trim() || null,
      status_aso: body.status_aso || 'Pendente',
      updated_at: new Date().toISOString(),
    }

    // Resetar senha se solicitado
    let novaSenha: string | null = null
    if (body.resetar_senha) {
      novaSenha = gerarSenha()
      updateData.senha_hash = novaSenha
    }

    const { data, error } = await supabase
      .from('colaboradores')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ colaborador: data, nova_senha: novaSenha })
  } catch (err) {
    console.error('[PUT /api/colaboradores/[id]]', err)
    return NextResponse.json({ error: 'Erro ao atualizar colaborador.' }, { status: 500 })
  }
}

// DELETE /api/colaboradores/[id] — soft delete
export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { error } = await supabase
    .from('colaboradores')
    .update({ ativo: false, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: 'Erro ao remover colaborador.' }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}
