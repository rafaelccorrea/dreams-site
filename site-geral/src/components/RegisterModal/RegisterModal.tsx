import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  Typography,
  IconButton,
  InputAdornment,
  Alert,
  Snackbar,
} from '@mui/material'
import {
  Close,
  Email,
  Lock,
  Phone,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material'
import {
  LoginModalContainer,
  LoginModalHeader,
  LoginForm,
  LoginButton,
  RegisterButton,
  LogoContainer,
  StyledTextField,
  StyledDivider,
} from '../LoginModal/LoginModal.styles'
import { useAuth } from '../../hooks/useAuth'
import { formatPhone, formatEmail, isValidEmail, isValidPhone } from '../../utils/masks'

interface RegisterModalProps {
  open: boolean
  onClose: () => void
  onLoginClick?: () => void
}

export const RegisterModal = ({ open, onClose, onLoginClick }: RegisterModalProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { register } = useAuth()

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value)
    setPhone(formatted)
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

    // Validações
    if (!isValidEmail(email)) {
      setErrorMessage('Digite um email válido')
      setLoading(false)
      return
    }

    if (password.length < 8) {
      setErrorMessage('A senha deve ter no mínimo 8 caracteres')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem')
      setLoading(false)
      return
    }

    if (!isValidPhone(phone)) {
      setErrorMessage('Digite um telefone válido (10 ou 11 dígitos)')
      setLoading(false)
      return
    }

    try {
      const result = await register(email, password, phone)
      setSuccessMessage(
        `Email de confirmação enviado! Verifique sua caixa de entrada. O link expira em ${result.expirationHours} horas.`
      )
      // Limpar formulário após sucesso
      setTimeout(() => {
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        setPhone('')
        setSuccessMessage(null)
        onClose()
      }, 5000)
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Erro ao registrar usuário'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleLoginClick = () => {
    onClose()
    if (onLoginClick) {
      onLoginClick()
    }
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
            borderRadius: { xs: 3, sm: 4 },
            maxHeight: { xs: '95vh', sm: '90vh' },
            margin: { xs: '16px', sm: 'auto' },
            width: { xs: 'calc(100% - 32px)', sm: '100%' },
            maxWidth: { xs: 'calc(100% - 32px)', sm: '520px' },
            boxShadow: { xs: '0 8px 32px rgba(0, 0, 0, 0.2)', sm: '0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 24px rgba(0, 0, 0, 0.1)' },
            overflow: 'hidden',
          },
        }}
        sx={{
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: { xs: 'blur(4px)', sm: 'blur(8px)' },
          },
          '& .MuiDialog-container': {
            alignItems: { xs: 'center', sm: 'center' },
            padding: { xs: '16px', sm: '24px' },
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
            <Typography 
              variant="h5" 
              fontWeight={700} 
              color="primary"
              sx={{
                fontSize: { xs: '1.25rem', sm: '1.75rem' },
              }}
            >
              Criar conta
            </Typography>
            <IconButton
              onClick={onClose}
              sx={{
                color: 'text.secondary',
                transition: 'all 0.2s ease',
                padding: { xs: '8px', sm: '12px' },
                '&:hover': { 
                  backgroundColor: 'rgba(0, 0, 0, 0.06)',
                  transform: { xs: 'none', sm: 'rotate(90deg)' },
                },
              }}
            >
              <Close sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
            </IconButton>
          </LoginModalHeader>

          <DialogContent sx={{ p: 0, overflow: 'visible' }}>
            <LoginForm onSubmit={handleSubmit}>
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
                label="Telefone"
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="(11) 98765-4321"
                required
                error={phone !== '' && !isValidPhone(phone)}
                helperText={phone !== '' && !isValidPhone(phone) ? 'Telefone inválido (10 ou 11 dígitos)' : ''}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone sx={{ color: 'text.secondary' }} />
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
                inputProps={{ minLength: 8 }}
                helperText="Mínimo de 8 caracteres"
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

              <StyledTextField
                fullWidth
                label="Confirmar senha"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        sx={{
                          color: 'text.secondary',
                          '&:hover': {
                            color: 'primary.main',
                          },
                        }}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <LoginButton
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                size="large"
              >
                {loading ? 'Criando conta...' : 'Criar conta'}
              </LoginButton>

              <StyledDivider>
                <Typography variant="body2" component="span">
                  ou
                </Typography>
              </StyledDivider>

              <RegisterButton
                variant="outlined"
                fullWidth
                onClick={handleLoginClick}
                size="large"
              >
                Já tenho uma conta
              </RegisterButton>
            </LoginForm>
          </DialogContent>
        </LoginModalContainer>
      </Dialog>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
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

