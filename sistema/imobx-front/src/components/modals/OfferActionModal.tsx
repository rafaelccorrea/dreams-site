import React, { useState } from 'react';
import { MdClose, MdCheckCircle, MdCancel } from 'react-icons/md';
import styled from 'styled-components';
import type { PropertyOffer } from '../../types/propertyOffer';

interface OfferActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: PropertyOffer | null;
  onAccept: (offerId: string, message?: string) => Promise<void>;
  onReject: (offerId: string, message?: string) => Promise<void>;
  loading?: boolean;
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
  max-width: 600px;
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
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
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

const InfoSection = styled.div`
  margin-bottom: 24px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

const InfoValue = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
`;

const MessageSection = styled.div`
  margin-top: 24px;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  font-family: inherit;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.backgroundSecondary};
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Footer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 20px 24px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const Button = styled.button<{ variant?: 'accept' | 'reject' | 'cancel' }>`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${props => {
    if (props.variant === 'accept') {
      return `
        background: #10B981;
        color: white;
        &:hover:not(:disabled) {
          background: #059669;
        }
      `;
    }
    if (props.variant === 'reject') {
      return `
        background: #EF4444;
        color: white;
        &:hover:not(:disabled) {
          background: #DC2626;
        }
      `;
    }
    return `
      background: ${props.theme.colors.backgroundSecondary};
      color: ${props.theme.colors.text};
      &:hover:not(:disabled) {
        background: ${props.theme.colors.border};
      }
    `;
  }}
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

export const OfferActionModal: React.FC<OfferActionModalProps> = ({
  isOpen,
  onClose,
  offer,
  onAccept,
  onReject,
  loading = false,
}) => {
  const [action, setAction] = useState<'accept' | 'reject' | null>(null);
  const [message, setMessage] = useState('');

  if (!isOpen || !offer) return null;

  const handleAction = async (actionType: 'accept' | 'reject') => {
    setAction(actionType);
    try {
      if (actionType === 'accept') {
        await onAccept(offer.id, message.trim() || undefined);
      } else {
        await onReject(offer.id, message.trim() || undefined);
      }
      setMessage('');
      setAction(null);
      onClose();
    } catch (error) {
      setAction(null);
    }
  };

  const handleClose = () => {
    setMessage('');
    setAction(null);
    onClose();
  };

  const propertyPrice =
    offer.type === 'sale'
      ? offer.property?.salePrice
      : offer.property?.rentPrice;

  const minPrice =
    offer.type === 'sale'
      ? offer.property?.minSalePrice
      : offer.property?.minRentPrice;

  return (
    <Overlay onClick={handleClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <Header>
          <Title>
            {offer.status === 'pending'
              ? 'Ação na Oferta'
              : `Oferta ${offer.status === 'accepted' ? 'Aceita' : offer.status === 'rejected' ? 'Rejeitada' : 'Retirada'}`}
          </Title>
          <CloseButton onClick={handleClose}>
            <MdClose size={24} />
          </CloseButton>
        </Header>

        <Content>
          <InfoSection>
            <InfoRow>
              <InfoLabel>Propriedade:</InfoLabel>
              <InfoValue>{offer.property?.title || 'N/A'}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Tipo:</InfoLabel>
              <InfoValue>
                {offer.type === 'sale' ? 'Venda' : 'Aluguel'}
              </InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Valor Original:</InfoLabel>
              <InfoValue>
                {propertyPrice ? formatPrice(propertyPrice) : 'N/A'}
              </InfoValue>
            </InfoRow>
            {minPrice && (
              <InfoRow>
                <InfoLabel>Valor Mínimo:</InfoLabel>
                <InfoValue>{formatPrice(minPrice)}</InfoValue>
              </InfoRow>
            )}
            <InfoRow>
              <InfoLabel>Valor Oferecido:</InfoLabel>
              <InfoValue style={{ color: '#10B981', fontSize: '1rem' }}>
                {formatPrice(offer.offeredValue)}
              </InfoValue>
            </InfoRow>
            {offer.publicUser && (
              <>
                <InfoRow>
                  <InfoLabel>Ofertante:</InfoLabel>
                  <InfoValue>{offer.publicUser.email}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Telefone:</InfoLabel>
                  <InfoValue>{offer.publicUser.phone}</InfoValue>
                </InfoRow>
              </>
            )}
            <InfoRow>
              <InfoLabel>Data da Oferta:</InfoLabel>
              <InfoValue>{formatDate(offer.createdAt)}</InfoValue>
            </InfoRow>
            {offer.message && (
              <InfoRow>
                <InfoLabel>Mensagem do Ofertante:</InfoLabel>
                <InfoValue style={{ textAlign: 'right', maxWidth: '60%' }}>
                  {offer.message}
                </InfoValue>
              </InfoRow>
            )}
            {offer.responseMessage && (
              <InfoRow>
                <InfoLabel>Resposta:</InfoLabel>
                <InfoValue style={{ textAlign: 'right', maxWidth: '60%' }}>
                  {offer.responseMessage}
                </InfoValue>
              </InfoRow>
            )}
          </InfoSection>

          {offer.status === 'pending' && (
            <MessageSection>
              <Label>Mensagem de Resposta (Opcional)</Label>
              <Textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder='Digite uma mensagem para o ofertante...'
                maxLength={1000}
              />
            </MessageSection>
          )}
        </Content>

        {offer.status === 'pending' && (
          <Footer>
            <Button variant='cancel' onClick={handleClose} disabled={loading}>
              Cancelar
            </Button>
            <Button
              variant='reject'
              onClick={() => handleAction('reject')}
              disabled={loading || action === 'reject'}
            >
              <MdCancel size={18} />
              {action === 'reject' ? 'Rejeitando...' : 'Rejeitar'}
            </Button>
            <Button
              variant='accept'
              onClick={() => handleAction('accept')}
              disabled={loading || action === 'accept'}
            >
              <MdCheckCircle size={18} />
              {action === 'accept' ? 'Aceitando...' : 'Aceitar Oferta'}
            </Button>
          </Footer>
        )}
      </Modal>
    </Overlay>
  );
};
