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
  flex: 1 1 0;
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
  flex: 0 0 auto;
  height: 100% !important;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  overflow: hidden !important;
  position: relative;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none !important;
  }
`

export const RightSection = styled.div`
  display: flex !important;
  justify-content: flex-end;
  align-items: center !important;
  flex: 1 1 0;
  gap: ${({ theme }) => theme.spacing.md};
  height: 100% !important;
  flex-wrap: nowrap;
  overflow: visible;
  position: relative;
  z-index: ${({ theme }) => theme.zIndex.sticky + 1};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    justify-content: flex-end;
    gap: ${({ theme }) => theme.spacing.sm};
    overflow: visible;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: ${({ theme }) => theme.spacing.xs};
    overflow: visible;
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
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: nowrap;
  height: 100%;
  width: 100%;
  overflow: hidden !important;
  position: relative;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    gap: ${({ theme }) => theme.spacing.xs};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    gap: ${({ theme }) => theme.spacing.xs};
  }
`

export const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 500;
  text-decoration: none;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.xs}`};
  transition: all ${({ theme }) => theme.transitions.base};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  white-space: nowrap;
  height: 100%;
  line-height: 1.5;
  font-size: 0.9rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    font-size: 0.85rem;
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.xs}`};
  }

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

export const McmvNavLink = styled(NavLink)`
  color: #3370A6 !important;
  font-weight: 600;
  animation: heartbeat 1.5s ease-in-out infinite;

  @keyframes heartbeat {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    5% {
      transform: scale(1.1);
      opacity: 0.9;
    }
    10% {
      transform: scale(1);
      opacity: 1;
    }
    15% {
      transform: scale(1.1);
      opacity: 0.9;
    }
    20% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  &:hover {
    color: #508BBF !important;
    animation: none;
    transform: scale(1.05);
  }

  &.active {
    color: #3370A6 !important;
    animation: none !important;
    transform: none !important;
  }
`

export const MobileLocationIcon = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.5rem;
  transition: transform ${({ theme }) => theme.transitions.base};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.1);
    color: ${({ theme }) => theme.colors.primaryDark};
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
  position: relative;
  z-index: ${({ theme }) => theme.zIndex.sticky + 1};
  flex-shrink: 0;
  min-width: 44px;

  &:hover {
    transform: scale(1.1);
    color: ${({ theme }) => theme.colors.primaryDark};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: flex !important;
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
  gap: ${({ theme }) => theme.spacing.xs};
  z-index: ${({ theme }) => theme.zIndex.dropdown};
  transform: ${({ $isOpen }) => ($isOpen ? 'translateY(0)' : 'translateY(-100%)')};
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: ${({ $isOpen }) => ($isOpen ? 'auto' : 'none')};
  border-top: 1px solid ${({ theme }) => theme.colors.neutralLight || '#e0e0e0'};
  max-height: calc(100vh - 100px);
  overflow-y: auto;
  overflow-x: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: flex;
    top: 100px;
    margin-top: 0;
    max-height: calc(100vh - 100px);
    padding: ${({ theme }) => theme.spacing.lg};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    top: 90px;
    max-height: calc(100vh - 90px);
    padding: ${({ theme }) => theme.spacing.md};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    top: 70px;
    max-height: calc(100vh - 70px);
    padding: ${({ theme }) => theme.spacing.md};
  }
`

export const MobileMenuItem = styled.button<{ $isOpen?: boolean }>`
  width: 100%;
  text-align: left;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: none;
  background: ${({ $isOpen }) => 
    $isOpen ? 'rgba(51, 112, 166, 0.08)' : 'transparent'};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.5;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  margin-bottom: ${({ theme }) => theme.spacing.xs};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) and (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: ${({ theme }) => `${theme.spacing.lg} ${theme.spacing.xl}`};
    font-size: 1.0625rem;
  }

  &:hover {
    background: ${({ $isOpen }) => 
      $isOpen ? 'rgba(51, 112, 166, 0.12)' : 'rgba(0, 0, 0, 0.04)'};
    color: ${({ theme }) => theme.colors.primary};
  }

  &:active {
    transform: scale(0.98);
  }

  span {
    flex: 1;
    font-weight: 600;
    letter-spacing: -0.01em;
  }
`

export const MobileSubmenu = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  padding-left: ${({ theme }) => theme.spacing.lg};
  padding-right: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  animation: ${({ $isOpen }) => 
    $isOpen ? 'slideDown 0.2s ease-out' : 'none'};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) and (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding-left: ${({ theme }) => theme.spacing.xl};
    padding-right: ${({ theme }) => theme.spacing.lg};
  }
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

export const MobileSubmenuItem = styled(Link)`
  display: block;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 0.9375rem;
  line-height: 1.5;
  text-decoration: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  padding-left: ${({ theme }) => `calc(${theme.spacing.md} + 4px)`};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) and (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
    font-size: 1rem;
    padding-left: ${({ theme }) => `calc(${theme.spacing.lg} + 4px)`};
  }

  &::before {
    content: '';
    position: absolute;
    left: ${({ theme }) => theme.spacing.sm};
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primaryLight};
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  &:hover {
    background: rgba(51, 112, 166, 0.06);
    color: ${({ theme }) => theme.colors.primary};
    padding-left: ${({ theme }) => `calc(${theme.spacing.md} + 8px)`};
    
    &::before {
      opacity: 1;
    }
  }

  &.active {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
    background: rgba(51, 112, 166, 0.08);
    
    &::before {
      opacity: 1;
      background: ${({ theme }) => theme.colors.primary};
    }
  }
`

export const MobileUserSection = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.neutralLight || '#e0e0e0'};
  margin-top: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.md};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`

export const MobileUserInfo = styled.div`
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: linear-gradient(135deg, rgba(51, 112, 166, 0.05) 0%, rgba(80, 139, 191, 0.03) 100%);
  border: 1px solid rgba(51, 112, 166, 0.1);
`

export const MobileUserName = styled.div`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  letter-spacing: -0.01em;
`

export const MobileUserLocation = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textSecondary};
  
  svg {
    font-size: 1rem;
  }
`

export const MobileLogoutButton = styled.button`
  width: 100%;
  text-align: left;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  margin-top: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.error};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 0.9375rem;
  line-height: 1.5;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  padding-left: ${({ theme }) => `calc(${theme.spacing.md} + 4px)`};

  &:hover {
    background: rgba(244, 67, 54, 0.08);
    color: ${({ theme }) => theme.colors.error};
    padding-left: ${({ theme }) => `calc(${theme.spacing.md} + 8px)`};
  }

  &:active {
    transform: scale(0.98);
  }

  svg {
    font-size: 1.125rem;
  }
`

export const MobileNavLink = styled(Link)`
  display: block;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.5;
  text-decoration: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  position: relative;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) and (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: ${({ theme }) => `${theme.spacing.lg} ${theme.spacing.xl}`};
    font-size: 1.0625rem;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.04);
    color: ${({ theme }) => theme.colors.primary};
  }

  &.active {
    color: ${({ theme }) => theme.colors.primary};
    background: rgba(51, 112, 166, 0.08);
    font-weight: 600;
  }

  &:active {
    transform: scale(0.98);
  }
`

export const MobileMcmvNavLink = styled(MobileNavLink)`
  color: #3370A6 !important;
  font-weight: 600;
  animation: heartbeat 1.5s ease-in-out infinite;

  @keyframes heartbeat {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    5% {
      transform: scale(1.02);
      opacity: 0.95;
    }
    10% {
      transform: scale(1);
      opacity: 1;
    }
    15% {
      transform: scale(1.02);
      opacity: 0.95;
    }
    20% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  &:hover {
    color: #508BBF !important;
    animation: none;
    transform: scale(1.01);
  }

  &.active {
    color: #3370A6 !important;
    animation: none !important;
    transform: none !important;
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

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    top: 100px;
  }

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
  transform-origin: center;
  transform: rotate(0deg);
  flex-shrink: 0;
  margin-left: auto;
  
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

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) and (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: ${({ theme }) => `${theme.spacing.lg} ${theme.spacing.xl}`};
    font-size: 1.0625rem;
  }

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

export const UserMenuContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`

export const UserName = styled.span`
  font-weight: 600;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: nowrap;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const UserLocationText = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary || '#666'};
  cursor: pointer;
  transition: color ${({ theme }) => theme.transitions.base};
  margin-top: 2px;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  svg {
    font-size: 0.875rem;
  }
`

export const LogoutButton = styled.button`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.primaryDark || theme.colors.primary} 100%);
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.lg || '12px'};
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
  white-space: nowrap;

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

