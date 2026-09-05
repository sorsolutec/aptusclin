'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  MapPin, Phone, Mail, CalendarDays, FileText, Shield,
  Activity, ChevronLeft, ChevronRight, Settings,
  MessageSquare, Clock
} from 'lucide-react';
import { Instagram, Facebook } from '@/components/icons/SocialIcons';
import { tenantConfig } from '@/lib/tenant';

interface Slide { url: string; caption?: string }

interface Unidade {
  id: string;
  nome: string;
  cidade: string;
  estado: string;
  endereco: string;
  telefone: string;
  telefoneFixo?: string;
  email: string;
  descricao: string;
  slides: Slide[];
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
  horario?: string;
}

const SERVICES = [
  { icon: FileText, title: 'Exames Ocupacionais', desc: 'ASO admissional, periódico, demissional e retorno ao trabalho.' },
  { icon: Activity, title: 'Exames Clínicos', desc: 'Amplo portfólio laboratorial e funcional para saúde preventiva.' },
  { icon: Shield, title: 'Programas de SST', desc: 'PGR, PCMSO, LTCAT e eSocial em conformidade legal.' },
];

function SlideShow({ slides }: { slides: Slide[] }) {
  const [idx, setIdx] = useState(0);

  if (!slides || slides.length === 0) {
    return (
      <div className="w-full h-72 md:h-96 bg-gradient-to-br from-[#002855] to-[#0b3c7d] flex items-center justify-center">
        <p className="text-white/40 text-sm">Adicione fotos no painel administrativo</p>
      </div>
    );
  }

  const prev = () => setIdx((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIdx((i) => (i + 1) % slides.length);

  return (
    <div className="relative w-full h-72 md:h-[420px] overflow-hidden bg-slate-900">
      <Image
        src={slides[idx].url}
        alt={slides[idx].caption ?? `Slide ${idx + 1}`}
        fill
        className="w-full h-full object-cover transition-opacity duration-500"
      />
      {slides[idx].caption && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-6 py-4">
          <p className="text-white text-sm font-medium">{slides[idx].caption}</p>
        </div>
      )}
      {slides.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition">
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`w-2 h-2 rounded-full transition ${i === idx ? 'bg-white' : 'bg-white/40'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function UnitHomePage({ companyId }: { companyId: string }) {
  const [unidade, setUnidade] = useState<Unidade | null>(null);

  const fallback = tenantConfig[companyId];

  useEffect(() => {
    fetch(`/api/unidades/${companyId}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => setUnidade(data))
      .catch(() => {});
  }, [companyId]);

  const data: Unidade = {
    ...fallback,
    ...unidade,
    slides: (unidade?.slides && unidade.slides.length > 0) ? unidade.slides : (fallback?.slides ?? []),
    instagram: unidade?.instagram || fallback?.instagram,
    whatsapp: unidade?.whatsapp || fallback?.whatsapp,
    facebook: unidade?.facebook || fallback?.facebook,
    horario: (unidade as unknown as { horario?: string })?.horario || fallback?.horario,
    telefoneFixo: fallback?.telefoneFixo,
    telefone: unidade?.telefone || fallback?.telefone || '',
    email: unidade?.email || fallback?.email || '',
    endereco: unidade?.endereco || fallback?.endereco || '',
    descricao: unidade?.descricao || fallback?.descricao || '',
    nome: unidade?.nome || fallback?.nome || '',
    cidade: unidade?.cidade || fallback?.cidade || '',
    estado: unidade?.estado || fallback?.estado || '',
    id: unidade?.id || fallback?.id || companyId,
  };
  if (!data.id) return null;

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Aptusclin</p>
            <h1 className="text-lg font-bold text-[#002855] leading-tight">{data.nome}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/portal/agenda"
              className="bg-[#002855] text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-[#001a3d] transition"
            >
              <CalendarDays className="w-4 h-4 inline-block mr-1 -mt-0.5" />
              Agendar
            </Link>
          </div>
        </div>
      </header>

      {/* SLIDESHOW */}
      <SlideShow slides={(data.slides) ?? []} />

      {/* HERO TEXT */}
      <section className="bg-[#002855] py-10 px-4 text-center">
        <p className="text-sm text-blue-200 font-semibold uppercase tracking-widest mb-2">
          Medicina Ocupacional
        </p>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">{data.nome}</h2>
        {data.descricao && (
          <p className="text-slate-300 max-w-xl mx-auto text-sm md:text-base">{data.descricao}</p>
        )}

        {/* BOTÕES CTA */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
          <Link
            href="/portal/exames"
            className="inline-flex items-center justify-center gap-2 bg-[#1B8B3A] hover:bg-[#166b2d] text-white font-bold px-8 py-4 rounded-xl text-base shadow-lg transition"
          >
            <FileText className="w-5 h-5" />
            Resultados de Exames
          </Link>
          <Link
            href="/portal/agenda"
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl text-base transition"
          >
            <CalendarDays className="w-5 h-5" />
            Agendar Exame
          </Link>
        </div>
      </section>

      {/* SERVIÇOS */}
      <section className="py-14 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-extrabold text-center text-[#002855] mb-8">Nossos Serviços</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {SERVICES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-[#002855]/10 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-[#002855]" />
                </div>
                <h3 className="font-bold text-[#002855] mb-2">{title}</h3>
                <p className="text-slate-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTATO */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-extrabold text-center text-[#002855] mb-8">Onde Estamos</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
            {data.endereco && (
              <div className="bg-slate-50 rounded-xl p-6 flex flex-col justify-between">
                <div>
                  <MapPin className="w-7 h-7 text-[#002855] mx-auto mb-3" />
                  <p className="text-sm font-semibold text-[#002855]">Endereço</p>
                </div>
                <p className="text-slate-600 text-sm mt-2">{data.endereco}</p>
              </div>
            )}
            {data.telefone && (
              <a href={`tel:${data.telefone}`} className="bg-slate-50 rounded-xl p-6 hover:bg-slate-100 transition flex flex-col justify-between">
                <div>
                  <Phone className="w-7 h-7 text-[#002855] mx-auto mb-3" />
                  <p className="text-sm font-semibold text-[#002855]">Telefone</p>
                </div>
                <div className="text-slate-600 text-sm mt-2 space-y-1">
                  <p>{data.telefone}</p>
                  {data.telefoneFixo && <p className="text-xs text-slate-400">Fixo: {data.telefoneFixo}</p>}
                </div>
              </a>
            )}
            {data.horario && (
              <div className="bg-slate-50 rounded-xl p-6 flex flex-col justify-between">
                <div>
                  <Clock className="w-7 h-7 text-[#002855] mx-auto mb-3" />
                  <p className="text-sm font-semibold text-[#002855]">Horário de Atendimento</p>
                </div>
                <p className="text-slate-600 text-sm mt-2">{data.horario}</p>
              </div>
            )}
            {data.email && (
              <a href={`mailto:${data.email}`} className="bg-slate-50 rounded-xl p-6 hover:bg-slate-100 transition flex flex-col justify-between">
                <div>
                  <Mail className="w-7 h-7 text-[#002855] mx-auto mb-3" />
                  <p className="text-sm font-semibold text-[#002855]">E-mail</p>
                </div>
                <p className="text-slate-600 text-sm mt-2">{data.email}</p>
              </a>
            )}
            {(data.instagram || data.facebook || data.whatsapp) ? (
              <div className="bg-slate-50 rounded-xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-center gap-1 mb-3.5">
                    <span className="w-2 h-2 rounded-full bg-[#1B8B3A]" />
                    <span className="w-2 h-2 rounded-full bg-[#002855]" />
                  </div>
                  <p className="text-sm font-semibold text-[#002855]">Redes Sociais</p>
                </div>
                <div className="flex justify-center gap-3.5 mt-4">
                  {data.instagram && (
                    <a
                      href={data.instagram.startsWith('http') ? data.instagram : `https://instagram.com/${data.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-600 flex items-center justify-center transition"
                      title="Instagram"
                    >
                      <Instagram className="w-4.5 h-4.5" />
                    </a>
                  )}
                  {data.facebook && (
                    <a
                      href={data.facebook.startsWith('http') ? data.facebook : `https://facebook.com/${data.facebook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition"
                      title="Facebook"
                    >
                      <Facebook className="w-4.5 h-4.5" />
                    </a>
                  )}
                  {data.whatsapp && (
                    <a
                      href={`https://wa.me/${data.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center transition"
                      title="WhatsApp"
                    >
                      <MessageSquare className="w-4.5 h-4.5" />
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-center gap-1 mb-3.5">
                    <span className="w-2 h-2 rounded-full bg-slate-300" />
                    <span className="w-2 h-2 rounded-full bg-slate-300" />
                  </div>
                  <p className="text-sm font-semibold text-[#002855]">Redes Sociais</p>
                </div>
                <p className="text-slate-400 text-xs mt-2">Nenhuma rede cadastrada</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#071224] text-white py-8 px-4 text-center">
        <p className="text-slate-400 text-sm">© {new Date().getFullYear()} {data.nome} – Todos os direitos reservados.</p>
        <div className="mt-3 flex justify-center gap-4">
          <Link href="/portal/exames" className="text-xs text-slate-400 hover:text-white transition flex items-center gap-1">
            <FileText className="w-3 h-3" /> Resultados
          </Link>
          <Link href="/portal/agenda" className="text-xs text-slate-400 hover:text-white transition flex items-center gap-1">
            <CalendarDays className="w-3 h-3" /> Agenda
          </Link>
          <Link href="/admin/unidades" className="text-xs text-slate-400 hover:text-white transition flex items-center gap-1">
            <Settings className="w-3 h-3" /> Admin
          </Link>
        </div>
      </footer>
    </div>
  );
}
