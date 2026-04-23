import { useState } from 'react'
import { useReunioes } from '@/hooks/useReunioes'
import { useEixos } from '@/hooks/useEixos'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Loader2, Play, Calendar, Clock, User, FileText, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function ReunioesSection() {
  const [filtroEixo, setFiltroEixo] = useState<string>('todos')
  const [reuniaoAberta, setReuniaoAberta] = useState<any>(null)
  
  const { reunioes, loading } = useReunioes({
    eixoId: filtroEixo === 'todos' ? undefined : filtroEixo
  })
  const { eixos } = useEixos()

  const getVideoEmbedUrl = (url: string) => {
    // Converter URLs do YouTube para formato embed
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0]
      return `https://www.youtube.com/embed/${videoId}`
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0]
      return `https://www.youtube.com/embed/${videoId}`
    }
    // Vimeo
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0]
      return `https://player.vimeo.com/video/${videoId}`
    }
    return url
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="border-gold/20">
        <CardHeader>
          <CardTitle className="text-navy font-display">Reuniões e Vídeos</CardTitle>
          <CardDescription>Acesse todo o conteúdo das reuniões realizadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-navy">Filtrar por eixo:</label>
            <Select value={filtroEixo} onValueChange={setFiltroEixo}>
              <SelectTrigger className="w-64 border-gold/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os eixos</SelectItem>
                {eixos.map((eixo) => (
                  <SelectItem key={eixo.id} value={eixo.id}>
                    {eixo.titulo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Reuniões */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reunioes.map((reuniao) => {
          const eixo = eixos.find((e) => e.id === reuniao.eixo_id)
          
          return (
            <Card
              key={reuniao.id}
              className="border-gold/20 hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => setReuniaoAberta(reuniao)}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-navy-light overflow-hidden">
                {reuniao.thumbnail_url ? (
                  <img
                    src={reuniao.thumbnail_url}
                    alt={reuniao.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy to-navy-light">
                    <Play className="w-16 h-16 text-gold opacity-60" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="w-12 h-12 text-white" />
                </div>
              </div>

              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg font-display text-navy line-clamp-2">
                    {reuniao.titulo}
                  </CardTitle>
                  {eixo && (
                    <Badge variant="outline" className="border-gold text-gold text-xs shrink-0">
                      {eixo.titulo}
                    </Badge>
                  )}
                </div>
                {reuniao.descricao && (
                  <CardDescription className="line-clamp-2">
                    {reuniao.descricao}
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent>
                <div className="space-y-2 text-sm text-navy-light">
                  {reuniao.data_reuniao && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(reuniao.data_reuniao), "d 'de' MMMM, yyyy", { locale: ptBR })}
                    </div>
                  )}
                  {reuniao.duracao && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {reuniao.duracao} minutos
                    </div>
                  )}
                  {reuniao.palestrante && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {reuniao.palestrante}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {reunioes.length === 0 && (
        <Card className="border-gold/20">
          <CardContent className="py-12 text-center">
            <Play className="w-12 h-12 text-gold mx-auto mb-4 opacity-60" />
            <p className="text-navy-light">
              {filtroEixo === 'todos'
                ? 'Nenhuma reunião disponível no momento'
                : 'Nenhuma reunião encontrada para este eixo'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Dialog com Player de Vídeo */}
      <Dialog open={!!reuniaoAberta} onOpenChange={() => setReuniaoAberta(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display text-navy pr-8">
              {reuniaoAberta?.titulo}
            </DialogTitle>
          </DialogHeader>

          {reuniaoAberta && (
            <div className="space-y-6">
              {/* Player de Vídeo */}
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  src={getVideoEmbedUrl(reuniaoAberta.video_url)}
                  title={reuniaoAberta.titulo}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Informações */}
              <div className="space-y-4">
                {reuniaoAberta.descricao && (
                  <div>
                    <h3 className="font-semibold text-navy mb-2">Descrição</h3>
                    <p className="text-navy-light">{reuniaoAberta.descricao}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  {reuniaoAberta.data_reuniao && (
                    <div>
                      <span className="font-semibold text-navy">Data:</span>
                      <p className="text-navy-light">
                        {format(new Date(reuniaoAberta.data_reuniao), "d 'de' MMMM, yyyy", { locale: ptBR })}
                      </p>
                    </div>
                  )}
                  {reuniaoAberta.duracao && (
                    <div>
                      <span className="font-semibold text-navy">Duração:</span>
                      <p className="text-navy-light">{reuniaoAberta.duracao} minutos</p>
                    </div>
                  )}
                  {reuniaoAberta.palestrante && (
                    <div>
                      <span className="font-semibold text-navy">Palestrante:</span>
                      <p className="text-navy-light">{reuniaoAberta.palestrante}</p>
                    </div>
                  )}
                </div>

                {reuniaoAberta.materiais_url && (
                  <div>
                    <Button
                      variant="outline"
                      className="border-gold text-navy hover:bg-gold hover:text-navy"
                      onClick={() => window.open(reuniaoAberta.materiais_url, '_blank')}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Baixar Materiais
                      <ExternalLink className="w-3 h-3 ml-2" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
