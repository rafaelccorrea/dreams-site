import styled from 'styled-components';

// Container do input
export const InputContainer = styled.div`
  position: relative;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    margin-bottom: 14px;
  }

  @media (max-width: 480px) {
    margin-bottom: 12px;
  }
`;

// Label do input
export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #4b5563;
  font-size: 0.9rem;
  font-family: 'Poppins', sans-serif;
`;

// Wrapper do input
export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

// Ícone do input
export const IconWrapper = styled.div`
  position: absolute;
  left: 16px;
  z-index: 2;
  color: ${props => props.theme.colors.primary};
  font-size: 1.2rem;
  pointer-events: none;

  @media (max-width: 768px) {
    left: 14px;
    font-size: 1.1rem;
  }

  @media (max-width: 480px) {
    left: 12px;
    font-size: 1rem;
  }
`;

// Botão de ação (ex: mostrar senha)
export const ActionButton = styled.button`
  position: absolute;
  right: 16px;
  z-index: 2;
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.2rem;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${props => props.theme.colors.text};
    background: ${props => props.theme.colors.hover};
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    right: 14px;
    font-size: 1.1rem;
  }

  @media (max-width: 480px) {
    right: 12px;
    font-size: 1rem;
  }
`;

// Input base
export const Input = styled.input`
  width: 100%;
  padding: 16px 20px;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  font-size: 0.9375rem;
  transition: all 0.2s ease;
  background: #f8fafc;
  font-family: 'Poppins', sans-serif;
  color: #1e293b;

  &.with-icon {
    padding-left: 50px;
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    background: #ffffff;
    box-shadow: 0 0 0 4px ${props => `${props.theme.colors.primary}10`};
  }

  &:hover {
    border-color: #94a3b8;
    background: #ffffff;
  }

  &.error {
    border-color: ${props => props.theme.colors.error};
    background: ${props => `${props.theme.colors.error}10`};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textLight};
  }

  /* Ajustar padding quando há botão de ação */
  &.with-action {
    padding-right: 50px;
  }

  @media (max-width: 768px) {
    padding: 14px 18px;

    &.with-icon {
      padding-left: 46px;
    }

    &.with-action {
      padding-right: 46px;
    }
  }

  @media (max-width: 480px) {
    padding: 12px 16px;
    font-size: 0.9rem;

    &.with-icon {
      padding-left: 42px;
    }

    &.with-action {
      padding-right: 42px;
    }
  }
`;

// Mensagem de erro
export const ErrorMessage = styled.span`
  color: #ff4757;
  font-size: 0.8rem;
  margin-top: 4px;
  display: block;
`;

// Container do checkbox
export const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0;
`;

// Checkbox
export const Checkbox = styled.input`
  margin-right: 8px;
  width: 16px;
  height: 16px;
  accent-color: ${props => props.theme.colors.primary};
`;

// Label do checkbox
export const CheckboxLabel = styled.label`
  font-size: 0.9rem;
  color: #4b5563;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  user-select: none;
`;
