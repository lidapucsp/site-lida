import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { 
  Laptop, 
  Brain, 
  FileText, 
  Gavel, 
  Briefcase, 
  Scale, 
  Building, 
  ShoppingCart, 
  Lightbulb, 
  Leaf, 
  Calculator, 
  Globe,
  Users,
  Loader2
} from 'lucide-react'

interface AreaComContagem {
  id: string
  nome: string
  descricao: string
  icone: string | null
  total_membros: number
}

interface MembroDetalhado {
  user_id: string
  username: string
  full_name: string | null
  email: string
  avatar_url: string | null
  created_at: string
}

const iconMap: Record<string, any> = {
  Laptop,
  Brain,
  FileText,
  Gavel,
  Briefcase,
  Scale,
  Building,
  ShoppingCart,
  Lightbulb,
  Leaf,
  Calculator,
  Globe,
}

export function AdminInteresses() {
  const [areas, setAreas] = useState<AreaComContagem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedArea, setSelectedArea] = useState<AreaComContagem | null>(null)
  const [membros, setMembros] = useState<MembroDetalhado[]>([])
  const [loadingMembros, setLoadingMembros] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchAreasComContagem()
  }, [])

  const fetchAreasComContagem = async () => {
    try {
      setLoading(true)
      
      // Buscar todas as áreas
      const { data: areasData, error: areasError } = await supabase
        .from('areas_interesse')
        .select('*')
        .order('nome')

      if (areasError) throw areasError

      // Para cada área, contar quantos membros têm interesse
      const areasComContagem = await Promise.all(
        (areasData || []).map(async (area) => {
          const { count, error: countError } = await supabase
            .from('membros_interesses')
            .select('*', { count: 'exact', head: true })
            .eq('area_id', area.id)

          if (countError) {
            console.error('Erro ao contar membros:', countError)
            return { ...area, total_membros: 0 }
          }

          return { ...area, total_membros: count || 0 }
        })
      )

      setAreas(areasComContagem)
    } catch (err) {
      console.error('Erro ao buscar áreas:', err)
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as áreas de interesse',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchMembrosInteressados = async (areaId: string) => {
    try {
      setLoadingMembros(true)

      const { data, error } = await supabase
        .from('membros_interesses')
        .select(`
          user_id,
          created_at,
          profile:profiles!membros_interesses_user_id_fkey (
            username,
            full_name,
            email,
            avatar_url
          )
        `)
        .eq('area_id', areaId)
        .order('created_at', { ascending: false })

      if (error) throw error

      const membrosFormatados = (data || []).map((item: any) => ({
        user_id: item.user_id,
        username: item.profile?.username || 'N/A',
        full_name: item.profile?.full_name,
        email: item.profile?.email || 'N/A',
        avatar_url: item.profile?.avatar_url,
        created_at: item.created_at,
      }))

      setMembros(membrosFormatados)
    } catch (err) {
      console.error('Erro ao buscar membros:', err)
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os membros interessados',
        variant: 'destructive',
      })
    } finally {
      setLoadingMembros(false)
    }
  }

  const handleVerMembros = async (area: AreaComContagem) => {
    setSelectedArea(area)
    setDialogOpen(true)
    await fetchMembrosInteressados(area.id)
  }

  const getInitials = (name: string | null, username: string) => {
    if (name) {
      const parts = name.split(' ')
      return parts.length > 1
        ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
        : name.substring(0, 2).toUpperCase()
    }
    return username.substring(0, 2).toUpperCase()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    )
  }

  const totalInteresses = areas.reduce((sum, area) => sum + area.total_membros, 0)

  return (
    <div className="space-y-6">
      {/* Estatísticas Resumidas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-navy-light">
              Total de Áreas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-navy">{areas.length}</div>
          </CardContent>
        </Card>

        <Card className="border-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-navy-light">
              Total de Interesses Registrados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-navy">{totalInteresses}</div>
          </CardContent>
        </Card>

        <Card className="border-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-navy-light">
              Média por Área
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-navy">
              {areas.length > 0 ? (totalInteresses / areas.length).toFixed(1) : '0'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Áreas */}
      <Card className="border-gold/20">
        <CardHeader>
          <CardTitle className="text-navy">Áreas de Interesse</CardTitle>
          <CardDescription>
            Visualize quantos membros estão interessados em cada área do Direito
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {areas.map((area) => {
              const Icon = iconMap[area.icone || 'Scale'] || Scale

              return (
                <Card
                  key={area.id}
                  className="border-gold/20 hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gold/20">
                          <Icon className="w-5 h-5 text-gold" />
                        </div>
                        <div>
                          <CardTitle className="text-base text-navy">
                            {area.nome}
                          </CardTitle>
                        </div>
                      </div>
                      <Badge 
                        variant={area.total_membros > 0 ? 'default' : 'secondary'}
                        className={area.total_membros > 0 ? 'bg-gold text-navy' : ''}
                      >
                        {area.total_membros}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-navy-light line-clamp-2">
                      {area.descricao}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVerMembros(area)}
                      disabled={area.total_membros === 0}
                      className="w-full"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Ver Membros Interessados
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Membros Interessados */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-navy">
              Membros Interessados - {selectedArea?.nome}
            </DialogTitle>
            <DialogDescription>
              {selectedArea?.total_membros} {selectedArea?.total_membros === 1 ? 'membro interessado' : 'membros interessados'} nesta área
            </DialogDescription>
          </DialogHeader>

          {loadingMembros ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-gold animate-spin" />
            </div>
          ) : membros.length === 0 ? (
            <div className="text-center py-8 text-navy-light">
              Nenhum membro interessado nesta área ainda.
            </div>
          ) : (
            <div className="space-y-3">
              {membros.map((membro) => (
                <Card key={membro.user_id} className="border-gold/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12 border-2 border-gold/30">
                        <AvatarImage src={membro.avatar_url || undefined} />
                        <AvatarFallback className="bg-navy text-cream">
                          {getInitials(membro.full_name, membro.username)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-navy">
                          {membro.full_name || membro.username}
                        </p>
                        <p className="text-sm text-navy-light">@{membro.username}</p>
                        <p className="text-sm text-navy-light truncate">
                          {membro.email}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {new Date(membro.created_at).toLocaleDateString('pt-BR')}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
