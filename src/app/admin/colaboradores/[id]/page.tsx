'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import {
  User, ArrowLeft, Save, Loader2, AlertCircle, Trash2,
  KeyRound, Building2, CheckCircle2, Copy,
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

type Form = {
  nome: string
  cpf: string
  data_nascimento: string
  data_admissao: string
  cargo: string
  empresa_id: string
  unidade_id: string
  telefone: string
  email: string
  status_aso: string
}

export default function EditarColaboradorPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const id = params.id

  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [excluindo, setExcluindo] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [erro, setErro] = useState('')
  const [novaSenha, setNovaSenha] = useState<string | null>(null)
  const [copiado, setCopiado] = useState(false)
  const [resetandoSenha, setResetandoSenha] = useState(false)
  const [empresas, setEmpresas] = useState<Empresa[]>([])

  const [form, setForm] = useState<Form>({
    nome: '',
    cpf: '',
    data_nascimento: '',
    data_admissao: '',
    cargo: '',
    empresa_id: '',
    unidade_id: '',
    telefone: '',
    email: '',
    status_aso: 'Pendente',
  })

  // Carrega empresas e colaborador
  useEffect(() => {
    fetch('/api/clientes?limit=200')
      .then(r => r.json())
      .then(d => setEmpresas(d.clientes || []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!id) return
    setCarregando(true)
    fetch(`/api/colaboradores/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.colaborador) {
          const c = data.colaborador
          setForm({
            nome: c.nome || '',
            cpf: c.cpf ? formatarCPF(c.cpf) : '',
            data_nascimento: c.data_nascimento?.slice(0, 10) || '',
            data_admissao: c.data_admissao?.slice(0, 10) || '',
            cargo: c.cargo || '',
            empresa_id: c.empresa_id || '',
            unidade_id: c.unidade_id || '',
            telefone: c.telefone || '',
            email: c.email || '',
            status_aso: c.status_aso || 'Pendente',
          })
        } else {
          setErro('Colaborador não encontrado.')
        }
      })
      .catch(() => setErro('Erro ao carregar dados do colaborador.'))
      .finally(() => setCarregando(false))
  }, [id])

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

    setSalvando(true)
    setErro('')
    setNovaSenha(null)

    try {
      const res = await fetch(`/api/colaboradores/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, resetar_senha: resetandoSenha }),
      })

      const data = await res.json()
      if (!res.ok) { setErro(data.error || 'Erro ao salvar.'); return }

      if (data.nova_senha) {
        setNovaSenha(data.nova_senha)
      } else {
        setSucesso(true)
        setTimeout(() => router.push('/admin/colaboradores'), 1500)
      }
    } catch {
      setErro('Erro de conexão. Tente novamente.')
    } finally {
      setSalvando(false)
      setResetandoSenha(false)
    }
  }

  async function handleExcluir() {
    if (!confirm(`Deseja desativar o colaborador "${form.nome}"?`)) return
    setExcluindo(true)
    try {
      const res = await fetch(`/api/colaboradores/${id}`, { method: 'DELETE' })
      if (res.ok) router.push('/admin/colaboradores')
      else setErro('Erro ao desativar colaborador.')
    } catch {
      setErro('Erro de conexão.')
    } finally {
      setExcluindo(false)
    }
  }

  async function copiarSenha() {
    if (!novaSenha) return
    await navigator.clipboard.writeText(novaSenha)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  if (carregando) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-7 h-7 animate-spin text-[#002855]/40" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/colaboradores">
            <Button variant="outline" size="icon" className="border-slate-200 text-slate-500">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Editar Colaborador</h1>
            <p className="text-sm text-slate-500 mt-0.5">Atualize os dados e o acesso ao portal</p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={handleExcluir}
          disabled={excluindo}
          className="border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 gap-2 text-sm"
        >
          {excluindo ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          Desativar
        </Button>
      </div>

      {/* Nova senha gerada */}
      {novaSenha && (
        <Card className="border-emerald-200 bg-emerald-50 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <KeyRound className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-bold text-emerald-800">Nova senha gerada!</p>
                <p className="text-xs text-emerald-700 mt-1">Anote e repasse ao colaborador:</p>
                <div className="flex items-center gap-3 mt-3">
                  <code className="text-xl font-black text-emerald-900 tracking-widest font-mono bg-white px-4 py-2 rounded-lg border border-emerald-200">
                    {novaSenha}
                  </code>
                  <Button
                    onClick={copiarSenha}
                    variant="outline"
                    size="sm"
                    className="border-emerald-200 text-emerald-700 hover:bg-emerald-100 gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copiado ? 'Copiado!' : 'Copiar'}
                  </Button>
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                onClick={() => { setNovaSenha(null); router.push('/admin/colaboradores') }}
                className="flex-1 bg-[#002855] hover:bg-[#001a3d] text-white font-semibold text-sm"
              >
                Concluir
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!novaSenha && (
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
                    maxLength={14}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all font-mono"
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
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vínculo e ASO */}
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4 text-[#002855]" />
                <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Vínculo e ASO</h2>
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
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Empresa Cliente</label>
                  <select
                    value={form.empresa_id}
                    onChange={e => set('empresa_id', e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all text-slate-600"
                  >
                    <option value="">Selecione...</option>
                    {empresas.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.nome}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Unidade Aptusclin</label>
                  <select
                    value={form.unidade_id}
                    onChange={e => set('unidade_id', e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all text-slate-600"
                  >
                    <option value="">Selecione...</option>
                    {UNIDADES.map(u => (
                      <option key={u.id} value={u.id}>{u.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Status ASO</label>
                  <select
                    value={form.status_aso}
                    onChange={e => set('status_aso', e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all text-slate-600"
                  >
                    <option value="Pendente">Sem ASO</option>
                    <option value="Apto">Apto</option>
                    <option value="Inapto">Inapto</option>
                    <option value="Vencido">ASO Vencido</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resetar senha */}
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <KeyRound className="w-4 h-4 text-[#002855]" />
                  <div>
                    <p className="text-sm font-semibold text-slate-700">Resetar Senha de Acesso</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Gera uma nova senha aleatória ao salvar
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={resetandoSenha}
                    onChange={e => setResetandoSenha(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#002855]"></div>
                </label>
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
              <p className="text-emerald-700 text-sm font-semibold">Colaborador atualizado com sucesso!</p>
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
              disabled={salvando || sucesso}
              className="bg-[#002855] hover:bg-[#001a3d] text-white font-semibold gap-2"
            >
              {salvando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {salvando ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
