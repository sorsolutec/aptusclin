'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  MessageSquare,
  Search,
  RefreshCw,
  Phone,
  Mail,
  Building2,
  Calendar,
  Clock,
  Send,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Lead {
  id: string;
  nome: string;
  empresa: string;
  email: string;
  telefone: string;
  tipo: string;
  mensagem: string;
  status: 'novo' | 'em_atendimento' | 'concluido';
  created_at: string;
  updated_at?: string;
}

const SORRISO_WHATSAPP = '5566996440425';

function cleanPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`;
  }
  return digits;
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

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'novo' | 'em_atendimento' | 'concluido'>('todos');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'todos') params.set('status', statusFilter);
      if (search.trim()) params.set('q', search.trim());

      const res = await fetch(`/api/admin/leads?${params.toString()}`);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Falha ao buscar leads.');
      }

      const json = await res.json();
      setLeads(json.leads || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar os leads.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  async function handleStatusChange(id: string, newStatus: Lead['status']) {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error('Não foi possível atualizar o status.');
      }

      setLeads((prev) =>
        prev.map((lead) => (lead.id === id ? { ...lead, status: newStatus } : lead))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao atualizar status.');
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(id: string, nome: string) {
    if (!confirm(`Tem certeza que deseja excluir o lead de "${nome}"?`)) return;

    try {
      const res = await fetch(`/api/admin/leads/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Não foi possível excluir o lead.');

      setLeads((prev) => prev.filter((lead) => lead.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir.');
    }
  }

  // Contadores
  const totalCount = leads.length;
  const countNovos = leads.filter((l) => l.status === 'novo').length;
  const countEmAtendimento = leads.filter((l) => l.status === 'em_atendimento').length;
  const countConcluidos = leads.filter((l) => l.status === 'concluido').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#002855] flex items-center gap-2">
            <MessageSquare className="w-7 h-7 text-[#1B8B3A]" />
            Leads e Contatos do Site
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Gerencie os pedidos de agendamento, orçamentos e mensagens recebidas pelo site.
          </p>
        </div>
        <Button
          onClick={fetchLeads}
          variant="outline"
          className="gap-2 self-start md:self-auto border-slate-200 hover:bg-slate-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-slate-200">
          <CardHeader className="p-4 pb-1">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total de Contatos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="text-2xl font-bold text-slate-800">{totalCount}</div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50/40">
          <CardHeader className="p-4 pb-1">
            <CardTitle className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
              Novos (Aguardando)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="text-2xl font-bold text-amber-800">{countNovos}</div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50/40">
          <CardHeader className="p-4 pb-1">
            <CardTitle className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
              Em Atendimento
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="text-2xl font-bold text-blue-800">{countEmAtendimento}</div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-emerald-50/40">
          <CardHeader className="p-4 pb-1">
            <CardTitle className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              Concluídos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="text-2xl font-bold text-emerald-800">{countConcluidos}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Busca */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl w-fit">
          <button
            onClick={() => setStatusFilter('todos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              statusFilter === 'todos' ? 'bg-white text-[#002855] shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setStatusFilter('novo')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              statusFilter === 'novo' ? 'bg-white text-amber-700 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Novos
          </button>
          <button
            onClick={() => setStatusFilter('em_atendimento')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              statusFilter === 'em_atendimento' ? 'bg-white text-blue-700 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Em Atendimento
          </button>
          <button
            onClick={() => setStatusFilter('concluido')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              statusFilter === 'concluido' ? 'bg-white text-emerald-700 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Concluídos
          </button>
        </div>

        {/* Input de Busca */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, empresa ou e-mail..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-[#002855] focus:ring-1 focus:ring-[#002855]"
          />
        </div>
      </div>

      {/* Alerta de erro */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Lista de Leads */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-[#002855]" />
          <p className="text-sm">Carregando contatos...</p>
        </div>
      ) : leads.length === 0 ? (
        <div className="py-16 text-center bg-white border border-slate-200 rounded-2xl p-8">
          <MessageSquare className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-semibold text-slate-700">Nenhum contato encontrado</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            {search || statusFilter !== 'todos'
              ? 'Não encontramos nenhum lead correspondente aos filtros selecionados.'
              : 'Quando os visitantes enviarem o formulário de contato pelo site, eles aparecerão aqui.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {leads.map((lead) => {
            const leadPhoneClean = cleanPhone(lead.telefone);
            const leadWaLink = `https://wa.me/${leadPhoneClean}?text=${encodeURIComponent(
              `Olá ${lead.nome}! Sou da equipe da Aptusclin Medicina Ocupacional. Recebemos sua mensagem sobre "${lead.tipo}". Como podemos te ajudar?`
            )}`;

            const sorrisoForwardLink = `https://wa.me/${SORRISO_WHATSAPP}?text=${encodeURIComponent(
              `*Novo Lead Recebido pelo Site*\n\n` +
              `*Nome:* ${lead.nome}\n` +
              `*Empresa:* ${lead.empresa}\n` +
              `*Telefone:* ${lead.telefone}\n` +
              `*E-mail:* ${lead.email}\n` +
              `*Tipo:* ${lead.tipo}\n` +
              `*Mensagem:* ${lead.mensagem}\n` +
              `*Data:* ${formatDate(lead.created_at)}`
            )}`;

            return (
              <Card key={lead.id} className="border-slate-200 overflow-hidden shadow-sm hover:shadow transition">
                <div className="p-5 flex flex-col gap-4">
                  {/* Linha superior: Informações básicas e Status */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="w-10 h-10 rounded-full bg-[#002855]/10 text-[#002855] flex items-center justify-center font-bold text-sm">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="font-bold text-slate-900 text-base">{lead.nome}</h2>
                          <Badge variant="outline" className="text-xs bg-slate-100 text-slate-700 capitalize">
                            {lead.tipo}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-medium text-slate-700">{lead.empresa}</span>
                          <span className="text-slate-300">•</span>
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatDate(lead.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Dropdown & Delete */}
                    <div className="flex items-center gap-2 self-end md:self-auto">
                      <div className="relative">
                        <select
                          disabled={updatingId === lead.id}
                          value={lead.status || 'novo'}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value as Lead['status'])}
                          className={`text-xs font-semibold px-3 py-1.5 pr-8 rounded-lg border appearance-none cursor-pointer outline-none transition ${
                            lead.status === 'novo'
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : lead.status === 'em_atendimento'
                              ? 'bg-blue-50 text-blue-800 border-blue-300'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          }`}
                        >
                          <option value="novo">Novo</option>
                          <option value="em_atendimento">Em Atendimento</option>
                          <option value="concluido">Concluído</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(lead.id, lead.nome)}
                        className="text-slate-400 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                        title="Excluir Lead"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Detalhes de Contato e Mensagem */}
                  <div className="grid md:grid-cols-3 gap-4">
                    {/* Contatos */}
                    <div className="space-y-2 text-xs text-slate-600 bg-slate-50/70 p-3 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-[#1B8B3A]" />
                        <span className="font-semibold text-slate-700">Telefone:</span>
                        <a
                          href={`tel:${lead.telefone}`}
                          className="hover:underline text-slate-900 font-medium"
                        >
                          {lead.telefone}
                        </a>
                      </div>

                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-blue-600" />
                        <span className="font-semibold text-slate-700">E-mail:</span>
                        <a
                          href={`mailto:${lead.email}`}
                          className="hover:underline text-slate-900 truncate"
                        >
                          {lead.email}
                        </a>
                      </div>

                      <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-slate-500">Cadastrado em {formatDate(lead.created_at)}</span>
                      </div>
                    </div>

                    {/* Mensagem do cliente */}
                    <div className="md:col-span-2 bg-slate-50/70 p-3 rounded-xl text-xs flex flex-col justify-between">
                      <div>
                        <span className="font-semibold text-slate-700 block mb-1">Mensagem enviada:</span>
                        <p className="text-slate-800 whitespace-pre-wrap leading-relaxed">{lead.mensagem}</p>
                      </div>
                    </div>
                  </div>

                  {/* Botões de Ação Rápida */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {/* Chamar no WhatsApp do cliente */}
                    <a
                      href={leadWaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1B8B3A] text-white text-xs font-semibold hover:bg-[#166b2d] transition"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Responder no WhatsApp do Lead
                    </a>

                    {/* Encaminhar para Unidade Sorriso */}
                    <a
                      href={sorrisoForwardLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#002855] text-white text-xs font-semibold hover:bg-[#001c3d] transition"
                      title="Encaminhar detalhes deste lead diretamente para o WhatsApp da Unidade de Sorriso (66) 99644-0425"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Encaminhar para Unidade Sorriso
                    </a>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
