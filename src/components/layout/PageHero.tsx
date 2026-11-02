import type { ReactNode } from "react";

interface PageHeroProps {
  title: string;
  subtitle?: ReactNode;
  /** Rótulo em pílula acima do título */
  eyebrow?: string;
  children?: ReactNode;
}

/** Cabeçalho escuro padrão das páginas internas do site institucional. */
const PageHero = ({ title, subtitle, eyebrow, children }: PageHeroProps) => (
  <section className="relative bg-navy-deep overflow-hidden -mt-16 pt-16">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_0%,hsl(var(--navy-light)/0.55),transparent_55%),radial-gradient(ellipse_at_90%_100%,hsl(var(--sky)/0.15),transparent_50%)]" />
    <div
      className="absolute inset-0 opacity-[0.12]"
      style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--gold) / 0.6) 1px, transparent 0)",
        backgroundSize: "48px 48px",
        maskImage: "radial-gradient(ellipse at center, black 25%, transparent 75%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 25%, transparent 75%)",
      }}
    />
    <div className="absolute -top-20 -right-20 w-80 h-80 bg-gold/10 rounded-full blur-3xl animate-float" />

    <div className="container mx-auto max-w-4xl text-center relative z-10 px-4 py-16 md:py-24">
      {eyebrow && <span className="eyebrow mb-6 animate-fade-in-up">{eyebrow}</span>}
      <h1 className="text-4xl md:text-6xl font-display font-extrabold text-hero-gradient leading-tight mb-5 animate-fade-in-up animate-delay-100">
        {title}
      </h1>
      {subtitle && (
        <p className="text-primary-foreground/70 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto animate-fade-in-up animate-delay-200">
          {subtitle}
        </p>
      )}
      {children && <div className="mt-8 animate-fade-in-up animate-delay-300">{children}</div>}
    </div>
  </section>
);

export default PageHero;
