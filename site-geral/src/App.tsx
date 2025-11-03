import { useEffect, useState } from 'react'
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { muiTheme } from './theme/muiTheme'
import { styledTheme } from './theme/styledTheme'
import { GlobalStyle } from './styles/global'
import { Header } from './components/Header'
import { HomePage } from './pages/HomePage'
import { LocationProvider, useLocation } from './contexts/LocationContext'
import { LocationModal } from './components/LocationModal'
import { MainContentWrapper } from './components/MainContentWrapper'

function AppContent() {
  const { location, hasLocation } = useLocation()
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    // Mostrar modal na primeira visita se não houver localização
    if (!hasLocation) {
      setShowModal(true)
    }
  }, [hasLocation])

  const handleModalClose = () => {
    // Só fecha se houver uma localização definida
    if (hasLocation) {
      setShowModal(false)
    }
  }

  return (
    <>
      <Header />
      <MainContentWrapper>
        <HomePage />
      </MainContentWrapper>
      <LocationModal open={showModal} onClose={handleModalClose} />
    </>
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
