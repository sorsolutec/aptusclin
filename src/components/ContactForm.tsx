'use client';

import { useState, type FormEvent } from 'react';
import { CheckCircle2, AlertCircle, Loader2, MessageCircle } from 'lucide-react';
import { validateContactLead } from '@/lib/contact';

const SORRISO_WHATSAPP = '5566996440425';

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
  const [lastSubmitted, setLastSubmitted] = useState<typeof initialState | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage('');
    setErrors({});

    // Validação local antes de disparar a requisição
    const validation = validateContactLead(form);
    if (!validation.valid) {
      setErrors(validation.errors as Record<string, string>);
      setStatus('error');
      setMessage('Por favor, corrija os campos destacados antes de enviar.');
      return;
    }

    setStatus('loading');

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

      setLastSubmitted({ ...form });
      setForm(initialState);
      setStatus('success');
      setMessage(payload.message || 'Solicitação enviada e registrada com sucesso.');
    } catch {
      setStatus('error');
      setMessage('Ocorreu um erro inesperado ao enviar. Tente novamente em instantes.');
    }
  }

  const sorrisoWhatsAppUrl = lastSubmitted
    ? `https://wa.me/${SORRISO_WHATSAPP}?text=${encodeURIComponent(
        `Olá! Acabei de enviar uma mensagem pelo formulário do site.\n\n` +
        `*Nome:* ${lastSubmitted.nome}\n` +
        `*Empresa:* ${lastSubmitted.empresa}\n` +
        `*Assunto:* ${lastSubmitted.tipo}\n` +
        `*Mensagem:* ${lastSubmitted.mensagem}\n\n` +
        `Gostaria de agilizar meu atendimento com a Unidade Sorriso.`
      )}`
    : `https://wa.me/${SORRISO_WHATSAPP}?text=${encodeURIComponent(
        'Olá! Gostaria de tirar dúvidas e solicitar atendimento com a Aptusclin Unidade Sorriso.'
      )}`;

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} noValidate className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Nome completo <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={form.nome}
              onChange={(e) => {
                setForm({ ...form, nome: e.target.value });
                if (errors.nome) setErrors((prev) => ({ ...prev, nome: '' }));
              }}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#002855]"
              placeholder="Seu nome"
            />
            {errors.nome && <p className="mt-1 text-xs text-red-600">{errors.nome}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Empresa <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={form.empresa}
              onChange={(e) => {
                setForm({ ...form, empresa: e.target.value });
                if (errors.empresa) setErrors((prev) => ({ ...prev, empresa: '' }));
              }}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#002855]"
              placeholder="Nome da sua empresa"
            />
            {errors.empresa && <p className="mt-1 text-xs text-red-600">{errors.empresa}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              E-mail <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => {
                setForm({ ...form, email: e.target.value });
                if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
              }}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#002855]"
              placeholder="seu@email.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Telefone / WhatsApp <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={form.telefone}
              onChange={(e) => {
                setForm({ ...form, telefone: e.target.value });
                if (errors.telefone) setErrors((prev) => ({ ...prev, telefone: '' }));
              }}
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
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700">
              Mensagem <span className="text-red-500">*</span>
            </label>
            <span className="text-xs text-slate-400">mínimo 10 caracteres</span>
          </div>
          <textarea
            required
            minLength={10}
            value={form.mensagem}
            onChange={(e) => {
              setForm({ ...form, mensagem: e.target.value });
              if (errors.mensagem) setErrors((prev) => ({ ...prev, mensagem: '' }));
            }}
            rows={4}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#002855]"
            placeholder="Conte um pouco sobre sua necessidade"
          />
          {errors.mensagem && <p className="mt-1 text-xs text-red-600">{errors.mensagem}</p>}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <button
            type="submit"
            disabled={status === 'loading'}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#002855] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#001c3d] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === 'loading' ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Enviando...</>
            ) : (
              'Enviar mensagem'
            )}
          </button>

          <a
            href={`https://wa.me/${SORRISO_WHATSAPP}?text=${encodeURIComponent('Olá! Gostaria de atendimento com a Aptusclin Unidade Sorriso.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1B8B3A] hover:underline"
          >
            <MessageCircle className="w-4 h-4" />
            Prefere falar direto? WhatsApp Unidade Sorriso (66) 99644-0425
          </a>
        </div>

        {/* Mensagem de Erro */}
        {status === 'error' && message && (
          <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* Notificação e Ação de WhatsApp para Unidade de Sorriso no Sucesso */}
        {status === 'success' && (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 space-y-3">
            <div className="flex items-start gap-2 text-emerald-800 text-sm font-semibold">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#1B8B3A] shrink-0" />
              <div>
                <p>{message}</p>
                <p className="text-xs font-normal text-emerald-700 mt-0.5">
                  Nossa equipe de atendimento já recebeu seus dados e retornará em breve.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-emerald-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-emerald-900 font-medium">
                Deseja atendimento imediato? Fale agora com a nossa recepção:
              </div>

              <a
                href={sorrisoWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1B8B3A] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#166b2d] transition"
              >
                <MessageCircle className="h-4 w-4" />
                Falar no WhatsApp da Unidade Sorriso
              </a>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}


