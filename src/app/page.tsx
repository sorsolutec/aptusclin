import Link from 'next/link';
import { headers } from 'next/headers';
import {
  HeartPulse,
  Phone,
  Mail,
  MapPin,
  FileText,
  Activity,
  Shield,
  Building2,
  CalendarDays,
  ExternalLink,
  ArrowRight,
  Stethoscope,
  Settings,
} from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { createClient } from '@/utils/supabase/server';
import { tenantConfig } from '@/lib/tenant';

export const metadata = {
  title: 'Aptusclin | Medicina Ocupacional & Saúde do Trabalhador',
  description:
    'Soluções completas em Medicina Ocupacional, Segurança do Trabalho e eSocial. Atendimento em Sorriso, Nova Ubiratã, Boa Esperança do Norte e Nova Mutum.',
};

interface Unidade {
  id: string;
  nome: string;
  cidade: string;
  estado: string;
  descricao: string;
  telefone?: string;
  email?: string;
  slides: { url: string; caption?: string }[];
}

function getUnitUrl(unitId: string, host: string) {
  const cleanHost = host.split(':')[0];
  const port = host.includes(':') ? `:${host.split(':')[1]}` : '';

  if (cleanHost === 'localhost' || cleanHost === '127.0.0.1') {
    return `http://${unitId}.localhost${port}`;
  }

  const parts = cleanHost.split('.');
  let baseDomain = cleanHost;
  // Se for subdomínio (ex: sorriso.aptusclin.com.br), remove a primeira parte
  if (parts.length > 2) {
    baseDomain = parts.slice(-2).join('.');
  }
  return `http://${unitId}.${baseDomain}${port}`;
}

const SERVICES = [
  {
    icon: FileText,
    title: 'Exames Ocupacionais',
    desc: 'ASO admissional, periódico, demissional, mudança de função e retorno ao trabalho.',
  },
  {
    icon: Activity,
    title: 'Exames Clínicos',
    desc: 'Audiometria, espirometria, ECG, EEG, acuidade visual e exames laboratoriais.',
  },
  {
    icon: Shield,
    title: 'Programas de SST',
    desc: 'PGR, PCMSO, LTCAT, laudos ergonômicos e envio dos eventos de eSocial de SST.',
  },
  {
    icon: Building2,
    title: 'Gestão Corporativa',
    desc: 'Controle de absenteísmo, gestão de exames periódicos vencidos e relatórios estatísticos.',
  },
];

export default async function MainLandingPage() {
  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3005';

  const supabase = await createClient();
  let unidades: Unidade[] = [];

  try {
    const { data } = await (supabase as any)
      .from('unidades')
      .select('*')
      .eq('ativo', true);
    if (data && data.length > 0) {
      unidades = data;
    }
  } catch {
    // Silently fallback
  }

  if (unidades.length === 0) {
    unidades = Object.values(tenantConfig).map(u => ({
      id: u.id,
      nome: u.nome,
      cidade: u.cidade,
      estado: u.estado,
      descricao: u.descricao || '',
      telefone: u.telefone,
      email: u.email,
      slides: u.slides || [],
    }));
  }

  // Coleta slides das unidades para preencher o banner principal
  const allSlides = unidades.flatMap(u => u.slides).filter(Boolean);
  const heroSlides = allSlides.length > 0 ? allSlides.slice(0, 5) : [
    { url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80', caption: 'Estrutura moderna para exames ocupacionais' },
    { url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80', caption: 'Atendimento humanizado e focado na saúde do trabalhador' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-700">
      {/* TOP HEADER */}
      <div className="bg-[#002855] text-white py-2 px-4 text-xs font-medium border-b border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>Aptusclin Saúde Ocupacional Integrada</span>
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-[#1B8B3A]" /> (66) 3544-0000
            </span>
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-blue-300" /> contato@aptusclin.com.br
            </span>
          </div>
        </div>
      </div>

      {/* NAVBAR */}
      <header className="bg-white sticky top-0 z-40 shadow-sm border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Logo className="scale-95" />

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              title="Painel Administrativo"
              className="flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 text-slate-500 hover:text-[#002855] hover:bg-slate-50 transition"
            >
              <Settings className="w-4 h-4" />
            </Link>
            <Link
              href="/resultados"
              className="bg-[#1B8B3A] hover:bg-[#166b2d] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-md flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" />
              Resultados de Exames
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION WITH STATIC CAROUSEL & MAIN ACTION */}
      <section className="relative bg-[#002855] py-20 px-4 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />

        <div className="max-w-6xl mx-auto relative z-10 grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 text-center md:text-left text-white">
            <span className="bg-[#1B8B3A]/20 text-[#25D366] text-xs font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider">
              Medicina & Segurança do Trabalho
            </span>
            <h1 className="text-4xl md:text-5xl font-black mt-4 leading-tight">
              Excelência na gestão da saúde ocupacional da sua empresa
            </h1>
            <p className="text-slate-300 text-base md:text-lg mt-4 max-w-xl">
              Simplificamos o PCMSO, PGR, exames ocupacionais e conformidade legal com o eSocial de forma inteligente e integrada.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                href="#unidades"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl text-base transition"
              >
                Nossas Unidades
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="md:col-span-5">
            {/* Visual preview do carrossel no site principal */}
            <div className="bg-slate-950 rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl relative aspect-[4/3]">
              <img
                src={heroSlides[0].url}
                alt="Aptusclin"
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-5 py-4 text-white">
                <p className="text-xs text-blue-300 font-semibold uppercase tracking-widest">Aptusclin</p>
                <p className="text-sm font-bold mt-0.5">{heroSlides[0].caption}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* UNIDADES SECTION (DASHBOARD CHOOSE UNIT) */}
      <section id="unidades" className="py-20 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs text-slate-400 font-extrabold uppercase tracking-widest">Cidades Atendidas</span>
            <h2 className="text-3xl font-extrabold text-[#002855] mt-2">Escolha uma de Nossas Unidades</h2>
            <p className="text-slate-500 mt-2 max-w-lg mx-auto text-sm">
              Cada unidade possui canais próprios de agendamento, atendimento dedicado e telefones de contato locais.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {unidades.map(u => {
              const url = u.id === 'boa-esperanca'
                ? '/unidade/boa-esperanca'
                : getUnitUrl(u.id, host);
              return (
                <div
                  key={u.id}
                  className="bg-white border border-slate-100 rounded-3xl p-6 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div>
                    <div className="w-10 h-10 bg-[#002855]/5 text-[#002855] rounded-2xl flex items-center justify-center mb-4 group-hover:bg-[#002855] group-hover:text-white transition-colors">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-[#002855] text-lg mb-1 leading-snug">{u.nome}</h3>
                    <p className="text-xs text-slate-400 font-medium mb-3">
                      {u.cidade} – {u.estado}
                    </p>
                    <p className="text-slate-500 text-xs line-clamp-3 leading-relaxed">
                      {u.descricao || 'Unidade de medicina ocupacional e segurança do trabalho apta a atender todos os exames admissionais, periódicos e demissionais.'}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-slate-100 pt-4">
                    {u.telefone && (
                      <p className="text-[11px] text-slate-400 mb-2">Tel: {u.telefone}</p>
                    )}
                    <a
                      href={url}
                      className="w-full inline-flex items-center justify-center gap-1.5 bg-[#002855] hover:bg-[#001a3d] text-white text-xs font-bold py-2.5 rounded-xl transition"
                    >
                      Acessar Unidade
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs text-slate-400 font-extrabold uppercase tracking-widest">Soluções</span>
            <h2 className="text-3xl font-extrabold text-[#002855] mt-2">Nossos Serviços</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:shadow-sm transition-shadow">
                <div className="w-10 h-10 bg-[#002855]/10 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-[#002855]" />
                </div>
                <h3 className="font-bold text-[#002855] text-sm mb-2">{title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#071224] text-white py-12 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <Logo className="brightness-0 invert scale-90" />
          <p className="text-slate-400 text-xs">
            © {new Date().getFullYear()} Aptusclin Saúde Ocupacional – Todos os direitos reservados.
          </p>
          <div className="flex gap-4">
            <Link href="/login" className="text-xs text-slate-400 hover:text-white transition">
              Painel Interno
            </Link>
            <Link href="/resultados" className="text-xs text-slate-400 hover:text-white transition">
              Exames
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
