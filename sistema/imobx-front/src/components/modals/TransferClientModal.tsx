import React, { useState, useEffect } from 'react';
import { MdClose, MdPerson, MdTransferWithinAStation } from 'react-icons/md';
import { api } from '../../services/api';
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  HeaderTitle,
  CloseButton,
  ModalContent,
  ClientInfo,
  ClientName,
  CurrentResponsible,
  UserList,
  UserItem,
  UserInfo,
  UserAvatar,
  UserDetails,
  UserName,
  UserEmail,
  UserRole,
  ErrorMessage,
  ModalFooter,
  Button,
  LoadingContainer,
  EmptyState,
  EmptyIcon,
  EmptyText,
} from './styles/TransferClientModal.styles';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface TransferClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransfer: (newResponsibleUserId: string) => void;
  clientName: string;
  currentResponsible?: string;
  clientId: string;
}

export const TransferClientModal: React.FC<TransferClientModalProps> = ({
  isOpen,
  onClose,
  onTransfer,
  clientName,
  currentResponsible,
  clientId,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [transferring, setTransferring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/clients/users-for-transfer');
      setUsers(response.data);
    } catch (err) {
      console.error('Erro ao carregar usuários:', err);
      setError('Erro ao carregar lista de usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (selectedUserId && !transferring) {
      try {
        setTransferring(true);
        setError(null);
        await onTransfer(selectedUserId);
        onClose();
      } catch (error) {
        setError('Erro ao transferir cliente. Tente novamente.');
      } finally {
        setTransferring(false);
      }
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'master':
        return 'Gerenciador';
      case 'user':
        return 'Corretor';
      default:
        return role;
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay $isOpen={isOpen}>
      <ModalContainer>
        <ModalHeader>
          <HeaderTitle>
            <MdTransferWithinAStation size={24} />
            Transferir Cliente
          </HeaderTitle>
          <CloseButton onClick={onClose}>
            <MdClose size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalContent>
          <ClientInfo>
            <ClientName>
              <strong>Cliente:</strong> {clientName}
            </ClientName>
            {currentResponsible && (
              <CurrentResponsible>
                <strong>Responsável atual:</strong> {currentResponsible}
              </CurrentResponsible>
            )}
          </ClientInfo>

          {loading ? (
            <LoadingContainer>
              <div>Carregando usuários...</div>
            </LoadingContainer>
          ) : error ? (
            <ErrorMessage>{error}</ErrorMessage>
          ) : users.length === 0 ? (
            <EmptyState>
              <EmptyIcon>
                <MdPerson size={48} />
              </EmptyIcon>
              <EmptyText>
                Nenhum usuário disponível para transferência
              </EmptyText>
            </EmptyState>
          ) : (
            <UserList>
              {users.map(user => (
                <UserItem
                  key={user.id}
                  $isSelected={selectedUserId === user.id}
                  onClick={() => setSelectedUserId(user.id)}
                >
                  <UserInfo>
                    <UserAvatar>{getUserInitials(user.name)}</UserAvatar>
                    <UserDetails>
                      <UserName>{user.name}</UserName>
                      <UserEmail>{user.email}</UserEmail>
                    </UserDetails>
                    <UserRole>{getRoleLabel(user.role)}</UserRole>
                  </UserInfo>
                </UserItem>
              ))}
            </UserList>
          )}
        </ModalContent>

        {error && (
          <ErrorMessage style={{ marginTop: '16px', marginBottom: '16px' }}>
            {error}
          </ErrorMessage>
        )}

        <ModalFooter>
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            $variant='primary'
            onClick={handleTransfer}
            disabled={!selectedUserId || loading || transferring}
          >
            {transferring ? 'Transferindo...' : 'Transferir Cliente'}
          </Button>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};
