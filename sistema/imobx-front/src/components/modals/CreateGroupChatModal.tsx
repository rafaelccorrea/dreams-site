import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { MdPerson, MdEmail, MdClose, MdGroup } from 'react-icons/md';
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
  Input,
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
  SelectedUsersContainer,
  SelectedUserTag,
  RemoveUserButton,
  ModalFooter,
  CancelButton,
  CreateButton,
} from '../../styles/components/CreateChatModalStyles';

interface CreateGroupChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (name: string, userIds: string[]) => Promise<void>;
}

export const CreateGroupChatModal: React.FC<CreateGroupChatModalProps> = ({
  isOpen,
  onClose,
  onCreateGroup,
}) => {
  const { users, getUsers } = useUsers();
  const { getCurrentUser } = useAuth();
  const [groupName, setGroupName] = useState<string>('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [creating, setCreating] = useState(false);

  const currentUser = getCurrentUser();

  useEffect(() => {
    if (isOpen) {
      getUsers({ page: 1, limit: 100 });
    }
  }, [isOpen, getUsers]);

  const handleClose = () => {
    setGroupName('');
    setSelectedUserIds([]);
    setSearchTerm('');
    setCreating(false);
    onClose();
  };

  const handleCreate = async () => {
    if (!groupName.trim()) {
      toast.error('Digite um nome para o grupo');
      return;
    }

    if (selectedUserIds.length === 0) {
      toast.error('Selecione pelo menos um participante');
      return;
    }

    try {
      setCreating(true);
      await onCreateGroup(groupName.trim(), selectedUserIds);
      handleClose();
      toast.success('Grupo criado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao criar grupo:', error);
      toast.error(error.message || 'Erro ao criar grupo. Tente novamente.');
    } finally {
      setCreating(false);
    }
  };

  const handleToggleUser = (userId: string) => {
    if (selectedUserIds.includes(userId)) {
      setSelectedUserIds(selectedUserIds.filter(id => id !== userId));
    } else {
      setSelectedUserIds([...selectedUserIds, userId]);
    }
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUserIds(selectedUserIds.filter(id => id !== userId));
  };

  const filteredUsers = users.filter(user => {
    // Filtrar o usuário atual
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

  const selectedUsers = users.filter(u => selectedUserIds.includes(u.id));

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <MdGroup size={20} style={{ marginRight: '8px' }} />
            Novo Grupo
          </ModalTitle>
          <ModalCloseButton onClick={handleClose}>
            <MdClose size={20} />
          </ModalCloseButton>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <Label>Nome do Grupo *</Label>
            <Input
              type='text'
              placeholder='Ex: Equipe de Vendas'
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              maxLength={100}
            />
          </FormGroup>

          {selectedUserIds.length > 0 && (
            <FormGroup>
              <Label>
                Participantes Selecionados ({selectedUserIds.length})
              </Label>
              <SelectedUsersContainer>
                {selectedUsers.map(user => (
                  <SelectedUserTag key={user.id}>
                    <UserAvatar $small>
                      {user.name.charAt(0).toUpperCase()}
                    </UserAvatar>
                    <span>{user.name}</span>
                    <RemoveUserButton
                      onClick={() => handleRemoveUser(user.id)}
                      type='button'
                    >
                      <MdClose size={14} />
                    </RemoveUserButton>
                  </SelectedUserTag>
                ))}
              </SelectedUsersContainer>
            </FormGroup>
          )}

          <FormGroup>
            <Label>Buscar Participantes</Label>
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
            <Label>Selecionar Participantes *</Label>
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
                filteredUsers.map(user => {
                  const isSelected = selectedUserIds.includes(user.id);
                  return (
                    <UserCard
                      key={user.id}
                      $isSelected={isSelected}
                      onClick={() => handleToggleUser(user.id)}
                    >
                      <UserAvatar>
                        {user.name.charAt(0).toUpperCase()}
                      </UserAvatar>
                      <UserInfo>
                        <UserName>{user.name}</UserName>
                        <UserEmail>
                          <MdEmail size={14} />
                          {user.email}
                        </UserEmail>
                      </UserInfo>
                      {isSelected && <SelectedIndicator>✓</SelectedIndicator>}
                    </UserCard>
                  );
                })
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
            disabled={
              !groupName.trim() || selectedUserIds.length === 0 || creating
            }
          >
            {creating ? 'Criando...' : 'Criar Grupo'}
          </CreateButton>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};
