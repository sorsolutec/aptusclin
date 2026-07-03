import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

type Params = { params: Promise<{ id: string }> }

// GET /api/resultados/[id] — retorna exames do colaborador
export async function GET(_req: Request, { params }: Params) {
  const { id } = await params

  try {
    const supabase = await createClient()

    // Busca o colaborador
    const { data: colaborador, error: errColaborador } = await supabase
      .from('colaboradores')
      .select('id, nome, cargo, status_aso, empresa_id, empresas(nome)')
      .eq('id', id)
      .eq('ativo', true)
      .single()

    if (errColaborador || !colaborador) {
      return NextResponse.json({ error: 'Colaborador não encontrado.' }, { status: 404 })
    }

    // Busca os exames do colaborador
    const { data: exames, error: errExames } = await supabase
      .from('exames')
      .select('id, title, tipo, resultado, arquivo_url, status_resultado, start_at, created_at')
      .eq('colaborador_id', id)
      .order('start_at', { ascending: false })

    if (errExames) throw errExames

    return NextResponse.json({
      colaborador,
      exames: exames || [],
    })
  } catch (err) {
    console.error('[GET /api/resultados/[id]]', err)
    return NextResponse.json({ error: 'Erro ao buscar resultados.' }, { status: 500 })
  }
}
