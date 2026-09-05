import { Metadata } from 'next';
import UnitModernPage from '@/components/unit/UnitModernPage';
import { tenantConfig } from '@/lib/tenant';
import { createClient } from '@/utils/supabase/server';

export const metadata: Metadata = {
  title: 'Aptus Clin Nova Ubiratã | Medicina do Trabalho, Exames Ocupacionais & SST',
  description:
    'Clínica especializada em Medicina e Segurança do Trabalho em Nova Ubiratã – MT. Exame Admissional, Periódico, Demissional, Audiometria, Espirometria, ECG, EEG, PGR, PCMSO, LTCAT e eSocial. Atendimento na Av. Getúlio Vargas, 195.',
  keywords: [
    'Medicina do Trabalho Nova Ubiratã MT',
    'Exame Admissional Nova Ubiratã',
    'ASO Nova Ubiratã',
    'PCMSO Nova Ubiratã',
    'PGR Nova Ubiratã MT',
    'eSocial SST Nova Ubiratã',
    'Audiometria Ocupacional Nova Ubiratã',
    'Aptus Clin Nova Ubiratã',
  ],
  openGraph: {
    title: 'Aptus Clin Nova Ubiratã | Medicina do Trabalho & SST',
    description:
      'Soluções completas em Medicina Ocupacional, ASO rápido e gestão de eSocial em Nova Ubiratã - MT. Atendimento na Avenida Getúlio Vargas, 195.',
    type: 'website',
  },
};

export default async function UnidadeNovaUbirataPage() {
  const fallback = tenantConfig['hova-ubirata'] || tenantConfig['nova-ubirata'];

  let remoteData: Record<string, unknown> | null = null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('unidades')
      .select('*')
      .or('id.eq.hova-ubirata,id.eq.nova-ubirata')
      .limit(1)
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

  return <UnitModernPage unitId="hova-ubirata" initialData={initialData} />;
}
