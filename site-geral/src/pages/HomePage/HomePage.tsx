import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Grid, Box } from '@mui/material'
import Lottie from 'lottie-react'
import { AnimatedText } from '../../components/AnimatedText'
import { HeroCard } from '../../components/HeroCard'
import { PropertyList } from '../../components/PropertyList'
import { FeaturedProperties } from '../../components/FeaturedProperties'
import { ScrollToTop } from '../../components/ScrollToTop'
import { Person } from '@mui/icons-material'
import { PropertySearchFilters } from '../../services/propertyService'
import {
  PageContainer,
  HomeContainer,
  LeftSection,
  RightSection,
  ContactButton,
  LottieModal,
  LottieModalBackdrop,
  LottieModalContent,
  LottieContainer,
} from './HomePage.styles'

export const HomePage = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchFilters, setSearchFilters] = useState<Omit<PropertySearchFilters, 'city' | 'state' | 'page' | 'limit'> | undefined>(undefined)
  const [homeAnimation, setHomeAnimation] = useState<any>(null)
  const [showLottieModal, setShowLottieModal] = useState(true)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // Carregar animação Lottie
  useEffect(() => {
    fetch('/homejson.json')
      .then((response) => response.json())
      .then((data) => {
        setHomeAnimation(data)
        // Fechar modal após a animação terminar (ou após alguns segundos)
        setTimeout(() => {
          setShowLottieModal(false)
          setIsInitialLoad(false)
        }, 3000) // 3 segundos
      })
      .catch((error) => console.error('Erro ao carregar animação Lottie:', error))
  }, [])

  // Função para exibir o modal Lottie
  const showLottie = () => {
    if (homeAnimation && !isInitialLoad) {
      setShowLottieModal(true)
      setTimeout(() => {
        setShowLottieModal(false)
      }, 3000) // 3 segundos
    }
  }

  // Ler filtros da URL quando a página carrega
  useEffect(() => {
    const type = searchParams.get('type') as 'house' | 'apartment' | 'commercial' | undefined
    const transaction = searchParams.get('transaction') as 'sale' | 'rent' | undefined

    if (type || transaction) {
      const filters: any = {}
      
      if (type) {
        filters.type = type
      }
      
      // Para transaction, vamos usar search para filtrar por salePrice ou rentPrice
      if (transaction) {
        filters.search = transaction === 'sale' ? 'sale' : 'rent'
      }
      
      // Verificar se os filtros mudaram antes de atualizar
      const filtersChanged = JSON.stringify(filters) !== JSON.stringify(searchFilters)
      
      if (filtersChanged) {
        setSearchFilters(filters)
        // Exibir Lottie quando filtros da URL mudarem (apenas se não for o carregamento inicial)
        if (!isInitialLoad) {
          showLottie()
        }
      }
    } else {
      // Resetar filtros se não houver parâmetros na URL
      if (searchFilters !== undefined) {
        setSearchFilters(undefined)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const handleSearch = (filters: PropertySearchFilters) => {
    // Remove city, state, page e limit para passar apenas os filtros de busca
    const { city, state, page, limit, ...filterProps } = filters
    
    // Criar um novo objeto para forçar a atualização do React, mesmo se os valores forem os mesmos
    // Isso permite múltiplas buscas com os mesmos filtros
    const newFilters = { ...filterProps }
    
    // Sempre atualizar os filtros para permitir múltiplas buscas, mesmo com os mesmos filtros
    setSearchFilters(newFilters)
    
    // Exibir Lottie quando filtros forem aplicados via busca (apenas se não for o carregamento inicial)
    if (!isInitialLoad) {
      showLottie()
    }
  }

  const handleContactBrokers = () => {
    navigate('/corretores')
  }

  const handleClearFilters = () => {
    // Limpar filtros no estado
    setSearchFilters(undefined)
    
    // Limpar parâmetros da URL
    setSearchParams({}, { replace: true })
    
    // Exibir Lottie quando filtros forem limpos (apenas se não for o carregamento inicial)
    if (!isInitialLoad) {
      showLottie()
    }
  }

  return (
    <PageContainer>
      <LottieModal $isOpen={showLottieModal && homeAnimation}>
        <LottieModalBackdrop onClick={() => setShowLottieModal(false)} />
        <LottieModalContent>
          <LottieContainer>
            <Lottie animationData={homeAnimation} loop={true} autoplay={true} />
          </LottieContainer>
        </LottieModalContent>
      </LottieModal>
      <HomeContainer maxWidth="xl">
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} alignItems="center">
          <Grid item xs={12} md={6}>
            <LeftSection>
              <AnimatedText
                title="Encontre o Imóvel dos Seus Sonhos"
                subtitle="Milhares de propriedades disponíveis. Seu novo lar está a um clique de distância."
                delay={0.3}
              />
              <ContactButton
                variant="contained"
                startIcon={<Person />}
                onClick={handleContactBrokers}
                sx={{
                  backgroundColor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'white',
                  },
                }}
              >
                Contato com Corretores
              </ContactButton>
            </LeftSection>
          </Grid>
          <Grid item xs={12} md={6}>
            <RightSection>
              <HeroCard onSearch={handleSearch} />
            </RightSection>
          </Grid>
        </Grid>
      </HomeContainer>
      <FeaturedProperties />
      <PropertyList filters={searchFilters} onClearFilters={handleClearFilters} />
      <ScrollToTop />
    </PageContainer>
  )
}

