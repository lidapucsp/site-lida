import Layout from "@/components/layout/Layout";

const Termos = () => (
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
        <h1 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground mb-4">Termos de Uso</h1>
      </div>
    </section>
    <section className="section-padding">
      <div className="container mx-auto max-w-3xl prose prose-sm">
        <div className="bg-gold/10 border border-gold/30 rounded-lg p-4 mb-8 text-sm text-muted-foreground">
          <strong className="text-foreground">Aviso:</strong> Este conteúdo é informativo e institucional. Não constitui aconselhamento jurídico.
        </div>

        <h2 className="text-xl font-display font-bold mt-8 mb-3">1. Aceitação</h2>
        <p className="text-muted-foreground mb-4">Ao acessar e utilizar este site, você concorda com estes termos de uso. Caso não concorde, solicitamos que interrompa o uso do site.</p>

        <h2 className="text-xl font-display font-bold mt-8 mb-3">2. Conteúdo</h2>
        <p className="text-muted-foreground mb-4">O conteúdo publicado neste site tem caráter educacional, acadêmico e informativo. Não constitui aconselhamento jurídico, consultoria profissional ou qualquer tipo de recomendação formal.</p>

        <h2 className="text-xl font-display font-bold mt-8 mb-3">3. Propriedade intelectual</h2>
        <p className="text-muted-foreground mb-4">Todo o conteúdo do site — textos, imagens, gráficos, logotipos e publicações — é de propriedade do LIDA/PUC-SP ou de seus respectivos autores. A reprodução é permitida para fins acadêmicos com a devida citação da fonte.</p>

        <h2 className="text-xl font-display font-bold mt-8 mb-3">4. Links externos</h2>
        <p className="text-muted-foreground mb-4">O site pode conter links para sites de terceiros. O LIDA não se responsabiliza pelo conteúdo, políticas de privacidade ou práticas de sites externos.</p>

        <h2 className="text-xl font-display font-bold mt-8 mb-3">5. Limitação de responsabilidade</h2>
        <p className="text-muted-foreground mb-4">O LIDA não se responsabiliza por danos diretos ou indiretos decorrentes do uso das informações disponibilizadas neste site.</p>

        <h2 className="text-xl font-display font-bold mt-8 mb-3">6. Alterações</h2>
        <p className="text-muted-foreground mb-4">Estes termos podem ser alterados a qualquer momento, sem aviso prévio. O uso continuado do site após modificações implica a aceitação dos novos termos.</p>

        <p className="text-xs text-muted-foreground mt-8">Última atualização: abril de 2026.</p>
      </div>
    </section>
  </Layout>
);

export default Termos;
