-- Adiciona coluna exames_disponiveis à tabela unidades
alter table public.unidades
  add column if not exists exames_disponiveis jsonb not null default '[]'::jsonb;
