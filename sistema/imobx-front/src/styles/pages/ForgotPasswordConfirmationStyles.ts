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

// Container para botões
export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
  width: 100%;
`;
