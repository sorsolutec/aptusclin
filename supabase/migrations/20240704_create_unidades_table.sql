-- ============================================================
-- Tabela: unidades
-- Armazena os dados dinâmicos de cada clínica Aptusclin.
-- O "id" é o slug usado no subdomínio: sorriso, hova-ubirata, etc.
-- ============================================================

create table if not exists public.unidades (
  id         text        primary key,           -- slug / companyId
  nome       text        not null,
  cidade     text,
  estado     text        default 'MT',
  endereco   text,
  telefone   text,
  email      text,
  descricao  text,
  slides     jsonb       not null default '[]', -- [{url, caption?}]
  ativo      boolean     not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger que mantém updated_at atualizado automaticamente
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_unidades_updated_at on public.unidades;
create trigger trg_unidades_updated_at
  before update on public.unidades
  for each row execute procedure public.set_updated_at();

-- RLS
alter table public.unidades enable row level security;

-- Leitura pública (site público pode buscar os dados das unidades)
create policy "unidades_public_read" on public.unidades
  for select using (ativo = true);

-- Escrita apenas para admins (service_role ignora RLS automaticamente)
create policy "unidades_admin_all" on public.unidades
  for all using (
    auth.role() = 'service_role'
    or (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
    or (auth.jwt() ->> 'app_metadata')::jsonb ->> 'role' = 'admin'
  );

-- ============================================================
-- Seed: dados iniciais das 4 unidades
-- ============================================================
insert into public.unidades (id, nome, cidade, estado, endereco, telefone, email, descricao)
values
  (
    'sorriso',
    'Aptusclin Sorriso',
    'Sorriso',
    'MT',
    'Rua Mato Grosso, 2859 – Centro-Sul, Sorriso – MT, CEP 78.896-013',
    '(65) 99675-4582',
    'marquescontabilidademe@outlook.com',
    'Clínica de medicina ocupacional em Sorriso, referência regional em saúde do trabalhador.'
  ),
  (
    'hova-ubirata',
    'Aptusclin Nova Ubiratã',
    'Nova Ubiratã',
    'MT',
    'Avenida Getúlio Vargas, 195 – Centro, Nova Ubiratã – MT, CEP 78.888-000',
    '(65) 99675-4582',
    'nova-ubirata@aptusclin.com.br',
    'Atendimento especializado em medicina ocupacional para a região de Nova Ubiratã.'
  ),
  (
    'boa-esperanca',
    'Aptusclin Boa Esperança do Norte',
    'Boa Esperança do Norte',
    'MT',
    'Rua das Azaleias, 1627 – Centro, Boa Esperança do Norte – MT, CEP 78.887-000',
    '(66) 3591-1111',
    'boa-esperanca@aptusclin.com.br',
    'Saúde ocupacional e exames admissionais para as empresas de Boa Esperança do Norte e região.'
  ),
  (
    'nova-mutum',
    'Aptusclin Nova Mutum',
    'Nova Mutum',
    'MT',
    'Avenida dos Canários, 751 W – Centro, Nova Mutum – MT, CEP 78.450-000',
    '(65) 3518-0000',
    'nova-mutum@aptusclin.com.br',
    'Clínica completa de medicina ocupacional servindo Nova Mutum e o corredor da soja.'
  )
on conflict (id) do update set
  nome      = excluded.nome,
  cidade    = excluded.cidade,
  estado    = excluded.estado,
  endereco  = excluded.endereco,
  telefone  = excluded.telefone,
  email     = excluded.email,
  descricao = excluded.descricao;
