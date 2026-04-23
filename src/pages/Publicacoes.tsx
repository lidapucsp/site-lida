import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { FileText, Download, Loader2 } from "lucide-react";
import { usePublicacoes } from "@/hooks/usePublicacoes";

const Publicacoes = () => {
  const [eixo, setEixo] = useState("Todos");
  const [ano, setAno] = useState("Todos");
  const [showCitacao, setShowCitacao] = useState<string | null>(null);

  const { publicacoes, loading, error } = usePublicacoes({ eixo, ano });

  // Extrair eixos e anos únicos dos dados
  const eixosFilter = ["Todos", ...new Set(publicacoes.map((p) => p.eixo_nome).filter(Boolean))];
  const anosFilter = ["Todos", ...new Set(publicacoes.map((p) => String(p.ano)))];

  if (error) {
    return (
      <Layout>
        <section className="section-padding">
          <div className="container mx-auto max-w-3xl text-center">
            <p className="text-red-500">Erro ao carregar publicações: {error.message}</p>
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
          <h1 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground mb-4">Publicações</h1>
          <p className="text-primary-foreground/70 text-lg">Produção intelectual do LIDA: artigos, notas técnicas, relatórios e guias.</p>
        </div>
      </section>

      <section className="section-padding-top-sm">
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
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-gold" />
              </div>
            ) : publicacoes.length === 0 ? (
              <p className="text-center text-muted-foreground py-10">Nenhuma publicação encontrada.</p>
            ) : (
              publicacoes.map((p) => {
                const dataFormatada = new Date(p.data_publicacao).toLocaleDateString('pt-BR', { 
                  year: 'numeric', 
                  month: '2-digit' 
                });
                return (
                  <div key={p.id} className="bg-card rounded-xl border border-border p-6 card-hover">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-4 h-4 text-gold" />
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{p.tipo}</span>
                      <span className="text-xs text-muted-foreground">{dataFormatada}</span>
                    </div>
                    <h2 className="text-lg font-semibold mb-1">{p.titulo}</h2>
                    <p className="text-sm text-muted-foreground mb-2">{p.autores}</p>
                    <p className="text-sm text-muted-foreground mb-4">{p.resumo}</p>
                    <div className="flex flex-wrap gap-2">
                      {p.arquivo_url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={p.arquivo_url} target="_blank" rel="noopener noreferrer">
                            <Download className="w-3 h-3 mr-1" /> Baixar PDF
                          </a>
                        </Button>
                      )}
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
                );
              })
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Publicacoes;
