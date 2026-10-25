import Layout from "@/components/layout/Layout";
import PageHero from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ExternalLink, Loader2 } from "lucide-react";
import { useEventos } from "@/hooks/useEventos";

const Eventos = () => {
  const { eventos: eventosAgendados, loading: loadingAgendados } = useEventos({ status: 'agendado' });
  const { eventos: eventosRealizados, loading: loadingRealizados } = useEventos({ status: 'realizado' });

  const loading = loadingAgendados || loadingRealizados;

  return (
  <Layout>
    <PageHero eyebrow="Agenda" title="Eventos e Atividades" subtitle="Seminários, workshops e palestras promovidos pelo LIDA." />

    <section className="section-padding bg-cream">
      <div className="container mx-auto max-w-4xl">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : (
          <>
            <div className="mb-10 reveal">
              <span className="eyebrow eyebrow-light mb-4">Agenda</span>
              <h2 className="section-title text-navy">Próximos Eventos</h2>
            </div>
            <div className="space-y-5 mb-24 reveal-grid">
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
                    <div key={e.id} className="card-light group reveal">
                      <span className="text-xs font-bold text-gold-dark bg-gold/10 px-2.5 py-1 rounded-full">{e.tipo}</span>
                      <h3 className="text-xl font-display font-bold mt-3 mb-2 text-navy group-hover:text-gold-dark transition-colors">{e.titulo}</h3>
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
                        <Button variant="hero" size="sm" asChild className="btn-sweep">
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

            <div className="mb-10 reveal">
              <span className="eyebrow eyebrow-light mb-4">Histórico</span>
              <h2 className="section-title text-navy">Eventos Passados</h2>
            </div>
            <div className="space-y-4 reveal-grid">
              {eventosRealizados.length === 0 ? (
                <p className="text-center text-muted-foreground py-10">Nenhum evento realizado ainda.</p>
              ) : (
                eventosRealizados.map((e) => {
                  const dataFormatada = new Date(e.data_evento).toLocaleDateString('pt-BR', { 
                    month: 'short', 
                    year: 'numeric' 
                  });
                  return (
                    <div key={e.id} className="reveal bg-white rounded-2xl border border-navy/10 p-6 hover:border-gold/50 hover:shadow-lg transition-all duration-300">
                      <h3 className="font-bold mb-1 text-navy">{e.titulo}</h3>
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
