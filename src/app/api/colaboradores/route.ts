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
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const role = user?.user_metadata?.role ?? user?.app_metadata?.role

    if (!user || role !== 'admin') {
      return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const busca = searchParams.get('q') || ''
    const empresaId = searchParams.get('empresa_id') || ''
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const offset = (page - 1) * limit

    const supabaseAdmin = getAdminClient()

    let query = supabaseAdmin
      .from('colaboradores')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (busca) {
      query = query.or(`name.ilike.%${busca}%,cpf.ilike.%${busca}%,role.ilike.%${busca}%`)
    }
    if (empresaId) query = query.eq('company_id', empresaId)

    const { data, count, error } = await query

    if (error) {
      console.warn('[GET /api/colaboradores] Aviso na consulta:', error)
      return NextResponse.json({ colaboradores: [], total: 0 })
    }

    // Busca nomes das empresas para compor relação
    const companyIds = Array.from(new Set((data || []).map((e: any) => e.company_id).filter(Boolean)))
    let empresasMap: Record<string, string> = {}
    if (companyIds.length > 0) {
      const { data: empData } = await supabaseAdmin
        .from('empresas')
        .select('id, name')
        .in('id', companyIds)
      if (empData) {
        empresasMap = Object.fromEntries(empData.map((e: any) => [e.id, e.name]))
      }
    }

    const mapped = (data || []).map((e: any) => ({
      id: e.id,
      nome: e.name || 'Sem nome',
      cpf: e.cpf || '',
      cargo: e.role || '',
      empresa_id: e.company_id,
      empresas: e.company_id && empresasMap[e.company_id] ? { id: e.company_id, nome: empresasMap[e.company_id] } : null,
      status_aso: 'Pendente',
      ativo: true,
      created_at: e.created_at
    }))

    return NextResponse.json({ colaboradores: mapped, total: count || mapped.length })
  } catch (err: any) {
    console.error('[GET /api/colaboradores] Erro:', err)
    return NextResponse.json({ colaboradores: [], total: 0, error: err?.message }, { status: 200 })
  }
}

// POST /api/colaboradores — cria colaborador e gera credenciais
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const role = user?.user_metadata?.role ?? user?.app_metadata?.role

    if (!user || role !== 'admin') {
      return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 })
    }

    const body = (await request.json()) as ColaboradorPayload
    const {
      nome, cpf,
      cargo, unidade_id,
      telefone, email, empresa_id
    } = body

    if (!nome?.trim()) return NextResponse.json({ error: 'Nome é obrigatório.' }, { status: 400 })
    if (!cpf?.trim()) return NextResponse.json({ error: 'CPF é obrigatório.' }, { status: 400 })

    const cpfLimpo = cpf.replace(/\D/g, '')
    const supabaseAdmin = getAdminClient()

    const usuario = gerarUsuario(nome.trim())
    const senha = gerarSenha()
    const emailToUse = email?.trim() || `${usuario}@aptusclin.com.br`

    // Cria o usuário na Autenticação do Supabase (se aplicável)
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

    if (authError && !authError.message.includes('already registered')) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    const userId = authData?.user?.id || crypto.randomUUID()

    // Insere na tabela colaboradores
    const { data, error } = await supabaseAdmin
      .from('colaboradores')
      .insert({
        id: userId,
        company_id: empresa_id || null,
        name: nome.trim(),
        cpf: cpfLimpo,
        role: cargo?.trim() || null,
        unidade_id: unidade_id || null,
        email: emailToUse,
        phone: telefone?.trim() || null,
        access_level: 'viewer',
      })
      .select()
      .single()

    if (error) {
      if (authData?.user?.id) {
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      }
      if (error.code === '23505') {
        return NextResponse.json({ error: 'CPF já cadastrado.' }, { status: 409 })
      }
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      colaborador: {
        id: data.id,
        nome: data.name,
        cpf: data.cpf,
        cargo: data.role,
        empresa_id: data.company_id,
      },
      credenciais: { usuario, senha }
    }, { status: 201 })

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro ao criar colaborador.'
    console.error('[POST /api/colaboradores]', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

