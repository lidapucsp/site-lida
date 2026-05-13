import { useState } from 'react';
import { useEquipes } from '@/hooks/useEquipes';
import { useProfiles } from '@/hooks/useProfiles';
import { useTarefasEcossistema } from '@/hooks/useTarefasEcossistema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import {
  Loader2,
  Plus,
  Calendar,
  User,
  Edit2,
  Trash2,
  CheckCircle2,
} from 'lucide-react';

const statusMap = {
  pendente: { label: 'Pendente', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
  em_andamento: { label: 'Em Andamento', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  em_revisao: { label: 'Em Revisão', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  concluida: { label: 'Concluída', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  cancelada: { label: 'Cancelada', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
};

const prioridadeMap = {
  baixa: { label: 'Baixa', color: 'text-gray-400' },
  media: { label: 'Média', color: 'text-blue-400' },
  alta: { label: 'Alta', color: 'text-orange-400' },
  urgente: { label: 'Urgente', color: 'text-red-400' },
};

export default function AdminTarefasEcossistema() {
  const { equipes } = useEquipes();
  const { profiles } = useProfiles();
  const { tarefas, loading, criarTarefa, atualizarTarefa, deletarTarefa } = useTarefasEcossistema();
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editando, setEditando] = useState<any>(null);

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    equipe_id: '',
    atribuido_para: '',
    prioridade: 'media' as 'baixa' | 'media' | 'alta' | 'urgente',
    prazo: '',
  });

  const handleSubmit = async () => {
    if (!formData.titulo) {
      toast({
        title: 'Preencha o título',
        variant: 'destructive',
      });
      return;
    }

    const dadosTarefa = {
      ...formData,
      atribuido_para: formData.atribuido_para === 'equipe_toda' ? null : formData.atribuido_para || null
    };

    const result = editando
      ? await atualizarTarefa(editando.id, dadosTarefa)
      : await criarTarefa(dadosTarefa);

    if (result.success) {
      toast({
        title: editando ? 'Tarefa atualizada' : 'Tarefa criada',
        description: editando
          ? 'A tarefa foi atualizada com sucesso'
          : 'A tarefa foi criada com sucesso',
      });
      setDialogOpen(false);
      setEditando(null);
      setFormData({
        titulo: '',
        descricao: '',
        equipe_id: '',
        atribuido_para: '',
        prioridade: 'media',
        prazo: '',
      });
    } else {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar a tarefa',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (tarefa: any) => {
    setEditando(tarefa);
    setFormData({
      titulo: tarefa.titulo,
      descricao: tarefa.descricao || '',
      equipe_id: tarefa.equipe_id || '',
      atribuido_para: tarefa.atribuido_para || 'equipe_toda',
      prioridade: tarefa.prioridade,
      prazo: tarefa.prazo || '',
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta tarefa?')) return;

    const result = await deletarTarefa(id);
    if (result.success) {
      toast({
        title: 'Tarefa deletada',
        description: 'A tarefa foi removida com sucesso',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-navy">
            Todas as Tarefas
          </h3>
          <p className="text-sm text-navy/70">
            {tarefas.length} {tarefas.length === 1 ? 'tarefa' : 'tarefas'}
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="bg-gold hover:bg-gold/90">
          <Plus className="w-4 h-4 mr-2" />
          Nova Tarefa
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="w-6 h-6 animate-spin text-gold" />
        </div>
      ) : tarefas.length === 0 ? (
        <Card className="p-8 bg-white border-gold/10 text-center">
          <p className="text-navy/70">
            Nenhuma tarefa criada ainda. Crie a primeira tarefa!
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {tarefas.map((tarefa) => (
            <Card
              key={tarefa.id}
              className="p-4 bg-white border-gold/10 hover:border-gold/30 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-navy">
                      {tarefa.titulo}
                    </h4>
                    <Badge variant="outline" className={statusMap[tarefa.status].color}>
                      {statusMap[tarefa.status].label}
                    </Badge>
                    <Badge variant="outline" className="border-gold/30">
                      <span className={prioridadeMap[tarefa.prioridade].color}>
                        {prioridadeMap[tarefa.prioridade].label}
                      </span>
                    </Badge>
                  </div>

                  {tarefa.descricao && (
                    <p className="text-sm text-navy/70">
                      {tarefa.descricao}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-navy/60">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {tarefa.atribuido 
                        ? (tarefa.atribuido.full_name || tarefa.atribuido.username)
                        : '🎯 Toda a equipe'
                      }
                    </div>
                    {tarefa.prazo && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(tarefa.prazo).toLocaleDateString('pt-BR')}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(tarefa)}
                    className="text-gold hover:text-gold/80"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(tarefa.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog: Criar/Editar Tarefa */}
      <Dialog open={dialogOpen} onOpenChange={(open) => {
        setDialogOpen(open);
        if (!open) {
          setEditando(null);
          setFormData({
            titulo: '',
            descricao: '',
            equipe_id: '',
            atribuido_para: '',
            prioridade: 'media',
            prazo: '',
          });
        }
      }}>
        <DialogContent className="bg-white border-gold/20 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-navy">
              {editando ? 'Editar Tarefa' : 'Nova Tarefa'}
            </DialogTitle>
            <DialogDescription className="text-navy/70">
              Preencha os detalhes da tarefa
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-navy">Título *</Label>
              <Input
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder="Ex: Criar artigo sobre LGPD"
                className="bg-white border-gold/20 text-navy"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-navy">Descrição</Label>
              <Textarea
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Descreva os detalhes da tarefa..."
                className="bg-white border-gold/20 text-navy min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-navy">Equipe</Label>
                <Select value={formData.equipe_id} onValueChange={(value) => setFormData({ ...formData, equipe_id: value })}>
                  <SelectTrigger className="bg-white border-gold/20 text-navy">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gold/20">
                    {equipes.map((eq) => (
                      <SelectItem key={eq.id} value={eq.id} className="text-navy hover:bg-gold/10">
                        {eq.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-navy">Atribuir Para</Label>
                <Select value={formData.atribuido_para} onValueChange={(value) => setFormData({ ...formData, atribuido_para: value })}>
                  <SelectTrigger className="bg-white border-gold/20 text-navy">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gold/20">
                    <SelectItem value="equipe_toda" className="text-navy hover:bg-gold/10 font-semibold">
                      🎯 Toda a equipe
                    </SelectItem>
                    {profiles.map((p) => (
                      <SelectItem key={p.id} value={p.id} className="text-navy hover:bg-gold/10">
                        {p.full_name || p.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-navy">Prioridade</Label>
                <Select value={formData.prioridade} onValueChange={(value: any) => setFormData({ ...formData, prioridade: value })}>
                  <SelectTrigger className="bg-white border-gold/20 text-navy">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gold/20">
                    {Object.entries(prioridadeMap).map(([key, { label }]) => (
                      <SelectItem key={key} value={key} className="text-navy hover:bg-gold/10">
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-navy">Prazo</Label>
                <Input
                  type="date"
                  value={formData.prazo}
                  onChange={(e) => setFormData({ ...formData, prazo: e.target.value })}
                  className="bg-white border-gold/20 text-navy"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} className="bg-gold hover:bg-gold/90">
              {editando ? 'Salvar' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

