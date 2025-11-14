import { useEffect, useState } from 'react'
import { useLocation } from '../../contexts/LocationContext'
import { LocationModal } from '../LocationModal'
import { Box, Typography } from '@mui/material'

interface LocationProtectedRouteProps {
  children: React.ReactNode
}

export const LocationProtectedRoute = ({ children }: LocationProtectedRouteProps) => {
  const { hasLocation, isLocationConfirmed, location } = useLocation()
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    // Se não tem localização confirmada, mostrar modal
    if (!hasLocation || !isLocationConfirmed || !location?.city) {
      setShowModal(true)
    } else {
      setShowModal(false)
    }
  }, [hasLocation, isLocationConfirmed, location])

  const handleModalClose = () => {
    // Só permite fechar se tiver localização confirmada
    if (hasLocation && isLocationConfirmed && location?.city) {
      setShowModal(false)
    }
  }

  // Se não tem localização, mostrar modal e bloquear acesso
  if (!hasLocation || !isLocationConfirmed || !location?.city) {
    return (
      <>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh',
            gap: 2,
            p: 3,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            Localização Necessária
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', maxWidth: 500 }}>
            Para navegar pelo site, é necessário selecionar uma cidade.
          </Typography>
        </Box>
        <LocationModal 
          open={showModal} 
          onClose={handleModalClose}
          forceOpen={true}
        />
      </>
    )
  }

  // Se tem localização, permitir acesso
  return <>{children}</>
}

