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
    'Aptus Clin - Medicina do Trabalho - Unidade Sorriso',
    'Sorriso',
    'MT',
    'Rua Mato Grosso, 2859 – Centro-Sul, Sorriso – MT, CEP 78.896-013',
    '(66) 99644-0425',
    'sorriso@aptusclin.com.br',
    'Clínica de medicina ocupacional em Sorriso. Atendimento de segunda a sexta, das 07:00 às 11:00 e das 13:00 às 17:00. Referência regional em saúde do trabalhador.'
  ),
  (
    'hova-ubirata',
    'Aptus Clin - Medicina do Trabalho - Unidade Nova Ubiratã',
    'Nova Ubiratã',
    'MT',
    'Avenida Getúlio Vargas, 195 – Centro, Nova Ubiratã – MT, CEP 78888-000',
    '(66) 99619-9138',
    'nova-ubirata@aptusclin.com.br',
    'Clínica de medicina ocupacional em Nova Ubiratã. Atendimento de segunda a sexta, das 07:00 às 11:00 e das 13:00 às 17:00. Referência em saúde ocupacional, exames complementares e gestão de SST.'
  ),
  (
    'boa-esperanca',
    'Aptusclin Boa Esperança do Norte',
    'Boa Esperança do Norte',
    'MT',
    'Rua das Azaleias, 1627, Centro',
    '(66) 99268-0888',
    'boa-esperanca@aptusclin.com.br',
    'Saúde ocupacional e exames admissionais para as empresas de Boa Esperança do Norte e região.'
  ),
  (
    'nova-mutum',
    'Aptus Clin - Medicina do Trabalho - Unidade Nova Mutum',
    'Nova Mutum',
    'MT',
    'Avenida das Águias, 330 W – Parque dos Ingás, Nova Mutum – MT, CEP 78452-070',
    '(65) 98443-3296',
    'nova-mutum@aptusclin.com.br',
    'Clínica de medicina ocupacional em Nova Mutum. Atendimento de segunda a sexta das 07:00 às 17:30. Exames complementares, ultrassonografia e gestão de SST.'
  )
on conflict (id) do update set
  nome      = excluded.nome,
  cidade    = excluded.cidade,
  estado    = excluded.estado,
  endereco  = excluded.endereco,
  telefone  = excluded.telefone,
  email     = excluded.email,
  descricao = excluded.descricao;
