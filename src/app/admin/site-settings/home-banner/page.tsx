'use client';

import NextImage from 'next/image';
import { useEffect, useState, useRef } from 'react';
import {
  Image as ImageIcon, Plus, Trash2, Loader2,
  Save, UploadCloud, AlertCircle, CheckCircle2, Home,
  Pencil, X, ArrowUp, ArrowDown, ExternalLink, MapPin, Building2
} from 'lucide-react';

interface Slide { url: string; caption: string; link?: string }

interface UnidadeItem {
  id: string;
  nome: string;
  cidade: string;
  estado: string;
  foto_url?: string;
}

const DEFAULT_UNIDADES: UnidadeItem[] = [
  { id: 'sorriso', nome: 'Aptus Clin Sorriso', cidade: 'Sorriso', estado: 'MT' },
  { id: 'boa-esperanca', nome: 'Unidade Boa Esperança do Norte', cidade: 'Boa Esperança do Norte', estado: 'MT' },
  { id: 'nova-ubirata', nome: 'Aptus Clin Nova Ubiratã', cidade: 'Nova Ubiratã', estado: 'MT' },
  { id: 'nova-mutum', nome: 'Aptus Clin Nova Mutum', cidade: 'Nova Mutum', estado: 'MT' },
];

export default function HomeBannerAdminPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const unitFileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Estados dos Slides do Banner Hero
  const [slides, setSlides] = useState<Slide[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newLink, setNewLink] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Estados de edição de slide existente
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editCaption, setEditCaption] = useState('');
  const [editLink, setEditLink] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [editUploading, setEditUploading] = useState(false);

  // Estados das Fotos das Unidades
  const [unidades, setUnidades] = useState<UnidadeItem[]>(DEFAULT_UNIDADES);
  const [uploadingUnitId, setUploadingUnitId] = useState<string | null>(null);
  const [unitSuccess, setUnitSuccess] = useState<string | null>(null);

  // Carrega dados iniciais do banner e das unidades
  useEffect(() => {
    Promise.all([
      fetch('/api/admin/site-settings/home-banner').then(r => r.ok ? r.json() : null),
      fetch('/api/unidades').then(r => r.ok ? r.json() : null),
    ])
      .then(([bannerData, unidadesData]) => {
        if (bannerData?.slides) setSlides(bannerData.slides);

        if (Array.isArray(unidadesData) && unidadesData.length > 0) {
          // Garante a presença das 4 unidades padrão combinando com dados do banco
          const merged = DEFAULT_UNIDADES.map(def => {
            const found = unidadesData.find((u: UnidadeItem) => u.id === def.id || (def.id === 'nova-ubirata' && u.id === 'hova-ubirata'));
            return {
              ...def,
              foto_url: found?.foto_url || found?.fotoUrl,
            };
          });
          setUnidades(merged);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // ── UPLOAD DE FOTO PARA UMA UNIDADE ─────────────────────────────────────────
  async function handleUnitPhotoUpload(unitId: string, file: File) {
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Formato não suportado para unidade. Use JPG, PNG, WEBP ou GIF.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Arquivo muito grande. Máximo: 10 MB.');
      return;
    }

    setError('');
    setUploadingUnitId(unitId);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`/api/unidades/${unitId}/foto`, {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? 'Erro ao fazer upload da foto da unidade.');
      } else {
        setUnidades(prev => prev.map(u => u.id === unitId ? { ...u, foto_url: json.foto_url } : u));
        setUnitSuccess(`Foto da unidade atualizada com sucesso!`);
        setTimeout(() => setUnitSuccess(null), 4000);
      }
    } catch {
      setError('Erro de rede ao enviar foto da unidade.');
    } finally {
      setUploadingUnitId(null);
    }
  }

  // ── REMOVER FOTO DE UMA UNIDADE ──────────────────────────────────────────────
  async function handleUnitPhotoDelete(unitId: string) {
    if (!confirm('Tem certeza que deseja remover a foto desta unidade?')) return;
    setUploadingUnitId(unitId);
    setError('');
    try {
      const res = await fetch(`/api/unidades/${unitId}/foto`, { method: 'DELETE' });
      if (res.ok) {
        setUnidades(prev => prev.map(u => u.id === unitId ? { ...u, foto_url: undefined } : u));
        setUnitSuccess('Foto da unidade removida.');
        setTimeout(() => setUnitSuccess(null), 3000);
      } else {
        const json = await res.json();
        setError(json.error ?? 'Erro ao remover foto da unidade.');
      }
    } catch {
      setError('Erro de rede ao remover foto da unidade.');
    } finally {
      setUploadingUnitId(null);
    }
  }

  // ── UPLOAD DE FOTO PARA O BANNER ─────────────────────────────────────────────
  async function handleFileUpload(file: File) {
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Formato não suportado. Use JPG, PNG, WEBP ou GIF.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Arquivo muito grande. Máximo: 10 MB.');
      return;
    }

    setError('');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/site-settings/home-banner/upload', {
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

  async function handleEditFileUpload(file: File) {
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Formato não suportado. Use JPG, PNG, WEBP ou GIF.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Arquivo muito grande. Máximo: 10 MB.');
      return;
    }

    setError('');
    setEditUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/site-settings/home-banner/upload', {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? 'Erro ao fazer upload da nova imagem.');
      } else {
        setEditUrl(json.url);
      }
    } catch {
      setError('Erro de rede ao enviar nova imagem.');
    } finally {
      setEditUploading(false);
    }
  }

  function addSlide() {
    if (!newUrl.trim()) return;
    setSlides(prev => [...prev, { url: newUrl.trim(), caption: newCaption.trim(), link: newLink.trim() }]);
    setNewUrl('');
    setNewCaption('');
    setNewLink('');
    setSaved(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function startEdit(idx: number) {
    setEditingIndex(idx);
    setEditCaption(slides[idx].caption || '');
    setEditLink(slides[idx].link || '');
    setEditUrl(slides[idx].url || '');
  }

  function cancelEdit() {
    setEditingIndex(null);
    setEditCaption('');
    setEditLink('');
    setEditUrl('');
    if (editFileInputRef.current) editFileInputRef.current.value = '';
  }

  function saveEdit(idx: number) {
    setSlides(prev => prev.map((s, i) => i === idx ? {
      ...s,
      url: editUrl.trim() || s.url,
      caption: editCaption.trim(),
      link: editLink.trim()
    } : s));
    setEditingIndex(null);
    setSaved(false);
  }

  function removeSlide(idx: number) {
    if (editingIndex === idx) cancelEdit();
    setSlides(prev => prev.filter((_, i) => i !== idx));
    setSaved(false);
  }

  function moveSlide(from: number, to: number) {
    if (to < 0 || to >= slides.length) return;
    setSlides(prev => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
    if (editingIndex === from) setEditingIndex(to);
    setSaved(false);
  }

  async function saveBanner() {
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/site-settings/home-banner', {
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
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Input oculto para upload de nova imagem durante edição de slide */}
      <input
        ref={editFileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={e => e.target.files?.[0] && handleEditFileUpload(e.target.files[0])}
      />

      {/* Cabeçalho Principal */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Gestão de Mídias</p>
          <h1 className="text-2xl font-extrabold text-slate-800 mt-0.5 flex items-center gap-2">
            <Home className="w-6 h-6 text-[#002855]" />
            Fotos da Página Principal
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Gerencie as fotos dos cards das unidades (Cidades Atendidas) e o carrossel do banner principal.
          </p>
        </div>
        <button
          onClick={saveBanner}
          disabled={saving}
          className="flex items-center gap-2 bg-[#002855] text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-[#001a3d] disabled:opacity-60 transition shadow-sm"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saved ? 'Salvo!' : 'Salvar Banner'}
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {saved && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-700 text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <p>Banner principal atualizado com sucesso!</p>
        </div>
      )}

      {unitSuccess && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-700 text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <p>{unitSuccess}</p>
        </div>
      )}

      {/* ── 1. SEÇÃO: FOTOS DAS UNIDADES (ESCOLHA SUA UNIDADE) ───────────────── */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs text-[#1B8B3A] font-extrabold uppercase tracking-widest bg-[#1B8B3A]/10 px-3 py-1 rounded-full">
              <MapPin className="w-3.5 h-3.5" /> Cidades Atendidas
            </span>
            <h2 className="text-xl font-extrabold text-[#002855] mt-2">
              Fotos dos Cards de Unidades na Página Inicial
            </h2>
            <p className="text-slate-500 text-xs mt-1">
              Altere aqui as fotos exibidas nos cards verticais da seção &quot;Escolha sua Unidade&quot;.
            </p>
          </div>
        </div>

        {/* Grid com os 4 cards das unidades */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {unidades.map(u => {
            const foto = u.foto_url || '/images/fictitious-clinic.jpg';
            const isUploadingThis = uploadingUnitId === u.id;

            return (
              <div
                key={u.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow"
              >
                {/* Inputs de arquivo ocultos por unidade */}
                <input
                  ref={el => { unitFileInputRefs.current[u.id] = el; }}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={e => e.target.files?.[0] && handleUnitPhotoUpload(u.id, e.target.files[0])}
                />

                <div>
                  {/* Visual Preview da Foto */}
                  <div className="relative aspect-[3/4] bg-slate-900 overflow-hidden">
                    <NextImage
                      src={foto}
                      alt={u.nome}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Overlay gradiente */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#002855]/90 via-[#002855]/20 to-transparent" />

                    {/* Badge estado */}
                    <div className="absolute top-2 left-2">
                      <span className="bg-white/90 text-[#002855] text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                        {u.estado}
                      </span>
                    </div>

                    {/* Título na foto */}
                    <div className="absolute bottom-2 left-3 right-3 text-white">
                      <p className="text-[10px] text-white/70 uppercase font-semibold tracking-wider">Unidade</p>
                      <p className="text-sm font-extrabold leading-snug">{u.cidade}</p>
                    </div>

                    {/* Overlay de carregamento */}
                    {isUploadingThis && (
                      <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white p-2">
                        <Loader2 className="w-6 h-6 animate-spin mb-2" />
                        <p className="text-xs font-bold">Enviando foto...</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="p-3 bg-white space-y-2 border-t border-slate-100">
                  <button
                    type="button"
                    disabled={isUploadingThis}
                    onClick={() => unitFileInputRefs.current[u.id]?.click()}
                    className="w-full flex items-center justify-center gap-1.5 bg-[#002855] hover:bg-[#001a3d] text-white text-xs font-bold py-2 rounded-xl transition shadow-sm disabled:opacity-50"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    {u.foto_url ? 'Trocar Foto' : 'Adicionar Foto'}
                  </button>

                  {u.foto_url && (
                    <button
                      type="button"
                      disabled={isUploadingThis}
                      onClick={() => handleUnitPhotoDelete(u.id)}
                      className="w-full flex items-center justify-center gap-1 text-[11px] text-red-500 hover:text-red-700 py-1 font-semibold transition"
                    >
                      <Trash2 className="w-3 h-3" />
                      Remover Foto
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 2. SEÇÃO: CARROSSEL HERO (TOPO DA HOMEPAGE) ────────────────────────── */}
      <div className="space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#002855]" />
              Carrossel Banner Principal (Topo)
            </h2>
            <p className="text-slate-400 text-xs mt-0.5">
              Imagens e avisos exibidos no banner rotativo principal da homepage.
            </p>
          </div>
        </div>

        {/* Adicionar novo slide */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-700 mb-3 text-sm flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#1B8B3A]" /> Adicionar Foto ao Banner Rotativo
          </h3>

          <div className="grid md:grid-cols-12 gap-4">
            {/* Zona de Drop / Upload */}
            <div className="md:col-span-6">
              <div
                className={`border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer h-44 flex flex-col items-center justify-center
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
                    <NextImage src={newUrl} alt="Preview" fill className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/45 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-xs font-bold">Alterar imagem selecionada</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <UploadCloud className="w-7 h-7 text-slate-400 mb-1" />
                    <p className="text-xs font-semibold text-slate-600">Arraste ou clique para enviar foto</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, WEBP até 10MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Legenda e Link */}
            <div className="md:col-span-6 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Legenda da Foto (opcional)</label>
                  <input
                    type="text"
                    value={newCaption}
                    onChange={e => setNewCaption(e.target.value)}
                    placeholder="Ex: Estrutura moderna para exames ocupacionais"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#002855]/30 focus:border-[#002855]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Link de Redirecionamento (opcional)</label>
                  <input
                    type="text"
                    value={newLink}
                    onChange={e => setNewLink(e.target.value)}
                    placeholder="Ex: https://wa.me/5566992680888 ou /unidades/sorriso"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#002855]/30 focus:border-[#002855]"
                  />
                </div>
              </div>

              <button
                onClick={addSlide}
                disabled={!newUrl.trim() || uploading}
                className="mt-3 w-full bg-[#1B8B3A] text-white font-bold py-2.5 rounded-lg hover:bg-[#166b2d] disabled:opacity-50 text-xs transition uppercase tracking-wider shadow-sm"
              >
                Adicionar ao Banner Rotativo
              </button>
            </div>
          </div>
        </div>

        {/* Lista de slides com edição */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#002855]" />
              Fotos Atuais no Banner Rotativo ({slides.length})
            </h3>
            <span className="text-[11px] text-slate-400">Você pode editar foto, legenda e link diretamente abaixo</span>
          </div>

          {slides.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <ImageIcon className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Nenhuma foto no banner rotativo. Adicione imagens acima.</p>
              <p className="text-xs mt-1 text-slate-300">Sem fotos, o site usará imagens padrão.</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {slides.map((slide, i) => (
                <li key={i} className="p-4 hover:bg-slate-50/70 transition">
                  {editingIndex === i ? (
                    /* Modo Edição Inline */
                    <div className="bg-blue-50/40 border border-blue-200 rounded-xl p-4 space-y-4">
                      <div className="flex items-center justify-between border-b border-blue-100 pb-2">
                        <span className="text-xs font-bold text-[#002855] uppercase tracking-wider flex items-center gap-1.5">
                          <Pencil className="w-3.5 h-3.5" /> Editando Foto #{i + 1}
                        </span>
                        <button
                          onClick={cancelEdit}
                          className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" /> Cancelar
                        </button>
                      </div>

                      <div className="grid sm:grid-cols-12 gap-4 items-center">
                        {/* Foto atual com botão trocar */}
                        <div className="sm:col-span-4">
                          <div className="relative h-28 w-full rounded-lg overflow-hidden bg-slate-200 border border-slate-300 group">
                            <NextImage src={editUrl} alt="Preview" fill className="object-cover" />
                            <div
                              onClick={() => editFileInputRef.current?.click()}
                              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition text-white text-[11px] font-bold p-1 text-center"
                            >
                              {editUploading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                              ) : (
                                <>
                                  <UploadCloud className="w-5 h-5 mb-1" />
                                  Clique para trocar foto
                                </>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => editFileInputRef.current?.click()}
                            disabled={editUploading}
                            className="mt-1.5 w-full text-center text-[11px] font-semibold text-[#002855] hover:underline flex items-center justify-center gap-1"
                          >
                            {editUploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <ImageIcon className="w-3 h-3" />}
                            {editUploading ? 'Enviando...' : 'Trocar Imagem'}
                          </button>
                        </div>

                        {/* Campos de texto */}
                        <div className="sm:col-span-8 space-y-2.5">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                              Legenda da Foto
                            </label>
                            <input
                              type="text"
                              value={editCaption}
                              onChange={e => setEditCaption(e.target.value)}
                              placeholder="Ex: Fachada da clínica, Recepção..."
                              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#002855]/30 focus:border-[#002855] bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                              Link de Redirecionamento
                            </label>
                            <input
                              type="text"
                              value={editLink}
                              onChange={e => setEditLink(e.target.value)}
                              placeholder="Ex: https://wa.me/5566992680888 ou /unidades/sorriso"
                              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#002855]/30 focus:border-[#002855] bg-white"
                            />
                          </div>

                          <div className="flex gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => saveEdit(i)}
                              className="flex-1 bg-[#1B8B3A] text-white text-xs font-bold py-2 rounded-lg hover:bg-[#166b2d] transition flex items-center justify-center gap-1.5 shadow-sm"
                            >
                              <Pencil className="w-3.5 h-3.5" /> Salvar Alterações
                            </button>
                            <button
                              type="button"
                              onClick={cancelEdit}
                              className="px-3 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-100 transition"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Modo Exibição Normal */
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col gap-0.5 flex-shrink-0">
                        <button
                          onClick={() => moveSlide(i, i - 1)}
                          disabled={i === 0}
                          title="Mover para cima"
                          className="p-1 text-slate-300 hover:text-slate-600 disabled:opacity-20 transition"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => moveSlide(i, i + 1)}
                          disabled={i === slides.length - 1}
                          title="Mover para baixo"
                          className="p-1 text-slate-300 hover:text-slate-600 disabled:opacity-20 transition"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="w-20 h-14 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200 relative group">
                        <NextImage src={slide.url} alt={slide.caption || 'Slide'} fill className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-slate-800 truncate">
                            {slide.caption || <span className="text-slate-400 font-normal italic">Sem legenda</span>}
                          </p>
                        </div>

                        {slide.link ? (
                          <p className="text-[11px] text-blue-600 truncate flex items-center gap-1 mt-0.5">
                            <ExternalLink className="w-3 h-3 flex-shrink-0" />
                            <span className="font-mono">{slide.link}</span>
                          </p>
                        ) : (
                          <p className="text-[10px] text-slate-400 mt-0.5 italic">Sem link de redirecionamento</p>
                        )}
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => startEdit(i)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:text-[#002855] hover:border-[#002855] text-xs font-semibold transition shadow-sm"
                          title="Editar foto, link e legenda"
                        >
                          <Pencil className="w-3.5 h-3.5 text-[#002855]" />
                          <span>Editar</span>
                        </button>

                        <button
                          onClick={() => removeSlide(i)}
                          className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                          title="Remover"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
