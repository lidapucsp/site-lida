-- Migration: Create calendario table
-- Description: Table to store calendar events
-- Created: 2026-04-22

CREATE TABLE IF NOT EXISTS public.calendario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  data DATE NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('Reunião', 'Estudo', 'Prazo', 'Evento', 'Seletivo')),
  descricao TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_calendario_data ON calendario(data);
CREATE INDEX idx_calendario_tipo ON calendario(tipo);
CREATE INDEX idx_calendario_ativo ON calendario(ativo);

-- Trigger para atualizar updated_at
CREATE TRIGGER trigger_calendario_updated_at
BEFORE UPDATE ON calendario
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- RLS (Row Level Security)
ALTER TABLE calendario ENABLE ROW LEVEL SECURITY;

-- Políticas: Todos podem ler eventos ativos
CREATE POLICY "Anyone can view active calendar events"
ON calendario FOR SELECT
TO authenticated, anon
USING (ativo = true);

-- Políticas: Apenas admins podem gerenciar
CREATE POLICY "Admins can insert calendar events"
ON calendario FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

CREATE POLICY "Admins can update calendar events"
ON calendario FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

CREATE POLICY "Admins can delete calendar events"
ON calendario FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Comentários
COMMENT ON TABLE calendario IS 'Eventos do calendário LIDA';
COMMENT ON COLUMN calendario.tipo IS 'Tipo do evento: Reunião, Estudo, Prazo, Evento, ou Seletivo';
COMMENT ON COLUMN calendario.ativo IS 'Se false, o evento não aparece no calendário público';
