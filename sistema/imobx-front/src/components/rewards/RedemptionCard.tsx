import React from 'react';
import styled from 'styled-components';
import type { RewardRedemption } from '@/types/rewards.types';
import {
  getStatusLabel,
  getStatusColor,
  getStatusEmoji,
  formatPoints,
  formatRedemptionDate,
} from '@/utils/rewards';

interface RedemptionCardProps {
  redemption: RewardRedemption;
}

export const RedemptionCard: React.FC<RedemptionCardProps> = ({
  redemption,
}) => {
  const statusColor = getStatusColor(redemption.status);
  const statusEmoji = getStatusEmoji(redemption.status);

  return (
    <Card>
      <Header>
        <RewardInfo>
          <RewardIcon>{redemption.reward?.icon || '🎁'}</RewardIcon>
          <RewardDetails>
            <RewardName>{redemption.reward?.name}</RewardName>
            <Points>💎 {formatPoints(redemption.pointsSpent)} pontos</Points>
          </RewardDetails>
        </RewardInfo>
        <StatusBadge $color={statusColor}>
          {statusEmoji} {getStatusLabel(redemption.status)}
        </StatusBadge>
      </Header>

      <Content>
        <InfoRow>
          <InfoLabel>Solicitado em:</InfoLabel>
          <InfoValue>{formatRedemptionDate(redemption.createdAt)}</InfoValue>
        </InfoRow>

        {redemption.userNotes && (
          <NotesSection>
            <NotesLabel>📝 Suas observações:</NotesLabel>
            <NotesText>{redemption.userNotes}</NotesText>
          </NotesSection>
        )}

        {redemption.reviewNotes && (
          <ReviewSection $status={redemption.status}>
            <ReviewLabel>
              {redemption.status === 'approved' ? '✅' : '❌'} Resposta do
              gestor:
            </ReviewLabel>
            <ReviewText>{redemption.reviewNotes}</ReviewText>
            {redemption.reviewedAt && (
              <ReviewDate>
                {formatRedemptionDate(redemption.reviewedAt)}
              </ReviewDate>
            )}
          </ReviewSection>
        )}

        {redemption.status === 'delivered' && redemption.deliveredAt && (
          <DeliveredSection>
            <DeliveredLabel>🎁 Entregue em:</DeliveredLabel>
            <DeliveredDate>
              {formatRedemptionDate(redemption.deliveredAt)}
            </DeliveredDate>
          </DeliveredSection>
        )}

        {redemption.status === 'pending' && (
          <PendingNote>
            ⏳ Aguardando aprovação do gestor. Os pontos não foram debitados
            ainda.
          </PendingNote>
        )}
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
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  gap: 1rem;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const RewardInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const RewardIcon = styled.div`
  font-size: 3rem;
`;

const RewardDetails = styled.div``;

const RewardName = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.25rem;
`;

const Points = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
`;

const StatusBadge = styled.div<{ $color: string }>`
  padding: 0.5rem 1rem;
  background: ${props => props.$color}20;
  color: ${props => props.$color};
  border: 1px solid ${props => props.$color}40;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 700;
  white-space: nowrap;
`;

const Content = styled.div`
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InfoLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

const InfoValue = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
`;

const NotesSection = styled.div`
  padding: 1rem;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 0.5rem;
`;

const NotesLabel = styled.div`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const NotesText = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.5;
`;

const ReviewSection = styled.div<{ $status: string }>`
  padding: 1rem;
  background: ${props =>
    props.$status === 'approved' ? '#d1fae520' : '#fee2e220'};
  border: 1px solid
    ${props => (props.$status === 'approved' ? '#10b981' : '#ef4444')}40;
  border-radius: 0.5rem;
`;

const ReviewLabel = styled.div`
  font-size: 0.8125rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const ReviewText = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  line-height: 1.5;
  margin-bottom: 0.5rem;
`;

const ReviewDate = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const DeliveredSection = styled.div`
  padding: 1rem;
  background: #dbeafe;
  border: 1px solid #3b82f640;
  border-radius: 0.5rem;
`;

const DeliveredLabel = styled.div`
  font-size: 0.8125rem;
  font-weight: 700;
  color: #1e40af;
  margin-bottom: 0.25rem;
`;

const DeliveredDate = styled.div`
  font-size: 0.875rem;
  color: #1e3a8a;
  font-weight: 600;
`;

const PendingNote = styled.div`
  padding: 0.875rem;
  background: #fef3c7;
  border: 1px solid #fde68a;
  border-radius: 0.5rem;
  color: #92400e;
  font-size: 0.8125rem;
  font-weight: 500;
`;
