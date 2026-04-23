import Layout from "@/components/layout/Layout";
import { Target, Eye, Heart, BookOpen, Users, Lightbulb, Calendar, FileText, Loader2 } from "lucide-react";
import { useMembros } from "@/hooks/useMembros";

const Sobre = () => {
  const { membros: coordenadores, loading: loadingCoordenadores } = useMembros({ tipo: 'coordenador' });
  const { membros: presidentes, loading: loadingPresidentes } = useMembros({ tipo: 'presidente' });
  const { membros: diretores, loading: loadingDiretores } = useMembros({ tipo: 'diretor' });

  const loading = loadingCoordenadores || loadingPresidentes || loadingDiretores;
  const coordenador = coordenadores[0];
  const presidente = presidentes[0];

  return (
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
        <h1 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground mb-4">Sobre o LIDA</h1>
        <p className="text-primary-foreground/70 text-lg">Laboratório de Inteligência e Direito Aplicado — PUC-SP</p>
      </div>
    </section>

    <section className="section-padding-top-sm">
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
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : (
          <>
            {/* Coordenador */}
            {coordenador && (
              <div className="mb-12">
                <div className="glass rounded-2xl p-8 max-w-3xl mx-auto">
                  <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-br from-gold to-gold-dark rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
                      <img 
                        src={coordenador.foto_url} 
                        alt={coordenador.nome} 
                        className="relative w-32 h-32 rounded-2xl object-cover border-4 border-gold/20 group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-gold to-gold-dark text-navy text-xs font-bold mb-3">
                        {coordenador.cargo}
                      </span>
                      <h3 className="font-display font-bold text-2xl mb-2 text-gradient">{coordenador.nome}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {coordenador.bio}
                      </p>
                      {coordenador.linkedin_url && (
                        <a 
                          href={coordenador.linkedin_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 mt-4 text-gold hover:text-gold-dark transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/>
                          </svg>
                          Ver perfil no LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Presidente */}
            {presidente && (
              <div className="mb-12">
                <div className="glass rounded-2xl p-8 max-w-3xl mx-auto ring-2 ring-gold/30 shadow-2xl shadow-gold/10">
                  <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-br from-gold via-gold-dark to-gold rounded-2xl blur-2xl opacity-40 group-hover:opacity-60 transition-opacity" />
                      <img 
                        src={presidente.foto_url} 
                        alt={presidente.nome} 
                        className="relative w-32 h-32 rounded-2xl object-cover border-4 border-gold/40 group-hover:scale-105 transition-transform duration-300 shadow-xl"
                      />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-gold via-gold-dark to-gold text-navy text-xs font-bold mb-3 shadow-lg shadow-gold/30">
                        {presidente.cargo}
                      </span>
                      <h3 className="font-display font-bold text-2xl mb-2 bg-gradient-to-r from-gold via-gold-dark to-gold bg-clip-text text-transparent">
                        {presidente.nome}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {presidente.bio}
                      </p>
                      {presidente.linkedin_url && (
                        <a 
                          href={presidente.linkedin_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 mt-4 text-gold hover:text-gold-dark transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/>
                          </svg>
                          Ver perfil no LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Diretoria */}
            <div className="flex flex-wrap justify-center gap-6 mb-16">
              {diretores.map((member) => (
                <div 
                  key={member.id} 
                  className={`glass rounded-2xl p-5 card-hover group w-full sm:w-64 ${
                    member.is_founder 
                      ? 'ring-2 ring-gold/50 shadow-xl shadow-gold/20 hover:ring-gold/70' 
                      : ''
                  }`}
                >
                  <div className="relative mb-4">
                    <div className={`absolute inset-0 ${
                      member.is_founder 
                        ? 'bg-gradient-to-br from-gold to-gold-dark' 
                        : 'bg-gradient-to-br from-navy to-navy-light'
                    } rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity`} />
                    <img 
                      src={member.foto_url} 
                      alt={member.nome}
                      className={`relative w-full aspect-square object-cover rounded-xl border-2 ${
                        member.is_founder ? 'border-gold/30' : 'border-navy/10'
                      } group-hover:scale-105 transition-transform duration-300`}
                    />
                  </div>
                  <div className="flex justify-center items-center gap-2 mb-3 min-h-[28px]">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                      member.is_founder 
                        ? 'bg-gradient-to-r from-gold to-gold-dark text-navy shadow-lg shadow-gold/20' 
                        : 'bg-navy/5 text-navy'
                    }`}>
                      {member.cargo}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg mb-3 text-center">{member.nome}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 text-center">{member.bio}</p>
                  {member.linkedin_url && (
                    <a 
                      href={member.linkedin_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 text-navy hover:text-navy-light transition-colors text-sm"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/>
                      </svg>
                      LinkedIn
                    </a>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

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
};

export default Sobre;
