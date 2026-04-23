import Layout from "@/components/layout/Layout";

const Privacidade = () => (
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
        <h1 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground mb-4">Política de Privacidade</h1>
      </div>
    </section>
    <section className="section-padding-top-sm">
      <div className="container mx-auto max-w-3xl prose prose-sm">
        <div className="bg-gold/10 border border-gold/30 rounded-lg p-4 mb-8 text-sm text-muted-foreground">
          <strong className="text-foreground">Aviso:</strong> Este conteúdo é informativo e institucional. Não constitui aconselhamento jurídico.
        </div>

        <h2 className="text-xl font-display font-bold mt-8 mb-3">1. Introdução</h2>
        <p className="text-muted-foreground mb-4">O LIDA — Laboratório de Inteligência e Direito Aplicado (PUC-SP) respeita a sua privacidade. Esta política explica como coletamos, usamos e protegemos seus dados pessoais ao utilizar nosso site.</p>

        <h2 className="text-xl font-display font-bold mt-8 mb-3">2. Dados que coletamos</h2>
        <p className="text-muted-foreground mb-2">Podemos coletar os seguintes dados:</p>
        <ul className="text-muted-foreground space-y-1 mb-4 list-disc pl-5">
          <li>Nome e e-mail, quando você preenche formulários de contato ou inscrição.</li>
          <li>Dados de navegação (páginas visitadas, tempo de permanência), coletados por cookies.</li>
          <li>Informações fornecidas voluntariamente em formulários de pesquisa ou processo seletivo.</li>
        </ul>

        <h2 className="text-xl font-display font-bold mt-8 mb-3">3. Finalidade do tratamento</h2>
        <p className="text-muted-foreground mb-4">Seus dados são utilizados para: responder suas mensagens, processar inscrições, enviar comunicações sobre eventos e publicações (mediante consentimento), melhorar a experiência no site e cumprir obrigações legais.</p>

        <h2 className="text-xl font-display font-bold mt-8 mb-3">4. Compartilhamento</h2>
        <p className="text-muted-foreground mb-4">Não compartilhamos seus dados pessoais com terceiros para fins comerciais. Dados poderão ser compartilhados com a PUC-SP para fins acadêmicos e administrativos, quando necessário.</p>

        <h2 className="text-xl font-display font-bold mt-8 mb-3">5. Seus direitos</h2>
        <p className="text-muted-foreground mb-4">Você tem direito a acessar, corrigir, excluir ou solicitar a portabilidade dos seus dados pessoais. Para exercer seus direitos, entre em contato pelo e-mail lidapucsp@gmail.com.</p>

        <h2 className="text-xl font-display font-bold mt-8 mb-3">6. Segurança</h2>
        <p className="text-muted-foreground mb-4">Adotamos medidas técnicas e organizacionais para proteger seus dados contra acessos não autorizados, perda ou destruição.</p>

        <h2 className="text-xl font-display font-bold mt-8 mb-3">7. Alterações</h2>
        <p className="text-muted-foreground mb-4">Esta política pode ser atualizada periodicamente. A versão mais recente estará sempre disponível nesta página.</p>

        <p className="text-xs text-muted-foreground mt-8">Última atualização: abril de 2026.</p>
      </div>
    </section>
  </Layout>
);

export default Privacidade;
