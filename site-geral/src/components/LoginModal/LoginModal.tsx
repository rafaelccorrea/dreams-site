import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  Button,
  Typography,
  Box,
  IconButton,
  InputAdornment,
  Alert,
  Snackbar,
} from '@mui/material'
import {
  Close,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material'
import {
  LoginModalContainer,
  LoginModalHeader,
  LoginForm,
  LoginButton,
  RegisterButton,
  ForgotPasswordLink,
  LogoContainer,
  GoogleButton,
  StyledTextField,
  StyledDivider,
} from './LoginModal.styles'
import { useGoogleAuth } from '../../hooks/useGoogleAuth'
import { GoogleUser } from '../../services/authService'

interface LoginModalProps {
  open: boolean
  onClose: () => void
}

export const LoginModal = ({ open, onClose }: LoginModalProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleGoogleLoginSuccess = (user: GoogleUser) => {
    console.log('Login com Google realizado:', user)
    setSuccessMessage(`Bem-vindo, ${user.name}!`)
    
    // TODO: Enviar dados do usuário para o backend
    // Aqui você pode fazer uma chamada à API para salvar/criar o usuário
    
    setTimeout(() => {
      onClose()
      setSuccessMessage(null)
    }, 1500)
  }

  const handleGoogleLoginError = (error: Error) => {
    console.error('Erro no login com Google:', error)
    setErrorMessage('Erro ao fazer login com Google. Tente novamente.')
  }

  const { login: googleLogin, isLoading: googleLoading, isReady: googleReady } = useGoogleAuth(
    handleGoogleLoginSuccess,
    handleGoogleLoginError
  )

  const handleGoogleLogin = async () => {
    if (!googleReady) {
      setErrorMessage('Aguarde o Google carregar...')
      return
    }
    await googleLogin()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)
    
    // TODO: Implementar lógica de login com email/senha
    console.log('Login:', { email, password })
    
    setTimeout(() => {
      setLoading(false)
      // onClose() // Descomentar quando login for implementado
    }, 1000)
  }

  const handleRegister = () => {
    // TODO: Implementar navegação para página de cadastro
    console.log('Cadastrar')
    onClose()
  }

  const handleForgotPassword = () => {
    // TODO: Implementar recuperação de senha
    console.log('Esqueceu senha')
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: { xs: 0, sm: 4 },
            maxHeight: { xs: '100vh', sm: '90vh' },
            margin: { xs: 0, sm: 'auto' },
            width: { xs: '100%', sm: '100%' },
            maxWidth: { xs: '100%', sm: '520px' },
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 24px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
          },
        }}
        sx={{
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
          },
        }}
      >
        <LoginModalContainer>
          <LogoContainer>
            <img 
              src="/logo-dream.png" 
              alt="Dream Keys Logo" 
              style={{ 
                height: '120px',
                width: 'auto',
                maxWidth: '100%',
                objectFit: 'contain',
              }} 
            />
          </LogoContainer>

          <LoginModalHeader>
            <Typography variant="h5" fontWeight={700} color="primary">
              Bem-vindo de volta
            </Typography>
            <IconButton
              onClick={onClose}
              sx={{
                color: 'text.secondary',
                transition: 'all 0.2s ease',
                '&:hover': { 
                  backgroundColor: 'rgba(0, 0, 0, 0.06)',
                  transform: 'rotate(90deg)',
                },
              }}
            >
              <Close />
            </IconButton>
          </LoginModalHeader>

          <DialogContent sx={{ p: 0, overflow: 'visible' }}>
            <LoginForm onSubmit={handleSubmit}>
              <GoogleButton
                variant="outlined"
                fullWidth
                onClick={handleGoogleLogin}
                disabled={googleLoading || !googleReady}
                size="large"
                startIcon={
                  <Box
                    component="svg"
                    sx={{ width: 20, height: 20 }}
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </Box>
                }
              >
                {googleLoading ? 'Conectando...' : googleReady ? 'Continuar com Google' : 'Carregando...'}
              </GoogleButton>

              <StyledDivider>
                <Typography variant="body2" component="span">
                  ou
                </Typography>
              </StyledDivider>

              <StyledTextField
                fullWidth
                label="E-mail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />

              <StyledTextField
                fullWidth
                label="Senha"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{
                          color: 'text.secondary',
                          '&:hover': {
                            color: 'primary.main',
                          },
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                <ForgotPasswordLink onClick={handleForgotPassword}>
                  Esqueceu sua senha?
                </ForgotPasswordLink>
              </Box>

              <LoginButton
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                size="large"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </LoginButton>

              <StyledDivider>
                <Typography variant="body2" component="span">
                  ou
                </Typography>
              </StyledDivider>

              <RegisterButton
                variant="outlined"
                fullWidth
                onClick={handleRegister}
                size="large"
              >
                Criar conta
              </RegisterButton>
            </LoginForm>
          </DialogContent>
        </LoginModalContainer>
      </Dialog>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={4000}
        onClose={() => setErrorMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setErrorMessage(null)}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  )
}
