import Layout from "@/components/layout/Layout";
import PageHero from "@/components/layout/PageHero";

const Privacidade = () => (
  <Layout>
    <PageHero eyebrow="Legal" title="Política de Privacidade" />
    <section className="section-padding bg-cream">
      <div className="container mx-auto max-w-3xl prose prose-sm bg-white rounded-3xl border border-navy/10 shadow-sm p-8 md:p-12">
        <div className="bg-gold/10 border-l-4 border-gold rounded-lg p-4 mb-8 text-sm text-muted-foreground">
          <strong className="text-foreground">Aviso:</strong> Este conteúdo é informativo e institucional. Não constitui aconselhamento jurídico.
        </div>

        <h2 className="text-xl font-display font-bold mt-10 mb-3 text-navy">1. Introdução</h2>
        <p className="text-muted-foreground mb-4">O LIDA — Laboratório de Inteligência e Direito Aplicado (PUC-SP) respeita a sua privacidade. Esta política explica como coletamos, usamos e protegemos seus dados pessoais ao utilizar nosso site.</p>

        <h2 className="text-xl font-display font-bold mt-10 mb-3 text-navy">2. Dados que coletamos</h2>
        <p className="text-muted-foreground mb-2">Podemos coletar os seguintes dados:</p>
        <ul className="text-muted-foreground space-y-1 mb-4 list-disc pl-5">
          <li>Nome e e-mail, quando você preenche formulários de contato ou inscrição.</li>
          <li>Dados de navegação (páginas visitadas, tempo de permanência), coletados por cookies.</li>
          <li>Informações fornecidas voluntariamente em formulários de pesquisa ou processo seletivo.</li>
        </ul>

        <h2 className="text-xl font-display font-bold mt-10 mb-3 text-navy">3. Finalidade do tratamento</h2>
        <p className="text-muted-foreground mb-4">Seus dados são utilizados para: responder suas mensagens, processar inscrições, enviar comunicações sobre eventos e publicações (mediante consentimento), melhorar a experiência no site e cumprir obrigações legais.</p>

        <h2 className="text-xl font-display font-bold mt-10 mb-3 text-navy">4. Compartilhamento</h2>
        <p className="text-muted-foreground mb-4">Não compartilhamos seus dados pessoais com terceiros para fins comerciais. Dados poderão ser compartilhados com a PUC-SP para fins acadêmicos e administrativos, quando necessário.</p>

        <h2 className="text-xl font-display font-bold mt-10 mb-3 text-navy">5. Seus direitos</h2>
        <p className="text-muted-foreground mb-4">Você tem direito a acessar, corrigir, excluir ou solicitar a portabilidade dos seus dados pessoais. Para exercer seus direitos, entre em contato pelo e-mail lidapucsp@gmail.com.</p>

        <h2 className="text-xl font-display font-bold mt-10 mb-3 text-navy">6. Segurança</h2>
        <p className="text-muted-foreground mb-4">Adotamos medidas técnicas e organizacionais para proteger seus dados contra acessos não autorizados, perda ou destruição.</p>

        <h2 className="text-xl font-display font-bold mt-10 mb-3 text-navy">7. Alterações</h2>
        <p className="text-muted-foreground mb-4">Esta política pode ser atualizada periodicamente. A versão mais recente estará sempre disponível nesta página.</p>

        <p className="text-xs text-muted-foreground mt-8">Última atualização: abril de 2026.</p>
      </div>
    </section>
  </Layout>
);

export default Privacidade;
