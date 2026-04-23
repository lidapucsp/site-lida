import { useState, useEffect } from 'react'
import { useReunioes } from '@/hooks/useReunioes'
import { useEixos } from '@/hooks/useEixos'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Loader2, Video } from 'lucide-react'
import { format } from 'date-fns'

export default function AdminReunioes() {
  const { reunioes, loading, refetch } = useReunioes({ includeInactive: true })
  const { eixos } = useEixos()
  const [dialogAberto, setDialogAberto] = useState(false)
  const [reuniaoEditando, setReuniaoEditando] = useState<any>(null)

  const handleNovo = () => {
    setReuniaoEditando(null)
    setDialogAberto(true)
  }

  const handleEditar = (reuniao: any) => {
    setReuniaoEditando(reuniao)
    setDialogAberto(true)
  }

  const handleDeletar = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta reunião?')) return

    try {
      const { error } = await supabase.from('reunioes').delete().eq('id', id)
      if (error) throw error
      refetch()
    } catch (error) {
      console.error('[ADMIN] Erro ao deletar reunião:', error)
      alert('Erro ao deletar reunião')
    }
  }

  const toggleAtivo = async (id: string, ativo: boolean) => {
    try {
      const { error } = await supabase
        .from('reunioes')
        .update({ ativo: !ativo })
        .eq('id', id)
      if (error) throw error
      refetch()
    } catch (error) {
      console.error('[ADMIN] Erro ao atualizar status:', error)
    }
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
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Gerenciar Reuniões</CardTitle>
            <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
              <DialogTrigger asChild>
                <Button onClick={handleNovo} className="bg-gold hover:bg-gold-dark text-navy">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Reunião
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <ReuniaoForm
                  reuniao={reuniaoEditando}
                  eixos={eixos}
                  onSuccess={() => {
                    setDialogAberto(false)
                    setReuniaoEditando(null)
                    refetch()
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Eixo</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reunioes.map((reuniao) => {
                const eixo = eixos.find((e) => e.id === reuniao.eixo_id)
                return (
                  <TableRow key={reuniao.id}>
                    <TableCell className="font-medium">{reuniao.titulo}</TableCell>
                    <TableCell>
                      {eixo && (
                        <Badge variant="outline" className="text-xs">
                          {eixo.titulo}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {format(new Date(reuniao.data_reuniao), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>{reuniao.duracao ? `${reuniao.duracao} min` : '-'}</TableCell>
                    <TableCell>
                      <Switch
                        checked={reuniao.ativo}
                        onCheckedChange={() => toggleAtivo(reuniao.id, reuniao.ativo)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditar(reuniao)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeletar(reuniao.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          {reunioes.length === 0 && (
            <div className="text-center py-12">
              <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma reunião cadastrada</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function ReuniaoForm({ reuniao, eixos, onSuccess }: any) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    titulo: reuniao?.titulo || '',
    descricao: reuniao?.descricao || '',
    video_url: reuniao?.video_url || '',
    thumbnail_url: reuniao?.thumbnail_url || '',
    duracao: reuniao?.duracao || '',
    data_reuniao: reuniao?.data_reuniao || new Date().toISOString().split('T')[0],
    eixo_id: reuniao?.eixo_id || '',
    palestrante: reuniao?.palestrante || '',
    materiais_url: reuniao?.materiais_url || '',
    ordem: reuniao?.ordem || 0,
    ativo: reuniao?.ativo ?? true
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = {
        ...formData,
        duracao: formData.duracao ? parseInt(formData.duracao) : null,
        eixo_id: formData.eixo_id || null
      }

      if (reuniao) {
        const { error } = await supabase
          .from('reunioes')
          .update(data as any)
          .eq('id', reuniao.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('reunioes').insert(data as any)
        if (error) throw error
      }

      onSuccess()
    } catch (error) {
      console.error('[ADMIN] Erro ao salvar reunião:', error)
      alert('Erro ao salvar reunião')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle>{reuniao ? 'Editar Reunião' : 'Nova Reunião'}</DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <div>
          <Label htmlFor="titulo">Título*</Label>
          <Input
            id="titulo"
            value={formData.titulo}
            onChange={(e) => handleChange('titulo', e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="descricao">Descrição</Label>
          <Textarea
            id="descricao"
            value={formData.descricao}
            onChange={(e) => handleChange('descricao', e.target.value)}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="video_url">URL do Vídeo*</Label>
            <Input
              id="video_url"
              type="url"
              value={formData.video_url}
              onChange={(e) => handleChange('video_url', e.target.value)}
              placeholder="https://youtube.com/..."
              required
            />
          </div>
          <div>
            <Label htmlFor="thumbnail_url">URL da Thumbnail</Label>
            <Input
              id="thumbnail_url"
              type="url"
              value={formData.thumbnail_url}
              onChange={(e) => handleChange('thumbnail_url', e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="data_reuniao">Data da Reunião*</Label>
            <Input
              id="data_reuniao"
              type="date"
              value={formData.data_reuniao}
              onChange={(e) => handleChange('data_reuniao', e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="duracao">Duração (min)</Label>
            <Input
              id="duracao"
              type="number"
              value={formData.duracao}
              onChange={(e) => handleChange('duracao', e.target.value)}
              placeholder="60"
            />
          </div>
          <div>
            <Label htmlFor="ordem">Ordem</Label>
            <Input
              id="ordem"
              type="number"
              value={formData.ordem}
              onChange={(e) => handleChange('ordem', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="eixo_id">Eixo</Label>
            <Select value={formData.eixo_id} onValueChange={(v) => handleChange('eixo_id', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um eixo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Nenhum</SelectItem>
                {eixos.map((eixo: any) => (
                  <SelectItem key={eixo.id} value={eixo.id}>
                    {eixo.titulo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="palestrante">Palestrante</Label>
            <Input
              id="palestrante"
              value={formData.palestrante}
              onChange={(e) => handleChange('palestrante', e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="materiais_url">URL dos Materiais</Label>
          <Input
            id="materiais_url"
            type="url"
            value={formData.materiais_url}
            onChange={(e) => handleChange('materiais_url', e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="ativo"
            checked={formData.ativo}
            onCheckedChange={(checked) => handleChange('ativo', checked)}
          />
          <Label htmlFor="ativo">Reunião ativa (visível para membros)</Label>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" disabled={loading} className="bg-gold hover:bg-gold-dark text-navy">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar'
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}
