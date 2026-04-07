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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t shadow-lg animate-fade-in-up p-4">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Utilizamos cookies para melhorar sua experiência.{" "}
          <Link to="/cookies" className="underline text-foreground">Saiba mais</Link>.
        </p>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" asChild>
            <Link to="/cookies">Configurar</Link>
          </Button>
          <Button size="sm" onClick={accept}>Aceitar</Button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
