import { Button } from '@mui/material'
import styled from 'styled-components'

export const StyledButton = styled(Button)`
  text-transform: none;
  font-weight: 500;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.xl} !important;
  min-width: 120px !important;
  transition: all ${({ theme }) => theme.transitions.base};

  &.contained {
    box-shadow: none;
    &:hover {
      box-shadow: ${({ theme }) => theme.shadows.md};
      transform: translateY(-2px);
    }
  }

  &.outlined {
    &:hover {
      transform: translateY(-2px);
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`


