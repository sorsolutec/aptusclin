-- Migration: Criação da tabela de leads (formulário de contato do site)
-- Execução: Supabase SQL Editor ou Supabase CLI

CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    empresa TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT NOT NULL,
    tipo TEXT NOT NULL DEFAULT 'agendamento',
    mensagem TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'novo',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilita RLS (Row Level Security)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Bloqueia acesso anônimo direto à tabela via API pública (acesso apenas via Service Role no backend)
DROP POLICY IF EXISTS "Bloquear acesso publico - leads" ON public.leads;
CREATE POLICY "Bloquear acesso publico - leads" ON public.leads FOR ALL USING (false);

-- Garante permissões completas para o service_role
GRANT ALL ON TABLE public.leads TO service_role;
