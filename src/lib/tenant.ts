export const tenantMap: Record<string, string> = {
  sorriso: 'sorriso',
  'hova-ubirata': 'hova-ubirata',
  'nova-ubirata': 'hova-ubirata',
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
  telefoneFixo?: string;
  email?: string;
  descricao?: string;
  horario?: string;
  slides?: { url: string; caption?: string }[];
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
  cnpj?: string;
  cnes?: string;
}

/** Fallback usado enquanto o Supabase não estiver configurado */
export const tenantConfig: Record<string, TenantConfig> = {
  sorriso: {
    id: 'sorriso',
    nome: 'Aptus Clin - Medicina do Trabalho - Unidade Sorriso',
    cidade: 'Sorriso',
    estado: 'MT',
    cor: 'hsl(213, 80%, 28%)',
    endereco: 'Rua Mato Grosso, 2859 – Centro-Sul, Sorriso – MT, CEP 78.896-013',
    telefone: '(66) 99644-0425',
    telefoneFixo: '(66) 3544-0000',
    email: 'sorriso@aptusclin.com.br',
    descricao: 'Clínica de medicina ocupacional em Sorriso, referência regional em saúde do trabalhador e segurança ocupacional.',
    horario: 'Segunda a Sexta: 07:00–11:00, 13:00–17:00',
    instagram: '@aptusclin_sorriso',
    whatsapp: '5566996440425',
    cnpj: '57.132.028/0001-08',
    cnes: '4918606',
    slides: [],
  },
  'hova-ubirata': {
    id: 'hova-ubirata',
    nome: 'Aptus Clin - Medicina do Trabalho - Unidade Nova Ubiratã',
    cidade: 'Nova Ubiratã',
    estado: 'MT',
    cor: 'hsl(158, 60%, 32%)',
    endereco: 'Avenida Getúlio Vargas, 195 – Centro, Nova Ubiratã – MT, CEP 78888-000',
    telefone: '(66) 99619-9138',
    email: 'nova-ubirata@aptusclin.com.br',
    descricao: 'Clínica de medicina ocupacional em Nova Ubiratã. Atendimento de segunda a sexta, das 07:00 às 11:00 e das 13:00 às 17:00. Referência em saúde ocupacional, exames complementares e gestão de SST.',
    horario: 'Segunda a Sexta: 07:00–11:00, 13:00–17:00',
    instagram: '@aptusclin',
    whatsapp: '5566996199138',
    cnpj: '31.238.750/0001-20',
    cnes: '0068438',
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
    nome: 'Aptus Clin - Medicina do Trabalho - Unidade Nova Mutum',
    cidade: 'Nova Mutum',
    estado: 'MT',
    cor: 'hsl(270, 50%, 40%)',
    endereco: 'Avenida das Águias, 330 W – Parque dos Ingás, Nova Mutum – MT, CEP 78452-070',
    telefone: '(65) 98443-3296',
    email: 'nova-mutum@aptusclin.com.br',
    descricao: 'Clínica de medicina ocupacional em Nova Mutum. Atendimento especializado em saúde e segurança do trabalho, exames complementares e gestão de SST.',
    horario: 'Segunda a Sexta: 07:00 às 17:30',
    instagram: '@aptusclin.novamutum',
    whatsapp: '5565984433296',
    cnpj: '62.526.811/0001-88',
    cnes: '6060935',
    slides: [],
  },
};

