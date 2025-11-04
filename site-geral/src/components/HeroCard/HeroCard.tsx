import { useState } from 'react'
import { 
  Button, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  SelectChangeEvent,
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Checkbox,
  FormControlLabel,
  Alert,
  Snackbar
} from '@mui/material'
import styled, { keyframes } from 'styled-components'
import { Search, AttachMoney, FilterList, Close, LocalParking, Star } from '@mui/icons-material'
import { formatCurrency, formatNumber } from '../../utils/masks'
import { useLocation } from '../../contexts/LocationContext'
import { searchProperties, PropertySearchFilters } from '../../services/propertyService'
import { NeighborhoodSelect } from '../NeighborhoodSelect'

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const CardContainer = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  width: 100%;
  max-width: 500px;
  animation: ${fadeIn} 1s ease-out forwards;
  animation-delay: 0.5s;
  opacity: 0;
  backdrop-filter: blur(25px) saturate(200%) brightness(1.1);
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(255, 255, 255, 0.85) 100%
  );
  border: 2px solid rgba(255, 255, 255, 0.5);
  position: relative;
  overflow: hidden;

  /* Filtros modernos - gradiente sutil com múltiplas camadas */
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
      rgba(255, 255, 255, 0.15) 30%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0.15) 70%,
      rgba(51, 112, 166, 0.08) 100%
    );
    z-index: 0;
    pointer-events: none;
  }

  /* Efeito de brilho rotativo mais intenso */
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(51, 112, 166, 0.15) 0%,
      rgba(139, 180, 217, 0.1) 40%,
      transparent 70%
    );
    animation: rotate 25s linear infinite;
    z-index: 0;
    pointer-events: none;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /* Conteúdo acima dos filtros */
  > * {
    position: relative;
    z-index: 1;
  }

  /* Efeito de hover adicional */
  &:hover {
    backdrop-filter: blur(30px) saturate(220%) brightness(1.15);
    transform: translateY(-4px);
    transition: all 0.3s ease;
    box-shadow: ${({ theme }) => theme.shadows.xl}, 0 0 30px rgba(51, 112, 166, 0.2);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.xl};
    max-width: 100%;
    backdrop-filter: blur(20px) saturate(200%) brightness(1.1);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.lg};
    border-radius: ${({ theme }) => theme.borderRadius.md};
  }
`

const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.25rem;
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
`

const CardSubtitle = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  line-height: 1.6;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 0.9rem;
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
`

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

const StyledButton = styled(Button)`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  font-size: 1rem;
  font-weight: 600;
  text-transform: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
`

const PROPERTY_TYPES = [
  { value: '', label: 'Todos os tipos' },
  { value: 'casa', label: 'Casa' },
  { value: 'apartamento', label: 'Apartamento' },
  { value: 'terreno', label: 'Terreno' },
  { value: 'comercial', label: 'Comercial' },
  { value: 'rural', label: 'Rural' },
]

const BEDROOMS = [
  { value: '', label: 'Qualquer' },
  { value: '1', label: '1+' },
  { value: '2', label: '2+' },
  { value: '3', label: '3+' },
  { value: '4', label: '4+' },
  { value: '5', label: '5+' },
]

const BATHROOMS = [
  { value: '', label: 'Qualquer' },
  { value: '1', label: '1+' },
  { value: '2', label: '2+' },
  { value: '3', label: '3+' },
  { value: '4', label: '4+' },
  { value: '5', label: '5+' },
]

const PARKING_SPACES = [
  { value: '', label: 'Qualquer' },
  { value: '1', label: '1+' },
  { value: '2', label: '2+' },
  { value: '3', label: '3+' },
  { value: '4', label: '4+' },
  { value: '5', label: '5+' },
]

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

const StyledSelect = styled(FormControl)`
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

const PriceContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`

const AreaContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`

const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`

const DrawerContent = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`

const DrawerActions = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`

interface HeroCardProps {
  onSearch?: (filters: PropertySearchFilters) => void
}

interface SearchErrorState {
  show: boolean
  message: string
}

// Características comuns disponíveis
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
]

export const HeroCard = ({ onSearch }: HeroCardProps) => {
  const { location } = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [propertyType, setPropertyType] = useState('')
  const [operation, setOperation] = useState<'sale' | 'rent' | 'both'>('both')
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [bedrooms, setBedrooms] = useState('')
  const [bathrooms, setBathrooms] = useState('')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [areaMin, setAreaMin] = useState('')
  const [areaMax, setAreaMax] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const [parkingSpaces, setParkingSpaces] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<SearchErrorState>({ show: false, message: '' })

  const handlePropertyTypeChange = (event: SelectChangeEvent<string>) => {
    setPropertyType(event.target.value)
  }

  const handleBedroomsChange = (event: SelectChangeEvent<string>) => {
    setBedrooms(event.target.value)
  }

  const handleBathroomsChange = (event: SelectChangeEvent<string>) => {
    setBathrooms(event.target.value)
  }

  const handleParkingSpacesChange = (event: SelectChangeEvent<string>) => {
    setParkingSpaces(event.target.value)
  }

  const handleNeighborhoodChange = (value: string) => {
    setNeighborhood(value)
  }

  const handleFeaturedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsFeatured(event.target.checked)
  }

  const handleOperationChange = (event: SelectChangeEvent<string>) => {
    setOperation(event.target.value as 'sale' | 'rent' | 'both')
  }

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    )
  }

  const handlePriceMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    // Remove tudo que não é número
    const numericValue = value.replace(/\D/g, '')
    
    if (!numericValue) {
      setPriceMin('')
      return
    }
    
    // Formata como moeda
    const formatted = formatCurrency(numericValue)
    setPriceMin(formatted)
  }

  const handlePriceMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    // Remove tudo que não é número
    const numericValue = value.replace(/\D/g, '')
    
    if (!numericValue) {
      setPriceMax('')
      return
    }
    
    // Formata como moeda
    const formatted = formatCurrency(numericValue)
    setPriceMax(formatted)
  }

  const handleAreaMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    // Remove tudo que não é número
    const numericValue = value.replace(/\D/g, '')
    
    if (!numericValue) {
      setAreaMin('')
      return
    }
    
    // Formata com separador de milhar
    const formatted = formatNumber(numericValue)
    setAreaMin(formatted)
  }

  const handleAreaMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    // Remove tudo que não é número
    const numericValue = value.replace(/\D/g, '')
    
    if (!numericValue) {
      setAreaMax('')
      return
    }
    
    // Formata com separador de milhar
    const formatted = formatNumber(numericValue)
    setAreaMax(formatted)
  }

  const handleSearch = async () => {
    if (!location?.city) {
      setError({ show: true, message: 'Por favor, selecione sua localização primeiro' })
      setTimeout(() => setError({ show: false, message: '' }), 5000)
      return
    }

    // Validação de preço min/max
    const minPriceValue = priceMin ? parseInt(priceMin.replace(/\D/g, '')) : undefined
    const maxPriceValue = priceMax ? parseInt(priceMax.replace(/\D/g, '')) : undefined
    
    if (minPriceValue !== undefined && maxPriceValue !== undefined && maxPriceValue < minPriceValue) {
      setError({ show: true, message: 'O preço máximo não pode ser menor que o preço mínimo' })
      setTimeout(() => setError({ show: false, message: '' }), 5000)
      return
    }

    // Validação de área min/max
    const minAreaValue = areaMin ? parseInt(areaMin.replace(/\D/g, '')) : undefined
    const maxAreaValue = areaMax ? parseInt(areaMax.replace(/\D/g, '')) : undefined
    
    if (minAreaValue !== undefined && maxAreaValue !== undefined && maxAreaValue < minAreaValue) {
      setError({ show: true, message: 'A área máxima não pode ser menor que a área mínima' })
      setTimeout(() => setError({ show: false, message: '' }), 5000)
      return
    }

    setLoading(true)
    setError({ show: false, message: '' })

    try {
      // Converte os valores formatados para números
      const filters: PropertySearchFilters = {
        city: location.city,
        // Tipo de imóvel
        type:
          propertyType === 'casa'
            ? 'house'
            : propertyType === 'apartamento'
              ? 'apartment'
              : propertyType === 'comercial'
                ? 'commercial'
                : propertyType === 'terreno'
                  ? 'land'
                  : propertyType === 'rural'
                    ? 'rural'
                    : undefined,
        // Nova funcionalidade: Filtro por operação (venda/aluguel)
        operation: operation !== 'both' ? operation : undefined,
        // Nova funcionalidade: Características selecionadas
        features: selectedFeatures.length > 0 ? selectedFeatures : undefined,
        bedrooms: bedrooms ? parseInt(bedrooms) : undefined,
        bathrooms: bathrooms ? parseInt(bathrooms) : undefined,
        parkingSpaces: parkingSpaces ? parseInt(parkingSpaces) : undefined,
        neighborhood: neighborhood || undefined,
        isFeatured: isFeatured || undefined,
        minPrice: minPriceValue,
        maxPrice: maxPriceValue,
        minArea: minAreaValue,
        maxArea: maxAreaValue,
        page: 1,
        limit: 20,
      }

      // Passa os filtros para o componente pai (HomePage) que atualizará a PropertyList
      if (onSearch) {
        onSearch(filters)
      }
      
      // Fechar o drawer quando a busca for acionada
      setDrawerOpen(false)
      
      // Resetar loading após um pequeno delay para garantir que a busca foi processada
      setTimeout(() => {
        setLoading(false)
      }, 100)
    } catch (error) {
      setError({ show: true, message: 'Erro ao buscar propriedades. Tente novamente.' })
      setTimeout(() => setError({ show: false, message: '' }), 5000)
      setLoading(false)
    }
  }

  const handleClearFilters = () => {
    setBedrooms('')
    setBathrooms('')
    setParkingSpaces('')
    setNeighborhood('')
    setIsFeatured(false)
    setAreaMin('')
    setAreaMax('')
    setOperation('both')
    setSelectedFeatures([])
  }

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open)
  }

  return (
    <CardContainer>
      <CardTitle>Buscar Imóveis</CardTitle>
      <CardSubtitle>
        Encontre o imóvel perfeito na localização que você deseja
      </CardSubtitle>
      
      <SearchContainer>
        <StyledSelect fullWidth variant="outlined">
          <InputLabel>Tipo de Operação</InputLabel>
          <Select
            value={operation}
            onChange={handleOperationChange}
            label="Tipo de Operação"
            sx={{
              textTransform: 'none',
            }}
          >
            <MenuItem value="both">Venda e Aluguel</MenuItem>
            <MenuItem value="sale">Apenas Venda</MenuItem>
            <MenuItem value="rent">Apenas Aluguel</MenuItem>
          </Select>
        </StyledSelect>

        <StyledSelect fullWidth variant="outlined">
          <InputLabel>Tipo de Imóvel</InputLabel>
          <Select
            value={propertyType}
            onChange={handlePropertyTypeChange}
            label="Tipo de Imóvel"
            sx={{
              textTransform: 'none',
            }}
          >
            {PROPERTY_TYPES.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
        </StyledSelect>

        <PriceContainer>
          <StyledTextField
            fullWidth
            variant="outlined"
            label="Preço Mínimo"
            value={priceMin}
            onChange={handlePriceMinChange}
            placeholder="R$ 0"
            InputProps={{
              startAdornment: <AttachMoney sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
          <StyledTextField
            fullWidth
            variant="outlined"
            label="Preço Máximo"
            value={priceMax}
            onChange={handlePriceMaxChange}
            placeholder="R$ 0"
            InputProps={{
              startAdornment: <AttachMoney sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </PriceContainer>

        <Button
          variant="outlined"
          startIcon={<FilterList />}
          fullWidth
          onClick={toggleDrawer(true)}
          sx={{
            textTransform: 'none',
            padding: '12px',
            justifyContent: 'flex-start',
            borderColor: '#e0e0e0',
            color: '#212121',
            borderRadius: '8px',
          }}
        >
          Filtros Avançados
        </Button>
      </SearchContainer>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: '400px' },
            backdropFilter: 'blur(20px) saturate(200%)',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%)',
          },
        }}
      >
        <DrawerHeader>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Filtros Avançados
          </Typography>
          <IconButton onClick={toggleDrawer(false)}>
            <Close />
          </IconButton>
        </DrawerHeader>
        <Divider />
        
        <DrawerContent>
          <StyledSelect fullWidth variant="outlined">
            <InputLabel>Quartos</InputLabel>
            <Select
              value={bedrooms}
              onChange={handleBedroomsChange}
              label="Quartos"
              sx={{
                textTransform: 'none',
              }}
            >
              {BEDROOMS.map((bed) => (
                <MenuItem key={bed.value} value={bed.value}>
                  {bed.label}
                </MenuItem>
              ))}
            </Select>
          </StyledSelect>

          <StyledSelect fullWidth variant="outlined">
            <InputLabel>Banheiros</InputLabel>
            <Select
              value={bathrooms}
              onChange={handleBathroomsChange}
              label="Banheiros"
              sx={{
                textTransform: 'none',
              }}
            >
              {BATHROOMS.map((bath) => (
                <MenuItem key={bath.value} value={bath.value}>
                  {bath.label}
                </MenuItem>
              ))}
            </Select>
          </StyledSelect>

          <StyledSelect fullWidth variant="outlined">
            <InputLabel>Vagas</InputLabel>
            <Select
              value={parkingSpaces}
              onChange={handleParkingSpacesChange}
              label="Vagas"
              sx={{
                textTransform: 'none',
              }}
            >
              {PARKING_SPACES.map((parking) => (
                <MenuItem key={parking.value} value={parking.value}>
                  {parking.label}
                </MenuItem>
              ))}
            </Select>
          </StyledSelect>

          <NeighborhoodSelect
            city={location?.city}
            value={neighborhood}
            onChange={handleNeighborhoodChange}
            label="Bairro"
            placeholder="Selecione um bairro"
            minCount={1}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={isFeatured}
                onChange={handleFeaturedChange}
                icon={<Star fontSize="small" />}
                checkedIcon={<Star fontSize="small" color="primary" />}
              />
            }
            label="Apenas propriedades em destaque"
          />

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
              Características
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {COMMON_FEATURES.map((feature) => (
                <FormControlLabel
                  key={feature}
                  control={
                    <Checkbox
                      checked={selectedFeatures.includes(feature)}
                      onChange={() => handleFeatureToggle(feature)}
                      size="small"
                    />
                  }
                  label={feature}
                />
              ))}
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
              Área (m²)
            </Typography>
            <AreaContainer>
              <StyledTextField
                fullWidth
                variant="outlined"
                label="Área Mínima"
                value={areaMin}
                onChange={handleAreaMinChange}
                placeholder="0"
              />
              <StyledTextField
                fullWidth
                variant="outlined"
                label="Área Máxima"
                value={areaMax}
                onChange={handleAreaMaxChange}
                placeholder="0"
              />
            </AreaContainer>
          </Box>
        </DrawerContent>

        <Divider />
        <DrawerActions>
          <Button
            variant="outlined"
            onClick={handleClearFilters}
            fullWidth
            sx={{ textTransform: 'none' }}
          >
            Limpar Filtros
          </Button>
          <Button
            variant="contained"
            onClick={toggleDrawer(false)}
            fullWidth
            sx={{ textTransform: 'none' }}
          >
            Aplicar Filtros
          </Button>
        </DrawerActions>
      </Drawer>

      <StyledButton 
        variant="contained" 
        color="primary" 
        startIcon={<Search />}
        onClick={handleSearch}
        fullWidth
        disabled={loading || !location?.city}
      >
        {loading ? 'Buscando...' : 'Buscar Imóveis'}
      </StyledButton>

      <Snackbar
        open={error.show}
        autoHideDuration={5000}
        onClose={() => setError({ show: false, message: '' })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setError({ show: false, message: '' })} 
          severity="warning" 
          sx={{ width: '100%' }}
        >
          {error.message}
        </Alert>
      </Snackbar>
    </CardContainer>
  )
}

