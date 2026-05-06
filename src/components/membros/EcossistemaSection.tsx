import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMembrosEquipe } from '@/hooks/useEquipes';
import { useTarefasEcossistema } from '@/hooks/useTarefasEcossistema';
import { useChatEquipe, useComunicados } from '@/hooks/useChatEcossistema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Users, 
  MessageSquare, 
  Bell, 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertCircle,
  Send,
  Loader2,
  BookOpen,
  Megaphone,
  Briefcase,
  Cpu,
  Calendar,
  User,
  PartyPopper,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  ChevronDown,
  Crown
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const iconMap = {
  BookOpen,
  Megaphone,
  Briefcase,
  Cpu,
};

const statusMap = {
  pendente: { label: 'Pendente', icon: Circle, color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
  em_andamento: { label: 'Em Andamento', icon: Clock, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  em_revisao: { label: 'Em Revisão', icon: AlertCircle, color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  concluida: { label: 'Concluída', icon: CheckCircle2, color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  cancelada: { label: 'Cancelada', icon: AlertCircle, color: 'bg-red-500/20 text-red-400 border-red-500/30' },
};

const prioridadeMap = {
  baixa: { label: 'Baixa', color: 'bg-gray-500/20 text-gray-400' },
  media: { label: 'Média', color: 'bg-blue-500/20 text-blue-400' },
  alta: { label: 'Alta', color: 'bg-yellow-500/20 text-yellow-400' },
  urgente: { label: 'Urgente', color: 'bg-red-500/20 text-red-400' },
};

const niveisMap = {
  iniciante: { label: 'Iniciante', color: 'bg-blue-500/20 text-blue-400' },
  ativo: { label: 'Ativo', color: 'bg-green-500/20 text-green-400' },
  lider: { label: 'Líder', color: 'bg-purple-500/20 text-purple-400' },
  coordenador: { label: 'Coordenador', color: 'bg-gold/20 text-gold' },
};

const tiposMap = {
  informacao: { label: 'Informação', icon: Bell, color: 'bg-blue-500/20 text-blue-400' },
  alerta: { label: 'Alerta', icon: AlertTriangle, color: 'bg-yellow-500/20 text-yellow-400' },
  urgente: { label: 'Urgente', icon: AlertCircle, color: 'bg-red-500/20 text-red-400' },
  celebracao: { label: 'Celebração', icon: PartyPopper, color: 'bg-green-500/20 text-green-400' },
};

export default function EcossistemaSection() {
  const { profile } = useAuth();
  const [minhaEquipe, setMinhaEquipe] = useState<any>(null);
  const [meuMembro, setMeuMembro] = useState<any>(null);
  const [mensagem, setMensagem] = useState('');
  const [introAberta, setIntroAberta] = useState(true);
  const [enviandoMsg, setEnviandoMsg] = useState(false);
  const [carregandoEquipe, setCarregandoEquipe] = useState(true);

  // Descobrir qual equipe o usuário pertence
  useEffect(() => {
    const descobrirMinhaEquipe = async () => {
      if (!profile?.id) {
        setCarregandoEquipe(false);
        return;
      }

      try {
        // Primeiro busca os dados do membro e equipe
        const { data: membroData, error: membroError } = await (await import('@/lib/supabase')).supabase
          .from('membros_equipe')
          .select(`
            *,
            equipe:equipes(*),
            funcao:funcoes_equipe(*)
          `)
          .eq('user_id', profile.id)
          .single();

        if (membroError || !membroData) {
          console.error('Erro ao buscar membro:', membroError);
          setCarregandoEquipe(false);
          return;
        }

        setMinhaEquipe(membroData.equipe);
        setMeuMembro(membroData);
      } catch (err) {
        console.error('Erro ao buscar equipe:', err);
      } finally {
        setCarregandoEquipe(false);
      }
    };

    descobrirMinhaEquipe();
  }, [profile?.id]);

  // Buscar minha equipe - só quando tiver equipeId
  const { membros: todosMembros, loading: loadingMembros } = useMembrosEquipe(minhaEquipe?.id);
  
  // Buscar minhas tarefas
  const { tarefas, loading: loadingTarefas, atualizarTarefa } = useTarefasEcossistema({
    userId: profile?.id,
  });

  // Chat da equipe - só quando tiver equipeId
  const { mensagens, loading: loadingChat, enviarMensagem } = useChatEquipe(minhaEquipe?.id);

  // Comunicados
  const { comunicados, loading: loadingComunicados, marcarComoLido } = useComunicados();

  const handleEnviarMensagem = async () => {
    if (!mensagem.trim() || !minhaEquipe) return;

    setEnviandoMsg(true);
    await enviarMensagem(mensagem);
    setMensagem('');
    setEnviandoMsg(false);
  };

  const handleAtualizarStatus = async (tarefaId: string, novoStatus: string) => {
    await atualizarTarefa(tarefaId, { status: novoStatus });
  };

  // Filtrar comunicados da minha equipe
  const meusComunicados = comunicados.filter(
    (c) => c.todos_membros || c.equipe_id === minhaEquipe?.id
  );

  const comunicadosNaoLidos = meusComunicados.filter(
    (c) => !c.lido_por || !c.lido_por.includes(profile?.id || '')
  );

  if (carregandoEquipe || loadingMembros) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!minhaEquipe || !meuMembro) {
    return (
      <div className="space-y-6">
        {/* Seção de Introdução ao Ecossistema */}
        <Collapsible open={introAberta} onOpenChange={setIntroAberta}>
          <Card className="bg-gradient-to-br from-navy via-navy-dark to-navy border-gold/30 overflow-hidden relative">
            {/* Decoração de fundo */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold rounded-full blur-3xl" />
            </div>

            <CardHeader className="relative z-10">
              <CollapsibleTrigger className="w-full">
                <div className="flex items-start gap-3 mb-4 cursor-pointer hover:opacity-80 transition-opacity">
                  <div className="p-3 bg-gold/20 rounded-lg">
                    <Sparkles className="w-6 h-6 text-gold" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-cream text-2xl mb-2">Ecossistema LIDA</CardTitle>
                      <ChevronDown className={`w-6 h-6 text-gold transition-transform duration-200 ${introAberta ? '' : '-rotate-90'}`} />
                    </div>
                    <CardDescription className="text-cream/80 text-base leading-relaxed max-w-4xl">
                  Um modelo <span className="text-gold font-semibold">autônomo, colaborativo e interdisciplinar</span> onde 
                  os membros não apenas aprendem, mas produzem conhecimento aplicado. O LIDA funciona como um{' '}
                  <span className="text-gold font-semibold">laboratório vivo</span>, onde teoria e prática caminham juntas 
                  através do <span className="text-gold font-semibold">aprendizado ativo</span> + produção intelectual + aplicação prática.
                    </CardDescription>
                  </div>
                </div>
              </CollapsibleTrigger>

              {/* Ciclo Operacional */}
              <CollapsibleContent>
                <div className="mt-6">
              <h3 className="text-cream font-semibold text-lg mb-4 flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-gold" />
                Ciclo Contínuo de Produção
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Equipe Acadêmica */}
                <div className="relative">
                  <Card className="bg-white/10 border-cream/20 backdrop-blur-sm hover:bg-white/20 transition-all">
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="p-3 bg-blue-500/20 rounded-lg">
                          <BookOpen className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <h4 className="text-cream font-semibold mb-1">Acadêmica</h4>
                          <p className="text-cream/70 text-xs">Produz conhecimento</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="w-8 h-8 text-gold drop-shadow-lg" />
                  </div>
                </div>

                {/* Equipe Marketing */}
                <div className="relative">
                  <Card className="bg-white/10 border-cream/20 backdrop-blur-sm hover:bg-white/20 transition-all">
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="p-3 bg-purple-500/20 rounded-lg">
                          <Megaphone className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                          <h4 className="text-cream font-semibold mb-1">Marketing</h4>
                          <p className="text-cream/70 text-xs">Transforma em conteúdo</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="w-8 h-8 text-gold drop-shadow-lg" />
                  </div>
                </div>

                {/* Equipe Administrativa */}
                <div className="relative">
                  <Card className="bg-white/10 border-cream/20 backdrop-blur-sm hover:bg-white/20 transition-all">
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="p-3 bg-green-500/20 rounded-lg">
                          <Briefcase className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                          <h4 className="text-cream font-semibold mb-1">Administrativa</h4>
                          <p className="text-cream/70 text-xs">Organiza e distribui</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="w-8 h-8 text-gold drop-shadow-lg" />
                  </div>
                </div>

                {/* Equipe Tech */}
                <div>
                  <Card className="bg-white/10 border-cream/20 backdrop-blur-sm hover:bg-white/20 transition-all">
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="p-3 bg-orange-500/20 rounded-lg">
                          <Cpu className="w-6 h-6 text-orange-400" />
                        </div>
                        <div>
                          <h4 className="text-cream font-semibold mb-1">Tech</h4>
                          <p className="text-cream/70 text-xs">Potencializa com tecnologia</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <p className="text-center text-cream/60 text-sm mt-4 italic">
                Este ciclo se retroalimenta continuamente, criando um ecossistema vivo e sustentável
              </p>
                </div>
              </CollapsibleContent>
            </CardHeader>
          </Card>
        </Collapsible>

        <Card className="max-w-2xl mx-auto bg-white border-gold/20">
          <CardHeader>
            <CardTitle className="text-navy">Você ainda não foi alocado em uma equipe</CardTitle>
            <CardDescription className="text-navy-light">
              Entre em contato com a coordenação para ser adicionado a uma equipe do ecossistema.
          </CardDescription>
        </CardHeader>
      </Card>
      </div>
    );
  }

  const EquipeIcon = iconMap[minhaEquipe.icone as keyof typeof iconMap] || BookOpen;

  // Agrupar tarefas por status para o kanban
  const tarefasPorStatus = {
    pendente: tarefas.filter((t) => t.status === 'pendente'),
    em_andamento: tarefas.filter((t) => t.status === 'em_andamento'),
    em_revisao: tarefas.filter((t) => t.status === 'em_revisao'),
    concluida: tarefas.filter((t) => t.status === 'concluida'),
  };

  return (
    <div className="space-y-6">
      {/* Seção de Introdução ao Ecossistema */}
      <Collapsible open={introAberta} onOpenChange={setIntroAberta}>
        <Card className="bg-gradient-to-br from-navy via-navy-dark to-navy border-gold/30 overflow-hidden relative">
          {/* Decoração de fundo */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold rounded-full blur-3xl" />
          </div>

          <CardHeader className="relative z-10">
            <CollapsibleTrigger className="w-full">
              <div className="flex items-start gap-3 mb-4 cursor-pointer hover:opacity-80 transition-opacity">
                <div className="p-3 bg-gold/20 rounded-lg">
                  <Sparkles className="w-6 h-6 text-gold" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-cream text-2xl mb-2">Ecossistema LIDA</CardTitle>
                    <ChevronDown className={`w-6 h-6 text-gold transition-transform duration-200 ${introAberta ? '' : '-rotate-90'}`} />
                  </div>
                  <CardDescription className="text-cream/80 text-base leading-relaxed max-w-4xl">
                    Um modelo <span className="text-gold font-semibold">autônomo, colaborativo e interdisciplinar</span> onde 
                    os membros não apenas aprendem, mas produzem conhecimento aplicado. O LIDA funciona como um{' '}
                    <span className="text-gold font-semibold">laboratório vivo</span>, onde teoria e prática caminham juntas 
                    através do <span className="text-gold font-semibold">aprendizado ativo</span> + produção intelectual + aplicação prática.
                  </CardDescription>
                </div>
              </div>
            </CollapsibleTrigger>

            {/* Ciclo Operacional */}
            <CollapsibleContent>
              <div className="mt-6">
            <h3 className="text-cream font-semibold text-lg mb-4 flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-gold" />
              Ciclo Contínuo de Produção
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Equipe Acadêmica */}
              <div className="relative">
                <Card className="bg-white/10 border-cream/20 backdrop-blur-sm hover:bg-white/20 transition-all">
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="p-3 bg-blue-500/20 rounded-lg">
                        <BookOpen className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-cream font-semibold mb-1">Acadêmica</h4>
                        <p className="text-cream/70 text-xs">Produz conhecimento</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="w-8 h-8 text-gold drop-shadow-lg" />
                </div>
              </div>

              {/* Equipe Marketing */}
              <div className="relative">
                <Card className="bg-white/10 border-cream/20 backdrop-blur-sm hover:bg-white/20 transition-all">
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="p-3 bg-purple-500/20 rounded-lg">
                        <Megaphone className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="text-cream font-semibold mb-1">Marketing</h4>
                        <p className="text-cream/70 text-xs">Transforma em conteúdo</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="w-8 h-8 text-gold drop-shadow-lg" />
                </div>
              </div>

              {/* Equipe Administrativa */}
              <div className="relative">
                <Card className="bg-white/10 border-cream/20 backdrop-blur-sm hover:bg-white/20 transition-all">
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="p-3 bg-green-500/20 rounded-lg">
                        <Briefcase className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <h4 className="text-cream font-semibold mb-1">Administrativa</h4>
                        <p className="text-cream/70 text-xs">Organiza e distribui</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="w-8 h-8 text-gold drop-shadow-lg" />
                </div>
              </div>

              {/* Equipe Tech */}
              <div>
                <Card className="bg-white/10 border-cream/20 backdrop-blur-sm hover:bg-white/20 transition-all">
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="p-3 bg-orange-500/20 rounded-lg">
                        <Cpu className="w-6 h-6 text-orange-400" />
                      </div>
                      <div>
                        <h4 className="text-cream font-semibold mb-1">Tech</h4>
                        <p className="text-cream/70 text-xs">Potencializa com tecnologia</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <p className="text-center text-cream/60 text-sm mt-4 italic">
              Este ciclo se retroalimenta continuamente, criando um ecossistema vivo e sustentável
            </p>
              </div>
            </CollapsibleContent>
          </CardHeader>
        </Card>
      </Collapsible>

      {/* Cabeçalho da Equipe */}
      <Card className="bg-white border-gold/20">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div
              className="p-4 rounded-lg"
              style={{ backgroundColor: `${minhaEquipe.cor}20` }}
            >
              <EquipeIcon className="w-8 h-8" style={{ color: minhaEquipe.cor }} />
            </div>
            <div className="flex-1">
              <CardTitle className="text-navy text-2xl">
                Equipe {minhaEquipe.nome}
              </CardTitle>
              <div className="text-navy-light text-sm mt-2">
                {meuMembro.funcao?.nome || 'Membro'}
                {meuMembro.nivel && (
                  <Badge className={`ml-2 ${niveisMap[meuMembro.nivel as keyof typeof niveisMap]?.color}`}>
                    {niveisMap[meuMembro.nivel as keyof typeof niveisMap]?.label}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              {minhaEquipe.diretor_nome && (
                <div className="flex items-center gap-2 text-sm">
                  <Crown className="w-4 h-4 text-gold" />
                  <span className="text-navy-light">
                    Diretor(a): <span className="font-semibold text-navy">{minhaEquipe.diretor_nome}</span>
                  </span>
                </div>
              )}
              {comunicadosNaoLidos.length > 0 && (
                <Badge className="bg-red-500/20 text-red-400">
                  {comunicadosNaoLidos.length} novo{comunicadosNaoLidos.length > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="tarefas" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white border border-gold/20">
          <TabsTrigger value="tarefas" className="data-[state=active]:bg-navy data-[state=active]:text-cream">
            <Circle className="w-4 h-4 mr-2" />
            Tarefas
          </TabsTrigger>
          <TabsTrigger value="membros" className="data-[state=active]:bg-navy data-[state=active]:text-cream">
            <Users className="w-4 h-4 mr-2" />
            Membros
          </TabsTrigger>
          <TabsTrigger value="chat" className="data-[state=active]:bg-navy data-[state=active]:text-cream">
            <MessageSquare className="w-4 h-4 mr-2" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="comunicados" className="data-[state=active]:bg-navy data-[state=active]:text-cream">
            <Bell className="w-4 h-4 mr-2" />
            Comunicados
            {comunicadosNaoLidos.length > 0 && (
              <Badge className="ml-2 bg-red-500 text-white text-xs">
                {comunicadosNaoLidos.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Tab: Tarefas (Kanban) */}
        <TabsContent value="tarefas" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Object.entries(tarefasPorStatus).map(([status, tasks]) => {
              const statusInfo = statusMap[status as keyof typeof statusMap];
              const StatusIcon = statusInfo.icon;

              return (
                <Card key={status} className="bg-white border-gold/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <StatusIcon className="w-4 h-4 text-navy" />
                      <CardTitle className="text-sm text-navy">{statusInfo.label}</CardTitle>
                      <Badge variant="outline" className="ml-auto text-navy-light">
                        {tasks.length}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {tasks.map((tarefa) => {
                      const prioridade = prioridadeMap[tarefa.prioridade as keyof typeof prioridadeMap];
                      
                      return (
                        <Card key={tarefa.id} className="p-3 bg-cream/30 border-gold/10">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-sm font-semibold text-navy line-clamp-2">
                                {tarefa.titulo}
                              </h4>
                              <Badge className={`${prioridade.color} text-xs shrink-0`}>
                                {prioridade.label}
                              </Badge>
                            </div>

                            {tarefa.descricao && (
                              <p className="text-xs text-navy/70 line-clamp-2">
                                {tarefa.descricao}
                              </p>
                            )}

                            {tarefa.prazo && (
                              <div className="flex items-center gap-1 text-xs text-navy/60">
                                <Calendar className="w-3 h-3" />
                                {format(new Date(tarefa.prazo), 'dd/MM/yyyy', { locale: ptBR })}
                              </div>
                            )}

                            {/* Botões de mudança de status */}
                            <div className="flex gap-1 pt-2">
                              {status !== 'em_andamento' && status !== 'concluida' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleAtualizarStatus(tarefa.id, 'em_andamento')}
                                  className="text-xs h-7 text-navy hover:bg-gold/10"
                                >
                                  Iniciar
                                </Button>
                              )}
                              {status === 'em_andamento' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleAtualizarStatus(tarefa.id, 'em_revisao')}
                                  className="text-xs h-7 text-navy hover:bg-gold/10"
                                >
                                  Revisar
                                </Button>
                              )}
                              {status === 'em_revisao' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleAtualizarStatus(tarefa.id, 'concluida')}
                                  className="text-xs h-7 text-green-600 hover:bg-green-50"
                                >
                                  Concluir
                                </Button>
                              )}
                            </div>
                          </div>
                        </Card>
                      );
                    })}

                    {tasks.length === 0 && (
                      <p className="text-center text-sm text-navy/50 py-4">
                        Nenhuma tarefa
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Tab: Membros */}
        <TabsContent value="membros" className="space-y-4">
          <Card className="bg-white border-gold/20">
            <CardHeader>
              <CardTitle className="text-navy">Membros da Equipe</CardTitle>
              <CardDescription className="text-navy-light">
                {todosMembros.length} membro{todosMembros.length !== 1 ? 's' : ''} na equipe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {todosMembros.map((membro) => (
                  <Card key={membro.id} className="p-4 bg-cream/30 border-gold/10">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border-2 border-gold/30">
                        <AvatarImage src={membro.profile.avatar_url || ''} />
                        <AvatarFallback className="bg-gold/20 text-navy">
                          {membro.profile.full_name?.charAt(0) || 'M'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-navy truncate">
                          {membro.profile.full_name || membro.profile.username}
                        </h4>
                        <p className="text-xs text-navy/70 truncate">
                          {membro.funcao?.nome || 'Membro'}
                        </p>
                        {membro.nivel && (
                          <Badge className={`${niveisMap[membro.nivel as keyof typeof niveisMap]?.color} text-xs mt-1`}>
                            {niveisMap[membro.nivel as keyof typeof niveisMap]?.label}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Chat */}
        <TabsContent value="chat" className="space-y-4">
          <Card className="bg-white border-gold/20">
            <CardHeader>
              <CardTitle className="text-navy">Chat da Equipe</CardTitle>
              <CardDescription className="text-navy-light">
                Converse com os membros da sua equipe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Mensagens */}
              <ScrollArea className="h-[400px] p-4 bg-cream/30 rounded-lg border border-gold/10">
                <div className="space-y-4">
                  {mensagens.map((msg) => {
                    const ehMinha = msg.autor_id === profile?.id;
                    
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${ehMinha ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            ehMinha
                              ? 'bg-navy text-cream'
                              : 'bg-white text-navy border border-gold/20'
                          }`}
                        >
                          {!ehMinha && (
                            <p className="text-xs font-semibold mb-1 text-gold">
                              {msg.autor_nome}
                            </p>
                          )}
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {msg.mensagem}
                          </p>
                          <p
                            className={`text-xs mt-1 ${
                              ehMinha ? 'text-cream/70' : 'text-navy/50'
                            }`}
                          >
                            {format(new Date(msg.created_at), "dd/MM 'às' HH:mm", {
                              locale: ptBR,
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  {mensagens.length === 0 && (
                    <p className="text-center text-sm text-navy/50 py-8">
                      Nenhuma mensagem ainda. Seja o primeiro a conversar!
                    </p>
                  )}
                </div>
              </ScrollArea>

              {/* Input de mensagem */}
              <div className="flex gap-2">
                <Textarea
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="bg-white border-gold/20 text-navy resize-none"
                  rows={2}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleEnviarMensagem();
                    }
                  }}
                />
                <Button
                  onClick={handleEnviarMensagem}
                  disabled={!mensagem.trim() || enviandoMsg}
                  className="bg-navy hover:bg-navy/90 text-cream"
                >
                  {enviandoMsg ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Comunicados */}
        <TabsContent value="comunicados" className="space-y-4">
          <Card className="bg-white border-gold/20">
            <CardHeader>
              <CardTitle className="text-navy">Comunicados</CardTitle>
              <CardDescription className="text-navy-light">
                Comunicados enviados pela coordenação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {meusComunicados.map((comunicado) => {
                const tipo = tiposMap[comunicado.tipo as keyof typeof tiposMap];
                const TipoIcon = tipo.icon;
                const lido = comunicado.lido_por?.includes(profile?.id || '');

                return (
                  <Card
                    key={comunicado.id}
                    className={`p-4 ${
                      lido ? 'bg-cream/30' : 'bg-white border-2'
                    } border-gold/20`}
                    onClick={() => !lido && marcarComoLido(comunicado.id)}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <TipoIcon className="w-4 h-4" style={{ color: tipo.color.split(' ')[1] }} />
                          <h4 className="text-sm font-semibold text-navy">
                            {comunicado.titulo}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={tipo.color}>
                            {tipo.label}
                          </Badge>
                          {!lido && (
                            <Badge className="bg-red-500 text-white">Novo</Badge>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-navy/80 whitespace-pre-wrap">
                        {comunicado.mensagem}
                      </p>

                      <div className="flex items-center justify-between text-xs text-navy/60">
                        <span>Por {comunicado.enviado_por_nome}</span>
                        <span>
                          {format(new Date(comunicado.created_at), "dd/MM/yyyy 'às' HH:mm", {
                            locale: ptBR,
                          })}
                        </span>
                      </div>
                    </div>
                  </Card>
                );
              })}

              {meusComunicados.length === 0 && (
                <p className="text-center text-sm text-navy/50 py-8">
                  Nenhum comunicado ainda
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
