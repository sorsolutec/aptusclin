import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getAdminClient } from '@/utils/supabase/serverAdmin'

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

    const supabase = await createClient()
    let query = (supabase as any)
      .from('companies')
      .select('*, employees(count)', { count: 'exact' })
      .order('name')
      .range(offset, offset + limit - 1)

    if (busca) {
      query = query.or(`name.ilike.%${busca}%,cnpj.ilike.%${busca}%,contact_email.ilike.%${busca}%`)
    }

    const { data, count, error } = await query
    if (error) throw error

    const mapped = (data || []).map((c: any) => ({
      id: c.id,
      nome: c.name,
      cnpj: c.cnpj,
      cpf: c.cpf,
      tipo: c.tipo || 'PJ',
      email: c.contact_email,
      responsavel: c.contact_email,
      ativo: true,
      colaboradores: c.employees,
      created_at: c.created_at
    }))

    return NextResponse.json({ clientes: mapped, total: count || 0 })
  } catch (err) {
    console.error('[GET /api/clientes]', err)
    return NextResponse.json({ error: 'Erro ao buscar clientes.' }, { status: 500 })
  }
}

// POST /api/clientes — cria novo cliente (PJ ou PF)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nome, cnpj, cpf, email, telefone, responsavel, endereco, cidade, estado, unidade_id, tipo } = body

    if (!nome?.trim()) return NextResponse.json({ error: 'Nome é obrigatório.' }, { status: 400 })

    const supabase = await createClient()
    const supabaseAdmin = getAdminClient()

    // ── PJ: salva na companies sem criar Auth ──────────────────────────────
    if (tipo === 'PJ' || !tipo) {
      if (!cnpj) return NextResponse.json({ error: 'CNPJ é obrigatório para Pessoa Jurídica.' }, { status: 400 })

      const { data, error } = await (supabaseAdmin as any)
        .from('companies')
        .insert({
          name: nome.trim(),
          cnpj: cnpj?.replace(/\D/g, '') || null,
          contact_email: email?.trim() || null,
          phone: telefone?.trim() || null,
          tipo: 'PJ',
        })
        .select()
        .single()

      if (error) {
        if (error.code === '23505') return NextResponse.json({ error: 'CNPJ já cadastrado.' }, { status: 409 })
        throw error
      }

      return NextResponse.json({ cliente: data }, { status: 201 })
    }

    // ── PF: cria usuário no Auth + salva na companies ──────────────────────
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

    // Salva na tabela companies vinculando ao Auth ID
    const { data, error } = await (supabaseAdmin as any)
      .from('companies')
      .insert({
        id: userId,
        name: nome.trim(),
        cpf: cpfLimpo,
        contact_email: email.trim(),
        phone: telefone?.trim() || null,
        tipo: 'PF',
        access_code: codigo,
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

  } catch (err) {
    console.error('[POST /api/clientes]', err)
    return NextResponse.json({ error: 'Erro ao criar cliente.' }, { status: 500 })
  }
}
