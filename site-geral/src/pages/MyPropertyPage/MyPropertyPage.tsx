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
  Divider,
  Stack,
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
  CloudUpload,
  Image as ImageIcon,
  LocationOn,
  Bed,
  Bathtub,
  SquareFoot,
  LocalParking,
} from '@mui/icons-material'
import { usePublicProperty } from '../../hooks/usePublicProperty'
import { useAuth } from '../../hooks/useAuth'
import { useLocation } from '../../contexts/LocationContext'
import { PageContainer, PageHeader, PageContent } from '../../components/PageContainer'
import { CreatePropertyRequest } from '../../services/publicPropertyService'
import { getPublicPropertyImages } from '../../services/publicPropertyService'
import { formatCEP, isValidCEP, formatArea } from '../../utils/masks'
import { ImageCarousel } from '../../components/ImageCarousel'
import { formatPrice } from '../../utils/formatPrice'

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

const getTypeLabel = (type: string) => {
  const types: Record<string, string> = {
    house: "Casa",
    apartment: "Apartamento",
    commercial: "Comercial",
    land: "Terreno",
    rural: "Rural",
  };
  return types[type] || type;
};

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
  const { property, loading, error, createProperty, deleteProperty, uploadImages } = usePublicProperty()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [propertyImages, setPropertyImages] = useState<string[]>([])
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [previewImages, setPreviewImages] = useState<string[]>([])
  
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

  // Debug: verificar se propriedade está sendo carregada
  useEffect(() => {
  }, [property, loading])

  // Carregar imagens da propriedade quando ela existir
  useEffect(() => {
    if (property && property.id) {
      getPublicPropertyImages(property.id)
        .then((images: string[]) => {
          setPropertyImages(images || [])
        })
        .catch(() => {
          setPropertyImages([])
        })
    } else {
      setPropertyImages([])
    }
  }, [property])

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
    // Validação de imagens: exatamente 5 imagens
    if (selectedImages.length !== 5) {
      errors._images = 'É obrigatório adicionar exatamente 5 imagens'
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
      
      const newProperty = await createProperty(dataToSubmit)
      
      // Após criar a propriedade, fazer upload das imagens
      if (selectedImages.length > 0 && newProperty.id) {
        try {
          await uploadImages(newProperty.id, selectedImages)
        } catch (uploadErr) {
          setFormErrors({ _general: 'Propriedade criada, mas houve erro ao fazer upload das imagens. Você pode adicioná-las depois.' })
        }
      }
      
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
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return

    const files = Array.from(event.target.files)
    
    // Validar formato de arquivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    const invalidFiles = files.filter(file => !allowedTypes.includes(file.type))
    if (invalidFiles.length > 0) {
      setUploadError('Formato de arquivo não suportado. Use apenas JPEG, PNG ou WebP.')
      return
    }

    // Se já tem propriedade, fazer upload imediatamente
    if (property) {
      const totalFiles = propertyImages.length + files.length
      
      // Validar limite de 5 imagens
      if (totalFiles > 5) {
        setUploadError(`Limite de 5 imagens excedido. Você já tem ${propertyImages.length} imagem(ns) e está tentando adicionar ${files.length}.`)
        return
      }

      setUploadingImages(true)
      setUploadError(null)

      try {
        await uploadImages(property.id, files)
        // Limpar input
        event.target.value = ''
        // Recarregar imagens
        const images = await getPublicPropertyImages(property.id)
        setPropertyImages(images || [])
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : 'Erro ao fazer upload de imagens')
      } finally {
        setUploadingImages(false)
      }
    } else {
      // Se ainda não tem propriedade, apenas adicionar aos selecionados
      const newFiles = [...selectedImages, ...files]
      
      // Validar limite de 5 imagens
      if (newFiles.length > 5) {
        setUploadError(`Limite de 5 imagens. Você está tentando adicionar ${newFiles.length} imagens. Máximo permitido: 5.`)
        return
      }
      
      setSelectedImages(newFiles)
      
      // Criar previews
      files.forEach(file => {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            const preview = e.target.result as string
            setPreviewImages(prev => [...prev, preview])
          }
        }
        reader.readAsDataURL(file)
      })
      
      setUploadError(null)
      event.target.value = ''
    }
  }

  const handleRemoveImage = (index: number) => {
    if (property) {
      // Se já tem propriedade, não permite remover (seria necessário endpoint de delete)
      return
    }
    
    // Remover da lista de selecionados
    const newFiles = selectedImages.filter((_, i) => i !== index)
    setSelectedImages(newFiles)
    
    // Remover preview
    const newPreviews = previewImages.filter((_, i) => i !== index)
    setPreviewImages(newPreviews)
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, flexWrap: 'wrap', gap: 2 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                flex: { xs: '1 1 100%', sm: '0 1 auto' },
              }}
            >
              {property ? 'Minha Propriedade' : 'Cadastrar Propriedade'}
            </Typography>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/')}
              sx={{ textTransform: 'none', width: { xs: '100%', sm: 'auto' } }}
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

        <PageContent sx={{ px: { xs: 2, sm: 3, md: 0 } }}>
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
              // Visualização da propriedade existente - visualização igual à página de detalhes
              <Box>
                {/* Galeria de imagens igual à página de detalhes */}
                {propertyImages.length > 0 && (
                  <Box
                    sx={{
                      width: "100%",
                      margin: "0",
                      pt: { xs: 1, sm: 2 },
                      pb: { xs: 2, sm: 3 },
                      px: { xs: 0, sm: 0, md: 0 },
                    }}
                  >
                    <Box
                      sx={{
                        borderRadius: { xs: 2, sm: 4 },
                        overflow: "hidden",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                      }}
                    >
                      <ImageCarousel images={propertyImages} />
                    </Box>
                  </Box>
                )}

                {/* Informações da propriedade */}
                <Box
                  sx={{
                      width: "100%",
                      margin: "0",
                      pb: { xs: 2, sm: 4 },
                      px: { xs: 0, sm: 0, md: 0 },
                  }}
                >
                  <Grid container spacing={{ xs: 2, sm: 4 }}>
                    <Grid item xs={12} md={8}>
                      {/* Seção: Título e Informações Principais */}
                      <Box sx={{ mb: 5 }}>
                        <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
                          <Chip
                            label={getTypeLabel(property.type)}
                            sx={{
                              bgcolor: "#e3f2fd",
                              color: "#1976d2",
                              fontWeight: 600,
                              fontSize: "0.875rem",
                              height: 28,
                            }}
                          />
                          {property.code && (
                            <Chip
                              label={`#${property.code}`}
                              sx={{
                                bgcolor: "#f5f5f5",
                                color: "#757575",
                                fontWeight: 600,
                                fontSize: "0.875rem",
                                height: 28,
                              }}
                            />
                          )}
                        </Box>

                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: 700,
                            color: "#212121",
                            mb: 2,
                            lineHeight: 1.3,
                            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                          }}
                        >
                          {property.title}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            color: "text.secondary",
                            mb: 3,
                          }}
                        >
                          <LocationOn sx={{ color: "#1976d2", fontSize: 20 }} />
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {property.address || `${property.street || ''}${property.number ? `, ${property.number}` : ''}${property.complement ? ` - ${property.complement}` : ''}`}, {property.neighborhood}, {property.city} - {property.state}
                          </Typography>
                        </Box>

                        {/* Preços */}
                        <Box sx={{ mb: { xs: 3, sm: 4 } }}>
                          {property.salePrice && Number(property.salePrice) > 0 && (
                            <Box sx={{ mb: 2 }}>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "text.secondary",
                                  fontWeight: 600,
                                  textTransform: "uppercase",
                                  fontSize: { xs: "0.7rem", sm: "0.75rem" },
                                  display: "block",
                                  mb: 0.5,
                                }}
                              >
                                Preço de Venda
                              </Typography>
                              <Typography
                                variant="h3"
                                sx={{
                                  fontWeight: 700,
                                  color: "#1976d2",
                                  fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
                                }}
                              >
                                {formatPrice(property.salePrice)}
                              </Typography>
                            </Box>
                          )}
                          {property.rentPrice && Number(property.rentPrice) > 0 && (
                            <Box>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "text.secondary",
                                  fontWeight: 600,
                                  textTransform: "uppercase",
                                  fontSize: { xs: "0.7rem", sm: "0.75rem" },
                                  display: "block",
                                  mb: 0.5,
                                }}
                              >
                                Aluguel Mensal
                              </Typography>
                              <Typography
                                variant="h3"
                                sx={{
                                  fontWeight: 700,
                                  color: "#4caf50",
                                  fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
                                }}
                              >
                                {formatPrice(property.rentPrice)}
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        {/* Condomínio e IPTU */}
                        {(property.condominiumFee || property.iptu) && (
                          <Box sx={{ display: "flex", gap: { xs: 2, sm: 3 }, mb: { xs: 3, sm: 4 }, flexWrap: 'wrap' }}>
                            {property.condominiumFee &&
                              Number(property.condominiumFee) > 0 && (
                                <Box>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: "text.secondary",
                                      display: "block",
                                      mb: 0.5,
                                      fontWeight: 600,
                                      textTransform: "uppercase",
                                      fontSize: "0.7rem",
                                    }}
                                  >
                                    Condomínio
                                  </Typography>
                                  <Typography
                                    variant="h6"
                                    sx={{
                                      color: "#212121",
                                      fontWeight: 600,
                                    }}
                                  >
                                    {formatPrice(property.condominiumFee)}
                                  </Typography>
                                </Box>
                              )}
                            {property.iptu && Number(property.iptu) > 0 && (
                              <Box>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: "text.secondary",
                                    display: "block",
                                    mb: 0.5,
                                    fontWeight: 600,
                                    textTransform: "uppercase",
                                    fontSize: "0.7rem",
                                  }}
                                >
                                  IPTU
                                </Typography>
                                <Typography
                                  variant="h6"
                                  sx={{
                                    color: "#212121",
                                    fontWeight: 600,
                                  }}
                                >
                                  {formatPrice(property.iptu)}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        )}

                        {/* Características do Imóvel */}
                        <Box sx={{ display: "flex", gap: { xs: 2, sm: 3 }, flexWrap: "wrap", mb: { xs: 3, sm: 4 } }}>
                          {property.bedrooms > 0 && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Bed sx={{ fontSize: 28, color: "#1976d2" }} />
                              <Box>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                  {property.bedrooms}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {property.bedrooms === 1 ? "Quarto" : "Quartos"}
                                </Typography>
                              </Box>
                            </Box>
                          )}
                          {property.bathrooms > 0 && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Bathtub sx={{ fontSize: 28, color: "#1976d2" }} />
                              <Box>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                  {property.bathrooms}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {property.bathrooms === 1 ? "Banheiro" : "Banheiros"}
                                </Typography>
                              </Box>
                            </Box>
                          )}
                          {property.parkingSpaces > 0 && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <LocalParking sx={{ fontSize: 28, color: "#1976d2" }} />
                              <Box>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                  {property.parkingSpaces}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {property.parkingSpaces === 1 ? "Vaga" : "Vagas"}
                                </Typography>
                              </Box>
                            </Box>
                          )}
                          {property.totalArea && Number(property.totalArea) > 0 && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <SquareFoot sx={{ fontSize: 28, color: "#1976d2" }} />
                              <Box>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                  {formatArea(String(property.totalArea))}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Área Total
                                </Typography>
                              </Box>
                            </Box>
                          )}
                          {property.builtArea && Number(property.builtArea) > 0 && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <SquareFoot sx={{ fontSize: 28, color: "#1976d2" }} />
                              <Box>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                  {formatArea(String(property.builtArea))}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Área Construída
                                </Typography>
                              </Box>
                            </Box>
                          )}
                        </Box>

                        {/* Descrição */}
                        <Divider sx={{ my: { xs: 3, sm: 4 } }} />
                        <Box sx={{ mb: { xs: 3, sm: 5 } }}>
                          <Typography
                            variant="h5"
                            sx={{
                              fontWeight: 700,
                              color: "#212121",
                              mb: 2,
                              fontSize: { xs: '1.25rem', sm: '1.5rem' },
                            }}
                          >
                            Descrição
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              whiteSpace: "pre-line",
                              lineHeight: 1.8,
                              color: "#424242",
                              fontSize: "1rem",
                            }}
                          >
                            {property.description || "Sem descrição disponível."}
                          </Typography>
                        </Box>

                        {/* Features */}
                        {property.features && property.features.length > 0 && (
                          <>
                            <Divider sx={{ my: { xs: 3, sm: 4 } }} />
                            <Box sx={{ mb: { xs: 3, sm: 5 } }}>
                              <Typography
                                variant="h5"
                                sx={{
                                  fontWeight: 700,
                                  color: "#212121",
                                  mb: 2,
                                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                                }}
                              >
                                Características
                              </Typography>
                              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                {property.features.map((feature: string, index: number) => (
                                  <Chip
                                    key={index}
                                    label={feature}
                                    sx={{
                                      bgcolor: "white",
                                      border: "1px solid #e0e0e0",
                                      color: "#212121",
                                      fontWeight: 500,
                                      fontSize: "0.875rem",
                                      height: 32,
                                    }}
                                  />
                                ))}
                              </Box>
                            </Box>
                          </>
                        )}

                        <Divider sx={{ my: { xs: 3, sm: 4 } }} />

                        {/* Informações Adicionais */}
                        <Box>
                          <Typography
                            variant="h5"
                            sx={{
                              fontWeight: 700,
                              color: "#212121",
                              mb: { xs: 2, sm: 3 },
                              fontSize: { xs: '1.25rem', sm: '1.5rem' },
                            }}
                          >
                            Informações Adicionais
                          </Typography>
                          <Stack spacing={2}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 2,
                                py: 1,
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "text.secondary",
                                  fontWeight: 600,
                                  minWidth: 120,
                                }}
                              >
                                Status:
                              </Typography>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {property.status === "available"
                                  ? "Disponível"
                                  : property.status === "rented"
                                  ? "Alugado"
                                  : property.status === "sold"
                                  ? "Vendido"
                                  : property.status}
                              </Typography>
                            </Box>
                            {property.totalArea && Number(property.totalArea) > 0 && (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  gap: 2,
                                  py: 1,
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: "text.secondary",
                                    fontWeight: 600,
                                    minWidth: 120,
                                  }}
                                >
                                  Área Total:
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                  {formatArea(String(property.totalArea))}
                                </Typography>
                              </Box>
                            )}
                            {property.builtArea && Number(property.builtArea) > 0 && (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  gap: 2,
                                  py: 1,
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: "text.secondary",
                                    fontWeight: 600,
                                    minWidth: 120,
                                  }}
                                >
                                  Área Construída:
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                  {formatArea(String(property.builtArea))}
                                </Typography>
                              </Box>
                            )}
                            {property.bedrooms > 0 && (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  gap: 2,
                                  py: 1,
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: "text.secondary",
                                    fontWeight: 600,
                                    minWidth: 120,
                                  }}
                                >
                                  Quartos:
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                  {property.bedrooms}
                                </Typography>
                              </Box>
                            )}
                            {property.bathrooms > 0 && (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  gap: 2,
                                  py: 1,
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: "text.secondary",
                                    fontWeight: 600,
                                    minWidth: 120,
                                  }}
                                >
                                  Banheiros:
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                  {property.bathrooms}
                                </Typography>
                              </Box>
                            )}
                            {property.parkingSpaces > 0 && (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  gap: 2,
                                  py: 1,
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: "text.secondary",
                                    fontWeight: 600,
                                    minWidth: 120,
                                  }}
                                >
                                  Vagas:
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                  {property.parkingSpaces}
                                </Typography>
                              </Box>
                            )}
                          </Stack>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                {/* Upload de imagens */}
                {propertyImages.length < 5 && (
                  <Box sx={{ mb: { xs: 2, sm: 3 }, px: { xs: 0, sm: 0, md: 0 }, width: "100%", margin: "0" }}>
                    {uploadError && (
                      <Alert severity="error" sx={{ mb: 2 }}>
                        {uploadError}
                      </Alert>
                    )}
                    <input
                      accept="image/jpeg,image/png,image/webp"
                      style={{ display: 'none' }}
                      id="image-upload"
                      type="file"
                      multiple
                      onChange={handleImageUpload}
                      disabled={uploadingImages || (propertyImages.length >= 5)}
                    />
                    <label htmlFor="image-upload">
                      <Button
                        component="span"
                        variant="outlined"
                        startIcon={uploadingImages ? <CircularProgress size={20} /> : <CloudUpload />}
                        disabled={uploadingImages || (propertyImages.length >= 5)}
                        sx={{ mb: 2 }}
                      >
                        {uploadingImages ? 'Enviando...' : 'Adicionar Imagens'}
                      </Button>
                    </label>
                    <Typography variant="caption" display="block" color="text.secondary">
                      {propertyImages.length} de 5 imagens adicionadas. É obrigatório ter exatamente 5 imagens. Formatos aceitos: JPEG, PNG, WebP
                    </Typography>
                  </Box>
                )}
                {propertyImages.length > 0 && propertyImages.length < 5 && (
                  <Alert severity="warning" sx={{ mb: 2, mx: { xs: 0, sm: 0, md: 0 }, width: "100%", margin: "0" }}>
                    Você precisa adicionar mais {5 - propertyImages.length} imagem(ns) para completar o mínimo de 5 imagens.
                  </Alert>
                )}

                {/* Botão de deletar */}
                <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'stretch', sm: 'flex-end' }, px: { xs: 0, sm: 0, md: 0 }, width: "100%", margin: "0" }}>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleDeleteClick}
                    sx={{ width: { xs: '100%', sm: 'auto' } }}
                  >
                    Deletar Propriedade
                  </Button>
                </Box>
              </Box>
            ) : (
              // Formulário de criação
              <form onSubmit={handleSubmit}>
                <Grid container spacing={{ xs: 2, sm: 3 }}>
                  {/* Informações Básicas */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mb: { xs: 1.5, sm: 2 }, fontWeight: 600, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
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
                    <Typography variant="h6" sx={{ mb: { xs: 1.5, sm: 2 }, mt: { xs: 1.5, sm: 2 }, fontWeight: 600, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
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
                    <Typography variant="h6" sx={{ mb: { xs: 1.5, sm: 2 }, mt: { xs: 1.5, sm: 2 }, fontWeight: 600, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
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
                    <Typography variant="h6" sx={{ mb: { xs: 1.5, sm: 2 }, mt: { xs: 1.5, sm: 2 }, fontWeight: 600, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
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
                    <Typography variant="h6" sx={{ mb: { xs: 1.5, sm: 2 }, mt: { xs: 1.5, sm: 2 }, fontWeight: 600, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                      Características da Propriedade
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 0.75, sm: 1 } }}>
                      {COMMON_FEATURES.map((feature: string) => (
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

                  {/* Imagens */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mb: { xs: 1.5, sm: 2 }, mt: { xs: 1.5, sm: 2 }, fontWeight: 600, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                      Imagens da Propriedade *
                    </Typography>
                    
                    {formErrors._images && (
                      <Alert severity="error" sx={{ mb: 2 }}>
                        {formErrors._images}
                      </Alert>
                    )}

                    {uploadError && (
                      <Alert severity="error" sx={{ mb: 2 }}>
                        {uploadError}
                      </Alert>
                    )}

                    {/* Preview das imagens selecionadas */}
                    {previewImages.length > 0 && (
                      <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: { xs: 2, sm: 3 } }}>
                        {previewImages.map((previewUrl, index) => (
                          <Grid item xs={12} sm={6} md={4} key={index}>
                            <Box
                              sx={{
                                position: 'relative',
                                width: '100%',
                                paddingTop: '75%', // Aspect ratio 4:3
                                overflow: 'hidden',
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: 'divider',
                                bgcolor: 'background.paper',
                              }}
                            >
                              <img
                                src={previewUrl}
                                alt={`Preview ${index + 1}`}
                                style={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                }}
                              />
                              <Button
                                size="small"
                                color="error"
                                onClick={() => handleRemoveImage(index)}
                                sx={{
                                  position: 'absolute',
                                  top: 8,
                                  right: 8,
                                  minWidth: 'auto',
                                  width: 32,
                                  height: 32,
                                  borderRadius: '50%',
                                  bgcolor: 'error.main',
                                  color: 'white',
                                  '&:hover': {
                                    bgcolor: 'error.dark',
                                  },
                                }}
                              >
                                ×
                              </Button>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    )}

                    {/* Upload de imagens */}
                    {selectedImages.length === 0 ? (
                      // Área de drop quando não há imagens
                      <Box
                        sx={{
                          textAlign: 'center',
                          py: 4,
                          border: '2px dashed',
                          borderColor: 'divider',
                          borderRadius: 2,
                          mb: 3,
                        }}
                      >
                        <ImageIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          Nenhuma imagem adicionada ainda
                        </Typography>
                        <input
                          accept="image/jpeg,image/png,image/webp"
                          style={{ display: 'none' }}
                          id="image-upload-create-empty"
                          type="file"
                          multiple
                          onChange={handleImageUpload}
                        />
                        <label htmlFor="image-upload-create-empty">
                          <Button
                            component="span"
                            variant="outlined"
                            startIcon={<CloudUpload />}
                          >
                            Adicionar Imagens
                          </Button>
                        </label>
                        <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 2 }}>
                          É obrigatório adicionar exatamente 5 imagens. Formatos aceitos: JPEG, PNG, WebP
                        </Typography>
                      </Box>
                    ) : selectedImages.length < 5 ? (
                      // Botão para adicionar mais quando já tem algumas mas não completou
                      <Box>
                        <input
                          accept="image/jpeg,image/png,image/webp"
                          style={{ display: 'none' }}
                          id="image-upload-create"
                          type="file"
                          multiple
                          onChange={handleImageUpload}
                          disabled={selectedImages.length >= 5}
                        />
                        <label htmlFor="image-upload-create">
                          <Button
                            component="span"
                            variant="outlined"
                            startIcon={<CloudUpload />}
                            disabled={selectedImages.length >= 5}
                            sx={{ mb: 2 }}
                          >
                            Adicionar Mais Imagens
                          </Button>
                        </label>
                        <Typography variant="caption" display="block" color="text.secondary">
                          {selectedImages.length} de 5 imagens adicionadas. É obrigatório adicionar exatamente 5 imagens. Formatos aceitos: JPEG, PNG, WebP
                        </Typography>
                      </Box>
                    ) : null}
                  </Grid>

                  {/* Botões */}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: { xs: 1.5, sm: 2 }, justifyContent: { xs: 'stretch', sm: 'flex-end' }, mt: { xs: 1.5, sm: 2 }, flexDirection: { xs: 'column', sm: 'row' } }}>
                      <Button
                        variant="outlined"
                        onClick={() => navigate('/')}
                        sx={{ width: { xs: '100%', sm: 'auto' } }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={<Save />}
                        disabled={submitLoading}
                        sx={{ width: { xs: '100%', sm: 'auto' } }}
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

