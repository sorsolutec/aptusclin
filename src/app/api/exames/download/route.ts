import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const role = user?.user_metadata?.role ?? user?.app_metadata?.role;

  // Only allow authenticated users (could also restrict to admin if needed)
  if (!user) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  const { examId, username, password } = await request.json();
  if (!examId || !username || !password) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Placeholder validation: in a real system you would verify the credentials
  // against your user management system. Here we simply accept any non-empty values.

  // Attempt to download the PDF from Supabase storage bucket "exames"
  const { data, error } = await supabase.storage.from('exames').download(`${examId}.pdf`);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  // Convert the file (which is a Blob) to a readable stream for the response
  const arrayBuffer = await data.arrayBuffer();
  const pdfBlob = new Blob([arrayBuffer], { type: 'application/pdf' });
  return new Response(pdfBlob, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${examId}.pdf"`,
    },
    status: 200,
  });
}
