import { NextResponse } from 'next/server';
import { getAdminClient } from '@/utils/supabase/serverAdmin';

export const dynamic = 'force-dynamic';

type UnidadeSeed = {
  id: string;
  nome: string;
  cidade: string;
  estado: string;
  endereco: string;
  telefone: string;
  email: string;
  descricao: string;
  slides: never[];
  ativo: boolean;
};

const UNIDADES_SEED: UnidadeSeed[] = [
  {
    id: 'sorriso',
    nome: 'Aptusclin Sorriso',
    cidade: 'Sorriso',
    estado: 'MT',
    endereco: 'Rua Mato Grosso, 2859 – Centro-Sul, Sorriso – MT, CEP 78.896-013',
    telefone: '(65) 99675-4582',
    email: 'marquescontabilidademe@outlook.com',
    descricao: 'Clínica de medicina ocupacional em Sorriso, referência regional em saúde do trabalhador.',
    slides: [],
    ativo: true,
  },
  {
    id: 'hova-ubirata',
    nome: 'Aptusclin Nova Ubiratã',
    cidade: 'Nova Ubiratã',
    estado: 'MT',
    endereco: 'Avenida Getúlio Vargas, 195 – Centro, Nova Ubiratã – MT, CEP 78.888-000',
    telefone: '(65) 99675-4582',
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
    endereco: 'Rua das Azaleias, 1627 – Centro, Boa Esperança do Norte – MT, CEP 78.887-000',
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
    endereco: 'Avenida dos Canários, 751 W – Centro, Nova Mutum – MT, CEP 78.450-000',
    telefone: '(65) 3518-0000',
    email: 'nova-mutum@aptusclin.com.br',
    descricao: 'Clínica completa de medicina ocupacional servindo Nova Mutum e o corredor da soja.',
    slides: [],
    ativo: true,
  },
];

export async function GET() {
  const supabase = getAdminClient();

  const { data, error } = await supabase
    .from('unidades')
    .upsert(UNIDADES_SEED, { onConflict: 'id' })
    .select();

  if (error) {
    return NextResponse.json({
      error: error.message,
      hint: 'Execute o arquivo supabase/migrations/20240704_create_unidades_table.sql no Supabase SQL Editor primeiro.',
    }, { status: 500 });
  }

  return NextResponse.json({ seeded: data?.length ?? 0, unidades: (data ?? []).map((u) => u.id) });
}
