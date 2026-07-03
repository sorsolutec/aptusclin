-- Tabela de colaboradores (funcionários das empresas clientes)
CREATE TABLE IF NOT EXISTS public.colaboradores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Dados pessoais
  nome varchar NOT NULL,
  cpf varchar UNIQUE NOT NULL,
  data_nascimento date,
  data_admissao date,

  -- Cargo e empresa
  cargo varchar,
  empresa_id uuid REFERENCES public.empresas(id) ON DELETE SET NULL,
  unidade_id varchar, -- unidade Aptusclin que atende este colaborador

  -- Contato (opcionais)
  telefone varchar,
  email varchar,

  -- Credenciais para o portal de resultados
  usuario varchar UNIQUE NOT NULL,  -- gerado como nome.sobrenome
  senha_hash varchar NOT NULL,       -- senha aleatória de 8 chars gerada no cadastro

  -- Status do ASO
  status_aso varchar DEFAULT 'Pendente'
    CHECK (status_aso IN ('Apto', 'Inapto', 'Vencido', 'Pendente')),

  -- Controle
  ativo boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_colaboradores_empresa_id ON public.colaboradores(empresa_id);
CREATE INDEX IF NOT EXISTS idx_colaboradores_cpf ON public.colaboradores(cpf);
CREATE INDEX IF NOT EXISTS idx_colaboradores_usuario ON public.colaboradores(usuario);
CREATE INDEX IF NOT EXISTS idx_colaboradores_status_aso ON public.colaboradores(status_aso);

COMMENT ON TABLE public.colaboradores IS 'Funcionários das empresas clientes que realizam exames ocupacionais na Aptusclin';
COMMENT ON COLUMN public.colaboradores.usuario IS 'Login gerado automaticamente como nome.sobrenome para acesso ao portal de resultados';
COMMENT ON COLUMN public.colaboradores.senha_hash IS 'Senha em texto simples gerada no cadastro. Para produção, migrar para bcrypt.';
