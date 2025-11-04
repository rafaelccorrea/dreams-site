import { useEffect, useState } from 'react'
import { Routes, Route, useLocation as useRouterLocation } from 'react-router-dom'
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
import { LocationProvider, useLocation } from './contexts/LocationContext'
import { LocationModal } from './components/LocationModal'
import { MainContentWrapper } from './components/MainContentWrapper'
import { Box } from '@mui/material'

function AppContent() {
  const { hasLocation, isLocationConfirmed } = useLocation()
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
    // Sempre permite fechar quando chamado explicitamente
    // O modal só é fechado via onClose quando o usuário confirma uma localização
    setShowModal(false)
  }

  const routerLocation = useRouterLocation()

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
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route 
            path="/corretores" 
            element={
              <MainContentWrapper $showBackground={false}>
                <BrokersPage />
              </MainContentWrapper>
            } 
          />
          <Route path="/broker/:id" element={<BrokerDetails />} />
          <Route 
            path="/imobiliarias" 
            element={
              <MainContentWrapper $showBackground={false}>
                <CompaniesPage />
              </MainContentWrapper>
            } 
          />
          <Route path="/company/:id" element={<CompanyDetails />} />
          <Route 
            path="/lancamentos" 
            element={
              <MainContentWrapper $showBackground={false}>
                <LancamentosPage />
              </MainContentWrapper>
            } 
          />
        </Routes>
      </Box>
      <Footer />
      <LocationModal open={showModal} onClose={handleModalClose} />
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
