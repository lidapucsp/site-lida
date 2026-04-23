import { useState } from 'react'
import { useCalendario } from '@/hooks/useCalendario'
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
import { Plus, Pencil, Trash2, Loader2, Calendar } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { Database } from '@/types/database'

type CalendarioEvento = Database['public']['Tables']['calendario']['Row']
type CalendarioInsert = Database['public']['Tables']['calendario']['Insert']

const tipoOptions: Array<'Reunião' | 'Estudo' | 'Prazo' | 'Evento' | 'Seletivo'> = [
  'Reunião',
  'Estudo',
  'Prazo',
  'Evento',
  'Seletivo',
]

const tipoColors: Record<string, string> = {
  Reunião: 'bg-navy/10 text-navy',
  Estudo: 'bg-purple-100 text-purple-800',
  Prazo: 'bg-red-100 text-red-800',
  Evento: 'bg-gold/15 text-gold-dark',
  Seletivo: 'bg-blue-100 text-blue-800',
}

export function AdminCalendario() {
  const { eventos, loading, error, refetch } = useCalendario({ includeInactive: true })
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [editingEvento, setEditingEvento] = useState<CalendarioEvento | null>(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState<Partial<CalendarioInsert>>({
    titulo: '',
    data: '',
    tipo: 'Reunião',
    descricao: '',
    ativo: true,
  })

  const handleEdit = (evento: CalendarioEvento) => {
    setEditingEvento(evento)
    setFormData(evento)
    setOpen(true)
  }

  const handleNew = () => {
    setEditingEvento(null)
    setFormData({
      titulo: '',
      data: '',
      tipo: 'Reunião',
      descricao: '',
      ativo: true,
    })
    setOpen(true)
  }

  const handleSave = async () => {
    if (!formData.titulo || !formData.data) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios.',
        variant: 'destructive',
      })
      return
    }

    setSaving(true)
    try {
      if (editingEvento) {
        const { error } = await supabase
          .from('calendario')
          .update(formData)
          .eq('id', editingEvento.id)

        if (error) throw error

        toast({
          title: 'Evento atualizado',
          description: 'O evento foi atualizado com sucesso.',
        })
      } else {
        const { error } = await supabase
          .from('calendario')
          .insert([formData as CalendarioInsert])

        if (error) throw error

        toast({
          title: 'Evento criado',
          description: 'O novo evento foi adicionado ao calendário.',
        })
      }

      setOpen(false)
      refetch()
    } catch (error) {
      console.error('[ADMIN CALENDARIO] Erro ao salvar:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o evento.',
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
        .from('calendario')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: 'Evento deletado',
        description: 'O evento foi removido do calendário.',
      })

      refetch()
    } catch (error) {
      console.error('[ADMIN CALENDARIO] Erro ao deletar:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível deletar o evento.',
        variant: 'destructive',
      })
    }
  }

  const toggleAtivo = async (evento: CalendarioEvento) => {
    try {
      const { error } = await supabase
        .from('calendario')
        .update({ ativo: !evento.ativo })
        .eq('id', evento.id)

      if (error) throw error

      toast({
        title: evento.ativo ? 'Evento desativado' : 'Evento ativado',
        description: evento.ativo
          ? 'O evento não será mais exibido no calendário público.'
          : 'O evento agora está visível no calendário público.',
      })

      refetch()
    } catch (error) {
      console.error('[ADMIN CALENDARIO] Erro ao alterar status:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível alterar o status do evento.',
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

  return (
    <Card className="border-gold/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-navy">Gerenciar Calendário</CardTitle>
            <CardDescription>Adicione, edite ou remova eventos do calendário</CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleNew} className="bg-navy hover:bg-navy-dark text-cream">
                <Plus className="w-4 h-4 mr-2" />
                Novo Evento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
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
                    placeholder="Ex: Primeira Reunião"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="data">Data *</Label>
                    <Input
                      id="data"
                      type="date"
                      value={formData.data}
                      onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                    />
                  </div>

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
                        {tipoOptions.map((tipo) => (
                          <SelectItem key={tipo} value={tipo}>
                            {tipo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao || ''}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Informações adicionais sobre o evento"
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="ativo"
                    checked={formData.ativo}
                    onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                  />
                  <Label htmlFor="ativo">Ativo (visível no calendário público)</Label>
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
        {eventos.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>Nenhum evento cadastrado ainda.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eventos.map((evento) => (
                <TableRow key={evento.id}>
                  <TableCell className="font-medium">
                    {format(parseISO(evento.data), "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{evento.titulo}</p>
                      {evento.descricao && (
                        <p className="text-sm text-muted-foreground truncate max-w-md">
                          {evento.descricao}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={tipoColors[evento.tipo]}>
                      {evento.tipo}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={evento.ativo}
                      onCheckedChange={() => toggleAtivo(evento)}
                    />
                  </TableCell>
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
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

export default AdminCalendario
