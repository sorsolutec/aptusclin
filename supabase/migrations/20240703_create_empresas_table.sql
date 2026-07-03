create table public.empresas (
  id uuid primary key default gen_random_uuid(),
  nome varchar not null,
  cnpj varchar unique,
  created_at timestamp with time zone default now()
);
