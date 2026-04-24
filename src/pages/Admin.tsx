import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useEixos } from '@/hooks/useEixos'
import { usePublicacoes } from '@/hooks/usePublicacoes'
import { useEventos } from '@/hooks/useEventos'
import { useProfiles } from '@/hooks/useProfiles'
import { useTarefas } from '@/hooks/useTarefas'
import { supabase } from '@/lib/supabase'
import { formatDateBR } from '@/lib/utils'
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
  ClipboardList,
  Heart,
  Database,
  Shield,
  List,
  CheckSquare,
  ArrowRight
} from 'lucide-react'
import { AdminEixos } from '@/components/admin/AdminEixos'
import { AdminPublicacoes } from '@/components/admin/AdminPublicacoes'
import { AdminEventos } from '@/components/admin/AdminEventos'
import { AdminMembrosGeral } from '@/components/admin/AdminMembrosGeral'
import AdminReunioes from '@/components/admin/AdminReunioes'
import AdminCalendario from '@/components/admin/AdminCalendario'
import AdminComunicados from '@/components/admin/AdminComunicados'
import { AdminProcessoSeletivo } from '@/components/admin/AdminProcessoSeletivo'
import { AdminInteresses } from '@/components/admin/AdminInteresses'

export default function Admin() {
  const navigate = useNavigate()
  const { profile, signOut } = useAuth()
  const { eixos } = useEixos()
  const { publicacoes } = usePublicacoes({ status: 'todos' })
  const { eventos } = useEventos({ status: 'todos' })
  const { profiles } = useProfiles()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [comunicadosCount, setComunicadosCount] = useState(0)
  const [reunioesCount, setReunioesCount] = useState(0)
  const [membrosCount, setMembrosCount] = useState(0)
  const [membroLogadoId, setMembroLogadoId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Buscar membro_id do profile assim que disponível
  useEffect(() => {
    if (profile?.membro_id) {
      setMembroLogadoId(profile.membro_id)
    }
  }, [profile?.membro_id])

  // Buscar tarefas do membro logado (se ele estiver na tabela membros)
  const { tarefas: minhasTarefas, loading: loadingTarefas } = useTarefas({ 
    membroId: membroLogadoId || undefined 
  })

  // Buscar counts de comunicados, reuniões e membros da diretoria
  useEffect(() => {
    fetchCounts()
  }, [])

  const fetchCounts = async () => {
    try {
      const [comunicadosRes, reunioesRes, membrosRes] = await Promise.all([
        supabase.from('comunicados').select('*', { count: 'exact', head: true }),
        supabase.from('reunioes').select('*', { count: 'exact', head: true }),
        supabase.from('membros').select('*', { count: 'exact', head: true })
      ])

      setComunicadosCount(comunicadosRes.count || 0)
      setReunioesCount(reunioesRes.count || 0)
      setMembrosCount(membrosRes.count || 0)
    } catch (error) {
      console.error('Erro ao buscar counts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  // Membros da Diretoria (busca da tabela membros)
  const membrosDiretoria = membrosCount
  
  // Estimativa de uso do Supabase (baseado em registros)
  // Plano gratuito: 500MB de banco de dados, ~50k linhas
  const totalRegistros = 
    (eixos?.length || 0) + 
    (publicacoes?.length || 0) + 
    (eventos?.length || 0) + 
    (profiles?.length || 0) + 
    comunicadosCount + 
    reunioesCount + 
    membrosCount
  const estimativaUsoSupabase = Math.min((totalRegistros / 50000) * 100, 100).toFixed(1)

  const stats = [
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
      title: 'Comunicados',
      value: comunicadosCount,
      icon: Mail,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Reuniões',
      value: reunioesCount,
      icon: Video,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
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
          <TabsList className="grid w-full grid-cols-10 bg-white border border-gold/20 p-1 h-auto">
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
              value="interesses"
              className="data-[state=active]:bg-navy data-[state=active]:text-cream flex items-center gap-2 py-3"
            >
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Interesses</span>
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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
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

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-gold/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-navy flex items-center gap-2">
                      <CheckSquare className="w-5 h-5 text-gold" />
                      Minhas Tarefas
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/admin/tarefas')}
                      className="text-gold hover:text-gold-600"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardDescription>
                    Tarefas atribuídas a você
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {!membroLogadoId ? (
                    <div className="text-center py-6 text-navy-light text-sm">
                      Você não está vinculado a um membro da diretoria
                    </div>
                  ) : minhasTarefas.filter(t => t.status !== 'concluido').length === 0 ? (
                    <div className="text-center py-6 text-navy-light text-sm">
                      Nenhuma tarefa pendente
                    </div>
                  ) : (
                    minhasTarefas
                      .filter(t => t.status !== 'concluido')
                      .slice(0, 4)
                      .map((tarefa) => (
                        <div
                          key={tarefa.id}
                          className="p-3 bg-cream rounded-lg border border-gold/10 hover:border-gold/30 transition-colors cursor-pointer"
                          onClick={() => navigate('/admin/tarefas')}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium text-navy line-clamp-1 flex-1">
                              {tarefa.titulo}
                            </p>
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              tarefa.status === 'em_progresso' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {tarefa.status === 'em_progresso' ? 'Em Progresso' : 'A Fazer'}
                            </span>
                          </div>
                          {tarefa.prazo && (
                            <p className="text-xs text-navy-light mt-1">
                              Prazo: {formatDateBR(tarefa.prazo)}
                            </p>
                          )}
                        </div>
                      ))
                  )}
                  <Button
                    variant="outline"
                    className="w-full mt-2"
                    onClick={() => navigate('/admin/tarefas')}
                  >
                    Gerenciar Tarefas
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-gold/20">
                <CardHeader>
                  <CardTitle className="text-navy flex items-center gap-2">
                    <List className="w-5 h-5 text-gold" />
                    Conteúdos por Página
                  </CardTitle>
                  <CardDescription>
                    Quantidade de registros em cada seção
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-cream rounded-lg">
                    <span className="text-sm text-navy-light">Eixos</span>
                    <span className="font-semibold text-navy">{eixos?.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-cream rounded-lg">
                    <span className="text-sm text-navy-light">Publicações</span>
                    <span className="font-semibold text-navy">{publicacoes?.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-cream rounded-lg">
                    <span className="text-sm text-navy-light">Eventos</span>
                    <span className="font-semibold text-navy">{eventos?.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-cream rounded-lg">
                    <span className="text-sm text-navy-light">Comunicados</span>
                    <span className="font-semibold text-navy">{comunicadosCount}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-cream rounded-lg">
                    <span className="text-sm text-navy-light">Reuniões</span>
                    <span className="font-semibold text-navy">{reunioesCount}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-cream rounded-lg">
                    <span className="text-sm text-navy-light">Diretoria</span>
                    <span className="font-semibold text-navy">{membrosCount}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-cream rounded-lg">
                    <span className="text-sm text-navy-light">Participantes</span>
                    <span className="font-semibold text-navy">{profiles?.length || 0}</span>
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

          <TabsContent value="interesses">
            <AdminInteresses />
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
