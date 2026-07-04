import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Event } from '@/types/event';

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const role = user?.user_metadata?.role ?? user?.app_metadata?.role;

  // If admin, return all events; otherwise filter by client_id (assuming user.id is client_id)
  let query = supabase.from('events').select('*');
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get('companyId');
  if (companyId) {
    query = query.eq('unit', companyId);
  }
  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const role = user?.user_metadata?.role ?? user?.app_metadata?.role;

  if (role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const payload: Partial<Event> = await request.json();
  // Ensure required fields exist
  if (!payload.title || !payload.start_at) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { data, error } = await supabase.from('events').insert({
    ...payload,
    unit: payload.client_id || null, // Map the frontend `client_id` to `unit` in the DB
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(data?.[0] ?? {}, { status: 201 });
}
