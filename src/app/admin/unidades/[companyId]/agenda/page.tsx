'use client';

import React, { use, useEffect, useState } from 'react';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {
  CalendarDays,
  Plus,
  Trash2,
  MapPin,
  Clock,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { tenantConfig } from '@/lib/tenant';

interface Event {
  id: string;
  client_id: string;
  title: string;
  description?: string;
  start_at: string;
  end_at?: string;
  location?: string;
}

export default function UnitAgendaAdminPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = use(params);
  const config = tenantConfig[companyId];

  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeStart, setTimeStart] = useState('08:00');
  const [timeEnd, setTimeEnd] = useState('09:00');
  const [location, setLocation] = useState('');

  // Fetch events
  const loadEvents = () => {
    setLoading(true);
    fetch(`/api/events?companyId=${companyId}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setEvents(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadEvents();
  }, [companyId]);

  // Group events by date
  const getEventsForDate = (date: Date) => {
    const key = date.toISOString().split('T')[0];
    return events.filter((ev) => {
      const evDate = new Date(ev.start_at).toISOString().split('T')[0];
      return evDate === key;
    });
  };

  // Add event
  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedDate) return;

    setSaving(true);
    setError('');
    setSuccess(false);

    const dateStr = selectedDate.toISOString().split('T')[0];
    const start_at = new Date(`${dateStr}T${timeStart}:00`).toISOString();
    const end_at = new Date(`${dateStr}T${timeEnd}:00`).toISOString();

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          start_at,
          end_at,
          location: location.trim(),
          client_id: companyId, // Map companyId to client_id in the database
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erro ao salvar agendamento.');
      }

      setTitle('');
      setDescription('');
      setLocation('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      loadEvents();
    } catch (err: any) {
      setError(err.message || 'Erro de conexão.');
    } finally {
      setSaving(false);
    }
  };

  // Delete event
  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Deseja realmente remover este agendamento?')) return;

    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setEvents((prev) => prev.filter((ev) => ev.id !== id));
      } else {
        alert('Erro ao excluir agendamento.');
      }
    } catch {
      alert('Erro de rede.');
    }
  };

  const dayEvents = getEventsForDate(selectedDate);

  // Helper to custom styles on calendar tiles
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;
    const dayEvs = getEventsForDate(date);
    if (dayEvs.length > 0) {
      return (
        <div className="flex justify-center mt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#002855]" />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Agenda</p>
        <h1 className="text-2xl font-extrabold text-slate-800 mt-1">
          Agenda - {config?.nome ?? companyId}
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Gerencie e agende exames ocupacionais e consultas para esta clínica.
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        {/* LADO ESQUERDO: CALENDÁRIO */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
            <ReactCalendar
              onChange={(v) => setSelectedDate(v as Date)}
              value={selectedDate}
              tileContent={tileContent}
              className="w-full border-none font-sans"
            />
          </div>

          {/* FORMULÁRIO DE NOVO COMPROMISSO */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
            <h2 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-[#002855]" />
              Novo Agendamento
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>Agendamento criado com sucesso!</span>
              </div>
            )}

            <form onSubmit={handleAddEvent} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Título / Paciente *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: ASO Periódico - João Silva"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Sala / Localização
                </label>
                <input
                  type="text"
                  placeholder="Ex: Consultório 02"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Horário Início *
                  </label>
                  <input
                    type="time"
                    required
                    value={timeStart}
                    onChange={(e) => setTimeStart(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Horário Fim *
                  </label>
                  <input
                    type="time"
                    required
                    value={timeEnd}
                    onChange={(e) => setTimeEnd(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Descrição / Notas
                </label>
                <textarea
                  placeholder="Instruções adicionais..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855] transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full mt-2 flex items-center justify-center gap-1.5 bg-[#002855] hover:bg-[#001a3d] text-white text-xs font-semibold py-2.5 rounded-xl disabled:opacity-60 transition shadow-sm"
              >
                {saving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Plus className="w-3.5 h-3.5" />
                )}
                Agendar Paciente
              </button>
            </form>
          </div>
        </div>

        {/* LADO DIREITO: COMPROMISSOS DO DIA */}
        <div className="md:col-span-7">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[350px]">
            <div className="px-6 py-4 border-b border-slate-50 bg-[#002855]/5 flex items-center justify-between">
              <h2 className="font-bold text-[#002855] text-sm flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                {selectedDate.toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </h2>
              <span className="text-xs font-semibold text-slate-400">
                {dayEvents.length} agendamento{dayEvents.length !== 1 ? 's' : ''}
              </span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-7 h-7 text-[#002855] animate-spin" />
              </div>
            ) : dayEvents.length === 0 ? (
              <div className="py-20 text-center text-slate-400">
                <CalendarDays className="w-10 h-10 mx-auto mb-3 opacity-20 text-[#002855]" />
                <p className="text-sm">Nenhum compromisso para este dia.</p>
                <p className="text-xs text-slate-400 mt-1">Preencha o formulário para adicionar.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50 max-h-[500px] overflow-y-auto">
                {dayEvents
                  .sort((a, b) => a.start_at.localeCompare(b.start_at))
                  .map((ev) => {
                    const startStr = new Date(ev.start_at).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    });
                    const endStr = ev.end_at
                      ? new Date(ev.end_at).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '';
                    return (
                      <div
                        key={ev.id}
                        className="px-6 py-4 hover:bg-slate-50 transition flex items-start justify-between gap-4"
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-800 text-sm leading-tight">
                            {ev.title}
                          </h3>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                            <span className="inline-flex items-center gap-1 text-[11px] text-[#002855] font-semibold bg-[#002855]/5 px-2 py-0.5 rounded-md">
                              <Clock className="w-3 h-3" />
                              {startStr} {endStr ? ` - ${endStr}` : ''}
                            </span>
                            {ev.location && (
                              <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                                <MapPin className="w-3 h-3" />
                                {ev.location}
                              </span>
                            )}
                          </div>
                          {ev.description && (
                            <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                              {ev.description}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteEvent(ev.id)}
                          className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                          title="Remover"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
