import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import {
  MdClear,
  MdSearch,
  MdPerson,
  MdFlag,
  MdCalendarToday,
  MdLabel,
  MdFilterList,
  MdBusiness,
  MdHome,
  MdDescription,
  MdCheckCircle,
  MdPlayArrow,
  MdSettings,
  MdViewColumn,
  MdCheckBox,
  MdWarning,
  MdAutoAwesome,
} from 'react-icons/md';
import type { KanbanFilters, KanbanFilterOptions } from '../../types/kanban';
import { FilterDrawer } from '../common/FilterDrawer';
import { ShimmerBase } from '../common/Shimmer';

interface KanbanFiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: KanbanFilters;
  filterOptions: KanbanFilterOptions;
  filterOptionsLoading?: boolean;
  onFiltersChange: (filters: KanbanFilters) => void;
  onClearFilters: () => void;
}

const formatDateForInput = (date?: Date): string => {
  if (!date) return '';
  return date.toISOString().split('T')[0];
};

export const KanbanFiltersDrawer: React.FC<KanbanFiltersDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  filterOptions,
  filterOptionsLoading = false,
  onFiltersChange,
  onClearFilters,
}) => {
  // Estado local para os filtros (não aplicados até clicar em "Aplicar")
  const [localFilters, setLocalFilters] = useState<KanbanFilters>(filters);
  const [searchInput, setSearchInput] = useState(filters.searchText || '');

  // Sincronizar estado local quando os filtros externos mudarem (ex: quando abrir o drawer)
  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters);
      setSearchInput(filters.searchText || '');
    }
  }, [filters, isOpen]);

  // Função para atualizar apenas o estado local
  const handleFilterChange = useCallback(
    (key: keyof KanbanFilters, value: any) => {
      setLocalFilters(prev => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  // Atualizar apenas o estado local da busca (sem debounce, pois não aplica imediatamente)
  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value);
    setLocalFilters(prev => ({
      ...prev,
      searchText:
        value.length >= 3 || value.length === 0 ? value : prev.searchText,
    }));
  }, []);

  const handleTagToggle = (tagId: string) => {
    const currentTags = localFilters.tags || [];
    const newTags = currentTags.includes(tagId)
      ? currentTags.filter(id => id !== tagId)
      : [...currentTags, tagId];

    handleFilterChange('tags', newTags);
  };

  // Aplicar filtros quando clicar no botão
  const handleApply = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  // Limpar filtros e aplicar imediatamente
  const handleClear = () => {
    const clearedFilters: KanbanFilters = {};
    setLocalFilters(clearedFilters);
    setSearchInput('');
    onClearFilters();
    onClose();
  };

  const hasActiveFilters = Object.values(localFilters).some(value => {
    if (Array.isArray(value)) return value.length > 0;
    if (value instanceof Date) return true;
    if (typeof value === 'object' && value !== null) return true; // Para timeInColumn
    return value !== undefined && value !== '';
  });

  const footer = (
    <>
      {hasActiveFilters && (
        <ClearButton onClick={handleClear}>
          <MdClear size={16} />
          Limpar Filtros
        </ClearButton>
      )}
      <ApplyButton onClick={handleApply}>Aplicar Filtros</ApplyButton>
    </>
  );

  return (
    <FilterDrawer
      isOpen={isOpen}
      onClose={onClose}
      title='Filtros do Kanban'
      footer={footer}
    >
      <FiltersContainer>
        {/* Busca por texto */}
        <SectionTitle>
          <MdSearch size={20} />
          Busca
        </SectionTitle>

        <FilterGroup>
          <FilterLabel>
            Buscar
            {searchInput.length > 0 && searchInput.length < 3 && (
              <SearchHint> (mín. 3 caracteres)</SearchHint>
            )}
          </FilterLabel>
          <FilterInput
            type='text'
            placeholder='Buscar por título ou descrição... (mín. 3 caracteres)'
            value={searchInput}
            onChange={e => handleSearchChange(e.target.value)}
          />
        </FilterGroup>

        {/* Sugeridos pela IA */}
        <SectionTitle>
          <MdAutoAwesome size={20} />
          Sugeridos pela IA
        </SectionTitle>
        <FilterGroup>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <SuggestionPill
              type='button'
              $active={
                localFilters.timeInColumn?.days === 3 &&
                localFilters.timeInColumn?.operator === 'more_than'
              }
              onClick={() =>
                handleFilterChange(
                  'timeInColumn',
                  localFilters.timeInColumn?.days === 3
                    ? undefined
                    : { operator: 'more_than', days: 3 }
                )
              }
            >
              Precisam follow-up (3+ dias)
            </SuggestionPill>
            <SuggestionPill
              type='button'
              $active={
                localFilters.timeInColumn?.days === 7 &&
                localFilters.timeInColumn?.operator === 'more_than'
              }
              onClick={() =>
                handleFilterChange(
                  'timeInColumn',
                  localFilters.timeInColumn?.days === 7
                    ? undefined
                    : { operator: 'more_than', days: 7 }
                )
              }
            >
              Parados 7+ dias
            </SuggestionPill>
          </div>
        </FilterGroup>

        {/* Filtros Básicos */}
        <SectionTitle>
          <MdFilterList size={20} />
          Filtros Básicos
        </SectionTitle>

        <FilterGrid>
          <FilterGroup>
            <FilterLabel>
              <MdPerson size={14} />
              Responsável
            </FilterLabel>
            {filterOptionsLoading ? (
              <FilterSelectShimmer />
            ) : (
              <FilterSelect
                value={localFilters.assigneeId || ''}
                onChange={e =>
                  handleFilterChange('assigneeId', e.target.value || undefined)
                }
              >
                <option value=''>Todos os usuários</option>
                {filterOptions.users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </FilterSelect>
            )}
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>
              <MdFlag size={14} />
              Prioridade
            </FilterLabel>
            <FilterSelect
              value={localFilters.priority || ''}
              onChange={e =>
                handleFilterChange('priority', e.target.value || undefined)
              }
            >
              <option value=''>Todas as prioridades</option>
              {filterOptions.priorities.map(priority => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              ))}
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Status (Legado)</FilterLabel>
            <FilterSelect
              value={localFilters.status || ''}
              onChange={e =>
                handleFilterChange('status', e.target.value || undefined)
              }
            >
              <option value=''>Todos os status</option>
              {filterOptions.statuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </FilterSelect>
          </FilterGroup>

          {filterOptions.columns && filterOptions.columns.length > 0 && (
            <FilterGroup>
              <FilterLabel>
                <MdViewColumn size={14} />
                Coluna
              </FilterLabel>
              <FilterSelect
                value={localFilters.columnId || ''}
                onChange={e =>
                  handleFilterChange('columnId', e.target.value || undefined)
                }
              >
                <option value=''>Todas as colunas</option>
                {filterOptions.columns.map(column => (
                  <option key={column.id} value={column.id}>
                    {column.title}
                  </option>
                ))}
              </FilterSelect>
            </FilterGroup>
          )}

          <FilterGroup>
            <FilterLabel>
              <MdCheckCircle size={14} />
              Status da Tarefa
            </FilterLabel>
            <FilterSelect
              value={localFilters.taskStatus || ''}
              onChange={e =>
                handleFilterChange('taskStatus', e.target.value || undefined)
              }
            >
              <option value=''>Todos</option>
              <option value='pending'>Pendente</option>
              <option value='in_progress'>Em Andamento</option>
              <option value='completed'>Concluída</option>
              <option value='blocked'>Bloqueada</option>
              <option value='cancelled'>Cancelada</option>
              <option value='on_hold'>Em Espera</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>
              <MdCheckBox size={14} />
              Tarefas Concluídas
            </FilterLabel>
            <FilterSelect
              value={
                localFilters.isCompleted !== undefined
                  ? String(localFilters.isCompleted)
                  : ''
              }
              onChange={e =>
                handleFilterChange(
                  'isCompleted',
                  e.target.value === '' ? undefined : e.target.value === 'true'
                )
              }
            >
              <option value=''>Todas</option>
              <option value='true'>Apenas concluídas</option>
              <option value='false'>Apenas não concluídas</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>
              <MdWarning size={14} />
              Tarefas Vencidas
            </FilterLabel>
            <FilterSelect
              value={
                localFilters.overdue !== undefined
                  ? String(localFilters.overdue)
                  : ''
              }
              onChange={e =>
                handleFilterChange(
                  'overdue',
                  e.target.value === '' ? undefined : e.target.value === 'true'
                )
              }
            >
              <option value=''>Todas</option>
              <option value='true'>Apenas vencidas</option>
              <option value='false'>Apenas não vencidas</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>
              <MdPerson size={14} />
              Criador
            </FilterLabel>
            {filterOptionsLoading ? (
              <FilterSelectShimmer />
            ) : (
              <FilterSelect
                value={localFilters.createdById || ''}
                onChange={e =>
                  handleFilterChange('createdById', e.target.value || undefined)
                }
              >
                <option value=''>Todos os criadores</option>
                {filterOptions.users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </FilterSelect>
            )}
          </FilterGroup>
        </FilterGrid>

        {/* Filtros por Relacionamentos */}
        <SectionTitle>
          <MdBusiness size={20} />
          Relacionamentos
        </SectionTitle>

        <FilterGrid>
          {(filterOptionsLoading ||
            (filterOptions.clients && filterOptions.clients.length > 0)) && (
            <FilterGroup>
              <FilterLabel>
                <MdBusiness size={14} />
                Cliente
              </FilterLabel>
              {filterOptionsLoading ? (
                <FilterSelectShimmer />
              ) : (
                <FilterSelect
                  value={localFilters.clientId || ''}
                  onChange={e =>
                    handleFilterChange('clientId', e.target.value || undefined)
                  }
                >
                  <option value=''>Todos os clientes</option>
                  {(filterOptions.clients || []).map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </FilterSelect>
              )}
            </FilterGroup>
          )}

          {(filterOptionsLoading ||
            (filterOptions.properties &&
              filterOptions.properties.length > 0)) && (
            <FilterGroup>
              <FilterLabel>
                <MdHome size={14} />
                Propriedade
              </FilterLabel>
              {filterOptionsLoading ? (
                <FilterSelectShimmer />
              ) : (
                <FilterSelect
                  value={localFilters.propertyId || ''}
                  onChange={e =>
                    handleFilterChange(
                      'propertyId',
                      e.target.value || undefined
                    )
                  }
                >
                  <option value=''>Todas as propriedades</option>
                  {(filterOptions.properties || []).map(property => (
                    <option key={property.id} value={property.id}>
                      {property.title}
                    </option>
                  ))}
                </FilterSelect>
              )}
            </FilterGroup>
          )}

          {filterOptions.documentTypes &&
            filterOptions.documentTypes.length > 0 && (
              <FilterGroup>
                <FilterLabel>
                  <MdDescription size={14} />
                  Tipo de Documento
                </FilterLabel>
                <FilterSelect
                  value={localFilters.documentType || ''}
                  onChange={e =>
                    handleFilterChange(
                      'documentType',
                      e.target.value || undefined
                    )
                  }
                >
                  <option value=''>Todos os tipos</option>
                  {filterOptions.documentTypes.map(docType => (
                    <option key={docType.value} value={docType.value}>
                      {docType.label}
                    </option>
                  ))}
                </FilterSelect>
              </FilterGroup>
            )}

          <FilterGroup>
            <FilterLabel>
              <MdDescription size={14} />
              Documentos
            </FilterLabel>
            <FilterSelect
              value={
                localFilters.hasDocuments !== undefined
                  ? String(localFilters.hasDocuments)
                  : ''
              }
              onChange={e =>
                handleFilterChange(
                  'hasDocuments',
                  e.target.value === '' ? undefined : e.target.value === 'true'
                )
              }
            >
              <option value=''>Todas</option>
              <option value='true'>Com documentos</option>
              <option value='false'>Sem documentos</option>
            </FilterSelect>
          </FilterGroup>
        </FilterGrid>

        {/* Filtros de Status */}
        <SectionTitle>
          <MdCheckCircle size={20} />
          Status
        </SectionTitle>

        <FilterGrid>
          <FilterGroup>
            <FilterLabel>Status de Validação</FilterLabel>
            <FilterSelect
              value={localFilters.validationStatus || ''}
              onChange={e =>
                handleFilterChange(
                  'validationStatus',
                  e.target.value || undefined
                )
              }
            >
              <option value=''>Todos</option>
              <option value='valid'>Válida</option>
              <option value='invalid'>Inválida</option>
              <option value='pending_validation'>Pendente</option>
              <option value='warning'>Com Avisos</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Status de Ação</FilterLabel>
            <FilterSelect
              value={localFilters.actionStatus || ''}
              onChange={e =>
                handleFilterChange('actionStatus', e.target.value || undefined)
              }
            >
              <option value=''>Todos</option>
              <option value='action_pending'>Pendente</option>
              <option value='action_completed'>Concluída</option>
              <option value='action_failed'>Falhou</option>
            </FilterSelect>
          </FilterGroup>
        </FilterGrid>

        {/* Filtros por Validações e Ações */}
        <SectionTitle>
          <MdPlayArrow size={20} />
          Validações e Ações
        </SectionTitle>

        <FilterGrid>
          {filterOptions.validationTypes &&
            filterOptions.validationTypes.length > 0 && (
              <FilterGroup>
                <FilterLabel>Tipo de Validação</FilterLabel>
                <FilterSelect
                  value={localFilters.validationType || ''}
                  onChange={e =>
                    handleFilterChange(
                      'validationType',
                      e.target.value || undefined
                    )
                  }
                >
                  <option value=''>Todos os tipos</option>
                  {filterOptions.validationTypes.map(vType => (
                    <option key={vType.value} value={vType.value}>
                      {vType.label}
                    </option>
                  ))}
                </FilterSelect>
              </FilterGroup>
            )}

          {filterOptions.actionTypes &&
            filterOptions.actionTypes.length > 0 && (
              <FilterGroup>
                <FilterLabel>Tipo de Ação</FilterLabel>
                <FilterSelect
                  value={localFilters.actionType || ''}
                  onChange={e =>
                    handleFilterChange(
                      'actionType',
                      e.target.value || undefined
                    )
                  }
                >
                  <option value=''>Todos os tipos</option>
                  {filterOptions.actionTypes.map(aType => (
                    <option key={aType.value} value={aType.value}>
                      {aType.label}
                    </option>
                  ))}
                </FilterSelect>
              </FilterGroup>
            )}

          <FilterGroup>
            <CheckboxLabel>
              <input
                type='checkbox'
                checked={localFilters.hasFailedValidations || false}
                onChange={e =>
                  handleFilterChange(
                    'hasFailedValidations',
                    e.target.checked || undefined
                  )
                }
              />
              <span>Tarefas com validações falhadas</span>
            </CheckboxLabel>
          </FilterGroup>

          <FilterGroup>
            <CheckboxLabel>
              <input
                type='checkbox'
                checked={localFilters.hasWarnings || false}
                onChange={e =>
                  handleFilterChange(
                    'hasWarnings',
                    e.target.checked || undefined
                  )
                }
              />
              <span>Tarefas com avisos</span>
            </CheckboxLabel>
          </FilterGroup>

          <FilterGroup>
            <CheckboxLabel>
              <input
                type='checkbox'
                checked={localFilters.hasPendingActions || false}
                onChange={e =>
                  handleFilterChange(
                    'hasPendingActions',
                    e.target.checked || undefined
                  )
                }
              />
              <span>Tarefas com ações pendentes</span>
            </CheckboxLabel>
          </FilterGroup>
        </FilterGrid>

        {/* Filtros de Data */}
        <SectionTitle>
          <MdCalendarToday size={20} />
          Datas de Vencimento
        </SectionTitle>

        <DateRangeContainer>
          <FilterGroup>
            <FilterLabel>Data Inicial</FilterLabel>
            <FilterDateInput
              type='date'
              value={formatDateForInput(localFilters.dueDateFrom)}
              onChange={e =>
                handleFilterChange(
                  'dueDateFrom',
                  e.target.value ? new Date(e.target.value) : undefined
                )
              }
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Data Final</FilterLabel>
            <FilterDateInput
              type='date'
              value={formatDateForInput(localFilters.dueDateTo)}
              onChange={e =>
                handleFilterChange(
                  'dueDateTo',
                  e.target.value ? new Date(e.target.value) : undefined
                )
              }
            />
          </FilterGroup>
        </DateRangeContainer>

        {/* Datas de Criação */}
        <SectionTitle>
          <MdCalendarToday size={20} />
          Datas de Criação
        </SectionTitle>

        <DateRangeContainer>
          <FilterGroup>
            <FilterLabel>Data Inicial</FilterLabel>
            <FilterDateInput
              type='date'
              value={formatDateForInput(localFilters.createdFrom)}
              onChange={e =>
                handleFilterChange(
                  'createdFrom',
                  e.target.value ? new Date(e.target.value) : undefined
                )
              }
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Data Final</FilterLabel>
            <FilterDateInput
              type='date'
              value={formatDateForInput(localFilters.createdTo)}
              onChange={e =>
                handleFilterChange(
                  'createdTo',
                  e.target.value ? new Date(e.target.value) : undefined
                )
              }
            />
          </FilterGroup>
        </DateRangeContainer>

        {/* Datas de Atualização */}
        <SectionTitle>
          <MdCalendarToday size={20} />
          Datas de Atualização
        </SectionTitle>

        <DateRangeContainer>
          <FilterGroup>
            <FilterLabel>Data Inicial</FilterLabel>
            <FilterDateInput
              type='date'
              value={formatDateForInput(localFilters.updatedFrom)}
              onChange={e =>
                handleFilterChange(
                  'updatedFrom',
                  e.target.value ? new Date(e.target.value) : undefined
                )
              }
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Data Final</FilterLabel>
            <FilterDateInput
              type='date'
              value={formatDateForInput(localFilters.updatedTo)}
              onChange={e =>
                handleFilterChange(
                  'updatedTo',
                  e.target.value ? new Date(e.target.value) : undefined
                )
              }
            />
          </FilterGroup>
        </DateRangeContainer>

        {/* Filtros Avançados */}
        <SectionTitle>
          <MdSettings size={20} />
          Filtros Avançados
        </SectionTitle>

        <FilterGrid>
          <FilterGroup>
            <FilterLabel>Última Movimentação - De</FilterLabel>
            <FilterDateInput
              type='date'
              value={formatDateForInput(localFilters.lastMovedAfter)}
              onChange={e =>
                handleFilterChange(
                  'lastMovedAfter',
                  e.target.value ? new Date(e.target.value) : undefined
                )
              }
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Última Movimentação - Até</FilterLabel>
            <FilterDateInput
              type='date'
              value={formatDateForInput(localFilters.lastMovedBefore)}
              onChange={e =>
                handleFilterChange(
                  'lastMovedBefore',
                  e.target.value ? new Date(e.target.value) : undefined
                )
              }
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Tempo na Coluna (dias)</FilterLabel>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <FilterSelect
                value={localFilters.timeInColumn?.operator || ''}
                onChange={e => {
                  const operator = e.target.value as
                    | 'more_than'
                    | 'less_than'
                    | '';
                  if (operator && localFilters.timeInColumn?.days) {
                    handleFilterChange('timeInColumn', {
                      operator,
                      days: localFilters.timeInColumn.days,
                    });
                  } else if (operator) {
                    handleFilterChange('timeInColumn', { operator, days: 0 });
                  } else {
                    handleFilterChange('timeInColumn', undefined);
                  }
                }}
                style={{ flex: '0 0 120px' }}
              >
                <option value=''>Selecione</option>
                <option value='more_than'>Mais que</option>
                <option value='less_than'>Menos que</option>
              </FilterSelect>
              <NumberInput
                type='number'
                min='0'
                placeholder='Dias'
                value={localFilters.timeInColumn?.days || ''}
                onChange={e => {
                  const days = parseInt(e.target.value) || 0;
                  if (localFilters.timeInColumn?.operator && days > 0) {
                    handleFilterChange('timeInColumn', {
                      operator: localFilters.timeInColumn.operator,
                      days,
                    });
                  } else if (days === 0) {
                    handleFilterChange('timeInColumn', undefined);
                  }
                }}
                style={{ flex: 1 }}
              />
            </div>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Movimentações Mínimas</FilterLabel>
            <NumberInput
              type='number'
              min='0'
              placeholder='Mínimo'
              value={localFilters.minMovements || ''}
              onChange={e =>
                handleFilterChange(
                  'minMovements',
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Movimentações Máximas</FilterLabel>
            <NumberInput
              type='number'
              min='0'
              placeholder='Máximo'
              value={localFilters.maxMovements || ''}
              onChange={e =>
                handleFilterChange(
                  'maxMovements',
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
            />
          </FilterGroup>
        </FilterGrid>

        {/* Tags */}
        {filterOptions.tags.length > 0 && (
          <>
            <SectionTitle>
              <MdLabel size={20} />
              Tags
            </SectionTitle>

            <TagSelector>
              {filterOptions.tags.map(tag => (
                <TagOption
                  key={tag.id}
                  $selected={(localFilters.tags || []).includes(tag.id)}
                  onClick={() => handleTagToggle(tag.id)}
                >
                  {tag.name}
                </TagOption>
              ))}
            </TagSelector>
          </>
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

const SuggestionPill = styled.button<{ $active?: boolean }>`
  padding: 8px 14px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props =>
    props.$active
      ? props.theme.colors.primary + '18'
      : props.theme.colors.backgroundSecondary};
  color: ${props =>
    props.$active ? props.theme.colors.primary : props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primary + '12'};
  }
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
  background: ${props => props.theme.colors.background};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}20`};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const FilterSelect = styled.select`
  background: ${props => props.theme.colors.background};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}20`};
  }
`;

const FilterSelectShimmer = styled(ShimmerBase)`
  height: 44px;
  border-radius: 10px;
  width: 100%;
`;

const FilterDateInput = styled.input`
  background: ${props => props.theme.colors.background};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}20`};
  }
`;

const NumberInput = styled.input`
  background: ${props => props.theme.colors.background};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}20`};
  }
`;

const DateRangeContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TagSelector = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const TagOption = styled.button<{ $selected: boolean }>`
  background: ${props =>
    props.$selected
      ? props.theme.colors.primary
      : props.theme.colors.background};
  color: ${props => (props.$selected ? 'white' : props.theme.colors.text)};
  border: 2px solid
    ${props =>
      props.$selected ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 20px;
  padding: 8px 14px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props =>
      props.$selected
        ? props.theme.colors.primaryDark
        : `${props.theme.colors.primary}15`};
    border-color: ${props => props.theme.colors.primary};
    color: ${props => (props.$selected ? 'white' : props.theme.colors.primary)};
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  user-select: none;

  input[type='checkbox'] {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: ${props => props.theme.colors.primary};
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
