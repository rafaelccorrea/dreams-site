import styled from 'styled-components'
import { Fab } from '@mui/material'

export const ScrollToTopButton = styled(Fab)`
  position: fixed !important;
  bottom: ${({ theme }) => theme.spacing.xl} !important;
  right: ${({ theme }) => theme.spacing.xl} !important;
  z-index: ${({ theme }) => theme.zIndex.fixed} !important;
  box-shadow: ${({ theme }) => theme.shadows.lg} !important;
  background: ${({ theme }) => theme.colors.primary} !important;
  color: ${({ theme }) => theme.colors.white} !important;
  transition: all ${({ theme }) => theme.transitions.base} !important;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark} !important;
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.xl} !important;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    bottom: ${({ theme }) => theme.spacing.lg} !important;
    right: ${({ theme }) => theme.spacing.lg} !important;
  }
`


