import { useState, useEffect } from 'react';
import { useEquipes } from '@/hooks/useEquipes';
import { useProfiles } from '@/hooks/useProfiles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Users, BookOpen, Megaphone, Briefcase, Cpu } from 'lucide-react';

const iconMap: Record<string, any> = {
  BookOpen,
  Megaphone,
  Briefcase,
  Cpu,
};

export default function AdminEquipes() {
  const { equipes, loading, updateEquipe, refetch } = useEquipes();
  const { profiles, loading: loadingProfiles } = useProfiles();
  const { toast } = useToast();
  const [salvando, setSalvando] = useState<string | null>(null);

  const admins = profiles.filter((p) => p.is_admin);

  const handleUpdateDiretor = async (equipeId: string, diretorId: string) => {
    setSalvando(equipeId);
    
    const diretor = admins.find((a) => a.id === diretorId);
    const result = await updateEquipe(equipeId, {
      diretor_id: diretorId,
      diretor_nome: diretor?.full_name || diretor?.username || null,
    });

    if (result.success) {
      toast({
        title: 'Diretor atualizado',
        description: 'O diretor da equipe foi atualizado com sucesso',
      });
    } else {
      toast({
        title: 'Erro ao atualizar',
        description: 'Não foi possível atualizar o diretor',
        variant: 'destructive',
      });
    }

    setSalvando(null);
  };

  if (loading || loadingProfiles) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {equipes.map((equipe) => {
        const Icon = iconMap[equipe.icone || 'Users'] || Users;
        
        return (
          <Card
            key={equipe.id}
            className="p-4 border-gold/20 hover:border-gold/40 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div
                className="h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${equipe.cor}33` }}
              >
                <Icon className="h-6 w-6" style={{ color: equipe.cor }} />
              </div>

              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-lg font-bold text-navy">
                    Equipe {equipe.nome}
                  </h3>
                  <p className="text-sm text-navy-light">
                    {equipe.descricao}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-navy-light">Diretor Responsável</Label>
                  <div className="flex items-center gap-2">
                    <Select
                      value={equipe.diretor_id || ''}
                      onValueChange={(value) => handleUpdateDiretor(equipe.id, value)}
                      disabled={salvando === equipe.id}
                    >
                      <SelectTrigger className="flex-1 bg-white border-gold/20 text-navy">
                        <SelectValue placeholder="Selecione um diretor" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gold/20">
                        {admins.map((admin) => (
                          <SelectItem
                            key={admin.id}
                            value={admin.id}
                            className="text-navy hover:bg-gold/10"
                          >
                            {admin.full_name || admin.username}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {salvando === equipe.id && (
                      <Loader2 className="w-4 h-4 animate-spin text-gold" />
                    )}
                  </div>

                  {equipe.diretor_nome && (
                    <Badge variant="outline" className="border-gold/30 text-gold">
                      Diretor: {equipe.diretor_nome}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
