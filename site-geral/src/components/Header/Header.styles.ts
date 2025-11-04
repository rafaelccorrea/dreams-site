import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { AppBar, Container } from '@mui/material'

export const StyledAppBar = styled(AppBar)`
  background-color: ${({ theme }) => theme.colors.white} !important;
  box-shadow: ${({ theme }) => theme.shadows.md} !important;
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndex.sticky};
  border-radius: 0 !important;
  height: 100px;
  max-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden !important;
  width: 100% !important;
  max-width: 100% !important;
  left: 0;
  right: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: 90px;
    max-height: 90px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    height: 70px;
    max-height: 70px;
  }
`

export const HeaderContainer = styled(Container)`
  && {
    max-width: 100% !important;
  }
  
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  width: 100% !important;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`} !important;
  height: 100px !important;
  margin: 0 !important;
  box-sizing: border-box !important;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  overflow: hidden !important;
  position: relative;
  min-width: 0 !important;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`} !important;
    height: auto !important;
    min-height: 90px;
    max-height: 90px;
    padding-top: ${({ theme }) => theme.spacing.sm} !important;
    padding-bottom: ${({ theme }) => theme.spacing.sm} !important;
    max-width: 100% !important;
    width: 100% !important;
    overflow: hidden !important;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`} !important;
    min-height: 70px;
    max-height: 70px;
    max-width: 100% !important;
    width: 100% !important;
    overflow: hidden !important;
  }
`

export const LeftSection = styled.div`
  display: flex !important;
  align-items: center !important;
  justify-content: flex-start;
  flex: 0 0 auto;
  height: 100% !important;
  min-width: 0;
  overflow: visible;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex: 0 0 auto;
    min-width: 0;
    overflow: visible;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex: 1 1 auto;
    overflow: visible;
  }
`

export const CenterSection = styled.div`
  display: flex !important;
  justify-content: center;
  align-items: center !important;
  flex: 1 1 auto;
  height: 100% !important;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  overflow: hidden !important;
  position: relative;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none !important;
  }
`

export const RightSection = styled.div`
  display: flex !important;
  justify-content: flex-end;
  align-items: center !important;
  flex: 0 0 auto;
  gap: ${({ theme }) => theme.spacing.md};
  height: 100% !important;
  flex-wrap: wrap;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    justify-content: flex-end;
    gap: ${({ theme }) => theme.spacing.sm};
    overflow: hidden;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: ${({ theme }) => theme.spacing.xs};
    overflow: hidden;
  }
`

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  transition: transform ${({ theme }) => theme.transitions.base};
  position: relative;
  overflow: visible;
  height: 100%;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    transition: none;
    
    &:hover {
      transform: none;
    }
  }

  .logo-header {
    height: 235px;
    max-width: 100%;
    width: auto;
    object-fit: contain;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
      height: 180px !important;
      width: auto;
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
      height: 180px !important;
      width: auto;
    }
  }
`

export const ShootingStar = styled.div`
  position: absolute;
  top: 50%;
  left: -20px;
  width: 3px;
  height: 3px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, rgba(139, 180, 217, 0.4) 50%, transparent 100%);
  border-radius: 50%;
  box-shadow: 
    0 0 8px rgba(255, 255, 255, 0.4),
    0 0 12px rgba(139, 180, 217, 0.3),
    0 0 18px rgba(139, 180, 217, 0.2);
  animation: shootingStar 5s ease-in-out infinite;
  z-index: 10;
  pointer-events: none;
  transform: translateY(-50%);

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 60px;
    height: 1.5px;
    background: linear-gradient(90deg, 
      transparent 0%,
      rgba(255, 255, 255, 0.4) 30%, 
      rgba(139, 180, 217, 0.3) 60%, 
      transparent 100%);
    transform: translate(-50%, -50%);
    transform-origin: left center;
    filter: blur(0.5px);
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 80px;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent 0%,
      rgba(255, 255, 255, 0.2) 40%, 
      transparent 100%);
    transform: translate(-50%, -50%);
    transform-origin: left center;
    filter: blur(1px);
  }

  @keyframes shootingStar {
    0% {
      transform: translate(-30px, -50%) scale(0);
      opacity: 0;
    }
    10% {
      opacity: 0.6;
      transform: translate(-30px, -50%) scale(1);
    }
    50% {
      opacity: 0.8;
      transform: translate(120px, -50%) scale(1);
    }
    90% {
      opacity: 0.6;
      transform: translate(270px, -50%) scale(1);
    }
    95% {
      opacity: 1;
      transform: translate(280px, -50%) scale(1.5);
      box-shadow: 
        0 0 20px rgba(255, 255, 255, 0.8),
        0 0 40px rgba(139, 180, 217, 0.6),
        0 0 60px rgba(139, 180, 217, 0.4),
        0 0 80px rgba(139, 180, 217, 0.2);
    }
    100% {
      transform: translate(300px, -50%) scale(0);
      opacity: 0;
    }
  }
`

export const LogoText = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`

export const NavigationContainer = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: nowrap;
  height: 100%;
  width: 100%;
  overflow: hidden !important;
  position: relative;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    gap: ${({ theme }) => theme.spacing.sm};
  }
`

export const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 500;
  text-decoration: none;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  transition: all ${({ theme }) => theme.transitions.base};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  white-space: nowrap;
  height: 100%;
  line-height: 1.5;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background: ${({ theme }) => theme.colors.primary};
    transition: width ${({ theme }) => theme.transitions.base},
      left ${({ theme }) => theme.transitions.base};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary};

    &::after {
      width: 100%;
      left: 0;
    }
  }

  &.active {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;

    &::after {
      width: 100%;
      left: 0;
    }
  }
`

export const MobileLocationIcon = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.5rem;
  transition: transform ${({ theme }) => theme.transitions.base};
  height: 100%;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.1);
    color: ${({ theme }) => theme.colors.primaryDark};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
  }
`

export const MobileMenuToggle = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.5rem;
  transition: transform ${({ theme }) => theme.transitions.base};
  height: 100%;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.1);
    color: ${({ theme }) => theme.colors.primaryDark};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
  }
`

export const SearchIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary};
  transition: transform ${({ theme }) => theme.transitions.base};
  height: 100%;
  padding: ${({ theme }) => theme.spacing.xs};
  min-width: 40px;

  &:hover {
    transform: scale(1.1);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`

export const MobileMenu = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 100px;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  display: none;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  z-index: ${({ theme }) => theme.zIndex.dropdown};
  transform: ${({ $isOpen }) => ($isOpen ? 'translateY(0)' : 'translateY(-100%)')};
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transition: transform ${({ theme }) => theme.transitions.base},
    opacity ${({ theme }) => theme.transitions.base};
  pointer-events: ${({ $isOpen }) => ($isOpen ? 'auto' : 'none')};
  border-top: 1px solid ${({ theme }) => theme.colors.neutralLight || '#e0e0e0'};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
    top: 90px;
    margin-top: 0;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    top: 70px;
  }
`

export const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 100px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  z-index: ${({ theme }) => theme.zIndex.dropdown - 1};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    top: 90px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    top: 70px;
  }
`

export const NavLinkWithDropdown = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  z-index: 1;
  
  &:hover {
    z-index: 10000;
  }
`

export const DropdownMenu = styled.div<{ $isOpen: boolean; $position?: { top: number; left: number } | null }>`
  position: fixed;
  top: ${({ $position }) => ($position ? `${$position.top}px` : '-9999px')};
  left: ${({ $position }) => ($position ? `${$position.left}px` : '-9999px')};
  transform: translateX(-50%);
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: ${({ theme }) => theme.spacing.sm};
  min-width: 240px;
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')} !important;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  z-index: 99999 !important;
  white-space: nowrap;
  pointer-events: ${({ $isOpen }) => ($isOpen ? 'auto' : 'none')};
  transition: opacity ${({ theme }) => theme.transitions.base};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none !important;
  }
`

export const DropdownItem = styled(Link)`
  color: ${({ theme }) => theme.colors.textPrimary};
  text-decoration: none;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: all ${({ theme }) => theme.transitions.base};
  font-weight: 500;

  &:hover {
    background-color: ${({ theme }) => theme.colors.neutralLight};
    color: ${({ theme }) => theme.colors.primary};
  }
`

export const ChevronIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform ${({ theme }) => theme.transitions.base};
  
  &.open {
    transform: rotate(180deg);
  }
`

export const MobileLoginButton = styled.button`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.primaryDark || theme.colors.primary} 100%);
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.lg || '12px'};
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  margin-top: ${({ theme }) => theme.spacing.md};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);

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
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1);
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.primaryDark || theme.colors.primary} 0%, ${({ theme }) => theme.colors.primary} 100%);

    &::before {
      left: 100%;
    }

    svg {
      transform: translateX(4px);
    }
  }

  &:active {
    transform: translateY(0) scale(0.98);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  svg {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
`

