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
    <div className="min-h-screen bg-gradient-to-br from-cream via-gold-light/20 to-navy/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-gold/20 shadow-xl">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-16 h-16 bg-navy rounded-2xl flex items-center justify-center">
            <Lock className="w-8 h-8 text-cream" />
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
              className="w-full bg-navy hover:bg-navy-dark text-cream font-semibold h-11"
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
