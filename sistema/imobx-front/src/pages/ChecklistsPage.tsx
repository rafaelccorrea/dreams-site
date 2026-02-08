import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  MdAdd,
  MdSearch,
  MdFilterList,
  MdVisibility,
  MdDelete,
  MdClear,
} from 'react-icons/md';
import { FilterDrawer } from '../components/common/FilterDrawer';
import { ChecklistsShimmer } from '../components/shimmer/ChecklistsShimmer';
import { useChecklists } from '../hooks/useChecklists';
import type {
  ChecklistResponseDto,
  ChecklistFilter,
  ChecklistType,
  ChecklistStatus,
} from '../types/checklist.types';
import {
  ChecklistStatusLabels,
  ChecklistTypeLabels,
} from '../types/checklist.types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  PageContainer,
  PageHeader,
  PageTitleContainer,
  PageTitle,
  PageSubtitle,
  ControlsContainer,
  SearchContainer,
  SearchInput,
  FilterButton,
  FilterBadge,
  ChecklistsGrid,
  ChecklistCard,
  CardHeader,
  CardTitle,
  CardBadge,
  CardMeta,
  ProgressBar,
  ProgressFill,
  ProgressText,
  StatusBadge,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
  EmptyDescription,
  FilterFormGroup,
  FilterLabel,
  FilterSelect,
  FilterActions,
  FilterButtonStyled,
} from './styles/ChecklistsPage.styles';
import { propertyApi } from '../services/propertyApi';
import { clientsApi } from '../services/clientsApi';

const ChecklistsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { checklists, loading, fetchChecklists, deleteChecklist } =
    useChecklists();

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<ChecklistFilter>({
    page: 1,
    limit: 20,
  });
  const [localFilters, setLocalFilters] = useState<ChecklistFilter>({
    type: undefined,
    status: undefined,
    propertyId: undefined,
    clientId: undefined,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);

  // Carregar propriedades e clientes para filtros
  useEffect(() => {
    loadProperties();
    loadClients();
  }, []);

  const loadProperties = async () => {
    try {
      const response = await propertyApi.getProperties({});
      const list = Array.isArray(response)
        ? response
        : response?.properties || response?.items || response?.data || [];
      setProperties(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('Erro ao carregar propriedades:', error);
    }
  };

  const loadClients = async () => {
    try {
      const response = await clientsApi.getClients({});
      const list = Array.isArray(response) ? response : response?.data || [];
      setClients(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };

  // Verificar se há parâmetros de URL para pré-preencher filtros
  useEffect(() => {
    const propertyId = searchParams.get('propertyId');
    const clientId = searchParams.get('clientId');

    if (propertyId || clientId) {
      const newFilters = {
        ...filters,
        propertyId: propertyId || undefined,
        clientId: clientId || undefined,
      };
      setFilters(newFilters);
      setLocalFilters({
        type: undefined,
        status: undefined,
        propertyId: propertyId || undefined,
        clientId: clientId || undefined,
      });
    }
  }, [searchParams]);

  useEffect(() => {
    const loadChecklists = async () => {
      const filtersToUse: ChecklistFilter = {
        ...filters,
      };

      if (searchTerm) {
        filtersToUse.search = searchTerm;
      }

      await fetchChecklists(filtersToUse);
    };

    loadChecklists();
  }, [filters, searchTerm, fetchChecklists]);

  const handleCreateChecklist = () => {
    const params = new URLSearchParams();
    if (filters.propertyId) params.append('propertyId', filters.propertyId);
    if (filters.clientId) params.append('clientId', filters.clientId);
    navigate(
      `/checklists/new${params.toString() ? `?${params.toString()}` : ''}`
    );
  };

  const handleEditChecklist = (checklistId: string) => {
    navigate(`/checklists/${checklistId}/edit`);
  };

  const handleApplyFilters = () => {
    setFilters({
      ...filters,
      ...localFilters,
      page: 1,
    });
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    const cleared = {
      page: 1,
      limit: 20,
    };
    setFilters(cleared);
    setLocalFilters({
      type: undefined,
      status: undefined,
      propertyId: undefined,
      clientId: undefined,
    });
    setSearchTerm('');
    setShowFilters(false);
  };

  const handleViewChecklist = (checklistId: string) => {
    navigate(`/checklists/${checklistId}`);
  };

  const handleDeleteChecklist = async (
    checklistId: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    if (window.confirm('Tem certeza que deseja remover este checklist?')) {
      const success = await deleteChecklist(checklistId);
      if (success) {
        await fetchChecklists(filters);
      }
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Não informado';
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", {
        locale: ptBR,
      });
    } catch {
      return 'Data inválida';
    }
  };

  const activeFiltersCount = Object.keys(filters).filter(
    key =>
      !['page', 'limit', 'search'].includes(key) &&
      filters[key as keyof ChecklistFilter]
  ).length;

  const filteredChecklists = checklists.filter(checklist => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      checklist.property?.title?.toLowerCase().includes(searchLower) ||
      checklist.client?.name?.toLowerCase().includes(searchLower) ||
      checklist.type.toLowerCase().includes(searchLower)
    );
  });

  return (
    <PageContainer>
      <PageHeader>
        <PageTitleContainer>
          <PageTitle>Checklists</PageTitle>
          <PageSubtitle>Gerencie checklists de vendas e aluguéis</PageSubtitle>
        </PageTitleContainer>
        <button
          onClick={handleCreateChecklist}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            background: 'var(--color-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.938rem',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          <MdAdd />
          Novo Checklist
        </button>
      </PageHeader>

      <ControlsContainer>
        <SearchContainer>
          <MdSearch size={20} />
          <SearchInput
            type='text'
            placeholder='Buscar por propriedade, cliente ou tipo...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </SearchContainer>

        <FilterButton onClick={() => setShowFilters(true)}>
          <MdFilterList />
          Filtros
          {activeFiltersCount > 0 && (
            <FilterBadge>{activeFiltersCount}</FilterBadge>
          )}
        </FilterButton>
      </ControlsContainer>

      <FilterDrawer
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title='Filtros Avançados'
        footer={
          <FilterActions>
            <FilterButtonStyled onClick={handleClearFilters}>
              <MdClear />
              Limpar
            </FilterButtonStyled>
            <FilterButtonStyled $variant='primary' onClick={handleApplyFilters}>
              Aplicar Filtros
            </FilterButtonStyled>
          </FilterActions>
        }
      >
        <FilterFormGroup>
          <FilterLabel>Tipo</FilterLabel>
          <FilterSelect
            value={localFilters.type || ''}
            onChange={e =>
              setLocalFilters({
                ...localFilters,
                type: e.target.value
                  ? (e.target.value as ChecklistType)
                  : undefined,
              })
            }
          >
            <option value=''>Todos os tipos</option>
            <option value='sale'>{ChecklistTypeLabels.sale}</option>
            <option value='rental'>{ChecklistTypeLabels.rental}</option>
          </FilterSelect>
        </FilterFormGroup>

        <FilterFormGroup>
          <FilterLabel>Status</FilterLabel>
          <FilterSelect
            value={localFilters.status || ''}
            onChange={e =>
              setLocalFilters({
                ...localFilters,
                status: e.target.value
                  ? (e.target.value as ChecklistStatus)
                  : undefined,
              })
            }
          >
            <option value=''>Todos os status</option>
            <option value='pending'>{ChecklistStatusLabels.pending}</option>
            <option value='in_progress'>
              {ChecklistStatusLabels.in_progress}
            </option>
            <option value='completed'>{ChecklistStatusLabels.completed}</option>
            <option value='skipped'>{ChecklistStatusLabels.skipped}</option>
          </FilterSelect>
        </FilterFormGroup>

        <FilterFormGroup>
          <FilterLabel>Propriedade</FilterLabel>
          <FilterSelect
            value={localFilters.propertyId || ''}
            onChange={e =>
              setLocalFilters({
                ...localFilters,
                propertyId: e.target.value || undefined,
              })
            }
          >
            <option value=''>Todas as propriedades</option>
            {properties.map(prop => (
              <option key={prop.id} value={prop.id}>
                {prop.title || prop.code || prop.id}
              </option>
            ))}
          </FilterSelect>
        </FilterFormGroup>

        <FilterFormGroup>
          <FilterLabel>Cliente</FilterLabel>
          <FilterSelect
            value={localFilters.clientId || ''}
            onChange={e =>
              setLocalFilters({
                ...localFilters,
                clientId: e.target.value || undefined,
              })
            }
          >
            <option value=''>Todos os clientes</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </FilterSelect>
        </FilterFormGroup>
      </FilterDrawer>

      {loading ? (
        <ChecklistsShimmer />
      ) : filteredChecklists.length === 0 ? (
        <EmptyState>
          <EmptyIcon>📋</EmptyIcon>
          <EmptyTitle>Nenhum checklist encontrado</EmptyTitle>
          <EmptyDescription>
            {searchTerm || activeFiltersCount > 0
              ? 'Tente ajustar os filtros de busca.'
              : 'Comece criando um novo checklist para acompanhar processos de venda ou aluguel.'}
          </EmptyDescription>
          {!searchTerm && activeFiltersCount === 0 && (
            <button
              onClick={handleCreateChecklist}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.938rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.opacity = '0.9';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <MdAdd />
              Criar Primeiro Checklist
            </button>
          )}
        </EmptyState>
      ) : (
        <ChecklistsGrid>
          {filteredChecklists.map(checklist => (
            <ChecklistCard
              key={checklist.id}
              onClick={() => handleViewChecklist(checklist.id)}
            >
              <CardHeader>
                <CardTitle>
                  {checklist.property?.title || 'Propriedade não especificada'}
                </CardTitle>
                <CardBadge $type={checklist.type}>
                  {ChecklistTypeLabels[checklist.type]}
                </CardBadge>
              </CardHeader>

              <CardMeta>
                <div>
                  <strong>Cliente:</strong>{' '}
                  {checklist.client?.name || 'Não especificado'}
                </div>
                {checklist.startedAt && (
                  <div>
                    <strong>Iniciado em:</strong>{' '}
                    {formatDate(checklist.startedAt)}
                  </div>
                )}
                {checklist.completedAt && (
                  <div>
                    <strong>Concluído em:</strong>{' '}
                    {formatDate(checklist.completedAt)}
                  </div>
                )}
              </CardMeta>

              <StatusBadge $status={checklist.status}>
                {ChecklistStatusLabels[checklist.status]}
              </StatusBadge>

              <ProgressBar>
                <ProgressFill
                  $percentage={checklist.statistics.completionPercentage}
                />
              </ProgressBar>
              <ProgressText>
                <span>
                  {checklist.statistics.completedItems} de{' '}
                  {checklist.statistics.totalItems} itens
                </span>
                <span>{checklist.statistics.completionPercentage}%</span>
              </ProgressText>

              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  marginTop: '16px',
                  justifyContent: 'flex-end',
                }}
                onClick={e => e.stopPropagation()}
              >
                <button
                  onClick={() => handleViewChecklist(checklist.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    background: 'var(--color-primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                  }}
                >
                  <MdVisibility />
                  Ver Detalhes
                </button>
                <button
                  onClick={e => handleDeleteChecklist(checklist.id, e)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: '#ef4444',
                    border: '1px solid #ef4444',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  <MdDelete />
                </button>
              </div>
            </ChecklistCard>
          ))}
        </ChecklistsGrid>
      )}
    </PageContainer>
  );
};

export default ChecklistsPage;
