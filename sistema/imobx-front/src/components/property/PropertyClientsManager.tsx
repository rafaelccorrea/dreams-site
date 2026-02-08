import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  MdPersonAdd,
  MdClose,
  MdPerson,
  MdPhone,
  MdEmail,
  MdMoreVert,
  MdVisibility,
  MdEdit,
} from 'react-icons/md';
import { ClientSelector } from '../common/ClientSelector';
import { usePropertyClients } from '../../hooks/usePropertyClients';
import { toast } from 'react-toastify';
import { formatPhoneDisplay } from '../../utils/masks';
import { ClickableEmail, ClickablePhone } from '../common/ClickableContact';

interface PropertyClientsManagerProps {
  propertyId: string;
  propertyTitle?: string;
  onClientsChange?: (count: number) => void;
}

const Container = styled.div`
  padding: 0;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
`;

const AddButton = styled.button`
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-primary-dark);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ClientsList = styled.div`
  display: grid;
  gap: 12px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
`;

const ClientCard = styled.div`
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 16px;
  transition: all 0.2s ease;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;

  &:hover {
    border-color: var(--color-primary);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
`;

const ClientHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
  gap: 12px;
`;

const ClientNameSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 0;
`;

const ClientName = styled.div`
  font-weight: 700;
  font-size: 1.125rem;
  color: var(--color-text);
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ClientBadges = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const MoreButton = styled.button`
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-background-secondary);
    color: var(--color-text);
  }
`;

const ClientDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  font-size: 14px;
  width: 100%;
  max-width: 100%;

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }

  @media (min-width: 1400px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex: 1;
  color: var(--color-text-secondary);

  svg {
    color: var(--color-text-secondary);
  }
`;

const TypeBadge = styled.span`
  background: var(--color-background-secondary);
  color: var(--color-primary);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
`;

const InterestType = styled.div`
  background: var(--color-background-secondary);
  color: var(--color-primary);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 20px 16px;
  background: var(--color-background-secondary);
  border-radius: 12px;
  border: 2px dashed var(--color-border);

  @media (min-width: 1025px) {
    padding: 16px 12px;
  }
`;

const EmptyIcon = styled.div`
  font-size: 32px;
  color: var(--color-text-secondary);
  margin-bottom: 8px;

  @media (min-width: 1025px) {
    font-size: 28px;
    margin-bottom: 6px;
  }
`;

const EmptyTitle = styled.div`
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 4px;
  font-size: 14px;

  @media (min-width: 1025px) {
    font-size: 13px;
    margin-bottom: 3px;
  }
`;

const EmptyDescription = styled.div`
  color: var(--color-text-secondary);
  font-size: 12px;
  line-height: 1.4;

  @media (min-width: 1025px) {
    font-size: 11px;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 40px;
  color: var(--color-text-secondary);
`;

const Menu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 10;
  min-width: 150px;
  display: ${props => (props.$isOpen ? 'block' : 'none')};
`;

const MenuItem = styled.button`
  width: 100%;
  padding: 12px 16px;
  text-align: left;
  background: none;
  border: none;
  color: var(--color-text);
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 12px;

  &:hover {
    background: var(--color-background-secondary);
  }

  &:first-child {
    border-radius: 8px 8px 0 0;
  }

  &:last-child {
    border-radius: 0 0 8px 8px;
  }

  svg {
    flex-shrink: 0;
  }
`;

const MenuDivider = styled.div`
  height: 1px;
  background: var(--color-border);
  margin: 4px 0;
`;

export const PropertyClientsManager: React.FC<PropertyClientsManagerProps> = ({
  propertyId,
  propertyTitle,
  onClientsChange,
}) => {
  const navigate = useNavigate();
  const {
    propertyClients = [],
    availableClients = [],
    loading = false,
    error = null,
    fetchPropertyClients,
    fetchAvailableClients,
    assignClientsToProperty,
    removeClientFromProperty,
    setSelectedClients,
  } = usePropertyClients() || {};

  const [showClientSelector, setShowClientSelector] = useState(false);
  const [selectedClientsLocal, setSelectedClientsLocal] = useState([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    if (propertyId) {
      fetchPropertyClients(propertyId);
      fetchAvailableClients();
    }
  }, [propertyId]);

  useEffect(() => {
    if (onClientsChange) {
      onClientsChange(propertyClients.length);
    }
  }, [propertyClients.length, onClientsChange]);

  const handleClientsChange = (clients: any[]) => {
    setSelectedClientsLocal(clients);
  };

  const handleAssignClients = async () => {
    if (selectedClientsLocal.length === 0) return;

    const clientIds = selectedClientsLocal
      .filter(client => client && client.id)
      .map(client => client.id);

    if (clientIds.length === 0) return;

    await assignClientsToProperty(propertyId, clientIds);
    setShowClientSelector(false);
    setSelectedClientsLocal([]);
  };

  const handleRemoveClient = async (clientId: string) => {
    await removeClientFromProperty(propertyId, clientId);
    setOpenMenuId(null);
  };

  const getClientTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      buyer: 'Comprador',
      seller: 'Vendedor',
      renter: 'Locatário',
      lessor: 'Locador',
      investor: 'Investidor',
      general: 'Geral',
    };
    return labels[type] || type;
  };

  const getInterestTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      interested: 'Interessado',
      contacted: 'Contatado',
      viewing: 'Vizualizando',
      negotiating: 'Negociando',
      closed: 'Fechado',
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <Container>
        <LoadingState>Carregando clientes...</LoadingState>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div
          style={{
            color: 'var(--color-error)',
            textAlign: 'center',
            padding: '20px',
          }}
        >
          Erro: {error}
        </div>
      </Container>
    );
  }

  return (
    <Container>
      {propertyClients.length === 0 ? (
        <EmptyState>
          <EmptyIcon>
            <MdPerson />
          </EmptyIcon>
          <EmptyTitle>Nenhum cliente vinculado</EmptyTitle>
          <EmptyDescription>
            Vincule clientes interessados nesta propriedade para acompanhar
            negociações
          </EmptyDescription>
          <div
            style={{
              marginTop: '16px',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <AddButton onClick={() => setShowClientSelector(true)}>
              <MdPersonAdd />
              Vincular Clientes
            </AddButton>
          </div>
        </EmptyState>
      ) : (
        <>
          <ClientsList>
            {propertyClients.map(propertyClient => {
              // Verificação de segurança para evitar erros
              if (
                !propertyClient ||
                !propertyClient.client ||
                !propertyClient.client.id
              ) {
                return null;
              }

              const { client, interestType, notes, contactedAt, createdAt } =
                propertyClient;

              return (
                <ClientCard key={client.id}>
                  <ClientHeader>
                    <ClientNameSection>
                      <ClientName>
                        <MdPerson />
                        {client.name || 'Nome não disponível'}
                      </ClientName>
                      <ClientBadges>
                        <TypeBadge>
                          {getClientTypeLabel(client.type || 'general')}
                        </TypeBadge>
                        <InterestType>
                          {getInterestTypeLabel(interestType || 'interested')}
                        </InterestType>
                      </ClientBadges>
                    </ClientNameSection>
                    <div
                      style={{ position: 'relative' }}
                      ref={el => (menuRefs.current[client.id] = el)}
                    >
                      <MoreButton
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === client.id ? null : client.id
                          )
                        }
                      >
                        <MdMoreVert />
                      </MoreButton>
                      {openMenuId === client.id && (
                        <Menu $isOpen={true} onClick={e => e.stopPropagation()}>
                          <MenuItem
                            onClick={() => {
                              setOpenMenuId(null);
                              navigate(`/clients/${client.id}`);
                            }}
                          >
                            <MdVisibility size={18} />
                            <span>Visualizar</span>
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              setOpenMenuId(null);
                              navigate(`/clients/edit/${client.id}`);
                            }}
                          >
                            <MdEdit size={18} />
                            <span>Editar</span>
                          </MenuItem>
                          <MenuDivider />
                          <MenuItem
                            onClick={() => {
                              setOpenMenuId(null);
                              handleRemoveClient(client.id);
                            }}
                          >
                            Desvincular Cliente
                          </MenuItem>
                        </Menu>
                      )}
                    </div>
                  </ClientHeader>

                  <ClientDetails>
                    {client.email && (
                      <DetailItem>
                        <ClickableEmail email={client.email} />
                      </DetailItem>
                    )}
                    <DetailItem>
                      {client.phone ? (
                        <ClickablePhone phone={client.phone}>
                          {formatPhoneDisplay(client.phone)}
                        </ClickablePhone>
                      ) : (
                        <>
                          <MdPhone />
                          Telefone não disponível
                        </>
                      )}
                    </DetailItem>
                    {client.responsibleUser && client.responsibleUser.name && (
                      <DetailItem>
                        <MdPerson />
                        Responsável: {client.responsibleUser.name}
                      </DetailItem>
                    )}
                    {notes && (
                      <DetailItem>
                        <span>📝</span>
                        {notes}
                      </DetailItem>
                    )}
                    {contactedAt && (
                      <DetailItem>
                        <span>📅</span>
                        Último contato:{' '}
                        {new Date(contactedAt).toLocaleDateString('pt-BR')}
                      </DetailItem>
                    )}
                  </ClientDetails>
                </ClientCard>
              );
            })}
          </ClientsList>
          <div
            style={{
              marginTop: '20px',
              display: 'flex',
              justifyContent: 'flex-end',
              paddingTop: '16px',
              borderTop: '1px solid var(--color-border)',
            }}
          >
            <AddButton onClick={() => setShowClientSelector(true)}>
              <MdPersonAdd />
              Vincular Clientes
            </AddButton>
          </div>
        </>
      )}

      {showClientSelector && (
        <ClientSelector
          selectedClients={selectedClientsLocal}
          onClientsChange={handleClientsChange}
          availableClients={availableClients.filter(
            client =>
              client &&
              client.id &&
              !propertyClients.some(
                pc => pc && pc.client && pc.client.id === client.id
              )
          )}
          onClose={() => setShowClientSelector(false)}
          onConfirm={handleAssignClients}
          propertyTitle={propertyTitle}
        />
      )}
    </Container>
  );
};
