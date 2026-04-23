import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShieldCheck, Database, Gavel, Cpu, Lightbulb, Scale, Loader2 } from "lucide-react";
import { useEixos } from "@/hooks/useEixos";
import type { LucideIcon } from "lucide-react";

// Mapeamento de ícones por nome
const iconMap: Record<string, LucideIcon> = {
  ShieldCheck,
  Database,
  Gavel,
  Cpu,
  Lightbulb,
  Scale,
};

const Eixos = () => {
  const { eixos, loading, error } = useEixos();

  if (error) {
    return (
      <Layout>
        <section className="section-padding">
          <div className="container mx-auto max-w-3xl text-center">
            <p className="text-red-500">Erro ao carregar eixos: {error.message}</p>
          </div>
        </section>
      </Layout>
    );
  }

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
        <h1 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground mb-4">Eixos Temáticos</h1>
        <p className="text-primary-foreground/70 text-lg">As grandes áreas de investigação do LIDA, onde pesquisa e prática se encontram.</p>
      </div>
    </section>

    <section className="section-padding-top-sm">
      <div className="container mx-auto max-w-5xl space-y-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : (
          eixos.map((e) => {
            const Icon = iconMap[e.icone] || ShieldCheck;
            return (
              <div key={e.id} className="bg-card rounded-xl border border-border p-6 md:p-8 card-hover">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-gold-dark" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-display font-bold mb-2">{e.titulo}</h2>
                    <p className="text-muted-foreground mb-4">{e.definicao}</p>
                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Exemplos de temas</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {e.temas.map((t) => <li key={t} className="flex gap-2"><span className="text-gold">•</span>{t}</li>)}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Tipos de entrega</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {e.entregas.map((en) => <li key={en} className="flex gap-2"><span className="text-gold">•</span>{en}</li>)}
                        </ul>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/processo-seletivo">Quero atuar neste eixo</Link>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  </Layout>
  );
};

export default Eixos;
