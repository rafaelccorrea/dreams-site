import { useEffect, useState } from 'react'
import { Routes, Route, useLocation as useRouterLocation, Navigate, useParams } from 'react-router-dom'
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { muiTheme } from './theme/muiTheme'
import { styledTheme } from './theme/styledTheme'
import { GlobalStyle } from './styles/global'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { HomePage } from './pages/HomePage'
import { PropertyDetails } from './pages/PropertyDetails'
import { BrokersPage } from './pages/BrokersPage'
import { CompaniesPage } from './pages/CompaniesPage'
import { CompanyDetails } from './pages/CompanyDetails'
import { BrokerDetails } from './pages/BrokerDetails'
import { LancamentosPage } from './pages/LancamentosPage'
import { ConfirmEmailPage } from './pages/ConfirmEmailPage'
import { FavoritesPage } from './pages/FavoritesPage'
import { MyPropertyPage } from './pages/MyPropertyPage'
import { McmvPage } from './pages/McmvPage'
import { LocalSearchPage } from './pages/LocalSearchPage'
import { LocationProvider, useLocation } from './contexts/LocationContext'
import { LocationModal } from './components/LocationModal'
import { MainContentWrapper } from './components/MainContentWrapper'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LocationProtectedRoute } from './components/LocationProtectedRoute'
import { usePageTitle } from './hooks/usePageTitle'
import { Box } from '@mui/material'

// Componente para redirecionar rotas com parâmetros
const RedirectToRoute = ({ template, paramKey }: { template: string; paramKey: string }) => {
  const params = useParams<{ [key: string]: string }>()
  const paramValue = params[paramKey]
  
  if (!paramValue) {
    return <Navigate to="/" replace />
  }
  
  const newPath = template.replace(`:${paramKey}`, paramValue)
  
  return <Navigate to={newPath} replace />
}

// Componente para redirecionar para URL externa
const RedirectToExternal = ({ url }: { url: string }) => {
  useEffect(() => {
    window.location.href = url
  }, [url])
  
  return null
}

function AppContent() {
  const { hasLocation, isLocationConfirmed } = useLocation()
  const routerLocation = useRouterLocation()
  
  // Atualizar título da página dinamicamente
  usePageTitle()
  
  // Verificar localStorage diretamente antes de renderizar para evitar flash
  const [showModal, setShowModal] = useState(() => {
    // Verificar se já existe localização salva no localStorage
    const savedLocation = localStorage.getItem('user_location')
    // Se já tem localização salva, não mostrar modal
    return !savedLocation
  })

  // Verificar se deve mostrar o modal apenas na primeira visita sem localização
  useEffect(() => {
    // Se já tem localização confirmada (salva anteriormente), não mostrar modal
    if (isLocationConfirmed) {
      setShowModal(false)
      return
    }

    // Se não tem localização e ainda não foi confirmada, mostrar modal
    // Mas só mostrar se realmente não houver localização salva
    if (!hasLocation && !isLocationConfirmed) {
      const savedLocation = localStorage.getItem('user_location')
      if (!savedLocation) {
        setShowModal(true)
      }
    }
  }, [hasLocation, isLocationConfirmed])

  // Fechar modal automaticamente quando localização for selecionada
  useEffect(() => {
    if (hasLocation && showModal) {
      setShowModal(false)
    }
  }, [hasLocation, showModal])

  const handleModalClose = () => {
    // Só permite fechar se tiver localização confirmada
    if (hasLocation && isLocationConfirmed) {
      setShowModal(false)
    }
  }

  // Scroll automático ao topo quando mudar de rota
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  }, [routerLocation.pathname])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
      <Header currentPath={routerLocation.pathname} />
      <Box sx={{ flex: 1, width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
        <Routes>
          <Route
            path="/"
            element={
              <MainContentWrapper $showBackground={true}>
                <HomePage />
              </MainContentWrapper>
            }
          />
          {/* Rotas principais com URLs descritivas */}
          <Route 
            path="/imovel/:id" 
            element={
              <LocationProtectedRoute>
                <PropertyDetails />
              </LocationProtectedRoute>
            } 
          />
          <Route 
            path="/corretores" 
            element={
              <LocationProtectedRoute>
                <MainContentWrapper $showBackground={false} style={{ paddingTop: '50px' }}>
                  <BrokersPage />
                </MainContentWrapper>
              </LocationProtectedRoute>
            } 
          />
          <Route 
            path="/corretor/:id" 
            element={
              <LocationProtectedRoute>
                <BrokerDetails />
              </LocationProtectedRoute>
            } 
          />
          <Route 
            path="/imobiliarias" 
            element={
              <LocationProtectedRoute>
                <MainContentWrapper $showBackground={false}>
                  <CompaniesPage />
                </MainContentWrapper>
              </LocationProtectedRoute>
            } 
          />
          <Route 
            path="/imobiliaria/:id" 
            element={
              <LocationProtectedRoute>
                <CompanyDetails />
              </LocationProtectedRoute>
            } 
          />
          <Route 
            path="/lancamentos" 
            element={
              <LocationProtectedRoute>
                <MainContentWrapper $showBackground={false}>
                  <LancamentosPage />
                </MainContentWrapper>
              </LocationProtectedRoute>
            } 
          />
          <Route 
            path="/confirm-email" 
            element={<ConfirmEmailPage />} 
          />
          <Route 
            path="/confirmar-email" 
            element={<ConfirmEmailPage />} 
          />
          <Route 
            path="/favoritos" 
            element={
              <LocationProtectedRoute>
                <MainContentWrapper $showBackground={false} style={{ paddingTop: '50px' }}>
                  <FavoritesPage />
                </MainContentWrapper>
              </LocationProtectedRoute>
            } 
          />
          <Route 
            path="/minha-propriedade" 
            element={
              <LocationProtectedRoute>
                <MainContentWrapper $showBackground={false} style={{ paddingTop: '50px' }}>
                  <MyPropertyPage />
                </MainContentWrapper>
              </LocationProtectedRoute>
            } 
          />
          <Route 
            path="/minha-casa-minha-vida" 
            element={
              <ProtectedRoute>
                <MainContentWrapper $showBackground={false} style={{ paddingTop: '50px' }}>
                  <McmvPage />
                </MainContentWrapper>
              </ProtectedRoute>
            } 
          />
          {/* Rotas de redirecionamento para manter compatibilidade com URLs antigas */}
          <Route 
            path="/property/:id" 
            element={<RedirectToRoute template="/imovel/:id" paramKey="id" />} 
          />
          <Route 
            path="/broker/:id" 
            element={<RedirectToRoute template="/corretor/:id" paramKey="id" />} 
          />
          <Route 
            path="/company/:id" 
            element={<RedirectToRoute template="/imobiliaria/:id" paramKey="id" />} 
          />
          <Route path="/favorites" element={<Navigate to="/favoritos" replace />} />
          <Route path="/mcmv" element={<Navigate to="/minha-casa-minha-vida" replace />} />
          
          {/* Redirecionamentos para SEO genérico */}
          <Route path="/sobre-imobiliarias" element={<Navigate to="/imobiliarias" replace />} />
          <Route path="/sobre-corretores" element={<Navigate to="/corretores" replace />} />
          <Route 
            path="/sistema-imobiliario" 
            element={<RedirectToExternal url="https://www.dreamkeys.com.br/sistema/" />} 
          />
          <Route 
            path="/sistema" 
            element={<RedirectToExternal url="https://www.dreamkeys.com.br/sistema/" />} 
          />
          
          {/* Rotas dinâmicas para SEO local */}
          {/* Formato: /casas-a-venda-em-marilia, /apartamentos-para-alugar-em-sao-paulo, etc. */}
          <Route 
            path="/:typeSlug-:operationSlug-em-:citySlug" 
            element={
              <MainContentWrapper $showBackground={false}>
                <LocalSearchPage />
              </MainContentWrapper>
            } 
          />
          {/* Formato alternativo: /casas-em-marilia, /apartamentos-em-sao-paulo */}
          <Route 
            path="/:typeSlug-em-:citySlug" 
            element={
              <MainContentWrapper $showBackground={false}>
                <LocalSearchPage />
              </MainContentWrapper>
            } 
          />
          {/* Formato: /imoveis-em-marilia */}
          <Route 
            path="/imoveis-em-:citySlug" 
            element={
              <MainContentWrapper $showBackground={false}>
                <LocalSearchPage />
              </MainContentWrapper>
            } 
          />
          
          {/* Rota catch-all: redireciona qualquer rota inexistente para a home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
      <Footer />
      <LocationModal 
        open={showModal} 
        onClose={handleModalClose}
        forceOpen={!hasLocation || !isLocationConfirmed}
      />
    </Box>
  )
}

function App() {
  return (
    <MuiThemeProvider theme={muiTheme}>
      <StyledThemeProvider theme={styledTheme}>
        <CssBaseline />
        <GlobalStyle />
        <LocationProvider>
          <AppContent />
        </LocationProvider>
      </StyledThemeProvider>
    </MuiThemeProvider>
  )
}

export default App
