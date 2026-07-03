'use client'

import { useState } from 'react'
import {
  Search,
  Download,
  FileText,
  Filter,
  Eye,
  CalendarDays,
  X,
  Upload,
  Building2,
  User,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

type Status = 'Apto' | 'Inapto' | 'Apto com Restrições' | 'Pendente'

type ExamRecord = {
  id: string
  colaborador: string
  cpf: string
  empresa: string
  funcao: string
  tipoExame: string
  dataExame: string
  dataVencimento: string
  status: Status
}

const MOCK_EXAMS: ExamRecord[] = [
  {
    id: '001',
    colaborador: 'Carlos Eduardo Silva',
    cpf: '123.456.789-00',
    empresa: 'Empresa Alpha Ltda',
    funcao: 'Analista de TI',
    tipoExame: 'Periódico',
    dataExame: '2025-03-15',
    dataVencimento: '2026-03-15',
    status: 'Apto',
  },
  {
    id: '002',
    colaborador: 'Maria Fernanda Santos',
    cpf: '987.654.321-00',
    empresa: 'Beta Indústrias S.A.',
    funcao: 'Coordenadora RH',
    tipoExame: 'Admissional',
    dataExame: '2025-05-10',
    dataVencimento: '2026-05-10',
    status: 'Apto',
  },
  {
    id: '003',
    colaborador: 'João Pedro Oliveira',
    cpf: '456.789.123-00',
    empresa: 'Beta Indústrias S.A.',
    funcao: 'Operador de Máquinas',
    tipoExame: 'Periódico',
    dataExame: '2025-01-20',
    dataVencimento: '2025-07-20',
    status: 'Apto com Restrições',
  },
  {
    id: '004',
    colaborador: 'Ana Beatriz Costa',
    cpf: '321.654.987-00',
    empresa: 'Empresa Alpha Ltda',
    funcao: 'Analista Financeira',
    tipoExame: 'Retorno ao Trabalho',
    dataExame: '2025-06-01',
    dataVencimento: '2026-06-01',
    status: 'Apto',
  },
  {
    id: '005',
    colaborador: 'Ricardo Martins',
    cpf: '654.321.789-00',
    empresa: 'Gama Comércio Eireli',
    funcao: 'Motorista',
    tipoExame: 'Periódico',
    dataExame: '2025-02-28',
    dataVencimento: '2025-02-28',
    status: 'Inapto',
  },
  {
    id: '006',
    colaborador: 'Camila Rodrigues',
    cpf: '789.123.456-00',
    empresa: 'Gama Comércio Eireli',
    funcao: 'Auxiliar de Serviços Gerais',
    tipoExame: 'Mudança de Função',
    dataExame: '2025-06-12',
    dataVencimento: '2026-06-12',
    status: 'Pendente',
  },
]

export default function AdminExamesPage() {
  const [busca, setBusca] = useState('')
  const [empresaFiltro, setEmpresaFiltro] = useState('')
  const [tipoFiltro, setTipoFiltro] = useState('')
  const [statusFiltro, setStatusFiltro] = useState('')

  // Limpa todos os filtros
  const limparFiltros = () => {
    setBusca('')
    setEmpresaFiltro('')
    setTipoFiltro('')
    setStatusFiltro('')
  }

  const examesFiltrados = MOCK_EXAMS.filter((exame) => {
    const atendeBusca =
      exame.colaborador.toLowerCase().includes(busca.toLowerCase()) ||
      exame.cpf.includes(busca) ||
      exame.funcao.toLowerCase().includes(busca.toLowerCase())
    
    const atendeEmpresa = empresaFiltro === '' || exame.empresa === empresaFiltro
    const atendeTipo = tipoFiltro === '' || exame.tipoExame === tipoFiltro
    const atendeStatus = statusFiltro === '' || exame.status === statusFiltro

    return atendeBusca && atendeEmpresa && atendeTipo && atendeStatus
  })

  // Cores de status
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

  // Verifica se exame está vencido
  const isVencido = (dataVencimento: string) => {
    const hoje = new Date()
    const venc = new Date(dataVencimento)
    return venc < hoje
  }

  // Lista de empresas exclusivas para o select filter
  const empresasDisponiveis = Array.from(new Set(MOCK_EXAMS.map(x => x.empresa)))

  const temFiltroAtivo = busca !== '' || empresaFiltro !== '' || tipoFiltro !== '' || statusFiltro !== ''

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Lançamentos de Exames e ASO</h1>
          <p className="text-sm text-slate-500 mt-1">Gerencie e publique os exames e atestados ocupacionais dos colaboradores</p>
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
            {/* Busca */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por colaborador ou CPF..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all bg-slate-50/50"
              />
            </div>

            {/* Filtro Empresa */}
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

            {/* Filtro Tipo */}
            <div>
              <select
                value={tipoFiltro}
                onChange={(e) => setTipoFiltro(e.target.value)}
                className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-lg bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all text-slate-600"
              >
                <option value="">Todos os Tipos de Exame</option>
                <option value="Admissional">Admissional</option>
                <option value="Periódico">Periódico</option>
                <option value="Demissional">Demissional</option>
                <option value="Mudança de Função">Mudança de Função</option>
                <option value="Retorno ao Trabalho">Retorno ao Trabalho</option>
              </select>
            </div>

            {/* Filtro Status */}
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

      {/* Tabela de Exames */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Colaborador</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Empresa</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tipo / Função</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Data Exame</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Vencimento</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {examesFiltrados.length > 0 ? (
                examesFiltrados.map((exame) => (
                  <tr key={exame.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-slate-800">{exame.colaborador}</div>
                      <div className="text-xs text-slate-400">{exame.cpf}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {exame.empresa}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      <div>{exame.tipoExame}</div>
                      <div className="text-xs text-slate-400">{exame.funcao}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {new Date(exame.dataExame).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={isVencido(exame.dataVencimento) ? 'text-red-600 font-semibold' : 'text-slate-600'}>
                        {new Date(exame.dataVencimento).toLocaleDateString('pt-BR')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(exame.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/exames/editar/${exame.id}`}>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500 text-sm">
                    Nenhum exame encontrado com os filtros atuais.
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
