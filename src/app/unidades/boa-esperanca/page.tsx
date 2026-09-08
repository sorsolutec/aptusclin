import { Metadata } from 'next';
import UnitModernPage from '@/components/unit/UnitModernPage';
import { tenantConfig } from '@/lib/tenant';
import { createClient } from '@/utils/supabase/server';

export const metadata: Metadata = {
  title: 'Unidade de Boa Esperança do Norte | Aptusclin Medicina do Trabalho & SST',
  description:
    'Unidade de Boa Esperança do Norte, Rua das Azaleias, 1627, Centro. Atendimento em Medicina Ocupacional, Exame Admissional, Periódico, Demissional, PCMSO e eSocial. WhatsApp: (66) 99268-0888.',
  keywords: [
    'Unidade de Boa Esperança do Norte',
    'Medicina do Trabalho Boa Esperança do Norte MT',
    'Exame Admissional Boa Esperança do Norte',
    'ASO Boa Esperança do Norte',
    'PCMSO Boa Esperança do Norte',
    'PGR Boa Esperança do Norte MT',
    'eSocial SST Boa Esperança do Norte',
    'Aptusclin Boa Esperança do Norte',
  ],
  openGraph: {
    title: 'Unidade de Boa Esperança do Norte | Aptusclin Medicina do Trabalho & SST',
    description:
      'Unidade de Boa Esperança do Norte, Rua das Azaleias, 1627, Centro. WhatsApp: (66) 99268-0888.',
    type: 'website',
  },
};

export const dynamic = 'force-dynamic';

export default async function UnidadeBoaEsperancaPage() {
  const fallback = tenantConfig['boa-esperanca'];

  let remoteData: Record<string, unknown> | null = null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('unidades')
      .select('*')
      .eq('id', 'boa-esperanca')
      .single();

    if (!error && data) {
      remoteData = data;
    }
  } catch {
    // Fallback silencioso
  }

  const initialData = {
    nome: (remoteData?.nome as string) || fallback.nome,
    endereco: (remoteData?.endereco as string) || fallback.endereco,
    telefone: (remoteData?.telefone as string) || fallback.telefone,
    telefoneFixo: fallback.telefoneFixo,
    email: (remoteData?.email as string) || fallback.email,
    horario: (remoteData?.horario as string) || fallback.horario,
    cnpj: (remoteData?.cnpj as string) || fallback.cnpj,
    cnes: (remoteData?.cnes as string) || fallback.cnes,
    whatsapp: (remoteData?.whatsapp as string) || fallback.whatsapp,
    instagram: (remoteData?.instagram as string) || fallback.instagram,
    fotoUrl: (remoteData?.foto_url as string) || fallback.fotoUrl,
    slides: remoteData ? (remoteData.slides as { url: string; caption?: string }[] ?? []) : (fallback.slides ?? []),
  };

  return <UnitModernPage unitId="boa-esperanca" initialData={initialData} />;
}
