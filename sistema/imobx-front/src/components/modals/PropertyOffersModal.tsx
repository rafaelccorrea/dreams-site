import React, { useState, useEffect } from 'react';
import { MdClose, MdCheckCircle, MdCancel } from 'react-icons/md';
import styled from 'styled-components';
import { usePropertyOffers } from '../../hooks/usePropertyOffers';
import { OfferActionModal } from './OfferActionModal';
import { toast } from 'react-toastify';
import type { Property } from '../../types/property';
import type { PropertyOffer } from '../../types/propertyOffer';

interface PropertyOffersModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999999;
  padding: 20px;
`;

const Modal = styled.div`
  background: ${props => props.theme.colors.background};
  border-radius: 12px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  position: sticky;
  top: 0;
  background: ${props => props.theme.colors.background};
  z-index: 10;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.text};
  }
`;

const Content = styled.div`
  padding: 24px;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.div<{ $highlight?: boolean }>`
  background: ${props =>
    props.$highlight ? '#FEF3C7' : props.theme.colors.backgroundSecondary};
  border: 1px solid
    ${props => (props.$highlight ? '#FCD34D' : props.theme.colors.border)};
  border-radius: 8px;
  padding: 16px;
  text-align: center;
`;

const StatValue = styled.div<{ $highlight?: boolean }>`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => (props.$highlight ? '#92400E' : props.theme.colors.text)};
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

const OffersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const OfferCard = styled.div<{ $status: string }>`
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  ${props =>
    props.$status === 'pending' &&
    `
    border-left: 4px solid #F59E0B;
  `}
  ${props =>
    props.$status === 'accepted' &&
    `
    border-left: 4px solid #10B981;
  `}
  ${props =>
    props.$status === 'rejected' &&
    `
    border-left: 4px solid #EF4444;
  `}
`;

const OfferHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const OfferInfo = styled.div`
  flex: 1;
`;

const OfferTitle = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
`;

const OfferMeta = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;

  ${props => {
    switch (props.$status) {
      case 'pending':
        return `
          background: #FEF3C7;
          color: #92400E;
        `;
      case 'accepted':
        return `
          background: #D1FAE5;
          color: #065F46;
        `;
      case 'rejected':
        return `
          background: #FEE2E2;
          color: #991B1B;
        `;
      case 'withdrawn':
        return `
          background: #E5E7EB;
          color: #374151;
        `;
      default:
        return `
          background: #E5E7EB;
          color: #374151;
        `;
    }
  }}
`;

const OfferValue = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  color: #10b981;
  margin-top: 8px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${props => props.theme.colors.textSecondary};
`;

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    pending: 'Pendente',
    accepted: 'Aceita',
    rejected: 'Rejeitada',
    withdrawn: 'Retirada',
    expired: 'Expirada',
  };
  return labels[status] || status;
};

export const PropertyOffersModal: React.FC<PropertyOffersModalProps> = ({
  isOpen,
  onClose,
  property,
}) => {
  const { offers, loading, fetchPropertyOffers, acceptOffer, rejectOffer } =
    usePropertyOffers(property?.id);

  const [selectedOffer, setSelectedOffer] = useState<PropertyOffer | null>(
    null
  );
  const [showActionModal, setShowActionModal] = useState(false);

  useEffect(() => {
    if (isOpen && property?.id) {
      // Sempre buscar para garantir dados atualizados
      fetchPropertyOffers(property.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, property?.id]);

  const handleViewOffer = (offer: PropertyOffer) => {
    setSelectedOffer(offer);
    setShowActionModal(true);
  };

  const handleAccept = async (offerId: string, message?: string) => {
    try {
      await acceptOffer(offerId, message);
      toast.success('Oferta aceita com sucesso!');
      setShowActionModal(false);
      setSelectedOffer(null);
      if (property?.id) {
        fetchPropertyOffers(property.id);
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao aceitar oferta');
    }
  };

  const handleReject = async (offerId: string, message?: string) => {
    try {
      await rejectOffer(offerId, message);
      toast.success('Oferta rejeitada');
      setShowActionModal(false);
      setSelectedOffer(null);
      if (property?.id) {
        fetchPropertyOffers(property.id);
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao rejeitar oferta');
    }
  };

  if (!isOpen || !property) return null;

  // Usar ofertas do hook (sempre atualizadas) ou da propriedade como fallback
  const displayOffers = offers.length > 0 ? offers : property.offers || [];

  return (
    <>
      <Overlay onClick={onClose}>
        <Modal onClick={e => e.stopPropagation()}>
          <Header>
            <Title>
              💬 Ofertas da Propriedade
              {property.title && (
                <span
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: '400',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  - {property.title}
                </span>
              )}
            </Title>
            <CloseButton onClick={onClose}>
              <MdClose size={24} />
            </CloseButton>
          </Header>

          <Content>
            {/* Estatísticas */}
            {(property.totalOffersCount !== undefined ||
              displayOffers.length > 0) && (
              <StatsContainer>
                <StatCard $highlight={property.hasPendingOffers}>
                  <StatValue $highlight={property.hasPendingOffers}>
                    {property.totalOffersCount ?? displayOffers.length}
                  </StatValue>
                  <StatLabel>Total de Ofertas</StatLabel>
                </StatCard>
                <StatCard $highlight={property.hasPendingOffers}>
                  <StatValue $highlight={property.hasPendingOffers}>
                    {property.pendingOffersCount ??
                      displayOffers.filter(o => o.status === 'pending').length}
                  </StatValue>
                  <StatLabel>Pendentes</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue>
                    {property.acceptedOffersCount ??
                      displayOffers.filter(o => o.status === 'accepted').length}
                  </StatValue>
                  <StatLabel>Aceitas</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue>
                    {property.rejectedOffersCount ??
                      displayOffers.filter(o => o.status === 'rejected').length}
                  </StatValue>
                  <StatLabel>Rejeitadas</StatLabel>
                </StatCard>
              </StatsContainer>
            )}

            {/* Lista de ofertas */}
            {loading && <EmptyState>Carregando ofertas...</EmptyState>}

            {!loading && displayOffers.length === 0 && (
              <EmptyState>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
                <div
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    marginBottom: '8px',
                    color: 'var(--color-text)',
                  }}
                >
                  Nenhuma oferta recebida
                </div>
                <div style={{ fontSize: '0.875rem' }}>
                  Esta propriedade ainda não recebeu ofertas.
                </div>
              </EmptyState>
            )}

            {!loading && displayOffers.length > 0 && (
              <OffersList>
                {displayOffers.map(offer => (
                  <OfferCard
                    key={offer.id}
                    $status={offer.status}
                    onClick={() => handleViewOffer(offer)}
                  >
                    <OfferHeader>
                      <OfferInfo>
                        <OfferTitle>
                          {offer.type === 'sale' ? '💰 Venda' : '🏠 Aluguel'}
                        </OfferTitle>
                        <OfferMeta>
                          {offer.publicUser ? (
                            <>
                              {offer.publicUser.email} •{' '}
                              {offer.publicUser.phone}
                            </>
                          ) : (
                            'Ofertante não informado'
                          )}
                        </OfferMeta>
                        <OfferMeta style={{ marginTop: '4px' }}>
                          {formatDate(offer.createdAt)}
                        </OfferMeta>
                      </OfferInfo>
                      <StatusBadge $status={offer.status}>
                        {getStatusLabel(offer.status)}
                      </StatusBadge>
                    </OfferHeader>
                    <OfferValue>{formatPrice(offer.offeredValue)}</OfferValue>
                    {offer.message && (
                      <div
                        style={{
                          marginTop: '12px',
                          padding: '12px',
                          background: 'var(--color-background)',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        "{offer.message}"
                      </div>
                    )}
                  </OfferCard>
                ))}
              </OffersList>
            )}
          </Content>
        </Modal>
      </Overlay>

      <OfferActionModal
        isOpen={showActionModal}
        onClose={() => {
          setShowActionModal(false);
          setSelectedOffer(null);
        }}
        offer={selectedOffer}
        onAccept={handleAccept}
        onReject={handleReject}
        loading={loading}
      />
    </>
  );
};
