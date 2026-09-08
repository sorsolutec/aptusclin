'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect('/login?error=invalid_credentials')
  }

  // Verifica role do usuário e firstLogin para redirecionar corretamente
  const { data: { user } } = await supabase.auth.getUser()
  const role = user?.user_metadata?.role ?? user?.app_metadata?.role
  const firstLogin = user?.user_metadata?.firstLogin ?? false

  if (firstLogin) {
    // Usuário admin que ainda não trocou a senha
    redirect('/auth/change-password')
  }

  if (role === 'admin') {
    redirect('/admin')
  }

  redirect('/portal/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function forgotPassword(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string

  // Obter a URL base da aplicação
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aptusclin.com.br'

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?next=/auth/change-password`,
  })

  if (error) {
    redirect('/forgot-password?error=true')
  }

  redirect('/forgot-password?success=true')
}