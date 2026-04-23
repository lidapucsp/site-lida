-- ============================================
-- SISTEMA DE USUÁRIOS E AUTENTICAÇÃO
-- ============================================
-- Este arquivo cria:
-- 1. Tabela de perfis de usuários (estende auth.users do Supabase)
-- 2. Sistema de permissões (admin/membro)
-- 3. Relacionamento com tabela membros
-- 4. Políticas de acesso para área de membros e admin

-- ============================================
-- 1. TABELA DE PERFIS DE USUÁRIOS
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  is_admin BOOLEAN DEFAULT false NOT NULL,
  membro_id UUID REFERENCES public.membros(id) ON DELETE SET NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  CONSTRAINT username_length CHECK (char_length(username) >= 3),
  CONSTRAINT username_format CHECK (username ~* '^[a-z0-9_]+$')
);

-- Índices para performance
CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_profiles_membro_id ON public.profiles(membro_id);
CREATE INDEX idx_profiles_is_admin ON public.profiles(is_admin);

-- Comentários
COMMENT ON TABLE public.profiles IS 'Perfis de usuários estendendo auth.users';
COMMENT ON COLUMN public.profiles.id IS 'UUID do usuário (auth.users.id)';
COMMENT ON COLUMN public.profiles.username IS 'Nome de usuário único para login';
COMMENT ON COLUMN public.profiles.is_admin IS 'Se true, usuário tem permissões administrativas';
COMMENT ON COLUMN public.profiles.membro_id IS 'Referência ao membro do LIDA (se aplicável)';

-- ============================================
-- 2. FUNÇÃO PARA VERIFICAR SE USUÁRIO É ADMIN
-- ============================================
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND is_admin = true
  );
END;
$$;

COMMENT ON FUNCTION public.is_admin IS 'Verifica se um usuário tem privilégios de administrador';

-- ============================================
-- 3. TRIGGER PARA CRIAR PROFILE AUTOMATICAMENTE
-- ============================================
-- Quando um novo usuário é criado no auth.users,
-- automaticamente cria um profile correspondente

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;

-- Criar o trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 4. FUNÇÃO PARA ATUALIZAR updated_at
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Aplicar trigger de updated_at
DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON public.profiles;
CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- 5. POLÍTICAS RLS PARA PROFILES
-- ============================================

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Qualquer usuário autenticado pode ver profiles públicos
CREATE POLICY "Perfis públicos são visíveis para todos autenticados"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Usuários podem ver seu próprio perfil completo
CREATE POLICY "Usuários podem ver seu próprio perfil"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Usuários podem atualizar seu próprio perfil (exceto is_admin)
CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND (is_admin = (SELECT is_admin FROM public.profiles WHERE id = auth.uid()))
  );

-- Admins podem atualizar qualquer perfil
CREATE POLICY "Admins podem atualizar qualquer perfil"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Admins podem inserir novos perfis manualmente
CREATE POLICY "Admins podem criar perfis"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

-- Admins podem deletar perfis
CREATE POLICY "Admins podem deletar perfis"
  ON public.profiles
  FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- ============================================
-- 6. POLÍTICAS RLS PARA ADMINS EDITAREM CONTEÚDO
-- ============================================

-- Admins podem INSERIR em eixos
CREATE POLICY "Admins podem inserir eixos"
  ON public.eixos
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

-- Admins podem ATUALIZAR eixos
CREATE POLICY "Admins podem atualizar eixos"
  ON public.eixos
  FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Admins podem DELETAR eixos
CREATE POLICY "Admins podem deletar eixos"
  ON public.eixos
  FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Admins podem INSERIR publicacoes
CREATE POLICY "Admins podem inserir publicacoes"
  ON public.publicacoes
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

-- Admins podem ATUALIZAR publicacoes
CREATE POLICY "Admins podem atualizar publicacoes"
  ON public.publicacoes
  FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Admins podem DELETAR publicacoes
CREATE POLICY "Admins podem deletar publicacoes"
  ON public.publicacoes
  FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Admins podem INSERIR eventos
CREATE POLICY "Admins podem inserir eventos"
  ON public.eventos
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

-- Admins podem ATUALIZAR eventos
CREATE POLICY "Admins podem atualizar eventos"
  ON public.eventos
  FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Admins podem DELETAR eventos
CREATE POLICY "Admins podem deletar eventos"
  ON public.eventos
  FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Admins podem INSERIR membros
CREATE POLICY "Admins podem inserir membros"
  ON public.membros
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

-- Admins podem ATUALIZAR membros
CREATE POLICY "Admins podem atualizar membros"
  ON public.membros
  FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Admins podem DELETAR membros
CREATE POLICY "Admins podem deletar membros"
  ON public.membros
  FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- ============================================
-- 7. CRIAR PRIMEIRO USUÁRIO ADMIN (EXEMPLO)
-- ============================================
-- NOTA: Este usuário precisa ser criado através do Supabase Auth
-- Este INSERT será executado por uma função após criar o usuário via Auth
-- Exemplo de como criar manualmente:
/*
-- 1. Primeiro, criar usuário via Supabase Dashboard ou API:
--    Email: admin@lida.com
--    Password: (sua senha segura)
--    
-- 2. Depois, executar:
UPDATE public.profiles 
SET is_admin = true, 
    username = 'admin',
    full_name = 'Administrador LIDA'
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@lida.com');
*/

-- ============================================
-- 8. TIPOS TYPESCRIPT ATUALIZADOS
-- ============================================
-- Adicionar ao arquivo src/types/database.ts:
/*
profiles: {
  Row: {
    id: string
    username: string
    full_name: string | null
    is_admin: boolean
    membro_id: number | null
    avatar_url: string | null
    created_at: string
    updated_at: string
  }
  Insert: {
    id: string
    username: string
    full_name?: string | null
    is_admin?: boolean
    membro_id?: number | null
    avatar_url?: string | null
    created_at?: string
    updated_at?: string
  }
  Update: {
    id?: string
    username?: string
    full_name?: string | null
    is_admin?: boolean
    membro_id?: number | null
    avatar_url?: string | null
    created_at?: string
    updated_at?: string
  }
}
*/
