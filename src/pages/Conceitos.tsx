import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Brain, Network, MessageSquare, Eye, Cog, Scale, FileSearch, Users, Gavel } from 'lucide-react';

export default function Conceitos() {
  return (
    <Layout>
      {/* Hero Section */}
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
          <h1 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground mb-4">
            Conceitos de Inteligência Artificial
          </h1>
          <p className="text-primary-foreground/70 text-lg">
            Compreenda os fundamentos da inteligência artificial, suas divisões, aplicações no direito e as principais ferramentas disponíveis no mercado jurídico.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* O que é IA */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-gold-600" />
              <CardTitle className="text-2xl">O que é Inteligência Artificial?</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-4">
              <strong>Inteligência Artificial (IA)</strong> é a capacidade de sistemas computacionais realizarem tarefas que tipicamente requerem inteligência humana, como aprendizado, raciocínio, resolução de problemas, percepção e tomada de decisões. É um campo de pesquisa interdisciplinar que combina ciência da computação, matemática e engenharia.
            </p>
            <p className="text-gray-700 mb-4">
              A IA moderna busca criar máquinas que possam <strong>aprender com dados</strong>, <strong>reconhecer padrões</strong> e <strong>tomar decisões inteligentes</strong> com mínima intervenção humana. Desde sua formalização na década de 1950, a IA evoluiu dramaticamente, especialmente após 2012, com o advento do deep learning.
            </p>
            
            <blockquote className="border-l-4 border-gold-600 pl-4 my-6 text-gray-800 italic">
              <strong>A IA não busca apenas imitar a inteligência humana, mas expandir as capacidades de processamento, análise e tomada de decisão baseada em dados em escala impossível para humanos.</strong>
            </blockquote>
          </CardContent>
        </Card>

        {/* Divisões da IA */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Network className="w-8 h-8 text-gold-600" />
              <CardTitle className="text-2xl">Principais Divisões e Técnicas da IA</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Machine Learning */}
              <div>
                <h3 className="text-xl font-semibold text-navy-900 mb-3 flex items-center gap-2">
                  <Cog className="w-6 h-6 text-gold-600" />
                  Machine Learning (Aprendizado de Máquina)
                </h3>
                <p className="text-gray-700 mb-3">
                  O <strong>Machine Learning</strong> é o estudo de programas que podem melhorar seu desempenho em determinadas tarefas automaticamente através da experiência. É a base da maioria das aplicações modernas de IA.
                </p>
                <div className="bg-cream-50 p-4 rounded-lg mb-3">
                  <p className="font-semibold text-navy-900 mb-2">Principais Tipos:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li><strong>Aprendizado Supervisionado:</strong> O modelo aprende com dados rotulados (ex: classificação de documentos, previsão de resultados judiciais)</li>
                    <li><strong>Aprendizado Não Supervisionado:</strong> O modelo identifica padrões em dados não rotulados (ex: agrupamento de casos semelhantes)</li>
                    <li><strong>Aprendizado por Reforço:</strong> O modelo aprende através de tentativa e erro, recebendo recompensas ou punições</li>
                  </ul>
                </div>
              </div>

              <Separator />

              {/* Deep Learning */}
              <div>
                <h3 className="text-xl font-semibold text-navy-900 mb-3 flex items-center gap-2">
                  <Network className="w-6 h-6 text-gold-600" />
                  Deep Learning (Aprendizado Profundo)
                </h3>
                <p className="text-gray-700 mb-3">
                  O <strong>Deep Learning</strong> é um subcampo do Machine Learning que utiliza redes neurais artificiais com múltiplas camadas (daí o termo "profundo"). Essa arquitetura permite que o sistema aprenda representações cada vez mais abstratas dos dados.
                </p>
                <p className="text-gray-700 mb-3">
                  As redes neurais profundas revolucionaram áreas como reconhecimento de imagem, processamento de linguagem natural e geração de conteúdo. Modelos como GPT (Generative Pre-trained Transformer) utilizam deep learning para processar e gerar texto.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Exemplo prático:</strong> Quando um sistema lê um contrato e identifica automaticamente cláusulas específicas, está usando redes neurais profundas treinadas em milhões de documentos legais.
                  </p>
                </div>
              </div>

              <Separator />

              {/* NLP */}
              <div>
                <h3 className="text-xl font-semibold text-navy-900 mb-3 flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-gold-600" />
                  Processamento de Linguagem Natural (NLP)
                </h3>
                <p className="text-gray-700 mb-3">
                  O <strong>Processamento de Linguagem Natural</strong> permite que programas leiam, entendam e comuniquem em linguagens humanas. Esta área é especialmente relevante para o direito, dado que a profissão lida predominantemente com texto.
                </p>
                <div className="bg-cream-50 p-4 rounded-lg mb-3">
                  <p className="font-semibold text-navy-900 mb-2">Aplicações no Direito:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Análise e revisão automatizada de contratos</li>
                    <li>Pesquisa jurídica inteligente em bases de jurisprudência</li>
                    <li>Extração de informações relevantes de documentos</li>
                    <li>Tradução jurídica automática</li>
                    <li>Resumo automático de processos e pareceres</li>
                  </ul>
                </div>
              </div>

              <Separator />

              {/* Computer Vision */}
              <div>
                <h3 className="text-xl font-semibold text-navy-900 mb-3 flex items-center gap-2">
                  <Eye className="w-6 h-6 text-gold-600" />
                  Visão Computacional
                </h3>
                <p className="text-gray-700 mb-3">
                  A <strong>Visão Computacional</strong> permite que máquinas interpretem e entendam o mundo visual através de imagens e vídeos. No contexto jurídico, pode ser aplicada na análise de evidências visuais, reconhecimento facial em sistemas de segurança, e digitalização inteligente de documentos físicos.
                </p>
              </div>

              <Separator />

              {/* Expert Systems */}
              <div>
                <h3 className="text-xl font-semibold text-navy-900 mb-3 flex items-center gap-2">
                  <Brain className="w-6 h-6 text-gold-600" />
                  Sistemas Especialistas
                </h3>
                <p className="text-gray-700 mb-3">
                  <strong>Sistemas Especialistas</strong> são programas que utilizam conhecimento de domínio específico e regras lógicas para tomar decisões ou fornecer recomendações. Foram uma das primeiras aplicações bem-sucedidas de IA no direito, utilizados para automatizar tarefas como elaboração de documentos padronizados e consultas sobre aplicabilidade de legislação.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* IA Aplicada ao Direito */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Scale className="w-8 h-8 text-gold-600" />
              <CardTitle className="text-2xl">Como a IA se Aplica ao Direito</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-gray-700 mb-6">
              A intersecção entre Inteligência Artificial e Direito, conhecida como <strong>Legal Tech</strong> ou <strong>Legal AI</strong>, está transformando radicalmente a prática jurídica. A IA oferece ferramentas para aumentar a eficiência, reduzir custos e melhorar o acesso à justiça.
            </p>

            <div className="space-y-6">
              {/* Pesquisa Jurídica */}
              <div>
                <h3 className="text-xl font-semibold text-navy-900 mb-3 flex items-center gap-2">
                  <FileSearch className="w-6 h-6 text-gold-600" />
                  Pesquisa e Análise Jurídica Inteligente
                </h3>
                <p className="text-gray-700 mb-3">
                  Sistemas de IA podem pesquisar em milhões de documentos legais (jurisprudência, legislação, doutrinas) em segundos, identificando precedentes relevantes e padrões decisórios. Ao invés de busca por palavras-chave simples, utilizam compreensão semântica para encontrar resultados mais precisos.
                </p>
                <blockquote className="border-l-4 border-gold-600 pl-4 my-4 text-gray-800">
                  <strong>Ferramentas modernas conseguem prever a probabilidade de sucesso de uma ação judicial com base em análise de decisões passadas e características do caso.</strong>
                </blockquote>
              </div>

              <Separator />

              {/* Due Diligence e Discovery */}
              <div>
                <h3 className="text-xl font-semibold text-navy-900 mb-3 flex items-center gap-2">
                  <FileSearch className="w-6 h-6 text-gold-600" />
                  Due Diligence e E-Discovery
                </h3>
                <p className="text-gray-700 mb-3">
                  Em processos que envolvem milhões de documentos, a IA pode analisar automaticamente e-mails, contratos e outros documentos para identificar informações relevantes. Técnicas de <em>predictive coding</em> permitem que o sistema aprenda quais documentos são relevantes a partir de exemplos fornecidos por advogados.
                </p>
                <div className="bg-cream-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Impacto:</strong> Tarefas que levariam meses para equipes de advogados júnior podem ser concluídas em dias, com maior precisão e menor custo.
                  </p>
                </div>
              </div>

              <Separator />

              {/* Automação Documental */}
              <div>
                <h3 className="text-xl font-semibold text-navy-900 mb-3 flex items-center gap-2">
                  <Cog className="w-6 h-6 text-gold-600" />
                  Automação e Geração de Documentos
                </h3>
                <p className="text-gray-700 mb-3">
                  A IA permite a geração automatizada de contratos, petições e outros documentos jurídicos a partir de templates inteligentes que se adaptam às especificidades de cada caso. Sistemas avançados podem:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-3">
                  <li>Gerar minutas contratuais personalizadas</li>
                  <li>Identificar cláusulas potencialmente problemáticas</li>
                  <li>Sugerir melhorias baseadas em melhores práticas</li>
                  <li>Comparar contratos e identificar diferenças críticas</li>
                </ul>
              </div>

              <Separator />

              {/* Análise Preditiva */}
              <div>
                <h3 className="text-xl font-semibold text-navy-900 mb-3 flex items-center gap-2">
                  <Gavel className="w-6 h-6 text-gold-600" />
                  Análise Preditiva e Apoio à Decisão
                </h3>
                <p className="text-gray-700 mb-3">
                  Sistemas de IA podem analisar históricos de decisões judiciais para prever resultados de casos, estimar valores de indenizações e identificar os argumentos jurídicos mais eficazes para cada juiz ou tribunal específico. Isso permite:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Avaliação mais precisa de riscos processuais</li>
                  <li>Estratégias jurídicas baseadas em dados</li>
                  <li>Melhor assessoria para tomada de decisão dos clientes</li>
                </ul>
              </div>

              <Separator />

              {/* Acesso à Justiça */}
              <div>
                <h3 className="text-xl font-semibold text-navy-900 mb-3 flex items-center gap-2">
                  <Users className="w-6 h-6 text-gold-600" />
                  Democratização do Acesso à Justiça
                </h3>
                <p className="text-gray-700 mb-3">
                  Chatbots jurídicos e plataformas de autoatendimento alimentadas por IA estão tornando serviços jurídicos básicos acessíveis a pessoas que não teriam condições de contratar um advogado. Essas ferramentas podem:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-3">
                  <li>Orientar sobre direitos e procedimentos legais</li>
                  <li>Ajudar na elaboração de documentos simples</li>
                  <li>Conectar pessoas a recursos legais apropriados</li>
                </ul>
                <div className="bg-blue-50 p-4 rounded-lg mt-4">
                  <p className="text-sm text-gray-700">
                    <strong>Exemplo:</strong> Plataformas que auxiliam consumidores a reclamarem indenizações de companhias aéreas por atrasos de voos, sem necessidade de contratar advogado.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <p className="text-sm text-gray-800">
                <strong>⚠️ Considerações Éticas:</strong> Apesar dos benefícios, a aplicação de IA no direito levanta questões importantes sobre viés algorítmico, transparência nas decisões, proteção de dados e a necessidade de supervisão humana, especialmente em decisões que afetam direitos fundamentais.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Ferramentas Populares */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Cog className="w-8 h-8 text-gold-600" />
              <CardTitle className="text-2xl">Ferramentas Populares de IA no Direito</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-6">
              O mercado de Legal Tech cresceu exponencialmente nos últimos anos. Abaixo estão algumas das ferramentas e plataformas mais utilizadas por profissionais do direito no Brasil e no mundo:
            </p>

            <div className="space-y-6">
              {/* Ferramentas Gerais de IA */}
              <div>
                <h3 className="text-xl font-semibold text-navy-900 mb-3">IA Generativa de Propósito Geral</h3>
                <div className="space-y-4">
                  <div className="bg-cream-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-navy-900 mb-2">ChatGPT (OpenAI)</h4>
                    <p className="text-gray-700 text-sm mb-2">
                      Modelo de linguagem avançado que pode auxiliar advogados em pesquisa, redação, análise de documentos e brainstorming jurídico. Versões especializadas como GPT-4 demonstram capacidade impressionante em raciocínio legal.
                    </p>
                    <p className="text-xs text-gray-600"><strong>Uso:</strong> Rascunho de documentos, análise de argumentos, pesquisa preliminar</p>
                  </div>

                  <div className="bg-cream-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-navy-900 mb-2">Claude (Anthropic)</h4>
                    <p className="text-gray-700 text-sm mb-2">
                      Assistente de IA projetado para ser útil, inofensivo e honesto. Particularmente forte em análise de documentos longos e compreensão de contexto jurídico complexo.
                    </p>
                    <p className="text-xs text-gray-600"><strong>Uso:</strong> Análise de contratos extensos, revisão de documentos, consultas legais</p>
                  </div>

                  <div className="bg-cream-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-navy-900 mb-2">GitHub Copilot (Microsoft)</h4>
                    <p className="text-gray-700 text-sm mb-2">
                      Embora focado em código, é útil para automação de tarefas jurídicas através de scripts e para advogados que trabalham com contratos inteligentes e tecnologia blockchain.
                    </p>
                    <p className="text-xs text-gray-600"><strong>Uso:</strong> Automação de processos, contratos inteligentes</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Ferramentas Especializadas */}
              <div>
                <h3 className="text-xl font-semibold text-navy-900 mb-3">Plataformas Especializadas em Legal Tech</h3>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-navy-900 mb-2">Harvey AI</h4>
                    <p className="text-gray-700 text-sm mb-2">
                      Plataforma de IA especializada em serviços jurídicos, construída sobre modelos GPT customizados para o contexto legal. Utilizada por grandes escritórios de advocacia para pesquisa, análise e redação.
                    </p>
                    <p className="text-xs text-gray-600"><strong>Diferencial:</strong> Treinamento específico em documentos jurídicos e integração com fluxos de trabalho de escritórios</p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-navy-900 mb-2">Casetext CoCounsel</h4>
                    <p className="text-gray-700 text-sm mb-2">
                      Assistente de IA jurídico que auxilia em pesquisa legal, revisão de documentos e preparação de memorandos. Integra-se com bases de dados jurisprudenciais.
                    </p>
                    <p className="text-xs text-gray-600"><strong>Uso:</strong> Pesquisa jurisprudencial, análise de contratos, preparação de peças</p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-navy-900 mb-2">Ross Intelligence</h4>
                    <p className="text-gray-700 text-sm mb-2">
                      Uma das primeiras plataformas de pesquisa jurídica baseada em IA, utilizando processamento de linguagem natural para buscar precedentes e responder perguntas legais em linguagem natural.
                    </p>
                    <p className="text-xs text-gray-600"><strong>Uso:</strong> Pesquisa de precedentes, análise de casos</p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-navy-900 mb-2">Lex Machina</h4>
                    <p className="text-gray-700 text-sm mb-2">
                      Plataforma de análise preditiva que fornece insights sobre juízes, advogados e resultados de casos baseados em análise de dados históricos de litígios.
                    </p>
                    <p className="text-xs text-gray-600"><strong>Uso:</strong> Análise preditiva, estratégia processual, avaliação de riscos</p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-navy-900 mb-2">Kira Systems</h4>
                    <p className="text-gray-700 text-sm mb-2">
                      Software de machine learning para identificação, extração e análise de informações em contratos e documentos. Amplamente utilizado em due diligence e M&A.
                    </p>
                    <p className="text-xs text-gray-600"><strong>Uso:</strong> Revisão de contratos, due diligence, análise de cláusulas</p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-navy-900 mb-2">LegalRobot</h4>
                    <p className="text-gray-700 text-sm mb-2">
                      Plataforma que analisa contratos para identificar problemas, fornece insights sobre linguagem jurídica e oferece sugestões de melhorias baseadas em melhores práticas.
                    </p>
                    <p className="text-xs text-gray-600"><strong>Uso:</strong> Análise de contratos, identificação de riscos</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Ferramentas Brasileiras */}
              <div>
                <h3 className="text-xl font-semibold text-navy-900 mb-3">Ferramentas Brasileiras de Legal Tech</h3>
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-navy-900 mb-2">Turivius</h4>
                    <p className="text-gray-700 text-sm mb-2">
                      Plataforma brasileira de análise jurisprudencial que utiliza IA para pesquisar e analisar decisões judiciais, oferecendo insights sobre tendências e padrões decisórios do Judiciário brasileiro.
                    </p>
                    <p className="text-xs text-gray-600"><strong>Foco:</strong> Jurisprudência brasileira, análise preditiva</p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-navy-900 mb-2">Projuris</h4>
                    <p className="text-gray-700 text-sm mb-2">
                      Sistema de gestão jurídica que incorpora recursos de automação e análise de dados para escritórios e departamentos jurídicos brasileiros.
                    </p>
                    <p className="text-xs text-gray-600"><strong>Foco:</strong> Gestão de processos, automação, análise de dados</p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-navy-900 mb-2">Justto</h4>
                    <p className="text-gray-700 text-sm mb-2">
                      Plataforma de resolução de conflitos online que utiliza IA para facilitar acordos e mediações, aumentando a eficiência na solução de disputas.
                    </p>
                    <p className="text-xs text-gray-600"><strong>Foco:</strong> Resolução alternativa de conflitos, mediação online</p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-navy-900 mb-2">SAJ Tribunais</h4>
                    <p className="text-gray-700 text-sm mb-2">
                      Sistema de processo judicial eletrônico que incorpora recursos de automação e inteligência artificial para gestão processual em tribunais brasileiros.
                    </p>
                    <p className="text-xs text-gray-600"><strong>Foco:</strong> Gestão processual, tribunais brasileiros</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-cream-100 border border-gold-300 p-4 rounded-lg">
              <p className="text-sm text-gray-800">
                <strong>💡 Dica:</strong> A escolha da ferramenta ideal depende das necessidades específicas de cada profissional ou escritório. Muitas plataformas oferecem períodos de teste gratuito, permitindo avaliar qual se adequa melhor ao seu fluxo de trabalho. É fundamental que advogados mantenham-se atualizados sobre essas tecnologias, pois a familiaridade com ferramentas de IA está se tornando uma competência essencial na advocacia moderna.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Ponte para o Futuro e Resumo */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Perspectivas Futuras</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                O futuro da IA no direito aponta para sistemas cada vez mais sofisticados, capazes de compreensão contextual profunda, raciocínio jurídico complexo e colaboração efetiva com profissionais humanos. Espera-se que:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-4">
                <li>Assistentes de IA se tornem parceiros integrais no dia a dia jurídico</li>
                <li>Sistemas de IA auxiliem na identificação e correção de vieses em decisões judiciais</li>
                <li>A automação permita que advogados dediquem mais tempo a tarefas de alto valor e estratégia</li>
                <li>Novas regulamentações estabeleçam limites éticos e garantias para uso de IA no direito</li>
              </ul>
              <p className="text-gray-700">
                O profissional jurídico do futuro não será substituído pela IA, mas aquele que domina essas ferramentas terá vantagem significativa sobre aqueles que não o fazem.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Resumo Final</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                A <strong>Inteligência Artificial</strong> representa uma das mais significativas transformações tecnológicas da história do direito. Suas principais divisões — Machine Learning, Deep Learning, Processamento de Linguagem Natural, Visão Computacional e Sistemas Especialistas — oferecem ferramentas poderosas para:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-4">
                <li>Aumentar a eficiência e precisão na pesquisa jurídica</li>
                <li>Automatizar tarefas repetitivas e análise documental</li>
                <li>Fornecer insights preditivos baseados em dados</li>
                <li>Democratizar o acesso à justiça</li>
                <li>Permitir que advogados foquem em trabalho de maior valor agregado</li>
              </ul>
              <p className="text-gray-700">
                As ferramentas disponíveis hoje — desde plataformas generativas como ChatGPT até soluções especializadas como Harvey AI e Turivius — demonstram o potencial transformador da IA. Compreender esses conceitos e dominar essas ferramentas não é mais opcional, mas essencial para qualquer profissional do direito que deseja se manter relevante e competitivo no século XXI.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
