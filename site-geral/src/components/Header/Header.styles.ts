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
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const HeaderContainer = styled(Container)`
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  width: 100% !important;
  max-width: 100% !important;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`} !important;
  height: 100px !important;
  margin: 0 auto;
  box-sizing: border-box !important;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`} !important;
    height: 90px !important;
  }
`

export const LeftSection = styled.div`
  display: flex !important;
  align-items: center !important;
  justify-content: flex-start;
  flex: 0 0 auto;
  height: 100% !important;
`

export const CenterSection = styled.div`
  display: flex !important;
  justify-content: center;
  align-items: center !important;
  flex: 1 1 auto;
  height: 100% !important;
  padding: 0 ${({ theme }) => theme.spacing.lg};

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

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    justify-content: flex-end;
  }
`

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  transition: transform ${({ theme }) => theme.transitions.base};

  &:hover {
    transform: scale(1.05);
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

export const MobileMenuToggle = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1.5rem;
  transition: transform ${({ theme }) => theme.transitions.base};
  height: 100%;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.1);
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

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
    top: 90px;
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
`

export const NavLinkWithDropdown = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`

export const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + ${({ theme }) => theme.spacing.xs});
  left: 50%;
  transform: translateX(-50%);
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: ${({ theme }) => theme.spacing.sm};
  min-width: 240px;
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  z-index: ${({ theme }) => theme.zIndex.dropdown};
  white-space: nowrap;
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

