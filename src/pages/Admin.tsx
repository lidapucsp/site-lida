import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useEixos } from '@/hooks/useEixos'
import { usePublicacoes } from '@/hooks/usePublicacoes'
import { useEventos } from '@/hooks/useEventos'
import { useProfiles } from '@/hooks/useProfiles'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  LayoutDashboard, 
  LogOut, 
  Users, 
  FileText, 
  Calendar, 
  Target, 
  UserCog,
  TrendingUp,
  BookOpen,
  CalendarCheck,
  CalendarDays,
  Video,
  Home,
  Mail,
  ClipboardList
} from 'lucide-react'
import { AdminEixos } from '@/components/admin/AdminEixos'
import { AdminPublicacoes } from '@/components/admin/AdminPublicacoes'
import { AdminEventos } from '@/components/admin/AdminEventos'
import { AdminMembrosGeral } from '@/components/admin/AdminMembrosGeral'
import AdminReunioes from '@/components/admin/AdminReunioes'
import AdminCalendario from '@/components/admin/AdminCalendario'
import AdminComunicados from '@/components/admin/AdminComunicados'
import { AdminProcessoSeletivo } from '@/components/admin/AdminProcessoSeletivo'

export default function Admin() {
  const navigate = useNavigate()
  const { profile, signOut } = useAuth()
  const { eixos } = useEixos()
  const { publicacoes } = usePublicacoes({ status: 'todos' })
  const { eventos } = useEventos({ status: 'todos' })
  const { profiles } = useProfiles()
  const [activeTab, setActiveTab] = useState('dashboard')

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  const stats = [
    {
      title: 'Total de Eixos',
      value: eixos?.length || 0,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Publicações',
      value: publicacoes?.length || 0,
      icon: BookOpen,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Eventos',
      value: eventos?.length || 0,
      icon: CalendarCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Participantes',
      value: profiles?.length || 0,
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-navy border-b border-gold/20 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold text-cream">
                Painel Administrativo
              </h1>
              <p className="text-sm text-gold-light">
                Bem-vindo(a), {profile?.full_name || profile?.username}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="hero"
                size="sm"
                onClick={() => navigate('/')}
                className="shadow-lg shadow-gold/20"
              >
                <Home className="w-4 h-4 mr-2" />
                Ver Site
              </Button>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-cream hover:bg-gold/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-9 bg-white border border-gold/20 p-1 h-auto">
            <TabsTrigger 
              value="dashboard" 
              className="data-[state=active]:bg-navy data-[state=active]:text-cream flex items-center gap-2 py-3"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger 
              value="eixos"
              className="data-[state=active]:bg-navy data-[state=active]:text-cream flex items-center gap-2 py-3"
            >
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Eixos</span>
            </TabsTrigger>
            <TabsTrigger 
              value="publicacoes"
              className="data-[state=active]:bg-navy data-[state=active]:text-cream flex items-center gap-2 py-3"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Publicações</span>
            </TabsTrigger>
            <TabsTrigger 
              value="eventos"
              className="data-[state=active]:bg-navy data-[state=active]:text-cream flex items-center gap-2 py-3"
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Eventos</span>
            </TabsTrigger>
            <TabsTrigger 
              value="calendario"
              className="data-[state=active]:bg-navy data-[state=active]:text-cream flex items-center gap-2 py-3"
            >
              <CalendarDays className="w-4 h-4" />
              <span className="hidden sm:inline">Calendário</span>
            </TabsTrigger>
            <TabsTrigger 
              value="reunioes"
              className="data-[state=active]:bg-navy data-[state=active]:text-cream flex items-center gap-2 py-3"
            >
              <Video className="w-4 h-4" />
              <span className="hidden sm:inline">Reuniões</span>
            </TabsTrigger>
            <TabsTrigger 
              value="membros"
              className="data-[state=active]:bg-navy data-[state=active]:text-cream flex items-center gap-2 py-3"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Membros</span>
            </TabsTrigger>
            <TabsTrigger 
              value="comunicados"
              className="data-[state=active]:bg-navy data-[state=active]:text-cream flex items-center gap-2 py-3"
            >
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">Comunicados</span>
            </TabsTrigger>
            <TabsTrigger 
              value="processo-seletivo"
              className="data-[state=active]:bg-navy data-[state=active]:text-cream flex items-center gap-2 py-3"
            >
              <ClipboardList className="w-4 h-4" />
              <span className="hidden sm:inline">Seletivo</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon
                return (
                  <Card key={stat.title} className="border-gold/20">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-navy-light">
                        {stat.title}
                      </CardTitle>
                      <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                        <Icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-navy">
                        {stat.value}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-gold/20">
                <CardHeader>
                  <CardTitle className="text-navy flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-gold" />
                    Visão Geral
                  </CardTitle>
                  <CardDescription>
                    Estatísticas gerais do sistema
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-cream rounded-lg">
                    <span className="text-sm text-navy-light">Eixos Ativos</span>
                    <span className="font-semibold text-navy">
                      {eixos?.filter(e => e.ativo).length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-cream rounded-lg">
                    <span className="text-sm text-navy-light">Eventos Futuros</span>
                    <span className="font-semibold text-navy">
                      {eventos?.filter(e => e.status === 'agendado').length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-cream rounded-lg">
                    <span className="text-sm text-navy-light">Publicações Este Ano</span>
                    <span className="font-semibold text-navy">
                      {publicacoes?.filter(p => p.ano === new Date().getFullYear()).length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-cream rounded-lg">
                    <span className="text-sm text-navy-light">Participantes Registrados</span>
                    <span className="font-semibold text-navy">
                      {profiles?.length || 0}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gold/20">
                <CardHeader>
                  <CardTitle className="text-navy flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gold" />
                    Próximos Eventos
                  </CardTitle>
                  <CardDescription>
                    Eventos agendados para as próximas semanas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {eventos && eventos
                    .filter(e => e.status === 'agendado')
                    .slice(0, 3)
                    .map((evento) => (
                      <div
                        key={evento.id}
                        className="mb-3 p-3 bg-cream rounded-lg border border-gold/10"
                      >
                        <div className="font-medium text-navy text-sm">
                          {evento.titulo}
                        </div>
                        <div className="text-xs text-navy-light mt-1">
                          {new Date(evento.data_evento).toLocaleDateString('pt-BR')}
                          {evento.horario && ` às ${evento.horario}`}
                        </div>
                      </div>
                    ))}
                  {(!eventos || eventos.filter(e => e.status === 'agendado').length === 0) && (
                    <p className="text-sm text-navy-light text-center py-4">
                      Nenhum evento agendado
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Outras Tabs */}
          <TabsContent value="eixos">
            <AdminEixos />
          </TabsContent>

          <TabsContent value="publicacoes">
            <AdminPublicacoes />
          </TabsContent>

          <TabsContent value="eventos">
            <AdminEventos />
          </TabsContent>

          <TabsContent value="calendario">
            <AdminCalendario />
          </TabsContent>

          <TabsContent value="reunioes">
            <AdminReunioes />
          </TabsContent>

          <TabsContent value="membros">
            <AdminMembrosGeral />
          </TabsContent>

          <TabsContent value="comunicados">
            <AdminComunicados />
          </TabsContent>

          <TabsContent value="processo-seletivo">
            <AdminProcessoSeletivo />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
