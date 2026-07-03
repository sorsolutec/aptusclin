import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/admin/exames - list all exams (admin only)
export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const role = user?.user_metadata?.role ?? user?.app_metadata?.role;
  if (!user || role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { data, error } = await supabase.from('exames').select('*');
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(data);
}

// POST /api/admin/exames - create a new exam (admin only)
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const role = user?.user_metadata?.role ?? user?.app_metadata?.role;
  if (!user || role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const payload = await request.json();
  // Expected payload: { title, description?, start_at, end_at, location?, company_id }
  if (!payload.title || !payload.start_at || !payload.end_at) {
    return NextResponse.json({ error: 'Missing required exam fields' }, { status: 400 });
  }

  const { data, error } = await supabase.from('exames').insert({
    title: payload.title,
    description: payload.description || null,
    start_at: payload.start_at,
    end_at: payload.end_at,
    location: payload.location || null,
    company_id: payload.company_id || null,
  }).select('*').single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(data, { status: 201 });
}
