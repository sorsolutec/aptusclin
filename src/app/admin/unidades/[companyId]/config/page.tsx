'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
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
  ExternalLink
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
}

export default function UnidadeConfigPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = use(params);
  const router = useRouter();

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
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUnidade = async () => {
      try {
        const res = await fetch(`/api/unidades/${companyId}`);
        if (!res.ok) throw new Error('Unidade não encontrada');
        const data = await res.json();
        
        // Trata retorno (pode vir como data.unidade ou data direto)
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
        });
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Erro ao carregar unidade');
      } finally {
        setLoading(false);
      }
    };
    fetchUnidade();
  }, [companyId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#002855]" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Botão Voltar */}
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
        <h1 className="text-2xl font-extrabold text-slate-800 mt-1">Configurar Unidade</h1>
        <p className="text-slate-400 text-sm mt-1">
          Edite as informações de exibição pública da unidade (endereço, telefone, redes sociais e foto).
        </p>
      </div>

      {/* Mensagens de feedback */}
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
        {/* Bloco 1: Informações Gerais */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-[#002855] uppercase tracking-wider flex items-center gap-2 border-b border-slate-50 pb-2">
            <Building2 className="w-4 h-4" />
            Informações Gerais
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-500">Nome da Unidade *</label>
              <input
                type="text"
                name="nome"
                required
                value={form.nome}
                onChange={handleChange}
                placeholder="Ex: Aptusclin Sorriso"
                className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#002855] transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500">Cidade *</label>
              <input
                type="text"
                name="cidade"
                required
                value={form.cidade}
                onChange={handleChange}
                placeholder="Ex: Sorriso"
                className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#002855] transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500">Estado *</label>
              <input
                type="text"
                name="estado"
                required
                value={form.estado}
                onChange={handleChange}
                placeholder="Ex: MT"
                maxLength={2}
                className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#002855] transition uppercase"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-500">Descrição Pública</label>
              <textarea
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                rows={3}
                placeholder="Uma breve descrição sobre os serviços ocupacionais e a clínica."
                className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#002855] transition resize-none"
              />
            </div>
          </div>
        </div>

        {/* Bloco 2: Contato e Endereço */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-[#002855] uppercase tracking-wider flex items-center gap-2 border-b border-slate-50 pb-2">
            <MapPin className="w-4 h-4" />
            Contato e Localização
          </h2>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Endereço Completo
              </label>
              <input
                type="text"
                name="endereco"
                value={form.endereco}
                onChange={handleChange}
                placeholder="Ex: Rua Mato Grosso, 2859 - Centro"
                className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#002855] transition"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  Telefone de Contato
                </label>
                <input
                  type="text"
                  name="telefone"
                  value={form.telefone}
                  onChange={handleChange}
                  placeholder="Ex: (66) 99644-0425"
                  className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#002855] transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  E-mail de Contato
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Ex: contato@aptusclin.com.br"
                  className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#002855] transition"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bloco 3: Foto de Capa / Upload */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-[#002855] uppercase tracking-wider flex items-center gap-2 border-b border-slate-50 pb-2">
            <ImageIcon className="w-4 h-4" />
            Imagem da Unidade
          </h2>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500">URL da Foto Principal</label>
              <input
                type="text"
                name="foto_url"
                value={form.foto_url}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#002855] transition"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              {form.foto_url ? (
                <div className="relative w-28 h-20 rounded-xl overflow-hidden bg-slate-200 flex-shrink-0">
                  <img src={form.foto_url} alt="Capa" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-28 h-20 rounded-xl bg-slate-200 flex items-center justify-center flex-shrink-0 text-slate-400 text-xs">
                  Sem Foto
                </div>
              )}
              <div className="text-center sm:text-left flex-1">
                <p className="text-xs font-bold text-slate-700">Prefere enviar um arquivo do seu computador?</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Fazer upload diretamente para o armazenamento seguro (Storage).</p>
                <Link
                  href={`/admin/unidades/${companyId}/foto`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#1B8B3A] hover:text-[#166b2d] mt-2 group"
                >
                  Ir para Upload de Foto
                  <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bloco 4: Redes Sociais */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-[#002855] uppercase tracking-wider flex items-center gap-2 border-b border-slate-50 pb-2">
            <Instagram className="w-4 h-4" />
            Redes Sociais
          </h2>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                <Instagram className="w-3.5 h-3.5 text-pink-500" />
                Instagram (Link completo ou @usuário)
              </label>
              <input
                type="text"
                name="instagram"
                value={form.instagram}
                onChange={handleChange}
                placeholder="Ex: https://instagram.com/aptusclin ou @aptusclin"
                className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#002855] transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                <Facebook className="w-3.5 h-3.5 text-blue-600" />
                Facebook (Link completo)
              </label>
              <input
                type="text"
                name="facebook"
                value={form.facebook}
                onChange={handleChange}
                placeholder="Ex: https://facebook.com/aptusclin"
                className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#002855] transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                WhatsApp (Número de telefone)
              </label>
              <input
                type="text"
                name="whatsapp"
                value={form.whatsapp}
                onChange={handleChange}
                placeholder="Ex: 5566996440425"
                className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#002855] transition"
              />
            </div>
          </div>
        </div>

        {/* Botão de envio */}
        <Button
          type="submit"
          disabled={saving}
          className="w-full bg-[#002855] hover:bg-[#001a3d] text-white py-3 rounded-xl font-bold transition shadow-md flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Salvando...
            </>
          ) : (
            'Salvar Configurações'
          )}
        </Button>
      </form>
    </div>
  );
}
