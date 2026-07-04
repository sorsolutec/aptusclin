import { NextResponse } from 'next/server';
import { getAdminClient } from '@/utils/supabase/serverAdmin';

export const dynamic = 'force-dynamic';

const UNIDADES_SEED = [
  {
    id: 'sorriso',
    nome: 'Aptusclin Sorriso',
    cidade: 'Sorriso',
    estado: 'MT',
    endereco: 'Av. Rui Barbosa, 123 – Centro, Sorriso/MT',
    telefone: '(66) 3544-0000',
    email: 'sorriso@aptusclin.com.br',
    descricao: 'Clínica de medicina ocupacional em Sorriso, referência regional em saúde do trabalhador.',
    slides: [],
    ativo: true,
  },
  {
    id: 'hova-ubirata',
    nome: 'Aptusclin Nova Ubiratã',
    cidade: 'Nova Ubiratã',
    estado: 'MT',
    endereco: 'Rua das Flores, 456 – Centro, Nova Ubiratã/MT',
    telefone: '(66) 3591-0000',
    email: 'nova-ubirata@aptusclin.com.br',
    descricao: 'Atendimento especializado em medicina ocupacional para a região de Nova Ubiratã.',
    slides: [],
    ativo: true,
  },
  {
    id: 'boa-esperanca',
    nome: 'Aptusclin Boa Esperança do Norte',
    cidade: 'Boa Esperança do Norte',
    estado: 'MT',
    endereco: 'Rua Principal, 789 – Centro, Boa Esperança do Norte/MT',
    telefone: '(66) 3591-1111',
    email: 'boa-esperanca@aptusclin.com.br',
    descricao: 'Saúde ocupacional e exames admissionais para as empresas da região.',
    slides: [],
    ativo: true,
  },
  {
    id: 'nova-mutum',
    nome: 'Aptusclin Nova Mutum',
    cidade: 'Nova Mutum',
    estado: 'MT',
    endereco: 'Av. Rui Barbosa, 1234 – Centro, Nova Mutum/MT',
    telefone: '(65) 3518-0000',
    email: 'nova-mutum@aptusclin.com.br',
    descricao: 'Clínica completa de medicina ocupacional servindo Nova Mutum e o corredor da soja.',
    slides: [],
    ativo: true,
  },
];

export async function GET() {
  const supabase = getAdminClient();

  const { data, error } = await (supabase as any)
    .from('unidades')
    .upsert(UNIDADES_SEED, { onConflict: 'id' })
    .select();

  if (error) {
    return NextResponse.json({
      error: error.message,
      hint: 'Execute o arquivo supabase/migrations/20240704_create_unidades_table.sql no Supabase SQL Editor primeiro.',
    }, { status: 500 });
  }

  return NextResponse.json({ seeded: (data as any[]).length, unidades: (data as any[]).map((u: any) => u.id) });
}
