'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Search,
  Plus,
  X,
  Building2,
  Loader2,
  Mail,
  Phone,
  Calendar,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

type Empresa = {
  id: string
  nome: string
  cnpj?: string
  email?: string
  telefone?: string
  created_at?: string
}

function formatarCNPJ(v?: string) {
  if (!v) return '—'
  const c = v.replace(/\D/g, '')
  if (c.length === 14) {
    return c.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
  }
  return v
}

export default function AdminEmpresasPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [total, setTotal] = useState(0)
  const [busca, setBusca] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  const carregar = useCallback(async () => {
    setCarregando(true)
    setErro('')
    try {
      const params = new URLSearchParams()
      if (busca) params.set('q', busca)
      const res = await fetch(`/api/clientes?${params}`)
      if (!res.ok) throw new Error('Falha ao carregar empresas.')
      const json = await res.json()
      setEmpresas(json.clientes || [])
      setTotal(json.total || 0)
    } catch {
      setErro('Erro ao carregar as empresas parceiras.')
      setEmpresas([])
    } finally {
      setCarregando(false)
    }
  }, [busca])

  useEffect(() => {
    const timer = setTimeout(carregar, 300)
    return () => clearTimeout(timer)
  }, [carregar])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Empresas Parceiras</h1>
          <p className="text-sm text-slate-500 mt-1">
            {total} empresa{total !== 1 ? 's' : ''} cadastrada{total !== 1 ? 's' : ''} no sistema
          </p>
        </div>
        <Link href="/admin/empresas/nova">
          <Button className="bg-[#002855] hover:bg-[#001a3d] text-white font-semibold flex items-center gap-2 shadow-sm">
            <Plus className="w-4 h-4" /> Cadastrar Empresa
          </Button>
        </Link>
      </div>

      {/* Filtros */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nome, CNPJ ou e-mail..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all bg-slate-50/50"
              />
            </div>
            {busca && (
              <Button
                onClick={() => setBusca('')}
                variant="outline"
                size="sm"
                className="flex-shrink-0 border-slate-200 text-slate-500"
              >
                <X className="w-4 h-4 mr-1" /> Limpar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabela ou Estados */}
      {carregando ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-[#002855]" />
          <p className="text-sm">Carregando empresas...</p>
        </div>
      ) : erro ? (
        <div className="p-6 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{erro}</p>
        </div>
      ) : empresas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center bg-white rounded-xl border border-slate-200">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-700">Nenhuma empresa encontrada</h3>
          <p className="text-sm text-slate-400 max-w-sm">
            {busca ? 'Nenhum resultado para os termos pesquisados.' : 'Comece cadastrando a primeira empresa parceira.'}
          </p>
          {!busca && (
            <Link href="/admin/empresas/nova">
              <Button className="bg-[#002855] hover:bg-[#001a3d] text-white mt-2">
                <Plus className="w-4 h-4 mr-1.5" /> Cadastrar Empresa
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {empresas.map((emp) => (
              <div key={emp.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-[#002855]/10 text-[#002855] flex items-center justify-center flex-shrink-0 font-bold text-sm">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{emp.nome}</h4>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-500">
                      <span className="font-mono">{formatarCNPJ(emp.cnpj)}</span>
                      {emp.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-slate-400" /> {emp.email}
                        </span>
                      )}
                      {emp.telefone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" /> {emp.telefone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] shadow-none">
                    Ativa
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

