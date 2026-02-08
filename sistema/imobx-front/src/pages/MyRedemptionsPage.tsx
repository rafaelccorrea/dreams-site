import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Layout } from '@/components/layout/Layout';
import { PageTransition } from '@/components/common/PageTransition';
import { RedemptionCard } from '@/components/rewards/RedemptionCard';
import { RedemptionsListShimmer } from '@/components/shimmer/RedemptionsListShimmer';
import { useMyRedemptions } from '@/hooks/useRewards';
import { RedemptionStatus } from '@/types/rewards.types';
import { getStatusLabel } from '@/utils/rewards';
import { MdCardGiftcard } from 'react-icons/md';

export const MyRedemptionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { redemptions, loading, refetch } = useMyRedemptions();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Filtrar por status
  const filteredRedemptions = redemptions.filter(r =>
    filterStatus === 'all' ? true : r.status === filterStatus
  );

  // Contar por status
  const statusCounts = {
    all: redemptions.length,
    pending: redemptions.filter(r => r.status === 'pending').length,
    approved: redemptions.filter(r => r.status === 'approved').length,
    rejected: redemptions.filter(r => r.status === 'rejected').length,
    delivered: redemptions.filter(r => r.status === 'delivered').length,
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
              <Title>Minhas Solicitações</Title>
              <Subtitle>
                Acompanhe o status das suas solicitações de resgate de prêmios
              </Subtitle>
            </HeaderContent>
            <HeaderButton onClick={() => navigate('/rewards')}>
              <MdCardGiftcard size={20} />
              Ver Catálogo
            </HeaderButton>
          </Header>

          {/* Filtros */}
          <FiltersContainer>
            <FilterButton
              $active={filterStatus === 'all'}
              onClick={() => setFilterStatus('all')}
            >
              Todos ({statusCounts.all})
            </FilterButton>
            <FilterButton
              $active={filterStatus === 'pending'}
              onClick={() => setFilterStatus('pending')}
            >
              ⏳ {getStatusLabel('pending')} ({statusCounts.pending})
            </FilterButton>
            <FilterButton
              $active={filterStatus === 'approved'}
              onClick={() => setFilterStatus('approved')}
            >
              ✅ {getStatusLabel('approved')} ({statusCounts.approved})
            </FilterButton>
            <FilterButton
              $active={filterStatus === 'rejected'}
              onClick={() => setFilterStatus('rejected')}
            >
              ❌ {getStatusLabel('rejected')} ({statusCounts.rejected})
            </FilterButton>
            <FilterButton
              $active={filterStatus === 'delivered'}
              onClick={() => setFilterStatus('delivered')}
            >
              🎁 {getStatusLabel('delivered')} ({statusCounts.delivered})
            </FilterButton>
          </FiltersContainer>

          {/* Lista de Solicitações */}
          {filteredRedemptions.length === 0 ? (
            <EmptyState>
              <EmptyIcon>{filterStatus === 'all' ? '📋' : '🔍'}</EmptyIcon>
              <EmptyTitle>
                {filterStatus === 'all'
                  ? 'Nenhuma solicitação ainda'
                  : 'Nenhuma solicitação encontrada'}
              </EmptyTitle>
              <EmptyText>
                {filterStatus === 'all' ? (
                  <>
                    Você ainda não solicitou nenhum resgate de prêmio.
                    <br />
                    Visite o catálogo para escolher um prêmio!
                  </>
                ) : (
                  `Você não tem solicitações com o status "${getStatusLabel(
                    filterStatus
                  )}".`
                )}
              </EmptyText>
              {filterStatus === 'all' && (
                <EmptyButton onClick={() => navigate('/rewards')}>
                  <MdCardGiftcard size={20} />
                  Ver Catálogo de Prêmios
                </EmptyButton>
              )}
            </EmptyState>
          ) : (
            <RedemptionsList>
              {filteredRedemptions.map(redemption => (
                <RedemptionCard key={redemption.id} redemption={redemption} />
              ))}
            </RedemptionsList>
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
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
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

const HeaderButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
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
  margin-bottom: 2rem;
`;

const EmptyButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }
`;

export default MyRedemptionsPage;
