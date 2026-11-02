import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("lida-cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("lida-cookie-consent", "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-navy-deep/95 backdrop-blur-xl border-t border-gold/20 shadow-2xl animate-fade-in-up p-4">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-primary-foreground/75">
          Utilizamos cookies para melhorar sua experiência.{" "}
          <Link to="/cookies" className="underline text-gold hover:text-gold-light">Saiba mais</Link>.
        </p>
        <div className="flex gap-2">
          <Button size="sm" variant="hero-outline" asChild>
            <Link to="/cookies">Configurar</Link>
          </Button>
          <Button size="sm" variant="hero" onClick={accept}>Aceitar</Button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
