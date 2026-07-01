'use client'

import { useState } from 'react'
import {
  Upload,
  User,
  Building2,
  FileText,
  CalendarDays,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  Loader2,
  Paperclip,
} from 'lucide-react'
import Link from 'next/link'
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

const STATUS_OPTIONS: Status[] = ['Apto', 'Inapto', 'Apto com Restrições', 'Pendente']

const statusColors: Record<Status, string> = {
  Apto: 'border-emerald-400 bg-emerald-50 text-emerald-700',
  Inapto: 'border-red-400 bg-red-50 text-red-700',
  'Apto com Restrições': 'border-amber-400 bg-amber-50 text-amber-700',
  Pendente: 'border-slate-300 bg-slate-50 text-slate-600',
}

export default function NovoExamePage() {
  const [salvando, setSalvando] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [arquivo, setArquivo] = useState<File | null>(null)
  const [status, setStatus] = useState<Status>('Apto')

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSalvando(true)

    // TODO: Integrar com Supabase — insert na tabela exames + upload do PDF no Storage
    await new Promise((r) => setTimeout(r, 1500))

    setSalvando(false)
    setSucesso(true)
  }

  if (sucesso) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-5">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Exame lançado com sucesso!</h2>
        <p className="text-slate-500 mt-2 mb-8">
          O ASO de <strong>{form.colaborador}</strong> foi registrado no sistema.
        </p>
        <div className="flex gap-3">
          <Button
            onClick={() => { setSucesso(false); setForm({ empresa: '', colaborador: '', cpf: '', funcao: '', tipoExame: 'Admissional', dataExame: '', dataVencimento: '', medico: '', crm: '', observacoes: '' }); setArquivo(null); setStatus('Apto') }}
            className="bg-[#002855] hover:bg-[#001a3d] text-white gap-2"
          >
            <Upload className="w-4 h-4" /> Lançar outro exame
          </Button>
          <Link href="/admin/documentos">
            <Button variant="outline" className="border-slate-200">Ver todos os exames</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin" className="text-slate-400 hover:text-slate-700 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Lançar Exame / ASO</h1>
          <p className="text-sm text-slate-500 mt-0.5">Preencha os dados do atestado de saúde ocupacional</p>
        </div>
      </div>

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
              <option value="empresa1">Empresa Alpha Ltda</option>
              <option value="empresa2">Beta Indústrias S.A.</option>
              <option value="empresa3">Gama Comércio Eireli</option>
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
                placeholder="Ex.: Analista de TI"
                required
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all"
              />
            </div>
          </CardContent>
        </Card>

        {/* Exame */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-600 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#002855]" />
              Dados do Exame
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
                  {TIPOS_EXAME.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Status / Resultado *
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Status)}
                  required
                  className={`w-full px-3 py-2.5 text-sm border-2 rounded-lg focus:outline-none transition-all font-semibold ${statusColors[status]}`}
                >
                  {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                  <CalendarDays className="w-3 h-3" /> Data do Exame *
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
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                  <CalendarDays className="w-3 h-3" /> Data de Vencimento
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Médico Responsável
                </label>
                <input
                  type="text"
                  name="medico"
                  value={form.medico}
                  onChange={handleChange}
                  placeholder="Dr. Nome Sobrenome"
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  CRM
                </label>
                <input
                  type="text"
                  name="crm"
                  value={form.crm}
                  onChange={handleChange}
                  placeholder="CRM/SP 000000"
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Observações / Restrições
              </label>
              <textarea
                name="observacoes"
                value={form.observacoes}
                onChange={handleChange}
                rows={3}
                placeholder="Descreva eventuais restrições ou observações clínicas..."
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Upload PDF */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-600 flex items-center gap-2">
              <Paperclip className="w-4 h-4 text-[#002855]" />
              Documento PDF (ASO / Laudo)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <label
              htmlFor="arquivo"
              className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                arquivo
                  ? 'border-emerald-400 bg-emerald-50'
                  : 'border-slate-300 bg-slate-50 hover:border-[#002855] hover:bg-blue-50/30'
              }`}
            >
              {arquivo ? (
                <>
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
                  <p className="text-sm font-semibold text-emerald-700">{arquivo.name}</p>
                  <p className="text-xs text-emerald-500 mt-0.5">{(arquivo.size / 1024).toFixed(0)} KB</p>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-slate-400 mb-2" />
                  <p className="text-sm font-semibold text-slate-600">Clique para fazer upload do PDF</p>
                  <p className="text-xs text-slate-400 mt-0.5">ou arraste e solte aqui · Somente PDF · Máx. 10 MB</p>
                </>
              )}
              <input
                id="arquivo"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => setArquivo(e.target.files?.[0] ?? null)}
              />
            </label>
          </CardContent>
        </Card>

        {/* Aviso */}
        {status === 'Inapto' && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">
              <strong>Atenção:</strong> Colaborador classificado como <strong>Inapto</strong>. O afastamento deve ser comunicado ao RH da empresa imediatamente conforme NR-7.
            </p>
          </div>
        )}

        {/* Ações */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            type="submit"
            disabled={salvando}
            className="bg-[#002855] hover:bg-[#001a3d] text-white font-bold px-8 py-5 rounded-lg gap-2 shadow-md"
          >
            {salvando ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Salvando...</>
            ) : (
              <><CheckCircle2 className="w-4 h-4" /> Salvar e publicar exame</>
            )}
          </Button>
          <Link href="/admin">
            <Button variant="ghost" type="button" className="text-slate-500">
              Cancelar
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
