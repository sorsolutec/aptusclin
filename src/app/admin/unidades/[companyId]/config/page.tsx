'use client';

import NextImage from 'next/image';
import { use, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Loader2,
  Building2,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  UploadCloud,
  Trash2,
  Save,
  Clock,
} from 'lucide-react';
import { Instagram, Facebook } from '@/components/icons/SocialIcons';
import Link from 'next/link';

interface UnidadeForm {
  nome: string;
  cidade: string;
  estado: string;
  endereco: string;
  telefone: string;
  email: string;
  descricao: string;
  foto_url: string;
  instagram: string;
  facebook: string;
  whatsapp: string;
  horario: string;
}

const FIELD_CLASS =
  'w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#002855] focus:ring-2 focus:ring-[#002855]/10 transition bg-white';
const LABEL_CLASS = 'block text-xs font-bold text-slate-500 mb-1';

export default function UnidadeConfigPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = use(params);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<UnidadeForm>({
    nome: '',
    cidade: '',
    estado: 'MT',
    endereco: '',
    telefone: '',
    email: '',
    descricao: '',
    foto_url: '',
    instagram: '',
    facebook: '',
    whatsapp: '',
    horario: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Upload states
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [deletingFoto, setDeletingFoto] = useState(false);

  useEffect(() => {
    fetch(`/api/unidades/${companyId}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const unit = data.unidade ?? data;
        setForm({
          nome: unit.nome ?? '',
          cidade: unit.cidade ?? '',
          estado: unit.estado ?? 'MT',
          endereco: unit.endereco ?? '',
          telefone: unit.telefone ?? '',
          email: unit.email ?? '',
          descricao: unit.descricao ?? '',
          foto_url: unit.foto_url ?? '',
          instagram: unit.instagram ?? '',
          facebook: unit.facebook ?? '',
          whatsapp: unit.whatsapp ?? '',
          horario: unit.horario ?? '',
        });
      })
      .catch(() => setError('Erro ao carregar dados da unidade.'))
      .finally(() => setLoading(false));
  }, [companyId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // ── Upload de foto ─────────────────────────────────────────────────────────
  function validateFile(file: File): string | null {
    const valid = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!valid.includes(file.type)) return 'Formato inválido. Use JPG, PNG, WEBP ou GIF.';
    if (file.size > 8 * 1024 * 1024) return 'Arquivo muito grande. Máximo: 8 MB.';
    return null;
  }

  async function handleFileUpload(file: File) {
    const err = validateFile(file);
    if (err) { setUploadError(err); return; }
    setUploadError('');
    setUploading(true);

    // Preview local enquanto envia
    const reader = new FileReader();
    reader.onload = e => setPreviewUrl(e.target?.result as string);
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`/api/unidades/${companyId}/foto`, {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) {
        setUploadError(json.error ?? 'Erro ao fazer upload.');
        setPreviewUrl(null);
      } else {
        setForm(prev => ({ ...prev, foto_url: json.foto_url }));
        setPreviewUrl(null);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      }
    } catch {
      setUploadError('Erro de rede. Tente novamente.');
      setPreviewUrl(null);
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteFoto() {
    if (!confirm('Remover a foto da unidade?')) return;
    setDeletingFoto(true);
    try {
      const res = await fetch(`/api/unidades/${companyId}/foto`, { method: 'DELETE' });
      if (res.ok) {
        setForm(prev => ({ ...prev, foto_url: '' }));
      } else {
        const json = await res.json();
        setUploadError(json.error ?? 'Erro ao remover foto.');
      }
    } catch {
      setUploadError('Erro de rede.');
    } finally {
      setDeletingFoto(false);
    }
  }

  // ── Salvar formulário ──────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch(`/api/unidades/${companyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error ?? 'Erro ao salvar configurações');
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro de rede. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#002855]" />
      </div>
    );
  }

  const currentFoto = previewUrl || form.foto_url;

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href={`/admin/unidades/${companyId}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[#002855] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar para o Painel da Unidade
        </Link>
      </div>

      {/* Cabeçalho */}
      <div className="mb-8">
        <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Configurações</p>
        <h1 className="text-2xl font-extrabold text-slate-800 mt-1">Editar Unidade</h1>
        <p className="text-slate-400 text-sm mt-1">
          Edite a foto, informações de contato, endereço e redes sociais que aparecem no site público.
        </p>
      </div>

      {/* Feedback global */}
      {error && (
        <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      {success && (
        <div className="mb-6 flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <p className="text-sm text-emerald-700 font-semibold">Configurações salvas com sucesso!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── BLOCO 1: FOTO DA UNIDADE ─────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h2 className="text-sm font-bold text-[#002855] uppercase tracking-wider flex items-center gap-2 border-b border-slate-50 pb-3 mb-4">
            <ImageIcon className="w-4 h-4" />
            Foto da Unidade
          </h2>

          {/* Feedback upload */}
          {uploadError && (
            <div className="mb-4 flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700">{uploadError}</p>
            </div>
          )}
          {uploadSuccess && (
            <div className="mb-4 flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <p className="text-xs text-emerald-700 font-semibold">Foto enviada com sucesso!</p>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4 items-start">
            {/* Preview da foto */}
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group">
              {currentFoto ? (
                <>
                  <NextImage
                    src={currentFoto}
                    alt="Foto da unidade"
                    fill
                    className="object-cover"
                    unoptimized={currentFoto.startsWith('data:')}
                  />
                  {uploading && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                      <Loader2 className="w-7 h-7 text-white animate-spin mb-2" />
                      <p className="text-white text-xs font-semibold">Enviando...</p>
                    </div>
                  )}
                  {/* Overlay de ações */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-end justify-between p-3 opacity-0 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 bg-white text-[#002855] text-[11px] font-bold px-3 py-1.5 rounded-lg shadow hover:bg-slate-50 transition"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      Trocar foto
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteFoto}
                      disabled={deletingFoto}
                      className="flex items-center gap-1 bg-red-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow hover:bg-red-600 transition disabled:opacity-60"
                    >
                      {deletingFoto ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                      Remover
                    </button>
                  </div>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 hover:text-[#002855] hover:bg-slate-50 transition"
                >
                  <ImageIcon className="w-8 h-8 mb-2 opacity-40" />
                  <span className="text-xs font-semibold">Sem foto</span>
                  <span className="text-[11px] opacity-60">Clique para adicionar</span>
                </button>
              )}
            </div>

            {/* Área de drag-and-drop / upload */}
            <div className="space-y-3">
              <div
                className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all
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
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                />
                {uploading ? (
                  <div className="flex flex-col items-center py-2">
                    <Loader2 className="w-6 h-6 text-[#002855] animate-spin mb-2" />
                    <p className="text-xs font-semibold text-slate-600">Enviando imagem...</p>
                  </div>
                ) : (
                  <div className="py-2">
                    <UploadCloud className="w-7 h-7 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-700">Arraste ou clique para enviar</p>
                    <p className="text-[11px] text-slate-400 mt-1">JPG, PNG, WEBP · máx. 8 MB</p>
                  </div>
                )}
              </div>

              {/* URL manual como alternativa */}
              <div>
                <label className={LABEL_CLASS}>Ou cole uma URL de imagem</label>
                <input
                  type="text"
                  name="foto_url"
                  value={form.foto_url}
                  onChange={handleChange}
                  placeholder="https://..."
                  className={FIELD_CLASS}
                />
              </div>

              <p className="text-[11px] text-slate-400">
                Proporção recomendada: <strong>4:3</strong> ou <strong>16:9</strong> · mínimo 800×600 px
              </p>
            </div>
          </div>
        </div>

        {/* ── BLOCO 2: INFORMAÇÕES GERAIS ──────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-[#002855] uppercase tracking-wider flex items-center gap-2 border-b border-slate-50 pb-3">
            <Building2 className="w-4 h-4" />
            Informações Gerais
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={LABEL_CLASS}>Nome da Unidade *</label>
              <input
                type="text"
                name="nome"
                required
                value={form.nome}
                onChange={handleChange}
                placeholder="Ex: Aptusclin Sorriso"
                className={FIELD_CLASS}
              />
            </div>

            <div>
              <label className={LABEL_CLASS}>Cidade *</label>
              <input
                type="text"
                name="cidade"
                required
                value={form.cidade}
                onChange={handleChange}
                placeholder="Ex: Sorriso"
                className={FIELD_CLASS}
              />
            </div>

            <div>
              <label className={LABEL_CLASS}>Estado *</label>
              <input
                type="text"
                name="estado"
                required
                value={form.estado}
                onChange={handleChange}
                placeholder="Ex: MT"
                maxLength={2}
                className={`${FIELD_CLASS} uppercase`}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={LABEL_CLASS}>Descrição Pública</label>
              <textarea
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                rows={3}
                placeholder="Uma breve descrição sobre os serviços e a clínica."
                className={`${FIELD_CLASS} resize-none`}
              />
            </div>
          </div>
        </div>

        {/* ── BLOCO 3: CONTATO E ENDEREÇO ──────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-[#002855] uppercase tracking-wider flex items-center gap-2 border-b border-slate-50 pb-3">
            <MapPin className="w-4 h-4" />
            Contato e Localização
          </h2>

          <div>
            <label className={`${LABEL_CLASS} flex items-center gap-1.5`}>
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> Endereço Completo
            </label>
            <input
              type="text"
              name="endereco"
              value={form.endereco}
              onChange={handleChange}
              placeholder="Ex: Rua Mato Grosso, 2859 - Centro"
              className={FIELD_CLASS}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={`${LABEL_CLASS} flex items-center gap-1.5`}>
                <Phone className="w-3.5 h-3.5 text-slate-400" /> Telefone de Contato
              </label>
              <input
                type="text"
                name="telefone"
                value={form.telefone}
                onChange={handleChange}
                placeholder="Ex: (66) 99644-0425"
                className={FIELD_CLASS}
              />
            </div>

            <div>
              <label className={`${LABEL_CLASS} flex items-center gap-1.5`}>
                <Mail className="w-3.5 h-3.5 text-slate-400" /> E-mail de Contato
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Ex: contato@aptusclin.com.br"
                className={FIELD_CLASS}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={`${LABEL_CLASS} flex items-center gap-1.5`}>
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Horário de Atendimento
              </label>
              <input
                type="text"
                name="horario"
                value={form.horario}
                onChange={handleChange}
                placeholder="Ex: Segunda a Sexta: 07:00–11:00, 13:00–17:00"
                className={FIELD_CLASS}
              />
            </div>
          </div>
        </div>

        {/* ── BLOCO 4: REDES SOCIAIS ────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-[#002855] uppercase tracking-wider flex items-center gap-2 border-b border-slate-50 pb-3">
            <Instagram className="w-4 h-4" />
            Redes Sociais e WhatsApp
          </h2>

          <div className="space-y-4">
            <div>
              <label className={`${LABEL_CLASS} flex items-center gap-1.5`}>
                <Instagram className="w-3.5 h-3.5 text-pink-500" /> Instagram
              </label>
              <input
                type="text"
                name="instagram"
                value={form.instagram}
                onChange={handleChange}
                placeholder="Ex: https://instagram.com/aptusclin ou @aptusclin"
                className={FIELD_CLASS}
              />
            </div>

            <div>
              <label className={`${LABEL_CLASS} flex items-center gap-1.5`}>
                <Facebook className="w-3.5 h-3.5 text-blue-600" /> Facebook
              </label>
              <input
                type="text"
                name="facebook"
                value={form.facebook}
                onChange={handleChange}
                placeholder="Ex: https://facebook.com/aptusclin"
                className={FIELD_CLASS}
              />
            </div>

            <div>
              <label className={`${LABEL_CLASS} flex items-center gap-1.5`}>
                <MessageSquare className="w-3.5 h-3.5 text-emerald-500" /> WhatsApp (somente números)
              </label>
              <input
                type="text"
                name="whatsapp"
                value={form.whatsapp}
                onChange={handleChange}
                placeholder="Ex: 5566992680888"
                className={FIELD_CLASS}
              />
              {form.whatsapp && (
                <p className="text-[11px] text-slate-400 mt-1">
                  Link gerado:{' '}
                  <a
                    href={`https://wa.me/${form.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#1B8B3A] hover:underline"
                  >
                    https://wa.me/{form.whatsapp}
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── BOTÃO SALVAR ─────────────────────────────────────────────────── */}
        <button
          type="submit"
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-[#002855] hover:bg-[#001a3d] text-white py-3.5 rounded-2xl font-bold text-sm transition shadow-md disabled:opacity-60"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Salvar Todas as Configurações
            </>
          )}
        </button>
      </form>
    </div>
  );
}
