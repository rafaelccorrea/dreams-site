import React from 'react';
import styled from 'styled-components';
import type { Reward } from '@/types/rewards.types';
import {
  formatPoints,
  formatMoney,
  canRedeem,
  getPointsNeeded,
  hasStock,
  getAvailableStock,
  getDefaultIcon,
  getCategoryLabel,
} from '@/utils/rewards';

interface RewardCardProps {
  reward: Reward;
  myPoints: number;
  onRedeem: () => void;
}

export const RewardCard: React.FC<RewardCardProps> = ({
  reward,
  myPoints,
  onRedeem,
}) => {
  const canRedeemReward = canRedeem(myPoints, reward.pointsCost);
  const isOutOfStock = !hasStock(reward.stockQuantity, reward.redeemedCount);
  const availableStock = getAvailableStock(
    reward.stockQuantity,
    reward.redeemedCount
  );
  const pointsNeeded = getPointsNeeded(myPoints, reward.pointsCost);

  const isDisabled = !canRedeemReward || isOutOfStock;

  return (
    <Card>
      <ImageContainer>
        {reward.imageUrl ? (
          <Image src={reward.imageUrl} alt={reward.name} />
        ) : (
          <IconPlaceholder>
            {reward.icon || getDefaultIcon(reward.category)}
          </IconPlaceholder>
        )}
        <CategoryBadge>{getCategoryLabel(reward.category)}</CategoryBadge>
      </ImageContainer>

      <Content>
        <Title>{reward.name}</Title>
        {reward.description && <Description>{reward.description}</Description>}

        {reward.monetaryValue && (
          <MonetaryValue>
            💵 Valor: {formatMoney(reward.monetaryValue)}
          </MonetaryValue>
        )}

        <PointsCost>💎 {formatPoints(reward.pointsCost)} pontos</PointsCost>

        {reward.stockQuantity !== null &&
          reward.stockQuantity !== undefined && (
            <Stock $outOfStock={isOutOfStock}>
              {isOutOfStock ? (
                <>❌ Esgotado</>
              ) : (
                <>📦 {availableStock} disponíveis</>
              )}
            </Stock>
          )}

        <RedeemButton onClick={onRedeem} disabled={isDisabled}>
          {isOutOfStock
            ? 'Esgotado'
            : canRedeemReward
              ? '🎁 Resgatar'
              : `Faltam ${formatPoints(pointsNeeded)} pontos`}
        </RedeemButton>
      </Content>
    </Card>
  );
};

const Card = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.2s,
    box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const IconPlaceholder = styled.div`
  font-size: 5rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
`;

const CategoryBadge = styled.div`
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  padding: 0.375rem 0.75rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Content = styled.div`
  padding: 1.25rem;
`;

const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.5;
  margin-bottom: 0.75rem;
`;

const MonetaryValue = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #10b981;
  margin-bottom: 0.5rem;
`;

const PointsCost = styled.div`
  display: inline-block;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 9999px;
  font-size: 0.9375rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
`;

const Stock = styled.div<{ $outOfStock: boolean }>`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${props => (props.$outOfStock ? '#ef4444' : '#6b7280')};
  margin-bottom: 1rem;
`;

const RedeemButton = styled.button`
  width: 100%;
  padding: 0.75rem 1.5rem;
  background: ${props =>
    props.disabled ? props.theme.colors.backgroundSecondary : '#10b981'};
  color: ${props =>
    props.disabled ? props.theme.colors.textSecondary : 'white'};
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #059669;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;
