import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const CompanySelectorContainer = styled.div`
  position: relative;
  min-width: 200px;
  max-width: 100%;
  width: 100%;
  flex-shrink: 1;
  overflow: visible !important;
  z-index: 10000;
  height: 48px;
  display: flex;
  align-items: center;
  margin-bottom: 0;

  /* 📱 TABLET: Ajustar larguras */
  @media (max-width: 1024px) {
    min-width: 180px;
    max-width: 100%;
  }

  @media (max-width: 900px) {
    min-width: 160px;
    max-width: 100%;
  }

  /* 📱 MOBILE: Ajustar larguras */
  @media (max-width: 768px) {
    min-width: 150px;
    max-width: 100%;
    height: 44px;
  }

  @media (max-width: 480px) {
    min-width: 120px;
    max-width: 100%;
    height: 40px;
  }
`;

export const CompanySelectorButton = styled.button<{ $isOpen: boolean }>`
  width: 100%;
  padding: 12px 16px;
  background: ${props => props.theme.colors.cardBackground};
  border: 2px solid
    ${props =>
      props.$isOpen ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  box-shadow: ${props =>
    props.$isOpen
      ? `0 4px 20px ${props.theme.mode === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.1)'}`
      : `0 2px 8px ${props.theme.mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)'}`};

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.backgroundSecondary};
    box-shadow: 0 4px 20px ${props => `${props.theme.colors.primary}30`};
    transform: translateY(-2px);
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}20`};
  }

  &:active {
    transform: translateY(0);
  }

  /* 📱 MOBILE: Reduzir padding */
  @media (max-width: 768px) {
    padding: 6px 10px;
    gap: 8px;
    border-radius: 8px;
  }

  @media (max-width: 480px) {
    padding: 6px 8px;
    gap: 6px;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .refresh-button {
    background: none;
    border: none;
    padding: 4px;
    border-radius: 6px;
    cursor: pointer;
    color: ${props => props.theme.colors.textSecondary};
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: ${props => props.theme.colors.backgroundSecondary};
      color: ${props => props.theme.colors.primary};
      transform: rotate(180deg);
    }
  }

  .chevron {
    transition: transform 0.3s ease;
    color: ${props => props.theme.colors.textSecondary};

    &.open {
      transform: rotate(180deg);
    }
  }
`;

export const CompanyLogo = styled.img`
  height: 28px;
  width: auto;
  object-fit: contain;
  margin-right: 10px;
  flex-shrink: 0;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

export const CompanyInfo = styled.div`
  flex: 1;
  text-align: left;
  min-width: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const CompanyName = styled.div`
  font-weight: 600;
  font-size: 12px;
  color: ${props => props.theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: 'Poppins', sans-serif;
  line-height: 1.3;
  max-width: 100%;

  /* 📱 TABLET: Reduzir fonte */
  @media (max-width: 1024px) {
    font-size: 11.5px;
  }

  @media (max-width: 900px) {
    font-size: 11px;
  }

  /* 📱 MOBILE: Reduzir fonte */
  @media (max-width: 768px) {
    font-size: 11px;
  }

  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

export const CompanyDetails = styled.div`
  font-size: 10px;
  color: ${props => props.theme.colors.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 1px;
  font-family: 'Poppins', sans-serif;
  line-height: 1.2;
  max-width: 100%;

  /* 📱 TABLET: Esconder em telas médias */
  @media (max-width: 900px) {
    display: none;
  }

  /* 📱 MOBILE: Esconder em telas pequenas */
  @media (max-width: 480px) {
    display: none;
  }
`;

export const PlanDetails = styled.div`
  font-size: 10px;
  color: ${props => props.theme.colors.primary};
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
  font-family: 'Poppins', sans-serif;
  max-width: 100%;

  /* 📱 TABLET: Esconder em telas médias */
  @media (max-width: 900px) {
    display: none;
  }

  /* 📱 MOBILE: Esconder em telas pequenas */
  @media (max-width: 480px) {
    display: none;
  }
`;

export const DropdownContainer = styled.div<{ $inPortal?: boolean }>`
  position: ${props => (props.$inPortal ? 'relative' : 'absolute')};
  top: ${props => (props.$inPortal ? '0' : 'calc(100% + 12px)')};
  left: ${props => (props.$inPortal ? '0' : '0')};
  right: 0;
  width: 100%;
  max-width: 100%;
  background: ${props => props.theme.colors.cardBackground};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  box-shadow: ${props =>
    props.theme.mode === 'dark'
      ? '0 24px 48px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)'
      : '0 24px 48px rgba(0, 0, 0, 0.2), 0 8px 16px rgba(0, 0, 0, 0.15)'};
  backdrop-filter: blur(20px);
  z-index: ${props => (props.$inPortal ? 'inherit' : '99999')} !important;
  animation: ${fadeIn} 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  min-height: 50px;
  transform: translateY(0);
  visibility: visible !important;
  opacity: 1 !important;
  display: block !important;
`;

export const DropdownList = styled.div`
  max-height: 300px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.backgroundSecondary};
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.textSecondary};
  }
`;

export const DropdownItem = styled.div<{ $isSelected: boolean }>`
  padding: 16px 20px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  position: relative;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${props => props.theme.colors.primary}15;
    transform: translateX(4px);
    padding-left: 24px;
  }

  ${props =>
    props.$isSelected &&
    `
    background: linear-gradient(135deg, ${props.theme.colors.primary}15 0%, ${props.theme.colors.primary}08 100%);
    border-left: 4px solid ${props.theme.colors.primary};
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: linear-gradient(180deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.primaryDark || props.theme.colors.primary} 100%);
      border-radius: 0 4px 4px 0;
    }
  `}

  .selected-indicator {
    color: ${props => props.theme.colors.primary};
    font-weight: bold;
    font-size: 18px;
    margin-left: 8px;
  }
`;

export const CompanyItemInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const CompanyItemName = styled.div`
  font-weight: 700;
  font-size: 16px;
  color: ${props => props.theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: 'Poppins', sans-serif;
`;

export const CompanyItemDetails = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 3px;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 16px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  text-align: center;
  justify-content: center;
  max-width: 100%;
  overflow: hidden;
`;

export const LoadingState = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  justify-content: center;

  .spinner {
    width: 18px;
    height: 18px;
    border: 2px solid ${props => props.theme.colors.border};
    border-top: 2px solid ${props => props.theme.colors.primary};
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
  }
`;

export const ErrorState = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px;
  color: ${props => props.theme.colors.error};
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  justify-content: center;
`;

export const PlanInfoHeader = styled.div<{
  $planType: 'basic' | 'pro' | 'custom';
}>`
  padding: 18px 20px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
  background: ${props => {
    const isDark = props.theme.mode === 'dark';
    switch (props.$planType) {
      case 'basic':
        return isDark
          ? `linear-gradient(135deg, ${props.theme.colors.primaryDark} 0%, ${props.theme.colors.primary} 100%)`
          : `linear-gradient(135deg, ${props.theme.colors.primary}15 0%, ${props.theme.colors.primary}25 100%)`;
      case 'pro':
        return isDark
          ? 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)'
          : 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)';
      case 'custom':
        return isDark
          ? 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)'
          : 'linear-gradient(135deg, #e9d5ff 0%, #d8b4fe 100%)';
      default:
        return props.theme.colors.backgroundSecondary;
    }
  }};
  color: ${props => {
    const isDark = props.theme.mode === 'dark';
    switch (props.$planType) {
      case 'basic':
        return isDark ? '#ffffff' : props.theme.colors.primary;
      case 'pro':
        return isDark ? '#ffffff' : '#c2410c';
      case 'custom':
        return isDark ? '#ffffff' : '#7c3aed';
      default:
        return props.theme.colors.text;
    }
  }};
  box-shadow: ${props =>
    props.theme.mode === 'dark'
      ? 'inset 0 1px 0 rgba(255, 255, 255, 0.2)'
      : 'inset 0 1px 0 rgba(255, 255, 255, 0.8)'};
`;

export const PlanInfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 6px;
  text-shadow: none;

  &:last-child {
    margin-bottom: 0;
    font-size: 13px;
    font-weight: 600;
    opacity: 1;
  }
`;
