import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

/** Gera usuário no formato nome.sobrenome (ex: joao.silva) */
function gerarUsuario(nome: string): string {
  const partes = nome
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .trim()
    .split(/\s+/)

  const primeiro = partes[0] || 'usuario'
  const ultimo = partes[partes.length - 1] || ''
  return `${primeiro}${ultimo ? '.' + ultimo : ''}`
}

/** Gera senha aleatória de 8 caracteres (letras + números) */
function gerarSenha(tamanho = 8): string {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789' // sem ambíguos (l,1,0,O,i)
  return Array.from({ length: tamanho }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

// GET /api/colaboradores
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const busca = searchParams.get('q') || ''
    const empresaId = searchParams.get('empresa_id') || ''
    const status = searchParams.get('status') || ''
    const unidade = searchParams.get('unidade') || ''
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const offset = (page - 1) * limit

    const supabase = await createClient()
    let query = supabase
      .from('colaboradores')
      .select('*, empresas(id, nome)', { count: 'exact' })
      .eq('ativo', true)
      .order('nome')
      .range(offset, offset + limit - 1)

    if (busca) {
      query = query.or(`nome.ilike.%${busca}%,cpf.ilike.%${busca}%,cargo.ilike.%${busca}%`)
    }
    if (empresaId) query = query.eq('empresa_id', empresaId)
    if (status) query = query.eq('status_aso', status)
    if (unidade) query = query.eq('unidade_id', unidade)

    const { data, count, error } = await query
    if (error) throw error

    return NextResponse.json({ colaboradores: data || [], total: count || 0 })
  } catch (err) {
    console.error('[GET /api/colaboradores]', err)
    return NextResponse.json({ error: 'Erro ao buscar colaboradores.' }, { status: 500 })
  }
}

// POST /api/colaboradores — cria colaborador e gera credenciais
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      nome, cpf, data_nascimento, data_admissao,
      cargo, empresa_id, unidade_id,
      telefone, email,
    } = body

    if (!nome?.trim()) return NextResponse.json({ error: 'Nome é obrigatório.' }, { status: 400 })
    if (!cpf?.trim()) return NextResponse.json({ error: 'CPF é obrigatório.' }, { status: 400 })

    const cpfLimpo = cpf.replace(/\D/g, '')

    const supabase = await createClient()

    // Gera usuário único: nome.sobrenome com sufixo numérico se necessário
    let usuario = gerarUsuario(nome.trim())
    const { data: existente } = await supabase
      .from('colaboradores')
      .select('usuario')
      .like('usuario', `${usuario}%`)

    if (existente && existente.length > 0) {
      usuario = `${usuario}${existente.length + 1}`
    }

    const senha = gerarSenha()

    const { data, error } = await supabase
      .from('colaboradores')
      .insert({
        nome: nome.trim(),
        cpf: cpfLimpo,
        data_nascimento: data_nascimento || null,
        data_admissao: data_admissao || null,
        cargo: cargo?.trim() || null,
        empresa_id: empresa_id || null,
        unidade_id: unidade_id || null,
        telefone: telefone?.trim() || null,
        email: email?.trim() || null,
        usuario,
        senha_hash: senha, // Produção: use bcrypt
        status_aso: 'Pendente',
        ativo: true,
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'CPF já cadastrado.' }, { status: 409 })
      }
      throw error
    }

    // Retorna os dados + credenciais em texto claro para exibição/impressão
    return NextResponse.json({
      colaborador: data,
      credenciais: { usuario, senha },
    }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/colaboradores]', err)
    return NextResponse.json({ error: 'Erro ao criar colaborador.' }, { status: 500 })
  }
}
