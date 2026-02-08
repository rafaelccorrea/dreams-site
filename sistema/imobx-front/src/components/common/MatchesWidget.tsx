/**
 * Widget de Matches para Dashboard
 * Mostra resumo de matches pendentes e recentes
 */

import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useMatchesSummary } from '../../hooks/useMatches';
import { MatchesWidgetShimmer } from '../shimmer/MatchesWidgetShimmer';
import { formatPhoneDisplay, maskCPF } from '../../utils/masks';
import { InfoTooltip } from './InfoTooltip';
import { translateType } from '../../utils/galleryTranslations';

export const MatchesWidget: React.FC = () => {
  const navigate = useNavigate();
  const { summary, loading } = useMatchesSummary();

  if (loading) {
    return <MatchesWidgetShimmer />;
  }

  if (!summary) {
    return null;
  }

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    // Menos de 1 minuto
    if (diffSecs < 60) return 'agora mesmo';

    // Minutos (1-59)
    if (diffMins < 60) {
      return diffMins === 1 ? 'há 1 minuto' : `há ${diffMins} minutos`;
    }

    // Horas (1-23)
    if (diffHours < 24) {
      return diffHours === 1 ? 'há 1 hora' : `há ${diffHours} horas`;
    }

    // Ontem
    if (diffDays === 1) return 'ontem';

    // Dias (2-6)
    if (diffDays < 7) {
      return `há ${diffDays} dias`;
    }

    // Semanas (1-4)
    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks < 5) {
      return diffWeeks === 1 ? 'há 1 semana' : `há ${diffWeeks} semanas`;
    }

    // Mais de um mês - mostra a data
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    });
  };

  return (
    <Card>
      <Header>
        <HeaderLeft>
          <Icon>🎯</Icon>
          <Title>Matches Pendentes</Title>
        </HeaderLeft>
        <HeaderRight>
          {summary.pending > 0 && <CountBadge>{summary.pending}</CountBadge>}
          <InfoTooltip content='Matches entre clientes e propriedades que ainda precisam ser processados, incluindo compatibilidade de preço, localização e preferências.' />
        </HeaderRight>
      </Header>

      {/* Mostrar cards de estatísticas apenas quando há dados */}
      {summary.total > 0 && (
        <Stats>
          <StatItem>
            <StatValue>{summary.total}</StatValue>
            <StatLabel>Total</StatLabel>
          </StatItem>
          <StatDivider />
          <StatItem $highlight>
            <StatValue>{summary.highScore}</StatValue>
            <StatLabel>Alta Compatibilidade</StatLabel>
          </StatItem>
          <StatDivider />
          <StatItem>
            <StatValue>{summary.accepted}</StatValue>
            <StatLabel>Aceitos</StatLabel>
          </StatItem>
        </Stats>
      )}

      {/* Mostrar matches recentes apenas quando há dados */}
      {summary.recent && summary.recent.length > 0 ? (
        <RecentSection>
          <SectionTitle>Recentes</SectionTitle>
          {summary.recent.map(match => {
            // Se o cliente for vendedor (seller), redireciona para a propriedade
            // Se for comprador (buyer), redireciona para o cliente
            const isSeller = match.client?.type === 'seller';
            const redirectPath = isSeller
              ? `/properties/${match.property?.id || ''}`
              : `/matches?clientId=${match.client?.id || ''}`;

            // Prioriza preço de venda, depois aluguel
            const price =
              match.property?.salePrice || match.property?.rentPrice || 0;

            return (
              <MatchItem key={match.id} onClick={() => navigate(redirectPath)}>
                <MatchContent>
                  <MatchHeader>
                    <MainTitle>
                      {isSeller ? match.property?.title : match.client?.name}
                      <ScoreBadge $score={match.matchScore}>
                        {match.matchScore}%
                      </ScoreBadge>
                    </MainTitle>
                    <MatchTime>{formatDate(match.createdAt)}</MatchTime>
                  </MatchHeader>

                  <SubInfo>
                    {isSeller ? match.client?.name : match.property?.title}
                  </SubInfo>

                  <ContactRow>
                    {match.client?.phone && (
                      <ContactInfo>
                        📱 {formatPhoneDisplay(match.client.phone)}
                      </ContactInfo>
                    )}
                    {match.client?.cpf && (
                      <ContactInfo>🆔 {maskCPF(match.client.cpf)}</ContactInfo>
                    )}
                    {match.property?.code && (
                      <PropertyCode title='Código da Propriedade'>
                        #️⃣ {match.property.code}
                      </PropertyCode>
                    )}
                  </ContactRow>

                  <DetailsRow>
                    <PriceTag>{formatPrice(Number(price))}</PriceTag>
                    <PropertyType>
                      {match.property?.type
                        ? translateType(match.property.type)
                        : ''}
                    </PropertyType>
                    <Location>
                      📍 {match.property?.city} - {match.property?.neighborhood}
                    </Location>
                  </DetailsRow>

                  {match.property && (
                    <FeaturesRow>
                      {match.property.bedrooms && (
                        <Feature>
                          🛏️ {match.property.bedrooms}{' '}
                          {match.property.bedrooms === 1 ? 'quarto' : 'quartos'}
                        </Feature>
                      )}
                      {match.property.bathrooms && (
                        <Feature>
                          🚿 {match.property.bathrooms}{' '}
                          {match.property.bathrooms === 1
                            ? 'banheiro'
                            : 'banheiros'}
                        </Feature>
                      )}
                      {match.property.parkingSpaces && (
                        <Feature>
                          🚗 {match.property.parkingSpaces}{' '}
                          {match.property.parkingSpaces === 1
                            ? 'vaga'
                            : 'vagas'}
                        </Feature>
                      )}
                      {match.property.builtArea && (
                        <Feature>
                          📏{' '}
                          {Number(match.property.builtArea).toLocaleString(
                            'pt-BR',
                            {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 2,
                            }
                          )}
                          m²
                        </Feature>
                      )}
                    </FeaturesRow>
                  )}

                  {match.matchDetails && (
                    <MatchIndicators>
                      {match.matchDetails.priceMatch && (
                        <Indicator $color='#10b981' title='Preço compatível'>
                          💰 Preço OK
                        </Indicator>
                      )}
                      {match.matchDetails.locationMatch && (
                        <Indicator
                          $color='#3b82f6'
                          title='Localização compatível'
                        >
                          📍 Local OK
                        </Indicator>
                      )}
                      {match.matchDetails.reasons &&
                        match.matchDetails.reasons.length > 0 && (
                          <Indicator
                            $color='#8b5cf6'
                            title={match.matchDetails.reasons.join(', ')}
                          >
                            ✨ {match.matchDetails.reasons.length} motivos
                          </Indicator>
                        )}
                    </MatchIndicators>
                  )}

                  <ActionsRow>
                    {match.emailSent && (
                      <ActionBadge title='Email enviado'>📧</ActionBadge>
                    )}
                    {match.taskCreated && (
                      <ActionBadge title='Tarefa criada'>✅</ActionBadge>
                    )}
                    {match.appointmentCreated && (
                      <ActionBadge title='Agendamento criado'>📅</ActionBadge>
                    )}
                    {match.notificationSent && (
                      <ActionBadge title='Notificação enviada'>🔔</ActionBadge>
                    )}
                    {match.viewedAt && (
                      <ActionBadge
                        title={`Visto em ${new Date(match.viewedAt).toLocaleString('pt-BR')}`}
                      >
                        👁️
                      </ActionBadge>
                    )}
                  </ActionsRow>
                </MatchContent>
              </MatchItem>
            );
          })}
        </RecentSection>
      ) : (
        /* Mensagem unificada quando não há dados */
        <EmptyState>
          <EmptyIcon>🎯</EmptyIcon>
          <EmptyTitle>Nenhum match encontrado</EmptyTitle>
          <EmptyDescription>
            Não há matches pendentes no momento.
            <br />
            Novos matches aparecerão quando houver compatibilidade entre
            clientes e propriedades.
          </EmptyDescription>
        </EmptyState>
      )}
    </Card>
  );
};

const Card = styled.div`
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid ${({ theme }) => theme.colors.border};
  min-height: 300px;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Icon = styled.div`
  font-size: 24px;
`;

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.text};
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`;

const CountBadge = styled.div`
  background: linear-gradient(135deg, #ff6b6b, #ff8e53);
  color: white;
  padding: 6px 14px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: bold;
  box-shadow: 0 2px 6px rgba(255, 107, 107, 0.3);
`;

const Stats = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 20px 0;
  margin-bottom: 20px;
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    padding: 16px;
  }
`;

const StatItem = styled.div<{ $highlight?: boolean }>`
  text-align: center;
  flex: 1;

  ${({ $highlight }) =>
    $highlight &&
    `
    position: relative;
    
    &::before {
      content: '🔥';
      position: absolute;
      top: -24px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 20px;
    }
  `}
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 500;
`;

const StatDivider = styled.div`
  width: 1px;
  height: 40px;
  background: ${({ theme }) => theme.colors.border};
`;

const RecentSection = styled.div`
  margin-top: 20px;
`;

const SectionTitle = styled.h4`
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const MatchItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 12px;
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.background};
  }

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    padding: 12px;
    gap: 10px;
  }
`;

const MatchScore = styled.div<{ $score: number }>`
  background: ${({ $score }) => {
    if ($score >= 90) return 'linear-gradient(135deg, #10b981, #059669)';
    if ($score >= 80) return 'linear-gradient(135deg, #34d399, #10b981)';
    if ($score >= 70) return 'linear-gradient(135deg, #fbbf24, #f59e0b)';
    return 'linear-gradient(135deg, #fb923c, #f97316)';
  }};
  color: white;
  font-weight: 700;
  font-size: 16px;
  padding: 8px 12px;
  border-radius: 10px;
  min-width: 60px;
  text-align: center;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
  align-self: flex-start;

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 6px 10px;
    min-width: 50px;
  }
`;

const ScoreBadge = styled.span<{ $score: number }>`
  background: ${({ $score }) => {
    if ($score >= 90) return '#10b981';
    if ($score >= 80) return '#34d399';
    if ($score >= 70) return '#fbbf24';
    return '#fb923c';
  }};
  color: white;
  font-weight: 600;
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 12px;
  white-space: nowrap;
  flex-shrink: 0;
`;

const MatchContent = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MatchHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`;

const MainTitle = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 700;
  font-size: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
`;

const SubInfo = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 13px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ContactRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const ContactInfo = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const PropertyCode = styled.div`
  background: ${({ theme }) => theme.colors.border}40;
  color: ${({ theme }) => theme.colors.text};
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  font-family: 'Courier New', monospace;
`;

const DetailsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const PriceTag = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
  font-size: 14px;
`;

const PropertyType = styled.div`
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

const Location = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 12px;
  font-weight: 500;
`;

const FeaturesRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 12px;
  font-weight: 500;
`;

const MatchIndicators = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`;

const Indicator = styled.div<{ $color: string }>`
  background: ${({ $color }) => $color}15;
  color: ${({ $color }) => $color};
  border: 1px solid ${({ $color }) => $color}40;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ActionsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 4px;
`;

const ActionBadge = styled.div`
  font-size: 14px;
  opacity: 0.7;
  cursor: help;
  transition: all 0.2s;

  &:hover {
    opacity: 1;
    transform: scale(1.2);
  }
`;

const MatchTime = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 11px;
  font-weight: 500;
  flex-shrink: 0;
  white-space: nowrap;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  min-height: 200px;
`;

const EmptyIcon = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 16px;
  opacity: 0.5;
  font-size: 48px;
`;

const EmptyTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const EmptyDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
  line-height: 1.5;
  max-width: 280px;
  margin: 0;
`;

export default MatchesWidget;
