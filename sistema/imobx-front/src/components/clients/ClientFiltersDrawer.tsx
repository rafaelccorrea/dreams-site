import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MdSearch, MdClear, MdPerson, MdPeople } from 'react-icons/md';
import { FilterDrawer } from '../common/FilterDrawer';
import DataScopeFilter from '../common/DataScopeFilter';
import type { ClientFilters } from '../../types/filters';
import { useUsers } from '../../hooks/useUsers';
import { useRoleAccess } from '../../hooks/useRoleAccess';

interface ClientFiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ClientFilters;
  onFiltersChange: (filters: ClientFilters) => void;
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

export const ClientFiltersDrawer: React.FC<ClientFiltersDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  loading = false,
}) => {
  const [localFilters, setLocalFilters] = useState<ClientFilters>(filters);
  const { users, getUsers } = useUsers();
  const { hasRoleAccess } = useRoleAccess();

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Carregar usuários para o filtro de responsável quando o Drawer abrir
  useEffect(() => {
    if (isOpen) {
      getUsers({ limit: 100 }).catch(() => {});
    }
  }, [isOpen, getUsers]);

  const handleFilterChange = (key: keyof ClientFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const handleApply = () => {
    // Remover filtro de responsável se o usuário não tiver acesso (apenas admin/manager/master podem ver/usar)
    const canUseResponsible = hasRoleAccess(['admin', 'manager', 'master']);
    const next = { ...localFilters } as ClientFilters;
    if (!canUseResponsible) {
      delete (next as any).responsibleUserId;
    }
    onFiltersChange(next);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters: ClientFilters = {
      search: '',
      type: undefined,
      status: undefined,
      city: undefined,
      neighborhood: undefined,
      name: undefined,
      email: undefined,
      phone: undefined,
      document: undefined,
      isActive: undefined,
      responsibleUserId: undefined,
      createdFrom: undefined,
      createdTo: undefined,
      onlyMyData: false,
      sortBy: undefined,
      sortOrder: undefined,
      page: 1,
      limit: 50,
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
      title='Filtros de Clientes'
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
              placeholder='Buscar por nome, email ou telefone...'
              value={localFilters.search || ''}
              onChange={e => handleFilterChange('search', e.target.value)}
              disabled={loading}
            />
          </SearchContainer>
        </FilterSection>

        <FilterSection>
          <FilterSectionTitle>
            <MdPerson size={20} />
            Filtros por Categoria
          </FilterSectionTitle>

          <FilterGroup>
            <FilterLabel>Tipo de Cliente</FilterLabel>
            <FilterSelect
              value={localFilters.type || ''}
              onChange={e =>
                handleFilterChange('type', e.target.value || undefined)
              }
              disabled={loading}
            >
              <option value=''>Todos os tipos</option>
              <option value='buyer'>Comprador</option>
              <option value='seller'>Vendedor</option>
              <option value='renter'>Locatário</option>
              <option value='lessor'>Locador</option>
              <option value='investor'>Investidor</option>
              <option value='general'>Geral</option>
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
              <option value='active'>Ativo</option>
              <option value='inactive'>Inativo</option>
              <option value='contacted'>Contactado</option>
              <option value='interested'>Interessado</option>
              <option value='closed'>Fechado</option>
            </FilterSelect>
          </FilterGroup>
        </FilterSection>

        <FilterSection>
          <FilterSectionTitle>
            <MdPerson size={20} />
            Dados e Localização
          </FilterSectionTitle>

          <FilterGroup>
            <FilterLabel>Nome</FilterLabel>
            <FilterInput
              type='text'
              placeholder='Nome do cliente'
              value={localFilters.name || ''}
              onChange={e =>
                handleFilterChange('name', e.target.value || undefined)
              }
              disabled={loading}
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Email</FilterLabel>
            <FilterInput
              type='text'
              placeholder='email@exemplo.com'
              value={localFilters.email || ''}
              onChange={e =>
                handleFilterChange('email', e.target.value || undefined)
              }
              disabled={loading}
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Telefone</FilterLabel>
            <FilterInput
              type='text'
              placeholder='(00) 00000-0000'
              value={localFilters.phone || ''}
              onChange={e =>
                handleFilterChange('phone', e.target.value || undefined)
              }
              disabled={loading}
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>CPF</FilterLabel>
            <FilterInput
              type='text'
              placeholder='000.000.000-00'
              value={localFilters.document || ''}
              onChange={e =>
                handleFilterChange('document', e.target.value || undefined)
              }
              disabled={loading}
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Cidade</FilterLabel>
            <FilterInput
              type='text'
              placeholder='Cidade'
              value={localFilters.city || ''}
              onChange={e =>
                handleFilterChange('city', e.target.value || undefined)
              }
              disabled={loading}
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Bairro</FilterLabel>
            <FilterInput
              type='text'
              placeholder='Bairro'
              value={localFilters.neighborhood || ''}
              onChange={e =>
                handleFilterChange('neighborhood', e.target.value || undefined)
              }
              disabled={loading}
            />
          </FilterGroup>

          {hasRoleAccess(['admin', 'manager', 'master']) && (
            <FilterGroup>
              <FilterLabel>Responsável</FilterLabel>
              <FilterSelect
                value={localFilters.responsibleUserId || ''}
                onChange={e =>
                  handleFilterChange(
                    'responsibleUserId',
                    e.target.value || undefined
                  )
                }
                disabled={loading}
              >
                <option value=''>Todos</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </FilterSelect>
            </FilterGroup>
          )}
        </FilterSection>

        <FilterSection>
          <FilterSectionTitle>
            <MdPeople size={20} />
            Período e Status
          </FilterSectionTitle>

          <FilterGroup>
            <FilterLabel>Data Inicial (criação)</FilterLabel>
            <FilterInput
              type='date'
              value={localFilters.createdFrom || ''}
              onChange={e =>
                handleFilterChange('createdFrom', e.target.value || undefined)
              }
              disabled={loading}
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Data Final (criação)</FilterLabel>
            <FilterInput
              type='date'
              value={localFilters.createdTo || ''}
              onChange={e =>
                handleFilterChange('createdTo', e.target.value || undefined)
              }
              disabled={loading}
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Atividade</FilterLabel>
            <FilterSelect
              value={
                typeof localFilters.isActive === 'boolean'
                  ? String(localFilters.isActive)
                  : ''
              }
              onChange={e => {
                const v = e.target.value;
                handleFilterChange(
                  'isActive',
                  v === '' ? undefined : v === 'true'
                );
              }}
              disabled={loading}
            >
              <option value=''>Todos</option>
              <option value='true'>Somente ativos</option>
              <option value='false'>Somente inativos</option>
            </FilterSelect>
          </FilterGroup>
        </FilterSection>

        <FilterSection>
          <FilterSectionTitle>
            <MdPeople size={20} />
            Escopo de Dados
          </FilterSectionTitle>

          <DataScopeFilter
            onlyMyData={localFilters.onlyMyData || false}
            onChange={value => handleFilterChange('onlyMyData', value)}
            label='Mostrar apenas meus clientes'
            description='Quando marcado, mostra apenas clientes que você criou, ignorando hierarquia de usuários.'
            show={hasRoleAccess(['admin', 'manager', 'master'])}
          />
        </FilterSection>

        <FilterSection>
          <FilterSectionTitle>Ordenação</FilterSectionTitle>
          <FilterGroup>
            <FilterLabel>Ordenar por</FilterLabel>
            <FilterSelect
              value={localFilters.sortBy || 'createdAt'}
              onChange={e =>
                handleFilterChange(
                  'sortBy',
                  (e.target.value || undefined) as any
                )
              }
              disabled={loading}
            >
              <option value='createdAt'>Data de criação</option>
              <option value='name'>Nome</option>
              <option value='status'>Status</option>
              <option value='type'>Tipo</option>
              <option value='city'>Cidade</option>
            </FilterSelect>
          </FilterGroup>
          <FilterGroup>
            <FilterLabel>Ordem</FilterLabel>
            <FilterSelect
              value={localFilters.sortOrder || 'DESC'}
              onChange={e =>
                handleFilterChange(
                  'sortOrder',
                  (e.target.value || undefined) as any
                )
              }
              disabled={loading}
            >
              <option value='DESC'>Descendente</option>
              <option value='ASC'>Ascendente</option>
            </FilterSelect>
          </FilterGroup>
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
