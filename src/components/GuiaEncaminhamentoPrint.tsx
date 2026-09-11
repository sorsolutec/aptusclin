'use client';

import React from 'react';
import { Logo } from '@/components/ui/logo';
import { MapPin, Phone, Clock, FileText, CheckSquare } from 'lucide-react';

export interface GuiaData {
  protocolo: string;
  created_at: string;
  empresa_nome: string;
  empresa_cnpj?: string | null;
  solicitante_nome: string;
  solicitante_telefone?: string | null;
  colaborador_nome: string;
  colaborador_cpf: string;
  colaborador_cargo?: string | null;
  colaborador_setor?: string | null;
  tipo_exame: string;
  exames_complementares?: string[];
  riscos_funcao?: string | null;
  data_pretendida?: string | null;
  observacoes?: string | null;
  instrucoes?: string[];
  unidade?: {
    nome: string;
    cidade: string;
    estado?: string;
    endereco?: string;
    telefone?: string;
    whatsapp?: string;
    horario_funcionamento?: string;
  } | null;
}


export function GuiaEncaminhamentoPrint({ data }: { data: GuiaData }) {
  const formattedDate = new Date(data.created_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="print-only bg-white text-slate-900 p-8 max-w-4xl mx-auto font-sans leading-relaxed border border-slate-300 print:border-none print:p-0">
      {/* CABEÇALHO OFICIAL */}
      <div className="border-b-2 border-[#002855] pb-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo className="h-10 w-auto" />
          <div>
            <h1 className="text-xl font-extrabold uppercase tracking-wide text-[#002855]">
              Guia de Encaminhamento Ocupacional
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              AptusClin Medicina e Segurança do Trabalho
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
            Protocolo Oficial
          </span>
          <span className="text-base font-mono font-bold text-[#002855] bg-slate-100 px-2.5 py-1 rounded border border-slate-300 inline-block">
            {data.protocolo}
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">
            Emitido em: {formattedDate}
          </span>
        </div>
      </div>

      {/* QUADRO 1: LOCAL DE ATENDIMENTO */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 mb-5">
        <h2 className="text-xs font-bold text-[#002855] uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#1B8B3A]" /> Unidade de Atendimento Credenciada
        </h2>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <p className="font-semibold text-slate-800">{data.unidade?.nome || 'Aptusclin Clínica'}</p>
            <p className="text-slate-600 mt-0.5">{data.unidade?.endereco || 'Consulte a recepção'}</p>
          </div>
          <div>
            <p className="text-slate-600 flex items-center gap-1">
              <Phone className="w-3 h-3 text-slate-400" />
              <span className="font-medium">Contato:</span> {data.unidade?.telefone || data.unidade?.whatsapp || '(66) 3544-0000'}
            </p>
            <p className="text-slate-600 flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3 text-slate-400" />
              <span className="font-medium">Horário:</span> {data.unidade?.horario_funcionamento || 'Segunda a Sexta das 07h às 17h'}
            </p>
          </div>
        </div>
      </div>

      {/* QUADRO 2: DADOS DA EMPRESA & COLABORADOR */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        {/* EMPRESA */}
        <div className="border border-slate-200 rounded-lg p-3.5">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 border-b border-slate-100 pb-1">
            Empresa Solicitante
          </h2>
          <div className="text-xs space-y-1">
            <p><strong className="text-slate-700">Razão Social:</strong> {data.empresa_nome}</p>
            {data.empresa_cnpj && (
              <p><strong className="text-slate-700">CNPJ:</strong> {data.empresa_cnpj}</p>
            )}
            <p><strong className="text-slate-700">Solicitante (RH):</strong> {data.solicitante_nome}</p>
            {data.solicitante_telefone && (
              <p><strong className="text-slate-700">Telefone:</strong> {data.solicitante_telefone}</p>
            )}
          </div>
        </div>

        {/* COLABORADOR */}
        <div className="border border-slate-200 rounded-lg p-3.5">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 border-b border-slate-100 pb-1">
            Dados do Trabalhador
          </h2>
          <div className="text-xs space-y-1">
            <p><strong className="text-slate-700">Nome:</strong> <span className="font-bold text-slate-900">{data.colaborador_nome}</span></p>
            <p><strong className="text-slate-700">CPF:</strong> {data.colaborador_cpf}</p>
            <p><strong className="text-slate-700">Função/Cargo:</strong> {data.colaborador_cargo || 'Não especificado'}</p>
            <p><strong className="text-slate-700">Setor:</strong> {data.colaborador_setor || 'Não especificado'}</p>
          </div>
        </div>
      </div>

      {/* QUADRO 3: PROCEDIMENTO & EXAMES REQUISITADOS */}
      <div className="border border-slate-200 rounded-lg p-4 mb-5">
        <h2 className="text-xs font-bold text-[#002855] uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b border-slate-100 pb-2">
          <FileText className="w-3.5 h-3.5 text-[#002855]" /> Exames Requisitados para Atendimento
        </h2>
        <div className="grid grid-cols-2 gap-4 text-xs mb-3">
          <div>
            <span className="text-slate-500 block">Tipo de Exame Principal:</span>
            <span className="text-sm font-extrabold text-[#002855] bg-blue-50 px-2 py-0.5 rounded inline-block mt-0.5">
              ASO {data.tipo_exame}
            </span>
          </div>
          {data.data_pretendida && (
            <div>
              <span className="text-slate-500 block">Data Prevista de Comparecimento:</span>
              <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                {new Date(data.data_pretendida).toLocaleDateString('pt-BR')}
              </span>
            </div>
          )}
        </div>

        {data.exames_complementares && data.exames_complementares.length > 0 && (
          <div className="mt-3 pt-2 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-700 block mb-1">
              Exames Complementares Solicitados:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {data.exames_complementares.map((exame, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 text-[11px] font-medium px-2 py-0.5 rounded border border-slate-200"
                >
                  <CheckSquare className="w-3 h-3 text-[#1B8B3A]" /> {exame}
                </span>
              ))}
            </div>
          </div>
        )}

        {data.riscos_funcao && (
          <div className="mt-2 text-xs text-slate-600">
            <strong>Riscos Ocupacionais Informados:</strong> {data.riscos_funcao}
          </div>
        )}

        {data.observacoes && (
          <div className="mt-2 text-xs text-slate-600 bg-amber-50 p-2 rounded border border-amber-200">
            <strong>Observações do RH:</strong> {data.observacoes}
          </div>
        )}
      </div>

      {/* QUADRO 4: INSTRUÇÕES OBRIGATÓRIAS AO TRABALHADOR */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-4 mb-8 text-xs text-slate-800">
        <h3 className="font-extrabold text-[#002855] uppercase text-xs mb-2 tracking-wider flex items-center gap-1.5">
          ⚠️ INSTRUÇÕES OBRIGATÓRIAS:
        </h3>
        <ul className="space-y-1.5 text-xs text-slate-700">
          <li className="flex items-start gap-1.5">
            <span className="font-bold text-slate-900">• Jejum:</span>
            <span>para exames de sangue, é obrigatório estar em jejum conforme orientação médica.</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="font-bold text-slate-900">• Documento:</span>
            <span>é indispensável apresentar documento oficial com foto (RG, CNH ou Passaporte) no momento do atendimento.</span>
          </li>
          <li className="flex items-start gap-1.5 text-slate-500 text-[11px] pt-1">
            <span>• Chegar com 15 minutos de antecedência e apresentar esta guia na recepção.</span>
          </li>
        </ul>
      </div>

      {/* ASSINATURAS */}
      <div className="grid grid-cols-2 gap-10 text-center pt-8 border-t border-slate-300 text-xs">
        <div>
          <div className="border-b border-slate-400 mb-1 mx-6"></div>
          <p className="font-semibold text-slate-800">{data.solicitante_nome}</p>
          <p className="text-[10px] text-slate-500">Responsável pelo RH / Empresa</p>
        </div>
        <div>
          <div className="border-b border-slate-400 mb-1 mx-6"></div>
          <p className="font-semibold text-slate-800">Recepção / AptusClin</p>
          <p className="text-[10px] text-slate-500">Carimbo e Assinatura de Recebimento</p>
        </div>
      </div>

      <div className="mt-8 text-center text-[10px] text-slate-400">
        AptusClin Saúde & Segurança do Trabalho • Documento emitido via portal aptusclin.com.br
      </div>
    </div>
  );
}
