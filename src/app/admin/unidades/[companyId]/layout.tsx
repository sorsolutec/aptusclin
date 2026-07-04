import UnitAdminShell from '@/components/UnitAdminShell';
import Link from 'next/link';
import { Settings } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';

export default async function UnitAdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = await params;
  // Busca o nome completo da unidade (fallback para o ID)
  const supabase = await createClient();
  const { data: unidade } = await (supabase as any)
    .from('unidades')
    .select('nome')
    .eq('id', companyId)
    .single();
  const nomeUnidade = (unidade as any)?.nome ?? companyId;

  return (
    <UnitAdminShell companyId={companyId}>
      {/* Header com título completo e ícone de configuração */}
      <header className="flex items-center gap-2 px-6 py-4 bg-white border-b border-slate-200">
        <h2 className="text-xl font-semibold text-slate-800 capitalize">{nomeUnidade}</h2>
        <Link href={`/admin/unidades/${companyId}/config`}>  {/* redireciona ao clicar */}
          <Settings className="w-5 h-5 text-slate-500 hover:text-slate-800 cursor-pointer" />
        </Link>
      </header>

      {children}
    </UnitAdminShell>
  );
}
