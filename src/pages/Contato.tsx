import Layout from "@/components/layout/Layout";
import PageHero from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Instagram, Mail, Send, Loader2, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

const Contato = () => {
  const [form, setForm] = useState({ nome: "", email: "", assunto: "", mensagem: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (!form.nome || !form.email || !form.assunto || !form.mensagem) {
      setMessage({ type: 'error', text: 'Por favor, preencha todos os campos' });
      return;
    }

    if (!form.email.includes('@')) {
      setMessage({ type: 'error', text: 'Por favor, insira um email válido' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('contatos')
        .insert([{
          nome: form.nome,
          email: form.email,
          assunto: form.assunto,
          mensagem: form.mensagem
        }]);

      if (error) throw error;

      setMessage({ 
        type: 'success', 
        text: 'Mensagem enviada com sucesso! Entraremos em contato em breve.' 
      });
      setForm({ nome: "", email: "", assunto: "", mensagem: "" });
    } catch (error: any) {
      console.error('Erro ao enviar mensagem:', error);
      setMessage({ 
        type: 'error', 
        text: 'Erro ao enviar mensagem. Tente novamente ou entre em contato por email.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <PageHero eyebrow="Fale conosco" title="Contato" subtitle="Fale com o LIDA — dúvidas, sugestões, parcerias e convites." />

      <section className="section-padding bg-cream">
        <div className="container mx-auto max-w-4xl">
          {/* Mensagem de feedback */}
          {message && (
            <Alert 
              variant={message.type === 'error' ? 'destructive' : 'default'} 
              className={`mb-6 ${message.type === 'success' ? 'bg-green-100 border-2 border-green-600' : 'border-gold/30'}`}
            >
              {message.type === 'success' && <CheckCircle2 className="h-5 w-5 text-green-600" />}
              <AlertDescription className={message.type === 'success' ? 'text-green-900 font-medium' : ''}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid md:grid-cols-2 gap-10">
            <div className="card-light reveal">
              <h2 className="text-2xl font-display font-bold mb-6 text-navy">Envie sua mensagem</h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="text-xs font-bold uppercase tracking-[0.15em] text-gold-dark mb-1.5 block">Nome</label>
                  <input 
                    required
                    className="field" 
                    value={form.nome} 
                    onChange={(e) => setForm({...form, nome: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-[0.15em] text-gold-dark mb-1.5 block">E-mail</label>
                  <input 
                    type="email" 
                    required
                    className="field" 
                    value={form.email} 
                    onChange={(e) => setForm({...form, email: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-[0.15em] text-gold-dark mb-1.5 block">Assunto</label>
                  <input 
                    required
                    className="field" 
                    value={form.assunto} 
                    onChange={(e) => setForm({...form, assunto: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-[0.15em] text-gold-dark mb-1.5 block">Mensagem</label>
                  <textarea 
                    rows={5} 
                    required
                    className="field resize-none" 
                    value={form.mensagem} 
                    onChange={(e) => setForm({...form, mensagem: e.target.value})} 
                  />
                </div>
                <Button type="submit" variant="hero" disabled={loading} className="btn-sweep">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-1" />
                      Enviar mensagem
                    </>
                  )}
                </Button>
              </form>
            </div>

            <div className="reveal" style={{ "--reveal-delay": "150ms" } as React.CSSProperties}>
              <h2 className="text-2xl font-display font-bold mb-6 text-navy">Informações</h2>
              <div className="space-y-4 mb-8">
                <a href="https://instagram.com/lidapucsp" target="_blank" rel="noopener noreferrer" className="card-light !p-4 flex items-center gap-3 group">
                  <Instagram className="w-5 h-5 text-gold-dark group-hover:scale-110 transition-transform" />
                  <div><p className="font-medium text-sm">Instagram</p><p className="text-xs text-muted-foreground">@lidapucsp</p></div>
                </a>
                <a href="mailto:lidapucsp@gmail.com" className="card-light !p-4 flex items-center gap-3 group">
                  <Mail className="w-5 h-5 text-gold-dark group-hover:scale-110 transition-transform" />
                  <div><p className="font-medium text-sm">E-mail</p><p className="text-xs text-muted-foreground">lidapucsp@gmail.com</p></div>
                </a>
              </div>

              <h3 className="font-display font-bold mb-3 text-navy">Parcerias e Convites</h3>
              <div className="rounded-2xl bg-navy-deep p-6 text-sm text-primary-foreground/75 leading-relaxed">
                <p className="mb-2">O LIDA está aberto a parcerias com outros grupos de pesquisa, escritórios de advocacia, empresas de tecnologia e instituições acadêmicas.</p>
                <p>Para convites de eventos, palestras ou colaborações, utilize o <strong className="text-gold">formulário de contato ao lado</strong> detalhando sua proposta.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contato;
