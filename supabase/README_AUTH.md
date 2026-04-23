# Sistema de Usuários e Autenticação - LIDA

## Estrutura

O sistema de autenticação usa o **Supabase Auth** nativo com uma tabela de perfis estendida.

### Tabelas

1. **`auth.users`** (nativa do Supabase)
   - Gerencia credenciais (email, senha)
   - Criada e gerenciada pelo Supabase automaticamente

2. **`public.profiles`** (customizada)
   - Estende `auth.users` com informações adicionais
   - Campos principais:
     - `id`: UUID (referência para auth.users)
     - `username`: Nome de usuário único para login
     - `full_name`: Nome completo
     - `is_admin`: Se o usuário tem privilégios administrativos
     - `membro_id`: UUID (referência opcional para tabela membros)
     - `avatar_url`: URL da foto de perfil

## Permissões (RLS - Row Level Security)

### Usuários Públicos (não autenticados)
- ✅ Podem ler eixos, publicações, eventos e membros ativos
- ❌ Não podem criar, editar ou deletar nada

### Usuários Autenticados (membros)
- ✅ Podem ver todos os perfis
- ✅ Podem editar seu próprio perfil (exceto `is_admin`)
- ❌ Não podem editar conteúdo público

### Administradores
- ✅ Podem fazer tudo que usuários normais fazem
- ✅ Podem criar, editar e deletar: eixos, publicações, eventos, membros
- ✅ Podem editar qualquer perfil
- ✅ Podem promover usuários a admin

## Como Usar

### 1. Executar Migração SQL

Execute o arquivo `supabase/migrations/002_create_users_and_auth.sql` no SQL Editor do Supabase.

### 2. Criar Primeiro Usuário Admin

**Via Supabase Dashboard:**

1. Vá em **Authentication** → **Users** → **Add user**
2. Preencha:
   - Email: `admin@lida.com`
   - Password: (sua senha segura)
   - Auto Confirm User: ✅ Ativado
3. Clique em **Create user**

4. Após criar, execute este SQL no SQL Editor:

```sql
UPDATE public.profiles 
SET is_admin = true, 
    username = 'admin',
    full_name = 'Administrador LIDA'
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@lida.com');
```

### 3. Criar Usuários Membros

**Opção A - Via Dashboard (recomendado para primeiros usuários):**

1. **Authentication** → **Users** → **Add user**
2. Preencha email e senha
3. Execute SQL para associar ao membro:

```sql
UPDATE public.profiles 
SET username = 'giovanna',
    full_name = 'Giovanna P. Andrade',
    membro_id = (SELECT id FROM public.membros WHERE nome LIKE '%Giovanna%')
WHERE id = (SELECT id FROM auth.users WHERE email = 'giovanna@lida.com');
```

**Opção B - Via API (para formulário de cadastro):**

```typescript
// No frontend, usando @supabase/auth-helpers-react
import { supabase } from '@/lib/supabase'

const { data, error } = await supabase.auth.signUp({
  email: 'usuario@example.com',
  password: 'senha_segura',
  options: {
    data: {
      username: 'username123',
      full_name: 'Nome Completo'
    }
  }
})
```

### 4. Criar Hook de Autenticação (Frontend)

Crie `src/hooks/useAuth.ts`:

```typescript
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Buscar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          fetchProfile(session.user.id)
        } else {
          setProfile(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (!error && data) {
      setProfile(data)
    }
    setLoading(false)
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const isAdmin = profile?.is_admin ?? false

  return {
    user,
    profile,
    loading,
    isAdmin,
    signIn,
    signOut,
  }
}
```

### 5. Proteger Rotas (Frontend)

Crie `src/components/ProtectedRoute.tsx`:

```typescript
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, profile, loading, isAdmin } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/area-membros" replace />
  }

  return <>{children}</>
}
```

### 6. Exemplos de Uso

**Página de Login:**
```typescript
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'

export function LoginPage() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await signIn(email, password)
    if (error) {
      console.error('Erro no login:', error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button type="submit">Entrar</button>
    </form>
  )
}
```

**Rotas no App.tsx:**
```typescript
import { ProtectedRoute } from '@/components/ProtectedRoute'

<Route 
  path="/area-membros" 
  element={
    <ProtectedRoute>
      <AreaMembros />
    </ProtectedRoute>
  } 
/>

<Route 
  path="/admin" 
  element={
    <ProtectedRoute requireAdmin>
      <AdminPanel />
    </ProtectedRoute>
  } 
/>
```

## Próximos Passos

1. ✅ Executar SQL de criação da tabela profiles
2. ✅ Criar primeiro usuário admin
3. ⬜ Criar hook `useAuth`
4. ⬜ Criar componente `ProtectedRoute`
5. ⬜ Criar página de Login
6. ⬜ Criar página Área de Membros
7. ⬜ Criar painel Admin para edição de conteúdo
8. ⬜ Criar formulário de cadastro de novos membros

## Segurança

- ✅ Senhas são criptografadas pelo Supabase Auth (bcrypt)
- ✅ Row Level Security (RLS) ativo em todas as tabelas
- ✅ Função `is_admin()` usa `SECURITY DEFINER` para verificação segura
- ✅ Políticas RLS impedem usuários comuns de editarem conteúdo
- ✅ Username tem validação de formato (apenas letras minúsculas, números e _)
