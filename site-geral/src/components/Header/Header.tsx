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
  ShootingStar,
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
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null)

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
    // Limpar timeout se existir
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout)
      setDropdownTimeout(null)
    }
    setOpenDropdown(href)
  }

  const handleDropdownLeave = () => {
    // Adicionar um pequeno delay antes de fechar para evitar fechamento prematuro
    const timeout = setTimeout(() => {
      setOpenDropdown(null)
    }, 150) // 150ms de delay
    setDropdownTimeout(timeout)
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
              <ShootingStar />
              <img 
                src="/logo-dream.png" 
                alt="Dream Keys Logo" 
                style={{ 
                  height: '235px', 
                  width: 'auto',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.15))',
                  position: 'relative',
                  zIndex: 1
                }} 
              />
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
                      <DropdownMenu 
                        $isOpen={isDropdownOpen}
                        onMouseEnter={() => handleDropdownEnter(item.href)}
                        onMouseLeave={handleDropdownLeave}
                      >
                        {item.submenu.map((subItem) => {
                          // Mapear sub-itens para filtros
                          const getFilters = (href: string) => {
                            const params = new URLSearchParams()
                            
                            // Casas
                            if (href.includes('casas-a-venda')) {
                              params.set('type', 'house')
                              params.set('transaction', 'sale')
                            } else if (href.includes('casas-para-alugar')) {
                              params.set('type', 'house')
                              params.set('transaction', 'rent')
                            }
                            // Apartamentos
                            else if (href.includes('apartamentos-a-venda')) {
                              params.set('type', 'apartment')
                              params.set('transaction', 'sale')
                            } else if (href.includes('apartamentos-para-alugar')) {
                              params.set('type', 'apartment')
                              params.set('transaction', 'rent')
                            }
                            // Comerciais
                            else if (href.includes('imoveis-comerciais-a-venda')) {
                              params.set('type', 'commercial')
                              params.set('transaction', 'sale')
                            } else if (href.includes('imoveis-comerciais-para-alugar')) {
                              params.set('type', 'commercial')
                              params.set('transaction', 'rent')
                            }
                            
                            return params.toString()
                          }
                          
                          const filterParams = getFilters(subItem.href)
                          const finalHref = filterParams ? `/?${filterParams}` : '/'
                          
                          return (
                            <DropdownItem
                              key={subItem.href}
                              to={finalHref}
                              onClick={(e) => {
                                e.preventDefault()
                                closeMobileMenu()
                                navigate(finalHref)
                              }}
                            >
                              {subItem.label}
                            </DropdownItem>
                          )
                        })}
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
                  {item.submenu.map((subItem) => {
                    // Mapear sub-itens para filtros (mesma lógica do dropdown)
                    const getFilters = (href: string) => {
                      const params = new URLSearchParams()
                      
                      if (href.includes('casas-a-venda')) {
                        params.set('type', 'house')
                        params.set('transaction', 'sale')
                      } else if (href.includes('casas-para-alugar')) {
                        params.set('type', 'house')
                        params.set('transaction', 'rent')
                      } else if (href.includes('apartamentos-a-venda')) {
                        params.set('type', 'apartment')
                        params.set('transaction', 'sale')
                      } else if (href.includes('apartamentos-para-alugar')) {
                        params.set('type', 'apartment')
                        params.set('transaction', 'rent')
                      } else if (href.includes('imoveis-comerciais-a-venda')) {
                        params.set('type', 'commercial')
                        params.set('transaction', 'sale')
                      } else if (href.includes('imoveis-comerciais-para-alugar')) {
                        params.set('type', 'commercial')
                        params.set('transaction', 'rent')
                      }
                      
                      return params.toString()
                    }
                    
                    const filterParams = getFilters(subItem.href)
                    const finalHref = filterParams ? `/?${filterParams}` : '/'
                    
                    return (
                      <NavLink
                        key={subItem.href}
                        to={finalHref}
                        className={currentPath === subItem.href ? 'active' : ''}
                        onClick={(e) => {
                          e.preventDefault()
                          closeMobileMenu()
                          navigate(finalHref)
                        }}
                        style={{ paddingLeft: '2rem', fontSize: '0.9rem' }}
                      >
                        {subItem.label}
                      </NavLink>
                    )
                  })}
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

