import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Componente que faz scroll para o topo da página sempre que a rota muda
 * Funciona tanto com window.scroll quanto com containers de scroll internos
 */
export const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const scrollToTop = () => {
      // Scrollar o window
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' as ScrollBehavior,
      });

      // Scrollar o document.documentElement e document.body
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }
      if (document.body) {
        document.body.scrollTop = 0;
      }

      // Procurar e scrollar o MainScrollArea (container principal de scroll)
      const mainScrollArea = document.querySelector(
        '[data-scroll-container="main"]'
      ) as HTMLElement;
      if (mainScrollArea) {
        mainScrollArea.scrollTop = 0;
      }

      // Procurar por qualquer elemento com overflow-y: auto ou scroll
      const scrollableElements = document.querySelectorAll(
        '[style*="overflow-y"], [class*="scroll"]'
      );
      scrollableElements.forEach(element => {
        const htmlElement = element as HTMLElement;
        const style = window.getComputedStyle(htmlElement);
        if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
          htmlElement.scrollTop = 0;
        }
      });
    };

    // Scroll imediato
    scrollToTop();

    // Scroll após requestAnimationFrame (garante que o DOM foi atualizado)
    requestAnimationFrame(() => {
      scrollToTop();
    });

    // Scroll após um pequeno delay (para conteúdo assíncrono)
    const timeout1 = setTimeout(() => {
      scrollToTop();
    }, 0);

    // Scroll após um delay maior (para lazy loading)
    const timeout2 = setTimeout(() => {
      scrollToTop();
    }, 100);

    // Scroll após um delay ainda maior (para casos extremos)
    const timeout3 = setTimeout(() => {
      scrollToTop();
    }, 300);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }, [pathname]);

  return null;
};

export default ScrollToTop;
