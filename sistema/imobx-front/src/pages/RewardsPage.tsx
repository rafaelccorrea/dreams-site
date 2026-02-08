import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Layout } from '@/components/layout/Layout';
import { PageTransition } from '@/components/common/PageTransition';
import { RewardCard } from '@/components/rewards/RewardCard';
import { RedeemModal } from '@/components/rewards/RedeemModal';
import { RewardCatalogShimmer } from '@/components/shimmer/RewardCatalogShimmer';
import { useRewards } from '@/hooks/useRewards';
import { gamificationService } from '@/services/gamification.service';
import type { Reward } from '@/types/rewards.types';
import { ScorePeriod } from '@/types/gamification.types';
import { MdHistory } from 'react-icons/md';
import { toast } from 'react-toastify';

export const RewardsPage: React.FC = () => {
  const navigate = useNavigate();
  const { rewards, loading, redeemReward, refetch } = useRewards();
  const [myPoints, setMyPoints] = useState(0);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [loadingPoints, setLoadingPoints] = useState(true);

  // Carregar pontos do usuário
  useEffect(() => {
    const loadMyPoints = async () => {
      try {
        setLoadingPoints(true);
        const score = await gamificationService.getMyScore(
          ScorePeriod.ALL_TIME
        );
        setMyPoints(score.totalPoints || 0);
      } catch (error) {
        console.error('Erro ao carregar pontos:', error);
        toast.error('Erro ao carregar seus pontos');
      } finally {
        setLoadingPoints(false);
      }
    };

    loadMyPoints();
  }, []);

  const handleRedeemClick = (reward: Reward) => {
    setSelectedReward(reward);
    setShowRedeemModal(true);
  };

  const handleConfirmRedeem = async (notes: string) => {
    if (!selectedReward) return;

    const result = await redeemReward({
      rewardId: selectedReward.id,
      userNotes: notes,
    });

    if (result) {
      setShowRedeemModal(false);
      setSelectedReward(null);
      // Navegar para minhas solicitações
      setTimeout(() => {
        navigate('/rewards/my-redemptions');
      }, 1500);
    }
  };

  const handleCloseModal = () => {
    setShowRedeemModal(false);
    setSelectedReward(null);
  };

  if (loadingPoints || loading) {
    return (
      <Layout>
        <RewardCatalogShimmer />
      </Layout>
    );
  }

  return (
    <Layout>
      <PageTransition>
        <Container>
          {/* Header com Pontos */}
          <PointsHeader>
            <PointsContent>
              <PointsLabel>Seus pontos disponíveis</PointsLabel>
              <PointsValue>{myPoints.toLocaleString('pt-BR')} 💎</PointsValue>
              <PointsSubtext>
                Use seus pontos para resgatar prêmios incríveis!
              </PointsSubtext>
            </PointsContent>
            <HeaderButton onClick={() => navigate('/rewards/my-redemptions')}>
              <MdHistory size={20} />
              Ver Minhas Solicitações
            </HeaderButton>
          </PointsHeader>

          {/* Título */}
          <Header>
            <Title>Catálogo de Prêmios</Title>
            <Subtitle>
              Escolha seu prêmio e faça sua solicitação. Após aprovação, os
              pontos serão debitados.
            </Subtitle>
          </Header>

          {/* Grid de Prêmios */}
          {rewards.length === 0 ? (
            <EmptyState>
              <EmptyIcon>🎁</EmptyIcon>
              <EmptyTitle>Nenhum prêmio disponível</EmptyTitle>
              <EmptyText>
                Não há prêmios disponíveis no momento. Aguarde novos prêmios!
              </EmptyText>
            </EmptyState>
          ) : (
            <RewardsGrid>
              {rewards.map(reward => (
                <RewardCard
                  key={reward.id}
                  reward={reward}
                  myPoints={myPoints}
                  onRedeem={() => handleRedeemClick(reward)}
                />
              ))}
            </RewardsGrid>
          )}

          {/* Modal de Confirmação de Resgate */}
          {showRedeemModal && selectedReward && (
            <RedeemModal
              reward={selectedReward}
              myPoints={myPoints}
              onConfirm={handleConfirmRedeem}
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

const PointsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 1.5rem;
  }
`;

const PointsContent = styled.div`
  flex: 1;
`;

const PointsLabel = styled.div`
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const PointsValue = styled.div`
  font-size: 3.5rem;
  font-weight: 700;
  color: white;
  line-height: 1;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const PointsSubtext = styled.div`
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.8);
`;

const HeaderButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const Header = styled.div`
  margin-bottom: 2rem;
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

const RewardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
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
  max-width: 400px;
  line-height: 1.6;
`;

export default RewardsPage;
