'use client'

import { useState } from 'react'
import {
  Search,
  Download,
  FileText,
  Building2,
  CalendarDays,
  X,
  Eye,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

type Documento = {
  id: string
  colaborador: string
  cpf: string
  empresa: string
  tipo: 'ASO' | 'Laudo de Exame' | 'Ficha Clínica'
  descricao: string
  dataPublicacao: string
  tamanho: string
}

const MOCK_DOCUMENTOS: Documento[] = [
  {
    id: 'DOC001',
    colaborador: 'Carlos Eduardo Silva',
    cpf: '123.456.789-00',
    empresa: 'Empresa Alpha Ltda',
    tipo: 'ASO',
    descricao: 'Atestado de Saúde Ocupacional - Periódico',
    dataPublicacao: '2025-03-15',
    tamanho: '142 KB',
  },
  {
    id: 'DOC002',
    colaborador: 'Maria Fernanda Santos',
    cpf: '987.654.321-00',
    empresa: 'Beta Indústrias S.A.',
    tipo: 'ASO',
    descricao: 'Atestado de Saúde Ocupacional - Admissional',
    dataPublicacao: '2025-05-10',
    tamanho: '138 KB',
  },
  {
    id: 'DOC003',
    colaborador: 'João Pedro Oliveira',
    cpf: '456.789.123-00',
    empresa: 'Beta Indústrias S.A.',
    tipo: 'Laudo de Exame',
    descricao: 'Audiometria Tonal e Vocal',
    dataPublicacao: '2025-01-20',
    tamanho: '412 KB',
  },
  {
    id: 'DOC004',
    colaborador: 'Ana Beatriz Costa',
    cpf: '321.654.987-00',
    empresa: 'Empresa Alpha Ltda',
    tipo: 'ASO',
    descricao: 'Atestado de Saúde Ocupacional - Retorno ao Trabalho',
    dataPublicacao: '2025-06-01',
    tamanho: '145 KB',
  },
  {
    id: 'DOC005',
    colaborador: 'Ricardo Martins',
    cpf: '654.321.789-00',
    empresa: 'Gama Comércio Eireli',
    tipo: 'Laudo de Exame',
    descricao: 'Eletrocardiograma (ECG)',
    dataPublicacao: '2025-02-28',
    tamanho: '320 KB',
  },
  {
    id: 'DOC006',
    colaborador: 'Carlos Eduardo Silva',
    cpf: '123.456.789-00',
    empresa: 'Empresa Alpha Ltda',
    tipo: 'Laudo de Exame',
    descricao: 'Hemograma Completo',
    dataPublicacao: '2025-03-15',
    tamanho: '215 KB',
  },
]

export default function AdminDocumentosPage() {
  const [busca, setBusca] = useState('')
  const [tipoFiltro, setTipoFiltro] = useState('')
  const [empresaFiltro, setEmpresaFiltro] = useState('')

  const documentosFiltrados = MOCK_DOCUMENTOS.filter((doc) => {
    const atendeBusca =
      doc.colaborador.toLowerCase().includes(busca.toLowerCase()) ||
      doc.cpf.includes(busca) ||
      doc.descricao.toLowerCase().includes(busca.toLowerCase())
    
    const atendeTipo = tipoFiltro === '' || doc.tipo === tipoFiltro
    const atendeEmpresa = empresaFiltro === '' || doc.empresa === empresaFiltro

    return atendeBusca && atendeTipo && atendeEmpresa
  })

  const empresasDisponiveis = Array.from(new Set(MOCK_DOCUMENTOS.map(x => x.empresa)))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Todos os Documentos Públicos</h1>
        <p className="text-sm text-slate-500 mt-1">Busque e gerencie todos os PDFs de exames, laudos e ASOs lançados</p>
      </div>

      {/* Filtros */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por colaborador, CPF ou descrição..."
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
                value={tipoFiltro}
                onChange={(e) => setTipoFiltro(e.target.value)}
                className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-lg bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all text-slate-600"
              >
                <option value="">Todos os Tipos de Documento</option>
                <option value="ASO">ASO</option>
                <option value="Laudo de Exame">Laudo de Exame</option>
                <option value="Ficha Clínica">Ficha Clínica</option>
              </select>

              {(busca !== '' || empresaFiltro !== '' || tipoFiltro !== '') && (
                <Button
                  onClick={() => { setBusca(''); setEmpresaFiltro(''); setTipoFiltro('') }}
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

      {/* Lista de Documentos */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Documento / Código</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Colaborador</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Empresa</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Publicação</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {documentosFiltrados.length > 0 ? (
                documentosFiltrados.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800 text-sm">{doc.descricao}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] bg-slate-200/60 text-slate-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                              {doc.tipo}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">{doc.tamanho}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800 text-sm">{doc.colaborador}</div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">{doc.cpf}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-700 text-sm font-medium">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {doc.empresa}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-600 text-sm font-medium flex items-center gap-1">
                        <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(doc.dataPublicacao).toLocaleDateString('pt-BR')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-800" title="Visualizar Documento">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-800" title="Download PDF">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-sm">
                    Nenhum documento encontrado com os filtros atuais.
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
