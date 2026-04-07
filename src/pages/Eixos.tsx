import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShieldCheck, Database, Gavel, Cpu, Lightbulb, Scale } from "lucide-react";

const eixos = [
  {
    icon: ShieldCheck, title: "Regulação de IA",
    def: "Estudo dos marcos regulatórios nacionais e internacionais que buscam disciplinar o desenvolvimento e uso de sistemas de inteligência artificial.",
    temas: ["AI Act (UE)", "PL 2338/2023 (Brasil)", "Sandboxes regulatórias", "Governança algorítmica"],
    entregas: ["Artigos acadêmicos", "Notas técnicas", "Mapeamentos legislativos", "Eventos temáticos"],
  },
  {
    icon: Database, title: "Proteção de Dados",
    def: "Análise da interseção entre legislação de proteção de dados (LGPD, GDPR) e o uso intensivo de dados por sistemas de IA e machine learning.",
    temas: ["LGPD e IA", "Decisões automatizadas", "Privacy by design", "Transferência internacional de dados"],
    entregas: ["Guias práticos", "Artigos", "Estudos de caso", "Workshops"],
  },
  {
    icon: Gavel, title: "Responsabilidade Civil e IA",
    def: "Investigação sobre regimes de responsabilidade aplicáveis a danos causados por sistemas autônomos e semiautônomos.",
    temas: ["Responsabilidade objetiva vs. subjetiva", "Veículos autônomos", "Robótica", "Nexo causal em IA"],
    entregas: ["Artigos", "Seminários", "Relatórios comparativos"],
  },
  {
    icon: Cpu, title: "IA no Poder Judiciário",
    def: "Estudo sobre a adoção de ferramentas de IA por tribunais e órgãos do sistema de justiça.",
    temas: ["Justiça preditiva", "Sistemas de apoio à decisão", "Devido processo", "SINAPSES e Victor"],
    entregas: ["Pesquisas empíricas", "Notas técnicas", "Eventos com magistrados"],
  },
  {
    icon: Lightbulb, title: "Ética e Viés Algorítmico",
    def: "Reflexão sobre os desafios éticos da IA, com foco em discriminação algorítmica, equidade e transparência.",
    temas: ["Viés racial e de gênero", "Explicabilidade (XAI)", "Auditoria de algoritmos", "IA e direitos fundamentais"],
    entregas: ["Artigos", "Relatórios", "Guias de boas práticas", "Eventos"],
  },
  {
    icon: Scale, title: "Propriedade Intelectual e IA",
    def: "Análise dos desafios que a IA traz para o direito autoral, patentes e criações geradas por máquinas.",
    temas: ["Obras geradas por IA", "Copyright e treinamento de modelos", "Patentes de algoritmos", "Fair use"],
    entregas: ["Artigos acadêmicos", "Notas técnicas", "Eventos interdisciplinares"],
  },
];

const Eixos = () => (
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
        <h1 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground mb-4">Eixos Temáticos</h1>
        <p className="text-primary-foreground/70 text-lg">As grandes áreas de investigação do LIDA, onde pesquisa e prática se encontram.</p>
      </div>
    </section>

    <section className="section-padding">
      <div className="container mx-auto max-w-5xl space-y-8">
        {eixos.map((e) => (
          <div key={e.title} className="bg-card rounded-xl border border-border p-6 md:p-8 card-hover">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                <e.icon className="w-6 h-6 text-gold-dark" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-display font-bold mb-2">{e.title}</h2>
                <p className="text-muted-foreground mb-4">{e.def}</p>
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
        ))}
      </div>
    </section>
  </Layout>
);

export default Eixos;
