import { Typography } from '@mui/material'
import styled, { keyframes } from 'styled-components'

const slideInFromLeft = keyframes`
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const AnimatedContainer = styled.div<{ $delay: number }>`
  animation: ${slideInFromLeft} 1.2s ease-out forwards;
  animation-delay: ${({ $delay }) => $delay}s;
  opacity: 0;
  width: 100%;
  max-width: 800px;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    align-items: center;
    margin: 0 auto;
  }
`

const StyledTitle = styled(Typography)`
  color: ${({ theme }) => theme.colors.white};
  font-weight: 700;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
  margin-bottom: ${({ theme }) => theme.spacing.md};
  line-height: 1.2;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 2rem !important;
  }
`

const StyledSubtitle = styled(Typography)`
  color: ${({ theme }) => theme.colors.white};
  font-weight: 400;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
  animation: ${fadeIn} 1s ease-out forwards;
  animation-delay: 1s;
  opacity: 0;
`

interface AnimatedTextProps {
  title: string
  subtitle?: string
  delay?: number
}

export const AnimatedText = ({ title, subtitle, delay = 0 }: AnimatedTextProps) => {

  return (
    <AnimatedContainer $delay={delay}>
      <StyledTitle variant="h1">{title}</StyledTitle>
      {subtitle && <StyledSubtitle variant="h5">{subtitle}</StyledSubtitle>}
    </AnimatedContainer>
  )
}

