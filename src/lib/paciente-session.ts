import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const COOKIE_NAME = 'paciente_token'
const JWT_EXPIRY = '2h' // 2 horas por sessão

function getSecret(): Uint8Array {
  const secret = process.env.PACIENTE_SESSION_SECRET
  if (!secret) {
    // Fallback para desenvolvimento local: usa a anon key do supabase como base
    const fallback = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'aptusclin-dev-fallback-secret-mínimo-32-chars'
    return new TextEncoder().encode(fallback)
  }
  return new TextEncoder().encode(secret)
}

export interface PacienteSessao {
  colaboradorId: string
  iat: number
  exp: number
}

/** Cria e define o cookie de sessão do paciente. */
export async function criarSessaoPaciente(colaboradorId: string): Promise<void> {
  const secret = getSecret()
  const token = await new SignJWT({ colaboradorId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(secret)

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 2, // 2 horas em segundos
  })
}

/** Lê e valida a sessão do paciente a partir do cookie.
 * Retorna null se não houver sessão ou se o token estiver expirado/inválido.
 */
export async function obterSessaoPaciente(): Promise<PacienteSessao | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) return null

    const secret = getSecret()
    const { payload } = await jwtVerify(token, secret)

    if (!payload.colaboradorId || typeof payload.colaboradorId !== 'string') {
      return null
    }

    return {
      colaboradorId: payload.colaboradorId,
      iat: payload.iat ?? 0,
      exp: payload.exp ?? 0,
    }
  } catch {
    return null
  }
}

/** Remove o cookie de sessão do paciente (logout). */
export async function destruirSessaoPaciente(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
}
