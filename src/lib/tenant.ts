export const tenantMap: Record<string, string> = {
  sorriso: 'sorriso',
  'hova-ubirata': 'hova-ubirata',
  'boa-esperanca': 'boa-esperanca',
  'nova-mutum': 'nova-mutum',
};

export interface TenantConfig {
  id: string;
  nome: string;
  cidade: string;
  estado: string;
  cor: string;
  endereco?: string;
  telefone?: string;
  email?: string;
  descricao?: string;
  slides?: { url: string; caption?: string }[];
}

/** Fallback usado enquanto o Supabase não estiver configurado */
export const tenantConfig: Record<string, TenantConfig> = {
  sorriso: {
    id: 'sorriso',
    nome: 'Aptusclin Sorriso',
    cidade: 'Sorriso',
    estado: 'MT',
    cor: 'hsl(213, 80%, 28%)',
    endereco: 'Rua Mato Grosso, 2859 – Centro-Sul, Sorriso – MT, CEP 78.896-013',
    telefone: '(65) 99675-4582',
    email: 'marquescontabilidademe@outlook.com',
    descricao: 'Clínica de medicina ocupacional em Sorriso, referência regional em saúde do trabalhador.',
    slides: [],
  },
  'hova-ubirata': {
    id: 'hova-ubirata',
    nome: 'Aptusclin Nova Ubiratã',
    cidade: 'Nova Ubiratã',
    estado: 'MT',
    cor: 'hsl(158, 60%, 32%)',
    endereco: 'Avenida Getúlio Vargas, 195 – Centro, Nova Ubiratã – MT, CEP 78.888-000',
    telefone: '(65) 99675-4582',
    email: 'nova-ubirata@aptusclin.com.br',
    descricao: 'Atendimento especializado em medicina ocupacional para a região de Nova Ubiratã.',
    slides: [],
  },
  'boa-esperanca': {
    id: 'boa-esperanca',
    nome: 'Aptusclin Boa Esperança do Norte',
    cidade: 'Boa Esperança do Norte',
    estado: 'MT',
    cor: 'hsl(24, 70%, 40%)',
    endereco: 'Rua das Azaleias, 1627 – Centro, Boa Esperança do Norte – MT, CEP 78.887-000',
    telefone: '(66) 3591-1111',
    email: 'boa-esperanca@aptusclin.com.br',
    descricao: 'Saúde ocupacional e exames admissionais para as empresas de Boa Esperança do Norte e região.',
    slides: [],
  },
  'nova-mutum': {
    id: 'nova-mutum',
    nome: 'Aptusclin Nova Mutum',
    cidade: 'Nova Mutum',
    estado: 'MT',
    cor: 'hsl(270, 50%, 40%)',
    endereco: 'Avenida dos Canários, 751 W – Centro, Nova Mutum – MT, CEP 78.450-000',
    telefone: '(65) 3518-0000',
    email: 'nova-mutum@aptusclin.com.br',
    descricao: 'Clínica completa de medicina ocupacional servindo Nova Mutum e o corredor da soja.',
    slides: [],
  },
};

