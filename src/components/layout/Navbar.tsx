import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Início", path: "/" },
  { label: "Sobre", path: "/sobre" },
  { label: "Eixos", path: "/eixos" },
  { label: "Publicações", path: "/publicacoes" },
  { label: "Eventos", path: "/eventos" },
  { label: "Seletivo", path: "/processo-seletivo" },
  { label: "Calendário", path: "/calendario" },
  { label: "Contato", path: "/contato" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-gold/10 shadow-xl">
      <div className="container mx-auto flex items-center justify-between h-20 px-4">
        <Link to="/" className="flex items-center gap-3 group">
          <img 
            src="/LIDA-logo.PNG" 
            alt="LIDA Logo" 
            className="h-12 w-auto object-contain group-hover:scale-110 transition-transform duration-300" 
          />
          <span className="text-primary-foreground font-display text-2xl font-extrabold tracking-tight">LIDA</span>
        </Link>

        {/* Desktop */}
        <nav className="hidden lg:flex items-center gap-2">
          {navLinks.map((l) => (
            <Link
              key={l.path}
              to={l.path}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                location.pathname === l.path
                  ? "text-gold bg-gold/10 shadow-lg shadow-gold/10"
                  : "text-primary-foreground/80 hover:text-gold hover:bg-primary-foreground/5"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Button variant="hero" size="sm" className="hidden lg:inline-flex shadow-lg shadow-gold/20" asChild>
          <Link to="/membros">
            <User className="w-4 h-4 mr-2" />
            Área de Membros
          </Link>
        </Button>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden text-primary-foreground p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors"
          aria-label="Menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="lg:hidden glass-dark border-t border-gold/10 animate-fade-in shadow-2xl">
          <div className="container mx-auto px-4 py-6 flex flex-col gap-2">
            {navLinks.map((l) => (
              <Link
                key={l.path}
                to={l.path}
                onClick={() => setOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  location.pathname === l.path
                    ? "text-gold bg-gold/10 shadow-lg"
                    : "text-primary-foreground/80 hover:bg-primary-foreground/5"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Button variant="hero" size="sm" className="mt-3 shadow-lg shadow-gold/20" asChild>
              <Link to="/membros" onClick={() => setOpen(false)}>
                <User className="w-4 h-4 mr-2" />
                Área de Membros
              </Link>
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
