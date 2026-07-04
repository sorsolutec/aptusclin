import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getAdminClient } from '@/utils/supabase/serverAdmin'

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
    let query = (supabase as any)
      .from('employees')
      .select('*, companies(id, name)', { count: 'exact' })
      .order('name')
      .range(offset, offset + limit - 1)

    if (busca) {
      query = query.or(`name.ilike.%${busca}%,cpf.ilike.%${busca}%,role.ilike.%${busca}%`)
    }
    if (empresaId) query = query.eq('company_id', empresaId)

    const { data, count, error } = await query
    if (error) throw error

    const mapped = (data || []).map((e: any) => ({
      id: e.id,
      nome: e.name,
      cpf: e.cpf,
      cargo: e.role,
      empresa_id: e.company_id,
      empresas: e.companies ? { id: e.companies.id, nome: e.companies.name } : null,
      status_aso: 'Pendente',
      ativo: true,
      created_at: e.created_at
    }))

    return NextResponse.json({ colaboradores: mapped, total: count || 0 })
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
      cargo, access_level, unidade_id,
      telefone, email,
    } = body

    if (!nome?.trim()) return NextResponse.json({ error: 'Nome é obrigatório.' }, { status: 400 })
    if (!cpf?.trim()) return NextResponse.json({ error: 'CPF é obrigatório.' }, { status: 400 })

    const cpfLimpo = cpf.replace(/\D/g, '')

    // Para criar usuários, precisamos de um client com Service Role Key
    const supabaseAdmin = getAdminClient()

    let usuario = gerarUsuario(nome.trim())

    const senha = gerarSenha()
    const emailToUse = email?.trim() || `${usuario}@aptusclin.com.br`

    // Cria o usuário na Autenticação do Supabase
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: emailToUse,
      password: senha,
      email_confirm: true,
      user_metadata: {
        role: access_level || 'viewer',
        name: nome.trim(),
        unidade_id: unidade_id || null
      }
    })

    if (authError) {
      if (authError.message.includes('already registered')) {
         return NextResponse.json({ error: 'Este e-mail já está em uso.' }, { status: 409 })
      }
      throw authError
    }

    const userId = authData.user.id

    // Insere na tabela employees os dados complementares
    const { data, error } = await (supabaseAdmin as any)
      .from('employees')
      .insert({
        id: userId, // Vincula o Auth ID ao ID do Employee
        name: nome.trim(),
        cpf: cpfLimpo,
        role: cargo?.trim() || null,
        access_level: access_level || 'viewer',
        unidade_id: unidade_id || null,
        email: emailToUse,
        phone: telefone?.trim() || null
      })
      .select()
      .single()

    if (error) {
      // Rollback: se falhar em employees, apaga do Auth
      await supabaseAdmin.auth.admin.deleteUser(userId)
      if (error.code === '23505') {
        return NextResponse.json({ error: 'CPF já cadastrado.' }, { status: 409 })
      }
      throw error
    }

    return NextResponse.json({
      colaborador: data,
      credenciais: { usuario: emailToUse, senha },
    }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/colaboradores]', err)
    return NextResponse.json({ error: 'Erro ao criar colaborador.' }, { status: 500 })
  }
}
