import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // Se "next" estiver no searchParams, redirecionar para ele após o login,
  // caso contrário, redireciona para dashboard (ou change-password se for reset)
  const next = searchParams.get('next') ?? '/portal/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Se não tem código ou deu erro
  return NextResponse.redirect(`${origin}/login?error=true`)
}
