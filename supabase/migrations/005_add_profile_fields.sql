-- ============================================
-- ADICIONAR CAMPOS DE PERFIL DO MEMBRO
-- ============================================
-- Este arquivo adiciona campos para permitir que membros
-- preencham informações profissionais e pessoais no perfil

-- ============================================
-- 1. ADICIONAR COLUNAS NA TABELA PROFILES
-- ============================================
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS linkedin TEXT,
  ADD COLUMN IF NOT EXISTS instituicao TEXT,
  ADD COLUMN IF NOT EXISTS funcao TEXT;

-- ============================================
-- 2. COMENTÁRIOS NAS NOVAS COLUNAS
-- ============================================
COMMENT ON COLUMN public.profiles.bio IS 'Biografia do membro';
COMMENT ON COLUMN public.profiles.linkedin IS 'URL do perfil do LinkedIn';
COMMENT ON COLUMN public.profiles.instituicao IS 'Instituição onde estuda ou trabalha';
COMMENT ON COLUMN public.profiles.funcao IS 'Função ou cargo atual';

-- ============================================
-- 3. ATUALIZAR POLÍTICAS RLS
-- ============================================
-- Permitir que usuários atualizem seus próprios perfis
-- (incluindo os novos campos)

-- A política de UPDATE já existe, mas vamos garantir que está correta
-- Se necessário, pode-se recriar a política aqui

-- Verificar se a política permite UPDATE dos próprios dados
DO $$
BEGIN
  -- Remover política antiga se existir
  DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
  
  -- Criar nova política permitindo UPDATE completo do próprio perfil
  CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);
END $$;

-- ============================================
-- 4. ÍNDICE PARA BUSCA POR INSTITUIÇÃO
-- ============================================
CREATE INDEX IF NOT EXISTS idx_profiles_instituicao ON public.profiles(instituicao);
CREATE INDEX IF NOT EXISTS idx_profiles_funcao ON public.profiles(funcao);

-- ============================================
-- 5. VALIDAÇÃO DE URL DO LINKEDIN (OPCIONAL)
-- ============================================
-- Adicionar constraint para validar formato básico de URL do LinkedIn
ALTER TABLE public.profiles
  ADD CONSTRAINT linkedin_format 
  CHECK (
    linkedin IS NULL OR 
    linkedin = '' OR 
    linkedin ~* '^https?://(www\.)?linkedin\.com/in/[a-zA-Z0-9\-]+/?$'
  );

COMMENT ON CONSTRAINT linkedin_format ON public.profiles IS 'Valida formato da URL do LinkedIn';
