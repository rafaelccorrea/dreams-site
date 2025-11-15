import { useState, useMemo, useEffect } from 'react'
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Alert,
  CircularProgress,
  FormControlLabel,
  Switch,
  Checkbox,
  Paper,
  Divider,
  Chip,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import {
  CheckCircle,
  Cancel,
  Info,
} from '@mui/icons-material'
import { checkEligibility, CheckEligibilityResponse } from '../../../services/mcmvService'
import { fetchCepData } from '../../../services/viaCepService'
import { getStates, getCitiesByState, BrazilianState, City } from '../../../services/locationService'
import { 
  formatCurrency, 
  unformatCurrency, 
  formatPhone, 
  unformatPhone, 
  isValidEmail, 
  isValidPhone,
  formatEmail,
  formatCEP,
  unformatCEP,
} from '../../../utils/masks'

interface EligibilityCheckProps {
  defaultCity: string
  defaultState: string
}

export const EligibilityCheck = ({ defaultCity, defaultState }: EligibilityCheckProps) => {
  const [monthlyIncome, setMonthlyIncome] = useState('')
  const [familySize, setFamilySize] = useState('')
  const [hasProperty, setHasProperty] = useState(false)
  const [previousBeneficiary, setPreviousBeneficiary] = useState(false)
  const [cep, setCep] = useState('')
  const [city, setCity] = useState(defaultCity)
  const [state, setState] = useState(defaultState)
  const [states, setStates] = useState<BrazilianState[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [selectedState, setSelectedState] = useState<BrazilianState | null>(null)
  const [selectedCity, setSelectedCity] = useState<City | null>(null)
  const [loadingStates, setLoadingStates] = useState(false)
  const [loadingCities, setLoadingCities] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [cadunicoNumber, setCadunicoNumber] = useState('')
  const [acceptCommunications, setAcceptCommunications] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingCep, setLoadingCep] = useState(false)
  const [result, setResult] = useState<CheckEligibilityResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Carregar estados ao montar o componente
  useEffect(() => {
    const loadStates = async () => {
      setLoadingStates(true)
      try {
        const data = await getStates()
        setStates(data)
        // Se houver estado padrão, selecionar
        if (defaultState) {
          const defaultStateObj = data.find(s => s.sigla === defaultState.toUpperCase())
          if (defaultStateObj) {
            setSelectedState(defaultStateObj)
          }
        }
      } catch (err) {
      } finally {
        setLoadingStates(false)
      }
    }
    loadStates()
  }, [defaultState])

  // Carregar cidades quando um estado for selecionado
  useEffect(() => {
    if (selectedState) {
      const loadCities = async () => {
        setLoadingCities(true)
        try {
          const data = await getCitiesByState(selectedState.id)
          setCities(data)
          // Se houver cidade padrão, selecionar
          if (defaultCity) {
            const defaultCityObj = data.find(c => c.nome === defaultCity)
            if (defaultCityObj) {
              setSelectedCity(defaultCityObj)
              setCity(defaultCityObj.nome)
            }
          }
        } catch (err) {
        } finally {
          setLoadingCities(false)
        }
      }
      loadCities()
    } else {
      setCities([])
      setSelectedCity(null)
    }
  }, [selectedState, defaultCity])

  // Função para buscar dados do CEP
  const handleCepSearch = async (cepValue: string) => {
    setLoadingCep(true)
    try {
      const cepData = await fetchCepData(cepValue)
      if (cepData) {
        // Se estados ainda não foram carregados, carregar primeiro
        let statesList = states
        if (statesList.length === 0) {
          statesList = await getStates()
          setStates(statesList)
        }
        
        // Encontrar e selecionar o estado correspondente
        const stateObj = statesList.find(s => s.sigla === cepData.uf.toUpperCase())
        if (stateObj) {
          setSelectedState(stateObj)
          setState(cepData.uf.toUpperCase())
          
          // Aguardar carregar as cidades do estado
          const citiesData = await getCitiesByState(stateObj.id)
          setCities(citiesData)
          
          // Encontrar e selecionar a cidade correspondente
          const cityObj = citiesData.find(c => c.nome === cepData.localidade)
          if (cityObj) {
            setSelectedCity(cityObj)
            setCity(cityObj.nome)
          } else {
            setCity(cepData.localidade)
          }
        } else {
          setState(cepData.uf.toUpperCase())
          setCity(cepData.localidade)
        }
        
        // Limpar erros dos campos preenchidos
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors.state
          delete newErrors.city
          delete newErrors.cep
          return newErrors
        })
      } else {
        setErrors((prev) => ({
          ...prev,
          cep: 'CEP não encontrado',
        }))
      }
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        cep: 'Erro ao buscar CEP. Tente novamente.',
      }))
    } finally {
      setLoadingCep(false)
    }
  }

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'monthlyIncome':
        if (!value) return 'Renda mensal é obrigatória'
        const incomeValue = unformatCurrency(value)
        if (incomeValue <= 0) return 'Renda mensal deve ser maior que zero'
        if (incomeValue > 50000) return 'Renda mensal não pode ser maior que R$ 50.000,00'
        return ''
      case 'familySize':
        if (!value) return 'Tamanho da família é obrigatório'
        const size = parseInt(value)
        if (isNaN(size) || size < 1 || size > 10) return 'Tamanho da família deve ser entre 1 e 10 pessoas'
        return ''
      case 'city':
        if (!value || value.trim().length < 2) return 'Cidade deve ter pelo menos 2 caracteres'
        if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value)) return 'Cidade deve conter apenas letras'
        return ''
      case 'state':
        if (!value || value.length !== 2) return 'Estado deve ter 2 letras (ex: SP, RJ)'
        if (!/^[A-Z]{2}$/.test(value.toUpperCase())) return 'Estado deve conter apenas letras maiúsculas'
        return ''
      case 'email':
        if (!value) return 'Email é obrigatório'
        if (!isValidEmail(value)) return 'Email inválido'
        return ''
      case 'phone':
        if (!value) return 'Telefone é obrigatório'
        if (!isValidPhone(value)) return 'Telefone inválido. Deve ter 10 ou 11 dígitos'
        return ''
      case 'name':
        if (!value || value.trim().length < 3) return 'Nome deve ter pelo menos 3 caracteres'
        if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value)) return 'Nome deve conter apenas letras'
        return ''
      default:
        return ''
    }
  }

  const handleFieldChange = (field: string, value: string) => {
    // Aplicar máscaras conforme o campo
    let formattedValue = value
    switch (field) {
      case 'monthlyIncome':
        formattedValue = formatCurrency(value)
        setMonthlyIncome(formattedValue)
        break
      case 'phone':
        formattedValue = formatPhone(value)
        setPhone(formattedValue)
        break
      case 'email':
        formattedValue = formatEmail(value)
        setEmail(formattedValue)
        break
      case 'cep':
        formattedValue = formatCEP(value)
        setCep(formattedValue)
        // Limpar erro se houver
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors.cep
          return newErrors
        })
        // Buscar CEP quando estiver completo (8 dígitos)
        const cepDigits = unformatCEP(formattedValue)
        if (cepDigits.length === 8) {
          handleCepSearch(formattedValue)
        }
        return // Não validar ainda, aguardar busca
      case 'city':
        formattedValue = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '')
        setCity(formattedValue)
        break
      case 'state':
        formattedValue = value.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 2)
        setState(formattedValue)
        break
      case 'familySize':
        formattedValue = value.replace(/\D/g, '').slice(0, 2)
        setFamilySize(formattedValue)
        break
      case 'name':
        formattedValue = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '')
        setName(formattedValue)
        break
      case 'cadunicoNumber':
        formattedValue = value.replace(/\D/g, '')
        setCadunicoNumber(formattedValue)
        break
      default:
        return
    }

    // Validar campo
    const error = validateField(field, formattedValue)
    setErrors((prev) => ({ ...prev, [field]: error }))
  }

  // Verificar se o formulário está válido
  const isFormValid = useMemo(() => {
    // Verificar se o checkbox de consentimento está marcado
    if (!acceptCommunications) return false

    // Verificar renda mensal
    if (!monthlyIncome) return false
    const incomeValue = unformatCurrency(monthlyIncome)
    if (incomeValue <= 0 || incomeValue > 50000) return false

    // Verificar tamanho da família
    if (!familySize) return false
    const size = parseInt(familySize)
    if (isNaN(size) || size < 1 || size > 10) return false

    // Verificar cidade (pode ser do select ou manual)
    const finalCity = selectedCity?.nome || city
    if (!finalCity || finalCity.trim().length < 2) return false

    // Verificar estado (pode ser do select ou manual)
    const finalState = selectedState?.sigla || state
    if (!finalState || finalState.length !== 2) return false

    // Verificar nome
    if (!name || name.trim().length < 3 || !/^[a-zA-ZÀ-ÿ\s]+$/.test(name)) return false

    // Verificar email
    if (!email || !isValidEmail(email)) return false

    // Verificar telefone
    if (!phone || !isValidPhone(phone)) return false

    return true
  }, [monthlyIncome, familySize, city, state, name, email, phone, acceptCommunications])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setResult(null)

    // Validar todos os campos obrigatórios
    const newErrors: Record<string, string> = {}
    const requiredFields = [
      { field: 'monthlyIncome', value: monthlyIncome },
      { field: 'familySize', value: familySize },
      { field: 'city', value: city },
      { field: 'state', value: state },
      { field: 'name', value: name },
      { field: 'email', value: email },
      { field: 'phone', value: phone },
    ]

    requiredFields.forEach(({ field, value }) => {
      const error = validateField(field, value)
      if (error) newErrors[field] = error
    })

    // Validar checkbox de consentimento (botão já está desabilitado, mas validar aqui também)
    if (!acceptCommunications) {
      newErrors.acceptCommunications = 'É necessário aceitar receber comunicações'
      setErrors(newErrors)
      setError('É necessário aceitar receber comunicações para continuar.')
      return
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setError('Por favor, corrija os erros nos campos.')
      return
    }

    const incomeValue = unformatCurrency(monthlyIncome)
    const familySizeValue = parseInt(familySize)

    setLoading(true)

    try {
      const response = await checkEligibility({
        monthlyIncome: incomeValue,
        familySize: familySizeValue,
        hasProperty,
        previousBeneficiary,
        city: city.trim(),
        state: state.trim().toUpperCase(),
        name: name.trim(),
        email: email.trim(),
        phone: unformatPhone(phone),
        cadunicoNumber: cadunicoNumber.trim() || undefined,
        source: 'website',
      })

      setResult(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao verificar elegibilidade. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const getIncomeRangeLabel = (range?: string) => {
    switch (range) {
      case 'faixa1':
        return 'Faixa 1 (até R$ 2.000/mês)'
      case 'faixa2':
        return 'Faixa 2 (até R$ 3.000/mês)'
      case 'faixa3':
        return 'Faixa 3 (até R$ 4.000/mês)'
      default:
        return ''
    }
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Verificar Elegibilidade para Minha Casa Minha Vida
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Renda Familiar Mensal"
              value={monthlyIncome}
              onChange={(e) => handleFieldChange('monthlyIncome', e.target.value)}
              onBlur={(e) => handleFieldChange('monthlyIncome', e.target.value)}
              required
              placeholder="R$ 0,00"
              error={!!errors.monthlyIncome}
              helperText={errors.monthlyIncome || 'Informe a renda familiar mensal'}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Tamanho da Família"
              value={familySize}
              onChange={(e) => handleFieldChange('familySize', e.target.value)}
              onBlur={(e) => handleFieldChange('familySize', e.target.value)}
              required
              inputProps={{ maxLength: 2 }}
              error={!!errors.familySize}
              helperText={errors.familySize || 'Número de pessoas na família (1-10)'}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="CEP"
              value={cep}
              onChange={(e) => handleFieldChange('cep', e.target.value)}
              onBlur={(e) => {
                const cepDigits = unformatCEP(e.target.value)
                if (cepDigits.length === 8 && !loadingCep) {
                  handleCepSearch(e.target.value)
                }
              }}
              placeholder="00000-000"
              error={!!errors.cep}
              helperText={errors.cep || (loadingCep ? 'Buscando endereço...' : 'Digite o CEP para preencher automaticamente')}
              InputProps={{
                endAdornment: loadingCep ? (
                  <InputAdornment position="end">
                    <CircularProgress size={20} />
                  </InputAdornment>
                ) : undefined,
              }}
              disabled={loadingCep}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth required error={!!errors.state} disabled={loadingCep || loadingStates}>
              <InputLabel>Estado (UF)</InputLabel>
              <Select
                value={selectedState?.sigla || state || ''}
                label="Estado (UF)"
                onChange={(e) => {
                  const stateObj = states.find(s => s.sigla === e.target.value)
                  if (stateObj) {
                    setSelectedState(stateObj)
                    setState(stateObj.sigla)
                    setSelectedCity(null)
                    setCity('')
                    setErrors((prev) => {
                      const newErrors = { ...prev }
                      delete newErrors.state
                      return newErrors
                    })
                  }
                }}
              >
                {loadingStates ? (
                  <MenuItem disabled>
                    <CircularProgress size={16} sx={{ mr: 1 }} />
                    Carregando estados...
                  </MenuItem>
                ) : (
                  states.map((stateOption) => (
                    <MenuItem key={stateOption.id} value={stateOption.sigla}>
                      {stateOption.sigla} - {stateOption.nome}
                    </MenuItem>
                  ))
                )}
              </Select>
              {errors.state && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                  {errors.state}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth required error={!!errors.city} disabled={loadingCep || loadingCities || !selectedState}>
              <InputLabel>Cidade</InputLabel>
              <Select
                value={selectedCity?.nome || city || ''}
                label="Cidade"
                onChange={(e) => {
                  const cityObj = cities.find(c => c.nome === e.target.value)
                  if (cityObj) {
                    setSelectedCity(cityObj)
                    setCity(cityObj.nome)
                    setErrors((prev) => {
                      const newErrors = { ...prev }
                      delete newErrors.city
                      return newErrors
                    })
                  }
                }}
              >
                {loadingCities ? (
                  <MenuItem disabled>
                    <CircularProgress size={16} sx={{ mr: 1 }} />
                    Carregando cidades...
                  </MenuItem>
                ) : cities.length === 0 ? (
                  <MenuItem disabled>
                    {selectedState ? 'Nenhuma cidade encontrada' : 'Selecione um estado primeiro'}
                  </MenuItem>
                ) : (
                  cities.map((cityOption) => (
                    <MenuItem key={cityOption.id} value={cityOption.nome}>
                      {cityOption.nome}
                    </MenuItem>
                  ))
                )}
              </Select>
              {errors.city && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                  {errors.city}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={hasProperty}
                  onChange={(e) => setHasProperty(e.target.checked)}
                />
              }
              label="Possuo imóvel próprio"
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={previousBeneficiary}
                  onChange={(e) => setPreviousBeneficiary(e.target.checked)}
                />
              }
              label="Já fui beneficiário do Minha Casa Minha Vida"
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nome Completo"
              value={name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              onBlur={(e) => handleFieldChange('name', e.target.value)}
              required
              error={!!errors.name}
              helperText={errors.name || 'Informe seu nome completo'}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              onBlur={(e) => handleFieldChange('email', e.target.value)}
              required
              error={!!errors.email}
              helperText={errors.email || 'Informe seu email'}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Telefone"
              value={phone}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
              onBlur={(e) => handleFieldChange('phone', e.target.value)}
              required
              placeholder="(00) 00000-0000"
              error={!!errors.phone}
              helperText={errors.phone || 'Informe seu telefone'}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Número do CadÚnico"
              value={cadunicoNumber}
              onChange={(e) => handleFieldChange('cadunicoNumber', e.target.value)}
              inputProps={{ maxLength: 11 }}
              helperText="Apenas números (opcional)"
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={acceptCommunications}
                  onChange={(e) => {
                    setAcceptCommunications(e.target.checked)
                    if (e.target.checked) {
                      setErrors((prev) => {
                        const newErrors = { ...prev }
                        delete newErrors.acceptCommunications
                        return newErrors
                      })
                    }
                  }}
                  required
                  sx={{
                    '&.Mui-checked': {
                      color: '#3370A6',
                    },
                  }}
                />
              }
              label="Aceito receber comunicações sobre o programa Minha Casa Minha Vida"
              sx={{
                '& .MuiFormControlLabel-label': {
                  fontSize: '0.9rem',
                },
              }}
            />
            {errors.acceptCommunications && (
              <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5, ml: 4 }}>
                {errors.acceptCommunications}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading || !isFormValid}
              sx={{ py: 1.5 }}
            >
              {loading ? (
                <>
                  <CircularProgress size={24} sx={{ mr: 1 }} />
                  Verificando...
                </>
              ) : (
                'Verificar Elegibilidade'
              )}
            </Button>
            {!isFormValid && !loading && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
                Preencha todos os campos obrigatórios para continuar
              </Typography>
            )}
          </Grid>
        </Grid>
      </form>

      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}

      {result && (
        <Paper sx={{ mt: 3, p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            {result.eligible ? (
              <>
                <CheckCircle sx={{ fontSize: 40, color: 'success.main' }} />
                <Typography variant="h5" sx={{ fontWeight: 600, color: 'success.main' }}>
                  Você é elegível para o Minha Casa Minha Vida!
                </Typography>
              </>
            ) : (
              <>
                <Cancel sx={{ fontSize: 40, color: 'error.main' }} />
                <Typography variant="h5" sx={{ fontWeight: 600, color: 'error.main' }}>
                  Você não é elegível para o Minha Casa Minha Vida
                </Typography>
              </>
            )}
          </Box>

          {result.eligible && (
            <Box sx={{ mb: 2 }}>
              <Chip
                label={getIncomeRangeLabel(result.incomeRange)}
                color="primary"
                sx={{ mb: 2, fontSize: '1rem', py: 2.5 }}
              />
              {result.maxPropertyValue && (
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Valor máximo do imóvel:</strong> R${' '}
                  {result.maxPropertyValue.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Typography>
              )}
              {result.subsidy !== undefined && (
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Subsídio:</strong> {(result.subsidy * 100).toFixed(0)}%
                </Typography>
              )}
            </Box>
          )}

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Motivos:
            </Typography>
            {result.reasons.map((reason, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                <Info sx={{ fontSize: 20, color: 'text.secondary', mr: 1, mt: 0.5 }} />
                <Typography variant="body2" color="text.secondary">
                  {reason}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  )
}

