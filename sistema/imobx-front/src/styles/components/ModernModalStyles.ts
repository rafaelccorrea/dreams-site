import styled from 'styled-components';

// Container principal do modal moderno
export const ModernModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(12px);
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 24px;
  opacity: ${props => (props.$isOpen ? 1 : 0)};
  transition: opacity 0.3s ease;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 20px;
    align-items: flex-start;
    padding-top: 60px;
    justify-content: center;
  }

  @media (max-width: 480px) {
    padding: 12px;
    padding-top: 24px;
    -webkit-overflow-scrolling: touch;
  }
`;

// Container do modal moderno - mais largo
export const ModernModalContainer = styled.div<{ $isOpen: boolean }>`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 24px;
  box-shadow: 0 32px 64px -12px
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.6)'
        : 'rgba(0, 0, 0, 0.3)'};
  border: 1px solid ${props => props.theme.colors.border};
  width: 100%;
  max-width: 900px; // Mais largo que o padrão
  max-height: 90vh;
  min-height: 400px;
  overflow: hidden;
  transform: ${props => (props.$isOpen ? 'scale(1)' : 'scale(0.95)')};
  transition: transform 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    max-width: 100%;
    max-height: 85vh;
    min-height: 300px;
    border-radius: 20px;
    margin: 20px;
  }

  @media (max-width: 480px) {
    margin: 0;
    max-height: calc(100vh - 24px);
    border-radius: 16px;
  }
`;

// Header do modal moderno - sem posição fixa
export const ModernModalHeader = styled.div`
  padding: 32px 40px 24px 40px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary}08 0%,
    ${props => props.theme.colors.primary}04 100%
  );
  position: relative;
  overflow: hidden;
  flex-shrink: 0;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(
      90deg,
      ${props => props.theme.colors.primary} 0%,
      ${props => props.theme.colors.primaryDark} 100%
    );
  }

  @media (max-width: 768px) {
    padding: 24px 28px 20px 28px;
  }

  @media (max-width: 480px) {
    padding: 16px 16px 14px 16px;
  }
`;

// Container do header
export const ModernModalHeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
`;

// Título do modal moderno
export const ModernModalTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 16px;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary} 0%,
    ${props => props.theme.colors.primaryDark} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 1.75rem;
    gap: 12px;
  }
`;

// Subtítulo do modal
export const ModernModalSubtitle = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 8px 0 0 0;
  line-height: 1.5;
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

// Botão de fechar moderno
export const ModernModalCloseButton = styled.button`
  background: ${props => props.theme.colors.background};
  border: 2px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.25rem;
  cursor: pointer;
  padding: 12px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

// Conteúdo do modal moderno - scrollável
export const ModernModalContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 32px 40px;
  min-height: 0; // Importante para flex funcionar corretamente

  @media (max-width: 768px) {
    padding: 24px 28px;
  }

  @media (max-width: 480px) {
    padding: 16px;
    -webkit-overflow-scrolling: touch;
  }

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.backgroundSecondary};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.primary};
  }
`;

// Seções do formulário
export const ModernFormSection = styled.div`
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    margin-bottom: 24px;
  }
`;

export const ModernFormSectionTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 2px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 16px;
  }
`;

// Grid de formulário moderno
export const ModernFormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

// Grupo de campo moderno
export const ModernFormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

// Label moderno
export const ModernFormLabel = styled.label`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

// Indicador de campo obrigatório
export const ModernRequiredIndicator = styled.span`
  color: ${props => props.theme.colors.error};
  font-weight: 700;
`;

// Input moderno
export const ModernFormInput = styled.input`
  width: 100%;
  padding: 16px 20px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.1)'
        : 'rgba(0, 0, 0, 0.05)'};

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow:
      0 0 0 3px ${props => props.theme.colors.primary}20,
      0 4px 12px ${props => props.theme.colors.primary}15;
    transform: translateY(-1px);
  }

  &:hover:not(:focus) {
    border-color: ${props => props.theme.colors.primary}60;
  }

  @media (max-width: 768px) {
    padding: 14px 18px;
    font-size: 0.95rem;
  }
`;

// Textarea moderno
export const ModernFormTextarea = styled.textarea`
  width: 100%;
  padding: 16px 20px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
  box-shadow: 0 2px 8px
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.1)'
        : 'rgba(0, 0, 0, 0.05)'};

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow:
      0 0 0 3px ${props => props.theme.colors.primary}20,
      0 4px 12px ${props => props.theme.colors.primary}15;
    transform: translateY(-1px);
  }

  &:hover:not(:focus) {
    border-color: ${props => props.theme.colors.primary}60;
  }

  @media (max-width: 768px) {
    padding: 14px 18px;
    font-size: 0.95rem;
    min-height: 100px;
  }
`;

// Select moderno
export const ModernFormSelect = styled.select`
  width: 100%;
  padding: 16px 20px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 2px 8px
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.1)'
        : 'rgba(0, 0, 0, 0.05)'};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow:
      0 0 0 3px ${props => props.theme.colors.primary}20,
      0 4px 12px ${props => props.theme.colors.primary}15;
    transform: translateY(-1px);
  }

  &:hover:not(:focus) {
    border-color: ${props => props.theme.colors.primary}60;
  }

  @media (max-width: 768px) {
    padding: 14px 18px;
    font-size: 0.95rem;
  }
`;

// Mensagem de erro moderna
export const ModernErrorMessage = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.error};
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
`;

// Info box moderna
export const ModernInfoBox = styled.div`
  background: ${props => props.theme.colors.primary}10;
  border: 1px solid ${props => props.theme.colors.primary}30;
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 24px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

export const ModernInfoText = styled.p`
  margin: 0;
  font-size: 0.95rem;
  color: ${props => props.theme.colors.text};
  line-height: 1.5;
  font-weight: 400;
`;

// Resumo / Summary para modal de confirmação
export const ModernSummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

export const ModernSummaryCard = styled.div`
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 20px;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary}40;
    box-shadow: 0 4px 20px ${props => props.theme.colors.primary}15;
  }
`;

export const ModernSummaryCardTitle = styled.h4`
  font-size: 0.95rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  margin: 0 0 14px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 10px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
`;

export const ModernSummaryRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const ModernSummaryLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const ModernSummaryValue = styled.span`
  font-size: 0.9375rem;
  color: ${props => props.theme.colors.text};
  font-weight: 500;
  word-break: break-word;
`;

export const ModernConfirmWarning = styled.div`
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary}12 0%,
    ${props => props.theme.colors.primary}06 100%
  );
  border: 1px solid ${props => props.theme.colors.primary}40;
  border-radius: 14px;
  padding: 18px 22px;
  margin-bottom: 24px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
`;

export const ModernConfirmWarningText = styled.p`
  margin: 0;
  font-size: 0.95rem;
  color: ${props => props.theme.colors.text};
  line-height: 1.55;
  font-weight: 500;
`;

// Footer do modal moderno - sem posição fixa
export const ModernModalFooter = styled.div`
  padding: 24px 40px 32px 40px;
  border-top: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.backgroundSecondary};
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  align-items: center;

  @media (max-width: 768px) {
    padding: 20px 28px 24px 28px;
    flex-direction: column-reverse;
    gap: 12px;

    button {
      width: 100%;
    }
  }

  @media (max-width: 480px) {
    padding: 16px;

    button {
      width: 100%;
      min-height: 48px;
    }
  }
`;

// Botão moderno
export const ModernButton = styled.button<{
  $variant?: 'primary' | 'secondary' | 'danger';
}>`
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-width: 120px;
  justify-content: center;

  ${props => {
    if (props.$variant === 'primary') {
      return `
        background: linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.primaryDark} 100%);
        color: white;
        box-shadow: 0 4px 16px ${props.theme.colors.primary}30;

        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px ${props.theme.colors.primary}40;
        }
      `;
    } else if (props.$variant === 'danger') {
      return `
        background: ${props.theme.mode === 'dark' ? '#7f1d1d' : '#fee2e2'};
        color: ${props.theme.mode === 'dark' ? '#fca5a5' : '#991b1b'};
        border: 2px solid ${props.theme.mode === 'dark' ? '#991b1b' : '#fecaca'};

        &:hover:not(:disabled) {
          background: ${props.theme.mode === 'dark' ? '#991b1b' : '#fecaca'};
          transform: translateY(-2px);
        }
      `;
    } else {
      return `
        background: ${props.theme.mode === 'light' ? '#F3F4F6' : props.theme.colors.background};
        color: ${props.theme.colors.text};
        border: 2px solid ${props.theme.colors.border};

        &:hover:not(:disabled) {
          background: ${props.theme.mode === 'light' ? '#E5E7EB' : props.theme.colors.primary + '10'};
          border-color: ${props.theme.colors.primary};
          color: ${props.theme.colors.primary};
          transform: translateY(-2px);
        }
      `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 12px 24px;
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    min-height: 48px;
    padding: 14px 20px;
  }
`;

// Loading state moderno
export const ModernLoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
`;

export const ModernLoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${props => props.theme.colors.border};
  border-top: 3px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const ModernLoadingText = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  font-weight: 500;
`;

// Estados vazios modernos
export const ModernEmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 16px;
  border: 2px dashed ${props => props.theme.colors.border};
  margin: 24px 0;
`;

export const ModernEmptyStateIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 16px;
`;

export const ModernEmptyStateTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;
`;

export const ModernEmptyStateDescription = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  line-height: 1.5;
`;
