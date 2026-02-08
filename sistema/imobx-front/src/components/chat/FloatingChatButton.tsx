import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { useChatUnreadCount } from '../../hooks/useChatUnreadCount';
import { useModuleAccess } from '../../hooks/useModuleAccess';
import styled, { keyframes, css } from 'styled-components';

// Animação de entrada (bounce suave)
const slideInUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.8) rotate(-10deg);
  }
  60% {
    opacity: 1;
    transform: translateY(-4px) scale(1.05) rotate(2deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1) rotate(0deg);
  }
`;

// Animação de saída (fade out suave)
const slideOutDown = keyframes`
  0% {
    opacity: 1;
    transform: translateY(0) scale(1) rotate(0deg);
  }
  100% {
    opacity: 0;
    transform: translateY(20px) scale(0.8) rotate(10deg);
  }
`;

// Animação de pulso sutil quando aparece
const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const FloatingButtonContainer = styled.div<{ $visible: boolean }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 998; /* Abaixo das janelas de chat (z-index 1000+) mas acima da maioria dos elementos */
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: ${props => (props.$visible ? 'auto' : 'none')};

  ${props =>
    props.$visible
      ? css`
          opacity: 1;
          animation: ${slideInUp} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)
            forwards;
        `
      : css`
          opacity: 0;
          animation: ${slideOutDown} 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        `}

  @media (max-width: 768px) {
    bottom: 16px;
    right: 16px;
  }

  @media (max-width: 480px) {
    bottom: 12px;
    right: 12px;
  }
`;

const FloatingButton = styled.button<{ $justAppeared?: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary} 0%,
    ${props => props.theme.colors.primaryHover || props.theme.colors.primary}
      100%
  );
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.12),
    0 2px 4px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: visible;

  ${props =>
    props.$justAppeared &&
    css`
      animation: ${pulse} 0.6s ease-in-out 0.5s;
    `}

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    padding: 2px;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.3),
      rgba(255, 255, 255, 0.1)
    );
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: scale(1.08) translateY(-2px);
    box-shadow:
      0 8px 24px rgba(0, 0, 0, 0.16),
      0 4px 8px rgba(0, 0, 0, 0.12);

    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: scale(0.96) translateY(0);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  }

  @media (max-width: 768px) {
    width: 44px;
    height: 44px;
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
  }

  svg {
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
    width: 24px;
    height: 24px;
  }

  @media (max-width: 768px) {
    svg {
      width: 22px;
      height: 22px;
    }
  }

  @media (max-width: 480px) {
    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const Badge = styled.div`
  position: absolute;
  top: -2px;
  right: -2px;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 0 5px;
  box-shadow:
    0 2px 8px rgba(239, 68, 68, 0.4),
    0 0 0 2px ${props => props.theme.colors.cardBackground || '#ffffff'};
  border: none;
  line-height: 1;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    min-width: 16px;
    height: 16px;
    font-size: 0.625rem;
    padding: 0 4px;
    top: -1px;
    right: -1px;
    box-shadow:
      0 2px 6px rgba(239, 68, 68, 0.4),
      0 0 0 1.5px ${props => props.theme.colors.cardBackground || '#ffffff'};
  }

  @media (max-width: 480px) {
    min-width: 14px;
    height: 14px;
    font-size: 0.5625rem;
    padding: 0 3px;
  }
`;

export const FloatingChatButton: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const moduleAccess = useModuleAccess();
  const hasChatModule = moduleAccess.isModuleAvailableForCompany('chat');
  const unreadCount = useChatUnreadCount();
  const [isVisible, setIsVisible] = useState(true);
  const [justAppeared, setJustAppeared] = useState(false);

  // Verificar se está na tela de chat
  const isOnChatPage =
    location.pathname === '/chat' || location.pathname.startsWith('/chat/');

  // Verificar se está na tela de kanban
  const isOnKanbanPage =
    location.pathname === '/kanban' || location.pathname.startsWith('/kanban/');

  // Verificar se está na tela de WhatsApp
  const isOnWhatsAppPage =
    location.pathname === '/whatsapp' ||
    location.pathname.startsWith('/whatsapp/');

  // Verificar se há janelas de chat abertas
  const hasOpenChatWindows = () => {
    const chatWindows = document.querySelectorAll('[data-chat-room-id]');
    return chatWindows.length > 0;
  };

  // Verificar se algum drawer de filtro está aberto
  const hasOpenDrawer = () => {
    // Verificar todos os elementos no DOM que podem ser drawers
    const allElements = document.querySelectorAll('*');

    for (let i = 0; i < allElements.length; i++) {
      const element = allElements[i] as HTMLElement;
      const style = window.getComputedStyle(element);
      const zIndex = parseInt(style.zIndex, 10);
      const position = style.position;

      // Só verificar elementos com position fixed (drawers são fixed)
      if (position !== 'fixed') continue;

      // Verificar overlays de drawer (z-index 2000)
      if (zIndex === 2000) {
        const opacity = parseFloat(style.opacity);
        const pointerEvents = style.pointerEvents;
        const display = style.display;

        // Se o overlay está visível e interativo, o drawer está aberto
        if (display !== 'none' && opacity > 0 && pointerEvents !== 'none') {
          return true;
        }
      }

      // Verificar containers de drawer (z-index 2001)
      if (zIndex === 2001) {
        const transform = style.transform;
        const display = style.display;

        // Se o drawer não está completamente fora da tela e está visível
        if (
          display !== 'none' &&
          transform &&
          !transform.includes('translateX(100%)')
        ) {
          // Verificar se realmente está visível (não está completamente fora da tela)
          const rect = element.getBoundingClientRect();
          if (
            rect.width > 0 &&
            rect.right > 0 &&
            rect.right > window.innerWidth * 0.1
          ) {
            return true;
          }
        }
      }
    }

    return false;
  };

  // Verificar visibilidade
  useEffect(() => {
    // Se não tiver o módulo de chat, não mostrar o botão
    if (!hasChatModule) {
      setIsVisible(false);
      return;
    }

    const checkVisibility = () => {
      // Não mostrar se não tiver o módulo de chat
      if (!hasChatModule) {
        setIsVisible(false);
        setJustAppeared(false);
        return;
      }

      const shouldHide =
        isOnChatPage ||
        isOnKanbanPage ||
        isOnWhatsAppPage ||
        hasOpenChatWindows() ||
        hasOpenDrawer();
      const wasVisible = isVisible;
      const willBeVisible = !shouldHide;

      setIsVisible(willBeVisible);

      // Se estava escondido e agora vai aparecer, ativar animação de pulso
      if (!wasVisible && willBeVisible) {
        setJustAppeared(true);
        // Remover a flag após a animação
        setTimeout(() => setJustAppeared(false), 1100);
      } else if (wasVisible && !willBeVisible) {
        setJustAppeared(false);
      }
    };

    // Verificar imediatamente
    checkVisibility();

    // Observar mudanças nas janelas de chat e drawers usando MutationObserver
    const observer = new MutationObserver(() => {
      checkVisibility();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-chat-room-id', 'style', 'class'],
    });

    // Escutar eventos customizados de abertura/fechamento de chat
    const handleChatEvent = () => {
      // Aguardar um pouco para garantir que o DOM foi atualizado
      setTimeout(checkVisibility, 100);
    };

    const handleAllChatsClosed = () => {
      checkVisibility();
    };

    window.addEventListener('open-chat', handleChatEvent);
    window.addEventListener('all-chat-windows-closed', handleAllChatsClosed);

    // Verificar periodicamente (fallback para garantir que está sempre correto)
    const interval = setInterval(checkVisibility, 500);

    return () => {
      observer.disconnect();
      window.removeEventListener('open-chat', handleChatEvent);
      window.removeEventListener(
        'all-chat-windows-closed',
        handleAllChatsClosed
      );
      clearInterval(interval);
    };
  }, [isOnChatPage, isOnKanbanPage, isOnWhatsAppPage, hasChatModule]);

  // Não renderizar se não tiver o módulo de chat
  if (!hasChatModule) {
    return null;
  }

  const handleClick = () => {
    navigate('/chat');
  };

  return (
    <FloatingButtonContainer $visible={isVisible}>
      <FloatingButton
        onClick={handleClick}
        title='Abrir Chat'
        aria-label='Abrir Chat'
        $justAppeared={justAppeared}
      >
        <MessageCircle size={24} strokeWidth={2.5} />
        {unreadCount > 0 && (
          <Badge>{unreadCount > 99 ? '99+' : unreadCount}</Badge>
        )}
      </FloatingButton>
    </FloatingButtonContainer>
  );
};
