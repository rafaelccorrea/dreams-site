import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MdClear, MdLocationOn, MdStar, MdFilterList } from 'react-icons/md';
import { FilterDrawer } from '../common/FilterDrawer';
import type { LeadFilters, LeadStatus } from '../../types/mcmv';

interface MCMVLeadsFiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: LeadFilters;
  activeTab: LeadStatus | 'all';
  onChange: (filters: LeadFilters) => void;
  onTabChange: (tab: LeadStatus | 'all') => void;
}

export const MCMVLeadsFiltersDrawer: React.FC<MCMVLeadsFiltersDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  activeTab,
  onChange,
  onTabChange,
}) => {
  const [localTab, setLocalTab] = useState<LeadStatus | 'all'>(activeTab);
  const [localFilters, setLocalFilters] = useState<LeadFilters>({
    status: filters.status,
    city: filters.city,
    state: filters.state,
    eligible: filters.eligible,
    minScore: filters.minScore,
    page: 1,
    limit: filters.limit || 20,
  });

  useEffect(() => {
    if (isOpen) {
      setLocalTab(activeTab);
      setLocalFilters({
        status: filters.status,
        city: filters.city,
        state: filters.state,
        eligible: filters.eligible,
        minScore: filters.minScore,
        page: 1,
        limit: filters.limit || 20,
      });
    }
  }, [isOpen, filters, activeTab]);

  const handleClearFilters = () => {
    const cleared: LeadFilters = {
      page: 1,
      limit: 20,
    };
    setLocalTab('all');
    setLocalFilters(cleared);
    onChange(cleared);
    onTabChange('all');
    onClose();
  };

  const handleApplyFilters = () => {
    onChange(localFilters);
    onTabChange(localTab);
    onClose();
  };

  const hasActiveFilters =
    localTab !== 'all' ||
    localFilters.status ||
    localFilters.city ||
    localFilters.state ||
    localFilters.eligible !== undefined ||
    (localFilters.minScore !== undefined && localFilters.minScore > 0);

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
      title='Filtros de Leads MCMV'
      footer={footer}
    >
      <FiltersContainer>
        {/* Filtro de Status */}
        <SectionTitle>
          <MdFilterList size={20} />
          Status
        </SectionTitle>

        <TabsContainer>
          <TabButton
            $active={localTab === 'all'}
            onClick={() => setLocalTab('all')}
          >
            📋 Todos
          </TabButton>
          <TabButton
            $active={localTab === 'new'}
            onClick={() => setLocalTab('new')}
          >
            🆕 Novos
          </TabButton>
          <TabButton
            $active={localTab === 'contacted'}
            onClick={() => setLocalTab('contacted')}
          >
            📞 Contactados
          </TabButton>
          <TabButton
            $active={localTab === 'qualified'}
            onClick={() => setLocalTab('qualified')}
          >
            ✅ Qualificados
          </TabButton>
          <TabButton
            $active={localTab === 'converted'}
            onClick={() => setLocalTab('converted')}
          >
            🎯 Convertidos
          </TabButton>
          <TabButton
            $active={localTab === 'lost'}
            onClick={() => setLocalTab('lost')}
          >
            ❌ Perdidos
          </TabButton>
        </TabsContainer>

        {/* Outros Filtros */}
        <SectionTitle>
          <MdStar size={20} />
          Filtros Adicionais
        </SectionTitle>

        <FilterGrid>
          <FilterGroup>
            <FilterLabel>Cidade</FilterLabel>
            <FilterInput
              type='text'
              placeholder='Ex: Marília'
              value={localFilters.city || ''}
              onChange={e =>
                setLocalFilters(prev => ({
                  ...prev,
                  city: e.target.value || undefined,
                }))
              }
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Estado</FilterLabel>
            <FilterInput
              type='text'
              placeholder='Ex: SP'
              value={localFilters.state || ''}
              onChange={e =>
                setLocalFilters(prev => ({
                  ...prev,
                  state: e.target.value || undefined,
                }))
              }
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Elegibilidade</FilterLabel>
            <FilterSelect
              value={
                localFilters.eligible === undefined
                  ? ''
                  : localFilters.eligible
                    ? 'true'
                    : 'false'
              }
              onChange={e =>
                setLocalFilters(prev => ({
                  ...prev,
                  eligible:
                    e.target.value === ''
                      ? undefined
                      : e.target.value === 'true',
                }))
              }
            >
              <option value=''>Todos</option>
              <option value='true'>✅ Elegível</option>
              <option value='false'>❌ Não elegível</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>
              Score Mínimo: {localFilters.minScore || 0}%
            </FilterLabel>
            <RangeInput
              type='range'
              min='0'
              max='100'
              step='5'
              value={localFilters.minScore || 0}
              onChange={e =>
                setLocalFilters(prev => ({
                  ...prev,
                  minScore: parseInt(e.target.value) || undefined,
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

const TabsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 8px;
  margin-bottom: 24px;
`;

const TabButton = styled.button<{ $active?: boolean }>`
  padding: 12px 16px;
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
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;

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
