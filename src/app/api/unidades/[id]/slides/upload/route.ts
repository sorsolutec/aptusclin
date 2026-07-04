import { createClient } from '@/utils/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Helper para criar o cliente admin
function getAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// POST /api/unidades/[id]/slides/upload
// Faz upload de uma imagem para o Supabase Storage e retorna a URL pública
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  // Verifica autenticação admin
  const { data: { user } } = await supabase.auth.getUser();
  const role = user?.user_metadata?.role ?? user?.app_metadata?.role;
  if (!user || role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Lê o arquivo do FormData
  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  if (!file) {
    return NextResponse.json({ error: 'Nenhum arquivo enviado.' }, { status: 400 });
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const path = `unidades/${id}/slides/${timestamp}_${randomStr}.${ext}`;

  // Converte para ArrayBuffer e faz upload no Supabase Storage usando o cliente admin
  const arrayBuffer = await file.arrayBuffer();
  const adminClient = getAdminClient();
  const { error: uploadError } = await adminClient.storage
    .from('aptusclin-media')
    .upload(path, arrayBuffer, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  // Gera URL pública
  const { data: publicUrlData } = adminClient.storage
    .from('aptusclin-media')
    .getPublicUrl(path);

  return NextResponse.json({ url: publicUrlData.publicUrl });
}
