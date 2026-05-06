import { useState } from 'react';
import { useEquipes, useMembrosEquipe, useFuncoesEquipe } from '@/hooks/useEquipes';
import { useProfiles } from '@/hooks/useProfiles';
import { Button } from '@/components/ui/button';
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
import { Loader2, UserPlus, TrendingUp, X } from 'lucide-react';

const niveisMap = {
  iniciante: { label: 'Iniciante', color: 'bg-blue-500/20 text-blue-500 border-blue-500/30' },
  ativo: { label: 'Ativo', color: 'bg-green-500/20 text-green-500 border-green-500/30' },
  lider: { label: 'Líder', color: 'bg-purple-500/20 text-purple-500 border-purple-500/30' },
  coordenador: { label: 'Coordenador', color: 'bg-gold/20 text-gold border-gold/30' },
};

export default function AdminMembrosEcossistema() {
  const { equipes, loading: loadingEquipes } = useEquipes();
  const { profiles, loading: loadingProfiles } = useProfiles();
  const { toast } = useToast();

  const [equipeSelected, setEquipeSelected] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [membroSelecionado, setMembroSelecionado] = useState<any>(null);
  
  const [novoMembroId, setNovoMembroId] = useState('');
  const [novaFuncaoId, setNovaFuncaoId] = useState('');

  const { 
    membros, 
    loading: loadingMembros, 
    adicionarMembro,
    atualizarMembro,
    removerMembro,
    refetch 
  } = useMembrosEquipe(equipeSelected);

  const { funcoes, loading: loadingFuncoes } = useFuncoesEquipe(equipeSelected);

  const handleAdicionarMembro = async () => {
    if (!novoMembroId) {
      toast({
        title: 'Selecione um membro',
        variant: 'destructive',
      });
      return;
    }

    const result = await adicionarMembro(novoMembroId, novaFuncaoId || undefined);

    if (result.success) {
      toast({
        title: 'Membro adicionado',
        description: 'O membro foi adicionado à equipe com sucesso',
      });
      setDialogOpen(false);
      setNovoMembroId('');
      setNovaFuncaoId('');
    } else {
      toast({
        title: 'Erro ao adicionar membro',
        description: 'Não foi possível adicionar o membro à equipe',
        variant: 'destructive',
      });
    }
  };

  const handleAtualizarMembro = async () => {
    if (!membroSelecionado) return;

    const result = await atualizarMembro(membroSelecionado.id, {
      funcao_id: membroSelecionado.funcao_id,
      nivel: membroSelecionado.nivel,
    });

    if (result.success) {
      toast({
        title: 'Membro atualizado',
        description: 'As informações do membro foram atualizadas com sucesso',
      });
      setEditDialogOpen(false);
      setMembroSelecionado(null);
    } else {
      toast({
        title: 'Erro ao atualizar',
        description: 'Não foi possível atualizar o membro',
        variant: 'destructive',
      });
    }
  };

  const handleRemoverMembro = async (membroId: string) => {
    if (!confirm('Tem certeza que deseja remover este membro da equipe?')) return;

    const result = await removerMembro(membroId);

    if (result.success) {
      toast({
        title: 'Membro removido',
        description: 'O membro foi removido da equipe',
      });
    } else {
      toast({
        title: 'Erro ao remover',
        description: 'Não foi possível remover o membro',
        variant: 'destructive',
      });
    }
  };

  const membrosDisponiveis = profiles.filter(
    (p) => !membros.some((m) => m.user_id === p.id)
  );

  if (loadingEquipes) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Seletor de Equipe */}
      <div className="space-y-2">
        <Label className="text-navy">Selecione uma Equipe</Label>
        <Select value={equipeSelected} onValueChange={setEquipeSelected}>
          <SelectTrigger className="bg-white border-gold/20 text-navy">
            <SelectValue placeholder="Escolha uma equipe para gerenciar" />
          </SelectTrigger>
          <SelectContent className="bg-white border-gold/20">
            {equipes.map((equipe) => (
              <SelectItem
                key={equipe.id}
                value={equipe.id}
                className="text-navy hover:bg-gold/10"
              >
                Equipe {equipe.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {equipeSelected && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-navy">
                Membros da Equipe
              </h3>
              <p className="text-sm text-navy/70">
                {membros.length} {membros.length === 1 ? 'membro' : 'membros'}
              </p>
            </div>
            <Button onClick={() => setDialogOpen(true)} className="bg-gold hover:bg-gold/90">
              <UserPlus className="w-4 h-4 mr-2" />
              Adicionar Membro
            </Button>
          </div>

          {loadingMembros ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-6 h-6 animate-spin text-gold" />
            </div>
          ) : membros.length === 0 ? (
            <Card className="p-8 border-gold/20 text-center">
              <p className="text-navy-light">
                Nenhum membro nesta equipe ainda. Adicione o primeiro membro!
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {membros.map((membro) => (
                <Card
                  key={membro.id}
                  className="p-4 border-gold/20 hover:border-gold/40 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={membro.profile?.avatar_url || ''} />
                      <AvatarFallback className="bg-gold/20 text-gold">
                        {(membro.profile?.full_name || membro.profile?.username || 'U')[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-navy truncate">
                        {membro.profile?.full_name || membro.profile?.username}
                      </h4>
                      <p className="text-sm text-navy-light">
                        {membro.funcao?.nome || 'Sem função definida'}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          variant="outline"
                          className={niveisMap[membro.nivel].color}
                        >
                          {niveisMap[membro.nivel].label}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setMembroSelecionado(membro);
                          setEditDialogOpen(true);
                        }}
                        className="text-gold hover:text-gold/80"
                      >
                        <TrendingUp className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoverMembro(membro.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Dialog: Adicionar Membro */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-white border-gold/20">
          <DialogHeader>
            <DialogTitle className="text-navy">Adicionar Membro à Equipe</DialogTitle>
            <DialogDescription className="text-navy-light">
              Selecione um membro e atribua uma função
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-navy">Membro</Label>
              <Select value={novoMembroId} onValueChange={setNovoMembroId}>
                <SelectTrigger className="bg-white border-gold/20 text-navy">
                  <SelectValue placeholder="Selecione um membro" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gold/20">
                  {membrosDisponiveis.map((profile) => (
                    <SelectItem
                      key={profile.id}
                      value={profile.id}
                      className="text-navy hover:bg-gold/10"
                    >
                      {profile.full_name || profile.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-navy">Função (Opcional)</Label>
              <Select value={novaFuncaoId} onValueChange={setNovaFuncaoId}>
                <SelectTrigger className="bg-white border-gold/20 text-navy">
                  <SelectValue placeholder="Selecione uma função" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gold/20">
                  {funcoes.map((funcao) => (
                    <SelectItem
                      key={funcao.id}
                      value={funcao.id}
                      className="text-navy hover:bg-gold/10"
                    >
                      {funcao.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAdicionarMembro} className="bg-gold hover:bg-gold/90">
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Editar Membro */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-white border-gold/20">
          <DialogHeader>
            <DialogTitle className="text-navy">Editar Membro</DialogTitle>
            <DialogDescription className="text-navy-light">
              Atualize a função e nível do membro
            </DialogDescription>
          </DialogHeader>

          {membroSelecionado && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-navy">Função</Label>
                <Select
                  value={membroSelecionado.funcao_id || ''}
                  onValueChange={(value) =>
                    setMembroSelecionado({ ...membroSelecionado, funcao_id: value })
                  }
                >
                  <SelectTrigger className="bg-white border-gold/20 text-navy">
                    <SelectValue placeholder="Selecione uma função" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gold/20">
                    {funcoes.map((funcao) => (
                      <SelectItem
                        key={funcao.id}
                        value={funcao.id}
                        className="text-navy hover:bg-gold/10"
                      >
                        {funcao.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-navy">Nível</Label>
                <Select
                  value={membroSelecionado.nivel}
                  onValueChange={(value) =>
                    setMembroSelecionado({ ...membroSelecionado, nivel: value })
                  }
                >
                  <SelectTrigger className="bg-white border-gold/20 text-navy">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gold/20">
                    {Object.entries(niveisMap).map(([key, { label }]) => (
                      <SelectItem
                        key={key}
                        value={key}
                        className="text-navy hover:bg-gold/10"
                      >
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAtualizarMembro} className="bg-gold hover:bg-gold/90">
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

