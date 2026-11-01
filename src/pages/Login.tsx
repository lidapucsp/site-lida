import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Lock, Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isAdminLogin = searchParams.get('admin') === 'true'
  const { user, profile, isAdmin, signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Redirecionar quando o usuário estiver autenticado e o perfil carregado
  useEffect(() => {
    if (user && profile) {
      // Se está tentando acessar admin e é admin, vai para /admin
      if (isAdminLogin && isAdmin) {
        navigate('/admin')
      } else {
        navigate('/membros')
      }
    }
  }, [user, profile, isAdmin, navigate, isAdminLogin])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error: signInError } = await signIn(email, password)

    if (signInError) {
      setError('Email ou senha incorretos. Tente novamente.')
      setLoading(false)
    }
    // A navegação é feita pelo useEffect quando login for bem-sucedido
    // Se for admin login mas usuário não é admin, useEffect vai redirecionar para /membros
  }

  return (
    <div className="relative min-h-screen bg-navy-deep overflow-hidden flex items-center justify-center p-4">
      {/* Fundo: degradê, grade de pontos e logo neon */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_10%,hsl(var(--navy-light)/0.55),transparent_55%),radial-gradient(ellipse_at_90%_90%,hsl(var(--sky)/0.15),transparent_50%)]" />
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(var(--gold) / 0.6) 1px, transparent 0)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.12]" aria-hidden="true">
        <img src="/LIDA-logo-branco.PNG" alt="" className="w-[min(900px,120vw)] object-contain neon-logo" />
      </div>

      <Card className="relative w-full max-w-md border-gold/30 shadow-2xl shadow-black/40 rounded-3xl animate-fade-in-up">
        <CardHeader className="space-y-3 text-center">
          <span className="eyebrow mx-auto">{isAdminLogin ? 'Acesso restrito' : 'Comunidade LIDA'}</span>
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-navy to-navy-light rounded-2xl flex items-center justify-center shadow-lg shadow-navy/30">
            <Lock className="w-8 h-8 text-gold" />
          </div>
          <CardTitle className="text-3xl font-display text-navy">
            {isAdminLogin ? 'Área Administrativa' : 'Área de Membros LIDA'}
          </CardTitle>
          <CardDescription className="text-navy-light">
            {isAdminLogin 
              ? 'Acesse o painel de gerenciamento do LIDA'
              : 'Acesse sua conta e conecte-se com a comunidade'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-navy font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="border-gold/30 focus:border-gold focus:ring-gold"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-navy font-medium">
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="border-gold/30 focus:border-gold focus:ring-gold pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-navy-light" />
                  ) : (
                    <Eye className="h-4 w-4 text-navy-light" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              variant="hero" size="lg" className="w-full btn-sweep"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-navy-light hover:text-navy"
            >
              Voltar ao site
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
