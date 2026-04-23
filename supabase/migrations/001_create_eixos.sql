-- Criação da tabela eixos
CREATE TABLE IF NOT EXISTS eixos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  icone TEXT NOT NULL, -- nome do ícone Lucide (ex: 'ShieldCheck', 'Database', 'Gavel', etc.)
  definicao TEXT NOT NULL,
  temas TEXT[] NOT NULL, -- array de strings
  entregas TEXT[] NOT NULL, -- array de strings
  ordem INTEGER NOT NULL DEFAULT 0, -- para controlar ordem de exibição
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para ordenação
CREATE INDEX idx_eixos_ordem ON eixos(ordem);

-- Índice para busca de ativos
CREATE INDEX idx_eixos_ativo ON eixos(ativo);

-- Inserir dados iniciais dos eixos
INSERT INTO eixos (titulo, icone, definicao, temas, entregas, ordem) VALUES
(
  'Regulação de IA',
  'ShieldCheck',
  'Estudo dos marcos regulatórios nacionais e internacionais que buscam disciplinar o desenvolvimento e uso de sistemas de inteligência artificial.',
  ARRAY['AI Act (UE)', 'PL 2338/2023 (Brasil)', 'Sandboxes regulatórias', 'Governança algorítmica'],
  ARRAY['Artigos acadêmicos', 'Notas técnicas', 'Mapeamentos legislativos', 'Eventos temáticos'],
  1
),
(
  'Proteção de Dados',
  'Database',
  'Análise da interseção entre legislação de proteção de dados (LGPD, GDPR) e o uso intensivo de dados por sistemas de IA e machine learning.',
  ARRAY['LGPD e IA', 'Decisões automatizadas', 'Privacy by design', 'Transferência internacional de dados'],
  ARRAY['Guias práticos', 'Artigos', 'Estudos de caso', 'Workshops'],
  2
),
(
  'Responsabilidade Civil e IA',
  'Gavel',
  'Investigação sobre regimes de responsabilidade aplicáveis a danos causados por sistemas autônomos e semiautônomos.',
  ARRAY['Responsabilidade objetiva vs. subjetiva', 'Veículos autônomos', 'Robótica', 'Nexo causal em IA'],
  ARRAY['Artigos', 'Seminários', 'Relatórios comparativos'],
  3
),
(
  'IA no Poder Judiciário',
  'Cpu',
  'Estudo sobre a adoção de ferramentas de IA por tribunais e órgãos do sistema de justiça.',
  ARRAY['Justiça preditiva', 'Sistemas de apoio à decisão', 'Devido processo', 'SINAPSES e Victor'],
  ARRAY['Pesquisas empíricas', 'Notas técnicas', 'Eventos com magistrados'],
  4
),
(
  'Ética e Viés Algorítmico',
  'Lightbulb',
  'Reflexão sobre os desafios éticos da IA, com foco em discriminação algorítmica, equidade e transparência.',
  ARRAY['Viés racial e de gênero', 'Explicabilidade (XAI)', 'Auditoria de algoritmos', 'IA e direitos fundamentais'],
  ARRAY['Artigos', 'Relatórios', 'Guias de boas práticas', 'Eventos'],
  5
),
(
  'Propriedade Intelectual e IA',
  'Scale',
  'Análise dos desafios que a IA traz para o direito autoral, patentes e criações geradas por máquinas.',
  ARRAY['Obras geradas por IA', 'Copyright e treinamento de modelos', 'Patentes de algoritmos', 'Fair use'],
  ARRAY['Artigos acadêmicos', 'Notas técnicas', 'Eventos interdisciplinares'],
  6
);
