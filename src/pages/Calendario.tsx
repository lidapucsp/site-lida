import Layout from "@/components/layout/Layout";
import { Calendar as CalIcon } from "lucide-react";

const meses = [
  { mes: "Março 2026", eventos: [
    { dia: "23", titulo: "Início do processo seletivo 2026.1", tipo: "Seletivo" },
    { dia: "27", titulo: "Fim do processo seletivo 2026.1", tipo: "Seletivo" },
    { dia: "30", titulo: "Resultado do processo seletivo 2026.1", tipo: "Seletivo" },
  ]},
  { mes: "Abril 2026", eventos: [
    { dia: "04", titulo: "Primeira Reunião", tipo: "Reunião" },
    { dia: "25", titulo: "Segunda Reunião", tipo: "Reunião" },
  ]},
  { mes: "Maio 2026", eventos: [
    { dia: "02", titulo: "Terceira Reunião", tipo: "Reunião" },
    { dia: "16", titulo: "Quarta Reunião", tipo: "Reunião" },
  ]},
  { mes: "Junho 2026", eventos: [
    { dia: "06", titulo: "Quinta Reunião", tipo: "Reunião" },
    { dia: "27", titulo: "Última Reunião", tipo: "Reunião" },
  ]},
];

const tipoColor: Record<string, string> = {
  Reunião: "bg-navy/10 text-navy",
  Estudo: "bg-secondary/50 text-secondary-foreground",
  Prazo: "bg-destructive/10 text-destructive",
  Evento: "bg-gold/15 text-gold-dark",
  Seletivo: "bg-gold/15 text-gold-dark",
};

const Calendario = () => (
  <Layout>
    <section className="relative bg-gradient-to-br from-navy via-navy-dark to-navy overflow-hidden section-padding">
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

    <section className="section-padding">
      <div className="container mx-auto max-w-3xl space-y-10">
        {meses.map((m) => (
          <div key={m.mes}>
            <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
              <CalIcon className="w-5 h-5 text-gold" /> {m.mes}
            </h2>
            <div className="space-y-2">
              {m.eventos.map((e, i) => (
                <div key={i} className="bg-card rounded-lg border border-border p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center font-bold text-sm">{e.dia}</div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{e.titulo}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${tipoColor[e.tipo] || "bg-muted text-muted-foreground"}`}>{e.tipo}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

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

export default Calendario;
