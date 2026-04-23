-- Inserir processo seletivo 2026.1 com dados reais
INSERT INTO processos_seletivos (
  id,
  titulo,
  periodo,
  descricao,
  edital_url,
  edital_descricao,
  inscricao_url,
  inscricao_inicio,
  inscricao_fim,
  vagas,
  ativo,
  exibir_site
) VALUES (
  'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
  'Edital Processo Seletivo 2026.1',
  '2026.1',
  'Processo Seletivo para primeira turma do LIDA',
  'https://drive.google.com/file/d/1MN7WpRxoYP6SZC_1zZpwbMWrMilSgHqR/view?usp=sharing',
  'Leia o edital completo com todas as regras, critérios de seleção e informações sobre o processo.',
  'https://forms.gle/cLmgoubo87g31oqS6',
  '2026-03-23 13:00:00+00',
  '2026-04-08 02:59:59+00',
  20,
  true,
  true
);

-- Informações essenciais
INSERT INTO processo_seletivo_infos (processo_id, texto, ordem) VALUES
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Etapa única - sem dinâmicas ou entrevistas presenciais', 1),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Até 20 participantes selecionados para a primeira turma', 2),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Resultado divulgado até 15/04 via e-mail aos aprovados', 3);

-- Requisitos de inscrição
INSERT INTO processo_seletivo_requisitos (processo_id, titulo, descricao, ordem) VALUES
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Formulário classificatório', 'Informações de contato, interesses e motivações para participar do grupo', 1),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Carta de apresentação', 'Documento elaborado pelo candidato apresentando sua trajetória e objetivos', 2),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Resposta reflexiva', 'Em até 15 linhas, responder à pergunta: "Como você utiliza IA no seu cotidiano?"', 3);

-- Cronograma
INSERT INTO processo_seletivo_cronograma (processo_id, etapa, descricao, data_inicio, ordem) VALUES
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Abertura das inscrições', '23/03/2026 às 10h', '2026-03-23 13:00:00+00', 1),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Encerramento das inscrições', '07/04/2026 às 23h59', '2026-04-08 02:59:59+00', 2),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Divulgação do resultado', 'Até 15/04/2026', '2026-04-15 23:59:59+00', 3);

-- Compromissos dos participantes
INSERT INTO processo_seletivo_compromissos (processo_id, descricao, ordem) VALUES
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Participar das reuniões semanais aos sábados, das 9h às 11h', 1),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Presença mínima de 75% nas reuniões', 2),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Produzir artigo acadêmico ao final do programa', 3),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Colaborar com projetos e atividades do laboratório', 4);

-- FAQs
INSERT INTO processo_seletivo_faqs (processo_id, pergunta, resposta, ordem) VALUES
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 
 'Quem pode participar do processo seletivo?', 
 'O LIDA é aberto a participantes de todo o Brasil: estudantes de graduação, mestrado e doutorado, além de pesquisadores e advogados interessados em compreender, estudar e discutir a aplicação da IA no campo jurídico.', 
 1),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 
 'Preciso ter experiência com IA ou tecnologia?', 
 'Não. Buscamos pessoas curiosas e comprometidas. O LIDA oferece formação e desenvolvimento durante o programa.', 
 2),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 
 'As atividades são presenciais ou online?', 
 'As aulas do LIDA são majoritariamente online, permitindo participantes de diferentes regiões. Eventualmente, podem ser organizados encontros ou atividades presenciais, previamente combinados e agendados entre os membros.', 
 3),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 
 'Qual é o compromisso de tempo?', 
 'Reuniões semanais aos sábados, das 9h às 11h da manhã, com presença mínima obrigatória de 75%, além da participação em projetos e produção de artigo acadêmico.', 
 4),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 
 'O certificado vale como horas complementares?', 
 'Sim. Ao final do ciclo de estudos, será emitido certificado de participação que poderá ser utilizado como horas complementares, conforme as regras de cada instituição de ensino.', 
 5),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 
 'Quantas vagas estão disponíveis?', 
 'Serão selecionados até 20 participantes para compor a primeira turma do LIDA em 2026.1.', 
 6),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 
 'Quais são os benefícios de participar?', 
 'Além da formação em IA aplicada ao Direito, os participantes terão acesso a debates, contato com profissionais da área e oportunidades de networking acadêmico e profissional.', 
 7);

-- Resultados de seleções anteriores (placeholders)
INSERT INTO processo_seletivo_resultados_anteriores (processo_id, titulo, url, ordem) VALUES
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Processo Seletivo 2025.2', '#', 1),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Processo Seletivo 2025.1', '#', 2);
