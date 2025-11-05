import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Box, Typography, CircularProgress, Alert, Button } from '@mui/material'
import { CheckCircle, Error as ErrorIcon } from '@mui/icons-material'
import { useAuth } from '../../hooks/useAuth'
import { MainContentWrapper } from '../../components/MainContentWrapper'
import { LoginModal } from '../../components/LoginModal'

export const ConfirmEmailPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { confirmEmail } = useAuth()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [loginModalOpen, setLoginModalOpen] = useState(false)

  useEffect(() => {
    const token = searchParams.get('token')
    console.log('ConfirmEmailPage montado, token:', token ? token.substring(0, 20) + '...' : 'não encontrado')

    if (!token) {
      setStatus('error')
      setMessage('Token de confirmação não encontrado na URL')
      return
    }

    let isMounted = true

    const handleConfirm = async () => {
      try {
        console.log('Confirmando email com token:', token.substring(0, 20) + '...')
        const result = await confirmEmail(token)
        console.log('Email confirmado com sucesso:', result)
        
        if (!isMounted) return
        
        setStatus('success')
        setMessage(result.message || 'Email confirmado com sucesso!')
        setUserEmail(result.email || '')
        
        // Abrir modal de login automaticamente após 1 segundo
        setTimeout(() => {
          if (isMounted) {
            setLoginModalOpen(true)
          }
        }, 1000)
      } catch (error) {
        console.error('Erro ao confirmar email:', error)
        if (!isMounted) return
        
        setStatus('error')
        const errorMessage = error instanceof Error ? error.message : 'Erro ao confirmar email. Tente novamente mais tarde.'
        setMessage(errorMessage)
      }
    }

    handleConfirm()

    return () => {
      isMounted = false
    }
  }, [searchParams, confirmEmail])

  const handleLoginSuccess = () => {
    setLoginModalOpen(false)
    // Disparar evento para atualizar Header e outros componentes
    window.dispatchEvent(new CustomEvent('auth-change'))
    // Redirecionar para área logada
    setTimeout(() => {
      navigate('/favorites')
      // Recarregar para atualizar estado de autenticação em toda a aplicação
      window.location.reload()
    }, 500)
  }

  const handleLoginClick = () => {
    setLoginModalOpen(true)
  }

  return (
    <>
      <MainContentWrapper $showBackground={false}>
        <Box
          sx={{
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: { xs: 3, sm: 4 },
            maxWidth: '600px',
            margin: '0 auto',
            position: 'relative',
            zIndex: 10,
          }}
        >
          {status === 'loading' && (
            <>
              <CircularProgress size={60} sx={{ mb: 3 }} />
              <Typography variant="h5" gutterBottom>
                Confirmando seu email...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Aguarde enquanto processamos sua confirmação
              </Typography>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle
                sx={{
                  fontSize: 80,
                  color: 'success.main',
                  mb: 3,
                }}
              />
              <Typography variant="h4" gutterBottom fontWeight={700}>
                Email Confirmado!
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
                {message}
              </Typography>
              <Alert severity="success" sx={{ mb: 3, width: '100%' }}>
                Sua conta está ativa! Faça login para continuar.
              </Alert>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  onClick={handleLoginClick}
                  size="large"
                >
                  Fazer Login
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/')}
                  size="large"
                >
                  Voltar para Home
                </Button>
              </Box>
            </>
          )}

          {status === 'error' && (
            <>
              <ErrorIcon
                sx={{
                  fontSize: 80,
                  color: 'error.main',
                  mb: 3,
                }}
              />
              <Typography variant="h4" gutterBottom fontWeight={700}>
                Erro ao Confirmar
              </Typography>
              <Alert severity="error" sx={{ mb: 3, width: '100%' }}>
                {message}
              </Alert>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/')}
                >
                  Voltar para Home
                </Button>
                <Button
                  variant="contained"
                  onClick={handleLoginClick}
                >
                  Ir para Login
                </Button>
              </Box>
            </>
          )}
        </Box>
      </MainContentWrapper>

      {/* Modal de Login com email pré-preenchido */}
      {userEmail && (
        <LoginModal
          open={loginModalOpen}
          onClose={() => {
            setLoginModalOpen(false)
            // Se fechar o modal, redirecionar para home
            navigate('/')
          }}
          onLoginSuccess={handleLoginSuccess}
          prefillEmail={userEmail}
        />
      )}
    </>
  )
}
