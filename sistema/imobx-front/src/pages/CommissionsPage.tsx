import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { useCommissions } from '../hooks/useCommissions';
import { useUsers } from '../hooks/useUsers';
import { formatCurrency } from '../utils/formatNumbers';
import styled from 'styled-components';
import {
  MdAttachMoney,
  MdCheckCircle,
  MdCancel,
  MdEdit,
  MdVisibility,
  MdFilterList,
  MdSearch,
  MdRefresh,
} from 'react-icons/md';
import type { CommissionStatus, CommissionType } from '../types/commission';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';
import { toast } from 'react-toastify';

const PageContainer = styled.div`
  padding: 24px;
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;

  ${props =>
    props.$variant === 'primary'
      ? `
    background: #3B82F6;
    color: white;
    
    &:hover {
      background: #2563EB;
    }
  `
      : `
    background: ${props.theme.colors.surface};
    color: ${props.theme.colors.text};
    border: 1px solid ${props.theme.colors.border};
    
    &:hover {
      background: ${props.theme.colors.background};
    }
  `}
`;

const FiltersContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
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
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  font-size: 14px;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
`;

const FilterInput = styled.input`
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  font-size: 14px;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
`;

const CommissionsGrid = styled.div`
  display: grid;
  gap: 16px;
`;

const CommissionCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const CommissionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const CommissionInfo = styled.div`
  flex: 1;
`;

const CommissionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
`;

const CommissionType = styled.span<{ $type: CommissionType }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => (props.$type === 'SALE' ? '#DBEAFE' : '#D1FAE5')};
  color: ${props => (props.$type === 'SALE' ? '#1E40AF' : '#065F46')};
`;

const CommissionStatus = styled.span<{ $status: CommissionStatus }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => {
    switch (props.$status) {
      case 'PENDING':
        return '#FEF3C7';
      case 'APPROVED':
        return '#D1FAE5';
      case 'REJECTED':
        return '#FEE2E2';
      case 'PAID':
        return '#DBEAFE';
      default:
        return '#F3F4F6';
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'PENDING':
        return '#92400E';
      case 'APPROVED':
        return '#065F46';
      case 'REJECTED':
        return '#991B1B';
      case 'PAID':
        return '#1E40AF';
      default:
        return '#374151';
    }
  }};
`;

const CommissionActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button<{
  $variant: 'approve' | 'reject' | 'edit' | 'view' | 'pay';
}>`
  padding: 6px 8px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;

  ${props => {
    switch (props.$variant) {
      case 'approve':
        return `
          background: #D1FAE5;
          color: #065F46;
          &:hover { background: #A7F3D0; }
        `;
      case 'reject':
        return `
          background: #FEE2E2;
          color: #991B1B;
          &:hover { background: #FECACA; }
        `;
      case 'edit':
        return `
          background: #DBEAFE;
          color: #1E40AF;
          &:hover { background: #BFDBFE; }
        `;
      case 'view':
        return `
          background: #F3F4F6;
          color: #374151;
          &:hover { background: #E5E7EB; }
        `;
      case 'pay':
        return `
          background: #FEF3C7;
          color: #92400E;
          &:hover { background: #FDE68A; }
        `;
      default:
        return `
          background: #F3F4F6;
          color: #374151;
        `;
    }
  }}
`;

const CommissionDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const DetailLabel = styled.span`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DetailValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const CommissionFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  font-weight: 600;
`;

const UserName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const CommissionDate = styled.span`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${props => props.theme.colors.textSecondary};
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${props => props.theme.colors.textSecondary};
`;

const CommissionsPage: React.FC = () => {
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    userId: '',
    startDate: '',
    endDate: '',
  });

  const {
    commissions,
    loading,
    error,
    fetchCommissions,
    approveCommission,
    rejectCommission,
  } = useCommissions(filters);
  const { users } = useUsers();

  // Estados para modal de confirmação
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [commissionToApprove, setCommissionToApprove] = useState<string | null>(
    null
  );
  const [isApproving, setIsApproving] = useState(false);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    fetchCommissions(filters);
  };

  const handleApprove = (id: string) => {
    setCommissionToApprove(id);
    setShowApproveModal(true);
  };

  const confirmApprove = async () => {
    if (!commissionToApprove) return;

    setIsApproving(true);
    try {
      await approveCommission(commissionToApprove);
      toast.success('Comissão aprovada com sucesso!');
      setShowApproveModal(false);
      setCommissionToApprove(null);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao aprovar comissão');
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async (id: string) => {
    const reason = window.prompt('Motivo da rejeição:');
    if (reason) {
      try {
        await rejectCommission(id, { rejectionReason: reason });
        alert('Comissão rejeitada com sucesso!');
      } catch (error: any) {
        alert(error.message);
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <PageContainer>
          <LoadingState>Carregando comissões...</LoadingState>
        </PageContainer>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <PageContainer>
          <EmptyState>
            <h3>Erro ao carregar comissões</h3>
            <p>{error}</p>
            <Button onClick={() => fetchCommissions()}>
              <MdRefresh />
              Tentar Novamente
            </Button>
          </EmptyState>
        </PageContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageContainer>
        <PageHeader>
          <PageTitle>Gestão de Comissões</PageTitle>
          <HeaderActions>
            <Button $variant='secondary' onClick={() => fetchCommissions()}>
              <MdRefresh />
              Atualizar
            </Button>
          </HeaderActions>
        </PageHeader>

        <FiltersContainer>
          <FiltersGrid>
            <FilterGroup>
              <FilterLabel>Status</FilterLabel>
              <FilterSelect
                value={filters.status}
                onChange={e => handleFilterChange('status', e.target.value)}
              >
                <option value=''>Todos os status</option>
                <option value='PENDING'>Pendente</option>
                <option value='APPROVED'>Aprovada</option>
                <option value='REJECTED'>Rejeitada</option>
                <option value='PAID'>Paga</option>
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Tipo</FilterLabel>
              <FilterSelect
                value={filters.type}
                onChange={e => handleFilterChange('type', e.target.value)}
              >
                <option value=''>Todos os tipos</option>
                <option value='SALE'>Venda</option>
                <option value='RENTAL'>Aluguel</option>
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Corretor</FilterLabel>
              <FilterSelect
                value={filters.userId}
                onChange={e => handleFilterChange('userId', e.target.value)}
              >
                <option value=''>Todos os corretores</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Data Inicial</FilterLabel>
              <FilterInput
                type='date'
                value={filters.startDate}
                onChange={e => handleFilterChange('startDate', e.target.value)}
              />
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Data Final</FilterLabel>
              <FilterInput
                type='date'
                value={filters.endDate}
                onChange={e => handleFilterChange('endDate', e.target.value)}
              />
            </FilterGroup>
          </FiltersGrid>

          <Button $variant='primary' onClick={handleApplyFilters}>
            <MdFilterList />
            Aplicar Filtros
          </Button>
        </FiltersContainer>

        {commissions.length === 0 ? (
          <EmptyState>
            <h3>Nenhuma comissão encontrada</h3>
            <p>Não há comissões que correspondam aos filtros aplicados.</p>
          </EmptyState>
        ) : (
          <CommissionsGrid>
            {commissions.map(commission => (
              <CommissionCard key={commission.id}>
                <CommissionHeader>
                  <CommissionInfo>
                    <CommissionTitle>{commission.title}</CommissionTitle>
                    <div
                      style={{ display: 'flex', gap: '8px', marginTop: '8px' }}
                    >
                      <CommissionType $type={commission.type}>
                        {commission.type === 'SALE' ? 'Venda' : 'Aluguel'}
                      </CommissionType>
                      <CommissionStatus $status={commission.status}>
                        {commission.status === 'PENDING' && 'Pendente'}
                        {commission.status === 'APPROVED' && 'Aprovada'}
                        {commission.status === 'REJECTED' && 'Rejeitada'}
                        {commission.status === 'PAID' && 'Paga'}
                      </CommissionStatus>
                    </div>
                  </CommissionInfo>

                  <CommissionActions>
                    <ActionButton $variant='view' title='Visualizar detalhes'>
                      <MdVisibility />
                    </ActionButton>

                    {commission.status === 'PENDING' && (
                      <>
                        <ActionButton
                          $variant='approve'
                          onClick={() => handleApprove(commission.id)}
                          title='Aprovar'
                        >
                          <MdCheckCircle />
                        </ActionButton>
                        <ActionButton
                          $variant='reject'
                          onClick={() => handleReject(commission.id)}
                          title='Rejeitar'
                        >
                          <MdCancel />
                        </ActionButton>
                        <ActionButton $variant='edit' title='Editar'>
                          <MdEdit />
                        </ActionButton>
                      </>
                    )}

                    {commission.status === 'APPROVED' && (
                      <ActionButton $variant='pay' title='Processar Pagamento'>
                        <MdAttachMoney />
                      </ActionButton>
                    )}
                  </CommissionActions>
                </CommissionHeader>

                <CommissionDetails>
                  <DetailItem>
                    <DetailLabel>Valor Base</DetailLabel>
                    <DetailValue>
                      {formatCurrency(commission.baseValue)}
                    </DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Percentual</DetailLabel>
                    <DetailValue>{commission.percentage}%</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Comissão</DetailLabel>
                    <DetailValue>
                      {formatCurrency(commission.commissionValue)}
                    </DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Valor Líquido</DetailLabel>
                    <DetailValue>
                      {formatCurrency(commission.netValue)}
                    </DetailValue>
                  </DetailItem>
                </CommissionDetails>

                <CommissionFooter>
                  <UserInfo>
                    <UserAvatar>
                      {commission.user.name.charAt(0).toUpperCase()}
                    </UserAvatar>
                    <UserName>{commission.user.name}</UserName>
                  </UserInfo>
                  <CommissionDate>
                    Criada em{' '}
                    {new Date(commission.createdAt).toLocaleDateString('pt-BR')}
                  </CommissionDate>
                </CommissionFooter>
              </CommissionCard>
            ))}
          </CommissionsGrid>
        )}

        {/* Modal de Confirmação de Aprovação */}
        <ConfirmDeleteModal
          isOpen={showApproveModal}
          onClose={() => {
            setShowApproveModal(false);
            setCommissionToApprove(null);
          }}
          onConfirm={confirmApprove}
          title='Aprovar Comissão'
          message='Tem certeza que deseja aprovar esta comissão?'
          itemName=''
          isLoading={isApproving}
        />
      </PageContainer>
    </Layout>
  );
};

export default CommissionsPage;
