import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getAdminClient } from '@/utils/supabase/serverAdmin'

// GET /api/admin/exames — lista todos os exames com suporte a busca e paginação
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
    const companyId = searchParams.get('company_id') || ''
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const offset = (page - 1) * limit

    const supabaseAdmin = getAdminClient()

    let query = supabaseAdmin
      .from('exames')
      .select('*', { count: 'exact' })
      .order('start_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (busca) query = query.ilike('title', `%${busca}%`)
    if (companyId) query = query.eq('company_id', companyId)

    const { data, error, count } = await query

    if (error) {
      console.error('[GET /api/admin/exames]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ exames: data || [], total: count || 0 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro ao buscar exames.'
    console.error('[GET /api/admin/exames] Erro:', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// POST /api/admin/exames — cria novo exame/ASO (somente admin)
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const role = user?.user_metadata?.role ?? user?.app_metadata?.role

    if (!user || role !== 'admin') {
      return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 })
    }

    const payload = await request.json()

    if (!payload.title?.trim()) {
      return NextResponse.json({ error: 'O campo título é obrigatório.' }, { status: 400 })
    }
    if (!payload.start_at) {
      return NextResponse.json({ error: 'A data do exame é obrigatória.' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('exames')
      .insert({
        title: payload.title.trim(),
        description: payload.description?.trim() || null,
        start_at: payload.start_at,
        end_at: payload.end_at || payload.start_at,
        location: payload.location || null,
        company_id: payload.company_id || null,
      })
      .select('*')
      .single()

    if (error) {
      console.error('[POST /api/admin/exames]', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro ao criar exame.'
    console.error('[POST /api/admin/exames] Erro:', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
