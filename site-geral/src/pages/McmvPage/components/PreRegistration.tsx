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
  Paper,
  Divider,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material'
import {
  PersonAdd,
  CheckCircle,
  Info,
} from '@mui/icons-material'
import { preRegister, PreRegistrationResponse } from '../../../services/mcmvService'
import { fetchCepData } from '../../../services/viaCepService'
import { getStates, getCitiesByState, BrazilianState, City } from '../../../services/locationService'
import {
  formatCurrency,
  unformatCurrency,
  formatCPF,
  unformatCPF,
  formatPhone,
  unformatPhone,
  isValidEmail,
  isValidCPF,
  isValidPhone,
  formatEmail,
  formatCEP,
  unformatCEP,
} from '../../../utils/masks'

interface PreRegistrationProps {
  defaultCity: string
  defaultState: string
}

export const PreRegistration = ({ defaultCity, defaultState }: PreRegistrationProps) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [cpf, setCpf] = useState('')
  const [monthlyIncome, setMonthlyIncome] = useState('')
  const [familySize, setFamilySize] = useState('')
  const [cep, setCep] = useState('')
  const [city, setCity] = useState(defaultCity)
  const [state, setState] = useState(defaultState)
  const [states, setStates] = useState<BrazilianState[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [selectedState, setSelectedState] = useState<BrazilianState | null>(null)
  const [selectedCity, setSelectedCity] = useState<City | null>(null)
  const [loadingStates, setLoadingStates] = useState(false)
  const [loadingCities, setLoadingCities] = useState(false)
  const [hasProperty, setHasProperty] = useState(false)
  const [previousBeneficiary, setPreviousBeneficiary] = useState(false)
  const [cadunicoNumber, setCadunicoNumber] = useState('')
  const [propertyType, setPropertyType] = useState<'' | 'house' | 'apartment' | 'commercial' | 'land' | 'rural'>('')
  const [minBedrooms, setMinBedrooms] = useState('')
  const [maxValue, setMaxValue] = useState('')
  const [neighborhoods, setNeighborhoods] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingCep, setLoadingCep] = useState(false)
  const [result, setResult] = useState<PreRegistrationResponse | null>(null)
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
      case 'name':
        if (!value || value.trim().length < 3) return 'Nome deve ter pelo menos 3 caracteres'
        if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value)) return 'Nome deve conter apenas letras'
        return ''
      case 'email':
        if (!value) return 'Email é obrigatório'
        if (!isValidEmail(value)) return 'Email inválido'
        return ''
      case 'phone':
        if (!value) return 'Telefone é obrigatório'
        if (!isValidPhone(value)) return 'Telefone inválido. Deve ter 10 ou 11 dígitos'
        return ''
      case 'cpf':
        if (!value) return 'CPF é obrigatório'
        if (!isValidCPF(value)) return 'CPF inválido. Deve ter 11 dígitos'
        return ''
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
      case 'maxValue':
        if (value) {
          const maxValueNum = unformatCurrency(value)
          if (maxValueNum <= 0) return 'Valor máximo deve ser maior que zero'
          if (maxValueNum > 10000000) return 'Valor máximo não pode ser maior que R$ 10.000.000,00'
        }
        return ''
      case 'minBedrooms':
        if (value) {
          const bedrooms = parseInt(value)
          if (isNaN(bedrooms) || bedrooms < 1 || bedrooms > 10) return 'Número de quartos deve ser entre 1 e 10'
        }
        return ''
      default:
        return ''
    }
  }

  const handleFieldChange = (field: string, value: string) => {
    let formattedValue = value
    switch (field) {
      case 'name':
        formattedValue = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '')
        setName(formattedValue)
        break
      case 'email':
        formattedValue = formatEmail(value)
        setEmail(formattedValue)
        break
      case 'phone':
        formattedValue = formatPhone(value)
        setPhone(formattedValue)
        break
      case 'cpf':
        formattedValue = formatCPF(value)
        setCpf(formattedValue)
        break
      case 'monthlyIncome':
        formattedValue = formatCurrency(value)
        setMonthlyIncome(formattedValue)
        break
      case 'familySize':
        formattedValue = value.replace(/\D/g, '').slice(0, 2)
        setFamilySize(formattedValue)
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
        // Não permitir edição manual quando há cidade selecionada
        if (selectedCity) {
          return
        }
        formattedValue = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '')
        setCity(formattedValue)
        break
      case 'state':
        // Não permitir edição manual quando há estado selecionado
        if (selectedState) {
          return
        }
        formattedValue = value.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 2)
        setState(formattedValue)
        break
      case 'cadunicoNumber':
        formattedValue = value.replace(/\D/g, '').slice(0, 11)
        setCadunicoNumber(formattedValue)
        break
      case 'propertyType':
        const validTypes: ('house' | 'apartment' | 'commercial' | 'land' | 'rural')[] = ['house', 'apartment', 'commercial', 'land', 'rural']
        if (value === '' || validTypes.includes(value as any)) {
          setPropertyType(value as '' | 'house' | 'apartment' | 'commercial' | 'land' | 'rural')
        }
        break
      case 'minBedrooms':
        formattedValue = value.replace(/\D/g, '').slice(0, 2)
        setMinBedrooms(formattedValue)
        break
      case 'maxValue':
        formattedValue = formatCurrency(value)
        setMaxValue(formattedValue)
        break
      case 'neighborhoods':
        setNeighborhoods(value)
        break
      default:
        return
    }

    const error = validateField(field, formattedValue)
    setErrors((prev) => ({ ...prev, [field]: error }))
  }

  // Verificar se o formulário está válido
  const isFormValid = useMemo(() => {
    // Verificar nome
    if (!name || name.trim().length < 3 || !/^[a-zA-ZÀ-ÿ\s]+$/.test(name)) return false

    // Verificar email
    if (!email || !isValidEmail(email)) return false

    // Verificar telefone
    if (!phone || !isValidPhone(phone)) return false

    // Verificar CPF
    if (!cpf || !isValidCPF(cpf)) return false

    // Verificar renda mensal
    if (!monthlyIncome) return false
    const incomeValue = unformatCurrency(monthlyIncome)
    if (incomeValue <= 0 || incomeValue > 50000) return false

    // Verificar tamanho da família
    if (!familySize) return false
    const size = parseInt(familySize)
    if (isNaN(size) || size < 1 || size > 10) return false

    // Verificar cidade
    if (!city || city.trim().length < 2 || !/^[a-zA-ZÀ-ÿ\s]+$/.test(city)) return false

    // Verificar estado
    if (!state || state.length !== 2 || !/^[A-Z]{2}$/.test(state.toUpperCase())) return false

    // Verificar campos opcionais se preenchidos
    if (maxValue) {
      const maxValueNum = unformatCurrency(maxValue)
      if (maxValueNum <= 0 || maxValueNum > 10000000) return false
    }

    if (minBedrooms) {
      const bedrooms = parseInt(minBedrooms)
      if (isNaN(bedrooms) || bedrooms < 1 || bedrooms > 10) return false
    }

    return true
  }, [name, email, phone, cpf, monthlyIncome, familySize, city, state, maxValue, minBedrooms])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setResult(null)

    // Validar todos os campos obrigatórios
    const newErrors: Record<string, string> = {}
    const requiredFields = [
      { field: 'name', value: name },
      { field: 'email', value: email },
      { field: 'phone', value: phone },
      { field: 'cpf', value: cpf },
      { field: 'monthlyIncome', value: monthlyIncome },
      { field: 'familySize', value: familySize },
      { field: 'city', value: city },
      { field: 'state', value: state },
    ]

    requiredFields.forEach(({ field, value }) => {
      const error = validateField(field, value)
      if (error) newErrors[field] = error
    })

    // Validar campos opcionais se preenchidos
    if (maxValue) {
      const maxValueError = validateField('maxValue', maxValue)
      if (maxValueError) newErrors.maxValue = maxValueError
    }

    if (minBedrooms) {
      const minBedroomsError = validateField('minBedrooms', minBedrooms)
      if (minBedroomsError) newErrors.minBedrooms = minBedroomsError
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setError('Por favor, corrija os erros nos campos.')
      return
    }

    setLoading(true)

    try {
      const propertyPreferences = {
        ...(propertyType && { type: propertyType }),
        ...(minBedrooms && { minBedrooms: parseInt(minBedrooms) }),
        ...(maxValue && { maxValue: unformatCurrency(maxValue) }),
        ...(neighborhoods && {
          neighborhoods: neighborhoods.split(',').map((n) => n.trim()).filter(Boolean),
        }),
      }

      const response = await preRegister({
        name: name.trim(),
        email: email.trim(),
        phone: unformatPhone(phone),
        cpf: unformatCPF(cpf),
        monthlyIncome: unformatCurrency(monthlyIncome),
        familySize: parseInt(familySize),
        city: city.trim(),
        state: state.trim().toUpperCase(),
        hasProperty,
        previousBeneficiary,
        cadunicoNumber: cadunicoNumber.trim() || undefined,
        propertyPreferences: Object.keys(propertyPreferences).length > 0 ? propertyPreferences : undefined,
        source: 'website',
      })

      setResult(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao realizar pré-cadastro. Tente novamente.')
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
        Pré-cadastro Minha Casa Minha Vida
      </Typography>

      {result ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'success.main', mb: 2 }}>
            Pré-cadastro Realizado com Sucesso!
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            {result.message}
          </Typography>
          {result.eligible && result.incomeRange && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Você é elegível para o Minha Casa Minha Vida - {getIncomeRangeLabel(result.incomeRange)}
            </Alert>
          )}
          <Button
            variant="contained"
            onClick={() => {
              setResult(null)
              setName('')
              setEmail('')
              setPhone('')
              setCpf('')
              setMonthlyIncome('')
              setFamilySize('')
              setHasProperty(false)
              setPreviousBeneficiary(false)
              setCadunicoNumber('')
              setPropertyType('')
              setMinBedrooms('')
              setMaxValue('')
              setNeighborhoods('')
            }}
          >
            Novo Pré-cadastro
          </Button>
        </Paper>
      ) : (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Dados Pessoais
              </Typography>
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
                label="CPF"
                value={cpf}
                onChange={(e) => handleFieldChange('cpf', e.target.value)}
                onBlur={(e) => handleFieldChange('cpf', e.target.value)}
                required
                placeholder="000.000.000-00"
                inputProps={{ maxLength: 14 }}
                error={!!errors.cpf}
                helperText={errors.cpf || 'Informe seu CPF'}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Dados Financeiros
              </Typography>
            </Grid>

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

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Localização
              </Typography>
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
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Situação Atual
              </Typography>
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
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Preferências de Imóvel (Opcional)
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="property-type-label">Tipo de Imóvel</InputLabel>
                <Select
                  labelId="property-type-label"
                  id="property-type-select"
                  value={propertyType}
                  label="Tipo de Imóvel"
                  onChange={(e) => {
                    const value = e.target.value as '' | 'house' | 'apartment' | 'commercial' | 'land' | 'rural'
                    setPropertyType(value)
                    // Limpar erro se houver
                    if (value) {
                      setErrors((prev) => {
                        const newErrors = { ...prev }
                        delete newErrors.propertyType
                        return newErrors
                      })
                    }
                  }}
                >
                  <MenuItem value="">
                    <em>Selecione um tipo (opcional)</em>
                  </MenuItem>
                  <MenuItem value="apartment">Apartamento</MenuItem>
                  <MenuItem value="house">Casa</MenuItem>
                  <MenuItem value="commercial">Comercial</MenuItem>
                  <MenuItem value="land">Terreno</MenuItem>
                  <MenuItem value="rural">Rural</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Mínimo de Quartos"
                value={minBedrooms}
                onChange={(e) => handleFieldChange('minBedrooms', e.target.value)}
                onBlur={(e) => handleFieldChange('minBedrooms', e.target.value)}
                inputProps={{ maxLength: 2 }}
                error={!!errors.minBedrooms}
                helperText={errors.minBedrooms || 'Opcional (1-10)'}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Valor Máximo Desejado"
                value={maxValue}
                onChange={(e) => handleFieldChange('maxValue', e.target.value)}
                onBlur={(e) => handleFieldChange('maxValue', e.target.value)}
                placeholder="R$ 0,00"
                error={!!errors.maxValue}
                helperText={errors.maxValue || 'Opcional'}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Bairros de Interesse"
                value={neighborhoods}
                onChange={(e) => setNeighborhoods(e.target.value)}
                placeholder="Separe por vírgula (ex: Centro, Jardim América)"
                helperText="Separe múltiplos bairros por vírgula"
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading || !isFormValid}
                startIcon={loading ? <CircularProgress size={20} /> : <PersonAdd />}
                sx={{ py: 1.5 }}
              >
                {loading ? 'Processando...' : 'Realizar Pré-cadastro'}
              </Button>
              {!isFormValid && !loading && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
                  Preencha todos os campos obrigatórios para continuar
                </Typography>
              )}
            </Grid>
          </Grid>
        </form>
      )}

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
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main', mb: 1 }}>
                    Pré-cadastro realizado com sucesso!
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {result.message}
                  </Typography>
                </Box>
              </>
            ) : (
              <>
                <Info sx={{ fontSize: 40, color: 'warning.main' }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'warning.main', mb: 1 }}>
                    Pré-cadastro realizado
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {result.message}
                  </Typography>
                </Box>
              </>
            )}
          </Box>

          {result.eligible && result.incomeRange && (
            <Box sx={{ mt: 2 }}>
              <Chip
                label={getIncomeRangeLabel(result.incomeRange)}
                color="primary"
                sx={{ fontSize: '1rem', py: 2.5 }}
              />
            </Box>
          )}

          {result.leadId && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
              ID do cadastro: {result.leadId}
            </Typography>
          )}
        </Paper>
      )}
    </Box>
  )
}

