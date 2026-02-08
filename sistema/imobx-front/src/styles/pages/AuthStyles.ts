import styled from 'styled-components';

// Container principal que ocupa a tela inteira
export const LoginContainer = styled.div`
  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
  max-width: 100vw;
  display: flex;
  background-color: white;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
  padding-bottom: env(safe-area-inset-bottom, 0);

  @media (max-width: 992px) {
    min-height: 100dvh;
    overflow-y: auto;
  }
`;

// Card de login que agora se comporta como o wrapper principal do split
export const LoginCard = styled.div`
  display: flex;
  width: 100%;
  min-width: 0;
  min-height: 100vh;
  min-height: 100dvh;
  position: relative;
  background: white;
  overflow: hidden;

  @media (max-width: 992px) {
    flex-direction: column;
    min-height: auto;
    overflow: visible;
  }
`;

// Seção de boas-vindas (Imagem à esquerda - 50%)
export const WelcomeSection = styled.div<{ $bgImage?: string }>`
  flex: 1;
  min-width: 0;
  background: ${props =>
    props.$bgImage
      ? `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.3)), url('${props.$bgImage}')`
      : '#f1f5f9'};
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 80px;
  position: relative;

  @media (max-width: 992px) {
    min-height: 220px;
    padding: 32px 24px;
    flex-shrink: 0;
  }

  @media (max-width: 480px) {
    min-height: 160px;
    padding: 24px 16px;
  }
`;

// Seção do formulário (Direita - 50%)
export const FormSection = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px;
  background-color: white;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 992px) {
    padding: 32px 20px 40px;
    height: auto;
    min-height: 0;
    flex: 1 1 auto;
    justify-content: flex-start;
  }

  @media (max-width: 480px) {
    padding: 24px 16px 32px;
  }
`;

// Wrapper interno do formulário para limitar a largura e centralizar
export const FormWrapper = styled.div`
  width: 100%;
  max-width: 450px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  @media (max-width: 480px) {
    max-width: 100%;
    padding: 0 4px;
  }
`;

// Conteúdo de boas-vindas
export const WelcomeContent = styled.div`
  position: relative;
  z-index: 2;
  color: white;
`;

// Título de boas-vindas
export const WelcomeTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 24px;
  line-height: 1.1;
  font-family: 'Poppins', sans-serif;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);

  @media (max-width: 1200px) {
    font-size: 2.8rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

// Subtítulo de boas-vindas
export const WelcomeSubtitle = styled.p`
  font-size: 1.25rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  font-family: 'Poppins', sans-serif;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

// Título do formulário
export const FormTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: #a63126;
  font-family: 'Poppins', sans-serif;

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

// Botão de voltar (posicionado no topo da seção de boas-vindas)
export const BackButton = styled.button`
  position: absolute;
  top: 40px;
  left: 40px;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateX(-4px);
  }

  @media (max-width: 768px) {
    top: 20px;
    left: 20px;
  }
`;

// Link para cadastro
export const SignUpLink = styled.div`
  margin-top: 32px;
  text-align: center;
  font-size: 0.9375rem;
  color: #64748b;
  font-family: 'Poppins', sans-serif;
  word-wrap: break-word;

  button {
    background: none;
    border: none;
    color: #a63126;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    font-size: inherit;
    margin-left: 4px;

    &:hover {
      text-decoration: underline;
    }
  }

  @media (max-width: 480px) {
    margin-top: 24px;
    font-size: 0.875rem;
  }
`;

// Elementos decorativos (Opcional, podem ser removidos se preferir foco total na imagem)
export const DecorativeElements = styled.div`
  display: none;
`;

export const Circle1 = styled.div``;
export const Circle2 = styled.div``;
export const Wave1 = styled.div``;
export const Wave2 = styled.div``;
