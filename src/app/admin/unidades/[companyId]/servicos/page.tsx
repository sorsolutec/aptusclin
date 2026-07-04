'use client';

import { use, useEffect, useState } from 'react';
import { Stethoscope, Plus, Trash2, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const SUGGESTED_EXAMS = [
  "Exame clínico",
  "Acuidade visual",
  "Teste de Ishihara",
  "Audiometria",
  "Espirometria",
  "Eletrocardiograma",
  "Eletroencefalograma",
  "Raio X",
  "Toxicológico",
  "Psicossocial",
  "Exames laboratoriais",
  "Teste de Romberg",
  "Ultrassonografia",
  "Dinamometria palmar / lombar",
];

export default function ServicosAdminPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = use(params);
  const [exams, setExams] = useState<string[]>([]);
  const [newExam, setNewExam] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/unidades/${companyId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.exames_disponiveis)) {
          setExams(data.exames_disponiveis);
        } else if (data && !data.exames_disponiveis) {
          // fallback inicial para não começar em branco caso não tenha dados no banco
          setExams(SUGGESTED_EXAMS);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [companyId]);

  function handleAddExam(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (exams.some((e) => e.toLowerCase() === trimmed.toLowerCase())) {
      setError('Este exame já está na lista.');
      return;
    }
    setError('');
    setExams((prev) => [...prev, trimmed]);
    setNewExam('');
    setSaved(false);
  }

  function handleRemoveExam(index: number) {
    setExams((prev) => prev.filter((_, i) => i !== index));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/unidades/${companyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exames_disponiveis: exams }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        const json = await res.json();
        setError(json.error ?? 'Erro ao salvar exames.');
      }
    } catch {
      setError('Erro de conexão ao salvar.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-7 h-7 text-[#002855] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Cabeçalho */}
      <div className="mb-7 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Configuração</p>
          <h1 className="text-2xl font-extrabold text-slate-800 mt-0.5">Serviços / Exames Disponíveis</h1>
          <p className="text-slate-400 text-sm mt-1">
            Defina quais exames estão disponíveis para atendimento nesta unidade.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#002855] text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-[#001a3d] disabled:opacity-60 transition shadow-sm"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {saved ? 'Salvo!' : 'Salvar Alterações'}
        </button>
      </div>

      {error && (
        <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {saved && (
        <div className="mb-5 flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <p className="text-sm text-emerald-700 font-semibold">Exames atualizados com sucesso!</p>
        </div>
      )}

      <div className="grid md:grid-cols-12 gap-6">
        {/* Adicionar Exame */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <h2 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#1B8B3A]" />
              Novo Exame
            </h2>
            <div className="space-y-3">
              <input
                type="text"
                value={newExam}
                onChange={(e) => setNewExam(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddExam(newExam)}
                placeholder="Ex: Espirometria ocupacional"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#002855]/30 focus:border-[#002855]"
              />
              <button
                onClick={() => handleAddExam(newExam)}
                disabled={!newExam.trim()}
                className="w-full bg-[#1B8B3A] text-white font-bold py-2 rounded-lg hover:bg-[#166b2d] disabled:opacity-50 text-sm transition"
              >
                Adicionar Personalizado
              </button>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sugestões comuns</h3>
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                {SUGGESTED_EXAMS.filter(s => !exams.some(e => e.toLowerCase() === s.toLowerCase())).map((suggested) => (
                  <button
                    key={suggested}
                    onClick={() => handleAddExam(suggested)}
                    className="text-xs bg-slate-50 hover:bg-[#002855]/5 hover:text-[#002855] text-slate-600 px-2.5 py-1 rounded-full border border-slate-200 transition"
                  >
                    + {suggested}
                  </button>
                ))}
                {SUGGESTED_EXAMS.filter(s => !exams.some(e => e.toLowerCase() === s.toLowerCase())).length === 0 && (
                  <p className="text-xs text-slate-400 italic">Todas as sugestões adicionadas.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Exames Atuais */}
        <div className="md:col-span-7 bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
            <h2 className="font-bold text-slate-700 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-[#002855]" />
              Exames Ativos ({exams.length})
            </h2>
          </div>
          {exams.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Stethoscope className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Nenhum exame cadastrado nesta unidade.</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-50 max-h-[400px] overflow-y-auto">
              {exams.map((exam, i) => (
                <li key={exam} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1B8B3A] flex-shrink-0" />
                    <span className="text-xs font-semibold text-slate-700 truncate">{exam}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveExam(i)}
                    className="p-1 text-slate-300 hover:text-red-500 transition"
                    title="Remover exame"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
