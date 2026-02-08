import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Layout } from '@/components/layout/Layout';
import { PageTransition } from '@/components/common/PageTransition';
import { PermissionButton } from '@/components/common/PermissionButton';
import { ManageRewardsShimmer } from '@/components/shimmer/ManageRewardsShimmer';
import { useRewardManagement } from '@/hooks/useRewards';
import { RewardCategory } from '@/types/rewards.types';
import {
  formatPoints,
  formatMoney,
  getCategoryLabel,
  getDefaultIcon,
} from '@/utils/rewards';
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdVisibility,
  MdVisibilityOff,
} from 'react-icons/md';
import { toast } from 'react-toastify';

export const ManageRewardsPage: React.FC = () => {
  const navigate = useNavigate();
  const { rewards, stats, loading, deleteReward, updateReward } =
    useRewardManagement();
  const [showInactive, setShowInactive] = useState(false);
  const [toggleModal, setToggleModal] = useState<{
    show: boolean;
    rewardId: string;
    rewardName: string;
    currentStatus: boolean;
  }>({
    show: false,
    rewardId: '',
    rewardName: '',
    currentStatus: true,
  });

  const handleToggleActive = async (
    id: string,
    name: string,
    currentStatus: boolean
  ) => {
    setToggleModal({
      show: true,
      rewardId: id,
      rewardName: name,
      currentStatus,
    });
  };

  const confirmToggle = async () => {
    const { rewardId, currentStatus } = toggleModal;
    const result = await updateReward(rewardId, { isActive: !currentStatus });
    if (result) {
      toast.success(
        currentStatus
          ? '🔴 Prêmio desativado com sucesso!'
          : '🟢 Prêmio ativado com sucesso!'
      );
    }
    setToggleModal({
      show: false,
      rewardId: '',
      rewardName: '',
      currentStatus: true,
    });
  };

  const handleDelete = async (id: string, name: string) => {
    if (
      window.confirm(
        `Tem certeza que deseja excluir o prêmio "${name}"? Esta ação não pode ser desfeita.`
      )
    ) {
      await deleteReward(id);
    }
  };

  const filteredRewards = showInactive
    ? rewards
    : rewards.filter(r => r.isActive);

  const inactiveCount = rewards.filter(r => !r.isActive).length;

  if (loading) {
    return (
      <Layout>
        <ManageRewardsShimmer />
      </Layout>
    );
  }

  return (
    <Layout>
      <PageTransition>
        <Container>
          {/* Header */}
          <Header>
            <HeaderContent>
              <Title>Gerenciar Prêmios</Title>
              <Subtitle>
                Crie e gerencie os prêmios disponíveis para resgate
              </Subtitle>
            </HeaderContent>
          </Header>

          {/* Estatísticas */}
          {stats && (
            <StatsGrid>
              <StatCard>
                <StatLabel>Total de Resgates</StatLabel>
                <StatValue>{stats.total}</StatValue>
              </StatCard>
              <StatCard>
                <StatLabel>Pendentes</StatLabel>
                <StatValue $color='#f59e0b'>{stats.pending}</StatValue>
              </StatCard>
              <StatCard>
                <StatLabel>Aprovados</StatLabel>
                <StatValue $color='#10b981'>{stats.approved}</StatValue>
              </StatCard>
              <StatCard>
                <StatLabel>Pontos Gastos</StatLabel>
                <StatValue>{formatPoints(stats.totalPointsSpent)}</StatValue>
              </StatCard>
            </StatsGrid>
          )}

          {/* Controles */}
          <Controls>
            <ToggleButton onClick={() => setShowInactive(!showInactive)}>
              {showInactive ? <MdVisibilityOff /> : <MdVisibility />}
              {showInactive ? 'Ocultar Inativos' : 'Mostrar Inativos'}
              {inactiveCount > 0 && (
                <InactiveBadge>{inactiveCount}</InactiveBadge>
              )}
            </ToggleButton>
            <PermissionButton
              permission='reward:create'
              onClick={() => navigate('/rewards/create')}
            >
              <MdAdd size={20} />
              Criar Novo Prêmio
            </PermissionButton>
          </Controls>

          {/* Lista de Prêmios */}
          {filteredRewards.length === 0 ? (
            <EmptyState>
              <EmptyIcon>🎁</EmptyIcon>
              <EmptyTitle>Nenhum prêmio cadastrado</EmptyTitle>
              <EmptyText>
                Comece criando o primeiro prêmio para seus colaboradores!
              </EmptyText>
            </EmptyState>
          ) : (
            <RewardsTable>
              <thead>
                <tr>
                  <th>Prêmio</th>
                  <th>Categoria</th>
                  <th>Custo</th>
                  <th>Estoque</th>
                  <th>Resgatados</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredRewards.map(reward => (
                  <tr key={reward.id}>
                    <RewardCell>
                      <RewardIcon>
                        {reward.icon || getDefaultIcon(reward.category)}
                      </RewardIcon>
                      <RewardInfo>
                        <RewardName>{reward.name}</RewardName>
                        {reward.monetaryValue && (
                          <RewardValue>
                            {formatMoney(reward.monetaryValue)}
                          </RewardValue>
                        )}
                      </RewardInfo>
                    </RewardCell>
                    <td>{getCategoryLabel(reward.category)}</td>
                    <td>
                      <PointsBadge>
                        💎 {formatPoints(reward.pointsCost)}
                      </PointsBadge>
                    </td>
                    <td>
                      {reward.stockQuantity === null ||
                      reward.stockQuantity === undefined
                        ? '♾️ Ilimitado'
                        : reward.stockQuantity}
                    </td>
                    <td>{reward.redeemedCount}</td>
                    <td>
                      <StatusBadge $active={reward.isActive}>
                        {reward.isActive ? '🟢 Ativo' : '🔴 Inativo'}
                      </StatusBadge>
                    </td>
                    <td>
                      <ActionsCell>
                        <ActionButton
                          $type='toggle'
                          onClick={() =>
                            handleToggleActive(
                              reward.id,
                              reward.name,
                              reward.isActive
                            )
                          }
                          title={
                            reward.isActive
                              ? 'Desativar prêmio'
                              : 'Ativar prêmio'
                          }
                        >
                          {reward.isActive ? (
                            <MdVisibilityOff />
                          ) : (
                            <MdVisibility />
                          )}
                        </ActionButton>
                        <ActionButton
                          $type='edit'
                          onClick={() => navigate(`/rewards/edit/${reward.id}`)}
                          title='Editar'
                        >
                          <MdEdit />
                        </ActionButton>
                        <ActionButton
                          $type='delete'
                          onClick={() => handleDelete(reward.id, reward.name)}
                          title='Excluir'
                        >
                          <MdDelete />
                        </ActionButton>
                      </ActionsCell>
                    </td>
                  </tr>
                ))}
              </tbody>
            </RewardsTable>
          )}

          {/* Modal de Confirmação de Toggle */}
          {toggleModal.show && (
            <ModalOverlay
              onClick={() => setToggleModal({ ...toggleModal, show: false })}
            >
              <ModalContent onClick={e => e.stopPropagation()}>
                <ModalHeader>
                  <ModalTitle>
                    {toggleModal.currentStatus
                      ? '🔴 Desativar Prêmio'
                      : '🟢 Ativar Prêmio'}
                  </ModalTitle>
                </ModalHeader>
                <ModalBody>
                  <ModalText>
                    {toggleModal.currentStatus ? (
                      <>
                        Tem certeza que deseja <strong>desativar</strong> o
                        prêmio <strong>"{toggleModal.rewardName}"</strong>?
                        <br />
                        <br />
                        <WarningText>
                          ⚠️ Prêmios inativos não aparecem no catálogo para os
                          usuários.
                        </WarningText>
                      </>
                    ) : (
                      <>
                        Tem certeza que deseja <strong>ativar</strong> o prêmio{' '}
                        <strong>"{toggleModal.rewardName}"</strong>?
                        <br />
                        <br />
                        <SuccessText>
                          ✅ Prêmios ativos ficam visíveis no catálogo para
                          resgate.
                        </SuccessText>
                      </>
                    )}
                  </ModalText>
                </ModalBody>
                <ModalActions>
                  <ModalButton
                    onClick={() =>
                      setToggleModal({ ...toggleModal, show: false })
                    }
                    $variant='secondary'
                  >
                    Cancelar
                  </ModalButton>
                  <ModalButton onClick={confirmToggle} $variant='primary'>
                    {toggleModal.currentStatus ? 'Desativar' : 'Ativar'}
                  </ModalButton>
                </ModalActions>
              </ModalContent>
            </ModalOverlay>
          )}
        </Container>
      </PageTransition>
    </Layout>
  );
};

const Container = styled.div`
  padding: 2rem;
  width: 100%;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const HeaderContent = styled.div``;

const Title = styled.h1`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;

  svg {
    color: #667eea;
    font-size: 2.25rem;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;

    svg {
      font-size: 1.75rem;
    }
  }
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1rem;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  padding: 1.5rem;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const StatValue = styled.div<{ $color?: string }>`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.$color || props.theme.colors.text};
  line-height: 1;
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.hover};
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const InactiveBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.5rem;
  height: 1.5rem;
  padding: 0 0.375rem;
  background: #ef4444;
  color: white;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  margin-left: 0.25rem;
`;

const RewardsTable = styled.table`
  width: 100%;
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 1rem;
  overflow: hidden;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  thead {
    background: ${props => props.theme.colors.backgroundSecondary};

    th {
      padding: 1rem;
      text-align: left;
      font-size: 0.875rem;
      font-weight: 600;
      color: ${props => props.theme.colors.textSecondary};
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid ${props => props.theme.colors.border};
      transition: background 0.2s;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background: ${props => props.theme.colors.hover};
      }

      td {
        padding: 1rem;
        font-size: 0.9375rem;
        color: ${props => props.theme.colors.text};
      }
    }
  }

  @media (max-width: 968px) {
    display: block;
    overflow-x: auto;
  }
`;

const RewardCell = styled.td`
  display: flex !important;
  align-items: center;
  gap: 1rem;
`;

const RewardIcon = styled.div`
  font-size: 2.5rem;
  flex-shrink: 0;
`;

const RewardInfo = styled.div``;

const RewardName = styled.div`
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const RewardValue = styled.div`
  font-size: 0.8125rem;
  color: #10b981;
  font-weight: 600;
`;

const PointsBadge = styled.div`
  display: inline-block;
  padding: 0.375rem 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 9999px;
  font-size: 0.8125rem;
  font-weight: 700;
`;

const StatusBadge = styled.div<{ $active: boolean }>`
  display: inline-block;
  padding: 0.375rem 0.875rem;
  background: ${props => (props.$active ? '#d1fae520' : '#fee2e220')};
  color: ${props => (props.$active ? '#10b981' : '#ef4444')};
  border: 1px solid ${props => (props.$active ? '#10b981' : '#ef4444')}40;
  border-radius: 9999px;
  font-size: 0.8125rem;
  font-weight: 700;
`;

const ActionsCell = styled.td`
  display: flex !important;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ $type: 'edit' | 'delete' | 'toggle' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: ${props =>
    props.$type === 'delete'
      ? '#fee2e2'
      : props.$type === 'edit'
        ? '#dbeafe'
        : props.theme.colors.backgroundSecondary};
  color: ${props =>
    props.$type === 'delete'
      ? '#ef4444'
      : props.$type === 'edit'
        ? '#3b82f6'
        : props.theme.colors.text};
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;

  svg {
    font-size: 1.125rem;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px
      ${props =>
        props.$type === 'delete'
          ? 'rgba(239, 68, 68, 0.3)'
          : props.$type === 'edit'
            ? 'rgba(59, 130, 246, 0.3)'
            : 'rgba(0, 0, 0, 0.1)'};
  }
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 1.125rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 3rem;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 5rem;
  margin-bottom: 1.5rem;
  opacity: 0.7;
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.75rem;
`;

const EmptyText = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  max-width: 500px;
  line-height: 1.6;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 1rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease-out;

  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const ModalHeader = styled.div`
  padding: 1.5rem 1.5rem 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const ModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const ModalText = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
  margin: 0;
`;

const WarningText = styled.div`
  padding: 1rem;
  background: #fef3c7;
  color: #92400e;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  border: 1px solid #fbbf24;
`;

const SuccessText = styled.div`
  padding: 1rem;
  background: #d1fae5;
  color: #065f46;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  border: 1px solid #10b981;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 1rem 1.5rem 1.5rem;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const ModalButton = styled.button<{ $variant: 'primary' | 'secondary' }>`
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  ${props =>
    props.$variant === 'primary'
      ? `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
    }
  `
      : `
    background: ${props.theme.colors.backgroundSecondary};
    color: ${props.theme.colors.text};
    
    &:hover {
      background: ${props.theme.colors.border};
    }
  `}

  &:active {
    transform: translateY(0);
  }
`;

export default ManageRewardsPage;
