'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  FileText,
  Search,
  RefreshCw,
  Phone,
  Mail,
  Building2,
  Calendar,
  Clock,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  User,
  MapPin,
  Printer,
  MessageSquare,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GuiaEncaminhamentoPrint, GuiaData } from '@/components/GuiaEncaminhamentoPrint';

interface Solicitacao {
  id: string;
  protocolo: string;
  unidade_id: string;
  empresa_nome: string;
  empresa_cnpj?: string;
  solicitante_nome: string;
  solicitante_email: string;
  solicitante_telefone: string;
  colaborador_nome: string;
  colaborador_cpf: string;
  colaborador_cargo?: string;
  colaborador_setor?: string;
  tipo_exame: string;
  exames_complementares?: string[];
  riscos_funcao?: string;
  data_pretendida?: string;
  observacoes?: string;
  status: 'novo' | 'em_analise' | 'agendado' | 'concluido' | 'cancelado';
  data_agendamento?: string;
  horario_agendamento?: string;
  resposta_operador?: string;
  created_at: string;
  unidades?: {
    nome: string;
    cidade: string;
  };
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return iso;
  }
}

export default function AdminSolicitacoesPage() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [unidadeFilter, setUnidadeFilter] = useState<string>('todas');
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<Solicitacao | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [printData, setPrintData] = useState<GuiaData | null>(null);

  const fetchSolicitacoes = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'todos') params.set('status', statusFilter);
      if (unidadeFilter !== 'todas') params.set('unidade_id', unidadeFilter);
      if (search.trim()) params.set('q', search.trim());

      const res = await fetch(`/api/solicitacoes?${params.toString()}`);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Falha ao buscar solicitações.');
      }

      const json = await res.json();
      setSolicitacoes(json.solicitacoes || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar as solicitações.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, unidadeFilter, search]);

  useEffect(() => {
    fetchSolicitacoes();
  }, [fetchSolicitacoes]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/solicitacoes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error('Falha ao atualizar status.');
      }

      setSolicitacoes((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: newStatus as any } : s))
      );
      if (selectedItem?.id === id) {
        setSelectedItem((prev) => (prev ? { ...prev, status: newStatus as any } : null));
      }
    } catch (err: any) {
      alert(err.message || 'Erro ao atualizar status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente remover esta solicitação de exame?')) return;
    try {
      const res = await fetch(`/api/solicitacoes/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Falha ao remover.');
      setSolicitacoes((prev) => prev.filter((s) => s.id !== id));
      if (selectedItem?.id === id) setSelectedItem(null);
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir.');
    }
  };

  const handlePrintGuia = (item: Solicitacao) => {
    const data: GuiaData = {
      protocolo: item.protocolo,
      created_at: item.created_at,
      empresa_nome: item.empresa_nome,
      empresa_cnpj: item.empresa_cnpj,
      solicitante_nome: item.solicitante_nome,
      solicitante_telefone: item.solicitante_telefone,
      colaborador_nome: item.colaborador_nome,
      colaborador_cpf: item.colaborador_cpf,
      colaborador_cargo: item.colaborador_cargo,
      colaborador_setor: item.colaborador_setor,
      tipo_exame: item.tipo_exame,
      exames_complementares: item.exames_complementares,
      riscos_funcao: item.riscos_funcao,
      data_pretendida: item.data_pretendida,
      observacoes: item.observacoes,
      unidade: {
        nome: item.unidades?.nome || `Unidade ${item.unidade_id}`,
        cidade: item.unidades?.cidade || item.unidade_id,
        endereco: 'Consulte a recepção da unidade',
        horario_funcionamento: '07:00 às 17:30',
      },
    };

    setPrintData(data);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'novo':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-300">Novo</Badge>;
      case 'em_analise':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Em Análise</Badge>;
      case 'agendado':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-300">Agendado</Badge>;
      case 'concluido':
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">Concluído</Badge>;
      case 'cancelado':
        return <Badge className="bg-slate-100 text-slate-600 border-slate-300">Cancelado</Badge>;
      default:
        return <Badge>{st}</Badge>;
    }
  };

  // Métricas
  const totalNovos = solicitacoes.filter((s) => s.status === 'novo').length;
  const totalAgendados = solicitacoes.filter((s) => s.status === 'agendado').length;
  const totalConcluidos = solicitacoes.filter((s) => s.status === 'concluido').length;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* IMPRESSÃO DA GUIA (Visível apenas em @media print) */}
      {printData && <GuiaEncaminhamentoPrint data={printData} />}

      <div className="no-print">
        {/* CABEÇALHO */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#002855] flex items-center gap-2">
              <FileText className="w-6 h-6 text-[#1B8B3A]" />
              Solicitações de Exames Ocupacionais
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Encaminhamentos e pedidos de ASO enviados pelas empresas conveniadas através do site.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchSolicitacoes}
              disabled={loading}
              className="gap-1.5 text-xs text-slate-600 rounded-xl"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            <a
              href="/formularios"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#1B8B3A] hover:bg-[#166b2d] px-3.5 py-2 rounded-xl shadow-sm transition"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Abrir Formulário Público
            </a>
          </div>
        </div>

        {/* MÉTRICAS EM CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <Card className="rounded-2xl border-slate-200">
            <CardContent className="p-4">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Total Recebidas</span>
              <span className="text-2xl font-extrabold text-[#002855] mt-1 block">{solicitacoes.length}</span>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-amber-200 bg-amber-50/40">
            <CardContent className="p-4">
              <span className="text-xs text-amber-700 font-bold uppercase tracking-wider block">Novas (Pendentes)</span>
              <span className="text-2xl font-extrabold text-amber-800 mt-1 block">{totalNovos}</span>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-purple-200 bg-purple-50/40">
            <CardContent className="p-4">
              <span className="text-xs text-purple-700 font-bold uppercase tracking-wider block">Agendadas</span>
              <span className="text-2xl font-extrabold text-purple-800 mt-1 block">{totalAgendados}</span>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-emerald-200 bg-emerald-50/40">
            <CardContent className="p-4">
              <span className="text-xs text-emerald-700 font-bold uppercase tracking-wider block">Concluídas</span>
              <span className="text-2xl font-extrabold text-emerald-800 mt-1 block">{totalConcluidos}</span>
            </CardContent>
          </Card>
        </div>

        {/* FILTROS E BUSCA */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mt-6 flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* BUSCA */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por colaborador, CPF, empresa ou protocolo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002855]"
            />
          </div>

          {/* FILTROS POR STATUS E UNIDADE */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <select
              value={unidadeFilter}
              onChange={(e) => setUnidadeFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#002855]"
            >
              <option value="todas">Todas as Unidades</option>
              <option value="sorriso">Sorriso</option>
              <option value="nova-mutum">Nova Mutum</option>
              <option value="nova-ubirata">Nova Ubiratã</option>
              <option value="boa-esperanca">Boa Esperança</option>
            </select>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {['todos', 'novo', 'em_analise', 'agendado', 'concluido'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium transition capitalize ${
                    statusFilter === st
                      ? 'bg-white text-[#002855] font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* TABELA DE SOLICITAÇÕES */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mt-6 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#002855]" />
              Carregando solicitações de exames...
            </div>
          ) : solicitacoes.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              Nenhuma solicitação encontrada para os filtros selecionados.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="py-3.5 px-4">Protocolo</th>
                    <th className="py-3.5 px-4">Colaborador</th>
                    <th className="py-3.5 px-4">Empresa / Solicitante</th>
                    <th className="py-3.5 px-4">Unidade</th>
                    <th className="py-3.5 px-4">Tipo de Exame</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {solicitacoes.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 transition cursor-pointer"
                      onClick={() => setSelectedItem(item)}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-[#002855]">
                        {item.protocolo}
                        <span className="block text-[10px] font-normal text-slate-400">
                          {formatDate(item.created_at)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <strong className="text-slate-900 block">{item.colaborador_nome}</strong>
                        <span className="text-[11px] text-slate-500">CPF: {item.colaborador_cpf}</span>
                        {item.colaborador_cargo && (
                          <span className="block text-[10px] text-slate-400">{item.colaborador_cargo}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800 block">{item.empresa_nome}</span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <User className="w-3 h-3" /> {item.solicitante_nome}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {item.solicitante_telefone}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
                          <MapPin className="w-3 h-3 text-[#1B8B3A]" />
                          {item.unidades?.cidade || item.unidade_id}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#002855] block">ASO {item.tipo_exame}</span>
                        {item.exames_complementares && item.exames_complementares.length > 0 && (
                          <span className="text-[10px] text-slate-500">
                            +{item.exames_complementares.length} complementar(es)
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">{getStatusBadge(item.status)}</td>
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handlePrintGuia(item)}
                            title="Imprimir Guia de Encaminhamento"
                            className="p-1.5 text-slate-500 hover:text-[#002855] hover:bg-slate-100 rounded-lg transition"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedItem(item)}
                            title="Ver Detalhes e Triagem"
                            className="text-xs font-bold text-[#002855] hover:underline px-2 py-1"
                          >
                            Detalhes
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* MODAL / DRAWER DE DETALHES & TRIAGEM */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                    Detalhes do Encaminhamento
                  </span>
                  <h2 className="text-xl font-black text-[#002855] flex items-center gap-2 mt-0.5">
                    Protocolo: {selectedItem.protocolo}
                    {getStatusBadge(selectedItem.status)}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm"
                >
                  ✕
                </button>
              </div>

              {/* SEÇÕES DE DADOS */}
              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                {/* COLABORADOR */}
                <div className="bg-slate-50 p-4 rounded-xl space-y-1.5 border border-slate-200/80">
                  <span className="font-bold text-slate-400 uppercase text-[10px] block">Colaborador</span>
                  <strong className="text-slate-900 text-sm block">{selectedItem.colaborador_nome}</strong>
                  <p className="text-slate-600"><strong>CPF:</strong> {selectedItem.colaborador_cpf}</p>
                  <p className="text-slate-600"><strong>Cargo:</strong> {selectedItem.colaborador_cargo || '-'}</p>
                  <p className="text-slate-600"><strong>Setor:</strong> {selectedItem.colaborador_setor || '-'}</p>
                </div>

                {/* EMPRESA */}
                <div className="bg-slate-50 p-4 rounded-xl space-y-1.5 border border-slate-200/80">
                  <span className="font-bold text-slate-400 uppercase text-[10px] block">Empresa Solicitante</span>
                  <strong className="text-slate-900 text-sm block">{selectedItem.empresa_nome}</strong>
                  {selectedItem.empresa_cnpj && <p className="text-slate-600"><strong>CNPJ:</strong> {selectedItem.empresa_cnpj}</p>}
                  <p className="text-slate-600"><strong>Responsável:</strong> {selectedItem.solicitante_nome}</p>
                  <p className="text-slate-600"><strong>Telefone:</strong> {selectedItem.solicitante_telefone}</p>
                  <p className="text-slate-600"><strong>E-mail:</strong> {selectedItem.solicitante_email}</p>
                </div>
              </div>

              {/* EXAMES E INSTRUÇÕES */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs space-y-2">
                <span className="font-bold text-slate-400 uppercase text-[10px] block">Procedimento Solicitado</span>
                <p><strong>Tipo de ASO:</strong> <span className="text-[#002855] font-extrabold text-sm">{selectedItem.tipo_exame}</span></p>
                {selectedItem.data_pretendida && (
                  <p><strong>Data Prevista de Comparecimento:</strong> {new Date(selectedItem.data_pretendida).toLocaleDateString('pt-BR')}</p>
                )}
                {selectedItem.exames_complementares && selectedItem.exames_complementares.length > 0 && (
                  <div>
                    <strong>Exames Complementares Requisitados:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedItem.exames_complementares.map((e, idx) => (
                        <span key={idx} className="bg-white border border-slate-200 px-2 py-0.5 rounded text-[11px] font-medium text-slate-700">
                          ✓ {e}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {selectedItem.riscos_funcao && (
                  <p className="pt-2 border-t border-slate-200"><strong>Riscos Informados:</strong> {selectedItem.riscos_funcao}</p>
                )}
                {selectedItem.observacoes && (
                  <p className="pt-2 border-t border-slate-200 text-amber-900 bg-amber-50 p-2 rounded">
                    <strong>Observações:</strong> {selectedItem.observacoes}
                  </p>
                )}
              </div>

              {/* AÇÕES OPERACIONAIS */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                {/* ATUALIZAR STATUS */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-500">Alterar Status:</span>
                  {(['novo', 'em_analise', 'agendado', 'concluido', 'cancelado'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      disabled={updatingId === selectedItem.id}
                      onClick={() => handleUpdateStatus(selectedItem.id, st)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition capitalize ${
                        selectedItem.status === st
                          ? 'bg-[#002855] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    onClick={() => handlePrintGuia(selectedItem)}
                    className="bg-[#002855] hover:bg-[#0b3c7d] text-white text-xs font-bold rounded-xl gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" /> Imprimir Guia
                  </Button>
                  <button
                    type="button"
                    onClick={() => handleDelete(selectedItem.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition"
                    title="Excluir solicitação"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
