import Layout from "@/components/layout/Layout";
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
          <h1 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground mb-4">Calendário</h1>
          <p className="text-primary-foreground/70 text-lg">Atividades, prazos e eventos do LIDA.</p>
        </div>
      </section>

      <section className="section-padding-top-sm">
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
            <div className="bg-cream rounded-xl border border-border p-12 text-center">
              <CalIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-30" />
              <p className="text-muted-foreground">Nenhum evento agendado no momento.</p>
            </div>
          ) : (
            Object.entries(eventosPorMes).map(([mes, eventosDoMes]) => (
              <div key={mes}>
                <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
                  <CalIcon className="w-5 h-5 text-gold" /> {mes}
                </h2>
                <div className="space-y-2">
                  {eventosDoMes.map((e) => (
                    <div key={e.id} className="bg-card rounded-lg border border-border p-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center font-bold text-sm">{e.dia}</div>
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

          <div className="bg-cream rounded-xl border border-border p-6 text-center">
            <h3 className="font-semibold mb-2">Google Calendar</h3>
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
