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

// GET /api/unidades/[id]/foto — retorna a URL da foto da unidade
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const adminClient = getAdminClient();

  const { data, error } = await adminClient
    .from('unidades')
    .select('foto_url')
    .eq('id', id)
    .single();

  if (error || !data) {
    return NextResponse.json({ foto_url: null }, { status: 404 });
  }

  return NextResponse.json({ foto_url: data.foto_url ?? null });
}

// POST /api/unidades/[id]/foto
// Faz upload de uma imagem para o Supabase Storage e salva a URL pública em unidades.foto_url
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
    const path = `unidades/${id}/foto.${ext}`;

    // Converte para ArrayBuffer e faz upload no Supabase Storage usando o cliente admin
    const arrayBuffer = await file.arrayBuffer();
    const adminClient = getAdminClient();

    // Garante que o bucket existe
    const { error: uploadError } = await adminClient.storage
      .from('aptusclin-media')
      .upload(path, arrayBuffer, {
        contentType: file.type,
        upsert: true, // sobrescreve se já existir
      });

    if (uploadError) {
      console.warn('[POST /api/unidades/[id]/foto] Erro no upload:', uploadError);
      // Se o bucket não existir, tenta criá-lo e retenta o upload
      if (uploadError.message?.toLowerCase().includes('not found') || (uploadError as any).statusCode === '404') {
        await adminClient.storage.createBucket('aptusclin-media', { public: true });
        const retry = await adminClient.storage
          .from('aptusclin-media')
          .upload(path, arrayBuffer, {
            contentType: file.type,
            upsert: true,
          });
        if (retry.error) {
          return NextResponse.json({ error: retry.error.message }, { status: 500 });
        }
      } else {
        return NextResponse.json({ error: uploadError.message }, { status: 500 });
      }
    }

    // Gera URL pública
    const { data: publicUrlData } = adminClient.storage
      .from('aptusclin-media')
      .getPublicUrl(path);

    const foto_url = publicUrlData.publicUrl;

    // Salva a URL na tabela unidades usando o adminClient para contornar RLS
    const { error: dbError } = await adminClient
      .from('unidades')
      .update({ foto_url, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (dbError) {
      console.error('[POST /api/unidades/[id]/foto] Erro ao salvar no banco:', dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ foto_url });
  } catch (err: any) {
    console.error('[POST /api/unidades/[id]/foto] Erro inesperado:', err);
    return NextResponse.json({ error: err?.message || 'Erro interno ao processar foto.' }, { status: 500 });
  }
}

// DELETE /api/unidades/[id]/foto — remove a foto da unidade
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    const role = user?.user_metadata?.role ?? user?.app_metadata?.role;
    if (!user || role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const adminClient = getAdminClient();
    // Remove a URL do banco com adminClient
    const { error } = await adminClient
      .from('unidades')
      .update({ foto_url: null, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Erro ao remover foto.' }, { status: 500 });
  }
}
