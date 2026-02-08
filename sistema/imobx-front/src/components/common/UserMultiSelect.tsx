/**
 * Seletor múltiplo de usuários
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MdSearch, MdPerson, MdClose } from 'react-icons/md';
import {
  companyMembersApi,
  type CompanyMemberSimple,
} from '../../services/companyMembersApi';

interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  role?: string;
}

interface UserMultiSelectProps {
  selectedUserIds: string[];
  onSelect: (userId: string) => void;
  onRemove: (userId: string) => void;
  maxSelections?: number;
  excludeUserIds?: string[]; // IDs de usuários a serem excluídos da lista
}

export function UserMultiSelect({
  selectedUserIds,
  onSelect,
  onRemove,
  maxSelections = 5,
  excludeUserIds = [],
}: UserMultiSelectProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      // Usando a nova API pública de membros da empresa
      // Agora qualquer usuário (USER, MANAGER, ADMIN, MASTER) pode ver os membros
      const members = await companyMembersApi.getMembersSimple();
      setUsers(members);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedUsers = users.filter(u => selectedUserIds.includes(u.id));
  const availableUsers = users.filter(
    u => !selectedUserIds.includes(u.id) && !excludeUserIds.includes(u.id)
  );

  const filteredUsers = availableUsers.filter(
    user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canSelectMore = selectedUserIds.length < maxSelections;

  return (
    <Container>
      {/* Selected Users */}
      {selectedUsers.length > 0 && (
        <SelectedList>
          {selectedUsers.map(user => (
            <SelectedBadge key={user.id}>
              {user.avatar ? (
                <Avatar src={user.avatar} alt={user.name} />
              ) : (
                <AvatarPlaceholder>
                  <MdPerson />
                </AvatarPlaceholder>
              )}
              <UserName>{user.name}</UserName>
              <RemoveButton onClick={() => onRemove(user.id)}>
                <MdClose size={16} />
              </RemoveButton>
            </SelectedBadge>
          ))}
        </SelectedList>
      )}

      {/* Search Input */}
      {canSelectMore && (
        <SearchContainer>
          <SearchIcon>
            <MdSearch />
          </SearchIcon>
          <SearchInput
            type='text'
            placeholder='Buscar corretores...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onFocus={() => setShowDropdown(true)}
          />
          {searchTerm && (
            <ClearButton onClick={() => setSearchTerm('')}>
              <MdClose />
            </ClearButton>
          )}
        </SearchContainer>
      )}

      {/* Dropdown List */}
      {showDropdown && canSelectMore && (
        <>
          <Overlay onClick={() => setShowDropdown(false)} />
          <Dropdown>
            {loading ? (
              <LoadingState>Carregando...</LoadingState>
            ) : filteredUsers.length === 0 ? (
              <EmptyState>
                {searchTerm
                  ? 'Nenhum usuário encontrado'
                  : 'Todos os usuários já foram selecionados'}
              </EmptyState>
            ) : (
              filteredUsers.slice(0, 20).map(user => (
                <UserOption
                  key={user.id}
                  onClick={() => {
                    onSelect(user.id);
                    setSearchTerm('');
                    if (selectedUserIds.length + 1 >= maxSelections) {
                      setShowDropdown(false);
                    }
                  }}
                >
                  {user.avatar ? (
                    <Avatar src={user.avatar} alt={user.name} />
                  ) : (
                    <AvatarPlaceholder>
                      <MdPerson />
                    </AvatarPlaceholder>
                  )}
                  <UserInfo>
                    <UserNameDropdown>{user.name}</UserNameDropdown>
                    {user.email && <UserEmail>{user.email}</UserEmail>}
                  </UserInfo>
                </UserOption>
              ))
            )}
          </Dropdown>
        </>
      )}

      {/* Hint */}
      {!canSelectMore && (
        <HintText>Máximo de {maxSelections} usuários atingido</HintText>
      )}
    </Container>
  );
}

// Styled Components
const Container = styled.div`
  position: relative;
`;

const SelectedList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
`;

const SelectedBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${props => props.theme.colors.primary};
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: 8px;
  padding: 6px 8px 6px 6px;
`;

const Avatar = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.3);
`;

const AvatarPlaceholder = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`;

const UserName = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  /* Garantir contraste no modo claro - a cor primária (#A63126) é escura, então branco funciona bem */
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 2px;
  display: flex;
  align-items: center;
  border-radius: 4px;
  transition: all 0.2s;
  opacity: 0.8;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    opacity: 1;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 40px 10px 40px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.hover};
    color: ${props => props.theme.colors.text};
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: ${props => props.theme.colors.background};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  max-height: 300px;
  overflow-y: auto;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const UserOption = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${props => props.theme.colors.hover};
  }

  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }
`;

const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const UserNameDropdown = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const UserEmail = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 2px;
`;

const LoadingState = styled.div`
  padding: 20px;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const EmptyState = styled.div`
  padding: 20px;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const HintText = styled.p`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 8px 0 0 0;
  font-style: italic;
`;
