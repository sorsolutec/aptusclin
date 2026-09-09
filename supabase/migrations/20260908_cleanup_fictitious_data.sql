-- Migration to cleanup/truncate fictitious test data from tables while preserving structural schemas and real unit data.
-- Run this script in the Supabase SQL Editor to clear out test records.

-- 1. Inactivate/Truncate events (Agenda / Compromissos)
TRUNCATE TABLE public.events CASCADE;

-- 2. Truncate exames cadastrados de teste
TRUNCATE TABLE public.exames CASCADE;

-- 3. Truncate colaboradores fictícios
TRUNCATE TABLE public.colaboradores CASCADE;

-- 4. Truncate empresas fictícias
TRUNCATE TABLE public.empresas CASCADE;

-- Note: Table `unidades` contains the official branch data (Sorriso, Nova Ubiratã, Boa Esperança, Nova Mutum) and is NOT truncated.
