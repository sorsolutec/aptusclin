'use client'

import { useState } from 'react'
import {
  Search,
  Download,
  FileText,
  Filter,
  ChevronDown,
  ChevronUp,
  Eye,
  CalendarDays,
  X,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Status = 'Apto' | 'Inapto' | 'Apto com Restrições' | 'Pendente'

type ExamRecord = {
  id: string
  colaborador: string
  cpf: string
  funcao: string
  tipoExame: string
  dataExame: string
  dataVencimento: string
  status: Status
  arquivo?: string
}

// ─── Dados Mockados ───────────────────────────────────────────────────────────

const MOCK_DATA: ExamRecord[] = [
  {
    id: '001',
    colaborador: 'Carlos Eduardo Silva',
    cpf: '123.456.789-00',
    funcao: 'Analista de TI',
    tipoExame: 'Periódico',
    dataExame: '2025-03-15',
    dataVencimento: '2026-03-15',
    status: 'Apto',
    arquivo: '#',
  },
  {
    id: '002',
    colaborador: 'Maria Fernanda Santos',
    cpf: '987.654.321-00',
    funcao: 'Coordenadora RH',
    tipoExame: 'Admissional',
    dataExame: '2025-05-10',
    dataVencimento: '2026-05-10',
    status: 'Apto',
    arquivo: '#',
  },
  {
    id: '003',
    colaborador: 'João Pedro Oliveira',
    cpf: '456.789.123-00',
    funcao: 'Operador de Máquinas',
    tipoExame: 'Periódico',
    dataExame: '2025-01-20',
    dataVencimento: '2025-07-20',
    status: 'Apto com Restrições',
    arquivo: '#',
  },
  {
    id: '004',
    colaborador: 'Ana Beatriz Costa',
    cpf: '321.654.987-00',
    funcao: 'Analista Financeira',
    tipoExame: 'Retorno ao Trabalho',
    dataExame: '2025-06-01',
    dataVencimento: '2026-06-01',
    status: 'Apto',
    arquivo: '#',
  },
  {
    id: '005',
    colaborador: 'Ricardo Martins',
    cpf: '654.321.789-00',
    funcao: 'Motorista',
    tipoExame: 'Periódico',
    dataExame: '2025-02-28',
    dataVencimento: '2025-02-28',
    status: 'Inapto',
    arquivo: '#',
  },
  {
    id: '006',
    colaborador: 'Patricia Lima',
    cpf: '789.123.456-00',
    funcao: 'Supervisora de Produção',
    tipoExame: 'Mudança de Função',
    dataExame: '2025-04-05',
    dataVencimento: '2026-04-05',
    status: 'Pendente',
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusConfig: Record<Status, { label: string; color: string; icon: React.ElementType }> = {
  Apto: {
    label: 'Apto',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: CheckCircle2,
  },
  Inapto: {
    label: 'Inapto',
    color: 'bg-red-50 text-red-700 border-red-200',
    icon: AlertTriangle,
  },
  'Apto com Restrições': {
    label: 'Apto c/ Restrições',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: AlertTriangle,
  },
  Pendente: {
    label: 'Pendente',
    color: 'bg-slate-100 text-slate-600 border-slate-200',
    icon: Clock,
  },
}

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

function isExpired(dateStr: string) {
  return new Date(dateStr) < new Date()
}

const TIPOS_EXAME = ['Todos', 'Admissional', 'Periódico', 'Demissional', 'Retorno ao Trabalho', 'Mudança de Função']
const STATUS_OPTIONS: ('Todos' | Status)[] = ['Todos', 'Apto', 'Inapto', 'Apto com Restrições', 'Pendente']

// ─── Componente ───────────────────────────────────────────────────────────────

export default function DocumentosPage() {
  const [busca, setBusca] = useState('')
  const [tipoFiltro, setTipoFiltro] = useState('Todos')
  const [statusFiltro, setStatusFiltro] = useState<'Todos' | Status>('Todos')
  const [ordenacao, setOrdenacao] = useState<{ campo: keyof ExamRecord; dir: 'asc' | 'desc' }>({
    campo: 'colaborador',
    dir: 'asc',
  })
  const [expandido, setExpandido] = useState<string | null>(null)

  // Filtrar
  const filtrados = MOCK_DATA.filter((r) => {
    const matchBusca =
      r.colaborador.toLowerCase().includes(busca.toLowerCase()) ||
      r.cpf.includes(busca) ||
      r.funcao.toLowerCase().includes(busca.toLowerCase())
    const matchTipo = tipoFiltro === 'Todos' || r.tipoExame === tipoFiltro
    const matchStatus = statusFiltro === 'Todos' || r.status === statusFiltro
    return matchBusca && matchTipo && matchStatus
  })

  // Ordenar
  const ordenados = [...filtrados].sort((a, b) => {
    const va = String(a[ordenacao.campo] ?? '')
    const vb = String(b[ordenacao.campo] ?? '')
    return ordenacao.dir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
  })

  const toggleOrdem = (campo: keyof ExamRecord) => {
    setOrdenacao((prev) =>
      prev.campo === campo
        ? { campo, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { campo, dir: 'asc' }
    )
  }

  const SortIcon = ({ campo }: { campo: keyof ExamRecord }) =>
    ordenacao.campo === campo ? (
      ordenacao.dir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
    ) : (
      <ChevronDown className="w-3 h-3 opacity-30" />
    )

  const limparFiltros = () => {
    setBusca('')
    setTipoFiltro('Todos')
    setStatusFiltro('Todos')
  }

  const temFiltrosAtivos = busca || tipoFiltro !== 'Todos' || statusFiltro !== 'Todos'

  // Stats rápidos
  const stats = {
    total: MOCK_DATA.length,
    aptos: MOCK_DATA.filter((r) => r.status === 'Apto').length,
    vencendo: MOCK_DATA.filter((r) => r.dataVencimento && isExpired(r.dataVencimento)).length,
    pendentes: MOCK_DATA.filter((r) => r.status === 'Pendente').length,
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Resultados de Exames</h1>
          <p className="text-sm text-slate-500 mt-0.5">ASO e laudos ocupacionais dos colaboradores</p>
        </div>
        <Button
          onClick={() => window.print()}
          variant="outline"
          size="sm"
          className="gap-2 border-slate-200 text-slate-600 hover:border-[#002855] hover:text-[#002855]"
        >
          <Download className="w-4 h-4" />
          Exportar lista
        </Button>
      </div>

      {/* Stats rápidos */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total de exames', value: stats.total, color: 'text-slate-700', bg: 'bg-slate-50 border-slate-200' },
          { label: 'Aptos', value: stats.aptos, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
          { label: 'Vencidos', value: stats.vencendo, color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
          { label: 'Pendentes', value: stats.pendentes, color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.bg}`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-slate-600 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtros
            {temFiltrosAtivos && (
              <button
                onClick={limparFiltros}
                className="ml-auto flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium"
              >
                <X className="w-3 h-3" /> Limpar filtros
              </button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Busca */}
            <div className="relative sm:col-span-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Nome, CPF ou função..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all"
              />
            </div>

            {/* Tipo */}
            <select
              value={tipoFiltro}
              onChange={(e) => setTipoFiltro(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all"
            >
              {TIPOS_EXAME.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>

            {/* Status */}
            <select
              value={statusFiltro}
              onChange={(e) => setStatusFiltro(e.target.value as typeof statusFiltro)}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <span className="text-sm text-slate-500">
            <span className="font-semibold text-slate-700">{ordenados.length}</span> resultado{ordenados.length !== 1 ? 's' : ''} encontrado{ordenados.length !== 1 ? 's' : ''}
          </span>
          <button
            onClick={limparFiltros}
            className="text-xs text-slate-400 hover:text-[#002855] flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3 h-3" /> Atualizar
          </button>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-white">
                {[
                  { label: 'Colaborador', campo: 'colaborador' as keyof ExamRecord },
                  { label: 'CPF', campo: 'cpf' as keyof ExamRecord },
                  { label: 'Tipo de Exame', campo: 'tipoExame' as keyof ExamRecord },
                  { label: 'Data do Exame', campo: 'dataExame' as keyof ExamRecord },
                  { label: 'Vencimento', campo: 'dataVencimento' as keyof ExamRecord },
                  { label: 'Status', campo: 'status' as keyof ExamRecord },
                  { label: 'Ações', campo: null },
                ].map((col) => (
                  <th
                    key={col.label}
                    onClick={() => col.campo && toggleOrdem(col.campo)}
                    className={`px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider ${col.campo ? 'cursor-pointer hover:text-[#002855] select-none' : ''}`}
                  >
                    <span className="flex items-center gap-1">
                      {col.label}
                      {col.campo && <SortIcon campo={col.campo} />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {ordenados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-slate-400 text-sm">
                    <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    Nenhum resultado encontrado com os filtros aplicados.
                  </td>
                </tr>
              ) : (
                ordenados.map((r) => {
                  const sc = statusConfig[r.status]
                  const Icon = sc.icon
                  const expired = r.dataVencimento && isExpired(r.dataVencimento)

                  return (
                    <tr key={r.id} className="hover:bg-slate-50/60 transition-colors group">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800">{r.colaborador}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{r.funcao}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-500 font-mono text-xs">{r.cpf}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 bg-blue-50 text-[#002855] text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-100">
                          <FileText className="w-3 h-3" />
                          {r.tipoExame}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 text-xs">
                        <div className="flex items-center gap-1.5">
                          <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                          {formatDate(r.dataExame)}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {r.dataVencimento ? (
                          <span className={`flex items-center gap-1.5 font-medium ${expired ? 'text-red-600' : 'text-slate-600'}`}>
                            <CalendarDays className="w-3.5 h-3.5" />
                            {formatDate(r.dataVencimento)}
                            {expired && (
                              <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">VENCIDO</span>
                            )}
                          </span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${sc.color}`}>
                          <Icon className="w-3 h-3" />
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {r.arquivo ? (
                            <>
                              <a
                                href={r.arquivo}
                                className="flex items-center gap-1 text-xs text-[#002855] hover:text-[#00b4d8] font-semibold transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                Ver
                              </a>
                              <span className="text-slate-200">|</span>
                              <a
                                href={r.arquivo}
                                download
                                className="flex items-center gap-1 text-xs text-[#002855] hover:text-[#00b4d8] font-semibold transition-colors"
                              >
                                <Download className="w-3.5 h-3.5" />
                                ASO
                              </a>
                            </>
                          ) : (
                            <span className="text-xs text-slate-300 italic">Aguardando</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-slate-100">
          {ordenados.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
              Nenhum resultado encontrado.
            </div>
          ) : (
            ordenados.map((r) => {
              const sc = statusConfig[r.status]
              const Icon = sc.icon
              const expired = r.dataVencimento && isExpired(r.dataVencimento)
              const isOpen = expandido === r.id

              return (
                <div key={r.id} className="p-4">
                  <button
                    className="w-full flex items-center justify-between text-left"
                    onClick={() => setExpandido(isOpen ? null : r.id)}
                  >
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{r.colaborador}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{r.funcao}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${sc.color}`}>
                        <Icon className="w-3 h-3" />
                        {sc.label}
                      </span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="mt-3 space-y-2 text-sm border-t border-slate-100 pt-3">
                      <div className="flex justify-between">
                        <span className="text-slate-500">CPF</span>
                        <span className="font-mono text-xs text-slate-700">{r.cpf}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Tipo</span>
                        <span className="text-slate-700">{r.tipoExame}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Data</span>
                        <span className="text-slate-700">{formatDate(r.dataExame)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Vencimento</span>
                        <span className={expired ? 'text-red-600 font-semibold' : 'text-slate-700'}>
                          {r.dataVencimento ? formatDate(r.dataVencimento) : '—'}
                        </span>
                      </div>
                      {r.arquivo && (
                        <div className="flex gap-2 mt-3">
                          <a href={r.arquivo} className="flex-1 flex items-center justify-center gap-1.5 bg-[#002855] text-white text-xs font-bold py-2 rounded-lg">
                            <Eye className="w-3.5 h-3.5" /> Ver ASO
                          </a>
                          <a href={r.arquivo} download className="flex-1 flex items-center justify-center gap-1.5 border border-[#002855] text-[#002855] text-xs font-bold py-2 rounded-lg">
                            <Download className="w-3.5 h-3.5" /> Baixar
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </Card>
    </div>
  )
}
