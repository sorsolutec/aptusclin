import { use } from 'react';
// Reutiliza a página de exames do admin geral, passando o companyId como contexto
// Futuramente pode ser filtrado por unidade diretamente aqui
import AdminExamesPage from '@/app/admin/exames/page';

export default function UnitExamesPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { companyId } = use(params);
  // TODO: filtrar exames por companyId
  return <AdminExamesPage />;
}
