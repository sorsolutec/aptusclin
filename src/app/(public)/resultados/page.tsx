'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FileText, ArrowLeft, Lock, Eye, EyeOff, User, AlertCircle, Loader2 } from 'lucide-react'
import { Logo } from '@/components/ui/logo'

export default function ResultadosPage() {
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')

    if (!usuario.trim() || !senha.trim()) {
      setErro('Preencha o usuário e a senha.')
      return
    }

    setCarregando(true)
    try {
      const res = await fetch('/api/resultados/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario: usuario.trim(), senha: senha.trim() }),
      })

      if (res.ok) {
        const data = await res.json()
        // Redireciona para a página de exames do paciente
        window.location.href = `/resultados/${data.pacienteId}`
      } else {
        const data = await res.json().catch(() => ({}))
        setErro(data.message || 'Usuário ou senha incorretos.')
      }
    } catch {
      setErro('Erro de conexão. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00183a] via-[#002855] to-[#071e3d] flex flex-col">

      {/* Top bar */}
      <div className="py-3 px-4 border-b border-white/10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/60 hover:text-white text-xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar ao site
          </Link>
          <span className="text-white/40 text-xs flex items-center gap-1.5">
            <Lock className="w-3 h-3" />
            Conexão segura
          </span>
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          {/* Logo + título */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1B8B3A]/20 border border-[#1B8B3A]/40 rounded-2xl mb-5">
              <FileText className="w-8 h-8 text-[#25D366]" />
            </div>
            <Logo className="mx-auto mb-4 brightness-0 invert scale-90" />
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Resultados de Exames
            </h1>
            <p className="text-white/50 mt-2 text-sm leading-relaxed">
              Acesse com o <strong className="text-white/70">usuário e senha</strong> fornecidos
              no seu cadastro de paciente.
            </p>
          </div>

          {/* Card do formulário */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>

              {/* Campo Usuário */}
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-2 uppercase tracking-wider">
                  Usuário
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                  <input
                    id="campo-usuario"
                    type="text"
                    autoComplete="username"
                    placeholder="Ex.: joao.silva ou CPF"
                    value={usuario}
                    onChange={e => { setUsuario(e.target.value); setErro('') }}
                    className="w-full bg-white/10 border border-white/15 text-white placeholder-white/30 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#1B8B3A] focus:ring-2 focus:ring-[#1B8B3A]/40 transition"
                  />
                </div>
              </div>

              {/* Campo Senha */}
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-2 uppercase tracking-wider">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                  <input
                    id="campo-senha"
                    type={mostrarSenha ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Senha fornecida no cadastro"
                    value={senha}
                    onChange={e => { setSenha(e.target.value); setErro('') }}
                    className="w-full bg-white/10 border border-white/15 text-white placeholder-white/30 rounded-xl pl-10 pr-11 py-3 text-sm focus:outline-none focus:border-[#1B8B3A] focus:ring-2 focus:ring-[#1B8B3A]/40 transition"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setMostrarSenha(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition"
                    aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {mostrarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Mensagem de erro */}
              {erro && (
                <div className="flex items-start gap-2.5 bg-red-500/15 border border-red-500/30 rounded-xl px-4 py-3">
                  <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <p className="text-red-300 text-sm">{erro}</p>
                </div>
              )}

              {/* Botão */}
              <button
                id="btn-acessar-resultados"
                type="submit"
                disabled={carregando}
                className="w-full flex items-center justify-center gap-2 bg-[#1B8B3A] hover:bg-[#166b2d] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl text-sm transition shadow-lg shadow-green-900/30"
              >
                {carregando ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    Acessar Meus Resultados
                  </>
                )}
              </button>
            </form>

            {/* Divisor + info */}
            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <p className="text-white/40 text-xs leading-relaxed">
                O usuário e a senha são fornecidos pela clínica no momento do
                cadastro do paciente. Caso não os tenha, entre em contato com a
                unidade Aptusclin mais próxima.
              </p>
            </div>
          </div>

          {/* Nota sobre acesso empresarial */}
          <div className="mt-5 text-center">
            <p className="text-white/30 text-xs">
              É uma empresa?{' '}
              <Link
                href="/login"
                className="text-[#25D366] hover:text-[#1B8B3A] font-semibold transition-colors"
              >
                Acesse o portal corporativo →
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-5 text-center text-xs text-white/20 border-t border-white/10">
        © {new Date().getFullYear()} Aptusclin – Medicina Ocupacional. Todos os direitos reservados.
      </footer>
    </div>
  )
}
