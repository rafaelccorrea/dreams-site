import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { MdSearch, MdClose, MdPerson, MdAdd } from 'react-icons/md';

interface Client {
  id: string;
  name: string;
  email?: string;
  phone: string;
  type: string;
  responsibleUser?: {
    id: string;
    name: string;
  };
}

interface ClientSelectorProps {
  selectedClients: Client[];
  onClientsChange: (clients: Client[]) => void;
  availableClients: Client[];
  onClose: () => void;
  onConfirm: () => void;
  propertyTitle?: string;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(12px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Modal = styled.div`
  background: var(--color-surface);
  border-radius: 20px;
  width: 100%;
  max-width: 900px;
  max-height: 85vh;
  overflow: hidden;
  box-shadow: 0 32px 64px -12px rgba(0, 0, 0, 0.4);
  border: 1px solid var(--color-border);
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  @media (max-width: 768px) {
    max-width: 95vw;
    max-height: 90vh;
    margin: 10px;
    border-radius: 16px;
  }
`;

const Header = styled.div`
  padding: 24px;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    padding: 16px;
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-background-secondary);
    color: var(--color-text);
  }
`;

const Body = styled.div`
  padding: 24px;
  max-height: calc(85vh - 120px);
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 16px;
    max-height: calc(90vh - 120px);
  }
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  transition: box-shadow 0.2s ease;

  &:focus-within {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    margin-bottom: 16px;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 2px solid var(--color-border);
  border-radius: 12px;
  font-size: 14px;
  background: var(--color-background);
  color: var(--color-text);
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-secondary);
`;

const ClientsList = styled.div`
  display: grid;
  gap: 12px;

  @media (max-width: 768px) {
    gap: 8px;
  }
`;

const ClientItem = styled.div<{ $isSelected: boolean }>`
  padding: 20px;
  border: 2px solid
    ${props =>
      props.$isSelected ? 'var(--color-primary)' : 'var(--color-border)'};
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: ${props =>
    props.$isSelected
      ? 'var(--color-primary-light)'
      : 'var(--color-background)'};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      var(--color-primary) 0%,
      var(--color-primary-dark) 100%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }

  &:hover {
    border-color: var(--color-primary);
    background: var(--color-primary-light);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const ClientHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const ClientName = styled.div`
  font-weight: 600;
  color: var(--color-text);
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ClientDetails = styled.div`
  font-size: 13px;
  color: var(--color-text-secondary);
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TypeBadge = styled.span`
  background: var(--color-background-secondary);
  color: var(--color-primary);
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
`;

const SelectedCount = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: linear-gradient(
    135deg,
    var(--color-background-secondary) 0%,
    var(--color-background) 100%
  );
  border-radius: 16px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--color-border);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      var(--color-primary) 0%,
      var(--color-primary-dark) 100%
    );
    opacity: 0.05;
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }
`;

const CountText = styled.span`
  font-weight: 500;
  color: var(--color-text);
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  color: var(--color-error);
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    text-decoration: underline;
  }
`;

const Footer = styled.div`
  padding: 24px;
  border-top: 1px solid var(--color-border);
  display: flex;
  gap: 12px;
  justify-content: flex-end;

  @media (max-width: 768px) {
    padding: 16px;
    flex-direction: column;
    gap: 8px;
  }
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 14px 28px;
  border-radius: 16px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 48px;
  position: relative;
  overflow: hidden;

  ${props =>
    props.$variant === 'primary'
      ? `
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
    color: white;
    border: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
    }
    
    &:active:not(:disabled) {
      transform: translateY(0);
    }
  `
      : `
    background: var(--color-background);
    color: var(--color-text-secondary);
    border: 2px solid var(--color-border);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    &:hover:not(:disabled) {
      background: var(--color-background-secondary);
      border-color: var(--color-border-dark);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    padding: 16px 24px;
    font-size: 16px;
    min-height: 52px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: var(--color-text-secondary);
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    font-size: 48px;
    margin-bottom: 12px;
  }
`;

const SelectionIndicator = styled.div<{ $isSelected: boolean }>`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props =>
    props.$isSelected ? 'var(--color-primary)' : 'var(--color-border)'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border: 2px solid
    ${props =>
      props.$isSelected ? 'var(--color-primary)' : 'var(--color-border)'};

  &::after {
    content: '✓';
    color: white;
    font-size: 14px;
    font-weight: bold;
    opacity: ${props => (props.$isSelected ? 1 : 0)};
    transition: opacity 0.3s ease;
  }
`;

export const ClientSelector: React.FC<ClientSelectorProps> = ({
  selectedClients,
  onClientsChange,
  availableClients,
  onClose,
  onConfirm,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar clientes baseado na busca
  const filteredClients = useMemo(() => {
    if (!searchTerm) return availableClients;

    return availableClients.filter(
      client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.email &&
          client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        client.phone.includes(searchTerm)
    );
  }, [availableClients, searchTerm]);

  const handleClientToggle = (client: Client) => {
    const isSelected = selectedClients.some(c => c.id === client.id);

    if (isSelected) {
      // Remover cliente
      onClientsChange(selectedClients.filter(c => c.id !== client.id));
    } else {
      // Adicionar cliente
      onClientsChange([...selectedClients, client]);
    }
  };

  const handleClearSelection = () => {
    onClientsChange([]);
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

  return (
    <Overlay>
      <Modal>
        <Header>
          <Title>
            <MdPerson />
            Vincular Clientes à Propriedade
          </Title>
          <CloseButton onClick={onClose}>
            <MdClose />
          </CloseButton>
        </Header>

        <Body>
          <SelectedCount>
            <CountText>
              {selectedClients.length} cliente(s) selecionado(s)
            </CountText>
            {selectedClients.length > 0 && (
              <ClearButton onClick={handleClearSelection}>
                <MdClose size={16} />
                Limpar Seleção
              </ClearButton>
            )}
          </SelectedCount>

          <SearchContainer>
            <SearchIcon>
              <MdSearch />
            </SearchIcon>
            <SearchInput
              type='text'
              placeholder='Buscar clientes por nome, email ou telefone...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </SearchContainer>

          {filteredClients.length === 0 ? (
            <EmptyState>
              <EmptyIcon>
                <MdPerson />
              </EmptyIcon>
              <div>Nenhum cliente encontrado</div>
              <div style={{ fontSize: '14px', marginTop: '8px' }}>
                {searchTerm
                  ? 'Tente ajustar a busca'
                  : 'Não há clientes disponíveis'}
              </div>
            </EmptyState>
          ) : (
            <ClientsList>
              {filteredClients.map(client => {
                const isSelected = selectedClients.some(
                  c => c.id === client.id
                );

                return (
                  <ClientItem
                    key={client.id}
                    $isSelected={isSelected}
                    onClick={() => handleClientToggle(client)}
                  >
                    <SelectionIndicator $isSelected={isSelected} />
                    <ClientHeader>
                      <ClientName>
                        <MdPerson />
                        {client.name}
                      </ClientName>
                      <TypeBadge>{getClientTypeLabel(client.type)}</TypeBadge>
                    </ClientHeader>
                    <ClientDetails>
                      {client.email && <div>📧 {client.email}</div>}
                      <div>📞 {client.phone}</div>
                      {client.responsibleUser && (
                        <div>👤 Responsável: {client.responsibleUser.name}</div>
                      )}
                    </ClientDetails>
                  </ClientItem>
                );
              })}
            </ClientsList>
          )}
        </Body>

        <Footer>
          <Button $variant='secondary' onClick={onClose}>
            Cancelar
          </Button>
          <Button
            $variant='primary'
            onClick={onConfirm}
            disabled={selectedClients.length === 0}
          >
            <MdAdd />
            Vincular {selectedClients.length} Cliente(s)
          </Button>
        </Footer>
      </Modal>
    </Overlay>
  );
};
