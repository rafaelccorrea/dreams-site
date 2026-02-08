import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { MdClear, MdSearch, MdPeople, MdPerson } from 'react-icons/md';
import { FilterDrawer } from '../common/FilterDrawer';

export interface TeamFilters {
  teamName: string;
  memberName: string;
  tag: string;
  status: string;
  color: string;
  dateRange: string;
}

interface TeamFiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: TeamFilters;
  onFiltersChange: (filters: TeamFilters) => void;
  totalTeams: number;
  filteredCount: number;
  availableColors: string[];
}

export const TeamFiltersDrawer: React.FC<TeamFiltersDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  totalTeams,
  filteredCount,
  availableColors,
}) => {
  const [teamNameInput, setTeamNameInput] = useState(filters.teamName);
  const [memberNameInput, setMemberNameInput] = useState(filters.memberName);
  const [tagInput, setTagInput] = useState(filters.tag);

  const teamDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const memberDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const tagDebounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setTeamNameInput(filters.teamName);
    setMemberNameInput(filters.memberName);
    setTagInput(filters.tag);
  }, [filters.teamName, filters.memberName, filters.tag]);

  const handleFilterChange = useCallback(
    (key: keyof TeamFilters, value: string) => {
      onFiltersChange({
        ...filters,
        [key]: value,
      });
    },
    [filters, onFiltersChange]
  );

  const handleTeamNameChange = (value: string) => {
    setTeamNameInput(value);
    if (teamDebounceRef.current) clearTimeout(teamDebounceRef.current);

    if (value.length >= 3 || value.length === 0) {
      teamDebounceRef.current = setTimeout(() => {
        handleFilterChange('teamName', value);
      }, 500);
    }
  };

  const handleMemberNameChange = (value: string) => {
    setMemberNameInput(value);
    if (memberDebounceRef.current) clearTimeout(memberDebounceRef.current);

    if (value.length >= 3 || value.length === 0) {
      memberDebounceRef.current = setTimeout(() => {
        handleFilterChange('memberName', value);
      }, 500);
    }
  };

  const handleTagChange = (value: string) => {
    setTagInput(value);
    if (tagDebounceRef.current) clearTimeout(tagDebounceRef.current);

    if (value.length >= 3 || value.length === 0) {
      tagDebounceRef.current = setTimeout(() => {
        handleFilterChange('tag', value);
      }, 500);
    }
  };

  useEffect(() => {
    return () => {
      if (teamDebounceRef.current) clearTimeout(teamDebounceRef.current);
      if (memberDebounceRef.current) clearTimeout(memberDebounceRef.current);
      if (tagDebounceRef.current) clearTimeout(tagDebounceRef.current);
    };
  }, []);

  const handleColorFilter = (color: string) => {
    const newColor = filters.color === color ? '' : color;
    handleFilterChange('color', newColor);
  };

  const clearAllFilters = () => {
    setTeamNameInput('');
    setMemberNameInput('');
    setTagInput('');
    onFiltersChange({
      teamName: '',
      memberName: '',
      tag: '',
      status: '',
      color: '',
      dateRange: '',
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  const footer = (
    <>
      {hasActiveFilters && (
        <ClearButton onClick={clearAllFilters}>
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
      title='Filtros'
      footer={footer}
    >
      <FiltersContainer>
        {/* Busca por Equipe */}
        <SectionTitle>
          <MdPeople size={20} />
          Buscar Equipe
        </SectionTitle>

        <FilterGroup>
          <FilterLabel>
            Nome da Equipe
            {teamNameInput.length > 0 && teamNameInput.length < 3 && (
              <SearchHint> (mín. 3 caracteres)</SearchHint>
            )}
          </FilterLabel>
          <FilterInput
            type='text'
            placeholder='Buscar por nome... (mín. 3 caracteres)'
            value={teamNameInput}
            onChange={e => handleTeamNameChange(e.target.value)}
          />
        </FilterGroup>

        {/* Busca por Membro */}
        <SectionTitle>
          <MdPerson size={20} />
          Buscar Membro
        </SectionTitle>

        <FilterGroup>
          <FilterLabel>
            Membro da Equipe
            {memberNameInput.length > 0 && memberNameInput.length < 3 && (
              <SearchHint> (mín. 3 caracteres)</SearchHint>
            )}
          </FilterLabel>
          <FilterInput
            type='text'
            placeholder='Nome do membro... (mín. 3 caracteres)'
            value={memberNameInput}
            onChange={e => handleMemberNameChange(e.target.value)}
          />
        </FilterGroup>

        {/* Filtros Adicionais */}
        <SectionTitle>
          <MdSearch size={20} />
          Filtros Adicionais
        </SectionTitle>

        <FilterGrid>
          <FilterGroup>
            <FilterLabel>
              Tag ou Categoria
              {tagInput.length > 0 && tagInput.length < 3 && (
                <SearchHint> (mín. 3)</SearchHint>
              )}
            </FilterLabel>
            <FilterInput
              type='text'
              placeholder='Tag, categoria...'
              value={tagInput}
              onChange={e => handleTagChange(e.target.value)}
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Status</FilterLabel>
            <FilterSelect
              value={filters.status}
              onChange={e => handleFilterChange('status', e.target.value)}
            >
              <option value=''>Todos os status</option>
              <option value='active'>Ativo</option>
              <option value='inactive'>Inativo</option>
              <option value='archived'>Arquivado</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Período de Criação</FilterLabel>
            <FilterSelect
              value={filters.dateRange}
              onChange={e => handleFilterChange('dateRange', e.target.value)}
            >
              <option value=''>Todos os períodos</option>
              <option value='today'>Hoje</option>
              <option value='week'>Esta semana</option>
              <option value='month'>Este mês</option>
              <option value='quarter'>Este trimestre</option>
              <option value='year'>Este ano</option>
            </FilterSelect>
          </FilterGroup>
        </FilterGrid>

        {/* Filtro de Cor */}
        <FilterGroup>
          <FilterLabel>Cor da Equipe</FilterLabel>
          <ColorFilterContainer>
            {availableColors.map(color => (
              <ColorFilterOption
                key={color}
                color={color}
                $isSelected={filters.color === color}
                onClick={() => handleColorFilter(color)}
                title={`Filtrar por cor ${color}`}
              />
            ))}
          </ColorFilterContainer>
        </FilterGroup>

        {/* Estatísticas */}
        {hasActiveFilters && (
          <FilterStats>
            <span>Total: {totalTeams} equipes</span>
            <span>•</span>
            <span>Filtradas: {filteredCount} equipes</span>
          </FilterStats>
        )}
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

const ColorFilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const ColorFilterOption = styled.button<{
  color: string;
  $isSelected: boolean;
}>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.color};
  border: 3px solid
    ${props =>
      props.$isSelected
        ? props.theme.colors.primary
        : props.theme.colors.border};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    transform: scale(1.15);
    border-color: ${props => props.theme.colors.primary};
  }

  ${props =>
    props.$isSelected &&
    `
    &::after {
      content: '✓';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-size: 14px;
      font-weight: bold;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
    }
  `}
`;

const FilterStats = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  padding: 16px;
  background: ${props => props.theme.colors.background};
  border-radius: 10px;
  border: 1px solid ${props => props.theme.colors.border};
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
