-- Criação da tabela publicacoes
CREATE TABLE IF NOT EXISTS publicacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  autores TEXT NOT NULL, -- nomes dos autores separados por vírgula
  data_publicacao DATE NOT NULL,
  ano INTEGER NOT NULL,
  eixo_id UUID REFERENCES eixos(id) ON DELETE SET NULL, -- relacionamento com eixos
  eixo_nome TEXT, -- nome do eixo (para filtros rápidos)
  tipo TEXT NOT NULL CHECK (tipo IN ('Artigo', 'Nota Técnica', 'Relatório', 'Guia', 'Resumo')),
  resumo TEXT NOT NULL,
  citacao TEXT NOT NULL,
  arquivo_url TEXT, -- URL para download do PDF (opcional)
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para otimização de queries
CREATE INDEX idx_publicacoes_ano ON publicacoes(ano DESC);
CREATE INDEX idx_publicacoes_eixo_id ON publicacoes(eixo_id);
CREATE INDEX idx_publicacoes_tipo ON publicacoes(tipo);
CREATE INDEX idx_publicacoes_ativo ON publicacoes(ativo);
CREATE INDEX idx_publicacoes_data ON publicacoes(data_publicacao DESC);

-- Inserir dados iniciais das publicações
INSERT INTO publicacoes (titulo, autores, data_publicacao, ano, eixo_nome, tipo, resumo, citacao) VALUES
(
  'Inteligência Artificial e o Futuro da Advocacia',
  'Maria Santos, João Silva',
  '2026-03-01',
  2026,
  'Regulação de IA',
  'Artigo',
  'Análise das transformações que a IA generativa traz para a prática jurídica e os novos papéis do advogado.',
  'SANTOS, M.; SILVA, J. Inteligência Artificial e o Futuro da Advocacia. LIDA/PUC-SP, 2026.'
),
(
  'Regulação de IA: Lições da União Europeia para o Brasil',
  'Ana Costa, Pedro Lima',
  '2026-02-01',
  2026,
  'Regulação de IA',
  'Artigo',
  'Estudo comparado entre o AI Act europeu e os projetos de lei brasileiros sobre inteligência artificial.',
  'COSTA, A.; LIMA, P. Regulação de IA: Lições da UE para o Brasil. LIDA/PUC-SP, 2026.'
),
(
  'LGPD e Machine Learning: Desafios Práticos',
  'Lucas Oliveira',
  '2026-01-01',
  2026,
  'Proteção de Dados',
  'Nota Técnica',
  'Mapeamento dos principais desafios de conformidade com a LGPD em projetos de machine learning.',
  'OLIVEIRA, L. LGPD e Machine Learning: Desafios Práticos. LIDA/PUC-SP, 2026.'
),
(
  'Viés Algorítmico em Decisões Judiciais: Um Estudo Empírico',
  'Pedro Lima, Carla Mendes',
  '2025-11-01',
  2025,
  'Ética e Viés',
  'Relatório',
  'Pesquisa empírica que identificou padrões de viés racial em sistema de predição de reincidência utilizado por tribunal estadual.',
  'LIMA, P.; MENDES, C. Viés Algorítmico em Decisões Judiciais. LIDA/PUC-SP, 2025.'
),
(
  'Guia LGPD para Startups de IA',
  'Lucas Oliveira, Beatriz Faria',
  '2025-10-01',
  2025,
  'Proteção de Dados',
  'Guia',
  'Manual prático com checklist e fluxogramas para startups que desenvolvem produtos baseados em inteligência artificial.',
  'OLIVEIRA, L.; FARIA, B. Guia LGPD para Startups de IA. LIDA/PUC-SP, 2025.'
),
(
  'Responsabilidade Civil por Veículos Autônomos no Brasil',
  'Pedro Lima, Roberto Ferreira',
  '2025-09-01',
  2025,
  'Responsabilidade Civil',
  'Artigo',
  'Proposta de framework jurídico para alocação de responsabilidade em acidentes envolvendo veículos autônomos.',
  'LIMA, P.; FERREIRA, R. Responsabilidade Civil por Veículos Autônomos. LIDA/PUC-SP, 2025.'
),
(
  'IA no Judiciário Brasileiro: Panorama 2025',
  'Maria Santos, Carla Mendes, João Silva',
  '2025-08-01',
  2025,
  'IA no Judiciário',
  'Relatório',
  'Levantamento completo das ferramentas de IA adotadas por tribunais brasileiros até agosto de 2025.',
  'SANTOS, M.; MENDES, C.; SILVA, J. IA no Judiciário Brasileiro. LIDA/PUC-SP, 2025.'
),
(
  'Direito Autoral e IA Generativa: Quem é o Autor?',
  'Ana Costa',
  '2025-07-01',
  2025,
  'Propriedade Intelectual',
  'Artigo',
  'Reflexão sobre a titularidade de obras criadas por sistemas de IA generativa à luz do direito brasileiro.',
  'COSTA, A. Direito Autoral e IA Generativa. LIDA/PUC-SP, 2025.'
),
(
  'Transparência Algorítmica: Princípios e Práticas',
  'Carla Mendes',
  '2025-06-01',
  2025,
  'Ética e Viés',
  'Nota Técnica',
  'Compilação de princípios de transparência algorítmica e práticas de explicabilidade (XAI) aplicáveis ao setor público.',
  'MENDES, C. Transparência Algorítmica. LIDA/PUC-SP, 2025.'
),
(
  'Sandboxes Regulatórias para IA: Modelos Internacionais',
  'Roberto Ferreira, Ana Costa',
  '2025-05-01',
  2025,
  'Regulação de IA',
  'Resumo',
  'Análise comparativa de sandboxes regulatórias para inteligência artificial implementadas em 8 países.',
  'FERREIRA, R.; COSTA, A. Sandboxes Regulatórias para IA. LIDA/PUC-SP, 2025.'
);

-- Nota: Os eixo_id serão populados depois que soubermos os UUIDs gerados na tabela eixos
-- Para atualizar os relacionamentos, execute:
-- UPDATE publicacoes p SET eixo_id = e.id 
-- FROM eixos e 
-- WHERE p.eixo_nome = e.titulo;
