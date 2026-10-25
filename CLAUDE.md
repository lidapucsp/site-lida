# CLAUDE.md — Site LIDA

Site do **LIDA** (Laboratório de Inteligência e Direito Aplicado, PUC-SP), grupo de estudos de estudantes de Direito.
Três áreas no mesmo app:

1. **Site institucional** (público): `/`, `/sobre`, `/eixos`, `/publicacoes`, `/eventos`, `/calendario`, `/processo-seletivo`, `/contato`, `/links`, `/conceitos`, páginas legais.
2. **Área de Membros** (`/membros`, exige login): materiais, reuniões, fórum, comunicados, interesses, membros, ecossistema, perfil.
3. **Painel Admin** (`/admin`, `/admin/tarefas`, `/admin/contatos`, `/admin/ecossistema`, exige `is_admin`).

O dev principal é o diretor de TI do grupo. Responda sempre em **português (pt-BR)**.

## Stack

- Vite + React 18 + TypeScript, `@vitejs/plugin-react-swc`
- Tailwind 3 + shadcn/ui (Radix) em `src/components/ui/` — componentes gerados, evite editar à mão
- React Router v6 (`src/App.tsx`), TanStack Query (provider existe, mas os hooks de dados usam `useState`/`useEffect`)
- Supabase (Auth + Postgres + Edge Functions em Deno), cliente em `src/lib/supabase.ts`
- Deploy: Vercel (`vercel.json` reescreve tudo para `/index.html`, SPA)
- Alias `@` → `src/`. Dev server na porta **8080**.

## Comandos

```bash
npm run dev        # servidor local (localhost:8080)
npm run build      # build de produção
npm run lint       # eslint
npm test           # vitest (hoje não há nenhum teste escrito)
```

Variáveis de ambiente (`.env.local`, ignorado pelo git; modelo em `.env.example`):
`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`. Nunca commitar chaves; só a anon key vai ao front.

## Estrutura

```
src/
  pages/                  uma página por rota (públicas, Login, Admin, AreaMembros, Gerenciar*)
  components/
    admin/                abas do painel Admin (AdminX.tsx) + admin/ecossistema/
    membros/              seções da Área de Membros (XSection.tsx)
    layout/               Navbar, Footer, Layout, CookieBanner
    ui/                   shadcn/ui
    ProtectedRoute.tsx    guarda de rota (requireAdmin opcional)
  hooks/                  um hook por tabela/domínio (useEixos, useMateriais, useTarefas...)
  lib/                    supabase.ts, utils.ts (cn, formatDateBR)
  types/database.ts       tipos do schema Supabase (escritos à mão)
supabase/
  functions/              manage-users, responder-contato, send-email (Deno)
  migrations/             SQL + database_schema.md (doc do schema)
```

## Convenções do código

- **Domínio em português**: tabelas, colunas, hooks, componentes (`eixos`, `materiais`, `reunioes`, `ativo`, `ordem`). Mantenha os nomes em português; textos de UI também em pt-BR.
- **Hooks de dados** seguem o padrão de `src/hooks/useMateriais.ts`: `useState` + `useEffect`, retornam `{ dados, loading, error, refetch }`, logs de erro com prefixo `[NOME]`. Tipos vêm de `Database['public']['Tables'][...]['Row']`.
- **Soft delete / visibilidade**: a maioria das tabelas tem `ativo` (bool) e `ordem` (int). Listagens públicas filtram `ativo = true`.
- **Auth**: `useAuth()` expõe `user`, `profile`, `isAdmin`, `signIn`, `signOut`. `profiles.is_admin` define admin. `profiles.membro_id` liga o usuário a um registro da tabela `membros` (diretoria).
- **Rotas protegidas**: envolver em `<ProtectedRoute>` (e `requireAdmin` para admin) em `App.tsx`. Isso é só UX; a segurança real tem que estar nas **RLS policies** do Supabase.
- **Criação/remoção de usuários** passa pela edge function `manage-users` (usa service role); nunca usar service role no front.
- **Emails** (comunicados, resposta de contato, boas-vindas) saem por edge functions via SMTP do Gmail (`GMAIL_EMAIL`/`GMAIL_PASSWORD` como secrets do Supabase).
- Datas: usar `formatDateBR` de `src/lib/utils.ts`; cuidado com timezone ao converter `date` do Postgres.

## Design system atual

- Paleta (variáveis HSL em `src/index.css`): **navy** (primária), **gold** (destaque), **cream** (fundo). Classes: `bg-navy`, `text-gold`, `bg-cream`, `border-gold/20`...
- Fontes: **Plus Jakarta Sans** (corpo) e **Space Grotesk** (títulos `h1–h4`, `font-display`).
- Utilitários customizados em `index.css`: `.section-padding`, `.card-hover`, `.glass`, `.text-gold-gradient`, animações `animate-fade-in-up` etc.
- Botão tem variante `hero` (dourado) usada nos headers.

## Banco de dados

Doc em `supabase/migrations/database_schema.md` (pode estar defasada — ver pendências). Tabelas principais: `profiles`, `membros`, `eixos`, `publicacoes`, `eventos`, `calendario`, `aulas` (reuniões), `materiais`, `comunicados`, `contatos`, `tarefas`, `forum_*`, `areas_interesse`/`membros_interesses`, `processos_seletivos` + `processo_seletivo_*`, e as do **Ecossistema** (migration `20260506000000_create_ecossistema_tables.sql`: equipes, tarefas, chat).
Se alterar o schema: criar migration em `supabase/migrations/` **e** atualizar `src/types/database.ts`.

## Git

- Branches: `main` (produção, Vercel), `develop` (trabalho diário), branches de feature a partir de `develop`.
- Commits em português, prefixo minúsculo: `add: ...`, `fix: ...`, `refactor: ...`, mensagem curta.
- Pode commitar em `develop` a cada etapa concluída. **Nunca** `git push`, merge em `main` ou criar PR sem o usuário pedir.

## Redesign em andamento

Objetivo: deixar o site mais bonito e moderno, usando um site de exemplo como referência (a ser passado pelo usuário).
- **Manter a identidade**: paleta navy/dourado/creme, logo e mascote (`public/`). Modernizar layout, tipografia, espaçamento, animações.
- **Escopo inicial: só o Site Institucional** (`src/pages/` públicas + `components/layout/`). Área de Membros e Admin só depois, quando a diretoria validar — não alterar sem pedido.
- Mudanças de design devem passar pelos tokens (`index.css` / `tailwind.config.ts`) sempre que possível, em vez de classes soltas por página.

## Como trabalhar aqui

- Antes de mexer, leia o componente/hook vizinho e siga o padrão dele.
- Arquivos muito grandes (`AdminProcessoSeletivo.tsx` ~1100 linhas, `EcossistemaSection.tsx` ~970, `AdminParticipantes.tsx` ~870): leia por trechos e prefira mudanças cirúrgicas.
- Valide com `npm run build` e `npm run lint` depois de mudanças; para UI, verifique no navegador (`npm run dev`).
- Não exibir ou repetir credenciais/senhas em respostas.

## Pendências / pontos de atenção conhecidos

- `database_schema.md` não lista `materiais` nem as tabelas do Ecossistema.
- `supabase/.temp/` está versionado (deveria ir para o `.gitignore`).
- `useMateriais.ts` tem um `console.log(data)` esquecido.
- A edge function `manage-users` envia a senha em texto no email de boas-vindas.
- `package.json` ainda se chama `vite_react_shadcn_ts` (template Lovable); sem testes.
- Contagem "Equipes: 4" e "Tarefas Ativas: -" no dashboard Admin são valores fixos.
