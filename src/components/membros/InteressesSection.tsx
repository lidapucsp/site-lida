import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useInteresses } from '@/hooks/useInteresses';
import { useAuth } from '@/hooks/useAuth';
import { 
  Laptop, Brain, FileText, Gavel, Briefcase, Scale, 
  Building, ShoppingCart, Lightbulb, Leaf, Calculator, 
  Globe, Loader2, Check, Plus, X, Users 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
};

export default function InteressesSection() {
  const { profile } = useAuth();
  const { areas, meusInteresses, loading, adicionarInteresse, removerInteresse, fetchMembrosInteressados } = useInteresses(profile?.id);
  const { toast } = useToast();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [membrosDialog, setMembrosDialog] = useState<{ open: boolean; areaId: string; areaNome: string; membros: any[] }>({
    open: false,
    areaId: '',
    areaNome: '',
    membros: [],
  });

  const handleAdicionarInteresse = async (areaId: string, areaNome: string) => {
    setLoadingAction(areaId);
    try {
      await adicionarInteresse(areaId);
      toast({
        title: 'Interesse adicionado',
        description: `Você demonstrou interesse em ${areaNome}`,
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível adicionar o interesse',
        variant: 'destructive',
      });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRemoverInteresse = async (areaId: string, areaNome: string) => {
    setLoadingAction(areaId);
    try {
      await removerInteresse(areaId);
      toast({
        title: 'Interesse removido',
        description: `Você removeu o interesse em ${areaNome}`,
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível remover o interesse',
        variant: 'destructive',
      });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleVerMembros = async (areaId: string, areaNome: string) => {
    const membros = await fetchMembrosInteressados(areaId);
    setMembrosDialog({
      open: true,
      areaId,
      areaNome,
      membros,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-navy-900 mb-2">
            Áreas de Interesse
          </h2>
          <p className="text-gray-600">
            Demonstre interesse nas áreas do Direito que mais te atraem e conecte-se com outros membros que compartilham os mesmos interesses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areas.map((area) => {
            const Icon = area.icone ? iconMap[area.icone] || FileText : FileText;
            const temInteresse = meusInteresses.includes(area.id);
            const isLoading = loadingAction === area.id;

            return (
              <Card key={area.id} className={`transition-all duration-300 ${temInteresse ? 'border-gold border-2 shadow-lg' : 'hover:shadow-md'}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${temInteresse ? 'bg-gold/20' : 'bg-cream'}`}>
                        <Icon className="w-6 h-6 text-gold" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{area.nome}</CardTitle>
                        {temInteresse && (
                          <Badge variant="default" className="mt-1 bg-gold text-navy">
                            <Check className="w-3 h-3 mr-1" />
                            Interesse marcado
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-sm leading-relaxed">
                    {area.descricao}
                  </CardDescription>

                  <div className="flex flex-col gap-2">
                    {temInteresse ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoverInteresse(area.id, area.nome)}
                        disabled={isLoading}
                        className="w-full border-gold text-gold hover:bg-gold hover:text-white"
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <X className="w-4 h-4 mr-2" />
                        )}
                        Remover Interesse
                      </Button>
                    ) : (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleAdicionarInteresse(area.id, area.nome)}
                        disabled={isLoading}
                        className="w-full bg-navy hover:bg-navy-dark"
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Plus className="w-4 h-4 mr-2" />
                        )}
                        Aplicar Interesse
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVerMembros(area.id, area.nome)}
                      className="w-full"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Ver Membros Interessados
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Dialog de Membros Interessados */}
      <Dialog open={membrosDialog.open} onOpenChange={(open) => setMembrosDialog({ ...membrosDialog, open })}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Membros Interessados em {membrosDialog.areaNome}</DialogTitle>
            <DialogDescription>
              {membrosDialog.membros.length} {membrosDialog.membros.length === 1 ? 'membro demonstrou' : 'membros demonstraram'} interesse nesta área
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-4">
            {membrosDialog.membros.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Nenhum membro demonstrou interesse nesta área ainda.
              </p>
            ) : (
              membrosDialog.membros.map((membro: any) => (
                <div
                  key={membro.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-cream hover:bg-cream-dark transition-colors"
                >
                  <Avatar>
                    <AvatarImage src={membro.profiles?.avatar_url || ''} />
                    <AvatarFallback className="bg-navy text-cream">
                      {(membro.profiles?.username || 'M').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-navy-900">
                      {membro.profiles?.full_name || membro.profiles?.username}
                    </p>
                    <p className="text-sm text-gray-600">@{membro.profiles?.username}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
