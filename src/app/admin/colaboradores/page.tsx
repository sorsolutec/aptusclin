'use client'

import { useState } from 'react'
import {
  Search,
  Users,
  Building2,
  Filter,
  X,
  UserCheck,
  UserX,
  AlertCircle,
  Clock,
  Plus,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

type Colaborador = {
  id: string
  nome: string
  cpf: string
  empresa: string
  funcao: string
  statusASO: 'Apto' | 'Inapto' | 'Vencido' | 'Pendente'
}

const MOCK_COLABORADORES: Colaborador[] = [
  {
    id: '1',
    nome: 'Carlos Eduardo Silva',
    cpf: '123.456.789-00',
    empresa: 'Empresa Alpha Ltda',
    funcao: 'Analista de TI',
    statusASO: 'Apto',
  },
  {
    id: '2',
    nome: 'Maria Fernanda Santos',
    cpf: '987.654.321-00',
    empresa: 'Beta Indústrias S.A.',
    funcao: 'Coordenadora RH',
    statusASO: 'Apto',
  },
  {
    id: '3',
    nome: 'João Pedro Oliveira',
    cpf: '456.789.123-00',
    empresa: 'Beta Indústrias S.A.',
    funcao: 'Operador de Máquinas',
    statusASO: 'Apto',
  },
  {
    id: '4',
    nome: 'Ana Beatriz Costa',
    cpf: '321.654.987-00',
    empresa: 'Empresa Alpha Ltda',
    funcao: 'Analista Financeira',
    statusASO: 'Apto',
  },
  {
    id: '5',
    nome: 'Ricardo Martins',
    cpf: '654.321.789-00',
    empresa: 'Gama Comércio Eireli',
    funcao: 'Motorista',
    statusASO: 'Inapto',
  },
  {
    id: '6',
    nome: 'Camila Rodrigues',
    cpf: '789.123.456-00',
    empresa: 'Gama Comércio Eireli',
    funcao: 'Auxiliar de Serviços Gerais',
    statusASO: 'Pendente',
  },
  {
    id: '7',
    nome: 'Marcos Vinícius Souza',
    cpf: '159.753.486-11',
    empresa: 'Empresa Alpha Ltda',
    funcao: 'Técnico de Suporte',
    statusASO: 'Vencido',
  },
]

export default function AdminColaboradoresPage() {
  const [busca, setBusca] = useState('')
  const [empresaFiltro, setEmpresaFiltro] = useState('')
  const [statusFiltro, setStatusFiltro] = useState('')

  const colaboradoresFiltrados = MOCK_COLABORADORES.filter((colab) => {
    const atendeBusca =
      colab.nome.toLowerCase().includes(busca.toLowerCase()) ||
      colab.cpf.includes(busca) ||
      colab.funcao.toLowerCase().includes(busca.toLowerCase())
    
    const atendeEmpresa = empresaFiltro === '' || colab.empresa === empresaFiltro
    const atendeStatus = statusFiltro === '' || colab.statusASO === statusFiltro

    return atendeBusca && atendeEmpresa && atendeStatus
  })

  const getStatusBadge = (status: Colaborador['statusASO']) => {
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
      case 'Pendente':
        return (
          <Badge className="bg-slate-100 text-slate-800 border border-slate-200 shadow-none hover:bg-slate-100 font-semibold gap-1">
            <Clock className="w-3.5 h-3.5" /> Sem ASO
          </Badge>
        )
    }
  }

  const empresasDisponiveis = Array.from(new Set(MOCK_COLABORADORES.map(x => x.empresa)))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Colaboradores Cadastrados</h1>
          <p className="text-sm text-slate-500 mt-1">Gerencie a lista unificada de funcionários de todas as empresas</p>
        </div>
        <Button className="bg-[#002855] hover:bg-[#001a3d] text-white font-semibold flex items-center gap-2 shadow-sm">
          <Plus className="w-4 h-4" /> Cadastrar Colaborador
        </Button>
      </div>

      {/* Filtros */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por colaborador, CPF ou cargo..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all bg-slate-50/50"
              />
            </div>
            <div>
              <select
                value={empresaFiltro}
                onChange={(e) => setEmpresaFiltro(e.target.value)}
                className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-lg bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all text-slate-600"
              >
                <option value="">Todas as Empresas</option>
                {empresasDisponiveis.map((emp) => (
                  <option key={emp} value={emp}>{emp}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFiltro}
                onChange={(e) => setStatusFiltro(e.target.value)}
                className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-lg bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all text-slate-600"
              >
                <option value="">Todos os Status de ASO</option>
                <option value="Apto">Apto</option>
                <option value="Inapto">Inapto</option>
                <option value="Vencido">ASO Vencido</option>
                <option value="Pendente">Sem ASO</option>
              </select>

              {(busca !== '' || empresaFiltro !== '' || statusFiltro !== '') && (
                <Button
                  onClick={() => { setBusca(''); setEmpresaFiltro(''); setStatusFiltro('') }}
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

      {/* Tabela de Colaboradores */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Colaborador</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Empresa</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Cargo / Função</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status do ASO</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {colaboradoresFiltrados.length > 0 ? (
                colaboradoresFiltrados.map((colab) => (
                  <tr key={colab.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800 text-sm">{colab.nome}</div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">{colab.cpf}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-700 text-sm font-medium">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {colab.empresa}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-800 text-sm font-medium">{colab.funcao}</div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(colab.statusASO)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button variant="outline" size="sm" className="text-xs border-slate-200">
                          Editar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-sm">
                    Nenhum colaborador encontrado com os filtros atuais.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
