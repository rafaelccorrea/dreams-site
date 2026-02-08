import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MdClear, MdPerson, MdGroups } from 'react-icons/md';
import { FilterDrawer } from '../common/FilterDrawer';
import type { GoalFilters } from '../../hooks/useGoals';
import { goalsApi } from '../../services/goalsApi';
import {
  GOAL_TYPE_LABELS,
  GOAL_PERIOD_LABELS,
  GOAL_SCOPE_LABELS,
} from '../../types/goal';

interface GoalsFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: GoalFilters;
  onFilterChange: (filters: GoalFilters) => void;
}

const FilterSection = styled.div`
  margin-bottom: 24px;
`;

const FilterLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 14px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}15;
  }
`;

const StatusButtonsGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
`;

const StatusButton = styled.button<{ $active: boolean }>`
  padding: 10px 16px;
  border: 1px solid
    ${props =>
      props.$active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props =>
    props.$active ? props.theme.colors.primary : props.theme.colors.background};
  color: ${props => (props.$active ? 'white' : props.theme.colors.text)};

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props =>
      props.$active
        ? props.theme.colors.primaryHover
        : props.theme.colors.surface};
  }
`;

const ClearButton = styled.button`
  flex: 1;
  padding: 12px 24px;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.background};
    border-color: ${props => props.theme.colors.error};
    color: ${props => props.theme.colors.error};
  }
`;

const ApplyButton = styled.button`
  flex: 1;
  padding: 12px 24px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.primaryHover};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${props => props.theme.colors.primary}40;
  }
`;

export const GoalsFilters: React.FC<GoalsFiltersProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
}) => {
  const [filterOptions, setFilterOptions] = useState<{
    teams: Array<{ id: string; name: string }>;
    users: Array<{ id: string; name: string }>;
  }>({ teams: [], users: [] });
  const [loadingOptions, setLoadingOptions] = useState(false);
  // Filtros locais para o drawer
  const [localFilters, setLocalFilters] = useState<GoalFilters>(filters);

  // Inicializar filtros locais quando o drawer abrir
  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters);
    }
  }, [isOpen, filters]);

  // Buscar opções de filtro quando o drawer abrir
  useEffect(() => {
    if (isOpen) {
      const fetchFilterOptions = async () => {
        try {
          setLoadingOptions(true);
          const options = await goalsApi.getFilterOptions();
          setFilterOptions(options);
        } catch (error) {
          console.error('Erro ao buscar opções de filtro:', error);
        } finally {
          setLoadingOptions(false);
        }
      };
      fetchFilterOptions();
    }
  }, [isOpen]);

  const handleClearFilters = () => {
    // Limpar todos os filtros - passar objeto vazio
    const cleared = {} as any;
    setLocalFilters(cleared);
    onFilterChange(cleared);
    onClose();
  };

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
    onClose();
  };

  const hasActiveFilters = Object.keys(localFilters).length > 0;

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
      title='Filtros de Metas'
      footer={footer}
    >
      <FilterSection>
        <FilterLabel>Tipo da Meta</FilterLabel>
        <Select
          value={localFilters.type || ''}
          onChange={e =>
            setLocalFilters(prev => ({
              ...prev,
              type: (e.target.value as any) || undefined,
            }))
          }
        >
          <option value=''>Todos os Tipos</option>
          {Object.entries(GOAL_TYPE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </Select>
      </FilterSection>

      <FilterSection>
        <FilterLabel>Período</FilterLabel>
        <Select
          value={localFilters.period || ''}
          onChange={e =>
            setLocalFilters(prev => ({
              ...prev,
              period: (e.target.value as any) || undefined,
            }))
          }
        >
          <option value=''>Todos os Períodos</option>
          {Object.entries(GOAL_PERIOD_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </Select>
      </FilterSection>

      <FilterSection>
        <FilterLabel>Escopo</FilterLabel>
        <Select
          value={localFilters.scope || ''}
          onChange={e =>
            setLocalFilters(prev => ({
              ...prev,
              scope: (e.target.value as any) || undefined,
            }))
          }
        >
          <option value=''>Todos os Escopos</option>
          {Object.entries(GOAL_SCOPE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </Select>
      </FilterSection>

      {/* Filtro por Corretor */}
      <FilterSection>
        <FilterLabel>
          <MdPerson
            size={16}
            style={{ marginRight: '6px', verticalAlign: 'middle' }}
          />
          Corretor
        </FilterLabel>
        <Select
          value={localFilters.userId || ''}
          onChange={e =>
            setLocalFilters(prev => ({
              ...prev,
              userId: e.target.value || undefined,
            }))
          }
          disabled={loadingOptions}
        >
          <option value=''>Todos os Corretores</option>
          {filterOptions.users.map(user => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </Select>
      </FilterSection>

      {/* Filtro por Equipe */}
      <FilterSection>
        <FilterLabel>
          <MdGroups
            size={16}
            style={{ marginRight: '6px', verticalAlign: 'middle' }}
          />
          Equipe
        </FilterLabel>
        <Select
          value={localFilters.teamId || ''}
          onChange={e =>
            setLocalFilters(prev => ({
              ...prev,
              teamId: e.target.value || undefined,
            }))
          }
          disabled={loadingOptions}
        >
          <option value=''>Todas as Equipes</option>
          {filterOptions.teams.map(team => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </Select>
      </FilterSection>

      <FilterSection>
        <FilterLabel>Status</FilterLabel>
        <StatusButtonsGroup>
          <StatusButton
            $active={!localFilters.status}
            onClick={() =>
              setLocalFilters(prev => ({ ...prev, status: undefined }))
            }
          >
            Todas
          </StatusButton>
          <StatusButton
            $active={localFilters.status === 'active'}
            onClick={() =>
              setLocalFilters(prev => ({ ...prev, status: 'active' as any }))
            }
          >
            Ativas
          </StatusButton>
          <StatusButton
            $active={localFilters.status === 'completed'}
            onClick={() =>
              setLocalFilters(prev => ({ ...prev, status: 'completed' as any }))
            }
          >
            Completadas
          </StatusButton>
          <StatusButton
            $active={localFilters.status === 'failed'}
            onClick={() =>
              setLocalFilters(prev => ({ ...prev, status: 'failed' as any }))
            }
          >
            Falharam
          </StatusButton>
        </StatusButtonsGroup>
      </FilterSection>
    </FilterDrawer>
  );
};
