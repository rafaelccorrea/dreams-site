import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from '../components/layout/Layout';
import { useAudit, type AuditFilters } from '../hooks/useAudit';
import {
  MdHistory,
  MdPerson,
  MdAccessTime,
  MdSearch,
  MdFilterList,
  MdFileDownload,
  MdCheck,
  MdClose,
  MdWarning,
} from 'react-icons/md';
import { PageContentShimmer } from '../components/shimmer';
import { message } from 'antd';
import dayjs from 'dayjs';
import {
  PageContainer,
  PageContent,
  PageHeader,
  PageTitleContainer,
  PageTitle,
  PageSubtitle,
  ActionsBar,
  LeftActions,
  RightActions,
  SearchContainer,
  SearchInput,
  SearchIcon,
  FilterToggle,
  CounterBadge,
  SummaryContainer,
  SummaryCard,
  SummaryIcon,
  SummaryValue,
  SummaryLabel,
  TransactionsCard,
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  PaginationWrapper,
  PaginationButton,
} from '../styles/pages/FinancialPageStyles';
import styled from 'styled-components';

const ExportButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 20px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => props.theme.colors.primary}40;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LogsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
`;

const LogCard = styled.div`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary}40;
    box-shadow: 0 2px 8px ${props => props.theme.colors.primary}10;
  }
`;

const LogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const LogTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LogMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  font-size: 0.85rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const ActionBadge = styled.span<{ $action: string }>`
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  ${props => {
    if (props.$action.includes('created')) {
      return `
        background: ${props.theme.mode === 'dark' ? '#065f46' : '#d1fae5'};
        color: ${props.theme.mode === 'dark' ? '#6ee7b7' : '#065f46'};
      `;
    } else if (props.$action.includes('updated')) {
      return `
        background: ${props.theme.mode === 'dark' ? '#92400e' : '#fef3c7'};
        color: ${props.theme.mode === 'dark' ? '#fbbf24' : '#92400e'};
      `;
    } else if (props.$action.includes('deleted')) {
      return `
        background: ${props.theme.mode === 'dark' ? '#7f1d1d' : '#fee2e2'};
        color: ${props.theme.mode === 'dark' ? '#fca5a5' : '#991b1b'};
      `;
    } else {
      return `
        background: ${props.theme.mode === 'dark' ? '#1e3a8a' : '#dbeafe'};
        color: ${props.theme.mode === 'dark' ? '#93c5fd' : '#1e40af'};
      `;
    }
  }}
`;

const StatusBadge = styled.span<{ $success: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;

  ${props =>
    props.$success
      ? `
    background: ${props.theme.mode === 'dark' ? '#065f46' : '#d1fae5'};
    color: ${props.theme.mode === 'dark' ? '#6ee7b7' : '#065f46'};
  `
      : `
    background: ${props.theme.mode === 'dark' ? '#7f1d1d' : '#fee2e2'};
    color: ${props.theme.mode === 'dark' ? '#fca5a5' : '#991b1b'};
  `}
`;

const LogDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const DetailLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DetailValue = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  font-weight: 500;
`;

const FiltersDrawer = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  height: 100vh;
  background: ${props => props.theme.colors.cardBackground};
  border-left: 1px solid ${props => props.theme.colors.border};
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transform: translateX(${props => (props.$isOpen ? '0' : '100%')});
  transition: transform 0.3s ease;
  overflow-y: auto;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const DrawerHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DrawerTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
  }
`;

const DrawerContent = styled.div`
  padding: 24px;
`;

const FilterGroup = styled.div`
  margin-bottom: 20px;
`;

const FilterLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const FilterInput = styled.input`
  width: 100%;
  padding: 10px 14px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 10px 14px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const DrawerActions = styled.div`
  padding: 20px 24px;
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  gap: 12px;

  button {
    flex: 1;
  }
`;

const FilterButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;

  ${props =>
    props.$variant === 'primary'
      ? `
    background: ${props.theme.colors.primary};
    color: white;

    &:hover {
      background: ${props.theme.colors.primaryDark};
      transform: translateY(-1px);
      box-shadow: 0 4px 12px ${props.theme.colors.primary}40;
    }
  `
      : `
    background: transparent;
    color: ${props.theme.colors.text};
    border: 1px solid ${props.theme.colors.border};

    &:hover {
      background: ${props.theme.colors.backgroundSecondary};
      border-color: ${props.theme.colors.primary};
    }
  `}
`;

export const AuditPage: React.FC = () => {
  const {
    logs,
    total,
    loading,
    stats,
    statsLoading,
    fetchLogs,
    fetchStats,
    exportLogs,
  } = useAudit();

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<AuditFilters>({
    page: 1,
    limit: 50,
  });

  useEffect(() => {
    fetchLogs(filters);
    fetchStats(filters);
  }, [filters, fetchLogs, fetchStats]);

  const handleFilterChange = (key: keyof AuditFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleApplyFilters = () => {
    setShowFilters(false);
    fetchLogs(filters);
    fetchStats(filters);
  };

  const handleClearFilters = () => {
    setFilters({ page: 1, limit: 50 });
    setSearchTerm('');
    setShowFilters(false);
  };

  const handleExport = async () => {
    try {
      const data = await exportLogs(filters);
      message.success(`${data.totalExported} logs exportados com sucesso`);
      // Aqui você pode implementar o download do arquivo
    } catch (error) {
      message.error('Erro ao exportar logs');
    }
  };

  const filteredLogs = useMemo(() => {
    if (!searchTerm) return logs;

    const search = searchTerm.toLowerCase();
    return logs.filter(
      log =>
        log.description?.toLowerCase().includes(search) ||
        log.userName?.toLowerCase().includes(search) ||
        log.action?.toLowerCase().includes(search) ||
        log.module?.toLowerCase().includes(search)
    );
  }, [logs, searchTerm]);

  const hasActiveFilters = Object.keys(filters).some(key => {
    if (key === 'page' || key === 'limit') return false;
    const value = filters[key as keyof AuditFilters];
    return value !== undefined && value !== null && value !== '';
  });

  const activeFiltersCount = Object.keys(filters).filter(key => {
    if (key === 'page' || key === 'limit') return false;
    const value = filters[key as keyof AuditFilters];
    return value !== undefined && value !== null && value !== '';
  }).length;

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const totalPages = Math.ceil(total / (filters.limit || 50));

  if (loading && logs.length === 0) {
    return (
      <Layout>
        <PageContainer>
          <PageContentShimmer />
        </PageContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageContainer>
        <PageContent>
          {/* Header */}
          <PageHeader>
            <PageTitleContainer>
              <div>
                <PageTitle>Auditoria</PageTitle>
                <PageSubtitle>
                  Acompanhe todas as ações realizadas no sistema
                </PageSubtitle>
              </div>
            </PageTitleContainer>
          </PageHeader>

          {/* Actions Bar */}
          <ActionsBar>
            <LeftActions>
              <SearchContainer>
                <SearchInput
                  placeholder='Buscar logs...'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
                <SearchIcon>
                  <MdSearch />
                </SearchIcon>
              </SearchContainer>

              <FilterToggle
                onClick={() => setShowFilters(true)}
                $hasActiveFilters={hasActiveFilters}
              >
                <MdFilterList />
                Filtros
                {hasActiveFilters && (
                  <CounterBadge>{activeFiltersCount}</CounterBadge>
                )}
              </FilterToggle>
            </LeftActions>

            <RightActions>
              <ExportButton onClick={handleExport} disabled={logs.length === 0}>
                <MdFileDownload />
                Exportar
              </ExportButton>
            </RightActions>
          </ActionsBar>

          {/* Summary Cards */}
          {stats && !statsLoading && (
            <SummaryContainer>
              <SummaryCard $type='balance'>
                <SummaryIcon $type='balance'>
                  <MdHistory />
                </SummaryIcon>
                <SummaryValue>{stats.totalLogs}</SummaryValue>
                <SummaryLabel>Total de Logs</SummaryLabel>
              </SummaryCard>

              <SummaryCard $type='income'>
                <SummaryIcon $type='income'>
                  <MdCheck />
                </SummaryIcon>
                <SummaryValue>{stats.successLogs}</SummaryValue>
                <SummaryLabel>Sucesso</SummaryLabel>
              </SummaryCard>

              <SummaryCard $type='expense'>
                <SummaryIcon $type='expense'>
                  <MdClose />
                </SummaryIcon>
                <SummaryValue>{stats.errorLogs}</SummaryValue>
                <SummaryLabel>Erros</SummaryLabel>
              </SummaryCard>

              <SummaryCard $type='pending'>
                <SummaryIcon $type='pending'>
                  <MdWarning />
                </SummaryIcon>
                <SummaryValue>{stats.criticalActions}</SummaryValue>
                <SummaryLabel>Ações Críticas</SummaryLabel>
              </SummaryCard>
            </SummaryContainer>
          )}

          {/* Logs */}
          <TransactionsCard>
            {filteredLogs.length === 0 ? (
              <EmptyState>
                <EmptyStateIcon>
                  <MdHistory />
                </EmptyStateIcon>
                <EmptyStateTitle>Nenhum log encontrado</EmptyStateTitle>
                <EmptyStateDescription>
                  {searchTerm || hasActiveFilters
                    ? 'Tente ajustar os filtros ou termo de busca'
                    : 'Nenhuma atividade registrada ainda'}
                </EmptyStateDescription>
              </EmptyState>
            ) : (
              <LogsList>
                {filteredLogs.map(log => (
                  <LogCard key={log.id}>
                    <LogHeader>
                      <LogTitle>
                        <ActionBadge $action={log.action}>
                          {log.action.replace(/_/g, ' ')}
                        </ActionBadge>
                        {log.description}
                      </LogTitle>
                      <StatusBadge $success={log.success}>
                        {log.success ? (
                          <>
                            <MdCheck size={14} /> Sucesso
                          </>
                        ) : (
                          <>
                            <MdClose size={14} /> Erro
                          </>
                        )}
                      </StatusBadge>
                    </LogHeader>

                    <LogMeta>
                      {log.userName && (
                        <>
                          <MdPerson size={14} />
                          <span>{log.userName}</span>
                          <span>•</span>
                        </>
                      )}
                      {log.module && (
                        <>
                          <span>{log.module}</span>
                          <span>•</span>
                        </>
                      )}
                      <MdAccessTime size={14} />
                      <span>
                        {dayjs(log.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                      </span>
                      {log.ipAddress && (
                        <>
                          <span>•</span>
                          <span>IP: {log.ipAddress}</span>
                        </>
                      )}
                    </LogMeta>

                    {(log.entityType || log.httpMethod || log.responseTime) && (
                      <LogDetails>
                        {log.entityType && (
                          <DetailItem>
                            <DetailLabel>Entidade</DetailLabel>
                            <DetailValue>{log.entityType}</DetailValue>
                          </DetailItem>
                        )}
                        {log.httpMethod && (
                          <DetailItem>
                            <DetailLabel>Método HTTP</DetailLabel>
                            <DetailValue>
                              {log.httpMethod} {log.httpStatus}
                            </DetailValue>
                          </DetailItem>
                        )}
                        {log.responseTime && (
                          <DetailItem>
                            <DetailLabel>Tempo de Resposta</DetailLabel>
                            <DetailValue>{log.responseTime}ms</DetailValue>
                          </DetailItem>
                        )}
                        {log.companyName && (
                          <DetailItem>
                            <DetailLabel>Empresa</DetailLabel>
                            <DetailValue>{log.companyName}</DetailValue>
                          </DetailItem>
                        )}
                      </LogDetails>
                    )}

                    {log.errorMessage && (
                      <DetailItem style={{ marginTop: '12px' }}>
                        <DetailLabel>Mensagem de Erro</DetailLabel>
                        <DetailValue style={{ color: '#ef4444' }}>
                          {log.errorMessage}
                        </DetailValue>
                      </DetailItem>
                    )}
                  </LogCard>
                ))}
              </LogsList>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <PaginationWrapper>
                <PaginationButton
                  onClick={() => handlePageChange((filters.page || 1) - 1)}
                  disabled={(filters.page || 1) === 1}
                >
                  Anterior
                </PaginationButton>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <PaginationButton
                      key={page}
                      $active={(filters.page || 1) === page}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </PaginationButton>
                  );
                })}

                <PaginationButton
                  onClick={() => handlePageChange((filters.page || 1) + 1)}
                  disabled={(filters.page || 1) === totalPages}
                >
                  Próxima
                </PaginationButton>
              </PaginationWrapper>
            )}
          </TransactionsCard>
        </PageContent>

        {/* Filters Drawer */}
        <FiltersDrawer $isOpen={showFilters}>
          <DrawerHeader>
            <DrawerTitle>Filtros Avançados</DrawerTitle>
            <CloseButton onClick={() => setShowFilters(false)}>
              <MdClose size={20} />
            </CloseButton>
          </DrawerHeader>

          <DrawerContent>
            <FilterGroup>
              <FilterLabel>Ação</FilterLabel>
              <FilterSelect
                value={filters.action || ''}
                onChange={e => handleFilterChange('action', e.target.value)}
              >
                <option value=''>Todas as ações</option>
                <option value='user_created'>Usuário Criado</option>
                <option value='user_updated'>Usuário Atualizado</option>
                <option value='user_deleted'>Usuário Deletado</option>
                <option value='property_created'>Propriedade Criada</option>
                <option value='property_updated'>Propriedade Atualizada</option>
                <option value='property_deleted'>Propriedade Deletada</option>
                <option value='client_created'>Cliente Criado</option>
                <option value='client_updated'>Cliente Atualizado</option>
                <option value='client_deleted'>Cliente Deletado</option>
                <option value='login_success'>Login Sucesso</option>
                <option value='login_failed'>Login Falhou</option>
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Módulo</FilterLabel>
              <FilterSelect
                value={filters.module || ''}
                onChange={e => handleFilterChange('module', e.target.value)}
              >
                <option value=''>Todos os módulos</option>
                <option value='user_management'>
                  Gerenciamento de Usuários
                </option>
                <option value='properties'>Propriedades</option>
                <option value='clients'>Clientes</option>
                <option value='matches'>Matches</option>
                <option value='kanban'>Kanban</option>
                <option value='financial'>Financeiro</option>
                <option value='subscription_management'>Assinaturas</option>
                <option value='teams'>Equipes</option>
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Status</FilterLabel>
              <FilterSelect
                value={
                  filters.success !== undefined ? String(filters.success) : ''
                }
                onChange={e =>
                  handleFilterChange(
                    'success',
                    e.target.value === ''
                      ? undefined
                      : e.target.value === 'true'
                  )
                }
              >
                <option value=''>Todos</option>
                <option value='true'>Sucesso</option>
                <option value='false'>Erro</option>
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Data Início</FilterLabel>
              <FilterInput
                type='date'
                value={filters.startDate || ''}
                onChange={e => handleFilterChange('startDate', e.target.value)}
              />
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Data Fim</FilterLabel>
              <FilterInput
                type='date'
                value={filters.endDate || ''}
                onChange={e => handleFilterChange('endDate', e.target.value)}
              />
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Tipo de Entidade</FilterLabel>
              <FilterInput
                type='text'
                placeholder='Ex: user, property, client'
                value={filters.entityType || ''}
                onChange={e => handleFilterChange('entityType', e.target.value)}
              />
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>IP Address</FilterLabel>
              <FilterInput
                type='text'
                placeholder='Ex: 192.168.1.100'
                value={filters.ipAddress || ''}
                onChange={e => handleFilterChange('ipAddress', e.target.value)}
              />
            </FilterGroup>
          </DrawerContent>

          <DrawerActions>
            <FilterButton onClick={handleClearFilters} $variant='secondary'>
              Limpar
            </FilterButton>
            <FilterButton onClick={handleApplyFilters} $variant='primary'>
              Aplicar Filtros
            </FilterButton>
          </DrawerActions>
        </FiltersDrawer>
      </PageContainer>
    </Layout>
  );
};

export default AuditPage;
