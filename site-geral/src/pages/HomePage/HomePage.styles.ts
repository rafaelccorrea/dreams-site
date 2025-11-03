import { Container, Box, Button } from '@mui/material'
import styled, { keyframes } from 'styled-components'

export const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

export const HomeContainer = styled(Container)`
  min-height: calc(100vh - 200px);
  max-height: calc(100vh - 200px + 150px);
  position: relative;
  z-index: 2;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding-top: ${({ theme }) => theme.spacing['2xl']};
  padding-bottom: ${({ theme }) => theme.spacing['2xl']};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    min-height: calc(100vh - 180px);
    max-height: calc(100vh - 180px + 150px);
    padding-top: ${({ theme }) => theme.spacing.xl};
    padding-bottom: ${({ theme }) => theme.spacing.xl};
  }
`

export const LeftSection = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  padding-left: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    align-items: center;
    text-align: center;
    padding-left: 0;
  }
`

export const ContactButton = styled(Button)`
  animation: ${fadeInUp} 1s ease-out forwards;
  animation-delay: 1s;
  opacity: 0;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`};
  font-size: 1rem;
  font-weight: 600;
  text-transform: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.primary};
  box-shadow: ${({ theme }) => theme.shadows.md};
  align-self: flex-start;
  margin-left: 0;

  &:hover {
    background: ${({ theme }) => theme.colors.white};
    box-shadow: ${({ theme }) => theme.shadows.lg};
    transform: translateY(-2px);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    align-self: center;
    margin-left: 0;
    width: 100%;
    max-width: 300px;
  }
`

export const RightSection = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
  }
`

export const PageContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
`
