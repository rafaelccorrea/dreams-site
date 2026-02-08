import React from 'react';
import styled from 'styled-components';
import { MdPerson, MdEmail } from 'react-icons/md';
import type { RewardRedemption } from '@/types/rewards.types';
import { formatPoints, formatRedemptionDate } from '@/utils/rewards';

interface PendingRedemptionCardProps {
  redemption: RewardRedemption;
  onReview: () => void;
}

export const PendingRedemptionCard: React.FC<PendingRedemptionCardProps> = ({
  redemption,
  onReview,
}) => {
  return (
    <Card>
      <Header>
        <UserInfo>
          <UserAvatar>
            {redemption.user?.profileImageUrl ? (
              <img
                src={redemption.user.profileImageUrl}
                alt={redemption.user.name}
              />
            ) : (
              <MdPerson />
            )}
          </UserAvatar>
          <UserDetails>
            <UserName>{redemption.user?.name || 'Usuário'}</UserName>
            <UserEmail>
              <MdEmail size={14} />
              {redemption.user?.email || 'N/A'}
            </UserEmail>
          </UserDetails>
        </UserInfo>
        <RequestDate>
          📅 {formatRedemptionDate(redemption.createdAt)}
        </RequestDate>
      </Header>

      <Content>
        <RewardSection>
          <RewardIcon>{redemption.reward?.icon || '🎁'}</RewardIcon>
          <RewardInfo>
            <RewardName>{redemption.reward?.name}</RewardName>
            <RewardPoints>
              💎 {formatPoints(redemption.pointsSpent)} pontos
            </RewardPoints>
            {redemption.reward?.description && (
              <RewardDescription>
                {redemption.reward.description}
              </RewardDescription>
            )}
          </RewardInfo>
        </RewardSection>

        {redemption.userNotes && (
          <NotesSection>
            <NotesLabel>📝 Observações do usuário:</NotesLabel>
            <NotesText>{redemption.userNotes}</NotesText>
          </NotesSection>
        )}

        <ReviewButton onClick={onReview}>⚡ Analisar Solicitação</ReviewButton>
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
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-bottom: 2px solid #f59e0b;
  gap: 1rem;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserAvatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  font-weight: 700;
  overflow: hidden;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  svg {
    font-size: 2rem;
  }
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const UserName = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  color: #92400e;
`;

const UserEmail = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: #78350f;

  svg {
    flex-shrink: 0;
  }
`;

const RequestDate = styled.div`
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 9999px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #92400e;
  white-space: nowrap;
`;

const Content = styled.div`
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RewardSection = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 0.75rem;
`;

const RewardIcon = styled.div`
  font-size: 3.5rem;
  flex-shrink: 0;
`;

const RewardInfo = styled.div`
  flex: 1;
`;

const RewardName = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.375rem;
`;

const RewardPoints = styled.div`
  font-size: 0.9375rem;
  font-weight: 600;
  color: #667eea;
  margin-bottom: 0.5rem;
`;

const RewardDescription = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.5;
`;

const NotesSection = styled.div`
  padding: 1rem;
  background: #dbeafe;
  border: 1px solid #bfdbfe;
  border-radius: 0.5rem;
`;

const NotesLabel = styled.div`
  font-size: 0.8125rem;
  font-weight: 700;
  color: #1e40af;
  margin-bottom: 0.5rem;
`;

const NotesText = styled.div`
  font-size: 0.875rem;
  color: #1e3a8a;
  line-height: 1.5;
`;

const ReviewButton = styled.button`
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;
