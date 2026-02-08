import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MdSearch, MdClear, MdHome, MdLocationOn } from 'react-icons/md';
import { FilterDrawer } from '../common/FilterDrawer';
import DataScopeFilter from '../common/DataScopeFilter';
import type { PropertyFilters } from '../../types/property';
import {
  PropertyTypeOptions,
  PropertyStatusOptions,
  BrazilianStates,
} from '../../types/property';

interface PropertyFiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: PropertyFilters;
  onFiltersChange: (filters: PropertyFilters) => void;
  loading?: boolean;
}

const FiltersContainer = styled.div`
  padding: 0;
`;

const FilterSection = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterSectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FilterGroup = styled.div`
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterLabel = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 6px;
`;

const FilterInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.inputBackground};
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.inputBackground};
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const SearchContainer = styled.div`
  position: relative;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textSecondary};
  pointer-events: none;
`;

const SearchInput = styled(FilterInput)`
  padding-left: 40px;
`;

const RangeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RangeSeparator = styled.span`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 14px;
  font-weight: 500;
`;

const FilterStats = styled.div`
  padding: 12px;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 13px;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 8px;

  span {
    &:nth-child(2) {
      color: ${props => props.theme.colors.textSecondary};
    }
  }
`;

const ClearButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: ${props => props.theme.colors.danger};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.dangerHover};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ApplyButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primaryHover};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const PropertyFiltersDrawer: React.FC<PropertyFiltersDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  loading = false,
}) => {
  const [localFilters, setLocalFilters] = useState<PropertyFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key: keyof PropertyFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters: PropertyFilters = {
      search: '',
      type: undefined,
      status: undefined,
      state: undefined,
      city: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      minArea: undefined,
      maxArea: undefined,
      bedrooms: undefined,
      bathrooms: undefined,
      onlyMyData: false,
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    onClose();
  };

  const hasActiveFilters = Object.values(localFilters).some(
    value => value !== undefined && value !== '' && value !== false
  );

  const footer = (
    <>
      {hasActiveFilters && (
        <ClearButton onClick={handleClear} disabled={loading}>
          <MdClear size={16} />
          Limpar Filtros
        </ClearButton>
      )}
      <ApplyButton onClick={handleApply} disabled={loading}>
        <MdSearch size={16} />
        Aplicar Filtros
      </ApplyButton>
    </>
  );

  return (
    <FilterDrawer
      isOpen={isOpen}
      onClose={onClose}
      title='Filtros de Propriedades'
      footer={footer}
    >
      <FiltersContainer>
        <FilterSection>
          <FilterSectionTitle>
            <MdSearch size={20} />
            Busca por Texto
          </FilterSectionTitle>

          <SearchContainer>
            <SearchIcon>
              <MdSearch size={18} />
            </SearchIcon>
            <SearchInput
              type='text'
              placeholder='Buscar por código, título ou descrição...'
              value={localFilters.search || ''}
              onChange={e => handleFilterChange('search', e.target.value)}
              disabled={loading}
            />
          </SearchContainer>
        </FilterSection>

        <FilterSection>
          <FilterSectionTitle>
            <MdHome size={20} />
            Filtros por Categoria
          </FilterSectionTitle>

          <FilterGrid>
            <FilterGroup>
              <FilterLabel>Tipo de Propriedade</FilterLabel>
              <FilterSelect
                value={localFilters.type || ''}
                onChange={e =>
                  handleFilterChange('type', e.target.value || undefined)
                }
                disabled={loading}
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
                value={localFilters.status || ''}
                onChange={e =>
                  handleFilterChange('status', e.target.value || undefined)
                }
                disabled={loading}
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

        <FilterSection>
          <FilterSectionTitle>
            <MdLocationOn size={20} />
            Localização
          </FilterSectionTitle>

          <FilterGrid>
            <FilterGroup>
              <FilterLabel>Estado</FilterLabel>
              <FilterSelect
                value={localFilters.state || ''}
                onChange={e =>
                  handleFilterChange('state', e.target.value || undefined)
                }
                disabled={loading}
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
              <FilterLabel>Cidade</FilterLabel>
              <FilterInput
                type='text'
                placeholder='Digite a cidade...'
                value={localFilters.city || ''}
                onChange={e =>
                  handleFilterChange('city', e.target.value || undefined)
                }
                disabled={loading}
              />
            </FilterGroup>
          </FilterGrid>
        </FilterSection>

        <FilterSection>
          <FilterSectionTitle>💰 Preço</FilterSectionTitle>

          <FilterGrid>
            <FilterGroup>
              <FilterLabel>Preço Mínimo</FilterLabel>
              <FilterInput
                type='number'
                placeholder='R$ 0'
                value={localFilters.minPrice || ''}
                onChange={e =>
                  handleFilterChange(
                    'minPrice',
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                disabled={loading}
              />
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Preço Máximo</FilterLabel>
              <FilterInput
                type='number'
                placeholder='R$ 0'
                value={localFilters.maxPrice || ''}
                onChange={e =>
                  handleFilterChange(
                    'maxPrice',
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                disabled={loading}
              />
            </FilterGroup>
          </FilterGrid>
        </FilterSection>

        <FilterSection>
          <FilterSectionTitle>📐 Área</FilterSectionTitle>

          <FilterGrid>
            <FilterGroup>
              <FilterLabel>Área Mínima (m²)</FilterLabel>
              <FilterInput
                type='number'
                placeholder='0'
                value={localFilters.minArea || ''}
                onChange={e =>
                  handleFilterChange(
                    'minArea',
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                disabled={loading}
              />
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Área Máxima (m²)</FilterLabel>
              <FilterInput
                type='number'
                placeholder='0'
                value={localFilters.maxArea || ''}
                onChange={e =>
                  handleFilterChange(
                    'maxArea',
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                disabled={loading}
              />
            </FilterGroup>
          </FilterGrid>
        </FilterSection>

        <FilterSection>
          <FilterSectionTitle>🛏️ Quartos e Banheiros</FilterSectionTitle>

          <FilterGrid>
            <FilterGroup>
              <FilterLabel>Quartos</FilterLabel>
              <FilterSelect
                value={localFilters.bedrooms || ''}
                onChange={e =>
                  handleFilterChange(
                    'bedrooms',
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                disabled={loading}
              >
                <option value=''>Qualquer quantidade</option>
                <option value='1'>1 quarto</option>
                <option value='2'>2 quartos</option>
                <option value='3'>3 quartos</option>
                <option value='4'>4 quartos</option>
                <option value='5'>5+ quartos</option>
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Banheiros</FilterLabel>
              <FilterSelect
                value={localFilters.bathrooms || ''}
                onChange={e =>
                  handleFilterChange(
                    'bathrooms',
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                disabled={loading}
              >
                <option value=''>Qualquer quantidade</option>
                <option value='1'>1 banheiro</option>
                <option value='2'>2 banheiros</option>
                <option value='3'>3 banheiros</option>
                <option value='4'>4+ banheiros</option>
              </FilterSelect>
            </FilterGroup>
          </FilterGrid>
        </FilterSection>

        <FilterSection>
          <FilterSectionTitle>🔒 Escopo de Dados</FilterSectionTitle>

          <DataScopeFilter
            onlyMyData={localFilters.onlyMyData || false}
            onChange={value => handleFilterChange('onlyMyData', value)}
            label='Mostrar apenas minhas propriedades'
            description='Quando marcado, mostra apenas propriedades que você criou, ignorando hierarquia de usuários.'
          />
        </FilterSection>

        {hasActiveFilters && (
          <FilterStats>
            <span>Filtros ativos aplicados</span>
          </FilterStats>
        )}
      </FiltersContainer>
    </FilterDrawer>
  );
};
