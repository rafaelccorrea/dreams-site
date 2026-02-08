import React, { useState, useEffect } from 'react';
import { MdSearch, MdClear, MdFilterList } from 'react-icons/md';
import type { PropertyFilters } from '../../types/property';
import {
  PropertyTypeOptions,
  PropertyStatusOptions,
  BrazilianStates,
} from '../../types/property';
import { useDebounce } from '../../hooks/useDebounce';
import { ModalPadrão } from '../common/ModalPadrão';
import DataScopeFilter from '../common/DataScopeFilter';
import { ModalButton } from '../common/ModalButton';
import {
  FilterSection,
  FilterSectionTitle,
  FilterGrid,
  FilterRow,
  FilterGroup,
  FilterLabel,
  FilterSelect,
  FilterInput,
  RangeSeparator,
  ActiveFiltersBadge,
} from '../../styles/components/PropertyFiltersModalStyles';

interface PropertyFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: PropertyFilters) => void;
  onClearFilters: () => void;
  currentFilters: PropertyFilters;
}

const PropertyFiltersModal: React.FC<PropertyFiltersModalProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  onClearFilters,
  currentFilters,
}) => {
  const [filters, setFilters] = useState<PropertyFilters>(currentFilters || {});

  // Estados locais para campos de texto com debounce
  const [cityInput, setCityInput] = useState(filters.city || '');
  const [neighborhoodInput, setNeighborhoodInput] = useState(
    filters.neighborhood || ''
  );
  const [zipCodeInput, setZipCodeInput] = useState(filters.zipCode || '');
  const [searchInput, setSearchInput] = useState(filters.search || '');

  // Aplicar debounce (500ms, mínimo 3 caracteres)
  const debouncedCity = useDebounce(cityInput, 500, 3);
  const debouncedNeighborhood = useDebounce(neighborhoodInput, 500, 3);
  const debouncedZipCode = useDebounce(zipCodeInput, 500, 3);
  const debouncedSearch = useDebounce(searchInput, 500, 3);

  // Sincronizar valores debounced com os filtros
  useEffect(() => {
    if (cityInput.length >= 3 || cityInput.length === 0) {
      handleFilterChange('city', debouncedCity);
    }
  }, [debouncedCity]);

  useEffect(() => {
    if (neighborhoodInput.length >= 3 || neighborhoodInput.length === 0) {
      handleFilterChange('neighborhood', debouncedNeighborhood);
    }
  }, [debouncedNeighborhood]);

  useEffect(() => {
    if (zipCodeInput.length >= 3 || zipCodeInput.length === 0) {
      handleFilterChange('zipCode', debouncedZipCode);
    }
  }, [debouncedZipCode]);

  useEffect(() => {
    if (searchInput.length >= 3 || searchInput.length === 0) {
      handleFilterChange('search', debouncedSearch);
    }
  }, [debouncedSearch]);

  // Sincronizar com mudanças externas
  useEffect(() => {
    setCityInput(filters.city || '');
  }, [filters.city]);

  useEffect(() => {
    setNeighborhoodInput(filters.neighborhood || '');
  }, [filters.neighborhood]);

  useEffect(() => {
    setZipCodeInput(filters.zipCode || '');
  }, [filters.zipCode]);

  useEffect(() => {
    setSearchInput(filters.search || '');
  }, [filters.search]);

  const handleFilterChange = (
    key: keyof PropertyFilters,
    value: string | number | undefined
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleClearFilters = () => {
    setCityInput('');
    setNeighborhoodInput('');
    setZipCodeInput('');
    setSearchInput('');
    setFilters({});
    onClearFilters();
    onClose();
  };

  const handleClose = () => {
    setFilters(currentFilters || {}); // Reset to current filters
    onClose();
  };

  const getActiveFiltersCount = () => {
    if (!filters || typeof filters !== 'object') {
      return 0;
    }
    return Object.values(filters).filter(
      value => value !== undefined && value !== '' && value !== null
    ).length;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <ModalPadrão
      isOpen={isOpen}
      onClose={handleClose}
      title='Filtros Avançados'
      subtitle='Configure os filtros para encontrar as propriedades desejadas'
      icon={<MdFilterList size={24} />}
      maxWidth='1200px'
      footer={
        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
            width: '100%',
          }}
        >
          <ModalButton variant='secondary' onClick={handleClearFilters}>
            <MdClear />
            Limpar Filtros
          </ModalButton>
          <ModalButton variant='primary' onClick={handleApplyFilters}>
            <MdSearch />
            Aplicar Filtros
          </ModalButton>
        </div>
      }
    >
      <div style={{ position: 'relative' }}>
        {activeFiltersCount > 0 && (
          <ActiveFiltersBadge
            style={{
              position: 'absolute',
              top: '-10px',
              right: '0',
              zIndex: 10,
            }}
          >
            {activeFiltersCount}
          </ActiveFiltersBadge>
        )}
        {/* Seção: Tipo e Status */}
        <FilterSection>
          <FilterSectionTitle>📋 Tipo e Status</FilterSectionTitle>
          <FilterGrid>
            <FilterGroup>
              <FilterLabel>Tipo de Propriedade</FilterLabel>
              <FilterSelect
                value={filters.type || ''}
                onChange={e => handleFilterChange('type', e.target.value)}
              >
                <option value=''>Todos os tipos</option>
                {PropertyTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Status</FilterLabel>
              <FilterSelect
                value={filters.status || ''}
                onChange={e => handleFilterChange('status', e.target.value)}
              >
                <option value=''>Todos os status</option>
                {PropertyStatusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </FilterSelect>
            </FilterGroup>
          </FilterGrid>
        </FilterSection>

        {/* Seção: Localização */}
        <FilterSection>
          <FilterSectionTitle>📍 Localização</FilterSectionTitle>
          <FilterGrid>
            <FilterGroup>
              <FilterLabel>Estado</FilterLabel>
              <FilterSelect
                value={filters.state || ''}
                onChange={e => handleFilterChange('state', e.target.value)}
              >
                <option value=''>Todos os estados</option>
                {BrazilianStates.map(state => (
                  <option key={state.value} value={state.value}>
                    {state.label}
                  </option>
                ))}
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>
                Cidade
                {cityInput.length > 0 && cityInput.length < 3 && (
                  <span
                    style={{
                      color: '#f59e0b',
                      marginLeft: '8px',
                      fontSize: '0.75rem',
                    }}
                  >
                    (mín. 3 caracteres)
                  </span>
                )}
              </FilterLabel>
              <FilterInput
                type='text'
                placeholder='Digite a cidade (mín. 3 caracteres)'
                value={cityInput}
                onChange={e => setCityInput(e.target.value)}
              />
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>
                Bairro
                {neighborhoodInput.length > 0 &&
                  neighborhoodInput.length < 3 && (
                    <span
                      style={{
                        color: '#f59e0b',
                        marginLeft: '8px',
                        fontSize: '0.75rem',
                      }}
                    >
                      (mín. 3 caracteres)
                    </span>
                  )}
              </FilterLabel>
              <FilterInput
                type='text'
                placeholder='Digite o bairro (mín. 3 caracteres)'
                value={neighborhoodInput}
                onChange={e => setNeighborhoodInput(e.target.value)}
              />
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>
                CEP
                {zipCodeInput.length > 0 && zipCodeInput.length < 3 && (
                  <span
                    style={{
                      color: '#f59e0b',
                      marginLeft: '8px',
                      fontSize: '0.75rem',
                    }}
                  >
                    (mín. 3 caracteres)
                  </span>
                )}
              </FilterLabel>
              <FilterInput
                type='text'
                placeholder='00000-000 (mín. 3 caracteres)'
                value={zipCodeInput}
                onChange={e => setZipCodeInput(e.target.value)}
              />
            </FilterGroup>
          </FilterGrid>
        </FilterSection>

        {/* Seção: Preços */}
        <FilterSection>
          <FilterSectionTitle>💰 Preços</FilterSectionTitle>
          <FilterGrid>
            <FilterGroup>
              <FilterLabel>Preço de Venda</FilterLabel>
              <FilterRow>
                <FilterInput
                  type='number'
                  placeholder='Valor mínimo'
                  value={filters.minSalePrice || ''}
                  onChange={e =>
                    handleFilterChange(
                      'minSalePrice',
                      e.target.value ? parseFloat(e.target.value) : undefined
                    )
                  }
                />
                <RangeSeparator>até</RangeSeparator>
                <FilterInput
                  type='number'
                  placeholder='Valor máximo'
                  value={filters.maxSalePrice || ''}
                  onChange={e =>
                    handleFilterChange(
                      'maxSalePrice',
                      e.target.value ? parseFloat(e.target.value) : undefined
                    )
                  }
                />
              </FilterRow>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Preço de Aluguel</FilterLabel>
              <FilterRow>
                <FilterInput
                  type='number'
                  placeholder='Valor mínimo'
                  value={filters.minRentPrice || ''}
                  onChange={e =>
                    handleFilterChange(
                      'minRentPrice',
                      e.target.value ? parseFloat(e.target.value) : undefined
                    )
                  }
                />
                <RangeSeparator>até</RangeSeparator>
                <FilterInput
                  type='number'
                  placeholder='Valor máximo'
                  value={filters.maxRentPrice || ''}
                  onChange={e =>
                    handleFilterChange(
                      'maxRentPrice',
                      e.target.value ? parseFloat(e.target.value) : undefined
                    )
                  }
                />
              </FilterRow>
            </FilterGroup>
          </FilterGrid>
        </FilterSection>

        {/* Seção: Características */}
        <FilterSection>
          <FilterSectionTitle>🏠 Características</FilterSectionTitle>
          <FilterGrid>
            <FilterGroup>
              <FilterLabel>Área Total (m²)</FilterLabel>
              <FilterRow>
                <FilterInput
                  type='number'
                  placeholder='Mínima'
                  value={filters.minArea || ''}
                  onChange={e =>
                    handleFilterChange(
                      'minArea',
                      e.target.value ? parseFloat(e.target.value) : undefined
                    )
                  }
                />
                <RangeSeparator>até</RangeSeparator>
                <FilterInput
                  type='number'
                  placeholder='Máxima'
                  value={filters.maxArea || ''}
                  onChange={e =>
                    handleFilterChange(
                      'maxArea',
                      e.target.value ? parseFloat(e.target.value) : undefined
                    )
                  }
                />
              </FilterRow>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Quartos</FilterLabel>
              <FilterSelect
                value={filters.bedrooms || ''}
                onChange={e =>
                  handleFilterChange(
                    'bedrooms',
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
              >
                <option value=''>Qualquer quantidade</option>
                <option value='1'>1+ quartos</option>
                <option value='2'>2+ quartos</option>
                <option value='3'>3+ quartos</option>
                <option value='4'>4+ quartos</option>
                <option value='5'>5+ quartos</option>
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Banheiros</FilterLabel>
              <FilterSelect
                value={filters.bathrooms || ''}
                onChange={e =>
                  handleFilterChange(
                    'bathrooms',
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
              >
                <option value=''>Qualquer quantidade</option>
                <option value='1'>1+ banheiros</option>
                <option value='2'>2+ banheiros</option>
                <option value='3'>3+ banheiros</option>
                <option value='4'>4+ banheiros</option>
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Vagas de Garagem</FilterLabel>
              <FilterSelect
                value={filters.parkingSpaces || ''}
                onChange={e =>
                  handleFilterChange(
                    'parkingSpaces',
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
              >
                <option value=''>Qualquer quantidade</option>
                <option value='1'>1+ vagas</option>
                <option value='2'>2+ vagas</option>
                <option value='3'>3+ vagas</option>
                <option value='4'>4+ vagas</option>
              </FilterSelect>
            </FilterGroup>
          </FilterGrid>
        </FilterSection>

        {/* Seção: Busca */}
        <FilterSection>
          <FilterSectionTitle>🔍 Busca</FilterSectionTitle>
          <FilterGrid>
            <FilterGroup>
              <FilterLabel>
                Buscar por
                {searchInput.length > 0 && searchInput.length < 3 && (
                  <span
                    style={{
                      color: '#f59e0b',
                      marginLeft: '8px',
                      fontSize: '0.75rem',
                    }}
                  >
                    (mín. 3 caracteres)
                  </span>
                )}
              </FilterLabel>
              <FilterInput
                type='text'
                placeholder='Título, endereço, descrição... (mín. 3 caracteres)'
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
              />
            </FilterGroup>
          </FilterGrid>
        </FilterSection>

        {/* Seção: Escopo de Dados */}
        <DataScopeFilter
          onlyMyData={filters.onlyMyData}
          onChange={value => handleFilterChange('onlyMyData', value)}
          label='Mostrar apenas minhas propriedades'
          description='Quando marcado, mostra apenas propriedades que você cadastrou, ignorando hierarquia de usuários.'
        />
      </div>
    </ModalPadrão>
  );
};

export default PropertyFiltersModal;
