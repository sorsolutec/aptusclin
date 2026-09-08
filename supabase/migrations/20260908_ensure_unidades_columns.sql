-- ============================================================
-- Migração: Garantir colunas estendidas e recarregar schema cache do Supabase (PostgREST)
-- Executar no SQL Editor do Supabase se a coluna 'foto_url' ou 'horario' não for encontrada.
-- ============================================================

alter table public.unidades
  add column if not exists foto_url text,
  add column if not exists horario text,
  add column if not exists instagram text,
  add column if not exists facebook text,
  add column if not exists whatsapp text,
  add column if not exists exames_disponiveis jsonb not null default '[]'::jsonb;

-- Recarrega o cache do PostgREST para reconhecer as novas colunas imediatamente
notify pgrst, 'reload schema';
