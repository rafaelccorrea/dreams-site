import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MdClose, MdSave, MdPersonAdd, MdRemoveCircle } from 'react-icons/md';
import { useUsers } from '../../hooks/useUsers';
import { translateUserRole } from '../../utils/roleTranslations';

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => (props.isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  padding: 0;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  padding: 24px 24px 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.hover};
    color: ${props => props.theme.colors.text};
  }
`;

const ModalBody = styled.div`
  padding: 24px;
  max-height: 60vh;
  overflow-y: auto;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 1rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}20`};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 1rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  resize: vertical;
  min-height: 80px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}20`};
  }
`;

const ColorInput = styled.input`
  width: 60px;
  height: 40px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  cursor: pointer;
  background: none;
`;

const MembersSection = styled.div`
  margin-top: 24px;
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 16px 0;
`;

const MembersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MemberItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
`;

const MemberInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const MemberAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
`;

const MemberDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const MemberName = styled.span`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const MemberEmail = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const MemberRole = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.error};
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => `${props.theme.colors.error}20`};
  }
`;

const UsersListContainer = styled.div`
  margin-top: 8px;
  max-height: 200px;
  overflow-y: auto;
`;

const UserSearchItem = styled.div`
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 8px;
  margin-bottom: 4px;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.hover};
    border-color: ${props => props.theme.colors.borderLight};
  }
`;

const UserSearchInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 2px;
`;

const UserSearchName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const UserSearchEmail = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const UserSearchRole = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const AddUserIcon = styled.div`
  margin-left: auto;
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
`;

const ModalFooter = styled.div`
  padding: 0 24px 24px 24px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  border: 2px solid transparent;

  ${props => {
    if (props.variant === 'primary') {
      return `
        background: ${props.theme.colors.primary};
        color: white;
        border-color: ${props.theme.colors.primary};

        &:hover {
          background: ${props.theme.colors.primaryDark};
          border-color: ${props.theme.colors.primaryDark};
        }
      `;
    } else {
      return `
        background: ${props.theme.colors.background};
        color: ${props.theme.colors.textSecondary};
        border-color: ${props.theme.colors.border};

        &:hover {
          background: ${props.theme.colors.hover};
          border-color: ${props.theme.colors.borderLight};
          color: ${props.theme.colors.text};
        }
      `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

interface EditTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (teamData: any) => Promise<void>;
  team: {
    id: string;
    name: string;
    description?: string;
    color?: string;
    members: Array<{
      id: string;
      user: {
        id: string;
        name: string;
        email: string;
        role: string;
      };
      role: string;
    }>;
  };
  isLoading?: boolean;
}

export const EditTeamModal: React.FC<EditTeamModalProps> = ({
  isOpen,
  onClose,
  onSave,
  team,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
  });
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [showUsersList, setShowUsersList] = useState(false);

  const { users, getUsers } = useUsers();

  useEffect(() => {
    if (isOpen) {
      // Carregar usuários quando o modal abrir
      getUsers({ page: 1 });
    }
  }, [isOpen, getUsers]);

  useEffect(() => {
    if (team && isOpen) {
      // console.log('🔄 Inicializando modal com dados da equipe:', team);
      setFormData({
        name: team.name,
        description: team.description || '',
        color: team.color || '#3B82F6',
      });
      const memberIds = team.members.map(member => member.user.id);
      // console.log('👥 IDs dos membros:', memberIds);
      setSelectedUsers(memberIds);
    }
  }, [team, isOpen]);

  const filteredUsers = users.filter(
    user =>
      user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) &&
      !selectedUsers.includes(user.id)
  );

  const handleAddUser = (userId: string) => {
    setSelectedUsers(prev => [...prev, userId]);
    setUserSearchTerm('');
    setShowUsersList(false);
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(prev => prev.filter(id => id !== userId));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) return;

    const teamData = {
      ...formData,
      userIds: selectedUsers,
    };

    await onSave(teamData);
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      color: '#3B82F6',
    });
    setSelectedUsers([]);
    setUserSearchTerm('');
    setShowUsersList(false);
    onClose();
  };

  const selectedUsersData = users.filter(user =>
    selectedUsers.includes(user.id)
  );

  return (
    <ModalOverlay isOpen={isOpen}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Editar Equipe</ModalTitle>
          <CloseButton onClick={handleClose}>
            <MdClose size={24} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <Label>Nome da Equipe *</Label>
            <Input
              type='text'
              value={formData.name}
              onChange={e =>
                setFormData(prev => ({ ...prev, name: e.target.value }))
              }
              placeholder='Digite o nome da equipe'
            />
          </FormGroup>

          <FormGroup>
            <Label>Descrição</Label>
            <TextArea
              value={formData.description}
              onChange={e =>
                setFormData(prev => ({ ...prev, description: e.target.value }))
              }
              placeholder='Descreva a equipe (opcional)'
            />
          </FormGroup>

          <FormGroup>
            <Label>Cor da Equipe</Label>
            <ColorInput
              type='color'
              value={formData.color}
              onChange={e =>
                setFormData(prev => ({ ...prev, color: e.target.value }))
              }
            />
          </FormGroup>

          <MembersSection>
            <SectionTitle>Membros da Equipe</SectionTitle>

            <MembersList>
              {selectedUsersData.map(user => (
                <MemberItem key={user.id}>
                  <MemberInfo>
                    <MemberAvatar>
                      {user.name.charAt(0).toUpperCase()}
                    </MemberAvatar>
                    <MemberDetails>
                      <MemberName>{user.name}</MemberName>
                      {user.email && <MemberEmail>{user.email}</MemberEmail>}
                      <MemberRole>{translateUserRole(user.role)}</MemberRole>
                    </MemberDetails>
                  </MemberInfo>
                  <RemoveButton onClick={() => handleRemoveUser(user.id)}>
                    <MdRemoveCircle size={20} />
                  </RemoveButton>
                </MemberItem>
              ))}
            </MembersList>

            <div style={{ marginTop: '16px' }}>
              <Label>Adicionar Membros</Label>
              <Input
                type='text'
                value={userSearchTerm}
                onChange={e => {
                  setUserSearchTerm(e.target.value);
                  setShowUsersList(true);
                }}
                onFocus={() => setShowUsersList(true)}
                placeholder='Buscar usuários...'
              />

              {showUsersList && (
                <UsersListContainer>
                  {filteredUsers.length === 0 ? (
                    <div
                      style={{
                        padding: '12px',
                        textAlign: 'center',
                        color: 'var(--theme-text-secondary)',
                        fontSize: '0.875rem',
                      }}
                    >
                      {userSearchTerm
                        ? 'Nenhum usuário encontrado'
                        : selectedUsers.length === users.length
                          ? 'Todos os usuários já estão na equipe'
                          : 'Digite para buscar usuários'}
                    </div>
                  ) : (
                    filteredUsers.map(user => (
                      <UserSearchItem
                        key={user.id}
                        onClick={() => handleAddUser(user.id)}
                      >
                        <MemberAvatar>
                          {user.name.charAt(0).toUpperCase()}
                        </MemberAvatar>
                        <UserSearchInfo>
                          <UserSearchName>{user.name}</UserSearchName>
                          {user.email && (
                            <UserSearchEmail>{user.email}</UserSearchEmail>
                          )}
                          <UserSearchRole>
                            {translateUserRole(user.role)}
                          </UserSearchRole>
                        </UserSearchInfo>
                        <AddUserIcon>
                          <MdPersonAdd size={16} />
                        </AddUserIcon>
                      </UserSearchItem>
                    ))
                  )}
                </UsersListContainer>
              )}
            </div>
          </MembersSection>
        </ModalBody>

        <ModalFooter>
          <Button variant='secondary' onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            variant='primary'
            onClick={() => {
              // console.log('🔘 Botão salvar clicado');
              handleSave();
            }}
            disabled={isLoading || !formData.name.trim()}
          >
            <MdSave size={20} />
            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};
