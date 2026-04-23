import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, loading, isAdmin } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cream">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-gold mx-auto mb-4" />
          <p className="text-navy-light">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    // Redireciona para login mantendo info se é admin
    const redirectUrl = requireAdmin ? '/login?admin=true' : '/login'
    return <Navigate to={redirectUrl} replace />
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/membros" replace />
  }

  return <>{children}</>
}
