import { useEffect } from "react";

/**
 * Observa todos os elementos com a classe `.reveal` e adiciona `.is-visible`
 * quando entram na tela (ver .reveal em index.css). Usado uma vez no Layout;
 * qualquer elemento do site pode ganhar a animação só com a classe `reveal`
 * (e `reveal-grid` no pai para escalonar os filhos).
 */
export function useScrollReveal() {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    const scan = () => {
      document.querySelectorAll(".reveal:not([data-reveal-seen])").forEach((el) => {
        el.setAttribute("data-reveal-seen", "1");
        io.observe(el);
      });
    };

    scan();
    // Conteúdo carregado depois (ex.: dados do Supabase) também precisa ser observado
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
}
