'use client'

import { useState } from 'react'
import {
  Search,
  Building2,
  Users,
  FileText,
  Plus,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
  X,
  ExternalLink,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

type Empresa = {
  id: string
  nome: string
  cnpj: string
  email: string
  telefone: string
  colaboradores: number
  exames: number
  status: 'Ativa' | 'Inativa'
}

const MOCK_EMPRESAS: Empresa[] = [
  {
    id: '1',
    nome: 'Empresa Alpha Ltda',
    cnpj: '12.345.678/0001-99',
    email: 'rh@alpha.com.br',
    telefone: '(11) 98765-4321',
    colaboradores: 42,
    exames: 120,
    status: 'Ativa',
  },
  {
    id: '2',
    nome: 'Beta Indústrias S.A.',
    cnpj: '98.765.432/0001-00',
    email: 'contato@betaindustrias.com',
    telefone: '(11) 4004-8900',
    colaboradores: 115,
    exames: 340,
    status: 'Ativa',
  },
  {
    id: '3',
    nome: 'Gama Comércio Eireli',
    cnpj: '45.678.901/0001-22',
    email: 'departamento.pessoal@gama.com.br',
    telefone: '(21) 3344-5566',
    colaboradores: 18,
    exames: 45,
    status: 'Ativa',
  },
  {
    id: '4',
    nome: 'Delta Serviços Terceirizados',
    cnpj: '33.222.111/0001-88',
    email: 'suporte@deltaserv.com.br',
    telefone: '(31) 99888-7766',
    colaboradores: 0,
    exames: 0,
    status: 'Inativa',
  },
]

export default function AdminEmpresasPage() {
  const [busca, setBusca] = useState('')
  const [statusFiltro, setStatusFiltro] = useState('')

  const empresasFiltradas = MOCK_EMPRESAS.filter((empresa) => {
    const atendeBusca =
      empresa.nome.toLowerCase().includes(busca.toLowerCase()) ||
      empresa.cnpj.includes(busca) ||
      empresa.email.toLowerCase().includes(busca.toLowerCase())
    
    const atendeStatus = statusFiltro === '' || empresa.status === statusFiltro

    return atendeBusca && atendeStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Empresas Clientes</h1>
          <p className="text-sm text-slate-500 mt-1">Gerencie as empresas parceiras integradas ao Portal do Cliente</p>
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
                placeholder="Buscar por nome, CNPJ ou e-mail corporativo..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all bg-slate-50/50"
              />
            </div>
            <div className="w-full sm:w-48 flex gap-2">
              <select
                value={statusFiltro}
                onChange={(e) => setStatusFiltro(e.target.value)}
                className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-lg bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all text-slate-600"
              >
                <option value="">Todos os Status</option>
                <option value="Ativa">Ativa</option>
                <option value="Inativa">Inativa</option>
              </select>

              {(busca !== '' || statusFiltro !== '') && (
                <Button
                  onClick={() => { setBusca(''); setStatusFiltro('') }}
                  variant="outline"
                  size="icon"
                  className="flex-shrink-0 border-slate-200 text-slate-500 hover:text-slate-800"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
