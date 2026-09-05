'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin, Phone, Mail, Clock, Shield, Activity, FileText, CheckCircle2,
  CalendarDays, ExternalLink, MessageSquare, ChevronDown, ChevronUp,
  Award, Building2, Stethoscope, Users, ArrowRight, Sparkles,
  Search, FileCheck, ClipboardList, Info, AlertTriangle, Navigation
} from 'lucide-react';
import { Instagram } from '@/components/icons/SocialIcons';
import { Logo } from '@/components/ui/logo';

export interface SorrisoUnitPageProps {
  initialData?: {
    nome?: string;
    endereco?: string;
    telefone?: string;
    telefoneFixo?: string;
    email?: string;
    horario?: string;
    cnpj?: string;
    cnes?: string;
    whatsapp?: string;
    instagram?: string;
    slides?: { url: string; caption?: string }[];
  };
}

export default function SorrisoUnitPage({ initialData }: SorrisoUnitPageProps) {
  // Dados oficiais e consolidados da unidade Sorriso
  const info = {
    nome: initialData?.nome || 'Aptus Clin - Medicina do Trabalho - Unidade Sorriso',
    razaoSocial: 'Aptus Clin Medicina do Trabalho Sorriso Ltda',
    cnpj: initialData?.cnpj || '57.132.028/0001-08',
    cnes: initialData?.cnes || '4918606',
    endereco: initialData?.endereco || 'Rua Mato Grosso, 2859 – Centro-Sul, Sorriso – MT, CEP 78.896-013',
    cidade: 'Sorriso',
    estado: 'MT',
    telefone: initialData?.telefone || '(66) 99644-0425',
    telefoneFixo: initialData?.telefoneFixo || '(66) 3544-0000',
    whatsappRaw: initialData?.whatsapp || '5566996440425',
    email: initialData?.email || 'sorriso@aptusclin.com.br',
    horario: initialData?.horario || 'Segunda a Sexta: 07:00–11:00, 13:00–17:00',
    instagram: initialData?.instagram || '@aptusclin_sorriso',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Rua+Mato+Grosso+2859+Centro+Sul+Sorriso+MT',
    wazeUrl: 'https://waze.com/ul?q=Rua+Mato+Grosso+2859+Sorriso+MT',
  };

  const whatsappLink = `https://wa.me/${info.whatsappRaw.replace(/\D/g, '')}?text=${encodeURIComponent(
    'Olá! Gostaria de informações sobre agendamento de exames ocupacionais na unidade Aptus Clin de Sorriso.'
  )}`;

  // Estado do formulário de cotação corporativa
  const [quoteForm, setQuoteForm] = useState({
    empresa: '',
    responsavel: '',
    telefone: '',
    vidas: '1 a 10 colaboradores',
    servico: 'PCMSO e PGR Completo',
  });

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Olá, vim pelo site da Aptus Clin Sorriso solicitar proposta corporativa:%0A%0A*Empresa:* ${encodeURIComponent(quoteForm.empresa)}%0A*Responsável:* ${encodeURIComponent(quoteForm.responsavel)}%0A*Telefone/WhatsApp:* ${encodeURIComponent(quoteForm.telefone)}%0A*Número de Colaboradores:* ${encodeURIComponent(quoteForm.vidas)}%0A*Interesse:* ${encodeURIComponent(quoteForm.servico)}`;
    window.open(`https://wa.me/${info.whatsappRaw.replace(/\D/g, '')}?text=${msg}`, '_blank');
  };

  // Estado do FAQ interativo
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Qual o horário ideal para a realização dos exames admissionais em Sorriso?',
      a: 'Recomendamos o comparecimento pela manhã, das 07:00 às 09:00, especialmente se houver necessidade de exames complementares de sangue (que requerem jejum prévio) e audiometria ocupacional. A unidade funciona das 07:00 às 11:00 e das 13:00 às 17:00.',
    },
    {
      q: 'Como funciona o envio dos eventos de SST ao eSocial (S-2210, S-2220 e S-2240)?',
      a: 'Nossa equipe técnica gera e envia os eventos de Saúde e Segurança do Trabalho diretamente ao portal do eSocial por meio de integração via procuração eletrônica ou exportação de arquivos XML validados para o sistema de folha de pagamento da sua empresa.',
    },
    {
      q: 'Quais documentos o colaborador deve levar no dia do exame?',
      a: 'O colaborador deve apresentar documento original com foto (RG ou CNH), CPF e a Guia de Encaminhamento da Empresa constando a função, setor e riscos ocupacionais mapeados.',
    },
    {
      q: 'A unidade de Sorriso realiza exames complementares no próprio local?',
      a: 'Sim! Realizamos audiometria em cabine acústica calibrada, espirometria (prova de função pulmonar), eletrocardiograma (ECG), eletroencefalograma (EEG), acuidade visual e coleta de exames laboratoriais e toxicológicos na própria clínica, sem necessidade de deslocamento.',
    },
    {
      q: 'Vocês elaboram laudos como PGR, PCMSO e LTCAT para empresas do agronegócio e armazéns?',
      a: 'Sim. Contamos com médicos do trabalho e engenheiros de segurança do trabalho especializados na realidade do agro de Sorriso (silos, defensivos, transporte pesado, máquinas agrícolas e agroindústrias), com total rigor técnico nas NRs 01, 07, 15, 16, 17 e 31.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-700 selection:bg-emerald-500 selection:text-white">
      {/* ── 1. BARRA SUPERIOR DE CONFORMIDADE E CONTATOS OFICIAIS ── */}
      <div className="bg-[#001f3f] text-slate-200 py-2 px-4 text-xs font-medium border-b border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
              <Shield className="w-3.5 h-3.5" /> CNPJ: {info.cnpj}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-300">CNES: {info.cnes}</span>
            <span className="text-slate-400">•</span>
            <span className="text-blue-200">Sorriso – MT</span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <a
              href={`tel:${info.telefoneFixo.replace(/\D/g, '')}`}
              className="hover:text-white transition flex items-center gap-1"
            >
              <Phone className="w-3.5 h-3.5 text-blue-300" /> {info.telefoneFixo}
            </a>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-300 transition flex items-center gap-1 font-semibold text-emerald-400"
            >
              <MessageSquare className="w-3.5 h-3.5" /> WhatsApp: {info.telefone}
            </a>
          </div>
        </div>
      </div>

      {/* ── 2. NAVBAR PRINCIPAL ── */}
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-sm border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="scale-90 origin-left" />
            </Link>
            <div className="hidden sm:block pl-3 border-l border-slate-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block leading-tight">
                Unidade
              </span>
              <span className="text-xs font-black text-[#002855] tracking-tight">
                Sorriso – MT
              </span>
            </div>
          </div>

          {/* Links e CTAs do Header */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#servicos" className="hover:text-[#002855] transition">Serviços & Exames</a>
            <a href="#esocial" className="hover:text-[#002855] transition">eSocial SST</a>
            <a href="#orientacoes" className="hover:text-[#002855] transition">Preparo para Exames</a>
            <a href="#localizacao" className="hover:text-[#002855] transition">Localização</a>
            <a href="#proposta" className="hover:text-[#002855] transition">Empresas / RH</a>
          </nav>

          <div className="flex items-center gap-2.5">
            <Link
              href="/resultados"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-[#002855] bg-slate-100 hover:bg-slate-200 transition"
            >
              <FileText className="w-3.5 h-3.5 text-[#002855]" />
              Resultados
            </Link>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1B8B3A] hover:bg-[#15732f] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Agendar no WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      {/* ── 3. HERO SECTION COM IDENTIDADE VISUAL DE ALTO IMPACTO ── */}
      <section className="relative bg-gradient-to-b from-[#002855] via-[#002244] to-[#041a30] text-white pt-14 pb-20 px-4 overflow-hidden">
        {/* Elementos decorativos de fundo */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 grid lg:grid-cols-12 gap-12 items-center">
          {/* Lado Esquerdo: Mensagem Principal */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold mb-5 tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Unidade Especializada em Sorriso – MT</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white">
              Medicina do Trabalho e SST com <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Agilidade e Segurança</span> para sua Empresa.
            </h1>

            <p className="text-slate-300 text-sm sm:text-base mt-4 max-w-xl leading-relaxed">
              Atendimento ágil em exames admissionais, periódicos e demissionais, emissão célere de ASO, laudos técnicos (PGR, PCMSO, LTCAT) e envio automatizado dos eventos de SST ao eSocial.
            </p>

            {/* CTAs do Hero */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black px-6 py-3.5 rounded-xl text-sm shadow-xl shadow-emerald-950/30 transition transform hover:-translate-y-0.5 active:scale-95"
              >
                <MessageSquare className="w-4 h-4 fill-slate-950 text-slate-950" />
                Agendar Exame na Unidade
              </a>

              <Link
                href="/resultados"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold px-6 py-3.5 rounded-xl text-sm transition"
              >
                <FileCheck className="w-4 h-4 text-emerald-400" />
                Consultar Resultados
              </Link>
            </div>

            {/* Badges de Destaque / Dores do Cliente */}
            <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-3 gap-3 text-left">
              <div>
                <span className="text-xs font-extrabold text-emerald-400 block">07:00 às 11:00</span>
                <span className="text-[11px] text-slate-300">Início matutino para jejum e exames</span>
              </div>
              <div>
                <span className="text-xs font-extrabold text-teal-300 block">ASO no Dia</span>
                <span className="text-[11px] text-slate-300">Agilidade para contratação urgente</span>
              </div>
              <div>
                <span className="text-xs font-extrabold text-emerald-400 block">100% eSocial</span>
                <span className="text-[11px] text-slate-300">S-2210, S-2220 e S-2240 integrados</span>
              </div>
            </div>
          </div>

          {/* Lado Direito: Card Flutuante de Contato & Localização da Unidade */}
          <div className="lg:col-span-5">
            <div className="bg-white text-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">
                    Atendimento Presencial
                  </span>
                  <h3 className="text-lg font-black text-[#002855]">Unidade Sorriso</h3>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-[#002855]/5 text-[#002855] flex items-center justify-center font-bold">
                  <Stethoscope className="w-5 h-5 text-[#002855]" />
                </div>
              </div>

              {/* Informações detalhadas */}
              <div className="mt-5 space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 text-[#002855] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Endereço:</p>
                    <p className="text-slate-600 leading-snug">{info.endereco}</p>
                    <div className="flex gap-2 mt-2">
                      <a
                        href={info.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#002855] hover:underline"
                      >
                        <Navigation className="w-3 h-3 text-emerald-600" /> Google Maps
                      </a>
                      <span className="text-slate-300">•</span>
                      <a
                        href={info.wazeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline"
                      >
                        Waze
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 text-[#002855] flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Horário de Funcionamento:</p>
                    <p className="text-slate-600 font-medium">{info.horario}</p>
                    <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                      Coleta matutina a partir das 07h
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 text-[#002855] flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Telefones Diretos:</p>
                    <p className="text-slate-700 font-medium">WhatsApp: {info.telefone}</p>
                    <p className="text-slate-500 text-xs">Fixo: {info.telefoneFixo}</p>
                  </div>
                </div>
              </div>

              {/* Botão de Rota Rápida */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-2">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#1B8B3A] hover:bg-[#15732f] text-white font-bold py-3 rounded-xl text-center text-xs transition flex items-center justify-center gap-2 shadow"
                >
                  <MessageSquare className="w-4 h-4" /> Falar com Atendente em Sorriso
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. GRADE DE SERVIÇOS & EXAMES OCUPACIONAIS ── */}
      <section id="servicos" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-black uppercase tracking-widest text-[#1B8B3A] bg-emerald-50 px-3 py-1 rounded-full">
              Portfólio Completo de SST
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#002855] mt-3">
              Soluções Integradas em Medicina do Trabalho
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              Estrutura moderna e equipe qualificada para atender a todos os requisitos das Normas Regulamentadoras (NRs) vigentes no Ministério do Trabalho.
            </p>
          </div>

          {/* Categorias de Serviços */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Exames Clínicos e ASO */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 hover:shadow-xl hover:border-blue-200 transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#002855] flex items-center justify-center mb-5 group-hover:bg-[#002855] group-hover:text-white transition">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#002855] mb-2">Exames Ocupacionais (ASO)</h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  Avaliação clínica completa realizada por médico examinador qualificado, com emissão do Atestado de Saúde Ocupacional em conformidade com a NR-07.
                </p>
                <ul className="space-y-2 text-xs text-slate-700 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>ASO Admissional:</strong> Liberação célere para novas contratações</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>ASO Periódico:</strong> Monitoramento contínuo da saúde ocupacional</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>ASO Demissional:</strong> Resguardo legal para rescisões seguras</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Mudança de Risco / Função:</strong> Transição segura de postos de trabalho</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Retorno ao Trabalho:</strong> Após afastamento por saúde ou licença</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200">
                <a
                  href={whatsappLink}
                  className="text-xs font-bold text-[#002855] flex items-center justify-between hover:text-emerald-600 transition"
                >
                  <span>Agendar ASO em Sorriso</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Card 2: Exames Complementares no Local */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 hover:shadow-xl hover:border-emerald-200 transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#1B8B3A] flex items-center justify-center mb-5 group-hover:bg-[#1B8B3A] group-hover:text-white transition">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#002855] mb-2">Exames Complementares In Loco</h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  Estrutura técnica própria em Sorriso com equipamentos calibrados para a realização imediata dos exames exigidos pelo PCMSO da sua empresa.
                </p>
                <ul className="space-y-2 text-xs text-slate-700 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Audiometria Ocupacional:</strong> Cabine acústica de precisão</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Espirometria:</strong> Prova de função pulmonar para pós e poeiras</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>ECG & EEG:</strong> Eletrocardiograma e eletroencefalograma</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Acuidade Visual:</strong> Avaliação para motoristas e maquinistas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Exames Laboratoriais & Toxicológico:</strong> Rotina CLT e CNH</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200">
                <a
                  href={whatsappLink}
                  className="text-xs font-bold text-[#1B8B3A] flex items-center justify-between hover:text-emerald-700 transition"
                >
                  <span>Consultar Lista de Exames</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Card 3: Laudos e Programas de SST */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 hover:shadow-xl hover:border-blue-200 transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#002855] flex items-center justify-center mb-5 group-hover:bg-[#002855] group-hover:text-white transition">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#002855] mb-2">Programas & Laudos de Engenharia</h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  Documentação técnica completa assinada por especialistas habilitados, blindando a sua organização contra autuações e passivos trabalhistas.
                </p>
                <ul className="space-y-2 text-xs text-slate-700 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>PGR (NR-01):</strong> Programa de Gerenciamento de Riscos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>PCMSO (NR-07):</strong> Controle Médico de Saúde Ocupacional</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>LTCAT:</strong> Laudo das Condições Ambientais de Trabalho</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>AET (NR-17):</strong> Análise Ergonômica do Trabalho</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Insalubridade & Periculosidade:</strong> NRs 15 e 16</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200">
                <a
                  href="#proposta"
                  className="text-xs font-bold text-[#002855] flex items-center justify-between hover:text-emerald-600 transition"
                >
                  <span>Solicitar Elaboração de Laudos</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. SEÇÃO ESOCIAL SST (GESTÃO DESCOMPLICADA) ── */}
      <section id="esocial" className="py-16 px-4 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/40">
                Conformidade Legal Tributária e Previdenciária
              </span>
              <h2 className="text-2xl sm:text-3xl font-black mt-4 leading-tight">
                Gestão e Envio dos Eventos de SST ao eSocial em Sorriso
              </h2>
              <p className="text-slate-300 text-sm mt-3 leading-relaxed">
                Evite multas e inconformidades com a Receita Federal e Ministério do Trabalho. A unidade Aptus Clin Sorriso cuida de toda a cadeia de dados ocupacionais com validação e envio digital seguro.
              </p>

              <div className="mt-6 space-y-3.5">
                <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3.5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center shrink-0">
                    S-2210
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs sm:text-sm">CAT – Comunicação de Acidente de Trabalho</h4>
                    <p className="text-[11px] text-slate-400">Registro oficial tempestivo de acidentes e doenças ocupacionais.</p>
                  </div>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3.5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center shrink-0">
                    S-2220
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs sm:text-sm">Monitoramento da Saúde do Trabalhador</h4>
                    <p className="text-[11px] text-slate-400">Informações detalhadas de todos os ASOs e exames complementares realizados.</p>
                  </div>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3.5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center shrink-0">
                    S-2240
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs sm:text-sm">Condições Ambientais do Trabalho (Agentes Nocivos)</h4>
                    <p className="text-[11px] text-slate-400">Vínculo aos fatores de risco para aposentadoria especial e PPP Eletrônico.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ilustração e Métricas de Tranquilidade */}
            <div className="lg:col-span-6">
              <div className="bg-gradient-to-br from-slate-800 to-slate-850 p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-2xl">
                <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" /> Por que confiar na Aptus Clin Sorriso?
                </h3>
                <div className="mt-4 space-y-4 text-xs sm:text-sm text-slate-300">
                  <p>
                    ✓ <strong>Integração Direta:</strong> Envio via certificado digital diretamente para o ambiente oficial do governo federal.
                  </p>
                  <p>
                    ✓ <strong>Geração de XML:</strong> Compatível com qualquer software de contabilidade e folha de pagamento da região.
                  </p>
                  <p>
                    ✓ <strong>Auditoria de Dados:</strong> Validação de inconsistências de CBO, CPF e riscos antes do disparo.
                  </p>
                  <p>
                    ✓ <strong>Atendimento ao Agronegócio:</strong> Expertise com fazendas, armazéns, transportadoras e fornecedores de insumos de Sorriso.
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-700 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-slate-400">Dúvidas sobre o eSocial?</p>
                    <p className="text-xs font-bold text-white">Fale com nosso setor técnico</p>
                  </div>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition"
                  >
                    Tirar Dúvidas
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. GUIA DE ORIENTAÇÕES PARA O DIA DO EXAME (PREPARO) ── */}
      <section id="orientacoes" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-[#002855] bg-blue-50 px-3 py-1 rounded-full">
              Instruções Úteis
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#002855] mt-3">
              Orientações para o Dia do Exame
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              Compartilhe com seus colaboradores para agilizar o atendimento na unidade de Sorriso e evitar remarcações.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-3">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1.5">Jejum Laboratorial</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Para exames de sangue (glicemia, lipidograma), é necessário jejum de 8 a 12 horas. Água pode ser consumida moderadamente.
                </p>
              </div>
              <span className="text-[11px] font-bold text-amber-700 mt-4 block">Atendimento matutino: 07h</span>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-3">
                  <Activity className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1.5">Audiometria</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Exige repouso auditivo obrigatório de no mínimo 14 horas (evitar uso de fones de ouvido, trânsito ruidoso e som automotivo alto antes do teste).
                </p>
              </div>
              <span className="text-[11px] font-bold text-blue-700 mt-4 block">Repouso de 14h</span>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-3">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1.5">Acuidade Visual</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Caso utilize óculos de grau ou lentes de contato corretivas, é indispensável trazê-los para o teste de visão.
                </p>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 mt-4 block">Levar óculos/lentes</span>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold mb-3">
                  <FileText className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1.5">Documentos</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Apresentar documento de identificação original com foto (RG, CNH) e a guia de encaminhamento da empresa com os riscos listados.
                </p>
              </div>
              <span className="text-[11px] font-bold text-purple-700 mt-4 block">Documento com foto</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. SEÇÃO DE LOCALIZAÇÃO INTERATIVA & CONTATO ── */}
      <section id="localizacao" className="py-16 px-4 bg-slate-50 border-t border-slate-200/60">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <span className="text-xs font-black uppercase tracking-widest text-[#1B8B3A]">
                Facilidade de Acesso
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#002855] mt-2">
                Onde Fica a Unidade de Sorriso
              </h2>
              <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                Localização privilegiada no Centro-Sul de Sorriso, de fácil acesso para trabalhadores e frotas de empresas de toda a região metropolitana e rodovias de ligação.
              </p>

              <div className="mt-6 space-y-4 text-xs sm:text-sm">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <p className="font-bold text-[#002855] flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" /> Endereço Completo:
                  </p>
                  <p className="text-slate-700 mt-1">{info.endereco}</p>
                  <p className="text-slate-400 text-xs mt-0.5">Bairro Centro-Sul • CEP 78.896-013</p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <p className="font-bold text-[#002855] flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600" /> Horários de Atendimento:
                  </p>
                  <p className="text-slate-700 mt-1">{info.horario}</p>
                  <p className="text-xs text-emerald-600 font-semibold mt-0.5">
                    Plantão para agendamentos via WhatsApp
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <p className="font-bold text-[#002855] flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-600" /> Canais Telefônicos:
                  </p>
                  <p className="text-slate-700 mt-1">
                    WhatsApp: <strong>{info.telefone}</strong> | Fixo: <strong>{info.telefoneFixo}</strong>
                  </p>
                  <p className="text-slate-500 text-xs mt-0.5">E-mail: {info.email}</p>
                </div>
              </div>

              {/* Botões de Direção */}
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={info.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#002855] hover:bg-[#001c3d] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Abrir no Google Maps
                </a>
                <a
                  href={info.wazeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow"
                >
                  Traçar Rota no Waze
                </a>
              </div>
            </div>

            {/* Mapa Ilustrativo / Representação Visual Interativa */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-[#002855] to-[#04336c] p-4 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-xs sm:text-sm">Rua Mato Grosso, 2859 – Centro-Sul</span>
                  </div>
                  <span className="text-[11px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                    Sorriso – MT
                  </span>
                </div>

                {/* Iframe de Mapa Seguro com Localização de Sorriso */}
                <div className="relative w-full h-80 sm:h-96 bg-slate-100">
                  <iframe
                    title="Mapa Aptus Clin Sorriso"
                    width="100%"
                    height="100%"
                    className="border-0"
                    loading="lazy"
                    allowFullScreen
                    src="https://maps.google.com/maps?q=Rua+Mato+Grosso+2859+Sorriso+MT&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  />
                </div>

                <div className="p-4 bg-slate-50 flex flex-wrap items-center justify-between text-xs text-slate-500">
                  <span>Próximo a vias arteriais e fácil estacionamento</span>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 font-bold hover:underline"
                  >
                    Dúvidas de como chegar? Fale no WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. FORMULÁRIO DE PROPOSTA CORPORATIVA PARA EMPRESAS & RH ── */}
      <section id="proposta" className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#002855] to-[#052b57] text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="text-center max-w-xl mx-auto mb-8 relative z-10">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-300">
                Atendimento B2B & Corporativo
              </span>
              <h2 className="text-2xl sm:text-3xl font-black mt-2">
                Solicite uma Proposta para a sua Empresa
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm mt-2">
                Gestão de saúde ocupacional sob medida para o tamanho da sua equipe. Receba contato imediato da equipe de Sorriso.
              </p>
            </div>

            <form onSubmit={handleQuoteSubmit} className="space-y-4 relative z-10 max-w-2xl mx-auto text-slate-800 text-xs sm:text-sm">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-bold mb-1">Nome da Empresa</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Fazenda / Empresa Ltda"
                    value={quoteForm.empresa}
                    onChange={(e) => setQuoteForm({ ...quoteForm, empresa: e.target.value })}
                    className="w-full bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-white font-bold mb-1">Nome do Responsável / RH</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Maria da Silva"
                    value={quoteForm.responsavel}
                    onChange={(e) => setQuoteForm({ ...quoteForm, responsavel: e.target.value })}
                    className="w-full bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-bold mb-1">WhatsApp / Telefone para Contato</label>
                  <input
                    type="tel"
                    required
                    placeholder="(66) 90000-0000"
                    value={quoteForm.telefone}
                    onChange={(e) => setQuoteForm({ ...quoteForm, telefone: e.target.value })}
                    className="w-full bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-white font-bold mb-1">Número de Colaboradores</label>
                  <select
                    value={quoteForm.vidas}
                    onChange={(e) => setQuoteForm({ ...quoteForm, vidas: e.target.value })}
                    className="w-full bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-medium"
                  >
                    <option>1 a 10 colaboradores</option>
                    <option>11 a 50 colaboradores</option>
                    <option>51 a 200 colaboradores</option>
                    <option>Mais de 200 colaboradores</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white font-bold mb-1">Serviço Principal de Interesse</label>
                <select
                  value={quoteForm.servico}
                  onChange={(e) => setQuoteForm({ ...quoteForm, servico: e.target.value })}
                  className="w-full bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-medium"
                >
                  <option>PCMSO e PGR Completo (com eSocial)</option>
                  <option>Exames Admissionais / Periódicos em Lote</option>
                  <option>LTCAT e Laudos Técnicos de Engenharia</option>
                  <option>Exames Complementares (Audiometria, ECG, Espiro)</option>
                  <option>Consultoria Geral de Saúde Ocupacional</option>
                </select>
              </div>

              <div className="pt-3 text-center">
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black px-8 py-3.5 rounded-xl text-sm shadow-xl transition transform hover:-translate-y-0.5 active:scale-95 inline-flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Enviar Solicitação via WhatsApp Oficial
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ── 9. PERGUNTAS FREQUENTES (FAQ) ── */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-[#002855]">
              Esclareça suas Dúvidas
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#002855] mt-2">
              Perguntas Frequentes sobre Medicina do Trabalho
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm transition"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50/60 transition"
                  >
                    <span className="font-bold text-slate-800 text-xs sm:text-sm">{item.q}</span>
                    <span className="text-slate-400 shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 text-xs sm:text-sm text-slate-600 border-t border-slate-100 bg-slate-50/40 leading-relaxed">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 10. RODAPÉ INSTITUCIONAL & CREDENCIAIS ── */}
      <footer className="bg-[#00172e] text-slate-300 py-12 px-4 border-t border-white/5 text-xs">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <Logo className="scale-90 origin-left" />
            <p className="text-slate-400 mt-3 leading-relaxed">
              Referência regional em Medicina Ocupacional, Engenharia de Segurança e Gestão de eSocial no Médio-Norte de Mato Grosso.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="https://instagram.com/aptusclin_sorriso"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-pink-400 flex items-center justify-center transition"
                title="Instagram da Unidade Sorriso"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-emerald-400 flex items-center justify-center transition"
                title="WhatsApp Oficial"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-black text-white uppercase tracking-wider text-xs mb-3">Unidade Sorriso – MT</h4>
            <p className="text-slate-300 leading-snug">{info.endereco}</p>
            <p className="mt-2 text-slate-400">CNPJ: {info.cnpj}</p>
            <p className="text-slate-400">CNES: {info.cnes}</p>
          </div>

          <div>
            <h4 className="font-black text-white uppercase tracking-wider text-xs mb-3">Horário & Contatos</h4>
            <p className="text-slate-300">{info.horario}</p>
            <p className="mt-2 text-slate-300">WhatsApp: {info.telefone}</p>
            <p className="text-slate-300">Fixo: {info.telefoneFixo}</p>
            <p className="text-slate-300">E-mail: {info.email}</p>
          </div>

          <div>
            <h4 className="font-black text-white uppercase tracking-wider text-xs mb-3">Acesso Rápido</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/resultados" className="hover:text-white transition">
                  • Consultar Resultados de Exames
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition">
                  • Painel Administrativo
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition">
                  • Portal Geral da Aptusclin
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} {info.razaoSocial}. Todos os direitos reservados.</p>
          <p>Medicina e Segurança do Trabalho • Sorriso – MT</p>
        </div>
      </footer>

      {/* ── 11. BOTÃO FLUTUANTE DE WHATSAPP DIRETO ── */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-50 bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 rounded-full shadow-2xl transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center group"
        title="Falar com a Aptus Clin Sorriso no WhatsApp"
      >
        <MessageSquare className="w-6 h-6 fill-white text-white" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out font-bold text-xs px-0 group-hover:px-2">
          Agendar em Sorriso
        </span>
      </a>
    </div>
  );
}
