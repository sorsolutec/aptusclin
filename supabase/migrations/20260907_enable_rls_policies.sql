-- ============================================================
-- Aptusclin: Renomear tabelas + Ativar RLS com Bloqueio Público
-- Execução: Supabase SQL Editor
-- ============================================================

-- PASSO 1: Renomear tabelas para alinhar com o código Next.js
-- (Só executa se o nome antigo existir e o novo ainda não existir)

DO $$
BEGIN
  -- employees → colaboradores
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'employees')
  AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'colaboradores')
  THEN
    ALTER TABLE public.employees RENAME TO colaboradores;
    RAISE NOTICE 'Tabela employees renomeada para colaboradores.';
  ELSE
    RAISE NOTICE 'Renomear employees → colaboradores: pulado (já existe ou não encontrado).';
  END IF;

  -- companies → empresas
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'companies')
  AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'empresas')
  THEN
    ALTER TABLE public.companies RENAME TO empresas;
    RAISE NOTICE 'Tabela companies renomeada para empresas.';
  ELSE
    RAISE NOTICE 'Renomear companies → empresas: pulado (já existe ou não encontrado).';
  END IF;

  -- exams → exames (se houver duplicata, apenas ignora)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'exams')
  AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'exames')
  THEN
    ALTER TABLE public.exams RENAME TO exames;
    RAISE NOTICE 'Tabela exams renomeada para exames.';
  ELSE
    RAISE NOTICE 'Renomear exams → exames: pulado (ambas existem ou exams não encontrado).';
  END IF;
END $$;

-- PASSO 2: Ativar RLS e bloquear acesso público nas tabelas principais
DO $$
DECLARE
  tabelas TEXT[] := ARRAY[
    'colaboradores',
    'empresas',
    'exames',
    'events',
    'site_settings',
    'unidades'
  ];
  t TEXT;
BEGIN
  FOREACH t IN ARRAY tabelas LOOP
    IF EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = t
    ) THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
      EXECUTE format('DROP POLICY IF EXISTS "Bloquear acesso publico - %s" ON public.%I', t, t);
      EXECUTE format('CREATE POLICY "Bloquear acesso publico - %s" ON public.%I FOR ALL USING (false)', t, t);
      RAISE NOTICE 'RLS ativado: %', t;
    ELSE
      RAISE NOTICE 'Tabela "%" não encontrada — ignorada.', t;
    END IF;
  END LOOP;
END $$;
