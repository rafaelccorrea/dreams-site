import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu as MenuIcon, Close as CloseIcon, KeyboardArrowDown, Login as LoginIcon } from '@mui/icons-material'
import {
  StyledAppBar,
  HeaderContainer,
  LeftSection,
  CenterSection,
  RightSection,
  LogoContainer,
  LogoText,
  NavigationContainer,
  NavLink,
  MobileMenuToggle,
  MobileMenu,
  Overlay,
  NavLinkWithDropdown,
  DropdownMenu,
  DropdownItem,
  ChevronIcon,
} from './Header.styles'
import { StyledButton } from './HeaderButton'
import { NavItem } from './Header.types'
import { LocationIndicator } from '../LocationIndicator'

interface HeaderProps {
  currentPath?: string
}

export const Header = ({ currentPath = '/' }: HeaderProps) => {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const handleLogoClick = () => {
    navigate('/')
    closeMobileMenu()
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  const handleDropdownEnter = (href: string) => {
    setOpenDropdown(href)
  }

  const handleDropdownLeave = () => {
    setOpenDropdown(null)
  }

  const navItems: NavItem[] = [
    {
      label: 'Comprar',
      href: '/imoveis-para-comprar',
      submenu: [
        { label: 'Casas à Venda', href: '/casas-a-venda' },
        { label: 'Apartamentos à Venda', href: '/apartamentos-a-venda' },
        { label: 'Imóveis Comerciais', href: '/imoveis-comerciais-a-venda' },
      ],
    },
    {
      label: 'Alugar',
      href: '/alugar',
      submenu: [
        { label: 'Casas para Locação', href: '/casas-para-alugar' },
        { label: 'Apartamentos para Locação', href: '/apartamentos-para-alugar' },
        { label: 'Imóveis Comerciais', href: '/imoveis-comerciais-para-alugar' },
      ],
    },
    { label: 'Lançamentos', href: '/lancamentos' },
    { label: 'Terrenos', href: '/terrenos' },
    { label: 'Corretores', href: '/corretores' },
    { label: 'Imobiliárias', href: '/imobiliarias' },
  ]

  return (
    <>
      <StyledAppBar>
        <HeaderContainer maxWidth="xl">
          {/* Seção Esquerda - Logo */}
          <LeftSection>
            <LogoContainer onClick={handleLogoClick}>
              <span style={{ fontSize: '2rem' }}>🏠</span>
              <LogoText>Imóveis</LogoText>
            </LogoContainer>
          </LeftSection>

          {/* Seção Central - Navegação */}
          <CenterSection>
            <NavigationContainer>
              {navItems.map((item) => {
                if (item.submenu && item.submenu.length > 0) {
                  const isDropdownOpen = openDropdown === item.href
                  const isActive = currentPath === item.href || item.submenu.some(sub => currentPath === sub.href)
                  
                  return (
                    <NavLinkWithDropdown
                      key={item.href}
                      onMouseEnter={() => handleDropdownEnter(item.href)}
                      onMouseLeave={handleDropdownLeave}
                    >
                      <NavLink
                        to={item.href}
                        className={isActive ? 'active' : ''}
                        onClick={(e) => {
                          e.preventDefault()
                        }}
                      >
                        {item.label}
                        <ChevronIcon className={isDropdownOpen ? 'open' : ''}>
                          <KeyboardArrowDown fontSize="small" />
                        </ChevronIcon>
                      </NavLink>
                      <DropdownMenu $isOpen={isDropdownOpen}>
                        {item.submenu.map((subItem) => (
                          <DropdownItem
                            key={subItem.href}
                            to={subItem.href}
                            onClick={closeMobileMenu}
                          >
                            {subItem.label}
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </NavLinkWithDropdown>
                  )
                }
                
                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    className={currentPath === item.href ? 'active' : ''}
                    onClick={closeMobileMenu}
                  >
                    {item.label}
                  </NavLink>
                )
              })}
            </NavigationContainer>
          </CenterSection>

          {/* Seção Direita - Localização e Botão Entrar */}
          <RightSection>
            <LocationIndicator />
            <StyledButton variant="contained" color="primary" startIcon={<LoginIcon />}>
              Entrar
            </StyledButton>
            <MobileMenuToggle onClick={toggleMobileMenu}>
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </MobileMenuToggle>
          </RightSection>
        </HeaderContainer>

        {/* Menu Mobile */}
        <MobileMenu $isOpen={mobileMenuOpen}>
          {navItems.map((item) => {
            if (item.submenu && item.submenu.length > 0) {
              return (
                <div key={item.href}>
                  <NavLink
                    to={item.href}
                    className={currentPath === item.href ? 'active' : ''}
                    onClick={closeMobileMenu}
                  >
                    {item.label}
                  </NavLink>
                  {item.submenu.map((subItem) => (
                    <NavLink
                      key={subItem.href}
                      to={subItem.href}
                      className={currentPath === subItem.href ? 'active' : ''}
                      onClick={closeMobileMenu}
                      style={{ paddingLeft: '2rem', fontSize: '0.9rem' }}
                    >
                      {subItem.label}
                    </NavLink>
                  ))}
                </div>
              )
            }
            
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={currentPath === item.href ? 'active' : ''}
                onClick={closeMobileMenu}
              >
                {item.label}
              </NavLink>
            )
          })}
          <StyledButton variant="contained" color="primary" fullWidth onClick={closeMobileMenu} startIcon={<LoginIcon />}>
            Entrar
          </StyledButton>
        </MobileMenu>
      </StyledAppBar>

      <Overlay $isOpen={mobileMenuOpen} onClick={closeMobileMenu} />
    </>
  )
}

