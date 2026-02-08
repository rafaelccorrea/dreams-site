import styled from 'styled-components';

// Animações otimizadas com will-change
const fadeIn = `
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const scaleIn = `
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

// Container principal otimizado
export const OptimizedModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px); // Reduzido de 12px para melhor performance
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
  will-change: opacity;
  animation: ${props => (props.$isOpen ? fadeIn : 'none')} 0.2s ease-out;

  @media (max-width: 768px) {
    padding: 16px;
    align-items: flex-start;
    padding-top: 40px;
  }
`;

// Container do modal otimizado
export const OptimizedModalContainer = styled.div<{ $isOpen: boolean }>`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 20px; // Reduzido de 24px
  box-shadow: 0 20px 40px -8px
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.4)'
        : 'rgba(0, 0, 0, 0.15)'};
  border: 1px solid ${props => props.theme.colors.border};
  width: 100%;
  max-width: 800px; // Reduzido de 900px
  max-height: 90vh;
  overflow: hidden;
  will-change: transform, opacity;
  animation: ${props => (props.$isOpen ? scaleIn : 'none')} 0.2s ease-out;
  position: relative;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    max-width: 100%;
    max-height: 85vh;
    border-radius: 16px;
  }
`;

// Header otimizado - sem gradientes pesados
export const OptimizedModalHeader = styled.div`
  padding: 24px 32px 20px 32px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.backgroundSecondary};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px; // Reduzido de 4px
    background: ${props => props.theme.colors.primary};
  }

  @media (max-width: 768px) {
    padding: 20px 24px 16px 24px;
  }
`;

export const OptimizedModalHeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

export const OptimizedModalTitle = styled.h2`
  font-size: 1.75rem; // Reduzido de 2rem
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    gap: 10px;
  }
`;

export const OptimizedModalSubtitle = styled.p`
  font-size: 1rem; // Reduzido de 1.1rem
  color: ${props => props.theme.colors.textSecondary};
  margin: 6px 0 0 0;
  line-height: 1.4;
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

export const OptimizedModalCloseButton = styled.button`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.1rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease; // Reduzido de 0.2s
  flex-shrink: 0;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
  }

  &:active {
    transform: scale(0.95);
  }
`;

// Conteúdo otimizado
export const OptimizedModalContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;

  @media (max-width: 768px) {
    padding: 20px 24px;
  }

  /* Scrollbar otimizada */
  &::-webkit-scrollbar {
    width: 6px; // Reduzido de 8px
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.backgroundSecondary};
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.primary};
  }
`;

// Seções otimizadas
export const OptimizedFormSection = styled.div`
  margin-bottom: 24px; // Reduzido de 32px

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

export const OptimizedFormSectionTitle = styled.h3`
  font-size: 1.2rem; // Reduzido de 1.3rem
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 16px 0; // Reduzido de 20px
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 14px;
  }
`;

export const OptimizedFormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(280px, 1fr)
  ); // Reduzido de 300px
  gap: 20px; // Reduzido de 24px

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

export const OptimizedFormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px; // Reduzido de 8px
`;

export const OptimizedFormLabel = styled.label`
  font-size: 0.95rem; // Reduzido de 1rem
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const OptimizedRequiredIndicator = styled.span`
  color: ${props => props.theme.colors.error};
  font-weight: 700;
`;

// Inputs otimizados - sem transformações pesadas
export const OptimizedFormInput = styled.input`
  width: 100%;
  padding: 14px 18px; // Reduzido de 16px 20px
  border: 1px solid ${props => props.theme.colors.border}; // Reduzido de 2px
  border-radius: 10px; // Reduzido de 12px
  font-size: 0.95rem; // Reduzido de 1rem
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease; // Removido transform

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20; // Reduzido de 3px
  }

  &:hover:not(:focus) {
    border-color: ${props => props.theme.colors.primary}40;
  }

  @media (max-width: 768px) {
    padding: 12px 16px;
    font-size: 0.9rem;
  }
`;

export const OptimizedFormTextarea = styled.textarea`
  width: 100%;
  padding: 14px 18px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  font-size: 0.95rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
  resize: vertical;
  min-height: 100px; // Reduzido de 120px
  font-family: inherit;

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }

  &:hover:not(:focus) {
    border-color: ${props => props.theme.colors.primary}40;
  }

  @media (max-width: 768px) {
    padding: 12px 16px;
    font-size: 0.9rem;
    min-height: 80px;
  }
`;

export const OptimizedFormSelect = styled.select`
  width: 100%;
  padding: 14px 18px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  font-size: 0.95rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }

  &:hover:not(:focus) {
    border-color: ${props => props.theme.colors.primary}40;
  }

  @media (max-width: 768px) {
    padding: 12px 16px;
    font-size: 0.9rem;
  }
`;

export const OptimizedErrorMessage = styled.div`
  font-size: 0.85rem; // Reduzido de 0.9rem
  color: ${props => props.theme.colors.error};
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
`;

export const OptimizedInfoBox = styled.div`
  background: ${props => props.theme.colors.primary}08; // Reduzido de 10
  border: 1px solid ${props => props.theme.colors.primary}20; // Reduzido de 30
  border-radius: 10px;
  padding: 14px 18px; // Reduzido de 16px 20px
  margin-bottom: 20px; // Reduzido de 24px
  display: flex;
  align-items: flex-start;
  gap: 10px;
`;

export const OptimizedInfoText = styled.p`
  margin: 0;
  font-size: 0.9rem; // Reduzido de 0.95rem
  color: ${props => props.theme.colors.text};
  line-height: 1.4;
  font-weight: 400;
`;

// Footer otimizado
export const OptimizedModalFooter = styled.div`
  padding: 20px 32px 24px 32px; // Reduzido
  border-top: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.backgroundSecondary};
  display: flex;
  gap: 12px; // Reduzido de 16px
  justify-content: flex-end;
  align-items: center;

  @media (max-width: 768px) {
    padding: 16px 24px 20px 24px;
    flex-direction: column-reverse;
    gap: 10px;

    button {
      width: 100%;
    }
  }
`;

// Botões otimizados - sem gradientes pesados
export const OptimizedButton = styled.button<{
  $variant?: 'primary' | 'secondary' | 'danger';
}>`
  padding: 12px 24px; // Reduzido de 14px 28px
  border-radius: 10px; // Reduzido de 12px
  font-size: 0.95rem; // Reduzido de 1rem
  font-weight: 600;
  cursor:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath d='M1 1 L1 15 L7 9 L10 17 L13 15 L10 7 L17 7 L1 1 Z' fill='%23A63126'/%3E%3C/svg%3E")
      1 1,
    pointer !important;
  transition: all 0.15s ease; // Reduzido de 0.3s
  border: none;
  display: flex;
  align-items: center;
  gap: 6px; // Reduzido de 8px
  text-transform: uppercase;
  letter-spacing: 0.3px; // Reduzido de 0.5px
  min-width: 100px; // Reduzido de 120px
  justify-content: center;

  ${props => {
    if (props.$variant === 'primary') {
      return `
        background: ${props.theme.colors.primary};
        color: white;
        box-shadow: 0 2px 8px ${props.theme.colors.primary}30; // Reduzido

        &:hover:not(:disabled) {
          background: ${props.theme.colors.primaryDark};
          box-shadow: 0 4px 12px ${props.theme.colors.primary}40; // Reduzido
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath d='M1 1 L1 15 L7 9 L10 17 L13 15 L10 7 L17 7 L1 1 Z' fill='%23A63126'/%3E%3C/svg%3E") 1 1, pointer !important;
        }
      `;
    } else if (props.$variant === 'danger') {
      return `
        background: ${props.theme.mode === 'dark' ? '#7f1d1d' : '#fee2e2'};
        color: ${props.theme.mode === 'dark' ? '#fca5a5' : '#991b1b'};
        border: 1px solid ${props.theme.mode === 'dark' ? '#991b1b' : '#fecaca'};

        &:hover:not(:disabled) {
          background: ${props.theme.mode === 'dark' ? '#991b1b' : '#fecaca'};
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath d='M1 1 L1 15 L7 9 L10 17 L13 15 L10 7 L17 7 L1 1 Z' fill='%23A63126'/%3E%3C/svg%3E") 1 1, pointer !important;
        }
      `;
    } else {
      return `
        background: ${props.theme.mode === 'light' ? '#F3F4F6' : props.theme.colors.background};
        color: ${props.theme.colors.text};
        border: 1px solid ${props.theme.colors.border};

        &:hover:not(:disabled) {
          background: ${props.theme.mode === 'light' ? '#E5E7EB' : props.theme.colors.primary + '08'};
          border-color: ${props.theme.colors.primary};
          color: ${props.theme.colors.primary};
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath d='M1 1 L1 15 L7 9 L10 17 L13 15 L10 7 L17 7 L1 1 Z' fill='%23A63126'/%3E%3C/svg%3E") 1 1, pointer !important;
        }
      `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor:
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath d='M1 1 L1 15 L7 9 L10 17 L13 15 L10 7 L17 7 L1 1 Z' fill='%23A63126' opacity='0.5'/%3E%3Cline x1='2' y1='2' x2='18' y2='18' stroke='%23A63126' stroke-width='2'/%3E%3C/svg%3E")
        1 1,
      not-allowed !important;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
`;

// Loading otimizado
export const OptimizedLoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px; // Reduzido de 60px
  text-align: center;
`;

export const OptimizedLoadingSpinner = styled.div`
  width: 32px; // Reduzido de 40px
  height: 32px;
  border: 2px solid ${props => props.theme.colors.border};
  border-top: 2px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 0.8s linear infinite; // Reduzido de 1s

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const OptimizedLoadingText = styled.p`
  font-size: 0.95rem; // Reduzido de 1rem
  color: ${props => props.theme.colors.textSecondary};
  margin: 12px 0 0 0; // Reduzido de 16px
  font-weight: 500;
`;

// Estados vazios otimizados
export const OptimizedEmptyState = styled.div`
  text-align: center;
  padding: 40px 20px; // Reduzido de 60px
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 12px; // Reduzido de 16px
  border: 1px dashed ${props => props.theme.colors.border}; // Reduzido de 2px
  margin: 20px 0; // Reduzido de 24px
`;

export const OptimizedEmptyStateIcon = styled.div`
  font-size: 2.5rem; // Reduzido de 3rem
  margin-bottom: 12px; // Reduzido de 16px
`;

export const OptimizedEmptyStateTitle = styled.h3`
  font-size: 1.2rem; // Reduzido de 1.3rem
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 6px 0; // Reduzido de 8px
`;

export const OptimizedEmptyStateDescription = styled.p`
  font-size: 0.95rem; // Reduzido de 1rem
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  line-height: 1.4;
`;
