'use client';

import { use, useEffect, useState } from 'react';
import { Image as ImageIcon, Plus, Trash2, GripVertical, Loader2, Save } from 'lucide-react';

interface Slide { url: string; caption: string }

export default function SlidesAdminPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = use(params);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/unidades/${companyId}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.slides) setSlides(data.slides);
        setLoading(false);
      });
  }, [companyId]);

  function addSlide() {
    if (!newUrl.trim()) return;
    setSlides(prev => [...prev, { url: newUrl.trim(), caption: newCaption.trim() }]);
    setNewUrl('');
    setNewCaption('');
    setSaved(false);
  }

  function removeSlide(idx: number) {
    setSlides(prev => prev.filter((_, i) => i !== idx));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/unidades/${companyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slides }),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error ?? 'Erro ao salvar.');
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      setError('Erro de rede.');
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
      <div className="mb-7 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Conteúdo</p>
          <h1 className="text-2xl font-extrabold text-slate-800 mt-0.5">Slides / Fotos</h1>
          <p className="text-slate-400 text-sm mt-1">
            Gerencie as imagens exibidas no carrossel da home desta unidade.
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 bg-[#002855] text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-[#001a3d] disabled:opacity-60 transition"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saved ? 'Salvo!' : 'Salvar'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Adicionar novo slide */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 mb-5">
        <h2 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Adicionar Foto
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-500 mb-1">URL da Imagem *</label>
            <input
              type="url"
              value={newUrl}
              onChange={e => setNewUrl(e.target.value)}
              placeholder="https://exemplo.com/foto.jpg"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#002855]/30 focus:border-[#002855]"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Legenda (opcional)</label>
            <input
              type="text"
              value={newCaption}
              onChange={e => setNewCaption(e.target.value)}
              placeholder="Fachada da clínica, Sala de exames..."
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#002855]/30 focus:border-[#002855]"
            />
          </div>
        </div>
        {newUrl && (
          <div className="mt-3 rounded-xl overflow-hidden bg-slate-100 h-32 flex items-center justify-center">
            <img src={newUrl} alt="Pré-visualização" className="h-full w-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
          </div>
        )}
        <button
          onClick={addSlide}
          disabled={!newUrl.trim()}
          className="mt-3 flex items-center gap-2 bg-[#1B8B3A] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#166b2d] disabled:opacity-50 text-sm transition"
        >
          <Plus className="w-4 h-4" /> Adicionar
        </button>
      </div>

      {/* Lista de slides */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-50">
          <h2 className="font-bold text-slate-700 flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Slides Atuais ({slides.length})
          </h2>
        </div>
        {slides.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <ImageIcon className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Nenhum slide adicionado ainda.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-50">
            {slides.map((slide, i) => (
              <li key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition">
                <GripVertical className="w-4 h-4 text-slate-300 flex-shrink-0" />
                <div className="w-14 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                  <img src={slide.url} alt={slide.caption} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-700 truncate">{slide.caption || 'Sem legenda'}</p>
                  <p className="text-xs text-slate-400 truncate">{slide.url}</p>
                </div>
                <button
                  onClick={() => removeSlide(i)}
                  className="p-1.5 text-slate-300 hover:text-red-500 transition flex-shrink-0"
                  title="Remover"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
