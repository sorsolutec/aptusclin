'use client';

import { use, useEffect, useRef, useState } from 'react';
import {
  UploadCloud,
  Trash2,
  Loader2,
  CheckCircle2,
  ImageIcon,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

export default function FotoAdminPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = use(params);
  const inputRef = useRef<HTMLInputElement>(null);

  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // Busca a foto atual da unidade
  useEffect(() => {
    fetch(`/api/unidades/${companyId}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.foto_url) setFotoUrl(data.foto_url);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [companyId]);

  function handleFileSelect(file: File | null) {
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
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function handleUpload() {
    const file = inputRef.current?.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`/api/unidades/${companyId}/foto`, {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? 'Erro ao fazer upload.');
      } else {
        setFotoUrl(json.foto_url);
        setPreview(null);
        if (inputRef.current) inputRef.current.value = '';
        setSaved(true);
        setTimeout(() => setSaved(false), 4000);
      }
    } catch {
      setError('Erro de rede. Tente novamente.');
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Tem certeza que deseja remover a foto da unidade?')) return;
    setDeleting(true);
    setError('');
    try {
      const res = await fetch(`/api/unidades/${companyId}/foto`, { method: 'DELETE' });
      if (res.ok) {
        setFotoUrl(null);
      } else {
        const json = await res.json();
        setError(json.error ?? 'Erro ao remover.');
      }
    } catch {
      setError('Erro de rede.');
    } finally {
      setDeleting(false);
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
    <div className="max-w-2xl mx-auto">
      {/* Cabeçalho */}
      <div className="mb-7">
        <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Conteúdo</p>
        <h1 className="text-2xl font-extrabold text-slate-800 mt-0.5">Foto da Unidade</h1>
        <p className="text-slate-400 text-sm mt-1">
          Esta foto é exibida na página pública da unidade {companyId}.
        </p>
      </div>

      {/* Mensagens de feedback */}
      {error && (
        <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      {saved && (
        <div className="mb-5 flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <p className="text-sm text-emerald-700 font-semibold">Foto salva com sucesso!</p>
        </div>
      )}

      {/* Foto atual */}
      {fotoUrl && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-slate-700 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Foto Atual
            </h2>
            <div className="flex gap-2">
              <Link
                href={`/unidade/${companyId}`}
                target="_blank"
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-[#002855] transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Ver na página
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-700 transition disabled:opacity-50"
              >
                {deleting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                Remover
              </button>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden aspect-[16/7] bg-slate-100">
            <img
              src={fotoUrl}
              alt="Foto da unidade"
              className="w-full h-full object-cover"
              onError={e => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        </div>
      )}

      {/* Área de upload */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5">
        <h2 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
          <UploadCloud className="w-4 h-4" />
          {fotoUrl ? 'Substituir Foto' : 'Adicionar Foto'}
        </h2>

        {/* Zona de drag-and-drop */}
        <div
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer
            ${dragOver
              ? 'border-[#1B8B3A] bg-[#1B8B3A]/5'
              : 'border-slate-300 hover:border-[#002855] hover:bg-slate-50'
            }`}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files[0];
            if (file && inputRef.current) {
              const dt = new DataTransfer();
              dt.items.add(file);
              inputRef.current.files = dt.files;
              handleFileSelect(file);
            }
          }}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={e => handleFileSelect(e.target.files?.[0] ?? null)}
          />

          {preview ? (
            <div className="space-y-3">
              <div className="rounded-xl overflow-hidden h-48 bg-slate-100">
                <img src={preview} alt="Pré-visualização" className="w-full h-full object-cover" />
              </div>
              <p className="text-xs text-slate-400">Clique para escolher outro arquivo</p>
            </div>
          ) : (
            <div>
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <UploadCloud className="w-7 h-7 text-slate-400" />
              </div>
              <p className="font-semibold text-slate-700">
                Arraste uma imagem aqui ou clique para selecionar
              </p>
              <p className="text-xs text-slate-400 mt-1.5">
                JPG, PNG, WEBP ou GIF · Máximo 5 MB
              </p>
            </div>
          )}
        </div>

        {/* Botão de salvar */}
        {preview && (
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-[#1B8B3A] hover:bg-[#166b2d] text-white font-bold py-3 rounded-xl transition disabled:opacity-60"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4" />
                Salvar Foto
              </>
            )}
          </button>
        )}
      </div>

      {/* Dica */}
      <p className="text-xs text-slate-400 mt-4 text-center">
        Recomendado: proporção 4:3 ou 16:9 · mínimo 800×600 px
      </p>
    </div>
  );
}
