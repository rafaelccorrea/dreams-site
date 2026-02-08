import styled, { keyframes } from 'styled-components';

// Animações simples
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

// Container principal - layout simples sem cards e sem scroll
export const MainContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background: ${props => props.theme.colors.background};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.lg};
  animation: ${fadeIn} 0.5s ease-in;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: ${props => props.theme.spacing.md};
  }

  @media (max-width: 480px) {
    padding: ${props => props.theme.spacing.sm};
  }
`;

export const ErrorIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => props.theme.colors.error};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin-bottom: ${props => props.theme.spacing.lg};
  animation: ${pulse} 2s ease-in-out infinite;

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
    margin-bottom: ${props => props.theme.spacing.md};
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
    margin-bottom: ${props => props.theme.spacing.sm};
  }
`;

export const MainTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 ${props => props.theme.spacing.md} 0;
  line-height: 1.2;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: ${props => props.theme.spacing.sm};
  }

  @media (max-width: 480px) {
    font-size: 1.25rem;
    margin-bottom: ${props => props.theme.spacing.xs};
  }
`;

export const Subtitle = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 ${props => props.theme.spacing.lg} 0;
  line-height: 1.5;
  text-align: center;
  max-width: 500px;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: ${props => props.theme.spacing.md};
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
    margin-bottom: ${props => props.theme.spacing.sm};
  }
`;

export const InfoTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.xs};

  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: ${props => props.theme.spacing.xs};
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

export const InfoDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 ${props => props.theme.spacing.md} 0;
  font-size: 0.9rem;
  line-height: 1.5;
  text-align: center;
  max-width: 400px;

  @media (max-width: 768px) {
    font-size: 0.85rem;
    margin-bottom: ${props => props.theme.spacing.sm};
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

export const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
  margin: ${props => props.theme.spacing.md} 0;

  @media (max-width: 480px) {
    gap: ${props => props.theme.spacing.xs};
    margin: ${props => props.theme.spacing.sm} 0;
  }
`;

export const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm};
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: ${props => props.theme.borderRadius.sm};
  border: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 480px) {
    padding: ${props => props.theme.spacing.xs};
    gap: ${props => props.theme.spacing.xs};
  }
`;

export const ContactIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;

  @media (max-width: 480px) {
    width: 28px;
    height: 28px;
    font-size: 0.9rem;
  }
`;

export const ContactText = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ContactLabel = styled.div`
  font-size: 0.7rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
  margin-bottom: 1px;
`;

export const ContactValue = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  word-break: break-all;
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  margin-top: ${props => props.theme.spacing.lg};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${props => props.theme.spacing.xs};
    margin-top: ${props => props.theme.spacing.md};
  }

  @media (max-width: 480px) {
    margin-top: ${props => props.theme.spacing.sm};
  }
`;

export const ActionButton = styled.button<{
  $variant?: 'primary' | 'secondary' | 'danger';
}>`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: none;
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.xs};
  min-width: 140px;

  ${props => {
    switch (props.$variant) {
      case 'primary':
        return `
          background: ${props.theme.colors.primary};
          color: white;
          
          &:hover {
            background: ${props.theme.colors.primaryHover};
            transform: translateY(-1px);
          }
        `;
      case 'secondary':
        return `
          background: ${props.theme.colors.success};
          color: white;
          
          &:hover {
            background: #059669;
            transform: translateY(-1px);
          }
        `;
      case 'danger':
        return `
          background: ${props.theme.colors.error};
          color: white;
          
          &:hover {
            background: #dc2626;
            transform: translateY(-1px);
          }
        `;
      default:
        return `
          background: ${props.theme.colors.primary};
          color: white;
          
          &:hover {
            background: ${props.theme.colors.primaryHover};
            transform: translateY(-1px);
          }
        `;
    }
  }}

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    min-width: 100%;
    padding: ${props => props.theme.spacing.xs}
      ${props => props.theme.spacing.sm};
    font-size: 0.8rem;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;
