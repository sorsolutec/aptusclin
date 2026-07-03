import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

// GET /api/clientes — lista empresas clientes
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const busca = searchParams.get('q') || ''
    const unidade = searchParams.get('unidade') || ''
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const offset = (page - 1) * limit

    const supabase = await createClient()
    let query = supabase
      .from('empresas')
      .select('*, colaboradores(count)', { count: 'exact' })
      .eq('ativo', true)
      .order('nome')
      .range(offset, offset + limit - 1)

    if (busca) {
      query = query.or(`nome.ilike.%${busca}%,cnpj.ilike.%${busca}%,responsavel.ilike.%${busca}%`)
    }
    if (unidade) {
      query = query.eq('unidade_id', unidade)
    }

    const { data, count, error } = await query
    if (error) throw error

    return NextResponse.json({ clientes: data || [], total: count || 0 })
  } catch (err) {
    console.error('[GET /api/clientes]', err)
    return NextResponse.json({ error: 'Erro ao buscar clientes.' }, { status: 500 })
  }
}

// POST /api/clientes — cria novo cliente
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nome, cnpj, email, telefone, responsavel, endereco, cidade, estado, unidade_id } = body

    if (!nome?.trim()) {
      return NextResponse.json({ error: 'Nome é obrigatório.' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('empresas')
      .insert({
        nome: nome.trim(),
        cnpj: cnpj?.replace(/\D/g, '') || null,
        email: email?.trim() || null,
        telefone: telefone?.trim() || null,
        responsavel: responsavel?.trim() || null,
        endereco: endereco?.trim() || null,
        cidade: cidade?.trim() || null,
        estado: estado?.trim() || null,
        unidade_id: unidade_id || null,
        ativo: true,
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'CNPJ já cadastrado.' }, { status: 409 })
      }
      throw error
    }

    return NextResponse.json({ cliente: data }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/clientes]', err)
    return NextResponse.json({ error: 'Erro ao criar cliente.' }, { status: 500 })
  }
}
