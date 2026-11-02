import Layout from "@/components/layout/Layout";
import PageHero from "@/components/layout/PageHero";

const Termos = () => (
  <Layout>
    <PageHero eyebrow="Legal" title="Termos de Uso" />
    <section className="section-padding bg-cream">
      <div className="container mx-auto max-w-3xl prose prose-sm bg-white rounded-3xl border border-navy/10 shadow-sm p-8 md:p-12">
        <div className="bg-gold/10 border-l-4 border-gold rounded-lg p-4 mb-8 text-sm text-muted-foreground">
          <strong className="text-foreground">Aviso:</strong> Este conteúdo é informativo e institucional. Não constitui aconselhamento jurídico.
        </div>

        <h2 className="text-xl font-display font-bold mt-10 mb-3 text-navy">1. Aceitação</h2>
        <p className="text-muted-foreground mb-4">Ao acessar e utilizar este site, você concorda com estes termos de uso. Caso não concorde, solicitamos que interrompa o uso do site.</p>

        <h2 className="text-xl font-display font-bold mt-10 mb-3 text-navy">2. Conteúdo</h2>
        <p className="text-muted-foreground mb-4">O conteúdo publicado neste site tem caráter educacional, acadêmico e informativo. Não constitui aconselhamento jurídico, consultoria profissional ou qualquer tipo de recomendação formal.</p>

        <h2 className="text-xl font-display font-bold mt-10 mb-3 text-navy">3. Propriedade intelectual</h2>
        <p className="text-muted-foreground mb-4">Todo o conteúdo do site — textos, imagens, gráficos, logotipos e publicações — é de propriedade do LIDA/PUC-SP ou de seus respectivos autores. A reprodução é permitida para fins acadêmicos com a devida citação da fonte.</p>

        <h2 className="text-xl font-display font-bold mt-10 mb-3 text-navy">4. Links externos</h2>
        <p className="text-muted-foreground mb-4">O site pode conter links para sites de terceiros. O LIDA não se responsabiliza pelo conteúdo, políticas de privacidade ou práticas de sites externos.</p>

        <h2 className="text-xl font-display font-bold mt-10 mb-3 text-navy">5. Limitação de responsabilidade</h2>
        <p className="text-muted-foreground mb-4">O LIDA não se responsabiliza por danos diretos ou indiretos decorrentes do uso das informações disponibilizadas neste site.</p>

        <h2 className="text-xl font-display font-bold mt-10 mb-3 text-navy">6. Alterações</h2>
        <p className="text-muted-foreground mb-4">Estes termos podem ser alterados a qualquer momento, sem aviso prévio. O uso continuado do site após modificações implica a aceitação dos novos termos.</p>

        <p className="text-xs text-muted-foreground mt-8">Última atualização: abril de 2026.</p>
      </div>
    </section>
  </Layout>
);

export default Termos;
