import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MdSmartToy } from 'react-icons/md';
import { useAuth } from '../../hooks/useAuth';
import styled, { keyframes, css } from 'styled-components';

const slideInUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.8);
  }
  60% {
    opacity: 1;
    transform: translateY(-4px) scale(1.05);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const slideOutDown = keyframes`
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(20px) scale(0.8);
  }
`;

const FloatingZezinWrapper = styled.div<{ $visible: boolean }>`
  position: fixed;
  bottom: 76px; /* 20px + 48px chat button + 8px gap */
  right: 20px;
  z-index: 998;
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
    bottom: 68px;
    right: 16px;
  }

  @media (max-width: 480px) {
    bottom: 60px;
    right: 12px;
  }
`;

const ZezinButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 4px 16px rgba(139, 92, 246, 0.35),
    0 2px 4px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  &:hover {
    transform: scale(1.08) translateY(-2px);
    box-shadow:
      0 8px 24px rgba(139, 92, 246, 0.45),
      0 4px 8px rgba(0, 0, 0, 0.12);
  }

  &:active {
    transform: scale(0.96) translateY(0);
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
    width: 24px;
    height: 24px;
  }

  @media (max-width: 768px) {
    svg {
      width: 22px;
      height: 22px;
    }
  }
`;


export const FloatingZezinButton: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getCurrentUser } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  const user = getCurrentUser();
  const role = user?.role?.toLowerCase();
  const isAdminOrMaster = role === 'admin' || role === 'master';

  const isOnZezinAskPage =
    location.pathname === '/integrations/zezin/ask' ||
    location.pathname.startsWith('/integrations/zezin/');
  const isOnChatPage =
    location.pathname === '/chat' || location.pathname.startsWith('/chat/');
  const isOnKanbanPage =
    location.pathname === '/kanban' || location.pathname.startsWith('/kanban/');
  const isOnWhatsAppPage =
    location.pathname === '/whatsapp' ||
    location.pathname.startsWith('/whatsapp/');

  const hasOpenChatWindows = () => {
    return document.querySelectorAll('[data-chat-room-id]').length > 0;
  };

  const hasOpenDrawer = () => {
    const allElements = document.querySelectorAll('*');
    for (let i = 0; i < allElements.length; i++) {
      const el = allElements[i] as HTMLElement;
      const style = window.getComputedStyle(el);
      if (style.position !== 'fixed') continue;
      const zIndex = parseInt(style.zIndex, 10);
      if (zIndex === 2000 && parseFloat(style.opacity) > 0 && style.pointerEvents !== 'none') return true;
      if (zIndex === 2001 && style.transform && !style.transform.includes('translateX(100%)')) {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.right > window.innerWidth * 0.1) return true;
      }
    }
    return false;
  };

  useEffect(() => {
    if (!isAdminOrMaster) {
      setIsVisible(false);
      return;
    }
    const shouldHide =
      isOnZezinAskPage ||
      isOnChatPage ||
      isOnKanbanPage ||
      isOnWhatsAppPage ||
      hasOpenChatWindows() ||
      hasOpenDrawer();
    setIsVisible(!shouldHide);
  }, [isAdminOrMaster, isOnZezinAskPage, isOnChatPage, isOnKanbanPage, isOnWhatsAppPage, location.pathname]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAdminOrMaster) return;
      const shouldHide =
        isOnZezinAskPage ||
        isOnChatPage ||
        isOnKanbanPage ||
        isOnWhatsAppPage ||
        hasOpenChatWindows() ||
        hasOpenDrawer();
      setIsVisible(!shouldHide);
    }, 500);
    return () => clearInterval(interval);
  }, [isAdminOrMaster, isOnZezinAskPage, isOnChatPage, isOnKanbanPage, isOnWhatsAppPage]);

  if (!isAdminOrMaster) return null;

  const handleClick = () => {
    navigate('/integrations/zezin/ask');
  };

  return (
    <FloatingZezinWrapper $visible={isVisible}>
      <ZezinButton
        onClick={handleClick}
        title="Perguntar ao Zezin"
        aria-label="Perguntar ao Zezin"
      >
        <MdSmartToy size={24} />
      </ZezinButton>
    </FloatingZezinWrapper>
  );
};
