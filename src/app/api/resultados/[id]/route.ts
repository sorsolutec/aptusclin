import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getAdminClient } from '@/utils/supabase/serverAdmin'
import { obterSessaoPaciente } from '@/lib/paciente-session'

type Params = { params: Promise<{ id: string }> }

// GET /api/resultados/[id] — retorna exames do colaborador (com proteção IDOR)
export async function GET(_req: Request, { params }: Params) {
  const { id } = await params

  try {
    // Proteção IDOR: valida sessão do paciente
    const supabase = await createClient()
    const { data: { user: adminUser } } = await supabase.auth.getUser()
    const adminRole = adminUser?.user_metadata?.role ?? adminUser?.app_metadata?.role

    if (adminRole !== 'admin') {
      // Não é admin — verifica sessão do paciente via cookie
      const sessao = await obterSessaoPaciente()
      if (!sessao) {
        return NextResponse.json(
          { error: 'Não autorizado. Faça login para continuar.' },
          { status: 401 }
        )
      }
      if (sessao.colaboradorId !== id) {
        return NextResponse.json(
          { error: 'Acesso negado. Você não tem permissão para ver estes resultados.' },
          { status: 403 }
        )
      }
    }

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
    const { data: examesRaw, error: errExames } = await supabase
      .from('exames')
      .select('id, title, tipo, resultado, arquivo_url, status_resultado, start_at, created_at')
      .eq('colaborador_id', id)
      .order('start_at', { ascending: false })

    if (errExames) throw errExames

    // Gera URLs assinadas temporárias (15 min) para arquivos no Storage privado
    const adminClient = getAdminClient()
    const exames = await Promise.all(
      (examesRaw || []).map(async (exame) => {
        let arquivoUrlAssinada: string | undefined = undefined

        if (exame.arquivo_url) {
          try {
            // Extrai o path relativo do Storage a partir da URL pública ou path armazenado
            // O arquivo_url pode ser um path relativo como "exames/uuid.pdf" ou uma URL completa
            const storagePath = exame.arquivo_url.includes('/storage/v1/object/')
              ? exame.arquivo_url.split('/storage/v1/object/public/exames/')[1]
              : exame.arquivo_url.replace(/^exames\//, '')

            if (storagePath) {
              const { data: signed } = await adminClient.storage
                .from('exames')
                .createSignedUrl(storagePath, 900) // 900s = 15 minutos
              arquivoUrlAssinada = signed?.signedUrl
            }
          } catch {
            // Se não conseguir gerar URL assinada, não expõe o link
            arquivoUrlAssinada = undefined
          }
        }

        return {
          ...exame,
          arquivo_url: arquivoUrlAssinada,
        }
      })
    )

    return NextResponse.json({
      colaborador,
      exames,
    })
  } catch (err) {
    console.error('[GET /api/resultados/[id]]', err)
    return NextResponse.json({ error: 'Erro ao buscar resultados.' }, { status: 500 })
  }
}

