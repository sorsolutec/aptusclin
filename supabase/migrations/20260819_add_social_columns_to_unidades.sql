-- Adiciona colunas para redes sociais à tabela de unidades
ALTER TABLE public.unidades 
  ADD COLUMN IF NOT EXISTS instagram text,
  ADD COLUMN IF NOT EXISTS facebook text,
  ADD COLUMN IF NOT EXISTS whatsapp text;
