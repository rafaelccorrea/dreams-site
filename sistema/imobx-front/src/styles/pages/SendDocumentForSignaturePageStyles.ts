import styled, { keyframes } from 'styled-components';

// Animations
export const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// RemoveButton
export const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  color: ${props => props.theme.colors.error};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.error}15;
    border-color: ${props => props.theme.colors.error};
  }
`;

// Loading States
export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
`;

export const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${props => props.theme.colors.border};
  border-top-color: ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

export const LoadingText = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
`;

// Error States
export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
`;

export const ErrorMessage = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.colors.error};
`;

// Document Info
export const DocumentInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.background} 0%,
    ${props => props.theme.colors.backgroundSecondary} 100%
  );
  border-radius: 16px;
  margin-bottom: 24px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

export const DocumentIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.primary};
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
`;

export const DocumentDetails = styled.div`
  flex: 1;
`;

export const DocumentName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

// Info Message
export const InfoMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: ${props => props.theme.colors.warningBackground || '#fef3c7'};
  border: 1px solid ${props => props.theme.colors.warningBorder || '#f59e0b'};
  border-radius: 12px;
  margin-bottom: 24px;
  color: ${props => props.theme.colors.warningText || '#92400e'};
  font-size: 14px;
  line-height: 1.5;

  svg {
    flex-shrink: 0;
    color: ${props => props.theme.colors.warning || '#f59e0b'};
  }
`;

// Signer Card
export const SignerCard = styled.div`
  background: ${props =>
    props.theme.colors.cardBackground || props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

export const SignerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

export const SignerTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

// Form Elements
export const FormGroup = styled.div`
  margin-bottom: 20px;
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
`;

export const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 10px;

  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 14px 18px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 14px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow:
      0 0 0 4px ${props => props.theme.colors.primary}15,
      0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: ${props => props.theme.colors.backgroundSecondary};
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 14px 18px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 14px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 18px center;
  padding-right: 40px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow:
      0 0 0 4px ${props => props.theme.colors.primary}15,
      0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }
`;

export const HelperText = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 6px;
`;

export const AddSignerButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px;
  background: ${props => props.theme.colors.background};
  border: 2px dashed ${props => props.theme.colors.border};
  border-radius: 12px;
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 20px;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primary}10;
    color: ${props => props.theme.colors.primary};
  }
`;

export const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

export const CheckboxLabel = styled.label`
  font-size: 14px;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
`;

// Buttons
export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

export const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  overflow: hidden;

  ${props => {
    if (props.$variant === 'primary') {
      return `
        background: linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.primary}dd 100%);
        color: white;
        box-shadow: 0 4px 12px ${props.theme.colors.primary}40;
        
        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px ${props.theme.colors.primary}60;
        }
        
        &:active:not(:disabled) {
          transform: translateY(0);
        }
      `;
    }
    return `
      background: ${props.theme.colors.background};
      color: ${props.theme.colors.text};
      border: 2px solid ${props.theme.colors.border};
      
      &:hover:not(:disabled) {
        background: ${props.theme.colors.backgroundSecondary};
        border-color: ${props.theme.colors.primary}40;
        transform: translateY(-1px);
      }
    `;
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    background: ${props =>
      props.$variant === 'primary'
        ? props.theme.colors.backgroundSecondary
        : props.theme.colors.background} !important;
    color: ${props => props.theme.colors.textSecondary} !important;
    box-shadow: none !important;
  }
`;

// Confirmation Modal
export const ConfirmModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000000;
  animation: ${fadeIn} 0.3s ease-out;
`;

export const ConfirmModalContent = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  padding: 32px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  border: 1px solid ${props => props.theme.colors.border};
  animation: ${slideUp} 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  text-align: center;
`;

export const ConfirmIcon = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  color: ${props => props.theme.colors.warning || '#f59e0b'};
`;

export const ConfirmTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 16px 0;
`;

export const ConfirmMessage = styled.p`
  font-size: 15px;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
  margin: 0 0 32px 0;

  strong {
    color: ${props => props.theme.colors.text};
    font-weight: 600;
  }
`;

export const ConfirmButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

export const ConfirmButton = styled(Button)<{
  $variant?: 'primary' | 'secondary';
}>`
  ${props => {
    if (props.$variant === 'primary') {
      return `
        background: ${props.theme.colors.primary} !important;
        color: white !important;
        border: none !important;
        
        &:hover:not(:disabled) {
          background: ${props.theme.colors.primary}dd !important;
          opacity: 0.9;
        }
      `;
    }
    if (props.$variant === 'secondary') {
      return `
        background: ${props.theme.colors.error} !important;
        color: white !important;
        border: none !important;
        
        &:hover:not(:disabled) {
          background: ${props.theme.colors.error}dd !important;
          opacity: 0.9;
        }
      `;
    }
    return '';
  }}
`;
