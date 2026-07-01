create table events (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references clients(id),
  title text not null,
  description text,
  start_at timestamptz not null,
  end_at timestamptz,
  location text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table events enable row level security;

-- Policy: admins can insert, update, delete
create policy "admin full access" on events for all
  using (auth.role() = 'admin');

-- Policy: clients can select only their own events
create policy "client view own" on events for select
  using (client_id = auth.uid());
