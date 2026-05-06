import { useState } from 'react';
import { useEquipes } from '@/hooks/useEquipes';
import { useProfiles } from '@/hooks/useProfiles';
import { useComunicados } from '@/hooks/useChatEcossistema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Send, Loader2, Bell, AlertTriangle, AlertCircle, PartyPopper } from 'lucide-react';

const tiposMap = {
  informacao: { label: 'Informação', icon: Bell, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  alerta: { label: 'Alerta', icon: AlertTriangle, color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  urgente: { label: 'Urgente', icon: AlertCircle, color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  celebracao: { label: 'Celebração', icon: PartyPopper, color: 'bg-green-500/20 text-green-400 border-green-500/30' },
};

export default function AdminComunicadosEcossistema() {
  const { equipes } = useEquipes();
  const { profiles } = useProfiles();
  const { comunicados, loading, enviarComunicado } = useComunicados();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    titulo: '',
    mensagem: '',
    tipo: 'informacao' as 'informacao' | 'alerta' | 'urgente' | 'celebracao',
    equipe_id: 'all',
    todos_membros: true,
    destinatarios: [] as string[],
  });

  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async () => {
    if (!formData.titulo || !formData.mensagem) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha o título e a mensagem',
        variant: 'destructive',
      });
      return;
    }

    setEnviando(true);

    // Transformar 'all' em undefined para enviar a todas as equipes
    const dadosParaEnviar = {
      ...formData,
      equipe_id: formData.equipe_id === 'all' ? undefined : formData.equipe_id,
    };

    const result = await enviarComunicado(dadosParaEnviar);

    if (result.success) {
      toast({
        title: 'Comunicado enviado',
        description: 'O comunicado foi enviado com sucesso',
      });
      setFormData({
        titulo: '',
        mensagem: '',
        tipo: 'informacao',
        equipe_id: 'all',
        todos_membros: true,
        destinatarios: [],
      });
    } else {
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar o comunicado',
        variant: 'destructive',
      });
    }

    setEnviando(false);
  };

  return (
    <div className="space-y-6">
      {/* Formulário de Envio */}
      <Card className="p-6 bg-white border-gold/20">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-navy">Título *</Label>
            <Input
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              placeholder="Ex: Reunião importante na sexta-feira"
              className="bg-white border-gold/20 text-navy"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-navy">Mensagem *</Label>
            <Textarea
              value={formData.mensagem}
              onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
              placeholder="Escreva a mensagem do comunicado..."
              className="bg-white border-gold/20 text-navy min-h-[120px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-navy">Tipo</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value: any) => setFormData({ ...formData, tipo: value })}
              >
                <SelectTrigger className="bg-white border-gold/20 text-navy">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gold/20">
                  {Object.entries(tiposMap).map(([key, { label }]) => (
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

            <div className="space-y-2">
              <Label className="text-navy">Equipe Específica (Opcional)</Label>
              <Select
                value={formData.equipe_id}
                onValueChange={(value) => setFormData({ ...formData, equipe_id: value })}
              >
                <SelectTrigger className="bg-white border-gold/20 text-navy">
                  <SelectValue placeholder="Todas as equipes" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gold/20">
                  <SelectItem value="all" className="text-navy hover:bg-gold/10">
                    Todas as equipes
                  </SelectItem>
                  {equipes.map((eq) => (
                    <SelectItem
                      key={eq.id}
                      value={eq.id}
                      className="text-navy hover:bg-gold/10"
                    >
                      Equipe {eq.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              checked={formData.todos_membros}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, todos_membros: checked as boolean })
              }
              className="border-gold/30"
            />
            <Label className="text-navy text-sm">
              Enviar para todos os membros do ecossistema
            </Label>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={enviando}
            className="w-full bg-gold hover:bg-gold/90"
          >
            {enviando ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Enviar Comunicado
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Histórico de Comunicados */}
      <div>
        <h3 className="text-lg font-bold text-navy mb-4">
          Comunicados Recentes
        </h3>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-6 h-6 animate-spin text-gold" />
          </div>
        ) : comunicados.length === 0 ? (
          <Card className="p-8 bg-white border-gold/10 text-center">
            <p className="text-navy/70">
              Nenhum comunicado enviado ainda
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {comunicados.slice(0, 10).map((comunicado) => {
              const TipoIcon = tiposMap[comunicado.tipo].icon;

              return (
                <Card
                  key={comunicado.id}
                  className="p-4 bg-white border-gold/10 hover:border-gold/30 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: tiposMap[comunicado.tipo].color.split(' ')[0].replace('bg-', '').replace('/20', '15'),
                      }}
                    >
                      <TipoIcon className="h-5 w-5" />
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-navy">
                          {comunicado.titulo}
                        </h4>
                        <Badge variant="outline" className={tiposMap[comunicado.tipo].color}>
                          {tiposMap[comunicado.tipo].label}
                        </Badge>
                      </div>

                      <p className="text-sm text-navy/70">
                        {comunicado.mensagem}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-navy/50">
                        <span>Por: {comunicado.enviado_por_nome}</span>
                        <span>•</span>
                        <span>
                          {new Date(comunicado.created_at).toLocaleString('pt-BR')}
                        </span>
                        {comunicado.lido_por && (
                          <>
                            <span>•</span>
                            <span>{comunicado.lido_por.length} leituras</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

