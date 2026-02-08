import styled from 'styled-components';

// FormSection customizado sem elementos decorativos
export const CustomFormSection = styled.div`
  flex: 1;
  padding: 60px 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow-y: auto;
  background: white;
  position: relative;

  @media (max-width: 1024px) {
    padding: 50px 40px;
  }

  @media (max-width: 768px) {
    padding: 40px 30px;
  }

  @media (max-width: 480px) {
    padding: 30px 20px;
  }
`;

// Container para animação de sucesso
export const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px 0;
`;

export const AnimationContainer = styled.div`
  margin-bottom: 32px;
`;

export const SuccessIcon = styled.div`
  color: #10b981;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SuccessTitle = styled.h2`
  color: #0f172a;
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 12px;
  font-family: 'Poppins', sans-serif;
`;

export const SuccessMessage = styled.p`
  color: #64748b;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 12px;
  font-family: 'Poppins', sans-serif;
`;

// Container para campos de senha
export const PasswordFieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 24px;
  width: 100%;
`;

export const PasswordInputContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
  margin-bottom: 8px;
  font-family: 'Poppins', sans-serif;
`;

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  padding-right: 48px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.9375rem;
  transition: all 0.2s ease;
  background: #f8fafc;
  font-family: 'Poppins', sans-serif;
  color: #1e293b;
  height: 52px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    background: white;
    box-shadow: 0 0 0 4px ${props => `${props.theme.colors.primary}10`};
  }

  &:hover {
    border-color: #cbd5e1;
    background: white;
  }

  &:disabled {
    background-color: #f1f5f9;
    cursor: not-allowed;
    opacity: 0.7;
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

export const PasswordToggleButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  z-index: 10;
  transition: all 0.2s ease;

  &:hover {
    color: #0f172a;
    background-color: #f1f5f9;
  }
`;

export const PasswordStrengthIndicator = styled.div<{
  strength: 'weak' | 'medium' | 'strong';
}>`
  font-size: 0.75rem;
  margin-top: 6px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;

  &::before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: currentColor;
  }

  ${props => {
    switch (props.strength) {
      case 'weak':
        return 'color: #ef4444;';
      case 'medium':
        return 'color: #f59e0b;';
      case 'strong':
        return 'color: #10b981;';
      default:
        return 'color: #64748b;';
    }
  }}
`;
