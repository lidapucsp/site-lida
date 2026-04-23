-- ============================================
-- POLÍTICAS DE ACESSO PÚBLICO (RLS)
-- ============================================
-- Este arquivo cria políticas de Row Level Security
-- permitindo leitura pública de todas as tabelas ativas

-- Política de leitura pública para eixos
CREATE POLICY "Permitir leitura pública de eixos ativos" ON public.eixos
  FOR SELECT
  USING (ativo = true);

-- Política de leitura pública para publicacoes
CREATE POLICY "Permitir leitura pública de publicacoes ativas" ON public.publicacoes
  FOR SELECT
  USING (ativo = true);

-- Política de leitura pública para eventos
CREATE POLICY "Permitir leitura pública de eventos ativos" ON public.eventos
  FOR SELECT
  USING (ativo = true);

-- Política de leitura pública para membros
CREATE POLICY "Permitir leitura pública de membros ativos" ON public.membros
  FOR SELECT
  USING (ativo = true);

-- Confirmar que RLS está habilitado (já deve estar, mas garantindo)
ALTER TABLE public.eixos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publicacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membros ENABLE ROW LEVEL SECURITY;
