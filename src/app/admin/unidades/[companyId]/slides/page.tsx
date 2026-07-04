'use client';

import { use, useEffect, useState, useRef } from 'react';
import { Image as ImageIcon, Plus, Trash2, GripVertical, Loader2, Save, UploadCloud, AlertCircle } from 'lucide-react';

interface Slide { url: string; caption: string }

export default function SlidesAdminPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = use(params);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [slides, setSlides] = useState<Slide[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    fetch(`/api/unidades/${companyId}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.slides) setSlides(data.slides);
        setLoading(false);
      });
  }, [companyId]);

  async function handleFileUpload(file: File) {
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Formato não suportado. Use JPG, PNG, WEBP ou GIF.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Arquivo muito grande. Máximo: 5 MB.');
      return;
    }

    setError('');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`/api/unidades/${companyId}/slides/upload`, {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? 'Erro ao fazer upload da imagem.');
      } else {
        setNewUrl(json.url);
      }
    } catch {
      setError('Erro de rede ao enviar arquivo.');
    } finally {
      setUploading(false);
    }
  }

  function addSlide() {
    if (!newUrl.trim()) return;
    setSlides(prev => [...prev, { url: newUrl.trim(), caption: newCaption.trim() }]);
    setNewUrl('');
    setNewCaption('');
    setSaved(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
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
          <h1 className="text-2xl font-extrabold text-slate-800 mt-0.5">Slides / Fotos do Carrossel</h1>
          <p className="text-slate-400 text-sm mt-1">
            Gerencie as imagens exibidas no carrossel de slides na home desta unidade.
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 bg-[#002855] text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-[#001a3d] disabled:opacity-60 transition shadow-sm"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saved ? 'Salvo!' : 'Salvar Alterações'}
        </button>
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {saved && (
        <div className="mb-4 flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-700 text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <p>Alterações salvas com sucesso!</p>
        </div>
      )}

      {/* Adicionar novo slide */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 mb-5 shadow-sm">
        <h2 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
          <Plus className="w-4 h-4 text-[#1B8B3A]" /> Adicionar Foto ao Carrossel
        </h2>
        
        <div className="grid md:grid-cols-12 gap-4">
          {/* Zona de Drop / Upload */}
          <div className="md:col-span-6">
            <div
              className={`border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer h-36 flex flex-col items-center justify-center
                ${dragOver
                  ? 'border-[#1B8B3A] bg-[#1B8B3A]/5'
                  : 'border-slate-200 hover:border-[#002855] hover:bg-slate-50'
                }`}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => {
                e.preventDefault();
                setDragOver(false);
                const file = e.dataTransfer.files[0];
                if (file) handleFileUpload(file);
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              />

              {uploading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="w-6 h-6 text-[#002855] animate-spin mb-2" />
                  <p className="text-xs text-slate-500 font-semibold">Enviando imagem...</p>
                </div>
              ) : newUrl ? (
                <div className="w-full h-full relative group rounded-lg overflow-hidden">
                  <img src={newUrl} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/45 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs font-bold">Alterar imagem</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <UploadCloud className="w-7 h-7 text-slate-400 mb-1" />
                  <p className="text-xs font-semibold text-slate-600">Arraste ou clique para enviar foto</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, WEBP até 5MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Dados Legenda */}
          <div className="md:col-span-6 flex flex-col justify-between">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Legenda da Foto (opcional)</label>
              <input
                type="text"
                value={newCaption}
                onChange={e => setNewCaption(e.target.value)}
                placeholder="Fachada, Recepção, Sala de exames..."
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#002855]/30 focus:border-[#002855]"
              />
            </div>

            <button
              onClick={addSlide}
              disabled={!newUrl.trim() || uploading}
              className="mt-3 w-full bg-[#1B8B3A] text-white font-bold py-2.5 rounded-lg hover:bg-[#166b2d] disabled:opacity-50 text-xs transition uppercase tracking-wider"
            >
              Adicionar ao Carrossel
            </button>
          </div>
        </div>
      </div>

      {/* Lista de slides */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-50">
          <h2 className="font-bold text-slate-700 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#002855]" />
            Fotos Atuais no Carrossel ({slides.length})
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
                <div className="w-16 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                  <img src={slide.url} alt={slide.caption} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-700 truncate">{slide.caption || 'Sem legenda'}</p>
                  <p className="text-[10px] text-slate-400 truncate">{slide.url}</p>
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
