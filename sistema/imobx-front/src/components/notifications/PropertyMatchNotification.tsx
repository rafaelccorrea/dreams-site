/**
 * Componente de Notificação de Match de Propriedade
 * Exibe notificações de matches com informações ricas
 */

import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { MdHome, MdPeople, MdTrendingUp } from 'react-icons/md';
import type { Notification } from '../../services/notificationApi';
import type { PropertyMatchNotificationMetadata } from '../../utils/notificationNavigation';

interface PropertyMatchNotificationProps {
  notification: Notification;
  onRead?: () => void;
}

export const PropertyMatchNotification: React.FC<
  PropertyMatchNotificationProps
> = ({ notification, onRead }) => {
  const navigate = useNavigate();
  const metadata =
    notification.metadata as PropertyMatchNotificationMetadata | null;

  const handleClick = () => {
    if (onRead) {
      onRead();
    }

    if (metadata?.propertyId) {
      navigate(`/properties/${metadata.propertyId}/matches`);
    } else {
      navigate('/matches');
    }
  };

  const isHighScore =
    notification.type === 'property_match_high_score' ||
    notification.type === 'PROPERTY_MATCH_HIGH_SCORE';

  const formatPrice = (price?: number) => {
    if (!price) return '';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <NotificationCard
      $isRead={notification.read}
      $isHighScore={isHighScore}
      onClick={handleClick}
    >
      <IconContainer $isHighScore={isHighScore}>
        {isHighScore ? '🎯' : '🏠'}
      </IconContainer>

      <Content>
        <Header>
          <Title>{notification.title}</Title>
          {!notification.read && <UnreadBadge />}
        </Header>

        <Message>{notification.message}</Message>

        {metadata && (
          <MatchDetails>
            <DetailRow>
              <DetailIcon>
                <MdHome size={16} />
              </DetailIcon>
              <DetailText>
                {metadata.propertyCity && metadata.propertyState && (
                  <>
                    📍 {metadata.propertyCity}, {metadata.propertyState}
                  </>
                )}
              </DetailText>
            </DetailRow>

            {metadata.propertyPrice && (
              <DetailRow>
                <DetailIcon>💰</DetailIcon>
                <DetailText>{formatPrice(metadata.propertyPrice)}</DetailText>
              </DetailRow>
            )}

            <DetailRow>
              <DetailIcon>
                <MdPeople size={16} />
              </DetailIcon>
              <DetailText>
                {metadata.totalMatches}{' '}
                {metadata.totalMatches === 1
                  ? 'cliente compatível'
                  : 'clientes compatíveis'}
              </DetailText>
            </DetailRow>

            {metadata.highScoreMatches > 0 && (
              <HighScoreRow>
                <DetailIcon>
                  <MdTrendingUp size={16} />
                </DetailIcon>
                <HighScoreText>
                  {metadata.highScoreMatches} com alta compatibilidade (80%+)
                </HighScoreText>
              </HighScoreRow>
            )}
          </MatchDetails>
        )}

        <ActionButton>Ver Matches →</ActionButton>
      </Content>
    </NotificationCard>
  );
};

const NotificationCard = styled.div<{
  $isRead: boolean;
  $isHighScore: boolean;
}>`
  display: flex;
  gap: 16px;
  padding: 16px;
  background: ${props =>
    props.$isRead
      ? 'var(--card-background)'
      : 'var(--notification-unread-bg, rgba(59, 130, 246, 0.05))'};
  border: 1px solid
    ${props => (props.$isHighScore ? 'var(--primary)' : 'var(--border)')};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;

  &:hover {
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: var(--primary);
  }

  ${props =>
    props.$isHighScore &&
    `
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.05), rgba(249, 115, 22, 0.05));
    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.15);
  `}
`;

const IconContainer = styled.div<{ $isHighScore: boolean }>`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-size: 24px;
  flex-shrink: 0;
  background: ${props =>
    props.$isHighScore
      ? 'linear-gradient(135deg, #ef4444, #f97316)'
      : 'var(--primary-gradient, linear-gradient(135deg, #3b82f6, #2563eb))'};
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);

  ${props =>
    props.$isHighScore &&
    `
    animation: pulse 2s infinite;
    
    @keyframes pulse {
      0%, 100% {
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
      }
      50% {
        box-shadow: 0 4px 20px rgba(239, 68, 68, 0.6);
      }
    }
  `}
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const Title = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
  margin: 0;
`;

const UnreadBadge = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--primary);
  flex-shrink: 0;
`;

const Message = styled.p`
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
`;

const MatchDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 4px;
  padding: 12px;
  background: var(--background);
  border-radius: 8px;
  border: 1px solid var(--border);
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-secondary);
`;

const DetailIcon = styled.span`
  display: flex;
  align-items: center;
  color: var(--text-secondary);
`;

const DetailText = styled.span`
  color: var(--text);
`;

const HighScoreRow = styled(DetailRow)`
  background: linear-gradient(
    135deg,
    rgba(239, 68, 68, 0.1),
    rgba(249, 115, 22, 0.1)
  );
  padding: 6px 8px;
  border-radius: 6px;
  margin-top: 4px;
`;

const HighScoreText = styled(DetailText)`
  font-weight: 600;
  color: var(--danger, #ef4444);
`;

const ActionButton = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 600;
  color: var(--primary);
  margin-top: 4px;
  transition: all 0.2s;

  &:hover {
    gap: 8px;
  }
`;
