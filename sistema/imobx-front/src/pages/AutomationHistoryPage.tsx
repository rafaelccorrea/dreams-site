import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MdArrowBack, MdFilterList, MdRefresh } from 'react-icons/md';
import { Layout } from '../components/layout/Layout';
import { automationApi } from '../services/automationApi';
import type { AutomationExecution } from '../types/automation';
import { toast } from 'react-toastify';
import { FilterDrawer } from '../components/common/FilterDrawer';
import {
  HeaderActions,
  PageContainer,
  PageContent,
  PageHeader,
  PageSubtitle,
  PageTitle,
  PageTitleContainer,
} from '../styles/pages/AutomationsPageStyles';
import {
  BackButton,
  Card,
  Select,
  Input,
  Button,
  Table,
  Th,
  Td,
  StatusBadge,
  EmptyState,
  Pagination,
  DrawerForm,
  DrawerGroup,
  DrawerLabel,
  DrawerHint,
  ActionsRow,
  Shimmer,
  ShimmerRow,
  ShimmerCell,
} from '../styles/pages/AutomationHistoryPageStyles';

const AutomationHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [executions, setExecutions] = useState<AutomationExecution[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [localStatusFilter, setLocalStatusFilter] = useState('all');
  const [localSearch, setLocalSearch] = useState('');

  const loadExecutions = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const resp = await automationApi.getExecutions(id, {
        page,
        limit: 20,
        status: statusFilter === 'all' ? undefined : (statusFilter as any),
      });
      setExecutions(resp.executions || []);
      setTotalPages(resp.pagination?.totalPages || 1);
    } catch (err: any) {
      console.error('Erro ao carregar execuções:', err);
      toast.error(err.message || 'Erro ao carregar histórico');
    } finally {
      setLoading(false);
    }
  }, [id, page, statusFilter]);

  useEffect(() => {
    loadExecutions();
  }, [loadExecutions]);

  useEffect(() => {
    setLocalStatusFilter(statusFilter);
    setLocalSearch(search);
  }, [statusFilter, search]);

  const filteredExecutions = useMemo(() => {
    if (!search.trim()) return executions;
    return executions.filter(exec =>
      (exec.metadata?.automationName || '')
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [executions, search]);

  const handleApplyFilters = () => {
    setStatusFilter(localStatusFilter);
    setSearch(localSearch);
    setPage(1);
    setIsFiltersOpen(false);
  };

  const handleClearFilters = () => {
    setLocalStatusFilter('all');
    setLocalSearch('');
    setStatusFilter('all');
    setSearch('');
    setPage(1);
    setIsFiltersOpen(false);
  };

  return (
    <Layout>
      <PageContainer>
        <PageContent>
          <PageHeader>
            <PageTitleContainer>
              <PageTitle>Histórico de Execuções</PageTitle>
              <PageSubtitle>
                Acompanhe os disparos feitos pelas automações.
              </PageSubtitle>
            </PageTitleContainer>
            <HeaderActions>
              <ActionsRow>
                <Button onClick={() => setIsFiltersOpen(true)}>
                  <MdFilterList size={16} /> Filtros
                </Button>
                <Button onClick={() => loadExecutions()}>
                  <MdRefresh size={16} /> Atualizar
                </Button>
                <BackButton onClick={() => navigate('/automations')}>
                  <MdArrowBack size={18} /> Voltar
                </BackButton>
              </ActionsRow>
            </HeaderActions>
          </PageHeader>

          <Card>
            {loading ? (
              <Table>
                <thead>
                  <tr>
                    <Th>Data</Th>
                    <Th>Status</Th>
                    <Th>Notificações</Th>
                    <Th>Itens</Th>
                    <Th>Tempo (ms)</Th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <ShimmerRow key={idx}>
                      <ShimmerCell>
                        <Shimmer style={{ height: '16px', width: '80%' }} />
                      </ShimmerCell>
                      <ShimmerCell>
                        <Shimmer style={{ height: '24px', width: '60%' }} />
                      </ShimmerCell>
                      <ShimmerCell>
                        <Shimmer style={{ height: '16px', width: '40%' }} />
                      </ShimmerCell>
                      <ShimmerCell>
                        <Shimmer style={{ height: '16px', width: '30%' }} />
                      </ShimmerCell>
                      <ShimmerCell>
                        <Shimmer style={{ height: '16px', width: '50%' }} />
                      </ShimmerCell>
                    </ShimmerRow>
                  ))}
                </tbody>
              </Table>
            ) : filteredExecutions.length === 0 ? (
              <EmptyState>Nenhuma execução encontrada.</EmptyState>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <Th>Data</Th>
                    <Th>Status</Th>
                    <Th>Notificações</Th>
                    <Th>Itens</Th>
                    <Th>Tempo (ms)</Th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExecutions.map(exec => (
                    <tr key={exec.id}>
                      <Td>
                        {new Date(exec.createdAt).toLocaleString('pt-BR')}
                      </Td>
                      <Td>
                        <StatusBadge $status={exec.status}>
                          {exec.status}
                        </StatusBadge>
                      </Td>
                      <Td>{exec.notificationsSent ?? '-'}</Td>
                      <Td>{exec.itemsProcessed ?? '-'}</Td>
                      <Td>{exec.executionTimeMs ?? '-'}</Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>

          <Pagination>
            <Button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
            >
              Anterior
            </Button>
            <span>
              Página {page} de {totalPages}
            </span>
            <Button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
            >
              Próxima
            </Button>
          </Pagination>
        </PageContent>
      </PageContainer>

      <FilterDrawer
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        title='Filtros do Histórico'
        footer={
          <>
            <Button onClick={handleClearFilters}>Limpar filtros</Button>
            <Button $variant='primary' onClick={handleApplyFilters}>
              Aplicar filtros
            </Button>
          </>
        }
      >
        <DrawerForm>
          <DrawerGroup>
            <DrawerLabel>Status</DrawerLabel>
            <Select
              value={localStatusFilter}
              onChange={e => setLocalStatusFilter(e.target.value)}
            >
              <option value='all'>Todos</option>
              <option value='success'>Sucesso</option>
              <option value='error'>Erro</option>
              <option value='partial'>Parcial</option>
            </Select>
            <DrawerHint>Filtra execuções por status retornado.</DrawerHint>
          </DrawerGroup>

          <DrawerGroup>
            <DrawerLabel>Buscar por automação</DrawerLabel>
            <Input
              value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
              placeholder='Digite o nome da automação'
            />
            <DrawerHint>
              A busca é aplicada localmente na lista carregada.
            </DrawerHint>
          </DrawerGroup>
        </DrawerForm>
      </FilterDrawer>
    </Layout>
  );
};

export default AutomationHistoryPage;
