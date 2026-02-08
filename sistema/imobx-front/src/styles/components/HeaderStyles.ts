import styled, { keyframes } from 'styled-components';

// Container principal do header
export const HeaderContainer = styled.header`
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  height: 72px !important;
  background: ${props => props.theme.colors.cardBackground};
  border-bottom: 2px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  z-index: 200 !important;
  backdrop-filter: blur(10px);
  overflow: hidden !important;
  transform: translateZ(0);
  backface-visibility: hidden;
  will-change: transform;
  gap: 12px;

  /* 📱 TABLET: Ajustar para telas médias */
  @media (max-width: 1024px) {
    padding: 0 16px;
    gap: 8px;
  }

  /* 📱 MOBILE: Reduzir altura e padding */
  @media (max-width: 768px) {
    height: 64px !important;
    padding: 0 12px;
    gap: 6px;
  }

  @media (max-width: 480px) {
    height: 60px !important;
    padding: 0 10px;
    gap: 4px;
  }
`;

// Seção esquerda (logo)
export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  overflow: hidden;
  justify-content: flex-start;
  flex: 0 1 auto;
  max-width: 252px;

  /* 📱 TABLET: Reduzir largura máxima */
  @media (max-width: 1024px) {
    max-width: 216px;
    gap: 8px;
  }

  /* 📱 MOBILE: Centralizar logo e ajustar layout */
  @media (max-width: 768px) {
    gap: 6px;
    max-width: none;
    justify-content: center;
    flex: 1;
    position: relative;
    overflow: hidden;
    padding-left: 48px; /* Espaço para o botão de menu */
  }

  @media (max-width: 480px) {
    max-width: none;
    justify-content: center;
    flex: 1;
    position: relative;
    overflow: hidden;
    padding-left: 44px; /* Espaço para o botão de menu menor */
    gap: 4px;
  }
`;

// Logo clicável
export const Logo = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 8px;
  border-radius: 8px;
  color: ${props => props.theme.colors.text};
  width: 100%;
  height: 100%;

  &:hover {
    /* Sem efeitos visuais, apenas cursor pointer */
  }

  &:active {
    /* Sem efeitos visuais */
  }
`;

// Imagem do logo
export const LogoImage = styled.img`
  height: 200px;
  width: auto;
  object-fit: contain;
  max-width: 100%;

  /* 📱 TABLET: Reduzir tamanho do logo */
  @media (max-width: 1024px) {
    height: 150px;
    max-width: 200px;
  }

  /* 📱 MOBILE: Reduzir tamanho do logo */
  @media (max-width: 768px) {
    height: 120px;
    max-width: 180px;
  }

  @media (max-width: 480px) {
    height: 100px;
    max-width: 150px;
  }
`;

// Texto do logo
export const LogoText = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  font-family: 'Poppins', sans-serif;
  letter-spacing: -0.02em;
`;

// Seção central (seletor de empresa)
export const HeaderCenter = styled.div`
  display: flex;
  align-items: center;
  flex: 0 1 auto;
  justify-content: center;
  overflow: hidden;
  position: relative;
  gap: 8px;
  max-width: 342px;
  min-width: 0;
  z-index: 10001;

  /* 📱 TABLET: Reduzir largura máxima e gap */
  @media (max-width: 1024px) {
    max-width: 270px;
    gap: 6px;
  }

  @media (max-width: 900px) {
    max-width: 234px;
    gap: 4px;
  }

  /* 📱 MOBILE: Ajustar layout */
  @media (max-width: 768px) {
    gap: 8px;
    max-width: 0;
    flex: 0;
    display: none;
  }

  @media (max-width: 480px) {
    display: none;
  }
`;

const trialPulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.9;
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.45);
  }
  65% {
    transform: scale(1.55);
    opacity: 0;
    box-shadow: 0 0 0 12px rgba(16, 185, 129, 0);
  }
  100% {
    transform: scale(1);
    opacity: 0;
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
`;

export const TrialBadge = styled.div<{ $compact?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: ${props => (props.$compact ? '4px 10px' : '6px 14px')};
  border-radius: 999px;
  background: linear-gradient(
    135deg,
    rgba(16, 185, 129, 0.18) 0%,
    rgba(16, 185, 129, 0.08) 100%
  );
  border: 1px solid rgba(16, 185, 129, 0.36);
  color: #065f46;
  font-size: ${props => (props.$compact ? '0.72rem' : '0.78rem')};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  box-shadow: 0 8px 18px rgba(16, 185, 129, 0.22);
  white-space: nowrap;
  max-width: ${props => (props.$compact ? '200px' : '260px')};
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 1;
  min-width: 0;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 22px rgba(16, 185, 129, 0.28);
  }

  @media (max-width: 1024px) {
    max-width: ${props => (props.$compact ? '180px' : '220px')};
    font-size: ${props => (props.$compact ? '0.7rem' : '0.75rem')};
    padding: ${props => (props.$compact ? '4px 9px' : '5px 12px')};
  }

  @media (max-width: 900px) {
    max-width: ${props => (props.$compact ? '160px' : '200px')};
    font-size: ${props => (props.$compact ? '0.68rem' : '0.72rem')};
    padding: ${props => (props.$compact ? '3px 8px' : '4px 10px')};
  }

  @media (max-width: 768px) {
    gap: 6px;
    font-size: ${props => (props.$compact ? '0.7rem' : '0.74rem')};
    padding: ${props => (props.$compact ? '3px 9px' : '5px 12px')};
    max-width: ${props => (props.$compact ? '180px' : '220px')};
  }

  @media (max-width: 480px) {
    gap: 4px;
    font-size: 0.68rem;
    padding: 3px 8px;
    max-width: 170px;
  }
`;

export const TrialBadgePulse = styled.span`
  position: relative;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #10b981;
  flex-shrink: 0;

  &::after {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    border: 2px solid rgba(16, 185, 129, 0.4);
    opacity: 0.75;
    animation: ${trialPulse} 1.8s ease-out infinite;
  }
`;

export const TrialBadgeText = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'Poppins', sans-serif;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  strong {
    font-weight: 700;
    letter-spacing: 0.02em;
  }
`;

// Badge BETA
const betaPulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.9;
    box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.45);
  }
  65% {
    transform: scale(1.55);
    opacity: 0;
    box-shadow: 0 0 0 12px rgba(251, 191, 36, 0);
  }
  100% {
    transform: scale(1);
    opacity: 0;
    box-shadow: 0 0 0 0 rgba(251, 191, 36, 0);
  }
`;

export const BetaBadge = styled.div<{ $compact?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: ${props => (props.$compact ? '2px 6px' : '4px 10px')};
  border-radius: 4px;
  background: linear-gradient(
    135deg,
    rgba(251, 191, 36, 0.18) 0%,
    rgba(251, 191, 36, 0.08) 100%
  );
  border: 1px solid rgba(251, 191, 36, 0.36);
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  flex-shrink: 1;
  min-width: 0;
  box-shadow: 0 1px 4px rgba(251, 191, 36, 0.12);
  transition: all 0.2s ease;
  margin-left: 8px;

  &:hover {
    border-color: rgba(251, 191, 36, 0.5);
    box-shadow: 0 2px 6px rgba(251, 191, 36, 0.2);
  }

  @media (max-width: 1024px) {
    margin-left: 6px;
    padding: ${props => (props.$compact ? '2px 5px' : '3px 8px')};
  }

  @media (max-width: 900px) {
    margin-left: 4px;
    padding: ${props => (props.$compact ? '2px 4px' : '3px 6px')};
  }

  @media (max-width: 768px) {
    gap: 3px;
    padding: ${props => (props.$compact ? '2px 5px' : '3px 8px')};
    margin-left: 6px;
  }

  @media (max-width: 480px) {
    gap: 2px;
    padding: 2px 4px;
    margin-left: 4px;
  }
`;

export const BetaBadgePulse = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  border-radius: 999px;
  background: rgba(251, 191, 36, 0.3);
  animation: ${betaPulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  pointer-events: none;
`;

export const BetaBadgeText = styled.span`
  font-size: ${props => (props.$compact ? '9px' : '10px')};
  font-weight: 700;
  color: rgb(251, 191, 36);
  white-space: nowrap;
  line-height: 1;
  font-family: 'Poppins', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  @media (max-width: 768px) {
    font-size: ${props => (props.$compact ? '8px' : '9px')};
  }

  @media (max-width: 480px) {
    font-size: 7px;
  }
`;

export const BetaDaysText = styled.span`
  font-size: 10px;
  font-weight: 500;
  color: ${props => props.theme.colors.textSecondary || '#94a3b8'};
  white-space: nowrap;
  line-height: 1;
  font-family: 'Poppins', sans-serif;
  margin-left: 6px;
  flex-shrink: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 1024px) {
    font-size: 9px;
    margin-left: 4px;
  }

  @media (max-width: 900px) {
    font-size: 8px;
    margin-left: 3px;
    display: none; /* Esconder em telas muito pequenas */
  }

  @media (max-width: 768px) {
    font-size: 9px;
    margin-left: 4px;
    display: inline;
  }

  @media (max-width: 480px) {
    font-size: 8px;
    margin-left: 3px;
  }
`;

// Avatar da empresa
export const CompanyAvatarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CompanyAvatar = styled.div<{ $hasLogo?: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid ${props => props.theme.colors.border};
  background: ${props =>
    props.$hasLogo
      ? props.theme.colors.background
      : `linear-gradient(135deg, ${props.theme.colors.primary}20 0%, ${props.theme.colors.primary}10 100%)`};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: scale(1.05);
    box-shadow: 0 4px 12px ${props => props.theme.colors.primary}30;
  }

  /* 📱 MOBILE: Reduzir tamanho */
  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
  }

  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
    display: none; /* Esconder avatar da empresa em telas muito pequenas */
  }
`;

export const CompanyAvatarIcon = styled.div`
  color: ${props => props.theme.colors.primary};
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Seção direita (perfil integrado)
export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: auto;
  min-width: 252px;
  flex: 1 1 auto;
  justify-content: flex-end;
  max-width: 360px;

  /* 📱 TABLET: Reduzir largura */
  @media (max-width: 1024px) {
    min-width: 216px;
    max-width: 288px;
    gap: 10px;
  }

  @media (max-width: 900px) {
    min-width: 180px;
    max-width: 252px;
    gap: 8px;
  }

  /* 📱 MOBILE: Ajustar largura e gap */
  @media (max-width: 768px) {
    width: auto;
    min-width: auto;
    max-width: none;
    gap: 8px;
    flex: 0;
    flex-shrink: 0;
    padding-right: 4px;
  }

  @media (max-width: 480px) {
    gap: 6px;
    width: auto;
    min-width: auto;
    max-width: none;
    flex: 0;
    flex-shrink: 0;
    padding-right: 4px;
  }
`;

// Container do usuário integrado
export const UserContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 20px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.3s ease;
  cursor: pointer;
  min-width: 0;
  flex: 1 1 auto;
  max-width: 100%;

  &:hover {
    background: ${props => props.theme.colors.hover};
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  /* 📱 TABLET: Reduzir padding */
  @media (max-width: 1024px) {
    padding: 6px 10px;
    gap: 6px;
  }

  @media (max-width: 900px) {
    padding: 5px 8px;
    gap: 5px;
  }

  /* 📱 MOBILE: Reduzir padding e gap */
  @media (max-width: 768px) {
    padding: 4px 8px;
    gap: 6px;
  }

  @media (max-width: 480px) {
    padding: 4px 6px;
    gap: 4px;
    border-radius: 16px;
  }
`;

// Avatar do usuário moderno
export const UserAvatar = styled.div<{ $imageUrl?: string; $large?: boolean }>`
  width: ${props => (props.$large ? '48px' : '32px')};
  height: ${props => (props.$large ? '48px' : '32px')};
  border-radius: 50%;
  background: ${props =>
    props.$imageUrl
      ? `url(${props.$imageUrl}) center/cover`
      : `linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.primaryLight} 100%)`};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: ${props => (props.$large ? '1.125rem' : '0.875rem')};
  font-family: 'Poppins', sans-serif;
  border: ${props => (props.$large ? '3px' : '2px')} solid
    ${props =>
      props.$large
        ? `${props.theme.colors.primary}30`
        : props.theme.colors.background};
  transition: all 0.3s ease;
  flex-shrink: 0;
  box-shadow: ${props =>
    props.$large
      ? `0 4px 16px ${props.theme.colors.primary}25`
      : `0 2px 8px ${props.theme.mode === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'}`};

  /* 📱 MOBILE: Reduzir tamanho */
  @media (max-width: 768px) {
    width: ${props => (props.$large ? '44px' : '30px')};
    height: ${props => (props.$large ? '44px' : '30px')};
    font-size: ${props => (props.$large ? '1rem' : '0.75rem')};
  }

  @media (max-width: 480px) {
    width: ${props => (props.$large ? '40px' : '28px')};
    height: ${props => (props.$large ? '40px' : '28px')};
    font-size: ${props => (props.$large ? '0.9375rem' : '0.7rem')};
  }
`;

// Informações do usuário compactas
export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
  overflow: hidden;
  flex: 1 1 auto;
  max-width: 100%;

  /* 📱 TABLET: Reduzir largura */
  @media (max-width: 1024px) {
    max-width: 162px;
  }

  @media (max-width: 900px) {
    max-width: 126px;
  }

  /* 📱 MOBILE: Esconder em telas pequenas */
  @media (max-width: 768px) {
    max-width: 108px;
  }

  @media (max-width: 480px) {
    display: none; /* Mostrar apenas avatar em mobile */
  }
`;

// Nome do usuário compacto
export const UserName = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  font-family: 'Poppins', sans-serif;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  width: 100%;

  /* 📱 TABLET: Ajustar tamanho da fonte */
  @media (max-width: 1024px) {
    font-size: 0.8125rem;
  }

  @media (max-width: 900px) {
    font-size: 0.75rem;
  }
`;

// Função do usuário compacta
export const UserRole = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  font-family: 'Poppins', sans-serif;
  text-transform: capitalize;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  width: 100%;

  /* 📱 TABLET: Ajustar tamanho da fonte */
  @media (max-width: 1024px) {
    font-size: 0.6875rem;
  }

  @media (max-width: 900px) {
    font-size: 0.625rem;
  }
`;

// Botão de logout moderno
export const LogoutButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border: 1px solid #fecaca;
  color: #dc2626;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  flex-shrink: 0;

  &:hover {
    background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
    border-color: #fca5a5;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2);
  }

  &:active {
    transform: translateY(0);
  }

  /* 📱 MOBILE: Reduzir tamanho */
  @media (max-width: 768px) {
    width: 34px;
    height: 34px;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
    font-size: 0.85rem;
  }
`;

// Overlay do modal
export const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  opacity: ${props => (props.$isOpen ? '1' : '0')};
  visibility: ${props => (props.$isOpen ? 'visible' : 'hidden')};
  transition: all 0.3s ease;
`;

// Container do modal
export const ModalContainer = styled.div<{ $isOpen: boolean }>`
  background: ${props => props.theme.colors.background};
  border-radius: 16px;
  padding: 32px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid ${props => props.theme.colors.border};
  transform: ${props => (props.$isOpen ? 'scale(1)' : 'scale(0.9)')};
  transition: all 0.3s ease;
`;

// Ícone do modal
export const ModalIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #dcfce7; /* Verde claro transparente */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 20px;
  color: #16a34a; /* Verde escuro */
`;

// Título do modal
export const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  text-align: center;
  margin: 0 0 12px 0;
  font-family: 'Poppins', sans-serif;
`;

// Descrição do modal
export const ModalDescription = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;
  margin: 0 0 24px 0;
  font-family: 'Poppins', sans-serif;
  line-height: 1.5;
`;

// Container dos botões
export const ModalButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

// Botão do modal
export const ModalButton = styled.button<{ $variant: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;
  border: none;

  ${props =>
    props.$variant === 'primary'
      ? `
    background: #dc2626;
    color: white;
    
    &:hover {
      background: #b91c1c;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
    }
  `
      : `
    background: ${props.theme.colors.backgroundSecondary};
    color: ${props.theme.colors.text};
    
    &:hover {
      background: ${props.theme.colors.hover};
      transform: translateY(-2px);
    }
  `}

  &:active {
    transform: translateY(0);
  }
`;

export const MobileMenuButton = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.hover};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}20`};
  }

  @media (max-width: 992px) {
    display: inline-flex;
  }

  @media (max-width: 768px) {
    position: absolute;
    left: 12px;
    z-index: 10;
  }

  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    left: 10px;
  }
`;

export const ActionsToggleButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 20px;
  border: 2px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.backgroundSecondary};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 0;
  position: relative;

  &:hover {
    background: ${props => props.theme.colors.hover};
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 8px 24px ${props => `${props.theme.colors.primary}20`};
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 12px ${props => `${props.theme.colors.primary}15`};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}20`};
  }

  /* 📱 MOBILE: Remover borda e background, deixar apenas o avatar como botão */
  @media (max-width: 768px) {
    padding: 0;
    border: none;
    background: transparent;
    border-radius: 0;
    gap: 8px;
    box-shadow: none;

    &:hover {
      background: transparent;
      border: none;
      box-shadow: none;
      transform: none;
    }

    &:active {
      transform: scale(0.95);
    }

    &:focus {
      outline: none;
      box-shadow: none;
    }

    svg {
      color: ${props => props.theme.colors.textSecondary};
      transition: color 0.3s ease;
    }

    &:hover svg {
      color: ${props => props.theme.colors.primary};
    }
  }

  @media (max-width: 480px) {
    gap: 6px;
  }
`;

export const ActionsBadge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border-radius: 999px;
  padding: 2px 6px;
  font-size: 10px;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
  border: 2px solid ${props => props.theme.colors.cardBackground};
`;

export const ActionsOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background: ${props =>
    props.theme.mode === 'dark'
      ? 'rgba(15, 23, 42, 0.6)'
      : 'rgba(0, 0, 0, 0.4)'};
  backdrop-filter: blur(8px);
  z-index: 210;
  opacity: ${props => (props.$isOpen ? 1 : 0)};
  visibility: ${props => (props.$isOpen ? 'visible' : 'hidden')};
  transition:
    opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    visibility 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

export const ActionsPanel = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 72px;
  right: 20px;
  width: 360px;
  max-height: calc(100vh - 96px);
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 24px;
  box-shadow:
    0 20px 60px rgba(15, 23, 42, 0.4),
    0 0 0 1px ${props => `${props.theme.colors.primary}10`};
  z-index: 220;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  opacity: ${props => (props.$isOpen ? 1 : 0)};
  transform: translateY(${props => (props.$isOpen ? '0' : '-20px')})
    scale(${props => (props.$isOpen ? '1' : '0.95')});
  pointer-events: ${props => (props.$isOpen ? 'auto' : 'none')};
  transition:
    opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.3s ease;
  backdrop-filter: blur(20px);

  ${props =>
    props.$isOpen &&
    `
    box-shadow: 0 25px 80px rgba(15, 23, 42, 0.5), 
                0 0 0 1px ${props.theme.colors.primary}15,
                0 0 40px ${props.theme.colors.primary}10;
  `}

  @media (max-width: 768px) {
    top: 64px;
    right: 12px;
    width: calc(100vw - 24px);
    border-radius: 20px;
    max-height: calc(100vh - 80px);
  }

  @media (max-width: 480px) {
    top: 60px;
    right: 10px;
    width: calc(100vw - 20px);
    border-radius: 18px;
    max-height: calc(100vh - 76px);
  }
`;

export const ActionsPanelHeader = styled.div`
  padding: 24px 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  gap: 16px;
  background: ${props =>
    props.theme.mode === 'dark'
      ? `linear-gradient(135deg, ${props.theme.colors.backgroundSecondary} 0%, ${props.theme.colors.cardBackground} 100%)`
      : `linear-gradient(135deg, ${props.theme.colors.cardBackground} 0%, ${props.theme.colors.backgroundSecondary} 100%)`};

  @media (max-width: 768px) {
    padding: 20px 16px;
    gap: 14px;
  }

  @media (max-width: 480px) {
    padding: 18px 14px;
    gap: 12px;
  }
`;

export const ActionsUserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  min-width: 0;
`;

export const ActionsUserName = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  max-width: 220px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ActionsUserRole = styled.span`
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: capitalize;
`;

export const ActionsPanelBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 20px 20px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 4px;
  }
`;

export const ActionsSection = styled.div`
  margin-top: 20px;

  &:first-of-type {
    margin-top: 12px;
  }
`;

export const ActionsSectionTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

export const ActionsButton = styled.button`
  width: 100%;
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.text};
  font-weight: 500;
  font-size: 0.9375rem;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    background: ${props => props.theme.colors.hover};
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 8px 24px ${props => `${props.theme.colors.primary}15`};
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 12px ${props => `${props.theme.colors.primary}10`};
  }

  svg {
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: scale(1.1);
  }

  @media (max-width: 480px) {
    padding: 12px 14px;
    font-size: 0.875rem;
    gap: 10px;
  }
`;

export const ActionsFooter = styled.div`
  padding: 18px 20px;
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const ActionsFooterText = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;
