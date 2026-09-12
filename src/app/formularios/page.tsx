'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Building2,
  User,
  FileText,
  MapPin,
  CheckCircle2,
  Printer,
  Share2,
  Copy,
  ArrowRight,
  ArrowLeft,
  Calendar,
  AlertCircle,
  Phone,
  MessageSquare,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { GuiaEncaminhamentoPrint, GuiaData } from '@/components/GuiaEncaminhamentoPrint';

interface UnidadeInfo {
  id: string;
  nome: string;
  cidade: string;
  estado: string;
  endereco: string;
  telefone: string;
  whatsapp: string;
  horario_funcionamento: string;
}

const UNIDADES_DEFAULT: UnidadeInfo[] = [
  {
    id: 'sorriso',
    nome: 'Aptusclin — Sorriso',
    cidade: 'Sorriso',
    estado: 'MT',
    endereco: 'Rua das Videiras, 1047 - Centro Sul',
    telefone: '(66) 3544-0000',
    whatsapp: '66999990000',
    horario_funcionamento: 'Segunda a Sexta: 07:00 às 17:30',
  },
  {
    id: 'nova-mutum',
    nome: 'Aptusclin — Nova Mutum',
    cidade: 'Nova Mutum',
    estado: 'MT',
    endereco: 'Av. das Seriemas, 123 - Centro',
    telefone: '(65) 3308-0000',
    whatsapp: '65999990000',
    horario_funcionamento: 'Segunda a Sexta: 07:00 às 17:30',
  },
  {
    id: 'nova-ubirata',
    nome: 'Aptusclin — Nova Ubiratã',
    cidade: 'Nova Ubiratã',
    estado: 'MT',
    endereco: 'Av. Tancredo Neves, 456 - Centro',
    telefone: '(66) 3567-0000',
    whatsapp: '66999990000',
    horario_funcionamento: 'Segunda a Sexta: 07:30 às 17:00',
  },
  {
    id: 'boa-esperanca',
    nome: 'Aptusclin — Boa Esperança do Norte',
    cidade: 'Boa Esperança do Norte',
    estado: 'MT',
    endereco: 'Av. Brasil, 789 - Centro',
    telefone: '(66) 3545-0000',
    whatsapp: '66999990000',
    horario_funcionamento: 'Segunda a Sexta: 07:30 às 17:00',
  },
];

const TIPOS_EXAME = [
  { id: 'Admissional', label: 'Admissional', desc: 'Para novos colaboradores admitidos' },
  { id: 'Periódico', label: 'Periódico', desc: 'Renovação anual ou bienal obrigatória' },
  { id: 'Demissional', label: 'Demissional', desc: 'Desligamento de funcionário' },
  { id: 'Retorno ao Trabalho', label: 'Retorno ao Trabalho', desc: 'Afastamento previdenciário superior a 30 dias' },
  { id: 'Mudança de Função', label: 'Mudança de Função', desc: 'Alteração de riscos ocupacionais' },
  { id: 'Exames Complementares', label: 'Exames Complementares', desc: 'Somente exames específicos solicitados' },
];

const EXAMES_COMPLEMENTARES_LIST = [
  'Audiometria Ocupacional',
  'Espirometria (Prova de Função Pulmonar)',
  'Eletrocardiograma (ECG)',
  'Eletroencefalograma (EEG)',
  'Acuidade Visual',
  'Raio-X de Tórax Padrão OIT',
  'Exames de Sangue (Hemograma / Glicemia / Lipídico)',
  'Exame Toxicológico',
  'Avaliação Psicossocial',
  'Exame Clínico',
];

// Instruções obrigatórias que serão sempre incluídas no guia
const INSTRUCOES_PADRAO = [
  'Jejum: para exames de sangue, é obrigatório estar em jejum conforme orientação médica.',
  'Documento: é indispensável apresentar documento oficial com foto (RG, CNH ou Passaporte) no momento do atendimento.',
];

function FormulariosContent() {
  const searchParams = useSearchParams();
  const initialUnit = searchParams.get('unidade') || '';

  const [step, setStep] = useState<number>(1);
  const [unidades, setUnidades] = useState<UnidadeInfo[]>(UNIDADES_DEFAULT);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Form State
  const [unidadeId, setUnidadeId] = useState<string>(initialUnit);
  const [empresaNome, setEmpresaNome] = useState<string>('');
  const [empresaCnpj, setEmpresaCnpj] = useState<string>('');
  const [solicitanteNome, setSolicitanteNome] = useState<string>('');
  const [solicitanteEmail, setSolicitanteEmail] = useState<string>('');
  const [solicitanteTelefone, setSolicitanteTelefone] = useState<string>('');

  const [colaboradorNome, setColaboradorNome] = useState<string>('');
  const [colaboradorCpf, setColaboradorCpf] = useState<string>('');
  const [colaboradorCargo, setColaboradorCargo] = useState<string>('');
  const [colaboradorSetor, setColaboradorSetor] = useState<string>('');

  const [tipoExame, setTipoExame] = useState<string>('Admissional');
  const [examesComplementares, setExamesComplementares] = useState<string[]>([]);
  // Instruções adicionais que o usuário pode marcar (já incluímos as padrão como fixas)
  const [instrucoesSelecionadas, setInstrucoesSelecionadas] = useState<string[]>([...INSTRUCOES_PADRAO]);
  const [riscosFuncao, setRiscosFuncao] = useState<string>('');
  const [dataPretendida, setDataPretendida] = useState<string>('');
  const [observacoes, setObservacoes] = useState<string>('');

  // Resultado
  const [resultado, setResultado] = useState<GuiaData | null>(null);

  // Carrega unidades dinâmicas do banco se disponíveis
  useEffect(() => {
    fetch('/api/unidades')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          const mapped: UnidadeInfo[] = data.map((u: any) => ({
            id: u.id,
            nome: u.nome,
            cidade: u.cidade,
            estado: u.estado || 'MT',
            endereco: u.endereco || '',
            telefone: u.telefone || '',
            whatsapp: u.whatsapp || '',
            horario_funcionamento: u.horario_funcionamento || '07:00 às 17:30',
          }));
          setUnidades(mapped);
        }
      })
      .catch(() => {});
  }, []);

  // Se veio pré-selecionado na URL, avança suavemente para a etapa 2
  useEffect(() => {
    if (initialUnit) {
      setUnidadeId(initialUnit);
    }
  }, [initialUnit]);

  const toggleExameComplementar = (exame: string) => {
    if (examesComplementares.includes(exame)) {
      setExamesComplementares(examesComplementares.filter((e) => e !== exame));
    } else {
      setExamesComplementares([...examesComplementares, exame]);
    }
  };

  // As instruções padrão já vêm selecionadas e não podem ser desmarcadas.
  const toggleInstrucao = (instrucao: string) => {
    if (INSTRUCOES_PADRAO.includes(instrucao)) return; // fixa
    if (instrucoesSelecionadas.includes(instrucao)) {
      setInstrucoesSelecionadas(instrucoesSelecionadas.filter((i) => i !== instrucao));
    } else {
      setInstrucoesSelecionadas([...instrucoesSelecionadas, instrucao]);
    }
  };

  const selectedUnidade = unidades.find((u) => u.id === unidadeId) || unidades[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!unidadeId) {
      setErrorMsg('Por favor, selecione a unidade de atendimento.');
      setStep(1);
      return;
    }
    if (!empresaNome || !solicitanteNome || !solicitanteTelefone) {
      setErrorMsg('Preencha os dados de identificação da empresa e do solicitante.');
      setStep(2);
      return;
    }
    if (!colaboradorNome || !colaboradorCpf || !tipoExame) {
      setErrorMsg('Preencha os dados do colaborador e o tipo de exame.');
      setStep(3);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        unidade_id: unidadeId,
        empresa_nome: empresaNome,
        empresa_cnpj: empresaCnpj,
        solicitante_nome: solicitanteNome,
        solicitante_email: solicitanteEmail,
        solicitante_telefone: solicitanteTelefone,
        colaborador_nome: colaboradorNome,
        colaborador_cpf: colaboradorCpf,
        colaborador_cargo: colaboradorCargo,
        colaborador_setor: colaboradorSetor,
        tipo_exame: tipoExame,
        exames_complementares: examesComplementares,
        riscos_funcao: riscosFuncao,
        data_pretendida: dataPretendida || null,
        observacoes: observacoes,
        instrucoes: instrucoesSelecionadas,
      };

      const res = await fetch('/api/solicitacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.message || 'Erro ao enviar solicitação.');
      }

      const guiaData: GuiaData = {
        protocolo: data.protocolo,
        created_at: data.solicitacao?.created_at || new Date().toISOString(),
        empresa_nome: empresaNome,
        empresa_cnpj: empresaCnpj,
        solicitante_nome: solicitanteNome,
        solicitante_telefone: solicitanteTelefone,
        colaborador_nome: colaboradorNome,
        colaborador_cpf: colaboradorCpf,
        colaborador_cargo: colaboradorCargo,
        colaborador_setor: colaboradorSetor,
        tipo_exame: tipoExame,
        exames_complementares: examesComplementares,
        riscos_funcao: riscosFuncao,
        data_pretendida: dataPretendida,
        observacoes: observacoes,
        instrucoes: instrucoesSelecionadas,
        unidade: data.solicitacao?.unidade || selectedUnidade,
      };

      setResultado(guiaData);
      setStep(4);
    } catch (err: any) {
      setErrorMsg(err.message || 'Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyProtocol = () => {
    if (!resultado?.protocolo) return;
    navigator.clipboard.writeText(resultado.protocolo);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const getWhatsAppShareUrl = () => {
    if (!resultado) return '#';
    const text = encodeURIComponent(
      `*GUIA DE ENCAMINHAMENTO DE EXAME OCUPACIONAL — APTUSCLIN*\n\n` +
      `Olá, *${resultado.colaborador_nome}*!\n` +
      `Sua solicitação de *ASO ${resultado.tipo_exame}* foi emitida com sucesso.\n\n` +
      `📋 *Protocolo:* ${resultado.protocolo}\n` +
      `🏢 *Empresa:* ${resultado.empresa_nome}\n` +
      `📍 *Unidade de Atendimento:* ${resultado.unidade?.nome}\n` +
      `📌 *Endereço:* ${resultado.unidade?.endereco || 'Consulte a recepção'}\n` +
      `📞 *Contato:* ${resultado.unidade?.telefone || ''}\n` +
      `⏰ *Horário:* ${resultado.unidade?.horario_funcionamento || 'Seg a Sex das 07h às 17h'}\n\n` +
      `⚠️ *INSTRUÇÕES OBRIGATÓRIAS:*\n` +
      `• *Jejum:* para exames de sangue, é obrigatório estar em jejum conforme orientação médica.\n` +
      `• *Documento:* é indispensável apresentar documento oficial com foto (RG, CNH ou Passaporte) no momento do atendimento.\n\n` +
      `Mais informações em: https://aptusclin.com.br`
    );
    return `https://api.whatsapp.com/send?text=${text}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* NAVBAR PÚBLICA */}
      <nav className="no-print bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-8 w-auto" />
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/resultados"
              className="text-xs font-semibold text-slate-600 hover:text-[#002855] px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
            >
              Resultados de Exames
            </Link>
            <Link
              href="/login"
              className="text-xs font-bold text-white bg-[#002855] hover:bg-[#0b3c7d] px-3.5 py-1.5 rounded-lg transition"
            >
              Acesso Restrito
            </Link>
          </div>
        </div>
      </nav>

      {/* COMPONENTE EXCLUSIVO DE IMPRESSÃO (Folha A4 formatada) */}
      {resultado && <GuiaEncaminhamentoPrint data={resultado} />}

      {/* CONTAINER PRINCIPAL NA TELA */}
      <main className="no-print max-w-4xl mx-auto px-4 py-10">
        {/* HEADER DO FORMULÁRIO */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#002855]/10 text-[#002855] text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4 text-[#1B8B3A]" /> Encaminhamento Digital Ocupacional
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#002855]">
            Solicitação de Exames & ASO
          </h1>
          <p className="text-slate-500 text-sm max-w-xl mx-auto mt-1">
            Encaminhe colaboradores para exames admissionais, periódicos ou demissionais diretamente para as unidades da AptusClin.
          </p>
        </div>

        {/* STEPPER PROGRESS BAR (Oculto se já concluiu) */}
        {step < 4 && (
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-8">
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-medium">
              <button
                type="button"
                onClick={() => setStep(1)}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg transition ${
                  step === 1
                    ? 'bg-[#002855] text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" /> 1. Unidade
              </button>
              <button
                type="button"
                onClick={() => {
                  if (unidadeId) setStep(2);
                }}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg transition ${
                  step === 2
                    ? 'bg-[#002855] text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" /> 2. Empresa & RH
              </button>
              <button
                type="button"
                onClick={() => {
                  if (unidadeId && empresaNome) setStep(3);
                }}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg transition ${
                  step === 3
                    ? 'bg-[#002855] text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <User className="w-3.5 h-3.5" /> 3. Colaborador & Exame
              </button>
            </div>
          </div>
        )}

        {/* ALERTA DE ERRO */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* FORMULÁRIO STEP BY STEP */}
        <form onSubmit={handleSubmit}>
          {/* ETAPA 1: ESCOLHA DA UNIDADE */}
          {step === 1 && (
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-bold text-[#002855] mb-1">
                  1. Selecione a Unidade de Atendimento
                </h2>
                <p className="text-xs text-slate-500">
                  Escolha em qual de nossas clínicas físicas o colaborador realizará os exames médicos.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {unidades.map((u) => {
                  const isSelected = unidadeId === u.id;
                  return (
                    <div
                      key={u.id}
                      onClick={() => setUnidadeId(u.id)}
                      className={`cursor-pointer rounded-xl p-4 border-2 transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#1B8B3A] bg-emerald-50/40 ring-2 ring-[#1B8B3A]/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-extrabold text-[#002855] text-base">{u.cidade}</span>
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                              isSelected
                                ? 'bg-[#1B8B3A] text-white'
                                : 'border border-slate-300 text-transparent'
                            }`}
                          >
                            ✓
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2">{u.endereco || 'Atendimento local'}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#1B8B3A]" /> {u.telefone || u.whatsapp}
                        </span>
                        <span className="font-medium text-slate-700">{u.horario_funcionamento}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="button"
                  onClick={() => {
                    if (!unidadeId) {
                      setErrorMsg('Selecione uma unidade para prosseguir.');
                      return;
                    }
                    setErrorMsg('');
                    setStep(2);
                  }}
                  className="bg-[#002855] hover:bg-[#0b3c7d] text-white font-bold px-6 py-2.5 rounded-xl gap-2 text-sm"
                >
                  Continuar para Dados da Empresa <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ETAPA 2: DADOS DA EMPRESA E SOLICITANTE */}
          {step === 2 && (
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-bold text-[#002855] mb-1">
                  2. Identificação da Empresa & Solicitante (RH)
                </h2>
                <p className="text-xs text-slate-500">
                  Informe a empresa cliente contratante e o contato do responsável pelo encaminhamento.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Razão Social ou Nome Fantasia *
                  </label>
                  <input
                    type="text"
                    required
                    value={empresaNome}
                    onChange={(e) => setEmpresaNome(e.target.value)}
                    placeholder="Ex: Fazenda Progresso Agropecuária Ltda"
                    className="w-full text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#002855] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    CNPJ ou CPF da Empresa
                  </label>
                  <input
                    type="text"
                    value={empresaCnpj}
                    onChange={(e) => setEmpresaCnpj(e.target.value)}
                    placeholder="00.000.000/0001-00"
                    className="w-full text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#002855] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nome do Responsável (RH / Solicitante) *
                  </label>
                  <input
                    type="text"
                    required
                    value={solicitanteNome}
                    onChange={(e) => setSolicitanteNome(e.target.value)}
                    placeholder="Ex: Maria Oliveira"
                    className="w-full text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#002855] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    E-mail para Confirmação e Laudos *
                  </label>
                  <input
                    type="email"
                    required
                    value={solicitanteEmail}
                    onChange={(e) => setSolicitanteEmail(e.target.value)}
                    placeholder="rh@suaempresa.com.br"
                    className="w-full text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#002855] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Telefone / WhatsApp de Contato *
                  </label>
                  <input
                    type="tel"
                    required
                    value={solicitanteTelefone}
                    onChange={(e) => setSolicitanteTelefone(e.target.value)}
                    placeholder="(66) 99999-0000"
                    className="w-full text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#002855] transition"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="rounded-xl gap-2 text-sm text-slate-600"
                >
                  <ArrowLeft className="w-4 h-4" /> Voltar
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    if (!empresaNome || !solicitanteNome || !solicitanteTelefone) {
                      setErrorMsg('Por favor, preencha os campos obrigatórios (*).');
                      return;
                    }
                    setErrorMsg('');
                    setStep(3);
                  }}
                  className="bg-[#002855] hover:bg-[#0b3c7d] text-white font-bold px-6 py-2.5 rounded-xl gap-2 text-sm"
                >
                  Avançar para o Colaborador <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ETAPA 3: DADOS DO COLABORADOR E EXAMES */}
          {step === 3 && (
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-bold text-[#002855] mb-1">
                  3. Dados do Trabalhador e Detalhes do Exame
                </h2>
                <p className="text-xs text-slate-500">
                  Preencha os dados do colaborador que comparecerá à clínica para a consulta médica.
                </p>
              </div>

              {/* DADOS DO TRABALHADOR */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nome Completo do Colaborador *
                  </label>
                  <input
                    type="text"
                    required
                    value={colaboradorNome}
                    onChange={(e) => setColaboradorNome(e.target.value)}
                    placeholder="Ex: João da Silva Santos"
                    className="w-full text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#002855] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    CPF do Colaborador *
                  </label>
                  <input
                    type="text"
                    required
                    value={colaboradorCpf}
                    onChange={(e) => setColaboradorCpf(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#002855] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Função / Cargo Pretendido ou Atual
                  </label>
                  <input
                    type="text"
                    value={colaboradorCargo}
                    onChange={(e) => setColaboradorCargo(e.target.value)}
                    placeholder="Ex: Operador de Máquinas / Motorista"
                    className="w-full text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#002855] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Setor / Departamento
                  </label>
                  <input
                    type="text"
                    value={colaboradorSetor}
                    onChange={(e) => setColaboradorSetor(e.target.value)}
                    placeholder="Ex: Campo / Oficina / Administrativo"
                    className="w-full text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#002855] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Data Pretendida para Comparecimento
                  </label>
                  <input
                    type="date"
                    value={dataPretendida}
                    onChange={(e) => setDataPretendida(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#002855] transition"
                  />
                </div>
              </div>

              {/* TIPO DE EXAME OCUPACIONAL */}
              <div className="pt-4 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Tipo de Exame Ocupacional (ASO) *
                </label>
                <div className="grid sm:grid-cols-3 gap-2.5">
                  {TIPOS_EXAME.map((tipo) => {
                    const isSelected = tipoExame === tipo.id;
                    return (
                      <div
                        key={tipo.id}
                        onClick={() => setTipoExame(tipo.id)}
                        className={`cursor-pointer rounded-xl p-3 border transition-all ${
                          isSelected
                            ? 'border-[#002855] bg-blue-50/50 ring-1 ring-[#002855]'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <span className="font-bold text-xs text-[#002855] block">{tipo.label}</span>
                        <span className="text-[11px] text-slate-500 line-clamp-1">{tipo.desc}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* EXAMES COMPLEMENTARES OPCIONAIS */}
              <div className="pt-4 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Exames Complementares (Opcional)
                </label>
                <div className="grid sm:grid-cols-2 gap-2 text-xs">
                  {EXAMES_COMPLEMENTARES_LIST.map((exame) => {
                    const checked = examesComplementares.includes(exame);
                    return (
                      <label
                        key={exame}
                        className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition ${
                          checked
                            ? 'bg-emerald-50/60 border-emerald-300 text-emerald-900 font-semibold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleExameComplementar(exame)}
                          className="w-4 h-4 rounded text-[#1B8B3A] focus:ring-[#1B8B3A]"
                        />
                        <span>{exame}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* RISCOS E OBSERVAÇÕES */}
              <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Riscos da Função (conforme PGR/PCMSO)
                  </label>
                  <textarea
                    rows={2}
                    value={riscosFuncao}
                    onChange={(e) => setRiscosFuncao(e.target.value)}
                    placeholder="Ex: Ruído, Poeiras minerais, Trabalho em Altura (NR-35)"
                    className="w-full text-xs border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#002855]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Observações Adicionais para a Clínica
                  </label>
                  <textarea rows={2} value={observacoes} onChange={(e) => setObservacoes(e.target.value)} placeholder="Ex: Colaborador com necessidade de atendimento pela manhã" className="w-full text-xs border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#002855]" />
                </div>
              </div>

              {/* INSTRUÇÕES OBRIGATÓRIAS */}
              <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4 text-xs text-slate-800 space-y-1.5">
                <span className="font-extrabold text-[#002855] uppercase text-xs flex items-center gap-1.5 tracking-wider">
                  ⚠️ INSTRUÇÕES OBRIGATÓRIAS
                </span>
                <ul className="space-y-1 text-xs text-slate-700">
                  <li><strong>• Jejum:</strong> para exames de sangue, é obrigatório estar em jejum conforme orientação médica.</li>
                  <li><strong>• Documento:</strong> é indispensável apresentar documento oficial com foto (RG, CNH ou Passaporte) no momento do atendimento.</li>
                </ul>
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="rounded-xl gap-2 text-sm text-slate-600"
                >
                  <ArrowLeft className="w-4 h-4" /> Voltar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-[#1B8B3A] hover:bg-[#166b2d] text-white font-extrabold px-8 py-3 rounded-xl gap-2 text-base shadow-md transition"
                >
                  {loading ? 'Transmitindo Solicitação...' : 'Confirmar e Gerar Guia de Exame'}
                  <CheckCircle2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}

          {/* ETAPA 4: SUCESSO & GUIA DE ENCAMINHAMENTO */}
          {step === 4 && resultado && (
            <div className="space-y-6">
              {/* CARD DE SUCESSO */}
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-emerald-200 shadow-md text-center">
                <div className="w-16 h-16 bg-emerald-100 text-[#1B8B3A] rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#1B8B3A] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Solicitação Registrada com Sucesso
                </span>
                <h2 className="text-2xl font-black text-[#002855] mt-3">
                  Guia de Encaminhamento Ocupacional Emitida!
                </h2>
                <p className="text-slate-500 text-sm max-w-lg mx-auto mt-1">
                  Os dados foram recebidos pela nossa equipe médica da unidade{' '}
                  <strong className="text-slate-800">{resultado.unidade?.nome}</strong>.
                </p>

                {/* PROTOCOLO */}
                <div className="mt-6 inline-flex flex-col items-center bg-slate-50 border-2 border-dashed border-[#002855]/30 p-4 rounded-xl">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                    Número do Protocolo
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-2xl font-black text-[#002855] tracking-wider">
                      {resultado.protocolo}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyProtocol}
                      title="Copiar Protocolo"
                      className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 transition"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  {copied && (
                    <span className="text-[10px] text-[#1B8B3A] font-bold mt-1">
                      Copiado para a área de transferência!
                    </span>
                  )}
                </div>

                {/* BOTÕES DE IMPRESSÃO & COMPARTILHAMENTO */}
                <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
                  <Button
                    type="button"
                    onClick={handlePrint}
                    className="bg-[#002855] hover:bg-[#0b3c7d] text-white font-bold px-6 py-3 rounded-xl gap-2 text-sm shadow transition"
                  >
                    <Printer className="w-4 h-4" /> Imprimir Guia / Salvar em PDF
                  </Button>

                  <a
                    href={getWhatsAppShareUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-[#1B8B3A] hover:bg-[#166b2d] text-white font-bold px-6 py-3 rounded-xl text-sm shadow transition"
                  >
                    <MessageSquare className="w-4 h-4" /> Compartilhar no WhatsApp
                  </a>
                </div>
              </div>

              {/* PRÉVIA DOS DADOS NA TELA */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-xs space-y-4">
                <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2 flex items-center justify-between">
                  <span>Resumo do Encaminhamento</span>
                  <span className="text-slate-400 font-normal">Apresente esta tela ou a via impressa na recepção</span>
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400 block">Colaborador:</span>
                    <strong className="text-slate-900 text-sm">{resultado.colaborador_nome}</strong>
                    <p className="text-slate-500">CPF: {resultado.colaborador_cpf}</p>
                    <p className="text-slate-500">Cargo: {resultado.colaborador_cargo || 'Não informado'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Empresa Solicitante:</span>
                    <strong className="text-slate-900 text-sm">{resultado.empresa_nome}</strong>
                    <p className="text-slate-500">Exame: ASO {resultado.tipo_exame}</p>
                    <p className="text-slate-500">Local: {resultado.unidade?.cidade} ({resultado.unidade?.endereco})</p>
                  </div>
                </div>

                {/* INSTRUÇÕES OBRIGATÓRIAS */}
                <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-3.5 text-xs text-slate-800 space-y-1">
                  <span className="font-extrabold text-[#002855] uppercase text-[11px] block tracking-wider">
                    ⚠️ INSTRUÇÕES OBRIGATÓRIAS AO TRABALHADOR
                  </span>
                  <p className="text-slate-700">
                    <strong>• Jejum:</strong> para exames de sangue, é obrigatório estar em jejum conforme orientação médica.
                  </p>
                  <p className="text-slate-700">
                    <strong>• Documento:</strong> é indispensável apresentar documento oficial com foto (RG, CNH ou Passaporte) no momento do atendimento.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setResultado(null);
                      setColaboradorNome('');
                      setColaboradorCpf('');
                      setColaboradorCargo('');
                      setColaboradorSetor('');
                      setExamesComplementares([]);
                      setObservacoes('');
                    }}
                    className="text-xs text-[#002855] hover:underline font-bold"
                  >
                    + Fazer outra solicitação de exame
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </main>
    </div>
  );
}

export default function FormulariosPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-sm text-slate-500">Carregando formulário...</div>}>
      <FormulariosContent />
    </Suspense>
  );
}
