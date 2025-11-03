import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Autocomplete,
  CircularProgress,
  Alert,
} from '@mui/material'
import { LocationOn } from '@mui/icons-material'
import styled from 'styled-components'
import { useLocation } from '../../contexts/LocationContext'
import { getStates, getCitiesByState, BrazilianState, City } from '../../services/locationService'

const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    padding: ${({ theme }) => theme.spacing.sm};
  }
`

const DialogHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.md};
`

interface LocationModalProps {
  open: boolean
  onClose: () => void
}

export const LocationModal = ({ open, onClose }: LocationModalProps) => {
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
      console.error(err)
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
      console.error(err)
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canSubmit) {
      handleSubmit()
    }
  }

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown
      onKeyPress={handleKeyPress}
    >
      <DialogTitle>
        <DialogHeader>
          <LocationOn color="primary" />
          <Typography variant="h6">Selecione sua localização</Typography>
        </DialogHeader>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Para oferecermos os melhores imóveis na sua região, precisamos saber onde você está.
        </Typography>

        <FormContainer>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
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
              <TextField
                {...params}
                label="Estado"
                placeholder="Selecione seu estado"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingStates ? <CircularProgress size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
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
              <TextField
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
                  endAdornment: (
                    <>
                      {loadingCities ? <CircularProgress size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            onKeyPress={handleKeyPress}
          />
        </FormContainer>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleSubmit} variant="contained" disabled={!canSubmit} fullWidth>
          Confirmar Localização
        </Button>
      </DialogActions>
    </StyledDialog>
  )
}

