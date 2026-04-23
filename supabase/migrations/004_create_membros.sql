-- Criação da tabela membros
CREATE TABLE IF NOT EXISTS membros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  cargo TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('coordenador', 'diretor', 'membro')),
  bio TEXT NOT NULL,
  foto_url TEXT NOT NULL, -- caminho para foto no /public
  linkedin_url TEXT,
  is_founder BOOLEAN DEFAULT false,
  ordem INTEGER NOT NULL DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_membros_tipo ON membros(tipo);
CREATE INDEX idx_membros_ordem ON membros(ordem);
CREATE INDEX idx_membros_ativo ON membros(ativo);

-- Inserir coordenador
INSERT INTO membros (nome, cargo, tipo, bio, foto_url, linkedin_url, ordem) VALUES
(
  'Prof. Dr. José de Jesus Filho',
  'Professor Orientador',
  'coordenador',
  'Doutor e professor na PUC-SP, especialista em Direito e Tecnologia. Coordena o LIDA com foco em pesquisa aplicada sobre IA e Sistema de Justiça, orientando projetos que conectam rigor acadêmico à transformação digital do campo jurídico.',
  '/Jose-foto.jpeg',
  'https://www.linkedin.com/in/jjesusfilho/',
  1
);

-- Inserir diretoria
INSERT INTO membros (nome, cargo, tipo, bio, foto_url, linkedin_url, is_founder, ordem) VALUES
(
  'Marília Affonso',
  'Diretora Acadêmica',
  'diretor',
  'Responsável pela coordenação das atividades acadêmicas do LIDA, incluindo grupos de estudo, projetos de pesquisa e produção científica, garantindo rigor metodológico e excelência nas publicações.',
  '/Marilia-foto.jpeg',
  'https://www.linkedin.com/in/marília-affonso-9024763b3/',
  false,
  2
),
(
  'Giovanna P. Andrade',
  'Presidente & Founder',
  'diretor',
  'Idealizadora e fundadora do LIDA, lidera o laboratório como presidente, representando a instituição e conduzindo decisões estratégicas. É responsável pela visão do projeto, articulação de parcerias e posicionamento institucional, além de supervisionar a comunicação e o engajamento com a comunidade acadêmica.',
  '/Giovanna-foto.jpeg',
  'https://www.linkedin.com/in/giovannapandrade/',
  true,
  3
),
(
  'Felipe Toshio Kamishibahara',
  'Diretor Administrativo',
  'diretor',
  'Coordena a gestão administrativa e organizacional do laboratório, incluindo planejamento de atividades, controle de participação, logística de eventos e processos seletivos.',
  '/Felipe-foto.jpeg',
  'https://www.linkedin.com/in/felipe-toshio-kamishibahara-44822537a/',
  false,
  4
);
