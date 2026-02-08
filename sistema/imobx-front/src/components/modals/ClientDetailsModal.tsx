import React, { useState } from 'react';
import styled from 'styled-components';
import {
  MdClose,
  MdPerson,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdNote,
  MdBusiness,
  MdHome,
  MdCheckCircle,
} from 'react-icons/md';
import { formatCurrency } from '../../utils/formatNumbers';
import { EntityDocumentsList } from '../documents/EntityDocumentsList';
import { useMatches } from '../../hooks/useMatches';
import { useMatchActions } from '../../hooks/useMatchActions';
import { MatchCard } from '../common/MatchCard';
import { Spinner } from '../common/Spinner';

interface ClientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: any;
  onEdit?: () => void;
}

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(12px);
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 999999;
  padding: 24px;
  animation: fadeIn 0.4s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 24px;
  width: 100%;
  max-width: 1400px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow:
    0 40px 80px -12px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  border: 1px solid ${props => props.theme.colors.border};
  animation: modalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  flex-direction: column;

  @keyframes modalSlideIn {
    from {
      transform: translateY(40px) scale(0.95);
      opacity: 0;
    }
    to {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
  }
`;

const ModalHeader = styled.div`
  padding: 32px 40px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.background},
    ${props => props.theme.colors.backgroundSecondary}
  );
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const TitleIcon = styled.div`
  color: ${props => props.theme.colors.primary};
  background: ${props => props.theme.colors.primary}15;
  padding: 12px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px ${props => props.theme.colors.primary}25;
`;

const ModalTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const CloseButton = styled.button`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 12px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  margin-left: auto;

  &:hover {
    background: #fef2f2;
    border-color: #fee2e2;
    color: #ef4444;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ModalBody = styled.div`
  padding: 0;
  max-height: calc(90vh - 140px);
  overflow-y: auto;
  background: ${props => props.theme.colors.surface};
  display: flex;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.background};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 4px;

    &:hover {
      background: ${props => props.theme.colors.textSecondary};
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 32px;
  overflow-y: auto;
`;

const Sidebar = styled.div`
  width: 400px;
  padding: 32px;
  background: linear-gradient(
    180deg,
    ${props => props.theme.colors.backgroundSecondary},
    ${props => props.theme.colors.background}
  );
  border-left: 1px solid ${props => props.theme.colors.border};
  overflow-y: auto;

  @media (max-width: 768px) {
    width: 100%;
    border-left: none;
    border-top: 1px solid ${props => props.theme.colors.border};
  }
`;

const Section = styled.div`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 20px;
  padding: 28px;
  margin-bottom: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
`;

const SectionIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${props => props.theme.colors.primary}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.primary};
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InfoLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const InfoValue = styled.div`
  font-size: 0.938rem;
  color: ${props => props.theme.colors.text};
  padding: 8px 12px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const IconWrapper = styled.span`
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
`;

export const ClientDetailsModal: React.FC<ClientDetailsModalProps> = ({
  isOpen,
  onClose,
  client,
  onEdit,
}) => {
  const {
    matches,
    loading: matchesLoading,
    refetch,
  } = useMatches({
    clientId: client?.id,
    status: 'pending',
    autoFetch: isOpen && !!client,
  });

  const { acceptMatch, ignoreMatch } = useMatchActions();

  const handleAcceptMatch = async (matchId: string) => {
    try {
      const result = await acceptMatch(matchId);
      if (result.success) {
        refetch();
      }
    } catch (error) {
      console.error('Erro ao aceitar match:', error);
    }
  };

  const handleIgnoreMatch = async (
    matchId: string,
    reason?: string,
    notes?: string
  ) => {
    try {
      const result = await ignoreMatch(matchId, reason as any, notes);
      if (result.success) {
        refetch();
      }
    } catch (error) {
      console.error('Erro ao ignorar match:', error);
    }
  };

  if (!isOpen || !client) return null;

  return (
    <ModalOverlay $isOpen={isOpen} onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <HeaderContent>
            <TitleIcon>
              <MdPerson size={24} />
            </TitleIcon>
            <ModalTitle>{client.name}</ModalTitle>
          </HeaderContent>
          <CloseButton onClick={onClose}>
            <MdClose size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <MainContent>
            {/* Personal Information */}
            <Section>
              <SectionHeader>
                <SectionIcon>
                  <MdPerson size={20} />
                </SectionIcon>
                <SectionTitle>Informações Pessoais</SectionTitle>
              </SectionHeader>

              <InfoGrid>
                <InfoItem>
                  <InfoLabel>
                    <IconWrapper>
                      <MdPerson size={16} />
                    </IconWrapper>
                    Nome Completo
                  </InfoLabel>
                  <InfoValue>{client.name}</InfoValue>
                </InfoItem>

                {client.cpf && (
                  <InfoItem>
                    <InfoLabel>
                      <IconWrapper>
                        <MdPerson size={16} />
                      </IconWrapper>
                      CPF/CNPJ
                    </InfoLabel>
                    <InfoValue>{client.cpf}</InfoValue>
                  </InfoItem>
                )}

                {client.email && (
                  <InfoItem>
                    <InfoLabel>
                      <IconWrapper>
                        <MdEmail size={16} />
                      </IconWrapper>
                      Email
                    </InfoLabel>
                    <InfoValue>{client.email}</InfoValue>
                  </InfoItem>
                )}

                {client.phone && (
                  <InfoItem>
                    <InfoLabel>
                      <IconWrapper>
                        <MdPhone size={16} />
                      </IconWrapper>
                      Telefone Principal
                    </InfoLabel>
                    <InfoValue>{client.phone}</InfoValue>
                  </InfoItem>
                )}

                {client.secondaryPhone && (
                  <InfoItem>
                    <InfoLabel>
                      <IconWrapper>
                        <MdPhone size={16} />
                      </IconWrapper>
                      Telefone Secundário
                    </InfoLabel>
                    <InfoValue>{client.secondaryPhone}</InfoValue>
                  </InfoItem>
                )}

                {client.whatsapp && (
                  <InfoItem>
                    <InfoLabel>
                      <IconWrapper>
                        <MdPhone size={16} />
                      </IconWrapper>
                      WhatsApp
                    </InfoLabel>
                    <InfoValue>{client.whatsapp}</InfoValue>
                  </InfoItem>
                )}
              </InfoGrid>
            </Section>

            {/* Address Information */}
            {(client.zipCode ||
              client.state ||
              client.city ||
              client.neighborhood ||
              client.address) && (
              <Section>
                <SectionHeader>
                  <SectionIcon>
                    <MdLocationOn size={20} />
                  </SectionIcon>
                  <SectionTitle>Endereço</SectionTitle>
                </SectionHeader>

                <InfoGrid>
                  {client.zipCode && (
                    <InfoItem>
                      <InfoLabel>
                        <IconWrapper>
                          <MdLocationOn size={16} />
                        </IconWrapper>
                        CEP
                      </InfoLabel>
                      <InfoValue>{client.zipCode}</InfoValue>
                    </InfoItem>
                  )}

                  {client.state && (
                    <InfoItem>
                      <InfoLabel>
                        <IconWrapper>
                          <MdLocationOn size={16} />
                        </IconWrapper>
                        Estado
                      </InfoLabel>
                      <InfoValue>{client.state}</InfoValue>
                    </InfoItem>
                  )}

                  {client.city && (
                    <InfoItem>
                      <InfoLabel>
                        <IconWrapper>
                          <MdLocationOn size={16} />
                        </IconWrapper>
                        Cidade
                      </InfoLabel>
                      <InfoValue>{client.city}</InfoValue>
                    </InfoItem>
                  )}

                  {client.neighborhood && (
                    <InfoItem>
                      <InfoLabel>
                        <IconWrapper>
                          <MdLocationOn size={16} />
                        </IconWrapper>
                        Bairro
                      </InfoLabel>
                      <InfoValue>{client.neighborhood}</InfoValue>
                    </InfoItem>
                  )}

                  {client.address && (
                    <InfoItem>
                      <InfoLabel>
                        <IconWrapper>
                          <MdLocationOn size={16} />
                        </IconWrapper>
                        Endereço
                      </InfoLabel>
                      <InfoValue>{client.address}</InfoValue>
                    </InfoItem>
                  )}
                </InfoGrid>
              </Section>
            )}

            {/* Property Preferences */}
            {(client.minValue || client.maxValue) && (
              <Section>
                <SectionHeader>
                  <SectionIcon>
                    <MdHome size={20} />
                  </SectionIcon>
                  <SectionTitle>Preferências de Propriedade</SectionTitle>
                </SectionHeader>

                <InfoGrid>
                  {client.minValue && (
                    <InfoItem>
                      <InfoLabel>
                        <IconWrapper>
                          <MdHome size={16} />
                        </IconWrapper>
                        Valor Mínimo
                      </InfoLabel>
                      <InfoValue>
                        {formatCurrency(Number(client.minValue))}
                      </InfoValue>
                    </InfoItem>
                  )}

                  {client.maxValue && (
                    <InfoItem>
                      <InfoLabel>
                        <IconWrapper>
                          <MdHome size={16} />
                        </IconWrapper>
                        Valor Máximo
                      </InfoLabel>
                      <InfoValue>
                        {formatCurrency(Number(client.maxValue))}
                      </InfoValue>
                    </InfoItem>
                  )}
                </InfoGrid>
              </Section>
            )}

            {/* Notes */}
            {client.notes && (
              <Section>
                <SectionHeader>
                  <SectionIcon>
                    <MdNote size={20} />
                  </SectionIcon>
                  <SectionTitle>Observações</SectionTitle>
                </SectionHeader>

                <InfoItem>
                  <InfoValue style={{ whiteSpace: 'pre-wrap' }}>
                    {client.notes}
                  </InfoValue>
                </InfoItem>
              </Section>
            )}

            {/* Sugestões de Imóveis */}
            <Section>
              <SectionHeader>
                <SectionIcon>
                  <MdCheckCircle size={20} />
                </SectionIcon>
                <SectionTitle>
                  🎯 Sugestões de Imóveis{' '}
                  {matches && matches.length > 0 && `(${matches.length})`}
                </SectionTitle>
              </SectionHeader>

              {matchesLoading ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <Spinner size={40} />
                  <InfoValue style={{ marginTop: '12px', color: '#7f8c8d' }}>
                    Carregando sugestões...
                  </InfoValue>
                </div>
              ) : !matches || matches.length === 0 ? (
                <InfoItem>
                  <InfoValue
                    style={{
                      textAlign: 'center',
                      color: '#7f8c8d',
                      padding: '20px 0',
                    }}
                  >
                    Nenhuma sugestão disponível no momento. Quando houver
                    imóveis compatíveis, eles aparecerão aqui.
                  </InfoValue>
                </InfoItem>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  {matches &&
                    matches.map(match => (
                      <MatchCard
                        key={match.id}
                        match={match}
                        onAccept={() => handleAcceptMatch(match.id)}
                        onIgnore={(reason, notes) =>
                          handleIgnoreMatch(match.id, reason, notes)
                        }
                      />
                    ))}
                </div>
              )}
            </Section>
          </MainContent>

          <Sidebar>
            <EntityDocumentsList
              entityId={client.id}
              entityType='client'
              entityName={client.name}
            />
          </Sidebar>
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};
