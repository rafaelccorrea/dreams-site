import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  CircularProgress,
  Chip,
  InputAdornment,
} from '@mui/material'
import {
  Delete as DeleteIcon,
  Home,
  Apartment,
  Business,
  Park,
  Agriculture,
  Save,
  ArrowBack,
} from '@mui/icons-material'
import { usePublicProperty } from '../../hooks/usePublicProperty'
import { useAuth } from '../../hooks/useAuth'
import { useLocation } from '../../contexts/LocationContext'
import { PageContainer, PageHeader, PageContent } from '../../components/PageContainer'
import { CreatePropertyRequest } from '../../services/publicPropertyService'
import { formatCEP, isValidCEP, formatArea } from '../../utils/masks'

const PropertyTypeIcon = ({ type }: { type: string }) => {
  const iconProps = { fontSize: 'small' as const, sx: { mr: 1 } }
  switch (type) {
    case 'house':
      return <Home {...iconProps} />
    case 'apartment':
      return <Apartment {...iconProps} />
    case 'commercial':
      return <Business {...iconProps} />
    case 'land':
      return <Park {...iconProps} />
    case 'rural':
      return <Agriculture {...iconProps} />
    default:
      return <Home {...iconProps} />
  }
}

const COMMON_FEATURES = [
  'Piscina',
  'Churrasqueira',
  'Garagem',
  'Área de lazer',
  'Elevador',
  'Portaria 24h',
  'Academia',
  'Playground',
  'Quadra',
  'Salão de festas',
  'Espaço gourmet',
  'Varanda',
  'Sacada',
  'Quintal',
  'Jardim',
]

export const MyPropertyPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const { location } = useLocation()
  const { property, loading, error, createProperty, deleteProperty } = usePublicProperty()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState<CreatePropertyRequest>({
    title: '',
    description: '',
    type: 'apartment',
    status: 'available',
    address: '',
    street: '',
    number: '',
    complement: '',
    city: location?.city || '',
    state: location?.state || '',
    zipCode: '',
    neighborhood: '',
    totalArea: 0,
    builtArea: 0,
    bedrooms: 0,
    bathrooms: 0,
    parkingSpaces: 0,
    salePrice: undefined,
    rentPrice: undefined,
    condominiumFee: undefined,
    iptu: undefined,
    features: [],
  })

  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [loadingCEP, setLoadingCEP] = useState(false)

  // Preencher formulário com dados da propriedade existente
  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || '',
        description: property.description || '',
        type: property.type,
        status: property.status || 'available',
        address: property.address || '',
        street: property.street || '',
        number: property.number || '',
        complement: property.complement || '',
        city: property.city || location?.city || '',
        state: property.state || location?.state || '',
        zipCode: property.zipCode || '',
        neighborhood: property.neighborhood || '',
        totalArea: Number(property.totalArea) || 0,
        builtArea: Number(property.builtArea) || 0,
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        parkingSpaces: property.parkingSpaces || 0,
        salePrice: property.salePrice ? Number(property.salePrice) : undefined,
        rentPrice: property.rentPrice ? Number(property.rentPrice) : undefined,
        condominiumFee: property.condominiumFee ? Number(property.condominiumFee) : undefined,
        iptu: property.iptu ? Number(property.iptu) : undefined,
        features: property.features || [],
      })
      setSelectedFeatures(property.features || [])
    } else {
      // Resetar formulário se não há propriedade
      setFormData(prev => ({
        ...prev,
        city: location?.city || '',
        state: location?.state || '',
      }))
    }
  }, [property, location?.city, location?.state])

  // Atualizar cidade e estado quando location mudar
  useEffect(() => {
    if (location?.city && !property) {
      setFormData(prev => ({
        ...prev,
        city: location.city,
        state: location.state,
      }))
    }
  }, [location, property])

  // Redirecionar se não autenticado (após verificar autenticação)
  useEffect(() => {
    // Aguardar o carregamento da autenticação terminar antes de redirecionar
    if (!authLoading && !isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, authLoading, navigate])

  const handleChange = (field: keyof CreatePropertyRequest, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Limpar erro do campo quando usuário começar a digitar
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  // Buscar CEP via ViaCEP
  const fetchCEPData = async (cep: string) => {
    const cepDigits = cep.replace(/\D/g, '')
    if (cepDigits.length !== 8) return

    setLoadingCEP(true)
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepDigits}/json/`)
      const data = await response.json()
      
      if (!data.erro) {
        handleChange('city', data.localidade || '')
        handleChange('state', data.uf || '')
        handleChange('neighborhood', data.bairro || '')
        if (data.logradouro) {
          handleChange('street', data.logradouro || '')
        }
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error)
    } finally {
      setLoadingCEP(false)
    }
  }

  const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCEP(e.target.value)
    handleChange('zipCode', formatted)
    
    // Buscar CEP quando estiver completo (8 dígitos)
    const cepDigits = formatted.replace(/\D/g, '')
    if (cepDigits.length === 8) {
      fetchCEPData(formatted)
    }
  }

  const handleCurrencyChange = (field: 'salePrice' | 'rentPrice' | 'condominiumFee' | 'iptu') => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      // Remove formatação e converte para número
      const numericValue = value.replace(/\D/g, '')
      if (!numericValue) {
        handleChange(field, undefined)
        return
      }
      const number = Number(numericValue)
      handleChange(field, number > 0 ? number : undefined)
    }

  const handleAreaChange = (field: 'totalArea' | 'builtArea') => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      // Remove tudo que não é dígito
      const cleaned = value.replace(/[^\d]/g, '')
      
      // Se não há dígitos, limpa o campo
      if (!cleaned) {
        if (field === 'totalArea') {
          handleChange(field, 0)
        } else {
          handleChange(field, undefined)
        }
        return
      }
      
      const number = parseFloat(cleaned) / 100
      
      if (field === 'totalArea') {
        handleChange(field, number > 0 ? number : 0)
      } else {
        handleChange(field, number > 0 ? number : undefined)
      }
    }

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures(prev => {
      const newFeatures = prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
      handleChange('features', newFeatures)
      return newFeatures
    })
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.title.trim()) {
      errors.title = 'Título é obrigatório'
    }
    if (!formData.description.trim()) {
      errors.description = 'Descrição é obrigatória'
    }
    if (!formData.street.trim()) {
      errors.street = 'Rua é obrigatória'
    }
    if (!formData.number.trim()) {
      errors.number = 'Número é obrigatório'
    }
    if (!formData.city.trim()) {
      errors.city = 'Cidade é obrigatória'
    }
    if (!formData.state.trim()) {
      errors.state = 'Estado é obrigatório'
    }
    if (!formData.zipCode.trim()) {
      errors.zipCode = 'CEP é obrigatório'
    } else if (!isValidCEP(formData.zipCode)) {
      errors.zipCode = 'CEP inválido'
    }
    if (!formData.neighborhood.trim()) {
      errors.neighborhood = 'Bairro é obrigatório'
    }
    if (!formData.totalArea || formData.totalArea <= 0) {
      errors.totalArea = 'Área total deve ser maior que zero'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    if (property) {
      // Se já tem propriedade, mostrar aviso
      setFormErrors({ _general: 'Você já possui uma propriedade cadastrada. Delete a propriedade anterior para criar uma nova.' })
      return
    }

    setSubmitLoading(true)
    try {
      const dataToSubmit: CreatePropertyRequest = {
        ...formData,
        zipCode: formData.zipCode.replace(/\D/g, ''),
        address: `${formData.street}, ${formData.number}${formData.complement ? `, ${formData.complement}` : ''} - ${formData.neighborhood}, ${formData.city} - ${formData.state}`,
      }
      
      await createProperty(dataToSubmit)
      navigate('/minha-propriedade')
    } catch (err: unknown) {
      if (err instanceof Error && (err.message?.includes('409') || err.message?.includes('já possui'))) {
        setFormErrors({ _general: 'Você já possui uma propriedade cadastrada. Delete a propriedade anterior para criar uma nova.' })
      } else {
        setFormErrors({ _general: err instanceof Error ? err.message : 'Erro ao criar propriedade' })
      }
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!property) return

    setDeleteLoading(true)
    try {
      await deleteProperty(property.id)
      setDeleteDialogOpen(false)
    } catch (err) {
      console.error('Erro ao deletar propriedade:', err)
    } finally {
      setDeleteLoading(false)
    }
  }

  if (authLoading) {
    return (
      <PageContainer>
        <PageContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress />
          </Box>
        </PageContent>
      </PageContainer>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <PageContainer>
        <PageHeader>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
              }}
            >
              {property ? 'Minha Propriedade' : 'Cadastrar Propriedade'}
            </Typography>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/')}
              sx={{ textTransform: 'none' }}
            >
              Voltar
            </Button>
          </Box>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              fontSize: { xs: '0.9rem', sm: '1rem' },
            }}
            >
              {property
                ? 'Gerencie sua propriedade cadastrada'
                : 'Preencha os dados da sua propriedade para cadastrá-la'}
            </Typography>
        </PageHeader>

        <PageContent>
            {/* Erro geral */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {formErrors._general && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {formErrors._general}
              </Alert>
            )}

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <CircularProgress />
              </Box>
            ) : property ? (
              // Visualização da propriedade existente - apenas botão de deletar
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleDeleteClick}
                >
                  Deletar Propriedade
                </Button>
              </Box>
            ) : (
              // Formulário de criação
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* Informações Básicas */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Informações Básicas
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Título da Propriedade *"
                      value={formData.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      error={!!formErrors.title}
                      helperText={formErrors.title}
                      required
                      placeholder="Ex: Apartamento 3 quartos em São Paulo"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Descrição *"
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      error={!!formErrors.description}
                      helperText={formErrors.description}
                      required
                      placeholder="Descreva detalhadamente a propriedade..."
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Tipo de Propriedade *</InputLabel>
                      <Select
                        value={formData.type}
                        onChange={(e) => handleChange('type', e.target.value)}
                        label="Tipo de Propriedade *"
                      >
                        <MenuItem value="apartment">
                          <PropertyTypeIcon type="apartment" />
                          Apartamento
                        </MenuItem>
                        <MenuItem value="house">
                          <PropertyTypeIcon type="house" />
                          Casa
                        </MenuItem>
                        <MenuItem value="commercial">
                          <PropertyTypeIcon type="commercial" />
                          Comercial
                        </MenuItem>
                        <MenuItem value="land">
                          <PropertyTypeIcon type="land" />
                          Terreno
                        </MenuItem>
                        <MenuItem value="rural">
                          <PropertyTypeIcon type="rural" />
                          Rural
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={formData.status}
                        onChange={(e) => handleChange('status', e.target.value)}
                        label="Status"
                      >
                        <MenuItem value="available">Disponível</MenuItem>
                        <MenuItem value="rented">Alugado</MenuItem>
                        <MenuItem value="sold">Vendido</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Endereço */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mb: 2, mt: 2, fontWeight: 600 }}>
                      Endereço
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={8}>
                    <TextField
                      fullWidth
                      label="Rua/Logradouro *"
                      value={formData.street}
                      onChange={(e) => handleChange('street', e.target.value)}
                      error={!!formErrors.street}
                      helperText={formErrors.street}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Número *"
                      value={formData.number}
                      onChange={(e) => handleChange('number', e.target.value)}
                      error={!!formErrors.number}
                      helperText={formErrors.number}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Complemento"
                      value={formData.complement}
                      onChange={(e) => handleChange('complement', e.target.value)}
                      placeholder="Apto, Bloco, etc."
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Bairro *"
                      value={formData.neighborhood}
                      onChange={(e) => handleChange('neighborhood', e.target.value)}
                      error={!!formErrors.neighborhood}
                      helperText={formErrors.neighborhood}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="CEP *"
                      value={formData.zipCode}
                      onChange={handleCEPChange}
                      error={!!formErrors.zipCode}
                      helperText={formErrors.zipCode || (loadingCEP ? 'Buscando endereço...' : '')}
                      required
                      placeholder="00000-000"
                      inputProps={{ maxLength: 9 }}
                      disabled={loadingCEP}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Cidade *"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      error={!!formErrors.city}
                      helperText={formErrors.city}
                      required
                      disabled
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      label="UF *"
                      value={formData.state}
                      onChange={(e) => handleChange('state', e.target.value.toUpperCase())}
                      error={!!formErrors.state}
                      helperText={formErrors.state}
                      required
                      inputProps={{ maxLength: 2 }}
                      disabled
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>

                  {/* Características */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mb: 2, mt: 2, fontWeight: 600 }}>
                      Características
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Área Total (m²) *"
                      value={formData.totalArea > 0 ? formatArea((Math.round(formData.totalArea * 100)).toString()) : ''}
                      onChange={handleAreaChange('totalArea')}
                      onKeyDown={(e) => {
                        // Permite apenas números e algumas teclas de controle
                        const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End']
                        const isNumber = /[0-9]/.test(e.key)
                        const isAllowedKey = allowedKeys.includes(e.key)
                        const isCtrlA = e.ctrlKey && e.key === 'a'
                        const isCtrlC = e.ctrlKey && e.key === 'c'
                        const isCtrlV = e.ctrlKey && e.key === 'v'
                        const isCtrlX = e.ctrlKey && e.key === 'x'
                        
                        if (!isNumber && !isAllowedKey && !isCtrlA && !isCtrlC && !isCtrlV && !isCtrlX) {
                          e.preventDefault()
                        }
                      }}
                      onPaste={(e) => {
                        e.preventDefault()
                        const pastedText = e.clipboardData.getData('text')
                        const cleaned = pastedText.replace(/[^\d]/g, '')
                        if (cleaned) {
                          const number = parseFloat(cleaned) / 100
                          handleChange('totalArea', number > 0 ? number : 0)
                        }
                      }}
                      error={!!formErrors.totalArea}
                      helperText={formErrors.totalArea}
                      required
                      placeholder="0,00"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">m²</InputAdornment>,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Área Construída (m²)"
                      value={formData.builtArea && formData.builtArea > 0 ? formatArea((Math.round(formData.builtArea * 100)).toString()) : ''}
                      onChange={handleAreaChange('builtArea')}
                      onKeyDown={(e) => {
                        // Permite apenas números e algumas teclas de controle
                        const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End']
                        const isNumber = /[0-9]/.test(e.key)
                        const isAllowedKey = allowedKeys.includes(e.key)
                        const isCtrlA = e.ctrlKey && e.key === 'a'
                        const isCtrlC = e.ctrlKey && e.key === 'c'
                        const isCtrlV = e.ctrlKey && e.key === 'v'
                        const isCtrlX = e.ctrlKey && e.key === 'x'
                        
                        if (!isNumber && !isAllowedKey && !isCtrlA && !isCtrlC && !isCtrlV && !isCtrlX) {
                          e.preventDefault()
                        }
                      }}
                      onPaste={(e) => {
                        e.preventDefault()
                        const pastedText = e.clipboardData.getData('text')
                        const cleaned = pastedText.replace(/[^\d]/g, '')
                        if (cleaned) {
                          const number = parseFloat(cleaned) / 100
                          handleChange('builtArea', number > 0 ? number : undefined)
                        }
                      }}
                      placeholder="0,00"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">m²</InputAdornment>,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Quartos"
                      value={formData.bedrooms || ''}
                      onChange={(e) => handleChange('bedrooms', Number(e.target.value) || 0)}
                      inputProps={{ min: 0 }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Banheiros"
                      value={formData.bathrooms || ''}
                      onChange={(e) => handleChange('bathrooms', Number(e.target.value) || 0)}
                      inputProps={{ min: 0 }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Vagas de Garagem"
                      value={formData.parkingSpaces || ''}
                      onChange={(e) => handleChange('parkingSpaces', Number(e.target.value) || 0)}
                      inputProps={{ min: 0 }}
                    />
                  </Grid>

                  {/* Valores */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mb: 2, mt: 2, fontWeight: 600 }}>
                      Valores
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Preço de Venda"
                      value={formData.salePrice ? formData.salePrice.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : ''}
                      onChange={handleCurrencyChange('salePrice')}
                      placeholder="0"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Preço de Aluguel"
                      value={formData.rentPrice ? formData.rentPrice.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : ''}
                      onChange={handleCurrencyChange('rentPrice')}
                      placeholder="0"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Condomínio"
                      value={formData.condominiumFee ? formData.condominiumFee.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : ''}
                      onChange={handleCurrencyChange('condominiumFee')}
                      placeholder="0"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="IPTU (Anual)"
                      value={formData.iptu ? formData.iptu.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : ''}
                      onChange={handleCurrencyChange('iptu')}
                      placeholder="0"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                      }}
                    />
                  </Grid>

                  {/* Características */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mb: 2, mt: 2, fontWeight: 600 }}>
                      Características da Propriedade
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {COMMON_FEATURES.map((feature) => (
                        <Chip
                          key={feature}
                          label={feature}
                          onClick={() => handleFeatureToggle(feature)}
                          color={selectedFeatures.includes(feature) ? 'primary' : 'default'}
                          variant={selectedFeatures.includes(feature) ? 'filled' : 'outlined'}
                        />
                      ))}
                    </Box>
                  </Grid>

                  {/* Botões */}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                      <Button
                        variant="outlined"
                        onClick={() => navigate('/')}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={<Save />}
                        disabled={submitLoading}
                      >
                        {submitLoading ? 'Salvando...' : 'Cadastrar Propriedade'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            )}
        </PageContent>
      </PageContainer>

      {/* Dialog de confirmação de deleção */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja deletar esta propriedade?
            <br />
            <br />
            <strong>ATENÇÃO: Esta ação é permanente e não pode ser desfeita!</strong>
            <br />
            <br />
            A propriedade será removida permanentemente do sistema e não será possível reativá-la.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleteLoading}>
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={20} /> : <DeleteIcon />}
          >
            {deleteLoading ? 'Deletando...' : 'Deletar Permanentemente'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

