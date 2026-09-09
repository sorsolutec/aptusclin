-- Migration to remove all fictitious/test data from the database.
-- This script truncates tables used for demo or testing purposes.
-- It preserves the core tables with real data (unidades, auth.users, etc.).

-- IMPORTANT: Run this migration after verifying that the data to be removed
-- is indeed only test/fictitious records. The operation is irreversible.

BEGIN;

-- Remove test exam records
TRUNCATE TABLE public.exames RESTART IDENTITY CASCADE;

-- Remove test collaborators (patients)
TRUNCATE TABLE public.colaboradores RESTART IDENTITY CASCADE;

-- Remove test companies (clients)
TRUNCATE TABLE public.empresas RESTART IDENTITY CASCADE;

-- Remove test agenda/events (if any)
TRUNCATE TABLE public.events RESTART IDENTITY CASCADE;

-- Remove test leads (marketing records)
TRUNCATE TABLE public.leads RESTART IDENTITY CASCADE;

COMMIT;
