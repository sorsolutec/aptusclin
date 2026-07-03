'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Building2, ArrowLeft, Save, Loader2, CheckCircle2, AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const UNIDADES = [
  { id: 'sorriso', label: 'Sorriso – MT' },
  { id: 'nova-ubirata', label: 'Nova Ubiratã – MT' },
  { id: 'boa-esperanca', label: 'Boa Esperança do Norte – MT' },
  { id: 'nova-mutum', label: 'Nova Mutum – MT' },
]

const ESTADOS = ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO']

export default function NovoClientePage() {
  const router = useRouter()
  const [salvando, setSalvando] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [erro, setErro] = useState('')

  const [form, setForm] = useState({
    nome: '',
    cnpj: '',
    email: '',
    telefone: '',
    responsavel: '',
    endereco: '',
    cidade: '',
    estado: '',
    unidade_id: '',
  })

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
    setErro('')
  }

  function formatarCNPJ(v: string) {
    const d = v.replace(/\D/g, '').slice(0, 14)
    return d
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nome.trim()) {
      setErro('O nome da empresa é obrigatório.')
      return
    }

    setSalvando(true)
    setErro('')

    try {
      const res = await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setErro(data.error || 'Erro ao salvar cliente.')
        return
      }

      setSucesso(true)
      setTimeout(() => router.push('/admin/clientes'), 1500)
    } catch {
      setErro('Erro de conexão. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/clientes">
          <Button variant="outline" size="icon" className="border-slate-200 text-slate-500">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Novo Cliente</h1>
          <p className="text-sm text-slate-500 mt-0.5">Cadastre uma nova empresa cliente</p>
        </div>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dados Principais */}
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-[#002855]" />
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Dados da Empresa</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Razão Social / Nome <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.nome}
                  onChange={e => set('nome', e.target.value)}
                  placeholder="Ex.: Empresa Exemplo Ltda"
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">CNPJ</label>
                <input
                  type="text"
                  value={form.cnpj}
                  onChange={e => set('cnpj', formatarCNPJ(e.target.value))}
                  placeholder="00.000.000/0000-00"
                  maxLength={18}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Responsável / Contato RH</label>
                <input
                  type="text"
                  value={form.responsavel}
                  onChange={e => set('responsavel', e.target.value)}
                  placeholder="Nome do responsável"
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Telefone</label>
                <input
                  type="tel"
                  value={form.telefone}
                  onChange={e => set('telefone', e.target.value)}
                  placeholder="(66) 99999-0000"
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">E-mail Corporativo</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  placeholder="rh@empresa.com.br"
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Endereço e Unidade */}
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">Localização e Atendimento</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Cidade</label>
                <input
                  type="text"
                  value={form.cidade}
                  onChange={e => set('cidade', e.target.value)}
                  placeholder="Sorriso"
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Estado</label>
                <select
                  value={form.estado}
                  onChange={e => set('estado', e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all text-slate-600"
                >
                  <option value="">UF</option>
                  {ESTADOS.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Endereço Completo</label>
                <input
                  type="text"
                  value={form.endereco}
                  onChange={e => set('endereco', e.target.value)}
                  placeholder="Rua, número, bairro"
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Unidade Aptusclin Responsável</label>
                <select
                  value={form.unidade_id}
                  onChange={e => set('unidade_id', e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all text-slate-600"
                >
                  <option value="">Selecione a unidade...</option>
                  {UNIDADES.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Erro */}
        {erro && (
          <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <p className="text-red-700 text-sm">{erro}</p>
          </div>
        )}

        {/* Sucesso */}
        {sucesso && (
          <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <p className="text-emerald-700 text-sm font-semibold">Cliente cadastrado com sucesso! Redirecionando...</p>
          </div>
        )}

        {/* Botões */}
        <div className="flex items-center gap-3 justify-end">
          <Link href="/admin/clientes">
            <Button type="button" variant="outline" className="border-slate-200 text-slate-600">
              Cancelar
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={salvando || sucesso}
            className="bg-[#002855] hover:bg-[#001a3d] text-white font-semibold gap-2"
          >
            {salvando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {salvando ? 'Salvando...' : 'Salvar Cliente'}
          </Button>
        </div>
      </form>
    </div>
  )
}
