import { useState } from 'react'
import { Grid } from '@mui/material'
import { AnimatedText } from '../../components/AnimatedText'
import { HeroCard } from '../../components/HeroCard'
import { PropertyList } from '../../components/PropertyList'
import { Person } from '@mui/icons-material'
import { PropertySearchFilters } from '../../services/propertyService'
import {
  PageContainer,
  HomeContainer,
  LeftSection,
  RightSection,
  ContactButton,
} from './HomePage.styles'

export const HomePage = () => {
  const [searchFilters, setSearchFilters] = useState<Omit<PropertySearchFilters, 'city' | 'state' | 'page' | 'limit'> | undefined>(undefined)

  const handleSearch = (filters: PropertySearchFilters) => {
    // Remove city, state, page e limit para passar apenas os filtros de busca
    const { city, state, page, limit, ...filterProps } = filters
    setSearchFilters(filterProps)
  }

  return (
    <PageContainer>
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
      <PropertyList filters={searchFilters} />
    </PageContainer>
  )
}

