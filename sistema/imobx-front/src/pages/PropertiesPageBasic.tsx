import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Layout } from '../components/layout/Layout';
import {
  MdAdd,
  MdSearch,
  MdFilterList,
  MdGridView,
  MdList,
  MdLocationOn,
  MdAttachMoney,
  MdHome,
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  padding: 24px;
  background: ${props => props.theme.colors.background};
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 12px;
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  padding: 12px 16px 12px 40px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.text};
  width: 300px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}20`};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  color: ${props => props.theme.colors.textSecondary};
`;

const FilterButton = styled.button`
  background: transparent;
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textSecondary};
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.hover};
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.text};
  }
`;

const AddButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-1px);
  }
`;

const ViewControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
`;

const ViewButton = styled.button<{ active: boolean }>`
  background: ${props =>
    props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props =>
    props.active ? 'white' : props.theme.colors.textSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props =>
      props.active ? props.theme.colors.primaryDark : props.theme.colors.hover};
    border-color: ${props => props.theme.colors.primary};
  }
`;

const PropertiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
`;

const PropertyCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
`;

const PropertyImage = styled.div`
  height: 200px;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary}20,
    ${props => props.theme.colors.primary}10
  );
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.primary};
  font-size: 3rem;
`;

const PropertyContent = styled.div`
  padding: 16px;
`;

const PropertyTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;
`;

const PropertyPrice = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 8px;
`;

const PropertyDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
`;

const PropertyDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const PropertyLocation = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: ${props => props.theme.colors.textSecondary};
`;

// Shimmer Components
const ShimmerCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  overflow: hidden;
  animation: shimmer-fade 1.5s ease-in-out infinite;

  @keyframes shimmer-fade {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.6;
    }
  }
`;

const ShimmerImage = styled.div`
  height: 200px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 0%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;

const ShimmerContent = styled.div`
  padding: 16px;
`;

const ShimmerLine = styled.div<{
  width?: string;
  height?: string;
  marginBottom?: string;
}>`
  height: ${props => props.height || '16px'};
  width: ${props => props.width || '100%'};
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 0%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 100%
  );
  background-size: 200% 100%;
  border-radius: 4px;
  margin-bottom: ${props => props.marginBottom || '12px'};
  animation: shimmer 1.5s ease-in-out infinite;
`;

const ShimmerDetails = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
`;

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: string;
  status: 'available' | 'sold' | 'rented';
  images: string[];
}

const PropertiesPageBasic: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const navigate = useNavigate();

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);

      // TODO: Implementar chamada para API real
      // const response = await propertyApi.getProperties();
      // setProperties(response.data);

      setProperties([]);
    } catch (error) {
      console.error('Erro ao carregar propriedades:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(
    property =>
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const handleAddProperty = () => {
    navigate('/properties/create');
  };

  if (loading) {
    return (
      <Layout>
        <Container>
          <Header>
            <Title>
              <MdHome size={32} />
              Propriedades
            </Title>
          </Header>
          <PropertiesGrid>
            {[...Array(6)].map((_, index) => (
              <ShimmerCard key={index}>
                <ShimmerImage />
                <ShimmerContent>
                  <ShimmerLine height='20px' width='70%' marginBottom='12px' />
                  <ShimmerLine height='24px' width='40%' marginBottom='12px' />
                  <ShimmerDetails>
                    <ShimmerLine height='14px' width='60px' marginBottom='0' />
                    <ShimmerLine height='14px' width='60px' marginBottom='0' />
                    <ShimmerLine height='14px' width='60px' marginBottom='0' />
                  </ShimmerDetails>
                  <ShimmerLine height='14px' width='80%' marginBottom='0' />
                </ShimmerContent>
              </ShimmerCard>
            ))}
          </PropertiesGrid>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container>
        <Header>
          <Title>
            <MdHome size={32} />
            Propriedades
          </Title>
          <ActionsContainer>
            <SearchContainer>
              <SearchIcon>
                <MdSearch size={20} />
              </SearchIcon>
              <SearchInput
                type='text'
                placeholder='Buscar propriedades...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </SearchContainer>
            <FilterButton>
              <MdFilterList size={20} />
              Filtros
            </FilterButton>
            <AddButton onClick={handleAddProperty}>
              <MdAdd size={20} />
              Adicionar
            </AddButton>
          </ActionsContainer>
        </Header>

        <ViewControls>
          <ViewButton
            active={viewMode === 'grid'}
            onClick={() => setViewMode('grid')}
          >
            <MdGridView size={16} />
            Grade
          </ViewButton>
          <ViewButton
            active={viewMode === 'list'}
            onClick={() => setViewMode('list')}
          >
            <MdList size={16} />
            Lista
          </ViewButton>
        </ViewControls>

        {filteredProperties.length === 0 ? (
          <EmptyState>
            <MdHome size={64} />
            <h3>Nenhuma propriedade encontrada</h3>
            <p>
              {searchTerm
                ? `Nenhuma propriedade corresponde à busca por "${searchTerm}"`
                : 'Não há propriedades cadastradas ainda'}
            </p>
          </EmptyState>
        ) : (
          <PropertiesGrid>
            {filteredProperties.map(property => (
              <PropertyCard key={property.id}>
                <PropertyImage>
                  <MdHome size={48} />
                </PropertyImage>
                <PropertyContent>
                  <PropertyTitle>{property.title}</PropertyTitle>
                  <PropertyPrice>{formatPrice(property.price)}</PropertyPrice>
                  <PropertyDetails>
                    <PropertyDetail>
                      <MdHome size={16} />
                      {property.bedrooms} quartos
                    </PropertyDetail>
                    <PropertyDetail>
                      🚿 {property.bathrooms} banheiros
                    </PropertyDetail>
                    <PropertyDetail>📐 {property.area}m²</PropertyDetail>
                  </PropertyDetails>
                  <PropertyLocation>
                    <MdLocationOn size={16} />
                    {property.location}
                  </PropertyLocation>
                </PropertyContent>
              </PropertyCard>
            ))}
          </PropertiesGrid>
        )}
      </Container>
    </Layout>
  );
};

export default PropertiesPageBasic;
