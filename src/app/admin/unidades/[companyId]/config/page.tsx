'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// Página de Configurações da Unidade (admin/unidades/[companyId]/config)
// Exibe informações básicas da unidade e um botão placeholder para futuros ajustes.

export default function UnidadeConfigPage({ params }: { params: { companyId: string } }) {
  const { companyId } = params;
  const [unidade, setUnidade] = useState<{ nome?: string; descricao?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUnidade = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/unidades/${companyId}`);
        if (!res.ok) throw new Error('Unidade não encontrada');
        const data = await res.json();
        setUnidade(data.unidade ?? data);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Erro ao carregar unidade');
      } finally {
        setLoading(false);
      }
    };
    fetchUnidade();
  }, [companyId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#002855]" />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-600 p-4">{error}</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Configurações da Unidade</h1>
      <p className="text-slate-600">
        <strong>{unidade?.nome ?? companyId}</strong>
      </p>
      <p className="text-slate-500">{unidade?.descricao ?? 'Sem descrição cadastrada.'}</p>

      {/* Placeholder para futuros ajustes */}
      <Button disabled className="bg-[#002855] hover:bg-[#001a3d] text-white">
        Próximas Configurações (em breve)
      </Button>
    </div>
  );
}
