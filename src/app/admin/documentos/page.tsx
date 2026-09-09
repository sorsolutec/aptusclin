'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Search,
  Download,
  FileText,
  Building2,
  CalendarDays,
  X,
  Eye,
  Loader2,
  Upload,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

type Documento = {
  id: string
  colaborador: string
  cpf: string
  empresa: string
  tipo: string
  descricao: string
  dataPublicacao: string
  tamanho: string
}

export default function AdminDocumentosPage() {
  const [documentos, setDocumentos] = useState<Documento[]>([])
  const [empresas, setEmpresas] = useState<{ id: string; nome: string }[]>([])
  const [carregando, setCarregando] = useState(true)
  const [busca, setBusca] = useState('')
  const [tipoFiltro, setTipoFiltro] = useState('')
  const [empresaFiltro, setEmpresaFiltro] = useState('')

  const carregar = useCallback(async () => {
    setCarregando(true)
    try {
      // 1. Carrega empresas para os nomes
      const resEmp = await fetch('/api/admin/empresas')
      const empData = resEmp.ok ? await resEmp.json() : []
      setEmpresas(Array.isArray(empData) ? empData : [])
      const empMap = Object.fromEntries(
        (Array.isArray(empData) ? empData : []).map((e: any) => [e.id, e.nome])
      )

      // 2. Carrega exames para gerar a lista de documentos reais
      const params = new URLSearchParams()
      if (busca) params.set('q', busca)
      if (empresaFiltro) params.set('company_id', empresaFiltro)
      const resEx = await fetch(`/api/admin/exames?${params}`)
      if (resEx.ok) {
        const json = await resEx.json()
        const exames = json.exames || []
        const docs: Documento[] = exames.map((ex: any) => {
          const parts = (ex.title || '').split(' - ')
          const tipo = parts[0] || 'ASO'
          const colaborador = parts[1] || 'Colaborador'
          const desc = ex.description || ''
          const cpfMatch = desc.match(/CPF:\s*([^|]+)/)

          return {
            id: ex.id,
            colaborador,
            cpf: cpfMatch ? cpfMatch[1].trim() : '—',
            empresa: ex.company_id && empMap[ex.company_id] ? empMap[ex.company_id] : 'Geral',
            tipo: tipo.includes('ASO') ? 'ASO' : 'Laudo de Exame',
            descricao: `${tipo} - ${colaborador}`,
            dataPublicacao: ex.start_at || ex.created_at || new Date().toISOString(),
            tamanho: 'PDF Digital',
          }
        })
        setDocumentos(docs)
      } else {
        setDocumentos([])
      }
    } catch {
      setDocumentos([])
    } finally {
      setCarregando(false)
    }
  }, [busca, empresaFiltro])

  useEffect(() => {
    const timer = setTimeout(carregar, 300)
    return () => clearTimeout(timer)
  }, [carregar])

  const documentosFiltrados = documentos.filter((doc) => {
    if (tipoFiltro && doc.tipo !== tipoFiltro) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Documentos e ASOs</h1>
          <p className="text-sm text-slate-500 mt-1">
            Consulte os documentos, laudos e ASOs gerados a partir dos exames lançados
          </p>
        </div>
        <Link href="/admin/exames/novo">
          <Button className="bg-[#002855] hover:bg-[#001a3d] text-white font-semibold flex items-center gap-2 shadow-sm">
            <Upload className="w-4 h-4" /> Lançar Novo Exame / ASO
          </Button>
        </Link>
      </div>

      {/* Filtros */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por colaborador ou exame..."
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
                {empresas.map((emp) => (
                  <option key={emp.id} value={emp.id}>{emp.nome}</option>
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
      {carregando ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-[#002855]" />
          <p className="text-sm">Carregando documentos...</p>
        </div>
      ) : (
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Documento / Exame</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Colaborador</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Empresa</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {documentosFiltrados.length > 0 ? (
                  documentosFiltrados.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-slate-100 text-[#002855] rounded-lg">
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
                          <Link href={`/admin/exames/editar/${doc.id}`}>
                            <Button variant="ghost" size="sm" className="h-8 text-xs text-[#002855] font-semibold hover:bg-slate-100">
                              <Eye className="w-3.5 h-3.5 mr-1" /> Ver Exame
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-sm">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FileText className="w-8 h-8 text-slate-300" />
                        <p className="font-medium text-slate-600">Nenhum documento encontrado</p>
                        <p className="text-xs text-slate-400">
                          {busca ? 'Tente outros termos de busca.' : 'Os documentos aparecem automaticamente conforme exames são lançados.'}
                        </p>
                      </div>
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

