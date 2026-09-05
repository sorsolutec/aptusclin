import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import UnitModernPage from '@/components/unit/UnitModernPage';
import { tenantConfig } from '@/lib/tenant';
import { createClient } from '@/utils/supabase/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const config = tenantConfig[id];
  const name = config?.nome || `Aptus Clin - Unidade ${id}`;

  return {
    title: `${name} | Medicina do Trabalho & SST`,
    description: `Clínica de Medicina e Segurança do Trabalho da Aptus Clin em ${config?.cidade || 'Mato Grosso'}. Exames Ocupacionais, ASO, PCMSO, PGR e eSocial.`,
  };
}

export default async function DynamicUnitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const fallback = tenantConfig[id];

  let remoteData: Record<string, unknown> | null = null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('unidades')
      .select('*')
      .eq('id', id)
      .single();

    if (!error && data) {
      remoteData = data;
    }
  } catch {
    // Fallback silencioso
  }

  if (!fallback && !remoteData) {
    notFound();
  }

  const initialData = {
    nome: (remoteData?.nome as string) || fallback?.nome,
    endereco: (remoteData?.endereco as string) || fallback?.endereco,
    telefone: (remoteData?.telefone as string) || fallback?.telefone,
    telefoneFixo: fallback?.telefoneFixo,
    email: (remoteData?.email as string) || fallback?.email,
    horario: (remoteData?.horario as string) || fallback?.horario,
    cnpj: (remoteData?.cnpj as string) || fallback?.cnpj,
    cnes: (remoteData?.cnes as string) || fallback?.cnes,
    whatsapp: (remoteData?.whatsapp as string) || fallback?.whatsapp,
    instagram: (remoteData?.instagram as string) || fallback?.instagram,
    slides: (remoteData?.slides as { url: string; caption?: string }[]) || fallback?.slides,
  };

  return <UnitModernPage unitId={id} initialData={initialData} />;
}
