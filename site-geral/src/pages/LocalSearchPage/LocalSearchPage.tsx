import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Typography, Breadcrumbs, Link } from '@mui/material'
import { Home as HomeIcon } from '@mui/icons-material'
import { PropertyList } from '../../components/PropertyList'
import { PropertySearchFilters } from '../../services/propertyService'
import { useLocation } from '../../contexts/LocationContext'
import { usePageTitle } from '../../hooks'
import { PageContainer, PageHeader } from '../../components/PageContainer'
import { MainContentWrapper } from '../../components/MainContentWrapper'

// Mapeamento de tipos de imóvel
const propertyTypeMap: Record<string, { type: 'house' | 'apartment' | 'commercial' | 'land' | undefined; label: string }> = {
  'casas': { type: 'house', label: 'Casas' },
  'casa': { type: 'house', label: 'Casas' },
  'apartamentos': { type: 'apartment', label: 'Apartamentos' },
  'apartamento': { type: 'apartment', label: 'Apartamentos' },
  'imoveis-comerciais': { type: 'commercial', label: 'Imóveis Comerciais' },
  'comerciais': { type: 'commercial', label: 'Imóveis Comerciais' },
  'terrenos': { type: 'land', label: 'Terrenos' },
  'terreno': { type: 'land', label: 'Terrenos' },
}

// Mapeamento de operações
const operationMap: Record<string, { operation: 'sale' | 'rent' | undefined; label: string }> = {
  'a-venda': { operation: 'sale', label: 'à Venda' },
  'venda': { operation: 'sale', label: 'à Venda' },
  'para-alugar': { operation: 'rent', label: 'para Locação' },
  'alugar': { operation: 'rent', label: 'para Locação' },
  'aluguel': { operation: 'rent', label: 'para Locação' },
  'locacao': { operation: 'rent', label: 'para Locação' },
}

// Converter nome normalizado de volta para formato legível
// Trata casos especiais como "rio-de-janeiro", "sao-paulo", etc.
const formatCityName = (normalized: string): string => {
  // Mapeamento de cidades conhecidas para garantir nomes corretos
  const cityMap: Record<string, string> = {
    'sao-paulo': 'São Paulo',
    'rio-de-janeiro': 'Rio de Janeiro',
    'belo-horizonte': 'Belo Horizonte',
    'porto-alegre': 'Porto Alegre',
    'brasilia': 'Brasília',
    'salvador': 'Salvador',
    'curitiba': 'Curitiba',
    'recife': 'Recife',
    'fortaleza': 'Fortaleza',
    'manaus': 'Manaus',
    'belem': 'Belém',
    'goiania': 'Goiânia',
    'campinas': 'Campinas',
    'sao-luis': 'São Luís',
    'sao-goncalo': 'São Gonçalo',
    'maceio': 'Maceió',
    'duque-de-caxias': 'Duque de Caxias',
    'natal': 'Natal',
    'teresina': 'Teresina',
    'sao-bernardo-do-campo': 'São Bernardo do Campo',
    'nova-iguacu': 'Nova Iguaçu',
    'joao-pessoa': 'João Pessoa',
    'santo-andre': 'Santo André',
    'osasco': 'Osasco',
    'jaboatao-dos-guararapes': 'Jaboatão dos Guararapes',
    'sao-jose-dos-campos': 'São José dos Campos',
    'ribeirao-preto': 'Ribeirão Preto',
    'uberlandia': 'Uberlândia',
    'sorocaba': 'Sorocaba',
    'contagem': 'Contagem',
    'aracaju': 'Aracaju',
    'feira-de-santana': 'Feira de Santana',
    'cuiaba': 'Cuiabá',
    'joinville': 'Joinville',
    'apucarana': 'Apucarana',
    'londrina': 'Londrina',
    'juiz-de-fora': 'Juiz de Fora',
    'anapolis': 'Anápolis',
    'serra': 'Serra',
    'niteroi': 'Niterói',
    'campos-dos-goytacazes': 'Campos dos Goytacazes',
    'vila-velha': 'Vila Velha',
    'caxias-do-sul': 'Caxias do Sul',
    'florianopolis': 'Florianópolis',
    'macapa': 'Macapá',
    'vitoria': 'Vitória',
    'rio-branco': 'Rio Branco',
    'porto-velho': 'Porto Velho',
    'boa-vista': 'Boa Vista',
    'palmas': 'Palmas',
  }
  
  // Verificar se há mapeamento direto
  const lowerSlug = normalized.toLowerCase()
  if (cityMap[lowerSlug]) {
    return cityMap[lowerSlug]
  }
  
  // Se não houver mapeamento, capitalizar palavras
  return normalized
    .split('-')
    .map(word => {
      // Tratar palavras especiais
      if (word === 'de' || word === 'da' || word === 'do' || word === 'dos' || word === 'das') {
        return word
      }
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

export const LocalSearchPage = () => {
  const { citySlug, typeSlug, operationSlug } = useParams<{
    citySlug: string
    typeSlug?: string
    operationSlug?: string
  }>()
  const navigate = useNavigate()
  const { location } = useLocation()
  
  const [cityName, setCityName] = useState<string>('')
  const [filters, setFilters] = useState<Omit<PropertySearchFilters, 'city' | 'state' | 'page' | 'limit'> | undefined>(undefined)

  // Decodificar cidade da URL
  useEffect(() => {
    if (citySlug) {
      // Normalizar o slug para comparação
      const normalizedSlug = citySlug.toLowerCase().replace(/-/g, ' ')
      
      // Tentar usar a localização atual se corresponder ao slug
      if (location?.city) {
        const normalizedCurrentCity = location.city
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, ' ')
          .trim()
        
        // Verificar se o slug corresponde à cidade atual (com tolerância)
        if (normalizedCurrentCity === normalizedSlug || 
            normalizedCurrentCity.includes(normalizedSlug) ||
            normalizedSlug.includes(normalizedCurrentCity)) {
          setCityName(location.city)
          return
        }
      }
      
      // Se não corresponder, usar o formato capitalizado do slug
      // Isso funciona para QUALQUER cidade do Brasil
      const decodedCity = formatCityName(citySlug)
      setCityName(decodedCity)
    }
  }, [citySlug, location])

  // Configurar filtros baseados na URL
  useEffect(() => {
    if (citySlug) {
      const newFilters: Partial<Omit<PropertySearchFilters, 'city' | 'state' | 'page' | 'limit'>> = {}
      
      // Tipo de imóvel
      if (typeSlug && propertyTypeMap[typeSlug]) {
        const typeInfo = propertyTypeMap[typeSlug]
        newFilters.type = typeInfo.type
      }
      
      // Operação (venda ou locação)
      if (operationSlug && operationMap[operationSlug]) {
        const opInfo = operationMap[operationSlug]
        newFilters.search = opInfo.operation === 'sale' ? 'sale' : 'rent'
      }
      
      setFilters(newFilters)
    }
  }, [citySlug, typeSlug, operationSlug])

  // Gerar título e descrição otimizados para SEO
  const getPageTitle = () => {
    const parts: string[] = []
    
    if (typeSlug && propertyTypeMap[typeSlug]) {
      parts.push(propertyTypeMap[typeSlug].label)
    } else {
      parts.push('Imóveis')
    }
    
    if (operationSlug && operationMap[operationSlug]) {
      parts.push(operationMap[operationSlug].label)
    }
    
    if (cityName) {
      parts.push(`em ${cityName}`)
    }
    
    return `${parts.join(' ')} - Dream Keys`
  }

  const getPageDescription = () => {
    const parts: string[] = []
    
    if (typeSlug && propertyTypeMap[typeSlug]) {
      parts.push(propertyTypeMap[typeSlug].label.toLowerCase())
    } else {
      parts.push('imóveis')
    }
    
    if (operationSlug && operationMap[operationSlug]) {
      parts.push(operationMap[operationSlug].label.toLowerCase())
    }
    
    if (cityName) {
      parts.push(`em ${cityName}`)
    }
    
    return `Encontre ${parts.join(' ')}. ${parts[0].charAt(0).toUpperCase() + parts[0].slice(1)} com os melhores preços e condições em ${cityName || 'sua cidade'}.`
  }

  // Usar hook de SEO
  const pageTitle = getPageTitle()
  const pageDescription = getPageDescription()
  
  usePageTitle(pageTitle, pageDescription)

  // Adicionar dados estruturados locais para SEO
  useEffect(() => {
    if (!cityName) return

    const schemaLocalBusiness = {
      '@context': 'https://schema.org',
      '@type': 'RealEstateAgent',
      name: 'Dream Keys',
      description: pageDescription,
      url: `https://www.dreamkeys.com.br/${citySlug}`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: cityName,
        addressRegion: location?.state || '',
        addressCountry: 'BR',
      },
      areaServed: {
        '@type': 'City',
        name: cityName,
      },
      serviceType: typeSlug && propertyTypeMap[typeSlug] 
        ? propertyTypeMap[typeSlug].label 
        : 'Imóveis',
    }

    // Remover schema anterior se existir
    const existingSchema = document.querySelector('script[data-schema="local-business"]')
    if (existingSchema) {
      existingSchema.remove()
    }

    // Adicionar novo schema
    const schemaScript = document.createElement('script')
    schemaScript.setAttribute('type', 'application/ld+json')
    schemaScript.setAttribute('data-schema', 'local-business')
    schemaScript.textContent = JSON.stringify(schemaLocalBusiness)
    document.head.appendChild(schemaScript)

    return () => {
      const script = document.querySelector('script[data-schema="local-business"]')
      if (script) {
        script.remove()
      }
    }
  }, [cityName, citySlug, location?.state, pageDescription, typeSlug])

  // Se não há cidade na URL, redirecionar para home
  if (!citySlug) {
    navigate('/')
    return null
  }

  // Se não há localização definida, usar a cidade da URL
  const effectiveCity = location?.city || cityName

  return (
    <MainContentWrapper $showBackground={false} style={{ paddingTop: '50px' }}>
      <PageContainer>
        <Box sx={{ mb: 3 }}>
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
            <Link
              color="inherit"
              href="/"
              onClick={(e) => {
                e.preventDefault()
                navigate('/')
              }}
              sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
            >
              <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Home
            </Link>
            <Typography color="text.primary">
              {cityName && `${typeSlug ? propertyTypeMap[typeSlug]?.label || '' : 'Imóveis'} ${operationSlug ? operationMap[operationSlug]?.label || '' : ''} em ${cityName}`}
            </Typography>
          </Breadcrumbs>
        </Box>

        <PageHeader>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            {getPageTitle().replace(' - Dream Keys', '')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {getPageDescription()}
          </Typography>
        </PageHeader>

        {effectiveCity && (
          <PropertyList
            filters={{
              ...(filters || {}),
              city: effectiveCity,
            } as PropertySearchFilters}
            shouldLoad={true}
          />
        )}
      </PageContainer>
    </MainContentWrapper>
  )
}

