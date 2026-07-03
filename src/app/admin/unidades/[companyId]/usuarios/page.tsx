import { use } from 'react';
// Reutiliza a página de controle de usuários do admin geral, passando o companyId como contexto
import AdminUsuariosPage from '@/app/admin/usuarios/page';

export default function UnitUsuariosPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { companyId } = use(params);
  // TODO: filtrar usuários pertencentes à unidade
  return <AdminUsuariosPage />;
}
