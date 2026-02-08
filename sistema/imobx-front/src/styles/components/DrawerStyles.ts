import styled from 'styled-components';

// Container principal do drawer otimizado
export const DrawerContainer = styled.div<{ $isOpen: boolean }>`
  position: fixed !important;
  left: 0 !important;
  top: 72px !important;
  height: calc(100vh - 72px) !important;
  width: ${props => (props.$isOpen ? '320px' : '80px')};
  background: ${props =>
    props.theme?.colors?.cardBackground || '#ffffff'} !important;
  backdrop-filter: blur(8px);
  border-right: 2px solid ${props => props.theme.colors.border};
  transition: width 0.2s ease;
  z-index: 250 !important;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: hidden;
  pointer-events: auto;
  transform: translateZ(0);
  backface-visibility: hidden;
  will-change: transform;

  /* 📱 MOBILE: Ajustar altura considerando header menor */
  @media (max-width: 768px) {
    top: 62px !important;
    height: calc(100vh - 62px) !important;
    width: ${props => (props.$isOpen ? '280px' : '0')};
    transform: translateX(${props => (props.$isOpen ? '0' : '-100%')});
    transition: transform 0.3s ease;
    box-shadow: ${props =>
      props.$isOpen ? '4px 0 12px rgba(0, 0, 0, 0.15)' : 'none'};
  }

  @media (max-width: 480px) {
    top: 58px !important;
    height: calc(100vh - 58px) !important;
    width: ${props => (props.$isOpen ? '100%' : '0')};
    max-width: 320px;
  }

  /* Estilização da scrollbar horizontal */
  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.backgroundSecondary};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 4px;

    &:hover {
      background: ${props => props.theme.colors.textSecondary};
    }
  }
`;

// Header do drawer otimizado
export const DrawerHeader = styled.div<{ $isOpen: boolean }>`
  padding: 12px 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border}30;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 60px;
  flex-shrink: 0;
  position: relative;
  background: ${props => props.theme?.colors?.cardBackground || '#ffffff'};
  will-change: transform; // Otimização
`;

// Logo/ícone do header
export const DrawerLogo = styled.div<{ $isOpen: boolean }>`
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  align-items: center;
  color: ${props => props.theme.colors.text};
  font-size: 1.5rem;
  font-weight: 700;
  font-family: 'Poppins', sans-serif;
  flex: 1;
  min-width: 0;
  overflow: hidden;

  img {
    opacity: ${props => (props.$isOpen ? '1' : '0')};
    transition: opacity 0.3s ease;
  }

  span {
    margin-left: ${props => (props.$isOpen ? '12px' : '0')};
    opacity: ${props => (props.$isOpen ? '1' : '0')};
    transition: all 0.3s ease;
    white-space: nowrap;
  }
`;

// Botão de toggle otimizado
export const ToggleButton = styled.button<{ $isOpen: boolean }>`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border}50;
  will-change: transform; // Otimização
  border-radius: 16px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${props => props.theme.colors.text};
  font-size: 1.2rem;
  font-weight: 600;
  position: relative;
  z-index: 200;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10px);

  &:hover {
    background: ${props => props.theme.colors.hover};
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: scale(0.95);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}20`};
  }

  /* Animação suave para o ícone */
  & > * {
    transition: transform 0.3s ease;
  }

  /* Efeito de brilho no hover */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      45deg,
      transparent 30%,
      rgba(255, 255, 255, 0.1) 50%,
      transparent 70%
    );
    border-radius: 12px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }
`;

// Cabeçalho de grupo (menu) - apenas visual, não clicável
export const NavigationGroupHeader = styled.div<{ $isOpen: boolean }>`
  padding: ${props => (props.$isOpen ? '16px 20px 6px' : '0')};
  margin: 0 16px ${props => (props.$isOpen ? '4px' : '0')};
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${props =>
    props.theme.colors.textSecondary || props.theme.colors.text};
  opacity: ${props => (props.$isOpen ? '1' : '0')};
  max-height: ${props => (props.$isOpen ? 'none' : '0')};
  overflow: hidden;
  pointer-events: none;
  transition:
    opacity 0.2s ease,
    padding 0.2s ease,
    max-height 0.2s ease;
  border-bottom: ${props =>
    props.$isOpen ? `1px solid ${props.theme.colors.border}40` : 'none'};
`;

// Lista de navegação
export const NavigationList = styled.ul`
  list-style: none;
  padding: 0;
  padding-bottom: 100px;
  margin: 0;
  flex: 1;
  overflow-y: auto;
  overflow-x: visible;
  min-width: max-content;
  position: relative;
  z-index: 1;
`;

// Item de navegação
export const NavigationItem = styled.li<{
  $isActive?: boolean;
  $level?: number;
}>`
  margin: 2px 16px;
  white-space: nowrap;
  position: relative;

  ${props =>
    props.$isActive &&
    `
    &::before {
      content: '';
      position: absolute;
      left: -16px;
      top: 0;
      bottom: 0;
      width: 4px;
      background: linear-gradient(180deg, ${props.theme.colors.primary}, ${props.theme.colors.primaryDark || props.theme.colors.primary});
      border-radius: 0 2px 2px 0;
    }
  `}

  ${props =>
    props.$level &&
    props.$level > 0 &&
    `
    margin-left: ${16 + props.$level * 24}px;
    margin-right: 16px;
    
    &::after {
      content: '';
      position: absolute;
      left: -8px;
      top: 50%;
      transform: translateY(-50%);
      width: 6px;
      height: 6px;
      background: ${props.theme.colors.border};
      border-radius: 50%;
    }
  `}
`;

// Link de navegação
export const NavigationLink = styled.button<{
  $isOpen: boolean;
  $isActive?: boolean;
  $hasChildren?: boolean;
}>`
  width: 100%;
  min-width: max-content;
  padding: 14px 20px;
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 16px;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  font-family: 'Poppins', sans-serif;
  justify-content: flex-start;
  position: relative;
  overflow: hidden;
  gap: 16px;

  /* Efeito de brilho no hover */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transition: left 0.6s ease;
  }

  &:hover {
    background: ${props => props.theme.colors.hover}60;
    transform: translateX(6px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateX(3px);
  }

  ${props =>
    props.$isActive &&
    `
    background: ${props.theme.colors.primary}15;
    color: ${props.theme.colors.primary};
    box-shadow: 0 4px 16px ${props.theme.colors.primary}20;
    
    &:hover {
      background: ${props.theme.colors.primary}25;
    }
  `}
`;

// Ícone do item
export const NavigationIcon = styled.span<{ $isActive?: boolean }>`
  font-size: 1.3rem;
  width: 24px;
  height: 24px;
  min-width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props =>
    props.$isActive
      ? props.theme.colors.primary
      : props.theme.colors.textSecondary};
  transition: all 0.3s ease;
  position: relative;
  flex-shrink: 0;

  ${props =>
    props.$isActive &&
    `
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 8px;
      height: 8px;
      background: ${props.theme.colors.primary};
      border-radius: 50%;
      opacity: 0.3;
    }
  `}
`;

// Texto do item
export const NavigationText = styled.span<{ $isOpen: boolean }>`
  font-size: 0.95rem;
  font-weight: 500;
  opacity: ${props => (props.$isOpen ? '1' : '0')};
  transform: ${props =>
    props.$isOpen ? 'translateX(0)' : 'translateX(-24px)'};
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  white-space: nowrap;
  overflow: hidden;
  flex: 1;
  letter-spacing: -0.01em;
  display: flex;
  align-items: center;
`;

// Badge de notificação
export const NotificationBadge = styled.span<{
  $isOpen: boolean;
  $isActive?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: ${props => (props.$isOpen ? '20px' : '16px')};
  height: ${props => (props.$isOpen ? '20px' : '16px')};
  padding: ${props => (props.$isOpen ? '0 6px' : '0 3px')};
  background: ${props =>
    props.$isActive ? props.theme.colors.primary : '#ef4444'};
  color: white;
  border-radius: ${props => (props.$isOpen ? '10px' : '8px')};
  font-size: ${props => (props.$isOpen ? '0.7rem' : '0.6rem')};
  font-weight: 600;
  line-height: 1;
  margin-left: ${props => (props.$isOpen ? '8px' : '0')};
  position: ${props => (props.$isOpen ? 'relative' : 'absolute')};
  ${props =>
    !props.$isOpen &&
    `
    top: -2px;
    right: -2px;
    border: 2px solid ${props.theme.colors.cardBackground};
  `}
  flex-shrink: 0;
  transition: all 0.3s ease;
  z-index: 1;
`;

// Footer do drawer
export const DrawerFooter = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: ${props => (props.$isOpen ? '16px 20px' : '12px 8px')};
  border-top: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.cardBackground};
  backdrop-filter: blur(8px);
  transition: padding 0.2s ease;
  z-index: 20;
`;

// Overlay para mobile
export const DrawerOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 72px; /* Ajustado para cobrir a borda do header */
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: ${props => (props.$isOpen ? '1' : '0')};
  visibility: ${props => (props.$isOpen ? 'visible' : 'hidden')};
  transition: all 0.3s ease;
  z-index: 240; /* Abaixo do drawer (250) mas acima do conteúdo */

  @media (min-width: 769px) {
    display: none;
  }

  /* 📱 MOBILE: Ajustar top com header menor */
  @media (max-width: 768px) {
    top: 62px;
  }

  @media (max-width: 480px) {
    top: 58px;
  }
`;

// Container do conteúdo principal
export const MainContent = styled.div<{ $drawerOpen: boolean }>`
  position: fixed;
  top: 72px;
  left: ${props => (props.$drawerOpen ? '320px' : '80px')};
  right: 0;
  bottom: 0;
  height: calc(100vh - 72px);
  display: flex;
  background: ${props => props.theme.colors.background};
  overflow: hidden;
  transition: left 0.35s ease;

  /* 📱 MOBILE: Drawer vira overlay, conteúdo ocupa largura total */
  @media (max-width: 768px) {
    top: 62px;
    left: 0;
    height: calc(100vh - 62px);
  }

  @media (max-width: 480px) {
    top: 58px;
    left: 0;
    height: calc(100vh - 58px);
  }
`;

export const MainScrollArea = styled.div.attrs<{
  'data-scroll-container'?: string;
}>({
  'data-scroll-container': 'main',
})`
  flex: 1;
  height: 100%;
  overflow-y: auto;
  overflow-x: auto;
  position: relative;
  padding: 24px;
  background: ${props => props.theme?.colors?.background ?? '#fff'};

  @media (max-width: 1024px) {
    padding: 20px;
  }

  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 14px 12px 80px;
  }
`;

/** Fundo das páginas: cinza claro no modo light (todas exceto Kanban). Dark não altera. */
export const PageContentArea = styled.div`
  flex: 1;
  min-height: 100%;
  background: ${(props: { theme?: { mode?: string } }) =>
    props.theme?.mode === 'dark' ? 'transparent' : '#f8fafc'};
`;
