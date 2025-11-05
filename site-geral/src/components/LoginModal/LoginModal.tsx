import { useState, useEffect } from 'react'
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
import { useAuth } from '../../hooks/useAuth'
import { GoogleUser } from '../../services/authService'
import { formatEmail, isValidEmail } from '../../utils/masks'

interface LoginModalProps {
  open: boolean
  onClose: () => void
  onRegisterClick?: () => void
  onLoginSuccess?: () => void
  prefillEmail?: string
}

export const LoginModal = ({ 
  open, 
  onClose, 
  onRegisterClick,
  onLoginSuccess,
  prefillEmail 
}: LoginModalProps) => {
  const [email, setEmail] = useState(prefillEmail || '')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { login } = useAuth()

  // Atualizar email quando prefillEmail mudar
  useEffect(() => {
    if (prefillEmail) {
      setEmail(prefillEmail)
    }
  }, [prefillEmail])

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

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatEmail(e.target.value)
    setEmail(formatted)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    // Validação de email
    if (!isValidEmail(email)) {
      setErrorMessage('Digite um email válido')
      setLoading(false)
      return
    }
    
    try {
      await login(email, password)
      setSuccessMessage('Login realizado com sucesso!')
      
      // Disparar evento para atualizar componentes que usam useAuth
      window.dispatchEvent(new CustomEvent('auth-change'))
      
      setTimeout(() => {
        onClose()
        setSuccessMessage(null)
        
        // Se tiver callback de sucesso, chamar
        if (onLoginSuccess) {
          onLoginSuccess()
        } else {
          // Senão, recarregar a página para atualizar estado de autenticação
          window.location.reload()
        }
      }, 1500)
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Erro ao fazer login'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = () => {
    onClose()
    if (onRegisterClick) {
      onRegisterClick()
    }
  }

  const handleForgotPassword = () => {
    // TODO: Implementar recuperação de senha
    console.log('Esqueceu senha')
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={(event, reason) => {
          // Só fechar se clicar no backdrop ou pressionar ESC
          if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            onClose()
          }
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: { xs: 2, sm: 4 },
            maxHeight: { xs: '100vh', sm: '90vh' },
            margin: { xs: '8px', sm: 'auto' },
            width: { xs: 'calc(100% - 16px)', sm: '100%' },
            maxWidth: { xs: 'calc(100% - 16px)', sm: '520px' },
            boxShadow: { xs: '0 8px 32px rgba(0, 0, 0, 0.2)', sm: '0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 24px rgba(0, 0, 0, 0.1)' },
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          },
          onClick: (e) => {
            // Prevenir propagação do clique dentro do Paper
            e.stopPropagation()
          },
          onMouseDown: (e) => {
            // Prevenir propagação do mousedown dentro do Paper
            e.stopPropagation()
          },
        }}
        sx={{
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: { xs: 'blur(4px)', sm: 'blur(8px)' },
          },
          '& .MuiDialog-container': {
            alignItems: { xs: 'flex-start', sm: 'center' },
            padding: { xs: '8px', sm: '24px' },
          },
          '& .MuiDialog-paper': {
            margin: { xs: '8px', sm: '24px' },
          },
        }}
      >
        <LoginModalContainer
          onClick={(e) => {
            // Prevenir propagação do clique dentro do container
            e.stopPropagation()
          }}
          onMouseDown={(e) => {
            // Prevenir propagação do mousedown dentro do container
            e.stopPropagation()
          }}
        >
          <LogoContainer>
            <img 
              src="/logo-dream.png" 
              alt="Dream Keys Logo" 
              style={{ 
                height: '100px',
                width: 'auto',
                maxWidth: '100%',
                objectFit: 'contain',
              }} 
            />
          </LogoContainer>

          <LoginModalHeader>
            <Typography 
              variant="h5" 
              fontWeight={700} 
              color="primary"
              sx={{
                fontSize: { xs: '1.125rem', sm: '1.5rem' },
                lineHeight: { xs: '1.3', sm: '1.4' },
              }}
            >
              Que bom te ver novamente!
            </Typography>
            <IconButton
              onClick={onClose}
              sx={{
                color: 'text.secondary',
                transition: 'all 0.2s ease',
                padding: { xs: '6px', sm: '10px' },
                minWidth: { xs: '32px', sm: '40px' },
                width: { xs: '32px', sm: '40px' },
                height: { xs: '32px', sm: '40px' },
                '&:hover': { 
                  backgroundColor: 'rgba(0, 0, 0, 0.06)',
                  transform: { xs: 'none', sm: 'rotate(90deg)' },
                },
              }}
            >
              <Close sx={{ fontSize: { xs: '1.125rem', sm: '1.375rem' } }} />
            </IconButton>
          </LoginModalHeader>

          <DialogContent sx={{ p: 0, overflow: 'visible', '&.MuiDialogContent-root': { paddingTop: 0 } }}>
            <LoginForm onSubmit={handleSubmit}>
              {/* Botão de login com Google temporariamente oculto */}
              {/* <GoogleButton
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
              </StyledDivider> */}

              <StyledTextField
                fullWidth
                label="E-mail"
                type="email"
                value={email}
                onChange={handleEmailChange}
                required
                error={email !== '' && !isValidEmail(email)}
                helperText={email !== '' && !isValidEmail(email) ? 'Email inválido' : ''}
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

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: { xs: 0, sm: 0.5 }, mt: { xs: -0.5, sm: 0 } }}>
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
                sx={{
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderColor: '#667eea',
                    '& .MuiButton-label': {
                      color: '#ffffff !important',
                    },
                    '& span': {
                      color: '#ffffff !important',
                    },
                    '& *': {
                      color: '#ffffff !important',
                    },
                    color: '#ffffff !important',
                  },
                }}
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
