# Migrações Supabase - Site LIDA

## Como executar as migrações

### Opção 1: Executar tudo de uma vez
1. Acesse o Supabase Dashboard: https://app.supabase.com/project/uyzajikvwtejsnljzbuq
2. No menu lateral, clique em **SQL Editor**
3. Clique em **New Query**
4. Copie e cole o conteúdo do arquivo `000_all_tables.sql`
5. Clique em **Run** para executar

### Opção 2: Executar individualmente
Execute os arquivos na ordem numérica (001, 002, 003, 004...)

## Ordem de execução

1. ✅ `001_create_eixos.sql` - Tabela de eixos de pesquisa
2. ✅ `002_create_publicacoes.sql` - Tabela de publicações
3. ✅ `003_create_eventos.sql` - Tabela de eventos
4. ✅ `004_create_membros.sql` - Tabela de membros da equipe
5. `000_all_tables.sql` - Todas as tabelas em um único arquivo

## Estrutura das tabelas

### ✅ eixos
- 6 eixos de pesquisa do LIDA
- Campos: titulo, icone, definicao, temas[], entregas[], ordem
- **6 registros inseridos**

### ✅ publicacoes  
- Artigos, notas técnicas, relatórios e guias
- Campos: titulo, autores, data_publicacao, ano, eixo_nome, tipo, resumo, citacao
- Relacionamento com `eixos`
- **10 registros inseridos**

### ✅ eventos
- Eventos futuros e passados (seminários, workshops, palestras)
- Campos: titulo, descricao, tipo, data_evento, horario, local, status, possui_materiais
- **6 registros inseridos** (3 futuros + 3 passados)

### ✅ membros
- Coordenador e diretoria do LIDA
- Campos: nome, cargo, tipo, bio, foto_url, linkedin_url, is_founder
- **4 registros inseridos** (1 coordenador + 3 diretores)

---

**Nota:** Sempre faça backup antes de executar migrações em produção.
