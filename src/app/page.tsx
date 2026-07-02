import Link from 'next/link'
import {
  HeartPulse,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  ChevronRight,
  Building2,
  FileText,
  Activity,
  Shield,
  Users,
  Award,
  ArrowRight,
  Star,
  MessageCircle,
} from 'lucide-react'
import { Logo } from '@/components/ui/logo'

export const metadata = {
  title: 'Aptusclin | Medicina Ocupacional',
  description:
    'Clínica especializada em medicina ocupacional. Exames admissionais, periódicos, demissionais e check-ups corporativos para sua empresa.',
}

const services = [
  {
    icon: FileText,
    title: 'Exames Ocupacionais',
    desc: 'ASO admissional, periódico, demissional, mudança de função e retorno ao trabalho, com emissão ágil e segura.',
    color: 'bg-blue-50 text-blue-700',
    border: 'border-blue-100',
  },
  {
    icon: Activity,
    title: 'Exames Clínicos',
    desc: 'Amplo portfólio de exames laboratoriais, imagem e funcional para suporte à saúde ocupacional e preventiva.',
    color: 'bg-teal-50 text-teal-700',
    border: 'border-teal-100',
  },
  {
    icon: Building2,
    title: 'Atendimento In-Company',
    desc: 'Levamos a clínica até a sua empresa com unidades móveis e equipes treinadas para reduzir o absenteísmo.',
    color: 'bg-indigo-50 text-indigo-700',
    border: 'border-indigo-100',
  },
  {
    icon: Shield,
    title: 'Programas de SST',
    desc: 'Elaboração e gestão de PGR, PCMSO, LTCAT e envio dos eventos de eSocial de SST para conformidade legal.',
    color: 'bg-emerald-50 text-emerald-700',
    border: 'border-emerald-100',
  },
]

const stats = [
  { value: '15+', label: 'Anos de experiência' },
  { value: '500+', label: 'Empresas atendidas' },
  { value: '50k+', label: 'Exames realizados' },
  { value: '98%', label: 'Satisfação dos clientes' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* TOP BAR */}
      <div className="bg-[#0b3c7d] text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <span className="flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-[#1B8B3A]" />
            (11) 4004-3005
          </span>
        </div>
      </div>

      {/* HEADER */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Logo className="scale-90 sm:scale-100" />
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="#servicos" className="hover:text-[#0b3c7d]">Serviços</Link>
            <Link href="#sobre" className="hover:text-[#0b3c7d]">Sobre</Link>
          </nav>
          <Link
            href="/portal/agenda"
            className="bg-[#0b3c7d] text-white text-sm font-semibold px-4 py-2 rounded-lg"
          >
            Agenda
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-[#002855] py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold text-white mb-4">
            Medicina Ocupacional de Qualidade
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            Mais de 15 anos cuidando da saúde dos seus colaboradores
          </p>
          <Link
            href="/portal/agenda"
            className="inline-block bg-[#00b4d8] hover:bg-[#0096c7] text-white font-bold px-8 py-3 rounded-lg"
          >
            Agendar Agora
          </Link>
        </div>
      </section>

      {/* SERVICES */}
      <section id="servicos" className="py-20 bg-slate-50 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-extrabold text-center text-[#002855] mb-12">
            Nossos Serviços
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s) => {
              const Icon = s.icon
              return (
                <div key={s.title} className="bg-white border rounded-2xl p-6 hover:shadow-lg transition-shadow">
                  <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-[#002855] text-lg mb-2">
                    {s.title}
                  </h3>
                  <p className="text-slate-500 text-sm">{s.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="sobre" className="py-20 bg-white px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-extrabold text-[#002855] mb-4">
              Por que nos escolher?
            </h2>
            <p className="text-slate-600 mb-6">
              Somos referência em medicina ocupacional com tecnologia de ponta e atendimento humanizado.
            </p>
            <ul className="space-y-3">
              {['Mais de 15 anos de atuação', 'Equipe qualificada', 'Estrutura moderna'].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#002855]" />
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-[#002855] rounded-2xl p-8 text-white">
            <HeartPulse className="w-12 h-12 text-[#00b4d8] mb-4" />
            <h3 className="text-2xl font-bold mb-4">Nosso Compromisso</h3>
            <p className="text-slate-300">
              Garantir a saúde e segurança dos seus colaboradores com excelência em cada atendimento.
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="py-20 bg-slate-50 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-[#002855] mb-12">
            Entre em Contato
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6">
              <Phone className="w-8 h-8 text-[#002855] mx-auto mb-4" />
              <p className="font-semibold text-[#002855]">(11) 4000-0000</p>
            </div>
            <div className="bg-white rounded-xl p-6">
              <Mail className="w-8 h-8 text-[#002855] mx-auto mb-4" />
              <p className="font-semibold text-[#002855]">contato@aptusclin.com.br</p>
            </div>
            <div className="bg-white rounded-xl p-6">
              <MapPin className="w-8 h-8 text-[#002855] mx-auto mb-4" />
              <p className="font-semibold text-[#002855]">São Paulo – SP</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#071224] text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-400">© 2025 Aptusclin – Medicina Ocupacional. Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* WHATSAPP */}
      <a
        href="https://wa.me/5511400000000"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
      >
        <MessageCircle className="w-7 h-7" />
      </a>
    </div>
  )
}
