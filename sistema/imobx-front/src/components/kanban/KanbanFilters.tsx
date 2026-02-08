import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  MdFilterList,
  MdClear,
  MdSearch,
  MdPerson,
  MdFlag,
  MdCalendarToday,
  MdLabel,
  MdBusiness,
  MdHome,
  MdDescription,
  MdCheckCircle,
  MdPlayArrow,
  MdSettings,
  MdViewColumn,
  MdCheckBox,
  MdWarning,
} from 'react-icons/md';
import type { KanbanFilters, KanbanFilterOptions } from '../../types/kanban';
import { useDebounce } from '../../hooks/useDebounce';

interface KanbanFiltersProps {
  filters: KanbanFilters;
  filterOptions: KanbanFilterOptions;
  onFiltersChange: (filters: KanbanFilters) => void;
  onClearFilters: () => void;
  className?: string;
}

const FiltersContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
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

const FiltersActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ClearButton = styled.button`
  background: transparent;
  color: ${props => props.theme.colors.textSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 0.75rem;
  font-weight: 500;
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
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FilterLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const FilterInput = styled.input`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  padding: 8px 12px;
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
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  padding: 8px 12px;
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

const FilterDateInput = styled.input`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  padding: 8px 12px;
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

const TagSelector = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
`;

const TagOption = styled.button<{ selected: boolean }>`
  background: ${props =>
    props.selected
      ? props.theme.colors.primary
      : props.theme.colors.background};
  color: ${props => (props.selected ? 'white' : props.theme.colors.text)};
  border: 1px solid
    ${props =>
      props.selected ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 16px;
  padding: 4px 8px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props =>
      props.selected
        ? props.theme.colors.primaryDark
        : props.theme.colors.border};
  }
`;

const FilterSection = styled.div`
  grid-column: 1 / -1;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const SectionTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
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

const NumberInput = styled.input`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}20`};
  }
`;

const UserOption = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.border};
  }
`;

const UserAvatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const UserEmail = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const formatDateForInput = (date?: Date): string => {
  if (!date) return '';
  return date.toISOString().split('T')[0];
};

export const KanbanFiltersComponent: React.FC<KanbanFiltersProps> = ({
  filters,
  filterOptions,
  onFiltersChange,
  onClearFilters,
  className,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Estado local para busca com debounce
  const [searchInput, setSearchInput] = useState(filters.searchText || '');

  // Aplicar debounce (500ms, mínimo 3 caracteres)
  const debouncedSearch = useDebounce(searchInput, 500, 3);

  // Sincronizar valor debounced com os filtros
  useEffect(() => {
    if (searchInput.length >= 3 || searchInput.length === 0) {
      handleFilterChange('searchText', debouncedSearch);
    }
  }, [debouncedSearch]);

  // Sincronizar com mudanças externas nos filtros
  useEffect(() => {
    setSearchInput(filters.searchText || '');
  }, [filters.searchText]);

  const handleFilterChange = (key: keyof KanbanFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handleTagToggle = (tagId: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tagId)
      ? currentTags.filter(id => id !== tagId)
      : [...currentTags, tagId];

    handleFilterChange('tags', newTags);
  };

  const hasActiveFilters = Object.values(filters).some(value => {
    if (Array.isArray(value)) return value.length > 0;
    if (value instanceof Date) return true;
    return value !== undefined && value !== '';
  });

  return (
    <FiltersContainer className={className}>
      <FiltersHeader>
        <FiltersTitle>
          <MdFilterList size={16} />
          Filtros Avançados
        </FiltersTitle>
        <FiltersActions>
          {hasActiveFilters && (
            <ClearButton onClick={onClearFilters}>
              <MdClear size={14} />
              Limpar Filtros
            </ClearButton>
          )}
        </FiltersActions>
      </FiltersHeader>

      <FiltersGrid>
        {/* Busca por texto */}
        <FilterGroup>
          <FilterLabel>
            <MdSearch size={14} />
            Buscar
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
            placeholder='Buscar por título ou descrição... (mín. 3 caracteres)'
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
          />
        </FilterGroup>

        {/* Filtro por usuário */}
        <FilterGroup>
          <FilterLabel>
            <MdPerson size={14} />
            Responsável
          </FilterLabel>
          <FilterSelect
            value={filters.assigneeId || ''}
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
        </FilterGroup>

        {/* Filtro por prioridade */}
        <FilterGroup>
          <FilterLabel>
            <MdFlag size={14} />
            Prioridade
          </FilterLabel>
          <FilterSelect
            value={filters.priority || ''}
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

        {/* Filtro por status (legado - mantido para compatibilidade) */}
        <FilterGroup>
          <FilterLabel>Status (Legado)</FilterLabel>
          <FilterSelect
            value={filters.status || ''}
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

        {/* Filtro por coluna */}
        {filterOptions.columns && filterOptions.columns.length > 0 && (
          <FilterGroup>
            <FilterLabel>
              <MdViewColumn size={14} />
              Coluna
            </FilterLabel>
            <FilterSelect
              value={filters.columnId || ''}
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

        {/* Filtro por status da tarefa */}
        <FilterGroup>
          <FilterLabel>
            <MdCheckCircle size={14} />
            Status da Tarefa
          </FilterLabel>
          <FilterSelect
            value={filters.taskStatus || ''}
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

        {/* Filtro por tarefas concluídas */}
        <FilterGroup>
          <FilterLabel>
            <MdCheckBox size={14} />
            Tarefas Concluídas
          </FilterLabel>
          <FilterSelect
            value={
              filters.isCompleted !== undefined
                ? String(filters.isCompleted)
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

        {/* Filtro por tarefas vencidas */}
        <FilterGroup>
          <FilterLabel>
            <MdWarning size={14} />
            Tarefas Vencidas
          </FilterLabel>
          <FilterSelect
            value={filters.overdue !== undefined ? String(filters.overdue) : ''}
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

        {/* Filtro por cliente */}
        {filterOptions.clients && filterOptions.clients.length > 0 && (
          <FilterGroup>
            <FilterLabel>
              <MdBusiness size={14} />
              Cliente
            </FilterLabel>
            <FilterSelect
              value={filters.clientId || ''}
              onChange={e =>
                handleFilterChange('clientId', e.target.value || undefined)
              }
            >
              <option value=''>Todos os clientes</option>
              {filterOptions.clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </FilterSelect>
          </FilterGroup>
        )}

        {/* Filtro por propriedade */}
        {filterOptions.properties && filterOptions.properties.length > 0 && (
          <FilterGroup>
            <FilterLabel>
              <MdHome size={14} />
              Propriedade
            </FilterLabel>
            <FilterSelect
              value={filters.propertyId || ''}
              onChange={e =>
                handleFilterChange('propertyId', e.target.value || undefined)
              }
            >
              <option value=''>Todas as propriedades</option>
              {filterOptions.properties.map(property => (
                <option key={property.id} value={property.id}>
                  {property.title}
                </option>
              ))}
            </FilterSelect>
          </FilterGroup>
        )}

        {/* Filtro por criador */}
        <FilterGroup>
          <FilterLabel>
            <MdPerson size={14} />
            Criador
          </FilterLabel>
          <FilterSelect
            value={filters.createdById || ''}
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
        </FilterGroup>

        {/* Filtro por tipo de documento */}
        {filterOptions.documentTypes &&
          filterOptions.documentTypes.length > 0 && (
            <FilterGroup>
              <FilterLabel>
                <MdDescription size={14} />
                Tipo de Documento
              </FilterLabel>
              <FilterSelect
                value={filters.documentType || ''}
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

        {/* Filtro por documentos */}
        <FilterGroup>
          <FilterLabel>
            <MdDescription size={14} />
            Documentos
          </FilterLabel>
          <FilterSelect
            value={
              filters.hasDocuments !== undefined
                ? String(filters.hasDocuments)
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

        {/* Filtros de data - só mostrar se expandido */}
        {showAdvanced && (
          <>
            <FilterGroup>
              <FilterLabel>
                <MdCalendarToday size={14} />
                Data de Vencimento - De
              </FilterLabel>
              <FilterDateInput
                type='date'
                value={formatDateForInput(filters.dueDateFrom)}
                onChange={e =>
                  handleFilterChange(
                    'dueDateFrom',
                    e.target.value ? new Date(e.target.value) : undefined
                  )
                }
              />
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>
                <MdCalendarToday size={14} />
                Data de Vencimento - Até
              </FilterLabel>
              <FilterDateInput
                type='date'
                value={formatDateForInput(filters.dueDateTo)}
                onChange={e =>
                  handleFilterChange(
                    'dueDateTo',
                    e.target.value ? new Date(e.target.value) : undefined
                  )
                }
              />
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>
                <MdCalendarToday size={14} />
                Data de Criação - De
              </FilterLabel>
              <FilterDateInput
                type='date'
                value={formatDateForInput(filters.createdFrom)}
                onChange={e =>
                  handleFilterChange(
                    'createdFrom',
                    e.target.value ? new Date(e.target.value) : undefined
                  )
                }
              />
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>
                <MdCalendarToday size={14} />
                Data de Criação - Até
              </FilterLabel>
              <FilterDateInput
                type='date'
                value={formatDateForInput(filters.createdTo)}
                onChange={e =>
                  handleFilterChange(
                    'createdTo',
                    e.target.value ? new Date(e.target.value) : undefined
                  )
                }
              />
            </FilterGroup>
          </>
        )}

        {/* Tags */}
        {filterOptions.tags.length > 0 && (
          <FilterGroup style={{ gridColumn: '1 / -1' }}>
            <FilterLabel>
              <MdLabel size={14} />
              Tags
            </FilterLabel>
            <TagSelector>
              {filterOptions.tags.map(tag => (
                <TagOption
                  key={tag.id}
                  selected={(filters.tags || []).includes(tag.id)}
                  onClick={() => handleTagToggle(tag.id)}
                >
                  {tag.name}
                </TagOption>
              ))}
            </TagSelector>
          </FilterGroup>
        )}
      </FiltersGrid>

      {/* Filtros de Status */}
      {showAdvanced && (
        <FilterSection>
          <SectionTitle>
            <MdCheckCircle size={16} />
            Status
          </SectionTitle>
          <FiltersGrid>
            <FilterGroup>
              <FilterLabel>Status da Tarefa</FilterLabel>
              <FilterSelect
                value={filters.taskStatus || ''}
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
              <FilterLabel>Status de Validação</FilterLabel>
              <FilterSelect
                value={filters.validationStatus || ''}
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
                value={filters.actionStatus || ''}
                onChange={e =>
                  handleFilterChange(
                    'actionStatus',
                    e.target.value || undefined
                  )
                }
              >
                <option value=''>Todos</option>
                <option value='action_pending'>Pendente</option>
                <option value='action_completed'>Concluída</option>
                <option value='action_failed'>Falhou</option>
              </FilterSelect>
            </FilterGroup>
          </FiltersGrid>
        </FilterSection>
      )}

      {/* Filtros por Relacionamentos - Removido da seção avançada pois já está na seção básica */}

      {/* Filtros por Validações e Ações */}
      {showAdvanced && (
        <FilterSection>
          <SectionTitle>
            <MdPlayArrow size={16} />
            Validações e Ações
          </SectionTitle>
          <FiltersGrid>
            {filterOptions.validationTypes &&
              filterOptions.validationTypes.length > 0 && (
                <FilterGroup>
                  <FilterLabel>Tipo de Validação</FilterLabel>
                  <FilterSelect
                    value={filters.validationType || ''}
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
                    value={filters.actionType || ''}
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
                  checked={filters.hasFailedValidations || false}
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
                  checked={filters.hasWarnings || false}
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
                  checked={filters.hasPendingActions || false}
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
          </FiltersGrid>
        </FilterSection>
      )}

      {/* Filtros Avançados */}
      {showAdvanced && (
        <FilterSection>
          <SectionTitle>
            <MdSettings size={16} />
            Filtros Avançados
          </SectionTitle>
          <FiltersGrid>
            <FilterGroup>
              <FilterLabel>
                <MdCalendarToday size={14} />
                Data de Atualização - De
              </FilterLabel>
              <FilterDateInput
                type='date'
                value={formatDateForInput(filters.updatedFrom)}
                onChange={e =>
                  handleFilterChange(
                    'updatedFrom',
                    e.target.value ? new Date(e.target.value) : undefined
                  )
                }
              />
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>
                <MdCalendarToday size={14} />
                Data de Atualização - Até
              </FilterLabel>
              <FilterDateInput
                type='date'
                value={formatDateForInput(filters.updatedTo)}
                onChange={e =>
                  handleFilterChange(
                    'updatedTo',
                    e.target.value ? new Date(e.target.value) : undefined
                  )
                }
              />
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Última Movimentação - De</FilterLabel>
              <FilterDateInput
                type='date'
                value={formatDateForInput(filters.lastMovedAfter)}
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
                value={formatDateForInput(filters.lastMovedBefore)}
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
              <div
                style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
              >
                <FilterSelect
                  value={filters.timeInColumn?.operator || ''}
                  onChange={e => {
                    const operator = e.target.value as
                      | 'more_than'
                      | 'less_than'
                      | '';
                    if (operator && filters.timeInColumn?.days) {
                      handleFilterChange('timeInColumn', {
                        operator,
                        days: filters.timeInColumn.days,
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
                  value={filters.timeInColumn?.days || ''}
                  onChange={e => {
                    const days = parseInt(e.target.value) || 0;
                    if (filters.timeInColumn?.operator && days > 0) {
                      handleFilterChange('timeInColumn', {
                        operator: filters.timeInColumn.operator,
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
                value={filters.minMovements || ''}
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
                value={filters.maxMovements || ''}
                onChange={e =>
                  handleFilterChange(
                    'maxMovements',
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
              />
            </FilterGroup>
          </FiltersGrid>
        </FilterSection>
      )}

      <div style={{ marginTop: '16px', textAlign: 'center' }}>
        <ClearButton onClick={() => setShowAdvanced(!showAdvanced)}>
          {showAdvanced ? 'Menos opções' : 'Mais opções'}
        </ClearButton>
      </div>
    </FiltersContainer>
  );
};

export default KanbanFiltersComponent;
