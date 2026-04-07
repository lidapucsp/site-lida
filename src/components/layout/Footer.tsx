import { Link } from "react-router-dom";
import { Scale, Instagram, Mail } from "lucide-react";

const Footer = () => (
  <footer className="bg-navy text-primary-foreground">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center">
              <Scale className="w-4 h-4 text-accent-foreground" />
            </div>
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
              ["Sobre", "/sobre"], ["Eixos", "/eixos"], ["Projetos", "/projetos"],
              ["Publicações", "/publicacoes"], ["Eventos", "/eventos"],
            ].map(([l, p]) => (
              <li key={p}><Link to={p} className="hover:text-primary-foreground transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-3 text-gold">Institucional</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            {[
              ["Processo Seletivo", "/processo-seletivo"], ["Calendário", "/calendario"],
              ["Links Úteis", "/links"], ["Contato", "/contato"],
            ].map(([l, p]) => (
              <li key={p}><Link to={p} className="hover:text-primary-foreground transition-colors">{l}</Link></li>
            ))}
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
