import { Metadata } from 'next';
import SorrisoUnitPage from '@/components/unit/SorrisoUnitPage';
import { tenantConfig } from '@/lib/tenant';
import { createClient } from '@/utils/supabase/server';

export const metadata: Metadata = {
  title: 'Aptus Clin Sorriso | Medicina do Trabalho, Exames Ocupacionais & SST',
  description:
    'Clínica especializada em Medicina e Segurança do Trabalho em Sorriso – MT. Exame Admissional, Periódico, Demissional, Audiometria, Espirometria, ECG, EEG, PGR, PCMSO, LTCAT e envio dos eventos de SST ao eSocial.',
  keywords: [
    'Medicina do Trabalho Sorriso MT',
    'Exame Admissional Sorriso',
    'ASO Sorriso',
    'PCMSO Sorriso',
    'PGR Sorriso MT',
    'eSocial SST Sorriso',
    'Audiometria Ocupacional Sorriso',
    'Aptus Clin Sorriso',
  ],
  openGraph: {
    title: 'Aptus Clin Sorriso | Medicina do Trabalho & SST',
    description:
      'Soluções completas em Medicina Ocupacional, ASO rápido e gestão de eSocial em Sorriso - MT. Atendimento na Rua Mato Grosso, 2859.',
    type: 'website',
  },
};

export default async function UnidadeSorrisoPage() {
  const fallback = tenantConfig['sorriso'];

  let remoteData: Record<string, unknown> | null = null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('unidades')
      .select('*')
      .eq('id', 'sorriso')
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
    slides: (remoteData?.slides as { url: string; caption?: string }[]) || fallback.slides,
  };

  return <SorrisoUnitPage initialData={initialData} />;
}
