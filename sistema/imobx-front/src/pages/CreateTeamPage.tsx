import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdCheck, MdClose, MdSearch } from 'react-icons/md';
import { Layout } from '../components/layout/Layout';
import { useTeams } from '../hooks/useTeams';
import { useUsers } from '../hooks/useUsers';
import { showSuccess, showError } from '../utils/notifications';
import { translateUserRole } from '../utils/roleTranslations';
import styled from 'styled-components';
import {
  Input,
  TextArea,
  Button,
  ToastContainer,
  ToastIcon,
  ToastMessage,
} from '../styles/pages/NotesPageStyles';
import type { CreateTeamDto } from '../services/teamApi';

const colors = [
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#06B6D4',
  '#84CC16',
  '#F97316',
  '#EC4899',
  '#6366F1',
  '#14B8A6',
  '#DC2626',
  '#059669',
  '#7C3AED',
  '#0891B2',
];

const SimplePageContainer = styled.div`
  padding: 32px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const SimpleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    align-items: stretch;
  }
`;

const SimpleTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const SimpleSubtitle = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const SimpleBackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: transparent;
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: ${props => props.theme.colors.cardBackground};
    transform: translateX(4px);
  }
`;

const SimpleFormGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 28px;
`;

const ResponsiveRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
`;

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FieldLabel = styled.label`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const RequiredMark = styled.span`
  color: ${props => props.theme.colors.error};
`;

const ColorPicker = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
`;

const ColorOption = styled.button<{ $color: string; $isSelected: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => props.$color};
  border: 3px solid
    ${props => (props.$isSelected ? props.theme.colors.primary : 'transparent')};
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${props =>
    props.$isSelected
      ? `0 0 0 3px ${props.theme.colors.primary}40`
      : '0 2px 8px rgba(0,0,0,0.1)'};

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const UserSelector = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 16px;
  background: ${props => props.theme.colors.backgroundSecondary};
`;

const UserSearchInput = styled(Input)`
  margin-bottom: 0;
`;

const UsersList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const UserItem = styled.div<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: ${props =>
    props.$isSelected
      ? props.theme.colors.primary + '20'
      : props.theme.colors.cardBackground};
  border: 1px solid
    ${props =>
      props.$isSelected
        ? props.theme.colors.primary
        : props.theme.colors.border};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    border-color: ${props => props.theme.colors.primary};
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const UserName = styled.span`
  font-weight: 600;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
`;

const UserEmail = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const UserRole = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const AddUserButton = styled.button<{ $isSelected: boolean }>`
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  background: ${props =>
    props.$isSelected ? props.theme.colors.primary : 'transparent'};
  color: ${props => (props.$isSelected ? 'white' : props.theme.colors.primary)};
  border: 1px solid
    ${props =>
      props.$isSelected
        ? props.theme.colors.primary
        : props.theme.colors.border};

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primary};
    color: white;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SelectedUsers = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px;
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 8px;
  min-height: 60px;
  align-items: flex-start;
`;

const SelectedUser = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: ${props => props.theme.colors.primary + '20'};
  border: 1px solid ${props => props.theme.colors.primary};
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
`;

const RemoveUserButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
  }
`;

const ButtonsRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  flex-wrap: wrap;
`;

const LoadingSpinner = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid ${props => props.theme.colors.border};
  border-top-color: ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 0.7s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const EmptyMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const CreateTeamPage: React.FC = () => {
  const navigate = useNavigate();
  const { createTeam } = useTeams();
  const { users, getUsers } = useUsers();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: colors[0],
  });
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    getUsers({ page: 1 });
  }, [getUsers]);

  const filteredUsers = useMemo(() => {
    if (users.length === 0) {
      return [];
    }

    if (!userSearchTerm.trim()) {
      return users.filter(user => !selectedUsers.includes(user.id));
    }

    const search = userSearchTerm.toLowerCase();
    return users.filter(
      user =>
        !selectedUsers.includes(user.id) &&
        (user.name.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search) ||
          user.role.toLowerCase().includes(search))
    );
  }, [users, userSearchTerm, selectedUsers]);

  const handleAddUser = (userId: string) => {
    if (!selectedUsers.includes(userId)) {
      setSelectedUsers(prev => [...prev, userId]);
      setUserSearchTerm('');
    }
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(prev => prev.filter(id => id !== userId));
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      setToastMessage('Nome da equipe é obrigatório');
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
      return;
    }

    if (selectedUsers.length === 0) {
      setToastMessage('Selecione pelo menos um usuário para a equipe');
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
      return;
    }

    const validUserIds = selectedUsers.filter(userId => {
      const isValidUUID =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          userId
        );
      return isValidUUID;
    });

    if (validUserIds.length !== selectedUsers.length) {
      setToastMessage('Alguns usuários selecionados têm IDs inválidos');
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
      return;
    }

    setIsCreating(true);
    try {
      const teamData: CreateTeamDto = {
        name: formData.name.trim(),
        description: formData.description?.trim() || '',
        color: formData.color,
        userIds: validUserIds,
      };

      await createTeam(teamData);
      setToastMessage('Equipe criada com sucesso!');
      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
        navigate('/teams');
      }, 1500);
    } catch (error: any) {
      setToastMessage(error.message || 'Erro ao criar equipe');
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Layout>
      <SimplePageContainer>
        <SimpleHeader>
          <div>
            <SimpleTitle>Nova Equipe</SimpleTitle>
            <SimpleSubtitle>
              Preencha os dados para criar uma nova equipe
            </SimpleSubtitle>
          </div>
          <SimpleBackButton onClick={() => navigate('/teams')}>
            <MdArrowBack size={20} />
            Voltar
          </SimpleBackButton>
        </SimpleHeader>

        <SimpleFormGrid>
          <FieldContainer>
            <FieldLabel>
              Nome da Equipe <RequiredMark>*</RequiredMark>
            </FieldLabel>
            <Input
              type='text'
              value={formData.name}
              onChange={e =>
                setFormData(prev => ({ ...prev, name: e.target.value }))
              }
              placeholder='Digite o nome da equipe'
            />
          </FieldContainer>

          <FieldContainer>
            <FieldLabel>Descrição</FieldLabel>
            <TextArea
              value={formData.description}
              onChange={e =>
                setFormData(prev => ({ ...prev, description: e.target.value }))
              }
              placeholder='Descreva o propósito da equipe'
              rows={4}
            />
          </FieldContainer>

          <FieldContainer>
            <FieldLabel>Cor da Equipe</FieldLabel>
            <ColorPicker>
              {colors.map(color => (
                <ColorOption
                  key={color}
                  $color={color}
                  $isSelected={formData.color === color}
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                />
              ))}
            </ColorPicker>
          </FieldContainer>

          <FieldContainer>
            <FieldLabel>
              Usuários da Equipe <RequiredMark>*</RequiredMark>
            </FieldLabel>
            <UserSelector>
              <UserSearchInput
                type='text'
                placeholder='Buscar usuários...'
                value={userSearchTerm}
                onChange={e => setUserSearchTerm(e.target.value)}
              />

              <UsersList>
                {filteredUsers.length === 0 ? (
                  <EmptyMessage>
                    {userSearchTerm
                      ? 'Nenhum usuário encontrado'
                      : 'Nenhum usuário disponível'}
                  </EmptyMessage>
                ) : (
                  filteredUsers.map(user => (
                    <UserItem
                      key={user.id}
                      $isSelected={selectedUsers.includes(user.id)}
                    >
                      <UserInfo>
                        <UserAvatar>
                          {user.name.charAt(0).toUpperCase()}
                        </UserAvatar>
                        <UserDetails>
                          <UserName>{user.name}</UserName>
                          {user.email && <UserEmail>{user.email}</UserEmail>}
                          <UserRole>{translateUserRole(user.role)}</UserRole>
                        </UserDetails>
                      </UserInfo>
                      <AddUserButton
                        $isSelected={selectedUsers.includes(user.id)}
                        onClick={() => handleAddUser(user.id)}
                        disabled={selectedUsers.includes(user.id)}
                      >
                        {selectedUsers.includes(user.id)
                          ? 'Adicionado'
                          : 'Adicionar'}
                      </AddUserButton>
                    </UserItem>
                  ))
                )}
              </UsersList>

              <SelectedUsers>
                {selectedUsers.length === 0 ? (
                  <EmptyMessage>Nenhum usuário selecionado</EmptyMessage>
                ) : (
                  selectedUsers.map(userId => {
                    const user = users.find(u => u.id === userId);
                    return (
                      <SelectedUser key={userId}>
                        <span>{user ? user.name : `Usuário ${userId}`}</span>
                        <RemoveUserButton
                          onClick={() => handleRemoveUser(userId)}
                        >
                          <MdClose size={14} />
                        </RemoveUserButton>
                      </SelectedUser>
                    );
                  })
                )}
              </SelectedUsers>
            </UserSelector>
          </FieldContainer>
        </SimpleFormGrid>

        <ButtonsRow>
          <Button
            type='button'
            $variant='secondary'
            onClick={() => navigate('/teams')}
          >
            Cancelar
          </Button>
          <Button
            type='button'
            $variant='primary'
            onClick={handleCreate}
            disabled={
              !formData.name.trim() || selectedUsers.length === 0 || isCreating
            }
          >
            {isCreating ? (
              <>
                <LoadingSpinner />
                Criando...
              </>
            ) : (
              <>
                <MdCheck size={18} />
                Criar Equipe
              </>
            )}
          </Button>
        </ButtonsRow>

        {showSuccessToast && (
          <ToastContainer $type='success'>
            <ToastIcon>
              <MdCheck size={20} />
            </ToastIcon>
            <ToastMessage>{toastMessage}</ToastMessage>
          </ToastContainer>
        )}

        {showErrorToast && (
          <ToastContainer $type='error'>
            <ToastIcon>
              <MdClose size={20} />
            </ToastIcon>
            <ToastMessage>{toastMessage}</ToastMessage>
          </ToastContainer>
        )}
      </SimplePageContainer>
    </Layout>
  );
};

export default CreateTeamPage;
