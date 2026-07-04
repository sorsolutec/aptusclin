-- Adiciona coluna foto_url à tabela unidades
-- Armazena a URL pública da foto principal da unidade (exibida na página pública)

alter table public.unidades
  add column if not exists foto_url text;
