import { Metadata } from 'next';
import UnitModernPage from '@/components/unit/UnitModernPage';
import { tenantConfig } from '@/lib/tenant';
import { createClient } from '@/utils/supabase/server';

export const metadata: Metadata = {
  title: 'Aptus Clin Boa Esperança do Norte | Medicina do Trabalho & SST',
  description:
    'Clínica especializada em Medicina e Segurança do Trabalho em Boa Esperança do Norte – MT. Exame Admissional, Periódico, Demissional, Audiometria, Espirometria, ECG, EEG, PGR, PCMSO e eSocial. Atendimento na Rua das Azaleias, 1627.',
  keywords: [
    'Medicina do Trabalho Boa Esperança do Norte MT',
    'Exame Admissional Boa Esperança do Norte',
    'ASO Boa Esperança do Norte',
    'PCMSO Boa Esperança do Norte',
    'PGR Boa Esperança do Norte MT',
    'eSocial SST Boa Esperança do Norte',
    'Aptus Clin Boa Esperança do Norte',
  ],
  openGraph: {
    title: 'Aptus Clin Boa Esperança do Norte | Medicina do Trabalho & SST',
    description:
      'Soluções completas em Medicina Ocupacional, ASO rápido e gestão de eSocial em Boa Esperança do Norte - MT. Atendimento na Rua das Azaleias, 1627.',
    type: 'website',
  },
};

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
    slides: (remoteData?.slides as { url: string; caption?: string }[]) || fallback.slides,
  };

  return <UnitModernPage unitId="boa-esperanca" initialData={initialData} />;
}
