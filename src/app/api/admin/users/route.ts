import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/admin/users - list all users (admin only)
export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const role = user?.user_metadata?.role ?? user?.app_metadata?.role;
  if (!user || role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { data, error } = await supabase.from('users').select('id, email, role, created_at');
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(data);
}

// POST /api/admin/users - create a new user (admin only)
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const role = user?.user_metadata?.role ?? user?.app_metadata?.role;
  if (!user || role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const payload = await request.json();
  // Expect payload: { email: string, role?: string }
  if (!payload.email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  // Insert into a custom "users" table; adjust columns as needed.
  const { data, error } = await supabase.from('users').insert({
    email: payload.email,
    role: payload.role || 'user',
  }).select('*').single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(data, { status: 201 });
}
