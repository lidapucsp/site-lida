import Layout from "@/components/layout/Layout";
import PageHero from "@/components/layout/PageHero";
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
    <PageHero eyebrow="Linhas de pesquisa" title="Eixos Temáticos" subtitle="As grandes áreas de investigação do LIDA, onde pesquisa e prática se encontram." />

    <section className="section-padding bg-cream">
      <div className="container mx-auto max-w-5xl space-y-8 reveal-grid">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : (
          eixos.map((e) => {
            const Icon = iconMap[e.icone] || ShieldCheck;
            return (
              <div key={e.id} className="card-light group reveal md:p-10">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold via-gold to-gold-dark flex items-center justify-center shrink-0 shadow-lg shadow-gold/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                    <Icon className="w-7 h-7 text-navy" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-display font-bold mb-3 text-navy group-hover:text-gold-dark transition-colors">{e.titulo}</h2>
                    <p className="text-muted-foreground mb-4">{e.definicao}</p>
                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-gold-dark mb-3">Exemplos de temas</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {e.temas.map((t) => <li key={t} className="flex gap-2"><span className="text-gold">•</span>{t}</li>)}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-gold-dark mb-3">Tipos de entrega</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {e.entregas.map((en) => <li key={en} className="flex gap-2"><span className="text-gold">•</span>{en}</li>)}
                        </ul>
                      </div>
                    </div>
                    <Button variant="premium" size="sm" asChild>
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
