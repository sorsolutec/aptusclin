import Link from 'next/link'
import {
  FileText,
  ClipboardCheck,
  ChevronRight,
  ArrowLeft,
  Lock,
} from 'lucide-react'
import { Logo } from '@/components/ui/logo'

export const metadata = {
  title: 'Resultados | Portal Aptusclin',
  description: 'Acesse seus resultados de exames e ASO da Aptusclin.',
}

const opcoes = [
  {
    href: '/login',
    icon: ClipboardCheck,
    titulo: 'ASO',
    subtitulo: 'Atestado de Saúde Ocupacional',
    descricao:
      'Acesse, visualize e faça o download do ASO dos colaboradores da sua empresa de forma segura.',
    cor: 'from-[#0b3c7d] to-[#07244a]',
    badge: 'NR-7',
    badgeCor: 'bg-blue-400/20 text-blue-200',
  },
  {
    href: '/login',
    icon: FileText,
    titulo: 'Exames',
    subtitulo: 'Laudos e Resultados Clínicos',
    descricao:
      'Consulte os laudos de exames laboratoriais, de imagem e funcionais dos seus colaboradores.',
    cor: 'from-[#1B8B3A] to-[#125d27]',
    badge: 'RESULTADOS',
    badgeCor: 'bg-emerald-400/20 text-emerald-100',
  },
]

export default function ResultadosPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top bar */}
      <div className="bg-[#0b3c7d] py-2 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white/70 hover:text-white text-xs transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar ao site
          </Link>
          <Link href="/login" className="flex items-center gap-1.5 text-white/70 hover:text-white text-xs transition-colors">
            <Lock className="w-3 h-3" />
            Área restrita
          </Link>
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-3xl">
          {/* Logo */}
          <div className="text-center mb-12 flex flex-col items-center">
            <Logo className="mb-4 transform scale-110" />
            <h1 className="text-2xl font-bold text-[#0b3c7d] tracking-tight mt-4">
              Portal de Resultados
            </h1>
            <p className="text-slate-500 mt-2 text-sm">
              Selecione o tipo de documento que deseja acessar
            </p>
          </div>

          {/* Cards de opção */}
          <div className="grid sm:grid-cols-2 gap-5">
            {opcoes.map((op) => {
              const Icon = op.icon
              return (
                <Link key={op.titulo} href={op.href}>
                  <div
                    className={`relative rounded-2xl bg-gradient-to-br ${op.cor} p-7 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 cursor-pointer group overflow-hidden`}
                  >
                    {/* Decoração de fundo */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-12 -mt-12 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-8 -mb-8 pointer-events-none" />

                    {/* Badge */}
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-4 tracking-widest ${op.badgeCor}`}>
                      {op.badge}
                    </span>

                    {/* Ícone */}
                    <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Texto */}
                    <h2 className="text-2xl font-extrabold leading-tight">{op.titulo}</h2>
                    <p className="text-white/70 text-sm font-medium mt-0.5">{op.subtitulo}</p>
                    <p className="text-white/60 text-sm leading-relaxed mt-3">{op.descricao}</p>

                    {/* CTA */}
                    <div className="flex items-center gap-1 mt-5 text-sm font-bold group-hover:gap-2 transition-all">
                      Acessar agora
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Footer info */}
          <p className="text-center text-xs text-slate-400 mt-10">
            🔒 Acesso seguro via credenciais corporativas.{' '}
            <Link href="/login" className="text-[#0b3c7d] hover:underline font-semibold">
              Entrar no portal
            </Link>
          </p>
        </div>
      </main>

      {/* Footer simples */}
      <footer className="py-5 text-center text-xs text-slate-400 border-t border-slate-200">
        © 2025 Aptusclin – Medicina Ocupacional. Todos os direitos reservados.
      </footer>
    </div>
  )
}
