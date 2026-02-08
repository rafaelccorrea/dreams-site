import styled from 'styled-components';

// FormSection customizado sem elementos decorativos (mantido para compatibilidade, mas não usado mais)
export const CustomFormSection = styled.div`
  flex: 1;
  padding: 60px 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow-y: hidden;
  background: white;

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
  max-width: 320px;

  strong {
    color: #0f172a;
    font-weight: 600;
  }
`;

// Container para campo de email
export const EmailInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
`;

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
  margin-bottom: 8px;
  font-family: 'Poppins', sans-serif;
`;

export const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.9375rem;
  transition: all 0.2s ease;
  background: #f8fafc;
  font-family: 'Poppins', sans-serif;
  color: #1e293b;

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
