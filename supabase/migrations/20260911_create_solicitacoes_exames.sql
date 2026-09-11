-- Migration: Criação da tabela de solicitações de exames ocupacionais (formulários de encaminhamento)
-- Execução: Supabase SQL Editor ou Supabase CLI

CREATE TABLE IF NOT EXISTS public.solicitacoes_exames (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    protocolo VARCHAR(30) UNIQUE NOT NULL,
    unidade_id VARCHAR(50) REFERENCES public.unidades(id) ON DELETE SET NULL,
    
    -- Dados da Empresa Solicitante
    empresa_nome VARCHAR(255) NOT NULL,
    empresa_cnpj VARCHAR(30),
    solicitante_nome VARCHAR(150) NOT NULL,
    solicitante_email VARCHAR(150) NOT NULL,
    solicitante_telefone VARCHAR(30) NOT NULL,
    
    -- Dados do Colaborador
    colaborador_nome VARCHAR(255) NOT NULL,
    colaborador_cpf VARCHAR(20) NOT NULL,
    colaborador_cargo VARCHAR(120),
    colaborador_setor VARCHAR(120),
    
    -- Detalhes do Exame Solicitado
    tipo_exame VARCHAR(60) NOT NULL, -- 'Admissional', 'Periódico', 'Demissional', 'Retorno ao Trabalho', 'Mudança de Função', 'Exames Complementares'
    exames_complementares TEXT[] DEFAULT '{}', -- ex: ARRAY['Audiometria', 'Espirometria', 'ECG', 'Laboratorial']
    riscos_funcao TEXT,
    data_pretendida DATE,
    observacoes TEXT,
    anexos JSONB DEFAULT '[]'::jsonb,
    
    -- Controle Operacional e Triagem
    status VARCHAR(30) NOT NULL DEFAULT 'novo', -- 'novo', 'em_analise', 'agendado', 'concluido', 'cancelado'
    data_agendamento DATE,
    horario_agendamento VARCHAR(20),
    resposta_operador TEXT,
    atendido_por UUID,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices para consultas rápidas
CREATE INDEX IF NOT EXISTS idx_solicitacoes_unidade ON public.solicitacoes_exames(unidade_id);
CREATE INDEX IF NOT EXISTS idx_solicitacoes_status ON public.solicitacoes_exames(status);
CREATE INDEX IF NOT EXISTS idx_solicitacoes_protocolo ON public.solicitacoes_exames(protocolo);
CREATE INDEX IF NOT EXISTS idx_solicitacoes_colaborador_cpf ON public.solicitacoes_exames(colaborador_cpf);

-- Habilita Row Level Security (RLS)
ALTER TABLE public.solicitacoes_exames ENABLE ROW LEVEL SECURITY;

-- Política de RLS: o acesso é gerenciado via Service Role nas API Routes do backend
DROP POLICY IF EXISTS "Bloquear acesso publico direto - solicitacoes" ON public.solicitacoes_exames;
CREATE POLICY "Bloquear acesso publico direto - solicitacoes" ON public.solicitacoes_exames FOR ALL USING (false);

-- Permissões para o service_role
GRANT ALL ON TABLE public.solicitacoes_exames TO service_role;
