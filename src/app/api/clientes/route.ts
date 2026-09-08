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
    const unidade = searchParams.get('unidade') || ''
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const offset = (page - 1) * limit

    const supabaseAdmin = getAdminClient()

    // 1. Tenta buscar em 'empresas' com contagem de 'colaboradores'
    let data: any[] | null = null
    let count: number | null = null

    try {
      let query = supabaseAdmin
        .from('empresas')
        .select('*, colaboradores(count)', { count: 'exact' })
        .order('nome')
        .range(offset, offset + limit - 1)

      if (busca) {
        query = query.or(`nome.ilike.%${busca}%,cnpj.ilike.%${busca}%,email.ilike.%${busca}%`)
      }
      if (unidade) {
        query = query.eq('unidade_id', unidade)
      }

      const res = await query
      if (res.error) throw res.error
      data = res.data
      count = res.count
    } catch (relationErr) {
      // Fallback: consulta sem join se a relação colaboradores(count) falhar
      console.warn('[GET /api/clientes] Fallback sem join de colaboradores:', relationErr)
      let queryFallback = supabaseAdmin
        .from('empresas')
        .select('*', { count: 'exact' })
        .order('nome')
        .range(offset, offset + limit - 1)

      if (busca) {
        queryFallback = queryFallback.or(`nome.ilike.%${busca}%,cnpj.ilike.%${busca}%,email.ilike.%${busca}%`)
      }
      if (unidade) {
        queryFallback = queryFallback.eq('unidade_id', unidade)
      }

      const resFallback = await queryFallback
      if (resFallback.error) {
        // Se a tabela 'empresas' falhar, tenta 'companies'
        console.warn('[GET /api/clientes] Fallback para companies:', resFallback.error)
        let queryCompanies = supabaseAdmin
          .from('companies')
          .select('*', { count: 'exact' })
          .range(offset, offset + limit - 1)
        const resCompanies = await queryCompanies
        if (resCompanies.error) throw resFallback.error
        data = (resCompanies.data || []).map((c: any) => ({
          ...c,
          nome: c.name || c.nome,
          email: c.contact_email || c.email,
        }))
        count = resCompanies.count
      } else {
        data = resFallback.data
        count = resFallback.count
      }
    }

    const mapped = (data || []).map((c: any) => ({
      id: c.id,
      nome: c.nome || c.name || 'Sem nome',
      cnpj: c.cnpj,
      cpf: c.cpf,
      tipo: c.tipo || (c.cpf ? 'PF' : 'PJ'),
      email: c.email || c.contact_email,
      telefone: c.telefone || c.phone,
      responsavel: c.responsavel || c.contact_email,
      cidade: c.cidade,
      estado: c.estado,
      unidade_id: c.unidade_id,
      ativo: c.ativo !== false,
      colaboradores: c.colaboradores || c.employees || [],
      created_at: c.created_at,
    }))

    return NextResponse.json({ clientes: mapped, total: count || mapped.length })
  } catch (err: any) {
    console.error('[GET /api/clientes] Erro completo:', err)
    return NextResponse.json({ error: err?.message || 'Erro ao buscar clientes.' }, { status: 500 })
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
          nome: nome.trim(),
          cnpj: cnpjLimpo,
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
        if (error.code === '23505') return NextResponse.json({ error: 'CNPJ já cadastrado.' }, { status: 409 })
        throw error
      }

      return NextResponse.json({ cliente: data }, { status: 201 })
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
      throw authError
    }

    const userId = authData.user.id

    // Salva na tabela empresas vinculando ao Auth ID
    const { data, error } = await supabaseAdmin
      .from('empresas')
      .insert({
        id: userId,
        nome: nome.trim(),
        cpf: cpfLimpo,
        email: email.trim(),
        telefone: telefone?.trim() || null,
        responsavel: responsavel?.trim() || nome.trim(),
        endereco: endereco?.trim() || null,
        cidade: cidade?.trim() || null,
        estado: estado?.trim() || null,
        unidade_id: unidade_id || null,
        ativo: true,
      })
      .select()
      .single()

    if (error) {
      // Rollback: apaga o usuário do Auth se falhar
      await supabaseAdmin.auth.admin.deleteUser(userId)
      if (error.code === '23505') return NextResponse.json({ error: 'CPF já cadastrado.' }, { status: 409 })
      throw error
    }

    return NextResponse.json({
      cliente: data,
      credenciais: { codigo, senha, email: email.trim() },
    }, { status: 201 })

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro ao criar cliente.'
    console.error('[POST /api/clientes] Erro:', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
