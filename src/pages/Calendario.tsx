import Layout from "@/components/layout/Layout";
import PageHero from "@/components/layout/PageHero";
import { Calendar as CalIcon, Loader2 } from "lucide-react";
import { useCalendario } from "@/hooks/useCalendario";
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const tipoColor: Record<string, string> = {
  Reunião: "bg-navy/10 text-navy",
  Estudo: "bg-purple-100 text-purple-800",
  Prazo: "bg-red-100 text-red-800",
  Evento: "bg-gold/15 text-gold-dark",
  Seletivo: "bg-blue-100 text-blue-800",
};

const Calendario = () => {
  const { eventos, loading, error } = useCalendario();

  // Agrupar eventos por mês
  const eventosPorMes = eventos.reduce((acc, evento) => {
    const data = parseISO(evento.data);
    const mesAno = format(data, "MMMM 'de' yyyy", { locale: ptBR });
    const mesAnoCapitalizado = mesAno.charAt(0).toUpperCase() + mesAno.slice(1);
    
    if (!acc[mesAnoCapitalizado]) {
      acc[mesAnoCapitalizado] = [];
    }
    
    acc[mesAnoCapitalizado].push({
      ...evento,
      dia: format(data, "dd"),
    });
    
    return acc;
  }, {} as Record<string, Array<typeof eventos[0] & { dia: string }>>);

  return (
    <Layout>
      <PageHero eyebrow="Agenda" title="Calendário" subtitle="Atividades, prazos e eventos do LIDA." />

      <section className="section-padding bg-cream">
        <div className="container mx-auto max-w-3xl space-y-10">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-gold" />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600">Erro ao carregar eventos do calendário.</p>
            </div>
          ) : Object.keys(eventosPorMes).length === 0 ? (
            <div className="bg-white rounded-2xl border border-navy/10 p-12 text-center">
              <CalIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-30" />
              <p className="text-muted-foreground">Nenhum evento agendado no momento.</p>
            </div>
          ) : (
            Object.entries(eventosPorMes).map(([mes, eventosDoMes]) => (
              <div key={mes} className="reveal">
                <h2 className="text-lg font-display font-bold uppercase tracking-[0.12em] mb-5 flex items-center gap-3 text-navy">
                  <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-navy to-navy-light flex items-center justify-center"><CalIcon className="w-4 h-4 text-gold" /></span> {mes}
                </h2>
                <div className="space-y-3">
                  {eventosDoMes.map((e) => (
                    <div key={e.id} className="group bg-white rounded-xl border border-navy/10 p-4 flex items-center gap-4 hover:border-gold/60 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                      <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center font-display font-bold text-navy group-hover:bg-gold transition-colors duration-300">{e.dia}</div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{e.titulo}</p>
                        {e.descricao && (
                          <p className="text-xs text-muted-foreground mt-1">{e.descricao}</p>
                        )}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${tipoColor[e.tipo] || "bg-muted text-muted-foreground"}`}>{e.tipo}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}

          <div className="bg-white rounded-2xl border border-navy/10 p-8 text-center reveal">
            <h3 className="font-display font-bold text-lg mb-2 text-navy">Google Calendar</h3>
            <p className="text-sm text-muted-foreground mb-4">Adicione o calendário do LIDA ao seu Google Calendar para não perder nenhum evento.</p>
            <div className="bg-muted rounded-lg h-48 flex items-center justify-center text-sm text-muted-foreground">
              [Embed Google Calendar — placeholder]
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Calendario;
