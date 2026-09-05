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
    nome: 'Aptus Clin - Medicina do Trabalho - Unidade Sorriso',
    cidade: 'Sorriso',
    estado: 'MT',
    endereco: 'Rua Mato Grosso, 2859 – Centro-Sul, Sorriso – MT, CEP 78.896-013',
    telefone: '(66) 99644-0425',
    email: 'sorriso@aptusclin.com.br',
    descricao: 'Clínica de medicina ocupacional em Sorriso. Atendimento de segunda a sexta, das 07:00 às 11:00 e das 13:00 às 17:00. Referência regional em saúde do trabalhador.',
    slides: [],
    ativo: true,
  },
  {
    id: 'hova-ubirata',
    nome: 'Aptus Clin - Medicina do Trabalho - Unidade Nova Ubiratã',
    cidade: 'Nova Ubiratã',
    estado: 'MT',
    endereco: 'Avenida Getúlio Vargas, 195 – Centro, Nova Ubiratã – MT, CEP 78888-000',
    telefone: '(66) 99619-9138',
    email: 'nova-ubirata@aptusclin.com.br',
    descricao: 'Clínica de medicina ocupacional em Nova Ubiratã. Atendimento de segunda a sexta, das 07:00 às 11:00 e das 13:00 às 17:00. Referência em saúde ocupacional, exames complementares e gestão de SST.',
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
    nome: 'Aptus Clin - Medicina do Trabalho - Unidade Nova Mutum',
    cidade: 'Nova Mutum',
    estado: 'MT',
    endereco: 'Avenida das Águias, 330 W – Parque dos Ingás, Nova Mutum – MT, CEP 78452-070',
    telefone: '(65) 98443-3296',
    email: 'nova-mutum@aptusclin.com.br',
    descricao: 'Clínica de medicina ocupacional em Nova Mutum. Atendimento de segunda a sexta das 07:00 às 17:30. Exames complementares, ultrassonografia e gestão de SST.',
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
