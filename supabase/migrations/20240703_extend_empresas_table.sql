-- Amplia a tabela empresas existente com campos para gestão de clientes
ALTER TABLE public.empresas
  ADD COLUMN IF NOT EXISTS email varchar,
  ADD COLUMN IF NOT EXISTS telefone varchar,
  ADD COLUMN IF NOT EXISTS responsavel varchar,
  ADD COLUMN IF NOT EXISTS endereco text,
  ADD COLUMN IF NOT EXISTS cidade varchar,
  ADD COLUMN IF NOT EXISTS estado varchar(2),
  ADD COLUMN IF NOT EXISTS unidade_id varchar, -- 'sorriso' | 'nova-ubirata' | etc.
  ADD COLUMN IF NOT EXISTS ativo boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Comentários para documentar os campos
COMMENT ON COLUMN public.empresas.unidade_id IS 'Unidade Aptusclin responsável por atender este cliente';
COMMENT ON COLUMN public.empresas.responsavel IS 'Nome do contato responsável na empresa cliente';
