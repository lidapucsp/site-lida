import { useState } from 'react'
import { useMateriais } from '@/hooks/useMateriais'
import { useEixos } from '@/hooks/useEixos'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Loader2, Play, Calendar, Clock, User, FileText, ExternalLink, Video } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function MateriaisSection() {
  const [filtroEixo, setFiltroEixo] = useState<string>('todos')
  const [materialAberto, setMaterialAberto] = useState<any>(null)
  
  const { materiais, loading } = useMateriais({
    eixoId: filtroEixo === 'todos' ? undefined : filtroEixo
  })
  const { eixos } = useEixos()

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
          <CardTitle className="text-navy font-display">Acervo de Materiais</CardTitle>
          <CardDescription>Acesse todo o conteúdo dos Materiais</CardDescription>
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
        {materiais.map((material) => {
          const eixo = eixos.find((e) => e.id === material.eixo_id)
          
          return (
            <Card
              key={material.id}
              className="border-gold/20 hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => setMaterialAberto(material)}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-navy-light overflow-hidden">
                {material.thumbnail_url ? (
                  <img
                    src={material.thumbnail_url}
                    alt={material.titulo}
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
                    {material.titulo}
                  </CardTitle>
                  {eixo && (
                    <Badge variant="outline" className="border-gold text-gold text-xs shrink-0">
                      {eixo.titulo}
                    </Badge>
                  )}
                </div>
                {material.descricao && (
                  <CardDescription className="line-clamp-2">
                    {material.descricao}
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent>
                <div className="space-y-2 text-sm text-navy-light">
                  {material.criador_material && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {material.criador_material}
                    </div>
                  )}
                  {material.data_material && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(material.data_material), "d 'de' MMMM, yyyy", { locale: ptBR })}
                    </div>
                  )}
                  {material.duracao && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {material.duracao} minutos
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {materiais.length === 0 && (
        <Card className="border-gold/20">
          <CardContent className="py-12 text-center">
            {/* <Play className="w-12 h-12 text-gold mx-auto mb-4 opacity-60" /> */}
            <p className="text-navy-light">
              {filtroEixo === 'todos'
                ? 'Nenhum material disponível no momento'
                : 'Nenhum material encontrado para este eixo'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Dialog com Player de Vídeo */}
      <Dialog open={!!materialAberto} onOpenChange={() => setMaterialAberto(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display text-navy pr-8">
              {materialAberto?.titulo}
            </DialogTitle>
          </DialogHeader>

          {materialAberto && (
            <div className="space-y-6">
              {/* Área do Vídeo */}
              {materialAberto.materiais_url ? (
                <button
                  type="button"
                  className="relative w-full aspect-video rounded-xl overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  onClick={() => window.open(materialAberto.materiais_url, '_blank', 'noopener,noreferrer')}
                  aria-label={`Assistir: ${materialAberto.titulo}`}
                >
                  {materialAberto.thumbnail_url ? (
                    <img
                      src={materialAberto.thumbnail_url}
                      alt={materialAberto.titulo}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-navy via-navy-light to-navy">
                      <Video className="w-14 h-14 text-gold opacity-70" />
                      <span className="text-white/70 text-sm font-medium">Nenhuma miniatura disponível</span>
                    </div>
                  )}
                  {/* Overlay de hover */}
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="w-16 h-16 rounded-full bg-gold flex items-center justify-center shadow-lg">
                      <Play className="w-7 h-7 text-navy fill-navy ml-1" />
                    </div>
                    <span className="text-white font-semibold text-sm tracking-wide">Clique para abrr o material</span>
                    <span className="text-white/60 text-xs flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" /> Abre em nova aba
                    </span>
                  </div>
                </button>
              ) : (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-navy via-navy-light to-navy flex flex-col items-center justify-center gap-3">
                  <Video className="w-14 h-14 text-gold opacity-50" />
                  <p className="text-white/60 font-medium text-sm">Imagem não disponível para este material</p>
                </div>
              )}

              {/* Informações */}
              <div className="space-y-4">
                {materialAberto.descricao && (
                  <div>
                    <h3 className="font-semibold text-navy mb-2">Descrição</h3>
                    <p className="text-navy-light">{materialAberto.descricao}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  {materialAberto.data_material && (
                    <div>
                      <span className="font-semibold text-navy">Data:</span>
                      <p className="text-navy-light">
                        {format(new Date(materialAberto.data_material), "d 'de' MMMM, yyyy", { locale: ptBR })}
                      </p>
                    </div>
                  )}
                  {materialAberto.duracao && (
                    <div>
                      <span className="font-semibold text-navy">Duração:</span>
                      <p className="text-navy-light">{materialAberto.duracao} minutos</p>
                    </div>
                  )}
                  {materialAberto.criador_material && (
                    <div>
                      <span className="font-semibold text-navy">Criador:</span>
                      <p className="text-navy-light">{materialAberto.criador_material}</p>
                    </div>
                  )}
                </div>

                {materialAberto.materiais_url && (
                  <div>
                    <Button
                      variant="outline"
                      className="border-gold text-navy hover:bg-gold hover:text-navy"
                      onClick={() => window.open(materialAberto.materiais_url, '_blank')}
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
