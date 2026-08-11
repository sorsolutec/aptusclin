import { json } from '@/utils/response';
import { createClient } from '@/utils/supabase/server';
import { getAdminClient } from '@/utils/supabase/serverAdmin';

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = formData.get('password') as string;

  if (!password) {
    return json({ error: 'Password missing' }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: getUserError,
  } = await supabase.auth.getUser();

  if (getUserError || !user) {
    return json({ error: 'User not authenticated' }, { status: 401 });
  }

  const adminSupabase = getAdminClient();
  const { error: updateError } = await adminSupabase.auth.admin.updateUserById(user.id, {
    password,
    user_metadata: { ...user.user_metadata, firstLogin: false },
  });

  if (updateError) {
    return json({ error: updateError.message }, { status: 500 });
  }

  return json({ message: 'Senha alterada com sucesso' }, { status: 200 });
}
