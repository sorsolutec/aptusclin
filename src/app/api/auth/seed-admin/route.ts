import { json } from '@/utils/response';
import { getAdminClient } from '@/utils/supabase/serverAdmin';

export async function GET() {
  const supabase = getAdminClient();

  // Check if admin already exists
  const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    return json({ error: listError.message }, { status: 500 });
  }
  const adminExists = usersData?.users?.some(u => u.email === 'admin@aptusclin.com');
  if (adminExists) {
    return json({ message: 'Admin user already exists' });
  }

  // Create admin with temporary password and firstLogin flag
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'admin@aptusclin.com',
    password: 'TempPassword123!',
    email_confirm: true,
    user_metadata: { role: 'admin', firstLogin: true }
  });

  if (error) {
    return json({ error: error.message }, { status: 500 });
  }

  return json({ message: 'Admin user created', user: data?.user });
}
