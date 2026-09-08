import { json } from '@/utils/response';
import { getAdminClient } from '@/utils/supabase/serverAdmin';

export async function GET(request: Request) {
  // Em produção, exige header ou trava por segurança
  const url = new URL(request.url);
  const secretParam = url.searchParams.get('secret');
  const secretEnv = process.env.ADMIN_SEED_SECRET;

  if (process.env.NODE_ENV === 'production' && secretEnv && secretParam !== secretEnv) {
    return json({ error: 'Endpoint de seed desativado em produção sem o secret adequado.' }, { status: 403 });
  }

  const supabase = getAdminClient();

  // Verifica se o usuário admin já existe
  const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    return json({ error: listError.message }, { status: 500 });
  }
  const adminExists = usersData?.users?.some(u => u.email === 'admin@aptusclin.com');
  if (adminExists) {
    return json({ message: 'O usuário administrador já existe no sistema com a sua senha cadastrada.' });
  }

  // Cria o admin inicial apenas se não existir nenhum
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'admin@aptusclin.com',
    password: 'TempPassword123!',
    email_confirm: true,
    user_metadata: { role: 'admin', firstLogin: true }
  });

  if (error) {
    return json({ error: error.message }, { status: 500 });
  }

  return json({ message: 'Administrador inicial criado com sucesso', user: data?.user });
}

