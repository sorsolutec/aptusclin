import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getAdminClient } from '@/utils/supabase/serverAdmin'
import bcrypt from 'bcryptjs'

interface ColaboradorRow {
  id: string
  nome: string
  cpf?: string | null
  cargo?: string | null
  empresa_id?: string | null
  empresas?: { id: string; nome: string } | null
  status_aso?: string | null
  ativo?: boolean | null
  created_at?: string | null
}

interface ColaboradorPayload {
  nome?: string
  cpf?: string
  data_nascimento?: string
  data_admissao?: string
  cargo?: string
  access_level?: string
  unidade_id?: string
  telefone?: string
  email?: string
  empresa_id?: string
}

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
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const offset = (page - 1) * limit

    const supabase = await createClient()
    let query = supabase
      .from('colaboradores')
      .select('*, empresas(id, nome)', { count: 'exact' })
      .order('nome')
      .range(offset, offset + limit - 1)

    if (busca) {
      query = query.or(`nome.ilike.%${busca}%,cpf.ilike.%${busca}%,cargo.ilike.%${busca}%`)
    }
    if (empresaId) query = query.eq('empresa_id', empresaId)

    const { data, count, error } = await query
    if (error) throw error

    const mapped = (data || []).map((e) => ({
      id: e.id,
      nome: e.nome,
      cpf: e.cpf,
      cargo: e.cargo,
      empresa_id: e.empresa_id,
      empresas: e.empresas ? { id: e.empresas.id, nome: e.empresas.nome } : null,
      status_aso: e.status_aso || 'Pendente',
      ativo: e.ativo !== false,
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
    const body = (await request.json()) as ColaboradorPayload
    const {
      nome, cpf, data_nascimento, data_admissao,
      cargo, unidade_id,
      telefone, email, empresa_id
    } = body

    if (!nome?.trim()) return NextResponse.json({ error: 'Nome é obrigatório.' }, { status: 400 })
    if (!cpf?.trim()) return NextResponse.json({ error: 'CPF é obrigatório.' }, { status: 400 })

    const cpfLimpo = cpf.replace(/\D/g, '')

    // Para criar usuários no auth, precisamos de um client com Service Role Key
    const supabaseAdmin = getAdminClient()

    const usuario = gerarUsuario(nome.trim())
    const senha = gerarSenha()
    const senhaHash = await bcrypt.hash(senha, 10)
    const emailToUse = email?.trim() || `${usuario}@aptusclin.com.br`

    // Cria o usuário na Autenticação do Supabase (para potencial uso futuro)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: emailToUse,
      password: senha,
      email_confirm: true,
      user_metadata: {
        role: 'colaborador',
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

    // Insere na tabela colaboradores os dados complementares de resultados de exames
    const { data, error } = await supabaseAdmin
      .from('colaboradores')
      .insert({
        id: userId, // Vincula ao mesmo ID do Auth
        nome: nome.trim(),
        cpf: cpfLimpo,
        data_nascimento: data_nascimento || null,
        data_admissao: data_admissao || null,
        cargo: cargo?.trim() || null,
        unidade_id: unidade_id || null,
        email: emailToUse,
        telefone: telefone?.trim() || null,
        usuario: usuario,
        senha_hash: senhaHash,
        status_aso: 'Pendente',
        empresa_id: empresa_id || null,
        ativo: true
      })
      .select()
      .single()

    if (error) {
      // Rollback: se falhar em colaboradores, apaga do Auth
      await supabaseAdmin.auth.admin.deleteUser(userId)
      if (error.code === '23505') {
        return NextResponse.json({ error: 'CPF já cadastrado.' }, { status: 409 })
      }
      throw error
    }

    return NextResponse.json({
      colaborador: data,
      credenciais: { usuario, senha }
    }, { status: 201 })

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro ao criar colaborador.'
    console.error('[POST /api/colaboradores]', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
