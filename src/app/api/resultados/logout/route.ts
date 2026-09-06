import { NextResponse } from 'next/server'
import { destruirSessaoPaciente } from '@/lib/paciente-session'

// POST /api/resultados/logout — encerra a sessão do paciente
export async function POST() {
  await destruirSessaoPaciente()
  return NextResponse.json({ message: 'Sessão encerrada.' }, { status: 200 })
}
