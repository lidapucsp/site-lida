import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Video, Users, MessageSquare, LogOut, UserCircle, Shield, Home, Mail } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ReunioesSection from '@/components/membros/ReunioesSection'
import ForumSection from '@/components/membros/ForumSection'
import MembrosSection from '@/components/membros/MembrosSection'
import PerfilSection from '@/components/membros/PerfilSection'
import ComunicadosSection from '@/components/membros/ComunicadosSection'

export default function AreaMembros() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('reunioes')

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-gold-light/10">
      {/* Header */}
      <header className="bg-navy text-cream border-b border-gold/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 border-2 border-gold">
                <AvatarImage src={profile?.avatar_url || ''} />
                <AvatarFallback className="bg-gold text-navy font-bold">
                  {profile?.username?.charAt(0).toUpperCase() || 'M'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-display font-bold">
                  Bem-vindo(a), {profile?.full_name || profile?.username}!
                </h1>
                <p className="text-gold-light text-sm">Área de Membros LIDA</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {profile?.is_admin ? (
                <Button
                  variant="hero"
                  size="sm"
                  onClick={() => navigate('/admin')}
                  className="shadow-lg shadow-gold/20"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Painel Admin
                </Button>
              ) : (
                <Button
                  variant="hero"
                  size="sm"
                  onClick={() => navigate('/')}
                  className="shadow-lg shadow-gold/20"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Ver Site
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-cream hover:bg-gold/20 hover:text-gold"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-4xl mx-auto grid-cols-5 bg-white border border-gold/20">
            <TabsTrigger
              value="reunioes"
              className="data-[state=active]:bg-navy data-[state=active]:text-cream"
            >
              <Video className="w-4 h-4 mr-2" />
              Reuniões
            </TabsTrigger>
            <TabsTrigger
              value="forum"
              className="data-[state=active]:bg-navy data-[state=active]:text-cream"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Fórum
            </TabsTrigger>
            <TabsTrigger
              value="comunicados"
              className="data-[state=active]:bg-navy data-[state=active]:text-cream"
            >
              <Mail className="w-4 h-4 mr-2" />
              Comunicados
            </TabsTrigger>
            <TabsTrigger
              value="membros"
              className="data-[state=active]:bg-navy data-[state=active]:text-cream"
            >
              <Users className="w-4 h-4 mr-2" />
              Membros
            </TabsTrigger>
            <TabsTrigger
              value="perfil"
              className="data-[state=active]:bg-navy data-[state=active]:text-cream"
            >
              <UserCircle className="w-4 h-4 mr-2" />
              Meu Perfil
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reunioes">
            <ReunioesSection />
          </TabsContent>

          <TabsContent value="forum">
            <ForumSection />
          </TabsContent>

          <TabsContent value="comunicados">
            <ComunicadosSection />
          </TabsContent>

          <TabsContent value="membros">
            <MembrosSection />
          </TabsContent>

          <TabsContent value="perfil">
            <PerfilSection />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
