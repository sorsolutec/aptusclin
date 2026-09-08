export const tenantMap: Record<string, string> = {
  sorriso: 'sorriso',
  'nova-ubirata': 'nova-ubirata',
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
  slides?: { url: string; caption?: string; link?: string }[];
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
  cnpj?: string;
  cnes?: string;
  fotoUrl?: string;
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
    horario: 'Segunda a Sexta: 07:00–11:00, 13:00–17:00',
    cnpj: '11.838.749/0001-08',
    instagram: '@aptusclin',
    descricao: 'Clínica de medicina ocupacional em Sorriso. Atendimento de segunda a sexta, das 07:00 às 11:00 e das 13:00 às 17:00. Referência regional em saúde do trabalhador.',
    fotoUrl: '/images/fictitious-clinic.jpg',
    slides: [],
  },
  'nova-ubirata': {
    id: 'nova-ubirata',
    nome: 'Aptus Clin - Medicina do Trabalho - Unidade Nova Ubiratã',
    cidade: 'Nova Ubiratã',
    estado: 'MT',
    cor: 'hsl(142, 60%, 30%)',
    endereco: 'Avenida Getúlio Vargas, 195 – Centro, Nova Ubiratã – MT, CEP 78888-000',
    telefone: '(66) 99619-9138',
    telefoneFixo: '(66) 3579-1111',
    whatsapp: '5566996199138',
    email: 'nova-ubirata@aptusclin.com.br',
    horario: 'Segunda a Sexta: 07:00–11:00, 13:00–17:00',
    cnpj: '53.649.030/0001-38',
    instagram: '@aptusclin',
    descricao: 'Clínica de medicina ocupacional em Nova Ubiratã. Atendimento de segunda a sexta, das 07:00 às 11:00 e das 13:00 às 17:00. Referência em saúde ocupacional, exames complementares e gestão de SST.',
    fotoUrl: '/images/fictitious-clinic.jpg',
    slides: [],
  },
  'boa-esperanca': {
    id: 'boa-esperanca',
    nome: 'Unidade de Boa Esperança do Norte',
    cidade: 'Boa Esperança do Norte',
    estado: 'MT',
    cor: 'hsl(24, 70%, 40%)',
    endereco: 'Rua das Azaleias, 1627, Centro',
    telefone: '(66) 99268-0888',
    telefoneFixo: '(66) 99268-0888',
    whatsapp: '5566992680888',
    email: 'boa-esperanca@aptusclin.com.br',
    horario: 'Segunda a Sexta: 07:00–11:00, 13:00–17:00',
    cnpj: '59.709.625/0001-70',
    instagram: '@aptusclin',
    descricao: 'Saúde ocupacional e exames admissionais para as empresas de Boa Esperança do Norte e região.',
    fotoUrl: '/images/fictitious-clinic.jpg',
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
    fotoUrl: '/images/fictitious-clinic.jpg',
    slides: [],
  },
};

