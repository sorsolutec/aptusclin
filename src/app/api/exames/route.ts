import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { Exam } from '@/types/exam';

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get('companyId');
  const { data: { user } } = await supabase.auth.getUser();
  const role = user?.user_metadata?.role ?? user?.app_metadata?.role;

  let query = supabase.from('exames').select('*');
  if (role !== 'admin' && companyId) {
    query = query.eq('company_id', companyId);
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
  const payload: Partial<Exam> = await request.json();
  if (!payload.title || !payload.start_at) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  const { data, error } = await supabase.from('exames').insert({
    ...payload,
    company_id: payload.company_id || null,
  }).select('*').single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(data, { status: 201 });
}
