-- Tabela de Equipes do Ecossistema
CREATE TABLE IF NOT EXISTS public.equipes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    nome text NOT NULL UNIQUE,
    descricao text,
    diretor_id uuid REFERENCES public.profiles(id),
    diretor_nome text,
    cor text DEFAULT '#1e3a8a',
    icone text,
    ordem integer DEFAULT 0,
    ativo boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Tabela de Funções por Equipe
CREATE TABLE IF NOT EXISTS public.funcoes_equipe (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    equipe_id uuid REFERENCES public.equipes(id) ON DELETE CASCADE,
    nome text NOT NULL,
    descricao text,
    ordem integer DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

-- Tabela de Membros nas Equipes
CREATE TABLE IF NOT EXISTS public.membros_equipe (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    equipe_id uuid REFERENCES public.equipes(id) ON DELETE CASCADE,
    funcao_id uuid REFERENCES public.funcoes_equipe(id),
    nivel text DEFAULT 'iniciante' CHECK (nivel IN ('iniciante', 'ativo', 'lider', 'coordenador')),
    data_entrada timestamptz DEFAULT now(),
    ativo boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(user_id, equipe_id)
);

-- Tabela de Tarefas do Ecossistema
CREATE TABLE IF NOT EXISTS public.tarefas_ecossistema (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    titulo text NOT NULL,
    descricao text,
    equipe_id uuid REFERENCES public.equipes(id),
    atribuido_para uuid REFERENCES public.profiles(id),
    criado_por uuid REFERENCES public.profiles(id),
    status text DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_andamento', 'em_revisao', 'concluida', 'cancelada')),
    prioridade text DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta', 'urgente')),
    prazo date,
    tags text[],
    ordem integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    concluida_em timestamptz
);

-- Tabela de Entregas dos Membros
CREATE TABLE IF NOT EXISTS public.entregas (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    tarefa_id uuid REFERENCES public.tarefas_ecossistema(id) ON DELETE CASCADE,
    membro_id uuid REFERENCES public.profiles(id),
    descricao text,
    arquivo_url text,
    observacoes text,
    avaliacao text CHECK (avaliacao IN ('pendente', 'aprovada', 'revisao_necessaria', 'rejeitada')),
    avaliado_por uuid REFERENCES public.profiles(id),
    avaliado_em timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Tabela de Mensagens do Chat por Equipe
CREATE TABLE IF NOT EXISTS public.chat_mensagens (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    equipe_id uuid REFERENCES public.equipes(id) ON DELETE CASCADE,
    autor_id uuid REFERENCES public.profiles(id),
    autor_nome text NOT NULL,
    autor_avatar text,
    mensagem text NOT NULL,
    anexo_url text,
    anexo_nome text,
    respondendo_id uuid REFERENCES public.chat_mensagens(id),
    editada boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Tabela de Comunicados do Ecossistema
CREATE TABLE IF NOT EXISTS public.comunicados_ecossistema (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    titulo text NOT NULL,
    mensagem text NOT NULL,
    tipo text DEFAULT 'informacao' CHECK (tipo IN ('informacao', 'alerta', 'urgente', 'celebracao')),
    enviado_por uuid REFERENCES public.profiles(id),
    enviado_por_nome text,
    equipe_id uuid REFERENCES public.equipes(id),
    destinatarios uuid[],
    todos_membros boolean DEFAULT false,
    lido_por uuid[],
    created_at timestamptz DEFAULT now()
);

-- Tabela de Métricas de Desempenho
CREATE TABLE IF NOT EXISTS public.metricas_membros (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    membro_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    equipe_id uuid REFERENCES public.equipes(id),
    mes_referencia date NOT NULL,
    tarefas_concluidas integer DEFAULT 0,
    tarefas_atrasadas integer DEFAULT 0,
    qualidade_media numeric(3,2),
    participacao_chat integer DEFAULT 0,
    pontuacao_total numeric(5,2),
    observacoes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(membro_id, equipe_id, mes_referencia)
);

-- Inserir as 4 equipes padrão
INSERT INTO public.equipes (nome, descricao, ordem, icone) VALUES
('Acadêmica', 'Responsável pela produção e curadoria de conhecimento', 1, 'BookOpen'),
('Marketing', 'Responsável pela transformação do conhecimento em conteúdo acessível', 2, 'Megaphone'),
('Administrativa', 'Responsável pela organização e operacionalização do ecossistema', 3, 'Briefcase'),
('Tech', 'Responsável pela inovação e suporte tecnológico', 4, 'Cpu')
ON CONFLICT (nome) DO NOTHING;

-- Inserir funções para cada equipe
DO $$
DECLARE
    equipe_academica_id uuid;
    equipe_marketing_id uuid;
    equipe_administrativa_id uuid;
    equipe_tech_id uuid;
BEGIN
    SELECT id INTO equipe_academica_id FROM public.equipes WHERE nome = 'Acadêmica';
    SELECT id INTO equipe_marketing_id FROM public.equipes WHERE nome = 'Marketing';
    SELECT id INTO equipe_administrativa_id FROM public.equipes WHERE nome = 'Administrativa';
    SELECT id INTO equipe_tech_id FROM public.equipes WHERE nome = 'Tech';

    -- Funções Acadêmica
    INSERT INTO public.funcoes_equipe (equipe_id, nome, ordem) VALUES
    (equipe_academica_id, 'Pesquisador', 1),
    (equipe_academica_id, 'Redator', 2),
    (equipe_academica_id, 'Revisor', 3);

    -- Funções Marketing
    INSERT INTO public.funcoes_equipe (equipe_id, nome, ordem) VALUES
    (equipe_marketing_id, 'Copywriter', 1),
    (equipe_marketing_id, 'Designer', 2),
    (equipe_marketing_id, 'Social Media', 3);

    -- Funções Administrativa
    INSERT INTO public.funcoes_equipe (equipe_id, nome, ordem) VALUES
    (equipe_administrativa_id, 'Gestor de Projetos', 1),
    (equipe_administrativa_id, 'Organizador de Conteúdo', 2);

    -- Funções Tech
    INSERT INTO public.funcoes_equipe (equipe_id, nome, ordem) VALUES
    (equipe_tech_id, 'Desenvolvedor', 1),
    (equipe_tech_id, 'Especialista em Automação', 2),
    (equipe_tech_id, 'UX/Produto', 3);
END $$;

-- Habilitar RLS
ALTER TABLE public.equipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funcoes_equipe ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membros_equipe ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tarefas_ecossistema ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entregas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_mensagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comunicados_ecossistema ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metricas_membros ENABLE ROW LEVEL SECURITY;

-- Policies para equipes (todos podem ver, apenas admins podem modificar)
CREATE POLICY "Equipes visíveis para todos autenticados"
    ON public.equipes FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Apenas admins podem modificar equipes"
    ON public.equipes FOR ALL
    TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true))
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

-- Policies para funções_equipe
CREATE POLICY "Funções visíveis para todos autenticados"
    ON public.funcoes_equipe FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Apenas admins podem modificar funções"
    ON public.funcoes_equipe FOR ALL
    TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true))
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

-- Policies para membros_equipe
CREATE POLICY "Membros podem ver equipes onde estão alocados"
    ON public.membros_equipe FOR SELECT
    TO authenticated
    USING (
        user_id = auth.uid() OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
    );

CREATE POLICY "Apenas admins podem gerenciar membros em equipes"
    ON public.membros_equipe FOR ALL
    TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true))
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

-- Policies para tarefas_ecossistema
CREATE POLICY "Membros veem tarefas de sua equipe ou atribuídas a eles"
    ON public.tarefas_ecossistema FOR SELECT
    TO authenticated
    USING (
        atribuido_para = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.membros_equipe me
            WHERE me.user_id = auth.uid() AND me.equipe_id = tarefas_ecossistema.equipe_id
        ) OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
    );

CREATE POLICY "Admins podem criar e gerenciar tarefas"
    ON public.tarefas_ecossistema FOR ALL
    TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true))
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "Membros podem atualizar suas próprias tarefas"
    ON public.tarefas_ecossistema FOR UPDATE
    TO authenticated
    USING (atribuido_para = auth.uid())
    WITH CHECK (atribuido_para = auth.uid());

-- Policies para entregas
CREATE POLICY "Membros veem entregas de suas tarefas"
    ON public.entregas FOR SELECT
    TO authenticated
    USING (
        membro_id = auth.uid() OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
    );

CREATE POLICY "Membros podem criar entregas para suas tarefas"
    ON public.entregas FOR INSERT
    TO authenticated
    WITH CHECK (membro_id = auth.uid());

CREATE POLICY "Apenas admins podem avaliar entregas"
    ON public.entregas FOR UPDATE
    TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true))
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

-- Policies para chat_mensagens
CREATE POLICY "Membros veem mensagens de sua equipe"
    ON public.chat_mensagens FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.membros_equipe me
            WHERE me.user_id = auth.uid() AND me.equipe_id = chat_mensagens.equipe_id
        ) OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
    );

CREATE POLICY "Membros podem enviar mensagens em sua equipe"
    ON public.chat_mensagens FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.membros_equipe me
            WHERE me.user_id = auth.uid() AND me.equipe_id = chat_mensagens.equipe_id
        ) OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
    );

CREATE POLICY "Membros podem editar suas próprias mensagens"
    ON public.chat_mensagens FOR UPDATE
    TO authenticated
    USING (autor_id = auth.uid())
    WITH CHECK (autor_id = auth.uid());

-- Policies para comunicados_ecossistema
CREATE POLICY "Membros veem comunicados destinados a eles"
    ON public.comunicados_ecossistema FOR SELECT
    TO authenticated
    USING (
        todos_membros = true OR
        auth.uid() = ANY(destinatarios) OR
        EXISTS (
            SELECT 1 FROM public.membros_equipe me
            WHERE me.user_id = auth.uid() AND me.equipe_id = comunicados_ecossistema.equipe_id
        ) OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
    );

CREATE POLICY "Apenas admins podem criar comunicados"
    ON public.comunicados_ecossistema FOR INSERT
    TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "Membros podem marcar comunicados como lidos"
    ON public.comunicados_ecossistema FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policies para metricas_membros
CREATE POLICY "Membros veem suas próprias métricas"
    ON public.metricas_membros FOR SELECT
    TO authenticated
    USING (
        membro_id = auth.uid() OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
    );

CREATE POLICY "Apenas admins podem gerenciar métricas"
    ON public.metricas_membros FOR ALL
    TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true))
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_membros_equipe_user ON public.membros_equipe(user_id);
CREATE INDEX IF NOT EXISTS idx_membros_equipe_equipe ON public.membros_equipe(equipe_id);
CREATE INDEX IF NOT EXISTS idx_tarefas_eco_atribuido ON public.tarefas_ecossistema(atribuido_para);
CREATE INDEX IF NOT EXISTS idx_tarefas_eco_equipe ON public.tarefas_ecossistema(equipe_id);
CREATE INDEX IF NOT EXISTS idx_chat_equipe ON public.chat_mensagens(equipe_id);
CREATE INDEX IF NOT EXISTS idx_chat_created ON public.chat_mensagens(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comunicados_destinatarios ON public.comunicados_ecossistema USING gin(destinatarios);
