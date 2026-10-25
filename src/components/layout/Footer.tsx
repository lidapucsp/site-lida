import { Link } from "react-router-dom";
import { Scale, Instagram, Mail } from "lucide-react";

const Footer = () => (
  <footer className="relative bg-navy-deep text-primary-foreground overflow-hidden">
    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_130%,hsl(var(--navy-light)/0.45),transparent_60%)]" />
    <div className="container mx-auto px-4 py-14 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img 
              src="/LIDA-logo-branco.PNG" 
              alt="LIDA Logo" 
              className="h-10 w-auto object-contain" 
            />
            <span className="font-display text-lg font-bold">LIDA</span>
          </div>
          <p className="text-sm text-primary-foreground/70 leading-relaxed">
            Laboratório de Inteligência e Direito Aplicado — PUC-SP. Conteúdo educacional e institucional.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-xs uppercase tracking-[0.18em] mb-4 text-gold">Navegação</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            {[
              ["Início", "/"], ["Sobre", "/sobre"], ["Eixos", "/eixos"],
              ["Publicações", "/publicacoes"], ["Eventos", "/eventos"],
              ["Conceitos", "/conceitos"],
            ].map(([l, p]) => (
              <li key={p}><Link to={p} className="hover:text-gold transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-xs uppercase tracking-[0.18em] mb-4 text-gold">Institucional</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            <li><Link to="/processo-seletivo" className="hover:text-gold transition-colors">Processo Seletivo</Link></li>
            <li><a href="https://forms.gle/cLmgoubo87g31oqS6" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">Inscrever-se</a></li>
            <li><a href="https://drive.google.com/file/d/1MN7WpRxoYP6SZC_1zZpwbMWrMilSgHqR/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">Edital 2026.1</a></li>
            <li><Link to="/calendario" className="hover:text-gold transition-colors">Calendário</Link></li>
            <li><Link to="/contato" className="hover:text-gold transition-colors">Contato</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-xs uppercase tracking-[0.18em] mb-4 text-gold">Contato</h4>
          <div className="space-y-3 text-sm text-primary-foreground/70">
            <a href="https://instagram.com/lidapucsp" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-gold transition-colors">
              <Instagram className="w-4 h-4" /> @lidapucsp
            </a>
            <a href="mailto:lidapucsp@gmail.com" className="flex items-center gap-2 hover:text-gold transition-colors">
              <Mail className="w-4 h-4" /> lidapucsp@gmail.com
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-primary-foreground/50">
        <p>© {new Date().getFullYear()} LIDA — PUC-SP. Todos os direitos reservados.</p>
        <div className="flex gap-4">
          <Link to="/privacidade" className="hover:text-primary-foreground/80">Privacidade</Link>
          <Link to="/cookies" className="hover:text-primary-foreground/80">Cookies</Link>
          <Link to="/termos" className="hover:text-primary-foreground/80">Termos</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
