import { useEffect, useRef } from 'react';

interface UseKanbanScrollOptions {
  hasManyColumns?: boolean;
}

export const useKanbanScroll = (options?: UseKanbanScrollOptions) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { hasManyColumns = false } = options || {};

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Verificar se o container tem scroll horizontal disponível
    const hasHorizontalScroll = () => {
      return container.scrollWidth > container.clientWidth;
    };

    // Só ativar scroll se houver 5+ colunas
    // IMPORTANTE: Se não houver muitas colunas, não adicionar nenhum listener
    // Isso garante que o scroll vertical funcione normalmente em toda a aplicação
    if (!hasManyColumns) {
      return;
    }

    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Não iniciar scroll drag se estiver em elementos interativos ou cards de tarefa
      if (
        target.closest(
          'button, input, textarea, select, a, [role="button"], .task-card, .column-header, [data-rbd-draggable-id], [data-rbd-drag-handle-draggable-id]'
        )
      ) {
        return;
      }

      isDragging = true;
      startX = e.pageX;
      scrollLeft = container.scrollLeft;
      container.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX;
      const walk = (x - startX) * 2;
      container.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
      isDragging = false;
      container.style.cursor = 'grab';
      document.body.style.userSelect = '';
    };

    const handleWheel = (e: WheelEvent) => {
      // Verificar se o evento está realmente dentro do container do Kanban
      const rect = container.getBoundingClientRect();
      const isInsideContainer =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      // Se não estiver dentro do container, não interferir - deixar scroll normal
      // IMPORTANTE: Não fazer nada, deixar o evento propagar normalmente
      if (!isInsideContainer) {
        return;
      }

      // Só interferir se Shift estiver explicitamente pressionado
      // E houver scroll horizontal disponível
      if (!e.shiftKey) {
        // Se Shift não estiver pressionado, permitir scroll vertical normal
        // IMPORTANTE: Não fazer preventDefault, deixar o evento propagar normalmente
        // O navegador vai processar o scroll vertical normalmente
        return;
      }

      // Shift está pressionado E está dentro do container - fazer scroll horizontal
      if (hasHorizontalScroll()) {
        // Fazer scroll horizontal apenas quando Shift está pressionado
        e.preventDefault();
        e.stopPropagation();
        container.scrollLeft += e.deltaY;
      } else {
        // Se não houver scroll horizontal, permitir scroll vertical normal
        return;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Scroll com setas do teclado - apenas quando há 5+ colunas
      if (!hasManyColumns) return;

      // Scroll com setas do teclado - funcionar sempre que não estiver em input/textarea
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable ||
        target.closest('input, textarea, [contenteditable]');

      if (isInput) {
        return; // Não interferir com inputs
      }

      // Verificar se o container tem scroll horizontal disponível
      if (!hasHorizontalScroll()) {
        return; // Não fazer nada se não houver scroll horizontal
      }

      // Verificar se está dentro do kanban ou se não há nenhum elemento focado que precise das setas
      const activeElement = document.activeElement as HTMLElement;
      const isInKanban =
        container.contains(target) || target.closest('[data-kanban-board]');
      const isBodyOrKanban =
        !activeElement ||
        activeElement === document.body ||
        activeElement === document.documentElement ||
        container.contains(activeElement) ||
        activeElement.closest('[data-kanban-board]');

      // Permitir setas se estiver no kanban ou se nenhum elemento específico estiver focado
      if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && isBodyOrKanban) {
        // Não interferir se estiver em um modal ou dropdown aberto
        const isInModal = target.closest(
          '[role="dialog"], [role="menu"], .modal, .dropdown'
        );
        if (isInModal) {
          return;
        }

        // Não interferir se estiver em um select ou menu
        if (target.closest('select, [role="listbox"]')) {
          return;
        }

        e.preventDefault();
        e.stopPropagation();

        if (e.key === 'ArrowLeft') {
          container.scrollLeft -= 150;
        } else if (e.key === 'ArrowRight') {
          container.scrollLeft += 150;
        }
      }
    };

    container.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    // IMPORTANTE: Usar passive: false para poder fazer preventDefault quando Shift está pressionado
    // Mas o handler só faz preventDefault quando Shift está pressionado E está dentro do container
    // Isso garante que o scroll vertical normal funcione quando Shift não está pressionado
    container.addEventListener('wheel', handleWheel, {
      passive: false,
      capture: false,
    });
    // Adicionar listener no document para capturar setas em qualquer lugar
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('wheel', handleWheel);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [hasManyColumns]);

  return containerRef;
};
