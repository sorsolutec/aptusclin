'use client'

import { useState, useEffect, use } from 'react'
import {
  Save,
  User,
  Building2,
  FileText,
  CalendarDays,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  Loader2,
  Stethoscope,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Status = 'Apto' | 'Inapto' | 'Apto com Restrições' | 'Pendente'

const TIPOS_EXAME = [
  'Admissional',
  'Periódico',
  'Demissional',
  'Mudança de Função',
  'Retorno ao Trabalho',
  'Avaliação Clínica Complementar',
]

type EmpresaOpt = { id: string; nome: string }

const STATUS_OPTIONS: Status[] = ['Apto', 'Inapto', 'Apto com Restrições', 'Pendente']

export default function EditarExamePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()

  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [status, setStatus] = useState<Status>('Apto')
  const [empresas, setEmpresas] = useState<EmpresaOpt[]>([])
  const [dbError, setDbError] = useState('')

  const [form, setForm] = useState({
    empresa: '',
    colaborador: '',
    cpf: '',
    funcao: '',
    tipoExame: 'Admissional',
    dataExame: '',
    dataVencimento: '',
    medico: '',
    crm: '',
    observacoes: '',
  })

  useEffect(() => {
    // 1. Carrega empresas reais
    fetch('/api/admin/empresas')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) {
          setEmpresas(data)
        }
      })
      .catch(() => setEmpresas([]))

    // 2. Carrega exame real
    fetch(`/api/admin/exames/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          const parts = (data.title || '').split(' - ')
          const tipo = parts[0] || 'Admissional'
          const colab = parts[1] || ''

          // Extrai campos da description se formatada
          const desc = data.description || ''
          const cpfMatch = desc.match(/CPF:\s*([^|]+)/)
          const funcMatch = desc.match(/Função:\s*([^|]+)/)
          const medMatch = desc.match(/Médico:\s*([^|(]+)/)
          const crmMatch = desc.match(/\(([^)]+)\)/)
          const obsMatch = desc.match(/Obs:\s*(.+)$/)

          setForm({
            empresa: data.company_id || '',
            colaborador: colab || '',
            cpf: cpfMatch ? cpfMatch[1].trim() : '',
            funcao: funcMatch ? funcMatch[1].trim() : '',
            tipoExame: tipo,
            dataExame: data.start_at ? data.start_at.split('T')[0] : '',
            dataVencimento: data.end_at ? data.end_at.split('T')[0] : '',
            medico: medMatch ? medMatch[1].trim() : '',
            crm: crmMatch ? crmMatch[1].trim() : '',
            observacoes: obsMatch ? obsMatch[1].trim() : desc,
          })
          if (data.location && STATUS_OPTIONS.includes(data.location as Status)) {
            setStatus(data.location as Status)
          }
        } else {
          setDbError('Exame não encontrado ou inexistente.')
        }
        setCarregando(false)
      })
      .catch(() => {
        setDbError('Erro ao buscar dados do exame.')
        setCarregando(false)
      })
  }, [id])


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSalvando(true)
    setDbError('')

    const isUUID = (val: string) =>
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val)
    const companyId = isUUID(form.empresa) ? form.empresa : null

    const start_at = form.dataExame
      ? new Date(form.dataExame).toISOString()
      : new Date().toISOString()
    const end_at = form.dataVencimento
      ? new Date(form.dataVencimento).toISOString()
      : start_at

    const payload = {
      title: `${form.tipoExame} - ${form.colaborador}`,
      description: `CPF: ${form.cpf} | Função: ${form.funcao} | Médico: ${form.medico} (${form.crm}) | Obs: ${form.observacoes}`,
      start_at,
      end_at,
      location: status,
      company_id: companyId,
    }

    try {
      if (isUUID(id)) {
        const res = await fetch(`/api/admin/exames/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || 'Erro ao atualizar exame.')
        }
      }

      setSalvando(false)
      setSucesso(true)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao salvar alterações.'
      setDbError(message)
      setSalvando(false)
    }
  }

  if (carregando) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#002855]" />
      </div>
    )
  }

  if (sucesso) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-5">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Exame atualizado com sucesso!</h2>
        <p className="text-slate-500 mt-2 mb-8">
          As alterações no ASO de <strong>{form.colaborador}</strong> foram salvas.
        </p>
        <div className="flex gap-3">
          <Link href="/admin/exames">
            <Button className="bg-[#002855] hover:bg-[#001a3d] text-white">
              Voltar para Lista de Exames
            </Button>
          </Link>
          <Button variant="outline" onClick={() => setSucesso(false)}>
            Continuar Editando
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/exames" className="text-slate-400 hover:text-slate-700 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Editar Exame / ASO</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Atualize as informações do atestado ocupacional #{id}
          </p>
        </div>
      </div>

      {dbError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{dbError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Empresa */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-600 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#002855]" />
              Empresa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <select
              name="empresa"
              value={form.empresa}
              onChange={handleChange}
              required
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all"
            >
              <option value="">Selecione a empresa...</option>
              {empresas.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.nome}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>

        {/* Colaborador */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-600 flex items-center gap-2">
              <User className="w-4 h-4 text-[#002855]" />
              Dados do Colaborador
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Nome completo *
                </label>
                <input
                  type="text"
                  name="colaborador"
                  value={form.colaborador}
                  onChange={handleChange}
                  placeholder="Ex.: João da Silva"
                  required
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  CPF *
                </label>
                <input
                  type="text"
                  name="cpf"
                  value={form.cpf}
                  onChange={handleChange}
                  placeholder="000.000.000-00"
                  required
                  maxLength={14}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all font-mono"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Cargo / Função *
              </label>
              <input
                type="text"
                name="funcao"
                value={form.funcao}
                onChange={handleChange}
                placeholder="Ex.: Motorista de Caminhão"
                required
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all"
              />
            </div>
          </CardContent>
        </Card>

        {/* Exame e Prazos */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-600 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-[#002855]" />
              Dados do Exame e Prazos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Tipo de Exame *
                </label>
                <select
                  name="tipoExame"
                  value={form.tipoExame}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all"
                >
                  {TIPOS_EXAME.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Data de Realização *
                </label>
                <input
                  type="date"
                  name="dataExame"
                  value={form.dataExame}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Data de Vencimento
                </label>
                <input
                  type="date"
                  name="dataVencimento"
                  value={form.dataVencimento}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all"
                />
              </div>
            </div>

            {/* Status / Parecer */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Parecer Clínico (Status) *
              </label>
              <div className="grid grid-cols-4 gap-2">
                {STATUS_OPTIONS.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatus(st)}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                      status === st
                        ? 'border-[#002855] bg-[#002855] text-white shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Médico e Observações */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-600 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-[#002855]" />
              Médico Responsável e Parecer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Nome do Médico
                </label>
                <input
                  type="text"
                  name="medico"
                  value={form.medico}
                  onChange={handleChange}
                  placeholder="Ex.: Dra. Juliana Mendes"
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  CRM / UF
                </label>
                <input
                  type="text"
                  name="crm"
                  value={form.crm}
                  onChange={handleChange}
                  placeholder="Ex.: CRM/MT 12345"
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Observações Clínicas
              </label>
              <textarea
                name="observacoes"
                value={form.observacoes}
                onChange={handleChange}
                rows={3}
                placeholder="Descreva observações, restrições ou encaminhamentos..."
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Botões */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link href="/admin/exames">
            <Button type="button" variant="outline" className="border-slate-200">
              Cancelar
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={salvando}
            className="bg-[#002855] hover:bg-[#001a3d] text-white gap-2 px-6"
          >
            {salvando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {salvando ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </form>
    </div>
  )
}
