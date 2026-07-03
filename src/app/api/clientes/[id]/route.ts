import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

type Params = { params: Promise<{ id: string }> }

// GET /api/clientes/[id]
export async function GET(_req: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('empresas')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Cliente não encontrado.' }, { status: 404 })
  }
  return NextResponse.json({ cliente: data })
}

// PUT /api/clientes/[id]
export async function PUT(request: Request, { params }: Params) {
  const { id } = await params
  try {
    const body = await request.json()
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('empresas')
      .update({
        nome: body.nome?.trim(),
        cnpj: body.cnpj?.replace(/\D/g, '') || null,
        email: body.email?.trim() || null,
        telefone: body.telefone?.trim() || null,
        responsavel: body.responsavel?.trim() || null,
        endereco: body.endereco?.trim() || null,
        cidade: body.cidade?.trim() || null,
        estado: body.estado?.trim() || null,
        unidade_id: body.unidade_id || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ cliente: data })
  } catch (err) {
    console.error('[PUT /api/clientes/[id]]', err)
    return NextResponse.json({ error: 'Erro ao atualizar cliente.' }, { status: 500 })
  }
}

// DELETE /api/clientes/[id] — soft delete
export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { error } = await supabase
    .from('empresas')
    .update({ ativo: false, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: 'Erro ao remover cliente.' }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}
