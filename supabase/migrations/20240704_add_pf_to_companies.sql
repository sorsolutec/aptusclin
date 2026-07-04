-- Adiciona colunas necessárias para suportar clientes PJ e PF

ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS tipo text DEFAULT 'PJ',
ADD COLUMN IF NOT EXISTS cpf text,
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS access_code text;

-- Índice único para CPF (somente para PF)
CREATE UNIQUE INDEX IF NOT EXISTS companies_cpf_unique
  ON public.companies (cpf)
  WHERE cpf IS NOT NULL;
