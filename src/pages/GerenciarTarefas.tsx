import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useTarefas } from '@/hooks/useTarefas'
import { useMembros } from '@/hooks/useMembros'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
import { formatDateBR } from '@/lib/utils'
import { 
  ArrowLeft, 
  Plus, 
  Calendar, 
  User,
  Trash2,
  Pencil,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react'
import type { Tarefa } from '@/hooks/useTarefas'

export default function GerenciarTarefas() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const { tarefas, loading, criarTarefa, atualizarTarefa, deletarTarefa, moverTarefa } = useTarefas()
  const { membros } = useMembros({ tipo: 'todos' })
  const { toast } = useToast()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTarefa, setEditingTarefa] = useState<Tarefa | null>(null)
  const [saving, setSaving] = useState(false)
  const [draggedTask, setDraggedTask] = useState<Tarefa | null>(null)

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    prioridade: 'media' as 'baixa' | 'media' | 'alta',
    atribuido_para: '',
    prazo: '',
  })

  // Organizar tarefas por status
  const tarefasPorStatus = {
    a_fazer: tarefas.filter(t => t.status === 'a_fazer'),
    em_progresso: tarefas.filter(t => t.status === 'em_progresso'),
    concluido: tarefas.filter(t => t.status === 'concluido'),
  }

  const handleNovaTarefa = () => {
    setEditingTarefa(null)
    setFormData({
      titulo: '',
      descricao: '',
      prioridade: 'media',
      atribuido_para: '',
      prazo: '',
    })
    setDialogOpen(true)
  }

  const handleEditTarefa = (tarefa: Tarefa) => {
    setEditingTarefa(tarefa)
    setFormData({
      titulo: tarefa.titulo,
      descricao: tarefa.descricao || '',
      prioridade: tarefa.prioridade,
      atribuido_para: tarefa.atribuido_para,
      prazo: tarefa.prazo || '',
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.titulo || !formData.atribuido_para) {
      toast({
        title: 'Erro',
        description: 'Preencha título e atribua a um membro',
        variant: 'destructive',
      })
      return
    }

    try {
      setSaving(true)

      if (editingTarefa) {
        await atualizarTarefa(editingTarefa.id, formData)
        toast({
          title: 'Sucesso',
          description: 'Tarefa atualizada com sucesso',
        })
      } else {
        await criarTarefa(formData)
        toast({
          title: 'Sucesso',
          description: 'Tarefa criada com sucesso',
        })
      }

      setDialogOpen(false)
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar a tarefa',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return

    try {
      await deletarTarefa(id)
      toast({
        title: 'Sucesso',
        description: 'Tarefa excluída com sucesso',
      })
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir a tarefa',
        variant: 'destructive',
      })
    }
  }

  // Drag and Drop handlers
  const handleDragStart = (tarefa: Tarefa) => {
    setDraggedTask(tarefa)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (status: 'a_fazer' | 'em_progresso' | 'concluido') => {
    if (!draggedTask) return

    try {
      await moverTarefa(draggedTask.id, status)
      toast({
        title: 'Sucesso',
        description: 'Tarefa movida com sucesso',
      })
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível mover a tarefa',
        variant: 'destructive',
      })
    } finally {
      setDraggedTask(null)
    }
  }

  const getPrioridadeBadge = (prioridade: string) => {
    const variants = {
      baixa: 'bg-blue-100 text-blue-800',
      media: 'bg-yellow-100 text-yellow-800',
      alta: 'bg-red-100 text-red-800',
    }
    return variants[prioridade as keyof typeof variants] || variants.media
  }

  const getInitials = (nome: string) => {
    const parts = nome.split(' ')
    return parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : nome.substring(0, 2).toUpperCase()
  }

  const StatusColumn = ({ 
    status, 
    titulo, 
    icon: Icon, 
    tarefas 
  }: { 
    status: 'a_fazer' | 'em_progresso' | 'concluido'
    titulo: string
    icon: any
    tarefas: Tarefa[]
  }) => (
    <Card 
      className="border-gold/20 flex-1 min-w-[320px]"
      onDragOver={handleDragOver}
      onDrop={() => handleDrop(status)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-navy flex items-center gap-2">
            <Icon className="w-5 h-5 text-gold" />
            {titulo}
          </CardTitle>
          <Badge variant="secondary">{tarefas.length}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
        {tarefas.length === 0 ? (
          <p className="text-center text-navy-light text-sm py-8">
            Nenhuma tarefa neste status
          </p>
        ) : (
          tarefas.map((tarefa) => (
            <Card
              key={tarefa.id}
              draggable
              onDragStart={() => handleDragStart(tarefa)}
              className="border-gold/10 hover:shadow-md transition-shadow cursor-move"
            >
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-navy text-sm flex-1">
                    {tarefa.titulo}
                  </h4>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditTarefa(tarefa)}
                      className="h-7 w-7 p-0"
                    >
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(tarefa.id)}
                      className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {tarefa.descricao && (
                  <p className="text-sm text-navy-light line-clamp-2">
                    {tarefa.descricao}
                  </p>
                )}

                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={getPrioridadeBadge(tarefa.prioridade)}>
                    {tarefa.prioridade}
                  </Badge>
                  {tarefa.prazo && (
                    <Badge variant="outline" className="text-xs">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDateBR(tarefa.prazo)}
                    </Badge>
                  )}
                </div>

                {tarefa.membro && (
                  <div className="flex items-center gap-2 pt-2 border-t border-gold/10">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={tarefa.membro.foto_url} />
                      <AvatarFallback className="bg-navy text-cream text-xs">
                        {getInitials(tarefa.membro.nome)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-navy-light truncate">
                        {tarefa.membro.nome}
                      </p>
                      <p className="text-xs text-navy-light/70 truncate">
                        {tarefa.membro.cargo}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-navy border-b border-gold/20 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/admin')}
                className="text-cream hover:bg-gold/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-2xl font-display font-bold text-cream">
                  Gerenciar Tarefas
                </h1>
                <p className="text-sm text-gold-light">
                  Organize as tarefas da diretoria
                </p>
              </div>
            </div>
            <Button
              variant="hero"
              size="sm"
              onClick={handleNovaTarefa}
              className="shadow-lg shadow-gold/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Tarefa
            </Button>
          </div>
        </div>
      </header>

      {/* Kanban Board */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6 overflow-x-auto pb-4">
          <StatusColumn
            status="a_fazer"
            titulo="A Fazer"
            icon={AlertCircle}
            tarefas={tarefasPorStatus.a_fazer}
          />
          <StatusColumn
            status="em_progresso"
            titulo="Em Progresso"
            icon={Clock}
            tarefas={tarefasPorStatus.em_progresso}
          />
          <StatusColumn
            status="concluido"
            titulo="Concluído"
            icon={CheckCircle2}
            tarefas={tarefasPorStatus.concluido}
          />
        </div>
      </div>

      {/* Dialog de Nova/Editar Tarefa */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-navy">
              {editingTarefa ? 'Editar Tarefa' : 'Nova Tarefa'}
            </DialogTitle>
            <DialogDescription>
              {editingTarefa ? 'Atualize' : 'Crie'} uma tarefa e atribua a um membro da diretoria
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder="Ex: Revisar relatório mensal"
              />
            </div>

            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Detalhes sobre a tarefa..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="prioridade">Prioridade</Label>
                <Select
                  value={formData.prioridade}
                  onValueChange={(value: 'baixa' | 'media' | 'alta') =>
                    setFormData({ ...formData, prioridade: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="prazo">Prazo</Label>
                <Input
                  id="prazo"
                  type="date"
                  value={formData.prazo}
                  onChange={(e) => setFormData({ ...formData, prazo: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="atribuido_para">Atribuir para *</Label>
              <Select
                value={formData.atribuido_para}
                onValueChange={(value) =>
                  setFormData({ ...formData, atribuido_para: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um membro" />
                </SelectTrigger>
                <SelectContent>
                  {membros.map((membro) => (
                    <SelectItem key={membro.id} value={membro.id}>
                      {membro.nome} - {membro.cargo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editingTarefa ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
