import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <section className="relative bg-navy-deep overflow-hidden -mt-16 pt-16 min-h-[85vh] flex items-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,hsl(var(--navy-light)/0.55),transparent_60%)]" />
        <div className="container mx-auto px-4 py-24 text-center relative z-10">
          <span className="eyebrow mb-6">Página não encontrada</span>
          <h1 className="text-8xl md:text-9xl font-display font-extrabold text-hero-gradient mb-4">404</h1>
          <p className="text-primary-foreground/70 text-xl max-w-xl mx-auto mb-10">
            O endereço que você tentou acessar não existe ou foi movido.
          </p>
          <Button variant="hero" size="lg" asChild className="group btn-sweep">
            <Link to="/">
              Voltar ao início
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
