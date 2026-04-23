import { useState } from 'react'
import { useEventos } from '@/hooks/useEventos'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import type { Database } from '@/types/database'

type Evento = Database['public']['Tables']['eventos']['Row']
type EventoInsert = Database['public']['Tables']['eventos']['Insert']

export function AdminEventos() {
  const { eventos, loading, error, refetch } = useEventos({ status: 'todos' })
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [editingEvento, setEditingEvento] = useState<Evento | null>(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState<Partial<EventoInsert>>({
    titulo: '',
    descricao: '',
    tipo: 'seminario',
    data_evento: '',
    horario: '',
    local: '',
    status: 'agendado',
    possui_materiais: false,
    url_inscricao: '',
    url_materiais: '',
    capacidade: null,
    organizador: '',
    ativo: true,
  })

  const handleEdit = (evento: Evento) => {
    setEditingEvento(evento)
    setFormData(evento)
    setOpen(true)
  }

  const handleNew = () => {
    setEditingEvento(null)
    setFormData({
      titulo: '',
      descricao: '',
      tipo: 'seminario',
      data_evento: '',
      horario: '',
      local: '',
      status: 'agendado',
      possui_materiais: false,
      url_inscricao: '',
      url_materiais: '',
      capacidade: null,
      organizador: '',
      ativo: true,
    })
    setOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editingEvento) {
        const { error } = await supabase
          .from('eventos')
          .update(formData)
          .eq('id', editingEvento.id)
        
        if (error) throw error
        
        toast({
          title: 'Evento atualizado',
          description: 'As alterações foram salvas com sucesso.',
        })
      } else {
        const { error } = await supabase
          .from('eventos')
          .insert([formData as EventoInsert])
        
        if (error) throw error
        
        toast({
          title: 'Evento criado',
          description: 'O novo evento foi adicionado com sucesso.',
        })
      }
      
      setOpen(false)
      refetch()
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as alterações.',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este evento?')) return
    
    try {
      const { error } = await supabase
        .from('eventos')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      toast({
        title: 'Evento deletado',
        description: 'O evento foi removido com sucesso.',
      })
      
      refetch()
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível deletar o evento.',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="py-6">
          <p className="text-red-600">Erro ao carregar eventos: {error.message}</p>
        </CardContent>
      </Card>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'agendado':
        return <Badge className="bg-blue-100 text-blue-800">Agendado</Badge>
      case 'em_andamento':
        return <Badge className="bg-green-100 text-green-800">Em Andamento</Badge>
      case 'realizado':
        return <Badge className="bg-gray-100 text-gray-800">Realizado</Badge>
      case 'cancelado':
        return <Badge className="bg-red-100 text-red-800">Cancelado</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <Card className="border-gold/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-navy">Gerenciar Eventos</CardTitle>
            <CardDescription>Adicione, edite ou remova eventos do LIDA</CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleNew} className="bg-navy hover:bg-navy-dark text-cream">
                <Plus className="w-4 h-4 mr-2" />
                Novo Evento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-navy">
                  {editingEvento ? 'Editar Evento' : 'Novo Evento'}
                </DialogTitle>
                <DialogDescription>
                  Preencha as informações do evento
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título *</Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    placeholder="Nome do evento"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição *</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Descrição do evento"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo *</Label>
                    <Select
                      value={formData.tipo}
                      onValueChange={(value) => setFormData({ ...formData, tipo: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="seminario">Seminário</SelectItem>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="conferencia">Conferência</SelectItem>
                        <SelectItem value="curso">Curso</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="agendado">Agendado</SelectItem>
                        <SelectItem value="em_andamento">Em Andamento</SelectItem>
                        <SelectItem value="realizado">Realizado</SelectItem>
                        <SelectItem value="cancelado">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="data_evento">Data *</Label>
                    <Input
                      id="data_evento"
                      type="date"
                      value={formData.data_evento}
                      onChange={(e) => setFormData({ ...formData, data_evento: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="horario">Horário</Label>
                    <Input
                      id="horario"
                      type="time"
                      value={formData.horario}
                      onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="local">Local</Label>
                  <Input
                    id="local"
                    value={formData.local}
                    onChange={(e) => setFormData({ ...formData, local: e.target.value })}
                    placeholder="Endereço ou plataforma online"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organizador">Organizador</Label>
                  <Input
                    id="organizador"
                    value={formData.organizador}
                    onChange={(e) => setFormData({ ...formData, organizador: e.target.value })}
                    placeholder="Nome do organizador"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacidade">Capacidade (opcional)</Label>
                  <Input
                    id="capacidade"
                    type="number"
                    value={formData.capacidade || ''}
                    onChange={(e) => setFormData({ ...formData, capacidade: e.target.value ? parseInt(e.target.value) : null })}
                    placeholder="Número de vagas"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url_inscricao">URL de Inscrição</Label>
                  <Input
                    id="url_inscricao"
                    value={formData.url_inscricao}
                    onChange={(e) => setFormData({ ...formData, url_inscricao: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url_materiais">URL dos Materiais</Label>
                  <Input
                    id="url_materiais"
                    value={formData.url_materiais}
                    onChange={(e) => setFormData({ ...formData, url_materiais: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="possui_materiais"
                      checked={formData.possui_materiais}
                      onCheckedChange={(checked) => setFormData({ ...formData, possui_materiais: checked })}
                    />
                    <Label htmlFor="possui_materiais">Possui Materiais</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="ativo"
                      checked={formData.ativo}
                      onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                    />
                    <Label htmlFor="ativo">Ativo</Label>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={saving} className="bg-navy hover:bg-navy-dark text-cream">
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Local</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {eventos && eventos.length > 0 ? (
              eventos.map((evento) => (
                <TableRow key={evento.id}>
                  <TableCell className="font-medium">{evento.titulo}</TableCell>
                  <TableCell className="capitalize">{evento.tipo}</TableCell>
                  <TableCell>
                    {new Date(evento.data_evento).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{evento.local || '-'}</TableCell>
                  <TableCell>{getStatusBadge(evento.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(evento)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(evento.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-navy-light">
                  Nenhum evento cadastrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
