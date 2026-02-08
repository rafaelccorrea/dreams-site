import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MdFilterList, MdClear } from 'react-icons/md';
import { useDebounce } from '../../hooks/useDebounce';

const FiltersContainer = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: ${props => props.theme.shadows.sm};
`;

const FiltersHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const FiltersTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ClearFiltersButton = styled.button`
  background: transparent;
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textSecondary};
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.text};
  }
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FilterLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const FilterInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textLight};
  }
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ColorFilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
`;

const ColorFilterOption = styled.button<{
  color: string;
  $isSelected: boolean;
}>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => props.color};
  border: 2px solid
    ${props =>
      props.$isSelected
        ? props.theme.colors.primary
        : props.theme.colors.border};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    transform: scale(1.1);
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
      font-size: 10px;
      font-weight: bold;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    }
  `}
`;

const FilterStats = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  padding-top: 12px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

export interface TeamFilters {
  teamName: string;
  memberName: string;
  tag: string;
  status: string;
  color: string;
  dateRange: string;
}

interface TeamFiltersProps {
  filters: TeamFilters;
  onFiltersChange: (filters: TeamFilters) => void;
  totalTeams: number;
  filteredCount: number;
  availableColors: string[];
}

const TeamFilters: React.FC<TeamFiltersProps> = ({
  filters,
  onFiltersChange,
  totalTeams,
  filteredCount,
  availableColors,
}) => {
  // Estados locais para inputs de texto com debounce
  const [teamNameInput, setTeamNameInput] = useState(filters.teamName);
  const [memberNameInput, setMemberNameInput] = useState(filters.memberName);
  const [tagInput, setTagInput] = useState(filters.tag);

  // Aplicar debounce (500ms, mínimo 3 caracteres)
  const debouncedTeamName = useDebounce(teamNameInput, 500, 3);
  const debouncedMemberName = useDebounce(memberNameInput, 500, 3);
  const debouncedTag = useDebounce(tagInput, 500, 3);

  // Sincronizar valores debounced com os filtros
  useEffect(() => {
    if (teamNameInput.length >= 3 || teamNameInput.length === 0) {
      handleFilterChange('teamName', debouncedTeamName);
    }
  }, [debouncedTeamName]);

  useEffect(() => {
    if (memberNameInput.length >= 3 || memberNameInput.length === 0) {
      handleFilterChange('memberName', debouncedMemberName);
    }
  }, [debouncedMemberName]);

  useEffect(() => {
    if (tagInput.length >= 3 || tagInput.length === 0) {
      handleFilterChange('tag', debouncedTag);
    }
  }, [debouncedTag]);

  // Sincronizar com mudanças externas nos filtros
  useEffect(() => {
    setTeamNameInput(filters.teamName);
  }, [filters.teamName]);

  useEffect(() => {
    setMemberNameInput(filters.memberName);
  }, [filters.memberName]);

  useEffect(() => {
    setTagInput(filters.tag);
  }, [filters.tag]);

  const handleFilterChange = (key: keyof TeamFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

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

  return (
    <FiltersContainer>
      <FiltersHeader>
        <FiltersTitle>
          <MdFilterList size={18} />
          Filtros Avançados
        </FiltersTitle>
        {hasActiveFilters && (
          <ClearFiltersButton onClick={clearAllFilters}>
            <MdClear size={14} />
            Limpar Filtros
          </ClearFiltersButton>
        )}
      </FiltersHeader>

      <FiltersGrid>
        <FilterGroup>
          <FilterLabel>
            Nome da Equipe
            {teamNameInput.length > 0 && teamNameInput.length < 3 && (
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
            placeholder='Buscar por nome... (mín. 3 caracteres)'
            value={teamNameInput}
            onChange={e => setTeamNameInput(e.target.value)}
          />
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>
            Membro da Equipe
            {memberNameInput.length > 0 && memberNameInput.length < 3 && (
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
            placeholder='Nome do membro... (mín. 3 caracteres)'
            value={memberNameInput}
            onChange={e => setMemberNameInput(e.target.value)}
          />
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>
            Tag ou Categoria
            {tagInput.length > 0 && tagInput.length < 3 && (
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
            placeholder='Tag, categoria... (mín. 3 caracteres)'
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
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
      </FiltersGrid>

      <FilterStats>
        <span>Total: {totalTeams} equipes</span>
        {hasActiveFilters && (
          <>
            <span>•</span>
            <span>Filtradas: {filteredCount} equipes</span>
          </>
        )}
      </FilterStats>
    </FiltersContainer>
  );
};

export default TeamFilters;
