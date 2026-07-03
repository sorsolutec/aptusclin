'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  FileText, ArrowLeft, Download, CheckCircle, XCircle,
  Clock, AlertCircle, Loader2, User, Building2, Briefcase,
} from 'lucide-react'
import { Logo } from '@/components/ui/logo'

type Exame = {
  id: string
  title: string
  tipo?: string
  resultado?: string
  arquivo_url?: string
  status_resultado?: string
  start_at?: string
  created_at: string
}

type Colaborador = {
  id: string
  nome: string
  cargo?: string
  status_aso?: string
  empresas?: { nome: string } | null
}

function StatusChip({ status }: { status?: string }) {
  if (!status) return null
  switch (status.toLowerCase()) {
    case 'apto':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
          <CheckCircle className="w-3.5 h-3.5" /> Apto
        </span>
      )
    case 'inapto':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-bold">
          <XCircle className="w-3.5 h-3.5" /> Inapto
        </span>
      )
    case 'vencido':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold">
          <AlertCircle className="w-3.5 h-3.5" /> ASO Vencido
        </span>
      )
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-500/20 border border-slate-500/30 text-slate-300 text-xs font-bold">
          <Clock className="w-3.5 h-3.5" /> {status}
        </span>
      )
  }
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export default function ResultadosColaboradorPage() {
  const params = useParams<{ id: string }>()
  const id = params.id

  const [colaborador, setColaborador] = useState<Colaborador | null>(null)
  const [exames, setExames] = useState<Exame[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    if (!id) return
    setCarregando(true)
    fetch(`/api/resultados/${id}`)
      .then(r => {
        if (!r.ok) throw new Error('not_found')
        return r.json()
      })
      .then(data => {
        setColaborador(data.colaborador)
        setExames(data.exames || [])
      })
      .catch(() => setErro('Não foi possível carregar os resultados. Verifique suas credenciais.'))
      .finally(() => setCarregando(false))
  }, [id])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00183a] via-[#002855] to-[#071e3d] flex flex-col">

      {/* Top bar */}
      <div className="py-3 px-4 border-b border-white/10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/resultados"
            className="flex items-center gap-2 text-white/60 hover:text-white text-xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Sair / Trocar usuário
          </Link>
          <Logo className="brightness-0 invert scale-75 origin-right" />
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 px-4 py-8 max-w-4xl mx-auto w-full">
        {carregando ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-white/40" />
          </div>
        ) : erro ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-white font-bold text-lg">{erro}</p>
            <Link href="/resultados">
              <button className="mt-6 text-sm text-[#25D366] hover:underline">
                Voltar ao login
              </button>
            </Link>
          </div>
        ) : colaborador ? (
          <div className="space-y-6">
            {/* Card do colaborador */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="w-14 h-14 bg-[#1B8B3A]/20 border border-[#1B8B3A]/30 rounded-2xl flex items-center justify-center shrink-0">
                  <User className="w-7 h-7 text-[#25D366]" />
                </div>
                <div className="flex-1">
                  <h1 className="text-xl font-extrabold text-white">{colaborador.nome}</h1>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    {colaborador.cargo && (
                      <span className="flex items-center gap-1.5 text-white/60 text-xs">
                        <Briefcase className="w-3.5 h-3.5" /> {colaborador.cargo}
                      </span>
                    )}
                    {colaborador.empresas?.nome && (
                      <span className="flex items-center gap-1.5 text-white/60 text-xs">
                        <Building2 className="w-3.5 h-3.5" /> {colaborador.empresas.nome}
                      </span>
                    )}
                  </div>
                  {colaborador.status_aso && (
                    <div className="mt-3">
                      <StatusChip status={colaborador.status_aso} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Lista de exames */}
            <div>
              <h2 className="text-white/70 text-xs font-bold uppercase tracking-widest mb-4">
                Histórico de Exames e Resultados
              </h2>

              {exames.length > 0 ? (
                <div className="space-y-3">
                  {exames.map(exame => (
                    <div
                      key={exame.id}
                      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:bg-white/8 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="w-10 h-10 bg-[#002855] border border-white/10 rounded-xl flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-white/60" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold text-sm leading-tight">
                            {exame.title || exame.tipo || 'Exame'}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 mt-1">
                            <span className="text-white/40 text-xs">
                              {formatDate(exame.start_at || exame.created_at)}
                            </span>
                            {exame.tipo && (
                              <span className="text-white/50 text-xs">{exame.tipo}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          {exame.resultado && (
                            <StatusChip status={exame.resultado} />
                          )}
                          {exame.arquivo_url && (
                            <a
                              href={exame.arquivo_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1B8B3A]/20 border border-[#1B8B3A]/30 text-[#25D366] text-xs font-semibold hover:bg-[#1B8B3A]/30 transition-colors"
                            >
                              <Download className="w-3.5 h-3.5" />
                              Baixar
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white/3 border border-white/8 rounded-2xl">
                  <FileText className="w-12 h-12 text-white/20 mx-auto mb-3" />
                  <p className="text-white/50 font-medium">Nenhum exame cadastrado</p>
                  <p className="text-white/30 text-sm mt-1">
                    Seus resultados aparecerão aqui quando forem lançados pela clínica.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </main>

      {/* Footer */}
      <footer className="py-5 text-center text-xs text-white/20 border-t border-white/10">
        © {new Date().getFullYear()} Aptusclin – Medicina Ocupacional. Todos os direitos reservados.
      </footer>
    </div>
  )
}
