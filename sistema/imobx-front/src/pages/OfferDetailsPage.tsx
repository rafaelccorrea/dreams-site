import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  MdArrowBack,
  MdCheckCircle,
  MdCancel,
  MdHome,
  MdEmail,
  MdPhone,
  MdSchedule,
  MdMessage,
} from 'react-icons/md';
import { Layout } from '../components/layout/Layout';
import { usePropertyOffers } from '../hooks/usePropertyOffers';
import { OfferDetailsShimmer } from '../components/shimmer/OfferDetailsShimmer';
import { toast } from 'react-toastify';
import {
  SimplePageContainer,
  SimpleHeader,
  SimpleTitle,
  SimpleSubtitle,
  SimpleBackButton,
  SectionDivider,
  SectionTitle,
  InfoGrid,
  InfoItem,
  InfoLabel,
  InfoValue,
  HighlightValue,
  MessageBox,
  MessageText,
  StatusBadge,
  ActionsSection,
  Textarea,
  ActionsButtons,
  Button,
  LoadingContainer,
  LoadingText,
  ErrorContainer,
  ErrorTitle,
  ErrorMessage,
} from '../styles/pages/OfferDetailsPageStyles';

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

const OfferDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { offerId } = useParams<{ offerId: string }>();
  const { fetchOfferById, acceptOffer, rejectOffer, loading, error } =
    usePropertyOffers();

  const [offer, setOffer] = useState<any>(null);
  const [action, setAction] = useState<'accept' | 'reject' | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (offerId) {
      fetchOfferById(offerId)
        .then(setOffer)
        .catch(() => {
          toast.error('Erro ao carregar oferta');
        });
    }
  }, [offerId, fetchOfferById]);

  const handleAction = async (actionType: 'accept' | 'reject') => {
    if (!offerId) return;

    setAction(actionType);
    try {
      if (actionType === 'accept') {
        await acceptOffer(offerId, message.trim() || undefined);
        toast.success('Oferta aceita com sucesso!');
      } else {
        await rejectOffer(offerId, message.trim() || undefined);
        toast.success('Oferta rejeitada');
      }
      // Recarregar oferta atualizada
      const updatedOffer = await fetchOfferById(offerId);
      setOffer(updatedOffer);
      setMessage('');
      setAction(null);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao processar ação');
      setAction(null);
    }
  };

  if (loading && !offer) {
    return (
      <Layout>
        <OfferDetailsShimmer />
      </Layout>
    );
  }

  if (error || !offer) {
    return (
      <Layout>
        <SimplePageContainer>
          <ErrorContainer>
            <ErrorTitle>Erro ao carregar oferta</ErrorTitle>
            <ErrorMessage>{error || 'Oferta não encontrada'}</ErrorMessage>
            <Button onClick={() => navigate('/properties/offers')}>
              <MdArrowBack /> Voltar para Ofertas
            </Button>
          </ErrorContainer>
        </SimplePageContainer>
      </Layout>
    );
  }

  const propertyPrice =
    offer.type === 'sale'
      ? offer.property?.salePrice
      : offer.property?.rentPrice;

  // ⚠️ IMPORTANTE: Valores mínimos são INFORMAÇÃO CONFIDENCIAL
  // Eles NÃO são retornados em APIs públicas - apenas em APIs privadas (imobiliárias)
  // O valor mínimo serve como PISO - ofertas abaixo dele podem ser rejeitadas automaticamente
  const minPrice =
    offer.type === 'sale'
      ? offer.property?.minSalePrice
      : offer.property?.minRentPrice;

  return (
    <Layout>
      <SimplePageContainer>
        <SimpleHeader>
          <div>
            <SimpleTitle>Detalhes da Oferta</SimpleTitle>
            <SimpleSubtitle>
              Visualize e gerencie os detalhes desta oferta
            </SimpleSubtitle>
          </div>
          <SimpleBackButton onClick={() => navigate('/properties/offers')}>
            <MdArrowBack size={20} />
            Voltar
          </SimpleBackButton>
        </SimpleHeader>

        {/* Informações da Oferta */}
        <SectionTitle>📋 Informações da Oferta</SectionTitle>
        <InfoGrid>
          <InfoItem>
            <InfoLabel>
              <MdHome size={16} /> Propriedade
            </InfoLabel>
            <InfoValue>{offer.property?.title || 'N/A'}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Tipo</InfoLabel>
            <InfoValue>
              {offer.type === 'sale' ? '💰 Venda' : '🏠 Aluguel'}
            </InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Status</InfoLabel>
            <StatusBadge $status={offer.status}>
              {getStatusLabel(offer.status)}
            </StatusBadge>
          </InfoItem>
          <InfoItem>
            <InfoLabel>
              <MdSchedule size={16} /> Data da Oferta
            </InfoLabel>
            <InfoValue>{formatDate(offer.createdAt)}</InfoValue>
          </InfoItem>
        </InfoGrid>

        <SectionDivider />

        {/* Valores */}
        <SectionTitle>💰 Valores</SectionTitle>
        <InfoGrid>
          {propertyPrice && (
            <InfoItem>
              <InfoLabel>Valor Original</InfoLabel>
              <InfoValue>{formatPrice(propertyPrice)}</InfoValue>
            </InfoItem>
          )}
          {minPrice && (
            <InfoItem>
              <InfoLabel>Valor Mínimo Aceito</InfoLabel>
              <InfoValue>{formatPrice(minPrice)}</InfoValue>
            </InfoItem>
          )}
          <InfoItem>
            <InfoLabel>Valor Oferecido</InfoLabel>
            <HighlightValue>{formatPrice(offer.offeredValue)}</HighlightValue>
          </InfoItem>
        </InfoGrid>

        {/* Informações do Ofertante */}
        {offer.publicUser && (
          <>
            <SectionDivider />
            <SectionTitle>👤 Informações do Ofertante</SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>
                  <MdEmail size={16} /> Email
                </InfoLabel>
                <InfoValue>{offer.publicUser.email}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>
                  <MdPhone size={16} /> Telefone
                </InfoLabel>
                <InfoValue>{offer.publicUser.phone}</InfoValue>
              </InfoItem>
            </InfoGrid>
          </>
        )}

        {/* Mensagem do Ofertante */}
        {offer.message && (
          <>
            <SectionDivider />
            <SectionTitle>
              <MdMessage size={20} /> Mensagem do Ofertante
            </SectionTitle>
            <MessageBox>
              <MessageText>{offer.message}</MessageText>
            </MessageBox>
          </>
        )}

        {/* Resposta */}
        {offer.responseMessage && (
          <>
            <SectionDivider />
            <SectionTitle>💬 Resposta Enviada</SectionTitle>
            <MessageBox>
              <MessageText>{offer.responseMessage}</MessageText>
            </MessageBox>
            {offer.respondedAt && (
              <InfoValue
                style={{
                  marginTop: '12px',
                  fontSize: '0.875rem',
                  color: 'var(--color-text-secondary)',
                }}
              >
                Respondido em: {formatDate(offer.respondedAt)}
              </InfoValue>
            )}
          </>
        )}

        {/* Ações (apenas se pendente) */}
        {offer.status === 'pending' && (
          <>
            <SectionDivider />
            <SectionTitle>⚡ Ações</SectionTitle>
            <ActionsSection>
              <div>
                <InfoLabel style={{ marginBottom: '8px' }}>
                  Mensagem de Resposta (Opcional)
                </InfoLabel>
                <Textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder='Digite uma mensagem para o ofertante...'
                  maxLength={1000}
                />
              </div>
              <ActionsButtons>
                <Button
                  $variant='cancel'
                  onClick={() => navigate('/properties/offers')}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  $variant='reject'
                  onClick={() => handleAction('reject')}
                  disabled={loading || action === 'reject'}
                >
                  <MdCancel size={18} />
                  {action === 'reject' ? 'Rejeitando...' : 'Rejeitar Oferta'}
                </Button>
                <Button
                  $variant='accept'
                  onClick={() => handleAction('accept')}
                  disabled={loading || action === 'accept'}
                >
                  <MdCheckCircle size={18} />
                  {action === 'accept' ? 'Aceitando...' : 'Aceitar Oferta'}
                </Button>
              </ActionsButtons>
            </ActionsSection>
          </>
        )}
      </SimplePageContainer>
    </Layout>
  );
};

export default OfferDetailsPage;
