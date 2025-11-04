import { Button } from '@mui/material'
import styled from 'styled-components'

export const StyledButton = styled(Button)`
  text-transform: none;
  font-weight: 600;
  border-radius: ${({ theme }) => theme.borderRadius.lg || '12px'};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.xl}`} !important;
  min-width: 130px !important;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.primaryDark || theme.colors.primary} 100%) !important;
  border: none !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06) !important;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1) !important;
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.primaryDark || theme.colors.primary} 0%, ${({ theme }) => theme.colors.primary} 100%) !important;

    &::before {
      left: 100%;
    }

    .MuiButton-startIcon {
      transform: translateX(4px);
    }
  }

  &:active {
    transform: translateY(0) scale(0.98);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
  }

  .MuiButton-startIcon {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
  }

  &.contained {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06) !important;
    
    &:hover {
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1) !important;
    }
  }

  &.outlined {
    background: transparent !important;
    border: 2px solid ${({ theme }) => theme.colors.primary} !important;
    color: ${({ theme }) => theme.colors.primary} !important;
    box-shadow: none !important;

    &:hover {
      background: ${({ theme }) => theme.colors.primary} !important;
      color: ${({ theme }) => theme.colors.white} !important;
      border-color: ${({ theme }) => theme.colors.primary} !important;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1) !important;
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`


