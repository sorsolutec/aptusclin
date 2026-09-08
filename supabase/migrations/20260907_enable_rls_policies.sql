-- ============================================================
-- Aptusclin: Políticas RLS e Bloqueio Público
-- Execução: Supabase SQL Editor ou Supabase CLI
-- ============================================================

-- Habilitar Row Level Security (RLS) nas principais tabelas
ALTER TABLE public.exames ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colaboradores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unidades ENABLE ROW LEVEL SECURITY;

-- Se a tabela leads existir, habilitar também
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'leads') THEN
    EXECUTE 'ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY';
  END IF;
END $$;

-- Remover políticas antigas se existirem (precaução)
DROP POLICY IF EXISTS "Bloquear acesso publico - Exames" ON public.exames;
DROP POLICY IF EXISTS "Bloquear acesso publico - Colaboradores" ON public.colaboradores;
DROP POLICY IF EXISTS "Bloquear acesso publico - Empresas" ON public.empresas;
DROP POLICY IF EXISTS "Bloquear acesso publico - Unidades" ON public.unidades;
DROP POLICY IF EXISTS "Bloquear acesso publico - Leads" ON public.leads;

-- Criar Políticas "Deny-All" (Bloqueio total)
-- Como o backend Next.js usa o Service Role Key, ele fará bypass natural dessas políticas.
-- Qualquer acesso direto (via Anon Key, postman ou script externo) será bloqueado!

CREATE POLICY "Bloquear acesso publico - Exames" ON public.exames FOR ALL USING (false);
CREATE POLICY "Bloquear acesso publico - Colaboradores" ON public.colaboradores FOR ALL USING (false);
CREATE POLICY "Bloquear acesso publico - Empresas" ON public.empresas FOR ALL USING (false);
CREATE POLICY "Bloquear acesso publico - Unidades" ON public.unidades FOR ALL USING (false);

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'leads') THEN
    EXECUTE 'CREATE POLICY "Bloquear acesso publico - Leads" ON public.leads FOR ALL USING (false)';
  END IF;
END $$;
