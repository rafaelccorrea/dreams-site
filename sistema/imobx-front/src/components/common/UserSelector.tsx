import React, { useState, useEffect } from 'react';
import { MdPerson, MdEmail, MdSearch, MdCheck } from 'react-icons/md';
import { useUsers } from '../../hooks/useUsers';
import { useAuth } from '../../hooks/useAuth';
import * as S from '../../styles/components/UserSelectorStyles';

interface UserSelectorProps {
  selectedUserIds: string[];
  onSelectionChange: (userIds: string[]) => void;
  placeholder?: string;
  maxHeight?: string;
}

export const UserSelector: React.FC<UserSelectorProps> = ({
  selectedUserIds,
  onSelectionChange,
  placeholder = 'Buscar colaboradores...',
  maxHeight = '200px',
}) => {
  const { users, getUsers } = useUsers();
  const { getCurrentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    getUsers({ page: 1, limit: 100 });
  }, [getUsers]);

  const currentUser = getCurrentUser();

  // Remover o usuário atual da lista de selecionados caso esteja lá
  useEffect(() => {
    if (currentUser && selectedUserIds.includes(currentUser.id)) {
      onSelectionChange(selectedUserIds.filter(id => id !== currentUser.id));
    }
  }, [currentUser, selectedUserIds, onSelectionChange]);

  const filteredUsers = users.filter(user => {
    // Filtrar o usuário atual (não permitir convidar a si mesmo)
    if (user.id === currentUser?.id) {
      return false;
    }

    // Filtrar por termo de busca
    return (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleUserToggle = (userId: string) => {
    // Não permitir selecionar o usuário atual
    if (userId === currentUser?.id) {
      return;
    }

    const isSelected = selectedUserIds.includes(userId);
    if (isSelected) {
      onSelectionChange(selectedUserIds.filter(id => id !== userId));
    } else {
      onSelectionChange([...selectedUserIds, userId]);
    }
  };

  return (
    <S.Container>
      <S.SearchContainer>
        <S.SearchInput
          type='text'
          placeholder={placeholder}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <S.SearchIcon>
          <MdSearch size={18} />
        </S.SearchIcon>
      </S.SearchContainer>

      <S.UsersList $maxHeight={maxHeight}>
        {filteredUsers.length === 0 ? (
          <S.EmptyState>
            <MdPerson size={32} />
            <S.EmptyText>
              {searchTerm
                ? 'Nenhum colaborador encontrado'
                : 'Digite para buscar colaboradores'}
            </S.EmptyText>
          </S.EmptyState>
        ) : (
          filteredUsers.map(user => {
            const isSelected = selectedUserIds.includes(user.id);
            return (
              <S.UserItem
                key={user.id}
                $isSelected={isSelected}
                onClick={() => handleUserToggle(user.id)}
              >
                <S.UserAvatar>{user.name.charAt(0).toUpperCase()}</S.UserAvatar>
                <S.UserInfo>
                  <S.UserName>{user.name}</S.UserName>
                  <S.UserEmail>
                    <MdEmail size={12} />
                    {user.email}
                  </S.UserEmail>
                </S.UserInfo>
                {isSelected && (
                  <S.SelectedIndicator>
                    <MdCheck size={16} />
                  </S.SelectedIndicator>
                )}
              </S.UserItem>
            );
          })
        )}
      </S.UsersList>

      {selectedUserIds.length > 0 && (
        <S.SelectedCount>
          {selectedUserIds.length} colaborador
          {selectedUserIds.length !== 1 ? 'es' : ''} selecionado
          {selectedUserIds.length !== 1 ? 's' : ''}
        </S.SelectedCount>
      )}
    </S.Container>
  );
};
