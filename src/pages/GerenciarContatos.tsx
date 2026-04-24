import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, Loader2, Eye, Archive, Check, Clock, ArrowLeft, Send } from 'lucide-react';

interface Contato {
  id: string;
  nome: string;
  email: string;
  assunto: string;
  mensagem: string;
  status: string;
  lido: boolean;
  resposta: string | null;
  respondido_por: string | null;
  respondido_em: string | null;
  created_at: string;
}

export default function GerenciarContatos() {
  const navigate = useNavigate();
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContato, setSelectedContato] = useState<Contato | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [respostaDialogOpen, setRespostaDialogOpen] = useState(false);
  const [respostaTexto, setRespostaTexto] = useState('');
  const [enviandoResposta, setEnviandoResposta] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchContatos();
  }, []);

  const fetchContatos = async () => {
    try {
      const { data, error } = await supabase
        .from('contatos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContatos(data || []);
    } catch (error) {
      console.error('Erro ao buscar contatos:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os contatos',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const marcarComoLido = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contatos')
        .update({ lido: true })
        .eq('id', id);

      if (error) throw error;
      await fetchContatos();
    } catch (error) {
      console.error('Erro ao marcar como lido:', error);
    }
  };

  const alterarStatus = async (id: string, novoStatus: string) => {
    try {
      const { error } = await supabase
        .from('contatos')
        .update({ status: novoStatus })
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: 'Status atualizado',
        description: `Contato marcado como ${novoStatus}`,
      });
      
      await fetchContatos();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o status',
        variant: 'destructive',
      });
    }
  };

  const enviarResposta = async () => {
    if (!selectedContato || !respostaTexto.trim()) {
      toast({
        title: 'Erro',
        description: 'Digite uma mensagem para enviar',
        variant: 'destructive',
      });
      return;
    }

    setEnviandoResposta(true);

    try {
      // Chamar Edge Function para enviar email
      const { data, error } = await supabase.functions.invoke('responder-contato', {
        body: {
          destinatario_email: selectedContato.email,
          destinatario_nome: selectedContato.nome,
          assunto_original: selectedContato.assunto,
          mensagem_original: selectedContato.mensagem,
          resposta: respostaTexto,
        },
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Erro ao enviar email');
      }

      // Marcar como respondido
      await alterarStatus(selectedContato.id, 'respondido');
      
      toast({
        title: 'Email enviado com sucesso!',
        description: `Resposta enviada para ${selectedContato.nome}`,
      });

      setRespostaDialogOpen(false);
      setDialogOpen(false);
      setRespostaTexto('');
    } catch (error) {
      console.error('Erro ao enviar resposta:', error);
      toast({
        title: 'Erro ao enviar email',
        description: error instanceof Error ? error.message : 'Não foi possível enviar a resposta',
        variant: 'destructive',
      });
    } finally {
      setEnviandoResposta(false);
    }
  };

  const handleVerDetalhes = async (contato: Contato) => {
    setSelectedContato(contato);
    setDialogOpen(true);
    
    if (!contato.lido) {
      await marcarComoLido(contato.id);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      novo: { label: 'Novo', variant: 'default' as const, className: 'bg-blue-100 text-blue-800' },
      em_analise: { label: 'Em Análise', variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800' },
      respondido: { label: 'Respondido', variant: 'default' as const, className: 'bg-green-100 text-green-800' },
      arquivado: { label: 'Arquivado', variant: 'outline' as const, className: 'bg-gray-100 text-gray-800' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.novo;
    return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
  };

  const contatosPorStatus = {
    novo: contatos.filter(c => c.status === 'novo'),
    em_analise: contatos.filter(c => c.status === 'em_analise'),
    respondido: contatos.filter(c => c.status === 'respondido'),
    arquivado: contatos.filter(c => c.status === 'arquivado'),
  };

  const ContatoCard = ({ contato }: { contato: Contato }) => (
    <Card className={`border-gold/20 ${!contato.lido ? 'bg-blue-50/50' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-navy">{contato.nome}</h3>
              {!contato.lido && (
                <Badge variant="secondary" className="text-xs">Não lido</Badge>
              )}
            </div>
            <p className="text-sm text-navy-light mb-1">{contato.email}</p>
            <p className="text-sm font-medium text-navy mb-2">Assunto: {contato.assunto}</p>
            <p className="text-sm text-navy-light line-clamp-2">{contato.mensagem}</p>
            <p className="text-xs text-navy-light mt-2">
              {new Date(contato.created_at).toLocaleString('pt-BR')}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {getStatusBadge(contato.status)}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleVerDetalhes(contato)}
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-navy border-b border-gold/20 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
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
                Gerenciar Contatos
              </h1>
              <p className="text-sm text-gold-light">
                Mensagens recebidas através do formulário de contato
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-navy-light">Novos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-navy">{contatosPorStatus.novo.length}</div>
          </CardContent>
        </Card>
        
        <Card className="border-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-navy-light">Em Análise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-navy">{contatosPorStatus.em_analise.length}</div>
          </CardContent>
        </Card>
        
        <Card className="border-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-navy-light">Respondidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-navy">{contatosPorStatus.respondido.length}</div>
          </CardContent>
        </Card>
        
        <Card className="border-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-navy-light">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-navy">{contatos.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="novo" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="novo">Novos ({contatosPorStatus.novo.length})</TabsTrigger>
          <TabsTrigger value="em_analise">Em Análise ({contatosPorStatus.em_analise.length})</TabsTrigger>
          <TabsTrigger value="respondido">Respondidos ({contatosPorStatus.respondido.length})</TabsTrigger>
          <TabsTrigger value="todos">Todos ({contatos.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="novo" className="space-y-4 mt-4">
          {contatosPorStatus.novo.length === 0 ? (
            <Card className="border-gold/20">
              <CardContent className="p-8 text-center text-navy-light">
                Nenhum contato novo
              </CardContent>
            </Card>
          ) : (
            contatosPorStatus.novo.map(contato => (
              <ContatoCard key={contato.id} contato={contato} />
            ))
          )}
        </TabsContent>

        <TabsContent value="em_analise" className="space-y-4 mt-4">
          {contatosPorStatus.em_analise.length === 0 ? (
            <Card className="border-gold/20">
              <CardContent className="p-8 text-center text-navy-light">
                Nenhum contato em análise
              </CardContent>
            </Card>
          ) : (
            contatosPorStatus.em_analise.map(contato => (
              <ContatoCard key={contato.id} contato={contato} />
            ))
          )}
        </TabsContent>

        <TabsContent value="respondido" className="space-y-4 mt-4">
          {contatosPorStatus.respondido.length === 0 ? (
            <Card className="border-gold/20">
              <CardContent className="p-8 text-center text-navy-light">
                Nenhum contato respondido
              </CardContent>
            </Card>
          ) : (
            contatosPorStatus.respondido.map(contato => (
              <ContatoCard key={contato.id} contato={contato} />
            ))
          )}
        </TabsContent>

        <TabsContent value="todos" className="space-y-4 mt-4">
          {contatos.map(contato => (
            <ContatoCard key={contato.id} contato={contato} />
          ))}
        </TabsContent>
      </Tabs>

      {/* Dialog de Detalhes */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-navy">Detalhes do Contato</DialogTitle>
            <DialogDescription>
              Recebido em {selectedContato && new Date(selectedContato.created_at).toLocaleString('pt-BR')}
            </DialogDescription>
          </DialogHeader>

          {selectedContato && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-navy-light">Nome</label>
                <p className="text-navy font-medium">{selectedContato.nome}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-navy-light">Email</label>
                <p className="text-navy">{selectedContato.email}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-navy-light">Assunto</label>
                <p className="text-navy font-medium">{selectedContato.assunto}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-navy-light">Mensagem</label>
                <p className="text-navy whitespace-pre-wrap">{selectedContato.mensagem}</p>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t">
                <label className="text-sm font-medium text-navy-light">Status:</label>
                {getStatusBadge(selectedContato.status)}
              </div>

              <div className="flex gap-2 pt-4">
                {selectedContato.status === 'novo' && (
                  <Button
                    variant="outline"
                    onClick={() => alterarStatus(selectedContato.id, 'em_analise')}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Marcar Em Análise
                  </Button>
                )}
                
                {(selectedContato.status === 'novo' || selectedContato.status === 'em_analise') && (
                  <Button
                    variant="outline"
                    onClick={() => alterarStatus(selectedContato.id, 'respondido')}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Marcar como Respondido
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  onClick={() => alterarStatus(selectedContato.id, 'arquivado')}
                >
                  <Archive className="w-4 h-4 mr-2" />
                  Arquivar
                </Button>

                <Button
                  variant="default"
                  onClick={() => {
                    setRespostaTexto('');
                    setRespostaDialogOpen(true);
                  }}
                  className="ml-auto"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Responder Email
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Resposta por Email */}
      <Dialog open={respostaDialogOpen} onOpenChange={setRespostaDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-navy">Responder por Email</DialogTitle>
            <DialogDescription>
              {selectedContato && (
                <>
                  Enviando resposta para <strong>{selectedContato.nome}</strong> ({selectedContato.email})
                  <br />
                  Assunto: Re: {selectedContato.assunto}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="resposta" className="text-navy font-medium">
                Mensagem de Resposta
              </Label>
              <Textarea
                id="resposta"
                placeholder="Digite sua resposta aqui..."
                value={respostaTexto}
                onChange={(e) => setRespostaTexto(e.target.value)}
                rows={8}
                className="mt-2"
              />
              <p className="text-xs text-navy-light mt-2">
                Será incluída automaticamente uma referência à mensagem original
              </p>
            </div>

            {selectedContato && (
              <div className="bg-cream p-4 rounded-lg border border-gold/20">
                <p className="text-sm font-medium text-navy mb-2">Mensagem Original:</p>
                <p className="text-sm text-navy-light whitespace-pre-wrap">
                  {selectedContato.mensagem}
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRespostaDialogOpen(false)}
              disabled={enviandoResposta}
            >
              Cancelar
            </Button>
            <Button
              onClick={enviarResposta}
              disabled={enviandoResposta || !respostaTexto.trim()}
            >
              {enviandoResposta ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Email
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
        </div>
      </div>
    </div>
  );
}
