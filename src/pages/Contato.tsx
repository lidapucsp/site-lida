import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Instagram, Mail, Send } from "lucide-react";
import { useState } from "react";

const Contato = () => {
  const [form, setForm] = useState({ nome: "", email: "", assunto: "", mensagem: "" });

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
          <h1 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground mb-4">Contato</h1>
          <p className="text-primary-foreground/70 text-lg">Fale com o LIDA — dúvidas, sugestões, parcerias e convites.</p>
        </div>
      </section>

      <section className="section-padding-top-sm">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-xl font-display font-bold mb-4">Envie sua mensagem</h2>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="text-sm font-medium mb-1 block">Nome</label>
                  <input className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm" value={form.nome} onChange={(e) => setForm({...form, nome: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">E-mail</label>
                  <input type="email" className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Assunto</label>
                  <input className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm" value={form.assunto} onChange={(e) => setForm({...form, assunto: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Mensagem</label>
                  <textarea rows={5} className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm resize-none" value={form.mensagem} onChange={(e) => setForm({...form, mensagem: e.target.value})} />
                </div>
                <Button variant="hero"><Send className="w-4 h-4 mr-1" /> Enviar mensagem</Button>
              </form>
            </div>

            <div>
              <h2 className="text-xl font-display font-bold mb-4">Informações</h2>
              <div className="space-y-4 mb-8">
                <a href="https://instagram.com/lidapucsp" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border card-hover">
                  <Instagram className="w-5 h-5 text-gold" />
                  <div><p className="font-medium text-sm">Instagram</p><p className="text-xs text-muted-foreground">@lidapucsp</p></div>
                </a>
                <a href="mailto:lidapucsp@gmail.com" className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border card-hover">
                  <Mail className="w-5 h-5 text-gold" />
                  <div><p className="font-medium text-sm">E-mail</p><p className="text-xs text-muted-foreground">lidapucsp@gmail.com</p></div>
                </a>
              </div>

              <h3 className="font-display font-bold mb-3">Parcerias e Convites</h3>
              <div className="bg-cream rounded-xl border border-border p-5 text-sm text-muted-foreground">
                <p className="mb-2">O LIDA está aberto a parcerias com outros grupos de pesquisa, escritórios de advocacia, empresas de tecnologia e instituições acadêmicas.</p>
                <p>Para convites de eventos, palestras ou colaborações, envie um e-mail detalhando a proposta para <strong className="text-foreground">lidapucsp@gmail.com</strong>.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contato;
