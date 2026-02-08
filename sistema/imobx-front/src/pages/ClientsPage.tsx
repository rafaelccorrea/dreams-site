import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdPersonAdd,
  MdEdit,
  MdDelete,
  MdFileUpload,
  MdFileDownload,
  MdVisibility,
  MdFilterList,
  MdMoreVert,
  MdTransferWithinAStation,
} from 'react-icons/md';
import { useClients } from '../hooks/useClients';
import { formatCurrency } from '../utils/formatNumbers';
import { TransferClientModal } from '../components/modals/TransferClientModal';
import { AsyncExcelImportModal } from '../components/modals/AsyncExcelImportModal';
import { GlobalProgressBar } from '../components/common/GlobalProgressBar';
import { Layout } from '../components/layout/Layout';
import {
  ClientType,
  ClientStatus,
  CLIENT_TYPE_LABELS,
  CLIENT_STATUS_LABELS,
  ClientSource,
  CLIENT_SOURCE_LABELS,
} from '../types/client';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import { formatPhoneDisplay, maskCPF } from '../utils/masks';
import { PermissionButton } from '../components/common/PermissionButton';
import { usePermissionsContextOptional } from '../contexts/PermissionsContext';
import { MatchesBadge } from '../components/common/MatchesBadge';
import { LeadClassificationBadge } from '../components/ai/LeadClassificationBadge';
import { useModuleAccess } from '../hooks/useModuleAccess';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';
import { ClientFiltersDrawer } from '../components/clients/ClientFiltersDrawer';
import type { ClientFilters } from '../types/filters';
import { DraggableContainer } from '../components/common/DraggableContainer';
import {
  PageContainer,
  PageHeader,
  HeaderTitle,
  HeaderSubtitle,
  HeaderActions,
  StatisticsGrid,
  StatCard,
  StatValue,
  StatLabel,
  FiltersContainer,
  SearchInput,
  FilterSelect,
  FilterButton,
  FilterBadge,
  LoadMoreButton,
  LoadMoreContainer,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
  EmptyDescription,
} from './styles/ClientsPage.styles';
import {
  ClientsListContainer,
  ListHeader,
  HeaderWithTooltip,
  ClientRow,
  ClientInfo as ListClientInfo,
  ClientName as ListClientName,
  ClientEmail,
  ClientLocation,
  SpouseIndicator,
  ClientContactInfo,
  ClientFinancialInfo,
  ClientTypeBadge as ListClientTypeBadge,
  ClientStatus as ListClientStatus,
  RowActions,
  ActionsMenuContainer,
  MenuButton,
  MenuDropdown,
  MenuItem,
  MenuDivider,
  MobileHidden,
  MobileOnly,
  MobileClientDetails,
  MobileDetailRow,
  MobileDetailLabel,
  MobileDetailValue,
} from './styles/ClientsListView.styles';

export const ClientsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isModuleAvailableForCompany } = useModuleAccess();
  const {
    clients,
    loading,
    deleteClient,
    fetchClients,
    getClientStatistics,
    transferClient,
  } = useClients();

  const hasAIAssistantModule = isModuleAvailableForCompany('ai_assistant');

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState<ClientFilters>({
    search: '',
    type: undefined,
    status: undefined,
    city: undefined,
    neighborhood: undefined,
    email: undefined,
    phone: undefined,
    document: undefined,
    isActive: undefined,
    responsibleUserId: undefined,
    createdFrom: undefined,
    createdTo: undefined,
    onlyMyData: false,
    sortBy: 'createdAt',
    sortOrder: 'DESC',
    page: 1,
    limit: 50,
  });
  const [statistics, setStatistics] = useState<any>(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferringClient, setTransferringClient] = useState<any>(null);
  const [showExcelImportModal, setShowExcelImportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const isLoadingMoreRef = useRef(false);

  // Helper para converter ClientFilters para ClientSearchFilters
  const convertFilters = (f: ClientFilters) => ({
    ...f,
    type: f.type as ClientType | undefined,
    status: f.status as ClientStatus | undefined,
  });

  useEffect(() => {
    const searchFilters = {
      page: 1,
      limit: filters.limit,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      type: filters.type as ClientType | undefined,
      status: filters.status as ClientStatus | undefined,
    };
    fetchClients(searchFilters);
    loadStatistics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Buscar quando filtros (exceto page) mudarem: resetar para página 1
  useEffect(() => {
    // Não executar se estiver carregando mais dados
    if (isLoadingMoreRef.current) {
      return;
    }

    const { page, ...rest } = filters;
    const searchFilters = {
      ...rest,
      page: 1,
      type: rest.type as ClientType | undefined,
      status: rest.status as ClientStatus | undefined,
    };
    fetchClients(searchFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.search,
    filters.type,
    filters.status,
    filters.city,
    filters.neighborhood,
    filters.email,
    filters.phone,
    filters.document,
    filters.isActive,
    filters.responsibleUserId,
    filters.createdFrom,
    filters.createdTo,
    filters.onlyMyData,
    filters.sortBy,
    filters.sortOrder,
    filters.limit,
  ]);

  // Carregar mais quando page mudar (>1) — apenas se não estiver carregando manualmente
  useEffect(() => {
    // Não executar se estiver carregando manualmente ou se for a primeira página
    if (loadingMore) return;
    if (!filters.page || filters.page <= 1) return;
    // Não executar se já tiver clientes carregados (evita recarregar tudo)
    if (clients.length === 0) return;
    // Este useEffect só deve executar quando a página mudar por outros meios (não pelo botão)
    // O botão já chama fetchClients diretamente, então este useEffect é apenas um fallback
  }, [filters.page, loadingMore, clients.length]);

  // Atualizar estatísticas quando qualquer filtro mudar
  useEffect(() => {
    loadStatistics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.search,
    filters.type,
    filters.status,
    filters.city,
    filters.neighborhood,
    filters.email,
    filters.phone,
    filters.document,
    filters.isActive,
    filters.responsibleUserId,
    filters.createdFrom,
    filters.createdTo,
    filters.onlyMyData,
  ]);

  // Debounce para busca geral (300–500ms), aplicar somente com 0 ou 3+ chars
  useEffect(() => {
    const value = searchInput;
    const timer = setTimeout(() => {
      if (value.length === 0 || value.length >= 3) {
        setFilters(prev => ({ ...prev, search: value, page: 1 }));
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fechar menu ao clicar fora
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (!openMenuId) return;

    const handleClickOutside = (event: MouseEvent) => {
      const ref = menuRefs.current[openMenuId];
      const target = event.target as Node;

      if (ref && !ref.contains(target)) {
        setOpenMenuId(null);
      }
    };

    // Usar um pequeno delay para não interferir com o clique que abriu o menu
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 10);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  const handleToggleMenu = (clientId: string) => {
    setOpenMenuId(openMenuId === clientId ? null : clientId);
  };

  const handleMenuAction = (
    client: any,
    action: string,
    event?: React.MouseEvent
  ) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    setOpenMenuId(null);
    switch (action) {
      case 'view':
        handleViewClient(client);
        break;
      case 'edit':
        handleEditClient(client);
        break;
      case 'delete':
        handleDeleteClient(client);
        break;
      case 'transfer':
        handleTransferClient(client);
        break;
    }
  };

  const loadStatistics = async (onlyMy?: boolean) => {
    try {
      // Passar todos os filtros ativos para as estatísticas
      const statsFilters = convertFilters({
        ...filters,
        onlyMyData: onlyMy === undefined ? filters.onlyMyData : onlyMy,
      });
      const stats = await getClientStatistics(statsFilters);
      setStatistics(stats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const handleCreateClient = () => {
    navigate('/clients/new');
  };

  const handleEditClient = (client: any) => {
    navigate(`/clients/edit/${client.id}`);
  };

  const handleViewClient = (client: any) => {
    navigate(`/clients/${client.id}`);
  };

  const handleDeleteClient = (client: any) => {
    setClientToDelete(client);
    setShowDeleteModal(true);
  };

  const confirmDeleteClient = async () => {
    if (!clientToDelete) return;

    setIsDeleting(true);
    try {
      await deleteClient(clientToDelete.id);
      toast.success('Cliente excluído com sucesso!');
      setShowDeleteModal(false);
      setClientToDelete(null);
      fetchClients(convertFilters(filters));
      loadStatistics();
    } catch {
      toast.error('Erro ao excluir cliente');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTransferClient = (client: any) => {
    setTransferringClient(client);
    setShowTransferModal(true);
  };

  const handleTransferSave = async (newResponsibleUserId: string) => {
    try {
      // Validação rápida: não permitir transferir para o mesmo responsável
      if (
        transferringClient?.responsibleUser?.id &&
        newResponsibleUserId === transferringClient.responsibleUser.id
      ) {
        toast.warning('O cliente já é de responsabilidade deste usuário.');
        return;
      }
      await transferClient(transferringClient.id, newResponsibleUserId);
      toast.success('Cliente transferido com sucesso!');
      setShowTransferModal(false);
      fetchClients(convertFilters(filters));
      loadStatistics();
    } catch (error) {
      toast.error('Erro ao transferir cliente');
      throw error; // Re-throw para o modal poder capturar
    }
  };

  const handleExportClients = async () => {
    try {
      const totalClients = clients.length;

      // Validação: não permitir exportação se não há clientes
      if (totalClients === 0) {
        toast.warning(
          'Não há clientes para exportar. Crie alguns clientes primeiro.'
        );
        return;
      }

      toast.info('Iniciando exportação... Aguarde.');

      if (totalClients > 500) {
        // Para grandes volumes, avisar o usuário
        toast.warning(
          `Exportando ${totalClients} clientes. Para grandes volumes, considere filtrar os dados primeiro.`
        );
      }

      // Preparar dados para exportação com os campos corretos da interface atual
      const exportData = clients.map(client => ({
        Nome: client.name,
        Email: client.email || '',
        'Telefone Principal': formatPhoneDisplay(client.phone),
        'Telefone Secundário': formatPhoneDisplay(client.secondaryPhone),
        Endereço: client.address,
        Bairro: client.neighborhood,
        Cidade: client.city,
        Estado: client.state,
        CEP: client.zipCode,
        'Valor Mínimo': client.minValue || '',
        'Valor Máximo': client.maxValue || '',
        'Tipo de Interesse': client.type,
        Status: client.status,
        Observações: client.notes || '',
        Responsável: client.responsibleUser?.name || '',
        'Data de Criação': new Date(client.createdAt).toLocaleDateString(
          'pt-BR'
        ),
      }));

      // Criar workbook
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Definir larguras das colunas otimizadas
      const colWidths = [
        { wch: 25 },
        { wch: 30 },
        { wch: 20 },
        { wch: 20 },
        { wch: 25 },
        { wch: 15 },
        { wch: 20 },
        { wch: 2 },
        { wch: 8 },
        { wch: 12 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 40 },
        { wch: 20 },
        { wch: 15 },
      ];
      worksheet['!cols'] = colWidths;

      // Adicionar worksheet ao workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Clientes');

      // Baixar arquivo
      const fileName = `Clientes_Exportados_${new Date().toISOString().split('T')[0]}_${totalClients}registros.xlsx`;
      XLSX.writeFile(workbook, fileName);

      toast.success(`${totalClients} clientes exportados com sucesso!`);
    } catch (error) {
      console.error('Erro ao exportar clientes:', error);
      toast.error('Erro ao exportar clientes');
    }
  };

  const renderClientRow = (client: any) => (
    <ClientRow key={client.id}>
      <ListClientInfo>
        <ListClientName>
          <span>{client.name}</span>
          <span title='Matches do cliente (compatibilidade com imóveis)'>
            <MatchesBadge clientId={client.id} />
          </span>
          {hasAIAssistantModule && (
            <LeadClassificationBadge clientId={client.id} />
          )}
          {client.spouse && (
            <SpouseIndicator title={`Cônjuge: ${client.spouse.name}`}>
              💑
            </SpouseIndicator>
          )}
        </ListClientName>
        <ClientEmail>
          {client.email || (
            <span
              style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}
            >
              Sem dado
            </span>
          )}
        </ClientEmail>
        <ClientLocation>
          {client.city || client.state ? (
            <>
              📍 {client.city || ''} {client.city && client.state ? '- ' : ''}
              {client.state || ''}
            </>
          ) : (
            <span
              style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}
            >
              Sem dado
            </span>
          )}
        </ClientLocation>
      </ListClientInfo>

      <MobileHidden>
        <ClientContactInfo>
          {client.phone ? (
            <div title='Telefone principal'>
              📱 {formatPhoneDisplay(client.phone)}
            </div>
          ) : (
            <div
              style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}
            >
              Sem dado
            </div>
          )}
          {client.secondaryPhone ? (
            <div title='Telefone secundário'>
              📞 {formatPhoneDisplay(client.secondaryPhone)}
            </div>
          ) : null}
        </ClientContactInfo>
      </MobileHidden>

      <MobileHidden>
        <ClientFinancialInfo title='Informações financeiras do cliente'>
          {client.monthlyIncome ? (
            <div title='Renda mensal do cliente'>
              💰 {formatCurrency(Number(client.monthlyIncome))}
            </div>
          ) : client.priceRange ? (
            <div title='Faixa de preço de interesse'>
              🏠 {client.priceRange}
            </div>
          ) : client.creditScore ? (
            <div title='Score de crédito do cliente'>
              ⭐ {client.creditScore}
            </div>
          ) : (
            <div
              style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}
            >
              Sem dado
            </div>
          )}
        </ClientFinancialInfo>
      </MobileHidden>

      <MobileHidden>
        <ListClientTypeBadge
          $type={client.type}
          title='Tipo de interesse do cliente'
        >
          {CLIENT_TYPE_LABELS[client.type as keyof typeof CLIENT_TYPE_LABELS]}
        </ListClientTypeBadge>
      </MobileHidden>

      <MobileHidden>
        <ListClientStatus
          $status={client.status}
          title='Status atual do cliente'
        >
          {
            CLIENT_STATUS_LABELS[
              client.status as keyof typeof CLIENT_STATUS_LABELS
            ]
          }
        </ListClientStatus>
      </MobileHidden>

      <RowActions>
        <ActionsMenuContainer ref={el => (menuRefs.current[client.id] = el)}>
          <MenuButton
            onClick={() => handleToggleMenu(client.id)}
            $isOpen={openMenuId === client.id}
          >
            <MdMoreVert size={20} />
          </MenuButton>
          {openMenuId === client.id && (
            <MenuDropdown onClick={e => e.stopPropagation()}>
              <PermissionMenuItem
                permission='client:read'
                onClick={e => handleMenuAction(client, 'view', e)}
              >
                <MdVisibility size={18} />
                <span>Visualizar</span>
              </PermissionMenuItem>

              <PermissionMenuItem
                permission='client:update'
                onClick={e => handleMenuAction(client, 'edit', e)}
              >
                <MdEdit size={18} />
                <span>Editar</span>
              </PermissionMenuItem>

              <MenuDivider />

              <PermissionMenuItem
                permission='client:transfer'
                onClick={e => handleMenuAction(client, 'transfer', e)}
              >
                <MdTransferWithinAStation size={18} />
                <span>Transferir</span>
              </PermissionMenuItem>

              <MenuDivider />

              <PermissionMenuItem
                permission='client:delete'
                onClick={e => handleMenuAction(client, 'delete', e)}
                $danger
              >
                <MdDelete size={18} />
                <span>Excluir</span>
              </PermissionMenuItem>
            </MenuDropdown>
          )}
        </ActionsMenuContainer>
      </RowActions>

      {/* Versão mobile com mais detalhes */}
      <MobileOnly style={{ gridColumn: '1 / -1', marginTop: '12px' }}>
        <MobileClientDetails>
          <MobileDetailRow>
            <MobileDetailLabel>Telefone:</MobileDetailLabel>
            <MobileDetailValue>
              {formatPhoneDisplay(client.phone)}
            </MobileDetailValue>
          </MobileDetailRow>
          {client.secondaryPhone && (
            <MobileDetailRow>
              <MobileDetailLabel>Telefone Secundário:</MobileDetailLabel>
              <MobileDetailValue>
                {formatPhoneDisplay(client.secondaryPhone)}
              </MobileDetailValue>
            </MobileDetailRow>
          )}
          {client.cpf && (
            <MobileDetailRow>
              <MobileDetailLabel>CPF:</MobileDetailLabel>
              <MobileDetailValue>{maskCPF(client.cpf)}</MobileDetailValue>
            </MobileDetailRow>
          )}
          <MobileDetailRow>
            <MobileDetailLabel>Tipo:</MobileDetailLabel>
            <MobileDetailValue>
              <ListClientTypeBadge
                $type={client.type}
                title='Tipo de interesse do cliente'
              >
                {
                  CLIENT_TYPE_LABELS[
                    client.type as keyof typeof CLIENT_TYPE_LABELS
                  ]
                }
              </ListClientTypeBadge>
            </MobileDetailValue>
          </MobileDetailRow>
          <MobileDetailRow>
            <MobileDetailLabel>Status:</MobileDetailLabel>
            <MobileDetailValue>
              <ListClientStatus
                $status={client.status}
                title='Status atual do cliente'
              >
                {
                  CLIENT_STATUS_LABELS[
                    client.status as keyof typeof CLIENT_STATUS_LABELS
                  ]
                }
              </ListClientStatus>
            </MobileDetailValue>
          </MobileDetailRow>
          {client.monthlyIncome && (
            <MobileDetailRow>
              <MobileDetailLabel>Renda Mensal:</MobileDetailLabel>
              <MobileDetailValue>
                {formatCurrency(Number(client.monthlyIncome))}
              </MobileDetailValue>
            </MobileDetailRow>
          )}
          {client.priceRange && (
            <MobileDetailRow>
              <MobileDetailLabel>Faixa de Preço:</MobileDetailLabel>
              <MobileDetailValue>{client.priceRange}</MobileDetailValue>
            </MobileDetailRow>
          )}
          {client.creditScore && (
            <MobileDetailRow>
              <MobileDetailLabel>Score de Crédito:</MobileDetailLabel>
              <MobileDetailValue>⭐ {client.creditScore}</MobileDetailValue>
            </MobileDetailRow>
          )}
          {client.spouse && (
            <MobileDetailRow>
              <MobileDetailLabel>Cônjuge:</MobileDetailLabel>
              <MobileDetailValue>{client.spouse.name}</MobileDetailValue>
            </MobileDetailRow>
          )}
          {client.responsibleUser && (
            <MobileDetailRow>
              <MobileDetailLabel>Responsável:</MobileDetailLabel>
              <MobileDetailValue>
                {client.responsibleUser.name}
              </MobileDetailValue>
            </MobileDetailRow>
          )}
        </MobileClientDetails>
      </MobileOnly>
    </ClientRow>
  );

  const filteredClients = clients.filter(client => {
    const matchesSearch =
      !filters.search ||
      client.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      client.email?.toLowerCase().includes(filters.search.toLowerCase()) ||
      client.phone.includes(filters.search);
    const matchesType = !filters.type || client.type === filters.type;
    const matchesStatus = !filters.status || client.status === filters.status;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <Layout>
      <PageContainer>
        <PageHeader>
          <div>
            <HeaderTitle>Clientes</HeaderTitle>
            <HeaderSubtitle>Gerencie seus clientes e leads</HeaderSubtitle>
          </div>
          <HeaderActions>
            <PermissionButton
              permission='client:export'
              onClick={handleExportClients}
              disabled={clients.length === 0}
              variant='secondary'
              size='medium'
            >
              <MdFileDownload size={20} />
              Exportar Excel ({clients.length})
            </PermissionButton>
            <PermissionButton
              permission='client:create'
              onClick={() => setShowExcelImportModal(true)}
              variant='secondary'
              size='medium'
            >
              <MdFileUpload size={20} />
              Importar Excel
            </PermissionButton>
            <PermissionButton
              permission='client:create'
              onClick={handleCreateClient}
              variant='primary'
              size='medium'
            >
              <MdPersonAdd size={20} />
              Novo Cliente
            </PermissionButton>
          </HeaderActions>
        </PageHeader>

        {statistics && (
          <StatisticsGrid>
            <StatCard>
              <StatValue>{statistics.total_clients}</StatValue>
              <StatLabel>Total de Clientes</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{statistics.buyers}</StatValue>
              <StatLabel>Compradores</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{statistics.sellers}</StatValue>
              <StatLabel>Vendedores</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{statistics.renters}</StatValue>
              <StatLabel>Locatários</StatLabel>
            </StatCard>
          </StatisticsGrid>
        )}

        <FiltersContainer>
          <SearchInput
            type='text'
            placeholder='Buscar por nome, email, CPF ou telefone...'
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
          />

          <FilterButton onClick={() => setFiltersOpen(true)}>
            <MdFilterList size={16} />
            Filtros
            {Object.values(filters).some(
              value => value !== undefined && value !== '' && value !== false
            ) && (
              <FilterBadge>
                {
                  Object.values(filters).filter(
                    value =>
                      value !== undefined && value !== '' && value !== false
                  ).length
                }
              </FilterBadge>
            )}
          </FilterButton>
        </FiltersContainer>

        {loading ? (
          <EmptyState>
            <EmptyIcon>⏳</EmptyIcon>
            <EmptyTitle>Carregando clientes...</EmptyTitle>
            <EmptyDescription>
              Aguarde enquanto buscamos os dados
            </EmptyDescription>
          </EmptyState>
        ) : clients.length === 0 ? (
          <EmptyState>
            <EmptyIcon>👥</EmptyIcon>
            <EmptyTitle>Nenhum cliente encontrado</EmptyTitle>
            <EmptyDescription>
              {Object.values(filters).some(
                value => value !== undefined && value !== '' && value !== false
              )
                ? 'Tente ajustar os filtros de busca'
                : 'Comece criando seu primeiro cliente'}
            </EmptyDescription>
          </EmptyState>
        ) : (
          <DraggableContainer>
            <ClientsListContainer>
              <ListHeader>
                <div>Cliente</div>
                <MobileHidden>
                  <HeaderWithTooltip title='Telefones e contatos do cliente'>
                    📞 Contato
                  </HeaderWithTooltip>
                </MobileHidden>
                <MobileHidden>
                  <HeaderWithTooltip title='Informações financeiras: renda, faixa de preço e score de crédito'>
                    💰 Financeiro
                  </HeaderWithTooltip>
                </MobileHidden>
                <MobileHidden>
                  <HeaderWithTooltip title='Tipo de cliente: comprador, vendedor, locatário ou locador'>
                    🏷️ Tipo
                  </HeaderWithTooltip>
                </MobileHidden>
                <MobileHidden>
                  <HeaderWithTooltip title='Status atual do cliente: ativo, inativo, prospect ou lead'>
                    📊 Status
                  </HeaderWithTooltip>
                </MobileHidden>
                <HeaderWithTooltip
                  title='Ações disponíveis para o cliente'
                  style={{ justifyContent: 'center' }}
                >
                  ⚙️ Ações
                </HeaderWithTooltip>
              </ListHeader>
              {clients.map(renderClientRow)}
            </ClientsListContainer>
          </DraggableContainer>
        )}

        {/* Paginação: Carregar mais */}
        {!loading && clients.length > 0 && (
          <LoadMoreContainer>
            <LoadMoreButton
              onClick={async e => {
                e.preventDefault();
                e.stopPropagation();

                const nextPage = (filters.page || 1) + 1;
                try {
                  // Marcar que estamos carregando mais para evitar que o useEffect interfira
                  isLoadingMoreRef.current = true;
                  setLoadingMore(true);

                  // Buscar apenas os novos clientes (o hook já concatena quando page > 1)
                  // Passar todos os filtros atuais com a nova página
                  const searchFilters = {
                    ...convertFilters(filters),
                    page: nextPage,
                  };

                  // Chamar fetchClients diretamente sem atualizar o estado de filters primeiro
                  // Isso evita que o useEffect seja disparado e resete a lista
                  await fetchClients(searchFilters);

                  // Atualizar apenas a página nos filtros após sucesso
                  setFilters(prev => ({ ...prev, page: nextPage }));
                } catch (error) {
                  console.error('Erro ao carregar mais clientes:', error);
                  toast.error('Erro ao carregar mais clientes');
                } finally {
                  setLoadingMore(false);
                  // Resetar a flag após um pequeno delay para garantir que o useEffect não seja disparado
                  setTimeout(() => {
                    isLoadingMoreRef.current = false;
                  }, 100);
                }
              }}
              $loading={loadingMore}
              disabled={loadingMore || loading}
            >
              {loadingMore ? 'Carregando...' : 'Carregar mais'}
            </LoadMoreButton>
          </LoadMoreContainer>
        )}

        <TransferClientModal
          isOpen={showTransferModal}
          onClose={() => setShowTransferModal(false)}
          onTransfer={handleTransferSave}
          clientName={transferringClient?.name || ''}
          currentResponsible={transferringClient?.responsibleUser?.name || ''}
          clientId={transferringClient?.id || ''}
        />

        <AsyncExcelImportModal
          isOpen={showExcelImportModal}
          onClose={() => setShowExcelImportModal(false)}
          onImportSuccess={() => {
            fetchClients(convertFilters(filters));
            loadStatistics();
            setShowExcelImportModal(false);
            // toast será exibido pelo próprio modal
          }}
        />

        {/* Modal de Confirmação de Exclusão */}
        <ConfirmDeleteModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setClientToDelete(null);
          }}
          onConfirm={confirmDeleteClient}
          title='Excluir Cliente'
          message='Tem certeza que deseja excluir este cliente?'
          itemName={clientToDelete?.name}
          isLoading={isDeleting}
        />

        {/* Barra de progresso global */}
        <GlobalProgressBar
          onImportComplete={() => {
            fetchClients(convertFilters(filters));
            toast.success('Importação concluída!');
          }}
        />

        <ClientFiltersDrawer
          isOpen={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          filters={filters}
          onFiltersChange={newFilters => {
            // Reset de página ao aplicar filtros
            setFilters(prev => ({
              ...prev,
              ...newFilters,
              page: 1,
            }));
            // Estatísticas serão atualizadas automaticamente pelo useEffect quando os filtros mudarem
          }}
        />
      </PageContainer>
    </Layout>
  );
};

// Componente para item de menu com verificação de permissão
const PermissionMenuItem: React.FC<{
  permission: string;
  onClick: (event: React.MouseEvent) => void;
  children: React.ReactNode;
  $danger?: boolean;
}> = ({ permission, onClick, children, $danger }) => {
  const permissionsContext = usePermissionsContextOptional();
  const hasPermission = permissionsContext?.hasPermission(permission) ?? true;

  if (!hasPermission) {
    return null;
  }

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onClick(event);
  };

  return (
    <MenuItem onClick={handleClick} $danger={$danger}>
      {children}
    </MenuItem>
  );
};

export default ClientsPage;
