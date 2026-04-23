-- ============================================
-- CRIAÇÃO COMPLETA DO BANCO DE DADOS - SITE LIDA
-- Execute este arquivo no Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. TABELA: eixos
-- ============================================
CREATE TABLE IF NOT EXISTS eixos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  icone TEXT NOT NULL,
  definicao TEXT NOT NULL,
  temas TEXT[] NOT NULL,
  entregas TEXT[] NOT NULL,
  ordem INTEGER NOT NULL DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_eixos_ordem ON eixos(ordem);
CREATE INDEX idx_eixos_ativo ON eixos(ativo);

INSERT INTO eixos (titulo, icone, definicao, temas, entregas, ordem) VALUES
('Regulação de IA', 'ShieldCheck', 'Estudo dos marcos regulatórios nacionais e internacionais que buscam disciplinar o desenvolvimento e uso de sistemas de inteligência artificial.', ARRAY['AI Act (UE)', 'PL 2338/2023 (Brasil)', 'Sandboxes regulatórias', 'Governança algorítmica'], ARRAY['Artigos acadêmicos', 'Notas técnicas', 'Mapeamentos legislativos', 'Eventos temáticos'], 1),
('Proteção de Dados', 'Database', 'Análise da interseção entre legislação de proteção de dados (LGPD, GDPR) e o uso intensivo de dados por sistemas de IA e machine learning.', ARRAY['LGPD e IA', 'Decisões automatizadas', 'Privacy by design', 'Transferência internacional de dados'], ARRAY['Guias práticos', 'Artigos', 'Estudos de caso', 'Workshops'], 2),
('Responsabilidade Civil e IA', 'Gavel', 'Investigação sobre regimes de responsabilidade aplicáveis a danos causados por sistemas autônomos e semiautônomos.', ARRAY['Responsabilidade objetiva vs. subjetiva', 'Veículos autônomos', 'Robótica', 'Nexo causal em IA'], ARRAY['Artigos', 'Seminários', 'Relatórios comparativos'], 3),
('IA no Poder Judiciário', 'Cpu', 'Estudo sobre a adoção de ferramentas de IA por tribunais e órgãos do sistema de justiça.', ARRAY['Justiça preditiva', 'Sistemas de apoio à decisão', 'Devido processo', 'SINAPSES e Victor'], ARRAY['Pesquisas empíricas', 'Notas técnicas', 'Eventos com magistrados'], 4),
('Ética e Viés Algorítmico', 'Lightbulb', 'Reflexão sobre os desafios éticos da IA, com foco em discriminação algorítmica, equidade e transparência.', ARRAY['Viés racial e de gênero', 'Explicabilidade (XAI)', 'Auditoria de algoritmos', 'IA e direitos fundamentais'], ARRAY['Artigos', 'Relatórios', 'Guias de boas práticas', 'Eventos'], 5),
('Propriedade Intelectual e IA', 'Scale', 'Análise dos desafios que a IA traz para o direito autoral, patentes e criações geradas por máquinas.', ARRAY['Obras geradas por IA', 'Copyright e treinamento de modelos', 'Patentes de algoritmos', 'Fair use'], ARRAY['Artigos acadêmicos', 'Notas técnicas', 'Eventos interdisciplinares'], 6);

-- ============================================
-- 2. TABELA: publicacoes
-- ============================================
CREATE TABLE IF NOT EXISTS publicacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  autores TEXT NOT NULL,
  data_publicacao DATE NOT NULL,
  ano INTEGER NOT NULL,
  eixo_id UUID REFERENCES eixos(id) ON DELETE SET NULL,
  eixo_nome TEXT,
  tipo TEXT NOT NULL CHECK (tipo IN ('Artigo', 'Nota Técnica', 'Relatório', 'Guia', 'Resumo')),
  resumo TEXT NOT NULL,
  citacao TEXT NOT NULL,
  arquivo_url TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_publicacoes_ano ON publicacoes(ano DESC);
CREATE INDEX idx_publicacoes_eixo_id ON publicacoes(eixo_id);
CREATE INDEX idx_publicacoes_tipo ON publicacoes(tipo);
CREATE INDEX idx_publicacoes_ativo ON publicacoes(ativo);
CREATE INDEX idx_publicacoes_data ON publicacoes(data_publicacao DESC);

INSERT INTO publicacoes (titulo, autores, data_publicacao, ano, eixo_nome, tipo, resumo, citacao) VALUES
('Inteligência Artificial e o Futuro da Advocacia', 'Maria Santos, João Silva', '2026-03-01', 2026, 'Regulação de IA', 'Artigo', 'Análise das transformações que a IA generativa traz para a prática jurídica e os novos papéis do advogado.', 'SANTOS, M.; SILVA, J. Inteligência Artificial e o Futuro da Advocacia. LIDA/PUC-SP, 2026.'),
('Regulação de IA: Lições da União Europeia para o Brasil', 'Ana Costa, Pedro Lima', '2026-02-01', 2026, 'Regulação de IA', 'Artigo', 'Estudo comparado entre o AI Act europeu e os projetos de lei brasileiros sobre inteligência artificial.', 'COSTA, A.; LIMA, P. Regulação de IA: Lições da UE para o Brasil. LIDA/PUC-SP, 2026.'),
('LGPD e Machine Learning: Desafios Práticos', 'Lucas Oliveira', '2026-01-01', 2026, 'Proteção de Dados', 'Nota Técnica', 'Mapeamento dos principais desafios de conformidade com a LGPD em projetos de machine learning.', 'OLIVEIRA, L. LGPD e Machine Learning: Desafios Práticos. LIDA/PUC-SP, 2026.'),
('Viés Algorítmico em Decisões Judiciais: Um Estudo Empírico', 'Pedro Lima, Carla Mendes', '2025-11-01', 2025, 'Ética e Viés', 'Relatório', 'Pesquisa empírica que identificou padrões de viés racial em sistema de predição de reincidência utilizado por tribunal estadual.', 'LIMA, P.; MENDES, C. Viés Algorítmico em Decisões Judiciais. LIDA/PUC-SP, 2025.'),
('Guia LGPD para Startups de IA', 'Lucas Oliveira, Beatriz Faria', '2025-10-01', 2025, 'Proteção de Dados', 'Guia', 'Manual prático com checklist e fluxogramas para startups que desenvolvem produtos baseados em inteligência artificial.', 'OLIVEIRA, L.; FARIA, B. Guia LGPD para Startups de IA. LIDA/PUC-SP, 2025.'),
('Responsabilidade Civil por Veículos Autônomos no Brasil', 'Pedro Lima, Roberto Ferreira', '2025-09-01', 2025, 'Responsabilidade Civil', 'Artigo', 'Proposta de framework jurídico para alocação de responsabilidade em acidentes envolvendo veículos autônomos.', 'LIMA, P.; FERREIRA, R. Responsabilidade Civil por Veículos Autônomos. LIDA/PUC-SP, 2025.'),
('IA no Judiciário Brasileiro: Panorama 2025', 'Maria Santos, Carla Mendes, João Silva', '2025-08-01', 2025, 'IA no Judiciário', 'Relatório', 'Levantamento completo das ferramentas de IA adotadas por tribunais brasileiros até agosto de 2025.', 'SANTOS, M.; MENDES, C.; SILVA, J. IA no Judiciário Brasileiro. LIDA/PUC-SP, 2025.'),
('Direito Autoral e IA Generativa: Quem é o Autor?', 'Ana Costa', '2025-07-01', 2025, 'Propriedade Intelectual', 'Artigo', 'Reflexão sobre a titularidade de obras criadas por sistemas de IA generativa à luz do direito brasileiro.', 'COSTA, A. Direito Autoral e IA Generativa. LIDA/PUC-SP, 2025.'),
('Transparência Algorítmica: Princípios e Práticas', 'Carla Mendes', '2025-06-01', 2025, 'Ética e Viés', 'Nota Técnica', 'Compilação de princípios de transparência algorítmica e práticas de explicabilidade (XAI) aplicáveis ao setor público.', 'MENDES, C. Transparência Algorítmica. LIDA/PUC-SP, 2025.'),
('Sandboxes Regulatórias para IA: Modelos Internacionais', 'Roberto Ferreira, Ana Costa', '2025-05-01', 2025, 'Regulação de IA', 'Resumo', 'Análise comparativa de sandboxes regulatórias para inteligência artificial implementadas em 8 países.', 'FERREIRA, R.; COSTA, A. Sandboxes Regulatórias para IA. LIDA/PUC-SP, 2025.');

-- Atualizar relacionamento eixo_id
UPDATE publicacoes p SET eixo_id = e.id FROM eixos e WHERE p.eixo_nome = e.titulo;

-- ============================================
-- 3. TABELA: eventos
-- ============================================
CREATE TABLE IF NOT EXISTS eventos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('Seminário', 'Workshop', 'Palestra', 'Congresso', 'Reunião', 'Mesa Redonda')),
  data_evento DATE NOT NULL,
  horario TEXT,
  local TEXT,
  status TEXT NOT NULL DEFAULT 'agendado' CHECK (status IN ('agendado', 'em_andamento', 'realizado', 'cancelado')),
  possui_materiais BOOLEAN DEFAULT false,
  url_inscricao TEXT,
  url_materiais TEXT,
  capacidade INTEGER,
  organizador TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_eventos_data ON eventos(data_evento DESC);
CREATE INDEX idx_eventos_status ON eventos(status);
CREATE INDEX idx_eventos_tipo ON eventos(tipo);
CREATE INDEX idx_eventos_ativo ON eventos(ativo);

INSERT INTO eventos (titulo, descricao, tipo, data_evento, horario, local, status) VALUES
('Seminário: IA Generativa e Direitos Autorais', 'Mesa redonda com especialistas em propriedade intelectual e tecnologia sobre os desafios das obras criadas por IA generativa.', 'Seminário', '2026-05-15', '14h–17h', 'Auditório 300 — PUC-SP', 'agendado'),
('Workshop: Prompt Engineering para Juristas', 'Oficina prática sobre técnicas de prompt engineering aplicadas à pesquisa jurídica e à elaboração de peças.', 'Workshop', '2026-05-28', '10h–12h', 'Laboratório de Informática — PUC-SP', 'agendado'),
('Palestra: LGPD na Era dos Dados Sintéticos', 'Palestra aberta sobre as implicações da LGPD para o uso de dados sintéticos no treinamento de modelos de IA.', 'Palestra', '2026-06-10', '19h–21h', 'Online (Zoom)', 'agendado');

INSERT INTO eventos (titulo, descricao, tipo, data_evento, status, possui_materiais) VALUES
('I Congresso LIDA de Direito e IA', 'Primeiro congresso do LIDA com 200 participantes, 12 palestrantes e 3 mesas redondas sobre regulação, ética e aplicação de IA no Direito.', 'Congresso', '2025-11-15', 'realizado', true),
('Workshop: Introdução ao Machine Learning para Juristas', 'Oficina introdutória com conceitos básicos de ML aplicados ao contexto jurídico.', 'Workshop', '2025-09-20', 'realizado', true),
('Seminário: IA e o Futuro dos Tribunais', 'Evento com participação de magistrados e pesquisadores sobre a adoção de IA pelo poder judiciário brasileiro.', 'Seminário', '2025-08-10', 'realizado', true);

-- ============================================
-- 4. TABELA: membros
-- ============================================
CREATE TABLE IF NOT EXISTS membros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  cargo TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('coordenador', 'diretor', 'membro')),
  bio TEXT NOT NULL,
  foto_url TEXT NOT NULL,
  linkedin_url TEXT,
  is_founder BOOLEAN DEFAULT false,
  ordem INTEGER NOT NULL DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_membros_tipo ON membros(tipo);
CREATE INDEX idx_membros_ordem ON membros(ordem);
CREATE INDEX idx_membros_ativo ON membros(ativo);

INSERT INTO membros (nome, cargo, tipo, bio, foto_url, linkedin_url, ordem) VALUES
('Prof. Dr. José de Jesus Filho', 'Professor Orientador', 'coordenador', 'Doutor e professor na PUC-SP, especialista em Direito e Tecnologia. Coordena o LIDA com foco em pesquisa aplicada sobre IA e Sistema de Justiça, orientando projetos que conectam rigor acadêmico à transformação digital do campo jurídico.', '/Jose-foto.jpeg', 'https://www.linkedin.com/in/jjesusfilho/', 1);

INSERT INTO membros (nome, cargo, tipo, bio, foto_url, linkedin_url, is_founder, ordem) VALUES
('Marília Affonso', 'Diretora Acadêmica', 'diretor', 'Responsável pela coordenação das atividades acadêmicas do LIDA, incluindo grupos de estudo, projetos de pesquisa e produção científica, garantindo rigor metodológico e excelência nas publicações.', '/Marilia-foto.jpeg', 'https://www.linkedin.com/in/marília-affonso-9024763b3/', false, 2),
('Giovanna P. Andrade', 'Presidente & Founder', 'diretor', 'Idealizadora e fundadora do LIDA, lidera o laboratório como presidente, representando a instituição e conduzindo decisões estratégicas. É responsável pela visão do projeto, articulação de parcerias e posicionamento institucional, além de supervisionar a comunicação e o engajamento com a comunidade acadêmica.', '/Giovanna-foto.jpeg', 'https://www.linkedin.com/in/giovannapandrade/', true, 3),
('Felipe Toshio Kamishibahara', 'Diretor Administrativo', 'diretor', 'Coordena a gestão administrativa e organizacional do laboratório, incluindo planejamento de atividades, controle de participação, logística de eventos e processos seletivos.', '/Felipe-foto.jpeg', 'https://www.linkedin.com/in/felipe-toshio-kamishibahara-44822537a/', false, 4);

-- ============================================
-- FIM DAS MIGRAÇÕES
-- ============================================
