-- ============================================================
-- Correção de RLS: Permitir leitura pública nas tabelas institucionais
-- e garantir integridade de acesso no Supabase
-- ============================================================

-- 1. Tabela: unidades
-- Leitura pública para que os sites das clínicas carreguem normalmente
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'unidades') THEN
    ALTER TABLE public.unidades ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Bloquear acesso publico - unidades" ON public.unidades;
    DROP POLICY IF EXISTS "unidades_public_read" ON public.unidades;
    
    -- Permite SELECT público em unidades ativas
    CREATE POLICY "unidades_public_read" ON public.unidades 
      FOR SELECT USING (true);
      
    -- Bloqueia INSERT/UPDATE/DELETE para anônimos
    DROP POLICY IF EXISTS "unidades_admin_write" ON public.unidades;
    CREATE POLICY "unidades_admin_write" ON public.unidades 
      FOR ALL USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- 2. Tabela: site_settings
-- Leitura pública para carregar banners da home
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'site_settings') THEN
    ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Bloquear acesso publico - site_settings" ON public.site_settings;
    DROP POLICY IF EXISTS "site_settings_public_read" ON public.site_settings;
    
    CREATE POLICY "site_settings_public_read" ON public.site_settings 
      FOR SELECT USING (true);
  END IF;
END $$;
