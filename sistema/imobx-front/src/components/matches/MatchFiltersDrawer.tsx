import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MdSearch, MdClear, MdPerson, MdHome, MdStar } from 'react-icons/md';
import type { MatchStatus } from '../../types/match';
import { FilterDrawer } from '../common/FilterDrawer';

interface MatchFiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    status: MatchStatus | '';
    minScore: number;
    search: string;
    searchType?: 'all' | 'client' | 'property';
  };
  onChange: (filters: any) => void;
}

export const MatchFiltersDrawer: React.FC<MatchFiltersDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onChange,
}) => {
  // Filtros locais para o drawer
  const [localFilters, setLocalFilters] = useState({
    status: filters.status,
    minScore: filters.minScore,
    search: filters.search,
    searchType: filters.searchType || 'all',
  });

  // Inicializar filtros locais quando o drawer abrir
  useEffect(() => {
    if (isOpen) {
      setLocalFilters({
        status: filters.status,
        minScore: filters.minScore,
        search: filters.search,
        searchType: filters.searchType || 'all',
      });
    }
  }, [isOpen]);

  const handleClearFilters = () => {
    const cleared = {
      status: '',
      minScore: 0,
      search: '',
      searchType: 'all',
    };
    setLocalFilters(cleared);
    onChange(cleared);
    onClose();
  };

  const handleApplyFilters = () => {
    onChange(localFilters);
    onClose();
  };

  const hasActiveFilters =
    localFilters.status || localFilters.minScore > 0 || localFilters.search;

  const currentSearchType = localFilters.searchType || 'all';

  const getSearchPlaceholder = () => {
    switch (currentSearchType) {
      case 'client':
        return 'Nome do cliente... (mín. 3 caracteres)';
      case 'property':
        return 'Título ou endereço... (mín. 3 caracteres)';
      default:
        return 'Buscar... (mín. 3 caracteres)';
    }
  };

  const footer = (
    <>
      {hasActiveFilters && (
        <ClearButton onClick={handleClearFilters}>
          <MdClear size={16} />
          Limpar Filtros
        </ClearButton>
      )}
      <ApplyButton onClick={handleApplyFilters}>Aplicar Filtros</ApplyButton>
    </>
  );

  return (
    <FilterDrawer
      isOpen={isOpen}
      onClose={onClose}
      title='Filtros de Matches'
      footer={footer}
    >
      <FiltersContainer>
        {/* Tipo de Busca */}
        <SectionTitle>
          <MdSearch size={20} />
          Buscar
        </SectionTitle>

        <SearchTypeToggle>
          <SearchTypeButton
            $active={currentSearchType === 'all'}
            onClick={() =>
              setLocalFilters(prev => ({ ...prev, searchType: 'all' }))
            }
          >
            Todos
          </SearchTypeButton>
          <SearchTypeButton
            $active={currentSearchType === 'client'}
            onClick={() =>
              setLocalFilters(prev => ({ ...prev, searchType: 'client' }))
            }
          >
            <MdPerson size={16} />
            Cliente
          </SearchTypeButton>
          <SearchTypeButton
            $active={currentSearchType === 'property'}
            onClick={() =>
              setLocalFilters(prev => ({ ...prev, searchType: 'property' }))
            }
          >
            <MdHome size={16} />
            Imóvel
          </SearchTypeButton>
        </SearchTypeToggle>

        <FilterGroup>
          <FilterLabel>
            Termo de Busca
            {localFilters.search.length > 0 &&
              localFilters.search.length < 3 && (
                <SearchHint> (mín. 3 caracteres)</SearchHint>
              )}
          </FilterLabel>
          <FilterInput
            type='text'
            placeholder={getSearchPlaceholder()}
            value={localFilters.search}
            onChange={e =>
              setLocalFilters(prev => ({ ...prev, search: e.target.value }))
            }
          />
        </FilterGroup>

        {/* Status do Match */}
        <SectionTitle>
          <MdStar size={20} />
          Status do Match
        </SectionTitle>

        <StatusButtonsGroup>
          <StatusButton
            $active={!localFilters.status || localFilters.status === ''}
            onClick={() =>
              setLocalFilters(prev => ({ ...prev, status: '' as any }))
            }
          >
            📋 Todos
          </StatusButton>
          <StatusButton
            $active={localFilters.status === 'pending'}
            onClick={() =>
              setLocalFilters(prev => ({ ...prev, status: 'pending' as any }))
            }
          >
            ⏳ Pendentes
          </StatusButton>
          <StatusButton
            $active={localFilters.status === 'accepted'}
            onClick={() =>
              setLocalFilters(prev => ({ ...prev, status: 'accepted' as any }))
            }
          >
            ✅ Aceitos
          </StatusButton>
          <StatusButton
            $active={localFilters.status === 'ignored'}
            onClick={() =>
              setLocalFilters(prev => ({ ...prev, status: 'ignored' as any }))
            }
          >
            ❌ Ignorados
          </StatusButton>
        </StatusButtonsGroup>

        {/* Outros Filtros */}
        <SectionTitle>
          <MdStar size={20} />
          Outros Filtros
        </SectionTitle>

        <FilterGrid>
          <FilterGroup>
            <FilterLabel>Score Mínimo: {localFilters.minScore}%</FilterLabel>
            <RangeInput
              type='range'
              min='0'
              max='100'
              step='5'
              value={localFilters.minScore}
              onChange={e =>
                setLocalFilters(prev => ({
                  ...prev,
                  minScore: parseInt(e.target.value),
                }))
              }
            />
            <RangeLabels>
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </RangeLabels>
          </FilterGroup>
        </FilterGrid>
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

const SearchTypeToggle = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
`;

const SearchTypeButton = styled.button<{ $active?: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px;
  border: 2px solid
    ${props =>
      props.$active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 10px;
  background: ${props =>
    props.$active
      ? `${props.theme.colors.primary}15`
      : props.theme.colors.background};
  color: ${props =>
    props.$active
      ? props.theme.colors.primary
      : props.theme.colors.textSecondary};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props =>
      props.$active
        ? `${props.theme.colors.primary}20`
        : `${props.theme.colors.primary}10`};
  }
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
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

const RangeInput = styled.input`
  width: 100%;
  height: 8px;
  -webkit-appearance: none;
  appearance: none;
  background: ${props => props.theme.colors.border};
  border-radius: 4px;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    background: ${props => props.theme.colors.primary};
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.2);
    }
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: ${props => props.theme.colors.primary};
    border-radius: 50%;
    cursor: pointer;
    border: none;

    &:hover {
      transform: scale(1.2);
    }
  }
`;

const RangeLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
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

const StatusButtonsGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 8px;
`;

const StatusButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 16px;
  border: 2px solid
    ${props =>
      props.$active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 10px;
  background: ${props =>
    props.$active
      ? `${props.theme.colors.primary}15`
      : props.theme.colors.background};
  color: ${props =>
    props.$active ? props.theme.colors.primary : props.theme.colors.text};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props =>
      props.$active
        ? `${props.theme.colors.primary}20`
        : `${props.theme.colors.primary}10`};
  }
`;
