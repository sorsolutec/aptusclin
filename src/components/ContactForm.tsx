'use client';

import { useState, type FormEvent } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';

const initialState = {
  nome: '',
  empresa: '',
  email: '',
  telefone: '',
  tipo: 'agendamento',
  mensagem: '',
};

export function ContactForm() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setMessage('');
    setErrors({});

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const payload = await response.json();

      if (!response.ok) {
        setErrors(payload.errors || {});
        setStatus('error');
        setMessage(payload.message || 'Não foi possível enviar sua solicitação.');
        return;
      }

      setForm(initialState);
      setStatus('success');
      setMessage(payload.message || 'Solicitação enviada com sucesso.');
    } catch {
      setStatus('error');
      setMessage('Ocorreu um erro inesperado. Tente novamente em instantes.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">Nome</label>
          <input
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#002855]"
            placeholder="Seu nome"
          />
          {errors.nome && <p className="mt-1 text-xs text-red-600">{errors.nome}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">Empresa</label>
          <input
            value={form.empresa}
            onChange={(e) => setForm({ ...form, empresa: e.target.value })}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#002855]"
            placeholder="Nome da empresa"
          />
          {errors.empresa && <p className="mt-1 text-xs text-red-600">{errors.empresa}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">E-mail</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#002855]"
            placeholder="seu@email.com"
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">Telefone</label>
          <input
            value={form.telefone}
            onChange={(e) => setForm({ ...form, telefone: e.target.value })}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#002855]"
            placeholder="(66) 99999-9999"
          />
          {errors.telefone && <p className="mt-1 text-xs text-red-600">{errors.telefone}</p>}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700">Tipo de solicitação</label>
        <select
          value={form.tipo}
          onChange={(e) => setForm({ ...form, tipo: e.target.value })}
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#002855]"
        >
          <option value="agendamento">Agendamento</option>
          <option value="orcamento">Orçamento</option>
          <option value="duvida">Dúvida</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700">Mensagem</label>
        <textarea
          value={form.mensagem}
          onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
          rows={4}
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#002855]"
          placeholder="Conte um pouco sobre sua necessidade"
        />
        {errors.mensagem && <p className="mt-1 text-xs text-red-600">{errors.mensagem}</p>}
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1B8B3A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#166b2d] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === 'loading' ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Enviando...</>
        ) : (
          'Enviar solicitação'
        )}
      </button>

      {message && (
        <div className={`flex items-start gap-2 rounded-xl border px-3 py-3 text-sm ${status === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}
    </form>
  );
}
