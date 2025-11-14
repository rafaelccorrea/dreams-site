import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Autocomplete,
  Alert,
} from '@mui/material'
import { LocationOn } from '@mui/icons-material'
import styled, { keyframes } from 'styled-components'
import { useLocation } from '../../contexts/LocationContext'
import { getStates, getCitiesByState, BrazilianState, City } from '../../services/locationService'

const slideInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
`

const StyledDialog = styled(Dialog)<{ $open: boolean }>`
  .MuiDialog-paper {
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    padding: 0;
    overflow: hidden;
    background: transparent;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: ${({ $open }) => ($open ? slideInUp : 'none')} 0.4s ease-out;
    max-width: 500px;
    width: 90%;
  }

  .MuiBackdrop-root {
    backdrop-filter: blur(8px);
    background: rgba(0, 0, 0, 0.5);
    animation: ${fadeIn} 0.3s ease-out;
  }
`

const DialogPaperContent = styled.div`
  position: relative;
  backdrop-filter: blur(30px) saturate(200%) brightness(1.1);
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.98) 0%,
    rgba(255, 255, 255, 0.95) 100%
  );
  border: 2px solid rgba(255, 255, 255, 0.5);
  overflow: hidden;
  z-index: 0;

  /* Filtros modernos - gradiente sutil */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(51, 112, 166, 0.08) 0%,
      rgba(255, 255, 255, 0.15) 50%,
      rgba(51, 112, 166, 0.08) 100%
    );
    z-index: 0;
    pointer-events: none;
  }

  /* Efeito de brilho */
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(51, 112, 166, 0.1) 0%,
      transparent 70%
    );
    animation: ${pulse} 4s ease-in-out infinite;
    z-index: 0;
    pointer-events: none;
  }

  > * {
    position: relative;
    z-index: 1;
  }
`

const DialogHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.xl};
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  animation: ${fadeIn} 0.5s ease-out;
  animation-delay: 0.1s;
  opacity: 0;
  animation-fill-mode: forwards;
  background: linear-gradient(135deg, rgba(51, 112, 166, 0.05) 0%, transparent 100%);
  border-bottom: 1px solid rgba(51, 112, 166, 0.1);

  svg {
    animation: ${pulse} 2s ease-in-out infinite;
    color: ${({ theme }) => theme.colors.primary};
    font-size: 2rem;
  }
`

const StyledDialogTitle = styled(DialogTitle)`
  padding: 0;
  margin: 0;
`

const StyledDialogContent = styled(DialogContent)`
  padding: ${({ theme }) => theme.spacing.xl};
  animation: ${fadeIn} 0.5s ease-out;
  animation-delay: 0.2s;
  opacity: 0;
  animation-fill-mode: forwards;
`

const StyledDialogActions = styled(DialogActions)`
  padding: ${({ theme }) => theme.spacing.xl};
  padding-top: ${({ theme }) => theme.spacing.lg};
  animation: ${fadeIn} 0.5s ease-out;
  animation-delay: 0.3s;
  opacity: 0;
  animation-fill-mode: forwards;
  background: linear-gradient(to top, rgba(51, 112, 166, 0.05) 0%, transparent 100%);
  border-top: 1px solid rgba(51, 112, 166, 0.1);
`

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.md};

  > * {
    animation: ${fadeIn} 0.5s ease-out;
    animation-delay: 0.4s;
    opacity: 0;
    animation-fill-mode: forwards;

    &:nth-child(2) {
      animation-delay: 0.5s;
    }
  }
`

const StyledTextField = styled(TextField)`
  & .MuiOutlinedInput-root {
    border-radius: ${({ theme }) => theme.borderRadius.md};
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);

    &:hover {
      background: rgba(255, 255, 255, 0.95);
      box-shadow: 0 4px 12px rgba(51, 112, 166, 0.15);
    }

    &.Mui-focused {
      background: rgba(255, 255, 255, 1);
      box-shadow: 0 4px 16px rgba(51, 112, 166, 0.2);
    }
  }
`

const StyledButton = styled(Button)`
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  font-weight: 600;
  text-transform: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(51, 112, 166, 0.2);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(51, 112, 166, 0.3);
  }

  &:disabled {
    opacity: 0.5;
  }
`

interface LocationModalProps {
  open: boolean
  onClose: () => void
  forceOpen?: boolean // Se true, não permite fechar sem selecionar cidade
}

export const LocationModal = ({ open, onClose, forceOpen = false }: LocationModalProps) => {
  const { setLocation } = useLocation()
  const [states, setStates] = useState<BrazilianState[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [selectedState, setSelectedState] = useState<BrazilianState | null>(null)
  const [selectedCity, setSelectedCity] = useState<City | null>(null)
  const [cityInput, setCityInput] = useState<string>('')
  const [loadingStates, setLoadingStates] = useState(false)
  const [loadingCities, setLoadingCities] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Carregar estados ao abrir o modal
  useEffect(() => {
    if (open) {
      loadStates()
    }
  }, [open])

  // Carregar cidades quando um estado for selecionado
  useEffect(() => {
    if (selectedState) {
      loadCities(selectedState.id)
    } else {
      setCities([])
    }
  }, [selectedState])

  const loadStates = async () => {
    setLoadingStates(true)
    setError(null)
    try {
      const data = await getStates()
      setStates(data)
    } catch (err) {
      setError('Erro ao carregar estados. Tente novamente.')
    } finally {
      setLoadingStates(false)
    }
  }

  const loadCities = async (stateId: number) => {
    setLoadingCities(true)
    setError(null)
    try {
      const data = await getCitiesByState(stateId)
      setCities(data)
    } catch (err) {
      setError('Erro ao carregar cidades. Tente novamente.')
    } finally {
      setLoadingCities(false)
    }
  }

  const handleStateChange = (state: BrazilianState | null) => {
    setSelectedState(state)
    setSelectedCity(null)
    setCityInput('')
  }

  const handleCityChange = (city: City | null) => {
    setSelectedCity(city)
    setCityInput(city?.nome || '')
  }

  const canSubmit = selectedState && selectedCity

  const handleSubmit = () => {
    if (canSubmit && selectedState && selectedCity) {
      setLocation({
        city: selectedCity.nome,
        state: selectedState.nome,
      })
      onClose()
    }
  }

  const handleClose = (_event?: {}, reason?: string) => {
    // Se forceOpen estiver ativo, não permite fechar sem selecionar cidade
    if (forceOpen) {
      if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
        return // Não permite fechar
      }
      // Só permite fechar se tiver cidade selecionada
      if (!canSubmit) {
        return // Não permite fechar
      }
    }
    onClose()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canSubmit) {
      handleSubmit()
    }
  }

  return (
    <StyledDialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={forceOpen}
      onKeyPress={handleKeyPress}
      $open={open}
      PaperProps={{
        sx: {
          background: 'transparent',
          boxShadow: 'none',
          position: 'relative',
          overflow: 'hidden',
          padding: 0,
        },
      }}
    >
      <DialogPaperContent>
      <StyledDialogTitle>
        <DialogHeader>
          <LocationOn />
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Selecione sua localização
          </Typography>
        </DialogHeader>
      </StyledDialogTitle>
      <StyledDialogContent>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 3, lineHeight: 1.6 }}>
          Para oferecermos os melhores imóveis na sua região, precisamos saber onde você está.
        </Typography>

        <FormContainer>
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Autocomplete
            options={states}
            value={selectedState}
            onChange={(_, newValue) => handleStateChange(newValue)}
            getOptionLabel={(option) => `${option.nome} (${option.sigla})`}
            loading={loadingStates}
            renderInput={(params) => (
              <StyledTextField
                {...params}
                label="Estado"
                placeholder="Selecione seu estado"
                InputProps={{
                  ...params.InputProps,
                }}
              />
            )}
            onKeyPress={handleKeyPress}
          />

          <Autocomplete
            disabled={!selectedState || loadingCities}
            options={cities}
            value={selectedCity}
            inputValue={cityInput}
            onInputChange={(_, newInputValue) => setCityInput(newInputValue)}
            onChange={(_, newValue) => handleCityChange(newValue)}
            getOptionLabel={(option) => option.nome}
            loading={loadingCities}
            renderInput={(params) => (
              <StyledTextField
                {...params}
                label="Cidade"
                placeholder={
                  loadingCities
                    ? 'Carregando cidades...'
                    : selectedState
                      ? 'Selecione ou digite sua cidade'
                      : 'Selecione primeiro o estado'
                }
                InputProps={{
                  ...params.InputProps,
                }}
              />
            )}
            onKeyPress={handleKeyPress}
          />
        </FormContainer>
      </StyledDialogContent>
      <StyledDialogActions>
        <StyledButton
          onClick={handleSubmit}
          variant="contained"
          disabled={!canSubmit}
          fullWidth
          size="large"
        >
          Confirmar Localização
        </StyledButton>
      </StyledDialogActions>
      </DialogPaperContent>
    </StyledDialog>
  )
}

