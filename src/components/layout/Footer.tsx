import { Link } from "react-router-dom";
import { Scale, Instagram, Mail } from "lucide-react";

const Footer = () => (
  <footer className="bg-navy text-primary-foreground">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img 
              src="/LIDA-logo.PNG" 
              alt="LIDA Logo" 
              className="h-8 w-auto object-contain" 
            />
            <span className="font-display text-lg font-bold">LIDA</span>
          </div>
          <p className="text-sm text-primary-foreground/70 leading-relaxed">
            Laboratório de Inteligência e Direito Aplicado — PUC-SP. Conteúdo educacional e institucional.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-3 text-gold">Navegação</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            {[
              ["Início", "/"], ["Sobre", "/sobre"], ["Eixos", "/eixos"],
              ["Publicações", "/publicacoes"], ["Eventos", "/eventos"],
              ["Conceitos", "/conceitos"],
            ].map(([l, p]) => (
              <li key={p}><Link to={p} className="hover:text-primary-foreground transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-3 text-gold">Institucional</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            <li><Link to="/processo-seletivo" className="hover:text-primary-foreground transition-colors">Processo Seletivo</Link></li>
            <li><a href="https://forms.gle/cLmgoubo87g31oqS6" target="_blank" rel="noopener noreferrer" className="hover:text-primary-foreground transition-colors">Inscrever-se</a></li>
            <li><a href="https://drive.google.com/file/d/1MN7WpRxoYP6SZC_1zZpwbMWrMilSgHqR/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="hover:text-primary-foreground transition-colors">Edital 2026.1</a></li>
            <li><Link to="/calendario" className="hover:text-primary-foreground transition-colors">Calendário</Link></li>
            <li><Link to="/contato" className="hover:text-primary-foreground transition-colors">Contato</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-3 text-gold">Contato</h4>
          <div className="space-y-3 text-sm text-primary-foreground/70">
            <a href="https://instagram.com/lidapucsp" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary-foreground transition-colors">
              <Instagram className="w-4 h-4" /> @lidapucsp
            </a>
            <a href="mailto:lidapucsp@gmail.com" className="flex items-center gap-2 hover:text-primary-foreground transition-colors">
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
