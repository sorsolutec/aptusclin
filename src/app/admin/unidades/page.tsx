'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Image,
  Settings,
  ExternalLink,
  Loader2,
  Check,
  AlertCircle,
} from 'lucide-react';
import { tenantConfig } from '@/lib/tenant';

interface Unidade {
  id: string;
  nome: string;
  cidade: string;
  estado: string;
  endereco: string;
  telefone: string;
  email: string;
  descricao: string;
  slides: { url: string; caption?: string }[];
  ativo: boolean;
}

const FALLBACK_UNITS = Object.values(tenantConfig).map(u => ({
  id: u.id,
  nome: u.nome,
  cidade: u.cidade,
  estado: u.estado,
  endereco: '',
  telefone: '',
  email: '',
  descricao: '',
  slides: [],
  ativo: true,
}));

const UNIT_COLORS: Record<string, string> = {
  sorriso: '#002855',
  'hova-ubirata': '#1B8B3A',
  'boa-esperanca': '#d97706',
  'nova-mutum': '#7c3aed',
};

export default function AdminUnidadesPage() {
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(false);

  useEffect(() => {
    fetch('/api/unidades')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setUnidades(data);
        } else {
          setUnidades(FALLBACK_UNITS);
          setDbError(true);
        }
      })
      .catch(() => {
        setUnidades(FALLBACK_UNITS);
        setDbError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-7 h-7 text-[#002855] animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Admin Geral</p>
        <h1 className="text-2xl font-extrabold text-slate-800 mt-1">Unidades Aptusclin</h1>
        <p className="text-slate-400 text-sm mt-1">
          Selecione uma unidade para acessar o painel administrativo dedicado.
        </p>
      </div>

      {dbError && (
        <div className="mb-6 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-800">Tabela de unidades não encontrada</p>
            <p className="text-xs text-amber-700 mt-1">
              Execute o arquivo <code className="bg-amber-100 px-1 rounded">supabase/migrations/20240704_create_unidades_table.sql</code> no{' '}
              <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="underline hover:no-underline">
                Supabase SQL Editor
              </a>{' '}
              e depois acesse{' '}
              <a href="/api/admin/seed-unidades" target="_blank" className="underline hover:no-underline">
                /api/admin/seed-unidades
              </a>{' '}
              para semear os dados.
            </p>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-5">
        {unidades.map(u => {
          const color = UNIT_COLORS[u.id] ?? '#002855';
          return (
            <div
              key={u.id}
              className="bg-white rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow overflow-hidden"
            >
              {/* Topo colorido */}
              <div className="h-2 w-full" style={{ background: color }} />

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: `${color}15` }}
                      >
                        <Building2 className="w-4 h-4" style={{ color }} />
                      </div>
                      <h2 className="font-bold text-slate-800">{u.nome}</h2>
                    </div>
                    <p className="text-xs text-slate-400 ml-10">
                      {u.cidade}, {u.estado}
                    </p>
                  </div>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: `${color}15`, color }}
                  >
                    {u.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </div>

                {/* Info rápida */}
                <div className="space-y-1.5 mb-5">
                  {u.endereco && (
                    <div className="flex items-start gap-2 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                      <span>{u.endereco}</span>
                    </div>
                  )}
                  {u.telefone && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{u.telefone}</span>
                    </div>
                  )}
                  {u.email && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{u.email}</span>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-5 p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-1.5">
                    <Image className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs font-semibold text-slate-600">{u.slides.length} slide{u.slides.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-xs font-semibold text-slate-600">Ativo</span>
                  </div>
                </div>

                {/* Botões */}
                <div className="flex gap-2">
                  <Link
                    href={`/admin/unidades/${u.id}`}
                    className="flex-1 flex items-center justify-center gap-2 text-sm font-bold py-2.5 rounded-xl text-white transition hover:opacity-90"
                    style={{ background: color }}
                  >
                    <Settings className="w-4 h-4" />
                    Painel Admin
                  </Link>
                  <Link
                    href={`/portal/empresas/${u.id}`}
                    target="_blank"
                    className="flex items-center justify-center gap-1 text-sm font-semibold px-3 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                    title="Ver site da unidade"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
