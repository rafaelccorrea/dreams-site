import styled from 'styled-components'
import { Box, Container, Link } from '@mui/material'

export const StyledFooter = styled(Box)`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: ${({ theme }) => theme.colors.white || '#ffffff'};
  padding: ${({ theme }) => theme.spacing['2xl']} 0 ${({ theme }) => theme.spacing.lg} 0;
  margin-top: auto;
  width: 100%;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  z-index: 10;
`

export const FooterContainer = styled(Container)`
  width: 100% !important;
  max-width: 100% !important;
  padding: ${({ theme }) => `${theme.spacing.xl} ${theme.spacing['2xl']}`} !important;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => `${theme.spacing.lg} ${theme.spacing.lg}`} !important;
  }
`

export const FooterContent = styled(Box)`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  align-items: start;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 350px 1fr 1fr;
    gap: ${({ theme }) => theme.spacing['2xl']};
    align-items: start;
    justify-content: space-between;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 400px 1fr 1fr;
  }
`

export const LogoContainer = styled(Box)`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  width: 100%;
  height: fit-content;
  overflow: hidden;

  img {
    filter: brightness(1.1);
    max-width: 100%;
    height: auto;
    object-fit: contain;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    img {
      height: 235px !important;
      max-width: 100%;
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    justify-content: center;
    align-items: center;
    
    img {
      height: 120px !important;
      max-width: 180px;
    }
  }
`

export const FooterSection = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  min-width: 0;
  width: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    align-items: center;
    text-align: center;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    align-items: flex-start;
    text-align: left;
    max-width: 280px;
  }
`

export const FooterInfo = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`

export const FooterInfoItem = styled(Box)`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    justify-content: center;
    align-items: center;
  }
`

export const FooterLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primaryLight || '#8BB4D9'} !important;
  text-decoration: none !important;
  transition: all ${({ theme }) => theme.transitions.base};
  position: relative;

  &:hover {
    color: ${({ theme }) => theme.colors.primary || '#3370A6'} !important;
    transform: translateX(2px);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 1px;
    background: ${({ theme }) => theme.colors.primaryLight || '#8BB4D9'};
    transition: width ${({ theme }) => theme.transitions.base};
  }

  &:hover::after {
    width: 100%;
  }
`

