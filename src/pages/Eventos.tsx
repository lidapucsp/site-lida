import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ExternalLink } from "lucide-react";

const proximos = [
  { title: "Seminário: IA Generativa e Direitos Autorais", data: "15 Mai 2026", horario: "14h–17h", local: "Auditório 300 — PUC-SP", desc: "Mesa redonda com especialistas em propriedade intelectual e tecnologia sobre os desafios das obras criadas por IA generativa.", tipo: "Seminário" },
  { title: "Workshop: Prompt Engineering para Juristas", data: "28 Mai 2026", horario: "10h–12h", local: "Laboratório de Informática — PUC-SP", desc: "Oficina prática sobre técnicas de prompt engineering aplicadas à pesquisa jurídica e à elaboração de peças.", tipo: "Workshop" },
  { title: "Palestra: LGPD na Era dos Dados Sintéticos", data: "10 Jun 2026", horario: "19h–21h", local: "Online (Zoom)", desc: "Palestra aberta sobre as implicações da LGPD para o uso de dados sintéticos no treinamento de modelos de IA.", tipo: "Palestra" },
];

const passados = [
  { title: "I Congresso LIDA de Direito e IA", data: "Nov 2025", desc: "Primeiro congresso do LIDA com 200 participantes, 12 palestrantes e 3 mesas redondas sobre regulação, ética e aplicação de IA no Direito.", materiais: true },
  { title: "Workshop: Introdução ao Machine Learning para Juristas", data: "Set 2025", desc: "Oficina introdutória com conceitos básicos de ML aplicados ao contexto jurídico.", materiais: true },
  { title: "Seminário: IA e o Futuro dos Tribunais", data: "Ago 2025", desc: "Evento com participação de magistrados e pesquisadores sobre a adoção de IA pelo poder judiciário brasileiro.", materiais: true },
];

const Eventos = () => (
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
        <h1 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground mb-4">Eventos e Atividades</h1>
        <p className="text-primary-foreground/70 text-lg">Seminários, workshops e palestras promovidos pelo LIDA.</p>
      </div>
    </section>

    <section className="section-padding">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-2xl font-display font-bold mb-6">Próximos Eventos</h2>
        <div className="space-y-4 mb-16">
          {proximos.map((e) => (
            <div key={e.title} className="bg-card rounded-xl border border-border p-6 card-hover">
              <span className="text-xs font-medium text-gold bg-gold/10 px-2.5 py-1 rounded-full">{e.tipo}</span>
              <h3 className="text-lg font-semibold mt-3 mb-2">{e.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{e.desc}</p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {e.data} · {e.horario}</span>
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {e.local}</span>
              </div>
              <Button variant="hero" size="sm">Inscrever-se</Button>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-display font-bold mb-6">Eventos Passados</h2>
        <div className="space-y-4">
          {passados.map((e) => (
            <div key={e.title} className="bg-cream rounded-xl border border-border p-6">
              <h3 className="font-semibold mb-1">{e.title}</h3>
              <p className="text-xs text-muted-foreground mb-2">{e.data}</p>
              <p className="text-sm text-muted-foreground mb-3">{e.desc}</p>
              {e.materiais && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm"><ExternalLink className="w-3 h-3 mr-1" /> Slides</Button>
                  <Button variant="outline" size="sm"><ExternalLink className="w-3 h-3 mr-1" /> Gravação</Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default Eventos;
