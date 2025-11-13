import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { LoginModal } from '../LoginModal'
import { RegisterModal } from '../RegisterModal'
import { Box, Typography, CircularProgress } from '@mui/material'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth()
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [registerModalOpen, setRegisterModalOpen] = useState(false)

  useEffect(() => {
    // Se não estiver autenticado e já terminou de verificar, mostrar modal de login
    if (!loading && !isAuthenticated) {
      setLoginModalOpen(true)
    } else if (isAuthenticated) {
      setLoginModalOpen(false)
    }
  }, [isAuthenticated, loading])

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Verificando autenticação...
        </Typography>
      </Box>
    )
  }

  // Se não estiver autenticado, mostrar modal de login
  if (!isAuthenticated) {
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
            Login Necessário
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', maxWidth: 500 }}>
            Para acessar o programa Minha Casa Minha Vida, é necessário realizar o login.
          </Typography>
        </Box>
        <LoginModal
          open={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          onRegisterClick={() => {
            setLoginModalOpen(false)
            setRegisterModalOpen(true)
          }}
          onLoginSuccess={() => {
            setLoginModalOpen(false)
            // Recarregar página para atualizar estado
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

  // Se estiver autenticado, mostrar o conteúdo protegido
  return <>{children}</>
}

