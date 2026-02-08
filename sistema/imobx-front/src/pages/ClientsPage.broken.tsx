import React, { useState, useEffect } from 'react';
import {
  MdPersonAdd,
  MdEdit,
  MdDelete,
  MdPhone,
  MdLocationOn,
  MdFileUpload,
  MdFileDownload,
} from 'react-icons/md';
import { useClients } from '../hooks/useClients';
import { ClientModal } from '../components/modals/ClientModal';
import { TransferClientModal } from '../components/modals/TransferClientModal';
import { AsyncExcelImportModal } from '../components/modals/AsyncExcelImportModal';
import { GlobalProgressBar } from '../components/common/GlobalProgressBar';
import { Layout } from '../components/layout/Layout';
import {
  ClientType,
  ClientStatus,
  CLIENT_TYPE_LABELS,
  CLIENT_STATUS_LABELS,
  CLIENT_STATUS_COLORS,
  CLIENT_TYPE_COLORS,
} from '../types/client';
import { Shimmer } from '../components/common/Shimmer';
import { useAuth } from '../hooks/useAuth';
import { MdTransferWithinAStation } from 'react-icons/md';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import {
  PageContainer,
  PageHeader,
  HeaderTitle,
  HeaderActions,
  ActionButton,
  ClientsGrid,
  ClientCard,
  CardHeader,
  ClientInfo,
  ClientName,
  ClientType as ClientTypeBadge,
  CardActions,
  ActionIcon,
  ClientDetails,
  DetailItem,
  DetailIcon,
  ResponsibleUser,
  LoadingContainer,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
  EmptyDescription,
} from './styles/ClientsPage.styles';

export const ClientsPage: React.FC = () => {
  const {
    clients,
    loading,
    error,
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
    getClientStatistics,
    transferClient,
  } = useClients();

  const { getCurrentUser } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<ClientType | ''>('');
  const [statusFilter, setStatusFilter] = useState<ClientStatus | ''>('');
  const [showClientModal, setShowClientModal] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  const [statistics, setStatistics] = useState<any>(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferringClient, setTransferringClient] = useState<any>(null);
  const [showExcelImportModal, setShowExcelImportModal] = useState(false);

  useEffect(() => {
    fetchClients();
    loadStatistics();
  }, []);

  useEffect(() => {
    fetchClients();
  }, [searchTerm, typeFilter, statusFilter]);

  const loadStatistics = async () => {
    try {
      const stats = await getClientStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const handleCreateClient = () => {
    setEditingClient(null);
    setShowClientModal(true);
  };

  const handleEditClient = (client: any) => {
    setEditingClient(client);
    setShowClientModal(true);
  };

  const handleDeleteClient = async (clientId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await deleteClient(clientId);
        toast.success('Cliente excluído com sucesso!');
        fetchClients();
      } catch (error) {
        toast.error('Erro ao excluir cliente');
      }
    }
  };

  const handleTransferClient = (client: any) => {
    setTransferringClient(client);
    setShowTransferModal(true);
  };

  const handleClientSave = async (clientData: any) => {
    try {
      if (editingClient) {
        await updateClient(editingClient.id, clientData);
        toast.success('Cliente atualizado com sucesso!');
      } else {
        await createClient(clientData);
        toast.success('Cliente criado com sucesso!');
      }
      setShowClientModal(false);
      fetchClients();
      loadStatistics();
    } catch (error) {
      toast.error('Erro ao salvar cliente');
    }
  };

  const handleTransferSave = async (newResponsibleUserId: string) => {
    try {
      await transferClient(transferringClient.id, newResponsibleUserId);
      toast.success('Cliente transferido com sucesso!');
      setShowTransferModal(false);
      fetchClients();
    } catch (error) {
      toast.error('Erro ao transferir cliente');
    }
  };

  const canTransferClient = (client: any): boolean => {
    const currentUser = getCurrentUser();
    return (
      currentUser?.role === 'admin' ||
      currentUser?.role === 'master' ||
      client.responsibleUserId === currentUser?.id
    );
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
        'Telefone Principal': client.phone,
        'Telefone Secundário': client.secondaryPhone || '',
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

  const renderClientCard = (client: any) => (
    <ClientCard key={client.id}>
      <CardHeader>
        <ClientInfo>
          <ClientName>{client.name}</ClientName>
          <ClientTypeBadge $type={client.type}>
            {CLIENT_TYPE_LABELS[client.type]}
          </ClientTypeBadge>
        </ClientInfo>
        <CardActions>
          <ActionIcon onClick={() => handleEditClient(client)}>
            <MdEdit size={16} />
          </ActionIcon>
          {canTransferClient(client) && (
            <ActionIcon onClick={() => handleTransferClient(client)}>
              <MdTransferWithinAStation size={16} />
            </ActionIcon>
          )}
          <ActionIcon onClick={() => handleDeleteClient(client.id)}>
            <MdDelete size={16} />
          </ActionIcon>
        </CardActions>
      </CardHeader>

      <ClientDetails>
        {client.email && (
          <DetailItem>
            <DetailIcon>
              <MdPhone size={16} />
            </DetailIcon>
            <span>{client.email}</span>
          </DetailItem>
        )}
        <DetailItem>
          <DetailIcon>
            <MdPhone size={16} />
          </DetailIcon>
          <span>{client.phone}</span>
        </DetailItem>
        <DetailItem>
          <DetailIcon>
            <MdLocationOn size={16} />
          </DetailIcon>
          <span>
            {client.city} - {client.state}
          </span>
        </DetailItem>
      </ClientDetails>

      <ResponsibleUser>
        <span>
          Responsável: {client.responsibleUser?.name || 'Não definido'}
        </span>
      </ResponsibleUser>
    </ClientCard>
  );

  const filteredClients = clients.filter(client => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm);
    const matchesType = !typeFilter || client.type === typeFilter;
    const matchesStatus = !statusFilter || client.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  if (loading) {
    return (
      <Layout>
        <PageContainer>
          <LoadingContainer>
            <Shimmer width='200px' height='32px' borderRadius='8px' />
          </LoadingContainer>
        </PageContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageContainer>
        <PageHeader>
          <div>
            <HeaderTitle>Clientes</HeaderTitle>
            <p
              style={{
                margin: 0,
                color: 'var(--theme-text-secondary)',
                fontSize: '16px',
              }}
            >
              Gerencie seus clientes e leads
            </p>
          </div>
          <HeaderActions>
            <ActionButton
              $variant='secondary'
              onClick={handleExportClients}
              disabled={clients.length === 0}
              style={{
                opacity: clients.length === 0 ? 0.5 : 1,
                cursor: clients.length === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              <MdFileDownload size={20} />
              Exportar Excel ({clients.length})
            </ActionButton>
            <ActionButton
              $variant='secondary'
              onClick={() => setShowExcelImportModal(true)}
            >
              <MdFileUpload size={20} />
              Importar Excel
            </ActionButton>
            <ActionButton $variant='primary' onClick={handleCreateClient}>
              <MdPersonAdd size={20} />
              Novo Cliente
            </ActionButton>
          </HeaderActions>
        </PageHeader>

        {statistics && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '32px',
            }}
          >
            <div
              style={{
                background: 'var(--theme-surface)',
                border: '1px solid var(--theme-border)',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  color: 'var(--theme-primary)',
                  marginBottom: '8px',
                }}
              >
                {statistics.total_clients}
              </div>
              <div
                style={{
                  fontSize: '14px',
                  color: 'var(--theme-text-secondary)',
                }}
              >
                Total de Clientes
              </div>
            </div>
            <div
              style={{
                background: 'var(--theme-surface)',
                border: '1px solid var(--theme-border)',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  color: 'var(--theme-success)',
                  marginBottom: '8px',
                }}
              >
                {statistics.buyers}
              </div>
              <div
                style={{
                  fontSize: '14px',
                  color: 'var(--theme-text-secondary)',
                }}
              >
                Compradores
              </div>
            </div>
            <div
              style={{
                background: 'var(--theme-surface)',
                border: '1px solid var(--theme-border)',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  color: 'var(--theme-warning)',
                  marginBottom: '8px',
                }}
              >
                {statistics.sellers}
              </div>
              <div
                style={{
                  fontSize: '14px',
                  color: 'var(--theme-text-secondary)',
                }}
              >
                Vendedores
              </div>
            </div>
            <div
              style={{
                background: 'var(--theme-surface)',
                border: '1px solid var(--theme-border)',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  color: 'var(--theme-info)',
                  marginBottom: '8px',
                }}
              >
                {statistics.renters}
              </div>
              <div
                style={{
                  fontSize: '14px',
                  color: 'var(--theme-text-secondary)',
                }}
              >
                Locatários
              </div>
            </div>
          </div>
        )}

        <div
          style={{
            display: 'flex',
            gap: '16px',
            marginBottom: '24px',
            alignItems: 'center',
          }}
        >
          <input
            type='text'
            placeholder='Buscar clientes...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: '1px solid var(--theme-border)',
              borderRadius: '12px',
              fontSize: '14px',
              background: 'var(--theme-surface)',
              color: 'var(--theme-text)',
            }}
          />
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value as ClientType | '')}
            style={{
              padding: '12px 16px',
              border: '1px solid var(--theme-border)',
              borderRadius: '12px',
              fontSize: '14px',
              background: 'var(--theme-surface)',
              color: 'var(--theme-text)',
              cursor: 'pointer',
            }}
          >
            <option value=''>Todos os tipos</option>
            {Object.entries(CLIENT_TYPE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as ClientStatus | '')}
            style={{
              padding: '12px 16px',
              border: '1px solid var(--theme-border)',
              borderRadius: '12px',
              fontSize: '14px',
              background: 'var(--theme-surface)',
              color: 'var(--theme-text)',
              cursor: 'pointer',
            }}
          >
            <option value=''>Todos os status</option>
            {Object.entries(CLIENT_STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {filteredClients.length === 0 ? (
          <EmptyState>
            <EmptyIcon>👥</EmptyIcon>
            <EmptyTitle>Nenhum cliente encontrado</EmptyTitle>
            <EmptyDescription>
              {searchTerm || typeFilter || statusFilter
                ? 'Tente ajustar os filtros de busca'
                : 'Comece criando seu primeiro cliente'}
            </EmptyDescription>
          </EmptyState>
        ) : (
          <ClientsGrid>{filteredClients.map(renderClientCard)}</ClientsGrid>
        )}

        <ClientModal
          isOpen={showClientModal}
          onClose={() => setShowClientModal(false)}
          onSave={handleClientSave}
          client={editingClient}
        />

        <TransferClientModal
          isOpen={showTransferModal}
          onClose={() => setShowTransferModal(false)}
          onSave={handleTransferSave}
          client={transferringClient}
        />

        <AsyncExcelImportModal
          isOpen={showExcelImportModal}
          onClose={() => setShowExcelImportModal(false)}
          onImportSuccess={() => {
            fetchClients();
            setShowExcelImportModal(false);
            // toast será exibido pelo próprio modal
          }}
        />

        {/* Barra de progresso global */}
        <GlobalProgressBar
          onImportComplete={() => {
            fetchClients();
            toast.success('Importação concluída!');
          }}
        />
      </PageContainer>
    </Layout>
  );
};
