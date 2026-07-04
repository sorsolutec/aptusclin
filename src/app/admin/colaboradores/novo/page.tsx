'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  User, ArrowLeft, Save, Loader2, CheckCircle2, AlertCircle,
  Copy, Printer, KeyRound, Building2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const UNIDADES = [
  { id: 'sorriso', label: 'Sorriso – MT' },
  { id: 'nova-ubirata', label: 'Nova Ubiratã – MT' },
  { id: 'boa-esperanca', label: 'Boa Esperança do Norte – MT' },
  { id: 'nova-mutum', label: 'Nova Mutum – MT' },
]

type Empresa = { id: string; nome: string }
type Credenciais = { usuario: string; senha: string }

export default function NovoColaboradorPage() {
  const router = useRouter()
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const [credenciais, setCredenciais] = useState<Credenciais | null>(null)
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [copiado, setCopiado] = useState(false)

  const [form, setForm] = useState({
    nome: '',
    cpf: '',
    data_nascimento: '',
    data_admissao: '',
    cargo: '',
    access_level: 'viewer',
    unidade_id: '',
    telefone: '',
    email: '',
  })

  useEffect(() => {
    fetch('/api/clientes?limit=200')
      .then(r => r.json())
      .then(d => setEmpresas(d.clientes || []))
      .catch(() => {})
  }, [])

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
    setErro('')
  }

  function formatarCPF(v: string) {
    const d = v.replace(/\D/g, '').slice(0, 11)
    return d
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1-$2')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nome.trim()) { setErro('Nome é obrigatório.'); return }
    if (!form.cpf.trim()) { setErro('CPF é obrigatório.'); return }

    setSalvando(true)
    setErro('')

    try {
      const res = await fetch('/api/colaboradores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()
      if (!res.ok) {
        setErro(data.error || 'Erro ao salvar.')
        return
      }

      setCredenciais(data.credenciais)
    } catch {
      setErro('Erro de conexão. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  async function copiarCredenciais() {
    if (!credenciais) return
    await navigator.clipboard.writeText(
      `Portal Aptusclin – Acesso ao Resultado de Exames\nUsuário: ${credenciais.usuario}\nSenha: ${credenciais.senha}\nAcesse: ${window.location.origin}/resultados`
    )
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  // Tela de credenciais geradas
  if (credenciais) {
    return (
      <div className="max-w-lg mx-auto space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-4">
            <KeyRound className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Colaborador Cadastrado!</h1>
          <p className="text-slate-500 text-sm mt-2">
            As credenciais foram geradas. Anote ou imprima antes de fechar.
          </p>
        </div>

        <Card className="border-emerald-200 bg-emerald-50 shadow-sm overflow-hidden">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Credenciais de Acesso ao Portal</p>
              <div className="bg-white rounded-xl p-5 border border-emerald-200 space-y-3">
                <div>
                  <p className="text-xs text-slate-500 font-medium">Usuário</p>
                  <p className="text-2xl font-black text-[#002855] font-mono tracking-wide mt-0.5">
                    {credenciais.usuario}
                  </p>
                </div>
                <div className="border-t border-slate-100 pt-3">
                  <p className="text-xs text-slate-500 font-medium">Senha</p>
                  <p className="text-2xl font-black text-[#1B8B3A] font-mono tracking-widest mt-0.5">
                    {credenciais.senha}
                  </p>
                </div>
                <div className="border-t border-slate-100 pt-3">
                  <p className="text-xs text-slate-500 font-medium">URL de acesso</p>
                  <p className="text-xs text-blue-600 font-mono mt-0.5">
                    {typeof window !== 'undefined' ? window.location.origin : ''}/resultados
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={copiarCredenciais}
                  variant="outline"
                  className="flex-1 border-emerald-200 text-emerald-700 hover:bg-emerald-100 gap-2"
                >
                  <Copy className="w-4 h-4" />
                  {copiado ? 'Copiado!' : 'Copiar'}
                </Button>
                <Button
                  onClick={() => window.print()}
                  variant="outline"
                  className="flex-1 border-emerald-200 text-emerald-700 hover:bg-emerald-100 gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Imprimir
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button
            onClick={() => {
              setCredenciais(null)
              setForm({ nome:'',cpf:'',data_nascimento:'',data_admissao:'',cargo:'',access_level:'viewer',unidade_id:'',telefone:'',email:'' })
            }}
            variant="outline"
            className="flex-1 border-slate-200 text-slate-600"
          >
            + Cadastrar Outro
          </Button>
          <Button
            onClick={() => router.push('/admin/colaboradores')}
            className="flex-1 bg-[#002855] hover:bg-[#001a3d] text-white font-semibold"
          >
            Ver Todos os Colaboradores
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/colaboradores">
          <Button variant="outline" size="icon" className="border-slate-200 text-slate-500">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Novo Colaborador</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Cadastre um funcionário — usuário e senha serão gerados automaticamente
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dados Pessoais */}
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-[#002855]" />
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Dados Pessoais</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Nome Completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.nome}
                  onChange={e => set('nome', e.target.value)}
                  placeholder="Nome completo do colaborador"
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  CPF <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.cpf}
                  onChange={e => set('cpf', formatarCPF(e.target.value))}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Data de Nascimento</label>
                <input
                  type="date"
                  value={form.data_nascimento}
                  onChange={e => set('data_nascimento', e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all text-slate-600"
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
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">E-mail (opcional)</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  placeholder="colaborador@email.com"
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vínculo Profissional */}
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-[#002855]" />
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Vínculo Profissional</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Data de Admissão</label>
                <input
                  type="date"
                  value={form.data_admissao}
                  onChange={e => set('data_admissao', e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all text-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Cargo / Função</label>
                <input
                  type="text"
                  value={form.cargo}
                  onChange={e => set('cargo', e.target.value)}
                  placeholder="Ex.: Operador de Máquinas"
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nível de Acesso ao Sistema</label>
                <select
                  value={form.access_level}
                  onChange={e => set('access_level', e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all text-slate-600"
                  required
                >
                  <option value="viewer">Apenas Consultar Exames</option>
                  <option value="editor">Consultar e Lançar Exames</option>
                  <option value="admin">Acesso Total (Administrador da Unidade)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Unidade Aptusclin</label>
                <select
                  value={form.unidade_id}
                  onChange={e => set('unidade_id', e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all text-slate-600"
                >
                  <option value="">Selecione a unidade...</option>
                  {UNIDADES.map(u => (
                    <option key={u.id} value={u.id}>{u.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Aviso sobre credenciais */}
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <KeyRound className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
          <p className="text-blue-700 text-xs leading-relaxed">
            <strong>Geração automática de acesso:</strong> Ao salvar, o sistema gerará automaticamente
            um <strong>usuário</strong> (nome.sobrenome) e uma <strong>senha aleatória</strong> de 8 caracteres
            para o colaborador acessar o portal de resultados em <code>/resultados</code>.
          </p>
        </div>

        {/* Erro */}
        {erro && (
          <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <p className="text-red-700 text-sm">{erro}</p>
          </div>
        )}

        {/* Botões */}
        <div className="flex items-center gap-3 justify-end">
          <Link href="/admin/colaboradores">
            <Button type="button" variant="outline" className="border-slate-200 text-slate-600">
              Cancelar
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={salvando}
            className="bg-[#002855] hover:bg-[#001a3d] text-white font-semibold gap-2"
          >
            {salvando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {salvando ? 'Salvando...' : 'Cadastrar e Gerar Acesso'}
          </Button>
        </div>
      </form>
    </div>
  )
}
