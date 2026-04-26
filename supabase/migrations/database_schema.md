## Table `areas_interesse`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `nome` | `varchar` |  Unique |
| `descricao` | `text` |  |
| `icone` | `varchar` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |
| `updated_at` | `timestamptz` |  Nullable |

## Table `aulas`

Aulas e vídeos disponíveis para membros

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `titulo` | `text` |  |
| `descricao` | `text` |  Nullable |
| `video_url` | `text` |  |
| `thumbnail_url` | `text` |  Nullable |
| `duracao` | `int4` |  Nullable |
| `data_aula` | `date` |  |
| `eixo_id` | `uuid` |  Nullable |
| `palestrante` | `text` |  Nullable |
| `materiais_url` | `text` |  Nullable |
| `ordem` | `int4` |  Nullable |
| `ativo` | `bool` |  |
| `created_at` | `timestamptz` |  |
| `updated_at` | `timestamptz` |  |

## Table `calendario`

Eventos do calendário LIDA

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `titulo` | `text` |  |
| `data` | `date` |  |
| `tipo` | `text` |  |
| `descricao` | `text` |  Nullable |
| `ativo` | `bool` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |
| `updated_at` | `timestamptz` |  Nullable |

## Table `comunicados`

Histórico de comunicados enviados por email

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `assunto` | `text` |  |
| `mensagem` | `text` |  |
| `enviado_por` | `uuid` |  Nullable |
| `destinatarios` | `_text` |  |
| `enviado_em` | `timestamptz` |  Nullable |
| `status` | `text` |  Nullable |

## Table `contatos`

Mensagens recebidas através do formulário de contato

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `nome` | `varchar` |  |
| `email` | `varchar` |  |
| `assunto` | `varchar` |  |
| `mensagem` | `text` |  |
| `status` | `varchar` |  Nullable |
| `lido` | `bool` |  Nullable |
| `resposta` | `text` |  Nullable |
| `respondido_por` | `uuid` |  Nullable |
| `respondido_em` | `timestamptz` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |
| `updated_at` | `timestamptz` |  Nullable |

## Table `eixos`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `titulo` | `text` |  |
| `icone` | `text` |  |
| `definicao` | `text` |  |
| `temas` | `_text` |  |
| `entregas` | `_text` |  |
| `ordem` | `int4` |  |
| `ativo` | `bool` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |
| `updated_at` | `timestamptz` |  Nullable |

## Table `eventos`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `titulo` | `text` |  |
| `descricao` | `text` |  |
| `tipo` | `text` |  |
| `data_evento` | `date` |  |
| `horario` | `text` |  Nullable |
| `local` | `text` |  Nullable |
| `status` | `text` |  |
| `possui_materiais` | `bool` |  Nullable |
| `url_inscricao` | `text` |  Nullable |
| `url_materiais` | `text` |  Nullable |
| `capacidade` | `int4` |  Nullable |
| `organizador` | `text` |  Nullable |
| `ativo` | `bool` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |
| `updated_at` | `timestamptz` |  Nullable |

## Table `forum_comentarios`

Comentários nos posts do fórum

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `post_id` | `uuid` |  |
| `conteudo` | `text` |  |
| `autor_id` | `uuid` |  |
| `autor_nome` | `text` |  |
| `autor_avatar` | `text` |  Nullable |
| `parent_id` | `uuid` |  Nullable |
| `total_curtidas` | `int4` |  |
| `ativo` | `bool` |  |
| `created_at` | `timestamptz` |  |
| `updated_at` | `timestamptz` |  |

## Table `forum_curtidas`

Sistema de curtidas para posts e comentários

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `post_id` | `uuid` |  Nullable |
| `comentario_id` | `uuid` |  Nullable |
| `usuario_id` | `uuid` |  |
| `created_at` | `timestamptz` |  |

## Table `forum_posts`

Posts do mini fórum de membros

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `titulo` | `text` |  |
| `conteudo` | `text` |  |
| `tipo` | `text` |  |
| `link_url` | `text` |  Nullable |
| `link_titulo` | `text` |  Nullable |
| `link_descricao` | `text` |  Nullable |
| `autor_id` | `uuid` |  |
| `autor_nome` | `text` |  |
| `autor_avatar` | `text` |  Nullable |
| `total_comentarios` | `int4` |  |
| `total_curtidas` | `int4` |  |
| `eixo_id` | `uuid` |  Nullable |
| `tags` | `_text` |  Nullable |
| `fixado` | `bool` |  |
| `ativo` | `bool` |  |
| `created_at` | `timestamptz` |  |
| `updated_at` | `timestamptz` |  |

## Table `membros`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `nome` | `text` |  |
| `cargo` | `text` |  |
| `tipo` | `text` |  |
| `bio` | `text` |  |
| `foto_url` | `text` |  |
| `linkedin_url` | `text` |  Nullable |
| `is_founder` | `bool` |  Nullable |
| `ordem` | `int4` |  |
| `ativo` | `bool` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |
| `updated_at` | `timestamptz` |  Nullable |

## Table `membros_interesses`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `user_id` | `uuid` |  |
| `area_id` | `uuid` |  |
| `created_at` | `timestamptz` |  Nullable |

## Table `processo_seletivo_aprovados`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `processo_id` | `uuid` |  Nullable |
| `nome` | `text` |  |
| `instituicao` | `text` |  Nullable |
| `ordem` | `int4` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |

## Table `processo_seletivo_compromissos`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `processo_id` | `uuid` |  Nullable |
| `descricao` | `text` |  |
| `ordem` | `int4` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |

## Table `processo_seletivo_cronograma`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `processo_id` | `uuid` |  Nullable |
| `etapa` | `text` |  |
| `data_inicio` | `timestamptz` |  Nullable |
| `data_fim` | `timestamptz` |  Nullable |
| `descricao` | `text` |  Nullable |
| `ordem` | `int4` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |

## Table `processo_seletivo_faqs`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `processo_id` | `uuid` |  Nullable |
| `pergunta` | `text` |  |
| `resposta` | `text` |  |
| `ordem` | `int4` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |

## Table `processo_seletivo_infos`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `processo_id` | `uuid` |  Nullable |
| `texto` | `text` |  |
| `ordem` | `int4` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |

## Table `processo_seletivo_requisitos`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `processo_id` | `uuid` |  Nullable |
| `titulo` | `text` |  |
| `descricao` | `text` |  Nullable |
| `ordem` | `int4` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |

## Table `processo_seletivo_resultados_anteriores`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `processo_id` | `uuid` |  Nullable |
| `titulo` | `text` |  |
| `url` | `text` |  Nullable |
| `ordem` | `int4` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |

## Table `processos_seletivos`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `titulo` | `text` |  |
| `periodo` | `text` |  |
| `descricao` | `text` |  Nullable |
| `edital_url` | `text` |  Nullable |
| `edital_descricao` | `text` |  Nullable |
| `inscricao_url` | `text` |  Nullable |
| `inscricao_inicio` | `timestamptz` |  Nullable |
| `inscricao_fim` | `timestamptz` |  Nullable |
| `vagas` | `int4` |  Nullable |
| `ativo` | `bool` |  Nullable |
| `exibir_site` | `bool` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |
| `updated_at` | `timestamptz` |  Nullable |

## Table `profiles`

Perfis de usuários estendendo auth.users

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `username` | `text` |  Unique |
| `full_name` | `text` |  Nullable |
| `is_admin` | `bool` |  |
| `membro_id` | `uuid` |  Nullable |
| `avatar_url` | `text` |  Nullable |
| `created_at` | `timestamptz` |  |
| `updated_at` | `timestamptz` |  |
| `bio` | `text` |  Nullable |
| `linkedin` | `text` |  Nullable |
| `instituicao` | `text` |  Nullable |
| `funcao` | `text` |  Nullable |
| `cargo` | `text` |  Nullable |

## Table `publicacoes`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `titulo` | `text` |  |
| `autores` | `text` |  |
| `data_publicacao` | `date` |  |
| `ano` | `int4` |  |
| `eixo_id` | `uuid` |  Nullable |
| `eixo_nome` | `text` |  Nullable |
| `tipo` | `text` |  |
| `resumo` | `text` |  |
| `citacao` | `text` |  |
| `arquivo_url` | `text` |  Nullable |
| `ativo` | `bool` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |
| `updated_at` | `timestamptz` |  Nullable |

## Table `tarefas`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `titulo` | `varchar` |  |
| `descricao` | `text` |  Nullable |
| `status` | `varchar` |  |
| `prioridade` | `varchar` |  |
| `atribuido_para` | `uuid` |  |
| `criado_por` | `uuid` |  |
| `prazo` | `date` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |
| `updated_at` | `timestamptz` |  Nullable |

