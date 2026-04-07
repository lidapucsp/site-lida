import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

const projetos = [
  { id: 1, title: "Mapeamento da Regulação de IA no Brasil", eixo: "Regulação de IA", status: "Em andamento", ano: 2026, resumo: "Levantamento e análise sistemática de todos os projetos de lei relacionados à inteligência artificial em tramitação no Congresso Nacional.", objetivos: "Criar um banco de dados público com análise comparativa dos projetos legislativos.", equipe: "Maria Santos, João Silva, Ana Costa", entregaveis: "Relatório final, banco de dados, artigo acadêmico" },
  { id: 2, title: "Análise de Viés em Sistemas de Justiça Preditiva", eixo: "Ética e Viés", status: "Em andamento", ano: 2026, resumo: "Investigação empírica sobre a presença de viés algorítmico em ferramentas de IA utilizadas por tribunais brasileiros.", objetivos: "Identificar padrões de discriminação e propor diretrizes de auditoria.", equipe: "Pedro Lima, Lucas Oliveira, Carla Mendes", entregaveis: "Relatório técnico, guia de auditoria, artigo" },
  { id: 3, title: "Guia Prático de LGPD para Startups de IA", eixo: "Proteção de Dados", status: "Concluído", ano: 2025, resumo: "Elaboração de um guia acessível para startups que desenvolvem produtos baseados em IA, com foco em conformidade com a LGPD.", objetivos: "Democratizar o conhecimento sobre proteção de dados no ecossistema de inovação.", equipe: "Lucas Oliveira, Beatriz Faria", entregaveis: "Guia em PDF, infográficos, webinar" },
  { id: 4, title: "IA Generativa e Direitos Autorais: Estudo Comparado", eixo: "Propriedade Intelectual", status: "Em andamento", ano: 2026, resumo: "Análise comparada das abordagens regulatórias de diferentes países sobre obras geradas por inteligência artificial generativa.", objetivos: "Mapear tendências internacionais e propor recomendações para o contexto brasileiro.", equipe: "Ana Costa, Roberto Ferreira", entregaveis: "Artigo acadêmico, nota técnica" },
  { id: 5, title: "Observatório de IA no Judiciário", eixo: "IA no Judiciário", status: "Em andamento", ano: 2025, resumo: "Acompanhamento contínuo da adoção de ferramentas de IA por tribunais brasileiros, com foco em transparência e devido processo.", objetivos: "Criar um repositório público de casos e análises sobre IA no poder judiciário.", equipe: "Maria Santos, Carla Mendes, João Silva", entregaveis: "Dashboard, relatórios trimestrais, artigos" },
  { id: 6, title: "Responsabilidade Civil por Veículos Autônomos", eixo: "Responsabilidade Civil", status: "Concluído", ano: 2025, resumo: "Estudo sobre os regimes de responsabilidade aplicáveis a acidentes envolvendo veículos autônomos no direito brasileiro.", objetivos: "Propor framework jurídico para alocação de responsabilidade.", equipe: "Pedro Lima, Roberto Ferreira", entregaveis: "Artigo publicado, apresentação em congresso" },
];

const eixosFilter = ["Todos", ...new Set(projetos.map((p) => p.eixo))];
const statusFilter = ["Todos", "Em andamento", "Concluído"];

const Projetos = () => {
  const [eixo, setEixo] = useState("Todos");
  const [status, setStatus] = useState("Todos");

  const filtered = projetos.filter(
    (p) => (eixo === "Todos" || p.eixo === eixo) && (status === "Todos" || p.status === status)
  );

  return (
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
          <h1 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground mb-4">Projetos e Iniciativas</h1>
          <p className="text-primary-foreground/70 text-lg">Conheça as pesquisas e iniciativas em andamento e concluídas pelo LIDA.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-wrap gap-4 mb-8">
            <div>
              <label className="text-sm font-medium mb-1 block">Eixo</label>
              <select value={eixo} onChange={(e) => setEixo(e.target.value)} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                {eixosFilter.map((e) => <option key={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                {statusFilter.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-6">
            {filtered.map((p) => (
              <div key={p.id} className="bg-card rounded-xl border border-border p-6 card-hover">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${p.status === "Em andamento" ? "bg-gold/15 text-gold-dark" : "bg-muted text-muted-foreground"}`}>{p.status}</span>
                  <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">{p.eixo}</span>
                  <span className="text-xs text-muted-foreground">{p.ano}</span>
                </div>
                <h2 className="text-lg font-semibold mb-2">{p.title}</h2>
                <p className="text-muted-foreground text-sm mb-3">{p.resumo}</p>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div><span className="font-medium">Objetivos:</span> <span className="text-muted-foreground">{p.objetivos}</span></div>
                  <div><span className="font-medium">Equipe:</span> <span className="text-muted-foreground">{p.equipe}</span></div>
                  <div className="sm:col-span-2"><span className="font-medium">Entregáveis:</span> <span className="text-muted-foreground">{p.entregaveis}</span></div>
                </div>
                <Button variant="link" size="sm" className="p-0 h-auto mt-3">Ver detalhes →</Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Projetos;
