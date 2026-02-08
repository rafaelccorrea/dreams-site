import React, { useState, useEffect } from 'react';
import {
  MdFilterList,
  MdClear,
  MdSearch,
  MdCalendarToday,
  MdLocationOn,
  MdPerson,
  MdFlag,
} from 'react-icons/md';
import type { InspectionFilter } from '@/types/vistoria-types';
import {
  INSPECTION_STATUS_LABELS,
  INSPECTION_TYPE_LABELS,
} from '@/types/vistoria-types';
import { useDebounce } from '@/hooks/useDebounce';
import {
  FiltersContainer,
  FiltersHeader,
  FiltersTitle,
  FiltersSubtitle,
  FiltersActions,
  FilterButton,
  FiltersContent,
  FilterSection,
  FilterSectionHeader,
  FilterSectionTitle,
  FilterSectionDescription,
  SearchContainer,
  SearchIcon,
  SearchInput,
  FiltersGrid,
  FilterGroup,
  FilterLabel,
  FilterSelect,
  FilterInput,
  DateGrid,
} from '../../styles/components/InspectionFiltersStyles';

interface InspectionFiltersProps {
  filters: InspectionFilter;
  onFiltersChange: (filters: InspectionFilter) => void;
  onClearFilters: () => void;
  properties?: Array<{ id: string; title: string }>;
  inspectors?: Array<{ id: string; name: string }>;
  showFilters?: boolean;
  onToggleFilters?: () => void;
  canViewAllInspections?: boolean;
}

export const InspectionFilters: React.FC<InspectionFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  properties = [],
  inspectors = [],
  showFilters = true,
  onToggleFilters,
  canViewAllInspections = false,
}) => {
  // Estado local para busca com debounce
  const [titleInput, setTitleInput] = useState(filters.title || '');

  // Aplicar debounce (500ms, mínimo 3 caracteres)
  const debouncedTitle = useDebounce(titleInput, 500, 3);

  // Sincronizar valor debounced com os filtros
  useEffect(() => {
    if (titleInput.length >= 3 || titleInput.length === 0) {
      handleFilterChange('title', debouncedTitle);
    }
  }, [debouncedTitle]);

  // Sincronizar com mudanças externas nos filtros
  useEffect(() => {
    setTitleInput(filters.title || '');
  }, [filters.title]);

  const hasActiveFilters = Object.values(filters).some(
    value => value !== undefined && value !== '' && value !== null
  );

  const handleFilterChange = (key: keyof InspectionFilter, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  return (
    <FiltersContainer>
      <FiltersHeader>
        <div>
          <FiltersTitle>
            <MdFilterList />
            Filtros de Busca
          </FiltersTitle>
          <FiltersSubtitle>Refine sua busca por inspeções</FiltersSubtitle>
        </div>
        <FiltersActions>
          {onToggleFilters && (
            <FilterButton onClick={onToggleFilters}>
              <MdFilterList />
              {showFilters ? 'Ocultar' : 'Mostrar'}
            </FilterButton>
          )}
          {hasActiveFilters && (
            <FilterButton $variant='danger' onClick={onClearFilters}>
              <MdClear />
              Limpar
            </FilterButton>
          )}
        </FiltersActions>
      </FiltersHeader>

      {showFilters && (
        <FiltersContent>
          {/* Busca Principal */}
          <FilterSection>
            <FilterSectionHeader>
              <FilterSectionTitle>
                Busca por Texto
                {titleInput.length > 0 && titleInput.length < 3 && (
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
              </FilterSectionTitle>
              <FilterSectionDescription>
                Digite palavras-chave para encontrar inspeções (mínimo 3
                caracteres)
              </FilterSectionDescription>
            </FilterSectionHeader>
            <SearchContainer>
              <SearchIcon>
                <MdSearch />
              </SearchIcon>
              <SearchInput
                placeholder='Buscar por título ou descrição... (mín. 3 caracteres)'
                value={titleInput}
                onChange={e => setTitleInput(e.target.value)}
              />
            </SearchContainer>
          </FilterSection>

          {/* Filtros por Categoria */}
          <FilterSection>
            <FilterSectionHeader>
              <FilterSectionTitle>Filtros por Categoria</FilterSectionTitle>
              <FilterSectionDescription>
                Filtre por status, tipo e localização
              </FilterSectionDescription>
            </FilterSectionHeader>

            <FiltersGrid $columns={canViewAllInspections ? 4 : 3}>
              <FilterGroup>
                <FilterLabel htmlFor='status'>
                  <MdFlag />
                  Status da Inspeção
                </FilterLabel>
                <FilterSelect
                  id='status'
                  value={filters.status || ''}
                  onChange={e => handleFilterChange('status', e.target.value)}
                >
                  <option value=''>Todos os status</option>
                  {Object.entries(INSPECTION_STATUS_LABELS).map(
                    ([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    )
                  )}
                </FilterSelect>
              </FilterGroup>

              <FilterGroup>
                <FilterLabel htmlFor='type'>
                  <MdFlag />
                  Tipo de Inspeção
                </FilterLabel>
                <FilterSelect
                  id='type'
                  value={filters.type || ''}
                  onChange={e => handleFilterChange('type', e.target.value)}
                >
                  <option value=''>Todos os tipos</option>
                  {Object.entries(INSPECTION_TYPE_LABELS).map(
                    ([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    )
                  )}
                </FilterSelect>
              </FilterGroup>

              <FilterGroup>
                <FilterLabel htmlFor='propertyId'>
                  <MdLocationOn />
                  Propriedade
                </FilterLabel>
                <FilterSelect
                  id='propertyId'
                  value={filters.propertyId || ''}
                  onChange={e =>
                    handleFilterChange('propertyId', e.target.value)
                  }
                >
                  <option value=''>Todas as propriedades</option>
                  {properties.map(property => (
                    <option key={property.id} value={property.id}>
                      {property.title}
                    </option>
                  ))}
                </FilterSelect>
              </FilterGroup>

              {canViewAllInspections && (
                <FilterGroup>
                  <FilterLabel htmlFor='inspectorId'>
                    <MdPerson />
                    Inspetor Responsável
                  </FilterLabel>
                  <FilterSelect
                    id='inspectorId'
                    value={filters.inspectorId || ''}
                    onChange={e =>
                      handleFilterChange('inspectorId', e.target.value)
                    }
                  >
                    <option value=''>Todos os inspetores</option>
                    {inspectors.map(inspector => (
                      <option key={inspector.id} value={inspector.id}>
                        {inspector.name}
                      </option>
                    ))}
                  </FilterSelect>
                </FilterGroup>
              )}
            </FiltersGrid>
          </FilterSection>

          {/* Filtros por Data */}
          <FilterSection>
            <FilterSectionHeader>
              <FilterSectionTitle>Filtros por Data</FilterSectionTitle>
              <FilterSectionDescription>
                Defina um período para filtrar as inspeções
              </FilterSectionDescription>
            </FilterSectionHeader>

            <DateGrid>
              <FilterGroup>
                <FilterLabel htmlFor='startDate'>
                  <MdCalendarToday />
                  Data Inicial
                </FilterLabel>
                <FilterInput
                  id='startDate'
                  type='date'
                  value={filters.startDate || ''}
                  onChange={e =>
                    handleFilterChange('startDate', e.target.value)
                  }
                />
              </FilterGroup>

              <FilterGroup>
                <FilterLabel htmlFor='endDate'>
                  <MdCalendarToday />
                  Data Final
                </FilterLabel>
                <FilterInput
                  id='endDate'
                  type='date'
                  value={filters.endDate || ''}
                  onChange={e => handleFilterChange('endDate', e.target.value)}
                />
              </FilterGroup>
            </DateGrid>
          </FilterSection>
        </FiltersContent>
      )}
    </FiltersContainer>
  );
};

// Manter compatibilidade com código existente
export const VistoriaFilters = InspectionFilters;
