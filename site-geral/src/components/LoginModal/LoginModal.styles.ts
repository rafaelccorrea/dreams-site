import styled from 'styled-components'
import { Button, Box, Link, TextField } from '@mui/material'

export const LoginModalContainer = styled(Box)`
  padding: ${({ theme }) => theme.spacing.lg};
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  
  /* Esconde a barra de scroll */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE e Edge */
  
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari e Opera */
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
    padding-top: ${({ theme }) => theme.spacing.md};
    padding-bottom: ${({ theme }) => theme.spacing.md};
  }
`

export const LogoContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.xs} 0;

  img {
    filter: drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.1));
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    padding: 0;
    
    img {
      height: 60px !important;
      max-height: 60px !important;
    }
  }
`

export const LoginModalHeader = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.xs};
  
  h5 {
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.primaryDark || theme.colors.primary} 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-size: 1.5rem !important;
    letter-spacing: -0.5px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    padding-bottom: 0;
    
    h5 {
      font-size: 1.125rem !important;
      line-height: 1.3 !important;
    }
  }
`

export const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: ${({ theme }) => theme.spacing.xs};
  }
`

export const StyledTextField = styled(TextField)`
  .MuiOutlinedInput-root {
    border-radius: ${({ theme }) => theme.borderRadius.lg || '12px'} !important;
    background-color: #ffffff;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    
    &:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
    
    &.Mui-focused {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  }

  .MuiInputLabel-root {
    font-weight: 500;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    .MuiOutlinedInput-root {
      font-size: 0.9375rem !important;
      padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`} !important;
      min-height: 44px !important;
    }

    .MuiInputLabel-root {
      font-size: 0.875rem !important;
    }

    .MuiInputAdornment-root {
      margin-right: ${({ theme }) => theme.spacing.xs} !important;
      
      svg {
        font-size: 1.125rem !important;
      }
    }
  }
`

export const GoogleButton = styled(Button)`
  border: 2px solid ${({ theme }) => theme.colors.neutralMedium || '#e0e0e0'} !important;
  color: ${({ theme }) => theme.colors.textPrimary} !important;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`} !important;
  font-weight: 600 !important;
  text-transform: none !important;
  border-radius: ${({ theme }) => theme.borderRadius.lg || '12px'} !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  background: white !important;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06) !important;
  font-size: 0.95rem !important;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.05), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.neutralLight || '#f8f9fa'} !important;
    border-color: ${({ theme }) => theme.colors.primary} !important;
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12) !important;

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`} !important;
    font-size: 0.875rem !important;
    min-height: 44px !important;
    
    &:hover {
      transform: none;
    }
  }
`

export const LoginButton = styled(Button)`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.primaryDark || theme.colors.primary} 100%) !important;
  color: white !important;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`} !important;
  font-weight: 600 !important;
  text-transform: none !important;
  border-radius: ${({ theme }) => theme.borderRadius.lg || '12px'} !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  position: relative;
  overflow: hidden;
  border: none !important;
  font-size: 1rem !important;

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
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.primaryDark || theme.colors.primary} 0%, ${({ theme }) => theme.colors.primary} 100%) !important;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.15) !important;
    transform: translateY(-2px) scale(1.02);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0) scale(0.98);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
  }

  &:disabled {
    opacity: 0.6;
    transform: none !important;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`} !important;
    font-size: 0.875rem !important;
    min-height: 42px !important;
    max-height: 42px !important;
    
    &:hover {
      transform: none;
    }
  }
`

export const RegisterButton = styled(Button)`
  border: 2px solid ${({ theme }) => theme.colors.primary} !important;
  color: ${({ theme }) => theme.colors.primary} !important;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`} !important;
  font-weight: 600 !important;
  text-transform: none !important;
  border-radius: ${({ theme }) => theme.borderRadius.lg || '12px'} !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  background: transparent !important;
  position: relative;
  overflow: hidden;
  font-size: 1rem !important;

  /* Força cor do texto inicial - azul */
  &,
  & *,
  & .MuiButton-root,
  & .MuiButton-label,
  & .MuiButton-text,
  & span,
  & .MuiButtonBase-root {
    color: ${({ theme }) => theme.colors.primary} !important;
  }

  &:hover {
    border-color: #667eea !important;
    background: #667eea !important;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.25), 0 4px 8px rgba(118, 75, 162, 0.15) !important;

    /* Força texto branco no hover - IMPORTANTE: usar !important e seletores específicos */
    color: #ffffff !important;
    
    & .MuiButton-label {
      color: #ffffff !important;
    }
    
    & .MuiButton-text {
      color: #ffffff !important;
    }
    
    & span {
      color: #ffffff !important;
    }
    
    & * {
      color: #ffffff !important;
    }
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2) !important;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`} !important;
    font-size: 0.875rem !important;
    min-height: 42px !important;
    max-height: 42px !important;
    
    &:hover {
      transform: none;
    }
  }
`

export const ForgotPasswordLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary} !important;
  text-decoration: none !important;
  font-size: 0.8125rem !important;
  font-weight: 500 !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
  position: relative;
  display: inline-block;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: ${({ theme }) => theme.colors.primary};
    transition: width 0.3s ease;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primaryDark} !important;
    
    &::after {
      width: 100%;
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 0.75rem !important;
  }
`

export const StyledDivider = styled(Box)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin: ${({ theme }) => theme.spacing.sm} 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(
      to right,
      transparent,
      ${({ theme }) => theme.colors.neutralMedium || '#e0e0e0'},
      transparent
    );
  }

  span {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 0.8125rem;
    font-weight: 500;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin: ${({ theme }) => theme.spacing.xs} 0;
    gap: ${({ theme }) => theme.spacing.xs};
    
    span {
      font-size: 0.75rem;
    }
  }
`

