create table public.users (
  id uuid primary key default gen_random_uuid(),
  email varchar not null unique,
  role varchar not null default 'user',
  created_at timestamp with time zone default now()
);
