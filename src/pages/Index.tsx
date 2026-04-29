import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Scale, Brain, BookOpen, Calendar, Users, ArrowRight, FileText, Lightbulb, ShieldCheck, Cpu, Gavel, Database, Zap, Target, Award, Loader2, Instagram } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useEixos } from "@/hooks/useEixos";
import { useEventos } from "@/hooks/useEventos";
import { supabase } from "@/lib/supabase";

const iconMap: Record<string, any> = {
  ShieldCheck,
  Database,
  Gavel,
  Cpu,
  Lightbulb,
  Scale,
};

const Index = () => {
  const { eixos, loading: loadingEixos } = useEixos();
  const { eventos, loading: loadingEventos } = useEventos({ status: 'agendado' });
  const [processoSeletivo, setProcessoSeletivo] = useState<any>(null);
  const [loadingProcesso, setLoadingProcesso] = useState(true);

  useEffect(() => {
    const fetchProcessoAtivo = async () => {
      try {
        const { data, error } = await supabase
          .from('processos_seletivos')
          .select('*')
          .eq('ativo', true)
          .eq('exibir_site', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        setProcessoSeletivo(data);
      } catch (error) {
        console.error('Erro ao buscar processo seletivo:', error);
      } finally {
        setLoadingProcesso(false);
      }
    };

    fetchProcessoAtivo();
  }, []);

  return (
  <Layout>
    {/* Hero */}
    <section className="relative bg-gradient-to-br from-navy via-navy-dark to-navy overflow-hidden min-h-[90vh] flex items-center">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--gold) / 0.4) 2px, transparent 0)`,
          backgroundSize: "60px 60px",
        }} />
        <div className="absolute top-20 left-20 w-96 h-96 bg-gold/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gold/5 rounded-full blur-3xl animate-float animation-delay-500" />
      </div>
      
      {/* Large Logo Watermark with Subtle Shine Animation */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 w-[700px] h-[700px] opacity-[0.08] pointer-events-none animate-fade-in animate-delay-500">
        <div className="w-full h-full relative" style={{
          WebkitMaskImage: 'url(/LIDA-logo.PNG)',
          WebkitMaskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskImage: 'url(/LIDA-logo.PNG)',
          maskSize: 'contain',
          maskRepeat: 'no-repeat',
          maskPosition: 'center'
        }}>
          {/* Subtle navy/cream blend matching background */}
          <div className="absolute inset-0 bg-gradient-to-br from-navy-light/40 via-cream/20 to-navy-light/30" />
          {/* Animated shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cream/40 to-transparent -translate-x-full animate-shine" />
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-extrabold text-primary-foreground leading-[1.1] mb-8 animate-fade-in-up">
            Inteligência Artificial e Direito, 
            <span className="text-gold-gradient block mt-2">na prática com pensamento crítico.</span>
          </h1>
          
          <p className="text-primary-foreground/80 text-lg md:text-2xl leading-relaxed mb-10 max-w-3xl font-light animate-fade-in-up animate-delay-100">
            O LIDA é um núcleo acadêmico dedicado a compreender, analisar e aplicar os impactos da IA no cenário jurídico contemporâneo. Construímos pensamento crítico sobre regulação, proteção de dados e os desafios éticos da transformação digital.
          </p>
          
          <div className="flex flex-wrap gap-4 animate-fade-in-up animate-delay-200">
            <Button variant="hero" size="lg" asChild className="group">
              <a href="https://forms.gle/cLmgoubo87g31oqS6" target="_blank" rel="noopener noreferrer">
                Participar do LIDA
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <Button variant="hero-outline" size="lg" asChild>
              <a href="https://drive.google.com/file/d/1MN7WpRxoYP6SZC_1zZpwbMWrMilSgHqR/view?usp=sharing" target="_blank" rel="noopener noreferrer">Ver Edital</a>
            </Button>
            <Button variant="hero-outline" size="lg" asChild>
              <Link to="/publicacoes">Publicações</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>

    {/* O que é o LIDA */}
    <section className="section-padding bg-white">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-6">O que é o LIDA?</h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            O Laboratório de Inteligência e Direito Aplicado (LIDA) nasce da inquietação diante de uma pergunta central:
            <strong className="text-foreground font-semibold"> o Direito está preparado para a era da Inteligência Artificial?</strong> Através de pesquisa, grupos de estudo, projetos práticos e produção intelectual, buscamos respostas — e novas perguntas.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Brain, title: "Pesquisa Aplicada", text: "Investigamos os impactos reais da IA no Direito com rigor acadêmico e visão prática." },
            { icon: Users, title: "Comunidade Nacional", text: "Aberto a estudantes, pesquisadores e profissionais de todo o Brasil interessados em IA e Direito." },
            { icon: BookOpen, title: "Produção Intelectual", text: "Publicamos artigos, notas técnicas e guias para democratizar o conhecimento." },
          ].map((item, idx) => (
            <div key={item.title} className={`glass rounded-2xl p-8 card-hover group animate-scale-in animate-delay-${idx * 100}`}>
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-navy to-navy-light flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                <item.icon className="w-8 h-8 text-gold" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gradient">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Por que participar */}
    <section className="pt-12 pb-24 bg-cream">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-5xl font-display font-bold text-center mb-6 text-gradient">Por que participar do LIDA?</h2>
        <p className="text-center text-muted-foreground text-lg mb-16 max-w-2xl mx-auto">
          Desenvolva competências essenciais para a era da IA aplicada ao Direito
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: Zap, title: "Desenvolva habilidades práticas de IA", text: "Aprenda a aplicar tecnologias de IA em contextos jurídicos reais", color: "from-navy to-navy-light" },
            { icon: Calendar, title: "Acesse eventos e palestras exclusivas", text: "Participe de seminários e encontros com especialistas da área", color: "from-gold to-gold-dark" },
            { icon: Target, title: "Participe de projetos aplicados", text: "Colabore em pesquisas e iniciativas de impacto prático", color: "from-navy to-navy-light" },
            { icon: BookOpen, title: "Produza conhecimento científico", text: "Publique artigos acadêmicos e contribua para o campo", color: "from-gold to-gold-dark" },
            { icon: Award, title: "Certificado como horas complementares", text: "Obtenha certificado de participação válido como horas complementares em sua instituição", color: "from-navy to-navy-light" },
            { icon: Users, title: "Networking acadêmico e profissional", text: "Conecte-se com pesquisadores, advogados, juristas e profissionais de todo o Brasil", color: "from-gold to-gold-dark" },
          ].map((benefit, idx) => (
            <div key={benefit.title} className={`glass rounded-2xl p-8 card-hover group animate-fade-in-up animate-delay-${idx * 100}`}>
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                <benefit.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-bold text-xl mb-3">{benefit.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{benefit.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Eixos */}
    <section className="section-padding bg-white">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gradient">Eixos Temáticos</h2>
          <Button variant="premium" asChild>
            <Link to="/eixos" className="flex items-center gap-2">
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
        {loadingEixos ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {eixos.slice(0, 4).map((e, idx) => {
              const Icon = iconMap[e.icone] || Scale;
              return (
                <Link 
                  to="/eixos" 
                  key={e.id} 
                  className={`bg-gradient-to-br from-white to-cream rounded-2xl p-7 border border-gold/10 card-hover group shine relative overflow-hidden animate-scale-in animate-delay-${idx * 100}`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl group-hover:bg-gold/10 transition-colors duration-500" />
                  <div className="relative">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold via-gold to-gold-dark flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-gold/20">
                      <Icon className="w-7 h-7 text-navy" />
                    </div>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-gold-dark transition-colors">{e.titulo}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{e.definicao}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>

    {/* Próximos eventos */}
    <section className="section-padding bg-cream">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gradient">Próximos Eventos</h2>
          <Button variant="premium" asChild>
            <Link to="/eventos" className="flex items-center gap-2">
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
        {loadingEventos ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : eventos.length === 0 ? (
          <p className="text-center text-muted-foreground py-10">Nenhum evento agendado no momento.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {eventos.slice(0, 2).map((e, idx) => {
              const dataFormatada = new Date(e.data_evento).toLocaleDateString('pt-BR', { 
                day: '2-digit', 
                month: 'short', 
                year: 'numeric' 
              });
              return (
                <div key={e.id} className={`glass rounded-2xl p-8 card-hover flex items-start gap-6 group animate-scale-in animate-delay-${idx * 200}`}>
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-navy to-navy-light flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-xl">
                    <Calendar className="w-7 h-7 text-gold" />
                  </div>
                  <div className="flex-1">
                    <span className="inline-block text-xs text-gold font-bold px-3 py-1 rounded-full bg-gold/10 mb-3">{e.tipo}</span>
                    <h3 className="font-bold text-lg mb-2 leading-snug group-hover:text-gold-dark transition-colors">{e.titulo}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{dataFormatada}{e.horario && ` · ${e.horario}`}</p>
                    <Button variant="link" size="sm" className="p-0 h-auto text-navy hover:text-gold-dark group/btn" asChild>
                      {e.url_inscricao ? (
                        <a href={e.url_inscricao} target="_blank" rel="noopener noreferrer">
                          Inscrever-se 
                          <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                        </a>
                      ) : (
                        <Link to="/eventos">
                          Ver mais 
                          <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>

    {/* Como participar */}
    <section className="section-padding bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-5xl font-display font-bold text-center mb-6 text-gradient">Como Participar</h2>
        
        {loadingProcesso ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : processoSeletivo ? (
          <>
            <p className="text-center text-muted-foreground text-lg mb-16 max-w-3xl mx-auto">
              O {processoSeletivo.titulo} está <strong className="text-foreground">aberto</strong>! 
              {processoSeletivo.vagas && ` Serão selecionados até ${processoSeletivo.vagas} participantes.`}
            </p>
            
            {processoSeletivo.descricao && (
              <div className="glass rounded-2xl p-8 max-w-4xl mx-auto mb-12">
                <h3 className="font-bold text-2xl mb-6 text-center text-gradient">Sobre o Processo Seletivo</h3>
                <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {processoSeletivo.descricao}
                </div>
              </div>
            )}
            
            {processoSeletivo.inscricao_inicio && processoSeletivo.inscricao_fim && (
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
                <div className="text-center group animate-fade-in-up">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold via-gold to-gold-dark text-navy font-display font-extrabold text-xl flex flex-col items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl shadow-gold/30">
                    <span className="leading-none">{new Date(processoSeletivo.inscricao_inicio).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</span>
                    <span className="text-xs font-normal leading-none mt-1">{new Date(processoSeletivo.inscricao_inicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <h3 className="font-bold text-xl mb-3">Abertura das Inscrições</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {new Date(processoSeletivo.inscricao_inicio).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                
                <div className="text-center group animate-fade-in-up animate-delay-200">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold via-gold to-gold-dark text-navy font-display font-extrabold text-xl flex flex-col items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl shadow-gold/30">
                    <span className="leading-none">{new Date(processoSeletivo.inscricao_fim).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</span>
                    <span className="text-xs font-normal leading-none mt-1">{new Date(processoSeletivo.inscricao_fim).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <h3 className="font-bold text-xl mb-3">Encerramento</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {new Date(processoSeletivo.inscricao_fim).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            )}
            
            <div className="text-center space-y-4">
              {processoSeletivo.inscricao_url && (
                <Button variant="hero" size="lg" asChild className="shadow-2xl shadow-gold/20">
                  <a href={processoSeletivo.inscricao_url} target="_blank" rel="noopener noreferrer" className="group">
                    Inscrever-se Agora
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
              )}
              <div>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/processo-seletivo" className="group">
                    Ver Detalhes Completos
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="max-w-3xl mx-auto text-center py-16">
            <div className="glass rounded-2xl p-12">
              <Users className="w-16 h-16 text-gold mx-auto mb-6" />
              <h3 className="font-bold text-2xl mb-4 text-gradient">Nenhum Processo Seletivo Aberto</h3>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                No momento não há processos seletivos em andamento. Fique atento às nossas redes sociais e ao site para não perder o próximo!
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Enquanto isso, conheça mais sobre o LIDA, nossos eixos de pesquisa e publicações.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button variant="outline" size="lg" asChild>
                  <Link to="/sobre">
                    Sobre o LIDA
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="https://instagram.com/lidapucsp" target="_blank" rel="noopener noreferrer">
                    <Instagram className="w-5 h-5 mr-2" />
                    Seguir no Instagram
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>

    {/* Newsletter */}
    <section className="relative bg-gradient-to-br from-navy via-navy-dark to-navy section-padding overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold rounded-full blur-3xl animate-float animate-delay-500" />
      </div>
      
      <div className="container mx-auto text-center max-w-2xl relative z-10">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4">Fique por dentro</h2>
          <p className="text-primary-foreground/70 text-lg leading-relaxed">Receba editais, eventos e publicações diretamente no seu e-mail. Seja o primeiro a saber.</p>
        </div>
        
        <form className="glass-dark rounded-2xl p-6 flex flex-col sm:flex-row gap-4 shadow-2xl" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Seu melhor e-mail"
            className="flex-1 rounded-xl px-5 py-4 bg-navy-light/50 border-2 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
          />
          <Button variant="hero" size="lg" className="shadow-xl shadow-gold/20">
            Inscrever-se
          </Button>
        </form>
      </div>
    </section>
  </Layout>
  );
};

export default Index;
