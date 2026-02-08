import styled from 'styled-components';

// Container do alerta
export const AlertContainer = styled.div<{
  type: 'success' | 'error' | 'info' | 'warning';
}>`
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: 'Poppins', sans-serif;

  ${props => {
    switch (props.type) {
      case 'success':
        return `
          background: #d1fae5;
          border: 1px solid #a7f3d0;
          color: #065f46;
        `;
      case 'error':
        return `
          background: #fee2e2;
          border: 1px solid #fca5a5;
          color: #991b1b;
        `;
      case 'warning':
        return `
          background: #fef3c7;
          border: 1px solid #fde68a;
          color: #92400e;
        `;
      case 'info':
      default:
        return `
          background: ${props.theme.colors.infoBackground || props.theme.colors.primary}15;
          border: 1px solid ${props.theme.colors.infoBorder || props.theme.colors.primary}40;
          color: ${props.theme.colors.infoText || props.theme.colors.primary};
        `;
    }
  }}

  @media (max-width: 768px) {
    padding: 10px 14px;
    margin-bottom: 16px;
  }

  @media (max-width: 480px) {
    padding: 8px 12px;
    margin-bottom: 14px;
  }
`;

// Conteúdo do alerta
export const AlertContent = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

// Ícone do alerta
export const AlertIcon = styled.span`
  font-size: 1.2rem;
  margin-right: 8px;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-right: 6px;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    margin-right: 4px;
  }
`;

// Mensagem do alerta
export const AlertMessage = styled.span`
  font-size: 0.9rem;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

// Botão de fechar alerta
export const AlertCloseButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  margin-left: 8px;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-left: 6px;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    margin-left: 4px;
  }
`;

// Container de loading
export const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

// Spinner de loading
export const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid #e5e7eb;
  border-top: 2px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 768px) {
    width: 18px;
    height: 18px;
    margin-right: 6px;
  }

  @media (max-width: 480px) {
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }
`;

// Texto de loading
export const LoadingText = styled.span`
  font-size: 0.9rem;
  color: #6b7280;
  font-family: 'Poppins', sans-serif;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

// Ícone de chave animado
export const KeyIcon = styled.div<{ $isAnimating?: boolean }>`
  font-size: 1.2rem;
  transition: all 0.3s ease;
  transform: ${props =>
    props.$isAnimating ? 'rotate(15deg) scale(1.1)' : 'rotate(0deg) scale(1)'};

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;
