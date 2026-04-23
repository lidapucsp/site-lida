-- Tabela principal de processos seletivos
CREATE TABLE IF NOT EXISTS processos_seletivos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  periodo TEXT NOT NULL, -- Ex: "2026.1"
  descricao TEXT,
  edital_url TEXT,
  edital_descricao TEXT,
  inscricao_url TEXT,
  inscricao_inicio TIMESTAMPTZ,
  inscricao_fim TIMESTAMPTZ,
  vagas INTEGER,
  ativo BOOLEAN DEFAULT true,
  exibir_site BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Requisitos de inscrição
CREATE TABLE IF NOT EXISTS processo_seletivo_requisitos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  processo_id UUID REFERENCES processos_seletivos(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compromissos dos participantes
CREATE TABLE IF NOT EXISTS processo_seletivo_compromissos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  processo_id UUID REFERENCES processos_seletivos(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cronograma (etapas e datas)
CREATE TABLE IF NOT EXISTS processo_seletivo_cronograma (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  processo_id UUID REFERENCES processos_seletivos(id) ON DELETE CASCADE,
  etapa TEXT NOT NULL,
  data_inicio TIMESTAMPTZ,
  data_fim TIMESTAMPTZ,
  descricao TEXT,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FAQs
CREATE TABLE IF NOT EXISTS processo_seletivo_faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  processo_id UUID REFERENCES processos_seletivos(id) ON DELETE CASCADE,
  pergunta TEXT NOT NULL,
  resposta TEXT NOT NULL,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Informações essenciais (bullets de destaque)
CREATE TABLE IF NOT EXISTS processo_seletivo_infos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  processo_id UUID REFERENCES processos_seletivos(id) ON DELETE CASCADE,
  texto TEXT NOT NULL,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resultados de seleções anteriores
CREATE TABLE IF NOT EXISTS processo_seletivo_resultados_anteriores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  processo_id UUID REFERENCES processos_seletivos(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  url TEXT,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Aprovados do processo seletivo
CREATE TABLE IF NOT EXISTS processo_seletivo_aprovados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  processo_id UUID REFERENCES processos_seletivos(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  instituicao TEXT,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies (público pode ler, apenas admins podem modificar)
ALTER TABLE processos_seletivos ENABLE ROW LEVEL SECURITY;
ALTER TABLE processo_seletivo_requisitos ENABLE ROW LEVEL SECURITY;
ALTER TABLE processo_seletivo_compromissos ENABLE ROW LEVEL SECURITY;
ALTER TABLE processo_seletivo_cronograma ENABLE ROW LEVEL SECURITY;
ALTER TABLE processo_seletivo_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE processo_seletivo_infos ENABLE ROW LEVEL SECURITY;
ALTER TABLE processo_seletivo_resultados_anteriores ENABLE ROW LEVEL SECURITY;
ALTER TABLE processo_seletivo_aprovados ENABLE ROW LEVEL SECURITY;

-- Políticas de leitura pública
CREATE POLICY "Processos seletivos são públicos" ON processos_seletivos FOR SELECT USING (true);
CREATE POLICY "Requisitos são públicos" ON processo_seletivo_requisitos FOR SELECT USING (true);
CREATE POLICY "Compromissos são públicos" ON processo_seletivo_compromissos FOR SELECT USING (true);
CREATE POLICY "Cronograma é público" ON processo_seletivo_cronograma FOR SELECT USING (true);
CREATE POLICY "FAQs são públicos" ON processo_seletivo_faqs FOR SELECT USING (true);
CREATE POLICY "Infos são públicas" ON processo_seletivo_infos FOR SELECT USING (true);
CREATE POLICY "Resultados anteriores são públicos" ON processo_seletivo_resultados_anteriores FOR SELECT USING (true);
CREATE POLICY "Aprovados são públicos" ON processo_seletivo_aprovados FOR SELECT USING (true);

-- Políticas de admin (insert, update, delete)
CREATE POLICY "Admins podem gerenciar processos" ON processos_seletivos FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins podem gerenciar requisitos" ON processo_seletivo_requisitos FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins podem gerenciar compromissos" ON processo_seletivo_compromissos FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins podem gerenciar cronograma" ON processo_seletivo_cronograma FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins podem gerenciar FAQs" ON processo_seletivo_faqs FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins podem gerenciar infos" ON processo_seletivo_infos FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins podem gerenciar resultados anteriores" ON processo_seletivo_resultados_anteriores FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins podem gerenciar aprovados" ON processo_seletivo_aprovados FOR ALL USING (public.is_admin(auth.uid()));

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_processo_seletivo_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER processo_seletivo_updated_at
BEFORE UPDATE ON processos_seletivos
FOR EACH ROW EXECUTE FUNCTION update_processo_seletivo_updated_at();
