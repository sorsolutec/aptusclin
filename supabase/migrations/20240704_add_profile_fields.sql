-- Add access_level, avatar_url, and unidade_id to employees table

ALTER TABLE public.employees
ADD COLUMN IF NOT EXISTS access_level text DEFAULT 'viewer',
ADD COLUMN IF NOT EXISTS avatar_url text,
ADD COLUMN IF NOT EXISTS unidade_id text,
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS phone text;
