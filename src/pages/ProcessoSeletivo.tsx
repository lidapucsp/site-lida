import Layout from "@/components/layout/Layout";
import PageHero from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle, HelpCircle, Loader2, Award } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface ProcessoSeletivo {
  id: string;
  titulo: string;
  periodo: string;
  descricao: string | null;
  edital_url: string | null;
  edital_descricao: string | null;
  inscricao_url: string | null;
  inscricao_inicio: string | null;
  inscricao_fim: string | null;
  vagas: number | null;
  ativo: boolean;
  exibir_site: boolean;
}

interface FAQ {
  id: string;
  pergunta: string;
  resposta: string;
  ordem: number;
}

interface Requisito {
  id: string;
  titulo: string;
  descricao: string | null;
  ordem: number;
}

interface Compromisso {
  id: string;
  descricao: string;
  ordem: number;
}

interface Cronograma {
  id: string;
  etapa: string;
  descricao: string | null;
  ordem: number;
}

interface Info {
  id: string;
  texto: string;
  ordem: number;
}

interface ResultadoAnterior {
  id: string;
  titulo: string;
  url: string | null;
  ordem: number;
}

interface Aprovado {
  id: string;
  nome: string;
  instituicao: string | null;
  ordem: number;
}

const ProcessoSeletivo = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [processo, setProcesso] = useState<ProcessoSeletivo | null>(null);
  const [processosAnteriores, setProcessosAnteriores] = useState<ProcessoSeletivo[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [requisitos, setRequisitos] = useState<Requisito[]>([]);
  const [compromissos, setCompromissos] = useState<Compromisso[]>([]);
  const [cronograma, setCronograma] = useState<Cronograma[]>([]);
  const [infos, setInfos] = useState<Info[]>([]);
  const [resultadosAnteriores, setResultadosAnteriores] = useState<ResultadoAnterior[]>([]);
  const [aprovados, setAprovados] = useState<Aprovado[]>([]);
  const [aprovadosDialogOpen, setAprovadosDialogOpen] = useState(false);
  const [aprovadosProcessoAnterior, setAprovadosProcessoAnterior] = useState<Aprovado[]>([]);
  const [processoAnteriorSelecionado, setProcessoAnteriorSelecionado] = useState<string>("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Buscar processo ativo
      const { data: processoData, error: processoError } = await supabase
        .from('processos_seletivos')
        .select('*')
        .eq('ativo', true)
        .eq('exibir_site', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (processoError && processoError.code !== 'PGRST116') {
        throw processoError;
      }

      if (processoData) {
        setProcesso(processoData);

        // Buscar dados relacionados do processo ativo
        const [faqsRes, reqsRes, compsRes, cronoRes, infosRes, resAntsRes, aprovsRes] = await Promise.all([
          supabase.from('processo_seletivo_faqs').select('*').eq('processo_id', processoData.id).order('ordem'),
          supabase.from('processo_seletivo_requisitos').select('*').eq('processo_id', processoData.id).order('ordem'),
          supabase.from('processo_seletivo_compromissos').select('*').eq('processo_id', processoData.id).order('ordem'),
          supabase.from('processo_seletivo_cronograma').select('*').eq('processo_id', processoData.id).order('ordem'),
          supabase.from('processo_seletivo_infos').select('*').eq('processo_id', processoData.id).order('ordem'),
          supabase.from('processo_seletivo_resultados_anteriores').select('*').eq('processo_id', processoData.id).order('ordem'),
          supabase.from('processo_seletivo_aprovados').select('*').eq('processo_id', processoData.id).order('ordem'),
        ]);

        if (faqsRes.data) setFaqs(faqsRes.data);
        if (reqsRes.data) setRequisitos(reqsRes.data);
        if (compsRes.data) setCompromissos(compsRes.data);
        if (cronoRes.data) setCronograma(cronoRes.data);
        if (infosRes.data) setInfos(infosRes.data);
        if (resAntsRes.data) setResultadosAnteriores(resAntsRes.data);
        if (aprovsRes.data) setAprovados(aprovsRes.data);
      } else {
        // Se não houver processo ativo, buscar processos anteriores (inativos)
        const { data: processosData, error: processosError } = await supabase
          .from('processos_seletivos')
          .select('*')
          .eq('ativo', false)
          .eq('exibir_site', true)
          .order('created_at', { ascending: false });

        if (processosError) throw processosError;
        setProcessosAnteriores(processosData || []);
      }
    } catch (error) {
      console.error('Erro ao buscar processo seletivo:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAprovadosProcessoAnterior = async (processoId: string, titulo: string) => {
    try {
      const { data, error } = await supabase
        .from('processo_seletivo_aprovados')
        .select('*')
        .eq('processo_id', processoId)
        .order('ordem');

      if (error) throw error;
      
      setAprovadosProcessoAnterior(data || []);
      setProcessoAnteriorSelecionado(titulo);
      setAprovadosDialogOpen(true);
    } catch (error) {
      console.error('Erro ao buscar aprovados:', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </Layout>
    );
  }

  if (!processo && processosAnteriores.length === 0) {
    return (
      <Layout>
        <PageHero eyebrow="Seletivo" title="Processo Seletivo" subtitle="Nenhum processo seletivo ativo no momento. Fique atento às nossas redes sociais!" />
      </Layout>
    );
  }

  // Se houver apenas processos anteriores
  if (!processo && processosAnteriores.length > 0) {
    return (
      <Layout>
        <PageHero eyebrow="Seletivo" title="Processo Seletivo" subtitle="Confira os processos seletivos anteriores do LIDA" />

        <section className="section-padding bg-cream">
          <div className="container mx-auto max-w-3xl">
            <p className="text-muted-foreground text-center mb-8">
              Não há processo seletivo ativo no momento. Confira os processos anteriores:
            </p>
            
            <div className="space-y-5 reveal-grid">
              {processosAnteriores.map((proc) => (
                <div key={proc.id} className="card-light group reveal">
                  <div className="flex flex-col gap-4">
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-xl mb-1 text-navy group-hover:text-gold-dark transition-colors">{proc.titulo}</h3>
                      <p className="text-sm text-muted-foreground mb-3">Período: {proc.periodo}</p>
                      {proc.descricao && (
                        <p className="text-sm text-muted-foreground mb-4">{proc.descricao}</p>
                      )}
                      {proc.vagas && (
                        <p className="text-sm text-muted-foreground">Vagas oferecidas: {proc.vagas}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {proc.edital_url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={proc.edital_url} target="_blank" rel="noopener noreferrer">
                            Ver Edital
                          </a>
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => fetchAprovadosProcessoAnterior(proc.id, proc.titulo)}
                      >
                        <Award className="w-4 h-4 mr-1" />
                        Ver Aprovados
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Dialog open={aprovadosDialogOpen} onOpenChange={setAprovadosDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-gold" />
                Aprovados - {processoAnteriorSelecionado}
              </DialogTitle>
            </DialogHeader>
            {aprovadosProcessoAnterior.length > 0 ? (
              <div className="bg-navy/5 rounded-xl p-6">
                <ul className="grid gap-3 sm:grid-cols-2">
                  {aprovadosProcessoAnterior.map((aprovado) => (
                    <li key={aprovado.id} className="flex flex-col gap-1">
                      <span className="font-medium">{aprovado.nome}</span>
                      {aprovado.instituicao && (
                        <span className="text-sm text-muted-foreground">{aprovado.instituicao}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Nenhum aprovado cadastrado para este processo.
              </p>
            )}
          </DialogContent>
        </Dialog>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHero eyebrow="Seletivo" title="Processo Seletivo" subtitle="Faça parte do LIDA! Confira o edital e inscreva-se." />

      <section className="section-padding bg-cream">
        <div className="container mx-auto max-w-3xl">
          {/* Edital Card */}
          {processo.edital_url && (
            <div className="relative overflow-hidden bg-navy-deep border border-gold/40 rounded-3xl p-10 mb-8 text-center shadow-2xl shadow-navy/20 reveal">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,hsl(var(--gold)/0.18),transparent_60%)]" />
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/20 mb-4">
                <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-display font-bold mb-3 text-gold">{processo.titulo}</h2>
              <p className="text-cream/80 mb-6">{processo.edital_descricao}</p>
              <Button variant="hero" size="lg" asChild className="btn-sweep relative">
                <a href={processo.edital_url} target="_blank" rel="noopener noreferrer">
                  Acessar Edital Completo
                </a>
              </Button>
            </div>
          )}

          {/* Inscrição Card */}
          {processo.inscricao_url && (
            <div className="card-light !border-gold/40 mb-10 text-center reveal">
              <h2 className="text-2xl font-display font-bold mb-2 text-navy">{processo.titulo}</h2>
              {processo.inscricao_inicio && processo.inscricao_fim && (
                <p className="text-muted-foreground mb-4">
                  Inscrições: {new Date(processo.inscricao_inicio).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })} até {new Date(processo.inscricao_fim).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })} (horário de Brasília)
                </p>
              )}
              <Button variant="hero" size="lg" asChild className="btn-sweep">
                <a href={processo.inscricao_url} target="_blank" rel="noopener noreferrer">Inscrever-se agora</a>
              </Button>
            </div>
          )}

          {/* Informações Essenciais */}
          {infos.length > 0 && (
            <div className="card-light mb-10 reveal">
              <h3 className="text-lg font-display font-bold uppercase tracking-[0.1em] mb-4 text-navy">Informações Essenciais</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {infos.map((info) => (
                  <li key={info.id} className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    {info.texto}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requisitos para Inscrição */}
          {requisitos.length > 0 && (
            <>
              <h3 className="text-xl font-display font-bold uppercase tracking-[0.1em] mb-5 text-navy reveal">Requisitos para Inscrição</h3>
              <ul className="space-y-3 mb-8">
                {requisitos.map((req) => (
                  <li key={req.id} className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-sm font-semibold">{req.titulo}</strong>
                      {req.descricao && (
                        <p className="text-sm text-muted-foreground">{req.descricao}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* Cronograma */}
          {cronograma.length > 0 && (
            <>
              <h3 className="text-xl font-display font-bold uppercase tracking-[0.1em] mb-5 text-navy reveal">Cronograma</h3>
              <div className="bg-white rounded-2xl border border-navy/10 overflow-hidden mb-10 shadow-sm reveal">
                <table className="w-full text-sm">
                  <tbody>
                    {cronograma.map((item) => (
                      <tr key={item.id} className="border-b border-navy/10 last:border-0 hover:bg-gold/5 transition-colors">
                        <td className="px-5 py-4 font-bold text-navy">{item.etapa}</td>
                        <td className="px-5 py-4 text-muted-foreground">{item.descricao}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Compromissos dos Participantes */}
          {compromissos.length > 0 && (
            <>
              <h3 className="text-xl font-display font-bold uppercase tracking-[0.1em] mb-5 text-navy reveal">Compromissos dos Participantes</h3>
              <ul className="space-y-2 mb-8">
                {compromissos.map((comp) => (
                  <li key={comp.id} className="flex gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    {comp.descricao}
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* Perguntas Frequentes */}
          {faqs.length > 0 && (
            <>
              <h3 className="text-xl font-display font-bold uppercase tracking-[0.1em] mb-5 text-navy reveal">Perguntas Frequentes</h3>
              <div className="space-y-2 mb-10">
                {faqs.map((faq, i) => (
                  <div key={faq.id} className={`bg-white rounded-xl border transition-all duration-300 ${openFaq === i ? "border-gold/60 shadow-lg" : "border-navy/10 hover:border-gold/40"}`}>
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-navy"
                    >
                      <span className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-gold" />
                        {faq.pergunta}
                      </span>
                      <span className="text-gold-dark text-lg leading-none">{openFaq === i ? "−" : "+"}</span>
                    </button>
                    {openFaq === i && (
                      <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed animate-fade-in">{faq.resposta}</div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Resultados e Seleções Anteriores */}
          {resultadosAnteriores.length > 0 && (
            <>
              <h3 className="text-xl font-display font-bold uppercase tracking-[0.1em] mb-5 text-navy reveal">Resultados e Seleções Anteriores</h3>
              <ul className="space-y-2 text-sm mb-10">
                {resultadosAnteriores.map((resultado) => (
                  <li key={resultado.id}>
                    {resultado.url ? (
                      <a href={resultado.url} target="_blank" rel="noopener noreferrer" className="text-navy font-medium hover:text-gold-dark transition-colors">
                        {resultado.titulo} →
                      </a>
                    ) : (
                      <span className="text-muted-foreground">{resultado.titulo}</span>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* Aprovados */}
          {aprovados.length > 0 && (
            <>
              <h3 className="text-xl font-display font-bold uppercase tracking-[0.1em] mb-5 text-navy reveal">Aprovados</h3>
              <div className="card-light mb-8 reveal">
                <ul className="grid gap-3 sm:grid-cols-2">
                  {aprovados.map((aprovado) => (
                    <li key={aprovado.id} className="flex flex-col gap-1">
                      <span className="font-medium">{aprovado.nome}</span>
                      {aprovado.instituicao && (
                        <span className="text-sm text-muted-foreground">{aprovado.instituicao}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ProcessoSeletivo;
