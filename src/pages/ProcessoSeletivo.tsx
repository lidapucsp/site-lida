import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { CheckCircle, HelpCircle } from "lucide-react";
import { useState } from "react";

const faqs = [
  { q: "Quem pode participar do processo seletivo?", a: "O LIDA é aberto a participantes de todo o Brasil: estudantes de graduação, mestrado e doutorado, além de pesquisadores e advogados interessados em compreender, estudar e discutir a aplicação da IA no campo jurídico." },
  { q: "Preciso ter experiência com IA ou tecnologia?", a: "Não. Buscamos pessoas curiosas e comprometidas. O LIDA oferece formação e desenvolvimento durante o programa." },
  { q: "As atividades são presenciais ou online?", a: "As aulas do LIDA são majoritariamente online, permitindo participantes de diferentes regiões. Eventualmente, podem ser organizados encontros ou atividades presenciais, previamente combinados e agendados entre os membros." },
  { q: "Qual é o compromisso de tempo?", a: "Reuniões semanais aos sábados, das 9h às 11h da manhã, com presença mínima obrigatória de 75%, além da participação em projetos e produção de artigo acadêmico." },
  { q: "O certificado vale como horas complementares?", a: "Sim. Ao final do ciclo de estudos, será emitido certificado de participação que poderá ser utilizado como horas complementares, conforme as regras de cada instituição de ensino." },
  { q: "Quantas vagas estão disponíveis?", a: "Serão selecionados até 20 participantes para compor a primeira turma do LIDA em 2026.1." },
  { q: "Quais são os benefícios de participar?", a: "Além da formação em IA aplicada ao Direito, os participantes terão acesso a debates, contato com profissionais da área e oportunidades de networking acadêmico e profissional." },
];

const ProcessoSeletivo = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
          <h1 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground mb-4">Processo Seletivo</h1>
          <p className="text-primary-foreground/70 text-lg">Faça parte do LIDA! Confira o edital e inscreva-se.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto max-w-3xl">
          <div className="bg-gold/10 border border-gold/30 rounded-xl p-6 mb-10 text-center">
            <h2 className="text-xl font-display font-bold mb-2">Processo Seletivo 2026.1</h2>
            <p className="text-muted-foreground mb-4">Inscrições: 23/03 às 10h até 07/04 às 23h59 (horário de Brasília)</p>
            <Button variant="hero" size="lg" asChild>
              <a href="#" target="_blank" rel="noopener noreferrer">Inscrever-se agora</a>
            </Button>
          </div>

          <div className="bg-navy/5 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-display font-bold mb-3 text-navy">Informações Essenciais</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-gold shrink-0 mt-0.5" />Etapa única - sem dinâmicas ou entrevistas presenciais</li>
              <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-gold shrink-0 mt-0.5" />Até 20 participantes selecionados para a primeira turma</li>
              <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-gold shrink-0 mt-0.5" />Resultado divulgado até 15/04 via e-mail aos aprovados</li>
            </ul>
          </div>

          <h3 className="text-xl font-display font-bold mb-4">Requisitos para Inscrição</h3>
          <ul className="space-y-3 mb-8">
            {[
              { title: "Formulário classificatório", desc: "Informações de contato, interesses e motivações para participar do grupo" },
              { title: "Carta de apresentação", desc: "Documento elaborado pelo candidato apresentando sua trajetória e objetivos" },
              { title: "Resposta reflexiva", desc: 'Em até 15 linhas, responder à pergunta: "Como você utiliza IA no seu cotidiano?"' },
            ].map((r) => (
              <li key={r.title} className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <strong className="text-sm font-semibold">{r.title}</strong>
                  <p className="text-sm text-muted-foreground">{r.desc}</p>
                </div>
              </li>
            ))}
          </ul>

          <h3 className="text-xl font-display font-bold mb-4">Cronograma</h3>
          <div className="bg-card rounded-xl border border-border overflow-hidden mb-10">
            <table className="w-full text-sm">
              <tbody>
                {[
                  ["Abertura das inscrições", "23/03/2026 às 10h"],
                  ["Encerramento das inscrições", "07/04/2026 às 23h59"],
                  ["Divulgação do resultado", "Até 15/04/2026"],
                ].map(([etapa, periodo]) => (
                  <tr key={etapa} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium">{etapa}</td>
                    <td className="px-4 py-3 text-muted-foreground">{periodo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-display font-bold mb-4">Compromissos dos Participantes</h3>
          <ul className="space-y-2 mb-8">
            {[
              "Participar das reuniões semanais aos sábados, das 9h às 11h",
              "Presença mínima de 75% nas reuniões",
              "Produzir artigo acadêmico ao final do programa",
              "Colaborar com projetos e atividades do laboratório",
            ].map((r) => (
              <li key={r} className="flex gap-2 text-sm"><CheckCircle className="w-4 h-4 text-gold shrink-0 mt-0.5" />{r}</li>
            ))}
          </ul>

          <h3 className="text-xl font-display font-bold mb-4">Perguntas Frequentes</h3>
          <div className="space-y-2 mb-10">
            {faqs.map((f, i) => (
              <div key={i} className="bg-card rounded-lg border border-border">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left text-sm font-medium"
                >
                  <span className="flex items-center gap-2"><HelpCircle className="w-4 h-4 text-gold" />{f.q}</span>
                  <span className="text-muted-foreground">{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-sm text-muted-foreground">{f.a}</div>
                )}
              </div>
            ))}
          </div>

          <h3 className="text-xl font-display font-bold mb-4">Resultados e Seleções Anteriores</h3>
          <ul className="space-y-2 text-sm">
            {[
              ["Processo Seletivo 2025.2", "#"],
              ["Processo Seletivo 2025.1", "#"],
            ].map(([label, link]) => (
              <li key={label}><a href={link} className="text-navy hover:underline">{label} →</a></li>
            ))}
          </ul>
        </div>
      </section>
    </Layout>
  );
};

export default ProcessoSeletivo;
