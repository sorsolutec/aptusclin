import { createClient } from '@/utils/supabase/server'
import {
  Search,
  Download,
  FileText,
  CalendarDays,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { redirect } from 'next/navigation'

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Status = 'Apto' | 'Inapto' | 'Apto com Restrições' | 'Pendente'

interface ExamRecord {
  id: string
  title: string
  tipo?: string | null
  resultado?: string | null
  status_resultado?: Status | null
  arquivo_url?: string | null
  start_at?: string | null
  created_at?: string | null
  colaborador?: { id: string; nome: string; cpf?: string | null; cargo?: string | null } | null
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusConfig: Record<string, { label: string; color: string; Icon: React.ElementType }> = {
  Apto: {
    label: 'Apto',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Icon: CheckCircle2,
  },
  Inapto: {
    label: 'Inapto',
    color: 'bg-red-50 text-red-700 border-red-200',
    Icon: AlertTriangle,
  },
  'Apto com Restrições': {
    label: 'Apto c/ Restrições',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    Icon: AlertTriangle,
  },
  Pendente: {
    label: 'Pendente',
    color: 'bg-slate-100 text-slate-600 border-slate-200',
    Icon: Clock,
  },
}

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('pt-BR')
}

function getStatus(exam: ExamRecord): string {
  return exam.status_resultado ?? 'Pendente'
}

// ─── Server Component ─────────────────────────────────────────────────────────

export default async function DocumentosPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const role = user?.user_metadata?.role ?? user?.app_metadata?.role

  // Busca exames: admin vê todos, cliente vê apenas os da sua empresa
  let query = supabase
    .from('exames')
    .select('id, title, tipo, resultado, status_resultado, arquivo_url, start_at, created_at, colaborador:colaborador_id(id, nome, cpf, cargo)')
    .order('start_at', { ascending: false })

  if (role !== 'admin') {
    // Identifica o company_id do usuário logado
    const { data: company } = await supabase
      .from('companies')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!company) {
      redirect('/login')
    }

    query = query.eq('company_id', company.id)
  }

  const { data: exames, error } = await query

  if (error) {
    console.error('[documentos] erro ao buscar exames:', error.message)
  }

  const records: ExamRecord[] = (exames ?? []) as ExamRecord[]

  // Stats
  const stats = {
    total: records.length,
    aptos: records.filter((r) => getStatus(r) === 'Apto').length,
    inaptos: records.filter((r) => getStatus(r) === 'Inapto').length,
    pendentes: records.filter((r) => getStatus(r) === 'Pendente').length,
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Resultados de Exames</h1>
          <p className="text-sm text-slate-500 mt-0.5">ASO e laudos ocupacionais dos colaboradores</p>
        </div>
        <button
          onClick={undefined}
          className="flex items-center gap-2 px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 hover:border-[#002855] hover:text-[#002855] transition-colors"
        >
          <Download className="w-4 h-4" />
          Exportar lista
        </button>
      </div>

      {/* Stats rápidos */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total de exames', value: stats.total, color: 'text-slate-700', bg: 'bg-slate-50 border-slate-200' },
          { label: 'Aptos', value: stats.aptos, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
          { label: 'Inaptos', value: stats.inaptos, color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
          { label: 'Pendentes', value: stats.pendentes, color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.bg}`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabela */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="text-sm font-semibold text-slate-600 flex items-center gap-2">
            <Search className="w-4 h-4" />
            {records.length} resultado{records.length !== 1 ? 's' : ''} encontrado{records.length !== 1 ? 's' : ''}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {records.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-sm">
              <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
              Nenhum exame encontrado.
            </div>
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-white">
                      {['Colaborador', 'Tipo de Exame', 'Data', 'Status', 'Arquivo'].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {records.map((r) => {
                      const statusKey = getStatus(r)
                      const sc = statusConfig[statusKey] ?? statusConfig['Pendente']
                      const { Icon } = sc

                      return (
                        <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-medium text-slate-800">
                              {r.colaborador?.nome ?? '—'}
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5">
                              {r.colaborador?.cargo ?? ''}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1.5 bg-[#002855]/10 text-[#002855] text-xs font-semibold px-2.5 py-1 rounded-full border border-[#002855]/20">
                              <FileText className="w-3 h-3" />
                              {r.tipo ?? r.title}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-600 text-xs">
                            <div className="flex items-center gap-1.5">
                              <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                              {formatDate(r.start_at)}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${sc.color}`}
                            >
                              <Icon className="w-3 h-3" />
                              {sc.label}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {r.arquivo_url ? (
                              <div className="flex items-center gap-2">
                                <a
                                  href={r.arquivo_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-xs text-[#002855] hover:text-[#00b4d8] font-semibold transition-colors"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  Ver
                                </a>
                                <span className="text-slate-200">|</span>
                                <a
                                  href={r.arquivo_url}
                                  download
                                  className="flex items-center gap-1 text-xs text-[#002855] hover:text-[#00b4d8] font-semibold transition-colors"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  Baixar
                                </a>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-300 italic">Aguardando</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile */}
              <div className="md:hidden divide-y divide-slate-100">
                {records.map((r) => {
                  const statusKey = getStatus(r)
                  const sc = statusConfig[statusKey] ?? statusConfig['Pendente']
                  const { Icon } = sc

                  return (
                    <div key={r.id} className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">
                            {r.colaborador?.nome ?? '—'}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">{r.tipo ?? r.title}</p>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${sc.color}`}
                        >
                          <Icon className="w-3 h-3" />
                          {sc.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        <CalendarDays className="inline w-3.5 h-3.5 mr-1" />
                        {formatDate(r.start_at)}
                      </p>
                      {r.arquivo_url && (
                        <div className="flex gap-2 mt-2">
                          <a
                            href={r.arquivo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-1.5 bg-[#002855] text-white text-xs font-bold py-2 rounded-lg"
                          >
                            <Eye className="w-3.5 h-3.5" /> Ver ASO
                          </a>
                          <a
                            href={r.arquivo_url}
                            download
                            className="flex-1 flex items-center justify-center gap-1.5 border border-[#002855] text-[#002855] text-xs font-bold py-2 rounded-lg"
                          >
                            <Download className="w-3.5 h-3.5" /> Baixar
                          </a>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
