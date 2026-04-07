import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";

const pubs = [
  { id: 1, title: "Inteligência Artificial e o Futuro da Advocacia", autores: "Maria Santos, João Silva", data: "2026-03", ano: 2026, eixo: "Regulação de IA", tipo: "Artigo", resumo: "Análise das transformações que a IA generativa traz para a prática jurídica e os novos papéis do advogado.", citacao: 'SANTOS, M.; SILVA, J. Inteligência Artificial e o Futuro da Advocacia. LIDA/PUC-SP, 2026.' },
  { id: 2, title: "Regulação de IA: Lições da União Europeia para o Brasil", autores: "Ana Costa, Pedro Lima", data: "2026-02", ano: 2026, eixo: "Regulação de IA", tipo: "Artigo", resumo: "Estudo comparado entre o AI Act europeu e os projetos de lei brasileiros sobre inteligência artificial.", citacao: 'COSTA, A.; LIMA, P. Regulação de IA: Lições da UE para o Brasil. LIDA/PUC-SP, 2026.' },
  { id: 3, title: "LGPD e Machine Learning: Desafios Práticos", autores: "Lucas Oliveira", data: "2026-01", ano: 2026, eixo: "Proteção de Dados", tipo: "Nota Técnica", resumo: "Mapeamento dos principais desafios de conformidade com a LGPD em projetos de machine learning.", citacao: 'OLIVEIRA, L. LGPD e Machine Learning: Desafios Práticos. LIDA/PUC-SP, 2026.' },
  { id: 4, title: "Viés Algorítmico em Decisões Judiciais: Um Estudo Empírico", autores: "Pedro Lima, Carla Mendes", data: "2025-11", ano: 2025, eixo: "Ética e Viés", tipo: "Relatório", resumo: "Pesquisa empírica que identificou padrões de viés racial em sistema de predição de reincidência utilizado por tribunal estadual.", citacao: 'LIMA, P.; MENDES, C. Viés Algorítmico em Decisões Judiciais. LIDA/PUC-SP, 2025.' },
  { id: 5, title: "Guia LGPD para Startups de IA", autores: "Lucas Oliveira, Beatriz Faria", data: "2025-10", ano: 2025, eixo: "Proteção de Dados", tipo: "Guia", resumo: "Manual prático com checklist e fluxogramas para startups que desenvolvem produtos baseados em inteligência artificial.", citacao: 'OLIVEIRA, L.; FARIA, B. Guia LGPD para Startups de IA. LIDA/PUC-SP, 2025.' },
  { id: 6, title: "Responsabilidade Civil por Veículos Autônomos no Brasil", autores: "Pedro Lima, Roberto Ferreira", data: "2025-09", ano: 2025, eixo: "Responsabilidade Civil", tipo: "Artigo", resumo: "Proposta de framework jurídico para alocação de responsabilidade em acidentes envolvendo veículos autônomos.", citacao: 'LIMA, P.; FERREIRA, R. Responsabilidade Civil por Veículos Autônomos. LIDA/PUC-SP, 2025.' },
  { id: 7, title: "IA no Judiciário Brasileiro: Panorama 2025", autores: "Maria Santos, Carla Mendes, João Silva", data: "2025-08", ano: 2025, eixo: "IA no Judiciário", tipo: "Relatório", resumo: "Levantamento completo das ferramentas de IA adotadas por tribunais brasileiros até agosto de 2025.", citacao: 'SANTOS, M.; MENDES, C.; SILVA, J. IA no Judiciário Brasileiro. LIDA/PUC-SP, 2025.' },
  { id: 8, title: "Direito Autoral e IA Generativa: Quem é o Autor?", autores: "Ana Costa", data: "2025-07", ano: 2025, eixo: "Propriedade Intelectual", tipo: "Artigo", resumo: "Reflexão sobre a titularidade de obras criadas por sistemas de IA generativa à luz do direito brasileiro.", citacao: 'COSTA, A. Direito Autoral e IA Generativa. LIDA/PUC-SP, 2025.' },
  { id: 9, title: "Transparência Algorítmica: Princípios e Práticas", autores: "Carla Mendes", data: "2025-06", ano: 2025, eixo: "Ética e Viés", tipo: "Nota Técnica", resumo: "Compilação de princípios de transparência algorítmica e práticas de explicabilidade (XAI) aplicáveis ao setor público.", citacao: 'MENDES, C. Transparência Algorítmica. LIDA/PUC-SP, 2025.' },
  { id: 10, title: "Sandboxes Regulatórias para IA: Modelos Internacionais", autores: "Roberto Ferreira, Ana Costa", data: "2025-05", ano: 2025, eixo: "Regulação de IA", tipo: "Resumo", resumo: "Análise comparativa de sandboxes regulatórias para inteligência artificial implementadas em 8 países.", citacao: 'FERREIRA, R.; COSTA, A. Sandboxes Regulatórias para IA. LIDA/PUC-SP, 2025.' },
];

const eixosFilter = ["Todos", ...new Set(pubs.map((p) => p.eixo))];
const anosFilter = ["Todos", ...new Set(pubs.map((p) => String(p.ano)))];

const Publicacoes = () => {
  const [eixo, setEixo] = useState("Todos");
  const [ano, setAno] = useState("Todos");
  const [showCitacao, setShowCitacao] = useState<number | null>(null);

  const filtered = pubs.filter(
    (p) => (eixo === "Todos" || p.eixo === eixo) && (ano === "Todos" || String(p.ano) === ano)
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
          <h1 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground mb-4">Publicações</h1>
          <p className="text-primary-foreground/70 text-lg">Produção intelectual do LIDA: artigos, notas técnicas, relatórios e guias.</p>
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
              <label className="text-sm font-medium mb-1 block">Ano</label>
              <select value={ano} onChange={(e) => setAno(e.target.value)} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                {anosFilter.map((a) => <option key={a}>{a}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filtered.map((p) => (
              <div key={p.id} className="bg-card rounded-xl border border-border p-6 card-hover">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-gold" />
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{p.tipo}</span>
                  <span className="text-xs text-muted-foreground">{p.data}</span>
                </div>
                <h2 className="text-lg font-semibold mb-1">{p.title}</h2>
                <p className="text-sm text-muted-foreground mb-2">{p.autores}</p>
                <p className="text-sm text-muted-foreground mb-4">{p.resumo}</p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm"><Download className="w-3 h-3 mr-1" /> Baixar PDF</Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowCitacao(showCitacao === p.id ? null : p.id)}>
                    Citação sugerida
                  </Button>
                </div>
                {showCitacao === p.id && (
                  <div className="mt-3 p-3 bg-muted rounded-md text-xs text-muted-foreground font-mono">
                    {p.citacao}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Publicacoes;
