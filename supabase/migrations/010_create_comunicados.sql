-- Criar tabela para registrar histórico de comunicados enviados
CREATE TABLE IF NOT EXISTS public.comunicados (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assunto TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  enviado_por UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  destinatarios TEXT[] NOT NULL,
  enviado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'enviado' CHECK (status IN ('enviado', 'falha', 'pendente', 'parcial'))
);

-- Adicionar comentários
COMMENT ON TABLE public.comunicados IS 'Histórico de comunicados enviados por email';
COMMENT ON COLUMN public.comunicados.assunto IS 'Assunto do email';
COMMENT ON COLUMN public.comunicados.mensagem IS 'Conteúdo da mensagem enviada';
COMMENT ON COLUMN public.comunicados.enviado_por IS 'ID do admin que enviou o comunicado';
COMMENT ON COLUMN public.comunicados.destinatarios IS 'Array com emails dos destinatários';
COMMENT ON COLUMN public.comunicados.enviado_em IS 'Data e hora do envio';
COMMENT ON COLUMN public.comunicados.status IS 'Status do envio (enviado, falha, pendente)';

-- Criar índices
CREATE INDEX idx_comunicados_enviado_por ON public.comunicados(enviado_por);
CREATE INDEX idx_comunicados_enviado_em ON public.comunicados(enviado_em DESC);
CREATE INDEX idx_comunicados_status ON public.comunicados(status);

-- Habilitar RLS
ALTER TABLE public.comunicados ENABLE ROW LEVEL SECURITY;

-- Policy para admins verem todos os comunicados
CREATE POLICY "Admins podem ver todos os comunicados"
  ON public.comunicados
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Policy para admins criarem comunicados
CREATE POLICY "Admins podem criar comunicados"
  ON public.comunicados
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Policy para admins atualizarem comunicados
CREATE POLICY "Admins podem atualizar comunicados"
  ON public.comunicados
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Policy para admins deletarem comunicados
CREATE POLICY "Admins podem deletar comunicados"
  ON public.comunicados
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );
