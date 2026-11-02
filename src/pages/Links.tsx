import Layout from "@/components/layout/Layout";
import PageHero from "@/components/layout/PageHero";
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
    <PageHero eyebrow="Recursos" title="Links Úteis" subtitle="Central de links e recursos do LIDA." />

    <section className="section-padding bg-cream">
      <div className="container mx-auto max-w-2xl space-y-4 reveal-grid">
        {links.map((l) => (
          <a key={l.label} href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
            className="card-light !p-5 flex items-center gap-4 group reveal">
            <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0 group-hover:bg-gold transition-colors duration-500">
              <l.icon className="w-5 h-5 text-gold-dark group-hover:text-navy transition-colors" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm text-navy group-hover:text-gold-dark transition-colors">{l.label}</p>
              <p className="text-xs text-muted-foreground">{l.desc}</p>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-gold-dark group-hover:translate-x-1 transition-all" />
          </a>
        ))}
      </div>
    </section>
  </Layout>
);

export default Links;
