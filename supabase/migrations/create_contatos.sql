-- Tabela para armazenar mensagens de contato
CREATE TABLE IF NOT EXISTS contatos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  assunto VARCHAR(255) NOT NULL,
  mensagem TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'novo',
  lido BOOLEAN DEFAULT FALSE,
  resposta TEXT,
  respondido_por UUID REFERENCES auth.users(id),
  respondido_em TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX idx_contatos_status ON contatos(status);
CREATE INDEX idx_contatos_lido ON contatos(lido);
CREATE INDEX idx_contatos_created_at ON contatos(created_at DESC);

-- RLS Policies
ALTER TABLE contatos ENABLE ROW LEVEL SECURITY;

-- Permitir qualquer pessoa (mesmo não autenticada) inserir um contato
CREATE POLICY "Qualquer pessoa pode enviar mensagem de contato"
  ON contatos FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Apenas admins podem ver todos os contatos
CREATE POLICY "Apenas admins podem ver contatos"
  ON contatos FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Apenas admins podem atualizar contatos
CREATE POLICY "Apenas admins podem atualizar contatos"
  ON contatos FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_contatos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_contatos_updated_at
  BEFORE UPDATE ON contatos
  FOR EACH ROW
  EXECUTE FUNCTION update_contatos_updated_at();

-- Comentários
COMMENT ON TABLE contatos IS 'Mensagens recebidas através do formulário de contato';
COMMENT ON COLUMN contatos.status IS 'novo, em_analise, respondido, arquivado';
