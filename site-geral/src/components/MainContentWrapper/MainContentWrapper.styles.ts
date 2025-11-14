import styled, { css } from 'styled-components'

interface MainContentWrapperProps {
  $showBackground?: boolean
}

export const MainContentWrapper = styled.main<MainContentWrapperProps>`
  min-height: calc(100vh - 100px);
  width: 100%;
  max-width: 100vw;
  position: relative;
  padding-top: 100px;
  overflow-x: hidden;
  overflow-y: visible;
  isolation: isolate;
  background: ${({ theme, $showBackground }) => 
    $showBackground ? 'transparent' : theme.colors.background};
  
  /* Camada de fundo com a imagem - altura aumentada para acomodar o card */
  /* Apenas se $showBackground for true */
  ${({ $showBackground, theme }) => $showBackground && css`
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: calc(100vh - 100px + 100px);
      max-height: calc(100vh - 100px + 100px);
      background-image: url('/background.jpg');
      background-size: cover;
      background-position: center top;
      background-repeat: no-repeat;
      background-attachment: scroll;
      z-index: 0;

      @media (min-width: ${theme.breakpoints.lg}) {
        height: calc(100vh - 100px + 100px);
        max-height: calc(100vh - 100px + 100px);
      }

      @media (min-width: ${theme.breakpoints.md}) and (max-width: ${theme.breakpoints.lg}) {
        height: 60vh;
        max-height: 60vh;
      }

      @media (max-width: ${theme.breakpoints.md}) {
        height: 80vh;
        max-height: 80vh;
      }
    }
    
    /* Filtros modernos - overlay com gradiente diagonal usando cores do tema */
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: calc(100vh - 100px + 100px);
      max-height: calc(100vh - 100px + 100px);
      background: linear-gradient(
        135deg,
        rgba(51, 112, 166, 0.35) 0%,
        rgba(0, 0, 0, 0.3) 25%,
        rgba(0, 0, 0, 0.2) 50%,
        rgba(0, 0, 0, 0.3) 75%,
        rgba(51, 112, 166, 0.3) 100%
      );
      z-index: 1;

      @media (min-width: ${theme.breakpoints.lg}) {
        height: calc(100vh - 100px + 100px);
        max-height: calc(100vh - 100px + 100px);
      }

      @media (min-width: ${theme.breakpoints.md}) and (max-width: ${theme.breakpoints.lg}) {
        height: 60vh;
        max-height: 60vh;
      }

      @media (max-width: ${theme.breakpoints.md}) {
        height: 80vh;
        max-height: 80vh;
      }
    }
  `}

  /* Garantir que o conteúdo fique acima dos overlays e nítido */
  > * {
    position: relative;
    z-index: 2;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-top: 90px;
    min-height: calc(100vh - 90px);
  }
`

