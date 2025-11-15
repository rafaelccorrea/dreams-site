import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Menu as MenuIcon, 
  Close as CloseIcon, 
  KeyboardArrowDown, 
  Login as LoginIcon, 
  LocationOn,
  Logout
} from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
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
  McmvNavLink,
  MobileMenuToggle,
  MobileMenu,
  Overlay,
  NavLinkWithDropdown,
  DropdownMenu,
  DropdownItem,
  ChevronIcon,
  MobileLocationIcon,
  MobileLoginButton,
  MobileMenuItem,
  MobileSubmenu,
  MobileSubmenuItem,
  MobileUserSection,
  MobileUserInfo,
  MobileUserLocation,
  MobileLogoutButton,
  MobileNavLink,
  MobileMcmvNavLink,
} from './Header.styles'
import { StyledButton } from './HeaderButton'
import { NavItem } from './Header.types'
import { LocationIndicator } from '../LocationIndicator'
import { LocationModal } from '../LocationModal'
import { LoginModal } from '../LoginModal'
import { RegisterModal } from '../RegisterModal'
import { useAuth } from '../../hooks/useAuth'
import { useLocation } from '../../contexts/LocationContext'

interface HeaderProps {
  currentPath?: string
}

export const Header = ({ currentPath = '/' }: HeaderProps) => {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()
  const { location } = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null)
  const [locationModalOpen, setLocationModalOpen] = useState(false)
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [registerModalOpen, setRegisterModalOpen] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null)
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(null)
  const navItemRefs = useRef<{ [key: string]: HTMLElement | null }>({})

  const handleLogoClick = () => {
    navigate('/')
    closeMobileMenu()
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
    setOpenMobileSubmenu(null)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    window.location.reload()
  }

  const getUserDisplayName = () => {
    if (!user) return ''
    // Extrair nome do email (antes do @) ou usar email completo
    const emailParts = user.email.split('@')
    return emailParts[0].charAt(0).toUpperCase() + emailParts[0].slice(1)
  }

  const handleDropdownEnter = (href: string, element: HTMLElement | null) => {
    // Limpar timeout se existir
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout)
      setDropdownTimeout(null)
    }
    
    if (element) {
      const rect = element.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left + rect.width / 2
      })
    }
    
    setOpenDropdown(href)
  }

  const handleDropdownLeave = () => {
    // Adicionar um pequeno delay antes de fechar para evitar fechamento prematuro
    const timeout = setTimeout(() => {
      setOpenDropdown(null)
      setDropdownPosition(null)
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
    { label: 'Minha Casa Minha Vida', href: '/minha-casa-minha-vida' },
    { label: 'Corretores', href: '/corretores' },
    { label: 'Imobiliárias', href: '/imobiliarias' },
  ]

  // Menu "Meu Perfil" separado para a direita
  const meuPerfilMenu = isAuthenticated ? {
    label: 'Meu Perfil',
    href: '/favoritos',
    submenu: [
      { label: 'Favoritos', href: '/favoritos' },
      { label: 'Minha Prop.', href: '/minha-propriedade' },
    ],
  } : null

  return (
    <>
      <StyledAppBar>
        <HeaderContainer maxWidth={false}>
          {/* Seção Esquerda - Logo */}
          <LeftSection>
            <LogoContainer onClick={handleLogoClick}>
              <ShootingStar />
              <img 
                src="/logo-dream.png" 
                alt="Dream Keys Logo" 
                className="logo-header"
                style={{ 
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
                  // Verificar href principal ou submenu
                  const isActive = currentPath === item.href || item.submenu.some(sub => currentPath === sub.href)
                  
                  return (
                    <NavLinkWithDropdown
                      key={item.href}
                      ref={(el) => (navItemRefs.current[item.href] = el)}
                      onMouseEnter={() => handleDropdownEnter(item.href, navItemRefs.current[item.href])}
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
                        $position={dropdownPosition}
                        onMouseEnter={() => handleDropdownEnter(item.href, navItemRefs.current[item.href])}
                        onMouseLeave={handleDropdownLeave}
                      >
                        {item.label === 'Meu Perfil' && user && (
                          <>
                            <Box
                              sx={{
                                px: 2,
                                py: 1.5,
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                                mb: 0.5,
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  color: 'text.primary',
                                  mb: 0.5,
                                }}
                              >
                                {getUserDisplayName()}
                              </Typography>
                              {location?.city && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <LocationOn fontSize="small" sx={{ color: 'text.secondary', fontSize: '0.875rem' }} />
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: 'text.secondary',
                                      fontSize: '0.75rem',
                                    }}
                                  >
                                    {location.city}, {location.state}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </>
                        )}
                        {item.submenu.map((subItem) => {
                          // Mapear sub-itens para filtros (Comprar/Alugar)
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
                
                // Usar McmvNavLink para o link Minha Casa Minha Vida
                const isMcmv = item.href === '/minha-casa-minha-vida'
                const LinkComponent = isMcmv ? McmvNavLink : NavLink
                
                // Se for MCMV e não estiver autenticado, abrir modal de login
                const handleMcmvClick = (e: React.MouseEvent) => {
                  if (isMcmv && !isAuthenticated) {
                    e.preventDefault()
                    closeMobileMenu()
                    setLoginModalOpen(true)
                  } else {
                    closeMobileMenu()
                  }
                }
                
                return (
                  <LinkComponent
                    key={item.href}
                    to={item.href}
                    className={currentPath === item.href ? 'active' : ''}
                    onClick={handleMcmvClick}
                  >
                    {item.label}
                  </LinkComponent>
                )
              })}
            </NavigationContainer>
          </CenterSection>

          {/* Seção Direita - Localização, Meu Perfil e Botão Entrar/Usuário */}
          <RightSection>
            {/* LocationIndicator - desktop e tablet quando não logado */}
            {!isAuthenticated && (
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <LocationIndicator />
              </Box>
            )}
            
            {/* Ícone de localização - apenas mobile (< 768px) quando não logado */}
            {!isAuthenticated && (
              <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                <MobileLocationIcon onClick={() => setLocationModalOpen(true)}>
                  <LocationOn />
                </MobileLocationIcon>
              </Box>
            )}
            
            {/* Menu "Meu Perfil" - desktop e tablet quando logado */}
            {isAuthenticated && meuPerfilMenu && (
              <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'relative' }}>
                <NavLinkWithDropdown
                  ref={(el) => {
                    if (meuPerfilMenu) {
                      navItemRefs.current[meuPerfilMenu.href] = el
                    }
                  }}
                  onMouseEnter={() => {
                    if (meuPerfilMenu) {
                      handleDropdownEnter(meuPerfilMenu.href, navItemRefs.current[meuPerfilMenu.href])
                    }
                  }}
                  onMouseLeave={handleDropdownLeave}
                  onClick={(e) => {
                    // Para tablets/dispositivos touch, toggle no click
                    if (window.innerWidth >= 768 && window.innerWidth < 1024) {
                      e.preventDefault()
                      if (meuPerfilMenu) {
                        if (openDropdown === meuPerfilMenu.href) {
                          setOpenDropdown(null)
                          setDropdownPosition(null)
                        } else {
                          handleDropdownEnter(meuPerfilMenu.href, navItemRefs.current[meuPerfilMenu.href])
                        }
                      }
                    }
                  }}
                >
                  <NavLink
                    to={meuPerfilMenu.href}
                    className={meuPerfilMenu.submenu?.some(sub => currentPath === sub.href) ? 'active' : ''}
                    onClick={(e) => {
                      e.preventDefault()
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}
                  >
                    {meuPerfilMenu.label}
                    <ChevronIcon className={openDropdown === meuPerfilMenu.href ? 'open' : ''}>
                      <KeyboardArrowDown fontSize="small" />
                    </ChevronIcon>
                  </NavLink>
                  <DropdownMenu 
                    $isOpen={openDropdown === meuPerfilMenu.href}
                    $position={dropdownPosition}
                    onMouseEnter={() => {
                      if (meuPerfilMenu) {
                        handleDropdownEnter(meuPerfilMenu.href, navItemRefs.current[meuPerfilMenu.href])
                      }
                    }}
                    onMouseLeave={handleDropdownLeave}
                    onClick={(e) => {
                      // Prevenir fechamento ao clicar dentro do dropdown em tablets
                      e.stopPropagation()
                    }}
                  >
                    {user && (
                      <>
                        <Box
                          sx={{
                            px: 2,
                            py: 1.5,
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            mb: 0.5,
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: 'text.primary',
                              mb: 0.5,
                            }}
                          >
                            {getUserDisplayName()}
                          </Typography>
                    {location?.city && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <LocationOn fontSize="small" sx={{ color: 'text.secondary', fontSize: '0.875rem' }} />
                              <Typography
                                variant="caption"
                                sx={{
                                  color: 'text.secondary',
                                  fontSize: '0.75rem',
                                }}
                              >
                        {location.city}, {location.state}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </>
                    )}
                    {meuPerfilMenu.submenu?.map((subItem) => (
                      <DropdownItem
                        key={subItem.href}
                        to={subItem.href}
                        onClick={(e) => {
                          e.preventDefault()
                          navigate(subItem.href)
                        }}
                      >
                        {subItem.label}
                      </DropdownItem>
                    ))}
                    <Box
                      sx={{
                        height: '1px',
                        backgroundColor: 'divider',
                        my: 0.5,
                        mx: 1,
                      }}
                    />
                    <Box
                      component="button"
                      onClick={(e) => {
                        e.preventDefault()
                        handleLogout()
                      }}
                      sx={{
                        width: '100%',
                        textAlign: 'left',
                        padding: 1,
                        borderRadius: 1,
                        border: 'none',
                        background: 'transparent',
                        color: 'text.primary',
                        fontWeight: 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        transition: 'all 0.2s',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.05)',
                          color: 'error.main',
                        },
                      }}
                    >
                    <Logout fontSize="small" />
                    Sair
                    </Box>
                  </DropdownMenu>
                </NavLinkWithDropdown>
              </Box>
            )}
            
            {/* Botão Entrar - desktop e tablet quando não logado */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
              {!isAuthenticated && (
                <StyledButton 
                  variant="contained" 
                  color="primary" 
                  startIcon={<LoginIcon />}
                  onClick={() => setLoginModalOpen(true)}
                >
                  Entrar
                </StyledButton>
              )}
            </Box>
            
            <MobileMenuToggle onClick={toggleMobileMenu}>
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </MobileMenuToggle>
          </RightSection>
        </HeaderContainer>

        {/* Menu Mobile */}
        <MobileMenu $isOpen={mobileMenuOpen}>
          {navItems.map((item) => {
            // Itens com submenu - criar menu expansível
            if (item.submenu && item.submenu.length > 0) {
              const isSubmenuOpen = openMobileSubmenu === item.href
              
              // Função para mapear sub-itens para filtros
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
              
              return (
                <Box key={item.href}>
                  <MobileMenuItem
                    $isOpen={isSubmenuOpen}
                    onClick={() => {
                      setOpenMobileSubmenu(isSubmenuOpen ? null : item.href)
                    }}
                  >
                    <span>{item.label}</span>
                    <ChevronIcon className={isSubmenuOpen ? 'open' : ''}>
                      <KeyboardArrowDown fontSize="small" />
                    </ChevronIcon>
                  </MobileMenuItem>
                  
                  {/* Submenu expandido */}
                  <MobileSubmenu $isOpen={isSubmenuOpen}>
                    {item.submenu.map((subItem) => {
                      const filterParams = getFilters(subItem.href)
                      const finalHref = filterParams ? `/?${filterParams}` : '/'
                      
                      return (
                        <MobileSubmenuItem
                          key={subItem.href}
                          to={finalHref}
                          className={currentPath === subItem.href ? 'active' : ''}
                          onClick={(e) => {
                            e.preventDefault()
                            closeMobileMenu()
                            navigate(finalHref)
                          }}
                        >
                          {subItem.label}
                        </MobileSubmenuItem>
                      )
                    })}
                  </MobileSubmenu>
                </Box>
              )
            }
            
            // Itens sem submenu aparecem normalmente
            // Usar MobileMcmvNavLink para o link Minha Casa Minha Vida
            const isMcmv = item.href === '/minha-casa-minha-vida'
            const LinkComponent = isMcmv ? MobileMcmvNavLink : MobileNavLink
            
            // Se for MCMV e não estiver autenticado, abrir modal de login
            const handleMcmvClick = (e: React.MouseEvent) => {
              if (isMcmv && !isAuthenticated) {
                e.preventDefault()
                closeMobileMenu()
                setLoginModalOpen(true)
              } else {
                closeMobileMenu()
              }
            }
            
            return (
              <LinkComponent
                key={item.href}
                to={item.href}
                className={currentPath === item.href ? 'active' : ''}
                onClick={handleMcmvClick}
              >
                {item.label}
              </LinkComponent>
            )
          })}
          
          {/* Menu "Meu Perfil" no mobile quando logado */}
          {isAuthenticated && meuPerfilMenu && (
            <MobileUserSection>
              <MobileMenuItem
                $isOpen={openMobileSubmenu === meuPerfilMenu.href}
                onClick={() => {
                  setOpenMobileSubmenu(openMobileSubmenu === meuPerfilMenu.href ? null : meuPerfilMenu.href)
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.25, flex: 1 }}>
                  <span>{meuPerfilMenu.label}</span>
                  {user && (
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#757575' }}>
                      {getUserDisplayName()}
                    </span>
                  )}
                </Box>
                <ChevronIcon className={openMobileSubmenu === meuPerfilMenu.href ? 'open' : ''}>
                  <KeyboardArrowDown fontSize="small" />
                </ChevronIcon>
              </MobileMenuItem>
              
              {/* Submenu expandido */}
              <MobileSubmenu $isOpen={openMobileSubmenu === meuPerfilMenu.href}>
                {user && location?.city && (
                  <MobileUserInfo>
                    <MobileUserLocation>
                      <LocationOn fontSize="small" />
                      <span>{location.city}, {location.state}</span>
                    </MobileUserLocation>
                  </MobileUserInfo>
                )}
                {meuPerfilMenu.submenu?.map((subItem) => (
                  <MobileSubmenuItem
                    key={subItem.href}
                    to={subItem.href}
                    className={currentPath === subItem.href ? 'active' : ''}
                    onClick={(e) => {
                      e.preventDefault()
                      closeMobileMenu()
                      navigate(subItem.href)
                    }}
                  >
                    {subItem.label}
                  </MobileSubmenuItem>
                ))}
                <MobileLogoutButton
                  onClick={(e) => {
                    e.preventDefault()
                    closeMobileMenu()
                    handleLogout()
                  }}
                >
                  <Logout fontSize="small" />
                  Sair
                </MobileLogoutButton>
              </MobileSubmenu>
            </MobileUserSection>
          )}
          
          {/* Botão Entrar no mobile quando não logado */}
          {!isAuthenticated && (
            <MobileLoginButton
              onClick={() => {
                closeMobileMenu()
                setLoginModalOpen(true)
              }}
            >
              <LoginIcon />
              Entrar
            </MobileLoginButton>
          )}
        </MobileMenu>
      </StyledAppBar>

      <Overlay $isOpen={mobileMenuOpen} onClick={closeMobileMenu} />
      <LocationModal open={locationModalOpen} onClose={() => setLocationModalOpen(false)} />
      <LoginModal 
        open={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)} 
        onRegisterClick={() => {
          setLoginModalOpen(false)
          setRegisterModalOpen(true)
        }}
        onLoginSuccess={() => {
          // Recarregar página para atualizar estado de autenticação
          window.location.reload()
        }}
      />
      <RegisterModal 
        open={registerModalOpen} 
        onClose={() => setRegisterModalOpen(false)}
        onLoginClick={() => {
          setRegisterModalOpen(false)
          setLoginModalOpen(true)
        }}
      />
    </>
  )
}

