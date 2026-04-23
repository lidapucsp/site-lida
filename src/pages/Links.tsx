import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText, FolderOpen, Newspaper, BookOpen, Shield } from "lucide-react";

const links = [
  { icon: FileText, label: "Formulário de Inscrição — Processo Seletivo", desc: "Acesse o formulário para se inscrever no LIDA.", href: "#" },
  { icon: FolderOpen, label: "Documentos e Editais", desc: "Editais, regulamentos e documentos oficiais do LIDA.", href: "#" },
  { icon: FolderOpen, label: "Drive / Notion do LIDA", desc: "Acesso ao repositório compartilhado de materiais.", href: "#" },
  { icon: Newspaper, label: "Mídia / Press Kit", desc: "Logotipos, descrições e materiais para imprensa.", href: "#" },
  { icon: BookOpen, label: "Publicações e Produção Intelectual", desc: "Acesse artigos, notas técnicas e relatórios.", href: "/publicacoes" },
  { icon: Shield, label: "Código de Conduta", desc: "Nosso código de conduta e princípios éticos.", href: "#" },
];

const Links = () => (
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
        <h1 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground mb-4">Links Úteis</h1>
        <p className="text-primary-foreground/70 text-lg">Central de links e recursos do LIDA.</p>
      </div>
    </section>

    <section className="section-padding-top-sm">
      <div className="container mx-auto max-w-2xl space-y-3">
        {links.map((l) => (
          <a key={l.label} href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
            className="flex items-center gap-4 p-5 bg-card rounded-xl border border-border card-hover group">
            <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
              <l.icon className="w-5 h-5 text-gold-dark" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{l.label}</p>
              <p className="text-xs text-muted-foreground">{l.desc}</p>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </a>
        ))}
      </div>
    </section>
  </Layout>
);

export default Links;
