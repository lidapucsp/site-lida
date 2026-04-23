-- Criação da tabela eventos
CREATE TABLE IF NOT EXISTS eventos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('Seminário', 'Workshop', 'Palestra', 'Congresso', 'Reunião', 'Mesa Redonda')),
  data_evento DATE NOT NULL,
  horario TEXT, -- ex: "14h-17h" ou "19h-21h"
  local TEXT, -- ex: "Auditório 300 — PUC-SP" ou "Online (Zoom)"
  status TEXT NOT NULL DEFAULT 'agendado' CHECK (status IN ('agendado', 'em_andamento', 'realizado', 'cancelado')),
  possui_materiais BOOLEAN DEFAULT false,
  url_inscricao TEXT, -- link para formulário de inscrição
  url_materiais TEXT, -- link para materiais do evento (gravação, slides, etc)
  capacidade INTEGER, -- número máximo de participantes
  organizador TEXT, -- nome do organizador responsável
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para otimização
CREATE INDEX idx_eventos_data ON eventos(data_evento DESC);
CREATE INDEX idx_eventos_status ON eventos(status);
CREATE INDEX idx_eventos_tipo ON eventos(tipo);
CREATE INDEX idx_eventos_ativo ON eventos(ativo);

-- Inserir eventos futuros
INSERT INTO eventos (titulo, descricao, tipo, data_evento, horario, local, status) VALUES
(
  'Seminário: IA Generativa e Direitos Autorais',
  'Mesa redonda com especialistas em propriedade intelectual e tecnologia sobre os desafios das obras criadas por IA generativa.',
  'Seminário',
  '2026-05-15',
  '14h–17h',
  'Auditório 300 — PUC-SP',
  'agendado'
),
(
  'Workshop: Prompt Engineering para Juristas',
  'Oficina prática sobre técnicas de prompt engineering aplicadas à pesquisa jurídica e à elaboração de peças.',
  'Workshop',
  '2026-05-28',
  '10h–12h',
  'Laboratório de Informática — PUC-SP',
  'agendado'
),
(
  'Palestra: LGPD na Era dos Dados Sintéticos',
  'Palestra aberta sobre as implicações da LGPD para o uso de dados sintéticos no treinamento de modelos de IA.',
  'Palestra',
  '2026-06-10',
  '19h–21h',
  'Online (Zoom)',
  'agendado'
);

-- Inserir eventos passados
INSERT INTO eventos (titulo, descricao, tipo, data_evento, status, possui_materiais) VALUES
(
  'I Congresso LIDA de Direito e IA',
  'Primeiro congresso do LIDA com 200 participantes, 12 palestrantes e 3 mesas redondas sobre regulação, ética e aplicação de IA no Direito.',
  'Congresso',
  '2025-11-15',
  'realizado',
  true
),
(
  'Workshop: Introdução ao Machine Learning para Juristas',
  'Oficina introdutória com conceitos básicos de ML aplicados ao contexto jurídico.',
  'Workshop',
  '2025-09-20',
  'realizado',
  true
),
(
  'Seminário: IA e o Futuro dos Tribunais',
  'Evento com participação de magistrados e pesquisadores sobre a adoção de IA pelo poder judiciário brasileiro.',
  'Seminário',
  '2025-08-10',
  'realizado',
  true
);
