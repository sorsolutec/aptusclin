create table exames (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  start_at timestamp not null,
  end_at timestamp not null,
  location text,
  company_id uuid references companies(id),
  created_at timestamp default now(),
  updated_at timestamp default now()
);
