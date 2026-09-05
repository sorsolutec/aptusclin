import UnitHomePage from '@/components/UnitHomePage';
import SorrisoUnitPage from '@/components/unit/SorrisoUnitPage';
import { tenantConfig } from '@/lib/tenant';
import { createClient } from '@/utils/supabase/server';

export default async function CompanyHome({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = await params;

  if (companyId === 'sorriso') {
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
      slides: (remoteData?.slides as { url: string; caption?: string }[]) || fallback.slides,
    };

    return <SorrisoUnitPage initialData={initialData} />;
  }

  return <UnitHomePage companyId={companyId} />;
}
