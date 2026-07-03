'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Search, Users, Building2, X, UserCheck, UserX,
  AlertCircle, Clock, Plus, Pencil, Trash2, Loader2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

type Colaborador = {
  id: string
  nome: string
  cpf: string
  cargo?: string
  status_aso: 'Apto' | 'Inapto' | 'Vencido' | 'Pendente'
  ativo: boolean
  empresas?: { id: string; nome: string } | null
}

function formatCPF(cpf: string) {
  const c = cpf.replace(/\D/g, '')
  return c.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')
}

function getStatusBadge(status: Colaborador['status_aso']) {
  switch (status) {
    case 'Apto':
      return (
        <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-none hover:bg-emerald-100 font-semibold gap-1">
          <UserCheck className="w-3.5 h-3.5" /> Apto
        </Badge>
      )
    case 'Inapto':
      return (
        <Badge className="bg-red-100 text-red-800 border border-red-200 shadow-none hover:bg-red-100 font-semibold gap-1">
          <UserX className="w-3.5 h-3.5" /> Inapto
        </Badge>
      )
    case 'Vencido':
      return (
        <Badge className="bg-amber-100 text-amber-800 border border-amber-200 shadow-none hover:bg-amber-100 font-semibold gap-1">
          <AlertCircle className="w-3.5 h-3.5" /> ASO Vencido
        </Badge>
      )
    default:
      return (
        <Badge className="bg-slate-100 text-slate-800 border border-slate-200 shadow-none hover:bg-slate-100 font-semibold gap-1">
          <Clock className="w-3.5 h-3.5" /> Sem ASO
        </Badge>
      )
  }
}

export default function AdminColaboradoresPage() {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([])
  const [total, setTotal] = useState(0)
  const [busca, setBusca] = useState('')
  const [statusFiltro, setStatusFiltro] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  const carregar = useCallback(async () => {
    setCarregando(true)
    setErro('')
    try {
      const params = new URLSearchParams()
      if (busca) params.set('q', busca)
      if (statusFiltro) params.set('status', statusFiltro)
      const res = await fetch(`/api/colaboradores?${params}`)
      if (!res.ok) throw new Error('Erro ao carregar')
      const json = await res.json()
      setColaboradores(json.colaboradores || [])
      setTotal(json.total || 0)
    } catch {
      setErro('Não foi possível carregar os colaboradores. Verifique se as tabelas foram criadas no Supabase.')
      setColaboradores([])
    } finally {
      setCarregando(false)
    }
  }, [busca, statusFiltro])

  useEffect(() => {
    const timer = setTimeout(carregar, 300)
    return () => clearTimeout(timer)
  }, [carregar])

  async function handleExcluir(id: string, nome: string) {
    if (!confirm(`Deseja desativar o colaborador "${nome}"?`)) return
    const res = await fetch(`/api/colaboradores/${id}`, { method: 'DELETE' })
    if (res.ok) carregar()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Colaboradores Cadastrados</h1>
          <p className="text-sm text-slate-500 mt-1">
            {total} colaborador{total !== 1 ? 'es' : ''} cadastrado{total !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/admin/colaboradores/novo">
          <Button className="bg-[#002855] hover:bg-[#001a3d] text-white font-semibold flex items-center gap-2 shadow-sm">
            <Plus className="w-4 h-4" /> Cadastrar Colaborador
          </Button>
        </Link>
      </div>

      {/* Filtros */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative sm:col-span-2">
              <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nome, CPF ou cargo..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all bg-slate-50/50"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFiltro}
                onChange={e => setStatusFiltro(e.target.value)}
                className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-lg bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all text-slate-600"
              >
                <option value="">Todos os Status</option>
                <option value="Apto">Apto</option>
                <option value="Inapto">Inapto</option>
                <option value="Vencido">ASO Vencido</option>
                <option value="Pendente">Sem ASO</option>
              </select>
              {(busca || statusFiltro) && (
                <Button
                  onClick={() => { setBusca(''); setStatusFiltro('') }}
                  variant="outline"
                  size="icon"
                  className="flex-shrink-0 border-slate-200 text-slate-500"
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
            <p className="text-amber-800 text-sm font-semibold">Banco de dados não configurado</p>
            <p className="text-amber-700 text-xs mt-1">{erro}</p>
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
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Empresa</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Cargo / Função</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status ASO</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {colaboradores.length > 0 ? (
                  colaboradores.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#002855]/8 rounded-full flex items-center justify-center shrink-0">
                            <Users className="w-4 h-4 text-[#002855]" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800 text-sm">{c.nome}</div>
                            <div className="text-xs text-slate-400 font-mono mt-0.5">
                              {c.cpf ? formatCPF(c.cpf) : '—'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-slate-700 text-sm">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          {c.empresas?.nome || '—'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-800 text-sm">{c.cargo || '—'}</span>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(c.status_aso)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link href={`/admin/colaboradores/${c.id}`}>
                            <Button variant="outline" size="sm" className="text-xs border-slate-200 gap-1">
                              <Pencil className="w-3 h-3" /> Editar
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExcluir(c.id, c.nome)}
                            className="text-xs border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <Users className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                      <p className="text-slate-500 text-sm font-medium">Nenhum colaborador cadastrado</p>
                      <p className="text-slate-400 text-xs mt-1">
                        Clique em <strong>&quot;Cadastrar Colaborador&quot;</strong> para adicionar o primeiro.
                      </p>
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
