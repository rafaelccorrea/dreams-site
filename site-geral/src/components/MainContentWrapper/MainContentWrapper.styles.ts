import styled from 'styled-components'

export const MainContentWrapper = styled.main`
  background-image: url('/background.jpg');
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  background-attachment: scroll;
  min-height: calc(100vh - 100px);
  width: 100%;
  position: relative;
  padding-top: 100px;
  overflow-y: visible;
  
  /* Mostrar a imagem completa começando abaixo do header */
  
  /* Garantir que a imagem seja mostrada completamente */
  background-clip: border-box;
  
  /* Overlay escuro para melhorar legibilidade do conteúdo */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.3) 0%,
      rgba(0, 0, 0, 0.2) 50%,
      rgba(0, 0, 0, 0.4) 100%
    );
    z-index: 0;
  }

  /* Garantir que o conteúdo fique acima do overlay */
  > * {
    position: relative;
    z-index: 1;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-top: 90px;
    min-height: calc(100vh - 90px);
  }
`

