import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  /** Atraso em ms, útil para escalonar itens de uma grade */
  delay?: number;
  className?: string;
  as?: ElementType;
}

/** Faz o conteúdo subir e aparecer ao entrar na tela. Requer `useScrollReveal` (hooks/useScrollReveal, já ativo no Layout). */
export function Reveal({ children, delay = 0, className, as: Tag = "div" }: RevealProps) {
  return (
    <Tag className={cn("reveal", className)} style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}>
      {children}
    </Tag>
  );
}
