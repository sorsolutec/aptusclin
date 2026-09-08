-- ============================================================
-- Migração: Padronizar o ID da unidade de Nova Ubiratã de 'hova-ubirata' para 'nova-ubirata'
-- ============================================================

UPDATE public.unidades
SET id = 'nova-ubirata'
WHERE id = 'hova-ubirata';

NOTIFY pgrst, 'reload schema';
