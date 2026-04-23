import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ExternalLink, Loader2 } from "lucide-react";
import { useEventos } from "@/hooks/useEventos";

const Eventos = () => {
  const { eventos: eventosAgendados, loading: loadingAgendados } = useEventos({ status: 'agendado' });
  const { eventos: eventosRealizados, loading: loadingRealizados } = useEventos({ status: 'realizado' });

  const loading = loadingAgendados || loadingRealizados;

  return (
  <Layout>
    <section className="relative bg-gradient-to-br from-navy via-navy-dark to-navy overflow-hidden hero-padding">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--gold) / 0.4) 2px, transparent 0)`,
          backgroundSize: "60px 60px",
        }} />
        <div className="absolute top-20 left-20 w-96 h-96 bg-gold/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gold/5 rounded-full blur-3xl animate-float animation-delay-500" />
      </div>
      
      <div className="container mx-auto max-w-3xl text-center relative z-10">
        <h1 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground mb-4">Eventos e Atividades</h1>
        <p className="text-primary-foreground/70 text-lg">Seminários, workshops e palestras promovidos pelo LIDA.</p>
      </div>
    </section>

    <section className="section-padding-top-sm">
      <div className="container mx-auto max-w-4xl">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-display font-bold mb-6">Próximos Eventos</h2>
            <div className="space-y-4 mb-16">
              {eventosAgendados.length === 0 ? (
                <p className="text-center text-muted-foreground py-10">Nenhum evento agendado no momento.</p>
              ) : (
                eventosAgendados.map((e) => {
                  const dataFormatada = new Date(e.data_evento).toLocaleDateString('pt-BR', { 
                    day: '2-digit', 
                    month: 'short', 
                    year: 'numeric' 
                  });
                  return (
                    <div key={e.id} className="bg-card rounded-xl border border-border p-6 card-hover">
                      <span className="text-xs font-medium text-gold bg-gold/10 px-2.5 py-1 rounded-full">{e.tipo}</span>
                      <h3 className="text-lg font-semibold mt-3 mb-2">{e.titulo}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{e.descricao}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" /> {dataFormatada}
                          {e.horario && ` · ${e.horario}`}
                        </span>
                        {e.local && (
                          <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {e.local}</span>
                        )}
                      </div>
                      {e.url_inscricao ? (
                        <Button variant="hero" size="sm" asChild>
                          <a href={e.url_inscricao} target="_blank" rel="noopener noreferrer">Inscrever-se</a>
                        </Button>
                      ) : (
                        <Button variant="hero" size="sm">Inscrever-se</Button>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <h2 className="text-2xl font-display font-bold mb-6">Eventos Passados</h2>
            <div className="space-y-4">
              {eventosRealizados.length === 0 ? (
                <p className="text-center text-muted-foreground py-10">Nenhum evento realizado ainda.</p>
              ) : (
                eventosRealizados.map((e) => {
                  const dataFormatada = new Date(e.data_evento).toLocaleDateString('pt-BR', { 
                    month: 'short', 
                    year: 'numeric' 
                  });
                  return (
                    <div key={e.id} className="bg-cream rounded-xl border border-border p-6">
                      <h3 className="font-semibold mb-1">{e.titulo}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{dataFormatada}</p>
                      <p className="text-sm text-muted-foreground mb-3">{e.descricao}</p>
                      {e.possui_materiais && e.url_materiais && (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <a href={e.url_materiais} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-3 h-3 mr-1" /> Acessar Materiais
                            </a>
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
    </section>
  </Layout>
  );
};

export default Eventos;
