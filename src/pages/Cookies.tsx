import Layout from "@/components/layout/Layout";
import PageHero from "@/components/layout/PageHero";

const Cookies = () => (
  <Layout>
    <PageHero eyebrow="Legal" title="Política de Cookies" />
    <section className="section-padding bg-cream">
      <div className="container mx-auto max-w-3xl prose prose-sm bg-white rounded-3xl border border-navy/10 shadow-sm p-8 md:p-12">
        <div className="bg-gold/10 border-l-4 border-gold rounded-lg p-4 mb-8 text-sm text-muted-foreground">
          <strong className="text-foreground">Aviso:</strong> Este conteúdo é informativo e institucional. Não constitui aconselhamento jurídico.
        </div>

        <h2 className="text-xl font-display font-bold mt-10 mb-3 text-navy">1. O que são cookies?</h2>
        <p className="text-muted-foreground mb-4">Cookies são pequenos arquivos de texto armazenados no seu dispositivo quando você visita um site. Eles ajudam a melhorar sua experiência de navegação.</p>

        <h2 className="text-xl font-display font-bold mt-10 mb-3 text-navy">2. Cookies que utilizamos</h2>
        <ul className="text-muted-foreground space-y-2 mb-4 list-disc pl-5">
          <li><strong className="text-foreground">Essenciais:</strong> Necessários para o funcionamento do site (ex.: preferências de cookies).</li>
          <li><strong className="text-foreground">Analíticos:</strong> Nos ajudam a entender como os visitantes interagem com o site (ex.: Google Analytics).</li>
          <li><strong className="text-foreground">Funcionais:</strong> Permitem personalizar funcionalidades (ex.: idioma, região).</li>
        </ul>

        <h2 className="text-xl font-display font-bold mt-10 mb-3 text-navy">3. Como gerenciar cookies</h2>
        <p className="text-muted-foreground mb-4">Você pode aceitar ou recusar cookies não essenciais através do banner exibido ao acessar o site. Também pode configurar seu navegador para bloquear cookies, mas isso pode afetar a funcionalidade do site.</p>

        <h2 className="text-xl font-display font-bold mt-10 mb-3 text-navy">4. Alterações</h2>
        <p className="text-muted-foreground mb-4">Esta política pode ser atualizada. Consulte esta página regularmente para se manter informado.</p>

        <p className="text-xs text-muted-foreground mt-8">Última atualização: abril de 2026.</p>
      </div>
    </section>
  </Layout>
);

export default Cookies;
