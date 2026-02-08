import React, { useState } from 'react';
import styled from 'styled-components';
import { Layout } from '@/components/layout/Layout';
import { PageTransition } from '@/components/common/PageTransition';
import { PendingRedemptionCard } from '@/components/rewards/PendingRedemptionCard';
import { ReviewModal } from '@/components/rewards/ReviewModal';
import { RedemptionsListShimmer } from '@/components/shimmer/RedemptionsListShimmer';
import { usePendingRedemptions } from '@/hooks/useRewards';
import type { RewardRedemption } from '@/types/rewards.types';
import { getStatusLabel } from '@/utils/rewards';
import { MdCheckCircle } from 'react-icons/md';

export const ApproveRedemptionsPage: React.FC = () => {
  const {
    redemptions,
    total,
    loading,
    refetch,
    reviewRedemption,
    deliverRedemption,
  } = usePendingRedemptions();
  const [selectedRedemption, setSelectedRedemption] =
    useState<RewardRedemption | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('pending');

  // Filtrar por status
  const filteredRedemptions =
    filterStatus === 'all'
      ? redemptions
      : redemptions.filter(r => r.status === filterStatus);

  const handleReviewClick = (redemption: RewardRedemption) => {
    setSelectedRedemption(redemption);
    setShowReviewModal(true);
  };

  const handleApprove = async (notes: string) => {
    if (!selectedRedemption) return;

    const result = await reviewRedemption(selectedRedemption.id, {
      status: 'approved',
      reviewNotes: notes,
    });

    if (result) {
      setShowReviewModal(false);
      setSelectedRedemption(null);
      refetch({ status: filterStatus === 'all' ? undefined : filterStatus });
    }
  };

  const handleReject = async (notes: string) => {
    if (!selectedRedemption) return;

    const result = await reviewRedemption(selectedRedemption.id, {
      status: 'rejected',
      reviewNotes: notes,
    });

    if (result) {
      setShowReviewModal(false);
      setSelectedRedemption(null);
      refetch({ status: filterStatus === 'all' ? undefined : filterStatus });
    }
  };

  const handleCloseModal = () => {
    setShowReviewModal(false);
    setSelectedRedemption(null);
  };

  // Contar por status
  const statusCounts = {
    pending: redemptions.filter(r => r.status === 'pending').length,
    approved: redemptions.filter(r => r.status === 'approved').length,
    all: total,
  };

  if (loading) {
    return (
      <Layout>
        <RedemptionsListShimmer />
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
              <Title>Aprovar Resgates</Title>
              <Subtitle>
                Analise e aprove/rejeite as solicitações de resgate de prêmios
              </Subtitle>
            </HeaderContent>
            {statusCounts.pending > 0 && (
              <PendingBadge>
                {statusCounts.pending} pendente
                {statusCounts.pending !== 1 ? 's' : ''}
              </PendingBadge>
            )}
          </Header>

          {/* Filtros */}
          <FiltersContainer>
            <FilterButton
              $active={filterStatus === 'pending'}
              onClick={() => {
                setFilterStatus('pending');
                refetch({ status: 'pending' });
              }}
            >
              ⏳ Pendentes ({statusCounts.pending})
            </FilterButton>
            <FilterButton
              $active={filterStatus === 'approved'}
              onClick={() => {
                setFilterStatus('approved');
                refetch({ status: 'approved' });
              }}
            >
              ✅ Aprovados ({statusCounts.approved})
            </FilterButton>
            <FilterButton
              $active={filterStatus === 'all'}
              onClick={() => {
                setFilterStatus('all');
                refetch();
              }}
            >
              📋 Todos ({statusCounts.all})
            </FilterButton>
          </FiltersContainer>

          {/* Lista de Solicitações */}
          {filteredRedemptions.length === 0 ? (
            <EmptyState>
              <EmptyIcon>{filterStatus === 'pending' ? '✅' : '🔍'}</EmptyIcon>
              <EmptyTitle>
                {filterStatus === 'pending'
                  ? 'Tudo em dia!'
                  : 'Nenhuma solicitação encontrada'}
              </EmptyTitle>
              <EmptyText>
                {filterStatus === 'pending'
                  ? 'Não há solicitações pendentes no momento.'
                  : `Não há solicitações com o status "${getStatusLabel(filterStatus)}".`}
              </EmptyText>
            </EmptyState>
          ) : (
            <RedemptionsList>
              {filteredRedemptions.map(redemption => (
                <PendingRedemptionCard
                  key={redemption.id}
                  redemption={redemption}
                  onReview={() => handleReviewClick(redemption)}
                />
              ))}
            </RedemptionsList>
          )}

          {/* Modal de Revisão */}
          {showReviewModal && selectedRedemption && (
            <ReviewModal
              redemption={selectedRedemption}
              onApprove={handleApprove}
              onReject={handleReject}
              onClose={handleCloseModal}
            />
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;

  svg {
    color: #f59e0b;
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

const PendingBadge = styled.div`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 2px solid #f59e0b;
  color: #92400e;
  border-radius: 9999px;
  font-size: 1rem;
  font-weight: 700;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);

  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ $active: boolean }>`
  padding: 0.625rem 1.25rem;
  background: ${props =>
    props.$active
      ? props.theme.colors.primary
      : props.theme.colors.backgroundSecondary};
  color: ${props => (props.$active ? 'white' : props.theme.colors.text)};
  border: 1px solid
    ${props =>
      props.$active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background: ${props =>
      props.$active
        ? props.theme.colors.primaryDark
        : props.theme.colors.hover};
  }
`;

const RedemptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

export default ApproveRedemptionsPage;
