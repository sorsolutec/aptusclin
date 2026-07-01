'use client'

import { useState } from 'react'
import {
  Building2,
  CheckCircle2,
  ChevronLeft,
  Loader2,
  ShieldAlert,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function NovaEmpresaPage() {
  const [salvando, setSalvando] = useState(false)
  const [sucesso, setSucesso] = useState(false)

  const [form, setForm] = useState({
    nomeFantasia: '',
    razaoSocial: '',
    cnpj: '',
    email: '',
    telefone: '',
    endereco: '',
    responsavel: '',
    plano: 'Medicina Ocupacional Completa',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSalvando(true)

    // TODO: Integrar com Supabase — insert na tabela empresas
    await new Promise((r) => setTimeout(r, 1200))

    setSalvando(false)
    setSucesso(true)
  }

  if (sucesso) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-5">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Empresa cadastrada com sucesso!</h2>
        <p className="text-slate-500 mt-2 mb-8">
          A empresa <strong>{form.nomeFantasia || form.razaoSocial}</strong> já pode acessar o Portal do Cliente.
        </p>
        <div className="flex gap-3">
          <Button
            onClick={() => { setSucesso(false); setForm({ nomeFantasia: '', razaoSocial: '', cnpj: '', email: '', telefone: '', endereco: '', responsavel: '', plano: 'Medicina Ocupacional Completa' }) }}
            className="bg-[#002855] hover:bg-[#001a3d] text-white gap-2"
          >
            Cadastrar outra empresa
          </Button>
          <Link href="/admin/empresas">
            <Button variant="outline" className="border-slate-200">Ver todas as empresas</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/empresas" className="text-slate-400 hover:text-slate-700 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Cadastrar Nova Empresa</h1>
          <p className="text-sm text-slate-500 mt-0.5">Adicione uma empresa parceira ao sistema</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-600 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#002855]" />
              Identificação da Empresa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Nome Fantasia *
                </label>
                <input
                  type="text"
                  name="nomeFantasia"
                  value={form.nomeFantasia}
                  onChange={handleChange}
                  placeholder="Ex.: Empresa Alpha"
                  required
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Razão Social *
                </label>
                <input
                  type="text"
                  name="razaoSocial"
                  value={form.razaoSocial}
                  onChange={handleChange}
                  placeholder="Ex.: Empresa Alpha Ltda"
                  required
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  CNPJ *
                </label>
                <input
                  type="text"
                  name="cnpj"
                  value={form.cnpj}
                  onChange={handleChange}
                  placeholder="00.000.000/0000-00"
                  required
                  maxLength={18}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Responsável no RH
                </label>
                <input
                  type="text"
                  name="responsavel"
                  value={form.responsavel}
                  onChange={handleChange}
                  placeholder="Nome do contato principal"
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contatos */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-600 flex items-center gap-2">
              Contato & Localização
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  E-mail do RH *
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="rh@empresa.com.br"
                  required
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Telefone / WhatsApp *
                </label>
                <input
                  type="text"
                  name="telefone"
                  value={form.telefone}
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
                  required
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Endereço Comercial
              </label>
              <input
                type="text"
                name="endereco"
                value={form.endereco}
                onChange={handleChange}
                placeholder="Rua, Número, Bairro, Cidade - UF"
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all"
              />
            </div>
          </CardContent>
        </Card>

        {/* Configuração de Serviço */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-600 flex items-center gap-2">
              Plano & Serviços Contratados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <select
              name="plano"
              value={form.plano}
              onChange={handleChange}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition-all text-slate-700"
            >
              <option>Medicina Ocupacional Completa (NR-7/9/15/16)</option>
              <option>Apenas ASO & Periódicos</option>
              <option>Check-ups Corporativos e Preventiva</option>
              <option>Gestão Integrada de Saúde & Segurança (SST)</option>
            </select>
          </CardContent>
        </Card>

        {/* Info de Acesso */}
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <ShieldAlert className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-800 leading-relaxed">
            Ao salvar, uma credencial de acesso temporária para o e-mail corporativo cadastrado será criada para permitir o login direto no Portal do Cliente.
          </p>
        </div>

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
              <><CheckCircle2 className="w-4 h-4" /> Cadastrar Empresa</>
            )}
          </Button>
          <Link href="/admin/empresas">
            <Button variant="ghost" type="button" className="text-slate-500">
              Cancelar
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
