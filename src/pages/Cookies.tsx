import Layout from "@/components/layout/Layout";

const Cookies = () => (
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
        <h1 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground mb-4">Política de Cookies</h1>
      </div>
    </section>
    <section className="section-padding">
      <div className="container mx-auto max-w-3xl prose prose-sm">
        <div className="bg-gold/10 border border-gold/30 rounded-lg p-4 mb-8 text-sm text-muted-foreground">
          <strong className="text-foreground">Aviso:</strong> Este conteúdo é informativo e institucional. Não constitui aconselhamento jurídico.
        </div>

        <h2 className="text-xl font-display font-bold mt-8 mb-3">1. O que são cookies?</h2>
        <p className="text-muted-foreground mb-4">Cookies são pequenos arquivos de texto armazenados no seu dispositivo quando você visita um site. Eles ajudam a melhorar sua experiência de navegação.</p>

        <h2 className="text-xl font-display font-bold mt-8 mb-3">2. Cookies que utilizamos</h2>
        <ul className="text-muted-foreground space-y-2 mb-4 list-disc pl-5">
          <li><strong className="text-foreground">Essenciais:</strong> Necessários para o funcionamento do site (ex.: preferências de cookies).</li>
          <li><strong className="text-foreground">Analíticos:</strong> Nos ajudam a entender como os visitantes interagem com o site (ex.: Google Analytics).</li>
          <li><strong className="text-foreground">Funcionais:</strong> Permitem personalizar funcionalidades (ex.: idioma, região).</li>
        </ul>

        <h2 className="text-xl font-display font-bold mt-8 mb-3">3. Como gerenciar cookies</h2>
        <p className="text-muted-foreground mb-4">Você pode aceitar ou recusar cookies não essenciais através do banner exibido ao acessar o site. Também pode configurar seu navegador para bloquear cookies, mas isso pode afetar a funcionalidade do site.</p>

        <h2 className="text-xl font-display font-bold mt-8 mb-3">4. Alterações</h2>
        <p className="text-muted-foreground mb-4">Esta política pode ser atualizada. Consulte esta página regularmente para se manter informado.</p>

        <p className="text-xs text-muted-foreground mt-8">Última atualização: abril de 2026.</p>
      </div>
    </section>
  </Layout>
);

export default Cookies;
