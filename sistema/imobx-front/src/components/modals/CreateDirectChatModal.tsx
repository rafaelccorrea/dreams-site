import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { MdPerson, MdEmail, MdClose } from 'react-icons/md';
import { useUsers } from '../../hooks/useUsers';
import { useAuth } from '../../hooks/useAuth';
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  FormGroup,
  Label,
  SearchContainer,
  SearchInput,
  SearchIcon,
  UsersList,
  UserCard,
  UserAvatar,
  UserInfo,
  UserName,
  UserEmail,
  SelectedIndicator,
  EmptyState,
  EmptyText,
  ModalFooter,
  CancelButton,
  CreateButton,
} from '../../styles/components/CreateChatModalStyles';

interface CreateDirectChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChat: (userId: string) => Promise<void>;
}

export const CreateDirectChatModal: React.FC<CreateDirectChatModalProps> = ({
  isOpen,
  onClose,
  onCreateChat,
}) => {
  const { users, getUsers } = useUsers();
  const { getCurrentUser } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const currentUser = getCurrentUser();

  useEffect(() => {
    if (isOpen) {
      getUsers({ page: 1, limit: 100 });
    }
  }, [isOpen, getUsers]);

  const handleClose = () => {
    setSelectedUserId('');
    setSearchTerm('');
    setCreating(false);
    onClose();
  };

  const handleCreate = async () => {
    if (!selectedUserId) {
      toast.error('Selecione um usuário para iniciar a conversa');
      return;
    }

    try {
      setCreating(true);
      await onCreateChat(selectedUserId);
      handleClose();
      toast.success('Conversa criada com sucesso!');
    } catch (error: any) {
      console.error('Erro ao criar conversa:', error);
      toast.error(error.message || 'Erro ao criar conversa. Tente novamente.');
    } finally {
      setCreating(false);
    }
  };

  const filteredUsers = users.filter(user => {
    // Filtrar o usuário atual (não permitir conversar consigo mesmo)
    if (user.id === currentUser?.id) {
      return false;
    }

    // Filtrar por termo de busca
    if (!searchTerm.trim()) {
      return true;
    }

    const search = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search)
    );
  });

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Nova Conversa</ModalTitle>
          <ModalCloseButton onClick={handleClose}>
            <MdClose size={20} />
          </ModalCloseButton>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <Label>Buscar Usuário</Label>
            <SearchContainer>
              <SearchInput
                type='text'
                placeholder='Digite o nome ou email do usuário...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <SearchIcon>
                <MdPerson size={18} />
              </SearchIcon>
            </SearchContainer>
          </FormGroup>

          <FormGroup>
            <Label>Selecionar Usuário *</Label>
            <UsersList>
              {filteredUsers.length === 0 ? (
                <EmptyState>
                  <MdPerson size={48} />
                  <EmptyText>
                    {searchTerm
                      ? 'Nenhum usuário encontrado'
                      : 'Digite para buscar usuários'}
                  </EmptyText>
                </EmptyState>
              ) : (
                filteredUsers.map(user => (
                  <UserCard
                    key={user.id}
                    $isSelected={selectedUserId === user.id}
                    onClick={() => setSelectedUserId(user.id)}
                  >
                    <UserAvatar>{user.name.charAt(0).toUpperCase()}</UserAvatar>
                    <UserInfo>
                      <UserName>{user.name}</UserName>
                      <UserEmail>
                        <MdEmail size={14} />
                        {user.email}
                      </UserEmail>
                    </UserInfo>
                    {selectedUserId === user.id && (
                      <SelectedIndicator>✓</SelectedIndicator>
                    )}
                  </UserCard>
                ))
              )}
            </UsersList>
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <CancelButton onClick={handleClose} disabled={creating}>
            Cancelar
          </CancelButton>
          <CreateButton
            onClick={handleCreate}
            disabled={!selectedUserId || creating}
          >
            {creating ? 'Criando...' : 'Criar Conversa'}
          </CreateButton>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};
