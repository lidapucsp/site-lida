-- ============================================
-- ÁREA DE MEMBROS
-- ============================================
-- Este arquivo cria:
-- 1. Tabela de aulas/vídeos para membros
-- 2. Tabela de posts do mini fórum
-- 3. Tabela de comentários nos posts
-- 4. Políticas RLS para acesso de membros

-- ============================================
-- 1. TABELA DE AULAS/VÍDEOS
-- ============================================
CREATE TABLE IF NOT EXISTS public.aulas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descricao TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duracao INTEGER, -- duração em minutos
  data_aula DATE NOT NULL,
  eixo_id UUID REFERENCES public.eixos(id) ON DELETE SET NULL,
  palestrante TEXT,
  materiais_url TEXT, -- link para materiais complementares (slides, PDFs, etc)
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  CONSTRAINT duracao_positiva CHECK (duracao IS NULL OR duracao > 0)
);

-- Índices
CREATE INDEX idx_aulas_eixo_id ON public.aulas(eixo_id);
CREATE INDEX idx_aulas_data_aula ON public.aulas(data_aula DESC);
CREATE INDEX idx_aulas_ativo ON public.aulas(ativo);

-- Comentários
COMMENT ON TABLE public.aulas IS 'Aulas e vídeos disponíveis para membros';
COMMENT ON COLUMN public.aulas.video_url IS 'URL do vídeo (YouTube, Vimeo, etc)';
COMMENT ON COLUMN public.aulas.materiais_url IS 'URL para materiais complementares';

-- ============================================
-- 2. TABELA DE POSTS DO FÓRUM
-- ============================================
CREATE TABLE IF NOT EXISTS public.forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'discussao',
  link_url TEXT, -- para compartilhar links externos
  link_titulo TEXT, -- título do link compartilhado
  link_descricao TEXT, -- descrição do link
  autor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  autor_nome TEXT NOT NULL, -- denormalizado para performance
  autor_avatar TEXT, -- denormalizado para performance
  total_comentarios INTEGER DEFAULT 0 NOT NULL,
  total_curtidas INTEGER DEFAULT 0 NOT NULL,
  eixo_id UUID REFERENCES public.eixos(id) ON DELETE SET NULL,
  tags TEXT[], -- array de tags para categorização
  fixado BOOLEAN DEFAULT false NOT NULL,
  ativo BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  CONSTRAINT tipo_valido CHECK (tipo IN ('discussao', 'link', 'pergunta', 'noticia')),
  CONSTRAINT titulo_length CHECK (char_length(titulo) >= 5)
);

-- Índices
CREATE INDEX idx_forum_posts_autor_id ON public.forum_posts(autor_id);
CREATE INDEX idx_forum_posts_eixo_id ON public.forum_posts(eixo_id);
CREATE INDEX idx_forum_posts_tipo ON public.forum_posts(tipo);
CREATE INDEX idx_forum_posts_created_at ON public.forum_posts(created_at DESC);
CREATE INDEX idx_forum_posts_fixado ON public.forum_posts(fixado);
CREATE INDEX idx_forum_posts_tags ON public.forum_posts USING GIN(tags);

-- Comentários
COMMENT ON TABLE public.forum_posts IS 'Posts do mini fórum de membros';
COMMENT ON COLUMN public.forum_posts.tipo IS 'Tipo: discussao, link, pergunta, noticia';
COMMENT ON COLUMN public.forum_posts.fixado IS 'Posts fixados aparecem no topo';

-- ============================================
-- 3. TABELA DE COMENTÁRIOS
-- ============================================
CREATE TABLE IF NOT EXISTS public.forum_comentarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  conteudo TEXT NOT NULL,
  autor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  autor_nome TEXT NOT NULL,
  autor_avatar TEXT,
  parent_id UUID REFERENCES public.forum_comentarios(id) ON DELETE CASCADE,
  total_curtidas INTEGER DEFAULT 0 NOT NULL,
  ativo BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  CONSTRAINT conteudo_length CHECK (char_length(conteudo) >= 1)
);

-- Índices
CREATE INDEX idx_forum_comentarios_post_id ON public.forum_comentarios(post_id);
CREATE INDEX idx_forum_comentarios_autor_id ON public.forum_comentarios(autor_id);
CREATE INDEX idx_forum_comentarios_parent_id ON public.forum_comentarios(parent_id);
CREATE INDEX idx_forum_comentarios_created_at ON public.forum_comentarios(created_at ASC);

-- Comentários
COMMENT ON TABLE public.forum_comentarios IS 'Comentários nos posts do fórum';
COMMENT ON COLUMN public.forum_comentarios.parent_id IS 'Para comentários aninhados (respostas)';

-- ============================================
-- 4. TABELA DE CURTIDAS
-- ============================================
CREATE TABLE IF NOT EXISTS public.forum_curtidas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  comentario_id UUID REFERENCES public.forum_comentarios(id) ON DELETE CASCADE,
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  CONSTRAINT curtida_ou_post_ou_comentario CHECK (
    (post_id IS NOT NULL AND comentario_id IS NULL) OR
    (post_id IS NULL AND comentario_id IS NOT NULL)
  ),
  UNIQUE(post_id, usuario_id),
  UNIQUE(comentario_id, usuario_id)
);

-- Índices
CREATE INDEX idx_forum_curtidas_post_id ON public.forum_curtidas(post_id);
CREATE INDEX idx_forum_curtidas_comentario_id ON public.forum_curtidas(comentario_id);
CREATE INDEX idx_forum_curtidas_usuario_id ON public.forum_curtidas(usuario_id);

-- Comentários
COMMENT ON TABLE public.forum_curtidas IS 'Sistema de curtidas para posts e comentários';

-- ============================================
-- 5. TRIGGERS PARA ATUALIZAR updated_at
-- ============================================
CREATE TRIGGER trigger_aulas_updated_at
  BEFORE UPDATE ON public.aulas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER trigger_forum_posts_updated_at
  BEFORE UPDATE ON public.forum_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER trigger_forum_comentarios_updated_at
  BEFORE UPDATE ON public.forum_comentarios
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- 6. FUNÇÃO PARA ATUALIZAR CONTADOR DE COMENTÁRIOS
-- ============================================
CREATE OR REPLACE FUNCTION public.update_post_comentarios_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.forum_posts
    SET total_comentarios = total_comentarios + 1
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.forum_posts
    SET total_comentarios = GREATEST(0, total_comentarios - 1)
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$;

-- Trigger para contador de comentários
CREATE TRIGGER trigger_update_comentarios_count
  AFTER INSERT OR DELETE ON public.forum_comentarios
  FOR EACH ROW
  EXECUTE FUNCTION public.update_post_comentarios_count();

-- ============================================
-- 7. FUNÇÃO PARA ATUALIZAR CONTADOR DE CURTIDAS
-- ============================================
CREATE OR REPLACE FUNCTION public.update_curtidas_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.post_id IS NOT NULL THEN
      UPDATE public.forum_posts
      SET total_curtidas = total_curtidas + 1
      WHERE id = NEW.post_id;
    ELSIF NEW.comentario_id IS NOT NULL THEN
      UPDATE public.forum_comentarios
      SET total_curtidas = total_curtidas + 1
      WHERE id = NEW.comentario_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.post_id IS NOT NULL THEN
      UPDATE public.forum_posts
      SET total_curtidas = GREATEST(0, total_curtidas - 1)
      WHERE id = OLD.post_id;
    ELSIF OLD.comentario_id IS NOT NULL THEN
      UPDATE public.forum_comentarios
      SET total_curtidas = GREATEST(0, total_curtidas - 1)
      WHERE id = OLD.comentario_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$;

-- Trigger para contador de curtidas
CREATE TRIGGER trigger_update_curtidas_count
  AFTER INSERT OR DELETE ON public.forum_curtidas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_curtidas_count();

-- ============================================
-- 8. POLÍTICAS RLS - AULAS
-- ============================================
ALTER TABLE public.aulas ENABLE ROW LEVEL SECURITY;

-- Membros autenticados podem ver aulas ativas
CREATE POLICY "Membros podem ver aulas ativas"
  ON public.aulas
  FOR SELECT
  TO authenticated
  USING (ativo = true);

-- Admins podem ver todas as aulas
CREATE POLICY "Admins podem ver todas as aulas"
  ON public.aulas
  FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Admins podem inserir aulas
CREATE POLICY "Admins podem inserir aulas"
  ON public.aulas
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

-- Admins podem atualizar aulas
CREATE POLICY "Admins podem atualizar aulas"
  ON public.aulas
  FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Admins podem deletar aulas
CREATE POLICY "Admins podem deletar aulas"
  ON public.aulas
  FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- ============================================
-- 9. POLÍTICAS RLS - FORUM POSTS
-- ============================================
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;

-- Todos membros autenticados podem ver posts ativos
CREATE POLICY "Membros podem ver posts ativos"
  ON public.forum_posts
  FOR SELECT
  TO authenticated
  USING (ativo = true);

-- Admins podem ver todos os posts
CREATE POLICY "Admins podem ver todos os posts"
  ON public.forum_posts
  FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Membros autenticados podem criar posts
CREATE POLICY "Membros podem criar posts"
  ON public.forum_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = autor_id);

-- Autores podem editar seus próprios posts
CREATE POLICY "Autores podem editar seus posts"
  ON public.forum_posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = autor_id)
  WITH CHECK (auth.uid() = autor_id);

-- Admins podem editar qualquer post
CREATE POLICY "Admins podem editar qualquer post"
  ON public.forum_posts
  FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Autores podem deletar seus próprios posts
CREATE POLICY "Autores podem deletar seus posts"
  ON public.forum_posts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = autor_id);

-- Admins podem deletar qualquer post
CREATE POLICY "Admins podem deletar qualquer post"
  ON public.forum_posts
  FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- ============================================
-- 10. POLÍTICAS RLS - FORUM COMENTÁRIOS
-- ============================================
ALTER TABLE public.forum_comentarios ENABLE ROW LEVEL SECURITY;

-- Membros podem ver comentários ativos
CREATE POLICY "Membros podem ver comentários ativos"
  ON public.forum_comentarios
  FOR SELECT
  TO authenticated
  USING (ativo = true);

-- Admins podem ver todos os comentários
CREATE POLICY "Admins podem ver todos os comentários"
  ON public.forum_comentarios
  FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Membros podem criar comentários
CREATE POLICY "Membros podem criar comentários"
  ON public.forum_comentarios
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = autor_id);

-- Autores podem editar seus comentários
CREATE POLICY "Autores podem editar seus comentários"
  ON public.forum_comentarios
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = autor_id)
  WITH CHECK (auth.uid() = autor_id);

-- Admins podem editar qualquer comentário
CREATE POLICY "Admins podem editar qualquer comentário"
  ON public.forum_comentarios
  FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Autores podem deletar seus comentários
CREATE POLICY "Autores podem deletar seus comentários"
  ON public.forum_comentarios
  FOR DELETE
  TO authenticated
  USING (auth.uid() = autor_id);

-- Admins podem deletar qualquer comentário
CREATE POLICY "Admins podem deletar qualquer comentário"
  ON public.forum_comentarios
  FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- ============================================
-- 11. POLÍTICAS RLS - CURTIDAS
-- ============================================
ALTER TABLE public.forum_curtidas ENABLE ROW LEVEL SECURITY;

-- Membros podem ver curtidas
CREATE POLICY "Membros podem ver curtidas"
  ON public.forum_curtidas
  FOR SELECT
  TO authenticated
  USING (true);

-- Membros podem dar curtidas
CREATE POLICY "Membros podem dar curtidas"
  ON public.forum_curtidas
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = usuario_id);

-- Usuários podem remover suas curtidas
CREATE POLICY "Usuários podem remover suas curtidas"
  ON public.forum_curtidas
  FOR DELETE
  TO authenticated
  USING (auth.uid() = usuario_id);
