import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import {
  MdClear,
  MdSearch,
  MdCalendarToday,
  MdLocationOn,
  MdPerson,
  MdFlag,
} from 'react-icons/md';
import type { InspectionFilter } from '../../types/vistoria-types';
import {
  INSPECTION_STATUS_LABELS,
  INSPECTION_TYPE_LABELS,
} from '../../types/vistoria-types';
import { FilterDrawer } from '../common/FilterDrawer';

interface VistoriaFiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: InspectionFilter;
  onFiltersChange: (filters: InspectionFilter) => void;
  onClearFilters: () => void;
  properties?: Array<{ id: string; title: string }>;
  inspectors?: Array<{ id: string; name: string }>;
  canViewAllInspections?: boolean;
}

export const VistoriaFiltersDrawer: React.FC<VistoriaFiltersDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onClearFilters,
  properties = [],
  inspectors = [],
  canViewAllInspections = false,
}) => {
  const [titleInput, setTitleInput] = useState(filters.title || '');
  const titleDebounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setTitleInput(filters.title || '');
  }, [filters.title]);

  const handleFilterChange = useCallback(
    (key: keyof InspectionFilter, value: any) => {
      onFiltersChange({
        ...filters,
        [key]: value || undefined,
      });
    },
    [filters, onFiltersChange]
  );

  const handleTitleChange = (value: string) => {
    setTitleInput(value);

    if (titleDebounceRef.current) {
      clearTimeout(titleDebounceRef.current);
    }

    if (value.length >= 3 || value.length === 0) {
      titleDebounceRef.current = setTimeout(() => {
        handleFilterChange('title', value);
      }, 500);
    }
  };

  useEffect(() => {
    return () => {
      if (titleDebounceRef.current) {
        clearTimeout(titleDebounceRef.current);
      }
    };
  }, []);

  const hasActiveFilters = Object.values(filters).some(
    value => value !== undefined && value !== '' && value !== null
  );

  const footer = (
    <>
      {hasActiveFilters && (
        <ClearButton onClick={onClearFilters}>
          <MdClear size={16} />
          Limpar Filtros
        </ClearButton>
      )}
      <ApplyButton onClick={onClose}>Aplicar Filtros</ApplyButton>
    </>
  );

  return (
    <FilterDrawer
      isOpen={isOpen}
      onClose={onClose}
      title='Filtros de Vistorias'
      footer={footer}
    >
      <FiltersContainer>
        {/* Busca */}
        <SectionTitle>
          <MdSearch size={20} />
          Busca
        </SectionTitle>

        <FilterGroup>
          <FilterLabel>
            Título da Vistoria
            {titleInput.length > 0 && titleInput.length < 3 && (
              <SearchHint> (mín. 3 caracteres)</SearchHint>
            )}
          </FilterLabel>
          <FilterInput
            type='text'
            placeholder='Buscar vistoria... (mín. 3 caracteres)'
            value={titleInput}
            onChange={e => handleTitleChange(e.target.value)}
          />
        </FilterGroup>

        {/* Filtros Básicos */}
        <SectionTitle>
          <MdFlag size={20} />
          Filtros
        </SectionTitle>

        <FilterGrid>
          <FilterGroup>
            <FilterLabel>Status</FilterLabel>
            <FilterSelect
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
            <FilterLabel>Tipo</FilterLabel>
            <FilterSelect
              value={filters.type || ''}
              onChange={e => handleFilterChange('type', e.target.value)}
            >
              <option value=''>Todos os tipos</option>
              {Object.entries(INSPECTION_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </FilterSelect>
          </FilterGroup>

          {canViewAllInspections && inspectors.length > 0 && (
            <FilterGroup>
              <FilterLabel>
                <MdPerson size={14} />
                Responsável
              </FilterLabel>
              <FilterSelect
                value={filters.inspectorId || ''}
                onChange={e =>
                  handleFilterChange('inspectorId', e.target.value)
                }
              >
                <option value=''>Todos os responsáveis</option>
                {inspectors.map(inspector => (
                  <option key={inspector.id} value={inspector.id}>
                    {inspector.name}
                  </option>
                ))}
              </FilterSelect>
            </FilterGroup>
          )}

          {properties.length > 0 && (
            <FilterGroup>
              <FilterLabel>
                <MdLocationOn size={14} />
                Propriedade
              </FilterLabel>
              <FilterSelect
                value={filters.propertyId || ''}
                onChange={e => handleFilterChange('propertyId', e.target.value)}
              >
                <option value=''>Todas as propriedades</option>
                {properties.map(property => (
                  <option key={property.id} value={property.id}>
                    {property.title}
                  </option>
                ))}
              </FilterSelect>
            </FilterGroup>
          )}
        </FilterGrid>

        {/* Filtros de Data */}
        <SectionTitle>
          <MdCalendarToday size={20} />
          Datas
        </SectionTitle>

        <DateGrid>
          <FilterGroup>
            <FilterLabel>Data Inicial</FilterLabel>
            <FilterInput
              type='date'
              value={filters.startDate || ''}
              onChange={e => handleFilterChange('startDate', e.target.value)}
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Data Final</FilterLabel>
            <FilterInput
              type='date'
              value={filters.endDate || ''}
              onChange={e => handleFilterChange('endDate', e.target.value)}
            />
          </FilterGroup>
        </DateGrid>
      </FiltersContainer>
    </FilterDrawer>
  );
};

// Styled Components
const FiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

const DateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FilterLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const SearchHint = styled.span`
  font-size: 11px;
  font-weight: 500;
  color: ${props => props.theme.colors.warning};
  text-transform: none;
  letter-spacing: normal;
`;

const FilterInput = styled.input`
  width: 100%;
  padding: 12px 14px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
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
  padding: 12px 14px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const ClearButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: transparent;
  color: ${props => props.theme.colors.textSecondary};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: ${props => props.theme.colors.error};
    color: ${props => props.theme.colors.error};
    background: ${props => props.theme.colors.error}10;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ApplyButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-1px);
  }
`;
