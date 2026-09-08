import { createClient } from '@/utils/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function getAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// GET /api/admin/site-settings/home-banner — retorna os slides do banner da home
export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'home_banner')
    .single();

  if (error || !data) {
    return NextResponse.json({ slides: [] });
  }

  return NextResponse.json(data.value);
}

// PUT /api/admin/site-settings/home-banner — salva slides do banner (admin only)
export async function PUT(request: Request) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  const role = user?.user_metadata?.role ?? user?.app_metadata?.role;
  if (!user || role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const slides = Array.isArray(body.slides) ? body.slides : [];

  const adminClient = getAdminClient();
  const { error } = await adminClient
    .from('site_settings')
    .upsert({ key: 'home_banner', value: { slides }, updated_at: new Date().toISOString() });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, slides });
}
