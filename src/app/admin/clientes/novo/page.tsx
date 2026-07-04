'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Building2, User, ArrowLeft, Save, Loader2, CheckCircle2,
  AlertCircle, Copy, Eye, EyeOff, Key, RefreshCw,
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

type Credenciais = { codigo: string; senha: string; email: string }

function formatarCNPJ(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 14)
  return d
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
}

function formatarCPF(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 11)
  return d
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2')
}

export default function NovoClientePage() {
  const router = useRouter()
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const [credenciais, setCredenciais] = useState<Credenciais | null>(null)
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [tipo, setTipo] = useState<'PJ' | 'PF'>('PJ')

  const [form, setForm] = useState({
    nome: '',
    cnpj: '',
    cpf: '',
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nome.trim()) { setErro('O nome é obrigatório.'); return }
    if (tipo === 'PJ' && !form.cnpj) { setErro('CNPJ é obrigatório para Pessoa Jurídica.'); return }
    if (tipo === 'PF' && !form.cpf) { setErro('CPF é obrigatório para Pessoa Física.'); return }
    if (tipo === 'PF' && !form.email.trim()) { setErro('E-mail é obrigatório para Pessoa Física (usado como login).'); return }

    setSalvando(true)
    setErro('')

    try {
      const res = await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, tipo }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErro(data.error || 'Erro ao salvar cliente.')
        return
      }

      if (tipo === 'PF' && data.credenciais) {
        setCredenciais(data.credenciais)
      } else {
        router.push('/admin/clientes')
      }
    } catch {
      setErro('Erro de conexão. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  function copiar(texto: string) {
    navigator.clipboard.writeText(texto)
  }

  // ── Tela de credenciais PF ──────────────────────────────────────────────────
  if (credenciais) {
    return (
      <div className="max-w-lg mx-auto space-y-6 pt-4">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Cliente Cadastrado!</h1>
          <p className="text-sm text-slate-500">Guarde ou imprima as credenciais de acesso abaixo.</p>
        </div>

        <Card className="border-slate-200 shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-[#002855] to-blue-800 px-6 py-4">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-white/70" />
              <span className="text-white font-bold text-sm">Credenciais de Acesso</span>
            </div>
            <p className="text-white/60 text-xs mt-1">O cliente deve trocar a senha no primeiro acesso.</p>
          </div>
          <CardContent className="p-6 space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">E-mail / Login</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-mono text-slate-800">{credenciais.email}</code>
                <button onClick={() => copiar(credenciais.email)} className="p-2 text-slate-400 hover:text-[#002855] transition">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">Código de Acesso</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-mono text-slate-800 tracking-widest">{credenciais.codigo}</code>
                <button onClick={() => copiar(credenciais.codigo)} className="p-2 text-slate-400 hover:text-[#002855] transition">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">Senha Provisória</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-mono text-slate-800">
                  {mostrarSenha ? credenciais.senha : '••••••••'}
                </code>
                <button onClick={() => setMostrarSenha(v => !v)} className="p-2 text-slate-400 hover:text-[#002855] transition">
                  {mostrarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button onClick={() => copiar(credenciais.senha)} className="p-2 text-slate-400 hover:text-[#002855] transition">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button
            onClick={() => {
              setCredenciais(null)
              setForm({ nome:'',cnpj:'',cpf:'',email:'',telefone:'',responsavel:'',endereco:'',cidade:'',estado:'',unidade_id:'' })
            }}
            variant="outline"
            className="flex-1 border-slate-200 text-slate-600 gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Cadastrar Outro
          </Button>
          <Button
            onClick={() => router.push('/admin/clientes')}
            className="flex-1 bg-[#002855] hover:bg-[#001a3d] text-white font-semibold"
          >
            Ver Lista de Clientes
          </Button>
        </div>
      </div>
    )
  }

  // ── Formulário ──────────────────────────────────────────────────────────────
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
          <p className="text-sm text-slate-500 mt-0.5">Cadastre um cliente Pessoa Jurídica (empresa) ou Física (individual)</p>
        </div>
      </div>

      {/* Seletor PJ / PF */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setTipo('PJ')}
          className={`flex-1 flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 transition-all text-left ${
            tipo === 'PJ'
              ? 'border-[#002855] bg-[#002855]/5 text-[#002855]'
              : 'border-slate-200 text-slate-500 hover:border-slate-300'
          }`}
        >
          <Building2 className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-bold text-sm">Pessoa Jurídica</p>
            <p className="text-[11px] opacity-70">Empresa, CNPJ, Razão Social</p>
          </div>
        </button>
        <button
          type="button"
          onClick={() => setTipo('PF')}
          className={`flex-1 flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 transition-all text-left ${
            tipo === 'PF'
              ? 'border-[#002855] bg-[#002855]/5 text-[#002855]'
              : 'border-slate-200 text-slate-500 hover:border-slate-300'
          }`}
        >
          <User className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-bold text-sm">Pessoa Física</p>
            <p className="text-[11px] opacity-70">Autônomo, CPF — gera login automaticamente</p>
          </div>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dados Principais */}
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              {tipo === 'PJ' ? <Building2 className="w-4 h-4 text-[#002855]" /> : <User className="w-4 h-4 text-[#002855]" />}
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                {tipo === 'PJ' ? 'Dados da Empresa' : 'Dados do Cliente PF'}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  {tipo === 'PJ' ? 'Razão Social' : 'Nome Completo'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.nome}
                  onChange={e => set('nome', e.target.value)}
                  placeholder={tipo === 'PJ' ? 'Empresa Exemplo Ltda' : 'João da Silva'}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all"
                  required
                />
              </div>

              {tipo === 'PJ' ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">CNPJ <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={form.cnpj}
                    onChange={e => set('cnpj', formatarCNPJ(e.target.value))}
                    placeholder="00.000.000/0000-00"
                    maxLength={18}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all font-mono"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">CPF <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={form.cpf}
                    onChange={e => set('cpf', formatarCPF(e.target.value))}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all font-mono"
                  />
                </div>
              )}

              {tipo === 'PJ' ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Responsável / RH</label>
                  <input
                    type="text"
                    value={form.responsavel}
                    onChange={e => set('responsavel', e.target.value)}
                    placeholder="Nome do responsável"
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all"
                  />
                </div>
              ) : null}

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

              <div className={tipo === 'PF' ? 'sm:col-span-2' : ''}>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  E-mail {tipo === 'PF' && <span className="text-red-500">* (usado como login)</span>}
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  placeholder={tipo === 'PF' ? 'email@exemplo.com' : 'rh@empresa.com.br'}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all"
                />
              </div>
            </div>

            {tipo === 'PF' && (
              <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mt-2">
                <Key className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                <p className="text-xs text-blue-700">
                  Ao salvar, o sistema vai gerar um <strong>código e uma senha provisória</strong> para este cliente.
                  Ele deverá trocar a senha no primeiro acesso ao portal.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Localização */}
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
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Endereço</label>
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

        {erro && (
          <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <p className="text-red-700 text-sm">{erro}</p>
          </div>
        )}

        <div className="flex items-center gap-3 justify-end">
          <Link href="/admin/clientes">
            <Button type="button" variant="outline" className="border-slate-200 text-slate-600">Cancelar</Button>
          </Link>
          <Button
            type="submit"
            disabled={salvando}
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
