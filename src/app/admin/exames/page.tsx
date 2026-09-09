'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Search,
  X,
  Plus,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  FileText,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

type Status = 'Apto' | 'Inapto' | 'Apto com Restrições' | 'Pendente'

type ExamRecord = {
  id: string
  title: string
  description?: string
  start_at?: string
  end_at?: string
  location?: string   // usado para armazenar o status do ASO
  company_id?: string
  empresa_nome?: string
  created_at?: string
}

const TIPOS_EXAME = [
  'Admissional',
  'Periódico',
  'Demissional',
  'Mudança de Função',
  'Retorno ao Trabalho',
  'Avaliação Clínica Complementar',
]

function parseStatus(exam: ExamRecord): Status {
  const s = exam.location || ''
  if (s === 'Inapto') return 'Inapto'
  if (s === 'Apto com Restrições') return 'Apto com Restrições'
  if (s === 'Pendente') return 'Pendente'
  return 'Apto'
}

function parseTipo(exam: ExamRecord): string {
  if (!exam.title) return '—'
  const parts = exam.title.split(' - ')
  return parts[0] || exam.title
}

function parseColaborador(exam: ExamRecord): string {
  if (!exam.title) return '—'
  const parts = exam.title.split(' - ')
  return parts.slice(1).join(' - ') || '—'
}

function parseCpf(exam: ExamRecord): string {
  const desc = exam.description || ''
  const match = desc.match(/CPF:\s*([^\s|]+)/)
  return match ? match[1] : '—'
}

function parseFuncao(exam: ExamRecord): string {
  const desc = exam.description || ''
  const match = desc.match(/Função:\s*([^|]+)/)
  return match ? match[1].trim() : '—'
}

const getStatusBadge = (status: Status) => {
  switch (status) {
    case 'Apto':
      return <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-none hover:bg-emerald-100 font-semibold">Apto</Badge>
    case 'Inapto':
      return <Badge className="bg-red-100 text-red-800 border border-red-200 shadow-none hover:bg-red-100 font-semibold">Inapto</Badge>
    case 'Apto com Restrições':
      return <Badge className="bg-amber-100 text-amber-800 border border-amber-200 shadow-none hover:bg-amber-100 font-semibold">Apto c/ Restrições</Badge>
    case 'Pendente':
      return <Badge className="bg-slate-100 text-slate-800 border border-slate-200 shadow-none hover:bg-slate-100 font-semibold">Pendente</Badge>
  }
}

const isVencido = (dataVencimento?: string) => {
  if (!dataVencimento) return false
  return new Date(dataVencimento) < new Date()
}

export default function AdminExamesPage() {
  const [exames, setExames] = useState<ExamRecord[]>([])
  const [total, setTotal] = useState(0)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [busca, setBusca] = useState('')
  const [tipoFiltro, setTipoFiltro] = useState('')
  const [statusFiltro, setStatusFiltro] = useState('')

  const carregar = useCallback(async () => {
    setCarregando(true)
    setErro('')
    try {
      const res = await fetch('/api/admin/exames')
      if (!res.ok) throw new Error(`Erro ${res.status}`)
      const json = await res.json()
      const lista: ExamRecord[] = Array.isArray(json) ? json : (json.exames || [])
      setExames(lista)
      setTotal(lista.length)
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : 'Não foi possível carregar os exames.')
      setExames([])
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => { carregar() }, [carregar])

  async function handleExcluir(id: string) {
    if (!confirm('Deseja remover este registro de exame?')) return
    const res = await fetch(`/api/admin/exames/${id}`, { method: 'DELETE' })
    if (res.ok) carregar()
    else alert('Erro ao remover o exame.')
  }

  const limparFiltros = () => {
    setBusca('')
    setTipoFiltro('')
    setStatusFiltro('')
  }

  const examesFiltrados = exames.filter((exam) => {
    const colab = parseColaborador(exam).toLowerCase()
    const cpf = parseCpf(exam)
    const funcao = parseFuncao(exam).toLowerCase()
    const tipo = parseTipo(exam)
    const status = parseStatus(exam)

    const atendeBusca =
      busca === '' ||
      colab.includes(busca.toLowerCase()) ||
      cpf.includes(busca) ||
      funcao.includes(busca.toLowerCase())

    const atendeTipo = tipoFiltro === '' || tipo === tipoFiltro
    const atendeStatus = statusFiltro === '' || status === statusFiltro

    return atendeBusca && atendeTipo && atendeStatus
  })

  const temFiltroAtivo = busca !== '' || tipoFiltro !== '' || statusFiltro !== ''

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Lançamentos de Exames e ASO</h1>
          <p className="text-sm text-slate-500 mt-1">
            {total} registro{total !== 1 ? 's' : ''} cadastrado{total !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/admin/exames/novo">
          <Button className="bg-[#002855] hover:bg-[#001a3d] text-white font-semibold flex items-center gap-2 shadow-sm">
            <Plus className="w-4 h-4" /> Lançar Exame / ASO
          </Button>
        </Link>
      </div>

      {/* Filtros */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="relative md:col-span-2">
              <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por colaborador ou CPF..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all bg-slate-50/50"
              />
            </div>

            <select
              value={tipoFiltro}
              onChange={(e) => setTipoFiltro(e.target.value)}
              className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-lg bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all text-slate-600"
            >
              <option value="">Todos os Tipos de Exame</option>
              {TIPOS_EXAME.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            <div className="flex gap-2">
              <select
                value={statusFiltro}
                onChange={(e) => setStatusFiltro(e.target.value)}
                className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-lg bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all text-slate-600"
              >
                <option value="">Todos os Status</option>
                <option value="Apto">Apto</option>
                <option value="Inapto">Inapto</option>
                <option value="Apto com Restrições">Apto com Restrições</option>
                <option value="Pendente">Pendente</option>
              </select>

              {temFiltroAtivo && (
                <Button
                  onClick={limparFiltros}
                  variant="outline"
                  size="icon"
                  title="Limpar filtros"
                  className="flex-shrink-0 border-slate-200 text-slate-500 hover:text-slate-800"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Erro */}
      {erro && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-amber-800 text-sm font-semibold">Não foi possível carregar os exames</p>
            <p className="text-amber-700 text-xs mt-1">{erro}</p>
            <p className="text-amber-600 text-xs mt-1">
              Verifique se a tabela <code>exames</code> existe no Supabase e se as permissões de RLS estão configuradas.
            </p>
          </div>
        </div>
      )}

      {/* Tabela */}
      {carregando ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-7 h-7 animate-spin text-[#002855]/40" />
        </div>
      ) : (
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Colaborador</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tipo / Função</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Data Exame</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Vencimento</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {examesFiltrados.length > 0 ? (
                  examesFiltrados.map((exam) => (
                    <tr key={exam.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-slate-800">{parseColaborador(exam)}</div>
                        <div className="text-xs text-slate-400">{parseCpf(exam)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        <div>{parseTipo(exam)}</div>
                        <div className="text-xs text-slate-400">{parseFuncao(exam)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {exam.start_at
                          ? new Date(exam.start_at).toLocaleDateString('pt-BR')
                          : '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {exam.end_at ? (
                          <span className={isVencido(exam.end_at) ? 'text-red-600 font-semibold' : 'text-slate-600'}>
                            {new Date(exam.end_at).toLocaleDateString('pt-BR')}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(parseStatus(exam))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/exames/editar/${exam.id}`}>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleExcluir(exam.id)}
                            className="h-8 w-8 text-slate-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <FileText className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                      <p className="text-slate-500 text-sm font-medium">
                        {temFiltroAtivo ? 'Nenhum exame encontrado com os filtros atuais.' : 'Nenhum exame lançado ainda.'}
                      </p>
                      {!temFiltroAtivo && (
                        <p className="text-slate-400 text-xs mt-1">
                          Clique em <strong>&quot;Lançar Exame / ASO&quot;</strong> para adicionar o primeiro registro.
                        </p>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
