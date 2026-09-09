import { NextResponse } from 'next/server'
import { getAdminClient } from '@/utils/supabase/serverAdmin'

interface ClientePayload {
  nome?: string
  cnpj?: string
  cpf?: string
  email?: string
  telefone?: string
  responsavel?: string
  endereco?: string
  cidade?: string
  estado?: string
  unidade_id?: string
  tipo?: string
}

/** Gera senha aleatória de 8 caracteres (sem ambíguos) */
function gerarSenha(tamanho = 8): string {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789'
  return Array.from({ length: tamanho }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

/** Gera código de acesso numérico de 6 dígitos */
function gerarCodigo(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}

// GET /api/clientes — lista empresas clientes
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const busca = searchParams.get('q') || ''
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const offset = (page - 1) * limit

    const supabaseAdmin = getAdminClient()

    let query = supabaseAdmin
      .from('empresas')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (busca) {
      query = query.or(`name.ilike.%${busca}%,cnpj.ilike.%${busca}%,contact_email.ilike.%${busca}%`)
    }

    const { data, error, count } = await query

    if (error) {
      console.warn('[GET /api/clientes] Aviso na consulta:', error)
      return NextResponse.json({ clientes: [], total: 0 })
    }

    const mapped = (data || []).map((c: any) => ({
      id: c.id,
      nome: c.name || c.nome || 'Sem nome',
      cnpj: c.cnpj || '',
      cpf: c.cpf || '',
      tipo: c.tipo || (c.cpf ? 'PF' : 'PJ'),
      email: c.contact_email || c.email || '',
      telefone: c.phone || c.telefone || '',
      responsavel: c.responsavel || c.name || '',
      cidade: c.cidade || '',
      estado: c.estado || '',
      unidade_id: c.unidade_id || '',
      ativo: c.ativo !== false,
      colaboradores: [],
      created_at: c.created_at,
    }))

    return NextResponse.json({ clientes: mapped, total: count || mapped.length })
  } catch (err: any) {
    console.error('[GET /api/clientes] Erro completo:', err)
    return NextResponse.json({ clientes: [], total: 0, error: err?.message }, { status: 200 })
  }
}

// POST /api/clientes — cria novo cliente (PJ ou PF)
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ClientePayload
    const { nome, cnpj, cpf, email, telefone, responsavel, endereco, cidade, estado, unidade_id, tipo } = body

    if (!nome?.trim()) return NextResponse.json({ error: 'Nome é obrigatório.' }, { status: 400 })

    const supabaseAdmin = getAdminClient()

    // ── PJ: salva na tabela empresas sem criar Auth ──────────────────────────────
    if (tipo === 'PJ' || !tipo) {
      if (!cnpj) return NextResponse.json({ error: 'CNPJ é obrigatório para Pessoa Jurídica.' }, { status: 400 })

      const cnpjLimpo = cnpj.replace(/\D/g, '')

      const { data, error } = await supabaseAdmin
        .from('empresas')
        .insert({
          name: nome.trim(),
          cnpj: cnpjLimpo,
          contact_email: email?.trim() || null,
          phone: telefone?.trim() || null,
          tipo: 'PJ',
        })
        .select()
        .single()

      if (error) {
        if (error.code === '23505') return NextResponse.json({ error: 'CNPJ já cadastrado.' }, { status: 409 })
        console.error('[POST /api/clientes PJ] Erro:', error)
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json({
        cliente: {
          id: data.id,
          nome: data.name,
          cnpj: data.cnpj,
          email: data.contact_email,
          telefone: data.phone,
          created_at: data.created_at,
        }
      }, { status: 201 })
    }

    // ── PF: cria usuário no Auth + salva na empresas ──────────────────────
    if (!email?.trim()) return NextResponse.json({ error: 'E-mail é obrigatório para Pessoa Física.' }, { status: 400 })
    if (!cpf) return NextResponse.json({ error: 'CPF é obrigatório para Pessoa Física.' }, { status: 400 })

    const senha = gerarSenha()
    const codigo = gerarCodigo()
    const cpfLimpo = cpf.replace(/\D/g, '')

    // Cria o usuário no Supabase Auth com flag firstLogin
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email.trim(),
      password: senha,
      email_confirm: true,
      user_metadata: {
        role: 'cliente',
        name: nome.trim(),
        firstLogin: true,
        tipo: 'PF',
      }
    })

    if (authError) {
      if (authError.message.includes('already registered')) {
        return NextResponse.json({ error: 'Este e-mail já está cadastrado no sistema.' }, { status: 409 })
      }
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    const userId = authData.user.id

    // Salva na tabela empresas vinculando ao Auth ID
    const { data, error } = await supabaseAdmin
      .from('empresas')
      .insert({
        id: userId,
        name: nome.trim(),
        cpf: cpfLimpo,
        contact_email: email.trim(),
        phone: telefone?.trim() || null,
        tipo: 'PF',
      })
      .select()
      .single()

    if (error) {
      // Rollback: apaga o usuário do Auth se falhar
      await supabaseAdmin.auth.admin.deleteUser(userId)
      if (error.code === '23505') return NextResponse.json({ error: 'CPF já cadastrado.' }, { status: 409 })
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      cliente: {
        id: data.id,
        nome: data.name,
        cpf: data.cpf,
        email: data.contact_email,
        telefone: data.phone,
        created_at: data.created_at,
      },
      credenciais: { codigo, senha, email: email.trim() },
    }, { status: 201 })

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro ao criar cliente.'
    console.error('[POST /api/clientes] Erro:', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

