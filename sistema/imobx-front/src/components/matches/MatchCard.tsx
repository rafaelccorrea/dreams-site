/**
 * Card de Match com todas as informações
 */

import React from 'react';
import styled from 'styled-components';
import { formatCurrency } from '../../utils/formatNumbers';
import { formatPhoneDisplay } from '../../utils/masks';
import type { Match } from '../../types/match';

interface MatchCardProps {
  match: Match;
  onAccept: (match: Match) => void;
  onIgnore: (match: Match) => void;
  loading?: boolean;
}

export function MatchCard({
  match,
  onAccept,
  onIgnore,
  loading,
}: MatchCardProps) {
  const scoreColor =
    match.matchScore >= 80
      ? '#10B981'
      : match.matchScore >= 60
        ? '#3B82F6'
        : '#F59E0B';

  const priceFormatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(match.property.salePrice || match.property.rentPrice || 0);

  const isPending = match.status === 'pending';

  return (
    <>
      <Card>
        {/* Header com Score */}
        <Header>
          <ScoreBadge $color={scoreColor}>
            <ScoreValue>{match.matchScore}</ScoreValue>
            <ScoreLabel>/100</ScoreLabel>
          </ScoreBadge>
          <DateText>
            {new Date(match.createdAt).toLocaleDateString('pt-BR')}
          </DateText>
        </Header>

        {/* Cliente */}
        <Section>
          <SectionTitle>👤 Cliente</SectionTitle>
          <ClientName>{match.client.name}</ClientName>
          {match.client.phone && (
            <ContactInfo>
              📱 {formatPhoneDisplay(match.client.phone)}
            </ContactInfo>
          )}
          {match.client.email && (
            <ContactInfo>📧 {match.client.email}</ContactInfo>
          )}
        </Section>

        {/* Imóvel */}
        <Section>
          <SectionTitle>🏠 Imóvel</SectionTitle>
          <PropertyTitle>{match.property.title}</PropertyTitle>
          {match.property.address && (
            <PropertyAddress>📍 {match.property.address}</PropertyAddress>
          )}
          {(match.property.city || match.property.neighborhood) && (
            <PropertyLocation>
              {match.property.neighborhood && `${match.property.neighborhood}`}
              {match.property.city && ` - ${match.property.city}`}
            </PropertyLocation>
          )}
          <PropertyPrice>💰 {priceFormatted}</PropertyPrice>
        </Section>

        {/* Motivos do Match */}
        {match.matchDetails?.reasons &&
          match.matchDetails.reasons.length > 0 && (
            <Section>
              <SectionTitle>✨ Por que é um match?</SectionTitle>
              <ReasonsList>
                {match.matchDetails.reasons.slice(0, 3).map((reason, idx) => (
                  <ReasonItem key={idx}>✅ {reason}</ReasonItem>
                ))}
                {match.matchDetails.reasons.length > 3 && (
                  <MoreReasons>
                    +{match.matchDetails.reasons.length - 3} motivos
                  </MoreReasons>
                )}
              </ReasonsList>
            </Section>
          )}

        {/* Ações */}
        {isPending && (
          <Actions>
            <AcceptButton onClick={() => onAccept(match)} disabled={loading}>
              ✅ Aceitar
            </AcceptButton>
            <IgnoreButton onClick={() => onIgnore(match)} disabled={loading}>
              ❌ Ignorar
            </IgnoreButton>
          </Actions>
        )}

        {/* Status não pendente */}
        {!isPending && (
          <StatusSection>
            {match.status === 'accepted' && (
              <StatusBadge $color='#10B981'>✅ Aceito</StatusBadge>
            )}
            {match.status === 'ignored' && (
              <StatusBadge $color='#6B7280'>❌ Ignorado</StatusBadge>
            )}
            {match.taskCreated && (
              <InfoText>📋 Task criada no workspace</InfoText>
            )}
          </StatusSection>
        )}
      </Card>
    </>
  );
}

// Styled Components
const Card = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  padding: 20px;
  box-shadow: ${props => props.theme.shadows.md};
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.2s;

  &:hover {
    box-shadow: ${props => props.theme.shadows.lg};
    transform: translateY(-2px);
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${props => props.theme.colors.borderLight};
`;

const ScoreBadge = styled.div<{ $color: string }>`
  display: flex;
  align-items: baseline;
  gap: 2px;
  background: ${props => props.$color}15;
  border: 2px solid ${props => props.$color};
  border-radius: 8px;
  padding: 6px 12px;
`;

const ScoreValue = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: inherit;
`;

const ScoreLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
`;

const DateText = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textLight};
`;

const Section = styled.div`
  margin-bottom: 16px;
`;

const SectionTitle = styled.h4`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  margin: 0 0 8px 0;
  letter-spacing: 0.05em;
`;

const ClientName = styled.p`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 4px 0;
`;

const ContactInfo = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 2px 0;
`;

const PropertyTitle = styled.p`
  font-size: 0.938rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 6px 0;
`;

const PropertyAddress = styled.p`
  font-size: 0.813rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 3px 0;
`;

const PropertyLocation = styled.p`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textLight};
  margin: 2px 0;
`;

const PropertyPrice = styled.p`
  font-size: 1rem;
  font-weight: 700;
  color: ${props => props.theme.colors.success};
  margin: 8px 0 0 0;
`;

const ReasonsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ReasonItem = styled.li`
  font-size: 0.813rem;
  color: ${props => props.theme.colors.text};
  margin: 4px 0;
  line-height: 1.4;
`;

const MoreReasons = styled.p`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textLight};
  font-style: italic;
  margin: 6px 0 0 0;
`;

const Actions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 16px;
`;

const AcceptButton = styled.button`
  background: ${props => props.theme.colors.success};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    filter: brightness(0.9);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const IgnoreButton = styled.button`
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.textSecondary};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.hover};
    border-color: ${props => props.theme.colors.textLight};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StatusSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid ${props => props.theme.colors.borderLight};
`;

const StatusBadge = styled.div<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$color}15;
  color: ${props => props.$color};
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 0.875rem;
  font-weight: 600;
`;

const InfoText = styled.p`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  text-align: center;
`;
