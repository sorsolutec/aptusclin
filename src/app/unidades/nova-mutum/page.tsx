import { Metadata } from 'next';
import UnitModernPage from '@/components/unit/UnitModernPage';
import { tenantConfig } from '@/lib/tenant';
import { createClient } from '@/utils/supabase/server';

export const metadata: Metadata = {
  title: 'Aptus Clin Nova Mutum | Medicina do Trabalho, Exames Ocupacionais & SST',
  description:
    'Clínica especializada em Medicina e Segurança do Trabalho em Nova Mutum – MT. Exame Admissional, Periódico, Demissional, Audiometria, Espirometria, ECG, EEG, PGR, PCMSO, LTCAT e eSocial. Atendimento na Av. das Águias, 330 W.',
  keywords: [
    'Medicina do Trabalho Nova Mutum MT',
    'Exame Admissional Nova Mutum',
    'ASO Nova Mutum',
    'PCMSO Nova Mutum',
    'PGR Nova Mutum MT',
    'eSocial SST Nova Mutum',
    'Audiometria Ocupacional Nova Mutum',
    'Aptus Clin Nova Mutum',
  ],
  openGraph: {
    title: 'Aptus Clin Nova Mutum | Medicina do Trabalho & SST',
    description:
      'Soluções completas em Medicina Ocupacional, ASO rápido e gestão de eSocial em Nova Mutum - MT. Atendimento na Avenida das Águias, 330 W.',
    type: 'website',
  },
};

export default async function UnidadeNovaMutumPage() {
  const fallback = tenantConfig['nova-mutum'];

  let remoteData: Record<string, unknown> | null = null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('unidades')
      .select('*')
      .eq('id', 'nova-mutum')
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

  return <UnitModernPage unitId="nova-mutum" initialData={initialData} />;
}
