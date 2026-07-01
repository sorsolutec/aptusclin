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
  Menu,
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

const diferenciais = [
  { icon: Award, text: 'Mais de 15 anos de atuação em medicina ocupacional' },
  { icon: Users, text: 'Equipe de profissionais experientes e qualificados' },
  { icon: Building2, text: 'Estrutura moderna e acolhedora' },
  { icon: CheckCircle2, text: 'Excelência no diagnóstico e laudo ágil' },
  { icon: Shield, text: 'Conformidade com NR-7 e legislação trabalhista' },
  { icon: Star, text: 'Atendimento personalizado para cada empresa' },
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
      {/* ===== TOP BAR ===== */}
      <div className="bg-[#0b3c7d] text-white text-xs py-2 px-4 border-b border-[#07244a]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-[#1B8B3A]" />
              (11) 4004-3005
            </span>
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-[#1B8B3A]" />
              contato@aptusclin.com.br
            </span>
          </div>
          <Link
            href="/resultados"
            className="flex items-center gap-1.5 bg-[#1B8B3A] hover:bg-[#125d27] text-white px-3 py-1 rounded text-xs font-semibold transition-colors"
          >
            🔒 Resultados de Exames
          </Link>
        </div>
      </div>

      {/* ===== HEADER ===== */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Logo className="scale-90 sm:scale-100 transform origin-left" />
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="/" className="hover:text-[#0b3c7d] transition-colors">Início</Link>
            <Link href="#sobre" className="hover:text-[#0b3c7d] transition-colors">Institucional</Link>
            <Link href="#servicos" className="hover:text-[#0b3c7d] transition-colors">Nossos Serviços</Link>
            <Link href="#contato" className="hover:text-[#0b3c7d] transition-colors">Fale Conosco</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:flex items-center gap-2 bg-[#0b3c7d] hover:bg-[#093063] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Portal do Cliente
              <ChevronRight className="w-4 h-4" />
            </Link>
            <button className="md:hidden p-2 text-slate-600">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="relative bg-[#002855] min-h-[580px] flex items-center overflow-hidden">
        {/* Background image overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: 'url(/hero-clinica.png)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#002855] via-[#002855]/90 to-[#002855]/60" />

        <div className="relative max-w-7xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#00b4d8]/20 border border-[#00b4d8]/30 text-[#00b4d8] text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Referência em medicina ocupacional
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-5">
              Eficiência em{' '}
              <span className="text-[#00b4d8]">exames</span>{' '}
              ocupacionais para sua empresa
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed mb-8">
              Garantimos a saúde e segurança dos seus colaboradores com exames ágeis, laudos precisos e atendimento humanizado. Mais de 15 anos de experiência no mercado.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="#contato"
                className="flex items-center gap-2 bg-[#00b4d8] hover:bg-[#0096c7] text-white font-bold px-6 py-3 rounded-lg transition-colors shadow-lg"
              >
                Fale com nossa equipe
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#servicos"
                className="flex items-center gap-2 border border-white/30 hover:bg-white/10 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Nossos serviços
              </Link>
            </div>
          </div>

          {/* Stats card */}
          <div className="hidden md:grid grid-cols-2 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-5 text-center">
                <p className="text-3xl font-extrabold text-[#00b4d8]">{s.value}</p>
                <p className="text-slate-300 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVIÇOS ===== */}
      <section id="servicos" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-[#00b4d8] text-sm font-bold uppercase tracking-widest">O que oferecemos</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#002855] mt-2">
              A melhor opção para a sua empresa
            </h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto">
              Soluções completas em saúde ocupacional para manter a conformidade legal e o bem-estar dos seus colaboradores.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s) => {
              const Icon = s.icon
              return (
                <div
                  key={s.title}
                  className={`bg-white border ${s.border} rounded-2xl p-6 hover:shadow-md transition-shadow group`}
                >
                  <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-[#002855] text-lg mb-2 group-hover:text-[#00b4d8] transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
                  <div className="flex items-center gap-1 text-[#00b4d8] text-sm font-semibold mt-4">
                    Saiba mais <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== POR QUE NOS ESCOLHER ===== */}
      <section id="sobre" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-[#00b4d8] text-sm font-bold uppercase tracking-widest">Por que nos escolher?</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#002855] mt-2 mb-6">
              Excelência em cada atendimento
            </h2>
            <p className="text-slate-500 text-base leading-relaxed mb-8">
              A Aptusclin é referência em medicina ocupacional, combinando tecnologia de ponta com um atendimento humanizado. Nossa missão é garantir saúde, segurança e produtividade para as empresas parceiras.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {diferenciais.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#002855]/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-[#002855]" />
                  </div>
                  <p className="text-slate-700 text-sm leading-snug">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Visual card */}
          <div className="relative">
            <div className="bg-[#002855] rounded-2xl p-8 text-white shadow-2xl">
              <div className="w-14 h-14 bg-[#00b4d8]/20 rounded-xl flex items-center justify-center mb-5">
                <HeartPulse className="w-8 h-8 text-[#00b4d8]" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Nosso Portfólio</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Disponibilizamos um portfólio completo de serviços para atender desde PMEs até grandes corporações com eficiência e conformidade.
              </p>
              <div className="space-y-3">
                {['Exames Admissionais', 'Exames Periódicos', 'Exames Demissionais', 'PPRA e PCMSO', 'Treinamentos NR'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#00b4d8] flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <Link
                href="#contato"
                className="mt-6 inline-flex items-center gap-2 bg-[#00b4d8] hover:bg-[#0096c7] text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-colors"
              >
                Entre em contato
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {/* Decorative element */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#00b4d8]/10 rounded-full -z-10" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-[#002855]/10 rounded-full -z-10" />
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="bg-[#00b4d8] py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Ofereça check-ups completos para os colaboradores da sua empresa
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Programas personalizados de saúde preventiva e medicina ocupacional para aumentar a produtividade e reduzir afastamentos.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="#contato"
              className="bg-white text-[#002855] font-bold px-8 py-3 rounded-lg hover:bg-slate-100 transition-colors shadow-lg"
            >
              Solicitar proposta
            </Link>
            <Link
              href="https://wa.me/5511400000000"
              target="_blank"
              className="flex items-center gap-2 border-2 border-white text-white font-bold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CONTATO ===== */}
      <section id="contato" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16">
          <div>
            <span className="text-[#00b4d8] text-sm font-bold uppercase tracking-widest">Fale conosco</span>
            <h2 className="text-3xl font-extrabold text-[#002855] mt-2 mb-4">
              Entre em contato com nossa equipe
            </h2>
            <p className="text-slate-500 mb-8">
              Atendemos empresas de todos os portes. Nossa equipe está pronta para apresentar a melhor solução para o seu negócio.
            </p>

            <div className="space-y-4">
              {[
                { icon: Phone, label: 'Telefone', value: '(11) 4000-0000' },
                { icon: Mail, label: 'E-mail', value: 'contato@aptusclin.com.br' },
                { icon: MapPin, label: 'Endereço', value: 'São Paulo – SP' },
                { icon: Clock, label: 'Horário', value: 'Seg–Sex: 07h às 18h' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200">
                  <div className="w-10 h-10 bg-[#002855]/10 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#002855]" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="text-sm font-semibold text-slate-800">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <h3 className="text-xl font-bold text-[#002855] mb-6">Solicite um orçamento</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Nome</label>
                  <input type="text" placeholder="Seu nome" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Empresa</label>
                  <input type="text" placeholder="Razão social" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">E-mail corporativo</label>
                <input type="email" placeholder="email@empresa.com.br" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Telefone</label>
                <input type="tel" placeholder="(11) 9 0000-0000" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Mensagem</label>
                <textarea rows={4} placeholder="Descreva sua necessidade..." className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent resize-none" />
              </div>
              <button className="w-full bg-[#002855] hover:bg-[#001a3d] text-white font-bold py-3 rounded-lg transition-colors">
                Enviar mensagem
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#071224] text-white">
        <div className="max-w-7xl mx-auto px-4 py-14 grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-[#00b4d8] rounded-xl flex items-center justify-center">
                <HeartPulse className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-extrabold text-white">Aptusclin</p>
                <p className="text-[#00b4d8] text-[10px] font-semibold uppercase tracking-widest">Medicina Ocupacional</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Referência em medicina ocupacional, cuidando da saúde dos seus colaboradores com excelência e responsabilidade.
            </p>
          </div>

          <div>
            <p className="font-bold text-white mb-4 text-sm">Serviços</p>
            <ul className="space-y-2 text-slate-400 text-sm">
              {['Exames Ocupacionais', 'Exames Clínicos', 'Check-up Executivo', 'Atendimento In-Company', 'PPRA e PCMSO'].map((s) => (
                <li key={s}>
                  <Link href="#servicos" className="hover:text-[#00b4d8] transition-colors flex items-center gap-1.5">
                    <ChevronRight className="w-3 h-3" /> {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-bold text-white mb-4 text-sm">Contato</p>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li className="flex items-start gap-2"><Phone className="w-4 h-4 text-[#00b4d8] mt-0.5 flex-shrink-0" />(11) 4000-0000</li>
              <li className="flex items-start gap-2"><Mail className="w-4 h-4 text-[#00b4d8] mt-0.5 flex-shrink-0" />contato@aptusclin.com.br</li>
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 text-[#00b4d8] mt-0.5 flex-shrink-0" />São Paulo – SP</li>
              <li className="flex items-start gap-2"><Clock className="w-4 h-4 text-[#00b4d8] mt-0.5 flex-shrink-0" />Seg–Sex: 07h às 18h</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-5 flex flex-wrap items-center justify-between gap-4">
            <p className="text-slate-500 text-xs">© 2025 Aptusclin – Medicina Ocupacional. Todos os direitos reservados.</p>
            <Link href="/login" className="text-[#00b4d8] hover:underline text-xs font-semibold flex items-center gap-1">
              🔒 Portal do Cliente
            </Link>
          </div>
        </div>
      </footer>

      {/* ===== WhatsApp FLOAT ===== */}
      <a
        href="https://wa.me/5511400000000"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#20b858] text-white rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110"
        aria-label="WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
      </a>
    </div>
  )
}
