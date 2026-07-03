-- Adiciona campos de colaborador e tipo na tabela exames
ALTER TABLE public.exames
  ADD COLUMN IF NOT EXISTS colaborador_id uuid REFERENCES public.colaboradores(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS empresa_id uuid REFERENCES public.empresas(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS tipo varchar DEFAULT 'Geral'
    CHECK (tipo IN ('ASO', 'Audiometria', 'Espirometria', 'ECG', 'EEG', 'Laboratorial', 'Imagem', 'Geral')),
  ADD COLUMN IF NOT EXISTS resultado text,
  ADD COLUMN IF NOT EXISTS arquivo_url text,
  ADD COLUMN IF NOT EXISTS status_resultado varchar DEFAULT 'Pendente'
    CHECK (status_resultado IN ('Pendente', 'Disponivel', 'Entregue'));

-- Índices
CREATE INDEX IF NOT EXISTS idx_exames_colaborador_id ON public.exames(colaborador_id);
CREATE INDEX IF NOT EXISTS idx_exames_empresa_id ON public.exames(empresa_id);

COMMENT ON COLUMN public.exames.colaborador_id IS 'Colaborador que realizou este exame';
COMMENT ON COLUMN public.exames.tipo IS 'Tipo de exame: ASO, Audiometria, Laboratorial, etc.';
COMMENT ON COLUMN public.exames.arquivo_url IS 'URL do laudo/resultado em PDF no storage';
