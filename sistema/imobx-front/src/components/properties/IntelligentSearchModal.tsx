import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  MdPerson,
  MdSearch,
  MdClose,
  MdInfo,
  MdAutoAwesome,
} from 'react-icons/md';
import { useClients } from '../../hooks/useClients';
import { useIntelligentPropertySearch } from '../../hooks/useIntelligentPropertySearch';
import { toast } from 'react-toastify';

interface IntelligentSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchSuccess: () => void;
  onSearch: (clientId: string) => Promise<void>;
  isSearching?: boolean;
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
  align-items: flex-start; /* dar espaço do topo */
  justify-content: center;
  z-index: 10000;
  padding: 112px 20px 28px; /* espaço ainda maior no topo */
  animation: fadeIn 0.3s ease;

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
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 24px;
  width: 100%;
  max-width: 900px; /* mais largo */
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 32px 64px rgba(0, 0, 0, 0.3);
  border: 1px solid ${props => props.theme.colors.border};
  animation: slideUp 0.3s ease;
  position: relative;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(40px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const ModalHeader = styled.div`
  padding: 24px 32px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary}20,
    ${props => props.theme.colors.primary}05
  );

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(
      90deg,
      ${props => props.theme.colors.primary},
      ${props => props.theme.colors.primary}80
    );
    border-radius: 24px 24px 0 0;
  }
`;

const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.text};
  }
`;

const ModalContent = styled.div`
  padding: 32px;
  min-height: 200px;
`;

const ClientSelectorCard = styled.div`
  width: 100%;
`;

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CardDescription = styled.p`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 24px 0;
  line-height: 1.5;
`;

const ClientSelect = styled.select`
  width: 100%;
  padding: 14px 16px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 15px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.2s;
  margin-bottom: 16px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ClientOption = styled.option`
  padding: 12px;
`;

const LoadingText = styled.div`
  padding: 20px;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 14px;
`;

const SelectedClientInfo = styled.div`
  padding: 16px;
  background: ${props => props.theme.colors.success}15;
  border: 1px solid ${props => props.theme.colors.success}40;
  border-radius: 12px;
  margin-bottom: 20px;

  .label {
    font-size: 12px;
    color: ${props => props.theme.colors.textSecondary};
    margin-bottom: 4px;
  }

  .name {
    font-size: 16px;
    font-weight: 600;
    color: ${props => props.theme.colors.success};
  }

  .details {
    font-size: 13px;
    color: ${props => props.theme.colors.textSecondary};
    margin-top: 8px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
  margin-top: 24px;
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 14px 24px;
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: ${props => props.theme.colors.background};
    border-color: ${props => props.theme.colors.primary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SearchButton = styled.button`
  flex: 2;
  padding: 14px 24px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${props => props.theme.colors.primary}40;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const InfoBox = styled.div`
  margin-top: 20px;
  padding: 16px;
  background: ${props => props.theme.colors.info}10;
  border-left: 4px solid ${props => props.theme.colors.info};
  border-radius: 8px;
  font-size: 13px;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
`;

const StatsBox = styled.div`
  margin-top: 20px;
  padding: 16px;
  background: ${props => props.theme.colors.success}10;
  border-left: 4px solid ${props => props.theme.colors.success};
  border-radius: 8px;
  font-size: 13px;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.8;
`;

const StatsTitle = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.success};
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StatsItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
`;

const StatsLabel = styled.span`
  color: ${props => props.theme.colors.textSecondary};
`;

const StatsValue = styled.span`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

export const IntelligentSearchModal: React.FC<IntelligentSearchModalProps> = ({
  isOpen,
  onClose,
  onSearchSuccess,
  onSearch,
  isSearching = false,
}) => {
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [selectedClient, setSelectedClient] = useState<any>(null);

  const {
    fetchClients,
    clients: availableClients,
    loading: clientsLoading,
  } = useClients();

  useEffect(() => {
    if (isOpen) {
      loadClients();
    } else {
      setSelectedClientId('');
      setSelectedClient(null);
    }
  }, [isOpen]);

  const loadClients = async () => {
    try {
      await fetchClients({
        limit: 100,
      });
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };

  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId);
    const client = availableClients?.find((c: any) => c.id === clientId);
    setSelectedClient(client || null);
  };

  const handleSearch = async () => {
    if (!selectedClientId) return;

    try {
      await onSearch(selectedClientId);
      onSearchSuccess();
    } catch (error: any) {
      console.error('Erro na busca inteligente:', error);
      toast.error('Erro ao realizar busca inteligente. Tente novamente.');
    }
  };

  // Removido - notificações serão tratadas pela página

  if (!isOpen) return null;

  return (
    <ModalOverlay $isOpen={isOpen} onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <MdAutoAwesome
              size={28}
              style={{ color: 'var(--color-primary)' }}
            />
            Busca Inteligente
          </ModalTitle>
          <CloseButton onClick={onClose} title='Fechar'>
            <MdClose size={24} />
          </CloseButton>
        </ModalHeader>

        <ModalContent>
          <ClientSelectorCard>
            <CardTitle>
              <MdPerson size={24} />
              Buscar Propriedades para Cliente
            </CardTitle>
            <CardDescription>
              Selecione um cliente abaixo para encontrar propriedades que
              atendem ao perfil dele automaticamente.
              <br />
              <small style={{ fontSize: '12px', opacity: 0.8 }}>
                A busca analisa preferências como cidade, tipo de imóvel, preço
                e características desejadas.
              </small>
            </CardDescription>

            {clientsLoading ? (
              <LoadingText>
                Carregando clientes com perfil completo...
              </LoadingText>
            ) : (
              <>
                <ClientSelect
                  value={selectedClientId}
                  onChange={e => handleClientChange(e.target.value)}
                  disabled={isSearching}
                >
                  <ClientOption value=''>Selecione um cliente...</ClientOption>
                  {availableClients && availableClients.length > 0 ? (
                    availableClients.map((client: any) => (
                      <ClientOption key={client.id} value={client.id}>
                        {client.name}
                        {client.phone && ` - ${client.phone}`}
                        {client.preferredCity && ` - ${client.preferredCity}`}
                        {client.preferredPropertyType &&
                          ` (${client.preferredPropertyType})`}
                      </ClientOption>
                    ))
                  ) : (
                    <ClientOption value='' disabled>
                      Nenhum cliente com perfil completo encontrado
                    </ClientOption>
                  )}
                </ClientSelect>

                {selectedClient && (
                  <SelectedClientInfo>
                    <div className='label'>Cliente Selecionado:</div>
                    <div className='name'>{selectedClient.name}</div>
                    {selectedClient.preferredCity && (
                      <div className='details'>
                        Cidade preferida: {selectedClient.preferredCity}
                      </div>
                    )}
                    {selectedClient.preferredPropertyType && (
                      <div className='details'>
                        Tipo preferido: {selectedClient.preferredPropertyType}
                      </div>
                    )}
                  </SelectedClientInfo>
                )}

                <ButtonContainer>
                  <CancelButton onClick={onClose} disabled={isSearching}>
                    <MdClose size={20} />
                    Cancelar
                  </CancelButton>
                  <SearchButton
                    onClick={handleSearch}
                    disabled={!selectedClientId || isSearching}
                  >
                    <MdSearch size={20} />
                    {isSearching ? 'Buscando...' : 'Buscar Propriedades'}
                  </SearchButton>
                </ButtonContainer>
              </>
            )}

            <InfoBox>
              <div style={{ marginBottom: '12px' }}>
                <strong
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '8px',
                  }}
                >
                  <MdAutoAwesome size={18} />
                  Como funciona a Busca Inteligente?
                </strong>
                <div
                  style={{
                    fontSize: '12px',
                    lineHeight: '1.6',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  A busca inteligente analisa automaticamente o perfil do
                  cliente e encontra propriedades que atendem aos critérios
                  dele, como:
                  <ul style={{ margin: '8px 0 0 20px', padding: 0 }}>
                    <li>Cidade e região preferida</li>
                    <li>Tipo de imóvel desejado</li>
                    <li>Faixa de preço ideal</li>
                    <li>Quantidade de quartos e banheiros</li>
                    <li>Outras características importantes</li>
                  </ul>
                  Os resultados são classificados por relevância, mostrando as
                  propriedades que melhor se adequam ao cliente.
                </div>
              </div>
              <div
                style={{
                  marginTop: '12px',
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(0,0,0,0.1)',
                }}
              >
                💡 <strong>Dica:</strong> Use filtros avançados no menu de
                filtros para refinar ainda mais os resultados da busca.
              </div>
            </InfoBox>
          </ClientSelectorCard>
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};
