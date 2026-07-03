import { json } from '@/utils/response';
import { getAdminClient } from '@/utils/supabase/serverAdmin';

export async function POST(request: Request) {
  // Parse form data
  const formData = await request.formData();
  const password = formData.get('password') as string;
  if (!password) {
    return json({ error: 'Password missing' }, { status: 400 });
  }

  const supabase = getAdminClient();

  // Get current user (admin client can read auth)
  const { data: { user }, error: getUserError } = await supabase.auth.getUser();
  if (getUserError || !user) {
    return json({ error: 'User not authenticated' }, { status: 401 });
  }

  // Update password and clear firstLogin flag
  const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
    password,
    user_metadata: { firstLogin: false }
  });

  if (updateError) {
    return json({ error: updateError.message }, { status: 500 });
  }

  // Respond success (you could also redirect client-side)
  return json({ message: 'Senha alterada com sucesso' }, { status: 200 });
}
