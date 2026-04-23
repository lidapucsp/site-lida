# Painel Administrativo - LIDA

## 🎯 Visão Geral

O painel administrativo do LIDA é uma interface completa e intuitiva para gerenciar todo o conteúdo do site. Com design elegante nas cores do LIDA (navy, gold, cream), oferece controle total sobre:

- **Eixos de Pesquisa** - Adicionar, editar e organizar
- **Publicações** - Gerenciar artigos, notas técnicas, relatórios
- **Eventos** - Controlar seminários, workshops, conferências
- **Membros da Equipe** - Adicionar coordenadores, diretores e membros
- **Usuários e Permissões** - Controlar quem tem acesso admin

## 📊 Dashboard

O dashboard principal exibe:

### Estatísticas em Tempo Real
- Total de eixos ativos
- Número de publicações
- Eventos cadastrados
- Membros da equipe

### Visão Geral Rápida
- Eixos ativos vs inativos
- Eventos futuros agendados
- Publicações do ano atual
- Membros ativos

### Próximos Eventos
Lista dos 3 próximos eventos com data e horário

## 🔐 Como Acessar

### 1. Executar SQL de Autenticação

Se ainda não executou, rode o SQL:
```bash
supabase/migrations/002_create_users_and_auth.sql
```

### 2. Criar Primeiro Usuário Admin

No Supabase Dashboard:
1. Vá em **Authentication** → **Users** → **Add user**
2. Email: seu@email.com
3. Password: senha_segura
4. Auto Confirm User: ✅

Execute no SQL Editor:
```sql
UPDATE public.profiles 
SET is_admin = true, 
    username = 'admin',
    full_name = 'Seu Nome'
WHERE id = (SELECT id FROM auth.users WHERE email = 'seu@email.com');
```

### 3. Acessar Painel

Abra o navegador:
```
http://localhost:8080/login
```

Entre com:
- Email: seu@email.com
- Senha: senha_segura

## 📝 Funcionalidades por Seção

### 🎯 Gerenciar Eixos

**Campos:**
- Título (obrigatório)
- Ícone Lucide (ex: Target, FileText, Users)
- Definição (descrição completa)
- Temas (lista separada por linha)
- Entregas (lista separada por linha)
- Ordem de exibição
- Status ativo/inativo

**Ações:**
- ✏️ Editar - Modificar informações
- 🗑️ Deletar - Remover completamente
- ➕ Novo Eixo - Adicionar novo

### 📚 Gerenciar Publicações

**Campos:**
- Título (obrigatório)
- Autores (separados por vírgula)
- Data de publicação
- Ano (auto-preenchido da data)
- Eixo relacionado (dropdown)
- Tipo (Artigo, Nota Técnica, Relatório, Guia, Resumo)
- Resumo
- Citação
- URL do arquivo/PDF
- Status ativo/inativo

**Ações:**
- ✏️ Editar
- 🗑️ Deletar
- 🔗 Abrir PDF (se tiver URL)
- ➕ Nova Publicação

**Visualização:**
Tabela com colunas: Título, Autores, Ano, Tipo, Eixo, Status

### 📅 Gerenciar Eventos

**Campos:**
- Título (obrigatório)
- Descrição (obrigatório)
- Tipo (Seminário, Workshop, Conferência, Curso, Outro)
- Status (Agendado, Em Andamento, Realizado, Cancelado)
- Data (obrigatório)
- Horário
- Local (endereço ou plataforma online)
- Organizador
- Capacidade (vagas)
- URL de inscrição
- URL dos materiais
- Possui materiais (checkbox)
- Status ativo/inativo

**Ações:**
- ✏️ Editar
- 🗑️ Deletar
- ➕ Novo Evento

**Status com Badges:**
- 🔵 Agendado (azul)
- 🟢 Em Andamento (verde)
- ⚪ Realizado (cinza)
- 🔴 Cancelado (vermelho)

### 👥 Gerenciar Membros

**Campos:**
- Nome completo (obrigatório)
- Cargo (obrigatório)
- Tipo (Coordenador, Diretor, Membro)
- Biografia (obrigatório)
- URL da foto (obrigatório)
- URL do LinkedIn
- Fundador do LIDA (checkbox)
- Ordem de exibição
- Status ativo/inativo

**Ações:**
- ✏️ Editar
- 🗑️ Deletar
- 🔗 Ver LinkedIn (se tiver)
- ➕ Novo Membro

**Badges:**
- 🟣 Coordenador (roxo)
- 🔵 Diretor (azul)
- ⚪ Membro (cinza)
- 🏅 Fundador (dourado)

### 👤 Gerenciar Usuários

**Funcionalidade:**
- Listar todos os usuários cadastrados
- Promover/remover permissões de admin
- Ver username, nome completo, data de criação

**Permissões:**
- 🛡️ Admin - Pode editar todo conteúdo
- 👤 Membro - Acesso apenas de leitura

**Ações:**
- Toggle de admin (switch)
- Mudanças refletidas instantaneamente

## 🎨 Design e UX

### Cores e Temas
- **Navy** (#294564) - Headers, botões primários
- **Gold** (#C9A961) - Destaques, ícones
- **Cream** (#F5F2EB) - Background, texto secundário

### Componentes
- Tabelas responsivas com scroll
- Diálogos modais para edição
- Toasts para feedback
- Loading states com spinners
- Badges coloridas por status
- Botões de ação com ícones

### Responsividade
- Grid adaptativo no dashboard (4 cols → 2 cols → 1 col)
- Tabs colapsadas em mobile (ícones apenas)
- Diálogos scrolláveis
- Tabelas com scroll horizontal

## 🔒 Segurança

### Row Level Security (RLS)
- Admins podem inserir/atualizar/deletar em todas tabelas
- Verificação via função `public.is_admin(auth.uid())`
- Usuários comuns só leem dados públicos

### Proteção de Rotas
- `/admin` requer autenticação E admin=true
- Redirecionamento automático para `/login`
- Loading state durante verificação

### Boas Práticas
- Senhas nunca expostas no frontend
- Tokens gerenciados pelo Supabase Auth
- Anon key (não service role) no frontend
- Confirmação antes de deletar

## 🚀 Como Usar no Dia a Dia

### Adicionar Novo Evento
1. Vá na aba **Eventos**
2. Clique em **Novo Evento**
3. Preencha título, descrição, data
4. Selecione tipo e status
5. Adicione URLs se necessário
6. **Salvar**

### Publicar Novo Artigo
1. Aba **Publicações**
2. **Nova Publicação**
3. Preencha título, autores
4. Selecione eixo relacionado
5. Tipo: Artigo
6. Adicione resumo e citação
7. Cole URL do PDF
8. **Salvar**

### Adicionar Membro da Equipe
1. Aba **Membros**
2. **Novo Membro**
3. Nome, cargo, tipo
4. Biografia
5. URL da foto e LinkedIn
6. Marque "Fundador" se aplicável
7. **Salvar**

### Promover Usuário a Admin
1. Aba **Usuários**
2. Encontre o usuário
3. Toggle no switch "Admin"
4. Confirmação instantânea

### Desativar Conteúdo (sem deletar)
1. Edite o item
2. Toggle "Ativo" para OFF
3. **Salvar**
4. Conteúdo fica oculto no site mas preservado no banco

## 📱 Atalhos e Dicas

- **Ver Site** - Botão no header para abrir site público
- **Sair** - Logout no canto superior direito
- **Ordem** - Use campo "ordem" para controlar sequência de exibição
- **Ícones Lucide** - Use nomes exatos: Target, FileText, Users, Calendar, BookOpen
- **Refresh** - Após salvar, página recarrega automaticamente

## 🐛 Troubleshooting

### "Erro ao salvar"
- Verifique campos obrigatórios (*)
- Confira se URLs começam com https://
- Eixos: precisa ter pelo menos 3 caracteres no título

### "Não tenho permissão"
- Confirme que is_admin = true no profiles
- Faça logout e login novamente
- Execute SQL para promover a admin

### "Não consigo fazer login"
- Verifique email/senha
- Usuário foi confirmado no Supabase?
- SQL de criação de profiles foi executado?

### "Dashboard vazio"
- Execute migrations 000 e 001 primeiro
- Verifique se há dados na tabela
- Olhe console do navegador (F12) para erros

## 📚 Referências

- Componentes UI: [shadcn/ui](https://ui.shadcn.com)
- Ícones: [Lucide Icons](https://lucide.dev)
- Auth: [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- RLS: [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**Desenvolvido para LIDA - PUC-SP**  
Gerenciamento intuitivo e seguro de conteúdo acadêmico
