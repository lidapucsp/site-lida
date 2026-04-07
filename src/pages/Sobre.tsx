import Layout from "@/components/layout/Layout";
import { Target, Eye, Heart, BookOpen, Users, Lightbulb, Calendar, FileText } from "lucide-react";

const Sobre = () => (
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
        <h1 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground mb-4">Sobre o LIDA</h1>
        <p className="text-primary-foreground/70 text-lg">Laboratório de Inteligência e Direito Aplicado — PUC-SP</p>
      </div>
    </section>

    <section className="section-padding">
      <div className="container mx-auto max-w-4xl">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            { icon: Target, title: "Missão", text: "Produzir conhecimento crítico e aplicado sobre os impactos da Inteligência Artificial no Direito, formando profissionais preparados para os desafios da transformação digital." },
            { icon: Eye, title: "Visão", text: "Ser referência acadêmica na intersecção entre tecnologia e Direito, promovendo pesquisa de excelência e debate qualificado no cenário brasileiro e internacional." },
            { icon: Heart, title: "Valores", text: "Rigor acadêmico, pensamento crítico, colaboração, inovação responsável, acessibilidade do conhecimento e compromisso ético com a sociedade." },
          ].map((item) => (
            <div key={item.title} className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center mb-4">
                <item.icon className="w-6 h-6 text-gold-dark" />
              </div>
              <h2 className="font-display font-bold text-xl mb-3">{item.title}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-display font-bold mb-6">O que fazemos</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-16">
          {[
            { icon: BookOpen, label: "Pesquisa acadêmica", desc: "Investigações sobre regulação, ética e aplicação de IA no Direito." },
            { icon: Users, label: "Grupos de estudo", desc: "Encontros periódicos para leitura e debate de temas contemporâneos." },
            { icon: Lightbulb, label: "Projetos aplicados", desc: "Iniciativas práticas como mapeamentos, guias e análises técnicas." },
            { icon: Calendar, label: "Eventos e seminários", desc: "Palestras, workshops e mesas redondas com especialistas." },
            { icon: FileText, label: "Produção intelectual", desc: "Artigos, notas técnicas, relatórios e publicações acadêmicas." },
            { icon: Target, label: "Extensão universitária", desc: "Atividades que conectam a academia à sociedade e ao mercado." },
          ].map((a) => (
            <div key={a.label} className="flex gap-4 p-4 rounded-lg bg-cream border border-border">
              <a.icon className="w-5 h-5 text-navy shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">{a.label}</h3>
                <p className="text-muted-foreground text-sm">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-2xl md:text-3xl font-display font-bold mb-8 text-center text-gradient">Nosso Time</h2>
        
        {/* Coordenador */}
        <div className="mb-12">
          <div className="glass rounded-2xl p-8 max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-gold to-gold-dark rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
                <img 
                  src="/Jose-foto.jpeg" 
                  alt="Prof. Dr. José de Jesus Filho" 
                  className="relative w-32 h-32 rounded-2xl object-cover border-4 border-gold/20 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-gold to-gold-dark text-navy text-xs font-bold mb-3">
                  Professor Orientador
                </span>
                <h3 className="font-display font-bold text-2xl mb-2 text-gradient">Prof. Dr. José de Jesus Filho</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Doutor e professor na PUC-SP, especialista em Direito e Tecnologia. Coordena o LIDA com foco em pesquisa aplicada sobre IA e Sistema de Justiça, orientando projetos que conectam rigor acadêmico à transformação digital do campo jurídico.
                </p>
                <a 
                  href="https://www.linkedin.com/in/jjesusfilho/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-gold hover:text-gold-dark transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/>
                  </svg>
                  Ver perfil no LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Diretoria */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            {
              name: "Marília Affonso",
              role: "Diretora Acadêmica",
              image: "/Marilia-foto.jpeg",
              linkedin: "https://www.linkedin.com/in/mar%C3%ADlia-affonso-9024763b3/",
              bio: "Responsável pela coordenação das atividades acadêmicas do LIDA, incluindo grupos de estudo, projetos de pesquisa e produção científica, garantindo rigor metodológico e excelência nas publicações."
            },
            {
              name: "Giovanna P. Andrade",
              role: "Diretora de Comunicação",
              image: "/Giovanna-foto.jpeg",
              linkedin: "https://www.linkedin.com/in/giovannapandrade/",
              bio: "Gerencia a comunicação institucional do LIDA, coordenando redes sociais, divulgação de eventos, relacionamento com a comunidade acadêmica e estratégias de engajamento digital."
            },
            {
              name: "Felipe Toshio Kamishibahara",
              role: "Diretor Administrativo",
              image: "/Felipe-foto.jpeg",
              linkedin: "https://www.linkedin.com/in/felipe-toshio-kamishibahara-44822537a/",
              bio: "Coordena a gestão administrativa e organizacional do laboratório, incluindo planejamento de atividades, controle de participação, logística de eventos e processos seletivos."
            }
          ].map((member) => (
            <div key={member.name} className="glass rounded-2xl p-6 card-hover group">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-navy to-navy-light rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="relative w-full aspect-square object-cover rounded-xl border-2 border-navy/10 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <span className="inline-block px-2.5 py-1 rounded-full bg-navy/5 text-navy text-xs font-semibold mb-3">
                {member.role}
              </span>
              <h3 className="font-display font-bold text-lg mb-3">{member.name}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{member.bio}</p>
              <a 
                href={member.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-navy hover:text-navy-light transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/>
                </svg>
                LinkedIn
              </a>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-display font-bold mb-6">Perguntas que nos movem</h2>
        <ul className="space-y-3 text-muted-foreground">
          {[
            "O Direito está preparado para a era da Inteligência Artificial?",
            "Como regular tecnologias que evoluem mais rápido que as leis?",
            "Sistemas de IA podem ser responsabilizados por decisões injustas?",
            "Como garantir transparência e equidade em algoritmos?",
            "Qual o papel do jurista na transformação digital?",
          ].map((q) => (
            <li key={q} className="flex gap-3 items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0" />
              <span>{q}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  </Layout>
);

export default Sobre;
