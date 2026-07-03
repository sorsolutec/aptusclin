'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Building2, Plus, Search, X, Phone, Mail, MapPin,
  Users, Pencil, Trash2, Loader2, AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type Cliente = {
  id: string
  nome: string
  cnpj?: string
  email?: string
  telefone?: string
  responsavel?: string
  cidade?: string
  estado?: string
  unidade_id?: string
  ativo: boolean
  created_at: string
  colaboradores?: { count: number }[]
}

const UNIDADES = [
  { id: 'sorriso', label: 'Sorriso' },
  { id: 'nova-ubirata', label: 'Nova Ubiratã' },
  { id: 'boa-esperanca', label: 'Boa Esperança do Norte' },
  { id: 'nova-mutum', label: 'Nova Mutum' },
]

function formatCNPJ(cnpj: string) {
  const c = cnpj.replace(/\D/g, '')
  return c.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
}

export default function AdminClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [total, setTotal] = useState(0)
  const [busca, setBusca] = useState('')
  const [unidadeFiltro, setUnidadeFiltro] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  const carregar = useCallback(async () => {
    setCarregando(true)
    setErro('')
    try {
      const params = new URLSearchParams()
      if (busca) params.set('q', busca)
      if (unidadeFiltro) params.set('unidade', unidadeFiltro)
      const res = await fetch(`/api/clientes?${params}`)
      if (!res.ok) throw new Error('Erro ao carregar')
      const json = await res.json()
      setClientes(json.clientes || [])
      setTotal(json.total || 0)
    } catch {
      setErro('Não foi possível carregar os clientes. Verifique se as tabelas foram criadas no Supabase.')
      setClientes([])
    } finally {
      setCarregando(false)
    }
  }, [busca, unidadeFiltro])

  useEffect(() => {
    const timer = setTimeout(carregar, 300)
    return () => clearTimeout(timer)
  }, [carregar])

  async function handleExcluir(id: string, nome: string) {
    if (!confirm(`Deseja desativar o cliente "${nome}"?`)) return
    const res = await fetch(`/api/clientes/${id}`, { method: 'DELETE' })
    if (res.ok) carregar()
  }

  const unidadeLbl = (uid?: string) => UNIDADES.find(u => u.id === uid)?.label || uid || '—'
  const numColabs = (c: Cliente) => c.colaboradores?.[0]?.count ?? 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Clientes Cadastrados</h1>
          <p className="text-sm text-slate-500 mt-1">
            {total} empresa{total !== 1 ? 's' : ''} cadastrada{total !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/admin/clientes/novo">
          <Button className="bg-[#002855] hover:bg-[#001a3d] text-white font-semibold flex items-center gap-2 shadow-sm">
            <Plus className="w-4 h-4" /> Novo Cliente
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
                placeholder="Buscar por nome, CNPJ ou responsável..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all bg-slate-50/50"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={unidadeFiltro}
                onChange={e => setUnidadeFiltro(e.target.value)}
                className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-lg bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all text-slate-600"
              >
                <option value="">Todas as Unidades</option>
                {UNIDADES.map(u => (
                  <option key={u.id} value={u.id}>{u.label}</option>
                ))}
              </select>
              {(busca || unidadeFiltro) && (
                <Button
                  onClick={() => { setBusca(''); setUnidadeFiltro('') }}
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

      {/* Conteúdo */}
      {erro && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-amber-800 text-sm font-semibold">Banco de dados não configurado</p>
            <p className="text-amber-700 text-xs mt-1">{erro}</p>
            <p className="text-amber-600 text-xs mt-1">
              Execute as migrations SQL no painel do Supabase para ativar esta funcionalidade.
            </p>
          </div>
        </div>
      )}

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
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Empresa</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">CNPJ</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contato</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Unidade</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Colaboradores</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {clientes.length > 0 ? (
                  clientes.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-[#002855]/8 rounded-xl flex items-center justify-center shrink-0">
                            <Building2 className="w-4 h-4 text-[#002855]" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800 text-sm">{c.nome}</div>
                            {c.responsavel && (
                              <div className="text-xs text-slate-400 mt-0.5">{c.responsavel}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs text-slate-600">
                          {c.cnpj ? formatCNPJ(c.cnpj) : '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-0.5">
                          {c.telefone && (
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                              <Phone className="w-3 h-3" />{c.telefone}
                            </div>
                          )}
                          {c.email && (
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                              <Mail className="w-3 h-3" />{c.email}
                            </div>
                          )}
                          {c.cidade && (
                            <div className="flex items-center gap-1 text-xs text-slate-400">
                              <MapPin className="w-3 h-3" />{c.cidade}{c.estado ? ` – ${c.estado}` : ''}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {c.unidade_id ? (
                          <Badge className="bg-blue-50 text-blue-700 border-blue-100 shadow-none hover:bg-blue-50 text-xs">
                            {unidadeLbl(c.unidade_id)}
                          </Badge>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-slate-700 text-sm font-semibold">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          {numColabs(c)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link href={`/admin/clientes/${c.id}`}>
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
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <Building2 className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                      <p className="text-slate-500 text-sm font-medium">Nenhum cliente cadastrado</p>
                      <p className="text-slate-400 text-xs mt-1">
                        Clique em <strong>"Novo Cliente"</strong> para adicionar a primeira empresa.
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
